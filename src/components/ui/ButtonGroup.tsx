/**
 * ButtonGroup Component - Enterprise-Grade Grouped Button Actions
 * 
 * Advanced DESIGN_TOKENS V3.2 implementation showcasing:
 * - Seamless button grouping with connected borders
 * - Orientation support (horizontal/vertical) with proper token usage
 * - Size and variant inheritance with override capabilities
 * - Accessibility compliance with proper ARIA group semantics
 * - Enterprise-grade visual cohesion using layout patterns
 * - Dark mode and theme-aware styling
 */

import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { Button } from '@/components/ui/Button';

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  spacing?: 'none' | 'sm' | 'md';
  fullWidth?: boolean;
  'aria-label'?: string;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ 
    children,
    size = 'md', 
    variant,
    orientation = 'horizontal',
    attached = true,
    spacing = 'none',
    fullWidth = false,
    className = '',
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    
    // Base layout classes using enterprise tokens
    const baseClasses = orientation === 'horizontal' 
      ? DESIGN_TOKENS.layout.patterns.flexGap.replace('gap-3', spacing === 'none' ? '' : `gap-${spacing === 'sm' ? '2' : '3'}`)
      : DESIGN_TOKENS.layout.patterns.flexCol;

    // Attached grouping styles using semantic patterns
    const attachedClasses = attached ? [
      // Remove individual button rounded corners for seamless connection
      '[&>button]:rounded-none',
      
      // Apply corner rounding only to first and last buttons
      orientation === 'horizontal' ? [
        '[&>button:first-child]:rounded-l-md',
        '[&>button:last-child]:rounded-r-md',
      ] : [
        '[&>button:first-child]:rounded-t-md',
        '[&>button:last-child]:rounded-b-md',
      ],
      
      // Connect borders for seamless appearance
      orientation === 'horizontal' ? [
        '[&>button:not(:first-child)]:border-l-0',
        '[&>button:not(:first-child)]:-ml-px', // Overlap borders for clean connection
      ] : [
        '[&>button:not(:first-child)]:border-t-0',
        '[&>button:not(:first-child)]:-mt-px', // Overlap borders for clean connection
      ],
      
      // Focus management for grouped buttons
      '[&>button:focus]:relative', // Ensure focused button appears above overlapped borders
      '[&>button:focus]:z-10',
      
    ].flat() : [];

    // Full width support
    const widthClasses = fullWidth ? [
      'w-full',
      '[&>button]:flex-1', // Equal width buttons
    ] : [];

    // Combine all classes
    const combinedClasses = [
      baseClasses,
      ...attachedClasses,
      ...widthClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={combinedClasses}
        role="group"
        aria-label={ariaLabel}
        data-orientation={orientation}
        data-attached={attached}
        data-size={size}
        data-spacing={spacing}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // Apply group-level props to Button children, but allow individual overrides
            if (child.type === Button) {
              return React.cloneElement(child, {
                size: child.props.size || size,
                variant: child.props.variant || variant,
                // Pass through any additional props while preserving individual button props
                ...child.props,
              });
            }
            
            // For non-Button children, apply data attributes for styling hooks
            return React.cloneElement(child, {
              'data-group-index': index,
              'data-group-size': size,
              'data-group-orientation': orientation,
              ...child.props,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
