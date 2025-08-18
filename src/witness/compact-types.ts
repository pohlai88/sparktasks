/**
 * Phase B - Task 25: Compact Witness Types
 */

export interface Witness { org: string; id: string; pubB64u: string; status: 'ACTIVE' | 'REVOKED' | 'RETIRED'; note?: string; addedAt: string; }
export interface WitnessSig { org: string; id: string; sigB64u: string; at: string; }
export interface WitnessedCheckpointV1 { v: 1; ns: string; n: number; rootB64u: string; at: string; base: any; sigs: WitnessSig[]; }
export interface WitnessPolicy { min: number; requireOrgs?: string[]; bannedOrgs?: string[]; retiredGraceMs?: number; }
export interface WitnessVerifyResult { ok: boolean; reason?: string; count?: number; }
