/**
 * Button Component - Enterprise-Grade Action Primitive
 * 
 * Showcases DESIGN_TOKENS V3.2 enterprise capabilities:
 * - Advanced state management (pending, focus, hover, active)
 * - Brand-aligned styling with accessibility compliance
 * - Fine-grained sizing and typography integration
 * - Performance-optimized transitions with reduced motion
 * - Icon integration with precise spacing
 */

import React, { forwardRef } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import type { 
  IconSize 
} from '@/design/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Using actual button sizes from tokens
  pending?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'only';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md', 
    pending = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props 
  }, ref) => {
    
    // Base classes using enterprise token system
    const baseClasses = DESIGN_TOKENS.recipe.button.base;
    const variantClasses = DESIGN_TOKENS.recipe.button[variant];
    const sizeClasses = DESIGN_TOKENS.recipe.button[size] || DESIGN_TOKENS.recipe.button.md;
    
    // Advanced state management using token system
    const stateClasses = [
      pending ? DESIGN_TOKENS.state.pending : '',
      fullWidth ? 'w-full' : '',
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

    // Icon positioning classes
    const getIconClasses = () => {
      const iconSize = getIconSize();
      const baseIconClasses = DESIGN_TOKENS.icon.size[iconSize];
      
      if (iconPosition === 'only') {
        return baseIconClasses;
      }
      
      return iconPosition === 'left' 
        ? `${baseIconClasses} ${DESIGN_TOKENS.icon.margin.rightSm}`
        : `${baseIconClasses} ${DESIGN_TOKENS.icon.margin.leftSm}`;
    };

    // Combine all classes with enterprise token patterns
    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
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
        {/* Icon positioning with enterprise spacing */}
        {icon && iconPosition === 'left' && (
          <span className={getIconClasses()} aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Icon-only button */}
        {icon && iconPosition === 'only' && (
          <span className={getIconClasses()} aria-hidden="true">
            {icon}
          </span>
        )}
        
        {/* Content with proper typography scaling */}
        {iconPosition !== 'only' && (
          <span className={size === 'sm' ? DESIGN_TOKENS.typography.body.small : ''}>
            {children}
          </span>
        )}
        
        {/* Trailing icon */}
        {icon && iconPosition === 'right' && (
          <span className={getIconClasses()} aria-hidden="true">
            {icon}
          </span>
        )}
        
        {/* Loading indicator for pending state */}
        {pending && (
          <span className={`${DESIGN_TOKENS.loading.spinner} ${iconPosition === 'only' ? '' : 'ml-2'}`} aria-hidden="true">
            <svg
              className="animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * IconButton - Specialized button for icon-only actions
 */
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconPosition'> {
  icon: React.ReactNode;
  'aria-label': string; // Required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ...props }, ref) => {
    return (
      <Button 
        ref={ref}
        icon={icon}
        iconPosition="only"
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';



export default Button;
