import { expect as baseExpect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/**
 * Phase 2: Advanced Accessibility Matchers
 * Custom Playwright matchers for semantic accessibility assertions
 * Extends the accessibility snapshot system with domain-specific validations
 */

// Extend the base expect interface
interface CustomMatchers<R = unknown> {
  toHaveAccessibleName(name: string | RegExp): R;
  toBeKeyboardNavigable(): R;
  toHaveProperARIAHierarchy(): R;
  toMeetWCAGColorContrast(): R;
  toHaveSemanticStructure(expectedStructure: AccessibilityStructure): R;
  toAnnounceChangesCorrectly(): R;
}

interface AccessibilityStructure {
  role: string;
  name?: string;
  level?: number;
  children?: AccessibilityStructure[];
}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

// Custom matcher implementations
baseExpect.extend({
  async toHaveAccessibleName(locator: Locator, expectedName: string | RegExp) {
    const actualName = await locator.getAttribute('aria-label') 
      || await locator.getAttribute('aria-labelledby') 
      || await locator.textContent();
    
    const matches = typeof expectedName === 'string' 
      ? actualName === expectedName
      : expectedName.test(actualName || '');
    
    return {
      message: () => `Expected element to have accessible name "${expectedName}", but got "${actualName}"`,
      pass: matches,
      name: 'toHaveAccessibleName',
      expected: expectedName,
      actual: actualName,
    };
  },

  async toBeKeyboardNavigable(locator: Locator) {
    const element = locator.first();
    const tabIndex = await element.getAttribute('tabindex');
    const role = await element.getAttribute('role');
    const isInteractive = ['button', 'link', 'textbox', 'checkbox', 'radio'].includes(role || '');
    const isNavigable = tabIndex !== '-1' && (isInteractive || tabIndex !== null);
    
    return {
      message: () => `Expected element to be keyboard navigable (interactive role or positive tabindex), but it was not`,
      pass: isNavigable,
      name: 'toBeKeyboardNavigable',
    };
  },

  async toHaveProperARIAHierarchy(page: Page) {
    const snapshot = await page.accessibility.snapshot();
    const hasProperHierarchy = validateARIAHierarchy(snapshot);
    
    return {
      message: () => hasProperHierarchy.message,
      pass: hasProperHierarchy.valid,
      name: 'toHaveProperARIAHierarchy',
    };
  },

  async toHaveSemanticStructure(locator: Locator, expectedStructure: AccessibilityStructure) {
    const page = locator.page();
    const elementHandle = await locator.elementHandle();
    
    if (!elementHandle) {
      return {
        message: () => `Element handle not found for structure comparison`,
        pass: false,
        name: 'toHaveSemanticStructure',
      };
    }
    
    const snapshot = await page.accessibility.snapshot({ root: elementHandle });
    const matches = compareStructures(snapshot, expectedStructure);
    
    return {
      message: () => `Expected element to have semantic structure matching the specification`,
      pass: matches.isMatch,
      name: 'toHaveSemanticStructure',
      expected: expectedStructure,
      actual: snapshot,
    };
  },

  async toAnnounceChangesCorrectly(locator: Locator) {
    const ariaLive = await locator.getAttribute('aria-live');
    const role = await locator.getAttribute('role');
    
    const hasLiveRegion = ariaLive || role === 'status' || role === 'alert';
    
    return {
      message: () => `Expected element to properly announce changes (aria-live, role=status/alert)`,
      pass: !!hasLiveRegion,
      name: 'toAnnounceChangesCorrectly',
    };
  }
});

// Helper functions
function validateARIAHierarchy(node: any, depth = 0): { valid: boolean; message: string } {
  if (!node) return { valid: true, message: '' };
  
  // Check for common ARIA hierarchy violations
  if (node.role === 'button' && node.children?.some((child: any) => child.role === 'button')) {
    return { valid: false, message: 'Interactive elements should not contain other interactive elements' };
  }
  
  if (node.role === 'heading' && node.level && depth > 0) {
    // Basic heading level validation (simplified)
    if (node.level > 6) {
      return { valid: false, message: `Heading level ${node.level} exceeds maximum of 6` };
    }
  }
  
  // Recursively validate children
  if (node.children) {
    for (const child of node.children) {
      const childResult = validateARIAHierarchy(child, depth + 1);
      if (!childResult.valid) return childResult;
    }
  }
  
  return { valid: true, message: 'ARIA hierarchy is valid' };
}

function compareStructures(actual: any, expected: AccessibilityStructure): { isMatch: boolean; differences: string[] } {
  const differences: string[] = [];
  
  if (actual?.role !== expected.role) {
    differences.push(`Role mismatch: expected "${expected.role}", got "${actual?.role}"`);
  }
  
  if (expected.name && actual?.name !== expected.name) {
    differences.push(`Name mismatch: expected "${expected.name}", got "${actual?.name}"`);
  }
  
  if (expected.level && actual?.level !== expected.level) {
    differences.push(`Level mismatch: expected ${expected.level}, got ${actual?.level}`);
  }
  
  // Simplified children comparison
  if (expected.children && actual?.children) {
    if (expected.children.length !== actual.children.length) {
      differences.push(`Children count mismatch: expected ${expected.children.length}, got ${actual.children.length}`);
    }
  }
  
  return {
    isMatch: differences.length === 0,
    differences
  };
}

export const expect = baseExpect;
