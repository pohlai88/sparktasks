/**
 * Phase B Task 15 - Invite Role Binding & Enforcement Tests
 * Testing role-bound invites with authorization and enforcement
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInvite,
  configureMembershipDependency,
} from '../src/invite/create';
import {
  acceptInvite,
  configureMembershipDependency as configureAcceptDependency,
  configureRolePolicy,
} from '../src/invite/accept';
import { setInviteStorage, isUsed, markUsed } from '../src/invite/registry';
import { KeyringProvider } from '../src/crypto/keyring';
import {
  generateKeyPair,
  sign,
  verify,
  exportPublicKeyB64u,
  importPublicKeyB64u,
} from '../src/crypto/ed25519';
import type { Role } from '../src/invite/types';

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
  async listKeys(): Promise<string[]> {
    return Array.from(this.data.keys());
  }
}

// Mock membership API for testing
class MockMembershipApi {
  private users: Record<string, Role> = {};

  setUserRole(actor: string, role: Role): void {
    this.users[actor] = role;
  }

  async assertPermission(
    actor: string,
    action: 'INVITE_CREATE',
    context?: { targetRole?: Role }
  ): Promise<void> {
    const userRole = this.users[actor];

    // Basic permission check
    if (action === 'INVITE_CREATE' && !userRole) {
      throw new Error(
        'Access denied: INVITE_CREATE requires ADMIN, user has none'
      );
    }

    if (
      action === 'INVITE_CREATE' &&
      userRole &&
      !['OWNER', 'ADMIN'].includes(userRole)
    ) {
      throw new Error(
        `Access denied: INVITE_CREATE requires ADMIN, user has ${userRole}`
      );
    }

    // Role-specific invite authorization
    if (context?.targetRole && userRole) {
      const INVITE_ROLE_POLICY: Record<Role, Role[]> = {
        OWNER: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
        ADMIN: ['ADMIN', 'MEMBER', 'VIEWER'],
        MEMBER: [],
        VIEWER: [],
      };

      const allowedRoles = INVITE_ROLE_POLICY[userRole] || [];
      if (!allowedRoles.includes(context.targetRole)) {
        throw new Error(
          `Access denied: ${userRole} cannot issue ${context.targetRole} invites`
        );
      }
    }
  }

  async addMember(_issuer: string, user: string, role: Role): Promise<void> {
    this.users[user] = role;
  }

  async getMembership(): Promise<{ users: Record<string, Role> }> {
    return { users: this.users };
  }
}

describe('Invite Role Binding & Enforcement', () => {
  let keyring: KeyringProvider;
  let signingKeys: CryptoKeyPair;
  let signerPubB64u: string;
  let mockMembership: MockMembershipApi;

  beforeEach(async () => {
    // Setup keyring
    const storage = new MockStorage();
    keyring = new KeyringProvider(storage, 'test-ns');
    await keyring.initNew('test-passphrase', 1000);

    // Setup signing keys
    signingKeys = await generateKeyPair();
    signerPubB64u = await exportPublicKeyB64u(signingKeys.publicKey);

    // Setup invite registry
    const registryStorage = new MockStorage();
    setInviteStorage(registryStorage);

    // Setup mock membership API
    mockMembership = new MockMembershipApi();
    configureMembershipDependency(mockMembership);
    configureAcceptDependency(mockMembership);

    // Reset role policy to defaults
    configureRolePolicy({
      strictLegacy: false,
      verifyIssuerStillAuthorized: false,
    });
  });

  describe('Issue-time Authorization', () => {
    it('OWNER can issue OWNER invite', async () => {
      mockMembership.setUserRole(signerPubB64u, 'OWNER');

      const { envelope, meta } = await createInvite({
        keyring,
        code: 'SECRET123',
        ttlMs: 60000,
        ns: 'test-app',
        sign: data => sign(signingKeys.privateKey, data),
        signerPubB64u,
        role: 'OWNER',
      });

      expect(envelope.v).toBe(1);
      expect((envelope as any).role).toBe('OWNER');
      expect(meta.ns).toBe('test-app');
    });

    it('ADMIN can issue MEMBER invite', async () => {
      mockMembership.setUserRole(signerPubB64u, 'ADMIN');

      const { envelope } = await createInvite({
        keyring,
        code: 'SECRET123',
        ttlMs: 60000,
        ns: 'test-app',
        sign: data => sign(signingKeys.privateKey, data),
        signerPubB64u,
        role: 'MEMBER',
      });

      expect((envelope as any).role).toBe('MEMBER');
    });

    it('ADMIN cannot issue OWNER invite', async () => {
      mockMembership.setUserRole(signerPubB64u, 'ADMIN');

      await expect(
        createInvite({
          keyring,
          code: 'SECRET123',
          ttlMs: 60000,
          ns: 'test-app',
          sign: data => sign(signingKeys.privateKey, data),
          signerPubB64u,
          role: 'OWNER',
        })
      ).rejects.toThrow('ADMIN cannot issue OWNER invites');
    });

    it('MEMBER cannot issue any invites', async () => {
      mockMembership.setUserRole(signerPubB64u, 'MEMBER');

      await expect(
        createInvite({
          keyring,
          code: 'SECRET123',
          ttlMs: 60000,
          ns: 'test-app',
          sign: data => sign(signingKeys.privateKey, data),
          signerPubB64u,
          role: 'MEMBER',
        })
      ).rejects.toThrow(
        'Access denied: INVITE_CREATE requires ADMIN, user has MEMBER'
      );
    });

    it('unauthenticated user cannot issue invites', async () => {
      // Don't set any role for signerPubB64u

      await expect(
        createInvite({
          keyring,
          code: 'SECRET123',
          ttlMs: 60000,
          ns: 'test-app',
          sign: data => sign(signingKeys.privateKey, data),
          signerPubB64u,
          role: 'VIEWER',
        })
      ).rejects.toThrow(
        'Access denied: INVITE_CREATE requires ADMIN, user has none'
      );
    });
  });

  describe('Accept-time Enforcement', () => {
    it('accept applies bound OWNER role to membership', async () => {
      mockMembership.setUserRole(signerPubB64u, 'OWNER');

      const { envelope } = await createInvite({
        keyring,
        code: 'SECRET123',
        ttlMs: 60000,
        ns: 'test-app',
        sign: data => sign(signingKeys.privateKey, data),
        signerPubB64u,
        role: 'OWNER',
      });

      const receiverStorage = new MockStorage();
      const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
      await receiverKeyring.initNew('receiver-passphrase', 1000);

      const result = await acceptInvite({
        envelope,
        code: 'SECRET123',
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: id => isUsed(id),
        markUsed: id => markUsed(id),
        actorId: 'new-user-123',
      });

      expect(result.appliedRole).toBe('OWNER');

      // Verify membership was applied
      const membership = await mockMembership.getMembership();
      expect(membership.users['new-user-123']).toBe('OWNER');
    });

    it('accept applies bound MEMBER role', async () => {
      mockMembership.setUserRole(signerPubB64u, 'ADMIN');

      const { envelope } = await createInvite({
        keyring,
        code: 'SECRET123',
        ttlMs: 60000,
        ns: 'test-app',
        sign: data => sign(signingKeys.privateKey, data),
        signerPubB64u,
        role: 'MEMBER',
      });

      const receiverStorage = new MockStorage();
      const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
      await receiverKeyring.initNew('receiver-passphrase', 1000);

      const result = await acceptInvite({
        envelope,
        code: 'SECRET123',
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: id => isUsed(id),
        markUsed: id => markUsed(id),
        actorId: 'new-member-456',
      });

      expect(result.appliedRole).toBe('MEMBER');
      expect(result.importedCount).toBeGreaterThan(0);
    });
  });

  describe('Legacy Invite Handling', () => {
    it('legacy invite defaults to MEMBER role', async () => {
      // Create legacy invite without role (simulate old invite format)
      mockMembership.setUserRole(signerPubB64u, 'ADMIN');

      // Manually create envelope without role
      const backup = await keyring.exportBackup();
      const inviteBundle = {
        v: backup.v,
        createdAt: backup.createdAt,
        deks: backup.deks,
      };

      const code = 'LEGACY123';
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iter = 100000;
      const inviteId = crypto.randomUUID();
      const aad = `test-app:${inviteId}`;

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(code),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      const sessionKey = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const plaintext = new TextEncoder().encode(JSON.stringify(inviteBundle));
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(aad) },
        sessionKey,
        plaintext
      );

      const combined = new Uint8Array(12 + ciphertext.byteLength);
      combined.set(new Uint8Array(iv));
      combined.set(new Uint8Array(ciphertext), 12);

      const { toB64u } = await import('../src/crypto/base64url');
      const manifest = {
        v: 1 as const,
        createdAt: new Date().toISOString(),
        exp: new Date(Date.now() + 60000).toISOString(),
        saltB64u: toB64u(salt.buffer),
        iter,
        aad,
        ctB64u: toB64u(combined.buffer),
        // No role field - legacy invite
      };

      const canonical = JSON.stringify(manifest, Object.keys(manifest).sort());
      const signature = await sign(
        signingKeys.privateKey,
        new TextEncoder().encode(canonical).buffer
      );

      const envelope = { ...manifest, signerPubB64u, sigB64u: signature };

      const receiverStorage = new MockStorage();
      const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
      await receiverKeyring.initNew('receiver-passphrase', 1000);

      const result = await acceptInvite({
        envelope,
        code: 'LEGACY123',
        keyring: receiverKeyring,
        verify: async (data, sig, pubB64u) => {
          const pubKey = await importPublicKeyB64u(pubB64u);
          return verify(pubKey, data, sig);
        },
        isUsed: id => isUsed(id),
        markUsed: id => markUsed(id),
        actorId: 'legacy-user',
      });

      expect(result.appliedRole).toBe('MEMBER'); // Default for legacy
    });

    it('strict mode rejects legacy invites', async () => {
      configureRolePolicy({ strictLegacy: true });

      // Same legacy invite setup as above
      mockMembership.setUserRole(signerPubB64u, 'ADMIN');
      const backup = await keyring.exportBackup();
      const inviteBundle = {
        v: backup.v,
        createdAt: backup.createdAt,
        deks: backup.deks,
      };

      const code = 'LEGACY123';
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iter = 100000;
      const inviteId = crypto.randomUUID();
      const aad = `test-app:${inviteId}`;

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(code),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      const sessionKey = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const plaintext = new TextEncoder().encode(JSON.stringify(inviteBundle));
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(aad) },
        sessionKey,
        plaintext
      );

      const combined = new Uint8Array(12 + ciphertext.byteLength);
      combined.set(new Uint8Array(iv));
      combined.set(new Uint8Array(ciphertext), 12);

      const { toB64u } = await import('../src/crypto/base64url');
      const manifest = {
        v: 1 as const,
        createdAt: new Date().toISOString(),
        exp: new Date(Date.now() + 60000).toISOString(),
        saltB64u: toB64u(salt.buffer),
        iter,
        aad,
        ctB64u: toB64u(combined.buffer),
      };

      const canonical = JSON.stringify(manifest, Object.keys(manifest).sort());
      const signature = await sign(
        signingKeys.privateKey,
        new TextEncoder().encode(canonical).buffer
      );
      const envelope = { ...manifest, signerPubB64u, sigB64u: signature };

      const receiverStorage = new MockStorage();
      const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
      await receiverKeyring.initNew('receiver-passphrase', 1000);

      await expect(
        acceptInvite({
          envelope,
          code: 'LEGACY123',
          keyring: receiverKeyring,
          verify: async (data, sig, pubB64u) => {
            const pubKey = await importPublicKeyB64u(pubB64u);
            return verify(pubKey, data, sig);
          },
          isUsed: id => isUsed(id),
          markUsed: id => markUsed(id),
          actorId: 'legacy-user',
        })
      ).rejects.toThrow('Legacy invites not allowed in strict mode');
    });
  });

  describe('Security & Tamper Detection', () => {
    it('tampered role in envelope fails signature verification', async () => {
      mockMembership.setUserRole(signerPubB64u, 'ADMIN');

      const { envelope } = await createInvite({
        keyring,
        code: 'SECRET123',
        ttlMs: 60000,
        ns: 'test-app',
        sign: data => sign(signingKeys.privateKey, data),
        signerPubB64u,
        role: 'MEMBER',
      });

      // Tamper with role in envelope
      const tamperedEnvelope = { ...envelope, role: 'OWNER' };

      const receiverStorage = new MockStorage();
      const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
      await receiverKeyring.initNew('receiver-passphrase', 1000);

      await expect(
        acceptInvite({
          envelope: tamperedEnvelope,
          code: 'SECRET123',
          keyring: receiverKeyring,
          verify: async (data, sig, pubB64u) => {
            const pubKey = await importPublicKeyB64u(pubB64u);
            return verify(pubKey, data, sig);
          },
          isUsed: id => isUsed(id),
          markUsed: id => markUsed(id),
          actorId: 'tamper-user',
        })
      ).rejects.toThrow('Invalid signature');
    });

    it('optional issuer re-authorization on accept', async () => {
      configureRolePolicy({ verifyIssuerStillAuthorized: true });

      // Issue invite as OWNER
      mockMembership.setUserRole(signerPubB64u, 'OWNER');

      const { envelope } = await createInvite({
        keyring,
        code: 'SECRET123',
        ttlMs: 60000,
        ns: 'test-app',
        sign: data => sign(signingKeys.privateKey, data),
        signerPubB64u,
        role: 'OWNER',
      });

      // Downgrade issuer before accept
      mockMembership.setUserRole(signerPubB64u, 'MEMBER');

      const receiverStorage = new MockStorage();
      const receiverKeyring = new KeyringProvider(receiverStorage, 'test-ns');
      await receiverKeyring.initNew('receiver-passphrase', 1000);

      await expect(
        acceptInvite({
          envelope,
          code: 'SECRET123',
          keyring: receiverKeyring,
          verify: async (data, sig, pubB64u) => {
            const pubKey = await importPublicKeyB64u(pubB64u);
            return verify(pubKey, data, sig);
          },
          isUsed: id => isUsed(id),
          markUsed: id => markUsed(id),
          actorId: 'reauth-user',
        })
      ).rejects.toThrow('Issuer no longer authorized to issue OWNER invites');
    });
  });
});
