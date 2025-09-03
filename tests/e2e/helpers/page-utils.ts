import { Page, Locator, expect } from '@playwright/test';

/**
 * Common page object utilities for Playwright tests
 */
export class PageUtils {
  constructor(private page: Page) {}

  /**
   * Wait for the page to be ready for testing
   */
  async waitForPageReady(): Promise<void> {
    // Wait for initial page load
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for React to be ready with more robust checks
    await this.page.waitForFunction(
      () => {
        // Check if React app has mounted by looking for the root element with content
        const root = document.querySelector('#root');
        if (!root) return false;
        
        // Check if React has rendered content (not just empty div)
        const hasContent = root.children.length > 0 || root.textContent?.trim().length > 0;
        
        // Also check if any loading indicators are gone
        const loadingElements = document.querySelectorAll(
          '[data-testid*="loading"], .loading, .spinner, [aria-busy="true"]'
        );
        const noLoading = loadingElements.length === 0;
        
        return hasContent && noLoading;
      },
      { timeout: 30000 }
    );

    // Additional wait for any async operations to complete
    await this.page.waitForTimeout(1000);
  }

  /**
   * Navigate to a route and wait for it to be ready
   */
  async navigateAndWait(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageReady();
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Check if an element is visible and enabled
   */
  async isElementReady(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return await element.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Fill a form field with proper validation
   */
  async fillField(selector: string, value: string): Promise<void> {
    const field = this.page.locator(selector);
    await field.waitFor({ state: 'visible' });
    await field.clear();
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }

  /**
   * Click an element with retry logic
   */
  async clickWithRetry(selector: string, maxRetries = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible' });
        await element.click();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify page accessibility
   */
  async checkAccessibility(): Promise<void> {
    // Basic accessibility checks
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').count();
    expect(headings).toBeGreaterThan(0);

    // Check for alt text on images
    const images = this.page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      expect(alt || ariaLabel).toBeTruthy();
    }
  }
}

/**
 * Assertion utilities for common test scenarios
 */
export class AssertionUtils {
  constructor(private page: Page) {}

  /**
   * Assert that a success message is displayed
   */
  async expectSuccessMessage(message?: string): Promise<void> {
    const successLocator = this.page.locator(
      '[data-testid="success"], .success, .alert-success'
    );
    await expect(successLocator).toBeVisible();

    if (message) {
      await expect(successLocator).toContainText(message);
    }
  }

  /**
   * Assert that an error message is displayed
   */
  async expectErrorMessage(message?: string): Promise<void> {
    const errorLocator = this.page.locator(
      '[data-testid="error"], .error, .alert-error'
    );
    await expect(errorLocator).toBeVisible();

    if (message) {
      await expect(errorLocator).toContainText(message);
    }
  }

  /**
   * Assert that a loading state is not present
   */
  async expectNotLoading(): Promise<void> {
    const loadingLocator = this.page.locator(
      '[data-testid="loading"], .loading, .spinner'
    );
    await expect(loadingLocator).toHaveCount(0);
  }

  /**
   * Assert page title and URL
   */
  async expectPageMeta(title: string, urlPath?: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);

    if (urlPath) {
      expect(this.page.url()).toContain(urlPath);
    }
  }
}

/**
 * Data attribute utilities for consistent element selection
 */
export class TestIdUtils {
  static button(action: string): string {
    return `[data-testid="button-${action}"]`;
  }

  static input(field: string): string {
    return `[data-testid="input-${field}"]`;
  }

  static modal(name: string): string {
    return `[data-testid="modal-${name}"]`;
  }

  static form(name: string): string {
    return `[data-testid="form-${name}"]`;
  }

  static list(name: string): string {
    return `[data-testid="list-${name}"]`;
  }

  static listItem(name: string, index?: number): string {
    const base = `[data-testid="list-item-${name}"]`;
    return index !== undefined ? `${base}:nth-child(${index + 1})` : base;
  }

  static card(name: string): string {
    return `[data-testid="card-${name}"]`;
  }

  static navigation(item: string): string {
    return `[data-testid="nav-${item}"]`;
  }
}
