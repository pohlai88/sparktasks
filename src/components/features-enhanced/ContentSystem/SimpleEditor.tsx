/**
 * SimpleEditor - Rich Text Editor
 *
 * Extensible rich text editor built on TipTap with MAPS theming and common formatting tools.
 *
 * MAPS v3.0 Integration:
 * - ENHANCED_DESIGN_TOKENS for all styling
 * - Motion presets for animations
 * - Accessibility compliance
 * - Keyboard navigation
 */

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from 'lucide-react';
import React from 'react';

import { getAdaptiveMotionClasses } from '@/components/primitives/motion-utils';
import { cn } from '@/utils/cn';

// ===== INTERFACES =====

export interface SimpleEditorProps extends VariantProps<typeof simpleEditorVariants> {
  // Content
  content?: string;
  defaultContent?: string;
  onContentChange?: (content: string) => void;

  // Configuration
  placeholder?: string;
  autofocus?: boolean | 'start' | 'end';
  editable?: boolean;

  // Features
  toolbar?: ToolbarConfig | boolean;
  characterLimit?: number;
  showCharacterCount?: boolean;

  // Appearance
  surface?: 'elevated' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  minHeight?: number;
  maxHeight?: number;

  // Auto-save
  autosave?: {
    enabled: boolean;
    delay?: number;
    key?: string;
    onSave?: (content: string) => void;
  };

  // Callbacks
  onCreate?: (editor: Editor) => void;
  onUpdate?: (editor: Editor) => void;
  onFocus?: (editor: Editor) => void;
  onBlur?: (editor: Editor) => void;

  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
}

export interface ToolbarConfig {
  // Format Groups
  basic?: boolean; // Bold, italic, strikethrough
  formatting?: boolean; // Headers, paragraph styles
  lists?: boolean; // Ordered/unordered lists
  history?: boolean; // Undo/redo

  // Custom Tools
  customTools?: ToolbarTool[];

  // Layout
  position?: 'top' | 'bottom';
  sticky?: boolean;
}

export interface ToolbarTool {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
}

// ===== COMPONENT VARIANTS =====

const simpleEditorVariants = cva([
  'simple-editor relative border rounded-lg overflow-hidden',
  'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
], {
  variants: {
    surface: {
      elevated: [
        'bg-surface-elevated border-border-elevated',
      ],
      glass: [
        'backdrop-blur-sm bg-surface-panel/80 border-border-glass',
      ],
    },
    size: {
      sm: 'min-h-[200px]',
      md: 'min-h-[300px]',
      lg: 'min-h-[400px]',
    },
    disabled: {
      true: 'opacity-60 cursor-not-allowed',
      false: '',
    },
  },
  defaultVariants: {
    surface: 'elevated',
    size: 'md',
    disabled: false,
  }
});

const toolbarVariants = cva([
  'flex items-center gap-1 p-2 border-b border-border-subtle bg-surface-panel',
], {
  variants: {
    position: {
      top: '',
      bottom: 'border-t border-b-0 order-last',
    },
    sticky: {
      true: 'sticky top-0 z-10',
      false: '',
    },
  },
  defaultVariants: {
    position: 'top',
    sticky: false,
  }
});

const toolbarButtonVariants = cva([
  'inline-flex items-center justify-center',
  'h-8 w-8 p-0',
  'text-foreground-muted hover:text-foreground',
  'border border-transparent',
  'rounded transition-colors',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
], {
  variants: {
    variant: {
      default: 'hover:bg-surface-accent',
      active: 'bg-surface-accent text-foreground border-border-accent',
    },
  },
  defaultVariants: {
    variant: 'default',
  }
});

// ===== TOOLBAR COMPONENT =====

interface EditorToolbarProps {
  editor: Editor;
  config: ToolbarConfig;
  className?: string;
}

function EditorToolbar({ editor, config, className }: EditorToolbarProps) {
  const defaultTools = React.useMemo(() => {
    const tools: ToolbarTool[] = [];

    // History tools
    if (config.history !== false) {
      tools.push(
        {
          id: 'undo',
          icon: <Undo size={16} />,
          label: 'Undo',
          action: (editor) => editor.chain().focus().undo().run(),
          isDisabled: (editor) => !editor.can().undo(),
        },
        {
          id: 'redo',
          icon: <Redo size={16} />,
          label: 'Redo',
          action: (editor) => editor.chain().focus().redo().run(),
          isDisabled: (editor) => !editor.can().redo(),
        }
      );
    }

    // Basic formatting tools
    if (config.basic !== false) {
      tools.push(
        {
          id: 'bold',
          icon: <Bold size={16} />,
          label: 'Bold',
          action: (editor) => editor.chain().focus().toggleBold().run(),
          isActive: (editor) => editor.isActive('bold'),
        },
        {
          id: 'italic',
          icon: <Italic size={16} />,
          label: 'Italic',
          action: (editor) => editor.chain().focus().toggleItalic().run(),
          isActive: (editor) => editor.isActive('italic'),
        },
        {
          id: 'strike',
          icon: <Strikethrough size={16} />,
          label: 'Strikethrough',
          action: (editor) => editor.chain().focus().toggleStrike().run(),
          isActive: (editor) => editor.isActive('strike'),
        },
        {
          id: 'code',
          icon: <Code size={16} />,
          label: 'Code',
          action: (editor) => editor.chain().focus().toggleCode().run(),
          isActive: (editor) => editor.isActive('code'),
        }
      );
    }

    // Formatting tools
    if (config.formatting !== false) {
      tools.push(
        {
          id: 'h1',
          icon: <Heading1 size={16} />,
          label: 'Heading 1',
          action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: (editor) => editor.isActive('heading', { level: 1 }),
        },
        {
          id: 'h2',
          icon: <Heading2 size={16} />,
          label: 'Heading 2',
          action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: (editor) => editor.isActive('heading', { level: 2 }),
        },
        {
          id: 'h3',
          icon: <Heading3 size={16} />,
          label: 'Heading 3',
          action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: (editor) => editor.isActive('heading', { level: 3 }),
        },
        {
          id: 'blockquote',
          icon: <Quote size={16} />,
          label: 'Blockquote',
          action: (editor) => editor.chain().focus().toggleBlockquote().run(),
          isActive: (editor) => editor.isActive('blockquote'),
        }
      );
    }

    // List tools
    if (config.lists !== false) {
      tools.push(
        {
          id: 'bulletList',
          icon: <List size={16} />,
          label: 'Bullet List',
          action: (editor) => editor.chain().focus().toggleBulletList().run(),
          isActive: (editor) => editor.isActive('bulletList'),
        },
        {
          id: 'orderedList',
          icon: <ListOrdered size={16} />,
          label: 'Ordered List',
          action: (editor) => editor.chain().focus().toggleOrderedList().run(),
          isActive: (editor) => editor.isActive('orderedList'),
        }
      );
    }

    return tools;
  }, [config]);

  const allTools = [...defaultTools, ...(config.customTools || [])];

  const createToolGroup = (tools: ToolbarTool[], startIndex: number, endIndex: number) => (
    <div key={`group-${startIndex}`} className="flex items-center gap-0.5">
      {tools.slice(startIndex, endIndex).map((tool) => (
        <button
          key={tool.id}
          onClick={() => tool.action(editor)}
          className={cn(
            toolbarButtonVariants({
              variant: tool.isActive?.(editor) ? 'active' : 'default',
            })
          )}
          disabled={tool.isDisabled?.(editor)}
          title={tool.label}
          aria-label={tool.label}
          type="button"
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );

  return (
    <div className={cn(
      toolbarVariants({
        position: config.position,
        sticky: config.sticky,
      }),
      className
    )}>
      {/* History group */}
      {config.history !== false && createToolGroup(allTools, 0, 2)}
      
      {/* Separator */}
      {config.history !== false && config.basic !== false && (
        <div className="w-px h-6 bg-border-subtle mx-1" />
      )}
      
      {/* Basic formatting group */}
      {config.basic !== false && createToolGroup(allTools, 2, 6)}
      
      {/* Separator */}
      {config.basic !== false && config.formatting !== false && (
        <div className="w-px h-6 bg-border-subtle mx-1" />
      )}
      
      {/* Formatting group */}
      {config.formatting !== false && createToolGroup(allTools, 6, 10)}
      
      {/* Separator */}
      {config.formatting !== false && config.lists !== false && (
        <div className="w-px h-6 bg-border-subtle mx-1" />
      )}
      
      {/* Lists group */}
      {config.lists !== false && createToolGroup(allTools, 10, 12)}
      
      {/* Custom tools */}
      {config.customTools && config.customTools.length > 0 && (
        <>
          <div className="w-px h-6 bg-border-subtle mx-1" />
          <div className="flex items-center gap-0.5">
            {config.customTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => tool.action(editor)}
                className={cn(
                  toolbarButtonVariants({
                    variant: tool.isActive?.(editor) ? 'active' : 'default',
                  })
                )}
                disabled={tool.isDisabled?.(editor)}
                title={tool.label}
                aria-label={tool.label}
                type="button"
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ===== MAIN COMPONENT =====

export function SimpleEditor({
  content,
  defaultContent = '',
  onContentChange,
  placeholder = 'Start writing...',
  autofocus = false,
  editable = true,
  toolbar = true,
  characterLimit,
  showCharacterCount = false,
  surface = 'elevated',
  size = 'md',
  minHeight,
  maxHeight,
  autosave,
  onCreate,
  onUpdate,
  onFocus,
  onBlur,
  className,
  editorClassName,
  toolbarClassName,
}: SimpleEditorProps) {
  // ===== STATE =====
  
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  // ===== EDITOR SETUP =====

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      ...(characterLimit ? [CharacterCount.configure({ limit: characterLimit })] : [CharacterCount]),
    ],
    content: content || defaultContent,
    editable,
    autofocus,
    onUpdate: ({ editor: editorInstance }) => {
      const html = editorInstance.getHTML();
      
      // Handle content change
      onContentChange?.(html);
      onUpdate?.(editorInstance);

      // Auto-save with debouncing
      if (autosave?.enabled && autosave.onSave) {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
        autoSaveTimeoutRef.current = setTimeout(() => {
          autosave.onSave!(html);
        }, autosave.delay || 1000);
      }

      // Persist to localStorage if key provided
      if (autosave?.key) {
        localStorage.setItem(autosave.key, html);
      }
    },
    onCreate: ({ editor: editorInstance }) => {
      onCreate?.(editorInstance);
    },
    onFocus: ({ editor: editorInstance }) => {
      onFocus?.(editorInstance);
    },
    onBlur: ({ editor: editorInstance }) => {
      onBlur?.(editorInstance);
    },
  });

  // ===== EFFECTS =====

  // Update content when prop changes
  React.useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Update editable state
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Cleanup auto-save timeout
  React.useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // ===== MOTION INTEGRATION =====

  const motionClasses = getAdaptiveMotionClasses('all');

  // ===== TOOLBAR CONFIG =====

  const toolbarConfig: ToolbarConfig = React.useMemo(() => {
    if (toolbar === false) {
      return { basic: false, formatting: false, lists: false, history: false };
    }
    if (toolbar === true) {
      return { basic: true, formatting: true, lists: true, history: true };
    }
    return toolbar;
  }, [toolbar]);

  // ===== RENDER =====

  if (!editor) {
    return (
      <div className={cn(
        simpleEditorVariants({ surface, size, disabled: !editable }),
        'animate-pulse',
        className
      )}>
        <div className="h-8 bg-surface-panel border-b border-border-subtle" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-surface-accent rounded w-3/4" />
          <div className="h-4 bg-surface-accent rounded w-1/2" />
          <div className="h-4 bg-surface-accent rounded w-2/3" />
        </div>
      </div>
    );
  }

  const characterCount = editor.storage.characterCount?.characters?.() || 0;
  const wordCount = editor.storage.characterCount?.words?.() || 0;

  return (
    <div
      className={cn(
        simpleEditorVariants({ surface, size, disabled: !editable }),
        motionClasses,
        className
      )}
      style={{
        minHeight,
        maxHeight,
      }}
    >
      {/* Toolbar */}
      {toolbar !== false && (
        <EditorToolbar
          editor={editor}
          config={toolbarConfig}
          className={toolbarClassName || ''}
        />
      )}

      {/* Editor Content */}
      <div
        className={cn(
          'prose prose-sm max-w-none p-4',
          'focus-within:outline-none',
          '[&_.ProseMirror]:outline-none',
          '[&_.ProseMirror]:min-h-[100px]',
          '[&_.ProseMirror-placeholder]:text-foreground-muted',
          editorClassName
        )}
        style={{
          minHeight: minHeight ? minHeight - (toolbar !== false ? 48 : 0) : undefined,
          maxHeight: maxHeight ? maxHeight - (toolbar !== false ? 48 : 0) : undefined,
          overflowY: maxHeight ? 'auto' : undefined,
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      {(showCharacterCount || characterLimit || autosave?.enabled) && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border-subtle text-sm text-foreground-muted bg-surface-panel">
          <div className="flex items-center gap-4">
            {showCharacterCount && (
              <span>{wordCount} words, {characterCount} characters</span>
            )}
            {characterLimit && (
              <span className={characterCount > characterLimit ? 'text-error' : ''}>
                {characterCount}/{characterLimit}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {autosave?.enabled && (
              <span className="text-xs text-foreground-muted">
                Auto-save enabled
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== PRE-CONFIGURED VARIANTS =====

export const EditorPresets = {
  // Minimal editor for comments/notes
  minimal: {
    toolbar: {
      basic: true,
      formatting: false,
      lists: true,
      history: true,
    },
    placeholder: 'Write a comment...',
    size: 'sm' as const,
    characterLimit: 500,
    showCharacterCount: true,
  },

  // Full-featured editor for articles
  full: {
    toolbar: {
      basic: true,
      formatting: true,
      lists: true,
      history: true,
    },
    showCharacterCount: true,
    autosave: { enabled: true, delay: 2000 },
    size: 'lg' as const,
  },

  // Simple editor for forms
  form: {
    toolbar: {
      basic: true,
      formatting: false,
      lists: false,
      history: true,
    },
    placeholder: 'Enter your text...',
    size: 'md' as const,
  },
} as const;

export default SimpleEditor;
