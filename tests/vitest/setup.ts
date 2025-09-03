/**
 * Clean Test Setup
 * 
 * Simple, maintainable test configuration
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Simple mock for enhanced design tokens
vi.mock('@/design/enhanced-tokens', () => ({
  ENHANCED_DESIGN_TOKENS: {
    foundation: {
      layout: {
        display: { inlineBlock: 'inline-block', flex: 'flex' },
        flex: { items: { center: 'items-center' }, justify: { center: 'justify-center' } },
        border: { radius: { full: 'rounded-full' }, width: { default: 'border' } },
        select: { none: 'select-none' },
        background: { transparent: 'bg-transparent' },
        padding: { 1: 'p-1', 2: 'p-2', 3: 'p-3', 4: 'p-4' }
      },
      typography: {
        label: 'text-sm font-medium',
        caption: 'text-xs font-normal',
        body: { small: 'text-sm' }
      },
      focus: { ringPrimary: 'focus-visible:ring-2' },
      motionComponents: { badgeHover: 'transition-all' },
      motionAccessibility: { motionReduceNone: 'motion-reduce:transition-none' },
      elevation: { sm: 'shadow-sm' },
      backdrop: { blur: { md: 'backdrop-blur-md' } },
      color: {
        surface: { canvas: 'bg-background', card: 'bg-card', translucent: 'bg-background/80' },
        content: { primary: 'text-foreground', secondary: 'text-muted-foreground' },
        brand: {
          primary: { bg: 'bg-primary', fg: 'text-primary-foreground', border: 'border-primary' },
          secondary: { bg: 'bg-secondary', fg: 'text-secondary-foreground', border: 'border-secondary' },
          accent: { bg: 'bg-accent', fg: 'text-accent-foreground', border: 'border-accent' }
        },
        border: { muted: 'border-muted', default: 'border-border', 'cosmic-border-30': 'border-border/30' },
        feedback: {
          success: { subtle: 'bg-green-100', border: 'border-green-200', muted: 'text-green-600' },
          warning: { subtle: 'bg-yellow-100', border: 'border-yellow-200', muted: 'text-yellow-600' },
          error: { subtle: 'bg-red-100', border: 'border-red-200', muted: 'text-red-600' },
          info: { subtle: 'bg-blue-100', border: 'border-blue-200', muted: 'text-blue-600' }
        }
      },
      zIndex: { surface: 0, overlay: 100, popover: 200, modal: 300, toast: 400, tooltip: 500 }
    }
  }
}));

// Simple mock for cn utility
vi.mock('@/utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => 
    classes.filter(Boolean).join(' ')
}));

// Clean test environment setup
beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.restoreAllMocks();
});
