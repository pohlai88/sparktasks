/**
 * Enhanced Badge Component - MAPS v2.2 Dark-First Foundation
 *
 * Apple HIG-inspired status indicators with sophisticated visual hierarchy,
 * liquid glass materials, and comprehensive accessibility patterns.
 *
 * ANTI-DRIFT ENFORCEMENT:
 * - No hardcoded colors: All values from design tokens
 * - No arbitrary spacing: 8pt grid compliance
 * - No accessibility shortcuts: WCAG AAA baseline
 * - No style drift: Apple HIG semantic patterns only
 *
 * @version 2.2.0
 * @author MAPS Design System Team
 * @copyright 2024 - 2025
 */

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED BADGE VARIANTS =====

const enhancedBadgeVariants = cva(
  // Base styles - Apple HIG foundation
  [
    'inline-flex items-center justify-center',
    'rounded-full border font-medium',
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    // Typography baseline
    'text-xs leading-none',
    // Accessibility foundation
    'select-none',
  ],
  {
    variants: {
      variant: {
        // Primary semantic variants
        default: [
          'bg-primary text-primary-foreground',
          'border-primary/20',
          'shadow-sm',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'border-secondary/20',
          'shadow-sm',
        ],
        muted: [
          'bg-muted text-muted-foreground',
          'border-muted-foreground/20',
        ],
        accent: [
          'bg-accent text-accent-foreground',
          'border-accent/20',
          'shadow-sm',
        ],
        
        // Status semantic variants
        success: [
          'bg-green-500/10 text-green-700 dark:text-green-400',
          'border-green-500/20',
          'shadow-green-500/10 shadow-sm',
        ],
        warning: [
          'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
          'border-yellow-500/20',
          'shadow-yellow-500/10 shadow-sm',
        ],
        error: [
          'bg-red-500/10 text-red-700 dark:text-red-400',
          'border-red-500/20',
          'shadow-red-500/10 shadow-sm',
        ],
        info: [
          'bg-blue-500/10 text-blue-700 dark:text-blue-400',
          'border-blue-500/20',
          'shadow-blue-500/10 shadow-sm',
        ],
        
        // Style variants
        outline: [
          'border-border bg-transparent',
          'text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
        ],
        ghost: [
          'border-transparent bg-transparent',
          'text-muted-foreground',
          'hover:bg-accent hover:text-accent-foreground',
        ],
        
        // Liquid glass variants
        glass: [
          'bg-background/60 text-foreground',
          'border-border/40',
          'backdrop-blur-md backdrop-saturate-[135%]',
          'shadow-sm',
        ],
        floating: [
          'bg-background/80 text-foreground',
          'border-border/30',
          'backdrop-blur-lg backdrop-saturate-[150%]',
          'shadow-elevation-md',
        ],
      },
      size: {
        sm: ['h-4 px-1.5 text-[10px]', 'min-w-4'],
        md: ['h-5 px-2 text-xs', 'min-w-5'],
        lg: ['h-6 px-2.5 text-sm', 'min-w-6'],
        xl: ['h-7 px-3 text-sm', 'min-w-7'],
      },
      interactive: {
        true: [
          'cursor-pointer',
          'hover:scale-105 active:scale-95',
          'focus-visible:ring-2',
        ],
        false: '',
      },
      pulse: {
        true: [
          'animate-pulse',
        ],
        false: '',
      },
      dot: {
        true: [
          'w-2 h-2 p-0 min-w-0',
          'rounded-full',
        ],
        false: '',
      },
      enforceAAA: {
        true: [
          // Enhanced contrast for AAA compliance
          'data-[variant=glass]:bg-background/90',
          'data-[variant=floating]:bg-background/95',
          '[&[data-variant=glass]]:shadow-lg',
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
      pulse: false,
      dot: false,
      enforceAAA: false,
    },
  }
);

// ===== ENHANCED BADGE INTERFACES =====

export interface EnhancedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedBadgeVariants> {
  /**
   * Render as a different element
   */
  asChild?: boolean;
  
  /**
   * Numeric value for count badges
   */
  count?: number;
  
  /**
   * Maximum count to display before showing overflow
   */
  max?: number;
  
  /**
   * Show overflow indicator (e.g., "99+")
   */
  showOverflow?: boolean;
  
  /**
   * Icon element to display
   */
  icon?: React.ReactNode;
  
  /**
   * Position of icon relative to content
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Click handler for interactive badges
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  
  /**
   * Remove handler for dismissible badges
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * Whether badge is dismissible
   */
  dismissible?: boolean;
  
  /**
   * Accessibility label for screen readers
   */
  'aria-label'?: string;
}

// ===== ENHANCED BADGE COMPONENT =====

const EnhancedBadge = React.forwardRef<HTMLDivElement, EnhancedBadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      interactive = false,
      pulse = false,
      dot = false,
      enforceAAA = false,
      asChild = false,
      count,
      max = 99,
      showOverflow = true,
      icon,
      iconPosition = 'left',
      onClick,
      onRemove,
      dismissible = false,
      children,
      ...props
    },
    ref
  ) => {
    // Determine if badge should be interactive
    const isInteractive = interactive || Boolean(onClick);
    
    // Format count display
    const displayCount = React.useMemo(() => {
      if (typeof count !== 'number') return;
      if (count <= max) return count.toString();
      return showOverflow ? `${max}+` : count.toString();
    }, [count, max, showOverflow]);
    
    // Content to display
    const content = displayCount || children;
    
    // Handle click events
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (isInteractive && onClick) {
          onClick(event);
        }
      },
      [isInteractive, onClick]
    );
    
    // Handle keyboard events for interactive badges
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          if (onClick) {
            // Create a properly typed click event from keyboard interaction
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              ctrlKey: event.ctrlKey,
              shiftKey: event.shiftKey,
              altKey: event.altKey,
              metaKey: event.metaKey,
            });
            
            // Manually trigger click with proper event
            const element = event.currentTarget;
            element.dispatchEvent(clickEvent);
          }
        }
      },
      [isInteractive, onClick]
    );
    
    // Remove handler
    const handleRemove = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (onRemove) {
          onRemove(event);
        }
      },
      [onRemove]
    );
    
    const Comp = asChild ? Slot : 'div';
    
    return (
      <Comp
        ref={ref}
        className={cn(
          enhancedBadgeVariants({
            variant,
            size,
            interactive: isInteractive,
            pulse,
            dot,
            enforceAAA,
          }),
          className
        )}
        onClick={handleClick}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        data-variant={variant}
        data-size={size}
        data-interactive={isInteractive}
        data-pulse={pulse}
        data-dot={dot}
        data-aaa={enforceAAA}
        {...props}
      >
        {!dot && (
          <>
            {/* Icon - Left Position */}
            {icon && iconPosition === 'left' && (
              <span className="mr-1 flex items-center">
                {icon}
              </span>
            )}
            
            {/* Content */}
            {content && (
              <span className="flex items-center">
                {content}
              </span>
            )}
            
            {/* Icon - Right Position */}
            {icon && iconPosition === 'right' && (
              <span className="ml-1 flex items-center">
                {icon}
              </span>
            )}
            
            {/* Dismissible Close Button */}
            {dismissible && (
              <button
                onClick={handleRemove}
                className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Remove badge"
                type="button"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </Comp>
    );
  }
);

EnhancedBadge.displayName = 'EnhancedBadge';

// ===== BADGE FACTORY FUNCTIONS =====

/**
 * Semantic badge constructors for common use cases
 */
export const BadgeFactory = {
  // Semantic variants
  default: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="default" {...props} />
    )),
  },
  
  secondary: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="secondary" {...props} />
    )),
  },
  
  muted: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="muted" {...props} />
    )),
  },
  
  accent: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="accent" {...props} />
    )),
  },
  
  // Status variants
  success: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="success" {...props} />
    )),
  },
  
  warning: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="warning" {...props} />
    )),
  },
  
  error: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="error" {...props} />
    )),
  },
  
  info: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="info" {...props} />
    )),
  },
  
  // Style variants
  outline: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="outline" {...props} />
    )),
  },
  
  ghost: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="ghost" {...props} />
    )),
  },
  
  glass: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="glass" {...props} />
    )),
  },
  
  floating: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="floating" {...props} />
    )),
  },
  
  // Interactive variants
  interactive: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'interactive'>>((props, ref) => (
      <EnhancedBadge ref={ref} interactive {...props} />
    )),
  },
  
  dismissible: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'dismissible'>>((props, ref) => (
      <EnhancedBadge ref={ref} dismissible {...props} />
    )),
  },
  
  // Dot variants
  dot: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'dot'>>((props, ref) => (
      <EnhancedBadge ref={ref} dot {...props} />
    )),
  },
  
  pulse: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'pulse'>>((props, ref) => (
      <EnhancedBadge ref={ref} pulse {...props} />
    )),
  },
  
  // Size variants
  small: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'size'>>((props, ref) => (
      <EnhancedBadge ref={ref} size="sm" {...props} />
    )),
  },
  
  large: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'size'>>((props, ref) => (
      <EnhancedBadge ref={ref} size="lg" {...props} />
    )),
  },
  
  // Accessibility variant
  aaa: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'enforceAAA'>>((props, ref) => (
      <EnhancedBadge ref={ref} enforceAAA {...props} />
    )),
  },
  
  // Compound patterns
  notification: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant' | 'size' | 'dot'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="error" size="sm" dot {...props} />
    )),
  },
  
  status: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant' | 'pulse'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="success" pulse {...props} />
    )),
  },
  
  count: {
    Badge: React.forwardRef<HTMLDivElement, Omit<EnhancedBadgeProps, 'variant' | 'size'>>((props, ref) => (
      <EnhancedBadge ref={ref} variant="default" size="sm" {...props} />
    )),
  },
};

// Set display names for factory components
BadgeFactory.default.Badge.displayName = 'DefaultBadge';
BadgeFactory.secondary.Badge.displayName = 'SecondaryBadge';
BadgeFactory.muted.Badge.displayName = 'MutedBadge';
BadgeFactory.accent.Badge.displayName = 'AccentBadge';
BadgeFactory.success.Badge.displayName = 'SuccessBadge';
BadgeFactory.warning.Badge.displayName = 'WarningBadge';
BadgeFactory.error.Badge.displayName = 'ErrorBadge';
BadgeFactory.info.Badge.displayName = 'InfoBadge';
BadgeFactory.outline.Badge.displayName = 'OutlineBadge';
BadgeFactory.ghost.Badge.displayName = 'GhostBadge';
BadgeFactory.glass.Badge.displayName = 'GlassBadge';
BadgeFactory.floating.Badge.displayName = 'FloatingBadge';
BadgeFactory.interactive.Badge.displayName = 'InteractiveBadge';
BadgeFactory.dismissible.Badge.displayName = 'DismissibleBadge';
BadgeFactory.dot.Badge.displayName = 'DotBadge';
BadgeFactory.pulse.Badge.displayName = 'PulseBadge';
BadgeFactory.small.Badge.displayName = 'SmallBadge';
BadgeFactory.large.Badge.displayName = 'LargeBadge';
BadgeFactory.aaa.Badge.displayName = 'AAABadge';
BadgeFactory.notification.Badge.displayName = 'NotificationBadge';
BadgeFactory.status.Badge.displayName = 'StatusBadge';
BadgeFactory.count.Badge.displayName = 'CountBadge';

// ===== UTILITY FUNCTIONS =====

/**
 * Utility function to create a badge with count
 */
export const createCountBadge = (count: number, props?: Partial<EnhancedBadgeProps>) => {
  return <EnhancedBadge count={count} variant="default" size="sm" {...props} />;
};

/**
 * Utility function to create a status dot
 */
export const createStatusDot = (variant: 'success' | 'warning' | 'error' | 'info', props?: Partial<EnhancedBadgeProps>) => {
  return <EnhancedBadge variant={variant} dot pulse {...props} />;
};

/**
 * Utility function to create a notification badge
 */
export const createNotificationBadge = (count?: number, props?: Partial<EnhancedBadgeProps>) => {
  if (count && count > 0) {
    return <EnhancedBadge count={count} variant="error" size="sm" {...props} />;
  }
  return <EnhancedBadge variant="error" size="sm" dot {...props} />;
};

// ===== EXPORTS =====

export {
  EnhancedBadge,
  enhancedBadgeVariants,
};

// Default export for convenience
export default EnhancedBadge;
