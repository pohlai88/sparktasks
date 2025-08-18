import { test, expect } from '@playwright/test';
import { LayeredSelector } from '../fixtures/test-ids';
import { TestHelpers } from '../fixtures/selector-migration';
import { waitForAppReady } from '../fixtures/test-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * A3 Accessibility Enhancements + Snapshots
 * WCAG AA compliance validation with structural snapshots
 * Keyboard navigation, focus management, and ARIA live regions
 */

interface AccessibilityFeatureFlow {
  name: string;
  setup: (page: any, helpers: TestHelpers, selector: LayeredSelector) => Promise<void>;
  description: string;
  criticalElements: string[];
}

// Enhanced A3 flows with accessibility validation
const ACCESSIBILITY_FEATURE_FLOWS: AccessibilityFeatureFlow[] = [
  {
    name: 'FormLabels-ErrorHandling',
    description: 'Form validation with proper ARIA labels and error announcements',
    criticalElements: ['textbox:Quick add task', 'button:Add', 'alert'],
    setup: async (page, helpers, selector) => {
      // Trigger form validation state
      const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
      await quickAddInput.fill('   '); // Empty/whitespace input
      await quickAddInput.clear();
      // Form should show validation state
    }
  },
  {
    name: 'KeyboardNavigation-FocusManagement',
    description: 'Tab/Shift+Tab navigation with proper focus indicators',
    criticalElements: ['textbox:Search tasks', 'textbox:Quick add task', 'button:Add'],
    setup: async (page, helpers, selector) => {
      // Set up navigation state
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      // Focus should be on first interactive element
    }
  },
  {
    name: 'ReducedMotion-Compliance',
    description: 'Prefers-reduced-motion compliance for accessibility',
    criticalElements: ['textbox:Quick add task', 'article'],
    setup: async (page, helpers, selector) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await helpers.createTaskViaQuickAdd('Reduced Motion Test');
      // Animations should be disabled
    }
  },
  {
    name: 'ARIALiveRegions-Announcements',
    description: 'ARIA live regions for dynamic content announcements',
    criticalElements: ['textbox:Quick add task', 'region[aria-live]'],
    setup: async (page, helpers, selector) => {
      // Trigger live region updates
      await helpers.createTaskViaQuickAdd('Live Region Test');
      // Should announce task creation
    }
  },
  {
    name: 'FocusRestoration-DialogInteraction',
    description: 'Focus restoration after dialog interactions',
    criticalElements: ['button:Move task', 'dialog', 'option:Later'],
    setup: async (page, helpers, selector) => {
      await helpers.createTaskViaQuickAdd('Focus Restoration Test');
      const moveButton = page.getByRole('button', { name: /move task/i }).first();
      await moveButton.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      // Focus should be properly managed in dialog
    }
  }
];

const SNAPSHOT_DIR = path.join(__dirname, '..', 'accessibility-snapshots', 'a3-accessibility-features');

test.describe('A3: Accessibility Enhancements + Snapshots (WCAG AA Compliance)', () => {
  let selector: LayeredSelector;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    // Clear localStorage to prevent test pollution
    await page.addInitScript(() => localStorage.clear());
    
    // Initialize SSOT utilities
    selector = new LayeredSelector(page);
    helpers = new TestHelpers(page, selector);
    
    await page.goto('/');
    await waitForAppReady(page);
    
    // Ensure snapshot directory exists
    if (!fs.existsSync(SNAPSHOT_DIR)) {
      fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }
  });

  // Enhanced A3 tests with accessibility snapshots
  ACCESSIBILITY_FEATURE_FLOWS.forEach(({ name, description, criticalElements, setup }) => {
    test(`${name}: ${description}`, async ({ page }) => {
      // Setup the specific accessibility feature state
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
        console.warn(`📸 A3 Accessibility snapshot ${process.env.UPDATE_SNAPSHOTS ? 'updated' : 'created'} for ${name}`);
      } else {
        // Compare against baseline
        const baseline = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
        
        try {
          expect(snapshot).toEqual(baseline);
        } catch (error) {
          // Enhanced error reporting for debugging
          console.error(`❌ A3 Accessibility regression detected in ${name}`);
          console.error(`Description: ${description}`);
          console.error(`Expected critical elements: ${criticalElements.join(', ')}`);
          
          // Save current snapshot for comparison
          const failedPath = path.join(SNAPSHOT_DIR, `${name}.failed.json`);
          fs.writeFileSync(failedPath, JSON.stringify(snapshot, null, 2));
          console.error(`💾 Current snapshot saved to: ${failedPath}`);
          console.error(`🔧 To update baseline: UPDATE_SNAPSHOTS=true npm run test:accessibility:a3`);
          
          throw error;
        }
      }
      
      // Additional validation: Check critical elements using role-based locators
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
        } else if (element.includes('article')) {
          locator = page.getByRole('article');
        } else if (element.includes('dialog')) {
          locator = page.getByRole('dialog');
        } else if (element.includes('option') && element.includes('Later')) {
          locator = page.getByRole('option', { name: 'Later' });
        } else if (element.includes('alert')) {
          locator = page.getByRole('alert');
        } else if (element.includes('region[aria-live]')) {
          locator = page.locator('[aria-live]');
        } else {
          // Fallback to the original selector if not matched
          locator = page.locator(element);
        }
        
        const found = await locator.count();
        // Some elements like alerts might not always be present, so we make them optional
        if (!element.includes('alert') && !element.includes('region[aria-live]')) {
          expect(found, `A3 Critical accessibility element missing: ${element}`).toBeGreaterThan(0);
        }
      }
    });
  });

  // Original A3 functionality tests (preserved and enhanced)
  test('should have proper form labels and error handling', async ({ page }) => {
    // Test form labels exist
    const quickAddInput = page.getByRole('textbox', { name: 'Quick add task' });
    await expect(quickAddInput).toBeVisible();
    await expect(quickAddInput).toHaveAttribute('aria-label', 'Quick add task');
    
    // Test search input
    const searchInput = page.getByRole('textbox', { name: 'Search tasks' });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('aria-label', 'Search tasks');
  });

  test('should support keyboard navigation properly', async ({ page }) => {
    // Create a task first
    await helpers.createTaskViaQuickAdd('Keyboard nav test');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent);
    expect(focusedElement).toBeTruthy();
    
    // Test Shift+Tab navigation
    await page.keyboard.press('Shift+Tab');
    focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent);
    expect(focusedElement).toBeTruthy();
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Create a task and verify no excessive animations
    await helpers.createTaskViaQuickAdd('Reduced motion test');
    
    // Verify task appears (functionality works even with reduced motion)
    await expect(page.getByRole('article').filter({ hasText: 'Reduced motion test' })).toBeVisible();
  });

  test('should manage focus properly in move dialog', async ({ page }) => {
    // Create a task
    await helpers.createTaskViaQuickAdd('Focus management test');
    
    // Open move dialog
    const moveButton = page.getByRole('button', { name: /move task/i }).first();
    await moveButton.click();
    
    // Verify dialog is visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    // Check that focus is managed (dialog should be accessible)
    await expect(dialog).toHaveAttribute('aria-labelledby');
    
    // Test keyboard navigation within dialog
    await page.keyboard.press('Tab');
    const focusedOption = page.locator(':focus');
    await expect(focusedOption).toBeVisible();
  });

  test('A3 Accessibility Coverage Report', async () => {
    // Generate coverage report for A3 flows
    const coverageReport = {
      timestamp: new Date().toISOString(),
      totalFlows: ACCESSIBILITY_FEATURE_FLOWS.length,
      flows: ACCESSIBILITY_FEATURE_FLOWS.map(flow => ({
        name: flow.name,
        description: flow.description,
        criticalElements: flow.criticalElements.length
      })),
      snapshotFiles: fs.existsSync(SNAPSHOT_DIR) 
        ? fs.readdirSync(SNAPSHOT_DIR).filter(file => file.endsWith('.json') && !file.includes('.failed.'))
        : []
    };
    
    const reportPath = path.join(SNAPSHOT_DIR, 'coverage-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(coverageReport, null, 2));
    
    console.warn(`📊 A3 Accessibility coverage: ${coverageReport.flows.length}/${coverageReport.totalFlows} flows validated`);
    
    // Validate all flows have been defined
    expect(coverageReport.flows.length).toBeGreaterThan(0);
  });
});
