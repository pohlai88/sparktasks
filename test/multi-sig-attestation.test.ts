/**
 * Phase B - Task 23: Multi-Sig Attestation Tests
 * Comprehensive test suite for threshold-based multi-signature verification
 */

import { beforeEach, describe, expect, test } from 'vitest';
import { attestPackMulti, verifyPackMulti } from '../src/attestation/multi-sig';
import type {
  ThresholdPolicy,
  PackAttestV2,
} from '../src/attestation/multi-sig-types';
import type { Sparkpack } from '../src/domain/sparkpack/types';
import { addSigner, getSigner } from '../src/signer/registry';
import { StorageAPI } from '../src/storage/api';

describe('Multi-Sig Attestation', () => {
  const ns = 'test-multi-sig-namespace';
  let keyPairs: CryptoKeyPair[] = [];
  let mockPack: Sparkpack;

  beforeEach(async () => {
    // Clear storage
    await StorageAPI.clear(ns);

    // Generate test key pairs
    keyPairs = [];
    for (let i = 0; i < 5; i++) {
      const keyPair = await crypto.subtle.generateKey(
        { name: 'Ed25519' },
        true,
        ['sign', 'verify']
      );
      keyPairs.push(keyPair);
    }

    // Setup mock pack
    mockPack = {
      meta: {
        eventsHash: 'hash-of-events-data',
        eventsCount: 2,
        lastUpdateMs: Date.now(),
        tags: [],
      },
      events: [
        {
          type: 'TASK_CREATED',
          timestamp: '2025-08-15T10:00:00.000Z',
          payload: {
            id: 'task1',
            title: 'Test Task',
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

  describe('Multi-Sig Emission (attestPackMulti)', () => {
    test('happy path - multi-sig emission with 3 signers', async () => {
      // Add signers to registry
      const kids = ['signer1', 'signer2', 'signer3'];
      for (let i = 0; i < 3; i++) {
        const publicKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].publicKey
        );
        const privateKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].privateKey
        );

        await addSigner(ns, {
          kid: kids[i],
          pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        });
      }

      // Emit multi-sig attestation
      const attest = await attestPackMulti(ns, kids, mockPack);

      expect(attest.v).toBe(2);
      expect(attest.sigs).toHaveLength(3);

      // Verify all signatures have kids
      for (const sig of attest.sigs) {
        expect(sig.kid).toBeDefined();
        expect(sig.sigB64u).toBeDefined();
        expect(kids).toContain(sig.kid);
      }
    });

    test('revoked signer - emission fails with revoked key', async () => {
      // Add signers, one revoked
      const kids = ['signer1', 'signer2'];
      const publicKey1 = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      const privateKey1 = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].privateKey
      );

      await addSigner(ns, {
        kid: kids[0],
        pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey1)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey1)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        status: 'REVOKED',
        createdAt: new Date().toISOString(),
      });

      const publicKey2 = await crypto.subtle.exportKey(
        'raw',
        keyPairs[1].publicKey
      );
      const privateKey2 = await crypto.subtle.exportKey(
        'raw',
        keyPairs[1].privateKey
      );

      await addSigner(ns, {
        kid: kids[1],
        pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey2)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey2)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      });

      // Should fail with revoked signer
      await expect(attestPackMulti(ns, kids, mockPack)).rejects.toThrow(
        'Cannot use revoked signer: signer1'
      );
    });

    test('missing signer - emission fails with unknown kid', async () => {
      const kids = ['unknown-signer'];

      await expect(attestPackMulti(ns, kids, mockPack)).rejects.toThrow(
        'Signer not found: unknown-signer'
      );
    });
  });

  describe('Multi-Sig Verification (verifyPackMulti)', () => {
    let attestation: PackAttestV2;
    let kids: string[];

    beforeEach(async () => {
      // Setup 3 signers
      kids = ['signer1', 'signer2', 'signer3'];
      for (let i = 0; i < 3; i++) {
        const publicKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].publicKey
        );
        const privateKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].privateKey
        );

        await addSigner(ns, {
          kid: kids[i],
          pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        });
      }

      // Create attestation
      attestation = await attestPackMulti(ns, kids, mockPack);
    });

    test('threshold satisfied - 2-of-3 passes with 3 signatures', async () => {
      const policy: ThresholdPolicy = { min: 2 };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(3);
      expect(result.reasons).toBeUndefined();
    });

    test('threshold satisfied - 1-of-3 passes with 3 signatures', async () => {
      const policy: ThresholdPolicy = { min: 1 };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(3);
    });

    test('threshold not met - 4-of-3 fails with only 3 signatures', async () => {
      const policy: ThresholdPolicy = { min: 4 };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.count).toBe(3);
      expect(result.reasons).toContain('threshold_not_met:min=4,count=3');
    });

    test('partial signatures - some invalid signers', async () => {
      // Revoke one signer after attestation
      const signer1 = await getSigner(ns, 'signer1');
      await addSigner(ns, { ...signer1!, status: 'REVOKED' });

      const policy: ThresholdPolicy = { min: 2 };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(2); // Only signer2 and signer3 valid
      expect(result.reasons).toContain('revoked_kid:signer1');
    });

    test('banned kids - verification fails with banned signer', async () => {
      const policy: ThresholdPolicy = {
        min: 2,
        bannedKids: ['signer2'],
      };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.reasons).toContain('banned_kid:signer2');
    });

    test('required kids - verification succeeds with all required present', async () => {
      const policy: ThresholdPolicy = {
        min: 2,
        requireKids: ['signer1', 'signer3'],
      };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(3);
    });

    test('required kids missing - verification fails without required signer', async () => {
      const policy: ThresholdPolicy = {
        min: 2,
        requireKids: ['signer1', 'signer4'], // signer4 doesn't exist
      };

      const result = await verifyPackMulti(mockPack, attestation, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.reasons).toContain('require_kid_missing:signer4');
    });

    test('signature tampering - verification fails with modified signature', async () => {
      // Tamper with one signature
      const tamperedAttest = {
        ...attestation,
        sigs: attestation.sigs.map((sig, i) =>
          i === 0 ? { ...sig, sigB64u: 'invalid-signature' } : sig
        ),
      };

      const policy: ThresholdPolicy = { min: 2 };

      const result = await verifyPackMulti(
        mockPack,
        tamperedAttest,
        ns,
        policy
      );

      expect(result.ok).toBe(true); // Still passes with 2 valid out of 3
      expect(result.count).toBe(2);
      expect(result.reasons).toContain('sig_verify_failed:signer1');
    });

    test('all signatures invalid - verification fails completely', async () => {
      // Tamper with all signatures
      const tamperedAttest: PackAttestV2 = {
        v: 2,
        sigs: attestation.sigs.map(sig => ({ ...sig, sigB64u: 'invalid' })),
      };

      const policy: ThresholdPolicy = { min: 1 };

      const result = await verifyPackMulti(
        mockPack,
        tamperedAttest,
        ns,
        policy
      );

      expect(result.ok).toBe(false);
      expect(result.count).toBe(0);
      expect(result.reasons).toEqual([
        'sig_verify_failed:signer1',
        'sig_verify_failed:signer2',
        'sig_verify_failed:signer3',
      ]);
    });
  });

  describe('Legacy V1 Compatibility', () => {
    test('v1 attestation - passes with min=1 policy', async () => {
      // Setup signer for v1
      const publicKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      await addSigner(ns, {
        kid: 'legacy-signer',
        pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        privB64u: 'not-needed-for-verification',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      });

      // Create v1-style attestation
      const v1Attest = {
        v: 1 as const,
        manifest: {
          content: {
            eventsHash: mockPack.meta.eventsHash,
            eventsCount: mockPack.meta.eventsCount,
          },
          bytes: JSON.stringify(mockPack).length,
          meta: mockPack.meta,
        },
        att: {
          alg: 'Ed25519' as const,
          signer: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          sig: 'dummy-signature',
          ts: new Date().toISOString(),
          kid: 'legacy-signer',
        },
      };

      const policy: ThresholdPolicy = { min: 1 };

      // Should handle v1 gracefully
      const result = await verifyPackMulti(mockPack, v1Attest, ns, policy);

      expect(result.count).toBe(0); // Will fail sig verification with dummy sig
      expect(result.ok).toBe(false);
    });

    test('v1 incompatible - fails with min>1 threshold', async () => {
      const v1Attest = {
        v: 1 as const,
        manifest: {
          content: {
            eventsHash: mockPack.meta.eventsHash,
            eventsCount: mockPack.meta.eventsCount,
          },
          bytes: JSON.stringify(mockPack).length,
          meta: mockPack.meta,
        },
        att: {
          alg: 'Ed25519' as const,
          signer: 'dummy-signer',
          sig: 'dummy-signature',
          ts: new Date().toISOString(),
        },
      };

      const policy: ThresholdPolicy = { min: 2 };

      const result = await verifyPackMulti(mockPack, v1Attest, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.count).toBe(0);
      expect(result.reasons).toContain('v1_incompatible_with_threshold:min=2');
    });
  });

  describe('Legacy Public Key Path', () => {
    test('legacy pubB64u - allowed with policy flag', async () => {
      const publicKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      const pubB64u = btoa(String.fromCharCode(...new Uint8Array(publicKey)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      // Create attestation with pubB64u instead of kid
      const legacyAttest: PackAttestV2 = {
        v: 2,
        sigs: [
          {
            pubB64u,
            sigB64u: 'dummy-signature',
          },
        ],
      };

      const policy: ThresholdPolicy = {
        min: 1,
        allowLegacy: true,
      };

      const result = await verifyPackMulti(mockPack, legacyAttest, ns, policy);

      // Will fail signature verification but policy allows legacy
      expect(result.ok).toBe(false);
      expect(result.reasons).toContain(
        'sig_verify_failed:legacy:' + pubB64u.slice(0, 16)
      );
    });

    test('legacy pubB64u - denied without policy flag', async () => {
      const publicKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      const pubB64u = btoa(String.fromCharCode(...new Uint8Array(publicKey)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const legacyAttest: PackAttestV2 = {
        v: 2,
        sigs: [
          {
            pubB64u,
            sigB64u: 'dummy-signature',
          },
        ],
      };

      const policy: ThresholdPolicy = { min: 1 };

      const result = await verifyPackMulti(mockPack, legacyAttest, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.reasons).toContain(
        'legacy_not_allowed:' + pubB64u.slice(0, 8) + '...'
      );
    });
  });

  describe('Retired Signers Grace Period', () => {
    test('retired within grace - verification succeeds', async () => {
      // Setup retired signer within grace period
      const publicKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      const privateKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].privateKey
      );

      const retiredAt = new Date(Date.now() - 5000).toISOString(); // 5 seconds ago
      await addSigner(ns, {
        kid: 'retired-signer',
        pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        status: 'RETIRED',
        createdAt: new Date().toISOString(),
        retiredAt,
      });

      // Create attestation
      const attest = await attestPackMulti(ns, ['retired-signer'], mockPack);

      const policy: ThresholdPolicy = {
        min: 1,
        retiredGraceMs: 10000, // 10 seconds grace
      };

      const result = await verifyPackMulti(mockPack, attest, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(1);
    });

    test('retired beyond grace - verification fails', async () => {
      // Setup retired signer beyond grace period
      const publicKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      const privateKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].privateKey
      );

      const retiredAt = new Date(Date.now() - 15000).toISOString(); // 15 seconds ago
      await addSigner(ns, {
        kid: 'old-retired-signer',
        pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        status: 'RETIRED',
        createdAt: new Date().toISOString(),
        retiredAt,
      });

      // Create attestation
      const attest = await attestPackMulti(
        ns,
        ['old-retired-signer'],
        mockPack
      );

      const policy: ThresholdPolicy = {
        min: 1,
        retiredGraceMs: 10000, // 10 seconds grace
      };

      const result = await verifyPackMulti(mockPack, attest, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.count).toBe(0);
      expect(result.reasons).toContain(
        'retired_out_of_grace:old-retired-signer'
      );
    });
  });

  describe('Deduplication and Edge Cases', () => {
    test('duplicate kids - only counts once', async () => {
      // Setup signer
      const publicKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].publicKey
      );
      const privateKey = await crypto.subtle.exportKey(
        'raw',
        keyPairs[0].privateKey
      );

      await addSigner(ns, {
        kid: 'dup-signer',
        pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, ''),
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      });

      // Create attestation with duplicate signatures
      const attest = await attestPackMulti(ns, ['dup-signer'], mockPack);
      const dupAttest: PackAttestV2 = {
        v: 2,
        sigs: [
          ...attest.sigs,
          ...attest.sigs, // Duplicate all signatures
        ],
      };

      const policy: ThresholdPolicy = { min: 1 };

      const result = await verifyPackMulti(mockPack, dupAttest, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(1); // Should only count once despite duplicates
    });

    test('missing kid and pubB64u - signature ignored', async () => {
      const invalidAttest: PackAttestV2 = {
        v: 2,
        sigs: [
          {
            sigB64u: 'some-signature',
            // Missing both kid and pubB64u
          },
        ],
      };

      const policy: ThresholdPolicy = { min: 1 };

      const result = await verifyPackMulti(mockPack, invalidAttest, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.count).toBe(0);
      expect(result.reasons).toContain('missing_kid_and_pub');
    });

    test('key import failure - graceful handling', async () => {
      const invalidAttest: PackAttestV2 = {
        v: 2,
        sigs: [
          {
            pubB64u: 'invalid-key-data',
            sigB64u: 'some-signature',
          },
        ],
      };

      const policy: ThresholdPolicy = {
        min: 1,
        allowLegacy: true,
      };

      const result = await verifyPackMulti(mockPack, invalidAttest, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.count).toBe(0);
      expect(result.reasons).toContain('legacy_key_import_failed:invalid-k...');
    });
  });

  describe('Real-World Scenarios', () => {
    test('corporate multi-sig - 3-of-5 executives approve', async () => {
      // Setup 5 executive signers
      const execs = ['ceo', 'cto', 'cfo', 'coo', 'chro'];
      for (let i = 0; i < 5; i++) {
        const publicKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].publicKey
        );
        const privateKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].privateKey
        );

        await addSigner(ns, {
          kid: execs[i],
          pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        });
      }

      // Only 3 executives sign (ceo, cto, cfo)
      const attest = await attestPackMulti(ns, ['ceo', 'cto', 'cfo'], mockPack);

      const policy: ThresholdPolicy = {
        min: 3,
        requireKids: ['ceo'], // CEO must always sign
      };

      const result = await verifyPackMulti(mockPack, attest, ns, policy);

      expect(result.ok).toBe(true);
      expect(result.count).toBe(3);
    });

    test('security incident - blacklist compromised keys', async () => {
      // Setup signers
      const signers = ['alice', 'bob', 'charlie'];
      for (let i = 0; i < 3; i++) {
        const publicKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].publicKey
        );
        const privateKey = await crypto.subtle.exportKey(
          'raw',
          keyPairs[i].privateKey
        );

        await addSigner(ns, {
          kid: signers[i],
          pubB64u: btoa(String.fromCharCode(...new Uint8Array(publicKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          privB64u: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        });
      }

      const attest = await attestPackMulti(ns, signers, mockPack);

      // Charlie's key was compromised
      const policy: ThresholdPolicy = {
        min: 2,
        bannedKids: ['charlie'],
      };

      const result = await verifyPackMulti(mockPack, attest, ns, policy);

      expect(result.ok).toBe(false);
      expect(result.reasons).toContain('banned_kid:charlie');
    });
  });
});
