/**
 * Phase B - Task 24: Transparency Log Types
 * Merkle accumulator with signed checkpoints and inclusion proofs
 */

// Accumulator state with incremental frontier
export interface TLStateV1 {
  v: 1;
  n: number; // number of leaves
  frontier: string[]; // base64url hashes by level (sparse array)
}

// Signed checkpoint for audit/anchoring
export interface TLCheckpointV1 {
  v: 1;
  ns: string;
  n: number;
  rootB64u: string;
  at: string; // ISO timestamp
  signerKid: string;
  sigB64u: string; // Ed25519 signature over canonical checkpoint
}

// Inclusion proof with siblings
export interface TLProofV1 {
  v: 1;
  ns: string;
  index: number;
  leafHashB64u: string;
  siblings: string[]; // base64url, bottom-up
  rootB64u?: string; // optional adornment
  at?: string; // optional timestamp
}

// API result types
export interface AppendResult {
  index: number;
  leafHashB64u: string;
  rootB64u: string;
  n: number;
}

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

// Domain separation prefixes
export const LEAF_PREFIX = 0x00;
export const NODE_PREFIX = 0x01;
