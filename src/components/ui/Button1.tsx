import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = cn(
    DESIGN_TOKENS.recipe.button.base,
    DESIGN_TOKENS.transitions.fast,
    DESIGN_TOKENS.interaction.focus.ring,
    fullWidth && DESIGN_TOKENS.sizing.full
  );

  const variantClasses = cn(
    variant === 'primary' && [
      DESIGN_TOKENS.theme.light.surface.raised,
      DESIGN_TOKENS.theme.light.ink.onPrimary,
      'hover:bg-blue-700 active:bg-blue-800'
    ],
    variant === 'secondary' && [
      DESIGN_TOKENS.theme.light.surface.subtle,
      DESIGN_TOKENS.theme.light.ink.onSurface,
      DESIGN_TOKENS.interaction.button.hover
    ],
    variant === 'ghost' && [
      'bg-transparent',
      DESIGN_TOKENS.theme.light.ink.onSurface,
      DESIGN_TOKENS.interaction.button.hover
    ],
    variant === 'danger' && [
      'bg-red-600 text-white',
      'hover:bg-red-700 active:bg-red-800'
    ]
  );

  const sizeClasses = cn(
    size === 'sm' && DESIGN_TOKENS.recipe.button.sm,
    size === 'md' && DESIGN_TOKENS.recipe.button.md,
    size === 'lg' && DESIGN_TOKENS.recipe.button.lg
  );

  const loadingClasses = loading && [
    'cursor-wait',
    'opacity-80'
  ];

  const disabledClasses = (disabled || loading) && [
    'opacity-50',
    'cursor-not-allowed',
    'pointer-events-none'
  ];

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        loadingClasses,
        disabledClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      
            {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon: React.ReactNode;
  'aria-label': string;
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseClasses = cn(
    DESIGN_TOKENS.recipe.button.base,
    'aspect-square p-0',
    DESIGN_TOKENS.transitions.fast
  );

  const variantClasses = cn(
    variant === 'primary' && DESIGN_TOKENS.recipe.button.primary,
    variant === 'secondary' && DESIGN_TOKENS.recipe.button.secondary,
    variant === 'ghost' && DESIGN_TOKENS.recipe.button.ghost,
    variant === 'danger' && DESIGN_TOKENS.recipe.button.destructive
  );

  const sizeClasses = cn(
    size === 'sm' && DESIGN_TOKENS.recipe.button.sm,
    size === 'md' && DESIGN_TOKENS.recipe.button.md,
    size === 'lg' && DESIGN_TOKENS.recipe.button.lg
  );

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        isLoading && 'cursor-wait opacity-80',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon
      )}
    </button>
  );
}

