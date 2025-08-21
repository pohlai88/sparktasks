/**
 * @fileoverview FormBuilder Component - Enterprise Dynamic Form Generation
 *
 * @description Advanced form builder with dynamic field generation, validation,
 * conditional logic, and enterprise-grade features following SSOT compliance.
 *
 * Features:
 * - Dynamic field generation from schema
 * - Real-time validation with custom rules
 * - Conditional field display logic
 * - Auto-save capabilities
 * - Grid and flexible layouts
 * - Accessibility compliance (WCAG 2.1 AAA)
 * - Theme support (light/dark)
 * - TypeScript strict mode
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPES AND INTERFACES =====

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'file'
  | 'range'
  | 'color';

export type FormLayout = 'grid' | 'flex' | 'vertical' | 'horizontal';
export type FormFieldSize = 'sm' | 'md' | 'lg';
export type ValidationRule =
  | 'required'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'minLength'
  | 'maxLength'
  | 'pattern';

export interface FormFieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormValidationRule {
  type: ValidationRule;
  value?: string | number;
  message: string;
}

export interface FormFieldSchema {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: FormFieldSize;
  validation?: FormValidationRule[];
  options?: FormFieldOption[];
  defaultValue?: any;
  conditionalLogic?: {
    field: string;
    operator:
      | 'equals'
      | 'not-equals'
      | 'contains'
      | 'greater-than'
      | 'less-than';
    value: any;
  };
  gridColumn?: {
    span?: number;
    start?: number;
    end?: number;
  };
  className?: string;
}

export interface FormSchema {
  fields: FormFieldSchema[];
  layout?: FormLayout;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  submitButton?: {
    text: string;
    disabled?: boolean;
    loading?: boolean;
  };
  resetButton?: {
    text: string;
    disabled?: boolean;
  };
}

export interface FormData {
  [fieldId: string]: any;
}

export interface FormErrors {
  [fieldId: string]: string;
}

export interface FormBuilderProps {
  schema: FormSchema;
  initialData?: FormData;
  onSubmit?: (data: FormData) => void | Promise<void>;
  onReset?: () => void;
  onChange?: (data: FormData, fieldId: string) => void;
  onValidation?: (errors: FormErrors, isValid: boolean) => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  'data-testid'?: string;
}

// ===== VALIDATION UTILITIES =====

function validateField(value: any, rules: FormValidationRule[]): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return rule.message;
        }
        break;

      case 'phone':
        if (
          value &&
          !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))
        ) {
          return rule.message;
        }
        break;

      case 'url':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          return rule.message;
        }
        break;

      case 'number':
        if (value && isNaN(Number(value))) {
          return rule.message;
        }
        break;

      case 'minLength':
        if (value && value.length < (rule.value as number)) {
          return rule.message;
        }
        break;

      case 'maxLength':
        if (value && value.length > (rule.value as number)) {
          return rule.message;
        }
        break;

      case 'pattern':
        if (value && !new RegExp(rule.value as string).test(value)) {
          return rule.message;
        }
        break;
    }
  }
  return null;
}

function shouldShowField(field: FormFieldSchema, formData: FormData): boolean {
  if (!field.conditionalLogic) return true;

  const {
    field: targetField,
    operator,
    value: targetValue,
  } = field.conditionalLogic;
  const fieldValue = formData[targetField];

  switch (operator) {
    case 'equals':
      return fieldValue === targetValue;
    case 'not-equals':
      return fieldValue !== targetValue;
    case 'contains':
      return String(fieldValue).includes(String(targetValue));
    case 'greater-than':
      return Number(fieldValue) > Number(targetValue);
    case 'less-than':
      return Number(fieldValue) < Number(targetValue);
    default:
      return true;
  }
}

// ===== FIELD COMPONENTS =====

interface FieldProps {
  field: FormFieldSchema;
  value: any;
  error: string | null;
  disabled: boolean;
  onChange: (value: any) => void;
}

function renderField({
  field,
  value,
  error,
  disabled,
  onChange,
}: FieldProps): React.ReactNode {
  const baseInputClasses = `
    ${DESIGN_TOKENS.recipe.input.base}
    ${error ? DESIGN_TOKENS.recipe.input.error : ''}
    ${DESIGN_TOKENS.recipe.input[field.size || 'md']}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const commonProps = {
    id: field.id,
    disabled: disabled || field.disabled,
    readOnly: field.readonly,
    'aria-describedby': field.helpText ? `${field.id}-help` : undefined,
    'aria-invalid': !!error,
  };

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          {...commonProps}
          className={`${baseInputClasses} min-h-[100px] resize-y`}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          rows={4}
        />
      );

    case 'select':
      return (
        <select
          {...commonProps}
          className={baseInputClasses}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          <option value=''>{field.placeholder || 'Select an option'}</option>
          {field.options?.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'multiSelect':
      return (
        <select
          {...commonProps}
          className={baseInputClasses}
          multiple
          value={value || []}
          onChange={e => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              option => option.value
            );
            onChange(selectedOptions);
          }}
        >
          {field.options?.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <div className={DESIGN_TOKENS.layout.patterns.flexGap}>
          <input
            {...commonProps}
            type='checkbox'
            className='h-4 w-4 rounded border border-secondary-300 bg-white checked:border-primary-600 checked:bg-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
          />
          <label
            htmlFor={field.id}
            className={DESIGN_TOKENS.typography.body.primary}
          >
            {field.label}
          </label>
        </div>
      );

    case 'radio':
      return (
        <div
          className={`${DESIGN_TOKENS.layout.patterns.flexCol} ${DESIGN_TOKENS.spacing.sm}`}
        >
          {field.options?.map(option => (
            <div
              key={option.value}
              className={DESIGN_TOKENS.layout.patterns.flexGap}
            >
              <input
                id={`${field.id}-${option.value}`}
                type='radio'
                name={field.id}
                className='h-4 w-4 border border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
                value={option.value}
                checked={value === option.value}
                disabled={disabled || field.disabled || option.disabled}
                onChange={e => onChange(e.target.value)}
              />
              <label
                htmlFor={`${field.id}-${option.value}`}
                className={DESIGN_TOKENS.typography.body.primary}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );

    case 'file':
      return (
        <input
          {...commonProps}
          type='file'
          className={baseInputClasses}
          onChange={e => onChange(e.target.files?.[0] || null)}
        />
      );

    case 'range':
      return (
        <div className={DESIGN_TOKENS.layout.patterns.flexCol}>
          <input
            {...commonProps}
            type='range'
            className='slider:bg-primary-600 h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary-200'
            value={value || 0}
            onChange={e => onChange(Number(e.target.value))}
          />
          <span
            className={`${DESIGN_TOKENS.typography.body.secondary} text-center`}
          >
            {value || 0}
          </span>
        </div>
      );

    default:
      return (
        <input
          {...commonProps}
          type={field.type}
          className={baseInputClasses}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      );
  }
}

// ===== MAIN COMPONENT =====

export function FormBuilder({
  schema,
  initialData = {},
  onSubmit,
  onReset,
  onChange,
  onValidation,
  autoSave = false,
  autoSaveDelay = 1000,
  className = '',
  disabled = false,
  loading = false,
  'data-testid': testId = 'form-builder',
}: FormBuilderProps) {
  // ===== STATE MANAGEMENT =====

  const [formData, setFormData] = useState<FormData>(() => {
    const data: FormData = { ...initialData };
    // Set default values for fields that don't have initial data
    schema.fields.forEach(field => {
      if (data[field.id] === undefined && field.defaultValue !== undefined) {
        data[field.id] = field.defaultValue;
      }
    });
    return data;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== VALIDATION =====

  const validateForm = useCallback(
    (data: FormData = formData): FormErrors => {
      const newErrors: FormErrors = {};

      schema.fields.forEach(field => {
        if (shouldShowField(field, data) && field.validation) {
          const error = validateField(data[field.id], field.validation);
          if (error) {
            newErrors[field.id] = error;
          }
        }
      });

      return newErrors;
    },
    [schema.fields, formData]
  );

  // ===== COMPUTED VALUES =====

  const visibleFields = useMemo(() => {
    return schema.fields.filter(field => shouldShowField(field, formData));
  }, [schema.fields, formData]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // ===== HANDLERS =====

  const handleFieldChange = useCallback(
    (fieldId: string, value: any) => {
      const newData = { ...formData, [fieldId]: value };
      setFormData(newData);

      // Clear field error when value changes
      if (errors[fieldId]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        });
      }

      onChange?.(newData, fieldId);
    },
    [formData, errors, onChange]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        onValidation?.(validationErrors, false);
        return;
      }

      if (!onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onSubmit, onValidation]
  );

  const handleReset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    onReset?.();
  }, [initialData, onReset]);

  // ===== EFFECTS =====

  // Validate form when data changes
  useEffect(() => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    onValidation?.(
      validationErrors,
      Object.keys(validationErrors).length === 0
    );
  }, [formData, validateForm, onValidation]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onChange) return;

    const timeoutId = setTimeout(() => {
      onChange(formData, 'auto-save');
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [formData, autoSave, autoSaveDelay, onChange]);

  // ===== LAYOUT CLASSES =====

  const getLayoutClasses = () => {
    switch (schema.layout) {
      case 'grid':
        return `
          grid gap-${schema.gap || 'md'}
          grid-cols-1 sm:grid-cols-${Math.min(schema.columns || 2, 2)} 
          lg:grid-cols-${schema.columns || 2}
        `;
      case 'flex':
        return `flex flex-wrap gap-${schema.gap || 'md'}`;
      case 'horizontal':
        return `flex flex-row gap-${schema.gap || 'md'} flex-wrap`;
      case 'vertical':
      default:
        return `flex flex-col gap-${schema.gap || 'md'}`;
    }
  };

  const getFieldClasses = (field: FormFieldSchema) => {
    let classes = '';

    if (schema.layout === 'grid' && field.gridColumn) {
      if (field.gridColumn.span) {
        classes += ` col-span-${field.gridColumn.span}`;
      }
      if (field.gridColumn.start) {
        classes += ` col-start-${field.gridColumn.start}`;
      }
      if (field.gridColumn.end) {
        classes += ` col-end-${field.gridColumn.end}`;
      }
    }

    return classes;
  };

  // ===== RENDER =====

  return (
    <form
      className={` ${DESIGN_TOKENS.layout.patterns.flexCol} ${DESIGN_TOKENS.spacing.lg} ${className} `}
      onSubmit={handleSubmit}
      noValidate
      data-testid={testId}
    >
      <div className={getLayoutClasses()}>
        {visibleFields.map(field => {
          const fieldError = errors[field.id];
          const isFieldDisabled = disabled || loading || field.disabled;

          return (
            <div
              key={field.id}
              className={` ${DESIGN_TOKENS.layout.patterns.flexCol} ${DESIGN_TOKENS.spacing.xs} ${getFieldClasses(field)} ${field.className || ''} `}
            >
              {field.type !== 'checkbox' && (
                <label
                  htmlFor={field.id}
                  className={` ${DESIGN_TOKENS.typography.body.primary} ${DESIGN_TOKENS.typography.inline.fontMedium} ${field.required ? 'after:ml-1 after:text-red-500 after:content-["*"]' : ''} `}
                >
                  {field.label}
                </label>
              )}

              {renderField({
                field,
                value: formData[field.id],
                error: fieldError,
                disabled: isFieldDisabled || false,
                onChange: value => handleFieldChange(field.id, value),
              })}

              {fieldError && (
                <span
                  className={`${DESIGN_TOKENS.typography.body.caption} text-red-600 dark:text-red-400`}
                  role='alert'
                  aria-live='polite'
                >
                  {fieldError}
                </span>
              )}

              {field.helpText && !fieldError && (
                <span
                  id={`${field.id}-help`}
                  className={`${DESIGN_TOKENS.typography.body.secondary} ${DESIGN_TOKENS.typography.body.xs}`}
                >
                  {field.helpText}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {(schema.submitButton || schema.resetButton) && (
        <div className={`${DESIGN_TOKENS.layout.patterns.flexGap} justify-end`}>
          {schema.resetButton && (
            <button
              type='button'
              className={DESIGN_TOKENS.recipe.button.secondary}
              onClick={handleReset}
              disabled={disabled || loading || schema.resetButton.disabled}
              data-testid='form-reset-button'
            >
              {schema.resetButton.text}
            </button>
          )}

          {schema.submitButton && (
            <button
              type='submit'
              className={DESIGN_TOKENS.recipe.button.primary}
              disabled={
                disabled ||
                loading ||
                isSubmitting ||
                !isValid ||
                schema.submitButton.disabled
              }
              data-testid='form-submit-button'
            >
              {isSubmitting || schema.submitButton.loading
                ? 'Submitting...'
                : schema.submitButton.text}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

FormBuilder.displayName = 'FormBuilder';
