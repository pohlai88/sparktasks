/**
 * CommandPalette - Universal Command System
 *
 * Apple-style command palette providing universal application navigation,
 * search, and keyboard shortcuts with CMDK integration.
 *
 * MAPS v3.0 Integration:
 * - ENHANCED_DESIGN_TOKENS for all styling
 * - ZIndexOrchestrator for modal layering
 * - Motion presets for animations
 * - TokenGuard compliance
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Hash } from 'lucide-react';
import React from 'react';

import { getAdaptiveMotionClasses, prefersReducedMotion } from '@/components/primitives/motion-utils';
import { useZIndex } from '@/components/primitives/use-z-index';
import { cn } from '@/utils/cn';

// ===== COMMAND INTERFACES =====

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  action: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  badge?: string | number;
  category?: string;
  tags?: string[];
  priority?: number;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  color?: string;
}

export interface CommandGroup {
  id: string;
  heading?: string;
  icon?: React.ReactNode;
  commands: Command[];
  priority?: number;
  condition?: () => boolean;
}

// ===== COMPONENT VARIANTS =====

const commandPaletteVariants = cva([
  // Base modal styling with MAPS tokens
  'fixed left-1/2 top-[20%] -translate-x-1/2',
  'w-full max-w-2xl',
  'rounded-xl border overflow-hidden',
  'shadow-2xl',
], {
  variants: {
    surface: {
      elevated: [
        'bg-surface-elevated border-border-elevated',
      ],
      glass: [
        'backdrop-blur-lg bg-surface-panel/90 border-border-glass',
      ],
    },
    size: {
      sm: 'max-w-lg',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
    },
  },
  defaultVariants: {
    surface: 'glass',
    size: 'md',
  }
});

const commandOverlayVariants = cva([
  'fixed inset-0',
  'bg-background-overlay/60 backdrop-blur-sm',
], {
  variants: {
    motionPreset: {
      standard: '',
      entrance: '',
      spring: '',
    }
  },
  defaultVariants: {
    motionPreset: 'entrance',
  }
});

const commandItemVariants = cva([
  'relative flex items-center gap-3 px-4 py-3',
  'cursor-pointer rounded-lg transition-colors',
  'focus:outline-none',
], {
  variants: {
    variant: {
      default: [
        'text-foreground hover:bg-surface-hover',
        'data-[selected="true"]:bg-accent-bg data-[selected="true"]:text-accent-fg',
      ],
      destructive: [
        'text-error-foreground hover:bg-error/10',
        'data-[selected="true"]:bg-error data-[selected="true"]:text-error-foreground',
      ],
      success: [
        'text-success-foreground hover:bg-success/10',
        'data-[selected="true"]:bg-success data-[selected="true"]:text-success-foreground',
      ],
      warning: [
        'text-warning-foreground hover:bg-warning/10',
        'data-[selected="true"]:bg-warning data-[selected="true"]:text-warning-foreground',
      ],
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
  }
});

// ===== MAIN COMPONENT =====

export interface CommandPaletteProps extends VariantProps<typeof commandPaletteVariants> {
  // Visibility Control
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Trigger Configuration
  trigger?: {
    shortcut?: string[];
    showTrigger?: boolean;
    triggerText?: string;
  };

  // Search & Navigation
  placeholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyText?: string;

  // Command Groups
  commands?: CommandGroup[];
  dynamicCommands?: (search: string) => Promise<CommandGroup[]>;

  // Behavior
  closeOnSelect?: boolean;
  loop?: boolean;
  filter?: (value: string, search: string) => number;

  // Appearance
  _position?: 'center' | 'top'; // Prefixed with _ to indicate unused but part of API
  motionPreset?: 'entrance' | 'spring' | 'standard';

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;

  // Advanced Features
  recentCommands?: boolean;
  maxRecentCommands?: number;
  commandHistory?: boolean;

  // Callbacks
  onCommandSelect?: (command: Command) => void;
  onCommandExecute?: (command: Command) => void;

  className?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  trigger,
  placeholder = "Search commands...",
  searchValue: controlledSearchValue,
  onSearchChange,
  emptyText = "No commands found.",
  commands = [],
  dynamicCommands,
  closeOnSelect = true,
  loop = true,
  filter,
  surface = 'glass',
  size = 'md',
  _position = 'center',
  motionPreset = 'entrance',
  ariaLabel = "Command palette",
  ariaDescription = "Search and execute commands",
  recentCommands = true,
  maxRecentCommands = 5,
  commandHistory = true,
  onCommandSelect,
  onCommandExecute,
  className,
  ...props
}: CommandPaletteProps) {
  // ===== STATE MANAGEMENT =====

  const [searchValue, setSearchValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [dynamicGroups, setDynamicGroups] = React.useState<CommandGroup[]>([]);
  const [recentCommandIds, setRecentCommandIds] = React.useState<string[]>([]);

  // Controlled search value support
  const currentSearchValue = controlledSearchValue ?? searchValue;
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  }, [onSearchChange]);

  // ===== MAPS v3.0 INTEGRATIONS =====

  // Z-Index orchestration for modal layering
  const { zIndexClass } = useZIndex('command-palette', 'modal');

  // Motion presets for animations
  const motionClasses = getAdaptiveMotionClasses('all');
  const isReducedMotion = prefersReducedMotion();

  // ===== DYNAMIC COMMANDS =====

  React.useEffect(() => {
    if (!dynamicCommands || !currentSearchValue) {
      setDynamicGroups([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    dynamicCommands(currentSearchValue)
      .then((groups) => {
        if (!cancelled) {
          setDynamicGroups(groups);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDynamicGroups([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentSearchValue, dynamicCommands]);

  // ===== COMMAND EXECUTION =====

  const handleCommandSelect = React.useCallback((commandId: string) => {
    const allCommands = [
      ...commands.flatMap(group => group.commands),
      ...dynamicGroups.flatMap(group => group.commands),
    ];

    const command = allCommands.find(cmd => cmd.id === commandId);
    if (!command || command.disabled) return;

    // Track recent commands
    if (recentCommands && commandHistory) {
      setRecentCommandIds(prev => {
        const filtered = prev.filter(id => id !== commandId);
        return [commandId, ...filtered].slice(0, maxRecentCommands);
      });
    }

    // Execute callbacks
    onCommandSelect?.(command);

    try {
      const result = command.action();
      if (result instanceof Promise) {
        void result.then(() => onCommandExecute?.(command));
      } else {
        onCommandExecute?.(command);
      }
    } catch (error) {
      console.error('Command execution failed:', error);
    }

    // Close palette if configured
    if (closeOnSelect) {
      onOpenChange(false);
    }
  }, [commands, dynamicGroups, recentCommands, commandHistory, maxRecentCommands, onCommandSelect, onCommandExecute, closeOnSelect, onOpenChange]);

  // ===== RECENT COMMANDS PROCESSING =====

  const recentCommandsGroup = React.useMemo(() => {
    if (!recentCommands || recentCommandIds.length === 0) return null;

    const allCommands = [
      ...commands.flatMap(group => group.commands),
      ...dynamicGroups.flatMap(group => group.commands),
    ];

    const recentCmds = recentCommandIds
      .map(id => allCommands.find(cmd => cmd.id === id))
      .filter((cmd): cmd is Command => cmd !== undefined);

    if (recentCmds.length === 0) return null;

    return {
      id: 'recent',
      heading: 'Recent',
      icon: <Hash className="w-4 h-4" />,
      commands: recentCmds,
      priority: -1, // Show first
    };
  }, [recentCommands, recentCommandIds, commands, dynamicGroups]);

  // ===== FINAL COMMAND GROUPS =====

  const allGroups = React.useMemo(() => {
    const groups = [...commands, ...dynamicGroups];
    if (recentCommandsGroup) {
      groups.unshift(recentCommandsGroup);
    }
    return groups
      .filter(group => group.condition ? group.condition() : true)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [commands, dynamicGroups, recentCommandsGroup]);

  // ===== KEYBOARD SHORTCUTS =====

  React.useEffect(() => {
    if (!trigger?.shortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = trigger.shortcut;
      if (!shortcut || shortcut.length === 0) return;

      const firstShortcut = shortcut[0];
      if (!firstShortcut) return;

      const keys = firstShortcut.toLowerCase().split('+');
      const isMetaKey = keys.includes('cmd') || keys.includes('meta');
      const isCtrlKey = keys.includes('ctrl');
      const isKey = keys.includes(e.key.toLowerCase());

      const modifierMatch = (isMetaKey && e.metaKey) || (isCtrlKey && e.ctrlKey);

      if (isKey && (modifierMatch || (!isMetaKey && !isCtrlKey))) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trigger, open, onOpenChange]);

  // ===== RENDER =====

  const motionVariants = {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: isReducedMotion ? 0.01 : 0.15 }
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: -20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -20 },
      transition: {
        duration: isReducedMotion ? 0.01 : 0.2,
        ease: [0.2, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className={cn(
              commandOverlayVariants({ motionPreset }),
              zIndexClass
            )}
            onClick={() => onOpenChange(false)}
            {...motionVariants.overlay}
          />

          {/* Command Palette */}
          <motion.div
            className={cn(
              commandPaletteVariants({ surface, size }),
              zIndexClass,
              motionClasses,
              className
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={ariaLabel}
            aria-describedby={ariaDescription}
            {...motionVariants.content}
            {...props}
          >
            <Command
              className="w-full"
              shouldFilter={!filter && !dynamicCommands}
              {...(filter && { filter })}
              loop={loop}
            >
              {/* Search Input */}
              <div className="flex items-center border-b border-border-subtle px-4">
                <Search className="w-4 h-4 text-foreground-muted mr-3" />
                <Command.Input
                  value={currentSearchValue}
                  onValueChange={handleSearchChange}
                  placeholder={placeholder}
                  className="flex-1 py-4 bg-transparent border-none outline-none text-foreground placeholder:text-foreground-muted"
                />
                {loading && (
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin ml-3" />
                )}
              </div>

              {/* Command List */}
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-8 px-4 text-center text-foreground-muted">
                  {emptyText}
                </Command.Empty>

                {allGroups.map((group) => (
                  <Command.Group key={group.id} heading={group.heading}>
                    {group.heading && (
                      <div className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-foreground-muted uppercase tracking-wide">
                        {group.icon}
                        {group.heading}
                      </div>
                    )}
                    {group.commands.map((command) => (
                      <Command.Item
                        key={command.id}
                        value={command.id}
                        onSelect={handleCommandSelect}
                        className={cn(
                          commandItemVariants({
                            variant: command.variant,
                            disabled: command.disabled ?? false
                          })
                        )}
                        disabled={command.disabled ?? false}
                        data-disabled={command.disabled ?? false}
                      >
                        {/* Command Icon */}
                        {command.icon && (
                          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {command.icon}
                          </div>
                        )}

                        {/* Command Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {command.label}
                            </span>
                            {command.badge && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accent-bg text-accent-fg">
                                {command.badge}
                              </span>
                            )}
                          </div>
                          {command.description && (
                            <div className="text-sm text-foreground-muted truncate">
                              {command.description}
                            </div>
                          )}
                        </div>

                        {/* Keyboard Shortcut */}
                        {command.shortcut && command.shortcut.length > 0 && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {command.shortcut.map((key, index) => (
                              <kbd
                                key={index}
                                className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded text-xs font-mono bg-surface-elevated border border-border-subtle text-foreground-muted"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}

                        {/* Arrow Indicator */}
                        <ArrowRight className="w-4 h-4 text-foreground-muted opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ===== DEFAULT COMMAND CATEGORIES =====

export const DefaultCommandCategories = {
  navigation: {
    heading: 'Navigate',
    icon: <Hash className="w-4 h-4" />,
    shortcuts: ['g', 'n']
  },
  actions: {
    heading: 'Actions',
    icon: <Hash className="w-4 h-4" />,
    shortcuts: ['a']
  },
  search: {
    heading: 'Search',
    icon: <Search className="w-4 h-4" />,
    shortcuts: ['s']
  },
  settings: {
    heading: 'Settings',
    icon: <Hash className="w-4 h-4" />,
    shortcuts: ['p']
  },
  help: {
    heading: 'Help & Support',
    icon: <Hash className="w-4 h-4" />,
    shortcuts: ['h', '?']
  }
} as const;

export type { VariantProps } from 'class-variance-authority';
