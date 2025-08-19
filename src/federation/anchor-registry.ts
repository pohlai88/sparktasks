/**
 * Phase B - Task 21: Federated Anchor Sync Registry
 * Storage and state management for synced trust anchors
 */

import type { StorageDriver } from '../storage/types';
import type { Anchor, AnchorPack, SyncState } from './sync-types';
import { toB64u } from '../crypto/base64url';

// Reuse canonicalize from existing code
function canonicalize(obj: any): string {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

// Storage keys
const anchorKey = (ns: string, orgId: string) => `fed:anchors:${ns}:${orgId}`;
const stateKey = (ns: string, orgId: string) =>
  `fed:anchors:__state__:${ns}:${orgId}`;

/**
 * Get anchors for a specific org
 */
export async function getAnchors(
  ns: string,
  orgId: string,
  storage: StorageDriver
): Promise<Anchor[]> {
  try {
    const data = await storage.getItem(anchorKey(ns, orgId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Store anchors for a specific org (replaces existing)
 */
export async function setAnchors(
  ns: string,
  orgId: string,
  anchors: Anchor[],
  storage: StorageDriver
): Promise<void> {
  await storage.setItem(anchorKey(ns, orgId), JSON.stringify(anchors));
}

/**
 * Get sync state for an org
 */
export async function getSyncState(
  ns: string,
  orgId: string,
  storage: StorageDriver
): Promise<SyncState> {
  try {
    const data = await storage.getItem(stateKey(ns, orgId));
    return data ? JSON.parse(data) : { lastSeq: 0 };
  } catch {
    return { lastSeq: 0 };
  }
}

/**
 * Update sync state for an org
 */
export async function setSyncState(
  ns: string,
  orgId: string,
  state: SyncState,
  storage: StorageDriver
): Promise<void> {
  await storage.setItem(stateKey(ns, orgId), JSON.stringify(state));
}

/**
 * Create canonical signature for AnchorPack
 */
export async function signAnchorPack(
  pack: Omit<AnchorPack, 'sig'>,
  privateKey: CryptoKey,
  publicKeyBytes: ArrayBuffer,
  kid?: string
): Promise<AnchorPack> {
  const canonical = canonicalize(pack);
  const messageBytes = new TextEncoder().encode(canonical);
  const signature = await crypto.subtle.sign(
    'Ed25519',
    privateKey,
    messageBytes
  );

  return {
    ...pack,
    sig: {
      ...(kid && { kid }),
      pubB64u: toB64u(publicKeyBytes),
      sigB64u: toB64u(signature),
    },
  };
}
