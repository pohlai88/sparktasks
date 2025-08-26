/**
 * Enhanced Popover Component Tests - MAPS v2.2 Testing Strategy
 *
 * TESTING PHILOSOPHY:
 * - User-centric approach: Test behavior, not implementation
 * - Accessibility-first: WCAG AAA compliance validation
 * - Apple HIG patterns: Interaction and positioning testing
 * - Comprehensive coverage: All variants, sizes, and edge cases
 *
 * TESTING MATRIX:
 * - Radix behavior: State management, ARIA, positioning, focus management
 * - MAPS styling: Variants, sizes, glass materials
 * - Accessibility: Screen reader, keyboard, focus management
 * - User interactions: Click, keyboard, outside clicks, escape key
 */

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverWithTrigger,
  PopoverClose,
  PopoverArrow,
} from '@/components/ui-enhanced/Popover';

// ===== TEST SETUP =====

afterEach(() => {
  cleanup();
});

const TestTrigger = () => <button>Open Popover</button>;
const TestContent = () => <div>Popover content</div>;

// ===== CORE FUNCTIONALITY TESTS =====

describe('Enhanced Popover - Core Functionality', () => {
  it('renders trigger and opens popover on click', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });
    expect(trigger).toBeInTheDocument();

    // Content should not be visible initially
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();

    // Click to open
    await user.click(trigger);

    // Content should be visible after click
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('handles controlled state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });

    // Click to open
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('handles default open state', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    // Content should be visible by default
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('closes on escape key by default', async () => {
    const user = userEvent.setup();

    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });

  it('closes on outside click by default', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <div data-testid='outside'>Outside element</div>
        <Popover defaultOpen>
          <PopoverTrigger>
            <TestTrigger />
          </PopoverTrigger>
          <PopoverContent>
            <TestContent />
          </PopoverContent>
        </Popover>
      </div>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));

    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced Popover - Accessibility', () => {
  it('has proper ARIA attributes', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger aria-label='Show details'>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('role', 'dialog');
  });

  it('manages focus correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <button>First button</button>
            <button>Second button</button>
          </div>
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });

    await user.click(trigger);

    // Focus should move to content
    const content = screen.getByText('First button').closest('[role="dialog"]');
    expect(content).toHaveFocus();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <button>First button</button>
            <button>Second button</button>
          </div>
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });

    // Open with Enter key
    trigger.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('First button')).toBeInTheDocument();

    // Tab to navigate within popover
    await user.tab();
    expect(screen.getByText('First button')).toHaveFocus();

    await user.tab();
    expect(screen.getByText('Second button')).toHaveFocus();
  });

  it('has focus-visible styles applied', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });
    expect(trigger).toHaveClass('focus-visible:ring-2');
    expect(trigger).toHaveClass('focus-visible:ring-accent');

    await user.click(trigger);

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('focus:outline-none');
    expect(content).toHaveClass('focus-visible:ring-2');
  });
});

// ===== VARIANT TESTS =====

describe('Enhanced Popover - Variants', () => {
  it('renders default variant correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent variant='default'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('bg-background');
    expect(content).toHaveClass('border-border');
  });

  it('renders glass variant correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent variant='glass'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('backdrop-blur-md');
    expect(content).toHaveClass('backdrop-saturate-150');
    expect(content).toHaveClass('bg-background/80');
  });

  it('renders elevated variant correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent variant='elevated'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('bg-card');
    expect(content).toHaveClass('shadow-xl');
  });
});

// ===== SIZE TESTS =====

describe('Enhanced Popover - Sizes', () => {
  it('renders small size correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent size='sm'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('min-w-[6rem]');
    expect(content).toHaveClass('max-w-xs');
    expect(content).toHaveClass('p-3');
    expect(content).toHaveClass('text-xs');
  });

  it('renders large size correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent size='lg'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('min-w-[12rem]');
    expect(content).toHaveClass('max-w-md');
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('text-base');
  });

  it('renders extra large size correctly', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent size='xl'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('min-w-[16rem]');
    expect(content).toHaveClass('max-w-lg');
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('text-base');
  });
});

// ===== TRIGGER VARIANT TESTS =====

describe('Enhanced Popover - Trigger Variants', () => {
  it('renders default trigger variant', () => {
    render(
      <PopoverTrigger variant='default'>
        <TestTrigger />
      </PopoverTrigger>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('bg-transparent');
    expect(trigger).toHaveClass('text-foreground');
    expect(trigger).toHaveClass('hover:bg-accent/10');
  });

  it('renders outline trigger variant', () => {
    render(
      <PopoverTrigger variant='outline'>
        <TestTrigger />
      </PopoverTrigger>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('border');
    expect(trigger).toHaveClass('border-input');
    expect(trigger).toHaveClass('bg-background');
  });

  it('renders ghost trigger variant', () => {
    render(
      <PopoverTrigger variant='ghost'>
        <TestTrigger />
      </PopoverTrigger>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('bg-transparent');
    expect(trigger).toHaveClass('text-foreground');
  });
});

// ===== COMPOSITE COMPONENT TESTS =====

describe('Enhanced PopoverWithTrigger', () => {
  it('renders complete popover with trigger', async () => {
    const user = userEvent.setup();

    render(
      <PopoverWithTrigger trigger={<TestTrigger />}>
        <TestContent />
      </PopoverWithTrigger>
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('handles trigger styling props', async () => {
    const user = userEvent.setup();

    render(
      <PopoverWithTrigger
        trigger={<TestTrigger />}
        triggerVariant='outline'
        triggerSize='lg'
        triggerClassName='custom-trigger'
      >
        <TestContent />
      </PopoverWithTrigger>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('border');
    expect(trigger).toHaveClass('h-10');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('handles escape key behavior', async () => {
    const user = userEvent.setup();

    render(
      <PopoverWithTrigger
        trigger={<TestTrigger />}
        closeOnEscape={false}
        defaultOpen
      >
        <TestContent />
      </PopoverWithTrigger>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    // Should remain open since closeOnEscape is false
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('handles outside click behavior', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <div data-testid='outside'>Outside</div>
        <PopoverWithTrigger
          trigger={<TestTrigger />}
          closeOnOutsideClick={false}
          defaultOpen
        >
          <TestContent />
        </PopoverWithTrigger>
      </div>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));

    // Should remain open since closeOnOutsideClick is false
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });
});

// ===== CLOSE BUTTON TESTS =====

describe('Enhanced PopoverClose', () => {
  it('renders close button and closes popover', async () => {
    const user = userEvent.setup();

    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <TestContent />
            <PopoverClose>Close</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('absolute');
    expect(closeButton).toHaveClass('right-2');
    expect(closeButton).toHaveClass('top-2');

    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });
});

// ===== ARROW TESTS =====

describe('Enhanced PopoverArrow', () => {
  it('renders arrow with proper styling', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    // Arrow should be present in the DOM
    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    const arrow = content?.querySelector('svg');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveClass('fill-popover');
    expect(arrow).toHaveClass('stroke-border');
  });
});

// ===== POSITIONING TESTS =====

describe('Enhanced Popover - Positioning', () => {
  it('handles positioning props', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent
          sideOffset={8}
          alignOffset={4}
          avoidCollisions={true}
          collisionPadding={20}
        >
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    // Content should be rendered (positioning is handled by Radix)
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });
});

// ===== APPLE HIG COMPLIANCE TESTS =====

describe('Enhanced Popover - Apple HIG Compliance', () => {
  it('uses proper spacing based on 8pt grid', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger size='default'>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent size='default'>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('h-9'); // 36px = multiple of 8pt

    await user.click(trigger);

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('p-4'); // 16px = 2 * 8pt
  });

  it('implements proper motion patterns', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('data-[state=open]:animate-in');
    expect(content).toHaveClass('data-[state=closed]:animate-out');
    expect(content).toHaveClass('motion-reduce:animate-none');
  });

  it('maintains consistent interaction patterns', () => {
    render(
      <PopoverTrigger>
        <TestTrigger />
      </PopoverTrigger>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('transition-colors');
    expect(trigger).toHaveClass('duration-200');
    expect(trigger).toHaveClass('ease-out');
  });

  it('uses Apple-style rounded corners', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>
          <TestTrigger />
        </PopoverTrigger>
        <PopoverContent>
          <TestContent />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button'));

    const content = screen
      .getByText('Popover content')
      .closest('[role="dialog"]');
    expect(content).toHaveClass('rounded-md');
  });
});
