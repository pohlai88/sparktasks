import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
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

  const baseClasses = cn(
    DESIGN_TOKENS.recipe.input.base,
    DESIGN_TOKENS.field.height,
    DESIGN_TOKENS.transitions.fast,
    DESIGN_TOKENS.interaction.focus.ring,
    fullWidth && DESIGN_TOKENS.sizing.full
  );

  const stateClasses = cn(
    error && [
      DESIGN_TOKENS.theme.light.border.error,
      DESIGN_TOKENS.interaction.focus.borderRed,
      DESIGN_TOKENS.interaction.focus.ringRed
    ]
  );

  const iconClasses = cn(
    leftIcon && DESIGN_TOKENS.field.iconLeft,
    rightIcon && DESIGN_TOKENS.field.iconRight
  );

  return (
    <div className={fullWidth ? DESIGN_TOKENS.sizing.full : ''}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn(
            DESIGN_TOKENS.theme.light.ink.secondary,
            'block text-sm font-medium mb-2'
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className={cn(
              DESIGN_TOKENS.theme.light.ink.tertiary,
              DESIGN_TOKENS.sizing.icon.sm
            )}>
              {leftIcon}
            </span>
          </div>
        )}
        
        <input 
          id={inputId} 
          className={cn(
            baseClasses,
            stateClasses,
            iconClasses,
            className
          )} 
          {...props} 
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className={cn(
              DESIGN_TOKENS.theme.light.ink.tertiary,
              DESIGN_TOKENS.sizing.icon.sm
            )}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className={cn(
          DESIGN_TOKENS.semantic.text.error,
          'mt-2 text-sm'
        )}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={cn(
          DESIGN_TOKENS.theme.light.ink.tertiary,
          'mt-2 text-sm'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  const textareaId =
    id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = cn(
    DESIGN_TOKENS.recipe.input.base,
    'min-h-[80px]',
    DESIGN_TOKENS.transitions.fast,
    DESIGN_TOKENS.interaction.focus.ring,
    fullWidth && DESIGN_TOKENS.sizing.full
  );

  const stateClasses = cn(
    error && [
      DESIGN_TOKENS.theme.light.border.error,
      DESIGN_TOKENS.interaction.focus.borderRed,
      DESIGN_TOKENS.interaction.focus.ringRed
    ]
  );

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={fullWidth ? DESIGN_TOKENS.sizing.full : ''}>
      {label && (
        <label 
          htmlFor={textareaId} 
          className={cn(
            DESIGN_TOKENS.theme.light.ink.secondary,
            'block text-sm font-medium mb-2'
          )}
        >
          {label}
        </label>
      )}
      
      <textarea 
        id={textareaId} 
        className={cn(
          baseClasses,
          stateClasses,
          resizeClasses[resize],
          className
        )} 
        {...props} 
      />
      
      {error && (
        <p className={cn(
          DESIGN_TOKENS.semantic.text.error,
          'mt-2 text-sm'
        )}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={cn(
          DESIGN_TOKENS.theme.light.ink.tertiary,
          'mt-2 text-sm'
        )}>
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

  const baseClasses = cn(
    DESIGN_TOKENS.recipe.input.base,
    DESIGN_TOKENS.field.height,
    DESIGN_TOKENS.transitions.fast,
    DESIGN_TOKENS.interaction.focus.ring,
    'appearance-none bg-no-repeat bg-right bg-[length:16px] pr-10',
    'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")]',
    fullWidth && DESIGN_TOKENS.sizing.full
  );

  const stateClasses = cn(
    error && [
      DESIGN_TOKENS.theme.light.border.error,
      DESIGN_TOKENS.interaction.focus.borderRed,
      DESIGN_TOKENS.interaction.focus.ringRed
    ]
  );

  return (
    <div className={fullWidth ? DESIGN_TOKENS.sizing.full : ''}>
      {label && (
        <label 
          htmlFor={selectId} 
          className={cn(
            DESIGN_TOKENS.theme.light.ink.secondary,
            'block text-sm font-medium mb-2'
          )}
        >
          {label}
        </label>
      )}
      
      <select 
        id={selectId} 
        className={cn(
          baseClasses,
          stateClasses,
          className
        )} 
        {...props}
      >
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {options.map(option => (
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
        <p className={cn(
          DESIGN_TOKENS.semantic.text.error,
          'mt-2 text-sm'
        )}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={cn(
          DESIGN_TOKENS.theme.light.ink.tertiary,
          'mt-2 text-sm'
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}

