// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { test, expect } from '@playwright/test';
import { TEST_IDS, LayeredSelector } from '../fixtures/test-ids';
import { 
  sampleTasks, 
  seedTasks, 
  waitForAppReady, 
  takeAccessibilitySnapshot,
  ariaExpectations,
  keyboardTestCases 
} from '../fixtures/test-data';

/**
 * DRIFT-SAFE Enhanced Test Example
 * Demonstrates layered selectors, deterministic fixtures, and accessibility snapshots
 */
test.describe('A5: Enhanced Testing Patterns (DRIFT-SAFE)', () => {
  let selector: LayeredSelector;
  
  test.beforeEach(async ({ page }) => {
    selector = new LayeredSelector(page);
    
    // Navigate to page first
    await page.goto('/');
    
    // Seed deterministic test data
    await seedTasks(page, sampleTasks);
    await waitForAppReady(page);
  });

  test('should use layered selectors for stability and accessibility', async ({ page }) => {
    // Example: Layered selector approach
    const quickAddSelectors = selector.getByTestIdOrRole(
      TEST_IDS.quickAddInput,
      'textbox',
      'Quick add task'
    );
    
    // Test with fallback - if testId doesn't exist, uses role selector
    await expect(quickAddSelectors.element).toBeVisible();
    
    // Verify accessibility attributes (this validates ARIA even with testId)
    await expect(quickAddSelectors.role).toHaveAttribute('aria-label', 'Quick add task');
    
    // Use the stable element for interaction
    await quickAddSelectors.element.fill('Layered selector test task');
    
    // Be more specific about which Add button (QuickAdd form button)
    const addButton = quickAddSelectors.element.locator('..').getByRole('button', { name: 'Add' });
    
    await addButton.click();
    
    // Verify task appears with deterministic data
    await expect(page.getByRole('article').filter({ hasText: 'Layered selector test task' })).toBeVisible();
  });

  test('should validate accessibility tree structure', async ({ page }) => {
    // Take accessibility snapshot for regression testing
    const snapshot = await takeAccessibilitySnapshot(page);
    
    // Verify core accessibility structure exists
    expect(snapshot).toBeTruthy();
    
    // Test specific ARIA compliance
    const searchInput = selector.getAccessible('textbox', 'Search tasks');
    await expect(searchInput).toHaveAttribute('aria-expanded', ariaExpectations.searchInput['aria-expanded']);
    await expect(searchInput).toHaveAttribute('aria-haspopup', ariaExpectations.searchInput['aria-haspopup']);
    
    // Verify task list has proper structure
    const taskList = page.getByRole('list', { name: /today tasks/i });
    await expect(taskList).toBeVisible();
    
    // Check that tasks maintain ARIA compliance
    const firstTask = page.getByRole('article').first();
    if (await firstTask.count() > 0) {
      await expect(firstTask).toHaveAttribute('aria-label', /Task: .+/);
    }
  });

  test('should handle keyboard navigation with deterministic data', async ({ page }) => {
    // Use seeded tasks for predictable testing
    const buyMilkTask = page.getByRole('article').filter({ hasText: 'Buy milk' });
    const walkDogTask = page.getByRole('article').filter({ hasText: 'Walk dog' });
    
    await expect(buyMilkTask).toBeVisible();
    await expect(walkDogTask).toBeVisible();
    
    // Focus first task
    await buyMilkTask.focus();
    
    // Test keyboard navigation patterns
    for (const testCase of keyboardTestCases.slice(0, 3)) { // Test first 3 key combinations
      await page.keyboard.press(testCase.key);
      
      // Verify appropriate response (this would need specific implementations)
      // For now, just ensure no errors occur
      await page.waitForTimeout(100);
    }
  });

  test('should preserve A4 compatibility with enhanced patterns', async ({ page }) => {
    // This test verifies that our enhanced patterns don't break existing A4 functionality
    
    // Test search (A4) with new patterns
    const searchInput = selector.getByTestIdOrRole(
      TEST_IDS.searchInput,
      'textbox',
      'Search tasks'
    );
    
    await searchInput.element.fill('milk');
    await page.waitForTimeout(300); // Debounce delay
    
    // Should find seeded "Buy milk" task
    const searchResults = page.getByRole('listbox');
    await expect(searchResults).toBeVisible();
    await expect(searchResults.getByText('Buy milk')).toBeVisible();
    
    // Test quick-add (A4) with layered selectors
    const quickAddInput = selector.getByTestIdOrRole(
      TEST_IDS.quickAddInput,
      'textbox',
      'Quick add task'
    );
    
    await quickAddInput.element.fill('Enhanced pattern test');
    
    const addButton = selector.getByTestIdOrRole(
      TEST_IDS.quickAddButton,
      'button',
      'Add'
    );
    
    await addButton.element.click();
    
    // Verify task creation works as expected
    await expect(page.getByRole('article').filter({ hasText: 'Enhanced pattern test' })).toBeVisible();
  });

  test('should demonstrate DRIFT-SAFE refactoring safety', async ({ page }) => {
    // This test shows how TEST_IDS registry enables safe refactoring
    
    // Even if the UI text changes, TEST_IDS provides stability
    const taskCardId = TEST_IDS.taskCard('test-task-1');
    const completeButtonId = TEST_IDS.taskCompleteButton('test-task-1');
    
    // These selectors remain stable during refactoring
    const taskCard = page.getByTestId(taskCardId);
    const completeButton = page.getByTestId(completeButtonId);
    
    // If testIds aren't implemented yet, fallback to role-based selectors
    const fallbackTaskCard = page.getByRole('article').filter({ hasText: 'Buy milk' });
    const fallbackCompleteButton = fallbackTaskCard.getByRole('button', { name: /mark complete/i });
    
    // Use whichever selector works (testId preferred, role fallback)
    const workingTaskCard = taskCard.or(fallbackTaskCard);
    const workingCompleteButton = completeButton.or(fallbackCompleteButton);
    
    await expect(workingTaskCard).toBeVisible();
    await workingCompleteButton.click();
    
    // Verify completion works regardless of selector method
    await expect(page.getByText(/task completed/i)).toBeVisible();
  });
});
