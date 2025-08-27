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

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../utils/cn';

// ===== VARIANTS =====

const stackVariants = cva(['flex'], {
  variants: {
    // Spacing Control - using Tailwind's gap utilities
    gap: {
      none: 'gap-0',
      xs: 'gap-1',       // 4px
      sm: 'gap-2',       // 8px
      md: 'gap-4',       // 16px
      lg: 'gap-6',       // 24px
      xl: 'gap-8',       // 32px
      '2xl': 'gap-12',   // 48px
      '3xl': 'gap-16',   // 64px
    },
    
    // Alignment Options
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    
    // Direction Control
    direction: {
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
    },
    
    // Dividers
    divider: {
      true: 'divide-y',
      false: '',
    },
    
    dividerColor: {
      subtle: 'divide-border-subtle',
      muted: 'divide-border',
      accent: 'divide-border-accent',
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
  ({ 
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
  }, ref) => {
    // Build responsive classes
    const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
      const prefix = breakpoint === 'sm' ? 'sm:' : breakpoint === 'md' ? 'md:' : 'lg:';
      const classes = [];
      
      if (config.gap) classes.push(`${prefix}gap-${config.gap === 'none' ? '0' : config.gap === 'xs' ? '1' : config.gap === 'sm' ? '2' : config.gap === 'md' ? '4' : config.gap === 'lg' ? '6' : config.gap === 'xl' ? '8' : config.gap === '2xl' ? '12' : '16'}`);
      if (config.align) classes.push(`${prefix}items-${config.align}`);
      if (config.justify) classes.push(`${prefix}justify-${config.justify}`);
      if (config.direction) classes.push(`${prefix}flex-${config.direction}`);
      
      return classes.join(' ');
    }).join(' ') : '';
    
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
        <Slot
          className={combinedClassName}
          {...props}
        >
          {children}
        </Slot>
      );
    }
    
    const Comp = as as React.ElementType;
    
    return (
      <Comp
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Stack.displayName = 'Stack';
