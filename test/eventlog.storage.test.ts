import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  appendEvent,
  loadEvents,
  configureStorage,
  snapshotEvents,
  restoreEvents,
} from '../src/domain/task/eventlog';
import { SyncLocalStorageDriver } from '../src/storage/local';
import type { TaskEvent } from '../src/domain/task/events';

// Mock storage driver for testing
class MockStorageDriver extends SyncLocalStorageDriver {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  listKeys(prefix: string): string[] {
    return Array.from(this.storage.keys()).filter(key =>
      key.startsWith(prefix)
    );
  }

  clear(): void {
    this.storage.clear();
  }
}

describe('Eventlog: Storage', () => {
  let mockDriver: MockStorageDriver;

  beforeEach(() => {
    localStorage.clear();
    mockDriver = new MockStorageDriver();
    configureStorage('test', mockDriver);
  });

  afterEach(() => {
    localStorage.clear();
    // Reset to default local storage
    configureStorage('spark', new SyncLocalStorageDriver());
  });

  it('should append and load events via injected storage driver', () => {
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
      {
        type: 'TASK_UPDATED',
        timestamp: '2025-08-15T10:01:00.000Z',
        payload: {
          id: 'task-1',
          changes: { title: 'Updated task' },
        },
      },
    ];

    // Append events
    events.forEach(event => appendEvent(event));

    // Load events
    const loadedEvents = loadEvents();
    expect(loadedEvents).toHaveLength(2);
    expect(loadedEvents[0]?.type).toBe('TASK_CREATED');
    expect(loadedEvents[1]?.type).toBe('TASK_UPDATED');

    // Verify task creation payload
    const createEvent = loadedEvents[0];
    if (createEvent?.type === 'TASK_CREATED') {
      expect(createEvent.payload.id).toBe('task-1');
      expect(createEvent.payload.title).toBe('Test task');
    }
  });

  it('should isolate storage by namespace', () => {
    // Configure test namespace
    configureStorage('isolated', mockDriver);

    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'task-1',
        title: 'Isolated task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    appendEvent(event);

    // Event should be stored in isolated namespace
    const rawData = mockDriver.getItem('isolated:spark.events.v1');
    expect(rawData).toContain('Isolated task');

    // Should not interfere with default namespace
    const defaultData = mockDriver.getItem('spark:spark.events.v1');
    expect(defaultData).toBeNull();
  });

  it('should handle snapshot and restore operations', () => {
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Task for snapshot',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
    ];

    // Add events
    events.forEach(event => appendEvent(event));

    // Snapshot events
    const snapshot = snapshotEvents();
    expect(snapshot).toContain('Task for snapshot');

    // Clear events
    restoreEvents('');
    expect(loadEvents()).toHaveLength(0);

    // Restore from snapshot
    restoreEvents(snapshot);
    const restoredEvents = loadEvents();
    expect(restoredEvents).toHaveLength(1);

    // Verify restored event
    const restoredEvent = restoredEvents[0];
    if (restoredEvent?.type === 'TASK_CREATED') {
      expect(restoredEvent.payload.title).toBe('Task for snapshot');
    }
  });

  it('should work without global localStorage dependency', () => {
    // This test verifies that the eventlog works purely through the injected driver
    // without touching global localStorage

    const initialLocalStorageLength = localStorage.length;

    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'mock-task',
        title: 'Mock storage task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    appendEvent(event);
    const events = loadEvents();

    expect(events).toHaveLength(1);

    // Verify event with proper type guard
    const mockEvent = events[0];
    if (mockEvent?.type === 'TASK_CREATED') {
      expect(mockEvent.payload.title).toBe('Mock storage task');
    }

    // Verify localStorage wasn't touched
    expect(localStorage.length).toBe(initialLocalStorageLength);

    // Verify data is in mock storage
    expect(mockDriver.getItem('test:spark.events.v1')).toContain(
      'Mock storage task'
    );
  });
});
