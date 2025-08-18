/**
 * Phase B - Task 25: Witness Co-Signed Checkpoints Types
 * External witness signatures with M-of-N threshold policies
 */

// Witness registry entry
export interface Witness {
  org: string;
  id: string;
  pubB64u: string;
  status: 'ACTIVE' | 'REVOKED' | 'RETIRED';
  note?: string;
  addedAt: string;
}

// Individual witness signature
export interface WitnessSig {
  org: string;
  id: string;
  sigB64u: string;
  at: string;
}

// Witnessed checkpoint with base + witness signatures
export interface WitnessedCheckpointV1 {
  v: 1;
  ns: string;
  n: number;
  rootB64u: string;
  at: string;
  base: any; // TLCheckpointV1 from Task 24
  sigs: WitnessSig[];
}

// Verification policy for witness thresholds
export interface WitnessPolicy {
  min: number;
  requireOrgs?: string[];
  bannedOrgs?: string[];
  retiredGraceMs?: number;
}

// Verification result
export interface WitnessVerifyResult {
  ok: boolean;
  reason?: string;
  count?: number;
}
