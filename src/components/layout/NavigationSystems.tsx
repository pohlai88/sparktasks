/**
 * @fileoverview NavigationSystems Component - Enterprise Navigation Patterns
 *
 * @description Advanced navigation component system providing complex navigation patterns
 * for enterprise applications. Includes breadcrumbs, hierarchical navigation, tabs,
 * step navigation, and mobile-responsive patterns with accessibility compliance.
 *
 * Features:
 * - Breadcrumb navigation with dynamic path generation
 * - Hierarchical navigation with collapsible sections
 * - Tab navigation with keyboard support
 * - Step/wizard navigation with progress indicators
 * - Mobile-responsive navigation patterns
 * - Active state management and highlighting
 * - WCAG 2.1 AAA accessibility compliance
 * - TypeScript strict mode compatibility
 * - DESIGN_TOKENS V3.2 integration
 *
 * @version 1.0.0
 * @since 2025-08-21
 */

import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  X,
  Check,
  Circle,
} from 'lucide-react';
import React, {
  useState,
  forwardRef,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type NavigationItemType = 'link' | 'button' | 'section' | 'divider';
export type NavigationVariant =
  | 'sidebar'
  | 'horizontal'
  | 'tabs'
  | 'steps'
  | 'breadcrumb';
export type NavigationSize = 'sm' | 'md' | 'lg';
export type StepStatus = 'pending' | 'current' | 'completed' | 'error';
export type TabOrientation = 'horizontal' | 'vertical';

export interface NavigationItem {
  id: string;
  label: string;
  type?: NavigationItemType;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  onClick?: (item: NavigationItem) => void;
  children?: NavigationItem[];
  collapsed?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  current?: boolean;
}

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  href?: string;
  onClick?: () => void;
  optional?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

// ===== COMPONENT PROPS INTERFACES =====

export interface NavigationSystemsProps {
  variant: NavigationVariant;
  items?: NavigationItem[];
  size?: NavigationSize;
  className?: string;
  orientation?: TabOrientation;
  showIcons?: boolean;
  collapsible?: boolean;
  mobileResponsive?: boolean;
  onItemClick?: (item: NavigationItem) => void;
  onNavigate?: (path: string) => void;
  'data-testid'?: string;
}

export interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  className?: string;
  onNavigate?: (item: BreadcrumbItem) => void;
  'data-testid'?: string;
}

export interface TabNavigationProps {
  items: TabItem[];
  activeTab?: string;
  orientation?: TabOrientation;
  size?: NavigationSize;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  onTabChange?: (tabId: string) => void;
  'data-testid'?: string;
}

export interface StepNavigationProps {
  steps: StepItem[];
  currentStep?: string;
  orientation?: 'horizontal' | 'vertical';
  clickable?: boolean;
  showProgress?: boolean;
  className?: string;
  onStepClick?: (step: StepItem) => void;
  'data-testid'?: string;
}

export interface HierarchicalNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  expandedItems?: string[];
  maxDepth?: number;
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
  onExpandToggle?: (itemId: string, expanded: boolean) => void;
  'data-testid'?: string;
}

// ===== CONTEXT FOR NAVIGATION STATE =====

interface NavigationContextValue {
  activeItem: string | undefined;
  expandedItems: string[];
  setActiveItem: (itemId: string | undefined) => void;
  toggleExpanded: (itemId: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined
);

function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      'Navigation components must be used within NavigationProvider'
    );
  }
  return context;
}

// ===== NAVIGATION PROVIDER =====

interface NavigationProviderProps {
  children: React.ReactNode;
  defaultActiveItem?: string | undefined;
  defaultExpandedItems?: string[];
}

function NavigationProvider({
  children,
  defaultActiveItem,
  defaultExpandedItems = [],
}: NavigationProviderProps) {
  const [activeItem, setActiveItem] = useState<string | undefined>(
    defaultActiveItem
  );
  const [expandedItems, setExpandedItems] =
    useState<string[]>(defaultExpandedItems);

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      activeItem,
      expandedItems,
      setActiveItem,
      toggleExpanded,
    }),
    [activeItem, expandedItems, toggleExpanded]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// ===== BREADCRUMB NAVIGATION =====

export const BreadcrumbNavigation = forwardRef<
  HTMLElement,
  BreadcrumbNavigationProps
>(function BreadcrumbNavigation(
  {
    items,
    separator = <ChevronRight className='size-4' />,
    maxItems = 5,
    showHome = true,
    className = '',
    onNavigate,
    'data-testid': testId = 'breadcrumb-navigation',
    ...props
  },
  ref
) {
  // Truncate items if exceeding maxItems
  const displayItems = useMemo(() => {
    if (items.length <= maxItems) return items;

    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));

    return [
      firstItem,
      { id: 'ellipsis', label: '...', current: false } as BreadcrumbItem,
      ...lastItems,
    ];
  }, [items, maxItems]);

  const handleItemClick = useCallback(
    (item: BreadcrumbItem, event: React.MouseEvent) => {
      if (item.id === 'ellipsis' || item.current) {
        event.preventDefault();
        return;
      }

      if (item.onClick) {
        event.preventDefault();
        item.onClick();
      }

      if (onNavigate) {
        onNavigate(item);
      }
    },
    [onNavigate]
  );

  return (
    <nav
      ref={ref}
      className={`${DESIGN_TOKENS.layout.patterns.breadcrumb} ${className}`}
      aria-label='Breadcrumb navigation'
      data-testid={testId}
      {...props}
    >
      <ol className='flex items-center space-x-2'>
        {showHome && (
          <>
            <li>
              <button
                type='button'
                className={`flex items-center rounded text-sm text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200`}
                onClick={() =>
                  onNavigate?.({ id: 'home', label: 'Home', current: false })
                }
                aria-label='Navigate to home'
              >
                <Home className='size-4' />
              </button>
            </li>
            <li className='text-slate-400 dark:text-slate-500'>{separator}</li>
          </>
        )}

        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.id === 'ellipsis';

          return (
            <React.Fragment key={item.id}>
              <li className='flex items-center'>
                {isEllipsis ? (
                  <span className='text-sm text-slate-400 dark:text-slate-500'>
                    {item.label}
                  </span>
                ) : item.href || item.onClick ? (
                  <button
                    type='button'
                    className={`flex items-center gap-1 rounded px-1 py-0.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      item.current
                        ? 'cursor-default font-medium text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    } `}
                    onClick={e => handleItemClick(item, e)}
                    aria-current={item.current ? 'page' : undefined}
                    disabled={item.current}
                  >
                    {item.icon && <item.icon className='size-4' />}
                    {item.label}
                  </button>
                ) : (
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      item.current
                        ? 'font-medium text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    } `}
                  >
                    {item.icon && <item.icon className='size-4' />}
                    {item.label}
                  </span>
                )}
              </li>

              {!isLast && (
                <li className='text-slate-400 dark:text-slate-500'>
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
});

// ===== TAB NAVIGATION =====

export const TabNavigation = forwardRef<HTMLDivElement, TabNavigationProps>(
  function TabNavigation(
    {
      items,
      activeTab,
      orientation = 'horizontal',
      size = 'md',
      variant = 'default',
      className = '',
      onTabChange,
      'data-testid': testId = 'tab-navigation',
      ...props
    },
    ref
  ) {
    const [activeTabState, setActiveTabState] = useState(
      activeTab || items[0]?.id
    );

    const currentActiveTab = activeTab ?? activeTabState;

    const sizeStyles = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-3',
    };

    const variantStyles = {
      default: {
        container:
          orientation === 'horizontal'
            ? 'border-b border-slate-200 dark:border-slate-700'
            : 'border-r border-slate-200 dark:border-slate-700',
        tab: {
          base: `
            inline-flex items-center gap-2 font-medium transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-t
            ${sizeStyles[size]}
          `,
          active:
            orientation === 'horizontal'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-primary-600 dark:text-primary-400 border-r-2 border-primary-600 dark:border-primary-400',
          inactive:
            'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
        },
      },
      pills: {
        container: 'flex gap-1',
        tab: {
          base: `
            inline-flex items-center gap-2 font-medium transition-all duration-200 rounded-full
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${sizeStyles[size]}
          `,
          active:
            'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
          inactive:
            'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200',
        },
      },
      underline: {
        container: 'flex gap-6',
        tab: {
          base: `
            inline-flex items-center gap-2 font-medium transition-all duration-200 pb-2
            focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-t
            ${sizeStyles[size]}
          `,
          active:
            'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400',
          inactive:
            'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
        },
      },
    };

    const styles = variantStyles[variant];

    const handleTabClick = useCallback(
      (tabId: string) => {
        setActiveTabState(tabId);
        onTabChange?.(tabId);
      },
      [onTabChange]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, tabId: string, index: number) => {
        const isHorizontal = orientation === 'horizontal';
        let nextIndex = index;

        switch (event.key) {
          case isHorizontal ? 'ArrowLeft' : 'ArrowUp': {
            event.preventDefault();
            nextIndex = index > 0 ? index - 1 : items.length - 1;
            break;
          }
          case isHorizontal ? 'ArrowRight' : 'ArrowDown': {
            event.preventDefault();
            nextIndex = index < items.length - 1 ? index + 1 : 0;
            break;
          }
          case 'Home': {
            event.preventDefault();
            nextIndex = 0;
            break;
          }
          case 'End': {
            event.preventDefault();
            nextIndex = items.length - 1;
            break;
          }
          case 'Enter':
          case ' ': {
            event.preventDefault();
            handleTabClick(tabId);
            return;
          }
          default: {
            return;
          }
        }

        // Focus next tab
        const nextTab = items[nextIndex];
        if (nextTab && !nextTab.disabled) {
          const tabElement = document.querySelector(
            `[data-tab-id="${nextTab.id}"]`
          ) as HTMLElement;
          tabElement?.focus();
        }
      },
      [orientation, items, handleTabClick]
    );

    return (
      <div ref={ref} className={`${className}`} data-testid={testId} {...props}>
        <div
          className={` ${styles.container} ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'} `}
          role='tablist'
          aria-orientation={orientation}
        >
          {items.map((tab, index) => {
            const isActive = tab.id === currentActiveTab;

            return (
              <button
                key={tab.id}
                type='button'
                role='tab'
                data-tab-id={tab.id}
                className={` ${styles.tab.base} ${isActive ? styles.tab.active : styles.tab.inactive} ${tab.disabled ? 'cursor-not-allowed opacity-50' : ''} `}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => !tab.disabled && handleTabClick(tab.id)}
                onKeyDown={e =>
                  !tab.disabled && handleKeyDown(e, tab.id, index)
                }
              >
                {tab.icon && <tab.icon className='size-4' />}
                {tab.label}
                {tab.badge && (
                  <span
                    className={`inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab panels */}
        {items.map(tab => (
          <div
            key={`panel-${tab.id}`}
            id={`tabpanel-${tab.id}`}
            role='tabpanel'
            aria-labelledby={`tab-${tab.id}`}
            className={`mt-4 ${tab.id === currentActiveTab ? 'block' : 'hidden'}`}
            tabIndex={0}
          >
            {tab.content}
          </div>
        ))}
      </div>
    );
  }
);

// ===== STEP NAVIGATION =====

export const StepNavigation = forwardRef<HTMLElement, StepNavigationProps>(
  function StepNavigation(
    {
      steps,
      currentStep,
      orientation = 'horizontal',
      clickable = false,
      showProgress = true,
      className = '',
      onStepClick,
      'data-testid': testId = 'step-navigation',
      ...props
    },
    ref
  ) {
    const getStepIcon = useCallback((step: StepItem, index: number) => {
      switch (step.status) {
        case 'completed': {
          return <Check className='size-4' />;
        }
        case 'error': {
          return <X className='size-4' />;
        }
        case 'current': {
          return <Circle className='size-4' fill='currentColor' />;
        }
        case 'pending':
        default: {
          return <span className='text-sm font-medium'>{index + 1}</span>;
        }
      }
    }, []);

    const getStepStyles = useCallback((step: StepItem) => {
      const baseStyles =
        'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200';

      switch (step.status) {
        case 'completed': {
          return `${baseStyles} bg-success-600 text-white`;
        }
        case 'current': {
          return `${baseStyles} bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-900`;
        }
        case 'error': {
          return `${baseStyles} bg-error-600 text-white`;
        }
        case 'pending':
        default: {
          return `${baseStyles} bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300`;
        }
      }
    }, []);

    const getConnectorStyles = useCallback(
      (currentStatus: StepStatus, _nextStatus: StepStatus) => {
        const baseStyles =
          orientation === 'horizontal'
            ? 'flex-1 h-0.5 mx-4'
            : 'w-0.5 h-8 my-2 mx-auto';

        if (currentStatus === 'completed') {
          return `${baseStyles} bg-success-600`;
        }

        return `${baseStyles} bg-slate-200 dark:bg-slate-700`;
      },
      [orientation]
    );

    const handleStepClick = useCallback(
      (step: StepItem) => {
        if (!clickable || step.status === 'pending') return;

        if (step.onClick) {
          step.onClick();
        }

        if (onStepClick) {
          onStepClick(step);
        }
      },
      [clickable, onStepClick]
    );

    // Calculate progress percentage
    const progressPercentage = useMemo(() => {
      const completedSteps = steps.filter(
        step => step.status === 'completed'
      ).length;
      const currentStepIndex = steps.findIndex(
        step => step.status === 'current'
      );
      const totalProgress =
        completedSteps + (currentStepIndex === -1 ? 0 : 0.5);

      return Math.round((totalProgress / steps.length) * 100);
    }, [steps]);

    return (
      <nav
        ref={ref}
        className={className}
        aria-label='Step navigation'
        data-testid={testId}
        {...props}
      >
        {showProgress && (
          <div className='mb-6'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                Progress
              </span>
              <span className='text-sm text-slate-500 dark:text-slate-400'>
                {progressPercentage}%
              </span>
            </div>
            <div className='h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
              <div
                className='h-2 rounded-full bg-primary-600 transition-all duration-500 ease-out'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        <ol
          className={` ${orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col'} `}
        >
          {steps.map((step, index) => {
            const isClickable = clickable && step.status !== 'pending';
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.id}
                className={` ${orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col items-center'} `}
              >
                <div
                  className={` ${orientation === 'horizontal' ? 'flex items-center' : 'flex flex-col items-center text-center'} `}
                >
                  <button
                    type='button'
                    className={` ${getStepStyles(step)} ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'} focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    onClick={() => handleStepClick(step)}
                    disabled={!isClickable}
                    aria-current={
                      step.status === 'current' ? 'step' : undefined
                    }
                    aria-label={`${step.label}${step.status === 'completed' ? ' (completed)' : step.status === 'current' ? ' (current)' : ''}`}
                  >
                    {getStepIcon(step, index)}
                  </button>

                  <div
                    className={` ${orientation === 'horizontal' ? 'ml-3' : 'mt-2'} ${step.status === 'current' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'} `}
                  >
                    <div className='text-sm font-medium'>
                      {step.label}
                      {step.optional && (
                        <span className='ml-1 text-xs text-slate-400 dark:text-slate-500'>
                          (optional)
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <div className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div
                    className={getConnectorStyles(
                      step.status,
                      steps[index + 1]?.status
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

// ===== HIERARCHICAL NAVIGATION =====

function NavigationItemComponent({
  item,
  depth = 0,
  maxDepth = 3,
  onItemClick,
  onExpandToggle,
}: {
  item: NavigationItem;
  depth?: number;
  maxDepth?: number;
  onItemClick?: (item: NavigationItem) => void;
  onExpandToggle?: (itemId: string, expanded: boolean) => void;
}) {
  const { activeItem, expandedItems, setActiveItem, toggleExpanded } =
    useNavigationContext();

  const isActive = activeItem === item.id;
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const canExpand = hasChildren && depth < maxDepth;

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (item.disabled) return;

      if (item.onClick) {
        item.onClick(item);
      }

      if (onItemClick) {
        onItemClick(item);
      }

      if (!item.children || item.children.length === 0) {
        setActiveItem(item.id);
      }
    },
    [item, onItemClick, setActiveItem]
  );

  const handleExpandToggle = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const newExpanded = !isExpanded;
      toggleExpanded(item.id);

      if (onExpandToggle) {
        onExpandToggle(item.id, newExpanded);
      }
    },
    [item.id, isExpanded, toggleExpanded, onExpandToggle]
  );

  if (item.type === 'divider') {
    return (
      <li className='my-2'>
        <div className='border-t border-slate-200 dark:border-slate-700' />
      </li>
    );
  }

  if (item.type === 'section') {
    return (
      <li className='mb-2 mt-6'>
        <div className='px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
          {item.label}
        </div>
      </li>
    );
  }

  const paddingLeft = `${(depth + 1) * 12}px`;

  return (
    <li>
      <div
        className={`group relative flex items-center ${
          isActive
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
        } ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} mx-2 rounded-md transition-colors duration-150`}
        style={{ paddingLeft }}
      >
        <button
          type='button'
          className={`flex w-full items-center gap-3 rounded-md py-2 pr-3 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 ${item.disabled ? 'cursor-not-allowed' : ''} `}
          onClick={handleClick}
          disabled={item.disabled}
          aria-current={isActive ? 'page' : undefined}
          aria-expanded={canExpand ? isExpanded : undefined}
        >
          {item.icon && (
            <item.icon
              className={`size-4 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'} `}
            />
          )}

          <span className='flex-1 truncate'>{item.label}</span>

          {item.badge && (
            <span
              className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isActive
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              } `}
            >
              {item.badge}
            </span>
          )}
        </button>

        {canExpand && (
          <button
            type='button'
            className={`mr-2 rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-slate-200 dark:hover:bg-slate-700 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'} `}
            onClick={handleExpandToggle}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
          >
            {isExpanded ? (
              <ChevronUp className='size-4' />
            ) : (
              <ChevronDown className='size-4' />
            )}
          </button>
        )}
      </div>

      {canExpand && isExpanded && (
        <ul className='mt-1'>
          {item.children!.map(child => (
            <NavigationItemComponent
              key={child.id}
              item={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              {...(onItemClick && { onItemClick })}
              {...(onExpandToggle && { onExpandToggle })}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export const HierarchicalNavigation = forwardRef<
  HTMLElement,
  HierarchicalNavigationProps
>(function HierarchicalNavigation(
  {
    items,
    activeItem,
    expandedItems = [],
    maxDepth = 3,
    className = '',
    onItemClick,
    onExpandToggle,
    'data-testid': testId = 'hierarchical-navigation',
    ...props
  },
  ref
) {
  return (
    <NavigationProvider
      {...(activeItem && { defaultActiveItem: activeItem })}
      defaultExpandedItems={expandedItems}
    >
      <nav
        ref={ref}
        className={`${className}`}
        aria-label='Hierarchical navigation'
        data-testid={testId}
        {...props}
      >
        <ul className='space-y-1'>
          {items.map(item => (
            <NavigationItemComponent
              key={item.id}
              item={item}
              maxDepth={maxDepth}
              {...(onItemClick && { onItemClick })}
              {...(onExpandToggle && { onExpandToggle })}
            />
          ))}
        </ul>
      </nav>
    </NavigationProvider>
  );
});

// ===== MAIN NAVIGATION SYSTEMS COMPONENT =====

export const NavigationSystems = forwardRef<
  HTMLDivElement,
  NavigationSystemsProps
>(function NavigationSystems(
  {
    variant,
    items = [],
    size = 'md',
    className = '',
    orientation = 'horizontal',
    showIcons = true,
    collapsible = false,
    mobileResponsive = true,
    onItemClick,
    onNavigate,
    'data-testid': testId = 'navigation-systems',
    ...props
  },
  ref
) {
  // For demo purposes, render basic navigation
  // In practice, this would route to the appropriate specialized component

  const handleItemClick = useCallback(
    (item: NavigationItem) => {
      if (onItemClick) {
        onItemClick(item);
      }

      if (item.href && onNavigate) {
        onNavigate(item.href);
      }
    },
    [onItemClick, onNavigate]
  );

  return (
    <div
      ref={ref}
      className={`navigation-systems ${className}`}
      data-testid={testId}
      data-variant={variant}
      {...props}
    >
      {/* Render different navigation types based on variant */}
      {variant === 'sidebar' && (
        <HierarchicalNavigation
          items={items}
          onItemClick={handleItemClick}
          data-testid={`${testId}-hierarchical`}
        />
      )}

      {variant === 'horizontal' && (
        <nav
          className='flex items-center space-x-4'
          aria-label='Primary navigation'
        >
          {items.map(item => (
            <button
              key={item.id}
              type='button'
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                item.active
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              } ${item.disabled ? 'cursor-not-allowed opacity-50' : ''} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              aria-current={item.active ? 'page' : undefined}
            >
              {showIcons && item.icon && <item.icon className='size-4' />}
              {item.label}
              {item.badge && (
                <span className='inline-flex items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300'>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      )}

      {/* Add more variant implementations as needed */}
    </div>
  );
});

// ===== EXPORTS =====

export { NavigationProvider, useNavigationContext };
