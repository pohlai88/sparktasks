import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createTaskId,
  createId,
  serializeTask,
  deserializeTask,
  validateTask,
  validateTaskCreateInput,
  validateTaskUpdateInput,
  validateTaskSerialized,
  TaskSchema,
  type Task,
  type TaskSerialized,
} from '@shared/types';

describe('shared/types', () => {
  const fixedDate = new Date('2025-08-15T10:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Zod Schema Validation', () => {
    it('validates correct Task objects', () => {
      const validTask = {
        id: 'task_1723723200000_abc123def',
        title: 'Valid Task',
        description: 'Valid description',
        completed: false,
        createdAt: new Date('2025-08-15T10:00:00.000Z'),
        updatedAt: new Date('2025-08-15T10:00:00.000Z'),
      };

      expect(() => validateTask(validTask)).not.toThrow();
      const result = validateTask(validTask);
      expect(result).toEqual(validTask);
    });

    it('rejects invalid Task objects', () => {
      // Invalid ID format
      expect(() =>
        validateTask({
          id: 'invalid-id',
          title: 'Test',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ).toThrow('Invalid task ID format');

      // Empty title
      expect(() =>
        validateTask({
          id: 'task_1723723200000_abc123def',
          title: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ).toThrow('Title is required');

      // Title too long
      expect(() =>
        validateTask({
          id: 'task_1723723200000_abc123def',
          title: 'x'.repeat(201),
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ).toThrow('Title too long');
    });

    it('validates TaskCreateInput', () => {
      const validInput = {
        title: 'New Task',
        description: 'Task description',
        completed: false,
      };

      expect(() => validateTaskCreateInput(validInput)).not.toThrow();

      // Should reject with id field
      expect(() =>
        validateTaskCreateInput({
          ...validInput,
          id: 'task_123',
        })
      ).toThrow();
    });

    it('validates TaskUpdateInput with at-least-one constraint', () => {
      // Valid partial updates
      expect(() => validateTaskUpdateInput({ title: 'Updated' })).not.toThrow();
      expect(() => validateTaskUpdateInput({ completed: true })).not.toThrow();

      // Should reject empty update
      expect(() => validateTaskUpdateInput({})).toThrow(
        'At least one field must be provided for update'
      );
    });

    it('validates TaskSerialized with ISO date strings', () => {
      const validSerialized = {
        id: 'task_1723723200000_abc123def',
        title: 'Test Task',
        completed: false,
        createdAt: '2025-08-15T10:00:00.000Z',
        updatedAt: '2025-08-15T10:00:00.000Z',
      };

      expect(() => validateTaskSerialized(validSerialized)).not.toThrow();

      // Should reject Date objects instead of ISO strings
      expect(() =>
        validateTaskSerialized({
          ...validSerialized,
          createdAt: new Date(),
        })
      ).toThrow();
    });
  });

  describe('createId (generic)', () => {
    it('generates IDs with any prefix and expected format', () => {
      const taskId = createId('task');
      const userId = createId('user');
      const projectId = createId('project');

      expect(taskId).toMatch(/^task_\d+_[a-z0-9]{9}$/);
      expect(userId).toMatch(/^user_\d+_[a-z0-9]{9}$/);
      expect(projectId).toMatch(/^project_\d+_[a-z0-9]{9}$/);
    });

    it('generates IDs that pass Zod validation', () => {
      const taskId = createTaskId();
      expect(() => TaskSchema.shape.id.parse(taskId)).not.toThrow();
    });
  });

  describe('Task serialization with validation', () => {
    it('should work with global test helpers and validation', () => {
      const task = globalThis.testHelpers.task.create();
      const serialized = globalThis.testHelpers.task.createSerialized();

      // Verify they pass validation
      expect(() => validateTask(task)).not.toThrow();
      expect(() => validateTaskSerialized(serialized)).not.toThrow();

      // Verify they're in sync
      expect(serialized.id).toBe(task.id);
      expect(serialized.title).toBe(task.title);
      expect(serialized.createdAt).toBe(task.createdAt.toISOString());
    });

    const mockTask: Task = {
      id: 'task_123_abc123def',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      createdAt: new Date('2025-08-15T10:00:00.000Z'),
      updatedAt: new Date('2025-08-15T10:30:00.000Z'),
    };

    it('serializes Task to JSON-safe format with validation', () => {
      const serialized = serializeTask(mockTask);

      // Should pass serialized validation
      expect(() => validateTaskSerialized(serialized)).not.toThrow();

      expect(serialized).toEqual({
        id: 'task_123_abc123def',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        createdAt: '2025-08-15T10:00:00.000Z',
        updatedAt: '2025-08-15T10:30:00.000Z',
      });
    });

    it('deserializes TaskSerialized back to Task with validation', () => {
      const serialized: TaskSerialized = {
        id: 'task_123_abc123def',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        createdAt: '2025-08-15T10:00:00.000Z',
        updatedAt: '2025-08-15T10:30:00.000Z',
      };

      const task = deserializeTask(serialized);

      // Should pass Task validation
      expect(() => validateTask(task)).not.toThrow();

      expect(task.createdAt instanceof Date).toBe(true);
      expect(task.updatedAt instanceof Date).toBe(true);
    });
  });

  describe('Production API scenarios', () => {
    it('handles API input validation gracefully', () => {
      // Simulate malformed API input
      const malformedInput = {
        title: '', // Invalid: empty
        completed: 'yes', // Invalid: should be boolean
      };

      expect(() => validateTaskCreateInput(malformedInput)).toThrow();
    });

    it('validates storage deserialization safely', () => {
      // Simulate corrupted localStorage data
      const corruptedData = {
        id: 'invalid-format',
        title: null,
        completed: 'maybe',
      };

      expect(() => validateTask(corruptedData)).toThrow();
    });
  });
});
