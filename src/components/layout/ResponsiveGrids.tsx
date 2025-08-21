/**
 * @fileoverview ResponsiveGrids - Advanced Responsive Grid Layout Component
 *
 * @description Enterprise-grade responsive grid system providing comprehensive layout
 * management with breakpoint-aware design, performance optimization, and accessibility compliance.
 *
 * Features:
 * - Complex responsive grid layouts with mobile-first design
 * - Auto-fit and auto-fill grid configurations
 * - Flexible gap management with DESIGN_TOKENS integration
 * - Performance optimized with ResizeObserver and content visibility
 * - Accessibility compliance with proper ARIA attributes
 * - TypeScript strict mode compatibility
 * - SSOT compliance with DESIGN_TOKENS V3.2
 *
 * Usage Examples:
 * @example
 * ```tsx
 * // Basic responsive grid
 * <ResponsiveGrids columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="md">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </ResponsiveGrids>
 *
 * // Auto-fit grid with minimum item width
 * <ResponsiveGrids autoFit minItemWidth="300px" gap="lg">
 *   <Card>Dynamic Item 1</Card>
 *   <Card>Dynamic Item 2</Card>
 * </ResponsiveGrids>
 *
 * // Complex dashboard layout
 * <ResponsiveGrids
 *   columns={{ sm: 1, md: 2, lg: 4 }}
 *   areas={{
 *     md: ["header header", "sidebar main"],
 *     lg: ["header header header header", "sidebar main main analytics"]
 *   }}
 *   gap="xl"
 * >
 *   <DashboardHeader gridArea="header" />
 *   <Sidebar gridArea="sidebar" />
 *   <MainContent gridArea="main" />
 *   <Analytics gridArea="analytics" />
 * </ResponsiveGrids>
 * ```
 */

import React, { forwardRef, useMemo, useEffect, useRef, useState } from 'react';

import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 'auto';
export type BreakpointKey = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridAlignItems =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'baseline';
export type GridJustifyItems = 'start' | 'center' | 'end' | 'stretch';
export type GridAutoFlow =
  | 'row'
  | 'column'
  | 'dense'
  | 'row-dense'
  | 'column-dense';

export interface ResponsiveColumns {
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
  '2xl'?: GridColumns;
}

export interface ResponsiveGaps {
  sm?: GridGap;
  md?: GridGap;
  lg?: GridGap;
  xl?: GridGap;
  '2xl'?: GridGap;
}

export interface GridAreas {
  sm?: string[];
  md?: string[];
  lg?: string[];
  xl?: string[];
  '2xl'?: string[];
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid area name (when using template areas) */
  gridArea?: string;
  /** Column span */
  colSpan?: number | { [K in BreakpointKey]?: number };
  /** Row span */
  rowSpan?: number | { [K in BreakpointKey]?: number };
  /** Column start position */
  colStart?: number | { [K in BreakpointKey]?: number };
  /** Column end position */
  colEnd?: number | { [K in BreakpointKey]?: number };
  /** Row start position */
  rowStart?: number | { [K in BreakpointKey]?: number };
  /** Row end position */
  rowEnd?: number | { [K in BreakpointKey]?: number };
  /** Item alignment */
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
  /** Item justification */
  justifySelf?: 'start' | 'center' | 'end' | 'stretch';
  /** Custom CSS class */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
  /** Children components */
  children: React.ReactNode;
}

export interface ResponsiveGridsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Responsive column configuration */
  columns?: GridColumns | ResponsiveColumns;
  /** Grid gap size */
  gap?: GridGap | ResponsiveGaps;
  /** Auto-fit grid with minimum item width */
  autoFit?: boolean;
  /** Auto-fill grid with minimum item width */
  autoFill?: boolean;
  /** Minimum item width for auto-fit/auto-fill grids */
  minItemWidth?: string;
  /** Maximum item width for auto-fit/auto-fill grids */
  maxItemWidth?: string;
  /** Grid template areas for complex layouts */
  areas?: GridAreas;
  /** Grid item alignment */
  alignItems?: GridAlignItems;
  /** Grid item justification */
  justifyItems?: GridJustifyItems;
  /** Grid auto flow direction */
  autoFlow?: GridAutoFlow;
  /** Dense packing */
  dense?: boolean;
  /** Performance optimization - enable content visibility */
  contentVisibility?: boolean;
  /** Accessibility label */
  'aria-label'?: string;
  /** Role for screen readers */
  role?: string;
  /** Custom CSS class */
  className?: string;
  /** Test ID for testing */
  'data-testid'?: string;
  /** Grid performance monitoring callback */
  onLayout?: (metrics: {
    columns: number;
    rows: number;
    itemCount: number;
  }) => void;
  /** Children components */
  children: React.ReactNode;
}

// ===== GRID CONFIGURATION CONSTANTS =====

const GAP_CLASSES: Record<GridGap, string> = {
  none: 'gap-0',
  xs: DESIGN_TOKENS.spacing.xs,
  sm: DESIGN_TOKENS.spacing.sm,
  md: DESIGN_TOKENS.spacing.md,
  lg: DESIGN_TOKENS.spacing.lg,
  xl: DESIGN_TOKENS.spacing.xl,
  '2xl': DESIGN_TOKENS.spacing['2xl'],
  '3xl': DESIGN_TOKENS.spacing['3xl'],
} as const;

const COLUMN_CLASSES: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  8: 'grid-cols-8',
  10: 'grid-cols-10',
  12: 'grid-cols-12',
  auto: 'grid-cols-auto',
} as const;

const BREAKPOINT_PREFIXES: Record<BreakpointKey, string> = {
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
} as const;

const ALIGN_ITEMS_CLASSES: Record<GridAlignItems, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

const JUSTIFY_ITEMS_CLASSES: Record<GridJustifyItems, string> = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  stretch: 'justify-items-stretch',
} as const;

const AUTO_FLOW_CLASSES: Record<GridAutoFlow, string> = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-row-dense',
  'row-dense': 'grid-flow-row-dense',
  'column-dense': 'grid-flow-col-dense',
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Generate responsive column classes
 */
function generateColumnClasses(
  columns: GridColumns | ResponsiveColumns
): string {
  if (typeof columns === 'number' || columns === 'auto') {
    return COLUMN_CLASSES[columns];
  }

  const classes: string[] = [];

  // Base class (mobile-first)
  if (columns.sm) {
    classes.push(COLUMN_CLASSES[columns.sm]);
  }

  // Responsive classes
  for (const [breakpoint, cols] of Object.entries(columns)) {
    if (
      breakpoint !== 'sm' &&
      cols &&
      (typeof cols === 'number' || cols === 'auto')
    ) {
      const prefix = BREAKPOINT_PREFIXES[breakpoint as BreakpointKey];
      classes.push(`${prefix}${COLUMN_CLASSES[cols as GridColumns]}`);
    }
  }

  return classes.join(' ');
}

/**
 * Generate responsive gap classes
 */
function generateGapClasses(gap: GridGap | ResponsiveGaps): string {
  if (typeof gap === 'string') {
    return GAP_CLASSES[gap];
  }

  const classes: string[] = [];

  // Base class (mobile-first)
  if (gap.sm) {
    classes.push(GAP_CLASSES[gap.sm]);
  }

  // Responsive classes
  for (const [breakpoint, gapSize] of Object.entries(gap)) {
    if (breakpoint !== 'sm' && gapSize && typeof gapSize === 'string') {
      const prefix = BREAKPOINT_PREFIXES[breakpoint as BreakpointKey];
      const gapClass = GAP_CLASSES[gapSize as GridGap];
      // Extract the gap value and apply prefix
      const gapValue = gapClass.replace('gap-', '');
      classes.push(`${prefix}gap-${gapValue}`);
    }
  }

  return classes.join(' ');
}

/**
 * Generate auto-fit or auto-fill grid template
 */
function generateAutoGridTemplate(
  autoFit: boolean,
  minWidth: string,
  maxWidth?: string
): string {
  const mode = autoFit ? 'auto-fit' : 'auto-fill';
  const max = maxWidth || '1fr';
  return `grid-cols-[repeat(${mode},minmax(${minWidth},${max}))]`;
}

/**
 * Generate grid template areas CSS
 */
function generateGridAreas(areas: GridAreas): Record<string, string> {
  const styles: Record<string, string> = {};

  for (const [breakpoint, areaRows] of Object.entries(areas)) {
    if (areaRows && areaRows.length > 0) {
      const gridTemplateAreas = areaRows
        .map((row: string) => `"${row}"`)
        .join(' ');

      if (breakpoint === 'sm') {
        styles.gridTemplateAreas = gridTemplateAreas;
      } else {
        // For responsive areas, we'll need to use CSS-in-JS or CSS variables
        // This is a simplified version - in production, you might want to use a CSS-in-JS solution
        styles[`--grid-areas-${breakpoint}`] = gridTemplateAreas;
      }
    }
  }

  return styles;
}

// ===== PERFORMANCE MONITORING HOOK =====

function useGridPerformance(
  containerRef: React.RefObject<HTMLDivElement>,
  onLayout?: ResponsiveGridsProps['onLayout']
) {
  const [metrics, setMetrics] = useState({ columns: 0, rows: 0, itemCount: 0 });

  useEffect(() => {
    if (!containerRef.current || !onLayout) return;

    const container = containerRef.current;

    const updateMetrics = () => {
      const computedStyle = globalThis.getComputedStyle(container);

      // Safely access grid properties (they might be undefined in test environments)
      const gridTemplateColumns = computedStyle?.gridTemplateColumns || '';
      const gridTemplateRows = computedStyle?.gridTemplateRows || '';

      const columns = gridTemplateColumns
        ? gridTemplateColumns.split(' ').length
        : 0;
      const rows = gridTemplateRows ? gridTemplateRows.split(' ').length : 0;
      const itemCount = container.children.length;

      const newMetrics = { columns, rows, itemCount };
      setMetrics(newMetrics);
      onLayout(newMetrics);
    };

    // Initial measurement
    updateMetrics();

    // Observe resize for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateMetrics);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, onLayout]);

  return metrics;
}

// ===== MAIN COMPONENT =====

export const ResponsiveGrids = forwardRef<HTMLDivElement, ResponsiveGridsProps>(
  (
    {
      columns = { sm: 1, md: 2, lg: 3 },
      gap = 'md',
      autoFit = false,
      autoFill = false,
      minItemWidth = '280px',
      maxItemWidth,
      areas,
      alignItems = 'stretch',
      justifyItems = 'stretch',
      autoFlow = 'row',
      dense = false,
      contentVisibility = true,
      'aria-label': ariaLabel,
      role = 'region',
      className = '',
      'data-testid': testId = 'responsive-grids',
      onLayout,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridMetrics = useGridPerformance(containerRef, onLayout);

    // Combine refs
    const combinedRef = useMemo(() => {
      return (element: HTMLDivElement | null) => {
        if (containerRef.current !== element) {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = element;
        }
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      };
    }, [ref]);

    // Generate CSS classes
    const gridClasses = useMemo(() => {
      const classes = ['grid'];

      // Base grid setup
      if (autoFit || autoFill) {
        classes.push(
          generateAutoGridTemplate(autoFit, minItemWidth, maxItemWidth)
        );
      } else {
        classes.push(generateColumnClasses(columns));
      }

      // Gap management
      classes.push(
        generateGapClasses(gap),
        ALIGN_ITEMS_CLASSES[alignItems],
        JUSTIFY_ITEMS_CLASSES[justifyItems]
      );

      // Auto flow
      if (dense) {
        classes.push(
          autoFlow === 'column' ? 'grid-flow-col-dense' : 'grid-flow-row-dense'
        );
      } else {
        classes.push(AUTO_FLOW_CLASSES[autoFlow]);
      }

      // Performance optimization
      if (contentVisibility) {
        classes.push('[content-visibility:auto]');
      }

      // Responsive breakpoint classes for better mobile experience
      classes.push('w-full');

      return classes.join(' ');
    }, [
      columns,
      gap,
      autoFit,
      autoFill,
      minItemWidth,
      maxItemWidth,
      alignItems,
      justifyItems,
      autoFlow,
      dense,
      contentVisibility,
    ]);

    // Generate grid template areas styles
    const gridAreasStyles = useMemo(() => {
      return areas ? generateGridAreas(areas) : {};
    }, [areas]);

    // Combine styles
    const combinedStyles = useMemo(() => {
      return {
        ...gridAreasStyles,
        ...style,
      };
    }, [gridAreasStyles, style]);

    // Accessibility attributes
    const accessibilityProps = useMemo(() => {
      const props: Record<string, any> = {
        role,
      };

      if (ariaLabel) {
        props['aria-label'] = ariaLabel;
      }

      // Add grid information for screen readers
      if (gridMetrics.columns > 0) {
        props['aria-describedby'] = `${testId}-description`;
      }

      return props;
    }, [role, ariaLabel, gridMetrics.columns, testId]);

    return (
      <>
        <div
          ref={combinedRef}
          className={`${gridClasses} ${className}`}
          style={combinedStyles}
          data-testid={testId}
          {...accessibilityProps}
          {...props}
        >
          {children}
        </div>

        {/* Hidden description for screen readers */}
        {gridMetrics.columns > 0 && (
          <div
            id={`${testId}-description`}
            className={DESIGN_TOKENS.accessibility.srOnly}
          >
            Grid layout with {gridMetrics.columns} columns, {gridMetrics.rows}{' '}
            rows, containing {gridMetrics.itemCount} items
          </div>
        )}
      </>
    );
  }
);

ResponsiveGrids.displayName = 'ResponsiveGrids';

// ===== GRID ITEM HELPER COMPONENT =====

/**
 * Grid item helper component for advanced grid positioning
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  (
    {
      gridArea,
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      alignSelf,
      justifySelf,
      className = '',
      'data-testid': testId = 'grid-item',
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Generate positioning classes
    const positionClasses = useMemo(() => {
      const classes: string[] = [];

      // Grid area
      if (gridArea) {
        classes.push(`[grid-area:${gridArea}]`);
      }

      // Column span
      if (typeof colSpan === 'number') {
        classes.push(`col-span-${colSpan}`);
      } else if (typeof colSpan === 'object' && colSpan !== null) {
        for (const [breakpoint, span] of Object.entries(colSpan)) {
          if (span && typeof span === 'number') {
            const prefix = BREAKPOINT_PREFIXES[breakpoint as BreakpointKey];
            classes.push(`${prefix}col-span-${span}`);
          }
        }
      }

      // Row span
      if (typeof rowSpan === 'number') {
        classes.push(`row-span-${rowSpan}`);
      } else if (typeof rowSpan === 'object' && rowSpan !== null) {
        for (const [breakpoint, span] of Object.entries(rowSpan)) {
          if (span && typeof span === 'number') {
            const prefix = BREAKPOINT_PREFIXES[breakpoint as BreakpointKey];
            classes.push(`${prefix}row-span-${span}`);
          }
        }
      }

      // Self alignment
      if (alignSelf) {
        const alignClasses = {
          start: 'self-start',
          center: 'self-center',
          end: 'self-end',
          stretch: 'self-stretch',
          baseline: 'self-baseline',
        };
        classes.push(alignClasses[alignSelf]);
      }

      if (justifySelf) {
        const justifyClasses = {
          start: 'justify-self-start',
          center: 'justify-self-center',
          end: 'justify-self-end',
          stretch: 'justify-self-stretch',
        };
        classes.push(justifyClasses[justifySelf]);
      }

      return classes.join(' ');
    }, [
      gridArea,
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      alignSelf,
      justifySelf,
    ]);

    return (
      <div
        ref={ref}
        className={`${positionClasses} ${className}`}
        style={style}
        data-testid={testId}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';

// ===== COMMON GRID LAYOUT PRESETS =====

export const GridPresets = {
  /** Dashboard layout with header and content areas */
  dashboard: {
    columns: { sm: 1, md: 2, lg: 4 } as ResponsiveColumns,
    gap: 'lg' as GridGap,
    areas: {
      md: ['header header', 'main main'],
      lg: ['header header header header', 'sidebar main main analytics'],
    } as GridAreas,
  },

  /** Card gallery layout */
  gallery: {
    autoFit: true,
    minItemWidth: '280px',
    maxItemWidth: '400px',
    gap: 'md' as GridGap,
  },

  /** Metrics display layout */
  metrics: {
    columns: { sm: 1, md: 2, lg: 4 } as ResponsiveColumns,
    gap: 'sm' as GridGap,
  },

  /** Two-column layout */
  twoColumn: {
    columns: { sm: 1, lg: 2 } as ResponsiveColumns,
    gap: 'xl' as GridGap,
  },

  /** Three-column layout */
  threeColumn: {
    columns: { sm: 1, md: 2, lg: 3 } as ResponsiveColumns,
    gap: 'lg' as GridGap,
  },
} as const;

export default ResponsiveGrids;
