/**
 * @fileoverview Thumbnail Component Tests
 *
 * Comprehensive test suite for the enterprise-grade Thumbnail component.
 * Tests all features, variants, accessibility, and edge cases.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Thumbnail } from '@/components/ui/Thumbnail';

// Mock image for testing
const mockImageSrc = 'https://example.com/test-image.jpg';
const mockImageAlt = 'Test image description';

// Mock badge component for testing
const MockBadge = ({ children }: { children: React.ReactNode }) => (
  <span data-testid='mock-badge'>{children}</span>
);

describe('Thumbnail Component - Enterprise Grade', () => {
  beforeEach(() => {
    // Reset all image load events
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);
      expect(screen.getByTestId('thumbnail')).toBeInTheDocument();
    });

    it('renders with provided src and alt text', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const image = screen.getByTestId('thumbnail-image');
      expect(image).toHaveAttribute('src', mockImageSrc);
      expect(image).toHaveAttribute('alt', mockImageAlt);
    });

    it('applies custom className', () => {
      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          className='custom-thumbnail'
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveClass('custom-thumbnail');
    });

    it('uses default props correctly', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveClass('w-16', 'h-16'); // md size default
    });
  });

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const;
    const expectedSizeClasses = {
      xs: ['w-8', 'h-8'],
      sm: ['w-12', 'h-12'],
      md: ['w-16', 'h-16'],
      lg: ['w-24', 'h-24'],
    };

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} size={size} />);

        const thumbnail = screen.getByTestId('thumbnail');
        expectedSizeClasses[size].forEach(className => {
          expect(thumbnail).toHaveClass(className);
        });
      });
    });
  });

  describe('Visual Variants', () => {
    const variants = ['default', 'rounded', 'circular', 'bordered'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <Thumbnail src={mockImageSrc} alt={mockImageAlt} variant={variant} />
        );

        const thumbnail = screen.getByTestId('thumbnail');
        expect(thumbnail).toBeInTheDocument();

        // Check for appropriate border radius classes based on variant
        if (variant === 'circular') {
          expect(thumbnail).toHaveClass('rounded-full');
        } else if (variant === 'bordered') {
          expect(thumbnail).toHaveClass('border');
        }
      });
    });
  });

  describe('Interaction Modes', () => {
    it('renders static mode correctly', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} mode='static' />);

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveAttribute('role', 'img');
      expect(thumbnail).not.toHaveAttribute('tabIndex');
    });

    it('renders interactive mode correctly', () => {
      const handleClick = vi.fn();
      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveAttribute('role', 'button');
      expect(thumbnail).toHaveAttribute('tabIndex', '0');
      expect(thumbnail).toHaveClass('cursor-pointer');
    });

    it('handles click events in interactive mode', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      await user.click(thumbnail);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation in interactive mode', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      thumbnail.focus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('does not handle clicks in static mode', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='static'
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      await user.click(thumbnail);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton by default', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      // Initially shows skeleton while image loads
      const container = screen.getByTestId('thumbnail');
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('hides loading skeleton when disabled', () => {
      render(
        <Thumbnail src={mockImageSrc} alt={mockImageAlt} showSkeleton={false} />
      );

      const container = screen.getByTestId('thumbnail');
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('calls onLoad when image loads successfully', async () => {
      const handleLoad = vi.fn();

      render(
        <Thumbnail src={mockImageSrc} alt={mockImageAlt} onLoad={handleLoad} />
      );

      const image = screen.getByTestId('thumbnail-image');
      fireEvent.load(image);

      expect(handleLoad).toHaveBeenCalledTimes(1);
    });

    it('calls onError when image fails to load', async () => {
      const handleError = vi.fn();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          onError={handleError}
        />
      );

      const image = screen.getByTestId('thumbnail-image');
      fireEvent.error(image);

      expect(handleError).toHaveBeenCalledTimes(1);
    });

    it('shows fallback content when image fails to load', async () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const image = screen.getByTestId('thumbnail-image');
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByTestId('thumbnail-fallback')).toBeInTheDocument();
      });
    });

    it('shows custom fallback when provided', async () => {
      const customFallback = (
        <div data-testid='custom-fallback'>Custom fallback</div>
      );

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          fallback={customFallback}
        />
      );

      const image = screen.getByTestId('thumbnail-image');
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      });
    });
  });

  describe('Badge Overlay', () => {
    it('renders badge when provided', () => {
      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          badge={<MockBadge>5</MockBadge>}
        />
      );

      expect(screen.getByTestId('thumbnail-badge')).toBeInTheDocument();
      expect(screen.getByTestId('mock-badge')).toBeInTheDocument();
    });

    it('positions badge correctly', () => {
      const positions = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ] as const;

      positions.forEach(position => {
        const { unmount } = render(
          <Thumbnail
            src={mockImageSrc}
            alt={mockImageAlt}
            badge={<MockBadge>Badge</MockBadge>}
            badgePosition={position}
          />
        );

        const badge = screen.getByTestId('thumbnail-badge');
        expect(badge).toHaveClass('absolute');

        // Check position classes
        if (position.includes('top')) {
          expect(badge).toHaveClass('top-1');
        }
        if (position.includes('bottom')) {
          expect(badge).toHaveClass('bottom-1');
        }
        if (position.includes('left')) {
          expect(badge).toHaveClass('left-1');
        }
        if (position.includes('right')) {
          expect(badge).toHaveClass('right-1');
        }

        unmount();
      });
    });

    it('does not render badge container when no badge provided', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      expect(screen.queryByTestId('thumbnail-badge')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styling', () => {
      render(
        <Thumbnail src={mockImageSrc} alt={mockImageAlt} disabled={true} />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveClass(
        'opacity-50',
        'grayscale',
        'cursor-not-allowed'
      );
    });

    it('does not handle clicks when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          disabled={true}
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      await user.click(thumbnail);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not handle keyboard events when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          disabled={true}
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      thumbnail.focus();

      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for static mode', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} mode='static' />);

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveAttribute('role', 'img');
      expect(thumbnail).toHaveAttribute('aria-label', mockImageAlt);
    });

    it('has proper ARIA attributes for interactive mode', () => {
      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          onClick={() => {}}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveAttribute('role', 'button');
      expect(thumbnail).toHaveAttribute('aria-label', `View ${mockImageAlt}`);
      expect(thumbnail).toHaveAttribute('tabIndex', '0');
    });

    it('supports custom aria-label', () => {
      const customLabel = 'Custom accessibility label';
      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          aria-label={customLabel}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveAttribute('aria-label', customLabel);
    });

    it('provides proper image alt text', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const image = screen.getByTestId('thumbnail-image');
      expect(image).toHaveAttribute('alt', mockImageAlt);
    });

    it('has proper focus management', () => {
      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          onClick={() => {}}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');
      thumbnail.focus();

      expect(document.activeElement).toBe(thumbnail);
    });
  });

  describe('Loading Strategy', () => {
    it('supports lazy loading by default', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const image = screen.getByTestId('thumbnail-image');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('supports eager loading', () => {
      render(
        <Thumbnail src={mockImageSrc} alt={mockImageAlt} loading='eager' />
      );

      const image = screen.getByTestId('thumbnail-image');
      expect(image).toHaveAttribute('loading', 'eager');
    });
  });

  describe('DESIGN_TOKENS Compliance', () => {
    it('uses DESIGN_TOKENS for styling', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const thumbnail = screen.getByTestId('thumbnail');

      // Should use semantic tokens for background colors
      const classString = thumbnail.className;
      expect(classString).toContain('bg-secondary-100');
      expect(classString).toContain('dark:bg-secondary-800/50');
    });

    it('applies size-specific classes correctly', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} size='lg' />);

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveClass('w-24', 'h-24');
    });

    it('uses semantic color tokens', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toBeInTheDocument();

      // Component should render without hardcoded colors
      expect(thumbnail.className).not.toMatch(/bg-gray-\d+/);
      expect(thumbnail.className).not.toMatch(/text-gray-\d+/);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty src gracefully', () => {
      render(<Thumbnail src='' alt={mockImageAlt} />);

      expect(screen.getByTestId('thumbnail')).toBeInTheDocument();
    });

    it('handles missing alt text', () => {
      // Should still render but may not be accessible
      render(<Thumbnail src={mockImageSrc} alt='' />);

      expect(screen.getByTestId('thumbnail')).toBeInTheDocument();
    });

    it('handles multiple rapid clicks correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Thumbnail
          src={mockImageSrc}
          alt={mockImageAlt}
          mode='interactive'
          onClick={handleClick}
        />
      );

      const thumbnail = screen.getByTestId('thumbnail');

      // Rapid fire clicks
      await user.click(thumbnail);
      await user.click(thumbnail);
      await user.click(thumbnail);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('handles very long alt text', () => {
      const longAlt = 'A'.repeat(1000);
      render(<Thumbnail src={mockImageSrc} alt={longAlt} />);

      const image = screen.getByTestId('thumbnail-image');
      expect(image).toHaveAttribute('alt', longAlt);
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal DOM structure', () => {
      render(<Thumbnail src={mockImageSrc} alt={mockImageAlt} />);

      const thumbnail = screen.getByTestId('thumbnail');

      // Should have a clean, minimal DOM structure
      expect(thumbnail.children.length).toBeLessThanOrEqual(3); // Loading, image, badge max
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<Thumbnail ref={ref} src={mockImageSrc} alt={mockImageAlt} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('thumbnail'));
    });
  });
});
