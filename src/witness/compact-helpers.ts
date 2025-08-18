/**
 * Phase B - Task 25: Compact Witness Helpers (≤60 LOC)
 */
import { Witness, WitnessSig, WitnessPolicy } from './compact-types';

export function canonicalize(obj: any): string {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  return '{' + Object.keys(obj).sort().map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

export function buildWitnessPayload(base: any): string {
  const canonical = canonicalize(base);
  return `witness-sig:${canonical}`;
}

export function filterWitnesses(witnesses: Witness[], statuses?: string[]): Witness[] {
  return statuses ? witnesses.filter(w => statuses.includes(w.status)) : witnesses;
}

export function findWitness(witnesses: Witness[], org: string, id: string): Witness | undefined {
  return witnesses.find(w => w.org === org && w.id === id);
}

export function isWitnessValid(witness: Witness, atTime: string, retiredGraceMs = 0): { valid: boolean; reason?: string } {
  if (witness.status === 'REVOKED') return { valid: false, reason: `witness_revoked:${witness.org}/${witness.id}` };
  if (witness.status === 'RETIRED' && Date.now() - new Date(atTime).getTime() > retiredGraceMs) return { valid: false, reason: `witness_expired:${witness.org}/${witness.id}` };
  return { valid: true };
}

export function countValidSigs(sigs: WitnessSig[], witnesses: Witness[], retiredGraceMs = 0): { count: number; validOrgs: Set<string> } {
  const validOrgs = new Set<string>();
  for (const sig of sigs) {
    const witness = findWitness(witnesses, sig.org, sig.id);
    if (witness && isWitnessValid(witness, sig.at, retiredGraceMs).valid) validOrgs.add(sig.org);
  }
  return { count: validOrgs.size, validOrgs };
}

export function checkPolicy(validOrgs: Set<string>, policy: WitnessPolicy): { ok: boolean; reason?: string } {
  if (validOrgs.size < policy.min) return { ok: false, reason: `threshold_not_met:min=${policy.min},count=${validOrgs.size}` };
  if (policy.requireOrgs) for (const org of policy.requireOrgs) if (!validOrgs.has(org)) return { ok: false, reason: 'missing_required_org' };
  if (policy.bannedOrgs) for (const org of policy.bannedOrgs) if (validOrgs.has(org)) return { ok: false, reason: 'banned_org_present' };
  return { ok: true };
}
