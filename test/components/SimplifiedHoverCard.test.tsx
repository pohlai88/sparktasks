/**
 * Test for SimplifiedHoverCard
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SimplifiedHoverCard } from '@/components/ui/SimplifiedHoverCard';

describe('SimplifiedHoverCard', () => {
  const triggerText = 'Simplified me';
  const contentText = 'Simplified content';

  beforeEach(() => {
    // Ensure clean DOM
    document.body.innerHTML = '';
  });

  it('should show content on mouseenter', () => {
    render(
      <SimplifiedHoverCard content={contentText}>
        <button>{triggerText}</button>
      </SimplifiedHoverCard>
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
});
