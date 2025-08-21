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
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';
import { Button } from '@/components/ui/Button';

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'outline'
    | 'link';
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  spacing?: 'none' | 'sm' | 'md';
  fullWidth?: boolean;
  'aria-label'?: string;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
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
    },
    ref
  ) => {
    // Base layout classes using enterprise tokens
    const baseClasses = combineTokens(
      // Core container styling
      'inline-flex',
      DESIGN_TOKENS.theme.light.radius.md,

      // Orientation and spacing
      orientation === 'horizontal'
        ? DESIGN_TOKENS.layout.patterns.flexGap.replace(
            'gap-3',
            spacing === 'none' ? '' : `gap-${spacing === 'sm' ? '2' : '3'}`
          )
        : DESIGN_TOKENS.layout.patterns.flexCol,

      // Background and border foundation
      DESIGN_TOKENS.theme.light.surface.base,
      DESIGN_TOKENS.theme.light.border.subtle
    );

    // Attached grouping styles using semantic patterns
    const attachedClasses = attached
      ? [
          // Remove individual button rounded corners for seamless connection
          '[&>button]:rounded-none',

          // Apply corner rounding only to first and last buttons using design tokens
          orientation === 'horizontal'
            ? [
                `[&>button:first-child]:${DESIGN_TOKENS.theme.light.radius.md.replace('rounded-', 'rounded-l-')}`,
                `[&>button:last-child]:${DESIGN_TOKENS.theme.light.radius.md.replace('rounded-', 'rounded-r-')}`,
              ]
            : [
                `[&>button:first-child]:${DESIGN_TOKENS.theme.light.radius.md.replace('rounded-', 'rounded-t-')}`,
                `[&>button:last-child]:${DESIGN_TOKENS.theme.light.radius.md.replace('rounded-', 'rounded-b-')}`,
              ],

          // Connect borders for seamless appearance using border tokens
          orientation === 'horizontal'
            ? [
                `[&>button:not(:first-child)]:${DESIGN_TOKENS.theme.light.border.subtle.replace('border', 'border-l-0')}`,
                '[&>button:not(:first-child)]:-ml-px', // Overlap borders for clean connection
              ]
            : [
                `[&>button:not(:first-child)]:${DESIGN_TOKENS.theme.light.border.subtle.replace('border', 'border-t-0')}`,
                '[&>button:not(:first-child)]:-mt-px', // Overlap borders for clean connection
              ],

          // Focus management for grouped buttons using elevation tokens
          `[&>button:focus]:relative [&>button:focus]:${DESIGN_TOKENS.theme.light.elevation.floating}`,
          '[&>button:focus]:z-10',
        ].flat()
      : [];

    // Full width support with tokens
    const widthClasses = fullWidth
      ? combineTokens(
          'w-full', // Use direct class since layout tokens don't have width.full
          '[&>button]:flex-1', // Equal width buttons
          '[&>button]:min-w-0' // Prevent flex item overflow
        )
      : '';

    // Combine all classes using combineTokens
    const combinedClasses = combineTokens(
      baseClasses,
      ...attachedClasses,
      widthClasses,
      className
    );

    return (
      <div
        ref={ref}
        className={combinedClasses}
        role='group'
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
