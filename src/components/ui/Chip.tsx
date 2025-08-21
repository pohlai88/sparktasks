import React, { forwardRef, useMemo, useCallback } from 'react';

import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type ChipVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'solid'
  | 'ghost';

export type ChipSize = 'xs' | 'sm' | 'md' | 'lg';

export type ChipStatus = 'success' | 'warning' | 'danger' | 'info';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  ariaLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  status?: ChipStatus;
  interactive?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  avatar?: React.ReactNode;
  counter?: number;
  maxCounter?: number;
}

// ===== MEMOIZED STATUS ICONS =====

const StatusIcon: React.FC<{ status: ChipStatus; size: ChipSize }> = React.memo(
  ({ status, size }) => {
    const iconSize = useMemo(() => {
      switch (size) {
        case 'xs': {
          return 'size-2.5';
        }
        case 'sm': {
          return 'size-3';
        }
        case 'md': {
          return 'size-3.5';
        }
        case 'lg': {
          return 'size-4';
        }
        default: {
          return 'size-3';
        }
      }
    }, [size]);

    const iconProps = {
      className: iconSize,
      fill: 'currentColor',
      viewBox: '0 0 20 20',
      'aria-hidden': 'true' as const,
      focusable: 'false' as const,
    };

    switch (status) {
      case 'success': {
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        );
      }
      case 'warning': {
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        );
      }
      case 'danger': {
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
              clipRule='evenodd'
            />
          </svg>
        );
      }
      case 'info': {
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
        );
      }
      default: {
        return null;
      }
    }
  }
);

StatusIcon.displayName = 'ChipStatusIcon';

// ===== LOADING SKELETON =====
const ChipSkeleton: React.FC<{ size?: ChipSize }> = React.memo(
  ({ size = 'md' }) => (
    <span
      className={combineTokens(
        DESIGN_TOKENS.recipe.chip,
        DESIGN_TOKENS.recipe.badgeDefault,
        DESIGN_TOKENS.sizing.badge[size === 'xs' ? 'sm' : size],
        DESIGN_TOKENS.recipe.skeleton?.button ??
          'animate-pulse bg-slate-200 text-transparent dark:bg-slate-700'
      )}
      aria-hidden='true'
      data-variant='skeleton'
      data-size={size}
      data-testid='chip-skeleton'
    >
      <span
        className={combineTokens(
          DESIGN_TOKENS.layout.spacing.fine.inlineBlock,
          DESIGN_TOKENS.layout.spacing.fine.w12
        )}
      >
        &nbsp;
      </span>
    </span>
  )
);

ChipSkeleton.displayName = 'ChipSkeleton';

// ===== MAIN CHIP COMPONENT =====
const ChipComponent = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    children,
    variant = 'default',
    size = 'md',
    icon,
    onClose,
    className,
    ariaLabel,
    loading = false,
    disabled = false,
    status,
    interactive = false,
    selected = false,
    onSelect,
    avatar,
    counter,
    maxCounter = 99,
    onClick,
    onKeyDown,
    ...props
  },
  ref
) {
  // Memoized variant mappings for O(1) lookups
  const variantClasses = useMemo(
    () => ({
      default: DESIGN_TOKENS.recipe.badgeDefault,
      success: DESIGN_TOKENS.recipe.badgeSuccess,
      warning: DESIGN_TOKENS.recipe.badgeWarning,
      danger: DESIGN_TOKENS.recipe.badgeDanger,
      info: DESIGN_TOKENS.recipe.badgeInfo,
      outline: DESIGN_TOKENS.recipe.badgeOutline,
      solid: DESIGN_TOKENS.recipe.badgeDefault,
      ghost: DESIGN_TOKENS.recipe.badgeOutline,
    }),
    []
  );

  // Memoized size classes
  const sizeClasses = useMemo(
    () => ({
      xs: DESIGN_TOKENS.sizing.badge.sm,
      sm: DESIGN_TOKENS.sizing.badge.sm,
      md: DESIGN_TOKENS.sizing.badge.md,
      lg: DESIGN_TOKENS.sizing.badge.lg,
    }),
    []
  );

  // Memoized status labels for accessibility
  const statusLabels = useMemo(
    () => ({
      success: 'Success',
      warning: 'Warning',
      danger: 'Error',
      info: 'Information',
    }),
    []
  );

  // Stable close handler
  const handleClose = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      onClose?.();
    },
    [onClose]
  );

  // Stable select handler
  const handleSelect = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) return;
      onSelect?.();
      onClick?.(event as React.MouseEvent<HTMLSpanElement>);
    },
    [disabled, onSelect, onClick]
  );

  // Stable keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;

      if (interactive && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        handleSelect(event);
      }

      if (onClose && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        handleClose(event);
      }

      onKeyDown?.(event);
    },
    [disabled, interactive, onClose, handleSelect, handleClose, onKeyDown]
  );

  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const hasStatus = Boolean(status);
  const hasClose = Boolean(onClose);
  const isSelectable = Boolean(onSelect) || interactive;
  const isInteractive = isSelectable || hasClose;
  const hasCounter = typeof counter === 'number' && counter > 0;
  const displayCounter = hasCounter
    ? counter! > maxCounter
      ? `${maxCounter}+`
      : counter!.toString()
    : '';

  // Compute final className with memoized classes
  const chipClassName = useMemo(
    () =>
      combineTokens(
        DESIGN_TOKENS.recipe.chip,
        variantClass,
        sizeClass,
        selected && 'ring-2 ring-blue-500 ring-offset-1',
        disabled && 'opacity-50 cursor-not-allowed',
        isInteractive &&
          !disabled &&
          'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        className
      ),
    [variantClass, sizeClass, selected, disabled, isInteractive, className]
  );

  // Early return for loading state
  if (loading) {
    return <ChipSkeleton size={size} />;
  }

  return (
    <span
      ref={ref}
      className={chipClassName}
      role={isSelectable ? 'button' : hasStatus ? 'status' : undefined}
      aria-live={hasStatus ? 'polite' : undefined}
      aria-busy={loading ? 'true' : undefined}
      aria-label={ariaLabel}
      aria-pressed={isSelectable ? selected : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      data-variant={variant}
      data-size={size}
      data-status={status || undefined}
      data-interactive={isInteractive ? 'true' : 'false'}
      data-selected={selected ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-testid='chip'
      onClick={isSelectable && !disabled ? handleSelect : undefined}
      onKeyDown={isInteractive && !disabled ? handleKeyDown : undefined}
      {...props}
    >
      {avatar && (
        <span
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.mr1_5,
            DESIGN_TOKENS.layout.flex.inline,
            DESIGN_TOKENS.layout.flex.itemsCenter
          )}
          aria-hidden='true'
        >
          {avatar}
        </span>
      )}

      {hasStatus && (
        <>
          <span
            className={combineTokens(
              DESIGN_TOKENS.layout.spacing.fine.mr1,
              DESIGN_TOKENS.layout.flex.inline,
              DESIGN_TOKENS.layout.flex.itemsCenter
            )}
            aria-hidden='true'
          >
            <StatusIcon status={status!} size={size} />
          </span>
          {!ariaLabel && (
            <span className='sr-only'>{statusLabels[status!]}</span>
          )}
        </>
      )}

      {icon && !hasStatus && (
        <span
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.mr1,
            DESIGN_TOKENS.layout.flex.inline,
            DESIGN_TOKENS.layout.flex.itemsCenter
          )}
          aria-hidden='true'
        >
          {icon}
        </span>
      )}

      <span
        className={combineTokens(
          DESIGN_TOKENS.layout.flex.inline,
          DESIGN_TOKENS.layout.flex.itemsCenter
        )}
      >
        {children}
      </span>

      {hasCounter && (
        <span
          className={DESIGN_TOKENS.recipe.chip.countBadge}
          aria-label={`Count: ${counter}`}
          data-testid='chip-counter'
        >
          {displayCounter}
        </span>
      )}

      {hasClose && (
        <button
          type='button'
          className={combineTokens(
            DESIGN_TOKENS.recipe.chip.closeButton,
            size === 'xs'
              ? 'size-3'
              : size === 'sm'
                ? 'size-4'
                : size === 'md'
                  ? 'size-5'
                  : 'size-6',
            DESIGN_TOKENS.focus?.onLight ?? 'focus:ring-white/20'
          )}
          onClick={handleClose}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClose(e);
            }
          }}
          aria-label={ariaLabel ? `Remove ${ariaLabel}` : 'Remove chip'}
          data-testid='chip-close-button'
          disabled={disabled}
        >
          <svg
            className={
              size === 'xs'
                ? 'size-2'
                : size === 'sm'
                  ? 'size-2.5'
                  : size === 'md'
                    ? 'size-3'
                    : 'size-3.5'
            }
            fill='currentColor'
            viewBox='0 0 20 20'
            aria-hidden='true'
            focusable='false'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      )}
    </span>
  );
});

ChipComponent.displayName = 'Chip';

// ===== COMPOUND COMPONENT EXPORT =====
export const Chip = ChipComponent;
