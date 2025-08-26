/**
 * CN Utility Tests - Fortune-500 Grade Utility Testing
 *
 * Tests for the class name utility function that combines
 * Tailwind classes with clsx and tailwind-merge.
 */

import { describe, test, expect } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn utility - Fortune-500 Grade Tests', () => {
  test('combines multiple class names', () => {
    const result = cn('text-red-500', 'bg-blue-500', 'p-4');
    expect(result).toBe('text-red-500 bg-blue-500 p-4');
  });

  test('handles conditional classes', () => {
    const isActive = true;
    const result = cn(
      'base-class',
      isActive && 'active-class',
      !isActive && 'inactive-class'
    );
    expect(result).toBe('base-class active-class');
  });

  test('merges conflicting Tailwind classes', () => {
    const result = cn('p-4', 'p-6'); // p-6 should win
    expect(result).toBe('p-6');
  });

  test('handles arrays of classes', () => {
    const result = cn(['text-red-500', 'bg-blue-500'], 'p-4');
    expect(result).toBe('text-red-500 bg-blue-500 p-4');
  });

  test('filters out undefined and null values', () => {
    const result = cn('valid-class', undefined, null, 'another-class');
    expect(result).toBe('valid-class another-class');
  });

  test('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  test('merges responsive classes correctly', () => {
    const result = cn('text-sm', 'md:text-base', 'lg:text-lg');
    expect(result).toBe('text-sm md:text-base lg:text-lg');
  });

  test('merges conflicting responsive classes', () => {
    const result = cn('text-sm', 'text-base'); // text-base should win
    expect(result).toBe('text-base');
  });
});
