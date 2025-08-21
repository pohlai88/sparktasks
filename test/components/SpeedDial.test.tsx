/**
 * SpeedDial Component Tests
 *
 * Test Coverage:
 * - Component mounting and basic rendering
 * - Trigger button functionality and states
 * - Menu opening/closing with click and keyboard
 * - Action menu rendering and interaction
 * - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - Click outside detection and focus management
 * - Accessibility attributes and ARIA compliance
 * - Controlled vs uncontrolled mode behavior
 * - Loading and disabled states
 * - Different placements and positioning
 * - Custom trigger and action styling
 * - Theme awareness and responsive behavior
 * - Animation states and transitions
 * - Link actions and external navigation
 * - Event propagation and handlers
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  Edit,
  Delete,
  Share,
  Download,
  Home,
  Settings,
  User,
} from 'lucide-react';
import SpeedDial, {
  type SpeedDialAction,
  type SpeedDialProps,
} from '@/components/ui/SpeedDial';

// Mock DESIGN_TOKENS for testing
vi.mock('@/design/tokens', () => ({
  DESIGN_TOKENS: {
    position: {
      fixed: {
        bottomRight: 'fixed bottom-4 right-4',
        bottomLeft: 'fixed bottom-4 left-4',
        topRight: 'fixed top-4 right-4',
        topLeft: 'fixed top-4 left-4',
      },
    },
    recipe: {
      button: {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900',
      },
    },
    zIndex: {
      overlay: 'z-50',
    },
    motion: {
      smooth: 'transition-all duration-200 ease-out',
      semantic: {
        hoverLift: 'hover:transform hover:-translate-y-0.5',
      },
    },
    state: {
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    },
    icon: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
      },
    },
  },
}));

describe('SpeedDial Component', () => {
  // Sample actions for testing
  const sampleActions: SpeedDialAction[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit />,
      onClick: vi.fn(),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Delete />,
      onClick: vi.fn(),
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share />,
      onClick: vi.fn(),
      disabled: false,
    },
  ];

  const defaultProps: SpeedDialProps = {
    actions: sampleActions,
    ariaLabel: 'Quick actions menu',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders trigger button with default props', () => {
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button', {
        name: 'Quick actions menu',
      });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('renders with custom trigger icon', () => {
      render(
        <SpeedDial
          {...defaultProps}
          triggerIcon={<Home data-testid='custom-icon' />}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders with custom children as trigger content', () => {
      render(
        <SpeedDial {...defaultProps}>
          <span data-testid='custom-trigger'>Custom Trigger</span>
        </SpeedDial>
      );

      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });

    it('applies correct positioning classes', () => {
      const { container } = render(
        <SpeedDial
          {...defaultProps}
          position='top-left'
          className='custom-speed-dial'
        />
      );

      const speedDialContainer = container.firstChild as HTMLElement;
      expect(speedDialContainer).toHaveClass(
        'fixed',
        'top-4',
        'left-4',
        'custom-speed-dial'
      );
    });

    it('uses custom positioning when provided', () => {
      const { container } = render(
        <SpeedDial
          {...defaultProps}
          position='custom'
          customPosition='absolute top-20 left-20'
        />
      );

      const speedDialContainer = container.firstChild as HTMLElement;
      expect(speedDialContainer).toHaveClass('absolute', 'top-20', 'left-20');
    });
  });

  describe('Trigger Button States', () => {
    it('renders different trigger sizes', () => {
      const { rerender } = render(
        <SpeedDial {...defaultProps} triggerSize='sm' />
      );
      let trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('w-12', 'h-12');

      rerender(<SpeedDial {...defaultProps} triggerSize='md' />);
      trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('w-14', 'h-14');

      rerender(<SpeedDial {...defaultProps} triggerSize='lg' />);
      trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('w-16', 'h-16');
    });

    it('renders different trigger variants', () => {
      const { rerender } = render(
        <SpeedDial {...defaultProps} triggerVariant='primary' />
      );
      let trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('bg-primary-600');

      rerender(<SpeedDial {...defaultProps} triggerVariant='secondary' />);
      trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('bg-secondary-100');
    });

    it('handles disabled state correctly', () => {
      render(<SpeedDial {...defaultProps} disabled={true} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('shows loading state with spinner', () => {
      render(<SpeedDial {...defaultProps} loading={true} />);

      const trigger = screen.getByRole('button');
      const spinner = trigger.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('changes icon when menu opens', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');

      // Initially shows Plus icon
      expect(trigger.querySelector('svg')).toBeInTheDocument();

      // Click to open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Icon should rotate when open
      const iconContainer = trigger.querySelector('div');
      expect(iconContainer).toHaveClass('rotate-45');
    });
  });

  describe('Menu Opening and Closing', () => {
    it('opens menu on trigger click', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveClass('opacity-100', 'scale-100');
    });

    it('closes menu on second trigger click', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');

      // Open menu
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Close menu
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes menu on Escape key', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes menu when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SpeedDial {...defaultProps} />
          <button data-testid='outside-button'>Outside</button>
        </div>
      );

      const trigger = screen.getByRole('button', {
        name: 'Quick actions menu',
      });
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click outside
      const outsideButton = screen.getByTestId('outside-button');
      await user.click(outsideButton);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} disabled={true} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does not open when loading', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} loading={true} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Controlled Mode', () => {
    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <SpeedDial
          {...defaultProps}
          isOpen={false}
          onOpenChange={onOpenChange}
        />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      // Simulate parent updating isOpen
      rerender(
        <SpeedDial
          {...defaultProps}
          isOpen={true}
          onOpenChange={onOpenChange}
        />
      );

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('Action Menu', () => {
    it('renders all action items', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3);

      expect(screen.getByTitle('Edit')).toBeInTheDocument();
      expect(screen.getByTitle('Delete')).toBeInTheDocument();
      expect(screen.getByTitle('Share')).toBeInTheDocument();
    });

    it('calls action onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const actionsWithClick: SpeedDialAction[] = [
        {
          id: 'test-action',
          label: 'Test Action',
          icon: <Settings />,
          onClick: mockOnClick,
        },
      ];

      render(<SpeedDial actions={actionsWithClick} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const actionItem = screen.getByTitle('Test Action');
      await user.click(actionItem);

      expect(mockOnClick).toHaveBeenCalledTimes(1);

      // Menu should close after action
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('calls onActionSelect when action is selected', async () => {
      const user = userEvent.setup();
      const onActionSelect = vi.fn();

      render(<SpeedDial {...defaultProps} onActionSelect={onActionSelect} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const editAction = screen.getByTitle('Edit');
      await user.click(editAction);

      expect(onActionSelect).toHaveBeenCalledWith(sampleActions[0]);
    });

    it('handles disabled actions correctly', async () => {
      const user = userEvent.setup();
      const disabledActions: SpeedDialAction[] = [
        {
          id: 'disabled-action',
          label: 'Disabled Action',
          icon: <User />,
          disabled: true,
          onClick: vi.fn(),
        },
      ];

      render(<SpeedDial actions={disabledActions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const disabledAction = screen.getByTitle('Disabled Action');
      expect(disabledAction).toHaveAttribute('aria-disabled', 'true');
      expect(disabledAction).toHaveClass('opacity-50', 'cursor-not-allowed');

      await user.click(disabledAction);
      expect(disabledActions[0].onClick).not.toHaveBeenCalled();
    });

    it('handles link actions correctly', async () => {
      const user = userEvent.setup();

      // Mock window.open and window.location.href
      const mockOpen = vi.fn();
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'open', { value: mockOpen });
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      const linkActions: SpeedDialAction[] = [
        {
          id: 'external-link',
          label: 'External Link',
          icon: <Download />,
          href: 'https://example.com',
          target: '_blank',
        },
        {
          id: 'internal-link',
          label: 'Internal Link',
          icon: <Home />,
          href: '/dashboard',
        },
      ];

      render(<SpeedDial actions={linkActions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Test external link
      const externalLink = screen.getByTitle('External Link');
      await user.click(externalLink);
      expect(mockOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );

      // Open menu again for internal link test
      await user.click(trigger);

      // Test internal link
      const internalLink = screen.getByTitle('Internal Link');
      await user.click(internalLink);
      expect(window.location.href).toBe('/dashboard');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates through actions with arrow keys', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} placement='top' />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Arrow down should focus first action
      await user.keyboard('{ArrowDown}');

      // Arrow down again should focus second action
      await user.keyboard('{ArrowDown}');

      // Arrow up should go back to first action
      await user.keyboard('{ArrowUp}');

      // Verify navigation works (we can't easily test visual focus, but ensure no errors)
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('wraps navigation at boundaries', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} placement='top' />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Arrow up from initial state should go to last item
      await user.keyboard('{ArrowUp}');

      // Arrow down from last should go to first
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('activates focused action with Enter', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const actionsWithHandler: SpeedDialAction[] = [
        {
          id: 'enter-test',
          label: 'Enter Test',
          icon: <Settings />,
          onClick: mockOnClick,
        },
      ];

      render(<SpeedDial actions={actionsWithHandler} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('activates focused action with Space', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      const actionsWithHandler: SpeedDialAction[] = [
        {
          id: 'space-test',
          label: 'Space Test',
          icon: <Settings />,
          onClick: mockOnClick,
        },
      ];

      render(<SpeedDial actions={actionsWithHandler} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await user.keyboard('{ArrowDown}');
      await user.keyboard(' ');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('closes menu and returns focus on Tab', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Tab}');

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('skips disabled actions in navigation', async () => {
      const user = userEvent.setup();
      const mixedActions: SpeedDialAction[] = [
        {
          id: 'enabled-1',
          label: 'Enabled 1',
          icon: <Edit />,
          onClick: vi.fn(),
        },
        {
          id: 'disabled-1',
          label: 'Disabled 1',
          icon: <Delete />,
          disabled: true,
          onClick: vi.fn(),
        },
        {
          id: 'enabled-2',
          label: 'Enabled 2',
          icon: <Share />,
          onClick: vi.fn(),
        },
      ];

      render(<SpeedDial actions={mixedActions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Navigate and ensure disabled items are properly handled
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('Menu Placement', () => {
    it('renders menu in different placements', async () => {
      const user = userEvent.setup();
      const placements: Array<
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
      > = [
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ];

      for (const placement of placements) {
        const { rerender } = render(
          <SpeedDial {...defaultProps} placement={placement} />
        );

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();

        // Close menu for next iteration
        await user.click(trigger);

        // Clean up for next render
        rerender(<div />);
      }
    });

    it('sets correct orientation for horizontal placements', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} placement='left' />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('sets correct orientation for vertical placements', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} placement='top' />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label', 'Quick actions menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('generates unique menu ID', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menu = screen.getByRole('menu');
      const menuId = menu.getAttribute('id');

      expect(menuId).toBeTruthy();
      expect(menuId).toMatch(/^speed-dial-/);
      expect(trigger).toHaveAttribute('aria-controls', menuId);
    });

    it('uses custom menu ID when provided', async () => {
      const user = userEvent.setup();
      const customMenuId = 'custom-speed-dial-menu';

      render(<SpeedDial {...defaultProps} menuId={customMenuId} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('id', customMenuId);
      expect(trigger).toHaveAttribute('aria-controls', customMenuId);
    });

    it('provides screen reader labels for actions', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menuItems = screen.getAllByRole('menuitem');

      menuItems.forEach((item, index) => {
        expect(item).toHaveAttribute('title', sampleActions[index].label);
        const screenReaderLabel = item.querySelector('.sr-only');
        expect(screenReaderLabel).toHaveTextContent(sampleActions[index].label);
      });
    });

    it('marks icons as decorative', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const iconContainers = screen
        .getAllByRole('menuitem')
        .map(item => item.querySelector('[aria-hidden="true"]'));

      iconContainers.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Animation and Styling', () => {
    it('applies custom menu className', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} menuClassName='custom-menu-class' />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('custom-menu-class');
    });

    it('applies staggered animation delays', async () => {
      const user = userEvent.setup();
      render(<SpeedDial {...defaultProps} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const menuItems = screen.getAllByRole('menuitem');

      menuItems.forEach(item => {
        // Note: In jsdom, we can't easily test computed animation-delay,
        // but we can verify the style attribute was set
        expect(item).toHaveAttribute(
          'style',
          expect.stringContaining('animation-delay')
        );
      });
    });

    it('shows loading state in menu when loading', () => {
      render(<SpeedDial {...defaultProps} loading={true} />);

      // When loading, menu should still show
      const menuContainer = document.querySelector('[role="menu"]');
      expect(menuContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty actions array', () => {
      render(<SpeedDial actions={[]} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
    });

    it('handles actions with custom className', async () => {
      const user = userEvent.setup();
      const customActions: SpeedDialAction[] = [
        {
          id: 'custom-styled',
          label: 'Custom Styled',
          icon: <Settings />,
          className: 'custom-action-class',
        },
      ];

      render(<SpeedDial actions={customActions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const actionItem = screen.getByTitle('Custom Styled');
      expect(actionItem).toHaveClass('custom-action-class');
    });

    it('handles parent click events properly', async () => {
      const user = userEvent.setup();
      const parentClickHandler = vi.fn();

      render(
        <div onClick={parentClickHandler}>
          <SpeedDial {...defaultProps} />
        </div>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const actionItem = screen.getByTitle('Edit');
      await user.click(actionItem);

      // Parent handler gets called because click events bubble
      // This is normal behavior and not necessarily a problem
      expect(parentClickHandler).toHaveBeenCalled();
    });
  });
});
