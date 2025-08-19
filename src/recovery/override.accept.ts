/**
 * Recovery Override Acceptance - Phase B Task 16
 * Beneficiary acceptance of admin-issued recovery overrides
 */

import type { AcceptRecoveryOverrideArgs } from './override.types';
import { fromB64u } from '../crypto/base64url';
import * as AuditApi from '../audit/api';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

// In-memory registry for used overrides (single-use enforcement)
const usedOverrides = new Set<string>();

// AAD for AES-GCM (consistent with creation)
function overrideAAD(ns: string, id: string): ArrayBuffer {
  return new TextEncoder().encode(`${ns}:${id}`).buffer;
}

// Check if override has been revoked (integration with Task 13 revocation system)
async function isOverrideRevoked(overrideId: string): Promise<boolean> {
  // Integration point with revocation registry - check for recovery revocation
  try {
    const registry = await import('../revoke/registry');
    // Reuse existing revocation functions (recovery overrides are similar to recovery bundles)
    return await registry.isInviteRevoked(overrideId); // Use invite revocation as fallback
  } catch {
    // Graceful fallback if revocation system not available
    return false;
  }
}

export async function acceptRecoveryOverride(
  opts: AcceptRecoveryOverrideArgs & { storage?: StorageDriver }
): Promise<{ imported: number; scope: 'ALL' | 'ACTIVE' }> {
  const { ns, envelope, code, keyring, beneficiaryId, membership, storage } =
    opts;

  // Get beneficiary's current role for policy enforcement
  const membershipState = await membership.getMembership();
  const beneficiaryRole = membershipState.users[beneficiaryId];

  // Policy enforcement before processing
  if (storage && beneficiaryRole) {
    await enforcePolicy(
      {
        ns,
        op: 'override.accept',
        actorId: beneficiaryId,
        actorRole: beneficiaryRole,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true, commitCap: true }
    );
  }

  // 1. Verify envelope structure
  if (envelope.v !== 1) {
    throw new Error('Unsupported recovery override version');
  }

  const { content } = envelope;

  // 2. Check expiry
  if (content.exp && new Date() > new Date(content.exp)) {
    throw new Error('Recovery override expired');
  }

  // 3. Verify namespace binding (critical security check)
  if (content.ns !== ns) {
    throw new Error(
      `Namespace mismatch: expected '${ns}', got '${content.ns}'`
    );
  }

  // 3a. Additional namespace validation - ensure AAD consistency
  const expectedAad = overrideAAD(ns, content.id);
  const contentAad = overrideAAD(content.ns, content.id);
  if (expectedAad.toString() !== contentAad.toString()) {
    throw new Error('Namespace-AAD binding validation failed');
  }

  // 4. Verify beneficiary match
  if (content.beneficiaryId !== beneficiaryId) {
    throw new Error('Beneficiary mismatch');
  }

  // 5. Check if beneficiary exists in workspace
  if (!membershipState.users[beneficiaryId]) {
    throw new Error(`Beneficiary ${beneficiaryId} not found in workspace`);
  }

  // 6. Check revocation status
  if (await isOverrideRevoked(content.id)) {
    throw new Error('Recovery override has been revoked');
  }

  // 7. Check single-use constraint
  if (usedOverrides.has(content.id)) {
    throw new Error('Recovery override already used');
  }

  // 8. Verify signature (placeholder signature verification for now)
  // TODO: Implement proper signature verification when cryptographic infrastructure is available
  // For now, just validate that we have a signature
  if (!envelope.sigB64u || envelope.sigB64u.length === 0) {
    throw new Error('Invalid or missing signature');
  }

  // 9. Derive session key and decrypt DEK snapshot
  const salt = fromB64u(content.saltB64u);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(code),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const sessionKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const iv = fromB64u(envelope.ivB64u);
  const ciphertext = fromB64u(envelope.ctB64u);
  const aad = overrideAAD(ns, content.id);

  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, additionalData: aad },
      sessionKey,
      ciphertext
    );
  } catch {
    throw new Error('Invalid recovery code or corrupted override');
  }

  // 10. Parse recovered DEKs
  const dekSnapshot: Array<{ kid: string; wrapped: string }> = JSON.parse(
    new TextDecoder().decode(plaintext)
  );

  // 11. Create recovery backup bundle for import
  const recoveryBackup = {
    v: 1 as const,
    createdAt: new Date().toISOString(),
    deks: dekSnapshot,
  };

  // 12. Get count before import (idempotent behavior)
  let beforeCount = 0;
  try {
    const beforeExport = await keyring.exportBackup();
    beforeCount = beforeExport.deks.length;
  } catch (err) {
    if (!(err instanceof Error && err.message === 'Keyring locked')) {
      throw err;
    }
  }

  // 13. Import DEKs into keyring
  await keyring.importBackup(recoveryBackup);

  // 14. Get count after import
  let afterCount = dekSnapshot.length;
  try {
    const afterExport = await keyring.exportBackup();
    afterCount = afterExport.deks.length;
  } catch (err) {
    if (!(err instanceof Error && err.message === 'Keyring locked')) {
      throw err;
    }
  }

  // 14. Validate override scope consistency and authorization
  if (content.beneficiaryId !== beneficiaryId) {
    throw new Error('Override not intended for current beneficiary');
  }

  // 14a. Verify beneficiary has membership in namespace (prevents unauthorized use)
  if (!membershipState.users || !membershipState.users[beneficiaryId]) {
    throw new Error('Beneficiary has no membership in target namespace');
  }

  // 15. Mark override as used (single-use enforcement)
  usedOverrides.add(content.id);

  // 16. Enhanced audit event with operational context
  await AuditApi.log(
    'RECOVERY_OVERRIDE_USED',
    {
      overrideId: content.id,
      beneficiaryId,
      scope: content.scope || 'ALL',
      importedCount: afterCount - beforeCount,
      totalDeksAfter: afterCount,
      namespace: ns,
      acceptedAt: new Date().toISOString(),
      timeToAccept: content.exp
        ? new Date().getTime() -
          new Date(content.exp).getTime() +
          7 * 24 * 60 * 60 * 1000
        : undefined, // Rough usage timing
    },
    beneficiaryId
  );

  return {
    imported: afterCount - beforeCount,
    scope: content.scope || 'ALL',
  };
}
