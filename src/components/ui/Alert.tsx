import * as React from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  'aria-label'?: string;
}

// Icon components for each variant
const AlertIcons = {
  info: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
  success: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.25 10.5a.75.75 0 00-1.06 1.061l1.5 1.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
};

// Dismiss icon
const DismissIcon = (
  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Alert variant styles using DESIGN_TOKENS
const alertVariants = {
  info: {
    container: combineTokens(
      'border border-primary-200 dark:border-primary-800',
      'bg-primary-50 dark:bg-primary-950/30',
      'text-primary-900 dark:text-primary-100'
    ),
    icon: 'text-primary-600 dark:text-primary-400',
    title: 'text-primary-900 dark:text-primary-100',
    content: 'text-primary-800 dark:text-primary-200',
    dismiss: 'text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200',
  },
  success: {
    container: combineTokens(
      'border border-success-200 dark:border-success-800',
      'bg-success-50 dark:bg-success-950/30',
      'text-success-900 dark:text-success-100'
    ),
    icon: 'text-success-600 dark:text-success-400',
    title: 'text-success-900 dark:text-success-100',
    content: 'text-success-800 dark:text-success-200',
    dismiss: 'text-success-500 hover:text-success-700 dark:text-success-400 dark:hover:text-success-200',
  },
  warning: {
    container: combineTokens(
      'border border-warning-200 dark:border-warning-800',
      'bg-warning-50 dark:bg-warning-950/30',
      'text-warning-900 dark:text-warning-100'
    ),
    icon: 'text-warning-600 dark:text-warning-400',
    title: 'text-warning-900 dark:text-warning-100',
    content: 'text-warning-800 dark:text-warning-200',
    dismiss: 'text-warning-500 hover:text-warning-700 dark:text-warning-400 dark:hover:text-warning-200',
  },
  error: {
    container: combineTokens(
      'border border-error-200 dark:border-error-800',
      'bg-error-50 dark:bg-error-950/30',
      'text-error-900 dark:text-error-100'
    ),
    icon: 'text-error-600 dark:text-error-400',
    title: 'text-error-900 dark:text-error-100',
    content: 'text-error-800 dark:text-error-200',
    dismiss: 'text-error-500 hover:text-error-700 dark:text-error-400 dark:hover:text-error-200',
  },
};

// Alert size styles
const alertSizes = {
  sm: {
    container: DESIGN_TOKENS.spacing.formPadding, // p-3
    icon: 'size-4',
    title: DESIGN_TOKENS.typography.body.small,
    content: DESIGN_TOKENS.typography.body.xs,
    gap: DESIGN_TOKENS.spacing.sm, // gap-2
  },
  md: {
    container: 'p-4',
    icon: 'size-5',
    title: DESIGN_TOKENS.typography.body.medium,
    content: DESIGN_TOKENS.typography.body.small,
    gap: DESIGN_TOKENS.spacing.md, // gap-3
  },
  lg: {
    container: DESIGN_TOKENS.spacing.cardPadding, // p-6
    icon: 'size-6',
    title: DESIGN_TOKENS.typography.heading.h6,
    content: DESIGN_TOKENS.typography.body.primary,
    gap: DESIGN_TOKENS.spacing.lg, // gap-4
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'info', 
    size = 'md',
    title,
    children, 
    icon,
    dismissible = false,
    onDismiss,
    actions,
    className,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const variantStyles = alertVariants[variant];
    const sizeStyles = alertSizes[size];
    
    // Determine the icon to use
    const alertIcon = icon || AlertIcons[variant];
    
    // Build the container classes
    const containerClasses = combineTokens(
      // Base alert styling
      'relative rounded-lg',
      'transition-all duration-200 ease-out motion-reduce:transition-none',
      'focus-within:ring-2 focus-within:ring-offset-2',
      'focus-within:ring-primary-500 dark:focus-within:ring-primary-400',
      'focus-within:ring-offset-white dark:focus-within:ring-offset-slate-900',
      
      // Variant styling
      variantStyles.container,
      
      // Size styling
      sizeStyles.container,
      
      // Custom classes
      className
    );

    // Generate semantic ARIA label if not provided
    const semanticLabel = ariaLabel || `${variant} alert${title ? `: ${title}` : ''}`;
    
    // Count lines for accessibility
    const contentText = typeof children === 'string' ? children : '';
    const lineCount = contentText ? contentText.split('\n').length : 1;

    return (
      <div
        ref={ref}
        className={containerClasses}
        role="alert"
        aria-label={semanticLabel}
        aria-live="polite"
        aria-atomic="true"
        {...props}
      >
        <div className={combineTokens('flex', sizeStyles.gap)}>
          {/* Icon */}
          <div className={combineTokens('flex-shrink-0', variantStyles.icon, sizeStyles.icon)}>
            {React.cloneElement(alertIcon as React.ReactElement, {
              className: combineTokens(sizeStyles.icon)
            })}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Title */}
            {title && (
              <h3 className={combineTokens(
                'font-medium leading-tight mb-1',
                variantStyles.title,
                sizeStyles.title
              )}>
                {title}
              </h3>
            )}

            {/* Alert content */}
            <div className={combineTokens(
              'leading-relaxed',
              variantStyles.content,
              sizeStyles.content
            )}>
              {children}
            </div>

            {/* Actions */}
            {actions && (
              <div className="mt-3">
                {actions}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && onDismiss && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={onDismiss}
                className={combineTokens(
                  'rounded-md p-1.5',
                  'transition-colors duration-200 motion-reduce:transition-none',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                  'dark:focus:ring-primary-400 dark:focus:ring-offset-slate-900',
                  variantStyles.dismiss
                )}
                aria-label={`Dismiss ${variant} alert`}
              >
                {DismissIcon}
              </button>
            </div>
          )}
        </div>

        {/* Screen reader content */}
        <div className="sr-only">
          Alert type: {variant}.
          {title && ` Title: ${title}.`}
          {lineCount > 1 && ` ${lineCount} lines of content.`}
          {dismissible && ' Press dismiss button to close alert.'}
          {actions && ' Additional actions available.'}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

// Export commonly used alert action components
export const AlertAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
  }
>(({ variant = 'secondary', className, children, ...props }, ref) => {
  const actionClasses = combineTokens(
    // Base button styling
    'inline-flex items-center justify-center',
    'px-3 py-1.5 text-sm font-medium rounded-md',
    'transition-colors duration-200 motion-reduce:transition-none',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
    'dark:focus:ring-primary-400 dark:focus:ring-offset-slate-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Variant styling
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'
      : 'bg-transparent text-current border border-current hover:bg-current/10 active:bg-current/20',
    
    className
  );

  return (
    <button
      ref={ref}
      className={actionClasses}
      {...props}
    >
      {children}
    </button>
  );
});

AlertAction.displayName = 'AlertAction';

// Export alert group for multiple alerts
export const AlertGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: 'tight' | 'normal' | 'relaxed';
  }
>(({ spacing = 'normal', className, children, ...props }, ref) => {
  const spacingClasses = {
    tight: 'space-y-2',
    normal: 'space-y-3',
    relaxed: 'space-y-4',
  };

  return (
    <div
      ref={ref}
      className={combineTokens(spacingClasses[spacing], className)}
      role="group"
      aria-label="Alert notifications"
      {...props}
    >
      {children}
    </div>
  );
});

AlertGroup.displayName = 'AlertGroup';
