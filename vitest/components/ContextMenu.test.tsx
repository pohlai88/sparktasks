/**
 * Enhanced ContextMenu Component Tests - MAPS v2.2 Compliance Validation
 *
 * Essential tests for the Enhanced Context Menu component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  EnhancedContextMenu,
  ContextMenuFactory,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
} from '@/components/ui-enhanced/ContextMenu';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// ===== TEST UTILITIES =====

const BasicContextMenu = () => (
  <ContextMenu>
    <ContextMenuTrigger data-testid='context-trigger'>
      Right click me
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Test Item 1</ContextMenuItem>
      <ContextMenuItem>Test Item 2</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Test Item 3</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

const triggerContextMenu = async (trigger: HTMLElement) => {
  fireEvent.contextMenu(trigger);
  await waitFor(() => {
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
};

// ===== BASIC COMPONENT TESTS =====

describe('Enhanced ContextMenu - Basic Functionality', () => {
  it('renders without crashing', () => {
    render(<BasicContextMenu />);
    expect(screen.getByTestId('context-trigger')).toBeInTheDocument();
  });

  it('opens context menu on right click', async () => {
    render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('displays menu items correctly', async () => {
    render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    expect(
      screen.getByRole('menuitem', { name: 'Test Item 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Test Item 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Test Item 3' })
    ).toBeInTheDocument();
  });

  it('handles menu item clicks', async () => {
    const onSelect = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Clickable Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    const menuItem = screen.getByRole('menuitem', { name: 'Clickable Item' });
    fireEvent.click(menuItem);

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

// ===== VARIANT TESTS =====

describe('Enhanced ContextMenu - Variants', () => {
  it('renders default variant correctly', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent variant='default'>
          <ContextMenuItem>Default Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toBeInTheDocument();
    expect(menu).toHaveClass('min-w-[8rem]');
  });

  it('renders glass variant correctly', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent variant='glass'>
          <ContextMenuItem>Glass Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('backdrop-blur-[12px]');
    expect(menu).toHaveClass('backdrop-saturate-[135%]');
  });
});

// ===== AAA COMPLIANCE TESTS =====

describe('Enhanced ContextMenu - AAA Compliance', () => {
  it('applies AAA compliance styles when enabled', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent aaaMode={true}>
          <ContextMenuItem>AAA Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('contrast-more:bg-background');
    expect(menu).toHaveClass('forced-colors:border-[ButtonBorder]');
  });

  it('passes accessibility audit', async () => {
    const { container } = render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ===== KEYBOARD NAVIGATION TESTS =====

describe('Enhanced ContextMenu - Keyboard Navigation', () => {
  it('supports keyboard navigation between items', async () => {
    const user = userEvent.setup();
    render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    // Focus should be on the first menu item
    const firstItem = screen.getByRole('menuitem', { name: 'Test Item 1' });
    expect(firstItem).toHaveFocus();

    // Arrow down should move to next item
    await user.keyboard('{ArrowDown}');
    const secondItem = screen.getByRole('menuitem', { name: 'Test Item 2' });
    expect(secondItem).toHaveFocus();
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});

// ===== ENHANCED CONTEXT MENU COMPONENT TESTS =====

describe('Enhanced ContextMenu - Composite Component', () => {
  it('renders with all props correctly', () => {
    render(
      <EnhancedContextMenu
        trigger={<button>Enhanced Trigger</button>}
        variant='glass'
        size='lg'
        aaaMode={true}
        density='compact'
      >
        <ContextMenuItem>Enhanced Item</ContextMenuItem>
      </EnhancedContextMenu>
    );

    expect(
      screen.getByRole('button', { name: 'Enhanced Trigger' })
    ).toBeInTheDocument();
  });

  it('calls onOpenChange when menu state changes', async () => {
    const onOpenChange = vi.fn();

    render(
      <EnhancedContextMenu
        trigger={
          <button data-testid='enhanced-trigger'>Enhanced Trigger</button>
        }
        onOpenChange={onOpenChange}
      >
        <ContextMenuItem>Enhanced Item</ContextMenuItem>
      </EnhancedContextMenu>
    );

    const trigger = screen.getByTestId('enhanced-trigger');
    await triggerContextMenu(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

// ===== FACTORY PATTERN TESTS =====

describe('Enhanced ContextMenu - Factory Patterns', () => {
  it('creates default context menu via factory', () => {
    const DefaultMenu = ContextMenuFactory.default({
      trigger: <button>Factory Default</button>,
      children: <ContextMenuItem>Factory Item</ContextMenuItem>,
    });

    render(DefaultMenu);
    expect(
      screen.getByRole('button', { name: 'Factory Default' })
    ).toBeInTheDocument();
  });

  it('creates glass context menu via factory', () => {
    const GlassMenu = ContextMenuFactory.glass({
      trigger: <button>Factory Glass</button>,
      children: <ContextMenuItem>Glass Item</ContextMenuItem>,
    });

    render(GlassMenu);
    expect(
      screen.getByRole('button', { name: 'Factory Glass' })
    ).toBeInTheDocument();
  });

  it('creates AAA context menu via factory', () => {
    const AAAMenu = ContextMenuFactory.aaa({
      trigger: <button>Factory AAA</button>,
      children: <ContextMenuItem>AAA Item</ContextMenuItem>,
    });

    render(AAAMenu);
    expect(
      screen.getByRole('button', { name: 'Factory AAA' })
    ).toBeInTheDocument();
  });
});

// ===== ADVANCED FEATURES TESTS =====

describe('Enhanced ContextMenu - Advanced Features', () => {
  it('renders shortcuts correctly', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    expect(screen.getByText('⌘C')).toBeInTheDocument();
    expect(screen.getByText('⌘C')).toHaveClass('text-content-tertiary');
  });

  it('handles checkbox items with state', async () => {
    const onCheckedChange = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Toggle Option
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    const checkboxItem = screen.getByRole('menuitemcheckbox');
    fireEvent.click(checkboxItem);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced ContextMenu - Accessibility', () => {
  it('has correct ARIA attributes', async () => {
    render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveAttribute('role', 'menu');
    expect(menu).toHaveAttribute('data-state', 'open');
  });

  it('supports high contrast mode', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent aaaMode={true}>
          <ContextMenuItem>AAA Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('forced-colors:bg-[ButtonFace]');
    expect(menu).toHaveClass('forced-colors:border-[ButtonBorder]');
  });

  it('respects reduced motion preferences', async () => {
    render(<BasicContextMenu />);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('motion-reduce:transition-none');
    expect(menu).toHaveClass('motion-reduce:animate-none');
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  EnhancedContextMenu,
  ContextMenuFactory,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui-enhanced/ContextMenu';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// ===== TEST UTILITIES =====

const renderContextMenu = (
  variant?: 'default' | 'glass' | 'floating' | 'outlined' | 'ghost' | 'filled',
  aaaMode?: boolean,
  children?: React.ReactNode
) => {
  const defaultChildren = (
    <>
      <ContextMenuItem>Test Item 1</ContextMenuItem>
      <ContextMenuItem>Test Item 2</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Test Item 3</ContextMenuItem>
    </>
  );

  return render(
    <ContextMenu>
      <ContextMenuTrigger data-testid='context-trigger'>
        Right click me
      </ContextMenuTrigger>
      <ContextMenuContent
        {...(variant && { variant })}
        {...(aaaMode !== undefined && { aaaMode })}
      >
        {children || defaultChildren}
      </ContextMenuContent>
    </ContextMenu>
  );
};

const triggerContextMenu = async (trigger: HTMLElement) => {
  fireEvent.contextMenu(trigger);
  await waitFor(() => {
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
};

// ===== BASIC COMPONENT TESTS =====

describe('Enhanced ContextMenu - Basic Functionality', () => {
  it('renders without crashing', () => {
    renderContextMenu();
    expect(screen.getByTestId('context-trigger')).toBeInTheDocument();
  });

  it('opens context menu on right click', async () => {
    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('displays menu items correctly', async () => {
    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    expect(
      screen.getByRole('menuitem', { name: 'Test Item 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Test Item 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Test Item 3' })
    ).toBeInTheDocument();
  });

  it('closes menu when clicking outside', async () => {
    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('handles menu item clicks', async () => {
    const onSelect = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Clickable Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    const menuItem = screen.getByRole('menuitem', { name: 'Clickable Item' });
    fireEvent.click(menuItem);

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

// ===== VARIANT TESTS =====

describe('Enhanced ContextMenu - Variants', () => {
  const variants = [
    'default',
    'glass',
    'floating',
    'outlined',
    'ghost',
    'filled',
  ];

  variants.forEach(variant => {
    it(`renders ${variant} variant correctly`, async () => {
      renderContextMenu(variant);
      const trigger = screen.getByTestId('context-trigger');

      await triggerContextMenu(trigger);
      const menu = screen.getByRole('menu');

      expect(menu).toBeInTheDocument();
      expect(menu).toHaveClass('min-w-[8rem]'); // Base styles should be present
    });
  });

  it('applies glass variant styles', async () => {
    renderContextMenu('glass');
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('backdrop-blur-[12px]');
    expect(menu).toHaveClass('backdrop-saturate-[135%]');
  });

  it('applies floating variant styles', async () => {
    renderContextMenu('floating');
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('shadow-xl');
    expect(menu).toHaveClass('ring-1');
  });
});

// ===== AAA COMPLIANCE TESTS =====

describe('Enhanced ContextMenu - AAA Compliance', () => {
  it('applies AAA compliance styles when enabled', async () => {
    renderContextMenu('default', true);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('contrast-more:bg-background');
    expect(menu).toHaveClass('forced-colors:border-[ButtonBorder]');
  });

  it('passes accessibility audit with AAA mode', async () => {
    const { container } = renderContextMenu('default', true);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('overrides glass effects in AAA mode', async () => {
    renderContextMenu('glass', true);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('backdrop-blur-none');
    expect(menu).toHaveClass('backdrop-saturate-100');
  });
});

// ===== KEYBOARD NAVIGATION TESTS =====

describe('Enhanced ContextMenu - Keyboard Navigation', () => {
  it('supports keyboard navigation between items', async () => {
    const user = userEvent.setup();
    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    // Focus should be on the first menu item
    const firstItem = screen.getByRole('menuitem', { name: 'Test Item 1' });
    expect(firstItem).toHaveFocus();

    // Arrow down should move to next item
    await user.keyboard('{ArrowDown}');
    const secondItem = screen.getByRole('menuitem', { name: 'Test Item 2' });
    expect(secondItem).toHaveFocus();
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('activates menu item on Enter key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Keyboard Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

// ===== ENHANCED CONTEXT MENU COMPONENT TESTS =====

describe('Enhanced ContextMenu - Composite Component', () => {
  it('renders with all props correctly', () => {
    render(
      <EnhancedContextMenu
        trigger={<button>Enhanced Trigger</button>}
        variant='glass'
        size='lg'
        aaaMode={true}
        density='compact'
        className='custom-class'
      >
        <ContextMenuItem>Enhanced Item</ContextMenuItem>
      </EnhancedContextMenu>
    );

    expect(
      screen.getByRole('button', { name: 'Enhanced Trigger' })
    ).toBeInTheDocument();
  });

  it('calls onOpenChange when menu state changes', async () => {
    const onOpenChange = vi.fn();

    render(
      <EnhancedContextMenu
        trigger={
          <button data-testid='enhanced-trigger'>Enhanced Trigger</button>
        }
        onOpenChange={onOpenChange}
      >
        <ContextMenuItem>Enhanced Item</ContextMenuItem>
      </EnhancedContextMenu>
    );

    const trigger = screen.getByTestId('enhanced-trigger');
    await triggerContextMenu(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

// ===== FACTORY PATTERN TESTS =====

describe('Enhanced ContextMenu - Factory Patterns', () => {
  it('creates default context menu via factory', () => {
    const DefaultMenu = ContextMenuFactory.default({
      trigger: <button>Factory Default</button>,
      children: <ContextMenuItem>Factory Item</ContextMenuItem>,
    });

    render(DefaultMenu);
    expect(
      screen.getByRole('button', { name: 'Factory Default' })
    ).toBeInTheDocument();
  });

  it('creates glass context menu via factory', () => {
    const GlassMenu = ContextMenuFactory.glass({
      trigger: <button>Factory Glass</button>,
      children: <ContextMenuItem>Glass Item</ContextMenuItem>,
    });

    render(GlassMenu);
    expect(
      screen.getByRole('button', { name: 'Factory Glass' })
    ).toBeInTheDocument();
  });

  it('creates AAA context menu via factory', () => {
    const AAAMenu = ContextMenuFactory.aaa({
      trigger: <button>Factory AAA</button>,
      children: <ContextMenuItem>AAA Item</ContextMenuItem>,
    });

    render(AAAMenu);
    expect(
      screen.getByRole('button', { name: 'Factory AAA' })
    ).toBeInTheDocument();
  });

  it('creates compact context menu via factory', () => {
    const CompactMenu = ContextMenuFactory.compact({
      trigger: <button>Factory Compact</button>,
      children: <ContextMenuItem>Compact Item</ContextMenuItem>,
    });

    render(CompactMenu);
    expect(
      screen.getByRole('button', { name: 'Factory Compact' })
    ).toBeInTheDocument();
  });
});

// ===== ADVANCED FEATURES TESTS =====

describe('Enhanced ContextMenu - Advanced Features', () => {
  it('renders shortcuts correctly', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    expect(screen.getByText('⌘C')).toBeInTheDocument();
    expect(screen.getByText('⌘C')).toHaveClass('text-content-tertiary');
  });

  it('handles checkbox items with state', async () => {
    const onCheckedChange = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Toggle Option
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    const checkboxItem = screen.getByRole('menuitemcheckbox');
    fireEvent.click(checkboxItem);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles radio items with groups', async () => {
    const onValueChange = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioItem value='option1'>Option 1</ContextMenuRadioItem>
          <ContextMenuRadioItem value='option2'>Option 2</ContextMenuRadioItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    expect(
      screen.getByRole('menuitemradio', { name: 'Option 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitemradio', { name: 'Option 2' })
    ).toBeInTheDocument();
  });

  it('renders labels correctly', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem>Action Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toHaveClass('text-content-secondary');
  });

  it('handles submenus correctly', async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid='context-trigger'>
          Right click me
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Submenu Item</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId('context-trigger');
    await triggerContextMenu(trigger);

    const subTrigger = screen.getByText('More Options');
    await user.hover(subTrigger);

    await waitFor(() => {
      expect(screen.getByText('Submenu Item')).toBeInTheDocument();
    });
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced ContextMenu - Accessibility', () => {
  it('passes accessibility audit', async () => {
    const { container } = renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has correct ARIA attributes', async () => {
    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveAttribute('role', 'menu');
    expect(menu).toHaveAttribute('data-state', 'open');
  });

  it('supports high contrast mode', async () => {
    renderContextMenu('default', true);
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('forced-colors:bg-[ButtonFace]');
    expect(menu).toHaveClass('forced-colors:border-[ButtonBorder]');
  });

  it('respects reduced motion preferences', async () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderContextMenu();
    const trigger = screen.getByTestId('context-trigger');

    await triggerContextMenu(trigger);
    const menu = screen.getByRole('menu');

    expect(menu).toHaveClass('motion-reduce:transition-none');
    expect(menu).toHaveClass('motion-reduce:animate-none');
  });
});
