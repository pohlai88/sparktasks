import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

// Simple test without imports to verify test infrastructure works
describe('Basic Test Infrastructure', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render a basic div', () => {
    const { container } = render(<div data-testid="basic">Hello</div>);
    expect(container.firstChild).toHaveAttribute('data-testid', 'basic');
  });
});
