/**
 * SimpleUpload - File Upload Interface
 *
 * User-friendly file upload component with drag & drop, progress tracking,
 * and queue management using react-dropzone.
 *
 * MAPS v3.0 Integration:
 * - ENHANCED_DESIGN_TOKENS for all styling
 * - Motion presets for animations
 * - Accessibility compliance
 * - DragDrop integration
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { Upload, X, FileText, Image, Video, Music, Archive, AlertCircle } from 'lucide-react';
import React from 'react';
import { useDropzone, type FileRejection as DropzoneFileRejection } from 'react-dropzone';

import { getAdaptiveMotionClasses } from '@/components/primitives/motion-utils';
import { cn } from '@/utils/cn';

// ===== UPLOAD INTERFACES =====

export interface UploadResult {
  success: boolean;
  fileId?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
}

export interface UploadQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'paused';
  progress: number;
  result?: UploadResult;
  error?: Error;
  retryCount: number;
}

export interface FileValidationResult {
  valid: boolean;
  errors?: FileValidationError[];
}

export interface FileValidationError {
  code: string;
  message: string;
  field?: string;
}

// ===== COMPONENT VARIANTS =====

const simpleUploadVariants = cva([
  'relative border-2 border-dashed rounded-lg transition-all duration-200',
  'flex flex-col items-center justify-center',
  'cursor-pointer hover:border-border-accent',
  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
], {
  variants: {
    surface: {
      elevated: [
        'bg-surface-elevated border-border-elevated',
        'hover:bg-surface-hover',
      ],
      glass: [
        'backdrop-blur-sm bg-surface-panel/80 border-border-glass',
        'hover:bg-surface-panel/90',
      ],
    },
    size: {
      sm: 'h-32 p-4',
      md: 'h-48 p-6',
      lg: 'h-64 p-8',
    },
    variant: {
      dropzone: 'border-border-subtle',
      button: 'border-solid border-border-accent bg-accent/5',
      minimal: 'border-none bg-transparent p-2',
    },
    state: {
      default: '',
      dragActive: 'border-accent bg-accent-bg/10 scale-[1.02]',
      dragAccept: 'border-success bg-success/10',
      dragReject: 'border-error bg-error/10',
      uploading: 'border-accent bg-accent-bg/5',
      error: 'border-error bg-error/5',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    surface: 'elevated',
    size: 'md',
    variant: 'dropzone',
    state: 'default',
    disabled: false,
  }
});

const uploadQueueVariants = cva([
  'mt-4 space-y-2 max-h-60 overflow-y-auto',
], {
  variants: {
    surface: {
      elevated: 'bg-surface-elevated rounded-lg p-4',
      glass: 'backdrop-blur-sm bg-surface-panel/80 rounded-lg p-4',
    },
  },
  defaultVariants: {
    surface: 'elevated',
  }
});

const queueItemVariants = cva([
  'flex items-center gap-3 p-3 rounded-lg border transition-colors',
], {
  variants: {
    status: {
      pending: 'border-border-subtle bg-surface-canvas',
      uploading: 'border-accent bg-accent-bg/5',
      completed: 'border-success bg-success/5',
      error: 'border-error bg-error/5',
      paused: 'border-warning bg-warning/5',
    },
  },
  defaultVariants: {
    status: 'pending',
  }
});

// ===== MAIN COMPONENT =====

export interface SimpleUploadProps extends VariantProps<typeof simpleUploadVariants> {
  // Upload Configuration
  onUpload: (files: File[]) => Promise<UploadResult[]>;
  uploadEndpoint?: string;
  uploadHeaders?: Record<string, string>;

  // File Constraints
  accept?: string | string[];
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  minFiles?: number;

  // Validation
  validator?: (file: File) => FileValidationResult;
  onValidationError?: (errors: FileValidationError[]) => void;

  // Upload Behavior
  autoUpload?: boolean;
  chunked?: boolean;
  chunkSize?: number;
  retryAttempts?: number;

  // Queue Management
  concurrent?: number;
  queueBehavior?: 'replace' | 'append' | 'merge';

  // Progress & State
  showProgress?: boolean;
  showQueue?: boolean;
  showPreview?: boolean;

  // Content
  placeholder?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    buttonText?: string;
  };

  // Callbacks
  onFileSelect?: (files: File[]) => void;
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  onUploadComplete?: (file: File, result: UploadResult) => void;
  onUploadError?: (file: File, error: Error) => void;
  onQueueChange?: (queue: UploadQueueItem[]) => void;

  // Advanced Features
  imageResize?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  };

  // Persistence
  resumable?: boolean;
  storageKey?: string;

  className?: string;
}

export function SimpleUpload({
  onUpload,
  uploadEndpoint,
  uploadHeaders,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  minFiles,
  validator,
  onValidationError,
  autoUpload = true,
  chunked = false,
  chunkSize = 1024 * 1024, // 1MB
  retryAttempts = 3,
  concurrent = 3,
  queueBehavior = 'append',
  showProgress = true,
  showQueue = true,
  showPreview = true,
  surface = 'elevated',
  size = 'md',
  variant = 'dropzone',
  placeholder,
  onFileSelect,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  onQueueChange,
  imageResize,
  resumable = false,
  storageKey = 'simple-upload-queue',
  className,
  ...props
}: SimpleUploadProps) {
  // ===== STATE MANAGEMENT =====

  const [uploadQueue, setUploadQueue] = React.useState<UploadQueueItem[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ===== MOTION INTEGRATION =====

  const motionClasses = getAdaptiveMotionClasses('all');

  // ===== FILE VALIDATION =====

  const validateFile = React.useCallback((file: File): FileValidationError[] => {
    const errors: FileValidationError[] = [];

    // Size validation
    if (maxSize && file.size > maxSize) {
      errors.push({
        code: 'file-too-large',
        message: `File "${file.name}" is larger than ${formatFileSize(maxSize)}`,
        field: 'size',
      });
    }

    // Custom validation
    if (validator) {
      const result = validator(file);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    }

    return errors;
  }, [maxSize, validator]);

  // ===== DROPZONE CONFIGURATION =====

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open: openFileDialog,
  } = useDropzone({
    ...(accept && {
      accept: Array.isArray(accept) 
        ? accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
        : { [accept]: [] }
    }),
    multiple,
    ...(maxSize && { maxSize }),
    ...(maxFiles && { maxFiles }),
    disabled: uploading,
    onDrop: handleFileDrop,
    onDropRejected: handleDropRejected,
    noClick: true, // We'll handle clicks manually
    noKeyboard: true, // We'll handle keyboard manually
  });

  // ===== FILE HANDLING =====

  function handleFileDrop(acceptedFiles: File[]) {
    setError(null);

    // Validate files
    const validFiles: File[] = [];
    const allErrors: FileValidationError[] = [];

    for (const file of acceptedFiles) {
      const errors = validateFile(file);
      if (errors.length > 0) {
        allErrors.push(...errors);
      } else {
        validFiles.push(file);
      }
    }

    // Handle validation errors
    if (allErrors.length > 0) {
      onValidationError?.(allErrors);
      const firstError = allErrors[0];
      setError(firstError?.message || 'Validation error');
      return;
    }

    // Check file limits
    if (minFiles && validFiles.length < minFiles) {
      const error = `Please select at least ${minFiles} file${minFiles > 1 ? 's' : ''}`;
      setError(error);
      return;
    }

    // Add to queue
    const newItems: UploadQueueItem[] = validFiles.map(file => ({
      id: generateFileId(file),
      file,
      status: 'pending',
      progress: 0,
      retryCount: 0,
    }));

    setUploadQueue(prev => {
      const updated = queueBehavior === 'replace' ? newItems : [...prev, ...newItems];
      onQueueChange?.(updated);
      return updated;
    });

    // Notify file selection
    onFileSelect?.(validFiles);

    // Auto-upload if enabled
    if (autoUpload) {
      void processUploadQueue(newItems);
    }
  }

  function handleDropRejected(fileRejections: DropzoneFileRejection[]) {
    const errors: FileValidationError[] = fileRejections.flatMap(rejection =>
      rejection.errors.map(error => ({
        code: error.code,
        message: `${rejection.file.name}: ${error.message}`,
        field: 'validation',
      }))
    );

    onValidationError?.(errors);
    setError(errors[0]?.message || 'Some files were rejected');
  }

  // ===== UPLOAD PROCESSING =====

  async function processUploadQueue(items: UploadQueueItem[] = uploadQueue) {
    if (uploading) return;

    const pendingItems = items.filter(item => item.status === 'pending');
    if (pendingItems.length === 0) return;

    setUploading(true);

    try {
      // Process files in batches
      const batches = chunk(pendingItems, concurrent);

      for (const batch of batches) {
        await Promise.all(batch.map(uploadFile));
      }
    } finally {
      setUploading(false);
    }
  }

  async function uploadFile(item: UploadQueueItem): Promise<void> {
    updateQueueItem(item.id, { status: 'uploading', progress: 0 });
    onUploadStart?.(item.file);

    try {
      let result: UploadResult;

      if (uploadEndpoint) {
        result = await uploadToEndpoint(item);
      } else {
        // Use the provided onUpload function
        const results = await onUpload([item.file]);
        const uploadResult = results[0];
        if (!uploadResult) {
          throw new Error('Upload function returned no result');
        }
        result = uploadResult;
      }

      updateQueueItem(item.id, {
        status: 'completed',
        progress: 100,
        result
      });

      onUploadComplete?.(item.file, result);
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Upload failed');

      updateQueueItem(item.id, {
        status: 'error',
        progress: 0,
        error: uploadError,
        retryCount: item.retryCount + 1
      });

      onUploadError?.(item.file, uploadError);

      // Auto-retry if enabled
      if (item.retryCount < retryAttempts) {
        setTimeout(() => {
          updateQueueItem(item.id, { status: 'pending' });
          void uploadFile(item);
        }, 1000 * Math.pow(2, item.retryCount)); // Exponential backoff
      }
    }
  }

  async function uploadToEndpoint(item: UploadQueueItem): Promise<UploadResult> {
    if (!uploadEndpoint) {
      throw new Error('Upload endpoint not configured');
    }

    const formData = new FormData();
    formData.append('file', item.file);

    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      ...(uploadHeaders && { headers: uploadHeaders }),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      fileId: data.id,
      url: data.url,
      metadata: data,
    };
  }

  function updateQueueItem(id: string, updates: Partial<UploadQueueItem>) {
    setUploadQueue(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      onQueueChange?.(updated);
      return updated;
    });
  }

  // ===== QUEUE MANAGEMENT =====

  const removeFromQueue = React.useCallback((id: string) => {
    setUploadQueue(prev => {
      const updated = prev.filter(item => item.id !== id);
      onQueueChange?.(updated);
      return updated;
    });
  }, [onQueueChange]);

  const retryUpload = React.useCallback((id: string) => {
    const item = uploadQueue.find(item => item.id === id);
    if (item) {
      updateQueueItem(id, { status: 'pending' });
      void uploadFile(item);
    }
  }, [uploadQueue]);

  const clearQueue = React.useCallback(() => {
    setUploadQueue([]);
    onQueueChange?.([]);
  }, [onQueueChange]);

  // ===== UPLOAD STATE =====

  const getUploadState = React.useCallback(() => {
    if (isDragReject) return 'dragReject';
    if (isDragAccept) return 'dragAccept';
    if (isDragActive) return 'dragActive';
    if (uploading) return 'uploading';
    if (error) return 'error';
    return 'default';
  }, [isDragActive, isDragAccept, isDragReject, uploading, error]);

  // ===== RENDER =====

  return (
    <div className={cn('simple-upload', className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          simpleUploadVariants({
            surface,
            size,
            variant,
            state: getUploadState(),
            disabled: uploading,
          }),
          motionClasses
        )}
        onClick={openFileDialog}
        {...props}
      >
        <input {...getInputProps()} />

        <div className="text-center">
          {/* Icon */}
          <div className="mb-4 text-foreground-muted">
            {placeholder?.icon || <Upload className="w-12 h-12 mx-auto" />}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-foreground mb-2">
            {placeholder?.title || (
              isDragActive
                ? 'Drop files here'
                : 'Drag & drop files here'
            )}
          </h3>

          {/* Description */}
          <p className="text-sm text-foreground-muted mb-4">
            {placeholder?.description || (
              <>
                {accept && `Accepts: ${Array.isArray(accept) ? accept.join(', ') : accept}`}
                {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                {maxFiles && ` • Max files: ${maxFiles}`}
              </>
            )}
          </p>

          {/* Action Button */}
          <span className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent-hover transition-colors">
            {placeholder?.buttonText || 'Choose files'}
          </span>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-error text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-surface-overlay/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-foreground">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Queue */}
      {showQueue && uploadQueue.length > 0 && (
        <div className={cn(uploadQueueVariants({ surface }))}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">
              Upload Queue ({uploadQueue.length})
            </h4>
            <button
              onClick={clearQueue}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {uploadQueue.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                showProgress={showProgress}
                showPreview={showPreview}
                onRemove={removeFromQueue}
                onRetry={retryUpload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== QUEUE ITEM COMPONENT =====

interface QueueItemProps {
  item: UploadQueueItem;
  showProgress: boolean;
  showPreview: boolean;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

function QueueItem({ item, showProgress, showPreview, onRemove, onRetry }: QueueItemProps) {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getStatusText = (status: UploadQueueItem['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'uploading': return 'Uploading';
      case 'completed': return 'Completed';
      case 'error': return 'Failed';
      case 'paused': return 'Paused';
    }
  };

  return (
    <div className={queueItemVariants({ status: item.status })}>
      {/* File Icon & Preview */}
      <div className="flex-shrink-0">
        {showPreview && item.file.type.startsWith('image/') ? (
          <div className="w-10 h-10 rounded bg-surface-subtle overflow-hidden">
            <img
              src={URL.createObjectURL(item.file)}
              alt={item.file.name}
              className="w-full h-full object-cover"
              onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded bg-surface-subtle flex items-center justify-center text-foreground-muted">
            {getFileIcon(item.file)}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{item.file.name}</p>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            item.status === 'completed' && 'bg-success/20 text-success',
            item.status === 'error' && 'bg-error/20 text-error',
            item.status === 'uploading' && 'bg-accent/20 text-accent',
            item.status === 'pending' && 'bg-surface-subtle text-foreground-muted'
          )}>
            {getStatusText(item.status)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-foreground-muted">
          <span>{formatFileSize(item.file.size)}</span>
          {item.status === 'uploading' && showProgress && (
            <span>{item.progress}%</span>
          )}
          {item.error && (
            <span className="text-error">{item.error.message}</span>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (item.status === 'uploading' || item.status === 'completed') && (
          <div className="mt-2 w-full bg-surface-subtle rounded-full h-1.5">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                item.status === 'completed' ? 'bg-success' : 'bg-accent'
              )}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {item.status === 'error' && (
          <button
            onClick={() => onRetry(item.id)}
            className="text-xs text-accent hover:text-accent-hover transition-colors"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===== UTILITY FUNCTIONS =====

function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ===== FILE TYPE PRESETS =====

export const FileTypePresets = {
  images: {
    accept: ['image/*'],
    maxSize: 10 * 1024 * 1024, // 10MB
    preview: true,
    resize: { maxWidth: 1920, maxHeight: 1080, quality: 0.9 },
  },
  documents: {
    accept: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    maxSize: 50 * 1024 * 1024, // 50MB
    preview: false,
  },
  media: {
    accept: ['video/*', 'audio/*'],
    maxSize: 500 * 1024 * 1024, // 500MB
    chunked: true,
    chunkSize: 1024 * 1024, // 1MB chunks
  },
  archives: {
    accept: ['.zip', '.rar', '.7z', '.tar', '.gz'],
    maxSize: 100 * 1024 * 1024, // 100MB
    preview: false,
  },
} as const;

export default SimpleUpload;
