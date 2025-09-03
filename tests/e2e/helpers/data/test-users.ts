export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  token: string;
  permissions: string[];
}

export interface TestTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestProject {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  status: 'active' | 'archived';
  createdAt: string;
}

/**
 * Deterministic test users with fixed IDs and credentials
 * These users are created once and reused across all tests
 */
export const testUsers: Record<string, TestUser> = {
  admin: {
    id: 'user-001-admin',
    email: 'admin+test@sparktasks.local',
    name: 'Test Admin',
    role: 'admin',
    token: 'test-token-admin-001',
    permissions: ['read', 'write', 'delete', 'manage'],
  },
  user: {
    id: 'user-002-regular',
    email: 'user+test@sparktasks.local',
    name: 'Test User',
    role: 'user',
    token: 'test-token-user-002',
    permissions: ['read', 'write'],
  },
  viewer: {
    id: 'user-003-viewer',
    email: 'viewer+test@sparktasks.local',
    name: 'Test Viewer',
    role: 'viewer',
    token: 'test-token-viewer-003',
    permissions: ['read'],
  },
};

/**
 * Deterministic test tasks with predictable data
 */
export const testTasks: TestTask[] = [
  {
    id: 'task-001-todo',
    title: 'Test Todo Task',
    description: 'This is a test task in todo status',
    status: 'todo',
    priority: 'high',
    assigneeId: testUsers.user.id,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'task-002-progress',
    title: 'Test In Progress Task',
    description: 'This is a test task in progress',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: testUsers.user.id,
    createdAt: '2024-01-01T09:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
  },
  {
    id: 'task-003-done',
    title: 'Test Completed Task',
    description: 'This is a test task that is completed',
    status: 'done',
    priority: 'low',
    assigneeId: testUsers.admin.id,
    createdAt: '2024-01-01T07:00:00.000Z',
    updatedAt: '2024-01-01T11:00:00.000Z',
  },
];

/**
 * Deterministic test projects
 */
export const testProjects: TestProject[] = [
  {
    id: 'project-001-main',
    name: 'Test Main Project',
    description: 'Main test project for E2E testing',
    ownerId: testUsers.admin.id,
    members: [testUsers.admin.id, testUsers.user.id],
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'project-002-archived',
    name: 'Test Archived Project',
    description: 'Archived test project',
    ownerId: testUsers.admin.id,
    members: [testUsers.admin.id],
    status: 'archived',
    createdAt: '2023-12-01T00:00:00.000Z',
  },
];

/**
 * Get test data for a specific scenario
 */
export function getTestScenario(scenario: 'empty' | 'basic' | 'full') {
  switch (scenario) {
    case 'empty':
      return {
        users: [testUsers.admin],
        tasks: [],
        projects: [],
      };
    case 'basic':
      return {
        users: [testUsers.admin, testUsers.user],
        tasks: [testTasks[0]], // One todo task
        projects: [testProjects[0]],
      };
    case 'full':
      return {
        users: Object.values(testUsers),
        tasks: testTasks,
        projects: testProjects,
      };
    default:
      return getTestScenario('basic');
  }
}
