import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { planMergeImport, applyMerge } from '../src/domain/pack/import';
import { useTaskStore } from '../src/stores/taskStore';
import { appendEvent } from '../src/domain/task/eventlog';
import type { TaskEvent } from '../src/domain/task/events';
import type { Sparkpack } from '../src/domain/pack/types';

// Helper to create a sparkpack manually for testing
function createTestSparkpack(events: TaskEvent[]): string {
  const fnv1a = (s: string) => {
    let h = 0x811c9dc5 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ('00000000' + h.toString(16)).slice(-8);
  };

  const rawEvents = events.map(e => JSON.stringify(e)).join('\n');
  const sparkpack: Sparkpack = {
    meta: {
      version: 1,
      format: 'sparkpack/1+json',
      createdAt: new Date().toISOString(),
      eventsCount: events.length,
      eventsHash: fnv1a(rawEvents),
    },
    events,
  };

  return JSON.stringify(sparkpack);
}

describe('pack merge apply', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();

    // Reset the task store
    useTaskStore.getState().hydrate();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should apply merge with remapped IDs', async () => {
    // Create an existing task
    const existingTaskEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2024-01-01T10:00:00.000Z',
      payload: {
        id: 'existing-1',
        title: 'Existing Task',
        status: 'TODAY',
        priority: 'P1',
        tags: ['work'],
      },
    };

    appendEvent(existingTaskEvent);
    useTaskStore.getState().hydrate();

    // Create a sparkpack with conflicting ID
    const conflictingEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2024-01-02T10:00:00.000Z',
        payload: {
          id: 'existing-1', // Conflicts with existing task
          title: 'Imported Task',
          status: 'LATER',
          priority: 'P2',
          tags: ['imported'],
        },
      },
      {
        type: 'TASK_UPDATED',
        timestamp: '2024-01-02T11:00:00.000Z',
        payload: {
          id: 'existing-1',
          changes: { title: 'Updated Imported Task' },
        },
      },
    ];

    const sparkpackJson = createTestSparkpack(conflictingEvents);

    // Plan the merge with remapIds policy
    const mergePlan = planMergeImport(sparkpackJson, 'remapIds');
    expect('error' in mergePlan).toBe(false);

    if ('error' in mergePlan) return; // Type guard

    expect(mergePlan.conflicts).toHaveLength(1);
    expect(mergePlan.conflicts[0]?.taskId).toBe('existing-1');
    expect(Object.keys(mergePlan.idMap)).toContain('existing-1');

    // Get initial task count
    const initialTasks = Object.values(useTaskStore.getState().byId);
    expect(initialTasks).toHaveLength(1);

    // Apply the merge
    const report = applyMerge(mergePlan);
    expect(report.applied).toBe(2);
    expect(report.errors).toHaveLength(0);

    // Check final state
    useTaskStore.getState().hydrate();
    const finalTasks = Object.values(useTaskStore.getState().byId);
    expect(finalTasks).toHaveLength(2);

    // Find the imported task (should have remapped ID)
    const newId = mergePlan.idMap['existing-1'];
    const importedTask = finalTasks.find(t => t.id === newId);
    expect(importedTask).toBeDefined();
    expect(importedTask?.title).toBe('Updated Imported Task'); // Should have applied the update
    expect(importedTask?.status).toBe('LATER');
    expect(importedTask?.tags).toEqual(['imported']);

    // Original task should be unchanged
    const originalTask = finalTasks.find(t => t.id === 'existing-1');
    expect(originalTask).toBeDefined();
    expect(originalTask?.title).toBe('Existing Task');
  });

  it('should handle dry-run without persisting changes', () => {
    // Create an existing task
    const existingTaskEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2024-01-01T10:00:00.000Z',
      payload: {
        id: 'existing-1',
        title: 'Existing Task',
        status: 'TODAY',
        priority: 'P1',
        tags: ['work'],
      },
    };

    appendEvent(existingTaskEvent);
    useTaskStore.getState().hydrate();

    // Create sparkpack with new task
    const newEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2024-01-02T10:00:00.000Z',
        payload: {
          id: 'new-task-1',
          title: 'New Task',
          status: 'TODAY',
          priority: 'P1',
          tags: ['new'],
        },
      },
    ];

    const sparkpackJson = createTestSparkpack(newEvents);

    // Plan the merge
    const mergePlan = planMergeImport(sparkpackJson, 'remapIds');
    expect('error' in mergePlan).toBe(false);

    if ('error' in mergePlan) return;

    // Get initial task count
    const initialTasks = Object.values(useTaskStore.getState().byId);
    expect(initialTasks).toHaveLength(1);

    // Apply merge in dry-run mode
    const report = applyMerge(mergePlan, { dryRun: true });
    expect(report.applied).toBe(1);
    expect(report.errors).toHaveLength(0);

    // Task count should be unchanged
    useTaskStore.getState().hydrate();
    const finalTasks = Object.values(useTaskStore.getState().byId);
    expect(finalTasks).toHaveLength(1);
  });

  it('should rollback on error during merge apply', () => {
    // Create an existing task
    const existingTaskEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2024-01-01T10:00:00.000Z',
      payload: {
        id: 'existing-1',
        title: 'Existing Task',
        status: 'TODAY',
        priority: 'P1',
        tags: ['work'],
      },
    };

    appendEvent(existingTaskEvent);
    useTaskStore.getState().hydrate();

    // Mock a plan that would cause an error (we'll manually create an invalid plan)
    const invalidPlan = {
      policy: 'remapIds' as const,
      conflicts: [],
      idMap: {},
      applyEvents: [
        // This is an invalid event that should cause an error
        {
          type: 'INVALID_EVENT_TYPE',
          timestamp: '2024-01-02T10:00:00.000Z',
          payload: { id: 'test' },
        } as any,
      ],
    };

    // Get initial task count
    const initialTasks = Object.values(useTaskStore.getState().byId);
    expect(initialTasks).toHaveLength(1);

    // Apply the invalid merge - this should trigger rollback
    try {
      const report = applyMerge(invalidPlan);
      // If we get here, the error was caught and reported
      expect(report.applied).toBe(0);
      expect(report.errors.length).toBeGreaterThan(0);
    } catch (error) {
      // If error is thrown, that's also acceptable
      expect(error).toBeDefined();
    }

    // Task count should be unchanged due to rollback
    useTaskStore.getState().hydrate();
    const finalTasks = Object.values(useTaskStore.getState().byId);
    expect(finalTasks).toHaveLength(1);
    expect(finalTasks[0]?.title).toBe('Existing Task');
  });

  it('should handle skipExisting policy correctly', () => {
    // Create an existing task
    const existingTaskEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2024-01-01T10:00:00.000Z',
      payload: {
        id: 'existing-1',
        title: 'Existing Task',
        status: 'TODAY',
        priority: 'P1',
        tags: ['work'],
      },
    };

    appendEvent(existingTaskEvent);
    useTaskStore.getState().hydrate();

    // Create sparkpack with mix of conflicting and new tasks
    const mixedEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2024-01-02T10:00:00.000Z',
        payload: {
          id: 'existing-1', // Conflicts - should be skipped
          title: 'Conflicting Task',
          status: 'LATER',
          priority: 'P2',
          tags: ['conflict'],
        },
      },
      {
        type: 'TASK_CREATED',
        timestamp: '2024-01-02T11:00:00.000Z',
        payload: {
          id: 'new-task-1', // No conflict - should be applied
          title: 'New Task',
          status: 'TODAY',
          priority: 'P1',
          tags: ['new'],
        },
      },
    ];

    const sparkpackJson = createTestSparkpack(mixedEvents);

    // Plan the merge with skipExisting policy
    const mergePlan = planMergeImport(sparkpackJson, 'skipExisting');
    expect('error' in mergePlan).toBe(false);

    if ('error' in mergePlan) return;

    expect(mergePlan.conflicts).toHaveLength(1);
    expect(mergePlan.applyEvents).toHaveLength(1); // Only the non-conflicting task

    // Apply the merge
    const report = applyMerge(mergePlan);
    expect(report.applied).toBe(1);
    expect(report.errors).toHaveLength(0);

    // Check final state
    useTaskStore.getState().hydrate();
    const finalTasks = Object.values(useTaskStore.getState().byId);
    expect(finalTasks).toHaveLength(2);

    // Original task should be unchanged
    const originalTask = finalTasks.find(t => t.id === 'existing-1');
    expect(originalTask?.title).toBe('Existing Task');

    // New task should be added
    const newTask = finalTasks.find(t => t.id === 'new-task-1');
    expect(newTask?.title).toBe('New Task');
  });
});
