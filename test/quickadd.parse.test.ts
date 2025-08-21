import { describe, it, expect } from 'vitest';
import { parseQuickAdd } from '../src/domain/quickadd/parse';

describe('Quick Add Parser', () => {
  const testDate = new Date('2025-08-15T10:00:00.000Z');

  describe('Basic parsing', () => {
    it('should parse minimal title with defaults', () => {
      const result = parseQuickAdd('Simple task', testDate);
      expect(result).toEqual({
        title: 'Simple task',
        priority: 'P1',
        status: 'TODAY',
        tags: [],
        dueDate: undefined,
        snoozeUntil: undefined,
      });
    });

    it('should reject empty title after token removal', () => {
      expect(() => parseQuickAdd('!p0 #work @status:today', testDate)).toThrow(
        'Title cannot be empty'
      );
    });

    it('should handle whitespace normalization', () => {
      const result = parseQuickAdd('   Multiple    spaces   task   ', testDate);
      expect(result.title).toBe('Multiple spaces task');
    });
  });

  describe('Priority parsing', () => {
    it('should parse priority tokens', () => {
      expect(parseQuickAdd('Task !p0', testDate).priority).toBe('P0');
      expect(parseQuickAdd('Task !p1', testDate).priority).toBe('P1');
      expect(parseQuickAdd('Task !p2', testDate).priority).toBe('P2');
    });

    it('should handle case-insensitive priority', () => {
      expect(parseQuickAdd('Task !P0', testDate).priority).toBe('P0');
      expect(parseQuickAdd('Task !P1', testDate).priority).toBe('P1');
    });

    it('should use last priority if multiple specified', () => {
      expect(parseQuickAdd('Task !p0 !p2', testDate).priority).toBe('P2');
    });
  });

  describe('Status parsing', () => {
    it('should parse status tokens', () => {
      expect(parseQuickAdd('Task @status:today', testDate).status).toBe(
        'TODAY'
      );
      expect(parseQuickAdd('Task @status:later', testDate).status).toBe(
        'LATER'
      );
      expect(parseQuickAdd('Task @status:done', testDate).status).toBe('DONE');
    });

    it('should handle case-insensitive status', () => {
      expect(parseQuickAdd('Task @status:TODAY', testDate).status).toBe(
        'TODAY'
      );
      expect(parseQuickAdd('Task @status:Later', testDate).status).toBe(
        'LATER'
      );
    });
  });

  describe('Tag parsing', () => {
    it('should parse single tag', () => {
      expect(parseQuickAdd('Task #work', testDate).tags).toEqual(['work']);
    });

    it('should parse multiple tags', () => {
      expect(
        parseQuickAdd('Task #work #urgent #bug-fix', testDate).tags
      ).toEqual(['work', 'urgent', 'bug-fix']);
    });

    it('should handle tags with numbers and special chars', () => {
      expect(parseQuickAdd('Task #project_2025 #v1-0', testDate).tags).toEqual([
        'project_2025',
        'v1-0',
      ]);
    });
  });

  describe('Due date parsing', () => {
    it('should parse explicit due dates', () => {
      const result = parseQuickAdd('Task @due:2025-08-20', testDate);
      expect(result.dueDate).toBe('2025-08-20T10:00:00.000Z');
    });

    it('should parse bare keywords as due dates', () => {
      const todayResult = parseQuickAdd('Task today', testDate);
      expect(todayResult.dueDate).toBe('2025-08-15T10:00:00.000Z');

      const tomorrowResult = parseQuickAdd('Task tomorrow', testDate);
      expect(tomorrowResult.dueDate).toBe('2025-08-16T10:00:00.000Z');
    });

    it('should parse next weekday', () => {
      const result = parseQuickAdd('Task @due:next mon', testDate);
      expect(result.dueDate).toBe('2025-08-18T10:00:00.000Z'); // Next Monday from Friday
    });

    it('should parse relative dates', () => {
      const twoDaysResult = parseQuickAdd('Task @due:in 2d', testDate);
      expect(twoDaysResult.dueDate).toBe('2025-08-17T10:00:00.000Z');

      const oneWeekResult = parseQuickAdd('Task @due:in 1w', testDate);
      expect(oneWeekResult.dueDate).toBe('2025-08-22T10:00:00.000Z');
    });

    it('should not parse keywords when preceded by special chars', () => {
      const result = parseQuickAdd('Task #today @tomorrow !today', testDate);
      expect(result.dueDate).toBeUndefined();
    });
  });

  describe('Snooze parsing', () => {
    it('should parse snooze tokens', () => {
      const result = parseQuickAdd('Task @snooze:2025-08-20', testDate);
      expect(result.snoozeUntil).toBe('2025-08-20T10:00:00.000Z');
    });

    it('should parse snooze with hours', () => {
      const result = parseQuickAdd('Task @snooze:in 4h', testDate);
      expect(result.snoozeUntil).toBe('2025-08-15T14:00:00.000Z');
    });

    it('should parse snooze relative dates', () => {
      const result = parseQuickAdd('Task @snooze:in 1d', testDate);
      expect(result.snoozeUntil).toBe('2025-08-16T10:00:00.000Z');
    });
  });

  describe('Complex combinations', () => {
    it('should handle all tokens together', () => {
      const result = parseQuickAdd(
        'Fix bug !p0 #critical #bug @status:today @due:tomorrow @snooze:in 2h',
        testDate
      );
      expect(result).toEqual({
        title: 'Fix bug',
        priority: 'P0',
        status: 'TODAY',
        tags: ['critical', 'bug'],
        dueDate: '2025-08-16T10:00:00.000Z',
        snoozeUntil: '2025-08-15T12:00:00.000Z',
      });
    });

    it('should ignore invalid tokens', () => {
      const result = parseQuickAdd('Task @invalid:token !p9 #', testDate);
      expect(result.title).toBe('Task @invalid:token !p9 #');
      expect(result.priority).toBe('P1'); // default
    });
  });
});
