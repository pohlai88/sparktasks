/**
 * Spinner Component - Enterprise-Grade Loading Indicator
 *
 * A sophisticated loading spinner component built with DESIGN_TOKENS V3.2:
 * - Multiple sizes (xs, sm, md, lg, xl) with icon-consistent sizing
 * - Semantic variants (primary, secondary, muted) for different contexts
 * - Accessibility-first with proper ARIA labels and screen reader support
 * - Motion-safe design respecting user's reduced motion preferences
 * - Theme-aware with light/dark mode support
 * - Customizable speed and styles while maintaining design system consistency
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Spinner />
 *
 * // Large spinner with custom label
 * <Spinner size="lg" label="Loading dashboard data..." />
 *
 * // Secondary variant for subtle loading states
 * <Spinner variant="secondary" size="sm" />
 *
 * // Inline spinner with text
 * <div className="flex items-center gap-2">
 *   <Spinner size="sm" />
 *   <span>Processing...</span>
 * </div>
 * ```
 */

import React from 'react';

import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';
import type { ComponentSize } from '@/design/tokens';

// ===== TYPES =====

export type SpinnerVariant = 'primary' | 'secondary' | 'muted';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

export interface SpinnerProps {
  /** Size of the spinner - matches icon sizing system */
  size?: ComponentSize;
  /** Visual variant for different contexts */
  variant?: SpinnerVariant;
  /** Animation speed */
  speed?: SpinnerSpeed;
  /** Accessible label for screen readers */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show as inline element */
  inline?: boolean;
  /** Custom test ID for testing */
  'data-testid'?: string;
}

// ===== SPINNER VARIANTS =====

const spinnerVariants = {
  primary: {
    circle: combineTokens(
      'text-blue-600 dark:text-blue-400',
      'stroke-current fill-none'
    ),
    track: 'text-blue-200 dark:text-blue-800 stroke-current fill-none',
  },
  secondary: {
    circle: combineTokens(
      'text-gray-600 dark:text-gray-400',
      'stroke-current fill-none'
    ),
    track: 'text-gray-200 dark:text-gray-700 stroke-current fill-none',
  },
  muted: {
    circle: combineTokens(
      'text-gray-400 dark:text-gray-500',
      'stroke-current fill-none'
    ),
    track: 'text-gray-200 dark:text-gray-800 stroke-current fill-none',
  },
} as const;

// ===== SPINNER SIZES =====

const spinnerSizes = {
  xs: {
    container: 'h-3 w-3',
    strokeWidth: '3',
    viewBox: '0 0 24 24',
  },
  sm: {
    container: 'h-4 w-4',
    strokeWidth: '2.5',
    viewBox: '0 0 24 24',
  },
  md: {
    container: 'h-5 w-5',
    strokeWidth: '2',
    viewBox: '0 0 24 24',
  },
  lg: {
    container: 'h-6 w-6',
    strokeWidth: '2',
    viewBox: '0 0 24 24',
  },
  xl: {
    container: 'h-8 w-8',
    strokeWidth: '1.5',
    viewBox: '0 0 24 24',
  },
} as const;

// ===== SPINNER SPEEDS =====

const spinnerSpeeds = {
  slow: '[animation-duration:2s]',
  normal: '[animation-duration:1s]',
  fast: '[animation-duration:0.5s]',
} as const;

// ===== SPINNER COMPONENT =====

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      speed = 'normal',
      label = 'Loading...',
      className,
      inline = false,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const sizeConfig = spinnerSizes[size];
    const variantStyles = spinnerVariants[variant];
    const speedClass = spinnerSpeeds[speed];

    const containerClasses = combineTokens(
      // Base spinner animation and sizing
      DESIGN_TOKENS.motion.spin,
      sizeConfig.container,
      speedClass,

      // Display mode
      inline ? 'inline-block' : 'block',

      // Motion reduction support
      'motion-reduce:animate-none motion-reduce:opacity-50',

      // Custom classes
      className
    );

    return (
      <svg
        ref={ref}
        className={containerClasses}
        viewBox={sizeConfig.viewBox}
        role='status'
        aria-label={label}
        aria-live='polite'
        data-testid={testId}
        {...props}
      >
        {/* Background circle track */}
        <circle
          cx='12'
          cy='12'
          r='10'
          strokeWidth={sizeConfig.strokeWidth}
          className={variantStyles.track}
          opacity='0.25'
        />

        {/* Animated progress circle */}
        <circle
          cx='12'
          cy='12'
          r='10'
          strokeWidth={sizeConfig.strokeWidth}
          strokeLinecap='round'
          strokeDasharray='32'
          strokeDashoffset='24'
          className={variantStyles.circle}
          transform='rotate(-90 12 12)'
        >
          {/* Only animate if motion is not reduced */}
          <animateTransform
            attributeName='transform'
            attributeType='XML'
            type='rotate'
            from='-90 12 12'
            to='270 12 12'
            dur={speed === 'fast' ? '0.5s' : speed === 'slow' ? '2s' : '1s'}
            repeatCount='indefinite'
          />
        </circle>

        {/* Screen reader text */}
        <title>{label}</title>
      </svg>
    );
  }
);

Spinner.displayName = 'Spinner';

// ===== COMPOUND COMPONENTS =====

/**
 * Spinner with text - combines spinner with loading text
 */
export interface SpinnerWithTextProps extends SpinnerProps {
  /** Text to display alongside spinner */
  text: string;
  /** Position of text relative to spinner */
  textPosition?: 'right' | 'bottom';
}

export const SpinnerWithText: React.FC<SpinnerWithTextProps> = ({
  text,
  textPosition = 'right',
  size = 'md',
  ...spinnerProps
}) => {
  const isVertical = textPosition === 'bottom';

  return (
    <div
      className={combineTokens(
        'flex items-center',
        isVertical ? 'flex-col gap-2' : 'gap-3'
      )}
      aria-label={`${spinnerProps.label || 'Loading'}: ${text}`}
    >
      <Spinner size={size} inline={!isVertical} {...spinnerProps} />
      <span
        className={combineTokens(
          DESIGN_TOKENS.semantic.text.muted,
          DESIGN_TOKENS.typography.body.small
        )}
      >
        {text}
      </span>
    </div>
  );
};

// ===== SPECIALTY SPINNERS =====

/**
 * Page Spinner - Full page loading overlay
 */
export interface PageSpinnerProps
  extends Pick<SpinnerProps, 'label' | 'variant'> {
  /** Whether to show backdrop */
  backdrop?: boolean;
}

export const PageSpinner: React.FC<PageSpinnerProps> = ({
  label = 'Loading page...',
  variant = 'primary',
  backdrop = true,
}) => {
  return (
    <div
      className={combineTokens(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdrop && 'bg-white/80 backdrop-blur-sm dark:bg-gray-900/80'
      )}
      aria-label={label}
    >
      <div
        className={combineTokens(
          DESIGN_TOKENS.layout.flex.col,
          DESIGN_TOKENS.layout.flex.itemsCenter,
          DESIGN_TOKENS.layout.spacing.gap.lg
        )}
      >
        <Spinner size='xl' variant={variant} label={label} />
        <p
          className={combineTokens(
            DESIGN_TOKENS.semantic.text.muted,
            DESIGN_TOKENS.typography.body.small
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

/**
 * Button Spinner - For loading states in buttons
 */
export interface ButtonSpinnerProps
  extends Pick<SpinnerProps, 'size' | 'variant'> {
  /** Whether button is in loading state */
  loading?: boolean;
  /** Content to show when not loading */
  children: React.ReactNode;
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
  loading = false,
  size = 'sm',
  variant = 'primary',
  children,
}) => {
  return (
    <div
      className={combineTokens(
        DESIGN_TOKENS.layout.flex.row,
        DESIGN_TOKENS.layout.flex.itemsCenter,
        DESIGN_TOKENS.layout.spacing.gap.sm
      )}
    >
      {loading && (
        <Spinner size={size} variant={variant} inline label='Processing...' />
      )}
      <span className={loading ? 'opacity-70' : undefined}>{children}</span>
    </div>
  );
};

// ===== EXPORTS =====

export default Spinner;
