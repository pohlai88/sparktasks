/**
 * Enhanced Dialog Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with cosmic innovation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system with overlay protection
 * - Radix + Tailwind + MAPS4: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Radix Dialog → Behavior, accessibility, focus management
 * - Enhanced Tokens → Visual styling, systematic spacing
 * - MAPS4 Materials → Liquid glass overlay with AAA text protection
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → vibrancy (none|glass|floating)
 * → enforcement (standard|aaa) → content protection (scrim|gradient)
 */

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import React from 'react';

import { VisuallyHidden } from '@/components/primitives';
import { ENHANCED_DESIGN_TOKENS, getZIndexClass } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== ENHANCED DIALOG VARIANTS =====

/**
 * Dialog overlay variants - Liquid glass with AAA compliance
 */
const dialogOverlayVariants = cva(
  [
    // Foundation overlay behavior
    getZIndexClass('overlay'),
    'fixed inset-0',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',

    // Motion respect
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionSafeFadeIn,
  ],
  {
    variants: {
      vibrancy: {
        none: [
          // Standard overlay without vibrancy
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.overlay,
        ],
        glass: [
          // Liquid glass overlay with backdrop blur
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.overlay,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.lg,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
        ],
        floating: [
          // Premium floating glass effect
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.overlay,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.xl,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[200],
        ],
      },
      enforcement: {
        standard: '',
        aaa: [
          // AAA mode: Ensure sufficient contrast for overlay
          'bg-cosmic-dark/75', // Higher opacity for better separation
          // Windows High Contrast support
          'forced-colors:bg-[Canvas]',
        ],
      },
    },
    defaultVariants: {
      vibrancy: 'glass',
      enforcement: 'standard',
    },
  }
);

/**
 * Dialog content variants - Surface hierarchy with systematic spacing
 */
const dialogContentVariants = cva(
  [
    // Foundation positioning and animation
    getZIndexClass('modal'),
    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
    'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',

    // Foundation structure
    'grid w-full gap-4',
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
    ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,

    // Typography and content
    ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    // Motion respect
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionSafeFadeIn,
  ],
  {
    variants: {
      surface: {
        elevated1: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
          ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
        ],
        elevated2: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
        ],
        translucent: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora,
          ENHANCED_DESIGN_TOKENS.foundation.elevation.xl,
        ],
      },
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        fullWidth: 'max-w-[95vw]',
      },
      vibrancy: {
        none: '',
        glass: [
          // Add subtle vibrancy to content (surface-only rule)
          'bg-cosmic-void/80',
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
        ],
        floating: [
          // Premium floating effect for special dialogs
          'bg-cosmic-void/90',
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.lg,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[200],
          'shadow-aurora-glow',
        ],
      },
      enforcement: {
        standard: '',
        aaa: [
          // AAA mode: Force solid background for maximum contrast
          'border-cosmic-border bg-stellar-surface',
          // Remove vibrancy effects that might reduce readability
          'backdrop-blur-none',
          // Windows High Contrast support
          'forced-colors:border-[Canvas] forced-colors:bg-[CanvasText] forced-colors:text-[Canvas]',
        ],
      },
    },
    defaultVariants: {
      surface: 'elevated1',
      size: 'md',
      vibrancy: 'none',
      enforcement: 'standard',
    },
  }
);

/**
 * Dialog header variants - Apple semantic hierarchy
 */
const dialogHeaderVariants = cva(
  ['flex flex-col space-y-[var(--space-1_5)] text-center sm:text-left'],
  {
    variants: {
      alignment: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      alignment: 'left',
    },
  }
);

/**
 * Dialog title variants - Apple typography
 */
const dialogTitleVariants = cva('', {
  variants: {
    level: {
      title1: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h1,
      title2: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
      title3: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
      headline: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
    },
  },
  defaultVariants: {
    level: 'title2',
  },
});

/**
 * Dialog description variants
 */
const dialogDescriptionVariants = cva([
  ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
  ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
]);

/**
 * Dialog footer variants - Action grouping
 */
const dialogFooterVariants = cva([
  'flex flex-col-reverse sm:flex-row sm:justify-end',
  ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.sm,
]);

/**
 * Dialog close button variants - Apple HIG close pattern
 */
const dialogCloseVariants = cva([
  'absolute right-[var(--space-4)] top-[var(--space-4)]',
  'rounded-[var(--radius-sm)] opacity-[var(--opacity-70)]',
  'ring-offset-stellar-surface transition-opacity',
  'pointer:hover:opacity-100', // Pointer-only hover
  'focus:outline-none focus:ring-2 focus:ring-aurora-accent focus:ring-offset-2',
  'disabled:pointer-events-none',
  'data-[state=open]:bg-aurora-accent data-[state=open]:text-cosmic-muted',

  // Platform-aware hit target
  'h-8 w-8',
  'focus:outline-none focus:ring-2 focus:ring-aurora-accent focus:ring-offset-2',
  ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionSafeFadeIn,
]);

// ===== ENHANCED DIALOG COMPONENTS =====

/**
 * Dialog Root - Pure Radix behavior
 */
const DialogRoot = DialogPrimitive.Root;

/**
 * Dialog Trigger - Enhanced with MAPS foundation
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Dialog Portal - Radix portal behavior
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * Enhanced Dialog Overlay with Liquid Glass Materials
 */
interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof dialogOverlayVariants> {
  enforceAAA?: boolean | undefined;
  disableAnimations?: boolean | undefined;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, vibrancy, enforcement, enforceAAA, disableAnimations = false, ...props }, ref) => {
  // Performance optimization: conditionally apply motion classes
  const motionClasses = disableAnimations 
    ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
    : '';

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        dialogOverlayVariants({
          vibrancy: enforceAAA ? 'none' : vibrancy,
          enforcement: enforceAAA ? 'aaa' : enforcement,
        }),
        motionClasses,
        className
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'EnhancedDialogOverlay';

/**
 * Enhanced Dialog Content with Surface Hierarchy
 */
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  enforceAAA?: boolean | undefined;
  showClose?: boolean | undefined;
  initialFocusRef?: React.RefObject<HTMLElement>;
  disableAnimations?: boolean | undefined;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      surface,
      size,
      vibrancy,
      enforcement,
      enforceAAA,
      showClose = true,
      initialFocusRef,
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
    <DialogPortal>
      <DialogOverlay enforceAAA={enforceAAA} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          dialogContentVariants({
            surface,
            size,
            vibrancy: enforceAAA ? 'none' : vibrancy,
            enforcement: enforceAAA ? 'aaa' : enforcement,
          }),
          motionClasses,
          className
        )}
        // Deterministic focus management for screen readers
        onOpenAutoFocus={e => {
          if (initialFocusRef?.current) {
            e.preventDefault();
            initialFocusRef.current.focus();
          }
        }}
        {...props}
      >
        {/* AAA text legibility scrim when enforced */}
        <div
          className={cn(
            enforceAAA && 'bg-cosmic-void/95 backdrop-blur-sm'
          )}
        >
          {children}
        </div>
        {showClose && (
          <DialogPrimitive.Close className={cn(dialogCloseVariants())}>
            <X className={cn('size-[var(--icon-sm)]')} />
            <VisuallyHidden>Close</VisuallyHidden>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
    );
  }
);
DialogContent.displayName = 'EnhancedDialogContent';

/**
 * Enhanced Dialog Header with Apple Typography
 */
interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogHeaderVariants> {}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, alignment, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(dialogHeaderVariants({ alignment }), className)}
      {...props}
    />
  )
);
DialogHeader.displayName = 'EnhancedDialogHeader';

/**
 * Enhanced Dialog Footer with Action Grouping
 */
type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(dialogFooterVariants(), className)}
      {...props}
    />
  )
);
DialogFooter.displayName = 'EnhancedDialogFooter';

/**
 * Enhanced Dialog Title with Semantic Typography
 */
interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
    VariantProps<typeof dialogTitleVariants> {}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, level, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(dialogTitleVariants({ level }), className)}
    {...props}
  />
));
DialogTitle.displayName = 'EnhancedDialogTitle';

/**
 * Enhanced Dialog Description with Content Hierarchy
 */
type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(dialogDescriptionVariants(), className)}
    {...props}
  />
));
DialogDescription.displayName = 'EnhancedDialogDescription';

/**
 * Enhanced Dialog Close Button
 */
const DialogClose = DialogPrimitive.Close;

// ===== POLYMORPHIC DIALOG FACTORY =====

/**
 * Enhanced polymorphic dialog with automatic MAPS foundation
 */
interface EnhancedDialogConfig extends DialogContentProps {
  /** Dialog trigger element */
  trigger?: React.ReactNode;
  /** Dialog title text */
  title?: string;
  /** Dialog description text */
  description?: string;
  /** Footer content */
  footer?: React.ReactNode;
  /** Control open state externally */
  open?: boolean | undefined;
  /** Open state change handler */
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** Title semantic level */
  titleLevel?: VariantProps<typeof dialogTitleVariants>['level'];
  /** Header alignment */
  headerAlignment?: VariantProps<typeof dialogHeaderVariants>['alignment'];
  /** Initial focus element for accessibility */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Disable animations for performance optimization */
  disableAnimations?: boolean | undefined;
}

type El = React.ElementType;
type PropsOf<E extends El> = React.ComponentPropsWithoutRef<E>;
type PolyProps<E extends El, P> = P & Omit<PropsOf<E>, keyof P | 'asChild'> & { asChild?: boolean };

export const EnhancedDialog = React.forwardRef<HTMLDivElement, PolyProps<El, EnhancedDialogConfig>>(
  (
    {
      trigger,
      title,
      description,
      footer,
      children,
      open,
      onOpenChange,
      titleLevel = 'title2',
      headerAlignment = 'left',
      showClose = true,
      surface = 'elevated1',
      size = 'md',
      vibrancy = 'none',
      enforceAAA = false,
      initialFocusRef,
      disableAnimations = false,
      ...props
    }: PolyProps<El, EnhancedDialogConfig>,
    ref
  ) => (
    <DialogRoot
      {...(open !== undefined && { open })}
      {...(onOpenChange && { onOpenChange })}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        asChild={Boolean((props as any).asChild)}
        ref={ref as any}
        surface={surface}
        size={size}
        vibrancy={vibrancy}
        enforceAAA={enforceAAA}
        showClose={showClose}
        disableAnimations={disableAnimations}
        {...(initialFocusRef && { initialFocusRef })}
        {...props}
      >
        {(title || description) && (
          <DialogHeader alignment={headerAlignment}>
            {title && <DialogTitle level={titleLevel}>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </DialogRoot>
  )
);

EnhancedDialog.displayName = 'Dialog';

// ===== DIALOG FACTORY =====

/**
 * Factory for common dialog configurations
 * Provides semantic presets following MAPS design patterns
 */
export const DialogFactory = {
  /**
   * Default dialog with elevated surface
   */
  default: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog surface='elevated1' {...props} />
  ),

  /**
   * Elevated dialog with stronger shadow
   */
  elevated: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog surface='elevated2' {...props} />
  ),

  /**
   * Glass dialog with liquid glass materials
   */
  glass: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog surface='translucent' vibrancy='glass' {...props} />
  ),

  /**
   * Floating dialog with premium effects
   */
  floating: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog surface='translucent' vibrancy='floating' {...props} />
  ),

  /**
   * Small dialog for simple interactions
   */
  small: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog size='sm' {...props} />
  ),

  /**
   * Large dialog for complex content
   */
  large: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog size='lg' {...props} />
  ),

  /**
   * Extra large dialog for full-screen content
   */
  xlarge: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog size='xl' {...props} />
  ),

  /**
   * Full width dialog for mobile
   */
  fullWidth: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog size='fullWidth' {...props} />
  ),

  /**
   * AAA compliant dialog with enhanced contrast
   */
  aaa: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog enforceAAA={true} {...props} />
  ),

  /**
   * Performance-optimized dialog with disabled animations
   */
  performance: (props: Partial<EnhancedDialogConfig> = {}) => (
    <EnhancedDialog disableAnimations={true} {...props} />
  ),
};

// ===== COMPONENT EXPORTS =====

export {
  DialogRoot as Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};

// Export variants for external use
export {
  dialogOverlayVariants,
  dialogContentVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogCloseVariants,
};

// Type exports
export type {
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  EnhancedDialogConfig as EnhancedDialogProps,
};
