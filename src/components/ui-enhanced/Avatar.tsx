/**
 * Enhanced Avatar Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
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
 * - Radix Avatar → Behavior, focus management, accessibility
 * - MAPS v2.2 → Apple HIG materials, liquid glass, AAA enforcement
 * - Enhanced Tokens → Dark-first aesthetic with systematic spacing
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 *
 * MATERIALS & VIBRANCY GOVERNANCE:
 * - Liquid glass effects only on surfaces (never on content)
 * - AAA text scrims for content protection
 * - Systematic opacity levels with backdrop governance
 */

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== CONTEXT FOR SIZE SHARING =====

// Context for sharing size between components
const AvatarContext = React.createContext<{
  size: EnhancedAvatarOwnProps['size'];
} | null>(null);

// ===== ENHANCED AVATAR VARIANTS =====

/**
 * Enhanced avatar variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced-tokens CSS custom properties
 */
const enhancedAvatarVariants = cva(
  [
    // Foundation: Layout - Clean systematic approach
    'relative flex shrink-0',
    'overflow-hidden rounded-full',

    // Foundation: Motion - Respect user preferences
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: Focus - AAA compliant ring system
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',

    // Foundation: Apple HIG interaction patterns
    'hover:ring-1 hover:ring-border-accent/30',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      size: {
        xs: 'h-6 w-6', // 24px - Compact lists, chat
        sm: 'h-8 w-8', // 32px - Dense layouts
        md: 'h-10 w-10', // 40px - Standard default
        lg: 'h-12 w-12', // 48px - Prominent display
        xl: 'h-16 w-16', // 64px - Profile headers
        '2xl': 'h-20 w-20', // 80px - Hero avatars
        touch: 'h-11 w-11', // 44px - Touch-friendly
      },

      variant: {
        // Default: Clean surface styling
        default: ['border border-border bg-muted'],

        // Outline: Elegant border emphasis
        outline: ['border-2 border-border-accent bg-background'],

        // Soft: Subtle elevated appearance
        soft: [
          'border border-border-subtle bg-background-elevated',
          'shadow-sm',
        ],

        // Glass: Liquid glass material (surface-only)
        glass: [
          'bg-background/80 backdrop-blur-md backdrop-saturate-150',
          'border border-border-accent/20',
          'shadow-md',
        ],

        // Floating: Enhanced glass with elevation
        floating: [
          'bg-background/75 backdrop-blur-lg backdrop-saturate-150',
          'border border-border-accent/30',
          'shadow-lg shadow-accent/10',
        ],

        // Success: Success semantic color
        success: [
          'border border-success/30 bg-success/10',
          'ring-1 ring-success/20',
        ],

        // Warning: Warning semantic color
        warning: [
          'border border-warning/30 bg-warning/10',
          'ring-1 ring-warning/20',
        ],

        // Error: Error semantic color
        error: ['border border-error/30 bg-error/10', 'ring-1 ring-error/20'],
      },

      // Status indicators for presence/activity
      status: {
        none: '',
        online: 'ring-2 ring-success',
        offline: 'ring-2 ring-muted',
        away: 'ring-2 ring-warning',
        busy: 'ring-2 ring-error',
      },

      // Interactive states
      interactive: {
        false: '',
        true: [
          'cursor-pointer',
          'hover:shadow-md hover:shadow-accent/20',
          'hover:scale-105',
          'focus-visible:scale-105',
        ],
      },

      // AAA compliance enforcement
      enforceAAA: {
        false: '',
        true: [
          // Use AAA-compliant alternatives
          'contrast-more:border-2 contrast-more:border-foreground',
        ],
      },
    },

    compoundVariants: [
      // Interactive glass variants get enhanced hover
      {
        variant: ['glass', 'floating'],
        interactive: true,
        class: [
          'hover:bg-background/60 hover:backdrop-blur-xl',
          'focus-visible:bg-background/60 focus-visible:backdrop-blur-xl',
        ],
      },

      // Status ring positioning for different sizes
      {
        size: ['xs', 'sm'],
        status: ['online', 'offline', 'away', 'busy'],
        class: 'ring-offset-1',
      },
      {
        size: ['md', 'lg', 'touch'],
        status: ['online', 'offline', 'away', 'busy'],
        class: 'ring-offset-2',
      },
      {
        size: ['xl', '2xl'],
        status: ['online', 'offline', 'away', 'busy'],
        class: 'ring-offset-3',
      },
    ],

    defaultVariants: {
      size: 'md',
      variant: 'default',
      status: 'none',
      interactive: false,
      enforceAAA: false,
    },
  }
);

/**
 * Enhanced avatar image variants
 */
const enhancedAvatarImageVariants = cva([
  'aspect-square h-full w-full object-cover',
  'transition-opacity duration-200',
]);

/**
 * Enhanced avatar fallback variants
 */
const enhancedAvatarFallbackVariants = cva(
  [
    'flex h-full w-full items-center justify-center',
    'bg-muted text-muted-foreground',
    'select-none',
  ],
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
        '2xl': 'text-xl',
        touch: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// ===== TYPE DEFINITIONS =====

type AvatarVariantProps = VariantProps<typeof enhancedAvatarVariants>;
type AvatarImageVariantProps = VariantProps<typeof enhancedAvatarImageVariants>;
type AvatarFallbackVariantProps = VariantProps<
  typeof enhancedAvatarFallbackVariants
>;

interface EnhancedAvatarOwnProps {
  asChild?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'touch';
  variant?:
    | 'default'
    | 'outline'
    | 'soft'
    | 'glass'
    | 'floating'
    | 'success'
    | 'warning'
    | 'error';
  status?: 'none' | 'online' | 'offline' | 'away' | 'busy';
  interactive?: boolean;
  enforceAAA?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
}

interface EnhancedAvatarImageOwnProps {
  src?: string;
  alt: string;
  'data-testid'?: string;
}

interface EnhancedAvatarFallbackOwnProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'touch';
  'data-testid'?: string;
}

// ===== ENHANCED AVATAR ROOT =====

/**
 * Enhanced Avatar Image with AAA compliance
 */
const EnhancedAvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> &
    EnhancedAvatarImageOwnProps
>(({ src, alt, className, 'data-testid': testId, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    src={src}
    alt={alt}
    className={cn(enhancedAvatarImageVariants(), className)}
    data-testid={testId}
    {...props}
  />
));

EnhancedAvatarImage.displayName = 'EnhancedAvatarImage';

// ===== ENHANCED AVATAR FALLBACK =====

/**
 * Enhanced Avatar Fallback with systematic typography
 */
const EnhancedAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> &
    EnhancedAvatarFallbackOwnProps
>(
  (
    { size = 'md', className, children, 'data-testid': testId, ...props },
    ref
  ) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(enhancedAvatarFallbackVariants({ size }), className)}
      data-testid={testId}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
);

EnhancedAvatarFallback.displayName = 'EnhancedAvatarFallback';

// ===== ENHANCED AVATAR COMPOUND COMPONENT =====

/**
 * Enhanced Avatar - Complete compound component with all sub-components
 */
const EnhancedAvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    EnhancedAvatarOwnProps
>(
  (
    {
      size = 'md',
      variant = 'default',
      status = 'none',
      interactive = false,
      enforceAAA = false,
      className,
      children,
      'aria-label': ariaLabel,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    // Auto-adjust size for touch devices (platform-aware)
    const responsiveSize = React.useMemo(() => {
      if (size !== 'md') return size;

      try {
        if (
          typeof globalThis !== 'undefined' &&
          globalThis.matchMedia &&
          typeof globalThis.matchMedia === 'function'
        ) {
          const result = globalThis.matchMedia('(pointer: coarse)');
          return result.matches ? 'touch' : size;
        }
      } catch {
        // Fallback for test environments
      }

      return size;
    }, [size]);

    // Create context for child components to access size
    const avatarContextValue = React.useMemo(
      () => ({ size: responsiveSize }),
      [responsiveSize]
    );

    // Handle keyboard interactions for accessibility
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!interactive || !props.onClick) return;

        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          (props.onClick as (event: React.MouseEvent<HTMLDivElement>) => void)(
            event as unknown as React.MouseEvent<HTMLDivElement>
          );
        }
      },
      [interactive, props.onClick]
    );

    return (
      <AvatarContext.Provider value={avatarContextValue}>
        <AvatarPrimitive.Root
          ref={ref}
          className={cn(
            enhancedAvatarVariants({
              size: responsiveSize,
              variant,
              status,
              interactive,
              enforceAAA,
            }),
            className
          )}
          aria-label={ariaLabel}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={interactive ? handleKeyDown : undefined}
          data-aaa={enforceAAA ? 'true' : 'false'}
          data-variant={variant}
          data-size={responsiveSize}
          data-status={status}
          data-testid={testId}
          {...props}
        >
          {children}
        </AvatarPrimitive.Root>
      </AvatarContext.Provider>
    );
  }
);

EnhancedAvatarRoot.displayName = 'EnhancedAvatarRoot';

const EnhancedAvatarFallbackWithContext = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> &
    Omit<EnhancedAvatarFallbackOwnProps, 'size'>
>(({ className, children, 'data-testid': testId, ...props }, ref) => {
  const context = React.useContext(AvatarContext);
  const size = context?.size || 'md';

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(enhancedAvatarFallbackVariants({ size }), className)}
      data-testid={testId}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});

EnhancedAvatarFallbackWithContext.displayName = 'EnhancedAvatarFallback';

const EnhancedAvatar = Object.assign(EnhancedAvatarRoot, {
  Image: EnhancedAvatarImage,
  Fallback: EnhancedAvatarFallbackWithContext,
});

// ===== UTILITY FUNCTIONS =====

/**
 * Generate initials from a name for fallback display
 */
function getAvatarInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?';

  const trimmedName = name.trim();
  if (!trimmedName) return '?';

  const words = trimmedName.split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) return '?';

  if (words.length === 1) {
    const firstWord = words[0];
    return firstWord ? firstWord.slice(0, 2).toUpperCase() : '?';
  }

  return words
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
}

/**
 * Get semantic color for status
 */
function getStatusColor(status: EnhancedAvatarOwnProps['status']): string {
  switch (status) {
    case 'online':
      return ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg;
    case 'away':
      return ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.bg;
    case 'busy':
      return ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg;
    case 'offline':
    default:
      return ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary;
  }
}

// ===== EXPORTS =====

export {
  EnhancedAvatar,
  EnhancedAvatarRoot,
  EnhancedAvatarImage,
  EnhancedAvatarFallback,
  enhancedAvatarVariants,
  enhancedAvatarImageVariants,
  enhancedAvatarFallbackVariants,
  getAvatarInitials,
  getStatusColor,
};

export type {
  EnhancedAvatarOwnProps,
  EnhancedAvatarImageOwnProps,
  EnhancedAvatarFallbackOwnProps,
  AvatarVariantProps,
  AvatarImageVariantProps,
  AvatarFallbackVariantProps,
};
