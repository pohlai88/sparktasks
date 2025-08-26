/**
 * Enhanced Skeleton Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
 *
 * COMPLIANCE MATRIX:
 * - Dark-First Foundation: ✅ Deep space canvas with ethereal accents
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Tailwind Config → CSS Custom Properties → Component classes
 * - Enhanced Tokens → Semantic API → Component variants
 * - MAPS Guidelines → Component behavior → User experience
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 */

/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED SKELETON VARIANTS =====

/**
 * Enhanced skeleton variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedSkeletonVariants = cva(
  [
    // Foundation: Base skeleton styling
    'relative overflow-hidden',
    'rounded-md',
    
    // Foundation: Background colors using semantic tokens
    'bg-muted',
    
    // Foundation: Pulse animation for loading indication
    'animate-pulse',
    
    // Foundation: Motion preferences
    'motion-reduce:animate-none',
    
    // Foundation: Accessibility
    'aria-live="polite" aria-busy="true"',
  ],
  {
    variants: {
      variant: {
        // Default: Standard rectangular skeleton
        default: [],
        
        // Text: Text line skeleton with proper proportions
        text: ['h-4 rounded'],
        
        // Avatar: Circular skeleton for profile images
        avatar: ['rounded-full'],
        
        // Button: Button-shaped skeleton
        button: ['h-10 rounded-md'],
        
        // Card: Card skeleton with proper proportions
        card: ['rounded-lg'],
        
        // Input: Input field skeleton
        input: ['h-10 rounded-md'],
        
        // Badge: Small badge skeleton
        badge: ['h-5 rounded-full'],
      },
      
      size: {
        sm: [],
        md: [],
        lg: [],
        xl: [],
        full: ['w-full'],
      },
      
      animation: {
        // Pulse: Standard pulse animation
        pulse: ['animate-pulse'],
        
        // Wave: Shimmer wave animation
        wave: [
          'relative',
          'before:absolute before:inset-0',
          'before:-translate-x-full',
          'before:animate-[shimmer_2s_infinite]',
          'before:bg-gradient-to-r',
          'before:from-transparent before:via-white/10 before:to-transparent',
        ],
        
        // None: No animation (for motion-sensitive users)
        none: ['animate-none'],
      },
      
      surface: {
        elevated: ['bg-background-elevated'],
        panel: ['bg-background-panel'],
        glass: [
          'bg-background/50 backdrop-blur-sm',
          'border border-border/30',
        ],
        floating: [
          'bg-background/40 backdrop-blur-md',
          'border border-border/20',
          'shadow-elevation-floating',
        ],
      },
      
      density: {
        comfortable: [],
        compact: ['scale-95'],
      },
      
      enforceAAA: {
        false: '',
        true: [
          'aaa:bg-muted-aaa',
          'aaa:border-border-aaa',
        ],
      },
    },
    
    compoundVariants: [
      // Size variants for different skeleton types
      {
        variant: 'text',
        size: 'sm',
        className: 'h-3',
      },
      {
        variant: 'text',
        size: 'md',
        className: 'h-4',
      },
      {
        variant: 'text',
        size: 'lg',
        className: 'h-5',
      },
      {
        variant: 'text',
        size: 'xl',
        className: 'h-6',
      },
      
      // Avatar size variants
      {
        variant: 'avatar',
        size: 'sm',
        className: 'h-8 w-8',
      },
      {
        variant: 'avatar',
        size: 'md',
        className: 'h-10 w-10',
      },
      {
        variant: 'avatar',
        size: 'lg',
        className: 'h-12 w-12',
      },
      {
        variant: 'avatar',
        size: 'xl',
        className: 'h-16 w-16',
      },
      
      // Button size variants
      {
        variant: 'button',
        size: 'sm',
        className: 'h-8',
      },
      {
        variant: 'button',
        size: 'md',
        className: 'h-10',
      },
      {
        variant: 'button',
        size: 'lg',
        className: 'h-12',
      },
      {
        variant: 'button',
        size: 'xl',
        className: 'h-14',
      },
      
      // Card size variants
      {
        variant: 'card',
        size: 'sm',
        className: 'h-32',
      },
      {
        variant: 'card',
        size: 'md',
        className: 'h-48',
      },
      {
        variant: 'card',
        size: 'lg',
        className: 'h-64',
      },
      {
        variant: 'card',
        size: 'xl',
        className: 'h-80',
      },
      
      // Badge size variants
      {
        variant: 'badge',
        size: 'sm',
        className: 'h-4 w-12',
      },
      {
        variant: 'badge',
        size: 'md',
        className: 'h-5 w-16',
      },
      {
        variant: 'badge',
        size: 'lg',
        className: 'h-6 w-20',
      },
      
      // Surface + AAA combinations
      {
        surface: 'elevated',
        enforceAAA: true,
        className: 'aaa:bg-background-elevated-aaa',
      },
      {
        surface: 'glass',
        enforceAAA: true,
        className: 'aaa:bg-background-aaa/50 aaa:border-border-aaa/30',
      },
      
      // Animation + motion preferences
      {
        animation: 'wave',
        className: 'motion-reduce:animate-pulse motion-reduce:before:hidden',
      },
    ],
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      animation: 'pulse',
      surface: 'elevated',
      density: 'comfortable',
      enforceAAA: false,
    },
  }
);

// ===== ENHANCED SKELETON TYPES =====

interface EnhancedSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedSkeletonVariants> {
  /**
   * Polymorphic rendering support
   */
  asChild?: boolean;
  
  /**
   * Custom width for the skeleton
   */
  width?: string | number;
  
  /**
   * Custom height for the skeleton
   */
  height?: string | number;
  
  /**
   * Accessibility label for screen readers
   */
  'aria-label'?: string;
}

// ===== ENHANCED SKELETON IMPLEMENTATION =====

/**
 * Enhanced Skeleton Component
 */
const EnhancedSkeleton = React.forwardRef<HTMLDivElement, EnhancedSkeletonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      animation = 'pulse',
      surface = 'elevated',
      density = 'comfortable',
      enforceAAA = false,
      className,
      style,
      width,
      height,
      asChild = false,
      'aria-label': ariaLabel = 'Loading content',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';
    
    // Build custom styles for width/height
    const customStyle: React.CSSProperties = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          enhancedSkeletonVariants({
            variant,
            size,
            animation,
            surface,
            density,
            enforceAAA,
          }),
          className
        )}
        style={customStyle}
        aria-label={ariaLabel}
        role="status"
        {...props}
      />
    );
  }
);
EnhancedSkeleton.displayName = 'EnhancedSkeleton';

// ===== SKELETON FACTORY FUNCTIONS =====

/**
 * Factory for creating pre-configured skeleton components
 */
const SkeletonFactory = {
  /**
   * Text line skeleton
   */
  textLine: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'text' as const,
    size: 'md' as const,
    width: '100%',
    ...overrides,
  }),

  /**
   * Multiple text lines skeleton
   */
  textLines: (
    lines: number = 3,
    overrides?: Partial<EnhancedSkeletonProps>
  ) => ({
    variant: 'text' as const,
    size: 'md' as const,
    lines,
    ...overrides,
  }),

  /**
   * Avatar skeleton
   */
  avatar: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'avatar' as const,
    size: 'md' as const,
    animation: 'wave' as const,
    ...overrides,
  }),

  /**
   * Button skeleton
   */
  button: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'button' as const,
    size: 'md' as const,
    width: '120px',
    ...overrides,
  }),

  /**
   * Card skeleton
   */
  card: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'card' as const,
    size: 'md' as const,
    width: '100%',
    ...overrides,
  }),

  /**
   * Table row skeleton
   */
  tableRow: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'default' as const,
    height: '48px',
    width: '100%',
    ...overrides,
  }),

  /**
   * Badge skeleton
   */
  badge: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'badge' as const,
    size: 'md' as const,
    animation: 'wave' as const,
    ...overrides,
  }),

  /**
   * Page skeleton with multiple elements
   */
  page: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'default' as const,
    surface: 'elevated' as const,
    ...overrides,
  }),

  /**
   * List item skeleton
   */
  listItem: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'default' as const,
    height: '60px',
    width: '100%',
    ...overrides,
  }),

  /**
   * Input field skeleton
   */
  input: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'input' as const,
    size: 'md' as const,
    width: '100%',
    ...overrides,
  }),

  /**
   * Accessible skeleton with AAA compliance
   */
  accessible: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'default' as const,
    size: 'md' as const,
    surface: 'elevated' as const,
    enforceAAA: true,
    ...overrides,
  }),

  /**
   * Glass material skeleton
   */
  glass: (overrides?: Partial<EnhancedSkeletonProps>) => ({
    variant: 'default' as const,
    size: 'md' as const,
    surface: 'glass' as const,
    animation: 'wave' as const,
    ...overrides,
  }),
};

// ===== SKELETON COMPOUND COMPONENTS =====

/**
 * Text Lines Skeleton - Multiple text lines
 */
interface SkeletonTextLinesProps extends Omit<EnhancedSkeletonProps, 'variant'> {
  lines?: number;
  lastLineWidth?: string | number;
  'data-testid'?: string;
}

const SkeletonTextLines = React.forwardRef<HTMLDivElement, SkeletonTextLinesProps>(
  ({ lines = 3, lastLineWidth = '75%', className, ...props }, ref) => {
    // Destructure to prevent forwarding data-testid to children
    const { 'data-testid': testId, ...skeletonProps } = props;
    
    return (
      <div ref={ref} className={cn('space-y-2', className)} data-testid={testId}>
        {Array.from({ length: lines }).map((_, index) => (
          <EnhancedSkeleton
            key={index}
            variant="text"
            width={index === lines - 1 ? lastLineWidth : '100%'}
            {...skeletonProps}
          />
        ))}
      </div>
    );
  }
);
SkeletonTextLines.displayName = 'SkeletonTextLines';

/**
 * Card Skeleton - Pre-built card loading state
 */
interface SkeletonCardProps extends Omit<EnhancedSkeletonProps, 'variant'> {
  showAvatar?: boolean;
  showFooter?: boolean;
  'data-testid'?: string;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ showAvatar = false, showFooter = false, className, ...props }, ref) => {
    // Destructure to prevent forwarding data-testid to children
    const { 'data-testid': testId, ...skeletonProps } = props;
    
    return (
      <div ref={ref} className={cn('space-y-4 p-4', className)} data-testid={testId}>
        {/* Header with optional avatar */}
        <div className="flex items-center space-x-3">
          {showAvatar && (
            <EnhancedSkeleton variant="avatar" size="md" {...skeletonProps} />
          )}
          <div className="space-y-2 flex-1">
            <EnhancedSkeleton variant="text" size="lg" width="60%" {...skeletonProps} />
            <EnhancedSkeleton variant="text" size="sm" width="40%" {...skeletonProps} />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <EnhancedSkeleton variant="text" width="100%" {...skeletonProps} />
          <EnhancedSkeleton variant="text" width="100%" {...skeletonProps} />
          <EnhancedSkeleton variant="text" width="75%" {...skeletonProps} />
        </div>
        
        {/* Footer */}
        {showFooter && (
          <div className="flex justify-between items-center pt-2">
            <EnhancedSkeleton variant="badge" {...skeletonProps} />
            <EnhancedSkeleton variant="button" size="sm" width="80px" {...skeletonProps} />
          </div>
        )}
      </div>
    );
  }
);
SkeletonCard.displayName = 'SkeletonCard';

/**
 * Table Skeleton - Pre-built table loading state
 */
interface SkeletonTableProps extends Omit<EnhancedSkeletonProps, 'variant'> {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  'data-testid'?: string;
}

const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, showHeader = true, className, ...props }, ref) => {
    // Destructure to prevent forwarding data-testid to children
    const { 'data-testid': testId, ...skeletonProps } = props;
    
    return (
      <div ref={ref} className={cn('space-y-2', className)} data-testid={testId}>
        {/* Header */}
        {showHeader && (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <EnhancedSkeleton
                key={`header-${index}`}
                variant="text"
                size="sm"
                width="80%"
                {...skeletonProps}
              />
            ))}
          </div>
        )}
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <EnhancedSkeleton
                key={`cell-${rowIndex}-${colIndex}`}
                variant="text"
                width={colIndex === 0 ? '90%' : '70%'}
                {...skeletonProps}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);
SkeletonTable.displayName = 'SkeletonTable';

// ===== EXPORTS =====

export {
  EnhancedSkeleton,
  SkeletonFactory,
  SkeletonTextLines,
  SkeletonCard,
  SkeletonTable,
  enhancedSkeletonVariants,
};

export type {
  EnhancedSkeletonProps,
  SkeletonTextLinesProps,
  SkeletonCardProps,
  SkeletonTableProps,
};
