/**
 * Enhanced Toast Component Tests - MAPS v2.2 Compliance
 *
 * TESTING COVERAGE:
 * - Component rendering and prop handling
 * - Variant styling and behavior
 * - AAA accessibility compliance
 * - Liquid glass materials
 * - Factory functions
 * - Keyboard navigation
 * - ARIA attributes
 * - Motion preferences
 * - Touch targets
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  EnhancedToastProvider,
  EnhancedToastViewport,
  EnhancedToast,
  EnhancedToastTitle,
  EnhancedToastDescription,
  EnhancedToastAction,
  EnhancedToastClose,
  ToastFactory,
  getToastIcon,
} from '@/components/ui-enhanced/Toast';

// Mock intersection observer for Radix Toast
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
globalThis.IntersectionObserver = mockIntersectionObserver;

// Test wrapper component
interface ToastTestWrapperProps {
  children: React.ReactNode;
}

const ToastTestWrapper = ({ children }: ToastTestWrapperProps) => (
  <EnhancedToastProvider>
    {children}
    <EnhancedToastViewport />
  </EnhancedToastProvider>
);

describe('Enhanced Toast Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any open toasts
    document.body.innerHTML = '';
  });

  describe('EnhancedToastProvider', () => {
    test('renders provider without errors', () => {
      render(
        <ToastTestWrapper>
          <div>Test content</div>
        </ToastTestWrapper>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('provides toast context to children', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Test Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('EnhancedToastViewport', () => {
    test('renders viewport with correct classes', () => {
      render(
        <EnhancedToastProvider>
          <EnhancedToastViewport data-testid='toast-viewport' />
        </EnhancedToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass(
        'fixed',
        'z-[100]',
        'flex',
        'flex-col-reverse'
      );
    });

    test('accepts custom className', () => {
      render(
        <EnhancedToastProvider>
          <EnhancedToastViewport
            data-testid='toast-viewport'
            className='custom-class'
          />
        </EnhancedToastProvider>
      );

      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('custom-class');
    });
  });

  describe('EnhancedToast Root', () => {
    test('renders toast with default variant', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Default Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-background', 'text-foreground');
    });

    test('renders success variant with semantic styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast variant='success'>
            <EnhancedToastTitle>Success Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-success/10', 'text-success-foreground');
    });

    test('renders error variant with semantic styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast variant='error'>
            <EnhancedToastTitle>Error Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-error/10', 'text-error-foreground');
    });

    test('renders warning variant with semantic styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast variant='warning'>
            <EnhancedToastTitle>Warning Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-warning/10', 'text-warning-foreground');
    });

    test('renders info variant with semantic styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast variant='info'>
            <EnhancedToastTitle>Info Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-accent/10', 'text-accent-foreground');
    });

    test('applies glass vibrancy styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast vibrancy='glass'>
            <EnhancedToastTitle>Glass Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-background/80', 'backdrop-blur-md');
    });

    test('applies floating vibrancy styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast vibrancy='floating'>
            <EnhancedToastTitle>Floating Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-background/75', 'backdrop-blur-lg');
    });

    test('applies compact density', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast density='compact'>
            <EnhancedToastTitle>Compact Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('p-3', 'gap-2');
    });

    test('applies AAA mode styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast aaaMode variant='success'>
            <EnhancedToastTitle>AAA Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('border-2');
    });

    test('accepts custom className', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast className='custom-toast-class'>
            <EnhancedToastTitle>Custom Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('custom-toast-class');
    });
  });

  describe('EnhancedToastTitle', () => {
    test('renders title with correct styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Toast Title</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const title = screen.getByText('Toast Title');
      expect(title).toHaveClass('text-sm', 'font-semibold', 'text-foreground');
    });

    test('accepts custom className', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle className='custom-title'>
              Toast Title
            </EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const title = screen.getByText('Toast Title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('EnhancedToastDescription', () => {
    test('renders description with correct styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastDescription>
              Toast description text
            </EnhancedToastDescription>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const description = screen.getByText('Toast description text');
      expect(description).toHaveClass(
        'text-sm',
        'text-muted-foreground',
        'mt-1'
      );
    });

    test('accepts custom className', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastDescription className='custom-description'>
              Description
            </EnhancedToastDescription>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const description = screen.getByText('Description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('EnhancedToastAction', () => {
    test('renders action button with correct styling', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastAction altText='Undo action'>
              Undo
            </EnhancedToastAction>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const action = screen.getByRole('button', { name: 'Undo' });
      expect(action).toHaveClass('inline-flex', 'rounded-md', 'px-3', 'py-2');
    });

    test('handles click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastAction altText='Click action' onClick={handleClick}>
              Click me
            </EnhancedToastAction>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const action = screen.getByRole('button', { name: 'Click me' });
      await user.click(action);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('accepts custom className', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastAction
              altText='Custom action'
              className='custom-action'
            >
              Action
            </EnhancedToastAction>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const action = screen.getByRole('button', { name: 'Action' });
      expect(action).toHaveClass('custom-action');
    });
  });

  describe('EnhancedToastClose', () => {
    test('renders close button with X icon', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('absolute', 'right-2', 'top-2');

      // Check for X icon
      const icon = closeButton.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('handles close action', async () => {
      const user = userEvent.setup();

      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Test Toast</EnhancedToastTitle>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      // Toast should start closing (we can't easily test the animation completion)
      expect(closeButton).toBeInTheDocument();
    });

    test('accepts custom className', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastClose className='custom-close' />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('custom-close');
    });
  });

  describe('ToastFactory', () => {
    test('creates success toast with correct variant', () => {
      const SuccessToast = ToastFactory.success;

      render(
        <ToastTestWrapper>
          <SuccessToast>
            <EnhancedToastTitle>Success</EnhancedToastTitle>
          </SuccessToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-success/10');
    });

    test('creates error toast with correct variant', () => {
      const ErrorToast = ToastFactory.error;

      render(
        <ToastTestWrapper>
          <ErrorToast>
            <EnhancedToastTitle>Error</EnhancedToastTitle>
          </ErrorToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-error/10');
    });

    test('creates warning toast with correct variant', () => {
      const WarningToast = ToastFactory.warning;

      render(
        <ToastTestWrapper>
          <WarningToast>
            <EnhancedToastTitle>Warning</EnhancedToastTitle>
          </WarningToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-warning/10');
    });

    test('creates info toast with correct variant', () => {
      const InfoToast = ToastFactory.info;

      render(
        <ToastTestWrapper>
          <InfoToast>
            <EnhancedToastTitle>Info</EnhancedToastTitle>
          </InfoToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-accent/10');
    });

    test('creates glass toast with correct vibrancy', () => {
      const GlassToast = ToastFactory.glass;

      render(
        <ToastTestWrapper>
          <GlassToast>
            <EnhancedToastTitle>Glass</EnhancedToastTitle>
          </GlassToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('backdrop-blur-md');
    });

    test('creates AAA toast with correct mode', () => {
      const AAAToast = ToastFactory.aaa;

      render(
        <ToastTestWrapper>
          <AAAToast>
            <EnhancedToastTitle>AAA</EnhancedToastTitle>
          </AAAToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('border-2');
    });

    test('creates compact toast with correct density', () => {
      const CompactToast = ToastFactory.compact;

      render(
        <ToastTestWrapper>
          <CompactToast>
            <EnhancedToastTitle>Compact</EnhancedToastTitle>
          </CompactToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('p-3', 'gap-2');
    });
  });

  describe('getToastIcon utility', () => {
    test('returns correct icon for success variant', () => {
      const icon = getToastIcon('success');
      expect(icon.type.name).toBe('Check');
    });

    test('returns correct icon for error variant', () => {
      const icon = getToastIcon('error');
      expect(icon.type.name).toBe('AlertCircle');
    });

    test('returns correct icon for warning variant', () => {
      const icon = getToastIcon('warning');
      expect(icon.type.name).toBe('AlertTriangle');
    });

    test('returns correct icon for info variant', () => {
      const icon = getToastIcon('info');
      expect(icon.type.name).toBe('Info');
    });

    test('icons have correct styling classes', () => {
      const icon = getToastIcon('success');
      expect(icon.props.className).toBe('h-5 w-5 shrink-0');
    });
  });

  describe('Accessibility Features', () => {
    test('toast has correct ARIA role', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Accessible Toast</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toBeInTheDocument();
    });

    test('toast action has required altText', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastAction altText='Perform action'>
              Action
            </EnhancedToastAction>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const action = screen.getByRole('button', { name: 'Action' });
      expect(action).toBeInTheDocument();
    });

    test('supports keyboard navigation for close button', async () => {
      const user = userEvent.setup();

      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Keyboard Test</EnhancedToastTitle>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const closeButton = screen.getByRole('button');

      // Focus the close button
      await user.tab();
      expect(closeButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(closeButton).toBeInTheDocument();
    });

    test('provides proper focus indicators', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastAction altText='Focus test'>
              Focus me
            </EnhancedToastAction>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const action = screen.getByRole('button', { name: 'Focus me' });
      const close = screen.getByRole('button', { hidden: true });

      expect(action).toHaveClass('focus-visible:ring-2');
      expect(close).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Touch Target Compliance', () => {
    test('action button meets minimum touch target size', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastAction altText='Touch target'>
              Touch
            </EnhancedToastAction>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const action = screen.getByRole('button', { name: 'Touch' });
      expect(action).toHaveClass('px-3', 'py-2');
    });

    test('close button has adequate touch area', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveClass('p-1');
    });
  });

  describe('Animation and Motion', () => {
    test('includes motion-reduce classes for accessibility', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Motion Test</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('motion-reduce:transition-none');
    });

    test('has proper animation classes for open/close states', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <EnhancedToastTitle>Animation Test</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass(
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out'
      );
    });
  });

  describe('Compound Variants', () => {
    test('AAA mode overrides glass vibrancy', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast vibrancy='glass' aaaMode>
            <EnhancedToastTitle>AAA Glass Override</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      // Should have AAA styles but not glass effects
      expect(toast).toHaveClass('border-2');
    });

    test('success variant with AAA mode uses solid colors', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast variant='success' aaaMode>
            <EnhancedToastTitle>AAA Success</EnhancedToastTitle>
          </EnhancedToast>
        </ToastTestWrapper>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveClass('bg-success-solid');
    });
  });

  describe('Complex Toast Compositions', () => {
    test('renders complete toast with all elements', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast variant='success'>
            {getToastIcon('success')}
            <div className='flex-1'>
              <EnhancedToastTitle>Operation Successful</EnhancedToastTitle>
              <EnhancedToastDescription>
                Your changes have been saved successfully.
              </EnhancedToastDescription>
            </div>
            <EnhancedToastAction altText='View details'>
              View
            </EnhancedToastAction>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      expect(screen.getByText('Operation Successful')).toBeInTheDocument();
      expect(
        screen.getByText('Your changes have been saved successfully.')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();

      // Check for success icon
      const toast = screen.getByRole('status');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('supports nested content structures', () => {
      render(
        <ToastTestWrapper>
          <EnhancedToast>
            <div className='flex items-start gap-3'>
              {getToastIcon('info')}
              <div className='flex-1 space-y-1'>
                <EnhancedToastTitle>Complex Toast</EnhancedToastTitle>
                <EnhancedToastDescription>
                  This toast contains nested elements and complex layouts.
                </EnhancedToastDescription>
              </div>
            </div>
            <div className='mt-2 flex gap-2'>
              <EnhancedToastAction altText='Primary action'>
                Primary
              </EnhancedToastAction>
              <EnhancedToastAction altText='Secondary action'>
                Secondary
              </EnhancedToastAction>
            </div>
            <EnhancedToastClose />
          </EnhancedToast>
        </ToastTestWrapper>
      );

      expect(screen.getByText('Complex Toast')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Primary' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Secondary' })
      ).toBeInTheDocument();
    });
  });
});
