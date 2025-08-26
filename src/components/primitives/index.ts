/**
 * Primitives Index - MAPS v3.0 Enhanced with Primitive Governance Layer
 *
 * Centralized exports for Radix utilities integrated with MAPS architecture.
 * These primitives standardize accessibility and composition patterns.
 *
 * PRIMITIVE GOVERNANCE LAYER - THE MOAT:
 * - TokenGuard: ESLint plugin for token compliance
 * - ZIndexOrchestrator: Layer management system
 * - MotionPresets: Governed animation library
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

// PRIMITIVE GOVERNANCE LAYER - THE MOAT
export { TokenGuard, useTokenGuard, withTokenGuard } from './token-guard';
export {
  ZIndexOrchestrator,
  ZIndexProvider,
  useZIndex,
  useZIndexMonitor,
  getZIndexValue,
  getAvailableLayers,
  isValidLayer
} from './z-index-orchestrator';
export {
  MotionPresets,
  MotionProvider,
  useMotion,
  useMotionPerformance,
  getMotionPreset,
  getAvailableMotions,
  isValidMotion,
  createMotionClass
} from './motion-presets';

// Governance Types
export type {
  TokenGuardConfig,
  TokenViolation,
  ZIndexLayer,
  ZIndexConfig,
  ZIndexViolation,
  MotionPreset,
  MotionConfig,
  MotionViolation,
  PrimitiveGovernanceConfig,
  GovernanceReport,
  EnforcementHookConfig,
} from './types';
