/**
 * Enhanced Drawer Component Tests - MAPS v2.2 Compliance
 *
 * Test Coverage:
 * - Mobile-optimized interactions and gestures
 * - Size and surface variants
 * - AAA accessibility compliance
 * - Keyboard navigation and focus management
 * - Touch-friendly behaviors
 * - Factory function configurations
 * - Anti-drift token enforcement
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  EnhancedDrawer,
  EnhancedDrawerTrigger,
  EnhancedDrawerContent,
  EnhancedDrawerHeader,
  EnhancedDrawerTitle,
  EnhancedDrawerDescription,
  EnhancedDrawerBody,
  EnhancedDrawerFooter,
  EnhancedDrawerClose,
  DrawerFactory,
} from '../../src/components/ui-enhanced/Drawer';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Test button component with proper ref forwarding
const TestButton = React.forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));
TestButton.displayName = 'TestButton';

// Mock intersection observer for mobile viewport detection
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
globalThis.IntersectionObserver = mockIntersectionObserver;

describe('EnhancedDrawer', () => {
  beforeEach(() => {
    // Mock media queries for accessibility testing
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders drawer components without errors', () => {
      render(
        <EnhancedDrawer>
          <EnhancedDrawerTrigger>Open Drawer</EnhancedDrawerTrigger>
          <EnhancedDrawerContent>
            <EnhancedDrawerHeader>
              <EnhancedDrawerTitle>Drawer Title</EnhancedDrawerTitle>
              <EnhancedDrawerDescription>
                Drawer description content
              </EnhancedDrawerDescription>
            </EnhancedDrawerHeader>
            <EnhancedDrawerBody>
              <p>Drawer body content</p>
            </EnhancedDrawerBody>
            <EnhancedDrawerFooter>
              <EnhancedDrawerClose>Close</EnhancedDrawerClose>
            </EnhancedDrawerFooter>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(
        screen.getByRole('button', { name: 'Open Drawer' })
      ).toBeInTheDocument();
    });

    it('opens drawer when trigger is clicked', async () => {
      const user = userEvent.setup();

      render(
        <EnhancedDrawer>
          <EnhancedDrawerTrigger asChild>
            <TestButton>Open Drawer</TestButton>
          </EnhancedDrawerTrigger>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test Drawer</EnhancedDrawerTitle>
            <EnhancedDrawerBody>Content</EnhancedDrawerBody>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const trigger = screen.getByRole('button', { name: 'Open Drawer' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Test Drawer')).toBeInTheDocument();
      });
    });

    it('closes drawer when close button is clicked', async () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test Drawer</EnhancedDrawerTitle>
            <EnhancedDrawerBody>Content</EnhancedDrawerBody>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: 'Close drawer' });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes drawer when overlay is clicked', async () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test Drawer</EnhancedDrawerTitle>
            <EnhancedDrawerBody>Content</EnhancedDrawerBody>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Click outside the drawer content
      fireEvent.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    it.each([
      ['sm', 'max-h-[40vh]'],
      ['md', 'max-h-[60vh]'],
      ['lg', 'max-h-[80vh]'],
      ['xl', 'max-h-[90vh]'],
      ['auto', 'max-h-[90vh]'],
    ])(
      'applies correct styles for size variant "%s"',
      (size, expectedClass) => {
        render(
          <EnhancedDrawer defaultOpen>
            <EnhancedDrawerContent
              size={size as 'sm' | 'md' | 'lg' | 'xl' | 'auto'}
            >
              <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
            </EnhancedDrawerContent>
          </EnhancedDrawer>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveClass(expectedClass);
      }
    );
  });

  describe('Surface Variants', () => {
    it.each([
      ['elevated', ['bg-background-elevated', 'border-border']],
      ['panel', ['bg-background-panel', 'border-border-strong']],
      ['glass', ['bg-background/95', 'backdrop-blur-xl']],
      ['floating', ['bg-background/90', 'backdrop-blur-2xl']],
    ])(
      'applies correct styles for surface variant "%s"',
      (surface, expectedClasses) => {
        render(
          <EnhancedDrawer defaultOpen>
            <EnhancedDrawerContent
              surface={surface as 'elevated' | 'panel' | 'glass' | 'floating'}
            >
              <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
            </EnhancedDrawerContent>
          </EnhancedDrawer>
        );

        const dialog = screen.getByRole('dialog');
        for (const className of expectedClasses) {
          expect(dialog).toHaveClass(className);
        }
      }
    );
  });

  describe('Handle Visibility', () => {
    it('shows handle by default', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      const handle = dialog.querySelector(String.raw`.h-1\.5.w-12`);
      expect(handle).toBeInTheDocument();
    });

    it('hides handle when handle="hidden"', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent handle='hidden'>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      const handle = dialog.querySelector(String.raw`.h-1\.5.w-12`);
      expect(handle).not.toBeInTheDocument();
    });

    it('supports custom handle content', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent
            handleContent={<div data-testid='custom-handle'>Custom</div>}
          >
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(screen.getByTestId('custom-handle')).toBeInTheDocument();
    });
  });

  describe('AAA Compliance Mode', () => {
    it('applies AAA styles when enforceAAA is true', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent enforceAAA>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('aaa:bg-background-aaa');
      expect(dialog).toHaveClass('aaa:border-border-aaa');
    });

    it('does not apply AAA styles by default', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).not.toHaveClass('aaa:bg-background-aaa');
    });
  });

  describe('Keyboard Navigation', () => {
    it('focuses drawer content when opened', async () => {
      render(
        <EnhancedDrawer>
          <EnhancedDrawerTrigger>Open</EnhancedDrawerTrigger>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveFocus();
      });
    });

    it('closes drawer with Escape key', async () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('traps focus within drawer', async () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
            <EnhancedDrawerBody>
              <button>First</button>
              <button>Second</button>
            </EnhancedDrawerBody>
            <EnhancedDrawerFooter>
              <EnhancedDrawerClose>Close</EnhancedDrawerClose>
            </EnhancedDrawerFooter>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      const closeButton = screen.getByRole('button', { name: 'Close' });

      // Tab forward to last focusable element
      await user.tab();
      await user.tab();
      await user.tab();

      expect(closeButton).toHaveFocus();

      // Tab again should wrap to first focusable element
      await user.tab();
      expect(firstButton).toHaveFocus();

      // Shift+Tab should go back to last element
      await user.tab({ shift: true });
      expect(closeButton).toHaveFocus();
    });
  });

  describe('Factory Configurations', () => {
    it('creates action sheet configuration', () => {
      const config = DrawerFactory.actionSheet();

      expect(config).toEqual({
        size: 'auto',
        surface: 'elevated',
        handle: 'visible',
      });
    });

    it('creates bottom sheet configuration', () => {
      const config = DrawerFactory.bottomSheet();

      expect(config).toEqual({
        size: 'lg',
        surface: 'panel',
        handle: 'visible',
        snap: 'proximity',
      });
    });

    it('creates form drawer configuration', () => {
      const config = DrawerFactory.formDrawer();

      expect(config).toEqual({
        size: 'xl',
        surface: 'elevated',
        handle: 'auto',
      });
    });

    it('creates accessible configuration', () => {
      const config = DrawerFactory.accessible();

      expect(config).toEqual({
        size: 'lg',
        surface: 'elevated',
        handle: 'visible',
        enforceAAA: true,
      });
    });

    it('allows factory overrides', () => {
      const config = DrawerFactory.actionSheet({
        size: 'md',
        surface: 'glass',
      });

      expect(config).toEqual({
        size: 'md',
        surface: 'glass',
        handle: 'visible',
      });
    });
  });

  describe('Mobile Optimization', () => {
    it('applies mobile-optimized styles', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');

      // Mobile positioning
      expect(dialog).toHaveClass('fixed');
      expect(dialog).toHaveClass('inset-x-0');
      expect(dialog).toHaveClass('bottom-0');

      // Mobile styling
      expect(dialog).toHaveClass('rounded-t-2xl');
      expect(dialog).toHaveClass('max-h-[90vh]');

      // Touch-friendly spacing
      expect(dialog).toHaveClass('pb-safe-area-inset-bottom');
    });

    it('supports snap behavior variants', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent snap='always'>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('snap-y');
      expect(dialog).toHaveClass('snap-mandatory');
    });

    it('applies touch-optimized close button', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const closeButton = screen.getByRole('button', { name: 'Close drawer' });

      // Touch-optimized size
      expect(closeButton).toHaveClass('h-10');
      expect(closeButton).toHaveClass('w-10');
      expect(closeButton).toHaveClass('rounded-full');

      // Touch feedback
      expect(closeButton).toHaveClass('active:scale-95');
    });
  });

  describe('Accessibility', () => {
    it('meets WCAG accessibility standards', async () => {
      const { container } = render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerHeader>
              <EnhancedDrawerTitle>Accessible Drawer</EnhancedDrawerTitle>
              <EnhancedDrawerDescription>
                This drawer is fully accessible
              </EnhancedDrawerDescription>
            </EnhancedDrawerHeader>
            <EnhancedDrawerBody>
              <p>Content goes here</p>
            </EnhancedDrawerBody>
            <EnhancedDrawerFooter>
              <EnhancedDrawerClose>Close</EnhancedDrawerClose>
            </EnhancedDrawerFooter>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA attributes', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test Title</EnhancedDrawerTitle>
            <EnhancedDrawerDescription>
              Test description
            </EnhancedDrawerDescription>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('manages focus correctly on open/close', async () => {
      render(
        <div>
          <button data-testid='external-button'>External Button</button>
          <EnhancedDrawer>
            <EnhancedDrawerTrigger>Open Drawer</EnhancedDrawerTrigger>
            <EnhancedDrawerContent>
              <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
              <EnhancedDrawerClose>Close</EnhancedDrawerClose>
            </EnhancedDrawerContent>
          </EnhancedDrawer>
        </div>
      );

      const trigger = screen.getByRole('button', { name: 'Open Drawer' });

      // Focus trigger and open drawer
      trigger.focus();
      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveFocus();
      });

      // Close drawer
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Polymorphic Rendering', () => {
    it('supports asChild prop for custom elements', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerHeader asChild>
              <section data-testid='custom-header'>
                <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
              </section>
            </EnhancedDrawerHeader>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      const customHeader = screen.getByTestId('custom-header');
      expect(customHeader.tagName).toBe('SECTION');
    });

    it('supports asChild on all components', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent asChild>
            <article data-testid='custom-content'>
              <EnhancedDrawerHeader asChild>
                <header data-testid='custom-header'>
                  <EnhancedDrawerTitle asChild>
                    <h2 data-testid='custom-title'>Title</h2>
                  </EnhancedDrawerTitle>
                </header>
              </EnhancedDrawerHeader>
              <EnhancedDrawerBody asChild>
                <main data-testid='custom-body'>Content</main>
              </EnhancedDrawerBody>
              <EnhancedDrawerFooter asChild>
                <footer data-testid='custom-footer'>
                  <EnhancedDrawerClose asChild>
                    <button data-testid='custom-close'>Close</button>
                  </EnhancedDrawerClose>
                </footer>
              </EnhancedDrawerFooter>
            </article>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(screen.getByTestId('custom-content').tagName).toBe('ARTICLE');
      expect(screen.getByTestId('custom-header').tagName).toBe('HEADER');
      expect(screen.getByTestId('custom-title').tagName).toBe('H2');
      expect(screen.getByTestId('custom-body').tagName).toBe('MAIN');
      expect(screen.getByTestId('custom-footer').tagName).toBe('FOOTER');
      expect(screen.getByTestId('custom-close').tagName).toBe('BUTTON');
    });
  });

  describe('Error Handling', () => {
    it('handles invalid props gracefully', () => {
      expect(() => {
        render(
          <EnhancedDrawer defaultOpen>
            <EnhancedDrawerContent size={'invalid' as 'sm'}>
              <EnhancedDrawerTitle>Test</EnhancedDrawerTitle>
            </EnhancedDrawerContent>
          </EnhancedDrawer>
        );
      }).not.toThrow();
    });

    it('works without optional props', () => {
      render(
        <EnhancedDrawer defaultOpen>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Minimal Drawer</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Minimal Drawer')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not render content when closed', () => {
      render(
        <EnhancedDrawer>
          <EnhancedDrawerTrigger>Open</EnhancedDrawerTrigger>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Hidden Content</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('properly unmounts when closed', async () => {
      render(
        <EnhancedDrawer>
          <EnhancedDrawerTrigger>Open</EnhancedDrawerTrigger>
          <EnhancedDrawerContent>
            <EnhancedDrawerTitle>Test Content</EnhancedDrawerTitle>
          </EnhancedDrawerContent>
        </EnhancedDrawer>
      );

      // Open drawer
      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByText('Test Content')).toBeInTheDocument();

      // Close drawer
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
      });
    });
  });
});
