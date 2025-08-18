/**
 * Attestation Signer Lifecycle - Phase B Task 19
 * Registry management for signer rotation, expiry & revocation
 */

import { log } from '../audit/api';
import type { StorageDriver } from '../storage/types';

export type SignerStatus = 'ACTIVE' | 'RETIRED' | 'REVOKED';

export interface SignerRecord {
  kid: string;
  pubB64u: string;
  status: SignerStatus;
  createdAt: string;
  expiresAt?: string;
  note?: string;
}

let registryStorage: StorageDriver | null = null;

export function configureSignerRegistry(storage: StorageDriver): void {
  registryStorage = storage;
}

function requireStorage(): StorageDriver {
  if (!registryStorage) throw new Error('Signer registry not configured');
  return registryStorage;
}

export async function addSigner(
  ns: string,
  rec: Omit<SignerRecord, 'status' | 'createdAt'> & { 
    status?: SignerStatus; 
    createdAt?: string; 
  }
): Promise<void> {
  const storage = requireStorage();
  const key = `attest:${ns}:signers:v2`;
  
  const record: SignerRecord = {
    ...rec,
    status: rec.status || 'ACTIVE',
    createdAt: rec.createdAt || new Date().toISOString()
  };
  
  const existing = await storage.getItem(key);
  const signers: SignerRecord[] = existing ? JSON.parse(existing) : [];
  
  // Check for duplicate kid
  if (signers.some(s => s.kid === record.kid)) {
    throw new Error(`Signer ${record.kid} already exists in ${ns}`);
  }
  
  signers.push(record);
  await storage.setItem(key, JSON.stringify(signers));
  
  // If first signer or explicitly ACTIVE, set as active
  if (record.status === 'ACTIVE' || signers.length === 1) {
    await setActiveSigner(ns, record.kid);
  }
  
  await log('SIGNER_ADDED', { ns, kid: record.kid, status: record.status });
}

export async function setActiveSigner(ns: string, kid: string): Promise<void> {
  const storage = requireStorage();
  const signers = await listSigners(ns);
  
  // Find current active and new signer
  const currentActive = signers.find(s => s.status === 'ACTIVE');
  const newSigner = signers.find(s => s.kid === kid);
  
  if (!newSigner) throw new Error(`Signer ${kid} not found in ${ns}`);
  if (newSigner.status === 'REVOKED') throw new Error(`Cannot activate revoked signer ${kid}`);
  
  // Demote current active to retired
  for (const s of signers) {
    if (s.status === 'ACTIVE') s.status = 'RETIRED';
  }
  
  // Activate new signer
  newSigner.status = 'ACTIVE';
  delete newSigner.expiresAt;
  
  const key = `attest:${ns}:signers:v2`;
  await storage.setItem(key, JSON.stringify(signers));
  
  await log('SIGNER_ACTIVATED', { 
    ns, 
    kid, 
    prevActive: currentActive?.kid 
  });
}

export async function retireSigner(ns: string, kid: string, expiresAt?: string): Promise<void> {
  await updateSignerStatus(ns, kid, 'RETIRED', expiresAt);
  await log('SIGNER_RETIRED', { ns, kid, expiresAt });
}

export async function revokeSigner(ns: string, kid: string): Promise<void> {
  const storage = requireStorage();
  const signers = await listSigners(ns);
  const signer = signers.find(s => s.kid === kid);
  
  if (!signer) throw new Error(`Signer ${kid} not found in ${ns}`);
  
  const wasActive = signer.status === 'ACTIVE';
  signer.status = 'REVOKED';
  delete signer.expiresAt;
  
  const key = `attest:${ns}:signers:v2`;
  await storage.setItem(key, JSON.stringify(signers));
  
  await log('SIGNER_REVOKED', { ns, kid, wasActive });
}

export async function listSigners(ns: string): Promise<SignerRecord[]> {
  const storage = requireStorage();
  const key = `attest:${ns}:signers:v2`;
  const data = await storage.getItem(key);
  const signers = data ? JSON.parse(data) : [];
  
  // Deterministic ordering: createdAt asc, then kid asc
  return signers.sort((a: SignerRecord, b: SignerRecord) => {
    const timeCompare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return timeCompare !== 0 ? timeCompare : a.kid.localeCompare(b.kid);
  });
}

async function updateSignerStatus(ns: string, kid: string, status: SignerStatus, expiresAt?: string): Promise<void> {
  const storage = requireStorage();
  const key = `attest:${ns}:signers:v2`;
  
  const signers = await listSigners(ns);
  const index = signers.findIndex(s => s.kid === kid);
  
  if (index === -1) throw new Error(`Signer ${kid} not found in ${ns}`);
  
  signers[index] = { ...signers[index], status, ...(expiresAt && { expiresAt }) };
  await storage.setItem(key, JSON.stringify(signers));
}

export async function rotateSigner(ns: string, newSigner: Omit<SignerRecord, 'status' | 'createdAt'>, opts?: { overlapUntil?: string }): Promise<void> {
  // Get current active signer
  const signers = await listSigners(ns);
  const currentActive = signers.find(s => s.status === 'ACTIVE');
  
  // Add new signer as ACTIVE (will demote old active automatically)
  await addSigner(ns, { ...newSigner, status: 'ACTIVE' });
  
  // Set overlap expiry for old active signer if it exists
  if (currentActive && opts?.overlapUntil) {
    await retireSigner(ns, currentActive.kid, opts.overlapUntil);
  }
}
