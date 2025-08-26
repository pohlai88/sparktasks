/**
 * MSW Test Utility - Fortune-500 Grade HTTP Mocking
 *
 * Opt-in MSW setup for integration tests that need HTTP behavior.
 * Only import and call useMsw() in integration test suites.
 *
 * Features:
 * - Automatic server lifecycle management
 * - Error on unhandled requests (catches API drift)
 * - Handler reset between tests
 * - Server override capability for specific test scenarios
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './msw.server';

/**
 * Setup MSW for integration tests
 *
 * Usage:
 * ```typescript
 * import { useMsw } from 'vitest/setup/useMsw'
 *
 * describe('APIExplorer Integration', () => {
 *   const mswServer = useMsw()
 *
 *   test('handles API errors', async () => {
 *     mswServer.use(
 *       http.get('/api/schemas', () => new HttpResponse(null, { status: 500 }))
 *     )
 *     // ... test code
 *   })
 * })
 * ```
 */
export function useMsw() {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error', // Fail on unhandled requests
    });
  });

  afterEach(() => {
    server.resetHandlers(); // Reset to original handlers
  });

  afterAll(() => {
    server.close();
  });

  return server; // Return server for test-specific overrides
}
