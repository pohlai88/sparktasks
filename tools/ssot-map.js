/**
 * SSOT Mapping Dictionary - SparkTasks Workspace Specific
 * Generated from real workspace pattern analysis (65/145 files with violations)
 * 
 * This maps banned Tailwind classes → DESIGN_TOKENS.* based on:
 * - Actual usage patterns found in src/components/**
 * - Enterprise governance requirements
 * - Zero-breaking-change migration paths
 */

export const tailwindToTokenMap = {
  // ===== ICON MARGINS (Highest frequency violations) =====
  'ml-2': 'DESIGN_TOKENS.icon.margin.rightSm',
  'mr-2': 'DESIGN_TOKENS.icon.margin.leftSm', 
  'ml-1': 'DESIGN_TOKENS.icon.margin.rightXs',
  'mr-1': 'DESIGN_TOKENS.icon.margin.leftXs',
  'ml-3': 'DESIGN_TOKENS.icon.margin.rightMd',
  'mr-3': 'DESIGN_TOKENS.icon.margin.leftMd',
  'ml-4': 'DESIGN_TOKENS.icon.margin.rightLg',
  'mr-4': 'DESIGN_TOKENS.icon.margin.leftLg',

  // ===== ICON SIZES (Found in Button1.tsx, examples.tsx) =====
  'h-4 w-4': 'DESIGN_TOKENS.icon.size.sm',
  'w-4 h-4': 'DESIGN_TOKENS.icon.size.sm',
  'h-5 w-5': 'DESIGN_TOKENS.icon.size.md',
  'w-5 h-5': 'DESIGN_TOKENS.icon.size.md',
  'h-6 w-6': 'DESIGN_TOKENS.icon.size.lg',
  'w-6 h-6': 'DESIGN_TOKENS.icon.size.lg',
  'h-8 w-8': 'DESIGN_TOKENS.icon.size.xl',
  'w-8 h-8': 'DESIGN_TOKENS.icon.size.xl',

  // ===== LAYOUT PATTERNS (Found in examples.tsx, Layout.tsx) =====
  'flex items-center gap-3': 'DESIGN_TOKENS.layout.patterns.flexGap',
  'flex items-center gap-4': 'DESIGN_TOKENS.layout.patterns.flexGapMd',
  'flex items-center gap-2': 'DESIGN_TOKENS.layout.patterns.flexGapSm',
  'flex items-center gap-6': 'DESIGN_TOKENS.layout.patterns.flexGapLg',
  'flex items-center justify-between': 'DESIGN_TOKENS.layout.patterns.spaceBetween',
  'flex items-center justify-center': 'DESIGN_TOKENS.layout.patterns.centeredContent',

  // ===== SPACING PATTERNS (Found in examples.tsx) =====
  'p-4': 'DESIGN_TOKENS.layout.padBase',
  'p-6': 'DESIGN_TOKENS.layout.padComfortable', 
  'p-8': 'DESIGN_TOKENS.layout.padLarge',
  'px-3': 'DESIGN_TOKENS.spacing.formPadding',
  'py-2': 'DESIGN_TOKENS.spacing.buttonPadding',
  'px-4': 'DESIGN_TOKENS.spacing.buttonPadding',
  'mb-2': 'DESIGN_TOKENS.spacing.tightMargin',
  'mb-4': 'DESIGN_TOKENS.spacing.headerMargin',
  'mb-6': 'DESIGN_TOKENS.spacing.sectionMargin',
  'mt-2': 'DESIGN_TOKENS.spacing.tightMargin',
  'mt-3': 'DESIGN_TOKENS.spacing.stackTight',
  'mt-4': 'DESIGN_TOKENS.spacing.stack',

  // ===== FORM RECIPES (Found in examples.tsx) =====
  'w-full px-3 py-2 border rounded-md': 'DESIGN_TOKENS.recipe.input.base',
  'w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500': 'DESIGN_TOKENS.recipe.input.base',
  'px-3 py-2 border rounded-md': 'DESIGN_TOKENS.recipe.input.base',

  // ===== LOADING STATES (Found in Button1.tsx) =====
  'h-4 w-4 animate-spin': 'DESIGN_TOKENS.loading.spinner',
  'w-4 h-4 animate-spin': 'DESIGN_TOKENS.loading.spinner',
  'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent': 'DESIGN_TOKENS.loading.spinner',

  // ===== TYPOGRAPHY PATTERNS (Found in examples.tsx) =====
  'text-4xl font-bold': 'DESIGN_TOKENS.typography.heading.h1',
  'text-2xl font-semibold': 'DESIGN_TOKENS.typography.heading.h2',
  'text-xl font-semibold': 'DESIGN_TOKENS.typography.heading.h3',
  'text-lg font-medium': 'DESIGN_TOKENS.typography.heading.h4',
  'text-base font-medium': 'DESIGN_TOKENS.typography.heading.h5',
  'text-sm font-medium': 'DESIGN_TOKENS.typography.heading.h6',

  // ===== SEMANTIC COLORS (Found in examples.tsx) =====
  'text-slate-600': 'DESIGN_TOKENS.semantic.text.muted',
  'text-slate-500': 'DESIGN_TOKENS.semantic.text.muted',
  'text-blue-600': 'DESIGN_TOKENS.semantic.text.accent',
  'border': 'DESIGN_TOKENS.theme.light.border.subtle',
  'border-t': 'DESIGN_TOKENS.position.borders.top',

  // ===== CONTAINER PATTERNS (Found in examples.tsx) =====
  'max-w-6xl mx-auto': 'DESIGN_TOKENS.layout.maxContent',
  'max-w-2xl mx-auto': 'DESIGN_TOKENS.layout.maxContentSm',
  'max-w-4xl mx-auto': 'DESIGN_TOKENS.layout.maxContentMd',
  'space-y-4': 'DESIGN_TOKENS.spacing.stack',
  'space-y-6': 'DESIGN_TOKENS.spacing.section',
  'space-y-12': 'DESIGN_TOKENS.spacing.sectionLarge',

  // ===== OVERLAY PATTERNS (Found in Layout.tsx) =====
  'fixed inset-0 bg-black/50': 'DESIGN_TOKENS.recipe.overlay',
  'fixed inset-0 bg-black/40': 'DESIGN_TOKENS.recipe.overlay',

  // ===== SPECIAL COMBINATIONS (Multi-token patterns) =====
  '__spinner_combo__': 'DESIGN_TOKENS.loading.spinner', // For animate-spin + size combinations
  '__flex_center__': 'DESIGN_TOKENS.layout.patterns.centeredContent',
  '__input_focus__': 'DESIGN_TOKENS.recipe.input.base', // For input + focus combinations
};

/**
 * Pattern Priority Order (for ESLint rule processing):
 * 1. Multi-token patterns (spinner combos, flex patterns)
 * 2. Layout recipes (input, button, card)
 * 3. Icon patterns (size + margin combinations)
 * 4. Single utility replacements
 * 
 * Confidence Levels:
 * - 1.0: Direct mapping (ml-2 → icon.margin.rightSm)
 * - 0.9: Recipe mapping (input pattern → recipe.input.base)
 * - 0.8: Multi-class combinations
 * - 0.7: Context-dependent replacements (manual review)
 */
