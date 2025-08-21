/**
 * Simple Toast Test - Debug rendering issues
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from '../../src/components/ui/Toast';
import '@testing-library/jest-dom';

describe('Simple Toast Test', () => {
  it('renders a basic toast', () => {
    const mockDismiss = () => {};

    render(
      <Toast
        id='test-basic'
        variant='success'
        message='Test message'
        onDismiss={mockDismiss}
      />
    );

    // Let's see what actually renders
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
