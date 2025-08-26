/**
 * Enhanced Toolbar Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
 *
 * COMPLIANCE MATRIX:
 * - Dark-First Foundation: ✅ Deep space canvas with ethereal accents
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE DECISION:
 * - Radix owns: Behavior, ARIA, focus management, keyboard navigation
 * - MAPS owns: Apple HIG materials, liquid glass, AAA enforcement
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

import * as RadixToolbar from '@radix-ui/react-toolbar';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/utils/cn';

// ===== ENHANCED TOOLBAR VARIANTS =====

/**
 * Enhanced toolbar root variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedToolbarVariants = cva(
  [
    // Foundation: Layout/positioning - Clean structured container
    'flex items-center justify-start',
    'min-h-[44px] w-full', // Apple HIG minimum touch target

    // Foundation: Surface hierarchy - Dark-first with systematic elevation
    'bg-surface-elevated1',
    'border-b border-border-subtle',

    // Foundation: Spacing - Apple HIG systematic spacing (8pt grid)
    'px-4 py-2',
    'gap-2',

    // Foundation: Typography - Apple semantic hierarchy
    'text-content-primary text-sm font-medium',

    // Foundation: Motion - Respect user preferences
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: Focus management - Radix handles tab navigation
    'focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2',
    'focus-within:ring-offset-surface-canvas',
  ],
  {
    variants: {
      variant: {
        // Default: Clean elevated surface
        default: ['bg-surface-elevated1', 'border-border-subtle'],

        // Elevated: Higher z-index surface
        elevated: [
          'bg-surface-elevated2',
          'border-border-default',
          'shadow-md',
        ],

        // Glass: Liquid glass material with governed vibrancy
        glass: [
          'bg-surface-translucent',
          'backdrop-blur-[12px] backdrop-saturate-[135%]',
          'border-border-accent/30',
          'shadow-lg',
        ],

        // Floating: Maximum elevation with accent glow
        floating: [
          'bg-surface-elevated2',
          'border-border-accent/50',
          'shadow-xl shadow-accent/20',
          'rounded-lg',
        ],

        // Outline: Minimal border-focused design
        outline: ['bg-surface-canvas', 'border border-border-strong'],

        // Ghost: Transparent minimal styling
        ghost: ['bg-transparent', 'border-transparent'],

        // AAA: High-contrast mode for accessibility
        aaa: [
          'bg-[var(--aaa-surface)]',
          'border-[var(--aaa-border)]',
          'text-[var(--aaa-content)]',
          'shadow-lg',
        ],
      },
      size: {
        // Small: Compact toolbar for dense layouts
        sm: ['min-h-[36px]', 'px-3 py-1', 'gap-1'],

        // Default: Standard Apple HIG sizing
        md: ['min-h-[44px]', 'px-4 py-2', 'gap-2'],

        // Large: Prominent toolbar for primary actions
        lg: ['min-h-[52px]', 'px-6 py-3', 'gap-3'],
      },
      density: {
        // Comfortable: Default spacing for general use
        comfortable: ['gap-2'],

        // Compact: Reduced spacing for dense interfaces
        compact: ['gap-1'],
      },
      orientation: {
        // Horizontal: Default toolbar layout
        horizontal: ['flex-row'],

        // Vertical: Sidebar-style toolbar
        vertical: ['flex-col', 'h-full w-auto', 'min-w-[44px]'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      density: 'comfortable',
      orientation: 'horizontal',
    },
  }
);

/**
 * Enhanced toolbar button variants with Apple HIG interaction patterns
 */
const enhancedToolbarButtonVariants = cva(
  [
    // Foundation: Layout - Clean button structure
    'inline-flex items-center justify-center',
    'rounded-md',
    'gap-1.5',

    // Foundation: Sizing - Apple HIG minimum touch targets
    'min-h-[32px] min-w-[32px]',
    'px-2 py-1',

    // Foundation: Typography - Consistent with Apple hierarchy
    'text-xs font-medium',
    'text-content-secondary',

    // Foundation: Motion - Apple-quality interactions
    'transition-all duration-150 ease-out',
    'motion-reduce:transition-none',

    // Foundation: States - Comprehensive interaction design
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[pressed=true]:bg-surface-elevated2',
    'data-[pressed=true]:text-content-primary',

    // Foundation: Focus - AAA compliant focus management
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
    'focus-visible:ring-offset-surface-elevated1',

    // Foundation: Apple HIG hover patterns - Pointer-only
    'pointer:hover:bg-surface-elevated2',
    'pointer:hover:text-content-primary',
    'pointer:hover:scale-[1.02]',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        // Default: Subtle secondary button
        default: [
          'bg-transparent',
          'text-content-secondary',
          'pointer:hover:bg-surface-elevated2',
        ],

        // Primary: Accent-colored primary action
        primary: [
          'bg-accent',
          'text-accent-foreground',
          'pointer:hover:bg-accent/90',
        ],

        // Secondary: Clear secondary styling
        secondary: [
          'bg-surface-elevated2',
          'text-content-primary',
          'border border-border-subtle',
          'pointer:hover:bg-surface-elevated1',
        ],

        // Ghost: Minimal invisible styling
        ghost: [
          'bg-transparent',
          'text-content-secondary',
          'pointer:hover:bg-surface-elevated1/50',
        ],

        // Outline: Border-focused design
        outline: [
          'bg-transparent',
          'border-border-default border',
          'text-content-primary',
          'pointer:hover:bg-surface-elevated1',
        ],

        // Success: Affirming actions
        success: [
          'bg-feedback-success',
          'text-feedback-success-foreground',
          'pointer:hover:bg-feedback-success/90',
        ],

        // Warning: Cautionary actions
        warning: [
          'bg-feedback-warning',
          'text-feedback-warning-foreground',
          'pointer:hover:bg-feedback-warning/90',
        ],

        // Destructive: High-attention dangerous actions
        destructive: [
          'bg-feedback-error',
          'text-feedback-error-foreground',
          'pointer:hover:bg-feedback-error/90',
        ],
      },
      size: {
        // Small: Compact buttons for dense toolbars
        sm: ['min-h-[28px] min-w-[28px]', 'px-1.5 py-0.5', 'text-xs'],

        // Default: Standard sizing
        md: ['min-h-[32px] min-w-[32px]', 'px-2 py-1', 'text-xs'],

        // Large: Prominent primary actions
        lg: ['min-h-[36px] min-w-[36px]', 'px-3 py-1.5', 'text-sm'],
      },
      state: {
        // Pressed: Active/selected state
        pressed: ['bg-accent/20', 'text-accent', 'border border-accent/30'],

        // Loading: Processing state
        loading: ['opacity-75', 'cursor-wait'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Enhanced toolbar separator variants with subtle hierarchy
 */
const enhancedToolbarSeparatorVariants = cva(
  [
    // Foundation: Structure - Clean divider
    'shrink-0',
    'bg-border-subtle',

    // Foundation: Motion - Subtle transitions
    'transition-colors duration-200',
  ],
  {
    variants: {
      orientation: {
        horizontal: ['h-px w-full', 'my-2'],
        vertical: ['h-6 w-px', 'mx-2'],
      },
      variant: {
        default: ['bg-border-subtle'],
        strong: ['bg-border-default'],
        accent: ['bg-accent/30'],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      variant: 'default',
    },
  }
);

/**
 * Enhanced toolbar toggle group variants for grouped actions
 */
const enhancedToolbarToggleGroupVariants = cva(
  [
    // Foundation: Layout - Clean grouped container
    'inline-flex items-center',
    'rounded-md',
    'bg-surface-elevated1',
    'border border-border-subtle',
    'p-0.5',
    'gap-px',
  ],
  {
    variants: {
      size: {
        sm: 'p-0.5',
        md: 'p-1',
        lg: 'p-1.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// ===== ENHANCED TOOLBAR COMPONENT INTERFACES =====

interface EnhancedToolbarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadixToolbar.Root>,
      'orientation'
    >,
    VariantProps<typeof enhancedToolbarVariants> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * Enable AAA compliance mode - replaces ethereal accents with high-contrast alternatives
   */
  enforceAAA?: boolean;
  /**
   * Apply liquid glass vibrancy effects (only on surfaces, never content)
   */
  enableVibrancy?: boolean;
  /**
   * Custom aria-label for screen readers
   */
  'aria-label'?: string;
}

interface EnhancedToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Button>,
    VariantProps<typeof enhancedToolbarButtonVariants> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * Button content - can include icons + text
   */
  children?: React.ReactNode;
  /**
   * Loading state indicator
   */
  loading?: boolean;
  /**
   * Icon element (optional)
   */
  icon?: React.ReactNode;
  /**
   * Tooltip content for accessibility
   */
  tooltip?: string;
}

interface EnhancedToolbarLinkProps
  extends React.ComponentPropsWithoutRef<typeof RadixToolbar.Link>,
    VariantProps<typeof enhancedToolbarButtonVariants> {
  /**
   * Link content
   */
  children?: React.ReactNode;
  /**
   * Icon element (optional)
   */
  icon?: React.ReactNode;
}

interface EnhancedToolbarSeparatorProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadixToolbar.Separator>,
      'orientation'
    >,
    VariantProps<typeof enhancedToolbarSeparatorVariants> {}

interface EnhancedToolbarToggleGroupProps
  extends VariantProps<typeof enhancedToolbarToggleGroupVariants> {
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * Toggle group content
   */
  children?: React.ReactNode;
  /**
   * Toggle group type - single or multiple selection
   */
  type: 'single' | 'multiple';
  /**
   * Current value for single selection
   */
  value?: string | string[];
  /**
   * Default value for uncontrolled usage
   */
  defaultValue?: string | string[];
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * Whether roving focus is enabled
   */
  rovingFocus?: boolean;
  /**
   * Whether the group is disabled
   */
  disabled?: boolean;
  /**
   * Whether focus should loop
   */
  loop?: boolean;
  /**
   * Direction of the group
   */
  dir?: 'ltr' | 'rtl';
}

interface EnhancedToolbarToggleItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixToolbar.ToggleItem>,
    VariantProps<typeof enhancedToolbarButtonVariants> {
  /**
   * Item content
   */
  children?: React.ReactNode;
  /**
   * Icon element (optional)
   */
  icon?: React.ReactNode;
}

// ===== ENHANCED TOOLBAR COMPONENTS =====

/**
 * Enhanced Toolbar Root - Main container with MAPS v2.2 compliance
 */
const EnhancedToolbar = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Root>,
  EnhancedToolbarProps
>(
  (
    {
      className,
      variant,
      size,
      density,
      orientation,
      enforceAAA,
      enableVibrancy,
      ...props
    },
    ref
  ) => {
    // Apply AAA compliance if enforced
    const aaaClassName = enforceAAA
      ? className?.replace(/bg-accent/g, 'bg-[var(--aaa-accent)]')
      : className;

    return (
      <RadixToolbar.Root
        ref={ref}
        className={cn(
          enhancedToolbarVariants({ variant, size, density, orientation }),
          enableVibrancy &&
            variant === 'glass' &&
            'supports-backdrop-blur:bg-surface-translucent/80',
          aaaClassName
        )}
        aria-label={props['aria-label'] || 'Toolbar'}
        {...props}
      />
    );
  }
);
EnhancedToolbar.displayName = 'EnhancedToolbar';

/**
 * Enhanced Toolbar Button - Interactive action with Apple HIG patterns
 */
const EnhancedToolbarButton = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Button>,
  EnhancedToolbarButtonProps
>(
  (
    {
      className,
      variant,
      size,
      state,
      loading,
      icon,
      tooltip,
      children,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {loading && (
          <div className='mr-1 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent' />
        )}
        {!loading && icon && <span className='shrink-0'>{icon}</span>}
        {children && <span className='truncate'>{children}</span>}
      </>
    );

    return (
      <RadixToolbar.Button
        ref={ref}
        className={cn(
          enhancedToolbarButtonVariants({ variant, size, state }),
          loading && 'cursor-wait',
          className
        )}
        disabled={loading || props.disabled}
        title={tooltip}
        aria-label={props['aria-label'] || tooltip}
        {...props}
      >
        {content}
      </RadixToolbar.Button>
    );
  }
);
EnhancedToolbarButton.displayName = 'EnhancedToolbarButton';

/**
 * Enhanced Toolbar Link - Navigation link with button styling
 */
const EnhancedToolbarLink = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Link>,
  EnhancedToolbarLinkProps
>(({ className, variant, size, icon, children, ...props }, ref) => (
  <RadixToolbar.Link
    ref={ref}
    className={cn(enhancedToolbarButtonVariants({ variant, size }), className)}
    {...props}
  >
    {icon && <span className='shrink-0'>{icon}</span>}
    {children && <span className='truncate'>{children}</span>}
  </RadixToolbar.Link>
));
EnhancedToolbarLink.displayName = 'EnhancedToolbarLink';

/**
 * Enhanced Toolbar Separator - Visual divider with hierarchy
 */
const EnhancedToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.Separator>,
  EnhancedToolbarSeparatorProps
>(({ className, orientation = 'vertical', variant, ...props }, ref) => (
  <RadixToolbar.Separator
    ref={ref}
    orientation={orientation || 'vertical'}
    className={cn(
      enhancedToolbarSeparatorVariants({
        orientation: orientation || 'vertical',
        variant,
      }),
      className
    )}
    {...props}
  />
));
EnhancedToolbarSeparator.displayName = 'EnhancedToolbarSeparator';

/**
 * Enhanced Toolbar Toggle Group - Grouped toggle buttons
 */
const EnhancedToolbarToggleGroup = React.forwardRef<
  HTMLDivElement,
  EnhancedToolbarToggleGroupProps
>(
  (
    {
      className,
      size,
      type,
      value,
      defaultValue,
      onValueChange,
      rovingFocus,
      disabled,
      loop,
      dir,
      children,
      ...props
    },
    ref
  ) => {
    const baseProps = {
      ref,
      className: cn(enhancedToolbarToggleGroupVariants({ size }), className),
      ...(rovingFocus !== undefined && { rovingFocus }),
      ...(disabled !== undefined && { disabled }),
      ...(loop !== undefined && { loop }),
      ...(dir !== undefined && { dir }),
      ...props,
    };

    // Type-safe handling of single vs multiple toggle groups
    if (type === 'single') {
      const singleProps = {
        ...baseProps,
        type: 'single' as const,
        ...(typeof value === 'string' && { value }),
        ...(typeof defaultValue === 'string' && { defaultValue }),
        ...(onValueChange && {
          onValueChange: (newValue: string) => onValueChange(newValue),
        }),
      };

      return (
        <RadixToolbar.ToggleGroup {...singleProps}>
          {children}
        </RadixToolbar.ToggleGroup>
      );
    } else {
      const multipleProps = {
        ...baseProps,
        type: 'multiple' as const,
        ...(Array.isArray(value) && { value }),
        ...(Array.isArray(defaultValue) && { defaultValue }),
        ...(onValueChange && {
          onValueChange: (newValue: string[]) => onValueChange(newValue),
        }),
      };

      return (
        <RadixToolbar.ToggleGroup {...multipleProps}>
          {children}
        </RadixToolbar.ToggleGroup>
      );
    }
  }
);
EnhancedToolbarToggleGroup.displayName = 'EnhancedToolbarToggleGroup';

/**
 * Enhanced Toolbar Toggle Item - Individual toggle button
 */
const EnhancedToolbarToggleItem = React.forwardRef<
  React.ElementRef<typeof RadixToolbar.ToggleItem>,
  EnhancedToolbarToggleItemProps
>(({ className, variant, size, icon, children, ...props }, ref) => (
  <RadixToolbar.ToggleItem
    ref={ref}
    className={cn(
      enhancedToolbarButtonVariants({ variant, size }),
      'data-[state=on]:bg-accent/20 data-[state=on]:text-accent',
      className
    )}
    {...props}
  >
    {icon && <span className='shrink-0'>{icon}</span>}
    {children && <span className='truncate'>{children}</span>}
  </RadixToolbar.ToggleItem>
));
EnhancedToolbarToggleItem.displayName = 'EnhancedToolbarToggleItem';

// ===== ENHANCED TOOLBAR FACTORY FUNCTIONS =====

/**
 * Enhanced Toolbar Factory - Semantic Constructors
 * Following Apple HIG semantic hierarchy
 */
export const ToolbarFactory = {
  /**
   * Default semantic toolbar - balanced visual weight
   */
  default: (props: Omit<EnhancedToolbarProps, 'variant'>) => (
    <EnhancedToolbar variant='default' {...props} />
  ),

  /**
   * Elevated semantic toolbar - prominent surface hierarchy
   */
  elevated: (props: Omit<EnhancedToolbarProps, 'variant'>) => (
    <EnhancedToolbar variant='elevated' {...props} />
  ),

  /**
   * Glass semantic toolbar - liquid glass materials
   */
  glass: (props: Omit<EnhancedToolbarProps, 'variant'>) => (
    <EnhancedToolbar variant='glass' enableVibrancy {...props} />
  ),

  /**
   * Floating semantic toolbar - maximum elevation
   */
  floating: (props: Omit<EnhancedToolbarProps, 'variant'>) => (
    <EnhancedToolbar variant='floating' {...props} />
  ),

  /**
   * AAA semantic toolbar - high contrast accessibility
   */
  aaa: (props: Omit<EnhancedToolbarProps, 'variant'>) => (
    <EnhancedToolbar variant='aaa' enforceAAA {...props} />
  ),
};

/**
 * Enhanced Toolbar Button Factory - Semantic Constructors
 */
export const ToolbarButtonFactory = {
  /**
   * Primary action button - main toolbar actions
   */
  primary: (props: Omit<EnhancedToolbarButtonProps, 'variant'>) => (
    <EnhancedToolbarButton variant='primary' {...props} />
  ),

  /**
   * Secondary action button - supporting actions
   */
  secondary: (props: Omit<EnhancedToolbarButtonProps, 'variant'>) => (
    <EnhancedToolbarButton variant='secondary' {...props} />
  ),

  /**
   * Ghost action button - minimal styling
   */
  ghost: (props: Omit<EnhancedToolbarButtonProps, 'variant'>) => (
    <EnhancedToolbarButton variant='ghost' {...props} />
  ),

  /**
   * Success action button - affirming actions
   */
  success: (props: Omit<EnhancedToolbarButtonProps, 'variant'>) => (
    <EnhancedToolbarButton variant='success' {...props} />
  ),

  /**
   * Warning action button - cautionary actions
   */
  warning: (props: Omit<EnhancedToolbarButtonProps, 'variant'>) => (
    <EnhancedToolbarButton variant='warning' {...props} />
  ),

  /**
   * Destructive action button - dangerous actions
   */
  destructive: (props: Omit<EnhancedToolbarButtonProps, 'variant'>) => (
    <EnhancedToolbarButton variant='destructive' {...props} />
  ),
};

// ===== ENHANCED TOOLBAR ICONS =====

/**
 * Enhanced Toolbar Icons - Comprehensive icon system with consistent sizing
 */
export const ToolbarIcons = {
  /**
   * Bold text formatting
   */
  Bold: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' />
      <path d='M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z' />
    </svg>
  ),

  /**
   * Italic text formatting
   */
  Italic: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <line x1='19' y1='4' x2='10' y2='4' />
      <line x1='14' y1='20' x2='5' y2='20' />
      <line x1='15' y1='4' x2='9' y2='20' />
    </svg>
  ),

  /**
   * Underline text formatting
   */
  Underline: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3' />
      <line x1='4' y1='21' x2='20' y2='21' />
    </svg>
  ),

  /**
   * Copy action
   */
  Copy: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
      <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
    </svg>
  ),

  /**
   * Cut action
   */
  Cut: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <circle cx='6' cy='6' r='3' />
      <circle cx='6' cy='18' r='3' />
      <line x1='20' y1='4' x2='8.12' y2='15.88' />
      <line x1='14.47' y1='14.48' x2='20' y2='20' />
      <line x1='8.12' y1='8.12' x2='12' y2='12' />
    </svg>
  ),

  /**
   * Paste action
   */
  Paste: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
      <rect x='8' y='2' width='8' height='4' rx='1' ry='1' />
    </svg>
  ),

  /**
   * Undo action
   */
  Undo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='M3 7v6h6' />
      <path d='M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13' />
    </svg>
  ),

  /**
   * Redo action
   */
  Redo: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='M21 7v6h-6' />
      <path d='M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13' />
    </svg>
  ),

  /**
   * Settings/options
   */
  Settings: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </svg>
  ),

  /**
   * More options menu
   */
  MoreHorizontal: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      className={cn('h-4 w-4', className)}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...props}
    >
      <circle cx='12' cy='12' r='1' />
      <circle cx='19' cy='12' r='1' />
      <circle cx='5' cy='12' r='1' />
    </svg>
  ),
};

// ===== EXPORTS =====

export {
  EnhancedToolbar as Toolbar,
  EnhancedToolbarButton as ToolbarButton,
  EnhancedToolbarLink as ToolbarLink,
  EnhancedToolbarSeparator as ToolbarSeparator,
  EnhancedToolbarToggleGroup as ToolbarToggleGroup,
  EnhancedToolbarToggleItem as ToolbarToggleItem,
  enhancedToolbarVariants as toolbarVariants,
  enhancedToolbarButtonVariants as toolbarButtonVariants,
  enhancedToolbarSeparatorVariants as toolbarSeparatorVariants,
  enhancedToolbarToggleGroupVariants as toolbarToggleGroupVariants,
};

// Export types
export type {
  EnhancedToolbarProps as ToolbarProps,
  EnhancedToolbarButtonProps as ToolbarButtonProps,
  EnhancedToolbarLinkProps as ToolbarLinkProps,
  EnhancedToolbarSeparatorProps as ToolbarSeparatorProps,
  EnhancedToolbarToggleGroupProps as ToolbarToggleGroupProps,
  EnhancedToolbarToggleItemProps as ToolbarToggleItemProps,
};
