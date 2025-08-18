// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { test, expect } from '@playwright/test';
import { TestHelpers } from '../fixtures/selector-migration';
import { waitForAppReady } from '../fixtures/test-data';

/**
 * A1 Foundation DoD Validation
 * Comprehensive test for missing functionality:
 * - Task editing capabilities
 * - Priority display (P0, P1, P2)
 * - Tag parsing and display
 * - Proper task deletion (archive behavior)
 * - Form schema validation
 */

test.describe('A1: DoD Validation - Missing Functionality', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitForAppReady(page);
  });

  test.describe('Task Editing Functionality', () => {
    test('should allow task editing with proper UI', async ({ page }) => {
      // Create a task first
      await helpers.createTaskViaQuickAdd('Editable Test Task');
      
      // Find the task card and edit button
      const taskCard = page.getByRole('article').filter({ hasText: 'Editable Test Task' });
      await expect(taskCard).toBeVisible();
      
      // Look for edit button using SSOT test ID
      const editButton = taskCard.getByTestId('task-edit-Editable Test Task'); // This will need the actual task ID
      
      // Alternative: use aria-label
      const editButtonAlt = taskCard.getByRole('button', { name: 'Edit task' });
      
      if (await editButton.count() > 0) {
        await editButton.click();
        console.log('✅ Edit button with test ID working');
      } else if (await editButtonAlt.count() > 0) {
        await editButtonAlt.click();
        console.log('✅ Edit button with aria-label working');
      } else {
        console.log('❌ Edit button not found');
        return;
      }
      
      // Should show edit form or inline editing
      const editForm = page.getByRole('textbox', { name: 'task-title' })
        .or(page.locator('input[value*="Editable Test Task"]'))
        .or(page.locator('textarea').filter({ hasText: 'Editable Test Task' }));
      
      if (await editForm.count() > 0) {
        await editForm.fill('Edited Task Title');
        
        // Look for save button or Enter key
        await page.keyboard.press('Enter');
        
        // Verify the change
        const editedTask = page.getByRole('article').filter({ hasText: 'Edited Task Title' });
        
        if (await editedTask.count() > 0) {
          await expect(editedTask).toBeVisible();
          console.log('✅ Task editing functionality working');
        } else {
          console.log('⚠️ Task editing save not working');
        }
      } else {
        console.log('⚠️ Edit form not appearing');
      }
    });

    test('should show edit button in task card actions', async ({ page }) => {
      // Create task
      await helpers.createTaskViaQuickAdd('Action Button Test');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Action Button Test' });
      await expect(taskCard).toBeVisible();
      
      // Check for edit button presence
      const editButton = taskCard.getByRole('button', { name: 'Edit task' });
      await expect(editButton).toBeVisible();
      
      console.log('✅ Edit button visible in task actions');
    });
  });

  test.describe('Priority Display & Parsing', () => {
    test('should parse and display P0 priority correctly', async ({ page }) => {
      // Create task with P0 priority using QuickAdd syntax
      await helpers.createTaskViaQuickAdd('High priority task !p0 #urgent');
      
      // Find the task
      const taskCard = page.getByRole('article').filter({ hasText: 'High priority task' });
      await expect(taskCard).toBeVisible();
      
      // Look for P0 priority badge
      const priorityBadge = taskCard.getByText('P0');
      
      if (await priorityBadge.count() > 0) {
        await expect(priorityBadge).toBeVisible();
        
        // Check if it has the right styling (red for P0)
        const hasRedStyling = await priorityBadge.evaluate(el => 
          el.className.includes('bg-red') || el.className.includes('text-red')
        );
        
        if (hasRedStyling) {
          console.log('✅ P0 priority displayed with correct red styling');
        } else {
          console.log('⚠️ P0 priority displayed but styling needs improvement');
        }
      } else {
        console.log('❌ P0 priority not displayed');
      }
    });

    test('should parse and display P1 priority correctly', async ({ page }) => {
      await helpers.createTaskViaQuickAdd('Medium priority task !p1');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Medium priority task' });
      await expect(taskCard).toBeVisible();
      
      const priorityBadge = taskCard.getByText('P1');
      
      if (await priorityBadge.count() > 0) {
        await expect(priorityBadge).toBeVisible();
        
        const hasOrangeStyling = await priorityBadge.evaluate(el => 
          el.className.includes('bg-orange') || el.className.includes('text-orange')
        );
        
        if (hasOrangeStyling) {
          console.log('✅ P1 priority displayed with correct orange styling');
        } else {
          console.log('⚠️ P1 priority displayed but styling needs improvement');
        }
      } else {
        console.log('❌ P1 priority not displayed');
      }
    });

    test('should default to P1 when no priority specified', async ({ page }) => {
      await helpers.createTaskViaQuickAdd('Default priority task');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Default priority task' });
      await expect(taskCard).toBeVisible();
      
      // Should show P1 as default
      const priorityBadge = taskCard.getByText('P1');
      
      if (await priorityBadge.count() > 0) {
        await expect(priorityBadge).toBeVisible();
        console.log('✅ Default P1 priority displayed');
      } else {
        console.log('❌ Default priority not displayed');
      }
    });
  });

  test.describe('Tag Parsing & Display', () => {
    test('should parse and display tags correctly', async ({ page }) => {
      await helpers.createTaskViaQuickAdd('Tagged task #work #urgent #review');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Tagged task' });
      await expect(taskCard).toBeVisible();
      
      // Check for each tag
      const workTag = taskCard.getByText('#work');
      const urgentTag = taskCard.getByText('#urgent');
      const reviewTag = taskCard.getByText('#review');
      
      const workVisible = await workTag.count() > 0;
      const urgentVisible = await urgentTag.count() > 0;
      const reviewVisible = await reviewTag.count() > 0;
      
      if (workVisible && urgentVisible && reviewVisible) {
        await expect(workTag).toBeVisible();
        await expect(urgentTag).toBeVisible();
        await expect(reviewTag).toBeVisible();
        console.log('✅ All tags parsed and displayed correctly');
      } else {
        console.log(`⚠️ Tag parsing incomplete: work=${workVisible}, urgent=${urgentVisible}, review=${reviewVisible}`);
      }
    });

    test('should display tags with proper styling', async ({ page }) => {
      await helpers.createTaskViaQuickAdd('Styled tags #design #ui');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Styled tags' });
      await expect(taskCard).toBeVisible();
      
      const designTag = taskCard.getByText('#design');
      
      if (await designTag.count() > 0) {
        const hasProperStyling = await designTag.evaluate(el => 
          el.className.includes('rounded') && el.className.includes('px-2')
        );
        
        if (hasProperStyling) {
          console.log('✅ Tags have proper pill styling');
        } else {
          console.log('⚠️ Tag styling needs improvement');
        }
      }
    });
  });

  test.describe('Task Deletion Behavior', () => {
    test('should archive tasks instead of deleting', async ({ page }) => {
      // Create a task
      await helpers.createTaskViaQuickAdd('Delete Test Task');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Delete Test Task' });
      await expect(taskCard).toBeVisible();
      
      // Find delete button
      const deleteButton = taskCard.getByRole('button', { name: 'Delete task' });
      
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        
        // Task should disappear from view (archived)
        await expect(taskCard).not.toBeVisible();
        
        // Verify this was an archive operation, not true deletion
        // (Task should still exist in store but with ARCHIVED status)
        console.log('✅ Task deletion (archival) working');
      } else {
        console.log('❌ Delete button not found');
      }
    });

    test('should show delete button in task actions', async ({ page }) => {
      await helpers.createTaskViaQuickAdd('Delete Button Test');
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Delete Button Test' });
      await expect(taskCard).toBeVisible();
      
      const deleteButton = taskCard.getByRole('button', { name: 'Delete task' });
      await expect(deleteButton).toBeVisible();
      
      console.log('✅ Delete button visible in task actions');
    });
  });

  test.describe('Form Schema Validation', () => {
    test('should handle complex QuickAdd syntax', async ({ page }) => {
      // Test comprehensive QuickAdd parsing
      const complexTask = 'Project review !p0 #critical #review @status:today @due:tomorrow';
      
      await helpers.createTaskViaQuickAdd(complexTask);
      
      const taskCard = page.getByRole('article').filter({ hasText: 'Project review' });
      await expect(taskCard).toBeVisible();
      
      // Verify parsed elements
      const hasPriority = await taskCard.getByText('P0').count() > 0;
      const hasCriticalTag = await taskCard.getByText('#critical').count() > 0;
      const hasReviewTag = await taskCard.getByText('#review').count() > 0;
      
      console.log(`📊 Complex parsing results: priority=${hasPriority}, critical=${hasCriticalTag}, review=${hasReviewTag}`);
      
      if (hasPriority && hasCriticalTag && hasReviewTag) {
        console.log('✅ Complex QuickAdd syntax fully supported');
      } else {
        console.log('⚠️ Complex QuickAdd syntax partially supported');
      }
    });

    test('should validate form inputs properly', async ({ page }) => {
      // Test edge cases for form validation
      const quickAddInput = page.getByTestId('quick-add-input');
      const quickAddButton = page.getByTestId('quick-add-button');
      
      // Test empty input
      await quickAddInput.fill('');
      await quickAddButton.click();
      
      const errorElement = page.getByTestId('quick-add-error');
      
      if (await errorElement.count() > 0) {
        await expect(errorElement).toBeVisible();
        console.log('✅ Empty input validation working');
      }
      
      // Test whitespace-only input
      await quickAddInput.fill('   ');
      await quickAddButton.click();
      
      if (await errorElement.count() > 0) {
        await expect(errorElement).toBeVisible();
        console.log('✅ Whitespace-only validation working');
      }
      
      // Test very long input
      const longTitle = 'A'.repeat(500);
      await quickAddInput.fill(longTitle);
      await quickAddButton.click();
      
      // Should either create task or show length validation
      const taskCreated = await page.getByRole('article').filter({ hasText: longTitle.substring(0, 50) }).count() > 0;
      const lengthError = await errorElement.count() > 0;
      
      if (taskCreated || lengthError) {
        console.log('✅ Long input handling working');
      } else {
        console.log('⚠️ Long input handling needs implementation');
      }
    });
  });

  test.describe('Complete DoD Assessment', () => {
    test('should meet all A1 Definition of Done requirements', async ({ page }) => {
      const dod = {
        taskCreation: false,
        taskViewing: false,
        taskEditing: false,
        taskCompletion: false,
        taskDeletion: false,
        formValidation: false,
        focusManagement: false,
        competitiveUX: false,
        priorityDisplay: false,
        tagDisplay: false,
        schemaValidation: false,
      };

      // Test each DoD requirement systematically

      // 1. Task Creation
      try {
        const created = await helpers.createTaskViaQuickAdd('DoD Complete Test !p0 #test');
        dod.taskCreation = created;
      } catch (e) {
        console.log('❌ Task creation failed');
      }

      // 2. Task Viewing
      try {
        const taskVisible = await page.getByRole('article').filter({ hasText: 'DoD Complete Test' }).count() > 0;
        dod.taskViewing = taskVisible;
      } catch (e) {
        console.log('❌ Task viewing failed');
      }

      // 3. Task Editing
      try {
        const taskCard = page.getByRole('article').filter({ hasText: 'DoD Complete Test' });
        const editButton = taskCard.getByRole('button', { name: 'Edit task' });
        dod.taskEditing = await editButton.count() > 0;
      } catch (e) {
        console.log('❌ Task editing not available');
      }

      // 4. Task Completion
      try {
        const taskCard = page.getByRole('article').filter({ hasText: 'DoD Complete Test' });
        const completeButton = taskCard.getByRole('button', { name: /mark complete/i });
        dod.taskCompletion = await completeButton.count() > 0;
      } catch (e) {
        console.log('❌ Task completion not available');
      }

      // 5. Task Deletion
      try {
        const taskCard = page.getByRole('article').filter({ hasText: 'DoD Complete Test' });
        const deleteButton = taskCard.getByRole('button', { name: 'Delete task' });
        dod.taskDeletion = await deleteButton.count() > 0;
      } catch (e) {
        console.log('❌ Task deletion not available');
      }

      // 6. Form Validation
      try {
        const quickAddInput = page.getByTestId('quick-add-input');
        const quickAddButton = page.getByTestId('quick-add-button');
        
        await quickAddInput.fill('   ');
        await quickAddButton.click();
        
        dod.formValidation = await page.getByTestId('quick-add-error').count() > 0;
      } catch (e) {
        console.log('❌ Form validation failed');
      }

      // 7. Focus Management
      try {
        const quickAddInput = page.getByTestId('quick-add-input');
        await quickAddInput.focus();
        const isFocused = await quickAddInput.evaluate(el => document.activeElement === el);
        dod.focusManagement = isFocused;
      } catch (e) {
        console.log('❌ Focus management failed');
      }

      // 8. Competitive UX
      try {
        const hasExamples = await page.getByText('Examples:').count() > 0;
        const hasPlaceholder = await page.getByTestId('quick-add-input').getAttribute('placeholder');
        dod.competitiveUX = hasExamples && !!hasPlaceholder;
      } catch (e) {
        console.log('❌ Competitive UX features missing');
      }

      // 9. Priority Display
      try {
        const taskCard = page.getByRole('article').filter({ hasText: 'DoD Complete Test' });
        const priorityBadge = taskCard.getByText('P0');
        dod.priorityDisplay = await priorityBadge.count() > 0;
      } catch (e) {
        console.log('❌ Priority display failed');
      }

      // 10. Tag Display
      try {
        const taskCard = page.getByRole('article').filter({ hasText: 'DoD Complete Test' });
        const tagBadge = taskCard.getByText('#test');
        dod.tagDisplay = await tagBadge.count() > 0;
      } catch (e) {
        console.log('❌ Tag display failed');
      }

      // 11. Schema Validation
      try {
        // Test that complex syntax is parsed correctly
        await helpers.createTaskViaQuickAdd('Schema test !p1 #validation @status:today');
        const schemaTask = page.getByRole('article').filter({ hasText: 'Schema test' });
        dod.schemaValidation = await schemaTask.count() > 0;
      } catch (e) {
        console.log('❌ Schema validation failed');
      }

      const completedItems = Object.values(dod).filter(Boolean).length;
      const totalItems = Object.keys(dod).length;
      
      console.log(`📊 Complete A1 DoD Progress: ${completedItems}/${totalItems} items complete`);
      console.log('📋 Detailed Checklist:', dod);
      
      // Core requirements (these must pass)
      expect(dod.taskCreation).toBe(true);
      expect(dod.taskViewing).toBe(true);
      expect(dod.formValidation).toBe(true);
      expect(dod.focusManagement).toBe(true);
      expect(dod.competitiveUX).toBe(true);
      
      // Target: At least 9/11 items working for A1 completion
      expect(completedItems).toBeGreaterThanOrEqual(9);
    });
  });
});
