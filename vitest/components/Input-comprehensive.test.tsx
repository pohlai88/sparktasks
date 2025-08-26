/**
 * Enhanced Input Component Tests - Testing Library Best Practices
 *
 * Testing Philosophy:
 * - User-centric approach (what users see and do)
 * - Accessible queries (role, label, text)
 * - Real interaction patterns
 * - Comprehensive accessibility validation
 * - MAPS v2.2 compliance verification
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';

import { EnhancedInput, EnhancedInputField } from '../ui-enhanced/Input';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

describe('EnhancedInput', () => {
  describe('Basic Rendering', () => {
    it('renders input with default props', () => {
      render(<EnhancedInput data-testid='test-input' />);

      const input = screen.getByTestId('test-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with custom placeholder', () => {
      render(
        <EnhancedInput placeholder='Enter your name' data-testid='test-input' />
      );

      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });

    it('renders different input types correctly', () => {
      const { rerender } = render(
        <EnhancedInput type='email' data-testid='test-input' />
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'email');

      rerender(<EnhancedInput type='password' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'type',
        'password'
      );

      rerender(<EnhancedInput type='number' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'type',
        'number'
      );
    });
  });

  describe('Label and Description System', () => {
    it('renders with label correctly', () => {
      render(<EnhancedInput label='Email Address' data-testid='test-input' />);

      const input = screen.getByLabelText('Email Address');
      expect(input).toBeInTheDocument();

      const label = screen.getByText('Email Address');
      expect(label).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(
        <EnhancedInput
          label='Password'
          description='Must be at least 8 characters long'
          data-testid='test-input'
        />
      );

      const description = screen.getByText(
        'Must be at least 8 characters long'
      );
      expect(description).toBeInTheDocument();

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('description')
      );
    });

    it('shows required indicator correctly', () => {
      render(
        <EnhancedInput
          label='Required Field'
          required
          data-testid='test-input'
        />
      );

      const requiredIndicator = screen.getByText('*');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveAttribute('aria-label', 'required');
    });

    it('shows optional indicator correctly', () => {
      render(
        <EnhancedInput
          label='Optional Field'
          optional
          data-testid='test-input'
        />
      );

      const optionalIndicator = screen.getByText('(optional)');
      expect(optionalIndicator).toBeInTheDocument();
    });

    it('renders hint text', () => {
      render(
        <EnhancedInput
          label='Username'
          hint='This will be visible to other users'
          data-testid='test-input'
        />
      );

      const hint = screen.getByText('This will be visible to other users');
      expect(hint).toBeInTheDocument();

      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('hint')
      );
    });
  });

  describe('Validation States', () => {
    it('displays error message correctly', () => {
      render(
        <EnhancedInput
          label='Email'
          errorMessage='Please enter a valid email address'
          data-testid='test-input'
        />
      );

      const errorMessage = screen.getByText(
        'Please enter a valid email address'
      );
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('error')
      );
    });

    it('applies correct styling for different states', () => {
      const { rerender } = render(
        <EnhancedInput state='success' data-testid='test-input' />
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-state',
        'success'
      );

      rerender(<EnhancedInput state='warning' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-state',
        'warning'
      );

      rerender(<EnhancedInput state='error' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-state',
        'error'
      );
    });

    it('error message overrides state prop', () => {
      render(
        <EnhancedInput
          state='success'
          errorMessage='This is an error'
          data-testid='test-input'
        />
      );

      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('data-state', 'error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Icons and Enhancements', () => {
    it('renders start icon correctly', () => {
      const SearchIcon = () => <svg data-testid='search-icon' />;

      render(
        <EnhancedInput
          label='Search'
          startIcon={<SearchIcon />}
          data-testid='test-input'
        />
      );

      const icon = screen.getByTestId('search-icon');
      expect(icon).toBeInTheDocument();
    });

    it('renders end icon correctly', () => {
      const InfoIcon = () => <svg data-testid='info-icon' />;

      render(
        <EnhancedInput
          label='Info Field'
          endIcon={<InfoIcon />}
          data-testid='test-input'
        />
      );

      const icon = screen.getByTestId('info-icon');
      expect(icon).toBeInTheDocument();
    });

    it('shows loading spinner', () => {
      render(
        <EnhancedInput label='Loading Field' loading data-testid='test-input' />
      );

      // Loading spinner should be present
      const spinner = screen
        .getByTestId('test-input')
        .parentElement?.querySelector('[class*="animate-spin"]');
      expect(spinner).toBeInTheDocument();
    });

    it('shows clear button when clearable and has value', () => {
      const handleClear = vi.fn();

      render(
        <EnhancedInput
          label='Clearable Field'
          value='some text'
          clearable
          onClear={handleClear}
          data-testid='test-input'
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear input/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('does not show clear button when no value', () => {
      render(
        <EnhancedInput
          label='Clearable Field'
          value=''
          clearable
          onClear={vi.fn()}
          data-testid='test-input'
        />
      );

      const clearButton = screen.queryByRole('button', {
        name: /clear input/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles typing correctly', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <EnhancedInput
          label='Text Input'
          onChange={handleChange}
          data-testid='test-input'
        />
      );

      const input = screen.getByLabelText('Text Input');
      await user.type(input, 'Hello World');

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('Hello World');
    });

    it('handles clear button click', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();

      render(
        <EnhancedInput
          label='Clearable Input'
          value='text to clear'
          clearable
          onClear={handleClear}
          data-testid='test-input'
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear input/i });
      await user.click(clearButton);

      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('handles focus and blur correctly', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(
        <EnhancedInput
          label='Focus Test'
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-testid='test-input'
        />
      );

      const input = screen.getByLabelText('Focus Test');

      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('respects disabled state', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <EnhancedInput
          label='Disabled Input'
          disabled
          onChange={handleChange}
          data-testid='test-input'
        />
      );

      const input = screen.getByLabelText('Disabled Input');
      expect(input).toBeDisabled();

      await user.type(input, 'Should not work');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Variant and Size Props', () => {
    it('applies different variants correctly', () => {
      const { rerender } = render(
        <EnhancedInput variant='ghost' data-testid='test-input' />
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-variant',
        'ghost'
      );

      rerender(<EnhancedInput variant='filled' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-variant',
        'filled'
      );

      rerender(<EnhancedInput variant='outline' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-variant',
        'outline'
      );
    });

    it('applies different sizes correctly', () => {
      const { rerender } = render(
        <EnhancedInput size='sm' data-testid='test-input' />
      );
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-size',
        'sm'
      );

      rerender(<EnhancedInput size='lg' data-testid='test-input' />);
      expect(screen.getByTestId('test-input')).toHaveAttribute(
        'data-size',
        'lg'
      );
    });

    it('applies AAA enforcement correctly', () => {
      render(<EnhancedInput enforceAAA data-testid='test-input' />);

      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('data-aaa', 'true');
    });
  });

  describe('EnhancedInputField Wrapper', () => {
    it('renders field wrapper correctly', () => {
      render(
        <EnhancedInputField
          label='Field Wrapper Test'
          description='This tests the field wrapper'
          data-testid='field-input'
        />
      );

      const input = screen.getByLabelText('Field Wrapper Test');
      expect(input).toBeInTheDocument();

      const description = screen.getByText('This tests the field wrapper');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('has no accessibility violations with basic setup', async () => {
      const { container } = render(
        <EnhancedInput
          label='Accessible Input'
          description='This is an accessible input field'
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with error state', async () => {
      const { container } = render(
        <EnhancedInput
          label='Error Input'
          errorMessage='This field has an error'
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with complex setup', async () => {
      const { container } = render(
        <EnhancedInput
          label='Complex Input'
          description='A complex input with multiple features'
          hint='Additional guidance text'
          required
          startIcon={<svg data-testid='icon' />}
          clearable
          value='test value'
          onClear={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('manages ARIA attributes correctly', () => {
      render(
        <EnhancedInput
          label='ARIA Test'
          description='Test description'
          hint='Test hint'
          errorMessage='Test error'
          aria-label='Custom aria label'
          data-testid='aria-input'
        />
      );

      const input = screen.getByTestId('aria-input');

      // Should have aria-label
      expect(input).toHaveAttribute('aria-label', 'Custom aria label');

      // Should have aria-invalid for error state
      expect(input).toHaveAttribute('aria-invalid', 'true');

      // Should have aria-describedby linking to description, hint, and error
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('description');
      expect(describedBy).toContain('hint');
      expect(describedBy).toContain('error');
    });
  });

  describe('MAPS v2.2 Compliance', () => {
    it('includes proper data attributes for MAPS compliance', () => {
      render(
        <EnhancedInput
          variant='floating'
          size='lg'
          state='success'
          vibrancy='glass'
          enforceAAA
          data-testid='maps-input'
        />
      );

      const input = screen.getByTestId('maps-input');

      expect(input).toHaveAttribute('data-variant', 'floating');
      expect(input).toHaveAttribute('data-size', 'lg');
      expect(input).toHaveAttribute('data-state', 'success');
      expect(input).toHaveAttribute('data-aaa', 'true');
    });

    it('follows dark-first philosophy with proper token usage', () => {
      render(
        <EnhancedInput label='Dark-First Input' data-testid='dark-input' />
      );

      const input = screen.getByTestId('dark-input');

      // Verify CSS classes are applied (token-based styling)
      expect(input).toHaveClass('bg-input', 'text-foreground', 'border-border');
    });
  });
});
