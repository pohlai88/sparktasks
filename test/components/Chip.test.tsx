import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Chip, ChipVariant, ChipSize, ChipStatus } from '@/components/ui/Chip';

describe('Chip - Optimized Enterprise Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders with DESIGN_TOKENS styling', () => {
      render(<Chip>Test Chip</Chip>);
      expect(screen.getByText('Test Chip')).toBeInTheDocument();
      expect(screen.getByTestId('chip')).toHaveAttribute('data-variant', 'default');
    });

    it('supports all variants', () => {
      const variants: ChipVariant[] = ['default', 'success', 'warning', 'danger', 'info', 'outline', 'solid', 'ghost'];
      variants.forEach(variant => {
        const { unmount } = render(<Chip variant={variant}>Chip {variant}</Chip>);
        expect(screen.getByText(`Chip ${variant}`)).toBeInTheDocument();
        expect(screen.getByTestId('chip')).toHaveAttribute('data-variant', variant);
        unmount();
      });
    });

    it('handles empty children gracefully', () => {
      render(<Chip> </Chip>);
      expect(screen.getByTestId('chip')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Chip ref={ref}>Test</Chip>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    });
  });

  describe('Size Variants', () => {
    it.each<ChipSize>(['xs', 'sm', 'md', 'lg'])('applies %s size correctly', (size) => {
      render(<Chip size={size}>Size {size}</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('data-size', size);
    });

    it('defaults to md size when not specified', () => {
      render(<Chip>Default size</Chip>);
      expect(screen.getByTestId('chip')).toHaveAttribute('data-size', 'md');
    });
  });

  describe('Status Indicators', () => {
    it.each<ChipStatus>(['success', 'warning', 'danger', 'info'])('displays %s status icon', (status) => {
      render(<Chip status={status}>Status {status}</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('data-status', status);
      expect(chip).toHaveAttribute('role', 'status');
      expect(chip).toHaveAttribute('aria-live', 'polite');
    });

    it('provides status screen reader text when no aria-label', () => {
      render(<Chip status="success">Success chip</Chip>);
      expect(screen.getByText('Success', { selector: '.sr-only' })).toBeInTheDocument();
    });

    it('skips status screen reader text when aria-label provided', () => {
      render(<Chip status="success" ariaLabel="Custom label">Success chip</Chip>);
      expect(screen.queryByText('Success', { selector: '.sr-only' })).not.toBeInTheDocument();
    });

    it('adapts status icon size to chip size', () => {
      render(<Chip status="success" size="lg">Large success</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip.querySelector('svg')).toHaveClass('size-4');
    });
  });

  describe('Interactive Features', () => {
    it('becomes interactive when onSelect is provided', () => {
      const onSelect = vi.fn();
      render(<Chip onSelect={onSelect}>Selectable</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('role', 'button');
      expect(chip).toHaveAttribute('tabindex', '0');
      expect(chip).toHaveAttribute('data-interactive', 'true');
    });

    it('handles selection via click', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(<Chip onSelect={onSelect}>Selectable</Chip>);
      
      await user.click(screen.getByTestId('chip'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('handles selection via keyboard', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(<Chip onSelect={onSelect} interactive>Selectable</Chip>);
      
      const chip = screen.getByTestId('chip');
      chip.focus();
      await user.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(onSelect).toHaveBeenCalledTimes(2);
    });

    it('shows selected state correctly', () => {
      render(<Chip selected onSelect={vi.fn()}>Selected</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('aria-pressed', 'true');
      expect(chip).toHaveAttribute('data-selected', 'true');
    });

    it('handles interactive prop correctly', () => {
      const onClick = vi.fn();
      render(<Chip interactive onClick={onClick}>Interactive</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('data-interactive', 'true');
      expect(chip).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button is clicked and label is correct', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<Chip onClose={onClose} ariaLabel="My chip">Closable</Chip>);
      
      const button = screen.getByRole('button', { name: /remove my chip/i });
      await user.click(button);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('close button does not propagate click to parent', async () => {
      const parentClick = vi.fn();
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <div role="button" tabIndex={0} onClick={parentClick} onKeyDown={() => {}}>
          <Chip onClose={onClose} ariaLabel="Chip">Closable</Chip>
        </div>
      );
      
      const button = screen.getByRole('button', { name: /remove chip/i });
      await user.click(button);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(parentClick).not.toHaveBeenCalled();
    });

    it('handles close via keyboard on close button', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<Chip onClose={onClose}>Closable</Chip>);
      
      const button = screen.getByTestId('chip-close-button');
      button.focus();
      await user.keyboard('{Enter}');
      expect(onClose).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('handles close via Delete/Backspace on chip', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<Chip onClose={onClose} interactive>Closable</Chip>);
      
      const chip = screen.getByTestId('chip');
      chip.focus();
      await user.keyboard('{Delete}');
      expect(onClose).toHaveBeenCalledTimes(1);
      
      await user.keyboard('{Backspace}');
      expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('sizes close button according to chip size', () => {
      render(<Chip onClose={vi.fn()} size="xs">Small closable</Chip>);
      const button = screen.getByTestId('chip-close-button');
      expect(button).toHaveClass('size-3');
      expect(button.querySelector('svg')).toHaveClass('size-2');
    });
  });

  describe('Disabled State', () => {
    it('prevents interaction when disabled', async () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(<Chip disabled onSelect={onSelect} onClose={onClose}>Disabled</Chip>);
      const chip = screen.getByTestId('chip');
      
      expect(chip).toHaveAttribute('aria-disabled', 'true');
      expect(chip).toHaveAttribute('data-disabled', 'true');
      expect(chip).not.toHaveAttribute('tabindex');
      
      await user.click(chip);
      expect(onSelect).not.toHaveBeenCalled();
      
      const closeButton = screen.getByTestId('chip-close-button');
      expect(closeButton).toBeDisabled();
    });

    it('shows disabled styling', () => {
      render(<Chip disabled>Disabled chip</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Loading State', () => {
    it('displays skeleton when loading', () => {
      render(<Chip loading>Loading content</Chip>);
      expect(screen.getByTestId('chip-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('Loading content')).not.toBeInTheDocument();
    });

    it('skeleton adapts to size', () => {
      render(<Chip loading size="lg">Loading</Chip>);
      const skeleton = screen.getByTestId('chip-skeleton');
      expect(skeleton).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Icons and Avatar', () => {
    it('displays icon when provided', () => {
      const icon = <span data-testid="test-icon">🔥</span>;
      render(<Chip icon={icon}>With icon</Chip>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('displays avatar when provided', () => {
      const avatar = <img data-testid="test-avatar" src="avatar.jpg" alt="User" />;
      render(<Chip avatar={avatar}>With avatar</Chip>);
      expect(screen.getByTestId('test-avatar')).toBeInTheDocument();
    });

    it('prioritizes status icon over regular icon', () => {
      const icon = <span data-testid="regular-icon">🔥</span>;
      render(<Chip icon={icon} status="success">Priority test</Chip>);
      expect(screen.queryByTestId('regular-icon')).not.toBeInTheDocument();
      expect(screen.getByTestId('chip').querySelector('svg')).toBeInTheDocument();
    });

    it('shows both avatar and status icon', () => {
      const avatar = <img data-testid="test-avatar" src="avatar.jpg" alt="User" />;
      render(<Chip avatar={avatar} status="success">Both icons</Chip>);
      expect(screen.getByTestId('test-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('chip').querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Counter Feature', () => {
    it('displays counter when provided', () => {
      render(<Chip counter={5}>With counter</Chip>);
      const counter = screen.getByTestId('chip-counter');
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent('5');
      expect(counter).toHaveAttribute('aria-label', 'Count: 5');
    });

    it('shows max counter with plus when exceeding limit', () => {
      render(<Chip counter={150} maxCounter={99}>High counter</Chip>);
      const counter = screen.getByTestId('chip-counter');
      expect(counter).toHaveTextContent('99+');
    });

    it('does not display counter for zero or negative values', () => {
      render(<Chip counter={0}>Zero counter</Chip>);
      expect(screen.queryByTestId('chip-counter')).not.toBeInTheDocument();
      
      render(<Chip counter={-5}>Negative counter</Chip>);
      expect(screen.queryByTestId('chip-counter')).not.toBeInTheDocument();
    });

    it('uses custom maxCounter value', () => {
      render(<Chip counter={25} maxCounter={20}>Custom max</Chip>);
      const counter = screen.getByTestId('chip-counter');
      expect(counter).toHaveTextContent('20+');
    });
  });

  describe('Accessibility', () => {
    it('has correct data attributes and a11y label', () => {
      render(<Chip variant="success" size="lg" ariaLabel="My chip">Chip Content</Chip>);
      const chip = screen.getByLabelText('My chip');
      expect(chip).toHaveAttribute('data-variant', 'success');
      expect(chip).toHaveAttribute('data-size', 'lg');
    });

    it('provides comprehensive aria attributes for interactive chips', () => {
      render(<Chip onSelect={vi.fn()} selected ariaLabel="Toggle chip">Interactive</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('role', 'button');
      expect(chip).toHaveAttribute('aria-pressed', 'true');
      expect(chip).toHaveAttribute('aria-label', 'Toggle chip');
      expect(chip).toHaveAttribute('tabindex', '0');
    });

    it('maintains focus management for keyboard users', async () => {
      const user = userEvent.setup();
      render(<Chip onSelect={vi.fn()}>Focusable</Chip>);
      
      const chip = screen.getByTestId('chip');
      await user.tab();
      expect(chip).toHaveFocus();
    });

    it('announces loading state to screen readers', () => {
      render(<Chip loading>Loading chip</Chip>);
      const skeleton = screen.getByTestId('chip-skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Performance Optimizations', () => {
    it('maintains stable references across re-renders with same props', () => {
      const onSelect = vi.fn();
      const { rerender } = render(<Chip onSelect={onSelect}>Test</Chip>);
      const initialChip = screen.getByTestId('chip');
      
      rerender(<Chip onSelect={onSelect}>Test</Chip>);
      const rerenderedChip = screen.getByTestId('chip');
      
      expect(initialChip).toBe(rerenderedChip);
    });

    it('updates efficiently when props change', () => {
      const { rerender } = render(<Chip variant="default">Test</Chip>);
      expect(screen.getByTestId('chip')).toHaveAttribute('data-variant', 'default');
      
      rerender(<Chip variant="success">Test</Chip>);
      expect(screen.getByTestId('chip')).toHaveAttribute('data-variant', 'success');
    });
  });

  describe('Prop Forwarding', () => {
    it('forwards container props correctly', () => {
      render(<Chip id="test-chip" data-custom="value">Test</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('id', 'test-chip');
      expect(chip).toHaveAttribute('data-custom', 'value');
    });

    it('applies custom className to container', () => {
      render(<Chip className="custom-class">Test</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveClass('custom-class');
    });

    it('forwards onClick when interactive', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<Chip onClick={onClick} interactive>Clickable</Chip>);
      
      await user.click(screen.getByTestId('chip'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onSelect gracefully for selected state', () => {
      render(<Chip selected>Selected without handler</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('data-selected', 'true');
      expect(() => fireEvent.click(chip)).not.toThrow();
    });

    it('handles simultaneous interactive and close features', async () => {
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(<Chip onSelect={onSelect} onClose={onClose}>Multi-function</Chip>);
      
      // Click chip (should select)
      await user.click(screen.getByTestId('chip'));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
      
      // Click close button (should close)
      await user.click(screen.getByTestId('chip-close-button'));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledTimes(1); // Should not increment
    });

    it('handles very long content gracefully', () => {
      const longContent = 'This is a very long chip content that might cause layout issues if not handled properly';
      render(<Chip>{longContent}</Chip>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      // Test default values when props are not provided
      render(<Chip>Undefined props</Chip>);
      const chip = screen.getByTestId('chip');
      expect(chip).toHaveAttribute('data-variant', 'default');
      expect(chip).toHaveAttribute('data-size', 'md');
    });
  });
});
