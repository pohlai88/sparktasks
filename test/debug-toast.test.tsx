/**
 * Quick debugging test for toast imperative API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, toast, _resetToastManager } from '../src/components/ui/Toast';
import '@testing-library/jest-dom';

vi.useFakeTimers();

describe('Debug Toast', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    _resetToastManager();
  });

  it('debug: can render basic provider', async () => {
    render(
      <ToastProvider>
        <div data-testid="test-content">Test Content</div>
      </ToastProvider>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('debug: can call global toast function', async () => {
    render(
      <ToastProvider>
        <div data-testid="content">Content</div>
      </ToastProvider>
    );
    
    // Just try calling the global function directly
    act(() => {
      toast.success('Test message');
    });
    
    // Check if component is still there
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('debug: without userEvent.setup', async () => {
    const TestComponent = () => {
      return (
        <div>
          <button onClick={() => toast.success('Imperative success!')}>
            Add Success Toast
          </button>
        </div>
      );
    };
    
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const successButton = screen.getByRole('button', { name: /add success toast/i });
    
    // Use fireEvent instead of userEvent
    await act(async () => {
      successButton.click();
    });
    
    // Check if toast appears
    expect(screen.getByText('Imperative success!')).toBeInTheDocument();
  });
});
