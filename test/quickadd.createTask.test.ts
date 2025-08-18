import { describe, it, expect } from 'vitest';
import { parseQuickAdd } from '../src/domain/quickadd/parse';
import { toCreateTaskInput } from '../src/domain/quickadd/toCreateTask';
import { CreateTaskInputSchema } from '../src/domain/task/schema';

describe('Quick Add to CreateTask Integration', () => {
  const testDate = new Date('2025-08-15T10:00:00.000Z');

  it('should round-trip parse to valid CreateTaskInput', () => {
    const quickResult = parseQuickAdd('Complete project !p0 #work @due:tomorrow', testDate);
    const createInput = toCreateTaskInput(quickResult);
    
    // Should pass Zod validation
    const validated = CreateTaskInputSchema.parse(createInput);
    
    expect(validated).toEqual({
      title: 'Complete project',
      priority: 'P0',
      status: 'TODAY',
      tags: ['work'],
      dueDate: '2025-08-16T10:00:00.000Z',
      snoozeUntil: undefined,
      notes: undefined,
    });
  });

  it('should handle minimal input with defaults', () => {
    const quickResult = parseQuickAdd('Simple task', testDate);
    const createInput = toCreateTaskInput(quickResult);
    const validated = CreateTaskInputSchema.parse(createInput);
    
    expect(validated).toEqual({
      title: 'Simple task',
      priority: 'P1',
      status: 'TODAY',
      tags: [],
      dueDate: undefined,
      snoozeUntil: undefined,
      notes: undefined,
    });
  });

  it('should preserve all fields in mapping', () => {
    const quickResult = parseQuickAdd('Task !p2 #tag1 #tag2 @status:later @due:in 5d @snooze:in 2h', testDate);
    const createInput = toCreateTaskInput(quickResult);
    
    expect(createInput.title).toBe(quickResult.title);
    expect(createInput.priority).toBe(quickResult.priority);
    expect(createInput.status).toBe(quickResult.status);
    expect(createInput.tags).toEqual(quickResult.tags);
    expect(createInput.dueDate).toBe(quickResult.dueDate);
    expect(createInput.snoozeUntil).toBe(quickResult.snoozeUntil);
  });

  it('should not mutate input objects', () => {
    const quickResult = parseQuickAdd('Test task #work', testDate);
    const originalQuick = { ...quickResult, tags: [...quickResult.tags] };
    
    toCreateTaskInput(quickResult);
    
    expect(quickResult).toEqual(originalQuick);
  });

  it('should handle edge cases that still validate', () => {
    const quickResult = parseQuickAdd('Edge case !p0 @status:done', testDate);
    const createInput = toCreateTaskInput(quickResult);
    
    // Should not throw
    expect(() => CreateTaskInputSchema.parse(createInput)).not.toThrow();
    
    expect(createInput.status).toBe('DONE');
    expect(createInput.priority).toBe('P0');
  });
});
