import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Tooltip from '@/components/ui/Tooltip';

// Mock timers for delay testing
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('Tooltip Component', () => {
  describe('Basic Functionality', () => {
    it('renders children without tooltip initially', () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip on hover with default delay', async () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });
      
      // Should not show immediately
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      
      // Fast-forward past delay
      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', async () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await act(async () => {
        fireEvent.mouseLeave(trigger);
      });
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Trigger Types', () => {
    it('shows tooltip on focus when trigger is focus', async () => {
      render(
        <Tooltip content="Focus tooltip" trigger="focus">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.focus(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('shows tooltip on click when trigger is click', async () => {
      render(
        <Tooltip content="Click tooltip" trigger="click">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.click(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('supports multiple triggers', async () => {
      render(
        <Tooltip content="Multi trigger" trigger={['hover', 'focus']}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      // Test hover
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await act(async () => {
        fireEvent.mouseLeave(trigger);
      });
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Test focus
      await act(async () => {
        fireEvent.focus(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('supports controlled open state', () => {
      const onOpenChange = vi.fn();
      render(
        <Tooltip content="Controlled tooltip" open={true} onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('calls onOpenChange when state should change', async () => {
      const onOpenChange = vi.fn();
      render(
        <Tooltip content="Controlled tooltip" open={false} onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Positioning', () => {
    it('applies correct position classes', () => {
      render(
        <Tooltip content="Test tooltip" position="bottom" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      const tooltip = screen.getByTestId('tooltip-content');
      expect(tooltip).toHaveAttribute('data-position', 'bottom');
    });

    it('defaults to top position', () => {
      render(
        <Tooltip content="Test tooltip" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      const tooltip = screen.getByTestId('tooltip-content');
      expect(tooltip).toHaveAttribute('data-position', 'top');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      render(
        <Tooltip content="Accessible tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('aria-label', 'Accessible tooltip');
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    });

    it('supports custom aria-label', async () => {
      render(
        <Tooltip content="Tooltip content" ariaLabel="Custom label">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('aria-label', 'Custom label');
    });

    it('hides tooltip on Escape key', async () => {
      render(
        <Tooltip content="Test tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await act(async () => {
        fireEvent.keyDown(trigger, { key: 'Escape' });
      });
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Custom Delays', () => {
    it('respects custom show delay', async () => {
      render(
        <Tooltip content="Delayed tooltip" delayShow={500}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });
      
      // Should not show before delay
      await act(async () => {
        vi.advanceTimersByTime(400);
      });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      
      // Should show after delay
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('respects custom hide delay', async () => {
      render(
        <Tooltip content="Delayed hide tooltip" delayHide={300}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await act(async () => {
        fireEvent.mouseLeave(trigger);
      });
      
      // Should still be visible during hide delay
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      
      // Should hide after delay
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('does not show tooltip when disabled', async () => {
      render(
        <Tooltip content="Disabled tooltip" disabled>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Touch Support', () => {
    it('shows tooltip on touch start for hover trigger', async () => {
      render(
        <Tooltip content="Touch tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.touchStart(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('hides tooltip on touch end for hover trigger', async () => {
      render(
        <Tooltip content="Touch tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.touchStart(trigger);
        vi.advanceTimersByTime(200);
      });
      
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await act(async () => {
        fireEvent.touchEnd(trigger);
      });
      
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Event Handler Composition', () => {
    it('preserves original event handlers', async () => {
      const originalClick = vi.fn();
      const originalHover = vi.fn();

      render(
        <Tooltip content="Composed tooltip">
          <button onClick={originalClick} onMouseEnter={originalHover}>
            Trigger
          </button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.click(trigger);
      });
      expect(originalClick).toHaveBeenCalled();
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
      });
      expect(originalHover).toHaveBeenCalled();
    });
  });

  describe('Complex Content', () => {
    it('renders complex React content', async () => {
      const complexContent = (
        <div>
          <strong>Title</strong>
          <p>Description with <em>emphasis</em></p>
        </div>
      );

      render(
        <Tooltip content={complexContent}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.mouseEnter(trigger);
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description with')).toBeInTheDocument();
      expect(screen.getByText('emphasis')).toBeInTheDocument();
    });
  });
});
