import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert, AlertAction, AlertGroup } from '../../src/components/ui/Alert';

describe('Alert Component', () => {
  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Alert>Test alert content</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test alert content')).toBeInTheDocument();
    });

    it('renders all variant types', () => {
      const variants = ['info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        render(
          <Alert variant={variant} data-testid={`alert-${variant}`}>
            {variant} alert
          </Alert>
        );

        expect(screen.getByTestId(`alert-${variant}`)).toBeInTheDocument();
        expect(screen.getByText(`${variant} alert`)).toBeInTheDocument();
      });
    });

    it('renders all size variants', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        render(
          <Alert size={size} data-testid={`alert-${size}`}>
            {size} alert
          </Alert>
        );

        expect(screen.getByTestId(`alert-${size}`)).toBeInTheDocument();
      });
    });

    it('renders with title', () => {
      render(<Alert title='Alert Title'>Alert content</Alert>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert content')).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      const CustomIcon = <span data-testid='custom-icon'>🔥</span>;
      render(<Alert icon={CustomIcon}>Alert with custom icon</Alert>);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  // Dismissible functionality tests
  describe('Dismissible Functionality', () => {
    it('renders dismiss button when dismissible is true', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Dismissible alert
        </Alert>
      );

      expect(
        screen.getByRole('button', { name: /dismiss.*alert/i })
      ).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Dismissible alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss.*alert/i,
      });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard interaction on dismiss button', () => {
      const onDismiss = vi.fn();
      render(
        <Alert dismissible onDismiss={onDismiss}>
          Dismissible alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss.*alert/i,
      });

      // Test Enter key
      fireEvent.keyDown(dismissButton, {
        key: 'Enter',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      });
      expect(onDismiss).toHaveBeenCalledTimes(1);

      // Test Space key
      fireEvent.keyDown(dismissButton, {
        key: ' ',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      });
      expect(onDismiss).toHaveBeenCalledTimes(2);
    });

    it('does not render dismiss button when dismissible is false', () => {
      render(<Alert dismissible={false}>Non-dismissible alert</Alert>);
      expect(
        screen.queryByRole('button', { name: /dismiss.*alert/i })
      ).not.toBeInTheDocument();
    });

    it('does not render dismiss button when onDismiss is not provided', () => {
      render(<Alert dismissible>Alert without onDismiss</Alert>);
      expect(
        screen.queryByRole('button', { name: /dismiss.*alert/i })
      ).not.toBeInTheDocument();
    });
  });

  // Actions rendering tests
  describe('Actions Rendering', () => {
    it('renders actions when provided', () => {
      const actions = (
        <div>
          <AlertAction variant='primary'>Primary Action</AlertAction>
          <AlertAction variant='secondary'>Secondary Action</AlertAction>
        </div>
      );

      render(<Alert actions={actions}>Alert with actions</Alert>);

      expect(screen.getByText('Primary Action')).toBeInTheDocument();
      expect(screen.getByText('Secondary Action')).toBeInTheDocument();
    });

    it('does not render actions section when actions are not provided', () => {
      render(<Alert>Alert without actions</Alert>);

      // The actions container should not exist
      expect(screen.queryByText('Primary Action')).not.toBeInTheDocument();
    });

    it('AlertAction component renders correctly', () => {
      render(
        <AlertAction data-testid='alert-action' onClick={vi.fn()}>
          Test Action
        </AlertAction>
      );

      expect(screen.getByTestId('alert-action')).toBeInTheDocument();
      expect(screen.getByText('Test Action')).toBeInTheDocument();
    });
  });

  // ARIA labels and accessibility tests
  describe('ARIA Labels and Accessibility', () => {
    it('generates semantic ARIA label without title', () => {
      render(<Alert variant='warning'>Warning content</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'warning alert');
    });

    it('generates semantic ARIA label with title', () => {
      render(
        <Alert variant='error' title='Critical Error'>
          Error content
        </Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute(
        'aria-label',
        'error alert: Critical Error'
      );
    });

    it('uses custom aria-label when provided', () => {
      render(<Alert aria-label='Custom alert label'>Alert content</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-label', 'Custom alert label');
    });

    it('has correct ARIA attributes', () => {
      render(<Alert>Alert content</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('includes screen reader content for complex alerts', () => {
      const multiLineContent = 'Multi-line content\nwith line breaks';

      render(
        <Alert
          variant='success'
          title='Success Title'
          dismissible
          onDismiss={vi.fn()}
          actions={<AlertAction>Action</AlertAction>}
        >
          {multiLineContent}
        </Alert>
      );

      // Screen reader content should be present but visually hidden
      expect(screen.getByText(/Alert type: success/)).toBeInTheDocument();
      expect(screen.getByText(/Title: Success Title/)).toBeInTheDocument();
      expect(screen.getByText(/2 lines of content/)).toBeInTheDocument();
      expect(
        screen.getByText(/Press dismiss button to close alert/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Additional actions available/)
      ).toBeInTheDocument();
    });

    it('has accessible dismiss button label', () => {
      const onDismiss = vi.fn();
      render(
        <Alert variant='info' dismissible onDismiss={onDismiss}>
          Alert
        </Alert>
      );

      const dismissButton = screen.getByRole('button', {
        name: 'Dismiss info alert',
      });
      expect(dismissButton).toBeInTheDocument();
    });
  });

  // AlertGroup component tests
  describe('AlertGroup Component', () => {
    it('renders multiple alerts with correct spacing', () => {
      render(
        <AlertGroup spacing='normal' data-testid='alert-group'>
          <Alert>First alert</Alert>
          <Alert>Second alert</Alert>
          <Alert>Third alert</Alert>
        </AlertGroup>
      );

      const group = screen.getByTestId('alert-group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('role', 'group');
      expect(group).toHaveAttribute('aria-label', 'Alert notifications');

      expect(screen.getByText('First alert')).toBeInTheDocument();
      expect(screen.getByText('Second alert')).toBeInTheDocument();
      expect(screen.getByText('Third alert')).toBeInTheDocument();
    });

    it('applies different spacing variants', () => {
      const spacings = ['tight', 'normal', 'relaxed'] as const;

      spacings.forEach(spacing => {
        render(
          <AlertGroup spacing={spacing} data-testid={`group-${spacing}`}>
            <Alert>Alert in {spacing} group</Alert>
          </AlertGroup>
        );

        expect(screen.getByTestId(`group-${spacing}`)).toBeInTheDocument();
      });
    });
  });

  // RTL and internationalization tests
  describe('RTL and Internationalization', () => {
    it('renders correctly in RTL mode', () => {
      render(
        <div dir='rtl'>
          <Alert title='عنوان التنبيه' dismissible onDismiss={vi.fn()}>
            محتوى التنبيه
          </Alert>
        </div>
      );

      expect(screen.getByText('عنوان التنبيه')).toBeInTheDocument();
      expect(screen.getByText('محتوى التنبيه')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /dismiss.*alert/i })
      ).toBeInTheDocument();
    });

    it('handles long titles gracefully', () => {
      const longTitle =
        'This is a very long alert title that should handle text wrapping and overflow gracefully in different viewport sizes';

      render(<Alert title={longTitle}>Alert content</Alert>);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles long content gracefully', () => {
      const longContent =
        'This is a very long alert content that spans multiple lines and should handle text wrapping, overflow, and different viewport sizes gracefully while maintaining readability and accessibility.';

      render(<Alert>{longContent}</Alert>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });

  // Visual regression and snapshot tests
  describe('Visual Regression', () => {
    it('maintains consistent visual structure', () => {
      const { container } = render(
        <Alert
          variant='warning'
          size='md'
          title='Warning Title'
          dismissible
          onDismiss={vi.fn()}
          actions={
            <div>
              <AlertAction variant='primary'>Primary</AlertAction>
              <AlertAction variant='secondary'>Secondary</AlertAction>
            </div>
          }
        >
          Warning message content with multiple lines and detailed information
        </Alert>
      );

      // Test that the DOM structure matches expectations
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders minimal alert correctly', () => {
      const { container } = render(<Alert>Simple alert</Alert>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders complex alert group correctly', () => {
      const { container } = render(
        <AlertGroup spacing='normal'>
          <Alert variant='info' title='Info'>
            Information message
          </Alert>
          <Alert variant='success' dismissible onDismiss={vi.fn()}>
            Success message
          </Alert>
          <Alert
            variant='error'
            title='Error'
            actions={<AlertAction>Retry</AlertAction>}
          >
            Error message with action
          </Alert>
        </AlertGroup>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // Error boundary and edge cases
  describe('Edge Cases and Error Handling', () => {
    it('handles empty content gracefully', () => {
      render(<Alert>{''}</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles null children', () => {
      render(<Alert>{null}</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('handles undefined title', () => {
      render(<Alert>Content</Alert>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Alert with ref</Alert>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'alert');
    });

    it('handles custom className correctly', () => {
      render(
        <Alert className='custom-alert-class'>Alert with custom class</Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-alert-class');
    });

    it('spreads additional props correctly', () => {
      render(
        <Alert data-custom='custom-value' id='custom-alert'>
          Alert with custom props
        </Alert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('data-custom', 'custom-value');
      expect(alert).toHaveAttribute('id', 'custom-alert');
    });
  });
});
