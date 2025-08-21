/**
 * @fileoverview CommandPalette Component - Enterprise-grade search-driven navigation
 *
 * @component CommandPalette
 * @description A sophisticated command palette for search-driven navigation and action execution.
 * Implements enterprise patterns with keyboard-first interaction, fuzzy search, and accessibility.
 *
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 *
 * @implements {React.ForwardRefExoticComponent}
 * @implements {WCAG 2.1 AAA Standards}
 * @implements {DESIGN_TOKENS V3.2}
 *
 * Key Features:
 * - Search-driven navigation with fuzzy matching
 * - Keyboard-first interaction (arrow keys, enter, escape)
 * - Command grouping and categorization
 * - Global keyboard shortcuts (⌘+K / Ctrl+K)
 * - Recent commands tracking
 * - Accessibility-first design with screen reader support
 * - Enterprise performance (sub-second response)
 * - Dark mode support
 * - Extensible command system
 * - Portal rendering for z-index safety
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';

import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';
import { cn } from '@/utils/cn';

// ===== TYPE DEFINITIONS =====

/**
 * Command action handler function
 */
export type CommandAction = () => void | Promise<void>;

/**
 * Command item configuration
 */
export interface CommandItem {
  /** Unique identifier for the command */
  id: string;
  /** Display label for the command */
  label: string;
  /** Optional description or subtitle */
  description?: string;
  /** Optional icon (React node) */
  icon?: React.ReactNode;
  /** Command execution handler */
  action: CommandAction;
  /** Keyboard shortcut display (e.g., "⌘+N", "Ctrl+Shift+P") */
  shortcut?: string;
  /** Optional keywords for enhanced search */
  keywords?: string[];
  /** Whether the command is disabled */
  disabled?: boolean;
}

/**
 * Command group configuration
 */
export interface CommandGroup {
  /** Group identifier */
  id: string;
  /** Group display label */
  label: string;
  /** Commands in this group */
  items: CommandItem[];
  /** Group priority for display ordering */
  priority?: number;
}

/**
 * CommandPalette component props
 */
export interface CommandPaletteProps {
  /** Whether the palette is open */
  open: boolean;
  /** Handler for open state changes */
  onOpenChange: (open: boolean) => void;
  /** Command groups to display */
  groups: CommandGroup[];
  /** Placeholder text for search input */
  placeholder?: string;
  /** Global keyboard shortcuts to open palette */
  shortcuts?: string[];
  /** Maximum number of results to display */
  maxResults?: number;
  /** Whether to track and display recent commands */
  enableRecents?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

// ===== HELPER FUNCTIONS =====

/**
 * Fuzzy search function for command matching
 */
function fuzzyMatch(
  query: string,
  text: string,
  keywords: string[] = []
): number {
  if (!query) return 1;

  query = query.toLowerCase();
  text = text.toLowerCase();
  const searchText = [text, ...keywords.map(k => k.toLowerCase())].join(' ');

  // Exact match gets highest score
  if (searchText.includes(query)) return 1;

  // Character match scoring
  let score = 0;
  let queryIndex = 0;

  for (let i = 0; i < searchText.length && queryIndex < query.length; i++) {
    if (searchText[i] === query[queryIndex]) {
      score++;
      queryIndex++;
    }
  }

  return queryIndex === query.length ? score / query.length : 0;
}

/**
 * Filter and sort commands based on search query
 */
function filterCommands(
  groups: CommandGroup[],
  query: string,
  maxResults: number = 10
): CommandItem[] {
  const allCommands = groups.flatMap(group =>
    group.items.filter(item => !item.disabled)
  );

  if (!query) {
    return allCommands.slice(0, maxResults);
  }

  const scored = allCommands
    .map(command => ({
      command,
      score: fuzzyMatch(query, command.label, command.keywords),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored.map(({ command }) => command);
}

/**
 * Handle keyboard shortcuts
 */
function useKeyboardShortcuts(shortcuts: string[], onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Default shortcut: Cmd+K (Mac) / Ctrl+K (Windows/Linux)
      const isDefaultShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !event.shiftKey &&
        !event.altKey;

      if (isDefaultShortcut) {
        event.preventDefault();
        onOpen();
        return;
      }

      // Custom shortcuts
      for (const shortcut of shortcuts) {
        // Simple shortcut matching - could be enhanced
        if (shortcut.toLowerCase().includes(event.key.toLowerCase())) {
          const needsCtrl = shortcut.toLowerCase().includes('ctrl');
          const needsCmd =
            shortcut.toLowerCase().includes('cmd') || shortcut.includes('⌘');
          const needsShift = shortcut.toLowerCase().includes('shift');
          const needsAlt = shortcut.toLowerCase().includes('alt');

          if (
            (!needsCtrl || event.ctrlKey) &&
            (!needsCmd || event.metaKey) &&
            (!needsShift || event.shiftKey) &&
            (!needsAlt || event.altKey)
          ) {
            event.preventDefault();
            onOpen();
            return;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, onOpen]);
}

// ===== MAIN COMPONENT =====

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      groups,
      placeholder = 'Search actions, pages, or settings...',
      shortcuts = [],
      maxResults = 10,
      enableRecents = true,
      loading = false,
      emptyMessage = 'No commands found',
      className,
      ...props
    },
    ref
  ) => {
    // ===== STATE MANAGEMENT =====
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentCommands, setRecentCommands] = useState<CommandItem[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // ===== COMPUTED VALUES =====
    const filteredCommands = useMemo(() => {
      if (!query && enableRecents && recentCommands.length > 0) {
        return recentCommands.slice(0, Math.min(maxResults, 5));
      }
      return filterCommands(groups, query, maxResults);
    }, [groups, query, maxResults, enableRecents, recentCommands]);

    // ===== KEYBOARD SHORTCUTS =====
    useKeyboardShortcuts(shortcuts, () => onOpenChange(true));

    // ===== EVENT HANDLERS =====
    const handleClose = useCallback(() => {
      onOpenChange(false);
      setQuery('');
      setSelectedIndex(0);
    }, [onOpenChange]);

    const handleExecuteCommand = useCallback(
      async (command: CommandItem) => {
        // Add to recent commands
        if (enableRecents) {
          setRecentCommands(prev => [
            command,
            ...prev.filter(c => c.id !== command.id).slice(0, 4),
          ]);
        }

        // Execute command
        try {
          await command.action();
        } catch (error) {
          console.error('Command execution failed:', error);
        }

        handleClose();
      },
      [enableRecents, handleClose]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            setSelectedIndex(prev =>
              prev < filteredCommands.length - 1 ? prev + 1 : 0
            );
            break;
          }

          case 'ArrowUp': {
            event.preventDefault();
            setSelectedIndex(prev =>
              prev > 0 ? prev - 1 : filteredCommands.length - 1
            );
            break;
          }

          case 'Enter': {
            event.preventDefault();
            if (filteredCommands[selectedIndex]) {
              handleExecuteCommand(filteredCommands[selectedIndex]);
            }
            break;
          }

          case 'Escape': {
            event.preventDefault();
            handleClose();
            break;
          }
        }
      },
      [filteredCommands, selectedIndex, handleExecuteCommand, handleClose]
    );

    // ===== EFFECTS =====

    // Focus management
    useEffect(() => {
      if (open && inputRef.current) {
        inputRef.current.focus();
      }
    }, [open]);

    // Reset selection when query changes
    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
      if (listRef.current) {
        const selectedElement = listRef.current.children[
          selectedIndex
        ] as HTMLElement;
        if (selectedElement && selectedElement.scrollIntoView) {
          selectedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    }, [selectedIndex]);

    // Body scroll lock when open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [open]);

    // ===== RENDER HELPERS =====

    const renderCommandItem = (command: CommandItem, index: number) => (
      <div
        key={command.id}
        role='option'
        aria-selected={index === selectedIndex}
        className={cn(
          // Base styles from DESIGN_TOKENS
          combineTokens(
            DESIGN_TOKENS.recipe.listItem.base,
            DESIGN_TOKENS.recipe.listItem.interactive,
            DESIGN_TOKENS.accessibility.touchTarget
          ),
          // Selection state
          index === selectedIndex &&
            combineTokens(DESIGN_TOKENS.recipe.listItem.selected),
          // Layout
          'cursor-pointer px-4 py-3'
        )}
        onClick={() => handleExecuteCommand(command)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        <div className={combineTokens(DESIGN_TOKENS.layout.patterns.flexGap)}>
          {/* Command Icon */}
          {command.icon && (
            <div
              className={cn(
                combineTokens(DESIGN_TOKENS.recipe.listItemIcon.base),
                'flex-shrink-0'
              )}
            >
              {command.icon}
            </div>
          )}

          {/* Command Content */}
          <div
            className={combineTokens(DESIGN_TOKENS.recipe.listItemContent.base)}
          >
            <div
              className={combineTokens(
                DESIGN_TOKENS.recipe.listItemContent.title
              )}
            >
              {command.label}
            </div>
            {command.description && (
              <div
                className={combineTokens(
                  DESIGN_TOKENS.recipe.listItemContent.subtitle
                )}
              >
                {command.description}
              </div>
            )}
          </div>

          {/* Keyboard Shortcut */}
          {command.shortcut && (
            <div
              className={combineTokens(
                DESIGN_TOKENS.recipe.text.kbdShortcut,
                'flex-shrink-0'
              )}
            >
              {command.shortcut}
            </div>
          )}
        </div>
      </div>
    );

    // ===== MAIN RENDER =====

    if (!open) return null;

    const content = (
      <div
        ref={ref}
        className={cn(
          // Modal overlay
          combineTokens(DESIGN_TOKENS.layout.shell.modal),
          // Overlay background
          combineTokens(DESIGN_TOKENS.recipe.modal.overlay),
          // Animations
          combineTokens(DESIGN_TOKENS.motion.semantic.overlayEnter),
          // Z-index
          combineTokens(DESIGN_TOKENS.zIndex.modal),
          className
        )}
        onClick={e => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
        {...props}
      >
        {/* Command Palette Dialog */}
        <div
          role='dialog'
          aria-modal='true'
          aria-label='Command palette'
          className={cn(
            // Modal content styling
            combineTokens(DESIGN_TOKENS.recipe.modal.content),
            // Size constraints
            combineTokens(DESIGN_TOKENS.layout.widths.modal.lg),
            // Animation
            combineTokens(DESIGN_TOKENS.motion.semantic.modalEnter),
            // Max height for scrolling
            'flex max-h-[80vh] flex-col overflow-hidden'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div
            className={cn(
              combineTokens(DESIGN_TOKENS.layout.patterns.formRow),
              'border-b border-slate-200 p-4 dark:border-slate-700'
            )}
          >
            {/* Search Icon */}
            <div
              className={combineTokens(DESIGN_TOKENS.recipe.listItemIcon.base)}
            >
              <svg
                className='size-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>

            {/* Search Input Field */}
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className={cn(
                // Input base styles
                combineTokens(DESIGN_TOKENS.recipe.input.base),
                // Remove default styling
                'border-0 bg-transparent p-0 text-lg ring-0 focus:ring-0',
                // Accessibility
                combineTokens(DESIGN_TOKENS.accessibility.focusVisible)
              )}
              autoComplete='off'
              autoCorrect='off'
              spellCheck='false'
              aria-expanded='true'
              aria-haspopup='listbox'
              aria-controls='command-list'
              role='combobox'
            />

            {/* Close Shortcut Hint */}
            <div
              className={combineTokens(DESIGN_TOKENS.recipe.text.kbdShortcut)}
            >
              ESC
            </div>
          </div>

          {/* Commands List */}
          <div
            id='command-list'
            ref={listRef}
            role='listbox'
            aria-label='Commands'
            className={cn(
              'flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600',
              // Minimum height to prevent layout shift
              'max-h-[400px] min-h-[200px]'
            )}
          >
            {loading ? (
              /* Loading State */
              <div
                className={cn(
                  combineTokens(DESIGN_TOKENS.layout.patterns.centeredContent),
                  'py-12'
                )}
              >
                <div className={combineTokens(DESIGN_TOKENS.loading.spinner)}>
                  <svg
                    className='size-6 animate-spin'
                    fill='none'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                </div>
                <span className='ml-3 text-sm text-slate-600 dark:text-slate-400'>
                  Loading commands...
                </span>
              </div>
            ) : filteredCommands.length === 0 ? (
              /* Empty State */
              <div
                className={cn(
                  combineTokens(DESIGN_TOKENS.layout.patterns.centeredContent),
                  'py-12 text-center'
                )}
              >
                <div className='text-sm text-slate-500 dark:text-slate-400'>
                  {emptyMessage}
                </div>
              </div>
            ) : (
              /* Commands List */
              <div className={combineTokens(DESIGN_TOKENS.recipe.list.flush)}>
                {!query && enableRecents && recentCommands.length > 0 && (
                  <div className='border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400'>
                    Recent
                  </div>
                )}
                {filteredCommands.map(renderCommandItem)}
              </div>
            )}
          </div>

          {/* Footer Hint */}
          <div
            className={cn(
              'border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50',
              'flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'
            )}
          >
            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-1'>
                <span className={combineTokens(DESIGN_TOKENS.recipe.text.kbd)}>
                  ↑↓
                </span>
                Navigate
              </span>
              <span className='flex items-center gap-1'>
                <span className={combineTokens(DESIGN_TOKENS.recipe.text.kbd)}>
                  Enter
                </span>
                Select
              </span>
              <span className='flex items-center gap-1'>
                <span className={combineTokens(DESIGN_TOKENS.recipe.text.kbd)}>
                  ESC
                </span>
                Close
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <span className={combineTokens(DESIGN_TOKENS.recipe.text.kbd)}>
                ⌘K
              </span>
              Open
            </div>
          </div>
        </div>
      </div>
    );

    // Render in portal for z-index safety
    return createPortal(content, document.body);
  }
);

CommandPalette.displayName = 'CommandPalette';

// ===== COMPOUND COMPONENTS =====

/**
 * Hook for managing command palette state
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(prev => !prev), []);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return {
    open,
    setOpen,
    toggle,
    show,
    hide,
  };
}

/**
 * Utility function to create command items
 */
export function createCommand(
  command: Omit<CommandItem, 'id'> & { id?: string }
): CommandItem {
  return {
    id: command.id || command.label.toLowerCase().replaceAll(/\s+/g, '-'),
    ...command,
  };
}

/**
 * Utility function to create command groups
 */
export function createCommandGroup(
  group: Omit<CommandGroup, 'id'> & { id?: string }
): CommandGroup {
  return {
    id: group.id || group.label.toLowerCase().replaceAll(/\s+/g, '-'),
    priority: 0,
    ...group,
  };
}

export default CommandPalette;
