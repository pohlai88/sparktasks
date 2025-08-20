/**
 * Layout System for AI-BOS SlackTasks
 * Provides consistent, responsive layout patterns using Tailwind + Design Tokens
 */

import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

// Base layout container
interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className = '' }: AppShellProps) {
  return (
    <div className={`${DESIGN_TOKENS.layout.shell.dashboard} ${className}`}>
      {children}
    </div>
  );
}

// Top navigation bar
interface TopNavProps {
  logo?: React.ReactNode;
  search?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function TopNav({ logo, search, actions, className = '' }: TopNavProps) {
  return (
    <header className={cn(DESIGN_TOKENS.layout.patterns.headerBar, className)}>
      <div className={DESIGN_TOKENS.layout.patterns.headerLeft}>
        <div className={DESIGN_TOKENS.layout.patterns.headerLogo}>{logo}</div>
        <div className={DESIGN_TOKENS.layout.patterns.headerSearch}>
          {search}
        </div>
      </div>
      <nav className={DESIGN_TOKENS.layout.patterns.headerActions}>
        {actions}
      </nav>
    </header>
  );
}

// Sidebar navigation
interface SidebarProps {
  children: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({
  children,
  collapsed = false,
  className = '',
}: SidebarProps) {
  const width = collapsed
    ? DESIGN_TOKENS.layout.widths.sidebarCollapsed
    : DESIGN_TOKENS.layout.widths.sidebar;

  return (
    <aside
      className={cn(
        DESIGN_TOKENS.layout.responsive.collapseSidebar,
        'overflow-y-auto border-r transition-all duration-200',
        DESIGN_TOKENS.colors.states.default.bg,
        className
      )}
      style={{ width }}
    >
      <div className={DESIGN_TOKENS.layout.patterns.sidebarSection}>
        {children}
      </div>
    </aside>
  );
}

// Main content area
interface MainContentProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function MainContent({
  children,
  header,
  className = '',
}: MainContentProps) {
  return (
    <main
      className={`${DESIGN_TOKENS.layout.patterns.mainContent} ${className}`}
    >
      {header && (
        <div className={DESIGN_TOKENS.layout.patterns.stickyHeader}>
          {header}
        </div>
      )}
      <div className={DESIGN_TOKENS.layout.patterns.mainSection}>
        {children}
      </div>
    </main>
  );
}

// Right panel for contextual content
interface RightPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function RightPanel({
  children,
  title,
  className = '',
}: RightPanelProps) {
  return (
    <aside
      className={cn(
        DESIGN_TOKENS.layout.responsive.showRightPanel,
        'overflow-y-auto border-l',
        DESIGN_TOKENS.colors.states.default.bg,
        className
      )}
      style={{ width: DESIGN_TOKENS.layout.widths.rightPanel }}
    >
      <div className={DESIGN_TOKENS.layout.patterns.panelSection}>
        {title && (
          <h3
            className={cn(
              DESIGN_TOKENS.typography.heading.h3,
              DESIGN_TOKENS.colors.ui.text.primary
            )}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    </aside>
  );
}

// Page header with breadcrumbs and actions
interface PageHeaderProps {
  title: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  breadcrumbs,
  actions,
  description,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {breadcrumbs && (
        <div
          className={cn(
            DESIGN_TOKENS.typography.body.small,
            DESIGN_TOKENS.colors.ui.text.secondary
          )}
        >
          {breadcrumbs}
        </div>
      )}
      <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
        <div>
          <h1
            className={cn(
              DESIGN_TOKENS.typography.heading.h1,
              DESIGN_TOKENS.colors.ui.text.primary
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                DESIGN_TOKENS.spacing.tightMargin,
                DESIGN_TOKENS.colors.ui.text.secondary
              )}
            >
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className={DESIGN_TOKENS.recipe.pageHeaderActions}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Split pane layout for list/detail views
interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  className?: string;
}

export function SplitPane({
  left,
  right,
  leftTitle,
  rightTitle,
  className = '',
}: SplitPaneProps) {
  return (
    <div className={`${DESIGN_TOKENS.layout.shell.splitPane} ${className}`}>
      <div className='overflow-y-auto border-r'>
        {leftTitle && (
          <div className={DESIGN_TOKENS.layout.patterns.panelHeader}>
            <h2
              className={cn(
                DESIGN_TOKENS.typography.body.primary,
                DESIGN_TOKENS.colors.ui.text.primary
              )}
            >
              {leftTitle}
            </h2>
          </div>
        )}
        <div className={`${DESIGN_TOKENS.layout.patterns.panelSection}`}>
          {left}
        </div>
      </div>
      <div className='overflow-y-auto'>
        {rightTitle && (
          <div className={DESIGN_TOKENS.layout.patterns.panelHeader}>
            <h2
              className={cn(
                DESIGN_TOKENS.typography.body.primary,
                DESIGN_TOKENS.colors.ui.text.primary
              )}
            >
              {rightTitle}
            </h2>
          </div>
        )}
        <div className={`${DESIGN_TOKENS.layout.patterns.panelSection}`}>
          {right}
        </div>
      </div>
    </div>
  );
}

// Content container with max width
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  className = '',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  return (
    <div
      className={`${DESIGN_TOKENS.layout.patterns.containerBase} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}

// Grid system for consistent layouts
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({
  children,
  cols = 3,
  gap = 'md',
  className = '',
}: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  };

  const gapClasses = {
    sm: DESIGN_TOKENS.spacing.gridGap.sm,
    md: DESIGN_TOKENS.spacing.gridGap.md,
    lg: DESIGN_TOKENS.spacing.gridGap.lg,
  };

  return (
    <div
      className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

// Stack for vertical layouts
interface StackProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Stack({
  children,
  spacing = 'md',
  className = '',
}: StackProps) {
  const spacingClasses = {
    sm: 'space-y-3',
    md: 'space-y-6',
    lg: 'space-y-8',
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>{children}</div>
  );
}
