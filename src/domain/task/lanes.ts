import type { Task } from './schema';

function isToday(task: Task): boolean {
  if (task.status === 'ARCHIVED') return false;

  if (task.status === 'TODAY') return true;

  if (task.status === 'LATER') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if dueDate is today or past
    let dueTodayOrPast = false;
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      );
      dueTodayOrPast = dueDateOnly <= today;
    }

    // Check if snooze period has ended
    let snoozeEnded = true;
    if (task.snoozeUntil) {
      const snoozeDate = new Date(task.snoozeUntil);
      snoozeEnded = snoozeDate <= now;
    }

    return dueTodayOrPast && snoozeEnded;
  }

  return false;
}

function isLater(task: Task): boolean {
  if (task.status === 'ARCHIVED') return false;
  if (task.status !== 'LATER') return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if snooze is active first
  if (task.snoozeUntil) {
    const snoozeDate = new Date(task.snoozeUntil);
    if (snoozeDate > now) {
      return true; // Snoozed, so it's in LATER regardless of due date
    }
  }

  // Check if dueDate is after today or no dueDate
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    const dueDateOnly = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );
    return dueDateOnly > today;
  }

  // No dueDate and no active snooze
  return true;
}

function isDone(task: Task): boolean {
  if (task.status === 'ARCHIVED') return false;
  return task.status === 'DONE';
}

export { isToday, isLater, isDone };
