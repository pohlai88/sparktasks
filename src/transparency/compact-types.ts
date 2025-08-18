/**
 * Phase B - Task 24: Transparency Log Types (Compact)
 */

export interface TLStateV1 { v: 1; n: number; frontier: string[]; }
export interface TLCheckpointV1 { v: 1; ns: string; n: number; rootB64u: string; at: string; signerKid: string; sigB64u: string; }
export interface TLProofV1 { v: 1; ns: string; index: number; leafHashB64u: string; siblings: string[]; rootB64u?: string; at?: string; }
export interface AppendResult { index: number; leafHashB64u: string; rootB64u: string; n: number; }
export interface VerifyResult { ok: boolean; reason?: string; }
export const LEAF_PREFIX = 0x00, NODE_PREFIX = 0x01;
