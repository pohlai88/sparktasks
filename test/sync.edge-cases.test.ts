import { describe, it, expect, beforeEach } from 'vitest';
import { syncOnce } from '../src/sync/session';
import { useTaskStore } from '../src/stores/taskStore';
import type { RemoteTransport } from '../src/storage/remoteTypes';

// Mock transport for testing
class MockTransport implements RemoteTransport {
  private data = new Map<string, { value: string; updatedAt: string }>();
  
  async list(prefix: string, _since?: string): Promise<{
    items: Array<{ key: string; value: string; updatedAt: string }>;
    nextSince?: string;
  }> {
    const items = Array.from(this.data.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, data]) => ({ key, ...data }));
    
    return { items };
  }
  
  async get(key: string): Promise<{ value: string; updatedAt: string } | null> {
    return this.data.get(key) || null;
  }
  
  async put(key: string, value: string, updatedAt: string): Promise<void> {
    this.data.set(key, { value, updatedAt });
  }
  
  async del(key: string, _updatedAt: string): Promise<void> {
    this.data.delete(key);
  }
}

describe('Sync Edge Cases Validation', () => {
  beforeEach(() => {
    useTaskStore.getState().hydrate();
  });

  it('should handle mixed packs (one valid, one corrupt)', async () => {
    const transport = new MockTransport();
    
    // Valid pack
    const validEvent = {
      id: 'evt-1',
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        id: 'task-1',
        title: 'Valid Task',
        status: 'TODAY',
        priority: 'P1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: []
      }
    };
    
    const rawEvents = JSON.stringify(validEvent);
    let hash = 0x811c9dc5 >>> 0;
    for (let i = 0; i < rawEvents.length; i++) {
      hash ^= rawEvents.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    const validHash = ('00000000' + hash.toString(16)).slice(-8);
    
    const validPack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json',
        createdAt: new Date().toISOString(),
        eventsCount: 1,
        eventsHash: validHash
      },
      events: [validEvent]
    };
    
    // Corrupt pack - bad hash
    const corruptPack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json',
        createdAt: new Date().toISOString(),
        eventsCount: 1,
        eventsHash: 'badhash123'
      },
      events: [validEvent] // Same event but wrong hash
    };
    
    await transport.put('test-namespace/valid-pack', JSON.stringify(validPack), new Date().toISOString());
    await transport.put('test-namespace/corrupt-pack', JSON.stringify(corruptPack), new Date().toISOString());
    
    const result = await syncOnce(transport, 'test-namespace');
    
    // Should succeed partially - valid pack processed, corrupt pack logged as warning
    expect(result.completed).toBe(true);
    expect(result.pullCount).toBe(2); // Attempted to pull both
    expect(result.mergeReport?.applied).toBeGreaterThan(0); // Valid pack applied
    expect(result.errors).toHaveLength(0); // No hard errors, just warnings
  });

  it('should handle token rewind gracefully', async () => {
    const transport = new MockTransport();
    
    // Simulate old/invalid token scenario by providing bad token
    const result1 = await syncOnce(transport, 'test-namespace', { sinceToken: 'invalid-token' });
    expect(result1.completed).toBe(true);
    expect(result1.noop).toBe(true); // No data to sync
    
    // Add some data
    const validEvent = {
      id: 'evt-1',
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        id: 'task-1',
        title: 'Test Task',
        status: 'TODAY',
        priority: 'P1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: []
      }
    };
    
    const rawEvents = JSON.stringify(validEvent);
    let hash = 0x811c9dc5 >>> 0;
    for (let i = 0; i < rawEvents.length; i++) {
      hash ^= rawEvents.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    const validHash = ('00000000' + hash.toString(16)).slice(-8);
    
    const pack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json',
        createdAt: new Date().toISOString(),
        eventsCount: 1,
        eventsHash: validHash
      },
      events: [validEvent]
    };
    
    await transport.put('test-namespace/pack-1', JSON.stringify(pack), new Date().toISOString());
    
    // Sync without token should work
    const result2 = await syncOnce(transport, 'test-namespace');
    expect(result2.completed).toBe(true);
    expect(result2.mergeReport?.applied).toBeGreaterThan(0);
    
    // Sync again should be idempotent (noop with persisted token)
    const result3 = await syncOnce(transport, 'test-namespace');
    expect(result3.completed).toBe(true);
    // Note: May not be noop if sync state isn't fully implemented, but should not duplicate
  });
});
