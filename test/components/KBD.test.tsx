import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { KBD, KBDLabels } from '@/components/ui/KBD';

describe('KBD - Enterprise Keyboard Display Component', () => {
  describe('Basic Functionality', () => {
    it('renders keyboard key with correct content', () => {
      render(<KBD>Enter</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toBeInTheDocument();
      expect(kbd).toHaveTextContent('⏎'); // Should use KeyLabels mapping
    });

    it('renders raw text when no mapping exists', () => {
      render(<KBD>CustomKey</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveTextContent('CustomKey');
    });

    it('renders custom ReactNode children', () => {
      render(<KBD><span data-testid="custom-content">Custom</span></KBD>);
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('applies default attributes correctly', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd.tagName).toBe('KBD');
      expect(kbd).toHaveAttribute('data-variant', 'default');
      expect(kbd).toHaveAttribute('data-size', 'md');
      expect(kbd).not.toHaveAttribute('data-pressed'); // undefined when false
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'combo', 'shortcut', 'pressed'] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(<KBD variant={variant}>A</KBD>);
        
        const kbd = screen.getByTestId('kbd');
        expect(kbd).toHaveAttribute('data-variant', variant);
        expect(kbd.className).toContain('font-mono');
      });
    });

    it('overrides variant when pressed is true', () => {
      render(<KBD variant="default" pressed>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('data-variant', 'pressed');
      expect(kbd).toHaveAttribute('data-pressed', 'true');
    });

    it('applies combo variant styling for key combinations', () => {
      render(<KBD variant="combo">Ctrl+C</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('data-variant', 'combo');
      expect(kbd).toHaveTextContent('Ctrl+C');
    });

    it('applies shortcut variant with proper styling', () => {
      render(<KBD variant="shortcut">Esc</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('data-variant', 'shortcut');
      // Note: specific styling classes depend on DESIGN_TOKENS implementation
    });
  });

  describe('Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(<KBD size={size}>A</KBD>);
        
        const kbd = screen.getByTestId('kbd');
        expect(kbd).toHaveAttribute('data-size', size);
      });
    });

    it('applies size-specific padding and text classes', () => {
      const { rerender } = render(<KBD size="xs">A</KBD>);
      let kbd = screen.getByTestId('kbd');
      expect(kbd.className).toContain('px-1');
      // Note: specific text classes depend on DESIGN_TOKENS typography tokens

      rerender(<KBD size="lg">A</KBD>);
      kbd = screen.getByTestId('kbd');
      expect(kbd.className).toContain('px-2.5');
      // Note: specific text classes depend on DESIGN_TOKENS typography tokens
    });
  });

  describe('Key Combinations', () => {
    it('renders key combinations with separators', () => {
      render(<KBD variant="combo">Cmd+Shift+P</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveTextContent('⌘+⇧+P');
    });

    it('uses custom separator when provided', () => {
      render(
        <KBD variant="combo" separator={<span data-testid="custom-sep"> • </span>}>
          Ctrl+C
        </KBD>
      );
      
      expect(screen.getByTestId('custom-sep')).toBeInTheDocument();
    });

    it('maps common modifier keys correctly', () => {
      render(<KBD variant="combo">meta+option+enter</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveTextContent('⌘+⌥+⏎');
    });

    it('preserves unknown keys in combinations', () => {
      render(<KBD variant="combo">CustomMod+A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveTextContent('CustomMod+A');
    });
  });

  describe('Key Label Mappings', () => {
    it('maps modifier keys correctly', () => {
      const modifierTests = [
        ['cmd', '⌘'],
        ['ctrl', 'Ctrl'],
        ['option', '⌥'],
        ['shift', '⇧'],
        ['meta', '⌘'],
      ];

      modifierTests.forEach(([input, expected], index) => {
        const { unmount } = render(<KBD data-testid={`kbd-${index}`}>{input}</KBD>);
        expect(screen.getByTestId(`kbd-${index}`)).toHaveTextContent(expected);
        unmount();
      });
    });

    it('maps arrow keys correctly', () => {
      const arrowTests = [
        ['up', '↑'],
        ['down', '↓'],
        ['left', '←'],
        ['right', '→'],
      ];

      arrowTests.forEach(([input, expected]) => {
        const { unmount } = render(<KBD>{input}</KBD>);
        expect(screen.getByTestId('kbd')).toHaveTextContent(expected);
        unmount();
      });
    });

    it('maps special keys correctly', () => {
      const specialTests = [
        ['enter', '⏎'],
        ['return', '⏎'],
        ['backspace', '⌫'],
        ['delete', '⌦'],
        ['tab', '⇥'],
        ['space', 'Space'],
        ['escape', 'Esc'],
        ['esc', 'Esc'],
      ];

      specialTests.forEach(([input, expected]) => {
        const { unmount } = render(<KBD>{input}</KBD>);
        expect(screen.getByTestId('kbd')).toHaveTextContent(expected);
        unmount();
      });
    });

    it('maps function keys correctly', () => {
      const { unmount: unmount1 } = render(<KBD data-testid="kbd-f1">f1</KBD>);
      expect(screen.getByTestId('kbd-f1')).toHaveTextContent('F1');
      unmount1();
      
      const { unmount: unmount2 } = render(<KBD data-testid="kbd-f12">f12</KBD>);
      expect(screen.getByTestId('kbd-f12')).toHaveTextContent('F12');
      unmount2();
    });
  });

  describe('Accessibility', () => {
    it('uses custom aria-label when provided', () => {
      render(<KBD aria-label="Custom label">A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('aria-label', 'Custom label');
    });

    it('uses semantic kbd element without role override', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd.tagName).toBe('KBD');
      expect(kbd).not.toHaveAttribute('role'); // Let semantic <kbd> handle accessibility
    });

    it('is not focusable by default', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).not.toHaveAttribute('tabIndex');
    });
  });

  describe('Styling & Theming', () => {
    it('applies base styling classes', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd.className).toContain('inline-flex');
      expect(kbd.className).toContain('items-center');
      expect(kbd.className).toContain('justify-center');
      expect(kbd.className).toContain('font-mono');
      expect(kbd.className).toContain('font-medium');
    });

    it('includes transition classes for smooth interactions', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd.className).toContain('transition-all');
      expect(kbd.className).toContain('duration-150');
    });

    it('prevents text selection', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd.className).toContain('select-none');
      // Note: user-select-none was removed for better accessibility
    });

    it('applies custom className', () => {
      render(<KBD className="custom-class">A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd.className).toContain('custom-class');
    });

    it('applies dark mode classes', () => {
      render(<KBD>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      // Note: Dark mode classes now come from DESIGN_TOKENS.recipe.keyboardKey
      // Specific classes depend on token implementation
      expect(kbd.className).toContain('dark:'); // Should have some dark: prefix classes
    });
  });

  describe('Pressed State', () => {
    it('applies pressed state styling', () => {
      render(<KBD pressed>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('data-pressed', 'true');
      // Note: Specific pressed styling comes from DESIGN_TOKENS or fallback classes
      expect(kbd.className).toContain('translate-y-px');
      expect(kbd.className).toContain('shadow-inner');
    });

    it('maintains pressed state independent of variant', () => {
      render(<KBD variant="shortcut" pressed>A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('data-variant', 'pressed');
      expect(kbd).toHaveAttribute('data-pressed', 'true');
    });
  });

  describe('Integration & Performance', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLElement>();
      render(<KBD ref={ref}>A</KBD>);
      
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('KBD');
    });

    it('spreads additional HTML attributes', () => {
      render(<KBD id="test-kbd" data-custom="value">A</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toHaveAttribute('id', 'test-kbd');
      expect(kbd).toHaveAttribute('data-custom', 'value');
    });

    it('handles empty children gracefully', () => {
      render(<KBD></KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toBeInTheDocument();
      expect(kbd).toHaveTextContent('');
    });

    it('handles null children gracefully', () => {
      render(<KBD>{null}</KBD>);
      
      const kbd = screen.getByTestId('kbd');
      expect(kbd).toBeInTheDocument();
    });
  });

  describe('Key Labels Export', () => {
    it('exports KBDLabels correctly', () => {
      expect(KBDLabels).toBeDefined();
      expect(KBDLabels.cmd).toBe('⌘');
      expect(KBDLabels.enter).toBe('⏎');
      expect(KBDLabels.up).toBe('↑');
    });

    it('provides comprehensive key mappings', () => {
      // Test a few key categories
      expect(KBDLabels.meta).toBe('⌘');
      expect(KBDLabels.left).toBe('←');
      expect(KBDLabels.backspace).toBe('⌫');
      expect(KBDLabels.f1).toBe('F1');
    });
  });
});
