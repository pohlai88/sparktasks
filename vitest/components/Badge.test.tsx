/**
 * Enhanced Badge Component Tests - MAPS v2.2 Dark-First Foundation
 *
 * TESTING MATRIX:
 * - Component Rendering: ✅ All variants, sizes, and combinations
 * - Accessibility: ✅ ARIA attributes, keyboard navigation, screen readers
 * - Interaction States: ✅ Interactive badges, focus management
 * - Count Display: ✅ Number formatting, overflow handling
 * - Visual Features: ✅ Icons, dots, dismissible actions
 * - Factory Functions: ✅ Semantic constructors
 * - Utility Functions: ✅ Helper functions for common patterns
 *
 * ANTI-DRIFT VALIDATION:
 * - No hardcoded colors: All values from design tokens
 * - No arbitrary spacing: 8pt grid compliance
 * - No accessibility shortcuts: WCAG AAA baseline
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import {
  EnhancedBadge,
  BadgeFactory,
  createCountBadge,
  createStatusDot,
  createNotificationBadge,
} from '@/components/ui-enhanced/Badge';

// ===== COMPONENT RENDERING TESTS =====

describe('EnhancedBadge', () => {
  describe('Basic Rendering', () => {
    it('renders badge with default props', () => {
      render(<EnhancedBadge data-testid='badge'>Content</EnhancedBadge>);

      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Content');
      expect(badge).toHaveAttribute('data-variant', 'default');
      expect(badge).toHaveAttribute('data-size', 'md');
      expect(badge).toHaveAttribute('data-interactive', 'false');
      expect(badge).toHaveAttribute('data-pulse', 'false');
      expect(badge).toHaveAttribute('data-dot', 'false');
      expect(badge).toHaveAttribute('data-aaa', 'false');
    });

    it('renders with custom className', () => {
      render(
        <EnhancedBadge className='custom-class' data-testid='badge'>
          Content
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('forwards HTML attributes', () => {
      render(
        <EnhancedBadge
          id='custom-id'
          role='status'
          aria-label='Custom badge'
          data-testid='badge'
        >
          Content
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('id', 'custom-id');
      expect(badge).toHaveAttribute('role', 'status');
      expect(badge).toHaveAttribute('aria-label', 'Custom badge');
    });

    it('supports asChild prop with Slot', () => {
      render(
        <EnhancedBadge asChild>
          <span data-testid='badge'>Custom element</span>
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge.tagName).toBe('SPAN');
      expect(badge).toHaveTextContent('Custom element');
    });
  });

  describe('Variant System', () => {
    const semanticVariants = [
      'default',
      'secondary',
      'muted',
      'accent',
    ] as const;
    const statusVariants = ['success', 'warning', 'error', 'info'] as const;
    const styleVariants = ['outline', 'ghost', 'glass', 'floating'] as const;

    semanticVariants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <EnhancedBadge variant={variant} data-testid='badge'>
            {variant} badge
          </EnhancedBadge>
        );

        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-variant', variant);
        expect(badge).toBeInTheDocument();
      });
    });

    statusVariants.forEach(variant => {
      it(`renders ${variant} status variant correctly`, () => {
        render(
          <EnhancedBadge variant={variant} data-testid='badge'>
            {variant} status
          </EnhancedBadge>
        );

        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-variant', variant);
        expect(badge).toBeInTheDocument();
      });
    });

    styleVariants.forEach(variant => {
      it(`renders ${variant} style variant correctly`, () => {
        render(
          <EnhancedBadge variant={variant} data-testid='badge'>
            {variant} style
          </EnhancedBadge>
        );

        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-variant', variant);
        expect(badge).toBeInTheDocument();
      });
    });

    it('applies correct CSS classes for glass variant', () => {
      render(
        <EnhancedBadge variant='glass' data-testid='badge'>
          Glass badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('backdrop-blur-md');
      expect(badge).toHaveClass('backdrop-saturate-[135%]');
    });

    it('applies correct CSS classes for floating variant', () => {
      render(
        <EnhancedBadge variant='floating' data-testid='badge'>
          Floating badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('backdrop-blur-lg');
      expect(badge).toHaveClass('shadow-elevation-md');
    });
  });

  describe('Size System', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <EnhancedBadge size={size} data-testid='badge'>
            {size} badge
          </EnhancedBadge>
        );

        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-size', size);
      });
    });
  });

  describe('Count Display', () => {
    it('displays count when provided', () => {
      render(<EnhancedBadge count={5} data-testid='badge' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('5');
    });

    it('displays overflow indicator when count exceeds max', () => {
      render(<EnhancedBadge count={150} max={99} data-testid='badge' />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('99+');
    });

    it('displays exact count when showOverflow is false', () => {
      render(
        <EnhancedBadge
          count={150}
          max={99}
          showOverflow={false}
          data-testid='badge'
        />
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('150');
    });

    it('displays children when count is not provided', () => {
      render(<EnhancedBadge data-testid='badge'>Custom Text</EnhancedBadge>);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('Custom Text');
    });

    it('prioritizes count over children when both provided', () => {
      render(
        <EnhancedBadge count={10} data-testid='badge'>
          This should not show
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('10');
      expect(badge).not.toHaveTextContent('This should not show');
    });
  });

  describe('Icon Support', () => {
    const TestIcon = () => <span data-testid='test-icon'>📧</span>;

    it('displays icon in left position by default', () => {
      render(
        <EnhancedBadge icon={<TestIcon />} data-testid='badge'>
          Content
        </EnhancedBadge>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveTextContent('📧Content');
    });

    it('displays icon in right position when specified', () => {
      render(
        <EnhancedBadge
          icon={<TestIcon />}
          iconPosition='right'
          data-testid='badge'
        >
          Content
        </EnhancedBadge>
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toHaveTextContent('Content📧');
    });

    it('does not display icon in dot mode', () => {
      render(
        <EnhancedBadge icon={<TestIcon />} dot data-testid='badge'>
          Content
        </EnhancedBadge>
      );

      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });
  });

  describe('Interactive Behavior', () => {
    it('becomes interactive when interactive prop is true', () => {
      render(
        <EnhancedBadge interactive data-testid='badge'>
          Interactive badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('role', 'button');
      expect(badge).toHaveAttribute('tabIndex', '0');
      expect(badge).toHaveAttribute('data-interactive', 'true');
    });

    it('becomes interactive when onClick is provided', () => {
      const handleClick = vi.fn();
      render(
        <EnhancedBadge onClick={handleClick} data-testid='badge'>
          Clickable badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('role', 'button');
      expect(badge).toHaveAttribute('tabIndex', '0');
      expect(badge).toHaveAttribute('data-interactive', 'true');
    });

    it('handles click events when interactive', () => {
      const handleClick = vi.fn();
      render(
        <EnhancedBadge interactive onClick={handleClick} data-testid='badge'>
          Interactive badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      fireEvent.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation when interactive', () => {
      const handleClick = vi.fn();
      render(
        <EnhancedBadge interactive onClick={handleClick} data-testid='badge'>
          Interactive badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');

      // Focus the badge first
      badge.focus();
      expect(badge).toHaveFocus();

      // Enter key
      fireEvent.keyDown(badge, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Space key
      fireEvent.keyDown(badge, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('does not add interactive attributes when not interactive', () => {
      render(
        <EnhancedBadge data-testid='badge'>Non-interactive badge</EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).not.toHaveAttribute('role', 'button');
      expect(badge).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Dismissible Behavior', () => {
    it('shows close button when dismissible', () => {
      render(
        <EnhancedBadge dismissible data-testid='badge'>
          Dismissible badge
        </EnhancedBadge>
      );

      const closeButton = screen.getByRole('button', { name: 'Remove badge' });
      expect(closeButton).toBeInTheDocument();
    });

    it('calls onRemove when close button is clicked', () => {
      const handleRemove = vi.fn();
      render(
        <EnhancedBadge dismissible onRemove={handleRemove} data-testid='badge'>
          Dismissible badge
        </EnhancedBadge>
      );

      const closeButton = screen.getByRole('button', { name: 'Remove badge' });
      fireEvent.click(closeButton);
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('stops propagation when close button is clicked', () => {
      const handleClick = vi.fn();
      const handleRemove = vi.fn();

      render(
        <EnhancedBadge
          interactive
          dismissible
          onClick={handleClick}
          onRemove={handleRemove}
          data-testid='badge'
        >
          Dismissible badge
        </EnhancedBadge>
      );

      const closeButton = screen.getByRole('button', { name: 'Remove badge' });
      fireEvent.click(closeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not show close button in dot mode', () => {
      render(
        <EnhancedBadge dismissible dot data-testid='badge'>
          Dismissible dot
        </EnhancedBadge>
      );

      expect(
        screen.queryByRole('button', { name: 'Remove badge' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Special Modes', () => {
    it('applies pulse animation when pulse is true', () => {
      render(
        <EnhancedBadge pulse data-testid='badge'>
          Pulsing badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-pulse', 'true');
      expect(badge).toHaveClass('animate-pulse');
    });

    it('renders as dot when dot is true', () => {
      render(
        <EnhancedBadge dot data-testid='badge'>
          Dot badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-dot', 'true');
      expect(badge).toHaveClass('w-2', 'h-2', 'p-0', 'min-w-0', 'rounded-full');
    });

    it('does not display content in dot mode', () => {
      render(
        <EnhancedBadge dot data-testid='badge'>
          This should not show
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).not.toHaveTextContent('This should not show');
    });
  });

  describe('AAA Compliance Mode', () => {
    it('applies AAA compliance styling', () => {
      render(
        <EnhancedBadge enforceAAA data-testid='badge'>
          AAA compliant badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-aaa', 'true');
    });

    it('applies AAA enhancements for glass variants', () => {
      render(
        <EnhancedBadge variant='glass' enforceAAA data-testid='badge'>
          AAA glass badge
        </EnhancedBadge>
      );

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-aaa', 'true');
      expect(badge).toHaveAttribute('data-variant', 'glass');
    });
  });
});

// ===== FACTORY FUNCTIONS TESTS =====

describe('BadgeFactory', () => {
  describe('Semantic Variants', () => {
    const semanticFactories = [
      'default',
      'secondary',
      'muted',
      'accent',
    ] as const;

    semanticFactories.forEach(factory => {
      it(`provides ${factory} factory`, () => {
        const { Badge } = BadgeFactory[factory];

        render(
          <Badge data-testid={`${factory}-badge`}>{factory} content</Badge>
        );

        const badge = screen.getByTestId(`${factory}-badge`);
        expect(badge).toHaveAttribute('data-variant', factory);
      });
    });
  });

  describe('Status Variants', () => {
    const statusFactories = ['success', 'warning', 'error', 'info'] as const;

    statusFactories.forEach(factory => {
      it(`provides ${factory} factory`, () => {
        const { Badge } = BadgeFactory[factory];

        render(
          <Badge data-testid={`${factory}-badge`}>{factory} status</Badge>
        );

        const badge = screen.getByTestId(`${factory}-badge`);
        expect(badge).toHaveAttribute('data-variant', factory);
      });
    });
  });

  describe('Style Variants', () => {
    const styleFactories = ['outline', 'ghost', 'glass', 'floating'] as const;

    styleFactories.forEach(factory => {
      it(`provides ${factory} factory`, () => {
        const { Badge } = BadgeFactory[factory];

        render(<Badge data-testid={`${factory}-badge`}>{factory} style</Badge>);

        const badge = screen.getByTestId(`${factory}-badge`);
        expect(badge).toHaveAttribute('data-variant', factory);
      });
    });
  });

  describe('Feature Variants', () => {
    it('provides interactive factory', () => {
      const { Badge } = BadgeFactory.interactive;

      render(
        <Badge data-testid='interactive-badge'>Interactive content</Badge>
      );

      const badge = screen.getByTestId('interactive-badge');
      expect(badge).toHaveAttribute('data-interactive', 'true');
    });

    it('provides dismissible factory', () => {
      const { Badge } = BadgeFactory.dismissible;

      render(
        <Badge data-testid='dismissible-badge'>Dismissible content</Badge>
      );

      expect(
        screen.getByRole('button', { name: 'Remove badge' })
      ).toBeInTheDocument();
    });

    it('provides dot factory', () => {
      const { Badge } = BadgeFactory.dot;

      render(<Badge data-testid='dot-badge'>Dot content</Badge>);

      const badge = screen.getByTestId('dot-badge');
      expect(badge).toHaveAttribute('data-dot', 'true');
    });

    it('provides pulse factory', () => {
      const { Badge } = BadgeFactory.pulse;

      render(<Badge data-testid='pulse-badge'>Pulse content</Badge>);

      const badge = screen.getByTestId('pulse-badge');
      expect(badge).toHaveAttribute('data-pulse', 'true');
    });
  });

  describe('Size Variants', () => {
    it('provides small factory', () => {
      const { Badge } = BadgeFactory.small;

      render(<Badge data-testid='small-badge'>Small content</Badge>);

      const badge = screen.getByTestId('small-badge');
      expect(badge).toHaveAttribute('data-size', 'sm');
    });

    it('provides large factory', () => {
      const { Badge } = BadgeFactory.large;

      render(<Badge data-testid='large-badge'>Large content</Badge>);

      const badge = screen.getByTestId('large-badge');
      expect(badge).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Accessibility Variant', () => {
    it('provides AAA factory', () => {
      const { Badge } = BadgeFactory.aaa;

      render(<Badge data-testid='aaa-badge'>AAA content</Badge>);

      const badge = screen.getByTestId('aaa-badge');
      expect(badge).toHaveAttribute('data-aaa', 'true');
    });
  });

  describe('Compound Patterns', () => {
    it('provides notification factory', () => {
      const { Badge } = BadgeFactory.notification;

      render(<Badge data-testid='notification-badge'>Notification</Badge>);

      const badge = screen.getByTestId('notification-badge');
      expect(badge).toHaveAttribute('data-variant', 'error');
      expect(badge).toHaveAttribute('data-size', 'sm');
      expect(badge).toHaveAttribute('data-dot', 'true');
    });

    it('provides status factory', () => {
      const { Badge } = BadgeFactory.status;

      render(<Badge data-testid='status-badge'>Status</Badge>);

      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveAttribute('data-variant', 'success');
      expect(badge).toHaveAttribute('data-pulse', 'true');
    });

    it('provides count factory', () => {
      const { Badge } = BadgeFactory.count;

      render(<Badge data-testid='count-badge'>Count</Badge>);

      const badge = screen.getByTestId('count-badge');
      expect(badge).toHaveAttribute('data-variant', 'default');
      expect(badge).toHaveAttribute('data-size', 'sm');
    });
  });
});

// ===== UTILITY FUNCTIONS TESTS =====

describe('Utility Functions', () => {
  describe('createCountBadge', () => {
    it('creates a count badge with number', () => {
      const badge = createCountBadge(5);
      render(<div data-testid='container'>{badge}</div>);

      const container = screen.getByTestId('container');
      expect(container).toHaveTextContent('5');
    });

    it('accepts additional props', () => {
      const badge = createCountBadge(10, { variant: 'success' });
      render(<div data-testid='count-badge'>{badge}</div>);

      const badgeElement = screen.getByTestId('count-badge')
        .firstElementChild as HTMLElement;
      expect(badgeElement).toHaveAttribute('data-variant', 'success');
      expect(badgeElement).toHaveTextContent('10');
    });
  });

  describe('createStatusDot', () => {
    it('creates a status dot with correct variant', () => {
      const badge = createStatusDot('success');
      render(<div data-testid='status-dot'>{badge}</div>);

      const badgeElement = screen.getByTestId('status-dot')
        .firstElementChild as HTMLElement;
      expect(badgeElement).toHaveAttribute('data-variant', 'success');
      expect(badgeElement).toHaveAttribute('data-dot', 'true');
      expect(badgeElement).toHaveAttribute('data-pulse', 'true');
    });

    it('works with different status variants', () => {
      const variants = ['success', 'warning', 'error', 'info'] as const;

      variants.forEach(variant => {
        const badge = createStatusDot(variant);
        render(
          <div key={variant} data-testid={`${variant}-dot`}>
            {badge}
          </div>
        );

        const badgeElement = screen.getByTestId(`${variant}-dot`)
          .firstElementChild as HTMLElement;
        expect(badgeElement).toHaveAttribute('data-variant', variant);
      });
    });
  });

  describe('createNotificationBadge', () => {
    it('creates a count badge when count is provided', () => {
      const badge = createNotificationBadge(3);
      render(<div data-testid='notification-badge'>{badge}</div>);

      const badgeElement = screen.getByTestId('notification-badge')
        .firstElementChild as HTMLElement;
      expect(badgeElement).toHaveAttribute('data-variant', 'error');
      expect(badgeElement).toHaveAttribute('data-size', 'sm');
      expect(badgeElement).toHaveTextContent('3');
      // Should not be a dot when showing count
      expect(badgeElement).not.toHaveClass('w-2', 'h-2', 'p-0');
    });

    it('creates a dot badge when count is zero', () => {
      const badge = createNotificationBadge(0);
      render(<div data-testid='notification-dot'>{badge}</div>);

      const badgeElement = screen.getByTestId('notification-dot')
        .firstElementChild as HTMLElement;
      expect(badgeElement).toHaveAttribute('data-variant', 'error');
      expect(badgeElement).toHaveAttribute('data-size', 'sm');
      expect(badgeElement).toHaveAttribute('data-dot', 'true');
    });

    it('creates a dot badge when count is undefined', () => {
      const badge = createNotificationBadge(undefined);
      render(<div data-testid='notification-dot'>{badge}</div>);

      const badgeElement = screen.getByTestId('notification-dot')
        .firstElementChild as HTMLElement;
      expect(badgeElement).toHaveAttribute('data-variant', 'error');
      expect(badgeElement).toHaveAttribute('data-size', 'sm');
      expect(badgeElement).toHaveAttribute('data-dot', 'true');
    });
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Badge Accessibility', () => {
  it('supports proper focus management for interactive badges', () => {
    render(
      <EnhancedBadge interactive data-testid='badge'>
        Interactive badge
      </EnhancedBadge>
    );

    const badge = screen.getByTestId('badge');

    // Should be focusable
    badge.focus();
    expect(badge).toHaveFocus();

    // Should have correct attributes
    expect(badge).toHaveAttribute('role', 'button');
    expect(badge).toHaveAttribute('tabIndex', '0');
  });

  it('does not interfere with focus for non-interactive badges', () => {
    render(
      <EnhancedBadge data-testid='badge'>Non-interactive badge</EnhancedBadge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).not.toHaveAttribute('role', 'button');
    expect(badge).not.toHaveAttribute('tabIndex');
  });

  it('supports ARIA attributes', () => {
    render(
      <EnhancedBadge
        role='status'
        aria-label='5 unread messages'
        aria-live='polite'
        data-testid='badge'
      >
        5
      </EnhancedBadge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('role', 'status');
    expect(badge).toHaveAttribute('aria-label', '5 unread messages');
    expect(badge).toHaveAttribute('aria-live', 'polite');
  });

  it('provides accessible close button for dismissible badges', () => {
    render(
      <EnhancedBadge dismissible data-testid='badge'>
        Dismissible badge
      </EnhancedBadge>
    );

    const closeButton = screen.getByRole('button', { name: 'Remove badge' });
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton).toHaveAttribute('aria-label', 'Remove badge');
  });
});

// ===== EDGE CASES AND ERROR HANDLING =====

describe('Badge Edge Cases', () => {
  it('handles empty content gracefully', () => {
    render(<EnhancedBadge data-testid='empty-badge' />);

    const badge = screen.getByTestId('empty-badge');
    expect(badge).toBeInTheDocument();
  });

  it('handles zero count correctly', () => {
    render(<EnhancedBadge count={0} data-testid='zero-badge' />);

    const badge = screen.getByTestId('zero-badge');
    expect(badge).toHaveTextContent('0');
  });

  it('handles negative count correctly', () => {
    render(<EnhancedBadge count={-5} data-testid='negative-badge' />);

    const badge = screen.getByTestId('negative-badge');
    expect(badge).toHaveTextContent('-5');
  });

  it('handles complex content', () => {
    render(
      <EnhancedBadge data-testid='complex-badge'>
        <span>Complex</span> <em>Content</em>
      </EnhancedBadge>
    );

    const badge = screen.getByTestId('complex-badge');
    expect(badge).toBeInTheDocument();
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('maintains proper styling with custom props', () => {
    render(
      <EnhancedBadge
        variant='floating'
        size='xl'
        interactive
        pulse
        enforceAAA
        className='custom-class'
        data-testid='custom-badge'
      >
        Custom badge
      </EnhancedBadge>
    );

    const badge = screen.getByTestId('custom-badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveAttribute('data-variant', 'floating');
    expect(badge).toHaveAttribute('data-size', 'xl');
    expect(badge).toHaveAttribute('data-interactive', 'true');
    expect(badge).toHaveAttribute('data-pulse', 'true');
    expect(badge).toHaveAttribute('data-aaa', 'true');
  });
});
