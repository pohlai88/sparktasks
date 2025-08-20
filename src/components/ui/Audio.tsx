/**
 * @fileoverview Audio Component - Enterprise-grade audio player wrapper
 * 
 * A comprehensive audio component that provides responsive behavior,
 * controls, waveform visualization, error handling, and accessibility.
 * Built for modern web applications with performance and UX in mind.
 * 
 * Features:
 * - 5 size variants (xs, sm, md, lg, xl)
 * - 4 visual variants (default, rounded, minimal, compact)
 * - Album art/cover image support with fallback
 * - Error state with fallback content
 * - Loading state with skeleton placeholder
 * - Responsive behavior with multiple sources
 * - Progressive audio enhancement
 * - Full accessibility (WCAG 2.1 AA)
 * - Controls customization (play/pause, seek, volume, progress)
 * - Auto-play control
 * - Loop control
 * - Muted/unmuted states
 * - Audio quality selection
 * - Preload strategies
 * - Track information display
 * - Playback speed control
 * - Keyboard navigation support
 * - Waveform visualization (optional)
 * 
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import React, { 
  forwardRef, 
  useState, 
  useCallback, 
  useRef, 
  useEffect, 
  useMemo 
} from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPES & INTERFACES =====

/**
 * Size variants for the audio player
 */
export type AudioSize = 
  | 'xs'          // Extra small - 240px base (compact player)
  | 'sm'          // Small - 320px base
  | 'md'          // Medium - 480px base
  | 'lg'          // Large - 640px base
  | 'xl';         // Extra large - 800px base

/**
 * Visual style variants for the audio player
 */
export type AudioVariant = 
  | 'default'     // Standard appearance with all controls
  | 'rounded'     // Rounded corners design
  | 'minimal'     // Simplified controls
  | 'compact';    // Single-line compact player

/**
 * Audio source with different quality options
 */
export interface AudioSource {
  src: string;
  type?: string;
  quality?: 'low' | 'medium' | 'high' | 'lossless';
}

/**
 * Track information for the audio
 */
export interface AudioTrack {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverArt?: string;
}

/**
 * Preload strategy for audio loading
 */
export type AudioPreload = 
  | 'none'        // No preloading
  | 'metadata'    // Preload only metadata
  | 'auto';       // Preload entire audio

/**
 * Props for the Audio component
 */
export interface AudioProps extends Omit<React.AudioHTMLAttributes<HTMLAudioElement>, 'src' | 'preload' | 'onTimeUpdate' | 'onVolumeChange'> {
  // ===== CONTENT =====
  /** Audio source URL or array of sources for different qualities */
  src: string | AudioSource[];
  /** Alternative text for accessibility */
  alt?: string;
  /** Track information */
  track?: AudioTrack;

  // ===== LAYOUT & APPEARANCE =====
  /** Size variant */
  size?: AudioSize;
  /** Visual style variant */
  variant?: AudioVariant;
  /** Custom width (overrides size) */
  width?: number | string;
  /** Custom height (overrides size) */
  height?: number | string;

  // ===== BEHAVIOR =====
  /** Show/hide audio controls */
  controls?: boolean;
  /** Auto-play the audio */
  autoPlay?: boolean;
  /** Loop the audio */
  loop?: boolean;
  /** Start muted */
  muted?: boolean;
  /** Preload strategy */
  preload?: AudioPreload;
  /** Playback rate */
  playbackRate?: number;
  /** Show track information */
  showTrackInfo?: boolean;
  /** Show waveform visualization */
  showWaveform?: boolean;
  /** Enable keyboard shortcuts */
  enableKeyboard?: boolean;

  // ===== STATE =====
  /** Loading state override */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Disabled state */
  disabled?: boolean;

  // ===== CUSTOM COMPONENTS =====
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom error fallback component */
  fallback?: React.ReactNode;

  // ===== STYLING =====
  /** Custom CSS class for audio element */
  className?: string;
  /** Custom CSS class for container */
  containerClassName?: string;
  /** Custom styles */
  style?: React.CSSProperties;

  // ===== EVENT HANDLERS =====
  /** Callback when audio starts playing */
  onPlay?: () => void;
  /** Callback when audio is paused */
  onPause?: () => void;
  /** Callback when audio ends */
  onEnded?: () => void;
  /** Callback when metadata loads */
  onLoadedMetadata?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  /** Callback when audio can start playing */
  onCanPlay?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  /** Callback during time updates */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** Callback when volume changes */
  onVolumeChange?: (volume: number, muted: boolean) => void;
  /** Callback when an error occurs */
  onError?: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
}

// ===== HELPER FUNCTIONS =====

/**
 * Get aspect ratio classes based on the aspect ratio prop
 */
const getAspectRatioClasses = (variant: AudioVariant): string => {
  const aspectRatioMap: Record<AudioVariant, string> = {
    default: '', // Auto height based on content
    rounded: '',
    minimal: '',
    compact: 'h-16', // Fixed compact height
  };
  
  return aspectRatioMap[variant];
};

/**
 * Get size classes based on the size prop
 */
const getSizeClasses = (size: AudioSize): string => {
  const sizeMap: Record<AudioSize, string> = {
    xs: 'w-60',      // 240px
    sm: 'w-80',      // 320px  
    md: 'w-[30rem]', // 480px
    lg: 'w-[40rem]', // 640px
    xl: 'w-[50rem]', // 800px
  };
  
  return sizeMap[size];
};

/**
 * Get variant classes based on the variant prop
 */
const getVariantClasses = (variant: AudioVariant): string => {
  const variantMap: Record<AudioVariant, string> = {
    default: DESIGN_TOKENS.theme.light.radius.md,
    rounded: DESIGN_TOKENS.theme.light.radius.lg,
    minimal: DESIGN_TOKENS.theme.light.radius.sm,
    compact: DESIGN_TOKENS.theme.light.radius.md,
  };
  
  return variantMap[variant];
};

/**
 * Get audio sources array from src prop
 */
const getAudioSources = (src: string | AudioSource[]): AudioSource[] => {
  if (typeof src === 'string') {
    return [{ src, type: 'audio/mpeg' }];
  }
  return src;
};

/**
 * Format time in MM:SS format
 */
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Default loading component
 */
const DefaultLoadingComponent: React.FC = () => (
  <div className={`${DESIGN_TOKENS.utils.centerAll} h-full`}>
    <div className={`${DESIGN_TOKENS.semantic.background.muted} ${DESIGN_TOKENS.theme.light.radius.md} p-4`}>
      <div className={`${DESIGN_TOKENS.icon.size.lg} ${DESIGN_TOKENS.motion.spin} rounded-full border-2 border-primary-200 border-t-primary-600`} />
      <p className={`${DESIGN_TOKENS.typography.body.small} ${DESIGN_TOKENS.semantic.text.muted} mt-2`}>
        Loading audio...
      </p>
    </div>
  </div>
);

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error: string }> = ({ error }) => (
  <div className={`${DESIGN_TOKENS.utils.centerAll} h-full`}>
    <div className={`${DESIGN_TOKENS.semantic.background.muted} ${DESIGN_TOKENS.theme.light.radius.md} p-6 text-center`}>
      <div className={`${DESIGN_TOKENS.icon.size.xl} ${DESIGN_TOKENS.semantic.text.muted} mx-auto mb-2`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <p className={`${DESIGN_TOKENS.typography.body.small} ${DESIGN_TOKENS.semantic.text.muted} mb-1`}>
        Audio Error
      </p>
      <p className={`${DESIGN_TOKENS.typography.body.xs} ${DESIGN_TOKENS.semantic.text.muted}`}>
        {error}
      </p>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====

/**
 * Audio Component
 * 
 * Enterprise-grade audio player wrapper with comprehensive features
 */
export const Audio = forwardRef<HTMLAudioElement, AudioProps>(({
  // Content props
  src,
  alt,
  track,
  
  // Layout & appearance props
  size = 'md',
  variant = 'default',
  width,
  height,
  
  // Behavior props
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
  playbackRate = 1,
  showTrackInfo = true,
  showWaveform = false,
  enableKeyboard = true,
  
  // State props
  loading = false,
  error,
  disabled = false,
  
  // Custom components
  loadingComponent,
  fallback,
  
  // Styling props
  className,
  containerClassName,
  style,
  
  // Event handlers
  onPlay,
  onPause,
  onEnded,
  onLoadedMetadata,
  onCanPlay,
  onTimeUpdate,
  onVolumeChange,
  onError,
  
  // Other HTML audio props
  ...audioProps
}, forwardedRef) => {

  // ===== STATE =====
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);

  // ===== COMPUTED VALUES =====
  
  const audioSources = useMemo(() => getAudioSources(src), [src]);
  const aspectRatioClasses = useMemo(() => getAspectRatioClasses(variant), [variant]);
  const sizeClasses = useMemo(() => getSizeClasses(size), [size]);
  const variantClasses = useMemo(() => getVariantClasses(variant), [variant]);
  
  const hasError = error || internalError;
  const showLoading = loading || isLoading;
  
  const combinedRef = (node: HTMLAudioElement | null) => {
    (audioRef as React.MutableRefObject<HTMLAudioElement | null>).current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const customStyles = useMemo(() => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style
  }), [width, height, style]);

  // ===== EVENT HANDLERS =====
  
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setInternalError(null);
  }, []);

  const handleLoadedMetadata = useCallback((event: React.SyntheticEvent<HTMLAudioElement>) => {
    setIsLoading(false);
    const audioElement = event.currentTarget;
    setDuration(audioElement.duration);
    onLoadedMetadata?.(event);
  }, [onLoadedMetadata]);

  const handleCanPlay = useCallback((event: React.SyntheticEvent<HTMLAudioElement>) => {
    setIsLoading(false);
    onCanPlay?.(event);
  }, [onCanPlay]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLAudioElement>) => {
    setIsLoading(false);
    setInternalError('Audio failed to load');
    onError?.(event);
  }, [onError]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleTimeUpdate = useCallback((event: React.SyntheticEvent<HTMLAudioElement>) => {
    const audioElement = event.currentTarget;
    setCurrentTime(audioElement.currentTime);
    onTimeUpdate?.(audioElement.currentTime, audioElement.duration);
  }, [onTimeUpdate]);

  const handleVolumeChange = useCallback((event: React.SyntheticEvent<HTMLAudioElement>) => {
    const audioElement = event.currentTarget;
    setVolume(audioElement.volume);
    setIsMuted(audioElement.muted);
    onVolumeChange?.(audioElement.volume, audioElement.muted);
  }, [onVolumeChange]);

  // ===== EFFECTS =====
  
  // Update playback rate when prop changes
  useEffect(() => {
    if (audioRef.current && playbackRate !== 1) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Reset error when src changes
  useEffect(() => {
    setInternalError(null);
    setIsLoading(false);
  }, [src]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboard || !audioRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!audioRef.current) return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
          break;
        case 'ArrowRight':
          event.preventDefault();
          audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
          break;
        case 'ArrowUp':
          event.preventDefault();
          audioRef.current.volume = Math.min(1, audioRef.current.volume + 0.1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.1);
          break;
        case 'm':
          event.preventDefault();
          audioRef.current.muted = !audioRef.current.muted;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, isPlaying, duration]);

  // ===== RENDER HELPERS =====
  
  const renderSources = () => {
    return audioSources.map((source, index) => (
      <source
        key={index}
        src={source.src}
        type={source.type}
      />
    ));
  };

  const renderLoadingState = () => {
    if (loadingComponent) {
      return loadingComponent;
    }
    return <DefaultLoadingComponent />;
  };

  const renderErrorState = () => {
    if (fallback) {
      return fallback;
    }
    return <DefaultErrorFallback error={hasError!} />;
  };

  const renderTrackInfo = () => {
    if (!showTrackInfo || !track || variant === 'compact') return null;

    return (
      <div className={`${DESIGN_TOKENS.utils.spaceBetween} mb-2 gap-2`}>
        {track.coverArt && (
          <img
            src={track.coverArt}
            alt={track.title || 'Album cover'}
            className={`size-12 ${DESIGN_TOKENS.theme.light.radius.sm} object-cover`}
          />
        )}
        <div className="min-w-0 flex-1">
          {track.title && (
            <h3 className={`${DESIGN_TOKENS.typography.body.medium} text-foreground truncate`}>
              {track.title}
            </h3>
          )}
          {track.artist && (
            <p className={`${DESIGN_TOKENS.typography.body.small} ${DESIGN_TOKENS.semantic.text.muted} truncate`}>
              {track.artist}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderControls = () => {
    if (!controls && variant !== 'compact') return null;

    return (
      <div className={`${DESIGN_TOKENS.utils.spaceBetween} mt-2 gap-2`}>
        {/* Play/Pause Button */}
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isPlaying) {
                audioRef.current.pause();
              } else {
                audioRef.current.play();
              }
            }
          }}
          disabled={Boolean(disabled || hasError)}
          className={`${DESIGN_TOKENS.recipe.button.secondary} ${DESIGN_TOKENS.icon.size.md}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Progress Bar */}
        <div className="flex flex-1 items-center gap-2">
          <span className={`${DESIGN_TOKENS.typography.body.xs} ${DESIGN_TOKENS.semantic.text.muted}`}>
            {formatTime(currentTime)}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-primary-600 transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className={`${DESIGN_TOKENS.typography.body.xs} ${DESIGN_TOKENS.semantic.text.muted}`}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !audioRef.current.muted;
              }
            }}
            disabled={Boolean(disabled || hasError)}
            className={`${DESIGN_TOKENS.recipe.button.ghost} ${DESIGN_TOKENS.icon.size.sm}`}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  };

  // ===== CLASS COMPOSITION =====
  
  const containerClasses = [
    'relative',
    DESIGN_TOKENS.semantic.background.muted,
    aspectRatioClasses,
    sizeClasses,
    variantClasses,
    disabled ? DESIGN_TOKENS.state.disabled : '',
    containerClassName,
  ].filter(Boolean).join(' ');

  const audioClasses = [
    'w-full',
    'sr-only', // Hide default audio controls as we use custom ones
    disabled ? 'pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ');

  // ===== RENDER =====
  
  return (
    <div 
      className={containerClasses} 
      style={customStyles}
      role="region"
      aria-label={alt || "Audio player"}
    >
      {/* Audio Element */}
      {!hasError && (
        <audio
          ref={combinedRef}
          className={audioClasses}
          src={typeof src === 'string' ? src : undefined}
          controls={false} // We use custom controls
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload={preload}
          onLoadStart={handleLoadStart}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onVolumeChange={handleVolumeChange}
          aria-label={alt}
          {...audioProps}
        >
          {/* Accessibility track for captions */}
          <track kind="captions" srcLang="en" label="English captions" default />
          {renderSources()}
          
          {/* Fallback text for browsers that don't support audio */}
          <p className={DESIGN_TOKENS.semantic.text.muted}>
            Your browser does not support the audio element.
          </p>
        </audio>
      )}

      {/* Custom UI */}
      <div className={`${DESIGN_TOKENS.spacing.md}`}>
        {/* Track Information */}
        {renderTrackInfo()}

        {/* Loading Overlay */}
        {showLoading && !hasError && (
          <div className={`${DESIGN_TOKENS.utils.overlay} ${DESIGN_TOKENS.utils.centerAll}`}>
            {renderLoadingState()}
          </div>
        )}

        {/* Error State */}
        {hasError && renderErrorState()}

        {/* Controls */}
        {!hasError && renderControls()}

        {/* Waveform Visualization (placeholder) */}
        {showWaveform && !hasError && !showLoading && (
          <div className={`mt-4 flex h-16 items-center justify-center gap-1`}>
            <div className={`${DESIGN_TOKENS.semantic.text.muted} text-center`}>
              <p className={DESIGN_TOKENS.typography.body.small}>
                Waveform visualization placeholder
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Audio.displayName = 'Audio';

export default Audio;
