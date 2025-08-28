import { test, expect } from '../fixtures/test-fixtures';
import { PageUtils, AssertionUtils, TestIdUtils } from '../utils/page-utils';

/**
 * @smoke @critical
 * Homepage and basic navigation tests
 */
test.describe('Homepage Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const pageUtils = new PageUtils(authenticatedPage);
    await pageUtils.navigateAndWait('/');
  });

  test('should load homepage successfully @smoke', async ({
    authenticatedPage,
  }) => {
    const pageUtils = new PageUtils(authenticatedPage);
    const assertions = new AssertionUtils(authenticatedPage);

    // Verify page loads
    await pageUtils.waitForPageReady();
    await assertions.expectNotLoading();

    // Check basic page structure
    await expect(authenticatedPage.locator('main')).toBeVisible();
    await expect(authenticatedPage.locator('h1')).toBeVisible();

    // Take a screenshot for visual regression
    await pageUtils.screenshot('homepage-loaded');
  });

  test('should have proper accessibility structure @a11y', async ({
    authenticatedPage,
  }) => {
    const pageUtils = new PageUtils(authenticatedPage);

    await pageUtils.waitForPageReady();
    await pageUtils.checkAccessibility();

    // Check for proper heading hierarchy
    const h1Count = await authenticatedPage.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check for skip links
    const skipLink = authenticatedPage.locator('a[href="#main"]');
    await expect(skipLink).toBeVisible();
  });

  test('should navigate between main sections @smoke', async ({
    authenticatedPage,
  }) => {
    const pageUtils = new PageUtils(authenticatedPage);

    // Test navigation to different sections
    const navItems = ['tasks', 'projects', 'settings'];

    for (const item of navItems) {
      const navLink = authenticatedPage.locator(TestIdUtils.navigation(item));

      if (await navLink.isVisible()) {
        await pageUtils.clickWithRetry(TestIdUtils.navigation(item));
        await pageUtils.waitForPageReady();

        // Verify URL changed
        expect(authenticatedPage.url()).toContain(item);

        // Verify page content loaded
        await expect(authenticatedPage.locator('main')).toBeVisible();
      }
    }
  });

  test('should handle offline state gracefully @resilience', async ({
    authenticatedPage,
    context,
  }) => {
    const pageUtils = new PageUtils(authenticatedPage);

    // Simulate offline
    await context.setOffline(true);

    // Try to navigate - should show offline indicator
    await authenticatedPage.goto('/tasks');

    // Should show offline message
    const offlineIndicator = authenticatedPage.locator(
      '[data-testid="offline-indicator"]'
    );
    await expect(offlineIndicator).toBeVisible({ timeout: 10000 });

    // Restore online
    await context.setOffline(false);
    await pageUtils.waitForNetworkIdle();

    // Offline indicator should disappear
    await expect(offlineIndicator).toBeHidden();
  });
});

/**
 * @smoke @critical
 * Component-specific tests for UI components
 */
test.describe('UI Components', () => {
  test('should render accordion component correctly @component', async ({
    authenticatedPage,
  }) => {
    const pageUtils = new PageUtils(authenticatedPage);

    // Navigate to component demo page (adjust URL as needed)
    await pageUtils.navigateAndWait('/components/accordion');

    // Test accordion functionality
    const accordion = authenticatedPage.locator('[data-testid="accordion"]');
    await expect(accordion).toBeVisible();

    // Test expanding/collapsing
    const firstTrigger = accordion.locator('[role="button"]').first();
    await firstTrigger.click();

    // Verify ARIA states
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');

    // Verify content is visible
    const firstContent = accordion.locator('[role="region"]').first();
    await expect(firstContent).toBeVisible();

    // Test keyboard navigation
    await firstTrigger.focus();
    await authenticatedPage.keyboard.press('ArrowDown');

    // Second trigger should be focused
    const secondTrigger = accordion.locator('[role="button"]').nth(1);
    await expect(secondTrigger).toBeFocused();
  });
});

/**
 * @performance
 * Performance-related tests
 */
test.describe('Performance Tests', () => {
  test('should load pages within performance budget @perf', async ({
    authenticatedPage,
  }) => {
    // Measure page load performance
    const startTime = Date.now();

    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Assert performance budget (adjust as needed)
    expect(loadTime).toBeLessThan(3000); // 3 seconds max

    // Check for performance metrics
    const performanceMetrics = await authenticatedPage.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstContentfulPaint:
          performance
            .getEntriesByType('paint')
            .find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    expect(performanceMetrics.domContentLoaded).toBeLessThan(1500);
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000);
  });
});
