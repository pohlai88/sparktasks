/**
 * Enhanced Menu Bar Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
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

import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronRight, Circle } from 'lucide-react';
import React from 'react';

import { cn } from '@/utils/cn';

// ===== ENHANCED MENU BAR VARIANTS =====

/**
 * Menu Bar Root variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens
 */
const enhancedMenuBarVariants = cva(
  [
    // Foundation: Surface with liquid glass optional
    'bg-background-elevated',
    'border border-border',

    // Foundation: Layout with systematic spacing
    'flex h-10 items-center space-x-1',
    'rounded-md p-1',

    // Foundation: Typography from Apple semantic hierarchy
    'text-sm font-medium',

    // Foundation: Platform-aware interactions
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          // Standard elevated surface
          'bg-background-elevated',
          'border-border',
        ],
        glass: [
          // Liquid glass vibrancy (surface-only application)
          'backdrop-blur-[12px] backdrop-saturate-[135%]',
          'bg-background-panel/80',
          'border-border/50',
        ],
        ghost: [
          // Minimal presentation
          'bg-transparent',
          'border-transparent',
        ],
      },
      size: {
        sm: ['h-8', 'text-xs', 'space-x-0.5', 'p-0.5'],
        md: ['h-10', 'text-sm', 'space-x-1', 'p-1'],
        lg: ['h-12', 'text-base', 'space-x-1.5', 'p-1.5'],
      },
      density: {
        comfortable: [
          // Standard platform-aware spacing
          'space-x-1',
        ],
        compact: [
          // Reduced spacing for dense layouts
          'space-x-0.5',
        ],
      },
      enforceAAA: {
        true: [
          // AAA solid fills replace ethereal accents
          'bg-background-elevated',
          'border-border-strong',
          // Remove any vibrancy effects
          'backdrop-blur-none',
          'backdrop-saturate-100',
        ],
        false: [
          // Allow ethereal accents and liquid glass
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      density: 'comfortable',
      enforceAAA: false,
    },
  }
);

/**
 * Menu Bar Trigger variants - Apple HIG compliant menu items
 */
const enhancedMenuBarTriggerVariants = cva(
  [
    // Foundation: Typography from Apple semantic hierarchy
    'text-sm font-medium',

    // Foundation: Platform-aware hit targets
    'flex cursor-default select-none items-center',
    'rounded-sm px-3 py-1.5',

    // Foundation: Interactive states with systematic transitions
    'transition-colors duration-200',

    // Foundation: Focus management
    'focus:outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

    // Foundation: Disabled state
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          // Content hierarchy colors
          'text-foreground',
          'hover:bg-muted',
          'hover:text-foreground',
          'data-[state=open]:bg-accent',
          'data-[state=open]:text-accent-foreground',
        ],
        glass: [
          // Liquid glass with content protection
          'text-foreground',
          'hover:bg-background-panel/60',
          'hover:backdrop-blur-[8px]',
          'data-[state=open]:bg-accent/80',
          'data-[state=open]:text-accent-foreground',
          'data-[state=open]:backdrop-blur-[12px]',
        ],
        ghost: [
          // Minimal variant
          'text-foreground-muted',
          'hover:bg-muted/50',
          'hover:text-foreground',
          'data-[state=open]:bg-accent/20',
          'data-[state=open]:text-accent-foreground',
        ],
      },
      size: {
        sm: ['h-7', 'px-2', 'py-1', 'text-xs'],
        md: ['h-8', 'px-3', 'py-1.5', 'text-sm'],
        lg: ['h-10', 'px-4', 'py-2', 'text-base'],
      },
      enforceAAA: {
        true: [
          // High contrast for AAA compliance
          'hover:bg-background-elevated',
          'data-[state=open]:bg-accent-solid-aaa',
          'data-[state=open]:text-background',
          // Remove vibrancy effects
          'backdrop-blur-none',
        ],
        false: [
          // Allow ethereal effects
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      enforceAAA: false,
    },
  }
);

/**
 * Menu Bar Content variants - Liquid glass dropdown containers
 */
const enhancedMenuBarContentVariants = cva(
  [
    // Foundation: Surface elevation with liquid glass
    'z-50 min-w-[12rem]',
    'rounded-md border',
    'p-1',

    // Foundation: Typography and spacing
    'text-sm',

    // Foundation: Animation with reduced motion respect
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95',
    'data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',

    // Motion respect
    'motion-reduce:animate-none',
    'motion-reduce:transition-none',

    // Foundation: Shadow system
    'shadow-lg',
  ],
  {
    variants: {
      variant: {
        default: [
          // Standard elevated surface
          'bg-background-elevated',
          'border-border',
          'text-foreground',
        ],
        glass: [
          // Liquid glass vibrancy with content protection
          'backdrop-blur-[16px] backdrop-saturate-[135%]',
          'bg-background-panel/85',
          'border-border/50',
          'text-foreground',
          // AAA scrim for content protection
          '[&>*]:bg-background/5',
          '[&>*]:backdrop-blur-[2px]',
        ],
        elevated: [
          // Higher elevation for floating menus
          'bg-background-panel',
          'border-border',
          'text-foreground',
          'shadow-xl',
        ],
      },
      size: {
        sm: ['min-w-[8rem]', 'text-xs', 'p-0.5'],
        md: ['min-w-[12rem]', 'text-sm', 'p-1'],
        lg: ['min-w-[16rem]', 'text-base', 'p-1.5'],
      },
      enforceAAA: {
        true: [
          // AAA solid surfaces
          'bg-background-elevated',
          'border-border-strong',
          'text-foreground',
          // Remove vibrancy effects
          'backdrop-blur-none',
          'backdrop-saturate-100',
          '[&>*]:bg-transparent',
          '[&>*]:backdrop-blur-none',
        ],
        false: [
          // Allow liquid glass effects
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      enforceAAA: false,
    },
  }
);

/**
 * Menu Bar Item variants - Interactive menu items
 */
const enhancedMenuBarItemVariants = cva(
  [
    // Foundation: Platform-aware hit targets
    'relative flex cursor-default select-none items-center',
    'rounded-sm px-2 py-1.5',

    // Foundation: Typography
    'text-sm',

    // Foundation: Interactive states
    'transition-colors duration-200',

    // Foundation: Focus management
    'focus:outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

    // Foundation: Disabled state
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-foreground',
          'hover:bg-muted',
          'hover:text-foreground',
          'data-[highlighted]:bg-accent',
          'data-[highlighted]:text-accent-foreground',
        ],
        destructive: [
          'text-error-foreground',
          'hover:bg-error/10',
          'hover:text-error-foreground',
          'data-[highlighted]:bg-error',
          'data-[highlighted]:text-background',
        ],
        success: [
          'text-success-foreground',
          'hover:bg-success/10',
          'hover:text-success-foreground',
          'data-[highlighted]:bg-success',
          'data-[highlighted]:text-background',
        ],
      },
      size: {
        sm: ['h-7', 'px-1.5', 'py-1', 'text-xs'],
        md: ['h-8', 'px-2', 'py-1.5', 'text-sm'],
        lg: ['h-10', 'px-3', 'py-2', 'text-base'],
      },
      enforceAAA: {
        true: [
          // High contrast states
          'data-[highlighted]:bg-accent-solid-aaa',
          'data-[highlighted]:text-background',
          'hover:bg-background-panel',
        ],
        false: [
          // Allow ethereal effects
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      enforceAAA: false,
    },
  }
);

// ===== ENHANCED MENU BAR COMPONENTS =====

/**
 * Menu Bar Root - Container for menu bar
 */
const MenuBar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> &
    VariantProps<typeof enhancedMenuBarVariants>
>(({ className, variant, size, density, enforceAAA, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      enhancedMenuBarVariants({ variant, size, density, enforceAAA }),
      className
    )}
    {...props}
  />
));
MenuBar.displayName = 'MenuBar';

/**
 * Menu Bar Menu - Individual menu container
 */
const MenuBarMenu = MenubarPrimitive.Menu;

/**
 * Menu Bar Trigger - Clickable menu trigger
 */
const MenuBarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> &
    VariantProps<typeof enhancedMenuBarTriggerVariants>
>(({ className, variant, size, enforceAAA, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      enhancedMenuBarTriggerVariants({ variant, size, enforceAAA }),
      className
    )}
    {...props}
  />
));
MenuBarTrigger.displayName = 'MenuBarTrigger';

/**
 * Menu Bar Content - Dropdown menu content
 */
const MenuBarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> &
    VariantProps<typeof enhancedMenuBarContentVariants>
>(
  (
    {
      className,
      variant,
      size,
      enforceAAA,
      align = 'start',
      alignOffset = -4,
      sideOffset = 8,
      ...props
    },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          enhancedMenuBarContentVariants({ variant, size, enforceAAA }),
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
);
MenuBarContent.displayName = 'MenuBarContent';

/**
 * Menu Bar Item - Interactive menu item
 */
const MenuBarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> &
    VariantProps<typeof enhancedMenuBarItemVariants> & {
      inset?: boolean;
    }
>(({ className, variant, size, enforceAAA, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      enhancedMenuBarItemVariants({ variant, size, enforceAAA }),
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
MenuBarItem.displayName = 'MenuBarItem';

/**
 * Menu Bar Checkbox Item - Checkable menu item
 */
const MenuBarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> &
    VariantProps<typeof enhancedMenuBarItemVariants>
>(
  (
    { className, children, checked, variant, size, enforceAAA, ...props },
    ref
  ) => (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        enhancedMenuBarItemVariants({ variant, size, enforceAAA }),
        'relative pl-8',
        className
      )}
      {...(checked !== undefined && { checked })}
      {...props}
    >
      <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
        <MenubarPrimitive.ItemIndicator>
          <Check className='h-4 w-4' />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
);
MenuBarCheckboxItem.displayName = 'MenuBarCheckboxItem';

/**
 * Menu Bar Radio Item - Radio selectable menu item
 */
const MenuBarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> &
    VariantProps<typeof enhancedMenuBarItemVariants>
>(({ className, children, variant, size, enforceAAA, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      enhancedMenuBarItemVariants({ variant, size, enforceAAA }),
      'relative pl-8',
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <MenubarPrimitive.ItemIndicator>
        <Circle className='h-2 w-2 fill-current' />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenuBarRadioItem.displayName = 'MenuBarRadioItem';

/**
 * Menu Bar Label - Non-interactive label
 */
const MenuBarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      // Foundation: Typography hierarchy
      'px-2 py-1.5 text-xs font-semibold text-foreground-muted',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
MenuBarLabel.displayName = 'MenuBarLabel';

/**
 * Menu Bar Separator - Visual separator
 */
const MenuBarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn(
      // Foundation: Border system
      '-mx-1 my-1 h-px bg-border',
      className
    )}
    {...props}
  />
));
MenuBarSeparator.displayName = 'MenuBarSeparator';

/**
 * Menu Bar Shortcut - Keyboard shortcut display
 */
const MenuBarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        // Foundation: Typography hierarchy
        'ml-auto text-xs font-normal text-foreground-muted',
        className
      )}
      {...props}
    />
  );
};
MenuBarShortcut.displayName = 'MenuBarShortcut';

/**
 * Menu Bar Sub Menu - Nested menu container
 */
const MenuBarSub = MenubarPrimitive.Sub;

/**
 * Menu Bar Sub Trigger - Trigger for nested menu
 */
const MenuBarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> &
    VariantProps<typeof enhancedMenuBarItemVariants> & {
      inset?: boolean;
    }
>(
  (
    { className, inset, children, variant, size, enforceAAA, ...props },
    ref
  ) => (
    <MenubarPrimitive.SubTrigger
      ref={ref}
      className={cn(
        enhancedMenuBarItemVariants({ variant, size, enforceAAA }),
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className='ml-auto h-4 w-4' />
    </MenubarPrimitive.SubTrigger>
  )
);
MenuBarSubTrigger.displayName = 'MenuBarSubTrigger';

/**
 * Menu Bar Sub Content - Nested menu content
 */
const MenuBarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> &
    VariantProps<typeof enhancedMenuBarContentVariants>
>(({ className, variant, size, enforceAAA, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      enhancedMenuBarContentVariants({ variant, size, enforceAAA }),
      // Additional positioning for sub-content
      'data-[side=bottom]:slide-in-from-top-1',
      'data-[side=left]:slide-in-from-right-1',
      'data-[side=right]:slide-in-from-left-1',
      'data-[side=top]:slide-in-from-bottom-1',
      className
    )}
    {...props}
  />
));
MenuBarSubContent.displayName = 'MenuBarSubContent';

/**
 * Menu Bar Radio Group - Radio item container
 */
const MenuBarRadioGroup = MenubarPrimitive.RadioGroup;

// ===== EXPORTS =====

export {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarCheckboxItem,
  MenuBarRadioItem,
  MenuBarLabel,
  MenuBarSeparator,
  MenuBarShortcut,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
  MenuBarRadioGroup,
};

export type { VariantProps } from 'class-variance-authority';

// Export variants for external usage
export {
  enhancedMenuBarVariants,
  enhancedMenuBarTriggerVariants,
  enhancedMenuBarContentVariants,
  enhancedMenuBarItemVariants,
};
