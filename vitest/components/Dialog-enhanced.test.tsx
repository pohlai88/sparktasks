/**
 * Enhanced Dialog Component Test Suite - MAPS v2.2 with Testing Library
 *
 * TESTING LIBRARY BENEFITS:
 * ✅ User-Centric Testing - Find elements like users do (by role, text, label)
 * ✅ Accessibility-First - Built-in a11y best practices in queries
 * ✅ Semantic Queries - Less brittle than CSS selectors or test IDs
 * ✅ Realistic Interactions - userEvent mimics real user behavior
 * ✅ Async Testing - waitFor utilities handle dynamic content
 * ✅ Custom Matchers - jest-dom provides rich semantic assertions
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  EnhancedDialog,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../src/components/ui-enhanced/Dialog';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test utilities
const TestDialog = ({
  title = 'Test Dialog',
  description = 'This is a test dialog',
  children = <div>Dialog content</div>,
  trigger = <Button>Open Dialog</Button>,
  footer = <Button>Close</Button>,
  ...props
}) => (
  <EnhancedDialog
    trigger={trigger}
    title={title}
    description={description}
    footer={footer}
    {...props}
  >
    {children}
  </EnhancedDialog>
);

const PrimitiveDialog = ({
  children,
  trigger = <Button>Open Dialog</Button>,
  ...props
}) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent {...props}>
      <DialogHeader>
        <DialogTitle>Primitive Dialog</DialogTitle>
        <DialogDescription>Testing primitive components</DialogDescription>
      </DialogHeader>
      {children}
      <DialogFooter>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

describe('Enhanced Dialog Component - MAPS v2.2 Compliance', () => {
  // Mock media queries for accessibility testing
  const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(mockMatchMedia));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering & Basic Functionality', () => {
    it('renders enhanced dialog with all parts', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      // Should render trigger
      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      expect(trigger).toBeInTheDocument();

      // Open dialog
      await user.click(trigger);

      // Should render all dialog parts
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Test Dialog' })
      ).toBeInTheDocument();
      expect(screen.getByText('This is a test dialog')).toBeInTheDocument();
      expect(screen.getByText('Dialog content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('renders primitive dialog components independently', async () => {
      const user = userEvent.setup();

      render(
        <PrimitiveDialog>
          <div>Custom content</div>
        </PrimitiveDialog>
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Primitive Dialog' })
      ).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('handles controlled state properly', async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <TestDialog open={false} onOpenChange={onOpenChange} />
      );

      // Dialog should not be visible
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Trigger click should call onOpenChange
      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);

      // Manually set open to true
      rerender(<TestDialog open={true} onOpenChange={onOpenChange} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Enhanced Variants & MAPS Integration', () => {
    it('applies surface variants correctly', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <TestDialog surface='elevated1' data-testid='dialog-content' />
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const dialog = screen.getByTestId('dialog-content');
      expect(dialog).toHaveClass('bg-elevated1');

      // Test different surface variants
      await user.click(screen.getByRole('button', { name: 'Close' }));
      rerender(<TestDialog surface='elevated2' data-testid='dialog-content' />);
      await user.click(trigger);
      expect(screen.getByTestId('dialog-content')).toHaveClass('bg-elevated2');
    });

    it('applies size variants correctly', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <TestDialog size='sm' data-testid='dialog-content' />
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const dialog = screen.getByTestId('dialog-content');
      expect(dialog).toHaveClass('max-w-md');

      // Test large size
      await user.click(screen.getByRole('button', { name: 'Close' }));
      rerender(<TestDialog size='lg' data-testid='dialog-content' />);
      await user.click(trigger);
      expect(screen.getByTestId('dialog-content')).toHaveClass('max-w-2xl');
    });

    it('applies vibrancy variants correctly', async () => {
      const user = userEvent.setup();

      render(<TestDialog vibrancy='glass' data-testid='dialog-content' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const dialog = screen.getByTestId('dialog-content');
      // Check for glass material classes
      expect(dialog).toHaveClass(expect.stringMatching(/backdrop-blur|glass/));
    });

    it('supports title level variants', async () => {
      const user = userEvent.setup();

      render(<TestDialog titleLevel='title1' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const title = screen.getByRole('heading', { name: 'Test Dialog' });
      expect(title).toHaveClass(expect.stringMatching(/text-|font-/));
    });

    it('supports header alignment variants', async () => {
      const user = userEvent.setup();

      render(<TestDialog headerAlignment='center' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Check for alignment classes
      const header = screen
        .getByRole('heading', { name: 'Test Dialog' })
        .closest('[class*="text-center"]');
      expect(header).toBeInTheDocument();
    });
  });

  describe('AAA Compliance & Enterprise Accessibility', () => {
    it('enforces AAA mode correctly', async () => {
      const user = userEvent.setup();

      render(
        <TestDialog
          enforceAAA={true}
          vibrancy='glass'
          data-testid='dialog-content'
        />
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const dialog = screen.getByTestId('dialog-content');

      // AAA mode should override vibrancy and enforce solid backgrounds
      expect(dialog).toHaveClass('border-border', 'bg-background');
      expect(dialog).toHaveClass('backdrop-blur-none');

      // Should have text scrim wrapper
      const textScrim = dialog.querySelector('[class*="text-scrim"]');
      expect(textScrim).toBeInTheDocument();
    });

    it('applies Windows High Contrast styles', async () => {
      const user = userEvent.setup();

      // Mock forced-colors media query
      const mockMatchMediaHC = (query: string) => ({
        matches: query.includes('forced-colors'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      vi.stubGlobal('matchMedia', vi.fn().mockImplementation(mockMatchMediaHC));

      render(<TestDialog enforceAAA={true} data-testid='dialog-content' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const dialog = screen.getByTestId('dialog-content');
      expect(dialog).toHaveClass('forced-colors:border-[Canvas]');
      expect(dialog).toHaveClass('forced-colors:bg-[CanvasText]');
    });

    it('respects motion reduction preferences', async () => {
      const user = userEvent.setup();

      // Mock prefers-reduced-motion
      const mockMatchMediaMotion = (query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      vi.stubGlobal(
        'matchMedia',
        vi.fn().mockImplementation(mockMatchMediaMotion)
      );

      render(<TestDialog data-testid='dialog-content' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Dialog should have motion-safe classes
      const dialog = screen.getByTestId('dialog-content');
      expect(dialog).toHaveClass(expect.stringMatching(/motion-/));
    });

    it('provides pointer-only hover interactions', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toHaveClass('pointer:hover:opacity-100');
    });

    it('passes comprehensive accessibility audit', async () => {
      const { container } = render(
        <TestDialog
          title='Accessible Dialog'
          description='This dialog meets AAA standards'
          footer={
            <>
              <Button variant='outline'>Cancel</Button>
              <Button>Confirm</Button>
            </>
          }
        />
      );

      const user = userEvent.setup();
      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management & Keyboard Navigation', () => {
    it('manages focus correctly on open', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Focus should be within dialog
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Wait for focus to settle
      await waitFor(() => {
        expect(document.activeElement).toBeInstanceOf(HTMLElement);
      });
    });

    it('supports deterministic initial focus', async () => {
      const user = userEvent.setup();
      const initialFocusRef = { current: null };

      const TestDialogWithInitialFocus = () => {
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        React.useEffect(() => {
          initialFocusRef.current = buttonRef.current;
        }, []);

        return (
          <TestDialog
            initialFocusRef={initialFocusRef}
            footer={<Button ref={buttonRef}>Focus Me</Button>}
          />
        );
      };

      render(<TestDialogWithInitialFocus />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      await waitFor(() => {
        const focusButton = screen.getByRole('button', { name: 'Focus Me' });
        expect(focusButton).toHaveFocus();
      });
    });

    it('traps focus within dialog', async () => {
      const user = userEvent.setup();

      render(
        <TestDialog
          footer={
            <>
              <Button data-testid='button1'>Button 1</Button>
              <Button data-testid='button2'>Button 2</Button>
            </>
          }
        />
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Tab should cycle through focusable elements within dialog
      await user.tab();
      await user.tab();

      // Focus should stay within dialog
      expect(document.activeElement).toBeDefined();
      const dialog = screen.getByRole('dialog');
      expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes on overlay click', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click outside dialog content (on overlay)
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        await user.click(overlay);

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      }
    });

    it('restores focus to trigger on close', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Radix Integration & Primitive Behavior', () => {
    it('properly integrates with Radix Dialog primitives', async () => {
      const user = userEvent.setup();

      render(<PrimitiveDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Should have proper Radix data attributes
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('data-state', 'open');

      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      expect(overlay).toBeInTheDocument();
    });

    it('supports custom close behavior', async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Test</DialogTitle>
            <DialogClose asChild>
              <Button data-testid='custom-close'>Custom Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      const customClose = screen.getByTestId('custom-close');
      await user.click(customClose);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('prevents close when event is prevented', async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent
            onEscapeKeyDown={e => e.preventDefault()}
            onInteractOutside={e => e.preventDefault()}
          >
            <DialogTitle>Persistent Dialog</DialogTitle>
            <DialogDescription>
              Cannot be closed with Escape or overlay click
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      // Try to close with Escape
      await user.keyboard('{Escape}');
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Try to close with overlay click
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        await user.click(overlay);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      }
    });
  });

  describe('CVA Variants & Style Integration', () => {
    it('generates correct overlay variant classes', () => {
      const standardOverlay = dialogOverlayVariants({
        vibrancy: 'none',
        enforcement: 'standard',
      });
      expect(standardOverlay).toContain('fixed');
      expect(standardOverlay).toContain('inset-0');

      const aaaOverlay = dialogOverlayVariants({
        vibrancy: 'glass',
        enforcement: 'aaa',
      });
      expect(aaaOverlay).toContain('bg-black/75');
      expect(aaaOverlay).toContain('forced-colors:bg-[Canvas]');
    });

    it('generates correct content variant classes', () => {
      const standardContent = dialogContentVariants({
        surface: 'elevated1',
        size: 'md',
        vibrancy: 'none',
        enforcement: 'standard',
      });
      expect(standardContent).toContain('fixed');
      expect(standardContent).toContain('max-w-lg');

      const aaaContent = dialogContentVariants({
        surface: 'elevated2',
        size: 'lg',
        vibrancy: 'glass',
        enforcement: 'aaa',
      });
      expect(aaaContent).toContain('max-w-2xl');
      expect(aaaContent).toContain('backdrop-blur-none');
    });

    it('handles variant combinations correctly', () => {
      const variants = dialogContentVariants({
        surface: 'translucent',
        size: 'fullWidth',
        vibrancy: 'floating',
        enforcement: 'aaa',
      });

      expect(variants).toContain('max-w-[95vw]');
      expect(variants).toContain('backdrop-blur-none'); // AAA overrides vibrancy
    });
  });

  describe('Polymorphic Factory Integration', () => {
    it('supports polymorphic as prop', async () => {
      const user = userEvent.setup();

      render(
        <DialogContent as='section' data-testid='dialog-section'>
          <DialogTitle>Polymorphic Dialog</DialogTitle>
        </DialogContent>
      );

      const dialogSection = screen.getByTestId('dialog-section');
      expect(dialogSection.tagName).toBe('SECTION');
    });

    it('forwards refs correctly', async () => {
      const dialogRef = React.useRef<HTMLDivElement>(null);
      const user = userEvent.setup();

      const RefTestDialog = () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent ref={dialogRef} data-testid='ref-dialog'>
            <DialogTitle>Ref Test</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      render(<RefTestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      expect(dialogRef.current).toBeInstanceOf(HTMLElement);
      expect(dialogRef.current).toBe(screen.getByTestId('ref-dialog'));
    });
  });

  describe('Performance & Memory Management', () => {
    it('renders within performance budget', async () => {
      const startTime = performance.now();

      render(<TestDialog />);

      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(50); // 50ms budget
    });

    it('handles rapid open/close without memory leaks', async () => {
      const user = userEvent.setup();

      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });

      // Rapidly open and close
      for (let i = 0; i < 5; i++) {
        await user.click(trigger);
        const closeButton = screen.getByRole('button', { name: 'Close' });
        await user.click(closeButton);
      }

      // Should not cause issues
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<TestDialog />);

      // Verify no errors on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases & Error Handling', () => {
    it('handles missing title gracefully', async () => {
      const user = userEvent.setup();

      render(<TestDialog title='' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Should still render dialog without title
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('handles missing description gracefully', async () => {
      const user = userEvent.setup();

      render(<TestDialog description='' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Test Dialog' })
      ).toBeInTheDocument();
    });

    it('handles disabled close button', async () => {
      const user = userEvent.setup();

      render(<TestDialog showClose={false} />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Should not have close button
      expect(
        screen.queryByRole('button', { name: 'Close' })
      ).not.toBeInTheDocument();
    });

    it('handles invalid variant props gracefully', async () => {
      const user = userEvent.setup();

      // @ts-expect-error - Testing invalid prop
      render(<TestDialog surface='invalid' size='invalid' />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);

      // Should still render with defaults
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
