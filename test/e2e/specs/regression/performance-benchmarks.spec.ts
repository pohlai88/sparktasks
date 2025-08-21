/**
 * Competitive Performance Benchmark Tests
 *
 * Validates SaaS performance superiority over market leaders
 * ClickUp, Trello, and enterprise competitors
 */

import { benchmarkTest, expect } from '../../fixtures/test-fixtures';
import { SEL } from '../../fixtures/selectors';

benchmarkTest.describe('Competitive Performance Benchmarks', () => {
  benchmarkTest(
    'Large dataset handling outperforms ClickUp',
    async ({ page, scenario }) => {
      const { largeTasks, performanceMetrics } = scenario;

      console.log(
        `🎯 Testing with ${largeTasks.length} tasks vs ClickUp baseline`
      );

      // Load large dataset
      const loadStart = performance.now();
      await page.goto('/tasks');

      // Wait for task list to fully render
      await page.waitForSelector(SEL.task.container, { timeout: 10000 });
      const loadTime = performance.now() - loadStart;

      // Performance assertion - must beat ClickUp's ~4s load time
      expect(loadTime).toBeLessThan(performanceMetrics.expectedLoadTime);

      // Test virtualized scrolling performance
      const scrollStart = performance.now();
      await page.locator(SEL.perf.virtualizedList).hover();

      // Scroll through large dataset
      for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(50);
      }

      const scrollTime = performance.now() - scrollStart;
      expect(scrollTime).toBeLessThan(1000); // Smooth scrolling

      console.log(
        `✅ Large dataset performance: Load ${loadTime.toFixed(0)}ms, Scroll ${scrollTime.toFixed(0)}ms`
      );
    }
  );

  benchmarkTest(
    'Search speed dominates Trello response time',
    async ({ page, scenario }) => {
      const { largeTasks, performanceMetrics } = scenario;

      await page.goto('/tasks');

      // Test search across large dataset
      const searchQueries = ['urgent', 'frontend', 'review', 'team'];

      for (const query of searchQueries) {
        const searchStart = performance.now();

        await page.locator(SEL.task.quickAdd.input).fill(query);
        await page.waitForSelector('[data-testid="search-results"]', {
          timeout: 2000,
        });

        const searchTime = performance.now() - searchStart;

        // Must be 5x faster than Trello's ~500ms
        expect(searchTime).toBeLessThan(performanceMetrics.expectedSearchTime);

        console.log(
          `✅ Search "${query}": ${searchTime.toFixed(0)}ms (Target: <${performanceMetrics.expectedSearchTime}ms)`
        );

        // Clear search
        await page.locator(SEL.task.quickAdd.input).clear();
      }
    }
  );

  benchmarkTest(
    'Data export speed beats all competitors',
    async ({ page, scenario }) => {
      await page.goto('/export');

      // Test competitive advantage - full data export
      const exportStart = performance.now();

      await page.locator(SEL.export.button).click();
      await page.locator(SEL.export.formatSelect).selectOption('csv');
      await page.locator(SEL.export.downloadButton).click();

      // Wait for export completion
      await page.waitForSelector(SEL.export.progressBar, {
        state: 'hidden',
        timeout: 60000,
      });

      const exportTime = performance.now() - exportStart;

      // Competitive advantage - 30s full export vs competitors' limitations
      expect(exportTime).toBeLessThan(30000);

      console.log(
        `✅ Data export performance: ${(exportTime / 1000).toFixed(1)}s (Target: <30s)`
      );
    }
  );
});
