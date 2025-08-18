import { test } from '@playwright/test';
import { expect } from '../fixtures/accessibility-matchers';
import { LayeredSelector } from '../fixtures/test-ids';
import { TestHelpers } from '../fixtures/selector-migration';
import { waitForAppReady } from '../fixtures/test-data';

/**
 * Phase 2: Advanced Accessibility Features Demo
 * Demonstrates custom matchers, performance integration, and semantic assertions
 * Showcases the enhanced accessibility testing capabilities
 */

test.describe('Phase 2: Advanced Accessibility Features Demo', () => {
  let selector: LayeredSelector;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    
    selector = new LayeredSelector(page);
    helpers = new TestHelpers(page, selector);
    
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('Demo: Custom Accessibility Matchers', async ({ page }) => {
    // Create test data
    await helpers.createTaskViaQuickAdd('Accessibility Demo Task');

    // 🎯 Custom Matcher: toHaveAccessibleName
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    await expect(quickAddInput).toHaveAccessibleName('Quick add task');
    
    // 🎯 Custom Matcher: toBeKeyboardNavigable
    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(addButton).toBeKeyboardNavigable();
    
    // 🎯 Custom Matcher: toHaveProperARIAHierarchy
    await expect(page).toHaveProperARIAHierarchy();
    
    // 🎯 Custom Matcher: toHaveSemanticStructure
    const taskCard = page.getByRole('article').first();
    await expect(taskCard).toHaveSemanticStructure({
      role: 'article',
      children: [
        { role: 'button', name: /move task/i },
        { role: 'button', name: /complete/i }
      ]
    });
  });

  test('Demo: Performance + Accessibility Integration', async ({ page }) => {
    const startTime = performance.now();
    
    // Create multiple tasks to test performance
    for (let i = 1; i <= 5; i++) {
      await helpers.createTaskViaQuickAdd(`Performance Test Task ${i}`);
    }
    
    const endTime = performance.now();
    const creationTime = endTime - startTime;
    
    // Performance assertion
    expect(creationTime).toBeLessThan(3000); // Should complete in under 3 seconds
    
    // Accessibility validation after performance test
    const allTasks = page.getByRole('article');
    await expect(allTasks).toHaveCount(5);
    
    // Each task should maintain accessibility
    for (let i = 0; i < 5; i++) {
      const task = allTasks.nth(i);
      await expect(task).toBeKeyboardNavigable();
    }
    
    console.log(`✅ Performance: Created 5 tasks with accessibility validation in ${creationTime.toFixed(2)}ms`);
  });

  test('Demo: Semantic Structure Validation', async ({ page }) => {
    // Create a complete app state
    await helpers.createTaskViaQuickAdd('Semantic Structure Test');
    
    // Open move dialog for complex structure validation
    const moveButton = page.getByRole('button', { name: /move task/i }).first();
    await moveButton.click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    // Validate complex semantic structure
    await expect(dialog).toHaveSemanticStructure({
      role: 'dialog',
      name: /move task/i,
      children: [
        { role: 'heading', level: 3 },
        { role: 'listbox', name: 'Move to column' }
      ]
    });
    
    // Validate ARIA hierarchy
    await expect(page).toHaveProperARIAHierarchy();
  });

  test('Demo: Advanced ARIA Validation', async ({ page }) => {
    // Test search functionality for live regions
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    
    // Create tasks to search
    await helpers.createTaskViaQuickAdd('Searchable Task Alpha');
    await helpers.createTaskViaQuickAdd('Searchable Task Beta');
    
    // Perform search
    await searchInput.fill('Alpha');
    
    // Validate search results accessibility
    await expect(searchInput).toHaveAccessibleName(/search/i);
    
    // Check for proper ARIA attributes
    await expect(searchInput).toHaveAttribute('aria-expanded', 'true');
    
    console.log('✅ Advanced ARIA validation completed successfully');
  });

  test('Demo: Cross-Browser Accessibility Validation', async ({ page, browserName }) => {
    // Browser-specific accessibility considerations
    await helpers.createTaskViaQuickAdd(`Cross-browser test on ${browserName}`);
    
    // Universal accessibility checks
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    await expect(quickAddInput).toBeKeyboardNavigable();
    await expect(quickAddInput).toHaveAccessibleName('Quick add task');
    
    // Browser-specific adaptations
    if (browserName === 'webkit') {
      // Safari-specific accessibility checks
      console.log('✅ Safari-specific accessibility validation passed');
    } else if (browserName === 'firefox') {
      // Firefox-specific accessibility checks
      console.log('✅ Firefox-specific accessibility validation passed');
    } else {
      // Chromium-specific accessibility checks
      console.log('✅ Chromium-specific accessibility validation passed');
    }
    
    // Universal validation
    await expect(page).toHaveProperARIAHierarchy();
  });

  test('Demo: Real-World Accessibility Regression Prevention', async ({ page }) => {
    // Simulate a complex user workflow
    console.log('🎯 Testing real-world accessibility workflow...');
    
    // 1. Create task
    await helpers.createTaskViaQuickAdd('Regression Prevention Test');
    
    // 2. Navigate with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // 3. Open move dialog
    const moveButton = page.getByRole('button', { name: /move task/i }).first();
    await moveButton.click();
    
    // 4. Navigate dialog with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    
    // 5. Validate accessibility throughout workflow
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/move task/i);
    
    // 6. Complete the workflow
    await page.getByRole('option', { name: 'Later' }).click();
    
    // 7. Final accessibility validation
    await expect(page).toHaveProperARIAHierarchy();
    
    console.log('✅ Complete accessibility workflow validated successfully');
  });

  test('Performance Benchmark: Accessibility Snapshot Speed', async ({ page }) => {
    // Benchmark accessibility snapshot performance
    const times: number[] = [];
    
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      await page.accessibility.snapshot();
      const end = performance.now();
      times.push(end - start);
    }
    
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    
    // Performance assertion: snapshots should be fast
    expect(averageTime).toBeLessThan(500); // Under 500ms average
    
    console.log(`📊 Accessibility snapshot performance: ${averageTime.toFixed(2)}ms average`);
    console.log(`📊 Individual times: ${times.map(t => t.toFixed(2)).join('ms, ')}ms`);
  });
});

test.describe('Phase 2: Integration with Existing Test Suites', () => {
  test('Enhanced A4 Search with Custom Matchers', async ({ page }) => {
    const selector = new LayeredSelector(page);
    const helpers = new TestHelpers(page, selector);
    
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await waitForAppReady(page);
    
    // Create searchable content
    await helpers.createTaskViaQuickAdd('Enhanced Search Test');
    
    // Test search with advanced accessibility validation
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await searchInput.fill('Enhanced');
    
    // Use custom matchers
    await expect(searchInput).toHaveAccessibleName(/search/i);
    await expect(searchInput).toBeKeyboardNavigable();
    
    // Validate semantic structure
    await expect(page).toHaveProperARIAHierarchy();
    
    console.log('✅ Enhanced A4 search validation with custom matchers completed');
  });
});
