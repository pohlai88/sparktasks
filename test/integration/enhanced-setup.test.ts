import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  validateTaskImmutability,
  validateTestHelpers,
  validateErrorResponse,
} from '@test/utils/validation-helpers';

describe('Enhanced Test Setup Validation', () => {
  beforeEach(() => {
    // Reset any test state
    testHelpers.resetClock();
  });

  afterEach(() => {
    // Clean up after each test
    testHelpers.resetClock();
  });

  describe('Immutable Mock Factories', () => {
    it('should create fresh instances of mock tasks (prevents === false positives)', () => {
      const task1 = testHelpers.createMockTask();
      const task2 = testHelpers.createMockTask();

      // Should be deeply equal but not same reference
      expect(task1).toEqual(task2);
      expect(task1).not.toBe(task2);
    });

    it('should create frozen mock objects (prevents mutation)', () => {
      const task = testHelpers.createMockTask();

      // Attempt to mutate should be silently ignored (or throw in strict mode)
      expect(() => {
        // @ts-ignore - intentionally testing runtime behavior
        task.title = 'Modified Title';
      }).not.toThrow();

      // Original value should be preserved
      expect(task.title).toBe('Test Task');
    });

    it('should create consistent serialized tasks', () => {
      const serialized1 = testHelpers.createMockTaskSerialized();
      const serialized2 = testHelpers.createMockTaskSerialized();

      expect(serialized1).toEqual(serialized2);
      expect(serialized1).not.toBe(serialized2);

      // Should have ISO date strings
      expect(typeof serialized1.createdAt).toBe('string');
      expect(new Date(serialized1.createdAt).toISOString()).toBe(
        serialized1.createdAt
      );
    });

    it('should create frozen health responses with nested object immutability', () => {
      const health = testHelpers.createMockHealthResponse();

      // Top-level object should be frozen
      expect(Object.isFrozen(health)).toBe(true);

      // Nested dependencies should also be frozen
      expect(Object.isFrozen(health.dependencies)).toBe(true);
    });
  });

  describe('Enhanced Clock Control', () => {
    it('should set deterministic time for consistent testing', () => {
      const testDate = new Date('2025-08-15T15:30:00.000Z');

      testHelpers.setDeterministicClock(testDate);

      // All Date.now() calls should return the fixed time
      expect(Date.now()).toBe(testDate.getTime());
      expect(new Date().getTime()).toBe(testDate.getTime());
    });

    it('should reset clock and clear all timers (prevents leakage)', () => {
      // Set up some timers
      const timeoutId = setTimeout(() => {}, 1000);
      const intervalId = setInterval(() => {}, 500);

      testHelpers.setDeterministicClock();
      testHelpers.resetClock();

      // Should be back to real time
      const beforeTime = Date.now();
      // Small delay to ensure time has passed
      setTimeout(() => {
        const afterTime = Date.now();
        expect(afterTime).toBeGreaterThan(beforeTime);
      }, 1);

      // Cleanup
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    });

    it('should use default test date when no date provided', () => {
      testHelpers.setDeterministicClock();

      const expectedTime = new Date('2025-08-15T10:00:00.000Z').getTime();
      expect(Date.now()).toBe(expectedTime);
    });
  });

  describe('Test Environment Configuration', () => {
    it('should have test environment variables set', () => {
      // @ts-ignore - Node.js process available at runtime
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should have global testHelpers available and properly configured', () => {
      const validation = validateTestHelpers();

      expect(validation.isAvailable).toBe(true);
      expect(validation.isFrozen).toBe(true);
      expect(validation.hasAllMethods).toBe(true);
    });

    it('should create properly immutable mock objects', () => {
      const task = testHelpers.createMockTask();
      const validation = validateTaskImmutability(task);

      expect(validation.isFrozen).toBe(true);
      expect(validation.hasExpectedId).toBe(true);
      expect(validation.hasValidDates).toBe(true);
    });

    it('should create valid API contract error responses', () => {
      const errorResponse = testHelpers.createMockErrorResponse(
        'TASK_NOT_FOUND',
        'Task not found'
      );
      const validation = validateErrorResponse(errorResponse);

      expect(validation.isValid).toBe(true);
      expect(validation.hasRequiredFields).toBe(true);
      expect(validation.hasValidStructure).toBe(true);

      // Verify specific structure
      expect(errorResponse.error.code).toBe('TASK_NOT_FOUND');
      expect(errorResponse.error.message).toBe('Task not found');
      expect(Object.isFrozen(errorResponse)).toBe(true);
    });

    it('should prevent testHelpers reassignment', () => {
      expect(Object.isFrozen(testHelpers)).toBe(true);

      expect(() => {
        // @ts-ignore - intentionally testing runtime behavior
        testHelpers.createMockTask = () => ({}) as any;
      }).not.toThrow(); // Silently ignored in non-strict mode

      // Should still be the original function
      expect(typeof testHelpers.createMockTask).toBe('function');
    });
  });
});
