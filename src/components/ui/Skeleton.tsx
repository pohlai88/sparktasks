/**
 * Skeleton - P0 Enterprise Primitive
 * 
 * Professional loading skeleton system that replaces spinners across the app.
 * Provides better perceived performance and theme-aware styling.
 * 
 * Contract Requirements:
 * - Theme awareness (light/dark skeleton colors)
 * - Motion respect (prefers-reduced-motion)
 * - Shape variants for different content types
 * - Consistent with design token system
 * - Better UX than spinners for content loading
 */

import { cn } from '../../utils/cn';

interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom width */
  width?: string;
  /** Custom height */
  height?: string;
}

interface SkeletonTextProps {
  /** Number of text lines */
  lines?: number;
  /** Additional CSS classes */
  className?: string;
}

interface SkeletonAvatarProps {
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

interface SkeletonCardProps {
  /** Additional CSS classes */
  className?: string;
}

// Base skeleton with enterprise theming
const skeletonBase = cn(
  'animate-pulse',
  'bg-slate-200/60 dark:bg-slate-700/50',
  'rounded'
);

// Motion-safe animation (respects prefers-reduced-motion)
const skeletonAnimation = cn(
  'motion-safe:animate-pulse',
  'motion-reduce:animate-none motion-reduce:bg-slate-300/80'
);

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonBase, skeletonAnimation, className)}
      style={{ width, height }}
      aria-label="Loading content"
      role="status"
    />
  );
}

// Text skeleton for multiple lines
export function SkeletonText({ lines = 1, className = '' }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-label="Loading text">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            skeletonBase,
            skeletonAnimation,
            'h-4',
            // Vary line lengths for more realistic appearance
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

// Avatar skeleton with size variants
export function SkeletonAvatar({ size = 'md', className = '' }: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        skeletonBase,
        skeletonAnimation,
        sizeClasses[size],
        'rounded-full',
        className
      )}
      role="status"
      aria-label="Loading avatar"
    />
  );
}

// Card skeleton for content blocks
export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3',
        className
      )}
      role="status"
      aria-label="Loading card"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size="sm" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      
      {/* Content */}
      <SkeletonText lines={3} />
      
      {/* Footer */}
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

// Table row skeleton for data tables
export function SkeletonTableRow({ 
  columns = 4, 
  className = '' 
}: { 
  columns?: number; 
  className?: string; 
}) {
  return (
    <tr className={cn('border-b border-slate-200', className)} role="status">
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="px-3 py-2">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Composite skeleton patterns
Skeleton.Text = SkeletonText;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Card = SkeletonCard;
Skeleton.TableRow = SkeletonTableRow;

// Enterprise component contract validation
Skeleton.displayName = 'Skeleton';

// Type exports for enterprise usage
export type { 
  SkeletonProps, 
  SkeletonTextProps, 
  SkeletonAvatarProps, 
  SkeletonCardProps 
};

