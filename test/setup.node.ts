// Node.js-specific test setup
// Use this for backend logic, utilities, and Node.js-dependent tests

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { webcrypto } from 'node:crypto'

// Global test utilities for Node.js environment
beforeAll(() => {
  // Node.js-specific global setup
  // - Mock file system operations
  // - Setup temporary directories
  // - Configure Node.js-specific libraries
  
  // Setup WebCrypto API for encryption tests
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, 'crypto', {
      value: webcrypto,
      writable: false,
      configurable: false
    });
  }
})

afterAll(() => {
  // Node.js-specific cleanup
  // - Remove temporary files
  // - Close database connections
  // - Clean up Node.js resources
})

beforeEach(() => {
  // Reset Node.js-specific state between tests
  // - Clear require cache for fresh modules
  // - Reset environment variables
  // - Clear timers and intervals
})

afterEach(() => {
  // Node.js-specific test cleanup
  // - Restore original modules
  // - Reset global state
})

// Extend global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      // Add Node.js-specific matchers here
    }
  }
}
