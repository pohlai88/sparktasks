/**
 * Headless keyring with passphrase-derived KEK for DEK management
 */

import { toB64u, fromB64u } from './base64url';
import { type KeyringState, type BackupBundle } from './keyringTypes';
import { deriveKEK, genSalt } from './pbkdf2';
import { type KeyProvider } from './types';

interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * KeyringProvider - headless keyring implementing KeyProvider interface
 * Manages DEKs wrapped by passphrase-derived KEK using PBKDF2 + AES-KW
 */
export class KeyringProvider implements KeyProvider {
  private storage: StorageDriver;
  private storageKey: string;

  // In-memory state (cleared on lock)
  private state: KeyringState | null = null;
  private kek: CryptoKey | null = null;
  private deks = new Map<string, CryptoKey>(); // kid -> unwrapped DEK
  private wrappedDeks = new Map<string, string>(); // kid -> base64u wrapped DEK

  constructor(storage: StorageDriver, namespace: string) {
    this.storage = storage;
    this.storageKey = `__keyring__:${namespace}`;
  }

  /**
   * Initialize new keyring with first DEK
   */
  async initNew(passphrase: string, iterations = 200_000): Promise<void> {
    if (this.state) {
      throw new Error('Keyring already initialized');
    }

    const salt = genSalt();
    const saltBuffer = [...salt.buffer] as ArrayBuffer;
    const kek = await deriveKEK(passphrase, saltBuffer, iterations);

    // Generate first DEK
    const dek = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true, // extractable for wrapping
      ['encrypt', 'decrypt']
    );

    const kid = crypto.randomUUID();

    // Wrap DEK with KEK
    const wrappedDek = await crypto.subtle.wrapKey('raw', dek, kek, 'AES-KW');
    const wrappedB64u = toB64u(wrappedDek);

    // Set up state
    this.state = {
      activeKid: kid,
      locked: false,
      meta: {
        saltB64u: toB64u(saltBuffer),
        iter: iterations,
      },
    };

    this.kek = kek;
    this.deks.set(kid, dek);
    this.wrappedDeks.set(kid, wrappedB64u);

    await this.persist();
  }

  /**
   * Unlock keyring with passphrase
   */
  async unlock(passphrase: string): Promise<void> {
    const stored = await this.storage.getItem(this.storageKey);
    if (!stored) {
      throw new Error('Keyring not found');
    }

    const data = JSON.parse(stored);
    const state: KeyringState = data.state;
    const wrappedDeks: Record<string, string> = data.wrappedDeks;

    // Derive KEK from passphrase
    const salt = fromB64u(state.meta.saltB64u);
    const kek = await deriveKEK(passphrase, salt, state.meta.iter);

    // Try to unwrap active DEK to verify passphrase
    if (state.activeKid) {
      const wrappedB64u = wrappedDeks[state.activeKid];
      if (!wrappedB64u) {
        throw new Error('Active DEK not found');
      }

      try {
        const wrapped = fromB64u(wrappedB64u);
        await crypto.subtle.unwrapKey(
          'raw',
          wrapped,
          kek,
          'AES-KW',
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      } catch {
        throw new Error('Invalid passphrase');
      }
    }

    // Passphrase verified - load state
    this.state = { ...state, locked: false };
    this.kek = kek;
    this.wrappedDeks.clear();
    for (const [kid, wrapped] of Object.entries(wrappedDeks)) {
      this.wrappedDeks.set(kid, wrapped);
    }
    this.deks.clear(); // DEKs unwrapped on demand
  }

  /**
   * Lock keyring (clear sensitive data from memory)
   */
  lock(): void {
    if (this.state) {
      this.state.locked = true;
    }
    this.kek = null;
    this.deks.clear();
  }

  /**
   * Rotate to new DEK
   */
  async rotate(): Promise<void> {
    if (!this.state || this.state.locked) {
      throw new Error('Keyring locked');
    }
    if (!this.kek) {
      throw new Error('KEK not available');
    }

    // Generate new DEK
    const dek = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const kid = crypto.randomUUID();

    // Wrap with current KEK
    const wrappedDek = await crypto.subtle.wrapKey(
      'raw',
      dek,
      this.kek,
      'AES-KW'
    );
    const wrappedB64u = toB64u(wrappedDek);

    // Update state
    this.state.activeKid = kid;
    this.deks.set(kid, dek);
    this.wrappedDeks.set(kid, wrappedB64u);

    await this.persist();
  }

  /**
   * Get active DEK (KeyProvider interface)
   */
  async getActiveKey(): Promise<{ kid: string; key: CryptoKey }> {
    if (!this.state || this.state.locked) {
      throw new Error('Keyring locked');
    }
    if (!this.state.activeKid) {
      throw new Error('No active key');
    }

    const kid = this.state.activeKid;
    let dek = this.deks.get(kid);

    if (!dek) {
      // Unwrap DEK on demand
      dek = await this.unwrapDek(kid);
      this.deks.set(kid, dek);
    }

    return { kid, key: dek };
  }

  /**
   * Get DEK by kid (KeyProvider interface)
   */
  async getByKid(kid: string): Promise<CryptoKey | null> {
    if (!this.state || this.state.locked) {
      return null;
    }

    let dek = this.deks.get(kid);

    if (!dek && this.wrappedDeks.has(kid)) {
      try {
        dek = await this.unwrapDek(kid);
        this.deks.set(kid, dek);
      } catch {
        return null;
      }
    }

    return dek || null;
  }

  /**
   * Export backup bundle
   */
  async exportBackup(): Promise<BackupBundle> {
    if (!this.state || this.state.locked) {
      throw new Error('Keyring locked');
    }

    const deks = [...this.wrappedDeks.entries()].map(([kid, wrapped]) => ({
      kid,
      wrapped,
    }));

    return {
      v: 1,
      createdAt: new Date().toISOString(),
      meta: {
        saltB64u: this.state.meta.saltB64u,
        iter: this.state.meta.iter,
      },
      deks,
    };
  }

  /**
   * Import backup bundle (adds DEKs to current keyring)
   */
  async importBackup(bundle: BackupBundle, passphrase?: string): Promise<void> {
    if (!this.state || this.state.locked) {
      throw new Error('Keyring locked');
    }
    if (bundle.v !== 1) {
      throw new Error('Unsupported backup version');
    }

    // Validate meta if present
    if (
      bundle.meta &&
      (!bundle.meta.saltB64u ||
        typeof bundle.meta.iter !== 'number' ||
        bundle.meta.iter < 1)
    ) {
      throw new Error('Invalid KEK metadata in backup');
    }

    // If bundle meta present and doesn't match current KEK params,
    // require passphrase to derive the source KEK to unwrap then re-wrap with current KEK.
    const needsRewrap =
      !!bundle.meta &&
      (bundle.meta.saltB64u !== this.state.meta.saltB64u ||
        bundle.meta.iter !== this.state.meta.iter);

    if (needsRewrap) {
      if (!passphrase)
        throw new Error('Passphrase required to import portable backup');

      try {
        const srcSalt = fromB64u(bundle.meta!.saltB64u);
        const srcKEK = await deriveKEK(passphrase, srcSalt, bundle.meta!.iter);
        if (!this.kek) throw new Error('KEK not available');

        // unwrap each DEK with srcKEK, then re-wrap with current KEK
        for (const { kid, wrapped } of bundle.deks) {
          if (this.wrappedDeks.has(kid)) continue;
          const wrappedBytes = fromB64u(wrapped);
          const dek = await crypto.subtle.unwrapKey(
            'raw',
            wrappedBytes,
            srcKEK,
            'AES-KW',
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
          );
          const rewrapped = await crypto.subtle.wrapKey(
            'raw',
            dek,
            this.kek,
            'AES-KW'
          );
          this.wrappedDeks.set(kid, toB64u(rewrapped));
        }
      } catch (error) {
        throw new Error(
          `Failed to import portable backup: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    } else {
      // Same KEK params — store as-is
      for (const { kid, wrapped } of bundle.deks) {
        if (!this.wrappedDeks.has(kid)) this.wrappedDeks.set(kid, wrapped);
      }
    }

    await this.persist();
  }

  /**
   * Unwrap a DEK by kid
   */
  private async unwrapDek(kid: string): Promise<CryptoKey> {
    if (!this.kek) {
      throw new Error('KEK not available');
    }

    const wrappedB64u = this.wrappedDeks.get(kid);
    if (!wrappedB64u) {
      throw new Error(`DEK not found: ${kid}`);
    }

    const wrapped = fromB64u(wrappedB64u);
    return await crypto.subtle.unwrapKey(
      'raw',
      wrapped,
      this.kek,
      'AES-KW',
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Persist keyring state to storage
   */
  private async persist(): Promise<void> {
    if (!this.state) {
      throw new Error('No state to persist');
    }

    const wrappedDeks: Record<string, string> = {};
    for (const [kid, wrapped] of this.wrappedDeks.entries()) {
      wrappedDeks[kid] = wrapped;
    }

    const data = {
      state: this.state,
      wrappedDeks,
    };

    await this.storage.setItem(this.storageKey, JSON.stringify(data));
  }
}
