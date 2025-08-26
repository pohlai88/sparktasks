import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnhancedScrollArea } from '../../src/components/ui-enhanced/ScrollArea';

describe('ScrollArea Import Test', () => {
  it('can import and render EnhancedScrollArea', () => {
    render(
      <EnhancedScrollArea data-testid='test-scroll'>
        <div>Test content</div>
      </EnhancedScrollArea>
    );

    expect(screen.getByTestId('test-scroll')).toBeInTheDocument();
  });
});
