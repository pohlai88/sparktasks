/**
 * @fileoverview Drawer/Sheet Component - Enterprise-grade sliding panels
 * *
 * A comprehensive sliding panel system for overlays, navigation, and content display.
 * Supports multiple positions, sizes, variants, and advanced features like focus trapping,
 * keyboard navigation, and WCAG 2.1 AA accessibility compliance.
 *
 * Features:
 * - 4 positions: left, right, top, bottom
 * - 5 sizes: sm, md, lg, xl, full
 * - 5 variants: default, primary, success, warning, danger
 * - Focus management with trap and restoration
 * - Body scroll lock when open
 * - Portal rendering for proper z-index management
 * - Keyboard navigation (Escape to close, Tab cycling)
 * - Click outside to close with customizable behavior
 * - Smooth animations with performance optimization
 * - ARIA compliance for screen readers
 * - Theme-aware styling with dark mode support
 *
 * @version 1.0.0
 * @since 2025-01-20
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  ReactNode,
  AriaAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DrawerVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';

export interface DrawerAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

export interface DrawerProps extends AriaAttributes {
  // Core props
  open: boolean;
  onClose: () => void;
  children?: ReactNode;

  // Content props
  title?: string;
  description?: string;
  actions?: DrawerAction[];

  // Layout props
  position?: DrawerPosition;
  size?: DrawerSize;
  variant?: DrawerVariant;

  // Behavior props
  modal?: boolean; // When true, renders backdrop and traps focus
  dismissible?: boolean; // Allow dismiss by clicking outside or pressing Escape
  persistent?: boolean; // Prevent closing when clicking outside
  backdrop?: boolean; // Show/hide backdrop overlay

  // Advanced props
  zIndex?: number; // Custom z-index value
  className?: string; // Additional CSS classes
  portalId?: string; // Custom portal container ID

  // Animation props
  animateIn?: boolean; // Enable entrance animation
  animateOut?: boolean; // Enable exit animation

  // Callbacks
  onOpenChange?: (open: boolean) => void;
  onBackdropClick?: () => void;
  onAnimationEnd?: () => void;

  // Accessibility props
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// ===== STYLE VARIANTS =====

const positionVariants: Record<DrawerPosition, string> = {
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
};

const sizeVariants: Record<DrawerPosition, Record<DrawerSize, string>> = {
  left: {
    sm: 'w-80', // 320px
    md: 'w-96', // 384px
    lg: 'w-[440px]', // 440px
    xl: 'w-[520px]', // 520px
    full: 'w-[90vw]', // 90% viewport width
  },
  right: {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[440px]',
    xl: 'w-[520px]',
    full: 'w-[90vw]',
  },
  top: {
    sm: 'h-64', // 256px
    md: 'h-80', // 320px
    lg: 'h-96', // 384px
    xl: 'h-[440px]', // 440px
    full: 'h-[90vh]', // 90% viewport height
  },
  bottom: {
    sm: 'h-64',
    md: 'h-80',
    lg: 'h-96',
    xl: 'h-[440px]',
    full: 'h-[90vh]',
  },
};

const variantStyles: Record<DrawerVariant, string> = {
  default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700',
  primary:
    'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
  success:
    'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
  warning:
    'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
  danger: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
};

const animationVariants: Record<
  DrawerPosition,
  { enter: string; exit: string }
> = {
  left: {
    enter: DESIGN_TOKENS.motion.semantic.drawerEnterLeft,
    exit: DESIGN_TOKENS.motion.semantic.drawerExitLeft,
  },
  right: {
    enter: DESIGN_TOKENS.motion.semantic.drawerEnterRight,
    exit: DESIGN_TOKENS.motion.semantic.drawerExitRight,
  },
  top: {
    enter: 'animate-in slide-in-from-top duration-300 ease-out',
    exit: 'animate-out slide-out-to-top duration-250 ease-in',
  },
  bottom: {
    enter: 'animate-in slide-in-from-bottom duration-300 ease-out',
    exit: 'animate-out slide-out-to-bottom duration-250 ease-in',
  },
};

const borderVariants: Record<DrawerPosition, string> = {
  left: 'border-r',
  right: 'border-l',
  top: 'border-b',
  bottom: 'border-t',
};

// ===== HOOKS =====

/**
 * Custom hook for focus trap management
 * Ensures focus stays within the drawer when modal is true
 */
function useFocusTrap(
  enabled: boolean,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled, containerRef]);
}

/**
 * Custom hook for focus restoration
 * Restores focus to the element that triggered the drawer
 */
function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    return () => {
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === 'function'
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, []);
}

/**
 * Custom hook for body scroll lock
 * Prevents background scrolling when drawer is open
 */
function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [enabled]);
}

// ===== SUB-COMPONENTS =====

interface DrawerHeaderProps {
  title?: string;
  description?: string;
  onClose?: () => void;
  variant?: DrawerVariant;
  position?: DrawerPosition;
  dismissible?: boolean;
}

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  (
    { title, description, onClose, variant = 'default', dismissible = true },
    ref
  ) => {
    if (!title && !description) return null;

    const titleId = title ? 'drawer-title' : undefined;
    const descriptionId = description ? 'drawer-description' : undefined;

    return (
      <div
        ref={ref}
        className={` ${DESIGN_TOKENS.layout.patterns.cardHeader} ${variantStyles[variant]} sticky top-0 z-10 backdrop-blur-sm`}
      >
        <div className={combineTokens('min-w-0 flex-1')}>
          {title && (
            <h2
              id={titleId}
              className={` ${DESIGN_TOKENS.typography.heading.h3} truncate text-slate-900 dark:text-slate-100`}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              id={descriptionId}
              className={` ${DESIGN_TOKENS.typography.body.secondary} mt-1 text-slate-600 dark:text-slate-400`}
            >
              {description}
            </p>
          )}
        </div>

        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={` ${DESIGN_TOKENS.sizing.badge.md} ${DESIGN_TOKENS.colors.states.default.hover} ${DESIGN_TOKENS.motion.smooth} flex items-center justify-center rounded-md border border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:focus:ring-offset-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200`}
            aria-label='Close drawer'
            type='button'
          >
            <svg
              className={combineTokens(
                DESIGN_TOKENS.layout.spacing.fine.size4,
                DESIGN_TOKENS.layout.flex.shrinkNone
              )}
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

DrawerHeader.displayName = 'DrawerHeader';

interface DrawerActionsProps {
  actions?: DrawerAction[];
  variant?: DrawerVariant;
  position?: DrawerPosition;
}

const DrawerActions = forwardRef<HTMLDivElement, DrawerActionsProps>(
  ({ actions, variant = 'default', position = 'right' }, ref) => {
    if (!actions || actions.length === 0) return null;

    return (
      <div
        ref={ref}
        className={` ${DESIGN_TOKENS.layout.patterns.sectionFooter} ${variantStyles[variant]} sticky bottom-0 z-10 flex items-center justify-end gap-3 backdrop-blur-sm ${position === 'top' || position === 'bottom' ? 'flex-row' : 'flex-col sm:flex-row'} `}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className={` ${DESIGN_TOKENS.recipe.button[action.variant || 'secondary']} ${DESIGN_TOKENS.motion.smooth} ${action.disabled ? 'cursor-not-allowed opacity-50' : ''} flex min-w-[100px] items-center justify-center gap-2`}
            type='button'
          >
            {action.loading ? (
              <svg
                className={combineTokens(
                  DESIGN_TOKENS.layout.spacing.fine.size4,
                  DESIGN_TOKENS.layout.flex.shrinkNone,
                  'animate-spin'
                )}
                fill='none'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <circle
                  className={combineTokens('opacity-25')}
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className={combineTokens('opacity-75')}
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            ) : (
              action.icon
            )}
            {action.label}
          </button>
        ))}
      </div>
    );
  }
);

DrawerActions.displayName = 'DrawerActions';

// ===== MAIN COMPONENT =====

/**
 * Drawer Component - Enterprise-grade sliding panel
 *
 * @param props - DrawerProps configuration object
 * @returns JSX.Element | null
 */
const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      // Core props
      open,
      onClose,
      children,

      // Content props
      title,
      description,
      actions,

      // Layout props
      position = 'right',
      size = 'md',
      variant = 'default',

      // Behavior props
      modal = true,
      dismissible = true,
      persistent = false,
      backdrop = true,

      // Advanced props
      zIndex,
      className = '',
      portalId = 'drawer-portal',

      // Animation props
      animateIn = true,
      animateOut = true,

      // Callbacks
      onOpenChange,
      onBackdropClick,
      onAnimationEnd,

      // Accessibility props
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,

      ...restProps
    },
    ref
  ) => {
    // ===== STATE & REFS =====
    const [shouldRender, setShouldRender] = useState(open);
    const drawerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (drawerRef.current !== node) {
          // @ts-expect-error - Direct ref assignment needed for imperative DOM control
          drawerRef.current = node;
        }
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      },
      [ref]
    );

    // ===== HOOKS =====
    useFocusTrap(modal && open, drawerRef);
    useFocusRestore();
    useBodyScrollLock(modal && open);

    // ===== HANDLERS =====
    const handleClose = useCallback(() => {
      if (!dismissible || persistent) return;
      onClose();
      onOpenChange?.(false);
    }, [dismissible, persistent, onClose, onOpenChange]);

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) {
          onBackdropClick?.();
          if (!persistent) {
            handleClose();
          }
        }
      },
      [onBackdropClick, persistent, handleClose]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && dismissible) {
          handleClose();
        }
      },
      [dismissible, handleClose]
    );

    const handleAnimationEnd = useCallback(() => {
      onAnimationEnd?.();

      if (!open) {
        setShouldRender(false);
      }
    }, [open, onAnimationEnd]);

    // ===== EFFECTS =====
    useEffect(() => {
      if (open) {
        setShouldRender(true);
      }
    }, [open]);

    useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [open, handleKeyDown]);

    // ===== PORTAL MANAGEMENT =====
    const getPortalContainer = useCallback(() => {
      let container = document.getElementById(portalId);
      if (!container) {
        container = document.createElement('div');
        container.id = portalId;
        document.body.appendChild(container);
      }
      return container;
    }, [portalId]);

    // Don't render if not open and not animating
    if (!shouldRender) {
      return null;
    }

    // ===== COMPUTED STYLES =====
    const baseStyles = `
      fixed ${positionVariants[position]}
      ${sizeVariants[position][size]}
      ${variantStyles[variant]}
      ${borderVariants[position]}
      ${zIndex ? `z-[${zIndex}]` : DESIGN_TOKENS.zIndex.modal}
      shadow-xl
      ${DESIGN_TOKENS.motion.semantic.base}
      flex flex-col
      max-h-screen overflow-hidden
      ${className}
    `;

    const animationStyles =
      animateIn || animateOut
        ? open
          ? animationVariants[position].enter
          : animationVariants[position].exit
        : '';

    const backdropStyles = `
      ${DESIGN_TOKENS.recipe.modal.overlay}
      ${open ? DESIGN_TOKENS.motion.semantic.overlayEnter : DESIGN_TOKENS.motion.semantic.overlayExit}
    `;

    // ===== ARIA ATTRIBUTES =====
    const ariaProps = {
      role: 'dialog',
      'aria-modal': modal,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy || (title ? 'drawer-title' : undefined),
      'aria-describedby':
        ariaDescribedBy || (description ? 'drawer-description' : undefined),
      ...restProps,
    };

    // ===== RENDER =====
    const drawerContent = (
      <>
        {/* Backdrop */}
        {backdrop && modal && (
          <div
            ref={backdropRef}
            className={backdropStyles}
            onClick={handleBackdropClick}
            aria-hidden='true'
          />
        )}

        {/* Drawer Panel */}
        <div
          ref={combinedRef}
          className={`${baseStyles} ${animationStyles}`}
          onAnimationEnd={handleAnimationEnd}
          {...ariaProps}
        >
          {/* Header */}
          {(title || description) &&
            (() => {
              // With `exactOptionalPropertyTypes: true`, optional props don't accept explicit `undefined`.
              // Build the header props object by OMITTING keys that are undefined.
              const headerProps = {
                ...(title !== undefined ? { title } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(dismissible && handleClose ? { onClose: handleClose } : {}),
                variant,
                dismissible,
              };

              return <DrawerHeader {...headerProps} />;
            })()}

          {/* Content */}
          <div
            className={` ${DESIGN_TOKENS.layout.patterns.panelSection} flex-1 overflow-y-auto ${variantStyles[variant]} `}
          >
            {children}
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <DrawerActions
              actions={actions}
              variant={variant}
              position={position}
            />
          )}
        </div>
      </>
    );

    // Render through portal for proper z-index management
    return createPortal(drawerContent, getPortalContainer());
  }
);

Drawer.displayName = 'Drawer';

// ===== COMPOUND COMPONENTS =====

/**
 * Sheet Component - Alias for Drawer with specific default props
 * Commonly used for forms, settings, and content editing
 */
export const Sheet = forwardRef<HTMLDivElement, Omit<DrawerProps, 'modal'>>(
  (props, ref) => <Drawer ref={ref} modal={true} backdrop={true} {...props} />
);

Sheet.displayName = 'Sheet';

/**
 * Sidebar Component - Navigation-focused drawer
 * Optimized for navigation menus and application structure
 */
export interface SidebarProps
  extends Omit<DrawerProps, 'position' | 'modal' | 'backdrop'> {
  position?: 'left' | 'right';
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ position = 'left', ...props }, ref) => (
    <Drawer
      ref={ref}
      position={position}
      modal={false}
      backdrop={false}
      size='md'
      {...props}
    />
  )
);

Sidebar.displayName = 'Sidebar';

/**
 * SlideOver Component - Content-focused overlay
 * Ideal for detailed views, editing forms, and supplementary content
 */
export const SlideOver = forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'modal' | 'backdrop' | 'position'>
>((props, ref) => (
  <Drawer
    ref={ref}
    position='right'
    modal={true}
    backdrop={true}
    size='lg'
    {...props}
  />
));

SlideOver.displayName = 'SlideOver';

/**
 * BottomSheet Component - Mobile-optimized bottom drawer
 * Perfect for mobile actions, filters, and quick interactions
 */
export const BottomSheet = forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'position'>
>((props, ref) => <Drawer ref={ref} position='bottom' size='md' {...props} />);

BottomSheet.displayName = 'BottomSheet';
