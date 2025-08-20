import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SimpleHoverCard } from '@/components/ui/SimpleHoverCard';

// Simple debug test to see what's going wrong
describe('HoverCard Debug', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the component', () => {
    render(
      <SimpleHoverCard content="Test content">
        <button>Hover me</button>
      </SimpleHoverCard>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show content on hover', async () => {
    render(
      <SimpleHoverCard content="Test content">
        <button>Hover me</button>
      </SimpleHoverCard>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should hide content on mouse leave', async () => {
    render(
      <SimpleHoverCard content="Test content">
        <button>Hover me</button>
      </SimpleHoverCard>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    expect(screen.getByText('Test content')).toBeInTheDocument();
    
    fireEvent.mouseLeave(button);
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });
});
