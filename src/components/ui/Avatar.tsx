import * as React from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'busy' | 'offline' | undefined;

export interface AvatarProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  /** Provide a meaningful alt, or leave undefined for decorative (defaults to '') */
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
  /** Optional fallback initials/text if the image fails */
  fallback?: string;
  /** Optional ref to the inner <img> (container gets the component ref) */
  imgRef?: React.Ref<HTMLImageElement>;
}

// Memoized size mapping for performance
const sizeMap: Record<AvatarSize, string> = {
  xs: DESIGN_TOKENS.sizing.avatar.xs,
  sm: DESIGN_TOKENS.sizing.avatar.sm,
  md: DESIGN_TOKENS.sizing.avatar.md,
  lg: DESIGN_TOKENS.sizing.avatar.lg,
  xl: DESIGN_TOKENS.sizing.avatar.xl,
} as const;

// Memoized status ring mapping
const statusRingMap: Record<NonNullable<AvatarStatus>, string> = {
  online: DESIGN_TOKENS.recipe.avatar?.ringOnline ?? '',
  busy: DESIGN_TOKENS.recipe.avatar?.ringBusy ?? '',
  offline: DESIGN_TOKENS.recipe.avatar?.ringOffline ?? '',
} as const;

// Memoized status color mapping
const statusColorMap: Record<NonNullable<AvatarStatus>, string> = {
  online: DESIGN_TOKENS.recipe.avatar?.online ?? '',
  busy: DESIGN_TOKENS.recipe.avatar?.busy ?? '',
  offline: DESIGN_TOKENS.recipe.avatar?.offline ?? '',
} as const;

// Memoized status labels for accessibility
const statusLabels: Record<NonNullable<AvatarStatus>, string> = {
  online: 'Online',
  busy: 'Busy',
  offline: 'Offline',
} as const;

/**
 * Avatar: Optimized user representation component with status indicators
 * - Memoized computations for performance
 * - Efficient error handling and fallback
 * - WCAG 2.1 AA accessibility compliance
 * - Full SSOT compliance using DESIGN_TOKENS
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt = '',
    size = 'md',
    status,
    className,
    fallback,
    imgRef,
    onError,
    loading = 'lazy',
    decoding = 'async',
    ...imgProps
  }: AvatarProps,
  ref: React.Ref<HTMLSpanElement>
) {
  const [imgError, setImgError] = React.useState(false);
  
  // 1) Reset error when src changes so new URLs attempt to load again
  React.useEffect(() => { 
    setImgError(false); 
  }, [src]);

  // 2) Inner live regions with key prop for stronger status announcements
  const statusAnnouncement = React.useMemo(() => {
    if (!status) return null;
    return (
      <div
        key={`status-${status}`}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {`Avatar status: ${statusLabels[status]}`}
      </div>
    );
  }, [status]);
  
  // Use direct lookups instead of useMemo for better performance
  const sizeClass = sizeMap[size];
  const statusRing = status ? statusRingMap[status] : '';
  const statusColor = status ? statusColorMap[status] : '';
  const statusLabel = status ? statusLabels[status] : '';

  // Optimized error handler with useCallback to prevent re-renders
  const handleImgError = React.useCallback<React.ReactEventHandler<HTMLImageElement>>((e) => {
    setImgError(true);
    onError?.(e);
  }, [onError]);

  // Simplified container classes
  const containerClasses = combineTokens(
    DESIGN_TOKENS.recipe.avatar.base,
    sizeClass,
    DESIGN_TOKENS.recipe.avatar.border,
    DESIGN_TOKENS.recipe.avatar.shadow,
    statusRing,
    statusColor,
    className
  );

  // Fallback render - optimized with early return
  if ((imgError || !src) && fallback) {
    return (
      <>
        {statusAnnouncement}
        <span
          ref={ref}
          className={combineTokens(
            containerClasses,
            DESIGN_TOKENS.recipe.avatar.fallback
          )}
          role="img"
          aria-label={alt || fallback}
          data-size={size}
          data-status={status}
          data-testid="avatar-fallback"
        >
          {fallback}
        </span>
      </>
    );
  }

  // Normal image render - optimized structure
  return (
    <>
      {statusAnnouncement}
      <span
        ref={ref}
        className={containerClasses}
        aria-label={alt || `Avatar${status ? ` (${statusLabel})` : ''}`}
        data-size={size}
        data-status={status}
        data-testid="avatar-container"
      >
        {src && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={combineTokens(
              'object-cover rounded-full',
              'size-full'
            )}
            loading={loading}
            decoding={decoding}
            onError={handleImgError}
            {...imgProps}
          />
        )}
      </span>
    </>
  );
});
