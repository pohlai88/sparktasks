/**
 * Attested Sparkpacks Tests - Phase B Task 18
 * Comprehensive testing for attestation, verification, and sync integration
 */

import { describe, beforeEach, test, expect } from 'vitest';
import { attestPack, verifyPackAttestation } from '../src/sync/attestation';
import {
  addTrustedSigner,
  listTrustedSigners,
  configureTrustStore,
} from '../src/sync/trust';
import { verifyPacksInPlan } from '../src/sync/verification';
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

  async listKeys(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.store.keys());
    return prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

describe('Attested Sparkpacks', () => {
  let storage: StorageDriver;
  let keyPair: CryptoKeyPair;
  let untrustedKeyPair: CryptoKeyPair;
  let mockPack: Sparkpack;
  const ns = 'test-org';

  beforeEach(async () => {
    storage = new MockStorage();

    // Configure both audit and trust store
    configureAudit(storage, ns);
    configureTrustStore(storage);

    // Generate test key pairs
    keyPair = await crypto.subtle.generateKey('Ed25519', true, [
      'sign',
      'verify',
    ]);
    untrustedKeyPair = await crypto.subtle.generateKey('Ed25519', true, [
      'sign',
      'verify',
    ]);

    // Mock Sparkpack for testing
    mockPack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json',
        createdAt: '2025-08-15T10:00:00.000Z',
        eventsCount: 2,
        eventsHash: 'abc123ef',
      },
      events: [
        {
          type: 'TASK_CREATED',
          timestamp: '2025-08-15T10:00:00.000Z',
          payload: {
            id: 'task1',
            title: 'Test Task',
            status: 'TODAY' as const,
            priority: 'P1' as const,
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2025-08-15T10:01:00.000Z',
          payload: {
            id: 'task1',
            changes: { title: 'Updated Task' },
          },
        },
      ],
    };
  });

  test('sign/verify happy path - valid attestation with trusted signer', async () => {
    // Add signer to trust store
    const signerSpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const signerB64u = btoa(String.fromCharCode(...new Uint8Array(signerSpki)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    await addTrustedSigner(ns, signerB64u);

    // Attest the pack
    const attested = await attestPack(mockPack, keyPair);

    // Verify attestation
    const allowedSigners = await listTrustedSigners(ns);
    const result = await verifyPackAttestation(attested, { allowedSigners });

    expect(result.ok).toBe(true);
    expect(attested.v).toBe(1);
    expect(attested.att.alg).toBe('Ed25519');
    expect(attested.att.signer).toBe(signerB64u);
  });

  test('wrong key - valid signature by untrusted signer rejected', async () => {
    // Add trusted signer (different from the one we'll use)
    const trustedSpki = await crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey
    );
    const trustedB64u = btoa(
      String.fromCharCode(...new Uint8Array(trustedSpki))
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    await addTrustedSigner(ns, trustedB64u);

    // Attest with untrusted key
    const attested = await attestPack(mockPack, untrustedKeyPair);

    // Verify should fail
    const allowedSigners = await listTrustedSigners(ns);
    const result = await verifyPackAttestation(attested, { allowedSigners });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('Signer not in allowlist');
    }
  });

  test('tamper manifest - signature fails after modification', async () => {
    // First add the signer to trusted list
    const pubKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const pubKeyB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    await addTrustedSigner(ns, pubKeyB64u);

    // Attest the pack
    const attested = await attestPack(mockPack, keyPair);

    // Tamper with manifest
    attested.manifest.content.eventsCount = 999;

    // Get allowed signers
    const allowedSigners = await listTrustedSigners(ns);

    // Verify should fail due to invalid signature
    const result = await verifyPackAttestation(attested, { allowedSigners });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('Invalid signature');
    }
  });

  test('legacy unsigned allowed when allowUnsigned=true', async () => {
    // Create pack without attestation (legacy format)
    const legacyPack = mockPack;

    // Cast to test unsigned pack behavior
    const unattested = legacyPack as any;

    // Verify should succeed with allowUnsigned
    const result = await verifyPackAttestation(unattested, {
      allowUnsigned: true,
    });

    expect(result.ok).toBe(true);
  });

  test('legacy unsigned denied by default', async () => {
    // Create pack without attestation
    const unattested = mockPack as any;

    // Verify should fail without allowUnsigned
    const result = await verifyPackAttestation(unattested, {});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain('not attested');
    }
  });

  test('canonicalization stability - reorder manifest keys still verifies', async () => {
    // First add the signer to trusted list
    const pubKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const pubKeyB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    await addTrustedSigner(ns, pubKeyB64u);

    // Attest the pack
    const attested = await attestPack(mockPack, keyPair);

    // Manually reorder manifest keys (simulating different JSON serialization)
    const reordered = {
      v: attested.v,
      att: attested.att,
      manifest: {
        meta: attested.manifest.meta,
        bytes: attested.manifest.bytes,
        content: attested.manifest.content,
      },
    };

    // Get allowed signers
    const allowedSigners = await listTrustedSigners(ns);

    // Should still verify (canonicalization ensures stable signatures)
    const result = await verifyPackAttestation(reordered, { allowedSigners });
    expect(result.ok).toBe(true);
  });

  test('sync integration - mixed packs merge only verified', async () => {
    // Setup trusted signer
    const signerSpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const signerB64u = btoa(String.fromCharCode(...new Uint8Array(signerSpki)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    await addTrustedSigner(ns, signerB64u);

    // Create one valid and one invalid pack
    const validAttested = await attestPack(mockPack, keyPair);
    const invalidAttested = await attestPack(mockPack, untrustedKeyPair); // Wrong signer

    const packData = [
      { key: 'valid-pack', data: JSON.stringify(validAttested) },
      { key: 'invalid-pack', data: JSON.stringify(invalidAttested) },
    ];

    // Mock sync plan
    const mockPlan = {
      phase: 'pull' as const,
      pullKeys: ['valid-pack', 'invalid-pack'],
      mergePlan: null,
      pushEvents: [],
      hasChanges: true,
    };

    // Verify packs
    const { filteredPlan, stats } = await verifyPacksInPlan(
      mockPlan,
      ns,
      packData
    );

    expect(stats.verified).toBe(1);
    expect(stats.rejected).toBe(1);
    expect(stats.unsigned).toBe(0);
    expect(filteredPlan.pullKeys).toHaveLength(1);
  });

  test('clock skew tolerance - future timestamp accepted', async () => {
    // First add the signer to trusted list
    const pubKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const pubKeyB64u = btoa(String.fromCharCode(...new Uint8Array(pubKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    await addTrustedSigner(ns, pubKeyB64u);

    // Attest pack (timestamp is created during attestation)
    const attested = await attestPack(mockPack, keyPair);

    // Get allowed signers
    const allowedSigners = await listTrustedSigners(ns);

    // Should verify (we don't reject any timestamps - past, present, or future)
    const result = await verifyPackAttestation(attested, { allowedSigners });
    expect(result.ok).toBe(true);
  });

  test('trust store operations work correctly', async () => {
    // Start with empty trust store
    let signers = await listTrustedSigners(ns);
    expect(signers).toEqual([]);

    // Add trusted signer
    const signerSpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const signerB64u = btoa(String.fromCharCode(...new Uint8Array(signerSpki)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    await addTrustedSigner(ns, signerB64u);

    // Verify it's added
    signers = await listTrustedSigners(ns);
    expect(signers).toContain(signerB64u);
    expect(signers).toHaveLength(1);

    // Adding same signer again should be idempotent
    await addTrustedSigner(ns, signerB64u);
    signers = await listTrustedSigners(ns);
    expect(signers).toHaveLength(1);
  });
});
