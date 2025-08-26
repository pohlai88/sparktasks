/**
 * Accessible Icon Primitive - MAPS v2.2 Integration
 *
 * Standardizes icon accessibility patterns across the entire design system.
 * Replaces manual aria-hidden="true" patterns with a semantic, reusable approach.
 *
 * INTEGRATION POINTS:
 * - DESIGN_TOKENS: Uses icon size tokens for consistency
 * - Accessibility: Proper screen reader handling
 * - Performance: Zero runtime overhead via Radix primitives
 */

import * as AccessibleIconPrimitive from '@radix-ui/react-accessible-icon';
import React from 'react';

// ===== TYPES =====

interface AccessibleIconProps {
  /** Screen reader label. If omitted, icon is treated as decorative */
  label?: string;
  /** Icon element (SVG or icon component) */
  children: React.ReactElement;
  /** Additional CSS classes */
  className?: string;
}

// ===== COMPONENT =====

/**
 * Accessible Icon wrapper for the MAPS design system
 *
 * @example
 * // Informative icon
 * <AccessibleIcon label="Warning">
 *   <WarningIcon />
 * </AccessibleIcon>
 *
 * // Decorative icon (no label = decorative)
 * <AccessibleIcon>
 *   <DecorativeIcon />
 * </AccessibleIcon>
 */
export const AccessibleIcon = React.forwardRef<
  HTMLElement,
  AccessibleIconProps
>(({ label, children, className, ...props }, ref) => {
  if (label) {
    // For labeled icons, use Radix primitive (doesn't support ref forwarding)
    const enhancedChildren = React.cloneElement(children, {
      ...children.props,
      'aria-hidden': false,
      focusable: false,
      className: className || children.props.className,
    });

    return (
      <AccessibleIconPrimitive.Root label={label} {...props}>
        {enhancedChildren}
      </AccessibleIconPrimitive.Root>
    );
  }

  // For decorative icons, return enhanced children with ref
  const enhancedChildren = React.cloneElement(children, {
    ...children.props,
    'aria-hidden': true,
    focusable: false,
    className: className || children.props.className,
    ref,
  });

  return enhancedChildren;
});

AccessibleIcon.displayName = 'AccessibleIcon';

// ===== EXPORTS =====

export default AccessibleIcon;
export type { AccessibleIconProps };
