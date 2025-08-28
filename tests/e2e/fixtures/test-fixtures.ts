import { test as base, Page, BrowserContext } from '@playwright/test';
import { SeedManager } from '../data/seed-manager';
import { TestUser, testUsers } from '../data/test-users';

// Extend basic test to include custom fixtures
type TestFixtures = {
  authenticatedPage: Page;
  seedManager: SeedManager;
  testUser: TestUser;
  deterministicTime: void;
};

export const test = base.extend<TestFixtures>({
  // Seed manager fixture - provides deterministic data management
  seedManager: async ({}, use) => {
    const manager = new SeedManager();
    await use(manager);
  },

  // Test user fixture - provides a default authenticated user
  testUser: async ({}, use) => {
    await use(testUsers.admin);
  },

  // Deterministic time fixture - ensures consistent timing across tests
  deterministicTime: async ({ page }, use) => {
    // Set deterministic time in the browser
    await page.addInitScript(() => {
      const FAKE_NOW = new Date('2024-01-01T00:00:00.000Z').getTime();

      // Mock Date.now() and new Date()
      const originalDate = Date;
      const originalNow = Date.now;

      // @ts-ignore
      global.Date = class extends originalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(FAKE_NOW);
          } else {
            // @ts-ignore
            super(...args);
          }
        }

        static now() {
          return FAKE_NOW;
        }
      };

      // Preserve other Date methods
      Object.setPrototypeOf(global.Date, originalDate);
      Object.defineProperty(global.Date, 'prototype', {
        value: originalDate.prototype,
        writable: false,
      });
    });

    await use();
  },

  // Authenticated page fixture - provides a page with logged-in user
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      // Use the pre-generated storage state
      storageState: './e2e/data/storage-state.json',

      // Deterministic settings
      timezoneId: 'UTC',
      locale: 'en-US',

      // Disable animations for consistent testing
      reducedMotion: 'reduce',

      // Block external resources to prevent flakiness
      extraHTTPHeaders: {
        'X-Test-Mode': '1',
      },
    });

    // Route blocking for third-party services
    await context.route('**/*analytics*', route => route.abort());
    await context.route('**/*tracking*', route => route.abort());
    await context.route('**/*ads*', route => route.abort());

    const page = await context.newPage();

    // Navigate to app to enable localStorage access
    await page.goto('/');

    // Set up test environment
    await page.evaluate(() => {
      // Disable animations
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);

      // Set test mode
      window.localStorage.setItem('test_mode', 'true');
    });

    await use(page);

    await context.close();
  },
});

export { expect } from '@playwright/test';
