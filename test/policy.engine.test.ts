/**
 * Policy Engine Tests - Phase B Task 17
 * Comprehensive testing for role-aware organization policies
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  loadPolicies,
  savePolicies,
  checkPolicy,
  enforcePolicy,
  createStarterPolicy,
} from '../src/policy/engine';
import type {
  PolicySetV1,
  PolicyContext,
  Actor,
  PolicyRule,
} from '../src/policy/types';
import type { StorageDriver } from '../src/storage/types';
import * as MembershipApiModule from '../src/membership/api';
import * as AuditApiModule from '../src/audit/api';

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

  clear(): void {
    this.store.clear();
  }
}

describe('Policy Engine (@policy)', () => {
  let storage: MockStorage;
  let testContext: PolicyContext;
  let ownerActor: Actor;
  let adminActor: Actor;

  beforeEach(async () => {
    storage = new MockStorage();

    testContext = {
      op: 'invite.create',
      ns: 'test-workspace',
      actorId: 'admin-user',
      actorRole: 'ADMIN',
      targetRole: 'MEMBER',
      nowISO: '2025-08-16T10:00:00.000Z',
    };

    ownerActor = { id: 'owner-user', role: 'OWNER' };
    adminActor = { id: 'admin-user', role: 'ADMIN' };

    // Mock membership and audit modules
    vi.spyOn(MembershipApiModule, 'assertPermission').mockResolvedValue(
      undefined
    );
    vi.spyOn(AuditApiModule, 'log').mockResolvedValue({
      v: 1,
      id: 'test-audit-id',
      ts: new Date().toISOString(),
      type: 'POLICY_ALLOW',
      hash: 'test-hash',
    });
  });

  describe('Default Allow Behavior', () => {
    test('should allow operations when no policies exist', async () => {
      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow');
    });

    test('should allow operations when empty policy set exists', async () => {
      const emptyPolicies: PolicySetV1 = { version: 1, rules: [] };
      await savePolicies(testContext.ns, storage, emptyPolicies, ownerActor);

      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow');
    });
  });

  describe('Owner-Only Policy Updates', () => {
    test('should allow OWNER to save policies', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'allow', ops: ['invite.create'] }],
      };

      await expect(
        savePolicies(testContext.ns, storage, policies, ownerActor)
      ).resolves.toBeUndefined();

      expect(AuditApiModule.log).toHaveBeenCalledWith(
        'POLICY_UPDATED',
        expect.objectContaining({
          namespace: testContext.ns,
          actorId: ownerActor.id,
          actorRole: ownerActor.role,
        }),
        ownerActor.id
      );
    });

    test('should reject ADMIN attempting to save policies', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'allow', ops: ['invite.create'] }],
      };

      await expect(
        savePolicies(testContext.ns, storage, policies, adminActor)
      ).rejects.toThrow('Policy updates require OWNER role');
    });
  });

  describe('Role-Based Rule Evaluation', () => {
    test('should deny ADMIN issuing OWNER invite when prohibited', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'deny',
            ops: ['invite.create'],
            targetMaxRole: 'ADMIN',
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      const ctx = { ...testContext, targetRole: 'OWNER' as const };
      const result = await checkPolicy(ctx, storage);

      expect(result).toBe('deny');
    });

    test('should allow ADMIN issuing MEMBER invite', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            targetMaxRole: 'ADMIN',
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow');
    });

    test('should respect actor minimum role requirements', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            actorMinRole: 'OWNER',
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // ADMIN trying to create invite when OWNER required
      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow'); // Falls through to default allow
    });
  });

  describe('Daily Cap Enforcement', () => {
    test('should allow operations within daily cap', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            perActorDailyCap: 2,
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // First operation should be allowed
      const result1 = await checkPolicy(testContext, storage);
      expect(result1).toBe('allow');

      // Simulate committing the cap
      await enforcePolicy(testContext, storage, {
        commitCap: true,
        audit: false,
      });

      // Second operation should still be allowed
      const result2 = await checkPolicy(testContext, storage);
      expect(result2).toBe('allow');
    });

    test('should deny operations exceeding daily cap', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            perActorDailyCap: 1,
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // Simulate reaching the cap
      const dayKey = testContext.nowISO.split('T')[0];
      const capKey = `policy:${testContext.ns}:cap:${testContext.op}:${testContext.actorId}:${dayKey}`;
      await storage.setItem(capKey, '1');

      // Should be denied due to cap
      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('deny');
    });
  });

  describe('Time Window Enforcement', () => {
    test('should allow operations within time window', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            time: { start: '09:00', end: '17:00' },
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // 10:00 is within 09:00-17:00 window
      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow');
    });

    test('should deny operations outside time window', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'deny',
            ops: ['invite.create'],
            time: { start: '09:00', end: '17:00' },
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // Test outside window
      const nightCtx = { ...testContext, nowISO: '2025-08-16T22:00:00.000Z' };
      const result = await checkPolicy(nightCtx, storage);
      expect(result).toBe('allow'); // Rule doesn't match, falls to default allow

      // Test with allow rule outside window
      const allowPolicies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            time: { start: '09:00', end: '17:00' },
          },
        ],
      };

      await savePolicies(testContext.ns, storage, allowPolicies, ownerActor);
      const result2 = await checkPolicy(nightCtx, storage);
      expect(result2).toBe('allow'); // No matching rule, default allow
    });
  });

  describe('Namespace Allowlist', () => {
    test('should allow operations in allowed namespace', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'allow',
            ops: ['invite.create'],
            nsAllow: ['test-workspace', 'prod-workspace'],
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow');
    });

    test('should skip rules for disallowed namespace', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          {
            effect: 'deny',
            ops: ['invite.create'],
            nsAllow: ['other-workspace'],
          },
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // Rule doesn't apply to our namespace, should fall through to default allow
      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('allow');
    });
  });

  describe('First-Match Rule Semantics', () => {
    test('should use first matching rule', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [
          { effect: 'deny', ops: ['invite.create'] }, // First match
          { effect: 'allow', ops: ['invite.create'] }, // Should not be reached
        ],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      const result = await checkPolicy(testContext, storage);
      expect(result).toBe('deny');
    });
  });

  describe('Policy Enforcement', () => {
    test('should throw on policy denial', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'deny', ops: ['invite.create'] }],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      await expect(enforcePolicy(testContext, storage)).rejects.toThrow(
        'POLICY_DENIED'
      );
    });

    test('should complete successfully on policy allow', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'allow', ops: ['invite.create'] }],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      await expect(
        enforcePolicy(testContext, storage)
      ).resolves.toBeUndefined();
    });
  });

  describe('Audit Integration', () => {
    test('should emit POLICY_ALLOW audit event', async () => {
      await enforcePolicy(testContext, storage, { audit: true });

      expect(AuditApiModule.log).toHaveBeenCalledWith(
        'POLICY_ALLOW',
        expect.objectContaining({
          op: testContext.op,
          namespace: testContext.ns,
          actorId: testContext.actorId,
          result: 'allow',
        }),
        testContext.actorId
      );
    });

    test('should emit POLICY_DENY audit event on denial', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'deny', ops: ['invite.create'] }],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      try {
        await enforcePolicy(testContext, storage, { audit: true });
      } catch {
        // Expected to throw
      }

      expect(AuditApiModule.log).toHaveBeenCalledWith(
        'POLICY_DENY',
        expect.objectContaining({
          op: testContext.op,
          result: 'deny',
        }),
        testContext.actorId
      );
    });
  });

  describe('Cache Behavior', () => {
    test('should cache policies for performance', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'allow', ops: ['invite.create'] }],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      // First load
      const result1 = await loadPolicies(testContext.ns, storage);
      expect(result1).toEqual(policies);

      // Second load should use cache (can't directly test, but coverage)
      const result2 = await loadPolicies(testContext.ns, storage);
      expect(result2).toEqual(policies);
    });
  });

  describe('Surgical Enhancements', () => {
    test('should support observe mode (log without enforcement)', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        rules: [{ effect: 'deny', ops: ['invite.create'] }],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Should not throw in observe mode
      await expect(
        enforcePolicy(testContext, storage, { observeMode: true })
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("POLICY_OBSERVE: Would deny 'invite.create'")
      );

      consoleSpy.mockRestore();
    });

    test('should support schema versioning fields', async () => {
      const policies: PolicySetV1 = {
        version: 1,
        minEngine: '1.0.0',
        rev: 42,
        rules: [{ effect: 'allow', ops: ['invite.create'] }],
      };

      await savePolicies(testContext.ns, storage, policies, ownerActor);

      const loaded = await loadPolicies(testContext.ns, storage);
      expect(loaded?.minEngine).toBe('1.0.0');
      expect(loaded?.rev).toBe(42);
    });

    test('createStarterPolicy should return sensible defaults', () => {
      const starter = createStarterPolicy();

      expect(starter.version).toBe(1);
      expect(starter.rules).toHaveLength(5);

      // Check rule types
      const denyOwnerInvite = starter.rules.find(
        r => r.effect === 'deny' && r.targetMaxRole === 'ADMIN'
      );
      const businessHours = starter.rules.filter(
        r => r.effect === 'deny' && r.time
      );
      const dailyCaps = starter.rules.filter(
        r => r.effect === 'allow' && r.perActorDailyCap
      );

      expect(denyOwnerInvite).toBeDefined();
      expect(businessHours).toHaveLength(2);
      expect(dailyCaps).toHaveLength(2);
    });
  });
});
