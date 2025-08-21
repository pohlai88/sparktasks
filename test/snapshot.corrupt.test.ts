import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  appendEvent,
  saveSnapshot,
  snapshotState,
  reduce,
} from '../src/domain/task/eventlog';
import { useTaskStore } from '../src/stores/taskStore';
import type { TaskEvent } from '../src/domain/task/events';
import type { Snapshot } from '../src/domain/task/snapshot';

describe('Snapshot: Corrupt', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should fall back to full reduce when snapshot hash is corrupted', () => {
    // Create events and snapshot
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Test task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
    ];

    events.forEach(event => appendEvent(event));
    const tasks = reduce(events);
    const snapshot = snapshotState(tasks);

    // Corrupt the hash
    const corruptedSnapshot: Snapshot = {
      ...snapshot,
      meta: {
        ...snapshot.meta,
        stateHash: 'invalid-hash',
      },
    };

    saveSnapshot(corruptedSnapshot);

    // Clear events to force snapshot-only path
    localStorage.setItem('spark.events.v1', '');

    // Hydrate should detect corruption and fall back
    const store = useTaskStore.getState();
    store.hydrate();

    // Verify snapshot was discarded
    expect(localStorage.getItem('spark.snapshot.v1')).toBeNull();

    // Since we cleared events, state should be empty after fallback
    const state = useTaskStore.getState().byId;
    expect(Object.keys(state).length).toBe(0);
  });

  it('should handle corrupted snapshot with tail events', () => {
    // Create base events
    const baseEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Base task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
    ];

    baseEvents.forEach(event => appendEvent(event));
    const baseTasks = reduce(baseEvents);
    const snapshot = snapshotState(baseTasks);

    // Corrupt the hash
    const corruptedSnapshot: Snapshot = {
      ...snapshot,
      meta: {
        ...snapshot.meta,
        stateHash: 'corrupted-hash',
        baseEventCount: 1,
      },
    };

    saveSnapshot(corruptedSnapshot);

    // Add tail events
    const tailEvent: TaskEvent = {
      type: 'TASK_UPDATED',
      timestamp: '2025-08-15T10:01:00.000Z',
      payload: {
        id: 'task-1',
        changes: { title: 'Updated task' },
      },
    };

    appendEvent(tailEvent);

    // Hydrate - with tail events, we should proceed despite hash mismatch
    const store = useTaskStore.getState();
    store.hydrate();

    const state = useTaskStore.getState().byId;
    expect(state['task-1']).toBeDefined();
    // Should have the updated title from tail events
    expect(state['task-1'].title).toBe('Updated task');
  });

  it('should handle completely malformed snapshot data', () => {
    // Create valid events
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Valid task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
    ];

    events.forEach(event => appendEvent(event));

    // Store malformed JSON in snapshot
    localStorage.setItem('spark.snapshot.v1', 'invalid-json-data');

    // Hydrate should handle gracefully
    const store = useTaskStore.getState();
    store.hydrate();

    // Should fall back to event log reduction
    const state = useTaskStore.getState().byId;
    expect(state['task-1']).toBeDefined();
    expect(state['task-1'].title).toBe('Valid task');
  });

  it('should preserve valid snapshots when hash matches', () => {
    // Create events and valid snapshot
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Valid task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
    ];

    events.forEach(event => appendEvent(event));
    const tasks = reduce(events);
    const snapshot = snapshotState(tasks);
    saveSnapshot(snapshot);

    // Clear events to force snapshot-only path
    localStorage.setItem('spark.events.v1', '');

    // Store reference to original hash
    const originalHash = snapshot.meta.stateHash;

    // Hydrate
    const store = useTaskStore.getState();
    store.hydrate();

    // Verify snapshot is still present with same hash
    const preservedSnapshot = JSON.parse(
      localStorage.getItem('spark.snapshot.v1') || '{}'
    );
    expect(preservedSnapshot.meta.stateHash).toBe(originalHash);

    // Verify state is correct
    const state = useTaskStore.getState().byId;
    expect(state['task-1']).toBeDefined();
    expect(state['task-1'].title).toBe('Valid task');
  });

  it('should call deleteSnapshot helper for consistent cleanup', () => {
    // Create corrupted snapshot
    const snapshot = {
      meta: {
        version: 1 as const,
        createdAt: '2025-08-15T10:00:00.000Z',
        baseEventCount: 0,
        stateHash: 'invalid-hash',
      },
      tasks: {},
    };

    saveSnapshot(snapshot);

    // Verify both keys exist
    expect(localStorage.getItem('spark.snapshot.v1')).not.toBeNull();

    // Hydrate should detect corruption and clean up
    const store = useTaskStore.getState();
    store.hydrate();

    // Verify complete cleanup (both main and temp keys removed)
    expect(localStorage.getItem('spark.snapshot.v1')).toBeNull();
    expect(localStorage.getItem('spark.snapshot.v1.tmp')).toBeNull();
  });
});
