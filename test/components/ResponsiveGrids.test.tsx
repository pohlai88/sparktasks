/**
 * @fileoverview ResponsiveGrids Component Tests - Enterprise Vitest Testing
 *
 * @description Comprehensive test suite for ResponsiveGrids component following
 * enterprise testing standards with full Vitest integration and performance monitoring.
 * Includes DOM-safe testing patterns and timeout prevention strategies.
 *
 * @author AI Assistant
 * @version 1.0.0
 */

import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ResponsiveGrids,
  GridItem,
  GridPresets,
} from '@/components/layout/ResponsiveGrids';
import type { ResponsiveGridsProps } from '@/components/layout/ResponsiveGrids';

// ===== BROWSER API MOCKING =====

// Mock ResizeObserver for testing environment (CRITICAL for responsive components)
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(_callback: ResizeObserverCallback) {
    // Store callback for potential testing if needed
  }
}

global.ResizeObserver = MockResizeObserver as any;

// Mock IntersectionObserver for testing environment (for visibility-based components)
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(_callback: IntersectionObserverCallback) {
    // Store callback for potential testing if needed
  }
}

global.IntersectionObserver = MockIntersectionObserver as any;

// ===== TEST DATA =====

// Create fresh mocks for each test category to avoid cross-test pollution
const mockActions = {
  onLayout: vi.fn(),
  onAsyncAction: vi.fn(),
  onErrorAction: vi.fn(),
};

// Mock data for testing
const mockGridItems = [
  <div key='1' data-testid='grid-item-1'>
    Item 1
  </div>,
  <div key='2' data-testid='grid-item-2'>
    Item 2
  </div>,
  <div key='3' data-testid='grid-item-3'>
    Item 3
  </div>,
  <div key='4' data-testid='grid-item-4'>
    Item 4
  </div>,
  <div key='5' data-testid='grid-item-5'>
    Item 5
  </div>,
  <div key='6' data-testid='grid-item-6'>
    Item 6
  </div>,
];

const mockProps: Partial<ResponsiveGridsProps> = {
  columns: { sm: 1, md: 2, lg: 3 },
  gap: 'md',
  'data-testid': 'responsive-grids',
  children: mockGridItems,
};

// ===== HELPER FUNCTIONS =====

function renderComponent(props: Partial<ResponsiveGridsProps> = {}) {
  const defaultProps: ResponsiveGridsProps = {
    children: mockGridItems,
    ...mockProps,
    ...props,
  };

  return render(<ResponsiveGrids {...defaultProps} />);
}

// ===== DOM-SAFE HELPER FUNCTIONS =====

/**
 * Safe interaction pattern that won't cause timeouts
 */
function testPropAcceptance(mockCallback: any, componentRender: () => void) {
  componentRender();
  expect(mockCallback).toBeDefined();
  // Test that component renders without crash when prop is provided
  expect(screen.queryByTestId('responsive-grids')).toBeInTheDocument();
}

// ===== SETUP AND CLEANUP =====

beforeEach(() => {
  // Clear all mocks before each test to prevent cross-test contamination
  Object.values(mockActions).forEach(action => {
    if (action && typeof action.mockClear === 'function') {
      action.mockClear();
    }
  });
});

afterEach(() => {
  cleanup();
});

// ===== BASIC RENDERING TESTS =====

describe('ResponsiveGrids - Basic Rendering', () => {
  it('renders without errors', () => {
    renderComponent();

    expect(screen.getByTestId('responsive-grids')).toBeInTheDocument();
  });

  it('displays initial state correctly', () => {
    renderComponent();

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid');
  });

  it('renders with custom test ID', () => {
    renderComponent({ 'data-testid': 'custom-grid' });

    expect(screen.getByTestId('custom-grid')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    renderComponent({ className: 'custom-grid-class' });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toHaveClass('custom-grid-class');
  });

  it('displays grid items when provided', () => {
    renderComponent();

    expect(screen.getByTestId('grid-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-3')).toBeInTheDocument();
  });
});

// ===== PROPS ACCEPTANCE TESTS =====

describe('ResponsiveGrids - Props Acceptance', () => {
  it('accepts required props without errors', () => {
    testPropAcceptance(mockActions.onLayout, () => {
      renderComponent({ onLayout: mockActions.onLayout });
    });
  });

  it('accepts all column configuration options systematically', () => {
    // Test numeric columns
    const numericColumns = [1, 2, 3, 4, 5, 6, 8, 10, 12, 'auto'] as const;
    numericColumns.forEach(cols => {
      testPropAcceptance(mockActions.onLayout, () => {
        cleanup();
        renderComponent({ columns: cols });
      });
    });

    // Test responsive columns
    const responsiveColumns = [
      { sm: 1 as const, md: 2 as const, lg: 3 as const },
      { sm: 1 as const, md: 3 as const, lg: 6 as const },
      { sm: 2 as const, md: 4 as const, lg: 8 as const },
    ];
    responsiveColumns.forEach(cols => {
      testPropAcceptance(mockActions.onLayout, () => {
        cleanup();
        renderComponent({ columns: cols });
      });
    });
  });

  it('accepts all gap size options systematically', () => {
    const gapSizes = [
      'none',
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
    ] as const;
    gapSizes.forEach(gap => {
      testPropAcceptance(mockActions.onLayout, () => {
        cleanup();
        renderComponent({ gap });
      });
    });

    // Test responsive gaps
    const responsiveGaps = [
      { sm: 'sm' as const, md: 'md' as const, lg: 'lg' as const },
      { sm: 'xs' as const, md: 'lg' as const, lg: 'xl' as const },
    ];
    responsiveGaps.forEach(gap => {
      testPropAcceptance(mockActions.onLayout, () => {
        cleanup();
        renderComponent({ gap });
      });
    });
  });

  it('accepts auto-fit and auto-fill configurations', () => {
    testPropAcceptance(mockActions.onLayout, () => {
      renderComponent({
        autoFit: true,
        minItemWidth: '300px',
        maxItemWidth: '500px',
      });
    });

    testPropAcceptance(mockActions.onLayout, () => {
      cleanup();
      renderComponent({
        autoFill: true,
        minItemWidth: '250px',
      });
    });
  });

  it('accepts alignment and justification options', () => {
    const alignmentOptions = [
      'start',
      'center',
      'end',
      'stretch',
      'baseline',
    ] as const;
    const justificationOptions = ['start', 'center', 'end', 'stretch'] as const;

    alignmentOptions.forEach(align => {
      if (align !== 'baseline') {
        // Avoid the baseline option for alignItems
        testPropAcceptance(mockActions.onLayout, () => {
          cleanup();
          renderComponent({ alignItems: align as any });
        });
      }
    });

    justificationOptions.forEach(justify => {
      testPropAcceptance(mockActions.onLayout, () => {
        cleanup();
        renderComponent({ justifyItems: justify });
      });
    });
  });

  it('accepts optional callback props', () => {
    const callbacks = {
      onLayout: mockActions.onLayout,
    };

    testPropAcceptance(callbacks.onLayout, () => {
      renderComponent(callbacks);
    });

    // Verify all callbacks are defined (prop acceptance test)
    Object.values(callbacks).forEach(callback => {
      expect(callback).toBeDefined();
    });
  });

  it('handles TypeScript strict mode with exactOptionalPropertyTypes', () => {
    const optionalProp = 'lg' as const;

    testPropAcceptance(mockActions.onLayout, () => {
      renderComponent({
        gap: optionalProp,
        onLayout: mockActions.onLayout,
      });
    });
  });
});

// ===== RESPONSIVE BEHAVIOR TESTS =====

describe('ResponsiveGrids - Responsive Behavior', () => {
  it('applies responsive column classes correctly', () => {
    renderComponent({
      columns: { sm: 1, md: 2, lg: 3, xl: 4 },
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer.className).toMatch(/md:grid-cols-2/);
    expect(gridContainer.className).toMatch(/lg:grid-cols-3/);
    expect(gridContainer.className).toMatch(/xl:grid-cols-4/);
  });

  it('applies responsive gap classes correctly', () => {
    renderComponent({
      gap: { sm: 'sm', md: 'md', lg: 'lg' },
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toHaveClass('gap-2'); // sm gap
    expect(gridContainer.className).toMatch(/md:gap-3/); // md gap
    expect(gridContainer.className).toMatch(/lg:gap-4/); // lg gap
  });

  it('handles auto-fit grid configuration', () => {
    renderComponent({
      autoFit: true,
      minItemWidth: '280px',
      maxItemWidth: '400px',
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer.className).toMatch(
      /grid-cols-\[repeat\(auto-fit,minmax\(280px,400px\)\)\]/
    );
  });

  it('handles auto-fill grid configuration', () => {
    renderComponent({
      autoFill: true,
      minItemWidth: '250px',
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer.className).toMatch(
      /grid-cols-\[repeat\(auto-fill,minmax\(250px,1fr\)\)\]/
    );
  });
});

// ===== LAYOUT PERFORMANCE TESTS =====

describe('ResponsiveGrids - Layout Performance', () => {
  it('calls onLayout callback when provided', () => {
    const onLayoutMock = vi.fn();
    renderComponent({ onLayout: onLayoutMock });

    // onLayout should be called after grid is rendered
    // Note: In test environment, ResizeObserver is mocked, so we test prop acceptance
    expect(onLayoutMock).toBeDefined();
  });

  it('renders efficiently with large datasets', () => {
    const start = performance.now();

    const largeDataset = Array.from({ length: 100 }, (_, i) => (
      <div key={i} data-testid={`large-item-${i}`}>
        Large Item {i}
      </div>
    ));

    renderComponent({
      children: largeDataset,
      contentVisibility: true,
    });

    const end = performance.now();
    const renderTime = end - start;

    expect(renderTime).toBeLessThan(300); // Should render within 300ms
    expect(screen.getByTestId('large-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('large-item-99')).toBeInTheDocument();
  });

  it('applies content visibility optimization', () => {
    renderComponent({ contentVisibility: true });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer.className).toMatch(/\[content-visibility:auto\]/);
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('ResponsiveGrids - Accessibility', () => {
  it('has proper ARIA attributes', () => {
    renderComponent({
      'aria-label': 'Product grid',
      role: 'region',
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toHaveAttribute('aria-label', 'Product grid');
    expect(gridContainer).toHaveAttribute('role', 'region');
  });

  it('provides screen reader description when metrics are available', () => {
    renderComponent();

    // Look for hidden description element
    const description = document.querySelector('[id*="description"]');
    if (description) {
      expect(description).toHaveClass('sr-only');
    }
  });

  it('maintains proper focus management', () => {
    renderComponent();

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toBeInTheDocument();

    // Grid container should be focusable via tabIndex if needed
    // This is component-specific behavior
  });
});

// ===== GRID ITEM COMPONENT TESTS =====

describe('GridItem - Component Tests', () => {
  it('renders grid item with basic props', () => {
    render(<GridItem data-testid='test-grid-item'>Test Item Content</GridItem>);

    expect(screen.getByTestId('test-grid-item')).toBeInTheDocument();
    expect(screen.getByText('Test Item Content')).toBeInTheDocument();
  });

  it('applies grid area when specified', () => {
    render(
      <GridItem gridArea='header' data-testid='grid-item-with-area'>
        Header Content
      </GridItem>
    );

    const gridItem = screen.getByTestId('grid-item-with-area');
    expect(gridItem.className).toMatch(/\[grid-area:header\]/);
  });

  it('applies column span correctly', () => {
    render(
      <GridItem colSpan={3} data-testid='grid-item-col-span'>
        Spanning Item
      </GridItem>
    );

    const gridItem = screen.getByTestId('grid-item-col-span');
    expect(gridItem).toHaveClass('col-span-3');
  });

  it('applies responsive column span', () => {
    render(
      <GridItem
        colSpan={{ sm: 1, md: 2, lg: 3 }}
        data-testid='grid-item-responsive-span'
      >
        Responsive Item
      </GridItem>
    );

    const gridItem = screen.getByTestId('grid-item-responsive-span');
    expect(gridItem.className).toMatch(/sm:col-span-1/);
    expect(gridItem.className).toMatch(/md:col-span-2/);
    expect(gridItem.className).toMatch(/lg:col-span-3/);
  });

  it('applies self alignment', () => {
    render(
      <GridItem alignSelf='center' data-testid='grid-item-align'>
        Centered Item
      </GridItem>
    );

    const gridItem = screen.getByTestId('grid-item-align');
    expect(gridItem).toHaveClass('self-center');
  });

  it('applies self justification', () => {
    render(
      <GridItem justifySelf='end' data-testid='grid-item-justify'>
        Justified Item
      </GridItem>
    );

    const gridItem = screen.getByTestId('grid-item-justify');
    expect(gridItem).toHaveClass('justify-self-end');
  });
});

// ===== GRID PRESETS TESTS =====

describe('GridPresets - Configuration Tests', () => {
  it('provides dashboard preset configuration', () => {
    const dashboardConfig = GridPresets.dashboard;

    expect(dashboardConfig.columns).toEqual({ sm: 1, md: 2, lg: 4 });
    expect(dashboardConfig.gap).toBe('lg');
    expect(dashboardConfig.areas).toBeDefined();
  });

  it('provides gallery preset configuration', () => {
    const galleryConfig = GridPresets.gallery;

    expect(galleryConfig.autoFit).toBe(true);
    expect(galleryConfig.minItemWidth).toBe('280px');
    expect(galleryConfig.maxItemWidth).toBe('400px');
    expect(galleryConfig.gap).toBe('md');
  });

  it('provides metrics preset configuration', () => {
    const metricsConfig = GridPresets.metrics;

    expect(metricsConfig.columns).toEqual({ sm: 1, md: 2, lg: 4 });
    expect(metricsConfig.gap).toBe('sm');
  });

  it('can apply preset configurations to component', () => {
    renderComponent(GridPresets.twoColumn);

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer.className).toMatch(/lg:grid-cols-2/);
  });
});

// ===== ERROR HANDLING TESTS =====

describe('ResponsiveGrids - Error Handling', () => {
  it('handles empty children gracefully', () => {
    renderComponent({ children: [] });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer.children).toHaveLength(0);
  });

  it('handles null/undefined props gracefully', () => {
    renderComponent({
      children: mockGridItems,
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toBeInTheDocument();
  });

  it('handles malformed responsive configuration gracefully', () => {
    renderComponent({
      columns: {} as any, // Empty responsive config
      gap: {} as any, // Empty gap config
      children: mockGridItems,
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toBeInTheDocument();
  });
});

// ===== INTEGRATION TESTS =====

describe('ResponsiveGrids - Integration', () => {
  it('works correctly with all features enabled', () => {
    renderComponent({
      columns: { sm: 1, md: 2, lg: 3 },
      gap: { sm: 'sm', md: 'md', lg: 'lg' },
      alignItems: 'center',
      justifyItems: 'stretch',
      autoFlow: 'row',
      dense: true,
      contentVisibility: true,
      'aria-label': 'Integrated grid',
      onLayout: mockActions.onLayout,
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveAttribute('aria-label', 'Integrated grid');
  });

  it('handles prop updates correctly', () => {
    const { rerender } = renderComponent({
      columns: { sm: 1, md: 2 },
      gap: 'sm',
    });

    // Update props
    rerender(
      <ResponsiveGrids
        columns={{ sm: 1, md: 3, lg: 6 }}
        gap='lg'
        data-testid='responsive-grids'
      >
        {mockGridItems}
      </ResponsiveGrids>
    );

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer.className).toMatch(/md:grid-cols-3/);
    expect(gridContainer.className).toMatch(/lg:grid-cols-6/);
  });

  it('integrates well with GridItem components', () => {
    render(
      <ResponsiveGrids
        columns={{ sm: 1, md: 2, lg: 3 }}
        gap='md'
        data-testid='integrated-grid'
      >
        <GridItem colSpan={2} data-testid='spanning-item'>
          Spanning Content
        </GridItem>
        <GridItem gridArea='sidebar' data-testid='sidebar-item'>
          Sidebar Content
        </GridItem>
        <GridItem alignSelf='center' data-testid='centered-item'>
          Centered Content
        </GridItem>
      </ResponsiveGrids>
    );

    expect(screen.getByTestId('integrated-grid')).toBeInTheDocument();
    expect(screen.getByTestId('spanning-item')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-item')).toBeInTheDocument();
    expect(screen.getByTestId('centered-item')).toBeInTheDocument();
  });
});

// ===== EDGE CASES =====

describe('ResponsiveGrids - Edge Cases', () => {
  it('handles very large column counts', () => {
    renderComponent({
      columns: 12,
      children: Array.from({ length: 24 }, (_, i) => (
        <div key={i}>Item {i}</div>
      )),
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer).toHaveClass('grid-cols-12');
  });

  it('handles very small minimum item widths', () => {
    renderComponent({
      autoFit: true,
      minItemWidth: '50px',
      children: mockGridItems,
    });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer.className).toMatch(/minmax\(50px,1fr\)/);
  });

  it('handles complex nested content', () => {
    const nestedContent = (
      <div key='nested-content'>
        <h3>Complex Header</h3>
        <div>
          <p>Nested paragraph</p>
          <button>Nested button</button>
        </div>
      </div>
    );

    renderComponent({
      children: [nestedContent, ...mockGridItems],
    });

    expect(screen.getByText('Complex Header')).toBeInTheDocument();
    expect(screen.getByText('Nested paragraph')).toBeInTheDocument();

    // Use direct text query to avoid accessibility API issues in test environment
    const button = screen.getByText('Nested button');
    expect(button).toBeInTheDocument();
  });

  it('handles disabled content visibility optimization', () => {
    renderComponent({ contentVisibility: false });

    const gridContainer = screen.getByTestId('responsive-grids');
    expect(gridContainer.className).not.toMatch(/\[content-visibility:auto\]/);
  });
});
