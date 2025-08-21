import { describe, it, expect, beforeEach } from 'vitest';
import { syncOnce } from '../src/sync/session';
import { useTaskStore } from '../src/stores/taskStore';
import type { RemoteTransport } from '../src/storage/remoteTypes';

// Mock transport for testing with pagination support
class MockTransport implements RemoteTransport {
  private data = new Map<string, { value: string; updatedAt: string }>();
  private pageSize = 100; // Default page size

  async list(
    prefix: string,
    since?: string
  ): Promise<{
    items: Array<{ key: string; value: string; updatedAt: string }>;
    nextSince?: string;
  }> {
    const allItems = Array.from(this.data.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

    // Simple pagination simulation
    let startIdx = 0;
    if (since) {
      startIdx = allItems.findIndex(item => item.updatedAt > since);
      if (startIdx === -1) startIdx = allItems.length;
    }

    const pageItems = allItems.slice(startIdx, startIdx + this.pageSize);
    const hasMore = startIdx + this.pageSize < allItems.length;

    const result: {
      items: Array<{ key: string; value: string; updatedAt: string }>;
      nextSince?: string;
    } = { items: pageItems };

    if (hasMore && pageItems.length > 0) {
      result.nextSince = pageItems[pageItems.length - 1]!.updatedAt;
    }

    return result;
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

  // Test helper to set page size
  setPageSize(size: number) {
    this.pageSize = size;
  }
}

describe('Sync Integration', () => {
  beforeEach(() => {
    useTaskStore.getState().hydrate();
  });

  it('should handle empty remote sync', async () => {
    const transport = new MockTransport();
    const result = await syncOnce(transport, 'test-namespace');

    expect(result.completed).toBe(true);
    expect(result.pullCount).toBe(0);
    expect(result.mergeReport).toBeNull();
    expect(result.pushCount).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(result.noop).toBe(true);
  });

  it('should handle dry run mode', async () => {
    const transport = new MockTransport();

    // Add a remote pack with a task
    const eventData = {
      id: 'evt-1',
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        id: 'task-1',
        title: 'Remote Task',
        status: 'TODAY',
        priority: 'P1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      },
    };

    // Calculate proper hash
    const rawEvents = JSON.stringify(eventData);
    const h = 0x811c9dc5 >>> 0;
    let hash = h;
    for (let i = 0; i < rawEvents.length; i++) {
      hash ^= rawEvents.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    const eventsHash = ('00000000' + hash.toString(16)).slice(-8);

    const mockPack = {
      meta: {
        version: 1,
        format: 'sparkpack/1+json',
        createdAt: new Date().toISOString(),
        eventsCount: 1,
        eventsHash,
      },
      events: [eventData],
    };

    await transport.put(
      'test-namespace/pack-1',
      JSON.stringify(mockPack),
      new Date().toISOString()
    );

    const result = await syncOnce(transport, 'test-namespace', {
      dryRun: true,
    });

    expect(result.completed).toBe(true);
    expect(result.pullCount).toBe(1);
    expect(result.mergeReport).toBeTruthy();
    expect(result.pushCount).toBe(0); // No push in dry run
    expect(result.noop).toBe(false);
  });

  it('should sync with id remapping policy', async () => {
    const transport = new MockTransport();

    // Create a local task first
    useTaskStore.getState().addTask({
      title: 'Local Task',
      status: 'TODAY',
      priority: 'P1',
    });

    // Create a conflicting remote task with same ID
    const localTasks = Object.values(useTaskStore.getState().byId);
    const existingId = localTasks[0]?.id;

    if (existingId) {
      const eventData = {
        id: 'evt-conflict',
        type: 'TASK_CREATED',
        timestamp: new Date().toISOString(),
        payload: {
          id: existingId, // Same ID as local task
          title: 'Conflicting Remote Task',
          status: 'TODAY',
          priority: 'P2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
        },
      };

      // Calculate proper hash
      const rawEvents = JSON.stringify(eventData);
      let hash = 0x811c9dc5 >>> 0;
      for (let i = 0; i < rawEvents.length; i++) {
        hash ^= rawEvents.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
      }
      const eventsHash = ('00000000' + hash.toString(16)).slice(-8);

      const conflictPack = {
        meta: {
          version: 1,
          format: 'sparkpack/1+json',
          createdAt: new Date().toISOString(),
          eventsCount: 1,
          eventsHash,
        },
        events: [eventData],
      };

      await transport.put(
        'test-namespace/conflict-pack',
        JSON.stringify(conflictPack),
        new Date().toISOString()
      );

      const result = await syncOnce(transport, 'test-namespace', {
        policy: 'remapIds',
      });

      expect(result.completed).toBe(true);
      expect(result.mergeReport?.applied).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
      expect(result.noop).toBe(false);
    }
  });

  it('should handle pagination with multiple pages', async () => {
    const transport = new MockTransport();
    transport.setPageSize(2); // Small pages for testing

    // Create 5 packs to test pagination (will require 3 pages with pageSize=2)
    for (let i = 1; i <= 5; i++) {
      const eventData = {
        id: `evt-${i}`,
        type: 'TASK_CREATED',
        timestamp: new Date(Date.now() + i * 1000).toISOString(), // Stagger timestamps
        payload: {
          id: `task-${i}`,
          title: `Task ${i}`,
          status: 'TODAY',
          priority: 'P1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
        },
      };

      const rawEvents = JSON.stringify(eventData);
      let hash = 0x811c9dc5 >>> 0;
      for (let j = 0; j < rawEvents.length; j++) {
        hash ^= rawEvents.charCodeAt(j);
        hash = Math.imul(hash, 0x01000193) >>> 0;
      }
      const validHash = ('00000000' + hash.toString(16)).slice(-8);

      const pack = {
        meta: {
          version: 1,
          format: 'sparkpack/1+json',
          createdAt: new Date().toISOString(),
          eventsCount: 1,
          eventsHash: validHash,
        },
        events: [eventData],
      };

      await transport.put(
        `test-namespace/pack-${i}`,
        JSON.stringify(pack),
        new Date(Date.now() + i * 1000).toISOString()
      );
    }

    const result = await syncOnce(transport, 'test-namespace');

    expect(result.completed).toBe(true);
    expect(result.pullCount).toBe(5); // All 5 packs pulled across pages
    expect(result.mergeReport?.applied).toBe(5); // All 5 events applied
    expect(result.errors).toHaveLength(0);
    expect(result.noop).toBe(false);
  });

  it('should deduplicate events across pages', async () => {
    const transport = new MockTransport();
    transport.setPageSize(1); // Force pagination

    // Create duplicate event in two different packs
    const eventData = {
      id: 'evt-dup',
      type: 'TASK_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        id: 'task-dup',
        title: 'Duplicate Task',
        status: 'TODAY',
        priority: 'P1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      },
    };

    const rawEvents = JSON.stringify(eventData);
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
        eventsHash: validHash,
      },
      events: [eventData],
    };

    // Put same pack twice with different keys and timestamps
    await transport.put(
      'test-namespace/pack-1',
      JSON.stringify(pack),
      new Date(Date.now() + 1000).toISOString()
    );
    await transport.put(
      'test-namespace/pack-2',
      JSON.stringify(pack),
      new Date(Date.now() + 2000).toISOString()
    );

    const result = await syncOnce(transport, 'test-namespace');

    expect(result.completed).toBe(true);
    expect(result.pullCount).toBe(2); // Both packs pulled
    expect(result.mergeReport?.applied).toBe(1); // Only one event applied (deduped)
    expect(result.errors).toHaveLength(0);
  });
});
