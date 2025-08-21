// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { Page } from '@playwright/test';
import { TEST_IDS } from './test-ids';

/**
 * Migration utilities for converting legacy selectors to SSOT patterns
 */
export class SelectorMigration {
  constructor(private page: Page) {}

  /**
   * Convert common legacy patterns to SSOT selectors
   */
  migrate = {
    // Task operations
    taskCard: (taskText: string) => {
      // OLD: page.getByText(taskText).locator('..')
      // NEW: Use task ID if available, fallback to role
      return this.page.getByRole('article').filter({ hasText: taskText });
    },

    completeButton: (taskText: string) => {
      // OLD: page.getByText(taskText).locator('..').getByRole('button', { name: /complete/i })
      // NEW: Use SSOT selector
      const taskCard = this.page
        .getByRole('article')
        .filter({ hasText: taskText });
      return taskCard.getByRole('button', { name: /mark complete/i });
    },

    moveButton: (taskText: string) => {
      // NEW: Use the working pattern from original A2 tests
      return this.page.getByRole('button', { name: /move task/i }).first();
    },

    snoozeButton: (taskText: string) => {
      // OLD: Clock icon hunting
      // NEW: Accessible button
      const taskCard = this.page
        .getByRole('article')
        .filter({ hasText: taskText });
      return taskCard.getByRole('button', { name: /snooze to later/i });
    },

    // Form operations
    quickAddInput: () => {
      // NEW: Use SSOT test ID
      return this.page.getByTestId('quick-add-input');
    },

    quickAddButton: () => {
      // NEW: Use SSOT test ID for specific QuickAdd button
      return this.page.getByTestId('quick-add-button');
    },

    addTaskButton: (column?: string) => {
      // SSOT: Use column-specific test IDs to avoid conflicts
      if (column === 'Today') {
        return this.page.getByTestId('add-first-task-button-today');
      }
      // Fallback: Use the main QuickAdd button
      return this.page.getByTestId('quick-add-button');
    },

    searchInput: () => {
      // NEW: Use SSOT test ID
      return this.page.getByTestId('search-input');
    },

    // Column operations
    column: (columnName: string) => {
      // NEW: Use list role like working tests do
      return this.page.getByRole('list', {
        name: new RegExp(`${columnName} tasks`, 'i'),
      });
    },

    columnOption: (columnName: string) => {
      // NEW: Generic column option in dropdowns
      return this.page.getByRole('option', { name: columnName });
    },

    todayColumn: () => {
      // SSOT: Use consistent test ID (matches working A2 tests)
      return this.page.getByTestId('today-column');
    },

    laterColumn: () => {
      // SSOT: Use consistent test ID
      return this.page.getByTestId('later-column');
      return this.page.getByTestId('later-column');
    },

    doneColumn: () => {
      // SSOT: Use consistent test ID
      return this.page.getByTestId('done-column');
    },

    // Legacy support with warnings
    firstTaskButton: () => {
      console.warn(
        'DEPRECATED: addTaskButton selector. Use quickAddInput + quickAddButton for main add, or specific column buttons'
      );
      // Try to find "Add Your First Task" button
      return this.page.getByRole('button', { name: /add your first task/i });
    },
  };

  /**
   * Validate that current page has expected ARIA structure
   */
  async validatePageStructure() {
    // Check for main accessibility landmarks
    const landmarks = {
      header: this.page.getByRole('banner'),
      main: this.page.getByRole('main'),
      navigation: this.page.getByRole('navigation'),
    };

    const results = {
      hasHeader: (await landmarks.header.count()) > 0,
      hasMain: (await landmarks.main.count()) > 0,
      hasNav: (await landmarks.navigation.count()) > 0,
    };

    return results;
  }

  /**
   * Check for missing test IDs that should be added to components
   */
  async auditMissingTestIds() {
    const criticalElements = [
      { selector: TEST_IDS.searchInput, name: 'Search Input' },
      { selector: TEST_IDS.quickAddInput, name: 'Quick Add Input' },
      { selector: TEST_IDS.quickAddButton, name: 'Quick Add Button' },
      { selector: TEST_IDS.todayColumn, name: 'Today Column' },
      { selector: TEST_IDS.laterColumn, name: 'Later Column' },
      { selector: TEST_IDS.doneColumn, name: 'Done Column' },
    ];

    const missing = [];
    for (const element of criticalElements) {
      const count = await this.page.getByTestId(element.selector).count();
      if (count === 0) {
        missing.push(element.name);
      }
    }

    return missing;
  }
}

/**
 * Test helpers for common operations using SSOT patterns
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Create task via QuickAdd with SSOT selectors
   */
  async createTaskViaQuickAdd(taskTitle: string) {
    // Use SSOT test IDs to avoid button conflicts
    const quickAddInput = this.page.getByTestId('quick-add-input');
    const addButton = this.page.getByTestId('quick-add-button');

    // Clear any existing content
    await quickAddInput.clear();
    await quickAddInput.fill(taskTitle);

    // Click the button and wait for response
    await addButton.click();

    // Wait for the specific status message for our task (handles multiple status messages)
    try {
      await this.page
        .getByText(`Task created: ${taskTitle}`)
        .waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Fallback: wait for any status message containing "Task created"
      await this.page.waitForTimeout(1500);
    }

    // Extract the base title (before any parsing syntax like !p0 #tags)
    const baseTitle =
      taskTitle.split(' !')[0]?.split(' #')[0]?.split(' @')[0] || taskTitle;

    // Wait for task to appear in UI with retry logic
    try {
      await this.page
        .getByRole('article')
        .filter({ hasText: baseTitle })
        .waitFor({
          state: 'visible',
          timeout: 5000,
        });
      return true;
    } catch {
      // Final fallback: check if task exists even if not immediately visible
      const taskExists =
        (await this.page
          .getByRole('article')
          .filter({ hasText: baseTitle })
          .count()) > 0;
      console.log(
        `Task verification for "${taskTitle}": ${taskExists ? 'found (base: ${baseTitle})' : 'not found'}`
      );
      return taskExists;
    }
  }

  /**
   * Search for tasks with SSOT selectors
   */
  async searchTasks(query: string) {
    // Use SSOT test ID
    const searchInput = this.page.getByTestId('search-input');
    await searchInput.fill(query);

    // Wait for debounce
    await this.page.waitForTimeout(300);

    // Return results - use SSOT test ID
    return this.page.getByTestId('search-results');
  }

  /**
   * Complete task with accessibility validation
   */
  async completeTask(taskTitle: string) {
    const migration = new SelectorMigration(this.page);
    const completeButton = migration.migrate.completeButton(taskTitle);

    // Verify button is accessible
    const isVisible = await completeButton.isVisible();

    if (!isVisible) {
      throw new Error(`Complete button not visible for task: ${taskTitle}`);
    }

    await completeButton.click();

    // Verify completion toast or state change
    return this.page.getByText(/completed/i).first();
  }

  /**
   * Navigate between columns with keyboard
   */
  async navigateColumns(direction: 'left' | 'right') {
    await this.page.keyboard.press(
      direction === 'left' ? 'ArrowLeft' : 'ArrowRight'
    );
  }
}

/**
 * Patterns to avoid - will be flagged by linting rules
 */
export const DEPRECATED_PATTERNS = {
  // DON'T: Hardcoded text selectors
  getByText: 'Use getByTestIdOrRole with TEST_IDS registry',
  locator: 'Use specific test ID or role-based selector',

  // DON'T: Complex CSS selectors
  'css:': 'Use data-testid or ARIA roles',
  xpath: 'Use semantic selectors',

  // DON'T: Hardcoded waits
  waitForTimeout: 'Use expect().toBeVisible() or waitForSelector()',

  // DON'T: Index-based selection without context
  first: 'Use specific test ID or filter',
  last: 'Use specific test ID or filter',
  nth: 'Use specific test ID or filter',
} as const;
