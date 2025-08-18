// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { useEffect, useCallback, useState } from 'react';
import type { TaskId } from '../types/task';

interface KeyboardNavigationState {
  focusedTaskId: TaskId | null;
  isNavigationActive: boolean;
}

interface KeyboardNavigationActions {
  setFocusedTask: (taskId: TaskId | null) => void;
  navigateDown: () => void;
  navigateUp: () => void;
  openMoveMenu: () => void;
  exitNavigation: () => void;
}

interface UseKeyboardNavigationProps {
  taskIds: TaskId[];
  onMoveMenuOpen?: (taskId: TaskId) => void;
}

export function useKeyboardNavigation({
  taskIds,
  onMoveMenuOpen,
}: UseKeyboardNavigationProps): KeyboardNavigationState & KeyboardNavigationActions {
  const [focusedTaskId, setFocusedTaskId] = useState<TaskId | null>(null);
  const [isNavigationActive, setIsNavigationActive] = useState(false);

  const setFocusedTask = useCallback((taskId: TaskId | null) => {
    setFocusedTaskId(taskId);
    setIsNavigationActive(taskId !== null);
    
    // Persist keyboard navigation state
    if (taskId) {
      localStorage.setItem('spark-tasks-focused-id', taskId);
    } else {
      localStorage.removeItem('spark-tasks-focused-id');
    }
  }, []);

  const navigateDown = useCallback(() => {
    if (taskIds.length === 0) return;
    
    const currentIndex = focusedTaskId ? taskIds.indexOf(focusedTaskId) : -1;
    const nextIndex = currentIndex < taskIds.length - 1 ? currentIndex + 1 : 0;
    setFocusedTask(taskIds[nextIndex]);
  }, [taskIds, focusedTaskId, setFocusedTask]);

  const navigateUp = useCallback(() => {
    if (taskIds.length === 0) return;
    
    const currentIndex = focusedTaskId ? taskIds.indexOf(focusedTaskId) : -1;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : taskIds.length - 1;
    setFocusedTask(taskIds[prevIndex]);
  }, [taskIds, focusedTaskId, setFocusedTask]);

  const openMoveMenu = useCallback(() => {
    if (focusedTaskId && onMoveMenuOpen) {
      onMoveMenuOpen(focusedTaskId);
    }
  }, [focusedTaskId, onMoveMenuOpen]);

  const exitNavigation = useCallback(() => {
    setFocusedTask(null);
  }, [setFocusedTask]);

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields or modals
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          document.querySelector('[role="dialog"]')) {
        return;
      }

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;
        case 'k':
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;
        case 'm':
          e.preventDefault();
          openMoveMenu();
          break;
        case 'Escape':
          e.preventDefault();
          exitNavigation();
          break;
        case 'Tab':
          // Allow Tab to exit keyboard navigation
          if (!e.shiftKey) {
            exitNavigation();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateDown, navigateUp, openMoveMenu, exitNavigation]);

  // Restore focused task on mount
  useEffect(() => {
    const savedTaskId = localStorage.getItem('spark-tasks-focused-id');
    if (savedTaskId && taskIds.includes(savedTaskId)) {
      setFocusedTask(savedTaskId);
    }
  }, [taskIds, setFocusedTask]);

  return {
    focusedTaskId,
    isNavigationActive,
    setFocusedTask,
    navigateDown,
    navigateUp,
    openMoveMenu,
    exitNavigation,
  };
}
