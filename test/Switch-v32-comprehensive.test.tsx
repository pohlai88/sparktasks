/**
 * Enhanced Switch Component Tests - MAPS v2.2 Compliance & AAA Standards
 *
 * Test Coverage:
 * - Component rendering and basic functionality
 * - Variant system and CVA integration
 * - AAA compliance modes and accessibility
 * - Factory function creation patterns
 * - Keyboard navigation and ARIA attributes
 * - Dark-first philosophy validation
 * - Token-only enforcement (anti-drift)
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  EnhancedSwitch,
  SwitchFactory,
  type EnhancedSwitchProps,
} from '@/components/ui-enhanced/Switch';

// ===== TEST UTILITIES =====

const renderSwitch = (props: Partial<EnhancedSwitchProps> = {}) => {
  const defaultProps: EnhancedSwitchProps = {
    'aria-label': 'Test switch',
    ...props,
  };

  return render(<EnhancedSwitch {...defaultProps} />);
};

const user = userEvent.setup();

// ===== BASIC FUNCTIONALITY TESTS =====

describe('Enhanced Switch - Basic Functionality', () => {
  it('should render with default props', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-label', 'Test switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('should render as checked when checked prop is true', () => {
    renderSwitch({ checked: true });
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('should call onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ onCheckedChange });

    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should toggle between checked and unchecked states', async () => {
    const TestSwitch = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <EnhancedSwitch
          checked={checked}
          onCheckedChange={setChecked}
          aria-label='Toggle switch'
        />
      );
    };

    render(<TestSwitch />);
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveAttribute('aria-checked', 'false');

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('should be disabled when disabled prop is true', () => {
    renderSwitch({ disabled: true });
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveAttribute('data-disabled', '');
  });

  it('should not call onCheckedChange when disabled and clicked', async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ disabled: true, onCheckedChange });

    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

// ===== VARIANT SYSTEM TESTS =====

describe('Enhanced Switch - Variant System', () => {
  it('should apply default variant classes', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('h-5', 'w-9'); // default size
  });

  it('should apply size variants correctly', () => {
    const { rerender } = renderSwitch({ size: 'sm' });
    let switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('h-4', 'w-7');

    rerender(<EnhancedSwitch size='lg' aria-label='Test switch' />);
    switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('h-6', 'w-11');
  });

  it('should apply semantic variants correctly', () => {
    const variants = ['destructive', 'success', 'warning'] as const;

    for (const variant of variants) {
      const { unmount } = renderSwitch({ variant });
      const switchElement = screen.getByRole('switch');

      // Each variant should have its semantic color class
      expect(switchElement.className).toContain(
        'data-[state=checked]:bg-semantic-'
      );
      unmount();
    }
  });

  it('should apply density variants correctly', () => {
    const { rerender } = renderSwitch({ density: 'compact' });
    let switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('p-0');

    rerender(<EnhancedSwitch density='comfortable' aria-label='Test switch' />);
    switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('p-0.5');
  });

  it('should combine multiple variants correctly', () => {
    renderSwitch({
      size: 'lg',
      variant: 'success',
      density: 'compact',
    });

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('h-6', 'w-11', 'p-0');
    expect(switchElement.className).toContain(
      'data-[state=checked]:bg-semantic-positive-primary'
    );
  });
});

// ===== AAA COMPLIANCE TESTS =====

describe('Enhanced Switch - AAA Compliance', () => {
  it('should apply AAA mode classes when aaaMode is true', () => {
    renderSwitch({ aaaMode: true });
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass(
      'contrast-more:ring-4',
      'contrast-more:border-4',
      'contrast-more:ring-content-foreground',
      'contrast-more:border-content-foreground'
    );
  });

  it('should not apply AAA mode classes when aaaMode is false', () => {
    renderSwitch({ aaaMode: false });
    const switchElement = screen.getByRole('switch');

    expect(switchElement).not.toHaveClass('contrast-more:ring-4');
  });

  it('should have proper ARIA attributes', () => {
    renderSwitch({
      'aria-label': 'Enable notifications',
      'aria-description': 'Toggle to receive push notifications',
    });

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-label', 'Enable notifications');
    expect(switchElement).toHaveAttribute(
      'aria-description',
      'Toggle to receive push notifications'
    );
  });

  it('should have proper focus management', async () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    await user.tab();
    expect(switchElement).toHaveFocus();

    // Should have focus-visible classes
    expect(switchElement).toHaveClass('focus-visible:outline-none');
    expect(switchElement).toHaveClass('focus-visible:ring-2');
  });
});

// ===== KEYBOARD NAVIGATION TESTS =====

describe('Enhanced Switch - Keyboard Navigation', () => {
  it('should toggle with Space key', async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ onCheckedChange });

    const switchElement = screen.getByRole('switch');
    switchElement.focus();

    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should toggle with Enter key', async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ onCheckedChange });

    const switchElement = screen.getByRole('switch');
    switchElement.focus();

    await user.keyboard('{Enter}');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should not toggle when disabled and keyboard is used', async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ disabled: true, onCheckedChange });

    const switchElement = screen.getByRole('switch');
    switchElement.focus();

    await user.keyboard(' ');
    await user.keyboard('{Enter}');

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

// ===== FACTORY FUNCTION TESTS =====

describe('Enhanced Switch - Factory Functions', () => {
  it('should create default switch', () => {
    render(SwitchFactory.default({ 'aria-label': 'Default switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveClass('h-5', 'w-9'); // default size
  });

  it('should create success variant switch', () => {
    render(SwitchFactory.success({ 'aria-label': 'Success switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement.className).toContain(
      'data-[state=checked]:bg-semantic-positive-primary'
    );
  });

  it('should create warning variant switch', () => {
    render(SwitchFactory.warning({ 'aria-label': 'Warning switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement.className).toContain(
      'data-[state=checked]:bg-semantic-notice-primary'
    );
  });

  it('should create destructive variant switch', () => {
    render(SwitchFactory.destructive({ 'aria-label': 'Destructive switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement.className).toContain(
      'data-[state=checked]:bg-semantic-critical-primary'
    );
  });

  it('should create AAA compliant switch', () => {
    render(SwitchFactory.aaa({ 'aria-label': 'AAA switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('contrast-more:ring-4');
  });

  it('should create small size switch', () => {
    render(SwitchFactory.small({ 'aria-label': 'Small switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('h-4', 'w-7');
  });

  it('should create large size switch', () => {
    render(SwitchFactory.large({ 'aria-label': 'Large switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('h-6', 'w-11');
  });

  it('should create compact density switch', () => {
    render(SwitchFactory.compact({ 'aria-label': 'Compact switch' }));
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('p-0');
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced Switch - Accessibility', () => {
  it('should have proper role', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveAttribute('role', 'switch');
  });

  it('should support custom className', () => {
    renderSwitch({ className: 'custom-class' });
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<EnhancedSwitch ref={ref} aria-label='Test switch' />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should have proper thumb element', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');
    const thumb =
      switchElement.querySelector('[data-radix-collection-item]') ||
      switchElement.querySelector('span');

    expect(thumb).toBeInTheDocument();
  });
});

// ===== DARK-FIRST PHILOSOPHY TESTS =====

describe('Enhanced Switch - Dark-First Philosophy', () => {
  it('should use semantic color tokens (anti-drift enforcement)', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    // Should use semantic tokens, not hardcoded colors
    expect(switchElement.className).toContain('bg-content-panel-border-subtle');
    expect(switchElement.className).toContain(
      'data-[state=checked]:bg-semantic-accent-primary'
    );
  });

  it('should have proper focus ring using semantic tokens', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass(
      'focus-visible:ring-semantic-accent-primary'
    );
  });

  it('should respect motion preferences', () => {
    renderSwitch();
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveClass('motion-reduce:transition-none');
  });
});

// ===== INTEGRATION TESTS =====

describe('Enhanced Switch - Integration', () => {
  it('should work in forms', async () => {
    const onSubmit = vi.fn();

    const TestForm = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ checked });
          }}
        >
          <EnhancedSwitch
            checked={checked}
            onCheckedChange={setChecked}
            aria-label='Accept terms'
          />
          <button type='submit'>Submit</button>
        </form>
      );
    };

    render(<TestForm />);

    const switchElement = screen.getByRole('switch');
    const submitButton = screen.getByText('Submit');

    await user.click(switchElement);
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ checked: true });
  });

  it('should maintain state across re-renders', async () => {
    const TestComponent = ({ extraProp }: { extraProp?: string }) => {
      const [checked, setChecked] = React.useState(false);

      return (
        <div>
          <EnhancedSwitch
            checked={checked}
            onCheckedChange={setChecked}
            aria-label='Test switch'
          />
          <span>{extraProp}</span>
        </div>
      );
    };

    const { rerender } = render(<TestComponent />);
    const switchElement = screen.getByRole('switch');

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');

    rerender(<TestComponent extraProp='updated' />);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });
});

// ===== PERFORMANCE TESTS =====

describe('Enhanced Switch - Performance', () => {
  it('should render quickly with default props', () => {
    const startTime = performance.now();
    renderSwitch();
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50); // Should render in < 50ms
  });

  it('should handle rapid state changes', async () => {
    const onCheckedChange = vi.fn();
    renderSwitch({ onCheckedChange });

    const switchElement = screen.getByRole('switch');

    // Rapid clicks
    await user.click(switchElement);
    await user.click(switchElement);
    await user.click(switchElement);

    expect(onCheckedChange).toHaveBeenCalledTimes(3);
  });
});
