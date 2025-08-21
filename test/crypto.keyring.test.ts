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
}

describe('Crypto Keyring', () => {
  let storage: MockStorageDriver;
  let keyring: KeyringProvider;

  beforeEach(() => {
    storage = new MockStorageDriver();
    keyring = new KeyringProvider(storage, 'test-ns');
  });

  describe('initNew/unlock/lock', () => {
    it('should initialize new keyring and unlock/lock', async () => {
      const passphrase = 'test-passphrase-123';

      // Initialize new keyring
      await keyring.initNew(passphrase, 1000); // Low iterations for tests

      // Should have active key
      const activeKey = await keyring.getActiveKey();
      expect(activeKey.kid).toBeTruthy();
      expect(activeKey.key).toBeTruthy();

      // Lock keyring
      keyring.lock();

      // Should reject operations when locked
      await expect(keyring.getActiveKey()).rejects.toThrow('Keyring locked');
      await expect(keyring.getByKid(activeKey.kid)).resolves.toBeNull();

      // Unlock with correct passphrase
      await keyring.unlock(passphrase);

      // Should work again
      const unlockedKey = await keyring.getActiveKey();
      expect(unlockedKey.kid).toBe(activeKey.kid);
    });

    it('should reject wrong passphrase on unlock', async () => {
      const passphrase = 'correct-passphrase';
      const wrongPassphrase = 'wrong-passphrase';

      await keyring.initNew(passphrase, 1000);
      keyring.lock();

      await expect(keyring.unlock(wrongPassphrase)).rejects.toThrow(
        'Invalid passphrase'
      );
    });

    it('should reject unlock when keyring not found', async () => {
      await expect(keyring.unlock('any-passphrase')).rejects.toThrow(
        'Keyring not found'
      );
    });
  });

  describe('rotate', () => {
    it('should rotate to new DEK', async () => {
      const passphrase = 'test-passphrase';
      await keyring.initNew(passphrase, 1000);

      const originalKey = await keyring.getActiveKey();

      // Rotate to new key
      await keyring.rotate();

      const newKey = await keyring.getActiveKey();
      expect(newKey.kid).not.toBe(originalKey.kid);

      // Should still be able to access old key
      const oldKey = await keyring.getByKid(originalKey.kid);
      expect(oldKey).toBeTruthy();
    });

    it('should reject rotate when locked', async () => {
      const passphrase = 'test-passphrase';
      await keyring.initNew(passphrase, 1000);
      keyring.lock();

      await expect(keyring.rotate()).rejects.toThrow('Keyring locked');
    });
  });

  describe('backup/export then import', () => {
    it('should export backup and import into fresh keyring', async () => {
      const passphrase = 'backup-test-passphrase';

      // Original keyring with some keys
      await keyring.initNew(passphrase, 1000);
      const originalActive = await keyring.getActiveKey();

      await keyring.rotate();
      const rotatedActive = await keyring.getActiveKey();

      // Export backup
      const backup = await keyring.exportBackup();
      expect(backup.v).toBe(1);
      expect(backup.deks).toHaveLength(2);
      expect(backup.createdAt).toBeTruthy();
      expect(backup.meta).toBeTruthy();
      expect(backup.meta!.saltB64u).toBeTruthy();
      expect(backup.meta!.iter).toBe(1000);

      // Fresh keyring with SAME storage (same salt/KEK)
      const freshKeyring = new KeyringProvider(storage, 'test-ns');
      await freshKeyring.unlock(passphrase);
      await freshKeyring.importBackup(backup);

      // Should be able to access all imported keys
      const importedKey1 = await freshKeyring.getByKid(originalActive.kid);
      const importedKey2 = await freshKeyring.getByKid(rotatedActive.kid);

      expect(importedKey1).toBeTruthy();
      expect(importedKey2).toBeTruthy();
    });

    it('should import a portable backup from a different salt/iter using passphrase', async () => {
      const passA = 'alpha-pass';
      const passB = 'beta-pass';
      // Source keyring A
      const storageA = new (class extends MockStorageDriver {})();
      const ringA = new KeyringProvider(storageA, 'ns-A');
      await ringA.initNew(passA, 800); // different iter
      await ringA.rotate();
      const bundle = await ringA.exportBackup();
      // Destination keyring B (fresh storage, different salt/iter)
      const storageB = new (class extends MockStorageDriver {})();
      const ringB = new KeyringProvider(storageB, 'ns-B');
      await ringB.initNew(passB, 1000);
      await ringB.importBackup(bundle, passA); // supply source passphrase
      // Verify we can unwrap imported keys (using B's KEK after rewrap)
      for (const d of bundle.deks) {
        const k = await ringB.getByKid(d.kid);
        expect(k).toBeTruthy();
      }
    });

    it('should reject portable backup import without passphrase', async () => {
      const passA = 'alpha-pass';
      const passB = 'beta-pass';
      // Source keyring A
      const storageA = new (class extends MockStorageDriver {})();
      const ringA = new KeyringProvider(storageA, 'ns-A');
      await ringA.initNew(passA, 800);
      const bundle = await ringA.exportBackup();
      // Destination keyring B (different salt/iter)
      const storageB = new (class extends MockStorageDriver {})();
      const ringB = new KeyringProvider(storageB, 'ns-B');
      await ringB.initNew(passB, 1000);
      // Should reject without source passphrase
      await expect(ringB.importBackup(bundle)).rejects.toThrow(
        'Passphrase required to import portable backup'
      );
    });

    it('should reject backup with invalid meta', async () => {
      const passphrase = 'test-passphrase';
      await keyring.initNew(passphrase, 1000);

      // Create malformed backup
      const malformedBundle = {
        v: 1 as const,
        createdAt: new Date().toISOString(),
        meta: {
          saltB64u: '', // Invalid empty salt
          iter: -1, // Invalid iteration count
        },
        deks: [],
      };

      await expect(keyring.importBackup(malformedBundle)).rejects.toThrow(
        'Invalid KEK metadata in backup'
      );
    });

    it('should reject backup import when locked', async () => {
      const passphrase = 'test-passphrase';
      await keyring.initNew(passphrase, 1000);
      const backup = await keyring.exportBackup();

      keyring.lock();
      await expect(keyring.importBackup(backup)).rejects.toThrow(
        'Keyring locked'
      );
    });

    it('should reject export when locked', async () => {
      const passphrase = 'test-passphrase';
      await keyring.initNew(passphrase, 1000);
      keyring.lock();

      await expect(keyring.exportBackup()).rejects.toThrow('Keyring locked');
    });
  });

  describe('KeyProvider interface', () => {
    it('should implement KeyProvider interface correctly', async () => {
      const passphrase = 'interface-test';
      await keyring.initNew(passphrase, 1000);

      // getActiveKey
      const activeKey = await keyring.getActiveKey();
      expect(activeKey.kid).toBeTruthy();
      // Check for CryptoKey properties instead of instanceof (polyfill compatibility)
      expect(activeKey.key).toBeTruthy();
      expect(activeKey.key.type).toBeDefined();
      expect(activeKey.key.algorithm).toBeDefined();

      // getByKid
      const sameKey = await keyring.getByKid(activeKey.kid);
      expect(sameKey).toBe(activeKey.key);

      // Non-existent key
      const nonExistent = await keyring.getByKid('non-existent-kid');
      expect(nonExistent).toBeNull();
    });
  });
});
