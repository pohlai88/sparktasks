/**
 * Enhanced Separator Component Test Suite
 *
 * TESTING SCOPE:
 * - MAPS v2.2 Foundation compliance
 * - Dark-first philosophy application
 * - Apple HIG spacing & interaction patterns
 * - AAA accessibility compliance
 * - Liquid glass materials governance
 * - Radix primitive integration
 * - Anti-drift enforcement validation
 *
 * TEST COVERAGE GOALS:
 * - Component rendering & variants ✅
 * - Accessibility WCAG AAA compliance ✅
 * - Material system governance ✅
 * - Interaction patterns ✅
 * - Error boundaries & edge cases ✅
 * - Performance optimization ✅
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  AccentSeparator,
  EnhancedSeparator,
  EtherealSeparator,
  GlassSeparator,
  SeparatorWithContent,
  StrongSeparator,
} from '@/components/ui-enhanced/Separator';

// ===== TEST UTILITIES =====

const TEST_IDS = {
  separator: 'separator-test',
  separatorWithContent: 'separator-with-content-test',
  content: 'separator-content',
} as const;

// ===== ENHANCED SEPARATOR - MAPS v2.2 FOUNDATION =====

describe('EnhancedSeparator - MAPS v2.2 Foundation', () => {
  describe('Core Functionality', () => {
    it('renders with basic props', () => {
      render(<EnhancedSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('applies MAPS v2.2 foundation classes', () => {
      render(<EnhancedSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);

      // Foundation classes
      expect(separator).toHaveClass('shrink-0');
      expect(separator).toHaveClass('bg-border');
      expect(separator).toHaveClass('transition-colors');
      expect(separator).toHaveClass('duration-200');
      expect(separator).toHaveClass('ease-out');
      expect(separator).toHaveClass('motion-reduce:transition-none');
    });

    it('supports horizontal orientation by default', () => {
      render(<EnhancedSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
      expect(separator).toHaveClass('h-px');
    });

    it('supports vertical orientation', () => {
      render(
        <EnhancedSeparator
          orientation='vertical'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
      expect(separator).toHaveClass('w-px');
    });
  });

  describe('Variant System - Apple HIG Compliance', () => {
    it('applies default variant classes correctly', () => {
      render(<EnhancedSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-border');
    });

    it('applies strong variant for major sections', () => {
      render(
        <EnhancedSeparator variant='strong' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-border-strong');
    });

    it('applies accent variant for brand emphasis', () => {
      render(
        <EnhancedSeparator variant='accent' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-accent');
    });

    it('applies glass variant with vibrancy effects', () => {
      render(
        <EnhancedSeparator variant='glass' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-border/60');
      expect(separator).toHaveClass('backdrop-blur-[8px]');
      expect(separator).toHaveClass('backdrop-saturate-[135%]');
      expect(separator).toHaveClass('shadow-[0_1px_3px_rgba(0,0,0,0.2)]');
    });

    it('applies ethereal variant with sophisticated gradient', () => {
      render(
        <EnhancedSeparator
          variant='ethereal'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-gradient-to-r');
      expect(separator).toHaveClass('from-accent/20');
      expect(separator).toHaveClass('via-accent');
      expect(separator).toHaveClass('to-accent/20');
      expect(separator).toHaveClass('shadow-[0_0_8px_rgba(124,196,255,0.2)]');
    });

    it('applies dotted variant correctly', () => {
      render(
        <EnhancedSeparator variant='dotted' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-transparent');
      expect(separator).toHaveClass('border-dotted');
      expect(separator).toHaveClass('border-t');
      expect(separator).toHaveClass('border-border');
    });

    it('applies dashed variant correctly', () => {
      render(
        <EnhancedSeparator variant='dashed' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-transparent');
      expect(separator).toHaveClass('border-dashed');
      expect(separator).toHaveClass('border-t');
      expect(separator).toHaveClass('border-border');
    });
  });

  describe('Size Variants - Apple HIG Typography Scale', () => {
    it('applies thin size variant', () => {
      render(
        <EnhancedSeparator size='thin' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('h-px');
    });

    it('applies thick size variant', () => {
      render(
        <EnhancedSeparator size='thick' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('h-0.5');
    });

    it('applies vertical sizing correctly', () => {
      render(
        <EnhancedSeparator
          orientation='vertical'
          size='thick'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('w-0.5');
    });
  });

  describe('Spacing System - Apple HIG Patterns', () => {
    it('applies no spacing when set to none', () => {
      render(
        <EnhancedSeparator spacing='none' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('m-0');
    });

    it('applies small spacing variant', () => {
      render(
        <EnhancedSeparator spacing='sm' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('my-2');
    });

    it('applies default spacing variant', () => {
      render(
        <EnhancedSeparator spacing='default' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('my-4');
    });

    it('applies large spacing variant', () => {
      render(
        <EnhancedSeparator spacing='lg' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('my-6');
    });

    it('applies extra large spacing variant', () => {
      render(
        <EnhancedSeparator spacing='xl' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('my-8');
    });
  });

  describe('AAA Compliance Mode', () => {
    it('applies AAA enforcement styles', () => {
      render(<EnhancedSeparator aaa={true} data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('!bg-[#666666]');
      expect(separator).toHaveClass('!shadow-none');
      expect(separator).toHaveClass('!backdrop-blur-none');
    });

    it('overrides glass variant in AAA mode', () => {
      render(
        <EnhancedSeparator
          variant='glass'
          aaa={true}
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('!bg-border');
      expect(separator).toHaveClass('!backdrop-blur-none');
      expect(separator).toHaveClass('!shadow-none');
    });

    it('overrides ethereal variant in AAA mode', () => {
      render(
        <EnhancedSeparator
          variant='ethereal'
          aaa={true}
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('!bg-[#666666]');
      expect(separator).toHaveClass('!shadow-none');
      expect(separator).toHaveClass('!from-transparent');
      expect(separator).toHaveClass('!via-transparent');
      expect(separator).toHaveClass('!to-transparent');
    });
  });

  describe('Decoration System', () => {
    it('applies glow decoration effect', () => {
      render(
        <EnhancedSeparator decoration='glow' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('shadow-[0_0_12px_rgba(124,196,255,0.15)]');
      expect(separator).toHaveClass('relative');
    });

    it('applies gradient decoration effect', () => {
      render(
        <EnhancedSeparator
          decoration='gradient'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-gradient-to-r');
      expect(separator).toHaveClass('from-transparent');
      expect(separator).toHaveClass('via-border');
      expect(separator).toHaveClass('to-transparent');
    });

    it('applies fade decoration effect', () => {
      render(
        <EnhancedSeparator decoration='fade' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-gradient-to-r');
      expect(separator).toHaveClass('from-transparent');
      expect(separator).toHaveClass('via-border');
      expect(separator).toHaveClass('to-transparent');
    });
  });
});

// ===== SEPARATOR WITH CONTENT =====

describe('SeparatorWithContent - Form Integration', () => {
  describe('Basic Content Display', () => {
    it('renders content in the center of separators', () => {
      render(
        <SeparatorWithContent data-testid={TEST_IDS.separatorWithContent}>
          <span data-testid={TEST_IDS.content}>OR</span>
        </SeparatorWithContent>
      );

      const container = screen.getByTestId(TEST_IDS.separatorWithContent);
      const content = screen.getByTestId(TEST_IDS.content);

      expect(container).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('OR');
    });

    it('applies proper layout classes', () => {
      render(
        <SeparatorWithContent data-testid={TEST_IDS.separatorWithContent}>
          <span>Section Title</span>
        </SeparatorWithContent>
      );

      const container = screen.getByTestId(TEST_IDS.separatorWithContent);
      expect(container).toHaveClass('relative');
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('items-center');
      expect(container).toHaveClass('my-4');
    });

    it('applies AAA compliance to content text', () => {
      render(
        <SeparatorWithContent
          aaa={true}
          data-testid={TEST_IDS.separatorWithContent}
        >
          <span>Section Title</span>
        </SeparatorWithContent>
      );

      const container = screen.getByTestId(TEST_IDS.separatorWithContent);
      const contentContainer = container.querySelector('div:nth-child(2)');

      expect(contentContainer).toHaveClass('text-[#ffffff]');
    });

    it('supports different spacing variants', () => {
      render(
        <SeparatorWithContent
          spacing='lg'
          data-testid={TEST_IDS.separatorWithContent}
        >
          <span>Section Title</span>
        </SeparatorWithContent>
      );

      const container = screen.getByTestId(TEST_IDS.separatorWithContent);
      expect(container).toHaveClass('my-6');
    });
  });
});

// ===== PREDEFINED SEPARATOR VARIANTS =====

describe('Predefined Separator Variants', () => {
  describe('Factory Function Components', () => {
    it('renders GlassSeparator with correct styling', () => {
      render(<GlassSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-border/60');
      expect(separator).toHaveClass('backdrop-blur-[8px]');
      expect(separator).toHaveClass('shadow-[0_0_12px_rgba(124,196,255,0.15)]');
    });

    it('renders EtherealSeparator with gradient styling', () => {
      render(<EtherealSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-gradient-to-r');
      expect(separator).toHaveClass('from-accent/20');
      expect(separator).toHaveClass('via-accent');
      expect(separator).toHaveClass('to-accent/20');
    });

    it('renders StrongSeparator with strong styling', () => {
      render(<StrongSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-border-strong');
    });

    it('renders AccentSeparator with accent styling', () => {
      render(<AccentSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-accent');
      expect(separator).toHaveClass('shadow-[0_0_12px_rgba(124,196,255,0.15)]');
    });
  });
});

// ===== ACCESSIBILITY - WCAG AAA COMPLIANCE =====

describe('Accessibility - WCAG AAA Compliance', () => {
  describe('Semantic vs Decorative Separators', () => {
    it('creates decorative separator by default', () => {
      render(<EnhancedSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).not.toHaveAttribute('role');
    });

    it('creates semantic separator when decorative=false', () => {
      render(
        <EnhancedSeparator
          decorative={false}
          aria-label='Section separator'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveAttribute('role', 'separator');
      expect(separator).toHaveAttribute('aria-label', 'Section separator');
      expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
      expect(separator).not.toHaveAttribute('aria-hidden');
    });

    it('applies proper ARIA orientation for vertical separators', () => {
      render(
        <EnhancedSeparator
          orientation='vertical'
          decorative={false}
          aria-label='Vertical separator'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('provides default aria-label for semantic separators', () => {
      render(
        <EnhancedSeparator
          decorative={false}
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveAttribute('aria-label', 'Section separator');
    });
  });

  describe('Focus Management', () => {
    it('applies focus ring styles for semantic separators', () => {
      render(
        <EnhancedSeparator
          decorative={false}
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('focus-visible:outline-none');
      expect(separator).toHaveClass('focus-visible:ring-2');
      expect(separator).toHaveClass('focus-visible:ring-ring');
      expect(separator).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('Motion Preferences', () => {
    it('respects reduced motion preferences', () => {
      render(<EnhancedSeparator data-testid={TEST_IDS.separator} />);

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('motion-reduce:transition-none');
    });
  });
});

// ===== LIQUID GLASS MATERIALS GOVERNANCE =====

describe('Liquid Glass Materials Governance', () => {
  describe('Vibrancy Effects Application', () => {
    it('applies vibrancy only to surface, not content', () => {
      render(
        <EnhancedSeparator variant='glass' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      // Vibrancy effects should be on background/surface only
      expect(separator).toHaveClass('backdrop-blur-[8px]');
      expect(separator).toHaveClass('backdrop-saturate-[135%]');
      expect(separator).toHaveClass('bg-border/60');
    });

    it('maintains backdrop discipline with controlled blur levels', () => {
      render(
        <EnhancedSeparator variant='glass' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      // Controlled blur level: 8px (not arbitrary)
      expect(separator).toHaveClass('backdrop-blur-[8px]');
      // Controlled saturation: 135% (not arbitrary)
      expect(separator).toHaveClass('backdrop-saturate-[135%]');
    });

    it('removes vibrancy effects in AAA mode', () => {
      render(
        <EnhancedSeparator
          variant='glass'
          aaa={true}
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('!backdrop-blur-none');
      expect(separator).toHaveClass('!shadow-none');
    });
  });
});

// ===== ERROR BOUNDARIES & EDGE CASES =====

describe('Error Boundaries & Edge Cases', () => {
  describe('Invalid Props Handling', () => {
    it('handles missing props gracefully', () => {
      expect(() => {
        render(<EnhancedSeparator />);
      }).not.toThrow();
    });

    it('handles undefined variant gracefully', () => {
      expect(() => {
        render(
          <EnhancedSeparator
            variant={undefined as any}
            data-testid={TEST_IDS.separator}
          />
        );
      }).not.toThrow();
    });

    it('handles custom className merging correctly', () => {
      render(
        <EnhancedSeparator
          className='custom-class'
          data-testid={TEST_IDS.separator}
        />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('custom-class');
      expect(separator).toHaveClass('bg-border'); // Should preserve base classes
    });
  });

  describe('Content Edge Cases', () => {
    it('handles empty content in SeparatorWithContent', () => {
      expect(() => {
        render(
          <SeparatorWithContent data-testid={TEST_IDS.separatorWithContent}>
            {}
          </SeparatorWithContent>
        );
      }).not.toThrow();
    });

    it('handles complex content in SeparatorWithContent', () => {
      render(
        <SeparatorWithContent data-testid={TEST_IDS.separatorWithContent}>
          <div>
            <span>Complex</span>
            <strong>Content</strong>
          </div>
        </SeparatorWithContent>
      );

      const container = screen.getByTestId(TEST_IDS.separatorWithContent);
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

// ===== PERFORMANCE OPTIMIZATION =====

describe('Performance Optimization', () => {
  describe('Rendering Efficiency', () => {
    it('does not cause unnecessary re-renders', () => {
      const { rerender } = render(
        <EnhancedSeparator variant='default' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      const initialClasses = separator.className;

      // Re-render with same props
      rerender(
        <EnhancedSeparator variant='default' data-testid={TEST_IDS.separator} />
      );

      expect(separator.className).toBe(initialClasses);
    });

    it('efficiently handles variant changes', () => {
      const { rerender } = render(
        <EnhancedSeparator variant='default' data-testid={TEST_IDS.separator} />
      );

      const separator = screen.getByTestId(TEST_IDS.separator);
      expect(separator).toHaveClass('bg-border');

      rerender(
        <EnhancedSeparator variant='strong' data-testid={TEST_IDS.separator} />
      );

      expect(separator).toHaveClass('bg-border-strong');
      expect(separator).not.toHaveClass('bg-border');
    });
  });
});
