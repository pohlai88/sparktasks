/**
 * Federation Trust Registry - Phase B Task 20
 * CRUD operations for remote org trust anchors
 */

import { log } from '../audit/api';
import type { StorageDriver } from '../storage/types';
import type { TrustAnchor, AnchorStatus } from './types';

let registryStorage: StorageDriver | null = null;

export function configureFederationRegistry(storage: StorageDriver): void {
  registryStorage = storage;
}

function requireStorage(): StorageDriver {
  if (!registryStorage) throw new Error('Federation registry not configured');
  return registryStorage;
}

export async function addTrustAnchor(
  ns: string,
  anchor: Omit<TrustAnchor, 'status' | 'createdAt'> & { status?: AnchorStatus }
): Promise<void> {
  const storage = requireStorage();
  const key = `federation:${ns}:anchors`;
  
  const existing = await listTrustAnchors(ns);
  const existingIndex = existing.findIndex(a => a.orgId === anchor.orgId);
  
  const newAnchor: TrustAnchor = {
    ...anchor,
    status: anchor.status || 'ACTIVE',
    createdAt: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    existing[existingIndex] = newAnchor;
  } else {
    existing.push(newAnchor);
  }
  
  await storage.setItem(key, JSON.stringify(existing));
  await log('FED_TRUST_ADDED', { ns, orgId: anchor.orgId, status: newAnchor.status });
}

export async function removeTrustAnchor(ns: string, orgId: string): Promise<void> {
  const storage = requireStorage();
  const key = `federation:${ns}:anchors`;
  
  const existing = await listTrustAnchors(ns);
  const filtered = existing.filter(a => a.orgId !== orgId);
  
  if (filtered.length === existing.length) return; // Idempotent
  
  await storage.setItem(key, JSON.stringify(filtered));
  await log('FED_TRUST_REMOVED', { ns, orgId });
}

export async function revokeTrustAnchor(ns: string, orgId: string): Promise<void> {
  const storage = requireStorage();
  const key = `federation:${ns}:anchors`;
  
  const existing = await listTrustAnchors(ns);
  const anchor = existing.find(a => a.orgId === orgId);
  
  if (!anchor) throw new Error(`Trust anchor not found: ${orgId}`);
  
  anchor.status = 'REVOKED';
  await storage.setItem(key, JSON.stringify(existing));
  await log('FED_TRUST_UPDATED', { ns, orgId, status: 'REVOKED' });
}

export async function listTrustAnchors(ns: string): Promise<TrustAnchor[]> {
  const storage = requireStorage();
  const key = `federation:${ns}:anchors`;
  
  const stored = await storage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}
