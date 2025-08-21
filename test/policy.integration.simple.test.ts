/**
 * Simple Policy Integration Test - Core Functionality
 * Test that policy enforcement hooks are correctly integrated
 */

import { describe, beforeEach, test, expect } from 'vitest';
import { addMember, configureMembership } from '../src/membership/api';
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

describe('Simple Policy Integration', () => {
  let storage: StorageDriver;
  let ownerPubKey: string;
  let adminPubKey: string;
  const ns = 'test-org';

  beforeEach(async () => {
    storage = new MockStorage();
    ownerPubKey = 'owner-public-key-b64u';
    adminPubKey = 'admin-public-key-b64u';

    // Configure membership
    configureMembership(storage, ns, [ownerPubKey]);

    // Set up initial membership state
    await addMember(ownerPubKey, ownerPubKey, 'OWNER');
    await addMember(ownerPubKey, adminPubKey, 'ADMIN');
  });

  test('membership operations enforce daily caps', async () => {
    // Create a policy with strict daily caps
    const policy = createStarterPolicy();
    policy.rules = [
      {
        effect: 'allow',
        ops: ['membership.add'],
        perActorDailyCap: 1,
      },
    ];

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

  test('policy enforcement is optional without storage', async () => {
    // Create new clean storage to avoid interference
    const cleanStorage = new MockStorage();
    configureMembership(cleanStorage, 'clean-ns', [ownerPubKey]);

    // Should work without any policy checks
    await expect(
      addMember(ownerPubKey, ownerPubKey, 'OWNER')
    ).resolves.toBeUndefined();
    await expect(
      addMember(ownerPubKey, 'user-123', 'MEMBER')
    ).resolves.toBeUndefined();
    await expect(
      addMember(ownerPubKey, 'user-456', 'MEMBER')
    ).resolves.toBeUndefined();
  });

  test('role-based restrictions work correctly', async () => {
    // Create policy that prevents ADMIN from adding OWNER
    const policy = createStarterPolicy();
    policy.rules = [
      {
        effect: 'deny',
        ops: ['membership.add'],
        actorMinRole: 'ADMIN',
        targetMaxRole: 'OWNER',
      },
    ];

    await savePolicies(ns, storage, policy, { id: ownerPubKey, role: 'OWNER' });

    // ADMIN should be denied when trying to add OWNER
    await expect(
      addMember(adminPubKey, 'new-owner-123', 'OWNER')
    ).rejects.toThrow('POLICY_DENIED');

    // ADMIN should be allowed to add MEMBER
    await expect(
      addMember(adminPubKey, 'new-member-123', 'MEMBER')
    ).resolves.toBeUndefined();
  });
});
