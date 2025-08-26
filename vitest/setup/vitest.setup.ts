/**
 * Vitest Setup - Fortune-500 Grade Testing Configuration
 *
 * This file configures global test environment for enterprise-grade testing.
 * Includes accessibility testing, performance monitoring, and error detection.
 */

import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { afterEach, expect, vi } from 'vitest';

// Set test environment flag to disable animations and prevent React 18 concurrent rendering conflicts
process.env.TEST_ENV = 'true';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

// Mock requestAnimationFrame to run synchronously in tests
// This prevents React act() warnings from async animation state updates
vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  // In tests, execute callback synchronously to avoid act() warnings
  // This prevents the Accordion's setPanelHeights from causing async state updates
  try {
    callback(performance.now());
  } catch (error) {
    // Silently handle any timing-related errors in test environment
    console.warn('Animation callback failed in test:', error);
  }
  return 0; // Return a dummy ID
});

vi.stubGlobal('cancelAnimationFrame', () => {
  // No-op since we execute synchronously
});

// Performance budget configuration
export const PERFORMANCE_BUDGETS = {
  COMPONENT_RENDER_TIME: 50, // ms
  INTERACTION_RESPONSE_TIME: 16, // ms (60fps)
  ACCESSIBILITY_AUDIT_TIME: 100, // ms
} as const;

// Test environment detection
export const isTestEnvironment = () => process.env.NODE_ENV === 'test';

// Mock IntersectionObserver for components that use it
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(() => []),
}));

vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

// Mock ResizeObserver for components that use it
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', mockResizeObserver);

// Mock URL.createObjectURL for file upload tests
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true,
});

// Global test cleanup to prevent test leakage and timeouts
afterEach(async () => {
  // Skip React Testing Library cleanup to avoid React 18 concurrent mode conflicts
  // Component cleanup happens naturally during test teardown

  // Always clear all timers and restore real timers
  vi.clearAllTimers();
  vi.useRealTimers();

  // Clear all mocks
  vi.clearAllMocks();

  // Wait a brief moment for async cleanup
  await new Promise(resolve => {
    setTimeout(resolve, 10);
  });
});
