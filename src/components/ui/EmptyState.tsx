/**
 * @fileoverview EmptyState Component - Enterprise-grade empty state component system
 *
 * @component EmptyState
 * @description A comprehensive empty state component system for indicating no data,
 * no results, errors, and other states with customizable icons, content, and actions.
 * Implements "Sir Steve" principles: reduce friction, show promise, invite action.
 *
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 *
 * @implements {React.ForwardRefExoticComponent}
 * @implements {WCAG 2.1 AA Standards}
 * @implements {DESIGN_TOKENS V3.2}
 *
 * Key Features:
 * - Multiple variants (no-data, no-results, error, search, network, onboarding)
 * - Size variants (small, medium, large)
 * - Icon support (built-in icons and custom icons)
 * - Action buttons integration
 * - Onboarding-focused patterns for conversion
 * - Full accessibility support
 * - Zero hardcoded Tailwind classes
 * - TypeScript strict mode compliance
 * - Forward ref support for DOM manipulation
 */

import React from 'react';

import { DESIGN_TOKENS, combineTokens } from '../../design/tokens';
import { cn } from '../../utils/cn';

// ===== TYPE DEFINITIONS =====

/**
 * Variant types for different empty state scenarios
 */
export type EmptyStateVariant =
  | 'no-data' // General no data state
  | 'no-results' // Search/filter results empty
  | 'error' // Error state
  | 'search' // Search empty state
  | 'network' // Network/connection issues
  | 'onboarding' // First-time user experience
  | 'generic'; // Generic empty state

/**
 * Size variants for the empty state
 */
export type EmptyStateSize = 'small' | 'medium' | 'large';

/**
 * Icon configuration for empty state
 */
export interface EmptyStateIcon {
  /** Icon element (SVG or React component) */
  element?: React.ReactNode;
  /** Whether to hide the icon completely */
  hidden?: boolean;
}

/**
 * Action button configuration for empty state
 */
export interface EmptyStateAction {
  /** Button text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Suggestion chip configuration for onboarding patterns
 */
export interface EmptyStateSuggestion {
  /** Suggestion text */
  text: string;
  /** Click handler */
  onClick: () => void;
  /** Whether suggestion is disabled */
  disabled?: boolean;
}

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** Variant type */
  variant?: EmptyStateVariant;
  /** Size variant */
  size?: EmptyStateSize;
  /** Main title/heading */
  title?: string;
  /** Description text */
  description?: string;
  /** Icon configuration */
  icon?: EmptyStateIcon;
  /** Action buttons */
  actions?: EmptyStateAction[];
  /** Suggestion chips for onboarding */
  suggestions?: EmptyStateSuggestion[];
  /** Custom content to render instead of default layout */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Test ID for testing */
  'data-testid'?: string;
}

// ===== ICON COMPONENTS =====

/**
 * Built-in icon set for different empty state variants
 */
const EmptyStateIcons = {
  'no-data': (
    <svg
      className={combineTokens('size-full')}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      />
    </svg>
  ),
  'no-results': (
    <svg
      className={combineTokens('size-full')}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      />
    </svg>
  ),
  error: (
    <svg
      className='size-full'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
      />
    </svg>
  ),
  search: (
    <svg
      className='size-full'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      />
    </svg>
  ),
  network: (
    <svg
      className='size-full'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0'
      />
    </svg>
  ),
  onboarding: (
    <svg
      className='size-full'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 4.5v15m7.5-7.5h-15'
      />
    </svg>
  ),
  generic: (
    <svg
      className='size-full'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
      />
    </svg>
  ),
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get default content for empty state variants
 * Implements "Sir Steve" copy framework: purpose > absence
 */
const getDefaultContent = (variant: EmptyStateVariant) => {
  const content = {
    'no-data': {
      title: 'Create your first task',
      description: 'Capture what matters and start checking things off.',
    },
    'no-results': {
      title: 'No results found',
      description: 'Try adjusting your search criteria or filters.',
    },
    error: {
      title: 'Something went wrong',
      description: 'An error occurred while loading the data.',
    },
    search: {
      title: 'Start your search',
      description: 'Enter a search term to find what you are looking for.',
    },
    network: {
      title: 'Connection problem',
      description: 'Check your internet connection and try again.',
    },
    onboarding: {
      title: 'Create your first task',
      description: 'Capture what matters and start checking things off.',
    },
    generic: {
      title: 'Make it yours',
      description: 'Plan today, track progress, and get it done.',
    },
  };

  return content[variant];
};

/**
 * Get classes for different empty state sizes
 */
const getSizeClasses = (size: EmptyStateSize) => {
  const sizeClasses = {
    small: {
      container: 'text-center py-8 px-4 space-y-2',
      icon: 'mb-2 text-4xl text-slate-400 dark:text-slate-500',
      title: DESIGN_TOKENS.typography.heading.h4,
      description: DESIGN_TOKENS.typography.body.small,
    },
    medium: {
      container: 'text-center py-12 px-6 space-y-4',
      icon: 'mb-4 text-6xl opacity-50 text-slate-400',
      title: DESIGN_TOKENS.typography.heading.h3,
      description: DESIGN_TOKENS.typography.body.secondary,
    },
    large: {
      container: 'text-center py-16 px-8 space-y-6',
      icon: 'mb-6 text-8xl opacity-50 text-slate-400',
      title: DESIGN_TOKENS.typography.heading.h2,
      description: DESIGN_TOKENS.typography.body.large,
    },
  };

  return sizeClasses[size];
};

/**
 * Get semantic color classes for different variants
 */
const getVariantColorClasses = (variant: EmptyStateVariant) => {
  const colorClasses = {
    'no-data': {
      icon: 'text-slate-400 dark:text-slate-500',
      title: 'text-slate-700 dark:text-slate-300',
      description: 'text-slate-600 dark:text-slate-400',
    },
    'no-results': {
      icon: 'text-slate-400 dark:text-slate-500',
      title: 'text-slate-700 dark:text-slate-300',
      description: 'text-slate-600 dark:text-slate-400',
    },
    error: {
      icon: 'text-error-400 dark:text-error-500',
      title: 'text-error-700 dark:text-error-300',
      description: 'text-error-600 dark:text-error-400',
    },
    search: {
      icon: 'text-primary-400 dark:text-primary-500',
      title: 'text-slate-700 dark:text-slate-300',
      description: 'text-slate-600 dark:text-slate-400',
    },
    network: {
      icon: 'text-warning-400 dark:text-warning-500',
      title: 'text-warning-700 dark:text-warning-300',
      description: 'text-warning-600 dark:text-warning-400',
    },
    onboarding: {
      icon: 'text-primary-500 dark:text-primary-400',
      title: 'text-slate-800 dark:text-slate-200',
      description: 'text-slate-600 dark:text-slate-400',
    },
    generic: {
      icon: 'text-slate-400 dark:text-slate-500',
      title: 'text-slate-700 dark:text-slate-300',
      description: 'text-slate-600 dark:text-slate-400',
    },
  };

  return colorClasses[variant];
};

// ===== SUB-COMPONENTS =====

/**
 * EmptyState Icon Component
 */
const EmptyStateIconComponent: React.FC<{
  variant: EmptyStateVariant;
  size: EmptyStateSize;
  icon?: EmptyStateIcon;
}> = ({ variant, size, icon }) => {
  if (icon?.hidden) return null;

  const sizeClasses = getSizeClasses(size);
  const colorClasses = getVariantColorClasses(variant);

  const iconElement = icon?.element || EmptyStateIcons[variant];

  return (
    <div className={cn(sizeClasses.icon, colorClasses.icon)}>{iconElement}</div>
  );
};

/**
 * EmptyState Suggestions Component (for onboarding patterns)
 */
const EmptyStateSuggestions: React.FC<{
  suggestions: EmptyStateSuggestion[];
}> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={combineTokens('flex', 'flex-wrap', 'justify-center', 'gap-2')}
      aria-label='Suggestions'
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type='button'
          onClick={suggestion.onClick}
          disabled={suggestion.disabled}
          className={cn(
            'rounded-full border px-3 py-1 text-sm transition-colors',
            'border-slate-300 dark:border-slate-600',
            'text-slate-700 dark:text-slate-300',
            'hover:bg-slate-100 dark:hover:bg-slate-700',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          )}
        >
          {suggestion.text}
        </button>
      ))}
    </div>
  );
};

/**
 * EmptyState Actions Component
 */
const EmptyStateActions: React.FC<{
  actions: EmptyStateAction[];
  size: EmptyStateSize;
}> = ({ actions, size }) => {
  if (actions.length === 0) return null;

  const containerClasses =
    size === 'small' ? 'mt-3 space-y-2' : 'mt-6 space-y-3';

  return (
    <div className={containerClasses}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className={cn(
            DESIGN_TOKENS.recipe.button.base,
            action.variant === 'primary'
              ? DESIGN_TOKENS.recipe.button.primary
              : DESIGN_TOKENS.recipe.button.secondary,
            DESIGN_TOKENS.sizing.button.md
          )}
          data-state={action.loading ? 'pending' : undefined}
          aria-disabled={action.disabled}
        >
          {action.loading && (
            <svg
              className={combineTokens(
                '-ml-1',
                'mr-2',
                'size-4',
                'animate-spin'
              )}
              fill='none'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <circle
                className={combineTokens('opacity-25')}
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className={combineTokens('opacity-75')}
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          )}
          {action.label}
        </button>
      ))}
    </div>
  );
};

// ===== MAIN COMPONENT =====

/**
 * EmptyState - Enterprise-grade empty state component
 *
 * A comprehensive empty state component for displaying no data, no results,
 * errors, and other empty states with built-in accessibility and design token integration.
 * Implements "Sir Steve" UX principles for conversion-focused empty states.
 *
 * @param props - EmptyState component props
 * @returns Rendered EmptyState component
 *
 * @example
 * ```tsx
 * // Basic onboarding empty state
 * <EmptyState variant="onboarding" />
 *
 * // With actions and suggestions (Sir Steve pattern)
 * <EmptyState
 *   variant="onboarding"
 *   title="Create your first task"
 *   description="Capture what matters and start checking things off."
 *   actions={[
 *     { label: 'Add a task', onClick: openQuickAdd, variant: 'primary' },
 *     { label: 'Import from CSV', onClick: openImport }
 *   ]}
 *   suggestions={[
 *     { text: 'Follow up with Alex', onClick: () => createTask('Follow up with Alex') },
 *     { text: 'Draft Q3 plan', onClick: () => createTask('Draft Q3 plan') },
 *     { text: 'Pay invoices', onClick: () => createTask('Pay invoices') }
 *   ]}
 * />
 *
 * // With custom icon
 * <EmptyState
 *   variant="generic"
 *   icon={{ element: <CustomIcon /> }}
 *   title="Custom empty state"
 * />
 * ```
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      variant = 'generic',
      size = 'medium',
      title,
      description,
      icon,
      actions = [],
      suggestions = [],
      children,
      className,
      'aria-label': ariaLabel,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const sizeClasses = getSizeClasses(size);
    const colorClasses = getVariantColorClasses(variant);
    const defaultContent = getDefaultContent(variant);

    // Use provided content or fall back to defaults
    const displayTitle = title ?? defaultContent.title;
    const displayDescription = description ?? defaultContent.description;

    // Build accessibility label
    const accessibilityLabel = ariaLabel || `Empty state: ${displayTitle}`;

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(sizeClasses.container, className)}
          aria-labelledby={displayTitle ? undefined : 'empty-state-label'}
          aria-label={displayTitle ? undefined : accessibilityLabel}
          data-testid={testId}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(sizeClasses.container, className)}
        aria-labelledby='empty-state-title'
        data-testid={testId}
        {...props}
      >
        <EmptyStateIconComponent
          variant={variant}
          size={size}
          {...(icon && { icon })}
        />

        {displayTitle && (
          <h3
            id='empty-state-title'
            className={cn(sizeClasses.title, colorClasses.title)}
          >
            {displayTitle}
          </h3>
        )}

        {displayDescription && (
          <p className={cn(sizeClasses.description, colorClasses.description)}>
            {displayDescription}
          </p>
        )}

        <EmptyStateActions actions={actions} size={size} />

        <EmptyStateSuggestions suggestions={suggestions} />
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

// ===== COMPOUND COMPONENTS =====

/**
 * EmptyState.NoData - Specialized no data empty state
 */
const EmptyStateNoData = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, 'variant'>
>((props, ref) => <EmptyState ref={ref} variant='no-data' {...props} />);
EmptyStateNoData.displayName = 'EmptyState.NoData';

/**
 * EmptyState.NoResults - Specialized no results empty state
 */
const EmptyStateNoResults = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, 'variant'>
>((props, ref) => <EmptyState ref={ref} variant='no-results' {...props} />);
EmptyStateNoResults.displayName = 'EmptyState.NoResults';

/**
 * EmptyState.Error - Specialized error empty state
 */
const EmptyStateError = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, 'variant'>
>((props, ref) => <EmptyState ref={ref} variant='error' {...props} />);
EmptyStateError.displayName = 'EmptyState.Error';

/**
 * EmptyState.Search - Specialized search empty state
 */
const EmptyStateSearch = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, 'variant'>
>((props, ref) => <EmptyState ref={ref} variant='search' {...props} />);
EmptyStateSearch.displayName = 'EmptyState.Search';

/**
 * EmptyState.Network - Specialized network empty state
 */
const EmptyStateNetwork = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, 'variant'>
>((props, ref) => <EmptyState ref={ref} variant='network' {...props} />);
EmptyStateNetwork.displayName = 'EmptyState.Network';

/**
 * EmptyState.Onboarding - Specialized onboarding empty state
 * Implements Sir Steve's conversion-focused patterns
 */
const EmptyStateOnboarding = React.forwardRef<
  HTMLDivElement,
  Omit<EmptyStateProps, 'variant'>
>((props, ref) => <EmptyState ref={ref} variant='onboarding' {...props} />);
EmptyStateOnboarding.displayName = 'EmptyState.Onboarding';

// ===== EXPORTS =====

export default EmptyState;

// Named exports for compound components
export {
  EmptyStateNoData,
  EmptyStateNoResults,
  EmptyStateError,
  EmptyStateSearch,
  EmptyStateNetwork,
  EmptyStateOnboarding,
};
