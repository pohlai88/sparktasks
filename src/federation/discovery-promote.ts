/**
 * Phase B - Task 22: Federated Anchor Promotion
 * Promote pending anchors to trusted status with policy control
 */

import type { StorageDriver } from '../storage/types';
import type { PendingAnchor } from './discovery-types';
import type { TrustAnchor } from './types';
import { getPendingAnchors, setPendingAnchors, updateDiscoveryMetrics, cleanExpiredPendingAnchors } from './discovery-registry';
import { addTrustAnchor, listTrustAnchors } from './registry';
import { checkCrossOrgPolicy } from '../policy/engine';

/**
 * Auto-promote pending anchors based on policy (M3)
 */
export async function autoPromotePendingAnchors(
  ns: string,
  orgId: string,
  storage: StorageDriver,
  opts?: { policy?: any; audit?: boolean; ttlMinutes?: number }
): Promise<{ promoted: number; expired: number }> {
  // Clean expired pending anchors first
  const cleanupResult = await cleanExpiredPendingAnchors(ns, orgId, storage);
  
  const pending = await getPendingAnchors(ns, orgId, storage);
  const existing = await listTrustAnchors(ns);
  const existingKeys = new Set(existing.map(a => `${a.orgId}:${a.pubB64u}`));
  
  let promoted = 0;
  
  for (const anchor of pending) {
    // Skip if already trusted (by pubkey since TrustAnchor has no kid)
    if (existingKeys.has(`${anchor.orgId}:${anchor.pubB64u}`)) continue;
    
    // Skip REVOKED anchors (no resurrection)
    if (anchor.status === 'REVOKED') continue;
    
    // Skip RETIRED anchors (TrustAnchor only supports ACTIVE/REVOKED)
    if (anchor.status === 'RETIRED') continue;
    
    // Check promotion policy
    if (opts?.policy) {
      const policyCheck = await checkCrossOrgPolicy(ns, orgId, 'federation.discovery.promote');
      if (!policyCheck.allowed) continue;
    }
    
    // Promote to trusted (only ACTIVE status)
    const trustAnchor: TrustAnchor = {
      orgId: anchor.orgId,
      pubB64u: anchor.pubB64u,
      status: 'ACTIVE',
      createdAt: anchor.seenAt
    };
    
    await addTrustAnchor(ns, trustAnchor);
    promoted++;
  }
  
  // Update metrics
  const metricsUpdate: any = {
    totalPromoted: promoted,
    totalExpired: cleanupResult.expired
  };
  if (promoted > 0) {
    metricsUpdate.lastPromotionAt = new Date().toISOString();
  }
  await updateDiscoveryMetrics(ns, storage, metricsUpdate);
  
  return { promoted, expired: cleanupResult.expired };
}

/**
 * Manual promotion of specific pending anchors (M3)
 */
export async function promotePendingAnchors(
  ns: string,
  storage: StorageDriver,
  orgId: string,
  kids?: string[]
): Promise<{ promoted: number }> {
  const pending = await getPendingAnchors(ns, orgId, storage);
  const toPromote = kids ? 
    pending.filter(a => kids.includes(a.kid)) : 
    pending;
  
  let promoted = 0;
  const remaining: PendingAnchor[] = [];
  
  for (const anchor of pending) {
    if (toPromote.includes(anchor) && anchor.status !== 'REVOKED') {
      // Only promote ACTIVE anchors (TrustAnchor doesn't support RETIRED)
      if (anchor.status !== 'ACTIVE') {
        remaining.push(anchor);
        continue;
      }
      
      // Promote this anchor
      const trustAnchor: TrustAnchor = {
        orgId: anchor.orgId,
        pubB64u: anchor.pubB64u,
        status: 'ACTIVE',
        createdAt: anchor.seenAt
      };
      
      await addTrustAnchor(ns, trustAnchor);
      promoted++;
    } else {
      // Keep in pending
      remaining.push(anchor);
    }
  }
  
  // Update pending storage (remove promoted ones)
  await setPendingAnchors(ns, orgId, remaining, storage);
  
  return { promoted };
}
