/**
 * Cluster - Horizontal Spacing Primitive
 *
 * Horizontal layout component for inline content with consistent spacing, wrapping, and alignment using MAPS spacing tokens.
 *
 * DESIGN PRINCIPLES:
 * - Essential Primitives Only: Focus on core layout building blocks that enable 95% of layout patterns
 * - MAPS v3.0 Governance: All components styled through ENHANCED_DESIGN_TOKENS with runtime governance
 * - Performance First: Zero-layout-shift design with proper spacing primitives
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

const clusterVariants = cva([
  ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
], {
  variants: {
    // Spacing Control - using Tailwind's gap utilities
    gap: {
      none: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.none,
      xs: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs,
      sm: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
      md: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
      lg: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg,
      xl: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl,
      '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['2xl'],
    },

    gapX: {
      none: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.none,
      xs: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.xs,
      sm: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.sm,
      md: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.md,
      lg: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.lg,
      xl: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.xl,
      '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster['2xl'],
    },

    gapY: {
      none: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.none,
      xs: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xs,
      sm: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm,
      md: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md,
      lg: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg,
      xl: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl,
      '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl'],
    },

    // Flex Behavior
    wrap: {
      wrap: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.wrap,
      nowrap: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.nowrap,
      'wrap-reverse': ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap['wrap-reverse'],
    },

    align: {
      start: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start,
      center: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
      end: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.end,
      baseline: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.baseline,
      stretch: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.stretch,
    },

    justify: {
      start: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.start,
      center: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center,
      end: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.end,
      between: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between,
      around: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.around,
      evenly: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.evenly,
    },

    // Direction Control
    direction: {
      row: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
      'row-reverse': ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction['row-reverse'],
    },
  },
  defaultVariants: {
    gap: 'md',
    wrap: 'wrap',
    align: 'center',
    justify: 'start',
    direction: 'row',
  },
});

// ===== TYPES =====

export interface ClusterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof clusterVariants> {
  // Semantic HTML
  as?: 'div' | 'nav' | 'ul' | 'ol' | 'span';
  asChild?: boolean;

  // Responsive Behavior
  responsive?: {
    sm?: Partial<
      Pick<
        ClusterProps,
        'gap' | 'gapX' | 'gapY' | 'align' | 'justify' | 'direction' | 'wrap'
      >
    >;
    md?: Partial<
      Pick<
        ClusterProps,
        'gap' | 'gapX' | 'gapY' | 'align' | 'justify' | 'direction' | 'wrap'
      >
    >;
    lg?: Partial<
      Pick<
        ClusterProps,
        'gap' | 'gapX' | 'gapY' | 'align' | 'justify' | 'direction' | 'wrap'
      >
    >;
  };

  children: React.ReactNode;
}

// ===== COMPONENT =====

export const Cluster = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ClusterProps
>(
  (
    {
      className,
      gap,
      gapX,
      gapY,
      wrap,
      align,
      justify,
      direction,
      as = 'div',
      asChild = false,
      responsive,
      children,
      ...props
    },
    ref
  ) => {
    // Build responsive classes
    const responsiveClasses = responsive
      ? Object.entries(responsive)
          .map(([breakpoint, config]) => {
            const prefix = breakpoint === 'sm' ? 'sm:' : (breakpoint === 'md' ? 'md:' : 'lg:');
            const classes: string[] = [];

            const gapMap: Record<string, string> = {
              none: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.none,
              xs: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs,
              sm: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
              md: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
              lg: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg,
              xl: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl,
              '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['2xl'],
            } as const;

            const gapXMap: Record<string, string> = {
              none: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.none,
              xs: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.xs,
              sm: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.sm,
              md: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.md,
              lg: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.lg,
              xl: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.xl,
              '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster['2xl'],
            } as const;

            const gapYMap: Record<string, string> = {
              none: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.none,
              xs: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xs,
              sm: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm,
              md: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md,
              lg: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg,
              xl: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl,
              '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl'],
            } as const;

            const alignMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items as Record<string, string>;
            const justifyMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify as Record<string, string>;
            const dirMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction as Record<string, string>;
            const wrapMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap as Record<string, string>;

            if (config.gap) classes.push(prefix + gapMap[config.gap]);
            if (config.gapX) classes.push(prefix + gapXMap[config.gapX]);
            if (config.gapY) classes.push(prefix + gapYMap[config.gapY]);
            if (config.align) classes.push(prefix + alignMap[config.align]);
            if (config.justify) classes.push(prefix + justifyMap[config.justify]);
            if (config.direction) classes.push(prefix + dirMap[config.direction]);
            if (config.wrap) classes.push(prefix + wrapMap[config.wrap]);

            return classes.join(' ');
          })
          .join(' ')
      : '';

    const combinedClassName = cn(
      clusterVariants({
        gap: gapX || gapY ? undefined : gap,
        gapX,
        gapY,
        wrap,
        align,
        justify,
        direction,
      }),
      responsiveClasses,
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

Cluster.displayName = 'Cluster';
