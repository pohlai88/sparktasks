import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore, selectQuery } from '../src/stores/taskStore';

describe('Query Selector', () => {
  beforeEach(() => {
    // Reset store state
    useTaskStore.setState({ byId: {} });
  });

  it('should delegate to runQuery correctly', () => {
    const store = useTaskStore.getState();

    // Add some test tasks
    store.addTask({
      title: 'Test task 1',
      status: 'TODAY',
      priority: 'P1',
      tags: ['test'],
    });

    store.addTask({
      title: 'Test task 2',
      status: 'LATER',
      priority: 'P2',
      tags: ['another'],
    });

    const state = useTaskStore.getState();
    const result = selectQuery(state, { status: ['TODAY'] });

    expect(result.total).toBe(1);
    expect(result.items[0]!.title).toBe('Test task 1');
    expect(result.items[0]!.status).toBe('TODAY');
  });

  it('should apply pagination correctly', () => {
    const store = useTaskStore.getState();

    // Add multiple tasks
    for (let i = 1; i <= 5; i++) {
      store.addTask({
        title: `Task ${i}`,
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      });
    }

    const state = useTaskStore.getState();
    const result = selectQuery(state, {}, { offset: 2, limit: 2 });

    expect(result.total).toBe(5);
    expect(result.items.length).toBe(2);
  });

  it('should not mutate store state', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Immutable test',
      status: 'TODAY',
      priority: 'P1',
      tags: ['test'],
    });

    const stateBefore = useTaskStore.getState();
    const taskCountBefore = Object.keys(stateBefore.byId).length;
    const taskBefore = Object.values(stateBefore.byId)[0];

    // Run query
    selectQuery(stateBefore, { text: 'immutable' });

    // Verify state unchanged
    const stateAfter = useTaskStore.getState();
    const taskCountAfter = Object.keys(stateAfter.byId).length;
    const taskAfter = Object.values(stateAfter.byId)[0];

    expect(taskCountAfter).toBe(taskCountBefore);
    expect(taskAfter).toEqual(taskBefore);
    expect(stateAfter.byId).toBe(stateBefore.byId); // Reference equality check
  });

  it('should handle empty store', () => {
    const state = useTaskStore.getState();
    const result = selectQuery(state, { text: 'anything' });

    expect(result.total).toBe(0);
    expect(result.items).toEqual([]);
  });

  it('should work with complex queries', () => {
    const store = useTaskStore.getState();

    store.addTask({
      title: 'Bug fix urgent',
      status: 'TODAY',
      priority: 'P0',
      tags: ['bug', 'urgent'],
    });

    store.addTask({
      title: 'Documentation update',
      status: 'LATER',
      priority: 'P1',
      tags: ['docs'],
    });

    const state = useTaskStore.getState();
    const result = selectQuery(state, {
      text: 'bug',
      priority: ['P0'],
      tags: ['urgent'],
    });

    expect(result.total).toBe(1);
    expect(result.items[0]!.title).toBe('Bug fix urgent');
  });
});
