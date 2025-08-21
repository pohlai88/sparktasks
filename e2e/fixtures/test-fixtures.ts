/**
 * Enterprise Test Fixtures
 *
 * Provides deterministic test scenarios with:
 * - Authenticated user contexts
 * - Pre-seeded business data
 * - Isolated test environments
 */

import { test as base, expect } from '@playwright/test';
import { enterpriseTaskScenario } from '../data/scenarios/enterpriseTaskScenario';
import { competitorBenchmarkScenario } from '../data/scenarios/competitorBenchmarkScenario';
import { mintSession } from './auth';

/**
 * Enterprise Task Management Scenario
 * Pre-configured with realistic business data
 */
export const taskTest = base.extend<{
  scenario: Awaited<ReturnType<typeof enterpriseTaskScenario>>;
}>({
  scenario: async ({ context }, use) => {
    const scenario = await enterpriseTaskScenario();
    await mintSession(context, scenario.admin);
    await use(scenario);
    // Cleanup handled by transaction rollback
  },
});

/**
 * Competitive Benchmark Scenario
 * Large datasets for performance testing vs ClickUp/Trello
 */
export const benchmarkTest = base.extend<{
  scenario: Awaited<ReturnType<typeof competitorBenchmarkScenario>>;
}>({
  scenario: async ({ context }, use) => {
    const scenario = await competitorBenchmarkScenario();
    await mintSession(context, scenario.testUser);
    await use(scenario);
  },
});

/**
 * Base test with minimal setup
 * For component-level testing
 */
export const componentTest = base.extend<{
  workerId: number;
}>({
  workerId: async ({}, use) => {
    // Extract worker ID from test worker process
    const workerId = parseInt(process.env.TEST_WORKER_INDEX || '1');
    await use(workerId);
  },
});

export { expect };
