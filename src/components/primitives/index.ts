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

// CLEAN ARCHITECTURE LAYER - Z-INDEX REGISTRY
export {
  registerComponentLayer,
  getZIndex,
  getTailwindClass,
  hasConflict,
  performAutoCleanup,
  validateTokenName,
  getDebuggerSnapshot,
  getAvailableLayers,
  getLayerStats,
  getConflictResolution,
  resetRegistry,
} from './z-index-registry';

// CLEAN ARCHITECTURE LAYER - MOTION UTILITIES
export {
  getMotionClasses,
  getMotionValues,
  createTransition,
  prefersReducedMotion,
  getAdaptiveMotionClasses,
  getAvailableMotionPresets,
} from './motion-utils';

// CLEAN ARCHITECTURE LAYER - REACT HOOKS
export { useZIndex, useZIndexDebugger } from './use-z-index';

// CLEAN ARCHITECTURE LAYER - DEMO
// export {
//   PrimitiveArchitectureDemo,
//   ExampleModal,
//   ExampleTooltip,
//   ExampleToast,
//   ZIndexDebugPanel,
// } from './architecture-demo';

// Clean Architecture Types
export type {
  ZIndexToken,
  ComponentLayerEntry,
  ConflictResolution,
  LayerDebugInfo,
  MotionPreset,
  MotionOptions,
  ZIndexLayerName,
  MotionDuration,
  MotionEasing,
  ValidationResult,
  isValidLayerName,
  isValidMotionPreset,
  isValidMotionDuration,
  isValidMotionEasing,
} from './types';
