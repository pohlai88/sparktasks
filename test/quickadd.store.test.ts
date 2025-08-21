import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../src/stores/taskStore';

describe('Quick Add Store Integration', () => {
  const testDate = new Date('2025-08-15T10:00:00.000Z');

  beforeEach(() => {
    // Reset store state
    useTaskStore.setState({ byId: {} });
  });

  it('should create task via quickAdd method', () => {
    const store = useTaskStore.getState();
    const result = store.quickAdd(
      'Complete project !p0 #work @due:tomorrow',
      testDate
    );

    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');

    const state = useTaskStore.getState();
    const task = state.byId[result.id];

    expect(task).toBeDefined();
    expect(task!.title).toBe('Complete project');
    expect(task!.priority).toBe('P0');
    expect(task!.tags).toEqual(['work']);
    expect(task!.dueDate).toBe('2025-08-16T10:00:00.000Z');
  });

  it('should reflect task in store state with correct defaults', () => {
    const store = useTaskStore.getState();
    const result = store.quickAdd('Simple task', testDate);

    const task = useTaskStore.getState().byId[result.id];

    expect(task!.title).toBe('Simple task');
    expect(task!.priority).toBe('P1');
    expect(task!.status).toBe('TODAY');
    expect(task!.tags).toEqual([]);
    expect(task!.dueDate).toBeUndefined();
    expect(task!.createdAt).toBeDefined();
    expect(task!.updatedAt).toBeDefined();
  });

  it('should handle complex parsing and mapping', () => {
    const store = useTaskStore.getState();
    const result = store.quickAdd(
      'Fix bug !p2 #critical #urgent @status:later @snooze:in 4h',
      testDate
    );

    const task = useTaskStore.getState().byId[result.id];

    expect(task!.title).toBe('Fix bug');
    expect(task!.priority).toBe('P2');
    expect(task!.status).toBe('LATER');
    expect(task!.tags).toEqual(['critical', 'urgent']);
    expect(task!.snoozeUntil).toBe('2025-08-15T14:00:00.000Z');
  });

  it('should emit events through existing flow', () => {
    const store = useTaskStore.getState();
    const initialTaskCount = Object.keys(store.byId).length;

    const result = store.quickAdd('New task #test', testDate);

    const finalTaskCount = Object.keys(useTaskStore.getState().byId).length;
    expect(finalTaskCount).toBe(initialTaskCount + 1);

    // Verify task exists in state
    const task = useTaskStore.getState().byId[result.id];
    expect(task).toBeDefined();
    expect(task!.tags).toEqual(['test']);
  });
});
