/**
 * SimpleTable - Universal Data Table Component
 *
 * Covers 80% of table use cases with excellent performance and accessibility.
 * Built on TanStack Table with MAPS v3.0 design system integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type RowSelectionState,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react'
import React from 'react'

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens'
import { cn } from '../../../utils/cn'
import { VisuallyHidden } from '../../primitives/VisuallyHidden'
import type { SimpleTableProps } from '../types'

// ===== MAPS v3.0 TABLE VARIANTS =====

const simpleTableVariants = cva([
  // Foundation styling with MAPS tokens
  'w-full border-separate border-spacing-0 overflow-hidden',
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
  'border rounded-lg',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
], {
  variants: {
    density: {
      compact: [
        ENHANCED_DESIGN_TOKENS.foundation.typography.caption2,
        '[&_th]:py-2 [&_td]:py-2',
      ],
      comfortable: [
        ENHANCED_DESIGN_TOKENS.foundation.typography.body,
        '[&_th]:py-3 [&_td]:py-3',
      ],
      spacious: [
        ENHANCED_DESIGN_TOKENS.foundation.typography.callout,
        '[&_th]:py-4 [&_td]:py-4',
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
    striped: {
      true: '[&_tbody_tr:nth-child(odd)]:bg-muted/30',
      false: '',
    },
  },
  defaultVariants: {
    density: 'comfortable',
    surface: 'elevated',
    striped: false,
  },
})

const tableHeaderVariants = cva([
  'text-left font-medium border-b transition-colors',
  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2,
], {
  variants: {
    sortable: {
      true: [
        'cursor-pointer select-none',
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
      ],
      false: '',
    },
  },
  defaultVariants: {
    sortable: false,
  },
})

const tableRowVariants = cva([
  'border-b transition-colors group',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
  ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
], {
  variants: {
    selectable: {
      true: [
        'cursor-pointer',
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.within,
      ],
      false: '',
    },
    selected: {
      true: [
        'bg-accent/10',
        'hover:bg-accent/15',
      ],
      false: '',
    },
  },
  defaultVariants: {
    selectable: false,
    selected: false,
  },
})

const tableCellVariants = cva([
  'px-4',
  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
])

// ===== LOADING SKELETON COMPONENT =====

function TableSkeleton({
  density = 'comfortable',
  surface = 'elevated'
}: {
  density?: 'compact' | 'comfortable' | 'spacious'
  surface?: 'elevated' | 'glass'
}) {
  const rowHeight = density === 'compact' ? 'h-8' : density === 'comfortable' ? 'h-12' : 'h-16'

  return (
    <div className={cn(simpleTableVariants({ density, surface }))}>
      <div className="space-y-2 p-4">
        {/* Header skeleton */}
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted animate-pulse rounded flex-1" />
          ))}
        </div>

        {/* Row skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn('flex gap-4', rowHeight, 'items-center')}>
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-3 bg-muted/60 animate-pulse rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== SORT INDICATOR COMPONENT =====

function SortIndicator({
  sortDirection
}: {
  sortDirection: false | 'asc' | 'desc'
}) {
  if (!sortDirection) return null

  const Icon = sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon

  return (
    <Icon
      className={cn(
        'ml-2 h-4 w-4',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.accent
      )}
    />
  )
}

// ===== MAIN SIMPLE TABLE COMPONENT =====

export function SimpleTable<TData>({
  data,
  columns,
  loading = false,
  error = null,
  density = 'comfortable',
  surface = 'elevated',
  striped = false,
  sortable = true,
  filterable = false,
  selectable = false,
  onRowClick,
  pagination,
  className,
  emptyState,
  rowActions,
  ...props
}: SimpleTableProps<TData> & React.TableHTMLAttributes<HTMLTableElement>) {
  // State management for table features
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  // Configure table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: Boolean(selectable),
    enableSorting: sortable,
    enableColumnFilters: filterable,
    initialState: {
      pagination: {
        pageSize: pagination?.pageSize || 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  // Early returns for different states
  if (loading) {
    return <TableSkeleton density={density} surface={surface} />
  }

  if (error) {
    return (
      <div className={cn(simpleTableVariants({ density, surface }), 'p-8 text-center')}>
        <div className={ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary}>
          <p>Failed to load table data</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn(simpleTableVariants({ density, surface }))}>
        {emptyState}
      </div>
    )
  }

  return (
    <div
      className={cn(simpleTableVariants({ density, surface, striped }), className)}
      role="table"
      aria-label="Data table"
      {...props}
    >
      <table className="w-full">
        {/* Table Header */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sortDirection = header.column.getIsSorted()

                return (
                  <th
                    key={header.id}
                    className={cn(
                      tableHeaderVariants({ sortable: canSort }),
                      'px-4 first:rounded-tl-lg last:rounded-tr-lg'
                    )}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    onKeyDown={canSort ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        header.column.toggleSorting()
                      }
                    } : undefined}
                    tabIndex={canSort ? 0 : undefined}
                    role={canSort ? 'button' : undefined}
                    aria-sort={
                      sortDirection
                        ? sortDirection === 'asc' ? 'ascending' : 'descending'
                        : canSort ? 'none' : undefined
                    }
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                      }
                      {canSort && <SortIndicator sortDirection={sortDirection} />}
                    </div>
                  </th>
                )
              })}
              {rowActions && (
                <th className={cn(tableHeaderVariants(), 'px-4 w-[100px]')}>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </th>
              )}
            </tr>
          ))}
        </thead>

        {/* Table Body */}
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isSelected = row.getIsSelected()
            const isClickable = Boolean(onRowClick)

            return (
              <tr
                key={row.id}
                className={cn(
                  tableRowVariants({
                    selectable: isClickable,
                    selected: isSelected
                  }),
                  'last:border-b-0'
                )}
                onClick={isClickable ? () => onRowClick?.(row.original) : undefined}
                onKeyDown={isClickable ? (e) => {
                  if (e.key === 'Enter') {
                    onRowClick?.(row.original)
                  }
                } : undefined}
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? 'button' : undefined}
                aria-selected={isSelected ? 'true' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(tableCellVariants())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {rowActions && (
                  <td className={cn(tableCellVariants(), 'w-[100px]')}>
                    <div className="flex items-center gap-2">
                      {rowActions(row.original)}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Export types for external use
export type SimpleTableVariants = VariantProps<typeof simpleTableVariants>
