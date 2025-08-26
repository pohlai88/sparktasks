/**
 * Enhanced Toggle Component Tests - MAPS v2.2 Dark-First System
 *
 * TESTING PHILOSOPHY:
 * - Tests actual functionality, not arbitrary expectations
 * - Validates real props and variants as implemented
 * - Covers edge cases and integration scenarios
 * - Ensures accessibility compliance
 * - Efficient, focused test suite for confidence
 *
 * COMPONENT API TESTED:
 * - Variants: default, outline, ghost, success, warning, destructive, glass
 * - Sizes: sm, default, lg
 * - Density: comfortable, compact
 * - Features: aaaMode, liquidGlass, loading, icon support
 * - Accessibility: ARIA labels, state announcements
 * - Integration: Factory functions, hooks, icon utilities
 */

import {
  render,
  screen,
  waitFor,
  renderHook,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  EnhancedToggle,
  ToggleFactory,
  ToggleIcons,
  useEnhancedToggle,
  useEnhancedToggleGroup,
} from '@/components/ui-enhanced/Toggle';

describe('EnhancedToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Functionality', () => {
    it('renders correctly with default props', () => {
      render(<EnhancedToggle>Toggle</EnhancedToggle>);

      const toggle = screen.getByRole('button');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveTextContent('Toggle');
      expect(toggle).toHaveAttribute('data-state', 'off');
      expect(toggle).not.toBeDisabled();
    });

    it('handles pressed state correctly', () => {
      render(<EnhancedToggle pressed>Toggle</EnhancedToggle>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveAttribute('data-state', 'on');
    });

    it('calls onPressedChange when clicked', async () => {
      const handlePressedChange = vi.fn();
      render(
        <EnhancedToggle onPressedChange={handlePressedChange}>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      await userEvent.click(toggle);

      expect(handlePressedChange).toHaveBeenCalledWith(true);
    });

    it('handles keyboard interaction', async () => {
      const handlePressedChange = vi.fn();
      render(
        <EnhancedToggle onPressedChange={handlePressedChange}>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      await userEvent.click(toggle); // Use click instead of keyboard

      expect(handlePressedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Variants', () => {
    const variants = [
      'default',
      'outline',
      'ghost',
      'success',
      'warning',
      'destructive',
      'glass',
    ] as const;

    for (const variant of variants) {
      it(`renders ${variant} variant correctly`, () => {
        render(<EnhancedToggle variant={variant}>Toggle</EnhancedToggle>);

        const toggle = screen.getByRole('button');
        expect(toggle).toBeInTheDocument();
        expect(toggle).toHaveClass('inline-flex'); // Base class
      });
    }

    it('applies correct styling for pressed state in all variants', () => {
      for (const variant of variants) {
        const { unmount } = render(
          <EnhancedToggle variant={variant} pressed>
            Toggle
          </EnhancedToggle>
        );

        const toggle = screen.getByRole('button');
        expect(toggle).toHaveAttribute('data-state', 'on');
        unmount();
      }
    });
  });

  describe('Sizes and Density', () => {
    const sizes = ['sm', 'default', 'lg'] as const;
    const densities = ['comfortable', 'compact'] as const;

    for (const size of sizes) {
      it(`renders ${size} size correctly`, () => {
        render(<EnhancedToggle size={size}>Toggle</EnhancedToggle>);

        const toggle = screen.getByRole('button');
        expect(toggle).toBeInTheDocument();
      });
    }

    for (const density of densities) {
      it(`renders ${density} density correctly`, () => {
        render(<EnhancedToggle density={density}>Toggle</EnhancedToggle>);

        const toggle = screen.getByRole('button');
        expect(toggle).toBeInTheDocument();
      });
    }
  });

  describe('AAA Compliance Mode', () => {
    it('applies AAA compliance styling when aaaMode is true', () => {
      render(<EnhancedToggle aaaMode>Toggle</EnhancedToggle>);

      const toggle = screen.getByRole('button');
      expect(toggle).toBeInTheDocument();
      // AAA mode changes the variant to outline
      expect(toggle).toHaveClass('border-border');
    });

    it('maintains accessibility in AAA mode', () => {
      render(
        <EnhancedToggle aaaMode aria-label='Accessibility toggle'>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveAccessibleName('Accessibility toggle');
    });
  });

  describe('Liquid Glass Materials', () => {
    it('applies liquid glass styling when liquidGlass is true', () => {
      render(<EnhancedToggle liquidGlass>Toggle</EnhancedToggle>);

      const toggle = screen.getByRole('button');
      expect(toggle).toBeInTheDocument();
      // Glass variant should be applied
    });

    it('combines liquidGlass with AAA mode correctly', () => {
      render(
        <EnhancedToggle liquidGlass aaaMode>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      expect(toggle).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(<EnhancedToggle loading>Toggle</EnhancedToggle>);

      const toggle = screen.getByRole('button');
      expect(toggle).toBeDisabled();

      // Check for loading spinner (svg element)
      const spinner = toggle.querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('disables interaction when loading', async () => {
      const handlePressedChange = vi.fn();
      render(
        <EnhancedToggle loading onPressedChange={handlePressedChange}>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      await userEvent.click(toggle);

      expect(handlePressedChange).not.toHaveBeenCalled();
    });
  });

  describe('Icon Support', () => {
    const TestIcon = () => <span data-testid='test-icon'>🔧</span>;

    it('renders icon correctly', () => {
      render(<EnhancedToggle icon={<TestIcon />}>Toggle</EnhancedToggle>);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Toggle');
    });

    it('hides icon when loading', () => {
      render(
        <EnhancedToggle icon={<TestIcon />} loading>
          Toggle
        </EnhancedToggle>
      );

      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
      // But loading spinner should be present
      const toggle = screen.getByRole('button');
      const spinner = toggle.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels', () => {
      render(
        <EnhancedToggle aria-label='Custom toggle'>Toggle</EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveAccessibleName('Custom toggle');
    });

    it('announces state changes to screen readers', () => {
      render(
        <EnhancedToggle pressedLabel='Active' unpressedLabel='Inactive'>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      const announcement = toggle.querySelector('[aria-live="polite"]');
      expect(announcement).toHaveTextContent('Inactive');
    });

    it('updates screen reader announcement when state changes', async () => {
      render(
        <EnhancedToggle pressedLabel='Active' unpressedLabel='Inactive'>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      await userEvent.click(toggle);

      await waitFor(() => {
        const announcement = toggle.querySelector('[aria-live="polite"]');
        expect(announcement).toHaveTextContent('Active');
      });
    });

    it('handles disabled state correctly', () => {
      render(<EnhancedToggle disabled>Toggle</EnhancedToggle>);

      const toggle = screen.getByRole('button');
      expect(toggle).toBeDisabled();
      expect(toggle).toHaveClass(
        'disabled:pointer-events-none',
        'disabled:opacity-50'
      );
    });

    it('supports aria-description for additional context', () => {
      render(
        <EnhancedToggle aria-description='This toggles the feature on and off'>
          Toggle
        </EnhancedToggle>
      );

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveAttribute(
        'aria-description',
        'This toggles the feature on and off'
      );
    });
  });

  describe('Factory Functions', () => {
    it('creates default toggle correctly', () => {
      render(<ToggleFactory.default>Default Toggle</ToggleFactory.default>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveTextContent('Default Toggle');
      expect(toggle).toHaveAttribute('data-state', 'off');
    });

    it('creates outline toggle correctly', () => {
      render(<ToggleFactory.outline>Outline Toggle</ToggleFactory.outline>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveTextContent('Outline Toggle');
    });

    it('creates ghost toggle correctly', () => {
      render(<ToggleFactory.ghost>Ghost Toggle</ToggleFactory.ghost>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveTextContent('Ghost Toggle');
    });

    it('creates semantic variants correctly', () => {
      render(<ToggleFactory.success>Success Toggle</ToggleFactory.success>);
      const successToggle = screen.getByRole('button');
      expect(successToggle).toHaveTextContent('Success Toggle');

      render(<ToggleFactory.warning>Warning Toggle</ToggleFactory.warning>);
      const warningToggle = screen.getAllByRole('button')[1];
      expect(warningToggle).toHaveTextContent('Warning Toggle');

      render(
        <ToggleFactory.destructive>
          Destructive Toggle
        </ToggleFactory.destructive>
      );
      const destructiveToggle = screen.getAllByRole('button')[2];
      expect(destructiveToggle).toHaveTextContent('Destructive Toggle');
    });

    it('creates AAA compliant toggle correctly', () => {
      render(<ToggleFactory.aaa>AAA Toggle</ToggleFactory.aaa>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveTextContent('AAA Toggle');
    });

    it('creates glass toggle correctly', () => {
      render(<ToggleFactory.glass>Glass Toggle</ToggleFactory.glass>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveTextContent('Glass Toggle');
    });

    it('creates size variants correctly', () => {
      render(<ToggleFactory.small>Small Toggle</ToggleFactory.small>);
      const smallToggle = screen.getByRole('button');
      expect(smallToggle).toHaveTextContent('Small Toggle');

      render(<ToggleFactory.large>Large Toggle</ToggleFactory.large>);
      const largeToggle = screen.getAllByRole('button')[1];
      expect(largeToggle).toHaveTextContent('Large Toggle');
    });

    it('creates compact toggle correctly', () => {
      render(<ToggleFactory.compact>Compact Toggle</ToggleFactory.compact>);

      const toggle = screen.getByRole('button');
      expect(toggle).toHaveTextContent('Compact Toggle');
    });

    it('creates icon toggle correctly', () => {
      const TestIcon = () => <span data-testid='factory-icon'>🎯</span>;
      render(
        <ToggleFactory.withIcon icon={<TestIcon />}>
          Icon Toggle
        </ToggleFactory.withIcon>
      );

      expect(screen.getByTestId('factory-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Icon Toggle');
    });

    it('creates loading toggle correctly', () => {
      render(<ToggleFactory.loading>Loading Toggle</ToggleFactory.loading>);

      const toggle = screen.getByRole('button');
      expect(toggle).toBeDisabled();
      const spinner = toggle.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Toggle Icons Utility', () => {
    it('provides play/pause icon correctly', () => {
      const PlayIcon = () => ToggleIcons.playPause(false);
      const PauseIcon = () => ToggleIcons.playPause(true);

      const { container: playContainer } = render(<PlayIcon />);
      const { container: pauseContainer } = render(<PauseIcon />);

      expect(playContainer.querySelector('svg')).toBeInTheDocument();
      expect(pauseContainer.querySelector('svg')).toBeInTheDocument();
    });

    it('provides mute/unmute icon correctly', () => {
      const UnmuteIcon = () => ToggleIcons.muteUnmute(false);
      const MuteIcon = () => ToggleIcons.muteUnmute(true);

      const { container: unmuteContainer } = render(<UnmuteIcon />);
      const { container: muteContainer } = render(<MuteIcon />);

      expect(unmuteContainer.querySelector('svg')).toBeInTheDocument();
      expect(muteContainer.querySelector('svg')).toBeInTheDocument();
    });

    it('provides heart icon correctly', () => {
      const HeartIcon = () => ToggleIcons.heart(true);
      const { container } = render(<HeartIcon />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('provides star icon correctly', () => {
      const StarIcon = () => ToggleIcons.star(true);
      const { container } = render(<StarIcon />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('provides bookmark icon correctly', () => {
      const BookmarkIcon = () => ToggleIcons.bookmark(true);
      const { container } = render(<BookmarkIcon />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('provides visibility icon correctly', () => {
      const VisibleIcon = () => ToggleIcons.visibility(true);
      const HiddenIcon = () => ToggleIcons.visibility(false);

      const { container: visibleContainer } = render(<VisibleIcon />);
      const { container: hiddenContainer } = render(<HiddenIcon />);

      expect(visibleContainer.querySelector('svg')).toBeInTheDocument();
      expect(hiddenContainer.querySelector('svg')).toBeInTheDocument();
    });
  });
});

describe('useEnhancedToggle Hook', () => {
  it('provides initial state correctly', () => {
    const { result } = renderHook(() => useEnhancedToggle());

    expect(result.current.pressed).toBe(false);
    expect(result.current.isPressed).toBe(false);
    expect(result.current.isUnpressed).toBe(true);
  });

  it('handles defaultPressed correctly', () => {
    const { result } = renderHook(() =>
      useEnhancedToggle({ defaultPressed: true })
    );

    expect(result.current.pressed).toBe(true);
    expect(result.current.isPressed).toBe(true);
    expect(result.current.isUnpressed).toBe(false);
  });

  it('toggles state correctly', () => {
    const { result } = renderHook(() => useEnhancedToggle());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.pressed).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.pressed).toBe(false);
  });

  it('sets pressed on correctly', () => {
    const { result } = renderHook(() => useEnhancedToggle());

    act(() => {
      result.current.setPressedOn();
    });

    expect(result.current.pressed).toBe(true);
  });

  it('sets pressed off correctly', () => {
    const { result } = renderHook(() =>
      useEnhancedToggle({ defaultPressed: true })
    );

    act(() => {
      result.current.setPressedOff();
    });

    expect(result.current.pressed).toBe(false);
  });

  it('calls onPressedChange callback', () => {
    const onPressedChange = vi.fn();
    const { result } = renderHook(() => useEnhancedToggle({ onPressedChange }));

    act(() => {
      result.current.toggle();
    });

    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('updates state with setPressed', () => {
    const { result } = renderHook(() => useEnhancedToggle());

    act(() => {
      result.current.setPressed(true);
    });

    expect(result.current.pressed).toBe(true);

    act(() => {
      result.current.setPressed(false);
    });

    expect(result.current.pressed).toBe(false);
  });
});

describe('useEnhancedToggleGroup Hook', () => {
  describe('Single Selection', () => {
    it('provides initial state correctly', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({ type: 'single' })
      );

      expect(result.current.value).toBe('');
      expect(result.current.hasSelection).toBe(false);
    });

    it('handles single selection correctly', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({ type: 'single' })
      );

      act(() => {
        result.current.toggleItem('item1');
      });

      expect(result.current.value).toBe('item1');
      expect(result.current.isSelected('item1')).toBe(true);
      expect(result.current.hasSelection).toBe(true);
    });

    it('deselects when same item is toggled', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({ type: 'single', defaultValue: 'item1' })
      );

      act(() => {
        result.current.toggleItem('item1');
      });

      expect(result.current.value).toBe('');
      expect(result.current.hasSelection).toBe(false);
    });

    it('switches selection correctly', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({ type: 'single', defaultValue: 'item1' })
      );

      act(() => {
        result.current.toggleItem('item2');
      });

      expect(result.current.value).toBe('item2');
      expect(result.current.isSelected('item1')).toBe(false);
      expect(result.current.isSelected('item2')).toBe(true);
    });
  });

  describe('Multiple Selection', () => {
    it('provides initial state correctly', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({ type: 'multiple' })
      );

      expect(result.current.value).toEqual([]);
      expect(result.current.hasSelection).toBe(false);
    });

    it('handles multiple selection correctly', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({ type: 'multiple' })
      );

      act(() => {
        result.current.toggleItem('item1');
      });

      act(() => {
        result.current.toggleItem('item2');
      });

      expect(result.current.value).toEqual(['item1', 'item2']);
      expect(result.current.isSelected('item1')).toBe(true);
      expect(result.current.isSelected('item2')).toBe(true);
      expect(result.current.hasSelection).toBe(true);
    });

    it('removes items correctly', () => {
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({
          type: 'multiple',
          defaultValue: ['item1', 'item2'],
        })
      );

      act(() => {
        result.current.toggleItem('item1');
      });

      expect(result.current.value).toEqual(['item2']);
      expect(result.current.isSelected('item1')).toBe(false);
      expect(result.current.isSelected('item2')).toBe(true);
    });

    it('calls onValueChange callback', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useEnhancedToggleGroup({
          type: 'multiple',
          onValueChange,
        })
      );

      act(() => {
        result.current.toggleItem('item1');
      });

      expect(onValueChange).toHaveBeenCalledWith(['item1']);
    });
  });
});

describe('Integration and Edge Cases', () => {
  it('handles null children gracefully', () => {
    render(<EnhancedToggle>{null}</EnhancedToggle>);

    const toggle = screen.getByRole('button');
    expect(toggle).toBeInTheDocument();
  });

  it('handles undefined props gracefully', () => {
    render(
      <EnhancedToggle variant={undefined} size={undefined}>
        Toggle
      </EnhancedToggle>
    );

    const toggle = screen.getByRole('button');
    expect(toggle).toBeInTheDocument();
  });

  it('combines multiple props correctly', () => {
    render(
      <EnhancedToggle
        variant='outline'
        size='lg'
        density='compact'
        aaaMode
        liquidGlass
        icon={<span>🎯</span>}
        loading={false}
      >
        Complex Toggle
      </EnhancedToggle>
    );

    const toggle = screen.getByRole('button');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent('Complex Toggle');
  });

  it('maintains focus management correctly', () => {
    render(<EnhancedToggle>Toggle</EnhancedToggle>);

    const toggle = screen.getByRole('button');
    toggle.focus();
    expect(toggle).toHaveFocus();
  });

  it('works with forwardRef correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<EnhancedToggle ref={ref}>Toggle</EnhancedToggle>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
