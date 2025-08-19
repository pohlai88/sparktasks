import type { StorageDriver } from './types';

/**
 * LocalStorage adapter implementing StorageDriver interface
 */
export class LocalStorageDriver implements StorageDriver {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }
}

/**
 * Synchronous wrapper for backwards compatibility
 */
export class SyncLocalStorageDriver {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  listKeys(prefix: string): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }
}

/**
 * Namespacing helper for storage keys
 */
export function createNamespace(
  prefix: string,
  driver: SyncLocalStorageDriver
) {
  const cleanPrefix = prefix.replace(/:+$/, '');
  const ns = (key: string) => `${cleanPrefix}:${key}`;

  return {
    prefix: cleanPrefix,
    driver,
    getItem: (key: string) => driver.getItem(ns(key)),
    setItem: (key: string, value: string) => driver.setItem(ns(key), value),
    removeItem: (key: string) => driver.removeItem(ns(key)),
    listKeys: (keyPrefix: string = '') => driver.listKeys(ns(keyPrefix)),
  };
}
