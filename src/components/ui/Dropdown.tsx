/**
 * Dropdown/Menu Component - Enterprise-Grade Action Menu
 * *
 * Features:
 * - Flexible positioning system (top, bottom, left, right)
 * - Icon integration support with enterprise spacing
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Dark mode support with theme-aware tokens
 * - Click outside detection and focus management
 * - Separator support for grouped actions
 * - Disabled state handling
 * - Custom trigger support
 * - Enterprise motion system integration
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';
import { ChevronDown } from 'lucide-react';

// Type definitions
export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean; // Shows a separator before this item
  onClick?: () => void;
  href?: string; // For link items
  target?: string; // For external links
}

export interface DropdownProps {
  // Content
  trigger?: React.ReactNode;
  children?: React.ReactNode; // For custom content
  items?: DropdownItem[];

  // Trigger button props (when no custom trigger provided)
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  buttonSize?: 'sm' | 'md' | 'lg';
  showChevron?: boolean;

  // Behavior
  placement?: DropdownPlacement;
  disabled?: boolean;
  closeOnItemClick?: boolean;

  // State control
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Styling
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;

  // Accessibility
  'aria-label'?: string;
  id?: string;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      children,
      items = [],
      buttonText = 'Options',
      buttonVariant = 'ghost',
      buttonSize = 'md',
      showChevron = true,
      placement = 'bottom-start',
      disabled = false,
      closeOnItemClick = true,
      open: controlledOpen,
      onOpenChange,
      className = '',
      contentClassName = '',
      triggerClassName = '',
      'aria-label': ariaLabel,
      id,
      ...props
    },
    ref
  ) => {
    // State management
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Refs for DOM manipulation
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Update open state
    const updateOpen = useCallback(
      (newOpen: boolean) => {
        if (controlledOpen === undefined) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [controlledOpen, onOpenChange]
    );

    // Open/close handlers
    const openDropdown = useCallback(() => {
      if (disabled) return;
      updateOpen(true);
      setFocusedIndex(-1);
    }, [disabled, updateOpen]);

    const closeDropdown = useCallback(() => {
      updateOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    }, [updateOpen]);

    const toggleDropdown = useCallback(() => {
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }, [isOpen, closeDropdown, openDropdown]);

    // Item click handler
    const handleItemClick = useCallback(
      (item: DropdownItem) => {
        if (item.disabled) return;

        // Execute item action
        if (item.onClick) {
          item.onClick();
        } else if (item.href) {
          if (item.target === '_blank') {
            window.open(item.href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = item.href;
          }
        }

        // Close dropdown if configured
        if (closeOnItemClick) {
          closeDropdown();
        }
      },
      [closeOnItemClick, closeDropdown]
    );

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            if (!isOpen) {
              openDropdown();
              setFocusedIndex(0);
            } else {
              setFocusedIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
            }
            break;

          case 'ArrowUp':
            event.preventDefault();
            if (isOpen) {
              setFocusedIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
            }
            break;

          case 'Enter':
          case ' ':
            event.preventDefault();
            if (!isOpen) {
              openDropdown();
            } else if (focusedIndex >= 0 && items[focusedIndex]) {
              handleItemClick(items[focusedIndex]);
            }
            break;

          case 'Escape':
            event.preventDefault();
            if (isOpen) {
              closeDropdown();
            }
            break;

          case 'Tab':
            if (isOpen) {
              closeDropdown();
            }
            break;
        }
      },
      [
        disabled,
        isOpen,
        openDropdown,
        items,
        focusedIndex,
        handleItemClick,
        closeDropdown,
      ]
    );

    // Click outside detection
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          !triggerRef.current?.contains(event.target as Node)
        ) {
          closeDropdown();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, closeDropdown]);

    // Focus management for accessibility
    useEffect(() => {
      if (isOpen && focusedIndex >= 0) {
        const focusedItem = contentRef.current?.children[
          focusedIndex
        ] as HTMLElement;
        focusedItem?.focus();
      }
    }, [focusedIndex, isOpen]);

    // Generate class names using DESIGN_TOKENS
    const containerClasses = ['relative inline-block', className]
      .filter(Boolean)
      .join(' ');

    const triggerClasses = [
      DESIGN_TOKENS.recipe.button[
        buttonVariant as keyof typeof DESIGN_TOKENS.recipe.button
      ][buttonSize as keyof typeof DESIGN_TOKENS.recipe.button.primary],
      disabled ? DESIGN_TOKENS.state.disabled : '',
      triggerClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const contentClasses = [
      DESIGN_TOKENS.recipe.dropdown.content,
      DESIGN_TOKENS.zIndex.dropdown,
      // Theme-aware background and text
      'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
      // Positioning based on placement
      getPositionClasses(placement),
      // Animation states
      isOpen
        ? 'opacity-100 scale-100'
        : 'opacity-0 scale-95 pointer-events-none',
      DESIGN_TOKENS.motion.smooth,
      // Custom styling
      contentClassName,
    ]
      .filter(Boolean)
      .join(' ');

    // Get item classes with proper enterprise token usage
    const getItemClasses = (item: DropdownItem, index: number) =>
      [
        DESIGN_TOKENS.recipe.dropdown.item,
        // Focus state
        focusedIndex === index ? 'bg-slate-100 dark:bg-slate-800' : '',
        // Disabled state
        item.disabled ? DESIGN_TOKENS.state.disabled : '',
        // Destructive styling
        item.destructive
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          : '',
        // Icon spacing
        item.icon ? 'gap-2' : '',
      ]
        .filter(Boolean)
        .join(' ');

    // Default trigger button
    const defaultTrigger = (
      <button
        ref={triggerRef}
        type='button'
        className={triggerClasses}
        disabled={disabled}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup='menu'
        aria-label={ariaLabel || `${buttonText} menu`}
        id={id ? `${id}-trigger` : undefined}
      >
        <span>{buttonText}</span>
        {showChevron && (
          <ChevronDown
            size={buttonSize === 'sm' ? 14 : buttonSize === 'lg' ? 18 : 16}
            className={combineTokens(
              'transition-transform duration-200',
              isOpen ? 'rotate-180' : ''
            )}
          />
        )}
      </button>
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {/* Trigger Element */}
        {trigger ? (
          <div
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            role='button'
            tabIndex={disabled ? -1 : 0}
            aria-expanded={isOpen}
            aria-haspopup='menu'
            className={triggerClassName}
          >
            {trigger}
          </div>
        ) : (
          defaultTrigger
        )}

        {/* Dropdown Content */}
        {isOpen && (
          <div
            ref={contentRef}
            className={contentClasses}
            role='menu'
            aria-orientation='vertical'
            aria-labelledby={id ? `${id}-trigger` : undefined}
            data-placement={placement}
          >
            {/* Custom children content */}
            {children}

            {/* Items list */}
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* Separator */}
                {item.separator && (
                  <div
                    className={combineTokens(
                      'my-1 h-px bg-slate-200 dark:bg-slate-700'
                    )}
                    role='separator'
                  />
                )}

                {/* Menu item */}
                <button
                  type='button'
                  className={getItemClasses(item, index)}
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item);
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      closeDropdown();
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setFocusedIndex(prev =>
                        prev < items.length - 1 ? prev + 1 : 0
                      );
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setFocusedIndex(prev =>
                        prev > 0 ? prev - 1 : items.length - 1
                      );
                    }
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  role='menuitem'
                  tabIndex={focusedIndex === index ? 0 : -1}
                  aria-disabled={item.disabled}
                >
                  {/* Icon */}
                  {item.icon && (
                    <span
                      className={combineTokens(
                        DESIGN_TOKENS.layout.flex.shrinkNone
                      )}
                      aria-hidden='true'
                    >
                      {item.icon}
                    </span>
                  )}

                  {/* Label */}
                  <span
                    className={combineTokens(
                      DESIGN_TOKENS.layout.flex.flex1,
                      'text-left'
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

// Helper function for positioning
function getPositionClasses(placement: DropdownPlacement): string {
  const positionMap: Record<DropdownPlacement, string> = {
    'bottom-start': 'absolute top-full left-0 mt-1',
    'bottom-end': 'absolute top-full right-0 mt-1',
    'top-start': 'absolute bottom-full left-0 mb-1',
    'top-end': 'absolute bottom-full right-0 mb-1',
    'left-start': 'absolute right-full top-0 mr-1',
    'left-end': 'absolute right-full bottom-0 mr-1',
    'right-start': 'absolute left-full top-0 ml-1',
    'right-end': 'absolute left-full bottom-0 ml-1',
  };

  return positionMap[placement] || positionMap['bottom-start'];
}
