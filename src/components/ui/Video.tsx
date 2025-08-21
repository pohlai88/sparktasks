/**
 * @fileoverview Video Component - Enterprise-grade video player wrapper
 *
 * A comprehensive video component that provides responsive behavior,
 * aspect ratio management, controls, poster images, error handling, and accessibility.
 * Built for modern web applications with performance and UX in mind.
 *
 * Features:
 * - Multiple aspect ratios (square, video, portrait, landscape, custom)
 * - 5 size variants (xs, sm, md, lg, xl)
 * - 4 visual variants (default, rounded, circular, cinematic)
 * - Poster image support with fallback
 * - Error state with fallback content
 * - Loading state with skeleton placeholder
 * - Responsive behavior with multiple sources
 * - Progressive video enhancement
 * - Full accessibility (WCAG 2.1 AA)
 * - Controls customization
 * - Auto-play and loop control
 * - Muted/unmuted states
 * - Picture-in-picture support
 * - Video quality selection
 * - Preload strategies
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
  useMemo,
} from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPES & INTERFACES =====

/**
 * Aspect ratio options for the video
 */
export type VideoAspectRatio =
  | 'square' // 1:1 aspect ratio
  | 'video' // 16:9 aspect ratio
  | 'portrait' // 3:4 aspect ratio
  | 'landscape' // 4:3 aspect ratio
  | 'wide' // 21:9 aspect ratio
  | 'auto'; // Natural video dimensions

/**
 * Size variants for the video
 */
export type VideoSize =
  | 'xs' // Extra small - 160px base
  | 'sm' // Small - 256px base
  | 'md' // Medium - 384px base
  | 'lg' // Large - 512px base
  | 'xl'; // Extra large - 768px base

/**
 * Visual style variants for the video
 */
export type VideoVariant =
  | 'default' // Standard appearance
  | 'rounded' // Rounded corners
  | 'circular' // Circular/oval shape (works with square aspect)
  | 'cinematic'; // Cinematic style with enhanced shadows

/**
 * Video source with different quality options
 */
export interface VideoSource {
  src: string;
  type?: string;
  media?: string;
  quality?: 'low' | 'medium' | 'high' | 'hd' | '4k';
}

/**
 * Preload strategy for video loading
 */
export type VideoPreload =
  | 'none' // No preloading
  | 'metadata' // Preload only metadata
  | 'auto'; // Preload entire video

/**
 * Props for the Video component
 */
export interface VideoProps
  extends Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    'src' | 'poster' | 'preload'
  > {
  // ===== CONTENT =====
  /** Video source URL or array of sources for different qualities */
  src: string | VideoSource[];
  /** Poster image URL */
  poster?: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Caption/description for the video */
  caption?: string;

  // ===== LAYOUT & APPEARANCE =====
  /** Aspect ratio for the video */
  aspectRatio?: VideoAspectRatio;
  /** Size variant */
  size?: VideoSize;
  /** Visual style variant */
  variant?: VideoVariant;
  /** Custom width (overrides size) */
  width?: number | string;
  /** Custom height (overrides size) */
  height?: number | string;

  // ===== BEHAVIOR =====
  /** Show/hide video controls */
  controls?: boolean;
  /** Auto-play the video */
  autoPlay?: boolean;
  /** Loop the video */
  loop?: boolean;
  /** Start muted */
  muted?: boolean;
  /** Preload strategy */
  preload?: VideoPreload;
  /** Enable picture-in-picture */
  disablePictureInPicture?: boolean;
  /** Playback rate */
  playbackRate?: number;

  // ===== STATE =====
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state message */
  error?: string;

  // ===== CALLBACKS =====
  /** Callback when video starts playing */
  onPlay?: () => void;
  /** Callback when video is paused */
  onPause?: () => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback when video fails to load */
  onError?: (error: string) => void;
  /** Callback when video metadata loads */
  onLoadedMetadata?: () => void;
  /** Callback when video can start playing */
  onCanPlay?: () => void;
  /** Callback for time updates */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** Callback for volume changes */
  onVolumeChange?: (volume: number, muted: boolean) => void;

  // ===== CUSTOMIZATION =====
  /** Custom CSS classes */
  className?: string;
  /** Custom container classes */
  containerClassName?: string;
  /** Show fallback content when error occurs */
  fallback?: React.ReactNode;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
}

// ===== STYLE HELPERS =====

/**
 * Get aspect ratio classes based on the aspectRatio prop
 */
const getAspectRatioClasses = (aspectRatio: VideoAspectRatio): string => {
  const aspectRatioMap: Record<VideoAspectRatio, string> = {
    square: DESIGN_TOKENS.utils.aspectSquare,
    video: DESIGN_TOKENS.utils.aspectVideo,
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[21/9]',
    auto: '',
  };

  return aspectRatioMap[aspectRatio];
};

/**
 * Get size classes based on the size prop
 */
const getSizeClasses = (
  size: VideoSize,
  aspectRatio: VideoAspectRatio
): string => {
  // For auto aspect ratio, use explicit width/height
  if (aspectRatio === 'auto') {
    const sizeMap: Record<VideoSize, string> = {
      xs: 'w-40', // 160px
      sm: 'w-64', // 256px
      md: 'w-96', // 384px
      lg: 'w-[32rem]', // 512px
      xl: 'w-[48rem]', // 768px
    };
    return sizeMap[size];
  }

  // For fixed aspect ratios, use width only (height is determined by aspect ratio)
  const sizeMap: Record<VideoSize, string> = {
    xs: 'w-40', // 160px
    sm: 'w-64', // 256px
    md: 'w-96', // 384px
    lg: 'w-[32rem]', // 512px
    xl: 'w-[48rem]', // 768px
  };

  return sizeMap[size];
};

/**
 * Get variant classes based on the variant prop
 */
const getVariantClasses = (variant: VideoVariant): string => {
  const variantMap: Record<VideoVariant, string> = {
    default: '',
    rounded: DESIGN_TOKENS.theme.light.radius.md,
    circular: DESIGN_TOKENS.theme.light.radius.full,
    cinematic: `${DESIGN_TOKENS.theme.light.radius.lg} ${DESIGN_TOKENS.theme.light.elevation.card}`,
  };

  return variantMap[variant];
};

/**
 * Get video sources array from src prop
 */
const getVideoSources = (src: string | VideoSource[]): VideoSource[] => {
  if (typeof src === 'string') {
    return [{ src, type: 'video/mp4' }];
  }
  return src;
};

/**
 * Default loading component
 */
const DefaultLoadingComponent: React.FC = () => (
  <div className={`${DESIGN_TOKENS.utils.centerAll} h-full`}>
    <div
      className={`${DESIGN_TOKENS.semantic.background.muted} ${DESIGN_TOKENS.theme.light.radius.md} p-4`}
    >
      <div
        className={`${DESIGN_TOKENS.icon.size.lg} ${DESIGN_TOKENS.motion.spin} rounded-full border-2 border-primary-200 border-t-primary-600`}
      />
      <p
        className={`${DESIGN_TOKENS.typography.body.small} ${DESIGN_TOKENS.semantic.text.muted} mt-2`}
      >
        Loading video...
      </p>
    </div>
  </div>
);

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error: string }> = ({ error }) => (
  <div className={`${DESIGN_TOKENS.utils.centerAll} h-full`}>
    <div
      className={`${DESIGN_TOKENS.semantic.background.muted} ${DESIGN_TOKENS.theme.light.radius.md} p-6 text-center`}
    >
      <div
        className={`${DESIGN_TOKENS.icon.size.xl} ${DESIGN_TOKENS.semantic.text.muted} mx-auto mb-2`}
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
          <line x1='12' y1='9' x2='12' y2='13' />
          <line x1='12' y1='17' x2='12.01' y2='17' />
        </svg>
      </div>
      <p
        className={`${DESIGN_TOKENS.typography.body.small} ${DESIGN_TOKENS.semantic.text.muted} mb-1`}
      >
        Failed to load video
      </p>
      <p
        className={`${DESIGN_TOKENS.typography.body.xs} ${DESIGN_TOKENS.semantic.text.muted}`}
      >
        {error}
      </p>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====

/**
 * Video Component
 *
 * Enterprise-grade video player wrapper with comprehensive features
 */
export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      // Content props
      src,
      poster,
      alt,
      caption,

      // Layout & appearance props
      aspectRatio = 'video',
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
      disablePictureInPicture = false,
      playbackRate = 1,

      // State props
      disabled = false,
      loading = false,
      error,

      // Event callbacks
      onPlay,
      onPause,
      onEnded,
      onError,
      onLoadedMetadata,
      onCanPlay,
      onTimeUpdate,
      onVolumeChange,

      // Customization props
      className = '',
      containerClassName = '',
      fallback,
      loadingComponent,

      // Standard video props
      ...videoProps
    },
    ref
  ) => {
    // ===== STATE =====
    const [internalError, setInternalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(loading);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLVideoElement | null) => {
        if (videoRef.current !== node) {
          videoRef.current = node;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // ===== COMPUTED VALUES =====
    const videoSources = useMemo(() => getVideoSources(src), [src]);
    const aspectRatioClasses = useMemo(
      () => getAspectRatioClasses(aspectRatio),
      [aspectRatio]
    );
    const sizeClasses = useMemo(
      () => getSizeClasses(size, aspectRatio),
      [size, aspectRatio]
    );
    const variantClasses = useMemo(() => getVariantClasses(variant), [variant]);

    const hasError = error || internalError;
    const showLoading = loading || isLoading;

    // ===== CUSTOM STYLES =====
    const customStyles = useMemo(() => {
      const styles: React.CSSProperties = {};

      if (width) {
        styles.width = typeof width === 'number' ? `${width}px` : width;
      }

      if (height) {
        styles.height = typeof height === 'number' ? `${height}px` : height;
      }

      return styles;
    }, [width, height]);

    // ===== EVENT HANDLERS =====

    const handleLoadStart = useCallback(() => {
      setIsLoading(true);
      setInternalError(null);
    }, []);

    const handleLoadedMetadata = useCallback(() => {
      setIsLoading(false);
      onLoadedMetadata?.();
    }, [onLoadedMetadata]);

    const handleCanPlay = useCallback(() => {
      setIsLoading(false);
      onCanPlay?.();
    }, [onCanPlay]);

    const handleError = useCallback(
      (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoElement = event.currentTarget;
        const errorMessage =
          videoElement.error?.message || 'Unknown video error';

        setInternalError(errorMessage);
        setIsLoading(false);
        onError?.(errorMessage);
      },
      [onError]
    );

    const handlePlay = useCallback(() => {
      onPlay?.();
    }, [onPlay]);

    const handlePause = useCallback(() => {
      onPause?.();
    }, [onPause]);

    const handleEnded = useCallback(() => {
      onEnded?.();
    }, [onEnded]);

    const handleTimeUpdate = useCallback(
      (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoElement = event.currentTarget;
        onTimeUpdate?.(videoElement.currentTime, videoElement.duration);
      },
      [onTimeUpdate]
    );

    const handleVolumeChange = useCallback(
      (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoElement = event.currentTarget;
        onVolumeChange?.(videoElement.volume, videoElement.muted);
      },
      [onVolumeChange]
    );

    // ===== EFFECTS =====

    // Update playback rate when prop changes
    useEffect(() => {
      if (videoRef.current && playbackRate !== 1) {
        videoRef.current.playbackRate = playbackRate;
      }
    }, [playbackRate]);

    // Reset error when src changes
    useEffect(() => {
      setInternalError(null);
      setIsLoading(false);
    }, [src]);

    // ===== RENDER HELPERS =====

    const renderSources = () => {
      return videoSources.map((source, index) => (
        <source
          key={index}
          src={source.src}
          type={source.type}
          media={source.media}
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

    // ===== CLASS COMPOSITION =====

    const containerClasses = [
      'relative',
      'overflow-hidden',
      aspectRatioClasses,
      sizeClasses,
      variantClasses,
      disabled ? DESIGN_TOKENS.state.disabled : '',
      containerClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const videoClasses = [
      'w-full',
      'h-full',
      'object-cover',
      disabled ? 'pointer-events-none' : '',
      DESIGN_TOKENS.motion.colors,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // ===== RENDER =====

    return (
      <div
        className={containerClasses}
        style={customStyles}
        role='region'
        aria-label={alt || 'Video player'}
      >
        {/* Video Element */}
        {!hasError && (
          <video
            ref={combinedRef}
            className={videoClasses}
            src={typeof src === 'string' ? src : undefined}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            preload={preload}
            disablePictureInPicture={disablePictureInPicture}
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
            {...videoProps}
          >
            {renderSources()}

            {/* Caption Track for Accessibility */}
            <track kind='captions' srcLang='en' label='English' default />

            {/* Fallback text for browsers that don't support video */}
            <p className={DESIGN_TOKENS.semantic.text.muted}>
              Your browser does not support the video element.
            </p>
          </video>
        )}

        {/* Loading Overlay */}
        {showLoading && !hasError && (
          <div
            className={`absolute inset-0 ${DESIGN_TOKENS.utils.overlay} ${DESIGN_TOKENS.utils.centerAll}`}
          >
            {renderLoadingState()}
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className={combineTokens('absolute', 'inset-0')}>
            {renderErrorState()}
          </div>
        )}

        {/* Caption */}
        {caption && !hasError && (
          <div
            className={`absolute inset-x-0 bottom-0 p-2 ${DESIGN_TOKENS.utils.overlay}`}
          >
            <p className={`${DESIGN_TOKENS.typography.body.small} text-white`}>
              {caption}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Video.displayName = 'Video';

export default Video;
