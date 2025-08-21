/**
 * Tests for headless device unlink and invite revocation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  revokeInvite,
  isInviteRevoked,
  revokeSigner,
  isSignerRevoked,
  setRevocationStorage,
} from '../src/revoke/registry';
import { unlinkDevice } from '../src/revoke/unlink';
import { acceptInvite } from '../src/invite/accept';
import { createInvite } from '../src/invite/create';
import { setInviteStorage } from '../src/invite/registry';
import { KeyringProvider } from '../src/crypto/keyring';

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

// Mock crypto verify function
async function mockVerify(
  _bytes: ArrayBuffer,
  sig: string,
  _pubB64u: string
): Promise<boolean> {
  // Simple mock: verify succeeds if sig starts with 'valid'
  return sig.startsWith('valid');
}

describe('Headless Device Unlink & Invite Revocation', () => {
  let storage: MockStorage;
  let keyring: KeyringProvider;

  beforeEach(async () => {
    storage = new MockStorage();
    setRevocationStorage(storage, 'test');
    setInviteStorage(storage);

    keyring = new KeyringProvider(storage, 'test');
    await keyring.initNew('test-passphrase');
  });

  describe('Invite Revocation', () => {
    it('should revoke and detect revoked invites', async () => {
      const inviteId = 'test-invite-123';

      // Initially not revoked
      expect(await isInviteRevoked(inviteId)).toBe(false);

      // Revoke the invite
      await revokeInvite(inviteId);

      // Now should be revoked
      expect(await isInviteRevoked(inviteId)).toBe(true);
    });

    it('should be idempotent (double revocation succeeds)', async () => {
      const inviteId = 'test-invite-456';

      // Revoke twice
      await revokeInvite(inviteId);
      await revokeInvite(inviteId);

      // Should still be revoked
      expect(await isInviteRevoked(inviteId)).toBe(true);
    });

    it('should reject revoked invite during acceptance', async () => {
      // Create a valid invite envelope
      const { envelope, meta } = await createInvite({
        ttlMs: 60 * 60 * 1000, // 60 minutes in ms
        keyring,
        code: 'SECRET123',
        ns: 'test',
        signerPubB64u: 'mock-signer-key',
        sign: async () => 'valid-signature',
      });

      const inviteId = meta.inviteId;

      // Revoke the invite
      await revokeInvite(inviteId);

      // Try to accept the invite
      await expect(
        acceptInvite({
          envelope,
          code: 'SECRET123',
          keyring,
          verify: mockVerify,
          isUsed: async () => false,
          markUsed: async () => {},
        })
      ).rejects.toThrow('Invite revoked');
    });
  });

  describe('Signer Revocation', () => {
    it('should revoke and detect revoked signers', async () => {
      const signerPub = 'mock-signer-pubkey-b64u';

      // Initially not revoked
      expect(await isSignerRevoked(signerPub)).toBe(false);

      // Revoke the signer
      await revokeSigner(signerPub);

      // Now should be revoked
      expect(await isSignerRevoked(signerPub)).toBe(true);
    });

    it('should be idempotent (double revocation succeeds)', async () => {
      const signerPub = 'mock-signer-pubkey-456';

      // Revoke twice
      await revokeSigner(signerPub);
      await revokeSigner(signerPub);

      // Should still be revoked
      expect(await isSignerRevoked(signerPub)).toBe(true);
    });

    it('should reject invite from revoked signer during acceptance', async () => {
      const signerPub = 'revoked-signer-key';

      // Create a valid invite envelope with specific signer
      const { envelope } = await createInvite({
        ttlMs: 60 * 60 * 1000,
        keyring,
        code: 'SECRET456',
        ns: 'test',
        signerPubB64u: signerPub,
        sign: async () => 'valid-signature',
      });

      // Revoke the signer
      await revokeSigner(signerPub);

      // Try to accept the invite
      await expect(
        acceptInvite({
          envelope,
          code: 'SECRET456',
          keyring,
          verify: mockVerify,
          isUsed: async () => false,
          markUsed: async () => {},
        })
      ).rejects.toThrow('Signer revoked');
    });
  });

  describe('Device Unlink', () => {
    it('should unlink device with DEK rotation by default', async () => {
      const signerPub = 'device-to-unlink';

      // Get initial active key
      const initial = await keyring.getActiveKey();

      // Unlink the device
      const result = await unlinkDevice({
        signerPubB64u: signerPub,
        keyring,
      });

      // Should have rotated
      expect(result.rotated).toBe(true);

      // Active KID should have changed
      const newActive = await keyring.getActiveKey();
      expect(newActive.kid).not.toBe(initial.kid);

      // Signer should be revoked
      expect(await isSignerRevoked(signerPub)).toBe(true);
    });

    it('should unlink device without rotation when rotate=false', async () => {
      const signerPub = 'device-no-rotate';

      // Get initial active key
      const initial = await keyring.getActiveKey();

      // Unlink without rotation
      const result = await unlinkDevice({
        signerPubB64u: signerPub,
        keyring,
        rotate: false,
      });

      // Should not have rotated
      expect(result.rotated).toBe(false);

      // Active KID should remain the same
      const newActive = await keyring.getActiveKey();
      expect(newActive.kid).toBe(initial.kid);

      // Signer should still be revoked
      expect(await isSignerRevoked(signerPub)).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should prevent acceptance after device unlink', async () => {
      const signerPub = 'integrated-test-signer';

      // Create a valid invite envelope
      const { envelope } = await createInvite({
        ttlMs: 60 * 60 * 1000,
        keyring,
        code: 'INTEGRATION123',
        ns: 'test',
        signerPubB64u: signerPub,
        sign: async () => 'valid-signature',
      });

      // First acceptance should work
      const result1 = await acceptInvite({
        envelope,
        code: 'INTEGRATION123',
        keyring,
        verify: mockVerify,
        isUsed: async () => false,
        markUsed: async () => {},
      });

      expect(result1.importedCount).toBeGreaterThan(0);

      // Unlink the device
      await unlinkDevice({
        signerPubB64u: signerPub,
        keyring,
      });

      // Create another invite from the same signer
      const { envelope: envelope2 } = await createInvite({
        ttlMs: 60 * 60 * 1000,
        keyring,
        code: 'INTEGRATION456',
        ns: 'test',
        signerPubB64u: signerPub,
        sign: async () => 'valid-signature',
      });

      // Second acceptance should fail
      await expect(
        acceptInvite({
          envelope: envelope2,
          code: 'INTEGRATION456',
          keyring,
          verify: mockVerify,
          isUsed: async () => false,
          markUsed: async () => {},
        })
      ).rejects.toThrow('Signer revoked');
    });
  });
});
