import { describe, expect, it } from 'vitest';
import { planMerge } from '../src/domain/pack/merge';
import type { Task } from '../src/domain/task/schema';
import type { TaskEvent } from '../src/domain/task/events';

describe('pack merge hardening', () => {
  const existingTask: Task = {
    id: 'existing-1',
    title: 'Existing Task',
    status: 'TODAY',
    priority: 'P1',
    tags: ['work'],
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T12:00:00.000Z', // Last activity at 12:00
  };

  describe('monotonic timestamp validation', () => {
    it('should detect timestamp regression for same task', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'new-task-1',
            title: 'New Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T11:00:00.000Z', // Later timestamp - OK
          payload: {
            id: 'new-task-1',
            changes: { title: 'Updated Task' },
          },
        },
        {
          type: 'TASK_COMPLETED',
          timestamp: '2024-01-02T09:00:00.000Z', // Earlier timestamp - REGRESSION
          payload: {
            id: 'new-task-1',
          },
        },
      ];

      const plan = planMerge([], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]).toEqual({
        taskId: 'new-task-1',
        reason: 'timestamp-regression',
        details:
          'Event timestamp 2024-01-02T09:00:00.000Z <= last timestamp 2024-01-02T11:00:00.000Z',
      });

      // Should auto-adjust the timestamp
      expect(plan.applyEvents).toHaveLength(3);
      expect(plan.applyEvents[2]?.timestamp).not.toBe(
        '2024-01-02T09:00:00.000Z'
      );
      expect(
        new Date(plan.applyEvents[2]?.timestamp || '').getTime()
      ).toBeGreaterThan(new Date('2024-01-02T11:00:00.000Z').getTime());
    });

    it('should detect regression against existing task timestamps', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-01T11:00:00.000Z', // Before existing task's updatedAt
          payload: {
            id: 'existing-1',
            changes: { title: 'Updated Title' },
          },
        },
      ];

      const plan = planMerge([existingTask], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]).toEqual({
        taskId: 'existing-1',
        reason: 'timestamp-regression',
        details:
          'Event timestamp 2024-01-01T11:00:00.000Z <= last timestamp 2024-01-01T12:00:00.000Z',
      });
    });

    it('should skip regression events with skipExisting policy', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'new-task-1',
            title: 'New Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T09:00:00.000Z', // Earlier timestamp
          payload: {
            id: 'new-task-1',
            changes: { title: 'Updated Task' },
          },
        },
      ];

      const plan = planMerge([], events, 'skipExisting');

      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]?.reason).toBe('timestamp-regression');
      expect(plan.applyEvents).toHaveLength(1); // Only the first event
      expect(plan.applyEvents[0]?.type).toBe('TASK_CREATED');
    });

    it('should handle equal timestamps as regression', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'new-task-1',
            title: 'New Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T10:00:00.000Z', // Same timestamp
          payload: {
            id: 'new-task-1',
            changes: { title: 'Updated Task' },
          },
        },
      ];

      const plan = planMerge([], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]?.reason).toBe('timestamp-regression');
    });
  });

  describe('orphan event detection', () => {
    it('should detect orphan events with no prior TASK_CREATED', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_UPDATED', // No TASK_CREATED for this ID
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'orphan-task-1',
            changes: { title: 'Updated Orphan' },
          },
        },
        {
          type: 'TASK_COMPLETED', // Another orphan event
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'orphan-task-2',
          },
        },
      ];

      const plan = planMerge([], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(2);
      expect(plan.conflicts[0]).toEqual({
        taskId: 'orphan-task-1',
        reason: 'orphan-event',
        details:
          "Event references task 'orphan-task-1' with no prior TASK_CREATED",
      });
      expect(plan.conflicts[1]).toEqual({
        taskId: 'orphan-task-2',
        reason: 'orphan-event',
        details:
          "Event references task 'orphan-task-2' with no prior TASK_CREATED",
      });
    });

    it('should allow events for existing tasks', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'existing-1', // This task exists
            changes: { title: 'Updated Existing' },
          },
        },
      ];

      const plan = planMerge([existingTask], events, 'remapIds');

      expect(
        plan.conflicts.filter(c => c.reason === 'orphan-event')
      ).toHaveLength(0);
      expect(plan.applyEvents).toHaveLength(1);
    });

    it('should allow events after pack-created tasks', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'new-task-1',
            title: 'New Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'new-task-1', // This was created in the pack
            changes: { title: 'Updated New Task' },
          },
        },
      ];

      const plan = planMerge([], events, 'remapIds');

      expect(
        plan.conflicts.filter(c => c.reason === 'orphan-event')
      ).toHaveLength(0);
      expect(plan.applyEvents).toHaveLength(2);
    });

    it('should track remapped IDs correctly for orphan detection', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'existing-1', // Conflicts with existing task
            title: 'Conflicting Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'existing-1', // Should reference remapped ID
            changes: { title: 'Updated Conflicting Task' },
          },
        },
      ];

      const plan = planMerge([existingTask], events, 'remapIds');

      // Should have ID conflict but NO orphan event
      const idConflicts = plan.conflicts.filter(
        c => c.reason === 'id-conflict'
      );
      const orphanEvents = plan.conflicts.filter(
        c => c.reason === 'orphan-event'
      );

      expect(idConflicts).toHaveLength(1);
      expect(orphanEvents).toHaveLength(0);
      expect(plan.applyEvents).toHaveLength(2);
    });

    it('should skip orphan events with skipExisting policy', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'orphan-task-1',
            changes: { title: 'Updated Orphan' },
          },
        },
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'valid-task-1',
            title: 'Valid Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
      ];

      const plan = planMerge([], events, 'skipExisting');

      expect(plan.conflicts).toHaveLength(1);
      expect(plan.conflicts[0]?.reason).toBe('orphan-event');
      expect(plan.applyEvents).toHaveLength(1); // Only the valid task creation
      expect(plan.applyEvents[0]?.type).toBe('TASK_CREATED');
    });
  });

  describe('combined hardening scenarios', () => {
    it('should handle both timestamp regression and orphan events', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_UPDATED', // Orphan event
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'orphan-task-1',
            changes: { title: 'Updated Orphan' },
          },
        },
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'new-task-1',
            title: 'New Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED', // Timestamp regression
          timestamp: '2024-01-02T10:30:00.000Z',
          payload: {
            id: 'new-task-1',
            changes: { title: 'Updated New Task' },
          },
        },
      ];

      const plan = planMerge([], events, 'remapIds');

      expect(plan.conflicts).toHaveLength(2);

      const orphanConflict = plan.conflicts.find(
        c => c.reason === 'orphan-event'
      );
      const timestampConflict = plan.conflicts.find(
        c => c.reason === 'timestamp-regression'
      );

      expect(orphanConflict).toBeDefined();
      expect(orphanConflict?.taskId).toBe('orphan-task-1');

      expect(timestampConflict).toBeDefined();
      expect(timestampConflict?.taskId).toBe('new-task-1');
    });

    it('should maintain referential integrity after ID remapping', () => {
      const events: TaskEvent[] = [
        {
          type: 'TASK_CREATED',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: {
            id: 'existing-1', // Will be remapped
            title: 'Conflicting Task',
            status: 'TODAY',
            priority: 'P1',
            tags: [],
          },
        },
        {
          type: 'TASK_UPDATED',
          timestamp: '2024-01-02T11:00:00.000Z',
          payload: {
            id: 'existing-1', // Should follow the remap
            changes: { title: 'Updated Conflicting Task' },
          },
        },
        {
          type: 'TASK_MOVED',
          timestamp: '2024-01-02T12:00:00.000Z',
          payload: {
            id: 'existing-1', // Should follow the remap
            fromStatus: 'TODAY',
            toStatus: 'DONE',
          },
        },
      ];

      const plan = planMerge([existingTask], events, 'remapIds');

      expect(
        plan.conflicts.filter(c => c.reason === 'id-conflict')
      ).toHaveLength(1);
      expect(
        plan.conflicts.filter(c => c.reason === 'orphan-event')
      ).toHaveLength(0);

      const newId = plan.idMap['existing-1'];
      expect(newId).toBeDefined();

      // All events should reference the new ID
      expect(plan.applyEvents).toHaveLength(3);
      expect(plan.applyEvents.every(event => event.payload.id === newId)).toBe(
        true
      );
    });
  });
});
