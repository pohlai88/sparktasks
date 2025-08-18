import React from 'react';
import { DESIGN_TOKENS } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = `${DESIGN_TOKENS.recipes.input} ${DESIGN_TOKENS.interaction.input}`;
  const widthClasses = fullWidth ? 'w-full' : '';
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  const inputClasses = [
    baseClasses,
    widthClasses,
    errorClasses,
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={inputId} className={DESIGN_TOKENS.typography.label}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={cn(DESIGN_TOKENS.colors.ui.text.muted, 'sm:text-sm')}>{leftIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className={cn(DESIGN_TOKENS.colors.ui.text.muted, 'sm:text-sm')}>{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className={`mt-1 ${DESIGN_TOKENS.typography.error}`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className={`mt-1 ${DESIGN_TOKENS.typography.body.caption}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export function Textarea({
  label,
  error,
  helperText,
  fullWidth = true,
  resize = 'vertical',
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = `${DESIGN_TOKENS.recipes.textarea} ${DESIGN_TOKENS.interaction.input}`;
  const widthClasses = fullWidth ? 'w-full' : '';
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x', 
    both: 'resize'
  };
  
  const textareaClasses = [
    baseClasses,
    widthClasses,
    errorClasses,
    resizeClasses[resize],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={textareaId} className={DESIGN_TOKENS.typography.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className={`mt-1 ${DESIGN_TOKENS.typography.error}`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className={`mt-1 ${DESIGN_TOKENS.typography.body.caption}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  fullWidth = true,
  options,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = `${DESIGN_TOKENS.recipes.select} ${DESIGN_TOKENS.interaction.input}`;
  const widthClasses = fullWidth ? 'w-full' : '';
  const errorClasses = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  const selectClasses = [
    baseClasses,
    widthClasses,
    errorClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className={DESIGN_TOKENS.typography.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className={`mt-1 ${DESIGN_TOKENS.typography.error}`}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className={`mt-1 ${DESIGN_TOKENS.typography.body.caption}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
