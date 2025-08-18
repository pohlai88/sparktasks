import { describe, it, expect } from 'vitest';
import { reduce } from '../src/domain/task/eventlog';
import type { TaskEvent } from '../src/domain/task/events';

describe('Task Reducer', () => {
  it('should create a task from TASK_CREATED event', () => {
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'Test Task',
          status: 'TODAY',
          priority: 'P1',
          tags: ['work'],
        },
      },
    ];

    const result = reduce(events);

    expect(result['task-1']).toEqual({
      id: 'task-1',
      title: 'Test Task',
      status: 'TODAY',
      priority: 'P1',
      tags: ['work'],
      createdAt: '2025-08-15T10:00:00.000Z',
      updatedAt: '2025-08-15T10:00:00.000Z',
    });
  });

  it('should apply sequence of events correctly', () => {
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
        timestamp: '2025-08-15T11:00:00.000Z',
        payload: {
          id: 'task-1',
          changes: { title: 'Updated Task' },
        },
      },
    ];

    const result = reduce(events);

    expect(result['task-1']?.title).toBe('Updated Task');
    expect(result['task-1']?.updatedAt).toBe('2025-08-15T11:00:00.000Z');
  });
});
