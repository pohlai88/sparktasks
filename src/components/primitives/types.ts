/**
 * Primitive Governance Layer Types - MAPS v3.0 Clean Architecture
 *
 * DESIGN PRINCIPLES:
 * - Single Source: All types reflect enhanced tokens structure
 * - Clean API: Simple, focused interfaces
 * - Type Safety: Strict TypeScript validation
 * - Debug Support: Visual debugging capabilities
 */

import type { ENHANCED_DESIGN_TOKENS } from '../../design/enhanced-tokens';
import { ENHANCED_DESIGN_TOKENS as _tokens } from '../../design/enhanced-tokens';

// ===== Z-INDEX REGISTRY TYPES =====

export interface ZIndexToken {
  name: string;
  value: number;
  conflictsWith?: string[];
  description?: string;
}

export interface ComponentLayerEntry {
  componentId: string;
  layerName: string;
  timestamp: number;
}

export interface ConflictResolution {
  canResolve: boolean;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LayerDebugInfo extends ComponentLayerEntry {
  zIndex: number;
  tailwindClass: string;
  conflicts: string[];
}

// ===== MOTION UTILITIES TYPES =====

export type MotionPreset =
  | 'instant'
  | 'fast'
  | 'safe'
  | 'slow'
  | 'progress'
  | 'colors';

export interface MotionOptions {
  respectReducedMotion?: boolean;
  properties?: string[];
}

// ===== ENHANCED TOKEN LAYER TYPES =====

export type ZIndexLayerName =
  keyof typeof ENHANCED_DESIGN_TOKENS.foundation.zIndex;
export type MotionDuration =
  keyof typeof ENHANCED_DESIGN_TOKENS.raw.motion.duration;
export type MotionEasing =
  keyof typeof ENHANCED_DESIGN_TOKENS.raw.motion.easing;

// ===== VALIDATION TYPES =====

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ===== TYPE GUARDS =====

export function isValidLayerName(name: string): name is ZIndexLayerName {
  return name in _tokens.foundation.zIndex;
}

export function isValidMotionPreset(preset: string): preset is MotionPreset {
  return ['instant', 'fast', 'safe', 'slow', 'progress', 'colors'].includes(
    preset
  );
}

export function isValidMotionDuration(
  duration: string
): duration is MotionDuration {
  return duration in _tokens.raw.motion.duration;
}

export function isValidMotionEasing(easing: string): easing is MotionEasing {
  return easing in _tokens.raw.motion.easing;
}
