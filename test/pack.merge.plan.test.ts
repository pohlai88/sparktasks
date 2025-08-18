import { describe, expect, it } from 'vitest';
import { planMerge } from '../src/domain/pack/merge';
import type { Task } from '../src/domain/task/schema';
import type { TaskEvent } from '../src/domain/task/events';

describe('pack merge planning', () => {
  const existingTask: Task = {
    id: 'existing-1',
    title: 'Existing Task',
    status: 'TODAY',
    priority: 'P1',
    tags: ['work'],
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
  };

  const newTaskEvent: TaskEvent = {
    type: 'TASK_CREATED',
    timestamp: '2024-01-02T10:00:00.000Z',
    payload: {
      id: 'new-task-1',
      title: 'New Task',
      status: 'TODAY',
      priority: 'P1',
      tags: ['personal'],
    },
  };

  const conflictingTaskEvent: TaskEvent = {
    type: 'TASK_CREATED',
    timestamp: '2024-01-02T11:00:00.000Z',
    payload: {
      id: 'existing-1', // Same ID as existing task
      title: 'Conflicting Task',
      status: 'LATER',
      priority: 'P2',
      tags: ['conflict'],
    },
  };

  const updateEvent: TaskEvent = {
    type: 'TASK_UPDATED',
    timestamp: '2024-01-02T12:00:00.000Z',
    payload: {
      id: 'existing-1',
      changes: { title: 'Updated Title' },
    },
  };

  describe('skipExisting policy', () => {
    it('should skip conflicting events and include non-conflicting ones', () => {
      const events = [newTaskEvent, conflictingTaskEvent, updateEvent];
      const plan = planMerge([existingTask], events, 'skipExisting');

      expect(plan.policy).toBe('skipExisting');
      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]).toEqual({ taskId: 'existing-1', reason: 'id-conflict' });
      expect(plan.idMap).toEqual({});
      
      // Should include new task and update events, but skip conflicting create
      expect(plan.applyEvents).toHaveLength(2);
      expect(plan.applyEvents[0]).toEqual(newTaskEvent);
      expect(plan.applyEvents[1]).toEqual(updateEvent);
    });
  });

  describe('overwriteIfNewer policy', () => {
    it('should allow conflicting events to overwrite existing ones', () => {
      const events = [newTaskEvent, conflictingTaskEvent, updateEvent];
      const plan = planMerge([existingTask], events, 'overwriteIfNewer');

      expect(plan.policy).toBe('overwriteIfNewer');
      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]).toEqual({ taskId: 'existing-1', reason: 'id-conflict' });
      expect(plan.idMap).toEqual({});
      
      // Should include all events
      expect(plan.applyEvents).toHaveLength(3);
      expect(plan.applyEvents).toEqual(events);
    });
  });

  describe('remapIds policy', () => {
    it('should remap conflicting IDs and update subsequent events', () => {
      const events = [newTaskEvent, conflictingTaskEvent, updateEvent];
      const plan = planMerge([existingTask], events, 'remapIds');

      expect(plan.policy).toBe('remapIds');
      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]).toEqual({ taskId: 'existing-1', reason: 'id-conflict' });
      
      // Should have created a mapping for the conflicting ID
      expect(Object.keys(plan.idMap)).toContain('existing-1');
      const newId = plan.idMap['existing-1'];
      expect(newId).toMatch(/^imp_\d+_\d+$/);
      
      // Should include all events with IDs remapped
      expect(plan.applyEvents).toHaveLength(3);
      
      // First event (no conflict) should be unchanged
      expect(plan.applyEvents[0]).toEqual(newTaskEvent);
      
      // Second event should have remapped ID
      expect(plan.applyEvents[1]).toEqual({
        ...conflictingTaskEvent,
        payload: { ...conflictingTaskEvent.payload, id: newId },
      });
      
      // Third event should have remapped ID
      expect(plan.applyEvents[2]).toEqual({
        ...updateEvent,
        payload: { ...updateEvent.payload, id: newId },
      });
    });

    it('should handle complex event sequences with multiple conflicts', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'existing-1',
            title: 'Conflict 1',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'existing-1',
            changes: { title: 'Updated Conflict 1' },
          },
        },
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T12:00:00.000Z',
          payload: {
            id: 'task-2',
            title: 'No Conflict',
            status: 'LATER',
            priority: 'P2',
            tags: [],
          },
        },
        {
          type: 'TASK_MOVED',
          timestamp: '2024-01-02T13:00:00.000Z',
          payload: {
            id: 'existing-1',
            fromStatus: 'TODAY',
            toStatus: 'DONE',
          },
        },
      ];

      const plan = planMerge([existingTask], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(1);
      const newId = plan.idMap['existing-1'];
      expect(newId).toBeDefined();
      
      expect(plan.applyEvents).toHaveLength(4);
      
      // Check that all events for 'existing-1' got remapped to newId
      expect(plan.applyEvents[0]?.payload.id).toBe(newId);
      expect(plan.applyEvents[1]?.payload.id).toBe(newId);
      expect(plan.applyEvents[2]?.payload.id).toBe('task-2'); // No conflict
      expect(plan.applyEvents[3]?.payload.id).toBe(newId);
    });
  });

  describe('no conflicts', () => {
    it('should pass through all events when no conflicts exist', () => {
      const events = [newTaskEvent];
      const plan = planMerge([existingTask], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(0);
      expect(plan.idMap).toEqual({});
      expect(plan.applyEvents).toEqual(events);
    });
  });

  describe('empty workspace', () => {
    it('should pass through all events when workspace is empty', () => {
      const events = [newTaskEvent, conflictingTaskEvent, updateEvent];
      const plan = planMerge([], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(0);
      expect(plan.idMap).toEqual({});
      expect(plan.applyEvents).toEqual(events);
    });
  });
});
