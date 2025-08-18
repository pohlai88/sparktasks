/**
 * Invite system types for headless device onboarding
 */

// Re-export Role from membership for invite role binding
export type { Role } from '../membership/types';
import type { Role } from '../membership/types';

export interface InviteEnvelope {
  v: 1;
  createdAt: string;
  exp: string;
  saltB64u: string;
  iter: number;
  aad: string;            // `${ns}:${inviteId}`
  ctB64u: string;         // AES-GCM over BackupBundle JSON
  signerPubB64u: string;  // Ed25519 public key (SPKI, base64url)
  sigB64u: string;        // Signature over canonical manifest subset
}

export interface InviteMeta {
  ns: string;
  inviteId: string;
  used?: boolean;
  usedAt?: string;
}

// Invite content that gets signed (manifest)
export interface InviteContentV1 {
  v: 1;
  createdAt: string;
  exp: string;
  saltB64u: string;
  iter: number;
  aad: string;
  ctB64u: string;
  role?: Role;            // NEW: bound role, signed by issuer
}

// Configuration for invite role enforcement
export interface InviteRoleConfig {
  strictLegacy?: boolean;                    // default false (legacy invites → MEMBER)
  verifyIssuerStillAuthorized?: boolean;     // default false (issue-time only)
}
