import { describe, it, expect } from 'vitest';
import { isToday, isLater, isDone } from '../src/domain/task/lanes';
import type { Task } from '../src/domain/task/schema';

describe('Task Lanes', () => {
  const baseTask: Task = {
    id: 'test-1',
    title: 'Test Task',
    status: 'TODAY',
    priority: 'P1',
    tags: [],
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: '2025-08-15T09:00:00.000Z',
  };

  describe('isToday', () => {
    it('should return true for TODAY status', () => {
      const task = { ...baseTask, status: 'TODAY' as const };
      expect(isToday(task)).toBe(true);
    });

    it('should return true for LATER with past due date and no snooze', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-14T10:00:00.000Z', // yesterday
      };
      expect(isToday(task)).toBe(true);
    });

    it('should return true for LATER with today due date and no snooze', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-15T10:00:00.000Z', // today
      };
      expect(isToday(task)).toBe(true);
    });

    it('should return false for LATER with future due date', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-16T10:00:00.000Z', // tomorrow
      };
      expect(isToday(task)).toBe(false);
    });

    it('should return false for LATER with past due date but active snooze', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-14T10:00:00.000Z', // yesterday
        snoozeUntil: '2025-08-16T10:00:00.000Z', // snoozed until tomorrow
      };
      expect(isToday(task)).toBe(false);
    });

    it('should return true for LATER with past due date and expired snooze', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-14T10:00:00.000Z', // yesterday
        snoozeUntil: '2025-08-14T10:00:00.000Z', // snooze expired yesterday
      };
      expect(isToday(task)).toBe(true);
    });

    it('should return false for DONE status', () => {
      const task = { ...baseTask, status: 'DONE' as const };
      expect(isToday(task)).toBe(false);
    });

    it('should return false for ARCHIVED status', () => {
      const task = { ...baseTask, status: 'ARCHIVED' as const };
      expect(isToday(task)).toBe(false);
    });
  });

  describe('isLater', () => {
    it('should return false for TODAY status', () => {
      const task = { ...baseTask, status: 'TODAY' as const };
      expect(isLater(task)).toBe(false);
    });

    it('should return true for LATER with no due date', () => {
      const task = { ...baseTask, status: 'LATER' as const };
      expect(isLater(task)).toBe(true);
    });

    it('should return true for LATER with future due date', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-16T10:00:00.000Z', // tomorrow
      };
      expect(isLater(task)).toBe(true);
    });

    it('should return false for LATER with past due date', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-14T10:00:00.000Z', // yesterday
      };
      expect(isLater(task)).toBe(false);
    });

    it('should return true for LATER with active snooze', () => {
      const task = {
        ...baseTask,
        status: 'LATER' as const,
        dueDate: '2025-08-14T10:00:00.000Z', // yesterday
        snoozeUntil: '2025-08-16T10:00:00.000Z', // snoozed until tomorrow
      };
      expect(isLater(task)).toBe(true);
    });

    it('should return false for DONE status', () => {
      const task = { ...baseTask, status: 'DONE' as const };
      expect(isLater(task)).toBe(false);
    });

    it('should return false for ARCHIVED status', () => {
      const task = { ...baseTask, status: 'ARCHIVED' as const };
      expect(isLater(task)).toBe(false);
    });
  });

  describe('isDone', () => {
    it('should return true for DONE status', () => {
      const task = { ...baseTask, status: 'DONE' as const };
      expect(isDone(task)).toBe(true);
    });

    it('should return false for TODAY status', () => {
      const task = { ...baseTask, status: 'TODAY' as const };
      expect(isDone(task)).toBe(false);
    });

    it('should return false for LATER status', () => {
      const task = { ...baseTask, status: 'LATER' as const };
      expect(isDone(task)).toBe(false);
    });

    it('should return false for ARCHIVED status', () => {
      const task = { ...baseTask, status: 'ARCHIVED' as const };
      expect(isDone(task)).toBe(false);
    });
  });
});
