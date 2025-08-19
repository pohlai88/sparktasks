/**
 * KebabMenu Component - Enterprise-Grade Three-Dot Action Menu
 * 
 * Features:
 * - Iconic three-dot button trigger with hover states
 * - Contextual action menu with advanced positioning
 * - Destructive action support with visual differentiation
 * - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - Accessibility compliance (WCAG 2.1 AA) with proper ARIA
 *   // Click outside detection
 * - Separator support for logical action grouping
 * - Icon integration with enterprise spacing patterns
 * - Theme-aware styling with dark mode support
 * - Link handling with external link support
 * - Mobile-friendly touch interactions
 * - Enterprise motion system integration
 * - Loading and disabled states
 */

import React, { useState, useRef, useEffect } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { MoreHorizontal, ExternalLink } from 'lucide-react';

// Type definitions
export type KebabMenuPlacement = 
  | 'bottom-start' 
  | 'bottom-end' 
  | 'top-start' 
  | 'top-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export interface KebabMenuItem {
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

export interface KebabMenuProps {
  // Content
  items: KebabMenuItem[];
  children?: React.ReactNode; // For custom content instead of items
  
  // Trigger configuration
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonVariant?: 'ghost' | 'outline' | 'secondary';
  triggerClassName?: string;
  
  // Menu configuration
  placement?: KebabMenuPlacement;
  contentClassName?: string;
  
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
  onSelect?: (item: KebabMenuItem) => void;
}

export function KebabMenu({
  items,
  children,
  buttonSize = 'md',
  buttonVariant = 'ghost',
  triggerClassName = '',
  placement = 'bottom-end',
  contentClassName = '',
  ariaLabel = 'More actions',
  menuId,
  disabled = false,
  loading = false,
  isOpen: controlledOpen,
  onOpenChange,
  onSelect
}: KebabMenuProps) {
  // State management
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const setIsOpen = (open: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };

  // Refs for DOM manipulation
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Generate unique IDs
  const generatedMenuId = useRef(`kebab-menu-${Math.random().toString(36).substr(2, 9)}`);
  const actualMenuId = menuId || generatedMenuId.current;

  // Get valid menu items (exclude separators for keyboard navigation)
  const validItems = items.filter(item => !item.separator && !item.disabled);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const validItems = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])'));
      const itemToFocus = validItems[focusedIndex] as HTMLElement;
      if (itemToFocus) {
        itemToFocus.focus();
      }
    }
  }, [isOpen, focusedIndex]);
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
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;

        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev < validItems.length - 1 ? prev + 1 : 0;
            return nextIndex;
          });
          break;

        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : validItems.length - 1;
            return nextIndex;
          });
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < validItems.length) {
            const item = validItems[focusedIndex];
            handleItemClick(item);
          }
          break;

        case 'Tab':
          // Allow tabbing out of the menu
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, validItems]);

  // Position calculation based on placement
  const getPositionClasses = (placement: KebabMenuPlacement): string => {
    const positions = {
      'bottom-start': 'top-full left-0 mt-1',
      'bottom-end': 'top-full right-0 mt-1',
      'top-start': 'bottom-full left-0 mb-1',
      'top-end': 'bottom-full right-0 mb-1',
      'left-start': 'right-full top-0 mr-1',
      'left-end': 'right-full bottom-0 mr-1',
      'right-start': 'left-full top-0 ml-1',
      'right-end': 'left-full bottom-0 ml-1'
    };
    return positions[placement] || positions['bottom-end'];
  };

  // Event handlers
  const handleTriggerClick = () => {
    if (disabled) return;
    const newOpen = !isOpen;
    setIsOpen(newOpen);
    if (newOpen) {
      setFocusedIndex(-1);
    }
  };

  const handleItemClick = (item: KebabMenuItem) => {
    if (item.disabled) return;

    // Handle link navigation
    if (item.href) {
      if (item.target === '_blank') {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    }

    // Call item onClick handler
    item.onClick?.();
    
    // Call menu onSelect handler
    onSelect?.(item);

    // Close menu after selection
    setIsOpen(false);
    setFocusedIndex(-1);
    
    // Return focus to trigger
    triggerRef.current?.focus();
  };

  // Styling classes
  const triggerClasses = [
    DESIGN_TOKENS.recipe.button.base,
    DESIGN_TOKENS.recipe.button[buttonVariant],
    DESIGN_TOKENS.recipe.button[buttonSize],
    DESIGN_TOKENS.recipe.button.iconOnly,
    // Focus and hover states
    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'hover:bg-slate-100 dark:hover:bg-slate-800',
    // Rounded for better visual appeal
    'rounded-md',
    // State-based styling
    disabled ? DESIGN_TOKENS.state.disabled : '',
    loading ? 'cursor-wait' : '',
    isOpen ? 'bg-slate-100 dark:bg-slate-800' : '',
    triggerClassName
  ].filter(Boolean).join(' ');
  
  const contentClasses = [
    DESIGN_TOKENS.recipe.dropdown.content,
    DESIGN_TOKENS.zIndex.dropdown,
    // Theme-aware background and text
    'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
    // Positioning based on placement
    getPositionClasses(placement),
    // Animation states
    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
    DESIGN_TOKENS.motion.smooth,
    // Custom styling
    contentClassName
  ].filter(Boolean).join(' ');

  // Get item classes with proper enterprise token usage
  const getItemClasses = (item: KebabMenuItem) => [
    DESIGN_TOKENS.recipe.dropdown.item,
    // Focus state
    focusedIndex === validItems.indexOf(item) ? 'bg-slate-100 dark:bg-slate-800' : '',
    // Destructive styling
    item.destructive ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20' : '',
    // Disabled state
    item.disabled ? DESIGN_TOKENS.state.disabled : 'cursor-pointer',
    // Link styling
    item.href ? 'flex items-center justify-between' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={triggerClasses}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? actualMenuId : undefined}
        type="button"
      >
        {loading ? (
          <div className={`${DESIGN_TOKENS.icon.size[buttonSize]} animate-spin rounded-full border-2 border-current border-t-transparent`} />
        ) : (
          <MoreHorizontal className={DESIGN_TOKENS.icon.size[buttonSize]} />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        id={actualMenuId}
        className={contentClasses}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={triggerRef.current?.id}
      >
        {children || (
          <>
            {items.map((item, index) => {
              // Handle separators
              if (item.separator) {
                return (
                  <div
                    key={`separator-${index}`}
                    className="my-1 border-t border-slate-200 dark:border-slate-700"
                    role="separator"
                  />
                );
              }

              const validIndex = validItems.indexOf(item);
              
              return (
                <div
                  key={item.id}
                  className={getItemClasses(item)}
                  role="menuitem"
                  aria-disabled={item.disabled}
                  tabIndex={focusedIndex === validIndex ? 0 : -1}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => setFocusedIndex(validIndex)}
                  onFocus={() => setFocusedIndex(validIndex)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {item.icon && (
                      <span className={DESIGN_TOKENS.icon.size.sm}>
                        {item.icon}
                      </span>
                    )}
                    <span className={item.destructive ? 'text-red-600 dark:text-red-400' : ''}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* External link indicator */}
                  {item.href && item.target === '_blank' && (
                    <ExternalLink className={`${DESIGN_TOKENS.icon.size.xs} opacity-60`} />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default KebabMenu;
