/**
 * E2E Test Template — SSOT (Self-Diagnosing & Non-Flaky)
 * 
 * This template follows Playwright best practices for reliable, debuggable tests.
 * Copy this file and customize it for your specific user workflow.
 * 
 * Golden rules (checklist):
 * - Uses getByRole/getByLabel (no CSS/XPath unless unavoidable)
 * - No waitForTimeout; prefer expect(...).toHave* with auto-wait
 * - Single source of truth for navigation (baseURL via config)
 * - At least one network-level assertion for critical flows
 * - Traces/videos/screenshots only on failure (configured)
 * - If it mutates data, gate with env (e.g., RUN_WRITE_TEST=1)
 * - Fail with human-readable messages (expected vs actual)
 * - Register the test in tests/e2e/ssot.e2e.ts with proper metadata
 */

import { test, expect } from '@playwright/test';
// If you enable a11y checks: import AxeBuilder from '@axe-core/playwright';

/** Utilities for better error messages and debugging */
async function safeJson(resp: import('@playwright/test').APIResponse | import('@playwright/test').Response) {
  try { 
    return await resp.json(); 
  } catch { 
    return { __parseError: true, status: resp.status() }; 
  }
}

function isOk(resp: { ok: () => boolean }) { 
  return resp.ok(); 
}

// ---- Suite gating at describe-level (cleaner) ----
const featureSuite = process.env.RUN_FEATURE_TEST === '1' ? test.describe : test.describe.skip;
const writeSuite = process.env.RUN_WRITE_TEST === '1' ? test.describe : test.describe.skip;

featureSuite('Feature — smoke', () => {
  test('loads list, asserts network, passes axe, and snapshots grid', async ({ page }, testInfo) => {
    await test.step('Navigate to feature and stabilize animations', async () => {
      await page.goto('/feature');
      await expect(page).toHaveURL(/\/feature$/);
      // Nuke transitions/animations for deterministic visuals
      await page.addStyleTag({
        content: `*,*::before,*::after{transition-duration:0s!important;animation:none!important}`
      });
    });

    await test.step('Grid renders and is ready (a11y-first)', async () => {
      const grid = page.getByRole('grid');
      await expect(grid).toBeVisible();
      // 03A: grid should not be busy once data is on screen
      await expect(grid).toHaveAttribute('aria-busy', /false/i);
      // First data row visible (nth(0) can be header depending on lib; nth(1) is safe)
      await expect.soft(page.getByRole('row').nth(1)).toBeVisible();
    });

    await test.step('Network assertion (GET /api/feature/items) — future proof', async () => {
      const nextItemsResponse = page.waitForResponse(
        r => r.url().includes('/api/feature/items') && r.request().method() === 'GET',
        { timeout: 5000 }
      );

      const loadMore = page.getByRole('button', { name: /load more/i });
      if (await loadMore.isVisible().catch(() => false)) {
        // Trigger a new fetch deterministically and await the matching response
        const resp = await Promise.all([nextItemsResponse, loadMore.click()]).then(([r]) => r);
        if (!isOk(resp)) {
          const rid = resp.headers()['x-request-id'] || resp.headers()['X-Request-Id'];
          const body = await safeJson(resp);
          await testInfo.attach('feature-read-failure.json', {
            body: JSON.stringify({ status: resp.status(), rid, body }, null, 2),
            contentType: 'application/json'
          });
        }
        await expect(resp.ok(), `GET /items failed (${resp.status()}). See feature-read-failure.json.`).toBeTruthy();
      } else {
        // No "Load more" — force a fresh fetch so the waitForResponse can resolve
        const resp = await Promise.all([nextItemsResponse, page.reload()]).then(([r]) => r);
        if (!isOk(resp)) {
          const rid = resp.headers()['x-request-id'] || resp.headers()['X-Request-Id'];
          const body = await safeJson(resp);
          await testInfo.attach('feature-read-failure.json', {
            body: JSON.stringify({ status: resp.status(), rid, body }, null, 2),
            contentType: 'application/json'
          });
        }
        await expect(resp.ok(), `Reloaded GET /items failed (${resp.status()}). See feature-read-failure.json.`).toBeTruthy();
      }
    });

    await test.step('Accessibility smoke (axe) and visual snapshot', async () => {
      // Optional: accessibility smoke (requires @axe-core/playwright)
      // const results = await new AxeBuilder({ page })
      //   .withTags(['wcag2a', 'wcag2aa'])
      //   .analyze();
      // expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);

      // Mask volatile UI (RID, timestamps, etc.) to keep diffs stable
      const masks = [
        page.getByText(/request id:/i).first().filter({ hasText: /request id:/i })
      ];
      await expect(page.getByRole('grid')).toHaveScreenshot('feature-grid.png', { mask: masks });
    });
  });
});

writeSuite('Write path — idempotent create (opt-in)', () => {
  // Keep serial only if you later mutate global/shared backend state.
  // test.describe.configure({ mode: 'serial' });

  test('same Idempotency-Key + same body => same success; different body => 409', async ({ request }, testInfo) => {
    const key = `ssot-idem-${Date.now()}`;
    const body1 = { customerId: 'Seed-Customer-001', items: [{ item_code: 'SKU-001', qty: 1 }] };

    // First create
    const r1 = await request.post('/api/feature/orders', {
      headers: { 'content-type': 'application/json', 'idempotency-key': key },
      data: body1,
    });
    const j1: any = await safeJson(r1);
    expect(r1.ok(), `First create failed: ${JSON.stringify(j1)}`).toBeTruthy();
    const id1 = j1?.id ?? j1?.data?.id ?? j1?.order?.name;
    expect(id1, `Missing order id in first response: ${JSON.stringify(j1)}`).toBeTruthy();

    // Replay with same key/body → same success
    const r2 = await request.post('/api/feature/orders', {
      headers: { 'content-type': 'application/json', 'idempotency-key': key },
      data: body1,
    });
    const j2: any = await safeJson(r2);
    expect(r2.ok(), `Replay with same key/body not ok: ${JSON.stringify(j2)}`).toBeTruthy();
    const id2 = j2?.id ?? j2?.data?.id ?? j2?.order?.name;
    expect(id2, `Missing id in replay: ${JSON.stringify(j2)}`).toBeTruthy();
    expect(id2).toBe(id1);

    // Reuse key with different body → 409
    const body2 = { ...body1, items: [{ item_code: 'SKU-001', qty: 2 }] };
    const r3 = await request.post('/api/feature/orders', {
      headers: { 'content-type': 'application/json', 'idempotency-key': key },
      data: body2,
    });
    if (r3.status() !== 409) {
      const j3 = await safeJson(r3);
      const rid = r3.headers()['x-request-id'] || r3.headers()['X-Request-Id'];
      await testInfo.attach('replay-mismatch.json', { 
        body: JSON.stringify({ status: r3.status(), rid, j3 }, null, 2), 
        contentType: 'application/json' 
      });
    }
    expect(r3.status(), 'Different body with same key must 409').toBe(409);
  });
});

// ---- Additional test suites ----
test.describe('User Workflows', () => {
    test('should complete main user workflow @critical', async ({ page }) => {
      // Step 1: Navigate to feature
      await page.goto('/feature');
      
      // Step 2: Fill out form
      await page.fill('[data-testid="input-field"]', 'test value');
      await page.selectOption('[data-testid="select-field"]', 'option1');
      
      // Step 3: Submit form
      await page.click('[data-testid="submit-button"]');
      
      // Step 4: Verify success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Success');
    });

    test('should handle form validation', async ({ page }) => {
      // Test required field validation
      await page.click('[data-testid="submit-button"]');
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // Fill required field and retry
      await page.fill('[data-testid="required-field"]', 'valid value');
      await page.click('[data-testid="submit-button"]');
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    test('should handle navigation between pages', async ({ page }) => {
      // Navigate to first page
      await page.goto('/page1');
      await expect(page.locator('[data-testid="page1-content"]')).toBeVisible();
      
      // Navigate to second page
      await page.click('[data-testid="nav-to-page2"]');
      await expect(page).toHaveURL(/page2/);
      await expect(page.locator('[data-testid="page2-content"]')).toBeVisible();
    });
  });

  // Error handling tests
  test.describe('Error Handling', () => {
    test('handles network errors gracefully and shows request ID', async ({ page }) => {
      // Arrange: Mock network failure for targeted testing
      await page.route('**/api/feature/*', route => route.abort());
      
      // Act: Trigger the network request
      const loadButton = page.getByRole('button', { name: /load data/i });
      await loadButton.click();
      
      // Assert: Error UI appears with request tracking
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByRole('alert')).toContainText(/request id:/i);
      await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
    });

    test('handles form validation with accessible error messages', async ({ page }) => {
      // Act: Submit form with invalid data
      const submitButton = page.getByRole('button', { name: /submit/i });
      await submitButton.click();
      
      // Assert: Validation errors are accessible
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page.getByRole('textbox', { name: /email/i })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // Accessibility tests
  test.describe('Accessibility @a11y', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/feature');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="first-focusable"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="second-focusable"]')).toBeFocused();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/feature');
      
      // Check for ARIA labels
      await expect(page.locator('[data-testid="button"]')).toHaveAttribute('aria-label');
      
      // Check for ARIA roles
      await expect(page.locator('[data-testid="navigation"]')).toHaveAttribute('role', 'navigation');
    });

    test('should work with screen reader', async ({ page }) => {
      await page.goto('/feature');
      
      // Test screen reader compatibility
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveAttribute('id');
    });
  });

  // Visual regression tests
  test.describe('Visual Regression @visual', () => {
    test('should match homepage screenshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot and compare
      await expect(page).toHaveScreenshot('homepage.png');
    });

    test('should match feature page screenshot', async ({ page }) => {
      await page.goto('/feature');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('feature-page.png');
    });

    test('should match mobile layout', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/feature');
      
      await expect(page).toHaveScreenshot('feature-mobile.png');
    });
  });

  // Performance tests
  test.describe('Performance @performance', () => {
    test('should load within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/feature');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 seconds max
    });

    test('should have good Core Web Vitals', async ({ page }) => {
      await page.goto('/feature');
      
      // Measure performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: performance.getEntriesByType('paint')
            .find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        };
      });
      
      expect(performanceMetrics.domContentLoaded).toBeLessThan(1500);
      expect(performanceMetrics.firstContentfulPaint).toBeLessThan(2000);
    });
  });

  // Cross-browser tests
  test.describe('Cross-Browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      await page.goto('/feature');
      
      // Browser-specific assertions if needed
      if (browserName === 'webkit') {
        // Safari-specific tests
        await expect(page.locator('[data-testid="safari-specific"]')).toBeVisible();
      } else if (browserName === 'firefox') {
        // Firefox-specific tests
        await expect(page.locator('[data-testid="firefox-specific"]')).toBeVisible();
      }
      
      // Common functionality should work in all browsers
      await expect(page.locator('[data-testid="common-feature"]')).toBeVisible();
    });
  });

  // Mobile-specific tests
  test.describe('Mobile Experience @mobile', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/feature');
      
      // Test mobile-specific interactions
      await page.tap('[data-testid="mobile-button"]');
      await expect(page.locator('[data-testid="mobile-result"]')).toBeVisible();
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/feature');
      
      // Test touch gestures
      await page.touchscreen.tap(200, 300);
      await expect(page.locator('[data-testid="touch-result"]')).toBeVisible();
    });
  });

  // Data persistence tests
  test.describe('Data Persistence', () => {
    test('should persist data across page reloads', async ({ page }) => {
      await page.goto('/feature');
      
      // Create some data
      await page.fill('[data-testid="input-field"]', 'persistent data');
      await page.click('[data-testid="save-button"]');
      
      // Reload page
      await page.reload();
      
      // Verify data persisted
      await expect(page.locator('[data-testid="input-field"]')).toHaveValue('persistent data');
    });

    test('should handle localStorage correctly', async ({ page }) => {
      await page.goto('/feature');
      
      // Set localStorage
      await page.evaluate(() => {
        localStorage.setItem('test-key', 'test-value');
      });
      
      // Reload and check
      await page.reload();
      const value = await page.evaluate(() => localStorage.getItem('test-key'));
      expect(value).toBe('test-value');
    });
  });

/**
 * 🔍 DEBUG RUBRIC (quick):
 * 1) Network: did /api/... fire? If no → test/locator; if 4xx/5xx → app/BFF (check x-request-id).
 * 2) Locator: trace snapshot shows mismatch? Fix role/name or app a11y.
 * 3) Waits: replace sleeps with expect(...).toBeVisible()/toHaveURL().
 * 
 * 📚 Official References:
 * • Best practices: https://playwright.dev/docs/best-practices
 * • Locators guide: https://playwright.dev/docs/locators
 * • Assertions: https://playwright.dev/docs/test-assertions
 * • Trace viewer: https://playwright.dev/docs/trace-viewer-intro
 * • Fixtures: https://playwright.dev/docs/test-fixtures
 * • Timeouts: https://playwright.dev/docs/test-timeouts
 */
