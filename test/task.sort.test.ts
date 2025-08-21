import { describe, it, expect } from 'vitest';
import { compareTasks } from '../src/domain/task/sort';
import type { Task } from '../src/domain/task/schema';

describe('Task Sorting', () => {
  const createTask = (overrides: Partial<Task>): Task => ({
    id: 'test-id',
    title: 'Test Task',
    status: 'TODAY',
    priority: 'P1',
    tags: [],
    createdAt: '2025-08-15T10:00:00.000Z',
    updatedAt: '2025-08-15T10:00:00.000Z',
    ...overrides,
  });

  describe('Priority sorting', () => {
    it('should sort P0 before P1', () => {
      const taskP0 = createTask({ priority: 'P0' });
      const taskP1 = createTask({ priority: 'P1' });
      expect(compareTasks(taskP0, taskP1)).toBeLessThan(0);
      expect(compareTasks(taskP1, taskP0)).toBeGreaterThan(0);
    });

    it('should sort P1 before P2', () => {
      const taskP1 = createTask({ priority: 'P1' });
      const taskP2 = createTask({ priority: 'P2' });
      expect(compareTasks(taskP1, taskP2)).toBeLessThan(0);
      expect(compareTasks(taskP2, taskP1)).toBeGreaterThan(0);
    });

    it('should sort P0 before P2', () => {
      const taskP0 = createTask({ priority: 'P0' });
      const taskP2 = createTask({ priority: 'P2' });
      expect(compareTasks(taskP0, taskP2)).toBeLessThan(0);
      expect(compareTasks(taskP2, taskP0)).toBeGreaterThan(0);
    });
  });

  describe('Due date sorting (same priority)', () => {
    it('should sort earlier due date first', () => {
      const earlyTask = createTask({
        priority: 'P1',
        dueDate: '2025-08-15T10:00:00.000Z',
      });
      const lateTask = createTask({
        priority: 'P1',
        dueDate: '2025-08-16T10:00:00.000Z',
      });
      expect(compareTasks(earlyTask, lateTask)).toBeLessThan(0);
      expect(compareTasks(lateTask, earlyTask)).toBeGreaterThan(0);
    });

    it('should sort tasks with due dates before tasks without', () => {
      const withDue = createTask({
        priority: 'P1',
        dueDate: '2025-08-16T10:00:00.000Z',
      });
      const withoutDue = createTask({ priority: 'P1' });
      expect(compareTasks(withDue, withoutDue)).toBeLessThan(0);
      expect(compareTasks(withoutDue, withDue)).toBeGreaterThan(0);
    });
  });

  describe('Created date sorting (same priority, same due date)', () => {
    it('should sort by created date ascending', () => {
      const earlier = createTask({
        priority: 'P1',
        createdAt: '2025-08-15T09:00:00.000Z',
      });
      const later = createTask({
        priority: 'P1',
        createdAt: '2025-08-15T11:00:00.000Z',
      });
      expect(compareTasks(earlier, later)).toBeLessThan(0);
      expect(compareTasks(later, earlier)).toBeGreaterThan(0);
    });
  });

  describe('Complex sorting scenarios', () => {
    it('should sort by priority first, ignoring due date', () => {
      const p0NoDue = createTask({ priority: 'P0' });
      const p1WithDue = createTask({
        priority: 'P1',
        dueDate: '2025-08-15T10:00:00.000Z',
      });
      expect(compareTasks(p0NoDue, p1WithDue)).toBeLessThan(0);
    });

    it('should handle multiple tasks with proper ordering', () => {
      const tasks = [
        createTask({
          id: '1',
          priority: 'P1',
          dueDate: '2025-08-16T10:00:00.000Z',
          createdAt: '2025-08-15T10:00:00.000Z',
        }),
        createTask({
          id: '2',
          priority: 'P0',
          createdAt: '2025-08-15T11:00:00.000Z',
        }),
        createTask({
          id: '3',
          priority: 'P1',
          dueDate: '2025-08-15T10:00:00.000Z',
          createdAt: '2025-08-15T09:00:00.000Z',
        }),
        createTask({
          id: '4',
          priority: 'P2',
          dueDate: '2025-08-14T10:00:00.000Z',
          createdAt: '2025-08-15T08:00:00.000Z',
        }),
      ];

      const sorted = tasks.sort(compareTasks);
      expect(sorted.map(t => t.id)).toEqual(['2', '3', '1', '4']);
    });
  });
});
