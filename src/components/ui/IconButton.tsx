/**
 * IconButton Component - Enterprise-Grade Icon Action Primitive
 * 
 * Icon-only button variant using DESIGN_TOKENS V3.2:
 * - Advanced state management (pending, focus, hover, active)
 * - Brand-aligned styling with accessibility compliance
 * - Icon sizing integration with precise spacing
 * - Performance-optimized transitions with reduced motion
 * - Enterprise-grade tooltip integration ready
 */

import React, { forwardRef } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import type { IconSize } from '@/design/tokens';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pending?: boolean;
  icon: React.ReactNode;
  children?: never; // Enforce icon-only usage
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    variant = 'ghost',
    size = 'md', 
    pending = false,
    icon,
    disabled,
    className = '',
    ...props 
  }, ref) => {
    
    // Base classes using enterprise token system
    const baseClasses = DESIGN_TOKENS.recipe.button.base;
    const variantClasses = DESIGN_TOKENS.recipe.button[variant];
    const sizeClasses = DESIGN_TOKENS.recipe.button[size];
    const iconOnlyClasses = DESIGN_TOKENS.recipe.button.iconOnly;
    
    // Advanced state management using token system
    const stateClasses = [
      pending ? DESIGN_TOKENS.state.pending : '',
    ].filter(Boolean).join(' ');

    // Icon sizing based on button size
    const getIconSize = (): IconSize => {
      switch (size) {
        case 'sm': return 'sm';
        case 'lg': return 'lg';
        case 'xl': return 'xl';
        default: return 'md';
      }
    };

    // Icon classes without margins for centered icon-only buttons
    const getIconClasses = () => {
      const iconSize = getIconSize();
      return DESIGN_TOKENS.icon.size[iconSize];
    };

    // Combine all classes with enterprise token patterns
    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      iconOnlyClasses,
      stateClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || pending}
        data-state={pending ? 'pending' : undefined}
        data-size={size}
        data-variant={variant}
        aria-busy={pending}
        {...props}
      >
        {/* Centered icon with enterprise spacing */}
        <span className={getIconClasses()} aria-hidden="true">
          {icon}
        </span>
        
        {/* Loading indicator for pending state */}
        {pending && (
          <span 
            className={`${DESIGN_TOKENS.motion.spin} ${DESIGN_TOKENS.icon.size.sm} ${DESIGN_TOKENS.position.fixed.topRight}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className={DESIGN_TOKENS.icon.size.sm}>
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className={DESIGN_TOKENS.semantic.border.muted}
              />
              <path
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
