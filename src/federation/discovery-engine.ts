/**
 * Phase B - Task 22: Federated Anchor Discovery Engine
 * Plan and execute discovery of trust anchors from remote sources
 */

import type { StorageDriver } from '../storage/types';
import type { AnchorPack } from './sync-types';
import type {
  AnchorLocator,
  DiscPlan,
  DiscResult,
  PendingAnchor,
  ConflictResolution,
} from './discovery-types';
import {
  getPendingAnchors,
  setPendingAnchors,
  getDiscoveryState,
  setDiscoveryState,
  updateDiscoveryMetrics,
  cleanExpiredPendingAnchors,
} from './discovery-registry';
import { listTrustAnchors } from './registry';
import { checkCrossOrgPolicy } from '../policy/engine';
import { fromB64u } from '../crypto/base64url';
import * as AuditApi from '../audit/api';

// Reuse canonicalize from Task 21
function canonicalize(obj: any): string {
  if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonicalize).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canonicalize(obj[k])}`).join(',') + '}';
}

/**
 * Plan anchor discovery from locators (M2)
 */
export async function planAnchorDiscovery(
  ns: string,
  locators: AnchorLocator[],
  transport: any // RemoteTransport - mock for now
): Promise<DiscPlan> {
  const pulls: DiscPlan['pulls'] = [];

  for (const locator of locators) {
    pulls.push({
      orgId: locator.orgId,
      ref: locator.ref,
      ...(locator.since && { nextSince: locator.since }),
    });
  }

  return { pulls };
}

/**
 * Verify AnchorPack signature (reuse from Task 21)
 */
async function verifyDiscoveredPack(
  pack: AnchorPack,
  ns: string,
  storage: StorageDriver
): Promise<{ ok: boolean; reason?: string }> {
  try {
    // Basic structure validation
    if (!pack.v || pack.v !== 1)
      return { ok: false, reason: 'invalid_version' };
    if (!pack.issuerOrg || !pack.sig)
      return { ok: false, reason: 'missing_fields' };

    const { kid, pubB64u, sigB64u } = pack.sig;
    if (!sigB64u) return { ok: false, reason: 'missing_signature' };

    // For discovery, we mainly verify via federated trust anchors
    if (pubB64u) {
      const trustAnchors = await listTrustAnchors(ns);
      const trustedAnchor = trustAnchors.find(
        a =>
          a.orgId === pack.issuerOrg &&
          a.pubB64u === pubB64u &&
          a.status === 'ACTIVE'
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
        'spki',
        publicKeyBytes,
        { name: 'Ed25519' },
        false,
        ['verify']
      );

      const valid = await crypto.subtle.verify(
        'Ed25519',
        publicKey,
        signatureBytes,
        messageBytes
      );
      return valid ? { ok: true } : { ok: false, reason: 'invalid_signature' };
    }

    return { ok: false, reason: 'no_verification_method' };
  } catch (error) {
    return { ok: false, reason: `verification_error: ${error}` };
  }
}

/**
 * Apply discovered anchors to pending storage with conflict resolution
 */
async function applyDiscoveredAnchors(
  pack: AnchorPack,
  ns: string,
  storage: StorageDriver,
  source: { transportId: string; path: string },
  conflictResolution: ConflictResolution = 'PREFER_NEWER'
): Promise<{ added: number; conflicts: number; rewinds: number }> {
  const existing = await getPendingAnchors(ns, pack.issuerOrg, storage);
  const existingMap = new Map(existing.map(a => [a.kid, a]));

  let added = 0;
  let conflicts = 0;
  let rewinds = 0;
  const now = new Date().toISOString();

  // Apply anchors from pack to pending
  for (const anchor of pack.anchors) {
    const current = existingMap.get(anchor.kid);

    if (!current) {
      // New pending anchor
      const pending: PendingAnchor = {
        orgId: anchor.orgId,
        kid: anchor.kid,
        pubB64u: anchor.pubB64u,
        status: anchor.status,
        seenAt: now,
        src: {
          transportId: source.transportId,
          path: source.path,
          packSeq: pack.seq,
        },
      };

      existingMap.set(anchor.kid, pending);
      added++;
    } else {
      // Handle conflict resolution
      const conflict = await resolveConflict(
        current,
        anchor,
        pack.seq,
        source,
        conflictResolution
      );

      if (conflict.action === 'UPDATE') {
        current.status = anchor.status;
        current.src.packSeq = pack.seq;
        if (conflict.rewind) {
          rewinds++;
          // Log rewind alert
          await AuditApi.log('FED_DISC_REWIND_ALERT', {
            namespace: ns,
            orgId: pack.issuerOrg,
            kid: anchor.kid,
            currentSeq: current.src.packSeq,
            newSeq: pack.seq,
            transportId: source.transportId,
            severity: 'HIGH',
          });
        }
      } else if (conflict.action === 'REJECT') {
        conflicts++;
        await AuditApi.log('FED_DISC_CONFLICT', {
          namespace: ns,
          orgId: pack.issuerOrg,
          kid: anchor.kid,
          resolution: conflictResolution,
          reason: conflict.reason,
        });
      }
    }
  }

  // Store updated pending anchors
  await setPendingAnchors(
    ns,
    pack.issuerOrg,
    Array.from(existingMap.values()),
    storage
  );

  return { added, conflicts, rewinds };
}

/**
 * Resolve conflicts between existing and new anchor
 */
async function resolveConflict(
  existing: PendingAnchor,
  newAnchor: any,
  newSeq: number,
  source: { transportId: string; path: string },
  resolution: ConflictResolution
): Promise<{ action: 'UPDATE' | 'REJECT'; rewind?: boolean; reason?: string }> {
  // Check for sequence rewind (potential replay attack)
  const isRewind = newSeq < existing.src.packSeq;

  switch (resolution) {
    case 'REJECT':
      return {
        action: 'REJECT',
        reason: 'Policy configured to reject conflicts',
      };

    case 'PREFER_NEWER':
      if (newSeq > existing.src.packSeq) {
        return { action: 'UPDATE' };
      } else if (isRewind) {
        return { action: 'UPDATE', rewind: true };
      }
      return {
        action: 'REJECT',
        reason: 'Existing anchor has newer or equal sequence',
      };

    case 'PREFER_FIRST':
      return { action: 'REJECT', reason: 'Keeping first-seen anchor' };

    case 'PREFER_SOURCE':
      const existingPriority = existing.src.priority || 0;
      const newPriority = (source as any).priority || 0;
      if (newPriority > existingPriority) {
        return { action: 'UPDATE', rewind: isRewind };
      }
      return {
        action: 'REJECT',
        reason: 'Existing anchor from higher priority source',
      };

    default:
      return {
        action: 'REJECT',
        reason: 'Unknown conflict resolution strategy',
      };
  }
}

/**
 * Run anchor discovery (M2)
 */
export async function runAnchorDiscovery(
  ns: string,
  plan: DiscPlan,
  storage: StorageDriver,
  opts?: {
    policy?: any;
    audit?: boolean;
    autoPromote?: boolean;
    conflictResolution?: ConflictResolution;
    ttlMinutes?: number;
  }
): Promise<DiscResult> {
  const result: DiscResult = {
    pulled: 0,
    pendingAdded: 0,
    promoted: 0,
    rejected: 0,
    conflicts: 0,
    rewinds: 0,
    expired: 0,
    errors: [],
  };

  for (const pull of plan.pulls) {
    try {
      // Clean expired pending anchors first
      const cleanupResult = await cleanExpiredPendingAnchors(
        ns,
        pull.orgId,
        storage
      );
      result.expired += cleanupResult.expired;

      // Check policy for discovery pulls
      if (opts?.policy) {
        const policyCheck = await checkCrossOrgPolicy(
          ns,
          pull.orgId,
          'federation.discovery.pull'
        );
        if (!policyCheck.allowed) {
          result.rejected++;
          result.errors.push(
            `Policy denied pull from ${pull.orgId}: ${policyCheck.reason}`
          );
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
        sig: { pubB64u: 'mock', sigB64u: 'mock' },
      };

      // Verify discovered pack
      const verification = await verifyDiscoveredPack(mockPack, ns, storage);
      if (!verification.ok) {
        result.rejected++;
        result.errors.push(
          `Verification failed for ${pull.orgId}: ${verification.reason}`
        );
        continue;
      }

      // Apply to pending storage
      const applied = await applyDiscoveredAnchors(
        mockPack,
        ns,
        storage,
        pull.ref,
        opts?.conflictResolution || 'PREFER_NEWER'
      );
      result.pulled++;
      result.pendingAdded += applied.added;
      result.conflicts += applied.conflicts;
      result.rewinds += applied.rewinds;

      // Update discovery cursor
      if (pull.nextSince) {
        await setDiscoveryState(
          ns,
          pull.orgId,
          { since: pull.nextSince },
          storage
        );
      }
    } catch (error) {
      result.errors.push(`Discovery error for ${pull.orgId}: ${error}`);
    }
  }

  // Update metrics
  await updateDiscoveryMetrics(ns, storage, {
    totalPulls: result.pulled,
    totalPending: result.pendingAdded,
    totalRejected: result.rejected,
    totalConflicts: result.conflicts,
    totalRewinds: result.rewinds,
    totalExpired: result.expired,
    lastPullAt: new Date().toISOString(),
  });

  return result;
}
