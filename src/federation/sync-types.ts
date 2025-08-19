/**
 * Phase B - Task 21: Federated Anchor Sync Types
 * Sync trust anchors between federated orgs using signed, attestable bundles
 */

// Anchor in sync pack (enriched from registry TrustAnchor)
export interface Anchor {
  orgId: string; // issuer org
  kid: string; // key id
  pubB64u: string; // Ed25519 SPKI b64url
  status: 'ACTIVE' | 'RETIRED' | 'REVOKED';
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  expiresAt?: string; // ISO
  note?: string;
}

// Signed AnchorPack v1 (canonically serialized & signed)
export interface AnchorPack {
  v: 1;
  issuerOrg: string;
  createdAt: string; // ISO
  seq: number; // monotonic per-issuer
  anchors: Anchor[]; // full snapshot OR recent changes
  sig: {
    kid?: string; // prefer local signer
    pubB64u?: string; // fallback to federated trust anchor
    sigB64u: string; // Ed25519 signature over canonical JSON
  };
}

// Sync planning and execution
export interface SyncPlan {
  pulls: Array<{
    orgId: string;
    refId: string;
    nextSince?: string;
  }>;
}

export interface SyncResult {
  ok: boolean;
  results: Array<{
    orgId: string;
    ok: boolean;
    added?: number;
    updated?: number;
    revoked?: number;
    seq?: number;
    error?: string;
  }>;
}

// Sync state tracking
export interface SyncState {
  since?: string;
  lastSeq: number;
}
