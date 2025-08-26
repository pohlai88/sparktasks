/**
 * Enhanced Collapsible Component Test Suite - MAPS v2.2 Compliance
 *
 * Comprehensive test suite for Enhanced Collapsible components with
 * accessibility, performance, and enterprise compliance validation
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EnhancedCollapsibleRoot,
  EnhancedCollapsibleTrigger,
  EnhancedCollapsibleContent,
  EnhancedCollapsibleComplete,
  CollapsibleFactory,
} from '../../src/components/ui-enhanced/Collapsible';

// Test wrapper for consistent setup
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('Enhanced Collapsible Components - MAPS v2.2', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  describe('EnhancedCollapsibleRoot', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <div>Test content</div>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot variant='glass'>
            <div>Test content</div>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const rootElement = container.firstChild?.firstChild as HTMLElement;
      expect(rootElement).toHaveClass('border-surface-glass/20');
    });

    it('handles disabled state properly', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot disabled>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
    });

    it('supports compact density', () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot density='compact'>
            <div>Test content</div>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const rootElement = container.firstChild?.firstChild as HTMLElement;
      expect(rootElement).toHaveClass('space-y-1');
    });

    it('enforces AAA accessibility when enabled', () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot aaaMode={true}>
            <div>Test content</div>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const rootElement = container.firstChild?.firstChild as HTMLElement;
      expect(rootElement).toHaveClass('border-contrast-aaa');
    });

    it('handles custom className prop', () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot className='custom-test-class'>
            <div>Test content</div>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const rootElement = container.firstChild?.firstChild as HTMLElement;
      expect(rootElement).toHaveClass('custom-test-class');
    });
  });

  describe('EnhancedCollapsibleTrigger', () => {
    it('renders with proper accessibility attributes', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('toggles expanded state on click', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');

      // Initially closed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports keyboard navigation', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      // Space key should toggle
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Enter key should toggle
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('applies variant-specific styling', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger variant='ghost'>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('hover:bg-background-elevated');
    });

    it('displays chevron icon correctly', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const chevron = screen.getByTestId('collapsible-chevron');
      expect(chevron).toBeInTheDocument();
      expect(chevron).toHaveAttribute('aria-hidden', 'true');
    });

    it('handles AAA mode properly', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger aaaMode={true}>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('text-contrast-aaa');
    });
  });

  describe('EnhancedCollapsibleContent', () => {
    it('is hidden when collapsed', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const content = screen.getByText('Test content');
      expect(content.parentElement).toHaveAttribute('data-state', 'closed');
      expect(content.parentElement).toHaveStyle({ display: 'none' });
    });

    it('is visible when expanded', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const content = screen.getByText('Test content');
      expect(content.parentElement).toHaveAttribute('data-state', 'open');
    });

    it('applies variant styling correctly', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent variant='floating'>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const content = screen.getByText('Test content');
      expect(content.parentElement).toHaveClass('bg-background-elevated');
    });

    it('handles animation preferences', async () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const content = screen.getByText('Test content');
      expect(content.parentElement).toBeInTheDocument();
    });
  });

  describe('EnhancedCollapsibleComplete', () => {
    it('renders complete component with trigger and content', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleComplete
            trigger='Test trigger'
            content='Test content'
          />
        </TestWrapper>
      );

      expect(screen.getByRole('button')).toHaveTextContent('Test trigger');
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('handles custom trigger as ReactNode', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleComplete
            trigger={<span>Custom trigger</span>}
            content='Test content'
          />
        </TestWrapper>
      );

      expect(screen.getByText('Custom trigger')).toBeInTheDocument();
    });

    it('applies variant to both trigger and content', () => {
      const { container } = render(
        <TestWrapper>
          <EnhancedCollapsibleComplete
            trigger='Test trigger'
            content='Test content'
            variant='glass'
          />
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveClass('backdrop-blur-xl');

      const root =
        container.querySelector('[data-testid]') ||
        container.firstChild?.firstChild;
      expect(root).toHaveClass('border-surface-glass/20');
    });

    it('toggles content visibility', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleComplete
            trigger='Test trigger'
            content='Test content'
          />
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');

      // Initially closed
      const content = screen.getByText('Test content');
      expect(content.parentElement).toHaveAttribute('data-state', 'closed');

      // Click to open
      await user.click(trigger);
      expect(content.parentElement).toHaveAttribute('data-state', 'open');
    });
  });

  describe('CollapsibleFactory', () => {
    it('creates glass variant correctly', () => {
      const { container } = render(
        <TestWrapper>
          <CollapsibleFactory.glass>
            <EnhancedCollapsibleTrigger variant='glass'>
              Glass trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent variant='glass'>
              Glass content
            </EnhancedCollapsibleContent>
          </CollapsibleFactory.glass>
        </TestWrapper>
      );

      const root = container.firstChild?.firstChild as HTMLElement;
      expect(root).toHaveClass('border-surface-glass/20');
    });

    it('creates floating variant correctly', () => {
      const { container } = render(
        <TestWrapper>
          <CollapsibleFactory.floating>
            <EnhancedCollapsibleTrigger variant='floating'>
              Floating trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent variant='floating'>
              Floating content
            </EnhancedCollapsibleContent>
          </CollapsibleFactory.floating>
        </TestWrapper>
      );

      const root = container.firstChild?.firstChild as HTMLElement;
      expect(root).toHaveClass('shadow-lg');
    });

    it('creates AAA compliant variant', () => {
      const { container } = render(
        <TestWrapper>
          <CollapsibleFactory.aaa>
            <EnhancedCollapsibleTrigger aaaMode={true}>
              AAA trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent aaaMode={true}>
              AAA content
            </EnhancedCollapsibleContent>
          </CollapsibleFactory.aaa>
        </TestWrapper>
      );

      const root = container.firstChild?.firstChild as HTMLElement;
      expect(root).toHaveClass('border-contrast-aaa');
    });

    it('creates compact variant with proper spacing', () => {
      const { container } = render(
        <TestWrapper>
          <CollapsibleFactory.compact>
            <EnhancedCollapsibleTrigger>
              Compact trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Compact content
            </EnhancedCollapsibleContent>
          </CollapsibleFactory.compact>
        </TestWrapper>
      );

      const root = container.firstChild?.firstChild as HTMLElement;
      expect(root).toHaveClass('space-y-1');
    });
  });

  describe('Accessibility Compliance', () => {
    it('provides proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('type', 'button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('manages focus correctly', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              <button>Focusable content</button>
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button', { name: 'Test trigger' });

      // Focus should be on trigger initially
      trigger.focus();
      expect(trigger).toHaveFocus();

      // After opening, focus should remain on trigger
      await user.click(trigger);
      expect(trigger).toHaveFocus();
    });

    it('supports screen reader navigation', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      const chevron = screen.getByTestId('collapsible-chevron');

      // Chevron should be hidden from screen readers
      expect(chevron).toHaveAttribute('aria-hidden', 'true');

      // Trigger should be properly labeled
      expect(trigger).toHaveAccessibleName();
    });

    it('respects Windows High Contrast mode', () => {
      // Mock forced-colors media query
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(forced-colors: active)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { container } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      // Component should render without errors in forced colors mode
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance & Optimization', () => {
    it('handles rapid toggle interactions', async () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');

      // Rapid clicks should be handled gracefully
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Final state should be correct
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('cleans up animations properly', async () => {
      const { unmount } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Unmounting should not cause errors
      expect(() => unmount()).not.toThrow();
    });

    it('handles large content efficiently', async () => {
      const largeContent = Array.from({ length: 1000 }, (_, i) => (
        <div key={i}>Item {i}</div>
      ));

      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Large content trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              {largeContent}
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');

      // Should handle large content without performance issues
      const startTime = performance.now();
      await user.click(trigger);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Enterprise Requirements', () => {
    it('supports controlled state management', async () => {
      const onOpenChange = vi.fn();

      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot open={false} onOpenChange={onOpenChange}>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('maintains state persistence across re-renders', () => {
      const { rerender } = render(
        <TestWrapper>
          <EnhancedCollapsibleRoot defaultOpen={true}>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Re-render should maintain state
      rerender(
        <TestWrapper>
          <EnhancedCollapsibleRoot defaultOpen={true}>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('integrates with form validation systems', () => {
      render(
        <TestWrapper>
          <form>
            <EnhancedCollapsibleRoot>
              <EnhancedCollapsibleTrigger>
                Form section
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent>
                <input type='text' required aria-label='Required field' />
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          </form>
        </TestWrapper>
      );

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      const input = screen.getByLabelText('Required field');
      expect(input).toBeRequired();
    });

    it('supports data attributes for testing', () => {
      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot data-testid='test-collapsible'>
            <EnhancedCollapsibleTrigger data-testid='test-trigger'>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent data-testid='test-content'>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-collapsible')).toBeInTheDocument();
      expect(screen.getByTestId('test-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('handles missing children gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <EnhancedCollapsibleRoot>
              <div />
            </EnhancedCollapsibleRoot>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('handles malformed content structure', () => {
      console.error = vi.fn(); // Suppress expected error logs

      expect(() => {
        render(
          <TestWrapper>
            <EnhancedCollapsibleRoot>
              <div>Invalid structure</div>
            </EnhancedCollapsibleRoot>
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('recovers from animation errors', async () => {
      // Mock animation error
      const originalAnimate = Element.prototype.animate;
      Element.prototype.animate = vi.fn().mockImplementation(() => {
        throw new Error('Animation error');
      });

      render(
        <TestWrapper>
          <EnhancedCollapsibleRoot>
            <EnhancedCollapsibleTrigger>
              Test trigger
            </EnhancedCollapsibleTrigger>
            <EnhancedCollapsibleContent>
              Test content
            </EnhancedCollapsibleContent>
          </EnhancedCollapsibleRoot>
        </TestWrapper>
      );

      const trigger = screen.getByRole('button');

      // Should still function despite animation error
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Restore original method
      Element.prototype.animate = originalAnimate;
    });
  });
});
