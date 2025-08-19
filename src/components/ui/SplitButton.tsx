/**
 * SplitButton Component - Enterprise-Grade Button with Dropdown
 * 
 * Advanced DESIGN_TOKENS V3.2 implementation showcasing:
 * - Sophisticated split-button pattern with primary action + dropdown
 * - Seamless visual integration using connected button styling
 * - Comprehensive accessibility support with proper ARIA patterns
 * - Keyboard navigation (Space/Enter for action, Arrow keys for menu)
 * - Enterprise-grade dropdown positioning and z-index management
 * - Dark mode and theme-aware styling throughout
 * - Performance-optimized rendering with proper event handling
 */

import React, { useState, useRef, useEffect } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

interface SplitButtonItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

interface SplitButtonProps {
  // Main action button props
  children: React.ReactNode;
  onClick?: () => void;
  
  // Dropdown items
  items: SplitButtonItem[];
  
  // Styling props
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // State props
  disabled?: boolean;
  pending?: boolean;
  
  // Layout props
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  fullWidth?: boolean;
  
  // Accessibility
  'aria-label'?: string;
  
  // Advanced props
  className?: string;
  dropdownClassName?: string;
}

export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({
    children,
    onClick,
    items = [],
    variant = 'primary',
    size = 'md',
    disabled = false,
    pending = false,
    placement = 'bottom-start',
    fullWidth = false,
    'aria-label': ariaLabel,
    className = '',
    dropdownClassName = '',
    ...props
  }, ref) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    
    // Handle main action click
    const handleMainClick = () => {
      if (disabled || pending) return;
      onClick?.();
    };
    
    // Handle dropdown toggle
    const handleDropdownToggle = () => {
      if (disabled) return;
      setIsOpen(prev => !prev);
      setFocusedIndex(-1);
    };
    
    // Close dropdown
    const closeDropdown = () => {
      setIsOpen(false);
      setFocusedIndex(-1);
    };
    
    // Handle item click
    const handleItemClick = (item: SplitButtonItem) => {
      if (item.disabled) return;
      item.onClick?.();
      closeDropdown();
      triggerRef.current?.focus();
    };
    
    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex(prev => 
              prev < items.length - 1 ? prev + 1 : 0
            );
          }
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex(prev => 
              prev > 0 ? prev - 1 : items.length - 1
            );
          }
          break;
          
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            handleItemClick(items[focusedIndex]);
          } else {
            handleDropdownToggle();
          }
          break;
          
        case 'Escape':
          event.preventDefault();
          closeDropdown();
          triggerRef.current?.focus();
          break;
      }
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && 
            !dropdownRef.current.contains(event.target as Node) &&
            !triggerRef.current?.contains(event.target as Node)) {
          closeDropdown();
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);
    
    // Focus management for accessibility
    useEffect(() => {
      if (isOpen && focusedIndex >= 0) {
        const focusedItem = dropdownRef.current?.children[focusedIndex] as HTMLElement;
        focusedItem?.focus();
      }
    }, [focusedIndex, isOpen]);
    
    // Container classes using enterprise tokens
    const containerClasses = [
      'relative inline-flex',
      fullWidth ? 'w-full' : '',
      className
    ].filter(Boolean).join(' ');
    
    // Button group classes for seamless connection
    const buttonGroupClasses = [
      'inline-flex',
      fullWidth ? 'w-full' : '',
      // Connected styling
      '[&>button]:rounded-none',
      '[&>button:first-child]:rounded-l-md', 
      '[&>button:last-child]:rounded-r-md',
      '[&>button:not(:first-child)]:border-l-0',
      '[&>button:not(:first-child)]:-ml-px',
      // Focus management for connected buttons
      '[&>button:focus]:relative',
      '[&>button:focus]:z-10'
    ].filter(Boolean).join(' ');
    
    // Dropdown trigger classes
    const dropdownTriggerClasses = [
      'aspect-square',
      'inline-flex items-center justify-center',
      // Use same variant as main button for consistency
      DESIGN_TOKENS.recipe.button.base,
      DESIGN_TOKENS.recipe.button[variant],
      DESIGN_TOKENS.recipe.button[size],
      disabled || pending ? DESIGN_TOKENS.state.disabled : '',
      // Visual indicator for dropdown state
      isOpen ? 'relative z-20' : ''
    ].filter(Boolean).join(' ');
    
    // Dropdown content classes using enterprise tokens
    const dropdownContentClasses = [
      DESIGN_TOKENS.recipe.dropdown.content,
      DESIGN_TOKENS.zIndex.dropdown,
      'shadow-lg',
      // Positioning based on placement
      'absolute mt-1',
      placement.includes('end') ? 'right-0' : 'left-0',
      placement.includes('top') ? 'bottom-full mb-1 mt-0' : '',
      // Animation classes
      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
      'transition-all duration-200 ease-out',
      // Custom dropdown styling
      dropdownClassName
    ].filter(Boolean).join(' ');
    
    // Dropdown item classes
    const getItemClasses = (item: SplitButtonItem, index: number) => [
      DESIGN_TOKENS.recipe.dropdown.item,
      item.disabled ? DESIGN_TOKENS.state.disabled : '',
      focusedIndex === index ? 'bg-slate-100 dark:bg-slate-800' : '',
      // Icon spacing
      item.icon ? 'gap-2' : ''
    ].filter(Boolean).join(' ');
    
    return (
      <div
        ref={ref}
        className={containerClasses}
        {...props}
      >
        {/* Split Button Group */}
        <div className={buttonGroupClasses}>
          {/* Main Action Button */}
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            pending={pending}
            onClick={handleMainClick}
            className={fullWidth ? 'flex-1' : ''}
            aria-label={ariaLabel}
            data-variant={variant}
            data-size={size}
          >
            {children}
          </Button>
          
          {/* Dropdown Trigger Button */}
          <button
            ref={triggerRef}
            type="button"
            className={dropdownTriggerClasses}
            disabled={disabled || pending}
            onClick={handleDropdownToggle}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label="Show more options"
            data-state={isOpen ? 'open' : 'closed'}
            data-variant={variant}
            data-size={size}
          >
            <ChevronDown 
              size={size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={dropdownContentClasses}
            role="menu"
            aria-orientation="vertical"
            data-placement={placement}
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={getItemClasses(item, index)}
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeDropdown();
                    triggerRef.current?.focus();
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
                role="menuitem"
                tabIndex={focusedIndex === index ? 0 : -1}
                aria-disabled={item.disabled}
              >
                {item.icon && (
                  <span className="flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SplitButton.displayName = 'SplitButton';

export default SplitButton;
