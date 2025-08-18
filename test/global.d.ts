/**
 * Global test type declarations
 * Only included in test TypeScript configuration
 */

/// <reference types="node" />
/// <reference types="vitest/globals" />

import type { Task, TaskSerialized } from '@shared/types';
import type { HealthStatus } from '@shared/health';
import type { ErrorResponse } from '@shared/api-contracts';

declare global {
  var testHelpers: Readonly<{
    // Task mock factories - using the actual structure from setup.ts
    task: Readonly<{
      create: () => Task;
      createSerialized: () => TaskSerialized;
      createComplete: () => Task;
      createHighPriority: () => Task;
      createWithTags: () => Task;
      createWithCustomDate: (date: Date) => Task;
      createBatch: (count: number) => Task[];
    }>;
    
    // Health mock factories
    createMockHealthResponse: () => HealthStatus;
    
    // API Contract mock factories
    createMockErrorResponse: (code?: string, message?: string) => ErrorResponse;
    
    // Clock control utilities
    setDeterministicClock: (date?: Date) => void;
    resetClock: () => void;
  }>;
}

// Ensure this file is treated as a module for proper augmentation scoping
export {};
