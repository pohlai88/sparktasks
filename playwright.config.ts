import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const isSmoke = process.env.SMOKE === '1';
const isCritical = process.env.CRITICAL === '1';

export default defineConfig({
  testDir: './e2e/tests',
  testMatch: '**/*.spec.ts',
  testIgnore: /.*\.quarantine\.spec\.ts/,
  snapshotDir: './e2e/__screenshots__',
  outputDir: './test-results/playwright-artifacts',
  reportSlowTests: { max: 5, threshold: 15_000 },
  fullyParallel: true,
  timeout: 45_000,
  expect: {
    timeout: 7_000,
    // Visual comparison settings
    toHaveScreenshot: {
      threshold: 0.2,
      animations: 'disabled',
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
    // Performance test tolerances
    toPass: {
      timeout: 10_000, // Allow extra time for performance measurements
    },
  },
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: process.env.CI_WORKERS ? Number(process.env.CI_WORKERS) : 2 } : {}),
  ...(isCI ? { maxFailures: 3 } : {}),

  // Reporter configuration for different environments
  reporter: isCI
    ? [
        ['github'],                                    // PR annotations
        ['junit', { outputFile: 'test-results/junit.xml' }], // CI parsing
        ['html', {
          open: 'never',
          outputFolder: 'test-results/e2e-report',
          attachmentsBaseURL: 'https://your-ci-artifacts-url/', // Update for your CI
        }], // CI artifact
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : [
        ['list'],
        ['html', {
          open: 'on-failure',
          outputFolder: 'test-results/e2e-report',
          attachmentsBaseURL: 'file://',
        }],
        ['json', { outputFile: 'test-results/results.json' }],
      ],

  // Test filtering based on tags
  ...(isSmoke ? { grep: /@smoke/ } : {}),
  ...(isCritical ? { grep: /@critical/ } : {}),
  ...(!(isSmoke || isCritical) ? { grepInvert: /@quarantine/ } : {}), // Exclude flaky tests from normal runs

  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    testIdAttribute: 'data-testid',
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 20_000,

    // Performance and reliability settings
    ignoreHTTPSErrors: true,

    // Deterministic timing for tests
    timezoneId: 'UTC',
    locale: 'en-US',

    // Browser context isolation
    contextOptions: {
      // Disable animations for deterministic testing
      reducedMotion: 'reduce',
    },
  },

  projects: [
    // Setup project to ensure deterministic state
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup',
    },
    {
      name: 'cleanup',
      testMatch: /global\.teardown\.ts/,
    },

    // Desktop browsers - core testing matrix
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './e2e/data/storage-state.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: './e2e/data/storage-state.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: './e2e/data/storage-state.json',
      },
      dependencies: ['setup'],
    },

    // Mobile browsers - run only for critical flows
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        storageState: './e2e/data/storage-state.json',
      },
      dependencies: ['setup'],
      grep: /@mobile|@critical/,
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 14'],
        storageState: './e2e/data/storage-state.json',
      },
      dependencies: ['setup'],
      grep: /@mobile|@critical/,
    },
  ],

  // Development server configuration
  webServer: {
    command: process.env.WEB_COMMAND || 'npm run dev',
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      // Deterministic environment for testing
      NODE_ENV: 'test',
      TZ: 'UTC',
      FAKE_NOW: '2024-01-01T00:00:00.000Z',
      DISABLE_ANALYTICS: '1',
      DISABLE_TELEMETRY: '1',
    },
  },

  // Metadata for reporting
  metadata: {
    seedVersion: process.env.SEED_VERSION || 'local',
    testEnvironment: process.env.TEST_ENV || 'local',
    buildInfo: {
      commit: process.env.GITHUB_SHA || 'local',
      branch: process.env.GITHUB_REF_NAME || 'local',
      pr: process.env.GITHUB_PR_NUMBER || null,
    },
  },
});
