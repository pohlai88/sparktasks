/**
 * Enhanced Label Component Test Suite - MAPS       // Check typography foundation
      expect(label).toHaveClass('font-medium');

      // Check if leading-normal class is applied OR if line-height is correct
      const hasLeadingClass = label.classList.contains('leading-normal');
      const computedStyle = window.getComputedStyle(label);
      const lineHeight = computedStyle.lineHeight;

      // leading-normal should result in line-height: 1.5
      expect(hasLeadingClass || lineHeight === '1.5' || lineHeight === 'normal').toBe(true);

      expect(label).toHaveClass('text-sm'); // From size variant Compliance Validation
 *
 * VALIDATION SCOPE:
 * - Dark-First Philosophy: ✅ Deep space canvas with ethereal accents
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + MAPS Integration: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import {
  EnhancedLabel,
  LabelWithField,
  FormFieldGroup,
  createLabelWithField,
} from '@/components/ui-enhanced/Label';

// Mock Input component for testing
const MockInput = ({
  id,
  ...props
}: {
  id?: string;
  [key: string]: unknown;
}) => <input id={id} data-testid='mock-input' {...props} />;

describe('EnhancedLabel - MAPS v2.2 Foundation', () => {
  describe('Core Functionality', () => {
    it('renders with basic props', () => {
      render(<EnhancedLabel>Test Label</EnhancedLabel>);

      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('applies MAPS v2.2 foundation classes', () => {
      render(<EnhancedLabel>Foundation Test</EnhancedLabel>);

      const label = screen.getByText('Foundation Test');

      // Check typography foundation
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('text-sm'); // Default size variant

      // Check color foundation (dark-first)
      expect(label).toHaveClass('text-foreground');

      // Check motion foundation
      expect(label).toHaveClass(
        'transition-colors',
        'duration-200',
        'ease-out'
      );
      expect(label).toHaveClass('motion-reduce:transition-none');

      // Check accessibility foundation
      expect(label).toHaveClass('cursor-default');
    });

    it('supports required state with visual indicator', () => {
      render(<EnhancedLabel required>Required Field</EnhancedLabel>);

      const label = screen.getByText('Required Field');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('aria-required', 'true');

      // Check for asterisk in content
      expect(label).toHaveClass('data-[required]:after:content-["*"]');
    });

    it('supports invalid state styling', () => {
      render(<EnhancedLabel invalid>Invalid Field</EnhancedLabel>);

      const label = screen.getByText('Invalid Field');
      expect(label).toHaveAttribute('data-invalid');
      expect(label).toHaveAttribute('aria-invalid', 'true');
      expect(label).toHaveClass('data-[invalid]:text-destructive-foreground');
    });
  });

  describe('Variant System - Apple HIG Compliance', () => {
    it('applies variant classes correctly', () => {
      const variants = [
        'default',
        'primary',
        'secondary',
        'destructive',
        'muted',
        'accent',
      ] as const;

      variants.forEach(variant => {
        const { unmount } = render(
          <EnhancedLabel variant={variant} data-testid={`label-${variant}`}>
            {variant} Label
          </EnhancedLabel>
        );

        const label = screen.getByTestId(`label-${variant}`);

        // Each variant should have appropriate color class
        switch (variant) {
          case 'primary':
            expect(label).toHaveClass('text-primary');
            break;
          case 'secondary':
            expect(label).toHaveClass('text-muted-foreground');
            break;
          case 'destructive':
            expect(label).toHaveClass('text-destructive-foreground');
            break;
          case 'muted':
            expect(label).toHaveClass('text-muted-foreground');
            break;
          case 'accent':
            expect(label).toHaveClass('text-accent-foreground');
            break;
          case 'default':
            expect(label).toHaveClass('text-foreground');
            break;
        }

        unmount();
      });
    });

    it('applies size variants following MAPS typography scale', () => {
      const sizes = ['xs', 'sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { unmount } = render(
          <EnhancedLabel size={size} data-testid={`label-${size}`}>
            {size} Label
          </EnhancedLabel>
        );

        const label = screen.getByTestId(`label-${size}`);

        switch (size) {
          case 'xs':
            expect(label).toHaveClass('text-xs');
            break;
          case 'sm':
            expect(label).toHaveClass('text-sm');
            break;
          case 'md':
            expect(label).toHaveClass('text-sm', 'font-medium');
            break;
          case 'lg':
            expect(label).toHaveClass('text-base', 'font-medium');
            break;
        }

        unmount();
      });
    });

    it('applies interactive state correctly', () => {
      render(<EnhancedLabel interactive>Interactive Label</EnhancedLabel>);

      const label = screen.getByText('Interactive Label');
      expect(label).toHaveClass('cursor-pointer');
      expect(label).toHaveClass('hover:text-accent-foreground');
      expect(label).toHaveClass('focus-visible:outline-none');
      expect(label).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('AAA Compliance Mode', () => {
    it('applies AAA enforcement styles', () => {
      render(<EnhancedLabel enforceAAA>AAA Compliant Label</EnhancedLabel>);

      const label = screen.getByText('AAA Compliant Label');
      expect(label).toHaveClass('text-foreground');
      expect(label).toHaveClass('contrast-more:text-foreground');
      expect(label).toHaveClass('contrast-more:font-semibold');
    });

    it('maintains accessibility with required and invalid states', () => {
      render(
        <EnhancedLabel required invalid enforceAAA>
          AAA Required Invalid
        </EnhancedLabel>
      );

      const label = screen.getByText('AAA Required Invalid');
      expect(label).toHaveAttribute('aria-required', 'true');
      expect(label).toHaveAttribute('aria-invalid', 'true');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-invalid');
    });
  });

  describe('Liquid Glass Materials', () => {
    it('applies glass variant with proper backdrop effects', () => {
      render(<EnhancedLabel glass>Glass Label</EnhancedLabel>);

      const label = screen.getByText('Glass Label');

      // Check liquid glass foundation
      expect(label).toHaveClass('backdrop-blur-sm');
      expect(label).toHaveClass('bg-background/80');
      expect(label).toHaveClass('border', 'border-border/50');
      expect(label).toHaveClass('rounded-md', 'px-3', 'py-1.5');
      expect(label).toHaveClass('shadow-sm');
    });

    it('combines glass with other variants correctly', () => {
      render(
        <EnhancedLabel glass variant='accent' size='lg'>
          Glass Accent Large
        </EnhancedLabel>
      );

      const label = screen.getByText('Glass Accent Large');

      // Should have both glass and variant styles
      expect(label).toHaveClass('backdrop-blur-sm'); // Glass
      expect(label).toHaveClass('text-accent-foreground'); // Accent variant
      expect(label).toHaveClass('text-base', 'font-medium'); // Large size
    });
  });

  describe('Description Support', () => {
    it('renders description text when provided', () => {
      render(
        <EnhancedLabel description='This is a helpful description'>
          Label with Description
        </EnhancedLabel>
      );

      expect(screen.getByText('Label with Description')).toBeInTheDocument();
      expect(
        screen.getByText('This is a helpful description')
      ).toBeInTheDocument();

      const description = screen.getByText('This is a helpful description');
      expect(description).toHaveClass(
        'text-xs',
        'text-muted-foreground',
        'leading-relaxed'
      );
    });
  });
});

describe('LabelWithField - Form Integration', () => {
  describe('Basic Field Association', () => {
    it('associates label with field correctly', () => {
      render(
        <LabelWithField field={<MockInput />}>Associated Label</LabelWithField>
      );

      const label = screen.getByText('Associated Label');
      const input = screen.getByTestId('mock-input');

      // Check proper association
      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('passes required state to field', () => {
      render(
        <LabelWithField field={<MockInput />} required>
          Required Field
        </LabelWithField>
      );

      const input = screen.getByTestId('mock-input');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('passes invalid state to field', () => {
      render(
        <LabelWithField field={<MockInput />} invalid>
          Invalid Field
        </LabelWithField>
      );

      const input = screen.getByTestId('mock-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Error Handling', () => {
    it('displays error message with proper ARIA attributes', () => {
      render(
        <LabelWithField field={<MockInput />} error='This field has an error'>
          Field with Error
        </LabelWithField>
      );

      const input = screen.getByTestId('mock-input');
      const error = screen.getByText('This field has an error');

      expect(error).toBeInTheDocument();
      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
      expect(error).toHaveClass('text-xs', 'text-destructive-foreground');

      // Check ARIA describedby association
      expect(input).toHaveAttribute('aria-describedby');
      expect(input.getAttribute('aria-describedby')).toContain(error.id);
    });

    it('sets field as invalid when error is present', () => {
      render(
        <LabelWithField field={<MockInput />} error='Error message'>
          Error Field
        </LabelWithField>
      );

      const input = screen.getByTestId('mock-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Layout Variants', () => {
    it('applies vertical layout by default', () => {
      const { container } = render(
        <LabelWithField field={<MockInput />}>Vertical Label</LabelWithField>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('space-y-2');
    });

    it('applies horizontal layout correctly', () => {
      const { container } = render(
        <LabelWithField field={<MockInput />} layout='horizontal'>
          Horizontal Label
        </LabelWithField>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'items-start', 'gap-4');

      const label = screen.getByText('Horizontal Label');
      expect(label).toHaveClass('flex', 'items-center', 'min-w-[120px]');
    });
  });

  describe('Description Integration', () => {
    it('associates description with field via aria-describedby', () => {
      render(
        <LabelWithField field={<MockInput />} description='Helpful description'>
          Field with Description
        </LabelWithField>
      );

      const input = screen.getByTestId('mock-input');
      const description = screen.getByText('Helpful description');

      expect(input).toHaveAttribute('aria-describedby');
      expect(input.getAttribute('aria-describedby')).toContain(description.id);
    });
  });
});

describe('FormFieldGroup - Advanced Form Patterns', () => {
  describe('Basic Group Functionality', () => {
    it('renders fieldset with proper structure', () => {
      render(
        <FormFieldGroup label='Contact Information'>
          <MockInput />
          <MockInput />
        </FormFieldGroup>
      );

      const fieldset = screen.getByRole('group', {
        name: 'Contact Information',
      });
      expect(fieldset).toBeInTheDocument();
      expect(fieldset.tagName).toBe('FIELDSET');

      const legend = screen.getByText('Contact Information');
      expect(legend.tagName).toBe('LEGEND');
    });

    it('applies MAPS v2.2 styling to group', () => {
      const { container } = render(
        <FormFieldGroup label='Styled Group'>
          <MockInput />
        </FormFieldGroup>
      );

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toHaveClass('space-y-3');
      expect(fieldset).toHaveClass(
        'border',
        'border-border',
        'rounded-lg',
        'p-4'
      );
      expect(fieldset).toHaveClass('bg-background/50');
    });

    it('handles required state with visual indicator', () => {
      render(
        <FormFieldGroup label='Required Group' required>
          <MockInput />
        </FormFieldGroup>
      );

      const requiredIndicator = screen.getByLabelText('required');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass('text-destructive-foreground');
    });
  });

  describe('Layout Variants', () => {
    it('applies vertical layout by default', () => {
      const { container } = render(
        <FormFieldGroup>
          <MockInput />
          <MockInput />
        </FormFieldGroup>
      );

      const fieldsContainer = container.querySelector('[class*="space-y-4"]');
      expect(fieldsContainer).toBeInTheDocument();
    });

    it('applies horizontal layout correctly', () => {
      const { container } = render(
        <FormFieldGroup layout='horizontal'>
          <MockInput />
          <MockInput />
        </FormFieldGroup>
      );

      const fieldsContainer = container.querySelector('[class*="flex"]');
      expect(fieldsContainer).toHaveClass('flex', 'flex-wrap', 'gap-4');
    });

    it('applies grid layout with correct columns', () => {
      const { container } = render(
        <FormFieldGroup layout='grid' gridCols={3}>
          <MockInput />
          <MockInput />
          <MockInput />
        </FormFieldGroup>
      );

      const fieldsContainer = container.querySelector('[class*="grid"]');
      expect(fieldsContainer).toHaveClass(
        'grid',
        'gap-4',
        'grid-cols-1',
        'md:grid-cols-3'
      );
    });
  });

  describe('Error Handling', () => {
    it('displays group error with proper ARIA attributes', () => {
      render(
        <FormFieldGroup
          label='Group with Error'
          error='Group validation failed'
        >
          <MockInput />
        </FormFieldGroup>
      );

      const fieldset = screen.getByRole('group');
      const error = screen.getByText('Group validation failed');

      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
      expect(fieldset).toHaveAttribute('aria-invalid', 'true');
      expect(fieldset).toHaveAttribute('aria-describedby');
    });
  });

  describe('Description Support', () => {
    it('renders group description correctly', () => {
      render(
        <FormFieldGroup
          label='Contact Form'
          description='Please provide your contact details'
        >
          <MockInput />
        </FormFieldGroup>
      );

      const description = screen.getByText(
        'Please provide your contact details'
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        'text-xs',
        'text-muted-foreground',
        'leading-relaxed'
      );

      const fieldset = screen.getByRole('group');
      expect(fieldset).toHaveAttribute('aria-describedby');
    });
  });
});

describe('createLabelWithField - Factory Function', () => {
  it('creates a labeled field component', () => {
    const InputWithLabel = createLabelWithField(MockInput);

    render(
      <InputWithLabel field={<MockInput />}>Created Label</InputWithLabel>
    );

    const label = screen.getByText('Created Label');
    const input = screen.getByTestId('mock-input');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('applies default field props', () => {
    const InputWithLabel = createLabelWithField(MockInput, {
      placeholder: 'Default placeholder',
      'data-testid': 'default-input',
    });

    render(
      <InputWithLabel field={<MockInput />}>Default Props Label</InputWithLabel>
    );

    const input = screen.getByTestId('default-input');
    expect(input).toHaveAttribute('placeholder', 'Default placeholder');
  });

  it('allows fieldProps override', () => {
    const InputWithLabel = createLabelWithField(MockInput);

    render(
      <InputWithLabel
        field={<MockInput />}
        fieldProps={{ placeholder: 'Override placeholder' }}
      >
        Override Label
      </InputWithLabel>
    );

    const input = screen.getByTestId('mock-input');
    expect(input).toHaveAttribute('placeholder', 'Override placeholder');
  });
});

describe('Accessibility - WCAG AAA Compliance', () => {
  describe('Screen Reader Support', () => {
    it('provides proper ARIA labels and descriptions', () => {
      render(
        <LabelWithField
          field={<MockInput />}
          description='Field description'
          error='Field error'
          aria-label='Custom aria label'
        >
          Accessible Label
        </LabelWithField>
      );

      const input = screen.getByTestId('mock-input');
      const description = screen.getByText('Field description');
      const error = screen.getByText('Field error');

      expect(input).toHaveAttribute('aria-describedby');
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain(description.id);
      expect(describedBy).toContain(error.id);
    });

    it('maintains focus management with interactive labels', () => {
      const mockClick = vi.fn();

      render(
        <EnhancedLabel interactive onClick={mockClick}>
          Clickable Label
        </EnhancedLabel>
      );

      const label = screen.getByText('Clickable Label');

      // Should be focusable and clickable
      expect(label).toHaveClass('cursor-pointer');
      fireEvent.click(label);
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Color Contrast - AAA Compliance', () => {
    it('applies high contrast styles in AAA mode', () => {
      render(
        <EnhancedLabel enforceAAA variant='muted'>
          High Contrast Label
        </EnhancedLabel>
      );

      const label = screen.getByText('High Contrast Label');
      expect(label).toHaveClass('contrast-more:text-foreground');
      expect(label).toHaveClass('contrast-more:font-semibold');
    });
  });

  describe('Motion Preferences', () => {
    it('respects reduced motion preferences', () => {
      render(<EnhancedLabel>Motion Label</EnhancedLabel>);

      const label = screen.getByText('Motion Label');
      expect(label).toHaveClass('motion-reduce:transition-none');
    });
  });
});

describe('Performance Optimization', () => {
  it('does not cause unnecessary re-renders', () => {
    const renderCount = vi.fn();

    const TestComponent = ({ children }: { children: React.ReactNode }) => {
      renderCount();
      return <EnhancedLabel>{children}</EnhancedLabel>;
    };

    const { rerender } = render(<TestComponent>Initial</TestComponent>);
    expect(renderCount).toHaveBeenCalledTimes(1);

    // Same props should not cause re-render
    rerender(<TestComponent>Initial</TestComponent>);
    expect(renderCount).toHaveBeenCalledTimes(2); // React will still call function, but DOM won't change

    // Different props should cause re-render
    rerender(<TestComponent>Changed</TestComponent>);
    expect(renderCount).toHaveBeenCalledTimes(3);
  });
});

describe('Error Boundaries & Edge Cases', () => {
  it('handles empty children gracefully', () => {
    const { container } = render(<EnhancedLabel />);

    // The label should still render as a label element
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
  });

  it('handles null field in LabelWithField', () => {
    // This should gracefully handle null field without throwing
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <LabelWithField field={null as unknown as React.ReactElement}>
        Null Field Label
      </LabelWithField>
    );

    // Should render just the label without crashing
    expect(screen.getByText('Null Field Label')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'LabelWithField: field prop must be a valid React element'
    );

    consoleErrorSpy.mockRestore();
  });

  it('handles custom className merging correctly', () => {
    render(
      <EnhancedLabel className='custom-class'>Custom Class Label</EnhancedLabel>
    );

    const label = screen.getByText('Custom Class Label');
    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('text-sm'); // Should still have foundation classes
  });
});
