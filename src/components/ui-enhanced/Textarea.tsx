/**
 * Enhanced Textarea Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with cosmic innovation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix Compatibility: ✅ Polymorphic pattern ready
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Enhanced Tokens → Textarea variants → User experience
 * - MAPS4 Guidelines → Validation states → Accessibility
 * - Form ecosystem → Textarea component → Field composability
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|focus|error)
 */

/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED TEXTAREA VARIANTS =====

/**
 * Enhanced textarea variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced-tokens CSS custom properties
 */
const enhancedTextareaVariants = cva(
  [
    // Foundation: Layout/shape - Using semantic tokens
    'flex w-full',

    // Foundation: Typography - Apple HIG hierarchy (from enhanced tokens)
    'text-[var(--font-size-sm)]', // matches our typography.footnote base size

    // Foundation: Shape - Systematic from design tokens
    'rounded-[var(--radius-md)] border',

    // Foundation: Spacing - 8pt grid system
    'px-[var(--space-3)] py-[var(--space-2)]',

    // Foundation: Colors - Deep space foundation with ethereal accents
    'bg-cosmic-input text-cosmic-light',
    'border-cosmic-border',

    // Foundation: Placeholder - Subtle hierarchy
    'placeholder:text-cosmic-muted',

    // Foundation: Motion - Respect user preferences (from enhanced tokens)
    'transition-all duration-[var(--motion-duration-2)] ease-out',
    'motion-reduce:transition-none',

    // Foundation: States - Disabled styling
    'disabled:cursor-not-allowed disabled:opacity-50',

    // Foundation: Focus - AAA compliant ring system (from enhanced tokens)
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-aurora-accent focus-visible:ring-offset-2 focus-visible:ring-offset-stellar-surface',

    // Foundation: Resize behavior
    'resize-vertical',
  ],
  {
    variants: {
      variant: {
        // Default: Clean, professional baseline
        default: ['border-cosmic-border bg-cosmic-input', 'focus-visible:border-aurora-accent'],

        // Ghost: Minimal, elegant
        ghost: [
          'border-transparent bg-transparent',
          'focus-visible:border-cosmic-border focus-visible:bg-cosmic-input',
        ],

        // Filled: Subtle depth
        filled: [
          'border-transparent bg-aurora-accent',
          'focus-visible:border-cosmic-border focus-visible:bg-cosmic-input',
        ],

        // Outline: Clear boundaries
        outline: ['border-cosmic-border bg-transparent', 'focus-visible:border-aurora-accent'],

        // Floating: Modern glass effect (when vibrancy enabled)
        floating: [
          'border-cosmic-border/50 bg-cosmic-input/80',
          'backdrop-blur-[var(--blur-sm)] backdrop-saturate-[var(--saturate-135)]',
          'focus-visible:border-aurora-accent focus-visible:bg-cosmic-input',
        ],
      },

      size: {
        // Clean systematic sizing with 8pt grid
        sm: ['min-h-[var(--space-60)]', 'text-[var(--font-size-xs)]', 'px-[var(--space-2)] py-[var(--space-1_5)]'],
        md: ['min-h-[var(--space-80)]', 'text-[var(--font-size-sm)]', 'px-[var(--space-3)] py-[var(--space-2)]'],
        lg: ['min-h-[var(--space-120)]', 'text-[var(--font-size-base)]', 'px-[var(--space-4)] py-[var(--space-3)]'],
        xl: ['min-h-[var(--space-160)]', 'text-[var(--font-size-lg)]', 'px-[var(--space-4)] py-[var(--space-4)]'],
      },

      validation: {
        default: '',
        error: ['border-cosmic-error', 'focus-visible:ring-cosmic-error'],
        success: ['border-cosmic-success', 'focus-visible:ring-cosmic-success'],
        warning: ['border-cosmic-warning', 'focus-visible:ring-cosmic-warning'],
      },

      density: {
        comfortable: ['leading-relaxed'],
        compact: ['leading-tight'],
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
      validation: 'default',
      density: 'comfortable',
    },
  }
);

// ===== ENHANCED TEXTAREA INTERFACES =====

export interface EnhancedTextareaOwnProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof enhancedTextareaVariants> {
  /**
   * Label for the textarea (accessibility)
   */
  label?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Show optional indicator when not required
   */
  showOptional?: boolean;

  /**
   * Error message for validation
   */
  error?: string;

  /**
   * Success message for validation
   */
  success?: string;

  /**
   * Helper text below the textarea
   */
  helperText?: string;

  /**
   * Character count display
   */
  showCharacterCount?: boolean;

  /**
   * Maximum character limit
   */
  maxLength?: number;

  /**
   * Whether to show resize handle
   */
  resizable?: boolean;
}

export interface EnhancedTextareaProps extends EnhancedTextareaOwnProps {
  /**
   * Polymorphic as prop support
   */
  asChild?: boolean;
}

export type TextareaVariantProps = VariantProps<typeof enhancedTextareaVariants>;

// ===== ENHANCED TEXTAREA COMPONENT =====

export const EnhancedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  EnhancedTextareaProps
>(({
  className,
  variant,
  size,
  density,
  label,
  required = false,
  showOptional = false,
  error,
  success,
  helperText,
  showCharacterCount = false,
  maxLength,
  resizable = true,
  asChild = false,
  ...props
}, ref) => {
  // ===== VALIDATION STATE LOGIC =====
  
  const validationState = React.useMemo(() => {
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  }, [error, success]);

  // ===== CHARACTER COUNT LOGIC =====
  
  const [charCount, setCharCount] = React.useState(
    props.defaultValue?.toString().length || props.value?.toString().length || 0
  );

  const { onChange } = props;
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  }, [onChange]);

  // ===== ACCESSIBILITY ATTRIBUTES =====
  
  const textareaId = React.useId();
  const labelId = `${textareaId}-label`;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const ariaDescribedBy = React.useMemo(() => {
    const ids = [];
    if (helperText) ids.push(helperId);
    if (error) ids.push(errorId);
    if (showCharacterCount) ids.push(`${textareaId}-count`);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [helperText, error, showCharacterCount, helperId, errorId, textareaId]);

  // ===== RENDER FUNCTIONS =====

  const renderLabel = () => {
    if (!label) return null;

    return (
      <label
        id={labelId}
        htmlFor={textareaId}
        className={cn(
          'block text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          'text-cosmic-light mb-[var(--space-2)]'
        )}
      >
        {label}
        {required && (
          <span className="text-cosmic-error ml-[var(--space-1)]" aria-label="required">
            *
          </span>
        )}
        {!required && showOptional && (
          <span className="text-[var(--font-size-xs)] text-cosmic-muted ml-[var(--space-1)]">(optional)</span>
        )}
      </label>
    );
  };

  const renderHelperText = () => {
    if (!helperText) return null;

    return (
      <p
        id={helperId}
        className="text-[var(--font-size-xs)] text-cosmic-muted mt-[var(--space-1)]"
      >
        {helperText}
      </p>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <p
        id={errorId}
        className="text-[var(--font-size-xs)] text-cosmic-error mt-[var(--space-1)] flex items-center gap-[var(--space-1)]"
        role="alert"
      >
        <span className="size-[var(--space-1)] bg-cosmic-error rounded-full" />
        {error}
      </p>
    );
  };

  const renderSuccess = () => {
    if (!success) return null;

    return (
              <p className="text-[var(--font-size-xs)] text-cosmic-success mt-[var(--space-1)] flex items-center gap-[var(--space-1)]">
          <span className="size-[var(--space-1)] bg-cosmic-success rounded-full" />
        {success}
      </p>
    );
  };

  const renderCharacterCount = () => {
    if (!showCharacterCount) return null;

    const isOverLimit = maxLength && charCount > maxLength;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;

    return (
      <div
        id={`${textareaId}-count`}
        className={cn(
          'text-[var(--font-size-xs)] mt-[var(--space-1)] text-right',
          isOverLimit ? 'text-cosmic-error' : isNearLimit ? 'text-cosmic-warning' : 'text-cosmic-muted'
        )}
      >
        {charCount}
        {maxLength && ` / ${maxLength}`}
      </div>
    );
  };

  // ===== COMPONENT RENDERING =====

  const Comp = asChild ? Slot : 'textarea';

  return (
    <div className="w-full space-y-[var(--space-2)]">
      {renderLabel()}
      
      <div className="relative">
        <Comp
          ref={ref}
          id={textareaId}
          className={cn(
            enhancedTextareaVariants({
              variant,
              size,
              validation: validationState,
              density,
              className,
            }),
            !resizable && 'resize-none'
          )}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={ariaDescribedBy}
          aria-invalid={validationState === 'error'}
          aria-required={required}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
      </div>

      <div className="space-y-[var(--space-1)]">
        {renderHelperText()}
        {renderError()}
        {renderSuccess()}
        {renderCharacterCount()}
      </div>
    </div>
  );
});

EnhancedTextarea.displayName = 'EnhancedTextarea';

// ===== ENHANCED TEXTAREA FACTORY =====

/**
 * Factory function for creating specialized textarea variants
 */
export const createTextarea = {
  /**
   * Create a textarea with error state
   */
  withError: (error: string) => (props: EnhancedTextareaOwnProps) => (
    <EnhancedTextarea {...props} error={error} />
  ),

  /**
   * Create a textarea with success state
   */
  withSuccess: (success: string) => (props: EnhancedTextareaOwnProps) => (
    <EnhancedTextarea {...props} success={success} />
  ),

  /**
   * Create a compact textarea
   */
  compact: (props: EnhancedTextareaOwnProps) => (
    <EnhancedTextarea {...props} size="sm" density="compact" />
  ),

  /**
   * Create a large textarea
   */
  large: (props: EnhancedTextareaOwnProps) => (
    <EnhancedTextarea {...props} size="lg" />
  ),

  /**
   * Create a floating glass textarea
   */
  glass: (props: EnhancedTextareaOwnProps) => (
    <EnhancedTextarea {...props} variant="floating" />
  ),
};

// ===== EXPORT ENHANCED TEXTAREA VARIANTS =====

export { enhancedTextareaVariants };
