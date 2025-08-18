/**
 * Phase B - Task 23: Multi-Sig Attestation Types
 * Threshold-based multi-signature verification for Sparkpacks
 */

// Multi-signature attestation (v2)
export interface PackAttestV2 {
  v: 2;
  sigs: Array<{
    kid?: string;          // preferred: bound to local signer registry
    pubB64u?: string;      // legacy/federated path (policy-gated)
    sigB64u: string;       // Ed25519 signature over canonical bytes
  }>;
}

// Policy for threshold verification
export interface ThresholdPolicy {
  min: number;                 // M in M-of-N threshold
  allowLegacy?: boolean;       // permit sigs without kid if pubB64u trusted
  bannedKids?: string[];       // disallow specific signers
  requireKids?: string[];      // require all of these kids to be present & valid
  retiredGraceMs?: number;     // allow RETIRED within grace period
}

// Verification result
export interface MultiSigResult {
  ok: boolean;
  count: number;               // number of valid signatures
  reasons?: string[];          // error reasons if verification fails
}

// Union type for backwards compatibility
export type PackAttest = PackAttestV1 | PackAttestV2;

// Re-export v1 for compatibility
export interface PackAttestV1 {
  v: 1;
  manifest: {
    content: {
      eventsHash: string;
      eventsCount: number;
    };
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
