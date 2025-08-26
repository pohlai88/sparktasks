/**
 * TableToolbar - Table Control Hub Component
 *
 * Centralized control panel for table operations including search, filters, bulk actions, and view options.
 * Built with MAPS v3.0 design system integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { cva, type VariantProps } from 'class-variance-authority'
import {
  SearchIcon,
  RefreshCwIcon,
  DownloadIcon,
  SlidersHorizontalIcon,
  MoreHorizontalIcon,
  GridIcon,
  ListIcon,
  LayoutIcon
} from 'lucide-react'
import React from 'react'

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens'
import { cn } from '../../../utils/cn'
import { VisuallyHidden } from '../../primitives/VisuallyHidden'
import type { TableToolbarProps, TableFilter, BulkAction } from '../types'

// ===== MAPS v3.0 TOOLBAR VARIANTS =====

const tableToolbarVariants = cva([
  // Foundation styling with MAPS tokens
  'flex items-center justify-between gap-4 p-4',
  'border-b',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
], {
  variants: {
    position: {
      above: 'border-b',
      below: 'border-t border-b-0',
      floating: [
        'rounded-lg border shadow-md',
        ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.md,
      ],
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
    position: 'above',
    surface: 'elevated',
  },
})

const toolbarSectionVariants = cva([
  'flex items-center gap-2',
])

const searchInputVariants = cva([
  'flex h-10 w-full rounded-md border px-3 py-2',
  'placeholder:text-muted-foreground',
  'transition-colors',
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
  ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
  ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
  ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
], {
  variants: {
    size: {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3',
      lg: 'h-12 px-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const toolbarButtonVariants = cva([
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
      ghost: [
        'bg-transparent',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      ],
      destructive: [
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
        'hover:bg-destructive/90',
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
    variant: 'default',
    size: 'md',
  },
})

const densityToggleVariants = cva([
  'flex items-center gap-1 rounded-md border p-1',
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2,
  ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
])

const densityOptionVariants = cva([
  'inline-flex items-center justify-center rounded-sm px-2 py-1',
  'text-sm font-medium transition-colors',
  ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
], {
  variants: {
    active: {
      true: [
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg,
      ],
      false: [
        'bg-transparent',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      ],
    },
  },
  defaultVariants: {
    active: false,
  },
})

const bulkActionsVariants = cva([
  'flex items-center gap-2 rounded-md border px-3 py-2',
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2,
  ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
  ENHANCED_DESIGN_TOKENS.foundation.materials.elevation.sm,
])

// ===== SEARCH INPUT COMPONENT =====

function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  size = 'md',
  className,
}: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          searchInputVariants({ size }),
          'pl-10',
          className
        )}
      />
    </div>
  )
}

// ===== DENSITY TOGGLE COMPONENT =====

function DensityToggle({
  value,
  onChange,
  show = true,
}: {
  value?: 'compact' | 'comfortable' | 'spacious'
  onChange?: (density: string) => void
  show?: boolean
}) {
  if (!show) return null

  const densityOptions = [
    { value: 'compact', icon: ListIcon, label: 'Compact' },
    { value: 'comfortable', icon: LayoutIcon, label: 'Comfortable' },
    { value: 'spacious', icon: GridIcon, label: 'Spacious' },
  ]

  return (
    <div className={densityToggleVariants()}>
      {densityOptions.map((option) => {
        const Icon = option.icon
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            onClick={() => onChange?.(option.value)}
            className={cn(densityOptionVariants({ active: isActive }))}
            title={option.label}
            aria-label={`Set ${option.label} density`}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}

// ===== BULK ACTIONS COMPONENT =====

function BulkActions({
  selectedCount,
  actions,
  onAction,
}: {
  selectedCount: number
  actions: BulkAction[]
  onAction?: (action: string, selectedRows: unknown[]) => void
}) {
  if (selectedCount === 0) return null

  const handleAction = async (action: BulkAction) => {
    if (action.confirmMessage) {
      const confirmed = globalThis.confirm(action.confirmMessage)
      if (!confirmed) return
    }

    onAction?.(action.id, []) // selectedRows would be passed from parent
  }

  return (
    <div className={bulkActionsVariants()}>
      <span className={cn(
        'text-sm',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
      )}>
        {selectedCount} selected
      </span>

      <div className="flex items-center gap-1">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className={cn(
                toolbarButtonVariants({
                  variant: action.variant === 'destructive' ? 'destructive' : 'ghost',
                  size: 'sm'
                })
              )}
              title={action.label}
            >
              {Icon && React.isValidElement(Icon) ? Icon : Icon && typeof Icon === 'function' ? React.createElement(Icon as React.ComponentType<{ className?: string }>, { className: "h-4 w-4" }) : null}
              <VisuallyHidden>{action.label}</VisuallyHidden>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ===== FILTER INDICATOR COMPONENT =====

function FilterIndicator({
  filters,
  onClearFilters,
}: {
  filters: TableFilter[]
  onClearFilters?: () => void
}) {
  const activeFilters = filters.filter(f => f.value !== undefined && f.value !== '' && f.value !== null)

  if (activeFilters.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        'text-sm',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary
      )}>
        {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
      </span>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className={cn(
            toolbarButtonVariants({ variant: 'ghost', size: 'sm' })
          )}
        >
          Clear all
        </button>
      )}
    </div>
  )
}

// ===== MAIN TABLE TOOLBAR COMPONENT =====

export function TableToolbar({
  // Search & Filter
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',

  // Filter System
  filters = [],
  onFilterChange,

  // Bulk Actions
  selectedCount = 0,
  bulkActions = [],
  onBulkAction,

  // View Controls
  density = 'comfortable',
  onDensityChange,
  showDensityToggle = true,

  // Data Operations
  onRefresh,
  onExport,
  showExport = false,

  // Custom Actions
  primaryAction,

  // Layout
  position = 'above',
  surface = 'elevated',
  className,
  ...props
}: TableToolbarProps & React.HTMLAttributes<HTMLDivElement>) {
  const hasActiveFilters = filters.some(f => f.value !== undefined && f.value !== '' && f.value !== null)

  return (
    <div
      className={cn(tableToolbarVariants({ position, surface }), className)}
      role="toolbar"
      aria-label="Table controls"
      {...props}
    >
      {/* Left Section - Search and Filters */}
      <div className={toolbarSectionVariants()}>
        {/* Search Input */}
        {onSearchChange && (
          <div className="min-w-[200px] max-w-[400px]">
            <SearchInput
              value={searchValue ?? ''}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
        )}

        {/* Filter Indicator */}
        <FilterIndicator
          filters={filters}
          onClearFilters={() => onFilterChange?.([])}
        />

        {/* Filter Button */}
        {onFilterChange && (
          <button
            className={cn(
              toolbarButtonVariants({ variant: hasActiveFilters ? 'primary' : 'ghost' })
            )}
            title="Configure filters"
          >
            <SlidersHorizontalIcon className="h-4 w-4" />
            Filters
          </button>
        )}
      </div>

      {/* Center Section - Bulk Actions */}
      {selectedCount > 0 && onBulkAction && (
        <BulkActions
          selectedCount={selectedCount}
          actions={bulkActions}
          onAction={onBulkAction}
        />
      )}

      {/* Right Section - Actions and Controls */}
      <div className={toolbarSectionVariants()}>
        {/* Density Toggle */}
        {onDensityChange && (
          <DensityToggle
            value={density}
            onChange={onDensityChange}
            show={showDensityToggle}
          />
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className={cn(toolbarButtonVariants({ variant: 'ghost' }))}
            title="Refresh data"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </button>
        )}

        {/* Export Button */}
        {showExport && onExport && (
          <button
            onClick={() => onExport('csv')}
            className={cn(toolbarButtonVariants({ variant: 'ghost' }))}
            title="Export data"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
        )}

        {/* Primary Action */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className={cn(toolbarButtonVariants({ variant: 'primary' }))}
          >
            {primaryAction.icon}
            {primaryAction.label}
          </button>
        )}

        {/* More Options */}
        <button
          className={cn(toolbarButtonVariants({ variant: 'ghost' }))}
          title="More options"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Export types for external use
export type TableToolbarVariants = VariantProps<typeof tableToolbarVariants>
