/**
 * @fileoverview Vitest Global Setup - Enterprise Testing Environment
 *
 * @description Comprehensive test setup for enterprise-grade Vitest environment
 * with enhanced mocking, type safety, and performance monitoring.
 */

import { vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import type { Task } from '@/shared/types';

// ===== GLOBAL TEST CONFIGURATION =====

// Set test environment
// @ts-ignore - Node.js types available at runtime
process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';

// ===== GLOBAL MOCKS =====

// Enhanced console spy for test debugging
const originalConsole = { ...console };
let consoleSpy: {
  log: MockInstance;
  warn: MockInstance;
  error: MockInstance;
  info: MockInstance;
};

// Performance monitoring
const performanceMarks = new Map<string, number>();

// ===== TEST DATA FACTORIES =====

/**
 * Base mock task factory - SSOT for test data
 */
export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2025-08-15T10:00:00.000Z'),
  updatedAt: new Date('2025-08-15T10:00:00.000Z'),
  ...overrides,
});

/**
 * Mock command factory for CommandPalette tests
 */
export const createMockCommand = (overrides: any = {}) => ({
  id: `cmd_${Math.random().toString(36).substr(2, 9)}`,
  label: 'Test Command',
  description: 'Test command description',
  action: vi.fn().mockResolvedValue(undefined),
  shortcut: null,
  keywords: [],
  icon: null,
  ...overrides,
});

/**
 * Mock command group factory
 */
export const createMockCommandGroup = (overrides: any = {}) => ({
  label: 'Test Group',
  items: [createMockCommand()],
  ...overrides,
});

// ===== UTILITY FUNCTIONS =====

/**
 * Start performance measurement
 */
export const startPerformanceMark = (name: string): void => {
  performanceMarks.set(name, performance.now());
};

/**
 * End performance measurement and return duration
 */
export const endPerformanceMark = (name: string): number => {
  const start = performanceMarks.get(name);
  if (!start) {
    throw new Error(`Performance mark '${name}' not found`);
  }
  const duration = performance.now() - start;
  performanceMarks.delete(name);
  return duration;
};

/**
 * Create deterministic test date
 */
export const createTestDate = (offset: number = 0): Date => {
  return new Date(Date.UTC(2025, 7, 15, 10, 0, 0, offset)); // Aug 15, 2025 10:00:00 UTC
};

/**
 * Wait for next tick (useful for async operations)
 */
export const waitForNextTick = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

/**
 * Wait for multiple ticks
 */
export const waitForTicks = (count: number = 1): Promise<void> => {
  return new Promise(resolve => {
    let remaining = count;
    const tick = () => {
      if (--remaining <= 0) {
        resolve();
      } else {
        setTimeout(tick, 0);
      }
    };
    tick();
  });
};

// ===== GLOBAL HOOKS =====

beforeAll(() => {
  // Initialize console spies
  consoleSpy = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
  };

  // Mock timers for consistent testing
  vi.useFakeTimers();
  vi.setSystemTime(createTestDate());

  console.info('🧪 Vitest enterprise environment initialized');
});

afterAll(() => {
  // Cleanup timers
  vi.useRealTimers();

  // Restore console
  Object.assign(console, originalConsole);

  console.info('🧪 Vitest enterprise environment cleaned up');
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();

  // Reset performance marks
  performanceMarks.clear();

  // Reset system time to deterministic date
  vi.setSystemTime(createTestDate());
});

afterEach(() => {
  // Cleanup any remaining mocks
  vi.restoreAllMocks();

  // Clear performance marks
  performanceMarks.clear();
});

// ===== EXPORTS =====

export { consoleSpy, performanceMarks };

// Make utilities available globally
declare global {
  var createMockTask: (overrides?: Partial<Task>) => Task;
  var createMockCommand: (overrides?: any) => any;
  var createMockCommandGroup: (overrides?: any) => any;
  var startPerformanceMark: (name: string) => void;
  var endPerformanceMark: (name: string) => number;
  var createTestDate: (offset?: number) => Date;
  var waitForNextTick: () => Promise<void>;
  var waitForTicks: (count?: number) => Promise<void>;
}

globalThis.createMockTask = createMockTask;
globalThis.createMockCommand = createMockCommand;
globalThis.createMockCommandGroup = createMockCommandGroup;
globalThis.startPerformanceMark = startPerformanceMark;
globalThis.endPerformanceMark = endPerformanceMark;
globalThis.createTestDate = createTestDate;
globalThis.waitForNextTick = waitForNextTick;
globalThis.waitForTicks = waitForTicks;
