/**
 * Toast Component Tests - Enterprise-Grade Validation
 *
 * Comprehensive test suite for DESIGN_TOKENS V3.2 Toast component:
 * - All variants and positions
 * - Auto-dismiss and manual dismiss functionality
 * - Action button integration
 * - Enterprise features (priority, metadata, timestamps)
 * - Accessibility compliance (WCAG 2.1)
 * - Event handling and interactions
 * - Global imperative API
 * - Type safety and API contracts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Toast,
  ToastProvider,
  ToastContainer,
  useToast,
  toast,
  _resetToastManager,
} from '../../src/components/ui/Toast';
import '@testing-library/jest-dom';

// Mock timers for auto-dismiss testing
vi.useFakeTimers();

describe('Toast Component - Enterprise Grade', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    _resetToastManager(); // Reset global toast manager state
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  describe('Basic Rendering', () => {
    it('renders a simple toast message', () => {
      const mockDismiss = vi.fn();

      render(
        <Toast
          id='test-simple'
          variant='success'
          message='Simple test'
          onDismiss={mockDismiss}
        />
      );

      expect(screen.getByText('Simple test')).toBeInTheDocument();
    });
  });

  describe('Variant Rendering', () => {
    it('renders success variant with correct styling and icon', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-success'
          variant='success'
          message='Operation completed successfully!'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toBeInTheDocument();
      expect(toast).toHaveClass(
        'border-green-200',
        'bg-green-50',
        'text-green-900'
      );
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(
        screen.getByText('Operation completed successfully!')
      ).toBeInTheDocument();
    });

    it('renders error variant with correct styling and icon', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-error'
          variant='error'
          message='Something went wrong!'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveClass('border-red-200', 'bg-red-50', 'text-red-900');
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('renders warning variant with correct styling and icon', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-warning'
          variant='warning'
          message='Please be careful!'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveClass(
        'border-amber-200',
        'bg-amber-50',
        'text-amber-900'
      );
      expect(screen.getByText('Please be careful!')).toBeInTheDocument();
    });

    it('renders info variant with correct styling and icon', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-info'
          variant='info'
          message="Here's some information"
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveClass(
        'border-blue-200',
        'bg-blue-50',
        'text-blue-900'
      );
      expect(screen.getByText("Here's some information")).toBeInTheDocument();
    });
  });

  describe('Toast with Title and Message', () => {
    it('renders both title and message correctly', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-title'
          variant='success'
          title='Success!'
          message='Your changes have been saved.'
          onDismiss={mockDismiss}
        />
      );

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(
        screen.getByText('Your changes have been saved.')
      ).toBeInTheDocument();

      const message = screen.getByText('Your changes have been saved.');
      expect(message).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('toast-title-')
      );
    });

    it('renders message without title correctly', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-no-title'
          variant='info'
          message='Just a message without title'
          onDismiss={mockDismiss}
        />
      );

      expect(
        screen.getByText('Just a message without title')
      ).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('Auto-dismiss Functionality', () => {
    it('auto-dismisses after specified duration', async () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-auto-dismiss'
          variant='info'
          message='Auto dismiss test'
          duration={3000}
          onDismiss={mockDismiss}
        />
      );

      expect(mockDismiss).not.toHaveBeenCalled();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(3200); // 3000ms + 200ms animation
      });

      await waitFor(() => {
        expect(mockDismiss).toHaveBeenCalledWith('test-auto-dismiss');
      });
    });

    it('does not auto-dismiss when duration is null', async () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-persist'
          variant='warning'
          message='Persistent toast'
          duration={null}
          onDismiss={mockDismiss}
        />
      );

      act(() => {
        vi.advanceTimersByTime(10000); // Wait 10 seconds
      });

      expect(mockDismiss).not.toHaveBeenCalled();
    });

    it('pauses auto-dismiss on hover', async () => {
      const mockDismiss = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Toast
          id='test-hover-pause'
          variant='info'
          message='Hover to pause'
          duration={3000}
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      // Hover immediately to pause
      await act(async () => {
        await user.hover(toast);
      });

      // Wait longer than duration while hovered
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should not dismiss while hovered
      expect(mockDismiss).not.toHaveBeenCalled();

      // Unhover to resume countdown
      await act(async () => {
        await user.unhover(toast);
      });

      expect(mockDismiss).not.toHaveBeenCalled();

      // Unhover and then it should dismiss
      await user.unhover(toast);

      act(() => {
        vi.advanceTimersByTime(2200); // Remaining time + animation
      });

      await waitFor(() => {
        expect(mockDismiss).toHaveBeenCalledWith('test-hover-pause');
      });
    });
  });

  describe('Manual Dismiss Functionality', () => {
    it('dismisses when close button is clicked', async () => {
      const mockDismiss = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Toast
          id='test-manual-dismiss'
          variant='success'
          message='Manual dismiss test'
          onDismiss={mockDismiss}
        />
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss notification/i,
      });

      await act(async () => {
        await user.click(dismissButton);
      });

      await waitFor(
        () => {
          expect(mockDismiss).toHaveBeenCalledWith('test-manual-dismiss');
        },
        { timeout: 1000 }
      );
    });

    it('has proper accessibility for dismiss button', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-dismiss-a11y'
          variant='info'
          message='Accessibility test'
          onDismiss={mockDismiss}
        />
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss notification/i,
      });

      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toHaveAttribute(
        'aria-label',
        'Dismiss notification'
      );
    });
  });

  describe('Action Button Integration', () => {
    it('renders action button correctly', () => {
      const mockDismiss = vi.fn();
      const mockAction = vi.fn();

      render(
        <Toast
          id='test-action'
          variant='warning'
          message='Action required'
          action={{
            label: 'Take Action',
            onClick: mockAction,
          }}
          onDismiss={mockDismiss}
        />
      );

      const actionButton = screen.getByRole('button', { name: /take action/i });

      expect(actionButton).toBeInTheDocument();
      expect(actionButton).toHaveTextContent('Take Action');
    });

    it('calls action handler and dismisses toast', async () => {
      const mockDismiss = vi.fn();
      const mockAction = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Toast
          id='test-action-handler'
          variant='info'
          message='Action handler test'
          action={{
            label: 'Execute',
            onClick: mockAction,
          }}
          onDismiss={mockDismiss}
        />
      );

      const actionButton = screen.getByRole('button', { name: /execute/i });

      await act(async () => {
        await user.click(actionButton);
      });

      await waitFor(
        () => {
          expect(mockAction).toHaveBeenCalledTimes(1);
          expect(mockDismiss).toHaveBeenCalledWith('test-action-handler');
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Enterprise Features', () => {
    it('handles high priority toasts with assertive aria-live', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-high-priority'
          variant='error'
          message='High priority alert'
          priority='high'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveAttribute('aria-live', 'assertive');
    });

    it('handles normal priority toasts with polite aria-live', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-normal-priority'
          variant='info'
          message='Normal priority message'
          priority='normal'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('displays timestamp when provided', () => {
      const mockDismiss = vi.fn();
      const testTimestamp = new Date('2025-08-20T10:30:00');

      render(
        <Toast
          id='test-timestamp'
          variant='info'
          message='Message with timestamp'
          timestamp={testTimestamp}
          onDismiss={mockDismiss}
        />
      );

      expect(screen.getByText('10:30:00 AM')).toBeInTheDocument();
    });

    it('supports metadata for enterprise logging', () => {
      const mockDismiss = vi.fn();
      const metadata = {
        userId: '12345',
        action: 'file_upload',
        feature: 'document_management',
      };

      render(
        <Toast
          id='test-metadata'
          variant='success'
          message='Enterprise toast with metadata'
          metadata={metadata}
          onDismiss={mockDismiss}
        />
      );

      // Metadata should be included in the toast (not visible to user but accessible via props)
      const toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
    });
  });

  describe('Progress Indicator', () => {
    it('shows progress indicator for timed toasts', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-progress'
          variant='info'
          message='Progress indicator test'
          duration={5000}
          onDismiss={mockDismiss}
        />
      );

      const progressContainer = screen
        .getByRole('alert')
        .querySelector('.absolute.bottom-0');

      expect(progressContainer).toBeInTheDocument();
      expect(progressContainer).toHaveClass('h-1', 'bg-current', 'opacity-20');
    });

    it('does not show progress indicator for persistent toasts', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-no-progress'
          variant='warning'
          message='No progress indicator'
          duration={null}
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');
      const progressContainer = toast.querySelector('.absolute.bottom-0');

      expect(progressContainer).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper ARIA attributes', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-aria'
          variant='success'
          title='ARIA Test'
          message='Testing ARIA compliance'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveAttribute('role', 'alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });

    it('supports keyboard navigation for interactive elements', async () => {
      const mockDismiss = vi.fn();
      const mockAction = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Toast
          id='test-keyboard'
          variant='warning'
          message='Keyboard navigation test'
          action={{
            label: 'Action',
            onClick: mockAction,
          }}
          onDismiss={mockDismiss}
        />
      );

      const actionButton = screen.getByRole('button', { name: /action/i });
      const dismissButton = screen.getByRole('button', {
        name: /dismiss notification/i,
      });

      // Test keyboard navigation
      await act(async () => {
        await user.tab();
      });
      expect(actionButton).toHaveFocus();

      await act(async () => {
        await user.tab();
      });
      expect(dismissButton).toHaveFocus();

      // Test keyboard activation
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      await waitFor(
        () => {
          expect(mockDismiss).toHaveBeenCalledWith('test-keyboard');
        },
        { timeout: 1000 }
      );
    });

    it('respects motion reduction preferences', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-motion-reduction'
          variant='info'
          message='Motion reduction test'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      expect(toast).toHaveClass('motion-reduce:transition-none');
    });
  });

  describe('Token Integration', () => {
    it('uses design tokens instead of hardcoded classes', () => {
      const mockDismiss = vi.fn();
      render(
        <Toast
          id='test-tokens'
          variant='info'
          message='Design tokens test'
          onDismiss={mockDismiss}
        />
      );

      const toast = screen.getByRole('alert');

      // Should have base toast classes from design tokens
      expect(toast).toHaveClass(
        'group',
        'pointer-events-auto',
        'relative',
        'flex'
      );
      expect(toast).toHaveClass(
        'items-center',
        'justify-between',
        'overflow-hidden'
      );
      expect(toast).toHaveClass(
        'rounded-md',
        'border',
        'shadow-lg',
        'transition-all'
      );
    });
  });
});

describe('ToastContainer Component', () => {
  it('renders multiple toasts correctly', () => {
    const mockDismiss = vi.fn();
    const toasts = [
      {
        id: 'toast-1',
        variant: 'success' as const,
        message: 'First toast',
      },
      {
        id: 'toast-2',
        variant: 'error' as const,
        message: 'Second toast',
      },
    ];

    render(<ToastContainer toasts={toasts} onDismiss={mockDismiss} />);

    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
  });

  it('limits toasts to maxToasts prop', () => {
    const mockDismiss = vi.fn();
    const toasts = Array.from({ length: 10 }, (_, i) => ({
      id: `toast-${i}`,
      variant: 'info' as const,
      message: `Toast ${i}`,
    }));

    render(
      <ToastContainer toasts={toasts} maxToasts={3} onDismiss={mockDismiss} />
    );

    // Should only show first 3 toasts
    expect(screen.getByText('Toast 0')).toBeInTheDocument();
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.queryByText('Toast 3')).not.toBeInTheDocument();
  });

  it('renders nothing when no toasts provided', () => {
    const mockDismiss = vi.fn();

    const { container } = render(
      <ToastContainer toasts={[]} onDismiss={mockDismiss} />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('ToastProvider and useToast Hook', () => {
  it('provides toast context to child components', async () => {
    const TestComponent = () => {
      const { addToast, dismissAll } = useToast();

      return (
        <div>
          <button
            onClick={() =>
              addToast({
                variant: 'success',
                message: 'Context test toast',
              })
            }
          >
            Add Toast
          </button>
          <button onClick={dismissAll}>Dismiss All</button>
        </div>
      );
    };

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const addButton = screen.getByRole('button', { name: /add toast/i });

    await act(async () => {
      await user.click(addButton);
    });

    await waitFor(
      () => {
        expect(screen.getByText('Context test toast')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss all/i });

    await act(async () => {
      await user.click(dismissButton);
    });

    await waitFor(
      () => {
        expect(
          screen.queryByText('Context test toast')
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await waitFor(() => {
      expect(screen.queryByText('Context test toast')).not.toBeInTheDocument();
    });
  });

  it('throws error when useToast is used outside provider', () => {
    const TestComponent = () => {
      useToast(); // This should throw
      return <div>Test</div>;
    };

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });
});

describe('Global Imperative API', () => {
  beforeEach(() => {
    // Clear any existing toasts
    toast.dismissAll();
  });

  it('allows adding toasts imperatively', async () => {
    const TestComponent = () => {
      return (
        <div>
          <button onClick={() => toast.success('Imperative success!')}>
            Add Success Toast
          </button>
          <button onClick={() => toast.error('Imperative error!')}>
            Add Error Toast
          </button>
        </div>
      );
    };

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByRole('button', {
      name: /add success toast/i,
    });
    const errorButton = screen.getByRole('button', {
      name: /add error toast/i,
    });

    await act(async () => {
      await user.click(successButton);
    });

    await waitFor(
      () => {
        expect(screen.getByText('Imperative success!')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    await act(async () => {
      await user.click(errorButton);
    });

    await waitFor(
      () => {
        expect(screen.getByText('Imperative error!')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('supports all toast variants imperatively', async () => {
    render(
      <ToastProvider>
        <div />
      </ToastProvider>
    );

    act(() => {
      toast.success('Success message');
      toast.error('Error message');
      toast.warning('Warning message');
      toast.info('Info message');
    });

    await waitFor(
      () => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByText('Warning message')).toBeInTheDocument();
        expect(screen.getByText('Info message')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('supports imperative dismiss functionality', async () => {
    render(
      <ToastProvider>
        <div />
      </ToastProvider>
    );

    let toastId: string;
    act(() => {
      toastId = toast.success('Dismissible toast');
    });

    // Verify toast appears first
    await waitFor(
      () => {
        expect(screen.getByText('Dismissible toast')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    act(() => {
      toast.dismiss(toastId);
    });

    await waitFor(
      () => {
        expect(screen.queryByText('Dismissible toast')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('supports imperative dismiss all functionality', async () => {
    render(
      <ToastProvider>
        <div />
      </ToastProvider>
    );

    act(() => {
      toast.success('Toast 1');
      toast.error('Toast 2');
      toast.info('Toast 3');
    });

    // Verify toasts appear first
    await waitFor(
      () => {
        expect(screen.getByText('Toast 1')).toBeInTheDocument();
        expect(screen.getByText('Toast 2')).toBeInTheDocument();
        expect(screen.getByText('Toast 3')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    act(() => {
      toast.dismissAll();
    });

    await waitFor(
      () => {
        expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Toast 3')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});

describe('Toast Component Integration Tests', () => {
  it('works correctly in complex real-world scenarios', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    const ComplexComponent = () => {
      const { addToast } = useToast();

      const handleComplexAction = () => {
        // Simulate a complex workflow with multiple toasts
        addToast({
          variant: 'info',
          title: 'Processing...',
          message: 'Your request is being processed.',
          duration: 2000,
        });

        setTimeout(() => {
          addToast({
            variant: 'warning',
            title: 'Confirmation Required',
            message: 'Please confirm to continue.',
            action: {
              label: 'Confirm',
              onClick: () => {
                addToast({
                  variant: 'success',
                  title: 'Completed!',
                  message: 'Your action was completed successfully.',
                  priority: 'high',
                  duration: 5000,
                });
              },
            },
            duration: null,
          });
        }, 2000);
      };

      return (
        <button onClick={handleComplexAction}>Start Complex Action</button>
      );
    };

    render(
      <ToastProvider maxToasts={10}>
        <ComplexComponent />
      </ToastProvider>
    );

    const button = screen.getByRole('button', {
      name: /start complex action/i,
    });
    await user.click(button);

    // First toast should appear
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    // Fast-forward to show second toast
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Please confirm to continue.')
      ).toBeInTheDocument();
    });

    // Click confirm action
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText('Your action was completed successfully.')
      ).toBeInTheDocument();
    });
  });
});

describe('Performance and Memory Management', () => {
  it('cleans up timers properly on unmount', () => {
    const mockDismiss = vi.fn();

    const { unmount } = render(
      <Toast
        id='test-cleanup'
        variant='info'
        message='Cleanup test'
        duration={5000}
        onDismiss={mockDismiss}
      />
    );

    // Verify timer is running
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    // Unmount component
    unmount();

    // Advance time to see if timer was cleaned up
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // onDismiss should not be called after unmount
    expect(mockDismiss).not.toHaveBeenCalled();
  });

  it('handles rapid toast creation and dismissal efficiently', async () => {
    render(
      <ToastProvider maxToasts={5}>
        <div />
      </ToastProvider>
    );

    // Rapidly create many toasts
    act(() => {
      for (let i = 0; i < 20; i++) {
        toast.info(`Rapid toast ${i}`);
      }
    });

    // Wait for toasts to appear
    await waitFor(
      () => {
        expect(screen.getByText('Rapid toast 0')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Should only show first 5 toasts (maxToasts limit)
    expect(screen.getByText('Rapid toast 4')).toBeInTheDocument();
    expect(screen.queryByText('Rapid toast 5')).not.toBeInTheDocument();

    // Dismiss all
    act(() => {
      toast.dismissAll();
    });

    // All toasts should be gone
    await waitFor(
      () => {
        expect(screen.queryByText('Rapid toast 0')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
