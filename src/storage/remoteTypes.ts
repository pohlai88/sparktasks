/**
 * Remote transport interface for syncing storage
 */
export interface RemoteTransport {
  list(
    prefix: string,
    since?: string
  ): Promise<{
    items: Array<{ key: string; value: string; updatedAt: string }>;
    nextSince?: string;
  }>;
  get(key: string): Promise<{ value: string; updatedAt: string } | null>;
  put(key: string, value: string, updatedAt: string): Promise<void>;
  del(key: string, updatedAt: string): Promise<void>;
}

/**
 * Sync state tracking
 */
export interface SyncState {
  sinceToken: string | null;
  lastSyncAt: string | null;
}

/**
 * Queue item for pending operations
 */
export interface QueueItem {
  op: 'put' | 'del';
  key: string;
  value?: string;
  updatedAt: string;
}

/**
 * Remote adapter configuration
 */
export interface RemoteAdapterOptions {
  maxBatch?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  ratePerSec?: number;
  /** Test helper flags to remove timing flakiness (optional, default false) */
  noRateLimit?: boolean;
  noBackoff?: boolean;
}
