// Testing Library Demo - Simple & Working
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { describe, it, expect } from 'vitest';

import {
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

// Simple test button component with ref forwarding
const TestButton = React.forwardRef<
  HTMLButtonElement,
  { children: React.ReactNode; onClick?: () => void }
>(({ children, onClick }, ref) => (
  <button ref={ref} onClick={onClick} type='button'>
    {children}
  </button>
));

TestButton.displayName = 'TestButton';

describe('✅ Testing Library Success - Dialog Component', () => {
  it('✅ renders dialog with accessible structure', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <TestButton>Open Dialog</TestButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test description</DialogDescription>
          </DialogHeader>
          <p>Dialog content goes here</p>
          <DialogFooter>
            <DialogClose asChild>
              <TestButton>Close</TestButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Find trigger button using accessible query
    const triggerButton = screen.getByRole('button', { name: /open dialog/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('✅ opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <TestButton>Open Dialog</TestButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test description</DialogDescription>
          </DialogHeader>
          <p>Dialog content goes here</p>
          <DialogFooter>
            <DialogClose asChild>
              <TestButton>Close</TestButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Click the trigger button
    const triggerButton = screen.getByRole('button', { name: /open dialog/i });
    await user.click(triggerButton);

    // Check if dialog is open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('✅ closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <TestButton>Open Dialog</TestButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test description</DialogDescription>
          </DialogHeader>
          <p>Dialog content goes here</p>
          <DialogFooter>
            <DialogClose asChild>
              <TestButton>Close</TestButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Open dialog
    const triggerButton = screen.getByRole('button', { name: /open dialog/i });
    await user.click(triggerButton);

    // Verify dialog is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close dialog using the footer close button (get all, then filter)
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    const footerCloseButton =
      closeButtons.find(
        button => button.closest('[class*="flex-col-reverse"]') // Footer has this class
      ) || closeButtons[0]; // Fallback to first button

    expect(footerCloseButton).toBeDefined();
    await user.click(footerCloseButton!);

    // Verify dialog is closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('✅ has no accessibility violations', async () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger asChild>
          <TestButton>Open Dialog</TestButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>
              This dialog follows accessibility best practices
            </DialogDescription>
          </DialogHeader>
          <p>Content with proper semantic structure</p>
          <DialogFooter>
            <DialogClose asChild>
              <TestButton>Close</TestButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('✅ supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <TestButton>Open Dialog</TestButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Test</DialogTitle>
            <DialogDescription>Testing keyboard interactions</DialogDescription>
          </DialogHeader>
          <p>Use Tab to navigate, Escape to close</p>
          <DialogFooter>
            <DialogClose asChild>
              <TestButton>Close</TestButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Focus trigger and press Enter
    const triggerButton = screen.getByRole('button', { name: /open dialog/i });
    triggerButton.focus();
    await user.keyboard('{Enter}');

    // Verify dialog opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Press Escape to close
    await user.keyboard('{Escape}');

    // Verify dialog closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
