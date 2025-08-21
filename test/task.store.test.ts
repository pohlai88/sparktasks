import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  useTaskStore,
  selectToday,
  selectLater,
  selectDone,
} from '../src/stores/taskStore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  get length() {
    return 0;
  },
  key: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('Task Store', () => {
  beforeEach(() => {
    // Clear store state
    useTaskStore.setState({ byId: {} });
    // Clear localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should add a new task', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Test Task',
      status: 'TODAY',
      priority: 'P1',
    });

    // Get updated state after adding task
    const updatedStore = useTaskStore.getState();
    const tasks = Object.values(updatedStore.byId);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.title).toBe('Test Task');
    expect(tasks[0]?.status).toBe('TODAY');
    expect(tasks[0]?.priority).toBe('P1');
  });

  it('should update an existing task', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Original Task',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    if (!taskId) throw new Error('Task ID not found');

    store.updateTask(taskId, { title: 'Updated Task' });

    updatedStore = useTaskStore.getState();
    const task = updatedStore.byId[taskId];
    expect(task?.title).toBe('Updated Task');
  });

  it('should complete a task', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Task to Complete',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    if (!taskId) throw new Error('Task ID not found');

    expect(updatedStore.byId[taskId]?.status).toBe('TODAY');

    store.completeTask(taskId);

    updatedStore = useTaskStore.getState();
    expect(updatedStore.byId[taskId]?.status).toBe('DONE');
  });

  it('should move a task to different status', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Task to Move',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    if (!taskId) throw new Error('Task ID not found');

    store.moveTask(taskId, 'LATER');

    updatedStore = useTaskStore.getState();
    expect(updatedStore.byId[taskId]?.status).toBe('LATER');
  });

  it('should snooze a task', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Task to Snooze',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    if (!taskId) throw new Error('Task ID not found');

    const snoozeUntil = '2025-08-16T10:00:00.000Z';
    store.snoozeTask(taskId, snoozeUntil);

    updatedStore = useTaskStore.getState();
    expect(updatedStore.byId[taskId]?.snoozeUntil).toBe(snoozeUntil);
  });

  it('should filter tasks by status using selectors', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Today Task',
      status: 'TODAY',
      priority: 'P1',
    });
    store.addTask({
      title: 'Later Task',
      status: 'LATER',
      priority: 'P2',
    });

    const updatedStore = useTaskStore.getState();
    const todayTasks = selectToday(updatedStore);
    const laterTasks = selectLater(updatedStore);
    const doneTasks = selectDone(updatedStore);

    expect(todayTasks).toHaveLength(1);
    expect(todayTasks[0]?.title).toBe('Today Task');
    expect(laterTasks).toHaveLength(1);
    expect(laterTasks[0]?.title).toBe('Later Task');
    expect(doneTasks).toHaveLength(0);
  });
});
