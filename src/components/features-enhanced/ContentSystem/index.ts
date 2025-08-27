/**
 * ContentSystem - Content Management Components Index
 *
 * Rich text editing and content manipulation components
 * with MAPS v3.0 integration.
 *
 * MAPS v3.0 Integration:
 * - Clean exports for component library
 * - TypeScript type exports
 * - Organized component groups
 */

// ===== CORE COMPONENTS =====

export { default as SimpleEditor } from './SimpleEditor';
export type {
  SimpleEditorProps,
  ToolbarConfig,
  ToolbarTool,
} from './SimpleEditor';
export { EditorPresets } from './SimpleEditor';

// ===== RE-EXPORTS =====

export * from './SimpleEditor';
