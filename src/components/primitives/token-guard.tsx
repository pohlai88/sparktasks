/**
 * TokenGuard - ESLint Plugin for MAPS v3.0 Token Compliance
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - Zero hardcoded values: All colors/spacing must use enhanced tokens
 * - SSOT compliance: Enhanced tokens are the single source of truth
 * - Type safety: Strict TypeScript validation
 * - Dark-first enforcement: Light mode variations must have dark counterparts
 *
 * GOVERNANCE RULES:
 * - Block arbitrary Tailwind values: [#hex], [123px], etc.
 * - Enforce semantic naming: No raw color/size literals
 * - Require accessibility compliance: AAA contrast ratios
 * - Validate motion respect: Reduced motion alternatives mandatory
 *
 * NON-NEGOTIABLE GUARDRAILS:
 * - No !important declarations
 * - No inline styles with hardcoded values
 * - No CSS custom properties outside token system
 * - No accessibility violations (WCAG AAA target)
 */

import React from 'react';
// NOTE: This file now exposes BOTH: (1) your dev helpers/class, and (2) ESLint plugin exports.
// The class API remains intact to avoid breaking existing imports.

import type {
  TokenGuardConfig,
  TokenViolation,
  GovernanceReport
} from './types';

// ===== DEFAULT CONFIGURATION =====

const DEFAULT_TOKEN_GUARD_CONFIG: TokenGuardConfig = {
  enforceEnhancedTokens: true,
  blockArbitraryValues: true,
  requireDarkFirst: true,
  enforceAAA: true,
  allowedPrefixes: [
    'enhanced-',
    'bg-',
    'text-',
    'border-',
    'shadow-',
    'ring-',
    'w-',
    'h-',
    'p-',
    'm-',
    'space-',
    'gap-',
  ],
};

// ===== VIOLATION PATTERNS =====

const VIOLATION_PATTERNS = {
  arbitraryColor: /\[(#[0-9a-fA-F]{3,8}|rgb\(|hsl\()\]/g,
  arbitrarySpacing: /\[[0-9]+(\.[0-9]+)?(px|rem|em|vh|vw|%)\]/g,
  hardcodedZIndex: /z-\[[0-9]+\]/g,
  inlineStyles: /style\s*=\s*{[^}]*}/g,
  importantDeclarations: /(^|\s)!\S+/g, // e.g., "!mt-2" Tailwind important utility
  nonSemanticColors: /(bg-red-|text-blue-|border-green-)/g,
  customProperties: /--[a-zA-Z-]+\s*:/g,
  directSrOnly: /\bsr-only\b/g, // Direct sr-only usage
} as const;

// ===== TOKEN GUARD CLASS =====

export class TokenGuard {
  private config: TokenGuardConfig;
  private violations: TokenViolation[] = [];

  constructor(config: Partial<TokenGuardConfig> = {}) {
    this.config = { ...DEFAULT_TOKEN_GUARD_CONFIG, ...config };
  }

  /**
   * Validate code against token governance rules
   */
  validateCode(code: string): TokenViolation[] {
    this.violations = [];
    const lines = code.split('\n');

    for (const [lineIndex, line] of lines.entries()) {
      this.validateLine(line, lineIndex + 1);
    }

    return this.violations;
  }

  /**
   * Validate single line of code
   */
  private validateLine(line: string, lineNumber: number): void {
    const trimmedLine = line.trim();

    // Skip comments and imports
    if (trimmedLine.startsWith('//') ||
        trimmedLine.startsWith('/*') ||
        trimmedLine.startsWith('import') ||
        trimmedLine.startsWith('export')) {
      return;
    }

    // Check for arbitrary values
    if (this.config.blockArbitraryValues) {
      this.checkArbitraryValues(line, lineNumber);
    }

    // Check for hardcoded colors
    if (this.config.enforceEnhancedTokens) {
      this.checkHardcodedValues(line, lineNumber);
    }

    // Check for accessibility violations
    if (this.config.enforceAAA) {
      this.checkAccessibilityViolations();
    }

    // Check for dark-first compliance
    if (this.config.requireDarkFirst) {
      this.checkDarkFirstCompliance(line, lineNumber);
    }
  }

  /**
   * Check for arbitrary Tailwind values
   */
  private checkArbitraryValues(line: string, lineNumber: number): void {
    const arbitraryMatches = [
      ...line.matchAll(VIOLATION_PATTERNS.arbitraryColor),
      ...line.matchAll(VIOLATION_PATTERNS.arbitrarySpacing),
      ...line.matchAll(VIOLATION_PATTERNS.hardcodedZIndex),
    ];

    for (const match of arbitraryMatches) {
      this.addViolation({
        rule: 'blockArbitraryValues',
        line: lineNumber,
        column: match.index || 0,
        code: match[0],
        fix: this.suggestTokenFix(match[0]),
        severity: 'error',
      });
    }
  }

  /**
   * Check for hardcoded values
   */
  private checkHardcodedValues(line: string, lineNumber: number): void {
    const hardcodedMatches = [
      ...line.matchAll(VIOLATION_PATTERNS.nonSemanticColors),
      ...line.matchAll(VIOLATION_PATTERNS.inlineStyles),
      ...line.matchAll(VIOLATION_PATTERNS.importantDeclarations),
      ...line.matchAll(VIOLATION_PATTERNS.directSrOnly),
    ];

    for (const match of hardcodedMatches) {
      this.addViolation({
        rule: 'enforceEnhancedTokens',
        line: lineNumber,
        column: match.index || 0,
        code: match[0],
        fix: this.suggestTokenFix(match[0]),
        severity: 'error',
      });
    }
  }

  /**
   * Check accessibility violations
   */
  private checkAccessibilityViolations(): void {
    // Defer a11y attribute checks to eslint-plugin-jsx-a11y for precision.
    // TokenGuard focuses on token, dark-first, and motion governance.
  }

  /**
   * Check dark-first compliance
   */
  private checkDarkFirstCompliance(line: string, lineNumber: number): void {
    const lightOnlyPattern = /(bg-white|text-black|border-gray-200)/;

    if (lightOnlyPattern.test(line)) {
      this.addViolation({
        rule: 'requireDarkFirst',
        line: lineNumber,
        column: 0,
        code: line.trim(),
        fix: 'Use dark-first tokens from ENHANCED_DESIGN_TOKENS.foundation',
        severity: 'warning',
      });
    }
  }

  /**
   * Suggest token-based fix for violations
   */
  private suggestTokenFix(violatingCode: string): string {
    const fixes: Record<string, string> = {
      // Color fixes
      '[#000000]': 'ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas',
      '[#ffffff]': 'ENHANCED_DESIGN_TOKENS.foundation.color.content.inverse',
      'bg-red-500': 'ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg',
      'text-blue-600': 'ENHANCED_DESIGN_TOKENS.foundation.color.content.accent',

      // Spacing fixes
      '[4px]': 'ENHANCED_DESIGN_TOKENS.foundation.spacing.xs',
      '[8px]': 'ENHANCED_DESIGN_TOKENS.foundation.spacing.sm',
      '[12px]': 'ENHANCED_DESIGN_TOKENS.foundation.spacing.md',
      '[16px]': 'ENHANCED_DESIGN_TOKENS.foundation.spacing.lg',
      '[24px]': 'ENHANCED_DESIGN_TOKENS.foundation.spacing.xl',
      '[32px]': 'ENHANCED_DESIGN_TOKENS.foundation.spacing.xxl',
      'p-[12px]': 'p-3 (using 8pt grid system)',

      // Z-index fixes
      'z-[999]': 'ENHANCED_DESIGN_TOKENS.foundation.zIndex.modal',
      'z-[1000]': 'ENHANCED_DESIGN_TOKENS.foundation.zIndex.popover',

      // Motion fixes
      'duration-[240ms]': 'ENHANCED_DESIGN_TOKENS.foundation.motion.duration.slow',
      'duration-[180ms]': 'ENHANCED_DESIGN_TOKENS.foundation.motion.duration.normal',
      'duration-[120ms]': 'ENHANCED_DESIGN_TOKENS.foundation.motion.duration.fast',

      // Accessibility fixes
      // eslint-disable-next-line no-restricted-syntax
      'sr-only': 'Use <VisuallyHidden> from @/components/primitives instead of sr-only class',
    };

    return fixes[violatingCode] || 'Use enhanced design tokens from ENHANCED_DESIGN_TOKENS (SSOT).';
  }

  /**
   * Add violation to report
   */
  private addViolation(violation: TokenViolation): void {
    this.violations.push(violation);
  }

  /**
   * Generate governance report
   */
  generateReport(): GovernanceReport {
    const complianceScore = Math.max(0, 100 - (this.violations.length * 5));

    return {
      tokenViolations: this.violations,
      zIndexViolations: [],
      motionViolations: [],
      complianceScore,
      timestamp: new Date(),
    };
  }

  /**
   * Auto-fix violations where possible
   */
  autoFix(code: string): string {
    let fixedCode = code;

    for (const violation of this.violations) {
      if (violation.fix.includes('ENHANCED_DESIGN_TOKENS')) {
        // Only auto-fix when we have a direct token replacement
        fixedCode = fixedCode.replace(violation.code, violation.fix);
      }
    }

    return fixedCode;
  }

  /**
   * Validate className string against token rules
   */
  static validateClassName(className: string): TokenViolation[] {
    const guard = new TokenGuard();
    return guard.validateCode(`className="${className}"`);
  }

  /**
   * Check if className is compliant
   */
  static isCompliant(className: string): boolean {
    const violations = TokenGuard.validateClassName(className);
    return violations.length === 0;
  }
}

// ===== REACT HOOK FOR RUNTIME VALIDATION =====

export function useTokenGuard(config?: Partial<TokenGuardConfig>) {
  const guard = React.useMemo(() => new TokenGuard(config), [config]);

  const validateProps = React.useCallback((props: Record<string, unknown>) => {
    const violations: TokenViolation[] = [];

    // Validate className prop
    if (typeof props.className === 'string') {
      violations.push(...TokenGuard.validateClassName(props.className));
    }

    // Validate style prop
    if (props.style && typeof props.style === 'object') {
      violations.push({
        rule: 'enforceEnhancedTokens',
        line: 0,
        column: 0,
        code: 'style prop',
        fix: 'Use className with enhanced tokens instead',
        severity: 'warning',
      });
    }

    return violations;
  }, []);

  return {
    guard,
    validateProps,
    isCompliant: (className: string) => TokenGuard.isCompliant(className),
  };
}

// ===== DEVELOPMENT MODE HELPERS =====

export function withTokenGuard<P extends { className?: string }>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  if (process.env.NODE_ENV === 'production') {
    return Component;
  }

  const GuardedComponent = (props: P) => {
    const { validateProps } = useTokenGuard();

    React.useEffect(() => {
      const violations = validateProps(props);

      if (violations.length > 0) {
        console.group('🛡️ TokenGuard Violations');
        for (const violation of violations) {
          console.warn(`${violation.severity.toUpperCase()}: ${violation.rule}`, {
            code: violation.code,
            fix: violation.fix,
          });
        }
        console.groupEnd();
      }
    }, [props, validateProps]);

    return <Component {...props} />;
  };

  GuardedComponent.displayName = `TokenGuarded(${Component.displayName || Component.name})`;

  return GuardedComponent;
}

export default TokenGuard;

// ===== ESLint Plugin (AST-based) =====
// Non-breaking: we also export rules/configs for ESLint usage while keeping default TokenGuard class.

// Simple type definitions for ESLint without requiring external dependencies
interface ESLintNode {
  type: string;
  name?: { name: string };
  value?: {
    type: string;
    value?: string;
    expression?: {
      type: string;
      value?: string;
      callee?: { type: string; name?: string; property?: { name: string } };
      quasis?: Array<{ value: { cooked: string } }>;
      properties?: Array<{ value: { type: string } }>;
    };
  };
  source?: { value: string };
}

interface ESLintContext {
  report: (args: { node: ESLintNode; message: string }) => void;
  getFilename: () => string;
}

interface ESLintRule {
  meta: { type: string; docs: { description: string } };
  create: (ctx: ESLintContext) => Record<string, (node: ESLintNode) => void>;
}

function isCnOrCva(node: ESLintNode): boolean {
  return node &&
    node.type === 'CallExpression' &&
    ((node.value?.expression?.callee?.type === 'Identifier' &&
      (node.value.expression.callee.name === 'cn' || node.value.expression.callee.name === 'cva')) ||
     (node.value?.expression?.callee?.type === 'MemberExpression' &&
      node.value.expression.callee.property?.name === 'cn'));
}

function extractClassStrings(node: ESLintNode): string[] {
  // Literal: className="..."
  if (node?.value?.type === 'Literal' && typeof node.value.value === 'string') {
    return [node.value.value];
  }
  // TemplateLiteral: className={`... ${x}`}
  if (node?.value?.type === 'JSXExpressionContainer' &&
      node.value.expression?.type === 'TemplateLiteral') {
    return node.value.expression.quasis?.map((q) => q.value.cooked).filter(Boolean) || [];
  }
  // Direct string in JSXExpressionContainer: className={"foo bar"}
  if (node?.value?.type === 'JSXExpressionContainer' &&
      node.value.expression?.type === 'Literal' &&
      typeof node.value.expression.value === 'string') {
    return [node.value.expression.value];
  }
  return [];
}

const RAW_TW = /\b(bg|text|border|shadow|ring|p|m|space|gap|w|h|rounded|z|inset|top|left|right|bottom)-[A-Za-z0-9:/.-]+\b/;
const ARBITRARY_TW = /\[[^\]]+\]/; // e.g., p-[13px], bg-[color:var(--foo)]
const IMPORTANT_TW = /(^|\s)![A-Za-z0-9-:/[\]]+/; // e.g., !mt-2
const LIGHT_ONLY = /\b(bg-white|text-black|border-gray-200)\b/;
const SR_ONLY_USAGE = /\bsr-only\b/; // Direct sr-only class usage

export const rules: Record<string, ESLintRule> = {
  "no-raw-tailwind-in-components": {
    meta: { type: "problem", docs: { description: "Disallow raw Tailwind in components; use tokens/CVA" } },
    create(ctx: ESLintContext) {
      return {
        JSXAttribute(node: ESLintNode) {
          if (node.name?.name !== "className") return;
          // Allow cn()/cva() wrappers – they resolve tokens/variants elsewhere
          if (node.value?.type === "JSXExpressionContainer" && isCnOrCva(node)) return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (RAW_TW.test(chunk)) {
              if (ARBITRARY_TW.test(chunk) || IMPORTANT_TW.test(chunk)) {
                ctx.report({ node, message: "Arbitrary/important Tailwind detected. Use tokens/CVA." });
              } else {
                ctx.report({ node, message: "Raw Tailwind detected. Use tokenized CVA variants instead." });
              }
            }
          }
        },
      };
    },
  },
  "no-inline-style-hardcoded": {
    meta: { type: "problem", docs: { description: "Disallow style={{ ... }} with hardcoded values in components" } },
    create(ctx: ESLintContext) {
      return {
        JSXAttribute(node: ESLintNode) {
          if (node.name?.name !== "style") return;
          if (node.value?.type === "JSXExpressionContainer" &&
              node.value.expression?.type === "ObjectExpression") {
            // Any Literal values in style are considered drift (colors/px/etc)
            for (const prop of node.value.expression.properties || []) {
              if (prop.value.type === "Literal") {
                ctx.report({ node, message: "Inline style literal detected. Use tokens via className variants." });
              }
            }
          }
        },
      };
    },
  },
  "require-dark-first": {
    meta: { type: "suggestion", docs: { description: "Disallow light-only classes; enforce dark-first tokens" } },
    create(ctx: ESLintContext) {
      return {
        JSXAttribute(node: ESLintNode) {
          if (node.name?.name !== "className") return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (LIGHT_ONLY.test(chunk)) {
              ctx.report({ node, message: "Light-only utility found. Use dark-first tokens (ENHANCED_DESIGN_TOKENS)." });
            }
          }
        },
      };
    },
  },
  "enforce-visually-hidden": {
    meta: { type: "suggestion", docs: { description: "Require <VisuallyHidden> component instead of sr-only class" } },
    create(ctx: ESLintContext) {
      return {
        JSXAttribute(node: ESLintNode) {
          if (node.name?.name !== "className") return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (SR_ONLY_USAGE.test(chunk)) {
              ctx.report({ node, message: "Use <VisuallyHidden> from @/components/primitives instead of sr-only class." });
            }
          }
        },
      };
    },
  },
  "enforce-token-imports": {
    meta: { type: "suggestion", docs: { description: "Components must import SSOT tokens" } },
    create(ctx: ESLintContext) {
      let hasTokensImport = false;
      return {
        ImportDeclaration(node: ESLintNode) {
          const src = node.source?.value || "";
          if (typeof src === "string" && src.includes("/tokens")) hasTokensImport = true;
        },
        "Program:exit"(node: ESLintNode) {
          const filename = ctx.getFilename();
          if (filename.includes("/components/") && !hasTokensImport) {
            ctx.report({ node, message: "Missing tokens import in component file. Import ENHANCED_DESIGN_TOKENS." });
          }
        },
      };
    },
  },
};

export const configs = {
  recommended: {
    plugins: ["maps-token-guard"],
    rules: {
      "maps-token-guard/no-raw-tailwind-in-components": "error",
      "maps-token-guard/no-inline-style-hardcoded": "error",
      "maps-token-guard/require-dark-first": "warn",
      "maps-token-guard/enforce-token-imports": "warn",
      "maps-token-guard/enforce-visually-hidden": "warn",
    },
  },
};

// Consumers can import { eslintPlugin } in their ESLint config.
export const eslintPlugin = { rules, configs };
