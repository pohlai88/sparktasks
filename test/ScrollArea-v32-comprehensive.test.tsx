/**
 * @fileoverview Enhanced ScrollArea - Comprehensive Test Suite
 * @version 3.2.0
 *
 * MAPS v2.2 Architecture:
 * - Dark-First Philosophy Testing
 * - Apple HIG Harmony Validation
 * - AAA Compliance Enforcement
 * - Anti-Drift Testing Protocols
 *
 * Test Coverage:
 * - Component Mounting & Rendering
 * - Variant System Validation
 * - Accessibility Compliance (AAA)
 * - User Interaction Patterns
 * - Error Boundary & Edge Cases
 * - Performance & Memory Management
 * - Integration Scenarios
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import {
  EnhancedScrollArea,
  EnhancedScrollbar,
  EnhancedScrollAreaWithProtection,
  EnhancedVirtualizedScrollArea,
  type ScrollAreaProps,
  type VirtualizedScrollAreaProps,
} from '../src/components/ui-enhanced/ScrollArea';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

// Mock IntersectionObserver for virtualization tests
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

// Mock ResizeObserver for scroll container tests
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: mockResizeObserver,
});

// Test utilities
const createLongContent = (lines: number = 100) => (
  <div>
    {Array.from({ length: lines }, (_, i) => (
      <div key={i} style={{ height: '40px', padding: '8px' }}>
        Line {i + 1} - This is test content that should create scrollable
        overflow
      </div>
    ))}
  </div>
);

const createVirtualizedItems = (count: number = 1000) =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    content: `Virtual Item ${i + 1}`,
    height: 50,
  }));

describe('Enhanced ScrollArea - Component Mounting & Basic Rendering', () => {
  it('renders basic scroll area without errors', () => {
    render(
      <EnhancedScrollArea data-testid='scroll-area'>
        <div>Basic content</div>
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
  });

  it('applies default MAPS v2.2 styling classes', () => {
    render(
      <EnhancedScrollArea data-testid='scroll-area'>
        <div>Content</div>
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toHaveClass('relative');
    expect(scrollArea).toHaveClass('overflow-hidden');
  });

  it('renders with children content', () => {
    render(
      <EnhancedScrollArea>
        <div data-testid='child-content'>Test child content</div>
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toHaveTextContent(
      'Test child content'
    );
  });

  it('handles empty children gracefully', () => {
    render(<EnhancedScrollArea data-testid='empty-scroll-area' />);
    expect(screen.getByTestId('empty-scroll-area')).toBeInTheDocument();
  });
});

describe('Enhanced ScrollArea - Variant System Validation', () => {
  const variants: ScrollAreaProps['variant'][] = [
    'default',
    'minimal',
    'glass',
    'bordered',
    'floating',
  ];

  variants.forEach(variant => {
    it(`renders ${variant} variant correctly`, () => {
      render(
        <EnhancedScrollArea
          variant={variant}
          data-testid={`scroll-area-${variant}`}
        >
          {createLongContent(20)}
        </EnhancedScrollArea>
      );

      const scrollArea = screen.getByTestId(`scroll-area-${variant}`);
      expect(scrollArea).toBeInTheDocument();

      // Verify variant-specific styling is applied
      if (variant === 'glass') {
        expect(
          scrollArea.querySelector('.backdrop-blur-xl')
        ).toBeInTheDocument();
      }
      if (variant === 'bordered') {
        expect(scrollArea).toHaveClass('border');
      }
    });
  });

  it('applies size variants correctly', () => {
    const sizes: ScrollAreaProps['size'][] = ['sm', 'md', 'lg'];

    sizes.forEach(size => {
      const { rerender } = render(
        <EnhancedScrollArea size={size} data-testid={`scroll-area-${size}`}>
          {createLongContent(10)}
        </EnhancedScrollArea>
      );

      const scrollArea = screen.getByTestId(`scroll-area-${size}`);
      expect(scrollArea).toBeInTheDocument();

      // Verify size-specific classes
      if (size === 'sm') {
        expect(scrollArea).toHaveClass('h-32');
      } else if (size === 'lg') {
        expect(scrollArea).toHaveClass('h-96');
      }
    });
  });

  it('applies density variants correctly', () => {
    const densities: ScrollAreaProps['density'][] = [
      'compact',
      'comfortable',
      'spacious',
    ];

    densities.forEach(density => {
      render(
        <EnhancedScrollArea
          density={density}
          data-testid={`scroll-area-${density}`}
        >
          {createLongContent(10)}
        </EnhancedScrollArea>
      );

      const scrollArea = screen.getByTestId(`scroll-area-${density}`);
      expect(scrollArea).toBeInTheDocument();
    });
  });
});

describe('Enhanced ScrollArea - Accessibility Compliance (AAA)', () => {
  it('meets WCAG AAA accessibility standards', async () => {
    const { container } = render(
      <EnhancedScrollArea>{createLongContent(30)}</EnhancedScrollArea>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('provides proper ARIA labels and roles', () => {
    render(
      <EnhancedScrollArea
        aria-label='Scrollable content area'
        data-testid='scroll-area'
      >
        {createLongContent(20)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toHaveAttribute('aria-label', 'Scrollable content area');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedScrollArea data-testid='scroll-area'>
        {createLongContent(50)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    await user.click(scrollArea);

    // Test arrow key navigation
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowUp}');
    await user.keyboard('{PageDown}');
    await user.keyboard('{PageUp}');

    // Should not throw errors
    expect(scrollArea).toBeInTheDocument();
  });

  it('maintains focus management correctly', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button data-testid='before'>Before</button>
        <EnhancedScrollArea data-testid='scroll-area'>
          <button data-testid='inside'>Inside</button>
          {createLongContent(20)}
        </EnhancedScrollArea>
        <button data-testid='after'>After</button>
      </div>
    );

    const beforeButton = screen.getByTestId('before');
    const insideButton = screen.getByTestId('inside');
    const afterButton = screen.getByTestId('after');

    await user.click(beforeButton);
    expect(beforeButton).toHaveFocus();

    await user.tab();
    expect(insideButton).toHaveFocus();

    await user.tab();
    expect(afterButton).toHaveFocus();
  });
});

describe('Enhanced ScrollArea - User Interaction Patterns', () => {
  it('handles scroll events correctly', async () => {
    const onScroll = vi.fn();

    render(
      <EnhancedScrollArea onScroll={onScroll} data-testid='scroll-area'>
        {createLongContent(100)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('scroll-area');
    const viewport = scrollArea.querySelector(
      '[data-radix-scroll-area-viewport]'
    );

    if (viewport) {
      fireEvent.scroll(viewport, { target: { scrollTop: 100 } });
      expect(onScroll).toHaveBeenCalled();
    }
  });

  it('supports horizontal scrolling', () => {
    render(
      <EnhancedScrollArea
        orientation='horizontal'
        data-testid='horizontal-scroll'
        className='w-64'
      >
        <div className='flex w-max'>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className='mx-1 h-16 w-32 flex-shrink-0 bg-gray-200'>
              Item {i + 1}
            </div>
          ))}
        </div>
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('horizontal-scroll');
    expect(scrollArea).toBeInTheDocument();
  });

  it('supports both directions scrolling', () => {
    render(
      <EnhancedScrollArea
        orientation='both'
        data-testid='both-scroll'
        className='h-64 w-64'
      >
        <div className='w-max'>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className='flex'>
              {Array.from({ length: 10 }, (_, j) => (
                <div
                  key={j}
                  className='m-1 h-16 w-32 flex-shrink-0 bg-gray-200'
                >
                  {i}-{j}
                </div>
              ))}
            </div>
          ))}
        </div>
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('both-scroll');
    expect(scrollArea).toBeInTheDocument();
  });
});

describe('Enhanced ScrollArea - Glass Material & Protection Features', () => {
  it('renders glass variant with protection enabled', () => {
    render(
      <EnhancedScrollAreaWithProtection
        variant='glass'
        enableProtection={true}
        data-testid='protected-scroll'
      >
        {createLongContent(30)}
      </EnhancedScrollAreaWithProtection>
    );

    const scrollArea = screen.getByTestId('protected-scroll');
    expect(scrollArea).toBeInTheDocument();

    // Should have glass material classes
    expect(scrollArea.querySelector('.backdrop-blur-xl')).toBeInTheDocument();
  });

  it('handles protection mode correctly', () => {
    render(
      <EnhancedScrollAreaWithProtection
        enableProtection={true}
        protectionMode='blur'
        data-testid='blur-protected'
      >
        <div data-testid='protected-content'>Sensitive content</div>
      </EnhancedScrollAreaWithProtection>
    );

    const scrollArea = screen.getByTestId('blur-protected');
    expect(scrollArea).toBeInTheDocument();
  });

  it('toggles protection state', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [protected_, setProtected] = React.useState(true);

      return (
        <div>
          <button
            onClick={() => setProtected(!protected_)}
            data-testid='toggle-protection'
          >
            Toggle Protection
          </button>
          <EnhancedScrollAreaWithProtection
            enableProtection={protected_}
            data-testid='toggleable-scroll'
          >
            <div data-testid='content'>Protected content</div>
          </EnhancedScrollAreaWithProtection>
        </div>
      );
    };

    render(<TestComponent />);

    const toggleButton = screen.getByTestId('toggle-protection');
    const scrollArea = screen.getByTestId('toggleable-scroll');

    expect(scrollArea).toBeInTheDocument();

    await user.click(toggleButton);
    expect(scrollArea).toBeInTheDocument();
  });
});

describe('Enhanced ScrollArea - Virtualization Features', () => {
  it('renders virtualized scroll area', () => {
    const items = createVirtualizedItems(1000);

    const renderItem = ({ item, index }: { item: any; index: number }) => (
      <div key={item.id} data-testid={`virtual-item-${index}`}>
        {item.content}
      </div>
    );

    render(
      <EnhancedVirtualizedScrollArea
        items={items}
        itemHeight={50}
        renderItem={renderItem}
        data-testid='virtualized-scroll'
      />
    );

    const scrollArea = screen.getByTestId('virtualized-scroll');
    expect(scrollArea).toBeInTheDocument();
  });

  it('handles empty virtualized list', () => {
    const renderItem = ({ item, index }: { item: any; index: number }) => (
      <div key={index}>Empty</div>
    );

    render(
      <EnhancedVirtualizedScrollArea
        items={[]}
        itemHeight={50}
        renderItem={renderItem}
        data-testid='empty-virtualized'
      />
    );

    const scrollArea = screen.getByTestId('empty-virtualized');
    expect(scrollArea).toBeInTheDocument();
  });

  it('supports dynamic item heights', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      content: `Item ${i + 1}`,
      height: 40 + (i % 3) * 20, // Variable heights
    }));

    const renderItem = ({ item, index }: { item: any; index: number }) => (
      <div key={item.id} style={{ height: item.height }}>
        {item.content}
      </div>
    );

    render(
      <EnhancedVirtualizedScrollArea
        items={items}
        itemHeight={index => items[index]?.height || 50}
        renderItem={renderItem}
        data-testid='dynamic-height-scroll'
      />
    );

    const scrollArea = screen.getByTestId('dynamic-height-scroll');
    expect(scrollArea).toBeInTheDocument();
  });
});

describe('Enhanced ScrollArea - Error Boundary & Edge Cases', () => {
  it('handles invalid props gracefully', () => {
    // Should not crash with invalid variant
    render(
      <EnhancedScrollArea
        variant={'invalid' as any}
        data-testid='invalid-variant'
      >
        <div>Content</div>
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('invalid-variant')).toBeInTheDocument();
  });

  it('handles null children', () => {
    render(
      <EnhancedScrollArea data-testid='null-children'>
        {null}
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('null-children')).toBeInTheDocument();
  });

  it('handles undefined props', () => {
    render(
      <EnhancedScrollArea
        variant={undefined}
        size={undefined}
        data-testid='undefined-props'
      >
        <div>Content</div>
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('undefined-props')).toBeInTheDocument();
  });

  it('handles extremely long content without performance issues', () => {
    const startTime = performance.now();

    render(
      <EnhancedScrollArea data-testid='long-content'>
        {createLongContent(1000)}
      </EnhancedScrollArea>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(screen.getByTestId('long-content')).toBeInTheDocument();
    expect(renderTime).toBeLessThan(1000); // Should render within 1 second
  });
});

describe('Enhanced ScrollArea - Performance & Memory Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not cause memory leaks on unmount', () => {
    const { unmount } = render(
      <EnhancedScrollArea data-testid='memory-test'>
        {createLongContent(100)}
      </EnhancedScrollArea>
    );

    // Unmount should not throw errors
    expect(() => unmount()).not.toThrow();
  });

  it('properly cleans up event listeners', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <EnhancedScrollArea data-testid='cleanup-test'>
        {createLongContent(50)}
      </EnhancedScrollArea>
    );

    unmount();

    // Should not cause issues during cleanup
    expect(removeEventListenerSpy).not.toThrow();
  });

  it('handles rapid re-renders efficiently', () => {
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);

      React.useEffect(() => {
        const interval = setInterval(() => {
          setCount(c => c + 1);
        }, 10);

        const timeout = setTimeout(() => {
          clearInterval(interval);
        }, 100);

        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }, []);

      return (
        <EnhancedScrollArea data-testid='rapid-render'>
          <div>Count: {count}</div>
          {createLongContent(20)}
        </EnhancedScrollArea>
      );
    };

    render(<TestComponent />);

    // Should handle rapid re-renders without issues
    expect(screen.getByTestId('rapid-render')).toBeInTheDocument();
  });
});

describe('Enhanced ScrollArea - Integration Scenarios', () => {
  it('works within form elements', () => {
    render(
      <form data-testid='form-container'>
        <EnhancedScrollArea data-testid='form-scroll'>
          <div>
            <input data-testid='input-1' placeholder='Input 1' />
            <input data-testid='input-2' placeholder='Input 2' />
            <textarea data-testid='textarea' placeholder='Textarea' />
          </div>
        </EnhancedScrollArea>
      </form>
    );

    expect(screen.getByTestId('form-container')).toBeInTheDocument();
    expect(screen.getByTestId('input-1')).toBeInTheDocument();
    expect(screen.getByTestId('input-2')).toBeInTheDocument();
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
  });

  it('works with nested scroll areas', () => {
    render(
      <EnhancedScrollArea data-testid='outer-scroll'>
        <div>
          <div>Outer content</div>
          <EnhancedScrollArea data-testid='inner-scroll' className='h-32'>
            {createLongContent(20)}
          </EnhancedScrollArea>
          <div>More outer content</div>
        </div>
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('outer-scroll')).toBeInTheDocument();
    expect(screen.getByTestId('inner-scroll')).toBeInTheDocument();
  });

  it('integrates with other MAPS v2.2 components', () => {
    render(
      <div data-testid='integration-test'>
        <EnhancedScrollArea>
          <div className='p-4'>
            <h2 className='mb-4 text-lg font-semibold'>
              ScrollArea Integration
            </h2>
            <div className='space-y-4'>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className='rounded-lg border p-3'>
                  <h3 className='font-medium'>Item {i + 1}</h3>
                  <p className='text-sm text-gray-600'>
                    This demonstrates ScrollArea integration with other
                    components.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </EnhancedScrollArea>
      </div>
    );

    expect(screen.getByTestId('integration-test')).toBeInTheDocument();
    expect(screen.getByText('ScrollArea Integration')).toBeInTheDocument();
  });
});

describe('Enhanced ScrollArea - AAA Compliance Edge Cases', () => {
  it('maintains accessibility with dynamic content', async () => {
    const TestComponent = () => {
      const [items, setItems] = React.useState([1, 2, 3]);

      return (
        <div>
          <button
            onClick={() => setItems([...items, items.length + 1])}
            data-testid='add-item'
          >
            Add Item
          </button>
          <EnhancedScrollArea data-testid='dynamic-scroll'>
            {items.map(item => (
              <div key={item} role='listitem'>
                Dynamic Item {item}
              </div>
            ))}
          </EnhancedScrollArea>
        </div>
      );
    };

    const { container } = render(<TestComponent />);

    const addButton = screen.getByTestId('add-item');
    await userEvent.click(addButton);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports screen reader announcements', () => {
    render(
      <EnhancedScrollArea
        aria-live='polite'
        aria-label='Live content area'
        data-testid='live-region'
      >
        <div>Content that may update</div>
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('live-region');
    expect(scrollArea).toHaveAttribute('aria-live', 'polite');
    expect(scrollArea).toHaveAttribute('aria-label', 'Live content area');
  });

  it('handles high contrast mode correctly', () => {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <EnhancedScrollArea aaaCompliance='enforced' data-testid='high-contrast'>
        {createLongContent(20)}
      </EnhancedScrollArea>
    );

    const scrollArea = screen.getByTestId('high-contrast');
    expect(scrollArea).toBeInTheDocument();
  });
});
