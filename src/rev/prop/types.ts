/**
 * Revocation Propagation Types - Phase B Task 13
 * E2EE-safe revocation sync across devices/workspaces
 */

export type RevType = 'INVITE_REVOKED' | 'SIGNER_REVOKED' | 'RECOVERY_REVOKED';

export interface RevRecord {
  v: 1;
  id: string;
  ts: string;
  type: RevType;
  subject: string;
  reason?: string;
  issuer: {
    pubB64u: string;
    sigB64u: string;
  };
}

export interface RevTransport {
  list(ns: string, since?: string): Promise<{ keys: string[]; nextSince?: string }>;
  get(key: string): Promise<string | null>;
  put(key: string, val: string, updatedAt: string): Promise<void>;
}

export interface RevPlan {
  pullKeys: string[];
  since?: string;
}

export interface RevResult {
  applied: number;
  pushed: number;
  errors: string[];
  completed: boolean;
}
