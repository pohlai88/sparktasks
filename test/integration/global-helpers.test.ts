import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  validateTask,
  validateTaskSerialized,
  validateTaskCreateInput,
} from '@shared/types';

describe('Global Test Helpers', () => {
  beforeEach(() => {
    // Use the global deterministic clock helper
    globalThis.testHelpers.setDeterministicClock();
  });

  afterEach(() => {
    // Reset clock after each test
    globalThis.testHelpers.resetClock();
  });

  describe('Deterministic Mock Data', () => {
    it('should provide consistent mock data', () => {
      const task1 = globalThis.testHelpers.createMockTask();
      const task2 = globalThis.testHelpers.createMockTask();

      // Should be identical (deterministic)
      expect(task1).toEqual(task2);
      expect(task1.createdAt instanceof Date).toBe(true);
      expect(task1.updatedAt instanceof Date).toBe(true);
    });

    it('should automatically sync serialized data', () => {
      const task = globalThis.testHelpers.createMockTask();
      const serialized = globalThis.testHelpers.createMockTaskSerialized();

      // Serialized version should match task data
      expect(serialized.id).toBe(task.id);
      expect(serialized.title).toBe(task.title);
      expect(serialized.createdAt).toBe(task.createdAt.toISOString());
      expect(typeof serialized.createdAt).toBe('string');
      expect(typeof serialized.updatedAt).toBe('string');
    });

    it('should provide immutable mock data with frozen objects', () => {
      const health1 = globalThis.testHelpers.createMockHealthResponse();
      const health2 = globalThis.testHelpers.createMockHealthResponse();

      // Should be separate instances but same data
      expect(health1).toEqual(health2);
      expect(health1).not.toBe(health2); // Different object references

      // Objects should be frozen for immutability
      expect(Object.isFrozen(health1)).toBe(true);
      expect(Object.isFrozen(health2)).toBe(true);
    });
  });

  describe('Data Integrity Validation', () => {
    it('should maintain temporal consistency in Task timestamps', () => {
      const task = globalThis.testHelpers.createMockTask();

      // createdAt should be <= updatedAt (business rule)
      expect(task.createdAt.getTime()).toBeLessThanOrEqual(
        task.updatedAt.getTime()
      );

      // Both should be valid Date objects
      expect(task.createdAt instanceof Date).toBe(true);
      expect(task.updatedAt instanceof Date).toBe(true);
      expect(!isNaN(task.createdAt.getTime())).toBe(true);
      expect(!isNaN(task.updatedAt.getTime())).toBe(true);
    });

    it('should pass runtime type validation (Zod schemas)', () => {
      const task = globalThis.testHelpers.createMockTask();
      const serialized = globalThis.testHelpers.createMockTaskSerialized();

      // Should pass Zod validation (runtime type guards)
      expect(() => validateTask(task)).not.toThrow();
      expect(() => validateTaskSerialized(serialized)).not.toThrow();

      // Derived TaskCreateInput should also be valid
      const createInput = {
        title: task.title,
        description: task.description,
        completed: task.completed,
      };
      expect(() => validateTaskCreateInput(createInput)).not.toThrow();
    });

    it('should maintain correct TypeScript types at runtime', () => {
      const task = globalThis.testHelpers.createMockTask();
      const health = globalThis.testHelpers.createMockHealthResponse();

      // Task type guards
      expect(typeof task.id).toBe('string');
      expect(typeof task.title).toBe('string');
      expect(typeof task.completed).toBe('boolean');
      expect(task.createdAt instanceof Date).toBe(true);
      expect(task.updatedAt instanceof Date).toBe(true);

      // Optional description handling
      if (task.description !== undefined) {
        expect(typeof task.description).toBe('string');
      }

      // Health response type guards
      expect(['healthy', 'unhealthy']).toContain(health.status);
      expect(typeof health.timestamp).toBe('string');
      expect(typeof health.version).toBe('string');
      expect(typeof health.uptime).toBe('number');

      if (health.dependencies) {
        Object.values(health.dependencies).forEach(status => {
          expect(['ok', 'fail']).toContain(status);
        });
      }
    });
  });

  describe('Deterministic Clock Behavior', () => {
    it('should support custom test dates', () => {
      const customDate = new Date('2024-01-01T00:00:00.000Z');
      globalThis.testHelpers.setDeterministicClock(customDate);

      expect(Date.now()).toBe(customDate.getTime());
      expect(new Date().toISOString()).toBe(customDate.toISOString());
    });

    it('should handle edge-case dates without flakiness', () => {
      // Test leap year
      const leapYear = new Date('2024-02-29T23:59:59.999Z');
      globalThis.testHelpers.setDeterministicClock(leapYear);
      expect(new Date().getFullYear()).toBe(2024);
      expect(new Date().getMonth()).toBe(1); // February (0-indexed)
      expect(new Date().getDate()).toBe(29);

      // Test year boundary
      const yearBoundary = new Date('2024-12-31T23:59:59.999Z');
      globalThis.testHelpers.setDeterministicClock(yearBoundary);
      expect(new Date().getFullYear()).toBe(2024);
      expect(new Date().getMonth()).toBe(11); // December

      // Test epoch edge case
      const nearEpoch = new Date('1970-01-01T00:00:01.000Z');
      globalThis.testHelpers.setDeterministicClock(nearEpoch);
      expect(Date.now()).toBe(1000); // 1 second after epoch
    });

    it('should support date-sensitive business logic testing', () => {
      // Simulate a function that depends on current time
      const isRecentTask = (
        task: ReturnType<typeof globalThis.testHelpers.createMockTask>
      ) => {
        const hourAgo = Date.now() - 60 * 60 * 1000;
        return task.createdAt.getTime() > hourAgo;
      };

      // Set clock to a specific moment
      const testMoment = new Date('2025-08-15T12:00:00.000Z');
      globalThis.testHelpers.setDeterministicClock(testMoment);

      const task = globalThis.testHelpers.createMockTask();

      // Should be "recent" since mock uses current frozen time
      expect(isRecentTask(task)).toBe(true);

      // Move clock back 2 hours, same task should now be "old"
      const twoHoursAgo = new Date(testMoment.getTime() - 2 * 60 * 60 * 1000);
      globalThis.testHelpers.setDeterministicClock(twoHoursAgo);

      expect(isRecentTask(task)).toBe(false);
    });
  });

  describe('Mock Data Immutability', () => {
    it('should prevent accidental mutations', () => {
      const task = globalThis.testHelpers.createMockTask();
      const health = globalThis.testHelpers.createMockHealthResponse();

      // Objects should be frozen
      expect(Object.isFrozen(task)).toBe(true);
      expect(Object.isFrozen(health)).toBe(true);
      expect(Object.isFrozen(health.dependencies)).toBe(true);

      // Attempting to modify should fail silently in non-strict mode
      // or throw in strict mode (depending on environment)
      const originalTitle = task.title;
      const originalStatus = health.status;

      try {
        // These assignments should fail due to frozen objects
        (task as any).title = 'Modified Title';
        (health as any).status = 'modified';
      } catch (error) {
        // Expected in strict mode
      }

      // Values should remain unchanged
      expect(task.title).toBe(originalTitle);
      expect(health.status).toBe(originalStatus);
    });

    it('should prevent reassignment of testHelpers object', () => {
      // The testHelpers object itself should be readonly
      const originalHelpers = globalThis.testHelpers;

      try {
        // This should fail due to readonly constraint
        (globalThis as any).testHelpers = {};
      } catch (error) {
        // Expected in strict mode
      }

      // testHelpers should remain unchanged
      expect(globalThis.testHelpers).toBe(originalHelpers);
      expect(typeof globalThis.testHelpers.createMockTask).toBe('function');
    });

    it('should maintain referential integrity across test runs', () => {
      // Multiple calls should create new instances
      const tasks = Array.from({ length: 5 }, () =>
        globalThis.testHelpers.createMockTask()
      );

      // All should have same data
      tasks.forEach(task => {
        expect(task).toEqual(tasks[0]);
      });

      // But be different object references
      for (let i = 0; i < tasks.length - 1; i++) {
        for (let j = i + 1; j < tasks.length; j++) {
          expect(tasks[i]).not.toBe(tasks[j]);
        }
      }
    });
  });
});
