// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { test, expect } from '@playwright/test';
import { LayeredSelector } from '../fixtures/test-ids';
import { TestHelpers } from '../fixtures/selector-migration';
import { waitForAppReady } from '../fixtures/test-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SSOT Accessibility Snapshot Testing
 * Validates ARIA structure, semantic hierarchy, and screen reader compliance
 * Integrated with existing SSOT infrastructure for maximum standardization
 */

interface AccessibilityFlow {
  name: string;
  setup: (page: any, helpers: TestHelpers, selector: LayeredSelector) => Promise<void>;
  description: string;
  criticalElements: string[]; // Key ARIA elements that must be present
}

// SSOT Flow Definitions - uses our existing patterns with role-based selectors
const ACCESSIBILITY_FLOWS: AccessibilityFlow[] = [
  {
    name: 'QuickAdd-EmptyState',
    description: 'QuickAdd form in empty state with proper ARIA labels',
    criticalElements: ['textbox:Quick add task', 'button:Add'],
    setup: async (page, helpers, selector) => {
      await page.addInitScript(() => localStorage.clear());
      await page.goto('/');
      await waitForAppReady(page);
      // Empty state - should show QuickAdd form
    }
  },
  {
    name: 'QuickAdd-WithTasks',
    description: 'QuickAdd form with existing tasks and search functionality',
    criticalElements: ['textbox:Search tasks', 'textbox:Quick add task'],
    setup: async (page, helpers, selector) => {
      await page.addInitScript(() => localStorage.clear());
      await page.goto('/');
      await waitForAppReady(page);
      
      // Create a few tasks to test populated state
      await helpers.createTaskViaQuickAdd('Sample Task 1');
      await helpers.createTaskViaQuickAdd('Sample Task 2');
    }
  },
  {
    name: 'TaskCard-Interactions',
    description: 'Task card with all interaction buttons and ARIA states',
    criticalElements: ['article', 'button:Move task', 'button:Complete'],
    setup: async (page, helpers, selector) => {
      await page.addInitScript(() => localStorage.clear());
      await page.goto('/');
      await waitForAppReady(page);
      
      // Create task and ensure it's visible
      await helpers.createTaskViaQuickAdd('Accessibility Test Task');
      await expect(page.getByRole('article').filter({ hasText: 'Accessibility Test Task' })).toBeVisible();
    }
  },
  {
    name: 'MoveMenu-Dialog',
    description: 'Move task dialog with keyboard navigation and ARIA compliance',
    criticalElements: ['dialog', 'option:Later', 'option:Done'],
    setup: async (page, helpers, selector) => {
      await page.addInitScript(() => localStorage.clear());
      await page.goto('/');
      await waitForAppReady(page);
      
      // Create task and open move menu
      await helpers.createTaskViaQuickAdd('Move Menu Test Task');
      const moveButton = page.getByRole('button', { name: /move task/i }).first();
      await moveButton.click();
      
      // Wait for move dialog to open
      await expect(page.getByRole('dialog', { name: /move task/i })).toBeVisible();
    }
  },
  {
    name: 'Search-Results',
    description: 'Search functionality with live results and ARIA live regions',
    criticalElements: ['textbox:Search tasks', 'listbox'],
    setup: async (page, helpers, selector) => {
      await page.addInitScript(() => localStorage.clear());
      await page.goto('/');
      await waitForAppReady(page);
      
      // Create tasks for searching
      await helpers.createTaskViaQuickAdd('Searchable Task Alpha');
      await helpers.createTaskViaQuickAdd('Searchable Task Beta');
      
      // Trigger search
      const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
      await searchInput.fill('Searchable');
      await page.waitForTimeout(300); // Wait for debounce
    }
  },
  {
    name: 'KeyboardNavigation-Focus',
    description: 'Keyboard navigation focus states and Tab order',
    criticalElements: ['[tabindex]', '*:focus', 'button', 'input'],
    setup: async (page, helpers, selector) => {
      await page.addInitScript(() => localStorage.clear());
      await page.goto('/');
      await waitForAppReady(page);
      
      // Create tasks and set focus for keyboard testing
      await helpers.createTaskViaQuickAdd('Focus Test Task 1');
      await helpers.createTaskViaQuickAdd('Focus Test Task 2');
      
      // Set initial focus state
      const firstTask = page.getByRole('article').first();
      await firstTask.focus();
    }
  }
];

const SNAPSHOT_DIR = path.resolve(__dirname, '../accessibility-snapshots');

test.describe('SSOT Accessibility Snapshots', () => {
  let selector: LayeredSelector;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    // Initialize SSOT utilities
    selector = new LayeredSelector(page);
    helpers = new TestHelpers(page, selector);
    
    // Ensure snapshot directory exists
    if (!fs.existsSync(SNAPSHOT_DIR)) {
      fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }
  });

  ACCESSIBILITY_FLOWS.forEach(({ name, description, criticalElements, setup }) => {
    test(`${name}: ${description}`, async ({ page }) => {
      // Setup the specific flow state
      await setup(page, helpers, selector);
      
      // Wait for any animations/transitions to complete
      await page.waitForTimeout(500);
      
      // Capture accessibility snapshot
      const snapshot = await page.accessibility.snapshot();
      const snapshotPath = path.join(SNAPSHOT_DIR, `${name}.json`);
      
      // Validation strategy
      if (process.env.UPDATE_SNAPSHOTS === 'true' || !fs.existsSync(snapshotPath)) {
        // Create or update baseline
        fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
        console.warn(`📸 Accessibility snapshot ${process.env.UPDATE_SNAPSHOTS ? 'updated' : 'created'} for ${name}`);
      } else {
        // Compare against baseline
        const baseline = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
        
        try {
          expect(snapshot).toEqual(baseline);
        } catch (error) {
          // Enhanced error reporting for debugging
          console.error(`❌ Accessibility regression detected in ${name}`);
          console.error(`Description: ${description}`);
          console.error(`Expected critical elements: ${criticalElements.join(', ')}`);
          
          // Save current snapshot for comparison
          const failedPath = path.join(SNAPSHOT_DIR, `${name}.failed.json`);
          fs.writeFileSync(failedPath, JSON.stringify(snapshot, null, 2));
          console.error(`💾 Current snapshot saved to: ${failedPath}`);
          console.error(`🔧 To update baseline: UPDATE_SNAPSHOTS=true npm test`);
          
          throw error;
        }
      }
      
      // Additional validation: Check critical elements are present using role-based locators
      for (const element of criticalElements) {
        let locator;
        
        // Parse element description to create appropriate locator
        if (element.includes('textbox') && element.includes('Quick add task')) {
          locator = page.getByRole('textbox', { name: 'Quick add task' });
        } else if (element.includes('textbox') && element.includes('Search tasks')) {
          locator = page.getByRole('textbox', { name: 'Search tasks' });
        } else if (element.includes('button') && element.includes('Add')) {
          locator = page.getByRole('button', { name: 'Add' });
        } else if (element.includes('button') && element.includes('Move task')) {
          locator = page.getByRole('button', { name: /move task/i });
        } else if (element.includes('button') && element.includes('Complete')) {
          locator = page.getByRole('button', { name: /complete/i });
        } else if (element.includes('article')) {
          locator = page.getByRole('article');
        } else if (element.includes('dialog')) {
          locator = page.getByRole('dialog');
        } else if (element.includes('option') && element.includes('Later')) {
          locator = page.getByRole('option', { name: 'Later' });
        } else if (element.includes('option') && element.includes('Done')) {
          locator = page.getByRole('option', { name: 'Done' });
        } else if (element.includes('listbox')) {
          locator = page.getByRole('listbox');
        } else {
          // Fallback to the original selector if not matched
          locator = page.locator(element);
        }
        
        const found = await locator.count();
        expect(found, `Critical ARIA element missing: ${element}`).toBeGreaterThan(0);
      }
    });
  });

  test('Accessibility Snapshot Coverage Report', async ({ page }) => {
    // Generate coverage report
    const coverageReport = {
      timestamp: new Date().toISOString(),
      totalFlows: ACCESSIBILITY_FLOWS.length,
      flows: ACCESSIBILITY_FLOWS.map(flow => ({
        name: flow.name,
        description: flow.description,
        criticalElements: flow.criticalElements.length
      })),
      snapshotFiles: fs.existsSync(SNAPSHOT_DIR) 
        ? fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.json') && !f.includes('.failed'))
        : []
    };
    
    const reportPath = path.join(SNAPSHOT_DIR, 'coverage-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(coverageReport, null, 2));
    
    console.log(`📊 Accessibility coverage: ${coverageReport.snapshotFiles.length}/${coverageReport.totalFlows} flows validated`);
  });
});

/**
 * Accessibility Regression Suite - Fast validation without full snapshots
 * Runs critical ARIA checks for every test run
 */
test.describe('SSOT Accessibility Regression Guards', () => {
  let selector: LayeredSelector;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    selector = new LayeredSelector(page);
    helpers = new TestHelpers(page, selector);
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('Core ARIA Structure Integrity', async ({ page }) => {
    // Create basic app state
    await helpers.createTaskViaQuickAdd('ARIA Test Task');
    
    // Validate core ARIA landmarks always present
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Quick add task' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search tasks' })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(1);
    
    // Validate keyboard accessibility
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('Dynamic ARIA Updates Validation', async ({ page }) => {
    // Test ARIA states change correctly with interactions
    await helpers.createTaskViaQuickAdd('Dynamic ARIA Test');
    
    // Open move menu and validate ARIA states
    const moveButton = page.getByRole('button', { name: /move task/i }).first();
    await moveButton.click();
    
    const dialog = page.getByRole('dialog', { name: /move task/i });
    await expect(dialog).toBeVisible();
    // Check for actual ARIA attributes present in the dialog
    await expect(dialog).toHaveAttribute('aria-labelledby', 'move-menu-title');
    await expect(dialog).toHaveAttribute('aria-describedby', 'move-menu-description');
    
    // Test search ARIA states
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await searchInput.fill('Dynamic');
    
    // Should have proper ARIA attributes for search functionality
    await expect(searchInput).toHaveAttribute('aria-label', 'Search tasks');
  });
});
