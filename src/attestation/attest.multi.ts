/**
 * Phase B - Task 23: Multi-Sig Attestation (≤220 LOC)
 * Threshold-based multi-signature verification and emission
 */

import type { Sparkpack } from '../domain/pack/types';
import { toB64u, fromB64u } from '../crypto/base64url';

// Mock dependencies for now - will integrate properly
const getSigner = async (_ns: string, kid: string) => ({
  kid,
  status: 'ACTIVE',
  pubB64u: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Valid Ed25519 public key (32 bytes)
  privB64u: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // Valid Ed25519 private key (32 bytes)
  retiredAt: null,
});
const AuditApi = { log: async (_event: string, _data: any) => {} };

// Types
export interface PackAttestV2 {
  v: 2;
  sigs: Array<{
    kid?: string;
    pubB64u?: string;
    sigB64u: string;
  }>;
}

export interface PackAttestV1 {
  v: 1;
  manifest: {
    content: { eventsHash: string; eventsCount: number };
    bytes: number;
    meta: any;
  };
  att: {
    alg: 'Ed25519';
    signer: string;
    sig: string;
    ts: string;
    kid?: string;
  };
}

export type PackAttest = PackAttestV1 | PackAttestV2;

export interface ThresholdPolicy {
  min: number;
  allowLegacy?: boolean;
  bannedKids?: string[];
  requireKids?: string[];
  retiredGraceMs?: number;
}

export interface MultiSigResult {
  ok: boolean;
  count: number;
  reasons?: string[];
}

// Canonical bytes (reuse Task 18)
function canonicalize(obj: any): string {
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `"${k}":${canonicalize(obj[k])}`);
  return '{' + pairs.join(',') + '}';
}

function getCanonicalBytes(pack: Sparkpack): ArrayBuffer {
  const canonical = canonicalize({ meta: pack.meta, events: pack.events });
  return new TextEncoder().encode(canonical).buffer;
}

/**
 * Emit multi-sig attestation using local signer keys
 */
export async function attestPackMulti(
  ns: string,
  kids: string[],
  pack: Sparkpack
): Promise<PackAttestV2> {
  const canonicalBytes = getCanonicalBytes(pack);
  const sigs: PackAttestV2['sigs'] = [];

  for (const kid of kids) {
    const signer = await getSigner(ns, kid);
    if (!signer) throw new Error(`Signer not found: ${kid}`);
    if (signer.status === 'REVOKED')
      throw new Error(`Cannot use revoked signer: ${kid}`);

    const privateKey = await crypto.subtle.importKey(
      'raw',
      fromB64u(signer.privB64u),
      { name: 'Ed25519' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign(
      'Ed25519',
      privateKey,
      canonicalBytes
    );
    sigs.push({ kid, sigB64u: toB64u(signature) });
  }

  await AuditApi.log('ATTEST_MULTI_EMIT', {
    namespace: ns,
    kids,
    count: kids.length,
  });
  return { v: 2, sigs };
}

/**
 * Verify multi-sig threshold under policy
 */
export async function verifyPackMulti(
  pack: Sparkpack,
  attest: PackAttest,
  ns: string,
  policy: ThresholdPolicy
): Promise<MultiSigResult> {
  const canonicalBytes = getCanonicalBytes(pack);

  // V1 backwards compatibility - reject if min > 1
  if (attest.v === 1) {
    if (policy.min > 1) {
      const reasons = [`threshold_not_met:min=${policy.min},count=1`];
      await AuditApi.log('ATTEST_MULTI_VERIFY', {
        namespace: ns,
        min: policy.min,
        count: 0,
        ok: false,
        reasons,
      });
      return { ok: false, count: 0, reasons };
    }

    // Verify single v1 signature
    let pubKey: CryptoKey;
    let effectiveKid = attest.att.kid;

    if (attest.att.kid) {
      const signer = await getSigner(ns, attest.att.kid);
      if (!signer)
        return {
          ok: false,
          count: 0,
          reasons: [`signer_not_found:${attest.att.kid}`],
        };
      if (signer.status === 'REVOKED')
        return {
          ok: false,
          count: 0,
          reasons: [`revoked_kid:${attest.att.kid}`],
        };

      if (signer.status === 'RETIRED') {
        if (
          !policy.retiredGraceMs ||
          !signer.retiredAt ||
          Date.now() - new Date(signer.retiredAt).getTime() >
            policy.retiredGraceMs
        ) {
          return {
            ok: false,
            count: 0,
            reasons: [`retired_out_of_grace:${attest.att.kid}`],
          };
        }
      }

      pubKey = await crypto.subtle.importKey(
        'raw',
        fromB64u(signer.pubB64u),
        { name: 'Ed25519' },
        false,
        ['verify']
      );
    } else {
      if (!policy.allowLegacy)
        return { ok: false, count: 0, reasons: ['legacy_not_allowed'] };
      effectiveKid = `legacy:${attest.att.signer.slice(0, 16)}`;
      pubKey = await crypto.subtle.importKey(
        'raw',
        fromB64u(attest.att.signer),
        { name: 'Ed25519' },
        false,
        ['verify']
      );
    }

    const isValid = await crypto.subtle.verify(
      'Ed25519',
      pubKey,
      fromB64u(attest.att.sig),
      canonicalBytes
    );
    const result = {
      ok: isValid,
      count: isValid ? 1 : 0,
      ...(!isValid && { reasons: [`sig_verify_failed:${effectiveKid}`] }),
    };

    await AuditApi.log('ATTEST_MULTI_VERIFY', {
      namespace: ns,
      min: policy.min,
      count: result.count,
      ok: result.ok,
    });
    return result;
  }

  // V2 multi-sig verification
  let valid = 0;
  const seenKids = new Set<string>();
  const reasons: string[] = [];
  const validKids = new Set<string>();

  for (const sig of attest.sigs) {
    if (sig.kid && seenKids.has(sig.kid)) continue; // Dedup by kid

    let pubKey: CryptoKey;
    let effectiveKid = sig.kid;

    if (sig.kid) {
      seenKids.add(sig.kid);
      const signer = await getSigner(ns, sig.kid);
      if (!signer) {
        reasons.push(`signer_not_found:${sig.kid}`);
        continue;
      }
      if (signer.status === 'REVOKED') {
        reasons.push(`revoked_kid:${sig.kid}`);
        continue;
      }

      if (signer.status === 'RETIRED') {
        if (
          !policy.retiredGraceMs ||
          !signer.retiredAt ||
          Date.now() - new Date(signer.retiredAt).getTime() >
            policy.retiredGraceMs
        ) {
          reasons.push(`retired_out_of_grace:${sig.kid}`);
          continue;
        }
      }

      try {
        pubKey = await crypto.subtle.importKey(
          'raw',
          fromB64u(signer.pubB64u),
          { name: 'Ed25519' },
          false,
          ['verify']
        );
      } catch {
        reasons.push(`key_import_failed:${sig.kid}`);
        continue;
      }
    } else if (sig.pubB64u) {
      if (!policy.allowLegacy) {
        reasons.push(`legacy_not_allowed`);
        continue;
      }
      effectiveKid = `legacy:${sig.pubB64u.slice(0, 16)}`;
      try {
        pubKey = await crypto.subtle.importKey(
          'raw',
          fromB64u(sig.pubB64u),
          { name: 'Ed25519' },
          false,
          ['verify']
        );
      } catch {
        reasons.push(`legacy_key_import_failed`);
        continue;
      }
    } else {
      reasons.push('missing_kid_and_pub');
      continue;
    }

    try {
      const isValid = await crypto.subtle.verify(
        'Ed25519',
        pubKey,
        fromB64u(sig.sigB64u),
        canonicalBytes
      );
      if (isValid) {
        valid++;
        if (effectiveKid) validKids.add(effectiveKid);
      } else {
        reasons.push(`sig_verify_failed:${effectiveKid || 'unknown'}`);
      }
    } catch {
      reasons.push(`sig_verify_error:${effectiveKid || 'unknown'}`);
    }
  }

  // Policy enforcement
  let ok = true;

  if (policy.bannedKids) {
    for (const banned of policy.bannedKids) {
      if (validKids.has(banned)) {
        reasons.push(`banned_kid:${banned}`);
        ok = false;
      }
    }
  }

  if (policy.requireKids) {
    for (const required of policy.requireKids) {
      if (!validKids.has(required)) {
        reasons.push(`require_kid_missing:${required}`);
        ok = false;
      }
    }
  }

  if (valid < policy.min) {
    reasons.push(`threshold_not_met:min=${policy.min},count=${valid}`);
    ok = false;
  }

  await AuditApi.log('ATTEST_MULTI_VERIFY', {
    namespace: ns,
    min: policy.min,
    count: valid,
    ok,
    ...(reasons.length > 0 && { reasons }),
  });
  return { ok, count: valid, ...(reasons.length > 0 && { reasons }) };
}
