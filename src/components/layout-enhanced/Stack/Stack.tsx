/**
 * Stack - Vertical Spacing Primitive
 *
 * Universal vertical spacing component that provides consistent gaps between child elements using MAPS spacing tokens.
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

const stackVariants = cva([
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
      '3xl': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['3xl'],
    },

    // Alignment Options
    align: {
      start: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start,
      center: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
      end: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.end,
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
      column: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.col,
      'column-reverse': ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction['col-reverse'],
    },

    // Dividers
    divider: {
      true: cn(
        ENHANCED_DESIGN_TOKENS.foundation.layout.divide.y,
        ENHANCED_DESIGN_TOKENS.foundation.layout.divide.subtle
      ),
      false: '',
    },

    dividerColor: {
      subtle: ENHANCED_DESIGN_TOKENS.foundation.layout.divide.subtle,
      muted: ENHANCED_DESIGN_TOKENS.foundation.layout.divide.subtle,
      accent: ENHANCED_DESIGN_TOKENS.foundation.layout.divide.subtleCosmic,
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    direction: 'column',
    divider: false,
    dividerColor: 'subtle',
  },
});

// ===== TYPES =====

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  // Semantic HTML
  as?: 'div' | 'section' | 'article' | 'nav' | 'ul' | 'ol';
  asChild?: boolean;

  // Responsive Behavior
  responsive?: {
    sm?: Partial<Pick<StackProps, 'gap' | 'align' | 'justify' | 'direction'>>;
    md?: Partial<Pick<StackProps, 'gap' | 'align' | 'justify' | 'direction'>>;
    lg?: Partial<Pick<StackProps, 'gap' | 'align' | 'justify' | 'direction'>>;
  };

  // Dividers
  dividerElement?: React.ReactNode;

  children: React.ReactNode;
}

// ===== COMPONENT =====

export const Stack = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & StackProps
>(
  (
    {
      className,
      gap,
      align,
      justify,
      direction,
      divider,
      dividerColor,
      as = 'div',
      asChild = false,
      responsive,
      dividerElement,
      children,
      ...props
    },
    ref
  ) => {
    // Build responsive classes
    const responsiveClasses = responsive
      ? Object.entries(responsive)
          .map(([breakpoint, config]) => {
            const prefix =
              breakpoint === 'sm' ? 'sm:' : (breakpoint === 'md' ? 'md:' : 'lg:');
            const classes = [];

            if (config.gap) {
              const gapMap: Record<string, string> = {
                none: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.none,
                xs: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs,
                sm: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
                md: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
                lg: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg,
                xl: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl,
                '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['2xl'],
                '3xl': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['3xl'],
              };
              const gapToken = gapMap[String(config.gap)] || `gap-${config.gap}`;
              classes.push(`${prefix}${gapToken}`);
            }
            if (config.align) {
              const itemsMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex
                .items as unknown as Record<string, string>;
              classes.push(`${prefix}${itemsMap[String(config.align)] || `items-${config.align}`}`);
            }
            if (config.justify) {
              const justifyMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex
                .justify as unknown as Record<string, string>;
              classes.push(`${prefix}${justifyMap[String(config.justify)] || `justify-${config.justify}`}`);
            }
            if (config.direction) {
              const dirMap = ENHANCED_DESIGN_TOKENS.foundation.layout.flex
                .direction as unknown as Record<string, string>;
              classes.push(`${prefix}${dirMap[String(config.direction)] || `flex-${config.direction}`}`);
            }

            return classes.join(' ');
          })
          .join(' ')
      : '';

    const combinedClassName = cn(
      stackVariants({
        gap,
        align,
        justify,
        direction,
        divider,
        dividerColor: divider ? dividerColor : undefined,
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

Stack.displayName = 'Stack';
