/**
 * Primitives Index - MAPS v2.2 Radix Utilities
 *
 * Centralized exports for Radix utilities integrated with MAPS architecture.
 * These primitives standardize accessibility and composition patterns.
 */

// Accessibility Primitives
export { default as AccessibleIcon } from './AccessibleIcon';
export type { AccessibleIconProps } from './AccessibleIcon';

export { default as VisuallyHidden } from './VisuallyHidden';
export type { VisuallyHiddenProps } from './VisuallyHidden';

// Composition Primitives
export { default as Slot } from './Slot';
export type { SlotProps } from './Slot';

// Re-export Radix primitive for advanced usage
export { RadixSlot } from './Slot';

// Context Primitives
export { default as DirectionProvider } from './DirectionProvider';
export type { DirectionProviderProps } from './DirectionProvider';
