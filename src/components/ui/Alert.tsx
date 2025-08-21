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
    <svg
      className={DESIGN_TOKENS.icon.size.md}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z'
        clipRule='evenodd'
      />
    </svg>
  ),
  success: (
    <svg
      className={DESIGN_TOKENS.icon.size.md}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.25 10.5a.75.75 0 00-1.06 1.061l1.5 1.5a.75.75 0 001.137-.089l4-5.5z'
        clipRule='evenodd'
      />
    </svg>
  ),
  warning: (
    <svg
      className={DESIGN_TOKENS.icon.size.md}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z'
        clipRule='evenodd'
      />
    </svg>
  ),
  error: (
    <svg
      className={DESIGN_TOKENS.icon.size.md}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
        clipRule='evenodd'
      />
    </svg>
  ),
};

// Dismiss icon
const DismissIcon = (
  <svg
    className={DESIGN_TOKENS.icon.size.sm}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
    focusable='false'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

// Alert variant styles using semantic DESIGN_TOKENS
const alertVariants = {
  info: DESIGN_TOKENS.recipe.alert.color.info,
  success: DESIGN_TOKENS.recipe.alert.color.success,
  warning: DESIGN_TOKENS.recipe.alert.color.warning,
  error: DESIGN_TOKENS.recipe.alert.color.error,
};

// Alert size styles
const alertSizes = {
  sm: {
    container: DESIGN_TOKENS.spacing.formPadding, // p-3
    icon: DESIGN_TOKENS.icon.size.sm,
    title: DESIGN_TOKENS.typography.body.small,
    content: DESIGN_TOKENS.typography.body.xs,
    gap: DESIGN_TOKENS.spacing.sm, // gap-2
  },
  md: {
    container: DESIGN_TOKENS.layout.padBase,
    icon: DESIGN_TOKENS.icon.size.md,
    title: DESIGN_TOKENS.typography.body.medium,
    content: DESIGN_TOKENS.typography.body.small,
    gap: DESIGN_TOKENS.spacing.md, // gap-3
  },
  lg: {
    container: DESIGN_TOKENS.spacing.cardPadding, // p-6
    icon: DESIGN_TOKENS.icon.size.lg,
    title: DESIGN_TOKENS.typography.heading.h6,
    content: DESIGN_TOKENS.typography.body.primary,
    gap: DESIGN_TOKENS.spacing.lg, // gap-4
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
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
    },
    ref
  ) => {
    const variantStyles = alertVariants[variant];
    const sizeStyles = alertSizes[size];

    // Determine the icon to use
    const alertIcon = icon || AlertIcons[variant];

    // Build the container classes
    const containerClasses = combineTokens(
      // Base alert styling
      DESIGN_TOKENS.layout.relative,
      DESIGN_TOKENS.theme.light.radius.lg,
      DESIGN_TOKENS.transitions.smooth,
      DESIGN_TOKENS.transitions.accessible,
      DESIGN_TOKENS.focus.default,

      // Variant styling
      variantStyles.container,

      // Size styling
      sizeStyles.container,

      // Custom classes
      className
    );

    // Generate semantic ARIA label if not provided
    const semanticLabel =
      ariaLabel || `${variant} alert${title ? `: ${title}` : ''}`;

    // Count lines for accessibility
    const contentText = typeof children === 'string' ? children : '';
    const lineCount = contentText ? contentText.split('\n').length : 1;

    return (
      <div
        ref={ref}
        className={containerClasses}
        role='alert'
        aria-label={semanticLabel}
        aria-live='polite'
        aria-atomic='true'
        {...props}
      >
        <div
          className={combineTokens(
            DESIGN_TOKENS.layout.flex.row,
            sizeStyles.gap
          )}
        >
          {/* Icon */}
          <div
            className={combineTokens(
              DESIGN_TOKENS.layout.flex.shrinkNone,
              variantStyles.icon,
              sizeStyles.icon
            )}
          >
            {React.cloneElement(alertIcon as React.ReactElement, {
              className: combineTokens(sizeStyles.icon),
            })}
          </div>

          {/* Content */}
          <div className={DESIGN_TOKENS.recipe.alert.content.base}>
            {/* Title */}
            {title && (
              <h3
                className={combineTokens(
                  DESIGN_TOKENS.typography.inline.fontMedium,
                  DESIGN_TOKENS.typography.inline.leadingTight,
                  DESIGN_TOKENS.layout.spacing.margin.b.xs,
                  variantStyles.title,
                  sizeStyles.title
                )}
              >
                {title}
              </h3>
            )}

            {/* Alert content */}
            <div
              className={combineTokens(
                DESIGN_TOKENS.typography.inline.leadingRelaxed,
                variantStyles.content,
                sizeStyles.content
              )}
            >
              {children}
            </div>

            {/* Actions */}
            {actions && (
              <div className={DESIGN_TOKENS.layout.spacing.margin.t.md}>
                {actions}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && onDismiss && (
            <div className={DESIGN_TOKENS.layout.flex.shrinkNone}>
              <button
                type='button'
                onClick={onDismiss}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onDismiss();
                  }
                }}
                className={combineTokens(
                  DESIGN_TOKENS.recipe.listItemAction.button,
                  DESIGN_TOKENS.focus.default,
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
        <div className={DESIGN_TOKENS.accessibility.srOnly}>
          Alert type: {variant}.{title && ` Title: ${title}.`}
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
    // Base button styling using alert action tokens
    DESIGN_TOKENS.recipe.alert.action.base,

    // Variant styling
    variant === 'primary'
      ? DESIGN_TOKENS.recipe.alert.action.primary
      : DESIGN_TOKENS.recipe.alert.action.secondary,

    className
  );

  return (
    <button ref={ref} className={actionClasses} {...props}>
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
  return (
    <div
      ref={ref}
      className={combineTokens(
        DESIGN_TOKENS.recipe.alert.group[spacing],
        className
      )}
      role='group'
      aria-label='Alert notifications'
      {...props}
    >
      {children}
    </div>
  );
});

AlertGroup.displayName = 'AlertGroup';
