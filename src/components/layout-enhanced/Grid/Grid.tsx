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

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { forwardRef } from 'react';

import { cn } from '../../../utils/cn';
import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';

// ===== GRID PATTERNS =====

const GridPatterns = {
  'auto-fit': 'repeat(auto-fit, minmax(var(--min-item-width, 250px), 1fr))',
  'auto-fill': 'repeat(auto-fill, minmax(var(--min-item-width, 250px), 1fr))',
  sidebar: 'minmax(250px, 1fr) 3fr',
  'holy-grail': '1fr 3fr 1fr',
  masonry: 'repeat(auto-fill, minmax(250px, 1fr))',
} as const;

// ===== VARIANTS =====

const gridVariants = cva([
  ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid,
], {
  variants: {
    // Grid Structure
    columns: {
      1: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[1],
      2: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[2],
      3: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[3],
      4: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[4],
      5: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[5],
      6: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[6],
      7: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[7],
      8: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[8],
      9: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[9],
      10: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[10],
      11: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[11],
      12: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[12],
      auto: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns.auto,
      'min-content': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns.auto, // closest token
      'max-content': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns.auto, // closest token
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
      none: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.none,
      xs: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs,
      sm: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
      md: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
      lg: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg,
      xl: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl,
      '2xl': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['2xl'],
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
      start: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start,
      center: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
      end: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.end,
      stretch: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.stretch,
    },

    justifyItems: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },

    alignContent: {
      start: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.start,
      center: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.center,
      end: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.end,
      stretch: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.center,
      between: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.between,
      around: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.around,
      evenly: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.content.evenly,
    },

    justifyContent: {
      start: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.start,
      center: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center,
      end: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.end,
      stretch: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, // closest
      between: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between,
      around: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.around,
      evenly: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.evenly,
    },

    // Auto-placement
    autoFlow: {
      row: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.flow.row,
      column: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.flow.col,
      dense: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.flow.dense,
      'row-dense': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.flow.dense,
      'column-dense': ENHANCED_DESIGN_TOKENS.foundation.layout.grid.flow.dense,
    },

    autoColumns: {
      min: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.autoCols.min,
      max: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.autoCols.max,
      fr: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.autoCols.fr,
    },

    autoRows: {
      min: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.autoRows.min,
      max: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.autoRows.max,
      fr: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.autoRows.fr,
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
  (
    {
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
    },
    ref
  ) => {
    // Handle custom grid template columns/rows
    const customStyle: React.CSSProperties = {
      ...style,
    };

    // Handle string patterns for columns
    if (
      typeof columns === 'string' &&
      GridPatterns[columns as keyof typeof GridPatterns]
    ) {
      customStyle.gridTemplateColumns =
        GridPatterns[columns as keyof typeof GridPatterns];
    } else if (
      typeof columns === 'string' &&
      !['auto', 'min-content', 'max-content'].includes(columns) &&
      isNaN(Number(columns))
    ) {
      customStyle.gridTemplateColumns = columns;
    }

    // Handle string patterns for rows
    if (
      typeof rows === 'string' &&
      !['auto', 'min-content', 'max-content'].includes(rows) &&
      isNaN(Number(rows))
    ) {
      customStyle.gridTemplateRows = rows;
    }

    // Handle min item width for auto-responsive grids
    if (minItemWidth) {
      (customStyle as any)['--min-item-width'] = minItemWidth;
    }

    // Build responsive classes
    const responsiveClasses = responsive
      ? Object.entries(responsive)
          .map(([breakpoint, config]) => {
            const prefix =
              breakpoint === 'sm' ? 'sm:' : (breakpoint === 'md' ? 'md:' : 'lg:');
            const classes = [];

            if (config.columns && typeof config.columns === 'number') {
              classes.push(`${prefix}grid-cols-${config.columns}`);
            }
            if (config.rows && typeof config.rows === 'number') {
              classes.push(`${prefix}grid-rows-${config.rows}`);
            }
            if (config.gap)
              classes.push(
                `${prefix}gap-${config.gap === 'none' ? '0' : config.gap === 'xs' ? '1' : config.gap === 'sm' ? '2' : config.gap === 'md' ? '4' : config.gap === 'lg' ? '6' : config.gap === 'xl' ? '8' : '12'}`
              );

            return classes.join(' ');
          })
          .join(' ')
      : '';

    const combinedClassName = cn(
      gridVariants({
        columns:
          typeof columns === 'string' &&
          GridPatterns[columns as keyof typeof GridPatterns]
            ? undefined
            : (columns as any),
        rows:
          typeof rows === 'string' &&
          !['auto', 'min-content', 'max-content'].includes(rows) &&
          isNaN(Number(rows))
            ? undefined
            : (rows as any),
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
        <Slot className={combinedClassName} style={customStyle} {...props}>
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
