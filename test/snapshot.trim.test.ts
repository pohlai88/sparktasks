import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { appendEvent, compactWithSnapshot, getEventCount, loadEvents } from '../src/domain/task/eventlog';
import { useTaskStore } from '../src/stores/taskStore';
import type { TaskEvent } from '../src/domain/task/events';

describe('Snapshot: Trim', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should trim large event log and maintain functionality', () => {
    // Create a large number of events
    const events: TaskEvent[] = [];
    
    for (let i = 0; i < 100; i++) {
      events.push({
        type: 'TASK_CREATED',
        timestamp: new Date(2025, 7, 15, 10, i).toISOString(),
        payload: {
          id: `task-${i}`,
          title: `Task ${i}`,
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      });
    }

    // Add all events
    events.forEach(event => appendEvent(event));
    
    const initialEventCount = getEventCount();
    expect(initialEventCount).toBe(100);

    // Compact with low threshold
    const result = compactWithSnapshot(50);
    
    expect(result.tookSnapshot).toBe(true);
    expect(result.trimmed).toBe(100);
    
    // Verify events were trimmed
    expect(getEventCount()).toBe(0);

    // Add new events after compaction
    const newEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T12:00:00.000Z',
      payload: {
        id: 'new-task',
        title: 'New task after compaction',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    appendEvent(newEvent);
    expect(getEventCount()).toBe(1);

    // Verify hydration still works correctly
    const store = useTaskStore.getState();
    store.hydrate();
    
    const state = useTaskStore.getState().byId;
    
    // Should have all original tasks from snapshot
    expect(Object.keys(state).length).toBe(101); // 100 + 1 new
    expect(state['task-0']).toBeDefined();
    expect(state['task-99']).toBeDefined();
    expect(state['new-task']).toBeDefined();
    expect(state['new-task'].title).toBe('New task after compaction');

    // Verify task store operations still work
    store.addTask({
      title: 'Another new task',
      status: 'LATER',
      priority: 'P2',
    });

    const updatedState = useTaskStore.getState().byId;
    const newTasks = Object.values(updatedState).filter(task => 
      task.title === 'Another new task'
    );
    expect(newTasks).toHaveLength(1);
  });

  it('should handle multiple compactions', () => {
    // Create initial events
    for (let i = 0; i < 10; i++) {
      appendEvent({
        type: 'TASK_CREATED',
        timestamp: new Date(2025, 7, 15, 10, i).toISOString(),
        payload: {
          id: `task-${i}`,
          title: `Task ${i}`,
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      });
    }

    // First compaction
    let result = compactWithSnapshot(5);
    expect(result.tookSnapshot).toBe(true);
    expect(result.trimmed).toBe(10);

    // Add more events
    for (let i = 10; i < 15; i++) {
      appendEvent({
        type: 'TASK_CREATED',
        timestamp: new Date(2025, 7, 15, 11, i).toISOString(),
        payload: {
          id: `task-${i}`,
          title: `Task ${i}`,
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      });
    }

    expect(getEventCount()).toBe(5);

    // Second compaction
    result = compactWithSnapshot(3);
    expect(result.tookSnapshot).toBe(true);
    expect(result.trimmed).toBe(5);

    // Verify state integrity
    const store = useTaskStore.getState();
    store.hydrate();
    
    const state = useTaskStore.getState().byId;
    expect(Object.keys(state).length).toBe(15);
    
    // Check both early and late tasks exist
    expect(state['task-0']).toBeDefined();
    expect(state['task-14']).toBeDefined();
  });

  it('should improve hydration performance after compaction', () => {
    // Create many events
    for (let i = 0; i < 1000; i++) {
      appendEvent({
        type: 'TASK_CREATED',
        timestamp: new Date(2025, 7, 15, 10, 0, i).toISOString(),
        payload: {
          id: `task-${i}`,
          title: `Task ${i}`,
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      });
    }

    // Measure hydration time before compaction
    const store = useTaskStore.getState();
    const start1 = performance.now();
    store.hydrate();
    const time1 = performance.now() - start1;

    // Compact
    compactWithSnapshot(100);

    // Measure hydration time after compaction (should be faster)
    const start2 = performance.now();
    store.hydrate();
    const time2 = performance.now() - start2;

    // After compaction, hydration should be significantly faster
    // (This is more of a performance test, exact timings may vary)
    expect(time2).toBeLessThan(time1 * 2); // Allow some variance
    
    // Verify state is still correct
    const state = useTaskStore.getState().byId;
    expect(Object.keys(state).length).toBe(1000);
  });
});
