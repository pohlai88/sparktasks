/**
 * Enhanced Checkbox Component Tests - MAPS v2.2 Testing Strategy
 *
 * TESTING PHILOSOPHY:
 * - User-centric approach: Test behavior, not implementation
 * - Accessibility-first: WCAG AAA compliance validation
 * - Apple HIG patterns: Interaction and feedback testing
 * - Comprehensive coverage: All variants, states, and edge cases
 *
 * TESTING MATRIX:
 * - Radix behavior: State management, ARIA, keyboard navigation
 * - MAPS styling: Variants, sizes, validation states
 * - Accessibility: Screen reader, keyboard, focus management
 * - User interactions: Click, keyboard, label association
 */

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Checkbox,
  CheckboxWithLabel,
  CheckboxGroup,
} from '@/components/ui-enhanced/Checkbox';

// ===== TEST SETUP =====

afterEach(() => {
  cleanup();
});

// ===== CORE FUNCTIONALITY TESTS =====

describe('Enhanced Checkbox - Core Functionality', () => {
  it('renders unchecked checkbox by default', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('handles controlled checked state', () => {
    const { rerender } = render(
      <Checkbox data-testid='checkbox' checked={false} />
    );

    let checkbox = screen.getByTestId('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    rerender(<Checkbox data-testid='checkbox' checked={true} />);

    checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('handles indeterminate state', () => {
    render(<Checkbox data-testid='checkbox' checked='indeterminate' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox data-testid='checkbox' onCheckedChange={handleChange} />);

    const checkbox = screen.getByTestId('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox
        data-testid='checkbox'
        disabled
        onCheckedChange={handleChange}
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('data-disabled');

    await user.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced Checkbox - Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <Checkbox
        data-testid='checkbox'
        aria-label='Accept terms'
        aria-describedby='terms-description'
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('role', 'checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms');
    expect(checkbox).toHaveAttribute('aria-describedby', 'terms-description');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox data-testid='checkbox' onCheckedChange={handleChange} />);

    const checkbox = screen.getByTestId('checkbox');
    checkbox.focus();
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('has focus-visible styles applied', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('focus-visible:ring-2');
    expect(checkbox).toHaveClass('focus-visible:ring-accent');
  });

  it('meets minimum touch target requirements', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    // Touch target area is created with before pseudo-element
    expect(checkbox).toHaveClass('before:absolute');
    expect(checkbox).toHaveClass('before:inset-[-12px]');
  });
});

// ===== VARIANT TESTS =====

describe('Enhanced Checkbox - Variants', () => {
  it('renders default variant correctly', () => {
    render(<Checkbox data-testid='checkbox' variant='default' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('bg-background');
  });

  it('renders ghost variant correctly', () => {
    render(<Checkbox data-testid='checkbox' variant='ghost' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('bg-transparent');
    expect(checkbox).toHaveClass('border-muted-foreground/30');
  });

  it('renders glass variant correctly', () => {
    render(<Checkbox data-testid='checkbox' variant='glass' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('backdrop-blur-sm');
    expect(checkbox).toHaveClass('backdrop-saturate-150');
    expect(checkbox).toHaveClass('bg-background/60');
  });
});

// ===== SIZE TESTS =====

describe('Enhanced Checkbox - Sizes', () => {
  it('renders small size correctly', () => {
    render(<Checkbox data-testid='checkbox' size='sm' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('h-3', 'w-3');
    expect(checkbox).toHaveClass('before:inset-[-14px]');
  });

  it('renders default size correctly', () => {
    render(<Checkbox data-testid='checkbox' size='default' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('h-4', 'w-4');
    expect(checkbox).toHaveClass('before:inset-[-12px]');
  });

  it('renders large size correctly', () => {
    render(<Checkbox data-testid='checkbox' size='lg' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('h-5', 'w-5');
    expect(checkbox).toHaveClass('before:inset-[-12px]');
  });
});

// ===== VALIDATION TESTS =====

describe('Enhanced Checkbox - Validation States', () => {
  it('renders error validation state', () => {
    render(<Checkbox data-testid='checkbox' validation='error' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('border-destructive');
    expect(checkbox).toHaveClass('focus-visible:ring-destructive');
  });

  it('renders success validation state', () => {
    render(<Checkbox data-testid='checkbox' validation='success' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('border-success');
    expect(checkbox).toHaveClass('focus-visible:ring-success');
  });

  it('renders warning validation state', () => {
    render(<Checkbox data-testid='checkbox' validation='warning' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('border-warning');
    expect(checkbox).toHaveClass('focus-visible:ring-warning');
  });
});

// ===== CHECKBOX WITH LABEL TESTS =====

describe('Enhanced CheckboxWithLabel', () => {
  it('renders checkbox with label', () => {
    render(
      <CheckboxWithLabel
        data-testid='checkbox'
        label='Accept terms and conditions'
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    const label = screen.getByText('Accept terms and conditions');

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('renders checkbox with label and description', () => {
    render(
      <CheckboxWithLabel
        data-testid='checkbox'
        label='Enable notifications'
        description='Receive updates about your account activity'
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    const label = screen.getByText('Enable notifications');
    const description = screen.getByText(
      'Receive updates about your account activity'
    );

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(checkbox).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('description')
    );
  });

  it('handles label position left', () => {
    render(
      <CheckboxWithLabel
        data-testid='checkbox'
        label='Left aligned'
        labelPosition='left'
      />
    );

    // Find the outermost container that should have the flex-row-reverse class
    const checkbox = screen.getByTestId('checkbox');
    const outerContainer = checkbox.parentElement?.parentElement;
    expect(outerContainer).toHaveClass('flex-row-reverse');
  });

  it('shows required indicator', () => {
    render(
      <CheckboxWithLabel
        data-testid='checkbox'
        label='Required field'
        required
      />
    );

    // The label element should have the required styling
    const label = screen.getByText('Required field');
    expect(label).toHaveClass("after:content-['*']");
    expect(label).toHaveClass('after:text-destructive');
  });

  it('handles disabled state for label', () => {
    render(
      <CheckboxWithLabel
        data-testid='checkbox'
        label='Disabled option'
        disabled
      />
    );

    const checkbox = screen.getByTestId('checkbox');
    const label = screen.getByText('Disabled option');

    expect(checkbox).toBeDisabled();
    expect(label).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('handles label click to toggle checkbox', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <CheckboxWithLabel
        data-testid='checkbox'
        label='Click label to toggle'
        onCheckedChange={handleChange}
      />
    );

    const label = screen.getByText('Click label to toggle');
    await user.click(label);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

// ===== CHECKBOX GROUP TESTS =====

describe('Enhanced CheckboxGroup', () => {
  it('renders checkbox group with label', () => {
    render(
      <CheckboxGroup label='Select preferences'>
        <CheckboxWithLabel label='Option 1' />
        <CheckboxWithLabel label='Option 2' />
      </CheckboxGroup>
    );

    const groupLabel = screen.getByText('Select preferences');
    const group = screen.getByRole('group');

    expect(groupLabel).toBeInTheDocument();
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute(
      'aria-labelledby',
      expect.stringContaining('label')
    );
  });

  it('renders checkbox group with description', () => {
    render(
      <CheckboxGroup
        label='Notification settings'
        description='Choose how you want to be notified'
      >
        <CheckboxWithLabel label='Email' />
        <CheckboxWithLabel label='SMS' />
      </CheckboxGroup>
    );

    const description = screen.getByText('Choose how you want to be notified');
    const group = screen.getByRole('group');

    expect(description).toBeInTheDocument();
    expect(group).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('description')
    );
  });

  it('handles horizontal orientation', () => {
    render(
      <CheckboxGroup orientation='horizontal'>
        <CheckboxWithLabel label='Option 1' />
        <CheckboxWithLabel label='Option 2' />
      </CheckboxGroup>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveClass('flex-row', 'flex-wrap');
  });

  it('handles vertical orientation (default)', () => {
    render(
      <CheckboxGroup>
        <CheckboxWithLabel label='Option 1' />
        <CheckboxWithLabel label='Option 2' />
      </CheckboxGroup>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveClass('flex-col');
  });

  it('shows required indicator for group', () => {
    render(
      <CheckboxGroup label='Required selection' required>
        <CheckboxWithLabel label='Option 1' />
      </CheckboxGroup>
    );

    // The label element should have the required styling
    const groupLabel = screen.getByText('Required selection');
    expect(groupLabel).toHaveClass("after:content-['*']");
    expect(groupLabel).toHaveClass('after:text-destructive');
  });
});

// ===== VISUAL FEEDBACK TESTS =====

describe('Enhanced Checkbox - Visual Feedback', () => {
  it('shows correct icon for checked state', () => {
    render(<Checkbox data-testid='checkbox' checked={true} />);

    const checkbox = screen.getByTestId('checkbox');
    const checkIcon = checkbox.querySelector('svg');

    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveClass('h-full', 'w-full');
  });

  it('shows correct icon for indeterminate state', () => {
    render(<Checkbox data-testid='checkbox' checked='indeterminate' />);

    const checkbox = screen.getByTestId('checkbox');
    const minusIcon = checkbox.querySelector('svg');

    expect(minusIcon).toBeInTheDocument();
    expect(minusIcon).toHaveClass('h-full', 'w-full');
  });

  it('applies hover styles for pointer devices', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('pointer:hover:border-accent/70');
    expect(checkbox).toHaveClass('pointer:hover:before:bg-accent/10');
  });

  it('applies active scale on interaction', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('active:scale-95');
  });

  it('respects reduced motion preferences', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('motion-reduce:transition-none');
  });
});

// ===== APPLE HIG COMPLIANCE TESTS =====

describe('Enhanced Checkbox - Apple HIG Compliance', () => {
  it('uses proper spacing based on 8pt grid', () => {
    render(<Checkbox data-testid='checkbox' size='default' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('h-4', 'w-4'); // 16px = 2 * 8pt
  });

  it('implements proper focus management', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <CheckboxWithLabel data-testid='checkbox1' label='First' />
        <CheckboxWithLabel data-testid='checkbox2' label='Second' />
      </div>
    );

    const checkbox1 = screen.getByTestId('checkbox1');
    const checkbox2 = screen.getByTestId('checkbox2');

    checkbox1.focus();
    expect(checkbox1).toHaveFocus();

    await user.tab();
    expect(checkbox2).toHaveFocus();
  });

  it('maintains consistent interaction patterns', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('transition-all', 'duration-200', 'ease-out');
  });

  it('uses Apple-style rounded corners', () => {
    render(<Checkbox data-testid='checkbox' />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveClass('rounded-sm');
  });
});
