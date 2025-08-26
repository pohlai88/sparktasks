/**
 * Slot Primitive - MAPS v2.2 Integration
 *
 * Enables polymorphic components and composition patterns.
 * Provides the "asChild" pattern for enhanced component flexibility.
 *
 * INTEGRATION POINTS:
 * - Composition: Enables "asChild" pattern across components
 * - Performance: Zero overhead - compiles away at runtime
 * - Type Safety: Full TypeScript support for polymorphic components
 */

import { Slot as SlotPrimitive } from '@radix-ui/react-slot';
import React from 'react';

// ===== TYPES =====

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

// ===== COMPONENT =====

/**
 * Slot wrapper for the MAPS design system
 *
 * Use this to enable "asChild" patterns in your components.
 *
 * @example
 * // In a component:
 * function EnhancedButton({ asChild, ...props }) {
 *   const Comp = asChild ? Slot : 'button';
 *   return <Comp {...props} />;
 * }
 *
 * // Usage:
 * <EnhancedButton asChild>
 *   <a href="/link">Button as Link</a>
 * </EnhancedButton>
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    return (
      <SlotPrimitive ref={ref} {...props}>
        {children}
      </SlotPrimitive>
    );
  }
);

Slot.displayName = 'Slot';

// ===== EXPORTS =====

export default Slot;
export type { SlotProps };

// Re-export the raw Radix primitive for advanced usage if needed
export { Slot as RadixSlot } from '@radix-ui/react-slot';
