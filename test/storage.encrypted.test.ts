import { describe, it, expect, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js immediately
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

import { EncryptedDriver } from '../src/storage/encrypted.js';
import { KeyProvider } from '../src/crypto/types.js';

// Mock storage driver for testing
class MockStorageDriver {
  private data = new Map<string, string>();

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

  clear(): void {
    this.data.clear();
  }

  getData(): Map<string, string> {
    return new Map(this.data);
  }
}

// Mock key provider for testing
class MockKeyProvider implements KeyProvider {
  private keys = new Map<string, CryptoKey>();
  private activeKid = 'key1';

  async generateKey(kid: string): Promise<CryptoKey> {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    this.keys.set(kid, key);
    return key;
  }

  async getActiveKey(): Promise<{ kid: string; key: CryptoKey }> {
    const key = this.keys.get(this.activeKid);
    if (!key) {
      throw new Error(`Active key not found: ${this.activeKid}`);
    }
    return { kid: this.activeKid, key };
  }

  async getByKid(kid: string): Promise<CryptoKey | null> {
    return this.keys.get(kid) || null;
  }

  setActiveKid(kid: string): void {
    this.activeKid = kid;
  }
}

describe('EncryptedDriver', () => {
  let mockStorage: MockStorageDriver;
  let keyProvider: MockKeyProvider;
  let encryptedDriver: EncryptedDriver;

  beforeEach(async () => {
    mockStorage = new MockStorageDriver();
    keyProvider = new MockKeyProvider();
    await keyProvider.generateKey('key1');
    encryptedDriver = new EncryptedDriver(mockStorage, 'test', keyProvider);
  });

  describe('round-trip encryption', () => {
    it('should encrypt and decrypt values correctly', async () => {
      const key = 'testKey';
      const value = 'Hello, encrypted world!';

      await encryptedDriver.setItem(key, value);
      const retrieved = await encryptedDriver.getItem(key);

      expect(retrieved).toBe(value);
    });

    it('should store values as encrypted envelopes', async () => {
      const key = 'testKey';
      const value = 'secret data';

      await encryptedDriver.setItem(key, value);
      const rawValue = await mockStorage.getItem(key);

      expect(rawValue).toBeTruthy();
      const envelope = JSON.parse(rawValue!);
      expect(envelope.v).toBe(1);
      expect(envelope.alg).toBe('AES-GCM');
      expect(envelope.kid).toBe('key1');
      expect(envelope.iv).toBeTruthy();
      expect(envelope.ct).toBeTruthy();
      expect(envelope.aad).toBeTruthy();
      expect(envelope.ts).toBeTruthy();
    });
  });

  describe('tamper detection', () => {
    it('should throw when ciphertext is tampered', async () => {
      const key = 'testKey';
      const value = 'sensitive data';

      await encryptedDriver.setItem(key, value);

      // Tamper with the ciphertext
      const rawValue = await mockStorage.getItem(key);
      const envelope = JSON.parse(rawValue!);
      envelope.ct = envelope.ct.substring(0, envelope.ct.length - 1) + 'X';

      await mockStorage.setItem(key, JSON.stringify(envelope));

      await expect(encryptedDriver.getItem(key)).rejects.toThrow();
    });

    it('should throw when IV is tampered', async () => {
      const key = 'testKey';
      const value = 'sensitive data';

      await encryptedDriver.setItem(key, value);

      // Tamper with the IV
      const rawValue = await mockStorage.getItem(key);
      const envelope = JSON.parse(rawValue!);
      envelope.iv = envelope.iv.substring(0, envelope.iv.length - 1) + 'X';

      await mockStorage.setItem(key, JSON.stringify(envelope));

      await expect(encryptedDriver.getItem(key)).rejects.toThrow();
    });
  });

  describe('key management', () => {
    it('should throw when key is not found', async () => {
      const key = 'testKey';
      const value = 'test data';

      await encryptedDriver.setItem(key, value);

      // Modify envelope to use non-existent key
      const rawValue = await mockStorage.getItem(key);
      const envelope = JSON.parse(rawValue!);
      envelope.kid = 'nonexistent';

      await mockStorage.setItem(key, JSON.stringify(envelope));

      await expect(encryptedDriver.getItem(key)).rejects.toThrow(
        'Key not found: nonexistent'
      );
    });

    it('should handle key rotation on read', async () => {
      const key = 'testKey';
      const value = 'data to rotate';

      // Store with key1
      await encryptedDriver.setItem(key, value);

      // Generate key2 and make it active
      await keyProvider.generateKey('key2');
      keyProvider.setActiveKid('key2');

      // Read should trigger re-encryption with key2
      const retrieved = await encryptedDriver.getItem(key);
      expect(retrieved).toBe(value);

      // Verify it was re-encrypted with key2
      const rawValue = await mockStorage.getItem(key);
      const envelope = JSON.parse(rawValue!);
      expect(envelope.kid).toBe('key2');
    });
  });

  describe('legacy compatibility', () => {
    it('should return plaintext values as-is', async () => {
      const key = 'legacyKey';
      const value = 'legacy plaintext';

      // Store plaintext directly
      await mockStorage.setItem(key, value);

      const retrieved = await encryptedDriver.getItem(key);
      expect(retrieved).toBe(value);
    });

    it('should return invalid JSON as-is', async () => {
      const key = 'invalidKey';
      const value = 'not valid json {';

      await mockStorage.setItem(key, value);

      const retrieved = await encryptedDriver.getItem(key);
      expect(retrieved).toBe(value);
    });

    it('should not auto-encrypt legacy values until next write', async () => {
      const key = 'legacyKey';
      const value = 'legacy value';

      // Store plaintext
      await mockStorage.setItem(key, value);

      // Read should return plaintext
      const retrieved1 = await encryptedDriver.getItem(key);
      expect(retrieved1).toBe(value);

      // Should still be plaintext in storage
      const rawValue1 = await mockStorage.getItem(key);
      expect(rawValue1).toBe(value);

      // Write new value
      await encryptedDriver.setItem(key, 'new encrypted value');

      // Should now be encrypted
      const rawValue2 = await mockStorage.getItem(key);
      expect(() => JSON.parse(rawValue2!)).not.toThrow();
    });
  });

  describe('storage operations', () => {
    it('should pass through listKeys', async () => {
      await encryptedDriver.setItem('test1', 'value1');
      await encryptedDriver.setItem('test2', 'value2');
      await encryptedDriver.setItem('other', 'value3');

      const keys = await encryptedDriver.listKeys('test');
      expect(keys).toContain('test1');
      expect(keys).toContain('test2');
      expect(keys).not.toContain('other');
    });

    it('should pass through removeItem', async () => {
      const key = 'testKey';
      const value = 'test value';

      await encryptedDriver.setItem(key, value);
      expect(await encryptedDriver.getItem(key)).toBe(value);

      await encryptedDriver.removeItem(key);
      expect(await encryptedDriver.getItem(key)).toBeNull();
      expect(await mockStorage.getItem(key)).toBeNull();
    });

    it('should return null for non-existent keys', async () => {
      const result = await encryptedDriver.getItem('nonexistent');
      expect(result).toBeNull();
    });
  });
});
