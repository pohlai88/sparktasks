/**
 * Motion Utilities - Simple Token-Based Motion System
 *
 * DESIGN PRINCIPLES:
 * - Single Source: Uses ENHANCED_DESIGN_TOKENS.foundation.motion
 * - Reduced Motion: Automatic accessibility compliance
 * - Simple API: No overengineering, just motion utilities
 * - Performance: Lightweight, no monitoring overhead
 */

import { ENHANCED_DESIGN_TOKENS } from '../../design/enhanced-tokens';

// ===== TYPES =====

export type MotionPreset = 'colors' | 'transform' | 'opacity' | 'all' | 'none';

export type MotionOptions = {
  respectReducedMotion?: boolean;
  properties?: string[];
};

// ===== MOTION UTILITIES =====

/**
 * Get motion classes from enhanced tokens
 */
export function getMotionClasses(
  preset: MotionPreset = 'all',
  options: MotionOptions = {}
): string {
  const { respectReducedMotion = true } = options;

  // Get motion classes from enhanced tokens
  const motionClasses =
    ENHANCED_DESIGN_TOKENS.foundation.motion.transition[preset];

  if (!motionClasses) {
    console.warn(`Motion preset "${preset}" not found in enhanced tokens`);
    return ENHANCED_DESIGN_TOKENS.foundation.motion.transition.all;
  }

  // Add reduced motion compliance if enabled
  if (respectReducedMotion) {
    const reduceClasses = ENHANCED_DESIGN_TOKENS.accessibility.motion.respect;
    return `${motionClasses} ${reduceClasses}`;
  }

  return motionClasses;
}

/**
 * Get raw motion values for JavaScript animations
 */
export function getMotionValues() {
  return ENHANCED_DESIGN_TOKENS.foundation.motion;
}

/**
 * Create custom transition with enhanced tokens
 */
export function createTransition(
  duration: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motion.duration,
  easing: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.motion.easing,
  properties: string[] = ['all']
): string {
  const motionValues = getMotionValues();
  const durationValue = motionValues.duration[duration];
  const easingValue = motionValues.easing[easing];

  return `${properties.join(', ')} ${durationValue} ${easingValue}`;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof globalThis === 'undefined' || !globalThis.matchMedia) return false;

  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get motion preset with reduced motion consideration
 */
export function getAdaptiveMotionClasses(preset: MotionPreset = 'all'): string {
  if (prefersReducedMotion()) {
    return ENHANCED_DESIGN_TOKENS.foundation.motion.transition.none;
  }

  return getMotionClasses(preset);
}

/**
 * Available motion presets from enhanced tokens
 */
export function getAvailableMotionPresets(): MotionPreset[] {
  return Object.keys(
    ENHANCED_DESIGN_TOKENS.foundation.motion.transition
  ) as MotionPreset[];
}

export default {
  getMotionClasses,
  getMotionValues,
  createTransition,
  prefersReducedMotion,
  getAdaptiveMotionClasses,
  getAvailableMotionPresets,
};
