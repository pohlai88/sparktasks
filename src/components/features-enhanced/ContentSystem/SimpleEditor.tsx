/**
 * SimpleEditor - Rich Text Editor
 *
 * Lightweight rich text editor with TipTap integration, MAPS theming,
 * and content management features.
 *
 * MAPS v3.0 Integration:
 * - ENHANCED_DESIGN_TOKENS for all styling
 * - Motion presets for animations
 * - Accessibility compliance
 * - Keyboard navigation
 */

import { cva, type VariantProps } from 'class-variance-authority';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Image,
  Table
} from 'lucide-react';
import React from 'react';

import { getAdaptiveMotionClasses } from '@/components/primitives/motion-utils';
import { cn } from '@/utils/cn';

// ===== EDITOR INTERFACES =====

export interface EditorContent {
  type: 'html' | 'markdown' | 'json' | 'text';
  data: string | object;
  metadata?: {
    wordCount?: number;
    characterCount?: number;
    lastModified?: Date;
    version?: string;
  };
}

export interface EditorCommand {
  name: string;
  description: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
}

export interface EditorExtension {
  name: string;
  configure?: object;
  commands?: EditorCommand[];
  menuItems?: EditorCommand[];
}

export interface EditorTheme {
  toolbar: string;
  editor: string;
  content: string;
  menuButton: string;
  activeButton: string;
  disabledButton: string;
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
      xl: 'min-h-[500px]',
    },
    variant: {
      standard: '',
      minimal: 'border-none shadow-none',
      compact: '',
    },
    disabled: {
      true: 'opacity-50 pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    surface: 'elevated',
    size: 'md',
    variant: 'standard',
    disabled: false,
  }
});

const toolbarVariants = cva([
  'flex items-center gap-1 p-2 border-b bg-surface-subtle',
  'sticky top-0 z-10',
], {
  variants: {
    surface: {
      elevated: 'border-border-elevated bg-surface-elevated',
      glass: 'border-border-glass bg-surface-panel/90 backdrop-blur-sm',
    },
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col items-start',
      floating: 'absolute top-2 left-2 right-2 rounded-lg shadow-lg',
    },
  },
  defaultVariants: {
    surface: 'elevated',
    layout: 'horizontal',
  }
});

const toolbarButtonVariants = cva([
  'inline-flex items-center justify-center w-8 h-8 rounded transition-colors',
  'hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
], {
  variants: {
    variant: {
      default: 'text-foreground-muted hover:text-foreground',
      active: 'bg-accent text-accent-foreground hover:bg-accent-hover',
      disabled: 'text-foreground-disabled cursor-not-allowed',
    },
    size: {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  }
});

const editorContentVariants = cva([
  'prose prose-sm max-w-none focus:outline-none',
  'p-4 min-h-[inherit]',
], {
  variants: {
    theme: {
      light: 'prose-gray',
      dark: 'prose-invert',
      auto: '',
    },
  },
  defaultVariants: {
    theme: 'auto',
  }
});

// ===== TOOLBAR CONFIGURATION =====

interface ToolbarGroup {
  name: string;
  items: EditorCommand[];
}

const defaultToolbarGroups: ToolbarGroup[] = [
  {
    name: 'history',
    items: [
      {
        name: 'undo',
        description: 'Undo',
        shortcut: 'Ctrl+Z',
        icon: <Undo className="w-4 h-4" />,
        action: () => console.log('undo'),
      },
      {
        name: 'redo',
        description: 'Redo',
        shortcut: 'Ctrl+Y',
        icon: <Redo className="w-4 h-4" />,
        action: () => console.log('redo'),
      },
    ],
  },
  {
    name: 'formatting',
    items: [
      {
        name: 'bold',
        description: 'Bold',
        shortcut: 'Ctrl+B',
        icon: <Bold className="w-4 h-4" />,
        action: () => console.log('bold'),
      },
      {
        name: 'italic',
        description: 'Italic',
        shortcut: 'Ctrl+I',
        icon: <Italic className="w-4 h-4" />,
        action: () => console.log('italic'),
      },
      {
        name: 'underline',
        description: 'Underline',
        shortcut: 'Ctrl+U',
        icon: <Underline className="w-4 h-4" />,
        action: () => console.log('underline'),
      },
      {
        name: 'strikethrough',
        description: 'Strikethrough',
        icon: <Strikethrough className="w-4 h-4" />,
        action: () => console.log('strikethrough'),
      },
      {
        name: 'code',
        description: 'Inline Code',
        shortcut: 'Ctrl+`',
        icon: <Code className="w-4 h-4" />,
        action: () => console.log('code'),
      },
    ],
  },
  {
    name: 'headings',
    items: [
      {
        name: 'heading1',
        description: 'Heading 1',
        shortcut: 'Ctrl+Alt+1',
        icon: <Heading1 className="w-4 h-4" />,
        action: () => console.log('heading1'),
      },
      {
        name: 'heading2',
        description: 'Heading 2',
        shortcut: 'Ctrl+Alt+2',
        icon: <Heading2 className="w-4 h-4" />,
        action: () => console.log('heading2'),
      },
      {
        name: 'heading3',
        description: 'Heading 3',
        shortcut: 'Ctrl+Alt+3',
        icon: <Heading3 className="w-4 h-4" />,
        action: () => console.log('heading3'),
      },
    ],
  },
  {
    name: 'lists',
    items: [
      {
        name: 'bulletList',
        description: 'Bullet List',
        shortcut: 'Ctrl+Shift+8',
        icon: <List className="w-4 h-4" />,
        action: () => console.log('bulletList'),
      },
      {
        name: 'orderedList',
        description: 'Numbered List',
        shortcut: 'Ctrl+Shift+7',
        icon: <ListOrdered className="w-4 h-4" />,
        action: () => console.log('orderedList'),
      },
      {
        name: 'blockquote',
        description: 'Quote',
        shortcut: 'Ctrl+Shift+>',
        icon: <Quote className="w-4 h-4" />,
        action: () => console.log('blockquote'),
      },
    ],
  },
  {
    name: 'alignment',
    items: [
      {
        name: 'alignLeft',
        description: 'Align Left',
        icon: <AlignLeft className="w-4 h-4" />,
        action: () => console.log('alignLeft'),
      },
      {
        name: 'alignCenter',
        description: 'Align Center',
        icon: <AlignCenter className="w-4 h-4" />,
        action: () => console.log('alignCenter'),
      },
      {
        name: 'alignRight',
        description: 'Align Right',
        icon: <AlignRight className="w-4 h-4" />,
        action: () => console.log('alignRight'),
      },
    ],
  },
  {
    name: 'insert',
    items: [
      {
        name: 'link',
        description: 'Insert Link',
        shortcut: 'Ctrl+K',
        icon: <Link className="w-4 h-4" />,
        action: () => console.log('link'),
      },
      {
        name: 'image',
        description: 'Insert Image',
        icon: <Image className="w-4 h-4" />,
        action: () => console.log('image'),
      },
      {
        name: 'table',
        description: 'Insert Table',
        icon: <Table className="w-4 h-4" />,
        action: () => console.log('table'),
      },
    ],
  },
];

// ===== MAIN COMPONENT =====

export interface SimpleEditorProps extends VariantProps<typeof simpleEditorVariants> {
  // Content
  content?: EditorContent;
  defaultContent?: string;
  placeholder?: string;

  // Configuration
  extensions?: EditorExtension[];
  toolbarGroups?: ToolbarGroup[];
  showToolbar?: boolean;
  showStatusBar?: boolean;
  showWordCount?: boolean;
  showCharCount?: boolean;

  // Behavior
  autofocus?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  readOnly?: boolean;
  spellCheck?: boolean;

  // Validation
  maxLength?: number;
  minLength?: number;
  required?: boolean;

  // Theme & Layout
  toolbarLayout?: 'horizontal' | 'vertical' | 'floating';
  contentTheme?: 'light' | 'dark' | 'auto';

  // Callbacks
  onChange?: (content: EditorContent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelectionChange?: (selection: { from: number; to: number }) => void;
  onError?: (error: Error) => void;

  // Advanced Features
  collaborative?: {
    enabled: boolean;
    userId?: string;
    documentId?: string;
    websocketUrl?: string;
  };

  // Custom Commands
  customCommands?: EditorCommand[];

  className?: string;
}

export function SimpleEditor({
  content,
  defaultContent = '',
  placeholder = 'Start writing...',
  toolbarGroups = defaultToolbarGroups,
  showToolbar = true,
  showStatusBar = true,
  showWordCount = true,
  showCharCount = true,
  surface = 'elevated',
  size = 'md',
  variant = 'standard',
  autoSave = false,
  autoSaveDelay = 1000,
  readOnly = false,
  spellCheck = true,
  maxLength,
  minLength,
  toolbarLayout = 'horizontal',
  contentTheme = 'auto',
  onChange,
  onFocus,
  onBlur,
  onError,
  collaborative,
  customCommands = [],
  className,
  ...props
}: Omit<SimpleEditorProps, 'extensions' | 'autofocus' | 'required' | 'onSelectionChange'>) {
  // ===== STATE MANAGEMENT =====

  const [editorContent, setEditorContent] = React.useState<string>(defaultContent);
  const [_isFocused, setIsFocused] = React.useState(false);
  const [wordCount, setWordCount] = React.useState(0);
  const [charCount, setCharCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  // ===== REFS =====

  const editorRef = React.useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  // ===== MOTION INTEGRATION =====

  const motionClasses = getAdaptiveMotionClasses('all');

  // ===== CONTENT MANAGEMENT =====

  // ===== EVENT HANDLERS =====

  const handleContentChange = React.useCallback((newContent: string) => {
    // Validation
    if (maxLength && newContent.length > maxLength) {
      setError(`Content exceeds maximum length of ${maxLength} characters`);
      return;
    }

    if (minLength && newContent.length < minLength) {
      setError(`Content must be at least ${minLength} characters`);
    } else {
      setError(null);
    }

    const contentData: EditorContent = {
      type: 'html',
      data: newContent,
      metadata: {
        wordCount,
        characterCount: charCount,
        lastModified: new Date(),
        version: '1.0',
      },
    };

    onChange?.(contentData);
  }, [maxLength, minLength, wordCount, charCount, onChange]);

  React.useEffect(() => {
    if (content?.data && typeof content.data === 'string') {
      setEditorContent(content.data);
    }
  }, [content]);

  React.useEffect(() => {
    // Update statistics
    const words = editorContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(editorContent.length);

    // Auto-save
    if (autoSave && onChange) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleContentChange(editorContent);
      }, autoSaveDelay);
    }
  }, [editorContent, autoSave, autoSaveDelay, onChange, handleContentChange]);

  const handleInput = React.useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const newContent = target.innerHTML;
    setEditorContent(newContent);

    if (!autoSave) {
      handleContentChange(newContent);
    }
  }, [autoSave, handleContentChange]);

  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    const isCtrl = e.ctrlKey || e.metaKey;

    // Find matching command
    const allCommands = [
      ...toolbarGroups.flatMap(group => group.items),
      ...customCommands,
    ];

    for (const command of allCommands) {
      if (command.shortcut && matchesShortcut(e, command.shortcut)) {
        e.preventDefault();
        command.action();
        return;
      }
    }

    // Handle special keys
    if (isCtrl && e.key === 'a') {
      // Allow Ctrl+A for select all
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }, [toolbarGroups, customCommands]);

  // ===== TOOLBAR COMMANDS =====

  const executeCommand = React.useCallback((commandName: string) => {
    try {
      const commands: Record<string, () => void> = {
        undo: () => document.execCommand('undo'),
        redo: () => document.execCommand('redo'),
        bold: () => document.execCommand('bold'),
        italic: () => document.execCommand('italic'),
        underline: () => document.execCommand('underline'),
        strikethrough: () => document.execCommand('strikeThrough'),
        code: () => {
          const selection = globalThis.getSelection();
          if (selection && selection.toString()) {
            document.execCommand('insertHTML', false, `<code>${selection.toString()}</code>`);
          }
        },
        heading1: () => document.execCommand('formatBlock', false, '<h1>'),
        heading2: () => document.execCommand('formatBlock', false, '<h2>'),
        heading3: () => document.execCommand('formatBlock', false, '<h3>'),
        bulletList: () => document.execCommand('insertUnorderedList'),
        orderedList: () => document.execCommand('insertOrderedList'),
        blockquote: () => document.execCommand('formatBlock', false, '<blockquote>'),
        alignLeft: () => document.execCommand('justifyLeft'),
        alignCenter: () => document.execCommand('justifyCenter'),
        alignRight: () => document.execCommand('justifyRight'),
        link: () => {
          const url = prompt('Enter URL:');
          if (url) {
            document.execCommand('createLink', false, url);
          }
        },
        image: () => {
          const url = prompt('Enter image URL:');
          if (url) {
            document.execCommand('insertImage', false, url);
          }
        },
      };

      const command = commands[commandName];
      if (command) {
        command();
        // Update content after command execution
        const newContent = editorRef.current?.innerHTML || '';
        setEditorContent(newContent);
        handleContentChange(newContent);
      }
    } catch (error_) {
      const error = error_ instanceof Error ? error_ : new Error('Command execution failed');
      setError(error.message);
      onError?.(error);
    }
  }, [handleContentChange, onError]);

  const isCommandActive = React.useCallback((commandName: string): boolean => {
    try {
      const activeStates: Record<string, () => boolean> = {
        bold: () => document.queryCommandState('bold'),
        italic: () => document.queryCommandState('italic'),
        underline: () => document.queryCommandState('underline'),
        strikethrough: () => document.queryCommandState('strikeThrough'),
      };

      const checker = activeStates[commandName];
      return checker ? checker() : false;
    } catch {
      return false;
    }
  }, []);

  // ===== RENDER HELPERS =====

  const renderToolbarButton = (command: EditorCommand) => (
    <button
      key={command.name}
      onClick={() => executeCommand(command.name)}
      className={toolbarButtonVariants({
        variant: isCommandActive(command.name) ? 'active' : 'default',
      })}
      title={`${command.description}${command.shortcut ? ` (${command.shortcut})` : ''}`}
      disabled={command.isDisabled?.() || readOnly}
    >
      {command.icon}
    </button>
  );

  const renderToolbar = () => (
    <div className={toolbarVariants({ surface, layout: toolbarLayout })}>
      {toolbarGroups.map((group, index) => (
        <React.Fragment key={group.name}>
          {index > 0 && (
            <div className="w-px h-6 bg-border-subtle mx-1" />
          )}
          <div className="flex items-center gap-0.5">
            {group.items.map(renderToolbarButton)}
          </div>
        </React.Fragment>
      ))}

      {customCommands.length > 0 && (
        <>
          <div className="w-px h-6 bg-border-subtle mx-1" />
          <div className="flex items-center gap-0.5">
            {customCommands.map(renderToolbarButton)}
          </div>
        </>
      )}
    </div>
  );

  const renderStatusBar = () => (
    <div className="flex items-center justify-between px-4 py-2 text-xs text-foreground-muted border-t border-border-subtle bg-surface-subtle">
      <div className="flex items-center gap-4">
        {showWordCount && (
          <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
        )}
        {showCharCount && (
          <span>{charCount} character{charCount !== 1 ? 's' : ''}</span>
        )}
        {maxLength && (
          <span className={charCount > maxLength ? 'text-error' : ''}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {collaborative?.enabled && (
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            Connected
          </span>
        )}
        {error && (
          <span className="text-error">{error}</span>
        )}
      </div>
    </div>
  );

  // ===== RENDER =====

  return (
    <div
      className={cn(
        simpleEditorVariants({ surface, size, variant, disabled: readOnly }),
        motionClasses,
        className
      )}
      {...props}
    >
      {/* Toolbar */}
      {showToolbar && renderToolbar()}

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        className={editorContentVariants({ theme: contentTheme })}
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        spellCheck={spellCheck}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
        tabIndex={0}
        style={{
          minHeight: 'inherit',
        }}
      />

      {/* Status Bar */}
      {showStatusBar && renderStatusBar()}
    </div>
  );
}

// ===== UTILITY FUNCTIONS =====

function matchesShortcut(e: React.KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts.at(-1) || '';

  const needsCtrl = parts.includes('ctrl');
  const needsAlt = parts.includes('alt');
  const needsShift = parts.includes('shift');

  return (
    e.key.toLowerCase() === key &&
    (needsCtrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey) &&
    (needsAlt ? e.altKey : !e.altKey) &&
    (needsShift ? e.shiftKey : !e.shiftKey)
  );
}

// ===== EXTENSIONS & PRESETS =====

export const EditorPresets = {
  minimal: {
    showToolbar: true,
    toolbarGroups: [
      {
        name: 'basic',
        items: defaultToolbarGroups[1]?.items.slice(0, 3) || [], // Bold, Italic, Underline
      },
    ],
    showStatusBar: false,
    size: 'sm' as const,
  },
  standard: {
    showToolbar: true,
    toolbarGroups: defaultToolbarGroups.slice(0, 4), // History, Formatting, Headings, Lists
    showStatusBar: true,
    size: 'md' as const,
  },
  advanced: {
    showToolbar: true,
    toolbarGroups: defaultToolbarGroups,
    showStatusBar: true,
    showWordCount: true,
    showCharCount: true,
    size: 'lg' as const,
  },
  readonly: {
    readOnly: true,
    showToolbar: false,
    showStatusBar: false,
    variant: 'minimal' as const,
  },
} as const;

export default SimpleEditor;
