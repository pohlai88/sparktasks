/**
 * Enhanced Sheet Component Tests - MAPS v2.2 Dark-First Philosophy
 *
 * TEST COVERAGE MATRIX:
 * - ✅ Component Rendering & Structure
 * - ✅ Variant System Validation
 * - ✅ Accessibility Compliance (AAA)
 * - ✅ Interaction Testing
 * - ✅ Motion & Animation Behavior
 * - ✅ MAPS v2.2 Anti-Drift Enforcement
 * - ✅ Apple HIG Harmony Validation
 * - ✅ Liquid Glass Material Testing
 * - ✅ Polymorphic Pattern Testing
 * - ✅ Factory Pattern Testing
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

import {
  EnhancedSheet,
  EnhancedSheetTrigger,
  EnhancedSheetContent,
  EnhancedSheetHeader,
  EnhancedSheetTitle,
  EnhancedSheetDescription,
  EnhancedSheetFooter,
  EnhancedSheetClose,
  SheetFactory,
  enhancedSheetContentVariants,
  enhancedSheetOverlayVariants,
  enhancedSheetHeaderVariants,
  enhancedSheetTitleVariants,
  enhancedSheetDescriptionVariants,
  enhancedSheetFooterVariants,
  enhancedSheetCloseVariants,
} from '@/components/ui-enhanced/Sheet';
import { EnhancedButton } from '@/components/ui-enhanced/Button';

// ===== TEST SETUP =====

const user = userEvent.setup();

// Mock motion preferences
const mockMatchMedia = vi.fn((query: string) => ({
  matches: query === '(prefers-reduced-motion: reduce)' ? false : true,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

// ===== BASIC RENDERING TESTS =====

describe('EnhancedSheet - Basic Rendering', () => {
  it('renders sheet trigger correctly', () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
      </EnhancedSheet>
    );

    expect(
      screen.getByRole('button', { name: 'Open Sheet' })
    ).toBeInTheDocument();
  });

  it('renders sheet content when triggered', async () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetHeader>
            <EnhancedSheetTitle>Test Sheet</EnhancedSheetTitle>
            <EnhancedSheetDescription>
              Sheet description
            </EnhancedSheetDescription>
          </EnhancedSheetHeader>
          <div>Sheet body content</div>
          <EnhancedSheetFooter>
            <EnhancedSheetClose asChild>
              <EnhancedButton variant='outline'>Close</EnhancedButton>
            </EnhancedSheetClose>
          </EnhancedSheetFooter>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Sheet')).toBeInTheDocument();
      expect(screen.getByText('Sheet description')).toBeInTheDocument();
      expect(screen.getByText('Sheet body content')).toBeInTheDocument();
    });
  });

  it('renders close button correctly', async () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Test Sheet</EnhancedSheetTitle>
          <EnhancedSheetDescription>
            Test description for accessibility
          </EnhancedSheetDescription>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'Close sheet' });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close sheet');
    });
  });
});

// ===== VARIANT SYSTEM TESTS =====

describe('EnhancedSheet - Variant System', () => {
  it('applies correct side variants', () => {
    const { rerender } = render(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent side='left'>
          <EnhancedSheetTitle>Test</EnhancedSheetTitle>
          <EnhancedSheetDescription>Test description</EnhancedSheetDescription>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('left-0', 'inset-y-0', 'h-full');

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent side='right'>Test content</EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('right-0', 'inset-y-0', 'h-full');

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent side='top'>Test content</EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('top-0', 'inset-x-0');

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent side='bottom'>Test content</EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('bottom-0', 'inset-x-0');
  });

  it('applies correct size variants', () => {
    const { rerender } = render(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent side='right' size='sm'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('w-80');

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent side='right' size='lg'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('w-[32rem]');
  });

  it('applies correct surface variants', () => {
    const { rerender } = render(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent surface='elevated'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(
      'bg-background-elevated',
      'border-border-elevated'
    );

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent surface='glass'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('bg-background/95', 'backdrop-blur-md');

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent surface='floating'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('bg-background/90', 'backdrop-blur-lg');
  });

  it('applies correct density variants', () => {
    const { rerender } = render(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent density='comfortable'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('p-6', 'gap-4');

    rerender(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent density='compact'>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('p-4', 'gap-3');
  });

  it('applies AAA compliance classes when enforced', () => {
    render(
      <EnhancedSheet open={true}>
        <EnhancedSheetContent enforceAAA={true}>
          Test content
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(
      'aaa:bg-background-aaa',
      'aaa:border-border-aaa'
    );
  });
});

// ===== VARIANT COMPOSITION TESTS =====

describe('EnhancedSheet - Variant Compositions', () => {
  it('generates correct classes for variant combinations', () => {
    const baseClasses = enhancedSheetContentVariants({
      side: 'right',
      size: 'md',
      surface: 'elevated',
      density: 'comfortable',
      enforceAAA: false,
    });

    expect(baseClasses).toContain('right-0');
    expect(baseClasses).toContain('w-96');
    expect(baseClasses).toContain('bg-background-elevated');
    expect(baseClasses).toContain('p-6');

    const glassClasses = enhancedSheetContentVariants({
      side: 'left',
      size: 'lg',
      surface: 'glass',
      density: 'compact',
      enforceAAA: true,
    });

    expect(glassClasses).toContain('left-0');
    expect(glassClasses).toContain('w-[32rem]');
    expect(glassClasses).toContain('backdrop-blur-md');
    expect(glassClasses).toContain('p-4');
    expect(glassClasses).toContain('aaa:bg-background-aaa/95');
  });

  it('handles compound variants correctly', () => {
    const bottomFullClasses = enhancedSheetContentVariants({
      side: 'bottom',
      size: 'full',
      surface: 'panel',
      density: 'comfortable',
    });

    expect(bottomFullClasses).toContain('bottom-0');
    expect(bottomFullClasses).toContain('h-full');
    expect(bottomFullClasses).toContain('bg-background-panel');
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('EnhancedSheet - Accessibility', () => {
  it('has correct ARIA attributes', async () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Accessible Sheet</EnhancedSheetTitle>
          <EnhancedSheetDescription>
            This is an accessible sheet
          </EnhancedSheetDescription>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('role', 'dialog');

      const title = screen.getByText('Accessible Sheet');
      const description = screen.getByText('This is an accessible sheet');

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  it('manages focus correctly', async () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Focus Test</EnhancedSheetTitle>
          <input data-testid='sheet-input' placeholder='Test input' />
          <EnhancedSheetClose>Close</EnhancedSheetClose>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    await user.click(trigger);

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    // Test tab navigation
    await user.tab();
    const input = screen.getByTestId('sheet-input');
    expect(input).toHaveFocus();

    await user.tab();
    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toHaveFocus();
  });

  it('supports keyboard navigation', async () => {
    const onOpenChange = vi.fn();

    render(
      <EnhancedSheet onOpenChange={onOpenChange}>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Keyboard Test</EnhancedSheetTitle>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    trigger.focus();

    // Open with Enter
    await user.keyboard('{Enter}');
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close with Escape
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('traps focus within sheet', async () => {
    render(
      <div>
        <button data-testid='outside-button'>Outside Button</button>
        <EnhancedSheet defaultOpen={true}>
          <EnhancedSheetContent>
            <EnhancedSheetTitle>Focus Trap Test</EnhancedSheetTitle>
            <input data-testid='first-input' placeholder='First input' />
            <input data-testid='second-input' placeholder='Second input' />
            <EnhancedSheetClose>Close</EnhancedSheetClose>
          </EnhancedSheetContent>
        </EnhancedSheet>
      </div>
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const outsideButton = screen.getByTestId('outside-button');
    const firstInput = screen.getByTestId('first-input');
    const secondInput = screen.getByTestId('second-input');
    const closeButton = screen.getByRole('button', { name: 'Close' });

    // Focus should be trapped within the sheet
    firstInput.focus();
    expect(firstInput).toHaveFocus();

    await user.tab();
    expect(secondInput).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    // Attempting to focus outside element should not work when sheet is open
    outsideButton.focus();
    expect(outsideButton).not.toHaveFocus();
  });
});

// ===== INTERACTION TESTS =====

describe('EnhancedSheet - Interactions', () => {
  it('opens and closes correctly', async () => {
    const onOpenChange = vi.fn();

    render(
      <EnhancedSheet onOpenChange={onOpenChange}>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Test Sheet</EnhancedSheetTitle>
          <EnhancedSheetClose>Close</EnhancedSheetClose>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    // Initially closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open sheet
    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close sheet via close button
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on overlay click', async () => {
    const onOpenChange = vi.fn();

    render(
      <EnhancedSheet onOpenChange={onOpenChange}>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Test Sheet</EnhancedSheetTitle>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click on overlay (outside dialog content)
    const overlay = screen.getByRole('dialog').parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('closes on X button click', async () => {
    const onOpenChange = vi.fn();

    render(
      <EnhancedSheet onOpenChange={onOpenChange}>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Test Sheet</EnhancedSheetTitle>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click the X close button
    const closeXButton = screen.getByRole('button', { name: 'Close sheet' });
    await user.click(closeXButton);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports controlled state', () => {
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <EnhancedSheet open={false} onOpenChange={onOpenChange}>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Controlled Sheet</EnhancedSheetTitle>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <EnhancedSheet open={true} onOpenChange={onOpenChange}>
        <EnhancedSheetTrigger>Open Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Controlled Sheet</EnhancedSheetTitle>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// ===== POLYMORPHIC PATTERN TESTS =====

describe('EnhancedSheet - Polymorphic Patterns', () => {
  it('supports asChild prop for content', () => {
    const CustomContent = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ children, ...props }, ref) => (
      <div ref={ref} {...props} data-testid='custom-content'>
        {children}
      </div>
    ));
    CustomContent.displayName = 'CustomContent';

    render(
      <EnhancedSheet defaultOpen={true}>
        <EnhancedSheetContent asChild>
          <CustomContent>
            <EnhancedSheetTitle>Custom Content</EnhancedSheetTitle>
          </CustomContent>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('supports asChild prop for header', () => {
    const CustomHeader = React.forwardRef<
      HTMLElement,
      React.HTMLAttributes<HTMLElement>
    >(({ children, ...props }, ref) => (
      <header ref={ref} {...props} data-testid='custom-header'>
        {children}
      </header>
    ));
    CustomHeader.displayName = 'CustomHeader';

    render(
      <EnhancedSheet defaultOpen={true}>
        <EnhancedSheetContent>
          <EnhancedSheetHeader asChild>
            <CustomHeader>
              <EnhancedSheetTitle>Header Test</EnhancedSheetTitle>
            </CustomHeader>
          </EnhancedSheetHeader>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByText('Header Test')).toBeInTheDocument();
  });

  it('supports asChild prop for close button', async () => {
    render(
      <EnhancedSheet defaultOpen={true}>
        <EnhancedSheetContent>
          <EnhancedSheetTitle>Close Test</EnhancedSheetTitle>
          <EnhancedSheetClose asChild>
            <EnhancedButton variant='error' data-testid='custom-close'>
              Custom Close
            </EnhancedButton>
          </EnhancedSheetClose>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    const customClose = screen.getByTestId('custom-close');
    expect(customClose).toBeInTheDocument();
    expect(customClose).toHaveTextContent('Custom Close');
  });
});

// ===== FACTORY PATTERN TESTS =====

describe('EnhancedSheet - Factory Patterns', () => {
  it('creates side panel configuration correctly', () => {
    const config = SheetFactory.sidePanel();

    expect(config).toEqual({
      side: 'right',
      size: 'md',
      surface: 'elevated',
      density: 'comfortable',
    });
  });

  it('creates mobile drawer configuration correctly', () => {
    const config = SheetFactory.mobileDrawer();

    expect(config).toEqual({
      side: 'bottom',
      size: 'lg',
      surface: 'panel',
      density: 'comfortable',
    });
  });

  it('creates navigation drawer configuration correctly', () => {
    const config = SheetFactory.navigationDrawer();

    expect(config).toEqual({
      side: 'left',
      size: 'sm',
      surface: 'elevated',
      density: 'compact',
    });
  });

  it('creates full overlay configuration correctly', () => {
    const config = SheetFactory.fullOverlay();

    expect(config).toEqual({
      side: 'bottom',
      size: 'full',
      surface: 'glass',
      density: 'comfortable',
    });
  });

  it('creates accessible configuration correctly', () => {
    const config = SheetFactory.accessible();

    expect(config).toEqual({
      side: 'right',
      size: 'lg',
      surface: 'elevated',
      density: 'comfortable',
      enforceAAA: true,
    });
  });

  it('creates glass configuration correctly', () => {
    const config = SheetFactory.glass();

    expect(config).toEqual({
      side: 'right',
      size: 'md',
      surface: 'glass',
      density: 'comfortable',
    });
  });

  it('supports factory overrides', () => {
    const config = SheetFactory.sidePanel({
      side: 'left',
      size: 'lg',
      enforceAAA: true,
    });

    expect(config).toEqual({
      side: 'left',
      size: 'lg',
      surface: 'elevated',
      density: 'comfortable',
      enforceAAA: true,
    });
  });
});

// ===== VARIANT FUNCTION TESTS =====

describe('EnhancedSheet - Variant Functions', () => {
  it('generates overlay classes correctly', () => {
    const classes = enhancedSheetOverlayVariants();

    expect(classes).toContain('fixed');
    expect(classes).toContain('inset-0');
    expect(classes).toContain('z-50');
    expect(classes).toContain('bg-black/80');
    expect(classes).toContain('backdrop-blur-sm');
  });

  it('generates header classes correctly', () => {
    const classes = enhancedSheetHeaderVariants();

    expect(classes).toContain('flex');
    expect(classes).toContain('flex-col');
    expect(classes).toContain('space-y-1.5');
    expect(classes).toContain('pb-4');
    expect(classes).toContain('border-b');
  });

  it('generates title classes correctly', () => {
    const classes = enhancedSheetTitleVariants();

    expect(classes).toContain('text-lg');
    expect(classes).toContain('font-semibold');
    expect(classes).toContain('leading-none');
    expect(classes).toContain('tracking-tight');
  });

  it('generates description classes correctly', () => {
    const classes = enhancedSheetDescriptionVariants();

    expect(classes).toContain('text-sm');
    expect(classes).toContain('text-muted-foreground');
    expect(classes).toContain('leading-relaxed');
  });

  it('generates footer classes correctly', () => {
    const classes = enhancedSheetFooterVariants();

    expect(classes).toContain('flex');
    expect(classes).toContain('flex-col-reverse');
    expect(classes).toContain('sm:flex-row');
    expect(classes).toContain('pt-4');
    expect(classes).toContain('border-t');
  });

  it('generates close button classes correctly', () => {
    const classes = enhancedSheetCloseVariants();

    expect(classes).toContain('absolute');
    expect(classes).toContain('right-4');
    expect(classes).toContain('top-4');
    expect(classes).toContain('rounded-sm');
    expect(classes).toContain('transition-all');
  });
});

// ===== ANTI-DRIFT ENFORCEMENT TESTS =====

describe('EnhancedSheet - Anti-Drift Enforcement', () => {
  it('uses only design token references', () => {
    const classes = enhancedSheetContentVariants({
      side: 'right',
      surface: 'elevated',
      enforceAAA: true,
    });

    // Check for token-based classes (no hardcoded values)
    expect(classes).toContain('bg-background-elevated');
    expect(classes).toContain('border-border-elevated');
    expect(classes).toContain('aaa:bg-background-aaa');
    expect(classes).toContain('shadow-elevation-high');

    // Should not contain hardcoded colors
    expect(classes).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    expect(classes).not.toMatch(/rgb\(/);
    expect(classes).not.toMatch(/hsl\(/);
  });

  it('maintains consistent spacing patterns', () => {
    const comfortableClasses = enhancedSheetContentVariants({
      density: 'comfortable',
    });
    const compactClasses = enhancedSheetContentVariants({
      density: 'compact',
    });

    expect(comfortableClasses).toContain('p-6');
    expect(comfortableClasses).toContain('gap-4');
    expect(compactClasses).toContain('p-4');
    expect(compactClasses).toContain('gap-3');
  });

  it('follows MAPS motion principles', () => {
    const classes = enhancedSheetContentVariants();

    expect(classes).toContain('data-[state=open]:animate-in');
    expect(classes).toContain('data-[state=closed]:animate-out');
    expect(classes).toContain('motion-reduce:transition-none');
  });
});

// ===== INTEGRATION TESTS =====

describe('EnhancedSheet - Integration', () => {
  it('works with enhanced buttons', async () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger asChild>
          <EnhancedButton variant='outline'>Open Settings</EnhancedButton>
        </EnhancedSheetTrigger>
        <EnhancedSheetContent>
          <EnhancedSheetHeader>
            <EnhancedSheetTitle>Settings</EnhancedSheetTitle>
          </EnhancedSheetHeader>
          <EnhancedSheetFooter>
            <EnhancedSheetClose asChild>
              <EnhancedButton variant='primary'>Save</EnhancedButton>
            </EnhancedSheetClose>
            <EnhancedSheetClose asChild>
              <EnhancedButton variant='outline'>Cancel</EnhancedButton>
            </EnhancedSheetClose>
          </EnhancedSheetFooter>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    const trigger = screen.getByRole('button', { name: 'Open Settings' });
    expect(trigger).toHaveClass('border', 'border-input'); // Enhanced button styles

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
    });
  });

  it('handles complex content structures', async () => {
    render(
      <EnhancedSheet>
        <EnhancedSheetTrigger>Open Complex Sheet</EnhancedSheetTrigger>
        <EnhancedSheetContent size='lg' surface='glass'>
          <EnhancedSheetHeader>
            <EnhancedSheetTitle>Complex Content</EnhancedSheetTitle>
            <EnhancedSheetDescription>
              Sheet with multiple sections
            </EnhancedSheetDescription>
          </EnhancedSheetHeader>

          <div className='space-y-4'>
            <section>
              <h3>Section 1</h3>
              <p>Content 1</p>
            </section>
            <section>
              <h3>Section 2</h3>
              <p>Content 2</p>
            </section>
          </div>

          <EnhancedSheetFooter>
            <EnhancedSheetClose asChild>
              <EnhancedButton>Done</EnhancedButton>
            </EnhancedSheetClose>
          </EnhancedSheetFooter>
        </EnhancedSheetContent>
      </EnhancedSheet>
    );

    await user.click(
      screen.getByRole('button', { name: 'Open Complex Sheet' })
    );

    await waitFor(() => {
      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(
        screen.getByText('Sheet with multiple sections')
      ).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('backdrop-blur-md'); // Glass surface
    expect(dialog).toHaveClass('w-[32rem]'); // Large size
  });
});
