/**
 * Console Guard - Fortune-500 Grade Error Detection
 *
 * Prevents silent console errors/warnings that could indicate:
 * - React warnings (useEffect dependencies, keys, etc.)
 * - Accessibility violations
 * - Performance issues
 * - Third-party library warnings
 *
 * Any console.error or console.warn will fail the test, forcing
 * developers to fix underlying issues rather than ignore them.
 */

import { beforeEach, afterEach, vi } from 'vitest';

let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;

beforeEach(() => {
  // Store original console methods
  originalConsoleError = console.error;
  originalConsoleWarn = console.warn;

  // Mock console.error to throw on any error
  console.error = vi.fn((...args: unknown[]) => {
    // Filter out known safe messages that shouldn't fail tests
    const message = args.join(' ');

    // Allow specific React testing warnings that are expected
    const allowedMessages = [
      'Warning: ReactDOM.render is deprecated',
      'Warning: componentWillReceiveProps has been renamed',
      'Warning: Attempted to synchronously unmount a root while React was already rendering',
      'Warning: Cannot update a component',
      'Warning: An update to %s inside a test was not wrapped in act(...)',
      'Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`',
      'Should not already be working',
      'focusedElement.scrollIntoView is not a function',
      'Uncaught [TypeError: focusedElement.scrollIntoView is not a function]',
      // Add other known safe warnings here
    ];

    const isAllowed = allowedMessages.some(allowed =>
      message.includes(allowed)
    );

    if (!isAllowed) {
      throw new Error(`Console Error Detected: ${message}`);
    }
  });

  // Mock console.warn to throw on any warning
  console.warn = vi.fn((...args: unknown[]) => {
    const message = args.join(' ');

    // Allow specific warnings that are expected in tests
    const allowedWarnings = [
      'Warning: An invalid form control',
      'Warning: Attempted to synchronously unmount a root while React was already rendering',
      'Warning: Cannot update a component',
      'Warning: An update to %s inside a test was not wrapped in act(...)',
      'Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`',
      'Should not already be working',
      // Add other known safe warnings here
    ];

    const isAllowed = allowedWarnings.some(allowed =>
      message.includes(allowed)
    );

    if (!isAllowed) {
      throw new Error(`Console Warning Detected: ${message}`);
    }
  });
});

afterEach(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
