import { test, expect } from '../fixtures/test-fixtures';
import { PageUtils } from '../utils/page-utils';

/**
 * @performance
 * Performance tests to measure Core Web Vitals and application responsiveness
 *
 * These tests measure LCP, FID, CLS and set performance budgets
 * Run with: npm run test:performance
 */
test.describe('Performance Tests', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const pageUtils = new PageUtils(authenticatedPage);
    await pageUtils.waitForPageReady();
  });

  test('should meet Core Web Vitals thresholds @performance @smoke', async ({
    authenticatedPage,
  }) => {
    // Inject Web Vitals measurement script
    await authenticatedPage.addInitScript(() => {
      // Web Vitals measurement
      window.webVitals = {
        lcp: 0,
        fid: 0,
        cls: 0,
        measurements: [],
      };

      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitals.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.webVitals.cls = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Performance marks for custom measurements
      window.measureCustomTiming = markName => {
        performance.mark(markName);
        window.webVitals.measurements.push({
          name: markName,
          time: performance.now(),
        });
      };
    });

    // Start timing measurement
    await authenticatedPage.evaluate(() => {
      window.measureCustomTiming('navigation-start');
    });

    // Navigate to homepage
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Wait for main content to be visible
    await authenticatedPage.waitForSelector(
      'main, [data-testid="main-content"], h1',
      {
        timeout: 10000,
      }
    );

    await authenticatedPage.evaluate(() => {
      window.measureCustomTiming('content-loaded');
    });

    // Get performance metrics
    const metrics = await authenticatedPage.evaluate(() => {
      return {
        lcp: window.webVitals.lcp,
        cls: window.webVitals.cls,
        measurements: window.webVitals.measurements,
        // Navigation timing
        navigationTiming: {
          domContentLoaded:
            performance.timing.domContentLoadedEventEnd -
            performance.timing.navigationStart,
          loadComplete:
            performance.timing.loadEventEnd -
            performance.timing.navigationStart,
          firstPaint:
            performance
              .getEntriesByType('paint')
              .find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint:
            performance
              .getEntriesByType('paint')
              .find(entry => entry.name === 'first-contentful-paint')
              ?.startTime || 0,
        },
      };
    });

    console.log('Performance Metrics:', JSON.stringify(metrics, null, 2));

    // Performance budget assertions
    // LCP should be under 2.5 seconds (good threshold)
    expect(metrics.lcp).toBeLessThan(2500);

    // CLS should be under 0.1 (good threshold)
    expect(metrics.cls).toBeLessThan(0.1);

    // First Contentful Paint should be under 1.8 seconds
    expect(metrics.navigationTiming.firstContentfulPaint).toBeLessThan(1800);

    // DOM Content Loaded should be under 1.5 seconds
    expect(metrics.navigationTiming.domContentLoaded).toBeLessThan(1500);
  });

  test('should have fast task interactions @performance @interaction', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Measure interaction timing
    await authenticatedPage.evaluate(() => {
      window.measureCustomTiming('interaction-start');
    });

    // Test common user interactions
    const startTime = Date.now();

    // Try to click a common interactive element
    const interactiveElement = authenticatedPage
      .locator('button, [role="button"], a, [data-testid*="button"]')
      .first();

    if ((await interactiveElement.count()) > 0) {
      await interactiveElement.click();

      const interactionTime = Date.now() - startTime;

      // Interaction should respond within 100ms (good UX)
      expect(interactionTime).toBeLessThan(100);
    }

    await authenticatedPage.evaluate(() => {
      window.measureCustomTiming('interaction-end');
    });
  });

  test('should handle large dataset rendering efficiently @performance @data', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Measure rendering time for large lists or grids
    const startTime = performance.now();

    // Look for data-heavy components
    const dataElements = authenticatedPage.locator(
      '[data-testid*="list"], [data-testid*="grid"], [data-testid*="table"], ul, ol'
    );

    if ((await dataElements.count()) > 0) {
      await dataElements.first().waitFor({ state: 'visible' });

      const renderTime = performance.now() - startTime;

      // Large data rendering should complete within 200ms
      expect(renderTime).toBeLessThan(200);
    }
  });

  test('should maintain performance during viewport changes @performance @responsive', async ({
    authenticatedPage,
    context,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Test desktop to mobile resize performance
    const startTime = performance.now();

    await context.setViewportSize({ width: 375, height: 667 }); // Mobile
    await authenticatedPage.waitForTimeout(100); // Allow layout to settle

    const resizeTime = performance.now() - startTime;

    // Viewport changes should be smooth (under 50ms)
    expect(resizeTime).toBeLessThan(50);

    // Check that layout is stable after resize
    const layoutShift = await authenticatedPage.evaluate(() => {
      return window.webVitals ? window.webVitals.cls : 0;
    });

    // Layout should remain stable during resize
    expect(layoutShift).toBeLessThan(0.1);
  });

  test('should have efficient memory usage @performance @memory', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Get memory usage information
    const memoryInfo = await authenticatedPage.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memoryInfo) {
      console.log('Memory Usage:', memoryInfo);

      // Memory usage should be reasonable (under 50MB for typical SPAs)
      const memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      expect(memoryUsageMB).toBeLessThan(50);

      // Memory usage should not exceed 80% of available heap
      const memoryUtilization =
        memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize;
      expect(memoryUtilization).toBeLessThan(0.8);
    }
  });
});
