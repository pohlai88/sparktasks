/**
 * Enhanced State Management for M0 Foundation Enterprise
 * Optimized reducer with better performance and error handling
 */
import React, { createContext, useContext, useMemo, useReducer } from 'react';

import type { AppState, AppAction, Task, AuditEntry } from '@/types';

// Performance optimization: Generate IDs more efficiently
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): number {
  return Date.now();
}

// Demo data with proper typing
const initialState: AppState = {
  residency: 'Local',
  tasks: {
    t1: {
      id: 't1',
      title: 'Reconcile AP',
      assignee: 'Andy',
      due: '2025-08-23',
      tags: ['#close'],
      priority: 'high',
      createdAt: now() - 600000,
      updatedAt: now() - 600000,
    },
    t2: {
      id: 't2',
      title: 'Prepare SOX evidence',
      assignee: 'Cindy',
      tags: ['#audit'],
      priority: 'medium',
      createdAt: now() - 500000,
      updatedAt: now() - 500000,
    },
    t3: {
      id: 't3',
      title: 'Vendor invoice 12345',
      assignee: 'Cindy',
      due: '2025-08-22',
      tags: ['#ap'],
      priority: 'critical',
      createdAt: now() - 400000,
      updatedAt: now() - 400000,
    },
  },
  columns: {
    backlog: { id: 'backlog', name: 'Backlog', taskIds: ['t1'], order: 0 },
    progress: {
      id: 'progress',
      name: 'In Progress',
      taskIds: ['t2'],
      order: 1,
    },
    review: { id: 'review', name: 'Review', taskIds: ['t3'], order: 2 },
    done: { id: 'done', name: 'Done', taskIds: [], order: 3 },
  },
  columnOrder: ['backlog', 'progress', 'review', 'done'],
  auditLog: {
    t1: [
      {
        id: generateId(),
        ts: now() - 600000,
        actor: 'System',
        action: 'create',
      },
    ],
    t2: [
      {
        id: generateId(),
        ts: now() - 500000,
        actor: 'System',
        action: 'create',
      },
    ],
    t3: [
      {
        id: generateId(),
        ts: now() - 400000,
        actor: 'System',
        action: 'create',
      },
    ],
  },
  isLoading: false,
};

// Optimized reducer with better performance
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_DEMO':
      return { ...initialState };

    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };

    case 'SET_ERROR':
      return { ...state, error: action.error };

    case 'SET_RESIDENCY':
      return {
        ...state,
        residency: action.mode,
        auditLog: {
          ...state.auditLog,
          system: [
            ...(state.auditLog.system || []),
            {
              id: generateId(),
              ts: now(),
              actor: 'System',
              action: 'residency_change',
              payload: { from: state.residency, to: action.mode },
            },
          ],
        },
      };

    case 'ADD_TASK': {
      const { columnId, task, actor } = action;
      const column = state.columns[columnId];

      if (!column) {
        return { ...state, error: `Column ${columnId} not found` };
      }

      const newTask: Task = {
        ...task,
        createdAt: now(),
        updatedAt: now(),
      };

      const auditEntry: AuditEntry = {
        id: generateId(),
        ts: now(),
        actor,
        action: 'create',
        payload: { task: newTask },
      };

      return {
        ...state,
        tasks: { ...state.tasks, [task.id]: newTask },
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            taskIds: [task.id, ...column.taskIds],
          },
        },
        auditLog: {
          ...state.auditLog,
          [task.id]: [auditEntry],
        },
        error: undefined,
      };
    }

    case 'UPDATE_TASK': {
      const { taskId, updates, actor } = action;
      const existingTask = state.tasks[taskId];

      if (!existingTask) {
        return { ...state, error: `Task ${taskId} not found` };
      }

      const updatedTask: Task = {
        ...existingTask,
        ...updates,
        updatedAt: now(),
      };

      const auditEntry: AuditEntry = {
        id: generateId(),
        ts: now(),
        actor,
        action: 'update',
        payload: { updates },
      };

      return {
        ...state,
        tasks: { ...state.tasks, [taskId]: updatedTask },
        auditLog: {
          ...state.auditLog,
          [taskId]: [...(state.auditLog[taskId] || []), auditEntry],
        },
        error: undefined,
      };
    }

    case 'DELETE_TASK': {
      const { taskId, columnId, actor } = action;
      const column = state.columns[columnId];

      if (!column || !state.tasks[taskId]) {
        return {
          ...state,
          error: `Task ${taskId} or column ${columnId} not found`,
        };
      }

      const auditEntry: AuditEntry = {
        id: generateId(),
        ts: now(),
        actor,
        action: 'delete',
        payload: { task: state.tasks[taskId] },
      };

      const { [taskId]: deletedTask, ...remainingTasks } = state.tasks;

      return {
        ...state,
        tasks: remainingTasks,
        columns: {
          ...state.columns,
          [columnId]: {
            ...column,
            taskIds: column.taskIds.filter(id => id !== taskId),
          },
        },
        auditLog: {
          ...state.auditLog,
          [taskId]: [...(state.auditLog[taskId] || []), auditEntry],
        },
        error: undefined,
      };
    }

    case 'MOVE_TASK': {
      const { taskId, from, to, index, actor } = action;
      const fromColumn = state.columns[from];
      const toColumn = state.columns[to];

      if (!fromColumn || !toColumn || !state.tasks[taskId]) {
        return { ...state, error: 'Invalid move operation' };
      }

      // Don't update if moving to same position
      if (from === to && fromColumn.taskIds.indexOf(taskId) === index) {
        return state;
      }

      const auditEntry: AuditEntry = {
        id: generateId(),
        ts: now(),
        actor,
        action: `move:${from}→${to}`,
        payload: { from, to, index },
      };

      const fromTaskIds = fromColumn.taskIds.filter(id => id !== taskId);
      const toTaskIds = [...toColumn.taskIds];

      if (from !== to) {
        toTaskIds.splice(index, 0, taskId);
      } else {
        toTaskIds.splice(index, 0, taskId);
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          [from]: { ...fromColumn, taskIds: fromTaskIds },
          [to]: { ...toColumn, taskIds: toTaskIds },
        },
        auditLog: {
          ...state.auditLog,
          [taskId]: [...(state.auditLog[taskId] || []), auditEntry],
        },
        error: undefined,
      };
    }

    default:
      return state;
  }
}

// Context setup with better typing
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    addTask: (
      columnId: string,
      task: Omit<Task, 'createdAt' | 'updatedAt'>,
      actor?: string
    ) => void;
    updateTask: (
      taskId: string,
      updates: Partial<Task>,
      actor?: string
    ) => void;
    deleteTask: (taskId: string, columnId: string, actor?: string) => void;
    moveTask: (
      taskId: string,
      from: string,
      to: string,
      index: number,
      actor?: string
    ) => void;
    setResidency: (mode: AppState['residency']) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error?: string) => void;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoized action creators for better performance
  const actions = useMemo(
    () => ({
      addTask: (
        columnId: string,
        task: Omit<Task, 'createdAt' | 'updatedAt'>,
        actor = 'User'
      ) => dispatch({ type: 'ADD_TASK', columnId, task: task as Task, actor }),
      updateTask: (taskId: string, updates: Partial<Task>, actor = 'User') =>
        dispatch({ type: 'UPDATE_TASK', taskId, updates, actor }),
      deleteTask: (taskId: string, columnId: string, actor = 'User') =>
        dispatch({ type: 'DELETE_TASK', taskId, columnId, actor }),
      moveTask: (
        taskId: string,
        from: string,
        to: string,
        index: number,
        actor = 'User'
      ) => dispatch({ type: 'MOVE_TASK', taskId, from, to, index, actor }),
      setResidency: (mode: AppState['residency']) =>
        dispatch({ type: 'SET_RESIDENCY', mode }),
      setLoading: (isLoading: boolean) =>
        dispatch({ type: 'SET_LOADING', isLoading }),
      setError: (error?: string | undefined) =>
        dispatch({ type: 'SET_ERROR', error }),
    }),
    []
  );

  const contextValue = useMemo(
    () => ({ state, dispatch, actions }),
    [state, actions]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Optimized selector hooks for better performance
export function useAppState() {
  return useApp().state;
}

export function useAppActions() {
  return useApp().actions;
}

export function useTasks() {
  const { state } = useApp();
  return useMemo(() => state.tasks, [state.tasks]);
}

export function useColumns() {
  const { state } = useApp();
  return useMemo(() => state.columns, [state.columns]);
}

export function useAuditLog(taskId?: string) {
  const { state } = useApp();
  return useMemo(() => {
    if (taskId) {
      return state.auditLog[taskId] || [];
    }
    return state.auditLog;
  }, [state.auditLog, taskId]);
}
