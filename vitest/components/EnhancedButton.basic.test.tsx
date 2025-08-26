/**
 * Basic Enhanced Button Test - MAPS v2.2 Dark-First
 *
 * Simplified test to verify core functionality
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { EnhancedButton } from '@/components/ui-enhanced/Button';

describe('EnhancedButton - Basic Tests', () => {
  it('renders with default props', () => {
    render(<EnhancedButton>Test Button</EnhancedButton>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<EnhancedButton variant='primary'>Primary</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent');
  });

  it('shows loading state correctly', () => {
    render(<EnhancedButton loading>Loading</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('supports disabled state', () => {
    render(<EnhancedButton disabled>Disabled</EnhancedButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
