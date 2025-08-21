/**
 * @fileoverview Thumbnail Component - Enterprise-grade small preview image
 * 
 * A specialized image component optimized for thumbnail displays across   if (interaction === 'interactive') {
    return `
      cursor-pointer
      ${DESIGN_TOKENS.motion.smooth}
      ${DESIGN_TOKENS.state.hover}
      hover:scale-105
      ${DESIGN_TOKENS.state.active}
      ${DESIGN_TOKENS.focus.onLight}
    `.trim();
  }, lists, cards, and preview contexts. Built on the Image component
 * foundation with thumbnail-specific features and optimizations.
 * 
 * Features:
 * - 4 size variants (xs, sm, md, lg) optimized for thumbnails
 * - 4 visual variants (default, rounded, circular, bordered)
 * - 2 interaction modes (static, interactive with hover effects)
 * - Loading state with skeleton placeholder
 * - Error state with fallback content  
 * - Lazy loading optimization for performance
 * - Progressive enhancement
 * - Full accessibility (WCAG 2.1 AA)
 * - Interactive states (hover, focus, active)
 * - Badge/overlay support for metadata
 * - Click handler for navigation
 * 
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPES & INTERFACES =====

/**
 * Thumbnail size variants - optimized for preview contexts
 */
export type ThumbnailSize =
  | 'xs' // 32px - Micro previews, avatar thumbnails
  | 'sm' // 48px - List item previews
  | 'md' // 64px - Card thumbnails (default)
  | 'lg'; // 96px - Featured thumbnails

/**
 * Thumbnail visual variants
 */
export type ThumbnailVariant =
  | 'default' // Clean rounded corners
  | 'rounded' // More pronounced rounding
  | 'circular' // Perfect circle (avatar style)
  | 'bordered'; // With border and shadow

/**
 * Thumbnail interaction mode
 */
export type ThumbnailMode =
  | 'static' // Non-interactive display only
  | 'interactive'; // Clickable with hover effects

/**
 * Badge position for overlays
 */
export type BadgePosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Thumbnail component props
 */
export interface ThumbnailProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image source URL */
  src: string;

  /** Alternative text for accessibility */
  alt: string;

  /** Thumbnail size variant */
  size?: ThumbnailSize;

  /** Visual variant */
  variant?: ThumbnailVariant;

  /** Interaction mode */
  mode?: ThumbnailMode;

  /** Loading strategy */
  loading?: 'lazy' | 'eager';

  /** Fallback content when image fails to load */
  fallback?: ReactNode;

  /** Badge/overlay content */
  badge?: ReactNode;

  /** Badge position */
  badgePosition?: BadgePosition;

  /** Click handler for interactive mode */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /** Callback when image loads successfully */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  /** Callback when image fails to load */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  /** Whether the thumbnail is disabled */
  disabled?: boolean;

  /** Whether to show loading skeleton */
  showSkeleton?: boolean;

  /** Custom CSS classes */
  className?: string;

  /** ARIA label for accessibility */
  'aria-label'?: string;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get size classes optimized for thumbnail contexts
 */
const getThumbnailSizeClasses = (size: ThumbnailSize): string => {
  const sizeMap = {
    xs: 'w-8 h-8', // 32px - Micro previews
    sm: 'w-12 h-12', // 48px - List items
    md: 'w-16 h-16', // 64px - Default cards
    lg: 'w-24 h-24', // 96px - Featured
  };

  return sizeMap[size];
};

/**
 * Get variant classes using DESIGN_TOKENS
 */
const getThumbnailVariantClasses = (variant: ThumbnailVariant): string => {
  const variantMap = {
    default: DESIGN_TOKENS.theme.light.radius.md,
    rounded: DESIGN_TOKENS.theme.light.radius.lg,
    circular: DESIGN_TOKENS.theme.light.radius.full,
    bordered: `${DESIGN_TOKENS.theme.light.radius.md} ${DESIGN_TOKENS.semantic.border.muted} border ${DESIGN_TOKENS.theme.light.elevation.card}`,
  };

  return variantMap[variant];
};

/**
 * Get interaction classes for different modes
 */
const getThumbnailInteractionClasses = (
  mode: ThumbnailMode,
  disabled: boolean
): string => {
  if (disabled) {
    return `opacity-50 grayscale cursor-not-allowed`;
  }

  if (mode === 'interactive') {
    return `
      cursor-pointer
      ${DESIGN_TOKENS.motion.smooth}
      ${DESIGN_TOKENS.state.hover}
      hover:scale-105
      ${DESIGN_TOKENS.state.active}
      ${DESIGN_TOKENS.focus.onLight}
    `.trim();
  }

  return '';
};

/**
 * Get badge position classes
 */
const getBadgePositionClasses = (position: BadgePosition): string => {
  const positionMap = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1',
    'bottom-left': 'bottom-1 left-1',
    'bottom-right': 'bottom-1 right-1',
  };

  return `absolute ${positionMap[position]} z-10`;
};

// ===== HOOKS =====

/**
 * Hook for thumbnail image loading state
 */
const useThumbnailLoading = (
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void,
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.(event);
    },
    [onLoad]
  );

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(true);
      onError?.(event);
    },
    [onError]
  );

  return {
    isLoading,
    hasError,
    handleLoad,
    handleError,
  };
};

// ===== MAIN COMPONENT =====

/**
 * Enterprise-grade Thumbnail component
 */
export const Thumbnail = forwardRef<HTMLDivElement, ThumbnailProps>(
  (
    {
      src,
      alt,
      size = 'md',
      variant = 'default',
      mode = 'static',
      loading = 'lazy',
      fallback,
      badge,
      badgePosition = 'top-right',
      onClick,
      onLoad,
      onError,
      disabled = false,
      showSkeleton = true,
      className = '',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Image loading state
    const { isLoading, hasError, handleLoad, handleError } =
      useThumbnailLoading(onLoad, onError);

    // Generate container classes
    const containerClasses = useMemo(() => {
      const sizeClass = getThumbnailSizeClasses(size);
      const variantClass = getThumbnailVariantClasses(variant);
      const interactionClass = getThumbnailInteractionClasses(mode, disabled);

      return `
      relative
      ${sizeClass}
      ${variantClass}
      ${interactionClass}
      overflow-hidden
      ${DESIGN_TOKENS.semantic.background.muted}
      flex-shrink-0
      ${className}
    `.trim();
    }, [size, variant, mode, disabled, className]);

    // Generate image classes
    const imageClasses = useMemo(() => {
      return `
      w-full h-full
      object-cover
      ${DESIGN_TOKENS.motion.smooth}
      ${isLoading ? 'opacity-0' : 'opacity-100'}
      ${disabled ? 'grayscale' : ''}
    `.trim();
    }, [isLoading, disabled]);

    // Handle click events
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || mode !== 'interactive') return;
        onClick?.(event);
      },
      [disabled, mode, onClick]
    );

    // Handle keyboard events for accessibility
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || mode !== 'interactive' || !onClick) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          // Simple approach: trigger click on the element
          const target = event.currentTarget;
          target.click();
        }
      },
      [disabled, mode, onClick]
    );

    // Default fallback content
    const defaultFallback = (
      <div
        className={` ${DESIGN_TOKENS.layout.flexCenter} size-full ${DESIGN_TOKENS.semantic.background.muted} ${DESIGN_TOKENS.semantic.text.muted} text-xs`}
      >
        <svg
          className={`${size === 'xs' ? DESIGN_TOKENS.icon.size.xs : size === 'sm' ? DESIGN_TOKENS.icon.size.sm : DESIGN_TOKENS.icon.size.md}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      </div>
    );

    // Loading skeleton
    const loadingSkeleton = showSkeleton ? (
      <div
        className={`relative size-full animate-pulse overflow-hidden ${DESIGN_TOKENS.semantic.background.muted} `}
      >
        <div
          className={combineTokens(
            'absolute',
            'inset-0',
            '-translate-x-full',
            'animate-[shimmer_2s_infinite]',
            'bg-gradient-to-r',
            'from-transparent',
            'via-white/60',
            'to-transparent'
          )}
        />
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={containerClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={mode === 'interactive' ? 'button' : 'img'}
        tabIndex={mode === 'interactive' && !disabled ? 0 : undefined}
        aria-label={ariaLabel || (mode === 'interactive' ? `View ${alt}` : alt)}
        data-testid='thumbnail'
        {...props}
      >
        {/* Loading skeleton */}
        {isLoading && !hasError && loadingSkeleton}

        {/* Error fallback */}
        {hasError && (
          <div data-testid='thumbnail-fallback'>
            {fallback || defaultFallback}
          </div>
        )}

        {/* Main image */}
        {!hasError && (
          <img
            src={src}
            alt={alt}
            className={imageClasses}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            data-testid='thumbnail-image'
          />
        )}

        {/* Badge overlay */}
        {badge && (
          <div
            className={getBadgePositionClasses(badgePosition)}
            data-testid='thumbnail-badge'
          >
            {badge}
          </div>
        )}
      </div>
    );
  }
);

Thumbnail.displayName = 'Thumbnail';

export default Thumbnail;
