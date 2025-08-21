/**
 * Recovery bundle API for headless admin recovery
 */

import { toB64u, fromB64u } from '../crypto/base64url';
import type { Role } from '../membership/types';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';

import type {
  RecoveryBundleV1,
  CreateRecoveryArgs,
  RecoverArgs,
} from './types';

// Rate limiting store (in-memory)
const rateLimitStore = new Map<
  string,
  { attempts: number; lastAttempt: number }
>();

// Canonical JSON for signature consistency
function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `"${k}":${canonicalize(obj[k])}`);
  return '{' + pairs.join(',') + '}';
}

// Namespace-bound AAD for AES-GCM
function recoveryAAD(ns: string): ArrayBuffer {
  return new TextEncoder().encode(`${ns}:recovery`).buffer;
}

// Simple FNV-1a 32-bit hash for bundle ID generation
function simpleHash(str: string): string {
  let hash = 0x81_1c_9d_c5; // FNV offset basis (32-bit)

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01_00_01_93); // FNV prime (32-bit)
  }

  return (hash >>> 0).toString(16); // Convert to unsigned 32-bit hex
}

// Generate deterministic bundle ID for revocation tracking
function getBundleId(bundle: Omit<RecoveryBundleV1, 'sigB64u'>): string {
  const canonical = canonicalize(bundle);
  return simpleHash(canonical);
}

// Check if rate limited without incrementing attempts
function isRateLimited(bundleId: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(bundleId);

  if (!record) return false;

  const timeSinceLastAttempt = now - record.lastAttempt;
  const requiredWait = Math.min(
    1000 * Math.pow(2, record.attempts - 1),
    30_000
  );

  return timeSinceLastAttempt < requiredWait;
}

// Reset rate limit on successful recovery
function resetRateLimit(bundleId: string): void {
  rateLimitStore.delete(bundleId);
}

/**
 * Create recovery bundle from healthy keyring
 */
export async function createRecoveryBundle({
  ns,
  keyring,
  issuer,
  passcode,
  expiresAt,
  iter = 100_000,
  meta,
  actorId,
  actorRole,
  storage,
}: CreateRecoveryArgs & {
  actorId?: string;
  actorRole?: Role;
  storage?: StorageDriver;
}): Promise<RecoveryBundleV1> {
  // Policy enforcement before creating recovery bundle
  if (storage && actorId && actorRole) {
    await enforcePolicy(
      {
        ns,
        op: 'recovery.create',
        actorId,
        actorRole,
        nowISO: new Date().toISOString(),
      },
      storage,
      { audit: true, commitCap: true }
    );
  }

  // Export DEK snapshot
  const backup = await keyring.exportBackup();
  const dekSnapshot = backup.deks;

  // Generate recovery KEK using PBKDF2 -> AES-GCM
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passcode),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const gcmKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer, iterations: iter, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  // Encrypt DEK snapshot with AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(dekSnapshot));
  const aad = recoveryAAD(ns);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: aad },
    gcmKey,
    plaintext
  );

  // Create bundle for signing
  const bundle = {
    v: 1 as const,
    ns,
    createdAt: new Date().toISOString(),
    ...(expiresAt && { expiresAt }),
    saltB64u: toB64u(salt.buffer),
    iter,
    issuerKID: issuer.kid,
    pubB64u: issuer.pubB64u,
    ctB64u: toB64u(ciphertext),
    ivB64u: toB64u(iv.buffer),
    ...(meta && { meta }),
  };

  // Sign canonical JSON
  const canonical = canonicalize(bundle);
  const messageBytes = new TextEncoder().encode(canonical);
  const signature = await issuer.sign(messageBytes);

  return { ...bundle, sigB64u: toB64u(new Uint8Array(signature).buffer) };
}

/**
 * Recover DEKs from bundle using passcode
 */
export async function recoverFromBundle({
  ns,
  keyring,
  bundle,
  passcode,
  options = {},
}: RecoverArgs): Promise<{ imported: number }> {
  // Validate bundle version
  if (bundle.v !== 1) throw new Error('Unsupported recovery bundle version');

  // Check expiry
  if (bundle.expiresAt && new Date() > new Date(bundle.expiresAt)) {
    throw new Error('Recovery bundle expired');
  }

  // Verify namespace binding
  if (bundle.ns !== ns) throw new Error('Namespace mismatch');

  // Generate bundle ID for revocation/rate limiting
  const { sigB64u, ...bundleForSig } = bundle;
  const bundleId = getBundleId(bundleForSig);

  // Check bundle revocation
  if (options.revocationRegistry) {
    const isRevoked = await options.revocationRegistry.isRevoked(bundleId);
    if (isRevoked) throw new Error('Recovery bundle has been revoked');
  }

  // Verify signature with issuer rotation support
  const canonical = canonicalize(bundleForSig);
  const messageBytes = new TextEncoder().encode(canonical);
  const signature = fromB64u(bundle.sigB64u);

  let publicKeyB64u = bundle.pubB64u; // Default: embedded key
  if (options.keyRegistry) {
    // Try to resolve key by issuerKID for rotation support
    const registryKey = await options.keyRegistry.getPublicKey(
      bundle.issuerKID
    );
    if (registryKey) {
      publicKeyB64u = registryKey;
    } else {
      throw new Error(`Unknown issuer key: ${bundle.issuerKID}`);
    }
  }

  const publicKey = await crypto.subtle.importKey(
    'spki',
    fromB64u(publicKeyB64u),
    { name: 'Ed25519' },
    false,
    ['verify']
  );
  const isValid = await crypto.subtle.verify(
    'Ed25519',
    publicKey,
    signature,
    messageBytes
  );

  if (!isValid) throw new Error('Invalid recovery bundle signature');

  // Check existing rate limit status
  if (options.enableRateLimit && isRateLimited(bundleId)) {
    const record = rateLimitStore.get(bundleId)!;
    const timeSinceLastAttempt = Date.now() - record.lastAttempt;
    const requiredWait = Math.min(
      1000 * Math.pow(2, record.attempts - 1),
      30_000
    );

    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil((requiredWait - timeSinceLastAttempt) / 1000)}s`
    );
  }

  // Derive recovery KEK using PBKDF2 -> AES-GCM
  const salt = fromB64u(bundle.saltB64u);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passcode),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const gcmKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: bundle.iter, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  // Decrypt DEK snapshot
  const iv = fromB64u(bundle.ivB64u);
  const ciphertext = fromB64u(bundle.ctB64u);
  const aad = recoveryAAD(ns);

  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, additionalData: aad },
      gcmKey,
      ciphertext
    );

    // Reset rate limit on successful decryption
    if (options.enableRateLimit) {
      resetRateLimit(bundleId);
    }
  } catch {
    // Record failed attempt for rate limiting
    if (options.enableRateLimit) {
      const now = Date.now();
      const record = rateLimitStore.get(bundleId);
      if (record) {
        record.attempts += 1;
        record.lastAttempt = now;
      } else {
        rateLimitStore.set(bundleId, { attempts: 1, lastAttempt: now });
      }
    }
    throw new Error('Invalid recovery passcode or corrupted bundle');
  }

  // Parse recovered DEKs
  const dekSnapshot: Array<{ kid: string; wrapped: string }> = JSON.parse(
    new TextDecoder().decode(plaintext)
  );

  // Create recovery backup bundle for import
  const recoveryBackup = {
    v: 1 as const,
    createdAt: new Date().toISOString(),
    deks: dekSnapshot,
  };

  // Get count before import (if keyring is unlocked)
  let beforeCount = 0;
  try {
    const beforeExport = await keyring.exportBackup();
    beforeCount = beforeExport.deks.length;
  } catch (error) {
    if (!(error instanceof Error && error.message === 'Keyring locked')) {
      throw error;
    }
  }

  // Import DEKs from recovery bundle
  await keyring.importBackup(recoveryBackup);

  // Get count after import (if keyring is unlocked)
  let afterCount = dekSnapshot.length;
  try {
    const afterExport = await keyring.exportBackup();
    afterCount = afterExport.deks.length;
  } catch (error) {
    if (!(error instanceof Error && error.message === 'Keyring locked')) {
      throw error;
    }
  }

  return { imported: afterCount - beforeCount };
}

// Export utilities for testing and management
export const RecoveryUtils = {
  getBundleId: (bundle: RecoveryBundleV1) => {
    const { sigB64u, ...bundleForSig } = bundle;
    return getBundleId(bundleForSig);
  },
  clearRateLimit: (bundleId: string) => rateLimitStore.delete(bundleId),
  clearAllRateLimits: () => rateLimitStore.clear(),
  getRateLimitInfo: (bundleId: string) => rateLimitStore.get(bundleId),
};
