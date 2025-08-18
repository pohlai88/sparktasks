/**
 * Trust Root Management Engine - Phase B Task 15B
 * Secure trust root and signer rotation with threshold signatures
 */

import type { StorageDriver } from '../storage/types';
import type { 
  TrustRoot, TrustManifest, TrustIssuer, TrustOperation, TrustOpType,
  TrustValidation, TrustState, TrustConfig, TrustTransport, TrustMigration
} from './types';
import { toB64u, fromB64u } from '../crypto/base64url';
import * as AuditApi from '../audit/api';

let storage: StorageDriver;
let namespace: string;
let transport: TrustTransport | undefined;

export function configureTrust(
  storageDriver: StorageDriver,
  ns: string,
  transportImpl?: TrustTransport
): void {
  storage = storageDriver;
  namespace = ns;
  transport = transportImpl;
  
  // Initialize audit logging for trust events
  AuditApi.configureAudit(storageDriver, ns);
}

// Canonical JSON serialization
function canon(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canon).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canon(obj[k])}`).join(',') + '}';
}

// Generate unique operation ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Hash generation for manifest chaining
async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return toB64u(hashBuffer);
}

// Ed25519 signature verification
async function verifySignature(
  data: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const pubKey = await crypto.subtle.importKey(
      'spki',
      fromB64u(publicKey),
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify(
      'Ed25519',
      pubKey,
      fromB64u(signature),
      new TextEncoder().encode(data)
    );
  } catch {
    return false;
  }
}

// Trust state management
export async function getTrustState(): Promise<TrustState | null> {
  try {
    const data = await storage.getItem(`trust:${namespace}:state`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function saveTrustState(state: TrustState): Promise<void> {
  await storage.setItem(`trust:${namespace}:state`, JSON.stringify(state));
}

// Validate trust manifest structure and signatures
export async function validateTrustManifest(
  manifest: TrustManifest,
  issuers: TrustIssuer[],
  previousManifest?: TrustManifest
): Promise<TrustValidation> {
  const errors: string[] = [];
  let manifestValid = true;
  let signaturesValid = true;
  let thresholdMet = true;
  let chainValid = true;

  // Validate manifest structure
  if (!manifest.roots || manifest.roots.length === 0) {
    manifestValid = false;
    errors.push('Manifest must contain at least one trust root');
  }

  if (manifest.threshold < 1 || manifest.threshold > manifest.roots.length) {
    manifestValid = false;
    errors.push('Invalid threshold: must be between 1 and number of roots');
  }

  // Validate chain integrity
  if (previousManifest) {
    const expectedHash = await generateHash(canon(previousManifest));
    if (manifest.precedingHash !== expectedHash) {
      chainValid = false;
      errors.push('Manifest chain integrity violation');
    }
  }

  // Validate signatures
  const manifestCanonical = canon(manifest);
  const validSignatures = new Set<string>();

  for (const issuer of issuers) {
    // Find matching trust root
    const root = (previousManifest || manifest).roots.find(r => r.id === issuer.rootId);
    if (!root) {
      errors.push(`Unknown trust root: ${issuer.rootId}`);
      continue;
    }

    if (root.pubB64u !== issuer.pubB64u) {
      errors.push(`Public key mismatch for root: ${issuer.rootId}`);
      continue;
    }

    // Verify signature
    const valid = await verifySignature(manifestCanonical, issuer.sigB64u, issuer.pubB64u);
    if (valid) {
      validSignatures.add(issuer.rootId);
    } else {
      errors.push(`Invalid signature from root: ${issuer.rootId}`);
    }
  }

  signaturesValid = validSignatures.size === issuers.length;
  const requiredThreshold = previousManifest?.threshold || manifest.threshold;
  thresholdMet = validSignatures.size >= requiredThreshold;

  if (!thresholdMet) {
    errors.push(`Insufficient signatures: ${validSignatures.size}/${requiredThreshold}`);
  }

  return {
    valid: manifestValid && signaturesValid && thresholdMet && chainValid,
    manifestValid,
    signaturesValid,
    thresholdMet,
    chainValid,
    errors
  };
}

// Initialize trust system with first manifest
export async function initializeTrust(config: TrustConfig): Promise<TrustState> {
  const existingState = await getTrustState();
  if (existingState) {
    throw new Error('Trust system already initialized');
  }

  const manifest: TrustManifest = {
    version: 1,
    namespace: config.namespace,
    roots: config.initialRoots,
    threshold: config.initialThreshold,
    createdAt: Date.now()
  };

  const state: TrustState = {
    currentManifest: manifest,
    pendingOperations: [],
    operationHistory: [],
    lastUpdated: Date.now()
  };

  await saveTrustState(state);
  
  // Audit log
  await AuditApi.log('TRUST_INITIALIZED', { 
    manifestVersion: manifest.version,
    rootCount: manifest.roots.length,
    threshold: manifest.threshold
  });

  return state;
}

// Create trust operation (requires threshold signatures to apply)
export async function createTrustOperation(
  type: TrustOpType,
  targetManifest: TrustManifest,
  reason?: string
): Promise<TrustOperation> {
  const state = await getTrustState();
  if (!state) {
    throw new Error('Trust system not initialized');
  }

  const operation: TrustOperation = {
    id: generateId(),
    type,
    namespace,
    targetManifest,
    issuers: [],
    createdAt: Date.now(),
    ...(reason && { reason })
  };

  // Add to pending operations
  state.pendingOperations.push(operation);
  state.lastUpdated = Date.now();
  await saveTrustState(state);

  // Publish for distributed coordination
  if (transport) {
    await transport.publishOperation(operation);
  }

  await AuditApi.log('TRUST_OPERATION_CREATED', { 
    operationId: operation.id,
    operationType: type,
    reason: reason || 'No reason provided'
  });

  return operation;
}

// Add signature to pending operation
export async function signTrustOperation(
  operationId: string,
  issuer: TrustIssuer
): Promise<boolean> {
  const state = await getTrustState();
  if (!state) return false;

  const operation = state.pendingOperations.find(op => op.id === operationId);
  if (!operation) return false;

  // Verify signature against operation's target manifest
  const manifestCanonical = canon(operation.targetManifest);
  const signatureValid = await verifySignature(
    manifestCanonical,
    issuer.sigB64u,
    issuer.pubB64u
  );

  if (!signatureValid) return false;

  // Add signature if not already present
  if (!operation.issuers.find(i => i.rootId === issuer.rootId)) {
    operation.issuers.push(issuer);
    state.lastUpdated = Date.now();
    await saveTrustState(state);

    await AuditApi.log('TRUST_OPERATION_SIGNED', { 
      operationId,
      signerId: issuer.rootId,
      signatureCount: operation.issuers.length
    });
  }

  // Check if threshold met and auto-apply
  if (operation.issuers.length >= state.currentManifest.threshold) {
    await applyTrustOperation(operationId);
  }

  return true;
}

// Apply trust operation (when threshold signatures collected)
export async function applyTrustOperation(operationId: string): Promise<boolean> {
  const state = await getTrustState();
  if (!state) return false;

  const opIndex = state.pendingOperations.findIndex(op => op.id === operationId);
  if (opIndex === -1) return false;

  const operation = state.pendingOperations[opIndex];

  // Validate operation before applying
  const validation = await validateTrustManifest(
    operation.targetManifest,
    operation.issuers,
    state.currentManifest
  );

  if (!validation.valid) {
    await AuditApi.log('TRUST_OPERATION_REJECTED', { 
      operationId,
      errors: validation.errors
    });
    return false;
  }

  // Apply operation
  state.currentManifest = operation.targetManifest;
  state.operationHistory.push(operation);
  state.pendingOperations.splice(opIndex, 1);
  state.lastUpdated = Date.now();
  await saveTrustState(state);

  await AuditApi.log('TRUST_OPERATION_APPLIED', { 
    operationId,
    operationType: operation.type,
    newManifestVersion: operation.targetManifest.version
  });

  return true;
}

// Get current active trust roots
export async function getActiveTrustRoots(): Promise<TrustRoot[]> {
  const state = await getTrustState();
  if (!state) return [];
  
  const now = Date.now();
  return state.currentManifest.roots.filter(root => 
    !root.expiresAt || root.expiresAt > now
  );
}

// Verify if a public key is trusted
export async function isTrustedKey(pubB64u: string): Promise<boolean> {
  const roots = await getActiveTrustRoots();
  return roots.some(root => root.pubB64u === pubB64u);
}

// Migrate from legacy trustedAdmins array
export async function migrateLegacyTrust(
  legacyAdmins: string[],
  migrationSignatures: TrustIssuer[]
): Promise<TrustMigration> {
  // Create trust roots from legacy admin keys
  const roots: TrustRoot[] = legacyAdmins.map((pubB64u, index) => ({
    id: `legacy-${index}`,
    pubB64u,
    role: 'PRIMARY' as const,
    createdAt: Date.now()
  }));

  // Create initial manifest
  const manifest: TrustManifest = {
    version: 1,
    namespace,
    roots,
    threshold: Math.ceil(roots.length / 2), // Majority threshold
    createdAt: Date.now()
  };

  const migration: TrustMigration = {
    fromAdmins: legacyAdmins,
    toManifest: manifest,
    migrationSignatures
  };

  // Validate migration signatures
  const manifestCanonical = canon(manifest);
  let validSigs = 0;
  
  for (const sig of migrationSignatures) {
    if (legacyAdmins.includes(sig.pubB64u)) {
      const valid = await verifySignature(manifestCanonical, sig.sigB64u, sig.pubB64u);
      if (valid) validSigs++;
    }
  }

  if (validSigs >= manifest.threshold) {
    // Initialize trust system with migrated manifest
    const state: TrustState = {
      currentManifest: manifest,
      pendingOperations: [],
      operationHistory: [],
      lastUpdated: Date.now()
    };

    await saveTrustState(state);
    migration.completedAt = Date.now();

    await AuditApi.log('TRUST_LEGACY_MIGRATED', { 
      legacyAdminCount: legacyAdmins.length,
      manifestVersion: manifest.version,
      validSignatures: validSigs
    });
  }

  return migration;
}
