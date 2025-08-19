/**
 * Dialog - P0 Enterprise Primitive
 * 
 * Professional modal/dialog component with enterprise-grade UX:
 * - Focus trap (keyboard navigation contained)
 * - Scroll lock (prevents body scroll)
 * - Theme awareness (light/dark/forced-colors)
 * - Proper overlay and surface semantics
 * - Escape key handling
 * 
 * Contract Requirements:
 * - Focus management for accessibility
 * - Portal rendering for z-index consistency
 * - Theme-aware overlay and surface styling
 * - Keyboard navigation (Escape to close, Tab cycling)
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DESIGN_TOKENS } from '@/design/tokens';
import { useFocusTrap, useScrollLock } from '../../lib/a11y/focus-trap';
import { cn } from '../../utils/cn';

interface DialogProps {
  /** Whether dialog is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
}

interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: DialogProps) {
  // Enterprise UX hooks
  const focusTrapRef = useFocusTrap(open);
  useScrollLock(open);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Size variants
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const dialogContent = (
    <div
      className={cn(DESIGN_TOKENS.recipe.modal.overlay)}
      onClick={(e) => {
        // Close on overlay click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={cn(
          DESIGN_TOKENS.recipe.modal.content,
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className={cn(
          'flex items-center justify-between pb-4 mb-4',
          DESIGN_TOKENS.theme.light.border.divider,
          'dark:' + DESIGN_TOKENS.theme.dark.border.divider.replace('border-', '')
        )}>
          <h2
            id="dialog-title"
            className={cn(
              DESIGN_TOKENS.typography.display.h3,
              DESIGN_TOKENS.theme.light.ink.primary
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-lg p-2',
              DESIGN_TOKENS.interaction.button.hover,
              DESIGN_TOKENS.interaction.focus.ring
            )}
            aria-label="Close dialog"
          >
            <svg
              className={DESIGN_TOKENS.sizing.icon.md}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Dialog Content */}
        {children}
      </div>
    </div>
  );

  // Portal rendering for z-index consistency
  return createPortal(dialogContent, document.body);
}

// Dialog subcomponents
export function DialogBody({ children, className = '' }: DialogBodyProps) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 pt-4',
      DESIGN_TOKENS.theme.light.border.divider.replace('border-', 'border-t-'),
      'dark:border-t-slate-800',
      className
    )}>
      {children}
    </div>
  );
}

// Enterprise component contracts
Dialog.displayName = 'Dialog';
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;

// Type exports for enterprise usage
export type { DialogProps, DialogBodyProps, DialogFooterProps };

