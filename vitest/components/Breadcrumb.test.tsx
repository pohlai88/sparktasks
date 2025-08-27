/**
 * Enhanced Breadcrumb Component Tests - MAPS v2.2 Foundation
 *
 * Comprehensive test suite covering all variants, states, and interactions
 * following our established testing patterns for UI-Enhanced components.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  EnhancedBreadcrumb,
  EnhancedBreadcrumbList,
  EnhancedBreadcrumbItem,
  EnhancedBreadcrumbLink,
  EnhancedBreadcrumbPage,
  EnhancedBreadcrumbSeparator,
  EnhancedBreadcrumbEllipsis,
  BreadcrumbFactory,
  createHomeBreadcrumb,
  createBreadcrumbPath,
  truncateBreadcrumb,
} from '../../src/components/ui-enhanced/Breadcrumb';

describe('EnhancedBreadcrumb', () => {
  // ===== BASIC RENDERING TESTS =====

  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      render(
        <EnhancedBreadcrumb data-testid='breadcrumb'>
          <EnhancedBreadcrumbList>
            <EnhancedBreadcrumbItem>
              <EnhancedBreadcrumbLink href='/'>Home</EnhancedBreadcrumbLink>
            </EnhancedBreadcrumbItem>
            <EnhancedBreadcrumbSeparator />
            <EnhancedBreadcrumbItem>
              <EnhancedBreadcrumbPage>Current</EnhancedBreadcrumbPage>
            </EnhancedBreadcrumbItem>
          </EnhancedBreadcrumbList>
        </EnhancedBreadcrumb>
      );

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Breadcrumb navigation'
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('renders as child component when asChild is true', () => {
      render(
        <EnhancedBreadcrumb asChild>
          <div data-testid='custom-breadcrumb'>Custom breadcrumb</div>
        </EnhancedBreadcrumb>
      );

      const element = screen.getByTestId('custom-breadcrumb');
      expect(element.tagName).toBe('DIV');
      expect(element).toHaveTextContent('Custom breadcrumb');
    });

    it('applies correct CSS classes for default variant', () => {
      render(<EnhancedBreadcrumb data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('flex', 'items-center', 'space-x-1');
      expect(breadcrumb).toHaveClass('text-sm', 'text-muted-foreground');
      expect(breadcrumb).toHaveClass(
        'transition-all',
        'duration-200',
        'ease-out'
      );
    });
  });

  // ===== VARIANT TESTS =====

  describe('Variants', () => {
    it('applies compact variant styles correctly', () => {
      render(<EnhancedBreadcrumb variant='compact' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('py-1', 'space-x-0.5');
    });

    it('applies pills variant styles correctly', () => {
      render(<EnhancedBreadcrumb variant='pills' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('py-1', 'space-x-2');
    });

    it('applies glass variant styles correctly', () => {
      render(<EnhancedBreadcrumb variant='glass' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('py-2', 'px-3', 'rounded-lg');
      expect(breadcrumb).toHaveClass('backdrop-blur-sm');
      expect(breadcrumb).toHaveClass('border', 'border-border/20', 'shadow-sm');
    });
  });

  // ===== SIZE VARIANTS =====

  describe('Size Variants', () => {
    it('applies small size correctly', () => {
      render(<EnhancedBreadcrumb size='sm' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('text-xs', 'gap-1');
    });

    it('applies medium size correctly', () => {
      render(<EnhancedBreadcrumb size='md' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('text-sm', 'gap-2');
    });

    it('applies large size correctly', () => {
      render(<EnhancedBreadcrumb size='lg' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('text-base', 'gap-3');
    });
  });

  // ===== SURFACE VARIANTS =====

  describe('Surface Variants', () => {
    it('applies elevated surface correctly', () => {
      render(
        <EnhancedBreadcrumb surface='elevated' data-testid='breadcrumb' />
      );

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('bg-background-elevated');
    });

    it('applies panel surface correctly', () => {
      render(<EnhancedBreadcrumb surface='panel' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('bg-background-panel');
    });

    it('applies glass surface correctly', () => {
      render(<EnhancedBreadcrumb surface='glass' data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('bg-background/80', 'backdrop-blur-sm');
    });
  });

  // ===== AAA COMPLIANCE TESTS =====

  describe('AAA Compliance', () => {
    it('applies AAA mode when enforceAAA is true', () => {
      render(<EnhancedBreadcrumb enforceAAA data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveAttribute('data-aaa', 'true');
    });

    it('does not apply AAA mode by default', () => {
      render(<EnhancedBreadcrumb data-testid='breadcrumb' />);

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveAttribute('data-aaa', 'false');
    });
  });
});

// ===== BREADCRUMB LIST TESTS =====

describe('EnhancedBreadcrumbList', () => {
  it('renders as ordered list by default', () => {
    render(
      <EnhancedBreadcrumbList data-testid='breadcrumb-list'>
        <li>Item</li>
      </EnhancedBreadcrumbList>
    );

    const list = screen.getByTestId('breadcrumb-list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('flex', 'flex-wrap', 'items-center', 'gap-1.5');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <EnhancedBreadcrumbList asChild>
        <ul data-testid='custom-list'>Custom list</ul>
      </EnhancedBreadcrumbList>
    );

    const list = screen.getByTestId('custom-list');
    expect(list.tagName).toBe('UL');
  });
});

// ===== BREADCRUMB ITEM TESTS =====

describe('EnhancedBreadcrumbItem', () => {
  it('renders as list item by default', () => {
    render(
      <EnhancedBreadcrumbItem data-testid='breadcrumb-item'>
        Item content
      </EnhancedBreadcrumbItem>
    );

    const item = screen.getByTestId('breadcrumb-item');
    expect(item.tagName).toBe('LI');
    expect(item).toHaveClass('inline-flex', 'items-center');
  });

  it('applies current page styles when isCurrentPage is true', () => {
    render(
      <EnhancedBreadcrumbItem isCurrentPage data-testid='breadcrumb-item'>
        Current page
      </EnhancedBreadcrumbItem>
    );

    const item = screen.getByTestId('breadcrumb-item');
    expect(item).toHaveClass(
      'text-foreground',
      'font-medium',
      'cursor-default'
    );
    expect(item).toHaveAttribute('aria-current', 'page');
  });

  it('applies interactive styles when not current page', () => {
    render(
      <EnhancedBreadcrumbItem data-testid='breadcrumb-item'>
        Link page
      </EnhancedBreadcrumbItem>
    );

    const item = screen.getByTestId('breadcrumb-item');
    expect(item).toHaveClass('cursor-pointer');
    expect(item).not.toHaveAttribute('aria-current');
  });

  it('applies AAA compliance styles when enforceAAA is true', () => {
    render(
      <EnhancedBreadcrumbItem enforceAAA data-testid='breadcrumb-item'>
        AAA item
      </EnhancedBreadcrumbItem>
    );

    const item = screen.getByTestId('breadcrumb-item');
    expect(item).toHaveClass('aaa:text-accent-solid-aaa');
  });
});

// ===== BREADCRUMB LINK TESTS =====

describe('EnhancedBreadcrumbLink', () => {
  it('renders as anchor link by default', () => {
    render(
      <EnhancedBreadcrumbLink href='/test' data-testid='breadcrumb-link'>
        Test Link
      </EnhancedBreadcrumbLink>
    );

    const link = screen.getByTestId('breadcrumb-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex', 'items-center', 'gap-1.5');
  });

  it('renders as span when isCurrentPage is true', () => {
    render(
      <EnhancedBreadcrumbLink isCurrentPage data-testid='breadcrumb-link'>
        Current Page
      </EnhancedBreadcrumbLink>
    );

    const link = screen.getByText('Current Page');
    expect(link.tagName).toBe('SPAN');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass(
      'font-medium',
      'text-foreground',
      'cursor-default'
    );
  });

  it('applies hover and focus styles for interactive links', () => {
    render(
      <EnhancedBreadcrumbLink href='/test' data-testid='breadcrumb-link'>
        Interactive Link
      </EnhancedBreadcrumbLink>
    );

    const link = screen.getByTestId('breadcrumb-link');
    expect(link).toHaveClass('text-muted-foreground', 'hover:text-foreground');
    expect(link).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2'
    );
  });

  it('applies AAA compliance when enforceAAA is true', () => {
    render(
      <EnhancedBreadcrumbLink
        enforceAAA
        href='/test'
        data-testid='breadcrumb-link'
      >
        AAA Link
      </EnhancedBreadcrumbLink>
    );

    const link = screen.getByTestId('breadcrumb-link');
    expect(link).toHaveAttribute('data-aaa', 'true');
    expect(link).toHaveClass('aaa:text-accent-solid-aaa');
  });
});

// ===== BREADCRUMB PAGE TESTS =====

describe('EnhancedBreadcrumbPage', () => {
  it('renders as span with current page attributes', () => {
    render(
      <EnhancedBreadcrumbPage data-testid='breadcrumb-page'>
        Current Page
      </EnhancedBreadcrumbPage>
    );

    const page = screen.getByTestId('breadcrumb-page');
    expect(page.tagName).toBe('SPAN');
    expect(page).toHaveAttribute('role', 'link');
    expect(page).toHaveAttribute('aria-disabled', 'true');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveClass('font-medium', 'text-foreground');
  });
});

// ===== BREADCRUMB SEPARATOR TESTS =====

describe('EnhancedBreadcrumbSeparator', () => {
  it('renders chevron separator by default', () => {
    render(<EnhancedBreadcrumbSeparator data-testid='separator' />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'presentation');
    expect(separator.querySelector('svg')).toBeInTheDocument();
  });

  it('renders slash separator when variant is slash', () => {
    render(
      <EnhancedBreadcrumbSeparator variant='slash' data-testid='separator' />
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveTextContent('/');
  });

  it('renders dot separator when variant is dot', () => {
    render(
      <EnhancedBreadcrumbSeparator variant='dot' data-testid='separator' />
    );

    const separator = screen.getByTestId('separator');
    const dot = separator.querySelector('.size-1.rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it('renders custom separator content', () => {
    render(
      <EnhancedBreadcrumbSeparator data-testid='separator'>
        <span>|</span>
      </EnhancedBreadcrumbSeparator>
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveTextContent('|');
  });
});

// ===== BREADCRUMB ELLIPSIS TESTS =====

describe('EnhancedBreadcrumbEllipsis', () => {
  it('renders ellipsis with correct attributes', () => {
    render(<EnhancedBreadcrumbEllipsis data-testid='ellipsis' />);

    const ellipsis = screen.getByTestId('ellipsis');
    expect(ellipsis).toHaveAttribute('role', 'presentation');
    expect(ellipsis.querySelector('svg')).toBeInTheDocument();
    expect(screen.getAllByText('More pages')).toHaveLength(2); // Both AccessibleIcon and VisuallyHidden
  });
});

// ===== FACTORY FUNCTION TESTS =====

describe('BreadcrumbFactory', () => {
  it('creates navigation breadcrumb configuration', () => {
    const config = BreadcrumbFactory.navigation();

    expect(config).toEqual({
      variant: 'default',
      size: 'md',
      separator: 'chevron',
    });
  });

  it('creates compact breadcrumb configuration', () => {
    const config = BreadcrumbFactory.compact();

    expect(config).toEqual({
      variant: 'compact',
      size: 'sm',
      separator: 'slash',
      maxItems: 3,
    });
  });

  it('creates glass breadcrumb configuration', () => {
    const config = BreadcrumbFactory.glass();

    expect(config).toEqual({
      variant: 'glass',
      surface: 'glass',
      separator: 'dot',
    });
  });

  it('creates accessible breadcrumb configuration', () => {
    const config = BreadcrumbFactory.accessible();

    expect(config).toEqual({
      variant: 'default',
      enforceAAA: true,
      separator: 'chevron',
    });
  });

  it('allows custom props to override defaults', () => {
    const config = BreadcrumbFactory.navigation({
      variant: 'pills',
      size: 'lg',
    });

    expect(config).toEqual({
      variant: 'pills',
      size: 'lg',
      separator: 'chevron',
    });
  });
});

// ===== UTILITY FUNCTION TESTS =====

describe('Utility Functions', () => {
  describe('createHomeBreadcrumb', () => {
    it('creates home breadcrumb with defaults', () => {
      const home = createHomeBreadcrumb();

      expect(home).toEqual({
        href: '/',
        label: 'Home',
        icon: expect.any(Object),
        isHome: true,
      });
    });

    it('creates home breadcrumb with custom values', () => {
      const customIcon = <span>🏠</span>;
      const home = createHomeBreadcrumb('/dashboard', 'Dashboard', customIcon);

      expect(home).toEqual({
        href: '/dashboard',
        label: 'Dashboard',
        icon: customIcon,
        isHome: true,
      });
    });
  });

  describe('createBreadcrumbPath', () => {
    it('creates breadcrumb path with current page marked', () => {
      const items = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/products/123', label: 'Product Details' },
      ];

      const path = createBreadcrumbPath(items);

      expect(path).toEqual([
        { href: '/', label: 'Home', isCurrentPage: false },
        { href: '/products', label: 'Products', isCurrentPage: false },
        {
          href: '/products/123',
          label: 'Product Details',
          isCurrentPage: true,
        },
      ]);
    });
  });

  describe('truncateBreadcrumb', () => {
    const longItems = [
      { href: '/', label: 'Home' },
      { href: '/category', label: 'Category' },
      { href: '/subcategory', label: 'Subcategory' },
      { href: '/product', label: 'Product' },
      { href: '/details', label: 'Details' },
    ];

    it('returns items unchanged when count is within limit', () => {
      const shortItems = longItems.slice(0, 3);
      const result = truncateBreadcrumb(shortItems, 3);

      expect(result).toEqual(shortItems);
    });

    it('truncates items with ellipsis when exceeding limit', () => {
      const result = truncateBreadcrumb(longItems, 3);

      expect(result).toEqual([
        { href: '/', label: 'Home' },
        { href: '#', label: '...', isEllipsis: true },
        { href: '/details', label: 'Details' },
      ]);
    });

    it('truncates with custom maxItems limit', () => {
      const result = truncateBreadcrumb(longItems, 4);

      expect(result).toEqual([
        { href: '/', label: 'Home' },
        { href: '#', label: '...', isEllipsis: true },
        { href: '/subcategory', label: 'Subcategory' },
        { href: '/product', label: 'Product' },
        { href: '/details', label: 'Details' },
      ]);
    });
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Accessibility', () => {
  it('provides proper ARIA labels for navigation', () => {
    render(
      <EnhancedBreadcrumb>
        <EnhancedBreadcrumbList>
          <EnhancedBreadcrumbItem>
            <EnhancedBreadcrumbLink href='/'>Home</EnhancedBreadcrumbLink>
          </EnhancedBreadcrumbItem>
        </EnhancedBreadcrumbList>
      </EnhancedBreadcrumb>
    );

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Breadcrumb navigation'
    );
  });

  it('marks current page correctly', () => {
    render(
      <EnhancedBreadcrumbItem isCurrentPage>
        <EnhancedBreadcrumbPage>Current</EnhancedBreadcrumbPage>
      </EnhancedBreadcrumbItem>
    );

    const item = screen.getByText('Current').closest('li');
    expect(item).toHaveAttribute('aria-current', 'page');
  });

  it('hides separators from screen readers', () => {
    render(<EnhancedBreadcrumbSeparator data-testid='separator' />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'presentation');
  });

  it('provides screen reader text for ellipsis', () => {
    render(<EnhancedBreadcrumbEllipsis />);

    expect(screen.getAllByText('More pages')).toHaveLength(2); // Both AccessibleIcon and VisuallyHidden provide the text
  });
});

// ===== INTERACTION TESTS =====

describe('Interactions', () => {
  it('handles click events on breadcrumb links', () => {
    const handleClick = vi.fn();

    render(
      <EnhancedBreadcrumbLink href='/test' onClick={handleClick}>
        Test Link
      </EnhancedBreadcrumbLink>
    );

    fireEvent.click(screen.getByText('Test Link'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle clicks on current page', () => {
    const handleClick = vi.fn();

    render(
      <EnhancedBreadcrumbLink isCurrentPage onClick={handleClick}>
        Current Page
      </EnhancedBreadcrumbLink>
    );

    fireEvent.click(screen.getByText('Current Page'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation', () => {
    render(
      <EnhancedBreadcrumbLink href='/test' data-testid='link'>
        Test Link
      </EnhancedBreadcrumbLink>
    );

    const link = screen.getByTestId('link');
    fireEvent.keyDown(link, { key: 'Enter' });
    fireEvent.keyDown(link, { key: ' ' });

    // Link should remain focusable
    expect(link).toHaveClass('focus-visible:ring-2');
  });
});

// ===== EDGE CASES =====

describe('Edge Cases', () => {
  it('handles empty breadcrumb gracefully', () => {
    render(<EnhancedBreadcrumb data-testid='breadcrumb' />);

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb).toBeEmptyDOMElement();
  });

  it('handles custom className merging', () => {
    render(
      <EnhancedBreadcrumb className='custom-class' data-testid='breadcrumb' />
    );

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toHaveClass('custom-class');
    expect(breadcrumb).toHaveClass('flex', 'items-center'); // Default classes preserved
  });

  it('handles complex nested structure', () => {
    render(
      <EnhancedBreadcrumb>
        <EnhancedBreadcrumbList>
          <EnhancedBreadcrumbItem>
            <EnhancedBreadcrumbLink href='/'>
              <span>🏠</span>
              Home
            </EnhancedBreadcrumbLink>
          </EnhancedBreadcrumbItem>
          <EnhancedBreadcrumbSeparator />
          <EnhancedBreadcrumbItem>
            <EnhancedBreadcrumbLink href='/products'>
              Products
            </EnhancedBreadcrumbLink>
          </EnhancedBreadcrumbItem>
          <EnhancedBreadcrumbSeparator />
          <EnhancedBreadcrumbItem isCurrentPage>
            <EnhancedBreadcrumbPage>Current Product</EnhancedBreadcrumbPage>
          </EnhancedBreadcrumbItem>
        </EnhancedBreadcrumbList>
      </EnhancedBreadcrumb>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current Product')).toBeInTheDocument();

    // Check for separators using more specific query
    const separators = document.querySelectorAll('[role="presentation"]');
    expect(separators).toHaveLength(2); // Two separators
  });
});
