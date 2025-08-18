/**
 * Global test setup for Vitest
 * Runs before all test files
 */

/// <reference types="node" />

import { vi } from 'vitest';
import type { Task, TaskSerialized } from '@shared/types';
import type { HealthStatus } from '@shared/health';
import type { ErrorResponse } from '@shared/api-contracts';
import { serializeTask } from '@shared/types';
import { createErrorResponse, ErrorCodes } from '@shared/api-contracts';

// Mock environment variables for tests
// @ts-ignore - Node.js types not available in IDE but available at runtime
process.env.NODE_ENV = 'test';

// Mock crypto API for Node.js/vitest environment
if (!globalThis.crypto) {
  try {
    const { Crypto } = require('@peculiar/webcrypto');
    const crypto = new Crypto();
    globalThis.crypto = crypto as any;
    console.log('🔐 Crypto polyfill initialized');
  } catch (error) {
    // Fallback to Node.js built-in crypto if available
    try {
      const { webcrypto } = require('node:crypto');
      globalThis.crypto = webcrypto as Crypto;
      console.log('🔐 Node.js WebCrypto initialized');
    } catch (fallbackError) {
      console.warn('⚠️ No crypto implementation available');
    }
  }
}

// Default test date for deterministic testing
const DEFAULT_TEST_DATE = new Date('2025-08-15T10:00:00.000Z');

/**
 * Base mock task - single source of truth for test data
 * Returns frozen object for immutability
 */
const createBaseMockTask = (): Task => Object.freeze({
  id: 'task_1723723200000_abc123def',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2025-08-15T10:00:00.000Z'),
  updatedAt: new Date('2025-08-15T10:00:00.000Z')
} as const);

/**
 * Base mock health response
 * Returns frozen object for immutability
 */
const createBaseMockHealthResponse = (): HealthStatus => Object.freeze({
  status: 'healthy',
  timestamp: '2025-08-15T10:00:00.000Z',
  version: '1.0.0-test',
  uptime: 100,
  dependencies: Object.freeze({
    database: 'ok',
    cache: 'ok'
  })
} as const);

/**
 * Convert Task to TaskSerialized automatically
 */
const toSerialized = (task: Task): TaskSerialized => serializeTask(task);

// Global test utilities implementation with namespaced organization
globalThis.testHelpers = Object.freeze({
  // Task-related utilities
  task: Object.freeze({
    create: (): Task => {
      // Return fresh instance with same data (prevents === false positives)
      const base = createBaseMockTask();
      return Object.freeze({ ...base });
    },

    createSerialized: (): TaskSerialized => {
      const base = createBaseMockTask();
      return Object.freeze(toSerialized(base));
    },

    createComplete: (): Task => {
      const base = createBaseMockTask();
      return Object.freeze({ ...base, completed: true });
    },

    createHighPriority: (): Task => {
      const base = createBaseMockTask();
      return Object.freeze({ ...base, title: 'High Priority Task' });
    },

    createWithTags: (): Task => {
      const base = createBaseMockTask();
      return Object.freeze({ ...base, title: 'Task with tags #urgent #bug' });
    },

    createWithCustomDate: (date: Date): Task => {
      const base = createBaseMockTask();
      return Object.freeze({ ...base, createdAt: date, updatedAt: date });
    },

    createBatch: (count: number): Task[] => {
      return Array.from({ length: count }, (_, i) => {
        const base = createBaseMockTask();
        return Object.freeze({ 
          ...base, 
          id: `task_${Date.now()}_${i}`,
          title: `Test Task ${i + 1}` 
        });
      });
    }
  }),
  
  // Health-related utilities
  createMockHealthResponse: (): HealthStatus => {
    // Return fresh instance with same data
    const base = createBaseMockHealthResponse();
    return Object.freeze({ 
      ...base, 
      dependencies: base.dependencies ? Object.freeze({ ...base.dependencies }) : {}
    });
  },

  // API Contract validation utilities
  createMockErrorResponse: (code?: string, message?: string): ErrorResponse => {
    return Object.freeze(createErrorResponse(
      (code as keyof typeof ErrorCodes) || 'INTERNAL_ERROR',
      message || 'An unexpected error occurred',
      { timestamp: DEFAULT_TEST_DATE.toISOString() }
    ));
  },

  // Clock control utilities with enhanced cleanup
  setDeterministicClock: (date: Date = DEFAULT_TEST_DATE): void => {
    vi.useFakeTimers();
    vi.setSystemTime(date);
  },

  resetClock: (): void => {
    vi.clearAllTimers(); // Clear any pending timers
    vi.useRealTimers();
  }
});

// Environment validation - ensure we're actually in test mode
// @ts-ignore - Node.js types not available in IDE but available at runtime
if (process.env.NODE_ENV !== 'test') {
  throw new Error(
    `Global test setup loaded outside test environment. ` +
    // @ts-ignore - Node.js types not available in IDE but available at runtime
    `NODE_ENV is "${process.env.NODE_ENV}" but should be "test"`
  );
}

// Add any global mocks or setup here
console.log('🧪 Test environment initialized');
console.log(`📅 Default test date: ${DEFAULT_TEST_DATE.toISOString()}`);
// @ts-ignore - Node.js types not available in IDE but available at runtime
console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
