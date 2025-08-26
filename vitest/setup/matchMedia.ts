/**
 * Match Media Mock - Fortune-500 Grade Responsive Testing
 *
 * Provides mock implementation for window.matchMedia to:
 * - Test responsive components at different breakpoints
 * - Handle prefers-reduced-motion for animation testing
 * - Support dark/light mode preference testing
 * - Enable consistent media query testing
 */

import { beforeAll, vi } from 'vitest';

// Mock matchMedia implementation
const createMatchMedia = (matches: boolean) =>
  vi.fn(() => ({
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

beforeAll(() => {
  // Default to reduced motion for stable test environment
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => {
      // Handle specific media queries for testing
      if (query.includes('prefers-reduced-motion')) {
        return createMatchMedia(true)(); // Always prefer reduced motion in tests
      }

      if (query.includes('prefers-color-scheme: dark')) {
        return createMatchMedia(false)(); // Default to light mode
      }

      // Handle breakpoint queries (default to desktop)
      if (query.includes('max-width')) {
        return createMatchMedia(false)(); // Desktop view
      }

      if (query.includes('min-width')) {
        return createMatchMedia(true)(); // Desktop view
      }

      // Default fallback
      return createMatchMedia(false)();
    }),
  });
});
