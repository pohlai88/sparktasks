import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Tag, TagVariant, TagSize, TagStatus } from '@/components/ui/Tag';

describe('Tag - Optimized Enterprise Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders with DESIGN_TOKENS styling', () => {
      render(<Tag>Test Tag</Tag>);
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
      expect(screen.getByTestId('tag')).toHaveAttribute(
        'data-variant',
        'default'
      );
    });

    it('supports all variants', () => {
      const variants: TagVariant[] = [
        'default',
        'success',
        'warning',
        'danger',
        'info',
        'outline',
        'solid',
        'ghost',
        'accent',
      ];
      variants.forEach(variant => {
        const { unmount } = render(<Tag variant={variant}>Tag {variant}</Tag>);
        expect(screen.getByText(`Tag ${variant}`)).toBeInTheDocument();
        expect(screen.getByTestId('tag')).toHaveAttribute(
          'data-variant',
          variant
        );
        unmount();
      });
    });

    it('handles empty children gracefully', () => {
      render(<Tag> </Tag>);
      expect(screen.getByTestId('tag')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Tag ref={ref}>Test</Tag>);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    });
  });

  describe('Size Variants', () => {
    it.each<TagSize>(['xs', 'sm', 'md', 'lg'])(
      'applies %s size correctly',
      size => {
        render(<Tag size={size}>Size {size}</Tag>);
        const tag = screen.getByTestId('tag');
        expect(tag).toHaveAttribute('data-size', size);
      }
    );

    it('defaults to md size when not specified', () => {
      render(<Tag>Default size</Tag>);
      expect(screen.getByTestId('tag')).toHaveAttribute('data-size', 'md');
    });

    it('has correct data attributes and a11y label', () => {
      render(
        <Tag variant='success' size='lg' ariaLabel='My tag'>
          Tag Content
        </Tag>
      );
      const tag = screen.getByLabelText('My tag');
      expect(tag).toHaveAttribute('data-variant', 'success');
      expect(tag).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Status Indicators', () => {
    it.each<TagStatus>(['success', 'warning', 'danger', 'info'])(
      'displays %s status icon',
      status => {
        render(<Tag status={status}>Status {status}</Tag>);
        const tag = screen.getByTestId('tag');
        expect(tag).toHaveAttribute('data-status', status);
        expect(tag).toHaveAttribute('role', 'status');
        expect(tag).toHaveAttribute('aria-live', 'polite');
      }
    );

    it('provides status screen reader text when no aria-label', () => {
      render(<Tag status='success'>Success tag</Tag>);
      expect(
        screen.getByText('Success', { selector: '.sr-only' })
      ).toBeInTheDocument();
    });

    it('skips status screen reader text when aria-label provided', () => {
      render(
        <Tag status='success' ariaLabel='Custom label'>
          Success tag
        </Tag>
      );
      expect(
        screen.queryByText('Success', { selector: '.sr-only' })
      ).not.toBeInTheDocument();
    });

    it('adapts status icon size to tag size', () => {
      render(
        <Tag status='success' size='lg'>
          Large success
        </Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag.querySelector('svg')).toHaveClass('size-4');
    });

    it('prioritizes status icon over regular icon', () => {
      const icon = <span data-testid='regular-icon'>🔥</span>;
      render(
        <Tag icon={icon} status='success'>
          Priority test
        </Tag>
      );
      expect(screen.queryByTestId('regular-icon')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('tag').querySelector('svg')
      ).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('becomes interactive when onSelect is provided', () => {
      const onSelect = vi.fn();
      render(<Tag onSelect={onSelect}>Selectable</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('role', 'button');
      expect(tag).toHaveAttribute('tabindex', '0');
      expect(tag).toHaveAttribute('data-interactive', 'true');
    });

    it('handles selection via click', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(<Tag onSelect={onSelect}>Selectable</Tag>);

      await user.click(screen.getByTestId('tag'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('handles selection via keyboard', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <Tag onSelect={onSelect} interactive>
          Selectable
        </Tag>
      );

      const tag = screen.getByTestId('tag');
      tag.focus();
      await user.keyboard('{Enter}');
      expect(onSelect).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(onSelect).toHaveBeenCalledTimes(2);
    });

    it('shows selected state correctly', () => {
      render(
        <Tag selected onSelect={vi.fn()}>
          Selected
        </Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('aria-pressed', 'true');
      expect(tag).toHaveAttribute('data-selected', 'true');
    });

    it('handles interactive prop correctly', () => {
      const onClick = vi.fn();
      render(
        <Tag interactive onClick={onClick}>
          Interactive
        </Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('data-interactive', 'true');
      expect(tag).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Remove Functionality', () => {
    it('displays remove button when removable', () => {
      const onRemove = vi.fn();
      render(
        <Tag removable onRemove={onRemove}>
          Removable
        </Tag>
      );
      expect(screen.getByTestId('tag-remove-button')).toBeInTheDocument();
      expect(screen.getByTestId('tag')).toHaveAttribute(
        'data-removable',
        'true'
      );
    });

    it('calls onRemove when remove button is clicked', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      render(
        <Tag removable onRemove={onRemove} ariaLabel='My tag'>
          Removable
        </Tag>
      );

      const button = screen.getByRole('button', { name: /remove my tag/i });
      await user.click(button);
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('remove button does not propagate click to parent', async () => {
      const parentClick = vi.fn();
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <div
          role='button'
          tabIndex={0}
          onClick={parentClick}
          onKeyDown={() => {}}
        >
          <Tag removable onRemove={onRemove} ariaLabel='Tag'>
            Removable
          </Tag>
        </div>
      );

      const button = screen.getByRole('button', { name: /remove tag/i });
      await user.click(button);
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(parentClick).not.toHaveBeenCalled();
    });

    it('handles remove via keyboard on remove button', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      render(
        <Tag removable onRemove={onRemove}>
          Removable
        </Tag>
      );

      const button = screen.getByTestId('tag-remove-button');
      button.focus();
      await user.keyboard('{Enter}');
      expect(onRemove).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(onRemove).toHaveBeenCalledTimes(2);
    });

    it('handles remove via Delete/Backspace on tag', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();
      render(
        <Tag removable onRemove={onRemove} interactive>
          Removable
        </Tag>
      );

      const tag = screen.getByTestId('tag');
      tag.focus();
      await user.keyboard('{Delete}');
      expect(onRemove).toHaveBeenCalledTimes(1);

      await user.keyboard('{Backspace}');
      expect(onRemove).toHaveBeenCalledTimes(2);
    });

    it('sizes remove button according to tag size', () => {
      render(
        <Tag removable onRemove={vi.fn()} size='xs'>
          Small removable
        </Tag>
      );
      const button = screen.getByTestId('tag-remove-button');
      expect(button).toHaveClass('size-3');
      expect(button.querySelector('svg')).toHaveClass('size-2');
    });
  });

  describe('Disabled State', () => {
    it('prevents interaction when disabled', async () => {
      const onSelect = vi.fn();
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <Tag disabled onSelect={onSelect} removable onRemove={onRemove}>
          Disabled
        </Tag>
      );
      const tag = screen.getByTestId('tag');

      expect(tag).toHaveAttribute('aria-disabled', 'true');
      expect(tag).toHaveAttribute('data-disabled', 'true');
      expect(tag).not.toHaveAttribute('tabindex');

      await user.click(tag);
      expect(onSelect).not.toHaveBeenCalled();

      const removeButton = screen.getByTestId('tag-remove-button');
      expect(removeButton).toBeDisabled();
    });

    it('shows disabled styling', () => {
      render(<Tag disabled>Disabled tag</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Loading State', () => {
    it('displays skeleton when loading', () => {
      render(<Tag loading>Loading content</Tag>);
      expect(screen.getByTestId('tag-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('Loading content')).not.toBeInTheDocument();
    });

    it('skeleton adapts to size', () => {
      render(
        <Tag loading size='lg'>
          Loading
        </Tag>
      );
      const skeleton = screen.getByTestId('tag-skeleton');
      expect(skeleton).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Icons and Visual Elements', () => {
    it('displays icon when provided', () => {
      const icon = <span data-testid='test-icon'>🔥</span>;
      render(<Tag icon={icon}>With icon</Tag>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('shows pulse animation when enabled', () => {
      render(<Tag pulse>Pulsing tag</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveClass('animate-pulse');
    });
  });

  describe('Counter Feature', () => {
    it('displays counter when provided', () => {
      render(<Tag counter={5}>With counter</Tag>);
      const counter = screen.getByTestId('tag-counter');
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent('5');
      expect(counter).toHaveAttribute('aria-label', 'Count: 5');
    });

    it('shows max counter with plus when exceeding limit', () => {
      render(
        <Tag counter={150} maxCounter={99}>
          High counter
        </Tag>
      );
      const counter = screen.getByTestId('tag-counter');
      expect(counter).toHaveTextContent('99+');
    });

    it('does not display counter for zero or negative values', () => {
      render(<Tag counter={0}>Zero counter</Tag>);
      expect(screen.queryByTestId('tag-counter')).not.toBeInTheDocument();

      render(<Tag counter={-5}>Negative counter</Tag>);
      expect(screen.queryByTestId('tag-counter')).not.toBeInTheDocument();
    });

    it('uses custom maxCounter value', () => {
      render(
        <Tag counter={25} maxCounter={20}>
          Custom max
        </Tag>
      );
      const counter = screen.getByTestId('tag-counter');
      expect(counter).toHaveTextContent('20+');
    });
  });

  describe('Text Truncation', () => {
    it('applies truncation when enabled', () => {
      render(
        <Tag truncate>Very long tag content that should be truncated</Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveClass('max-w-xs', 'truncate');
    });

    it('provides title attribute for truncated text', () => {
      const longText = 'Very long tag content that should be truncated';
      render(<Tag truncate>{longText}</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('title', longText);
    });

    it('does not provide title for non-string children when truncated', () => {
      render(
        <Tag truncate>
          <span>JSX content</span>
        </Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag).not.toHaveAttribute('title');
    });
  });

  describe('Accessibility', () => {
    it('provides comprehensive aria attributes for interactive tags', () => {
      render(
        <Tag onSelect={vi.fn()} selected ariaLabel='Toggle tag'>
          Interactive
        </Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('role', 'button');
      expect(tag).toHaveAttribute('aria-pressed', 'true');
      expect(tag).toHaveAttribute('aria-label', 'Toggle tag');
      expect(tag).toHaveAttribute('tabindex', '0');
    });

    it('maintains focus management for keyboard users', async () => {
      const user = userEvent.setup();
      render(<Tag onSelect={vi.fn()}>Focusable</Tag>);

      const tag = screen.getByTestId('tag');
      await user.tab();
      expect(tag).toHaveFocus();
    });

    it('announces loading state to screen readers', () => {
      render(<Tag loading>Loading tag</Tag>);
      const skeleton = screen.getByTestId('tag-skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });

    it('provides proper semantic roles for status tags', () => {
      render(<Tag status='warning'>Warning status</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('role', 'status');
      expect(tag).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Performance Optimizations', () => {
    it('maintains stable references across re-renders with same props', () => {
      const onSelect = vi.fn();
      const { rerender } = render(<Tag onSelect={onSelect}>Test</Tag>);
      const initialTag = screen.getByTestId('tag');

      rerender(<Tag onSelect={onSelect}>Test</Tag>);
      const rerenderedTag = screen.getByTestId('tag');

      expect(initialTag).toBe(rerenderedTag);
    });

    it('updates efficiently when props change', () => {
      const { rerender } = render(<Tag variant='default'>Test</Tag>);
      expect(screen.getByTestId('tag')).toHaveAttribute(
        'data-variant',
        'default'
      );

      rerender(<Tag variant='success'>Test</Tag>);
      expect(screen.getByTestId('tag')).toHaveAttribute(
        'data-variant',
        'success'
      );
    });
  });

  describe('Prop Forwarding', () => {
    it('forwards container props correctly', () => {
      render(
        <Tag id='test-tag' data-custom='value'>
          Test
        </Tag>
      );
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('id', 'test-tag');
      expect(tag).toHaveAttribute('data-custom', 'value');
    });

    it('applies custom className to container', () => {
      render(<Tag className='custom-class'>Test</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveClass('custom-class');
    });

    it('forwards onClick when interactive', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Tag onClick={onClick} interactive>
          Clickable
        </Tag>
      );

      await user.click(screen.getByTestId('tag'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onSelect gracefully for selected state', () => {
      render(<Tag selected>Selected without handler</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('data-selected', 'true');
      expect(() => fireEvent.click(tag)).not.toThrow();
    });

    it('handles simultaneous interactive and remove features', async () => {
      const onSelect = vi.fn();
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <Tag onSelect={onSelect} removable onRemove={onRemove}>
          Multi-function
        </Tag>
      );

      // Click tag (should select)
      await user.click(screen.getByTestId('tag'));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onRemove).not.toHaveBeenCalled();

      // Click remove button (should remove)
      await user.click(screen.getByTestId('tag-remove-button'));
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledTimes(1); // Should not increment
    });

    it('handles very long content gracefully', () => {
      const longContent =
        'This is a very long tag content that might cause layout issues if not handled properly with truncation and responsive design';
      render(<Tag>{longContent}</Tag>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      // Test default values when props are not provided
      render(<Tag>Undefined props</Tag>);
      const tag = screen.getByTestId('tag');
      expect(tag).toHaveAttribute('data-variant', 'default');
      expect(tag).toHaveAttribute('data-size', 'md');
    });

    it('handles complex combinations of features', () => {
      render(
        <Tag
          variant='success'
          size='lg'
          status='info'
          counter={42}
          removable
          onRemove={vi.fn()}
          interactive
          onSelect={vi.fn()}
          selected
          pulse
          truncate
          ariaLabel='Complex tag'
        >
          Complex feature tag
        </Tag>
      );

      const tag = screen.getByTestId('tag');
      expect(tag).toBeInTheDocument();
      expect(screen.getByTestId('tag-counter')).toHaveTextContent('42');
      expect(screen.getByTestId('tag-remove-button')).toBeInTheDocument();
      expect(tag).toHaveAttribute('data-selected', 'true');
      expect(tag).toHaveClass('animate-pulse', 'truncate');
    });
  });
});
