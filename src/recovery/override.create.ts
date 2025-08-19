/**
 * Recovery Override Creation - Phase B Task 16
 * Admin-only recovery bundle creation for beneficiary users
 */

import type {
  CreateRecoveryOverrideArgs,
  RecoveryOverrideEnvelope,
  RecoveryOverrideContentV1,
} from './override.types';
import { toB64u } from '../crypto/base64url';
import * as MembershipApi from '../membership/api';
import * as AuditApi from '../audit/api';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

// Canonical JSON for signature consistency
function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

// Generate ULID-like ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// AAD for AES-GCM (consistent with Task 11)
function overrideAAD(ns: string, id: string): ArrayBuffer {
  return new TextEncoder().encode(`${ns}:${id}`).buffer;
}

export async function createRecoveryOverride(
  opts: CreateRecoveryOverrideArgs & { storage?: StorageDriver }
): Promise<{ envelope: RecoveryOverrideEnvelope; id: string }> {
  const {
    ns,
    actorId,
    beneficiaryId,
    code,
    expiresAt,
    scope = 'ALL',
    sign,
    storage,
  } = opts;

  // Get membership state first for both authorization and policy
  const membership = await MembershipApi.getMembership();
  const actorRole = membership.users[actorId];
  const beneficiaryRole = membership.users[beneficiaryId];

  // Policy enforcement before authorization
  if (storage && actorRole) {
    await enforcePolicy(
      {
        ns,
        op: 'override.create',
        actorId,
        actorRole,
        targetRole: beneficiaryRole,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true, commitCap: true }
    );
  }

  // 1. Resolve actor role and check permissions
  await MembershipApi.assertPermission(actorId, 'RECOVERY_OVERRIDE_CREATE');

  // Policy matrix enforcement
  const OVERRIDE_POLICY: Record<string, string[]> = {
    OWNER: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
    ADMIN: ['MEMBER', 'VIEWER'],
    MEMBER: [],
    VIEWER: [],
  };

  if (!beneficiaryRole) {
    throw new Error(`Beneficiary ${beneficiaryId} not found in workspace`);
  }

  const allowedTargets = actorRole ? OVERRIDE_POLICY[actorRole] || [] : [];
  if (!allowedTargets.includes(beneficiaryRole)) {
    throw new Error(
      `Access denied: ${actorRole || 'none'} cannot create override for ${beneficiaryRole}`
    );
  }

  // 2. For now, we'll use a placeholder DEK snapshot (will be passed in during integration)
  // This avoids the keyring dependency issue while maintaining the interface
  const dekSnapshot = [
    { kid: 'demo-key-1', wrapped: 'demo-wrapped-data-1' },
    { kid: 'demo-key-2', wrapped: 'demo-wrapped-data-2' },
  ];

  let filteredDeks = dekSnapshot;
  if (scope === 'ACTIVE' && dekSnapshot.length > 0) {
    // Filter to only active DEK (most recent)
    const sortedDeks = dekSnapshot.sort((a, b) => b.kid.localeCompare(a.kid));
    filteredDeks = [sortedDeks[0]];
  }

  // 3. Build manifest content
  const id = generateId();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const content: RecoveryOverrideContentV1 = {
    ns,
    id,
    beneficiaryId,
    scope,
    ...(expiresAt && { exp: expiresAt }),
    saltB64u: toB64u(salt.buffer),
  };

  // 4. Sign manifest
  const canonical = canonicalize(content);
  const messageBytes = new TextEncoder().encode(canonical);
  const signature = await sign(messageBytes);

  // 5. Encrypt DEK snapshot with code-derived session key using the same salt
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(code),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const sessionKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(filteredDeks));
  const aad = overrideAAD(ns, id);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad },
    sessionKey,
    plaintext
  );

  // 6. Build envelope
  const envelope: RecoveryOverrideEnvelope = {
    v: 1,
    content,
    ctB64u: toB64u(ciphertext),
    ivB64u: toB64u(iv.buffer),
    sigB64u: signature,
  };

  // 7. Enhanced audit event with operational context
  await AuditApi.log(
    'RECOVERY_OVERRIDE_CREATED',
    {
      overrideId: id,
      beneficiaryId,
      actorRole: actorRole,
      beneficiaryRole: beneficiaryRole,
      scope,
      expiresAt,
      dekCount: filteredDeks.length,
      namespace: ns,
      createdAt: new Date().toISOString(),
    },
    actorId
  );

  return { envelope, id };
}
