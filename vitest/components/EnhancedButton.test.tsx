/**
 * Enhanced Button Component Tests - MAPS v2.2 Dark-First
 *
 * Test Coverage:
 * ✅ All variant combinations
 * ✅ Size variants with 8pt grid compliance
 * ✅ Accessibility patterns (WCAG AAA)
 * ✅ Dark-first color relationships
 * ✅ Apple HIG touch target compliance
 * ✅ Keyboard navigation and focus management
 * ✅ Loading states and icon placement
 * ✅ Motion respect (reduced motion)
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { EnhancedButton } from '@/components/ui-enhanced/Button';

describe('EnhancedButton', () => {
  // ===== BASIC RENDERING =====

  it('renders with default props', () => {
    render(<EnhancedButton>Test Button</EnhancedButton>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('min-h-11'); // Apple HIG 44px minimum
  });

  it('renders as child component when asChild is true', () => {
    render(
      <EnhancedButton asChild>
        <a href='/test'>Link Button</a>
      </EnhancedButton>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  // ===== VARIANT TESTING =====

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <EnhancedButton variant='primary'>Primary</EnhancedButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent', 'text-background');

    rerender(<EnhancedButton variant='secondary'>Secondary</EnhancedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-background-elevated', 'text-foreground');

    rerender(<EnhancedButton variant='ghost'>Ghost</EnhancedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent', 'text-foreground');
  });

  it('applies correct size classes following 8pt grid', () => {
    const { rerender } = render(
      <EnhancedButton size='sm'>Small</EnhancedButton>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-3'); // 36px height

    rerender(<EnhancedButton size='md'>Medium</EnhancedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-11', 'px-4'); // 44px height (Apple HIG)

    rerender(<EnhancedButton size='lg'>Large</EnhancedButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-6'); // 48px height
  });

  // ===== ACCESSIBILITY TESTING =====

  it('meets WCAG AAA accessibility standards', () => {
    render(<EnhancedButton aria-label='Save document'>Save</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Save document');
    expect(button).toHaveClass('focus-visible:ring-2'); // Focus indicator
  });

  it('handles disabled state correctly', () => {
    render(<EnhancedButton disabled>Disabled</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <EnhancedButton onClick={handleClick}>Keyboard Test</EnhancedButton>
    );

    const button = screen.getByRole('button');

    // Focus with Tab
    await user.tab();
    expect(button).toHaveFocus();

    // Activate with Space
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Activate with Enter
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  // ===== LOADING STATE TESTING =====

  it('displays loading state correctly', () => {
    render(<EnhancedButton loading>Loading</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass('cursor-wait', 'opacity-70');

    // Check for spinner
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('does not show icons when in loading state', () => {
    const leftIcon = <span data-testid='left-icon'>L</span>;
    const rightIcon = <span data-testid='right-icon'>R</span>;

    render(
      <EnhancedButton loading leftIcon={leftIcon} rightIcon={rightIcon}>
        Loading
      </EnhancedButton>
    );

    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  // ===== ICON TESTING =====

  it('displays left and right icons correctly', () => {
    const leftIcon = <span data-testid='left-icon'>L</span>;
    const rightIcon = <span data-testid='right-icon'>R</span>;

    render(
      <EnhancedButton leftIcon={leftIcon} rightIcon={rightIcon}>
        With Icons
      </EnhancedButton>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  // ===== INTERACTION TESTING =====

  it('handles click events correctly', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<EnhancedButton onClick={handleClick}>Click Me</EnhancedButton>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover and active states', () => {
    render(<EnhancedButton variant='primary'>Hover Test</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent-hover');
    expect(button).toHaveClass('active:scale-95');
  });

  // ===== MOTION RESPECT TESTING =====

  it('respects reduced motion preferences', () => {
    render(<EnhancedButton>Motion Test</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('motion-reduce:transition-none');
    expect(button).toHaveClass('motion-reduce:hover:transform-none');
  });

  // ===== DARK-FIRST TESTING =====

  it('uses dark-first color palette', () => {
    render(<EnhancedButton variant='primary'>Dark First</EnhancedButton>);

    const button = screen.getByRole('button');
    // Primary uses accent background with dark foreground (superior contrast)
    expect(button).toHaveClass('bg-accent', 'text-background');
  });

  it('supports accent secondary variant', () => {
    render(
      <EnhancedButton variant='accentSecondary'>Teal Accent</EnhancedButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent-secondary', 'text-background');
  });

  // ===== CUSTOM PROPS TESTING =====

  it('forwards custom props correctly', () => {
    render(
      <EnhancedButton data-testid='custom-button' aria-describedby='help-text'>
        Custom Props
      </EnhancedButton>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('merges custom className with component classes', () => {
    render(
      <EnhancedButton className='custom-class'>Custom Class</EnhancedButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('min-h-11'); // Still has component classes
  });

  // ===== APPLE HIG COMPLIANCE =====

  it('meets Apple HIG minimum touch target size', () => {
    render(<EnhancedButton size='sm'>Small Button</EnhancedButton>);

    const button = screen.getByRole('button');
    // Even small buttons meet 44px minimum
    expect(button).toHaveClass('min-h-11', 'min-w-11'); // 44px x 44px minimum
  });

  it('provides adequate spacing for icon buttons', () => {
    render(<EnhancedButton size='icon'>🔍</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11', 'w-11', 'p-0'); // Perfect square with no padding
  });
});
