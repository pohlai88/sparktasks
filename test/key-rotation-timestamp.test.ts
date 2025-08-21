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

// Mock key provider for testing key rotation scenario
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

describe('Key Rotation with Timestamp Preservation', () => {
  let mockStorage: MockStorageDriver;
  let keys: MockKeyProvider;
  let driver: EncryptedDriver;

  beforeEach(async () => {
    mockStorage = new MockStorageDriver();
    keys = new MockKeyProvider();
    await keys.generateKey('key1');
    await keys.generateKey('key2');
    driver = new EncryptedDriver(mockStorage, 'test-ns', keys);
  });

  it('should preserve timestamp during lazy key rotation', async () => {
    // 1. Store with key1
    await driver.setItem('testkey', 'testvalue');
    const originalEnvelope = JSON.parse(mockStorage.data.get('testkey')!);
    const originalTimestamp = originalEnvelope.ts;

    // 2. Rotate to key2
    keys.setActiveKid('key2');

    // 3. Read triggers lazy rotation
    const value = await driver.getItem('testkey');
    expect(value).toBe('testvalue');

    // 4. Check that timestamp was preserved
    const rotatedEnvelope = JSON.parse(mockStorage.data.get('testkey')!);
    expect(rotatedEnvelope.kid).toBe('key2'); // Key rotated
    expect(rotatedEnvelope.ts).toBe(originalTimestamp); // Timestamp preserved
  });

  it('should rotate key but maintain LWW ordering', async () => {
    // This test verifies that key rotation doesn't affect Last-Write-Wins logic
    // by ensuring timestamps are preserved during rotation

    const now = new Date();
    const later = new Date(now.getTime() + 5000); // 5 seconds later

    // Store value at time T
    await driver.setItem('testkey', 'value1');
    const envelope1 = JSON.parse(mockStorage.data.get('testkey')!);

    // Simulate time passing and key rotation
    keys.setActiveKid('key2');

    // Read at time T+5 (triggers rotation)
    await driver.getItem('testkey');
    const rotatedEnvelope = JSON.parse(mockStorage.data.get('testkey')!);

    // Verify: rotated envelope has same timestamp as original
    // This ensures LWW comparisons remain valid
    expect(rotatedEnvelope.ts).toBe(envelope1.ts);
    expect(new Date(rotatedEnvelope.ts).getTime()).toBeLessThan(
      later.getTime()
    );
  });
});
