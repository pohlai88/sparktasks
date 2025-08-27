/**
 * Grid - CSS Grid Layout System
 *
 * Modern CSS Grid layout component with container queries, automatic placement, and responsive grid patterns.
 *
 * DESIGN PRINCIPLES:
 * - Essential Primitives Only: Focus on core layout building blocks that enable 95% of layout patterns
 * - MAPS v3.0 Governance: All components styled through ENHANCED_DESIGN_TOKENS with runtime governance
 * - Container Query Ready: Modern responsive design with container queries for component-level responsiveness
 * - Performance First: Zero-layout-shift design with proper spacing primitives
 * - Accessibility Excellence: Screen reader friendly layout patterns with proper semantic structure
 * - Developer Experience: Intuitive APIs that make complex layouts simple to implement
 */

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../utils/cn';

// ===== GRID PATTERNS =====

const GridPatterns = {
  'auto-fit': 'repeat(auto-fit, minmax(var(--min-item-width, 250px), 1fr))',
  'auto-fill': 'repeat(auto-fill, minmax(var(--min-item-width, 250px), 1fr))',
  'sidebar': 'minmax(250px, 1fr) 3fr',
  'holy-grail': '1fr 3fr 1fr',
  'masonry': 'repeat(auto-fill, minmax(250px, 1fr))',
} as const;

// ===== VARIANTS =====

const gridVariants = cva(['grid'], {
  variants: {
    // Grid Structure
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
      auto: 'grid-cols-auto',
      'min-content': 'grid-cols-min',
      'max-content': 'grid-cols-max',
    },
    
    rows: {
      1: 'grid-rows-1',
      2: 'grid-rows-2',
      3: 'grid-rows-3',
      4: 'grid-rows-4',
      5: 'grid-rows-5',
      6: 'grid-rows-6',
      auto: 'grid-rows-auto',
      'min-content': 'grid-rows-min',
      'max-content': 'grid-rows-max',
    },
    
    // Gap Control
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
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
    
    // Alignment
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    
    justifyItems: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
    
    alignContent: {
      start: 'content-start',
      center: 'content-center',
      end: 'content-end',
      stretch: 'content-stretch',
      between: 'content-between',
      around: 'content-around',
      evenly: 'content-evenly',
    },
    
    justifyContent: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      stretch: 'justify-stretch',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    
    // Auto-placement
    autoFlow: {
      row: 'grid-flow-row',
      column: 'grid-flow-col',
      dense: 'grid-flow-row-dense',
      'row-dense': 'grid-flow-row-dense',
      'column-dense': 'grid-flow-col-dense',
    },
    
    autoColumns: {
      min: 'auto-cols-min',
      max: 'auto-cols-max',
      fr: 'auto-cols-fr',
    },
    
    autoRows: {
      min: 'auto-rows-min',
      max: 'auto-rows-max',
      fr: 'auto-rows-fr',
    },
  },
  defaultVariants: {
    columns: 1,
    gap: 'md',
    alignItems: 'stretch',
    justifyItems: 'stretch',
  },
});

// ===== TYPES =====

export interface GridProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof gridVariants>, 'columns' | 'rows'> {
  // Grid Structure - additional string support for custom values
  columns?: number | 'auto' | 'min-content' | 'max-content' | string;
  rows?: number | 'auto' | 'min-content' | 'max-content' | string;
  
  // Semantic HTML
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
  asChild?: boolean;
  
  // Responsive Grid
  responsive?: {
    sm?: Partial<Omit<GridProps, 'responsive'>>;
    md?: Partial<Omit<GridProps, 'responsive'>>;
    lg?: Partial<Omit<GridProps, 'responsive'>>;
  };
  
  // Container Queries
  containerQueries?: boolean;
  minItemWidth?: string; // For auto-responsive grids
  
  children: React.ReactNode;
}

// ===== COMPONENT =====

export const Grid = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & GridProps
>(
  ({ 
    className, 
    columns,
    rows,
    gap,
    gapX, 
    gapY,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    autoFlow,
    autoColumns,
    autoRows,
    as = 'div',
    asChild = false,
    responsive,
    containerQueries = false,
    minItemWidth,
    children,
    style,
    ...props 
  }, ref) => {
    // Handle custom grid template columns/rows
    const customStyle: React.CSSProperties = {
      ...style,
    };
    
    // Handle string patterns for columns
    if (typeof columns === 'string' && GridPatterns[columns as keyof typeof GridPatterns]) {
      customStyle.gridTemplateColumns = GridPatterns[columns as keyof typeof GridPatterns];
    } else if (typeof columns === 'string' && !['auto', 'min-content', 'max-content'].includes(columns) && isNaN(Number(columns))) {
      customStyle.gridTemplateColumns = columns;
    }
    
    // Handle string patterns for rows
    if (typeof rows === 'string' && !['auto', 'min-content', 'max-content'].includes(rows) && isNaN(Number(rows))) {
      customStyle.gridTemplateRows = rows;
    }
    
    // Handle min item width for auto-responsive grids
    if (minItemWidth) {
      (customStyle as any)['--min-item-width'] = minItemWidth;
    }
    
    // Build responsive classes
    const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
      const prefix = breakpoint === 'sm' ? 'sm:' : breakpoint === 'md' ? 'md:' : 'lg:';
      const classes = [];
      
      if (config.columns && typeof config.columns === 'number') {
        classes.push(`${prefix}grid-cols-${config.columns}`);
      }
      if (config.rows && typeof config.rows === 'number') {
        classes.push(`${prefix}grid-rows-${config.rows}`);
      }
      if (config.gap) classes.push(`${prefix}gap-${config.gap === 'none' ? '0' : config.gap === 'xs' ? '1' : config.gap === 'sm' ? '2' : config.gap === 'md' ? '4' : config.gap === 'lg' ? '6' : config.gap === 'xl' ? '8' : '12'}`);
      
      return classes.join(' ');
    }).join(' ') : '';
    
    const combinedClassName = cn(
      gridVariants({ 
        columns: typeof columns === 'string' && GridPatterns[columns as keyof typeof GridPatterns] ? undefined : columns as any,
        rows: typeof rows === 'string' && !['auto', 'min-content', 'max-content'].includes(rows) && isNaN(Number(rows)) ? undefined : rows as any,
        gap: gapX || gapY ? undefined : gap,
        gapX,
        gapY,
        alignItems,
        justifyItems,
        alignContent,
        justifyContent,
        autoFlow,
        autoColumns,
        autoRows,
      }),
      containerQueries && '@container',
      responsiveClasses,
      className
    );
    
    if (asChild) {
      return (
        <Slot
          className={combinedClassName}
          style={customStyle}
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
        style={customStyle}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Grid.displayName = 'Grid';
