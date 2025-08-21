/**
 * Note Component
 *
 * Enterprise-grade informational notes for neutral content that doesn't fit
 * semantic categories like success/warning/error. Perfect for general guidance,
 * tips, and supplementary information.
 *
 * Features:
 * - Multiple visual styles (default, subtle, outlined, filled)
 * - Size variants for different contexts
 * - Icon integration with semantic mapping
 * - Dismissible functionality with smooth animations
 * - Rich content support with nested elements
 * - WCAG 2.1 AA compliance with proper ARIA
 * - Dark mode support through DESIGN_TOKENS
 * - Responsive design with mobile-first approach
 * - Collapsible functionality for long content
 *
 * @version 1.0.0
 * @author SparkTasks Enterprise UI Team
 */

import React, { useState, forwardRef } from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type NoteVariant = 'default' | 'subtle' | 'outlined' | 'filled';
export type NoteSize = 'sm' | 'md' | 'lg';
export type NoteIcon = 'info' | 'lightbulb' | 'bookmark' | 'note' | 'custom';

export interface NoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: NoteVariant;
  /** Size affecting spacing and typography */
  size?: NoteSize;
  /** Optional title for the note */
  title?: string;
  /** Icon type or custom icon element */
  icon?: NoteIcon | React.ReactNode;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Whether the note can be dismissed */
  dismissible?: boolean;
  /** Whether the note can be collapsed */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Callback when note is dismissed */
  onDismiss?: () => void;
  /** Callback when collapse state changes */
  onToggle?: (collapsed: boolean) => void;
  /** Content of the note */
  children: React.ReactNode;
}

// ===== ICON MAPPING =====

const getSemanticIcon = (iconType: NoteIcon): React.ReactNode => {
  const iconClasses = combineTokens('size-5', 'shrink-0');

  switch (iconType) {
    case 'info':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      );
    case 'lightbulb':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
          />
        </svg>
      );
    case 'bookmark':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
          />
        </svg>
      );
    case 'note':
      return (
        <svg
          className={iconClasses}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
          />
        </svg>
      );
    default:
      return null;
  }
};

// ===== STYLE FUNCTIONS =====

const getNoteClasses = (variant: NoteVariant, size: NoteSize): string => {
  const baseClasses = combineTokens(
    DESIGN_TOKENS.theme.light.radius.lg,
    'transition-all duration-200 ease-out'
  );

  const variantClasses = {
    default: combineTokens(
      DESIGN_TOKENS.theme.light.surface.subtle,
      DESIGN_TOKENS.theme.light.border.subtle,
      'border',
      DESIGN_TOKENS.semantic.text.muted
    ),
    subtle: combineTokens(
      'bg-slate-50/50 dark:bg-slate-800/30',
      'border-slate-200/50 dark:border-slate-700/50',
      'border',
      DESIGN_TOKENS.semantic.text.muted
    ),
    outlined: combineTokens(
      'bg-transparent',
      'border-slate-300 dark:border-slate-600',
      'border-2',
      DESIGN_TOKENS.semantic.text.muted
    ),
    filled: combineTokens(
      'bg-slate-100 dark:bg-slate-800',
      'border-slate-200 dark:border-slate-700',
      'border',
      DESIGN_TOKENS.theme.light.ink.primary
    ),
  }[variant];

  const sizeClasses = {
    sm: combineTokens(DESIGN_TOKENS.spacing.sm, 'gap-2'),
    md: combineTokens(DESIGN_TOKENS.spacing.md, 'gap-3'),
    lg: combineTokens(DESIGN_TOKENS.spacing.lg, 'gap-4'),
  }[size];

  return combineTokens(
    baseClasses,
    variantClasses,
    sizeClasses,
    DESIGN_TOKENS.layout.flexStart
  );
};

const getTitleClasses = (size: NoteSize): string => {
  const sizeClasses = {
    sm: DESIGN_TOKENS.typography.body.small,
    md: DESIGN_TOKENS.typography.body.medium,
    lg: DESIGN_TOKENS.typography.body.large,
  }[size];

  return combineTokens(
    sizeClasses,
    DESIGN_TOKENS.typography.inline.fontSemibold,
    'mb-1'
  );
};

const getContentClasses = (size: NoteSize): string => {
  const sizeClasses = {
    sm: DESIGN_TOKENS.typography.body.xs,
    md: DESIGN_TOKENS.typography.body.small,
    lg: DESIGN_TOKENS.typography.body.medium,
  }[size];

  return combineTokens(sizeClasses, 'leading-relaxed');
};

const getActionButtonClasses = (): string => {
  return combineTokens(
    'size-4',
    'shrink-0 rounded transition-colors duration-150',
    DESIGN_TOKENS.semantic.text.muted,
    'hover:bg-black/5 dark:hover:bg-white/5',
    'focus:outline-none focus:ring-2',
    'focus:ring-slate-500 focus:ring-offset-1'
  );
};

const getCollapseButtonClasses = (): string => {
  return combineTokens(
    'inline-flex items-center gap-1 text-sm',
    DESIGN_TOKENS.semantic.text.muted,
    'hover:text-slate-700 dark:hover:text-slate-300',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2',
    'focus:ring-slate-500 focus:ring-offset-1',
    'rounded'
  );
};

// ===== MAIN COMPONENT =====

const Note = forwardRef<HTMLDivElement, NoteProps>(
  (
    {
      variant = 'default',
      size = 'md',
      title,
      icon = 'note',
      showIcon = true,
      dismissible = false,
      collapsible = false,
      defaultCollapsed = false,
      onDismiss,
      onToggle,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [isDismissed, setIsDismissed] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    const handleDismiss = () => {
      setIsDismissed(true);
      onDismiss?.();
    };

    const handleToggle = () => {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onToggle?.(newCollapsed);
    };

    if (isDismissed) {
      return null;
    }

    const noteClasses = getNoteClasses(variant, size);
    const titleClasses = getTitleClasses(size);
    const contentClasses = getContentClasses(size);
    const actionButtonClasses = getActionButtonClasses();
    const collapseButtonClasses = getCollapseButtonClasses();

    const semanticIcon = showIcon
      ? typeof icon === 'string'
        ? getSemanticIcon(icon as NoteIcon)
        : icon
      : null;

    return (
      <div
        ref={ref}
        role='note'
        aria-live='polite'
        className={combineTokens(noteClasses, className)}
        {...props}
      >
        {/* Icon */}
        {semanticIcon && (
          <div className={combineTokens('shrink-0')} aria-hidden='true'>
            {semanticIcon}
          </div>
        )}

        {/* Content */}
        <div className={DESIGN_TOKENS.recipe.listItemContent.base}>
          {/* Header with title and actions */}
          {(title || collapsible || dismissible) && (
            <div
              className={combineTokens(
                DESIGN_TOKENS.spacing.workspace.subtitleMargin,
                DESIGN_TOKENS.layout.spaceBetween
              )}
            >
              <div className={DESIGN_TOKENS.layout.flexGapSm}>
                {title && <div className={titleClasses}>{title}</div>}

                {collapsible && (
                  <button
                    type='button'
                    onClick={handleToggle}
                    className={collapseButtonClasses}
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? 'Expand note' : 'Collapse note'}
                  >
                    <span className={DESIGN_TOKENS.typography.body.xs}>
                      {isCollapsed ? 'Show more' : 'Show less'}
                    </span>
                    <svg
                      className={combineTokens(
                        DESIGN_TOKENS.sizing.avatar.xs,
                        'transition-transform duration-200',
                        isCollapsed ? 'rotate-0' : 'rotate-180'
                      )}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Dismiss Button */}
              {dismissible && (
                <button
                  type='button'
                  onClick={handleDismiss}
                  className={actionButtonClasses}
                  aria-label='Dismiss note'
                >
                  <svg
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content Body */}
          <div
            className={combineTokens(
              contentClasses,
              collapsible && isCollapsed ? 'hidden' : 'block'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Note.displayName = 'Note';

// ===== EXPORTS =====

export default Note;
export { Note };
