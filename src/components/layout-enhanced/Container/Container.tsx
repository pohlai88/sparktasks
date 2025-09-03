/**
 * Container - Foundation Layout Primitive
 *
 * Semantic layout containers with MAPS-governed max-width constraints, spacing, and responsive behavior.
 *
 * DESIGN PRINCIPLES:
 * - Essential Primitives Only: Core layout building blocks that enable 95% of layout patterns
 * - MAPS v3.0 Governance: All components styled through ENHANCED_DESIGN_TOKENS with runtime governance
 * - Container Query Ready: Modern responsive design with container queries for component-level responsiveness
 * - Performance First: Zero-layout-shift design with proper spacing primitives and content-aware containers
 * - Accessibility Excellence: Screen reader friendly layout patterns with proper semantic structure
 * - Developer Experience: Intuitive APIs that make complex layouts simple to implement
 */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { forwardRef } from 'react';

import { cn } from '../../../utils/cn';
import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';

// ===== VARIANTS =====

const containerVariants = cva([
  ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
  ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
], {
  variants: {
    // Size Constraints based on MAPS design tokens
    size: {
      xs: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-sm'],
      sm: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-md'],
      md: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-lg'],
      lg: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-2xl'],
      xl: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-4xl'],
      '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-6xl'],
      full: ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
      content: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-2xl'],
      prose: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-3xl'],
    },

    // Spacing Control using Tailwind spacing scale
    spacing: {
      none: 'px-0',
      xs: 'px-1',
      sm: 'px-2 sm:px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-6 sm:px-8',
      xl: 'px-8 sm:px-12',
      '2xl': 'px-12 sm:px-16',
    },

    spacingX: {
      none: 'px-0',
      xs: 'px-1',
      sm: 'px-2 sm:px-4',
      md: 'px-4 sm:px-6',
      lg: 'px-6 sm:px-8',
      xl: 'px-8 sm:px-12',
      '2xl': 'px-12 sm:px-16',
    },

    spacingY: {
      none: 'py-0',
      xs: 'py-1',
      sm: 'py-2 sm:py-4',
      md: 'py-4 sm:py-6',
      lg: 'py-6 sm:py-8',
      xl: 'py-8 sm:py-12',
      '2xl': 'py-12 sm:py-16',
    },

    // Alignment
    center: {
      true: ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
      false: '',
    },

    centerContent: {
      true: cn(
        ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
        ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.col,
        ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.center,
      ),
      false: '',
    },

    // Responsive Behavior
    fluid: {
      true: ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
      false: '',
    },

    // MAPS Integration - Surface variants
    surface: {
      canvas: ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
      elevated: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
      glass: cn(
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
        ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
      ),
      panel: ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
    },
  },
  defaultVariants: {
    size: 'lg',
    spacing: 'md',
    center: false,
    centerContent: false,
    fluid: false,
  },
});

// ===== TYPES =====

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  // Semantic Layout
  as?: 'div' | 'main' | 'section' | 'article' | 'aside' | 'header' | 'footer';
  asChild?: boolean; // Polymorphic component support

  // Responsive Behavior
  breakout?: boolean; // Allow content to break out of container

  children: React.ReactNode;
}

// ===== COMPONENT =====

export const Container = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ContainerProps
>(
  (
    {
      className,
      size,
      spacing,
      spacingX,
      spacingY,
      center,
      centerContent,
      fluid,
      surface,
      as = 'div',
      asChild = false,
      breakout = false,
      children,
      ...props
    },
    ref
  ) => {
    const combinedClassName = cn(
      containerVariants({
        size,
        spacing: spacingX || spacingY ? undefined : spacing,
        spacingX,
        spacingY,
        center,
        centerContent,
        fluid,
        surface,
      }),
      breakout && 'container-breakout',
      className
    );

    if (asChild) {
      return (
        <Slot className={combinedClassName} {...props}>
          {children}
        </Slot>
      );
    }

    const Comp = as as React.ElementType;

    return (
      <Comp ref={ref} className={combinedClassName} {...props}>
        {children}
      </Comp>
    );
  }
);

Container.displayName = 'Container';
