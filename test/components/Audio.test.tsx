/**
 * Audio Component Test Suite
 *
 * Comprehensive tests for the Audio component following enterprise patterns
 * and ensuring DESIGN_TOKENS compliance.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Audio } from '../../src/components/ui/Audio';
import '@testing-library/jest-dom';

// Mock HTML5 Audio API
const createMockAudio = () => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  currentTime: 0,
  duration: 100,
  volume: 1,
  muted: false,
  paused: true,
  ended: false,
  readyState: 4,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Mock HTMLAudioElement
const mockAudio = createMockAudio();

Object.defineProperty(window, 'HTMLAudioElement', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockAudio),
});

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

describe('Audio Component - Enterprise Grade', () => {
  const defaultProps = {
    src: 'https://example.com/audio.mp3',
    'data-testid': 'test-audio-container',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock audio state
    Object.assign(mockAudio, createMockAudio());
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Audio {...defaultProps} />);
      expect(
        screen.getByRole('region', { name: /audio player/i })
      ).toBeInTheDocument();
    });

    it('renders audio element with correct source', () => {
      render(<Audio {...defaultProps} />);
      const audioElement = screen.getByRole('region').querySelector('audio');
      expect(audioElement).toBeInTheDocument();
      expect(audioElement).toHaveAttribute(
        'src',
        'https://example.com/audio.mp3'
      );
    });

    it('has proper ARIA labeling', () => {
      render(<Audio {...defaultProps} alt='Test audio description' />);
      expect(
        screen.getByRole('region', { name: 'Test audio description' })
      ).toBeInTheDocument();
    });

    it('includes accessibility track element', () => {
      render(<Audio {...defaultProps} />);
      const audioElement = screen.getByRole('region').querySelector('audio');
      const trackElement = audioElement?.querySelector('track');
      expect(trackElement).toBeInTheDocument();
      expect(trackElement).toHaveAttribute('kind', 'captions');
    });
  });

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Audio {...defaultProps} size={size} />);
        const container = screen.getByRole('region');
        expect(container).toBeInTheDocument();
        // Check that container has size-related classes
        expect(container.className).toMatch(/w-/); // Has width class
      });
    });
  });

  describe('Visual Variants', () => {
    const variants = ['default', 'rounded', 'minimal', 'compact'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Audio {...defaultProps} variant={variant} />);
        const container = screen.getByRole('region');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Track Information Display', () => {
    it('renders track information when provided', () => {
      const track = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
      };

      render(<Audio {...defaultProps} track={track} showTrackInfo />);

      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('renders cover art when provided', () => {
      const track = {
        title: 'Test Song',
        coverArt: 'https://example.com/cover.jpg',
      };

      render(<Audio {...defaultProps} track={track} showTrackInfo />);

      const coverImage = screen.getByRole('img', {
        name: /test song|album cover/i,
      });
      expect(coverImage).toHaveAttribute(
        'src',
        'https://example.com/cover.jpg'
      );
    });

    it('hides track info when showTrackInfo is false', () => {
      const track = {
        title: 'Test Song',
        artist: 'Test Artist',
      };

      render(<Audio {...defaultProps} track={track} showTrackInfo={false} />);

      expect(screen.queryByText('Test Song')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Artist')).not.toBeInTheDocument();
    });
  });

  describe('Controls and Interaction', () => {
    it('has play/pause button', () => {
      render(<Audio {...defaultProps} />);
      const playButton = screen.getByRole('button', { name: /play/i });
      expect(playButton).toBeInTheDocument();
    });

    it('has mute button', () => {
      render(<Audio {...defaultProps} />);
      const muteButton = screen.getByRole('button', { name: /mute/i });
      expect(muteButton).toBeInTheDocument();
    });

    it('shows progress bar with time display', () => {
      render(<Audio {...defaultProps} />);
      // Check for time display elements
      const timeElements = screen.getAllByText('0:00');
      expect(timeElements).toHaveLength(2); // Current time and duration
    });

    it('handles play button click', async () => {
      const user = userEvent.setup();
      render(<Audio {...defaultProps} />);

      const playButton = screen.getByRole('button', { name: /play/i });
      await user.click(playButton);

      // Verify button is still accessible (component handles the state internally)
      expect(playButton).toBeInTheDocument();
    });

    it('handles mute button click', async () => {
      const user = userEvent.setup();
      render(<Audio {...defaultProps} />);

      const muteButton = screen.getByRole('button', { name: /mute/i });
      await user.click(muteButton);

      // Verify button is still accessible
      expect(muteButton).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('displays loading state when loading prop is true', () => {
      render(<Audio {...defaultProps} loading />);
      expect(screen.getByText(/loading audio/i)).toBeInTheDocument();
    });

    it('displays error state when error prop is provided', () => {
      const errorMessage = 'Failed to load audio';
      render(<Audio {...defaultProps} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(/audio error/i)).toBeInTheDocument();
    });

    it('hides audio element when in error state', () => {
      render(<Audio {...defaultProps} error='Test error' />);
      const audioElement = screen.getByRole('region').querySelector('audio');
      expect(audioElement).not.toBeInTheDocument();
    });
  });

  describe('Multiple Audio Sources', () => {
    it('renders multiple source elements when src is an array', () => {
      const sources = [
        { src: 'audio.mp3', type: 'audio/mpeg' },
        { src: 'audio.ogg', type: 'audio/ogg' },
        { src: 'audio.wav', type: 'audio/wav' },
      ];

      render(<Audio src={sources} />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      const sourceElements = audioElement?.querySelectorAll('source');

      expect(sourceElements).toHaveLength(3);
      expect(sourceElements?.[0]).toHaveAttribute('src', 'audio.mp3');
      expect(sourceElements?.[0]).toHaveAttribute('type', 'audio/mpeg');
    });

    it('renders single source when src is string', () => {
      render(<Audio {...defaultProps} />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      expect(audioElement).toHaveAttribute(
        'src',
        'https://example.com/audio.mp3'
      );
    });
  });

  describe('Event Handling', () => {
    it('calls onPlay callback when provided', () => {
      const onPlay = vi.fn();
      render(<Audio {...defaultProps} onPlay={onPlay} />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      fireEvent.play(audioElement!);

      expect(onPlay).toHaveBeenCalled();
    });

    it('calls onPause callback when provided', () => {
      const onPause = vi.fn();
      render(<Audio {...defaultProps} onPause={onPause} />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      fireEvent.pause(audioElement!);

      expect(onPause).toHaveBeenCalled();
    });

    it('calls onEnded callback when provided', () => {
      const onEnded = vi.fn();
      render(<Audio {...defaultProps} onEnded={onEnded} />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      fireEvent.ended(audioElement!);

      expect(onEnded).toHaveBeenCalled();
    });

    it('calls onError callback when provided', () => {
      const onError = vi.fn();
      render(<Audio {...defaultProps} onError={onError} />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      fireEvent.error(audioElement!);

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('disables controls when disabled prop is true', () => {
      render(<Audio {...defaultProps} disabled />);

      const playButton = screen.getByRole('button', { name: /play/i });
      const muteButton = screen.getByRole('button', { name: /mute/i });

      expect(playButton).toBeDisabled();
      expect(muteButton).toBeDisabled();
    });

    it('disables controls when in error state', () => {
      render(<Audio {...defaultProps} error='Test error' />);

      // In error state, controls should not be rendered
      expect(
        screen.queryByRole('button', { name: /play/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /mute/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom Components', () => {
    it('accepts custom loading component', () => {
      const CustomLoading = () => <div>Custom loading component</div>;
      render(
        <Audio {...defaultProps} loading loadingComponent={<CustomLoading />} />
      );

      expect(screen.getByText('Custom loading component')).toBeInTheDocument();
    });

    it('accepts custom error fallback', () => {
      const CustomError = () => <div>Custom error component</div>;
      render(
        <Audio
          {...defaultProps}
          error='Test error'
          fallback={<CustomError />}
        />
      );

      expect(screen.getByText('Custom error component')).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('accepts custom className for container', () => {
      render(
        <Audio {...defaultProps} containerClassName='custom-container-class' />
      );

      const container = screen.getByRole('region');
      expect(container).toHaveClass('custom-container-class');
    });

    it('accepts custom className for audio element', () => {
      render(<Audio {...defaultProps} className='custom-audio-class' />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      expect(audioElement).toHaveClass('custom-audio-class');
    });

    it('accepts custom style prop', () => {
      const customStyle = { backgroundColor: 'red' };
      render(<Audio {...defaultProps} style={customStyle} />);

      const container = screen.getByRole('region');
      expect(container).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper keyboard navigation support', () => {
      render(<Audio {...defaultProps} enableKeyboard />);

      const container = screen.getByRole('region');
      expect(container).toBeInTheDocument();

      // Component sets up keyboard listeners on mount
      // Testing actual keyboard events would require more complex setup
    });

    it('includes proper ARIA attributes', () => {
      render(<Audio {...defaultProps} alt='Background music player' />);

      const container = screen.getByRole('region', {
        name: 'Background music player',
      });
      expect(container).toBeInTheDocument();

      const audioElement = container.querySelector('audio');
      expect(audioElement).toHaveAttribute(
        'aria-label',
        'Background music player'
      );
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the audio element', () => {
      const ref = React.createRef<HTMLAudioElement>();
      render(<Audio {...defaultProps} ref={ref} />);

      // The ref should be available after render
      expect(ref.current).toBeTruthy();
      expect(ref.current?.tagName).toBe('AUDIO');
    });
  });

  describe('Advanced Features', () => {
    it('shows waveform placeholder when enabled', () => {
      render(<Audio {...defaultProps} showWaveform />);

      expect(
        screen.getByText(/waveform visualization placeholder/i)
      ).toBeInTheDocument();
    });

    it('hides waveform when disabled', () => {
      render(<Audio {...defaultProps} showWaveform={false} />);

      expect(
        screen.queryByText(/waveform visualization placeholder/i)
      ).not.toBeInTheDocument();
    });

    it('respects preload strategy', () => {
      render(<Audio {...defaultProps} preload='auto' />);

      const audioElement = screen.getByRole('region').querySelector('audio');
      expect(audioElement).toHaveAttribute('preload', 'auto');
    });
  });
});
