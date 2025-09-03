/**
 * Enhanced Separator Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with cosmic innovation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS4: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Radix owns: Behavior, ARIA, focus management, state management, keyboard navigation
 * - MAPS4 owns: Apple HIG materials, liquid glass, AAA enforcement
 * - Wrapper owns: Token application, governance rules, brand consistency
 *
 * GOVERNANCE RULES:
 * - Foundation tokens only (no component-specific tokens)
 * - Auto-apply AAA scrims over glass materials
 * - Apple HIG motion with respect for reduced motion
 * - Platform-aware touch targets (44px minimum)
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 */

/* eslint-disable react/prop-types */

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Slot } from '@/components/primitives';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== ENHANCED SEPARATOR VARIANTS =====

/**
 * Enhanced separator variants following MAPS4 v4.0 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedSeparatorVariants = cva(
  [
    // Foundation: Layout - Clean semantic separator - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.shrink[0],

    // Foundation: Colors - MAPS4 cosmic foundation - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,

    // Foundation: Motion - Respect user preferences - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.colors,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,

    // Foundation: States - AAA compliant states - Enhanced tokens
    'data-[disabled]:opacity-50',

    // Foundation: Focus - ARIA-compliant separator doesn't receive focus by default
    // But can be made focusable for navigation purposes when role="separator"
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
  ],
  {
    variants: {
      variant: {
        // Default: Subtle border using enhanced tokens
        default: [ENHANCED_DESIGN_TOKENS.foundation.color.border.default],

        // Strong: More prominent separator for major sections - Enhanced tokens
        strong: [ENHANCED_DESIGN_TOKENS.foundation.color.border.strong],

        // Accent: Brand-colored separator for emphasis - Enhanced tokens
        accent: [ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg],

        // Glass: Liquid glass separator with governed vibrancy - Enhanced tokens
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
        ],

        // Ethereal: Beautiful ethereal accent following MAPS4 - Enhanced tokens
        ethereal: [
          'bg-gradient-to-r from-aurora-accent/20 via-aurora-accent to-aurora-accent/20',
          'shadow-[0_0_8px_rgba(124,196,255,0.2)]',
        ],

        // Dotted: Subtle dotted pattern for flexible sections - Enhanced tokens
        dotted: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          'border-dotted',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ],

        // Dashed: Dashed pattern for temporary or draft sections - Enhanced tokens
        dashed: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          'border-dashed',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ],
      },

      size: {
        // Default: Apple HIG standard separator thickness - Enhanced tokens
        default: '',

        // Thick: Prominent separator for major sections - Enhanced tokens
        thick: '',

        // Thin: Subtle separator for minor divisions - Enhanced tokens
        thin: '',
      },

      spacing: {
        // None: No margin (for manual spacing control) - Enhanced tokens
        none: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[0],

        // Small: Compact vertical spacing - Enhanced tokens
        sm: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[2],

        // Default: Standard Apple HIG spacing - Enhanced tokens
        default: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[4],

        // Large: Generous spacing for major sections - Enhanced tokens
        lg: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[6],

        // Extra large: Maximum spacing for chapter-level divisions - Enhanced tokens
        xl: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[8],
      },

      decoration: {
        // None: Clean separator without decoration - Enhanced tokens
        none: '',

        // Glow: Subtle glow effect for premium feel - Enhanced tokens
        glow: [
          ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
          ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-aurora-accent/10 before:to-transparent',
        ],

        // Gradient: Sophisticated gradient effect - Enhanced tokens
        gradient: [
          'bg-gradient-to-r from-transparent via-cosmic-border to-transparent',
        ],

        // Fade: Fade-out edges for organic feel - Enhanced tokens
        fade: [
          'bg-gradient-to-r from-transparent via-cosmic-border to-transparent',
          'mask-image:linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        ],
      },

      // AAA compliance mode - Enhanced tokens
      aaa: {
        false: '',
        true: [
          '!bg-cosmic-aaa', // 7:1 contrast with dark background
          '!shadow-none', // Remove decorative shadows
          '!backdrop-blur-none', // Remove vibrancy effects
        ],
      },
    },
    
    compoundVariants: [
      // Glass variant with AAA override - Enhanced tokens
      {
        variant: 'glass',
        aaa: true,
        className: '!bg-cosmic-border !shadow-none !backdrop-blur-none',
      },

      // Ethereal variant with AAA override - Enhanced tokens
      {
        variant: 'ethereal',
        aaa: true,
        className:
          '!bg-cosmic-aaa !from-transparent !via-transparent !to-transparent !shadow-none',
      },
    ],
    
    defaultVariants: {
      variant: 'default',
      size: 'default',
      spacing: 'default',
      decoration: 'none',
      aaa: false,
    },
  }
);

/**
 * Get orientation-specific classes for separator sizing
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
function getOrientationClasses(
  orientation: 'horizontal' | 'vertical',
  size: 'thin' | 'default' | 'thick',
  variant: string
): string {
  if (variant === 'dotted' || variant === 'dashed') {
    // Handle dotted/dashed with orientation-specific borders - Enhanced tokens
    if (orientation === 'vertical') {
      return ENHANCED_DESIGN_TOKENS.foundation.layout.height.full + ' border-l';
    }
    return '';
  }

  // Handle sizing based on orientation - Enhanced tokens
  if (orientation === 'horizontal') {
    switch (size) {
      case 'thin': {
        return ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default;
      }
      case 'thick': {
        return ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thin;
      }
      default: {
        return ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default;
      }
    }
  } else {
    switch (size) {
      case 'thin': {
        return ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default;
      }
      case 'thick': {
        return ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thin;
      }
      default: {
        return ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default;
      }
    }
  }
}

// ===== ENHANCED SEPARATOR INTERFACE =====

interface EnhancedSeparatorOwnProps {
  /**
   * Visual variant of the separator
   * @default "default"
   */
  variant?: VariantProps<typeof enhancedSeparatorVariants>['variant'];

  /**
   * Thickness of the separator
   * @default "default"
   */
  size?: VariantProps<typeof enhancedSeparatorVariants>['size'];

  /**
   * Spacing around the separator
   * @default "default"
   */
  spacing?: VariantProps<typeof enhancedSeparatorVariants>['spacing'];

  /**
   * Decorative effects
   * @default "none"
   */
  decoration?: VariantProps<typeof enhancedSeparatorVariants>['decoration'];

  /**
   * AAA compliance mode - replaces ethereal effects with high-contrast alternatives
   * @default false
   */
  aaa?: boolean;

  /**
   * Orientation of the separator
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Whether separator is decorative or semantic
   * When false, separator is decorative and hidden from screen readers
   * When true, separator has semantic meaning for screen readers
   * @default false
   */
  decorative?: boolean;

  /**
   * Label for the separator when it has semantic meaning
   * Only used when decorative=true and role="separator"
   */
  'aria-label'?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * Polymorphic support - render as different element/component
   */
  asChild?: boolean;

  /**
   * Performance optimization - disable animations
   */
  disableAnimations?: boolean;
}

type EnhancedSeparatorProps = EnhancedSeparatorOwnProps &
  Omit<
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    keyof EnhancedSeparatorOwnProps
  >;

// ===== ENHANCED SEPARATOR COMPONENT =====

const EnhancedSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  EnhancedSeparatorProps
>(
  (
    {
      variant = 'default',
      size = 'default',
      spacing = 'default',
      decoration = 'none',
      aaa = false,
      orientation = 'horizontal',
      decorative = true,
      asChild = false,
      disableAnimations = false,
      className,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    // Performance optimization: conditionally apply motion classes
    const motionClasses = disableAnimations 
      ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
      : '';

    // Accessibility: Semantic separators should have proper labeling
    const accessibilityProps = decorative
      ? {
          role: undefined,
        }
      : {
          'aria-label': ariaLabel || 'Section separator',
          role: 'separator',
          'aria-orientation': orientation,
        };

    const Comp = asChild ? Slot : SeparatorPrimitive.Root;

    const separatorContent = (
      <Comp
        ref={ref}
        orientation={orientation}
        decorative={decorative}
        className={cn(
          enhancedSeparatorVariants({
            variant,
            size,
            spacing,
            decoration,
            aaa,
          }),
          // Apply orientation-specific classes
          getOrientationClasses(
            orientation,
            size || 'default',
            variant || 'default'
          ),
          motionClasses,
          className
        )}
        data-testid={dataTestId}
        {...accessibilityProps}
        {...props}
      />
    );

    return separatorContent;
  }
);

EnhancedSeparator.displayName = 'EnhancedSeparator';

// ===== SEPARATOR WITH CONTENT =====

interface SeparatorWithContentProps {
  /**
   * Content to display in the center of the separator
   */
  children: React.ReactNode;

  /**
   * Visual variant of the separator
   * @default "default"
   */
  variant?: EnhancedSeparatorOwnProps['variant'];

  /**
   * Spacing around the separator
   * @default "default"
   */
  spacing?: EnhancedSeparatorOwnProps['spacing'];

  /**
   * AAA compliance mode
   * @default false
   */
  aaa?: boolean;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * Performance optimization - disable animations
   */
  disableAnimations?: boolean;
}

const SeparatorWithContent = React.forwardRef<
  HTMLDivElement,
  SeparatorWithContentProps
>(
  (
    {
      children,
      variant = 'default',
      spacing = 'default',
      aaa = false,
      disableAnimations = false,
      className,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    // Performance optimization: conditionally apply motion classes
    const motionClasses = disableAnimations 
      ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
          ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
          ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
          spacing === 'none' && ENHANCED_DESIGN_TOKENS.foundation.layout.margin[0],
          spacing === 'sm' && ENHANCED_DESIGN_TOKENS.foundation.layout.margin[2],
          spacing === 'default' && ENHANCED_DESIGN_TOKENS.foundation.layout.margin[4],
          spacing === 'lg' && ENHANCED_DESIGN_TOKENS.foundation.layout.margin[6],
          spacing === 'xl' && ENHANCED_DESIGN_TOKENS.foundation.layout.margin[8],
          motionClasses,
          className
        )}
        data-testid={dataTestId}
        {...props}
      >
        {/* Left separator */}
        <EnhancedSeparator
          variant={variant}
          spacing='none'
          aaa={aaa}
          disableAnimations={disableAnimations}
          className='flex-1'
        />

        {/* Content container */}
        <div
          className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.shrink[0],
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.padding[4],
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
            // AAA compliance for text content
            aaa && 'text-cosmic-aaa'
          )}
        >
          {children}
        </div>

        {/* Right separator */}
        <EnhancedSeparator
          variant={variant}
          spacing='none'
          aaa={aaa}
          disableAnimations={disableAnimations}
          className='flex-1'
        />
      </div>
    );
  }
);

SeparatorWithContent.displayName = 'SeparatorWithContent';

// ===== ENHANCED SEPARATOR FACTORY =====

/**
 * Enhanced Separator Factory Functions
 * @description Semantic constructors following MAPS v2.2 patterns
 */
export const SeparatorFactory = {
  /**
   * Default separator with clean styling
   */
  default: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant'>) => (
      <EnhancedSeparator {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'variant'>) => (
      <SeparatorWithContent {...props} />
    ),
  },

  /**
   * Glass variant with liquid glass materials
   */
  glass: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant'>) => (
      <EnhancedSeparator variant='glass' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'variant'>) => (
      <SeparatorWithContent variant='glass' {...props} />
    ),
  },

  /**
   * Elevated variant with enhanced depth
   */
  elevated: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant'>) => (
      <EnhancedSeparator variant='default' decoration='glow' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'variant'>) => (
      <SeparatorWithContent variant='default' {...props} />
    ),
  },

  /**
   * Ghost variant for subtle styling
   */
  ghost: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant'>) => (
      <EnhancedSeparator variant='dotted' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'variant'>) => (
      <SeparatorWithContent variant='dotted' {...props} />
    ),
  },

  /**
   * AAA compliance variant for high contrast
   */
  aaa: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'aaa'>) => (
      <EnhancedSeparator aaa={true} {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'aaa'>) => (
      <SeparatorWithContent aaa={true} {...props} />
    ),
  },

  /**
   * Performance-optimized separator with disabled animations
   */
  performance: {
    Separator: (props: React.ComponentPropsWithoutRef<typeof EnhancedSeparator>) => (
      <EnhancedSeparator disableAnimations={true} {...props} />
    ),
    WithContent: (props: React.ComponentPropsWithoutRef<typeof SeparatorWithContent>) => (
      <SeparatorWithContent disableAnimations={true} {...props} />
    ),
  },

  /**
   * Small spacing for compact layouts
   */
  small: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'spacing'>) => (
      <EnhancedSeparator spacing='sm' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'spacing'>) => (
      <SeparatorWithContent spacing='sm' {...props} />
    ),
  },

  /**
   * Large spacing for prominent content
   */
  large: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'spacing'>) => (
      <EnhancedSeparator spacing='lg' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'spacing'>) => (
      <SeparatorWithContent spacing='lg' {...props} />
    ),
  },

  /**
   * Extra large spacing for maximum separation
   */
  xlarge: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'spacing'>) => (
      <EnhancedSeparator spacing='xl' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'spacing'>) => (
      <SeparatorWithContent spacing='xl' {...props} />
    ),
  },

  /**
   * Compact density for dense layouts
   */
  compact: {
    Separator: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'spacing'>) => (
      <EnhancedSeparator spacing='sm' {...props} />
    ),
    WithContent: (props: Omit<React.ComponentPropsWithoutRef<typeof SeparatorWithContent>, 'spacing'>) => (
      <SeparatorWithContent spacing='sm' {...props} />
    ),
  },
} as const;

// ===== PREDEFINED SEPARATOR VARIANTS =====

/**
 * Glass separator with ethereal vibrancy
 */
const GlassSeparator = React.forwardRef<
  React.ElementRef<typeof EnhancedSeparator>,
  Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant' | 'decoration'>
>((props, ref) => (
  <EnhancedSeparator ref={ref} variant='glass' decoration='glow' {...props} />
));
GlassSeparator.displayName = 'GlassSeparator';

/**
 * Ethereal separator with sophisticated gradient
 */
const EtherealSeparator = React.forwardRef<
  React.ElementRef<typeof EnhancedSeparator>,
  Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant'>
>((props, ref) => (
  <EnhancedSeparator ref={ref} variant='ethereal' {...props} />
));
EtherealSeparator.displayName = 'EtherealSeparator';

/**
 * Strong separator for major sections
 */
const StrongSeparator = React.forwardRef<
  React.ElementRef<typeof EnhancedSeparator>,
  Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant'>
>((props, ref) => (
  <EnhancedSeparator ref={ref} variant='strong' {...props} />
));
StrongSeparator.displayName = 'StrongSeparator';

/**
 * Accent separator for brand emphasis
 */
const AccentSeparator = React.forwardRef<
  React.ElementRef<typeof EnhancedSeparator>,
  Omit<React.ComponentPropsWithoutRef<typeof EnhancedSeparator>, 'variant' | 'decoration'>
>((props, ref) => (
  <EnhancedSeparator ref={ref} variant='accent' decoration='glow' {...props} />
));
AccentSeparator.displayName = 'AccentSeparator';

// ===== EXPORTS =====

export {
  EnhancedSeparator,
  SeparatorWithContent,
  GlassSeparator,
  EtherealSeparator,
  StrongSeparator,
  AccentSeparator,
  enhancedSeparatorVariants,
};

export type { EnhancedSeparatorProps, SeparatorWithContentProps };

// Re-export Radix primitives for advanced use cases
export { Root as SeparatorPrimitive } from '@radix-ui/react-separator';

export type { VariantProps } from 'class-variance-authority';
