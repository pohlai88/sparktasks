/**
 * Test for TestHoverCard - debugging version without complexity
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestHoverCard } from '@/components/ui/TestHoverCard';

describe('TestHoverCard', () => {
  const triggerText = 'Hover me';
  const contentText = 'Test content';

  beforeEach(() => {
    // Ensure clean DOM
    document.body.innerHTML = '';
  });

  it('should render the trigger element', () => {
    render(
      <TestHoverCard content={contentText}>
        <button>{triggerText}</button>
      </TestHoverCard>
    );

    expect(screen.getByRole('button', { name: triggerText })).toBeInTheDocument();
  });

  it('should show content on mouseenter', async () => {
    render(
      <TestHoverCard content={contentText}>
        <button>{triggerText}</button>
      </TestHoverCard>
    );

    const trigger = screen.getByRole('button', { name: triggerText });
    
    // Initially content should not be visible
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    
    // Hover over trigger
    fireEvent.mouseEnter(trigger);
    
    // Content should be visible
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  it('should hide content on mouseleave', async () => {
    render(
      <TestHoverCard content={contentText}>
        <button>{triggerText}</button>
      </TestHoverCard>
    );

    const trigger = screen.getByRole('button', { name: triggerText });
    
    // Show content first
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    
    // Hide content
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
