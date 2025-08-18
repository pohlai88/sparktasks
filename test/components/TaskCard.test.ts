import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useTaskStore, selectToday, selectLater, selectDone } from '../../src/stores/taskStore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  get length() { return 0; },
  key: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('Task Card Operations', () => {
  beforeEach(() => {
    // Clear store state
    useTaskStore.setState({ byId: {}, undoStack: [], redoStack: [] });
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('completes task correctly', () => {
    const store = useTaskStore.getState();
    
    // Add a task
    store.addTask({
      title: 'Test Task',
      status: 'TODAY',
      priority: 'P1',
    });

    const updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    
    if (!taskId) throw new Error('Task not created');
    
    const task = updatedStore.byId[taskId];
    expect(task?.status).toBe('TODAY');

    // Complete the task
    updatedStore.completeTask(taskId);
    
    const finalStore = useTaskStore.getState();
    const completedTask = finalStore.byId[taskId];
    expect(completedTask?.status).toBe('DONE');
  });

  test('edits task correctly', () => {
    const store = useTaskStore.getState();
    
    // Add a task
    store.addTask({
      title: 'Original Task',
      status: 'TODAY',
      priority: 'P1',
      notes: 'Original notes',
    });

    const updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    
    if (!taskId) throw new Error('Task not created');
    
    // Edit the task
    updatedStore.updateTask(taskId, {
      title: 'Updated Task',
      notes: 'Updated notes',
    });
    
    const finalStore = useTaskStore.getState();
    const editedTask = finalStore.byId[taskId];
    expect(editedTask?.title).toBe('Updated Task');
    expect(editedTask?.notes).toBe('Updated notes');
  });

  test('deletes task correctly (archives)', () => {
    const store = useTaskStore.getState();
    
    // Add a task
    store.addTask({
      title: 'Task to Delete',
      status: 'TODAY',
      priority: 'P1',
    });

    const updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    
    if (!taskId) throw new Error('Task not created');
    
    const task = updatedStore.byId[taskId];
    expect(task?.status).toBe('TODAY');

    // Archive the task (delete)
    updatedStore.updateTask(taskId, { status: 'ARCHIVED' });
    
    const finalStore = useTaskStore.getState();
    const archivedTask = finalStore.byId[taskId];
    expect(archivedTask?.status).toBe('ARCHIVED');
  });

  test('shows completed task with proper status', () => {
    const store = useTaskStore.getState();
    
    // Add and complete a task
    store.addTask({
      title: 'Completed Task',
      status: 'TODAY',
      priority: 'P1',
    });

    const updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    
    if (!taskId) throw new Error('Task not created');
    
    updatedStore.completeTask(taskId);
    
    const finalStore = useTaskStore.getState();
    const doneTasks = selectDone(finalStore);
    
    expect(doneTasks).toHaveLength(1);
    expect(doneTasks[0]?.title).toBe('Completed Task');
    expect(doneTasks[0]?.status).toBe('DONE');
  });

  test('moves task between columns correctly', () => {
    const store = useTaskStore.getState();
    
    // Add a task to TODAY
    store.addTask({
      title: 'Task to Move',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    
    if (!taskId) throw new Error('Task not created');
    
    // Verify it's in TODAY
    const todayTasks = selectToday(updatedStore);
    expect(todayTasks).toHaveLength(1);
    expect(todayTasks[0]?.title).toBe('Task to Move');
    
    // Move to LATER
    updatedStore.moveTask(taskId, 'LATER');
    
    const finalStore = useTaskStore.getState();
    const laterTasks = selectLater(finalStore);
    const newTodayTasks = selectToday(finalStore);
    
    expect(newTodayTasks).toHaveLength(0);
    expect(laterTasks).toHaveLength(1);
    expect(laterTasks[0]?.title).toBe('Task to Move');
  });
});
