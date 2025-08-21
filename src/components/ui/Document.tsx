/**
 * Document Component
 *
 * Enterprise-grade document formatting component supporting multiple document formats,
 * accessibility compliance, and professional presentation standards.
 *
 * Features:
 * - Multiple document format support (PDF, Word, Excel, PowerPoint, etc.)
 * - Document status indicators (draft, review, final, archived)
 * - Size variants (compact, default, detailed)
 * - Interactive features (preview, download, share)
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Dark mode support
 * - Responsive design
 *
 * @version 1.0.0
 * @author SparkTasks UI Team
 */

import {
  FileText,
  Download,
  Share2,
  Eye,
  Calendar,
  User,
  FileImage,
  FileSpreadsheet,
  Archive,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  ExternalLink,
  Presentation,
} from 'lucide-react';
import React, { forwardRef, useState } from 'react';

import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// Document format types
export type DocumentFormat =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'txt'
  | 'rtf'
  | 'csv'
  | 'image'
  | 'archive'
  | 'unknown';

// Document status types
export type DocumentStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'final'
  | 'archived';

// Document size variants
export type DocumentSize = 'compact' | 'default' | 'detailed';

// Document metadata interface
export interface DocumentMetadata {
  author?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  version?: string;
  tags?: string[];
  description?: string;
  fileSize?: number;
  pageCount?: number;
  isConfidential?: boolean;
  expiresAt?: Date;
}

// Main component props
export interface DocumentProps {
  /** Document title */
  title: string;

  /** Document format/type */
  format?: DocumentFormat;

  /** Document status */
  status?: DocumentStatus;

  /** Display size variant */
  size?: DocumentSize;

  /** Document metadata */
  metadata?: DocumentMetadata;

  /** File size in bytes */
  fileSize?: number;

  /** Thumbnail/preview image URL */
  thumbnailUrl?: string;

  /** Show preview action button */
  showPreview?: boolean;

  /** Show download action button */
  showDownload?: boolean;

  /** Show share action button */
  showShare?: boolean;

  /** Show external link indicator */
  isExternal?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Custom actions */
  customActions?: React.ReactNode;

  /** Click handler for document */
  onClick?: () => void;

  /** Preview action handler */
  onPreview?: () => void;

  /** Download action handler */
  onDownload?: () => void;

  /** Share action handler */
  onShare?: () => void;

  /** Additional CSS classes */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Get document format icon
 */
const getFormatIcon = (format: DocumentFormat): React.ReactNode => {
  const iconProps = { className: 'size-5 shrink-0' };

  switch (format) {
    case 'pdf': {
      return (
        <FileText
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-red-600'
          )}
        />
      );
    }
    case 'doc':
    case 'docx': {
      return (
        <FileText
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-blue-600'
          )}
        />
      );
    }
    case 'xls':
    case 'xlsx':
    case 'csv': {
      return (
        <FileSpreadsheet
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-green-600'
          )}
        />
      );
    }
    case 'ppt':
    case 'pptx': {
      return (
        <Presentation
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-orange-600'
          )}
        />
      );
    }
    case 'image': {
      return (
        <FileImage
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-purple-600'
          )}
        />
      );
    }
    case 'archive': {
      return (
        <Archive
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-gray-600'
          )}
        />
      );
    }
    case 'txt': {
      return (
        <FileText
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-gray-500'
          )}
        />
      );
    }
    case 'rtf': {
      return (
        <FileText
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-amber-600'
          )}
        />
      );
    }
    case 'unknown':
    default: {
      return (
        <FileText
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size5,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-gray-600'
          )}
        />
      );
    }
  }
};

/**
 * Get status indicator
 */
const getStatusIndicator = (status: DocumentStatus): React.ReactNode => {
  const iconProps = {
    className: combineTokens(
      DESIGN_TOKENS.layout.spacing.fine.size4,
      DESIGN_TOKENS.layout.flex.shrinkNone
    ),
  };

  switch (status) {
    case 'draft': {
      return (
        <Clock
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size4,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-orange-500'
          )}
        />
      );
    }
    case 'review': {
      return (
        <AlertCircle
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size4,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-yellow-500'
          )}
        />
      );
    }
    case 'approved': {
      return (
        <CheckCircle2
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size4,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-blue-500'
          )}
        />
      );
    }
    case 'final': {
      return (
        <CheckCircle2
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size4,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-green-500'
          )}
        />
      );
    }
    case 'archived': {
      return (
        <Archive
          {...iconProps}
          className={combineTokens(
            DESIGN_TOKENS.layout.spacing.fine.size4,
            DESIGN_TOKENS.layout.flex.shrinkNone,
            'text-gray-500'
          )}
        />
      );
    }
    default: {
      return null;
    }
  }
};

/**
 * Format file size for display
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    (Math.round((bytes / Math.pow(k, i)) * 10) / 10).toFixed(1) + ' ' + sizes[i]
  );
};

/**
 * Format date for display
 */
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get document classes based on props
 */
const getDocumentClasses = (
  size: DocumentSize,
  disabled: boolean,
  loading: boolean,
  onClick?: () => void,
  hasCustomBackground?: boolean
): string => {
  const backgroundClass = hasCustomBackground ? '' : 'bg-white';
  const baseClasses = combineTokens(
    backgroundClass,
    'border border-gray-200 rounded-lg shadow-sm',
    DESIGN_TOKENS.spacing.section
  );

  const sizeClasses = {
    compact: DESIGN_TOKENS.spacing.stack,
    default: DESIGN_TOKENS.spacing.stack,
    detailed: DESIGN_TOKENS.spacing.stack,
  };

  const interactiveClasses = onClick
    ? combineTokens(
        'cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      )
    : '';

  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : loading
      ? 'opacity-75'
      : '';

  return combineTokens(
    baseClasses,
    sizeClasses[size],
    interactiveClasses,
    stateClasses
  );
};

/**
 * Document Component
 *
 * Enterprise-grade document display component with comprehensive formatting support.
 */
const Document = forwardRef<HTMLDivElement, DocumentProps>(
  (
    {
      title,
      format = 'unknown',
      status = 'draft',
      size = 'default',
      metadata,
      fileSize,
      thumbnailUrl,
      showPreview = true,
      showDownload = true,
      showShare = false,
      isExternal = false,
      disabled = false,
      loading = false,
      customActions,
      onClick,
      onPreview,
      onDownload,
      onShare,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const hasCustomBackground = style?.backgroundColor !== undefined;
    const documentClasses = getDocumentClasses(
      size,
      disabled,
      loading,
      onClick,
      hasCustomBackground
    );

    const handleClick = () => {
      if (!disabled && !loading && onClick) {
        onClick();
      }
    };

    const handlePreview = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && !loading && onPreview) {
        onPreview();
      }
    };

    const handleDownload = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && !loading && onDownload) {
        onDownload();
      }
    };

    const handleShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && !loading && onShare) {
        onShare();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClick) {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        ref={ref}
        className={combineTokens(documentClasses, className)}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : 'article'}
        aria-label={`Document: ${title}`}
        aria-disabled={disabled}
        {...props}
      >
        {/* Header Section */}
        <div className={combineTokens(DESIGN_TOKENS.layout.patterns.flexGap)}>
          {/* Document Icon */}
          <div className={combineTokens('mt-1', 'shrink-0')}>
            {getFormatIcon(format)}
          </div>

          {/* Document Information */}
          <div
            className={combineTokens(
              DESIGN_TOKENS.layout.flex.minW0,
              DESIGN_TOKENS.layout.flex.flex1
            )}
          >
            <div
              className={combineTokens(
                DESIGN_TOKENS.layout.patterns.flexGapSm,
                'justify-between'
              )}
            >
              {/* Title and Status */}
              <div
                className={combineTokens(
                  DESIGN_TOKENS.layout.flex.minW0,
                  DESIGN_TOKENS.layout.flex.flex1
                )}
              >
                <h3
                  className={combineTokens(
                    DESIGN_TOKENS.typography.heading.h6,
                    'truncate'
                  )}
                >
                  {title}
                  {isExternal && (
                    <ExternalLink
                      className={combineTokens(
                        'ml-1 inline-block',
                        DESIGN_TOKENS.icon.size.xs,
                        DESIGN_TOKENS.semantic.text.muted
                      )}
                      aria-hidden='true'
                    />
                  )}
                  {metadata?.isConfidential && (
                    <Lock
                      className={combineTokens(
                        'ml-1 inline-block',
                        DESIGN_TOKENS.icon.size.xs,
                        DESIGN_TOKENS.semantic.text.error
                      )}
                      aria-label='Confidential'
                    />
                  )}
                </h3>

                {/* Status and Format */}
                <div
                  className={combineTokens(
                    DESIGN_TOKENS.layout.spacing.fine.mt1,
                    DESIGN_TOKENS.layout.patterns.flexGapSm
                  )}
                >
                  {getStatusIndicator(status)}
                  <span
                    className={combineTokens(
                      DESIGN_TOKENS.typography.body.small,
                      DESIGN_TOKENS.semantic.text.muted
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className={DESIGN_TOKENS.semantic.text.muted}>•</span>
                  <span
                    className={combineTokens(
                      DESIGN_TOKENS.typography.body.small,
                      DESIGN_TOKENS.semantic.text.muted
                    )}
                  >
                    {format.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div
                className={combineTokens(
                  'flex shrink-0 items-center gap-1',
                  isHovered || size === 'detailed'
                    ? 'opacity-100'
                    : 'opacity-0',
                  'transition-opacity duration-200'
                )}
              >
                {showPreview && (
                  <button
                    type='button'
                    onClick={handlePreview}
                    disabled={disabled || loading}
                    className={combineTokens(
                      DESIGN_TOKENS.recipe.button.ghost,
                      'size-8 p-0'
                    )}
                    aria-label='Preview document'
                    title='Preview'
                  >
                    <Eye
                      className={combineTokens(
                        DESIGN_TOKENS.layout.spacing.fine.size4
                      )}
                    />
                  </button>
                )}

                {showDownload && (
                  <button
                    type='button'
                    onClick={handleDownload}
                    disabled={disabled || loading}
                    className={combineTokens(
                      DESIGN_TOKENS.recipe.button.ghost,
                      'size-8 p-0'
                    )}
                    aria-label='Download document'
                    title='Download'
                  >
                    <Download
                      className={combineTokens(
                        DESIGN_TOKENS.layout.spacing.fine.size4
                      )}
                    />
                  </button>
                )}

                {showShare && (
                  <button
                    type='button'
                    onClick={handleShare}
                    disabled={disabled || loading}
                    className={combineTokens(
                      DESIGN_TOKENS.recipe.button.ghost,
                      'size-8 p-0'
                    )}
                    aria-label='Share document'
                    title='Share'
                  >
                    <Share2
                      className={combineTokens(
                        DESIGN_TOKENS.layout.spacing.fine.size4
                      )}
                    />
                  </button>
                )}

                {customActions}
              </div>
            </div>

            {/* Description (detailed size only) */}
            {size === 'detailed' && metadata?.description && (
              <p
                className={combineTokens(
                  DESIGN_TOKENS.typography.body.small,
                  DESIGN_TOKENS.semantic.text.muted,
                  'mt-2 line-clamp-2'
                )}
              >
                {metadata.description}
              </p>
            )}

            {/* Metadata */}
            {(size === 'default' || size === 'detailed') && (
              <div
                className={combineTokens(
                  'mt-2 flex items-center gap-4 text-xs',
                  DESIGN_TOKENS.semantic.text.muted
                )}
              >
                {/* File Size */}
                {fileSize !== undefined && (
                  <span>{formatFileSize(fileSize)}</span>
                )}

                {/* Page Count */}
                {metadata?.pageCount && <span>{metadata.pageCount} pages</span>}

                {/* Modified Date */}
                {metadata?.modifiedAt && (
                  <div
                    className={combineTokens(
                      DESIGN_TOKENS.layout.patterns.flexGapSm
                    )}
                  >
                    <Calendar
                      className={combineTokens(
                        DESIGN_TOKENS.layout.spacing.fine.size4
                      )}
                      aria-hidden='true'
                    />
                    <span>{formatDate(metadata.modifiedAt)}</span>
                  </div>
                )}

                {/* Author */}
                {metadata?.author && (
                  <div
                    className={combineTokens('flex', 'items-center', 'gap-1')}
                  >
                    <User
                      className={combineTokens('size-3')}
                      aria-hidden='true'
                    />
                    <span>{metadata.author}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags (detailed size only) */}
            {size === 'detailed' &&
              metadata?.tags &&
              metadata.tags.length > 0 && (
                <div
                  className={combineTokens(
                    'mt-2',
                    'flex',
                    'flex-wrap',
                    'gap-1'
                  )}
                >
                  {metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={combineTokens(
                        DESIGN_TOKENS.recipe.badgeDefault,
                        'px-2 py-1 text-xs'
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            {/* Expiration Warning */}
            {metadata?.expiresAt && metadata.expiresAt < new Date() && (
              <div
                className={combineTokens(
                  'mt-2 flex items-center gap-1 text-xs',
                  DESIGN_TOKENS.semantic.text.error
                )}
              >
                <AlertCircle
                  className={combineTokens('size-3')}
                  aria-hidden='true'
                />
                <span>Expired on {formatDate(metadata.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail (detailed size only) */}
        {size === 'detailed' && thumbnailUrl && (
          <div className={combineTokens('mt-3')}>
            <img
              src={thumbnailUrl}
              alt={`Preview of ${title}`}
              className={combineTokens(
                'h-32 w-full border object-cover',
                DESIGN_TOKENS.theme.light.radius.md,
                DESIGN_TOKENS.semantic.border.muted
              )}
              loading='lazy'
            />
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div
            className={combineTokens(
              'absolute inset-0 flex items-center justify-center',
              'bg-white/75 backdrop-blur-sm',
              DESIGN_TOKENS.theme.light.radius.md
            )}
          >
            <div
              className={combineTokens(
                'animate-spin rounded-full border-2 border-t-transparent',
                DESIGN_TOKENS.icon.size.md,
                'border-blue-600'
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Document.displayName = 'Document';

export default Document;
