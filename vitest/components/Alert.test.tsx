/**
 * Enhanced Alert Component Tests
 * 
 * Comprehensive test suite for the Alert component covering:
 * - Basic rendering and props
 * - Variant system (semantic, glass materials)
 * - Size system and responsive behavior
 * - Auto-close functionality with progress
 * - Dismissible behavior and interactions
 * - Icon system and customization
 * - Actions and content handling
 * - AAA compliance features
 * - Factory functions and utilities
 * - Accessibility patterns and ARIA attributes
 * - Edge cases and error handling
 * 
 * @version 2.2.0
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  EnhancedAlert,
  AlertFactory,
  createSuccessAlert,
  createErrorAlert,
  createWarningAlert,
  createInfoAlert,
  createNotificationAlert,
} from '../../src/components/ui-enhanced/Alert';

// Mock timers for auto-close testing
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('EnhancedAlert', () => {
  describe('Basic Rendering', () => {
    it('renders alert with default props', () => {
      render(<EnhancedAlert>Test alert content</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Test alert content');
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('renders with custom className', () => {
      render(<EnhancedAlert className="custom-alert">Content</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-alert');
    });

    it('forwards HTML attributes', () => {
      render(
        <EnhancedAlert data-testid="alert" id="test-alert">
          Content
        </EnhancedAlert>
      );
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('id', 'test-alert');
    });

    it('renders with proper component structure', () => {
      render(<EnhancedAlert>Test alert content</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert.tagName).toBe('DIV');
      expect(alert).toHaveTextContent('Test alert content');
    });
  });

  describe('Variant System', () => {
    it('renders default variant correctly', () => {
      render(<EnhancedAlert variant="default">Default alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-background', 'text-foreground');
    });

    it('renders destructive variant correctly', () => {
      render(<EnhancedAlert variant="destructive">Error alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
    });

    it('renders warning variant correctly', () => {
      render(<EnhancedAlert variant="warning">Warning alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-yellow-500/50', 'text-yellow-900');
    });

    it('renders success variant correctly', () => {
      render(<EnhancedAlert variant="success">Success alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-green-500/50', 'text-green-900');
    });

    it('renders info variant correctly', () => {
      render(<EnhancedAlert variant="info">Info alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-blue-500/50', 'text-blue-900');
    });

    it('renders glass variant correctly', () => {
      render(<EnhancedAlert variant="glass">Glass alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-white/10', 'backdrop-blur-md');
    });

    it('renders glass-destructive variant correctly', () => {
      render(<EnhancedAlert variant="glass-destructive">Glass error</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-500/10', 'backdrop-blur-md');
    });

    it('applies correct CSS classes for glass variants', () => {
      render(<EnhancedAlert variant="glass-success">Glass success</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(
        'bg-green-500/10',
        'backdrop-blur-md',
        'border-green-500/30'
      );
    });
  });

  describe('Size System', () => {
    it('renders sm size correctly', () => {
      render(<EnhancedAlert size="sm">Small alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('p-3', 'text-sm');
    });

    it('renders md size correctly', () => {
      render(<EnhancedAlert size="md">Medium alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('p-4', 'text-sm');
    });

    it('renders lg size correctly', () => {
      render(<EnhancedAlert size="lg">Large alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('p-6', 'text-base');
    });

    it('renders xl size correctly', () => {
      render(<EnhancedAlert size="xl">Extra large alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('p-8', 'text-lg');
    });
  });

  describe('Elevation System', () => {
    it('renders subtle elevation correctly', () => {
      render(<EnhancedAlert elevation="subtle">Subtle shadow</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('shadow-sm');
    });

    it('renders dramatic elevation correctly', () => {
      render(<EnhancedAlert elevation="dramatic">Dramatic shadow</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('shadow-xl');
    });
  });

  describe('Title and Description', () => {
    it('renders title when provided', () => {
      render(<EnhancedAlert title="Alert Title">Content</EnhancedAlert>);
      
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert Title')).toHaveClass('font-medium');
    });

    it('renders description when provided', () => {
      render(<EnhancedAlert description="Alert description">Content</EnhancedAlert>);
      
      expect(screen.getByText('Alert description')).toBeInTheDocument();
    });

    it('renders both title and description', () => {
      render(
        <EnhancedAlert title="Title" description="Description">
          Content
        </EnhancedAlert>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders children when no title or description', () => {
      render(<EnhancedAlert>Children content</EnhancedAlert>);
      
      expect(screen.getByText('Children content')).toBeInTheDocument();
    });
  });

  describe('Icon System', () => {
    it('renders default icon for destructive variant', () => {
      render(<EnhancedAlert variant="destructive">Error</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      const icon = alert.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-4', 'w-4');
    });

    it('renders default icon for success variant', () => {
      render(<EnhancedAlert variant="success">Success</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      const icon = alert.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      render(<EnhancedAlert icon={customIcon}>Content</EnhancedAlert>);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('icon overrides default variant icon', () => {
      const customIcon = <div data-testid="custom-icon">Custom</div>;
      render(
        <EnhancedAlert variant="destructive" icon={customIcon}>
          Content
        </EnhancedAlert>
      );
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Dismissible Behavior', () => {
    it('shows dismiss button when dismissible', () => {
      render(<EnhancedAlert dismissible>Dismissible alert</EnhancedAlert>);
      
      const dismissButton = screen.getByLabelText('Dismiss alert');
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toHaveAttribute('type', 'button');
    });

    it('calls onDismiss when dismiss button clicked', () => {
      const onDismiss = vi.fn();
      render(
        <EnhancedAlert dismissible onDismiss={onDismiss}>
          Content
        </EnhancedAlert>
      );
      
      const dismissButton = screen.getByLabelText('Dismiss alert');
      fireEvent.click(dismissButton);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('hides alert after dismiss', () => {
      render(<EnhancedAlert dismissible>Content</EnhancedAlert>);
      
      const dismissButton = screen.getByLabelText('Dismiss alert');
      fireEvent.click(dismissButton);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders custom close icon', () => {
      const customIcon = <span data-testid="custom-close">X</span>;
      render(
        <EnhancedAlert dismissible closeIcon={customIcon}>
          Content
        </EnhancedAlert>
      );
      
      expect(screen.getByTestId('custom-close')).toBeInTheDocument();
    });

    it('does not show dismiss button when not dismissible', () => {
      render(<EnhancedAlert>Content</EnhancedAlert>);
      
      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
    });
  });

  describe('Auto-close Functionality', () => {
    it('auto-closes after specified time', async () => {
      const onDismiss = vi.fn();
      render(
        <EnhancedAlert autoClose={1000} onDismiss={onDismiss}>
          Auto-close alert
        </EnhancedAlert>
      );
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('shows progress bar when showProgress is true', () => {
      render(
        <EnhancedAlert autoClose={1000} showProgress>
          Progress alert
        </EnhancedAlert>
      );
      
      const alert = screen.getByRole('alert');
      const progressBar = alert.querySelector('[style*="width"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('updates progress during auto-close countdown', () => {
      render(
        <EnhancedAlert autoClose={1000} showProgress>
          Progress alert
        </EnhancedAlert>
      );
      
      const alert = screen.getByRole('alert');
      const progressBar = alert.querySelector('[style*="width"]') as HTMLElement;
      
      // Initially at 100%
      expect(progressBar.style.width).toBe('100%');
      
      // Progress after 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      // Should be around 50% (allowing for timing variations)
      const width = parseFloat(progressBar.style.width);
      expect(width).toBeLessThan(60);
      expect(width).toBeGreaterThan(40);
    });

    it('cancels auto-close when manually dismissed', () => {
      const onDismiss = vi.fn();
      render(
        <EnhancedAlert autoClose={1000} dismissible onDismiss={onDismiss}>
          Content
        </EnhancedAlert>
      );
      
      const dismissButton = screen.getByLabelText('Dismiss alert');
      fireEvent.click(dismissButton);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
      
      // Advance time and verify onDismiss isn't called again
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Actions', () => {
    it('renders action buttons when provided', () => {
      const actions = (
        <div>
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      );
      
      render(<EnhancedAlert actions={actions}>Content</EnhancedAlert>);
      
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('positions actions correctly in layout', () => {
      const actions = <button data-testid="action-btn">Action</button>;
      render(<EnhancedAlert actions={actions}>Content</EnhancedAlert>);
      
      const actionButton = screen.getByTestId('action-btn');
      const container = actionButton.closest('.mt-3.flex.gap-2');
      expect(container).toBeInTheDocument();
    });
  });

  describe('AAA Compliance', () => {
    it('applies AAA compliance styling when enforceAAA is true', () => {
      render(<EnhancedAlert enforceAAA>AAA compliant</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('ring-2', 'ring-transparent');
    });

    it('applies AAA compliance for glass variants automatically', () => {
      render(<EnhancedAlert variant="glass">Glass alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('ring-2', 'ring-transparent');
    });

    it('enhances focus styles for AAA compliance', () => {
      render(<EnhancedAlert enforceAAA dismissible>Content</EnhancedAlert>);
      
      const dismissButton = screen.getByLabelText('Dismiss alert');
      expect(dismissButton).toHaveClass('focus:ring-offset-2');
    });
  });

  describe('Animation', () => {
    it('applies animation classes by default', () => {
      render(<EnhancedAlert>Animated alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('animate-in', 'fade-in-0');
    });

    it('does not apply animation when animate is false', () => {
      render(<EnhancedAlert animate={false}>Static alert</EnhancedAlert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).not.toHaveClass('animate-in');
    });
  });
});

describe('AlertFactory', () => {
  describe('Semantic Variants', () => {
    it('provides default factory', () => {
      const { Alert } = AlertFactory.default;
      render(<Alert>Default factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-background');
    });

    it('provides destructive factory', () => {
      const { Alert } = AlertFactory.destructive;
      render(<Alert>Destructive factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-destructive/50');
    });

    it('provides warning factory', () => {
      const { Alert } = AlertFactory.warning;
      render(<Alert>Warning factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-yellow-500/50');
    });

    it('provides success factory', () => {
      const { Alert } = AlertFactory.success;
      render(<Alert>Success factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-green-500/50');
    });

    it('provides info factory', () => {
      const { Alert } = AlertFactory.info;
      render(<Alert>Info factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('border-blue-500/50');
    });
  });

  describe('Glass Variants', () => {
    it('provides glass factory', () => {
      const { Alert } = AlertFactory.glass;
      render(<Alert>Glass factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-white/10', 'backdrop-blur-md');
    });

    it('provides glass-destructive factory', () => {
      const { Alert } = AlertFactory['glass-destructive'];
      render(<Alert>Glass destructive alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-500/10', 'backdrop-blur-md');
    });

    it('provides glass-success factory', () => {
      const { Alert } = AlertFactory['glass-success'];
      render(<Alert>Glass success alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-green-500/10', 'backdrop-blur-md');
    });
  });

  describe('Feature Variants', () => {
    it('provides dismissible factory', () => {
      const { Alert } = AlertFactory.dismissible;
      render(<Alert>Dismissible factory alert</Alert>);
      
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('provides auto-close factory', () => {
      const { Alert } = AlertFactory.autoClose;
      render(<Alert>Auto-close factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('provides AAA factory', () => {
      const { Alert } = AlertFactory.aaa;
      render(<Alert>AAA factory alert</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('ring-2', 'ring-transparent');
    });
  });
});

describe('Utility Functions', () => {
  describe('createSuccessAlert', () => {
    it('creates a success alert with title', () => {
      const alert = createSuccessAlert('Success!', 'Operation completed');
      render(alert);
      
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('border-green-500/50');
    });

    it('accepts additional props', () => {
      const alert = createSuccessAlert('Success!', undefined, { 
        className: 'custom-success',
        dismissible: true 
      });
      render(alert);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('custom-success');
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });
  });

  describe('createErrorAlert', () => {
    it('creates an error alert with title and description', () => {
      const alert = createErrorAlert('Error!', 'Something went wrong');
      render(alert);
      
      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('border-destructive/50');
    });
  });

  describe('createWarningAlert', () => {
    it('creates a warning alert', () => {
      const alert = createWarningAlert('Warning!', 'Please be careful');
      render(alert);
      
      expect(screen.getByText('Warning!')).toBeInTheDocument();
      expect(screen.getByText('Please be careful')).toBeInTheDocument();
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('border-yellow-500/50');
    });
  });

  describe('createInfoAlert', () => {
    it('creates an info alert', () => {
      const alert = createInfoAlert('Info', 'Here is some information');
      render(alert);
      
      expect(screen.getByText('Info')).toBeInTheDocument();
      expect(screen.getByText('Here is some information')).toBeInTheDocument();
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveClass('border-blue-500/50');
    });
  });

  describe('createNotificationAlert', () => {
    it('creates a dismissible auto-close alert', () => {
      const alert = createNotificationAlert('Notification', 'This will auto-close');
      render(alert);
      
      expect(screen.getByText('Notification')).toBeInTheDocument();
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
      
      const alertElement = screen.getByRole('alert');
      const progressBar = alertElement.querySelector('[style*="width"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('accepts custom auto-close time', () => {
      const alert = createNotificationAlert('Test', 'Content', 2000);
      render(alert);
      
      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});

describe('Alert Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(<EnhancedAlert>Accessible alert</EnhancedAlert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveAttribute('aria-atomic', 'true');
  });

  it('supports custom aria-label', () => {
    render(<EnhancedAlert aria-label="Custom alert">Content</EnhancedAlert>);
    
    const alert = screen.getByLabelText('Custom alert');
    expect(alert).toBeInTheDocument();
  });

  it('dismiss button has proper accessibility', () => {
    render(<EnhancedAlert dismissible>Content</EnhancedAlert>);
    
    const dismissButton = screen.getByLabelText('Dismiss alert');
    expect(dismissButton).toHaveAttribute('type', 'button');
    expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert');
  });

  it('progress bar has proper accessibility attributes', () => {
    render(
      <EnhancedAlert autoClose={1000} showProgress>
        Content
      </EnhancedAlert>
    );
    
    const alert = screen.getByRole('alert');
    const progressBar = alert.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'Auto-close progress');
  });
});

describe('Alert Edge Cases', () => {
  it('handles empty title gracefully', () => {
    render(<EnhancedAlert title="">Content</EnhancedAlert>);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles empty description gracefully', () => {
    render(<EnhancedAlert description="">Content</EnhancedAlert>);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles complex content', () => {
    const complexContent = (
      <div>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <strong>Bold text</strong>
      </div>
    );
    
    render(<EnhancedAlert>{complexContent}</EnhancedAlert>);
    
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('handles zero auto-close time', () => {
    render(<EnhancedAlert autoClose={0}>Content</EnhancedAlert>);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Should still be visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('maintains proper styling with custom props', () => {
    render(
      <EnhancedAlert
        variant="success"
        size="lg"
        elevation="dramatic"
        className="custom-class"
        style={{ backgroundColor: 'red' }}
      >
        Custom alert
      </EnhancedAlert>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class', 'border-green-500/50', 'p-6', 'shadow-xl');
    expect(alert).toHaveStyle('background-color: rgb(255, 0, 0)');
  });
});
