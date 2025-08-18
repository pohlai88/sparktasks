/**
 * Health Endpoint E2E Test
 * Demonstrates enhanced Playwright configuration with mobile testing
 */

import { test, expect } from '@playwright/test';

test.describe('Health Endpoint', () => {
  
  test('should return healthy status on desktop', async ({ page }) => {
    // Navigate to health endpoint
    await page.goto('/api/health');
    
    // Check for healthy response structure
    const content = await page.textContent('body');
    const healthData = JSON.parse(content || '{}');
    
    expect(healthData.status).toBe('healthy');
    expect(healthData.timestamp).toBeDefined();
    expect(healthData.version).toBeDefined();
    expect(typeof healthData.uptime).toBe('number');
  });

  test('should be accessible on mobile viewport', async ({ page }) => {
    // This test will run on mobile viewports (iPhone 14) due to our config
    await page.goto('/api/health');
    
    const content = await page.textContent('body');
    const healthData = JSON.parse(content || '{}');
    
    // Health endpoint should work identically on mobile
    expect(healthData.status).toBe('healthy');
  });
});

test.describe('API Contract Compliance', () => {
  
  test('should return standardized error format for 404', async ({ page }) => {
    // Test our error response contract
    const response = await page.goto('/api/nonexistent');
    
    expect(response?.status()).toBe(404);
    
    const content = await page.textContent('body');
    const errorData = JSON.parse(content || '{}');
    
    // Should follow our API contract error format
    expect(errorData.error).toBeDefined();
    expect(errorData.error.code).toBeDefined();
    expect(errorData.error.message).toBeDefined();
    expect(typeof errorData.error.code).toBe('string');
    expect(typeof errorData.error.message).toBe('string');
  });
});

test.describe('Serial Test Example', () => {
  // Example of using serial mode for tests that share state
  test.describe.configure({ mode: 'serial' });
  
  let sharedData: any;
  
  test('setup shared state', async ({ page }) => {
    await page.goto('/api/health');
    const content = await page.textContent('body');
    sharedData = JSON.parse(content || '{}');
  });
  
  test('use shared state', async ({ page }) => {
    // This test runs after the previous one due to serial mode
    expect(sharedData).toBeDefined();
    expect(sharedData.status).toBe('healthy');
    
    // Verify timestamp is reasonable (within last minute)
    const timestamp = new Date(sharedData.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    expect(diffMs).toBeLessThan(60000); // Less than 1 minute old
  });
});
