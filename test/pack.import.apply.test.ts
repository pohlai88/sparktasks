import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { planImport, applyImport } from '../src/domain/pack/import';
import { snapshotEvents, restoreEvents, appendEvent } from '../src/domain/task/eventlog';
import { useTaskStore } from '../src/stores/taskStore';
import type { TaskEvent } from '../src/domain/task/events';

// Helper to create valid meta with integrity fields
const createValidMeta = (events: any[]) => {
  const rawEvents = events.map(e => JSON.stringify(e)).join('\n');
  // Simple FNV-1a hash
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < rawEvents.length; i++) {
    h ^= rawEvents.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const eventsHash = ('00000000' + h.toString(16)).slice(-8);
  
  return {
    version: 1 as const,
    format: 'sparkpack/1+json' as const,
    createdAt: '2025-08-15T10:00:00.000Z',
    eventsCount: events.length,
    eventsHash,
  };
};

describe('Pack Import Apply', () => {
  let originalSnapshot: string;

  beforeEach(() => {
    // Save original state and clear
    originalSnapshot = snapshotEvents();
    restoreEvents('');
    useTaskStore.getState().hydrate();
  });

  afterEach(() => {
    // Restore original state
    restoreEvents(originalSnapshot);
    useTaskStore.getState().hydrate();
  });

  it('should perform dry run without writing to storage', () => {
    const testEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'test-1',
        title: 'Test Task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    const sparkpack = {
      meta: createValidMeta([testEvent]),
      events: [testEvent],
    };

    const plan = planImport(JSON.stringify(sparkpack));
    const beforeSnapshot = snapshotEvents();

    const report = applyImport(plan, { dryRun: true });
    const afterSnapshot = snapshotEvents();

    expect(report.applied).toBe(1);
    expect(report.skipped).toBe(0);
    expect(report.errors).toHaveLength(0);
    expect(afterSnapshot).toBe(beforeSnapshot);
  });

  it('should apply valid events and hydrate store', () => {
    const testEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'test-1',
          title: 'Test Task 1',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:01:00.000Z',
        payload: {
          id: 'test-2',
          title: 'Test Task 2',
          status: 'LATER',
          priority: 'P2',
          tags: [],
        },
      },
    ];

    const sparkpack = {
      meta: createValidMeta(testEvents),
      events: testEvents,
    };

    const plan = planImport(JSON.stringify(sparkpack));
    const report = applyImport(plan);

    expect(report.applied).toBe(2);
    expect(report.skipped).toBe(0);
    expect(report.errors).toHaveLength(0);

    // Verify store was hydrated
    const tasks = useTaskStore.getState().byId;
    expect(Object.keys(tasks)).toHaveLength(2);
    expect(tasks['test-1']).toBeDefined();
    expect(tasks['test-2']).toBeDefined();
  });

  it('should handle import with invalid events and report skipped count', () => {
    const validEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'test-1',
        title: 'Test Task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };
    const invalidEvent = { type: 'INVALID', timestamp: 'bad', payload: {} };

    const sparkpack = {
      meta: createValidMeta([validEvent, invalidEvent]),
      events: [validEvent, invalidEvent],
    };

    const plan = planImport(JSON.stringify(sparkpack));
    const report = applyImport(plan);

    expect(report.applied).toBe(1);
    expect(report.skipped).toBe(1);
    expect(report.errors).toHaveLength(1);

    // Verify only valid event was applied
    const tasks = useTaskStore.getState().byId;
    expect(Object.keys(tasks)).toHaveLength(1);
    expect(tasks['test-1']).toBeDefined();
  });

  it('should rollback on append failure and restore snapshot', () => {
    // Add initial state
    const initialEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'initial',
        title: 'Initial Task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };
    appendEvent(initialEvent);
    useTaskStore.getState().hydrate();

    const initialSnapshot = snapshotEvents();
    const initialStoreState = Object.keys(useTaskStore.getState().byId);

    // Create plan with valid events (need multiple to trigger error on second call)
    const events = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'test-1',
          title: 'Test Task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:01:00.000Z',
        payload: {
          id: 'test-2',
          title: 'Test Task 2',
          status: 'TODAY',
          priority: 'P2',
          tags: [],
        },
      },
    ];

    const sparkpack = {
      meta: createValidMeta(events),
      events,
    };

    const plan = planImport(JSON.stringify(sparkpack));

    // Mock localStorage.setItem to throw error on second append (not during restore)
    const originalSetItem = localStorage.setItem;
    let appendCallCount = 0;
    localStorage.setItem = vi.fn((key, value) => {
      if (key === 'spark.events.v1') {
        // Check if this is an append operation (value contains newline) vs restore (single block)
        const isAppendOperation = typeof value === 'string' && value.includes('\n') && value.split('\n').length > 1;
        if (isAppendOperation) {
          appendCallCount++;
          if (appendCallCount > 1) {
            throw new Error('Storage quota exceeded');
          }
        }
      }
      // Call original implementation
      originalSetItem(key, value);
    });

    try {
      const report = applyImport(plan);

      expect(report.applied).toBe(0);
      expect(report.errors).toHaveLength(1);
      expect(report.errors[0]).toContain('Import failed');

      // Verify rollback occurred
      const finalSnapshot = snapshotEvents();
      expect(finalSnapshot).toBe(initialSnapshot);

      // Verify store state was restored
      const finalStoreState = Object.keys(useTaskStore.getState().byId);
      expect(finalStoreState).toEqual(initialStoreState);
    } finally {
      localStorage.setItem = originalSetItem;
    }
  });
});
