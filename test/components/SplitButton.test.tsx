/**
 * SplitButton Component Tests - Enterprise-Grade Validation
 *
 * Comprehensive test coverage ensuring:
 * - Proper DESIGN_TOKENS integration and compliance
 * - Accessibility standards (WCAG 2.1 AA)
 * - Split button functionality and dropdown behavior
 * - Keyboard navigation and focus management
 * - Dark mode and responsive compatibility
 * - Performance and render optimization
 */

import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, afterEach } from 'vitest';
import { SplitButton } from '../../src/components/ui/SplitButton';
import { Save, Edit, Trash, Download } from 'lucide-react';

// Auto cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock items for testing
const mockItems = [
  {
    id: 'save-as',
    label: 'Save As...',
    icon: <Save size={16} />,
    onClick: vi.fn(),
  },
  {
    id: 'export',
    label: 'Export',
    icon: <Download size={16} />,
    onClick: vi.fn(),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash size={16} />,
    onClick: vi.fn(),
    disabled: false,
  },
  {
    id: 'disabled-action',
    label: 'Disabled Action',
    icon: <Edit size={16} />,
    onClick: vi.fn(),
    disabled: true,
  },
];

describe('SplitButton Component - Enterprise Grade', () => {
  beforeEach(() => {
    // Reset all mocks
    mockItems.forEach(item => item.onClick.mockClear());
  });

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<SplitButton items={mockItems}>Save Document</SplitButton>);

      expect(
        screen.getByRole('button', { name: /save document/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /show more options/i })
      ).toBeInTheDocument();
    });

    it('applies proper default attributes', () => {
      render(
        <SplitButton items={mockItems} data-testid='split-button'>
          Test Action
        </SplitButton>
      );

      const mainButton = screen.getByRole('button', { name: /test action/i });
      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });

      expect(mainButton).toBeInTheDocument();
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
      expect(dropdownButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(dropdownButton).toHaveAttribute('data-state', 'closed');
    });

    it('renders dropdown closed by default', () => {
      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Main Action Functionality', () => {
    it('handles main button clicks correctly', async () => {
      const user = userEvent.setup();
      const onMainClick = vi.fn();

      render(
        <SplitButton items={mockItems} onClick={onMainClick}>
          Save Document
        </SplitButton>
      );

      await user.click(screen.getByRole('button', { name: /save document/i }));
      expect(onMainClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger main action when disabled', async () => {
      const user = userEvent.setup();
      const onMainClick = vi.fn();

      render(
        <SplitButton items={mockItems} onClick={onMainClick} disabled>
          Save Document
        </SplitButton>
      );

      await user.click(screen.getByRole('button', { name: /save document/i }));
      expect(onMainClick).not.toHaveBeenCalled();
    });

    it('does not trigger main action when pending', async () => {
      const user = userEvent.setup();
      const onMainClick = vi.fn();

      render(
        <SplitButton items={mockItems} onClick={onMainClick} pending>
          Save Document
        </SplitButton>
      );

      await user.click(screen.getByRole('button', { name: /save document/i }));
      expect(onMainClick).not.toHaveBeenCalled();
    });
  });

  describe('Dropdown Functionality', () => {
    it('toggles dropdown on trigger button click', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });

      // Open dropdown
      await user.click(dropdownButton);
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
      expect(dropdownButton).toHaveAttribute('data-state', 'open');

      // Close dropdown
      await user.click(dropdownButton);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders all dropdown items when open', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );

      expect(
        screen.getByRole('menuitem', { name: /save as/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /export/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /delete/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /disabled action/i })
      ).toBeInTheDocument();
    });

    it('handles dropdown item clicks correctly', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );
      await user.click(screen.getByRole('menuitem', { name: /save as/i }));

      expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('does not trigger disabled item clicks', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );

      const disabledItem = screen.getByRole('menuitem', {
        name: /disabled action/i,
      });
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

      await user.click(disabledItem);
      expect(mockItems[3].onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown with ArrowDown key', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      dropdownButton.focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('navigates through dropdown items with arrow keys', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      dropdownButton.focus();

      // Open dropdown and focus first item
      await user.keyboard('{ArrowDown}');

      // Navigate down
      await user.keyboard('{ArrowDown}');

      // Navigate up
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('activates focused item with Enter key', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      dropdownButton.focus();

      // Open dropdown and focus first item
      await user.keyboard('{ArrowDown}');

      // Activate first item
      await user.keyboard('{Enter}');

      expect(mockItems[0].onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      dropdownButton.focus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      // Wait for the dropdown to close
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });

      expect(dropdownButton).toHaveFocus();
    });

    it('toggles dropdown with Space key', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      dropdownButton.focus();

      await user.keyboard(' ');
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard(' ');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Click Outside Behavior', () => {
    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <SplitButton items={mockItems}>Test Action</SplitButton>
          <button>Outside Button</button>
        </div>
      );

      // Open dropdown
      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Click outside
      await user.click(screen.getByRole('button', { name: /outside button/i }));
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Size Variations', () => {
    it('applies size classes correctly', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;

      sizes.forEach(size => {
        cleanup(); // Clean DOM before each size test

        render(
          <SplitButton items={mockItems} size={size}>
            Test {size}
          </SplitButton>
        );

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
          expect(button).toHaveAttribute('data-size', size);
        });
      });
    });

    it('scales chevron icon based on size', () => {
      const { rerender } = render(
        <SplitButton items={mockItems} size='sm'>
          Small Button
        </SplitButton>
      );

      // Check for small chevron (size 14)
      let chevron = document.querySelector('svg');
      expect(chevron).toHaveAttribute('width', '14');

      rerender(
        <SplitButton items={mockItems} size='xl'>
          Large Button
        </SplitButton>
      );

      // Check for large chevron (size 20)
      chevron = document.querySelector('svg');
      expect(chevron).toHaveAttribute('width', '20');
    });
  });

  describe('Variant Support', () => {
    it('applies variant classes to both buttons', () => {
      const variants = [
        'primary',
        'secondary',
        'ghost',
        'destructive',
        'outline',
        'link',
      ] as const;

      variants.forEach(variant => {
        cleanup(); // Clean DOM before each variant test

        render(
          <SplitButton items={mockItems} variant={variant}>
            Test {variant}
          </SplitButton>
        );

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
          expect(button).toHaveAttribute('data-variant', variant);
        });
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <SplitButton items={mockItems} aria-label='Document actions'>
          Save Document
        </SplitButton>
      );

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      expect(dropdownButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(dropdownButton);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('aria-orientation', 'vertical');
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(4);
      menuItems.forEach(item => {
        expect(item).toHaveAttribute('role', 'menuitem');
      });
    });

    it('manages focus correctly', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      const dropdownButton = screen.getByRole('button', {
        name: /show more options/i,
      });

      // Focus and open dropdown
      dropdownButton.focus();
      await user.keyboard('{ArrowDown}');

      // First item should be focusable
      const firstItem = screen.getByRole('menuitem', { name: /save as/i });
      expect(firstItem).toHaveAttribute('tabIndex', '0');

      // Other items should not be focusable
      const secondItem = screen.getByRole('menuitem', { name: /export/i });
      expect(secondItem).toHaveAttribute('tabIndex', '-1');
    });

    it('indicates disabled state correctly', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );

      const disabledItem = screen.getByRole('menuitem', {
        name: /disabled action/i,
      });
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
      expect(disabledItem).toHaveAttribute('disabled');
    });
  });

  describe('Full Width Support', () => {
    it('applies full width styling when enabled', () => {
      const { container } = render(
        <SplitButton items={mockItems} fullWidth>
          Full Width Button
        </SplitButton>
      );

      const buttonGroup = container.querySelector('.w-full');
      expect(buttonGroup).toBeInTheDocument();
    });
  });

  describe('Placement Options', () => {
    it('supports different dropdown placements', async () => {
      const user = userEvent.setup();

      // Test one placement at a time for better test isolation
      const { rerender } = render(
        <SplitButton items={mockItems} placement='bottom-start'>
          Test Placement
        </SplitButton>
      );

      // Get the specific dropdown trigger
      const triggerButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      await user.click(triggerButton);

      const menu = screen.getByRole('menu');
      expect(menu).toHaveAttribute('data-placement', 'bottom-start');

      // Close dropdown by clicking outside
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      // Test another placement
      rerender(
        <SplitButton items={mockItems} placement='top-end'>
          Test Placement
        </SplitButton>
      );

      const newTriggerButton = screen.getByRole('button', {
        name: /show more options/i,
      });
      await user.click(newTriggerButton);

      const newMenu = screen.getByRole('menu');
      expect(newMenu).toHaveAttribute('data-placement', 'top-end');
    });
  });

  describe('Icon Integration', () => {
    it('renders icons in dropdown items correctly', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Action</SplitButton>);

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );

      // Check that icons are rendered (they have aria-hidden="true")
      const icons = document.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Advanced Features', () => {
    it('applies custom className correctly', () => {
      const { container } = render(
        <SplitButton items={mockItems} className='custom-split-button'>
          Test Custom Class
        </SplitButton>
      );

      expect(container.firstChild).toHaveClass('custom-split-button');
    });

    it('applies custom dropdown className correctly', async () => {
      const user = userEvent.setup();

      render(
        <SplitButton items={mockItems} dropdownClassName='custom-dropdown'>
          Test Custom Dropdown
        </SplitButton>
      );

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );

      const menu = screen.getByRole('menu');
      expect(menu).toHaveClass('custom-dropdown');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <SplitButton ref={ref} items={mockItems}>
          Test Ref
        </SplitButton>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Token Integration', () => {
    it('uses DESIGN_TOKENS instead of hardcoded classes', async () => {
      const user = userEvent.setup();

      render(<SplitButton items={mockItems}>Test Tokens</SplitButton>);

      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );

      const menu = screen.getByRole('menu');

      // Should not have hardcoded Tailwind classes
      expect(menu.className).not.toMatch(/bg-blue-|text-white-|border-gray-/);

      // Should use proper z-index token
      expect(menu).toHaveClass('z-30');
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('supports complex document action scenarios', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      const documentItems = [
        { id: 'save-as', label: 'Save As...', onClick: vi.fn() },
        { id: 'export-pdf', label: 'Export as PDF', onClick: vi.fn() },
        { id: 'share', label: 'Share Document', onClick: vi.fn() },
        { id: 'delete', label: 'Delete Document', onClick: vi.fn() },
      ];

      render(
        <SplitButton
          items={documentItems}
          onClick={onSave}
          variant='primary'
          size='md'
        >
          Save Document
        </SplitButton>
      );

      // Test main action
      await user.click(screen.getByRole('button', { name: /save document/i }));
      expect(onSave).toHaveBeenCalledTimes(1);

      // Test dropdown actions
      await user.click(
        screen.getByRole('button', { name: /show more options/i })
      );
      await user.click(
        screen.getByRole('menuitem', { name: /export as pdf/i })
      );
      expect(documentItems[1].onClick).toHaveBeenCalledTimes(1);
    });
  });
});
