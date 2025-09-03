/**
 * BarChart - Data Visualization Component
 *
 * Modern bar chart component built on Nivo with MAPS v3.0 design system integration.
 * Supports both horizontal and vertical layouts with excellent performance.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { ResponsiveBar } from '@nivo/bar';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';
import { cn } from '../../../utils/cn';
import type { BarChartProps } from '../types';

// ===== MAPS v3.0 CHART VARIANTS =====

const chartVariants = cva(['relative w-full overflow-hidden'], {
  variants: {
    surface: {
      elevated: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
        'rounded-lg border p-4',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
      ],
      glass: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
        'rounded-lg border p-4',
        ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
      ],
    },
    theme: {
      light: '',
      dark: '',
      auto: '',
    },
  },
  defaultVariants: {
    theme: 'auto',
  },
});

const chartContainerVariants = cva(['relative'], {
  variants: {
    size: {
      sm: 'h-64',
      md: 'h-80',
      lg: 'h-96',
      xl: 'h-[32rem]',
      auto: 'h-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Unused variants - removing to fix ESLint errors
// const chartHeaderVariants = cva([
//   'mb-4 space-y-1',
// ])

// const titleVariants = cva([
//   'font-semibold',
//   ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
//   ENHANCED_DESIGN_TOKENS.foundation.typography.title3,
// ])

// const subtitleVariants = cva([
//   ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
//   ENHANCED_DESIGN_TOKENS.foundation.typography.body,
// ])

const legendVariants = cva([
  'mt-4 flex flex-wrap gap-4 border-t pt-4',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
]);

const legendItemVariants = cva([
  'flex items-center gap-2',
  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
]);

const legendColorVariants = cva([
  'h-3 w-3 rounded-sm border',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
]);

// ===== CHART HELPERS =====

const generateMAPSTheme = (isDark: boolean) => ({
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: isDark ? '#E5E7EB' : '#374151',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  axis: {
    domain: {
      line: {
        stroke: isDark ? '#4B5563' : '#D1D5DB',
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: isDark ? '#D1D5DB' : '#6B7280',
        fontWeight: 500,
      },
    },
    ticks: {
      line: {
        stroke: isDark ? '#4B5563' : '#D1D5DB',
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: isDark ? '#9CA3AF' : '#6B7280',
      },
    },
  },
  grid: {
    line: {
      stroke: isDark ? '#374151' : '#F3F4F6',
      strokeWidth: 1,
    },
  },
  crosshair: {
    line: {
      stroke: isDark ? '#60A5FA' : '#3B82F6',
      strokeWidth: 1,
      strokeOpacity: 0.75,
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: isDark ? '#E5E7EB' : '#374151',
      outlineWidth: 2,
      outlineColor: isDark ? '#1F2937' : '#FFFFFF',
      outlineOpacity: 1,
    },
    link: {
      stroke: isDark ? '#9CA3AF' : '#6B7280',
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: isDark ? '#1F2937' : '#FFFFFF',
      outlineOpacity: 1,
    },
    outline: {
      stroke: isDark ? '#9CA3AF' : '#6B7280',
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: isDark ? '#1F2937' : '#FFFFFF',
      outlineOpacity: 1,
    },
    symbol: {
      fill: isDark ? '#9CA3AF' : '#6B7280',
      outlineWidth: 2,
      outlineColor: isDark ? '#1F2937' : '#FFFFFF',
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: isDark ? '#1F2937' : '#FFFFFF',
      color: isDark ? '#F9FAFB' : '#111827',
      fontSize: 12,
      borderRadius: '6px',
      boxShadow: isDark
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
  },
});

const defaultMAPSColors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#F97316', // orange-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
];

// ===== CHART COMPONENTS =====

interface ChartLegendProps {
  keys: string[];
  colors: string[];
  showLegend?: boolean;
}

function ChartLegend({ keys, colors, showLegend = true }: ChartLegendProps) {
  if (!showLegend) return null;

  return (
    <div className={legendVariants()}>
      {keys.map((key, index) => (
        <div key={key} className={legendItemVariants()}>
          <div
            className={legendColorVariants()}
            style={{ backgroundColor: colors[index % colors.length] }}
          />
          <span>{key}</span>
        </div>
      ))}
    </div>
  );
}

// ===== MAIN BAR CHART COMPONENT =====

export function BarChart({
  // Data
  data,
  keys,
  indexBy,

  // Chart Configuration
  layout = 'vertical',
  groupMode = 'grouped',

  // Styling
  colors = defaultMAPSColors,
  surface,
  theme = 'auto',

  // Dimensions
  height: customHeight,
  margin = { top: 20, right: 20, bottom: 60, left: 80 },

  // Interactivity
  onClick,
  onHover,

  // Grid configuration
  showGridLines = true,

  // Accessibility
  ariaLabel,

  // Custom
  className,

  ...props
}: BarChartProps & React.HTMLAttributes<HTMLDivElement>) {
  const isDarkMode = React.useMemo(() => {
    if (theme === 'auto') {
      return (
        globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
      );
    }
    return theme === 'dark';
  }, [theme]);

  const chartColors = React.useMemo(() => {
    if (typeof colors === 'function') {
      return defaultMAPSColors;
    }
    return colors;
  }, [colors]);

  const chartTheme = React.useMemo(
    () => generateMAPSTheme(isDarkMode),
    [isDarkMode]
  );

  // Data validation
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(chartVariants({ surface, theme }), className)}
        {...props}
      >
        <div
          className={cn(
            chartContainerVariants(),
            'flex items-center justify-center'
          )}
        >
          <div
            className={cn(
              'space-y-2 text-center',
              ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary
            )}
          >
            <div
              className={
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4
              }
            >
              No data available
            </div>
            <div
              className={ENHANCED_DESIGN_TOKENS.foundation.typography.caption}
            >
              Add data to display the chart
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(chartVariants({ surface, theme }), className)}
      {...props}
    >
      <div
        className={chartContainerVariants()}
        style={{ height: customHeight ? `${customHeight}px` : undefined }}
        role='img'
        aria-label={ariaLabel ?? `Bar chart showing ${keys.join(', ')} data`}
      >
        <ResponsiveBar
          data={data as Record<string, string | number>[]}
          keys={keys}
          indexBy={indexBy}
          margin={margin}
          padding={0.3}
          innerPadding={0}
          layout={layout}
          groupMode={groupMode}
          colors={chartColors}
          theme={chartTheme}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          borderRadius={0}
          borderWidth={0}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableGridX={layout === 'horizontal' && showGridLines}
          enableGridY={layout === 'vertical' && showGridLines}
          enableLabel={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          animate={true}
          motionConfig='gentle'
          isInteractive={!!onClick || !!onHover}
          role='application'
          ariaLabel={ariaLabel}
          ariaLabelledBy='chart-title'
          ariaDescribedBy='chart-description'
        />
      </div>

      <ChartLegend keys={keys} colors={chartColors} />
    </div>
  );
}

// Export types for external use
export type BarChartVariants = VariantProps<typeof chartVariants>;
