/**
 * @fileoverview Video Component Tests
 * 
 * Comprehensive test suite for the Video component covering:
 * - Basic rendering functionality
 * - All aspect ratios and size variants  
 * - Visual variants and styling
 * - Loading states and error handling
 * - Video controls and behavior
 * - Accessibili    it('sets muted when muted prop is true', () => {
      renderVideo({ muted: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('muted');
    });mpliance
 * - DESIGN_TOKENS integration
 * - Multiple video sources
 * - Event callbacks
 * 
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Video } from '@/components/ui/Video';
import type { VideoProps } from '@/components/ui/Video';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TEST UTILITIES =====

/**
 * Helper function to render Video with default props
 */
const renderVideo = (props: Partial<VideoProps> = {}) => {
  const defaultProps: VideoProps = {
    src: 'https://example.com/test-video.mp4',
    alt: 'Test video',
    ...props,
  };
  
  return render(<Video {...defaultProps} />);
};

/**
 * Helper to get the video element specifically
 */
const getVideoElement = () => {
  return screen.getByRole('region').querySelector('video') as HTMLVideoElement;
};

// Mock HTMLVideoElement properties and methods
Object.defineProperty(HTMLVideoElement.prototype, 'error', {
  get() {
    return this._error || null;
  },
  set(value) {
    this._error = value;
  },
  configurable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', {
  get() {
    return this._currentTime || 0;
  },
  set(value) {
    this._currentTime = value;
  },
  configurable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'duration', {
  get() {
    return this._duration || 100;
  },
  set(value) {
    this._duration = value;
  },
  configurable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'volume', {
  get() {
    return this._volume || 1;
  },
  set(value) {
    this._volume = value;
  },
  configurable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'muted', {
  get() {
    return this._muted || false;
  },
  set(value) {
    this._muted = value;
    if (value) {
      this.setAttribute('muted', '');
    } else {
      this.removeAttribute('muted');
    }
  },
  configurable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'playbackRate', {
  get() {
    return this._playbackRate || 1;
  },
  set(value) {
    this._playbackRate = value;
  },
  configurable: true,
});

// ===== SETUP & TEARDOWN =====

beforeAll(() => {
  // Mock console methods to avoid test noise
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});

// ===== TESTS =====

describe('Video Component', () => {

  // ===== BASIC FUNCTIONALITY TESTS =====

  describe('Basic Functionality', () => {
    it('renders without errors', () => {
      renderVideo();
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('renders video element with correct src', () => {
      const src = 'https://example.com/test-video.mp4';
      renderVideo({ src });
      
      const videoElement = getVideoElement();
      expect(videoElement).toBeInTheDocument();
      const sourceElement = videoElement.querySelector('source');
      expect(sourceElement).toHaveAttribute('src', src);
    });

    it('renders with string src', () => {
      const src = 'https://example.com/video.mp4';
      renderVideo({ src });
      
      const videoElement = getVideoElement();
      expect(videoElement).toBeInTheDocument();
    });

    it('renders with array of video sources', () => {
      const sources = [
        { src: 'https://example.com/video.mp4', type: 'video/mp4' },
        { src: 'https://example.com/video.webm', type: 'video/webm' },
      ];
      renderVideo({ src: sources });
      
      const videoElement = getVideoElement();
      expect(videoElement).toBeInTheDocument();
      
      const sourceElements = videoElement.querySelectorAll('source');
      expect(sourceElements).toHaveLength(2);
      expect(sourceElements[0]).toHaveAttribute('src', 'https://example.com/video.mp4');
      expect(sourceElements[1]).toHaveAttribute('src', 'https://example.com/video.webm');
    });

    it('displays poster image when provided', () => {
      const poster = 'https://example.com/poster.jpg';
      renderVideo({ poster });
      
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('poster', poster);
    });

    it('displays caption when provided', () => {
      const caption = 'This is a test video caption';
      renderVideo({ caption });
      
      expect(screen.getByText(caption)).toBeInTheDocument();
    });
  });

  // ===== ASPECT RATIO TESTS =====

  describe('Aspect Ratios', () => {
    it('applies square aspect ratio correctly', () => {
      const { container } = renderVideo({ aspectRatio: 'square' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.utils.aspectSquare);
    });

    it('applies video aspect ratio correctly', () => {
      const { container } = renderVideo({ aspectRatio: 'video' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.utils.aspectVideo);
    });

    it('applies portrait aspect ratio correctly', () => {
      const { container } = renderVideo({ aspectRatio: 'portrait' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('aspect-[3/4]');
    });

    it('applies landscape aspect ratio correctly', () => {
      const { container } = renderVideo({ aspectRatio: 'landscape' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('aspect-[4/3]');
    });

    it('applies wide aspect ratio correctly', () => {
      const { container } = renderVideo({ aspectRatio: 'wide' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('aspect-[21/9]');
    });

    it('applies auto aspect ratio correctly', () => {
      const { container } = renderVideo({ aspectRatio: 'auto' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).not.toHaveClass(DESIGN_TOKENS.utils.aspectVideo);
    });
  });

  // ===== SIZE VARIANT TESTS =====

  describe('Size Variants', () => {
    it('applies xs size correctly', () => {
      const { container } = renderVideo({ size: 'xs' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('w-40');
    });

    it('applies sm size correctly', () => {
      const { container } = renderVideo({ size: 'sm' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('w-64');
    });

    it('applies md size correctly (default)', () => {
      const { container } = renderVideo({ size: 'md' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('w-96');
    });

    it('applies lg size correctly', () => {
      const { container } = renderVideo({ size: 'lg' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('w-[32rem]');
    });

    it('applies xl size correctly', () => {
      const { container } = renderVideo({ size: 'xl' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('w-[48rem]');
    });
  });

  // ===== VISUAL VARIANT TESTS =====

  describe('Visual Variants', () => {
    it('applies default variant correctly', () => {
      const { container } = renderVideo({ variant: 'default' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass('relative');
    });

    it('applies rounded variant correctly', () => {
      const { container } = renderVideo({ variant: 'rounded' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.theme.light.radius.md);
    });

    it('applies circular variant correctly', () => {
      const { container } = renderVideo({ variant: 'circular' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.theme.light.radius.full);
    });

    it('applies cinematic variant correctly', () => {
      const { container } = renderVideo({ variant: 'cinematic' });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.theme.light.radius.lg);
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.theme.light.elevation.card);
    });
  });

  // ===== VIDEO BEHAVIOR TESTS =====

  describe('Video Behavior', () => {
    it('shows controls when controls prop is true', () => {
      renderVideo({ controls: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('controls');
    });

    it('hides controls when controls prop is false', () => {
      renderVideo({ controls: false });
      const videoElement = getVideoElement();
      expect(videoElement).not.toHaveAttribute('controls');
    });

    it('sets autoplay when autoPlay prop is true', () => {
      renderVideo({ autoPlay: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('autoplay');
    });

    it('sets loop when loop prop is true', () => {
      renderVideo({ loop: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('loop');
    });

    it('sets muted when muted prop is true', () => {
      renderVideo({ muted: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('muted');
    });

    it('sets preload correctly', () => {
      renderVideo({ preload: 'metadata' });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('preload', 'metadata');
    });

    it('sets disablePictureInPicture correctly', () => {
      renderVideo({ disablePictureInPicture: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveAttribute('disablepictureinpicture');
    });

    it('updates playback rate', async () => {
      renderVideo({ playbackRate: 2 });
      const videoElement = getVideoElement() as HTMLVideoElement;
      
      await waitFor(() => {
        expect(videoElement.playbackRate).toBe(2);
      });
    });
  });

  // ===== LOADING STATE TESTS =====

  describe('Loading States', () => {
    it('shows loading state when loading prop is true', () => {
      renderVideo({ loading: true });
      expect(screen.getByText('Loading video...')).toBeInTheDocument();
    });

    it('shows custom loading component when provided', () => {
      const customLoading = <div>Custom loading...</div>;
      renderVideo({ loading: true, loadingComponent: customLoading });
      expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    });

    it('hides loading state when loading prop is false', () => {
      renderVideo({ loading: false });
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
    });

    it('shows loading state on video load start', () => {
      renderVideo();
      const videoElement = getVideoElement();
      
      fireEvent.loadStart(videoElement);
      expect(screen.getByText('Loading video...')).toBeInTheDocument();
    });

    it('hides loading state on video loaded metadata', () => {
      renderVideo();
      const videoElement = getVideoElement();
      
      fireEvent.loadStart(videoElement);
      fireEvent.loadedMetadata(videoElement);
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
    });
  });

  // ===== ERROR HANDLING TESTS =====

  describe('Error Handling', () => {
    it('shows error state when error prop is provided', () => {
      const errorMessage = 'Custom error message';
      renderVideo({ error: errorMessage });
      
      expect(screen.getByText('Failed to load video')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('shows custom fallback when error occurs', () => {
      const customFallback = <div>Custom error fallback</div>;
      renderVideo({ error: 'Test error', fallback: customFallback });
      
      expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
    });

    it('shows error state on video error event', () => {
      renderVideo();
      const videoElement = getVideoElement() as HTMLVideoElement;
      
      // Mock error
      Object.defineProperty(videoElement, 'error', {
        get: () => ({ message: 'Network error' }),
      });
      fireEvent.error(videoElement);
      
      expect(screen.getByText('Failed to load video')).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onErrorSpy = vi.fn();
      renderVideo({ onError: onErrorSpy });
      
      const videoElement = getVideoElement() as HTMLVideoElement;
      Object.defineProperty(videoElement, 'error', {
        get: () => ({ message: 'Network error' }),
      });
      fireEvent.error(videoElement);
      
      expect(onErrorSpy).toHaveBeenCalledWith('Network error');
    });
  });

  // ===== DISABLED STATE TESTS =====

  describe('Disabled State', () => {
    it('applies disabled styling when disabled', () => {
      const { container } = renderVideo({ disabled: true });
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.state.disabled);
    });

    it('disables pointer events when disabled', () => {
      renderVideo({ disabled: true });
      const videoElement = getVideoElement();
      expect(videoElement).toHaveClass('pointer-events-none');
    });
  });

  // ===== EVENT CALLBACK TESTS =====

  describe('Event Callbacks', () => {
    it('calls onPlay when video starts playing', () => {
      const onPlaySpy = vi.fn();
      renderVideo({ onPlay: onPlaySpy });
      
      const videoElement = getVideoElement();
      fireEvent.play(videoElement);
      
      expect(onPlaySpy).toHaveBeenCalled();
    });

    it('calls onPause when video is paused', () => {
      const onPauseSpy = vi.fn();
      renderVideo({ onPause: onPauseSpy });
      
      const videoElement = getVideoElement();
      fireEvent.pause(videoElement);
      
      expect(onPauseSpy).toHaveBeenCalled();
    });

    it('calls onEnded when video ends', () => {
      const onEndedSpy = vi.fn();
      renderVideo({ onEnded: onEndedSpy });
      
      const videoElement = getVideoElement();
      fireEvent.ended(videoElement);
      
      expect(onEndedSpy).toHaveBeenCalled();
    });

    it('calls onLoadedMetadata when metadata loads', () => {
      const onLoadedMetadataSpy = vi.fn();
      renderVideo({ onLoadedMetadata: onLoadedMetadataSpy });
      
      const videoElement = getVideoElement();
      fireEvent.loadedMetadata(videoElement);
      
      expect(onLoadedMetadataSpy).toHaveBeenCalled();
    });

    it('calls onCanPlay when video can start playing', () => {
      const onCanPlaySpy = vi.fn();
      renderVideo({ onCanPlay: onCanPlaySpy });
      
      const videoElement = getVideoElement();
      fireEvent.canPlay(videoElement);
      
      expect(onCanPlaySpy).toHaveBeenCalled();
    });

    it('calls onTimeUpdate with current time and duration', () => {
      const onTimeUpdateSpy = vi.fn();
      renderVideo({ onTimeUpdate: onTimeUpdateSpy });
      
      const videoElement = getVideoElement() as HTMLVideoElement;
      Object.defineProperty(videoElement, 'currentTime', { value: 50 });
      Object.defineProperty(videoElement, 'duration', { value: 100 });
      fireEvent.timeUpdate(videoElement);
      
      expect(onTimeUpdateSpy).toHaveBeenCalledWith(50, 100);
    });

    it('calls onVolumeChange with volume and muted state', () => {
      const onVolumeChangeSpy = vi.fn();
      renderVideo({ onVolumeChange: onVolumeChangeSpy });
      
      const videoElement = getVideoElement() as HTMLVideoElement;
      Object.defineProperty(videoElement, 'volume', { value: 0.5 });
      Object.defineProperty(videoElement, 'muted', { value: false });
      fireEvent.volumeChange(videoElement);
      
      expect(onVolumeChangeSpy).toHaveBeenCalledWith(0.5, false);
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    it('has correct aria-label', () => {
      const alt = 'Instructional video';
      renderVideo({ alt });
      
      const container = screen.getByRole('region');
      expect(container).toHaveAttribute('aria-label', alt);
    });

    it('includes caption track for accessibility', () => {
      renderVideo();
      const videoElement = getVideoElement();
      const trackElement = videoElement.querySelector('track[kind="captions"]');
      
      expect(trackElement).toBeInTheDocument();
      expect(trackElement).toHaveAttribute('srcLang', 'en');
      expect(trackElement).toHaveAttribute('label', 'English');
    });

    it('provides fallback text for unsupported browsers', () => {
      renderVideo();
      expect(screen.getByText('Your browser does not support the video element.')).toBeInTheDocument();
    });

    it('has proper role for container', () => {
      renderVideo();
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  // ===== CUSTOM STYLING TESTS =====

  describe('Custom Styling', () => {
    it('applies custom className to video element', () => {
      const customClass = 'custom-video-class';
      renderVideo({ className: customClass });

      const videoElement = getVideoElement();
      expect(videoElement).toHaveClass(customClass);
    });    it('applies custom containerClassName to container', () => {
      const customClass = 'custom-container-class';
      const { container } = renderVideo({ containerClassName: customClass });
      
      const videoContainer = container.firstChild as HTMLElement;
      expect(videoContainer).toHaveClass(customClass);
    });

    it('applies custom width and height styles', () => {
      const { container } = renderVideo({ width: 500, height: 300 });
      const videoContainer = container.firstChild as HTMLElement;
      
      expect(videoContainer).toHaveStyle({ width: '500px', height: '300px' });
    });

    it('applies custom width and height as strings', () => {
      const { container } = renderVideo({ width: '50%', height: '100vh' });
      const videoContainer = container.firstChild as HTMLElement;
      
      expect(videoContainer).toHaveStyle({ width: '50%', height: '100vh' });
    });
  });

  // ===== DESIGN_TOKENS INTEGRATION TESTS =====

  describe('DESIGN_TOKENS Integration', () => {
    it('uses DESIGN_TOKENS for styling classes', () => {
      const { container } = renderVideo();
      const videoContainer = container.firstChild as HTMLElement;
      
      expect(videoContainer).toHaveClass('relative');
      expect(videoContainer).toHaveClass('overflow-hidden');
    });

    it('uses DESIGN_TOKENS for aspect ratios', () => {
      const { container } = renderVideo({ aspectRatio: 'video' });
      const videoContainer = container.firstChild as HTMLElement;
      
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.utils.aspectVideo);
    });

    it('uses DESIGN_TOKENS for motion classes', () => {
      renderVideo();
      const videoElement = getVideoElement();
      
      expect(videoElement).toHaveClass(DESIGN_TOKENS.motion.colors);
    });

    it('uses DESIGN_TOKENS for loading component styling', () => {
      renderVideo({ loading: true });
      
      const loadingText = screen.getByText('Loading video...');
      expect(loadingText).toHaveClass(DESIGN_TOKENS.typography.body.small);
      expect(loadingText).toHaveClass(DESIGN_TOKENS.semantic.text.muted);
    });

    it('uses DESIGN_TOKENS for error component styling', () => {
      renderVideo({ error: 'Test error' });
      
      const errorText = screen.getByText('Failed to load video');
      expect(errorText).toHaveClass(DESIGN_TOKENS.typography.body.small);
      expect(errorText).toHaveClass(DESIGN_TOKENS.semantic.text.muted);
    });
  });

  // ===== RESPONSIVE BEHAVIOR TESTS =====

  describe('Responsive Behavior', () => {
    it('maintains aspect ratio on different screen sizes', () => {
      const { container } = renderVideo({ aspectRatio: 'video', size: 'lg' });
      const videoContainer = container.firstChild as HTMLElement;
      
      expect(videoContainer).toHaveClass(DESIGN_TOKENS.utils.aspectVideo);
      expect(videoContainer).toHaveClass('w-[32rem]');
    });

    it('handles auto aspect ratio with custom dimensions', () => {
      const { container } = renderVideo({ 
        aspectRatio: 'auto', 
        width: 800, 
        height: 600 
      });
      const videoContainer = container.firstChild as HTMLElement;
      
      expect(videoContainer).toHaveStyle({ width: '800px', height: '600px' });
      expect(videoContainer).not.toHaveClass(DESIGN_TOKENS.utils.aspectVideo);
    });
  });

  // ===== EDGE CASES =====

  describe('Edge Cases', () => {
    it('handles empty video sources array', () => {
      renderVideo({ src: [] });
      const videoElement = getVideoElement();
      expect(videoElement).toBeInTheDocument();
    });

    it('handles missing alt text gracefully', () => {
      renderVideo({});
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('resets error state when src changes', async () => {
      const { rerender } = renderVideo({ error: 'Initial error' });
      expect(screen.getByText('Failed to load video')).toBeInTheDocument();
      
      rerender(<Video src="https://example.com/new-video.mp4" alt="New video" />);
      expect(screen.queryByText('Failed to load video')).not.toBeInTheDocument();
    });

    it('handles ref forwarding correctly', () => {
      const ref = { current: null };
      render(<Video src="https://example.com/test-video.mp4" alt="Test video" ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLVideoElement);
    });
  });
});
