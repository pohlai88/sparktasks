/**
 * @fileoverview Simple Vitest Validation Test
 *
 * @description Basic test to validate core Vitest functionality
 */

import { describe, it, expect, vi } from 'vitest';

describe('Vitest Core Environment', () => {
  it('supports basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
  });

  it('supports vi.fn() mocking', () => {
    const mockFn = vi.fn();
    mockFn('test');

    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledOnce();
  });

  it('supports async operations', async () => {
    const asyncMock = vi.fn().mockResolvedValue('result');
    const result = await asyncMock();

    expect(result).toBe('result');
  });

  it('supports object mocking', () => {
    const testObj = { prop: 'original' };
    const spy = vi.spyOn(testObj, 'prop', 'get').mockReturnValue('mocked');

    expect(testObj.prop).toBe('mocked');
    expect(spy).toHaveBeenCalled();
  });

  it('supports localStorage mock', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');

    localStorage.clear();
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('supports crypto API', () => {
    // Verify crypto object exists
    expect(crypto).toBeDefined();
    expect(crypto.getRandomValues).toBeDefined();

    // Test that getRandomValues can be called
    const array = new Uint8Array(4);
    expect(() => crypto.getRandomValues(array)).not.toThrow();
  });

  it('supports global utilities', () => {
    // Test that utilities are available
    expect(globalThis.createMockTask).toBeDefined();
    expect(globalThis.createTestDate).toBeDefined();
    expect(globalThis.waitForNextTick).toBeDefined();

    // Test a utility
    const task = globalThis.createMockTask({ title: 'Test' });
    expect(task.title).toBe('Test');
    expect(task.id).toMatch(/^task_\d+_[a-z0-9]{9}$/);
  });
});
