import * as React from 'react';
import { DESIGN_TOKENS, ComponentSize } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton variant for different content types
   * @default 'text'
   */
  variant?: 'text' | 'avatar' | 'button' | 'card' | 'image' | 'circle' | 'rectangular';
  
  /**
   * Size of the skeleton element
   * @default 'md'
   */
  size?: ComponentSize;
  
  /**
   * Width override (CSS value or number of lines for text)
   * @example '100px', '50%', 3 (for text lines)
   */
  width?: string | number;
  
  /**
   * Height override (CSS value)
   * @example '100px', '2rem'
   */
  height?: string;
  
  /**
   * Number of lines to show for text variant
   * @default 1
   */
  lines?: number;
  
  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: 'slow' | 'normal' | 'fast';
  
  /**
   * Whether to show shimmer effect instead of pulse
   * @default false
   */
  shimmer?: boolean;
  
  /**
   * Whether this is a child skeleton (removes role for accessibility)
   * @default false
   */
  isChild?: boolean;
  
  /**
   * Whether to respect user's motion preferences
   * @default true
   */
  respectMotion?: boolean;
}

// ===== SKELETON VARIANTS =====

const skeletonVariants = {
  text: 'h-4 w-full rounded',
  avatar: 'rounded-full',
  button: 'h-9 w-20 rounded-md',
  card: 'h-48 w-full rounded-lg',
  image: 'aspect-video w-full rounded-md',
  circle: 'rounded-full',
  rectangular: 'rounded-md',
} as const;

// ===== SKELETON SIZES =====

const skeletonSizes = {
  text: {
    xs: 'h-3',
    sm: 'h-3.5',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  },
  avatar: {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  },
  button: {
    xs: 'h-7 w-16',
    sm: 'h-8 w-18',
    md: 'h-9 w-20',
    lg: 'h-10 w-24',
    xl: 'h-12 w-28',
  },
  card: {
    xs: 'h-32',
    sm: 'h-40',
    md: 'h-48',
    lg: 'h-56',
    xl: 'h-64',
  },
  circle: {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  },
  rectangular: {
    xs: 'h-16 w-24',
    sm: 'h-20 w-32',
    md: 'h-24 w-40',
    lg: 'h-32 w-48',
    xl: 'h-40 w-56',
  },
} as const;

// ===== ANIMATION SPEEDS =====

const animationSpeeds = {
  slow: '[animation-duration:2s]',
  normal: '[animation-duration:1.5s]',
  fast: '[animation-duration:1s]',
} as const;

// ===== COMPONENT IMPLEMENTATION =====

/**
 * Skeleton - Content placeholder for loading states
 * 
 * Enterprise-grade skeleton component providing visual feedback during loading.
 * Supports multiple variants, sizes, and animation styles with full accessibility compliance.
 * 
 * @example
 * ```tsx
 * // Basic text skeleton
 * <Skeleton />
 * 
 * // Avatar skeleton
 * <Skeleton variant="avatar" size="lg" />
 * 
 * // Multiple text lines
 * <Skeleton variant="text" lines={3} />
 * 
 * // Card skeleton with shimmer
 * <Skeleton variant="card" shimmer />
 * 
 * // Custom dimensions
 * <Skeleton width="200px" height="100px" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      size = 'md',
      width,
      height,
      lines = 1,
      speed = 'normal',
      shimmer = false,
      isChild = false,
      respectMotion = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Base skeleton classes
    const baseClasses = [
      'bg-slate-200/60 dark:bg-slate-700/50',
      respectMotion ? DESIGN_TOKENS.motion.respectReduced : '',
    ].filter(Boolean).join(' ');

    // Animation classes - using enhanced pulse for shimmer effect
    const animationClasses = shimmer
      ? `animate-pulse ${animationSpeeds[speed]} bg-gradient-to-r from-slate-200/40 via-slate-300/60 to-slate-200/40 dark:from-slate-700/40 dark:via-slate-600/60 dark:to-slate-700/40`
      : `animate-pulse ${animationSpeeds[speed]}`;

    // Variant classes
    const variantClasses = skeletonVariants[variant];

    // Size classes based on variant
    const sizeClasses = variant in skeletonSizes 
      ? skeletonSizes[variant as keyof typeof skeletonSizes][size]
      : '';

    // Build style object
    const combinedStyle: React.CSSProperties = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}ch` : width }),
      ...(height && { height }),
    };

    // Accessibility props - only root skeletons get status role
    const accessibilityProps = isChild 
      ? {} 
      : {
          'aria-busy': 'true' as const,
          'aria-label': 'Loading content',
          'role': 'status' as const,
        };

    // For text variant with multiple lines
    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          className={className}
          style={combinedStyle}
          {...accessibilityProps}
          {...props}
        >
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              className={[
                baseClasses,
                animationClasses,
                variantClasses,
                sizeClasses,
                index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full', // Last line is shorter
                index > 0 ? 'mt-2' : '',
              ].filter(Boolean).join(' ')}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            />
          ))}
        </div>
      );
    }

    // Single skeleton element
    return (
      <div
        ref={ref}
        className={[
          baseClasses,
          animationClasses,
          variantClasses,
          sizeClasses,
          className,
        ].filter(Boolean).join(' ')}
        style={combinedStyle}
        {...accessibilityProps}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// ===== COMPOUND COMPONENTS =====

/**
 * SkeletonText - Text content placeholder
 * Optimized for text content with support for multiple lines
 */
const SkeletonText = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  ({ lines = 1, ...props }, ref) => (
    <Skeleton ref={ref} variant="text" lines={lines} {...props} />
  )
);

SkeletonText.displayName = 'SkeletonText';

/**
 * SkeletonAvatar - User avatar placeholder
 * Circular skeleton optimized for profile images
 */
const SkeletonAvatar = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => (
    <Skeleton ref={ref} variant="avatar" {...props} />
  )
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

/**
 * SkeletonButton - Button placeholder
 * Rectangular skeleton matching button dimensions
 */
const SkeletonButton = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => (
    <Skeleton ref={ref} variant="button" {...props} />
  )
);

SkeletonButton.displayName = 'SkeletonButton';

/**
 * SkeletonCard - Card/panel placeholder
 * Large rectangular skeleton for content cards
 */
const SkeletonCard = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => (
    <Skeleton ref={ref} variant="card" {...props} />
  )
);

SkeletonCard.displayName = 'SkeletonCard';

/**
 * SkeletonImage - Image placeholder
 * Aspect-ratio aware skeleton for images
 */
const SkeletonImage = React.forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => (
    <Skeleton ref={ref} variant="image" {...props} />
  )
);

SkeletonImage.displayName = 'SkeletonImage';

// ===== LAYOUT HELPERS =====

/**
 * SkeletonGroup - Container for multiple related skeletons
 * Provides consistent spacing and alignment
 */
export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Direction of skeleton layout
   * @default 'vertical'
   */
  direction?: 'horizontal' | 'vertical';
  
  /**
   * Spacing between skeleton elements
   * @default 'md'
   */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  children: React.ReactNode;
}

const SkeletonGroup = React.forwardRef<HTMLDivElement, SkeletonGroupProps>(
  ({ direction = 'vertical', spacing = 'md', className, children, ...props }, ref) => {
    const spacingClasses = {
      xs: direction === 'vertical' ? 'space-y-1' : 'space-x-1',
      sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
      md: direction === 'vertical' ? 'space-y-3' : 'space-x-3',
      lg: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
      xl: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
    };

    const directionClasses = direction === 'horizontal' ? 'flex items-center' : 'flex flex-col';

    return (
      <div
        ref={ref}
        className={[
          directionClasses,
          spacingClasses[spacing],
          className,
        ].filter(Boolean).join(' ')}
        aria-busy="true"
        aria-label="Loading content"
        role="status"
        {...props}
      >
        {children}
      </div>
    );
  }
);

SkeletonGroup.displayName = 'SkeletonGroup';

// ===== COMPLEX SKELETONS =====

/**
 * SkeletonProfile - Complete user profile placeholder
 * Combines avatar, name, and bio skeletons
 */
export interface SkeletonProfileProps extends Omit<SkeletonGroupProps, 'children'> {
  /**
   * Avatar size
   * @default 'md'
   */
  avatarSize?: ComponentSize;
  
  /**
   * Whether to show bio lines
   * @default true
   */
  showBio?: boolean;
  
  /**
   * Number of bio lines
   * @default 2
   */
  bioLines?: number;
  
  /**
   * Whether this is a child skeleton (removes role for accessibility)
   * @default false
   */
  isChild?: boolean;
}

const SkeletonProfile = React.forwardRef<HTMLDivElement, SkeletonProfileProps>(
  ({ 
    avatarSize = 'md', 
    showBio = true, 
    bioLines = 2, 
    direction = 'horizontal',
    spacing = 'md',
    isChild = false,
    ...props 
  }, ref) => {
    const groupProps = isChild 
      ? { className: props.className, style: props.style }
      : props;
    
    return (
      <SkeletonGroup ref={ref} direction={direction} spacing={spacing} {...groupProps}>
        <SkeletonAvatar size={avatarSize} isChild />
        <div className="flex-1 space-y-2">
          <SkeletonText width="60%" isChild />
          {showBio && <SkeletonText lines={bioLines} size="sm" isChild />}
        </div>
      </SkeletonGroup>
    );
  }
);

SkeletonProfile.displayName = 'SkeletonProfile';

/**
 * SkeletonList - List of items placeholder
 * Generates multiple skeleton items with consistent styling
 */
export interface SkeletonListProps extends Omit<SkeletonGroupProps, 'children'> {
  /**
   * Number of skeleton items
   * @default 3
   */
  count?: number;
  
  /**
   * Type of list items
   * @default 'text'
   */
  itemType?: 'text' | 'profile' | 'card';
  
  /**
   * Size of skeleton items
   * @default 'md'
   */
  itemSize?: ComponentSize;
  
  /**
   * Whether this is a child skeleton (removes role for accessibility)
   * @default false
   */
  isChild?: boolean;
}

const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonListProps>(
  ({ 
    count = 3, 
    itemType = 'text', 
    itemSize = 'md',
    direction = 'vertical',
    spacing = 'md',
    isChild = false,
    ...props 
  }, ref) => {
    const renderItem = (index: number) => {
      switch (itemType) {
        case 'profile':
          return <SkeletonProfile key={index} avatarSize={itemSize} isChild />;
        case 'card':
          return <SkeletonCard key={index} size={itemSize} isChild />;
        default:
          return <SkeletonText key={index} size={itemSize} isChild />;
      }
    };

    const groupProps = isChild 
      ? { className: props.className, style: props.style }
      : props;

    return (
      <SkeletonGroup ref={ref} direction={direction} spacing={spacing} {...groupProps}>
        {Array.from({ length: count }, (_, index) => renderItem(index))}
      </SkeletonGroup>
    );
  }
);

SkeletonList.displayName = 'SkeletonList';

// ===== EXPORTS =====

export { 
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
  SkeletonGroup,
  SkeletonProfile,
  SkeletonList,
};
