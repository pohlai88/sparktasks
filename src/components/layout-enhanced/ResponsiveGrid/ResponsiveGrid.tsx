/**
 * ResponsiveGrid - Container Query Grid
 *
 * Advanced grid system that uses container queries for true component-level responsiveness, independent of viewport size.
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

// ===== GRID CONFIG TYPE =====

export interface GridConfig {
  columns: number | string;
  rows?: number | string;
  gap?: string;
  alignItems?: string;
  justifyItems?: string;
}

// ===== VARIANTS =====

const responsiveGridVariants = cva(['grid', '@container'], {
  variants: {
    // Container Query Features
    containerType: {
      size: '@container/size',
      'inline-size': '@container/inline-size',
      'block-size': '@container/block-size',
    },

    // Auto-sizing options
    maintainAspectRatio: {
      true: '',
      false: '',
    },

    // Performance
    virtualized: {
      true: 'overflow-hidden',
      false: '',
    },
  },
  defaultVariants: {
    containerType: 'inline-size',
    maintainAspectRatio: false,
    virtualized: false,
  },
});

// ===== TYPES =====

export interface ResponsiveGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof responsiveGridVariants> {
  // Container-based Breakpoints
  breakpoints?: {
    xs?: string; // 320px
    sm?: string; // 480px
    md?: string; // 768px
    lg?: string; // 1024px
    xl?: string; // 1280px
  };

  // Grid Configuration per Breakpoint
  gridConfig?: {
    xs?: GridConfig;
    sm?: GridConfig;
    md?: GridConfig;
    lg?: GridConfig;
    xl?: GridConfig;
  };

  // Auto-sizing Options
  autoSizing?: {
    minItemWidth?: string;
    maxItemWidth?: string;
    aspectRatio?: string;
    maintainAspectRatio?: boolean;
  };

  // Performance
  virtualized?: boolean;
  virtualizedHeight?: number;
  overscan?: number;

  // Container Query Features
  containerName?: string;

  // Semantic HTML
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
  asChild?: boolean;

  children: React.ReactNode;
}

// ===== COMPONENT =====

export const ResponsiveGrid = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ResponsiveGridProps
>(
  (
    {
      className,
      breakpoints = {
        xs: '320px',
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      gridConfig,
      autoSizing,
      virtualized = false,
      virtualizedHeight,
      overscan = 5,
      containerName,
      containerType,
      maintainAspectRatio,
      as = 'div',
      asChild = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Build custom styles for container queries and grid configs
    const customStyle: React.CSSProperties = {
      ...style,
    };

    // Set container name if provided
    if (containerName) {
      (customStyle as any).containerName = containerName;
    }

    // Auto-sizing styles
    if (autoSizing) {
      if (autoSizing.minItemWidth) {
        (customStyle as any)['--min-item-width'] = autoSizing.minItemWidth;
      }
      if (autoSizing.maxItemWidth) {
        (customStyle as any)['--max-item-width'] = autoSizing.maxItemWidth;
      }
      if (autoSizing.aspectRatio) {
        customStyle.aspectRatio = autoSizing.aspectRatio;
      }
    }

    // Virtualized height
    if (virtualized && virtualizedHeight) {
      customStyle.height = `${virtualizedHeight}px`;
    }

    // Build container query classes for grid configurations
    const containerQueryClasses: string[] = [];

    if (gridConfig) {
      Object.entries(gridConfig).forEach(([breakpoint, config]) => {
        const bp = breakpoints[breakpoint as keyof typeof breakpoints];
        if (bp && config) {
          // Convert columns to grid class
          if (typeof config.columns === 'number') {
            containerQueryClasses.push(`@[${bp}]:grid-cols-${config.columns}`);
          }

          // Convert rows to grid class
          if (typeof config.rows === 'number') {
            containerQueryClasses.push(`@[${bp}]:grid-rows-${config.rows}`);
          }

          // Handle gap
          if (config.gap) {
            const gapClass =
              config.gap === 'xs'
                ? '1'
                : config.gap === 'sm'
                  ? '2'
                  : config.gap === 'md'
                    ? '4'
                    : config.gap === 'lg'
                      ? '6'
                      : config.gap === 'xl'
                        ? '8'
                        : config.gap;
            containerQueryClasses.push(`@[${bp}]:gap-${gapClass}`);
          }

          // Handle alignment
          if (config.alignItems) {
            containerQueryClasses.push(`@[${bp}]:items-${config.alignItems}`);
          }
          if (config.justifyItems) {
            containerQueryClasses.push(
              `@[${bp}]:justify-items-${config.justifyItems}`
            );
          }
        }
      });
    }

    // Default auto-responsive grid if no specific config provided
    if (!gridConfig && autoSizing?.minItemWidth) {
      customStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${autoSizing.minItemWidth}, 1fr))`;
    }

    const combinedClassName = cn(
      responsiveGridVariants({
        containerType,
        maintainAspectRatio,
        virtualized,
      }),
      containerQueryClasses,
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

ResponsiveGrid.displayName = 'ResponsiveGrid';
