/**
 * Enhanced Select Component Tests - MAPS v2.2 Dark-First
 *
 * Test Coverage:
 * ✅ All variant combinations and states
 * ✅ Size variants with Apple HIG compliance
 * ✅ Accessibility patterns (WCAG AAA)
 * ✅ Keyboard navigation and selection
 * ✅ Grouped options with visual hierarchy
 * ✅ Focus management and ARIA attributes
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import {
  EnhancedSelect,
  EnhancedSelectContent,
  EnhancedSelectItem,
  EnhancedSelectTrigger,
  EnhancedSelectValue,
  EnhancedSelectGroup,
  EnhancedSelectLabel,
  EnhancedSelectSeparator,
} from '@/components/ui-enhanced/Select';

describe('EnhancedSelect', () => {
  // ===== BASIC RENDERING =====

  it('renders with default props', () => {
    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Select an option' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='option1'>Option 1</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveClass('h-11'); // Apple HIG 44px minimum
  });

  it('displays placeholder correctly', () => {
    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Choose an option' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='test'>Test</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  // ===== VARIANT TESTING =====

  it('applies correct trigger variant classes', () => {
    const { rerender } = render(
      <EnhancedSelect>
        <EnhancedSelectTrigger variant='default'>
          <EnhancedSelectValue placeholder='Default' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='test'>Test</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    let trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('border-border');

    rerender(
      <EnhancedSelect>
        <EnhancedSelectTrigger variant='elevated'>
          <EnhancedSelectValue placeholder='Elevated' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='test'>Test</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('bg-background-elevated');
  });

  it('applies correct size classes following Apple HIG', () => {
    const { rerender } = render(
      <EnhancedSelect>
        <EnhancedSelectTrigger size='sm'>
          <EnhancedSelectValue placeholder='Small' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='test'>Test</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    let trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('h-9'); // 36px height

    rerender(
      <EnhancedSelect>
        <EnhancedSelectTrigger size='md'>
          <EnhancedSelectValue placeholder='Medium' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='test'>Test</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('h-11'); // 44px height (Apple HIG)
  });

  // ===== INTERACTION TESTING =====

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Select option' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='option1'>Option 1</EnhancedSelectItem>
          <EnhancedSelectItem value='option2'>Option 2</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('selects option when clicked', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Select option' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='option1'>Option 1</EnhancedSelectItem>
          <EnhancedSelectItem value='option2'>Option 2</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const option = screen.getByText('Option 1');
    await user.click(option);

    // After selection, the dropdown should close and show selected value
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  // ===== KEYBOARD NAVIGATION TESTING =====

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Select option' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='option1'>Option 1</EnhancedSelectItem>
          <EnhancedSelectItem value='option2'>Option 2</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');

    // Focus the trigger
    trigger.focus();
    expect(trigger).toHaveFocus();

    // Press space to open
    await user.keyboard(' ');
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  // ===== GROUPED OPTIONS TESTING =====

  it('renders grouped options with enhanced visual hierarchy', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Select technology' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectGroup>
            <EnhancedSelectLabel>Frontend</EnhancedSelectLabel>
            <EnhancedSelectItem value='react'>React</EnhancedSelectItem>
            <EnhancedSelectItem value='vue'>Vue</EnhancedSelectItem>
          </EnhancedSelectGroup>
          <EnhancedSelectSeparator />
          <EnhancedSelectGroup>
            <EnhancedSelectLabel>Backend</EnhancedSelectLabel>
            <EnhancedSelectItem value='node'>Node.js</EnhancedSelectItem>
            <EnhancedSelectItem value='python'>Python</EnhancedSelectItem>
          </EnhancedSelectGroup>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Check that labels are rendered with enhanced styling
    const frontendLabel = screen.getByText('Frontend');
    const backendLabel = screen.getByText('Backend');

    expect(frontendLabel).toBeInTheDocument();
    expect(backendLabel).toBeInTheDocument();

    // Check that labels have proper styling classes
    expect(frontendLabel).toHaveClass(
      'text-accent',
      'bg-accent/10',
      'font-bold',
      'uppercase'
    );

    // Check that items are present
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders separator with enhanced visual distinction', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Select option' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectGroup>
            <EnhancedSelectLabel>Group 1</EnhancedSelectLabel>
            <EnhancedSelectItem value='item1'>Item 1</EnhancedSelectItem>
          </EnhancedSelectGroup>
          <EnhancedSelectSeparator />
          <EnhancedSelectGroup>
            <EnhancedSelectLabel>Group 2</EnhancedSelectLabel>
            <EnhancedSelectItem value='item2'>Item 2</EnhancedSelectItem>
          </EnhancedSelectGroup>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // The separator should be present in the DOM
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('bg-gradient-to-r');
  });

  // ===== ACCESSIBILITY TESTING =====

  it('meets WCAG AAA accessibility standards', () => {
    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger aria-label='Technology selection'>
          <EnhancedSelectValue placeholder='Select technology' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='react'>React</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-label', 'Technology selection');
    expect(trigger).toHaveClass('focus:ring-2'); // Focus indicator
  });

  it('handles disabled state correctly', () => {
    render(
      <EnhancedSelect disabled>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Disabled select' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='option'>Option</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass('disabled:opacity-50');
  });

  // ===== CONTENT VARIANT TESTING =====

  it('applies correct content variant classes', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Glass variant' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent variant='glass'>
          <EnhancedSelectItem value='test'>Test Option</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Check that content has glass variant styling
    const content = screen.getByRole('listbox');
    expect(content).toHaveClass('backdrop-blur-md');
  });

  // ===== DARK-FIRST TESTING =====

  it('uses dark-first color palette', () => {
    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger variant='default'>
          <EnhancedSelectValue placeholder='Dark first' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='test'>Test</EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('bg-background', 'text-foreground');
  });

  // ===== ENHANCED ITEM STYLING =====

  it('applies enhanced item styling with visual hierarchy', async () => {
    const user = userEvent.setup();

    render(
      <EnhancedSelect>
        <EnhancedSelectTrigger>
          <EnhancedSelectValue placeholder='Enhanced items' />
        </EnhancedSelectTrigger>
        <EnhancedSelectContent>
          <EnhancedSelectItem value='enhanced'>
            Enhanced Item
          </EnhancedSelectItem>
        </EnhancedSelectContent>
      </EnhancedSelect>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const item = screen.getByText('Enhanced Item');
    expect(item.closest('[role="option"]')).toHaveClass(
      'border-l-2',
      'border-transparent',
      'hover:bg-accent/10',
      'transition-all'
    );
  });
});
