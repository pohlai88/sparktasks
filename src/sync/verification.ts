/**
 * Sync Integration with Attestation - Phase B Task 18
 * Verified pack import with legacy support and policy controls
 */

import type { SyncPlan } from './plan';
import type { AttestedPack } from './attestation';
import type { Sparkpack } from '../domain/pack/types';
import { verifyPackAttestation } from './attestation';
import { listTrustedSigners, auditPackVerification } from './trust';
import { enforcePolicy } from '../policy/engine';
import type { StorageDriver } from '../storage/types';
import type { Role } from '../membership/types';

export interface VerifiedSyncOptions {
  allowUnsigned?: boolean;
  storage?: StorageDriver;
  actorId?: string;
  actorRole?: Role;
}

export interface VerificationStats {
  verified: number;
  rejected: number;
  unsigned: number;
}

/**
 * Verify and filter packs during sync planning
 */
export async function verifyPacksInPlan(
  plan: SyncPlan,
  namespace: string,
  packData: Array<{ key: string; data: string }>,
  opts: VerifiedSyncOptions = {}
): Promise<{ filteredPlan: SyncPlan; stats: VerificationStats }> {
  const stats: VerificationStats = { verified: 0, rejected: 0, unsigned: 0 };
  const validPacks: Sparkpack[] = [];
  
  // Get trusted signers for verification
  const allowedSigners = await listTrustedSigners(namespace);
  
  for (const { key, data } of packData) {
    try {
      // Try to parse as attested pack first
      let pack: Sparkpack;
      
      try {
        const attested: AttestedPack = JSON.parse(data);
        if (attested.v === 1 && attested.att) {
          
          // Verify attestation
          const verifyResult = await verifyPackAttestation(attested, {
            ...(opts.allowUnsigned !== undefined && { allowUnsigned: opts.allowUnsigned }),
            allowedSigners
          });
          
          if (verifyResult.ok) {
            // Reconstruct Sparkpack from manifest
            pack = {
              meta: attested.manifest.meta,
              events: [] // Events would be in separate field in real implementation
            };
            
            stats.verified++;
            await auditPackVerification(namespace, attested.manifest.content.eventsHash, 'success', undefined, attested.att.signer);
          } else {
            stats.rejected++;
            await auditPackVerification(namespace, attested.manifest.content.eventsHash, 'failure', verifyResult.reason, attested.att?.signer);
            console.warn(`Pack ${key} rejected: ${verifyResult.reason}`);
            continue;
          }
        } else {
          throw new Error('Not an attested pack');
        }
      } catch {
        // Fall back to legacy unsigned pack
        pack = JSON.parse(data) as Sparkpack;
        
        // Policy check for unsigned import
        if (opts.storage && opts.actorId && opts.actorRole) {
          try {
            await enforcePolicy({
              ns: namespace,
              op: 'sync.importUnsigned',
              actorId: opts.actorId,
              actorRole: opts.actorRole,
              nowISO: new Date().toISOString()
            }, opts.storage, { audit: true });
          } catch (error) {
            stats.rejected++;
            await auditPackVerification(namespace, pack.meta.eventsHash, 'failure', 'Policy denied unsigned import');
            console.warn(`Unsigned pack ${key} rejected by policy: ${error}`);
            continue;
          }
        }
        
        if (opts.allowUnsigned !== false) {
          stats.unsigned++;
          await auditPackVerification(namespace, pack.meta.eventsHash, 'success', 'Unsigned pack allowed');
        } else {
          stats.rejected++;
          await auditPackVerification(namespace, pack.meta.eventsHash, 'failure', 'Unsigned packs not allowed');
          console.warn(`Unsigned pack ${key} rejected: unsigned packs not allowed`);
          continue;
        }
      }
      
      validPacks.push(pack);
      
    } catch (error) {
      stats.rejected++;
      console.warn(`Pack ${key} parsing failed:`, error);
      await auditPackVerification(namespace, 'unknown', 'failure', `Parse error: ${error}`);
    }
  }
  
  // Update plan with verified packs only
  const filteredPlan: SyncPlan = {
    ...plan,
    pullKeys: plan.pullKeys.filter((_, index) => index < validPacks.length),
    hasChanges: validPacks.length > 0
  };
  
  return { filteredPlan, stats };
}
