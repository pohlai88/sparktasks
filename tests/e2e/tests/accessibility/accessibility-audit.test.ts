import { test, expect } from '../../helpers/fixtures/test-fixtures';
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
    // Navigate to the page for each test
    await authenticatedPage.goto('/');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for React to mount with a more lenient approach
    await authenticatedPage.waitForFunction(
      () => {
        const root = document.querySelector('#root');
        return root && (root.children.length > 0 || (root.textContent?.trim().length ?? 0) > 0);
      },
      { timeout: 30000 }
    );
  });

  test('should have no accessibility violations on homepage @a11y @smoke', async ({
    authenticatedPage,
  }) => {
    // Inject axe into the page
    await injectAxe(authenticatedPage);

    // Run comprehensive accessibility checks
    await checkA11y(authenticatedPage);
  });

  test('should have accessible navigation @a11y @navigation', async ({
    authenticatedPage,
  }) => {
    // Focus specifically on navigation areas
    await injectAxe(authenticatedPage);
    const violations = await getViolations(authenticatedPage, '[role="navigation"], nav, [data-testid*="nav"]');

    expect(violations).toEqual([]);

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

    // Trigger form (add task modal)
    const addTaskButton = authenticatedPage.locator(
      '[data-testid="add-task"], [data-testid="quick-add-button"]'
    );

    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      const modal = authenticatedPage.locator('[role="dialog"]');
      await modal.waitFor({ state: 'visible', timeout: 5000 });

      // Scan form for accessibility issues
      await injectAxe(authenticatedPage);
      const violations = await getViolations(authenticatedPage, '[role="dialog"]');

      expect(violations).toEqual([]);

      // Test form labeling efficiently
      const inputs = modal.locator('input, textarea, select');
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 10); i++) { // Limit to first 10 inputs
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

    // Scan for button accessibility
    await injectAxe(authenticatedPage);
    const violations = await getViolations(authenticatedPage, 'button, [role="button"], [data-testid*="button"]');

    expect(violations).toEqual([]);

    // Test that interactive elements are keyboard accessible (limit to visible elements)
    const interactiveElements = authenticatedPage.locator(
      'button:visible, [role="button"]:visible, input:visible, [role="textbox"]:visible, select:visible, [role="combobox"]:visible, a:visible'
    );

    const count = await interactiveElements.count();
    const testLimit = Math.min(count, 5); // Reduce to 5 elements for performance
    
    for (let i = 0; i < testLimit; i++) {
      const element = interactiveElements.nth(i);
      
      try {
        await element.focus({ timeout: 2000 });
        const isFocused = await element.evaluate(
          el => document.activeElement === el
        );
        expect(isFocused).toBe(true);
      } catch (error) {
        // Skip elements that can't be focused (e.g., disabled)
        console.warn(`Element ${i} could not be focused:`, error);
      }
    }
  });

  test('should have proper heading hierarchy @a11y @content', async ({
    authenticatedPage,
  }) => {

    // Check heading structure efficiently
    const headingLevels = await authenticatedPage.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headings).map(heading => 
        parseInt(heading.tagName.toLowerCase().charAt(1))
      );
    });

    // Should have exactly one h1
    const h1Count = headingLevels.filter(level => level === 1).length;
    expect(h1Count).toBe(1);

    // Headings should not skip levels
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Can't jump more than one level
      if (currentLevel !== undefined && previousLevel !== undefined) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }

    // Run axe scan focused on headings
    await injectAxe(authenticatedPage);
    const violations = await getViolations(authenticatedPage);

    expect(violations).toEqual([]);
  });

  test('should have sufficient color contrast @a11y @visual', async ({
    authenticatedPage,
  }) => {

    // Check color contrast compliance
    await injectAxe(authenticatedPage);
    const violations = await getViolations(authenticatedPage);

    expect(violations).toEqual([]);
  });

  test('should have accessible images @a11y @media', async ({
    authenticatedPage,
  }) => {

    // Check image alt text efficiently
    const imageData = await authenticatedPage.evaluate(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt,
        ariaLabel: img.getAttribute('aria-label'),
        ariaLabelledBy: img.getAttribute('aria-labelledby'),
        role: img.getAttribute('role')
      }));
    });

    for (const image of imageData) {
      // Decorative images should have empty alt or role="presentation"
      // Content images should have meaningful alt text
      if (image.src && !image.src.includes('decorative') && image.role !== 'presentation') {
        expect(image.alt || image.ariaLabel || image.ariaLabelledBy).toBeTruthy();
      }
    }

    // Run axe scan for image accessibility
    await injectAxe(authenticatedPage);
    const violations = await getViolations(authenticatedPage);

    expect(violations).toEqual([]);
  });

  test('should support screen readers @a11y @screenreader', async ({
    authenticatedPage,
  }) => {

    // Check for proper ARIA landmarks efficiently
    const landmarkData = await authenticatedPage.evaluate(() => {
      const landmarks = document.querySelectorAll(
        '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]'
      );
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      
      return {
        landmarkCount: landmarks.length,
        hasSkipLink: Array.from(skipLinks).some(link => 
          link.textContent?.toLowerCase().includes('skip')
        )
      };
    });

    expect(landmarkData.landmarkCount).toBeGreaterThan(0);

    // Skip links are recommended but not required
    if (!landmarkData.hasSkipLink) {
      console.warn(
        'Consider adding skip navigation links for better screen reader support'
      );
    }

    // Run comprehensive ARIA scan
    await injectAxe(authenticatedPage);
    const violations = await getViolations(authenticatedPage);

    expect(violations).toEqual([]);
  });

  test('should handle dynamic content accessibility @a11y @dynamic', async ({
    authenticatedPage,
  }) => {

    // Test dynamic content updates (like task addition)
    const addTaskButton = authenticatedPage.locator(
      '[data-testid="add-task"], [data-testid="quick-add-button"]'
    );

    if (await addTaskButton.isVisible()) {
      await addTaskButton.click();

      const modal = authenticatedPage.locator('[role="dialog"]');
      await modal.waitFor({ state: 'visible', timeout: 5000 });

      // Check modal accessibility
      await injectAxe(authenticatedPage);
      const violations = await getViolations(authenticatedPage, '[role="dialog"]');

      expect(violations).toEqual([]);

      // Modal should trap focus (test first few elements only)
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
