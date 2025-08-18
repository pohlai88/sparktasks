/**
 * Phase B - Task 24: Compact Transparency Log Tests
 * ≥10 tests covering all DoD requirements
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StorageDriver } from '../src/storage/types';
import { appendLeaf, genProof, verifyProof, emitCheckpoint, verifyCheckpoint } from '../src/transparency/compact-api';

class MockStorage implements StorageDriver {
  private data = new Map<string, string>();
  async getItem(key: string): Promise<string | null> { return this.data.get(key) || null; }
  async setItem(key: string, value: string): Promise<void> { this.data.set(key, value); }
  async removeItem(key: string): Promise<void> { this.data.delete(key); }
  async listKeys(prefix: string): Promise<string[]> { return Array.from(this.data.keys()).filter(k => k.startsWith(prefix)); }
  clear() { this.data.clear(); }
}

describe('Transparency Log - Phase B Task 24 (Compact)', () => {
  let storage: MockStorage;
  const ns = 'test:org';

  beforeEach(() => { storage = new MockStorage(); });

  it('1. should append leaves and maintain consistent root', async () => {
    const leaf1 = new TextEncoder().encode('leaf1');
    const leaf2 = new TextEncoder().encode('leaf2');
    const leaf3 = new TextEncoder().encode('leaf3');

    const result1 = await appendLeaf(ns, leaf1, storage);
    expect(result1.index).toBe(0); expect(result1.n).toBe(1);

    const result2 = await appendLeaf(ns, leaf2, storage);
    expect(result2.index).toBe(1); expect(result2.n).toBe(2);

    const result3 = await appendLeaf(ns, leaf3, storage);
    expect(result3.index).toBe(2); expect(result3.n).toBe(3);

    const stateData = await storage.getItem(`tl:${ns}:state`);
    expect(stateData).toBeTruthy();
    const state = JSON.parse(stateData!);
    expect(state.n).toBe(3);
  });

  it('2. should generate and verify inclusion proofs', async () => {
    const leaves = ['leaf0', 'leaf1', 'leaf2'].map(s => new TextEncoder().encode(s));
    let finalRoot = '';
    for (const leaf of leaves) {
      const result = await appendLeaf(ns, leaf, storage);
      finalRoot = result.rootB64u;
    }

    for (let i = 0; i < leaves.length; i++) {
      const proof = await genProof(ns, i, storage);
      expect(proof.index).toBe(i);
      expect(proof.leafHashB64u).toBeTruthy();

      const verification = await verifyProof(proof, finalRoot);
      expect(verification.ok).toBe(true);
    }
  });

  it('3. should emit valid checkpoint with ACTIVE signer', async () => {
    await appendLeaf(ns, new TextEncoder().encode('leaf1'), storage);
    await appendLeaf(ns, new TextEncoder().encode('leaf2'), storage);

    const checkpoint = await emitCheckpoint(ns, storage, { kid: 'active-signer' });
    expect(checkpoint.v).toBe(1);
    expect(checkpoint.ns).toBe(ns);
    expect(checkpoint.n).toBe(2);
    expect(checkpoint.rootB64u).toBeTruthy();
    expect(checkpoint.signerKid).toBe('active-signer');
    expect(checkpoint.sigB64u).toBeTruthy();
  });

  it('4. should verify valid checkpoint', async () => {
    await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);
    const checkpoint = await emitCheckpoint(ns, storage, { kid: 'active-signer' });
    const verification = await verifyCheckpoint(ns, checkpoint);
    expect(verification.ok).toBe(true);
  });

  it('5. should reject REVOKED signer checkpoint', async () => {
    await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);
    const checkpoint = await emitCheckpoint(ns, storage, { kid: 'revoked-signer' });
    const verification = await verifyCheckpoint(ns, checkpoint);
    expect(verification.ok).toBe(false);
    expect(verification.reason).toContain('signer_revoked');
  });

  it('6. should handle RETIRED signer with grace period', async () => {
    await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);
    
    // Create checkpoint with current time first  
    const checkpoint = await emitCheckpoint(ns, storage, { kid: 'retired-signer' });
    
    // Should pass with sufficient grace period
    const verification1 = await verifyCheckpoint(ns, checkpoint, { retiredGraceMs: 24 * 60 * 60 * 1000 });
    expect(verification1.ok).toBe(true);
    
    // Now test with old timestamp that exceeds grace period
    const oldCheckpoint = { ...checkpoint, at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() };
    const verification2 = await verifyCheckpoint(ns, oldCheckpoint, { retiredGraceMs: 24 * 60 * 60 * 1000 });
    expect(verification2.ok).toBe(false);
    expect(verification2.reason).toContain('signer_expired');
  });

  it('7. should maintain state across operations', async () => {
    await appendLeaf(ns, new TextEncoder().encode('leaf1'), storage);
    await appendLeaf(ns, new TextEncoder().encode('leaf2'), storage);

    const state1Data = await storage.getItem(`tl:${ns}:state`);
    const state1 = JSON.parse(state1Data!);
    expect(state1.n).toBe(2);

    const result3 = await appendLeaf(ns, new TextEncoder().encode('leaf3'), storage);
    expect(result3.n).toBe(3);
  });

  it('8. should produce deterministic roots', async () => {
    const leaves = ['a', 'b', 'c'].map(s => new TextEncoder().encode(s));
    
    const storage1 = new MockStorage();
    let root1 = '';
    for (const leaf of leaves) {
      const result = await appendLeaf('test1', leaf, storage1);
      root1 = result.rootB64u;
    }

    const storage2 = new MockStorage();
    let root2 = '';
    for (const leaf of leaves) {
      const result = await appendLeaf('test2', leaf, storage2);
      root2 = result.rootB64u;
    }

    expect(root1).toBe(root2);
  });

  it('9. should handle edge cases properly', async () => {
    await expect(genProof(ns, 0, storage)).rejects.toThrow('index_out_of_range');
    await expect(emitCheckpoint(ns, storage)).rejects.toThrow('invalid_state');
    
    await appendLeaf(ns, new TextEncoder().encode('leaf'), storage);
    await expect(genProof(ns, 1, storage)).rejects.toThrow('index_out_of_range');
  });

  it('10. should work with encrypted storage simulation', async () => {
    class EncryptedStorage extends MockStorage {
      private encrypt(value: string): string { return 'enc:' + btoa(value); }
      private decrypt(value: string): string { return value.startsWith('enc:') ? atob(value.substring(4)) : value; }
      async setItem(key: string, value: string): Promise<void> { await super.setItem(key, this.encrypt(value)); }
      async getItem(key: string): Promise<string | null> { const encrypted = await super.getItem(key); return encrypted ? this.decrypt(encrypted) : null; }
    }

    const encStorage = new EncryptedStorage();
    const result = await appendLeaf(ns, new TextEncoder().encode('encrypted-test'), encStorage);
    expect(result.index).toBe(0);
    
    const proof = await genProof(ns, 0, encStorage);
    const verification = await verifyProof(proof, result.rootB64u);
    expect(verification.ok).toBe(true);
  });

  it('11. should handle power-of-2 and odd leaf counts', async () => {
    const counts = [1, 2, 3, 4, 5, 8];
    
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

      for (let i = 0; i < count; i++) {
        const proof = await genProof(testNs, i, testStorage);
        const verification = await verifyProof(proof, finalResult!.rootB64u);
        expect(verification.ok).toBe(true);
      }
    }
  });
});
