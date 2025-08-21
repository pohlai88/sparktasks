/**
 * @fileoverview CommandPalette E2E Tests - Enterprise Browser Testing
 *
 * @description End-to-end tests for CommandPalette component covering
 * user workflows, keyboard shortcuts, and browser integration patterns.
 */

import { test, expect } from '@playwright/test';

// ===== TEST CONSTANTS =====

const KEYBOARD_SHORTCUTS = {
  OPEN_PALETTE: process.platform === 'darwin' ? 'Meta+k' : 'Control+k',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
} as const;

// ===== PAGE SETUP =====

test.beforeEach(async ({ page }) => {
  // Navigate to test page
  await page.goto('/');

  // Wait for application to load
  await page.waitForLoadState('networkidle');

  // Ensure clean state
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

// ===== COMMAND PALETTE INTEGRATION TESTS =====

test.describe('CommandPalette - E2E Integration', () => {
  test('opens with global keyboard shortcut', async ({ page }) => {
    // Test global shortcut activation
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Verify palette is visible
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(palette).toBeVisible();

    // Verify input is focused
    const input = page.getByRole('combobox');
    await expect(input).toBeFocused();
  });

  test('closes with Escape key', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Verify it's open
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(palette).toBeVisible();

    // Close with Escape
    await page.keyboard.press(KEYBOARD_SHORTCUTS.ESCAPE);

    // Verify it's closed
    await expect(palette).not.toBeVisible();
  });

  test('searches and filters commands in real-time', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Type search query
    await page.getByRole('combobox').fill('dashboard');

    // Verify filtered results
    await expect(page.getByText('Go to Dashboard')).toBeVisible();

    // Verify other commands are hidden
    await expect(page.getByText('Create New Task')).not.toBeVisible();
  });

  test('navigates commands with keyboard', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Get all command options
    const commands = page.getByRole('option');
    const firstCommand = commands.first();
    const secondCommand = commands.nth(1);

    // First command should be selected by default
    await expect(firstCommand).toHaveAttribute('aria-selected', 'true');

    // Navigate down
    await page.keyboard.press(KEYBOARD_SHORTCUTS.ARROW_DOWN);
    await expect(secondCommand).toHaveAttribute('aria-selected', 'true');

    // Navigate back up
    await page.keyboard.press(KEYBOARD_SHORTCUTS.ARROW_UP);
    await expect(firstCommand).toHaveAttribute('aria-selected', 'true');
  });

  test('executes command on Enter press', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Press Enter to execute first command
    await page.keyboard.press(KEYBOARD_SHORTCUTS.ENTER);

    // Verify command was executed (palette should close)
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(palette).not.toBeVisible();
  });

  test('handles mouse interactions correctly', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Click on a command
    const command = page.getByText('Go to Dashboard').first();
    await command.click();

    // Verify palette closes after command execution
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(palette).not.toBeVisible();
  });
});

// ===== ACCESSIBILITY E2E TESTS =====

test.describe('CommandPalette - E2E Accessibility', () => {
  test('maintains focus management across interactions', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Input should be focused
    const input = page.getByRole('combobox');
    await expect(input).toBeFocused();

    // Navigate through commands
    await page.keyboard.press(KEYBOARD_SHORTCUTS.ARROW_DOWN);

    // Input should maintain focus
    await expect(input).toBeFocused();
  });

  test('announces changes to screen readers', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Verify ARIA attributes
    const input = page.getByRole('combobox');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveAttribute('aria-haspopup', 'listbox');

    // Navigate and verify aria-activedescendant updates
    await page.keyboard.press(KEYBOARD_SHORTCUTS.ARROW_DOWN);
    const activeDescendant = await input.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
  });

  test('supports high contrast mode', async ({ page }) => {
    // Enable high contrast mode simulation
    await page.emulateMedia({ forcedColors: 'active' });

    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Verify palette is still visible and usable
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(palette).toBeVisible();

    // Verify commands are visible
    await expect(page.getByText('Go to Dashboard')).toBeVisible();
  });
});

// ===== PERFORMANCE E2E TESTS =====

test.describe('CommandPalette - E2E Performance', () => {
  test('opens within performance budget', async ({ page }) => {
    // Start performance measurement
    await page.evaluate(() => performance.mark('palette-open-start'));

    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Wait for palette to be visible
    await page.getByRole('dialog', { name: 'Command palette' }).waitFor();

    // End performance measurement
    await page.evaluate(() => performance.mark('palette-open-end'));

    // Calculate duration
    const duration = await page.evaluate(() => {
      performance.measure(
        'palette-open',
        'palette-open-start',
        'palette-open-end'
      );
      const entries = performance.getEntriesByName('palette-open');
      return entries[0]?.duration || 0;
    });

    // Should open within 100ms
    expect(duration).toBeLessThan(100);
  });

  test('handles rapid keyboard input efficiently', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Type rapidly
    const input = page.getByRole('combobox');
    await input.fill('rapid typing test');

    // Clear and type again
    await input.clear();
    await input.fill('another search');

    // Verify responsive behavior
    await expect(page.getByText('No commands found')).toBeVisible();
  });
});

// ===== VISUAL REGRESSION TESTS =====

test.describe('CommandPalette - E2E Visual Regression', () => {
  test('matches visual snapshots in different states', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Take screenshot of default state
    await expect(page).toHaveScreenshot('command-palette-default.png');

    // Type search query
    await page.getByRole('combobox').fill('dashboard');

    // Take screenshot of filtered state
    await expect(page).toHaveScreenshot('command-palette-filtered.png');

    // Clear search to show empty state
    await page.getByRole('combobox').clear();
    await page.getByRole('combobox').fill('nonexistent');

    // Take screenshot of empty state
    await expect(page).toHaveScreenshot('command-palette-empty.png');
  });

  test('renders correctly on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);
    await expect(page).toHaveScreenshot('command-palette-mobile.png');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('command-palette-tablet.png');

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page).toHaveScreenshot('command-palette-desktop.png');
  });
});

// ===== INTEGRATION WITH OTHER COMPONENTS =====

test.describe('CommandPalette - E2E Component Integration', () => {
  test('integrates correctly with navigation system', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Execute navigation command
    await page.getByText('Go to Dashboard').click();

    // Verify navigation occurred
    // Note: This would depend on your actual routing implementation
    await page.waitForURL('**/dashboard');
  });

  test('maintains state across route changes', async ({ page }) => {
    // Open palette
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Navigate to different page
    await page.goto('/settings');

    // Open palette again
    await page.keyboard.press(KEYBOARD_SHORTCUTS.OPEN_PALETTE);

    // Verify commands are still available
    await expect(
      page.getByRole('dialog', { name: 'Command palette' })
    ).toBeVisible();
  });
});
