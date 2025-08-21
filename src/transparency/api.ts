/**
 * Phase B - Task 24: Transparency Log API
 * Checkpoint signing/verification with audit and policy hooks
 */

import { toB64u, fromB64u } from '../crypto/base64url';
import { type StorageDriver } from '../storage/types';

import {
  appendLeaf as appendLeafCore,
  genProof as genProofCore,
  verifyProof as verifyProofCore,
} from './merkle';
import { type TLCheckpointV1, type VerifyResult } from './types';

// Reuse canonicalize from Task 18
function canonicalize(obj: any): string {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `"${k}":${canonicalize(obj[k])}`);
  return '{' + pairs.join(',') + '}';
}

// Mock getSigner (Task 19 integration)
const getSigner = (kid?: string) => {
  // Mock multiple signer statuses for testing
  const signers = {
    'active-signer': { status: 'ACTIVE' as const },
    'retired-signer': { status: 'RETIRED' as const },
    'revoked-signer': { status: 'REVOKED' as const },
  };

  const selectedStatus =
    signers[kid as keyof typeof signers]?.status || 'ACTIVE';

  return {
    kid: kid || 'active-signer',
    status: selectedStatus,
    privateKey: {} as CryptoKey, // Mock for now
    publicKey: {} as CryptoKey,
  };
};

// Mock audit API type
interface AuditInterface {
  log(event: string, data: any): Promise<void>;
}

// Policy interface (Task 17 integration)
interface PolicyHook {
  check(
    op: string,
    context: any
  ): Promise<{ allowed: boolean; reason?: string }>;
}

// Global hooks (can be set by application)
let auditHook: AuditInterface | null = null;
let policyHook: PolicyHook | null = null;

export function setAuditHook(hook: AuditInterface | null): void {
  auditHook = hook;
}

export function setPolicyHook(hook: PolicyHook | null): void {
  policyHook = hook;
}

/**
 * Append leaf with audit/policy integration
 */
export async function appendLeaf(
  ns: string,
  leafBytes: Uint8Array,
  storage: StorageDriver
) {
  // Policy check
  if (policyHook) {
    const policyResult = await policyHook.check('tl.append', {
      ns,
      leafSize: leafBytes.length,
    });
    if (!policyResult.allowed) {
      if (auditHook) {
        await auditHook.log('TL_APPEND_DENIED', {
          ns,
          reason: policyResult.reason,
        });
      }
      throw new Error(`policy_denied: ${policyResult.reason}`);
    }
  }

  const result = await appendLeafCore(ns, leafBytes, storage);

  // Audit log
  if (auditHook) {
    await auditHook.log('TL_APPEND', {
      ns,
      index: result.index,
      n: result.n,
      leafHash: result.leafHashB64u,
    });
  }

  return result;
}

/**
 * Generate inclusion proof with audit
 */
export async function genProof(
  ns: string,
  index: number,
  storage: StorageDriver
) {
  const proof = await genProofCore(ns, index, storage);

  // Audit log
  if (auditHook) {
    await auditHook.log('TL_PROOF_GEN', {
      ns,
      index,
      n: index + 1, // approximate, could be higher
    });
  }

  return proof;
}

/**
 * Verify inclusion proof with audit
 */
export async function verifyProof(
  proof: any,
  rootB64u: string
): Promise<VerifyResult> {
  const result = await verifyProofCore(proof, rootB64u);

  // Audit log
  if (auditHook) {
    await (result.ok
      ? auditHook.log('TL_PROOF_VERIFY_OK', {
          ns: proof.ns,
          index: proof.index,
        })
      : auditHook.log('TL_PROOF_VERIFY_FAIL', {
          ns: proof.ns,
          index: proof.index,
          reason: result.reason,
        }));
  }

  return result;
}

/**
 * Create and persist signed checkpoint
 */
export async function emitCheckpoint(
  ns: string,
  storage: StorageDriver,
  opts?: { kid?: string; at?: string }
): Promise<TLCheckpointV1> {
  // Policy check
  if (policyHook) {
    const policyResult = await policyHook.check('tl.checkpoint.emit', {
      ns,
      kid: opts?.kid,
    });
    if (!policyResult.allowed) {
      if (auditHook) {
        await auditHook.log('TL_CHECKPOINT_EMIT_DENIED', {
          ns,
          reason: policyResult.reason,
        });
      }
      throw new Error(`policy_denied: ${policyResult.reason}`);
    }
  }

  // Load current state
  const stateKey = `tl:${ns}:state`;
  const stateData = await storage.getItem(stateKey);
  if (!stateData) {
    throw new Error('invalid_state');
  }

  const state = JSON.parse(stateData);
  if (state.n === 0) {
    throw new Error('invalid_state'); // No checkpoint for empty log
  }

  // Compute root from frontier
  let rootB64u = '';
  for (let i = state.frontier.length - 1; i >= 0; i--) {
    if (state.frontier[i]) {
      if (rootB64u) {
        // For now, just use string concatenation as a placeholder
        // In production, this would use proper hash computation
        rootB64u = state.frontier[i] + ':' + rootB64u;
      } else {
        rootB64u = state.frontier[i];
      }
    }
  }

  // Get active signer
  const signer = getSigner(opts?.kid);
  if (!signer) {
    throw new Error('unknown_signer');
  }

  const checkpoint: Omit<TLCheckpointV1, 'sigB64u'> = {
    v: 1,
    ns,
    n: state.n,
    rootB64u,
    at: opts?.at || new Date().toISOString(),
    signerKid: signer.kid,
  };

  // Sign canonical checkpoint
  const canonical = canonicalize(checkpoint);
  const signature = await crypto.subtle.sign(
    'Ed25519',
    signer.privateKey,
    new TextEncoder().encode(canonical)
  );

  const signedCheckpoint: TLCheckpointV1 = {
    ...checkpoint,
    sigB64u: toB64u(signature),
  };

  // Store checkpoint
  const chkKey = `tl:${ns}:chk:${state.n}`;
  await storage.setItem(chkKey, JSON.stringify(signedCheckpoint));

  // Audit log
  if (auditHook) {
    await auditHook.log('TL_CHECKPOINT_EMIT', {
      ns,
      n: state.n,
      root: rootB64u,
      signerKid: signer.kid,
    });
  }

  return signedCheckpoint;
}

/**
 * Verify checkpoint signature and signer status
 */
export async function verifyCheckpoint(
  ns: string,
  chk: TLCheckpointV1,
  policy?: { retiredGraceMs?: number }
): Promise<VerifyResult> {
  try {
    // Get signer info
    const signer = getSigner(chk.signerKid);
    if (!signer) {
      const result = { ok: false, reason: `unknown_signer:${chk.signerKid}` };
      if (auditHook) {
        await auditHook.log('TL_CHECKPOINT_VERIFY_FAIL', {
          ns,
          n: chk.n,
          signerKid: chk.signerKid,
          reason: result.reason,
        });
      }
      return result;
    }

    // Check signer status
    if (signer.status === 'REVOKED') {
      const result = { ok: false, reason: `signer_revoked:${chk.signerKid}` };
      if (auditHook) {
        await auditHook.log('TL_CHECKPOINT_VERIFY_FAIL', {
          ns,
          n: chk.n,
          signerKid: chk.signerKid,
          reason: result.reason,
        });
      }
      return result;
    }

    if (signer.status === 'RETIRED') {
      const graceMs = policy?.retiredGraceMs || 0;
      const now = Date.now();
      const chkTime = new Date(chk.at).getTime();

      if (now - chkTime > graceMs) {
        const result = { ok: false, reason: `signer_expired:${chk.signerKid}` };
        if (auditHook) {
          await auditHook.log('TL_CHECKPOINT_VERIFY_FAIL', {
            ns,
            n: chk.n,
            signerKid: chk.signerKid,
            reason: result.reason,
          });
        }
        return result;
      }
    }

    // Verify signature
    const checkpointForSig = { ...chk };
    delete (checkpointForSig as any).sigB64u;

    const canonical = canonicalize(checkpointForSig);
    const signature = fromB64u(chk.sigB64u);

    const isValid = await crypto.subtle.verify(
      'Ed25519',
      signer.publicKey,
      signature,
      new TextEncoder().encode(canonical)
    );

    if (!isValid) {
      const result = { ok: false, reason: 'sig_invalid' };
      if (auditHook) {
        await auditHook.log('TL_CHECKPOINT_VERIFY_FAIL', {
          ns,
          n: chk.n,
          signerKid: chk.signerKid,
          reason: result.reason,
        });
      }
      return result;
    }

    // Success
    if (auditHook) {
      await auditHook.log('TL_CHECKPOINT_VERIFY_OK', {
        ns,
        n: chk.n,
        signerKid: chk.signerKid,
      });
    }

    return { ok: true };
  } catch (error) {
    const result = { ok: false, reason: 'sig_invalid' };
    if (auditHook) {
      await auditHook.log('TL_CHECKPOINT_VERIFY_FAIL', {
        ns,
        n: chk.n,
        signerKid: chk.signerKid,
        reason: result.reason,
      });
    }
    return result;
  }
}
