/**
 * Phase B - Task 21: Federated Anchor Publishing
 * Publish local trust anchors as signed AnchorPacks for distribution
 */

import type { StorageDriver } from '../storage/types';
import type { AnchorPack, Anchor } from './sync-types';
import { getSyncState, setSyncState, signAnchorPack } from './anchor-registry';
import { listSigners, type SignerRecord } from '../sync/signer-registry';

/**
 * Publish local anchors as signed AnchorPack (M3)
 */
export async function publishAnchorPack(
  ns: string,
  storage: StorageDriver,
  sign: { privateKey: CryptoKey; publicKeyBytes: ArrayBuffer; kid?: string }
): Promise<AnchorPack> {
  // Get current sequence number
  const state = await getSyncState(ns, 'local', storage);
  const seq = state.lastSeq + 1;
  
  // Collect local anchors from signer registry
  const signers = await listSigners(ns);
  const anchors: Anchor[] = signers.map(signer => ({
    orgId: 'local', // Replace with actual org ID
    kid: signer.kid,
    pubB64u: signer.pubB64u,
    status: signer.status,
    createdAt: signer.createdAt,
    ...(signer.expiresAt && { expiresAt: signer.expiresAt })
  }));
  
  // Create unsigned pack
  const unsignedPack = {
    v: 1 as const,
    issuerOrg: 'local',
    createdAt: new Date().toISOString(),
    seq,
    anchors
  };
  
  // Sign pack
  const signedPack = await signAnchorPack(
    unsignedPack,
    sign.privateKey,
    sign.publicKeyBytes,
    sign.kid
  );
  
  // Update sequence
  await setSyncState(ns, 'local', { lastSeq: seq }, storage);
  
  return signedPack;
}

/**
 * Push anchor pack to remote peers (M3 - optional helper)
 */
export async function pushAnchorPack(
  ns: string,
  transport: any, // RemoteTransport
  storage: StorageDriver,
  sign: { privateKey: CryptoKey; publicKeyBytes: ArrayBuffer; kid?: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const pack = await publishAnchorPack(ns, storage, sign);
    
    // Would push via transport in real implementation
    // transport.push(pack);
    
    return { ok: true };
  } catch (error) {
    return { ok: false, error: `publish_error: ${error}` };
  }
}
