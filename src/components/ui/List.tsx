/**
 * List Component System - Enterprise Structured Lists
 * 
 * A comprehensive list component system providing structured data presentation
 * with enterprise-grade functionality including:
 * - Multiple layout patterns (single-line, multi-line, with icons/avatars)
 * - Interactive capabilities (selection, hover states, keyboard navigation)
 * - Semantic variants (success, warning, error, info states)
 * - Accessibility compliance (ARIA patterns, keyboard navigation)
 * - Compound component architecture (List + ListItem + Content/Action/Icon)
 * 
 * @version 1.0.0
 * @author SparkTasks Enterprise UI Team
 */

import React, { createContext, useContext, forwardRef } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type ListVariant = 'default' | 'bordered' | 'flush' | 'spaced' | 'relaxed';
export type ListSize = 'sm' | 'md' | 'lg' | 'xl';
export type ListItemVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type ListItemLayout = 'singleLine' | 'multiLine' | 'withIcon' | 'withAvatar' | 'withAction';
export type ListItemSpacing = 'compact' | 'comfortable' | 'spacious';

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: ListVariant;
  /** Size variant affecting text and spacing */
  size?: ListSize;
  /** Whether list has background styling */
  background?: 'none' | 'subtle' | 'elevated';
  /** Whether list items are interactive */
  interactive?: boolean;
  /** Whether list items have hover effects */
  hoverable?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Empty state content */
  emptyContent?: React.ReactNode;
  /** ARIA label for the list */
  'aria-label'?: string;
  children?: React.ReactNode;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: ListItemVariant;
  /** Layout pattern for content arrangement */
  layout?: ListItemLayout;
  /** Spacing variant */
  spacing?: ListItemSpacing;
  /** Whether item is interactive (undefined = inherit from context) */
  interactive?: boolean;
  /** Whether item is selected */
  selected?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Click handler for interactive items */
  onSelect?: () => void;
  /** ARIA role override */
  role?: string;
  children: React.ReactNode;
}

export interface ListItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary title text */
  title?: string;
  /** Secondary subtitle text */
  subtitle?: string;
  /** Descriptive text content */
  description?: string;
  /** Meta information text */
  meta?: string;
  children?: React.ReactNode;
}

export interface ListItemIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon variant affecting color */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export interface ListItemActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ===== CONTEXT =====

interface ListContextValue {
  size: ListSize;
  interactive: boolean;
  hoverable: boolean;
}

const ListContext = createContext<ListContextValue>({
  size: 'md',
  interactive: false,
  hoverable: false,
});

// ===== UTILITY FUNCTIONS =====

const getListClasses = (
  variant: ListVariant,
  size: ListSize,
  background: 'none' | 'subtle' | 'elevated',
  interactive: boolean,
  hoverable: boolean
) => {
  const baseClasses = DESIGN_TOKENS.recipe.list.base;
  const variantClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.list 
    ? DESIGN_TOKENS.recipe.list[variant as keyof typeof DESIGN_TOKENS.recipe.list] 
    : '';
  const sizeClasses = size in DESIGN_TOKENS.recipe.list 
    ? DESIGN_TOKENS.recipe.list[size as keyof typeof DESIGN_TOKENS.recipe.list] 
    : '';
  const backgroundClasses = background !== 'none' && background in DESIGN_TOKENS.recipe.list 
    ? DESIGN_TOKENS.recipe.list[background as keyof typeof DESIGN_TOKENS.recipe.list] 
    : '';
  const interactiveClasses = interactive ? DESIGN_TOKENS.recipe.list.interactive : '';
  const hoverableClasses = hoverable ? DESIGN_TOKENS.recipe.list.hoverable : '';

  return combineTokens(baseClasses, variantClasses, sizeClasses, backgroundClasses, interactiveClasses, hoverableClasses);
};

const getListItemClasses = (
  variant: ListItemVariant,
  layout: ListItemLayout,
  spacing: ListItemSpacing,
  interactive: boolean,
  selected: boolean,
  disabled: boolean,
  hoverable: boolean
) => {
  const baseClasses = DESIGN_TOKENS.recipe.listItem.base;
  const variantClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.listItem 
    ? DESIGN_TOKENS.recipe.listItem[variant as keyof typeof DESIGN_TOKENS.recipe.listItem] 
    : '';
  const layoutClasses = layout in DESIGN_TOKENS.recipe.listItem 
    ? DESIGN_TOKENS.recipe.listItem[layout as keyof typeof DESIGN_TOKENS.recipe.listItem] 
    : '';
  const spacingClasses = spacing in DESIGN_TOKENS.recipe.listItem 
    ? DESIGN_TOKENS.recipe.listItem[spacing as keyof typeof DESIGN_TOKENS.recipe.listItem] 
    : '';
  const interactiveClasses = interactive || hoverable ? DESIGN_TOKENS.recipe.listItem.interactive : '';
  const selectedClasses = selected ? DESIGN_TOKENS.recipe.listItem.selected : '';
  const disabledClasses = disabled ? DESIGN_TOKENS.recipe.listItem.disabled : '';

  return combineTokens(
    baseClasses,
    variantClasses,
    layoutClasses,
    spacingClasses,
    interactiveClasses,
    selectedClasses,
    disabledClasses
  );
};

// ===== LOADING SKELETON =====

const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className={DESIGN_TOKENS.recipe.list.base}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className={combineTokens(DESIGN_TOKENS.recipe.listItem.base, 'animate-pulse')}>
        <div className="flex items-center space-x-3">
          <div className={DESIGN_TOKENS.recipe.skeleton.avatar} />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ===== EMPTY STATE =====

const ListEmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-slate-400 dark:text-slate-500 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <div className="text-slate-600 dark:text-slate-400">{children}</div>
  </div>
);

// ===== MAIN COMPONENTS =====

const ListComponent = forwardRef<HTMLDivElement, ListProps>(({
  variant = 'default',
  size = 'md',
  background = 'none',
  interactive = false,
  hoverable = false,
  loading = false,
  emptyContent,
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const listClasses = getListClasses(variant, size, background, interactive, hoverable);

  // Handle loading state
  if (loading) {
    return (
      <div
        ref={ref}
        className={combineTokens(listClasses, className)}
        role="list"
        aria-label={ariaLabel}
        {...props}
      >
        <ListSkeleton />
      </div>
    );
  }

  // Handle empty state
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length === 0 && emptyContent) {
    return (
      <div
        ref={ref}
        className={combineTokens(listClasses, className)}
        role="list"
        aria-label={ariaLabel}
        {...props}
      >
        <ListEmptyState>{emptyContent}</ListEmptyState>
      </div>
    );
  }

  return (
    <ListContext.Provider value={{ size, interactive, hoverable }}>
      <div
        ref={ref}
        className={combineTokens(listClasses, className)}
        role="list"
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </div>
    </ListContext.Provider>
  );
});

ListComponent.displayName = 'List';

const ListItemComponent = forwardRef<HTMLDivElement, ListItemProps>(({
  variant = 'default',
  layout = 'singleLine',
  spacing = 'comfortable',
  interactive,
  selected = false,
  disabled = false,
  onSelect,
  className,
  children,
  role = 'listitem',
  onClick,
  onKeyDown,
  tabIndex,
  ...props
}, ref) => {
  const context = useContext(ListContext);
  
  // Determine if interactive: explicit prop takes priority over context
  const isInteractive = interactive !== undefined 
    ? interactive || !!onSelect 
    : context.interactive || !!onSelect;
    
  const hasHover = context.hoverable && !disabled;

  const itemClasses = getListItemClasses(
    variant,
    layout,
    spacing,
    isInteractive,
    selected,
    disabled,
    hasHover
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(event);
    onSelect?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    onKeyDown?.(event);
    
    if ((event.key === 'Enter' || event.key === ' ') && onSelect) {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      ref={ref}
      className={combineTokens(itemClasses, className)}
      role={role}
      tabIndex={isInteractive && !disabled ? (tabIndex ?? 0) : undefined}
      aria-selected={selected}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
});

ListItemComponent.displayName = 'ListItem';

const ListItemContentComponent = forwardRef<HTMLDivElement, ListItemContentProps>(({
  title,
  subtitle,
  description,
  meta,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={combineTokens(DESIGN_TOKENS.recipe.listItemContent.base, className)}
      {...props}
    >
      {title && (
        <div className={DESIGN_TOKENS.recipe.listItemContent.title}>
          {title}
        </div>
      )}
      {subtitle && (
        <div className={DESIGN_TOKENS.recipe.listItemContent.subtitle}>
          {subtitle}
        </div>
      )}
      {description && (
        <div className={DESIGN_TOKENS.recipe.listItemContent.description}>
          {description}
        </div>
      )}
      {meta && (
        <div className={DESIGN_TOKENS.recipe.listItemContent.meta}>
          {meta}
        </div>
      )}
      {children}
    </div>
  );
});

ListItemContentComponent.displayName = 'ListItem.Content';

const ListItemIconComponent = forwardRef<HTMLDivElement, ListItemIconProps>(({
  variant = 'default',
  className,
  children,
  ...props
}, ref) => {
  const iconClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.listItemIcon
    ? DESIGN_TOKENS.recipe.listItemIcon[variant as keyof typeof DESIGN_TOKENS.recipe.listItemIcon]
    : DESIGN_TOKENS.recipe.listItemIcon.base;

  return (
    <div
      ref={ref}
      className={combineTokens(iconClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
});

ListItemIconComponent.displayName = 'ListItem.Icon';

const ListItemActionComponent = forwardRef<HTMLDivElement, ListItemActionProps>(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={combineTokens(DESIGN_TOKENS.recipe.listItemAction.base, className)}
      {...props}
    >
      {children}
    </div>
  );
});

ListItemActionComponent.displayName = 'ListItem.Action';

// ===== COMPOUND COMPONENT EXPORT =====

export const List = Object.assign(ListComponent, {
  Item: ListItemComponent,
  Content: ListItemContentComponent,
  Icon: ListItemIconComponent,
  Action: ListItemActionComponent,
});

// ===== INDIVIDUAL EXPORTS =====

export const ListItem = Object.assign(ListItemComponent, {
  Content: ListItemContentComponent,
  Icon: ListItemIconComponent,
  Action: ListItemActionComponent,
});

export const ListItemContent = ListItemContentComponent;
export const ListItemIcon = ListItemIconComponent;
export const ListItemAction = ListItemActionComponent;

// ===== DEFAULT EXPORT =====

export default List;
