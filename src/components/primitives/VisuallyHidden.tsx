/**
 * Visually Hidden Primitive - MAPS v2.2 Integration
 *
 * Replaces custom .sr-only patterns with robust, tested implementation.
 * More reliable than CSS-only approaches for complex layouts.
 *
 * INTEGRATION POINTS:
 * - Accessibility: WCAG 2.1 AA compliant screen reader content
 * - Performance: Zero overhead - compiles to optimized DOM
 * - Reliability: Battle-tested across different screen readers
 */

import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import React from 'react';

// ===== TYPES =====

interface VisuallyHiddenProps
  extends React.ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root> {
  /** Content to hide visually but announce to screen readers */
  children: React.ReactNode;
}

// ===== COMPONENT =====

/**
 * Visually Hidden wrapper for the MAPS design system
 *
 * Use this instead of custom .sr-only classes for better cross-platform support.
 *
 * @example
 * <VisuallyHidden>
 *   Loading your dashboard...
 * </VisuallyHidden>
 *
 * @example
 * <button>
 *   <TrashIcon />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </button>
 */
export const VisuallyHidden = React.forwardRef<
  React.ElementRef<typeof VisuallyHiddenPrimitive.Root>,
  VisuallyHiddenProps
>(({ children, ...props }, ref) => {
  return (
    <VisuallyHiddenPrimitive.Root ref={ref} {...props}>
      {children}
    </VisuallyHiddenPrimitive.Root>
  );
});

VisuallyHidden.displayName = 'VisuallyHidden';

// ===== EXPORTS =====

export default VisuallyHidden;
export type { VisuallyHiddenProps };
