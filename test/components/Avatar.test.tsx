import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar - Optimized Enterprise Component', () => {
  const src = 'https://example.com/avatar.png';
  const alt = 'User Avatar';
  const fallback = 'UA';

  describe('Basic Functionality', () => {
    it('renders image with correct src and alt', () => {
      render(<Avatar src={src} alt={alt} />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('src', src);
      expect(img).toHaveAttribute('alt', alt);
    });

    it('defaults to empty alt when not provided', () => {
      render(<Avatar src={src} />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('alt', '');
    });

    it('applies default size when not specified', () => {
      render(<Avatar src={src} />);
      const container = screen.getByTestId('avatar-container');
      expect(container).toHaveAttribute('data-size', 'md');
    });

    it('applies loading and decoding attributes with defaults', () => {
      render(<Avatar src={src} />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('decoding', 'async');
    });

    it('allows custom loading and decoding attributes', () => {
      render(<Avatar src={src} loading="eager" decoding="sync" />);
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('loading', 'eager');
      expect(img).toHaveAttribute('decoding', 'sync');
    });
  });

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    
    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Avatar src={src} size={size} />);
        const container = screen.getByTestId('avatar-container');
        expect(container).toHaveAttribute('data-size', size);
      });
    });
  });

  describe('Status Indicators', () => {
    const statuses = ['online', 'busy', 'offline'] as const;
    const expectedLabels = ['Online', 'Busy', 'Offline'] as const;

    statuses.forEach((status, index) => {
      it(`renders ${status} status with correct indicator and label`, () => {
        render(<Avatar src={src} status={status} />);
        const container = screen.getByTestId('avatar-container');
        expect(container).toHaveAttribute('data-status', status);
        
        const statusAnnouncement = screen.getByText(`Avatar status: ${expectedLabels[index]}`);
        expect(statusAnnouncement).toHaveClass('sr-only');
        expect(statusAnnouncement).toHaveAttribute('aria-live', 'polite');
        expect(statusAnnouncement).toHaveAttribute('aria-atomic', 'true');
      });
    });

    it('does not render status label when no status provided', () => {
      render(<Avatar src={src} />);
      const container = screen.getByTestId('avatar-container');
      expect(container).not.toHaveAttribute('data-status');
      expect(screen.queryByText(/Online|Busy|Offline/)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling & Fallback', () => {
    it('renders fallback when image fails to load', () => {
      render(<Avatar src="broken.png" fallback={fallback} alt={alt} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveTextContent(fallback);
      expect(fallbackElement).toHaveAttribute('role', 'img');
      expect(fallbackElement).toHaveAttribute('aria-label', alt);
    });

    it('uses fallback as aria-label when alt is not provided', () => {
      render(<Avatar src="broken.png" fallback={fallback} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveAttribute('aria-label', fallback);
    });

    it('calls custom onError handler when provided', () => {
      const onError = vi.fn();
      render(<Avatar src="broken.png" onError={onError} fallback={fallback} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('does not render fallback if no fallback text provided', () => {
      render(<Avatar src="broken.png" alt={alt} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
      expect(screen.getByTestId('avatar-container')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains WCAG 2.1 AA compliance with proper roles', () => {
      render(<Avatar src={src} alt={alt} status="online" />);
      
      // Image should be properly labeled
      const img = screen.getByRole('img', { hidden: true });
      expect(img).toHaveAttribute('alt', alt);
      
      // Status should be announced to screen readers
      const statusAnnouncement = screen.getByText('Avatar status: Online');
      expect(statusAnnouncement).toHaveAttribute('aria-live', 'polite');
    });

    it('provides proper fallback accessibility', () => {
      render(<Avatar src="broken.png" fallback={fallback} alt={alt} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      const fallbackElement = screen.getByTestId('avatar-fallback');
      expect(fallbackElement).toHaveAttribute('role', 'img');
      expect(fallbackElement).toHaveAttribute('aria-label', alt);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards container ref correctly', () => {
      const spanRef = React.createRef<HTMLSpanElement>();
      render(<Avatar src={src} ref={spanRef} />);
      
      expect(spanRef.current).not.toBeNull();
      expect(spanRef.current).toBeInstanceOf(HTMLSpanElement);
      expect(spanRef.current).toHaveAttribute('data-testid', 'avatar-container');
    });

    it('forwards image ref correctly', () => {
      const imgRef = React.createRef<HTMLImageElement>();
      render(<Avatar src={src} imgRef={imgRef} />);
      
      expect(imgRef.current).not.toBeNull();
      expect(imgRef.current).toBeInstanceOf(HTMLImageElement);
      expect(imgRef.current).toHaveAttribute('src', src);
    });

    it('forwards container ref to fallback element', () => {
      const spanRef = React.createRef<HTMLSpanElement>();
      render(<Avatar src="broken.png" fallback={fallback} ref={spanRef} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      expect(spanRef.current).not.toBeNull();
      expect(spanRef.current).toHaveAttribute('data-testid', 'avatar-fallback');
    });
  });

  describe('Props Forwarding', () => {
    it('forwards additional image props correctly', () => {
      const customProps = {
        'data-custom': 'test-value',
        title: 'Custom title',
        crossOrigin: 'anonymous' as const,
      };
      
      render(<Avatar src={src} {...customProps} />);
      const img = screen.getByRole('img', { hidden: true });
      
      expect(img).toHaveAttribute('data-custom', 'test-value');
      expect(img).toHaveAttribute('title', 'Custom title');
      expect(img).toHaveAttribute('crossorigin', 'anonymous');
    });

    it('applies custom className to container', () => {
      const customClass = 'custom-avatar-class';
      render(<Avatar src={src} className={customClass} />);
      const container = screen.getByTestId('avatar-container');
      
      expect(container).toHaveClass(customClass);
    });
  });

  describe('Performance Optimizations', () => {
    it('maintains stable references across re-renders with same props', () => {
      const { rerender } = render(<Avatar src={src} size="lg" status="online" />);
      const container1 = screen.getByTestId('avatar-container');
      const img1 = screen.getByRole('img', { hidden: true });
      
      // Re-render with same props
      rerender(<Avatar src={src} size="lg" status="online" />);
      const container2 = screen.getByTestId('avatar-container');
      const img2 = screen.getByRole('img', { hidden: true });
      
      // Elements should be the same (React reconciliation)
      expect(container1).toBe(container2);
      expect(img1).toBe(img2);
    });

    it('updates efficiently when status changes', () => {
      const { rerender } = render(<Avatar src={src} status="online" />);
      expect(screen.getByText('Avatar status: Online')).toBeInTheDocument();
      
      rerender(<Avatar src={src} status="busy" />);
      expect(screen.getByText('Avatar status: Busy')).toBeInTheDocument();
      expect(screen.queryByText('Avatar status: Online')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined status gracefully', () => {
      render(<Avatar src={src} status={undefined} />);
      const container = screen.getByTestId('avatar-container');
      
      expect(container).not.toHaveAttribute('data-status');
      expect(screen.queryByText(/Online|Busy|Offline/)).not.toBeInTheDocument();
    });

    it('handles empty fallback string', () => {
      render(<Avatar src="broken.png" fallback="" alt={alt} />);
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      // Should still render normal container, not fallback
      expect(screen.getByTestId('avatar-container')).toBeInTheDocument();
      expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
    });

    it('handles complex status changes with fallback', () => {
      const { rerender } = render(
        <Avatar src="broken.png" fallback={fallback} status="online" />
      );
      const img = screen.getByRole('img', { hidden: true });
      
      act(() => {
        fireEvent.error(img);
      });

      expect(screen.getByTestId('avatar-fallback')).toHaveAttribute('data-status', 'online');
      
      rerender(<Avatar src="broken.png" fallback={fallback} status="busy" />);
      expect(screen.getByTestId('avatar-fallback')).toHaveAttribute('data-status', 'busy');
    });
  });
});
