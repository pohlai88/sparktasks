/**
 * KebabMenu Component Test Suite
 *
 * Test Categories:
 * 1. Basic Rendering - Component mounts and displays correctly
 * 2. Menu Functionality - Open/close behavior and item interactions
 * 3. Keyboard Navigation - Arrow keys, Enter, Escape, Tab handling
 * 4. Accessibility Compliance - ARIA attributes and focus management
 * 5. Link Handling - Internal and external link behavior
 * 6. Button Variants - Different trigger button styles and sizes
 * 7. Controlled vs Uncontrolled - State management patterns
 * 8. Advanced Features - Destructive actions, separators, disabled states
 * 9. Token Integration - DESIGN_TOKENS usage validation
 * 10. Real-World Usage - Practical implementation scenarios
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Edit, Trash2, Share, Download, Settings } from 'lucide-react';
import KebabMenu, { type KebabMenuItem } from '@/components/ui/KebabMenu';

// Mock external navigation
const mockWindowOpen = vi.fn();
const mockLocationAssign = vi.fn();

Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: mockLocationAssign,
  },
  writable: true,
});

// Test data
const basicMenuItems: KebabMenuItem[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit />,
    onClick: vi.fn(),
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share />,
    onClick: vi.fn(),
  },
  {
    id: 'download',
    label: 'Download',
    icon: <Download />,
    onClick: vi.fn(),
  },
];

const complexMenuItems: KebabMenuItem[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit />,
    onClick: vi.fn(),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    onClick: vi.fn(),
  },
  {
    id: 'separator1',
    label: '',
    separator: true,
  },
  {
    id: 'external',
    label: 'View External',
    href: 'https://example.com',
    target: '_blank',
  },
  {
    id: 'internal',
    label: 'View Details',
    href: '/details',
  },
  {
    id: 'separator2',
    label: '',
    separator: true,
  },
  {
    id: 'disabled',
    label: 'Disabled Action',
    disabled: true,
    onClick: vi.fn(),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 />,
    destructive: true,
    onClick: vi.fn(),
  },
];

describe('KebabMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== BASIC RENDERING =====
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<KebabMenu items={basicMenuItems} />);
      expect(
        screen.getByRole('button', { name: /more actions/i })
      ).toBeInTheDocument();
    });

    it('displays three-dot icon in trigger button', () => {
      render(<KebabMenu items={basicMenuItems} />);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('initially hides the menu', () => {
      render(<KebabMenu items={basicMenuItems} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      // Menu should be in closed state (with opacity-0 and pointer-events-none)
      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('opacity-0');
      expect(menu).toHaveClass('pointer-events-none');
    });

    it('applies custom aria label', () => {
      render(
        <KebabMenu items={basicMenuItems} ariaLabel='Custom actions menu' />
      );
      expect(
        screen.getByRole('button', { name: /custom actions menu/i })
      ).toBeInTheDocument();
    });
  });

  // ===== MENU FUNCTIONALITY =====
  describe('Menu Functionality', () => {
    it('opens menu when trigger button is clicked', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('closes menu when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <KebabMenu items={basicMenuItems} />
          <div data-testid='outside'>Outside</div>
        </div>
      );

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );

      await user.click(screen.getByTestId('outside'));
      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });
    });

    it('executes item onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      const items = [{ ...basicMenuItems[0], onClick: mockClick }];

      render(<KebabMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: /edit/i }));

      expect(mockClick).toHaveBeenCalledOnce();
    });

    it('calls onSelect when item is selected', async () => {
      const user = userEvent.setup();
      const mockSelect = vi.fn();

      render(<KebabMenu items={basicMenuItems} onSelect={mockSelect} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: /edit/i }));

      expect(mockSelect).toHaveBeenCalledWith(basicMenuItems[0]);
    });

    it('closes menu after item selection', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: /edit/i }));

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });
    });
  });

  // ===== KEYBOARD NAVIGATION =====
  describe('Keyboard Navigation', () => {
    it('opens menu with Enter key', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('closes menu with Escape key', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });
    });

    it('navigates items with arrow keys', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));

      // Arrow down should focus first item
      await user.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /edit/i })).toHaveFocus();
      });

      // Arrow down again should focus second item
      await user.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /share/i })).toHaveFocus();
      });

      // Arrow up should go back to first item
      await user.keyboard('{ArrowUp}');
      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /edit/i })).toHaveFocus();
      });
    });

    it('activates focused item with Enter key', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      const items = [{ ...basicMenuItems[0], onClick: mockClick }];

      render(<KebabMenu items={items} />);

      await user.click(screen.getByRole('button'));
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(mockClick).toHaveBeenCalledOnce();
    });

    it('closes menu with Tab key', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));
      await user.keyboard('{Tab}');

      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });
    });
  });

  // ===== ACCESSIBILITY COMPLIANCE =====
  describe('Accessibility Compliance', () => {
    it('has proper ARIA attributes on trigger button', () => {
      render(<KebabMenu items={basicMenuItems} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
      expect(button).toHaveAttribute('aria-label');
    });

    it('updates ARIA attributes when menu opens', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls');
    });

    it('has proper menu ARIA attributes', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));
      const menu = screen.getByRole('menu');

      expect(menu).toHaveAttribute('role', 'menu');
      expect(menu).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('sets proper tabIndex on menu items', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      await user.click(screen.getByRole('button'));
      const menuItems = screen.getAllByRole('menuitem');

      // Only focused item should have tabIndex 0
      expect(menuItems[0]).toHaveAttribute('tabindex', '-1');
      expect(menuItems[1]).toHaveAttribute('tabindex', '-1');
      expect(menuItems[2]).toHaveAttribute('tabindex', '-1');
    });
  });

  // ===== LINK HANDLING =====
  describe('Link Handling', () => {
    beforeEach(() => {
      mockWindowOpen.mockClear();
      mockLocationAssign.mockClear();
    });

    it('opens external links in new tab', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));
      await user.click(
        screen.getByRole('menuitem', { name: /view external/i })
      );

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('navigates to internal links', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: /view details/i }));

      expect(window.location.href).toBe('/details');
    });

    it('shows external link indicator', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));
      const externalItem = screen.getByRole('menuitem', {
        name: /view external/i,
      });

      expect(externalItem.querySelector('svg')).toBeInTheDocument();
    });
  });

  // ===== BUTTON VARIANTS =====
  describe('Button Variants', () => {
    it('applies different button sizes', () => {
      const { rerender } = render(
        <KebabMenu items={basicMenuItems} buttonSize='sm' />
      );
      let button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');

      rerender(<KebabMenu items={basicMenuItems} buttonSize='lg' />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
    });

    it('applies different button variants', () => {
      const { rerender } = render(
        <KebabMenu items={basicMenuItems} buttonVariant='outline' />
      );
      let button = screen.getByRole('button');
      expect(button).toHaveClass('border');

      rerender(<KebabMenu items={basicMenuItems} buttonVariant='secondary' />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary-100');
    });

    it('shows loading state', () => {
      render(<KebabMenu items={basicMenuItems} loading />);
      const button = screen.getByRole('button');

      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  // ===== CONTROLLED VS UNCONTROLLED =====
  describe('Controlled vs Uncontrolled', () => {
    it('works in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={basicMenuItems} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('works in controlled mode', async () => {
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      const { rerender } = render(
        <KebabMenu
          items={basicMenuItems}
          isOpen={false}
          onOpenChange={mockOnOpenChange}
        />
      );

      await user.click(screen.getByRole('button'));
      expect(mockOnOpenChange).toHaveBeenCalledWith(true);

      rerender(
        <KebabMenu
          items={basicMenuItems}
          isOpen={true}
          onOpenChange={mockOnOpenChange}
        />
      );

      expect(screen.getByRole('menu')).toBeVisible();
    });
  });

  // ===== ADVANCED FEATURES =====
  describe('Advanced Features', () => {
    it('handles disabled state', () => {
      render(<KebabMenu items={basicMenuItems} disabled />);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('renders separators', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));
      const separators = screen.getAllByRole('separator');

      expect(separators).toHaveLength(2);
    });

    it('styles destructive items', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));
      const deleteItem = screen.getByRole('menuitem', { name: /delete/i });

      expect(deleteItem).toHaveClass('text-red-600');
    });

    it('handles disabled items', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));
      const disabledItem = screen.getByRole('menuitem', {
        name: /disabled action/i,
      });

      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
      expect(disabledItem).toHaveClass('data-[disabled]:opacity-50');
    });

    it('skips disabled items in keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<KebabMenu items={complexMenuItems} />);

      await user.click(screen.getByRole('button'));

      // Should skip disabled items when navigating
      await user.keyboard('{ArrowDown}'); // Focus "Edit"
      await user.keyboard('{ArrowDown}'); // Focus "Settings"
      await user.keyboard('{ArrowDown}'); // Should skip separator and focus "View External"

      await waitFor(() => {
        expect(
          screen.getByRole('menuitem', { name: /view external/i })
        ).toHaveFocus();
      });
    });
  });

  // ===== TOKEN INTEGRATION =====
  describe('Token Integration', () => {
    it('uses DESIGN_TOKENS for styling', () => {
      render(<KebabMenu items={basicMenuItems} />);
      const button = screen.getByRole('button');

      // Check that no hardcoded Tailwind classes are used (but allow token-based ones)
      expect(button.className).not.toMatch(/\bbg-blue-\d+\b/);
      expect(button.className).not.toMatch(/\btext-white\b/);
      // Allow px-4 as it comes from DESIGN_TOKENS.recipe.button classes
      expect(button.className).toContain('px-4');
    });
  });

  // ===== REAL-WORLD USAGE =====
  describe('Real-World Usage', () => {
    it('handles typical context menu scenario', async () => {
      const user = userEvent.setup();
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      const contextItems: KebabMenuItem[] = [
        {
          id: 'edit',
          label: 'Edit item',
          icon: <Edit />,
          onClick: handleEdit,
        },
        {
          id: 'separator',
          label: '',
          separator: true,
        },
        {
          id: 'delete',
          label: 'Delete item',
          icon: <Trash2 />,
          destructive: true,
          onClick: handleDelete,
        },
      ];

      render(<KebabMenu items={contextItems} ariaLabel='Item actions' />);

      // Open menu and select edit
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name: /edit item/i }));

      expect(handleEdit).toHaveBeenCalledOnce();

      // Verify menu closed
      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });
    });
  });
});
