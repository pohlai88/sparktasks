/**
 * Debug test for DebugHoverCard
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DebugHoverCard } from '@/components/ui/DebugHoverCard';

describe('DebugHoverCard', () => {
  const triggerText = 'Debug me';
  const contentText = 'Debug content';

  beforeEach(() => {
    // Ensure clean DOM
    document.body.innerHTML = '';
  });

  it('should show content on mouseenter', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(
      <DebugHoverCard content={contentText} testId="debug-hover">
        <button>{triggerText}</button>
      </DebugHoverCard>
    );

    const trigger = screen.getByRole('button', { name: triggerText });
    
    // Initially content should not be visible
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    
    // Hover over trigger
    fireEvent.mouseEnter(trigger);
    
    // Check console logs
    console.log('Console calls:', consoleSpy.mock.calls);
    
    // Content should be visible
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
