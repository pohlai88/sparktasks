/**
 * Deterministic Task Factory
 *
 * Creates reproducible test tasks using fixed PRNG
 * for consistent E2E testing scenarios
 */

export interface TestTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  projectId?: string;
  dueDate?: Date;
  estimatedHours?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simple seeded random number generator
 */
function createSeededRandom(seed: number) {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
    return state / Math.pow(2, 32);
  };
}

/**
 * Create deterministic task with fixed seed
 */
export function createTask(
  seed: number,
  overrides: Partial<TestTask> = {}
): TestTask {
  const random = createSeededRandom(seed);

  const taskTitles = [
    'Implement authentication system',
    'Design user dashboard',
    'Optimize database queries',
    'Write unit tests',
    'Update documentation',
    'Fix responsive layout',
    'Add search functionality',
    'Integrate payment system',
    'Improve accessibility',
    'Deploy to production',
  ];

  const descriptions = [
    'This task requires careful attention to security best practices.',
    'Focus on user experience and intuitive design patterns.',
    'Performance optimization is critical for user satisfaction.',
    'Comprehensive test coverage ensures reliability.',
    'Clear documentation helps team collaboration.',
  ];

  const tags = [
    'frontend',
    'backend',
    'design',
    'testing',
    'documentation',
    'security',
    'performance',
  ];
  const statuses: TestTask['status'][] = [
    'todo',
    'in_progress',
    'review',
    'done',
  ];
  const priorities: TestTask['priority'][] = [
    'low',
    'medium',
    'high',
    'urgent',
  ];

  const baseId = Math.floor(random() * 10000);
  const createdAt = new Date(Date.now() - random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days

  return {
    id: overrides.id || `task_${baseId}`,
    title:
      overrides.title || taskTitles[Math.floor(random() * taskTitles.length)],
    description:
      overrides.description ||
      descriptions[Math.floor(random() * descriptions.length)],
    status:
      overrides.status || statuses[Math.floor(random() * statuses.length)],
    priority:
      overrides.priority ||
      priorities[Math.floor(random() * priorities.length)],
    assigneeId: overrides.assigneeId,
    projectId: overrides.projectId,
    dueDate:
      overrides.dueDate ||
      new Date(Date.now() + random() * 365 * 24 * 60 * 60 * 1000), // Next year
    estimatedHours: overrides.estimatedHours || Math.floor(random() * 40) + 1,
    tags: overrides.tags || tags.slice(0, Math.floor(random() * 3) + 1),
    createdAt: overrides.createdAt || createdAt,
    updatedAt:
      overrides.updatedAt ||
      new Date(createdAt.getTime() + random() * 24 * 60 * 60 * 1000),
    ...overrides,
  };
}

/**
 * Create batch of tasks for performance testing
 */
export function createTaskBatch(
  count: number,
  baseSeed: number = 42
): TestTask[] {
  return Array.from({ length: count }, (_, index) =>
    createTask(baseSeed + index)
  );
}

/**
 * Create tasks with specific distribution for testing
 */
export function createTaskDistribution(baseSeed: number = 42) {
  const tasks: TestTask[] = [];

  // High priority urgent tasks (10%)
  for (let i = 0; i < 5; i++) {
    tasks.push(
      createTask(baseSeed + i, {
        priority: 'urgent',
        status: 'todo',
      })
    );
  }

  // In progress tasks (30%)
  for (let i = 5; i < 20; i++) {
    tasks.push(
      createTask(baseSeed + i, {
        status: 'in_progress',
        priority: i % 2 === 0 ? 'medium' : 'high',
      })
    );
  }

  // Review tasks (20%)
  for (let i = 20; i < 30; i++) {
    tasks.push(
      createTask(baseSeed + i, {
        status: 'review',
      })
    );
  }

  // Completed tasks (40%)
  for (let i = 30; i < 50; i++) {
    tasks.push(
      createTask(baseSeed + i, {
        status: 'done',
      })
    );
  }

  return tasks;
}

/**
 * Create enterprise-scale task dataset
 * For competitive benchmark testing vs ClickUp/Trello
 */
export function createEnterpriseTaskset(baseSeed: number = 42): TestTask[] {
  return createTaskBatch(1000, baseSeed);
}
