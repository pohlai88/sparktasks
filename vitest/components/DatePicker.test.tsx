/**
 * Enhanced DatePicker Component Tests - MAPS v2.2
 *
 * Comprehensive test suite for DatePicker components following
 * vitest best practices and MAPS design system requirements.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  EnhancedDatePicker,
  EnhancedDatePickerRange,
  DatePickerFactory,
  enhancedDatePickerVariants,
} from '../../src/components/ui-enhanced/DatePicker';

// Mock date for consistent testing
const mockToday = new Date('2024-01-15T12:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(mockToday);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('EnhancedDatePicker', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<EnhancedDatePicker />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Pick a date');
    });

    it('renders with placeholder text', () => {
      render(<EnhancedDatePicker placeholder='Select date' />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveTextContent('Select date');
    });

    it('renders with selected date', () => {
      const selectedDate = new Date('2024-01-20');
      render(<EnhancedDatePicker value={selectedDate} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveTextContent('Jan 20, 2024');
    });

    it('applies custom className', () => {
      render(
        <EnhancedDatePicker
          className='custom-class'
          data-testid='datepicker-container'
        />
      );

      const container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Variant Styling', () => {
    it('applies default surface variant', () => {
      render(
        <EnhancedDatePicker
          surface='default'
          data-testid='datepicker-container'
        />
      );

      const container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass(
        enhancedDatePickerVariants({ surface: 'default' })
      );
    });

    it('applies glass surface variant', () => {
      render(
        <EnhancedDatePicker
          surface='glass'
          data-testid='datepicker-container'
        />
      );

      const container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass(
        enhancedDatePickerVariants({ surface: 'glass' })
      );
    });

    it('applies different sizes', () => {
      const { rerender } = render(
        <EnhancedDatePicker size='sm' data-testid='datepicker-container' />
      );

      let container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass(enhancedDatePickerVariants({ size: 'sm' }));

      rerender(
        <EnhancedDatePicker size='lg' data-testid='datepicker-container' />
      );
      container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass(enhancedDatePickerVariants({ size: 'lg' }));
    });

    it('applies validation states', () => {
      const { rerender } = render(
        <EnhancedDatePicker
          validation='error'
          data-testid='datepicker-container'
        />
      );

      let container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass('border-destructive');
      expect(container).toHaveClass('text-destructive');
      expect(container).toHaveClass('focus-within:ring-destructive');

      rerender(
        <EnhancedDatePicker
          validation='success'
          data-testid='datepicker-container'
        />
      );
      container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass('border-success');
      expect(container).toHaveClass('text-success');
      expect(container).toHaveClass('focus-within:ring-success');
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const mockOnChange = vi.fn();
      const selectedDate = new Date('2024-01-15');

      const { rerender } = render(
        <EnhancedDatePicker value={selectedDate} onChange={mockOnChange} />
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveTextContent('Jan 15, 2024');

      // Update prop manually
      const newDate = new Date('2024-01-20');
      rerender(<EnhancedDatePicker value={newDate} onChange={mockOnChange} />);

      expect(trigger).toHaveTextContent('Jan 20, 2024');
    });
  });
});

describe('EnhancedDatePickerRange', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<EnhancedDatePickerRange />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Pick a date range');
    });

    it('renders with selected range', () => {
      const range = {
        from: new Date('2024-01-15'),
        to: new Date('2024-01-20'),
      };
      render(<EnhancedDatePickerRange value={range} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveTextContent('Jan 15, 2024 - Jan 20, 2024');
    });

    it('renders with partial range (from only)', () => {
      const range = {
        from: new Date('2024-01-15'),
      };
      render(<EnhancedDatePickerRange value={range} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveTextContent('Jan 15, 2024 - ...');
    });
  });
});

describe('DatePickerFactory', () => {
  describe('Factory Functions', () => {
    it('creates single date picker with factory', () => {
      const DefaultPicker = DatePickerFactory.default;
      render(<DefaultPicker />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Pick a date');
    });

    it('creates range date picker with factory', () => {
      const RangePicker = DatePickerFactory.range;
      render(<RangePicker />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Pick a date range');
    });

    it('applies factory props correctly', () => {
      const GlassPicker = DatePickerFactory.glass;
      render(<GlassPicker size='lg' data-testid='datepicker-container' />);

      const container = screen.getByTestId('datepicker-container');
      expect(container).toHaveClass(
        enhancedDatePickerVariants({
          surface: 'glass',
          size: 'lg',
        })
      );
    });
  });
});

describe('CVA Variants', () => {
  describe('enhancedDatePickerVariants', () => {
    it('generates correct classes for surface variants', () => {
      expect(enhancedDatePickerVariants({ surface: 'default' })).toContain(
        'bg-background'
      );
      expect(enhancedDatePickerVariants({ surface: 'glass' })).toContain(
        'backdrop-blur'
      );
      expect(enhancedDatePickerVariants({ surface: 'elevated' })).toContain(
        'bg-card'
      );
    });

    it('generates correct classes for size variants', () => {
      expect(enhancedDatePickerVariants({ size: 'sm' })).toContain('h-8');
      expect(enhancedDatePickerVariants({ size: 'md' })).toContain('h-9');
      expect(enhancedDatePickerVariants({ size: 'lg' })).toContain('h-10');
    });

    it('generates correct classes for validation states', () => {
      expect(enhancedDatePickerVariants({ validation: 'error' })).toContain(
        'border-destructive'
      );
      expect(enhancedDatePickerVariants({ validation: 'success' })).toContain(
        'border-success'
      );
      expect(enhancedDatePickerVariants({ validation: 'warning' })).toContain(
        'border-warning'
      );
    });

    it('generates correct classes for density variants', () => {
      expect(enhancedDatePickerVariants({ density: 'comfortable' })).toContain(
        'px-3'
      );
      expect(enhancedDatePickerVariants({ density: 'compact' })).toContain(
        'px-2'
      );
      expect(enhancedDatePickerVariants({ density: 'spacious' })).toContain(
        'px-4'
      );
    });

    it('combines variants correctly', () => {
      const result = enhancedDatePickerVariants({
        surface: 'glass',
        size: 'lg',
        validation: 'error',
        density: 'compact',
      });

      expect(result).toContain('backdrop-blur');
      expect(result).toContain('h-10');
      expect(result).toContain('border-destructive');
      expect(result).toContain('px-2');
    });
  });
});

describe('Error Handling', () => {
  it('handles invalid date gracefully', () => {
    const invalidDate = new Date('invalid');

    expect(() => {
      render(<EnhancedDatePicker value={invalidDate} />);
    }).not.toThrow();

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('Pick a date');
  });

  it('handles invalid date range gracefully', () => {
    const invalidRange = {
      from: new Date('invalid'),
      to: new Date('2024-01-20'),
    };

    expect(() => {
      render(<EnhancedDatePickerRange value={invalidRange} />);
    }).not.toThrow();
  });
});

describe('Performance', () => {
  it('memoizes formatted date correctly', () => {
    const mockDate = new Date('2024-01-15');
    const mockOnChange = vi.fn();

    const { rerender } = render(
      <EnhancedDatePicker value={mockDate} onChange={mockOnChange} />
    );

    const trigger = screen.getByRole('button');
    const initialText = trigger.textContent;

    // Rerender with same date - should use memoized value
    rerender(<EnhancedDatePicker value={mockDate} onChange={mockOnChange} />);

    expect(trigger.textContent).toBe(initialText);
  });

  it('updates memoized value when date changes', () => {
    const initialDate = new Date('2024-01-15');
    const newDate = new Date('2024-01-20');
    const mockOnChange = vi.fn();

    const { rerender } = render(
      <EnhancedDatePicker value={initialDate} onChange={mockOnChange} />
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('Jan 15, 2024');

    // Rerender with different date
    rerender(<EnhancedDatePicker value={newDate} onChange={mockOnChange} />);

    expect(trigger).toHaveTextContent('Jan 20, 2024');
  });
});
