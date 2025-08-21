/**
 * Deterministic User Factory
 *
 * Creates reproducible test users using fixed PRNG
 * for consistent E2E testing scenarios
 */

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  organizationId?: string;
  avatar?: string;
  createdAt: Date;
  lastActiveAt: Date;
}

/**
 * Create deterministic user with fixed seed
 */
export function createUser(
  seed: number,
  overrides: Partial<TestUser> = {}
): TestUser {
  // Simple deterministic generator without external dependencies
  const random = createSeededRandom(seed);

  const names = [
    'John Doe',
    'Jane Smith',
    'Alex Johnson',
    'Sarah Wilson',
    'Mike Brown',
  ];
  const domains = ['sparktasks.test', 'company.test', 'team.test'];

  const name = overrides.name || names[random() % names.length];
  const email =
    overrides.email ||
    `${name.toLowerCase().replace(' ', '.')}@${domains[random() % domains.length]}`;
  const id = overrides.id || `user_${random().toString(36).substring(7)}`;

  return {
    id,
    email,
    name,
    role: overrides.role || 'member',
    organizationId:
      overrides.organizationId || `org_${random().toString(36).substring(7)}`,
    avatar: overrides.avatar,
    createdAt:
      overrides.createdAt ||
      new Date(Date.now() - random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
    lastActiveAt:
      overrides.lastActiveAt ||
      new Date(Date.now() - random() * 24 * 60 * 60 * 1000), // Last 24 hours
  };
}

/**
 * Create team of users with specific roles
 */
export function createTeam(baseSeed: number = 42) {
  return {
    admin: createUser(baseSeed, {
      role: 'admin',
      email: 'admin@sparktasks.test',
      name: 'Admin User',
    }),
    managers: [
      createUser(baseSeed + 1, {
        role: 'manager',
        email: 'manager1@sparktasks.test',
        name: 'Manager One',
      }),
      createUser(baseSeed + 2, {
        role: 'manager',
        email: 'manager2@sparktasks.test',
        name: 'Manager Two',
      }),
    ],
    members: Array.from({ length: 10 }, (_, i) =>
      createUser(baseSeed + 10 + i, {
        role: 'member',
        email: `member${i + 1}@sparktasks.test`,
        name: `Team Member ${i + 1}`,
      })
    ),
  };
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
