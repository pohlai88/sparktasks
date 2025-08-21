// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

/**
 * Centralized Test ID Registry - SSOT for all test selectors
 * Prevents typos, enables refactoring without breaking tests
 */
export const TEST_IDS = {
  // A4 Search & Quick-Add
  searchInput: 'search-input',
  searchResults: 'search-results',
  searchOption: (text: string) =>
    `search-option-${text.toLowerCase().replace(/\s+/g, '-')}`,
  quickAddForm: 'quick-add-form',
  quickAddInput: 'quick-add-input',
  quickAddButton: 'quick-add-button',
  quickAddError: 'quick-add-error',

  // Task Management
  taskCard: (id: string) => `task-${id}`,
  taskTitle: (id: string) => `task-title-${id}`,
  taskPriority: (id: string) => `task-priority-${id}`,
  taskCompleteButton: (id: string) => `task-complete-${id}`,
  taskMoveButton: (id: string) => `task-move-${id}`,
  taskSnoozeButton: (id: string) => `task-snooze-${id}`,
  taskDeleteButton: (id: string) => `task-delete-${id}`,
  taskEditButton: (id: string) => `task-edit-${id}`,

  // Columns & Navigation
  todayColumn: 'today-column',
  todayTasks: 'today-tasks',
  laterColumn: 'later-column',
  laterTasks: 'later-tasks',
  doneColumn: 'done-column',
  doneTasks: 'done-tasks',
  columnHeader: (name: string) => `column-header-${name.toLowerCase()}`,
  taskCount: (column: string) => `task-count-${column.toLowerCase()}`,

  // Forms & Dialogs
  taskForm: 'task-form',
  taskFormTitle: 'task-form-title',
  taskFormNotes: 'task-form-notes',
  taskFormPriority: 'task-form-priority',
  taskFormTags: 'task-form-tags',
  taskFormSubmit: 'task-form-submit',
  taskFormCancel: 'task-form-cancel',

  // Menus & Dropdowns
  moveMenu: 'move-menu',
  moveOption: (status: string) => `move-option-${status.toLowerCase()}`,
  priorityMenu: 'priority-menu',
  priorityOption: (priority: string) =>
    `priority-option-${priority.toLowerCase()}`,

  // Toast & Notifications
  toast: 'toast-message',
  toastSuccess: 'toast-success',
  toastError: 'toast-error',
  undoButton: 'undo-button',
  redoButton: 'redo-button',
  undoToast: 'undo-toast',

  // Application Shell
  appHeader: 'app-header',
  appTitle: 'app-title',
  mainContent: 'main-content',
  loadingSpinner: 'loading-spinner',
  errorBoundary: 'error-boundary',

  // Accessibility & Navigation
  skipLink: 'skip-to-content',
  screenReaderOnly: 'sr-only',
  focusIndicator: 'focus-indicator',
  keyboardShortcutsHelp: 'keyboard-shortcuts',

  // Empty States
  emptyState: 'empty-state',
  emptyStateMessage: 'empty-state-message',
  emptyStateAction: 'empty-state-action',
  firstTaskButton: 'add-first-task-button',
} as const;

/**
 * Layered selector utility - tries data-testid first, falls back to accessibility
 * SSOT pattern: Always use TEST_IDS registry, never hardcode selectors
 */
export class LayeredSelector {
  constructor(private page: any) {}

  /**
   * Get element by test ID with accessibility fallback
   * @param testId - Use TEST_IDS constant, never hardcode
   * @param role - ARIA role for accessibility validation
   * @param name - Accessible name for screen readers
   */
  getByTestIdOrRole(testId: string, role: string, name?: string | RegExp) {
    // Try data-testid first (stable, refactor-safe)
    const byTestId = this.page.getByTestId(testId);

    // Fallback to role + name for accessibility validation
    const byRole = name
      ? this.page.getByRole(role, { name })
      : this.page.getByRole(role);

    return {
      testId: byTestId,
      role: byRole,
      // Use testId if it exists, otherwise fallback to role
      element: byTestId.or(byRole),
      // Additional helper methods
      first: () => byTestId.or(byRole).first(),
      last: () => byTestId.or(byRole).last(),
      nth: (index: number) => byTestId.or(byRole).nth(index),
    };
  }

  /**
   * Accessibility-first selector for ARIA compliance testing
   */
  getAccessible(role: string, name?: string | RegExp) {
    return name
      ? this.page.getByRole(role, { name })
      : this.page.getByRole(role);
  }

  /**
   * SSOT Task selector - uses TEST_IDS registry
   */
  getTask(id: string) {
    const testId = TEST_IDS.taskCard(id);
    return {
      card: this.page.getByTestId(testId),
      complete: this.page.getByTestId(TEST_IDS.taskCompleteButton(id)),
      move: this.page.getByTestId(TEST_IDS.taskMoveButton(id)),
      snooze: this.page.getByTestId(TEST_IDS.taskSnoozeButton(id)),
      delete: this.page.getByTestId(TEST_IDS.taskDeleteButton(id)),
      edit: this.page.getByTestId(TEST_IDS.taskEditButton(id)),
    };
  }

  /**
   * SSOT Column selector - uses TEST_IDS registry
   */
  getColumn(name: 'today' | 'later' | 'done') {
    const columnId =
      name === 'today'
        ? TEST_IDS.todayColumn
        : name === 'later'
          ? TEST_IDS.laterColumn
          : TEST_IDS.doneColumn;

    const tasksId =
      name === 'today'
        ? TEST_IDS.todayTasks
        : name === 'later'
          ? TEST_IDS.laterTasks
          : TEST_IDS.doneTasks;

    return {
      column: this.page.getByTestId(columnId),
      tasks: this.page.getByTestId(tasksId),
      header: this.page.getByTestId(TEST_IDS.columnHeader(name)),
      count: this.page.getByTestId(TEST_IDS.taskCount(name)),
    };
  }

  /**
   * SSOT Search selector - uses TEST_IDS registry
   */
  getSearch() {
    return {
      input: this.page.getByTestId(TEST_IDS.searchInput),
      results: this.page.getByTestId(TEST_IDS.searchResults),
      option: (text: string) =>
        this.page.getByTestId(TEST_IDS.searchOption(text)),
    };
  }

  /**
   * SSOT QuickAdd selector - uses TEST_IDS registry
   */
  getQuickAdd() {
    return {
      form: this.page.getByTestId(TEST_IDS.quickAddForm),
      input: this.page.getByTestId(TEST_IDS.quickAddInput),
      button: this.page.getByTestId(TEST_IDS.quickAddButton),
      error: this.page.getByTestId(TEST_IDS.quickAddError),
    };
  }

  /**
   * Deprecated - use getByTestIdOrRole instead
   * @deprecated
   */
  legacy_getByText(text: string) {
    console.warn(
      'DEPRECATED: Use getByTestIdOrRole with TEST_IDS registry instead'
    );
    return this.page.getByText(text);
  }
}
