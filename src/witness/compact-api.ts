/**
 * Phase B - Task 25: Compact Witness API (≤120 LOC)
 */
import { StorageDriver } from '../storage/types';
import { Witness, WitnessSig, WitnessedCheckpointV1, WitnessPolicy, WitnessVerifyResult } from './compact-types';
import { canonicalize, buildWitnessPayload, filterWitnesses, findWitness, isWitnessValid, countValidSigs, checkPolicy } from './compact-helpers';

let auditHook: any = null, policyHook: any = null, metricsHook: any = null;
export function setAuditHook(hook: any): void { auditHook = hook; }
export function setPolicyHook(hook: any): void { policyHook = hook; }
export function setMetricsHook(hook: any): void { metricsHook = hook; }

async function loadRegistry(ns: string, storage: StorageDriver): Promise<Witness[]> {
  const data = await storage.getItem(`wtns:${ns}:reg`);
  return data ? JSON.parse(data) : [];
}

async function saveRegistry(ns: string, witnesses: Witness[], storage: StorageDriver): Promise<void> {
  await storage.setItem(`wtns:${ns}:reg`, JSON.stringify(witnesses));
}

export async function addWitness(ns: string, w: Witness, storage: StorageDriver): Promise<void> {
  if (policyHook) {
    const result = await policyHook.check('witness.add', { ns, org: w.org, id: w.id });
    if (!result.allowed) { auditHook?.log('WITNESS_ADD_DENIED', { ns, org: w.org, id: w.id }); throw new Error('policy_denied'); }
  }
  const witnesses = await loadRegistry(ns, storage);
  const filtered = witnesses.filter(witness => !(witness.org === w.org && witness.id === w.id));
  filtered.push(w);
  await saveRegistry(ns, filtered, storage);
  auditHook?.log('WITNESS_ADD', { ns, org: w.org, id: w.id });
}

export async function listWitnesses(ns: string, storage: StorageDriver, opts?: { status?: string[] }): Promise<Witness[]> {
  const witnesses = await loadRegistry(ns, storage);
  return filterWitnesses(witnesses, opts?.status);
}

export async function setWitnessStatus(ns: string, org: string, id: string, status: Witness['status'], storage: StorageDriver): Promise<void> {
  if (policyHook) {
    const result = await policyHook.check('witness.status', { ns, org, id, status });
    if (!result.allowed) { auditHook?.log('WITNESS_STATUS_DENIED', { ns, org, id, status }); throw new Error('policy_denied'); }
  }
  const witnesses = await loadRegistry(ns, storage);
  const witness = findWitness(witnesses, org, id);
  if (!witness) throw new Error(`unknown_witness:${org}/${id}`);
  witness.status = status;
  await saveRegistry(ns, witnesses, storage);
  auditHook?.log('WITNESS_STATUS', { ns, org, id, status });
}

export { buildWitnessPayload };

export async function ingestWitnessSig(ns: string, base: any, sig: WitnessSig, storage: StorageDriver, opts?: { retiredGraceMs?: number }): Promise<WitnessedCheckpointV1> {
  if (policyHook) {
    const result = await policyHook.check('witness.sig.ingest', { ns, org: sig.org, id: sig.id });
    if (!result.allowed) { auditHook?.log('WITNESS_SIG_INGEST_DENIED', { ns, n: base.n, org: sig.org, id: sig.id }); throw new Error('policy_denied'); }
  }
  
  const witnesses = await loadRegistry(ns, storage);
  const witness = findWitness(witnesses, sig.org, sig.id);
  if (!witness) { 
    const reason = `unknown_witness:${sig.org}/${sig.id}`; 
    auditHook?.log('WITNESS_SIG_INGEST_FAIL', { ns, n: base.n, org: sig.org, id: sig.id, reason }); 
    metricsHook?.increment('witness.ingest.unknown_witness');
    throw new Error(reason); 
  }
  
  const validity = isWitnessValid(witness, sig.at, opts?.retiredGraceMs);
  if (!validity.valid) { 
    auditHook?.log('WITNESS_SIG_INGEST_FAIL', { ns, n: base.n, org: sig.org, id: sig.id, reason: validity.reason }); 
    metricsHook?.increment('witness.ingest.invalid_witness');
    throw new Error(validity.reason!); 
  }
  
  // Mock signature verification
  if (!sig.sigB64u.startsWith('mock-sig-' + witness.org)) {
    const reason = `sig_invalid:${sig.org}/${sig.id}`;
    auditHook?.log('WITNESS_SIG_INGEST_FAIL', { ns, n: base.n, org: sig.org, id: sig.id, reason });
    metricsHook?.increment('witness.ingest.invalid_signature');
    throw new Error(reason);
  }
  
  const chkKey = `wtns:${ns}:chk:${base.n}`;
  let wc: WitnessedCheckpointV1;
  const existing = await storage.getItem(chkKey);
  
  if (existing) {
    wc = JSON.parse(existing);
    // Monotonicity Check: Ensure all sigs refer to same base/root
    if (canonicalize(wc.base) !== canonicalize(base)) { 
      const reason = 'mismatched_base'; 
      metricsHook?.increment('witness.ingest.monotonicity_violation'); 
      throw new Error(reason); 
    }
    // Dedup Guard: Ignore duplicate (org,id) signatures
    if (!wc.sigs.find(s => s.org === sig.org && s.id === sig.id)) wc.sigs.push(sig);
  } else {
    wc = { v: 1, ns, n: base.n, rootB64u: base.rootB64u, at: base.at, base, sigs: [sig] };
  }
  
  await storage.setItem(chkKey, JSON.stringify(wc));
  auditHook?.log('WITNESS_SIG_INGEST_OK', { ns, n: base.n, org: sig.org, id: sig.id });
  metricsHook?.increment('witness.ingest.success');
  return wc;
}

export async function verifyWitnessedCheckpoint(ns: string, wc: WitnessedCheckpointV1, storage: StorageDriver, policy: WitnessPolicy): Promise<WitnessVerifyResult> {
  if (policyHook) {
    const result = await policyHook.check('witness.verify', { ns, n: wc.n, policy });
    if (!result.allowed) { auditHook?.log('WITNESS_VERIFY_DENIED', { ns, n: wc.n }); return { ok: false, reason: 'policy_denied' }; }
  }
  
  const witnesses = await loadRegistry(ns, storage);
  const { count, validOrgs } = countValidSigs(wc.sigs, witnesses, policy.retiredGraceMs);
  const policyCheck = checkPolicy(validOrgs, policy);
  
  if (policyCheck.ok) {
    auditHook?.log('WITNESS_VERIFY_OK', { ns, n: wc.n, min: policy.min, count });
    metricsHook?.increment('witness.verify.success');
    return { ok: true, count };
  } else {
    auditHook?.log('WITNESS_VERIFY_FAIL', { ns, n: wc.n, min: policy.min, count, reason: policyCheck.reason });
    metricsHook?.increment('witness.verify.failure', { reason: policyCheck.reason || 'policy_failure' });
    return { ok: false, reason: policyCheck.reason || 'policy_failure', count };
  }
}
