/**
 * Trust Root Management Types - Phase B Task 15B
 * Secure trust root and signer rotation infrastructure
 */

// Trust Root Identity
export interface TrustRoot {
  readonly id: string;        // Unique identifier for this trust root
  readonly pubB64u: string;   // Ed25519 public key (base64url)
  readonly role: 'PRIMARY' | 'SECONDARY' | 'EMERGENCY'; // Trust root role
  readonly createdAt: number; // Timestamp of creation
  readonly expiresAt?: number; // Optional expiration timestamp
  readonly metadata?: Record<string, any>; // Optional metadata
}

// Trust Manifest - Signed list of active trust roots
export interface TrustManifest {
  readonly version: number;     // Manifest version number
  readonly namespace: string;   // Workspace namespace
  readonly roots: TrustRoot[];  // Active trust roots
  readonly threshold: number;   // Minimum signatures required for operations
  readonly createdAt: number;   // Manifest creation timestamp
  readonly precedingHash?: string; // Hash of previous manifest (for chain integrity)
}

// Trust Issuer - Signature information for trust operations
export interface TrustIssuer {
  readonly rootId: string;      // Trust root ID that signed this
  readonly pubB64u: string;     // Public key (must match trust root)
  readonly sigB64u: string;     // Ed25519 signature (base64url)
  readonly signedAt: number;    // Signature timestamp
}

// Trust Operation Types
export type TrustOpType = 
  | 'TRUST_MANIFEST_CREATE'   // Create initial trust manifest
  | 'TRUST_ROOT_ADD'          // Add new trust root
  | 'TRUST_ROOT_REMOVE'       // Remove/revoke trust root
  | 'TRUST_ROOT_ROTATE'       // Rotate existing trust root
  | 'TRUST_THRESHOLD_UPDATE'  // Update signature threshold
  | 'TRUST_EMERGENCY_OVERRIDE'; // Emergency trust recovery

// Trust Operation Record
export interface TrustOperation {
  readonly id: string;          // Unique operation ID
  readonly type: TrustOpType;   // Operation type
  readonly namespace: string;   // Target namespace
  readonly targetManifest: TrustManifest; // Resulting trust manifest
  issuers: TrustIssuer[]; // Required signatures (threshold-based)
  readonly createdAt: number;   // Operation timestamp
  readonly reason?: string;     // Optional reason/justification
}

// Trust Validation Result
export interface TrustValidation {
  readonly valid: boolean;      // Overall validation result
  readonly manifestValid: boolean; // Manifest structure validity
  readonly signaturesValid: boolean; // All signatures valid
  readonly thresholdMet: boolean; // Minimum signatures present
  readonly chainValid: boolean; // Manifest chain integrity
  readonly errors: string[];    // Validation error details
}

// Trust State
export interface TrustState {
  currentManifest: TrustManifest; // Active trust manifest
  pendingOperations: TrustOperation[]; // Operations awaiting signatures
  operationHistory: TrustOperation[]; // Completed operations
  lastUpdated: number; // State last modified timestamp
}

// Trust Transport Interface (for distributed coordination)
export interface TrustTransport {
  publishOperation(operation: TrustOperation): Promise<void>;
  subscribeToOperations(namespace: string, callback: (op: TrustOperation) => void): Promise<void>;
  requestSignatures(operationId: string, requiredRoots: string[]): Promise<TrustIssuer[]>;
}

// Trust Configuration
export interface TrustConfig {
  readonly namespace: string;
  readonly initialRoots: TrustRoot[];
  readonly initialThreshold: number;
  readonly signatureTimeout?: number; // Timeout for signature collection (ms)
  readonly emergencyMode?: boolean;   // Enable emergency override capabilities
}

// Trust Migration (for upgrading from trustedAdmins arrays)
export interface TrustMigration {
  readonly fromAdmins: string[];      // Legacy trustedAdmins array
  readonly toManifest: TrustManifest; // Target trust manifest
  readonly migrationSignatures: TrustIssuer[]; // Signatures from legacy admins
  completedAt?: number;      // Migration completion timestamp
}
