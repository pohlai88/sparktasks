import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  appendEvent,
  loadSnapshot,
  saveSnapshot,
  snapshotState,
  reduce,
  loadEvents,
} from '../src/domain/task/eventlog';
import { useTaskStore } from '../src/stores/taskStore';
import type { TaskEvent } from '../src/domain/task/events';
import type { Snapshot } from '../src/domain/task/snapshot';

describe('Snapshot: Hydrate', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should hydrate from snapshot with tail events', () => {
    // Create base events for snapshot
    const baseEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'First task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:01:00.000Z',
        payload: {
          id: 'task-2',
          title: 'Second task',
          status: 'LATER',
          priority: 'P2',
          tags: [],
        },
      },
    ];

    // Add base events
    baseEvents.forEach(event => appendEvent(event));

    // Create snapshot from base state
    const baseTasks = reduce(baseEvents);
    const snapshot = snapshotState(baseTasks);
    saveSnapshot(snapshot);

    // Add tail events after snapshot
    const tailEvents: TaskEvent[] = [
      {
        type: 'TASK_UPDATED',
        timestamp: '2025-08-15T10:02:00.000Z',
        payload: {
          id: 'task-1',
          changes: { title: 'Updated first task' },
        },
      },
      {
        type: 'TASK_COMPLETED',
        timestamp: '2025-08-15T10:03:00.000Z',
        payload: { id: 'task-2' },
      },
    ];

    tailEvents.forEach(event => appendEvent(event));

    // Hydrate from snapshot + tail
    const store = useTaskStore.getState();
    store.hydrate();

    // Verify final state includes both snapshot and tail changes
    const finalState = useTaskStore.getState().byId;

    expect(finalState['task-1'].title).toBe('Updated first task');
    expect(finalState['task-2'].status).toBe('DONE');

    // Compare with full reduce to ensure equivalence
    const allEvents = loadEvents();
    const fullReduceState = reduce(allEvents);

    expect(finalState['task-1'].title).toBe(fullReduceState['task-1'].title);
    expect(finalState['task-2'].status).toBe(fullReduceState['task-2'].status);
  });

  it('should use full reduce when no snapshot exists', () => {
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

    // Hydrate without snapshot
    const store = useTaskStore.getState();
    store.hydrate();

    const state = useTaskStore.getState().byId;
    expect(state['task-1']).toBeDefined();
    expect(state['task-1'].title).toBe('Test task');
  });

  it('should maintain snapshot when hash verification passes', () => {
    // Create snapshot
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
    saveSnapshot(snapshot);

    // Clear events to simulate pure snapshot load
    localStorage.setItem('spark.events.v1', '');

    // Hydrate
    const store = useTaskStore.getState();
    store.hydrate();

    // Verify snapshot still exists and state is correct
    expect(loadSnapshot()).not.toBeNull();
    const state = useTaskStore.getState().byId;
    expect(state['task-1'].title).toBe('Test task');
  });
});
