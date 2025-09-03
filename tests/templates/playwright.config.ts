/**
 * Playwright Configuration - Battle-Tested & Self-Diagnosing
 * 
 * This configuration enforces best practices for reliable, debuggable E2E tests.
 * Copy this file to your project root and customize as needed.
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e/tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:9000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Global test timeout */
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    /* Stabilize environment */
    locale: 'en-US',
    timezoneId: 'UTC',
    deviceScaleFactor: 1,
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run dev:stub',
      port: 9001,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
      },
    },
    {
      command: 'npm run dev:bff',
      port: 9002,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        STUB_URL: 'http://localhost:9001',
      },
    },
    {
      command: 'npm run dev:web',
      port: 9000,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        BFF_URL: 'http://localhost:9002',
      },
    },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/e2e/setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/helpers/global-teardown.ts'),

  /* Test timeout */
  timeout: 30000,

  /* Expect timeout */
  expect: {
    timeout: 5000,
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
  
  /* Maximum time one test can run for. */
  globalTimeout: 600000,
  
  /* Maximum time in milliseconds the whole test suite can run. */
  maxFailures: process.env.CI ? 10 : undefined,
});
