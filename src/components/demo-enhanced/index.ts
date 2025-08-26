/**
 * Enhanced Demo Components - MAPS v2.2 Export Index
 *
 * Centralized exports for Enhanced Component demonstrations
 * following proper module organization patterns and anti-drift enforcement
 */

// Primary component export
export { ComponentsDemo } from './ComponentsDemo';

// Enhanced ContextMenu Examples
export {
  default as ContextMenuExamples,
  BasicContextMenuExample,
  VariantExamplesGrid,
  FactoryPatternExample,
  ComplexMenuExample,
  EnhancedContextMenuExample,
} from './ContextMenuExamples';

// Enhanced Accordion Demo
export { AccordionDemo } from './AccordionDemo';
export { default as AccordionDemoDefault } from './AccordionDemo';

// Enhanced Collapsible Demo
export { default as CollapsibleDemo } from './CollapsibleDemo';

// Enhanced MenuBar Demo
export { default as MenuBarDemo } from './MenuBarDemo';

// Enhanced Tooltip Demo
export { default as EnhancedTooltipDemo } from './EnhancedTooltipDemo';

// Re-export as default for convenience
export { default as ComponentsDemoDefault } from './ComponentsDemo';

// Type exports (if any were defined)
// export type { ComponentsDemoProps } from './ComponentsDemo';
