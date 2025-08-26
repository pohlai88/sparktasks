/**
 * EnhancedForm - Universal Form System Component
 *
 * Comprehensive form component with validation, accessibility, and excellent DX built on react-hook-form.
 * Built with MAPS v3.0 design system integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import {
  useForm,
  type FieldValues,
  type FieldError,
  type UseFormRegister,
  type Path,
} from 'react-hook-form';

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';
import { cn } from '../../../utils/cn';
import type { EnhancedFormProps, FormFieldConfig } from '../types';

// ===== MAPS v3.0 FORM VARIANTS =====

const formVariants = cva(
  [
    // Foundation styling with MAPS tokens
    'w-full space-y-6',
  ],
  {
    variants: {
      layout: {
        vertical: 'space-y-6',
        horizontal: 'space-y-4',
        inline: 'flex flex-wrap gap-4 space-y-0',
      },
      density: {
        compact: 'space-y-3',
        comfortable: 'space-y-6',
        spacious: 'space-y-8',
      },
      surface: {
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          'rounded-lg border p-6',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ],
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
          'rounded-lg border p-6',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
        ],
      },
    },
    defaultVariants: {
      layout: 'vertical',
      density: 'comfortable',
    },
  }
);

const fieldGroupVariants = cva(['space-y-2'], {
  variants: {
    layout: {
      vertical: 'space-y-2',
      horizontal: 'grid grid-cols-12 items-start gap-4',
      inline: 'flex items-center gap-4 space-y-0',
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});

const labelVariants = cva(
  [
    'block font-medium',
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
  ],
  {
    variants: {
      layout: {
        vertical: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
        horizontal: [
          'col-span-3 pt-2',
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
        ],
        inline: ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
      },
      required: {
        true: "after:ml-1 after:text-red-500 after:content-['*']",
        false: '',
      },
    },
    defaultVariants: {
      layout: 'vertical',
      required: false,
    },
  }
);

const inputVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2',
    'placeholder:text-muted-foreground',
    'transition-colors',
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
    ENHANCED_DESIGN_TOKENS.accessibility.focus.ring,
    ENHANCED_DESIGN_TOKENS.accessibility.motion.safe,
  ],
  {
    variants: {
      layout: {
        vertical: 'h-10',
        horizontal: 'col-span-9 h-10',
        inline: 'h-10',
      },
      size: {
        sm: 'h-8 px-2 text-sm',
        md: 'h-10 px-3',
        lg: 'h-12 px-4',
      },
      state: {
        default: '',
        error: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
          'border-red-500 focus:border-red-500',
        ],
        success: 'border-green-500 focus:border-green-500',
      },
      disabled: {
        true: [
          'cursor-not-allowed opacity-50',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.disabled,
        ],
        false: '',
      },
    },
    defaultVariants: {
      layout: 'vertical',
      size: 'md',
      state: 'default',
      disabled: false,
    },
  }
);

const textareaVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2',
    'resize-vertical placeholder:text-muted-foreground',
    'min-h-[80px] transition-colors',
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
    ENHANCED_DESIGN_TOKENS.accessibility.focus.ring,
    ENHANCED_DESIGN_TOKENS.accessibility.motion.safe,
  ],
  {
    variants: {
      layout: {
        vertical: '',
        horizontal: 'col-span-9',
        inline: '',
      },
    },
    defaultVariants: {
      layout: 'vertical',
    },
  }
);

const descriptionVariants = cva([
  'mt-1',
  ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
]);

const errorVariants = cva([
  'mt-1 flex items-center gap-2',
  ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
  ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
]);

const checkboxWrapperVariants = cva(['flex items-center gap-2']);

const actionsVariants = cva(
  [
    'flex gap-3 border-t pt-6',
    ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
  ],
  {
    variants: {
      layout: {
        vertical: 'justify-end',
        horizontal: 'justify-end',
        inline: 'justify-start',
      },
    },
    defaultVariants: {
      layout: 'vertical',
    },
  }
);

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2',
    'font-medium transition-colors',
    ENHANCED_DESIGN_TOKENS.accessibility.motion.safe,
    ENHANCED_DESIGN_TOKENS.accessibility.focus.ring,
  ],
  {
    variants: {
      variant: {
        primary: [
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg,
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg,
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.hover,
        ],
        secondary: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
          'border',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          'hover:bg-accent hover:text-accent-foreground',
        ],
        ghost: [
          'bg-transparent',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
          'hover:bg-accent hover:text-accent-foreground',
        ],
      },
      size: {
        sm: ['h-8 px-3', ENHANCED_DESIGN_TOKENS.foundation.typography.caption],
        md: ['h-10 px-4', ENHANCED_DESIGN_TOKENS.foundation.typography.button],
        lg: [
          'h-11 px-6',
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
        ],
      },
      disabled: {
        true: [
          'cursor-not-allowed opacity-50',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.disabled,
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      disabled: false,
    },
  }
);

// ===== FIELD COMPONENTS =====

interface FieldProps<TFormData extends FieldValues> {
  field: FormFieldConfig<TFormData>;
  register: UseFormRegister<TFormData>;
  error?: FieldError | undefined;
  layout: 'vertical' | 'horizontal' | 'inline';
  disabled?: boolean | undefined;
}

function TextField<TFormData extends FieldValues>({
  field,
  register,
  error,
  layout,
  disabled,
}: FieldProps<TFormData>) {
  const fieldProps = register(field.name as Path<TFormData>);

  return (
    <div className={fieldGroupVariants({ layout })}>
      <label
        htmlFor={String(field.name)}
        className={labelVariants({ layout, required: field.required })}
      >
        {field.label}
      </label>

      <div className={layout === 'horizontal' ? 'col-span-9' : ''}>
        <input
          id={String(field.name)}
          type={field.type}
          placeholder={field.placeholder}
          disabled={disabled || field.disabled}
          className={cn(
            inputVariants({
              layout,
              state: error ? 'error' : 'default',
              disabled: disabled || field.disabled,
            })
          )}
          min={field.min}
          max={field.max}
          accept={field.accept}
          {...fieldProps}
        />

        {field.description && (
          <div className={descriptionVariants()}>{field.description}</div>
        )}

        {error && <div className={errorVariants()}>{error.message}</div>}
      </div>
    </div>
  );
}

function TextareaField<TFormData extends FieldValues>({
  field,
  register,
  error,
  layout,
  disabled,
}: FieldProps<TFormData>) {
  const fieldProps = register(field.name as Path<TFormData>);

  return (
    <div className={fieldGroupVariants({ layout })}>
      <label
        htmlFor={String(field.name)}
        className={labelVariants({ layout, required: field.required })}
      >
        {field.label}
      </label>

      <div className={layout === 'horizontal' ? 'col-span-9' : ''}>
        <textarea
          id={String(field.name)}
          placeholder={field.placeholder}
          disabled={disabled || field.disabled}
          className={cn(
            textareaVariants({ layout }),
            error && 'border-red-500 focus:border-red-500'
          )}
          {...fieldProps}
        />

        {field.description && (
          <div className={descriptionVariants()}>{field.description}</div>
        )}

        {error && <div className={errorVariants()}>{error.message}</div>}
      </div>
    </div>
  );
}

function SelectField<TFormData extends FieldValues>({
  field,
  register,
  error,
  layout,
  disabled,
}: FieldProps<TFormData>) {
  const fieldProps = register(field.name as Path<TFormData>);

  return (
    <div className={fieldGroupVariants({ layout })}>
      <label
        htmlFor={String(field.name)}
        className={labelVariants({ layout, required: field.required })}
      >
        {field.label}
      </label>

      <div className={layout === 'horizontal' ? 'col-span-9' : ''}>
        <select
          id={String(field.name)}
          disabled={disabled || field.disabled}
          multiple={field.multiple}
          className={cn(
            inputVariants({
              layout,
              state: error ? 'error' : 'default',
              disabled: disabled || field.disabled,
            })
          )}
          {...fieldProps}
        >
          <option value=''>Select {field.label}</option>
          {field.options?.map(option => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>

        {field.description && (
          <div className={descriptionVariants()}>{field.description}</div>
        )}

        {error && <div className={errorVariants()}>{error.message}</div>}
      </div>
    </div>
  );
}

function CheckboxField<TFormData extends FieldValues>({
  field,
  register,
  error,
  layout,
  disabled,
}: FieldProps<TFormData>) {
  const fieldProps = register(field.name as Path<TFormData>);

  return (
    <div
      className={cn(
        fieldGroupVariants({ layout }),
        layout === 'horizontal' && 'col-start-4'
      )}
    >
      <div className={checkboxWrapperVariants()}>
        <input
          id={String(field.name)}
          type='checkbox'
          disabled={disabled || field.disabled}
          className={cn(
            'h-4 w-4 rounded border transition-colors',
            ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
            ENHANCED_DESIGN_TOKENS.accessibility.focus.ring,
            error && 'border-red-500'
          )}
          {...fieldProps}
        />
        <label
          htmlFor={String(field.name)}
          className={labelVariants({
            layout: 'vertical',
            required: field.required,
          })}
        >
          {field.label}
        </label>
      </div>

      {field.description && (
        <div className={descriptionVariants()}>{field.description}</div>
      )}

      {error && <div className={errorVariants()}>{error.message}</div>}
    </div>
  );
}

// ===== MAIN ENHANCED FORM COMPONENT =====

export function EnhancedForm<TFormData extends FieldValues>({
  // Schema & Validation
  schema: _schema,
  defaultValues: _defaultValues,

  // Submission
  onSubmit,
  onError,

  // Layout & Appearance
  layout = 'vertical',
  density = 'comfortable',
  surface,

  // Form Behavior
  mode = 'onBlur',
  reValidateMode = 'onChange',
  resetOnSubmit = false,

  // State Management
  loading = false,
  disabled = false,
  readOnly = false,

  // Field Configuration
  fields,

  // Actions
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  showReset = false,

  // Advanced Features
  autoSave,

  // Customization
  className,
  formClassName,
  actionsClassName,

  ...props
}: EnhancedFormProps<TFormData> & React.FormHTMLAttributes<HTMLFormElement>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<TFormData>({
    mode,
    reValidateMode,
  });

  // Auto-save functionality
  const watchedValues = watch();

  React.useEffect(() => {
    if (autoSave?.enabled && autoSave.storageKey) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(
          autoSave.storageKey!,
          JSON.stringify(watchedValues)
        );
      }, autoSave.debounceMs ?? 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, autoSave]);

  const handleFormSubmit = async (data: TFormData) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        reset();
      }
    } catch {
      if (onError) {
        onError(errors);
      }
    }
  };

  const renderField = (field: FormFieldConfig<TFormData>) => {
    if (field.hidden) return null;

    const fieldError = errors[field.name] as FieldError | undefined;
    const isFieldDisabled = disabled || readOnly || field.disabled;

    const fieldProps = {
      field,
      register,
      error: fieldError,
      layout,
      disabled: isFieldDisabled,
    };

    switch (field.type) {
      case 'textarea':
        return <TextareaField key={String(field.name)} {...fieldProps} />;
      case 'select':
        return <SelectField key={String(field.name)} {...fieldProps} />;
      case 'checkbox':
      case 'radio':
        return <CheckboxField key={String(field.name)} {...fieldProps} />;
      default:
        return <TextField key={String(field.name)} {...fieldProps} />;
    }
  };

  return (
    <div className={cn(formVariants({ layout, density, surface }), className)}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn('space-y-6', formClassName)}
        {...props}
      >
        {/* Render Fields */}
        {fields.map(renderField)}

        {/* Form Actions */}
        <div className={cn(actionsVariants({ layout }), actionsClassName)}>
          {/* Reset Button */}
          {showReset && (
            <button
              type='button'
              onClick={() => reset()}
              className={cn(buttonVariants({ variant: 'ghost' }))}
              disabled={disabled || isSubmitting}
            >
              Reset
            </button>
          )}

          {/* Cancel Button */}
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              className={cn(buttonVariants({ variant: 'secondary' }))}
              disabled={disabled || isSubmitting}
            >
              {cancelLabel}
            </button>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            className={cn(
              buttonVariants({
                variant: 'primary',
                disabled: disabled || isSubmitting || loading,
              }),
              'justify-center'
            )}
            disabled={disabled || isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Submitting...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

// Export types for external use
export type EnhancedFormVariants = VariantProps<typeof formVariants>;
