import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../src/stores/taskStore';
import { TaskStatus } from '../src/types/task';

describe('Task Undo/Redo', () => {
  beforeEach(() => {
    // Reset store state
    useTaskStore.setState({ byId: {}, undoStack: [], redoStack: [] });
  });

  function getFirstTaskId(): string {
    const taskIds = Object.keys(useTaskStore.getState().byId);
    if (taskIds.length === 0) throw new Error('No tasks found');
    return taskIds[0]!;
  }

  describe('addTask undo/redo', () => {
    it('should allow undoing task creation', () => {
      const { addTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      // Check task was created
      const afterAdd = useTaskStore.getState();
      const taskIds = Object.keys(afterAdd.byId);
      expect(taskIds).toHaveLength(1);
      expect(afterAdd.undoStack).toHaveLength(1);

      // Undo the creation
      undo();

      // Check task was removed
      const afterUndo = useTaskStore.getState();
      expect(Object.keys(afterUndo.byId)).toHaveLength(0);
      expect(afterUndo.undoStack).toHaveLength(0);
      expect(afterUndo.redoStack).toHaveLength(1);
    });

    it('should allow redoing task creation', () => {
      const { addTask, undo, redo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();
      const originalTask = useTaskStore.getState().byId[taskId]!;

      // Undo the creation
      undo();

      // Redo the creation
      redo();

      // Check task was recreated
      const afterRedo = useTaskStore.getState();
      expect(Object.keys(afterRedo.byId)).toHaveLength(1);
      expect(afterRedo.byId[taskId]!).toEqual(originalTask);
      expect(afterRedo.undoStack).toHaveLength(1);
      expect(afterRedo.redoStack).toHaveLength(0);
    });
  });

  describe('updateTask undo/redo', () => {
    it('should allow undoing task updates', () => {
      const { addTask, updateTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Original Title',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Update the task
      updateTask(taskId, { title: 'Updated Title', tags: ['test'] });

      // Check task was updated
      const updatedTask = useTaskStore.getState().byId[taskId]!;
      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.tags).toEqual(['test']);

      // Undo the update
      undo();

      // Check task was restored (should undo the TASK_UPDATED event)
      const afterUndo = useTaskStore.getState();
      expect(afterUndo.byId[taskId]!.title).toBe('Original Title');
      expect(afterUndo.byId[taskId]!.tags).toEqual([]);
    });

    it('should handle status changes with TASK_MOVED events', () => {
      const { addTask, updateTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Update the task status
      updateTask(taskId, { status: 'DONE' as TaskStatus });

      // Check task status was updated
      expect(useTaskStore.getState().byId[taskId]!.status).toBe('DONE');

      // Undo the status change
      undo();

      // Check task status was restored
      const afterUndo = useTaskStore.getState();
      expect(afterUndo.byId[taskId]!.status).toBe('TODAY');
    });
  });

  describe('moveTask undo/redo', () => {
    it('should allow undoing task moves', () => {
      const { addTask, moveTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Move the task
      moveTask(taskId, 'LATER');

      // Check task was moved
      expect(useTaskStore.getState().byId[taskId]!.status).toBe('LATER');

      // Undo the move
      undo();

      // Check task was moved back
      const afterUndo = useTaskStore.getState();
      expect(afterUndo.byId[taskId]!.status).toBe('TODAY');
    });
  });

  describe('completeTask undo/redo', () => {
    it('should allow undoing task completion', () => {
      const { addTask, completeTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Complete the task
      completeTask(taskId);

      // Check task was completed
      expect(useTaskStore.getState().byId[taskId]!.status).toBe('DONE');

      // Undo the completion
      undo();

      // Check task status was restored to default (TODAY)
      const afterUndo = useTaskStore.getState();
      expect(afterUndo.byId[taskId]!.status).toBe('TODAY');
    });
  });

  describe('snoozeTask undo/redo', () => {
    it('should allow undoing task snoozing', () => {
      const { addTask, snoozeTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Snooze the task
      const snoozeUntil = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();
      snoozeTask(taskId, snoozeUntil);

      // Check task was snoozed
      expect(useTaskStore.getState().byId[taskId]!.snoozeUntil).toBe(
        snoozeUntil
      );

      // Undo the snooze
      undo();

      // Check snooze was removed
      const afterUndo = useTaskStore.getState();
      expect(afterUndo.byId[taskId]!.snoozeUntil).toBeUndefined();
    });
  });

  describe('quickAdd undo/redo', () => {
    it('should allow undoing quick-added tasks', () => {
      const { quickAdd, undo } = useTaskStore.getState();

      // Quick add a task
      quickAdd('Test task #work P1');

      // Check task was created
      const taskIds = Object.keys(useTaskStore.getState().byId);
      expect(taskIds).toHaveLength(1);

      // Undo the creation
      undo();

      // Check task was removed
      const afterUndo = useTaskStore.getState();
      expect(Object.keys(afterUndo.byId)).toHaveLength(0);
    });
  });

  describe('undo/redo stack management', () => {
    it('should clear redo stack when new action is performed', () => {
      const { addTask, updateTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Update it
      updateTask(taskId, { title: 'Updated' });

      // Undo once
      undo();

      // Check we have a redo stack
      expect(useTaskStore.getState().redoStack).toHaveLength(1);

      // Perform a new action
      updateTask(taskId, { title: 'New Update' });

      // Check redo stack was cleared
      expect(useTaskStore.getState().redoStack).toHaveLength(0);
    });

    it('should cap undo stack at 50 entries', () => {
      const { addTask } = useTaskStore.getState();

      // Create 55 tasks to exceed the limit
      for (let i = 0; i < 55; i++) {
        addTask({
          title: `Task ${i}`,
          status: 'TODAY' as TaskStatus,
          priority: 'P1',
          tags: [],
        });
      }

      // Check stack is capped at 50
      const { undoStack } = useTaskStore.getState();
      expect(undoStack).toHaveLength(50);
    });

    it('should cap redo stack at 50 entries', () => {
      const { addTask, undo } = useTaskStore.getState();

      // Create 55 tasks
      for (let i = 0; i < 55; i++) {
        addTask({
          title: `Task ${i}`,
          status: 'TODAY' as TaskStatus,
          priority: 'P1',
          tags: [],
        });
      }

      // Undo all actions (limited by undo stack cap of 50)
      const { undoStack } = useTaskStore.getState();
      for (let i = 0; i < undoStack.length; i++) {
        undo();
      }

      // Check redo stack is capped at 50
      const { redoStack } = useTaskStore.getState();
      expect(redoStack).toHaveLength(50);
    });

    it('should handle undo/redo cycles correctly', () => {
      const { addTask, updateTask, undo, redo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();
      const originalTask = useTaskStore.getState().byId[taskId]!;

      // Update it
      updateTask(taskId, { title: 'Updated' });

      // Undo and redo multiple times
      undo();
      expect(useTaskStore.getState().byId[taskId]!.title).toBe(
        originalTask.title
      );

      redo();
      expect(useTaskStore.getState().byId[taskId]!.title).toBe('Updated');

      undo();
      expect(useTaskStore.getState().byId[taskId]!.title).toBe(
        originalTask.title
      );

      redo();
      expect(useTaskStore.getState().byId[taskId]!.title).toBe('Updated');
    });

    it('should do nothing when undo stack is empty', () => {
      const { undo, byId, undoStack, redoStack } = useTaskStore.getState();

      // Try to undo with empty stack
      undo();

      // State should remain unchanged
      const afterUndo = useTaskStore.getState();
      expect(afterUndo.byId).toEqual(byId);
      expect(afterUndo.undoStack).toEqual(undoStack);
      expect(afterUndo.redoStack).toEqual(redoStack);
    });

    it('should do nothing when redo stack is empty', () => {
      const { redo, byId, undoStack, redoStack } = useTaskStore.getState();

      // Try to redo with empty stack
      redo();

      // State should remain unchanged
      const afterRedo = useTaskStore.getState();
      expect(afterRedo.byId).toEqual(byId);
      expect(afterRedo.undoStack).toEqual(undoStack);
      expect(afterRedo.redoStack).toEqual(redoStack);
    });
  });

  describe('complex operations', () => {
    it('should handle multiple operations and undos correctly', () => {
      const { addTask, updateTask, moveTask, undo } = useTaskStore.getState();

      // Create a task
      addTask({
        title: 'Test Task',
        status: 'TODAY' as TaskStatus,
        priority: 'P1',
        tags: [],
      });

      const taskId = getFirstTaskId();

      // Perform multiple operations
      updateTask(taskId, { title: 'Updated Title' });
      moveTask(taskId, 'LATER');
      updateTask(taskId, { tags: ['test'] });

      // Check final state
      let task = useTaskStore.getState().byId[taskId]!;
      expect(task.title).toBe('Updated Title');
      expect(task.status).toBe('LATER');
      expect(task.tags).toEqual(['test']);

      // Undo last operation (tag update)
      undo();
      task = useTaskStore.getState().byId[taskId]!;
      expect(task.title).toBe('Updated Title');
      expect(task.status).toBe('LATER');
      expect(task.tags).toEqual([]);

      // Undo move operation
      undo();
      task = useTaskStore.getState().byId[taskId]!;
      expect(task.title).toBe('Updated Title');
      expect(task.status).toBe('TODAY');
      expect(task.tags).toEqual([]);

      // Undo title update
      undo();
      task = useTaskStore.getState().byId[taskId]!;
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe('TODAY');
      expect(task.tags).toEqual([]);

      // Undo task creation
      undo();
      expect(Object.keys(useTaskStore.getState().byId)).toHaveLength(0);
    });
  });
});
