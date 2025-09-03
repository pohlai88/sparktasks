/**
 * Vitest Test Registry - Single Source of Truth
 * 
 * This file contains the registry of all unit and component tests in the SparkTasks project.
 * Each test entry includes metadata for tracking, organization, and coverage analysis.
 */

export interface VitestTestEntry {
  name: string;
  path: string;
  tags: string[];
  description: string;
  category: 'component' | 'hook' | 'util' | 'service' | 'store' | 'integration';
  coverage: 'required' | 'optional' | 'excluded';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies?: string[]; // other tests or modules this depends on
}

export const vitestRegistry: VitestTestEntry[] = [
  // UI Enhanced Components
  {
    name: 'Button Component',
    path: './tests/vitest/unit/components/ui-enhanced/Button.test.tsx',
    tags: ['ui', 'component', 'interaction'],
    description: 'Tests Button component variants, sizes, states, and user interactions',
    category: 'component',
    coverage: 'required',
    priority: 'critical',
  },

  // Container Components
  {
    name: 'RailwayMap Container',
    path: './tests/vitest/unit/components/containers/RailwayMap.test.tsx',
    tags: ['container', 'component', 'railway'],
    description: 'Tests RailwayMap container component with map rendering and interactions',
    category: 'component',
    coverage: 'required',
    priority: 'high',
  },
  {
    name: 'RailwayStation Container',
    path: './tests/vitest/unit/components/containers/RailwayStation.test.tsx',
    tags: ['container', 'component', 'railway'],
    description: 'Tests RailwayStation container component with station data and display',
    category: 'component',
    coverage: 'required',
    priority: 'high',
  },
  {
    name: 'RailwayStationCard Container',
    path: './tests/vitest/unit/components/containers/RailwayStationCard.test.tsx',
    tags: ['container', 'component', 'railway'],
    description: 'Tests RailwayStationCard container component with card layout and data',
    category: 'component',
    coverage: 'required',
    priority: 'medium',
  },

  // Service Layer
  {
    name: 'HttpRemote Service',
    path: './tests/vitest/unit/services/http-remote.test.ts',
    tags: ['service', 'http', 'remote'],
    description: 'Tests HTTP remote service with API calls and error handling',
    category: 'service',
    coverage: 'required',
    priority: 'critical',
  },
];

// Helper functions for Vitest test management
export const getTestsByCategory = (category: VitestTestEntry['category']) => 
  vitestRegistry.filter(test => test.category === category);

export const getTestsByTag = (tag: string) => 
  vitestRegistry.filter(test => test.tags.includes(tag));

export const getCriticalTests = () => 
  vitestRegistry.filter(test => test.priority === 'critical');

export const getRequiredCoverageTests = () => 
  vitestRegistry.filter(test => test.coverage === 'required');

export const getComponentTests = () => 
  vitestRegistry.filter(test => test.category === 'component');

export const getHookTests = () => 
  vitestRegistry.filter(test => test.category === 'hook');

export const getUtilTests = () => 
  vitestRegistry.filter(test => test.category === 'util');

export const getServiceTests = () => 
  vitestRegistry.filter(test => test.category === 'service');

export const getStoreTests = () => 
  vitestRegistry.filter(test => test.category === 'store');

export const getIntegrationTests = () => 
  vitestRegistry.filter(test => test.category === 'integration');

// Coverage analysis
export const getCoverageStats = () => {
  const total = vitestRegistry.length;
  const required = vitestRegistry.filter(test => test.coverage === 'required').length;
  const optional = vitestRegistry.filter(test => test.coverage === 'optional').length;
  const excluded = vitestRegistry.filter(test => test.coverage === 'excluded').length;
  
  return {
    total,
    required,
    optional,
    excluded,
    requiredPercentage: Math.round((required / total) * 100),
  };
};
