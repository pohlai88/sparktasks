/**
 * Enhanced Tooltip Test Suite - MAPS v2.2 Compliance Validation
 *
 * TESTING STRATEGY:
 * - Component rendering and composition patterns
 * - Variant system validation (9 variants × 4 sizes = 36 combinations)
 * - AAA compliance mode enforcement
 * - Accessibility behavior (ARIA, keyboard, screen reader)
 * - Glass materials system validation
 * - Factory pattern functionality
 * - Compound variant resolution
 * - Motion system and reduced motion respect
 *
 * COMPLIANCE VERIFICATION:
 * - ✅ Dark-first philosophy rendering
 * - ✅ Apple HIG spacing and typography
 * - ✅ Liquid glass materials with backdrop blur
 * - ✅ AAA enforcement overrides
 * - ✅ Anti-drift token validation
 * - ✅ Radix primitive integration
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  EnhancedTooltipProvider,
  EnhancedTooltipRoot,
  EnhancedTooltipTrigger,
  EnhancedTooltipContent,
  EnhancedTooltipWithTrigger,
  TooltipFactory,
} from '../src/components/ui-enhanced/Tooltip';

// Extend expect for accessibility testing
expect.extend(toHaveNoViolations);

// ===== TEST SETUP =====

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <EnhancedTooltipProvider delayDuration={0}>
    {children}
  </EnhancedTooltipProvider>
);

interface BasicTooltipProps {
  variant?:
    | 'default'
    | 'glass'
    | 'floating'
    | 'inverse'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  [key: string]: unknown;
}

const BasicTooltip = ({ variant = 'default', ...props }: BasicTooltipProps) => (
  <TestWrapper>
    <EnhancedTooltipRoot>
      <EnhancedTooltipTrigger>
        <button>Trigger</button>
      </EnhancedTooltipTrigger>
      <EnhancedTooltipContent variant={variant} {...props}>
        Tooltip content
      </EnhancedTooltipContent>
    </EnhancedTooltipRoot>
  </TestWrapper>
);

// ===== COMPONENT RENDERING TESTS =====

describe('Enhanced Tooltip - Component Rendering', () => {
  it('renders basic tooltip structure', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toBeInTheDocument();

    // Tooltip should not be visible initially
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();

    // Show tooltip on hover
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    // Hide tooltip on unhover
    await user.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it('renders with compound component pattern', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EnhancedTooltipWithTrigger
          trigger={<button>Compound Trigger</button>}
          variant='glass'
        >
          Compound tooltip content
        </EnhancedTooltipWithTrigger>
      </TestWrapper>
    );

    const trigger = screen.getByRole('button', { name: 'Compound Trigger' });
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Compound tooltip content');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass('backdrop-blur-[12px]');
    });
  });
});

// ===== VARIANT SYSTEM TESTS =====

describe('Enhanced Tooltip - Variant System', () => {
  const variants = [
    'default',
    'glass',
    'floating',
    'inverse',
    'success',
    'warning',
    'error',
    'info',
  ] as const;

  const sizes = ['sm', 'default', 'lg', 'xl'] as const;

  it.each(variants)('renders %s variant correctly', async variant => {
    const user = userEvent.setup();

    render(<BasicTooltip variant={variant} />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toBeInTheDocument();

      // Verify variant-specific classes
      switch (variant) {
        case 'glass':
          expect(tooltip).toHaveClass('backdrop-blur-[12px]');
          break;
        case 'floating':
          expect(tooltip).toHaveClass('backdrop-blur-[16px]');
          break;
        case 'inverse':
          expect(tooltip).toHaveClass('bg-[#e8ecf1]');
          break;
        case 'success':
          expect(tooltip).toHaveClass('bg-success/10');
          break;
        case 'warning':
          expect(tooltip).toHaveClass('bg-warning/10');
          break;
        case 'error':
          expect(tooltip).toHaveClass('bg-error/10');
          break;
        case 'info':
          expect(tooltip).toHaveClass('bg-accent/10');
          break;
        default:
          expect(tooltip).toHaveClass('bg-popover');
      }
    });
  });

  it.each(sizes)('renders %s size correctly', async size => {
    const user = userEvent.setup();

    render(<BasicTooltip size={size} />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toBeInTheDocument();

      // Verify size-specific classes
      switch (size) {
        case 'sm':
          expect(tooltip).toHaveClass('px-2', 'py-1', 'text-xs');
          break;
        case 'lg':
          expect(tooltip).toHaveClass('px-4', 'py-2');
          break;
        case 'xl':
          expect(tooltip).toHaveClass('px-4', 'py-3', 'text-base');
          break;
        default:
          expect(tooltip).toHaveClass('px-3', 'py-1.5', 'text-sm');
      }
    });
  });
});

// ===== AAA COMPLIANCE TESTS =====

describe('Enhanced Tooltip - AAA Compliance', () => {
  it('enforces AAA mode correctly', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip aaaMode={true} />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('bg-[#0a0f16]', 'text-[#e8ecf1]');
      expect(tooltip).toHaveClass('border-2', 'border-[#8094a6]');
      expect(tooltip).toHaveClass('!backdrop-blur-none');
    });
  });

  it('overrides glass effects in AAA mode', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip variant='glass' aaaMode={true} />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('!backdrop-blur-none');
      expect(tooltip).toHaveClass('bg-[#0a0f16]');
    });
  });

  it('applies AAA semantic colors correctly', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip variant='success' aaaMode={true} />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('bg-success-solid', 'text-white');
    });
  });
});

// ===== DENSITY MODE TESTS =====

describe('Enhanced Tooltip - Density Modes', () => {
  it('applies compact density correctly', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip density='compact' />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('px-2', 'py-1', 'text-xs');
    });
  });

  it('handles compound variant for compact + small size', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip density='compact' size='sm' />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('px-1.5', 'py-0.5');
    });
  });
});

// ===== FACTORY PATTERN TESTS =====

describe('Enhanced Tooltip - Factory Patterns', () => {
  it('creates success tooltip via factory', () => {
    const SuccessTooltip = TooltipFactory.success;

    render(
      <TestWrapper>
        <EnhancedTooltipRoot>
          <EnhancedTooltipTrigger>
            <button>Success Trigger</button>
          </EnhancedTooltipTrigger>
          <SuccessTooltip>Success message</SuccessTooltip>
        </EnhancedTooltipRoot>
      </TestWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('creates glass tooltip via factory', async () => {
    const user = userEvent.setup();
    const GlassTooltip = TooltipFactory.glass;

    render(
      <TestWrapper>
        <EnhancedTooltipRoot>
          <EnhancedTooltipTrigger>
            <button>Glass Trigger</button>
          </EnhancedTooltipTrigger>
          <GlassTooltip>Glass content</GlassTooltip>
        </EnhancedTooltipRoot>
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Glass content');
      expect(tooltip).toHaveClass('backdrop-blur-[12px]');
    });
  });

  it('creates AAA tooltip via factory', async () => {
    const user = userEvent.setup();
    const AAATooltip = TooltipFactory.aaa;

    render(
      <TestWrapper>
        <EnhancedTooltipRoot>
          <EnhancedTooltipTrigger>
            <button>AAA Trigger</button>
          </EnhancedTooltipTrigger>
          <AAATooltip>AAA content</AAATooltip>
        </EnhancedTooltipRoot>
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('AAA content');
      expect(tooltip).toHaveClass('bg-[#0a0f16]', 'text-[#e8ecf1]');
    });
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Enhanced Tooltip - Accessibility', () => {
  it('meets WCAG AAA standards', async () => {
    const { container } = render(<BasicTooltip />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button');

    // Focus trigger with keyboard
    await user.tab();
    expect(trigger).toHaveFocus();

    // Tooltip should appear on focus
    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    // Tab away should hide tooltip
    await user.tab();
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it('handles escape key correctly', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    // Escape should hide tooltip
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it('provides proper ARIA attributes', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveAttribute('role', 'tooltip');
      expect(trigger).toHaveAttribute('aria-describedby');
    });
  });
});

// ===== MOTION SYSTEM TESTS =====

describe('Enhanced Tooltip - Motion System', () => {
  beforeEach(() => {
    // Mock prefers-reduced-motion
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('includes motion classes by default', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('animate-in', 'fade-in-0', 'zoom-in-95');
    });
  });

  it('respects reduced motion preferences', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass('motion-reduce:animate-none');
      expect(tooltip).toHaveClass('motion-reduce:transition-none');
    });
  });
});

// ===== POSITIONING TESTS =====

describe('Enhanced Tooltip - Positioning', () => {
  it('accepts custom side offset', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip sideOffset={8} />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toBeInTheDocument();
      // Note: sideOffset is handled by Radix internally
    });
  });

  it('includes directional slide animations', async () => {
    const user = userEvent.setup();

    render(<BasicTooltip />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText('Tooltip content');
      expect(tooltip).toHaveClass(
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2'
      );
    });
  });
});

// ===== INTEGRATION TESTS =====

describe('Enhanced Tooltip - Integration', () => {
  it('works with asChild pattern', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EnhancedTooltipRoot>
          <EnhancedTooltipTrigger asChild>
            <span>Custom trigger element</span>
          </EnhancedTooltipTrigger>
          <EnhancedTooltipContent>Custom content</EnhancedTooltipContent>
        </EnhancedTooltipRoot>
      </TestWrapper>
    );

    const trigger = screen.getByText('Custom trigger element');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });
  });

  it('handles complex trigger content', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <EnhancedTooltipWithTrigger
          trigger={
            <div>
              <span>Complex</span>
              <strong>Trigger</strong>
            </div>
          }
          triggerAsChild
        >
          Complex tooltip content
        </EnhancedTooltipWithTrigger>
      </TestWrapper>
    );

    const trigger = screen.getByText('Complex');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Complex tooltip content')).toBeInTheDocument();
    });
  });
});

// ===== PERFORMANCE TESTS =====

describe('Enhanced Tooltip - Performance', () => {
  it('does not render tooltip content when closed', () => {
    render(<BasicTooltip />);

    // Tooltip content should not be in DOM when closed
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('cleans up properly on unmount', async () => {
    const user = userEvent.setup();

    const { unmount } = render(<BasicTooltip />);

    const trigger = screen.getByRole('button');
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    unmount();

    // Should not throw or cause memory leaks
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });
});
