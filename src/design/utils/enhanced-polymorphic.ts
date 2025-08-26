/**
 * Enhanced Polymorphic Component Factory - MAPS v2.2 Dark-First System
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - Namespace protection: enhanced- prefix mandatory
 * - SSOT compliance: ENHANCED_DESIGN_TOKENS only
 * - Dark-first foundation: CSS custom properties
 * - Apple HIG compliance: Built-in accessibility patterns
 * - Type safety: Strict TypeScript interfaces
 *
 * RESOLUTION MODEL:
 * - Semantic naming: No color literals allowed
 * - 8pt grid system: Systematic spacing only
 * - Platform awareness: Touch vs mouse interactions
 *
 * MATERIALS & VIBRANCY:
 * - Surface-only vibrancy: Content never blurred
 * - Backdrop governance: Controlled opacity layers
 * - Motion respect: Reduced motion compliance
 *
 * INPUT RULES:
 * - 44px minimum touch targets
 * - Focus management: Ring-based system
 * - Keyboard navigation: ARIA compliant
 *
 * NON-NEGOTIABLE GUARDRAILS:
 * - No hardcoded colors: Token references only
 * - No arbitrary spacing: 8pt grid compliance
 * - No accessibility shortcuts: WCAG AAA target
 */

import { cva } from 'class-variance-authority';
import React from 'react';

import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== ENHANCED POLYMORPHIC TYPES =====

/**
 * Enhanced polymorphic component with MAPS v2.2 foundation
 */
export type EnhancedPolymorphicProps<
  C extends React.ElementType,
  Props = Record<string, never>,
> = React.PropsWithChildren<Props & { as?: C }> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof (Props & { as?: C })>;

/**
 * Enhanced ref type with proper element inference
 */
export type EnhancedPolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

// ===== MAPS v2.2 FOUNDATION VARIANTS =====

/**
 * Core surface variants following dark-first philosophy
 */
export const surfaceVariants = cva('', {
  variants: {
    surface: {
      canvas: ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
      elevated1: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated1,
      elevated2: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2,
      overlay: ENHANCED_DESIGN_TOKENS.foundation.color.surface.overlay,
      translucent: ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
      scrim: ENHANCED_DESIGN_TOKENS.foundation.color.surface.scrim,
    },
    content: {
      primary: ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
      secondary: ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
      tertiary: ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
      disabled: ENHANCED_DESIGN_TOKENS.foundation.color.content.disabled,
      inverse: ENHANCED_DESIGN_TOKENS.foundation.color.content.inverse,
      muted: ENHANCED_DESIGN_TOKENS.foundation.color.content.muted,
      accent: ENHANCED_DESIGN_TOKENS.foundation.color.content.accent,
      accentSecondary:
        ENHANCED_DESIGN_TOKENS.foundation.color.content.accentSecondary,
    },
    border: {
      subtle: ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
      default: ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
      strong: ENHANCED_DESIGN_TOKENS.foundation.color.border.strong,
      accent: ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
      focus: ENHANCED_DESIGN_TOKENS.foundation.color.border.focus,
    },
  },
  defaultVariants: {
    surface: 'canvas',
    content: 'primary',
    border: 'subtle',
  },
});

/**
 * Typography variants following Apple semantic hierarchy
 */
export const typographyVariants = cva('', {
  variants: {
    typography: {
      largeTitle: ENHANCED_DESIGN_TOKENS.foundation.typography.largeTitle,
      title1: ENHANCED_DESIGN_TOKENS.foundation.typography.title1,
      title2: ENHANCED_DESIGN_TOKENS.foundation.typography.title2,
      title3: ENHANCED_DESIGN_TOKENS.foundation.typography.title3,
      headline: ENHANCED_DESIGN_TOKENS.foundation.typography.headline,
      body: ENHANCED_DESIGN_TOKENS.foundation.typography.body,
      callout: ENHANCED_DESIGN_TOKENS.foundation.typography.callout,
      subhead: ENHANCED_DESIGN_TOKENS.foundation.typography.subhead,
      footnote: ENHANCED_DESIGN_TOKENS.foundation.typography.footnote,
      caption1: ENHANCED_DESIGN_TOKENS.foundation.typography.caption1,
      caption2: ENHANCED_DESIGN_TOKENS.foundation.typography.caption2,
      link: ENHANCED_DESIGN_TOKENS.foundation.typography.link,
      button: ENHANCED_DESIGN_TOKENS.foundation.typography.button,
    },
  },
  defaultVariants: {
    typography: 'body',
  },
});

/**
 * Interaction variants with Apple HIG compliance
 */
export const interactionVariants = cva('', {
  variants: {
    hitTarget: {
      base: ENHANCED_DESIGN_TOKENS.foundation.interaction.hitTarget.base,
      desktop: ENHANCED_DESIGN_TOKENS.foundation.interaction.hitTarget.desktop,
      large: ENHANCED_DESIGN_TOKENS.foundation.interaction.hitTarget.large,
      compact: ENHANCED_DESIGN_TOKENS.foundation.interaction.hitTarget.compact,
    },
    focus: {
      ring: ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
      visible: ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.visible,
      within: ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.within,
    },
    hover: {
      surface: ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      accent: ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.accent,
      scale: ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.scale,
      lift: ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.lift,
    },
    pressed: {
      scale: ENHANCED_DESIGN_TOKENS.foundation.interaction.pressed.scale,
      dim: ENHANCED_DESIGN_TOKENS.foundation.interaction.pressed.dim,
    },
    motion: {
      reduce: ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.reduce,
      safe: ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
    },
  },
  defaultVariants: {
    hitTarget: 'base',
    focus: 'visible',
    hover: 'surface',
    pressed: 'scale',
    motion: 'safe',
  },
});

/**
 * Materials and vibrancy variants with governance
 */
export const materialsVariants = cva('', {
  variants: {
    vibrancy: {
      none: '',
      glass: ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.glass.surface,
      elevated:
        ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.glass.elevated,
      floating:
        ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.glass.floating,
    },
    elevation: {
      none: '',
      sm: ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.sm,
      md: ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.md,
      lg: ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.lg,
      xl: ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.xl,
      glowAccent:
        ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.glowAccent,
      glowSecondary:
        ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.glowSecondary,
    },
    scrim: {
      none: '',
      text: ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.scrim.text,
      content:
        ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.scrim.content,
    },
  },
  defaultVariants: {
    vibrancy: 'none',
    elevation: 'none',
    scrim: 'none',
  },
});

// ===== BRAND VARIANTS FOR INTERACTIVE ELEMENTS =====

/**
 * Brand color variants for interactive elements
 */
export const brandVariants = cva('', {
  variants: {
    variant: {
      primary: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.hover.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.pressed.bg
      ),
      secondary: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.secondary.rest.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.secondary.rest.fg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.secondary.hover.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.secondary.pressed.bg
      ),
      ghost: cn(
        'bg-transparent',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface
      ),
      outline: cn(
        'border bg-transparent',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.accent,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface
      ),
    },
    size: {
      sm: cn('h-9 px-3', ENHANCED_DESIGN_TOKENS.foundation.typography.caption1),
      md: cn('h-10 px-4', ENHANCED_DESIGN_TOKENS.foundation.typography.button),
      lg: cn('h-11 px-8', ENHANCED_DESIGN_TOKENS.foundation.typography.callout),
    },
    feedback: {
      none: '',
      success: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg
      ),
      warning: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg
      ),
      error: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg
      ),
      info: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.fg
      ),
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    feedback: 'none',
  },
});

// ===== TYPE DEFINITIONS FOR VARIANTS =====

type SurfaceVariant =
  | 'canvas'
  | 'elevated1'
  | 'elevated2'
  | 'overlay'
  | 'translucent'
  | 'scrim';
type ContentVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'muted'
  | 'accent'
  | 'accentSecondary';
type TypographyVariant =
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2'
  | 'link'
  | 'button';
type VibrancyVariant = 'none' | 'glass' | 'elevated' | 'floating';
type BrandVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

// ===== ENHANCED POLYMORPHIC FACTORY =====

/**
 * Enhanced polymorphic component factory with MAPS v2.2 foundation
 *
 * ENFORCEMENT MECHANISMS:
 * - Automatic foundation application
 * - Dark-first default styling
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 *
 * @template DefaultElement - Default HTML element type
 * @template ComponentProps - Component-specific props interface
 */
export function createEnhancedPolymorphicComponent<
  DefaultElement extends React.ElementType,
  ComponentProps = Record<string, never>,
>(
  renderFunction: <Element extends React.ElementType = DefaultElement>(
    props: EnhancedPolymorphicProps<Element, ComponentProps>,
    ref?: EnhancedPolymorphicRef<Element>
  ) => React.ReactElement | null,
  config: {
    displayName: string;
    defaultSurface?: SurfaceVariant;
    defaultContent?: ContentVariant;
    defaultTypography?: TypographyVariant;
    defaultInteraction?: boolean;
    defaultVibrancy?: VibrancyVariant;
    defaultBrand?: BrandVariant;
    enforceAccessibility?: boolean;
  }
) {
  const EnhancedComponent = React.forwardRef<unknown, unknown>((props, ref) => {
    const typedProps = props as EnhancedPolymorphicProps<
      DefaultElement,
      ComponentProps
    > & {
      className?: string;
    };

    // Apply MAPS v2.2 foundation automatically
    const enhancedProps = {
      ...typedProps,
      className: cn(
        // Foundation surface
        config.defaultSurface &&
          surfaceVariants({
            surface: config.defaultSurface,
            content: config.defaultContent || 'primary',
            border: 'subtle',
          }),

        // Foundation typography
        config.defaultTypography &&
          typographyVariants({
            typography: config.defaultTypography,
          }),

        // Foundation interactions (if component is interactive)
        config.defaultInteraction &&
          interactionVariants({
            hitTarget: 'base',
            focus: 'visible',
            motion: 'safe',
          }),

        // Foundation materials
        config.defaultVibrancy &&
          materialsVariants({
            vibrancy: config.defaultVibrancy,
          }),

        // Brand styling for interactive elements
        config.defaultBrand &&
          brandVariants({
            variant: config.defaultBrand,
          }),

        // User-provided className
        typedProps.className
      ),
    };

    return renderFunction(enhancedProps, ref);
  });

  EnhancedComponent.displayName = `Enhanced${config.displayName}`;

  return EnhancedComponent as <
    Element extends React.ElementType = DefaultElement,
  >(
    props: EnhancedPolymorphicProps<Element, ComponentProps> & {
      ref?: EnhancedPolymorphicRef<Element>;
    }
  ) => React.ReactElement | null;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Check if component should have interactive styling
 */
export function isEnhancedInteractive<P extends object>(props: P): boolean {
  return (
    ('onClick' in props && typeof props.onClick === 'function') ||
    ('href' in props && Boolean(props.href)) ||
    ('to' in props && Boolean(props.to)) ||
    ('onPress' in props && typeof props.onPress === 'function')
  );
}

/**
 * Extract ARIA props safely from enhanced component props
 */
export function extractEnhancedAriaProps<P extends Record<string, unknown>>(
  props: P
): Record<string, unknown> {
  const ariaProps: Record<string, unknown> = {};

  for (const key of Object.keys(props)) {
    if (key.startsWith('aria-') || key.startsWith('data-testid')) {
      ariaProps[key] = props[key];
    }
  }

  return ariaProps;
}

/**
 * Apply enhanced focus management automatically
 */
export function withEnhancedFocusManagement<P extends object>(
  props: P
): P & {
  className: string;
  tabIndex?: number;
  'aria-describedby'?: string;
} {
  const isInteractive = isEnhancedInteractive(props);

  return {
    ...props,
    className: cn(
      (props as { className?: string }).className,
      isInteractive &&
        interactionVariants({
          focus: 'visible',
          motion: 'safe',
        })
    ),
    tabIndex: isInteractive ? 0 : undefined,
    'aria-describedby': isInteractive
      ? `${Math.random().toString(36).slice(2, 11)}-focus-hint`
      : undefined,
  } as P & {
    className: string;
    tabIndex?: number;
    'aria-describedby'?: string;
  };
}

/**
 * Apply AAA compliance automatically when needed
 */
export function withAAACompliance(
  className: string,
  enforceAAA: boolean = false
): string {
  if (!enforceAAA) return className;

  // Replace ethereal accents with AAA-compliant versions
  return className
    .replaceAll(
      'bg-[#7cc4ff]',
      ENHANCED_DESIGN_TOKENS.accessibility.aaaSolid.accent
    )
    .replaceAll(
      'bg-[#40d6a3]',
      ENHANCED_DESIGN_TOKENS.accessibility.aaaSolid.success
    )
    .replaceAll(
      'bg-[#ff6b6b]',
      ENHANCED_DESIGN_TOKENS.accessibility.aaaSolid.error
    );
}

// ===== TYPE EXPORTS =====

export type { VariantProps } from 'class-variance-authority';
