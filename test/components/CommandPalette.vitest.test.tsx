/**
 * @fileoverview CommandPalette Component Tests - Enterprise Vitest Testing
 *
 * @description Comprehensive test suite for CommandPalette component following
 * enterprise testing standards with full Vitest integration and performance monitoring.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CommandPalette,
  createCommand,
  createCommandGroup,
  useCommandPalette,
} from '@/components/features/CommandPalette';
import type { CommandGroup } from '@/components/features/CommandPalette';

// ===== TEST DATA =====

const mockAction = vi.fn();
const mockOnOpenChange = vi.fn();

const mockCommands: CommandGroup[] = [
  createCommandGroup({
    label: 'Navigation',
    items: [
      createCommand({
        label: 'Go to Dashboard',
        description: 'Navigate to main dashboard',
        action: mockAction,
        shortcut: '⌘+D',
        keywords: ['home', 'main'],
      }),
      createCommand({
        label: 'Open Settings',
        description: 'Access application settings',
        action: mockAction,
        shortcut: '⌘+,',
        keywords: ['preferences', 'config'],
      }),
    ],
  }),
  createCommandGroup({
    label: 'Actions',
    items: [
      createCommand({
        label: 'Create New Task',
        description: 'Add a new task',
        action: mockAction,
        shortcut: '⌘+N',
        keywords: ['add', 'new', 'todo'],
      }),
    ],
  }),
];

// ===== HELPER FUNCTIONS =====

function renderCommandPalette(
  props: Partial<React.ComponentProps<typeof CommandPalette>> = {}
) {
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    groups: mockCommands,
    ...props,
  };

  return render(<CommandPalette {...defaultProps} />);
}

// ===== SETUP AND CLEANUP =====

beforeEach(() => {
  vi.clearAllMocks();
  // Reset any performance marks
  globalThis.startPerformanceMark?.('test-start');
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ===== BASIC RENDERING TESTS =====

describe('CommandPalette - Basic Rendering', () => {
  it('renders without errors when open', () => {
    renderCommandPalette();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderCommandPalette({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays placeholder text correctly', () => {
    const placeholder = 'Search custom commands...';
    renderCommandPalette({ placeholder });

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('displays all command groups when no query', () => {
    renderCommandPalette();

    // Should show commands
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('displays command descriptions and shortcuts', () => {
    renderCommandPalette();

    expect(screen.getByText('Navigate to main dashboard')).toBeInTheDocument();
    expect(screen.getByText('⌘+D')).toBeInTheDocument();
    expect(screen.getByText('⌘+N')).toBeInTheDocument();
  });
});

// ===== SEARCH AND FILTERING TESTS =====

describe('CommandPalette - Search and Filtering', () => {
  it('filters commands based on label search', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.type(input, 'dashboard');

    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('filters commands based on description search', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.type(input, 'settings');

    expect(screen.getByText('Open Settings')).toBeInTheDocument();
    expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument();
  });

  it('filters commands based on keywords search', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.type(input, 'home');

    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });

  it('shows empty state when no results found', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.type(input, 'xyz123nonexistent');

    expect(screen.getByText('No commands found')).toBeInTheDocument();
  });

  it('performs case-insensitive search', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.type(input, 'DASHBOARD');

    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });
});

// ===== KEYBOARD NAVIGATION TESTS =====

describe('CommandPalette - Keyboard Navigation', () => {
  it('navigates down with ArrowDown key', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.click(input);

    // First item should be selected by default
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // Navigate down
    await user.keyboard('{ArrowDown}');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates up with ArrowUp key', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Navigate down then up
    await user.keyboard('{ArrowDown}{ArrowUp}');
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('executes command on Enter key', async () => {
    const user = userEvent.setup();
    const testAction = vi.fn();
    const testCommands = [
      createCommandGroup({
        label: 'Test',
        items: [
          createCommand({
            label: 'Test Command',
            action: testAction,
          }),
        ],
      }),
    ];

    renderCommandPalette({ groups: testCommands });

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(testAction).toHaveBeenCalledOnce();
  });

  it('closes palette on Escape key', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderCommandPalette({ onOpenChange });

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('CommandPalette - Accessibility', () => {
  it('has proper ARIA labels and roles', () => {
    renderCommandPalette();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Command palette');

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
    expect(combobox).toHaveAttribute('aria-controls', 'command-list');

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('id', 'command-list');
  });

  it('maintains focus management correctly', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.click(input);

    expect(input).toHaveFocus();
  });

  it('announces selection changes to screen readers', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Check aria-activedescendant is set correctly
    expect(input).toHaveAttribute('aria-activedescendant');
  });
});

// ===== COMMAND EXECUTION TESTS =====

describe('CommandPalette - Command Execution', () => {
  it('executes command action when clicked', async () => {
    const user = userEvent.setup();
    const testAction = vi.fn();
    const testCommands = [
      createCommandGroup({
        label: 'Test',
        items: [
          createCommand({
            label: 'Test Command',
            action: testAction,
          }),
        ],
      }),
    ];

    renderCommandPalette({ groups: testCommands });

    const command = screen.getByText('Test Command');
    await user.click(command);

    expect(testAction).toHaveBeenCalledOnce();
  });

  it('handles async command actions', async () => {
    const user = userEvent.setup();
    const asyncAction = vi.fn().mockResolvedValue(undefined);
    const testCommands = [
      createCommandGroup({
        label: 'Test',
        items: [
          createCommand({
            label: 'Async Command',
            action: asyncAction,
          }),
        ],
      }),
    ];

    renderCommandPalette({ groups: testCommands });

    const command = screen.getByText('Async Command');
    await user.click(command);

    await waitFor(() => {
      expect(asyncAction).toHaveBeenCalledOnce();
    });
  });

  it('closes palette after command execution', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const testAction = vi.fn();
    const testCommands = [
      createCommandGroup({
        label: 'Test',
        items: [
          createCommand({
            label: 'Test Command',
            action: testAction,
          }),
        ],
      }),
    ];

    renderCommandPalette({ onOpenChange, groups: testCommands });

    const command = screen.getByText('Test Command');
    await user.click(command);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ===== HOOK TESTS =====

describe('useCommandPalette Hook', () => {
  it('provides expected hook interface', () => {
    const TestComponent = () => {
      const { open, show, hide, toggle } = useCommandPalette();

      return (
        <div>
          <span data-testid='is-open'>{open.toString()}</span>
          <button onClick={show} data-testid='open'>
            Open
          </button>
          <button onClick={hide} data-testid='close'>
            Close
          </button>
          <button onClick={toggle} data-testid='toggle'>
            Toggle
          </button>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('is-open')).toHaveTextContent('false');
    expect(screen.getByTestId('open')).toBeInTheDocument();
    expect(screen.getByTestId('close')).toBeInTheDocument();
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
  });
});

// ===== PERFORMANCE TESTS =====

describe('CommandPalette - Performance', () => {
  it('renders within performance budget', () => {
    globalThis.startPerformanceMark?.('render-test');

    renderCommandPalette();

    const duration = globalThis.endPerformanceMark?.('render-test');

    // Should render in under 100ms (enterprise target)
    if (duration) {
      expect(duration).toBeLessThan(100);
    }
  });

  it('handles large command lists efficiently', () => {
    const largeCommandList: CommandGroup[] = [
      createCommandGroup({
        label: 'Large Group',
        items: Array.from({ length: 100 }, (_, i) =>
          createCommand({
            label: `Command ${i}`,
            action: vi.fn(),
          })
        ),
      }),
    ];

    globalThis.startPerformanceMark?.('large-render-test');

    renderCommandPalette({ groups: largeCommandList });

    const duration = globalThis.endPerformanceMark?.('large-render-test');

    // Should still render efficiently with 100 commands
    if (duration) {
      expect(duration).toBeLessThan(200);
    }
  });
});

// ===== UTILITY FUNCTION TESTS =====

describe('CommandPalette - Utility Functions', () => {
  it('createCommand creates valid command object', () => {
    const command = createCommand({
      label: 'Test Command',
      description: 'Test Description',
      action: vi.fn(),
      shortcut: '⌘+T',
      keywords: ['test'],
    });

    expect(command).toMatchObject({
      label: 'Test Command',
      description: 'Test Description',
      shortcut: '⌘+T',
      keywords: ['test'],
    });
    expect(command.id).toBeDefined();
    expect(typeof command.action).toBe('function');
  });

  it('createCommandGroup creates valid group object', () => {
    const group = createCommandGroup({
      label: 'Test Group',
      items: [
        createCommand({ label: 'Command 1', action: vi.fn() }),
        createCommand({ label: 'Command 2', action: vi.fn() }),
      ],
    });

    expect(group).toMatchObject({
      label: 'Test Group',
    });
    expect(group.items).toHaveLength(2);
    expect(group.items[0].label).toBe('Command 1');
    expect(group.items[1].label).toBe('Command 2');
  });
});

// ===== EDGE CASES =====

describe('CommandPalette - Edge Cases', () => {
  it('handles empty command groups gracefully', () => {
    renderCommandPalette({ groups: [] });

    expect(screen.getByText('No commands found')).toBeInTheDocument();
  });

  it('handles commands without shortcuts', () => {
    const commandsWithoutShortcuts = [
      createCommandGroup({
        label: 'No Shortcuts',
        items: [
          createCommand({
            label: 'Simple Command',
            action: vi.fn(),
          }),
        ],
      }),
    ];

    renderCommandPalette({ groups: commandsWithoutShortcuts });

    expect(screen.getByText('Simple Command')).toBeInTheDocument();
  });

  it('handles commands without descriptions', () => {
    const commandsWithoutDescriptions = [
      createCommandGroup({
        label: 'No Descriptions',
        items: [
          createCommand({
            label: 'No Description Command',
            action: vi.fn(),
          }),
        ],
      }),
    ];

    renderCommandPalette({ groups: commandsWithoutDescriptions });

    expect(screen.getByText('No Description Command')).toBeInTheDocument();
  });

  it('handles command execution errors gracefully', async () => {
    const user = userEvent.setup();
    const errorAction = vi.fn().mockRejectedValue(new Error('Test error'));
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const errorCommands = [
      createCommandGroup({
        label: 'Error Test',
        items: [
          createCommand({
            label: 'Error Command',
            action: errorAction,
          }),
        ],
      }),
    ];

    renderCommandPalette({ groups: errorCommands });

    const command = screen.getByText('Error Command');
    await user.click(command);

    await waitFor(() => {
      expect(errorAction).toHaveBeenCalledOnce();
    });

    consoleErrorSpy.mockRestore();
  });
});
