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
import { KeyProvider } from '../src/crypto/types';

// Mock storage driver for testing
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

describe('EncryptedDriver AAD verification', () => {
  let mockStorage: MockStorageDriver;
  let keys: MockKeyProvider;
  let driver: EncryptedDriver;

  beforeEach(async () => {
    mockStorage = new MockStorageDriver();
    keys = new MockKeyProvider();
    await keys.generateKey('key1'); // Generate the active key
    driver = new EncryptedDriver(mockStorage, 'test-ns', keys);
  });

  it('should reject envelopes with mismatched AAD', async () => {
    // Store a valid encrypted value
    await driver.setItem('testkey', 'testvalue');

    // Get the stored envelope and tamper with AAD
    const storedEnvelope = mockStorage.data.get('testkey')!;
    const envelope = JSON.parse(storedEnvelope);

    // Tamper with AAD (simulate cross-namespace/key replay attack)
    envelope.aad = 'dGFtcGVyZWQ'; // 'tampered' in base64

    // Store the tampered envelope
    mockStorage.data.set('testkey', JSON.stringify(envelope));

    // Should throw AAD mismatch error
    await expect(driver.getItem('testkey')).rejects.toThrow(/AAD mismatch/);
  });

  it('should accept envelopes with correct AAD', async () => {
    // Store and retrieve - should work normally
    await driver.setItem('testkey', 'testvalue');
    const result = await driver.getItem('testkey');

    expect(result).toBe('testvalue');
  });

  it('should handle legacy envelopes without AAD field', async () => {
    // Create a legacy envelope without AAD field
    await driver.setItem('testkey', 'testvalue');
    const storedEnvelope = mockStorage.data.get('testkey')!;
    const envelope = JSON.parse(storedEnvelope);

    // Remove AAD field to simulate legacy envelope
    delete envelope.aad;
    mockStorage.data.set('testkey', JSON.stringify(envelope));

    // Should still work (legacy compatibility)
    const result = await driver.getItem('testkey');
    expect(result).toBe('testvalue');
  });
});
