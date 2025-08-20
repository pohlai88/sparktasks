import React, { forwardRef, useMemo, useCallback } from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type TagVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'solid'
  | 'ghost'
  | 'accent';

export type TagSize = 'xs' | 'sm' | 'md' | 'lg';

export type TagStatus = 'success' | 'warning' | 'danger' | 'info';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  size?: TagSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  ariaLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  status?: TagStatus;
  interactive?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  counter?: number;
  maxCounter?: number;
  pulse?: boolean;
  truncate?: boolean;
}

// ===== MEMOIZED STATUS ICONS =====

const StatusIcon: React.FC<{ status: TagStatus; size: TagSize }> = React.memo(({ status, size }) => {
  const iconSize = useMemo(() => {
    switch (size) {
      case 'xs': return 'size-2.5';
      case 'sm': return 'size-3';
      case 'md': return 'size-3.5';
      case 'lg': return 'size-4';
      default: return 'size-3';
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
    case 'success':
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'danger':
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'info':
      return (
        <svg {...iconProps}>
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
});

StatusIcon.displayName = 'TagStatusIcon';

// ===== LOADING SKELETON =====
const TagSkeleton: React.FC<{ size?: TagSize }> = React.memo(({ size = 'md' }) => (
  <span
    className={combineTokens(
      DESIGN_TOKENS.recipe.badge,
      DESIGN_TOKENS.recipe.badgeDefault,
      DESIGN_TOKENS.sizing.badge[size === 'xs' ? 'sm' : size],
      DESIGN_TOKENS.recipe.skeleton?.button ??
        'animate-pulse bg-slate-200 text-transparent dark:bg-slate-700'
    )}
    aria-hidden="true"
    data-variant="skeleton"
    data-size={size}
    data-testid="tag-skeleton"
  >
    <span className="inline-block w-8">&nbsp;</span>
  </span>
));

TagSkeleton.displayName = 'TagSkeleton';

// ===== MAIN TAG COMPONENT =====
const TagComponent = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    children,
    variant = 'default',
    size = 'md',
    icon,
    className,
    ariaLabel,
    loading = false,
    disabled = false,
    status,
    interactive = false,
    selected = false,
    onSelect,
    removable = false,
    onRemove,
    counter,
    maxCounter = 99,
    pulse = false,
    truncate = false,
    onClick,
    onKeyDown,
    ...props
  },
  ref
) {
  // Memoized variant mappings for O(1) lookups
  const variantClasses = useMemo(() => ({
    default: DESIGN_TOKENS.recipe.badgeDefault,
    success: DESIGN_TOKENS.recipe.badgeSuccess,
    warning: DESIGN_TOKENS.recipe.badgeWarning,
    danger: DESIGN_TOKENS.recipe.badgeDanger,
    info: DESIGN_TOKENS.recipe.badgeInfo,
    outline: DESIGN_TOKENS.recipe.badgeOutline,
    solid: DESIGN_TOKENS.recipe.badgeDefault,
    ghost: DESIGN_TOKENS.recipe.badgeOutline,
    accent: DESIGN_TOKENS.recipe.badgeInfo,
  }), []);

  // Memoized size classes
  const sizeClasses = useMemo(() => ({
    xs: DESIGN_TOKENS.sizing.badge.sm,
    sm: DESIGN_TOKENS.sizing.badge.sm,
    md: DESIGN_TOKENS.sizing.badge.md,
    lg: DESIGN_TOKENS.sizing.badge.lg,
  }), []);

  // Memoized status labels for accessibility
  const statusLabels = useMemo(() => ({
    success: 'Success',
    warning: 'Warning',
    danger: 'Error',
    info: 'Information',
  }), []);

  // Stable remove handler
  const handleRemove = useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    onRemove?.();
  }, [onRemove]);

  // Stable select handler
  const handleSelect = useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
    if (disabled) return;
    onSelect?.();
    onClick?.(event as React.MouseEvent<HTMLSpanElement>);
  }, [disabled, onSelect, onClick]);

  // Stable keyboard handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;

    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleSelect(event);
    }
    
    if (removable && (event.key === 'Delete' || event.key === 'Backspace')) {
      event.preventDefault();
      handleRemove(event);
    }
    
    onKeyDown?.(event);
  }, [disabled, interactive, removable, handleSelect, handleRemove, onKeyDown]);

  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const hasStatus = Boolean(status);
  const hasRemove = removable && onRemove;
  const isSelectable = Boolean(onSelect) || interactive;
  const isInteractive = isSelectable || hasRemove;
  const hasCounter = typeof counter === 'number' && counter > 0;
  const displayCounter = hasCounter ? (counter! > maxCounter ? `${maxCounter}+` : counter!.toString()) : '';

  // Compute final className with memoized classes
  const tagClassName = useMemo(() => 
    combineTokens(
      DESIGN_TOKENS.recipe.badge,
      variantClass,
      sizeClass,
      selected && 'ring-2 ring-blue-500 ring-offset-1',
      disabled && 'opacity-50 cursor-not-allowed',
      isInteractive && !disabled && 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      pulse && 'animate-pulse',
      truncate && 'max-w-xs truncate',
      className
    ),
    [variantClass, sizeClass, selected, disabled, isInteractive, pulse, truncate, className]
  );

  // Early return for loading state
  if (loading) {
    return <TagSkeleton size={size} />;
  }

  return (
    <span
      ref={ref}
      className={tagClassName}
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
      data-removable={hasRemove ? 'true' : 'false'}
      data-testid="tag"
      onClick={isSelectable && !disabled ? handleSelect : undefined}
      onKeyDown={isInteractive && !disabled ? handleKeyDown : undefined}
      title={truncate && typeof children === 'string' ? children : undefined}
      {...props}
    >
      {hasStatus && (
        <>
          <span className="mr-1 inline-flex items-center" aria-hidden="true">
            <StatusIcon status={status!} size={size} />
          </span>
          {!ariaLabel && (
            <span className="sr-only">
              {statusLabels[status!]}
            </span>
          )}
        </>
      )}
      
      {icon && !hasStatus && (
        <span className="mr-1 inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className={combineTokens('inline-flex items-center', truncate && 'truncate')}>
        {children}
      </span>

      {hasCounter && (
        <span 
          className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-100 px-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          aria-label={`Count: ${counter}`}
          data-testid="tag-counter"
        >
          {displayCounter}
        </span>
      )}
      
      {hasRemove && (
        <button
          type="button"
          className={combineTokens(
            'ml-1 inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-1 focus:ring-inset hover:bg-black/10 dark:hover:bg-white/10',
            size === 'xs' ? 'size-3' : size === 'sm' ? 'size-4' : size === 'md' ? 'size-5' : 'size-6',
            DESIGN_TOKENS.focus?.onLight ?? 'focus:ring-white/20'
          )}
          onClick={handleRemove}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRemove(e);
            }
          }}
          aria-label={ariaLabel ? `Remove ${ariaLabel}` : 'Remove tag'}
          data-testid="tag-remove-button"
          disabled={disabled}
        >
          <svg
            className={size === 'xs' ? 'size-2' : size === 'sm' ? 'size-2.5' : size === 'md' ? 'size-3' : 'size-3.5'}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
});

TagComponent.displayName = 'Tag';

// ===== COMPOUND COMPONENT EXPORT =====
export const Tag = TagComponent;
