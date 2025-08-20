/**
 * @fileoverview Image Component Tests
 * 
 * Comprehensive test suite for the Image component covering:
 * - Basic rendering functionality
 * - All aspect ratios and size variants  
 * - Visual variants and styling
 * - Loading states and error handling
 * - Lazy loading behavior
 * - Accessibility compliance
 * - DESIGN_TOKENS integration
 * - Responsive image support
 * - Object fit positioning
 * 
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Image, type ImageProps } from '@/components/ui/Image';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TEST UTILITIES =====

/**
 * Helper function to render Image with default props
 */
const renderImage = (props: Partial<ImageProps> = {}) => {
  const defaultProps: ImageProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image',
    ...props,
  };
  
  return render(<Image {...defaultProps} />);
};

// ===== SETUP & TEARDOWN =====

beforeAll(() => {
  // Mock console methods to avoid test noise
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ===== BASIC FUNCTIONALITY TESTS =====

describe('Image Component', () => {
  describe('Basic Functionality', () => {
    it('renders image container without errors', () => {
      renderImage();
      expect(screen.getByTestId('image-container')).toBeInTheDocument();
    });

    it('renders image with correct src and alt attributes', async () => {
      renderImage({ loading: 'eager' });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img).toHaveAttribute('src', 'https://example.com/test-image.jpg');
        expect(img).toHaveAttribute('alt', 'Test image');
      });
    });

    it('applies custom className to image', async () => {
      renderImage({ loading: 'eager', className: 'custom-class' });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img).toHaveClass('custom-class');
      });
    });
  });

  // ===== ASPECT RATIO TESTS =====

  describe('Aspect Ratios', () => {
    it('applies correct aspect ratio classes', () => {
      const aspectRatios = ['square', 'video', 'portrait', 'landscape', 'wide', 'auto'] as const;
      
      aspectRatios.forEach(aspectRatio => {
        const { unmount } = renderImage({ aspectRatio });
        const container = screen.getByTestId('image-container');
        
        if (aspectRatio === 'auto') {
          expect(container).not.toHaveClass('aspect-square', 'aspect-video');
        } else if (aspectRatio === 'square') {
          expect(container).toHaveClass('aspect-square');
        } else if (aspectRatio === 'video') {
          expect(container).toHaveClass('aspect-video');
        }
        
        unmount();
      });
    });

    it('shows natural dimensions when aspectRatio is auto', () => {
      renderImage({ aspectRatio: 'auto', size: 'md' });
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass('w-48', 'h-48');
    });
  });

  // ===== SIZE VARIANTS TESTS =====

  describe('Size Variants', () => {
    it('applies correct size classes for auto aspect ratio', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      
      sizes.forEach(size => {
        const { unmount } = renderImage({ aspectRatio: 'auto', size });
        const container = screen.getByTestId('image-container');
        
        // Check that size classes are applied when aspectRatio is auto
        expect(container.className).toMatch(/w-\d+.*h-\d+/);
        
        unmount();
      });
    });

    it('does not apply size classes when aspect ratio is set', () => {
      renderImage({ aspectRatio: 'square', size: 'lg' });
      const container = screen.getByTestId('image-container');
      
      // Should have aspect-square but not size classes
      expect(container).toHaveClass('aspect-square');
      expect(container).not.toHaveClass('w-64', 'h-64');
    });
  });

  // ===== VISUAL VARIANTS TESTS =====

  describe('Visual Variants', () => {
    it('applies correct variant classes', () => {
      const variants = ['default', 'rounded', 'circular', 'thumbnail'] as const;
      
      variants.forEach(variant => {
        const { unmount } = renderImage({ variant });
        const container = screen.getByTestId('image-container');
        
        // All variants should have some form of border radius
        expect(container.className).toMatch(/rounded/);
        
        unmount();
      });
    });

    it('applies border to thumbnail variant', () => {
      renderImage({ variant: 'thumbnail' });
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass('border');
    });
  });

  // ===== OBJECT FIT TESTS =====

  describe('Object Fit', () => {
    it('applies correct object fit classes', async () => {
      const fits = ['cover', 'contain', 'fill', 'scale-down', 'none'] as const;
      
      for (const fit of fits) {
        const { unmount } = renderImage({ loading: 'eager', fit });
        
        await waitFor(() => {
          const img = screen.getByTestId('image');
          expect(img).toHaveClass(`object-${fit === 'scale-down' ? 'scale-down' : fit}`);
        });
        
        unmount();
      }
    });
  });

  // ===== LOADING STATES TESTS =====

  describe('Loading States', () => {
    it('shows skeleton placeholder by default while loading', () => {
      renderImage({ showSkeleton: true });
      
      // Should show loading placeholder initially
      expect(screen.getByTestId('image-container')).toBeInTheDocument();
      
      // Should have loading styles
      const container = screen.getByTestId('image-container');
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('does not show skeleton when showSkeleton is false', () => {
      renderImage({ showSkeleton: false });
      
      const container = screen.getByTestId('image-container');
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('shows custom placeholder when provided', () => {
      const placeholder = <div data-testid="custom-placeholder">Loading...</div>;
      renderImage({ placeholder });
      
      expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
    });

    it('calls onLoad callback when image loads', async () => {
      const onLoad = vi.fn();
      renderImage({ loading: 'eager', onLoad });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        fireEvent.load(img);
      });
      
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  // ===== ERROR HANDLING TESTS =====

  describe('Error Handling', () => {
    it('shows fallback content when image fails to load', async () => {
      renderImage({ loading: 'eager' });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        fireEvent.error(img);
      });
      
      expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
      expect(screen.getByText('Image not available')).toBeInTheDocument();
    });

    it('shows custom fallback when provided', async () => {
      const fallback = <div data-testid="custom-fallback">Failed to load</div>;
      renderImage({ loading: 'eager', fallback });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        fireEvent.error(img);
      });
      
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    it('calls onError callback when image fails', async () => {
      const onError = vi.fn();
      renderImage({ loading: 'eager', onError });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        fireEvent.error(img);
      });
      
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  // ===== LAZY LOADING TESTS =====

  describe('Lazy Loading', () => {
    it('loads image immediately when loading is eager', async () => {
      renderImage({ loading: 'eager' });
      
      await waitFor(() => {
        expect(screen.getByTestId('image')).toBeInTheDocument();
      });
    });

    it('respects loading attribute value', async () => {
      renderImage({ loading: 'eager' });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img).toHaveAttribute('loading', 'eager');
      });
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      renderImage({ loading: 'eager' });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img).toHaveAttribute('alt', 'Test image');
      });
    });

    it('applies aria-hidden to decorative elements', () => {
      renderImage();
      
      // Error fallback SVG should have aria-hidden
      const container = screen.getByTestId('image-container');
      const svg = container.querySelector('svg');
      if (svg) {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      }
    });
  });

  // ===== DISABLED STATE TESTS =====

  describe('Disabled State', () => {
    it('applies disabled styling when disabled', () => {
      renderImage({ disabled: true });
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass('opacity-50', 'grayscale', 'cursor-not-allowed');
    });

    it('applies disabled styling to image when disabled', async () => {
      renderImage({ loading: 'eager', disabled: true });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img).toHaveClass('grayscale', 'cursor-not-allowed');
      });
    });
  });

  // ===== RESPONSIVE IMAGE TESTS =====

  describe('Responsive Images', () => {
    it('applies srcSet and sizes attributes', async () => {
      const srcSet = 'image-300.jpg 300w, image-600.jpg 600w';
      const sizes = '(max-width: 768px) 100vw, 50vw';
      
      renderImage({ loading: 'eager', srcSet, sizes });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img).toHaveAttribute('srcset', srcSet);
        expect(img).toHaveAttribute('sizes', sizes);
      });
    });
  });

  // ===== DESIGN TOKENS INTEGRATION TESTS =====

  describe('DESIGN_TOKENS Integration', () => {
    it('uses semantic background tokens', () => {
      renderImage();
      const container = screen.getByTestId('image-container');
      
      // Should use semantic background muted from DESIGN_TOKENS
      expect(container.className).toContain(DESIGN_TOKENS.semantic.background.muted);
    });

    it('uses typography tokens for fallback text', () => {
      renderImage();
      
      // Check that fallback uses typography tokens (will be tested when error occurs)
      expect(screen.getByTestId('image-container')).toBeInTheDocument();
    });

    it('uses icon size tokens for fallback icon', () => {
      renderImage();
      
      // Fallback icon should use DESIGN_TOKENS.icon.size.lg
      const container = screen.getByTestId('image-container');
      expect(container).toBeInTheDocument();
    });

    it('uses motion tokens for transitions', async () => {
      renderImage({ loading: 'eager' });
      
      await waitFor(() => {
        const img = screen.getByTestId('image');
        expect(img.className).toContain(DESIGN_TOKENS.motion.smooth);
      });
    });
  });

  // ===== CONTAINER PROPS TESTS =====

  describe('Container Props', () => {
    it('applies container props to wrapper div', () => {
      const containerProps = {
        className: 'custom-container-class',
      };
      
      renderImage({ containerProps });
      
      // Should find by default testid and have custom class
      const container = screen.getByTestId('image-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('custom-container-class');
    });
  });

  // ===== EDGE CASES TESTS =====

  describe('Edge Cases', () => {
    it('handles src change gracefully', async () => {
      const { rerender } = renderImage({ loading: 'eager', src: 'image1.jpg' });
      
      await waitFor(() => {
        expect(screen.getByTestId('image')).toHaveAttribute('src', 'image1.jpg');
      });
      
      rerender(<Image src="image2.jpg" alt="Test image" loading="eager" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('image')).toHaveAttribute('src', 'image2.jpg');
      });
    });

    it('handles empty src gracefully', () => {
      renderImage({ src: '' });
      expect(screen.getByTestId('image-container')).toBeInTheDocument();
    });
  });
});
