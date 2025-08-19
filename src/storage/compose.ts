/**
 * Storage composition helpers for encrypted drivers
 */

import { StorageDriver } from './types';
import { EncryptedDriver } from './encrypted';
import { KeyringProvider } from '../crypto/keyring';

/**
 * Compose EncryptedDriver around another storage driver
 */
export function composeEncrypted(
  inner: StorageDriver,
  namespace: string,
  keyring: KeyringProvider
): EncryptedDriver {
  return new EncryptedDriver(inner, namespace, keyring);
}

/**
 * Create multi-namespace encrypted storage composition
 */
export function composeMultiNamespace(
  inner: StorageDriver,
  keyring: KeyringProvider,
  namespaces: string[]
): Record<string, EncryptedDriver> {
  const drivers: Record<string, EncryptedDriver> = {};
  for (const ns of namespaces) {
    drivers[ns] = new EncryptedDriver(inner, ns, keyring);
  }
  return drivers;
}

/**
 * Synchronous wrapper for EncryptedDriver
 *
 * Bridges async EncryptedDriver to sync eventlog requirements.
 * Uses busy-wait to convert async operations to sync (not ideal but needed for compatibility).
 *
 * Implements the same interface as SyncLocalStorageDriver for createNamespace compatibility.
 */
export class SyncEncryptedDriver {
  constructor(private encrypted: EncryptedDriver) {}

  getItem(key: string): string | null {
    // Convert async to sync using busy wait
    let result: string | null = null;
    let error: Error | null = null;
    let completed = false;

    this.encrypted.getItem(key).then(
      value => {
        result = value;
        completed = true;
      },
      err => {
        error = err;
        completed = true;
      }
    );

    // Busy wait for completion (not ideal, but needed for sync compatibility)
    const start = Date.now();
    while (!completed && Date.now() - start < 5000) {
      // Spin until promise resolves or 5s timeout
    }

    if (error) throw error;
    if (!completed) throw new Error('getItem timed out');
    return result;
  }

  setItem(key: string, value: string): void {
    let completed = false;
    let error: Error | null = null;

    this.encrypted.setItem(key, value).then(
      () => {
        completed = true;
      },
      err => {
        error = err;
        completed = true;
      }
    );

    // Busy wait for completion
    const start = Date.now();
    while (!completed && Date.now() - start < 5000) {
      // Spin until promise resolves or 5s timeout
    }

    if (error) throw error;
    if (!completed) throw new Error('setItem timed out');
  }

  removeItem(key: string): void {
    let completed = false;
    let error: Error | null = null;

    this.encrypted.removeItem(key).then(
      () => {
        completed = true;
      },
      err => {
        error = err;
        completed = true;
      }
    );

    // Busy wait for completion
    const start = Date.now();
    while (!completed && Date.now() - start < 5000) {
      // Spin until promise resolves or 5s timeout
    }

    if (error) throw error;
    if (!completed) throw new Error('removeItem timed out');
  }

  listKeys(prefix: string): string[] {
    let result: string[] | null = null;
    let error: Error | null = null;
    let completed = false;

    this.encrypted.listKeys(prefix).then(
      keys => {
        result = keys;
        completed = true;
      },
      err => {
        error = err;
        completed = true;
      }
    );

    // Busy wait for completion
    const start = Date.now();
    while (!completed && Date.now() - start < 5000) {
      // Spin until promise resolves or 5s timeout
    }

    if (error) throw error;
    if (!completed) throw new Error('listKeys timed out');
    return result || [];
  }
}
