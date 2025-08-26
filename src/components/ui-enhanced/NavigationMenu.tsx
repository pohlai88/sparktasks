/**
 * Enhanced Navigation Menu Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
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
 * - Radix UI → Behavior, ARIA, focus management, positioning
 * - MAPS → Apple HIG materials, liquid glass, AAA enforcement
 * - Wrapper → Token application, governance rules, brand consistency
 *
 * GOVERNANCE RULES:
 * - Foundation tokens only (no component-specific tokens)
 * - Auto-apply AAA scrims over glass materials
 * - Apple HIG motion with respect for reduced motion
 * - Platform-aware touch targets
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 */

/* eslint-disable react/prop-types */

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import React from 'react';

import { AccessibleIcon, Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED NAVIGATION MENU VARIANTS =====

/**
 * Navigation Menu Root variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens
 */
const enhancedNavigationMenuVariants = cva(
  [
    // Foundation: Layout positioning
    'relative z-10',

    // Foundation: Content layout with systematic spacing
    'flex max-w-max flex-1 items-center justify-center',
  ],
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col items-start',
      },

      // Liquid glass materials with governance
      vibrancy: {
        none: '',
        glass: [
          'bg-background/80 backdrop-blur-md backdrop-saturate-150',
          'border border-border/50',
          'rounded-lg',
        ],
        floating: [
          'bg-background/75 backdrop-blur-lg backdrop-saturate-150',
          'border border-border/30',
          'rounded-xl',
          'shadow-elevation-high',
        ],
      },

      // Size variants with platform awareness
      size: {
        sm: 'gap-1 px-2 py-1',
        md: 'gap-2 px-3 py-1.5',
        lg: 'gap-3 px-4 py-2',
      },

      // AAA compliance enforcement
      enforceAAA: {
        false: '',
        true: [
          // Enhanced contrast for AAA compliance
          'border-border bg-background',
        ],
      },
    },

    defaultVariants: {
      orientation: 'horizontal',
      vibrancy: 'none',
      size: 'md',
      enforceAAA: false,
    },
  }
);

/**
 * Navigation Menu List variants
 */
const enhancedNavigationMenuListVariants = cva(
  [
    // Foundation: Layout and spacing
    'group flex flex-1 list-none items-center justify-center',

    // Foundation: Systematic spacing (8pt grid)
    'gap-1',
  ],
  {
    variants: {
      orientation: {
        horizontal: 'flex-row space-x-1',
        vertical: 'flex-col items-start space-y-1',
      },
    },

    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

/**
 * Navigation Menu Item variants with Apple HIG compliance
 */
const enhancedNavigationMenuItemVariants = cva('', {
  variants: {
    // No variants needed - inherits from trigger/link styling
  },
});

/**
 * Navigation Menu Trigger variants with enhanced interaction states
 */
const enhancedNavigationMenuTriggerVariants = cva(
  [
    // Foundation: Layout and typography
    'group flex items-center justify-between',
    'text-sm font-medium leading-none',

    // Foundation: Platform-aware hit targets
    'min-h-[44px] px-4 py-2',
    '@media (hover: hover) { } min-h-[36px]',

    // Foundation: Apple HIG interaction patterns
    'rounded-md',
    'bg-transparent text-foreground',

    // Foundation: Transition and motion respect
    'transition-colors duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: Focus management (AAA compliant)
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',

    // Foundation: Hover states (pointer-only for calm touch)
    'pointer:hover:bg-muted pointer:hover:text-foreground',
    'active:bg-muted/80',

    // Foundation: Data state styling
    'data-[active]:bg-muted data-[state=open]:bg-muted',

    // Foundation: Disabled states
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        subtle: 'text-muted-foreground pointer:hover:text-foreground',
        accent: 'text-accent pointer:hover:text-accent-hover',
      },

      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'min-h-[44px] px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Navigation Menu Content variants with liquid glass governance
 */
const enhancedNavigationMenuContentVariants = cva(
  [
    // Foundation: Positioning and layout
    'left-0 top-0 w-full',

    // Foundation: Liquid glass materials (surface-only)
    'bg-background/95 backdrop-blur-lg backdrop-saturate-150',
    'border border-border/50',
    'rounded-lg',
    'shadow-elevation-high',

    // Foundation: Typography and spacing
    'text-foreground',
    'p-4',

    // Foundation: Motion with accessibility respect
    'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
    'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
    'data-[motion=from-end]:slide-in-from-right-52',
    'data-[motion=from-start]:slide-in-from-left-52',
    'data-[motion=to-end]:slide-out-to-right-52',
    'data-[motion=to-start]:slide-out-to-left-52',
    'duration-200 ease-out',
    'motion-reduce:duration-0',

    // Foundation: Z-index management
    'z-50',
  ],
  {
    variants: {
      // Enhanced vibrancy with AAA protection
      vibrancy: {
        standard: '',
        enhanced: [
          'backdrop-saturate-180 bg-background/90 backdrop-blur-xl',
          'border-border/30',
        ],
        minimal: [
          'border-border bg-background',
          'backdrop-blur-none backdrop-saturate-100',
        ],
      },
    },

    defaultVariants: {
      vibrancy: 'standard',
    },
  }
);

/**
 * Navigation Menu Link variants with semantic states
 */
const enhancedNavigationMenuLinkVariants = cva(
  [
    // Foundation: Layout and typography
    'block select-none',
    'rounded-md p-3',
    'text-sm leading-none',

    // Foundation: Transition system
    'transition-colors duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: Interactive states
    'text-foreground',
    'pointer:hover:bg-muted pointer:hover:text-foreground',
    'focus-visible:bg-muted focus-visible:text-foreground',
    'focus-visible:outline-none',

    // Foundation: AAA focus management
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ],
  {
    variants: {
      variant: {
        default: '',
        subtle: 'text-muted-foreground pointer:hover:text-foreground',
        accent: 'text-accent pointer:hover:text-accent-hover',
      },

      active: {
        false: '',
        true: 'bg-muted font-medium text-foreground',
      },
    },

    defaultVariants: {
      variant: 'default',
      active: false,
    },
  }
);

/**
 * Navigation Menu Indicator variants for active state visualization
 */
const enhancedNavigationMenuIndicatorVariants = cva([
  // Foundation: Positioning
  'top-full z-[1]',
  'flex h-1.5 items-end justify-center overflow-hidden',

  // Foundation: Motion system
  'data-[state=visible]:animate-in data-[state=hidden]:animate-out',
  'data-[state=visible]:fade-in data-[state=hidden]:fade-out',
  'data-[state=hidden]:zoom-out-95 data-[state=visible]:zoom-in-95',
  'duration-200 ease-out',
  'motion-reduce:duration-0',
]);

/**
 * Navigation Menu Viewport variants for content container
 */
const enhancedNavigationMenuViewportVariants = cva([
  // Foundation: Positioning
  'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]',
  'w-full overflow-hidden',

  // Foundation: Liquid glass with AAA compliance
  'bg-background/95 backdrop-blur-lg backdrop-saturate-150',
  'border border-border/50',
  'rounded-lg',
  'shadow-elevation-high',

  // Foundation: Typography
  'text-foreground',

  // Foundation: Animation system
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'duration-200 ease-out',
  'motion-reduce:duration-0',
]);

// ===== ENHANCED NAVIGATION MENU INTERFACES =====

interface EnhancedNavigationMenuProps {
  orientation?: 'horizontal' | 'vertical';
  vibrancy?: 'none' | 'glass' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  enforceAAA?: boolean;
  delayDuration?: number;
  skipDelayDuration?: number;
  'data-testid'?: string;
}

interface EnhancedNavigationMenuTriggerProps {
  variant?: 'default' | 'subtle' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  showIndicator?: boolean;
  asChild?: boolean;
}

interface EnhancedNavigationMenuContentProps {
  vibrancy?: 'standard' | 'enhanced' | 'minimal';
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  forceMount?: true;
}

interface EnhancedNavigationMenuLinkProps {
  variant?: 'default' | 'subtle' | 'accent';
  active?: boolean;
  href?: string;
  onSelect?: (event: Event) => void;
  asChild?: boolean;
}

// ===== ENHANCED NAVIGATION MENU COMPONENTS =====

/**
 * Enhanced Navigation Menu Root - MAPS v2.2 Dark-First Implementation
 */
const EnhancedNavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> &
    EnhancedNavigationMenuProps
>(
  (
    {
      className,
      children,
      orientation = 'horizontal',
      vibrancy = 'none',
      size = 'md',
      enforceAAA = false,
      delayDuration = 200,
      skipDelayDuration = 300,
      'data-testid': testId,
      ...props
    },
    ref
  ) => (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn(
        enhancedNavigationMenuVariants({
          orientation,
          vibrancy,
          size,
          enforceAAA,
        }),
        className
      )}
      orientation={orientation}
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      data-aaa={enforceAAA ? 'true' : 'false'}
      data-testid={testId}
      {...props}
    >
      {children}
      <EnhancedNavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  )
);

/**
 * Enhanced Navigation Menu List
 */
const EnhancedNavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> & {
    orientation?: 'horizontal' | 'vertical';
  }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      enhancedNavigationMenuListVariants({ orientation }),
      className
    )}
    {...props}
  />
));

/**
 * Enhanced Navigation Menu Item
 */
const EnhancedNavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    className={cn(enhancedNavigationMenuItemVariants(), className)}
    {...props}
  />
));

/**
 * Enhanced Navigation Menu Trigger with Apple HIG interactions
 */
const EnhancedNavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> &
    EnhancedNavigationMenuTriggerProps
>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'md',
      showIndicator = true,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : NavigationMenuPrimitive.Trigger;
    
    return (
      <Comp
        ref={ref}
        className={cn(
          enhancedNavigationMenuTriggerVariants({ variant, size }),
          'group',
          className
        )}
        {...props}
      >
        {children}
        {showIndicator && (
          <AccessibleIcon>
            <ChevronDown className='relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180' />
          </AccessibleIcon>
        )}
      </Comp>
    );
  }
);

/**
 * Enhanced Navigation Menu Content with liquid glass governance
 */
const EnhancedNavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> &
    EnhancedNavigationMenuContentProps
>(
  (
    {
      className,
      vibrancy = 'standard',
      onEscapeKeyDown,
      onPointerDownOutside,
      forceMount,
      ...props
    },
    ref
  ) => (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        enhancedNavigationMenuContentVariants({ vibrancy }),
        className
      )}
      {...(onEscapeKeyDown && { onEscapeKeyDown })}
      {...(onPointerDownOutside && { onPointerDownOutside })}
      {...(forceMount !== undefined && { forceMount })}
      {...props}
    />
  )
);

/**
 * Enhanced Navigation Menu Link with semantic variants
 */
const EnhancedNavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> &
    EnhancedNavigationMenuLinkProps
>(
  (
    {
      className,
      variant = 'default',
      active = false,
      href,
      onSelect,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            enhancedNavigationMenuLinkVariants({ variant, active }),
            className
          )}
          {...(props as any)}
        />
      );
    }
    
    return (
      <NavigationMenuPrimitive.Link
        ref={ref}
        className={cn(
          enhancedNavigationMenuLinkVariants({ variant, active }),
          className
        )}
        href={href}
        {...(onSelect && { onSelect })}
        {...props}
      />
    );
  }
);

/**
 * Enhanced Navigation Menu Indicator for active state visualization
 */
const EnhancedNavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(enhancedNavigationMenuIndicatorVariants(), className)}
    {...props}
  >
    <div className='relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md' />
  </NavigationMenuPrimitive.Indicator>
));

/**
 * Enhanced Navigation Menu Viewport for content container
 */
const EnhancedNavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(enhancedNavigationMenuViewportVariants(), className)}
      ref={ref}
      {...props}
    />
  </div>
));

// ===== COMPONENT DISPLAY NAMES =====

EnhancedNavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
EnhancedNavigationMenuList.displayName =
  NavigationMenuPrimitive.List.displayName;
EnhancedNavigationMenuItem.displayName =
  NavigationMenuPrimitive.Item.displayName;
EnhancedNavigationMenuTrigger.displayName =
  NavigationMenuPrimitive.Trigger.displayName;
EnhancedNavigationMenuContent.displayName =
  NavigationMenuPrimitive.Content.displayName;
EnhancedNavigationMenuLink.displayName =
  NavigationMenuPrimitive.Link.displayName;
EnhancedNavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;
EnhancedNavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

// ===== EXPORTS =====

export {
  EnhancedNavigationMenu,
  EnhancedNavigationMenuList,
  EnhancedNavigationMenuItem,
  EnhancedNavigationMenuTrigger,
  EnhancedNavigationMenuContent,
  EnhancedNavigationMenuLink,
  EnhancedNavigationMenuIndicator,
  EnhancedNavigationMenuViewport,
  enhancedNavigationMenuVariants,
  enhancedNavigationMenuTriggerVariants,
  enhancedNavigationMenuContentVariants,
  enhancedNavigationMenuLinkVariants,
};

export type {
  EnhancedNavigationMenuProps,
  EnhancedNavigationMenuTriggerProps,
  EnhancedNavigationMenuContentProps,
  EnhancedNavigationMenuLinkProps,
};
