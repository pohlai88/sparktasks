// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import type { Task } from '../../src/domain/task/schema';

/**
 * Deterministic test fixtures - eliminates randomness for reproducible tests
 */
export const sampleTasks: Task[] = [
  {
    id: 'test-task-1',
    title: 'Buy milk',
    status: 'TODAY',
    priority: 'P2',
    createdAt: '2025-08-17T10:00:00Z',
    updatedAt: '2025-08-17T10:00:00Z',
    tags: ['grocery'],
    notes: 'Get organic milk from the store',
  },
  {
    id: 'test-task-2',
    title: 'Walk dog',
    status: 'DONE',
    priority: 'P1',
    createdAt: '2025-08-17T09:00:00Z',
    updatedAt: '2025-08-17T11:00:00Z',
    tags: ['pets', 'exercise'],
    notes: 'Daily exercise routine',
  },
  {
    id: 'test-task-3',
    title: 'Review code',
    status: 'LATER',
    priority: 'P0',
    createdAt: '2025-08-17T08:00:00Z',
    updatedAt: '2025-08-17T08:00:00Z',
    tags: ['work', 'urgent'],
    notes: 'PR #123 needs review',
  },
];

/**
 * Keyboard interaction test cases
 */
export const keyboardTestCases = [
  { key: 'j', description: 'Move down in task list' },
  { key: 'k', description: 'Move up in task list' },
  { key: ' ', description: 'Toggle task completion' },
  { key: 'm', description: 'Open move menu' },
  { key: 's', description: 'Snooze task' },
  { key: 'Escape', description: 'Close dialogs/menus' },
  { key: 'Tab', description: 'Navigate forward' },
  { key: 'Shift+Tab', description: 'Navigate backward' },
];

/**
 * ARIA compliance test expectations
 */
export const ariaExpectations = {
  searchInput: {
    role: 'textbox',
    'aria-expanded': 'false',
    'aria-haspopup': 'listbox',
    'aria-label': 'Search tasks',
  },
  quickAddInput: {
    role: 'textbox',
    'aria-label': 'Quick add task',
  },
  taskCard: {
    role: 'article',
    'aria-label': /Task: .+/,
  },
  taskList: {
    role: 'list',
    'aria-label': /.+ tasks/,
  },
};

/**
 * Seed test data into application state
 */
export async function seedTasks(page: any, tasks: Task[] = sampleTasks) {
  await page.evaluate((tasks: Task[]) => {
    // Clear existing state
    localStorage.clear();

    // Set up deterministic task state
    const taskState = {
      tasks: tasks.reduce(
        (acc: Record<string, Task>, task: Task) => ({
          ...acc,
          [task.id]: task,
        }),
        {}
      ),
      taskIds: tasks.map((t: Task) => t.id),
      nextId: tasks.length + 1,
    };

    localStorage.setItem('spark-tasks', JSON.stringify(taskState));
  }, tasks);

  // Reload to apply state
  await page.reload();
}

/**
 * Wait for application to be ready with seeded data
 */
export async function waitForAppReady(page: any) {
  // Wait for main UI elements to be visible
  await page.getByText('SparkTasks').waitFor({ state: 'visible' });

  // Wait for task columns to be rendered
  await page
    .getByRole('heading', { name: 'Today' })
    .waitFor({ state: 'visible' });
  await page
    .getByRole('heading', { name: 'Later' })
    .waitFor({ state: 'visible' });
  await page
    .getByRole('heading', { name: 'Done' })
    .waitFor({ state: 'visible' });
}

/**
 * Take accessibility snapshot for regression testing
 */
export async function takeAccessibilitySnapshot(page: any) {
  const snapshot = await page.accessibility.snapshot();
  return snapshot;
}
