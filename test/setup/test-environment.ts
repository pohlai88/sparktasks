/**
 * @fileoverview Enterprise Test Environment Configuration
 *
 * @description Ensures consistent test environment setup across all component tests.
 * Import this in your test files to automatically configure the environment.
 */

import { beforeAll, beforeEach, afterEach, vi } from 'vitest';

// ===== GLOBAL TEST ENVIRONMENT SETUP =====

beforeAll(() => {
  // Ensure performance marks are available
  if (!globalThis.startPerformanceMark) {
    const performanceMarks = new Map<string, number>();

    globalThis.startPerformanceMark = (name: string) => {
      performanceMarks.set(name, performance.now());
    };

    globalThis.endPerformanceMark = (name: string) => {
      const start = performanceMarks.get(name);
      if (!start) {
        throw new Error(`Performance mark '${name}' not found`);
      }
      const duration = performance.now() - start;
      performanceMarks.delete(name);
      return duration;
    };
  }

  // Enhanced DOM mocking for focus management
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      getPropertyValue: () => '',
      visibility: 'visible',
      display: 'block',
    }),
  });

  // Mock scrollIntoView for components that use it
  Element.prototype.scrollIntoView = vi.fn();
});

// ===== STANDARD TEST CLEANUP =====

beforeEach(() => {
  // Clear all mocks
  vi.clearAllMocks();

  // Initialize common performance marks
  if (globalThis.startPerformanceMark) {
    try {
      globalThis.startPerformanceMark('test-start');
      globalThis.startPerformanceMark('render-test');
      globalThis.startPerformanceMark('large-render-test');
    } catch (error) {
      // Marks may already exist, that's okay
    }
  }
});

afterEach(() => {
  // Restore all mocks
  vi.restoreAllMocks();

  // Clean up any remaining performance marks
  if (globalThis.endPerformanceMark) {
    try {
      globalThis.endPerformanceMark('test-start');
    } catch (error) {
      // Mark may not exist, that's okay
    }
  }
});

// ===== ENVIRONMENT VALIDATION =====

export function validateTestEnvironment() {
  const issues: string[] = [];

  // Check for Vitest
  if (typeof vi === 'undefined') {
    issues.push('Vitest not available');
  }

  // Check for DOM environment
  if (typeof document === 'undefined') {
    issues.push('DOM environment not available');
  }

  // Check for performance marks
  if (!globalThis.startPerformanceMark) {
    issues.push('Performance marks not configured');
  }

  if (issues.length > 0) {
    console.warn('Test environment issues detected:', issues);
    return false;
  }

  return true;
}

// ===== EXPORT CONFIGURATION =====

export const TestEnvironmentConfig = {
  validateTestEnvironment,
  isConfigured: true,
};

export default TestEnvironmentConfig;
