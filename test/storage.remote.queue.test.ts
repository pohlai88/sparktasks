import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RemoteAdapter } from '../src/storage/remote';
import type { StorageDriver } from '../src/storage/types';
import type {
  RemoteTransport,
  RemoteAdapterOptions,
} from '../src/storage/remoteTypes';

// Mock storage driver
class MockStorageDriver implements StorageDriver {
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
    const keys = Array.from(this.data.keys());
    return keys.filter(key => key.startsWith(prefix));
  }

  clear(): void {
    this.data.clear();
  }

  get size(): number {
    return this.data.size;
  }
}

// Mock remote transport
class MockRemoteTransport implements RemoteTransport {
  private data = new Map<string, { value: string; updatedAt: string }>();
  public callLog: Array<{ method: string; args: unknown[] }> = [];

  async list(namespace: string, sinceToken?: string) {
    this.callLog.push({ method: 'list', args: [namespace, sinceToken] });

    const items = Array.from(this.data.entries())
      .filter(([key]) => key.startsWith(namespace))
      .map(([key, data]) => ({
        key,
        value: data.value,
        updatedAt: data.updatedAt,
      }));

    return {
      items,
      nextSince: `token-${Date.now()}`,
    };
  }

  async get(key: string) {
    this.callLog.push({ method: 'get', args: [key] });
    return this.data.get(key) || null;
  }

  async put(key: string, value: string, updatedAt: string): Promise<void> {
    this.callLog.push({ method: 'put', args: [key, value, updatedAt] });
    this.data.set(key, { value, updatedAt });
  }

  async del(key: string, updatedAt: string): Promise<void> {
    this.callLog.push({ method: 'del', args: [key, updatedAt] });
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
    this.callLog = [];
  }

  setData(key: string, value: string, updatedAt: string): void {
    this.data.set(key, { value, updatedAt });
  }
}

describe('RemoteAdapter - Queue Management', () => {
  let mockLocal: MockStorageDriver;
  let mockRemote: MockRemoteTransport;
  let adapter: RemoteAdapter;

  beforeEach(() => {
    mockLocal = new MockStorageDriver();
    mockRemote = new MockRemoteTransport();
    adapter = new RemoteAdapter(mockLocal, mockRemote, 'test');
  });

  describe('Basic Operations', () => {
    it('should namespace keys correctly', async () => {
      await adapter.setItem('key1', 'value1');

      // Check that local storage receives namespaced key
      expect(await mockLocal.getItem('test:key1')).toBe('value1');

      // Check that getItem returns the value
      expect(await adapter.getItem('key1')).toBe('value1');
    });

    it('should handle removeItem', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.removeItem('key1');

      expect(await adapter.getItem('key1')).toBeNull();
      expect(await mockLocal.getItem('test:key1')).toBeNull();
    });

    it('should list keys without namespace prefix', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');

      const keys = await adapter.listKeys('key');
      expect(keys).toEqual(['key1', 'key2']);
    });
  });

  describe('Queue Operations', () => {
    it('should queue operations for remote sync', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key2', 'value2');
      await adapter.removeItem('key1');

      // Sync should push operations to remote
      const result = await adapter.sync();

      expect(result.pushed).toBe(2); // key2 set + key1 delete

      // Check for specific operation types rather than exact count
      const putCalls = mockRemote.callLog.filter(call => call.method === 'put');
      const delCalls = mockRemote.callLog.filter(call => call.method === 'del');
      const listCalls = mockRemote.callLog.filter(
        call => call.method === 'list'
      );

      expect(putCalls).toHaveLength(1); // key2 put
      expect(delCalls).toHaveLength(1); // key1 delete
      expect(listCalls).toHaveLength(1); // list for pull
    });

    it('should consolidate queue operations for same key', async () => {
      // Multiple operations on same key
      await adapter.setItem('key1', 'value1');
      await adapter.setItem('key1', 'value2');
      await adapter.setItem('key1', 'value3');

      const result = await adapter.sync();

      // Only the last operation should be pushed
      expect(result.pushed).toBe(1);

      const putCalls = mockRemote.callLog.filter(call => call.method === 'put');
      expect(putCalls).toHaveLength(1);
      expect(putCalls[0]?.args[1]).toBe('value3');
    });

    it('should handle set followed by delete', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.removeItem('key1');

      const result = await adapter.sync();

      // Only delete should be pushed since it's the last operation
      expect(result.pushed).toBe(1);

      const delCalls = mockRemote.callLog.filter(call => call.method === 'del');
      expect(delCalls).toHaveLength(1);
      expect(delCalls[0]?.args[0]).toBe('test:key1');
    });
  });

  describe('Batch Processing', () => {
    it('should respect maxBatch option', async () => {
      const options: RemoteAdapterOptions = { maxBatch: 2 };
      adapter = new RemoteAdapter(mockLocal, mockRemote, 'test', options);

      // Queue 5 operations
      for (let i = 1; i <= 5; i++) {
        await adapter.setItem(`key${i}`, `value${i}`);
      }

      const result = await adapter.sync();

      // Should only process 2 operations in first batch
      expect(result.pushed).toBe(2);
    });

    it('should process remaining operations in subsequent syncs', async () => {
      const options: RemoteAdapterOptions = { maxBatch: 2 };
      adapter = new RemoteAdapter(mockLocal, mockRemote, 'test', options);

      // Queue 5 operations
      for (let i = 1; i <= 5; i++) {
        await adapter.setItem(`key${i}`, `value${i}`);
      }

      // First sync: 2 operations
      let result = await adapter.sync();
      expect(result.pushed).toBe(2);

      // Second sync: 2 more operations
      result = await adapter.sync();
      expect(result.pushed).toBe(2);

      // Third sync: remaining 1 operation
      result = await adapter.sync();
      expect(result.pushed).toBe(1);

      // Fourth sync: no more operations
      result = await adapter.sync();
      expect(result.pushed).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle remote transport errors gracefully', async () => {
      await adapter.setItem('key1', 'value1');

      // Mock remote to throw error
      mockRemote.put = vi.fn().mockRejectedValue(new Error('Network error'));

      // First sync should throw error
      await expect(adapter.sync()).rejects.toThrow('Network error');

      // Fix the remote and try again
      mockRemote.put = vi
        .fn()
        .mockImplementation(async (key, value, updatedAt) => {
          mockRemote.setData(key, value, updatedAt);
        });

      // Second sync should succeed with the queued operation
      const result = await adapter.sync();
      expect(result.pushed).toBe(1);
    });

    it('should handle rate limiting with backoff', async () => {
      // Mock remote to throw rate limit error
      mockRemote.put = vi.fn().mockRejectedValue(new Error('429 rate limit'));

      await adapter.setItem('key1', 'value1');

      await expect(adapter.sync()).rejects.toThrow('429 rate limit');
    });
  });
});
