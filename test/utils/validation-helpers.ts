/**
 * Test utilities for validating test infrastructure
 * Demonstrates @test/* alias usage
 */

import type { Task } from '@shared/types';
import type { ErrorResponse } from '@shared/api-contracts';
import { isValidErrorResponse } from '@shared/api-contracts';

/**
 * Helper to validate that a task mock has expected immutable properties
 */
export function validateTaskImmutability(task: Task): {
  isFrozen: boolean;
  hasExpectedId: boolean;
  hasValidDates: boolean;
} {
  return {
    isFrozen: Object.isFrozen(task),
    hasExpectedId: task.id.startsWith('task_'),
    hasValidDates: task.createdAt instanceof Date && task.updatedAt instanceof Date
  };
}

/**
 * Helper to validate global test helpers are properly configured
 */
export function validateTestHelpers(): {
  isAvailable: boolean;
  isFrozen: boolean;
  hasAllMethods: boolean;
} {
  const hasAllMethods = (
    typeof globalThis.testHelpers?.createMockTask === 'function' &&
    typeof globalThis.testHelpers?.createMockTaskSerialized === 'function' &&
    typeof globalThis.testHelpers?.createMockHealthResponse === 'function' &&
    typeof globalThis.testHelpers?.createMockErrorResponse === 'function' &&
    typeof globalThis.testHelpers?.setDeterministicClock === 'function' &&
    typeof globalThis.testHelpers?.resetClock === 'function'
  );

  return {
    isAvailable: typeof globalThis.testHelpers !== 'undefined',
    isFrozen: Object.isFrozen(globalThis.testHelpers),
    hasAllMethods
  };
}

/**
 * Helper to validate API error response format
 */
export function validateErrorResponse(errorResponse: unknown): {
  isValid: boolean;
  hasRequiredFields: boolean;
  hasValidStructure: boolean;
} {
  const isValid = isValidErrorResponse(errorResponse);
  
  // Additional manual checks for robustness
  const hasRequiredFields = (
    typeof errorResponse === 'object' &&
    errorResponse !== null &&
    'error' in errorResponse &&
    typeof (errorResponse as any).error === 'object' &&
    'code' in (errorResponse as any).error &&
    'message' in (errorResponse as any).error
  );

  const hasValidStructure = (
    hasRequiredFields &&
    typeof (errorResponse as any).error.code === 'string' &&
    typeof (errorResponse as any).error.message === 'string'
  );

  return {
    isValid,
    hasRequiredFields,
    hasValidStructure
  };
}
