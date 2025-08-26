import { chromium, FullConfig } from '@playwright/test';
import { SeedManager } from './data/seed-manager';
import { generateStorageState } from './utils/auth-utils';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright Global Setup...');

  // Initialize deterministic seed data
  const seedManager = new SeedManager();

  try {
    // Step 1: Prepare deterministic test data
    console.log('📊 Setting up deterministic test data...');
    await seedManager.createGoldenSnapshot();

    // Step 2: Create per-worker database namespaces
    const workerCount = config.workers || 1;
    console.log(`🏗️  Creating ${workerCount} worker database namespaces...`);
    await seedManager.prepareWorkerNamespaces(workerCount);

    // Step 3: Generate authentication storage state
    console.log('🔐 Generating authentication storage state...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      timezoneId: 'UTC',
      locale: 'en-US',
    });

    // Get base URL from config
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';

    // Generate storage state with deterministic auth
    await generateStorageState(context, baseURL);

    await context.close();
    await browser.close();

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;
