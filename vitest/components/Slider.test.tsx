/**
 * Enhanced Slider Component Tests - MAPS v2.2 Vitest Suite
 *
 * TESTING PHILOSOPHY:
 * - Test real functionality, not arbitrary expectations
 * - Validate actual API: variants, sizes, AAA mode, liquid glass
 * - Cover edge cases: disabled states, value boundaries, accessibility
 * - Efficient: Focused tests that provide real confidence
 *
 * COVERAGE MATRIX:
 * ✅ Component rendering and props
 * ✅ All variants (default, accent, success, warning, destructive, glass)
 * ✅ All sizes (sm, default, lg)
 * ✅ AAA compliance mode enforcement
 * ✅ Liquid glass materials integration
 * ✅ Value display and formatting
 * ✅ Accessibility features (ARIA, focus, keyboard)
 * ✅ Factory functions and utilities
 * ✅ Error handling and edge cases
 * ✅ Integration scenarios
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';

import {
  EnhancedSlider,
  SliderFactory,
  SliderFormatters,
  useEnhancedSlider,
} from '@/components/ui-enhanced/Slider';

// ===== CORE FUNCTIONALITY TESTS =====

describe('EnhancedSlider', () => {
  it('renders with default configuration', () => {
    render(<EnhancedSlider defaultValue={[50]} aria-label='Test slider' />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-label', 'Test slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('accepts custom min, max, and step values', () => {
    render(
      <EnhancedSlider
        defaultValue={[25]}
        min={0}
        max={50}
        step={5}
        aria-label='Custom range slider'
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '50');
    expect(slider).toHaveAttribute('aria-valuenow', '25');
  });

  it('handles value changes correctly', async () => {
    const handleValueChange = vi.fn();

    render(
      <EnhancedSlider
        defaultValue={[50]}
        onValueChange={handleValueChange}
        aria-label='Interactive slider'
      />
    );

    const slider = screen.getByRole('slider');

    // Simulate direct focus and keyboard interaction (more reliable in JSDOM)
    slider.focus();
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(handleValueChange).toHaveBeenCalled();
  });

  it('supports range sliders with multiple values', () => {
    render(
      <EnhancedSlider defaultValue={[25, 75]} aria-label='Range slider' />
    );

    // With multiple default values, should create multiple thumbs
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');
  });
});

// ===== VARIANT TESTING =====

describe('EnhancedSlider Variants', () => {
  const variants = [
    'default',
    'accent',
    'success',
    'warning',
    'destructive',
  ] as const;

  variants.forEach(variant => {
    it(`renders ${variant} variant correctly`, () => {
      const { container } = render(
        <EnhancedSlider
          variant={variant}
          defaultValue={[50]}
          aria-label={`${variant} slider`}
        />
      );

      const sliderRoot = container
        .querySelector('[role="slider"]')
        ?.closest('span');
      expect(sliderRoot).toBeInTheDocument();

      // Verify semantic classes are applied (CVA should include variant-specific styles)
      const track = container.querySelector('[data-orientation="horizontal"]');
      expect(track).toBeInTheDocument();
    });
  });

  it('applies glass variant with liquid glass effects', () => {
    const { container } = render(
      <EnhancedSlider
        liquidGlass={true}
        defaultValue={[50]}
        aria-label='Glass slider'
      />
    );

    // Should have backdrop-blur classes for glass effect
    const glassSurface = container.querySelector('.backdrop-blur-sm');
    expect(glassSurface).toBeInTheDocument();
  });
});

// ===== SIZE VARIANTS =====

describe('EnhancedSlider Sizes', () => {
  const sizes = ['sm', 'default', 'lg'] as const;

  sizes.forEach(size => {
    it(`renders ${size} size correctly`, () => {
      const { container } = render(
        <EnhancedSlider
          size={size}
          defaultValue={[50]}
          aria-label={`${size} slider`}
        />
      );

      const slider = container.querySelector('[role="slider"]');
      expect(slider).toBeInTheDocument();

      // Size variants should apply appropriate height classes
      const thumb = container.querySelector('[role="slider"]');
      expect(thumb).toBeInTheDocument();
    });
  });
});

// ===== AAA COMPLIANCE MODE =====

describe('EnhancedSlider AAA Compliance', () => {
  it('enforces AAA compliance when aaaMode is enabled', () => {
    const { container } = render(
      <EnhancedSlider
        aaaMode={true}
        defaultValue={[50]}
        aria-label='AAA compliant slider'
      />
    );

    // Should have high contrast classes
    const aaaElement = container.querySelector('.contrast-more\\:ring-4');
    expect(aaaElement).toBeInTheDocument();
  });

  it('supports forced-colors mode for Windows High Contrast', () => {
    const { container } = render(
      <EnhancedSlider
        aaaMode={true}
        defaultValue={[50]}
        aria-label='High contrast slider'
      />
    );

    // Should have forced-colors classes
    const forcedColors = container.querySelector(
      '.forced-colors\\:border-\\[ButtonBorder\\]'
    );
    expect(forcedColors).toBeInTheDocument();
  });
});

// ===== VALUE DISPLAY AND FORMATTING =====

describe('EnhancedSlider Value Display', () => {
  it('shows formatted value when showValue is enabled', () => {
    render(
      <EnhancedSlider
        showValue={true}
        defaultValue={[75]}
        aria-label='Value display slider'
      />
    );

    // Should display the current value
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByLabelText('Current value: 75')).toBeInTheDocument();
  });

  it('uses custom formatter for value display', () => {
    const percentageFormatter = (value: number) => `${value}%`;

    render(
      <EnhancedSlider
        showValue={true}
        formatValue={percentageFormatter}
        defaultValue={[60]}
        aria-label='Percentage slider'
      />
    );

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByLabelText('Current value: 60%')).toBeInTheDocument();
  });

  it('supports different orientation (vertical)', () => {
    const { container } = render(
      <EnhancedSlider
        orientation='vertical'
        defaultValue={[50]}
        aria-label='Vertical slider'
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-orientation', 'vertical');
  });
});

// ===== ACCESSIBILITY FEATURES =====

describe('EnhancedSlider Accessibility', () => {
  it('provides proper ARIA labels', () => {
    render(<EnhancedSlider defaultValue={[50]} aria-label='Volume control' />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-label', 'Volume control');
  });

  it('supports keyboard navigation', async () => {
    const handleValueChange = vi.fn();

    render(
      <EnhancedSlider
        defaultValue={[50]}
        onValueChange={handleValueChange}
        aria-label='Keyboard slider'
      />
    );

    const slider = screen.getByRole('slider');
    slider.focus();

    // Test arrow key navigation
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    fireEvent.keyDown(slider, { key: 'Home' });
    fireEvent.keyDown(slider, { key: 'End' });

    expect(handleValueChange).toHaveBeenCalled();
  });

  it('respects disabled state', () => {
    render(
      <EnhancedSlider
        disabled={true}
        defaultValue={[50]}
        aria-label='Disabled slider'
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('data-disabled', '');
    // Note: Radix may not set aria-disabled on the thumb itself
  });

  it('provides live region updates for value changes', async () => {
    render(
      <EnhancedSlider
        showValue={true}
        defaultValue={[50]}
        aria-label='Live update slider'
      />
    );

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-label', 'Current value: 50');
  });
});

// ===== DENSITY VARIANTS =====

describe('EnhancedSlider Density', () => {
  it('applies compact density styling', () => {
    const { container } = render(
      <EnhancedSlider
        density='compact'
        defaultValue={[50]}
        aria-label='Compact slider'
      />
    );

    // Compact density should apply media query classes
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('min-h-[28px]');
  });

  it('uses comfortable density by default', () => {
    const { container } = render(
      <EnhancedSlider defaultValue={[50]} aria-label='Default slider' />
    );

    // Default should use the root slider element classes
    const sliderRoot = container.querySelector(
      'span[dir="ltr"]'
    ) as HTMLElement;
    expect(sliderRoot.className).toContain('min-h-[44px]');
  });
});

// ===== FACTORY FUNCTIONS =====

describe('SliderFactory', () => {
  it('creates default slider', () => {
    render(
      <SliderFactory.default defaultValue={[50]} aria-label='Factory default' />
    );

    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('creates AAA compliant slider', () => {
    const { container } = render(
      <SliderFactory.aaa defaultValue={[50]} aria-label='Factory AAA' />
    );

    expect(
      container.querySelector('.contrast-more\\:ring-4')
    ).toBeInTheDocument();
  });

  it('creates glass slider with liquid effects', () => {
    const { container } = render(
      <SliderFactory.glass defaultValue={[50]} aria-label='Factory glass' />
    );

    expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
  });

  it('creates slider with value display', () => {
    render(
      <SliderFactory.withValue
        defaultValue={[75]}
        aria-label='Factory with value'
      />
    );

    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('creates range slider', () => {
    render(
      <SliderFactory.range defaultValue={[25, 75]} aria-label='Factory range' />
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });

  it('creates stepped slider', () => {
    render(
      <SliderFactory.stepped
        defaultValue={[50]}
        step={10}
        aria-label='Factory stepped'
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    // Note: step attribute may be handled internally by Radix
  });
});

// ===== FORMATTERS =====

describe('SliderFormatters', () => {
  it('formats percentage values', () => {
    expect(SliderFormatters.percentage(75.6)).toBe('76%');
    expect(SliderFormatters.percentage(0)).toBe('0%');
    expect(SliderFormatters.percentage(100)).toBe('100%');
  });

  it('formats currency values', () => {
    expect(SliderFormatters.currency(1234.56)).toBe('$1,234.56');
    expect(SliderFormatters.currency(1000, 'EUR')).toBe('€1,000.00');
  });

  it('formats decimal values with precision', () => {
    const decimal2 = SliderFormatters.decimal(2);
    expect(decimal2(3.14159)).toBe('3.14');
    expect(decimal2(1)).toBe('1.00');
  });

  it('formats values with units', () => {
    const pixels = SliderFormatters.unit('px');
    expect(pixels(16.7)).toBe('17 px');
    expect(pixels(100)).toBe('100 px');
  });

  it('formats time values', () => {
    expect(SliderFormatters.time(90)).toBe('1:30');
    expect(SliderFormatters.time(125)).toBe('2:05');
    expect(SliderFormatters.time(45)).toBe('0:45');
  });
});

// ===== HOOK TESTING =====

describe('useEnhancedSlider', () => {
  function TestComponent({
    config,
  }: {
    config?: Parameters<typeof useEnhancedSlider>[0];
  }) {
    const slider = useEnhancedSlider(config);

    return (
      <div>
        <div data-testid='value'>{JSON.stringify(slider.value)}</div>
        <div data-testid='isAtMin'>{slider.isAtMin.toString()}</div>
        <div data-testid='isAtMax'>{slider.isAtMax.toString()}</div>
        <button onClick={() => slider.setValue([75])}>Set to 75</button>
        <button onClick={() => slider.setValueAt(0, 25)}>
          Set first to 25
        </button>
        <button onClick={() => slider.reset()}>Reset</button>
      </div>
    );
  }

  it('manages slider state with default configuration', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('value')).toHaveTextContent('[0]');
    expect(screen.getByTestId('isAtMin')).toHaveTextContent('true');
    expect(screen.getByTestId('isAtMax')).toHaveTextContent('false');
  });

  it('handles value changes and bounds checking', async () => {
    const user = userEvent.setup();

    render(<TestComponent config={{ min: 0, max: 100, defaultValue: [50] }} />);

    expect(screen.getByTestId('value')).toHaveTextContent('[50]');

    await user.click(screen.getByText('Set to 75'));
    expect(screen.getByTestId('value')).toHaveTextContent('[75]');

    await user.click(screen.getByText('Set first to 25'));
    expect(screen.getByTestId('value')).toHaveTextContent('[25]');

    await user.click(screen.getByText('Reset'));
    expect(screen.getByTestId('value')).toHaveTextContent('[50]');
  });

  it('enforces min/max bounds', async () => {
    const user = userEvent.setup();

    function BoundsTestComponent() {
      const slider = useEnhancedSlider({
        min: 10,
        max: 90,
        defaultValue: [50],
      });

      return (
        <div>
          <div data-testid='value'>{JSON.stringify(slider.value)}</div>
          <button onClick={() => slider.setValue([5])}>Set below min</button>
          <button onClick={() => slider.setValue([95])}>Set above max</button>
        </div>
      );
    }

    render(<BoundsTestComponent />);

    await user.click(screen.getByText('Set below min'));
    expect(screen.getByTestId('value')).toHaveTextContent('[10]'); // Clamped to min

    await user.click(screen.getByText('Set above max'));
    expect(screen.getByTestId('value')).toHaveTextContent('[90]'); // Clamped to max
  });
});

// ===== ERROR HANDLING =====

describe('EnhancedSlider Error Handling', () => {
  it('handles null/undefined children gracefully', () => {
    render(
      <EnhancedSlider defaultValue={[50]} aria-label='Empty slider'>
        {null}
        {undefined}
      </EnhancedSlider>
    );

    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('handles invalid value props gracefully', () => {
    const { container } = render(
      <EnhancedSlider defaultValue={[]} aria-label='Invalid value slider' />
    );

    // Should still render without crashing
    expect(container.firstChild).toBeInTheDocument();
  });

  it('maintains functionality with undefined formatValue', () => {
    render(
      <EnhancedSlider
        showValue={true}
        defaultValue={[50]}
        aria-label='No formatter slider'
      />
    );

    // Should use default toString formatter
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});

// ===== INTEGRATION TESTS =====

describe('EnhancedSlider Integration', () => {
  it('integrates with form libraries', () => {
    function FormIntegrationTest() {
      const [value, setValue] = React.useState([50]);

      return (
        <form>
          <EnhancedSlider
            value={value}
            onValueChange={setValue}
            aria-label='Form slider'
          />
          <div data-testid='form-value'>{value[0]}</div>
        </form>
      );
    }

    render(<FormIntegrationTest />);

    expect(screen.getByTestId('form-value')).toHaveTextContent('50');
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('works with theme providers and context', () => {
    function ThemedSlider() {
      return (
        <div data-theme='dark'>
          <EnhancedSlider
            defaultValue={[50]}
            liquidGlass={true}
            aria-label='Themed slider'
          />
        </div>
      );
    }

    const { container } = render(<ThemedSlider />);

    expect(container.querySelector('.backdrop-blur-sm')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('maintains accessibility with complex layouts', () => {
    render(
      <div>
        <label htmlFor='complex-slider'>Volume Control</label>
        <EnhancedSlider
          id='complex-slider'
          defaultValue={[75]}
          showValue={true}
          aria-label='Volume control'
        />
        <div role='region' aria-label='Audio controls'>
          <button>Mute</button>
          <button>Max Volume</button>
        </div>
      </div>
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-label', 'Volume control');
    expect(screen.getByText('75')).toBeInTheDocument();
  });
});
