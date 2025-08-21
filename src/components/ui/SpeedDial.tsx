/**
 * SpeedDial Component - Enterprise-Grade Floating Action Button with Menu
 *
 * Features:
 * - Floating action button (FAB) with expandable menu
 * - 8-direction placement system (top, bottom, left, right, corners)
 * - Smooth open/close animations with staggered menu items
 * - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - Accessibility compliance (WCAG 2.1 AA) with proper ARIA
 * - Click outside detection and focus management
 * - Icon rotation and visual feedback on expansion
 * - Theme-aware styling with dark mode support
 * - Mobile-friendly touch interactions with proper sizing
 * - Enterprise motion system integration with reduced motion support
 * - Controlled/uncontrolled modes for flexible state management
 * - Loading and disabled states with visual feedback
 * - Custom trigger and menu item support
 */

import { Plus, X } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { DESIGN_TOKENS } from '@/design/tokens';

// Type definitions
export type SpeedDialPlacement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right';

export interface SpeedDialAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  className?: string;
}

export interface SpeedDialProps {
  // Content
  actions: SpeedDialAction[];
  children?: React.ReactNode; // Custom trigger content

  // Trigger configuration
  triggerIcon?: React.ReactNode;
  triggerSize?: 'sm' | 'md' | 'lg';
  triggerVariant?: 'primary' | 'secondary' | 'accent';

  // Menu configuration
  placement?: SpeedDialPlacement;

  // Position
  position?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'custom';
  customPosition?: string; // Custom positioning classes

  // Accessibility
  ariaLabel?: string;
  menuId?: string;

  // State
  disabled?: boolean;
  loading?: boolean;

  // Controlled state
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Events
  onActionSelect?: (action: SpeedDialAction) => void;

  // Styling
  className?: string;
  menuClassName?: string;
}

export function SpeedDial({
  actions,
  children,
  triggerIcon,
  triggerSize = 'lg',
  triggerVariant = 'primary',
  placement = 'top',
  position = 'bottom-right',
  customPosition,
  ariaLabel = 'More actions',
  menuId,
  disabled = false,
  loading = false,
  isOpen: controlledOpen,
  onOpenChange,
  onActionSelect,
  className = '',
  menuClassName = '',
}: SpeedDialProps) {
  // State management
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen === undefined ? internalOpen : controlledOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(open);
      }
      onOpenChange?.(open);
    },
    [controlledOpen, onOpenChange]
  );

  // Refs for DOM manipulation
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Generate unique IDs
  const generatedMenuId = useRef(
    `speed-dial-${Math.random().toString(36).slice(2, 11)}`
  );
  const actualMenuId = menuId || generatedMenuId.current;

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape': {
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        }

        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
          event.preventDefault();
          const activeActions = actions.filter(action => !action.disabled);
          if (activeActions.length === 0) return;

          const isVertical =
            placement.includes('top') ||
            placement.includes('bottom') ||
            placement === 'left' ||
            placement === 'right';
          const isReverse =
            placement.includes('bottom') || placement === 'right';

          let shouldMove = false;
          shouldMove = isVertical
            ? event.key === 'ArrowUp' || event.key === 'ArrowDown'
            : event.key === 'ArrowLeft' || event.key === 'ArrowRight';

          if (shouldMove) {
            const increment =
              event.key === 'ArrowUp' || event.key === 'ArrowLeft'
                ? isReverse
                  ? 1
                  : -1
                : isReverse
                  ? -1
                  : 1;
            setFocusedIndex(prev => {
              const newIndex = prev + increment;
              if (newIndex >= activeActions.length) return 0;
              if (newIndex < 0) return activeActions.length - 1;
              return newIndex;
            });
          }
          break;
        }

        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < actions.length) {
            const action = actions.filter(a => !a.disabled)[focusedIndex];
            if (action && !action.disabled && action.onClick) {
              action.onClick();
              setIsOpen(false);
              setFocusedIndex(-1);
            }
          }
          break;
        }

        case 'Tab': {
          // Allow tabbing out of the menu
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, actions, setIsOpen, placement]);

  // Get positioning classes based on placement
  const getPositionClasses = (): string => {
    if (customPosition) return customPosition;

    const positionMap: Record<string, string> = {
      'bottom-right': DESIGN_TOKENS.position.fixed.bottomRight,
      'bottom-left': DESIGN_TOKENS.position.fixed.bottomLeft,
      'top-right': DESIGN_TOKENS.position.fixed.topRight,
      'top-left': DESIGN_TOKENS.position.fixed.topLeft,
    };

    return positionMap[position] || positionMap['bottom-right'];
  };

  // Get menu positioning relative to trigger
  const getMenuPlacement = (): string => {
    const placementMap = {
      top: 'bottom-0 left-1/2 transform -translate-x-1/2 mb-4',
      'top-left': 'bottom-0 right-0 mb-4 mr-4',
      'top-right': 'bottom-0 left-0 mb-4 ml-4',
      bottom: 'top-0 left-1/2 transform -translate-x-1/2 mt-4',
      'bottom-left': 'top-0 right-0 mt-4 mr-4',
      'bottom-right': 'top-0 left-0 mt-4 ml-4',
      left: 'right-0 top-1/2 transform -translate-y-1/2 mr-4',
      right: 'left-0 top-1/2 transform -translate-y-1/2 ml-4',
    };

    return placementMap[placement] || placementMap['top'];
  };

  // Get menu layout direction
  const getMenuDirection = (): string => {
    const isHorizontal = placement === 'left' || placement === 'right';
    return isHorizontal ? 'flex-row space-x-2' : 'flex-col space-y-2';
  };

  // Event handlers
  const handleTriggerClick = () => {
    if (disabled || loading) return;
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (newOpen) {
      setFocusedIndex(-1);
    }
  };

  const handleActionClick = (action: SpeedDialAction) => {
    if (action.disabled) return;

    // Handle link navigation
    if (action.href) {
      if (action.target === '_blank') {
        window.open(action.href, '_blank', 'noopener,noreferrer');
      } else {
        globalThis.location.href = action.href;
      }
    }

    // Call action onClick handler
    action.onClick?.();

    // Call menu onActionSelect handler
    onActionSelect?.(action);

    // Close menu after selection
    setIsOpen(false);
    setFocusedIndex(-1);

    // Return focus to trigger
    triggerRef.current?.focus();
  };

  // Get trigger size classes
  const getTriggerSizeClasses = (): string => {
    const sizeMap = {
      sm: 'w-12 h-12',
      md: 'w-14 h-14',
      lg: 'w-16 h-16',
    };
    return sizeMap[triggerSize];
  };

  // Get trigger variant classes
  const getTriggerVariantClasses = (): string => {
    const variantMap = {
      primary: DESIGN_TOKENS.recipe.button.primary,
      secondary: DESIGN_TOKENS.recipe.button.secondary,
      accent: 'bg-accent-600 hover:bg-accent-700 text-white',
    };
    return variantMap[triggerVariant];
  };

  // Get action button classes
  const getActionButtonClasses = (action: SpeedDialAction): string => {
    const activeActions = actions.filter(a => !a.disabled);
    const activeIndex = activeActions.indexOf(action);
    const isActionFocused = focusedIndex === activeIndex;

    return [
      // Base button styling
      'w-10 h-10 rounded-full shadow-lg border border-white/20',
      'flex items-center justify-center',
      'transition-all duration-200 ease-out',
      // Theme aware colors
      'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      'hover:bg-slate-50 dark:hover:bg-slate-700',
      // Focus state
      isActionFocused ? 'ring-2 ring-primary-500 ring-offset-2' : '',
      // Disabled state
      action.disabled ? DESIGN_TOKENS.state.disabled : 'cursor-pointer',
      // Hover effects
      action.disabled ? '' : DESIGN_TOKENS.motion.semantic.hoverLift,
      // Custom classes
      action.className || '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={[
          // Base styling
          getTriggerSizeClasses(),
          'rounded-full shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-200 ease-out',
          // Variant styling
          getTriggerVariantClasses(),
          // State styling
          disabled ? DESIGN_TOKENS.state.disabled : '',
          loading ? 'cursor-wait' : '',
          // Interactive effects
          !disabled && !loading ? DESIGN_TOKENS.motion.semantic.hoverLift : '',
          // Z-index
          DESIGN_TOKENS.zIndex.overlay,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        aria-controls={isOpen ? actualMenuId : undefined}
        type='button'
      >
        {loading ? (
          <div
            className={`${DESIGN_TOKENS.icon.size.md} animate-spin rounded-full border-2 border-current border-t-transparent`}
          />
        ) : (
          children || (
            <div
              className={`${DESIGN_TOKENS.icon.size.md} transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
            >
              {triggerIcon || (isOpen ? <X /> : <Plus />)}
            </div>
          )
        )}
      </button>

      {/* Action Menu */}
      {(isOpen || loading) && (
        <div
          ref={menuRef}
          id={actualMenuId}
          className={[
            // Positioning
            'absolute',
            getMenuPlacement(),
            // Layout
            'flex',
            getMenuDirection(),
            // Z-index
            DESIGN_TOKENS.zIndex.overlay,
            // Animation
            isOpen
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0',
            DESIGN_TOKENS.motion.smooth,
            // Custom styling
            menuClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          role='menu'
          aria-orientation={
            placement === 'left' || placement === 'right'
              ? 'horizontal'
              : 'vertical'
          }
          aria-labelledby={triggerRef.current?.id}
        >
          {actions.map((action, index) => (
            <div
              key={action.id}
              className={getActionButtonClasses(action)}
              role='menuitem'
              tabIndex={action.disabled ? -1 : 0}
              aria-disabled={action.disabled}
              title={action.label}
              onClick={() => handleActionClick(action)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleActionClick(action);
                }
              }}
              style={{
                // Staggered animation delay
                animationDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              <span className={DESIGN_TOKENS.icon.size.sm} aria-hidden='true'>
                {action.icon}
              </span>
              <span className='sr-only'>{action.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpeedDial;
