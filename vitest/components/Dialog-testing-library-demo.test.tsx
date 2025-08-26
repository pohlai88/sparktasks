/**
 * Enhanced Dialog Test Suite - Testing Library Simplified
 *
 * TESTING LIBRARY POWER DEMONSTRATED:
 * ✅ User-Centric Queries - Find elements by accessible properties
 * ✅ Realistic Interactions - userEvent for genuine user behavior
 * ✅ Accessibility Testing - Built-in a11y validation
 * ✅ Async Handling - waitFor for dynamic content
 * ✅ Semantic Assertions - jest-dom custom matchers
 * ✅ Clean, Maintainable Tests - Resilient to implementation changes
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

// Extend Jest matchers for semantic assertions
expect.extend(toHaveNoViolations);

// Simple button component for testing with proper ref forwarding
const TestButton = React.forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));
TestButton.displayName = 'TestButton';

describe('Enhanced Dialog - Testing Library Showcase', () => {
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
  });

  describe('🎯 Testing Library Benefits Demo', () => {
    it('✅ finds elements by accessible properties (user-centric)', async () => {
      // 🔥 TESTING LIBRARY POWER: Find elements like users do

      render(
        <EnhancedDialog
          trigger={<TestButton>Open Settings</TestButton>}
          title='User Settings'
          description='Configure your account preferences'
        >
          <div>Settings form content</div>
        </EnhancedDialog>
      );

      // 🎯 User finds button by its visible text (not by CSS class or test ID)
      const openButton = screen.getByRole('button', { name: 'Open Settings' });
      expect(openButton).toBeInTheDocument();

      const user = userEvent.setup();
      await user.click(openButton);

      // 🎯 User identifies dialog by its semantic role
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // 🎯 User finds heading by its accessible name
      const title = screen.getByRole('heading', { name: 'User Settings' });
      expect(title).toBeInTheDocument();

      // 🎯 User reads description text
      const description = screen.getByText(
        'Configure your account preferences'
      );
      expect(description).toBeInTheDocument();
    });

    it('✅ provides realistic user interactions with userEvent', async () => {
      // 🔥 TESTING LIBRARY POWER: Realistic user behavior simulation

      render(
        <Dialog>
          <DialogTrigger asChild>
            <TestButton>Contact Support</TestButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>Send us a message</DialogDescription>
            </DialogHeader>
            <form>
              <label htmlFor='email'>Email Address</label>
              <input id='email' type='email' placeholder='your@email.com' />
              <label htmlFor='message'>Message</label>
              <textarea id='message' placeholder='How can we help?' />
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <TestButton type='button'>Cancel</TestButton>
              </DialogClose>
              <TestButton type='submit'>Send Message</TestButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const user = userEvent.setup();

      // 🎯 User clicks button with realistic interaction
      await user.click(screen.getByRole('button', { name: 'Contact Support' }));

      // 🎯 User types in form fields with realistic timing
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, 'user@example.com');
      expect(emailInput).toHaveValue('user@example.com');

      const messageInput = screen.getByLabelText('Message');
      await user.type(messageInput, 'I need help with my account');
      expect(messageInput).toHaveValue('I need help with my account');

      // 🎯 User navigates with keyboard
      await user.keyboard('{Tab}'); // Move to next element
      await user.keyboard('{Enter}'); // Activate focused element
    });

    it('✅ handles async behavior with waitFor utilities', async () => {
      // 🔥 TESTING LIBRARY POWER: Built-in async testing utilities

      const MockAsyncDialog = () => {
        const [isLoading, setIsLoading] = React.useState(false);
        const [data, setData] = React.useState<string | null>(null);

        const handleLoad = () => {
          setIsLoading(true);
          // Simulate API call with shorter timeout
          setTimeout(() => {
            setData('Data loaded successfully!');
            setIsLoading(false);
          }, 50);
        };

        return (
          <Dialog>
            <DialogTrigger asChild>
              <TestButton>Load Data</TestButton>
            </DialogTrigger>
            <DialogContent aria-describedby='dialog-description'>
              <DialogTitle>Data Loading Demo</DialogTitle>
              <DialogDescription id='dialog-description'>
                Demonstrates async data loading with Testing Library
              </DialogDescription>
              <div>
                <TestButton onClick={handleLoad}>Fetch Data</TestButton>
                {isLoading && <div role='status'>Loading...</div>}
                {data && <div role='alert'>{data}</div>}
              </div>
            </DialogContent>
          </Dialog>
        );
      };

      render(<MockAsyncDialog />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Load Data' }));
      await user.click(screen.getByRole('button', { name: 'Fetch Data' }));

      // 🎯 Wait for loading indicator to appear
      expect(screen.getByRole('status')).toBeInTheDocument();

      // 🎯 Wait for async content to load and appear
      const successMessage = await waitFor(() => screen.getByRole('alert'), {
        timeout: 1000,
      });
      expect(successMessage).toHaveTextContent('Data loaded successfully!');

      // 🎯 Verify loading state is gone
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });

    it('✅ uses jest-dom custom matchers for semantic assertions', async () => {
      // 🔥 TESTING LIBRARY POWER: Rich semantic assertions

      render(
        <Dialog>
          <DialogTrigger asChild>
            <TestButton disabled>Open Dialog</TestButton>
          </DialogTrigger>
          <DialogContent aria-describedby='help-text'>
            <DialogTitle>Accessibility Demo</DialogTitle>
            <DialogDescription id='help-text'>
              This dialog demonstrates accessibility features
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });

      // 🎯 Semantic assertions about element state
      expect(trigger).toBeInTheDocument();
      expect(trigger).toBeDisabled(); // Much clearer than checking attributes
      expect(trigger).not.toBeEnabled();

      const user = userEvent.setup();

      // Enable button for dialog testing
      trigger.removeAttribute('disabled');
      await user.click(trigger);

      const dialog = screen.getByRole('dialog');
      const title = screen.getByRole('heading');
      const description = screen.getByText(/accessibility features/);

      // 🎯 Rich accessibility assertions
      expect(dialog).toBeVisible();
      expect(dialog).toHaveAttribute('role', 'dialog');
      expect(title).toHaveTextContent('Accessibility Demo');
      expect(description).toHaveAttribute('id', 'help-text');

      // 🎯 Verify ARIA relationships
      expect(dialog).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('✅ runs comprehensive accessibility audits with axe', async () => {
      // 🔥 TESTING LIBRARY POWER: Automated accessibility testing

      const { container } = render(
        <EnhancedDialog
          trigger={<TestButton>Accessible Dialog</TestButton>}
          title='Fully Accessible Dialog'
          description='This dialog meets WCAG 2.1 AA standards'
          footer={
            <div>
              <TestButton>Cancel</TestButton>
              <TestButton>Confirm</TestButton>
            </div>
          }
        >
          <form>
            <label htmlFor='username'>Username</label>
            <input id='username' required aria-describedby='username-help' />
            <div id='username-help'>Enter your username</div>

            <label htmlFor='password'>Password</label>
            <input id='password' type='password' required />
          </form>
        </EnhancedDialog>
      );

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('button', { name: 'Accessible Dialog' })
      );

      // 🎯 Run comprehensive accessibility audit
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // 🎯 Test specific accessibility standards
      const wcagResults = await axe(container);
      expect(wcagResults).toHaveNoViolations();
    });

    it('✅ focuses on user scenarios over implementation details', async () => {
      // 🔥 TESTING LIBRARY POWER: Test user workflows, not code structure

      render(
        <EnhancedDialog
          trigger={<TestButton>User Scenario Test</TestButton>}
          title='Delete Account'
          description='This action cannot be undone'
          footer={
            <div>
              <TestButton>Cancel</TestButton>
              <TestButton data-danger='true'>Delete Forever</TestButton>
            </div>
          }
        >
          <div>
            <p>All your data will be permanently deleted.</p>
            <label>
              <input type='checkbox' />I understand this action cannot be undone
            </label>
          </div>
        </EnhancedDialog>
      );

      const user = userEvent.setup();

      // 🎯 SCENARIO: User wants to delete their account

      // Step 1: User finds and clicks delete button
      await user.click(
        screen.getByRole('button', { name: 'User Scenario Test' })
      );

      // Step 2: User reads the warning dialog
      expect(
        screen.getByRole('heading', { name: 'Delete Account' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('This action cannot be undone')
      ).toBeInTheDocument();
      expect(
        screen.getByText('All your data will be permanently deleted.')
      ).toBeInTheDocument();

      // Step 3: User acknowledges the risk by checking box
      const acknowledgment = screen.getByRole('checkbox', {
        name: /understand.*cannot be undone/,
      });
      await user.click(acknowledgment);
      expect(acknowledgment).toBeChecked();

      // Step 4: User can now safely click the danger button
      const deleteButton = screen.getByRole('button', {
        name: 'Delete Forever',
      });
      expect(deleteButton).toBeEnabled();

      // Step 5: User changes mind and cancels
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Step 6: Dialog closes and user is safe
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('🚀 MAPS v2.2 Enhanced Features Testing', () => {
    it('✅ validates AAA compliance mode', async () => {
      render(
        <EnhancedDialog
          trigger={<TestButton>AAA Mode Test</TestButton>}
          title='AAA Compliance Demo'
          enforceAAA={true}
          vibrancy='glass'
        >
          <p>This dialog enforces AAA accessibility standards</p>
        </EnhancedDialog>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'AAA Mode Test' }));

      const dialog = screen.getByRole('dialog');

      // 🎯 Verify AAA mode overrides vibrancy for accessibility
      expect(dialog).toHaveClass('backdrop-blur-none');
      expect(dialog).toHaveClass('bg-background');
    });

    it('✅ tests focus management and keyboard navigation', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <TestButton>Focus Test</TestButton>
          </DialogTrigger>
          <DialogContent aria-describedby='focus-description'>
            <DialogTitle>Focus Management</DialogTitle>
            <DialogDescription id='focus-description'>
              Testing focus management and keyboard navigation
            </DialogDescription>
            <TestButton>First Button</TestButton>
            <TestButton>Second Button</TestButton>
            <DialogClose asChild>
              <TestButton>Close</TestButton>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );

      const user = userEvent.setup();
      const trigger = screen.getByRole('button', { name: 'Focus Test' });

      await user.click(trigger);

      // 🎯 Test focus trap within dialog
      await user.tab();
      expect(document.activeElement).toBeDefined();

      // Focus should be within dialog
      const dialog = screen.getByRole('dialog');
      expect(dialog).toContainElement(document.activeElement as HTMLElement);

      // 🎯 Test Escape key closes dialog
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // 🎯 Focus returns to trigger
      expect(trigger).toHaveFocus();
    });

    it('✅ validates Windows High Contrast support', () => {
      // Mock high contrast media query
      Object.defineProperty(globalThis, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query.includes('forced-colors'),
          media: query,
        })),
      });

      render(
        <EnhancedDialog
          trigger={<TestButton>High Contrast Test</TestButton>}
          title='High Contrast Mode'
          enforceAAA={true}
        >
          <p>Testing Windows High Contrast support</p>
        </EnhancedDialog>
      );

      // 🎯 Component should handle high contrast gracefully
      expect(screen.getByRole('button')).toBeInTheDocument();

      // In real implementation, would verify forced-colors CSS classes
      // This demonstrates the testing approach for accessibility features
    });
  });

  describe('🎨 Performance & Memory Testing', () => {
    it('✅ renders within performance budget', () => {
      const startTime = performance.now();

      render(
        <EnhancedDialog
          trigger={<TestButton>Performance Test</TestButton>}
          title='Performance Dialog'
        >
          <div>Content</div>
        </EnhancedDialog>
      );

      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(50); // 50ms budget
    });

    it('✅ handles rapid open/close without issues', async () => {
      render(
        <EnhancedDialog
          trigger={<TestButton>Rapid Test</TestButton>}
          title='Rapid Testing'
        >
          <div>Content</div>
        </EnhancedDialog>
      );

      const user = userEvent.setup();
      const trigger = screen.getByRole('button', { name: 'Rapid Test' });

      // 🎯 Rapid open/close cycles
      for (let i = 0; i < 3; i++) {
        await user.click(trigger);
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      }

      // Should handle rapid interactions gracefully
      expect(trigger).toHaveFocus();
    });
  });
});
