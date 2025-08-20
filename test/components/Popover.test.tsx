/**
 * @file Popover.test.tsx  
 * @description Enterprise-grade test suite for Popover component
 * Tests all variants, states, interactions, and accessibility features
 * Following proven testing patterns from successful HoverCard implementation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Popover } from '@/components/ui/Popover';

// Mock createPortal for predictable testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

// Test helper to create a basic popover
const renderPopover = (props = {}) => {
  const defaultProps = {
    content: 'Popover content',
    children: <button>Trigger</button>,
    ...props,
  };
  
  return render(<Popover {...defaultProps} />);
};

describe('Popover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Functionality', () => {
    it('renders trigger element', () => {
      renderPopover();
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    });

    it('does not show content initially when uncontrolled', () => {
      renderPopover();
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('shows content when open prop is true', () => {
      renderPopover({ open: true });
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('shows content initially when defaultOpen is true', () => {
      renderPopover({ defaultOpen: true });
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  describe('Click Trigger (Default)', () => {
    it('shows content on click', async () => {
      renderPopover();
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });

    it('hides content on second click', async () => {
      renderPopover();
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      
      // Open
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      // Close
      fireEvent.click(trigger);
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });

    it('hides on outside click when closeOnOutsideClick is true', async () => {
      renderPopover({ closeOnOutsideClick: true });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      // Click outside
      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });

    it('does not hide on outside click when closeOnOutsideClick is false', async () => {
      renderPopover({ closeOnOutsideClick: false });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      // Click outside
      fireEvent.click(document.body);
      
      // Should still be visible
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  describe('Hover Trigger', () => {
    it('shows content on mouse enter', async () => {
      renderPopover({ trigger: 'hover' });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.mouseOver(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });

    it('hides content on mouse leave', async () => {
      renderPopover({ trigger: 'hover', hideDelay: 0 });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      
      // Show
      fireEvent.mouseOver(trigger);
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      // Hide
      fireEvent.mouseOut(trigger);
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });

    it('respects showDelay for hover trigger', async () => {
      vi.useFakeTimers();
      
      renderPopover({ trigger: 'hover', showDelay: 100 });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.mouseOver(trigger);
      
      // Should not show immediately
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      
      // Fast-forward time
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      vi.useRealTimers();
    });

    it('respects hideDelay for hover trigger', async () => {
      vi.useFakeTimers();
      
      renderPopover({ trigger: 'hover', hideDelay: 100 });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      
      // Show
      fireEvent.mouseOver(trigger);
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      // Start hiding
      fireEvent.mouseOut(trigger);
      
      // Should still be visible
      expect(screen.getByText('Popover content')).toBeInTheDocument();
      
      // Fast-forward time
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
      
      vi.useRealTimers();
    });
  });

  describe('Focus Trigger', () => {
    it('shows content on focus', async () => {
      renderPopover({ trigger: 'focus' });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.focus(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });

    it('hides content on blur', async () => {
      renderPopover({ trigger: 'focus' });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      
      // Show
      fireEvent.focus(trigger);
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
      
      // Hide
      fireEvent.blur(trigger);
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('hides content on Escape key when closeOnEscape is true', async () => {
      renderPopover({ closeOnEscape: true, open: true });
      
      expect(screen.getByText('Popover content')).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      });
    });

    it('does not hide on Escape when closeOnEscape is false', async () => {
      renderPopover({ closeOnEscape: false, open: true });
      
      expect(screen.getByText('Popover content')).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Should still be visible
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('handles Enter key on trigger for click behavior', async () => {
      renderPopover();
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.keyDown(trigger, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });

    it('handles Space key on trigger for click behavior', async () => {
      renderPopover();
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.keyDown(trigger, { key: ' ' });
      
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('calls onOpenChange when controlled', async () => {
      const onOpenChange = vi.fn();
      renderPopover({ open: false, onOpenChange });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when uncontrolled', async () => {
      const onOpenChange = vi.fn();
      renderPopover({ onOpenChange });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('controls visibility when open prop is provided', () => {
      const { rerender } = renderPopover({ open: false });
      
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
      
      rerender(<Popover open={true} content="Popover content"><button>Trigger</button></Popover>);
      
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('does not show content when disabled', async () => {
      renderPopover({ disabled: true });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      // Should not appear
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('applies disabled styling', () => {
      renderPopover({ disabled: true, open: true });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveClass('opacity-50', 'pointer-events-none');
    });
  });

  describe('Positioning', () => {
    it('applies correct position classes', () => {
      renderPopover({ open: true, position: 'top' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('data-position', 'top');
    });

    it('supports all position variants', () => {
      const positions = ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'];
      
      positions.forEach(position => {
        const { unmount } = renderPopover({ open: true, position });
        
        const popover = screen.getByText('Popover content').closest('[role="dialog"]');
        expect(popover).toHaveAttribute('data-position', position);
        
        unmount();
      });
    });
  });

  describe('Size Variants', () => {
    it('applies correct size classes', () => {
      renderPopover({ open: true, size: 'lg' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('data-size', 'lg');
    });

    it('supports all size variants', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'];
      
      sizes.forEach(size => {
        const { unmount } = renderPopover({ open: true, size });
        
        const popover = screen.getByText('Popover content').closest('[role="dialog"]');
        expect(popover).toHaveAttribute('data-size', size);
        
        unmount();
      });
    });
  });

  describe('Style Variants', () => {
    it('applies correct variant classes', () => {
      renderPopover({ open: true, variant: 'card' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('data-variant', 'card');
    });

    it('supports all style variants', () => {
      const variants = ['default', 'card', 'tooltip', 'menu', 'dialog'];
      
      variants.forEach(variant => {
        const { unmount } = renderPopover({ open: true, variant });
        
        const popover = screen.getByText('Popover content').closest('[role="dialog"], [role="tooltip"]');
        expect(popover).toHaveAttribute('data-variant', variant);
        
        unmount();
      });
    });
  });

  describe('Animation Variants', () => {
    it('applies correct animation classes', () => {
      renderPopover({ open: true, animation: 'slide' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('data-animation', 'slide');
    });

    it('supports all animation variants', () => {
      const animations = ['scale', 'slide', 'fade', 'none'];
      
      animations.forEach(animation => {
        const { unmount } = renderPopover({ open: true, animation });
        
        const popover = screen.getByText('Popover content').closest('[role="dialog"]');
        expect(popover).toHaveAttribute('data-animation', animation);
        
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      renderPopover({ open: true });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(popover).toHaveAttribute('role', 'dialog');
    });

    it('supports aria-label', () => {
      renderPopover({ open: true, 'aria-label': 'Custom label' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('aria-label', 'Custom label');
    });

    it('supports aria-labelledby', () => {
      renderPopover({ open: true, 'aria-labelledby': 'custom-label' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('aria-labelledby', 'custom-label');
    });

    it('supports aria-describedby', () => {
      renderPopover({ open: true, 'aria-describedby': 'custom-description' });
      
      const popover = screen.getByText('Popover content').closest('[role="dialog"]');
      expect(popover).toHaveAttribute('aria-describedby', 'custom-description');
    });

    it('manages focus correctly when shown', async () => {
      renderPopover();
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const popover = screen.getByText('Popover content').closest('[role="dialog"]');
        expect(popover).toBeInTheDocument();
      });
    });
  });

  describe('Arrow', () => {
    it('shows arrow by default', () => {
      renderPopover({ open: true });
      
      const arrow = screen.getByText('Popover content').closest('[role="dialog"]')?.querySelector('[data-arrow]');
      expect(arrow).toBeInTheDocument();
    });

    it('hides arrow when showArrow is false', () => {
      renderPopover({ open: true, showArrow: false });
      
      const arrow = screen.getByText('Popover content').closest('[role="dialog"]')?.querySelector('[data-arrow]');
      expect(arrow).not.toBeInTheDocument();
    });
  });

  describe('Custom Content', () => {
    it('renders ReactNode content', () => {
      const CustomContent = () => <div data-testid="custom-content">Custom content</div>;
      renderPopover({ open: true, content: <CustomContent /> });
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('renders string content', () => {
      renderPopover({ open: true, content: 'String content' });
      
      expect(screen.getByText('String content')).toBeInTheDocument();
    });
  });

  describe('Portal Rendering', () => {
    it('renders in portal when portal prop is true', () => {
      renderPopover({ open: true, portal: true });
      
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('renders inline when portal prop is false', () => {
      renderPopover({ open: true, portal: false });
      
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  describe('Compound Components', () => {
    it('renders with Header compound component', () => {
      const content = (
        <div>
          <Popover.Header>Header content</Popover.Header>
          <Popover.Content>Body content</Popover.Content>
        </div>
      );
      
      renderPopover({ open: true, content });
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders with Footer compound component', () => {
      const content = (
        <div>
          <Popover.Content>Body content</Popover.Content>
          <Popover.Footer>Footer content</Popover.Footer>
        </div>
      );
      
      renderPopover({ open: true, content });
      
      expect(screen.getByText('Body content')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders with all compound components', () => {
      const content = (
        <div>
          <Popover.Header>Header content</Popover.Header>
          <Popover.Content>Body content</Popover.Content>
          <Popover.Footer>Footer content</Popover.Footer>
        </div>
      );
      
      renderPopover({ open: true, content });
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapidly toggling open state', async () => {
      const onOpenChange = vi.fn();
      renderPopover({ onOpenChange });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      
      // Rapid clicks
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);
      
      // Should call onOpenChange for each click
      expect(onOpenChange).toHaveBeenCalledTimes(3);
    });

    it('handles missing content gracefully', () => {
      renderPopover({ open: true, content: null });
      
      // Should not crash
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    });

    it('handles empty content gracefully', () => {
      renderPopover({ open: true, content: '' });
      
      // Should not crash
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    });

    it('cleans up timers on unmount', () => {
      vi.useFakeTimers();
      
      const { unmount } = renderPopover({ trigger: 'hover', showDelay: 100 });
      
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      fireEvent.mouseOver(trigger);
      
      // Unmount before timer fires
      unmount();
      
      // Should not crash when timer fires
      vi.advanceTimersByTime(100);
      
      vi.useRealTimers();
    });
  });
});
