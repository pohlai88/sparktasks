import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive';
  padding?: 'default' | 'compact' | 'none';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  padding = 'default',
  elevation = 'sm',
  className = '',
  onClick,
  ...props
}: CardProps) {
  // Phase 02: Theme-aware base classes
  const baseClasses = cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    DESIGN_TOKENS.theme.light.surface.base,
    `dark:${DESIGN_TOKENS.theme.dark.surface.base.replace('bg-', '')}`,
    DESIGN_TOKENS.theme.light.border.subtle,
    `dark:${DESIGN_TOKENS.theme.dark.border.subtle.replace('border-', '')}`
  );

  const variantClasses = {
    default: '',
    interactive: cn(
      DESIGN_TOKENS.state.hover,
      DESIGN_TOKENS.transitions.hover,
      'cursor-pointer'
    ),
  };

  const paddingClasses = {
    default: DESIGN_TOKENS.layout.padBase,
    compact: DESIGN_TOKENS.layout.padCompact,
    none: '',
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component className={combinedClasses} onClick={onClick} {...props}>
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div
      className={cn(
        DESIGN_TOKENS.theme.light.border.subtle,
        DESIGN_TOKENS.layout.padBase,
        DESIGN_TOKENS.position.borders.bottom,
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`${DESIGN_TOKENS.typography.display.h3} ${className}`}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div
      className={cn(
        DESIGN_TOKENS.theme.light.border.subtle,
        DESIGN_TOKENS.layout.padBase,
        DESIGN_TOKENS.position.borders.top,
        className
      )}
    >
      {children}
    </div>
  );
}

