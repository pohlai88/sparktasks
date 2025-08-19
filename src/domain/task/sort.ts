import type { Task } from './schema';

export function compareTasks(a: Task, b: Task): number {
  // Primary: priority P0 < P1 < P2
  const priorityOrder = { P0: 0, P1: 1, P2: 2 };
  const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
  if (priorityDiff !== 0) return priorityDiff;

  // Secondary: earliest dueDate first; tasks without dueDate sort after those with dueDate
  if (a.dueDate && b.dueDate) {
    const dueDiff =
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (dueDiff !== 0) return dueDiff;
  } else if (a.dueDate && !b.dueDate) {
    return -1; // a has dueDate, b doesn't - a comes first
  } else if (!a.dueDate && b.dueDate) {
    return 1; // b has dueDate, a doesn't - b comes first
  }

  // Tertiary: createdAt ascending
  const createdDiff =
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  if (createdDiff !== 0) return createdDiff;

  // Final tiebreaker for deterministic order
  if (a.id !== b.id) return a.id.localeCompare(b.id);
  return 0;
}
