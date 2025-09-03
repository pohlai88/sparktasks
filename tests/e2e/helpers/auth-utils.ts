import { BrowserContext } from '@playwright/test';
import { testUsers, TestUser } from '../data/test-users';

/**
 * Generates authentication storage state for tests
 * This simulates a logged-in user session without going through the UI login flow
 */
export async function generateStorageState(
  context: BrowserContext,
  baseURL: string = 'http://localhost:9000'
): Promise<void> {
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto(baseURL);

    // Set up deterministic user session
    const defaultUser = testUsers.admin;

    // Simulate authentication by setting localStorage/sessionStorage
    await page.evaluate((userJson: string) => {
      const user = JSON.parse(userJson);
      
      // Set authentication data in the format expected by AuthProvider
      localStorage.setItem('auth_token', user.token);
      localStorage.setItem('auth_user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: '2024-01-01T00:00:00.000Z',
        workspaceId: 'workspace-001',
        preferences: {
          theme: 'light',
          notifications: true,
          timezone: 'UTC',
        },
        mfaEnabled: false,
        lastLogin: '2024-01-01T00:00:00.000Z',
      }));

      // Set any application preferences
      localStorage.setItem(
        'app_preferences',
        JSON.stringify({
          theme: 'light',
          language: 'en-US',
          timezone: 'UTC',
        })
      );

      // Set test mode flag
      sessionStorage.setItem('test_mode', 'true');
      sessionStorage.setItem('fake_now', '2024-01-01T00:00:00.000Z');
    }, JSON.stringify(defaultUser));

    // Save the storage state
    await context.storageState({ path: './e2e/data/storage-state.json' });

    console.log('✅ Authentication storage state generated');
  } catch (error) {
    console.error('❌ Failed to generate storage state:', error);
    throw error;
  } finally {
    await page.close();
  }
}

/**
 * Creates a test-specific authentication context
 */
export async function createAuthContext(
  context: BrowserContext,
  user: TestUser
): Promise<void> {
  const page = await context.newPage();

  await page.evaluate((userJson: string) => {
    const testUser = JSON.parse(userJson);
    localStorage.setItem('auth_token', testUser.token);
    localStorage.setItem('user_id', testUser.id);
    localStorage.setItem('user_role', testUser.role);
    localStorage.setItem('user_email', testUser.email);
  }, JSON.stringify(user));

  await page.close();
}
