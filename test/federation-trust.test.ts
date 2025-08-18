/**
 * Federation Trust Tests - Phase B Task 20
 * Cross-org trust anchor and federated verification testing
 */

import { describe, beforeEach, test, expect } from 'vitest';
import { 
  addTrustAnchor, removeTrustAnchor, revokeTrustAnchor, 
  listTrustAnchors, configureFederationRegistry 
} from '../src/federation/registry';
import { configureFederationPolicy, checkCrossOrgPolicy } from '../src/policy/engine';
import { attestPack, verifyPackAttestation } from '../src/sync/attestation';
import { addSigner, configureSignerRegistry } from '../src/sync/signer-registry';
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

describe('Federation Trust', () => {
  let storage: MockStorage;
  let localKeyPair: CryptoKeyPair;
  let remoteKeyPair: CryptoKeyPair;
  let ns: string;

  // Mock Sparkpack for testing
  const mockPack: Sparkpack = {
    meta: {
      version: 1,
      format: 'sparkpack/1+json',
      createdAt: new Date().toISOString(),
      eventsCount: 1,
      eventsHash: 'abc123'
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
          tags: ['test']
        }
      }
    ]
  };

  beforeEach(async () => {
    storage = new MockStorage();
    ns = 'test-workspace';
    configureFederationRegistry(storage);
    configureSignerRegistry(storage);
    configureAudit(storage, ns);

    // Generate test key pairs
    localKeyPair = await crypto.subtle.generateKey(
      { name: 'Ed25519' },
      true,
      ['sign', 'verify']
    );

    remoteKeyPair = await crypto.subtle.generateKey(
      { name: 'Ed25519' },
      true,
      ['sign', 'verify']
    );
  });

  test('CRUD - add/list/remove anchors', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Add anchor
    await addTrustAnchor(ns, {
      orgId: 'remote-org',
      pubB64u: remotePubB64u,
      note: 'Trusted remote org'
    });

    // List anchors
    const anchors = await listTrustAnchors(ns);
    expect(anchors).toHaveLength(1);
    expect(anchors[0]?.orgId).toBe('remote-org');
    expect(anchors[0]?.status).toBe('ACTIVE');

    // Remove anchor (idempotent)
    await removeTrustAnchor(ns, 'remote-org');
    await removeTrustAnchor(ns, 'remote-org'); // Second call should not error

    const afterRemoval = await listTrustAnchors(ns);
    expect(afterRemoval).toHaveLength(0);
  });

  test('verify - accepts pack signed by remote ACTIVE anchor', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Add remote trust anchor
    await addTrustAnchor(ns, {
      orgId: 'trusted-org',
      pubB64u: remotePubB64u
    });

    // Attest pack with remote key
    const attested = await attestPack(mockPack, remoteKeyPair, { ns });

    // Verify should succeed
    const result = await verifyPackAttestation(attested, { ns });
    expect(result.ok).toBe(true);
  });

  test('verify - denies when remote REVOKED with reason federated_revoked', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Add and attest first
    await addTrustAnchor(ns, {
      orgId: 'untrusted-org',
      pubB64u: remotePubB64u
    });

    const attested = await attestPack(mockPack, remoteKeyPair, { ns });

    // Revoke anchor
    await revokeTrustAnchor(ns, 'untrusted-org');

    // Verify should fail with specific reason
    const result = await verifyPackAttestation(attested, { ns });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('federated_revoked');
    }
  });

  test('dual-sign - allow if either local/remote valid', async () => {
    // Set up local signer
    const localPubKey = await crypto.subtle.exportKey('spki', localKeyPair.publicKey);
    const localPubB64u = btoa(String.fromCharCode(...new Uint8Array(localPubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    await addSigner(ns, {
      kid: 'local-signer',
      pubB64u: localPubB64u,
      status: 'ACTIVE'
    });

    // Set up remote anchor
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    await addTrustAnchor(ns, {
      orgId: 'partner-org',
      pubB64u: remotePubB64u
    });

    // Test local signer attestation
    const localAttested = await attestPack(mockPack, localKeyPair, { ns });
    const localResult = await verifyPackAttestation(localAttested, { ns });
    expect(localResult.ok).toBe(true);

    // Test remote signer attestation
    const remoteAttested = await attestPack(mockPack, remoteKeyPair, { ns });
    const remoteResult = await verifyPackAttestation(remoteAttested, { ns });
    expect(remoteResult.ok).toBe(true);
  });

  test('policy - deny cross-org verify when org not in allowlist', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Add remote anchor
    await addTrustAnchor(ns, {
      orgId: 'blocked-org',
      pubB64u: remotePubB64u
    });

    // Configure policy to block this org
    configureFederationPolicy(ns, {
      allowedOrgs: ['allowed-org-1', 'allowed-org-2'] // blocked-org not included
    });

    // Attest and verify
    const attested = await attestPack(mockPack, remoteKeyPair, { ns });

    const result = await verifyPackAttestation(attested, { 
      ns, 
      operation: 'sync.import' 
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe('org_not_in_allowlist');
    }
  });

  test('policy - allow when in allowlist', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Add remote anchor
    await addTrustAnchor(ns, {
      orgId: 'allowed-org',
      pubB64u: remotePubB64u
    });

    // Configure policy to allow this org
    configureFederationPolicy(ns, {
      allowedOrgs: ['allowed-org']
    });

    // Attest and verify
    const attested = await attestPack(mockPack, remoteKeyPair, { ns });
    const result = await verifyPackAttestation(attested, { 
      ns, 
      operation: 'sync.import' 
    });

    expect(result.ok).toBe(true);
  });

  test('audit events - CRUD & cross-org decisions', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Perform CRUD operations
    await addTrustAnchor(ns, {
      orgId: 'audit-org',
      pubB64u: remotePubB64u
    });

    await revokeTrustAnchor(ns, 'audit-org');
    await removeTrustAnchor(ns, 'audit-org');

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
    expect(eventTypes).toContain('FED_TRUST_ADDED');
    expect(eventTypes).toContain('FED_TRUST_UPDATED');
    expect(eventTypes).toContain('FED_TRUST_REMOVED');
  });

  test('compatibility - no anchors configured = unchanged behavior', async () => {
    // Set up local signer only (no federation)
    const localPubKey = await crypto.subtle.exportKey('spki', localKeyPair.publicKey);
    const localPubB64u = btoa(String.fromCharCode(...new Uint8Array(localPubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    await addSigner(ns, {
      kid: 'local-only',
      pubB64u: localPubB64u
    });

    // Verify local attestation works as before
    const attested = await attestPack(mockPack, localKeyPair, { ns });
    const result = await verifyPackAttestation(attested, { ns });
    expect(result.ok).toBe(true);

    // Verify unknown remote key fails as before (no namespace = no kid)
    const remoteAttested = await attestPack(mockPack, remoteKeyPair);
    const remoteResult = await verifyPackAttestation(remoteAttested, { ns });
    expect(remoteResult.ok).toBe(false);
  });

  test('E2EE - anchors persisted via StorageDriver', async () => {
    const remotePubKey = await crypto.subtle.exportKey('spki', remoteKeyPair.publicKey);
    const remotePubB64u = btoa(String.fromCharCode(...new Uint8Array(remotePubKey)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Add anchor
    await addTrustAnchor(ns, {
      orgId: 'e2ee-test',
      pubB64u: remotePubB64u,
      note: 'E2EE test anchor'
    });

    // Check storage contains anchor data
    const anchorKey = `federation:${ns}:anchors`;
    const stored = await storage.getItem(anchorKey);
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed).toBeInstanceOf(Array);
    expect(parsed[0]?.orgId).toBe('e2ee-test');
  });
});
