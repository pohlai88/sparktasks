import { type Page } from '@playwright/test';

/**
 * API Mocking utilities for deterministic E2E testing
 *
 * Provides consistent mock responses for external API calls,
 * enabling reliable testing without external dependencies.
 */

export interface MockAPIResponse {
  status?: number;
  contentType?: string;
  body: any;
  delay?: number;
}

export interface MockScenario {
  pattern: string | RegExp;
  response: MockAPIResponse;
  method?: string;
}

export class APIMocker {
  private page: Page;
  private scenarios: MockScenario[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Add a mock scenario for API endpoints
   */
  addMockScenario(scenario: MockScenario) {
    this.scenarios.push(scenario);
  }

  /**
   * Setup mocking for common API patterns
   */
  async setupDefaultMocks() {
    // Mock user authentication endpoints
    this.addMockScenario({
      pattern: /\/api\/auth\/(login|verify|refresh)/,
      response: {
        status: 200,
        body: {
          success: true,
          user: {
            id: 'mock-user-123',
            email: 'test@example.com',
            name: 'Test User',
            roles: ['user'],
          },
          token: 'mock-jwt-token',
          expiresIn: 3600,
        },
      },
    });

    // Mock user profile endpoints
    this.addMockScenario({
      pattern: /\/api\/users?\/profile/,
      response: {
        status: 200,
        body: {
          id: 'mock-user-123',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'https://example.com/avatar.png',
          settings: {
            theme: 'light',
            notifications: true,
          },
        },
      },
    });

    // Mock tasks/projects endpoints
    this.addMockScenario({
      pattern: /\/api\/(tasks|projects)/,
      response: {
        status: 200,
        body: {
          data: [
            {
              id: 'task-1',
              title: 'Mock Task 1',
              description: 'This is a mock task for testing',
              status: 'pending',
              priority: 'high',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
            {
              id: 'task-2',
              title: 'Mock Task 2',
              description: 'Another mock task',
              status: 'completed',
              priority: 'medium',
              createdAt: '2024-01-02T00:00:00Z',
              updatedAt: '2024-01-02T00:00:00Z',
            },
          ],
          total: 2,
          page: 1,
          limit: 10,
        },
      },
    });

    // Mock settings/configuration endpoints
    this.addMockScenario({
      pattern: /\/api\/settings/,
      response: {
        status: 200,
        body: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: false,
            desktop: true,
          },
        },
      },
    });

    // Apply all mock scenarios
    await this.applyMocks();
  }

  /**
   * Setup error scenario mocks for testing error handling
   */
  async setupErrorMocks() {
    this.addMockScenario({
      pattern: /\/api\/error-test/,
      response: {
        status: 500,
        body: {
          error: 'Internal Server Error',
          message: 'Mock error for testing error handling',
          code: 'MOCK_ERROR',
        },
      },
    });

    this.addMockScenario({
      pattern: /\/api\/timeout-test/,
      response: {
        status: 408,
        body: {
          error: 'Request Timeout',
          message: 'Mock timeout for testing timeout handling',
        },
        delay: 30000, // 30 second delay to simulate timeout
      },
    });

    await this.applyMocks();
  }

  /**
   * Setup offline scenario mocks
   */
  async setupOfflineMocks() {
    // Simulate network failures
    await this.page.route('**/api/**', async route => {
      await route.abort('failed');
    });
  }

  /**
   * Apply all configured mock scenarios
   */
  private async applyMocks() {
    for (const scenario of this.scenarios) {
      await this.page.route(scenario.pattern, async route => {
        const method = route.request().method();

        // Check if method matches (default to any method)
        if (scenario.method && method !== scenario.method.toUpperCase()) {
          await route.continue();
          return;
        }

        const response = scenario.response;

        // Add delay if specified
        if (response.delay) {
          await new Promise(resolve => setTimeout(resolve, response.delay));
        }

        await route.fulfill({
          status: response.status || 200,
          contentType: response.contentType || 'application/json',
          body:
            typeof response.body === 'string'
              ? response.body
              : JSON.stringify(response.body),
        });
      });
    }
  }

  /**
   * Clear all mocks
   */
  async clearMocks() {
    await this.page.unrouteAll();
    this.scenarios = [];
  }

  /**
   * Mock specific endpoint with custom response
   */
  async mockEndpoint(
    pattern: string | RegExp,
    response: MockAPIResponse,
    method?: string
  ) {
    await this.page.route(pattern, async route => {
      const requestMethod = route.request().method();

      if (method && requestMethod !== method.toUpperCase()) {
        await route.continue();
        return;
      }

      if (response.delay) {
        await new Promise(resolve => setTimeout(resolve, response.delay));
      }

      await route.fulfill({
        status: response.status || 200,
        contentType: response.contentType || 'application/json',
        body:
          typeof response.body === 'string'
            ? response.body
            : JSON.stringify(response.body),
      });
    });
  }
}

/**
 * Utility function to create API mocker for tests
 */
export async function createAPIMocker(page: Page): Promise<APIMocker> {
  const mocker = new APIMocker(page);
  await mocker.setupDefaultMocks();
  return mocker;
}

/**
 * Common mock responses for different scenarios
 */
export const MockResponses = {
  success: (data: any) => ({
    status: 200,
    body: { success: true, data },
  }),

  error: (message: string, code = 500) => ({
    status: code,
    body: {
      error: true,
      message,
      timestamp: new Date().toISOString(),
    },
  }),

  unauthorized: () => ({
    status: 401,
    body: {
      error: 'Unauthorized',
      message: 'Authentication required',
    },
  }),

  forbidden: () => ({
    status: 403,
    body: {
      error: 'Forbidden',
      message: 'Insufficient permissions',
    },
  }),

  notFound: (resource = 'Resource') => ({
    status: 404,
    body: {
      error: 'Not Found',
      message: `${resource} not found`,
    },
  }),

  validationError: (fields: string[]) => ({
    status: 422,
    body: {
      error: 'Validation Error',
      message: 'Invalid input data',
      fields: fields.map(field => ({
        field,
        message: `${field} is required`,
      })),
    },
  }),
};
