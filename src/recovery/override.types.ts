/**
 * Recovery Override Types - Phase B Task 16
 * Admin-only recovery overrides for lost passphrase scenarios
 */

import type { KeyringProvider } from '../crypto/keyring';
import type { MState } from '../membership/types';

export type RecoveryOverrideContentV1 = {
  ns: string;
  id: string;                   // override id
  beneficiaryId: string;        // enforced at accept
  scope?: "ALL" | "ACTIVE";     // default "ALL"
  exp?: string;                 // expiry
  saltB64u: string;             // PBKDF2 salt (session key from code)
};

export interface RecoveryOverrideEnvelope {
  v: 1;
  content: RecoveryOverrideContentV1;
  ctB64u: string;               // AES-GCM ciphertext of wrapped DEKs blob
  ivB64u: string;               // AES-GCM IV (12 bytes)
  sigB64u: string;              // Ed25519 signature over canonical content
}

export interface CreateRecoveryOverrideArgs {
  ns: string;
  actorId: string;              // issuer
  beneficiaryId: string;        // target user
  code: string;                 // short human code
  expiresAt?: string;           // ISO; optional
  scope?: "ALL" | "ACTIVE";     // optional; default "ALL"
  sign: (bytes: Uint8Array) => Promise<string>;
}

// Minimal membership API interface for the override system
export interface MembershipApi {
  getMembership(): Promise<MState>;
}

export interface AcceptRecoveryOverrideArgs {
  ns: string;
  envelope: RecoveryOverrideEnvelope;
  code: string;
  keyring: KeyringProvider;
  beneficiaryId: string;        // must match envelope content
  membership: MembershipApi;    // to assert beneficiary's membership exists
}
