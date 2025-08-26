/**
 * Primitive Governance Layer Types - MAPS v3.0
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - Type safety: Strict TypeScript interfaces
 * - Token compliance: Enhanced tokens only
 * - Layer management: Z-index orchestration
 * - Motion governance: Reduced motion compliance
 *
 * NON-NEGOTIABLE GUARDRAILS:
 * - No hardcoded values in type definitions
 * - No arbitrary layer constants
 * - No accessibility violations
 * - No motion without reduced motion support
 */

import type { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';

// ===== TOKEN GUARD TYPES =====

export interface TokenGuardConfig {
  /** Enforce enhanced tokens only */
  enforceEnhancedTokens: boolean;
  /** Block arbitrary values */
  blockArbitraryValues: boolean;
  /** Require dark-first compliance */
  requireDarkFirst: boolean;
  /** Enforce AAA accessibility */
  enforceAAA: boolean;
  /** Allowed token prefixes */
  allowedPrefixes: string[];
}

export interface TokenViolation {
  /** Rule that was violated */
  rule: keyof TokenGuardConfig;
  /** Line number of violation */
  line: number;
  /** Column number of violation */
  column: number;
  /** Violating code snippet */
  code: string;
  /** Suggested fix */
  fix: string;
  /** Severity level */
  severity: 'error' | 'warning';
}

// ===== Z-INDEX ORCHESTRATOR TYPES =====

export interface ZIndexLayer {
  /** Layer name from enhanced tokens */
  name: keyof typeof ENHANCED_DESIGN_TOKENS.foundation.zIndex;
  /** Z-index value from tokens */
  value: number;
  /** Layer description */
  description: string;
  /** Usage restrictions */
  restrictions?: string[];
}

export interface ZIndexConfig {
  /** Current active layers */
  activeLayers: ZIndexLayer[];
  /** Maximum allowed layers */
  maxLayers: number;
  /** Layer conflict detection */
  detectConflicts: boolean;
  /** Auto-cleanup unused layers */
  autoCleanup: boolean;
}

export interface ZIndexViolation {
  /** Layer that caused violation */
  layer: string;
  /** Conflict type */
  type: 'overlap' | 'exceed-max' | 'arbitrary-value' | 'missing-token';
  /** Conflicting layers */
  conflicts?: string[];
  /** Suggested resolution */
  resolution: string;
}

// ===== MOTION PRESETS TYPES =====

export interface MotionPreset {
  /** Semantic preset name */
  name: 'standard' | 'entrance' | 'exit' | 'spring' | 'reduced';
  /** Duration from tokens */
  duration: string;
  /** Easing from tokens */
  easing: string;
  /** Delay from tokens */
  delay?: string;
  /** Reduced motion alternative */
  reducedMotion: string;
  /** Usage guidelines */
  usage: string;
}

export interface MotionConfig {
  /** Respect user preferences */
  respectReducedMotion: boolean;
  /** Default preset */
  defaultPreset: string;
  /** Allow custom motion */
  allowCustom: boolean;
  /** Performance monitoring */
  monitorPerformance: boolean;
}

export interface MotionViolation {
  /** Motion rule violated */
  rule: 'no-reduced-motion' | 'arbitrary-duration' | 'performance-threshold';
  /** Element that violated */
  element: string;
  /** Current motion values */
  current: Record<string, string>;
  /** Compliant alternative */
  alternative: MotionPreset;
}

// ===== PRIMITIVE GOVERNANCE TYPES =====

export interface PrimitiveGovernanceConfig {
  tokenGuard: TokenGuardConfig;
  zIndex: ZIndexConfig;
  motion: MotionConfig;
  /** Global enforcement level */
  enforcementLevel: 'strict' | 'moderate' | 'lenient';
  /** Development mode overrides */
  developmentOverrides?: Partial<PrimitiveGovernanceConfig>;
}

export interface GovernanceReport {
  /** Token violations */
  tokenViolations: TokenViolation[];
  /** Z-index violations */
  zIndexViolations: ZIndexViolation[];
  /** Motion violations */
  motionViolations: MotionViolation[];
  /** Overall compliance score */
  complianceScore: number;
  /** Timestamp of report */
  timestamp: Date;
}

// ===== ENFORCEMENT HOOK TYPES =====

export interface EnforcementHookConfig {
  /** Pre-commit hooks */
  preCommit: boolean;
  /** Build-time validation */
  buildTime: boolean;
  /** Runtime monitoring */
  runtime: boolean;
  /** IDE integration */
  ideIntegration: boolean;
}

// ===== TYPE GUARDS =====

export function isTokenViolation(obj: unknown): obj is TokenViolation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'rule' in obj &&
    'line' in obj &&
    'column' in obj &&
    'code' in obj &&
    'fix' in obj &&
    'severity' in obj
  );
}

export function isZIndexViolation(obj: unknown): obj is ZIndexViolation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'layer' in obj &&
    'type' in obj &&
    'resolution' in obj
  );
}

export function isMotionViolation(obj: unknown): obj is MotionViolation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'rule' in obj &&
    'element' in obj &&
    'current' in obj &&
    'alternative' in obj
  );
}
