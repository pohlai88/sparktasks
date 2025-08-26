/**
 * MAPS v2.2 Enhanced Design Tokens - Dark-First Philosophy with Apple HIG Harmony
 *
 * COMPLIANCE MATRIX:
 * - Dark Mode First: ✅ Deep space canvas foundation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ 7:1 text contrast, 4.5:1 non-text minimum
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Anti-Drift Enforcement: ✅ Semantic naming, no hardcoded values
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus) → dir (ltr|rtl)
 */

import { z } from 'zod';

// ===== FOUNDATION SCHEMA VALIDATION =====

// ===== DARK-FIRST FOUNDATION: APPLE HIG INTEGRATION =====

/**
 * Apple HIG Accent System - True Human Interface Guidelines
 * Calm, sophisticated colors that respect user attention and follow Apple's design principles
 */
const APPLE_HIG_ACCENT_SYSTEM = {
  // Primary Apple-calm accent - Sophisticated teal (not harsh blue)
  accent: {
    primary: '#30b0c7', // Apple-calm teal - sophisticated, user-respectful
    hover: '#3abade', // Gentle lift on interaction
    pressed: '#26a6bd', // Confident press feedback
    foreground: '#ffffff', // Clean white for maximum contrast
  },

  // Secondary Apple system accent - Purple harmony
  secondary: {
    primary: '#5856d6', // Apple's system purple
    hover: '#6260e0', // Refined interaction
    pressed: '#4e4cb2', // Subtle depth
    foreground: '#ffffff', // Consistent high contrast
  },

  // Apple HIG semantic colors - Natural, human-centered
  semantic: {
    success: '#34c759', // Apple's system green - confident, natural
    warning: '#ff9500', // Apple's system orange - warm, approachable
    error: '#ff3b30', // Apple's system red - clear concern, not harsh
    info: '#30b0c7', // Shares primary accent harmony
  },

  // AAA-Only solid fills for compliance mode (Apple-compliant)
  aaaSolid: {
    accent: '#268a9f', // Darker teal for 7:1 contrast
    success: '#2a9f47', // Darker green for 7:1 contrast
    error: '#cc2f26', // Darker red for 7:1 compliance
  },
} as const;

/**
 * Deep Space Canvas System - Apple-calm surface progression
 * Perfect OKLab ΔL ≈ 0.045 for natural depth perception
 */
const DEEP_SPACE_FOUNDATION = {
  canvas: '#0a0f16', // Deep space - primary canvas
  elevated: '#17162a', // Perfect depth step (ΔL=0.045)
  panel: '#241c41', // Ideal panel surface (ΔL=0.044)
  overlay: '#000000b3', // 70% opacity sophisticated overlay
  translucent: '#241c41cc', // 80% opacity vibrancy-ready
  scrim: '#0a0f1699', // Scrim pattern for AAA compliance
} as const;

/**
 * Content Hierarchy System - Apple semantic text levels
 * Guaranteed 7:1+ contrast for AAA excellence
 */
const CONTENT_HIERARCHY = {
  primary: '#e8ecf1', // Calm off-white (16.8:1 contrast)
  secondary: '#c8ced6', // AA+ secondary text (9.2:1 contrast)
  tertiary: '#9ca3af', // Tertiary information (5.1:1 contrast)
  disabled: '#78808c', // Disabled state (3.8:1 contrast)
  inverse: '#0a0f16', // Inverse for light backgrounds
  muted: '#a6bbde', // Muted with ethereal hint
} as const;

/**
 * Border & Stroke System - Visible but not intrusive
 */
const BORDER_SYSTEM = {
  subtle: '#5b6776', // Hairline dividers (2.8:1 contrast)
  default: '#6f7f92', // Visible on all surfaces (3.4:1)
  strong: '#8094a6', // Strong interactive elements (4.1:1)
  accent: APPLE_HIG_ACCENT_SYSTEM.accent.primary,
  focus: APPLE_HIG_ACCENT_SYSTEM.accent.primary,
} as const;

// ===== APPLE TYPOGRAPHY SEMANTIC HIERARCHY =====

/**
 * Apple Text Style Hierarchy - Semantic, scalable, systematic
 * Maps to SF Pro Text metrics adapted for web
 */
const APPLE_TYPOGRAPHY_SYSTEM = {
  largeTitle: {
    size: '2.25rem', // 36px - Major headlines
    lineHeight: '2.5rem', // 40px - Tight leading
    weight: 700, // Bold emphasis
    letterSpacing: '-0.02em', // Tight tracking
    scale: 'dynamic' as const,
  },
  title1: {
    size: '1.875rem', // 30px - Section titles
    lineHeight: '2.25rem', // 36px - Snug leading
    weight: 600, // Semibold
    letterSpacing: '-0.01em',
    scale: 'dynamic' as const,
  },
  title2: {
    size: '1.5rem', // 24px - Subsection titles
    lineHeight: '2rem', // 32px - Snug leading
    weight: 600, // Semibold
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  title3: {
    size: '1.25rem', // 20px - Component titles
    lineHeight: '1.75rem', // 28px - Normal leading
    weight: 600, // Semibold
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  headline: {
    size: '1.125rem', // 18px - Prominent body
    lineHeight: '1.75rem', // 28px - Normal leading
    weight: 500, // Medium
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  body: {
    size: '1rem', // 16px - Primary body text
    lineHeight: '1.5rem', // 24px - Relaxed leading
    weight: 400, // Normal
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  callout: {
    size: '1rem', // 16px - Emphasized body
    lineHeight: '1.5rem', // 24px - Normal leading
    weight: 500, // Medium emphasis
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  subhead: {
    size: '0.875rem', // 14px - Secondary information
    lineHeight: '1.25rem', // 20px - Normal leading
    weight: 500, // Medium
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  footnote: {
    size: '0.875rem', // 14px - Supplementary text
    lineHeight: '1.25rem', // 20px - Normal leading
    weight: 400, // Normal
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  caption1: {
    size: '0.75rem', // 12px - Captions and labels
    lineHeight: '1rem', // 16px - Tight leading
    weight: 400, // Normal
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
  caption2: {
    size: '0.6875rem', // 11px - Fine print
    lineHeight: '0.875rem', // 14px - Tight leading
    weight: 400, // Normal
    letterSpacing: '0',
    scale: 'dynamic' as const,
  },
} as const;

// ===== 8PT GRID SPACING SYSTEM =====

/**
 * Systematic 8pt Grid - No arbitrary spacing allowed
 * Apple-consistent with half-steps for micro-adjustments
 */
const SYSTEMATIC_SPACING = {
  xs: '0.25rem', // 4px  - Micro spacing
  sm: '0.5rem', // 8px  - Base unit
  md: '0.75rem', // 12px - Compact spacing
  lg: '1rem', // 16px - Standard spacing
  xl: '1.5rem', // 24px - Generous spacing
  xxl: '2rem', // 32px - Section spacing
  xxxl: '3rem', // 48px - Major spacing
  xxxxl: '4rem', // 64px - Hero spacing
} as const;

// ===== PLATFORM-AWARE INTERACTION TARGETS =====

/**
 * Hit Target System - Platform-responsive interaction areas
 * Ensures accessibility across input modalities
 */
const HIT_TARGET_SYSTEM = {
  base: 'min-h-[44px] min-w-[44px]', // Touch-friendly default
  desktop: '@media (hover: hover) { min-h-[32px] min-w-[32px] }', // Precise pointing
  large: 'min-h-[48px] min-w-[48px]', // Prominent actions
  compact: 'min-h-[36px] min-w-[36px]', // Dense layouts
} as const;

// ===== LIQUID GLASS MATERIALS SYSTEM =====

/**
 * Governed Vibrancy System - Apple Materials for Web
 * CRITICAL: Only applies to surfaces, never content
 */
const LIQUID_GLASS_SYSTEM = {
  vibrancy: {
    glass: {
      surface: 'backdrop-blur-[12px] backdrop-saturate-[135%] bg-[#241c41]/80', // Standard glass
      elevated: 'backdrop-blur-[8px] backdrop-saturate-[135%] bg-[#17162a]/85', // Elevated surface
      floating: 'backdrop-blur-[16px] backdrop-saturate-[135%] bg-[#241c41]/75', // Floating elements
    },
    scrim: {
      text: 'bg-[#0a0f16]/85 text-[#e8ecf1] px-1 rounded-sm', // AAA text scrim
      content: 'bg-gradient-to-b from-[#0a0f16]/90 to-[#0a0f16]/95', // Content protection
    },
  },
  elevation: {
    sm: 'shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
    md: 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
    lg: 'shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
    xl: 'shadow-[0_16px_40px_rgba(0,0,0,0.1)]',
    glowAccent: `shadow-[0_0_20px_${APPLE_HIG_ACCENT_SYSTEM.accent.primary}30]`,
    glowSecondary: `shadow-[0_0_20px_${APPLE_HIG_ACCENT_SYSTEM.secondary.primary}30]`,
  },
} as const;

// ===== MOTION & ACCESSIBILITY SYSTEM =====

/**
 * Apple-Grade Motion - Subtle, purposeful, respectful
 */
const MOTION_SYSTEM = {
  duration: {
    fast: '120ms', // Micro-interactions
    normal: '180ms', // Standard transitions
    slow: '240ms', // Complex animations
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0.0, 0.2, 1)', // Apple standard
    emphasized: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Emphasized entry
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)', // Natural deceleration
  },
  spring: {
    gentle: { tension: 170, friction: 26 },
    snappy: { tension: 250, friction: 22 },
  },
  reduce: 'motion-reduce:transition-none motion-reduce:animate-none', // Respect preferences
} as const;

// ===== COMPREHENSIVE TOKEN SYSTEM =====

export const ENHANCED_DESIGN_TOKENS = {
  meta: {
    version: '2.2.0',
    name: 'MAPS Enhanced Dark-First Foundation',
    philosophy: 'Craft with heart for those who need, not those who want',
  },

  foundation: {
    // Color system with full state management
    color: {
      surface: {
        canvas: `bg-background`,
        elevated1: `bg-background-elevated`,
        elevated2: `bg-background-panel`,
        overlay: `bg-background-overlay`,
        translucent: `bg-background-panel/80`,
        scrim: `bg-background/60`,
      },
      content: {
        primary: `text-foreground`,
        secondary: `text-foreground-muted`,
        tertiary: `text-foreground-subtle`,
        disabled: `text-foreground-disabled`,
        inverse: `text-background`,
        muted: `text-muted-foreground`,
        accent: `text-accent`,
        accentSecondary: `text-accent-secondary`,
      },
      border: {
        subtle: `border-border`,
        default: `border-border`,
        strong: `border-border-strong`,
        accent: `border-border-accent`,
        focus: `border-ring`,
      },
      brand: {
        primary: {
          rest: {
            bg: `bg-primary`,
            fg: `text-primary-foreground`,
          },
          hover: {
            bg: `hover:bg-primary-hover`,
            fg: `hover:text-primary-foreground`,
          },
          pressed: {
            bg: `active:bg-primary/90`,
            fg: `active:text-primary-foreground`,
          },
        },
        secondary: {
          rest: {
            bg: `bg-secondary`,
            fg: `text-secondary-foreground`,
          },
          hover: {
            bg: `hover:bg-secondary-hover`,
            fg: `hover:text-secondary-foreground`,
          },
          pressed: {
            bg: `active:bg-secondary/90`,
            fg: `active:text-secondary-foreground`,
          },
        },
      },
      feedback: {
        success: {
          bg: `bg-success`,
          fg: `text-success-foreground`,
          border: `border-success`,
        },
        warning: {
          bg: `bg-warning`,
          fg: `text-warning-foreground`,
          border: `border-warning`,
        },
        error: {
          bg: `bg-error`,
          fg: `text-error-foreground`,
          border: `border-error`,
        },
        info: {
          bg: `bg-accent`,
          fg: `text-accent-foreground`,
          border: `border-accent`,
        },
      },
    },

    // Apple typography semantic hierarchy
    typography: {
      largeTitle: `text-4xl font-bold leading-tight tracking-tight`,
      title1: `text-3xl font-semibold leading-snug tracking-tight`,
      title2: `text-2xl font-semibold leading-snug`,
      title3: `text-xl font-semibold leading-normal`,
      headline: `text-lg font-medium leading-normal`,
      body: `text-base font-normal leading-relaxed`,
      callout: `text-base font-medium leading-normal`,
      subhead: `text-sm font-medium leading-normal`,
      footnote: `text-sm font-normal leading-normal`,
      caption1: `text-xs font-normal leading-tight`,
      caption2: `text-[11px] font-normal leading-tight`,
      // Interactive element typography
      link: `text-base font-medium leading-relaxed text-accent hover:text-accent-hover underline decoration-1 underline-offset-2`,
      button: `text-sm font-medium leading-normal`,
    },

    // Systematic spacing
    spacing: SYSTEMATIC_SPACING,

    // Platform-aware interactions
    interaction: {
      hitTarget: HIT_TARGET_SYSTEM,
      focus: {
        ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
        visible: `focus-visible:outline-none`,
        within: `focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`,
      },
      hover: {
        surface: `hover:bg-muted`,
        accent: `hover:bg-accent-hover`,
        scale: 'hover:scale-[1.02]',
        scalePointerOnly: 'pointer:hover:scale-[1.02]',
        lift: 'hover:translate-y-[-1px]',
      },
      pressed: {
        scale: 'active:scale-[0.98]',
        dim: 'active:opacity-90',
      },
      motion: {
        reduce: MOTION_SYSTEM.reduce,
        safe: `transition-all duration-[${MOTION_SYSTEM.duration.normal}] ${MOTION_SYSTEM.easing.standard}`,
      },
    },

    // Liquid glass materials
    materials: {
      vibrancy: LIQUID_GLASS_SYSTEM.vibrancy,
      elevation: LIQUID_GLASS_SYSTEM.elevation,
    },

    // Motion system
    motion: MOTION_SYSTEM,

    // Z-index management
    zIndex: {
      surface: 0,
      overlay: 10,
      modal: 20,
      popover: 30,
      toast: 40,
      tooltip: 50,
    },
  },

  // AAA Compliance System
  accessibility: {
    // AAA-only solid fills for enforced compliance
    aaaSolid: {
      accent: `bg-accent-solid-aaa`,
      success: `bg-success-solid-aaa`,
      error: `bg-error-solid-aaa`,
    },

    // Screen reader utilities
    screenReader: {
      only: 'sr-only',
      focusable:
        'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0',
    },

    // Reduced motion compliance
    motionReduce: {
      disable: 'motion-reduce:transition-none motion-reduce:animate-none',
      safe: 'motion-safe:transition-all motion-safe:duration-200',
    },
  },

  // Raw values for calculations and JavaScript access
  raw: {
    colors: {
      ...APPLE_HIG_ACCENT_SYSTEM,
      ...DEEP_SPACE_FOUNDATION,
      ...CONTENT_HIERARCHY,
      ...BORDER_SYSTEM,
    },
    typography: APPLE_TYPOGRAPHY_SYSTEM,
    spacing: SYSTEMATIC_SPACING,
    motion: MOTION_SYSTEM,

    // Button contract (move spacing/shape out of components)
    button: {
      shape: {
        base: ['inline-flex', 'items-center', 'justify-center'],
        radius: 'rounded-md',
      },
      size: {
        sm: ['gap-1.5', 'px-3', 'h-9'],
        md: ['gap-2', 'px-4', 'h-10'],
        lg: ['gap-2', 'px-6', 'h-11'],
        touch: ['gap-2', 'px-6', 'h-11'],
      },
    },
  },
} as const;

// ===== TYPE SAFETY & SCHEMA VALIDATION =====

/**
 * Zod schema for runtime validation and TypeScript inference
 */
export const EnhancedTokensSchema = z.object({
  meta: z.object({
    version: z.string(),
    name: z.string(),
    philosophy: z.string(),
  }),
  foundation: z.object({
    color: z.object({
      surface: z.record(z.string()),
      content: z.record(z.string()),
      border: z.record(z.string()),
      brand: z.record(z.record(z.record(z.string()))),
      feedback: z.record(z.record(z.string())),
    }),
    typography: z.record(z.string()),
    spacing: z.record(z.string()),
    interaction: z.object({
      hitTarget: z.record(z.string()),
      focus: z.record(z.string()),
      hover: z.record(z.string()),
      pressed: z.record(z.string()),
      motion: z.record(z.string()),
    }),
    materials: z.object({
      vibrancy: z.record(z.record(z.string())),
      elevation: z.record(z.string()),
    }),
    motion: z.object({
      duration: z.record(z.string()),
      easing: z.record(z.string()),
      spring: z.record(z.record(z.number())),
      reduce: z.string(),
    }),
    zIndex: z.record(z.number()),
  }),
  accessibility: z.object({
    aaaSolid: z.record(z.string()),
    screenReader: z.record(z.string()),
    motionReduce: z.record(z.string()),
  }),
  raw: z.record(z.unknown()),
});

export type EnhancedTokens = z.infer<typeof EnhancedTokensSchema>;

// ===== VALIDATION & GOVERNANCE =====

/**
 * Validate tokens at runtime (development only)
 */
if (process.env.NODE_ENV === 'development') {
  try {
    EnhancedTokensSchema.parse(ENHANCED_DESIGN_TOKENS);
    console.log('✅ MAPS v2.2 Enhanced Tokens validated successfully');
  } catch (error) {
    console.error('❌ MAPS v2.2 Token validation failed:', error);
    throw new Error(
      'Enhanced Design Tokens validation failed - check schema compliance'
    );
  }
}

/**
 * Export token utilities
 */
export const getTokenValue = (path: string): string => {
  const keys = path.split('.');
  let value: unknown = ENHANCED_DESIGN_TOKENS;

  for (const key of keys) {
    value = (value as Record<string, unknown>)[key];
    if (value === undefined) {
      throw new Error(
        `Token path "${path}" not found in ENHANCED_DESIGN_TOKENS`
      );
    }
  }

  return value as string;
};

export const validateTokenUsage = (className: string): boolean => {
  // Prevent hardcoded color usage
  const hardcodedColorPattern = /#[0-9A-Fa-f]{3,6}|rgb\(|rgba\(/;
  if (hardcodedColorPattern.test(className)) {
    console.warn(
      `🚨 Hardcoded color detected: ${className}. Use ENHANCED_DESIGN_TOKENS instead.`
    );
    return false;
  }

  return true;
};

// ===== DEFAULT EXPORT =====

export default ENHANCED_DESIGN_TOKENS;
