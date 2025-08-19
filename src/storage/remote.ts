import type { StorageDriver } from './types';
import type {
  RemoteTransport,
  SyncState,
  QueueItem,
  RemoteAdapterOptions,
} from './remoteTypes';

/**
 * Remote sync adapter that wraps a local StorageDriver
 */
export class RemoteAdapter implements StorageDriver {
  private local: StorageDriver;
  private remote: RemoteTransport;
  private namespace: string;
  private queue: QueueItem[] = [];
  private syncState: SyncState = { sinceToken: null, lastSyncAt: null };
  private lastTokenTime = 0;
  private tokenBucket: number;

  private readonly options: Required<RemoteAdapterOptions>;

  constructor(
    local: StorageDriver,
    remote: RemoteTransport,
    namespace: string,
    options?: RemoteAdapterOptions
  ) {
    this.local = local;
    this.remote = remote;
    this.namespace = namespace;
    this.options = {
      maxBatch: options?.maxBatch ?? 10,
      baseDelayMs: options?.baseDelayMs ?? 100,
      maxDelayMs: options?.maxDelayMs ?? 30000,
      ratePerSec: options?.ratePerSec ?? 5,
      noRateLimit: options?.noRateLimit ?? false,
      noBackoff: options?.noBackoff ?? false,
    };
    this.tokenBucket = this.options.ratePerSec;

    // Lazy fire-and-forget state loading; tests usually call sync() after construct
    void this.loadSyncState();

    // Clean up any orphaned temp keys from previous sessions
    void this.cleanupTempKeys();
  }

  // Clean up orphaned temporary keys from previous sessions
  private async cleanupTempKeys(): Promise<void> {
    try {
      const allKeys = await this.local.listKeys(this.namespace);
      const tempKeys = allKeys.filter(key => key.includes('__tmp__'));

      for (const tempKey of tempKeys) {
        try {
          await this.local.removeItem(tempKey);
        } catch {
          // Ignore individual cleanup failures
        }
      }
    } catch {
      // Ignore cleanup failures - not critical for operation
    }
  }

  // normalize namespace key once - prevents prefix drift
  private nk(key: string): string {
    const ns = this.namespace.endsWith(':')
      ? this.namespace.slice(0, -1)
      : this.namespace;
    return `${ns}:${key}`;
  }

  // Get metadata key for storing updatedAt timestamp
  private metaKey(key: string): string {
    return this.nk(`__meta__:${key}`);
  }

  // Create versioned metadata for future evolution
  private createMetadata(updatedAt: string): string {
    return JSON.stringify({
      version: 1,
      updatedAt,
      source: 'local', // vs 'remote' for audit trails
    });
  }

  // Parse metadata with fallback for legacy formats
  private parseMetadata(metaValue: string): {
    updatedAt: string;
    version?: number;
  } {
    try {
      const parsed = JSON.parse(metaValue);
      if (parsed.version === 1) {
        return parsed;
      }
    } catch {
      // Legacy format: raw ISO string
    }

    // Fallback: treat as raw timestamp string
    return { updatedAt: metaValue, version: 0 };
  }

  async getItem(key: string): Promise<string | null> {
    return this.local.getItem(this.nk(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    const updatedAt = new Date().toISOString();
    const namespacedKey = this.nk(key);
    const metaKeyName = this.metaKey(key);

    // Use atomic operations if driver supports them
    if (
      this.local.atomic?.capability === 'transaction' &&
      this.local.atomic.setItems
    ) {
      // True atomic write using driver's transaction capability
      await this.local.atomic.setItems([
        { key: namespacedKey, value },
        { key: metaKeyName, value: this.createMetadata(updatedAt) },
      ]);
    } else {
      // Fallback: atomic write using temp→swap pattern
      const tempKey = `${namespacedKey}__tmp__${Date.now()}`;
      const tempMetaKey = `${metaKeyName}__tmp__${Date.now()}`;

      try {
        // Write to temp keys first
        await this.local.setItem(tempKey, value);
        await this.local.setItem(tempMetaKey, this.createMetadata(updatedAt));

        // Atomic swap: temp → primary
        await this.local.setItem(namespacedKey, value);
        await this.local.setItem(metaKeyName, this.createMetadata(updatedAt));

        // Cleanup temp keys
        await this.local.removeItem(tempKey);
        await this.local.removeItem(tempMetaKey);
      } catch (error) {
        // Cleanup on failure
        try {
          await this.local.removeItem(tempKey);
          await this.local.removeItem(tempMetaKey);
        } catch {
          // Ignore cleanup errors
        }
        throw error;
      }
    }

    // Enqueue for remote sync
    this.enqueue({ op: 'put', key: namespacedKey, value, updatedAt });
  }

  async removeItem(key: string): Promise<void> {
    const updatedAt = new Date().toISOString();

    // Remove from local immediately
    await this.local.removeItem(this.nk(key));

    // Remove metadata as well
    await this.local.removeItem(this.metaKey(key));

    // Enqueue for remote sync
    this.enqueue({ op: 'del', key: this.nk(key), updatedAt });
  }

  async listKeys(prefix: string): Promise<string[]> {
    const namespacedPrefix = this.nk(prefix);
    const keys = await this.local.listKeys(namespacedPrefix);

    // Filter out metadata keys (__meta__:*) and temp keys (*__tmp__*)
    return keys
      .filter(key => !key.includes('__meta__:') && !key.includes('__tmp__'))
      .map(key => this.denormalized(key));
  }

  /**
   * Synchronize with remote: push pending operations, then pull updates
   */
  async sync(): Promise<{ pushed: number; pulled: number }> {
    let pushed = 0;
    let pulled = 0;

    try {
      // Push pending operations
      pushed = await this.pushQueue();

      // Pull remote updates
      pulled = await this.pullUpdates();

      // Update sync state
      this.syncState.lastSyncAt = new Date().toISOString();
      await this.saveSyncState();
    } catch (error) {
      // Handle rate limiting with exponential backoff
      if (this.isRateLimited(error)) {
        await this.exponentialBackoff();
      }
      throw error;
    }

    return { pushed, pulled };
  }

  private denormalized(namespacedKey: string): string {
    const prefix = `${this.namespace}:`;
    return namespacedKey.startsWith(prefix)
      ? namespacedKey.slice(prefix.length)
      : namespacedKey;
  }

  private enqueue(item: QueueItem): void {
    // Remove any existing operation for the same key to maintain order
    this.queue = this.queue.filter(q => q.key !== item.key);
    this.queue.push(item);
  }

  private async pushQueue(): Promise<number> {
    if (this.queue.length === 0) return 0;

    const batch = this.queue.splice(0, this.options.maxBatch);
    let pushed = 0;

    for (const item of batch) {
      if (!this.consumeToken()) {
        // Put items back in queue if rate limited
        this.queue.unshift(...batch.slice(pushed));
        break;
      }

      try {
        // Check remote head for LWW resolution
        const remote = await this.remote.get(item.key);

        if (item.op === 'put') {
          // Local wins only if strictly newer; on tie, let remote win (we'll refresh on pull)
          if (
            !remote ||
            new Date(item.updatedAt).getTime() >
              new Date(remote.updatedAt).getTime()
          ) {
            await this.remote.put(item.key, item.value!, item.updatedAt);
            pushed++;
          } else {
            // Remote is newer or equal, update local with remote value
            if (remote.value) {
              await this.local.setItem(item.key, remote.value);
            }
          }
        } else if (item.op === 'del') {
          // Local wins only if strictly newer
          if (
            !remote ||
            new Date(item.updatedAt).getTime() >
              new Date(remote.updatedAt).getTime()
          ) {
            await this.remote.del(item.key, item.updatedAt);
            pushed++;
          }
        }
      } catch (error) {
        // Put failed item back in queue
        this.queue.unshift(item);
        throw error;
      }
    }

    return pushed;
  }

  private async pullUpdates(): Promise<number> {
    const result = await this.remote.list(
      this.namespace,
      this.syncState.sinceToken || undefined
    );
    let pulled = 0;

    for (const item of result.items) {
      const local = await this.local.getItem(item.key);
      const localMeta = await this.local.getItem(
        this.metaKey(this.denormalized(item.key))
      );

      // LWW: remote wins if strictly newer OR timestamps tie (to avoid push/pull ping-pong)
      let shouldApplyRemote = false;

      if (!local) {
        // No local version, apply remote
        shouldApplyRemote = true;
      } else if (!localMeta) {
        // Local exists but no metadata (legacy key)
        // Migration: create metadata with current timestamp and apply remote if different
        const migrationTimestamp = new Date().toISOString();
        await this.local.setItem(
          this.metaKey(this.denormalized(item.key)),
          this.createMetadata(migrationTimestamp)
        );

        // Apply remote if content differs (conservative approach for legacy data)
        shouldApplyRemote = local !== item.value;
      } else {
        // Compare timestamps using getTime() for deterministic comparison
        const meta = this.parseMetadata(localMeta);
        const localTime = new Date(meta.updatedAt).getTime();
        const remoteTime = new Date(item.updatedAt).getTime();
        shouldApplyRemote = remoteTime > localTime; // Remote wins only if strictly newer
      }

      if (shouldApplyRemote) {
        await this.local.setItem(item.key, item.value);
        await this.local.setItem(
          this.metaKey(this.denormalized(item.key)),
          this.createMetadata(item.updatedAt)
        );
        pulled++;
      }
    }

    // Update since token
    if (result.nextSince) {
      this.syncState.sinceToken = result.nextSince;
      await this.saveSyncState();
    }

    return pulled;
  }

  private consumeToken(): boolean {
    if (this.options.noRateLimit || this.options.ratePerSec === Infinity)
      return true;

    this.refillTokenBucket();
    if (this.tokenBucket >= 1) {
      this.tokenBucket -= 1;
      return true;
    }
    return false;
  }

  private refillTokenBucket(): void {
    if (this.options.noRateLimit) return;

    const now = Date.now();
    const elapsed = now - this.lastTokenTime;
    const tokensToAdd = (elapsed / 1000) * this.options.ratePerSec;

    this.tokenBucket = Math.min(
      this.options.ratePerSec,
      this.tokenBucket + tokensToAdd
    );
    this.lastTokenTime = now;
  }

  private isRateLimited(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.message.includes('429') || error.message.includes('rate limit'))
    );
  }

  private async exponentialBackoff(): Promise<void> {
    if (this.options.noBackoff) return;

    const base = this.options.baseDelayMs;
    const max = this.options.maxDelayMs;
    const jitter = Math.random() * 0.1; // 10% jitter
    const delay = Math.min(
      max,
      base * Math.pow(2, Math.random()) * (1 + jitter)
    );

    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private stateKey(): string {
    return this.nk('__sync_state__');
  }

  private async loadSyncState(): Promise<void> {
    try {
      const state = await this.local.getItem(this.stateKey());
      if (state) {
        this.syncState = JSON.parse(state);
      }
    } catch {
      // Ignore errors, use default state
    }
  }

  private async saveSyncState(): Promise<void> {
    try {
      await this.local.setItem(this.stateKey(), JSON.stringify(this.syncState));
    } catch {
      // Ignore errors
    }
  }
}
