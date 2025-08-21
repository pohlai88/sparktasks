import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AvatarGroup } from '@/components/ui/AvatarGroup';
import { DESIGN_TOKENS } from '@/design/tokens';

describe('AvatarGroup - Optimized Enterprise Component', () => {
  const mockAvatars = [
    { src: 'a.png', alt: 'Alice Avatar', fallback: 'A', key: 'alice' },
    { src: 'b.png', alt: 'Bob Avatar', fallback: 'B', key: 'bob' },
    { src: 'c.png', alt: 'Carol Avatar', fallback: 'C', key: 'carol' },
    { src: 'd.png', alt: 'David Avatar', fallback: 'D', key: 'david' },
    { src: 'e.png', alt: 'Eve Avatar', fallback: 'E', key: 'eve' },
    { src: 'f.png', alt: 'Frank Avatar', fallback: 'F', key: 'frank' },
    { src: 'g.png', alt: 'Grace Avatar', fallback: 'G', key: 'grace' },
  ];

  describe('Basic Functionality', () => {
    it('renders all avatars when count is within max limit', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} max={5} />);

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(3);
      expect(
        screen.queryByTestId('avatar-group-overflow')
      ).not.toBeInTheDocument();
    });

    it('renders visible avatars and overflow pill when exceeding max', () => {
      render(<AvatarGroup avatars={mockAvatars} max={3} />);

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(3);
      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '+4'
      );
    });

    it('applies default max value of 5', () => {
      render(<AvatarGroup avatars={mockAvatars} />);

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(5);
      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '+2'
      );
    });

    it('handles empty avatars array gracefully', () => {
      render(<AvatarGroup avatars={[]} />);

      expect(screen.queryByTestId('avatar-container')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('avatar-group-overflow')
      ).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`applies ${size} size to all avatars and overflow pill`, () => {
        render(<AvatarGroup avatars={mockAvatars} max={2} size={size} />);

        const containers = screen.getAllByTestId('avatar-container');
        containers.forEach(container => {
          expect(container).toHaveAttribute('data-size', size);
        });

        const overflowPill = screen.getByTestId('avatar-group-overflow');
        expect(overflowPill.className).toContain(
          DESIGN_TOKENS.sizing.avatar[size]
        );
      });
    });
  });

  describe('Layout Modes', () => {
    it('applies overlap layout with negative spacing by default', () => {
      render(<AvatarGroup avatars={mockAvatars} />);

      const group = screen.getByTestId('avatar-group');
      expect(group.className).toContain('-space-x-3');
    });

    it('applies spaced layout when overlap is false', () => {
      render(<AvatarGroup avatars={mockAvatars} overlap={false} />);

      const group = screen.getByTestId('avatar-group');
      expect(group.className).toContain('space-x-2');
    });

    it('applies z-index stacking for overlapped avatars', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} overlap={true} />);

      const avatarWrappers = screen
        .getAllByTestId('avatar-container')
        .map(el => el.parentElement);

      // Check z-index increases from first to last (natural stacking)
      expect(avatarWrappers[0]).toHaveStyle('z-index: 1');
      expect(avatarWrappers[1]).toHaveStyle('z-index: 2');
      expect(avatarWrappers[2]).toHaveStyle('z-index: 3');
    });

    it('does not apply z-index for spaced layout', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} overlap={false} />);

      const avatarWrappers = screen
        .getAllByTestId('avatar-container')
        .map(el => el.parentElement);
      avatarWrappers.forEach(wrapper => {
        expect(wrapper).not.toHaveStyle('z-index: 1');
      });
    });
  });

  describe('Accessibility', () => {
    it('provides comprehensive aria-label with counts', () => {
      render(
        <AvatarGroup avatars={mockAvatars} max={3} ariaLabel='Team members' />
      );

      const group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute(
        'aria-label',
        'Team members, showing 3 of 7 avatars'
      );
      expect(group).toHaveAttribute('role', 'group');
    });

    it('provides simple aria-label when no overflow', () => {
      render(
        <AvatarGroup
          avatars={mockAvatars.slice(0, 3)}
          ariaLabel='Team members'
        />
      );

      const group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute('aria-label', 'Team members, 3 avatars');
    });

    it('sets data-overlap attribute correctly', () => {
      const { rerender } = render(
        <AvatarGroup avatars={mockAvatars.slice(0, 3)} overlap={true} />
      );

      let group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute('data-overlap', 'true');

      rerender(
        <AvatarGroup avatars={mockAvatars.slice(0, 3)} overlap={false} />
      );
      group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute('data-overlap', 'false');
    });

    it('defaults aria-label when not provided', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} />);

      const group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute('aria-label', 'Avatar group, 3 avatars');
    });

    it('makes overflow pill keyboard accessible when interactive', () => {
      const onOverflowClick = vi.fn();
      render(
        <AvatarGroup
          avatars={mockAvatars}
          max={2}
          onOverflowClick={onOverflowClick}
        />
      );

      const overflowPill = screen.getByTestId('avatar-group-overflow');
      expect(overflowPill).toHaveAttribute('role', 'button');
      expect(overflowPill).toHaveAttribute('tabIndex', '0');
      expect(overflowPill).toHaveAttribute('aria-label', '5 more avatars');
    });

    it('renders overflow pill as non-interactive when no click handler', () => {
      render(<AvatarGroup avatars={mockAvatars} max={2} />);

      const overflowPill = screen.getByTestId('avatar-group-overflow');
      expect(overflowPill).not.toHaveAttribute('role', 'button');
      expect(overflowPill).not.toHaveAttribute('tabIndex');
      expect(overflowPill).toHaveAttribute('aria-label', '5 more avatars');
    });

    it('handles keyboard events on interactive overflow pill', () => {
      const onOverflowClick = vi.fn();
      render(
        <AvatarGroup
          avatars={mockAvatars}
          max={2}
          onOverflowClick={onOverflowClick}
        />
      );

      const overflowPill = screen.getByTestId('avatar-group-overflow');

      // Test Enter key
      fireEvent.keyDown(overflowPill, { key: 'Enter' });
      expect(onOverflowClick).toHaveBeenCalledWith(5, expect.any(Object));

      onOverflowClick.mockClear();

      // Test Space key
      fireEvent.keyDown(overflowPill, { key: ' ' });
      expect(onOverflowClick).toHaveBeenCalledWith(5, expect.any(Object));
    });

    it('handles click events on interactive overflow pill', () => {
      const onOverflowClick = vi.fn();
      render(
        <AvatarGroup
          avatars={mockAvatars}
          max={2}
          onOverflowClick={onOverflowClick}
        />
      );

      const overflowPill = screen.getByTestId('avatar-group-overflow');

      fireEvent.click(overflowPill);
      expect(onOverflowClick).toHaveBeenCalledWith(5, expect.any(Object));
    });

    it('does not handle events on non-interactive overflow pill', () => {
      render(<AvatarGroup avatars={mockAvatars} max={2} />);

      const overflowPill = screen.getByTestId('avatar-group-overflow');

      // Test keyboard events - should not throw errors
      fireEvent.keyDown(overflowPill, { key: 'Enter' });
      fireEvent.keyDown(overflowPill, { key: ' ' });
      expect(overflowPill).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('provides comprehensive data attributes for testing and debugging', () => {
      render(<AvatarGroup avatars={mockAvatars} max={3} />);

      const group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute('data-count', '7');
      expect(group).toHaveAttribute('data-visible', '3');
      expect(group).toHaveAttribute('data-overflow', '4');
    });

    it('provides avatar index data attributes', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} />);

      const avatarWrappers = screen
        .getAllByTestId('avatar-container')
        .map(el => el.parentElement);
      avatarWrappers.forEach((wrapper, index) => {
        expect(wrapper).toHaveAttribute('data-avatar-index', index.toString());
      });
    });

    it('provides overflow count data attribute', () => {
      render(<AvatarGroup avatars={mockAvatars} max={3} />);

      const overflowPill = screen.getByTestId('avatar-group-overflow');
      expect(overflowPill).toHaveAttribute('data-overflow-count', '4');
    });
  });

  describe('Custom Overflow Content', () => {
    it('uses custom overflow content when provided', () => {
      const customOverflowContent = vi.fn(
        (count: number, _max: number) => `${count} more users`
      );

      render(
        <AvatarGroup
          avatars={mockAvatars}
          max={3}
          overflowContent={customOverflowContent}
        />
      );

      expect(customOverflowContent).toHaveBeenCalledWith(4, 99);
      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '4 more users'
      );
    });

    it('handles large overflow numbers with overflowMax', () => {
      const largeAvatars = Array.from({ length: 150 }, (_, i) => ({
        src: `user${i}.png`,
        alt: `User ${i}`,
        fallback: `U${i}`,
      }));

      render(<AvatarGroup avatars={largeAvatars} max={3} overflowMax={99} />);

      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '99+'
      );
    });

    it('shows exact count when below overflowMax', () => {
      render(<AvatarGroup avatars={mockAvatars} max={3} overflowMax={10} />);

      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '+4'
      );
    });
  });

  describe('Prop Forwarding', () => {
    it('forwards container props correctly', () => {
      const customProps = {
        'data-custom': 'test-value',
        onClick: vi.fn(),
      };

      render(
        <AvatarGroup avatars={mockAvatars.slice(0, 3)} {...customProps} />
      );

      const group = screen.getByTestId('avatar-group');
      expect(group).toHaveAttribute('data-custom', 'test-value');

      fireEvent.click(group);
      expect(customProps.onClick).toHaveBeenCalled();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-testid', 'avatar-group');
    });

    it('applies custom className to container', () => {
      const customClass = 'custom-avatar-group';

      render(
        <AvatarGroup
          avatars={mockAvatars.slice(0, 3)}
          className={customClass}
        />
      );

      const group = screen.getByTestId('avatar-group');
      expect(group).toHaveClass(customClass);
    });
  });

  describe('Avatar Props Forwarding', () => {
    it('forwards individual avatar props correctly', () => {
      const avatarsWithProps = [
        {
          src: 'a.png',
          alt: 'Alice',
          className: 'custom-avatar-1',
          status: 'online' as const,
        },
        {
          src: 'b.png',
          alt: 'Bob',
          className: 'custom-avatar-2',
          status: 'busy' as const,
        },
      ];

      render(<AvatarGroup avatars={avatarsWithProps} />);

      const containers = screen.getAllByTestId('avatar-container');
      expect(containers[0]).toHaveAttribute('data-status', 'online');
      expect(containers[1]).toHaveAttribute('data-status', 'busy');
    });

    it('uses custom keys when provided', () => {
      const avatarsWithKeys = [
        { src: 'a.png', alt: 'Alice', key: 'alice-key' },
        { src: 'b.png', alt: 'Bob', key: 'bob-key' },
      ];

      render(<AvatarGroup avatars={avatarsWithKeys} />);

      // Keys are used internally by React, verify by checking structure
      expect(screen.getAllByTestId('avatar-container')).toHaveLength(2);
    });
  });

  describe('Performance Optimizations', () => {
    it('maintains stable references across re-renders with same props', () => {
      const { rerender } = render(
        <AvatarGroup avatars={mockAvatars} max={3} size='lg' overlap={true} />
      );

      const group1 = screen.getByTestId('avatar-group');
      const overflow1 = screen.getByTestId('avatar-group-overflow');

      // Re-render with same props
      rerender(
        <AvatarGroup avatars={mockAvatars} max={3} size='lg' overlap={true} />
      );

      const group2 = screen.getByTestId('avatar-group');
      const overflow2 = screen.getByTestId('avatar-group-overflow');

      // Elements should be the same (React reconciliation)
      expect(group1).toBe(group2);
      expect(overflow1).toBe(overflow2);
    });

    it('updates efficiently when avatars change', () => {
      const { rerender } = render(
        <AvatarGroup avatars={mockAvatars.slice(0, 3)} />
      );

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(3);
      expect(
        screen.queryByTestId('avatar-group-overflow')
      ).not.toBeInTheDocument();

      rerender(<AvatarGroup avatars={mockAvatars} max={3} />);

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(3);
      expect(screen.getByTestId('avatar-group-overflow')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero max gracefully', () => {
      render(<AvatarGroup avatars={mockAvatars} max={0} />);

      expect(screen.queryByTestId('avatar-container')).not.toBeInTheDocument();
      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '+7'
      );
    });

    it('handles negative max gracefully', () => {
      render(<AvatarGroup avatars={mockAvatars} max={-5} />);

      expect(screen.queryByTestId('avatar-container')).not.toBeInTheDocument();
      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '+7'
      );
    });

    it('handles single avatar correctly', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 1)} />);

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(1);
      expect(
        screen.queryByTestId('avatar-group-overflow')
      ).not.toBeInTheDocument();
    });

    it('handles very large avatar arrays efficiently', () => {
      const manyAvatars = Array.from({ length: 1000 }, (_, i) => ({
        src: `user${i}.png`,
        alt: `User ${i}`,
        fallback: `U${i}`,
      }));

      render(<AvatarGroup avatars={manyAvatars} max={5} />);

      expect(screen.getAllByTestId('avatar-container')).toHaveLength(5);
      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent(
        '99+'
      );
    });
  });

  describe('Visual Enhancements', () => {
    it('applies ring styling for overlapped avatars', () => {
      render(<AvatarGroup avatars={mockAvatars.slice(0, 3)} overlap={true} />);

      const avatars = screen.getAllByTestId('avatar-container');

      // Check that avatar containers have ring classes from the component
      avatars.forEach(avatar => {
        expect(avatar.className).toContain('ring-2');
      });
    });

    it('applies transition styles to overflow pill', () => {
      render(<AvatarGroup avatars={mockAvatars} max={2} />);

      const overflowPill = screen.getByTestId('avatar-group-overflow');
      expect(overflowPill.className).toContain('transition');
      expect(overflowPill.className).toContain('shadow-md');
    });
  });
});
