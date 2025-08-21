/**
 * Signer Lifecycle Tests - Phase B Task 19
 * Comprehensive testing for rotation, expiry, and revocation
 */

import { describe, beforeEach, test, expect } from 'vitest';
import {
  addSigner,
  setActiveSigner,
  retireSigner,
  revokeSigner,
  listSigners,
  rotateSigner,
  configureSignerRegistry,
} from '../src/sync/signer-registry';
import { attestPack, verifyPackAttestation } from '../src/sync/attestation';
import { configureAudit } from '../src/audit/api';
import type { Sparkpack } from '../src/domain/pack/types';
import type { StorageDriver } from '../src/storage/types';

// Mock storage for testing
class MockStorage implements StorageDriver {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    return Array.from(this.store.keys()).filter(key => key.startsWith(prefix));
  }
}

describe('Signer Lifecycle', () => {
  let storage: MockStorage;
  let keyPair1: CryptoKeyPair;
  let keyPair2: CryptoKeyPair;
  let ns: string;

  // Mock Sparkpack for testing
  const mockPack: Sparkpack = {
    meta: {
      version: 1,
      format: 'sparkpack/1+json',
      createdAt: new Date().toISOString(),
      eventsCount: 1,
      eventsHash: 'abc123',
    },
    events: [
      {
        type: 'TASK_CREATED',
        timestamp: new Date().toISOString(),
        payload: {
          status: 'DONE' as const,
          id: 'test-task',
          priority: 'P1' as const,
          title: 'Test Task',
          tags: ['test'],
        },
      },
    ],
  };

  beforeEach(async () => {
    storage = new MockStorage();
    ns = 'test-workspace';
    configureSignerRegistry(storage);
    configureAudit(storage, ns);

    // Generate test key pairs
    keyPair1 = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
      'sign',
      'verify',
    ]);

    keyPair2 = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
      'sign',
      'verify',
    ]);
  });

  test('happy path - add signer, attest, verify', async () => {
    const pubKey = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add signer
    await addSigner(ns, {
      kid: 'test-signer-1',
      pubB64u,
      note: 'Primary signer',
    });

    // Attest pack
    const attested = await attestPack(mockPack, keyPair1, { ns });
    expect(attested.att).toBeDefined();

    // Verify attestation
    const result = await verifyPackAttestation(attested, { ns });
    expect(result.ok).toBe(true);
  });

  test('rotation sequence - overlapping active periods', async () => {
    const pubKey1 = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u1 = btoa(String.fromCharCode(...new Uint8Array(pubKey1)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const pubKey2 = await crypto.subtle.exportKey('spki', keyPair2.publicKey);
    const pubB64u2 = btoa(String.fromCharCode(...new Uint8Array(pubKey2)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add first signer
    await addSigner(ns, {
      kid: 'signer-v1',
      pubB64u: pubB64u1,
      status: 'ACTIVE',
    });

    // Rotate to new signer
    await rotateSigner(ns, {
      kid: 'signer-v2',
      pubB64u: pubB64u2,
    });

    // Both should be able to attest during overlap
    const attested1 = await attestPack(mockPack, keyPair1, { ns });
    const attested2 = await attestPack(mockPack, keyPair2, { ns });

    const result1 = await verifyPackAttestation(attested1, { ns });
    const result2 = await verifyPackAttestation(attested2, { ns });

    expect(result1.ok).toBe(true);
    expect(result2.ok).toBe(true);
  });

  test('dual attestation - multiple signatures on same pack', async () => {
    const pubKey1 = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u1 = btoa(String.fromCharCode(...new Uint8Array(pubKey1)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const pubKey2 = await crypto.subtle.exportKey('spki', keyPair2.publicKey);
    const pubB64u2 = btoa(String.fromCharCode(...new Uint8Array(pubKey2)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add first signer as ACTIVE
    await addSigner(ns, {
      kid: 'primary',
      pubB64u: pubB64u1,
      status: 'ACTIVE',
    });

    // Rotate to second signer with overlap
    const futureOverlap = new Date(Date.now() + 60 * 1000).toISOString(); // 1 min from now
    await rotateSigner(
      ns,
      { kid: 'secondary', pubB64u: pubB64u2 },
      { overlapUntil: futureOverlap }
    );

    // Create dual attestation with overlap window
    const dualAttested = await attestPack(mockPack, keyPair2, {
      ns,
      dualSignUntil: futureOverlap,
    });

    expect(Array.isArray(dualAttested.att)).toBe(true);
    if (Array.isArray(dualAttested.att)) {
      expect(dualAttested.att).toHaveLength(2);
    }

    // Verify dual attestation
    const result = await verifyPackAttestation(dualAttested, { ns });
    expect(result.ok).toBe(true);
  });

  test('revocation - immediate rejection', async () => {
    const pubKey = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add and attest while active
    await addSigner(ns, { kid: 'compromised', pubB64u });
    const attested = await attestPack(mockPack, keyPair1, { ns });

    // Revoke signer
    await revokeSigner(ns, 'compromised');

    // Should reject verification
    const result = await verifyPackAttestation(attested, { ns });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('revoked');
    }
  });

  test('audit events - track all lifecycle changes', async () => {
    const pubKey = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Lifecycle: add -> retire -> revoke
    await addSigner(ns, { kid: 'audit-test', pubB64u });
    await retireSigner(ns, 'audit-test');
    await revokeSigner(ns, 'audit-test');

    // Check audit trail
    const auditPrefix = `audit:${ns}:e:`;
    const auditKeys = await storage.listKeys(auditPrefix);
    expect(auditKeys.length).toBeGreaterThanOrEqual(3);

    // Parse audit entries and check event types
    const eventTypes = [];
    for (const key of auditKeys) {
      const entryData = await storage.getItem(key);
      if (entryData) {
        const entry = JSON.parse(entryData);
        eventTypes.push(entry.type);
      }
    }
    expect(eventTypes).toContain('SIGNER_ADDED');
    expect(eventTypes).toContain('SIGNER_RETIRED');
    expect(eventTypes).toContain('SIGNER_REVOKED');
  });

  test('legacy pack fallback - missing kid header', async () => {
    // Test pack without kid (legacy format)
    const legacyAttested = {
      v: 1 as const,
      manifest: {
        content: {
          eventsHash: 'legacy-hash',
          eventsCount: 1,
        },
        bytes: 100,
        meta: mockPack.meta,
      },
      att: {
        alg: 'Ed25519' as const,
        signer: 'legacy-signer-key',
        sig: 'legacy-signature',
        ts: new Date().toISOString(),
        // No kid field - this is the legacy case
      },
    };

    const result = await verifyPackAttestation(legacyAttested, { ns });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('Legacy pack without kid');
    }
  });

  test('policy enforcement - reject expired beyond grace', async () => {
    // Add ACTIVE signer first, attest pack, then retire with past expiry
    const pubKey = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add as ACTIVE first
    await addSigner(ns, {
      kid: 'expired-signer',
      pubB64u,
      status: 'ACTIVE',
    });

    // Attest pack while ACTIVE
    const attested = await attestPack(mockPack, keyPair1, { ns });

    // Now retire with past expiry
    const pastExpiry = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1h ago
    await retireSigner(ns, 'expired-signer', pastExpiry);

    // Should fail without grace
    const result1 = await verifyPackAttestation(attested, { ns });
    expect(result1.ok).toBe(false);
    if (!result1.ok) {
      expect(result1.reason).toContain('expired beyond grace');
    }

    // Should succeed with sufficient grace period
    const result2 = await verifyPackAttestation(attested, {
      ns,
      graceSecs: 7200,
    }); // 2h grace
    expect(result2.ok).toBe(true);
  });

  test('list signers - ordering and filtering', async () => {
    const pubKey1 = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u1 = btoa(String.fromCharCode(...new Uint8Array(pubKey1)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const pubKey2 = await crypto.subtle.exportKey('spki', keyPair2.publicKey);
    const pubB64u2 = btoa(String.fromCharCode(...new Uint8Array(pubKey2)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Add signers in sequence
    await addSigner(ns, {
      kid: 'first-signer',
      pubB64u: pubB64u1,
      status: 'ACTIVE',
      note: 'First signer',
    });

    await addSigner(ns, {
      kid: 'second-signer',
      pubB64u: pubB64u2,
      status: 'ACTIVE',
      note: 'Second signer',
    });

    const signers = await listSigners(ns);
    expect(signers).toHaveLength(2);
    expect(signers[0]?.kid).toBe('first-signer');
    expect(signers[1]?.kid).toBe('second-signer');
  });

  test('E2EE compatibility - registry stored via StorageDriver', async () => {
    // Verify registry uses storage (which would be encrypted in real usage)
    const pubKey = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    await addSigner(ns, {
      kid: 'e2ee-test',
      pubB64u,
      note: 'E2EE compatibility test',
    });

    // Check storage contains registry data
    const registryKey = `attest:${ns}:signers:v2`;
    const stored = await storage.getItem(registryKey);
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed).toBeInstanceOf(Array);
    expect(parsed[0].kid).toBe('e2ee-test');
  });

  test('determinism - canonicalization unchanged, signatures stable', async () => {
    const pubKey = await crypto.subtle.exportKey('spki', keyPair1.publicKey);
    const pubB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    await addSigner(ns, {
      kid: 'determinism-test',
      pubB64u,
    });

    // Create two identical attestations
    const attested1 = await attestPack(mockPack, keyPair1, { ns });

    // Wait a moment and create another
    await new Promise(resolve => setTimeout(resolve, 50));
    const attested2 = await attestPack(mockPack, keyPair1, { ns });

    // Signatures should be the same (deterministic over content) but timestamps different
    const att1 = Array.isArray(attested1.att)
      ? attested1.att[0]
      : attested1.att;
    const att2 = Array.isArray(attested2.att)
      ? attested2.att[0]
      : attested2.att;

    expect(att1.sig).toBe(att2.sig); // Same content = same signature
    expect(att1.ts).not.toBe(att2.ts); // Different timestamps

    const result1 = await verifyPackAttestation(attested1, { ns });
    const result2 = await verifyPackAttestation(attested2, { ns });

    expect(result1.ok).toBe(true);
    expect(result2.ok).toBe(true);
  });
});
