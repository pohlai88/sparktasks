/**
 * MAPS v3.0 Enhanced Design Tokens - Clean Architecture Foundation
 *
 * SYSTEM ARCHITECTURE RELATIONSHIPS:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                     DESIGN SYSTEM FLOW                         │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * 1. tailwind.config.js
 *    ├─ Defines Tailwind classes using CSS custom properties
 *    ├─ Maps: `bg-primary` → `rgb(var(--primary) / <alpha-value>)`
 *    └─ Safelist protects dynamic classes from purging
 *
 * 2. src/index.css
 *    ├─ Defines CSS custom properties: `--primary: 48 176 199`
 *    ├─ Dark/light mode variants
 *    └─ SINGLE SOURCE OF TRUTH for color values
 *
 * 3. enhanced-tokens.ts (THIS FILE)
 *    ├─ Semantic API layer over CSS foundation
 *    ├─ Component recipes and patterns
 *    ├─ TypeScript-safe token access
 *    └─ NO hardcoded values - references CSS variables only
 *
 * 4. Dynamic Token Registry (z-index-registry.ts)
 *    ├─ Consumes this file's z-index tokens
 *    ├─ Provides conflict resolution
 *    ├─ Visual debugging capabilities
 *    └─ Runtime token management
 *
 * DESIGN PRINCIPLES:
 * ✅ CSS Variables as SSOT - No hardcoded hex values
 * ✅ Semantic Naming - Human-readable, purposeful tokens
 * ✅ Component Recipes - Common UI patterns pre-defined
 * ✅ TypeScript Safety - Full type inference and validation
 * ✅ Registry Integration - Dynamic systems consume these tokens
 *
 * COMPLIANCE STANDARDS:
 * - WCAG AAA: 7:1 contrast ratios enforced in CSS layer
 * - Apple HIG: Semantic hierarchy and spacing system
 * - Dark-First: Optimized for dark mode with light overrides
 * - Motion Respect: prefers-reduced-motion compliance
 */

import { z } from 'zod';

// ===== FOUNDATION LAYER =====

/**
 * Core Design System Foundation
 * Maps directly to CSS custom properties defined in index.css
 */
export const ENHANCED_DESIGN_TOKENS = {
  /**
   * Metadata and versioning
   */
  meta: {
    version: '3.0.0',
    name: 'MAPS Enhanced Design Tokens - Clean Architecture',
    description:
      'CSS variable-based token system with dynamic registry support',
    lastUpdated: '2025-08-27',
  },

  /**
   * Foundation Layer - Core Semantic Tokens
   * All values reference CSS custom properties from index.css
   */
  foundation: {
    /**
     * Color System - Semantic Color API
     * References CSS variables, no hardcoded values
     */
    color: {
      // Surface colors for backgrounds and containers
      surface: {
        canvas: 'bg-background', // Primary app background
        elevated: 'bg-background-elevated', // Cards, elevated surfaces
        panel: 'bg-background-panel', // Panels, sidebars
        overlay: 'bg-background-overlay', // Modal overlays
        translucent: 'bg-background-panel/80', // Semi-transparent surfaces
        scrim: 'bg-background/60', // Content protection scrim
      },

      // Content colors for text and foreground elements
      content: {
        primary: 'text-foreground', // Primary text content
        secondary: 'text-foreground-muted', // Secondary text
        tertiary: 'text-foreground-subtle', // Tertiary text, captions
        disabled: 'text-foreground-disabled', // Disabled state text
        inverse: 'text-background', // Inverse text on dark backgrounds
        muted: 'text-muted-foreground', // Muted text with hint color
      },

      // Brand colors for interactive elements
      brand: {
        primary: {
          bg: 'bg-primary', // Primary brand background
          fg: 'text-primary-foreground', // Text on primary background
          border: 'border-primary', // Primary borders
          hover: 'hover:bg-primary-hover', // Primary hover state
          pressed: 'active:bg-primary/90', // Primary pressed state
        },
        secondary: {
          bg: 'bg-secondary', // Secondary brand background
          fg: 'text-secondary-foreground', // Text on secondary background
          border: 'border-secondary', // Secondary borders
          hover: 'hover:bg-secondary-hover', // Secondary hover state
          pressed: 'active:bg-secondary/90', // Secondary pressed state
        },
        accent: {
          bg: 'bg-accent', // Accent background
          fg: 'text-accent-foreground', // Text on accent background
          border: 'border-accent', // Accent borders
          hover: 'hover:bg-accent-hover', // Accent hover state
          pressed: 'active:bg-accent-pressed', // Accent pressed state
        },
      },

      // Semantic feedback colors
      feedback: {
        success: {
          bg: 'bg-success', // Success background
          fg: 'text-success-foreground', // Text on success background
          border: 'border-success', // Success borders
          solid: 'bg-success-solid-aaa', // AAA compliant solid
        },
        warning: {
          bg: 'bg-warning', // Warning background
          fg: 'text-warning-foreground', // Text on warning background
          border: 'border-warning', // Warning borders
        },
        error: {
          bg: 'bg-error', // Error background
          fg: 'text-error-foreground', // Text on error background
          border: 'border-error', // Error borders
          solid: 'bg-error-solid-aaa', // AAA compliant solid
        },
        info: {
          bg: 'bg-accent', // Info uses accent system
          fg: 'text-accent-foreground', // Info text
          border: 'border-accent', // Info borders
        },
      },

      // Border and stroke system
      border: {
        subtle: 'border-border', // Subtle dividers
        default: 'border-border', // Standard borders
        strong: 'border-border-strong', // Emphasized borders
        accent: 'border-border-accent', // Accent borders
        focus: 'border-ring', // Focus indicators
      },
    },

    /**
     * Typography System - Semantic Text Hierarchy
     * Based on Apple HIG principles, adapted for web
     */
    typography: {
      // Display text styles
      display: {
        large: 'text-4xl font-bold leading-tight tracking-tight',
        medium: 'text-3xl font-bold leading-tight tracking-tight',
        small: 'text-2xl font-semibold leading-snug tracking-tight',
      },

      // Semantic content hierarchy
      heading: {
        h1: 'text-3xl font-semibold leading-snug tracking-tight',
        h2: 'text-2xl font-semibold leading-snug',
        h3: 'text-xl font-semibold leading-normal',
        h4: 'text-lg font-medium leading-normal',
        h5: 'text-base font-medium leading-normal',
        h6: 'text-sm font-medium leading-normal',
      },

      // Body text styles
      body: {
        large: 'text-lg font-normal leading-relaxed',
        medium: 'text-base font-normal leading-relaxed',
        small: 'text-sm font-normal leading-normal',
      },

      // Specialized text styles
      label: 'text-sm font-medium leading-normal',
      caption: 'text-xs font-normal leading-tight',
      overline: 'text-xs font-medium leading-tight uppercase tracking-wide',

      // Interactive text
      link: 'text-accent hover:text-accent-hover underline decoration-1 underline-offset-2 transition-colors',
      button: 'text-sm font-medium leading-normal',
    },

    /**
     * Spacing System - 8pt Grid Foundation
     * Consistent spacing scale for layouts and components
     */
    spacing: {
      none: '0', // 0px
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px - Base unit
      md: '0.75rem', // 12px
      lg: '1rem', // 16px - Standard
      xl: '1.5rem', // 24px
      '2xl': '2rem', // 32px
      '3xl': '3rem', // 48px
      '4xl': '4rem', // 64px
      '5xl': '6rem', // 96px
      '6xl': '8rem', // 128px
    },

    /**
     * Border Radius System - Apple-style curves
     */
    radius: {
      none: 'rounded-none', // 0px
      xs: 'rounded-sm', // 2px
      sm: 'rounded', // 4px
      md: 'rounded-md', // 6px
      lg: 'rounded-lg', // 8px
      xl: 'rounded-xl', // 12px
      '2xl': 'rounded-2xl', // 16px
      '3xl': 'rounded-3xl', // 24px
      full: 'rounded-full', // 9999px
    },

    /**
     * Shadow System - Elevation and depth
     */
    elevation: {
      none: 'shadow-none',
      sm: 'shadow-elevation-sm',
      md: 'shadow-elevation-md',
      lg: 'shadow-elevation-lg',
      xl: 'shadow-elevation-xl',
      glass: 'shadow-glass',
      glow: {
        accent: 'shadow-glow-accent',
        secondary: 'shadow-glow-secondary',
      },
    },

    /**
     * Z-Index System - Layer Management
     * Consumed by Dynamic Token Registry (z-index-registry.ts)
     */
    zIndex: {
      surface: 0, // Default document flow
      overlay: 100, // General overlays
      popover: 1100, // Contextual popovers (non-blocking)
      modal: 1300, // Modal dialogs (blocking)
      toast: 1400, // Toast notifications
      tooltip: 1500, // Tooltip overlays (highest)
    },

    /**
     * Motion System - Animation and transitions
     */
    motion: {
      // Duration tokens
      duration: {
        instant: '75ms', // Immediate feedback
        fast: '120ms', // Quick interactions
        normal: '180ms', // Standard transitions
        slow: '240ms', // Complex animations
        slower: '320ms', // Entrance/exit animations
      },

      // Easing curves
      easing: {
        linear: 'linear',
        standard: 'cubic-bezier(0.2, 0, 0.2, 1)', // Apple standard
        emphasized: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Emphasized entry
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)', // Natural exit
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)', // Quick entry
      },

      // Predefined transition patterns
      transition: {
        colors: 'transition-colors duration-normal ease-standard',
        transform: 'transition-transform duration-normal ease-standard',
        opacity: 'transition-opacity duration-fast ease-standard',
        all: 'transition-all duration-normal ease-standard',
        none: 'transition-none',
      },
    },
  },

  /**
   * Component Recipes - Common UI Patterns
   * Pre-built combinations for consistent component development
   */
  recipes: {
    /**
     * Button component recipes
     */
    button: {
      base: [
        'inline-flex',
        'items-center',
        'justify-center',
        'font-medium',
        'transition-colors',
        'duration-normal',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:opacity-50',
        'disabled:pointer-events-none',
      ],
      size: {
        sm: ['h-9', 'px-3', 'text-sm', 'gap-1.5'],
        md: ['h-10', 'px-4', 'text-sm', 'gap-2'],
        lg: ['h-11', 'px-6', 'text-base', 'gap-2'],
      },
      variant: {
        primary: [
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary-hover',
        ],
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'hover:bg-secondary-hover',
        ],
        outline: [
          'border',
          'border-border',
          'bg-transparent',
          'hover:bg-accent',
          'hover:text-accent-foreground',
        ],
        ghost: ['hover:bg-accent', 'hover:text-accent-foreground'],
        destructive: ['bg-error', 'text-error-foreground', 'hover:bg-error/90'],
      },
    },

    /**
     * Card component recipes
     */
    card: {
      base: [
        'rounded-lg',
        'border',
        'border-border',
        'bg-card',
        'text-card-foreground',
      ],
      elevated: ['shadow-md'],
      interactive: ['hover:shadow-lg', 'transition-shadow', 'duration-normal'],
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },

    /**
     * Input component recipes
     */
    input: {
      base: [
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input-border',
        'bg-input',
        'px-3',
        'py-2',
        'text-sm',
        'ring-offset-background',
        'placeholder:text-input-placeholder',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
      ],
      error: ['border-error', 'focus-visible:ring-error'],
      success: ['border-success', 'focus-visible:ring-success'],
    },

    /**
     * Badge component recipes
     */
    badge: {
      base: [
        'inline-flex',
        'items-center',
        'rounded-full',
        'px-2.5',
        'py-0.5',
        'text-xs',
        'font-semibold',
      ],
      variant: {
        default: ['bg-primary', 'text-primary-foreground'],
        secondary: ['bg-secondary', 'text-secondary-foreground'],
        success: ['bg-success', 'text-success-foreground'],
        warning: ['bg-warning', 'text-warning-foreground'],
        error: ['bg-error', 'text-error-foreground'],
        outline: ['border', 'border-border', 'text-foreground'],
      },
    },

    /**
     * Progress component recipes
     */
    progress: {
      container: ['w-full', 'overflow-hidden', 'rounded-full', 'bg-secondary'],
      bar: [
        'h-full',
        'bg-primary',
        'transition-all',
        'duration-normal',
        'ease-standard',
      ],
      size: {
        sm: 'h-1', // 4px
        md: 'h-2', // 8px
        lg: 'h-3', // 12px
      },
    },

    /**
     * Dialog/Modal component recipes
     */
    dialog: {
      overlay: [
        'fixed',
        'inset-0',
        'z-modal',
        'bg-background-overlay/80',
        'backdrop-blur-sm',
      ],
      content: [
        'fixed',
        'left-1/2',
        'top-1/2',
        'z-modal',
        'grid',
        'w-full',
        'max-w-lg',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
        'gap-4',
        'border',
        'border-border',
        'bg-background-elevated',
        'p-6',
        'shadow-lg',
        'duration-normal',
        'rounded-lg',
      ],
      title: ['text-lg', 'font-semibold', 'leading-none', 'tracking-tight'],
      description: ['text-sm', 'text-muted-foreground'],
    },

    /**
     * Tooltip component recipes
     */
    tooltip: {
      content: [
        'z-tooltip',
        'rounded-md',
        'border',
        'border-border',
        'bg-background-panel',
        'px-3',
        'py-1.5',
        'text-sm',
        'text-foreground',
        'shadow-md',
        'animate-in',
        'fade-in-0',
        'zoom-in-95',
      ],
    },
  },

  /**
   * Accessibility Features
   * Enhanced support for screen readers and reduced motion
   */
  accessibility: {
    // Screen reader utilities - for component internal use only
    screenReader: {
      // NOTE: These tokens are consumed by <VisuallyHidden> component
      // Direct usage discouraged - use the component instead
      // eslint-disable-next-line no-restricted-syntax
      visuallyHidden: 'sr-only',
      // eslint-disable-next-line no-restricted-syntax
      visuallyHiddenFocusable:
        'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0',
    },

    // Focus management
    focus: {
      ring: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      outline: 'focus-visible:outline-none',
      within:
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
    },

    // High contrast support
    highContrast: {
      border: 'contrast-more:border-2',
      text: 'contrast-more:text-foreground',
    },

    // Reduced motion compliance
    motion: {
      respect: 'motion-reduce:transition-none motion-reduce:animate-none',
      safe: 'motion-safe:transition-all motion-safe:duration-normal',
    },
  },
} as const;

// ===== TYPE SAFETY =====

/**
 * Type definitions for enhanced type safety
 */
export type DesignTokens = typeof ENHANCED_DESIGN_TOKENS;
export type ColorTokens = DesignTokens['foundation']['color'];
export type TypographyTokens = DesignTokens['foundation']['typography'];
export type SpacingTokens = DesignTokens['foundation']['spacing'];
export type ZIndexTokens = DesignTokens['foundation']['zIndex'];
export type MotionTokens = DesignTokens['foundation']['motion'];
export type ComponentRecipes = DesignTokens['recipes'];

/**
 * Zod schema for runtime validation
 */
export const DesignTokensSchema = z.object({
  meta: z.object({
    version: z.string(),
    name: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
  foundation: z.object({
    color: z.object({
      surface: z.record(z.string()),
      content: z.record(z.string()),
      brand: z.object({
        primary: z.record(z.string()),
        secondary: z.record(z.string()),
        accent: z.record(z.string()),
      }),
      feedback: z.object({
        success: z.record(z.string()),
        warning: z.record(z.string()),
        error: z.record(z.string()),
        info: z.record(z.string()),
      }),
      border: z.record(z.string()),
    }),
    typography: z.object({
      display: z.record(z.string()),
      heading: z.record(z.string()),
      body: z.record(z.string()),
      label: z.string(),
      caption: z.string(),
      overline: z.string(),
      link: z.string(),
      button: z.string(),
    }),
    spacing: z.record(z.string()),
    radius: z.record(z.string()),
    elevation: z.record(z.union([z.string(), z.record(z.string())])),
    zIndex: z.record(z.number()),
    motion: z.record(z.union([z.record(z.string()), z.string()])),
  }),
  recipes: z.record(
    z.record(
      z.union([
        z.array(z.string()),
        z.record(z.union([z.array(z.string()), z.string()])),
      ])
    )
  ),
  accessibility: z.record(z.record(z.string())),
});

// ===== UTILITY FUNCTIONS =====

/**
 * Get token value by path
 * @param path - Dot notation path to token (e.g., 'foundation.color.brand.primary.bg')
 * @returns Token value or throws error if not found
 */
export function getToken(path: string): string | number | string[] {
  const keys = path.split('.');
  let current: unknown = ENHANCED_DESIGN_TOKENS;

  for (const key of keys) {
    current = (current as Record<string, unknown>)?.[key];
    if (current === undefined) {
      throw new Error(`Token not found at path: ${path}`);
    }
  }

  return current as string | number | string[];
}

/**
 * Combine multiple token values into a single class string
 * @param tokens - Array of token values
 * @returns Combined class string
 */
export function combineTokens(
  ...tokens: (string | string[] | undefined)[]
): string {
  return tokens.filter(Boolean).flat().join(' ');
}

/**
 * Validate token usage at runtime (development only)
 * @param className - Class string to validate
 * @returns Boolean indicating if usage is valid
 */
export function validateTokenUsage(className: string): boolean {
  if (process.env.NODE_ENV !== 'development') return true;

  // Check for hardcoded colors
  const hardcodedColorPattern = /#[0-9A-Fa-f]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(/;
  if (hardcodedColorPattern.test(className)) {
    console.warn(
      `🚨 Hardcoded color detected: ${className}. Use design tokens instead.`
    );
    return false;
  }

  // Check for arbitrary values that should use tokens
  const arbitraryValuePattern = /\[[^\]]+\]/;
  if (arbitraryValuePattern.test(className)) {
    console.warn(
      `⚠️ Arbitrary value detected: ${className}. Consider using design tokens.`
    );
  }

  return true;
}

// ===== DEVELOPMENT VALIDATION =====

if (process.env.NODE_ENV === 'development') {
  try {
    DesignTokensSchema.parse(ENHANCED_DESIGN_TOKENS);
    console.log('✅ MAPS v3.0 Enhanced Design Tokens validated successfully');
  } catch (error) {
    console.error('❌ Design tokens validation failed:', error);
    throw new Error('Design tokens validation failed - check token structure');
  }
}

// ===== EXPORTS =====

export default ENHANCED_DESIGN_TOKENS;
