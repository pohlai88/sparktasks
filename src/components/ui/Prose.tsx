/**
 * @fileoverview Prose Component - Markdown/Rich Text Styling System
 * @author SparkTasks
 * @version 1.0.0
 * 
 * Enterprise-grade prose component for rendering markdown and rich text content
 * with consistent typography, spacing, and semantic styling.
 * 
 * Features:
 * - Typography scale integration with DESIGN_TOKENS
 * - Semantic HTML structure for accessibility
 * - Dark mode support
 * - Responsive design
 * - Code syntax highlighting support
 * - Link and media handling
 * - Custom content variants (article, documentation, legal)
 * - Reading experience optimization
 * 
 * @example
 * ```tsx
 * <Prose variant="article">
 *   <h1>Article Title</h1>
 *   <p>Article content with proper typography...</p>
 * </Prose>
 * ```
 */

import React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPES =====

/**
 * Prose content variants for different use cases
 */
export type ProseVariant = 
  | 'default'      // Standard content styling
  | 'article'      // Blog posts, articles - optimized reading
  | 'documentation' // Technical docs - enhanced code blocks
  | 'legal'        // Legal documents - formal typography
  | 'compact'      // Reduced spacing for dense content
  | 'large'        // Larger text for accessibility

/**
 * Reading optimization modes
 */
export type ProseReadingMode = 
  | 'default'      // Standard line height and spacing
  | 'comfortable'  // Increased spacing for better readability
  | 'dense'        // Reduced spacing for information density

/**
 * Content size scales
 */
export type ProseSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for the Prose component
 */
export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content variant affecting typography and spacing */
  variant?: ProseVariant;
  
  /** Reading optimization mode */
  readingMode?: ProseReadingMode;
  
  /** Overall content size scale */
  size?: ProseSize;
  
  /** Enable syntax highlighting for code blocks */
  enableSyntaxHighlighting?: boolean;
  
  /** Maximum content width for optimal reading */
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Children content to render with prose styles */
  children: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Enable table of contents generation */
  enableToc?: boolean;
  
  /** Custom link handler */
  onLinkClick?: (href: string, event: React.MouseEvent) => void;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get base prose styling classes
 */
const getProseBaseClasses = (): string => {
  return `
    ${DESIGN_TOKENS.typography.body.md}
    ${DESIGN_TOKENS.semantic.text.primary}
    leading-relaxed
    antialiased
  `.trim();
};

/**
 * Get variant-specific styling classes
 */
const getProseVariantClasses = (variant: ProseVariant): string => {
  const variants = {
    default: '',
    article: `
      ${DESIGN_TOKENS.typography.body.lg}
      leading-loose
      tracking-wide
    `,
    documentation: `
      ${DESIGN_TOKENS.typography.body.md}
      font-mono
      tracking-tight
    `,
    legal: `
      ${DESIGN_TOKENS.typography.body.sm}
      leading-normal
      tracking-normal
      text-justify
    `,
    compact: `
      ${DESIGN_TOKENS.typography.body.sm}
      leading-normal
      space-y-2
    `,
    large: `
      ${DESIGN_TOKENS.typography.body.xl}
      leading-loose
      tracking-wide
    `
  };
  
  return variants[variant].trim();
};

/**
 * Get reading mode styling classes
 */
const getProseReadingModeClasses = (mode: ProseReadingMode): string => {
  const modes = {
    default: 'space-y-4',
    comfortable: 'space-y-6',
    dense: 'space-y-2'
  };
  
  return modes[mode];
};

/**
 * Get size-specific styling classes
 */
const getProseSizeClasses = (size: ProseSize): string => {
  const sizes = {
    sm: DESIGN_TOKENS.typography.body.sm,
    md: DESIGN_TOKENS.typography.body.md,
    lg: DESIGN_TOKENS.typography.body.lg,
    xl: DESIGN_TOKENS.typography.body.xl
  };
  
  return sizes[size];
};

/**
 * Get max width styling classes
 */
const getProseMaxWidthClasses = (maxWidth: ProseProps['maxWidth']): string => {
  const widths = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  };
  
  return widths[maxWidth || 'md'];
};

/**
 * Get comprehensive prose typography styles
 */
const getProseTypographyStyles = (): string => {
  return `
    /* Headings */
    prose-headings:${DESIGN_TOKENS.semantic.text.primary}
    prose-headings:font-semibold
    prose-headings:tracking-tight
    
    prose-h1:${DESIGN_TOKENS.typography.heading.h1}
    prose-h1:mb-6
    prose-h1:mt-8
    
    prose-h2:${DESIGN_TOKENS.typography.heading.h2}
    prose-h2:mb-4
    prose-h2:mt-6
    
    prose-h3:${DESIGN_TOKENS.typography.heading.h3}
    prose-h3:mb-3
    prose-h3:mt-5
    
    prose-h4:${DESIGN_TOKENS.typography.heading.h4}
    prose-h4:mb-2
    prose-h4:mt-4
    
    prose-h5:${DESIGN_TOKENS.typography.heading.h5}
    prose-h5:mb-2
    prose-h5:mt-3
    
    prose-h6:${DESIGN_TOKENS.typography.heading.h6}
    prose-h6:mb-2
    prose-h6:mt-3
    
    /* Paragraphs */
    prose-p:${DESIGN_TOKENS.semantic.text.primary}
    prose-p:leading-7
    prose-p:mb-4
    
    /* Links */
    prose-a:${DESIGN_TOKENS.semantic.text.link}
    prose-a:font-medium
    prose-a:underline
    prose-a:decoration-2
    prose-a:underline-offset-2
    prose-a:${DESIGN_TOKENS.motion.smooth}
    prose-a:hover:${DESIGN_TOKENS.semantic.text.accent}
    
    /* Lists */
    prose-ul:${DESIGN_TOKENS.semantic.text.primary}
    prose-ul:mb-4
    prose-ul:pl-6
    prose-ul:space-y-1
    
    prose-ol:${DESIGN_TOKENS.semantic.text.primary}
    prose-ol:mb-4
    prose-ol:pl-6
    prose-ol:space-y-1
    
    prose-li:leading-6
    prose-li:marker:${DESIGN_TOKENS.semantic.text.muted}
    
    /* Code */
    prose-code:${DESIGN_TOKENS.typography.code.inline}
    prose-code:${DESIGN_TOKENS.semantic.text.accent}
    prose-code:${DESIGN_TOKENS.theme.light.surface.elevated}
    prose-code:px-1
    prose-code:py-0.5
    prose-code:rounded
    prose-code:font-mono
    prose-code:text-sm
    
    prose-pre:${DESIGN_TOKENS.theme.light.surface.elevated}
    prose-pre:${DESIGN_TOKENS.semantic.border.subtle}
    prose-pre:rounded-lg
    prose-pre:border
    prose-pre:p-4
    prose-pre:mb-4
    prose-pre:overflow-x-auto
    
    prose-pre:code:${DESIGN_TOKENS.semantic.text.primary}
    prose-pre:code:bg-transparent
    prose-pre:code:p-0
    prose-pre:code:rounded-none
    
    /* Blockquotes */
    prose-blockquote:${DESIGN_TOKENS.semantic.border.subtle}
    prose-blockquote:border-l-4
    prose-blockquote:pl-4
    prose-blockquote:py-2
    prose-blockquote:mb-4
    prose-blockquote:${DESIGN_TOKENS.semantic.text.muted}
    prose-blockquote:italic
    
    /* Tables */
    prose-table:w-full
    prose-table:mb-4
    prose-table:border-collapse
    prose-table:${DESIGN_TOKENS.semantic.border.subtle}
    prose-table:border
    prose-table:rounded-lg
    
    prose-thead:${DESIGN_TOKENS.theme.light.surface.subtle}
    prose-th:${DESIGN_TOKENS.semantic.text.primary}
    prose-th:font-semibold
    prose-th:text-left
    prose-th:px-4
    prose-th:py-3
    prose-th:${DESIGN_TOKENS.semantic.border.subtle}
    prose-th:border-b
    
    prose-td:${DESIGN_TOKENS.semantic.text.primary}
    prose-td:px-4
    prose-td:py-3
    prose-td:${DESIGN_TOKENS.semantic.border.subtle}
    prose-td:border-b
    prose-td:last:border-b-0
    
    /* Images */
    prose-img:rounded-lg
    prose-img:mb-4
    prose-img:shadow-md
    prose-img:max-w-full
    prose-img:h-auto
    
    /* Horizontal rules */
    prose-hr:${DESIGN_TOKENS.semantic.border.subtle}
    prose-hr:border-t
    prose-hr:my-8
    prose-hr:border-0
    
    /* Strong and emphasis */
    prose-strong:${DESIGN_TOKENS.semantic.text.primary}
    prose-strong:font-semibold
    
    prose-em:${DESIGN_TOKENS.semantic.text.primary}
    prose-em:italic
    
    /* Mark highlighting */
    prose-mark:${DESIGN_TOKENS.semantic.background.warning}
    prose-mark:px-1
    prose-mark:py-0.5
    prose-mark:rounded
  `.trim();
};

// ===== MAIN COMPONENT =====

/**
 * Prose component for markdown and rich text content
 * 
 * Provides consistent typography, spacing, and semantic styling for long-form content.
 * Supports multiple variants, reading modes, and accessibility features.
 */
export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(({
  variant = 'default',
  readingMode = 'default',
  size = 'md',
  maxWidth = 'md',
  children,
  className = '',
  onLinkClick,
  onClick,
  ...props
}, ref) => {
  // Build component classes
  const componentClasses = React.useMemo(() => {
    return [
      // Base prose styling
      'prose prose-slate',
      getProseBaseClasses(),
      
      // Variant styling
      getProseVariantClasses(variant),
      
      // Reading mode
      getProseReadingModeClasses(readingMode),
      
      // Size scaling
      getProseSizeClasses(size),
      
      // Max width constraint
      getProseMaxWidthClasses(maxWidth),
      
      // Typography styles
      getProseTypographyStyles(),
      
      // Dark mode support
      'dark:prose-invert',
      
      // Ensure proper margins
      'mx-auto',
      
      // Custom classes
      className
    ].filter(Boolean).join(' ');
  }, [variant, readingMode, size, maxWidth, className]);

  // Handle link clicks if custom handler provided
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (onLinkClick) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A') {
        const href = (target as HTMLAnchorElement).href;
        if (href) {
          event.preventDefault();
          onLinkClick(href, event);
        }
      }
    }
    
    // Call original onClick if provided
    onClick?.(event);
  }, [onLinkClick, onClick]);

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-testid="prose"
      data-variant={variant}
      data-reading-mode={readingMode}
      data-size={size}
      role="article"
      {...(onLinkClick ? { 
        onClick: handleClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }
      } : { onClick })}
      {...props}
    >
      {children}
    </div>
  );
});

Prose.displayName = 'Prose';

// ===== EXPORTS =====

export default Prose;
