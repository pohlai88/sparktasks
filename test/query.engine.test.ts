import { describe, it, expect } from 'vitest';
import { runQuery } from '../src/domain/query/engine';
import type { Task } from '../src/domain/task/schema';

describe('Query Engine', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Fix urgent bug',
      status: 'TODAY',
      priority: 'P0',
      tags: ['urgent', 'bug'],
      dueDate: '2025-08-16T10:00:00.000Z',
      createdAt: '2025-08-15T09:00:00.000Z',
      updatedAt: '2025-08-15T09:00:00.000Z',
    },
    {
      id: '2',
      title: 'Write documentation',
      status: 'LATER',
      priority: 'P1',
      tags: ['docs'],
      dueDate: '2025-08-20T10:00:00.000Z',
      createdAt: '2025-08-15T08:00:00.000Z',
      updatedAt: '2025-08-15T08:00:00.000Z',
    },
    {
      id: '3',
      title: 'Review code',
      status: 'DONE',
      priority: 'P1',
      tags: ['review'],
      createdAt: '2025-08-14T10:00:00.000Z',
      updatedAt: '2025-08-15T11:00:00.000Z',
    },
    {
      id: '4',
      title: 'Update dependencies',
      status: 'TODAY',
      priority: 'P2',
      tags: ['maintenance'],
      snoozeUntil: '2025-08-15T14:00:00.000Z',
      createdAt: '2025-08-15T07:00:00.000Z',
      updatedAt: '2025-08-15T07:00:00.000Z',
    },
    {
      id: '5',
      title: 'Old completed task',
      status: 'DONE',
      priority: 'P1',
      tags: ['old'],
      createdAt: '2025-08-13T10:00:00.000Z',
      updatedAt: '2025-08-14T10:00:00.000Z',
    },
  ];

  describe('Text filtering', () => {
    it('should filter by title text', () => {
      const result = runQuery(mockTasks, { text: 'bug' });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });

    it('should filter by tag text', () => {
      const result = runQuery(mockTasks, { text: 'docs' });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Write documentation');
    });

    it('should be case-insensitive', () => {
      const result = runQuery(mockTasks, { text: 'URGENT' });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });

    it('should return empty for no matches', () => {
      const result = runQuery(mockTasks, { text: 'nonexistent' });
      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('Tags filtering', () => {
    it('should filter by single tag', () => {
      const result = runQuery(mockTasks, { tags: ['urgent'] });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });

    it('should require ALL tags', () => {
      const result = runQuery(mockTasks, { tags: ['urgent', 'bug'] });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });

    it('should return empty when not all tags match', () => {
      const result = runQuery(mockTasks, { tags: ['urgent', 'nonexistent'] });
      expect(result.total).toBe(0);
    });

    it('should handle case-insensitive tag matching', () => {
      const result = runQuery(mockTasks, { tags: ['URGENT', 'BUG'] });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });
  });

  describe('Status filtering', () => {
    it('should filter by single status', () => {
      const result = runQuery(mockTasks, { status: ['DONE'] });
      expect(result.total).toBe(2);
      expect(result.items.every(t => t.status === 'DONE')).toBe(true);
    });

    it('should filter by multiple statuses', () => {
      const result = runQuery(mockTasks, { status: ['TODAY', 'LATER'] });
      expect(result.total).toBe(3);
      expect(
        result.items.every(t => t.status === 'TODAY' || t.status === 'LATER')
      ).toBe(true);
    });

    it('should hide ARCHIVED tasks by default', () => {
      // Add an ARCHIVED task to the mock data
      const tasksWithArchived = [
        ...mockTasks,
        {
          id: 'archived-1',
          title: 'Archived task',
          status: 'ARCHIVED' as const,
          priority: 'P2' as const,
          tags: [],
          createdAt: '2025-08-15T10:00:00.000Z',
          updatedAt: '2025-08-15T10:00:00.000Z',
        },
      ];

      // Default query should not include ARCHIVED
      const result = runQuery(tasksWithArchived, {});
      expect(result.total).toBe(5); // Should be same as original mockTasks
      expect(result.items.every(t => t.status !== 'ARCHIVED')).toBe(true);
    });

    it('should show ARCHIVED tasks when explicitly requested', () => {
      // Add an ARCHIVED task to the mock data
      const tasksWithArchived = [
        ...mockTasks,
        {
          id: 'archived-1',
          title: 'Archived task',
          status: 'ARCHIVED' as const,
          priority: 'P2' as const,
          tags: [],
          createdAt: '2025-08-15T10:00:00.000Z',
          updatedAt: '2025-08-15T10:00:00.000Z',
        },
      ];

      // Explicit query for ARCHIVED should include them
      const result = runQuery(tasksWithArchived, { status: ['ARCHIVED'] });
      expect(result.total).toBe(1);
      expect(result.items[0]!.status).toBe('ARCHIVED');
    });
  });

  describe('Priority filtering', () => {
    it('should filter by single priority', () => {
      const result = runQuery(mockTasks, { priority: ['P0'] });
      expect(result.total).toBe(1);
      expect(result.items[0]!.priority).toBe('P0');
    });

    it('should filter by multiple priorities', () => {
      const result = runQuery(mockTasks, { priority: ['P0', 'P1'] });
      expect(result.total).toBe(4);
      expect(
        result.items.every(t => t.priority === 'P0' || t.priority === 'P1')
      ).toBe(true);
    });
  });

  describe('Due date filtering', () => {
    it('should filter by due date range', () => {
      const result = runQuery(mockTasks, {
        dueFrom: '2025-08-15T00:00:00.000Z',
        dueTo: '2025-08-18T00:00:00.000Z',
      });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });

    it('should filter by due from only', () => {
      const result = runQuery(mockTasks, {
        dueFrom: '2025-08-19T00:00:00.000Z',
      });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Write documentation');
    });

    it('should exclude tasks without due date', () => {
      const result = runQuery(mockTasks, {
        dueFrom: '2025-08-01T00:00:00.000Z',
      });
      expect(result.total).toBe(2);
      expect(result.items.every(t => t.dueDate)).toBe(true);
    });
  });

  describe('Snooze filtering', () => {
    it('should filter active snooze (future)', () => {
      // Mock current time as before snooze expiry
      const result = runQuery(mockTasks, { snoozeActive: true });
      // This test depends on current time vs snooze time
      expect(result.items.every(t => t.snoozeUntil)).toBe(true);
    });

    it('should filter inactive snooze', () => {
      const result = runQuery(mockTasks, { snoozeActive: false });
      expect(
        result.items.every(
          t => !t.snoozeUntil || new Date(t.snoozeUntil) <= new Date()
        )
      ).toBe(true);
    });
  });

  describe('Created date filtering', () => {
    it('should filter by created date range', () => {
      const result = runQuery(mockTasks, {
        createdFrom: '2025-08-15T00:00:00.000Z',
        createdTo: '2025-08-15T23:59:59.999Z',
      });
      expect(result.total).toBe(3);
      expect(
        result.items.every(t => t.createdAt.startsWith('2025-08-15'))
      ).toBe(true);
    });
  });

  describe('Combined filtering', () => {
    it('should apply multiple filters', () => {
      const result = runQuery(mockTasks, {
        status: ['TODAY'],
        priority: ['P0', 'P1'],
        text: 'bug',
      });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Fix urgent bug');
    });
  });

  describe('Sorting', () => {
    it('should sort DONE tasks by updatedAt desc', () => {
      const result = runQuery(mockTasks, { status: ['DONE'] });
      expect(result.items[0]!.title).toBe('Review code'); // Updated later
      expect(result.items[1]!.title).toBe('Old completed task'); // Updated earlier
    });

    it('should use compareTasks for non-DONE tasks', () => {
      const result = runQuery(mockTasks, { status: ['TODAY'] });
      // Should be sorted by priority (P0 before P2), then other criteria
      expect(result.items[0]!.priority).toBe('P0');
    });
  });

  describe('Pagination', () => {
    it('should apply default pagination', () => {
      const result = runQuery(mockTasks, {});
      expect(result.total).toBe(5);
      expect(result.items.length).toBe(5); // All fit in default limit
    });

    it('should apply custom pagination', () => {
      const result = runQuery(mockTasks, {}, { offset: 1, limit: 2 });
      expect(result.total).toBe(5);
      expect(result.items.length).toBe(2);
    });

    it('should handle offset beyond total', () => {
      const result = runQuery(mockTasks, {}, { offset: 10, limit: 5 });
      expect(result.total).toBe(5);
      expect(result.items.length).toBe(0);
    });

    it('should handle limit larger than remaining items', () => {
      const result = runQuery(mockTasks, {}, { offset: 3, limit: 10 });
      expect(result.total).toBe(5);
      expect(result.items.length).toBe(2); // Only 2 items from offset 3
    });
  });
});
