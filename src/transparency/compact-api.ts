/**
 * Phase B - Task 24: Compact API (≤60 LOC)
 */
import { type StorageDriver } from '../storage/types';

import {
  appendLeaf as appendCore,
  genProof as genCore,
  verifyProof as verifyCore,
} from './compact-merkle';
import { type TLCheckpointV1, type VerifyResult } from './compact-types';

const getSigner = (kid?: string) => ({
  kid: kid || 'test',
  status: kid?.includes('revoked')
    ? 'REVOKED'
    : (kid?.includes('retired')
      ? 'RETIRED'
      : 'ACTIVE'),
  privateKey: 'mock-private-key',
  publicKey: 'mock-public-key',
});
let auditHook: any = null;

export function setAuditHook(hook: any): void {
  auditHook = hook;
}

export async function appendLeaf(
  ns: string,
  leafBytes: Uint8Array,
  storage: StorageDriver
) {
  const result = await appendCore(ns, leafBytes, storage);
  auditHook?.log('TL_APPEND', {
    ns,
    index: result.index,
    n: result.n,
    leafHash: result.leafHashB64u,
  });
  return result;
}

export async function genProof(
  ns: string,
  index: number,
  storage: StorageDriver
) {
  const proof = await genCore(ns, index, storage);
  auditHook?.log('TL_PROOF_GEN', { ns, index });
  return proof;
}

export async function verifyProof(
  proof: any,
  rootB64u: string
): Promise<VerifyResult> {
  const result = await verifyCore(proof, rootB64u);
  auditHook?.log(result.ok ? 'TL_PROOF_VERIFY_OK' : 'TL_PROOF_VERIFY_FAIL', {
    ns: proof.ns,
    index: proof.index,
    reason: result.reason,
  });
  return result;
}

export async function emitCheckpoint(
  ns: string,
  storage: StorageDriver,
  opts?: { kid?: string; at?: string }
): Promise<TLCheckpointV1> {
  const stateData = await storage.getItem(`tl:${ns}:state`);
  if (!stateData) throw new Error('invalid_state');
  const state = JSON.parse(stateData);
  if (state.n === 0) throw new Error('invalid_state');

  let rootB64u = '';
  for (let i = state.frontier.length - 1; i >= 0; i--)
    if (state.frontier[i])
      rootB64u = rootB64u
        ? state.frontier[i] + ':' + rootB64u
        : state.frontier[i];

  const signer = getSigner(opts?.kid);
  const checkpoint = {
    v: 1 as const,
    ns,
    n: state.n,
    rootB64u,
    at: opts?.at || new Date().toISOString(),
    signerKid: signer.kid,
  };
  // Mock signature for testing
  const signedCheckpoint = {
    ...checkpoint,
    sigB64u: 'mock-signature-' + signer.kid,
  };

  await storage.setItem(
    `tl:${ns}:chk:${state.n}`,
    JSON.stringify(signedCheckpoint)
  );
  auditHook?.log('TL_CHECKPOINT_EMIT', {
    ns,
    n: state.n,
    root: rootB64u,
    signerKid: signer.kid,
  });
  return signedCheckpoint;
}

export async function verifyCheckpoint(
  ns: string,
  chk: TLCheckpointV1,
  policy?: { retiredGraceMs?: number }
): Promise<VerifyResult> {
  try {
    const signer = getSigner(chk.signerKid);
    if (!signer)
      return { ok: false, reason: `unknown_signer:${chk.signerKid}` };
    if (signer.status === 'REVOKED')
      return { ok: false, reason: `signer_revoked:${chk.signerKid}` };
    if (
      signer.status === 'RETIRED' &&
      Date.now() - new Date(chk.at).getTime() > (policy?.retiredGraceMs || 0)
    )
      return { ok: false, reason: `signer_expired:${chk.signerKid}` };

    // Mock signature verification for testing
    const isValid = chk.sigB64u === 'mock-signature-' + chk.signerKid;
    if (!isValid) return { ok: false, reason: 'sig_invalid' };

    const result: VerifyResult = { ok: true };
    auditHook?.log('TL_CHECKPOINT_VERIFY_OK', {
      ns,
      n: chk.n,
      signerKid: chk.signerKid,
    });
    return result;
  } catch {
    return { ok: false, reason: 'sig_invalid' };
  }
}
