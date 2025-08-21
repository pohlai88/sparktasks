import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RemoteAdapter } from '../src/storage/remote';
import type { StorageDriver } from '../src/storage/types';
import type { RemoteTransport } from '../src/storage/remoteTypes';
import { SyncLocalStorageDriver } from '../src/storage/local';
import {
  configureStorage,
  appendEvent,
  loadEvents,
  compactWithSnapshot,
} from '../src/domain/task/eventlog';

// Mock storage driver that captures operations
class MockStorageDriver implements StorageDriver {
  private data = new Map<string, string>();
  public operations: Array<{ op: string; key: string; value?: string }> = [];

  async getItem(key: string): Promise<string | null> {
    this.operations.push({ op: 'get', key });
    return this.data.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.operations.push({ op: 'set', key, value });
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.operations.push({ op: 'remove', key });
    this.data.delete(key);
  }

  async listKeys(prefix: string): Promise<string[]> {
    this.operations.push({ op: 'list', key: prefix });
    const keys = Array.from(this.data.keys());
    return keys.filter(key => key.startsWith(prefix));
  }

  clear(): void {
    this.data.clear();
    this.operations = [];
  }

  getData(): Map<string, string> {
    return new Map(this.data);
  }
}

// Simple mock remote transport
class MockRemoteTransport implements RemoteTransport {
  private data = new Map<string, { value: string; updatedAt: string }>();
  public syncs = 0;

  async list(namespace: string, sinceToken?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _token = sinceToken; // Acknowledge parameter
    const items = Array.from(this.data.entries())
      .filter(([key]) => key.startsWith(namespace))
      .map(([key, data]) => ({
        key,
        value: data.value,
        updatedAt: data.updatedAt,
      }));

    return {
      items,
      nextSince: `token-${++this.syncs}`,
    };
  }

  async get(key: string) {
    return this.data.get(key) || null;
  }

  async put(key: string, value: string, updatedAt: string): Promise<void> {
    this.data.set(key, { value, updatedAt });
  }

  async del(key: string, updatedAt: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _timestamp = updatedAt; // Acknowledge parameter
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
    this.syncs = 0;
  }

  getData(): Map<string, { value: string; updatedAt: string }> {
    return new Map(this.data);
  }
}

describe('RemoteAdapter - EventLog-like Integration', () => {
  let mockLocal: MockStorageDriver;
  let mockRemote: MockRemoteTransport;
  let adapter: RemoteAdapter;

  beforeEach(() => {
    mockLocal = new MockStorageDriver();
    mockRemote = new MockRemoteTransport();
    adapter = new RemoteAdapter(mockLocal, mockRemote, 'tasks');

    // Clear any existing state
    mockLocal.clear();
    mockRemote.clear();
  });

  describe('Basic RemoteAdapter Functionality', () => {
    it('should queue operations for later sync', async () => {
      await adapter.setItem(
        'eventLog',
        JSON.stringify([
          { type: 'task.created', id: '1', name: 'Task 1' },
          { type: 'task.completed', id: '1' },
        ])
      );

      // Verify data is in local storage with proper namespace
      const localData = mockLocal.getData();
      expect(localData.get('tasks:eventLog')).toBeTruthy();

      // Sync should push to remote
      const result = await adapter.sync();
      expect(result.pushed).toBe(1);

      // Verify data reached remote
      const remoteData = mockRemote.getData();
      expect(remoteData.get('tasks:eventLog')?.value).toBeTruthy();
    });

    it('should handle multiple keys like eventlog storage pattern', async () => {
      // Simulate eventlog pattern with separate keys
      await adapter.setItem('spark.events.v1', 'event1\nevent2\nevent3');
      await adapter.setItem(
        'spark.snapshot.v1',
        JSON.stringify({ tasks: {}, hash: 'abc123' })
      );

      const result = await adapter.sync();
      expect(result.pushed).toBe(2);

      // Verify both keys synced
      const remoteData = mockRemote.getData();
      expect(remoteData.get('tasks:spark.events.v1')).toBeTruthy();
      expect(remoteData.get('tasks:spark.snapshot.v1')).toBeTruthy();
    });

    it('should handle delete operations', async () => {
      await adapter.setItem('tempKey', 'tempValue');
      await adapter.sync();

      await adapter.removeItem('tempKey');
      const result = await adapter.sync();

      expect(result.pushed).toBe(1);
      expect(mockRemote.getData().has('tasks:tempKey')).toBe(false);
    });
  });

  describe('Conflict Resolution for EventLog-like Data', () => {
    it('should handle simple conflicts', async () => {
      await adapter.setItem('conflictKey', 'localValue');

      // Simulate remote conflict by making remote newer
      mockRemote.get = vi.fn().mockResolvedValue({
        value: 'remoteValue',
        updatedAt: new Date(Date.now() + 1000).toISOString(),
      });

      const result = await adapter.sync();

      // Local should be updated with remote value due to LWW
      expect(await adapter.getItem('conflictKey')).toBe('remoteValue');
      expect(result.pushed).toBe(0); // Push skipped due to conflict
    });

    it('should maintain consistency during mixed operations', async () => {
      // Add multiple keys, some conflicting
      await adapter.setItem('normal', 'normalValue');
      await adapter.setItem('conflict', 'localConflict');

      mockRemote.get = vi.fn().mockImplementation(async key => {
        if (key.includes('conflict')) {
          return {
            value: 'remoteConflict',
            updatedAt: new Date(Date.now() + 1000).toISOString(),
          };
        }
        return null;
      });

      const result = await adapter.sync();

      // Normal key should be pushed, conflict key should be updated locally
      expect(result.pushed).toBe(1);
      expect(await adapter.getItem('normal')).toBe('normalValue');
      expect(await adapter.getItem('conflict')).toBe('remoteConflict');
    });
  });

  describe('Batching and Performance', () => {
    it('should batch operations efficiently', async () => {
      // Add many operations like a busy eventlog
      for (let i = 1; i <= 20; i++) {
        await adapter.setItem(
          `event-${i}`,
          JSON.stringify({ type: 'task.created', id: i })
        );
      }

      // Sync with limited batch size
      const limitedAdapter = new RemoteAdapter(mockLocal, mockRemote, 'tasks', {
        maxBatch: 5,
      });

      const result = await limitedAdapter.sync();
      expect(result.pushed).toBe(5); // Should be limited by batch size

      // Remaining operations should be available for next sync
      const result2 = await limitedAdapter.sync();
      expect(result2.pushed).toBeGreaterThan(0);
    });

    it('should handle rapid successive operations', async () => {
      // Simulate rapid eventlog updates
      const operations = [];
      for (let i = 1; i <= 50; i++) {
        operations.push(adapter.setItem(`rapid-${i}`, `value-${i}`));
      }

      await Promise.all(operations);

      const result = await adapter.sync();
      expect(result.pushed).toBe(50);

      // All data should be in remote
      const remoteData = mockRemote.getData();
      for (let i = 1; i <= 50; i++) {
        expect(remoteData.get(`tasks:rapid-${i}`)?.value).toBe(`value-${i}`);
      }
    });
  });

  describe('Error Recovery', () => {
    it('should recover from sync failures without losing data', async () => {
      await adapter.setItem(
        'importantEvent',
        JSON.stringify({ type: 'critical.event', id: '1' })
      );

      // Mock remote to fail first time
      let putCallCount = 0;
      mockRemote.put = vi
        .fn()
        .mockImplementation(async (key, value, updatedAt) => {
          putCallCount++;
          if (putCallCount === 1) {
            throw new Error('Network error');
          }
          // Succeeds on retry
          mockRemote.getData().set(key, { value, updatedAt });
        });

      // First sync should fail
      await expect(adapter.sync()).rejects.toThrow('Network error');

      // Data should still be available locally
      expect(await adapter.getItem('importantEvent')).toBeTruthy();

      // Second sync should succeed
      const result = await adapter.sync();
      expect(result.pushed).toBeGreaterThan(0);
      expect(mockRemote.getData().get('tasks:importantEvent')).toBeTruthy();
    });

    it('should handle partial batch failures', async () => {
      await adapter.setItem('success1', 'value1');
      await adapter.setItem('fail', 'failValue');
      await adapter.setItem('success2', 'value2');

      // Mock to fail on specific key
      mockRemote.put = vi
        .fn()
        .mockImplementation(async (key, value, updatedAt) => {
          if (key.includes('fail')) {
            throw new Error('Specific failure');
          }
          mockRemote.getData().set(key, { value, updatedAt });
        });

      await expect(adapter.sync()).rejects.toThrow('Specific failure');

      // Failed operation should remain in queue for retry
      // Successful operations should have been processed
      const remoteData = mockRemote.getData();
      expect(remoteData.has('tasks:success1')).toBe(true);
      expect(remoteData.has('tasks:fail')).toBe(false);
    });
  });

  describe('Sync State Management', () => {
    it('should persist sync state for incremental sync', async () => {
      await adapter.setItem('key1', 'value1');
      await adapter.sync();

      // Check that sync state is saved in local storage
      const syncState = await mockLocal.getItem('tasks:_syncState');
      expect(syncState).toBeTruthy();

      const parsed = JSON.parse(syncState!);
      expect(parsed.lastSyncAt).toBeTruthy();
      expect(parsed.sinceToken).toBeTruthy();
    });

    it('should use incremental sync tokens', async () => {
      // First sync
      await adapter.sync();

      // Clear call log and sync again
      mockRemote.syncs = 0;
      const result = await adapter.sync();

      // Should use token for incremental sync
      expect(result.pulled).toBe(0); // No new items
    });
  });
});
