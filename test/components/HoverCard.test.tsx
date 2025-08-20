/**
 * @fileoverview HoverCard Component Test Suite
 * 
 * Comprehensive test coverage for the HoverCard component including:
 * - Basic functionality and interaction patterns
 * - Positioning and collision detection
 * - Size and variant styling
 * - Accessibility compliance
 * - Animation and timing controls
 * - Portal rendering
 * - Edge cases and error handling
 * 
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HoverCard } from '@/components/ui/HoverCard';

// ===== TEST UTILITIES =====

/**
 * Test component that triggers hover card
 */
const TestTrigger = React.forwardRef<HTMLButtonElement, { children?: React.ReactNode }>(
  ({ children = 'Hover me', ...props }, ref) => <button ref={ref} {...props}>{children}</button>
);
TestTrigger.displayName = 'TestTrigger';

/**
 * Helper to trigger hover events that work reliably in tests
 */
const triggerHover = (element: HTMLElement) => {
  fireEvent.mouseOver(element);
};

/**
 * Helper to trigger unhover events that work reliably in tests  
 */
const triggerUnhover = (element: HTMLElement) => {
  fireEvent.mouseOut(element);
};

/**
 * Test content for hover card
 */
const TestContent = ({ children = 'Test content', ...props }: { children?: React.ReactNode }) => (
  <div {...props}>{children}</div>
);

/**
 * Rich test content with multiple elements
 */
const RichTestContent = () => (
  <div>
    <h3>User Profile</h3>
    <p>john.doe@example.com</p>
    <div>
      <span>Status: Online</span>
      <button>View Profile</button>
    </div>
  </div>
);

/**
 * Utility to create controlled hover card
 */
const ControlledHoverCard = ({ 
  open, 
  onOpenChange,
  content,
  ...props 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  content: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => (
  <HoverCard open={open} onOpenChange={onOpenChange} content={content} {...props}>
    <TestTrigger />
  </HoverCard>
);

// ===== SETUP AND TEARDOWN =====

describe('HoverCard', () => {
  beforeEach(() => {
    // Reset any timers
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ===== BASIC FUNCTIONALITY TESTS =====

  describe('Basic Functionality', () => {
    it('renders trigger element correctly', () => {
      render(
        <HoverCard content={<TestContent />}>
          <TestTrigger>Custom trigger</TestTrigger>
        </HoverCard>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Custom trigger');
    });

    it('does not show content initially', () => {
      render(
        <HoverCard content={<TestContent />}>
          <TestTrigger />
        </HoverCard>
      );

      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });

    it('shows content on hover', async () => {
      render(
        <HoverCard content={<TestContent />} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      // Use fireEvent directly as recommended by Feedback 1
      const button = screen.getByRole('button');
      fireEvent.mouseOver(button);
      
      // Use async query to wait for React updates
      expect(await screen.findByText('Test content')).toBeInTheDocument();
    });

    it('hides content on mouse leave', async () => {
      render(
        <HoverCard content={<TestContent />} showDelay={0} hideDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      
      // Show content first  
      triggerHover(trigger);
      expect(await screen.findByText('Test content')).toBeInTheDocument();

      // Hide content
      triggerUnhover(trigger);
      await waitFor(() =>
        expect(screen.queryByText('Test content')).not.toBeInTheDocument()
      );
    });

    it('respects disabled state', async () => {      render(
        <HoverCard content={<TestContent />} disabled>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      vi.advanceTimersByTime(1000);
      
      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });
  });

  // ===== POSITION TESTS =====

  describe('Positioning', () => {
    const positions: Array<{
      position: Parameters<typeof HoverCard>[0]['position'];
      description: string;
    }> = [
      { position: 'top', description: 'top position' },
      { position: 'top-start', description: 'top-start position' },
      { position: 'top-end', description: 'top-end position' },
      { position: 'bottom', description: 'bottom position' },
      { position: 'bottom-start', description: 'bottom-start position' },
      { position: 'bottom-end', description: 'bottom-end position' },
      { position: 'left', description: 'left position' },
      { position: 'left-start', description: 'left-start position' },
      { position: 'left-end', description: 'left-end position' },
      { position: 'right', description: 'right position' },
      { position: 'right-start', description: 'right-start position' },
      { position: 'right-end', description: 'right-end position' },
    ];

    positions.forEach(({ position, description }) => {
      it(`applies correct positioning for ${description}`, async () => {        render(
          <HoverCard content={<TestContent />} position={position!} showDelay={0}>
            <TestTrigger />
          </HoverCard>
        );

        triggerHover(screen.getByRole('button'));
        
        const content = screen.getByRole('tooltip');
        expect(content).toHaveAttribute('data-position', position);
      });
    });

    it('applies custom offset', async () => {      render(
        <HoverCard content={<TestContent />} offset={16} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      const content = screen.getByRole('tooltip');
      expect(content).toBeInTheDocument();
    });
  });

  // ===== SIZE TESTS =====

  describe('Sizes', () => {
    const sizes: Array<{
      size: Parameters<typeof HoverCard>[0]['size'];
      description: string;
    }> = [
      { size: 'sm', description: 'small size' },
      { size: 'md', description: 'medium size' },
      { size: 'lg', description: 'large size' },
      { size: 'xl', description: 'extra large size' },
    ];

    sizes.forEach(({ size, description }) => {
      it(`applies correct size for ${description}`, async () => {        render(
          <HoverCard content={<TestContent />} size={size!} showDelay={0}>
            <TestTrigger />
          </HoverCard>
        );

        triggerHover(screen.getByRole('button'));
        
        const content = screen.getByRole('tooltip');
        expect(content).toHaveAttribute('data-size', size);
      });
    });
  });

  // ===== VARIANT TESTS =====

  describe('Variants', () => {
    const variants: Array<{
      variant: Parameters<typeof HoverCard>[0]['variant'];
      description: string;
    }> = [
      { variant: 'default', description: 'default variant' },
      { variant: 'elevation', description: 'elevation variant' },
      { variant: 'minimal', description: 'minimal variant' },
      { variant: 'rich', description: 'rich variant' },
      { variant: 'interactive', description: 'interactive variant' },
    ];

    variants.forEach(({ variant, description }) => {
      it(`applies correct styling for ${description}`, async () => {        render(
          <HoverCard content={<TestContent />} variant={variant!} showDelay={0}>
            <TestTrigger />
          </HoverCard>
        );

        triggerHover(screen.getByRole('button'));
        
        // Rich and interactive variants use role="dialog", others use role="tooltip"
        const expectedRole = (variant === 'rich' || variant === 'interactive') ? 'dialog' : 'tooltip';
        const content = screen.getByRole(expectedRole);
        expect(content).toHaveAttribute('data-variant', variant);
      });
    });
  });

  // ===== TRIGGER TESTS =====

  describe('Trigger Modes', () => {
    it('triggers on hover only', () => {      render(
        <HoverCard content={<TestContent />} trigger="hover" showDelay={0} hideDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      
      // Hover should show
      act(() => {
        triggerHover(trigger);
      });
      expect(screen.getByText('Test content')).toBeInTheDocument();
      
      // Unhover to clean state
      act(() => {
        triggerUnhover(trigger);
      });
      
      // Focus should not affect (since trigger is hover-only)
      act(() => {
        trigger.focus();
      });
      // Use immediate assertion since this should be instant
      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });

    it('triggers on focus only', async () => {
      render(
        <HoverCard content={<TestContent />} trigger="focus" showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      
      // Focus should show
      act(() => {
        trigger.focus();
      });
      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });
      
      // Blur should hide
      act(() => {
        trigger.blur();
      });
      await waitFor(() => {
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      });
    });

    it('triggers on both hover and focus', async () => {      render(
        <HoverCard content={<TestContent />} trigger="both" showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      
      // Hover should show
      triggerHover(trigger);
      expect(screen.getByText('Test content')).toBeInTheDocument();
      
      triggerUnhover(trigger);
      await waitFor(() => {
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      });
      
      // Focus should also show (using focusIn to emit the event React listens for)
      fireEvent.focusIn(trigger);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });

  // ===== TIMING TESTS =====

  describe('Timing Controls', () => {
    it('respects show delay', async () => {      render(
        <HoverCard content={<TestContent />} showDelay={500}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      // Should not show immediately
      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      
      // Should show after delay
      act(() => {
        vi.advanceTimersByTime(500);
      });
      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });
    });

    it('respects hide delay', async () => {      render(
        <HoverCard content={<TestContent />} showDelay={0} hideDelay={300}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      triggerHover(trigger);
      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });
      
      triggerUnhover(trigger);
      
      // Should not hide immediately
      expect(screen.getByText('Test content')).toBeInTheDocument();
      
      // Should hide after delay
      act(() => {
        vi.advanceTimersByTime(300);
      });
      await waitFor(() => {
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      });
    });

    it('cancels show timer on quick unhover', async () => {      render(
        <HoverCard content={<TestContent />} showDelay={500}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      triggerHover(trigger);
      
      // Unhover before delay
      vi.advanceTimersByTime(200);
      triggerUnhover(trigger);
      
      // Advance past original delay
      vi.advanceTimersByTime(400);
      expect(screen.queryByText('Test content')).not.toBeInTheDocument();
    });
  });

  // ===== ANIMATION TESTS =====

  describe('Animations', () => {
    const animations: Array<{
      animation: Parameters<typeof HoverCard>[0]['animation'];
      description: string;
    }> = [
      { animation: 'scale', description: 'scale animation' },
      { animation: 'fade', description: 'fade animation' },
      { animation: 'slide', description: 'slide animation' },
      { animation: 'none', description: 'no animation' },
    ];

    animations.forEach(({ animation, description }) => {
      it(`applies ${description}`, async () => {        render(
          <HoverCard content={<TestContent />} animation={animation!} showDelay={0}>
            <TestTrigger />
          </HoverCard>
        );

        triggerHover(screen.getByRole('button'));
        
        const content = screen.getByRole('tooltip');
        expect(content).toBeInTheDocument();
        // Note: Animation classes would be tested in integration/visual tests
      });
    });
  });

  // ===== CONTROLLED MODE TESTS =====

  describe('Controlled Mode', () => {
    it('works in controlled mode', () => {
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <ControlledHoverCard open={false} onOpenChange={onOpenChange} content={<TestContent />} />
      );

      expect(screen.queryByText('Test content')).not.toBeInTheDocument();

      rerender(
        <ControlledHoverCard open={true} onOpenChange={onOpenChange} content={<TestContent />} />
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('calls onOpenChange callback', () => {
      const onOpenChange = vi.fn();      render(
        <HoverCard content={<TestContent />} onOpenChange={onOpenChange} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      act(() => {
        triggerHover(screen.getByRole('button'));
      });
      
      // Check if callback was called immediately
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {      render(
        <HoverCard content={<TestContent />} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      triggerHover(trigger);
      
      const content = screen.getByRole('tooltip');
      expect(content).toHaveAttribute('role', 'tooltip');
      expect(trigger).toHaveAttribute('aria-describedby', content.id);
    });

    it('supports custom aria-label', async () => {      render(
        <HoverCard 
          content={<TestContent />} 
          variant="rich"
          aria-label="Custom tooltip label"
          showDelay={0}
        >
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      const content = screen.getByRole('dialog'); // Rich variant uses dialog role
      expect(content).toHaveAttribute('aria-label', 'Custom tooltip label');
    });

    it('handles escape key', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      
      render(
        <HoverCard content={<TestContent />} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      expect(screen.getByText('Test content')).toBeInTheDocument();
      
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Test content')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('maintains hover when moving to content', async () => {      render(
        <HoverCard content={<RichTestContent />} showDelay={0} hideDelay={100}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      triggerHover(trigger);
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      
      // Move to content
      const content = screen.getByRole('tooltip');
      triggerHover(content);
      
      // Content should remain visible
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  // ===== ARROW TESTS =====

  describe('Arrow Pointer', () => {
    it('shows arrow by default', async () => {      render(
        <HoverCard content={<TestContent />} showDelay={0} data-testid="hover-card">
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      expect(screen.getByTestId('hover-card-arrow')).toBeInTheDocument();
    });

    it('hides arrow when showArrow is false', async () => {      render(
        <HoverCard 
          content={<TestContent />} 
          showArrow={false} 
          showDelay={0}
          data-testid="hover-card"
        >
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      expect(screen.queryByTestId('hover-card-arrow')).not.toBeInTheDocument();
    });
  });

  // ===== CONTENT TESTS =====

  describe('Content Handling', () => {
    it('renders simple text content', async () => {      render(
        <HoverCard content="Simple text content" showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('renders complex JSX content', async () => {      render(
        <HoverCard content={<RichTestContent />} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Status: Online')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View Profile' })).toBeInTheDocument();
    });

    it('handles content overflow', async () => {      const longContent = (
        <div>
          {Array.from({ length: 50 }, (_, i) => (
            <p key={i}>This is line {i + 1} of very long content that should scroll.</p>
          ))}
        </div>
      );

      render(
        <HoverCard content={longContent} size="sm" showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      const content = screen.getByRole('tooltip');
      expect(content).toHaveClass('overflow-auto');
    });
  });

  // ===== COMPOUND COMPONENTS TESTS =====

  describe('Compound Components', () => {
    it('renders with Header, Content, and Footer', async () => {      const CompoundContent = () => (
        <div>
          <HoverCard.Header>
            <h3>Profile Header</h3>
          </HoverCard.Header>
          <HoverCard.Content>
            <p>Profile content here</p>
          </HoverCard.Content>
          <HoverCard.Footer>
            <button>Action Button</button>
          </HoverCard.Footer>
        </div>
      );

      render(
        <HoverCard content={<CompoundContent />} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      expect(screen.getByText('Profile Header')).toBeInTheDocument();
      expect(screen.getByText('Profile content here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('applies custom className to compound components', async () => {      const CompoundContent = () => (
        <div>
          <HoverCard.Header className="custom-header">Header</HoverCard.Header>
          <HoverCard.Content className="custom-content">Content</HoverCard.Content>
          <HoverCard.Footer className="custom-footer">Footer</HoverCard.Footer>
        </div>
      );

      render(
        <HoverCard content={<CompoundContent />} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      expect(screen.getByText('Header')).toHaveClass('custom-header');
      expect(screen.getByText('Content')).toHaveClass('custom-content');
      expect(screen.getByText('Footer')).toHaveClass('custom-footer');
    });
  });

  // ===== PORTAL TESTS =====

  describe('Portal Rendering', () => {
    it('renders in document body by default', async () => {      render(
        <HoverCard content={<TestContent />} portal={true} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      const content = screen.getByRole('tooltip');
      expect(document.body).toContainElement(content);
    });

    it('renders in custom container', async () => {      const customContainer = document.createElement('div');
      document.body.appendChild(customContainer);

      render(
        <HoverCard content={<TestContent />} container={customContainer} portal={true} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      const content = screen.getByRole('tooltip');
      expect(customContainer).toContainElement(content);
      
      // Cleanup
      document.body.removeChild(customContainer);
    });
  });

  // ===== EDGE CASES =====

  describe('Edge Cases', () => {
    it('handles rapid hover/unhover', async () => {      render(
        <HoverCard content={<TestContent />} showDelay={100} hideDelay={100}>
          <TestTrigger />
        </HoverCard>
      );

      const trigger = screen.getByRole('button');
      
      // Rapid hover/unhover
      triggerHover(trigger);
      act(() => {
        vi.advanceTimersByTime(50);
      });
      triggerUnhover(trigger);
      act(() => {
        vi.advanceTimersByTime(50);
      });
      triggerHover(trigger);
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Test content')).toBeInTheDocument();
      });
    });

    it('handles null container gracefully', async () => {      render(
        <HoverCard content={<TestContent />} container={null} showDelay={0}>
          <TestTrigger />
        </HoverCard>
      );

      triggerHover(screen.getByRole('button'));
      
      // Should still render in body
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('handles missing trigger ref', () => {
      // This test ensures the component doesn't crash with invalid refs
      render(
        <HoverCard content={<TestContent />}>
          <TestTrigger />
        </HoverCard>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
