/**
 * DragDropProvider - Universal Drag & Drop System
 *
 * Comprehensive drag & drop system with dnd-kit integration, supporting
 * sortable lists, file drops, and cross-component interactions.
 *
 * MAPS v3.0 Integration:
 * - ENHANCED_DESIGN_TOKENS for all styling
 * - Motion presets for drag animations
 * - Touch, mouse, and keyboard support
 * - Accessibility compliance
 */

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type DragMoveEvent,
  type DragCancelEvent,
  type UniqueIdentifier,
  type CollisionDetection,
  type Modifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  type SortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import {
  getAdaptiveMotionClasses,
  prefersReducedMotion,
} from '@/components/primitives/motion-utils';
import { cn } from '@/utils/cn';

// ===== DRAG & DROP INTERFACES =====

export interface DragDropSensor {
  name: string;
  sensor: any;
  options?: any;
}

export interface DragDropModifier extends Modifier {}

export interface MeasuringConfiguration {
  droppable?: any;
  draggable?: any;
}

export interface DragDropAnnouncements {
  onDragStart: (event: DragStartEvent) => string;
  onDragMove?: (event: DragMoveEvent) => string;
  onDragOver: (event: DragOverEvent) => string;
  onDragEnd: (event: DragEndEvent) => string;
  onDragCancel: (event: DragCancelEvent) => string;
}

export interface ScreenReaderInstructions {
  draggable: string;
}

// ===== COMPONENT VARIANTS =====

const dragOverlayVariants = cva(['transform-gpu opacity-80 shadow-lg'], {
  variants: {
    surface: {
      elevated: 'bg-surface-elevated border-border-elevated rounded-lg border',
      glass:
        'bg-surface-panel/90 border-border-glass rounded-lg border backdrop-blur-lg',
    },
  },
  defaultVariants: {
    surface: 'elevated',
  },
});

const sortableItemVariants = cva(
  ['transition-transform', 'touch-manipulation'],
  {
    variants: {
      isDragging: {
        true: 'z-10 opacity-50',
        false: 'opacity-100',
      },
      surface: {
        elevated: 'bg-surface-elevated',
        glass: 'bg-surface-panel/80 backdrop-blur-sm',
      },
      spacing: {
        sm: 'mb-2',
        md: 'mb-4',
        lg: 'mb-6',
      },
    },
    defaultVariants: {
      isDragging: false,
      surface: 'elevated',
      spacing: 'md',
    },
  }
);

// ===== MAIN PROVIDER COMPONENT =====

export interface DragDropProviderProps {
  children: React.ReactNode;

  // Core Configuration
  sensors?: DragDropSensor[];
  modifiers?: DragDropModifier[];

  // Collision Detection
  collisionDetection?: CollisionDetection;
  measuring?: MeasuringConfiguration;

  // Accessibility
  accessibility?: {
    announcements?: DragDropAnnouncements;
    screenReaderInstructions?: ScreenReaderInstructions;
  };

  // Auto-scroll
  autoScroll?:
    | boolean
    | {
        enabled: boolean;
        threshold?: { x: number; y: number };
        speed?: number;
      };

  // Visual Feedback
  dragOverlay?: {
    modifiers?: DragDropModifier[];
    style?: React.CSSProperties;
    className?: string;
  };

  // Callbacks
  onDragStart?: (event: DragStartEvent) => void;
  onDragMove?: (event: DragMoveEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel?: (event: DragCancelEvent) => void;

  // Performance
  recomputeLayouts?: string[];

  className?: string;
}

export function DragDropProvider({
  children,
  sensors: customSensors,
  modifiers = [],
  collisionDetection = closestCenter,
  measuring,
  accessibility,
  autoScroll = true,
  dragOverlay,
  onDragStart,
  onDragMove,
  onDragOver,
  onDragEnd,
  onDragCancel,
  className,
}: DragDropProviderProps) {
  // ===== STATE MANAGEMENT =====

  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const isReducedMotion = prefersReducedMotion();

  // ===== SENSORS CONFIGURATION =====

  const defaultSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Properly handle custom sensors without conditional Hook usage
  const customSensorsArray = React.useMemo(
    () => customSensors?.map(s => useSensor(s.sensor, s.options || {})) || [],
    [customSensors]
  );

  const sensors = useSensors(...defaultSensors, ...customSensorsArray);

  // ===== MOTION INTEGRATION =====

  const motionClasses = getAdaptiveMotionClasses('transform');

  // ===== EVENT HANDLERS =====

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      onDragStart?.(event);
    },
    [onDragStart]
  );

  const handleDragMove = React.useCallback(
    (event: DragMoveEvent) => {
      onDragMove?.(event);
    },
    [onDragMove]
  );

  const handleDragOver = React.useCallback(
    (event: DragOverEvent) => {
      onDragOver?.(event);
    },
    [onDragOver]
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      onDragEnd(event);
    },
    [onDragEnd]
  );

  const handleDragCancel = React.useCallback(
    (event: DragCancelEvent) => {
      setActiveId(null);
      onDragCancel?.(event);
    },
    [onDragCancel]
  );

  // ===== ACCESSIBILITY CONFIGURATION =====

  const defaultAnnouncements: DragDropAnnouncements = {
    onDragStart: ({ active }) => `Picked up draggable item ${active.id}.`,
    onDragOver: ({ active, over }) => {
      if (over) {
        return `Draggable item ${active.id} was moved over droppable area ${over.id}.`;
      }
      return `Draggable item ${active.id} is no longer over a droppable area.`;
    },
    onDragEnd: ({ active, over }) => {
      if (over) {
        return `Draggable item ${active.id} was dropped over droppable area ${over.id}.`;
      }
      return `Draggable item ${active.id} was dropped.`;
    },
    onDragCancel: ({ active }) =>
      `Dragging was cancelled. Draggable item ${active.id} was dropped.`,
  };

  const announcements = React.useMemo(
    () => ({
      ...defaultAnnouncements,
      ...(accessibility?.announcements || {}),
    }),
    [accessibility?.announcements]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      {...(measuring && { measuring })}
      modifiers={modifiers}
      autoScroll={autoScroll}
      accessibility={{
        ...(announcements && { announcements }),
        ...(accessibility?.screenReaderInstructions && {
          screenReaderInstructions: accessibility.screenReaderInstructions,
        }),
      }}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className={cn('drag-drop-provider', motionClasses, className)}>
        {children}
      </div>

      {/* Drag Overlay */}
      <DragOverlay
        modifiers={dragOverlay?.modifiers || []}
        {...(dragOverlay?.style && { style: dragOverlay.style })}
        className={cn(dragOverlayVariants(), dragOverlay?.className)}
        dropAnimation={{
          duration: isReducedMotion ? 0 : 250,
          easing: 'cubic-bezier(0.2, 0, 0.2, 1)',
        }}
      >
        {activeId ? (
          <div className='drag-overlay-item'>Dragging {activeId}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ===== SORTABLE LIST COMPONENT =====

export interface SortableListProps<T>
  extends VariantProps<typeof sortableItemVariants> {
  items: T[];
  onReorder: (items: T[]) => void;

  // Rendering
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  keyExtractor: (item: T) => string;

  // Behavior
  strategy?: SortingStrategy;
  disabled?: boolean;
  handle?: boolean;

  // Styling
  orientation?: 'vertical' | 'horizontal';

  // Animation
  animateLayoutChanges?: boolean;
  transition?: any; // TODO: Use proper transition type from dnd-kit

  // Constraints
  maxItems?: number;
  minItems?: number;
  allowDuplicates?: boolean;

  className?: string;
  itemClassName?: string;
}

export function SortableList<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  strategy,
  disabled = false,
  handle = false,
  surface = 'elevated',
  spacing = 'md',
  orientation = 'vertical',
  transition,
  className,
  itemClassName,
}: SortableListProps<T>) {
  const itemIds = items.map(keyExtractor);

  const sortingStrategy =
    strategy ||
    (orientation === 'horizontal'
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy);

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = itemIds.indexOf(String(active.id));
        const newIndex = itemIds.indexOf(String(over?.id || ''));

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex);
          onReorder(newItems);
        }
      }
    },
    [items, itemIds, onReorder]
  );

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={sortingStrategy}>
        <div
          className={cn(
            'sortable-list',
            orientation === 'horizontal' && 'flex gap-4',
            className
          )}
        >
          {items.map((item, index) => (
            <SortableItem
              key={keyExtractor(item)}
              id={keyExtractor(item)}
              index={index}
              surface={surface}
              spacing={spacing}
              disabled={disabled}
              handle={handle}
              transition={transition}
              className={itemClassName || ''}
            >
              {renderItem}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DragDropProvider>
  );
}

// ===== SORTABLE ITEM COMPONENT =====

interface SortableItemProps extends VariantProps<typeof sortableItemVariants> {
  id: string;
  index: number;
  disabled?: boolean;
  handle?: boolean;
  animateLayoutChanges?: boolean | ((args: any) => boolean);
  transition?: any; // TODO: Use proper transition type from dnd-kit
  children: (item: any, index: number, isDragging: boolean) => React.ReactNode;
  className?: string;
}

function SortableItem({
  id,
  index,
  surface = 'elevated',
  spacing = 'md',
  disabled = false,
  handle = false,
  transition,
  children,
  className,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition: sortableTransition,
    isDragging,
  } = useSortable({
    id,
    disabled,
    transition,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: sortableTransition,
  };

  const itemProps = handle ? {} : { ...attributes, ...listeners };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sortableItemVariants({ surface, spacing, isDragging }),
        className
      )}
      {...itemProps}
    >
      {children({ id }, index, isDragging)}
    </div>
  );
}

// ===== FILE DROP ZONE COMPONENT =====

export interface FileRejection {
  file: File;
  errors: Array<{
    code: string;
    message: string;
  }>;
}

export interface FileDropZoneProps
  extends VariantProps<typeof dragOverlayVariants> {
  // File Handling
  onFileDrop: (files: File[]) => void;
  accept?: string | string[];
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;

  // Validation
  validator?: (file: File) => FileRejection | null;
  onReject?: (rejections: FileRejection[]) => void;

  // State
  disabled?: boolean;
  loading?: boolean;

  // Appearance
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'minimal';

  // Content
  children?: React.ReactNode;
  placeholder?: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    actionText?: string;
  };

  // Styling States
  activeClassName?: string;
  acceptClassName?: string;
  rejectClassName?: string;

  className?: string;
}

const fileDropZoneVariants = cva(
  [
    'rounded-lg border-2 border-dashed transition-colors',
    'flex flex-col items-center justify-center',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'h-32 p-4',
        md: 'h-48 p-6',
        lg: 'h-64 p-8',
        xl: 'h-80 p-12',
      },
      variant: {
        default: 'border-border-subtle hover:border-border-accent',
        compact: 'rounded-md border-border-subtle hover:border-border-accent',
        minimal: 'rounded-sm border-border-subtle hover:border-border-accent',
      },
      state: {
        default: '',
        active: 'border-accent-border bg-accent-bg/5',
        accept: 'border-success bg-success/5',
        reject: 'border-error bg-error/5',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
      state: 'default',
      disabled: false,
    },
  }
);

export function FileDropZone({
  onFileDrop,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  validator,
  onReject,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'default',
  children,
  placeholder,
  activeClassName,
  acceptClassName,
  rejectClassName,
  className,
}: FileDropZoneProps) {
  const [dragState, setDragState] = React.useState<
    'default' | 'active' | 'accept' | 'reject'
  >('default');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = React.useCallback(
    (file: File): FileRejection | null => {
      const errors: Array<{ code: string; message: string }> = [];

      // Size validation
      if (maxSize && file.size > maxSize) {
        errors.push({
          code: 'file-too-large',
          message: `File is larger than ${maxSize} bytes`,
        });
      }

      // Type validation
      if (accept) {
        const acceptedTypes = Array.isArray(accept) ? accept : [accept];
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(type);
        });

        if (!isAccepted) {
          errors.push({
            code: 'file-invalid-type',
            message: `File type ${file.type} is not accepted`,
          });
        }
      }

      // Custom validation
      if (validator) {
        const customResult = validator(file);
        if (customResult) {
          errors.push(...customResult.errors);
        }
      }

      return errors.length > 0 ? { file, errors } : null;
    },
    [accept, maxSize, validator]
  );

  const handleFiles = React.useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Limit number of files
      const limitedFiles = maxFiles ? fileArray.slice(0, maxFiles) : fileArray;

      // Validate files
      const validFiles: File[] = [];
      const rejectedFiles: FileRejection[] = [];

      for (const file of limitedFiles) {
        const rejection = validateFile(file);
        if (rejection) {
          rejectedFiles.push(rejection);
        } else {
          validFiles.push(file);
        }
      }

      // Handle results
      if (validFiles.length > 0) {
        onFileDrop(validFiles);
      }

      if (rejectedFiles.length > 0) {
        onReject?.(rejectedFiles);
      }
    },
    [maxFiles, validateFile, onFileDrop, onReject]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragState('active');
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragState('default');
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragState('default');

      if (disabled || loading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, loading, handleFiles]
  );

  const handleClick = React.useCallback(() => {
    if (disabled || loading) return;
    fileInputRef.current?.click();
  }, [disabled, loading]);

  const handleFileInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input
      e.target.value = '';
    },
    [handleFiles]
  );

  const currentClassName = cn(
    fileDropZoneVariants({ size, variant, state: dragState, disabled }),
    dragState === 'active' && activeClassName,
    dragState === 'accept' && acceptClassName,
    dragState === 'reject' && rejectClassName,
    className
  );

  return (
    <div
      className={currentClassName}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role='button'
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label='File drop zone'
    >
      <input
        ref={fileInputRef}
        type='file'
        accept={Array.isArray(accept) ? accept.join(',') : accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className='sr-only'
        disabled={disabled}
      />

      {children || (
        <div className='text-center'>
          {placeholder?.icon && (
            <div className='mb-4 text-foreground-muted'>{placeholder.icon}</div>
          )}
          {placeholder?.title && (
            <h3 className='mb-2 text-lg font-medium text-foreground'>
              {placeholder.title}
            </h3>
          )}
          {placeholder?.description && (
            <p className='mb-4 text-foreground-muted'>
              {placeholder.description}
            </p>
          )}
          {placeholder?.actionText && (
            <span className='font-medium text-accent'>
              {placeholder.actionText}
            </span>
          )}
        </div>
      )}

      {loading && (
        <div className='bg-surface-overlay/50 absolute inset-0 flex items-center justify-center'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent' />
        </div>
      )}
    </div>
  );
}

// ===== PRE-BUILT PATTERNS =====

export const DragDropPatterns = {
  'sortable-table': {
    sensors: [PointerSensor, KeyboardSensor],
    strategy: verticalListSortingStrategy,
    handle: true,
  },
  'file-upload': {
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  },
  'kanban-cards': {
    sensors: [PointerSensor],
    strategy: rectSortingStrategy,
  },
  'dashboard-widgets': {
    strategy: rectSortingStrategy,
    autoScroll: true,
    collisionDetection: closestCenter,
  },
} as const;

export default DragDropProvider;
