/**
 * InteractionSystem - Interaction Components Index
 *
 * Drag & drop, gesture handling, and interaction components
 * with accessibility and MAPS v3.0 integration.
 *
 * MAPS v3.0 Integration:
 * - Clean exports for component library
 * - TypeScript type exports
 * - Organized component groups
 */

// ===== CORE COMPONENTS =====

export { default as DragDropProvider } from './DragDropProvider';
export type {
  DragDropProviderProps,
  DragDropSensor,
  DragDropModifier,
  MeasuringConfiguration,
  DragDropAnnouncements,
  ScreenReaderInstructions,
} from './DragDropProvider';
export { DragDropPatterns } from './DragDropProvider';
