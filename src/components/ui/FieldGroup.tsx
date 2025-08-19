/**
 * FieldGroup - P0 Enterprise Primitive
 * 
 * Professional form field wrapper with enterprise-grade UX:
 * - Automatic ID association (label → input)
 * - Error state propagation and styling
 * - Theme-aware hint and error messaging
 * - Consistent spacing with density tokens
 * - Screen reader optimization (aria-describedby)
 * 
 * Contract Requirements:
 * - Automatic accessibility associations
 * - Consistent error/hint styling across themes
 * - Density-aware spacing patterns
 * - Required field indication
 */

import React, { useId } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

interface FieldGroupProps {
  /** Field label text */
  label: string;
  /** Optional hint text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Field content (Input, Select, etc.) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function FieldGroup({
  label,
  hint,
  error,
  required = false,
  children,
  className = '',
}: FieldGroupProps) {
  // Generate unique IDs for accessibility associations
  const fieldId = useId();
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  // Build aria-describedby for comprehensive screen reader support
  const ariaDescribedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  // Clone child element to inject accessibility props
  const enhancedChild = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: fieldId,
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': !!error,
        // @ts-ignore - Dynamic prop injection for accessibility
        ...children.props,
      })
    : children;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={cn(
          DESIGN_TOKENS.typography.inline.textSm,
          DESIGN_TOKENS.typography.inline.fontMedium,
          DESIGN_TOKENS.theme.light.ink.primary,
          'block'
        )}
      >
        {label}
        {required && (
          <span
            className={cn(
              DESIGN_TOKENS.semantic.text.error,
              'ml-1'
            )}
            aria-label="required"
          >
            *
          </span>
        )}
      </label>

      {/* Hint Text */}
      {hint && (
        <p
          id={hintId}
          className={cn(
            DESIGN_TOKENS.typography.inline.textXs,
            DESIGN_TOKENS.theme.light.ink.tertiary,
            'mt-1'
          )}
        >
          {hint}
        </p>
      )}

      {/* Field Input */}
      <div className="relative">
        {enhancedChild}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className={cn(
            DESIGN_TOKENS.typography.inline.textXs,
            DESIGN_TOKENS.semantic.text.error,
            'mt-1 flex items-center gap-1'
          )}
        >
          <svg
            className={DESIGN_TOKENS.sizing.icon.xs}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// Enterprise component contract validation
FieldGroup.displayName = 'FieldGroup';

// Type exports for enterprise usage
export type { FieldGroupProps };

