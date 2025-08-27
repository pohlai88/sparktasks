/**
 * Enhanced Combobox Component Tests - MAPS v2.2
 *
 * Comprehensive test suite ensuring component quality and accessibility
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, describe, it, vi } from 'vitest';

import {
  EnhancedCombobox,
  EnhancedComboboxInput,
  EnhancedComboboxContent,
  EnhancedComboboxItem,
  ComboboxFactory,
  type ComboboxOption,
} from '@/components/ui-enhanced/Combobox';

// Mock options for testing
const mockOptions: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
];

describe('EnhancedCombobox', () => {
  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<EnhancedCombobox options={mockOptions} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('displays custom placeholder', () => {
      render(
        <EnhancedCombobox
          options={mockOptions}
          placeholder='Choose a fruit...'
        />
      );

      expect(screen.getByText('Choose a fruit...')).toBeInTheDocument();
    });

    it('opens dropdown when clicked', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('selects option when clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <EnhancedCombobox options={mockOptions} onValueChange={onValueChange} />
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByText('Apple');
        user.click(option);
      });

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith('apple');
      });
    });

    it('displays selected value', () => {
      render(<EnhancedCombobox options={mockOptions} value='apple' />);

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('shows search input when searchable is true', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} searchable />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });
    });

    it('filters options based on search input', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} searchable />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText('Search...');
        await user.type(searchInput, 'app');
      });

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      });
    });

    it('shows empty message when no options match search', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} searchable />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText('Search...');
        await user.type(searchInput, 'nonexistent');
      });

      await waitFor(() => {
        expect(screen.getByText('No options found.')).toBeInTheDocument();
      });
    });

    it('uses custom search placeholder', async () => {
      const user = userEvent.setup();
      render(
        <EnhancedCombobox
          options={mockOptions}
          searchable
          searchPlaceholder='Find fruit...'
        />
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('Find fruit...')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Clearable Functionality', () => {
    it('shows clear button when clearable and value is selected', () => {
      render(
        <EnhancedCombobox options={mockOptions} value='apple' clearable />
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('clears selection when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <EnhancedCombobox
          options={mockOptions}
          value='apple'
          clearable
          onValueChange={onValueChange}
        />
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('does not show clear button when no value is selected', () => {
      render(<EnhancedCombobox options={mockOptions} clearable />);

      const clearButton = screen.queryByRole('button', { name: /clear/i });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables trigger when disabled prop is true', () => {
      render(<EnhancedCombobox options={mockOptions} disabled />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
    });

    it('does not open dropdown when disabled', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} disabled />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });

    it('disables specific options when option.disabled is true', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const disabledOption = screen.getByText('Disabled Option');
        expect(disabledOption.closest('div')).toHaveClass(
          'pointer-events-none'
        );
      });
    });
  });

  describe('Form Integration', () => {
    it('creates hidden input with name and value for form submission', () => {
      render(
        <EnhancedCombobox options={mockOptions} name='fruit' value='apple' />
      );

      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', 'fruit');
      expect(hiddenInput).toHaveAttribute('value', 'apple');
    });

    it('marks hidden input as required when required prop is true', () => {
      render(<EnhancedCombobox options={mockOptions} name='fruit' required />);

      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute('required');
    });
  });

  describe('Custom Filter Function', () => {
    it('uses custom filter function when provided', async () => {
      const user = userEvent.setup();
      const customFilter = vi.fn((options: ComboboxOption[], search: string) =>
        options.filter((option: ComboboxOption) =>
          option.value.includes(search)
        )
      );

      render(
        <EnhancedCombobox
          options={mockOptions}
          searchable
          filterFunction={customFilter}
        />
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText('Search...');
        await user.type(searchInput, 'app');
      });

      expect(customFilter).toHaveBeenCalledWith(mockOptions, 'app');
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works in uncontrolled mode with defaultValue', () => {
      render(<EnhancedCombobox options={mockOptions} defaultValue='banana' />);

      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('works in controlled mode with value prop', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('apple');

        return (
          <EnhancedCombobox
            options={mockOptions}
            value={value}
            onValueChange={setValue}
          />
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Apple')).toBeInTheDocument();

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(async () => {
        const option = screen.getByText('Banana');
        await user.click(option);
      });

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('manages search value independently', async () => {
      const user = userEvent.setup();
      const onSearchValueChange = vi.fn();

      render(
        <EnhancedCombobox
          options={mockOptions}
          searchable
          onSearchValueChange={onSearchValueChange}
        />
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(async () => {
        const searchInput = screen.getByPlaceholderText('Search...');
        await user.type(searchInput, 'test');
      });

      expect(onSearchValueChange).toHaveBeenCalledWith('test');
    });
  });

  describe('Variant Classes', () => {
    it('applies variant classes correctly', () => {
      render(
        <EnhancedCombobox
          options={mockOptions}
          variant='outline'
          size='lg'
          state='success'
        />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('bg-transparent'); // outline variant
      expect(trigger).toHaveClass('min-h-12'); // lg size
      expect(trigger).toHaveClass('border-success'); // success state
    });

    it('applies AAA enforcement classes when enforceAAA is true', () => {
      render(<EnhancedCombobox options={mockOptions} enforceAAA />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('aaa:border-border-strong');
    });

    it('applies vibrancy classes when vibrancy prop is set', () => {
      render(<EnhancedCombobox options={mockOptions} vibrancy='glass' />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('bg-input/80');
    });
  });

  describe('Factory Functions', () => {
    it('creates standard combobox configuration', () => {
      const config = ComboboxFactory.standard();

      expect(config).toEqual({
        variant: 'default',
        size: 'md',
        density: 'comfortable',
        searchable: true,
        clearable: false,
      });
    });

    it('creates compact combobox configuration', () => {
      const config = ComboboxFactory.compact();

      expect(config).toEqual({
        variant: 'default',
        size: 'sm',
        density: 'compact',
        searchable: true,
        clearable: false,
      });
    });

    it('creates glass combobox configuration', () => {
      const config = ComboboxFactory.glass();

      expect(config).toEqual({
        variant: 'floating',
        size: 'md',
        density: 'comfortable',
        vibrancy: 'glass',
        searchable: true,
        clearable: true,
      });
    });

    it('creates accessible combobox configuration', () => {
      const config = ComboboxFactory.accessible();

      expect(config).toEqual({
        variant: 'outline',
        size: 'lg',
        density: 'comfortable',
        enforceAAA: true,
        searchable: true,
        clearable: true,
      });
    });

    it('creates touch combobox configuration', () => {
      const config = ComboboxFactory.touch();

      expect(config).toEqual({
        variant: 'filled',
        size: 'touch',
        density: 'comfortable',
        searchable: true,
        clearable: true,
      });
    });

    it('allows overriding factory configurations', () => {
      const config = ComboboxFactory.standard({ clearable: true, size: 'lg' });

      expect(config).toEqual({
        variant: 'default',
        size: 'lg',
        density: 'comfortable',
        searchable: true,
        clearable: true,
      });
    });
  });

  describe('Sub-components', () => {
    describe('EnhancedComboboxInput', () => {
      it('renders input with correct classes', () => {
        render(<EnhancedComboboxInput placeholder='Test input' />);

        const input = screen.getByPlaceholderText('Test input');
        expect(input).toHaveClass('flex-1');
        expect(input).toHaveClass('bg-transparent');
      });

      it('applies density variant classes', () => {
        render(<EnhancedComboboxInput density='compact' />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('py-0.5');
      });
    });

    describe('EnhancedComboboxContent', () => {
      it('renders content with correct classes', () => {
        render(
          <EnhancedComboboxContent>
            <div>Content</div>
          </EnhancedComboboxContent>
        );

        const content = screen.getByText('Content').parentElement;
        expect(content).toHaveClass('rounded-md');
        expect(content).toHaveClass('border');
      });

      it('applies vibrancy classes', () => {
        render(
          <EnhancedComboboxContent vibrancy='glass'>
            <div>Content</div>
          </EnhancedComboboxContent>
        );

        const content = screen.getByText('Content').parentElement;
        expect(content).toHaveClass('backdrop-blur-md');
      });
    });

    describe('EnhancedComboboxItem', () => {
      it('renders item with correct classes', () => {
        render(
          <EnhancedComboboxItem value='test'>Test Item</EnhancedComboboxItem>
        );

        const item = screen.getByText('Test Item');
        expect(item).toHaveClass('relative');
        expect(item).toHaveClass('flex');
        expect(item).toHaveAttribute('data-value', 'test');
      });

      it('applies disabled classes when disabled', () => {
        render(
          <EnhancedComboboxItem value='test' disabled>
            Test Item
          </EnhancedComboboxItem>
        );

        const item = screen.getByText('Test Item');
        expect(item).toHaveClass('pointer-events-none');
        expect(item).toHaveAttribute('data-disabled', 'true');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<EnhancedCombobox options={mockOptions} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when dropdown opens', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} />);

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<EnhancedCombobox options={mockOptions} />);

      const trigger = screen.getByRole('button');
      await user.tab();
      expect(trigger).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<EnhancedCombobox options={[]} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('handles undefined value gracefully', () => {
      // Test with no value prop instead of undefined value
      render(<EnhancedCombobox options={mockOptions} />);

      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('handles custom empty message', async () => {
      const user = userEvent.setup();
      render(
        <EnhancedCombobox options={[]} emptyMessage='No fruits available' />
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('No fruits available')).toBeInTheDocument();
      });
    });
  });
});
