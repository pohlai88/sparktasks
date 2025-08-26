import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import {
  EnhancedScrollArea,
  EnhancedScrollAreaWithProtection,
  EnhancedVirtualizedScrollArea,
} from '../../src/components/ui-enhanced/ScrollArea';

expect.extend(toHaveNoViolations);

const createContent = (lines: number = 20) => (
  <div>
    {Array.from({ length: lines }, (_, i) => (
      <div key={i} className='py-2'>
        Content line {i + 1}
      </div>
    ))}
  </div>
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('EnhancedScrollArea - Basic Functionality', () => {
  it('renders with default props', () => {
    render(
      <EnhancedScrollArea data-testid='scroll-area'>
        {createContent(10)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toBeInTheDocument();
    expect(scrollArea).toHaveClass(
      'relative',
      'overflow-hidden',
      'bg-background'
    );
  });

  it('applies variant classes correctly', () => {
    const variants = ['default', 'ghost', 'glass', 'elevated', 'aaa'] as const;

    variants.forEach(variant => {
      const { unmount } = render(
        <EnhancedScrollArea variant={variant} data-testid={`scroll-${variant}`}>
          {createContent(5)}
        </EnhancedScrollArea>
      );

      const scrollArea = screen.getByTestId(`scroll-${variant}`);

      if (variant === 'ghost') {
        expect(scrollArea).toHaveClass('bg-transparent', 'border-transparent');
      } else if (variant === 'glass') {
        expect(scrollArea).toHaveClass(
          'backdrop-blur-sm',
          'backdrop-saturate-150'
        );
      } else if (variant === 'elevated') {
        expect(scrollArea).toHaveClass(
          'bg-background-elevated',
          'shadow-elevation-sm'
        );
      } else if (variant === 'aaa') {
        expect(scrollArea).toHaveClass('border-border-strong');
      }

      unmount();
    });
  });

  it('applies size classes correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full', 'auto'] as const;
    const expectedClasses = [
      'h-32',
      'h-48',
      'h-64',
      'h-96',
      'h-full',
      'h-auto',
    ];

    sizes.forEach((size, index) => {
      const { unmount } = render(
        <EnhancedScrollArea size={size} data-testid={`scroll-${size}`}>
          {createContent(5)}
        </EnhancedScrollArea>
      );

      const scrollArea = screen.getByTestId(`scroll-${size}`);
      expect(scrollArea).toHaveClass(expectedClasses[index]);
      unmount();
    });
  });

  it('applies density classes correctly', () => {
    const { rerender } = render(
      <EnhancedScrollArea density='comfortable' data-testid='scroll-density'>
        {createContent(5)}
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('scroll-density')).toHaveClass('p-4');

    rerender(
      <EnhancedScrollArea density='compact' data-testid='scroll-density'>
        {createContent(5)}
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('scroll-density')).toHaveClass('p-2');
  });

  it('enforces AAA compliance when enabled', () => {
    render(
      <EnhancedScrollArea enforceAAA={true} data-testid='aaa-scroll'>
        {createContent(10)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('aaa-scroll');
    expect(scrollArea).toHaveClass('border-border-strong');
  });
});

describe('EnhancedScrollArea - Scrolling Behavior', () => {
  it('enables smooth scrolling by default', () => {
    render(
      <EnhancedScrollArea data-testid='smooth-scroll'>
        {createContent(50)}
      </EnhancedScrollArea>
    );

    const viewport = screen
      .getByTestId('smooth-scroll')
      .querySelector('[data-radix-scroll-area-viewport]');
    expect(viewport).toHaveClass('scroll-smooth');
  });

  it('can disable smooth scrolling', () => {
    render(
      <EnhancedScrollArea smoothScrolling={false} data-testid='auto-scroll'>
        {createContent(50)}
      </EnhancedScrollArea>
    );

    const viewport = screen
      .getByTestId('auto-scroll')
      .querySelector('[data-radix-scroll-area-viewport]');
    expect(viewport).toHaveClass('scroll-auto');
  });

  it('handles scroll events', () => {
    render(
      <EnhancedScrollArea data-testid='scroll-events'>
        {createContent(100)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-events');
    const viewport = scrollArea.querySelector(
      '[data-radix-scroll-area-viewport]'
    );

    expect(viewport).toBeInTheDocument();

    if (viewport) {
      fireEvent.scroll(viewport, { target: { scrollTop: 100 } });
      expect(viewport).toBeInTheDocument();
    }
  });
});

describe('EnhancedScrollArea - Accessibility', () => {
  it('meets accessibility standards', async () => {
    const { container } = render(
      <EnhancedScrollArea aria-label='Scrollable content'>
        {createContent(20)}
      </EnhancedScrollArea>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports ARIA attributes', () => {
    render(
      <EnhancedScrollArea
        aria-label='Test scroll area'
        aria-describedby='scroll-desc'
        data-testid='aria-scroll'
      >
        <div id='scroll-desc'>Scroll to see more content</div>
        {createContent(10)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('aria-scroll');
    expect(scrollArea).toHaveAttribute('aria-label', 'Test scroll area');
    expect(scrollArea).toHaveAttribute('aria-describedby', 'scroll-desc');
  });

  it('supports keyboard navigation', async () => {
    render(
      <EnhancedScrollArea data-testid='keyboard-scroll'>
        <button>Focusable element</button>
        {createContent(30)}
      </EnhancedScrollArea>
    );

    const button = screen.getByRole('button');
    button.focus();

    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBeTruthy();
  });
});

describe('EnhancedScrollAreaWithProtection - Protection Features', () => {
  it('renders with protection wrapper', () => {
    render(
      <EnhancedScrollAreaWithProtection
        variant='glass'
        protectionLevel='medium'
        data-testid='protected-scroll'
      >
        {createContent(10)}
      </EnhancedScrollAreaWithProtection>
    );

    const scrollArea = screen.getByTestId('protected-scroll');
    expect(scrollArea).toBeInTheDocument();
    expect(scrollArea).toHaveClass('backdrop-blur-sm');
  });

  it('applies protection levels correctly', () => {
    const levels = ['light', 'medium', 'strong'] as const;

    levels.forEach(level => {
      const { unmount } = render(
        <EnhancedScrollAreaWithProtection
          variant='glass'
          protectionLevel={level}
          data-testid={`protection-${level}`}
        >
          {createContent(5)}
        </EnhancedScrollAreaWithProtection>
      );

      const scrollArea = screen.getByTestId(`protection-${level}`);
      expect(scrollArea).toBeInTheDocument();
      unmount();
    });
  });
});

describe('EnhancedVirtualizedScrollArea - Virtualization', () => {
  const testItems = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    content: `Item ${i + 1}`,
  }));

  const renderItem = (item: unknown, index: number) => (
    <div key={index} data-testid={`item-${index}`}>
      {(item as (typeof testItems)[0]).content}
    </div>
  );

  it('renders virtualized content', () => {
    render(
      <EnhancedVirtualizedScrollArea
        items={testItems}
        itemHeight={50}
        renderItem={renderItem}
        data-testid='virtualized-scroll'
      >
        <div />
      </EnhancedVirtualizedScrollArea>
    );

    const scrollArea = screen.getByTestId('virtualized-scroll');
    expect(scrollArea).toBeInTheDocument();
  });

  it('handles empty item list', () => {
    render(
      <EnhancedVirtualizedScrollArea
        items={[]}
        itemHeight={50}
        renderItem={renderItem}
        data-testid='empty-virtualized'
      >
        <div />
      </EnhancedVirtualizedScrollArea>
    );

    const scrollArea = screen.getByTestId('empty-virtualized');
    expect(scrollArea).toBeInTheDocument();
  });

  it('uses custom overscan value', () => {
    render(
      <EnhancedVirtualizedScrollArea
        items={testItems.slice(0, 100)}
        itemHeight={50}
        renderItem={renderItem}
        overscan={10}
        data-testid='overscan-virtualized'
      >
        <div />
      </EnhancedVirtualizedScrollArea>
    );

    const scrollArea = screen.getByTestId('overscan-virtualized');
    expect(scrollArea).toBeInTheDocument();
  });
});

describe('EnhancedScrollArea - Edge Cases', () => {
  it('handles null children gracefully', () => {
    render(
      <EnhancedScrollArea data-testid='null-children'>
        {null}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('null-children');
    expect(scrollArea).toBeInTheDocument();
  });

  it('handles undefined props gracefully', () => {
    render(
      <EnhancedScrollArea
        variant={undefined}
        size={undefined}
        density={undefined}
        data-testid='undefined-props'
      >
        {createContent(5)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('undefined-props');
    expect(scrollArea).toBeInTheDocument();
    expect(scrollArea).toHaveClass('h-48', 'p-4');
  });

  it('unmounts without errors', () => {
    const { unmount } = render(
      <EnhancedScrollArea data-testid='unmount-test'>
        {createContent(20)}
      </EnhancedScrollArea>
    );

    expect(() => unmount()).not.toThrow();
  });
});

describe('EnhancedScrollArea - Integration', () => {
  it('works with form elements', () => {
    render(
      <form>
        <EnhancedScrollArea data-testid='form-scroll'>
          <input type='text' placeholder='Test input' />
          <textarea placeholder='Test textarea' />
          {createContent(10)}
        </EnhancedScrollArea>
      </form>
    );

    const scrollArea = screen.getByTestId('form-scroll');
    const input = screen.getByPlaceholderText('Test input');
    const textarea = screen.getByPlaceholderText('Test textarea');

    expect(scrollArea).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
  });

  it('supports nested scroll areas', () => {
    render(
      <EnhancedScrollArea data-testid='outer-scroll'>
        <div>
          <h2>Outer content</h2>
          <EnhancedScrollArea size='sm' data-testid='inner-scroll'>
            {createContent(15)}
          </EnhancedScrollArea>
        </div>
      </EnhancedScrollArea>
    );

    const outerScroll = screen.getByTestId('outer-scroll');
    const innerScroll = screen.getByTestId('inner-scroll');

    expect(outerScroll).toBeInTheDocument();
    expect(innerScroll).toBeInTheDocument();
    expect(innerScroll).toHaveClass('h-32');
  });

  it('works with dynamic content updates', () => {
    const DynamicContent = () => {
      const [items, setItems] = React.useState(['Item 1', 'Item 2']);

      return (
        <div>
          <button
            onClick={() =>
              setItems(prev => [...prev, `Item ${prev.length + 1}`])
            }
            data-testid='add-item'
          >
            Add Item
          </button>
          <EnhancedScrollArea data-testid='dynamic-scroll'>
            {items.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </EnhancedScrollArea>
        </div>
      );
    };

    render(<DynamicContent />);

    const addButton = screen.getByTestId('add-item');
    const scrollArea = screen.getByTestId('dynamic-scroll');

    expect(scrollArea).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });
});
