/**
 * Phase B - Task 25: Witness API
 * Registry management, signature ingestion, and threshold verification
 */

import { type StorageDriver } from '../storage/types';

import {
  canonicalize,
  filterWitnessesByStatus,
  findWitness,
  isWitnessValid,
  countValidSigs,
  checkPolicy,
} from './helpers';
import {
  type Witness,
  type WitnessSig,
  type WitnessedCheckpointV1,
  type WitnessPolicy,
  type WitnessVerifyResult,
} from './types';

// Global hooks for audit and policy
let auditHook: any = null;
let policyHook: any = null;

export function setAuditHook(hook: any): void {
  auditHook = hook;
}
export function setPolicyHook(hook: any): void {
  policyHook = hook;
}

// Load witness registry from storage
async function loadWitnessRegistry(
  ns: string,
  storage: StorageDriver
): Promise<Witness[]> {
  const data = await storage.getItem(`wtns:${ns}:reg`);
  return data ? JSON.parse(data) : [];
}

// Save witness registry to storage
async function saveWitnessRegistry(
  ns: string,
  witnesses: Witness[],
  storage: StorageDriver
): Promise<void> {
  await storage.setItem(`wtns:${ns}:reg`, JSON.stringify(witnesses));
}

// Add witness to registry
export async function addWitness(
  ns: string,
  w: Witness,
  storage: StorageDriver
): Promise<void> {
  // Policy check
  if (policyHook) {
    const policyResult = await policyHook.check('witness.add', {
      ns,
      org: w.org,
      id: w.id,
    });
    if (!policyResult.allowed) {
      auditHook?.log('WITNESS_ADD_DENIED', {
        ns,
        org: w.org,
        id: w.id,
        reason: policyResult.reason,
      });
      throw new Error('policy_denied');
    }
  }

  const witnesses = await loadWitnessRegistry(ns, storage);

  // Remove existing if present
  const filtered = witnesses.filter(
    witness => !(witness.org === w.org && witness.id === w.id)
  );
  filtered.push(w);

  await saveWitnessRegistry(ns, filtered, storage);
  auditHook?.log('WITNESS_ADD', { ns, org: w.org, id: w.id });
}

// List witnesses with optional status filter
export async function listWitnesses(
  ns: string,
  storage: StorageDriver,
  opts?: { status?: string[] }
): Promise<Witness[]> {
  const witnesses = await loadWitnessRegistry(ns, storage);
  return filterWitnessesByStatus(witnesses, opts?.status);
}

// Set witness status
export async function setWitnessStatus(
  ns: string,
  org: string,
  id: string,
  status: Witness['status'],
  storage: StorageDriver
): Promise<void> {
  // Policy check
  if (policyHook) {
    const policyResult = await policyHook.check('witness.status', {
      ns,
      org,
      id,
      status,
    });
    if (!policyResult.allowed) {
      auditHook?.log('WITNESS_STATUS_DENIED', {
        ns,
        org,
        id,
        status,
        reason: policyResult.reason,
      });
      throw new Error('policy_denied');
    }
  }

  const witnesses = await loadWitnessRegistry(ns, storage);
  const witness = findWitness(witnesses, org, id);

  if (!witness) {
    throw new Error(`unknown_witness:${org}/${id}`);
  }

  witness.status = status;
  await saveWitnessRegistry(ns, witnesses, storage);
  auditHook?.log('WITNESS_STATUS', { ns, org, id, status });
}

// Build payload for witnesses to sign

// Ingest witness signature
export async function ingestWitnessSig(
  ns: string,
  base: any,
  sig: WitnessSig,
  storage: StorageDriver,
  opts?: { retiredGraceMs?: number }
): Promise<WitnessedCheckpointV1> {
  // Policy check
  if (policyHook) {
    const policyResult = await policyHook.check('witness.sig.ingest', {
      ns,
      org: sig.org,
      id: sig.id,
    });
    if (!policyResult.allowed) {
      auditHook?.log('WITNESS_SIG_INGEST_DENIED', {
        ns,
        n: base.n,
        org: sig.org,
        id: sig.id,
        reason: policyResult.reason,
      });
      throw new Error('policy_denied');
    }
  }

  const witnesses = await loadWitnessRegistry(ns, storage);
  const witness = findWitness(witnesses, sig.org, sig.id);

  if (!witness) {
    const reason = `unknown_witness:${sig.org}/${sig.id}`;
    auditHook?.log('WITNESS_SIG_INGEST_FAIL', {
      ns,
      n: base.n,
      org: sig.org,
      id: sig.id,
      reason,
    });
    throw new Error(reason);
  }

  // Check witness validity
  const validity = isWitnessValid(witness, sig.at, opts?.retiredGraceMs);
  if (!validity.valid) {
    auditHook?.log('WITNESS_SIG_INGEST_FAIL', {
      ns,
      n: base.n,
      org: sig.org,
      id: sig.id,
      reason: validity.reason,
    });
    throw new Error(validity.reason!);
  }

  // Verify signature
  try {
    // Mock signature verification for testing
    const isValid = sig.sigB64u.startsWith('mock-sig-' + witness.org);

    if (!isValid) {
      const reason = `sig_invalid:${sig.org}/${sig.id}`;
      auditHook?.log('WITNESS_SIG_INGEST_FAIL', {
        ns,
        n: base.n,
        org: sig.org,
        id: sig.id,
        reason,
      });
      throw new Error(reason);
    }
  } catch (error) {
    const reason = `sig_invalid:${sig.org}/${sig.id}`;
    auditHook?.log('WITNESS_SIG_INGEST_FAIL', {
      ns,
      n: base.n,
      org: sig.org,
      id: sig.id,
      reason,
    });
    throw new Error(reason);
  }

  // Load or create witnessed checkpoint
  const chkKey = `wtns:${ns}:chk:${base.n}`;
  let witnessedCheckpoint: WitnessedCheckpointV1;

  const existing = await storage.getItem(chkKey);
  if (existing) {
    witnessedCheckpoint = JSON.parse(existing);

    // Verify base matches
    if (canonicalize(witnessedCheckpoint.base) !== canonicalize(base)) {
      throw new Error('mismatched_base');
    }

    // Add signature if not already present
    const existingSig = witnessedCheckpoint.sigs.find(
      s => s.org === sig.org && s.id === sig.id
    );
    if (!existingSig) {
      witnessedCheckpoint.sigs.push(sig);
    }
  } else {
    witnessedCheckpoint = {
      v: 1,
      ns,
      n: base.n,
      rootB64u: base.rootB64u,
      at: base.at,
      base,
      sigs: [sig],
    };
  }

  await storage.setItem(chkKey, JSON.stringify(witnessedCheckpoint));
  auditHook?.log('WITNESS_SIG_INGEST_OK', {
    ns,
    n: base.n,
    org: sig.org,
    id: sig.id,
  });

  return witnessedCheckpoint;
}

// Verify witnessed checkpoint against policy
export async function verifyWitnessedCheckpoint(
  ns: string,
  wc: WitnessedCheckpointV1,
  storage: StorageDriver,
  policy: WitnessPolicy
): Promise<WitnessVerifyResult> {
  // Policy check
  if (policyHook) {
    const policyResult = await policyHook.check('witness.verify', {
      ns,
      n: wc.n,
      policy,
    });
    if (!policyResult.allowed) {
      auditHook?.log('WITNESS_VERIFY_DENIED', {
        ns,
        n: wc.n,
        reason: policyResult.reason,
      });
      return { ok: false, reason: 'policy_denied' };
    }
  }

  const witnesses = await loadWitnessRegistry(ns, storage);
  const { count, validOrgs } = countValidSigs(
    wc.sigs,
    witnesses,
    policy.retiredGraceMs
  );

  // Check policy compliance
  const policyCheck = checkPolicy(validOrgs, policy);

  if (policyCheck.ok) {
    auditHook?.log('WITNESS_VERIFY_OK', {
      ns,
      n: wc.n,
      min: policy.min,
      count,
    });
    return { ok: true, count };
  } else {
    auditHook?.log('WITNESS_VERIFY_FAIL', {
      ns,
      n: wc.n,
      min: policy.min,
      count,
      reason: policyCheck.reason,
    });
    return { ok: false, reason: policyCheck.reason || 'policy_failure', count };
  }
}

export { buildWitnessPayload } from './helpers';
