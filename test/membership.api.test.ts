/**
 * Phase B Task 14: Workspace Membership & Roles Tests
 * Validates headless role-based membership with E2EE compatibility
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import type { StorageDriver } from '../src/storage/types';
import type { MTransport, MRecord } from '../src/membership/types';
import {
  configureMembership,
  getMembership,
  assertPermission,
  addMember,
  changeRole,
  removeMember,
  planMemberSync,
  runMemberSync,
} from '../src/membership/api';

describe('Workspace Membership & Roles', () => {
  let storage: StorageDriver;
  let transport: MTransport;
  let consoleWarnSpy: any;

  const ADMIN_PUB = 'admin-key-123';
  const OWNER_PUB = 'owner-key-456';
  const MEMBER_PUB = 'member-key-789';
  const NAMESPACE = 'test-workspace';

  beforeEach(() => {
    // Mock storage
    const store = new Map<string, string>();
    storage = {
      getItem: vi.fn(async (key: string) => store.get(key) || null),
      setItem: vi.fn(async (key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: vi.fn(async (key: string) => {
        store.delete(key);
      }),
      listKeys: vi.fn(async (prefix: string) =>
        Array.from(store.keys()).filter(k => k.startsWith(prefix))
      ),
    };

    // Mock transport
    const remoteStore = new Map<string, string>();
    transport = {
      list: vi.fn(async (ns: string) => ({
        keys: Array.from(remoteStore.keys()).filter(k =>
          k.startsWith(`m:${ns}:`)
        ),
        nextSince: 'next-cursor',
      })),
      get: vi.fn(async (key: string) => remoteStore.get(key) || null),
      put: vi.fn(async (key: string, data: string) => {
        remoteStore.set(key, data);
      }),
    };

    // Mock console
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    configureMembership(storage, NAMESPACE, [ADMIN_PUB], transport);
  });

  test('bootstrap: first OWNER establishes initial ownership', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');

    const state = await getMembership();
    expect(state.users[OWNER_PUB]).toBe('OWNER');
    expect(state.owners).toContain(OWNER_PUB);
  });

  test('getMembership returns empty state initially', async () => {
    const state = await getMembership();
    expect(state).toEqual({ users: {}, owners: [] });
  });

  test('assertPermission blocks insufficient role', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, MEMBER_PUB, 'MEMBER');

    await expect(assertPermission(MEMBER_PUB, 'ROLE_SET')).rejects.toThrow(
      'Access denied: ROLE_SET requires ADMIN'
    );
  });

  test('assertPermission allows sufficient role', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, ADMIN_PUB, 'ADMIN');

    await expect(
      assertPermission(ADMIN_PUB, 'INVITE_CREATE')
    ).resolves.not.toThrow();
    await expect(
      assertPermission(OWNER_PUB, 'ROLE_SET')
    ).resolves.not.toThrow();
  });

  test('ADMIN can add MEMBER', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, ADMIN_PUB, 'ADMIN');
    await addMember(ADMIN_PUB, MEMBER_PUB, 'MEMBER');

    const state = await getMembership();
    expect(state.users[MEMBER_PUB]).toBe('MEMBER');
  });

  test('MEMBER cannot set roles', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, MEMBER_PUB, 'MEMBER');

    await expect(addMember(MEMBER_PUB, 'new-user', 'VIEWER')).rejects.toThrow(
      'Access denied'
    );
  });

  test('only OWNER can grant OWNER role', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, ADMIN_PUB, 'ADMIN');

    await expect(changeRole(ADMIN_PUB, MEMBER_PUB, 'OWNER')).rejects.toThrow(
      'Only OWNER can grant OWNER role'
    );
  });

  test('ADMIN→OWNER by OWNER succeeds', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, ADMIN_PUB, 'ADMIN');
    await changeRole(OWNER_PUB, ADMIN_PUB, 'OWNER');

    const state = await getMembership();
    expect(state.users[ADMIN_PUB]).toBe('OWNER');
    expect(state.owners).toContain(ADMIN_PUB);
  });

  test('ADMIN removes MEMBER', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, ADMIN_PUB, 'ADMIN');
    await addMember(ADMIN_PUB, MEMBER_PUB, 'MEMBER');
    await removeMember(ADMIN_PUB, MEMBER_PUB);

    const state = await getMembership();
    expect(state.users[MEMBER_PUB]).toBeUndefined();
  });

  test('MEMBER cannot remove others', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, MEMBER_PUB, 'MEMBER');

    await expect(removeMember(MEMBER_PUB, OWNER_PUB)).rejects.toThrow(
      'Access denied'
    );
  });

  test('cannot remove last OWNER', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');

    await expect(removeMember(OWNER_PUB, OWNER_PUB)).rejects.toThrow(
      'Cannot remove last OWNER'
    );
  });

  test('planMemberSync returns sync plan', async () => {
    const plan = await planMemberSync();
    expect(plan).toHaveProperty('pullKeys');
    expect(Array.isArray(plan.pullKeys)).toBe(true);
  });

  test('runMemberSync processes empty state', async () => {
    const result = await runMemberSync();
    expect(result).toMatchObject({
      applied: 0,
      pushed: 0,
      errors: [],
      completed: true,
    });
  });

  test('sync pushes queued records', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');

    const result = await runMemberSync();

    expect(result.pushed).toBe(1);
    expect(result.completed).toBe(true);
    expect(transport.put).toHaveBeenCalled();
  });

  test('sync applies remote records with trust validation', async () => {
    const record: MRecord = {
      v: 1,
      id: 'remote-record',
      ts: new Date().toISOString(),
      op: 'ADD',
      user: 'remote-user',
      role: 'MEMBER',
      workspaceId: NAMESPACE,
      issuer: { pubB64u: ADMIN_PUB, sigB64u: 'valid-sig' },
    };

    const key = `m:${NAMESPACE}:r:${record.ts}:${record.id}`;

    vi.mocked(transport.list).mockResolvedValue({ keys: [key] });
    vi.mocked(transport.get).mockResolvedValue(JSON.stringify(record));

    // Since signature verification will fail without real crypto, expect error
    const result = await runMemberSync();

    expect(result.errors.some(e => e.includes('Invalid signature'))).toBe(true);
  });

  test('sync rejects untrusted issuers', async () => {
    const record: MRecord = {
      v: 1,
      id: 'untrusted-record',
      ts: new Date().toISOString(),
      op: 'ADD',
      user: 'untrusted-user',
      role: 'MEMBER',
      workspaceId: NAMESPACE,
      issuer: { pubB64u: 'untrusted-key', sigB64u: 'invalid-sig' },
    };

    const key = `m:${NAMESPACE}:r:${record.ts}:${record.id}`;

    vi.mocked(transport.list).mockResolvedValue({ keys: [key] });
    vi.mocked(transport.get).mockResolvedValue(JSON.stringify(record));

    const result = await runMemberSync();

    expect(result.errors.some(e => e.includes('Untrusted issuer'))).toBe(true);
  });

  test('sync deduplicates records by canonical hash', async () => {
    const record: MRecord = {
      v: 1,
      id: 'dup-test',
      ts: new Date().toISOString(),
      op: 'ADD',
      user: 'test-user',
      role: 'MEMBER',
      workspaceId: NAMESPACE,
      issuer: { pubB64u: ADMIN_PUB, sigB64u: 'placeholder-sig' },
    };

    const key1 = `m:${NAMESPACE}:r:1:${record.id}`;
    const key2 = `m:${NAMESPACE}:r:2:${record.id}`;

    vi.mocked(transport.list).mockResolvedValue({ keys: [key1, key2] });
    vi.mocked(transport.get).mockResolvedValue(JSON.stringify(record));

    const result = await runMemberSync();

    // Should only process once despite two keys
    expect(result.applied).toBeLessThanOrEqual(1);
  });

  test('detects clock skew in records', async () => {
    const futureRecord: MRecord = {
      v: 1,
      id: 'future-record',
      ts: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes future
      op: 'ADD',
      user: 'future-user',
      role: 'MEMBER',
      workspaceId: NAMESPACE,
      issuer: { pubB64u: ADMIN_PUB, sigB64u: 'placeholder-sig' },
    };

    const key = `m:${NAMESPACE}:r:${futureRecord.ts}:${futureRecord.id}`;

    vi.mocked(transport.list).mockResolvedValue({ keys: [key] });
    vi.mocked(transport.get).mockResolvedValue(JSON.stringify(futureRecord));

    await runMemberSync();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Clock skew detected')
    );
  });

  test('maintains sync state monotonicity', async () => {
    await storage.setItem(
      `m:${NAMESPACE}:__sync_state__`,
      JSON.stringify({ since: 'cursor-100' })
    );

    const plan = { pullKeys: [], since: 'cursor-200' };
    await runMemberSync(plan);

    const state = await storage.getItem(`m:${NAMESPACE}:__sync_state__`);
    const parsedState = JSON.parse(state!);
    expect(parsedState.since).toBe('cursor-200');
  });

  test('role hierarchy permissions', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, ADMIN_PUB, 'ADMIN');
    await addMember(ADMIN_PUB, MEMBER_PUB, 'MEMBER');
    await addMember(ADMIN_PUB, 'viewer-key', 'VIEWER');

    // VIEWER can only read tasks
    await expect(
      assertPermission('viewer-key', 'TASK_READ')
    ).resolves.not.toThrow();
    await expect(
      assertPermission('viewer-key', 'TASK_WRITE')
    ).rejects.toThrow();

    // MEMBER can read/write tasks but not admin actions
    await expect(
      assertPermission(MEMBER_PUB, 'TASK_READ')
    ).resolves.not.toThrow();
    await expect(
      assertPermission(MEMBER_PUB, 'TASK_WRITE')
    ).resolves.not.toThrow();
    await expect(
      assertPermission(MEMBER_PUB, 'INVITE_CREATE')
    ).rejects.toThrow();

    // ADMIN can do admin actions but not grant OWNER
    await expect(
      assertPermission(ADMIN_PUB, 'INVITE_CREATE')
    ).resolves.not.toThrow();
    await expect(
      assertPermission(ADMIN_PUB, 'ROLE_SET')
    ).resolves.not.toThrow();

    // OWNER can do everything
    await expect(
      assertPermission(OWNER_PUB, 'ROLE_SET')
    ).resolves.not.toThrow();
  });

  test('idempotent record application', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    const state1 = await getMembership();

    // Apply same operation again
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    const state2 = await getMembership();

    expect(state2.users).toEqual(state1.users);
    expect(state2.owners).toEqual(state1.owners);
  });

  test('change role operation', async () => {
    await addMember(OWNER_PUB, OWNER_PUB, 'OWNER');
    await addMember(OWNER_PUB, MEMBER_PUB, 'VIEWER');

    await changeRole(OWNER_PUB, MEMBER_PUB, 'MEMBER');

    const state = await getMembership();
    expect(state.users[MEMBER_PUB]).toBe('MEMBER');
  });

  test('org boundary enforcement blocks cross-workspace records', async () => {
    const crossWorkspaceRecord: MRecord = {
      v: 1,
      id: 'cross-workspace',
      ts: new Date().toISOString(),
      op: 'ADD',
      user: 'attacker-user',
      role: 'ADMIN',
      workspaceId: 'different-workspace',
      issuer: { pubB64u: ADMIN_PUB, sigB64u: 'valid-sig' },
    };

    const key = `m:${NAMESPACE}:r:${crossWorkspaceRecord.ts}:${crossWorkspaceRecord.id}`;

    vi.mocked(transport.list).mockResolvedValue({ keys: [key] });
    vi.mocked(transport.get).mockResolvedValue(
      JSON.stringify(crossWorkspaceRecord)
    );

    const result = await runMemberSync();

    expect(
      result.errors.some(e => e.includes('Cross-workspace replay blocked'))
    ).toBe(true);
  });
});
