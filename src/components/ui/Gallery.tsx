/**
 * @fileoverview Gallery Component - Enterprise-grade image gallery with multiple layouts
 *
 * A comprehensive gallery component that provides flexible layout options,
 * responsive behavior, lightbox functionality, and progressive loading.
 * Built for modern web applications with performance and UX in mind.
 *
 * Features:
 * - 4 layout variants (grid, masonry, list, carousel)
 * - 5 size variants (xs, sm, md, lg, xl)
 * - Responsive grid columns (1-6 columns)
 * - Lightbox dialog integration
 * - Lazy loading with progressive enhancement
 * - Keyboard navigation support
 * - Full accessibility (WCAG 2.1 AA)
 * - Caption and metadata support
 * - Selection and multi-select capabilities
 * - Infinite scroll support
 * - Error handling and fallbacks
 *
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type HTMLAttributes,
} from 'react';

import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

import Dialog from './Dialog';

// ===== TYPES & INTERFACES =====

/**
 * Layout variants for the gallery
 */
export type GalleryLayout =
  | 'grid' // Regular grid layout
  | 'masonry' // Pinterest-style masonry layout
  | 'list' // Linear list layout
  | 'carousel'; // Horizontal scrolling carousel

/**
 * Size variants for gallery spacing and dimensions
 */
export type GallerySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Column configuration for grid layouts
 */
export type GalleryColumns = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';

/**
 * Gallery item data structure
 */
export interface GalleryItem {
  /** Unique identifier for the item */
  id: string;
  /** Image source URL */
  src: string;
  /** Alternative text for accessibility */
  alt: string;
  /** Optional caption */
  caption?: string;
  /** Optional title */
  title?: string;
  /** Optional thumbnail URL for performance */
  thumbnail?: string;
  /** Optional aspect ratio override */
  aspectRatio?: string;
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Gallery component props
 */
export interface GalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Array of gallery items */
  items: GalleryItem[];
  /** Layout variant */
  layout?: GalleryLayout;
  /** Size variant */
  size?: GallerySize;
  /** Number of columns for grid layout */
  columns?: GalleryColumns;
  /** Whether to enable lightbox functionality */
  lightbox?: boolean;
  /** Whether to enable selection */
  selectable?: boolean;
  /** Whether to allow multiple selection */
  multiSelect?: boolean;
  /** Whether to show captions */
  showCaptions?: boolean;
  /** Whether to enable lazy loading */
  lazyLoad?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Whether to enable infinite scroll */
  infiniteScroll?: boolean;
  /** Custom container class */
  containerClassName?: string;
  /** Custom item class */
  itemClassName?: string;
  /** Callback when item is clicked */
  onItemClick?: (item: GalleryItem, index: number) => void;
  /** Callback when item is selected */
  onSelect?: (selectedItems: GalleryItem[]) => void;
  /** Callback for loading more items */
  onLoadMore?: () => void;
  /** ARIA label for the gallery */
  ariaLabel?: string;
}

// ===== DESIGN TOKENS =====

/**
 * Get gallery-specific design tokens
 */
const getGalleryTokens = () => {
  return {
    // Container styles
    container: {
      grid: `${DESIGN_TOKENS.layout.grid.autoFit} ${DESIGN_TOKENS.layout.spacing.fine.gapMd}`,
      masonry: `columns-1 sm:columns-2 lg:columns-3 xl:columns-4 ${DESIGN_TOKENS.layout.spacing.fine.gapMd}`,
      list: `${DESIGN_TOKENS.layout.stack} ${DESIGN_TOKENS.layout.spacing.fine.gapMd}`,
      carousel: `${DESIGN_TOKENS.layout.patterns.flexHorizontal} ${DESIGN_TOKENS.layout.spacing.fine.gapMd} overflow-x-auto`,
    },

    // Size variants
    size: {
      xs: {
        container: DESIGN_TOKENS.layout.spacing.fine.gapXs,
        columns: 'columns-1 sm:columns-2 lg:columns-3',
        grid: DESIGN_TOKENS.layout.grid.cols3,
      },
      sm: {
        container: DESIGN_TOKENS.layout.spacing.fine.gapSm,
        columns: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
        grid: DESIGN_TOKENS.layout.grid.cols4,
      },
      md: {
        container: DESIGN_TOKENS.layout.spacing.fine.gapMd,
        columns: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
        grid: DESIGN_TOKENS.layout.grid.cols4,
      },
      lg: {
        container: 'gap-6',
        columns: 'columns-1 sm:columns-2 lg:columns-4 xl:columns-5',
        grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5',
      },
      xl: {
        container: 'gap-8',
        columns: 'columns-1 sm:columns-3 lg:columns-5 xl:columns-6',
        grid: 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6',
      },
    },

    // Column configurations
    columns: {
      1: 'grid grid-cols-1',
      2: DESIGN_TOKENS.layout.grid.cols2,
      3: DESIGN_TOKENS.layout.grid.cols3,
      4: DESIGN_TOKENS.layout.grid.cols4,
      5: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: DESIGN_TOKENS.layout.grid.cols6,
      auto: DESIGN_TOKENS.layout.grid.autoFit,
    },

    // Item styles
    item: {
      base: `${DESIGN_TOKENS.theme.light.surface.elevated} ${DESIGN_TOKENS.theme.light.radius.md} ${DESIGN_TOKENS.motion.smooth} overflow-hidden`,
      selectable: `cursor-pointer ${DESIGN_TOKENS.state.hover} hover:${DESIGN_TOKENS.theme.light.elevation.floating}`,
      selected: `${DESIGN_TOKENS.state.selected} ${DESIGN_TOKENS.theme.light.elevation.card}`,
      masonry: 'break-inside-avoid mb-4',
    },

    // Caption styles
    caption: {
      container: `${DESIGN_TOKENS.layout.spacing.fine.padSm} ${DESIGN_TOKENS.theme.light.surface.base}`,
      title: DESIGN_TOKENS.typography.body.medium,
      text: `${DESIGN_TOKENS.typography.body.small} ${DESIGN_TOKENS.semantic.text.muted}`,
    },

    // Loading states
    loading: {
      container: `${DESIGN_TOKENS.layout.grid.autoFit} gap-4`,
      item: `${DESIGN_TOKENS.state.loading} ${DESIGN_TOKENS.theme.light.radius.md} aspect-square`,
    },

    // Lightbox styles
    lightbox: {
      overlay: `fixed inset-0 bg-black/40 z-50 backdrop-blur-sm ${DESIGN_TOKENS.motion.smooth}`,
      content: `p-6 ${DESIGN_TOKENS.layout.flexCenter}`,
      image: 'max-w-full max-h-full object-contain',
      navigation: `${DESIGN_TOKENS.theme.light.surface.elevated} ${DESIGN_TOKENS.theme.light.radius.full} p-3`,
    },
  };
};

// ===== MAIN COMPONENT =====

/**
 * Gallery component for displaying collections of images
 */
export const Gallery = forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      items,
      layout = 'grid',
      size = 'md',
      columns = 'auto',
      lightbox = false,
      selectable = false,
      multiSelect = false,
      showCaptions = true,
      lazyLoad = true,
      loading = false,
      error,
      infiniteScroll = false,
      containerClassName = '',
      itemClassName = '',
      onItemClick,
      onSelect,
      onLoadMore,
      ariaLabel = 'Image gallery',
      className = '',
      ...props
    },
    ref
  ) => {
    const tokens = getGalleryTokens();
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Memoized container classes
    const containerClasses = useMemo(() => {
      const baseClasses = [
        'gallery-container',
        DESIGN_TOKENS.layout.container.base,
      ];

      // Layout-specific classes
      switch (layout) {
        case 'grid': {
          if (columns === 'auto') {
            baseClasses.push(tokens.size[size].grid);
          } else {
            baseClasses.push(tokens.columns[columns]);
          }
          baseClasses.push(tokens.size[size].container);

          break;
        }
        case 'masonry': {
          baseClasses.push(tokens.size[size].columns, 'gap-4');

          break;
        }
        case 'list': {
          baseClasses.push(tokens.container.list);

          break;
        }
        case 'carousel': {
          baseClasses.push(tokens.container.carousel);

          break;
        }
        // No default
      }

      return baseClasses.join(' ');
    }, [layout, size, columns, tokens]);

    // Handle item selection
    const handleItemSelect = useCallback(
      (item: GalleryItem) => {
        if (!selectable) return;

        setSelectedItems(prev => {
          const newSelected = new Set(prev);

          if (multiSelect) {
            if (newSelected.has(item.id)) {
              newSelected.delete(item.id);
            } else {
              newSelected.add(item.id);
            }
          } else {
            newSelected.clear();
            if (!prev.has(item.id)) {
              newSelected.add(item.id);
            }
          }

          // Call onSelect with selected items
          const selectedItemsArray = items.filter(i => newSelected.has(i.id));
          onSelect?.(selectedItemsArray);

          return newSelected;
        });
      },
      [selectable, multiSelect, items, onSelect]
    );

    // Handle item click
    const handleItemClick = useCallback(
      (item: GalleryItem, index: number) => {
        if (lightbox) {
          setLightboxIndex(index);
        }

        if (selectable) {
          handleItemSelect(item);
        }

        onItemClick?.(item, index);
      },
      [lightbox, selectable, handleItemSelect, onItemClick]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, item: GalleryItem, index: number) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleItemClick(item, index);
        }
      },
      [handleItemClick]
    );

    // Lightbox navigation
    const navigateLightbox = useCallback(
      (direction: 'prev' | 'next') => {
        if (lightboxIndex === null) return;

        if (direction === 'prev') {
          setLightboxIndex(prev => (prev! > 0 ? prev! - 1 : items.length - 1));
        } else {
          setLightboxIndex(prev => (prev! < items.length - 1 ? prev! + 1 : 0));
        }
      },
      [lightboxIndex, items.length]
    );

    // Infinite scroll
    useEffect(() => {
      if (!infiniteScroll || !onLoadMore) return;

      const container = containerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      const lastItem = container.lastElementChild;
      if (lastItem) {
        observer.observe(lastItem);
      }

      return () => observer.disconnect();
    }, [infiniteScroll, onLoadMore, items]);

    // Loading state
    if (loading && items.length === 0) {
      return (
        <div
          ref={ref}
          className={`${tokens.loading.container} ${containerClassName} ${className}`}
          role='status'
          aria-label='Loading gallery'
          {...props}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className={tokens.loading.item}
              aria-hidden='true'
            />
          ))}
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div
          ref={ref}
          className={`${DESIGN_TOKENS.layout.patterns.flexCenter} p-6 ${DESIGN_TOKENS.theme.light.surface.base} ${DESIGN_TOKENS.theme.light.radius.md} ${containerClassName} ${className}`}
          role='alert'
          aria-label='Gallery error'
          {...props}
        >
          <div className={DESIGN_TOKENS.layout.patterns.flexCenterCol}>
            <div
              className={`${DESIGN_TOKENS.semantic.text.error} ${DESIGN_TOKENS.typography.heading.h4}`}
            >
              Gallery Error
            </div>
            <p
              className={`${DESIGN_TOKENS.semantic.text.muted} ${DESIGN_TOKENS.typography.body.base}`}
            >
              {error}
            </p>
          </div>
        </div>
      );
    }

    // Empty state
    if (items.length === 0) {
      return (
        <div
          ref={ref}
          className={`${DESIGN_TOKENS.layout.patterns.flexCenter} p-6 ${DESIGN_TOKENS.theme.light.surface.base} ${DESIGN_TOKENS.theme.light.radius.md} ${containerClassName} ${className}`}
          role='status'
          aria-label='Empty gallery'
          {...props}
        >
          <div className={DESIGN_TOKENS.layout.patterns.flexCenterCol}>
            <div
              className={`${DESIGN_TOKENS.semantic.text.muted} ${DESIGN_TOKENS.typography.heading.h4}`}
            >
              No Images
            </div>
            <p
              className={`${DESIGN_TOKENS.semantic.text.muted} ${DESIGN_TOKENS.typography.body.base}`}
            >
              No images found in this gallery.
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Main Gallery Container */}
        <div
          ref={ref}
          className={`${containerClasses} ${containerClassName} ${className}`}
          role='region'
          aria-label={ariaLabel}
          {...props}
        >
          <div
            ref={containerRef}
            className={layout === 'masonry' ? '' : 'contents'}
          >
            {items.map((item, index) => {
              const isSelected = selectedItems.has(item.id);

              return (
                <button
                  key={item.id}
                  type='button'
                  className={` ${tokens.item.base} ${selectable ? tokens.item.selectable : ''} ${isSelected ? tokens.item.selected : ''} ${layout === 'masonry' ? tokens.item.masonry : ''} ${itemClassName} `}
                  {...(selectable
                    ? { 'aria-selected': isSelected, tabIndex: 0 }
                    : {})}
                  onClick={() => handleItemClick(item, index)}
                  onKeyDown={e => handleKeyDown(e, item, index)}
                >
                  <div
                    className={`relative overflow-hidden ${layout === 'masonry' ? '' : 'aspect-square'} rounded-md`}
                  >
                    <img
                      src={item.thumbnail || item.src}
                      alt={item.alt}
                      className={combineTokens('size-full', 'object-cover')}
                      loading={lazyLoad ? 'lazy' : 'eager'}
                    />
                  </div>

                  {showCaptions && (item.caption || item.title) && (
                    <div className={tokens.caption.container}>
                      {item.title && (
                        <div className={tokens.caption.title}>{item.title}</div>
                      )}
                      {item.caption && (
                        <div className={tokens.caption.text}>
                          {item.caption}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lightbox Dialog */}
        {lightbox && lightboxIndex !== null && (
          <Dialog
            open={true}
            onClose={() => setLightboxIndex(null)}
            size='fullscreen'
            closeOnBackdropClick={true}
            closeOnEscape={true}
            contentClassName={tokens.lightbox.overlay}
          >
            <div className={tokens.lightbox.content}>
              <img
                src={items[lightboxIndex].src}
                alt={items[lightboxIndex].alt}
                className={tokens.lightbox.image}
              />

              {/* Navigation */}
              <div
                className={combineTokens(
                  'mt-4',
                  'flex',
                  'items-center',
                  'justify-between'
                )}
              >
                <button
                  onClick={() => navigateLightbox('prev')}
                  className={`${tokens.lightbox.navigation} text-white`}
                  aria-label='Previous image'
                >
                  ←
                </button>
                <span className={combineTokens('text-sm', 'text-gray-400')}>
                  {lightboxIndex + 1} / {items.length}
                </span>
                <button
                  onClick={() => navigateLightbox('next')}
                  className={`${tokens.lightbox.navigation} text-white`}
                  aria-label='Next image'
                >
                  →
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </>
    );
  }
);

Gallery.displayName = 'Gallery';

// ===== COMPOUND COMPONENTS =====

/**
 * Gallery Item component for custom layouts
 */
export interface GalleryItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** Gallery item data */
  item: GalleryItem;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether to show caption */
  showCaption?: boolean;
  /** Click handler */
  onItemClick?: (item: GalleryItem) => void;
}

export const GalleryItem = forwardRef<HTMLButtonElement, GalleryItemProps>(
  (
    {
      item,
      selected = false,
      showCaption = true,
      onItemClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const tokens = getGalleryTokens();

    return (
      <button
        ref={ref}
        type='button'
        className={` ${tokens.item.base} ${onItemClick ? tokens.item.selectable : ''} ${selected ? tokens.item.selected : ''} ${className} `}
        onClick={() => onItemClick?.(item)}
        {...props}
      >
        <div
          className={combineTokens(
            'relative',
            'aspect-square',
            'overflow-hidden',
            'rounded-md'
          )}
        >
          <img
            src={item.thumbnail || item.src}
            alt={item.alt}
            className={combineTokens('size-full', 'object-cover')}
          />
        </div>

        {showCaption && (item.caption || item.title) && (
          <div className={tokens.caption.container}>
            {item.title && (
              <div className={tokens.caption.title}>{item.title}</div>
            )}
            {item.caption && (
              <div className={tokens.caption.text}>{item.caption}</div>
            )}
          </div>
        )}
      </button>
    );
  }
);

GalleryItem.displayName = 'GalleryItem';
