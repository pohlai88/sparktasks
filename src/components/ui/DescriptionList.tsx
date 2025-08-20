/**
 * DescriptionList Component System - Enterprise Key-Value Pairs
 * 
 * A comprehensive description list component system providing structured key-value 
 * data presentation with enterprise-grade functionality including:
 * - Multiple layout patterns (horizontal, vertical, two-column)
 * - Interactive capabilities (selection, hover states, copyable content)
 * - Semantic variants (success, warning, error, info states)
 * - Accessibility compliance (ARIA patterns, semantic HTML)
 * - Content type support (text, code, badges, lists, links, status indicators)
 * - Compound component architecture (DescriptionList + Item + Term + Details)
 * 
 * @version 1.0.0
 * @author SparkTasks Enterprise UI Team
 */

import React, { createContext, useContext, forwardRef } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { combineTokens } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type DescriptionListVariant = 'default' | 'bordered' | 'flush' | 'spaced' | 'relaxed';
export type DescriptionListLayout = 'horizontal' | 'vertical' | 'twoColumn';
export type DescriptionListSize = 'sm' | 'md' | 'lg' | 'xl';
export type DescriptionItemVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type DescriptionItemSpacing = 'compact' | 'comfortable' | 'spacious';
export type DescriptionItemLayout = 'horizontal' | 'vertical' | 'stacked';
export type DescriptionTermAlignment = 'top' | 'center' | 'baseline';
export type DescriptionDetailsType = 'text' | 'code' | 'badge' | 'list' | 'link' | 'status';

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  /** Visual style variant */
  variant?: DescriptionListVariant;
  /** Layout pattern for the description list */
  layout?: DescriptionListLayout;
  /** Size variant affecting text and spacing */
  size?: DescriptionListSize;
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
  /** ARIA label for the description list */
  'aria-label'?: string;
  children?: React.ReactNode;
}

export interface DescriptionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: DescriptionItemVariant;
  /** Layout pattern for content arrangement */
  layout?: DescriptionItemLayout;
  /** Spacing variant */
  spacing?: DescriptionItemSpacing;
  /** Whether item is interactive */
  interactive?: boolean;
  /** Whether item is selected */
  selected?: boolean;
  /** Click handler for interactive items */
  onSelect?: () => void;
  children: React.ReactNode;
}

export interface DescriptionTermProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the term is required */
  required?: boolean;
  /** Whether the term is optional */
  optional?: boolean;
  /** Alignment relative to the details */
  align?: DescriptionTermAlignment;
  /** Color variant */
  variant?: 'default' | 'muted' | 'emphasized';
  children: React.ReactNode;
}

export interface DescriptionDetailsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onCopy'> {
  /** Content type for appropriate styling */
  type?: DescriptionDetailsType;
  /** Whether content is copyable */
  copyable?: boolean;
  /** Whether content should be truncated */
  truncated?: boolean;
  /** Whether content is expandable */
  expandable?: boolean;
  /** Color variant */
  variant?: 'default' | 'muted' | 'emphasized';
  /** Status type for status indicators */
  status?: 'success' | 'warning' | 'error' | 'info';
  /** Copy handler for copyable content */
  onCopy?: (text: string) => void;
  children: React.ReactNode;
}

// ===== CONTEXT =====

interface DescriptionListContextValue {
  size: DescriptionListSize;
  layout: DescriptionListLayout;
  interactive: boolean;
  hoverable: boolean;
}

const DescriptionListContext = createContext<DescriptionListContextValue>({
  size: 'md',
  layout: 'horizontal',
  interactive: false,
  hoverable: false,
});

// ===== UTILITY FUNCTIONS =====

const getDescriptionListClasses = (
  variant: DescriptionListVariant,
  layout: DescriptionListLayout,
  size: DescriptionListSize,
  background: 'none' | 'subtle' | 'elevated',
  interactive: boolean,
  hoverable: boolean
) => {
  const baseClasses = DESIGN_TOKENS.recipe.descriptionList.base;
  const variantClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.descriptionList 
    ? DESIGN_TOKENS.recipe.descriptionList[variant as keyof typeof DESIGN_TOKENS.recipe.descriptionList] 
    : '';
  const layoutClasses = layout in DESIGN_TOKENS.recipe.descriptionList 
    ? DESIGN_TOKENS.recipe.descriptionList[layout as keyof typeof DESIGN_TOKENS.recipe.descriptionList] 
    : '';
  const sizeClasses = size in DESIGN_TOKENS.recipe.descriptionList 
    ? DESIGN_TOKENS.recipe.descriptionList[size as keyof typeof DESIGN_TOKENS.recipe.descriptionList] 
    : '';
  const backgroundClasses = background !== 'none' && background in DESIGN_TOKENS.recipe.descriptionList 
    ? DESIGN_TOKENS.recipe.descriptionList[background as keyof typeof DESIGN_TOKENS.recipe.descriptionList] 
    : '';
  const interactiveClasses = interactive ? DESIGN_TOKENS.recipe.descriptionList.interactive : '';
  const hoverableClasses = hoverable ? DESIGN_TOKENS.recipe.descriptionList.hoverable : '';

  return combineTokens(baseClasses, variantClasses, layoutClasses, sizeClasses, backgroundClasses, interactiveClasses, hoverableClasses);
};

const getDescriptionItemClasses = (
  variant: DescriptionItemVariant,
  layout: DescriptionItemLayout,
  spacing: DescriptionItemSpacing,
  interactive: boolean,
  selected: boolean
) => {
  const baseClasses = layout in DESIGN_TOKENS.recipe.descriptionItem 
    ? DESIGN_TOKENS.recipe.descriptionItem[layout as keyof typeof DESIGN_TOKENS.recipe.descriptionItem] 
    : DESIGN_TOKENS.recipe.descriptionItem.base;
  const variantClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.descriptionItem 
    ? DESIGN_TOKENS.recipe.descriptionItem[variant as keyof typeof DESIGN_TOKENS.recipe.descriptionItem] 
    : '';
  const spacingClasses = spacing in DESIGN_TOKENS.recipe.descriptionItem 
    ? DESIGN_TOKENS.recipe.descriptionItem[spacing as keyof typeof DESIGN_TOKENS.recipe.descriptionItem] 
    : '';
  const interactiveClasses = interactive ? DESIGN_TOKENS.recipe.descriptionItem.interactive : '';
  const selectedClasses = selected ? DESIGN_TOKENS.recipe.descriptionItem.selected : '';

  return combineTokens(baseClasses, variantClasses, spacingClasses, interactiveClasses, selectedClasses);
};

const getDescriptionTermClasses = (
  size: DescriptionListSize,
  align: DescriptionTermAlignment,
  variant: 'default' | 'muted' | 'emphasized',
  required: boolean,
  optional: boolean
) => {
  const baseClasses = DESIGN_TOKENS.recipe.descriptionTerm.base;
  const sizeClasses = size in DESIGN_TOKENS.recipe.descriptionTerm 
    ? DESIGN_TOKENS.recipe.descriptionTerm[size as keyof typeof DESIGN_TOKENS.recipe.descriptionTerm] 
    : '';
  const alignClasses = align !== 'baseline' && `align${align.charAt(0).toUpperCase() + align.slice(1)}` in DESIGN_TOKENS.recipe.descriptionTerm 
    ? DESIGN_TOKENS.recipe.descriptionTerm[`align${align.charAt(0).toUpperCase() + align.slice(1)}` as keyof typeof DESIGN_TOKENS.recipe.descriptionTerm] 
    : '';
  const variantClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.descriptionTerm 
    ? DESIGN_TOKENS.recipe.descriptionTerm[variant as keyof typeof DESIGN_TOKENS.recipe.descriptionTerm] 
    : '';
  const requiredClasses = required ? DESIGN_TOKENS.recipe.descriptionTerm.required : '';
  const optionalClasses = optional ? DESIGN_TOKENS.recipe.descriptionTerm.optional : '';

  return combineTokens(baseClasses, sizeClasses, alignClasses, variantClasses, requiredClasses, optionalClasses);
};

const getDescriptionDetailsClasses = (
  type: DescriptionDetailsType,
  variant: 'default' | 'muted' | 'emphasized',
  truncated: boolean,
  expandable: boolean,
  copyable: boolean,
  status?: 'success' | 'warning' | 'error' | 'info'
) => {
  const baseClasses = DESIGN_TOKENS.recipe.descriptionDetails.base;
  const typeClasses = type !== 'text' && type in DESIGN_TOKENS.recipe.descriptionDetails 
    ? DESIGN_TOKENS.recipe.descriptionDetails[type as keyof typeof DESIGN_TOKENS.recipe.descriptionDetails] 
    : '';
  const variantClasses = variant !== 'default' && variant in DESIGN_TOKENS.recipe.descriptionDetails 
    ? DESIGN_TOKENS.recipe.descriptionDetails[variant as keyof typeof DESIGN_TOKENS.recipe.descriptionDetails] 
    : '';
  const truncatedClasses = truncated ? DESIGN_TOKENS.recipe.descriptionDetails.truncated : '';
  const expandableClasses = expandable ? DESIGN_TOKENS.recipe.descriptionDetails.expandable : '';
  const copyableClasses = copyable ? DESIGN_TOKENS.recipe.descriptionDetails.copyable : '';
  const statusClasses = status && `status${status.charAt(0).toUpperCase() + status.slice(1)}` in DESIGN_TOKENS.recipe.descriptionDetails 
    ? DESIGN_TOKENS.recipe.descriptionDetails[`status${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof DESIGN_TOKENS.recipe.descriptionDetails] 
    : '';

  return combineTokens(baseClasses, typeClasses, variantClasses, truncatedClasses, expandableClasses, copyableClasses, statusClasses);
};

// ===== LOADING SKELETON =====

const DescriptionListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <dl className={DESIGN_TOKENS.recipe.descriptionList.base}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className={combineTokens(DESIGN_TOKENS.recipe.descriptionItem.base, 'animate-pulse')}>
        <dt className="sm:col-span-1">
          <div className={combineTokens(DESIGN_TOKENS.recipe.skeleton.text, 'w-20')} />
        </dt>
        <dd className="sm:col-span-2 sm:mt-0 mt-1">
          <div className={combineTokens(DESIGN_TOKENS.recipe.skeleton.text, 'w-32')} />
        </dd>
      </div>
    ))}
  </dl>
);

// ===== EMPTY STATE =====

const DescriptionListEmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-slate-400 dark:text-slate-500 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <div className="text-slate-600 dark:text-slate-400">{children}</div>
  </div>
);

// ===== MAIN COMPONENTS =====

const DescriptionListComponent = forwardRef<HTMLDListElement, DescriptionListProps>(({
  variant = 'default',
  layout = 'horizontal',
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
  const listClasses = getDescriptionListClasses(variant, layout, size, background, interactive, hoverable);

  // Handle loading state
  if (loading) {
    return (
      <dl
        ref={ref}
        className={combineTokens(listClasses, className)}
        aria-label={ariaLabel}
  role="list"
        {...props}
      >
        <DescriptionListSkeleton />
      </dl>
    );
  }

  // Handle empty state
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length === 0 && emptyContent) {
    return <DescriptionListEmptyState>{emptyContent}</DescriptionListEmptyState>;
  }

  return (
    <DescriptionListContext.Provider value={{ size, layout, interactive, hoverable }}>
      <dl
        ref={ref}
        className={combineTokens(listClasses, className)}
        aria-label={ariaLabel}
  role="list"
        {...props}
      >
        {children}
      </dl>
    </DescriptionListContext.Provider>
  );
});

DescriptionListComponent.displayName = 'DescriptionList';

const DescriptionItemComponent = forwardRef<HTMLDivElement, DescriptionItemProps>(({
  variant = 'default',
  layout,
  spacing = 'comfortable',
  interactive,
  selected = false,
  onSelect,
  className,
  children,
  onClick,
  onKeyDown,
  tabIndex,
  ...props
}, ref) => {
  const context = useContext(DescriptionListContext);
  
  // Determine layout: explicit prop takes priority over context, but ensure compatibility
  const itemLayout = layout || (context.layout === 'twoColumn' ? 'horizontal' : context.layout);
  
  // Determine if interactive: explicit prop takes priority over context
  const isInteractive = interactive !== undefined 
    ? interactive || !!onSelect || !!onClick
    : context.interactive || !!onSelect || !!onClick;

  const itemClasses = getDescriptionItemClasses(
    variant,
    itemLayout,
    spacing,
    isInteractive,
    selected
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    onClick?.(event);
    onSelect?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
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
      role={isInteractive ? 'button' : undefined}
      aria-pressed={isInteractive ? selected : undefined}
      tabIndex={isInteractive ? (tabIndex ?? 0) : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
});

DescriptionItemComponent.displayName = 'DescriptionItem';

const DescriptionTermComponent = forwardRef<HTMLElement, DescriptionTermProps>(({
  required = false,
  optional = false,
  align = 'baseline',
  variant = 'default',
  className,
  children,
  ...props
}, ref) => {
  const context = useContext(DescriptionListContext);
  const termClasses = getDescriptionTermClasses(context.size, align, variant, required, optional);

  return (
    <dt
      ref={ref}
      className={combineTokens(termClasses, className)}
      {...props}
    >
      {children}
    </dt>
  );
});

DescriptionTermComponent.displayName = 'DescriptionTerm';

const DescriptionDetailsComponent = forwardRef<HTMLElement, DescriptionDetailsProps>(({
  type = 'text',
  copyable = false,
  truncated = false,
  expandable = false,
  variant = 'default',
  status,
  onCopy,
  className,
  children,
  onClick,
  ...props
}, ref) => {
  const [expanded, setExpanded] = React.useState(false);
  const hostRef = React.useRef<HTMLElement | null>(null);
  const isTruncated = truncated && !expanded;

  const detailsClasses = getDescriptionDetailsClasses(
    type,
    variant,
    isTruncated,
    expandable,
    copyable,
    status
  );

  const doCopy = async () => {
    const text = hostRef.current?.textContent?.trim() ?? '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      onCopy?.(text);
    } catch { 
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        onCopy?.(text);
      } catch { /* no-op */ }
      document.body.removeChild(textArea);
    }
  };

  const handleRef = (node: HTMLElement | null) => {
    hostRef.current = node;
    if (typeof ref === 'function') {
      ref(node!);
    } else if (ref) {
      (ref as any).current = node;
    }
  };

  return (
    <dd
      ref={handleRef}
      className={combineTokens(detailsClasses, className)}
      onClick={(e) => {
        onClick?.(e);
        // Allow clicking the details area itself to copy (tests expect this)
        if (copyable) {
          // Avoid duplicate copy when clicking the explicit copy button
          const target = e.target as HTMLElement;
          if (!target.closest('button')) {
            doCopy();
          }
        }
      }}
      {...props}
    >
      {status && (
        <span className="inline-flex items-center mr-2" aria-hidden="true">
          {status === 'success' && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {status === 'warning' && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {status === 'error' && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          {status === 'info' && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      )}
      {children}
      {expandable && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          className={combineTokens(DESIGN_TOKENS.recipe.button.link, 'ml-2 text-sm')}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {copyable && (
        <button
          type="button"
          onClick={doCopy}
          className={combineTokens(DESIGN_TOKENS.recipe.iconButtonDefault, 'ml-2')}
          aria-label="Copy value"
        >
          <svg className="w-4 h-4" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </dd>
  );
});

DescriptionDetailsComponent.displayName = 'DescriptionDetails';

// ===== COMPOUND COMPONENT EXPORT =====

export const DescriptionList = Object.assign(DescriptionListComponent, {
  Item: DescriptionItemComponent,
  Term: DescriptionTermComponent,
  Details: DescriptionDetailsComponent,
});

// ===== INDIVIDUAL EXPORTS =====

export const DescriptionItem = Object.assign(DescriptionItemComponent, {
  Term: DescriptionTermComponent,
  Details: DescriptionDetailsComponent,
});

export const DescriptionTerm = DescriptionTermComponent;
export const DescriptionDetails = DescriptionDetailsComponent;

// ===== DEFAULT EXPORT =====

export default DescriptionList;
