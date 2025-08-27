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

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../utils/cn';

// ===== VARIANTS =====

const clusterVariants = cva(['flex'], {
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
    },
    
    gapX: {
      none: 'gap-x-0',
      xs: 'gap-x-1',
      sm: 'gap-x-2',
      md: 'gap-x-4',
      lg: 'gap-x-6',
      xl: 'gap-x-8',
      '2xl': 'gap-x-12',
    },
    
    gapY: {
      none: 'gap-y-0',
      xs: 'gap-y-1',
      sm: 'gap-y-2',
      md: 'gap-y-4',
      lg: 'gap-y-6',
      xl: 'gap-y-8',
      '2xl': 'gap-y-12',
    },
    
    // Flex Behavior
    wrap: {
      wrap: 'flex-wrap',
      nowrap: 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
    
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
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
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
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
    sm?: Partial<Pick<ClusterProps, 'gap' | 'gapX' | 'gapY' | 'align' | 'justify' | 'direction' | 'wrap'>>;
    md?: Partial<Pick<ClusterProps, 'gap' | 'gapX' | 'gapY' | 'align' | 'justify' | 'direction' | 'wrap'>>;
    lg?: Partial<Pick<ClusterProps, 'gap' | 'gapX' | 'gapY' | 'align' | 'justify' | 'direction' | 'wrap'>>;
  };
  
  children: React.ReactNode;
}

// ===== COMPONENT =====

export const Cluster = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ClusterProps
>(
  ({ 
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
  }, ref) => {
    // Build responsive classes
    const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
      const prefix = breakpoint === 'sm' ? 'sm:' : breakpoint === 'md' ? 'md:' : 'lg:';
      const classes = [];
      
      if (config.gap) classes.push(`${prefix}gap-${config.gap === 'none' ? '0' : config.gap === 'xs' ? '1' : config.gap === 'sm' ? '2' : config.gap === 'md' ? '4' : config.gap === 'lg' ? '6' : config.gap === 'xl' ? '8' : '12'}`);
      if (config.gapX) classes.push(`${prefix}gap-x-${config.gapX === 'none' ? '0' : config.gapX === 'xs' ? '1' : config.gapX === 'sm' ? '2' : config.gapX === 'md' ? '4' : config.gapX === 'lg' ? '6' : config.gapX === 'xl' ? '8' : '12'}`);
      if (config.gapY) classes.push(`${prefix}gap-y-${config.gapY === 'none' ? '0' : config.gapY === 'xs' ? '1' : config.gapY === 'sm' ? '2' : config.gapY === 'md' ? '4' : config.gapY === 'lg' ? '6' : config.gapY === 'xl' ? '8' : '12'}`);
      if (config.align) classes.push(`${prefix}items-${config.align}`);
      if (config.justify) classes.push(`${prefix}justify-${config.justify}`);
      if (config.direction) classes.push(`${prefix}flex-${config.direction}`);
      if (config.wrap) classes.push(`${prefix}flex-${config.wrap}`);
      
      return classes.join(' ');
    }).join(' ') : '';
    
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

Cluster.displayName = 'Cluster';
