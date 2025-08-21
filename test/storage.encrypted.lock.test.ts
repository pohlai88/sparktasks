import { describe, it, expect, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false,
  });
}
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: webcrypto.subtle,
    writable: false,
    configurable: false,
  });
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: webcrypto.getRandomValues.bind(webcrypto),
    writable: false,
    configurable: false,
  });
}

import { EncryptedDriver } from '../src/storage/encrypted';
import { KeyringProvider } from '../src/crypto/keyring';

// Mock storage driver
class MockStorageDriver {
  public data = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    const keys = Array.from(this.data.keys());
    return keys.filter(key => key.startsWith(prefix));
  }
}

describe('Storage Encrypted with Lock', () => {
  let storage: MockStorageDriver;
  let keyring: KeyringProvider;
  let encrypted: EncryptedDriver;

  beforeEach(async () => {
    storage = new MockStorageDriver();
    keyring = new KeyringProvider(storage, 'test-keyring');
    encrypted = new EncryptedDriver(storage, 'test-data', keyring);

    // Initialize keyring
    await keyring.initNew('test-passphrase', 1000);
  });

  describe('locked state behavior', () => {
    it('should reject getItem when keyring locked', async () => {
      // Store something while unlocked
      await encrypted.setItem('test-key', 'test-value');

      // Lock keyring
      keyring.lock();

      // Should reject getItem (keyring returns null, so EncryptedDriver says "Key not found")
      await expect(encrypted.getItem('test-key')).rejects.toThrow(
        'Key not found'
      );
    });

    it('should reject setItem when keyring locked', async () => {
      // Lock keyring
      keyring.lock();

      // Should reject setItem
      await expect(encrypted.setItem('test-key', 'test-value')).rejects.toThrow(
        'Keyring locked'
      );
    });

    it('should work after unlock', async () => {
      const passphrase = 'test-passphrase';

      // Store while unlocked
      await encrypted.setItem('test-key', 'test-value');

      // Lock
      keyring.lock();

      // Should fail (keyring returns null, so EncryptedDriver says "Key not found")
      await expect(encrypted.getItem('test-key')).rejects.toThrow(
        'Key not found'
      );

      // Unlock
      await keyring.unlock(passphrase);

      // Should work again
      const value = await encrypted.getItem('test-key');
      expect(value).toBe('test-value');
    });

    it('should handle removeItem when locked', async () => {
      // Store something while unlocked
      await encrypted.setItem('test-key', 'test-value');

      // Lock keyring
      keyring.lock();

      // removeItem should still work (doesn't need decryption)
      await expect(encrypted.removeItem('test-key')).resolves.toBeUndefined();
    });

    it('should handle listKeys when locked', async () => {
      // Store something while unlocked
      await encrypted.setItem('test-key', 'test-value');

      // Lock keyring
      keyring.lock();

      // listKeys should still work (doesn't need decryption)
      const keys = await encrypted.listKeys('test-');
      expect(keys).toEqual(['test-key']);
    });
  });

  describe('unlock scenarios', () => {
    it('should maintain encrypted data across lock/unlock cycles', async () => {
      const passphrase = 'test-passphrase';

      // Store multiple items
      await encrypted.setItem('key1', 'value1');
      await encrypted.setItem('key2', 'value2');

      // Lock and unlock
      keyring.lock();
      await keyring.unlock(passphrase);

      // Data should be intact
      expect(await encrypted.getItem('key1')).toBe('value1');
      expect(await encrypted.getItem('key2')).toBe('value2');
    });

    it('should work with key rotation across lock cycles', async () => {
      const passphrase = 'test-passphrase';

      // Store with original key
      await encrypted.setItem('old-key-data', 'old-value');

      // Rotate key
      await keyring.rotate();

      // Store with new key
      await encrypted.setItem('new-key-data', 'new-value');

      // Lock and unlock
      keyring.lock();
      await keyring.unlock(passphrase);

      // Both values should be accessible
      expect(await encrypted.getItem('old-key-data')).toBe('old-value');
      expect(await encrypted.getItem('new-key-data')).toBe('new-value');
    });
  });
});
