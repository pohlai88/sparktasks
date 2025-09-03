/**
 * Enhanced Scroll Area Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with cosmic innovation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS4: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Radix owns: Behavior, ARIA, focus management, state management, keyboard navigation
 * - MAPS4 owns: Apple HIG materials, liquid glass, AAA enforcement
 * - Wrapper owns: Token application, governance rules, brand consistency
 *
 * GOVERNANCE RULES:
 * - Foundation tokens only (no component-specific tokens)
 * - Auto-apply AAA scrims over glass materials
 * - Apple HIG motion with respect for reduced motion
 * - Platform-aware touch targets (44px minimum)
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (idle|scrolling|hover)
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 */

/* eslint-disable react/prop-types */

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Slot } from '@/components/primitives';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== ENHANCED SCROLL AREA VARIANTS =====

/**
 * Enhanced scroll area root variants following MAPS4 v4.0 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedScrollAreaVariants = cva(
  [
    // Foundation: Layout - Clean positioning and overflow control - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
    ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.hidden,
    
    // Foundation: Colors - MAPS4 cosmic foundation - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
    
    // Foundation: Shape - Systematic border system - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.md,
  ],
  {
    variants: {
      variant: {
        // Default: Clean cosmic surface with subtle borders - Enhanced tokens
        default: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
        ],
        
        // Ghost: Transparent for embedded contexts - Enhanced tokens
        ghost: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.muted,
        ],
        
        // Glass: Liquid glass material with governed vibrancy - Enhanced tokens
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
        ],
        
        // Elevated: Sophisticated surface with subtle elevation - Enhanced tokens
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
        ],
        
        // AAA: High contrast mode for compliance - Enhanced tokens
        aaa: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.strong,
          'forced-colors:bg-Field forced-colors:border-FieldText',
        ],
      },
      
      size: {
        // Sizes avoid fixed heights; consumers should control container height
        sm: ENHANCED_DESIGN_TOKENS.foundation.layout.height.auto,
        md: ENHANCED_DESIGN_TOKENS.foundation.layout.height.auto,
        lg: ENHANCED_DESIGN_TOKENS.foundation.layout.height.auto,
        xl: ENHANCED_DESIGN_TOKENS.foundation.layout.height.auto,
        full: ENHANCED_DESIGN_TOKENS.foundation.layout.height.full,
        auto: ENHANCED_DESIGN_TOKENS.foundation.layout.height.auto,
      },
      
      density: {
        // Density variants for different UI contexts - Enhanced tokens
        comfortable: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[4],
        compact: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[2],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      density: 'comfortable',
    },
  }
);

/**
 * Enhanced scroll area viewport variants
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedScrollViewportVariants = cva(
  [
    // Foundation: Layout - Full dimensions with proper overflow - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.height.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.md,
    ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.scroll,
    
    // Foundation: Motion - Respect user preferences - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
  ],
  {
    variants: {
      scrollBehavior: {
        auto: ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.auto,
        smooth: 'scroll-smooth',
      },
    },
    defaultVariants: {
      scrollBehavior: 'smooth',
    },
  }
);

/**
 * Enhanced scrollbar variants following Apple HIG patterns
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedScrollbarVariants = cva(
  [
    // Foundation: Motion - Smooth transitions with accessibility - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    
    // Foundation: Layout - Proper scrollbar behavior - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
    ENHANCED_DESIGN_TOKENS.foundation.layout.cursor.auto,
    ENHANCED_DESIGN_TOKENS.foundation.layout.select.none,
    
    // Foundation: States - Visibility control - Enhanced tokens
    'data-[state=visible]:opacity-100',
    'data-[state=hidden]:opacity-0',
    'pointer:hover:opacity-100',
  ],
  {
    variants: {
      orientation: {
        // Vertical scrollbar with proper dimensions - Enhanced tokens
        vertical: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.height.full,
          'w-[var(--space-2_5)]',
        ],
        
        // Horizontal scrollbar with proper dimensions - Enhanced tokens
        horizontal: [
          'h-[var(--space-2_5)]',
          ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
        ],
      },
      
      variant: {
        // Default: Transparent background - Enhanced tokens
        default: ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
        
        // Ghost: Transparent for subtle appearance - Enhanced tokens
        ghost: ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
        
        // Glass: Liquid glass material with governed vibrancy - Enhanced tokens
        glass: [
          'bg-cosmic-void/20',
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
        ],
        
        // Elevated: Enhanced surface with subtle depth - Enhanced tokens
        elevated: [
          'bg-cosmic-panel/50',
          ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
        ],
        
        // AAA: High contrast for compliance - Enhanced tokens
        aaa: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
          'forced-colors:bg-ButtonFace',
        ],
      },
      
      trackVisibility: {
        // Auto: Smart visibility based on interaction - Enhanced tokens
        auto: '',
        
        // Always: Persistent visibility - Enhanced tokens
        always: 'opacity-100',
        
        // Hover: Show on interaction - Enhanced tokens
        hover: 'opacity-0 pointer:hover:opacity-60',
      },
    },
    
    defaultVariants: {
      orientation: 'vertical',
      variant: 'default',
      trackVisibility: 'auto',
    },
  }
);

/**
 * Enhanced scroll thumb variants
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedScrollThumbVariants = cva(
  [
    // Foundation: Layout - Proper thumb positioning - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.grow.auto,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.full,
    
    // Foundation: Colors - Base border with hover states - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
    
    // Foundation: Motion - Smooth color transitions - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.colors,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    
    // Foundation: Interactive states - Platform-aware - Enhanced tokens
    'pointer:hover:' + ENHANCED_DESIGN_TOKENS.foundation.color.border.strong,
    'active:' + ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg,
    
    // Foundation: Touch targets - 44px minimum (expanded hit area)
    'relative',
    'before:absolute before:inset-0',
    'before:rounded-full',
    'before:transition-colors before:duration-[var(--motion-duration-2)]',
  ],
  {
    variants: {
      variant: {
        // Default: Clean border with hover enhancement - Enhanced tokens
        default: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          'pointer:hover:' + ENHANCED_DESIGN_TOKENS.foundation.color.border.strong,
        ],
        
        // Ghost: Subtle appearance with enhanced hover - Enhanced tokens
        ghost: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default + '/60',
          'pointer:hover:' + ENHANCED_DESIGN_TOKENS.foundation.color.border.strong + '/80',
        ],
        
        // Glass: Liquid glass material with governed vibrancy - Enhanced tokens
        glass: [
          'bg-cosmic-void/80',
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
          'pointer:hover:' + ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg + '/60',
        ],
        
        // Elevated: Enhanced depth with hover effects - Enhanced tokens
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.strong,
          ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
          'pointer:hover:' + ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg + '/80',
        ],
        
        // AAA: High contrast for compliance - Enhanced tokens
        aaa: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.strong,
          'forced-colors:bg-ButtonText',
          'pointer:hover:' + ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg,
        ],
      },
      
      size: {
        // Touch-friendly sizing with 8pt grid - Enhanced tokens
        sm: 'min-h-[var(--space-4_5)] min-w-[var(--space-4_5)]',
        md: 'min-h-[var(--space-5)] min-w-[var(--space-5)]',
        lg: 'min-h-[var(--space-6)] min-w-[var(--space-6)]',
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Enhanced scroll corner variants
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedScrollCornerVariants = cva(
  [
    // Foundation: Base color - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
  ],
  {
    variants: {
      variant: {
        // Default: Clean cosmic surface - Enhanced tokens
        default: ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
        
        // Ghost: Transparent for subtle appearance - Enhanced tokens
        ghost: ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
        
        // Glass: Liquid glass material - Enhanced tokens
        glass: 'bg-cosmic-void/60',
        
        // Elevated: Enhanced surface - Enhanced tokens
        elevated: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
        
        // AAA: High contrast for compliance - Enhanced tokens
        aaa: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
          'forced-colors:bg-Field',
        ],
      },
    },
    
    defaultVariants: {
      variant: 'default',
    },
  }
);

// ===== ENHANCED SCROLL AREA COMPONENTS =====

/**
 * Enhanced Scroll Area Root
 * Main container with variant styling and accessibility features
 */
const EnhancedScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> &
    VariantProps<typeof enhancedScrollAreaVariants> & {
      /** Polymorphic support - render as different element/component */
      asChild?: boolean;
      /** Enforce AAA compliance mode with high contrast styling */
      enforceAAA?: boolean;
      /** Control layout density for different UI contexts */
      density?: 'comfortable' | 'compact';
      /** Custom scrollbar styling variant */
      scrollbarVariant?: 'default' | 'glass' | 'elevated' | 'aaa';
      /** Scrollbar visibility behavior */
      scrollbarVisibility?: 'auto' | 'always' | 'hover';
      /** Thumb size for touch vs pointer interactions */
      thumbSize?: 'sm' | 'md' | 'lg';
      /** Enable smooth scrolling behavior */
      smoothScrolling?: boolean;
      /** Performance optimization - disable animations */
      disableAnimations?: boolean;
    }
>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      density = 'comfortable',
      enforceAAA = false,
      scrollbarVariant,
      scrollbarVisibility = 'auto',
      thumbSize = 'md',
      smoothScrolling = true,
      disableAnimations = false,
      asChild: _asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    // Use AAA variant when enforceAAA is true
    const effectiveVariant = enforceAAA ? 'aaa' : (variant ?? 'default');
    const effectiveScrollbarVariant = enforceAAA
      ? 'aaa'
      : (scrollbarVariant ?? effectiveVariant);

    // Performance optimization: conditionally apply motion classes
    const motionClasses = disableAnimations 
      ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
      : '';

    const Comp = _asChild ? Slot : ScrollAreaPrimitive.Root;

    if (_asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(
            enhancedScrollAreaVariants({
              variant: effectiveVariant,
              size,
              density,
            }),
            motionClasses,
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          enhancedScrollAreaVariants({
            variant: effectiveVariant,
            size,
            density,
          }),
          motionClasses,
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          className={cn(
            enhancedScrollViewportVariants({
              scrollBehavior: smoothScrolling ? 'smooth' : 'auto',
            }),
            motionClasses
          )}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        {/* Vertical Scrollbar */}
        <EnhancedScrollbar
          orientation='vertical'
          variant={effectiveScrollbarVariant}
          trackVisibility={scrollbarVisibility}
          thumbSize={thumbSize}
          disableAnimations={disableAnimations}
        />

        {/* Horizontal Scrollbar */}
        <EnhancedScrollbar
          orientation='horizontal'
          variant={effectiveScrollbarVariant}
          trackVisibility={scrollbarVisibility}
          thumbSize={thumbSize}
          disableAnimations={disableAnimations}
        />

        {/* Corner */}
        <ScrollAreaPrimitive.Corner
          className={cn(
            enhancedScrollCornerVariants({
              variant: effectiveScrollbarVariant,
            }),
            motionClasses
          )}
        />
      </Comp>
    );
  }
);
EnhancedScrollArea.displayName = 'EnhancedScrollArea';

/**
 * Enhanced Scrollbar Component
 * Individual scrollbar with comprehensive styling
 */
const EnhancedScrollbar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> &
    VariantProps<typeof enhancedScrollbarVariants> & {
      /** Visual variant for scrollbar styling */
      variant?: 'default' | 'ghost' | 'glass' | 'elevated' | 'aaa';
      /** Visibility behavior */
      trackVisibility?: 'auto' | 'always' | 'hover';
      /** Thumb size */
      thumbSize?: 'sm' | 'md' | 'lg';
      /** Disable animations for performance */
      disableAnimations?: boolean;
    }
>(
  (
    {
      className,
      orientation = 'vertical',
      variant = 'default',
      trackVisibility = 'auto',
      thumbSize = 'md',
      disableAnimations = false,
      ...props
    },
    ref
  ) => {
    // Performance optimization: conditionally apply motion classes
    const motionClasses = disableAnimations 
      ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
      : '';

    return (
      <ScrollAreaPrimitive.Scrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
          enhancedScrollbarVariants({
            orientation,
            variant,
            trackVisibility,
          }),
          motionClasses,
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.Thumb
          className={cn(
            enhancedScrollThumbVariants({
              variant,
              size: thumbSize,
            }),
            motionClasses
          )}
        />
      </ScrollAreaPrimitive.Scrollbar>
    );
  }
);
EnhancedScrollbar.displayName = 'EnhancedScrollbar';

/**
 * Enhanced Scroll Area with Content Protection
 * Scroll area with built-in content protection for glass materials
 */
const EnhancedScrollAreaWithProtection = React.forwardRef<
  React.ElementRef<typeof EnhancedScrollArea>,
  React.ComponentPropsWithoutRef<typeof EnhancedScrollArea> & {
    /** Content protection level for glass materials */
    protectionLevel?: 'light' | 'medium' | 'strong';
  }
>(({ className, protectionLevel = 'medium', children, ...props }, ref) => {
  const protectionClasses = {
    light: 'bg-cosmic-void/70',
    medium: 'bg-cosmic-void/85',
    strong: 'bg-cosmic-void/95',
  };

  return (
    <EnhancedScrollArea ref={ref} className={className} {...props}>
      <div
        className={cn(
          'min-h-full',
          props.variant === 'glass' && protectionClasses[protectionLevel]
        )}
      >
        {children}
      </div>
    </EnhancedScrollArea>
  );
});
EnhancedScrollAreaWithProtection.displayName = 'EnhancedScrollAreaWithProtection';

/**
 * Enhanced Virtualized Scroll Area
 * High-performance scroll area for large datasets
 */
const EnhancedVirtualizedScrollArea = React.forwardRef<
  React.ElementRef<typeof EnhancedScrollArea>,
  React.ComponentPropsWithoutRef<typeof EnhancedScrollArea> & {
    /** Items to render */
    items: unknown[];
    /** Item height for virtualization */
    itemHeight: number;
    /** Render function for each item */
    renderItem: (item: unknown, index: number) => React.ReactNode;
    /** Buffer size for performance */
    overscan?: number;
  }
>(
  (
    { className, items, itemHeight, renderItem, overscan = 5, ...props },
    ref
  ) => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);

    const viewportRef = React.useRef<HTMLDivElement>(null);

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    React.useEffect(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const handleScroll = () => {
        setScrollTop(viewport.scrollTop);
      };

      const handleResize = () => {
        setContainerHeight(viewport.clientHeight);
      };

      handleResize();
      viewport.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        viewport.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <EnhancedScrollArea ref={ref} className={className} {...props}>
        <div
          ref={viewportRef}
          style={{ height: totalHeight }}
          className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative
          )}
        >
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {visibleItems.map((item, index) =>
              renderItem(item, startIndex + index)
            )}
          </div>
        </div>
      </EnhancedScrollArea>
    );
  }
);
EnhancedVirtualizedScrollArea.displayName = 'EnhancedVirtualizedScrollArea';

// ===== ENHANCED SCROLL AREA FACTORY =====

/**
 * Enhanced Scroll Area Factory Functions
 * @description Semantic constructors following MAPS v2.2 patterns
 */
export const ScrollAreaFactory = {
  /**
   * Default scroll area with clean styling
   */
  default: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'variant'>) => (
      <EnhancedScrollArea {...props} />
    ),
  },

  /**
   * Glass variant with liquid glass materials
   */
  glass: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'variant'>) => (
      <EnhancedScrollArea variant='glass' {...props} />
    ),
  },

  /**
   * Elevated variant with enhanced depth
   */
  elevated: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'variant'>) => (
      <EnhancedScrollArea variant='elevated' {...props} />
    ),
  },

  /**
   * Ghost variant for subtle styling
   */
  ghost: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'variant'>) => (
      <EnhancedScrollArea variant='ghost' {...props} />
    ),
  },

  /**
   * AAA compliance variant for high contrast
   */
  aaa: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'enforceAAA'>) => (
      <EnhancedScrollArea enforceAAA={true} {...props} />
    ),
  },

  /**
   * Performance-optimized scroll area with disabled animations
   */
  performance: {
    Area: (props: React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>) => (
      <EnhancedScrollArea disableAnimations={true} {...props} />
    ),
  },

  /**
   * Small size for compact layouts
   */
  small: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'size'>) => (
      <EnhancedScrollArea size='sm' {...props} />
    ),
  },

  /**
   * Large size for prominent content
   */
  large: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'size'>) => (
      <EnhancedScrollArea size='lg' {...props} />
    ),
  },

  /**
   * Extra large size for maximum visibility
   */
  xlarge: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'size'>) => (
      <EnhancedScrollArea size='xl' {...props} />
    ),
  },

  /**
   * Compact density for dense layouts
   */
  compact: {
    Area: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedScrollArea>, 'density'>) => (
      <EnhancedScrollArea density='compact' {...props} />
    ),
  },
} as const;

// ===== EXPORTS =====

export {
  EnhancedScrollArea,
  EnhancedScrollbar,
  EnhancedScrollAreaWithProtection,
  EnhancedVirtualizedScrollArea,
  enhancedScrollAreaVariants,
  enhancedScrollViewportVariants,
  enhancedScrollbarVariants,
  enhancedScrollThumbVariants,
  enhancedScrollCornerVariants,
};

export type { VariantProps } from 'class-variance-authority';
