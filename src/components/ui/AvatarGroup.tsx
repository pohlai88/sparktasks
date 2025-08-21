import * as React from 'react';
import { Avatar, AvatarProps } from './Avatar';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<AvatarProps & { key?: React.Key }>;
  /** Max avatars to show before overflow pill */
  max?: number;
  /** Avatar size for the whole group */
  size?: AvatarProps['size'];
  /** Extra classes for the container */
  className?: string;
  /** Overlap avatars (stack) vs spaced row */
  overlap?: boolean;
  /** Optional label for a11y (defaults to "Avatar group") */
  ariaLabel?: string;
  /** Custom overflow pill content (defaults to "+{count}" or "{overflowMax}+" when capped) */
  overflowContent?: (count: number, overflowMax: number) => React.ReactNode;
  /** Max number displayed in overflow pill before showing a "+" suffix */
  overflowMax?: number;
  /** Optional click handler for overflow pill (makes the pill interactive) */
  onOverflowClick?: (
    count: number,
    event: React.MouseEvent | React.KeyboardEvent
  ) => void;
}

// text size mapping for overflow pill
const overflowTextSizeMap: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'text-[10px]',
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
} as const;

// use avatar size tokens for overflow pill diameter
const overflowCircleSizeMap: Record<
  NonNullable<AvatarProps['size']>,
  string
> = {
  xs: DESIGN_TOKENS.sizing.avatar.xs,
  sm: DESIGN_TOKENS.sizing.avatar.sm,
  md: DESIGN_TOKENS.sizing.avatar.md,
  lg: DESIGN_TOKENS.sizing.avatar.lg,
  xl: DESIGN_TOKENS.sizing.avatar.xl,
} as const;

// spacing presets
const spacingClasses = {
  overlap: '-space-x-3',
  spaced: 'space-x-2',
} as const;

/**
 * AvatarGroup: Optimized enterprise-grade avatar collection component
 * - Performance-optimized with memoized computations
 * - Flexible overflow handling with customization
 * - Full WCAG 2.1 AA accessibility compliance
 * - SSOT compliance using DESIGN_TOKENS
 */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      avatars,
      max = 5,
      size = 'md',
      className,
      overlap = true,
      ariaLabel = 'Avatar group',
      overflowContent,
      overflowMax = 99,
      onOverflowClick,
      ...containerProps
    },
    ref
  ) {
    const safeMax = Math.max(0, max);
    const visible = React.useMemo(
      () => avatars.slice(0, safeMax),
      [avatars, safeMax]
    );
    const overflow = Math.max(0, avatars.length - safeMax);

    const spacingClass = overlap
      ? spacingClasses.overlap
      : spacingClasses.spaced;
    const overflowTextSize = overflowTextSizeMap[size ?? 'md'];
    const overflowCircleSize = overflowCircleSizeMap[size ?? 'md'];

    const containerClasses = combineTokens(
      'flex items-center',
      spacingClass,
      className
    );

    // default overflow content: +N (no cap) or `${overflowMax}+` (capped)
    const defaultOverflow = React.useMemo(() => {
      if (overflow <= 0) return null;
      if (overflowContent) return overflowContent(overflow, overflowMax);
      return overflow > overflowMax ? `${overflowMax}+` : `+${overflow}`;
    }, [overflow, overflowMax, overflowContent]);

    const overflowPillClasses = combineTokens(
      'inline-flex items-center justify-center rounded-full font-medium shadow-md',
      DESIGN_TOKENS.transitions.scale, // hover scale & smooth transition
      overflowCircleSize,
      overflowTextSize,
      DESIGN_TOKENS.recipe.avatar.border, // theme-aware outline
      'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
    );

    // Describe counts in the group label
    const fullAriaLabel = React.useMemo(() => {
      const total = avatars.length;
      const shown = visible.length;
      return overflow > 0
        ? `${ariaLabel}, showing ${shown} of ${total} avatars`
        : `${ariaLabel}, ${total} avatars`;
    }, [ariaLabel, avatars.length, visible.length, overflow]);

    const isOverflowInteractive = typeof onOverflowClick === 'function';

    const onOverflowKeyDown = (e: React.KeyboardEvent) => {
      if (!isOverflowInteractive) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOverflowClick?.(overflow, e);
      }
    };

    return (
      <div
        ref={ref}
        className={containerClasses}
        role='group'
        aria-label={fullAriaLabel}
        data-testid='avatar-group'
        data-count={avatars.length}
        data-visible={visible.length}
        data-overflow={overflow}
        data-overlap={overlap ? 'true' : 'false'}
        {...containerProps}
      >
        {visible.map((avatarProps, i) => {
          const { key, ...rest } = avatarProps;
          // last avatar on top for natural stacking
          const z = i + 1;
          return (
            <span
              key={key ?? i}
              style={overlap ? { zIndex: z } : undefined}
              className={overlap ? DESIGN_TOKENS.layout.flex.inline : undefined}
              data-avatar-index={i}
            >
              <Avatar
                {...rest}
                size={size}
                className={combineTokens(
                  rest.className,
                  overlap ? 'ring-2 ring-white dark:ring-slate-900' : ''
                )}
                data-index={i}
              />
            </span>
          );
        })}

        {overflow > 0 && (
          <span
            className={combineTokens(
              overflowPillClasses,
              isOverflowInteractive &&
                combineTokens(
                  'cursor-pointer',
                  DESIGN_TOKENS.focus.onLight,
                  DESIGN_TOKENS.focus.forcedColors
                )
            )}
            title={`${overflow} more avatars`}
            aria-label={`${overflow} more avatars`}
            {...(isOverflowInteractive
              ? {
                  role: 'button' as const,
                  tabIndex: 0,
                  onClick: (e: React.MouseEvent) =>
                    onOverflowClick?.(overflow, e),
                  onKeyDown: onOverflowKeyDown,
                }
              : {})}
            data-testid='avatar-group-overflow'
            data-overflow-count={overflow}
          >
            {defaultOverflow}
          </span>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
