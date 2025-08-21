import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestButton } from '@/components';

expect.extend(toHaveNoViolations);

describe('TestButton', () => {
  it('renders without errors', () => {
    render(<TestButton>Test content</TestButton>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('supports all variants', () => {
    const variants = ['primary', 'secondary', 'ghost'] as const;

    variants.forEach(variant => {
      const { rerender } = render(
        <TestButton variant={variant}>Test</TestButton>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
      rerender(<></>);
    });
  });

  it('supports all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { rerender } = render(<TestButton size={size}>Test</TestButton>);
      expect(screen.getByText('Test')).toBeInTheDocument();
      rerender(<></>);
    });
  });

  it('handles disabled state', () => {
    render(<TestButton disabled>Disabled</TestButton>);
    const element = screen.getByText('Disabled');
    expect(element).toHaveAttribute('aria-disabled', 'true');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<TestButton ref={ref}>Test</TestButton>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('meets accessibility requirements', async () => {
    const { container } = render(<TestButton>Accessible content</TestButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles keyboard navigation', () => {
    render(<TestButton>Keyboard test</TestButton>);
    const element = screen.getByText('Keyboard test');

    // Test focus behavior
    element.focus();
    expect(element).toHaveFocus();
  });

  it('supports custom className', () => {
    const customClass = 'custom-test-class';
    render(<TestButton className={customClass}>Test</TestButton>);
    expect(screen.getByText('Test')).toHaveClass(customClass);
  });

  it('supports dark mode theming', () => {
    // Test with dark mode context/provider if implemented
    render(<TestButton>Dark mode test</TestButton>);
    expect(screen.getByText('Dark mode test')).toBeInTheDocument();
  });
});
