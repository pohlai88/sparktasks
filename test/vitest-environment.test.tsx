/**
 * @fileoverview Vitest Environment Validation Test
 *
 * @description Test to validate the complete Vitest environment setup
 * and demonstrate all enterprise testing capabilities.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ===== SETUP AND CLEANUP =====

beforeEach(() => {
  vi.clearAllMocks();
  // Test global utilities
  globalThis.startPerformanceMark?.('test-setup');
});

afterEach(() => {
  vi.restoreAllMocks();
  // Clean up performance marks
  try {
    globalThis.endPerformanceMark?.('test-setup');
  } catch (e) {
    // Mark might not exist, that's okay
  }
});

// ===== SIMPLE TEST COMPONENT =====

const TestComponent: React.FC<{
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ onClick, children = 'Test Button' }) => (
  <button onClick={onClick} data-testid='test-button'>
    {children}
  </button>
);

// ===== VITEST ENVIRONMENT TESTS =====

describe('Vitest Environment - Core Functionality', () => {
  it('renders React components correctly', () => {
    render(<TestComponent>Hello Vitest</TestComponent>);

    expect(screen.getByTestId('test-button')).toBeInTheDocument();
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument();
  });

  it('handles user interactions with user-event', async () => {
    const mockClick = vi.fn();
    const user = userEvent.setup();

    render(<TestComponent onClick={mockClick} />);

    const button = screen.getByTestId('test-button');
    await user.click(button);

    expect(mockClick).toHaveBeenCalledOnce();
  });

  it('supports vi.fn() mocking', () => {
    const mockFn = vi.fn();
    mockFn('test-arg');

    expect(mockFn).toHaveBeenCalledWith('test-arg');
    expect(mockFn).toHaveBeenCalledOnce();
  });

  it('supports vi.spyOn for existing objects', () => {
    const testObj = { method: () => 'original' };
    const spy = vi.spyOn(testObj, 'method').mockReturnValue('mocked');

    expect(testObj.method()).toBe('mocked');
    expect(spy).toHaveBeenCalledOnce();
  });
});

// ===== GLOBAL UTILITIES TESTS =====

describe('Vitest Environment - Global Utilities', () => {
  it('provides createMockTask utility', () => {
    const task = globalThis.createMockTask?.({
      title: 'Test Task',
      completed: true,
    });

    expect(task).toBeDefined();
    expect(task?.title).toBe('Test Task');
    expect(task?.completed).toBe(true);
    expect(task?.id).toMatch(/^task_\d+_[a-z0-9]{9}$/);
  });

  it('provides createTestDate utility', () => {
    const date = globalThis.createTestDate?.();

    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2025);
    expect(date?.getMonth()).toBe(7); // August (0-indexed)
  });

  it('provides waitForNextTick utility', async () => {
    let executed = false;

    setTimeout(() => {
      executed = true;
    }, 0);

    await globalThis.waitForNextTick?.();

    expect(executed).toBe(true);
  });
});

// ===== DOM ENVIRONMENT TESTS =====

describe('Vitest Environment - DOM APIs', () => {
  it('provides localStorage mock', () => {
    localStorage.setItem('test-key', 'test-value');

    expect(localStorage.getItem('test-key')).toBe('test-value');

    localStorage.removeItem('test-key');
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('provides matchMedia mock', () => {
    const media = window.matchMedia('(max-width: 768px)');

    expect(media.matches).toBe(false);
    expect(media.media).toBe('(max-width: 768px)');
  });

  it('provides ResizeObserver mock', () => {
    const observer = new ResizeObserver(vi.fn());

    expect(observer.observe).toBeDefined();
    expect(observer.unobserve).toBeDefined();
    expect(observer.disconnect).toBeDefined();
  });

  it('provides scrollIntoView mock', () => {
    const element = document.createElement('div');

    expect(() => element.scrollIntoView()).not.toThrow();
    expect(element.scrollIntoView).toHaveBeenCalled();
  });
});

// ===== CRYPTO ENVIRONMENT TESTS =====

describe('Vitest Environment - Crypto APIs', () => {
  it('provides crypto.randomUUID', () => {
    const uuid = crypto.randomUUID();

    expect(uuid).toBeDefined();
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBeGreaterThan(0);
  });

  it('provides crypto.getRandomValues', () => {
    const array = new Uint8Array(16);
    const result = crypto.getRandomValues(array);

    expect(result).toBe(array);
    expect(array.some(byte => byte !== 0)).toBe(true); // Should have some random values
  });

  it('provides crypto test utilities', () => {
    const helpers = (globalThis as any).cryptoTestHelpers;

    expect(helpers).toBeDefined();
    expect(helpers.generateTestData).toBeDefined();
    expect(helpers.bufferToHex).toBeDefined();
    expect(helpers.hexToBuffer).toBeDefined();
  });
});

// ===== PERFORMANCE TESTING =====

describe('Vitest Environment - Performance Monitoring', () => {
  it('tracks performance marks safely', () => {
    // Test that performance utilities don't throw
    expect(() => {
      globalThis.startPerformanceMark?.('test-mark');
      globalThis.endPerformanceMark?.('test-mark');
    }).not.toThrow();
  });

  it('handles missing performance marks gracefully', () => {
    // Should handle non-existent marks
    expect(() => {
      globalThis.endPerformanceMark?.('non-existent-mark');
    }).toThrow("Performance mark 'non-existent-mark' not found");
  });
});

// ===== ACCESSIBILITY TESTING =====

describe('Vitest Environment - Accessibility Support', () => {
  it('supports jest-dom matchers', () => {
    render(<TestComponent />);

    const button = screen.getByTestId('test-button');

    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).toHaveTextContent('Test Button');
  });

  it('supports focus management testing', async () => {
    const user = userEvent.setup();
    render(<input data-testid='test-input' />);

    const input = screen.getByTestId('test-input');
    await user.click(input);

    expect(input).toHaveFocus();
  });
});

// ===== INTEGRATION TESTS =====

describe('Vitest Environment - Integration Capabilities', () => {
  it('combines multiple testing patterns', async () => {
    const mockAction = vi.fn();
    const user = userEvent.setup();

    // Component with mock
    render(<TestComponent onClick={mockAction} />);

    // User interaction
    await user.click(screen.getByTestId('test-button'));

    // Mock verification
    expect(mockAction).toHaveBeenCalledOnce();

    // DOM assertion
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  it('supports async testing patterns', async () => {
    const asyncMock = vi.fn().mockResolvedValue('async-result');

    const result = await asyncMock();

    expect(result).toBe('async-result');
    expect(asyncMock).toHaveBeenCalledOnce();
  });
});

// ===== TEST ISOLATION =====

describe('Vitest Environment - Test Isolation', () => {
  it('isolates mock state between tests', () => {
    const mock = vi.fn();
    mock('call-1');

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('starts with clean mock state', () => {
    const mock = vi.fn();

    expect(mock).not.toHaveBeenCalled();
  });

  it('provides fresh localStorage', () => {
    expect(localStorage.length).toBe(0);

    localStorage.setItem('test', 'value');
    expect(localStorage.length).toBe(1);
  });
});
