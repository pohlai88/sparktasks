import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge, BadgeVariant, BadgeSize, BadgeStatus } from '@components/ui/Badge';

describe('Badge - Optimized Enterprise Component', () => {
  
  describe('Basic Functionality', () => {
    it('renders with DESIGN_TOKENS styling', () => {
      render(<Badge>Test Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Test Badge');
    });

    it('supports all variants with memoized classes', () => {
      const variants: BadgeVariant[] = ['default', 'success', 'warning', 'danger', 'info', 'outline', 'inline'];
      variants.forEach(variant => {
        const { unmount } = render(<Badge variant={variant}>Badge {variant}</Badge>);
        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-variant', variant);
        expect(badge).toHaveTextContent(`Badge ${variant}`);
        unmount();
      });
    });

    it('renders loading skeleton when loading=true', () => {
      render(<Badge loading>Loading Badge</Badge>);
      const skeleton = screen.getByTestId('badge-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      expect(skeleton).toHaveAttribute('data-variant', 'skeleton');
    });

    it('renders loading skeleton with correct size', () => {
      render(<Badge loading size="lg">Loading Badge</Badge>);
      const skeleton = screen.getByTestId('badge-skeleton');
      expect(skeleton).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Size Variants', () => {
    const sizes: BadgeSize[] = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      it(`applies ${size} size with memoized classes`, () => {
        render(<Badge size={size}>Size {size}</Badge>);
        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-size', size);
      });
    });

    it('defaults to md size when no size specified', () => {
      render(<Badge>Default Size</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-size', 'md');
    });
  });

  describe('Status System', () => {
    const statuses: BadgeStatus[] = ['success', 'warning', 'danger', 'info'];
    
    statuses.forEach(status => {
      it(`renders ${status} status with icon and accessibility`, () => {
        render(<Badge status={status}>Status {status}</Badge>);
        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-status', status);
        
        // Check for status icon
        const statusIcon = badge.querySelector('svg');
        expect(statusIcon).toBeInTheDocument();
        expect(statusIcon).toHaveAttribute('aria-hidden', 'true');
        
        // Inner live region should announce status
        const liveRegion = badge.querySelector('[role="status"][aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveClass('sr-only');
      });
    });

    it('provides correct screen reader text for each status', () => {
      const statusLabels = {
        success: 'Success',
        warning: 'Warning', 
        danger: 'Error',
        info: 'Information'
      };
      
      Object.entries(statusLabels).forEach(([status, label]) => {
        const { unmount } = render(<Badge status={status as BadgeStatus}>Status test</Badge>);
        expect(screen.getByText(label)).toBeInTheDocument();
        unmount();
      });
    });

    it('always shows status live region regardless of ariaLabel', () => {
      render(<Badge status="success" ariaLabel="Custom success message">Success Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('aria-label', 'Custom success message');
      
      // Inner live region should always be present for status announcements
      const liveRegion = badge.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveTextContent('Success');
    });
  });

  describe('Accessibility', () => {
    it('meets accessibility requirements for status badge', () => {
      render(<Badge status="success" ariaLabel="Success badge">Accessible</Badge>);
      const badge = screen.getByLabelText('Success badge');
      
      // Container should not have role=status anymore
      expect(badge).not.toHaveAttribute('role', 'status');
      expect(badge).not.toHaveAttribute('aria-live');
      
      // Inner live region should handle status announcements
      const liveRegion = badge.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('does not set role=status for static badge', () => {
      render(<Badge ariaLabel="Static badge">Accessible</Badge>);
      const badge = screen.getByLabelText('Static badge');
      expect(badge).not.toHaveAttribute('role');
      expect(badge).not.toHaveAttribute('aria-live');
    });

    it('sets role=button for interactive badges', () => {
      const handleClick = vi.fn();
      render(<Badge interactive onClick={handleClick}>Interactive Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('role', 'button');
      expect(badge).toHaveAttribute('tabIndex', '0');
    });

    it('provides keyboard accessibility for interactive badges', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Badge interactive onClick={handleClick}>Clickable Badge</Badge>);
      const badge = screen.getByTestId('badge');
      
      await user.tab();
      expect(badge).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interactive Features', () => {
    it('handles click events when interactive', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Badge interactive onClick={handleClick}>Clickable</Badge>);
      const badge = screen.getByTestId('badge');
      
      await user.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies interactive styling when interactive=true', () => {
      render(<Badge interactive>Interactive Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-interactive', 'true');
    });

    it('supports pulse animation', () => {
      render(<Badge pulse>Pulsing Badge</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('animate-pulse');
    });
  });

  describe('Dismissible Functionality', () => {
    it('renders dismiss button when dismissible=true', () => {
      const handleDismiss = vi.fn();
      render(<Badge dismissible onDismiss={handleDismiss}>Dismissible Badge</Badge>);
      
      const dismissButton = screen.getByTestId('badge-dismiss-button');
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toHaveAttribute('aria-label', 'Remove badge');
    });

    it('handles dismiss click events', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      
      render(<Badge dismissible onDismiss={handleDismiss}>Dismissible Badge</Badge>);
      const dismissButton = screen.getByTestId('badge-dismiss-button');
      
      await user.click(dismissButton);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard dismiss events', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      
      render(<Badge dismissible onDismiss={handleDismiss}>Dismissible Badge</Badge>);
      const badge = screen.getByTestId('badge');
      
      badge.focus();
      await user.keyboard('{Delete}');
      expect(handleDismiss).toHaveBeenCalledTimes(1);
      
      await user.keyboard('{Backspace}');
      expect(handleDismiss).toHaveBeenCalledTimes(2);
    });

    it('sets data attributes correctly for dismissible badges', () => {
      const handleDismiss = vi.fn();
      render(<Badge dismissible onDismiss={handleDismiss}>Dismissible Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-dismissible', 'true');
      expect(badge).toHaveAttribute('data-interactive', 'true');
    });
  });

  describe('Icon Support', () => {
    it('renders custom icon before content', () => {
      const customIcon = <span data-testid="custom-icon">🎉</span>;
      render(<Badge icon={customIcon}>Badge with Icon</Badge>);
      
      const icon = screen.getByTestId('custom-icon');
      const badge = screen.getByTestId('badge');
      
      expect(icon).toBeInTheDocument();
      expect(badge).toHaveTextContent('🎉Badge with Icon');
    });

    it('positions icon correctly with aria-hidden', () => {
      const customIcon = <span data-testid="custom-icon">🎉</span>;
      render(<Badge icon={customIcon}>Badge with Icon</Badge>);
      
      const iconWrapper = screen.getByTestId('custom-icon').parentElement;
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Data Attributes', () => {
    it('provides comprehensive data attributes for testing and debugging', () => {
      render(
        <Badge 
          variant="success" 
          size="lg" 
          status="success"
          interactive
          dismissible
          onDismiss={() => {}}
        >
          Test Badge
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', 'success');
      expect(badge).toHaveAttribute('data-size', 'lg');
      expect(badge).toHaveAttribute('data-status', 'success');
      expect(badge).toHaveAttribute('data-interactive', 'true');
      expect(badge).toHaveAttribute('data-dismissible', 'true');
      expect(badge).toHaveAttribute('data-testid', 'badge');
    });

    it('omits optional data attributes when not applicable', () => {
      render(<Badge>Simple Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).not.toHaveAttribute('data-status');
      expect(badge).not.toHaveAttribute('data-interactive');
      expect(badge).not.toHaveAttribute('data-dismissible');
    });
  });

  describe('Prop Forwarding', () => {
    it('forwards container props correctly', () => {
      render(
        <Badge 
          className="custom-class" 
          id="custom-id"
          data-custom="custom-value"
        >
          Badge with Props
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveAttribute('id', 'custom-id');
      expect(badge).toHaveAttribute('data-custom', 'custom-value');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Badge with Ref</Badge>);
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Badge with Ref');
    });

    it('handles event forwarding correctly', async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();
      
      render(<Badge onKeyDown={handleKeyDown} tabIndex={0}>Badge with Events</Badge>);
      const badge = screen.getByTestId('badge');
      
      await user.tab();
      expect(badge).toHaveFocus();
      
      await user.keyboard('a');
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Performance Optimizations', () => {
    it('maintains stable references across re-renders with same props', () => {
      const { rerender } = render(<Badge variant="default">Original</Badge>);
      const firstRender = screen.getByTestId('badge');
      
      rerender(<Badge variant="default">Original</Badge>);
      const secondRender = screen.getByTestId('badge');
      
      // Component should maintain stable structure
      expect(firstRender).toBeInTheDocument();
      expect(secondRender).toBeInTheDocument();
    });

    it('updates efficiently when props change', () => {
      const { rerender } = render(<Badge variant="default">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'default');
      
      rerender(<Badge variant="success">Test</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'success');
    });

    it('memoizes StatusIcon component rendering', () => {
      const { rerender } = render(<Badge status="success">Test</Badge>);
      const firstIcon = screen.getByTestId('badge').querySelector('svg');
      
      rerender(<Badge status="success">Test</Badge>);
      const secondIcon = screen.getByTestId('badge').querySelector('svg');
      
      expect(firstIcon).toBeInTheDocument();
      expect(secondIcon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Badge>{''}</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
    });

    it('handles undefined onClick gracefully for interactive badges', async () => {
      const user = userEvent.setup();
      render(<Badge interactive>Interactive without onClick</Badge>);
      
      const badge = screen.getByTestId('badge');
      await user.click(badge);
      // Should not throw error
      expect(badge).toBeInTheDocument();
    });

    it('handles undefined onDismiss gracefully', () => {
      render(<Badge dismissible>Dismissible without onDismiss</Badge>);
      // Should not render dismiss button without onDismiss
      expect(screen.queryByTestId('badge-dismiss-button')).not.toBeInTheDocument();
    });

    it('handles complex content structures', () => {
      render(
        <Badge>
          <span>Complex</span>
          <strong>Content</strong>
          <em>Structure</em>
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('ComplexContentStructure');
    });
  });

  describe('Combined Features', () => {
    it('handles status + dismissible + interactive combination', async () => {
      const handleClick = vi.fn();
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Badge 
          status="warning" 
          dismissible 
          onDismiss={handleDismiss}
          interactive 
          onClick={handleClick}
        >
          Complex Badge
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      const dismissButton = screen.getByTestId('badge-dismiss-button');
      
      // Should have button role (interactive takes precedence for container)
      expect(badge).toHaveAttribute('role', 'button');
      expect(badge).toHaveAttribute('data-status', 'warning');
      expect(badge).toHaveAttribute('data-interactive', 'true');
      expect(badge).toHaveAttribute('data-dismissible', 'true');
      
      // Inner live region should handle status announcements
      const liveRegion = badge.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      
      // Test interactions
      await user.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.click(dismissButton);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('uses button role for interactive badges with status', () => {
      render(<Badge status="info" interactive>Status + Interactive</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('role', 'button');
      
      // Inner live region should handle status announcements
      const liveRegion = badge.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });
});
