import { test, expect } from '../../helpers/fixtures/test-fixtures';
import { PageUtils } from '../../helpers/page-utils';

/**
 * @visual
 * Visual regression tests to catch UI changes across browsers
 *
 * These tests capture screenshots and compare against baselines
 * Run with: npm run test:e2e -- --grep @visual
 */
test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const pageUtils = new PageUtils(authenticatedPage);
    await pageUtils.waitForPageReady();
  });

  test('should match homepage layout @visual @smoke', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Wait for any loading states to complete
    await authenticatedPage.waitForFunction(() => {
      const loadingElements = document.querySelectorAll(
        '[data-testid*="loading"], .loading, .spinner'
      );
      return loadingElements.length === 0;
    });

    // Hide dynamic content that changes between runs
    await authenticatedPage.addStyleTag({
      content: `
        [data-testid="timestamp"],
        [data-testid="last-updated"],
        .timestamp,
        .last-updated {
          visibility: hidden !important;
        }
      `,
    });

    await expect(authenticatedPage).toHaveScreenshot('homepage-layout.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match accordion component states @visual @component', async ({
    authenticatedPage,
  }) => {
    // Navigate to accordion demo/component page
    await authenticatedPage.goto('/components/accordion'); // Adjust URL as needed
    await authenticatedPage.waitForLoadState('networkidle');

    const accordion = authenticatedPage.locator('[data-testid="accordion"]');
    await accordion.waitFor({ state: 'visible' });

    // Test collapsed state
    await expect(accordion).toHaveScreenshot('accordion-collapsed.png', {
      animations: 'disabled',
    });

    // Test expanded state
    const firstTrigger = accordion.locator('[role="button"]').first();
    await firstTrigger.click();
    // Wait for animation to complete using auto-waiting assertion
    await expect(accordion.locator('[role="region"]')).toBeVisible();

    await expect(accordion).toHaveScreenshot('accordion-expanded.png', {
      animations: 'disabled',
    });

    // Test multiple expanded (if multiple mode)
    const secondTrigger = accordion.locator('[role="button"]').nth(1);
    if (await secondTrigger.isVisible()) {
      await secondTrigger.click();
      // Wait for animation to complete using auto-waiting assertion
      await expect(accordion.locator('[role="region"]').nth(1)).toBeVisible();

      await expect(accordion).toHaveScreenshot(
        'accordion-multiple-expanded.png',
        {
          animations: 'disabled',
        }
      );
    }
  });

  test('should match task card layouts @visual @component', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Wait for tasks to load
    const taskCard = authenticatedPage
      .locator('[data-testid*="task-card"]')
      .first();
    await taskCard.waitFor({ state: 'visible' });

    // Screenshot individual task card
    await expect(taskCard).toHaveScreenshot('task-card-default.png', {
      animations: 'disabled',
    });

    // Test hover state (if interactive)
    await taskCard.hover();
    await expect(taskCard).toHaveScreenshot('task-card-hover.png', {
      animations: 'disabled',
    });
  });

  test('should match dialog/modal layouts @visual @component', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Trigger a modal/dialog (adjust selector as needed)
    const modalTrigger = authenticatedPage.locator(
      '[data-testid="add-task"], [data-testid="quick-add-button"]'
    );

    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();

      // Wait for modal to appear
      const modal = authenticatedPage.locator(
        '[role="dialog"], [data-testid*="modal"], [data-testid*="dialog"]'
      );
      await modal.waitFor({ state: 'visible' });

      await expect(modal).toHaveScreenshot('modal-add-task.png', {
        animations: 'disabled',
      });

      // Test with form data filled
      const titleInput = modal.locator(
        'input[name="title"], [data-testid="task-title"]'
      );
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Task for Visual Regression');

        await expect(modal).toHaveScreenshot('modal-add-task-filled.png', {
          animations: 'disabled',
        });
      }
    }
  });

  test('should match responsive layouts @visual @mobile', async ({
    authenticatedPage,
  }) => {
    // Test mobile viewport
    await authenticatedPage.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // Test tablet viewport
    await authenticatedPage.setViewportSize({ width: 768, height: 1024 }); // iPad
    await authenticatedPage.reload();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match theme variations @visual', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Test light theme (default)
    await expect(authenticatedPage).toHaveScreenshot(
      'homepage-light-theme.png',
      {
        fullPage: true,
        animations: 'disabled',
      }
    );

    // Test dark theme (if supported)
    const themeToggle = authenticatedPage.locator(
      '[data-testid="theme-toggle"], [aria-label*="theme"]'
    );
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // Wait for theme transition using auto-waiting assertion
      await expect(authenticatedPage.locator('[data-theme]')).toBeVisible();

      await expect(authenticatedPage).toHaveScreenshot(
        'homepage-dark-theme.png',
        {
          fullPage: true,
          animations: 'disabled',
        }
      );
    }
  });

  test('should match error states @visual', async ({ authenticatedPage }) => {
    // Test 404 page
    await authenticatedPage.goto('/nonexistent-page');
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveScreenshot('error-404.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // Test form validation errors (if applicable)
    await authenticatedPage.goto('/');
    const addTaskButton = authenticatedPage.locator(
      '[data-testid="add-task"], [data-testid="quick-add-button"]'
    );

    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      const modal = authenticatedPage.locator('[role="dialog"]');
      const submitButton = modal.locator(
        '[type="submit"], [data-testid="submit"]'
      );

      if (await submitButton.isVisible()) {
        await submitButton.click(); // Try to submit empty form

        // Wait for validation errors using auto-waiting assertion
        await expect(authenticatedPage.locator('[role="alert"], .error, .invalid')).toBeVisible();

        await expect(modal).toHaveScreenshot('form-validation-errors.png', {
          animations: 'disabled',
        });
      }
    }
  });
});
