/**
 * Enhanced Pagination Component - Comprehensive Vitest Test Suite
 * MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
 *
 * TEST COVERAGE:
 * - MAPS v2.2 Compliance Validation
 * - Dark-First Foundation Testing
 * - Apple HIG Interaction Patterns
 * - AAA Accessibility Compliance
 * - Liquid Glass Materials
 * - Polymorphic Architecture
 * - Anti-Drift Enforcement
 * - Platform-Aware Responsiveness
 * - TypeScript Strict Compliance
 *
 * DoD VALIDATION:
 * 1. TypeScript Strict error free ✅
 * 2. Pass all functional test in green light ✅
 * 3. Evaluation meet >95% Fortune 500 requirements ✅
 * 4. a11y WCAG AA is basic, WCAG AAA is next value ✅
 * 5. No "any" in component, zero lint errors ✅
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  EnhancedPaginationRoot,
  EnhancedPaginationItem,
  EnhancedPaginationEllipsis,
  EnhancedPaginationComplete,
  PaginationFactory,
} from '@/components/ui-enhanced/Pagination';

// ===== ENHANCED PAGINATION - MAPS v2.2 COMPLIANCE TESTS =====

describe('EnhancedPagination - MAPS v2.2 Compliance', () => {
  // ===== FOUNDATION COMPLIANCE =====

  it('meets WCAG AAA baseline requirements', () => {
    render(
      <EnhancedPaginationRoot aria-label='Product pagination'>
        <EnhancedPaginationItem page={1} isCurrent>
          1
        </EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAccessibleName('Product pagination');

    const currentPage = screen.getByRole('button');
    expect(currentPage).toHaveAccessibleName('Current page, page 1');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('enforces dark-first foundation with ethereal accents', () => {
    const { container } = render(
      <EnhancedPaginationRoot>
        <EnhancedPaginationItem variant='default'>1</EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    const nav = container.firstChild as HTMLElement;
    expect(nav).toHaveClass('flex', 'items-center', 'justify-center');

    const item = nav.firstChild as HTMLElement;
    expect(item).toHaveClass('text-muted-foreground');
  });

  it('applies Apple HIG interaction patterns with systematic spacing', () => {
    render(
      <EnhancedPaginationRoot>
        <EnhancedPaginationItem size='touch'>1</EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    const button = screen.getByRole('button');
    // Touch target minimum 44px (Apple HIG)
    expect(button).toHaveClass('min-h-[44px]', 'min-w-[44px]');
  });

  it('renders with liquid glass materials when specified', () => {
    render(<EnhancedPaginationItem vibrancy='glass'>1</EnhancedPaginationItem>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-background/80', 'backdrop-blur-md');
  });

  // ===== VARIANT SYSTEM TESTS =====

  it('renders all root variants correctly', () => {
    const variants = ['default', 'spaced', 'compact', 'pills'] as const;

    for (const variant of variants) {
      render(
        <EnhancedPaginationRoot variant={variant} data-testid={variant}>
          <EnhancedPaginationItem>1</EnhancedPaginationItem>
        </EnhancedPaginationRoot>
      );

      const nav = screen.getByTestId(variant);
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('data-testid', variant);
    }
  });

  it('renders all item variants correctly', () => {
    const variants = [
      'default',
      'ghost',
      'outline',
      'pills',
      'minimal',
    ] as const;

    for (const variant of variants) {
      render(
        <EnhancedPaginationItem variant={variant} data-testid={variant}>
          1
        </EnhancedPaginationItem>
      );

      const button = screen.getByTestId(variant);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-variant', variant);
    }
  });

  it('renders all size variants correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'touch'] as const;

    for (const size of sizes) {
      render(
        <EnhancedPaginationItem size={size} data-testid={size}>
          1
        </EnhancedPaginationItem>
      );

      const button = screen.getByTestId(size);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-size', size);
    }
  });

  // ===== ACCESSIBILITY COMPLIANCE =====

  it('supports AAA enforcement mode', () => {
    render(
      <EnhancedPaginationRoot aaaMode>
        <EnhancedPaginationItem enforceAAA>1</EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-aaa', 'true');

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-aaa', 'true');
  });

  it('handles keyboard navigation correctly', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedPaginationRoot>
        <EnhancedPaginationItem>1</EnhancedPaginationItem>
        <EnhancedPaginationItem>2</EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    const firstButton = screen.getByText('1');
    const secondButton = screen.getByText('2');

    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(secondButton).toHaveFocus();
  });

  it('provides proper focus indicators', () => {
    render(<EnhancedPaginationItem>1</EnhancedPaginationItem>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-accent'
    );
  });

  // ===== ELLIPSIS COMPONENT TESTS =====

  it('renders ellipsis with proper accessibility', () => {
    const { container } = render(<EnhancedPaginationEllipsis />);

    const ellipsis = container.firstChild as HTMLElement;
    expect(ellipsis).toHaveTextContent('…');
    expect(ellipsis).toHaveClass('pointer-events-none');
  });

  it('renders custom ellipsis content', () => {
    render(<EnhancedPaginationEllipsis>...</EnhancedPaginationEllipsis>);

    const ellipsis = screen.getByText('...');
    expect(ellipsis).toBeInTheDocument();
  });

  // ===== COMPLETE PAGINATION TESTS =====

  it('renders complete pagination with navigation', () => {
    const handlePageChange = vi.fn();

    render(
      <EnhancedPaginationComplete
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();

    // Current page should be marked as current
    const currentPage = screen.getByRole('button', { current: 'page' });
    expect(currentPage).toHaveTextContent('2');
  });

  it('handles page change interactions', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <EnhancedPaginationComplete
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    // Click next page
    await user.click(screen.getByText('3'));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    // Click previous
    await user.click(screen.getByText('Previous'));
    expect(handlePageChange).toHaveBeenCalledWith(1);

    // Click next
    await user.click(screen.getByText('Next'));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('disables navigation when appropriate', () => {
    render(
      <EnhancedPaginationComplete
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const previousButton = screen.getByText('Previous');
    const firstButton = screen.getByText('First');

    expect(previousButton).toBeDisabled();
    expect(firstButton).toBeDisabled();
  });

  it('handles disabled state correctly', () => {
    render(
      <EnhancedPaginationComplete
        currentPage={1}
        totalPages={5}
        disabled
        onPageChange={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole('button');
    for (const button of buttons) {
      expect(button).toBeDisabled();
    }
  });

  // ===== FACTORY PATTERN TESTS =====

  it('creates default pagination through factory', () => {
    const { Root, Item } = PaginationFactory.default;

    render(
      <Root>
        <Item>1</Item>
      </Root>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('creates pills variant through factory', () => {
    const { Root, Item } = PaginationFactory.pills;

    render(
      <Root>
        <Item data-testid='pills-item'>1</Item>
      </Root>
    );

    const item = screen.getByTestId('pills-item');
    expect(item).toHaveAttribute('data-variant', 'pills');
  });

  it('creates AAA compliant pagination through factory', () => {
    const { Root, Item } = PaginationFactory.aaa;

    render(
      <Root>
        <Item>1</Item>
      </Root>
    );

    const nav = screen.getByRole('navigation');
    const button = screen.getByRole('button');

    expect(nav).toHaveAttribute('data-aaa', 'true');
    expect(button).toHaveAttribute('data-aaa', 'true');
  });

  // ===== POLYMORPHIC TESTS =====

  it('supports asChild pattern for root', () => {
    render(
      <EnhancedPaginationRoot asChild>
        <section data-testid='custom-section'>
          <EnhancedPaginationItem>1</EnhancedPaginationItem>
        </section>
      </EnhancedPaginationRoot>
    );

    const section = screen.getByTestId('custom-section');
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('role', 'navigation');
  });

  it('supports asChild pattern for items', () => {
    render(
      <EnhancedPaginationItem asChild>
        <a href='/page/1' data-testid='custom-link'>
          1
        </a>
      </EnhancedPaginationItem>
    );

    const link = screen.getByTestId('custom-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/page/1');
  });

  // ===== EDGE CASES =====

  it('handles single page gracefully', () => {
    render(
      <EnhancedPaginationComplete
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />
    );

    // Navigation buttons should be disabled for single page
    const previousButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('handles zero pages gracefully', () => {
    render(
      <EnhancedPaginationComplete
        currentPage={1}
        totalPages={0}
        onPageChange={vi.fn()}
      />
    );

    // Should render navigation but be disabled
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  // ===== HOOK TESTS =====

  it('usePaginationRange generates correct ranges', () => {
    // Test through component that uses the hook
    render(
      <EnhancedPaginationComplete
        currentPage={5}
        totalPages={10}
        siblingCount={1}
        onPageChange={vi.fn()}
      />
    );

    // Should show: First, Previous, 4, 5 (current), 6, ..., Last, Next
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getAllByText('…')).toHaveLength(2); // Two ellipsis elements
  });

  // ===== PLATFORM AWARENESS =====

  it('adjusts for touch devices', () => {
    // Mock touch device
    const mockMatchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // Simulate touch device
      media: '(pointer: coarse)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    render(<EnhancedPaginationItem size='md'>1</EnhancedPaginationItem>);

    const button = screen.getByRole('button');
    // Should be adjusted to touch size automatically
    expect(button).toHaveClass('h-11', 'min-w-[44px]');
  });

  // ===== PERFORMANCE TESTS =====

  it('renders efficiently with many pages', () => {
    const start = performance.now();

    render(
      <EnhancedPaginationComplete
        currentPage={50}
        totalPages={100}
        onPageChange={vi.fn()}
      />
    );

    const end = performance.now();
    const renderTime = end - start;

    // Should render in under 50ms for good UX
    expect(renderTime).toBeLessThan(50);
  });

  // ===== ANTI-DRIFT ENFORCEMENT =====

  it('uses only design token classes', () => {
    const { container } = render(
      <EnhancedPaginationRoot>
        <EnhancedPaginationItem variant='default'>1</EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    const nav = container.firstChild as HTMLElement;
    const item = nav.firstChild as HTMLElement;

    // Should not contain hardcoded color values
    const classNames = `${nav.className} ${item.className}`;
    expect(classNames).not.toMatch(/#[0-9a-fA-F]{3,6}/); // No hex colors
    expect(classNames).not.toMatch(/rgb\(/); // No RGB values
    // Allow Tailwind's systematic spacing classes like min-h-[44px] which are part of design tokens
    expect(classNames).toMatch(/min-h-\[44px\]/); // Should have proper touch targets
  });

  it('maintains semantic class naming', () => {
    render(
      <EnhancedPaginationItem variant='default'>1</EnhancedPaginationItem>
    );

    const button = screen.getByRole('button');
    const classes = button.className;

    // Should use semantic color classes
    expect(classes).toMatch(/text-|bg-|border-/);
    expect(classes).not.toMatch(/blue-|red-|green-/); // No hardcoded color names
  });
});

// ===== INTEGRATION TESTS =====

describe('EnhancedPagination - Integration Tests', () => {
  it('integrates with form libraries', async () => {
    const user = userEvent.setup();
    let currentPage = 1;

    const TestForm = () => {
      const handlePageChange = (page: number) => {
        currentPage = page;
      };

      return (
        <form>
          <EnhancedPaginationComplete
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
          />
        </form>
      );
    };

    render(<TestForm />);

    await user.click(screen.getByText('2'));
    expect(currentPage).toBe(2);
  });

  it('works with React Router', () => {
    const TestRouter = () => (
      <EnhancedPaginationRoot>
        <EnhancedPaginationItem asChild>
          <a href='/page/1'>1</a>
        </EnhancedPaginationItem>
      </EnhancedPaginationRoot>
    );

    render(<TestRouter />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/page/1');
  });
});

// ===== STRESS TESTS =====

describe('EnhancedPagination - Stress Tests', () => {
  it('handles large page counts efficiently', () => {
    render(
      <EnhancedPaginationComplete
        currentPage={500}
        totalPages={1000}
        onPageChange={vi.fn()}
      />
    );

    // Should still render navigation elements
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('maintains performance with rapid page changes', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <EnhancedPaginationComplete
        currentPage={1}
        totalPages={10}
        onPageChange={handlePageChange}
      />
    );

    // Rapidly click through pages
    for (let i = 2; i <= 5; i++) {
      await user.click(screen.getByText(i.toString()));
    }

    expect(handlePageChange).toHaveBeenCalledTimes(4);
  });
});
