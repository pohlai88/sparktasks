/**
 * Enhanced Progress Component Tests - MAPS v2.2 Dark-First Philosophy
 *
 * COMPREHENSIVE TEST COVERAGE:
 * - Component rendering and props
 * - Variant behaviors (default, glass, minimal, elevated)
 * - Size and density variants
 * - AAA compliance enforcement
 * - Accessibility compliance (WCAG AAA)
 * - Interactive states and animations
 * - Semantic value handling
 * - Edge cases and error boundaries
 * - Performance validation
 * - Integration scenarios
 *
 * TESTING PRINCIPLES:
 * - Behavioral testing over implementation
 * - Accessibility-first validation
 * - Real user interaction patterns
 * - Performance regression prevention
 * - Cross-browser compatibility scenarios
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import {
  EnhancedProgress,
  CircularProgress,
  SteppedProgress,
} from '@/components/ui-enhanced/Progress';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// ===== PROGRESS COMPONENT CORE TESTS =====

describe('EnhancedProgress - Core Rendering', () => {
  it('renders with default props and proper ARIA attributes', () => {
    render(<EnhancedProgress value={50} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('applies default variant classes correctly', () => {
    render(<EnhancedProgress value={30} data-testid='progress' />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('bg-background-panel');
    expect(progress).toHaveClass('border-border-subtle');
    expect(progress).toHaveClass('rounded-full');
  });

  it('renders progress indicator with correct width', () => {
    render(<EnhancedProgress value={75} />);

    const progressBar = screen.getByRole('progressbar');
    const indicator = progressBar.querySelector('[style*="translateX"]');
    expect(indicator).toHaveStyle('transform: translateX(-25%)');
  });

  it('handles edge values correctly', () => {
    const { rerender } = render(<EnhancedProgress value={0} />);

    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');

    rerender(<EnhancedProgress value={100} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });
});

// ===== PROGRESS VARIANT TESTS =====

describe('EnhancedProgress - Variant Behavior', () => {
  it('applies glass variant classes correctly', () => {
    render(
      <EnhancedProgress value={50} variant='glass' data-testid='progress' />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('backdrop-blur-[8px]');
    expect(progress).toHaveClass('backdrop-saturate-[135%]');
    expect(progress).toHaveClass('bg-background-panel/60');
  });

  it('applies minimal variant classes correctly', () => {
    render(
      <EnhancedProgress value={50} variant='minimal' data-testid='progress' />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('bg-background-elevated');
    expect(progress).toHaveClass('border-transparent');
  });

  it('applies elevated variant classes correctly', () => {
    render(
      <EnhancedProgress value={50} variant='elevated' data-testid='progress' />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('bg-background-elevated');
    expect(progress).toHaveClass('border-border-default');
    expect(progress).toHaveClass('shadow-md');
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(
      <EnhancedProgress value={50} size='sm' data-testid='progress' />
    );

    let progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('h-1.5');

    rerender(<EnhancedProgress value={50} size='lg' data-testid='progress' />);
    progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('h-3');

    rerender(<EnhancedProgress value={50} size='xl' data-testid='progress' />);
    progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('h-4');
  });
});

// ===== AAA COMPLIANCE TESTS =====

describe('EnhancedProgress - AAA Compliance', () => {
  it('enforces AAA mode when specified', () => {
    render(
      <EnhancedProgress value={50} enforceAAA={true} data-testid='progress' />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('bg-background-elevated');
    expect(progress).toHaveClass('border-border-strong');
    expect(progress).not.toHaveClass('backdrop-blur-[8px]');
  });

  it('removes vibrancy effects in AAA mode', () => {
    render(
      <EnhancedProgress
        value={50}
        variant='glass'
        enforceAAA={true}
        data-testid='progress'
      />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('backdrop-blur-none');
    expect(progress).toHaveClass('backdrop-saturate-100');
  });

  it('applies AAA-compliant indicator colors', () => {
    render(
      <EnhancedProgress
        value={50}
        enforceAAA={true}
        indicatorVariant='default'
        data-testid='progress'
      />
    );

    const progressBar = screen.getByRole('progressbar');
    const indicator = progressBar.querySelector('[class*="bg-accent"]');
    expect(indicator).toHaveClass('bg-accent-solid-aaa');
  });
});

// ===== LABEL AND DISPLAY TESTS =====

describe('EnhancedProgress - Label Display', () => {
  it('shows percentage label when requested', () => {
    render(<EnhancedProgress value={75} showLabel={true} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('displays custom label text', () => {
    render(
      <EnhancedProgress value={60} showLabel={true} label='Custom Label Text' />
    );

    expect(screen.getByText('Custom Label Text')).toBeInTheDocument();
  });

  it('positions labels correctly', () => {
    const { rerender } = render(
      <EnhancedProgress value={50} showLabel={true} labelPosition='outside' />
    );

    expect(screen.getByText('50%')).toBeInTheDocument();

    rerender(
      <EnhancedProgress value={50} showLabel={true} labelPosition='inside' />
    );

    const insideLabel = screen.getByText('50%');
    expect(insideLabel).toHaveClass('absolute');
    expect(insideLabel).toHaveClass('inset-0');
  });
});

// ===== SEMANTIC VARIANTS TESTS =====

describe('EnhancedProgress - Semantic Variants', () => {
  it('applies success variant styling', () => {
    render(
      <EnhancedProgress
        value={100}
        indicatorVariant='success'
        data-testid='progress'
      />
    );

    const progressBar = screen.getByRole('progressbar');
    const indicator = progressBar.querySelector('[class*="bg-feedback"]');
    expect(indicator).toHaveClass('bg-feedback-success');
  });

  it('applies warning variant styling', () => {
    render(
      <EnhancedProgress
        value={75}
        indicatorVariant='warning'
        data-testid='progress'
      />
    );

    const progressBar = screen.getByRole('progressbar');
    const indicator = progressBar.querySelector('[class*="bg-feedback"]');
    expect(indicator).toHaveClass('bg-feedback-warning');
  });

  it('applies error variant styling', () => {
    render(
      <EnhancedProgress
        value={25}
        indicatorVariant='error'
        data-testid='progress'
      />
    );

    const progressBar = screen.getByRole('progressbar');
    const indicator = progressBar.querySelector('[class*="bg-feedback"]');
    expect(indicator).toHaveClass('bg-feedback-error');
  });
});

// ===== CIRCULAR PROGRESS TESTS =====

describe('CircularProgress - Specialized Component', () => {
  it('renders circular progress with correct dimensions', () => {
    render(<CircularProgress value={50} size='md' data-testid='circular' />);

    const circular = screen.getByTestId('circular');
    expect(circular).toHaveStyle('width: 48px');
    expect(circular).toHaveStyle('height: 48px');
  });

  it('calculates SVG stroke properties correctly', () => {
    render(<CircularProgress value={25} size='lg' />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();

    const progressCircle = svg?.querySelectorAll('circle')[1]; // Second circle is progress
    expect(progressCircle).toHaveAttribute('stroke-dasharray');
    expect(progressCircle).toHaveAttribute('stroke-dashoffset');
  });

  it('displays center label when requested', () => {
    render(<CircularProgress value={80} showCenterLabel={true} />);

    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('applies size-specific text sizing', () => {
    const { rerender } = render(
      <CircularProgress value={50} size='sm' showCenterLabel={true} />
    );

    let label = screen.getByText('50%');
    expect(label).toHaveClass('text-[10px]');

    rerender(<CircularProgress value={50} size='xl' showCenterLabel={true} />);

    label = screen.getByText('50%');
    expect(label).toHaveClass('text-sm');
  });
});

// ===== STEPPED PROGRESS TESTS =====

describe('SteppedProgress - Multi-Step Component', () => {
  const stepLabels = ['Start', 'Process', 'Review', 'Complete'];

  it('renders correct number of step indicators', () => {
    render(
      <SteppedProgress
        currentStep={1}
        totalSteps={4}
        stepLabels={stepLabels}
        data-testid='stepped'
      />
    );

    const stepped = screen.getByTestId('stepped');
    const indicators = stepped.querySelectorAll('[class*="w-8"][class*="h-8"]'); // Step indicator circles
    expect(indicators).toHaveLength(4); // 4 step indicators
  });

  it('shows correct step states', () => {
    render(
      <SteppedProgress
        currentStep={2}
        totalSteps={4}
        stepLabels={stepLabels}
        showStepNumbers={false}
      />
    );

    // Check for completed steps (should show checkmarks)
    const checkmarks = screen.getAllByText('✓');
    expect(checkmarks).toHaveLength(2); // Steps 0 and 1 completed

    // Check for current step number
    expect(screen.getByText('3')).toBeInTheDocument(); // Current step (0-based index 2 = step 3)

    // Check for pending step
    expect(screen.getByText('4')).toBeInTheDocument(); // Pending step
  });

  it('displays step labels correctly', () => {
    render(
      <SteppedProgress currentStep={1} totalSteps={4} stepLabels={stepLabels} />
    );

    for (const label of stepLabels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('calculates overall progress correctly', () => {
    render(
      <SteppedProgress currentStep={2} totalSteps={4} stepLabels={stepLabels} />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75'); // (2+1)/4 * 100
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('EnhancedProgress - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <EnhancedProgress value={50} aria-label='Test progress' />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with complex setup', async () => {
    const { container } = render(
      <div>
        <EnhancedProgress
          value={75}
          variant='glass'
          showLabel={true}
          labelPosition='outside'
          aria-label='File upload progress'
        />
        <CircularProgress
          value={60}
          showCenterLabel={true}
          indicatorVariant='success'
          aria-label='Circular progress'
        />
        <SteppedProgress
          currentStep={2}
          totalSteps={5}
          stepLabels={['A', 'B', 'C', 'D', 'E']}
          aria-label='Multi-step progress'
        />
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in AAA mode', async () => {
    const { container } = render(
      <EnhancedProgress value={50} enforceAAA={true} showLabel={true} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports ARIA labelling', () => {
    render(
      <EnhancedProgress
        value={60}
        aria-label='File upload progress'
        aria-describedby='progress-desc'
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'File upload progress');
    expect(progressBar).toHaveAttribute('aria-describedby', 'progress-desc');
  });

  it('handles indeterminate state correctly', () => {
    render(<EnhancedProgress />); // No value provided

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
  });
});

// ===== PERFORMANCE TESTS =====

describe('EnhancedProgress - Performance', () => {
  it('renders quickly with normal values', () => {
    const startTime = performance.now();

    render(<EnhancedProgress value={50} />);

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(16); // Should render within one frame
  });

  it('handles rapid value changes efficiently', () => {
    const { rerender } = render(<EnhancedProgress value={0} />);

    const startTime = performance.now();

    // Simulate rapid progress updates
    for (let i = 0; i <= 100; i += 10) {
      rerender(<EnhancedProgress value={i} />);
    }

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(50); // Should handle updates efficiently
  });
});

// ===== EDGE CASES AND ERROR BOUNDARIES =====

describe('EnhancedProgress - Edge Cases', () => {
  it('handles null and undefined values gracefully', () => {
    const { rerender } = render(
      <EnhancedProgress value={null} aria-label='Test progress' />
    );

    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    rerender(<EnhancedProgress value={undefined} aria-label='Test progress' />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('handles values within valid range', () => {
    const { rerender } = render(<EnhancedProgress value={100} max={100} />);

    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');

    rerender(<EnhancedProgress value={10} max={100} />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '10');
  });

  it('handles custom max values correctly', () => {
    render(
      <EnhancedProgress
        value={50}
        max={200}
        showLabel={true}
        aria-label='Test progress'
      />
    );

    expect(screen.getByText('25%')).toBeInTheDocument(); // 50/200 = 25%
  });

  it('respects custom className prop', () => {
    render(
      <EnhancedProgress
        value={50}
        className='custom-progress-class'
        data-testid='progress'
        aria-label='Test progress'
      />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('custom-progress-class');
  });

  it('handles animated variant correctly', () => {
    render(
      <EnhancedProgress
        value={50}
        animated={true}
        data-testid='progress'
        aria-label='Test progress'
      />
    );

    const progressBar = screen.getByRole('progressbar');
    const indicator = progressBar.querySelector('[class*="before:animate"]');
    expect(indicator).toHaveClass('before:animate-pulse');
  });

  it('respects reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addListener: () => {},
        removeListener: () => {},
      }),
    });

    render(
      <EnhancedProgress
        value={50}
        data-testid='progress'
        aria-label='Test progress'
      />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('motion-reduce:transition-none');
  });
});

// ===== INTEGRATION TESTS =====

describe('EnhancedProgress - Integration', () => {
  it('works with form elements', () => {
    render(
      <form>
        <label htmlFor='upload-progress'>Upload Progress</label>
        <EnhancedProgress
          id='upload-progress'
          value={75}
          showLabel={true}
          aria-label='Upload progress indicator'
        />
      </form>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('id', 'upload-progress');
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
  });

  it('integrates with other components', () => {
    render(
      <div className='space-y-4'>
        <EnhancedProgress value={33} aria-label='Progress 1' />
        <CircularProgress value={66} aria-label='Progress 2' />
        <SteppedProgress
          currentStep={1}
          totalSteps={3}
          aria-label='Progress 3'
        />
      </div>
    );

    // SteppedProgress contains an EnhancedProgress, so we expect 2 progressbars total
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(2);
  });
});

// ===== VARIANT MATRIX VALIDATION =====

describe('EnhancedProgress - Variant Matrix Validation', () => {
  const variants = ['default', 'glass', 'minimal', 'elevated'] as const;
  const sizes = ['sm', 'md', 'lg', 'xl'] as const;
  const indicatorVariants = [
    'default',
    'success',
    'warning',
    'error',
    'info',
  ] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant correctly`, () => {
      render(
        <EnhancedProgress
          value={50}
          variant={variant}
          data-testid={`progress-${variant}`}
          aria-label={`Test progress ${variant}`}
        />
      );

      const progress = screen.getByTestId(`progress-${variant}`);
      expect(progress).toBeInTheDocument();
    });
  }

  for (const size of sizes) {
    it(`renders ${size} size correctly`, () => {
      render(
        <EnhancedProgress
          value={50}
          size={size}
          data-testid={`progress-${size}`}
          aria-label={`Test progress ${size}`}
        />
      );

      const progress = screen.getByTestId(`progress-${size}`);
      expect(progress).toBeInTheDocument();
    });
  }

  for (const indicatorVariant of indicatorVariants) {
    it(`renders ${indicatorVariant} indicator variant correctly`, () => {
      render(
        <EnhancedProgress
          value={50}
          indicatorVariant={indicatorVariant}
          data-testid={`progress-indicator-${indicatorVariant}`}
          aria-label={`Test progress ${indicatorVariant}`}
        />
      );

      const progress = screen.getByTestId(
        `progress-indicator-${indicatorVariant}`
      );
      expect(progress).toBeInTheDocument();
    });
  }

  for (const aaaMode of [true, false]) {
    it(`handles AAA enforcement: ${aaaMode}`, () => {
      render(
        <EnhancedProgress
          value={50}
          enforceAAA={aaaMode}
          data-testid={`progress-aaa-${aaaMode}`}
          aria-label={`Test progress AAA ${aaaMode}`}
        />
      );

      const progress = screen.getByTestId(`progress-aaa-${aaaMode}`);
      expect(progress).toBeInTheDocument();
    });
  }
});
