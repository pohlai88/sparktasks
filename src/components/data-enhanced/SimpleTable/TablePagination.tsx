/**
 * TablePagination - Smart Navigation Component
 *
 * Intelligent pagination component with luxury controls and performance optimization for large datasets.
 * Built with MAPS v3.0 design system integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import React from 'react';

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';
import { cn } from '../../../utils/cn';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';
import type { TablePaginationProps } from '../types';

// ===== MAPS v3.0 PAGINATION VARIANTS =====

const paginationVariants = cva(
  [
    // Foundation styling with MAPS tokens
    'flex items-center justify-between gap-4 p-4',
  ],
  {
    variants: {
      position: {
        top: 'border-b',
        bottom: 'border-t',
        both: 'border-y',
      },
      surface: {
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ],
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ],
      },
      size: {
        sm: 'gap-2 px-2 py-2',
        md: 'gap-4 px-4 py-4',
        lg: 'gap-6 px-6 py-6',
      },
    },
    defaultVariants: {
      position: 'bottom',
      surface: 'elevated',
      size: 'md',
    },
  }
);

const paginationButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md',
    'font-medium',
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.colors,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.animation.timing['in-out'],
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
  ],
  {
    variants: {
      variant: {
        default: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
          'border',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          'hover:bg-surface-hover',
        ],
        ghost: [
          'bg-transparent',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
          'hover:bg-surface-hover',
        ],
        active: [
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg,
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg,
        ],
      },
      size: {
        sm: [
          'h-8 w-8 text-sm',
          ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
        ],
        md: ['h-10 w-10', ENHANCED_DESIGN_TOKENS.foundation.typography.button],
        lg: [
          'h-12 w-12',
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
        ],
      },
      disabled: {
        true: [
          'cursor-not-allowed opacity-50',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.disabled,
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
    },
  }
);

const pageInfoVariants = cva(
  [
    'flex items-center gap-2',
    ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
  ],
  {
    variants: {
      size: {
        sm: ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
        md: ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
        lg: ENHANCED_DESIGN_TOKENS.foundation.typography.body,
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const selectVariants = cva(
  [
    'flex h-10 items-center rounded-md border px-3 py-2',
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.colors,
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200] + ' ' + ENHANCED_DESIGN_TOKENS.foundation.animation.timing['in-out'],
  ],
  {
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
  }
);

// Utility variants for consistent styling
const flexCenterGap2Variants = cva(['flex items-center gap-2']);
const flexCenterGap4Variants = cva(['flex items-center gap-4']);
const iconSizeVariants = cva(['h-4 w-4']);
const flexGap1Variants = cva(['flex gap-1']);

// ===== PAGE SIZE SELECTOR COMPONENT =====

function PageSizeSelector({
  pageSize,
  options = [10, 25, 50, 100],
  onChange,
  size = 'md',
}: {
  pageSize: number;
  options?: number[];
  onChange?: (size: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={flexCenterGap2Variants()}>
      <span className={pageInfoVariants({ size })}>Rows per page:</span>
      <select
        value={pageSize}
        onChange={e => onChange?.(Number(e.target.value))}
        className={selectVariants({ size })}
        aria-label='Rows per page'
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// ===== QUICK JUMPER COMPONENT =====

function QuickJumper({
  currentPage,
  totalPages,
  onPageChange,
  size = 'md',
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [inputValue, setInputValue] = React.useState(currentPage.toString());

  React.useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={flexCenterGap2Variants()}>
      <span className={pageInfoVariants({ size })}>Go to page:</span>
      <input
        type='number'
        min='1'
        max={totalPages}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className={cn(selectVariants({ size }), 'w-20 text-center')}
        aria-label={`Go to page, current page ${currentPage} of ${totalPages}`}
      />
      <span className={pageInfoVariants({ size })}>of {totalPages}</span>
    </form>
  );
}

// ===== PAGE INFO COMPONENT =====

function PageInfo({
  currentPage,
  totalPages: _totalPages,
  totalItems,
  pageSize,
  showTotal = true,
  size = 'md',
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  showTotal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!showTotal) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={pageInfoVariants({ size })}>
      Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{' '}
      {totalItems.toLocaleString()} entries
    </div>
  );
}

// ===== PAGE BUTTONS COMPONENT =====

function PageButtons({
  currentPage,
  totalPages,
  onPageChange,
  adjacentCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  size = 'md',
  ariaLabel,
  pageAriaLabel,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  adjacentCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  pageAriaLabel?: (page: number) => string;
}) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    // Always include boundary pages
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      pages.push(i);
    }

    // Calculate range around current page
    const start = Math.max(boundaryCount + 1, currentPage - adjacentCount);
    const end = Math.min(
      totalPages - boundaryCount,
      currentPage + adjacentCount
    );

    // Add ellipsis if there's a gap
    if (start > boundaryCount + 1) {
      pages.push('ellipsis');
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i > boundaryCount) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap
    if (end < totalPages - boundaryCount) {
      pages.push('ellipsis');
    }

    // Add final boundary pages
    for (
      let i = Math.max(totalPages - boundaryCount + 1, end + 1);
      i <= totalPages;
      i++
    ) {
      if (i > boundaryCount) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role='navigation'
      aria-label={ariaLabel || 'Pagination navigation'}
      className={flexGap1Variants()}
    >
      {/* First Page Button */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            paginationButtonVariants({
              variant: 'ghost',
              size,
              disabled: currentPage === 1,
            })
          )}
          aria-label='Go to first page'
        >
          <ChevronsLeftIcon className={iconSizeVariants()} />
          <VisuallyHidden>First page</VisuallyHidden>
        </button>
      )}

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          paginationButtonVariants({
            variant: 'ghost',
            size,
            disabled: currentPage === 1,
          })
        )}
        aria-label='Go to previous page'
      >
        <ChevronLeftIcon className={iconSizeVariants()} />
        <VisuallyHidden>Previous page</VisuallyHidden>
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={cn(
                paginationButtonVariants({ variant: 'ghost', size }),
                'cursor-default'
              )}
            >
              <MoreHorizontalIcon className={iconSizeVariants()} />
              <VisuallyHidden>More pages</VisuallyHidden>
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              paginationButtonVariants({
                variant: isActive ? 'active' : 'default',
                size,
              })
            )}
            aria-label={
              pageAriaLabel ? pageAriaLabel(page) : `Go to page ${page}`
            }
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          paginationButtonVariants({
            variant: 'ghost',
            size,
            disabled: currentPage === totalPages,
          })
        )}
        aria-label='Go to next page'
      >
        <ChevronRightIcon className={iconSizeVariants()} />
        <VisuallyHidden>Next page</VisuallyHidden>
      </button>

      {/* Last Page Button */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            paginationButtonVariants({
              variant: 'ghost',
              size,
              disabled: currentPage === totalPages,
            })
          )}
          aria-label='Go to last page'
        >
          <ChevronsRightIcon className={iconSizeVariants()} />
          <VisuallyHidden>Last page</VisuallyHidden>
        </button>
      )}
    </nav>
  );
}

// ===== MAIN TABLE PAGINATION COMPONENT =====

export function TablePagination({
  // Pagination State
  currentPage,
  totalPages,
  totalItems,
  pageSize,

  // Navigation
  onPageChange,
  onPageSizeChange,

  // Display Options
  showSizeChanger = false,
  pageSizeOptions = [10, 25, 50, 100],
  showQuickJumper = false,
  showTotal = true,

  // Advanced Features
  showFirstLast = true,
  adjacentCount = 1,
  boundaryCount = 1,

  // Performance
  virtualized = false,
  loadingMore = false,
  onLoadMore,

  // Customization
  size = 'md',
  surface = 'elevated',
  position = 'bottom',
  className,

  // Accessibility
  ariaLabel,
  pageAriaLabel,

  ...props
}: TablePaginationProps & React.HTMLAttributes<HTMLDivElement>) {
  // Don't render if no pages
  if (totalPages <= 1 && !showSizeChanger) {
    return null;
  }

  // Infinite scroll mode
  if (virtualized && onLoadMore) {
    return (
      <div
        className={cn(
          paginationVariants({ position, surface, size }),
          className
        )}
        {...props}
      >
        <PageInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          showTotal={showTotal}
          size={size}
        />

        <div className={flexCenterGap4Variants()}>
          {loadingMore ? (
            <span className={pageInfoVariants({ size })}>Loading more...</span>
          ) : (
            <button
              onClick={onLoadMore}
              className={cn(
                paginationButtonVariants({ variant: 'default', size })
              )}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    );
  }

  // Standard pagination mode
  return (
    <div
      className={cn(paginationVariants({ position, surface, size }), className)}
      {...props}
    >
      {/* Left Section - Page Info */}
      <div className={flexCenterGap4Variants()}>
        <PageInfo
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          showTotal={showTotal}
          size={size}
        />

        {/* Page Size Selector */}
        {showSizeChanger && onPageSizeChange && (
          <PageSizeSelector
            pageSize={pageSize}
            options={pageSizeOptions}
            onChange={onPageSizeChange}
            size={size}
          />
        )}
      </div>

      {/* Center Section - Page Navigation */}
      <PageButtons
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        adjacentCount={adjacentCount}
        boundaryCount={boundaryCount}
        showFirstLast={showFirstLast}
        size={size}
        {...(ariaLabel && { ariaLabel })}
        {...(pageAriaLabel && { pageAriaLabel })}
      />

      {/* Right Section - Quick Jumper */}
      {showQuickJumper && (
        <QuickJumper
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          size={size}
        />
      )}
    </div>
  );
}

// Export types for external use
export type TablePaginationVariants = VariantProps<typeof paginationVariants>;
