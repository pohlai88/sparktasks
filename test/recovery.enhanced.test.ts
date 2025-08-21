/**
 * Enhanced Recovery Features Test
 * Tests issuer rotation, bundle revocation, and rate limiting
 */

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

import { describe, it, expect, beforeEach } from 'vitest';
import { KeyringProvider } from '../src/crypto/keyring';
import {
  createRecoveryBundle,
  recoverFromBundle,
  RecoveryUtils,
} from '../src/recovery/api';
import type {
  RecoveryIssuer,
  RecoveryKeyRegistry,
  RevocationRegistry,
} from '../src/recovery/types';

// Mock storage
class MockStorage {
  private data = new Map<string, string>();
  async getItem(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }
  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }
  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }
}

// Helper to create Ed25519 issuer
async function createIssuer(kid: string): Promise<RecoveryIssuer> {
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify',
  ]);
  const publicKeySpki = await crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  const pubB64u = btoa(String.fromCharCode(...new Uint8Array(publicKeySpki)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return {
    kid,
    async sign(bytes: Uint8Array): Promise<Uint8Array> {
      const signature = await crypto.subtle.sign(
        'Ed25519',
        keyPair.privateKey,
        new Uint8Array(bytes)
      );
      return new Uint8Array(signature);
    },
    pubB64u,
  };
}

describe('Enhanced Recovery Features', () => {
  let keyring: KeyringProvider;
  let issuer1: RecoveryIssuer;
  let issuer2: RecoveryIssuer;
  let keyRegistry: RecoveryKeyRegistry;
  let revocationRegistry: RevocationRegistry;

  beforeEach(async () => {
    // Setup keyring
    const storage = new MockStorage();
    keyring = new KeyringProvider(storage, 'test');
    await keyring.initNew('test-passphrase');
    await keyring.rotate(); // Create some DEKs

    // Setup issuers
    issuer1 = await createIssuer('issuer-v1');
    issuer2 = await createIssuer('issuer-v2');

    // Setup key registry
    keyRegistry = {
      async getPublicKey(kid: string): Promise<string | null> {
        if (kid === 'issuer-v1') return issuer1.pubB64u;
        if (kid === 'issuer-v2') return issuer2.pubB64u;
        return null;
      },
    };

    // Setup revocation registry
    const revokedBundles = new Set<string>();
    revocationRegistry = {
      async isRevoked(bundleId: string): Promise<boolean> {
        return revokedBundles.has(bundleId);
      },
      async revoke(bundleId: string): Promise<void> {
        revokedBundles.add(bundleId);
      },
    };

    // Clear rate limits between tests
    RecoveryUtils.clearAllRateLimits();
  });

  describe('Issuer Rotation', () => {
    it('should create bundle with issuerKID', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer1,
        passcode: 'ROTATE123',
        iter: 1000,
      });

      expect(bundle.issuerKID).toBe('issuer-v1');
      expect(bundle.pubB64u).toBe(issuer1.pubB64u);
    });

    it('should verify bundle with rotated issuer key', async () => {
      // Create bundle with issuer1
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer1,
        passcode: 'ROTATE123',
        iter: 1000,
      });

      // Recover with key registry (simulating issuer rotation)
      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'ROTATE123',
        options: { keyRegistry },
      });

      expect(result.imported).toBeGreaterThan(0);
    });

    it('should reject unknown issuer key', async () => {
      const unknownIssuer = await createIssuer('unknown-issuer');

      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: unknownIssuer,
        passcode: 'UNKNOWN123',
        iter: 1000,
      });

      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'UNKNOWN123',
          options: { keyRegistry },
        })
      ).rejects.toThrow('Unknown issuer key: unknown-issuer');
    });
  });

  describe('Bundle Revocation', () => {
    it('should reject revoked bundle', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer1,
        passcode: 'REVOKE123',
        iter: 1000,
      });

      // Revoke the bundle
      const bundleId = RecoveryUtils.getBundleId(bundle);
      await revocationRegistry.revoke(bundleId, 'Test revocation');

      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'REVOKE123',
          options: { revocationRegistry },
        })
      ).rejects.toThrow('Recovery bundle has been revoked');
    });

    it('should allow non-revoked bundle', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer1,
        passcode: 'GOOD123',
        iter: 1000,
      });

      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'GOOD123',
        options: { revocationRegistry },
      });

      expect(result.imported).toBeGreaterThan(0);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply exponential backoff on failed attempts', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer1,
        passcode: 'CORRECT123',
        iter: 1000,
        meta: { testId: 'rate-limit-test-1' },
      });

      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      // First failed attempt should work
      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'WRONG123',
          options: { enableRateLimit: true },
        })
      ).rejects.toThrow('Invalid recovery passcode');

      // Second attempt should be rate limited
      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'WRONG123',
          options: { enableRateLimit: true },
        })
      ).rejects.toThrow('Rate limit exceeded');
    });

    it('should reset rate limit on successful recovery', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer1,
        passcode: 'SUCCESS123',
        iter: 2000,
        meta: { testId: 'rate-limit-test-2' },
      });

      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      // Failed attempt
      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'WRONG123',
          options: { enableRateLimit: true },
        })
      ).rejects.toThrow('Invalid recovery passcode');

      // Wait for rate limit to expire (1 second)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Successful attempt should reset rate limit
      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'SUCCESS123',
        options: { enableRateLimit: true },
      });

      expect(result.imported).toBeGreaterThan(0);

      // Next failed attempt should not be rate limited (reset)
      await expect(
        recoverFromBundle({
          ns: 'test',
          keyring: recoveryKeyring,
          bundle,
          passcode: 'WRONG123',
          options: { enableRateLimit: true },
        })
      ).rejects.toThrow('Invalid recovery passcode');
    });
  });

  describe('Combined Features', () => {
    it('should work with all enhancements enabled', async () => {
      const bundle = await createRecoveryBundle({
        ns: 'test',
        keyring,
        issuer: issuer2,
        passcode: 'COMBINED123',
        iter: 1000,
      });

      const recoveryKeyring = new KeyringProvider(new MockStorage(), 'test');
      await recoveryKeyring.initNew('new-passphrase');

      const result = await recoverFromBundle({
        ns: 'test',
        keyring: recoveryKeyring,
        bundle,
        passcode: 'COMBINED123',
        options: {
          keyRegistry,
          revocationRegistry,
          enableRateLimit: true,
        },
      });

      expect(result.imported).toBeGreaterThan(0);
      expect(bundle.issuerKID).toBe('issuer-v2');
    });
  });
});
