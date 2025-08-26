/**
 * TableEmpty - Elegant Empty States Component
 *
 * Beautiful, actionable empty states that guide users and enhance the data table experience.
 * Built with MAPS v3.0 design system integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { DatabaseIcon, SearchIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react'
import React from 'react'

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens'
import { cn } from '../../../utils/cn'
import type { TableEmptyProps } from '../types'

// ===== MAPS v3.0 EMPTY STATE VARIANTS =====

const tableEmptyVariants = cva([
  // Foundation styling with MAPS tokens
  'flex flex-col items-center justify-center p-8 text-center',
  'min-h-[400px] w-full',
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
  'border rounded-lg',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
], {
  variants: {
    size: {
      sm: 'min-h-[200px] p-4',
      md: 'min-h-[300px] p-6',
      lg: 'min-h-[400px] p-8',
    },
    surface: {
      elevated: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated1,
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
      ],
      glass: [
        ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.glass.surface,
        ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
      ],
    },
  },
  defaultVariants: {
    size: 'lg',
    surface: 'elevated',
  },
})

const emptyIconVariants = cva([
  'mb-4 shrink-0',
  ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
], {
  variants: {
    size: {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    },
    variant: {
      'no-data': ENHANCED_DESIGN_TOKENS.foundation.color.content.muted,
      'no-results': ENHANCED_DESIGN_TOKENS.foundation.color.content.accent,
      'error': ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
      'loading': ENHANCED_DESIGN_TOKENS.foundation.color.content.accent,
      'custom': ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
    },
  },
  defaultVariants: {
    size: 'lg',
    variant: 'no-data',
  },
})

const emptyTitleVariants = cva([
  'mb-2',
  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
], {
  variants: {
    size: {
      sm: ENHANCED_DESIGN_TOKENS.foundation.typography.subhead,
      md: ENHANCED_DESIGN_TOKENS.foundation.typography.headline,
      lg: ENHANCED_DESIGN_TOKENS.foundation.typography.title3,
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

const emptyDescriptionVariants = cva([
  'mb-6 max-w-md',
  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
], {
  variants: {
    size: {
      sm: ENHANCED_DESIGN_TOKENS.foundation.typography.caption1,
      md: ENHANCED_DESIGN_TOKENS.foundation.typography.footnote,
      lg: ENHANCED_DESIGN_TOKENS.foundation.typography.body,
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

const emptyActionVariants = cva([
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2',
  'font-medium transition-colors',
  ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
  ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
], {
  variants: {
    variant: {
      default: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
        'border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      ],
      primary: [
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.hover.bg,
      ],
      outline: [
        'bg-transparent border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.accent,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      ],
    },
    size: {
      sm: [
        'h-8 px-3 text-sm',
        ENHANCED_DESIGN_TOKENS.foundation.typography.caption1,
      ],
      md: [
        'h-10 px-4',
        ENHANCED_DESIGN_TOKENS.foundation.typography.button,
      ],
      lg: [
        'h-11 px-6',
        ENHANCED_DESIGN_TOKENS.foundation.typography.callout,
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

// ===== BUILT-IN EMPTY STATE VARIANTS =====

const EmptyStateVariants = {
  'no-data': {
    title: 'No data available',
    description: 'Get started by adding your first record',
    icon: DatabaseIcon,
    primaryAction: { label: 'Add Record' }
  },
  'no-results': {
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria',
    icon: SearchIcon,
    primaryAction: { label: 'Clear Filters' }
  },
  'error': {
    title: 'Unable to load data',
    description: 'Please check your connection and try again',
    icon: AlertCircleIcon,
    primaryAction: { label: 'Retry' }
  },
  'loading': {
    title: 'Loading data...',
    description: 'Please wait while we fetch your data',
    icon: Loader2Icon,
  },
  'custom': {
    title: 'Custom empty state',
    description: 'This is a customizable empty state',
    icon: DatabaseIcon,
  }
} as const

// ===== LOADING ANIMATION COMPONENT =====

function LoadingIcon({ className }: { className?: string }) {
  return (
    <Loader2Icon
      className={cn(
        'animate-spin',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.accent,
        className
      )}
    />
  )
}

// ===== SUGGESTIONS LIST COMPONENT =====

function SuggestionsList({
  suggestions,
  size = 'md'
}: {
  suggestions: Array<{ label: string; onClick: () => void }>
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <div className="mt-4 space-y-2">
      <p className={cn(
        'mb-3',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
        size === 'sm' && ENHANCED_DESIGN_TOKENS.foundation.typography.caption2,
        size === 'md' && ENHANCED_DESIGN_TOKENS.foundation.typography.caption1,
        size === 'lg' && ENHANCED_DESIGN_TOKENS.foundation.typography.footnote,
      )}>
        Suggestions:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={suggestion.onClick}
            className={cn(
              emptyActionVariants({ variant: 'outline', size: 'sm' })
            )}
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ===== MAIN TABLE EMPTY COMPONENT =====

export function TableEmpty({
  variant = 'no-data',
  title,
  description,
  icon: CustomIcon,
  illustration,
  primaryAction,
  secondaryAction,
  suggestions,
  size = 'lg',
  surface = 'elevated',
  className,
  loading = false,
  loadingText = 'Loading...',
  ...props
}: TableEmptyProps & React.HTMLAttributes<HTMLDivElement>) {
  // Get variant defaults
  const variantConfig = EmptyStateVariants[variant] || EmptyStateVariants['custom']

  // Determine which icon to use
  const IconComponent = CustomIcon || variantConfig.icon

  // Use loading state if specified
  const isLoading = loading || variant === 'loading'
  const displayTitle = isLoading && loadingText ? loadingText : (title || variantConfig.title)
  const displayDescription = description || variantConfig.description

  return (
    <div
      className={cn(tableEmptyVariants({ size, surface }), className)}
      role="status"
      aria-live={isLoading ? 'polite' : undefined}
      aria-label={isLoading ? `Loading: ${displayTitle}` : `Empty state: ${displayTitle}`}
      {...props}
    >
      {/* Illustration or Icon */}
      {illustration ? (
        <div className="mb-4">
          {illustration}
        </div>
      ) : (
        <div className={emptyIconVariants({ size, variant })}>
          {isLoading ? (
            <LoadingIcon className={emptyIconVariants({ size, variant: 'loading' })} />
          ) : IconComponent && React.isValidElement(IconComponent) ? (
            IconComponent
          ) : IconComponent ? (
            React.createElement(IconComponent as React.ComponentType<{ className?: string }>, {
              className: "h-full w-full"
            })
          ) : null}
        </div>
      )}

      {/* Title */}
      <h3 className={emptyTitleVariants({ size })}>
        {displayTitle}
      </h3>

      {/* Description */}
      {displayDescription && (
        <p className={emptyDescriptionVariants({ size })}>
          {displayDescription}
        </p>
      )}

      {/* Actions (not shown during loading) */}
      {!isLoading && (
        <div className="flex flex-col items-center gap-3">
          {/* Primary Action */}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={cn(
                emptyActionVariants({
                  variant: primaryAction.variant || 'primary',
                  size: size === 'sm' ? 'sm' : 'md'
                })
              )}
            >
              {primaryAction.label}
            </button>
          )}

          {/* Secondary Action */}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={cn(
                emptyActionVariants({
                  variant: 'outline',
                  size: size === 'sm' ? 'sm' : 'md'
                })
              )}
            >
              {secondaryAction.label}
            </button>
          )}

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <SuggestionsList suggestions={suggestions} size={size} />
          )}
        </div>
      )}
    </div>
  )
}

// Export types for external use
export type TableEmptyVariants = VariantProps<typeof tableEmptyVariants>
export { EmptyStateVariants }
