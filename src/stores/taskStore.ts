import { create } from 'zustand';

import { runQuery } from '../domain/query/engine';
import type { Query, Page, Result } from '../domain/query/types';
import { parseQuickAdd } from '../domain/quickadd/parse';
import { toCreateTaskInput } from '../domain/quickadd/toCreateTask';
import { createSearchIndex, type SearchIndex } from '../domain/search/index';
import type { SearchQuery, SearchResult } from '../domain/search/types';
import {
  appendEvent,
  loadEvents,
  reduce,
  loadSnapshot,
  deleteSnapshot,
} from '../domain/task/eventlog';
import {
  setAsyncEventlogStorage,
  loadEventsAsync,
  loadSnapshotAsync,
  reduce as reduceAsyncReducer,
} from '../domain/task/eventlog.async';
import type { TaskEvent } from '../domain/task/events';
import { isToday, isLater, isDone } from '../domain/task/lanes';
import { CreateTaskInputSchema } from '../domain/task/schema';
// Async facade (new)
import type { Task } from '../domain/task/schema';
import { computeStateHash } from '../domain/task/snapshot';
import { compareTasks } from '../domain/task/sort';
import { deriveUndo, type UndoEntry } from '../domain/task/undo';
import type { TaskId, TaskStatus } from '../types/task';

interface TaskStore {
  byId: Record<TaskId, Task>;
  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
  addTask: (input: unknown) => void;
  updateTask: (id: TaskId, patch: Partial<Task>) => void;
  moveTask: (id: TaskId, status: TaskStatus) => void;
  completeTask: (id: TaskId) => void;
  snoozeTask: (id: TaskId, until: string) => void;
  quickAdd: (line: string, now?: Date) => { id: string };
  undo: () => void;
  redo: () => void;
  hydrate: () => void;
  hydrateAsync: () => Promise<void>;
}

// Lazy singleton search index
let searchIndexInstance: SearchIndex | null = null;

export const getSearchIndex = (state: TaskStore): SearchIndex => {
  if (!searchIndexInstance) {
    searchIndexInstance = createSearchIndex();
    searchIndexInstance.build(Object.values(state.byId));
  }
  return searchIndexInstance;
};

export const selectSearch = (
  state: TaskStore,
  query: SearchQuery
): SearchResult => {
  const index = getSearchIndex(state);
  // Always rebuild the index to ensure it's up-to-date with current tasks
  index.build(Object.values(state.byId));
  return index.search(query);
};

export const selectToday = (state: TaskStore): Task[] =>
  Object.values(state.byId).filter(isToday).sort(compareTasks);

export const selectLater = (state: TaskStore): Task[] =>
  Object.values(state.byId).filter(isLater).sort(compareTasks);

export const selectDone = (state: TaskStore): Task[] =>
  Object.values(state.byId)
    .filter(isDone)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

export const selectQuery = (
  state: TaskStore,
  q: Query,
  page?: Page
): Result<Task> => runQuery(Object.values(state.byId), q, page);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  byId: {},
  undoStack: [],
  redoStack: [],

  addTask: (input: unknown) => {
    const validatedInput = CreateTaskInputSchema.parse(input);
    const id = generateId();
    const timestamp = new Date().toISOString();

    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp,
      payload: {
        id,
        ...validatedInput,
        tags: validatedInput.tags || [],
      },
    };

    const undoEvent = deriveUndo(event);
    const newTask: Task = {
      ...validatedInput,
      id,
      tags: validatedInput.tags || [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (undoEvent) {
      const undoEntry: UndoEntry = { do: event, undo: undoEvent };
      const state = get();
      const newUndoStack = [...state.undoStack, undoEntry].slice(-50); // Cap at 50
      set(state => ({
        byId: { ...state.byId, [id]: newTask },
        undoStack: newUndoStack,
        redoStack: [],
      }));
    } else {
      set(state => ({
        byId: { ...state.byId, [id]: newTask },
      }));
    }

    appendEvent(event);

    // Update search index
    if (searchIndexInstance) {
      searchIndexInstance.updateFromEvent(event);
    }
  },

  updateTask: (id: string, patch: Partial<Task>) => {
    const existingTask = get().byId[id];
    if (!existingTask) return;

    const timestamp = new Date().toISOString();
    const pendingUndoEntries: UndoEntry[] = [];

    // Handle status changes separately with TASK_MOVED
    if (patch.status && patch.status !== existingTask.status) {
      const moveEvent: TaskEvent = {
        type: 'TASK_MOVED',
        timestamp,
        payload: {
          id,
          fromStatus: existingTask.status,
          toStatus: patch.status,
        },
      };

      const undoEvent = deriveUndo(moveEvent, existingTask);
      if (undoEvent) {
        const undoEntry: UndoEntry = { do: moveEvent, undo: undoEvent };
        pendingUndoEntries.push(undoEntry);
      }

      appendEvent(moveEvent);
    }

    // Handle other changes with TASK_UPDATED
    const { status, id: _, createdAt, updatedAt, ...changes } = patch;
    const filteredChanges = Object.fromEntries(
      Object.entries(changes).filter(
        ([key, value]) =>
          value !== undefined &&
          ['title', 'dueDate', 'tags', 'notes'].includes(key)
      )
    );

    if (Object.keys(filteredChanges).length > 0) {
      const updateEvent: TaskEvent = {
        type: 'TASK_UPDATED',
        timestamp,
        payload: { id, changes: filteredChanges },
      };

      const undoEvent = deriveUndo(updateEvent, existingTask);
      if (undoEvent) {
        const undoEntry: UndoEntry = { do: updateEvent, undo: undoEvent };
        pendingUndoEntries.push(undoEntry);
      }

      appendEvent(updateEvent);

      // Update search index
      if (searchIndexInstance) {
        searchIndexInstance.updateFromEvent(updateEvent);
      }
    }

    const updatedTask = { ...existingTask, ...patch, updatedAt: timestamp };

    // Apply all changes in a single set call
    if (pendingUndoEntries.length > 0) {
      const state = get();
      const newUndoStack = [...state.undoStack, ...pendingUndoEntries].slice(
        -50
      );
      set(state => ({
        byId: { ...state.byId, [id]: updatedTask },
        undoStack: newUndoStack,
        redoStack: [],
      }));
    } else {
      set(state => ({
        byId: { ...state.byId, [id]: updatedTask },
      }));
    }
  },

  moveTask: (id: TaskId, status: TaskStatus) => {
    const currentTask = get().byId[id];
    if (!currentTask) return;

    const timestamp = new Date().toISOString();
    const event: TaskEvent = {
      type: 'TASK_MOVED',
      timestamp,
      payload: {
        id,
        fromStatus: currentTask.status,
        toStatus: status,
      },
    };

    const undoEvent = deriveUndo(event, currentTask);
    appendEvent(event);

    // Update search index
    if (searchIndexInstance) {
      searchIndexInstance.updateFromEvent(event);
    }

    if (undoEvent) {
      const undoEntry: UndoEntry = { do: event, undo: undoEvent };
      const state = get();
      const newUndoStack = [...state.undoStack, undoEntry].slice(-50);
      set(state => ({
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], status, updatedAt: timestamp },
        },
        undoStack: newUndoStack,
        redoStack: [],
      }));
    } else {
      set(state => ({
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], status, updatedAt: timestamp },
        },
      }));
    }
  },

  completeTask: (id: TaskId) => {
    const currentTask = get().byId[id];
    if (!currentTask) return;

    const timestamp = new Date().toISOString();
    const event: TaskEvent = {
      type: 'TASK_COMPLETED',
      timestamp,
      payload: { id },
    };

    const undoEvent = deriveUndo(event, currentTask);
    appendEvent(event);

    // Update search index
    if (searchIndexInstance) {
      searchIndexInstance.updateFromEvent(event);
    }

    if (undoEvent) {
      const undoEntry: UndoEntry = { do: event, undo: undoEvent };
      const state = get();
      const newUndoStack = [...state.undoStack, undoEntry].slice(-50);
      set(state => ({
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], status: 'DONE', updatedAt: timestamp },
        },
        undoStack: newUndoStack,
        redoStack: [],
      }));
    } else {
      set(state => ({
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], status: 'DONE', updatedAt: timestamp },
        },
      }));
    }
  },

  snoozeTask: (id: TaskId, until: string) => {
    const currentTask = get().byId[id];
    if (!currentTask) return;

    const timestamp = new Date().toISOString();
    const event: TaskEvent = {
      type: 'TASK_SNOOZED',
      timestamp,
      payload: { id, snoozeUntil: until },
    };

    const undoEvent = deriveUndo(event, currentTask);
    appendEvent(event);

    // Update search index
    if (searchIndexInstance) {
      searchIndexInstance.updateFromEvent(event);
    }

    if (undoEvent) {
      const undoEntry: UndoEntry = { do: event, undo: undoEvent };
      const state = get();
      const newUndoStack = [...state.undoStack, undoEntry].slice(-50);
      set(state => ({
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], snoozeUntil: until, updatedAt: timestamp },
        },
        undoStack: newUndoStack,
        redoStack: [],
      }));
    } else {
      set(state => ({
        byId: {
          ...state.byId,
          [id]: { ...state.byId[id], snoozeUntil: until, updatedAt: timestamp },
        },
      }));
    }
  },

  quickAdd: (line: string, now?: Date) => {
    const quickAddResult = parseQuickAdd(line, now);
    const input = toCreateTaskInput(quickAddResult);
    const validatedInput = CreateTaskInputSchema.parse(input);
    const id = generateId();
    const timestamp = new Date().toISOString();

    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp,
      payload: {
        id,
        ...validatedInput,
        tags: validatedInput.tags || [],
      },
    };

    const undoEvent = deriveUndo(event);
    const newTask: Task = {
      ...validatedInput,
      id,
      tags: validatedInput.tags || [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (undoEvent) {
      const undoEntry: UndoEntry = { do: event, undo: undoEvent };
      const state = get();
      const newUndoStack = [...state.undoStack, undoEntry].slice(-50);
      set(state => ({
        byId: { ...state.byId, [id]: newTask },
        undoStack: newUndoStack,
        redoStack: [],
      }));
    } else {
      set(state => ({
        byId: { ...state.byId, [id]: newTask },
      }));
    }

    appendEvent(event);

    // Update search index
    if (searchIndexInstance) {
      searchIndexInstance.updateFromEvent(event);
    }

    return { id };
  },

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;

    const undoEntry = state.undoStack.at(-1);
    const newUndoStack = state.undoStack.slice(0, -1);
    const newRedoStack = [...state.redoStack, undoEntry].slice(-50);

    // Apply the undo event to the current state
    const currentState = get().byId;
    const event = undoEntry.undo;

    switch (event.type) {
      case 'TASK_CREATED': {
        const { id } = event.payload;
        const { [id]: removedTask, ...remainingTasks } = currentState;
        set(() => ({
          byId: remainingTasks,
          undoStack: newUndoStack,
          redoStack: newRedoStack,
        }));
        break;
      }
      case 'TASK_UPDATED': {
        const { id, changes } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const updatedTask = {
            ...existingTask,
            ...Object.fromEntries(
              Object.entries(changes).filter(
                ([_, value]) => value !== undefined
              )
            ),
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
      case 'TASK_MOVED': {
        const { id, toStatus } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          // Special case: moving to ARCHIVED during undo means deletion (task creation reversal)
          if (toStatus === 'ARCHIVED') {
            const { [id]: removedTask, ...remainingTasks } = currentState;
            set(() => ({
              byId: remainingTasks,
              undoStack: newUndoStack,
              redoStack: newRedoStack,
            }));
          } else {
            const updatedTask = {
              ...existingTask,
              status: toStatus,
              updatedAt: event.timestamp,
            };
            set(() => ({
              byId: { ...currentState, [id]: updatedTask },
              undoStack: newUndoStack,
              redoStack: newRedoStack,
            }));
          }
        }
        break;
      }
      case 'TASK_COMPLETED': {
        // This reverses completion, so we need to restore the previous status
        const { id } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const originalEvent = undoEntry.do;
          let previousStatus: TaskStatus = 'TODAY';

          if (originalEvent.type === 'TASK_COMPLETED') {
            // Find the previous status from task history or default to TODAY
            previousStatus = 'TODAY';
          }

          const updatedTask = {
            ...existingTask,
            status: previousStatus,
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
      case 'TASK_SNOOZED': {
        const { id } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const { snoozeUntil, ...taskWithoutSnooze } = existingTask;
          const updatedTask = {
            ...taskWithoutSnooze,
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
    }
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;

    const redoEntry = state.redoStack.at(-1);
    const newRedoStack = state.redoStack.slice(0, -1);
    const newUndoStack = [...state.undoStack, redoEntry].slice(-50);

    // Apply the redo event (which is the original 'do' event)
    const currentState = get().byId;
    const event = redoEntry.do;

    switch (event.type) {
      case 'TASK_CREATED': {
        const { id, ...taskData } = event.payload;
        const newTask: Task = {
          ...taskData,
          id,
          createdAt: event.timestamp,
          updatedAt: event.timestamp,
        };
        set(() => ({
          byId: { ...currentState, [id]: newTask },
          undoStack: newUndoStack,
          redoStack: newRedoStack,
        }));
        break;
      }
      case 'TASK_UPDATED': {
        const { id, changes } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const updatedTask = {
            ...existingTask,
            ...Object.fromEntries(
              Object.entries(changes).filter(
                ([_, value]) => value !== undefined
              )
            ),
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
      case 'TASK_MOVED': {
        const { id, toStatus } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const updatedTask = {
            ...existingTask,
            status: toStatus,
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
      case 'TASK_COMPLETED': {
        const { id } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const updatedTask = {
            ...existingTask,
            status: 'DONE' as const,
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
      case 'TASK_SNOOZED': {
        const { id, snoozeUntil } = event.payload;
        const existingTask = currentState[id];
        if (existingTask) {
          const updatedTask = {
            ...existingTask,
            snoozeUntil,
            updatedAt: event.timestamp,
          };
          set(() => ({
            byId: { ...currentState, [id]: updatedTask },
            undoStack: newUndoStack,
            redoStack: newRedoStack,
          }));
        }
        break;
      }
    }
  },

  hydrate: () => {
    const snapshot = loadSnapshot();

    if (snapshot) {
      // Validate base snapshot first (before tail)
      const baseHash = computeStateHash(snapshot.tasks);
      if (baseHash !== snapshot.meta.stateHash) {
        deleteSnapshot();
        const allEvents = loadEvents();
        const fullTasks = reduce(allEvents);

        // Enforce invariants
        for (const task of Object.values(fullTasks)) {
          if (new Date(task.createdAt) > new Date(task.updatedAt)) {
            task.updatedAt = task.createdAt;
          }

          if (task.status === 'DONE' && !task.updatedAt) {
            task.updatedAt = task.createdAt;
          }
        }

        set({ byId: fullTasks });

        // Rebuild search index after hydration
        if (searchIndexInstance) {
          searchIndexInstance.build(Object.values(fullTasks));
        }
        return;
      }

      // Snapshot seems valid — continue with tail
      const events = loadEvents();

      // Determine tail start index. If the log has been compacted after the snapshot,
      // the current log length may be < baseEventCount (we trimmed the head).
      // In that case, treat the entire current log as the tail.
      const tailStart =
        events.length < snapshot.meta.baseEventCount
          ? 0
          : snapshot.meta.baseEventCount;
      const tailEvents = events.slice(tailStart);

      // Start with snapshot state
      let finalTasks = { ...snapshot.tasks };

      if (tailEvents.length > 0) {
        // Apply tail events starting from snapshot state
        finalTasks = reduce(tailEvents, snapshot.tasks);
      }

      // Enforce invariants
      for (const task of Object.values(finalTasks)) {
        if (new Date(task.createdAt) > new Date(task.updatedAt)) {
          task.updatedAt = task.createdAt;
        }

        if (task.status === 'DONE' && !task.updatedAt) {
          task.updatedAt = task.createdAt;
        }
      }

      set({ byId: finalTasks });
    } else {
      // Fallback to full event log reduction
      const events = loadEvents();
      const tasks = reduce(events);

      // Enforce invariants
      for (const task of Object.values(tasks)) {
        if (new Date(task.createdAt) > new Date(task.updatedAt)) {
          task.updatedAt = task.createdAt;
        }

        if (task.status === 'DONE' && !task.updatedAt) {
          task.updatedAt = task.createdAt;
        }
      }

      set({ byId: tasks });
    }

    // Rebuild search index after hydration
    if (searchIndexInstance) {
      searchIndexInstance.build(Object.values(get().byId));
    }
  },

  // New: async hydration for encrypted/remote-backed storage
  hydrateAsync: async () => {
    // Try snapshot-first using async storage
    const snap = await loadSnapshotAsync();
    if (snap) {
      const allEvents = await loadEventsAsync();
      const base = snap.meta.baseEventCount ?? 0;
      const tail = base <= allEvents.length ? allEvents.slice(base) : [];
      const tasks = reduceAsyncReducer(tail, snap.tasks);

      // Enforce invariants (same as sync path)
      for (const t of Object.values(tasks)) {
        if (new Date(t.createdAt) > new Date(t.updatedAt))
          t.updatedAt = t.createdAt;
        if (t.status === 'DONE' && !t.updatedAt) t.updatedAt = t.createdAt;
      }
      set({ byId: tasks });
    } else {
      // Fallback: reduce all events
      const events = await loadEventsAsync();
      const tasks = reduceAsyncReducer(events);
      for (const t of Object.values(tasks)) {
        if (new Date(t.createdAt) > new Date(t.updatedAt))
          t.updatedAt = t.createdAt;
        if (t.status === 'DONE' && !t.updatedAt) t.updatedAt = t.createdAt;
      }
      set({ byId: tasks });
    }

    // Rebuild search index after hydration
    if (searchIndexInstance) {
      const state = get();
      searchIndexInstance.build(Object.values(state.byId));
    }
  },
}));

import type { StorageDriver } from '../domain/task/eventlog.async';

// Optional: small helper to wire the async storage once (used by E2EE bootstrap)
export function configureAsyncEventlogStorage(driver: StorageDriver) {
  setAsyncEventlogStorage(driver);
}
