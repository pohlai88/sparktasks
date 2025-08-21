/**
 * Competitive Benchmark Scenario
 *
 * Large-scale data scenario for performance testing
 * against ClickUp, Trello, and other competitors
 */

import { createUser } from '../factories/user';
import { createEnterpriseTaskset } from '../factories/task';

export interface CompetitorBenchmarkScenario {
  testUser: ReturnType<typeof createUser>;
  largeTasks: ReturnType<typeof createEnterpriseTaskset>;
  performanceMetrics: {
    expectedLoadTime: number;
    expectedSearchTime: number;
    expectedRenderTime: number;
  };
}

/**
 * Create competitive benchmark scenario
 * For performance testing vs market leaders
 */
export async function competitorBenchmarkScenario(
  seed: number = 42
): Promise<CompetitorBenchmarkScenario> {
  const testUser = createUser(seed, {
    role: 'admin',
    email: 'benchmark@sparktasks.test',
    name: 'Benchmark User',
  });

  const largeTasks = createEnterpriseTaskset(seed);

  // Assign all tasks to test user for maximum data load
  largeTasks.forEach(task => {
    task.assigneeId = testUser.id;
    task.projectId = 'benchmark_project';
  });

  const performanceMetrics = {
    expectedLoadTime: 2000, // 2s - faster than ClickUp's ~4s
    expectedSearchTime: 100, // 100ms - faster than Trello's ~500ms
    expectedRenderTime: 500, // 500ms - for 1000+ tasks
  };

  console.log(
    `✅ Benchmark scenario created: ${largeTasks.length} tasks for performance testing`
  );

  return {
    testUser,
    largeTasks,
    performanceMetrics,
  };
}
