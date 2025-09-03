/**
 * Primitives Index - MAPS v3.0 Clean Architecture
 *
 * Centralized exports for Radix utilities and the new clean primitives system.
 * These primitives provide a clean, token-based foundation for all components.
 *
 * CLEAN ARCHITECTURE PRINCIPLES:
 * - Single Source of Truth: ENHANCED_DESIGN_TOKENS
 * - Simple APIs: No overengineering
 * - Type Safety: Full TypeScript integration
 * - Auto Cleanup: Memory-safe component lifecycle
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

// CLEAN ARCHITECTURE LAYER - (Deprecated exports removed to enforce SSOT)

// CLEAN ARCHITECTURE LAYER - DEMO
// export {
//   PrimitiveArchitectureDemo,
//   ExampleModal,
//   ExampleTooltip,
//   ExampleToast,
//   ZIndexDebugPanel,
// } from './architecture-demo';

// Clean Architecture Types (removed; legacy types file deleted to enforce SSOT)
