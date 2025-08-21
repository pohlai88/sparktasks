/**
 * @fileoverview Dialog/Modal Component - Enterprise-grade overlay component system
 *
 * @component Dialog
 * @description A comprehensive modal dialog component system with multiple variants,
 * sizes, and advanced features. Implements accessibility best practices with focus
 * management, keyboard navigation, and screen reader support.
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
 * - Multiple variants (default, danger, success, info)
 * - Size variants (sm, md, lg, xl, fullscreen)
 * - Position variants (center, top, bottom)
 * - Focus trap and restoration
 * - Escape key handling
 * - Backdrop click handling
 * - Portal rendering
 * - Compound component architecture
 * - Animation support
 * - Full accessibility compliance
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { DESIGN_TOKENS, combineTokens } from '../../design/tokens';

// ===== TYPE DEFINITIONS =====

/**
 * Dialog variant types for different use cases
 */
export type DialogVariant =
  | 'default' // Standard dialog
  | 'danger' // Destructive action confirmations
  | 'success' // Success confirmations
  | 'info' // Information dialogs
  | 'warning'; // Warning dialogs

/**
 * Dialog size variants
 */
export type DialogSize =
  | 'sm' // Small dialog (max-w-sm)
  | 'md' // Medium dialog (max-w-md) - default
  | 'lg' // Large dialog (max-w-lg)
  | 'xl' // Extra large dialog (max-w-xl)
  | '2xl' // Double extra large (max-w-2xl)
  | '3xl' // Triple extra large (max-w-3xl)
  | 'fullscreen'; // Full screen dialog

/**
 * Dialog position variants
 */
export type DialogPosition =
  | 'center' // Centered vertically and horizontally (default)
  | 'top' // Top aligned
  | 'bottom'; // Bottom aligned

/**
 * Dialog action button configuration
 */
export interface DialogAction {
  /** Button text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean | undefined;
  /** Auto focus this action */
  autoFocus?: boolean;
}

/**
 * Props for the Dialog component
 */
export interface DialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Function to call when dialog should close */
  onClose: () => void;
  /** Dialog variant */
  variant?: DialogVariant;
  /** Dialog size */
  size?: DialogSize;
  /** Dialog position */
  position?: DialogPosition;
  /** Dialog title */
  title?: string | undefined;
  /** Dialog description */
  description?: string | undefined;
  /** Dialog content */
  children?: React.ReactNode;
  /** Action buttons */
  actions?: DialogAction[];
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes dialog */
  closeOnBackdropClick?: boolean;
  /** Whether pressing Escape closes dialog */
  closeOnEscape?: boolean;
  /** Whether to trap focus within dialog */
  trapFocus?: boolean;
  /** Whether to restore focus on close */
  restoreFocus?: boolean;
  /** Custom container to portal into */
  container?: HTMLElement;
  /** Additional CSS classes for overlay */
  overlayClassName?: string;
  /** Additional CSS classes for content */
  contentClassName?: string;
  /** ARIA label for dialog */
  'aria-label'?: string;
  /** ARIA labelledby for dialog */
  'aria-labelledby'?: string;
  /** ARIA describedby for dialog */
  'aria-describedby'?: string;
  /** Test ID for testing */
  'data-testid'?: string;
  /** Callback when dialog opens */
  onOpen?: () => void;
  /** Callback when dialog closes */
  onClosed?: () => void;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get dialog size classes
 */
const getDialogSizeClasses = (size: DialogSize): string => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    fullscreen: 'w-screen h-screen max-w-none',
  };

  return sizeClasses[size];
};

/**
 * Get dialog position classes
 */
const getDialogPositionClasses = (
  position: DialogPosition,
  size: DialogSize
): string => {
  if (size === 'fullscreen') {
    return 'inset-0';
  }

  const positionClasses = {
    center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
    top: 'left-[50%] top-[10%] translate-x-[-50%]',
    bottom: 'left-[50%] bottom-[10%] translate-x-[-50%]',
  };

  return positionClasses[position];
};

/**
 * Get dialog variant classes
 */
const getDialogVariantClasses = (variant: DialogVariant): string => {
  const variantClasses = {
    default: 'border-slate-200 dark:border-slate-700',
    danger: 'border-red-200 dark:border-red-800',
    success: 'border-green-200 dark:border-green-800',
    info: 'border-blue-200 dark:border-blue-800',
    warning: 'border-amber-200 dark:border-amber-800',
  };

  return variantClasses[variant];
};

/**
 * Focus trap implementation
 */
const useFocusTrap = (
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement>
) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, containerRef]);
};

/**
 * Focus restoration hook
 */
const useFocusRestore = (isOpen: boolean, restoreFocus: boolean) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    return () => {
      if (!isOpen && restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, restoreFocus]);
};

/**
 * Body scroll lock hook
 */
const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
};

// ===== SUB-COMPONENTS =====

/**
 * Dialog Header Component
 */
const DialogHeader: React.FC<{
  title?: string | undefined;
  description?: string | undefined;
  variant: DialogVariant;
  showCloseButton: boolean;
  onClose: () => void;
}> = ({ title, description, variant, showCloseButton, onClose }) => {
  if (!title && !description && !showCloseButton) return null;

  const getTitleColorClass = (variant: DialogVariant): string => {
    const colorClasses = {
      default: 'text-slate-900 dark:text-slate-100',
      danger: 'text-red-900 dark:text-red-100',
      success: 'text-green-900 dark:text-green-100',
      info: 'text-blue-900 dark:text-blue-100',
      warning: 'text-amber-900 dark:text-amber-100',
    };

    return colorClasses[variant];
  };

  return (
    <div
      className={combineTokens(
        DESIGN_TOKENS.layout.patterns.flexGap,
        'justify-between pb-4'
      )}
    >
      <div className={combineTokens(DESIGN_TOKENS.layout.flex.flex1, 'pr-4')}>
        {title && (
          <h2
            id='dialog-title'
            className={cn(
              DESIGN_TOKENS.typography.heading.h3,
              getTitleColorClass(variant),
              'mb-1'
            )}
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            id='dialog-description'
            className={cn(
              DESIGN_TOKENS.typography.body.secondary,
              'text-slate-600 dark:text-slate-400'
            )}
          >
            {description}
          </p>
        )}
      </div>

      {showCloseButton && (
        <button
          type='button'
          onClick={onClose}
          className={cn(
            'rounded-md p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            'hover:bg-slate-100 dark:hover:bg-slate-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'transition-colors duration-200'
          )}
          aria-label='Close dialog'
        >
          <svg
            className={combineTokens(DESIGN_TOKENS.layout.spacing.fine.size5)}
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
};

/**
 * Dialog Actions Component
 */
const DialogActions: React.FC<{
  actions: DialogAction[];
}> = ({ actions }) => {
  if (!actions.length) return null;

  return (
    <div
      className={combineTokens(
        'flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end'
      )}
    >
      {actions.map((action, index) => (
        <button
          key={index}
          type='button'
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className={cn(
            DESIGN_TOKENS.recipe.button.base,
            action.variant === 'primary' && DESIGN_TOKENS.recipe.button.primary,
            action.variant === 'secondary' &&
              DESIGN_TOKENS.recipe.button.secondary,
            action.variant === 'danger' &&
              DESIGN_TOKENS.recipe.button.destructive,
            action.variant === 'ghost' && DESIGN_TOKENS.recipe.button.ghost,
            !action.variant && DESIGN_TOKENS.recipe.button.secondary,
            DESIGN_TOKENS.sizing.button.md,
            'min-w-[80px]'
          )}
          data-state={action.loading ? 'pending' : undefined}
          aria-disabled={action.disabled}
        >
          {action.loading && (
            <svg
              className={combineTokens(
                '-ml-1 mr-2',
                DESIGN_TOKENS.layout.spacing.fine.size4,
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
 * Dialog - Enterprise-grade modal dialog component
 *
 * A comprehensive modal dialog component with multiple variants, sizes, and positions.
 * Implements accessibility best practices with focus management, keyboard navigation,
 * and screen reader support. Uses portal rendering for proper z-index management.
 *
 * @param props - Dialog component props
 * @returns Rendered Dialog component
 *
 * @example
 * ```tsx
 * // Basic confirmation dialog
 * <Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm action"
 *   description="Are you sure you want to proceed?"
 *   actions={[
 *     { label: 'Cancel', onClick: () => setIsOpen(false) },
 *     { label: 'Confirm', onClick: handleConfirm, variant: 'primary' }
 *   ]}
 * />
 *
 * // Danger confirmation dialog
 * <Dialog
 *   open={isDeleteOpen}
 *   onClose={() => setIsDeleteOpen(false)}
 *   variant="danger"
 *   title="Delete item"
 *   description="This action cannot be undone."
 *   actions={[
 *     { label: 'Cancel', onClick: () => setIsDeleteOpen(false) },
 *     { label: 'Delete', onClick: handleDelete, variant: 'danger', autoFocus: true }
 *   ]}
 * />
 *
 * // Large dialog with custom content
 * <Dialog
 *   open={isFormOpen}
 *   onClose={() => setIsFormOpen(false)}
 *   size="lg"
 *   title="Create new project"
 * >
 *   <ProjectForm onSubmit={handleSubmit} />
 * </Dialog>
 * ```
 */
const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      variant = 'default',
      size = 'md',
      position = 'center',
      title,
      description,
      children,
      actions = [],
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      restoreFocus = true,
      container,
      overlayClassName,
      contentClassName,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'data-testid': testId,
      onOpen,
      onClosed,
      ...props
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Combine refs
    const combinedRef = ref || dialogRef;

    // Custom hooks
    useFocusTrap(open, dialogRef);
    useFocusRestore(open, restoreFocus);
    useBodyScrollLock(open);

    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape, onClose]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === overlayRef.current) {
          onClose();
        }
      },
      [closeOnBackdropClick, onClose]
    );

    // Lifecycle callbacks
    useEffect(() => {
      if (open) {
        onOpen?.();
      } else {
        onClosed?.();
      }
    }, [open, onOpen, onClosed]);

    // Build accessibility props
    const accessibilityProps = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby || (title ? 'dialog-title' : undefined),
      'aria-describedby':
        ariaDescribedby || (description ? 'dialog-description' : undefined),
    };

    if (!open) return null;

    const dialogContent = (
      <div
        ref={overlayRef}
        role='presentation'
        className={cn(DESIGN_TOKENS.recipe.modal.overlay, overlayClassName)}
        onClick={handleBackdropClick}
        onKeyDown={e => {
          if (e.key === 'Escape' && closeOnEscape) {
            onClose();
          }
        }}
        data-testid={testId ? `${testId}-overlay` : undefined}
      >
        <div
          ref={combinedRef}
          role='dialog'
          aria-modal='true'
          className={cn(
            // Base modal styles from tokens
            'fixed rounded-lg bg-white shadow-xl dark:bg-slate-900',

            // Size classes
            getDialogSizeClasses(size),

            // Position classes
            getDialogPositionClasses(position, size),

            // Variant classes
            getDialogVariantClasses(variant),

            // Z-index from tokens
            DESIGN_TOKENS.zIndex.modal,

            // Border and padding
            size === 'fullscreen' ? 'rounded-none border-0 p-8' : 'border p-6',

            // Animation classes from tokens
            DESIGN_TOKENS.motion.semantic.modalEnter,

            // Responsive margin for mobile
            size !== 'fullscreen' && 'mx-4',

            // Custom content classes
            contentClassName
          )}
          {...accessibilityProps}
          data-testid={testId}
          {...props}
        >
          <DialogHeader
            title={title}
            description={description}
            variant={variant}
            showCloseButton={showCloseButton}
            onClose={onClose}
          />

          {children && (
            <div
              className={combineTokens(
                DESIGN_TOKENS.layout.flex.flex1,
                'overflow-auto'
              )}
            >
              {children}
            </div>
          )}

          <DialogActions actions={actions} />
        </div>
      </div>
    );

    // Portal rendering
    const portalContainer = container || document.body;
    return createPortal(dialogContent, portalContainer);
  }
);

Dialog.displayName = 'Dialog';

// ===== COMPOUND COMPONENTS =====

/**
 * ConfirmDialog - Specialized confirmation dialog
 */
const ConfirmDialog = React.forwardRef<
  HTMLDivElement,
  Omit<DialogProps, 'variant'> & {
    /** Confirmation message */
    message?: string;
    /** Confirm button text */
    confirmText?: string;
    /** Cancel button text */
    cancelText?: string;
    /** Confirm action handler */
    onConfirm: () => void;
    /** Whether confirm action is loading */
    loading?: boolean;
  }
>(
  (
    {
      message,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      loading,
      onClose,
      actions,
      ...props
    },
    ref
  ) => {
    const defaultActions: DialogAction[] = [
      { label: cancelText, onClick: onClose, variant: 'secondary' },
      {
        label: confirmText,
        onClick: onConfirm,
        variant: 'primary',
        loading,
        autoFocus: true,
      },
    ];

    return (
      <Dialog
        ref={ref}
        variant='default'
        size='sm'
        onClose={onClose}
        actions={actions || defaultActions}
        description={message}
        {...props}
      />
    );
  }
);
ConfirmDialog.displayName = 'ConfirmDialog';

/**
 * DangerDialog - Specialized destructive action dialog
 */
const DangerDialog = React.forwardRef<
  HTMLDivElement,
  Omit<DialogProps, 'variant'> & {
    /** Danger action message */
    message?: string;
    /** Danger button text */
    dangerText?: string;
    /** Cancel button text */
    cancelText?: string;
    /** Danger action handler */
    onConfirm: () => void;
    /** Whether danger action is loading */
    loading?: boolean;
  }
>(
  (
    {
      message,
      dangerText = 'Delete',
      cancelText = 'Cancel',
      onConfirm,
      loading,
      onClose,
      actions,
      ...props
    },
    ref
  ) => {
    const defaultActions: DialogAction[] = [
      { label: cancelText, onClick: onClose, variant: 'secondary' },
      {
        label: dangerText,
        onClick: onConfirm,
        variant: 'danger',
        loading,
        autoFocus: true,
      },
    ];

    return (
      <Dialog
        ref={ref}
        variant='danger'
        size='sm'
        onClose={onClose}
        actions={actions || defaultActions}
        description={message}
        {...props}
      />
    );
  }
);
DangerDialog.displayName = 'DangerDialog';

/**
 * AlertDialog - Specialized alert dialog
 */
const AlertDialog = React.forwardRef<
  HTMLDivElement,
  Omit<DialogProps, 'variant'> & {
    /** Alert variant */
    alertVariant?: 'info' | 'success' | 'warning';
    /** Alert message */
    message?: string;
    /** OK button text */
    okText?: string;
    /** OK action handler */
    onOk?: () => void;
  }
>(
  (
    {
      alertVariant = 'info',
      message,
      okText = 'OK',
      onOk,
      onClose,
      actions,
      ...props
    },
    ref
  ) => {
    const handleOk = onOk || onClose;

    const defaultActions: DialogAction[] = [
      { label: okText, onClick: handleOk, variant: 'primary', autoFocus: true },
    ];

    return (
      <Dialog
        ref={ref}
        variant={alertVariant}
        size='sm'
        onClose={onClose}
        actions={actions || defaultActions}
        description={message}
        showCloseButton={false}
        closeOnBackdropClick={false}
        {...props}
      />
    );
  }
);
AlertDialog.displayName = 'AlertDialog';

// ===== EXPORTS =====

export default Dialog;

// Named exports for compound components
export { ConfirmDialog, DangerDialog, AlertDialog };
