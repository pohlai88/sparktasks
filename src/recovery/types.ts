/**export interface RecoveryBundleV1 {
  v: 1;
  ns: string;              // namespace bound AAD
  createdAt: string;       // ISO
  expiresAt?: string;      // optional expiry
  saltB64u: string;        // PBKDF2 salt for recovery KEK
  iter: number;            // PBKDF2 iterations for recovery KEK
  issuerKID: string;       // issuer key identifier for rotation
  pubB64u: string;         // Ed25519 issuer public key (verifier)
  ctB64u: string;          // AES-GCM ciphertext of wrapped DEKs blob
  ivB64u: string;          // AES-GCM IV (12 bytes)
  sigB64u: string;         // Ed25519 signature over canonical JSON of bundle minus sig
  meta?: { testId?: string; note?: string }; // optional metadata for testing/tracking
}bundle types for headless admin recovery
 */

export interface RecoveryBundleV1 {
  v: 1;
  ns: string; // namespace bound AAD
  createdAt: string; // ISO
  expiresAt?: string; // optional expiry
  saltB64u: string; // PBKDF2 salt for recovery KEK
  iter: number; // PBKDF2 iterations for recovery KEK
  issuerKID: string; // issuer key ID for rotation support
  pubB64u: string; // Ed25519 issuer public key (verifier)
  ctB64u: string; // AES-GCM ciphertext of wrapped DEKs blob
  ivB64u: string; // AES-GCM IV (12 bytes)
  sigB64u: string; // Ed25519 signature over canonical JSON of bundle minus sig
}

export type RecoveryIssuer = {
  kid: string; // key identifier for rotation
  sign: (bytes: Uint8Array) => Promise<Uint8Array>; // Ed25519
  pubB64u: string; // SPKI b64u
};

export type RecoveryKeyRegistry = {
  getPublicKey: (kid: string) => Promise<string | null>; // returns pubB64u or null
};

export type RevocationRegistry = {
  isRevoked: (bundleId: string) => Promise<boolean>;
  revoke: (bundleId: string, reason?: string) => Promise<void>;
};

export type RecoveryOptions = {
  keyRegistry?: RecoveryKeyRegistry; // for issuer rotation support
  revocationRegistry?: RevocationRegistry; // for bundle revocation
  enableRateLimit?: boolean; // enable brute-force protection
};

export interface CreateRecoveryArgs {
  ns: string;
  keyring: KeyringProvider; // must be unlocked
  issuer: RecoveryIssuer; // signer for authenticity
  passcode: string; // human code -> KEK via PBKDF2
  expiresAt?: string; // optional
  iter?: number; // default e.g. 100k (tests can be lower)
  meta?: { testId?: string; note?: string }; // optional metadata
}

export interface RecoverArgs {
  ns: string;
  keyring: KeyringProvider; // locked or unlocked OK
  bundle: RecoveryBundleV1; // received artifact
  passcode: string; // typed by user
  options?: RecoveryOptions; // enhanced security options
}

// Re-export KeyringProvider type
import type { KeyringProvider } from '../crypto/keyring';
