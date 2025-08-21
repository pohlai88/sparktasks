/**
 * Revocation Propagation Sync - Phase B Task 13
 * Headless sync of revocations across devices via E2EE transport
 */

import { toB64u, fromB64u } from '../../crypto/base64url';
import { logger } from '../../lib/logger';
import type { StorageDriver } from '../../storage/types';

import type {
  RevRecord,
  RevType,
  RevTransport,
  RevPlan,
  RevResult,
} from './types';

let storage: StorageDriver;
let namespace: string;
let transport: RevTransport;
let trustedAdmins: string[];

export function configureRevSync(
  storageDriver: StorageDriver,
  ns: string,
  transportImpl: RevTransport,
  admins: string[]
): void {
  storage = storageDriver;
  namespace = ns;
  transport = transportImpl;
  trustedAdmins = admins;
}

// Canonical JSON + ULID-like ID + signature verification
function canon(obj: any): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canon).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `"${k}":${canon(obj[k])}`).join(',') + '}';
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function verifySignature(record: RevRecord): Promise<boolean> {
  try {
    const { issuer, ...recordWithoutSig } = record;
    const { sigB64u, ...issuerWithoutSig } = issuer;
    const canonical = canon({ ...recordWithoutSig, issuer: issuerWithoutSig });

    const pubKey = await crypto.subtle.importKey(
      'spki',
      fromB64u(issuer.pubB64u),
      { name: 'Ed25519' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify(
      'Ed25519',
      pubKey,
      fromB64u(sigB64u),
      new TextEncoder().encode(canonical)
    );
  } catch {
    return false;
  }
}

// Sync state management
async function getSyncState(): Promise<{ since?: string }> {
  try {
    const data = await storage.getItem(`rev:${namespace}:__sync_state__`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

async function setSyncState(state: { since?: string }): Promise<void> {
  await storage.setItem(
    `rev:${namespace}:__sync_state__`,
    JSON.stringify(state)
  );
}

// Apply revocation (placeholder for Task 10 integration)
async function applyRevocation(record: RevRecord): Promise<boolean> {
  try {
    // Integration points with existing revocation registry
    switch (record.type) {
      case 'INVITE_REVOKED': {
        logger.debug(`Revoked invite: ${record.subject}`);
        break;
      }
      case 'SIGNER_REVOKED': {
        logger.debug(`Revoked signer: ${record.subject}`);
        break;
      }
      case 'RECOVERY_REVOKED': {
        logger.debug(`Revoked recovery bundle: ${record.subject}`);
        break;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export async function planRevSync(): Promise<RevPlan> {
  if (!storage || !transport) {
    throw new Error('RevSync not configured. Call configureRevSync() first.');
  }

  const state = await getSyncState();
  const result = await transport.list(namespace, state.since);

  return {
    pullKeys: result.keys,
    ...(result.nextSince && { since: result.nextSince }),
  };
}

export async function runRevSync(plan?: RevPlan): Promise<RevResult> {
  if (!storage || !transport) {
    throw new Error('RevSync not configured. Call configureRevSync() first.');
  }

  const syncPlan = plan || (await planRevSync());
  const result: RevResult = {
    applied: 0,
    pushed: 0,
    errors: [],
    completed: false,
  };

  try {
    // Pull and apply remote records with dedup
    const seenHashes = new Set<string>();

    for (const key of syncPlan.pullKeys) {
      try {
        const data = await transport.get(key);
        if (!data) continue;

        const record: RevRecord = JSON.parse(data);
        const recordHash = canon(record);
        if (seenHashes.has(recordHash)) continue;
        seenHashes.add(recordHash);

        // Clock skew warning (non-fatal)
        const recordTime = new Date(record.ts).getTime();
        if (Math.abs(recordTime - Date.now()) > 5 * 60 * 1000) {
          console.warn(`Clock skew detected: record ${record.id}`);
        }

        // Verify signature and trust
        if (!trustedAdmins.includes(record.issuer.pubB64u)) {
          result.errors.push(`Untrusted issuer: ${record.issuer.pubB64u}`);
          continue;
        }

        if (!(await verifySignature(record))) {
          result.errors.push(`Invalid signature for record: ${record.id}`);
          continue;
        }

        if (await applyRevocation(record)) {
          result.applied++;
        } else {
          result.errors.push(`Failed to apply: ${record.id}`);
        }
      } catch (error) {
        result.errors.push(
          `Error processing ${key}: ${error instanceof Error ? error.message : 'Unknown'}`
        );
      }
    }

    // Push local outbox in batches
    const outboxKeys = await storage.listKeys(`rev:${namespace}:out:`);
    for (let i = 0; i < outboxKeys.length; i += 100) {
      const batch = outboxKeys.slice(i, i + 100);

      for (const outboxKey of batch) {
        try {
          const data = await storage.getItem(outboxKey);
          if (!data) continue;

          const record: RevRecord = JSON.parse(data);
          await transport.put(
            `rev:${namespace}:r:${record.ts}:${record.id}`,
            data,
            record.ts
          );
          await storage.removeItem(outboxKey);
          result.pushed++;
        } catch (error) {
          result.errors.push(
            `Push error ${outboxKey}: ${error instanceof Error ? error.message : 'Unknown'}`
          );
        }
      }
    }

    // Update sync state with monotonicity check
    const currentState = await getSyncState();
    if (
      syncPlan.since &&
      (!currentState.since || syncPlan.since > currentState.since)
    ) {
      await setSyncState({ since: syncPlan.since });
    }

    result.completed = true;
  } catch (error) {
    result.errors.push(
      `Sync failed: ${error instanceof Error ? error.message : 'Unknown'}`
    );
  }

  return result;
}

export async function revokeAndQueue(
  type: RevType,
  subject: string,
  reason?: string
): Promise<RevRecord> {
  if (!storage) {
    throw new Error('RevSync not configured. Call configureRevSync() first.');
  }

  const id = generateId();
  const ts = new Date().toISOString();
  const adminPubB64u = trustedAdmins[0] || 'placeholder-admin-key';

  const recordWithoutSig = {
    v: 1 as const,
    id,
    ts,
    type,
    subject,
    ...(reason && { reason }),
    issuer: { pubB64u: adminPubB64u },
  };

  // Placeholder signature (in practice, use actual admin private key)
  const canonical = canon(recordWithoutSig);
  const sigBytes = new TextEncoder().encode(
    'placeholder-sig-' + canonical.slice(0, 16)
  );
  const sigB64u = toB64u(sigBytes.buffer);

  const record: RevRecord = {
    ...recordWithoutSig,
    issuer: { pubB64u: adminPubB64u, sigB64u },
  };

  // Queue for next sync
  await storage.setItem(`rev:${namespace}:out:${id}`, JSON.stringify(record));
  return record;
}
