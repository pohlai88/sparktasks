/**
 * Spinner Component Tests - Enterprise-Grade Validation
 *
 * Comprehensive test suite for DESIGN_TOKENS V3.2 Spinner component:
 * - All sizes and variants
 * - Accessibility compliance (WCAG 2.1)
 * - Motion reduction support
 * - Screen reader compatibility
 * - Event handling and interactions
 * - Compound components (SpinnerWithText, PageSpinner, ButtonSpinner)
 * - Type safety and API contracts
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Spinner,
  SpinnerWithText,
  PageSpinner,
  ButtonSpinner,
} from '../../src/components/ui/Spinner';
import '@testing-library/jest-dom';

describe('Spinner Component - Enterprise Grade', () => {
  describe('Basic Rendering', () => {
    it('renders a basic spinner without errors', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading...');
    });

    it('renders as SVG element with correct structure', () => {
      render(<Spinner data-testid='spinner-svg' />);
      const svg = screen.getByTestId('spinner-svg');
      expect(svg.tagName).toBe('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('role', 'status');
    });

    it('includes title element for screen readers', () => {
      render(<Spinner label='Custom loading message' />);
      const title = document.querySelector('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Custom loading message');
    });
  });

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    it.each(sizes)('renders %s size correctly', size => {
      render(<Spinner size={size} data-testid={`spinner-${size}`} />);
      const spinner = screen.getByTestId(`spinner-${size}`);
      expect(spinner).toBeInTheDocument();

      // Verify size classes are applied
      const expectedSizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
      };

      expect(spinner).toHaveClass(expectedSizeClasses[size]);
    });

    it('defaults to medium size when no size specified', () => {
      render(<Spinner data-testid='default-spinner' />);
      const spinner = screen.getByTestId('default-spinner');
      expect(spinner).toHaveClass('h-5', 'w-5');
    });
  });

  describe('Visual Variants', () => {
    it('renders primary variant with correct styling', () => {
      render(<Spinner variant='primary' data-testid='primary-spinner' />);
      const spinner = screen.getByTestId('primary-spinner');

      // Check for animated circle
      const animatedCircle = spinner.querySelectorAll('circle')[1];
      expect(animatedCircle).toHaveClass('text-blue-600', 'dark:text-blue-400');
    });

    it('renders secondary variant with correct styling', () => {
      render(<Spinner variant='secondary' data-testid='secondary-spinner' />);
      const spinner = screen.getByTestId('secondary-spinner');

      const animatedCircle = spinner.querySelectorAll('circle')[1];
      expect(animatedCircle).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });

    it('renders muted variant with correct styling', () => {
      render(<Spinner variant='muted' data-testid='muted-spinner' />);
      const spinner = screen.getByTestId('muted-spinner');

      const animatedCircle = spinner.querySelectorAll('circle')[1];
      expect(animatedCircle).toHaveClass('text-gray-400', 'dark:text-gray-500');
    });

    it('defaults to primary variant when no variant specified', () => {
      render(<Spinner data-testid='default-variant' />);
      const spinner = screen.getByTestId('default-variant');

      const animatedCircle = spinner.querySelectorAll('circle')[1];
      expect(animatedCircle).toHaveClass('text-blue-600', 'dark:text-blue-400');
    });
  });

  describe('Animation Speed', () => {
    it('applies slow speed animation', () => {
      render(<Spinner speed='slow' data-testid='slow-spinner' />);
      const spinner = screen.getByTestId('slow-spinner');
      expect(spinner).toHaveClass('[animation-duration:2s]');
    });

    it('applies normal speed animation by default', () => {
      render(<Spinner data-testid='normal-spinner' />);
      const spinner = screen.getByTestId('normal-spinner');
      expect(spinner).toHaveClass('[animation-duration:1s]');
    });

    it('applies fast speed animation', () => {
      render(<Spinner speed='fast' data-testid='fast-spinner' />);
      const spinner = screen.getByTestId('fast-spinner');
      expect(spinner).toHaveClass('[animation-duration:0.5s]');
    });
  });

  describe('Display Modes', () => {
    it('renders as block element by default', () => {
      render(<Spinner data-testid='block-spinner' />);
      const spinner = screen.getByTestId('block-spinner');
      expect(spinner).toHaveClass('block');
      expect(spinner).not.toHaveClass('inline-block');
    });

    it('renders as inline element when inline prop is true', () => {
      render(<Spinner inline data-testid='inline-spinner' />);
      const spinner = screen.getByTestId('inline-spinner');
      expect(spinner).toHaveClass('inline-block');
      expect(spinner).not.toHaveClass('block');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper ARIA attributes', () => {
      render(<Spinner label='Processing data' />);
      const spinner = screen.getByRole('status');

      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-label', 'Processing data');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('supports custom accessibility labels', () => {
      render(<Spinner label='Uploading files...' />);
      const spinner = screen.getByLabelText('Uploading files...');
      expect(spinner).toBeInTheDocument();
    });

    it('includes screen reader optimizations', () => {
      render(<Spinner label='Please wait' />);
      const title = document.querySelector('title');
      expect(title).toHaveTextContent('Please wait');
    });
  });

  describe('Motion Reduction Support', () => {
    it('includes motion-reduce classes for accessibility', () => {
      render(<Spinner data-testid='motion-safe-spinner' />);
      const spinner = screen.getByTestId('motion-safe-spinner');

      expect(spinner).toHaveClass('motion-reduce:animate-none');
      expect(spinner).toHaveClass('motion-reduce:opacity-50');
    });
  });

  describe('Custom Styling', () => {
    it('accepts additional CSS classes', () => {
      render(<Spinner className='custom-class' data-testid='custom-spinner' />);
      const spinner = screen.getByTestId('custom-spinner');
      expect(spinner).toHaveClass('custom-class');
    });

    it('maintains base classes when custom classes are added', () => {
      render(<Spinner className='my-spinner' data-testid='styled-spinner' />);
      const spinner = screen.getByTestId('styled-spinner');

      // Should maintain base animation class
      expect(spinner).toHaveClass('animate-spin');
      expect(spinner).toHaveClass('my-spinner');
    });
  });

  describe('SVG Structure and Animation', () => {
    it('contains background and animated circles', () => {
      render(<Spinner data-testid='circle-spinner' />);
      const spinner = screen.getByTestId('circle-spinner');

      const circles = spinner.querySelectorAll('circle');
      expect(circles).toHaveLength(2);

      // Background circle
      expect(circles[0]).toHaveAttribute('opacity', '0.25');

      // Animated circle
      expect(circles[1]).toHaveAttribute('stroke-linecap', 'round');
      expect(circles[1]).toHaveAttribute('stroke-dasharray', '32');
    });

    it('includes animateTransform element for SVG animation', () => {
      render(<Spinner data-testid='animated-spinner' />);
      const spinner = screen.getByTestId('animated-spinner');

      // Check for animation by verifying the circle has transform attribute
      const animatedCircle = spinner.querySelectorAll('circle')[1];
      expect(animatedCircle).toHaveAttribute('transform', 'rotate(-90 12 12)');

      // Check that the animateTransform element exists (may be lowercase in DOM)
      const animateElements = spinner.querySelectorAll(
        'animatetransform, animateTransform'
      );
      expect(animateElements.length).toBeGreaterThan(0);
    });
  });
});

describe('SpinnerWithText Component', () => {
  it('renders spinner with text', () => {
    render(<SpinnerWithText text='Loading data...' />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('positions text to the right by default', () => {
    const { container } = render(<SpinnerWithText text='Loading...' />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('flex', 'items-center');
    expect(wrapper).not.toHaveClass('flex-col');
  });

  it('positions text below when textPosition is bottom', () => {
    const { container } = render(
      <SpinnerWithText text='Loading...' textPosition='bottom' />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('flex-col', 'gap-2');
  });

  it('passes through spinner props correctly', () => {
    render(
      <SpinnerWithText
        text='Processing...'
        size='lg'
        variant='secondary'
        data-testid='text-spinner'
      />
    );

    const spinner = screen.getByTestId('text-spinner');
    expect(spinner).toHaveClass('h-6', 'w-6'); // lg size
  });
});

describe('PageSpinner Component', () => {
  it('renders full-page overlay spinner', () => {
    const { container } = render(<PageSpinner />);
    const overlay = container.firstChild as HTMLElement;

    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
    expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('includes backdrop by default', () => {
    const { container } = render(<PageSpinner />);
    const overlay = container.firstChild as HTMLElement;

    expect(overlay).toHaveClass(
      'bg-white/80',
      'dark:bg-gray-900/80',
      'backdrop-blur-sm'
    );
  });

  it('can disable backdrop', () => {
    const { container } = render(<PageSpinner backdrop={false} />);
    const overlay = container.firstChild as HTMLElement;

    expect(overlay).not.toHaveClass('bg-white/80');
    expect(overlay).not.toHaveClass('backdrop-blur-sm');
  });

  it('renders with custom label', () => {
    render(<PageSpinner label='Loading application...' />);

    // Use getAllByText since the label appears in both title and p element
    const labelElements = screen.getAllByText('Loading application...');
    expect(labelElements).toHaveLength(2); // title and p element

    // Check aria-label on the main wrapper div (not the svg)
    const pageWrapper = document.querySelector(
      '[aria-label="Loading application..."]'
    );
    expect(pageWrapper).toBeInTheDocument();
  });

  it('uses xl size spinner for better visibility', () => {
    render(<PageSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8', 'w-8'); // xl size
  });
});

describe('ButtonSpinner Component', () => {
  it('renders children when not loading', () => {
    render(<ButtonSpinner loading={false}>Save Changes</ButtonSpinner>);

    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders spinner when loading', () => {
    render(<ButtonSpinner loading={true}>Save Changes</ButtonSpinner>);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('applies loading opacity to content when loading', () => {
    const { container } = render(
      <ButtonSpinner loading={true}>Save Changes</ButtonSpinner>
    );

    const contentSpan = container.querySelector('span:last-child');
    expect(contentSpan).toHaveClass('opacity-70');
  });

  it('does not apply loading opacity when not loading', () => {
    const { container } = render(
      <ButtonSpinner loading={false}>Save Changes</ButtonSpinner>
    );

    const contentSpan = container.querySelector('span:last-child');
    expect(contentSpan).not.toHaveClass('opacity-70');
  });

  it('uses small size spinner by default for buttons', () => {
    render(<ButtonSpinner loading={true}>Save</ButtonSpinner>);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-4', 'w-4'); // sm size
  });
});

describe('Forward Ref Support', () => {
  it('forwards ref to SVG element', () => {
    const ref = vi.fn();
    render(<Spinner ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(SVGSVGElement));
  });
});

describe('Type Safety', () => {
  it('accepts all valid size values', () => {
    // This test ensures TypeScript compilation - if it compiles, types are correct
    render(
      <>
        <Spinner size='xs' />
        <Spinner size='sm' />
        <Spinner size='md' />
        <Spinner size='lg' />
        <Spinner size='xl' />
      </>
    );
  });

  it('accepts all valid variant values', () => {
    render(
      <>
        <Spinner variant='primary' />
        <Spinner variant='secondary' />
        <Spinner variant='muted' />
      </>
    );
  });

  it('accepts all valid speed values', () => {
    render(
      <>
        <Spinner speed='slow' />
        <Spinner speed='normal' />
        <Spinner speed='fast' />
      </>
    );
  });
});
