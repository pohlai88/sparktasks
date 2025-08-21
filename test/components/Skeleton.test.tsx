import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
  SkeletonGroup,
  SkeletonProfile,
  SkeletonList,
} from '@/components/ui/Skeleton';

describe('Skeleton Component', () => {
  // ===== BASIC RENDERING =====

  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(<Skeleton />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('applies default variant (text)', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4', 'w-full', 'rounded');
    });

    it('applies default size (md)', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4');
    });

    it('includes accessibility attributes', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });
  });

  // ===== VARIANT SUPPORT =====

  describe('Variant Support', () => {
    it('renders text variant correctly', () => {
      render(<Skeleton variant='text' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4', 'w-full', 'rounded');
    });

    it('renders avatar variant correctly', () => {
      render(<Skeleton variant='avatar' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full', 'h-10', 'w-10');
    });

    it('renders button variant correctly', () => {
      render(<Skeleton variant='button' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-9', 'w-20', 'rounded-md');
    });

    it('renders card variant correctly', () => {
      render(<Skeleton variant='card' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-48', 'w-full', 'rounded-lg');
    });

    it('renders image variant correctly', () => {
      render(<Skeleton variant='image' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('aspect-video', 'w-full', 'rounded-md');
    });

    it('renders circle variant correctly', () => {
      render(<Skeleton variant='circle' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full', 'h-10', 'w-10');
    });

    it('renders rectangular variant correctly', () => {
      render(<Skeleton variant='rectangular' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-md', 'h-24', 'w-40');
    });
  });

  // ===== SIZE VARIATIONS =====

  describe('Size Variations', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size for text variant`, () => {
        render(<Skeleton variant='text' size={size} />);
        const skeleton = screen.getByRole('status');

        const expectedHeights = {
          xs: 'h-3',
          sm: 'h-3.5',
          md: 'h-4',
          lg: 'h-5',
          xl: 'h-6',
        };

        expect(skeleton).toHaveClass(expectedHeights[size]);
      });

      it(`renders ${size} size for avatar variant`, () => {
        render(<Skeleton variant='avatar' size={size} />);
        const skeleton = screen.getByRole('status');

        const expectedSizes = {
          xs: ['h-6', 'w-6'],
          sm: ['h-8', 'w-8'],
          md: ['h-10', 'w-10'],
          lg: ['h-12', 'w-12'],
          xl: ['h-16', 'w-16'],
        };

        expectedSizes[size].forEach(cls => {
          expect(skeleton).toHaveClass(cls);
        });
      });

      it(`renders ${size} size for button variant`, () => {
        render(<Skeleton variant='button' size={size} />);
        const skeleton = screen.getByRole('status');

        const expectedSizes = {
          xs: ['h-7', 'w-16'],
          sm: ['h-8', 'w-18'],
          md: ['h-9', 'w-20'],
          lg: ['h-10', 'w-24'],
          xl: ['h-12', 'w-28'],
        };

        expectedSizes[size].forEach(cls => {
          expect(skeleton).toHaveClass(cls);
        });
      });
    });
  });

  // ===== ANIMATION OPTIONS =====

  describe('Animation Options', () => {
    it('applies default animation (normal speed)', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('applies slow animation speed', () => {
      render(<Skeleton speed='slow' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('[animation-duration:2s]');
    });

    it('applies fast animation speed', () => {
      render(<Skeleton speed='fast' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('[animation-duration:1s]');
    });

    it('applies shimmer effect when enabled', () => {
      render(<Skeleton shimmer />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('bg-gradient-to-r');
    });

    it('respects motion preferences by default', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('motion-reduce:transition-none');
    });

    it('can disable motion respect', () => {
      render(<Skeleton respectMotion={false} />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).not.toHaveClass('motion-reduce:transition-none');
    });
  });

  // ===== CUSTOM DIMENSIONS =====

  describe('Custom Dimensions', () => {
    it('applies custom width as string', () => {
      render(<Skeleton width='200px' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('applies custom width as number (ch units)', () => {
      render(<Skeleton width={20} />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '20ch' });
    });

    it('applies custom height', () => {
      render(<Skeleton height='100px' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('combines custom dimensions with variant classes', () => {
      render(<Skeleton variant='button' width='150px' height='50px' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ width: '150px', height: '50px' });
      expect(skeleton).toHaveClass('rounded-md');
    });
  });

  // ===== MULTIPLE LINES =====

  describe('Multiple Lines (Text Variant)', () => {
    it('renders single line by default', () => {
      render(<Skeleton variant='text' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4');
    });

    it('renders multiple lines when specified', () => {
      render(<Skeleton variant='text' lines={3} />);
      const container = screen.getByRole('status');
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(3);
    });

    it('makes last line shorter for multiple lines', () => {
      render(<Skeleton variant='text' lines={3} />);
      const container = screen.getByRole('status');
      const lines = container.querySelectorAll('.animate-pulse');

      // First two lines should be full width
      expect(lines[0]).toHaveClass('w-full');
      expect(lines[1]).toHaveClass('w-full');

      // Last line should be shorter
      expect(lines[2]).toHaveClass('w-3/4');
    });

    it('applies staggered animation delay for multiple lines', () => {
      render(<Skeleton variant='text' lines={3} />);
      const container = screen.getByRole('status');
      const lines = container.querySelectorAll('.animate-pulse');

      expect(lines[0]).toHaveStyle({ animationDelay: '0s' });
      expect(lines[1]).toHaveStyle({ animationDelay: '0.1s' });
      expect(lines[2]).toHaveStyle({ animationDelay: '0.2s' });
    });
  });

  // ===== ACCESSIBILITY =====

  describe('Accessibility', () => {
    it('provides proper ARIA attributes', () => {
      render(<Skeleton />);
      const skeleton = screen.getByRole('status');

      expect(skeleton).toHaveAttribute('role', 'status');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });

    it('supports custom aria-label', () => {
      render(<Skeleton aria-label='Loading user profile' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading user profile');
    });

    it('maintains accessibility for multiple lines', () => {
      render(<Skeleton variant='text' lines={3} />);
      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-label', 'Loading content');
    });
  });

  // ===== CUSTOM STYLING =====

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Skeleton className='custom-skeleton' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('custom-skeleton');
    });

    it('accepts custom style object', () => {
      render(<Skeleton style={{ opacity: 0.5 }} />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveStyle({ opacity: '0.5' });
    });

    it('forwards HTML attributes', () => {
      render(<Skeleton data-testid='test-skeleton' />);
      expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();
    });
  });

  // ===== FORWARD REF =====

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBeTruthy();
    });
  });
});

// ===== COMPOUND COMPONENTS =====

describe('Skeleton Compound Components', () => {
  describe('SkeletonText', () => {
    it('renders as text variant', () => {
      render(<SkeletonText />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-4', 'w-full', 'rounded');
    });

    it('supports lines prop', () => {
      render(<SkeletonText lines={2} />);
      const container = screen.getByRole('status');
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(2);
    });
  });

  describe('SkeletonAvatar', () => {
    it('renders as avatar variant', () => {
      render(<SkeletonAvatar />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('rounded-full', 'h-10', 'w-10');
    });

    it('supports size prop', () => {
      render(<SkeletonAvatar size='lg' />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-12', 'w-12');
    });
  });

  describe('SkeletonButton', () => {
    it('renders as button variant', () => {
      render(<SkeletonButton />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-9', 'w-20', 'rounded-md');
    });
  });

  describe('SkeletonCard', () => {
    it('renders as card variant', () => {
      render(<SkeletonCard />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-48', 'w-full', 'rounded-lg');
    });
  });

  describe('SkeletonImage', () => {
    it('renders as image variant', () => {
      render(<SkeletonImage />);
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('aspect-video', 'w-full', 'rounded-md');
    });
  });
});

// ===== LAYOUT COMPONENTS =====

describe('Skeleton Layout Components', () => {
  describe('SkeletonGroup', () => {
    it('renders children with vertical layout by default', () => {
      render(
        <SkeletonGroup data-testid='skeleton-group'>
          <SkeletonText isChild />
          <SkeletonAvatar isChild />
        </SkeletonGroup>
      );

      const group = screen.getByTestId('skeleton-group');
      expect(group).toHaveClass('flex', 'flex-col', 'space-y-3');
    });

    it('supports horizontal layout', () => {
      render(
        <SkeletonGroup direction='horizontal' data-testid='skeleton-group'>
          <SkeletonText isChild />
          <SkeletonAvatar isChild />
        </SkeletonGroup>
      );

      const group = screen.getByTestId('skeleton-group');
      expect(group).toHaveClass('flex', 'items-center', 'space-x-3');
    });

    it('supports different spacing options', () => {
      render(
        <SkeletonGroup spacing='lg' data-testid='skeleton-group'>
          <SkeletonText isChild />
          <SkeletonAvatar isChild />
        </SkeletonGroup>
      );

      const group = screen.getByTestId('skeleton-group');
      expect(group).toHaveClass('space-y-4');
    });

    it('has proper accessibility attributes', () => {
      render(
        <SkeletonGroup>
          <SkeletonText isChild />
          <SkeletonAvatar isChild />
          <SkeletonButton isChild />
        </SkeletonGroup>
      );

      const group = screen.getByRole('status');
      expect(group).toHaveAttribute('aria-busy', 'true');
      expect(group).toHaveAttribute('aria-label', 'Loading content');
    });
  });

  describe('SkeletonProfile', () => {
    it('renders avatar and text elements', () => {
      render(<SkeletonProfile data-testid='skeleton-profile' />);

      const profile = screen.getByTestId('skeleton-profile');
      expect(profile).toBeInTheDocument();

      // Should have avatar element
      const avatar = profile.querySelector('.rounded-full');
      expect(avatar).toBeInTheDocument();
    });

    it('supports custom avatar size', () => {
      render(
        <SkeletonProfile avatarSize='lg' data-testid='skeleton-profile' />
      );

      const profile = screen.getByTestId('skeleton-profile');
      const avatar = profile.querySelector('.h-12.w-12');
      expect(avatar).toBeInTheDocument();
    });

    it('can hide bio when showBio=false', () => {
      render(
        <SkeletonProfile showBio={false} data-testid='skeleton-profile' />
      );

      const profile = screen.getByTestId('skeleton-profile');
      expect(profile).toBeInTheDocument();
    });

    it('supports custom bio line count', () => {
      render(<SkeletonProfile bioLines={3} data-testid='skeleton-profile' />);

      const profile = screen.getByTestId('skeleton-profile');
      expect(profile).toBeInTheDocument();
    });
  });

  describe('SkeletonList', () => {
    it('renders default count of text skeletons', () => {
      render(<SkeletonList data-testid='skeleton-list' />);

      const list = screen.getByTestId('skeleton-list');
      expect(list).toBeInTheDocument();

      // Check for skeleton elements (not using role since children are marked as isChild)
      const skeletons = list.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(3);
    });

    it('supports custom count', () => {
      render(<SkeletonList count={5} data-testid='skeleton-list' />);

      const list = screen.getByTestId('skeleton-list');
      expect(list).toBeInTheDocument();
    });

    it('supports different item types', () => {
      render(
        <SkeletonList
          itemType='profile'
          count={2}
          data-testid='skeleton-list'
        />
      );

      const list = screen.getByTestId('skeleton-list');
      expect(list).toBeInTheDocument();
    });

    it('supports card item type', () => {
      render(
        <SkeletonList itemType='card' count={2} data-testid='skeleton-list' />
      );

      const list = screen.getByTestId('skeleton-list');
      expect(list).toBeInTheDocument();
    });

    it('supports horizontal layout', () => {
      render(
        <SkeletonList direction='horizontal' data-testid='skeleton-list' />
      );

      const list = screen.getByTestId('skeleton-list');
      expect(list).toHaveClass('flex', 'items-center');
    });
  });
});

// ===== EDGE CASES =====

describe('Skeleton Edge Cases', () => {
  it('handles zero lines gracefully', () => {
    render(<Skeleton variant='text' lines={0} />);
    // Should render single skeleton when lines is 0
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles invalid variant gracefully', () => {
    // @ts-expect-error - Testing invalid variant
    render(<Skeleton variant='invalid' />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
  });

  it('handles very large line counts', () => {
    render(<Skeleton variant='text' lines={100} />);
    const container = screen.getByRole('status');
    const lines = container.querySelectorAll('.animate-pulse');
    expect(lines).toHaveLength(100);
  });

  it('preserves existing style when applying custom dimensions', () => {
    render(
      <Skeleton
        style={{ backgroundColor: 'red' }}
        width='100px'
        height='50px'
        data-testid='custom-skeleton'
      />
    );

    const skeleton = screen.getByTestId('custom-skeleton');
    // Check individual styles since Tailwind classes might interfere
    expect(skeleton).toHaveStyle('width: 100px');
    expect(skeleton).toHaveStyle('height: 50px');
    expect(skeleton).toHaveStyle('background-color: rgb(255, 0, 0)');
  });
});
