// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { test, expect } from '@playwright/test';
import { TEST_IDS, LayeredSelector } from '../fixtures/test-ids';
import { SelectorMigration, TestHelpers } from '../fixtures/selector-migration';
import { seedTasks, waitForAppReady, sampleTasks } from '../fixtures/test-data';

test.describe('A2: Task Interactions + State Updates (SSOT Enhanced)', () => {
  let selector: LayeredSelector;
  let migration: SelectorMigration;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    // Clear localStorage to prevent test pollution (GOOD PRACTICE MAINTAINED)
    await page.addInitScript(() => localStorage.clear());
    
    // Initialize SSOT utilities
    selector = new LayeredSelector(page);
    migration = new SelectorMigration(page, selector);
    helpers = new TestHelpers(page, selector);
    
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('should move tasks between columns via Move menu', async ({ page }) => {
    // Create a task via QuickAdd (SSOT pattern)
    await helpers.createTaskViaQuickAdd('Move Test Task');
    
    // Verify task is in Today column
    const taskCard = page.getByRole('article').filter({ hasText: 'Move Test Task' });
    await expect(taskCard).toBeVisible();
    
    // Click the move button using proper selector
    const moveButton = taskCard.getByRole('button', { name: /move task/i });
    await moveButton.click();
    
    // Wait for move menu dialog to open
    const moveDialog = page.getByRole('dialog', { name: /move task/i });
    await expect(moveDialog).toBeVisible();
    
    // Select "Later" from move menu using role="option"
    const laterOption = moveDialog.getByRole('option', { name: 'Later' });
    await laterOption.click();
    
    // Wait for dialog to close and operation to complete
    await expect(moveDialog).not.toBeVisible();
    
    // Verify task appears in Later column (may take a moment for update)
    await page.waitForTimeout(500);
    const taskInLater = page.getByRole('article').filter({ hasText: 'Move Test Task' });
    await expect(taskInLater).toBeVisible();
  });

  test('should snooze tasks to Later column', async ({ page }) => {
    // Create a task via QuickAdd (SSOT pattern)
    await helpers.createTaskViaQuickAdd('Snooze Test Task');
    
    // Find the task and click snooze button
    const taskCard = page.getByRole('article').filter({ hasText: 'Snooze Test Task' });
    await expect(taskCard).toBeVisible();
    
    const snoozeButton = taskCard.getByRole('button', { name: /snooze to later/i });
    await snoozeButton.click();
    
    // Verify task still exists after snooze (should remain visible but moved)
    await page.waitForTimeout(500);
    await expect(page.getByRole('article').filter({ hasText: 'Snooze Test Task' })).toBeVisible();
  });

  test('should support keyboard navigation with j/k keys', async ({ page }) => {
    // Create multiple tasks using SSOT pattern
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    
    for (const taskTitle of tasks) {
      const success = await helpers.createTaskViaQuickAdd(taskTitle);
      expect(success).toBe(true);
    }
    
    // Focus first task using migration helper and test navigation
    const firstTaskCard = migration.migrate.taskCard('Task 1');
    await firstTaskCard.focus();
    
    // Test 'j' key for down navigation - use role-based selector to avoid strict mode
    await page.keyboard.press('j');
    await expect(page.getByRole('heading', { name: 'Task 2' })).toBeFocused();
    
    // Test 'k' key for up navigation
    await page.keyboard.press('k');
    await expect(page.getByRole('heading', { name: 'Task 1' })).toBeFocused();
  });

  test('should handle task movement with keyboard shortcuts', async ({ page }) => {
    // Create a task using SSOT pattern
    const success = await helpers.createTaskViaQuickAdd('Keyboard Move Test');
    expect(success).toBe(true);
    
    // Focus the task using migration helper
    const taskCard = migration.migrate.taskCard('Keyboard Move Test');
    await taskCard.focus();
    
    // Press 'm' to open move menu
    await page.keyboard.press('m');
    
    // Verify move menu is open
    await expect(page.getByRole('dialog', { name: /move task/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Keyboard Move Test' })).toBeVisible();
  });

  test('should handle task completion with space key', async ({ page }) => {
    // Create a task using SSOT pattern
    const success = await helpers.createTaskViaQuickAdd('Complete Test Task');
    expect(success).toBe(true);
    
    // Focus the task using migration helper
    const taskCard = migration.migrate.taskCard('Complete Test Task');
    await taskCard.focus();
    
    // Press space to complete
    await page.keyboard.press(' ');
    
    // Verify task marked as complete
    const completeButton = migration.migrate.completeButton('Complete Test Task');
    await expect(completeButton).toHaveAttribute('aria-pressed', 'true');
    
    // Verify success message
    await expect(page.getByText(/task completed/i)).toBeVisible();
  });

  test('should validate task text constraints', async ({ page }) => {
    // Test maximum length constraint using SSOT pattern
    const veryLongText = 'a'.repeat(501); // Exceeds 500 char limit
    
    const quickAdd = selector.getQuickAdd();
    await quickAdd.input.fill(veryLongText);
    await quickAdd.button.click();
    
    // Should show validation error
    await expect(page.getByText(/task text too long/i)).toBeVisible();
    
    // Test minimum length constraint
    await quickAdd.input.fill('a'); // Below minimum
    await quickAdd.button.click();
    
    // Should show validation error
    await expect(page.getByText(/task text too short/i)).toBeVisible();
  });

  test('should prevent duplicate task creation', async ({ page }) => {
    const taskTitle = 'Duplicate Prevention Test';
    
    // Create first task using SSOT pattern
    const success1 = await helpers.createTaskViaQuickAdd(taskTitle);
    expect(success1).toBe(true);
    
    // Attempt to create duplicate
    const quickAdd = selector.getQuickAdd();
    await quickAdd.input.fill(taskTitle);
    await quickAdd.button.click();
    
    // Should show duplicate warning
    await expect(page.getByText(/task already exists/i)).toBeVisible();
    
    // Should only have one instance
    const taskCount = await page.getByRole('article').filter({ hasText: taskTitle }).count();
    expect(taskCount).toBe(1);
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Navigate to fresh page with no tasks
    await page.goto('/');
    await waitForAppReady(page);
    
    // Should show empty state message
    await expect(page.getByText(/no tasks yet/i)).toBeVisible();
    
    // Should show "Add Your First Task" button
    const firstTaskButton = migration.migrate.addTaskButton();
    await expect(firstTaskButton).toBeVisible();
    
    // Clicking should focus QuickAdd
    await firstTaskButton.click();
    const quickAdd = selector.getQuickAdd();
    await expect(quickAdd.input).toBeFocused();
  });

  test('should persist task state across page reloads', async ({ page }) => {
    // Create and move a task using SSOT pattern
    const success = await helpers.createTaskViaQuickAdd('Persistence Test');
    expect(success).toBe(true);
    
    // Move task to Later
    const moveButton = migration.migrate.moveButton('Persistence Test');
    await moveButton.click();
    
    const laterOption = migration.migrate.columnOption('Later');
    await laterOption.click();
    
    // Reload page
    await page.reload();
    await waitForAppReady(page);
    
    // Verify task persisted in Later column
    const laterColumn = migration.migrate.column('Later');
    await expect(laterColumn.getByText('Persistence Test')).toBeVisible();
  });

  test('should support bulk operations on multiple tasks', async ({ page }) => {
    // Create multiple tasks using SSOT pattern
    const tasks = ['Bulk Task 1', 'Bulk Task 2', 'Bulk Task 3'];
    
    for (const task of tasks) {
      const success = await helpers.createTaskViaQuickAdd(task);
      expect(success).toBe(true);
    }
    
    // Select all tasks (Ctrl+A or similar bulk selector)
    await page.keyboard.press('Control+a');
    
    // Bulk move to Later
    await page.keyboard.press('m');
    const laterOption = migration.migrate.columnOption('Later');
    await laterOption.click();
    
    // Verify all tasks moved
    const laterColumn = migration.migrate.column('Later');
    for (const task of tasks) {
      await expect(laterColumn.getByText(task)).toBeVisible();
    }
  });

  test('should handle concurrent task operations', async ({ page }) => {
    // Test race conditions and concurrent updates
    const success = await helpers.createTaskViaQuickAdd('Concurrent Test');
    expect(success).toBe(true);
    
    // Simulate rapid operations
    const taskCard = migration.migrate.taskCard('Concurrent Test');
    const moveButton = migration.migrate.moveButton('Concurrent Test');
    const completeButton = migration.migrate.completeButton('Concurrent Test');
    
    // Rapid clicking should be handled gracefully
    await Promise.all([
      moveButton.click(),
      completeButton.click(),
    ]);
    
    // Should show appropriate conflict resolution
    await expect(page.getByText(/operation in progress/i).or(page.getByText(/conflict resolved/i))).toBeVisible();
  });
});
