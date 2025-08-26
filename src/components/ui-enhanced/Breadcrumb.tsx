/**
 * Enhanced Breadcrumb Component - MAPS v2.2 Dark-First Foundation
 *
 * Apple HIG-inspired navigation hierarchy with sophisticated visual patterns,
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
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { AccessibleIcon, Slot, VisuallyHidden } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED BREADCRUMB VARIANTS =====

const enhancedBreadcrumbVariants = cva(
  // Base styles - Apple HIG foundation
  [
    'flex items-center space-x-1 overflow-x-auto',
    'text-sm text-muted-foreground',
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
  ],
  {
    variants: {
      variant: {
        // Default: Clean navigation breadcrumb
        default: [
          'py-2',
        ],
        
        // Compact: Dense layout for limited space
        compact: [
          'py-1 text-xs space-x-0.5',
        ],
        
        // Pills: Rounded pill-style navigation
        pills: [
          'py-1 space-x-2',
        ],
        
        // Glass: Liquid glass material styling
        glass: [
          'py-2 px-3 rounded-lg',
          'bg-background/80 backdrop-blur-sm',
          'border border-border/20',
          'shadow-sm',
        ],
      },
      
      size: {
        sm: [
          'text-xs gap-1',
        ],
        md: [
          'text-sm gap-2',
        ],
        lg: [
          'text-base gap-3',
        ],
      },
      
      // Surface variants following MAPS v2.2 foundation
      surface: {
        elevated: [
          'bg-background-elevated',
        ],
        panel: [
          'bg-background-panel',
        ],
        glass: [
          'bg-background/80 backdrop-blur-sm',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      surface: 'elevated',
    },
  }
);

const enhancedBreadcrumbItemVariants = cva(
  // Base item styles - Apple HIG foundation
  [
    'inline-flex items-center',
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-1',
    'focus-visible:ring-offset-background',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-muted-foreground hover:text-foreground',
          'rounded-sm px-1 py-0.5',
        ],
        pills: [
          'text-muted-foreground hover:text-foreground',
          'rounded-full px-2 py-1',
          'hover:bg-muted/50',
        ],
        link: [
          'text-accent hover:text-accent-hover',
          'rounded-sm px-1 py-0.5',
          'hover:underline decoration-1 underline-offset-2',
        ],
      },
      
      isCurrentPage: {
        true: [
          'text-foreground font-medium',
          'cursor-default',
        ],
        false: [
          'cursor-pointer',
        ],
      },
      
      // AAA compliance enforcement
      enforceAAA: {
        false: '',
        true: [
          'aaa:text-accent-solid-aaa',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      isCurrentPage: false,
      enforceAAA: false,
    },
  }
);

const enhancedBreadcrumbSeparatorVariants = cva(
  // Base separator styles
  [
    'flex items-center justify-center',
    'text-muted-foreground/60',
    'select-none',
  ],
  {
    variants: {
      variant: {
        chevron: [
          'size-4',
        ],
        slash: [
          'text-base font-light',
        ],
        dot: [
          'size-1 rounded-full bg-muted-foreground/40',
        ],
      },
    },
    defaultVariants: {
      variant: 'chevron',
    },
  }
);

// ===== ENHANCED BREADCRUMB INTERFACES =====

interface EnhancedBreadcrumbProps
  extends React.ComponentProps<'nav'>,
    VariantProps<typeof enhancedBreadcrumbVariants> {
  asChild?: boolean;
  maxItems?: number;
  separator?: 'chevron' | 'slash' | 'dot' | React.ReactNode;
  homeIcon?: React.ReactNode;
  enforceAAA?: boolean;
  'data-testid'?: string;
}

interface EnhancedBreadcrumbListProps extends React.ComponentProps<'ol'> {
  asChild?: boolean;
}

interface EnhancedBreadcrumbItemProps
  extends React.ComponentProps<'li'>,
    VariantProps<typeof enhancedBreadcrumbItemVariants> {
  asChild?: boolean;
  href?: string;
  to?: string;
  isCurrentPage?: boolean;
  'data-testid'?: string;
}

interface EnhancedBreadcrumbLinkProps extends React.ComponentProps<'a'> {
  asChild?: boolean;
  isCurrentPage?: boolean;
  enforceAAA?: boolean;
}

interface EnhancedBreadcrumbPageProps extends React.ComponentProps<'span'> {
  asChild?: boolean;
}

interface EnhancedBreadcrumbSeparatorProps
  extends React.ComponentProps<'li'>,
    VariantProps<typeof enhancedBreadcrumbSeparatorVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
}

interface EnhancedBreadcrumbEllipsisProps extends React.ComponentProps<'span'> {
  asChild?: boolean;
}

// ===== ENHANCED BREADCRUMB COMPONENTS =====

/**
 * Enhanced Breadcrumb - Navigation hierarchy component
 * 
 * MAPS v2.2 Implementation:
 * - Apple HIG navigation patterns
 * - Dark-first foundation styling
 * - AAA accessibility compliance
 * - Liquid glass materials support
 * - Platform-aware responsive design
 */
const EnhancedBreadcrumb = React.forwardRef<
  HTMLElement,
  EnhancedBreadcrumbProps
>(
  (
    {
      asChild = false,
      variant = 'default',
      size = 'md',
      surface = 'elevated',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maxItems: _unused_maxItems,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars  
      separator: _unused_separator = 'chevron',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      homeIcon: _unused_homeIcon,
      enforceAAA = false,
      className,
      children,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'nav';

    return (
      <Comp
        ref={ref}
        aria-label="Breadcrumb navigation"
        className={cn(
          enhancedBreadcrumbVariants({
            variant,
            size,
            surface,
          }),
          className
        )}
        data-aaa={enforceAAA ? 'true' : 'false'}
        data-testid={testId}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

EnhancedBreadcrumb.displayName = 'EnhancedBreadcrumb';

/**
 * Enhanced Breadcrumb List - Semantic list container
 */
const EnhancedBreadcrumbList = React.forwardRef<
  HTMLOListElement,
  EnhancedBreadcrumbListProps
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'ol';

  return (
    <Comp
      ref={ref}
      className={cn('flex flex-wrap items-center gap-1.5 break-words', className)}
      {...props}
    />
  );
});

EnhancedBreadcrumbList.displayName = 'EnhancedBreadcrumbList';

/**
 * Enhanced Breadcrumb Item - Individual breadcrumb container
 */
const EnhancedBreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  EnhancedBreadcrumbItemProps
>(
  (
    {
      asChild = false,
      variant = 'default',
      isCurrentPage = false,
      enforceAAA = false,
      className,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'li';

    return (
      <Comp
        ref={ref}
        className={cn(
          enhancedBreadcrumbItemVariants({
            variant,
            isCurrentPage,
            enforceAAA,
          }),
          className
        )}
        aria-current={isCurrentPage ? 'page' : undefined}
        data-testid={testId}
        {...props}
      />
    );
  }
);

EnhancedBreadcrumbItem.displayName = 'EnhancedBreadcrumbItem';

/**
 * Enhanced Breadcrumb Link - Interactive breadcrumb link
 */
const EnhancedBreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  EnhancedBreadcrumbLinkProps
>(
  (
    {
      asChild = false,
      isCurrentPage = false,
      enforceAAA = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'a';

    if (isCurrentPage) {
      return (
        <span
          className={cn(
            'font-medium text-foreground',
            'cursor-default',
            className
          )}
          aria-current="page"
        >
          {children}
        </span>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5',
          'text-muted-foreground hover:text-foreground',
          'transition-colors duration-200',
          'motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-1',
          'focus-visible:ring-offset-background',
          'rounded-sm px-1 py-0.5',
          enforceAAA && 'aaa:text-accent-solid-aaa',
          className
        )}
        data-aaa={enforceAAA ? 'true' : 'false'}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

EnhancedBreadcrumbLink.displayName = 'EnhancedBreadcrumbLink';

/**
 * Enhanced Breadcrumb Page - Current page indicator
 */
const EnhancedBreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  EnhancedBreadcrumbPageProps
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        'font-medium text-foreground',
        'px-1 py-0.5 rounded-sm',
        className
      )}
      {...props}
    />
  );
});

EnhancedBreadcrumbPage.displayName = 'EnhancedBreadcrumbPage';

/**
 * Enhanced Breadcrumb Separator - Visual separator between items
 */
const EnhancedBreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  EnhancedBreadcrumbSeparatorProps
>(
  (
    {
      asChild = false,
      variant = 'chevron',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'li';

    return (
      <Comp
        ref={ref}
        role="presentation"
        className={cn(
          enhancedBreadcrumbSeparatorVariants({ variant }),
          className
        )}
        {...props}
      >
        {children || (
          <>
            {variant === 'chevron' && (
              <AccessibleIcon label="Breadcrumb separator">
                <ChevronRight className="size-4" />
              </AccessibleIcon>
            )}
            {variant === 'slash' && <span>/</span>}
            {variant === 'dot' && <span className="size-1 rounded-full bg-muted-foreground/40" />}
          </>
        )}
      </Comp>
    );
  }
);

EnhancedBreadcrumbSeparator.displayName = 'EnhancedBreadcrumbSeparator';

/**
 * Enhanced Breadcrumb Ellipsis - Collapsed items indicator
 */
const EnhancedBreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  EnhancedBreadcrumbEllipsisProps
>(({ asChild = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      ref={ref}
      role="presentation"
      className={cn(
        'flex items-center justify-center',
        'size-9 text-muted-foreground/60',
        className
      )}
      {...props}
    >
      <AccessibleIcon label="More pages">
        <MoreHorizontal className="size-4" />
      </AccessibleIcon>
      <VisuallyHidden>More pages</VisuallyHidden>
    </Comp>
  );
});

EnhancedBreadcrumbEllipsis.displayName = 'EnhancedBreadcrumbEllipsis';

// ===== BREADCRUMB FACTORY FUNCTIONS =====

/**
 * Factory function for creating semantic breadcrumb configurations
 */
export const BreadcrumbFactory = {
  /**
   * Create a navigation breadcrumb
   */
  navigation: (props: Partial<EnhancedBreadcrumbProps> = {}) => ({
    variant: 'default' as const,
    size: 'md' as const,
    separator: 'chevron' as const,
    ...props,
  }),

  /**
   * Create a compact breadcrumb for mobile
   */
  compact: (props: Partial<EnhancedBreadcrumbProps> = {}) => ({
    variant: 'compact' as const,
    size: 'sm' as const,
    separator: 'slash' as const,
    maxItems: 3,
    ...props,
  }),

  /**
   * Create a glass-style breadcrumb
   */
  glass: (props: Partial<EnhancedBreadcrumbProps> = {}) => ({
    variant: 'glass' as const,
    surface: 'glass' as const,
    separator: 'dot' as const,
    ...props,
  }),

  /**
   * Create an AAA compliant breadcrumb
   */
  accessible: (props: Partial<EnhancedBreadcrumbProps> = {}) => ({
    variant: 'default' as const,
    enforceAAA: true,
    separator: 'chevron' as const,
    ...props,
  }),
};

/**
 * Utility functions for breadcrumb management
 */
export const createHomeBreadcrumb = (
  href: string = '/',
  label: string = 'Home',
  icon?: React.ReactNode
) => ({
  href,
  label,
  icon: icon || <Home className="size-4" />,
  isHome: true,
});

export const createBreadcrumbPath = (
  items: Array<{ href: string; label: string; icon?: React.ReactNode }>
) => {
  return items.map((item, index) => ({
    ...item,
    isCurrentPage: index === items.length - 1,
  }));
};

export const truncateBreadcrumb = (
  items: Array<{ href: string; label: string }>,
  maxItems: number = 3
) => {
  if (items.length <= maxItems) return items;
  
  const first = items[0];
  const last = items.at(-1);
  const remaining = items.slice(1, -1);
  
  if (maxItems === 3) {
    return [first, { href: '#', label: '...', isEllipsis: true }, last];
  }
  
  const showCount = maxItems - 2;
  const truncatedRemaining = remaining.slice(-showCount);
  
  return [
    first,
    ...(remaining.length > showCount ? [{ href: '#', label: '...', isEllipsis: true }] : []),
    ...truncatedRemaining,
    last,
  ];
};

// ===== EXPORTS =====

export {
  EnhancedBreadcrumb,
  EnhancedBreadcrumbList,
  EnhancedBreadcrumbItem,
  EnhancedBreadcrumbLink,
  EnhancedBreadcrumbPage,
  EnhancedBreadcrumbSeparator,
  EnhancedBreadcrumbEllipsis,
  enhancedBreadcrumbVariants,
  enhancedBreadcrumbItemVariants,
  enhancedBreadcrumbSeparatorVariants,
};

// ===== TYPE EXPORTS =====

export type BreadcrumbVariantProps = VariantProps<typeof enhancedBreadcrumbVariants>;

export type {
  EnhancedBreadcrumbProps,
  EnhancedBreadcrumbListProps,
  EnhancedBreadcrumbItemProps,
  EnhancedBreadcrumbLinkProps,
  EnhancedBreadcrumbPageProps,
  EnhancedBreadcrumbSeparatorProps,
  EnhancedBreadcrumbEllipsisProps,
};
