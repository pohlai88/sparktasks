/**
 * @fileoverview Image Component - Enterprise-grade responsive image with aspect ratio
 * 
 * A comprehensive image component that provides responsive behavior,
 * aspect ratio management, lazy loading, error handling, and accessibility.
 * Built for modern web applications with performance and UX in mind.
 * 
 * Features:
 * - Multiple aspect ratios (square, video, portrait, landscape, custom)
 * - 5 size variants (xs, sm, md, lg, xl)
 * - 4 visual variants (default, rounded, circular, thumbnail)
 * - Lazy loading with intersection observer
 * - Error state with fallback content
 * - Loading state with skeleton placeholder
 * - Responsive behavior with srcSet support
 * - Progressive image enhancement
 * - Full accessibility (WCAG 2.1 AA)
 * - Object-fit positioning control
 * - Border radius and shadow styling
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
 * Aspect ratio options for the image
 */
export type ImageAspectRatio = 
  | 'square'      // 1:1 aspect ratio
  | 'video'       // 16:9 aspect ratio  
  | 'portrait'    // 3:4 aspect ratio
  | 'landscape'   // 4:3 aspect ratio
  | 'wide'        // 21:9 aspect ratio
  | 'auto';       // Natural image dimensions

/**
 * Size variants for the image
 */
export type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Visual variants for the image
 */
export type ImageVariant = 'default' | 'rounded' | 'circular' | 'thumbnail';

/**
 * Object fit options for image positioning
 */
export type ImageFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

/**
 * Loading strategy options
 */
export type ImageLoading = 'lazy' | 'eager';

/**
 * Image component props
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading' | 'children'> {
  /** Image source URL */
  src: string;
  
  /** Alternative text for accessibility */
  alt: string;
  
  /** Aspect ratio of the image container */
  aspectRatio?: ImageAspectRatio;
  
  /** Size variant */
  size?: ImageSize;
  
  /** Visual variant */
  variant?: ImageVariant;
  
  /** Object fit behavior */
  fit?: ImageFit;
  
  /** Loading strategy */
  loading?: ImageLoading;
  
  /** Responsive image sources */
  srcSet?: string;
  
  /** Image sizes for responsive behavior */
  sizes?: string;
  
  /** Fallback content when image fails to load */
  fallback?: React.ReactNode;
  
  /** Loading placeholder content */
  placeholder?: React.ReactNode;
  
  /** Whether to show loading skeleton by default */
  showSkeleton?: boolean;
  
  /** Callback when image loads successfully */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  
  /** Callback when image fails to load */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  
  /** Whether the image is disabled/inactive */
  disabled?: boolean;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Container props for the wrapper div */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get aspect ratio classes from design tokens
 */
const getAspectRatioClasses = (aspectRatio: ImageAspectRatio): string => {
  const aspectMap = {
    square: 'aspect-square',      // 1:1 aspect ratio
    video: 'aspect-video',        // 16:9 aspect ratio  
    portrait: 'aspect-[3/4]',     // 3:4 portrait
    landscape: 'aspect-[4/3]',    // 4:3 landscape
    wide: 'aspect-[21/9]',        // 21:9 ultra-wide
    auto: '',                     // Natural dimensions
  };
  
  return aspectMap[aspectRatio] || '';
};

/**
 * Get size classes from design tokens
 */
const getSizeClasses = (size: ImageSize): string => {
  const sizeMap = {
    xs: 'w-16 h-16',      // 64px - Small thumbnails
    sm: 'w-24 h-24',      // 96px - Medium thumbnails  
    md: 'w-48 h-48',      // 192px - Default size
    lg: 'w-64 h-64',      // 256px - Large images
    xl: 'w-96 h-96',      // 384px - Hero images
  };
  
  return sizeMap[size];
};

/**
 * Get variant classes from design tokens
 */
const getVariantClasses = (variant: ImageVariant): string => {
  const variantMap = {
    default: DESIGN_TOKENS.theme.light.radius.md,               // rounded-md
    rounded: DESIGN_TOKENS.theme.light.radius.lg,               // rounded-lg
    circular: DESIGN_TOKENS.theme.light.radius.full,            // rounded-full
    thumbnail: `${DESIGN_TOKENS.theme.light.radius.sm} ${DESIGN_TOKENS.theme.light.elevation.card} ${DESIGN_TOKENS.semantic.border.muted} border`, // Bordered thumbnail
  };
  
  return variantMap[variant];
};

/**
 * Get object fit classes
 */
const getFitClasses = (fit: ImageFit): string => {
  const fitMap = {
    cover: 'object-cover',
    contain: 'object-contain', 
    fill: 'object-fill',
    'scale-down': 'object-scale-down',
    none: 'object-none',
  };
  
  return fitMap[fit];
};

// ===== HOOKS =====

/**
 * Hook for image loading state management
 */
const useImageLoading = (
  src: string,
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void,
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Reset states when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);
  
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(event);
  }, [onLoad]);
  
  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setIsLoaded(false);
    setHasError(true);
    onError?.(event);
  }, [onError]);
  
  return {
    isLoading,
    hasError,
    isLoaded,
    handleLoad,
    handleError,
  };
};

/**
 * Hook for lazy loading with intersection observer
 */
const useLazyLoading = (loading: ImageLoading) => {
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (loading === 'eager' || shouldLoad) return;
    
    const img = imgRef.current;
    if (!img) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );
    
    observer.observe(img);
    
    return () => observer.disconnect();
  }, [loading, shouldLoad]);
  
  return {
    shouldLoad,
    imgRef,
  };
};

// ===== MAIN COMPONENT =====

/**
 * Enterprise-grade Image component
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  alt,
  aspectRatio = 'auto',
  size = 'md',
  variant = 'default',
  fit = 'cover',
  loading = 'lazy',
  srcSet,
  sizes,
  fallback,
  placeholder,
  showSkeleton = true,
  onLoad,
  onError,
  disabled = false,
  className = '',
  containerProps = {},
  ...props
}, ref) => {
  // Image loading state
  const { isLoading, hasError, isLoaded, handleLoad, handleError } = useImageLoading(src, onLoad, onError);
  
  // Lazy loading
  const { shouldLoad, imgRef } = useLazyLoading(loading);
  
  // Combine refs
  const combinedRef = useCallback((node: HTMLImageElement | null) => {
    (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, imgRef]);
  
  // Generate container classes
  const containerClasses = useMemo(() => {
    const aspectRatioClass = getAspectRatioClasses(aspectRatio);
    const sizeClass = aspectRatio === 'auto' ? getSizeClasses(size) : '';
    const variantClass = getVariantClasses(variant);
    
    return `
      relative overflow-hidden
      ${aspectRatioClass}
      ${sizeClass}
      ${variantClass}
      ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      ${DESIGN_TOKENS.semantic.background.muted}
      ${containerProps.className || ''}
    `.trim();
  }, [aspectRatio, size, variant, disabled, containerProps.className]);
  
  // Generate image classes
  const imageClasses = useMemo(() => {
    const fitClass = getFitClasses(fit);
    
    return `
      ${aspectRatio === 'auto' ? 'max-w-full h-auto' : 'size-full'}
      ${fitClass}
      ${DESIGN_TOKENS.motion.smooth}
      ${isLoaded ? 'opacity-100' : 'opacity-0'}
      ${disabled ? 'grayscale cursor-not-allowed' : ''}
      ${className}
    `.trim();
  }, [aspectRatio, fit, isLoaded, disabled, className]);
  
  // Default fallback content
  const defaultFallback = (
    <div className={`
      ${DESIGN_TOKENS.layout.flexCenter} size-full
      ${DESIGN_TOKENS.semantic.background.muted}
      ${DESIGN_TOKENS.semantic.text.muted}
      ${DESIGN_TOKENS.typography.body.small}
    `}>
      <div className="text-center">
        <svg 
          className={`${DESIGN_TOKENS.icon.size.lg} mx-auto ${DESIGN_TOKENS.spacing.sm} opacity-50`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <span>Image not available</span>
      </div>
    </div>
  );
  
  // Default loading placeholder
  const defaultPlaceholder = showSkeleton ? (
    <div className={`
      size-full animate-pulse relative overflow-hidden
      ${DESIGN_TOKENS.semantic.background.muted}
    `}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  ) : null;
  
  return (
    <div 
      {...containerProps}
      className={containerClasses}
      data-testid="image-container"
    >
      {/* Loading placeholder */}
      {isLoading && !hasError && (placeholder || defaultPlaceholder)}
      
      {/* Error fallback */}
      {hasError && (
        <div data-testid="image-fallback">
          {fallback || defaultFallback}
        </div>
      )}
      
      {/* Main image */}
      {shouldLoad && !hasError && (
        <img
          ref={combinedRef}
          src={src}
          alt={alt}
          srcSet={srcSet}
          sizes={sizes}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          data-testid="image"
          {...props}
        />
      )}
    </div>
  );
});

Image.displayName = 'Image';

export default Image;
