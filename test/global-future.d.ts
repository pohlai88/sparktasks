/**
 * Alternative global test declarations with namespace grouping
 * Example of how to organize as the test utilities grow
 * 
 * This file is not currently used but shows future organization strategy
 */

import type { Task, TaskSerialized } from '@shared/types';
import type { HealthStatus } from '@shared/health';

declare global {
  var testHelpers: Readonly<{
    // Task-related utilities
    task: Readonly<{
      create: () => Task;
      createSerialized: () => TaskSerialized;
      createCreateInput: () => Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
      createUpdateInput: () => Partial<Pick<Task, 'title' | 'description' | 'completed'>>;
    }>;
    
    // Health check utilities  
    health: Readonly<{
      create: () => HealthStatus;
      createUnhealthy: () => HealthStatus;
      createWithDependencies: (deps: Record<string, 'ok' | 'fail'>) => HealthStatus;
    }>;
    
    // Clock and time utilities
    clock: Readonly<{
      setDeterministic: (date?: Date) => void;
      reset: () => void;
      advance: (milliseconds: number) => void;
      freeze: () => void;
    }>;
    
    // Future: API simulation utilities
    api: Readonly<{
      simulateNetworkDelay: (ms: number) => Promise<void>;
      simulateError: (statusCode: number) => Error;
      createMockResponse: <T>(data: T, status?: number) => MockResponse<T>;
    }>;
  }>;
}

// Helper types for future API mocking
interface MockResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export {};
