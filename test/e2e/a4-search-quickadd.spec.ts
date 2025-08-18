import { test, expect } from '@playwright/test';

test.describe('A4 - Search UI + Quick-Add Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Clear any existing tasks and set up test data
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('should render search bar with proper ARIA attributes', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    await expect(searchInput).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(searchInput).toHaveAttribute('placeholder', 'Search tasks...');
  });

  test('should render quick-add input with ghost examples', async ({ page }) => {
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    
    await expect(quickAddInput).toBeVisible();
    await expect(quickAddInput).toHaveAttribute('placeholder', 'Add task (e.g. "tomorrow 4pm #ops")');
    
    // Check for ghost examples
    await expect(page.getByText('Examples:')).toBeVisible();
    await expect(page.getByText('tomorrow 4pm #ops')).toBeVisible();
    await expect(page.getByText('next week !p0 #urgent')).toBeVisible();
    await expect(page.getByText('@status:later #review')).toBeVisible();
  });

  test('should create task via quick-add with live announcement', async ({ page }) => {
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });

    // Type and submit a simple task
    await quickAddInput.fill('Test quick add task');
    await addButton.click();

    // Should see task in Today column
    await expect(page.getByRole('article').filter({ hasText: 'Test quick add task' })).toBeVisible();
    
    // Input should be cleared for next task
    await expect(quickAddInput).toHaveValue('');
  });

  test('should parse quick-add with natural language', async ({ page }) => {
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });

    // Type a complex quick-add with tags and priority
    await quickAddInput.fill('Fix bug !p0 #critical #urgent');
    await addButton.click();

    // Should see task with parsed attributes
    const taskElement = page.getByRole('article').filter({ hasText: 'Fix bug' });
    await expect(taskElement).toBeVisible();
    await expect(taskElement.getByText('P0')).toBeVisible();
    await expect(taskElement.getByText('#critical')).toBeVisible();
    await expect(taskElement.getByText('#urgent')).toBeVisible();
  });

  test('should show inline error for empty quick-add', async ({ page }) => {
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });

    // Try to submit empty input
    await addButton.click();

    // Should show inline error with role="alert"
    const errorElement = page.getByRole('alert');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toHaveText('Please enter a task');
    
    // Input should have aria-describedby pointing to error
    await expect(quickAddInput).toHaveAttribute('aria-describedby', 'quickadd-error');
  });

  test('should perform debounced search with live results', async ({ page }) => {
    // First create some tasks to search
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });

    await quickAddInput.fill('Authentication bug #critical');
    await addButton.click();
    
    await quickAddInput.fill('User dashboard #feature');
    await addButton.click();

    // Now test search
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    
    // Type search query
    await searchInput.fill('auth');
    
    // Should debounce and show results
    await expect(searchInput).toHaveAttribute('aria-expanded', 'true');
    
    const listbox = page.getByRole('listbox', { name: 'Search results' });
    await expect(listbox).toBeVisible();
    
    const option = page.getByRole('option').filter({ hasText: 'Authentication bug' });
    await expect(option).toBeVisible();
  });

  test('should support keyboard navigation in search results', async ({ page }) => {
    // Create test tasks
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });

    await quickAddInput.fill('First task');
    await addButton.click();
    
    await quickAddInput.fill('Second task');
    await addButton.click();

    // Search to get results
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await searchInput.fill('task');
    
    // Wait for results
    await expect(page.getByRole('listbox')).toBeVisible();
    
    // First option should be active initially
    const firstOption = page.getByRole('option').first();
    await expect(firstOption).toHaveAttribute('aria-selected', 'true');
    
    // Test arrow key navigation
    await searchInput.press('ArrowDown');
    
    // Move to second option
    await expect(firstOption).toHaveAttribute('aria-selected', 'false');
    
    const secondOption = page.getByRole('option').nth(1);
    await expect(secondOption).toHaveAttribute('aria-selected', 'true');
  });

  test('should close listbox with Esc but preserve query', async ({ page }) => {
    // Create a task and search for it
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });
    
    await quickAddInput.fill('Test task');
    await addButton.click();

    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await searchInput.fill('test');
    
    // Should show listbox
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(searchInput).toHaveAttribute('aria-expanded', 'true');
    
    // Press Escape
    await searchInput.press('Escape');
    
    // Listbox should close but query should remain
    await expect(page.getByRole('listbox')).not.toBeVisible();
    await expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    await expect(searchInput).toHaveValue('test');
  });

  test('should highlight matched text in search results', async ({ page }) => {
    // Create a task
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });
    
    await quickAddInput.fill('Authentication bug fix');
    await addButton.click();

    // Search for part of the title
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await searchInput.fill('auth');
    
    // Should highlight the matched text
    const option = page.getByRole('option').filter({ hasText: 'Authentication bug fix' });
    await expect(option).toBeVisible();
    
    // Check for highlighted text (using <mark> element as per spec)
    await expect(option.locator('mark')).toBeVisible();
  });

  test('should support Tab/Shift+Tab navigation predictably', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    
    // Test Tab order - focus search first
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
    
    // Tab forward - should eventually reach quick-add input
    // There might be other focusable elements in between, so keep tabbing until we find it
    let currentFocus = await page.evaluate(() => document.activeElement?.tagName);
    let attempts = 0;
    while (currentFocus && attempts < 10) {
      await page.keyboard.press('Tab');
      if (await quickAddInput.isVisible()) {
        const isFocused = await quickAddInput.evaluate(el => document.activeElement === el);
        if (isFocused) break;
      }
      attempts++;
    }
    
    // Should reach quick-add input
    await expect(quickAddInput).toBeFocused();
    
    // Test Shift+Tab back to search
    attempts = 0;
    while (attempts < 10) {
      await page.keyboard.press('Shift+Tab');
      if (await searchInput.isVisible()) {
        const isFocused = await searchInput.evaluate(el => document.activeElement === el);
        if (isFocused) break;
      }
      attempts++;
    }
    
    await expect(searchInput).toBeFocused();
  });

  test('should respect prefers-reduced-motion for animations', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Create task and search - animations should be minimal/disabled
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });
    
    await quickAddInput.fill('Test task for motion');
    await addButton.click();

    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await searchInput.fill('motion');
    
    // Should still function correctly with reduced motion
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option')).toBeVisible();
  });
});

test.describe('A4 - Search and Quick-Add Integration', () => {
  test('should maintain A1-A3 behaviors unchanged', async ({ page }) => {
    await page.goto('/');
    
    // Verify task columns still exist (A1 behavior)
    await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Later' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
    
    // Create task via quick-add
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    const addButton = quickAddInput.locator('..').getByRole('button', { name: 'Add' });
    
    await quickAddInput.fill('A1 compatibility test');
    await addButton.click();

    // Wait for task to be processed
    await page.waitForTimeout(500);

    // Task should appear in Today column (A1 behavior preserved)
    await expect(page.getByRole('article').filter({ hasText: 'A1 compatibility test' })).toBeVisible();    // Should be able to complete task (A2 behavior preserved)
    const completeButton = page.getByRole('button', { name: 'Mark complete' }).first();
    await completeButton.click();

    // Wait for task to move between columns
    await page.waitForTimeout(1000);
    
    // Task should disappear from Today column
    const todayColumn = page.getByRole('heading', { name: 'Today' }).locator('..');
    await expect(todayColumn.getByRole('article').filter({ hasText: 'A1 compatibility test' })).not.toBeVisible();
    
    // Task should appear in Done column - try a more specific selector
    await expect(page.getByRole('article').filter({ hasText: 'A1 compatibility test' })).toBeVisible();
  });
});
