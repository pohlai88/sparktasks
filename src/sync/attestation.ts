/**
 * Attested Sparkpacks - Phase B Task 18 & 19
 * Ed25519 attestation & verification with signer lifecycle management
 */

import { log } from '../audit/api';
import { toB64u, fromB64u } from '../crypto/base64url';
import type { Sparkpack, SparkpackMeta } from '../domain/pack/types';
import { listTrustAnchors } from '../federation/registry';
import { checkCrossOrgPolicy } from '../policy/engine';

import { listSigners, type SignerRecord } from './signer-registry';

export interface AttestedPack {
  v: 1;
  manifest: PackManifestV1;
  att: Attestation;
}

export interface DualAttestedPack {
  v: 1;
  manifest: PackManifestV1;
  att: [Attestation, Attestation]; // new + old
}

export interface Attestation {
  alg: 'Ed25519';
  signer: string; // base64url SPKI
  sig: string; // base64url over canonical(manifest)
  ts: string; // ISO timestamp
  kid?: string; // Task 19: key identifier
}

export interface PackManifestV1 {
  content: {
    eventsHash: string;
    eventsCount: number;
  };
  bytes: number;
  meta: SparkpackMeta;
}

export interface TrustOptions {
  allowUnsigned?: boolean;
  allowedSigners?: string[];
  ns?: string; // Task 19: namespace for registry lookup
  graceSecs?: number; // Task 19: grace period for expired signers
  operation?: string; // Task 20: operation for policy gating (e.g., 'sync.import')
}

export type VerifyResult = { ok: true } | { ok: false; reason: string };

// Canonical JSON for stable signatures
function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

// Convert Sparkpack to attestable manifest
function packToManifest(pack: Sparkpack): PackManifestV1 {
  const packStr = JSON.stringify(pack);
  return {
    content: {
      eventsHash: pack.meta.eventsHash,
      eventsCount: pack.meta.eventsCount,
    },
    bytes: packStr.length,
    meta: pack.meta,
  };
}

export async function attestPack(
  pack: Sparkpack | PackManifestV1,
  signer: CryptoKey | CryptoKeyPair,
  opts?: { dualSignUntil?: string; ns?: string }
): Promise<AttestedPack | DualAttestedPack> {
  // For backward compatibility - if pack is Sparkpack, convert to manifest
  const manifest = 'meta' in pack ? packToManifest(pack) : pack;

  let activeSigner: SignerRecord | null = null;
  let retiredSigner: SignerRecord | null = null;

  // If namespace provided, use registry-based signing
  if (opts?.ns) {
    try {
      const signers = await listSigners(opts.ns);
      activeSigner = signers.find(s => s.status === 'ACTIVE') || null;

      // Check for dual-sign opportunity
      if (opts.dualSignUntil && new Date() < new Date(opts.dualSignUntil)) {
        // Find most recent RETIRED signer within overlap window
        const retiredCandidates = signers
          .filter(
            s =>
              s.status === 'RETIRED' &&
              (!s.expiresAt || new Date() < new Date(s.expiresAt))
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        retiredSigner = retiredCandidates[0] || null;
      }
    } catch {
      // Registry not available - fallback to direct signing
    }
  }

  // Create primary attestation
  const primaryAtt = await createAttestation(
    manifest,
    signer,
    activeSigner?.kid
  );

  // Check if dual-signing is needed and possible
  if (retiredSigner && opts?.dualSignUntil) {
    const secondaryAtt = await createAttestation(
      manifest,
      signer,
      retiredSigner.kid
    );
    await log('PACK_DUAL_SIGNED', {
      ns: opts.ns,
      active: activeSigner?.kid,
      retired: retiredSigner.kid,
    });

    return {
      v: 1,
      manifest,
      att: [primaryAtt, secondaryAtt],
    };
  }

  return {
    v: 1,
    manifest,
    att: primaryAtt,
  };
}

async function createAttestation(
  manifest: PackManifestV1,
  signer: CryptoKey | CryptoKeyPair,
  kid?: string
): Promise<Attestation> {
  const canonical = canonicalize(manifest);
  const messageBytes = new TextEncoder().encode(canonical);

  // Handle both CryptoKey and CryptoKeyPair
  const privateKey = 'privateKey' in signer ? signer.privateKey : signer;
  const publicKey =
    'publicKey' in signer
      ? signer.publicKey
      : await crypto.subtle.importKey(
          'spki',
          await crypto.subtle.exportKey('spki', signer),
          { name: 'Ed25519' },
          false,
          ['verify']
        );

  const signature = await crypto.subtle.sign(
    'Ed25519',
    privateKey,
    messageBytes
  );
  const signerSpki = await crypto.subtle.exportKey('spki', publicKey);

  return {
    alg: 'Ed25519',
    signer: toB64u(signerSpki),
    sig: toB64u(signature),
    ts: new Date().toISOString(),
    ...(kid && { kid }),
  };
}

export async function verifyPackAttestation(
  attested: AttestedPack | DualAttestedPack,
  trust: TrustOptions
): Promise<VerifyResult> {
  const { ns, allowUnsigned = false, graceSecs = 0, allowedSigners } = trust;
  const nowISO = new Date().toISOString();

  // Legacy unsigned pack handling
  if (!attested.att) {
    return allowUnsigned ? { ok: true } : { ok: false, reason: 'unsigned' };
  }

  // Handle dual-attested packs
  const attestations = Array.isArray(attested.att)
    ? attested.att
    : [attested.att];

  // If no attestations, handle as unsigned
  if (attestations.length === 0) {
    return allowUnsigned ? { ok: true } : { ok: false, reason: 'unsigned' };
  }

  // Registry-based verification with federation support
  if (ns) {
    try {
      const signers = await listSigners(ns);
      const anchors = await listTrustAnchors(ns);
      const localByKid = new Map(signers.map(r => [r.kid, r]));
      const federatedByPub = new Map(anchors.map(a => [a.pubB64u, a]));

      for (const att of attestations) {
        // Check local signer registry first (Task 19) - requires kid
        if (att.kid) {
          const localRec = localByKid.get(att.kid);
          if (localRec) {
            // Check local signer status before verifying signature
            if (localRec.status === 'REVOKED') {
              await log('ATTEST_VERIFY_DENY', {
                ns,
                kid: att.kid,
                reason: 'revoked',
              });
              return { ok: false, reason: 'revoked' };
            }

            // Verify signature first
            if (!(await verifySingleSignature(att, attested.manifest)))
              continue;

            // Check status allows verification
            if (statusAllows(localRec, nowISO, graceSecs)) {
              await log('ATTEST_VERIFY_ALLOW', { ns, kid: att.kid });
              return { ok: true };
            } else if (localRec.status === 'RETIRED') {
              await log('ATTEST_VERIFY_DENY', {
                ns,
                kid: att.kid,
                reason: 'expired beyond grace',
              });
              return {
                ok: false,
                reason: `Signer ${att.kid} expired beyond grace period`,
              };
            }
            continue;
          }
        }

        // Check federated trust anchors (Task 20) - by signer public key (works with or without kid)
        const federatedAnchor = federatedByPub.get(att.signer);
        if (federatedAnchor) {
          // Check anchor status before verifying signature
          if (federatedAnchor.status === 'REVOKED') {
            await log('ATTEST_VERIFY_CROSS_ORG_DENY', {
              ns,
              kid: att.kid,
              orgId: federatedAnchor.orgId,
              reason: 'federated_revoked',
            });
            return { ok: false, reason: 'federated_revoked' };
          }

          // Verify signature
          if (await verifySingleSignature(att, attested.manifest)) {
            // Check cross-org policy (Task 20)
            const policyCheck = await checkCrossOrgPolicy(
              ns,
              federatedAnchor.orgId,
              trust.operation
            );
            if (!policyCheck.allowed) {
              await log('ATTEST_VERIFY_CROSS_ORG_DENY', {
                ns,
                kid: att.kid,
                orgId: federatedAnchor.orgId,
                reason: policyCheck.reason,
              });
              return {
                ok: false,
                reason: policyCheck.reason || 'cross_org_policy_denied',
              };
            }

            await log('ATTEST_VERIFY_CROSS_ORG_ALLOW', {
              ns,
              kid: att.kid,
              orgId: federatedAnchor.orgId,
            });
            return { ok: true };
          }
        }

        // Handle legacy/unsigned (no kid and not federated)
        if (!att.kid && allowUnsigned) {
          await log('ATTEST_VERIFY_ALLOW', {
            ns,
            reason: 'unsigned_allowed',
          });
          return { ok: true };
        }
        // Continue to check other attestations before failing
      }

      // Check if any attestation had no kid (legacy in registry mode)
      const hasLegacy = attestations.some(att => !att.kid);
      if (hasLegacy) {
        await log('ATTEST_VERIFY_DENY', {
          ns,
          reason: 'legacy_pack_without_kid',
        });
        return { ok: false, reason: 'Legacy pack without kid' };
      }

      await log('ATTEST_VERIFY_DENY', { ns, reason: 'no_valid_attestation' });
      return { ok: false, reason: 'no_valid_attestation' };
    } catch (error) {
      return { ok: false, reason: `Registry error: ${error}` };
    }
  }

  // Legacy allowlist verification (Task 18 compatibility)
  for (const att of attestations) {
    if (allowedSigners && !allowedSigners.includes(att.signer)) {
      continue;
    }

    if (await verifySingleSignature(att, attested.manifest)) {
      return { ok: true };
    }
  }

  // Check if we had unsigned attestations but no allowUnsigned
  const hasUnsigned = attestations.some(att => !att.kid);
  if (hasUnsigned && !allowUnsigned) {
    await log('ATTEST_VERIFY_DENY', { ns, reason: 'unsigned_not_allowed' });
    return { ok: false, reason: 'Legacy pack without kid' };
  }

  await log('ATTEST_VERIFY_DENY', { ns, reason: 'no_valid_attestations' });
  return { ok: false, reason: 'No valid attestations found' };
}

function statusAllows(
  rec: SignerRecord,
  nowISO: string,
  graceSecs: number
): boolean {
  if (rec.status === 'ACTIVE') return true;
  if (rec.status === 'REVOKED') return false;
  if (rec.status === 'RETIRED') {
    if (!rec.expiresAt) return true; // permissive if no expiry set
    const now = new Date(nowISO).getTime();
    const expiry = new Date(rec.expiresAt).getTime();
    return now <= expiry + graceSecs * 1000;
  }
  return false;
}

async function verifySingleSignature(
  att: Attestation,
  manifest: PackManifestV1
): Promise<boolean> {
  try {
    const signerKey = await crypto.subtle.importKey(
      'spki',
      fromB64u(att.signer),
      { name: 'Ed25519' },
      false,
      ['verify']
    );

    const canonical = canonicalize(manifest);
    const messageBytes = new TextEncoder().encode(canonical);
    const signatureBytes = fromB64u(att.sig);

    return await crypto.subtle.verify(
      'Ed25519',
      signerKey,
      signatureBytes,
      messageBytes
    );
  } catch {
    return false;
  }
}
