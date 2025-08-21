/**
 * Tests for admin recovery channel (E2EE)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createRecoveryBundle, recoverFromBundle } from '../src/recovery/api';
import type { RecoveryIssuer } from '../src/recovery/types';
import { KeyringProvider } from '../src/crypto/keyring';
import { toB64u, fromB64u } from '../src/crypto/base64url';

// WebCrypto polyfill for Node.js testing
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: require('node:crypto').webcrypto,
    writable: false,
    configurable: true,
  });
}
if (!globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: require('node:crypto').webcrypto.subtle,
    writable: false,
    configurable: true,
  });
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: require('node:crypto').webcrypto.getRandomValues.bind(
      require('node:crypto').webcrypto
    ),
    writable: false,
    configurable: true,
  });
}
if (!globalThis.crypto.randomUUID) {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: require('node:crypto').webcrypto.randomUUID.bind(
      require('node:crypto').webcrypto
    ),
    writable: false,
    configurable: true,
  });
}

// Mock storage for testing
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

  clear(): void {
    this.data.clear();
  }
}

describe('Admin Recovery Channel (E2EE)', () => {
  let storage: MockStorage;
  let keyring: KeyringProvider;
  let issuer: RecoveryIssuer;

  beforeEach(async () => {
    storage = new MockStorage();
    keyring = new KeyringProvider(storage, 'test');
    await keyring.initNew('test-passphrase');

    // Create mock issuer
    const signingKeyPair = await crypto.subtle.generateKey(
      { name: 'Ed25519', namedCurve: 'Ed25519' },
      true,
      ['sign', 'verify']
    );

    const publicKeySpki = await crypto.subtle.exportKey(
      'spki',
      signingKeyPair.publicKey
    );

    issuer = {
      pubB64u: toB64u(publicKeySpki),
      sign: async (bytes: Uint8Array) => {
        const signature = await crypto.subtle.sign(
          'Ed25519',
          signingKeyPair.privateKey,
          bytes
        );
        return new Uint8Array(signature);
      },
    };
  });

  describe('Create Recovery Bundle', () => {
    it('should create valid recovery bundle', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'RECOVERY123',
        iter: 1000, // Low for tests
      });

      expect(bundle.v).toBe(1);
      expect(bundle.ns).toBe('test');
      expect(bundle.saltB64u).toBeDefined();
      expect(bundle.iter).toBe(1000);
      expect(bundle.pubB64u).toBe(issuer.pubB64u);
      expect(bundle.ctB64u).toBeDefined();
      expect(bundle.ivB64u).toBeDefined();
      expect(bundle.sigB64u).toBeDefined();
      expect(bundle.createdAt).toBeDefined();
    });

    it('should create bundle with expiry', async () => {
      const expiresAt = new Date(Date.now() + 60000).toISOString(); // 1 minute

      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'RECOVERY456',
        expiresAt,
        iter: 1000,
      });

      expect(bundle.expiresAt).toBe(expiresAt);
    });
  });

  describe('Recover from Bundle', () => {
    it('should recover DEKs with correct passcode (happy path)', async () => {
      // Create recovery bundle
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'RECOVERY789',
        iter: 1000,
      });

      // Create fresh keyring for recovery
      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      // Recover into fresh keyring
      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'RECOVERY789',
      });

      expect(result.imported).toBeGreaterThan(0);

      // Verify recovered keyring has access to original data
      const originalBackup = await keyring.exportBackup();
      const recoveredBackup = await recoveryKeyring.exportBackup();

      // Should have imported all DEKs
      expect(recoveredBackup.deks.length).toBeGreaterThanOrEqual(
        originalBackup.deks.length
      );
    });

    it('should fail with wrong passcode', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'CORRECT123',
        iter: 1000,
      });

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'WRONG456',
        })
      ).rejects.toThrow('Invalid recovery passcode or corrupted bundle');
    });

    it('should reject tampered bundle (signature verification)', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'TAMPER123',
        iter: 1000,
      });

      // Tamper with ciphertext
      const tamperedBundle = {
        ...bundle,
        ctB64u: bundle.ctB64u.slice(0, -4) + 'XXXX',
      };

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle: tamperedBundle,
          passcode: 'TAMPER123',
        })
      ).rejects.toThrow('Invalid recovery bundle signature');
    });

    it('should reject expired bundle', async () => {
      const expiresAt = new Date(Date.now() - 60000).toISOString(); // 1 minute ago

      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'EXPIRED123',
        expiresAt,
        iter: 1000,
      });

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'EXPIRED123',
        })
      ).rejects.toThrow('Recovery bundle expired');
    });

    it('should reject namespace mismatch', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'original',
        keyring,
        issuer,
        passcode: 'NAMESPACE123',
        iter: 1000,
      });

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'different', // Wrong namespace
          keyring: recoveryKeyring,
          bundle,
          passcode: 'NAMESPACE123',
        })
      ).rejects.toThrow('Namespace mismatch');
    });

    it('should be idempotent (second import yields 0)', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'IDEMPOTENT123',
        iter: 1000,
      });

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      // First import
      const result1 = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'IDEMPOTENT123',
      });

      expect(result1.imported).toBeGreaterThan(0);

      // Second import (should be idempotent)
      const result2 = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'IDEMPOTENT123',
      });

      expect(result2.imported).toBe(0);
    });

    it('should work with locked keyring after unlocking', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'LOCKED123',
        iter: 1000,
      });

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      // Lock the keyring
      recoveryKeyring.lock();

      // Unlock before recovery (required for import)
      await recoveryKeyring.unlock('new-passphrase');

      // Should work after unlocking
      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'LOCKED123',
      });

      expect(result.imported).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should reject unsupported bundle version', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'VERSION123',
        iter: 1000,
      });

      // Change version
      const badBundle = { ...bundle, v: 2 as any };

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle: badBundle,
          passcode: 'VERSION123',
        })
      ).rejects.toThrow('Unsupported recovery bundle version');
    });

    it('should handle bundle without expiry', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer,
        passcode: 'NOEXPIRY123',
        iter: 1000,
        // No expiresAt
      });

      expect(bundle.expiresAt).toBeUndefined();

      const recoveryStorage = new MockStorage();
      const recoveryKeyring = new KeyringProvider(recoveryStorage, 'test');
      await recoveryKeyring.initNew('new-passphrase');

      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'NOEXPIRY123',
      });

      expect(result.imported).toBeGreaterThan(0);
    });
  });
});
