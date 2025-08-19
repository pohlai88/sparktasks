/**
 * Revocation registry for tracking revoked invites and signers
 */

import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';
import type { Role } from '../membership/types';

interface RevocationStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

let storage: RevocationStorage | null = null;
let namespace = 'spark';

export function setRevocationStorage(
  revocationStorage: RevocationStorage,
  ns = 'spark'
): void {
  storage = revocationStorage;
  namespace = ns;
}

// Storage key helpers
const inviteKey = (ns: string) => `${ns}:revoked:invites`;
const signerKey = (ns: string) => `${ns}:revoked:signers`;

// Set operations helpers
async function loadSet(
  store: RevocationStorage,
  key: string
): Promise<Set<string>> {
  const data = await store.getItem(key);
  return new Set(data ? JSON.parse(data) : []);
}

async function saveSet(
  store: RevocationStorage,
  key: string,
  set: Set<string>
): Promise<void> {
  await store.setItem(key, JSON.stringify([...set]));
}

/**
 * Revoke an invite by ID
 */
export async function revokeInvite(inviteId: string): Promise<void> {
  if (!storage) throw new Error('Revocation storage not configured');

  const key = inviteKey(namespace);
  const revokedInvites = await loadSet(storage, key);
  revokedInvites.add(inviteId);
  await saveSet(storage, key, revokedInvites);
}

/**
 * Check if an invite is revoked
 */
export async function isInviteRevoked(inviteId: string): Promise<boolean> {
  if (!storage) return false; // No revocation system configured

  const key = inviteKey(namespace);
  const revokedInvites = await loadSet(storage, key);
  return revokedInvites.has(inviteId);
}

/**
 * Revoke a signer by public key
 */
export async function revokeSigner(
  pubB64u: string,
  opts?: {
    ns?: string;
    actorId?: string;
    actorRole?: Role;
    storage?: StorageDriver;
  }
): Promise<void> {
  if (!storage) throw new Error('Revocation storage not configured');

  // Policy enforcement if context provided
  if (opts?.storage && opts.actorId && opts.actorRole) {
    await enforcePolicy(
      {
        ns: opts.ns || namespace,
        op: 'signer.revoke',
        actorId: opts.actorId,
        actorRole: opts.actorRole,
        nowISO: new Date().toISOString(),
      },
      opts.storage,
      { audit: true, commitCap: true }
    );
  }

  const key = signerKey(namespace);
  const revokedSigners = await loadSet(storage, key);
  revokedSigners.add(pubB64u);
  await saveSet(storage, key, revokedSigners);
}

/**
 * Check if a signer is revoked
 */
export async function isSignerRevoked(pubB64u: string): Promise<boolean> {
  if (!storage) return false; // No revocation system configured

  const key = signerKey(namespace);
  const revokedSigners = await loadSet(storage, key);
  return revokedSigners.has(pubB64u);
}
