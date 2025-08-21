/**
 * Phase B - Task 25: Witness Helpers
 * Canonical bytes, filtering, and verification utilities
 */

import { type Witness, type WitnessSig, type WitnessPolicy } from './types';

// Canonical JSON serialization (reuse from Task 18)
export function canonicalize(obj: any): string {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

// Build canonical payload for witness signing (base checkpoint without sigB64u)
export function buildWitnessPayload(base: any): Uint8Array {
  const forSigning = { ...base };
  delete forSigning.sigB64u;
  const canonical = canonicalize(forSigning);
  return new TextEncoder().encode(canonical);
}

// Filter witnesses by status
export function filterWitnessesByStatus(
  witnesses: Witness[],
  statuses?: string[]
): Witness[] {
  if (!statuses || statuses.length === 0) return witnesses;
  return witnesses.filter(w => statuses.includes(w.status));
}

// Find witness by org/id
export function findWitness(
  witnesses: Witness[],
  org: string,
  id: string
): Witness | undefined {
  return witnesses.find(w => w.org === org && w.id === id);
}

// Check if witness is valid at given time
export function isWitnessValid(
  witness: Witness,
  atTime: string,
  retiredGraceMs = 0
): { valid: boolean; reason?: string } {
  if (witness.status === 'REVOKED') {
    return {
      valid: false,
      reason: `witness_revoked:${witness.org}/${witness.id}`,
    };
  }

  if (witness.status === 'RETIRED') {
    const graceMs = retiredGraceMs || 0;
    const now = Date.now();
    const sigTime = new Date(atTime).getTime();

    if (now - sigTime > graceMs) {
      return {
        valid: false,
        reason: `witness_expired:${witness.org}/${witness.id}`,
      };
    }
  }

  return { valid: true };
}

// Count valid signatures by unique org
export function countValidSigs(
  sigs: WitnessSig[],
  witnesses: Witness[],
  retiredGraceMs = 0
): { count: number; validOrgs: Set<string> } {
  const validOrgs = new Set<string>();

  for (const sig of sigs) {
    const witness = findWitness(witnesses, sig.org, sig.id);
    if (!witness) continue;

    const validity = isWitnessValid(witness, sig.at, retiredGraceMs);
    if (validity.valid) {
      validOrgs.add(sig.org);
    }
  }

  return { count: validOrgs.size, validOrgs };
}

// Check policy compliance
export function checkPolicy(
  validOrgs: Set<string>,
  policy: WitnessPolicy
): { ok: boolean; reason?: string } {
  // Check minimum threshold
  if (validOrgs.size < policy.min) {
    return {
      ok: false,
      reason: `threshold_not_met:min=${policy.min},count=${validOrgs.size}`,
    };
  }

  // Check required orgs
  if (policy.requireOrgs) {
    for (const requiredOrg of policy.requireOrgs) {
      if (!validOrgs.has(requiredOrg)) {
        return { ok: false, reason: `require_org_missing:${requiredOrg}` };
      }
    }
  }

  // Check banned orgs
  if (policy.bannedOrgs) {
    for (const bannedOrg of policy.bannedOrgs) {
      if (validOrgs.has(bannedOrg)) {
        return { ok: false, reason: `banned_org_present:${bannedOrg}` };
      }
    }
  }

  return { ok: true };
}
