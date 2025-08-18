/**
 * SSOT Tailwind -> Design Token mapping for automatic fixing
 * Based on actual violations found in the codebase
 */

module.exports = {
  // === SPACING PATTERNS ===
  // Margins
  'mb-4': 'DESIGN_TOKENS.spacing.sectionMargin',
  'mt-1': 'DESIGN_TOKENS.spacing.tightMargin', 
  'mt-2': 'DESIGN_TOKENS.spacing.stack.sm',
  'mt-6': 'DESIGN_TOKENS.spacing.headerMargin',
  'ml-2': 'DESIGN_TOKENS.spacing.iconLeft',
  'ml-3': 'DESIGN_TOKENS.icons.spacing.left.lg',
  'mr-2': 'DESIGN_TOKENS.spacing.iconLeft',
  'mr-3': 'DESIGN_TOKENS.icons.spacing.left.lg',
  
  // Padding patterns
  'px-4 py-2': 'DESIGN_TOKENS.spacing.buttonPadding',
  'px-3 py-1.5': 'DESIGN_TOKENS.sizing.button.sm',
  'px-3 py-2': 'DESIGN_TOKENS.sizing.input.md',
  'px-2 py-1': 'DESIGN_TOKENS.sizing.badge.sm',
  'pt-4': 'DESIGN_TOKENS.spacing.formPadding',
  'p-4': 'DESIGN_TOKENS.layout.patterns.panelSection',
  'p-6': 'DESIGN_TOKENS.spacing.cardPadding',
  'pl-10': 'DESIGN_TOKENS.layout.patterns.inputWithIcon',
  'pr-10': 'DESIGN_TOKENS.layout.patterns.inputWithIcon',
  'pr-20': 'DESIGN_TOKENS.spacing.formPadding', // TODO: create specific token
  
  // === SIZING PATTERNS ===
  // Icon sizes
  'w-4 h-4': 'DESIGN_TOKENS.icons.legacy.sm',
  'w-5 h-5': 'DESIGN_TOKENS.icons.legacy.md',
  'w-6 h-6': 'DESIGN_TOKENS.icons.legacy.lg',
  'w-8 h-8': 'DESIGN_TOKENS.icons.legacy.xl',
  'w-3 h-3': 'DESIGN_TOKENS.icons.legacy.xs',
  'h-2 w-2': 'DESIGN_TOKENS.icons.legacy.xs',
  'size-5': 'DESIGN_TOKENS.icons.sizes.md',
  'size-3': 'DESIGN_TOKENS.icons.sizes.xs',
  
  // Layout sizes
  'w-full': 'w-full', // Keep as-is, fundamental utility
  'max-h-60': 'max-h-60', // Keep as-is, component-specific
  'min-w-0': 'min-w-0', // Keep as-is, fundamental utility
  
  // === LAYOUT PATTERNS ===
  // Flex patterns
  'flex items-center': 'DESIGN_TOKENS.layout.patterns.centeredContent',
  'flex items-center justify-between': 'DESIGN_TOKENS.layout.patterns.spaceBetween',
  'flex items-center gap-3': 'DESIGN_TOKENS.layout.patterns.iconContainer',
  'flex justify-end': 'DESIGN_TOKENS.layout.patterns.modalFooter',
  'flex gap-3': 'DESIGN_TOKENS.spacing.flexGroup',
  'flex flex-wrap': 'flex flex-wrap', // Keep as-is, fundamental
  'flex-1': 'flex-1', // Keep as-is, fundamental
  
  // Gap patterns
  'gap-1': 'DESIGN_TOKENS.spacing.inlineTight',
  'gap-2': 'DESIGN_TOKENS.spacing.inline',
  'gap-3': 'DESIGN_TOKENS.spacing.flexGroup',
  'space-x-3': 'DESIGN_TOKENS.spacing.buttonGroup',
  
  // === COMPONENT PATTERNS ===
  // Button patterns
  'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg': 'DESIGN_TOKENS.recipes.button.primary',
  'inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg': 'DESIGN_TOKENS.recipes.button.primary',
  
  // Conditional/ternary patterns
  'pl-10': 'DESIGN_TOKENS.layout.patterns.inputWithIcon',
  'pr-10': 'DESIGN_TOKENS.layout.patterns.inputWithIcon',
  
  // Small utility combinations
  'text-sm mt-1': 'DESIGN_TOKENS.typography.body.small',
  'font-medium mb-4': 'DESIGN_TOKENS.typography.heading.small',
  'px-4 py-2 text-xs': 'DESIGN_TOKENS.recipes.smallButton',
  
  // Complex positioning (for Tooltip component)
  'top-full left-1/2 transform -translate-x-1/2 mt-2': 'DESIGN_TOKENS.layout.tooltips.bottom',
  'right-full top-1/2 transform -translate-y-1/2 mr-2': 'DESIGN_TOKENS.layout.tooltips.left',
  
  // Layout header patterns
  'top-0 bg-white border-b px-4 py-3': 'DESIGN_TOKENS.layout.patterns.stickyHeader',
  'mx-auto px-4': 'DESIGN_TOKENS.layout.patterns.centeredContainer',
  'p-2 rounded': 'DESIGN_TOKENS.sizing.badge.md',
  
  // === ADDITIONAL VIOLATION PATTERNS ===
  // Complex positioning patterns
  'absolute z-50 w-full mt-1 max-h-60 overflow-auto p-0': 'DESIGN_TOKENS.layout.patterns.dropdownMenu',
  'absolute right-0 mt-2 w-56 origin-top-right': 'DESIGN_TOKENS.layout.patterns.contextMenu',
  'absolute z-10 mt-1 w-full': 'DESIGN_TOKENS.layout.patterns.selectDropdown',
  'absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap': 'DESIGN_TOKENS.recipes.tooltip',
  'absolute w-0 h-0': 'DESIGN_TOKENS.layout.patterns.tooltipArrow',
  
  // Text and typography
  'text-xs': 'DESIGN_TOKENS.typography.body.xs',
  'text-sm': 'DESIGN_TOKENS.typography.body.small',
  'text-left': 'text-left', // Keep as-is, fundamental
  'font-medium': 'DESIGN_TOKENS.typography.body.medium',
  'whitespace-nowrap': 'whitespace-nowrap', // Keep as-is, fundamental
  
  // Specific button/input patterns
  'w-full text-left px-3 py-2 text-sm': 'DESIGN_TOKENS.sizing.menuItem.md',
  'relative cursor-pointer select-none py-2 pl-10 pr-4 transition-colors': 'DESIGN_TOKENS.recipes.selectOption',
  'w-full flex items-center gap-3 px-3 py-2 text-left': 'DESIGN_TOKENS.recipes.menuButton',
  'px-4 py-2 text-sm font-medium': 'DESIGN_TOKENS.recipes.tabButton',
  'block px-3 py-2 text-sm': 'DESIGN_TOKENS.sizing.menuItem.sm',
  
  // Flex layout patterns
  'flex items-center gap-2': 'DESIGN_TOKENS.layout.patterns.iconText',
  'flex justify-end space-x-3 pt-4 border-t': 'DESIGN_TOKENS.layout.patterns.modalFooter',
  'flex flex-wrap mt-2': 'DESIGN_TOKENS.layout.patterns.tagContainer',
  'min-w-0': 'min-w-0', // Keep as-is, fundamental
  
  // Spacing variations
  'ml-auto pl-3': 'DESIGN_TOKENS.spacing.modalButton',
  'border-b pb-4 mb-4': 'DESIGN_TOKENS.layout.patterns.cardHeader',
  'border-t pt-4 mt-4': 'DESIGN_TOKENS.layout.patterns.cardFooter',
  'mt-4': 'DESIGN_TOKENS.spacing.sectionGap',
  'py-1 z-50': 'DESIGN_TOKENS.layout.patterns.menuContainer',
  'max-h-60 overflow-auto': 'DESIGN_TOKENS.layout.patterns.scrollableMenu',
  
  // Size patterns
  'max-w-md w-full mx-4': 'DESIGN_TOKENS.layout.patterns.modalDialog',
  'w-80': 'DESIGN_TOKENS.sizing.sidebar.default',
  'mx-auto px-4': 'DESIGN_TOKENS.layout.patterns.centeredContainer',
  
  // Responsive gaps
  'gap-3': 'DESIGN_TOKENS.spacing.flexGroup',
  'gap-6': 'DESIGN_TOKENS.spacing.sectionGap',
  'gap-8': 'DESIGN_TOKENS.spacing.largeGap',
  
  // Icon with margin patterns
  'size-5 mr-3 flex-shrink-0': 'DESIGN_TOKENS.icons.withMargin.md',
  
  // === SPECIAL CASES ===
  // Spinner (animate-spin + sizing)
  '__spinner__': 'DESIGN_TOKENS.loading.spinner',
  
  // Complex positioning
  'absolute': 'absolute', // Keep as-is, fundamental
  'sticky': 'sticky', // Keep as-is, fundamental
  'fixed': 'fixed', // Keep as-is, fundamental
  
  // === SAFE SKIPS (don't replace) ===
  // These are intentionally hardcoded for specific component needs
  'z-50': null, // Component-specific z-index
  'z-10': null, // Component-specific z-index
  'rounded': null, // Basic rounding, often contextual
  'border-t': null, // Basic borders, often contextual
  'border-b': null, // Basic borders, often contextual
  'overflow-auto': null, // Fundamental utility
  'truncate': null, // Fundamental utility
  'bg-white': null, // Often contextual
  'shadow-xl': null, // Often contextual
  'select-none': null, // Fundamental utility
  'cursor-pointer': null, // Fundamental utility
  'transition-colors': null, // Fundamental utility
  'flex-shrink-0': null, // Fundamental utility
};
