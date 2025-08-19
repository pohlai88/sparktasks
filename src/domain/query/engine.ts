import { Task } from '../task/schema';
import { compareTasks } from '../task/sort';
import { Query, Page, Result } from './types';

export function runQuery(
  tasks: Task[],
  q: Query,
  page: Page = { offset: 0, limit: 50 },
  opts: { now?: Date } = {}
): Result<Task> {
  const now = opts.now ?? new Date();
  let filtered = tasks.slice();

  // By default, hide ARCHIVED unless explicitly requested in q.status
  if (!q.status || q.status.length === 0) {
    filtered = filtered.filter(t => t.status !== 'ARCHIVED');
  }

  const qTagsLower = q.tags?.map(t => t.toLowerCase());

  // Text filter: case-insensitive substring match on title and tags
  if (q.text && q.text.trim()) {
    const searchText = q.text.toLowerCase();
    filtered = filtered.filter(
      task =>
        task.title.toLowerCase().includes(searchText) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchText))
    );
  }

  // Tags filter: task must have ALL provided tags
  if (qTagsLower && qTagsLower.length > 0) {
    filtered = filtered.filter(task =>
      qTagsLower!.every(reqTag =>
        task.tags.map(t => t.toLowerCase()).includes(reqTag)
      )
    );
  }

  // Status filter: inclusive
  if (q.status && q.status.length > 0) {
    filtered = filtered.filter(task =>
      q.status!.includes(task.status as 'TODAY' | 'LATER' | 'DONE' | 'ARCHIVED')
    );
  }

  // Priority filter: inclusive
  if (q.priority && q.priority.length > 0) {
    filtered = filtered.filter(task => q.priority!.includes(task.priority));
  }

  // Due date range filter (inclusive)
  if (q.dueFrom || q.dueTo) {
    filtered = filtered.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);

      if (q.dueFrom) {
        const fromDate = parseBoundedDate(q.dueFrom, 'from');
        if (dueDate < fromDate) return false;
      }

      if (q.dueTo) {
        const toDate = parseBoundedDate(q.dueTo, 'to');
        if (dueDate > toDate) return false;
      }

      return true;
    });
  }

  // Snooze filter
  if (q.snoozeActive !== undefined) {
    if (q.snoozeActive) {
      // Only tasks with active snooze (snoozeUntil > now)
      filtered = filtered.filter(
        task => task.snoozeUntil && new Date(task.snoozeUntil) > now
      );
    } else {
      // Only tasks without snooze or expired snooze
      filtered = filtered.filter(
        task => !task.snoozeUntil || new Date(task.snoozeUntil) <= now
      );
    }
  }

  // Created date range filter (inclusive)
  if (q.createdFrom || q.createdTo) {
    filtered = filtered.filter(task => {
      const createdDate = new Date(task.createdAt);

      if (q.createdFrom) {
        const fromDate = new Date(q.createdFrom);
        if (createdDate < fromDate) return false;
      }

      if (q.createdTo) {
        const toDate = new Date(q.createdTo);
        if (createdDate > toDate) return false;
      }

      return true;
    });
  }

  // Sort: use compareTasks for TODAY/LATER; for DONE sort by updatedAt desc
  filtered.sort((a, b) => {
    if (a.status === 'DONE' && b.status === 'DONE') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return compareTasks(a, b);
  });

  const total = filtered.length;

  // Apply pagination
  const safeOffset = Math.max(0, (page?.offset ?? 0) | 0);
  const safeLimit = Math.max(0, Math.min(1000, (page?.limit ?? 50) | 0));
  const items = filtered.slice(safeOffset, safeOffset + safeLimit);

  return {
    total,
    items,
  };
}

function parseBoundedDate(s: string, kind: 'from' | 'to'): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // Interpret day-only strings as whole-day bounds (UTC)
    return new Date(
      `${s}T${kind === 'from' ? '00:00:00.000Z' : '23:59:59.999Z'}`
    );
  }
  return new Date(s);
}
