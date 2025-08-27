/**
 * CommandRegistry - Global Command Management System
 *
 * Centralized command registration and management system with automatic
 * keyboard shortcut handling and context awareness.
 *
 * MAPS v3.0 Integration:
 * - React Context for global command state
 * - Automatic command discovery
 * - Context-aware command filtering
 * - Command history and favorites
 */

import type { Command, CommandGroup } from './CommandPalette';

import React from 'react';

import { cn } from '@/utils/cn';

// ===== CONTEXT INTERFACES =====

export interface CommandContext {
  route?: string;
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
  selection?: {
    type: string;
    count: number;
    items: unknown[];
  };
  application?: {
    mode: string;
    sidebar?: boolean;
    theme?: string;
  };
}

export interface CommandFilter {
  category?: string;
  tags?: string[];
  enabled?: boolean;
  context?: Partial<CommandContext>;
}

export interface CommandRegistryConfig {
  globalShortcuts?: boolean;
  preventDefaults?: string[];
  enableInInputs?: boolean;
  caseSensitive?: boolean;
  persistHistory?: boolean;
  storageKey?: string;
  maxHistorySize?: number;
}

export interface UseCommandRegistryReturn {
  // Registration
  registerCommand: (command: Command) => () => void;
  registerCommands: (commands: Command[]) => () => void;
  registerGroup: (group: CommandGroup) => () => void;

  // State
  commands: Command[];
  groups: CommandGroup[];
  history: Command[];
  context: CommandContext;

  // Search & Filter
  searchCommands: (query: string) => Command[];
  filterCommands: (filter: CommandFilter) => Command[];

  // Execution
  executeCommand: (commandId: string) => Promise<void>;
  canExecuteCommand: (commandId: string) => boolean;

  // Shortcuts
  registerShortcut: (keys: string[], action: () => void) => () => void;
  getShortcuts: () => Array<{ keys: string[]; description: string }>;
}

// ===== CONTEXT SETUP =====

interface CommandRegistryState {
  commands: Map<string, Command>;
  groups: Map<string, CommandGroup>;
  shortcuts: Map<string, { action: () => void; description: string }>;
  history: Command[];
  context: CommandContext;
  config: CommandRegistryConfig;
}

const CommandRegistryContext =
  React.createContext<UseCommandRegistryReturn | null>(null);

// ===== PROVIDER COMPONENT =====

export interface CommandRegistryProps {
  children: React.ReactNode;
  config?: CommandRegistryConfig;
  contextProvider?: () => CommandContext;
  className?: string;
}

const defaultConfig: CommandRegistryConfig = {
  globalShortcuts: true,
  preventDefaults: ['cmd+k', 'ctrl+k'],
  enableInInputs: false,
  caseSensitive: false,
  persistHistory: true,
  storageKey: 'command-registry-history',
  maxHistorySize: 50,
};

export function CommandRegistry({
  children,
  config = {},
  contextProvider,
  className,
}: CommandRegistryProps) {
  const finalConfig = { ...defaultConfig, ...config };

  // ===== STATE MANAGEMENT =====

  const [state, setState] = React.useState<CommandRegistryState>(() => ({
    commands: new Map(),
    groups: new Map(),
    shortcuts: new Map(),
    history: [],
    context: {},
    config: finalConfig,
  }));

  // ===== CONTEXT UPDATES =====

  React.useEffect(() => {
    if (contextProvider) {
      const newContext = contextProvider();
      setState(prev => ({ ...prev, context: newContext }));
    }
  }, [contextProvider]);

  // ===== HISTORY PERSISTENCE =====

  React.useEffect(() => {
    if (!finalConfig.persistHistory) return;

    try {
      const stored = localStorage.getItem(finalConfig.storageKey!);
      if (stored) {
        const history = JSON.parse(stored) as Command[];
        setState(prev => ({ ...prev, history }));
      }
    } catch (error) {
      console.warn('Failed to load command history:', error);
    }
  }, [finalConfig.persistHistory, finalConfig.storageKey]);

  const saveHistory = React.useCallback(
    (history: Command[]) => {
      if (!finalConfig.persistHistory) return;

      try {
        localStorage.setItem(finalConfig.storageKey!, JSON.stringify(history));
      } catch (error) {
        console.warn('Failed to save command history:', error);
      }
    },
    [finalConfig.persistHistory, finalConfig.storageKey]
  );

  // ===== COMMAND REGISTRATION =====

  const registerCommand = React.useCallback((command: Command) => {
    setState(prev => {
      const newCommands = new Map(prev.commands);
      newCommands.set(command.id, command);
      return { ...prev, commands: newCommands };
    });

    // Return cleanup function
    return () => {
      setState(prev => {
        const newCommands = new Map(prev.commands);
        newCommands.delete(command.id);
        return { ...prev, commands: newCommands };
      });
    };
  }, []);

  const registerCommands = React.useCallback(
    (commands: Command[]) => {
      const cleanupFunctions = commands.map(registerCommand);

      return () => {
        for (const cleanup of cleanupFunctions) {
          cleanup();
        }
      };
    },
    [registerCommand]
  );

  const registerGroup = React.useCallback(
    (group: CommandGroup) => {
      setState(prev => {
        const newGroups = new Map(prev.groups);
        newGroups.set(group.id, group);
        return { ...prev, groups: newGroups };
      });

      // Also register all commands in the group
      const commandCleanup = registerCommands(group.commands);

      // Return cleanup function
      return () => {
        setState(prev => {
          const newGroups = new Map(prev.groups);
          newGroups.delete(group.id);
          return { ...prev, groups: newGroups };
        });
        commandCleanup();
      };
    },
    [registerCommands]
  );

  // ===== SHORTCUTS REGISTRATION =====

  const registerShortcut = React.useCallback(
    (keys: string[], action: () => void) => {
      const keyString = keys.join('+');

      setState(prev => {
        const newShortcuts = new Map(prev.shortcuts);
        newShortcuts.set(keyString, { action, description: keyString });
        return { ...prev, shortcuts: newShortcuts };
      });

      // Return cleanup function
      return () => {
        setState(prev => {
          const newShortcuts = new Map(prev.shortcuts);
          newShortcuts.delete(keyString);
          return { ...prev, shortcuts: newShortcuts };
        });
      };
    },
    []
  );

  // ===== SEARCH & FILTERING =====

  const searchCommands = React.useCallback(
    (query: string): Command[] => {
      const commands = [...state.commands.values()];

      if (!query.trim()) return commands;

      const lowerQuery = finalConfig.caseSensitive
        ? query
        : query.toLowerCase();

      return commands.filter(command => {
        const searchableText = [
          command.label,
          command.description,
          command.category,
          ...(command.keywords || []),
          ...(command.tags || []),
        ]
          .filter(Boolean)
          .join(' ');

        const textToSearch = finalConfig.caseSensitive
          ? searchableText
          : searchableText.toLowerCase();
        return textToSearch.includes(lowerQuery);
      });
    },
    [state.commands, finalConfig.caseSensitive]
  );

  const filterCommands = React.useCallback(
    (filter: CommandFilter): Command[] => {
      const commands = [...state.commands.values()];

      return commands.filter(command => {
        // Category filter
        if (filter.category && command.category !== filter.category) {
          return false;
        }

        // Tags filter
        if (filter.tags && filter.tags.length > 0) {
          const commandTags = command.tags || [];
          const hasMatchingTag = filter.tags.some(tag =>
            commandTags.includes(tag)
          );
          if (!hasMatchingTag) return false;
        }

        // Enabled filter
        if (
          filter.enabled !== undefined &&
          !!command.disabled === filter.enabled
        ) {
          return false;
        }

        // Context filter (basic implementation)
        if (filter.context) {
          // Add context-based filtering logic here based on your needs
          // For now, just return true to allow all commands
        }

        return true;
      });
    },
    [state.commands]
  );

  // ===== COMMAND EXECUTION =====

  const executeCommand = React.useCallback(
    async (commandId: string): Promise<void> => {
      const command = state.commands.get(commandId);
      if (!command || command.disabled) {
        throw new Error(`Command ${commandId} not found or disabled`);
      }

      // Add to history
      const newHistory = [
        command,
        ...state.history.filter(h => h.id !== commandId),
      ].slice(0, finalConfig.maxHistorySize);

      setState(prev => ({ ...prev, history: newHistory }));
      saveHistory(newHistory);

      // Execute command
      try {
        const result = command.action();
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        console.error(`Command execution failed for ${commandId}:`, error);
        throw error;
      }
    },
    [state.commands, state.history, finalConfig.maxHistorySize, saveHistory]
  );

  const canExecuteCommand = React.useCallback(
    (commandId: string): boolean => {
      const command = state.commands.get(commandId);
      return !!(command && !command.disabled);
    },
    [state.commands]
  );

  // ===== SHORTCUTS HANDLING =====

  const getShortcuts = React.useCallback(() => {
    return [...state.shortcuts.entries()].map(([keys, { description }]) => ({
      keys: keys.split('+'),
      description,
    }));
  }, [state.shortcuts]);

  // Global keyboard handler
  React.useEffect(() => {
    if (!finalConfig.globalShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input elements and not enabled
      if (!finalConfig.enableInInputs) {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.contentEditable === 'true'
        ) {
          return;
        }
      }

      // Build key combination
      const keys: string[] = [];
      if (e.ctrlKey) keys.push('ctrl');
      if (e.metaKey) keys.push('cmd');
      if (e.altKey) keys.push('alt');
      if (e.shiftKey) keys.push('shift');
      keys.push(e.key.toLowerCase());

      const keyString = keys.join('+');
      const shortcut = state.shortcuts.get(keyString);

      if (shortcut) {
        // Check if we should prevent default
        if (finalConfig.preventDefaults?.includes(keyString)) {
          e.preventDefault();
        }

        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    state.shortcuts,
    finalConfig.globalShortcuts,
    finalConfig.enableInInputs,
    finalConfig.preventDefaults,
  ]);

  // ===== CONTEXT VALUE =====

  const contextValue: UseCommandRegistryReturn = React.useMemo(
    () => ({
      // Registration
      registerCommand,
      registerCommands,
      registerGroup,

      // State
      commands: [...state.commands.values()],
      groups: [...state.groups.values()],
      history: state.history,
      context: state.context,

      // Search & Filter
      searchCommands,
      filterCommands,

      // Execution
      executeCommand,
      canExecuteCommand,

      // Shortcuts
      registerShortcut,
      getShortcuts,
    }),
    [
      registerCommand,
      registerCommands,
      registerGroup,
      state.commands,
      state.groups,
      state.history,
      state.context,
      searchCommands,
      filterCommands,
      executeCommand,
      canExecuteCommand,
      registerShortcut,
      getShortcuts,
    ]
  );

  return (
    <CommandRegistryContext.Provider value={contextValue}>
      <div className={cn('command-registry', className)}>{children}</div>
    </CommandRegistryContext.Provider>
  );
}

// ===== HOOK =====

export function useCommandRegistry(): UseCommandRegistryReturn {
  const context = React.useContext(CommandRegistryContext);
  if (!context) {
    throw new Error('useCommandRegistry must be used within a CommandRegistry');
  }
  return context;
}

// ===== AUTOMATIC COMMANDS =====

export const AutomaticCommands = {
  navigation: {
    'go-home': { label: 'Go to Home', shortcut: ['g', 'h'] },
    'go-dashboard': { label: 'Go to Dashboard', shortcut: ['g', 'd'] },
    'go-settings': { label: 'Go to Settings', shortcut: ['g', 's'] },
  },
  theme: {
    'toggle-theme': { label: 'Toggle Theme', shortcut: ['t'] },
    'theme-light': { label: 'Light Theme', shortcut: ['t', 'l'] },
    'theme-dark': { label: 'Dark Theme', shortcut: ['t', 'd'] },
  },
  common: {
    search: { label: 'Search', shortcut: ['/', 'cmd+f'] },
    help: { label: 'Show Help', shortcut: ['?', 'h'] },
    refresh: { label: 'Refresh', shortcut: ['r', 'f5'] },
  },
} as const;

export default CommandRegistry;
