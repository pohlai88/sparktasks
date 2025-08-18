import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { appendEvent, compactWithSnapshot, loadSnapshot, getEventCount } from '../src/domain/task/eventlog';
import type { TaskEvent } from '../src/domain/task/events';

describe('Snapshot: Create', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create snapshot when threshold is met', () => {
    // Create some tasks
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'First task',
          status: 'TODAY',
          priority: 'P1',
          tags: ['urgent'],
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

    // Add events to log
    events.forEach(event => appendEvent(event));
    
    // Verify initial state
    expect(getEventCount()).toBe(2);
    expect(loadSnapshot()).toBeNull();

    // Compact with threshold=1 (should trigger snapshot)
    const result = compactWithSnapshot(1);
    
    expect(result.tookSnapshot).toBe(true);
    expect(result.trimmed).toBe(2);
    
    // Verify snapshot was created
    const snapshot = loadSnapshot();
    expect(snapshot).not.toBeNull();
    expect(snapshot!.meta.version).toBe(1);
    expect(snapshot!.meta.baseEventCount).toBe(2);
    expect(snapshot!.meta.stateHash).toBeTruthy();
    expect(snapshot!.meta.createdAt).toBeTruthy();
    
    // Verify snapshot contains tasks
    expect(Object.keys(snapshot!.tasks)).toHaveLength(2);
    expect(snapshot!.tasks['task-1']).toBeDefined();
    expect(snapshot!.tasks['task-1'].title).toBe('First task');
    expect(snapshot!.tasks['task-2']).toBeDefined();
    expect(snapshot!.tasks['task-2'].title).toBe('Second task');
    
    // Verify event log was trimmed
    expect(getEventCount()).toBe(0);
  });

  it('should not create snapshot when below threshold', () => {
    // Create one task
    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'task-1',
        title: 'First task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    appendEvent(event);
    
    // Compact with threshold=5 (should not trigger)
    const result = compactWithSnapshot(5);
    
    expect(result.tookSnapshot).toBe(false);
    expect(result.trimmed).toBe(0);
    expect(loadSnapshot()).toBeNull();
    expect(getEventCount()).toBe(1);
  });

  it('should create stable hash for identical task states', () => {
    // Create identical tasks through different event sequences
    const events1: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Task 1',
          status: 'TODAY',
          priority: 'P1',
          tags: ['tag1', 'tag2'],
        },
      },
    ];

    const events2: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Initial title',
          status: 'TODAY',
          priority: 'P1',
          tags: ['tag2', 'tag1'], // Different order
        },
      },
      {
        type: 'TASK_UPDATED',
        timestamp: '2025-08-15T10:01:00.000Z',
        payload: {
          id: 'task-1',
          changes: { title: 'Task 1' },
        },
      },
    ];

    // Test first sequence
    localStorage.clear();
    events1.forEach(event => appendEvent(event));
    compactWithSnapshot(1);
    const snapshot1 = loadSnapshot();

    // Test second sequence
    localStorage.clear();
    events2.forEach(event => appendEvent(event));
    compactWithSnapshot(1);
    const snapshot2 = loadSnapshot();

    // Hashes should be identical despite different event sequences
    expect(snapshot1!.meta.stateHash).toBe(snapshot2!.meta.stateHash);
  });
});
