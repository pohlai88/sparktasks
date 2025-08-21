/**
 * Phase B - Task 24: Transparency Log Tests
 * Comprehensive test suite for Merkle accumulator, checkpoints and proofs
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StorageDriver } from '../src/storage/types';
import {
  appendLeaf,
  genProof,
  verifyProof,
  emitCheckpoint,
  verifyCheckpoint,
} from '../src/transparency/api';
import { TLStateV1, TLCheckpointV1 } from '../src/transparency/types';

// Mock storage driver
class MockStorage implements StorageDriver {
  private data = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    return Array.from(this.data.keys()).filter(k => k.startsWith(prefix));
  }

  clear() {
    this.data.clear();
  }
}

describe('Transparency Log - Phase B Task 24', () => {
  let storage: MockStorage;
  const ns = 'test:org';

  beforeEach(() => {
    storage = new MockStorage();
  });

  describe('1. Append & Root Computation', () => {
    it('should append leaves and maintain consistent root', async () => {
      // Append 3 leaves
      const leaf1 = new TextEncoder().encode('leaf1');
      const leaf2 = new TextEncoder().encode('leaf2');
      const leaf3 = new TextEncoder().encode('leaf3');

      const result1 = await appendLeaf(ns, leaf1, storage);
      expect(result1.index).toBe(0);
      expect(result1.n).toBe(1);

      const result2 = await appendLeaf(ns, leaf2, storage);
      expect(result2.index).toBe(1);
      expect(result2.n).toBe(2);

      const result3 = await appendLeaf(ns, leaf3, storage);
      expect(result3.index).toBe(2);
      expect(result3.n).toBe(3);

      // Verify state consistency
      const stateData = await storage.getItem(`tl:${ns}:state`);
      expect(stateData).toBeTruthy();

      const state: TLStateV1 = JSON.parse(stateData!);
      expect(state.v).toBe(1);
      expect(state.n).toBe(3);
      expect(state.frontier.length).toBeGreaterThan(0);
    });

    it('should handle single leaf correctly', async () => {
      const leaf = new TextEncoder().encode('single');
      const result = await appendLeaf(ns, leaf, storage);

      expect(result.index).toBe(0);
      expect(result.n).toBe(1);
      expect(result.rootB64u).toBeTruthy();
    });
  });

  describe('2. Inclusion Proofs', () => {
    it('should generate and verify valid proofs', async () => {
      // Setup: append 4 leaves for good tree structure
      const leaves = [
        new TextEncoder().encode('leaf0'),
        new TextEncoder().encode('leaf1'),
        new TextEncoder().encode('leaf2'),
        new TextEncoder().encode('leaf3'),
      ];

      let finalRoot = '';
      for (const leaf of leaves) {
        const result = await appendLeaf(ns, leaf, storage);
        finalRoot = result.rootB64u;
      }

      // Generate and verify proof for each leaf
      for (let i = 0; i < leaves.length; i++) {
        const proof = await genProof(ns, i, storage);
        expect(proof.v).toBe(1);
        expect(proof.ns).toBe(ns);
        expect(proof.index).toBe(i);
        expect(proof.leafHashB64u).toBeTruthy();

        const verification = await verifyProof(proof, finalRoot);
        expect(verification.ok).toBe(true);
      }
    });

    it('should reject tampered proofs', async () => {
      const leaf = new TextEncoder().encode('testleaf');
      const result = await appendLeaf(ns, leaf, storage);

      const proof = await genProof(ns, 0, storage);

      // Tamper with proof siblings
      if (proof.siblings.length > 0) {
        proof.siblings[0] = 'tampered-hash';
        const verification = await verifyProof(proof, result.rootB64u);
        expect(verification.ok).toBe(false);
        expect(verification.reason).toBe('hash_mismatch');
      }
    });

    it('should throw on invalid index', async () => {
      await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);

      await expect(genProof(ns, 1, storage)).rejects.toThrow(
        'index_out_of_range'
      );
      await expect(genProof(ns, -1, storage)).rejects.toThrow(
        'index_out_of_range'
      );
    });
  });

  describe('3. Checkpoint Operations', () => {
    it('should emit valid checkpoint with ACTIVE signer', async () => {
      // Setup log with some leaves
      await appendLeaf(ns, new TextEncoder().encode('leaf1'), storage);
      await appendLeaf(ns, new TextEncoder().encode('leaf2'), storage);

      const checkpoint = await emitCheckpoint(ns, storage, {
        kid: 'active-signer',
      });

      expect(checkpoint.v).toBe(1);
      expect(checkpoint.ns).toBe(ns);
      expect(checkpoint.n).toBe(2);
      expect(checkpoint.rootB64u).toBeTruthy();
      expect(checkpoint.signerKid).toBe('active-signer');
      expect(checkpoint.sigB64u).toBeTruthy();
      expect(checkpoint.at).toBeTruthy();
    });

    it('should verify valid checkpoint', async () => {
      await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);

      const checkpoint = await emitCheckpoint(ns, storage, {
        kid: 'active-signer',
      });
      const verification = await verifyCheckpoint(ns, checkpoint);

      expect(verification.ok).toBe(true);
    });

    it('should reject REVOKED signer checkpoint', async () => {
      await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);

      const checkpoint = await emitCheckpoint(ns, storage, {
        kid: 'revoked-signer',
      });
      const verification = await verifyCheckpoint(ns, checkpoint);

      expect(verification.ok).toBe(false);
      expect(verification.reason).toContain('signer_revoked');
    });

    it('should handle RETIRED signer with grace period', async () => {
      await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);

      const checkpoint = await emitCheckpoint(ns, storage, {
        kid: 'retired-signer',
      });

      // Within grace period
      const verification1 = await verifyCheckpoint(ns, checkpoint, {
        retiredGraceMs: 24 * 60 * 60 * 1000,
      });
      expect(verification1.ok).toBe(true);

      // Beyond grace period
      const verification2 = await verifyCheckpoint(ns, checkpoint, {
        retiredGraceMs: 0,
      });
      expect(verification2.ok).toBe(false);
      expect(verification2.reason).toContain('signer_expired');
    });

    it('should reject checkpoint for empty log', async () => {
      await expect(emitCheckpoint(ns, storage)).rejects.toThrow(
        'invalid_state'
      );
    });
  });

  describe('4. Persistence & State Management', () => {
    it('should maintain state across operations', async () => {
      // Append initial leaves
      await appendLeaf(ns, new TextEncoder().encode('leaf1'), storage);
      await appendLeaf(ns, new TextEncoder().encode('leaf2'), storage);

      // Check state
      const state1Data = await storage.getItem(`tl:${ns}:state`);
      const state1 = JSON.parse(state1Data!) as TLStateV1;
      expect(state1.n).toBe(2);

      // Append more leaves
      const result3 = await appendLeaf(
        ns,
        new TextEncoder().encode('leaf3'),
        storage
      );
      expect(result3.n).toBe(3);

      // Verify continuity
      const state2Data = await storage.getItem(`tl:${ns}:state`);
      const state2 = JSON.parse(state2Data!) as TLStateV1;
      expect(state2.n).toBe(3);
    });

    it('should store leaf hashes for diagnostics', async () => {
      const result = await appendLeaf(
        ns,
        new TextEncoder().encode('test'),
        storage
      );

      const leafHash = await storage.getItem(`tl:${ns}:leaf:${result.index}`);
      expect(leafHash).toBe(result.leafHashB64u);
    });

    it('should store checkpoints by leaf count', async () => {
      await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);

      const checkpoint = await emitCheckpoint(ns, storage);
      const storedChk = await storage.getItem(`tl:${ns}:chk:${checkpoint.n}`);

      expect(storedChk).toBeTruthy();
      const parsed: TLCheckpointV1 = JSON.parse(storedChk!);
      expect(parsed.n).toBe(checkpoint.n);
      expect(parsed.rootB64u).toBe(checkpoint.rootB64u);
    });
  });

  describe('5. Determinism', () => {
    it('should produce identical roots for same leaf sequence', async () => {
      const leaves = ['a', 'b', 'c'].map(s => new TextEncoder().encode(s));

      // First log
      const storage1 = new MockStorage();
      const ns1 = 'test1';
      let root1 = '';
      for (const leaf of leaves) {
        const result = await appendLeaf(ns1, leaf, storage1);
        root1 = result.rootB64u;
      }

      // Second log with same sequence
      const storage2 = new MockStorage();
      const ns2 = 'test2';
      let root2 = '';
      for (const leaf of leaves) {
        const result = await appendLeaf(ns2, leaf, storage2);
        root2 = result.rootB64u;
      }

      expect(root1).toBe(root2);
    });
  });

  describe('6. Edge Cases', () => {
    it('should handle power-of-2 leaf counts', async () => {
      // Test 2^n leaf counts which affect tree structure
      const counts = [1, 2, 4, 8];

      for (const count of counts) {
        const testStorage = new MockStorage();
        const testNs = `test-${count}`;

        let finalResult;
        for (let i = 0; i < count; i++) {
          const leaf = new TextEncoder().encode(`leaf-${i}`);
          finalResult = await appendLeaf(testNs, leaf, testStorage);
        }

        expect(finalResult!.n).toBe(count);
        expect(finalResult!.rootB64u).toBeTruthy();

        // Verify proofs for all leaves
        for (let i = 0; i < count; i++) {
          const proof = await genProof(testNs, i, testStorage);
          const verification = await verifyProof(proof, finalResult!.rootB64u);
          expect(verification.ok).toBe(true);
        }
      }
    });

    it('should handle odd leaf counts', async () => {
      const counts = [3, 5, 7];

      for (const count of counts) {
        const testStorage = new MockStorage();
        const testNs = `test-odd-${count}`;

        let finalResult;
        for (let i = 0; i < count; i++) {
          const leaf = new TextEncoder().encode(`leaf-${i}`);
          finalResult = await appendLeaf(testNs, leaf, testStorage);
        }

        expect(finalResult!.n).toBe(count);

        // Verify all proofs work with odd counts
        for (let i = 0; i < count; i++) {
          const proof = await genProof(testNs, i, testStorage);
          const verification = await verifyProof(proof, finalResult!.rootB64u);
          expect(verification.ok).toBe(true);
        }
      }
    });

    it('should handle unknown signer in verification', async () => {
      await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);

      const checkpoint = await emitCheckpoint(ns, storage, {
        kid: 'unknown-signer',
      });
      const verification = await verifyCheckpoint(ns, checkpoint);

      expect(verification.ok).toBe(false);
      expect(verification.reason).toContain('unknown_signer');
    });
  });

  describe('7. Integration with Encrypted Storage', () => {
    it('should work with encrypted values (keys remain plaintext)', async () => {
      // Simulate encrypted storage where values are encrypted but keys are not
      class EncryptedMockStorage extends MockStorage {
        private encrypt(value: string): string {
          // Simple mock encryption
          return 'encrypted:' + btoa(value);
        }

        private decrypt(value: string): string {
          if (value.startsWith('encrypted:')) {
            return atob(value.substring(10));
          }
          return value;
        }

        async setItem(key: string, value: string): Promise<void> {
          await super.setItem(key, this.encrypt(value));
        }

        async getItem(key: string): Promise<string | null> {
          const encrypted = await super.getItem(key);
          return encrypted ? this.decrypt(encrypted) : null;
        }
      }

      const encryptedStorage = new EncryptedMockStorage();

      // Operations should work normally
      const result = await appendLeaf(
        ns,
        new TextEncoder().encode('encrypted-test'),
        encryptedStorage
      );
      expect(result.index).toBe(0);

      const proof = await genProof(ns, 0, encryptedStorage);
      const verification = await verifyProof(proof, result.rootB64u);
      expect(verification.ok).toBe(true);
    });
  });
});
