import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTaskStore } from '../src/stores/taskStore';
import type { TaskEvent } from '../src/domain/task/events';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('Task Hydration', () => {
  beforeEach(() => {
    // Clear store state
    useTaskStore.setState({ byId: {} });
    // Clear localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should enforce createdAt <= updatedAt invariant during hydration', () => {
    // Setup events directly in localStorage
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Test Task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_UPDATED',
        timestamp: '2025-08-15T09:00:00.000Z', // Invalid: earlier than created
        payload: {
          id: 'task-1',
          changes: { title: 'Updated Task' },
        },
      },
    ];

    const eventsData = events.map(e => JSON.stringify(e)).join('\n');
    localStorageMock.getItem.mockReturnValue(eventsData);

    const store = useTaskStore.getState();
    store.hydrate();

    const updatedStore = useTaskStore.getState();
    const task = updatedStore.byId['task-1'];
    
    expect(task).toBeDefined();
    expect(new Date(task!.createdAt).getTime()).toBeLessThanOrEqual(new Date(task!.updatedAt).getTime());
    expect(task!.updatedAt).toBe(task!.createdAt); // Should be corrected
  });

  it('should ensure DONE tasks have updatedAt set during hydration', () => {
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Test Task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_COMPLETED',
        timestamp: '2025-08-15T11:00:00.000Z',
        payload: {
          id: 'task-1',
        },
      },
    ];

    const eventsData = events.map(e => JSON.stringify(e)).join('\n');
    localStorageMock.getItem.mockReturnValue(eventsData);

    const store = useTaskStore.getState();
    store.hydrate();

    const updatedStore = useTaskStore.getState();
    const task = updatedStore.byId['task-1'];
    
    expect(task).toBeDefined();
    expect(task!.status).toBe('DONE');
    expect(task!.updatedAt).toBe('2025-08-15T11:00:00.000Z');
  });

  it('should be idempotent - repeated hydration should not change state', () => {
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Test Task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_COMPLETED',
        timestamp: '2025-08-15T11:00:00.000Z',
        payload: {
          id: 'task-1',
        },
      },
    ];

    const eventsData = events.map(e => JSON.stringify(e)).join('\n');
    localStorageMock.getItem.mockReturnValue(eventsData);

    const store = useTaskStore.getState();
    
    // First hydration
    store.hydrate();
    const firstState = useTaskStore.getState();
    
    // Second hydration
    store.hydrate();
    const secondState = useTaskStore.getState();
    
    expect(firstState.byId).toEqual(secondState.byId);
  });

  it('should handle multiple tasks with various event types during hydration', () => {
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Task 1',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:30:00.000Z',
        payload: {
          id: 'task-2',
          title: 'Task 2',
          status: 'LATER',
          priority: 'P0',
          tags: [],
        },
      },
      {
        type: 'TASK_UPDATED',
        timestamp: '2025-08-15T11:00:00.000Z',
        payload: {
          id: 'task-1',
          changes: { title: 'Updated Task 1' },
        },
      },
      {
        type: 'TASK_MOVED',
        timestamp: '2025-08-15T11:30:00.000Z',
        payload: {
          id: 'task-2',
          fromStatus: 'LATER',
          toStatus: 'TODAY',
        },
      },
      {
        type: 'TASK_COMPLETED',
        timestamp: '2025-08-15T12:00:00.000Z',
        payload: {
          id: 'task-1',
        },
      },
    ];

    const eventsData = events.map(e => JSON.stringify(e)).join('\n');
    localStorageMock.getItem.mockReturnValue(eventsData);

    const store = useTaskStore.getState();
    store.hydrate();

    const updatedStore = useTaskStore.getState();
    
    expect(Object.keys(updatedStore.byId)).toHaveLength(2);
    
    const task1 = updatedStore.byId['task-1'];
    const task2 = updatedStore.byId['task-2'];
    
    expect(task1!.title).toBe('Updated Task 1');
    expect(task1!.status).toBe('DONE');
    expect(task1!.updatedAt).toBe('2025-08-15T12:00:00.000Z');
    
    expect(task2!.title).toBe('Task 2');
    expect(task2!.status).toBe('TODAY');
    expect(task2!.priority).toBe('P0');
    expect(task2!.updatedAt).toBe('2025-08-15T11:30:00.000Z');
  });
});
