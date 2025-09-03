/**
 * Central SSOT (Single Source of Truth) Index for All Test Types
 * 
 * This file serves as the main registry for all tests in the SparkTasks project.
 * It imports and exports all test registries for centralized management.
 */

import { e2eTestRegistry } from './e2e/ssot.e2e';
import { vitestRegistry } from './vitest/ssot.vitest';

// Central test registry combining all test types
export const testRegistry = {
  e2e: e2eTestRegistry,
  vitest: vitestRegistry,
};

// Individual exports for specific use cases
export { e2eTestRegistry, vitestRegistry };

// Test statistics and metadata
export const testStats = {
  total: e2eTestRegistry.length + vitestRegistry.length,
  e2e: e2eTestRegistry.length,
  vitest: vitestRegistry.length,
  lastUpdated: new Date().toISOString(),
};

// Helper functions for test management
export const getTestsByTag = (tag: string) => {
  const allTests = [...e2eTestRegistry, ...vitestRegistry];
  return allTests.filter(test => test.tags.includes(tag));
};

export const getTestsByType = (type: 'e2e' | 'vitest') => {
  return type === 'e2e' ? e2eTestRegistry : vitestRegistry;
};

export const getTestByName = (name: string) => {
  const allTests = [...e2eTestRegistry, ...vitestRegistry];
  return allTests.find(test => test.name === name);
};

// Export for use in scripts and tooling
export default testRegistry;
