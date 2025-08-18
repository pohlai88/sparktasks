import type { Task } from './schema';
import type { TaskEvent } from './events';

export interface UndoEntry {
  do: TaskEvent;
  undo: TaskEvent;
}

export function deriveUndo(e: TaskEvent, before: Task | undefined): TaskEvent | null {
  const timestamp = new Date().toISOString();

  switch (e.type) {
    case 'TASK_CREATED':
      // Created → Create a special "remove" event 
      // We'll use TASK_MOVED to ARCHIVED to represent deletion in undo
      return {
        type: 'TASK_MOVED',
        timestamp,
        payload: {
          id: e.payload.id,
          fromStatus: e.payload.status,
          toStatus: 'ARCHIVED',
        },
      };

    case 'TASK_UPDATED':
      if (!before) return null;
      // Updated → Updated with inverse patch
      const inversePatch: any = {};
      for (const [key] of Object.entries(e.payload.changes)) {
        const oldValue = (before as any)[key];
        if (oldValue !== undefined) {
          inversePatch[key] = oldValue;
        }
      }
      return {
        type: 'TASK_UPDATED',
        timestamp,
        payload: {
          id: e.payload.id,
          changes: inversePatch,
        },
      };

    case 'TASK_MOVED':
      // Moved → Moved back (swap from/to)
      return {
        type: 'TASK_MOVED',
        timestamp,
        payload: {
          id: e.payload.id,
          fromStatus: e.payload.toStatus,
          toStatus: e.payload.fromStatus,
        },
      };

    case 'TASK_COMPLETED':
      if (!before) return null;
      // Completed → Moved back to previous status
      return {
        type: 'TASK_MOVED',
        timestamp,
        payload: {
          id: e.payload.id,
          fromStatus: 'DONE',
          toStatus: before.status,
        },
      };

    case 'TASK_SNOOZED':
      if (!before) return null;
      // Snoozed → Snoozed back to previous snoozeUntil
      return {
        type: 'TASK_SNOOZED',
        timestamp,
        payload: {
          id: e.payload.id,
          snoozeUntil: before.snoozeUntil || '',
        },
      };

    default:
      return null;
  }
}
