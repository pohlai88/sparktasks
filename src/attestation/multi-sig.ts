/**
 * Phase B - Task 23: Multi-Sig Attestation Engine
 * Threshold-based multi-signature verification and emission
 */

import type { StorageDriver } from '../storage/types';
import type {
  PackAttestV1,
  PackAttestV2,
  ThresholdPolicy,
  MultiSigResult,
  PackAttest,
} from './multi-sig-types';
import type { Sparkpack } from '../domain/sparkpack/types';
import { getSigner, listSigners } from '../signer/registry';
import { checkPolicy } from '../policy/engine';
import * as AuditApi from '../audit/api';
import { toB64u, fromB64u } from '../crypto/base64url';

// Canonical JSON serialization (reused from Task 18)
function canonicalize(obj: any): string {
  if (obj === null || obj === undefined) return JSON.stringify(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';

  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `"${k}":${canonicalize(obj[k])}`);
  return '{' + pairs.join(',') + '}';
}

// Generate canonical bytes for signature (reused from Task 18)
function getCanonicalBytes(pack: Sparkpack): Uint8Array {
  const canonical = canonicalize({
    meta: pack.meta,
    events: pack.events,
  });
  return new TextEncoder().encode(canonical);
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

  // Check emission policy
  const policyCheck = await checkPolicy(ns, 'attestation.emit.multi', {
    kids,
    count: kids.length,
  });
  if (!policyCheck.allowed) {
    throw new Error(
      `Multi-sig emission denied by policy: ${policyCheck.reason}`
    );
  }

  for (const kid of kids) {
    // Fetch signer from registry
    const signer = await getSigner(ns, kid);
    if (!signer) {
      throw new Error(`Signer not found: ${kid}`);
    }

    if (signer.status === 'REVOKED') {
      throw new Error(`Cannot use revoked signer: ${kid}`);
    }

    // Sign canonical bytes
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

    sigs.push({
      kid,
      sigB64u: toB64u(new Uint8Array(signature)),
    });
  }

  // Audit emission
  await AuditApi.log('ATTEST_MULTI_EMIT', {
    namespace: ns,
    kids,
    count: kids.length,
    eventsHash: pack.meta.eventsHash,
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

  // Handle v1 backwards compatibility
  if (attest.v === 1) {
    return await verifyV1Compat(pack, attest, ns, policy, canonicalBytes);
  }

  // V2 multi-sig verification
  let valid = 0;
  const seenKids = new Set<string>();
  const reasons: string[] = [];
  const validKids = new Set<string>();

  for (const sig of attest.sigs) {
    // Deduplication by kid
    if (sig.kid && seenKids.has(sig.kid)) {
      continue; // Skip duplicate kid
    }

    let pubKey: CryptoKey | null = null;
    let effectiveKid = sig.kid;

    // Resolve public key
    if (sig.kid) {
      seenKids.add(sig.kid);

      // Look up signer in registry
      const signer = await getSigner(ns, sig.kid);
      if (!signer) {
        reasons.push(`signer_not_found:${sig.kid}`);
        continue;
      }

      // Check signer status
      if (signer.status === 'REVOKED') {
        reasons.push(`revoked_kid:${sig.kid}`);
        continue;
      }

      if (signer.status === 'RETIRED') {
        if (!policy.retiredGraceMs || !signer.retiredAt) {
          reasons.push(`retired_out_of_grace:${sig.kid}`);
          continue;
        }

        const retiredTime = new Date(signer.retiredAt).getTime();
        const now = Date.now();
        if (now - retiredTime > policy.retiredGraceMs) {
          reasons.push(`retired_out_of_grace:${sig.kid}`);
          continue;
        }
      }

      // Import public key
      try {
        pubKey = await crypto.subtle.importKey(
          'raw',
          fromB64u(signer.pubB64u),
          { name: 'Ed25519' },
          false,
          ['verify']
        );
      } catch (error) {
        reasons.push(`key_import_failed:${sig.kid}`);
        continue;
      }
    } else if (sig.pubB64u) {
      // Legacy path - policy gated
      if (!policy.allowLegacy) {
        reasons.push(`legacy_not_allowed:${sig.pubB64u.slice(0, 8)}...`);
        continue;
      }

      // For legacy sigs, create pseudo-kid for policy checks
      effectiveKid = `legacy:${sig.pubB64u.slice(0, 16)}`;

      try {
        pubKey = await crypto.subtle.importKey(
          'raw',
          fromB64u(sig.pubB64u),
          { name: 'Ed25519' },
          false,
          ['verify']
        );
      } catch (error) {
        reasons.push(`legacy_key_import_failed:${sig.pubB64u.slice(0, 8)}...`);
        continue;
      }
    } else {
      reasons.push('missing_kid_and_pub');
      continue;
    }

    // Verify signature
    try {
      const isValid = await crypto.subtle.verify(
        'Ed25519',
        pubKey,
        fromB64u(sig.sigB64u),
        canonicalBytes
      );

      if (isValid) {
        valid++;
        if (effectiveKid) {
          validKids.add(effectiveKid);
        }
      } else {
        reasons.push(`sig_verify_failed:${effectiveKid || 'unknown'}`);
      }
    } catch (error) {
      reasons.push(`sig_verify_error:${effectiveKid || 'unknown'}`);
    }
  }

  // Policy checks
  let ok = true;

  // Check banned kids
  if (policy.bannedKids) {
    for (const bannedKid of policy.bannedKids) {
      if (validKids.has(bannedKid)) {
        reasons.push(`banned_kid:${bannedKid}`);
        ok = false;
      }
    }
  }

  // Check required kids
  if (policy.requireKids) {
    for (const requiredKid of policy.requireKids) {
      if (!validKids.has(requiredKid)) {
        reasons.push(`require_kid_missing:${requiredKid}`);
        ok = false;
      }
    }
  }

  // Check threshold
  if (valid < policy.min) {
    reasons.push(`threshold_not_met:min=${policy.min},count=${valid}`);
    ok = false;
  }

  // Final result
  if (ok && reasons.length === 0) {
    ok = true;
  } else if (reasons.length > 0) {
    ok = false;
  }

  // Audit verification
  await AuditApi.log('ATTEST_MULTI_VERIFY', {
    namespace: ns,
    min: policy.min,
    count: valid,
    ok,
    eventsHash: pack.meta.eventsHash,
    ...(reasons.length > 0 && { reasons }),
  });

  return { ok, count: valid, ...(reasons.length > 0 && { reasons }) };
}

/**
 * Handle v1 backwards compatibility
 */
async function verifyV1Compat(
  pack: Sparkpack,
  attest: PackAttestV1,
  ns: string,
  policy: ThresholdPolicy,
  canonicalBytes: Uint8Array
): Promise<MultiSigResult> {
  // V1 can only satisfy min=1 or less
  if (policy.min > 1) {
    await AuditApi.log('ATTEST_MULTI_VERIFY', {
      namespace: ns,
      min: policy.min,
      count: 0,
      ok: false,
      eventsHash: pack.meta.eventsHash,
      reasons: [`v1_incompatible_with_threshold:min=${policy.min}`],
    });

    return {
      ok: false,
      count: 0,
      reasons: [`v1_incompatible_with_threshold:min=${policy.min}`],
    };
  }

  // Verify v1 signature (reuse existing logic)
  let pubKey: CryptoKey | null = null;
  let effectiveKid = attest.att.kid;

  if (attest.att.kid) {
    const signer = await getSigner(ns, attest.att.kid);
    if (!signer || signer.status === 'REVOKED') {
      const reason = !signer
        ? `signer_not_found:${attest.att.kid}`
        : `revoked_kid:${attest.att.kid}`;
      return { ok: false, count: 0, reasons: [reason] };
    }

    if (signer.status === 'RETIRED') {
      if (!policy.retiredGraceMs || !signer.retiredAt) {
        return {
          ok: false,
          count: 0,
          reasons: [`retired_out_of_grace:${attest.att.kid}`],
        };
      }

      const retiredTime = new Date(signer.retiredAt).getTime();
      const now = Date.now();
      if (now - retiredTime > policy.retiredGraceMs) {
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
    if (!policy.allowLegacy) {
      return { ok: false, count: 0, reasons: ['legacy_not_allowed'] };
    }

    effectiveKid = `legacy:${attest.att.signer.slice(0, 16)}`;
    pubKey = await crypto.subtle.importKey(
      'raw',
      fromB64u(attest.att.signer),
      { name: 'Ed25519' },
      false,
      ['verify']
    );
  }

  // Verify signature
  const isValid = await crypto.subtle.verify(
    'Ed25519',
    pubKey,
    fromB64u(attest.att.sig),
    canonicalBytes
  );

  const result = {
    ok: isValid,
    count: isValid ? 1 : 0,
    ...(!isValid && {
      reasons: [`sig_verify_failed:${effectiveKid || 'unknown'}`],
    }),
  };

  await AuditApi.log('ATTEST_MULTI_VERIFY', {
    namespace: ns,
    min: policy.min,
    count: result.count,
    ok: result.ok,
    eventsHash: pack.meta.eventsHash,
    version: 1,
  });

  return result;
}
