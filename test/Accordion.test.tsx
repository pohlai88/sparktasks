/**
 * Enhanced Accordion Tests - MAPS v2.2 Testing
 *
 * Tests core functionality of the Enhanced Accordion component
 * including behavior, accessibility, and variant rendering.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  EnhancedAccordionRoot,
  EnhancedAccordionItem,
  EnhancedAccordionTrigger,
  EnhancedAccordionContent,
} from '../src/components/ui-enhanced/Accordion';

describe('Enhanced Accordion', () => {
  const mockItems = [
    {
      id: 'item-1',
      question: 'What is MAPS v2.2?',
      answer: 'MAPS v2.2 is a comprehensive design system.',
    },
    {
      id: 'item-2',
      question: 'How does accessibility work?',
      answer: 'All components include AAA compliance modes.',
    },
  ];

  const renderBasicAccordion = (props = {}) => {
    return render(
      <EnhancedAccordionRoot type='single' collapsible {...props}>
        {mockItems.map(item => (
          <EnhancedAccordionItem key={item.id} value={item.id}>
            <EnhancedAccordionTrigger>{item.question}</EnhancedAccordionTrigger>
            <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
          </EnhancedAccordionItem>
        ))}
      </EnhancedAccordionRoot>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders accordion with all items', () => {
      renderBasicAccordion();

      mockItems.forEach(item => {
        expect(
          screen.getByRole('button', { name: item.question })
        ).toBeInTheDocument();
      });
    });

    it('expands and collapses items on trigger click', async () => {
      const user = userEvent.setup();
      renderBasicAccordion();

      const firstTrigger = screen.getByRole('button', {
        name: mockItems[0]!.question,
      });

      // Initially collapsed
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');

      // Click to expand
      await user.click(firstTrigger);
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(mockItems[0]!.answer)).toBeVisible();

      // Click to collapse
      await user.click(firstTrigger);
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('handles single type accordion (only one item open)', async () => {
      const user = userEvent.setup();
      renderBasicAccordion();

      const firstTrigger = screen.getByRole('button', {
        name: mockItems[0]!.question,
      });
      const secondTrigger = screen.getByRole('button', {
        name: mockItems[1]!.question,
      });

      // Open first item
      await user.click(firstTrigger);
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');

      // Open second item - should close first
      await user.click(secondTrigger);
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles multiple type accordion', async () => {
      const user = userEvent.setup();
      render(
        <EnhancedAccordionRoot type='multiple'>
          {mockItems.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      );

      const firstTrigger = screen.getByRole('button', {
        name: mockItems[0]!.question,
      });
      const secondTrigger = screen.getByRole('button', {
        name: mockItems[1]!.question,
      });

      // Open both items
      await user.click(firstTrigger);
      await user.click(secondTrigger);

      expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Variants', () => {
    const variants = [
      'default',
      'ghost',
      'glass',
      'floating',
      'outlined',
      'filled',
    ] as const;

    variants.forEach(variant => {
      it(`renders ${variant} variant`, () => {
        const { container } = renderBasicAccordion({ variant });
        const accordion = container.firstChild;

        expect(accordion).toHaveClass('enhanced-accordion-root');
      });
    });
  });

  describe('Accessibility', () => {
    it('implements correct ARIA attributes', () => {
      renderBasicAccordion();

      mockItems.forEach(item => {
        const trigger = screen.getByRole('button', { name: item.question });

        expect(trigger).toHaveAttribute('aria-controls');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('data-state', 'closed');
      });
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderBasicAccordion();

      const triggers = screen.getAllByRole('button');

      // Focus first trigger
      triggers[0]!.focus();
      expect(triggers[0]).toHaveFocus();

      // Tab to next trigger
      await user.tab();
      expect(triggers[1]).toHaveFocus();

      // Enter to activate
      await user.keyboard('{Enter}');
      expect(triggers[1]).toHaveAttribute('aria-expanded', 'true');

      // Space to activate
      await user.keyboard(' ');
      expect(triggers[1]).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports AAA compliance mode', () => {
      const { container } = renderBasicAccordion({ aaaMode: true });
      const accordion = container.firstChild;

      expect(accordion).toHaveClass('enhanced-accordion-root--aaa');
    });
  });

  describe('Density Options', () => {
    it('renders compact density', () => {
      const { container } = renderBasicAccordion({ density: 'compact' });
      const accordion = container.firstChild;

      expect(accordion).toHaveClass('enhanced-accordion-root--compact');
    });

    it('renders default density', () => {
      const { container } = renderBasicAccordion({ density: 'default' });
      const accordion = container.firstChild;

      expect(accordion).toHaveClass('enhanced-accordion-root--default');
    });
  });

  describe('Custom Props', () => {
    it('forwards refs correctly', () => {
      const ref = vi.fn();
      render(
        <EnhancedAccordionRoot ref={ref} type='single' collapsible>
          <EnhancedAccordionItem value='test'>
            <EnhancedAccordionTrigger>Test</EnhancedAccordionTrigger>
            <EnhancedAccordionContent>Content</EnhancedAccordionContent>
          </EnhancedAccordionItem>
        </EnhancedAccordionRoot>
      );

      expect(ref).toHaveBeenCalled();
    });

    it('spreads additional props', () => {
      const { container } = render(
        <EnhancedAccordionRoot
          type='single'
          collapsible
          data-testid='custom-accordion'
          aria-label='Custom Accordion'
        >
          <EnhancedAccordionItem value='test'>
            <EnhancedAccordionTrigger>Test</EnhancedAccordionTrigger>
            <EnhancedAccordionContent>Content</EnhancedAccordionContent>
          </EnhancedAccordionItem>
        </EnhancedAccordionRoot>
      );

      const accordion = container.firstChild;
      expect(accordion).toHaveAttribute('data-testid', 'custom-accordion');
      expect(accordion).toHaveAttribute('aria-label', 'Custom Accordion');
    });
  });

  describe('Animation States', () => {
    it('applies correct data attributes for animations', async () => {
      const user = userEvent.setup();
      renderBasicAccordion();

      const firstTrigger = screen.getByRole('button', {
        name: mockItems[0]!.question,
      });

      // Check initial state
      expect(firstTrigger).toHaveAttribute('data-state', 'closed');

      // Click to expand
      await user.click(firstTrigger);
      expect(firstTrigger).toHaveAttribute('data-state', 'open');
    });
  });

  describe('Controlled State', () => {
    it('works with controlled value', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <EnhancedAccordionRoot
          type='single'
          collapsible
          value='item-1'
          onValueChange={onValueChange}
        >
          <EnhancedAccordionItem value='item-1'>
            <EnhancedAccordionTrigger>Test</EnhancedAccordionTrigger>
            <EnhancedAccordionContent>Content</EnhancedAccordionContent>
          </EnhancedAccordionItem>
        </EnhancedAccordionRoot>
      );

      const trigger = screen.getByRole('button', { name: 'Test' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Try to close - should call onValueChange
      await user.click(trigger);
      expect(onValueChange).toHaveBeenCalledWith('');
    });
  });
});
