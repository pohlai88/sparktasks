import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Copy, Trash2, Edit } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuProvider,
  ContextMenuTrigger,
  useContextMenu,
  type MenuItem,
} from '../../src/components/ui/ContextMenu';

// Test setup
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
});

// Simple mock items for basic testing
const basicMenuItems: MenuItem[] = [
  {
    id: 'copy',
    label: 'Copy',
    icon: <Copy data-testid='copy-icon' />,
    onClick: vi.fn(),
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit data-testid='edit-icon' />,
    onClick: vi.fn(),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 data-testid='delete-icon' />,
    danger: true,
    onClick: vi.fn(),
  },
];

describe('ContextMenu Component - Basic Functionality', () => {
  describe('Basic Rendering', () => {
    it('renders menu when visible', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={basicMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-label',
        'Context menu'
      );
    });

    it('does not render menu when not visible', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={basicMenuItems}
          onClose={vi.fn()}
          visible={false}
        />
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders menu items correctly', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={basicMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
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
          items={basicMenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      await user.click(screen.getByText('Copy'));

      expect(basicMenuItems[0].onClick).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('handles disabled menu items', async () => {
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

      const disabledItem = screen.getByText('Disabled Item');
      await user.click(disabledItem);

      expect(disabledItems[0].onClick).not.toHaveBeenCalled();
    });
  });

  describe('Escape Key Handling', () => {
    it('closes menu when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <ContextMenu
          x={100}
          y={100}
          items={basicMenuItems}
          onClose={onClose}
          visible={true}
        />
      );

      // Wait for the event listeners to be attached (they have a 10ms timeout)
      await new Promise(resolve => setTimeout(resolve, 20));

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Divider Functionality', () => {
    it('renders dividers correctly', () => {
      const itemsWithDivider: MenuItem[] = [
        {
          id: 'item1',
          label: 'Item 1',
          onClick: vi.fn(),
        },
        {
          id: 'divider',
          label: '',
          divider: true,
        },
        {
          id: 'item2',
          label: 'Item 2',
          onClick: vi.fn(),
        },
      ];

      render(
        <ContextMenu
          x={100}
          y={100}
          items={itemsWithDivider}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const separators = screen.getAllByRole('separator');
      expect(separators).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ContextMenu
          x={100}
          y={100}
          items={basicMenuItems}
          onClose={vi.fn()}
          visible={true}
        />
      );

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-label', 'Context menu');

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems.length).toBeGreaterThan(0);
    });
  });
});

describe('ContextMenuProvider', () => {
  // Test helper component that uses the hook
  const TestHookComponent = () => {
    const { showMenu, hideMenu, isVisible } = useContextMenu();

    return (
      <div>
        <button
          data-testid='show-menu-btn'
          onClick={e => showMenu(e as any, basicMenuItems)}
        >
          Show Menu
        </button>
        <button data-testid='hide-menu-btn' onClick={hideMenu}>
          Hide Menu
        </button>
        <div data-testid='visibility-status'>
          {isVisible ? 'visible' : 'hidden'}
        </div>
      </div>
    );
  };

  describe('Provider Context', () => {
    it('provides context to children', () => {
      render(
        <ContextMenuProvider>
          <TestHookComponent />
        </ContextMenuProvider>
      );

      expect(screen.getByTestId('show-menu-btn')).toBeInTheDocument();
      expect(screen.getByTestId('hide-menu-btn')).toBeInTheDocument();
      expect(screen.getByTestId('visibility-status')).toHaveTextContent(
        'hidden'
      );
    });

    it('shows menu when showMenu is called', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenuProvider>
          <TestHookComponent />
        </ContextMenuProvider>
      );

      await user.click(screen.getByTestId('show-menu-btn'));

      expect(screen.getByTestId('visibility-status')).toHaveTextContent(
        'visible'
      );
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
      expect(screen.getByTestId('visibility-status')).toHaveTextContent(
        'visible'
      );

      await user.click(screen.getByTestId('hide-menu-btn'));
      expect(screen.getByTestId('visibility-status')).toHaveTextContent(
        'hidden'
      );
    });
  });

  describe('Hook Error Handling', () => {
    it('throws error when useContextMenu is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

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
      render(
        <ContextMenuProvider>
          <ContextMenuTrigger items={basicMenuItems}>
            <div data-testid='trigger-area'>Right-click me</div>
          </ContextMenuTrigger>
        </ContextMenuProvider>
      );

      const triggerArea = screen.getByTestId('trigger-area');

      fireEvent.contextMenu(triggerArea, {
        clientX: 100,
        clientY: 100,
      });

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('does not show menu when disabled', async () => {
      render(
        <ContextMenuProvider>
          <ContextMenuTrigger items={basicMenuItems} disabled={true}>
            <div data-testid='trigger-area'>Right-click me</div>
          </ContextMenuTrigger>
        </ContextMenuProvider>
      );

      const triggerArea = screen.getByTestId('trigger-area');

      fireEvent.contextMenu(triggerArea, {
        clientX: 100,
        clientY: 100,
      });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});

describe('Edge Cases', () => {
  it('handles empty items array', () => {
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
});
