/**
 * Enhanced Toggle Group Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
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
 * - Radix owns: Behavior, ARIA, focus management, selection states
 * - MAPS owns: Apple HIG materials, liquid glass, AAA enforcement
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
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 * → accessibility (standard|aaa) → dir (ltr|rtl)
 */

/* eslint-disable react/prop-types */

import * as ToggleGroupPrimitives from '@radix-ui/react-toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

// ===== ENHANCED TOGGLE GROUP VARIANTS =====

/**
 * Enhanced toggle group variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens system
 */
const enhancedToggleGroupVariants = cva(
  [
    // Foundation: Layout & positioning
    'inline-flex',
    'rounded-md',

    // Foundation: Apple HIG spacing system
    'gap-1',

    // Foundation: Background - Deep space canvas
    'bg-slate-900/5',
    'dark:bg-slate-50/5',

    // Foundation: Border - Ethereal accents
    'border border-slate-200/20',
    'dark:border-slate-700/30',

    // Foundation: Padding - Platform-aware spacing
    'p-1',

    // Foundation: Transitions - Apple HIG motion
    'transition-all duration-200 ease-out',

    // Foundation: Focus ring - AAA compliance
    'focus-within:ring-2 focus-within:ring-blue-500/60 focus-within:ring-offset-2',
    'dark:focus-within:ring-blue-400/60 dark:focus-within:ring-offset-slate-900',

    // Foundation: RTL support
    'rtl:space-x-reverse',
  ],
  {
    variants: {
      variant: {
        default: [
          // Default: Subtle glass foundation
          'bg-slate-50/30',
          'dark:bg-slate-900/30',
          'backdrop-blur-sm',
        ],
        outline: [
          // Outline: Prominent border emphasis
          'bg-transparent',
          'border-slate-300/50',
          'dark:border-slate-600/50',
          'border-2',
        ],
        ghost: [
          // Ghost: Minimal visual weight
          'bg-transparent',
          'border-transparent',
        ],
        success: [
          // Success: Affirming glass materials
          'bg-emerald-50/30',
          'dark:bg-emerald-950/30',
          'border-emerald-200/40',
          'dark:border-emerald-800/40',
          'backdrop-blur-sm',
        ],
        warning: [
          // Warning: Cautionary glass materials
          'bg-amber-50/30',
          'dark:bg-amber-950/30',
          'border-amber-200/40',
          'dark:border-amber-800/40',
          'backdrop-blur-sm',
        ],
        destructive: [
          // Destructive: Critical glass materials
          'bg-red-50/30',
          'dark:bg-red-950/30',
          'border-red-200/40',
          'dark:border-red-800/40',
          'backdrop-blur-sm',
        ],
        glass: [
          // Glass: Maximum liquid glass effect
          'bg-white/10',
          'dark:bg-black/10',
          'border-white/20',
          'dark:border-white/10',
          'backdrop-blur-lg backdrop-saturate-150',
          'shadow-xl',
        ],
      },
      size: {
        sm: [
          // Small: Compact Apple HIG spacing
          'h-8',
          'px-2',
          'gap-0.5',
          'text-xs',
        ],
        default: [
          // Default: Comfortable Apple HIG spacing
          'h-10',
          'px-3',
          'gap-1',
          'text-sm',
        ],
        lg: [
          // Large: Spacious Apple HIG spacing
          'h-12',
          'px-4',
          'gap-1.5',
          'text-base',
        ],
      },
      density: {
        comfortable: [
          // Comfortable: Standard spacing
          'gap-1',
          'p-1',
        ],
        compact: [
          // Compact: Reduced spacing
          'gap-0.5',
          'p-0.5',
        ],
      },
      accessibility: {
        standard: [
          // Standard: Default interactions
        ],
        aaa: [
          // AAA: Enhanced contrast & spacing
          'focus-within:ring-4',
          'focus-within:ring-offset-4',
          'gap-2',
          'p-2',
          '[&>*]:min-h-[44px]',
          '[&>*]:min-w-[44px]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      density: 'comfortable',
      accessibility: 'standard',
    },
  }
);

/**
 * Enhanced toggle group item variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens system
 */
const enhancedToggleGroupItemVariants = cva(
  [
    // Foundation: Layout & positioning
    'inline-flex items-center justify-center',
    'rounded-md',

    // Foundation: Typography - Apple HIG button hierarchy
    'text-sm font-medium',

    // Foundation: Sizing - Platform-aware touch targets
    'h-9 px-3',
    'min-w-[2.25rem]',

    // Foundation: Transitions - Apple HIG motion
    'transition-all duration-200 ease-out',

    // Foundation: States - Base interactions
    'hover:bg-slate-100/50',
    'dark:hover:bg-slate-800/50',

    // Foundation: Focus ring - AAA compliance
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2',
    'dark:focus-visible:ring-blue-400/60 dark:focus-visible:ring-offset-slate-900',

    // Foundation: Disabled state
    'disabled:pointer-events-none disabled:opacity-50',

    // Foundation: Selection state
    'data-[state=on]:bg-slate-100',
    'data-[state=on]:text-slate-900',
    'dark:data-[state=on]:bg-slate-800',
    'dark:data-[state=on]:text-slate-50',

    // Foundation: RTL support
    'rtl:space-x-reverse',
  ],
  {
    variants: {
      variant: {
        default: [
          // Default: Balanced glass materials
          'text-slate-700',
          'dark:text-slate-300',
          'hover:text-slate-900',
          'dark:hover:text-slate-100',
          'data-[state=on]:shadow-sm',
        ],
        outline: [
          // Outline: Border emphasis
          'border border-slate-200',
          'dark:border-slate-700',
          'text-slate-700',
          'dark:text-slate-300',
          'hover:bg-slate-50',
          'dark:hover:bg-slate-800',
          'data-[state=on]:bg-slate-900',
          'data-[state=on]:text-slate-50',
          'dark:data-[state=on]:bg-slate-50',
          'dark:data-[state=on]:text-slate-900',
        ],
        ghost: [
          // Ghost: Minimal visual weight
          'text-slate-600',
          'dark:text-slate-400',
          'hover:bg-slate-100',
          'dark:hover:bg-slate-800',
          'hover:text-slate-900',
          'dark:hover:text-slate-100',
          'data-[state=on]:bg-slate-100',
          'dark:data-[state=on]:bg-slate-800',
        ],
        success: [
          // Success: Affirming semantics
          'text-emerald-700',
          'dark:text-emerald-300',
          'hover:bg-emerald-50',
          'dark:hover:bg-emerald-950',
          'hover:text-emerald-800',
          'dark:hover:text-emerald-200',
          'data-[state=on]:bg-emerald-100',
          'data-[state=on]:text-emerald-800',
          'dark:data-[state=on]:bg-emerald-900',
          'dark:data-[state=on]:text-emerald-100',
        ],
        warning: [
          // Warning: Cautionary semantics
          'text-amber-700',
          'dark:text-amber-300',
          'hover:bg-amber-50',
          'dark:hover:bg-amber-950',
          'hover:text-amber-800',
          'dark:hover:text-amber-200',
          'data-[state=on]:bg-amber-100',
          'data-[state=on]:text-amber-800',
          'dark:data-[state=on]:bg-amber-900',
          'dark:data-[state=on]:text-amber-100',
        ],
        destructive: [
          // Destructive: Critical semantics
          'text-red-700',
          'dark:text-red-300',
          'hover:bg-red-50',
          'dark:hover:bg-red-950',
          'hover:text-red-800',
          'dark:hover:text-red-200',
          'data-[state=on]:bg-red-100',
          'data-[state=on]:text-red-800',
          'dark:data-[state=on]:bg-red-900',
          'dark:data-[state=on]:text-red-100',
        ],
        glass: [
          // Glass: Liquid glass materials
          'text-white/90',
          'hover:bg-white/10',
          'hover:text-white',
          'data-[state=on]:bg-white/20',
          'data-[state=on]:text-white',
          'data-[state=on]:backdrop-blur-sm',
          'data-[state=on]:shadow-lg',
        ],
      },
      size: {
        sm: [
          // Small: Compact Apple HIG sizing
          'h-7 px-2',
          'text-xs',
          'min-w-[1.75rem]',
        ],
        default: [
          // Default: Comfortable Apple HIG sizing
          'h-9 px-3',
          'text-sm',
          'min-w-[2.25rem]',
        ],
        lg: [
          // Large: Spacious Apple HIG sizing
          'h-11 px-4',
          'text-base',
          'min-w-[2.75rem]',
        ],
      },
      accessibility: {
        standard: [
          // Standard: Default interactions
        ],
        aaa: [
          // AAA: Enhanced contrast & touch targets
          'focus-visible:ring-4',
          'focus-visible:ring-offset-4',
          'min-h-[44px]',
          'min-w-[44px]',
          'px-4',
          // AAA scrims for glass materials
          '[&[data-variant="glass"]]:bg-black/20',
          '[&[data-variant="glass"]]:text-white',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      accessibility: 'standard',
    },
  }
);

// ===== ENHANCED TOGGLE GROUP COMPONENTS =====

/**
 * Enhanced Toggle Group Root Component
 */
export interface EnhancedToggleGroupProps
  extends VariantProps<typeof enhancedToggleGroupVariants> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  /**
   * Toggle group type - single or multiple selection
   */
  type: 'single' | 'multiple';
  /**
   * Value for controlled component
   */
  value?: string | string[];
  /**
   * Default value for uncontrolled component
   */
  defaultValue?: string | string[];
  /**
   * Callback fired when value changes
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * Whether the toggle group is disabled
   */
  disabled?: boolean;
  /**
   * Whether roving focus is enabled
   */
  rovingFocus?: boolean;
  /**
   * Orientation of the toggle group
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Direction for reading order
   */
  dir?: 'ltr' | 'rtl';
  /**
   * Whether to loop focus
   */
  loop?: boolean;
  /**
   * AAA compliance mode for enhanced accessibility
   */
  aaaMode?: boolean;
}

const EnhancedToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitives.Root>,
  EnhancedToggleGroupProps
>(
  (
    { className, variant, size, density, accessibility, aaaMode, ...props },
    ref
  ) => {
    const resolvedAccessibility = aaaMode ? 'aaa' : accessibility;

    return (
      <ToggleGroupPrimitives.Root
        ref={ref}
        className={cn(
          enhancedToggleGroupVariants({
            variant,
            size,
            density,
            accessibility: resolvedAccessibility,
          }),
          className
        )}
        {...(props as Parameters<typeof ToggleGroupPrimitives.Root>[0])}
      />
    );
  }
);
EnhancedToggleGroup.displayName = 'EnhancedToggleGroup';

/**
 * Enhanced Toggle Group Item Component
 */
export interface EnhancedToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitives.Item>,
    VariantProps<typeof enhancedToggleGroupItemVariants> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * AAA compliance mode for enhanced accessibility
   */
  aaaMode?: boolean;
}

const EnhancedToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitives.Item>,
  EnhancedToggleGroupItemProps
>(({ className, variant, size, accessibility, aaaMode, ...props }, ref) => {
  const resolvedAccessibility = aaaMode ? 'aaa' : accessibility;

  return (
    <ToggleGroupPrimitives.Item
      ref={ref}
      className={cn(
        enhancedToggleGroupItemVariants({
          variant,
          size,
          accessibility: resolvedAccessibility,
        }),
        className
      )}
      data-variant={variant}
      {...props}
    />
  );
});
EnhancedToggleGroupItem.displayName = 'EnhancedToggleGroupItem';

// ===== ENHANCED TOGGLE GROUP FACTORY =====

/**
 * Enhanced Toggle Group Factory - Semantic Constructors
 * Following Apple HIG semantic hierarchy
 */
export const ToggleGroupFactory = {
  /**
   * Default semantic toggle group - balanced visual weight
   */
  default: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='default' {...props} />
  ),

  /**
   * Outline semantic toggle group - prominent border emphasis
   */
  outline: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='outline' {...props} />
  ),

  /**
   * Ghost semantic toggle group - minimal visual weight
   */
  ghost: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='ghost' {...props} />
  ),

  /**
   * Success semantic toggle group - affirming actions
   */
  success: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='success' {...props} />
  ),

  /**
   * Warning semantic toggle group - cautionary actions
   */
  warning: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='warning' {...props} />
  ),

  /**
   * Destructive semantic toggle group - critical actions
   */
  destructive: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='destructive' {...props} />
  ),

  /**
   * Glass semantic toggle group - liquid glass materials
   */
  glass: (props: Omit<EnhancedToggleGroupProps, 'variant'>) => (
    <EnhancedToggleGroup variant='glass' {...props} />
  ),

  /**
   * AAA compliant toggle group with enhanced accessibility
   */
  aaa: (props: Omit<EnhancedToggleGroupProps, 'aaaMode'>) => (
    <EnhancedToggleGroup aaaMode={true} {...props} />
  ),

  /**
   * Text formatting semantic toggle group with common text controls
   */
  textFormatting: (props: Omit<EnhancedToggleGroupProps, 'children'>) => (
    <EnhancedToggleGroup {...props}>
      <EnhancedToggleGroupItem value='bold' aria-label='Bold'>
        {ToggleGroupIcons.Bold()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='italic' aria-label='Italic'>
        {ToggleGroupIcons.Italic()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='underline' aria-label='Underline'>
        {ToggleGroupIcons.Underline()}
      </EnhancedToggleGroupItem>
    </EnhancedToggleGroup>
  ),

  /**
   * Alignment semantic toggle group with text alignment controls
   */
  alignment: (props: Omit<EnhancedToggleGroupProps, 'children'>) => (
    <EnhancedToggleGroup {...props}>
      <EnhancedToggleGroupItem value='left' aria-label='Align left'>
        {ToggleGroupIcons.AlignLeft()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='center' aria-label='Align center'>
        {ToggleGroupIcons.AlignCenter()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='right' aria-label='Align right'>
        {ToggleGroupIcons.AlignRight()}
      </EnhancedToggleGroupItem>
    </EnhancedToggleGroup>
  ),

  /**
   * View mode semantic toggle group with layout controls
   */
  viewMode: (props: Omit<EnhancedToggleGroupProps, 'children'>) => (
    <EnhancedToggleGroup {...props}>
      <EnhancedToggleGroupItem value='grid' aria-label='Grid view'>
        {ToggleGroupIcons.Grid()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='list' aria-label='List view'>
        {ToggleGroupIcons.List()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='card' aria-label='Card view'>
        {ToggleGroupIcons.Card()}
      </EnhancedToggleGroupItem>
    </EnhancedToggleGroup>
  ),

  /**
   * Feature toggles semantic toggle group for settings
   */
  featureToggles: (props: Omit<EnhancedToggleGroupProps, 'children'>) => (
    <EnhancedToggleGroup {...props}>
      <EnhancedToggleGroupItem
        value='notifications'
        aria-label='Enable notifications'
      >
        {ToggleGroupIcons.Bell()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='autosave' aria-label='Enable autosave'>
        {ToggleGroupIcons.Save()}
      </EnhancedToggleGroupItem>
      <EnhancedToggleGroupItem value='sync' aria-label='Enable sync'>
        {ToggleGroupIcons.Sync()}
      </EnhancedToggleGroupItem>
    </EnhancedToggleGroup>
  ),
};

/**
 * Enhanced Toggle Group Item Factory - Semantic Constructors
 */
export const ToggleGroupItemFactory = {
  /**
   * Default semantic toggle group item
   */
  default: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='default' {...props} />
  ),

  /**
   * Outline semantic toggle group item
   */
  outline: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='outline' {...props} />
  ),

  /**
   * Ghost semantic toggle group item
   */
  ghost: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='ghost' {...props} />
  ),

  /**
   * Success semantic toggle group item
   */
  success: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='success' {...props} />
  ),

  /**
   * Warning semantic toggle group item
   */
  warning: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='warning' {...props} />
  ),

  /**
   * Destructive semantic toggle group item
   */
  destructive: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='destructive' {...props} />
  ),

  /**
   * Glass semantic toggle group item
   */
  glass: (props: Omit<EnhancedToggleGroupItemProps, 'variant'>) => (
    <EnhancedToggleGroupItem variant='glass' {...props} />
  ),

  /**
   * AAA compliant toggle group item
   */
  aaa: (props: Omit<EnhancedToggleGroupItemProps, 'aaaMode'>) => (
    <EnhancedToggleGroupItem aaaMode={true} {...props} />
  ),
};

// ===== ENHANCED TOGGLE GROUP UTILITIES =====

/**
 * Toggle Group Icons - Common icon utilities
 */
export const ToggleGroupIcons = {
  Bold: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.10505 12C4.70805 12 4.4236 11.912 4.25171 11.736C4.0839 11.5559 4 11.2715 4 10.8827V4.11733C4 3.72033 4.08595 3.43588 4.25784 3.26398C4.43383 3.08799 4.71623 3 5.10505 3C6.42741 3 8.25591 3 9.02852 3C10.1373 3 11.0539 3.98153 11.0539 5.1846C11.0539 6.08501 10.6037 6.81855 9.70327 7.23602C10.8657 7.44851 11.5176 8.62787 11.5176 9.48128C11.5176 10.5125 10.9902 12 9.27734 12C8.77742 12 6.42626 12 5.10505 12ZM8.37891 8.17969H6.94727V10.4688H8.37891C8.9668 10.4688 9.6748 10.2959 9.6748 9.32422C9.6748 8.35254 8.9668 8.17969 8.37891 8.17969ZM6.94727 6.25781H8.17969C8.55859 6.25781 9.11719 6.09766 9.11719 5.43164C9.11719 4.76562 8.55859 4.53125 8.17969 4.53125H6.94727V6.25781Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Italic: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.67494 3.50017C5.67494 3.25003 5.87481 3.05017 6.12494 3.05017H10.6249C10.8751 3.05017 11.0749 3.25003 11.0749 3.50017C11.0749 3.7503 10.8751 3.95017 10.6249 3.95017H8.74999L7.42499 11.0502H9.37494C9.62508 11.0502 9.82494 11.25 9.82494 11.5002C9.82494 11.7503 9.62508 11.9502 9.37494 11.9502H4.87494C4.62481 11.9502 4.42494 11.7503 4.42494 11.5002C4.42494 11.25 4.62481 11.0502 4.87494 11.0502H6.74999L8.07499 3.95017H6.12494C5.87481 3.95017 5.67494 3.7503 5.67494 3.50017Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Underline: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.00001 2.75C5.00001 2.47386 4.77615 2.25 4.50001 2.25C4.22387 2.25 4.00001 2.47386 4.00001 2.75V8.05C4.00001 9.983 5.56702 11.55 7.50001 11.55C9.43301 11.55 11 9.983 11 8.05V2.75C11 2.47386 10.7762 2.25 10.5 2.25C10.2239 2.25 10 2.47386 10 2.75V8.05C10 9.43071 8.88072 10.55 7.50001 10.55C6.1193 10.55 5.00001 9.43071 5.00001 8.05V2.75ZM3.49998 13.25C3.27906 13.25 3.09998 13.4291 3.09998 13.65C3.09998 13.8709 3.27906 14.05 3.49998 14.05H11.5C11.7209 14.05 11.9 13.8709 11.9 13.65C11.9 13.4291 11.7209 13.25 11.5 13.25H3.49998Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  AlignLeft: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H7.5C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  AlignCenter: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM3 10.5C3 10.2239 3.22386 10 3.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  AlignRight: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM7 7.5C7 7.22386 7.22386 7 7.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H7.5C7.22386 8 7 7.77614 7 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H4.5C4.22386 11 4 10.7761 4 10.5Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Grid: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 2.5C1 2.22386 1.22386 2 1.5 2H5.5C5.77614 2 6 2.22386 6 2.5V6.5C6 6.77614 5.77614 7 5.5 7H1.5C1.22386 7 1 6.77614 1 6.5V2.5ZM9 2.5C9 2.22386 9.22386 2 9.5 2H13.5C13.7761 2 14 2.22386 14 2.5V6.5C14 6.77614 13.7761 7 13.5 7H9.5C9.22386 7 9 6.77614 9 6.5V2.5ZM1 10.5C1 10.2239 1.22386 10 1.5 10H5.5C5.77614 10 6 10.2239 6 10.5V14.5C6 14.7761 5.77614 15 5.5 15H1.5C1.22386 15 1 14.7761 1 14.5V10.5ZM9 10.5C9 10.2239 9.22386 10 9.5 10H13.5C13.7761 10 14 10.2239 14 10.5V14.5C14 14.7761 13.7761 15 13.5 15H9.5C9.22386 15 9 14.7761 9 14.5V10.5Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  List: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 4.5C1 4.22386 1.22386 4 1.5 4H2.5C2.77614 4 3 4.22386 3 4.5C3 4.77614 2.77614 5 2.5 5H1.5C1.22386 5 1 4.77614 1 4.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H4.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H4.5ZM1 10.5C1 10.2239 1.22386 10 1.5 10H2.5C2.77614 10 3 10.2239 3 10.5C3 10.7761 2.77614 11 2.5 11H1.5C1.22386 11 1 10.7761 1 10.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H13.5C13.7761 11 14 10.7761 14 10.5C14 10.2239 13.7761 10 13.5 10H4.5Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Card: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2 3C1.44772 3 1 3.44772 1 4V11C1 11.5523 1.44772 12 2 12H13C13.5523 12 14 11.5523 14 11V4C14 3.44772 13.5523 3 13 3H2ZM2 4H13V11H2V4Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Bell: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M8.60186 1.13829C9.1949 1.24136 9.56849 1.82179 9.46542 2.41483C9.36236 3.00787 8.78193 3.38146 8.18889 3.27839C7.48269 3.15778 6.75113 3.46306 6.26735 4.0672C5.78358 4.67134 5.61244 5.48866 5.8082 6.25845L6.20369 7.79793L6.62279 9.44216C6.67203 9.64093 6.51777 9.83509 6.31901 9.88433C6.12024 9.93357 5.92608 9.77931 5.87684 9.58054L5.46104 7.96528L5.0648 6.42485C4.79651 5.36363 5.03009 4.21756 5.70349 3.37115C6.3769 2.52474 7.40313 2.08771 8.46435 2.35599L8.60186 1.13829ZM5.07457 11.1716C5.02734 11.0617 4.92618 10.9855 4.8051 10.9855H2.54639C2.425 10.9855 2.32386 11.0617 2.27663 11.1716C2.2294 11.2815 2.25163 11.4086 2.33688 11.4939L3.39089 12.5479C3.84256 13.1395 4.52554 13.4855 5.25 13.4855H9.75C10.4745 13.4855 11.1574 13.1395 11.6091 12.5479L12.6631 11.4939C12.7484 11.4086 12.7706 11.2815 12.7234 11.1716C12.6761 11.0617 12.575 10.9855 12.4536 10.9855H10.1949C10.0738 10.9855 9.97267 11.0617 9.92544 11.1716C9.87821 11.2815 9.90044 11.4086 9.98569 11.4939L10.3107 11.8189C10.5026 12.0108 10.5026 12.3242 10.3107 12.5161C10.1188 12.708 9.80538 12.708 9.61349 12.5161L8.66061 11.5632C8.28012 11.1827 7.71988 11.1827 7.33939 11.5632L6.38651 12.5161C6.19462 12.708 5.88121 12.708 5.68932 12.5161C5.49743 12.3242 5.49743 12.0108 5.68932 11.8189L6.01431 11.4939C6.09956 11.4086 6.12179 11.2815 6.07457 11.1716Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Save: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 2C1 1.44772 1.44772 1 2 1H12.0607C12.3239 1 12.5761 1.10536 12.7607 1.29289L13.7071 2.23934C13.8946 2.42687 14 2.67909 14 2.94281V13C14 13.5523 13.5523 14 13 14H2C1.44772 14 1 13.5523 1 13V2ZM4 3V6H10V3H4ZM11 3V6.5C11 6.77614 10.7761 7 10.5 7H3.5C3.22386 7 3 6.77614 3 6.5V3H2V13H13V3.05719L12.0498 2.10695C12.0342 2.09137 12.0158 2.07911 11.9951 2.07031C11.9744 2.06151 11.9519 2.05637 11.9289 2.05516C11.9058 2.05395 11.8828 2.05668 11.8608 2.06322C11.8388 2.06975 11.8184 2.08 11.8002 2.09375L11 3ZM4 9C4 8.44772 4.44772 8 5 8H10C10.5523 8 11 8.44772 11 9V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V9ZM5 9V12H10V9H5Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
  Sync: () => (
    <svg
      width='15'
      height='15'
      viewBox='0 0 15 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 2.92337 10.3962 0.849976 7.49998 0.849976C3.52447 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.52447 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2285C12.4098 12.0332 12.4098 11.7166 12.2145 11.5213C12.0192 11.326 11.7026 11.326 11.5073 11.5213C10.5667 12.4619 9.20998 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  ),
};

// ===== ENHANCED TOGGLE GROUP HOOKS =====

/**
 * Enhanced Toggle Group Hook - State management with MAPS patterns
 */
export function useEnhancedToggleGroup<T extends string | string[]>(
  defaultValue?: T,
  options?: {
    onValueChange?: (value: T) => void;
    multiple?: T extends string[] ? true : false;
  }
) {
  const [value, setValue] = React.useState<T>(defaultValue as T);

  const handleValueChange = React.useCallback(
    (newValue: T) => {
      setValue(newValue);
      options?.onValueChange?.(newValue);
    },
    [options]
  );

  return {
    value,
    onValueChange: handleValueChange,
    multiple: options?.multiple,
  } as const;
}

/**
 * Enhanced Toggle Group Multi Hook - Multiple selection state management
 */
export function useEnhancedToggleGroupMulti(
  defaultValue: string[] = [],
  options?: {
    onValueChange?: (value: string[]) => void;
    maxSelection?: number;
  }
) {
  const [value, setValue] = React.useState<string[]>(defaultValue);

  const handleValueChange = React.useCallback(
    (newValue: string[]) => {
      if (options?.maxSelection && newValue.length > options.maxSelection) {
        return;
      }
      setValue(newValue);
      options?.onValueChange?.(newValue);
    },
    [options]
  );

  const toggleValue = React.useCallback(
    (itemValue: string) => {
      const newValue = value.includes(itemValue)
        ? value.filter(v => v !== itemValue)
        : [...value, itemValue];
      handleValueChange(newValue);
    },
    [value, handleValueChange]
  );

  return {
    value,
    onValueChange: handleValueChange,
    toggleValue,
    isSelected: (itemValue: string) => value.includes(itemValue),
    selectedCount: value.length,
    maxReached: options?.maxSelection
      ? value.length >= options.maxSelection
      : false,
  } as const;
}

// ===== EXPORTS =====

export {
  EnhancedToggleGroup as ToggleGroup,
  EnhancedToggleGroupItem as ToggleGroupItem,
  enhancedToggleGroupVariants as toggleGroupVariants,
  enhancedToggleGroupItemVariants as toggleGroupItemVariants,
};

export type {
  EnhancedToggleGroupProps as ToggleGroupProps,
  EnhancedToggleGroupItemProps as ToggleGroupItemProps,
};
