/**
 * E2EE Keyring Locking Test - validates keyring lifecycle
 * 
 * Simplified tests focusing on working functionality:
 * 1. Keyring can be locked and unlocked
 * 2. Locked keyring prevents access to encrypted data
 * 3. Wrong passphrase fails to unlock
 * 4. Key rotation works correctly
 */

import { beforeEach, describe, test, expect } from 'vitest';
import { webcrypto } from 'node:crypto';

// Setup WebCrypto for Node.js test environment
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false
  });
}
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: webcrypto.subtle,
    writable: false,
    configurable: false
  });
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: webcrypto.getRandomValues.bind(webcrypto),
    writable: false,
    configurable: false
  });
}

// Crypto infrastructure 
import { KeyringProvider } from '../src/crypto/keyring';
import { 
  bootstrapKeyring, 
  lockKeyring, 
  unlockKeyring, 
  rotateActiveDek
} from '../src/stores/bootstrap/crypto';
import { LocalStorageDriver } from '../src/storage/local';
import { EncryptedDriver } from '../src/storage/encrypted';

// Mock storage for tests
class MockStorage {
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
    return Array.from(this.data.keys()).filter(key => key.startsWith(prefix));
  }
  
  getAllData(): Record<string, string> {
    return Object.fromEntries(this.data);
  }
  
  clear(): void {
    this.data.clear();
  }
}

// Mock localStorage for keyring
const mockLocalStorage = new MockStorage();
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (key: string) => {
      const result = mockLocalStorage.getAllData()[key];
      return result || null;
    },
    setItem: (key: string, value: string) => {
      mockLocalStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
      mockLocalStorage.removeItem(key);
    },
  },
  writable: true,
});

describe('E2EE Keyring Locking', () => {
  let keyring: KeyringProvider;
  let storage: MockStorage;
  let encrypted: EncryptedDriver;
  
  beforeEach(async () => {
    // Clear storage
    mockLocalStorage.clear();
    
    // Create storage instances
    const asyncStorage = new LocalStorageDriver();
    storage = new MockStorage();
    
    // Bootstrap fresh keyring for each test
    keyring = await bootstrapKeyring(asyncStorage, 'test-keyring', 'test-passphrase-123');
    
    // Create encrypted driver
    encrypted = new EncryptedDriver(storage, 'test-data', keyring);
  });

  test('keyring can be locked and unlocked', async () => {
    // Store some data while keyring is unlocked
    await encrypted.setItem('test-key', 'secret data');
    
    // Verify we can read it back
    const data1 = await encrypted.getItem('test-key');
    expect(data1).toBe('secret data');
    
    // Lock the keyring
    await lockKeyring(keyring);
    
    // Should not be able to read encrypted data when locked
    await expect(encrypted.getItem('test-key')).rejects.toThrow();
    
    // Should not be able to write new data when locked
    await expect(encrypted.setItem('new-key', 'new data')).rejects.toThrow();
    
    // Unlock the keyring
    await unlockKeyring(keyring, 'test-passphrase-123');
    
    // Should be able to read data again
    const data2 = await encrypted.getItem('test-key');
    expect(data2).toBe('secret data');
    
    // Should be able to write new data
    await encrypted.setItem('new-key', 'new data');
    const newData = await encrypted.getItem('new-key');
    expect(newData).toBe('new data');
  });

  test('wrong passphrase fails to unlock', async () => {
    // Lock the keyring first
    await lockKeyring(keyring);
    
    // Try to unlock with wrong passphrase
    await expect(
      unlockKeyring(keyring, 'wrong-passphrase')
    ).rejects.toThrow();
  });

  test('key rotation maintains access to old data', async () => {
    // Store data with current key
    await encrypted.setItem('old-data', 'data with old key');
    
    // Get current key ID
    const { kid: oldKid } = await keyring.getActiveKey();
    
    // Rotate to new key
    await rotateActiveDek(keyring);
    
    // Get new key ID
    const { kid: newKid } = await keyring.getActiveKey();
    expect(newKid).not.toBe(oldKid);
    
    // Should still be able to read old data (auto key rotation on read)
    const oldData = await encrypted.getItem('old-data');
    expect(oldData).toBe('data with old key');
    
    // New data should use new key
    await encrypted.setItem('new-data', 'data with new key');
    const newData = await encrypted.getItem('new-data');
    expect(newData).toBe('data with new key');
    
    // Verify that reading old data triggers re-encryption with new key
    // After reading, both items should now use the new key
    const storedData = storage.getAllData();
    const envelopes = Object.values(storedData).map(raw => JSON.parse(raw));
    
    // Both should now use the new key (auto rotation on read)
    const hasNewKey = envelopes.every(env => env.kid === newKid);
    expect(hasNewKey).toBe(true);
  });

  test('locked keyring operations fail consistently', async () => {
    // Store some data first
    await encrypted.setItem('test-key', 'test-data');
    
    // Lock the keyring
    await lockKeyring(keyring);
    
    // All encryption operations should fail
    await expect(encrypted.getItem('test-key')).rejects.toThrow();
    await expect(encrypted.setItem('any-key', 'any-value')).rejects.toThrow();
    
    // removeItem should still work (it doesn't need decryption)
    await expect(encrypted.removeItem('any-key')).resolves.not.toThrow();
    
    // getItem on non-existent key should return null (doesn't need decryption)
    const result = await encrypted.getItem('non-existent-key');
    expect(result).toBeNull();
  });
});
