/**
 * Workspace Membership & Roles API - Phase B Task 14
 * Headless role-based membership with E2EE compatibility
 */

import * as AuditApi from '../audit/api';
import { toB64u, fromB64u } from '../crypto/base64url';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

import type {
  Role,
  MOp,
  MRecord,
  MState,
  MTransport,
  MPlan,
  MResult,
} from './types';

let storage: StorageDriver;
let namespace: string;
let trustedAdmins: string[];
let transport: MTransport;
let skewTolerance = 5 * 60 * 1000; // 5 minutes default

export function configureMembership(
  storageDriver: StorageDriver,
  ns: string,
  admins: string[],
  transportImpl?: MTransport,
  skewToleranceMs?: number
): void {
  storage = storageDriver;
  namespace = ns;
  trustedAdmins = admins;
  if (transportImpl) transport = transportImpl;
  if (skewToleranceMs) skewTolerance = skewToleranceMs;
  // Initialize audit logging for membership events
  AuditApi.configureAudit(storageDriver, ns);
}

// Canonical JSON + utilities
function canon(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canon).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canon(obj[k])}`).join(',') + '}';
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function verifySignature(record: MRecord): Promise<boolean> {
  try {
    const { issuer, ...recordWithoutSig } = record;
    const { sigB64u, ...issuerWithoutSig } = issuer;
    const canonical = canon({ ...recordWithoutSig, issuer: issuerWithoutSig });
    const pubKey = await crypto.subtle.importKey(
      'spki',
      fromB64u(issuer.pubB64u),
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify(
      'Ed25519',
      pubKey,
      fromB64u(sigB64u),
      new TextEncoder().encode(canonical)
    );
  } catch {
    return false;
  }
}

// State management
export async function getMembership(): Promise<MState> {
  try {
    const data = await storage.getItem(`m:${namespace}:state`);
    return data ? JSON.parse(data) : { users: {}, owners: [] };
  } catch {
    return { users: {}, owners: [] };
  }
}

async function saveMembership(state: MState): Promise<void> {
  await storage.setItem(`m:${namespace}:state`, JSON.stringify(state));
}

// Permission system
const ROLE_LEVELS: Record<Role, number> = {
  VIEWER: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
};
function hasPermission(
  userRole: Role | undefined,
  requiredRole: Role
): boolean {
  return userRole ? ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole] : false;
}

export async function assertPermission(
  actor: string,
  action:
    | 'INVITE_CREATE'
    | 'INVITE_REVOKE'
    | 'SIGNER_REVOKE'
    | 'RECOVERY_CREATE'
    | 'RECOVERY_OVERRIDE_CREATE'
    | 'ROLE_SET'
    | 'ROLE_REMOVE'
    | 'TASK_WRITE'
    | 'TASK_READ',
  context?: { targetRole?: Role }
): Promise<void> {
  const state = await getMembership();
  const userRole = state.users[actor];
  const actionRequirements: Record<string, Role> = {
    INVITE_CREATE: 'ADMIN',
    INVITE_REVOKE: 'ADMIN',
    SIGNER_REVOKE: 'ADMIN',
    RECOVERY_CREATE: 'ADMIN',
    RECOVERY_OVERRIDE_CREATE: 'ADMIN',
    ROLE_SET: 'ADMIN',
    ROLE_REMOVE: 'ADMIN',
    TASK_WRITE: 'MEMBER',
    TASK_READ: 'VIEWER',
  };
  const required = actionRequirements[action];
  if (!hasPermission(userRole, required))
    throw new Error(
      `Access denied: ${action} requires ${required}, user has ${userRole || 'none'}`
    );

  // Special case: INVITE_CREATE with target role validation
  if (action === 'INVITE_CREATE' && context?.targetRole) {
    const INVITE_ROLE_POLICY: Record<Role, Role[]> = {
      OWNER: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
      ADMIN: ['ADMIN', 'MEMBER', 'VIEWER'],
      MEMBER: [],
      VIEWER: [],
    };
    const allowedRoles = userRole ? INVITE_ROLE_POLICY[userRole] || [] : [];
    if (!allowedRoles.includes(context.targetRole))
      throw new Error(
        `Access denied: ${userRole || 'none'} cannot issue ${context.targetRole} invites`
      );
  }
}

// State reducer
function applyRecord(state: MState, record: MRecord): MState {
  const newState = {
    ...state,
    users: { ...state.users },
    owners: [...state.owners],
  };
  const prevRole = newState.users[record.user];

  switch (record.op) {
    case 'ADD': {
      if (record.role) {
        newState.users[record.user] = record.role;
        if (record.role === 'OWNER') {
          if (!newState.owners.includes(record.user))
            newState.owners.push(record.user);
          // Detect concurrent OWNER transitions
          const transitionKey = `${record.ts}:${record.issuer.pubB64u}`;
          if (
            newState.lastOwnerTransition &&
            newState.lastOwnerTransition !== transitionKey
          ) {
            console.warn(
              `Concurrent OWNER transition detected: ${newState.lastOwnerTransition} vs ${transitionKey}`
            );
          }
          newState.lastOwnerTransition = transitionKey;
        }
      }
      break;
    }
    case 'REMOVE': {
      delete newState.users[record.user];
      newState.owners = newState.owners.filter(o => o !== record.user);
      break;
    }
    case 'ROLE': {
      if (record.role && newState.users[record.user]) {
        // Audit role changes (especially downgrades)
        if (prevRole && ROLE_LEVELS[prevRole] > ROLE_LEVELS[record.role]) {
          const auditEvent = {
            actor: record.issuer.pubB64u,
            target: record.user,
            prevRole,
            nextRole: record.role,
            ts: record.ts,
            workspaceId: record.workspaceId,
          };
          console.warn(
            `Role downgrade: ${record.user} ${prevRole}→${record.role} by ${record.issuer.pubB64u} at ${record.ts}`,
            auditEvent
          );
          // Emit structured audit event
          AuditApi.log(
            'ROLE_DOWNGRADE',
            auditEvent,
            record.issuer.pubB64u
          ).catch(error => console.error('Audit log failed:', error));
        }
        newState.users[record.user] = record.role;
        if (record.role === 'OWNER') {
          if (!newState.owners.includes(record.user))
            newState.owners.push(record.user);
          // Detect concurrent OWNER transitions
          const transitionKey = `${record.ts}:${record.issuer.pubB64u}`;
          if (
            newState.lastOwnerTransition &&
            newState.lastOwnerTransition !== transitionKey
          ) {
            const concurrentEvent = {
              currentTransition: newState.lastOwnerTransition,
              newTransition: transitionKey,
              user: record.user,
            };
            console.warn(
              `Concurrent OWNER transition detected: ${newState.lastOwnerTransition} vs ${transitionKey}`,
              concurrentEvent
            );
            // Emit structured audit event
            AuditApi.log(
              'OWNER_TRANSITION',
              concurrentEvent,
              record.issuer.pubB64u
            ).catch(error => console.error('Audit log failed:', error));
          }
          newState.lastOwnerTransition = transitionKey;
        } else {
          newState.owners = newState.owners.filter(o => o !== record.user);
        }
      }
      break;
    }
  }
  newState.ts = record.ts;
  return newState;
}

// Record creation
async function createRecord(
  issuer: string,
  op: MOp,
  user: string,
  role?: Role
): Promise<MRecord> {
  const id = generateId();
  const ts = new Date().toISOString();
  const recordWithoutSig = {
    v: 1 as const,
    id,
    ts,
    op,
    user,
    workspaceId: namespace,
    ...(role && { role }),
    issuer: { pubB64u: issuer },
  };
  const canonical = canon(recordWithoutSig);
  const sigBytes = new TextEncoder().encode(
    'placeholder-sig-' + canonical.slice(0, 16)
  );
  const sigB64u = toB64u(sigBytes.buffer);
  return { ...recordWithoutSig, issuer: { pubB64u: issuer, sigB64u } };
}

// Public operations
export async function addMember(
  issuer: string,
  user: string,
  role: Role
): Promise<void> {
  const state = await getMembership();

  // Handle initial owner case first (before policy)
  if (state.owners.length === 0 && role === 'OWNER') {
    const record = await createRecord(issuer, 'ADD', user, role);
    const newState = applyRecord(state, record);
    await saveMembership(newState);
    await storage.setItem(
      `m:${namespace}:out:${record.id}`,
      JSON.stringify(record)
    );
    // Emit audit event for member addition
    AuditApi.log(
      'MEMBER_ADDED',
      { user, role, initialOwner: true },
      issuer
    ).catch(error => console.error('Audit log failed:', error));
    return;
  }

  // Policy enforcement before authorization
  const issuerRole = state.users[issuer];
  if (issuerRole) {
    await enforcePolicy(
      {
        ns: namespace,
        op: 'membership.add',
        actorId: issuer,
        actorRole: issuerRole,
        targetRole: role,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true, commitCap: true }
    );
  }

  await assertPermission(issuer, 'ROLE_SET');
  const record = await createRecord(issuer, 'ADD', user, role);
  const newState = applyRecord(state, record);
  await saveMembership(newState);
  await storage.setItem(
    `m:${namespace}:out:${record.id}`,
    JSON.stringify(record)
  );
  // Emit audit event for member addition
  AuditApi.log('MEMBER_ADDED', { user, role }, issuer).catch(error =>
    console.error('Audit log failed:', error)
  );
}

export async function removeMember(
  issuer: string,
  user: string
): Promise<void> {
  const state = await getMembership();

  // Policy enforcement before authorization
  const issuerRole = state.users[issuer];
  const targetRole = state.users[user];
  if (issuerRole) {
    await enforcePolicy(
      {
        ns: namespace,
        op: 'membership.remove',
        actorId: issuer,
        actorRole: issuerRole,
        targetRole,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true }
    );
  }

  await assertPermission(issuer, 'ROLE_REMOVE');
  if (state.owners.includes(user) && state.owners.length <= 1)
    throw new Error('Cannot remove last OWNER');
  const record = await createRecord(issuer, 'REMOVE', user);
  const newState = applyRecord(state, record);
  await saveMembership(newState);
  await storage.setItem(
    `m:${namespace}:out:${record.id}`,
    JSON.stringify(record)
  );
  // Emit audit event for member removal
  AuditApi.log(
    'MEMBER_REMOVED',
    { user, removedRole: state.users[user] },
    issuer
  ).catch(error => console.error('Audit log failed:', error));
}

export async function changeRole(
  issuer: string,
  user: string,
  role: Role
): Promise<void> {
  const state = await getMembership();

  // Policy enforcement before authorization
  const issuerRole = state.users[issuer];
  if (issuerRole) {
    await enforcePolicy(
      {
        ns: namespace,
        op: 'membership.change',
        actorId: issuer,
        actorRole: issuerRole,
        targetRole: role,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true }
    );
  }

  if (role === 'OWNER' && !state.owners.includes(issuer))
    throw new Error('Only OWNER can grant OWNER role');
  await assertPermission(issuer, 'ROLE_SET');
  const record = await createRecord(issuer, 'ROLE', user, role);
  const newState = applyRecord(state, record);
  await saveMembership(newState);
  await storage.setItem(
    `m:${namespace}:out:${record.id}`,
    JSON.stringify(record)
  );
}

// Sync state management
async function getSyncState(): Promise<{ since?: string }> {
  try {
    const data = await storage.getItem(`m:${namespace}:__sync_state__`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}
async function setSyncState(state: { since?: string }): Promise<void> {
  await storage.setItem(`m:${namespace}:__sync_state__`, JSON.stringify(state));
}

export async function planMemberSync(): Promise<MPlan> {
  if (!transport) throw new Error('Transport not configured');
  const state = await getSyncState();
  const result = await transport.list(namespace, state.since);
  return {
    pullKeys: result.keys,
    ...(result.nextSince && { since: result.nextSince }),
  };
}

export async function runMemberSync(plan?: MPlan): Promise<MResult> {
  if (!transport) throw new Error('Transport not configured');
  const syncPlan = plan || (await planMemberSync());
  const result: MResult = {
    applied: 0,
    pushed: 0,
    errors: [],
    completed: false,
  };

  try {
    const seenHashes = new Set<string>();

    // Pull and apply remote records
    for (const key of syncPlan.pullKeys) {
      try {
        const data = await transport.get(key);
        if (!data) continue;
        const record: MRecord = JSON.parse(data);
        const recordHash = canon(record);
        if (seenHashes.has(recordHash)) continue;
        seenHashes.add(recordHash);

        // Clock skew hardening with configurable tolerance
        const recordTime = new Date(record.ts).getTime();
        const skewMs = Math.abs(recordTime - Date.now());
        if (skewMs > skewTolerance)
          console.warn(
            `Clock skew detected: record ${record.id} offset ${Math.round(skewMs / 1000)}s (tolerance: ${Math.round(skewTolerance / 1000)}s)`
          );

        // Verify signature and trust + org boundary
        const currentState = await getMembership();
        const trustedIssuers = [...trustedAdmins, ...currentState.owners];
        if (record.workspaceId !== namespace) {
          result.errors.push(
            `Cross-workspace replay blocked: ${record.workspaceId} != ${namespace}`
          );
          continue;
        }
        if (!trustedIssuers.includes(record.issuer.pubB64u)) {
          result.errors.push(`Untrusted issuer: ${record.issuer.pubB64u}`);
          continue;
        }
        if (!(await verifySignature(record))) {
          result.errors.push(`Invalid signature for record: ${record.id}`);
          continue;
        }

        // Apply to state
        const newState = applyRecord(currentState, record);
        await saveMembership(newState);
        result.applied++;
      } catch (error) {
        result.errors.push(
          `Error processing ${key}: ${error instanceof Error ? error.message : 'Unknown'}`
        );
      }
    }

    // Push local outbox in batches
    const outboxKeys = await storage.listKeys(`m:${namespace}:out:`);
    for (let i = 0; i < outboxKeys.length; i += 100) {
      const batch = outboxKeys.slice(i, i + 100);
      for (const outboxKey of batch) {
        try {
          const data = await storage.getItem(outboxKey);
          if (!data) continue;
          const record: MRecord = JSON.parse(data);
          await transport.put(
            `m:${namespace}:r:${record.ts}:${record.id}`,
            data,
            record.ts
          );
          await storage.removeItem(outboxKey);
          result.pushed++;
        } catch (error) {
          result.errors.push(
            `Push error ${outboxKey}: ${error instanceof Error ? error.message : 'Unknown'}`
          );
        }
      }
    }

    // Update sync state with monotonicity
    const currentState = await getSyncState();
    if (
      syncPlan.since &&
      (!currentState.since || syncPlan.since > currentState.since)
    )
      await setSyncState({ since: syncPlan.since });

    result.completed = true;
  } catch (error) {
    result.errors.push(
      `Sync failed: ${error instanceof Error ? error.message : 'Unknown'}`
    );
  }

  return result;
}
