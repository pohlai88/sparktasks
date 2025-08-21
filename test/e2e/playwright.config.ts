/**
 * @fileoverview E2E Test Configuration - Enterprise Playwright Setup
 * 
 * @description Comprehensive E2E testing configuration for enterprise-grade
 * browser testing with parallel execution, visual regression, and performance monitoring.
 */

import { defineConfig, devices } from '@playwright/test';

// ===== ENVIRONMENT CONFIGURATION =====

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:5173';
const CI = process.env.CI === 'true';
const HEADLESS = process.env.HEADLESS !== 'false';

export default defineConfig({
  // Test discovery
  testDir: './test/e2e',
  testMatch: ['**/*.e2e.{ts,tsx}', '**/specs/**/*.spec.ts'],
  
  // Global configuration
  timeout: 30000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      threshold: 0.2
    },
    toMatchSnapshot: {
      threshold: 0.2
    }
  },
  
  // Execution settings
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : 4,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/e2e-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['junit', { outputFile: 'test-results/e2e-junit.xml' }],
    CI ? ['github'] : ['list']
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./test/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./test/e2e/global-teardown.ts'),
  
  // Output directories
  outputDir: 'test-results/e2e-artifacts',
  
  use: {
    // Base URL for all tests
    baseURL,
    
    // Browser configuration
    headless: HEADLESS,
    viewport: { width: 1280, height: 720 },
    
    // Capture configuration
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Test isolation
    storageState: undefined, // Fresh storage for each test
    
    // Performance monitoring
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Accessibility testing
    colorScheme: 'light'
  },
  
  // Project configuration for different browsers
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Critical path testing (fast subset for CI)
    {
      name: 'critical',
      testMatch: '**/*.critical.e2e.{ts,tsx}',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  
  // Development server configuration
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test'
    }
  }
});
