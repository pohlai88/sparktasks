/**
 * Keyring state for passphrase-derived encryption key management
 */
export interface KeyringState {
  /** Active key ID, null if no active key */
  activeKid: string | null;
  /** Whether keyring is locked (KEK/DEKs cleared from memory) */
  locked: boolean;
  /** Metadata for key derivation */
  meta: {
    /** Base64url-encoded salt for PBKDF2 */
    saltB64u: string;
    /** PBKDF2 iteration count */
    iter: number;
  };
}

/**
 * Backup bundle format v1 - contains all wrapped DEKs
 */
export interface BackupBundle {
  /** Bundle format version */
  v: 1;
  /** ISO timestamp when bundle was created */
  createdAt: string;
  /** Optional KEK metadata to allow portable imports */
  meta?: {
    /** Base64url-encoded salt for PBKDF2 */
    saltB64u: string;
    /** PBKDF2 iteration count */
    iter: number;
    // Future: Add 'alg' field for KEK derivation algorithm versioning
    // e.g., 'PBKDF2-SHA256', 'Argon2id', etc.
  };
  /** Wrapped DEKs - each is base64url of AES-KW(DEK) */
  deks: Array<{
    /** Key ID */
    kid: string;
    /** Base64url-encoded wrapped DEK */
    wrapped: string;
  }>;
}
