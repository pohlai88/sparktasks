import React from 'react';
import { DESIGN_TOKENS } from '../../design/tokens';
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
  const baseClasses = `${DESIGN_TOKENS.recipes.card} ${DESIGN_TOKENS.elevation[elevation]}`;
  
  const variantClasses = {
    default: '',
    interactive: DESIGN_TOKENS.interaction.card.replace('hover:shadow-md', `hover:${DESIGN_TOKENS.elevation.md}`)
  };

  const paddingClasses = {
    default: DESIGN_TOKENS.spacing.card,
    compact: DESIGN_TOKENS.spacing.cardCompact,
    none: ''
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
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
    <div className={cn('border-b pb-4 mb-4', DESIGN_TOKENS.colors.states.default.border, className)}>
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
    <h3 className={`${DESIGN_TOKENS.typography.heading.h3} ${className}`}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={cn('border-t pt-4 mt-4', DESIGN_TOKENS.colors.states.default.border, className)}>
      {children}
    </div>
  );
}
