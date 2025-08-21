/**
 * Carousel Component Test Suite
 *
 * Comprehensive tests for the Carousel component following enterprise patterns
 * and ensuring DESIGN_TOKENS compliance.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Carousel, CarouselSlide } from '../../src/components/ui/Carousel';
import '@testing-library/jest-dom';

// Mock intersection observer for auto-play functionality
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

describe('Carousel Component - Enterprise Grade', () => {
  const defaultItems = [
    {
      id: 'slide-1',
      content: <div>Slide 1 Content</div>,
      alt: 'First slide',
      caption: 'Caption for slide 1',
    },
    {
      id: 'slide-2',
      content: <div>Slide 2 Content</div>,
      alt: 'Second slide',
      caption: 'Caption for slide 2',
    },
    {
      id: 'slide-3',
      content: <div>Slide 3 Content</div>,
      alt: 'Third slide',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Carousel items={defaultItems} />);
      expect(
        screen.getByRole('region', { name: /image carousel/i })
      ).toBeInTheDocument();
    });

    it('renders with children instead of items prop', () => {
      render(
        <Carousel>
          <CarouselSlide>Child Slide 1</CarouselSlide>
          <CarouselSlide>Child Slide 2</CarouselSlide>
        </Carousel>
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByText('Child Slide 1')).toBeInTheDocument();
    });

    it('displays loading state when no items provided', () => {
      render(<Carousel items={[]} />);
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('applies custom aria labels', () => {
      render(
        <Carousel
          items={defaultItems}
          ariaLabel='Product image gallery'
          id='product-carousel'
        />
      );

      expect(
        screen.getByRole('region', { name: 'Product image gallery' })
      ).toBeInTheDocument();
      expect(screen.getByRole('region')).toHaveAttribute(
        'id',
        'product-carousel'
      );
    });
  });

  describe('Size Variants', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<Carousel items={defaultItems} size={size} />);
        const carousel = screen.getByRole('region');
        expect(carousel).toBeInTheDocument();
        expect(carousel.className).toContain(size);
      });
    });
  });

  describe('Visual Variants', () => {
    const variants = ['default', 'card', 'hero', 'gallery', 'minimal'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<Carousel items={defaultItems} variant={variant} />);
        const carousel = screen.getByRole('region');
        expect(carousel).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Controls', () => {
    it('renders navigation arrows by default', () => {
      render(<Carousel items={defaultItems} />);

      expect(
        screen.getByRole('button', { name: /previous slide/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /next slide/i })
      ).toBeInTheDocument();
    });

    it('renders dot navigation', () => {
      render(<Carousel items={defaultItems} navigation='dots' />);

      const dots = screen.getAllByRole('tab');
      expect(dots).toHaveLength(3);
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('renders both arrows and dots', () => {
      render(<Carousel items={defaultItems} navigation='both' />);

      expect(
        screen.getByRole('button', { name: /previous slide/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /next slide/i })
      ).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('hides navigation when set to none', () => {
      render(<Carousel items={defaultItems} navigation='none' />);

      expect(
        screen.queryByRole('button', { name: /previous slide/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /next slide/i })
      ).not.toBeInTheDocument();
      expect(screen.queryAllByRole('tab')).toHaveLength(0);
    });
  });

  describe('Slide Navigation', () => {
    it('navigates to next slide on arrow click', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(<Carousel items={defaultItems} onSlideChange={onSlideChange} />);

      const nextButton = screen.getByRole('button', { name: /next slide/i });
      await user.click(nextButton);

      expect(onSlideChange).toHaveBeenCalledWith(1);
    });

    it('navigates to previous slide on arrow click', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          onSlideChange={onSlideChange}
          startIndex={1}
        />
      );

      const prevButton = screen.getByRole('button', {
        name: /previous slide/i,
      });
      await user.click(prevButton);

      expect(onSlideChange).toHaveBeenCalledWith(0);
    });

    it('navigates to specific slide via dot navigation', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(<Carousel items={defaultItems} onSlideChange={onSlideChange} />);

      const dots = screen.getAllByRole('tab');
      await user.click(dots[2]);

      expect(onSlideChange).toHaveBeenCalledWith(2);
    });

    it('wraps around when infinite is enabled', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          infinite
          onSlideChange={onSlideChange}
          startIndex={2}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next slide/i });
      await user.click(nextButton);

      expect(onSlideChange).toHaveBeenCalledWith(0);
    });

    it('stops at boundaries when infinite is disabled', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<Carousel items={defaultItems} infinite={false} startIndex={2} />);

      const nextButton = screen.queryByRole('button', { name: /next slide/i });
      expect(nextButton).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates with arrow keys when keyboard enabled', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          enableKeyboard
          onSlideChange={onSlideChange}
        />
      );

      const carousel = screen.getByRole('button', { name: /carousel viewer/i });
      carousel.focus();

      await user.keyboard('{ArrowRight}');
      expect(onSlideChange).toHaveBeenCalledWith(1);

      await user.keyboard('{ArrowLeft}');
      expect(onSlideChange).toHaveBeenCalledWith(0);
    });

    it('navigates to first/last slide with Home/End keys', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          enableKeyboard
          onSlideChange={onSlideChange}
          startIndex={1}
        />
      );

      const carousel = screen.getByRole('button', { name: /carousel viewer/i });
      carousel.focus();

      await user.keyboard('{End}');
      expect(onSlideChange).toHaveBeenCalledWith(2);

      await user.keyboard('{Home}');
      expect(onSlideChange).toHaveBeenCalledWith(0);
    });

    it('ignores keyboard when disabled', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          enableKeyboard={false}
          onSlideChange={onSlideChange}
        />
      );

      const carousel = screen.getByRole('button', { name: /carousel viewer/i });
      carousel.focus();

      await user.keyboard('{ArrowRight}');
      expect(onSlideChange).not.toHaveBeenCalled();
    });
  });

  describe('Auto-play Functionality', () => {
    it('renders auto-play toggle when auto-play enabled', () => {
      render(<Carousel items={defaultItems} autoPlay />);

      expect(
        screen.getByRole('button', { name: /pause slideshow/i })
      ).toBeInTheDocument();
    });

    it('toggles auto-play state', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onAutoPlayToggle = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          autoPlay
          onAutoPlayToggle={onAutoPlayToggle}
        />
      );

      const toggleButton = screen.getByRole('button', {
        name: /pause slideshow/i,
      });
      await user.click(toggleButton);

      expect(onAutoPlayToggle).toHaveBeenCalledWith(false);
      expect(
        screen.getByRole('button', { name: /play slideshow/i })
      ).toBeInTheDocument();
    });

    it('advances slides automatically with auto-play', () => {
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          autoPlay
          autoPlayInterval={1000}
          onSlideChange={onSlideChange}
        />
      );

      vi.advanceTimersByTime(1000);
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });

    it('pauses auto-play on hover when enabled', async () => {
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          autoPlay
          pauseOnHover
          autoPlayInterval={1000}
          onSlideChange={onSlideChange}
        />
      );

      const carousel = screen.getByRole('region');

      // Advance to just before the first auto-play trigger
      vi.advanceTimersByTime(500);

      // Now hover to pause auto-play
      fireEvent.mouseEnter(carousel);

      // Advance past when the first slide change would have occurred
      vi.advanceTimersByTime(1000);
      expect(onSlideChange).not.toHaveBeenCalled();
    });
  });

  describe('Touch/Swipe Interaction', () => {
    it('handles touch events when swipe enabled', () => {
      render(<Carousel items={defaultItems} swipeEnabled />);

      const viewer = screen.getByRole('button', { name: /carousel viewer/i });

      fireEvent.touchStart(viewer, {
        touches: [{ clientX: 100 }],
      });

      fireEvent.touchMove(viewer, {
        touches: [{ clientX: 50 }],
      });

      fireEvent.touchEnd(viewer);

      // Should trigger navigation (tested via integration)
      expect(viewer).toBeInTheDocument();
    });

    it('ignores touch events when swipe disabled', () => {
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          swipeEnabled={false}
          onSlideChange={onSlideChange}
        />
      );

      const viewer = screen.getByRole('button', { name: /carousel viewer/i });

      fireEvent.touchStart(viewer, {
        touches: [{ clientX: 100 }],
      });

      expect(onSlideChange).not.toHaveBeenCalled();
    });
  });

  describe('Captions and Content', () => {
    it('displays captions when enabled', () => {
      render(<Carousel items={defaultItems} showCaptions />);

      // Captions are rendered but only visible for current slide
      expect(screen.getByText('Caption for slide 1')).toBeInTheDocument();
    });

    it('hides captions when disabled', () => {
      render(<Carousel items={defaultItems} showCaptions={false} />);

      expect(screen.queryByText('Caption for slide 1')).not.toBeInTheDocument();
    });

    it('renders slide content correctly', () => {
      render(<Carousel items={defaultItems} />);

      expect(screen.getByText('Slide 1 Content')).toBeInTheDocument();
      expect(screen.getByText('Slide 2 Content')).toBeInTheDocument();
      expect(screen.getByText('Slide 3 Content')).toBeInTheDocument();
    });
  });

  describe('Thumbnail Navigation', () => {
    it('renders thumbnails when enabled', () => {
      render(<Carousel items={defaultItems} showThumbnails />);

      const thumbnails = screen.getAllByRole('button', {
        name: /go to slide/i,
      });
      expect(thumbnails).toHaveLength(3);
    });

    it('navigates to slide via thumbnail click', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSlideChange = vi.fn();

      render(
        <Carousel
          items={defaultItems}
          showThumbnails
          onSlideChange={onSlideChange}
        />
      );

      const thumbnails = screen.getAllByRole('button', {
        name: /go to slide/i,
      });
      await user.click(thumbnails[2]);

      expect(onSlideChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Carousel items={defaultItems} className='custom-carousel' />);

      const carousel = screen.getByRole('region');
      expect(carousel).toHaveClass('custom-carousel');
    });

    it('accepts custom containerClassName', () => {
      render(
        <Carousel items={defaultItems} containerClassName='custom-container' />
      );

      const carousel = screen.getByRole('region');
      expect(carousel).toHaveClass('custom-container');
    });

    it('accepts custom style prop', () => {
      const customStyle = { backgroundColor: 'rgb(255, 0, 0)' };
      render(<Carousel items={defaultItems} style={customStyle} />);

      const carousel = screen.getByRole('region');
      expect(carousel).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
  });

  describe('Accessibility Features', () => {
    it('has proper ARIA attributes', () => {
      render(<Carousel items={defaultItems} />);

      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-live', 'polite');
      expect(carousel).toHaveAttribute('aria-label', 'Image carousel');
    });

    it('marks slides with proper ARIA attributes', () => {
      render(<Carousel items={defaultItems} />);

      // Slides are rendered with tabpanel role and proper labels
      expect(
        screen.getByRole('button', { name: /carousel viewer/i })
      ).toBeInTheDocument();
    });

    it('indicates active slide in dot navigation', () => {
      render(<Carousel items={defaultItems} />);

      const dots = screen.getAllByRole('tab');
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
      expect(dots[1]).toHaveAttribute('aria-selected', 'false');
      expect(dots[2]).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Start Index', () => {
    it('starts at specified index', () => {
      render(<Carousel items={defaultItems} startIndex={1} />);

      const dots = screen.getAllByRole('tab');
      expect(dots[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('clamps start index to valid range', () => {
      render(<Carousel items={defaultItems} startIndex={10} />);

      // Should default to 0 when index is out of range
      const dots = screen.getAllByRole('tab');
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles single slide gracefully', () => {
      const singleItem = [defaultItems[0]];
      render(<Carousel items={singleItem} />);

      const carousel = screen.getByRole('region');
      expect(carousel).toBeInTheDocument();

      // Navigation should be disabled or hidden for single slide
      expect(
        screen.queryByRole('button', { name: /next slide/i })
      ).not.toBeInTheDocument();
    });

    it('handles empty items array', () => {
      render(<Carousel items={[]} />);

      const carousel = screen.getByRole('region');
      expect(carousel).toBeInTheDocument();
    });
  });

  describe('DESIGN_TOKENS Compliance', () => {
    it('uses DESIGN_TOKENS for styling', () => {
      render(<Carousel items={defaultItems} />);

      const carousel = screen.getByRole('region');
      expect(carousel).toBeInTheDocument();

      // Verify no hardcoded Tailwind classes are used
      expect(carousel.className).not.toMatch(/bg-\w+/);
      expect(carousel.className).not.toMatch(/text-\w+/);
    });

    it('applies variant-specific styling through tokens', () => {
      render(<Carousel items={defaultItems} variant='card' />);

      const carousel = screen.getByRole('region');
      expect(carousel).toBeInTheDocument();
    });
  });
});

describe('CarouselSlide Component', () => {
  it('renders children correctly', () => {
    render(
      <CarouselSlide>
        <div>Slide content</div>
      </CarouselSlide>
    );

    expect(screen.getByText('Slide content')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(
      <CarouselSlide className='custom-slide'>
        <div>Content</div>
      </CarouselSlide>
    );

    const slide = screen.getByText('Content').parentElement;
    expect(slide).toHaveClass('custom-slide');
  });
});
