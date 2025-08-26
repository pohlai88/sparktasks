import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  EnhancedAlertDialog,
  enhancedAlertDialogContentVariants,
  enhancedAlertDialogOverlayVariants,
} from '../src/components/ui-enhanced/AlertDialog';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock window.matchMedia for viewport tests
const mockMatchMedia = vi.fn();
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
  mockMatchMedia.mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Enhanced AlertDialog - MAPS v2.2 Compliance', () => {
  describe('Core Functionality', () => {
    test('renders alert dialog with trigger and content', async () => {
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Alert Title</AlertDialogTitle>
              <AlertDialogDescription>Alert description</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      const trigger = screen.getByRole('button', { name: /open alert/i });
      expect(trigger).toBeInTheDocument();

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert description')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /continue/i })
      ).toBeInTheDocument();
    });

    test('handles action button click', async () => {
      const handleAction = vi.fn();
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleAction}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /confirm/i }));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    test('handles cancel button click', async () => {
      const handleCancel = vi.fn();
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Enhanced AlertDialog Component', () => {
    test('renders enhanced alert dialog with all props', async () => {
      const handleAction = vi.fn();
      const handleCancel = vi.fn();
      const user = userEvent.setup();

      render(
        <EnhancedAlertDialog
          trigger={<button>Enhanced Trigger</button>}
          title='Enhanced Alert'
          description='This is an enhanced alert dialog'
          actionLabel='Proceed'
          cancelLabel='Abort'
          onAction={handleAction}
          onCancel={handleCancel}
          variant='glass'
          size='lg'
        />
      );

      await user.click(
        screen.getByRole('button', { name: /enhanced trigger/i })
      );

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      expect(screen.getByText('Enhanced Alert')).toBeInTheDocument();
      expect(
        screen.getByText('This is an enhanced alert dialog')
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /proceed/i }));
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    test('renders with destructive variant', async () => {
      const user = userEvent.setup();

      render(
        <EnhancedAlertDialog
          trigger={<button>Delete</button>}
          title='Delete Item'
          description='This action cannot be undone'
          actionLabel='Delete'
          variant='destructive'
        />
      );

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        const dialog = screen.getByRole('alertdialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveClass('enhanced-alertdialog--destructive');
      });
    });

    test('supports different sizes', async () => {
      const user = userEvent.setup();

      render(
        <EnhancedAlertDialog
          trigger={<button>Small Alert</button>}
          title='Small Dialog'
          size='sm'
        />
      );

      await user.click(screen.getByRole('button', { name: /small alert/i }));

      await waitFor(() => {
        const dialog = screen.getByRole('alertdialog');
        expect(dialog).toHaveClass('enhanced-alertdialog--sm');
      });
    });
  });

  describe('Variant Styling', () => {
    test('applies default variant classes', () => {
      const classes = enhancedAlertDialogContentVariants({
        variant: 'default',
        size: 'default',
      });

      expect(classes).toContain('enhanced-alertdialog--default');
      expect(classes).toContain('enhanced-alertdialog--default-size');
    });

    test('applies glass variant classes', () => {
      const classes = enhancedAlertDialogContentVariants({
        variant: 'glass',
        size: 'lg',
      });

      expect(classes).toContain('enhanced-alertdialog--glass');
      expect(classes).toContain('enhanced-alertdialog--lg');
    });

    test('applies destructive variant classes', () => {
      const classes = enhancedAlertDialogContentVariants({
        variant: 'destructive',
        size: 'sm',
      });

      expect(classes).toContain('enhanced-alertdialog--destructive');
      expect(classes).toContain('enhanced-alertdialog--sm');
    });

    test('applies overlay variant classes', () => {
      const overlayClasses = enhancedAlertDialogOverlayVariants({
        variant: 'glass',
      });

      expect(overlayClasses).toContain('enhanced-alertdialog-overlay--glass');
    });
  });

  describe('Accessibility Compliance', () => {
    test('has proper ARIA attributes', async () => {
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Alert Title</AlertDialogTitle>
              <AlertDialogDescription>Alert description</AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        const dialog = screen.getByRole('alertdialog');
        expect(dialog).toHaveAttribute('role', 'alertdialog');
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(dialog).toHaveAttribute('aria-describedby');
      });
    });

    test('focuses action button by default', async () => {
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Alert Title</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        const actionButton = screen.getByRole('button', { name: /confirm/i });
        expect(actionButton).toHaveFocus();
      });
    });

    test('traps focus within dialog', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Outside Button</button>
          <AlertDialog>
            <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Alert Title</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      // Tab should cycle within dialog
      await user.tab();
      expect(screen.getByRole('button', { name: /cancel/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /confirm/i })).toHaveFocus();

      // Should not focus outside button
      const outsideButton = screen.getByRole('button', {
        name: /outside button/i,
      });
      expect(outsideButton).not.toHaveFocus();
    });

    test('closes on Escape key', async () => {
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Alert Title</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      });
    });

    test('passes accessibility audit', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accessible Alert</AlertDialogTitle>
              <AlertDialogDescription>
                This alert follows accessibility guidelines
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports Enter key on action button', async () => {
      const handleAction = vi.fn();
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleAction}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      const actionButton = screen.getByRole('button', { name: /confirm/i });
      actionButton.focus();
      await user.keyboard('{Enter}');

      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    test('supports Space key on cancel button', async () => {
      const handleCancel = vi.fn();
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.focus();
      await user.keyboard(' ');

      expect(handleCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Props and Configuration', () => {
    test('forwards custom props to content', async () => {
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent
            data-testid='custom-dialog'
            className='custom-class'
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Custom Alert</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        const dialog = screen.getByTestId('custom-dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveClass('custom-class');
      });
    });

    test('supports ref forwarding', async () => {
      const ref = vi.fn();
      const user = userEvent.setup();

      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent ref={ref}>
            <AlertDialogHeader>
              <AlertDialogTitle>Ref Test</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      await user.click(screen.getByRole('button', { name: /open alert/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
      });
    });

    test('handles controlled state', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      const ControlledDialog = () => {
        const [open, setOpen] = React.useState(false);

        const handleChange = (newOpen: boolean) => {
          setOpen(newOpen);
          handleOpenChange(newOpen);
        };

        return (
          <div>
            <button onClick={() => setOpen(true)}>External Open</button>
            <AlertDialog open={open} onOpenChange={handleChange}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Controlled Dialog</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      };

      render(<ControlledDialog />);

      await user.click(screen.getByRole('button', { name: /external open/i }));

      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });

      await user.click(screen.getByRole('button', { name: /close/i }));

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Error Handling', () => {
    test('handles missing title gracefully', () => {
      expect(() => {
        render(
          <AlertDialog>
            <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  Description only
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        );
      }).not.toThrow();
    });

    test('handles empty content gracefully', () => {
      expect(() => {
        render(
          <AlertDialog>
            <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
            <AlertDialogContent />
          </AlertDialog>
        );
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('does not render content when closed', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle data-testid='dialog-title'>
                Hidden Content
              </AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(screen.queryByTestId('dialog-title')).not.toBeInTheDocument();
    });

    test('renders efficiently with multiple dialogs', () => {
      const { rerender } = render(
        <div>
          <AlertDialog>
            <AlertDialogTrigger>Dialog 1</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Dialog 1</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger>Dialog 2</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Dialog 2</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );

      // Should render without performance issues
      expect(
        screen.getByRole('button', { name: /dialog 1/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /dialog 2/i })
      ).toBeInTheDocument();

      // Rerender should be efficient
      rerender(
        <div>
          <AlertDialog>
            <AlertDialogTrigger>Updated Dialog 1</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Updated Dialog 1</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );

      expect(
        screen.getByRole('button', { name: /updated dialog 1/i })
      ).toBeInTheDocument();
    });
  });
});
