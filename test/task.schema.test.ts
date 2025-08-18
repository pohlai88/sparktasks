import { describe, it, expect } from 'vitest';
import { TaskSchema, CreateTaskInputSchema } from '../src/domain/task/schema';

describe('TaskSchema', () => {
  it('should validate a complete task', () => {
    const validTask = {
      id: 'task-123',
      title: 'Test task',
      status: 'TODAY',
      priority: 'P1',
      tags: ['work'],
      createdAt: '2025-08-15T10:00:00.000Z',
      updatedAt: '2025-08-15T10:00:00.000Z',
    };

    expect(() => TaskSchema.parse(validTask)).not.toThrow();
  });

  it('should reject invalid status', () => {
    const invalidTask = {
      id: 'task-123',
      title: 'Test task',
      status: 'INVALID',
      priority: 'P1',
      tags: [],
      createdAt: '2025-08-15T10:00:00.000Z',
      updatedAt: '2025-08-15T10:00:00.000Z',
    };

    expect(() => TaskSchema.parse(invalidTask)).toThrow();
  });

  it('should validate CreateTaskInputSchema', () => {
    const validInput = {
      title: 'New task',
      status: 'TODAY',
      priority: 'P2',
      tags: ['personal'],
    };

    expect(() => CreateTaskInputSchema.parse(validInput)).not.toThrow();
  });
});
