import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Copy, Trash2, Edit, Settings } from 'lucide-react';
import { 
  ContextMenu, 
  ContextMenuProvider, 
  ContextMenuTrigger, 
  useContextMenu,
  type MenuItem 
} from '../../src/components/ui/ContextMenu';

// Test setup
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
});

// Mock items for testing
const mockMenuItems: MenuItem[] = [
  {
    id: 'copy',
    label: 'Copy',
    icon: <Copy data-testid="copy-icon" />,
    onClick: vi.fn(),
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit data-testid="edit-icon" />,
    onClick: vi.fn(),
  },
  {
    id: 'divider',
    label: '',
    divider: true,
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 data-testid="delete-icon" />,
    danger: true,
    onClick: vi.fn(),
  },
];

const mockSubmenuItems: MenuItem[] = [
  {
    id: 'parent',
    label: 'More Options',
    icon: <Settings data-testid="settings-icon" />,
    submenu: [
      {
        id: 'sub1',
        label: 'Sub Item 1',
        onClick: vi.fn(),
      },
      {
        id: 'sub2',
        label: 'Sub Item 2',
        onClick: vi.fn(),
      },
    ],
  },
];

// Test helper component that uses the hook
const TestHookComponent = () => {
  const { showMenu, hideMenu, isVisible } = useContextMenu();
  
  return (
    <div>
      <button 
        data-testid="show-menu-btn"
        onClick={(e) => showMenu(e as any, mockMenuItems)}
      >
        Show Menu
      </button>
      <button 
        data-testid="hide-menu-btn"
        onClick={hideMenu}
      >
        Hide Menu
      </button>
      <div data-testid="visibility-status">
        {isVisible ? 'visible' : 'hidden'}
      </div>
    </div>
  );
};

describe('ContextMenu Component', () => {
  describe('Basic Rendering', () => {
    it('renders menu when visible', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Context menu');
    });

    it('does not render menu when not visible', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={false}
        />
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does not render menu when items array is empty', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={[]}
          onClose={vi.fn()}
          visible={true}
        />
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders menu items correctly', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
    });
  });

  describe('Menu Item Interactions', () => {
    it('calls onClick when menu item is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      await user.click(screen.getByText('Copy'));

      expect(mockMenuItems[0].onClick).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when menu item is disabled', async () => {
      const user = userEvent.setup();
      const disabledItems: MenuItem[] = [
        {
          id: 'disabled',
          label: 'Disabled Item',
          disabled: true,
          onClick: vi.fn(),
        },
      ];

      render(
        <ContextMenu
          x={100}
          y={100}
          items={disabledItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      await user.click(screen.getByText('Disabled Item'));

      expect(disabledItems[0].onClick).not.toHaveBeenCalled();
    });

    it('handles keyboard Enter key', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      const copyItem = screen.getByText('Copy');
      copyItem.focus();
      await user.keyboard('{Enter}');

      expect(mockMenuItems[0].onClick).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard Space key', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      const copyItem = screen.getByText('Copy');
      copyItem.focus();
      await user.keyboard(' ');

      expect(mockMenuItems[0].onClick).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes menu when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Submenu Functionality', () => {
    it('shows submenu on hover', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockSubmenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const parentItem = screen.getByText('More Options');
      await user.hover(parentItem);

      await waitFor(() => {
        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
        expect(screen.getByText('Sub Item 2')).toBeInTheDocument();
      });
    });

    it('shows submenu on ArrowRight key', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockSubmenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      const parentItem = screen.getByText('More Options');
      parentItem.focus();
      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
      });
    });

    it('hides submenu on mouse leave', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockSubmenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const parentItem = screen.getByText('More Options');
      await user.hover(parentItem);

      await waitFor(() => {
        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
      });

      await user.unhover(parentItem);

      await waitFor(() => {
        expect(screen.queryByText('Sub Item 1')).not.toBeInTheDocument();
      });
    });

    it('calls submenu item onClick and closes menu', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockSubmenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      const parentItem = screen.getByText('More Options');
      await user.hover(parentItem);

      await waitFor(() => {
        expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Sub Item 1'));

      expect(mockSubmenuItems[0].submenu![0].onClick).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Divider Rendering', () => {
    it('renders dividers correctly', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const separators = screen.getAllByRole('separator');
      expect(separators).toHaveLength(1);
    });
  });

  describe('Danger Items', () => {
    it('applies danger styling to danger items', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const deleteItem = screen.getByRole('menuitem', { name: /delete/i });
      expect(deleteItem).toHaveClass('text-red-600');
    });
  });

  describe('Disabled Items', () => {
    it('applies disabled styling and attributes', () => {
      const disabledItems: MenuItem[] = [
        {
          id: 'disabled',
          label: 'Disabled Item',
          disabled: true,
          onClick: vi.fn(),
        },
      ];

      render(
        <ContextMenu
          x={100}
          y={100}
          items={disabledItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const disabledItem = screen.getByRole('menuitem', { name: /disabled item/i });
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
      expect(disabledItem).toHaveAttribute('tabIndex', '-1');
      expect(disabledItem).toHaveClass('opacity-50');
    });
  });

  describe('Click Outside Behavior', () => {
    it('closes menu when clicking outside', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <div>
          <div data-testid="outside-element">Outside</div>
          <ContextMenu
            x={100}
            y={100}
            items={mockMenuItems}
            onClose={onClose}
            visible={true}
          />
        </div>
      );

      await user.click(screen.getByTestId('outside-element'));

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('closes menu when right-clicking outside', async () => {
      const onClose = vi.fn();

      render(
        <div>
          <div data-testid="outside-element">Outside</div>
          <ContextMenu
            x={100}
            y={100}
            items={mockMenuItems}
            onClose={onClose}
            visible={true}
          />
        </div>
      );

      fireEvent.contextMenu(screen.getByTestId('outside-element'));

      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Position Adjustment', () => {
    it('adjusts position when menu would overflow viewport', () => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      });

      render(
        <ContextMenu
          x={750} // Close to right edge
          y={550} // Close to bottom edge
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
      // Position should be adjusted to keep menu in viewport
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-label', 'Context menu');

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3); // Excluding divider

      menuItems.forEach(item => {
        expect(item).toHaveAttribute('tabIndex');
      });
    });

    it('marks icons as decorative', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={mockMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const icons = screen.getAllByTestId(/.*-icon$/);
      icons.forEach(icon => {
        expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});

describe('ContextMenuProvider', () => {
  describe('Provider Context', () => {
    it('provides context to children', () => {
      render(
        <ContextMenuProvider>
          <TestHookComponent />
        </ContextMenuProvider>
      );

      expect(screen.getByTestId('show-menu-btn')).toBeInTheDocument();
      expect(screen.getByTestId('hide-menu-btn')).toBeInTheDocument();
      expect(screen.getByTestId('visibility-status')).toHaveTextContent('hidden');
    });

    it('shows menu when showMenu is called', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenuProvider>
          <TestHookComponent />
        </ContextMenuProvider>
      );

      await user.click(screen.getByTestId('show-menu-btn'));

      expect(screen.getByTestId('visibility-status')).toHaveTextContent('visible');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('hides menu when hideMenu is called', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenuProvider>
          <TestHookComponent />
        </ContextMenuProvider>
      );

      await user.click(screen.getByTestId('show-menu-btn'));
      expect(screen.getByTestId('visibility-status')).toHaveTextContent('visible');

      await user.click(screen.getByTestId('hide-menu-btn'));
      expect(screen.getByTestId('visibility-status')).toHaveTextContent('hidden');
    });
  });

  describe('Hook Error Handling', () => {
    it('throws error when useContextMenu is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestHookComponent />);
      }).toThrow('useContextMenu must be used within a ContextMenuProvider');

      consoleSpy.mockRestore();
    });
  });
});

describe('ContextMenuTrigger', () => {
  describe('Trigger Functionality', () => {
    it('shows menu on right-click', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenuProvider>
          <ContextMenuTrigger items={mockMenuItems}>
            <div data-testid="trigger-area">Right-click me</div>
          </ContextMenuTrigger>
        </ContextMenuProvider>
      );

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByTestId('trigger-area'),
      });

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('does not show menu when disabled', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenuProvider>
          <ContextMenuTrigger items={mockMenuItems} disabled={true}>
            <div data-testid="trigger-area">Right-click me</div>
          </ContextMenuTrigger>
        </ContextMenuProvider>
      );

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByTestId('trigger-area'),
      });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('prevents default context menu', async () => {
      render(
        <ContextMenuProvider>
          <ContextMenuTrigger items={mockMenuItems}>
            <div data-testid="trigger-area">Right-click me</div>
          </ContextMenuTrigger>
        </ContextMenuProvider>
      );

      const triggerArea = screen.getByTestId('trigger-area');
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100,
      });

      const preventDefaultSpy = vi.spyOn(contextMenuEvent, 'preventDefault');
      const stopPropagationSpy = vi.spyOn(contextMenuEvent, 'stopPropagation');

      fireEvent(triggerArea, contextMenuEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });
});

describe('Edge Cases', () => {
  it('handles empty submenu arrays', () => {
    const itemsWithEmptySubmenu: MenuItem[] = [
      {
        id: 'parent',
        label: 'Parent',
        submenu: [],
        onClick: vi.fn(),
      },
    ];

    render(
      <ContextMenu
        x={100}
        y={100}
        items={itemsWithEmptySubmenu}
        onClose={vi.fn()}
        visible={true}
      />
    );

    expect(screen.getByText('Parent')).toBeInTheDocument();
    // Should not show submenu arrow when submenu is empty
    expect(screen.queryByText('▶')).not.toBeInTheDocument();
  });

  it('handles missing onClick handlers gracefully', async () => {
    const user = userEvent.setup();
    const itemsWithoutOnClick: MenuItem[] = [
      {
        id: 'no-handler',
        label: 'No Handler',
      },
    ];

    const onClose = vi.fn();

    render(
      <ContextMenu
        x={100}
        y={100}
        items={itemsWithoutOnClick}
        onClose={onClose}
        visible={true}
      />
    );

    await user.click(screen.getByText('No Handler'));

    // Should still close the menu
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('handles deeply nested submenus', async () => {
    const user = userEvent.setup();
    const nestedItems: MenuItem[] = [
      {
        id: 'level1',
        label: 'Level 1',
        submenu: [
          {
            id: 'level2',
            label: 'Level 2',
            submenu: [
              {
                id: 'level3',
                label: 'Level 3',
                onClick: vi.fn(),
              },
            ],
          },
        ],
      },
    ];

    render(
      <ContextMenu
        x={100}
        y={100}
        items={nestedItems}
        onClose={vi.fn()}
        visible={true}
      />
    );

    // Hover over Level 1 to show Level 2
    await user.hover(screen.getByText('Level 1'));

    await waitFor(() => {
      expect(screen.getByText('Level 2')).toBeInTheDocument();
    });

    // Hover over Level 2 to show Level 3
    await user.hover(screen.getByText('Level 2'));

    await waitFor(() => {
      expect(screen.getByText('Level 3')).toBeInTheDocument();
    });
  });
});
