/**
 * Policy Integration Tests - Surgical Hooks Validation
 * Test policy enforcement at all integrated entry points
 */

import { describe, beforeEach, test, expect } from 'vitest';
import { createInvite } from '../src/invite/create';
import { acceptInvite } from '../src/invite/accept';
import {
  addMember,
  removeMember,
  changeRole,
  configureMembership,
} from '../src/membership/api';
import { createRecoveryOverride } from '../src/recovery/override.create';
import { acceptRecoveryOverride } from '../src/recovery/override.accept';
import { unlinkDevice } from '../src/revoke/unlink';
import { createRecoveryBundle } from '../src/recovery/api';
import { savePolicies, createStarterPolicy } from '../src/policy/engine';
import type { StorageDriver } from '../src/storage/types';
import type { Role } from '../src/membership/types';

// Mock storage for testing
class MockStorage implements StorageDriver {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async listKeys(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.store.keys());
    return prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

describe('Policy Integration Tests', () => {
  let storage: StorageDriver;
  let keyring: any;
  let ownerPubKey: string;
  let adminPubKey: string;
  const ns = 'test-org';

  beforeEach(async () => {
    storage = new MockStorage();
    keyring = {
      exportBackup: async () => ({
        v: 1,
        createdAt: new Date().toISOString(),
        deks: [],
      }),
      importBackup: async () => {},
      rotate: async () => {},
    };

    ownerPubKey = 'owner-public-key-b64u';
    adminPubKey = 'admin-public-key-b64u';

    // Configure membership
    configureMembership(storage, ns, [ownerPubKey]);

    // Configure revocation storage for unlink tests
    const { setRevocationStorage } = await import('../src/revoke/registry');
    setRevocationStorage(storage, ns);

    // Set up initial membership state
    await addMember(ownerPubKey, ownerPubKey, 'OWNER');
    await addMember(ownerPubKey, adminPubKey, 'ADMIN');
  });

  test('invite.create enforces policy when storage provided', async () => {
    // Create a policy that denies ADMIN from creating OWNER invites
    const policy = createStarterPolicy();
    policy.rules.push({
      effect: 'deny',
      ops: ['invite.create'],
      actorMinRole: 'ADMIN',
      targetMaxRole: 'OWNER',
    });

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    // Mock membership API for invite creation
    const mockMembershipApi = {
      assertPermission: async () => {},
      getMembership: async () => ({
        users: {
          [ownerPubKey]: 'OWNER' as Role,
          [adminPubKey]: 'ADMIN' as Role,
        },
        owners: [ownerPubKey],
      }),
    };

    const { configureMembershipDependency } = await import(
      '../src/invite/create'
    );
    configureMembershipDependency(mockMembershipApi);

    // Mock signing function
    const mockSign = async () => 'mock-signature-b64u';

    // ADMIN cannot create OWNER invites (policy denies)
    await expect(
      createInvite({
        keyring,
        code: 'invite-code-456',
        ttlMs: 24 * 60 * 60 * 1000,
        ns,
        sign: mockSign,
        signerPubB64u: adminPubKey,
        role: 'OWNER',
        storage,
      })
    ).rejects.toThrow('POLICY_DENIED');

    // But ADMIN can create MEMBER invites (policy allows)
    await expect(
      createInvite({
        keyring,
        code: 'invite-code-789',
        ttlMs: 24 * 60 * 60 * 1000,
        ns,
        sign: mockSign,
        signerPubB64u: adminPubKey,
        role: 'MEMBER',
        storage,
      })
    ).resolves.toBeDefined();
  });

  test('membership.add enforces policy when provided', async () => {
    // Create a policy with daily caps
    const policy = createStarterPolicy();
    policy.rules.push({
      effect: 'allow',
      ops: ['membership.add'],
      perActorDailyCap: 1,
    });

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    const newUserId = 'new-user-123';

    // First addition should work (within daily cap)
    await expect(
      addMember(ownerPubKey, newUserId, 'MEMBER')
    ).resolves.toBeUndefined();

    // Second addition should fail (exceeds daily cap)
    const anotherUserId = 'another-user-456';
    await expect(
      addMember(ownerPubKey, anotherUserId, 'MEMBER')
    ).rejects.toThrow('POLICY_DENIED');
  });

  test('invite.accept enforces policy when storage provided', async () => {
    // Create restrictive time policy (deny outside business hours)
    const policy = createStarterPolicy();
    policy.rules.push({
      effect: 'deny',
      ops: ['invite.accept'],
      time: { start: '09:00', end: '17:00' }, // Business hours UTC
    });

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    // Mock envelope (simplified for test)
    const mockEnvelope = {
      v: 1 as const,
      createdAt: new Date().toISOString(),
      exp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      saltB64u: 'mock-salt-b64u',
      iter: 100000,
      aad: `${ns}:test-invite-id`,
      ctB64u: 'mock-ciphertext-b64u',
      role: 'MEMBER' as Role,
      signerPubB64u: ownerPubKey,
      sigB64u: 'mock-signature-b64u',
    };

    // Mock verification functions
    const mockVerify = async () => true;
    const mockIsUsed = async () => false;
    const mockMarkUsed = async () => {};

    const recipientId = 'recipient-123';

    // Mock the current time to be outside business hours (18:00 UTC)
    const originalNow = Date.now;
    Date.now = () => new Date('2025-08-15T18:00:00.000Z').getTime();

    try {
      // Should fail due to time restriction
      await expect(
        acceptInvite({
          envelope: mockEnvelope,
          code: 'invite-code',
          keyring,
          verify: mockVerify,
          isUsed: mockIsUsed,
          markUsed: mockMarkUsed,
          actorId: recipientId,
          storage,
        })
      ).rejects.toThrow('POLICY_DENIED');
    } finally {
      Date.now = originalNow;
    }
  });

  test('recovery override operations enforce policy', async () => {
    // Create policy restricting recovery operations
    const policy = createStarterPolicy();
    policy.rules.push({
      effect: 'deny',
      ops: ['override.create'],
      actorMinRole: 'ADMIN',
      targetMaxRole: 'OWNER',
    });

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    const beneficiaryId = 'beneficiary-123';
    await addMember(ownerPubKey, beneficiaryId, 'MEMBER');

    // Mock signing function
    const mockSign = async () => 'mock-signature-b64u';

    // ADMIN trying to create override for OWNER should fail
    await expect(
      createRecoveryOverride({
        ns,
        actorId: adminPubKey,
        beneficiaryId: ownerPubKey, // OWNER as beneficiary
        code: 'recovery-code',
        sign: mockSign,
        storage,
      })
    ).rejects.toThrow('POLICY_DENIED');

    // ADMIN creating override for MEMBER should work
    await expect(
      createRecoveryOverride({
        ns,
        actorId: adminPubKey,
        beneficiaryId,
        code: 'recovery-code',
        sign: mockSign,
        storage,
      })
    ).resolves.toBeDefined();
  });

  test('device unlink enforces policy', async () => {
    // Create policy with daily caps for device operations
    const policy = createStarterPolicy();
    policy.rules.push({
      effect: 'allow',
      ops: ['device.unlink'],
      perActorDailyCap: 2,
    });

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    // First two unlinks should work
    await expect(
      unlinkDevice({
        ns,
        signerPubB64u: 'signer-1',
        keyring,
        actorId: ownerPubKey,
        actorRole: 'OWNER',
        storage,
        rotate: false,
      })
    ).resolves.toBeDefined();

    await expect(
      unlinkDevice({
        ns,
        signerPubB64u: 'signer-2',
        keyring,
        actorId: ownerPubKey,
        actorRole: 'OWNER',
        storage,
        rotate: false,
      })
    ).resolves.toBeDefined();

    // Third unlink should fail (exceeds daily cap)
    await expect(
      unlinkDevice({
        ns,
        signerPubB64u: 'signer-3',
        keyring,
        actorId: ownerPubKey,
        actorRole: 'OWNER',
        storage,
        rotate: false,
      })
    ).rejects.toThrow('POLICY_DENIED');
  });

  test('recovery bundle creation enforces policy', async () => {
    // Create policy restricting recovery bundle creation for ADMIN only
    const policy = createStarterPolicy();
    policy.rules.push({
      effect: 'deny',
      ops: ['recovery.create'],
      actorMinRole: 'ADMIN', // Deny for ADMIN specifically
    });

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    const mockIssuer = {
      kid: 'issuer-key-id',
      sign: async () => new Uint8Array([1, 2, 3]),
      pubB64u: adminPubKey,
    };

    // ADMIN should be denied
    await expect(
      createRecoveryBundle({
        ns,
        keyring,
        issuer: mockIssuer,
        passcode: 'recovery-passcode',
        actorId: adminPubKey,
        actorRole: 'ADMIN',
        storage,
      })
    ).rejects.toThrow('POLICY_DENIED');

    // MEMBER should work (not affected by the ADMIN-specific deny rule)
    const memberPubKey = 'member-pub-key';
    await addMember(ownerPubKey, memberPubKey, 'MEMBER');

    const memberIssuer = { ...mockIssuer, pubB64u: memberPubKey };
    await expect(
      createRecoveryBundle({
        ns,
        keyring,
        issuer: memberIssuer,
        passcode: 'recovery-passcode',
        actorId: memberPubKey,
        actorRole: 'MEMBER',
        storage,
      })
    ).resolves.toBeDefined();
  });

  test('operations work without storage (graceful degradation)', async () => {
    // All operations should work normally when storage is not provided
    // (backward compatibility - no policy enforcement)

    const mockSign = async () => 'mock-signature-b64u';

    // Mock membership API
    const mockMembershipApi = {
      assertPermission: async () => {},
      getMembership: async () => ({
        users: { [ownerPubKey]: 'OWNER' as Role },
        owners: [ownerPubKey],
      }),
    };

    const { configureMembershipDependency } = await import(
      '../src/invite/create'
    );
    configureMembershipDependency(mockMembershipApi);

    // Should work without storage parameter (no policy enforcement)
    await expect(
      createInvite({
        keyring,
        code: 'invite-code-no-policy',
        ttlMs: 24 * 60 * 60 * 1000,
        ns,
        sign: mockSign,
        signerPubB64u: ownerPubKey,
        role: 'OWNER',
        // No storage parameter - should skip policy enforcement
      })
    ).resolves.toBeDefined();
  });
});
