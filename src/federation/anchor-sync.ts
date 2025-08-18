/**
 * Phase B - Task 21: Federated Anchor Sync Engine
 * Plan and execute synchronization of trust anchors between federated orgs
 */

import type { StorageDriver } from '../storage/types';
import type { AnchorPack, SyncPlan, SyncResult } from './sync-types';
import { getAnchors, setAnchors, setSyncState } from './anchor-registry';
import { listTrustAnchors } from './registry';
import { checkCrossOrgPolicy } from '../policy/engine';
import { fromB64u } from '../crypto/base64url';

// Reuse canonicalize
function canonicalize(obj: any): string {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

/**
 * Plan anchor sync (M2 - pull planning)
 */
export async function planAnchorSync(
  ns: string,
  transport: any, // RemoteTransport
  peers: string[]
): Promise<SyncPlan> {
  const pulls: SyncPlan['pulls'] = [];
  
  for (const orgId of peers) {
    // Basic planning - would call transport.list() in real implementation
    // For now, just plan to pull from each peer
    pulls.push({
      orgId,
      refId: `${orgId}-latest`,
      nextSince: new Date().toISOString()
    });
  }
  
  return { pulls };
}

/**
 * Verify AnchorPack signature and structure
 */
async function verifyAnchorPack(
  pack: AnchorPack,
  ns: string,
  storage: StorageDriver
): Promise<{ ok: boolean; reason?: string }> {
  try {
    // Check basic structure
    if (!pack.v || pack.v !== 1) return { ok: false, reason: 'invalid_version' };
    if (!pack.issuerOrg || !pack.sig) return { ok: false, reason: 'missing_fields' };
    
    // Get signature components
    const { kid, pubB64u, sigB64u } = pack.sig;
    if (!sigB64u) return { ok: false, reason: 'missing_signature' };
    
    // Try local signer first if kid provided
    if (kid) {
      // Would check local signer registry - simplified for now
      return { ok: false, reason: 'local_signer_not_found' };
    }
    
    // Check federated trust anchors
    if (pubB64u) {
      const trustAnchors = await listTrustAnchors(ns);
      const trustedAnchor = trustAnchors.find(a => 
        a.orgId === pack.issuerOrg && a.pubB64u === pubB64u && a.status === 'ACTIVE'
      );
      
      if (!trustedAnchor) {
        return { ok: false, reason: 'untrusted_issuer' };
      }
      
      // Verify signature
      const { sig, ...unsigned } = pack;
      const canonical = canonicalize(unsigned);
      const messageBytes = new TextEncoder().encode(canonical);
      const publicKeyBytes = fromB64u(pubB64u);
      const signatureBytes = fromB64u(sigB64u);
      
      const publicKey = await crypto.subtle.importKey(
        'spki', publicKeyBytes, { name: 'Ed25519' }, false, ['verify']
      );
      
      const valid = await crypto.subtle.verify('Ed25519', publicKey, signatureBytes, messageBytes);
      return valid ? { ok: true } : { ok: false, reason: 'invalid_signature' };
    }
    
    return { ok: false, reason: 'no_verification_method' };
  } catch (error) {
    return { ok: false, reason: `verification_error: ${error}` };
  }
}

/**
 * Apply anchor deltas from verified pack
 */
async function applyAnchorPack(
  pack: AnchorPack,
  ns: string,
  storage: StorageDriver
): Promise<{ added: number; updated: number; revoked: number }> {
  const existing = await getAnchors(ns, pack.issuerOrg, storage);
  const existingMap = new Map(existing.map(a => [a.kid, a]));
  
  let added = 0, updated = 0, revoked = 0;
  
  // Apply anchors from pack
  for (const anchor of pack.anchors) {
    const current = existingMap.get(anchor.kid);
    
    if (!current) {
      added++;
      existingMap.set(anchor.kid, anchor);
    } else if (anchor.updatedAt && (!current.updatedAt || anchor.updatedAt > current.updatedAt)) {
      updated++;
      if (anchor.status === 'REVOKED' && current.status !== 'REVOKED') revoked++;
      existingMap.set(anchor.kid, anchor);
    }
  }
  
  // Store updated anchors
  await setAnchors(ns, pack.issuerOrg, Array.from(existingMap.values()), storage);
  
  return { added, updated, revoked };
}

/**
 * Run anchor sync (M2 - verify & apply)
 */
export async function runAnchorSync(
  plan: SyncPlan,
  storage: StorageDriver,
  opts?: { policy?: any; audit?: boolean }
): Promise<SyncResult> {
  const results: SyncResult['results'] = [];
  
  for (const pull of plan.pulls) {
    try {
      // Check policy
      if (opts?.policy) {
        const policyCheck = await checkCrossOrgPolicy('default', pull.orgId, 'federation.anchor.sync.pull');
        if (!policyCheck.allowed) {
          results.push({ 
            orgId: pull.orgId, 
            ok: false, 
            error: policyCheck.reason || 'policy_denied' 
          });
          continue;
        }
      }
      
      // Mock pack retrieval - in real implementation would fetch via transport
      const mockPack: AnchorPack = {
        v: 1,
        issuerOrg: pull.orgId,
        createdAt: new Date().toISOString(),
        seq: 1,
        anchors: [],
        sig: { pubB64u: 'mock', sigB64u: 'mock' }
      };
      
      // Verify pack
      const verification = await verifyAnchorPack(mockPack, 'default', storage);
      if (!verification.ok) {
        results.push({ 
          orgId: pull.orgId, 
          ok: false, 
          error: verification.reason || 'verification_failed'
        });
        continue;
      }
      
      // Apply changes
      const applied = await applyAnchorPack(mockPack, 'default', storage);
      
      // Update sync state
      if (pull.nextSince) {
        await setSyncState('default', pull.orgId, {
          since: pull.nextSince,
          lastSeq: mockPack.seq
        }, storage);
      }
      
      results.push({
        orgId: pull.orgId,
        ok: true,
        seq: mockPack.seq,
        ...applied
      });
      
    } catch (error) {
      results.push({ 
        orgId: pull.orgId, 
        ok: false, 
        error: `sync_error: ${error}` 
      });
    }
  }
  
  return {
    ok: results.every(r => r.ok),
    results
  };
}
