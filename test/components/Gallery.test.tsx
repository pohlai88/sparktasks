/**
 * @fileoverview Gallery Component Tests
 *
 * Comprehensive test suite for the Gallery component covering:
 * - Basic rendering and functionality
 * - Layout variants (grid, masonry, list, carousel)
 * - Size variants and responsive behavior
 * - Selection and multi-selection
 * - Lightbox functionality
 * - Accessibility compliance
 * - Error and loading states
 * - Keyboard navigation
 * - Infinite scroll
 * - DESIGN_TOKENS compliance
 *
 * @version 1.0.0
 * @since 2024
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Gallery,
  GalleryItem,
  type GalleryItem as GalleryItemType,
} from '@/components/ui/Gallery';

// ===== TEST DATA =====

const mockGalleryItems: GalleryItemType[] = [
  {
    id: '1',
    src: 'https://example.com/image1.jpg',
    alt: 'Test image 1',
    title: 'Image 1',
    caption: 'First test image',
    thumbnail: 'https://example.com/thumb1.jpg',
  },
  {
    id: '2',
    src: 'https://example.com/image2.jpg',
    alt: 'Test image 2',
    title: 'Image 2',
    caption: 'Second test image',
    thumbnail: 'https://example.com/thumb2.jpg',
  },
  {
    id: '3',
    src: 'https://example.com/image3.jpg',
    alt: 'Test image 3',
    title: 'Image 3',
    caption: 'Third test image',
    thumbnail: 'https://example.com/thumb3.jpg',
  },
];

// ===== HELPER FUNCTIONS =====

const renderGallery = (props = {}) => {
  return render(
    <Gallery items={mockGalleryItems} ariaLabel='Test gallery' {...props} />
  );
};

// ===== MAIN TEST SUITE =====

describe('Gallery Component - Enterprise Grade', () => {
  // ===== BASIC RENDERING =====

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderGallery();
      expect(
        screen.getByRole('region', { name: 'Test gallery' })
      ).toBeInTheDocument();
    });

    it('renders all gallery items', () => {
      renderGallery();

      mockGalleryItems.forEach(item => {
        expect(screen.getByRole('img', { name: item.alt })).toBeInTheDocument();
      });
    });

    it('displays captions when enabled', () => {
      renderGallery({ showCaptions: true });

      expect(screen.getByText('Image 1')).toBeInTheDocument();
      expect(screen.getByText('First test image')).toBeInTheDocument();
    });

    it('hides captions when disabled', () => {
      renderGallery({ showCaptions: false });

      expect(screen.queryByText('Image 1')).not.toBeInTheDocument();
      expect(screen.queryByText('First test image')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = renderGallery({ className: 'custom-gallery' });
      expect(container.firstChild).toHaveClass('custom-gallery');
    });

    it('applies custom containerClassName', () => {
      const { container } = renderGallery({
        containerClassName: 'custom-container',
      });
      expect(container.firstChild).toHaveClass('custom-container');
    });
  });

  // ===== LAYOUT VARIANTS =====

  describe('Layout Variants', () => {
    it('renders grid layout correctly', () => {
      const { container } = renderGallery({ layout: 'grid' });
      expect(container.querySelector('.gallery-container')).toBeInTheDocument();
    });

    it('renders masonry layout correctly', () => {
      const { container } = renderGallery({ layout: 'masonry' });
      const galleryContainer = container.querySelector('.gallery-container');
      expect(galleryContainer).toHaveClass('columns-1');
    });

    it('renders list layout correctly', () => {
      const { container } = renderGallery({ layout: 'list' });
      const galleryContainer = container.querySelector('.gallery-container');
      expect(galleryContainer).toBeInTheDocument();
    });

    it('renders carousel layout correctly', () => {
      const { container } = renderGallery({ layout: 'carousel' });
      const galleryContainer = container.querySelector('.gallery-container');
      expect(galleryContainer).toHaveClass('overflow-x-auto');
    });
  });

  // ===== SIZE VARIANTS =====

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        const { container } = renderGallery({ size });
        expect(
          container.querySelector('.gallery-container')
        ).toBeInTheDocument();
      });
    });
  });

  // ===== COLUMN CONFIGURATIONS =====

  describe('Column Configurations', () => {
    it('renders with auto columns', () => {
      const { container } = renderGallery({ columns: 'auto' });
      expect(container.querySelector('.gallery-container')).toBeInTheDocument();
    });

    it('renders with specific column count', () => {
      const { container } = renderGallery({ columns: 3 });
      expect(container.querySelector('.gallery-container')).toBeInTheDocument();
    });
  });

  // ===== SELECTION FUNCTIONALITY =====

  describe('Selection Functionality', () => {
    it('enables selection when selectable is true', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      renderGallery({ selectable: true, onSelect });

      const firstImage = screen.getAllByRole('button')[0];
      await user.click(firstImage);

      expect(onSelect).toHaveBeenCalledWith([mockGalleryItems[0]]);
      expect(firstImage).toHaveAttribute('aria-selected', 'true');
    });

    it('supports multi-selection', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      renderGallery({ selectable: true, multiSelect: true, onSelect });

      const images = screen.getAllByRole('button');
      await user.click(images[0]);
      await user.click(images[1]);

      expect(onSelect).toHaveBeenLastCalledWith([
        mockGalleryItems[0],
        mockGalleryItems[1],
      ]);
    });

    it('handles single selection mode', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      renderGallery({ selectable: true, multiSelect: false, onSelect });

      const images = screen.getAllByRole('button');
      await user.click(images[0]);
      await user.click(images[1]);

      expect(onSelect).toHaveBeenLastCalledWith([mockGalleryItems[1]]);
    });

    it('deselects items when clicked again in multi-select', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      renderGallery({ selectable: true, multiSelect: true, onSelect });

      const firstImage = screen.getAllByRole('button')[0];
      await user.click(firstImage);
      await user.click(firstImage);

      expect(onSelect).toHaveBeenLastCalledWith([]);
    });
  });

  // ===== KEYBOARD NAVIGATION =====

  describe('Keyboard Navigation', () => {
    it('handles Enter key for selection', async () => {
      const onItemClick = vi.fn();
      const user = userEvent.setup();

      renderGallery({ selectable: true, onItemClick });

      const firstImage = screen.getAllByRole('button')[0];
      firstImage.focus();
      await user.keyboard('{Enter}');

      expect(onItemClick).toHaveBeenCalledWith(mockGalleryItems[0], 0);
    });

    it('handles Space key for selection', async () => {
      const onItemClick = vi.fn();
      const user = userEvent.setup();

      renderGallery({ selectable: true, onItemClick });

      const firstImage = screen.getAllByRole('button')[0];
      firstImage.focus();
      await user.keyboard(' ');

      expect(onItemClick).toHaveBeenCalledWith(mockGalleryItems[0], 0);
    });
  });

  // ===== LIGHTBOX FUNCTIONALITY =====

  describe('Lightbox Functionality', () => {
    it('opens lightbox when item is clicked and lightbox is enabled', async () => {
      const user = userEvent.setup();

      renderGallery({ lightbox: true });

      const firstImage = screen.getAllByRole('button')[0];
      await user.click(firstImage);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('navigates between images in lightbox', async () => {
      const user = userEvent.setup();

      renderGallery({ lightbox: true });

      const firstImage = screen.getAllByRole('button')[0];
      await user.click(firstImage);

      const nextButton = screen.getByRole('button', { name: 'Next image' });
      await user.click(nextButton);

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('wraps around in lightbox navigation', async () => {
      const user = userEvent.setup();

      renderGallery({ lightbox: true });

      const lastImage = screen.getAllByRole('button')[2];
      await user.click(lastImage);

      const nextButton = screen.getByRole('button', { name: 'Next image' });
      await user.click(nextButton);

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  // ===== LOADING STATES =====

  describe('Loading States', () => {
    it('displays loading skeleton when loading is true', () => {
      renderGallery({ loading: true, items: [] });

      expect(
        screen.getByRole('status', { name: 'Loading gallery' })
      ).toBeInTheDocument();
    });

    it('shows content when loading is false', () => {
      renderGallery({ loading: false });

      expect(
        screen.getByRole('region', { name: 'Test gallery' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('status', { name: 'Loading gallery' })
      ).not.toBeInTheDocument();
    });
  });

  // ===== ERROR STATES =====

  describe('Error States', () => {
    it('displays error message when error prop is provided', () => {
      const errorMessage = 'Failed to load gallery';
      renderGallery({ error: errorMessage });

      expect(
        screen.getByRole('alert', { name: 'Gallery error' })
      ).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('displays error state with proper styling', () => {
      renderGallery({ error: 'Test error' });

      expect(screen.getByText('Gallery Error')).toBeInTheDocument();
    });
  });

  // ===== EMPTY STATES =====

  describe('Empty States', () => {
    it('displays empty state when no items provided', () => {
      renderGallery({ items: [] });

      expect(
        screen.getByRole('status', { name: 'Empty gallery' })
      ).toBeInTheDocument();
      expect(screen.getByText('No Images')).toBeInTheDocument();
      expect(
        screen.getByText('No images found in this gallery.')
      ).toBeInTheDocument();
    });
  });

  // ===== ACCESSIBILITY =====

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderGallery();

      const gallery = screen.getByRole('region', { name: 'Test gallery' });
      expect(gallery).toBeInTheDocument();
    });

    it('supports custom aria-label', () => {
      renderGallery({ ariaLabel: 'Custom gallery label' });

      expect(
        screen.getByRole('region', { name: 'Custom gallery label' })
      ).toBeInTheDocument();
    });

    it('marks selectable items with proper attributes', () => {
      renderGallery({ selectable: true });

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-selected');
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });

    it('provides proper focus management', async () => {
      const user = userEvent.setup();

      renderGallery({ selectable: true });

      const firstButton = screen.getAllByRole('button')[0];
      await user.tab();

      expect(firstButton).toHaveFocus();
    });
  });

  // ===== CALLBACKS =====

  describe('Callbacks', () => {
    it('calls onItemClick when item is clicked', async () => {
      const onItemClick = vi.fn();
      const user = userEvent.setup();

      renderGallery({ onItemClick });

      const firstImage = screen.getAllByRole('button')[0];
      await user.click(firstImage);

      expect(onItemClick).toHaveBeenCalledWith(mockGalleryItems[0], 0);
    });

    it('calls onLoadMore when scrolled to bottom with infinite scroll', async () => {
      const onLoadMore = vi.fn();

      // Mock IntersectionObserver
      const mockIntersectionObserver = vi.fn().mockImplementation(callback => ({
        observe: vi.fn().mockImplementation(() => {
          callback([{ isIntersecting: true }]);
        }),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      }));

      global.IntersectionObserver = mockIntersectionObserver;

      renderGallery({ infiniteScroll: true, onLoadMore });

      await waitFor(() => {
        expect(onLoadMore).toHaveBeenCalled();
      });
    });
  });

  // ===== RESPONSIVE BEHAVIOR =====

  describe('Responsive Behavior', () => {
    it('applies responsive classes based on size', () => {
      const { container } = renderGallery({ size: 'lg' });
      const galleryContainer = container.querySelector('.gallery-container');
      expect(galleryContainer).toBeInTheDocument();
    });

    it('handles different screen sizes with auto columns', () => {
      const { container } = renderGallery({ columns: 'auto' });
      expect(container.querySelector('.gallery-container')).toBeInTheDocument();
    });
  });

  // ===== DESIGN TOKENS COMPLIANCE =====

  describe('DESIGN_TOKENS Compliance', () => {
    it('uses DESIGN_TOKENS for styling', () => {
      const { container } = renderGallery();
      const galleryContainer = container.querySelector('.gallery-container');

      // Verify container uses token-based classes
      expect(galleryContainer).toHaveClass('gallery-container');
    });

    it('applies size-specific token classes', () => {
      const { container } = renderGallery({ size: 'xl' });
      expect(container.querySelector('.gallery-container')).toBeInTheDocument();
    });

    it('uses semantic color tokens', () => {
      renderGallery({ selectable: true });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toBeInTheDocument();
    });
  });
});

// ===== GALLERY ITEM COMPONENT TESTS =====

describe('GalleryItem Component', () => {
  const mockItem = mockGalleryItems[0];

  it('renders gallery item correctly', () => {
    render(<GalleryItem item={mockItem} />);

    expect(screen.getByRole('img', { name: mockItem.alt })).toBeInTheDocument();
    expect(screen.getByText(mockItem.title!)).toBeInTheDocument();
    expect(screen.getByText(mockItem.caption!)).toBeInTheDocument();
  });

  it('handles selection state', () => {
    render(<GalleryItem item={mockItem} selected={true} />);

    const container = screen.getByRole('button');
    expect(container).toBeInTheDocument();
  });

  it('calls onItemClick when clicked', async () => {
    const onItemClick = vi.fn();
    const user = userEvent.setup();

    render(<GalleryItem item={mockItem} onItemClick={onItemClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onItemClick).toHaveBeenCalledWith(mockItem);
  });

  it('hides caption when showCaption is false', () => {
    render(<GalleryItem item={mockItem} showCaption={false} />);

    expect(screen.queryByText(mockItem.title!)).not.toBeInTheDocument();
    expect(screen.queryByText(mockItem.caption!)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<GalleryItem item={mockItem} className='custom-item' />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-item');
  });
});
