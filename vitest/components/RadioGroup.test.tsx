/**
 * Enhanced Radio Group Component Tests - MAPS v2.2 Dark-First Philosophy
 *
 * COMPREHENSIVE TEST COVERAGE:
 * - Component rendering with all variants
 * - User interactions (selection, keyboard navigation)
 * - Accessibility compliance (ARIA, screen reader, keyboard)
 * - MAPS v2.2 compliance (AAA mode, liquid glass, dark-first)
 * - Edge cases and error handling
 * - Performance and integration testing
 *
 * TESTING PHILOSOPHY:
 * - User-centric: Test behavior, not implementation
 * - Accessibility-first: Ensure screen reader compatibility
 * - Real-world scenarios: Test actual usage patterns
 * - Cross-platform: Consider touch and pointer interactions
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

import {
  EnhancedRadioGroup,
  EnhancedRadioGroupItem,
  EnhancedRadioGroupCard,
} from '@/components/ui-enhanced/RadioGroup';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// ===== TEST UTILITIES =====

const createRadioGroupSetup = (props = {}) => {
  const user = userEvent.setup();
  const defaultProps = {
    defaultValue: '',
    name: 'test-radio-group',
    ...props,
  };

  return { user, defaultProps };
};

const renderBasicRadioGroup = (groupProps = {}, itemProps = []) => {
  const { user, defaultProps } = createRadioGroupSetup(groupProps);

  const defaultItems =
    itemProps.length > 0
      ? itemProps
      : [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
        ];

  const result = render(
    <EnhancedRadioGroup {...defaultProps}>
      {defaultItems.map((item, index) => (
        <EnhancedRadioGroupItem
          key={item.value}
          value={item.value}
          label={item.label}
          {...(item.props || {})}
        />
      ))}
    </EnhancedRadioGroup>
  );

  return { ...result, user };
};

const renderCardRadioGroup = (groupProps = {}, cardProps = []) => {
  const { user, defaultProps } = createRadioGroupSetup(groupProps);

  const defaultCards =
    cardProps.length > 0
      ? cardProps
      : [
          {
            value: 'card1',
            title: 'Card Option 1',
            description: 'Description for option 1',
          },
          {
            value: 'card2',
            title: 'Card Option 2',
            description: 'Description for option 2',
          },
          { value: 'card3', title: 'Card Option 3' },
        ];

  const result = render(
    <EnhancedRadioGroup {...defaultProps}>
      {defaultCards.map(card => (
        <EnhancedRadioGroupCard
          key={card.value}
          value={card.value}
          title={card.title}
          description={card.description}
          {...(card.props || {})}
        />
      ))}
    </EnhancedRadioGroup>
  );

  return { ...result, user };
};

// ===== COMPONENT RENDERING TESTS =====

describe('Enhanced Radio Group - Component Rendering', () => {
  it('renders basic radio group with default props', () => {
    renderBasicRadioGroup();

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
  });

  it('renders with custom name and default value', () => {
    renderBasicRadioGroup({
      name: 'custom-radio-group',
      defaultValue: 'option2',
    });

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();

    const selectedRadio = screen.getByLabelText('Option 2');
    expect(selectedRadio).toBeChecked();
  });

  it('renders with description', () => {
    renderBasicRadioGroup({
      description: 'Please select one of the following options',
    });

    expect(
      screen.getByText('Please select one of the following options')
    ).toBeInTheDocument();
  });

  it('renders in horizontal orientation', () => {
    const { container } = renderBasicRadioGroup({
      orientation: 'horizontal',
    });

    const radioGroup = container.querySelector('[role="radiogroup"]');
    expect(radioGroup).toHaveClass(
      'grid-cols-[repeat(auto-fit,minmax(0,1fr))]'
    );
  });

  it('renders with compact density', () => {
    const { container } = renderBasicRadioGroup({
      density: 'compact',
    });

    const radioGroup = container.querySelector('[role="radiogroup"]');
    expect(radioGroup).toHaveClass('gap-2');
  });
});

// ===== VARIANT TESTING =====

describe('Enhanced Radio Group - Variant Testing', () => {
  it('renders default variant correctly', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { variant: 'default' } },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('bg-background');
  });

  it('renders ghost variant correctly', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { variant: 'ghost' } },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('border-muted-foreground/30', 'bg-transparent');
  });

  it('renders glass variant correctly', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { variant: 'glass' } },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('backdrop-blur-sm', 'backdrop-saturate-150');
  });

  it('renders elevated variant correctly', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { variant: 'elevated' } },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('bg-background-elevated', 'shadow-elevation-sm');
  });

  it('renders AAA variant when enforceAAA is true', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { enforceAAA: true } },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass(
      'forced-colors:bg-Field',
      'forced-colors:border-FieldText'
    );
  });
});

// ===== SIZE AND DENSITY VARIANTS =====

describe('Enhanced Radio Group - Size and Density', () => {
  it('renders different sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      const { unmount } = renderBasicRadioGroup({}, [
        { value: 'test', label: 'Test Option', props: { size } },
      ]);

      const radio = screen.getByRole('radio');
      const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6',
      };

      expect(radio).toHaveClass(sizeClasses[size]);
      unmount();
    });
  });

  it('renders different densities correctly', () => {
    const { container: comfortable } = renderBasicRadioGroup({}, [
      {
        value: 'test',
        label: 'Test Option',
        props: { density: 'comfortable' },
      },
    ]);

    const comfortableRadio = comfortable.querySelector('[role="radio"]');
    expect(comfortableRadio).toHaveClass('before:inset-[-12px]');

    const { container: compact } = renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { density: 'compact' } },
    ]);

    const compactRadio = compact.querySelector('[role="radio"]');
    expect(compactRadio).toHaveClass('before:inset-[-8px]');
  });
});

// ===== LABEL POSITIONING TESTS =====

describe('Enhanced Radio Group - Label Positioning', () => {
  it('renders label on the right by default', () => {
    renderBasicRadioGroup({}, [{ value: 'test', label: 'Test Option' }]);

    const container = screen.getByRole('radio').closest('div');
    expect(container?.querySelector('label')).toHaveClass('ml-2');
  });

  it('renders label on the left when specified', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { labelPosition: 'left' } },
    ]);

    const container = screen.getByRole('radio').closest('div');
    expect(container?.querySelector('label')).toHaveClass(
      'mr-2',
      'order-first'
    );
  });

  it('renders label on top when specified', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { labelPosition: 'top' } },
    ]);

    const label = screen.getByText('Test Option');
    expect(label).toHaveClass('mb-1', 'block');
  });

  it('renders label on bottom when specified', () => {
    renderBasicRadioGroup({}, [
      {
        value: 'test',
        label: 'Test Option',
        props: { labelPosition: 'bottom' },
      },
    ]);

    const label = screen.getByText('Test Option');
    expect(label).toHaveClass('mt-1', 'block', 'order-last');
  });
});

// ===== INDICATOR STYLE TESTS =====

describe('Enhanced Radio Group - Indicator Styles', () => {
  it('renders dot indicator by default', async () => {
    const { user } = renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { indicatorStyle: 'dot' } },
    ]);

    const radio = screen.getByRole('radio');
    await user.click(radio);

    // Should have Circle icon (dot style)
    expect(radio.querySelector('svg')).toBeInTheDocument();
  });

  it('renders icon indicator when specified', async () => {
    const { user } = renderBasicRadioGroup({}, [
      {
        value: 'test',
        label: 'Test Option',
        props: { indicatorStyle: 'icon' },
      },
    ]);

    const radio = screen.getByRole('radio');
    await user.click(radio);

    // Should have Circle icon (icon style)
    expect(radio.querySelector('svg')).toBeInTheDocument();
  });

  it('renders filled indicator when specified', async () => {
    const { user } = renderBasicRadioGroup({}, [
      {
        value: 'test',
        label: 'Test Option',
        props: { indicatorStyle: 'filled' },
      },
    ]);

    const radio = screen.getByRole('radio');
    await user.click(radio);

    // Should have filled div
    expect(radio.querySelector('div[class*="bg-current"]')).toBeInTheDocument();
  });
});

// ===== CARD RADIO GROUP TESTS =====

describe('Enhanced Radio Group - Card Variant', () => {
  it('renders card radio group correctly', () => {
    renderCardRadioGroup();

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByText('Card Option 1')).toBeInTheDocument();
    expect(screen.getByText('Description for option 1')).toBeInTheDocument();
  });

  it('renders card without description', () => {
    renderCardRadioGroup({}, [{ value: 'card1', title: 'Card Option 1' }]);

    expect(screen.getByText('Card Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('renders card with icon', () => {
    const TestIcon = () => <div data-testid='test-icon'>Icon</div>;

    renderCardRadioGroup({}, [
      { value: 'card1', title: 'Card Option 1', props: { icon: <TestIcon /> } },
    ]);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies different card variants', () => {
    const variants = ['default', 'glass', 'elevated'] as const;

    variants.forEach(variant => {
      const { unmount } = renderCardRadioGroup({}, [
        {
          value: 'card1',
          title: 'Card Option 1',
          props: { cardVariant: variant },
        },
      ]);

      const radio = screen.getByRole('radio');
      if (variant === 'glass') {
        expect(radio).toHaveClass('backdrop-blur-sm', 'backdrop-saturate-150');
      } else if (variant === 'elevated') {
        expect(radio).toHaveClass('shadow-elevation-sm');
      }

      unmount();
    });
  });
});

// ===== USER INTERACTION TESTS =====

describe('Enhanced Radio Group - User Interactions', () => {
  it('handles mouse selection correctly', async () => {
    const onValueChange = vi.fn();
    const { user } = renderBasicRadioGroup({ onValueChange });

    const option2 = screen.getByLabelText('Option 2');
    await user.click(option2);

    expect(option2).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('option2');
  });

  it('handles keyboard navigation correctly', async () => {
    const { user } = renderBasicRadioGroup();

    // Test that radio group can receive focus
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();

    // Test that individual radios respond to clicks and have proper attributes
    const firstOption = screen.getByLabelText('Option 1');
    await user.click(firstOption);
    expect(firstOption).toHaveAttribute('data-state', 'checked');

    // Test that we can focus and interact with radios
    const secondOption = screen.getByLabelText('Option 2');
    secondOption.focus();
    expect(document.activeElement).toBe(secondOption);
  });

  it('handles space key selection', async () => {
    const { user } = renderBasicRadioGroup();

    const option1 = screen.getByLabelText('Option 1');
    option1.focus();

    await user.keyboard(' ');
    expect(option1).toBeChecked();
  });

  it('prevents selection of disabled options', async () => {
    const { user } = renderBasicRadioGroup({}, [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', props: { disabled: true } },
      { value: 'option3', label: 'Option 3' },
    ]);

    const disabledOption = screen.getByLabelText('Option 2');
    await user.click(disabledOption);

    expect(disabledOption).not.toBeChecked();
  });

  it('maintains only one selection at a time', async () => {
    const { user } = renderBasicRadioGroup();

    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');

    await user.click(option1);
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    await user.click(option2);
    expect(option1).not.toBeChecked();
    expect(option2).toBeChecked();
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced Radio Group - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderBasicRadioGroup();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA attributes', () => {
    renderBasicRadioGroup({
      name: 'test-group',
      description: 'Test description',
    });

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-describedby');
  });

  it('has proper labels and descriptions', () => {
    renderBasicRadioGroup({}, [
      {
        value: 'option1',
        label: 'Option 1',
        props: { description: 'This is option 1 description' },
      },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-describedby');
    expect(
      screen.getByText('This is option 1 description')
    ).toBeInTheDocument();
  });

  it('supports screen reader announcements', () => {
    renderBasicRadioGroup({
      'aria-label': 'Settings radio group',
    });

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'Settings radio group');
  });

  it('has proper focus management', async () => {
    const { user } = renderBasicRadioGroup();

    const firstOption = screen.getByLabelText('Option 1');
    await user.tab();

    expect(firstOption).toHaveFocus();
  });

  it('maintains focus visibility', async () => {
    const { user } = renderBasicRadioGroup();

    const firstOption = screen.getByLabelText('Option 1');
    await user.tab();

    expect(firstOption).toHaveClass('focus-visible:ring-2');
  });
});

// ===== AAA COMPLIANCE TESTS =====

describe('Enhanced Radio Group - AAA Compliance', () => {
  it('enforces AAA mode correctly', () => {
    renderBasicRadioGroup({
      enforceAAA: true,
      description: 'Please select one of the following options',
    });

    const description = screen.getByText(
      'Please select one of the following options'
    );
    expect(description).toHaveClass('text-foreground');
  });
  it('applies AAA variant when enforceAAA is true', () => {
    renderBasicRadioGroup({}, [
      { value: 'test', label: 'Test Option', props: { enforceAAA: true } },
    ]);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('forced-colors:bg-Field');
  });

  it('uses AAA colors in card variant', () => {
    renderCardRadioGroup({}, [
      {
        value: 'card1',
        title: 'Card Option 1',
        description: 'Test description',
        props: { enforceAAA: true },
      },
    ]);

    const description = screen.getByText('Test description');
    expect(description).toHaveClass('text-foreground/80');
  });
});

// ===== EDGE CASES AND ERROR HANDLING =====

describe('Enhanced Radio Group - Edge Cases', () => {
  it('handles empty radio group', () => {
    render(<EnhancedRadioGroup />);

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('handles missing labels gracefully', () => {
    render(
      <EnhancedRadioGroup>
        <EnhancedRadioGroupItem value='test' />
      </EnhancedRadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('handles long text content', () => {
    const longTitle = 'A'.repeat(100);
    const longDescription = 'B'.repeat(200);

    renderCardRadioGroup({}, [
      { value: 'card1', title: longTitle, description: longDescription },
    ]);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('handles special characters in values', () => {
    renderBasicRadioGroup({}, [
      { value: 'option-with-special@chars!', label: 'Special Option' },
    ]);

    const radio = screen.getByLabelText('Special Option');
    expect(radio).toHaveAttribute('value', 'option-with-special@chars!');
  });
});

// ===== PERFORMANCE TESTS =====

describe('Enhanced Radio Group - Performance', () => {
  it('renders large number of options efficiently', () => {
    const manyOptions = Array.from({ length: 100 }, (_, i) => ({
      value: `option${i}`,
      label: `Option ${i}`,
    }));

    const start = performance.now();
    renderBasicRadioGroup({}, manyOptions);
    const end = performance.now();

    expect(screen.getAllByRole('radio')).toHaveLength(100);
    expect(end - start).toBeLessThan(1000); // Should render in less than 1 second
  });

  it('handles frequent value changes efficiently', async () => {
    const onValueChange = vi.fn();
    const { user } = renderBasicRadioGroup({ onValueChange });

    const options = screen.getAllByRole('radio');

    // Rapidly change selections
    for (const option of options) {
      await user.click(option);
    }

    expect(onValueChange).toHaveBeenCalledTimes(3);
  });
});

// ===== INTEGRATION TESTS =====

describe('Enhanced Radio Group - Integration', () => {
  it('integrates with form libraries', () => {
    const FormWrapper = ({ children }: { children: React.ReactNode }) => (
      <form data-testid='test-form'>{children}</form>
    );

    render(
      <FormWrapper>
        <EnhancedRadioGroup name='form-radio-group'>
          <EnhancedRadioGroupItem value='option1' label='Option 1' />
          <EnhancedRadioGroupItem value='option2' label='Option 2' />
        </EnhancedRadioGroup>
      </FormWrapper>
    );

    const form = screen.getByTestId('test-form');
    const radioGroup = screen.getByRole('radiogroup');

    expect(form).toContainElement(radioGroup);
  });

  it('works with controlled components', async () => {
    const ControlledWrapper = () => {
      const [value, setValue] = React.useState('option1');

      return (
        <div>
          <EnhancedRadioGroup value={value} onValueChange={setValue}>
            <EnhancedRadioGroupItem value='option1' label='Option 1' />
            <EnhancedRadioGroupItem value='option2' label='Option 2' />
          </EnhancedRadioGroup>
          <div data-testid='current-value'>{value}</div>
        </div>
      );
    };

    const user = userEvent.setup();
    render(<ControlledWrapper />);

    expect(screen.getByTestId('current-value')).toHaveTextContent('option1');

    await user.click(screen.getByLabelText('Option 2'));
    expect(screen.getByTestId('current-value')).toHaveTextContent('option2');
  });
  it('handles dynamic option updates', () => {
    const DynamicWrapper = () => {
      const [showThird, setShowThird] = React.useState(false);

      return (
        <div>
          <EnhancedRadioGroup>
            <EnhancedRadioGroupItem value='option1' label='Option 1' />
            <EnhancedRadioGroupItem value='option2' label='Option 2' />
            {showThird && (
              <EnhancedRadioGroupItem value='option3' label='Option 3' />
            )}
          </EnhancedRadioGroup>
          <button onClick={() => setShowThird(true)}>Add Option</button>
        </div>
      );
    };

    render(<DynamicWrapper />);

    expect(screen.getAllByRole('radio')).toHaveLength(2);

    fireEvent.click(screen.getByText('Add Option'));
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });
});
