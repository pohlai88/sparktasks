import React, { useState, createContext, useContext } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: Tab[];
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultTab?: string;
  children: React.ReactNode;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({
  defaultTab,
  children,
  onChange,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  const tabs: Tab[] = [];

  // Extract tabs from children
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === TabsList) {
      React.Children.forEach(child.props.children, tabChild => {
        if (React.isValidElement(tabChild) && tabChild.type === TabsTrigger) {
          tabs.push({
            id: tabChild.props.value,
            label: tabChild.props.children,
            disabled: tabChild.props.disabled,
          });
        }
      });
    }
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab: handleTabChange, tabs }}
    >
      <div className={cn(w - full, className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div
      role='tablist'
      className={cn(
        'inline-flex items-center justify-start',
        DESIGN_TOKENS.theme.light.border.divider,
        'dark:' + DESIGN_TOKENS.theme.dark.border.divider.replace('border-', ''),
        'space-x-1',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className = '',
}: TabsTriggerProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role='tab'
      type='button'
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        DESIGN_TOKENS.recipes.tabButton,
        'border-b-2 transition-colors duration-200',
        DESIGN_TOKENS.interaction.focus.ring,
        isActive
          ? 'border-blue-500 text-blue-600'
          : `border-transparent ${DESIGN_TOKENS.theme.light.ink.secondary} hover:border-slate-300 hover:${DESIGN_TOKENS.theme.light.ink.primary.replace('text-', '')}`,
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={() => !disabled && setActiveTab(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = '',
}: TabsContentProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      role='tabpanel'
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn(DESIGN_TOKENS.spacing.sectionGap, className)}
    >
      {children}
    </div>
  );
}

