/**
 * Trust Store & Audit Integration - Phase B Task 18
 * Per-namespace trusted signer management with audit trail
 */

import * as AuditApi from '../audit/api';
import type { StorageDriver } from '../storage/types';

let storage: StorageDriver | null = null;

export function configureTrustStore(storageDriver: StorageDriver): void {
  storage = storageDriver;
}

// Storage key helpers
const trustKey = (ns: string) => `trust:${ns}:signers`;

/**
 * Add a trusted signer to namespace allowlist
 */
export async function addTrustedSigner(
  ns: string,
  pubB64u: string,
  actor?: string
): Promise<void> {
  if (!storage) throw new Error('Trust store not configured');

  const existing = await listTrustedSigners(ns);
  if (existing.includes(pubB64u)) return; // Already trusted

  const updated = [...existing, pubB64u];
  await storage.setItem(trustKey(ns), JSON.stringify(updated));

  // Emit audit event
  await AuditApi.log(
    'TRUST_SIGNER_ADDED',
    {
      namespace: ns,
      signerPubKey: pubB64u,
      totalSigners: updated.length,
    },
    actor || 'system'
  );
}

/**
 * List all trusted signers for namespace
 */
export async function listTrustedSigners(ns: string): Promise<string[]> {
  if (!storage) return [];

  try {
    const data = await storage.getItem(trustKey(ns));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Remove a trusted signer from namespace allowlist
 */
export async function removeTrustedSigner(
  ns: string,
  pubB64u: string,
  actor?: string
): Promise<void> {
  if (!storage) throw new Error('Trust store not configured');

  const existing = await listTrustedSigners(ns);
  const updated = existing.filter(key => key !== pubB64u);

  if (updated.length === existing.length) return; // Not found

  await storage.setItem(trustKey(ns), JSON.stringify(updated));

  // Emit audit event
  await AuditApi.log(
    'TRUST_SIGNER_REMOVED',
    {
      namespace: ns,
      signerPubKey: pubB64u,
      totalSigners: updated.length,
    },
    actor || 'system'
  );
}

/**
 * Log pack attestation audit event
 */
export async function auditPackAttested(
  ns: string,
  eventsHash: string,
  signer: string,
  actor?: string
): Promise<void> {
  await AuditApi.log(
    'PACK_ATTESTED',
    {
      namespace: ns,
      eventsHash,
      signerPubKey: signer,
      attestedAt: new Date().toISOString(),
    },
    actor || 'system'
  );
}

/**
 * Log pack verification audit events
 */
export async function auditPackVerification(
  ns: string,
  eventsHash: string,
  result: 'success' | 'failure',
  reason?: string,
  signer?: string
): Promise<void> {
  const eventType =
    result === 'success' ? 'PACK_VERIFY_OK' : 'PACK_VERIFY_FAIL';

  await AuditApi.log(
    eventType,
    {
      namespace: ns,
      eventsHash,
      ...(signer && { signerPubKey: signer }),
      ...(reason && { reason }),
      verifiedAt: new Date().toISOString(),
    },
    'sync-system'
  );
}
