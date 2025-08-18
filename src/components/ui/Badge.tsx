import React from 'react';
import { DESIGN_TOKENS, getPriorityStyles, getStatusStyles } from '../../design/tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'priority' | 'status' | 'success' | 'warning' | 'danger' | 'info';
  priority?: 'P0' | 'P1' | 'P2';
  status?: 'TODAY' | 'LATER' | 'DONE';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  priority,
  status,
  size = 'md',
  className = ''
}: BadgeProps) {
  const baseClasses = DESIGN_TOKENS.recipes.badge;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  let variantClasses = '';
  
  if (variant === 'priority' && priority) {
    const priorityStyles = getPriorityStyles(priority);
    variantClasses = `${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.ring}`;
  } else if (variant === 'status' && status) {
    const statusStyles = getStatusStyles(status);
    variantClasses = `${statusStyles.bg} ${statusStyles.text} ${statusStyles.ring}`;
  } else {
    const variantMap = {
      default: DESIGN_TOKENS.recipes.badgeDefault,
      priority: DESIGN_TOKENS.recipes.badgeDefault, // fallback
      status: DESIGN_TOKENS.recipes.badgeDefault, // fallback
      success: DESIGN_TOKENS.recipes.badgeSuccess,
      warning: DESIGN_TOKENS.recipes.badgeWarning, 
      danger: DESIGN_TOKENS.recipes.badgeDanger,
      info: DESIGN_TOKENS.recipes.badgeInfo
    };
    variantClasses = variantMap[variant];
  }

  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
}

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: (() => void) | undefined;
  className?: string;
}

export function Chip({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  className = ''
}: ChipProps) {
  const baseClasses = DESIGN_TOKENS.recipes.chip;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs'
  };

  const variantClasses = {
    default: DESIGN_TOKENS.recipes.badgeDefault,
    primary: DESIGN_TOKENS.recipes.badgeInfo,
    success: DESIGN_TOKENS.recipes.badgeSuccess,
    warning: DESIGN_TOKENS.recipes.badgeWarning,
    danger: DESIGN_TOKENS.recipes.badgeDanger,
    info: DESIGN_TOKENS.recipes.badgeInfo
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses}>
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-current hover:bg-opacity-20 focus:outline-none focus:bg-current focus:bg-opacity-20"
          aria-label="Remove"
        >
          <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
            <path fillRule="evenodd" d="M5.354 4L8 6.646 6.646 8 4 5.354 1.354 8 0 6.646 2.646 4 0 1.354 1.354 0 4 2.646 6.646 0 8 1.354 5.354 4z" />
          </svg>
        </button>
      )}
    </span>
  );
}
