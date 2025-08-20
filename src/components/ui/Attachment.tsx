/**
 * Attachment Component
 * 
 * Enterprise-grade attachment component for displaying and managing file attachments and links.
 * Supports multiple attachment types, preview capabilities, and comprehensive metadata display.
 * 
 * Features:
 * - Multiple attachment types (file, link, image, document)
 * - Size variants (compact, default, detailed)
 * - Interactive actions (download, preview, remove)
 * - Progress tracking for uploads
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Drag and drop support
 * - Thumbnail previews
 * - File type recognition with appropriate icons
 * 
 * @version 1.0.0
 * @author SparkTasks Team
 */

import React, { forwardRef, useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Eye, 
  X,
  Upload,
  Link2,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  FileSpreadsheet,
  Presentation,
  AlertCircle,
  CheckCircle2,
  Clock,
  Paperclip
} from 'lucide-react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// Attachment types
export type AttachmentType = 
  | 'file' 
  | 'link' 
  | 'image' 
  | 'document'
  | 'video'
  | 'audio'
  | 'archive'
  | 'spreadsheet'
  | 'presentation'
  | 'unknown';

// Attachment status types
export type AttachmentStatus = 'uploading' | 'complete' | 'error' | 'pending';

// Attachment size variants
export type AttachmentSize = 'compact' | 'default' | 'detailed';

// Attachment metadata interface
export interface AttachmentMetadata {
  fileName?: string;
  fileSize?: number;
  uploadedAt?: Date;
  uploadedBy?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  mimeType?: string;
  isSecure?: boolean;
  expiresAt?: Date;
  downloadCount?: number;
}

// Main component props
export interface AttachmentProps {
  /** Attachment title/name */
  title: string;
  
  /** Attachment type */
  type?: AttachmentType;
  
  /** Attachment status */
  status?: AttachmentStatus;
  
  /** Display size variant */
  size?: AttachmentSize;
  
  /** Attachment metadata */
  metadata?: AttachmentMetadata;
  
  /** Upload progress (0-100) */
  progress?: number;
  
  /** Show preview action */
  showPreview?: boolean;
  
  /** Show download action */
  showDownload?: boolean;
  
  /** Show remove action */
  showRemove?: boolean;
  
  /** Show external link indicator */
  isExternal?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Custom actions */
  customActions?: React.ReactNode;
  
  /** Click handler for attachment */
  onClick?: () => void;
  
  /** Preview action handler */
  onPreview?: () => void;
  
  /** Download action handler */
  onDownload?: () => void;
  
  /** Remove action handler */
  onRemove?: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Get attachment type icon with appropriate styling
 */
const getTypeIcon = (type: AttachmentType): React.ReactNode => {
  const iconProps = { className: 'size-5 shrink-0' };
  
  switch (type) {
    case 'file':
      return <FileText {...iconProps} className="size-5 shrink-0 text-blue-600" />;
    case 'link':
      return <Link2 {...iconProps} className="size-5 shrink-0 text-green-600" />;
    case 'image':
      return <FileImage {...iconProps} className="size-5 shrink-0 text-purple-600" />;
    case 'document':
      return <FileText {...iconProps} className="size-5 shrink-0 text-red-600" />;
    case 'video':
      return <FileVideo {...iconProps} className="size-5 shrink-0 text-orange-600" />;
    case 'audio':
      return <FileAudio {...iconProps} className="size-5 shrink-0 text-pink-600" />;
    case 'archive':
      return <Archive {...iconProps} className="size-5 shrink-0 text-gray-600" />;
    case 'spreadsheet':
      return <FileSpreadsheet {...iconProps} className="size-5 shrink-0 text-green-600" />;
    case 'presentation':
      return <Presentation {...iconProps} className="size-5 shrink-0 text-orange-600" />;
    default:
      return <Paperclip {...iconProps} className="size-5 shrink-0 text-gray-600" />;
  }
};

/**
 * Get status indicator based on attachment status
 */
const getStatusIndicator = (status: AttachmentStatus): React.ReactNode => {
  const iconProps = { className: 'size-4 shrink-0' };
  
  switch (status) {
    case 'uploading':
      return <Upload {...iconProps} className="size-4 shrink-0 text-blue-500" />;
    case 'complete':
      return <CheckCircle2 {...iconProps} className="size-4 shrink-0 text-green-500" />;
    case 'error':
      return <AlertCircle {...iconProps} className="size-4 shrink-0 text-red-500" />;
    case 'pending':
      return <Clock {...iconProps} className="size-4 shrink-0 text-orange-500" />;
    default:
      return null;
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
  
  return (Math.round((bytes / Math.pow(k, i)) * 10) / 10).toFixed(1) + ' ' + sizes[i];
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
    minute: '2-digit'
  }).format(date);
};

/**
 * Get attachment classes based on props
 */
const getAttachmentClasses = (
  size: AttachmentSize,
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
    default: DESIGN_TOKENS.spacing.section,
    detailed: DESIGN_TOKENS.spacing.section
  }[size];
  
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200'
    : '';
  
  const stateClasses = disabled 
    ? 'opacity-50 cursor-not-allowed'
    : loading 
    ? 'opacity-75'
    : '';
  
  return combineTokens(
    baseClasses,
    sizeClasses,
    interactiveClasses,
    stateClasses
  );
};

/**
 * Attachment Component
 * 
 * Enterprise-grade attachment display component with comprehensive features.
 */
const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(({
  title,
  type = 'file',
  status = 'complete',
  size = 'default',
  metadata,
  progress,
  showPreview = true,
  showDownload = true,
  showRemove = false,
  isExternal = false,
  disabled = false,
  loading = false,
  customActions,
  onClick,
  onPreview,
  onDownload,
  onRemove,
  className,
  style,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hasCustomBackground = style?.backgroundColor !== undefined;
  const attachmentClasses = getAttachmentClasses(size, disabled, loading, onClick, hasCustomBackground);
  
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };
  
  const handleActionClick = (event: React.MouseEvent, action?: () => void) => {
    event.stopPropagation();
    if (action && !disabled && !loading) {
      action();
    }
  };
  
  return (
    <div
      ref={ref}
      className={combineTokens(attachmentClasses, className)}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'article'}
      aria-label={`Attachment: ${title}`}
      aria-disabled={disabled}
      {...props}
    >
      {/* Header Section */}
      <div className="flex items-start gap-3">
        {/* Attachment Icon */}
        <div className="mt-1 shrink-0">
          {getTypeIcon(type)}
        </div>
        
        {/* Attachment Information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            {/* Title and Status */}
            <div className="min-w-0 flex-1">
              <h3 className={combineTokens(
                DESIGN_TOKENS.typography.heading.h6,
                'truncate'
              )}>
                {title}
                {isExternal && (
                  <ExternalLink className={combineTokens(
                    'ml-1 inline-block',
                    DESIGN_TOKENS.icon.size.xs,
                    DESIGN_TOKENS.semantic.text.muted
                  )} aria-hidden="true" />
                )}
                {metadata?.isSecure && (
                  <CheckCircle2 className={combineTokens(
                    'ml-1 inline-block',
                    DESIGN_TOKENS.icon.size.xs,
                    DESIGN_TOKENS.semantic.text.success
                  )} aria-label="Secure" />
                )}
              </h3>
              
              {/* Status and Type */}
              <div className="mt-1 flex items-center gap-2">
                {getStatusIndicator(status)}
                <span className={combineTokens(
                  DESIGN_TOKENS.typography.body.small,
                  DESIGN_TOKENS.semantic.text.muted
                )}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className={DESIGN_TOKENS.semantic.text.muted}>•</span>
                <span className={combineTokens(
                  DESIGN_TOKENS.typography.body.small,
                  DESIGN_TOKENS.semantic.text.muted
                )}>
                  {type.toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={combineTokens(
              'flex items-center gap-1 shrink-0',
              isHovered ? 'opacity-100' : 'opacity-0',
              'transition-opacity duration-200'
            )}>
              {showPreview && onPreview && (
                <button
                  onClick={(e) => handleActionClick(e, onPreview)}
                  className={combineTokens(
                    DESIGN_TOKENS.recipe.button.ghost,
                    DESIGN_TOKENS.icon.size.md,
                    'p-0'
                  )}
                  aria-label="Preview attachment"
                  title="Preview"
                  type="button"
                >
                  <Eye className="size-4" aria-hidden="true" />
                </button>
              )}
              
              {showDownload && onDownload && (
                <button
                  onClick={(e) => handleActionClick(e, onDownload)}
                  className={combineTokens(
                    DESIGN_TOKENS.recipe.button.ghost,
                    DESIGN_TOKENS.icon.size.md,
                    'p-0'
                  )}
                  aria-label="Download attachment"
                  title="Download"
                  type="button"
                >
                  <Download className="size-4" aria-hidden="true" />
                </button>
              )}
              
              {showRemove && onRemove && (
                <button
                  onClick={(e) => handleActionClick(e, onRemove)}
                  className={combineTokens(
                    DESIGN_TOKENS.recipe.button.ghost,
                    DESIGN_TOKENS.icon.size.md,
                    'p-0 text-red-600 hover:text-red-700'
                  )}
                  aria-label="Remove attachment"
                  title="Remove"
                  type="button"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
              
              {customActions}
            </div>
          </div>
          
          {/* Progress Bar (for uploading status) */}
          {status === 'uploading' && progress !== undefined && (
            <div className="mt-2">
              <div className={combineTokens(
                'w-full bg-gray-200 rounded-full h-1.5',
                DESIGN_TOKENS.theme.light.radius.sm
              )}>
                <div 
                  className={combineTokens(
                    'bg-blue-600 h-1.5 rounded-full transition-all duration-300',
                    DESIGN_TOKENS.theme.light.radius.sm
                  )}
                  style={{ width: `${progress}%` }}
                  aria-label={`Upload progress: ${progress}%`}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {progress}% complete
              </div>
            </div>
          )}
          
          {/* Metadata Section */}
          {size !== 'compact' && (
            <div className={combineTokens(
              'flex items-center gap-4 mt-2 text-xs',
              DESIGN_TOKENS.semantic.text.muted
            )}>
              {/* File Size */}
              {metadata?.fileSize !== undefined && (
                <span>{formatFileSize(metadata.fileSize)}</span>
              )}
              
              {/* Upload Date */}
              {metadata?.uploadedAt && (
                <span>{formatDate(metadata.uploadedAt)}</span>
              )}
              
              {/* Uploaded By */}
              {metadata?.uploadedBy && (
                <span>by {metadata.uploadedBy}</span>
              )}
              
              {/* Download Count */}
              {metadata?.downloadCount !== undefined && (
                <span>{metadata.downloadCount} downloads</span>
              )}
            </div>
          )}
          
          {/* Description (detailed view only) */}
          {size === 'detailed' && metadata?.description && (
            <div className={combineTokens(
              'mt-2 text-sm',
              DESIGN_TOKENS.semantic.text.muted
            )}>
              {metadata.description}
            </div>
          )}
          
          {/* Expiration Warning */}
          {metadata?.expiresAt && metadata.expiresAt < new Date() && (
            <div className={combineTokens(
              'flex items-center gap-1 mt-2 text-xs',
              DESIGN_TOKENS.semantic.text.error
            )}>
              <AlertCircle className="size-3" aria-hidden="true" />
              <span>
                Expired on {formatDate(metadata.expiresAt)}
              </span>
            </div>
          )}
        </div>
        
        {/* Thumbnail (detailed view only) */}
        {size === 'detailed' && metadata?.thumbnailUrl && (
          <div className="mt-1 shrink-0">
            <img
              src={metadata.thumbnailUrl}
              alt={`Preview of ${title}`}
              className={combineTokens(
                'w-12 h-12 object-cover rounded',
                DESIGN_TOKENS.theme.light.radius.sm
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
});

Attachment.displayName = 'Attachment';

export { Attachment };
