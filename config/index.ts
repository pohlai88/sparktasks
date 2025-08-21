/**
 * @fileoverview Configuration Consolidation Summary
 *
 * Clean, enterprise-ready configuration structure with proper @ alias usage.
 *
 * COMPLETED CLEANUP:
 *
 * 1. ESLINT CONFIGURATION:
 *    ✅ Single main config: .eslintrc.cjs
 *    ✅ Specialized configs: config/eslint-ssot.cjs, config/eslint-vitest.cjs
 *    ✅ Removed duplicates and circular dependencies
 *
 * 2. TYPESCRIPT CONFIGURATION:
 *    ✅ Main config: tsconfig.json
 *    ✅ Node config: tsconfig.node.json
 *    ✅ Test configs: config/tsconfig-base.json, config/tsconfig-test.json
 *
 * 3. VITEST CONFIGURATION:
 *    ✅ Main config: config/vitest.config.ts
 *    ✅ Proxy file: vitest.config.ts (for backward compatibility)
 *
 * USAGE:
 * - Default linting: npx eslint .
 * - SSOT linting: npx eslint --config config/eslint-ssot.cjs src/
 * - Vitest testing: npx vitest (uses config/vitest.config.ts)
 */

// Re-export main configurations
export { default as vitestConfig } from './vitest.config';
