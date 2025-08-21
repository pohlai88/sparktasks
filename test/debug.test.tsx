import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import DebugHoverCard from '@/components/ui/DebugHoverCard';

describe('DebugHoverCard', () => {
  it('shows content on hover', async () => {
    const user = userEvent.setup();

    render(
      <DebugHoverCard content='Debug content'>
        <button>Hover me</button>
      </DebugHoverCard>
    );

    await user.hover(screen.getByRole('button'));
    expect(screen.getByText('Debug content')).toBeInTheDocument();
  });
});
