/**
 * Simple Transparency Log Test
 * Basic functionality verification
 */

import { describe, it, expect } from 'vitest';
import { appendLeaf, genProof, verifyProof } from '../src/transparency/merkle';

// Mock storage
class SimpleStorage {
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
}

describe('Transparency Log Basic Test', () => {
  it('should append a leaf', async () => {
    const storage = new SimpleStorage();
    const leaf = new TextEncoder().encode('test leaf');

    const result = await appendLeaf('test', leaf, storage);

    expect(result.index).toBe(0);
    expect(result.n).toBe(1);
    expect(result.leafHashB64u).toBeTruthy();
    expect(result.rootB64u).toBeTruthy();
  });

  it('should append multiple leaves', async () => {
    const storage = new SimpleStorage();

    const leaf1 = new TextEncoder().encode('leaf1');
    const result1 = await appendLeaf('test', leaf1, storage);
    expect(result1.index).toBe(0);
    expect(result1.n).toBe(1);

    const leaf2 = new TextEncoder().encode('leaf2');
    const result2 = await appendLeaf('test', leaf2, storage);
    expect(result2.index).toBe(1);
    expect(result2.n).toBe(2);
  });

  it('should generate and verify proof for single leaf', async () => {
    const storage = new SimpleStorage();
    const leaf = new TextEncoder().encode('single leaf');

    const result = await appendLeaf('test', leaf, storage);
    const proof = await genProof('test', 0, storage);

    expect(proof.index).toBe(0);
    expect(proof.leafHashB64u).toBe(result.leafHashB64u);

    const verification = await verifyProof(proof, result.rootB64u);
    expect(verification.ok).toBe(true);
  });

  it('should throw on invalid proof index', async () => {
    const storage = new SimpleStorage();
    const leaf = new TextEncoder().encode('test');

    await appendLeaf('test', leaf, storage);

    await expect(genProof('test', 1, storage)).rejects.toThrow(
      'index_out_of_range'
    );
  });
});
