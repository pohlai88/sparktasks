import { test, expect } from '@playwright/test';
import { APIMocker, MockResponses, createAPIMocker } from '../../helpers/api-mocks';

/**
 * @mocking @api
 * API Mocking tests to ensure reliable testing without external dependencies
 *
 * Tests various mock scenarios including success, error, and edge cases
 * Run with: npm run test:mocking
 */
test.describe('API Mocking Tests', () => {
  let apiMocker: APIMocker;

  test.beforeEach(async ({ page }) => {
    apiMocker = await createAPIMocker(page);
  });

  test.afterEach(async () => {
    await apiMocker.clearMocks();
  });

  test('should handle successful API responses @mocking @smoke', async ({
    page,
  }) => {
    await page.goto('/');

    // Test that mocked authentication works
    await page.evaluate(() => {
      return fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
        }),
      }).then(r => r.json());
    });

    // Verify the page loads without API errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle API error responses gracefully @mocking @error', async ({
    page,
  }) => {
    // Setup error mocks
    await apiMocker.setupErrorMocks();

    await page.goto('/');

    // Test error handling
    const errorResponse = await page.evaluate(() => {
      return fetch('/api/error-test')
        .then(r => r.json())
        .catch(err => ({ error: 'Network error', message: err.message }));
    });

    expect(errorResponse.error).toBeTruthy();
  });

  test('should handle network timeout scenarios @mocking @timeout', async ({
    page,
  }) => {
    // Mock timeout endpoint
    await apiMocker.mockEndpoint('/api/slow-endpoint', {
      status: 200,
      body: { message: 'This will be slow' },
      delay: 1000, // 1 second delay
    });

    await page.goto('/');

    const startTime = Date.now();

    await page.evaluate(() => {
      return fetch('/api/slow-endpoint', {
        signal: AbortSignal.timeout(500), // 500ms timeout
      }).catch(() => ({ timeout: true }));
    });

    const duration = Date.now() - startTime;

    // Should timeout before the 1 second delay
    expect(duration).toBeLessThan(800);
  });

  test('should handle offline scenarios @mocking @offline', async ({
    page,
  }) => {
    await page.goto('/');

    // Simulate going offline
    await apiMocker.setupOfflineMocks();

    // Test that the app handles offline gracefully
    const offlineResponse = await page.evaluate(() => {
      return fetch('/api/users/profile')
        .then(r => r.json())
        .catch(() => ({ offline: true }));
    });

    expect(offlineResponse.offline).toBe(true);
  });

  test('should mock different HTTP methods correctly @mocking @methods', async ({
    page,
  }) => {
    // Mock POST request
    await apiMocker.mockEndpoint(
      '/api/tasks',
      MockResponses.success({ id: 'new-task', title: 'Created Task' }),
      'POST'
    );

    // Mock PUT request
    await apiMocker.mockEndpoint(
      '/api/tasks/123',
      MockResponses.success({ id: '123', title: 'Updated Task' }),
      'PUT'
    );

    // Mock DELETE request
    await apiMocker.mockEndpoint(
      '/api/tasks/123',
      MockResponses.success({ deleted: true }),
      'DELETE'
    );

    await page.goto('/');

    // Test POST
    const postResponse = await page.evaluate(() => {
      return fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Task' }),
      }).then(r => r.json());
    });

    expect(postResponse.data.title).toBe('Created Task');

    // Test PUT
    const putResponse = await page.evaluate(() => {
      return fetch('/api/tasks/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Task' }),
      }).then(r => r.json());
    });

    expect(putResponse.data.title).toBe('Updated Task');

    // Test DELETE
    const deleteResponse = await page.evaluate(() => {
      return fetch('/api/tasks/123', {
        method: 'DELETE',
      }).then(r => r.json());
    });

    expect(deleteResponse.data.deleted).toBe(true);
  });

  test('should handle authentication edge cases @mocking @auth', async ({
    page,
  }) => {
    // Mock unauthorized response
    await apiMocker.mockEndpoint(
      '/api/protected-resource',
      MockResponses.unauthorized()
    );

    // Mock forbidden response
    await apiMocker.mockEndpoint('/api/admin-only', MockResponses.forbidden());

    await page.goto('/');

    // Test unauthorized access
    const unauthorizedResponse = await page.evaluate(() => {
      return fetch('/api/protected-resource').then(r => ({
        status: r.status,
        data: r.json(),
      }));
    });

    expect(unauthorizedResponse.status).toBe(401);

    // Test forbidden access
    const forbiddenResponse = await page.evaluate(() => {
      return fetch('/api/admin-only').then(r => ({
        status: r.status,
        data: r.json(),
      }));
    });

    expect(forbiddenResponse.status).toBe(403);
  });

  test('should handle validation errors @mocking @validation', async ({
    page,
  }) => {
    // Mock validation error
    await apiMocker.mockEndpoint(
      '/api/validate-form',
      MockResponses.validationError(['email', 'password']),
      'POST'
    );

    await page.goto('/');

    const validationResponse = await page.evaluate(() => {
      return fetch('/api/validate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Empty body to trigger validation
      }).then(r => ({
        status: r.status,
        data: r.json(),
      }));
    });

    expect(validationResponse.status).toBe(422);
  });

  test('should handle large dataset mocking @mocking @data', async ({
    page,
  }) => {
    // Mock large dataset
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
      value: Math.random() * 1000,
    }));

    await apiMocker.mockEndpoint(
      '/api/large-dataset',
      MockResponses.success(largeDataset)
    );

    await page.goto('/');

    const dataResponse = await page.evaluate(() => {
      return fetch('/api/large-dataset').then(r => r.json());
    });

    expect(dataResponse.data).toHaveLength(100);
    expect(dataResponse.data[0].title).toBe('Item 0');
  });

  test('should support conditional mocking based on request data @mocking @conditional', async ({
    page,
  }) => {
    // Setup conditional mock based on request body
    await page.route('/api/conditional', async route => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.type === 'premium') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { access: 'premium', features: ['advanced', 'priority'] },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { access: 'basic', features: ['standard'] },
          }),
        });
      }
    });

    await page.goto('/');

    // Test premium access
    const premiumResponse = await page.evaluate(() => {
      return fetch('/api/conditional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'premium' }),
      }).then(r => r.json());
    });

    expect(premiumResponse.data.access).toBe('premium');

    // Test basic access
    const basicResponse = await page.evaluate(() => {
      return fetch('/api/conditional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'basic' }),
      }).then(r => r.json());
    });

    expect(basicResponse.data.access).toBe('basic');
  });
});
