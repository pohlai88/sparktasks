/**
 * Enhanced Quick Add Parser with Validation
 * Parses user input for task creation with comprehensive syntax support
 */
import type { ParsedQuickAdd, Priority } from '@/types';

const PRIORITY_MAP: Record<string, Priority> = {
  p0: 'critical',
  p1: 'high',
  p2: 'medium',
  p3: 'low',
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

/**
 * Validates ISO date format (YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * Parses quick add input into structured task data
 * Supports: #P0-3 priority, @assignee, due:YYYY-MM-DD, #tags
 *
 * Examples:
 * - "Review code #P1 @john due:2025-08-25 #review"
 * - "Fix bug #critical @team #urgent #hotfix"/
export function parseQuickAdd(input: string): ParsedQuickAdd {
  if (!input?.trim()) {
    return { title: 'Untitled' };
  }

  const parts = input.trim().split(/\s+/);
  const titleParts: string[] = [];
  const tags: string[] = [];

  let priority: Priority | undefined;
  let assignee: string | undefined;
  let due: string | undefined;

  for (const part of parts) {
    // Priority patterns: #P0, #P1, #critical, etc.
    if (/^#p[0-3]$/i.test(part)) {
      priority = PRIORITY_MAP[part.toLowerCase()];
      continue;
    }

    if (/^#(critical|high|medium|low)$/i.test(part)) {
      priority = PRIORITY_MAP[part.slice(1).toLowerCase()];
      continue;
    }

    // Assignee pattern: @username
    if (/^@[\w-]+$/i.test(part)) {
      assignee = part.slice(1);
      continue;
    }

    // Due date pattern: due:YYYY-MM-DD
    if (/^due:\d{4}-\d{2}-\d{2}$/i.test(part)) {
      const dateStr = part.split(':')[1];
      if (isValidDate(dateStr)) {
        due = dateStr;
      }
      continue;
    }

    // Tag pattern: #tag (but not priority tags)
    if (
      part.startsWith('#') &&
      !/^#p[0-3]$/i.test(part) &&
      !/^#(critical|high|medium|low)$/i.test(part)
    ) {
      tags.push(part);
      continue;
    }

    // Everything else is part of the title
    titleParts.push(part);
  }

  const result: ParsedQuickAdd = {
    title: titleParts.join(' ').trim() || 'Untitled',
  };

  if (priority) result.priority = priority;
  if (assignee) result.assignee = assignee;
  if (due) result.due = due;
  if (tags.length > 0) result.tags = tags;

  return result;
}

/**
 * Validates parsed quick add data
 */
export function validateQuickAdd(parsed: ParsedQuickAdd): string[] {
  const errors: string[] = [];

  if (!parsed.title || parsed.title === 'Untitled') {
    errors.push('Task title is required');
  }

  if (parsed.due && !isValidDate(parsed.due)) {
    errors.push('Due date must be in YYYY-MM-DD format');
  }

  if (parsed.assignee && !/^[\w-]+$/.test(parsed.assignee)) {
    errors.push('Assignee must contain only letters, numbers, and hyphens');
  }

  return errors;
}

/**
 * Generates help text for quick add syntax
 */
export function getQuickAddHelp(): string {
  return 'Syntax: #P0-3 or #critical/high/medium/low for priority, @assignee, due:YYYY-MM-DD, #tags';
}

/**
 * Generates example quick add inputs
 */
export function getQuickAddExamples(): string[] {
  return [
    'Review quarterly report #P1 @alice due:2025-08-25 #review',
    'Fix login bug #critical @devteam #hotfix',
    'Update documentation #low #docs',
    'Client meeting @sarah due:2025-08-30 #meeting #client',
  ];
}
