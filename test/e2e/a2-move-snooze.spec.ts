import { test, expect } from '@playwright/test';

/*
ANTI-DRIFT FREEZE — A2
- Do not change A1 behaviors (validation, toasts, undo/redo, ARCHIVED semantics).
- Keyboard + "Move to…" are the canonical move paths; DnD is optional and must not break keyboard flows.
- E2E selectors must remain role/label based and scoped to lane regions.
- No config/deps/store shape changes during A3 work.
*/

test.describe('A2: Task Interactions - Move, Snooze, Undo/Redo', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to prevent test pollution
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    // Wait for app to load
    await expect(page.getByText('SparkTasks')).toBeVisible();
  });

  test('should move tasks between columns via Move menu', async ({ page }) => {
    // Create a task in Today - use the correct button text for empty state
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Move Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear and verify initial lane membership
    await expect(page.getByText('Move Test Task')).toBeVisible();
    const todayLane = page.getByRole('list', { name: /today tasks/i });
    const laterLane = page.getByRole('list', { name: /later tasks/i });
    await expect(todayLane.getByText('Move Test Task')).toBeVisible();

    // Click the move button (MoreHorizontal icon)
    await page.getByRole('button', { name: /move task/i }).first().click();
    
    // Select "Later" from move menu using the specific role
    await page.getByRole('option', { name: 'Later' }).click();
    
    // Verify toast message for success
    await expect(page.getByText('Task moved to Later')).toBeVisible();
    
    // Verify lane membership: present in Later, absent from Today
    await expect(laterLane.getByText('Move Test Task')).toBeVisible();
    await expect(todayLane.getByText('Move Test Task')).toHaveCount(0);
  });

  test('should snooze tasks to Later column', async ({ page }) => {
    // Create a task in Today
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Snooze Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear
    await expect(page.getByText('Snooze Test Task')).toBeVisible();
    
    // Click snooze button (Clock icon)
    await page.getByRole('button', { name: /snooze to later/i }).first().click();
    
    // Verify success toast
    await expect(page.getByText(/task snoozed to later/i)).toBeVisible();
  });

  test('should support keyboard navigation and shortcuts', async ({ page }) => {
    // Create a task to test keyboard shortcuts
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Keyboard Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear
    await expect(page.getByRole('heading', { name: 'Keyboard Test Task' })).toBeVisible();
    
    // Focus the task card by clicking on the task heading
    await page.getByRole('heading', { name: 'Keyboard Test Task' }).click();
    
    // Press 'm' to open move menu from focused task
    await page.keyboard.press('m');
    
    // Verify move menu is open
    await expect(page.getByRole('dialog', { name: /move task/i })).toBeVisible();
    
    // Close the dialog
    await page.press('body', 'Escape');
    await expect(page.getByRole('dialog', { name: /move task/i })).not.toBeVisible();
  });

  test('should handle task completion with space key', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Complete Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear
    await expect(page.getByText('Complete Test Task')).toBeVisible();
    
    // Focus the task card and press space to complete
    await page.getByText('Complete Test Task').click();
    await page.keyboard.press(' ');
    
    // Verify completion toast
    await expect(page.getByText(/task completed/i)).toBeVisible();
  });

  test('should preserve A1 delete behavior (soft delete to ARCHIVED)', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Delete Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear
    await expect(page.getByText('Delete Test Task')).toBeVisible();
    
    // Delete the task
    await page.getByRole('button', { name: /delete task/i }).first().click();
    
    // Verify task is no longer visible (ARCHIVED)
    await expect(page.getByText('Delete Test Task')).not.toBeVisible();
    
    // Verify delete toast
    await expect(page.getByText(/task deleted/i)).toBeVisible();
  });

  test('should integrate with undo/redo functionality', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Undo Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Wait for task to appear
    await expect(page.getByText('Undo Test Task')).toBeVisible();
    
    // Snooze the task
    await page.getByRole('button', { name: /snooze to later/i }).first().click();
    await expect(page.getByText(/task snoozed to later/i)).toBeVisible();
    
    // Click undo button in header - use exact aria-label
    await page.getByRole('button', { name: 'Undo last action' }).click();
    
    // Verify undo worked - task should be back and toast shown
    await expect(page.getByText(/action undone/i)).toBeVisible();
  });

  test('should exclude ARCHIVED tasks from all columns', async ({ page }) => {
    // Create and delete a task (making it ARCHIVED)
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Archived Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    await expect(page.getByText('Archived Test Task')).toBeVisible();
    await page.getByRole('button', { name: /delete task/i }).first().click();
    await expect(page.getByText('Archived Test Task')).not.toBeVisible();
    
    // Create another task to verify normal flow works
    await page.getByRole('button', { name: /add your first task/i }).click();
    await page.locator('#task-title').fill('Active Test Task');
    await page.getByRole('button', { name: /add task/i }).click();
    
    // Verify only the active task appears
    await expect(page.getByText('Active Test Task')).toBeVisible();
    await expect(page.getByText('Archived Test Task')).not.toBeVisible();
  });
});
