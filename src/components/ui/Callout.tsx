/**
 * Callout Component
 *
 * Enterprise-grade highlighted information blocks for critical content emphasis.
 *
 * Features:
 * - Multiple semantic variants (info, success, warning, error, note)
 * - Icon integration with automatic semantic mapping
 * - Dismissible functionality with animation
 * - Size variants for different contexts
 * - WCAG 2.1 AA compliance with proper contrast and ARIA
 * - Dark mode support through DESIGN_TOKENS
 * - Responsive design with mobile-first approach
 * - Rich content support with nested elements
 *
 * @version 1.0.0
 * @author SparkTasks Enterprise UI Team
 */

import React, { useState, forwardRef } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type CalloutVariant = 'info' | 'success' | 'warning' | 'error' | 'note';
export type CalloutSize = 'sm' | 'md' | 'lg';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic variant determining appearance and icon */
  variant?: CalloutVariant;
  /** Size affecting spacing and typography */
  size?: CalloutSize;
  /** Optional title for the callout */
  title?: string;
  /** Optional icon override (defaults to semantic icon) */
  icon?: React.ReactNode;
  /** Whether to show the default semantic icon */
  showIcon?: boolean;
  /** Whether the callout can be dismissed */
  dismissible?: boolean;
  /** Callback when callout is dismissed */
  onDismiss?: () => void;
  /** Content of the callout */
  children: React.ReactNode;
}

// ===== SEMANTIC ICON MAPPING =====

const getSemanticIcon = (variant: CalloutVariant): React.ReactNode => {
  const iconClasses = combineTokens(
    'h-5 w-5', // Icon size for callout
    'shrink-0'
  );

  switch (variant) {
    case 'info':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      );
    case 'success':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      );
    case 'warning':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
          />
        </svg>
      );
    case 'error':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      );
    case 'note':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      );
    default:
      return null;
  }
};

// ===== STYLE FUNCTIONS =====

const getCalloutClasses = (
  variant: CalloutVariant,
  size: CalloutSize
): string => {
  const baseClasses = combineTokens(
    DESIGN_TOKENS.theme.light.radius.lg,
    DESIGN_TOKENS.layout.flexStart,
    'transition-all duration-200 ease-out',
    'border'
  );

  const variantClasses = {
    info: combineTokens(
      DESIGN_TOKENS.semantic.background.info,
      DESIGN_TOKENS.semantic.border.info,
      DESIGN_TOKENS.semantic.text.info
    ),
    success: combineTokens(
      DESIGN_TOKENS.semantic.background.success,
      DESIGN_TOKENS.semantic.border.success,
      DESIGN_TOKENS.semantic.text.success
    ),
    warning: combineTokens(
      DESIGN_TOKENS.semantic.background.warning,
      DESIGN_TOKENS.semantic.border.warning,
      DESIGN_TOKENS.semantic.text.warning
    ),
    error: combineTokens(
      DESIGN_TOKENS.semantic.background.error,
      DESIGN_TOKENS.semantic.border.error,
      DESIGN_TOKENS.semantic.text.error
    ),
    note: combineTokens(
      DESIGN_TOKENS.theme.light.surface.subtle,
      DESIGN_TOKENS.theme.light.border.subtle,
      DESIGN_TOKENS.semantic.text.muted
    ),
  }[variant];

  const sizeClasses = {
    sm: combineTokens(DESIGN_TOKENS.spacing.sm, 'gap-2'),
    md: combineTokens(DESIGN_TOKENS.spacing.md, 'gap-3'),
    lg: combineTokens(DESIGN_TOKENS.spacing.lg, 'gap-4'),
  }[size];

  return combineTokens(baseClasses, variantClasses, sizeClasses);
};

const getTitleClasses = (size: CalloutSize): string => {
  const sizeClasses = {
    sm: DESIGN_TOKENS.typography.body.small,
    md: DESIGN_TOKENS.typography.body.medium,
    lg: DESIGN_TOKENS.typography.body.large,
  }[size];

  return combineTokens(
    sizeClasses,
    DESIGN_TOKENS.typography.inline.fontSemibold,
    'mb-1'
  );
};

const getContentClasses = (size: CalloutSize): string => {
  const sizeClasses = {
    sm: DESIGN_TOKENS.typography.body.xs,
    md: DESIGN_TOKENS.typography.body.small,
    lg: DESIGN_TOKENS.typography.body.medium,
  }[size];

  return combineTokens(
    sizeClasses,
    DESIGN_TOKENS.semantic.text.muted,
    'leading-relaxed'
  );
};

const getDismissButtonClasses = (): string => {
  return combineTokens(
    'h-4 w-4', // Small icon size
    'shrink-0 rounded transition-colors duration-150',
    DESIGN_TOKENS.semantic.text.muted,
    'hover:bg-black/5 dark:hover:bg-white/5',
    'focus:outline-none focus:ring-2',
    'focus:ring-primary-500 focus:ring-offset-1'
  );
};

// ===== ACCESSIBILITY HELPERS =====

const getAriaRole = (variant: CalloutVariant): string => {
  switch (variant) {
    case 'error':
      return 'alert';
    case 'warning':
      return 'alert';
    case 'success':
      return 'status';
    case 'info':
    case 'note':
    default:
      return 'note';
  }
};

const getAriaLive = (
  variant: CalloutVariant
): 'polite' | 'assertive' | undefined => {
  switch (variant) {
    case 'error':
      return 'assertive';
    case 'warning':
      return 'assertive';
    case 'success':
      return 'polite';
    case 'info':
    case 'note':
    default:
      return 'polite';
  }
};

// ===== MAIN COMPONENT =====

const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      variant = 'info',
      size = 'md',
      title,
      icon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [isDismissed, setIsDismissed] = useState(false);

    const handleDismiss = () => {
      setIsDismissed(true);
      onDismiss?.();
    };

    if (isDismissed) {
      return null;
    }

    const calloutClasses = getCalloutClasses(variant, size);
    const titleClasses = getTitleClasses(size);
    const contentClasses = getContentClasses(size);
    const dismissButtonClasses = getDismissButtonClasses();

    const semanticIcon = showIcon ? icon || getSemanticIcon(variant) : null;
    const ariaRole = getAriaRole(variant);
    const ariaLive = getAriaLive(variant);

    return (
      <div
        ref={ref}
        role={ariaRole}
        aria-live={ariaLive}
        className={combineTokens(calloutClasses, className)}
        {...props}
      >
        {/* Icon */}
        {semanticIcon && (
          <div
            className={combineTokens(DESIGN_TOKENS.layout.flex.shrinkNone)}
            aria-hidden='true'
          >
            {semanticIcon}
          </div>
        )}

        {/* Content */}
        <div className={DESIGN_TOKENS.recipe.listItemContent.base}>
          {title && <div className={titleClasses}>{title}</div>}
          <div className={contentClasses}>{children}</div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type='button'
            onClick={handleDismiss}
            className={dismissButtonClasses}
            aria-label='Dismiss callout'
          >
            <svg
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Callout.displayName = 'Callout';

// ===== EXPORTS =====

export default Callout;
export { Callout };
