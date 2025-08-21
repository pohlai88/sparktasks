import * as React from 'react';

import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'manual';

export interface TooltipProps {
  /** Content to display in the tooltip */
  content: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactElement;
  /** Position relative to trigger element */
  position?: TooltipPosition;
  /** How tooltip is triggered */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** Delay before showing (ms) */
  delayShow?: number;
  /** Delay before hiding (ms) */
  delayHide?: number;
  /** Custom CSS classes for tooltip */
  className?: string;
  /** Custom aria-label (overrides content) */
  ariaLabel?: string;
  /** Disable the tooltip */
  disabled?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Tooltip: Enterprise-grade contextual information display
 * - Full SSOT compliance using DESIGN_TOKENS
 * - WCAG 2.1 AA accessibility with proper ARIA
 * - Multi-trigger support (hover, focus, click, manual)
 * - Robust lifecycle management and cleanup
 * - Touch-friendly with mobile optimizations
 * - Keyboard navigation with Escape support
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      content,
      children,
      position = 'top',
      trigger = 'hover',
      delayShow = 200,
      delayHide = 0,
      className,
      ariaLabel,
      disabled = false,
      open: controlledOpen,
      onOpenChange,
    },
    ref
  ) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const showTimeoutRef = React.useRef<number | null>(null);
    const hideTimeoutRef = React.useRef<number | null>(null);
    const tooltipId = React.useId();
    const triggerRef = React.useRef<HTMLElement>(null);

    const triggers = Array.isArray(trigger) ? trigger : [trigger];
    const hasHover = triggers.includes('hover');
    const hasFocus = triggers.includes('focus');
    const hasClick = triggers.includes('click');

    const setOpen = React.useCallback(
      (newOpen: boolean) => {
        if (disabled) return;

        if (isControlled) {
          onOpenChange?.(newOpen);
        } else {
          setUncontrolledOpen(newOpen);
        }
      },
      [disabled, isControlled, onOpenChange]
    );

    const show = React.useCallback(() => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (!open) {
        if (delayShow > 0) {
          showTimeoutRef.current = globalThis.setTimeout(() => {
            setOpen(true);
          }, delayShow);
        } else {
          setOpen(true);
        }
      }
    }, [open, delayShow, setOpen]);

    const hide = React.useCallback(() => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }

      if (open) {
        if (delayHide > 0) {
          hideTimeoutRef.current = globalThis.setTimeout(() => {
            setOpen(false);
          }, delayHide);
        } else {
          setOpen(false);
        }
      }
    }, [open, delayHide, setOpen]);

    // Cleanup timeouts
    React.useEffect(() => {
      return () => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    // Keyboard handling
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          hide();
        }
      },
      [open, hide]
    );

    // Event handlers
    const handleMouseEnter = hasHover ? show : undefined;
    const handleMouseLeave = hasHover ? hide : undefined;
    const handleFocus = hasFocus ? show : undefined;
    const handleBlur = hasFocus ? hide : undefined;
    const handleClick = hasClick ? () => setOpen(!open) : undefined;
    const handleTouchStart = hasHover ? show : undefined;
    const handleTouchEnd = hasHover ? hide : undefined;

    // Position calculations with fallback
    const getPositionClasses = (pos: TooltipPosition): string => {
      const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      };
      return positions[pos];
    };

    // Arrow positioning
    const getArrowClasses = (pos: TooltipPosition): string => {
      const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 rotate-180',
        left: 'left-full top-1/2 -translate-y-1/2 rotate-90',
        right: 'right-full top-1/2 -translate-y-1/2 -rotate-90',
      };
      return arrows[pos];
    };

    // Enhanced trigger with accessibility
    const enhancedTrigger = React.cloneElement(children, {
      ref: triggerRef,
      'aria-describedby': open ? tooltipId : undefined,
      onMouseEnter: combineHandlers(
        children.props.onMouseEnter,
        handleMouseEnter
      ),
      onMouseLeave: combineHandlers(
        children.props.onMouseLeave,
        handleMouseLeave
      ),
      onFocus: combineHandlers(children.props.onFocus, handleFocus),
      onBlur: combineHandlers(children.props.onBlur, handleBlur),
      onClick: combineHandlers(children.props.onClick, handleClick),
      onTouchStart: combineHandlers(
        children.props.onTouchStart,
        handleTouchStart
      ),
      onTouchEnd: combineHandlers(children.props.onTouchEnd, handleTouchEnd),
      onKeyDown: combineHandlers(children.props.onKeyDown, handleKeyDown),
    });

    return (
      <span
        className={combineTokens('relative', 'inline-block')}
        data-testid='tooltip-wrapper'
      >
        {enhancedTrigger}
        {open && !disabled && (
          <div
            ref={ref}
            id={tooltipId}
            role='tooltip'
            aria-label={
              ariaLabel || (typeof content === 'string' ? content : undefined)
            }
            className={combineTokens(
              DESIGN_TOKENS.dataViz.tooltip,
              'absolute z-50',
              getPositionClasses(position),
              className
            )}
            data-testid='tooltip-content'
            data-position={position}
          >
            {content}
            <div
              className={combineTokens(
                DESIGN_TOKENS.dataViz.tooltipArrow,
                'absolute',
                getArrowClasses(position)
              )}
              aria-hidden='true'
            />
          </div>
        )}
      </span>
    );
  }
);

// Helper function to combine event handlers
function combineHandlers<T extends (...args: never[]) => void>(
  original?: T,
  additional?: T
): T | undefined {
  if (!original && !additional) return undefined;
  if (!original) return additional;
  if (!additional) return original;

  return ((...args: Parameters<T>) => {
    original(...args);
    additional(...args);
  }) as T;
}

export default Tooltip;
