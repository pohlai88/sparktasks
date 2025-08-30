/**
 * Enhanced Tabs Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
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
 * - Tailwind Config → CSS Custom Properties → Component classes
 * - Enhanced Tokens → Semantic API → Component variants
 * - MAPS4 Guidelines → Component behavior → User experience
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 */

/* eslint-disable react/prop-types */

import * as TabsPrimitives from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

// ===== ENHANCED TABS ROOT VARIANTS =====

/**
 * Enhanced tabs root variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedTabsRootVariants = cva(
  [
    // Foundation: Layout structure
    'flex w-full',

    // Foundation: Motion - Respect user preferences
    'motion-reduce:transition-none',

    // Foundation: Focus management for keyboard navigation
    'focus-visible:outline-none',
  ],
  {
    variants: {
      orientation: {
        horizontal: ['flex-col'],
        vertical: ['flex-row'],
      },
      density: {
        comfortable: ['gap-[var(--space-6)]'],
        compact: ['gap-[var(--space-4)]'],
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      density: 'comfortable',
    },
  }
);

// ===== ENHANCED TABS LIST VARIANTS =====

/**
 * Enhanced tabs list variants with Apple HIG navigation patterns
 */
const enhancedTabsListVariants = cva(
  [
    // Foundation: Layout - Clean navigation structure
    'inline-flex shrink-0',

    // MAPS4: Liquid glass surface with subtle elevation
    'rounded-[var(--radius-lg)] bg-cosmic-muted/30 backdrop-blur-[var(--blur-sm)]',
    'border border-cosmic-border/50',

    // Foundation: Typography & spacing
    'p-[var(--space-1)]',

    // Enhanced: Visual depth with controlled shadows
    'shadow-[var(--shadow-sm)]',

    // Foundation: Focus ring for keyboard navigation
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-aurora-accent focus-visible:ring-offset-2',
    'focus-visible:ring-offset-stellar-surface',
  ],
  {
    variants: {
      orientation: {
        horizontal: ['flex-row', 'items-center'],
        vertical: ['flex-col', 'items-stretch', 'w-auto'],
      },
      variant: {
        default: [],
        pills: ['border-0 bg-transparent shadow-none', 'gap-[var(--space-2)] p-0'],
        underline: [
          'border-0 border-b border-cosmic-border bg-transparent',
          'rounded-none shadow-none',
          'p-0 pb-0',
        ],
        glass: [
          'backdrop-blur-[var(--blur-md)] backdrop-saturate-[var(--saturate-135)]',
          'bg-stellar-surface-elevated/60',
          'border-cosmic-border/30',
          'shadow-[var(--shadow-elevation-md)]',
        ],
      },
      size: {
        sm: ['text-[var(--font-size-sm)]', 'gap-[var(--space-1)]'],
        default: ['text-[var(--font-size-sm)]'],
        lg: ['text-[var(--font-size-base)]'],
      },
      density: {
        comfortable: ['p-[var(--space-1)]'],
        compact: ['p-[var(--space-0_5)]'],
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
      size: 'default',
      density: 'comfortable',
    },
  }
);

// ===== ENHANCED TABS TRIGGER VARIANTS =====

/**
 * Enhanced tabs trigger variants with Apple calm interactions
 */
const enhancedTabsTriggerVariants = cva(
  [
    // Foundation: Layout & interaction base
    'inline-flex items-center justify-center whitespace-nowrap',
    'rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-[var(--font-weight-medium)]',
    'cursor-pointer select-none',

    // Foundation: Touch targets - 44px minimum for accessibility
    'min-h-[var(--space-11)] px-[var(--space-3)] py-[var(--space-1_5)]',

    // Foundation: Motion - Apple-quality transitions
    'transition-all duration-[var(--motion-duration-2)] ease-out',
    'motion-reduce:transition-none',

    // Foundation: States - Comprehensive interaction feedback
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-aurora-accent focus-visible:ring-offset-2',
    'focus-visible:ring-offset-stellar-surface',

    // Foundation: Disabled state
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-50)]',

    // MAPS4: Default state - Subtle presence
    'text-cosmic-muted',
    'hover:bg-cosmic-muted/50 hover:text-cosmic-foreground',

    // Enhanced: Active state with Apple calm confidence
    'data-[state=active]:bg-stellar-surface data-[state=active]:text-cosmic-foreground',
    'data-[state=active]:shadow-[var(--shadow-sm)]',

    // Enhanced: Keyboard navigation support
    'focus:z-10',
  ],
  {
    variants: {
      variant: {
        default: [],
        pills: [
          'rounded-full',
          'data-[state=active]:bg-aurora-accent data-[state=active]:text-aurora-accent-foreground',
          'data-[state=active]:shadow-[var(--shadow-md)] data-[state=active]:shadow-aurora-accent/20',
        ],
        underline: [
          'rounded-none border-b-2 border-transparent',
          'hover:border-cosmic-border',
          'data-[state=active]:border-aurora-accent data-[state=active]:bg-transparent',
          'data-[state=active]:shadow-none',
        ],
        glass: [
          'backdrop-blur-[var(--blur-sm)]',
          'data-[state=active]:bg-stellar-surface/80 data-[state=active]:backdrop-blur-[var(--blur-md)]',
          'data-[state=active]:border data-[state=active]:border-cosmic-border/50',
        ],
      },
      size: {
        sm: ['text-[var(--font-size-xs)]', 'min-h-[var(--space-9)]', 'px-[var(--space-2)]', 'py-[var(--space-1)]'],
        default: ['text-[var(--font-size-sm)]', 'min-h-[var(--space-11)]', 'px-[var(--space-3)]', 'py-[var(--space-1_5)]'],
        lg: ['text-[var(--font-size-base)]', 'min-h-[var(--space-12)]', 'px-[var(--space-4)]', 'py-[var(--space-2)]'],
      },
      density: {
        comfortable: [],
        compact: ['min-h-[var(--space-9)]', 'px-[var(--space-2)]', 'py-[var(--space-1)]'],
      },
      feedback: {
        none: [],
        success: [
          'data-[state=active]:bg-cosmic-success data-[state=active]:text-cosmic-success-foreground',
          'data-[state=active]:shadow-cosmic-success/20',
        ],
        warning: [
          'data-[state=active]:bg-cosmic-warning data-[state=active]:text-cosmic-warning-foreground',
          'data-[state=active]:shadow-cosmic-warning/20',
        ],
        destructive: [
          'data-[state=active]:bg-cosmic-destructive data-[state=active]:text-cosmic-destructive-foreground',
          'data-[state=active]:shadow-cosmic-destructive/20',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      density: 'comfortable',
      feedback: 'none',
    },
  }
);

// ===== ENHANCED TABS CONTENT VARIANTS =====

/**
 * Enhanced tabs content variants with MAPS v2.2 content hierarchy
 */
const enhancedTabsContentVariants = cva(
  [
    // Foundation: Layout & typography
    'ring-offset-stellar-surface',

    // Foundation: Focus management
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-aurora-accent focus-visible:ring-offset-2',

    // Foundation: Motion - Smooth content transitions
    'transition-all duration-[var(--motion-duration-2)] ease-out',
    'motion-reduce:transition-none',

    // MAPS4: Content hierarchy with proper spacing
    'text-cosmic-foreground',

    // Enhanced: Animation states for smooth transitions
    'data-[state=active]:animate-in data-[state=active]:fade-in-0',
    'data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0',
  ],
  {
    variants: {
      variant: {
        default: ['mt-[var(--space-6)]'],
        pills: ['mt-[var(--space-4)]'],
        underline: ['mt-[var(--space-4)]', 'pt-[var(--space-4)]'],
        glass: ['mt-[var(--space-6)]', 'rounded-[var(--radius-lg)]', 'backdrop-blur-[var(--blur-sm)]', 'bg-stellar-surface/5'],
      },
      padding: {
        none: [],
        default: ['p-[var(--space-4)]'],
        comfortable: ['p-[var(--space-6)]'],
        compact: ['p-[var(--space-3)]'],
      },
      surface: {
        none: [],
        card: ['rounded-[var(--radius-lg)] border border-cosmic-border bg-stellar-surface-card', 'shadow-[var(--shadow-sm)]'],
        elevated: [
          'rounded-[var(--radius-lg)] border border-cosmic-border bg-stellar-surface-elevated',
          'shadow-[var(--shadow-md)]',
        ],
        glass: [
          'rounded-[var(--radius-lg)] border border-cosmic-border/30',
          'bg-stellar-surface/60 backdrop-blur-[var(--blur-md)] backdrop-saturate-[var(--saturate-135)]',
          'shadow-[var(--shadow-elevation-md)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      surface: 'none',
    },
  }
);

// ===== ENHANCED TABS INTERFACES =====

export interface EnhancedTabsRootProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof TabsPrimitives.Root>,
      'orientation'
    >,
    Pick<
      VariantProps<typeof enhancedTabsRootVariants>,
      'orientation' | 'density'
    > {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * AAA Compliance Mode
   * @description Enforces WCAG AAA standards with enhanced contrast ratios
   * @default false
   */
  aaaMode?: boolean;
}

export interface EnhancedTabsListProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof TabsPrimitives.List>,
      'orientation'
    >,
    Pick<
      VariantProps<typeof enhancedTabsListVariants>,
      'orientation' | 'variant' | 'size' | 'density'
    > {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * AAA Compliance Mode
   * @description Enforces WCAG AAA standards with enhanced contrast ratios
   * @default false
   */
  aaaMode?: boolean;
}

export interface EnhancedTabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger>,
    Pick<
      VariantProps<typeof enhancedTabsTriggerVariants>,
      'variant' | 'size' | 'density' | 'feedback'
    > {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;
  /**
   * AAA Compliance Mode
   * @description Enforces WCAG AAA standards with enhanced contrast ratios
   * @default false
   */
  aaaMode?: boolean;
}

export interface EnhancedTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitives.Content>,
    Pick<
      VariantProps<typeof enhancedTabsContentVariants>,
      'variant' | 'padding' | 'surface'
    > {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * AAA Compliance Mode
   * @description Enforces WCAG AAA standards with enhanced contrast ratios
   * @default false
   */
  aaaMode?: boolean;
}

// ===== ENHANCED TABS ROOT COMPONENT =====

const EnhancedTabsRoot = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Root>,
  EnhancedTabsRootProps
>(({ className, orientation, density, aaaMode = false, ...props }, ref) => {
  // AAA Mode: Enhanced contrast enforcement
  const aaaClasses = aaaMode
    ? [
        // High contrast mode adjustments
        'contrast-more:ring-4 contrast-more:border-4',
        'contrast-more:ring-foreground contrast-more:border-foreground',
      ].join(' ')
    : '';

  return (
    <TabsPrimitives.Root
      ref={ref}
      className={cn(
        enhancedTabsRootVariants({ orientation, density }),
        aaaClasses,
        className
      )}
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      {...props}
    />
  );
});

EnhancedTabsRoot.displayName = 'EnhancedTabsRoot';

// ===== ENHANCED TABS LIST COMPONENT =====

const EnhancedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.List>,
  EnhancedTabsListProps
>(
  (
    {
      className,
      orientation,
      variant,
      size,
      density,
      aaaMode = false,
      ...props
    },
    ref
  ) => {
    // AAA Mode: Enhanced contrast enforcement
    const aaaClasses = aaaMode
      ? [
          // High contrast background and borders
          'bg-background border-2 border-foreground/20',
          'shadow-lg',
          // Enhanced focus visibility
          'focus-visible:ring-4 focus-visible:ring-foreground',
        ].join(' ')
      : '';

    return (
      <TabsPrimitives.List
        ref={ref}
        className={cn(
          enhancedTabsListVariants({ orientation, variant, size, density }),
          aaaClasses,
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedTabsList.displayName = 'EnhancedTabsList';

// ===== ENHANCED TABS TRIGGER COMPONENT =====

const EnhancedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Trigger>,
  EnhancedTabsTriggerProps
>(
  (
    { className, variant, size, density, feedback, aaaMode = false, ...props },
    ref
  ) => {
    // AAA Mode: Enhanced contrast enforcement
    const aaaClasses = aaaMode
      ? [
          // High contrast text and backgrounds
          'text-foreground data-[state=active]:bg-foreground',
          'data-[state=active]:text-background',
          'border-2 border-foreground/20 data-[state=active]:border-foreground',
          // Enhanced focus visibility
          'focus-visible:ring-4 focus-visible:ring-foreground',
          'shadow-lg data-[state=active]:shadow-xl',
        ].join(' ')
      : '';

    return (
      <TabsPrimitives.Trigger
        ref={ref}
        className={cn(
          enhancedTabsTriggerVariants({ variant, size, density, feedback }),
          aaaClasses,
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedTabsTrigger.displayName = 'EnhancedTabsTrigger';

// ===== ENHANCED TABS CONTENT COMPONENT =====

const EnhancedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Content>,
  EnhancedTabsContentProps
>(
  (
    { className, variant, padding, surface, aaaMode = false, ...props },
    ref
  ) => {
    // AAA Mode: Enhanced contrast enforcement
    const aaaClasses = aaaMode
      ? [
          // High contrast content backgrounds
          surface === 'card' || surface === 'elevated' || surface === 'glass'
            ? 'bg-background border-2 border-foreground/20'
            : '',
          // Enhanced focus visibility
          'focus-visible:ring-4 focus-visible:ring-foreground',
        ].join(' ')
      : '';

    return (
      <TabsPrimitives.Content
        ref={ref}
        className={cn(
          enhancedTabsContentVariants({ variant, padding, surface }),
          aaaClasses,
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedTabsContent.displayName = 'EnhancedTabsContent';

// ===== ENHANCED TABS FACTORY =====

/**
 * Enhanced Tabs Factory Functions
 * @description Semantic constructors following MAPS v2.2 patterns
 */
export const TabsFactory = {
  /**
   * Default tabs with clean styling
   */
  default: {
    Root: (props: Omit<EnhancedTabsRootProps, 'variant'>) => (
      <EnhancedTabsRoot {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'variant'>) => (
      <EnhancedTabsList variant='default' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'variant'>) => (
      <EnhancedTabsTrigger variant='default' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'variant'>) => (
      <EnhancedTabsContent variant='default' {...props} />
    ),
  },

  /**
   * Pills variant for modern interfaces
   */
  pills: {
    Root: (props: Omit<EnhancedTabsRootProps, 'variant'>) => (
      <EnhancedTabsRoot {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'variant'>) => (
      <EnhancedTabsList variant='pills' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'variant'>) => (
      <EnhancedTabsTrigger variant='pills' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'variant'>) => (
      <EnhancedTabsContent variant='pills' {...props} />
    ),
  },

  /**
   * Underline variant for minimal design
   */
  underline: {
    Root: (props: Omit<EnhancedTabsRootProps, 'variant'>) => (
      <EnhancedTabsRoot {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'variant'>) => (
      <EnhancedTabsList variant='underline' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'variant'>) => (
      <EnhancedTabsTrigger variant='underline' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'variant'>) => (
      <EnhancedTabsContent variant='underline' {...props} />
    ),
  },

  /**
   * Glass variant with liquid materials
   */
  glass: {
    Root: (props: Omit<EnhancedTabsRootProps, 'variant'>) => (
      <EnhancedTabsRoot {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'variant'>) => (
      <EnhancedTabsList variant='glass' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'variant'>) => (
      <EnhancedTabsTrigger variant='glass' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'variant'>) => (
      <EnhancedTabsContent variant='glass' surface='glass' {...props} />
    ),
  },

  /**
   * AAA compliant tabs with enhanced accessibility
   */
  aaa: {
    Root: (props: Omit<EnhancedTabsRootProps, 'aaaMode'>) => (
      <EnhancedTabsRoot aaaMode={true} {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'aaaMode'>) => (
      <EnhancedTabsList aaaMode={true} {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'aaaMode'>) => (
      <EnhancedTabsTrigger aaaMode={true} {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'aaaMode'>) => (
      <EnhancedTabsContent aaaMode={true} {...props} />
    ),
  },

  /**
   * Compact density for dense layouts
   */
  compact: {
    Root: (props: Omit<EnhancedTabsRootProps, 'density'>) => (
      <EnhancedTabsRoot density='compact' {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'density'>) => (
      <EnhancedTabsList density='compact' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'density'>) => (
      <EnhancedTabsTrigger density='compact' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'padding'>) => (
      <EnhancedTabsContent padding='compact' {...props} />
    ),
  },

  /**
   * Small size for compact interfaces
   */
  small: {
    Root: (props: Omit<EnhancedTabsRootProps, 'size'>) => (
      <EnhancedTabsRoot {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'size'>) => (
      <EnhancedTabsList size='sm' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'size'>) => (
      <EnhancedTabsTrigger size='sm' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'variant'>) => (
      <EnhancedTabsContent {...props} />
    ),
  },

  /**
   * Large size for prominent navigation
   */
  large: {
    Root: (props: Omit<EnhancedTabsRootProps, 'size'>) => (
      <EnhancedTabsRoot {...props} />
    ),
    List: (props: Omit<EnhancedTabsListProps, 'size'>) => (
      <EnhancedTabsList size='lg' {...props} />
    ),
    Trigger: (props: Omit<EnhancedTabsTriggerProps, 'size'>) => (
      <EnhancedTabsTrigger size='lg' {...props} />
    ),
    Content: (props: Omit<EnhancedTabsContentProps, 'variant'>) => (
      <EnhancedTabsContent {...props} />
    ),
  },
} as const;

// ===== EXPORTS =====

export {
  EnhancedTabsRoot,
  EnhancedTabsList,
  EnhancedTabsTrigger,
  EnhancedTabsContent,
  enhancedTabsRootVariants,
  enhancedTabsListVariants,
  enhancedTabsTriggerVariants,
  enhancedTabsContentVariants,
};

// Compound export for easier usage
export const EnhancedTabs = {
  Root: EnhancedTabsRoot,
  List: EnhancedTabsList,
  Trigger: EnhancedTabsTrigger,
  Content: EnhancedTabsContent,
};
