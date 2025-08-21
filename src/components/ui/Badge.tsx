import React, { forwardRef, useMemo, useCallback } from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'inline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  ariaLabel?: string;
  loading?: boolean;
  status?: BadgeStatus;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  pulse?: boolean;
  interactive?: boolean;
}

// ===== MODULE CONSTANTS FOR PERFORMANCE =====

const VARIANT_CLASS = {
  default: DESIGN_TOKENS.recipe.badgeDefault,
  success: DESIGN_TOKENS.recipe.badgeSuccess,
  warning: DESIGN_TOKENS.recipe.badgeWarning,
  danger: DESIGN_TOKENS.recipe.badgeDanger,
  info: DESIGN_TOKENS.recipe.badgeInfo,
  outline: DESIGN_TOKENS.recipe.badgeOutline,
  inline: DESIGN_TOKENS.recipe.badgeInline,
} as const;

const SIZE_CLASS = {
  sm: DESIGN_TOKENS.sizing.badge.sm,
  md: DESIGN_TOKENS.sizing.badge.md,
  lg: DESIGN_TOKENS.sizing.badge.lg,
} as const;

const STATUS_LABEL: Record<BadgeStatus, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Error',
  info: 'Information',
};

// ===== MEMOIZED STATUS ICONS =====

const StatusIcon: React.FC<{ status: BadgeStatus }> = React.memo(
  ({ status }) => {
    const iconProps = {
      className: 'size-3',
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
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4A1 1 0 015.12 9.293L8 12.172l7.293-7.293z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'warning':
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M8.257 3.099a2 2 0 013.486 0l5.58 9.92A2 2 0 0115.58 17H4.42a2 2 0 01-1.743-3.98l5.58-9.92zM11 14H9v-2h2v2zm0-4H9V7h2v3z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'danger':
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-3a1 1 0 10-2 0v4a1 1 0 102 0V7zM9 14a1 1 0 102 0 1 1 0 00-2 0z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'info':
        return (
          <svg {...iconProps}>
            <path
              fillRule='evenodd'
              d='M18 10A8 8 0 112 10a8 8 0 0116 0zM9 8a1 1 0 102 0 1 1 0 00-2 0zm1 2a1 1 0 00-1 1v3a1 1 0 001 1h1a1 1 0 100-2v-2a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        );
      default:
        return null;
    }
  }
);

StatusIcon.displayName = 'BadgeStatusIcon';
// ===== LOADING SKELETON =====
const BadgeSkeleton: React.FC<{ size?: BadgeSize }> = React.memo(
  ({ size = 'md' }) => (
    <span
      className={combineTokens(
        DESIGN_TOKENS.recipe.badge,
        DESIGN_TOKENS.recipe.badgeDefault,
        DESIGN_TOKENS.sizing.badge[size],
        DESIGN_TOKENS.recipe.skeleton?.button ??
          'animate-pulse bg-slate-200 text-transparent dark:bg-slate-700'
      )}
      aria-hidden='true'
      data-variant='skeleton'
      data-size={size}
      data-testid='badge-skeleton'
    >
      &nbsp;
    </span>
  )
);

BadgeSkeleton.displayName = 'BadgeSkeleton';

// ===== MAIN BADGE COMPONENT =====
const BadgeComponent = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    variant = 'default',
    size = 'md',
    icon,
    className,
    ariaLabel,
    loading = false,
    status,
    dismissible = false,
    onDismiss,
    pulse = false,
    interactive = false,
    onClick,
    onKeyDown,
    onKeyUp,
    ...props
  },
  ref
) {
  // Use module constants for O(1) lookups (no useMemo needed)
  const variantClass = VARIANT_CLASS[variant];
  const sizeClass = SIZE_CLASS[size];
  const isDismissible = dismissible && onDismiss;
  const isInteractive = interactive || isDismissible;

  // Stable dismiss handler
  const handleDismiss = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      onDismiss?.();
    },
    [onDismiss]
  );

  // WAI-ARIA Button Pattern: Enter on keydown, Space on keyup
  const handleActivate = useCallback(() => {
    // Call onClick directly - most handlers don't actually need the event object
    onClick?.({} as React.MouseEvent<HTMLSpanElement>);
  }, [onClick]);

  const handleKeyDownWrapped = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      // Enter triggers on keydown per WAI-ARIA
      if (isInteractive && event.key === 'Enter') {
        event.preventDefault();
        handleActivate();
      }

      if (
        isDismissible &&
        (event.key === 'Delete' || event.key === 'Backspace')
      ) {
        event.preventDefault();
        handleDismiss(event);
      }

      // Always call user's handler
      onKeyDown?.(event);
    },
    [isInteractive, isDismissible, handleActivate, handleDismiss, onKeyDown]
  );

  const handleKeyUpWrapped = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      // Space triggers on keyup per WAI-ARIA
      if (isInteractive && (event.key === ' ' || event.key === 'Spacebar')) {
        event.preventDefault();
        handleActivate();
      }

      // Always call user's handler
      onKeyUp?.(event);
    },
    [isInteractive, handleActivate, onKeyUp]
  );

  // Compute final className with improved focus tokens and motion respect
  const badgeClassName = useMemo(
    () =>
      combineTokens(
        DESIGN_TOKENS.recipe.badge,
        variantClass,
        sizeClass,
        pulse &&
          combineTokens(
            'animate-pulse',
            DESIGN_TOKENS.motion?.respectReduced ?? 'motion-reduce:animate-none'
          ),
        isInteractive &&
          combineTokens(
            'cursor-pointer hover:opacity-80',
            DESIGN_TOKENS.focus?.onLight ??
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            DESIGN_TOKENS.focus?.forcedColors ?? ''
          ),
        className
      ),
    [variantClass, sizeClass, pulse, isInteractive, className]
  );

  // Early return for loading state
  if (loading) {
    return <BadgeSkeleton size={size} />;
  }

  return (
    <span
      ref={ref}
      className={badgeClassName}
      role={isInteractive ? 'button' : undefined}
      aria-label={ariaLabel}
      tabIndex={isInteractive ? 0 : undefined}
      data-variant={variant}
      data-size={size}
      data-status={status || undefined}
      data-interactive={isInteractive ? 'true' : undefined}
      data-dismissible={isDismissible ? 'true' : undefined}
      data-testid='badge'
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDownWrapped}
      onKeyUp={handleKeyUpWrapped}
      {...props}
    >
      {/* Status icon + inner live region (not on container) */}
      {status && (
        <>
          <span
            className={combineTokens(
              DESIGN_TOKENS.spacing.margin.r.md,
              DESIGN_TOKENS.layout.flexCenter
            )}
            aria-hidden='true'
          >
            <StatusIcon status={status} />
          </span>
          {/* Inner polite live region for status announcements */}
          <span
            role='status'
            aria-live='polite'
            className={combineTokens('sr-only')}
          >
            {STATUS_LABEL[status]}
          </span>
        </>
      )}

      {icon && (
        <span
          className={combineTokens(
            'mr-1',
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

      {isDismissible && (
        <button
          type='button'
          className={combineTokens(
            DESIGN_TOKENS.recipe.iconButtonDefault ??
              'inline-flex items-center justify-center rounded-full focus:outline-none',
            'ml-1 size-4',
            DESIGN_TOKENS.focus?.onLight ??
              'focus:ring-1 focus:ring-inset focus:ring-white/20',
            DESIGN_TOKENS.focus?.forcedColors ?? '',
            'hover:bg-black/10 dark:hover:bg-white/10'
          )}
          onClick={handleDismiss}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onDismiss?.();
            }
          }}
          aria-label={`Remove ${ariaLabel ?? 'badge'}`}
          data-testid='badge-dismiss-button'
        >
          <svg
            className={combineTokens('size-3')}
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

BadgeComponent.displayName = 'Badge';

// ===== COMPOUND COMPONENT EXPORT =====
export const Badge = BadgeComponent;
