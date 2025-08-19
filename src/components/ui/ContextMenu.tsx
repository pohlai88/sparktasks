import React, { 
  createContext, 
  useContext, 
  useState, 
  useRef, 
  useEffect, 
  useCallback,
  ReactNode,
  MouseEvent,
  KeyboardEvent
} from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPES =====
interface MenuItem {
  id: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
}

interface ContextMenuContextType {
  showMenu: (event: MouseEvent, items: MenuItem[]) => void;
  hideMenu: () => void;
  isVisible: boolean;
}

interface ContextMenuProviderProps {
  children: ReactNode;
}

interface ContextMenuTriggerProps {
  children: ReactNode;
  items: MenuItem[];
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  visible: boolean;
}

interface ContextMenuItemProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onClose: () => void;
  isActive?: boolean;
  onActivate?: () => void;
}

// ===== CONTEXT =====
const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

// ===== HOOK =====
export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
};

// ===== CONTEXT MENU ITEM COMPONENT =====
const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ 
  item, 
  onSelect, 
  onClose,
  isActive = false,
  onActivate
}) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [submenuSide, setSubmenuSide] = useState<'right' | 'left'>('right');
  const itemRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number>();

  const hasSubmenu = !!(item.submenu && item.submenu.length > 0);

  // Focus this item when it becomes active
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.focus();
    }
  }, [isActive]);

  // Submenu positioning collision detection
  useEffect(() => {
    if (!showSubmenu || !submenuRef.current) return;
    
    const rect = submenuRef.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      setSubmenuSide('left');
    } else {
      setSubmenuSide('right');
    }
  }, [showSubmenu]);

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (item.disabled) return;
    
    if (hasSubmenu) {
      setShowSubmenu(!showSubmenu);
    } else {
      item.onClick?.();
      onSelect(item);
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!item.disabled) {
          if (hasSubmenu) {
            setShowSubmenu(!showSubmenu);
          } else {
            item.onClick?.();
            onSelect(item);
            onClose();
          }
        }
        break;
      case 'ArrowRight':
        if (hasSubmenu) {
          event.preventDefault();
          setShowSubmenu(true);
        }
        break;
      case 'ArrowLeft':
        if (hasSubmenu && showSubmenu) {
          event.preventDefault();
          setShowSubmenu(false);
          itemRef.current?.focus();
        }
        break;
        // Note: Escape is handled at the menu level, not here
    }
  };

  const handleMouseEnter = () => {
    onActivate?.();
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    if (hasSubmenu) {
      setShowSubmenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasSubmenu) {
      closeTimerRef.current = window.setTimeout(() => {
        setShowSubmenu(false);
      }, 150); // Pointer intent grace period
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (item.divider) {
    return (
      <div 
        className={`h-px my-1 ${DESIGN_TOKENS.semantic.border.muted}`}
        role="separator"
        data-slot="divider"
      />
    );
  }

  return (
    <div className="relative">
      <button
        ref={itemRef}
        type="button"
        className={`
          w-full text-left
          ${DESIGN_TOKENS.recipe.dropdown.item}
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${item.danger ? `${DESIGN_TOKENS.semantic.text.error} hover:${DESIGN_TOKENS.semantic.background.error}` : ''}
          ${showSubmenu ? DESIGN_TOKENS.theme.light.surface.subtle : ''}
        `}
        role="menuitem"
        disabled={!!item.disabled}
        tabIndex={isActive ? 0 : -1}
        aria-disabled={!!item.disabled}
        aria-haspopup={hasSubmenu ? 'menu' : undefined}
        aria-expanded={hasSubmenu ? showSubmenu : undefined}
        data-slot="item"
        data-item-id={item.id}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-2">
          {item.icon && (
            <span className={`flex-shrink-0 ${DESIGN_TOKENS.icon.size.sm}`} aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="flex-1">{item.label}</span>
          {hasSubmenu && (
            <span className={`${DESIGN_TOKENS.icon.size.sm} ${DESIGN_TOKENS.semantic.text.muted}`} aria-hidden="true">
              ▶
            </span>
          )}
        </div>
      </button>

      {/* Submenu */}
      {showSubmenu && hasSubmenu && (
        <div
          ref={submenuRef}
          className={`
            absolute ${submenuSide === 'right' ? 'left-full ml-1' : 'right-full mr-1'} top-0
            ${DESIGN_TOKENS.recipe.dropdown.content}
            ${DESIGN_TOKENS.theme.light.surface.base}
            ${DESIGN_TOKENS.theme.light.elevation.dropdown}
            ${DESIGN_TOKENS.zIndex.popover}
            ${DESIGN_TOKENS.motion.smooth}
          `}
          role="menu"
          aria-label={`${item.label} submenu`}
          data-slot="submenu"
          data-parent-id={item.id}
          onMouseEnter={() => {
            if (closeTimerRef.current) {
              clearTimeout(closeTimerRef.current);
            }
          }}
        >
          {item.submenu!.map((subItem, index) => (
            <ContextMenuItem
              key={subItem.id || index}
              item={subItem}
              onSelect={onSelect}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== CONTEXT MENU COMPONENT =====
const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, 
  y, 
  items, 
  onClose, 
  visible 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [typeaheadBuffer, setTypeaheadBuffer] = useState('');

  // Filter enabled items for roving focus
  const enabledItems = items.filter(item => !item.divider && !item.disabled);
  
  // Navigation helpers
  const move = (direction: 1 | -1) => {
    setActiveIdx(current => {
      const newIdx = (current + direction + enabledItems.length) % enabledItems.length;
      return newIdx;
    });
  };

  // Typeahead search
  const handleTypeahead = (character: string) => {
    const newBuffer = typeaheadBuffer + character.toLowerCase();
    setTypeaheadBuffer(newBuffer);
    
    const matchIdx = enabledItems.findIndex(item => 
      item.label?.toLowerCase().startsWith(newBuffer)
    );
    
    if (matchIdx >= 0) {
      setActiveIdx(matchIdx);
    }
  };

  // Clear typeahead buffer after delay
  useEffect(() => {
    if (!typeaheadBuffer) return;
    const timer = setTimeout(() => setTypeaheadBuffer(''), 500);
    return () => clearTimeout(timer);
  }, [typeaheadBuffer]);

  // Reset active index when menu opens
  useEffect(() => {
    if (visible) {
      setActiveIdx(0);
      setTypeaheadBuffer('');
    }
  }, [visible]);

  // Focus management - focus first item when menu opens
  useEffect(() => {
    if (!visible || !menuRef.current) return;
    
    // Small delay to ensure menu is rendered
    const timer = setTimeout(() => {
      const firstButton = menuRef.current?.querySelector('button[data-slot="item"]:not([disabled])') as HTMLButtonElement;
      firstButton?.focus();
    }, 10);
    
    return () => clearTimeout(timer);
  }, [visible]);

  // Keyboard navigation at menu level
  const handleMenuKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIdx(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIdx(enabledItems.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        // Typeahead
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          handleTypeahead(event.key);
        }
        break;
    }
  };

  // Adjust position to keep menu within viewport
  useEffect(() => {
    if (!menuRef.current || !visible) return;

    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 8;
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 8;
    }

    // Ensure minimum distance from edges
    adjustedX = Math.max(8, adjustedX);
    adjustedY = Math.max(8, adjustedY);

    setPosition({ x: adjustedX, y: adjustedY });
  }, [x, y, visible]);

  // Handle clicks outside menu, scroll, and resize (escape handled at menu level)
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleDismiss = () => onClose();

    // Small delay to prevent immediate closure from the triggering right-click
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('contextmenu', handleClickOutside, true);
      window.addEventListener('resize', handleDismiss, { passive: true });
      window.addEventListener('scroll', handleDismiss, { passive: true });
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('contextmenu', handleClickOutside, true);
      window.removeEventListener('resize', handleDismiss);
      window.removeEventListener('scroll', handleDismiss);
    };
  }, [visible, onClose]);

  const handleItemSelect = (_item: MenuItem) => {
    // Item selection is handled in ContextMenuItem
  };

  if (!visible || items.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`
        fixed
        ${DESIGN_TOKENS.recipe.dropdown.content}
        ${DESIGN_TOKENS.theme.light.surface.base}
        ${DESIGN_TOKENS.theme.light.elevation.dropdown}
        ${DESIGN_TOKENS.zIndex.popover}
        ${DESIGN_TOKENS.motion.semantic.modalEnter}
      `}
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '12rem'
      }}
      role="menu"
      aria-label="Context menu"
      data-slot="menu"
      onKeyDown={handleMenuKeyDown}
    >
      {items.map((item, index) => {
        // Calculate if this item is active (for non-dividers)
        const enabledIndex = enabledItems.findIndex(enabledItem => enabledItem === item);
        const isActive = enabledIndex >= 0 && enabledIndex === activeIdx;
        
        return (
          <ContextMenuItem
            key={item.id || index}
            item={item}
            onSelect={handleItemSelect}
            onClose={onClose}
            isActive={isActive}
            onActivate={() => setActiveIdx(enabledIndex)}
          />
        );
      })}
    </div>
  );
};

// ===== CONTEXT MENU TRIGGER =====
export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({ 
  children, 
  items, 
  disabled = false 
}) => {
  const { showMenu } = useContextMenu();

  const handleContextMenu = (event: MouseEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    showMenu(event, items);
  };

  return (
    <div 
      onContextMenu={handleContextMenu}
      style={{ userSelect: 'none' }}
    >
      {children}
    </div>
  );
};

// ===== CONTEXT MENU PROVIDER =====
export const ContextMenuProvider: React.FC<ContextMenuProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const showMenu = useCallback((event: MouseEvent, items: MenuItem[]) => {
    event.preventDefault();
    event.stopPropagation();
    
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setMenuItems(items);
    setIsVisible(true);
  }, []);

  const hideMenu = useCallback(() => {
    setIsVisible(false);
    setMenuItems([]);
  }, []);

  const contextValue: ContextMenuContextType = {
    showMenu,
    hideMenu,
    isVisible,
  };

  return (
    <ContextMenuContext.Provider value={contextValue}>
      {children}
      {isVisible && (
        <ContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          items={menuItems}
          onClose={hideMenu}
          visible={isVisible}
        />
      )}
    </ContextMenuContext.Provider>
  );
};

// ===== EXPORTS =====
export { ContextMenu };
export type { MenuItem, ContextMenuContextType };
