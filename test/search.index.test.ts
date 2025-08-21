import { describe, it, expect, beforeEach } from 'vitest';
import { createSearchIndex } from '../src/domain/search/index';
import type { Task } from '../src/domain/task/schema';
import type { TaskEvent } from '../src/domain/task/events';

describe('InMemorySearchIndex', () => {
  let searchIndex: ReturnType<typeof createSearchIndex>;
  let sampleTasks: Task[];

  beforeEach(() => {
    searchIndex = createSearchIndex();

    sampleTasks = [
      {
        id: 'task-1',
        title: 'Fix authentication bug',
        notes: 'The login system is failing for some users',
        status: 'TODAY',
        priority: 'P0',
        tags: ['bug', 'auth', 'critical'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: 'task-2',
        title: 'Implement user dashboard',
        notes: 'Create a new dashboard with charts and analytics',
        status: 'LATER',
        priority: 'P1',
        tags: ['feature', 'ui', 'dashboard'],
        createdAt: '2024-01-02T11:00:00Z',
        updatedAt: '2024-01-02T11:30:00Z',
      },
      {
        id: 'task-3',
        title: 'Write unit tests for API',
        notes: 'Add comprehensive test coverage for all endpoints',
        status: 'DONE',
        priority: 'P2',
        tags: ['testing', 'api'],
        createdAt: '2024-01-03T09:00:00Z',
        updatedAt: '2024-01-03T15:00:00Z',
      },
      {
        id: 'task-4',
        title: 'Review authentication middleware',
        notes: 'Security audit of auth components',
        status: 'TODAY',
        priority: 'P0',
        tags: ['security', 'auth', 'review'],
        createdAt: '2024-01-04T14:00:00Z',
        updatedAt: '2024-01-04T14:00:00Z',
      },
    ];
  });

  describe('build', () => {
    it('should build index from task list', () => {
      searchIndex.build(sampleTasks);

      const result = searchIndex.search({ q: 'authentication' });
      expect(result.total).toBe(2);
      expect(result.items.map(t => t.id)).toEqual(['task-1', 'task-4']);
    });

    it('should handle empty task list', () => {
      searchIndex.build([]);

      const result = searchIndex.search({ q: 'test' });
      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('search - text matching', () => {
    beforeEach(() => {
      searchIndex.build(sampleTasks);
    });

    it('should find tasks by title text', () => {
      const result = searchIndex.search({ q: 'dashboard' });
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('task-2');
    });

    it('should find tasks by notes text', () => {
      const result = searchIndex.search({ q: 'endpoints' });
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('task-3');
    });

    it('should find tasks by tags', () => {
      const result = searchIndex.search({ q: 'testing' });
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('task-3');
    });

    it('should handle case insensitive search', () => {
      const result = searchIndex.search({ q: 'AUTHENTICATION' });
      expect(result.total).toBe(2);
    });

    it('should handle partial word matches', () => {
      const result = searchIndex.search({ q: 'auth' });
      expect(result.total).toBe(2);
      expect(result.items.map(t => t.id).sort()).toEqual(['task-1', 'task-4']);
    });

    it('should handle phrase queries', () => {
      const result = searchIndex.search({ q: '"user dashboard"' });
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('task-2');
    });

    it('should return empty results for non-matching queries', () => {
      const result = searchIndex.search({ q: 'nonexistent' });
      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });

    it('should ignore queries shorter than 2 characters', () => {
      const result = searchIndex.search({ q: 'a' });
      expect(result.total).toBe(0);
    });
  });

  describe('search - field boosts', () => {
    beforeEach(() => {
      searchIndex.build([
        {
          id: 'task-title',
          title: 'boost test',
          notes: 'other content',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: 'task-tags',
          title: 'other title',
          notes: 'other content',
          status: 'TODAY',
          priority: 'P1',
          tags: ['boost', 'test'],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: 'task-notes',
          title: 'other title',
          notes: 'boost test in notes',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
      ]);
    });

    it('should rank title matches higher than tag matches', () => {
      const result = searchIndex.search({ q: 'boost test' });
      expect(result.total).toBe(3);
      expect(result.items[0].id).toBe('task-title'); // title boost = 3
      expect(result.items[1].id).toBe('task-tags'); // tags boost = 2
      expect(result.items[2].id).toBe('task-notes'); // notes boost = 1
    });

    it('should rank tag matches higher than notes matches', () => {
      const result = searchIndex.search({ q: 'test' });
      expect(result.total).toBe(3);
      // Title should still be first, then tags, then notes
      expect(result.items[0].id).toBe('task-title');
      expect(result.items[1].id).toBe('task-tags');
      expect(result.items[2].id).toBe('task-notes');
    });
  });

  describe('search - filters', () => {
    beforeEach(() => {
      searchIndex.build(sampleTasks);
    });

    it('should filter by status', () => {
      const result = searchIndex.search({ status: ['TODAY'] });
      expect(result.total).toBe(2);
      expect(result.items.every(task => task.status === 'TODAY')).toBe(true);
    });

    it('should filter by multiple statuses', () => {
      const result = searchIndex.search({ status: ['TODAY', 'DONE'] });
      expect(result.total).toBe(3);
    });

    it('should filter by priority', () => {
      const result = searchIndex.search({ priority: ['P0'] });
      expect(result.total).toBe(2);
      expect(result.items.every(task => task.priority === 'P0')).toBe(true);
    });

    it('should filter by tags', () => {
      const result = searchIndex.search({ tags: ['auth'] });
      expect(result.total).toBe(2);
      expect(result.items.map(t => t.id).sort()).toEqual(['task-1', 'task-4']);
    });

    it('should combine text query with filters', () => {
      const result = searchIndex.search({
        q: 'auth',
        status: ['TODAY'],
      });
      expect(result.total).toBe(2);
      expect(result.items.every(task => task.status === 'TODAY')).toBe(true);
    });

    it('should return empty results when filters match nothing', () => {
      const result = searchIndex.search({ status: ['ARCHIVED'] });
      expect(result.total).toBe(0);
    });
  });

  describe('search - facets', () => {
    beforeEach(() => {
      searchIndex.build(sampleTasks);
    });

    it('should return status facets', () => {
      const result = searchIndex.search({ q: '' });
      expect(result.facets).toBeDefined();
      expect(result.facets!.status).toEqual({
        TODAY: 2,
        LATER: 1,
        DONE: 1,
      });
    });

    it('should return priority facets', () => {
      const result = searchIndex.search({ q: '' });
      expect(result.facets!.priority).toEqual({
        P0: 2,
        P1: 1,
        P2: 1,
      });
    });

    it('should return tag facets', () => {
      const result = searchIndex.search({ q: '' });
      expect(result.facets!.tags).toEqual({
        auth: 2,
        bug: 1,
        critical: 1,
        feature: 1,
        ui: 1,
        dashboard: 1,
        testing: 1,
        api: 1,
        security: 1,
        review: 1,
      });
    });

    it('should update facets based on search query', () => {
      const result = searchIndex.search({ q: 'auth' });
      expect(result.facets!.status).toEqual({
        TODAY: 2,
      });
      expect(result.facets!.priority).toEqual({
        P0: 2,
      });
    });
  });

  describe('search - pagination', () => {
    beforeEach(() => {
      // Create more tasks for pagination testing
      const manyTasks = Array.from({ length: 25 }, (_, i) => ({
        id: `task-${i + 1}`,
        title: `Task ${i + 1} with search term`,
        notes: 'Notes content',
        status: 'TODAY' as const,
        priority: 'P1' as const,
        tags: [],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      }));
      searchIndex.build(manyTasks);
    });

    it('should respect limit parameter', () => {
      const result = searchIndex.search({ q: 'search', limit: 5 });
      expect(result.items.length).toBe(5);
      expect(result.total).toBe(25);
    });

    it('should respect offset parameter', () => {
      const result = searchIndex.search({ q: 'search', limit: 5, offset: 10 });
      expect(result.items.length).toBe(5);
      // Tasks are sorted by compareTasks function (priority, dueDate, createdAt, id)
      // Since all have same priority/dates, they sort lexicographically by id
      // So: task-1, task-10, task-11, task-12, ..., task-19, task-2, task-20, ...
      expect(result.items[0]!.id).toBe('task-19');
    });

    it('should handle offset beyond total results', () => {
      const result = searchIndex.search({ q: 'search', offset: 30 });
      expect(result.items.length).toBe(0);
      expect(result.total).toBe(25);
    });

    it('should use default limit when not specified', () => {
      const result = searchIndex.search({ q: 'search' });
      expect(result.items.length).toBe(20); // default limit
      expect(result.total).toBe(25);
    });
  });

  describe('updateFromEvent', () => {
    beforeEach(() => {
      searchIndex.build(sampleTasks);
    });

    it('should add new task to index', () => {
      const event: TaskEvent = {
        type: 'TASK_CREATED',
        timestamp: '2024-01-05T10:00:00Z',
        payload: {
          id: 'new-task',
          title: 'New searchable task',
          notes: 'Fresh content',
          status: 'TODAY',
          priority: 'P1',
          tags: ['new'],
        },
      };

      searchIndex.updateFromEvent(event);

      const result = searchIndex.search({ q: 'searchable' });
      expect(result.total).toBe(1);
      expect(result.items[0]!.id).toBe('new-task');
    });

    it('should update existing task in index', () => {
      const event: TaskEvent = {
        type: 'TASK_UPDATED',
        timestamp: '2024-01-05T10:00:00Z',
        payload: {
          id: 'task-1',
          changes: {
            title: 'Updated searchable title',
            tags: ['updated', 'modified'],
          },
        },
      };

      searchIndex.updateFromEvent(event);

      const result = searchIndex.search({ q: 'searchable' });
      expect(result.total).toBe(1);
      expect(result.items[0]!.title).toBe('Updated searchable title');

      // Old content should no longer match
      const oldResult = searchIndex.search({ q: 'authentication' });
      expect(oldResult.items.find(t => t.id === 'task-1')).toBeUndefined();
    });

    it('should handle task completion', () => {
      const event: TaskEvent = {
        type: 'TASK_COMPLETED',
        timestamp: '2024-01-05T10:00:00Z',
        payload: { id: 'task-1' },
      };

      searchIndex.updateFromEvent(event);

      const result = searchIndex.search({ status: ['DONE'] });
      expect(result.items.find(t => t.id === 'task-1')).toBeDefined();
    });

    it('should handle task moves', () => {
      const event: TaskEvent = {
        type: 'TASK_MOVED',
        timestamp: '2024-01-05T10:00:00Z',
        payload: {
          id: 'task-1',
          fromStatus: 'TODAY',
          toStatus: 'LATER',
        },
      };

      searchIndex.updateFromEvent(event);

      const result = searchIndex.search({ status: ['LATER'] });
      expect(result.items.find(t => t.id === 'task-1')).toBeDefined();
    });

    it('should handle task snoozing', () => {
      const event: TaskEvent = {
        type: 'TASK_SNOOZED',
        timestamp: '2024-01-05T10:00:00Z',
        payload: { id: 'task-1', snoozeUntil: '2024-01-10T10:00:00Z' },
      };

      searchIndex.updateFromEvent(event);

      const result = searchIndex.search({ q: 'authentication' });
      const task = result.items.find(t => t.id === 'task-1');
      expect(task?.snoozeUntil).toBe('2024-01-10T10:00:00Z');
    });

    it('should handle unknown task IDs gracefully', () => {
      const event: TaskEvent = {
        type: 'TASK_UPDATED',
        timestamp: '2024-01-05T10:00:00Z',
        payload: {
          id: 'unknown-task',
          changes: { title: 'This should not crash' },
        },
      };

      expect(() => {
        searchIndex.updateFromEvent(event);
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty search query', () => {
      searchIndex.build(sampleTasks);
      const result = searchIndex.search({ q: '' });
      expect(result.total).toBe(4);
      expect(result.items.length).toBe(4);
    });

    it('should handle missing optional fields', () => {
      const taskWithMissingFields: Task = {
        id: 'minimal-task',
        title: 'Minimal task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z',
      };

      searchIndex.build([taskWithMissingFields]);
      const result = searchIndex.search({ q: 'minimal' });
      expect(result.total).toBe(1);
    });

    it('should handle special characters in search query', () => {
      searchIndex.build(sampleTasks);
      const result = searchIndex.search({ q: '@#$%^&*()' });
      expect(result.total).toBe(0);
    });

    it('should handle very long search queries', () => {
      searchIndex.build(sampleTasks);
      const longQuery = 'a'.repeat(1000);
      const result = searchIndex.search({ q: longQuery });
      expect(result.total).toBe(0);
    });
  });
});
