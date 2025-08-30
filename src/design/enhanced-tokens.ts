/**
 * MAPS4 Deep Space Canvas Cosmic Innovation - Enhanced Design Tokens
 *
 * SYSTEM ARCHITECTURE RELATIONSHIPS:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                MAPS4 COSMIC DESIGN SYSTEM FLOW                 │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * 1. tailwind.config.js
 *    ├─ Defines Tailwind classes using MAPS4 CSS custom properties
 *    ├─ Maps: `bg-aurora-accent` → `rgb(var(--aurora-accent) / <alpha-value>)`
 *    └─ Safelist protects dynamic classes from purging
 *
 * 2. src/index.css
 *    ├─ Defines MAPS4 CSS custom properties: `--aurora-accent: 124 196 255`
 *    ├─ Dark/light mode variants with cosmic harmony
 *    └─ SINGLE SOURCE OF TRUTH for MAPS4 cosmic color values
 *
 * 3. enhanced-tokens.ts (THIS FILE)
 *    ├─ Semantic API layer over MAPS4 cosmic foundation
 *    ├─ Component recipes and patterns with cosmic aesthetics
 *    ├─ TypeScript-safe token access to cosmic system
 *    └─ NO hardcoded values - references MAPS4 CSS variables only
 *
 * 4. Dynamic Token Registry (z-index-registry.ts)
 *    ├─ Consumes this file's cosmic z-index tokens
 *    ├─ Provides conflict resolution for cosmic layers
 *    ├─ Visual debugging capabilities for cosmic system
 *    └─ Runtime token management for cosmic aesthetics
 *
 * DESIGN PRINCIPLES:
 * ✅ MAPS4 CSS Variables as SSOT - No hardcoded hex values
 * ✅ Cosmic Semantic Naming - Human-readable, purposeful cosmic tokens
 * ✅ Component Recipes - Common UI patterns with cosmic aesthetics
 * ✅ TypeScript Safety - Full type inference and validation
 * ✅ Registry Integration - Dynamic systems consume cosmic tokens
 *
 * COMPLIANCE STANDARDS:
 * - WCAG AAA: 7:1 contrast ratios enforced in MAPS4 CSS layer
 * - Sir Steve Jobs Cosmic Innovation: Inspirational, memorable, industry-leading
 * - Dark-First: Optimized for cosmic dark mode with light overrides
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
    version: '4.0.0',
    name: 'MAPS4 Deep Space Canvas Cosmic Innovation - Enhanced Design Tokens',
    description:
      'MAPS4 cosmic CSS variable-based token system with dynamic registry support',
    lastUpdated: '2025-01-27',
  },

  /**
   * Foundation Layer - MAPS4 Cosmic Semantic Tokens
   * All values reference MAPS4 CSS custom properties from index.css
   */
  foundation: {
    /**
     * MAPS4 Cosmic Color System - Semantic Color API
     * References MAPS4 CSS variables, no hardcoded values
     */
    color: {
      // MAPS4 Surface colors for backgrounds and containers
      surface: {
        canvas: 'bg-deep-space', // Primary cosmic app background
        elevated: 'bg-cosmic-void', // Cards, elevated cosmic surfaces
        panel: 'bg-stellar-surface', // Panels, sidebars with stellar aesthetics
        overlay: 'bg-cosmic-overlay', // Modal overlays with cosmic depth
        translucent: 'bg-stellar-surface/80', // Semi-transparent cosmic surfaces
        scrim: 'bg-deep-space/60', // Content protection scrim with cosmic depth
      },

      // MAPS4 Content colors for text and foreground elements
      content: {
        primary: 'text-cosmic-light', // Primary cosmic text content
        secondary: 'text-stellar-muted', // Secondary cosmic text
        tertiary: 'text-cosmic-subtle', // Tertiary cosmic text, captions
        disabled: 'text-cosmic-disabled', // Disabled state cosmic text
        inverse: 'text-deep-space', // Inverse text on cosmic dark backgrounds
        muted: 'text-stellar-muted', // Muted cosmic text with hint color
      },

      // MAPS4 Aurora Accent System for interactive elements
      brand: {
        primary: {
          bg: 'bg-aurora-accent', // Aurora accent background
          fg: 'text-cosmic-dark', // Text on aurora accent background
          border: 'border-aurora-accent', // Aurora accent borders
          hover: 'hover:bg-cosmic-primary-hover', // Aurora accent hover state
          pressed: 'active:bg-aurora-accent/90', // Aurora accent pressed state
        },
        secondary: {
          bg: 'bg-cosmic-cyan', // Cosmic cyan background
          fg: 'text-cosmic-dark', // Text on cosmic cyan background
          border: 'border-cosmic-cyan', // Cosmic cyan borders
          hover: 'hover:bg-cosmic-secondary-hover', // Cosmic cyan hover state
          pressed: 'active:bg-cosmic-cyan/90', // Cosmic cyan pressed state
        },
        accent: {
          bg: 'bg-aurora-accent', // Aurora accent background
          fg: 'text-cosmic-dark', // Text on aurora accent background
          border: 'border-aurora-accent', // Aurora accent borders
          hover: 'hover:bg-cosmic-primary-hover', // Aurora accent hover state
          pressed: 'active:bg-cosmic-accent-pressed', // Aurora accent pressed state
        },
      },

      // MAPS4 Semantic feedback colors with cosmic harmony
      feedback: {
        success: {
          bg: 'bg-cosmic-success', // Cosmic success background
          fg: 'text-cosmic-dark', // Text on cosmic success background
          border: 'border-cosmic-success', // Cosmic success borders
          solid: 'bg-cosmic-success-solid', // AAA compliant cosmic solid
        },
        warning: {
          bg: 'bg-cosmic-warning', // Cosmic warning background
          fg: 'text-cosmic-dark', // Text on cosmic warning background
          border: 'border-cosmic-warning', // Cosmic warning borders
        },
        error: {
          bg: 'bg-cosmic-danger', // Cosmic danger background
          fg: 'text-cosmic-dark', // Text on cosmic danger background
          border: 'border-cosmic-danger', // Cosmic danger borders
          solid: 'bg-cosmic-danger-solid', // AAA compliant cosmic solid
        },
        info: {
          bg: 'bg-cosmic-info', // Cosmic info background
          fg: 'text-cosmic-dark', // Text on cosmic info background
          border: 'border-cosmic-info', // Cosmic info borders
        },
      },

      // MAPS4 Border and stroke system with cosmic aesthetics
      border: {
        subtle: 'border-cosmic-border-subtle', // Subtle cosmic dividers
        default: 'border-cosmic-border', // Standard cosmic borders
        strong: 'border-cosmic-border-strong', // Emphasized cosmic borders
        focus: 'border-ring', // Aurora accent focus indicators
      },
    },

    /**
     * MAPS4 Typography System - Cosmic Text Hierarchy
     * Based on Sir Steve Jobs Cosmic Innovation principles, adapted for web
     */
    typography: {
      // MAPS4 Display text styles with cosmic aesthetics
      display: {
        large: 'text-4xl font-bold leading-tight tracking-tight text-cosmic-light',
        medium: 'text-3xl font-bold leading-tight tracking-tight text-cosmic-light',
        small: 'text-2xl font-semibold leading-snug tracking-tight text-cosmic-light',
      },

      // MAPS4 Semantic content hierarchy with cosmic harmony
      heading: {
        h1: 'text-3xl font-semibold leading-snug tracking-tight text-cosmic-light',
        h2: 'text-2xl font-semibold leading-snug text-cosmic-light',
        h3: 'text-xl font-semibold leading-normal text-cosmic-light',
        h4: 'text-lg font-medium leading-normal text-cosmic-light',
        h5: 'text-base font-medium leading-normal text-cosmic-light',
        h6: 'text-sm font-medium leading-normal text-cosmic-light',
      },

      // MAPS4 Body text styles with cosmic readability
      body: {
        large: 'text-lg font-normal leading-relaxed text-cosmic-light',
        medium: 'text-base font-normal leading-relaxed text-cosmic-light',
        small: 'text-sm font-normal leading-normal text-cosmic-light',
      },

      // MAPS4 Specialized text styles with cosmic aesthetics
      label: 'text-sm font-medium leading-normal text-cosmic-light',
      caption: 'text-xs font-normal leading-tight text-stellar-muted',
      overline: 'text-xs font-medium leading-tight uppercase tracking-wide text-stellar-muted',

      // MAPS4 Interactive text with cosmic accents
      link: 'text-aurora-accent hover:text-cosmic-primary-hover underline decoration-1 underline-offset-2 transition-colors',
      button: 'text-sm font-medium leading-normal text-cosmic-light',
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
      // Duration tokens - Using CSS custom properties
      duration: {
        instant: 'var(--motion-duration-instant)',
        fast: 'var(--motion-duration-fast)',
        normal: 'var(--motion-duration-normal)',
        slow: 'var(--motion-duration-slow)',
        slower: 'var(--motion-duration-slower)',
      },

      // Easing curves - Using CSS custom properties
      easing: {
        linear: 'var(--motion-easing-linear)',
        standard: 'var(--motion-easing-standard)',
        emphasized: 'var(--motion-easing-emphasized)',
        decelerate: 'var(--motion-easing-decelerate)',
        accelerate: 'var(--motion-easing-accelerate)',
      },

      // Predefined transition patterns - Using CSS custom properties
      transition: {
        colors: 'transition-colors var(--motion-duration-normal) var(--motion-easing-standard)',
        transform: 'transition-transform var(--motion-duration-normal) var(--motion-easing-standard)',
        opacity: 'transition-opacity var(--motion-duration-fast) var(--motion-easing-standard)',
        all: 'transition-all var(--motion-duration-normal) var(--motion-easing-standard)',
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
          'bg-aurora-accent',
          'text-cosmic-dark',
          'hover:bg-cosmic-primary-hover',
        ],
        secondary: [
          'bg-cosmic-cyan',
          'text-cosmic-dark',
          'hover:bg-cosmic-secondary-hover',
        ],
        outline: [
          'border',
          'border-cosmic-border',
          'bg-transparent',
          'hover:bg-aurora-accent',
          'hover:text-cosmic-dark',
        ],
        ghost: ['hover:bg-aurora-accent', 'hover:text-cosmic-dark'],
        destructive: ['bg-cosmic-danger', 'text-cosmic-dark', 'hover:bg-cosmic-danger/90'],
      },
    },

    /**
     * MAPS4 Card component recipes with cosmic aesthetics
     */
    card: {
      base: [
        'rounded-lg',
        'border',
        'border-cosmic-border',
        'bg-stellar-surface',
        'text-cosmic-light',
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
     * MAPS4 Input component recipes with cosmic aesthetics
     */
    input: {
      base: [
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-cosmic-input-border',
        'bg-cosmic-input',
        'px-3',
        'py-2',
        'text-sm',
        'ring-offset-cosmic-ring-offset',
        'placeholder:text-cosmic-input-placeholder',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
      ],
      error: ['border-cosmic-danger', 'focus-visible:ring-cosmic-danger'],
      success: ['border-cosmic-success', 'focus-visible:ring-cosmic-success'],
    },

    /**
     * Textarea component recipes
     */
    textarea: {
      base: [
        'flex',
        'w-full',
        'min-h-[80px]',
        'rounded-md',
        'border',
        'border-input-border',
        'bg-input',
        'px-3',
        'py-2',
        'text-sm',
        'ring-offset-cosmic-ring-offset',
        'placeholder:text-cosmic-input-placeholder',
        'resize-vertical',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
      ],
      error: ['border-cosmic-danger', 'focus-visible:ring-cosmic-danger'],
      success: ['border-cosmic-success', 'focus-visible:ring-cosmic-success'],
      size: {
        sm: ['min-h-[60px]', 'text-xs'],
        md: ['min-h-[80px]', 'text-sm'],
        lg: ['min-h-[120px]', 'text-base'],
        xl: ['min-h-[160px]', 'text-lg'],
      },
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
        default: ['bg-aurora-accent', 'text-cosmic-dark'],
        secondary: ['bg-cosmic-cyan', 'text-cosmic-dark'],
        success: ['bg-cosmic-success', 'text-cosmic-dark'],
        warning: ['bg-cosmic-warning', 'text-cosmic-dark'],
        error: ['bg-cosmic-danger', 'text-cosmic-dark'],
        outline: ['border', 'border-cosmic-border', 'text-cosmic-light'],
      },
    },

    /**
     * MAPS4 Progress component recipes with cosmic aesthetics
     */
    progress: {
      container: ['w-full', 'overflow-hidden', 'rounded-full', 'bg-cosmic-cyan'],
      bar: [
        'h-full',
        'bg-aurora-accent',
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
     * MAPS4 Dialog/Modal component recipes with cosmic aesthetics
     */
    dialog: {
      overlay: [
        'fixed',
        'inset-0',
        'z-modal',
        'bg-cosmic-overlay/80',
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
        'border-cosmic-border',
        'bg-cosmic-void',
        'p-6',
        'shadow-lg',
        'duration-normal',
        'rounded-lg',
      ],
      title: ['text-lg', 'font-semibold', 'leading-none', 'tracking-tight', 'text-cosmic-light'],
      description: ['text-sm', 'text-stellar-muted'],
    },

    /**
     * MAPS4 Tooltip component recipes with cosmic aesthetics
     */
    tooltip: {
      content: [
        'z-tooltip',
        'rounded-md',
        'border',
        'border-cosmic-border',
        'bg-stellar-surface',
        'px-3',
        'py-1.5',
        'text-sm',
        'text-cosmic-light',
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

    // MAPS4 High contrast support with cosmic aesthetics
    highContrast: {
      border: 'contrast-more:border-2',
      text: 'contrast-more:text-cosmic-light',
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
    console.log('✅ MAPS4 Deep Space Canvas Cosmic Innovation Enhanced Design Tokens validated successfully');
  } catch (error) {
    console.error('❌ MAPS4 Design tokens validation failed:', error);
    throw new Error('MAPS4 Design tokens validation failed - check token structure');
  }
}

// ===== EXPORTS =====

export default ENHANCED_DESIGN_TOKENS;
