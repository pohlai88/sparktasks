/**
 * E2E Test Registry - Single Source of Truth
 * 
 * This file contains the registry of all end-to-end tests in the SparkTasks project.
 * Each test entry includes metadata for tracking, organization, and automation.
 */

export interface E2ETestEntry {
  name: string;
  path: string;
  tags: string[];
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration?: number; // in seconds
  dependencies?: string[]; // other tests that must run first
}

export const e2eTestRegistry: E2ETestEntry[] = [
  // Critical Tests
  {
    name: 'Homepage Flow Test',
    path: './tests/e2e/tests/critical/homepage-flow.test.ts',
    tags: ['critical', 'homepage', 'smoke'],
    description: 'Tests homepage loading and basic functionality',
    priority: 'critical',
    estimatedDuration: 20,
  },
  {
    name: 'API Mocking Flow Test',
    path: './tests/e2e/tests/critical/api-mocking-flow.test.ts',
    tags: ['critical', 'api', 'mocking'],
    description: 'Tests API mocking functionality and service integration',
    priority: 'critical',
    estimatedDuration: 30,
  },

  // Smoke Tests
  {
    name: 'Remote Smoke Test',
    path: './tests/e2e/tests/smoke/remote-smoke.test.ts',
    tags: ['smoke', 'remote', 'basic'],
    description: 'Basic smoke tests for remote functionality',
    priority: 'high',
    estimatedDuration: 15,
  },
  {
    name: 'Simulation Smoke Test',
    path: './tests/e2e/tests/smoke/simulation-smoke.test.ts',
    tags: ['smoke', 'simulation', 'basic'],
    description: 'Basic smoke tests for simulation functionality',
    priority: 'high',
    estimatedDuration: 15,
  },

  // Visual Regression Tests
  {
    name: 'Visual Regression Test',
    path: './tests/e2e/tests/visual/visual-regression.test.ts',
    tags: ['visual', 'regression', 'screenshots'],
    description: 'Visual regression tests with screenshot comparisons',
    priority: 'medium',
    estimatedDuration: 25,
  },

  // Performance Tests
  {
    name: 'Performance Metrics Test',
    path: './tests/e2e/tests/performance/performance-metrics.test.ts',
    tags: ['performance', 'metrics', 'load-time'],
    description: 'Performance tests measuring load times and metrics',
    priority: 'high',
    estimatedDuration: 35,
  },

  // Accessibility Tests
  {
    name: 'Accessibility Audit Test',
    path: './tests/e2e/tests/accessibility/accessibility-audit.test.ts',
    tags: ['accessibility', 'a11y', 'screen-reader'],
    description: 'Accessibility tests for screen reader and keyboard navigation',
    priority: 'high',
    estimatedDuration: 30,
  },
];

// Helper functions for E2E test management
export const getCriticalTests = () => 
  e2eTestRegistry.filter(test => test.priority === 'critical');

export const getTestsByTag = (tag: string) => 
  e2eTestRegistry.filter(test => test.tags.includes(tag));

export const getSmokeTests = () => 
  e2eTestRegistry.filter(test => test.tags.includes('smoke'));

export const getVisualTests = () => 
  e2eTestRegistry.filter(test => test.tags.includes('visual'));

export const getPerformanceTests = () => 
  e2eTestRegistry.filter(test => test.tags.includes('performance'));

export const getAccessibilityTests = () => 
  e2eTestRegistry.filter(test => test.tags.includes('accessibility'));

// Test execution order based on dependencies
export const getExecutionOrder = () => {
  const ordered: E2ETestEntry[] = [];
  const remaining = [...e2eTestRegistry];
  
  while (remaining.length > 0) {
    const ready = remaining.filter(test => 
      !test.dependencies || test.dependencies.every(dep => 
        ordered.some(orderedTest => orderedTest.name === dep)
      )
    );
    
    if (ready.length === 0) {
      throw new Error('Circular dependency detected in E2E tests');
    }
    
    ordered.push(...ready);
    remaining.splice(0, remaining.length, ...remaining.filter(test => !ready.includes(test)));
  }
  
  return ordered;
};
