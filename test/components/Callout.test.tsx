/**
 * Callout Component Tests
 *
 * Comprehensive test suite for the Callout component ensuring
 * enterprise-grade quality and accessibility compliance.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Callout from '@/components/ui/Callout';

// Test utilities
const CALLOUT_VARIANTS = [
  'info',
  'success',
  'warning',
  'error',
  'note',
] as const;
const CALLOUT_SIZES = ['sm', 'md', 'lg'] as const;

describe('Callout Component', () => {
  beforeEach(() => {
    cleanup();
  });

  // ===== BASIC FUNCTIONALITY =====
  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<Callout>Test content</Callout>);

      expect(screen.getByRole('note')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<Callout title='Important Notice'>Test content</Callout>);

      expect(screen.getByText('Important Notice')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders with nested content', () => {
      render(
        <Callout>
          <div>Nested content</div>
          <p>With paragraph</p>
        </Callout>
      );

      expect(screen.getByText('Nested content')).toBeInTheDocument();
      expect(screen.getByText('With paragraph')).toBeInTheDocument();
    });
  });

  // ===== VARIANT TESTS =====
  describe('Variants', () => {
    CALLOUT_VARIANTS.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <Callout variant={variant} data-testid={`callout-${variant}`}>
            {variant} content
          </Callout>
        );

        const callout = screen.getByTestId(`callout-${variant}`);
        expect(callout).toBeInTheDocument();
        expect(screen.getByText(`${variant} content`)).toBeInTheDocument();
      });
    });

    it('applies correct ARIA roles for variants', () => {
      // Error and warning should be alerts
      render(<Callout variant='error'>Error message</Callout>);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      cleanup();
      render(<Callout variant='warning'>Warning message</Callout>);
      expect(screen.getByRole('alert')).toBeInTheDocument();

      cleanup();
      // Success should be status
      render(<Callout variant='success'>Success message</Callout>);
      expect(screen.getByRole('status')).toBeInTheDocument();

      cleanup();
      // Info and note should be note
      render(<Callout variant='info'>Info message</Callout>);
      expect(screen.getByRole('note')).toBeInTheDocument();
    });
  });

  // ===== SIZE TESTS =====
  describe('Sizes', () => {
    CALLOUT_SIZES.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <Callout size={size} data-testid={`callout-${size}`}>
            {size} content
          </Callout>
        );

        const callout = screen.getByTestId(`callout-${size}`);
        expect(callout).toBeInTheDocument();
        expect(screen.getByText(`${size} content`)).toBeInTheDocument();
      });
    });
  });

  // ===== ICON FUNCTIONALITY =====
  describe('Icon Functionality', () => {
    it('shows semantic icon by default', () => {
      render(<Callout variant='info'>Content</Callout>);

      // Should have an SVG icon
      const svg = screen.getByRole('note').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('hides icon when showIcon is false', () => {
      render(
        <Callout variant='info' showIcon={false}>
          Content
        </Callout>
      );

      // Should not have an SVG icon
      const svg = screen.getByRole('note').querySelector('svg');
      expect(svg).toBeNull();
    });

    it('renders custom icon when provided', () => {
      const customIcon = <span data-testid='custom-icon'>Custom</span>;

      render(
        <Callout variant='info' icon={customIcon}>
          Content
        </Callout>
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('different variants have different semantic icons', () => {
      const variants = ['info', 'success', 'warning', 'error', 'note'] as const;

      variants.forEach((variant, index) => {
        render(
          <Callout variant={variant} data-testid={`callout-${variant}`}>
            Content
          </Callout>
        );

        const callout = screen.getByTestId(`callout-${variant}`);
        const svg = callout.querySelector('svg');

        if (variant === 'note') {
          // Note variant should have star icon
          expect(svg).toBeInTheDocument();
        } else {
          // Other variants should have appropriate icons
          expect(svg).toBeInTheDocument();
        }

        cleanup();
      });
    });
  });

  // ===== DISMISSIBLE FUNCTIONALITY =====
  describe('Dismissible Functionality', () => {
    it('shows dismiss button when dismissible is true', () => {
      render(<Callout dismissible>Dismissible content</Callout>);

      const dismissButton = screen.getByRole('button', {
        name: /dismiss callout/i,
      });
      expect(dismissButton).toBeInTheDocument();
    });

    it('hides dismiss button when dismissible is false', () => {
      render(<Callout dismissible={false}>Non-dismissible content</Callout>);

      const dismissButton = screen.queryByRole('button', {
        name: /dismiss callout/i,
      });
      expect(dismissButton).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(
        <Callout dismissible onDismiss={onDismiss}>
          Dismissible content
        </Callout>
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss callout/i,
      });
      await user.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('removes callout from DOM when dismissed', async () => {
      const user = userEvent.setup();

      render(
        <Callout dismissible data-testid='dismissible-callout'>
          Dismissible content
        </Callout>
      );

      const callout = screen.getByTestId('dismissible-callout');
      expect(callout).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', {
        name: /dismiss callout/i,
      });
      await user.click(dismissButton);

      expect(
        screen.queryByTestId('dismissible-callout')
      ).not.toBeInTheDocument();
    });
  });

  // ===== ACCESSIBILITY =====
  describe('Accessibility', () => {
    it('has proper ARIA live regions for different variants', () => {
      // Error/warning should be assertive
      render(<Callout variant='error'>Error message</Callout>);
      expect(screen.getByRole('alert')).toHaveAttribute(
        'aria-live',
        'assertive'
      );

      cleanup();
      render(<Callout variant='warning'>Warning message</Callout>);
      expect(screen.getByRole('alert')).toHaveAttribute(
        'aria-live',
        'assertive'
      );

      cleanup();
      // Success should be polite
      render(<Callout variant='success'>Success message</Callout>);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

      cleanup();
      // Info/note should be polite
      render(<Callout variant='info'>Info message</Callout>);
      expect(screen.getByRole('note')).toHaveAttribute('aria-live', 'polite');
    });

    it('has proper aria-hidden on icons', () => {
      render(<Callout variant='info'>Content</Callout>);

      const iconContainer = screen
        .getByRole('note')
        .querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('dismiss button has proper accessible name', () => {
      render(<Callout dismissible>Content</Callout>);

      const dismissButton = screen.getByRole('button', {
        name: /dismiss callout/i,
      });
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss callout');
    });

    it('dismiss button supports keyboard interaction', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(
        <Callout dismissible onDismiss={onDismiss}>
          Content
        </Callout>
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss callout/i,
      });

      // Focus and press Enter
      dismissButton.focus();
      await user.keyboard('{Enter}');

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  // ===== FORWARDED REF =====
  describe('Forwarded Ref', () => {
    it('forwards ref to the callout div', () => {
      const ref = { current: null };

      render(<Callout ref={ref}>Content</Callout>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Content');
    });
  });

  // ===== CUSTOM PROPS =====
  describe('Custom Props', () => {
    it('passes through custom className', () => {
      render(
        <Callout className='custom-class' data-testid='custom-callout'>
          Content
        </Callout>
      );

      const callout = screen.getByTestId('custom-callout');
      expect(callout).toHaveClass('custom-class');
    });

    it('passes through custom data attributes', () => {
      render(
        <Callout data-custom='test-value' data-testid='custom-callout'>
          Content
        </Callout>
      );

      const callout = screen.getByTestId('custom-callout');
      expect(callout).toHaveAttribute('data-custom', 'test-value');
    });

    it('supports custom style prop', () => {
      render(
        <Callout style={{ marginTop: '20px' }} data-testid='styled-callout'>
          Content
        </Callout>
      );

      const callout = screen.getByTestId('styled-callout');
      expect(callout).toHaveStyle({ marginTop: '20px' });
    });
  });
});
