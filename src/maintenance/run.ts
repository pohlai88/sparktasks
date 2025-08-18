/**
 * Maintenance runner - executes maintenance plans
 */

import { MaintenancePlan, MaintenanceReport } from './types';
import { StorageDriver } from '../storage/types';
import { EncryptedDriver } from '../storage/encrypted';
import { KeyringProvider } from '../crypto/keyring';
import { compactWithSnapshot } from '../domain/task/eventlog';
import { Envelope } from '../crypto/types';
import { toB64u } from '../crypto/base64url';

export interface MaintenanceDeps {
  storage: StorageDriver;
  encrypted?: EncryptedDriver;
  keyring?: KeyringProvider;
  resumeToken?: string;
}

/**
 * Execute a maintenance plan and return report
 */
export async function runMaintenance(
  plan: MaintenancePlan,
  deps: MaintenanceDeps
): Promise<MaintenanceReport> {
  const report: MaintenanceReport = {};

  for (const action of plan.actions) {
    switch (action.type) {
      case 'COMPACT': {
        const result = executeCompact(action.threshold);
        if (result) report.compact = result;
        break;
      }
      case 'REKEY': {
        const result = await executeRekey(action.prefix, action.batchSize, deps);
        if (result) report.rekey = result;
        break;
      }
      case 'SWEEP': {
        const result = await executeSweep(action.prefix, action.fix, action.sample, deps);
        if (result) report.sweep = result;
        break;
      }
    }
  }

  return report;
}

/**
 * Execute compaction with snapshot
 */
function executeCompact(threshold: number): MaintenanceReport['compact'] {
  const result = compactWithSnapshot(threshold);
  return {
    trimmed: result.trimmed,
    tookSnapshot: result.tookSnapshot
  };
}

/**
 * Execute rekeying operation
 */
async function executeRekey(
  prefix: string,
  batchSize: number,
  deps: MaintenanceDeps
): Promise<MaintenanceReport['rekey']> {
  if (!deps.encrypted || !deps.keyring) {
    return { processed: 0, rewrapped: 0, failures: 0 };
  }

  const { storage, encrypted, keyring } = deps;
  
  // Guardrail: Check if keyring is accessible
  try {
    await keyring.getActiveKey();
  } catch (error) {
    console.warn('REKEY operation skipped: keyring is locked or inaccessible');
    return { processed: 0, rewrapped: 0, failures: 0 };
  }
  
  const { kid: activeKid } = await keyring.getActiveKey();
  
  let processed = 0;
  let rewrapped = 0;
  let failures = 0;

  try {
    let keys = await storage.listKeys(prefix);
    
    // Resume from token if provided
    const resumeKey = deps.resumeToken;
    if (resumeKey) {
      const resumeIndex = keys.indexOf(resumeKey);
      if (resumeIndex > 0) {
        keys = keys.slice(resumeIndex);
        console.log(`Resuming REKEY from key: ${resumeKey} (${keys.length} remaining)`);
      }
    }
    
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      
      for (const key of batch) {
        try {
          processed++;
          const rawValue = await storage.getItem(key);
          if (!rawValue) continue;

          // Try to parse as envelope
          let envelope: Envelope;
          try {
            envelope = JSON.parse(rawValue);
          } catch {
            // Not JSON, skip plaintext
            continue;
          }

          // Check if it's a valid envelope
          if (!envelope.v || !envelope.alg || !envelope.kid) {
            continue;
          }

          // Skip if already using active key
          if (envelope.kid === activeKid) {
            continue;
          }

          // Decrypt and re-encrypt with active key (preserving timestamp and AAD)
          const value = await encrypted.getItem(key);
          if (value !== null) {
            await encrypted.setItem(key, value);
            rewrapped++;
          }
        } catch (error) {
          failures++;
          // Continue processing other keys
        }
      }
    }
  } catch (error) {
    failures++;
  }

  return { processed, rewrapped, failures };
}

/**
 * Execute integrity sweep
 */
async function executeSweep(
  prefix: string,
  fix: boolean,
  sample: number | undefined,
  deps: MaintenanceDeps
): Promise<MaintenanceReport['sweep']> {
  if (!deps.encrypted || !deps.keyring) {
    return { scanned: 0, ok: 0, repaired: 0, failed: [] };
  }

  const { storage, encrypted, keyring } = deps;
  const { kid: activeKid } = await keyring.getActiveKey();
  
  let scanned = 0;
  let ok = 0;
  let repaired = 0;
  const failed: Array<{ key: string; reason: string }> = [];

  try {
    let keys = await storage.listKeys(prefix);
    
    // Apply sample limit for performance on large stores
    if (sample && sample > 0 && keys.length > sample) {
      // Take random sample to get representative data
      const shuffled = keys.sort(() => 0.5 - Math.random());
      keys = shuffled.slice(0, sample);
    }
    // Apply sampling if specified
    if (sample !== undefined && keys.length > sample) {
      keys = keys.slice(0, sample);
    }

    for (const key of keys) {
      try {
        scanned++;
        const rawValue = await storage.getItem(key);
        if (!rawValue) {
          failed.push({ key, reason: 'Key not found' });
          continue;
        }

        // Try to parse as envelope
        let envelope: Envelope;
        try {
          envelope = JSON.parse(rawValue);
        } catch {
          // Not JSON, assume plaintext is OK
          ok++;
          continue;
        }

        // Check if it's a valid envelope
        if (!envelope.v || !envelope.alg || !envelope.kid) {
          // Not an envelope, assume plaintext is OK
          ok++;
          continue;
        }

        // Extract namespace from encrypted driver
        const expectedAad = `${getNamespaceFromEncrypted(encrypted)}:${key}`;
        const aadBytes = new TextEncoder().encode(expectedAad);
        const expectedAadB64u = toB64u(aadBytes.buffer);

        // Check AAD
        if (envelope.aad && envelope.aad !== expectedAadB64u) {
          failed.push({ key, reason: 'AAD mismatch' });
          continue;
        }

        // Try to decrypt and verify integrity
        try {
          const decrypted = await encrypted.getItem(key);
          if (decrypted === null) {
            failed.push({ key, reason: 'Decryption failed' });
            continue;
          }

          // If fix=true and using old key, re-encrypt with active key
          if (fix && envelope.kid !== activeKid) {
            await encrypted.setItem(key, decrypted);
            repaired++;
          } else {
            ok++;
          }
        } catch (error) {
          failed.push({ key, reason: `Decryption error: ${error instanceof Error ? error.message : 'Unknown'}` });
        }
      } catch (error) {
        failed.push({ key, reason: `Processing error: ${error instanceof Error ? error.message : 'Unknown'}` });
      }
    }
  } catch (error) {
    failed.push({ key: 'LIST_KEYS', reason: `Failed to list keys: ${error instanceof Error ? error.message : 'Unknown'}` });
  }

  return { scanned, ok, repaired, failed };
}

/**
 * Extract namespace from EncryptedDriver instance
 */
function getNamespaceFromEncrypted(encrypted: EncryptedDriver): string {
  // Access the private ns field via type assertion
  return (encrypted as any).ns || 'unknown';
}
