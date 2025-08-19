/**
 * IconButton - P0 Enterprise Primitive
 * 
 * Professional icon button with 44px touch targets, state management,
 * and enterprise-grade accessibility compliance.
 * 
 * Contract Requirements:
 * - 44px minimum touch target (Apple HIG compliance)
 * - Theme awareness (light/dark/forced-colors)
 * - State feedback (hover/active/disabled/loading)
 * - Motion preferences (prefers-reduced-motion)
 * - Focus management (keyboard navigation)
 */

import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

interface IconButtonProps {
  /** Icon component to render */
  icon: React.ComponentType<{ className?: string }>;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Size variant - all meet 44px minimum target */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Required accessibility label */
  'aria-label': string;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional props */
  [key: string]: any;
}

export function IconButton({
  icon: Icon,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  'aria-label': ariaLabel,
  className = '',
  onClick,
  ...props
}: IconButtonProps) {
  // Base classes with enterprise requirements
  const baseClasses = [
    // Core button behavior
    'inline-flex items-center justify-center',
    'transition-all duration-150 ease-out',
    'focus-visible:outline-none',
    'disabled:cursor-not-allowed',
    
    // 44px minimum touch target compliance
    'min-h-[44px] min-w-[44px]',
    
    // Theme awareness
    DESIGN_TOKENS.focus.onLight,
    
    // State management
    DESIGN_TOKENS.state.hover,
    DESIGN_TOKENS.state.active,
    DESIGN_TOKENS.state.disabled,
  ].join(' ');

  // Size variants (all maintain 44px minimum)
  const sizeClasses = {
    sm: 'h-11 w-11 rounded-lg', // 44px minimum
    md: 'h-12 w-12 rounded-lg', // 48px comfortable
    lg: 'h-14 w-14 rounded-xl', // 56px spacious
  };

  // Variant styles using V2 token system
  const variantClasses = {
    default: [
      DESIGN_TOKENS.theme.light.surface.subtle,
      DESIGN_TOKENS.theme.light.ink.secondary,
      DESIGN_TOKENS.theme.light.border.subtle,
      'border',
      DESIGN_TOKENS.interaction.button.hover,
      DESIGN_TOKENS.interaction.button.active,
    ].join(' '),
    
    primary: [
      DESIGN_TOKENS.recipe.button.primary,
      'shadow-sm hover:shadow-md',
    ].join(' '),
    
    secondary: [
      DESIGN_TOKENS.recipe.button.secondary,
      'border shadow-sm',
    ].join(' '),
    
    danger: [
      DESIGN_TOKENS.recipe.button.destructive,
      'shadow-sm hover:shadow-md',
    ].join(' '),
    
    ghost: [
      DESIGN_TOKENS.interaction.button.hover,
      DESIGN_TOKENS.interaction.button.active,
      DESIGN_TOKENS.theme.light.ink.secondary,
    ].join(' '),
  };

  // Icon size based on button size
  const iconSizes = {
    sm: DESIGN_TOKENS.sizing.icon.md, // 20px in 44px button
    md: DESIGN_TOKENS.sizing.icon.lg, // 24px in 48px button  
    lg: DESIGN_TOKENS.sizing.icon.xl, // 32px in 56px button
  };

  const combinedClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <div className={cn(iconSizes[size], 'animate-spin')}>
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 32;16 16;0 32;0 32"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-16;-32;-32"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      ) : (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
}

// Enterprise component contract validation
IconButton.displayName = 'IconButton';

// Type exports for enterprise usage
export type { IconButtonProps };

