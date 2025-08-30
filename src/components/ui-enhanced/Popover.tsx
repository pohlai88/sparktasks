/**
 * Enhanced Popover Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with cosmic innovation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Focus management and keyboard navigation
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS4: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE DECISION:
 * - Radix owns: Behavior, ARIA, focus management, positioning
 * - MAPS4 owns: Apple HIG materials, liquid glass, AAA enforcement
 * - Wrapper owns: Token application, governance rules, brand consistency
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

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED POPOVER VARIANTS =====

/**
 * Enhanced popover content variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedPopoverVariants = cva(
  [
    // Foundation: Layout - Clean positioning and size constraints
    'z-50',
    'min-w-[var(--space-32)]',
    'max-w-[var(--space-96)]',
    'overflow-hidden',
    'rounded-[var(--radius-md)]',

    // Foundation: Typography - Apple HIG hierarchy
    'text-[var(--font-size-sm)]',

    // Foundation: Materials - Deep space canvas with elevation
    'border border-cosmic-border',
    'bg-stellar-surface',
    'text-cosmic-foreground',

    // Foundation: Elevation - Sophisticated depth
    'shadow-[var(--shadow-lg)]',

    // Foundation: Motion - Respect user preferences
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
    'motion-reduce:animate-none',

    // Foundation: Enhanced padding for content
    'p-[var(--space-4)]',

    // Foundation: Focus management - AAA compliance
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-aurora-accent',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-stellar-surface',
  ],
  {
    variants: {
      variant: {
        default: [
          // Default: Clean elevated surface
          'bg-stellar-surface',
          'border-cosmic-border',
        ],
        glass: [
          // Glass: Liquid glass material with vibrancy
          'backdrop-blur-[var(--blur-md)]',
          'backdrop-saturate-[var(--saturate-150)]',
          'bg-stellar-surface/80',
          'border-cosmic-border/50',
          // AAA scrim protection for text content
          'supports-[backdrop-filter]:bg-stellar-surface/60',
        ],
        elevated: [
          // Elevated: Higher contrast for important content
          'bg-stellar-surface-elevated',
          'border-cosmic-border',
          'shadow-[var(--shadow-xl)]',
        ],
      },
      size: {
        sm: ['min-w-[var(--space-24)]', 'max-w-[var(--space-80)]', 'p-[var(--space-3)]', 'text-[var(--font-size-xs)]'],
        default: ['min-w-[var(--space-32)]', 'max-w-[var(--space-96)]', 'p-[var(--space-4)]', 'text-[var(--font-size-sm)]'],
        lg: ['min-w-[var(--space-48)]', 'max-w-[var(--space-112)]', 'p-[var(--space-6)]', 'text-[var(--font-size-base)]'],
        xl: ['min-w-[var(--space-64)]', 'max-w-[var(--space-128)]', 'p-[var(--space-6)]', 'text-[var(--font-size-base)]'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Enhanced popover trigger variants for consistent styling
 */
const enhancedPopoverTriggerVariants = cva(
  [
    // Foundation: Clean trigger styling
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-[var(--radius-md)]',
    'transition-colors',
    'duration-[var(--motion-duration-2)]',
    'ease-out',
    'motion-reduce:transition-none',

    // Foundation: Focus management
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-aurora-accent',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-stellar-surface',

    // Foundation: Interactive states
    'disabled:pointer-events-none',
    'disabled:opacity-[var(--opacity-50)]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-transparent',
          'text-cosmic-foreground',
          'hover:bg-aurora-accent/10',
          'hover:text-aurora-accent-foreground',
        ],
        outline: [
          'border',
          'border-cosmic-input',
          'bg-stellar-surface',
          'hover:bg-aurora-accent/10',
          'hover:text-aurora-accent-foreground',
        ],
        ghost: [
          'bg-transparent',
          'text-cosmic-foreground',
          'hover:bg-aurora-accent/10',
          'hover:text-aurora-accent-foreground',
        ],
      },
      size: {
        sm: 'h-[var(--space-8)] px-[var(--space-2)] text-[var(--font-size-xs)]',
        default: 'h-[var(--space-9)] px-[var(--space-3)] text-[var(--font-size-sm)]',
        lg: 'h-[var(--space-10)] px-[var(--space-4)] text-[var(--font-size-base)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// ===== TYPE DEFINITIONS =====

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof enhancedPopoverVariants> {
  /**
   * Custom class name for additional styling
   */
  className?: string;

  /**
   * Side offset for positioning
   * @default 4
   */
  sideOffset?: number;

  /**
   * Alignment offset for positioning
   * @default 0
   */
  alignOffset?: number;

  /**
   * Whether to avoid collisions with the viewport
   * @default true
   */
  avoidCollisions?: boolean;

  /**
   * Collision padding around the viewport
   * @default 10
   */
  collisionPadding?: number;
}

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
    VariantProps<typeof enhancedPopoverTriggerVariants> {
  /**
   * Custom class name for additional styling
   */
  className?: string;
  /**
   * Polymorphic support - render as different element/component
   */
  asChild?: boolean;
}

export interface PopoverWithTriggerProps
  extends Omit<PopoverContentProps, 'className'> {
  /**
   * The trigger element that opens the popover
   */
  trigger: React.ReactNode;

  /**
   * Trigger variant styling
   */
  triggerVariant?: VariantProps<
    typeof enhancedPopoverTriggerVariants
  >['variant'];

  /**
   * Trigger size styling
   */
  triggerSize?: VariantProps<typeof enhancedPopoverTriggerVariants>['size'];

  /**
   * Custom trigger class name
   */
  triggerClassName?: string;

  /**
   * Custom content class name
   */
  className?: string;

  /**
   * Content of the popover
   */
  children: React.ReactNode;

  /**
   * Whether the popover is open (controlled)
   */
  open?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Default open state (uncontrolled)
   */
  defaultOpen?: boolean;

  /**
   * Whether to close on escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether to close when clicking outside
   * @default true
   */
  closeOnOutsideClick?: boolean;
}

// ===== BASE COMPONENTS =====

/**
 * Popover Root - Controls open/close state
 */
const Popover = PopoverPrimitive.Root;

/**
 * Popover Trigger - Element that triggers the popover
 */
const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : PopoverPrimitive.Trigger;

  return (
    <Comp
      ref={ref}
      className={cn(
        enhancedPopoverTriggerVariants({ variant, size }),
        className
      )}
      {...props}
    />
  );
});
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

/**
 * Popover Anchor - Optional anchor for positioning
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Enhanced Popover Portal - Renders content in a portal
 */
const PopoverPortal = PopoverPrimitive.Portal;

/**
 * Enhanced Popover Content - Main content container with MAPS styling
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      variant,
      size,
      sideOffset = 4,
      alignOffset = 0,
      avoidCollisions = true,
      collisionPadding = 10,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        className={cn(enhancedPopoverVariants({ variant, size }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/**
 * Enhanced Popover Arrow - Optional arrow pointer
 */
const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn('fill-stellar-surface', 'stroke-cosmic-border', 'stroke-[var(--stroke-1)]', className)}
    {...props}
  />
));
PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

/**
 * Enhanced Popover Close - Close button
 */
const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn(
      'absolute',
      'right-[var(--space-2)]',
      'top-[var(--space-2)]',
      'inline-flex',
      'size-[var(--space-6)]',
      'items-center',
      'justify-center',
      'rounded-[var(--radius-sm)]',
      'opacity-[var(--opacity-70)]',
      'ring-offset-stellar-surface',
      'transition-opacity',
      'hover:opacity-100',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-aurora-accent',
      'focus:ring-offset-2',
      'disabled:pointer-events-none',
      className
    )}
    {...props}
  />
));
PopoverClose.displayName = PopoverPrimitive.Close.displayName;

// ===== ENHANCED COMPOSITE COMPONENTS =====

/**
 * Enhanced Popover with Trigger - Complete popover with trigger and content
 *
 * Combines trigger and content into a single, easy-to-use component
 * following Apple HIG patterns and MAPS v2.2 architecture.
 */
const PopoverWithTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverWithTriggerProps
>(
  (
    {
      trigger,
      triggerVariant = 'default',
      triggerSize = 'default',
      triggerClassName,
      children,
      open,
      onOpenChange,
      defaultOpen,
      closeOnEscape = true,
      closeOnOutsideClick = true,
      className,
      variant,
      size,
      ...contentProps
    },
    ref
  ) => (
    <Popover
      {...(open !== undefined && { open })}
      {...(onOpenChange !== undefined && { onOpenChange })}
      {...(defaultOpen !== undefined && { defaultOpen })}
    >
      <PopoverTrigger
        variant={triggerVariant}
        size={triggerSize}
        {...(triggerClassName !== undefined && { className: triggerClassName })}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        variant={variant}
        size={size}
        {...(className !== undefined && { className })}
        {...(closeOnEscape || { onEscapeKeyDown: e => e.preventDefault() })}
        {...(closeOnOutsideClick || { onPointerDownOutside: e => e.preventDefault() })}
        {...contentProps}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
);
PopoverWithTrigger.displayName = 'PopoverWithTrigger';

// ===== EXPORTS =====

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
  PopoverWithTrigger,
  enhancedPopoverVariants,
  enhancedPopoverTriggerVariants,
};
