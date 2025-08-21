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
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('Task Store Lanes', () => {
  beforeEach(() => {
    // Clear store state
    useTaskStore.setState({ byId: {} });
    // Clear localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should categorize tasks into correct lanes', () => {
    const store = useTaskStore.getState();

    // Add tasks with different statuses and conditions
    store.addTask({
      title: 'Today Task',
      status: 'TODAY',
      priority: 'P1',
    });

    store.addTask({
      title: 'Later Task',
      status: 'LATER',
      priority: 'P0',
      dueDate: '2025-08-20T10:00:00.000Z', // future
    });

    store.addTask({
      title: 'Overdue Task',
      status: 'LATER',
      priority: 'P2',
      dueDate: '2025-08-14T10:00:00.000Z', // past
    });

    const updatedStore = useTaskStore.getState();
    const todayTasks = selectToday(updatedStore);
    const laterTasks = selectLater(updatedStore);
    const doneTasks = selectDone(updatedStore);

    expect(todayTasks).toHaveLength(2); // TODAY task + overdue LATER task
    expect(laterTasks).toHaveLength(1); // Future LATER task
    expect(doneTasks).toHaveLength(0);

    expect(todayTasks.find(t => t.title === 'Today Task')).toBeDefined();
    expect(todayTasks.find(t => t.title === 'Overdue Task')).toBeDefined();
    expect(laterTasks.find(t => t.title === 'Later Task')).toBeDefined();
  });

  it('should sort tasks correctly within lanes', () => {
    const store = useTaskStore.getState();

    // Add tasks with different priorities and due dates
    store.addTask({
      title: 'P2 Task',
      status: 'TODAY',
      priority: 'P2',
      dueDate: '2025-08-15T10:00:00.000Z',
    });

    store.addTask({
      title: 'P0 Task',
      status: 'TODAY',
      priority: 'P0',
      dueDate: '2025-08-16T10:00:00.000Z',
    });

    store.addTask({
      title: 'P1 Early Due',
      status: 'TODAY',
      priority: 'P1',
      dueDate: '2025-08-15T09:00:00.000Z',
    });

    store.addTask({
      title: 'P1 Late Due',
      status: 'TODAY',
      priority: 'P1',
      dueDate: '2025-08-15T11:00:00.000Z',
    });

    const updatedStore = useTaskStore.getState();
    const todayTasks = selectToday(updatedStore);

    expect(todayTasks).toHaveLength(4);
    expect(todayTasks[0]?.title).toBe('P0 Task'); // P0 priority first
    expect(todayTasks[1]?.title).toBe('P1 Early Due'); // P1 with earlier due
    expect(todayTasks[2]?.title).toBe('P1 Late Due'); // P1 with later due
    expect(todayTasks[3]?.title).toBe('P2 Task'); // P2 priority last
  });

  it('should handle completed tasks correctly', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Task to Complete',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const taskId = Object.keys(updatedStore.byId)[0];
    if (!taskId) throw new Error('Task ID not found');

    // Complete the task
    store.completeTask(taskId);

    updatedStore = useTaskStore.getState();
    const todayTasks = selectToday(updatedStore);
    const laterTasks = selectLater(updatedStore);
    const doneTasks = selectDone(updatedStore);

    expect(todayTasks).toHaveLength(0);
    expect(laterTasks).toHaveLength(0);
    expect(doneTasks).toHaveLength(1);
    expect(doneTasks[0]?.title).toBe('Task to Complete');
    expect(doneTasks[0]?.status).toBe('DONE');
  });

  it('should sort done tasks by updatedAt descending', async () => {
    const store = useTaskStore.getState();

    // Add and complete tasks with delays to ensure different updatedAt times
    store.addTask({
      title: 'First Completed',
      status: 'TODAY',
      priority: 'P1',
    });

    let updatedStore = useTaskStore.getState();
    const firstTaskId = Object.keys(updatedStore.byId)[0];
    if (!firstTaskId) throw new Error('First task ID not found');

    store.completeTask(firstTaskId);

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Add another task
    store.addTask({
      title: 'Second Completed',
      status: 'TODAY',
      priority: 'P1',
    });

    updatedStore = useTaskStore.getState();
    const secondTaskId = Object.keys(updatedStore.byId).find(
      id => id !== firstTaskId
    );
    if (!secondTaskId) throw new Error('Second task ID not found');

    store.completeTask(secondTaskId);

    updatedStore = useTaskStore.getState();
    const doneTasks = selectDone(updatedStore);

    expect(doneTasks).toHaveLength(2);
    // Most recently completed should come first
    expect(doneTasks[0]?.title).toBe('Second Completed');
    expect(doneTasks[1]?.title).toBe('First Completed');
  });
});
