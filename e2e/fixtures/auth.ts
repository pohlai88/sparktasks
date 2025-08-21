/**
 * Enterprise Authentication Fixtures
 *
 * Provides lightning-fast authentication via server-minted sessions
 * No UI login required - direct token/cookie injection
 */

import { BrowserContext } from '@playwright/test';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  organizationId?: string;
}

/**
 * Mint authentication session for test user
 * Bypasses UI login for speed and reliability
 */
export async function mintSession(
  context: BrowserContext,
  user: TestUser
): Promise<void> {
  try {
    // For now, implement as localStorage-based auth
    // In production: integrate with your auth system (JWT/session cookies)

    await context.addInitScript(userData => {
      // Set authentication state in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', `test_token_${userData.id}`);
      localStorage.setItem('auth_expires', String(Date.now() + 3600000)); // 1 hour

      // Set session cookie equivalent
      document.cookie = `session=test_session_${userData.id}; path=/; max-age=3600`;
    }, user);

    console.log(`✅ Auth session minted for ${user.email} (${user.role})`);
  } catch (error) {
    console.error('❌ Failed to mint auth session:', error);
    throw error;
  }
}

/**
 * Create test user with specified role
 */
export function createTestUser(
  role: TestUser['role'],
  overrides: Partial<TestUser> = {}
): TestUser {
  const baseId = Math.random().toString(36).substring(7);

  return {
    id: `test_user_${baseId}`,
    email: overrides.email || `${role}@sparktasks.test`,
    name:
      overrides.name || `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    role,
    organizationId: overrides.organizationId || `test_org_${baseId}`,
    ...overrides,
  };
}

/**
 * Authentication helpers for different user types
 */
export const authHelpers = {
  /**
   * Create and authenticate admin user
   */
  async admin(context: BrowserContext, overrides?: Partial<TestUser>) {
    const admin = createTestUser('admin', overrides);
    await mintSession(context, admin);
    return admin;
  },

  /**
   * Create and authenticate manager user
   */
  async manager(context: BrowserContext, overrides?: Partial<TestUser>) {
    const manager = createTestUser('manager', overrides);
    await mintSession(context, manager);
    return manager;
  },

  /**
   * Create and authenticate member user
   */
  async member(context: BrowserContext, overrides?: Partial<TestUser>) {
    const member = createTestUser('member', overrides);
    await mintSession(context, member);
    return member;
  },
} as const;

/**
 * Clear authentication state
 */
export async function clearAuth(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires');

    // Clear session cookie
    document.cookie = 'session=; path=/; max-age=0';
  });
}
