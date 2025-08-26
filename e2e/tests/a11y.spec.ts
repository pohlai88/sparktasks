import { test, expect } from '../fixtures/test-fixtures';
import { PageUtils } from '../utils/page-utils';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

/**
 * @a11y
 * Accessibility tests to ensure WCAG 2.1 Level AA compliance
 *
 * These tests use axe-core to scan for accessibility violations
 * Run with: npm run test:e2e -- --grep @a11y
 */
test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const pageUtils = new PageUtils(authenticatedPage);
    await pageUtils.waitForPageReady();
  });

  test('should have no accessibility violations on homepage @a11y @smoke', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Wait for dynamic content to load
    await authenticatedPage.waitForFunction(() => {
      const loadingElements = document.querySelectorAll(
        '[data-testid*="loading"], .loading, .spinner'
      );
      return loadingElements.length === 0;
    });

    // Inject axe into the page
    await injectAxe(authenticatedPage);

    // Run accessibility checks
    await checkA11y(authenticatedPage);
  });

  test('should have accessible navigation @a11y @navigation', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Focus specifically on navigation areas
    const accessibilityScanResults = await new AxeBuilder({
      page: authenticatedPage,
    })
      .include('[role="navigation"]')
      .include('nav')
      .include('[data-testid*="nav"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Test keyboard navigation
    await authenticatedPage.keyboard.press('Tab');
    const firstFocusable = await authenticatedPage.locator(':focus');
    expect(await firstFocusable.count()).toBeGreaterThan(0);

    // Verify focus is visible
    const focusedElement = authenticatedPage.locator(':focus');
    const boundingBox = await focusedElement.boundingBox();
    expect(boundingBox).toBeTruthy();
  });

  test('should have accessible forms @a11y @forms', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Trigger form (add task modal)
    const addTaskButton = authenticatedPage.locator(
      '[data-testid="add-task"], [data-testid="quick-add-button"]'
    );

    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      const modal = authenticatedPage.locator('[role="dialog"]');
      await modal.waitFor({ state: 'visible' });

      // Scan form for accessibility issues
      const accessibilityScanResults = await new AxeBuilder({
        page: authenticatedPage,
      })
        .include('[role="dialog"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Test form labeling
      const inputs = modal.locator('input, textarea, select');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const inputId = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Each input should have proper labeling
        if (inputId) {
          const label = modal.locator(`label[for="${inputId}"]`);
          const hasLabel = (await label.count()) > 0;
          const hasAriaLabel = ariaLabel !== null;
          const hasAriaLabelledBy = ariaLabelledBy !== null;

          expect(hasLabel || hasAriaLabel || hasAriaLabelledBy).toBe(true);
        }
      }
    }
  });

  test('should have accessible interactive elements @a11y @interactive', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Scan for button accessibility
    const accessibilityScanResults = await new AxeBuilder({
      page: authenticatedPage,
    })
      .include('button')
      .include('[role="button"]')
      .include('[data-testid*="button"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Test that all interactive elements are keyboard accessible
    const interactiveElements = authenticatedPage.locator(
      'button, [role="button"], input, [role="textbox"], select, [role="combobox"], a'
    );

    const count = await interactiveElements.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      // Test first 10 elements
      const element = interactiveElements.nth(i);
      const isVisible = await element.isVisible();

      if (isVisible) {
        await element.focus();
        const isFocused = await element.evaluate(
          el => document.activeElement === el
        );
        expect(isFocused).toBe(true);
      }
    }
  });

  test('should have proper heading hierarchy @a11y @content', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check heading structure
    const headings = await authenticatedPage
      .locator('h1, h2, h3, h4, h5, h6')
      .all();
    const headingLevels = [];

    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));
      headingLevels.push(level);
    }

    // Should have exactly one h1
    const h1Count = headingLevels.filter(level => level === 1).length;
    expect(h1Count).toBe(1);

    // Headings should not skip levels
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Can't jump more than one level
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }

    // Run axe scan focused on headings
    const accessibilityScanResults = await new AxeBuilder({
      page: authenticatedPage,
    })
      .withRules(['heading-order'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have sufficient color contrast @a11y @visual', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Inject axe-core into the page
    await injectAxe(authenticatedPage);

    // Check color contrast compliance
    await checkA11y(authenticatedPage, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });

  test('should have accessible images @a11y @media', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check image alt text
    const images = await authenticatedPage.locator('img').all();

    for (const image of images) {
      const src = await image.getAttribute('src');
      const alt = await image.getAttribute('alt');
      const ariaLabel = await image.getAttribute('aria-label');
      const ariaLabelledBy = await image.getAttribute('aria-labelledby');
      const role = await image.getAttribute('role');

      // Decorative images should have empty alt or role="presentation"
      // Content images should have meaningful alt text
      if (src && !src.includes('decorative') && role !== 'presentation') {
        expect(alt || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }

    // Run axe scan for image accessibility
    const accessibilityScanResults = await new AxeBuilder({
      page: authenticatedPage,
    })
      .withRules(['image-alt'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support screen readers @a11y @screenreader', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Check for proper ARIA landmarks
    const landmarks = await authenticatedPage
      .locator(
        '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]'
      )
      .count();

    expect(landmarks).toBeGreaterThan(0);

    // Check for skip links
    const skipLinks = await authenticatedPage.locator('a[href^="#"]').all();
    let hasSkipLink = false;

    for (const link of skipLinks) {
      const text = await link.textContent();
      if (text && text.toLowerCase().includes('skip')) {
        hasSkipLink = true;
        break;
      }
    }

    // Skip links are recommended but not required
    if (!hasSkipLink) {
      console.warn(
        'Consider adding skip navigation links for better screen reader support'
      );
    }

    // Run comprehensive ARIA scan
    const accessibilityScanResults = await new AxeBuilder({
      page: authenticatedPage,
    })
      .withTags(['wcag2a', 'wcag2aa'])
      .withRules([
        'aria-valid-attr',
        'aria-valid-attr-value',
        'aria-required-attr',
      ])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should handle dynamic content accessibility @a11y @dynamic', async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');

    // Test dynamic content updates (like task addition)
    const addTaskButton = authenticatedPage.locator(
      '[data-testid="add-task"], [data-testid="quick-add-button"]'
    );

    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      const modal = authenticatedPage.locator('[role="dialog"]');
      await modal.waitFor({ state: 'visible' });

      // Check modal accessibility
      const accessibilityScanResults = await new AxeBuilder({
        page: authenticatedPage,
      })
        .include('[role="dialog"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Modal should trap focus
      const modalInputs = modal.locator(
        'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const inputCount = await modalInputs.count();

      if (inputCount > 0) {
        // Focus should be trapped within modal
        await authenticatedPage.keyboard.press('Tab');
        const focusedElement = authenticatedPage.locator(':focus');
        const isWithinModal =
          (await focusedElement.isVisible()) &&
          (await modal.locator(':focus').count()) > 0;
        expect(isWithinModal).toBe(true);
      }
    }
  });
});
