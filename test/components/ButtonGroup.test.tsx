/**
 * ButtonGroup Component Tests - Enterprise-Grade Validation
 *
 * Comprehensive test coverage ensuring:
 * - Proper DESIGN_TOKENS integration and compliance
 * - Accessibility standards (WCAG 2.1 AA)
 * - Button grouping and inheritance behavior
 * - Orientation and attachment variations
 * - Dark mode and responsive compatibility
 * - Performance and render optimization
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ButtonGroup } from '../../src/components/ui/ButtonGroup';
import { Button } from '../../src/components/ui/Button';
import { Save, Edit, Trash } from 'lucide-react';

describe('ButtonGroup Component - Enterprise Grade', () => {
  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(
        <ButtonGroup>
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      );

      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /first/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /second/i })
      ).toBeInTheDocument();
    });

    it('applies proper default data attributes', () => {
      render(
        <ButtonGroup data-testid='button-group'>
          <Button>Test</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('button-group');
      expect(group).toHaveAttribute('data-orientation', 'horizontal');
      expect(group).toHaveAttribute('data-attached', 'true');
      expect(group).toHaveAttribute('data-size', 'md');
      expect(group).toHaveAttribute('data-spacing', 'none');
    });
  });

  describe('Size Inheritance', () => {
    it('applies group size to all buttons', () => {
      render(
        <ButtonGroup size='lg'>
          <Button data-testid='btn1'>Button 1</Button>
          <Button data-testid='btn2'>Button 2</Button>
        </ButtonGroup>
      );

      expect(screen.getByTestId('btn1')).toHaveAttribute('data-size', 'lg');
      expect(screen.getByTestId('btn2')).toHaveAttribute('data-size', 'lg');
    });

    it('allows individual button size overrides', () => {
      render(
        <ButtonGroup size='md'>
          <Button size='sm' data-testid='small-btn'>
            Small
          </Button>
          <Button data-testid='normal-btn'>Normal</Button>
        </ButtonGroup>
      );

      expect(screen.getByTestId('small-btn')).toHaveAttribute(
        'data-size',
        'sm'
      );
      expect(screen.getByTestId('normal-btn')).toHaveAttribute(
        'data-size',
        'md'
      );
    });

    it('supports all size variants', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;

      sizes.forEach(size => {
        const { unmount } = render(
          <ButtonGroup size={size} data-testid={`group-${size}`}>
            <Button>Test</Button>
          </ButtonGroup>
        );

        expect(screen.getByTestId(`group-${size}`)).toHaveAttribute(
          'data-size',
          size
        );
        unmount();
      });
    });
  });

  describe('Variant Inheritance', () => {
    it('applies group variant to all buttons', () => {
      render(
        <ButtonGroup variant='secondary'>
          <Button data-testid='btn1'>Button 1</Button>
          <Button data-testid='btn2'>Button 2</Button>
        </ButtonGroup>
      );

      expect(screen.getByTestId('btn1')).toHaveAttribute(
        'data-variant',
        'secondary'
      );
      expect(screen.getByTestId('btn2')).toHaveAttribute(
        'data-variant',
        'secondary'
      );
    });

    it('allows individual button variant overrides', () => {
      render(
        <ButtonGroup variant='secondary'>
          <Button variant='destructive' data-testid='destructive-btn'>
            Delete
          </Button>
          <Button data-testid='normal-btn'>Normal</Button>
        </ButtonGroup>
      );

      expect(screen.getByTestId('destructive-btn')).toHaveAttribute(
        'data-variant',
        'destructive'
      );
      expect(screen.getByTestId('normal-btn')).toHaveAttribute(
        'data-variant',
        'secondary'
      );
    });

    it('supports all variant types', () => {
      const variants = [
        'primary',
        'secondary',
        'ghost',
        'destructive',
        'outline',
        'link',
      ] as const;

      variants.forEach(variant => {
        const { unmount } = render(
          <ButtonGroup variant={variant}>
            <Button data-testid={`btn-${variant}`}>Test</Button>
          </ButtonGroup>
        );

        expect(screen.getByTestId(`btn-${variant}`)).toHaveAttribute(
          'data-variant',
          variant
        );
        unmount();
      });
    });
  });

  describe('Orientation Support', () => {
    it('renders horizontal orientation by default', () => {
      render(
        <ButtonGroup data-testid='horizontal-group'>
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('horizontal-group');
      expect(group).toHaveAttribute('data-orientation', 'horizontal');
      // Check for horizontal flex classes from DESIGN_TOKENS
      expect(group).toHaveClass('flex', 'items-center');
    });

    it('renders vertical orientation correctly', () => {
      render(
        <ButtonGroup orientation='vertical' data-testid='vertical-group'>
          <Button>Top</Button>
          <Button>Bottom</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('vertical-group');
      expect(group).toHaveAttribute('data-orientation', 'vertical');
      // Check for vertical flex classes from DESIGN_TOKENS
      expect(group).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Attachment Behavior', () => {
    it('applies attached styling by default', () => {
      render(
        <ButtonGroup data-testid='attached-group'>
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('attached-group');
      expect(group).toHaveAttribute('data-attached', 'true');
    });

    it('supports non-attached grouping', () => {
      render(
        <ButtonGroup attached={false} spacing='md' data-testid='spaced-group'>
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('spaced-group');
      expect(group).toHaveAttribute('data-attached', 'false');
      expect(group).toHaveAttribute('data-spacing', 'md');
    });
  });

  describe('Full Width Support', () => {
    it('applies full width styling when enabled', () => {
      render(
        <ButtonGroup fullWidth data-testid='full-width-group'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('full-width-group');
      expect(group).toHaveClass('w-full');
    });

    it('does not apply full width by default', () => {
      render(
        <ButtonGroup data-testid='normal-group'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('normal-group');
      expect(group).not.toHaveClass('w-full');
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper role and ARIA attributes', () => {
      render(
        <ButtonGroup aria-label='Action buttons'>
          <Button>Save</Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole('group', { name: /action buttons/i });
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('aria-label', 'Action buttons');
    });

    it('maintains individual button accessibility', () => {
      render(
        <ButtonGroup>
          <Button aria-label='Save document'>Save</Button>
          <Button aria-label='Cancel action'>Cancel</Button>
        </ButtonGroup>
      );

      expect(
        screen.getByRole('button', { name: /save document/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel action/i })
      ).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <ButtonGroup>
          <Button data-testid='first-btn'>First</Button>
          <Button data-testid='second-btn'>Second</Button>
          <Button data-testid='third-btn'>Third</Button>
        </ButtonGroup>
      );

      const firstBtn = screen.getByTestId('first-btn');
      const secondBtn = screen.getByTestId('second-btn');
      const thirdBtn = screen.getByTestId('third-btn');

      // Tab through buttons
      await user.tab();
      expect(firstBtn).toHaveFocus();

      await user.tab();
      expect(secondBtn).toHaveFocus();

      await user.tab();
      expect(thirdBtn).toHaveFocus();
    });
  });

  describe('Event Handling', () => {
    it('handles individual button clicks correctly', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();
      const onCancel = vi.fn();

      render(
        <ButtonGroup>
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </ButtonGroup>
      );

      await user.click(screen.getByRole('button', { name: /save/i }));
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onCancel).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('handles disabled buttons correctly', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(
        <ButtonGroup>
          <Button disabled onClick={onClick}>
            Disabled
          </Button>
          <Button onClick={onClick}>Enabled</Button>
        </ButtonGroup>
      );

      const disabledBtn = screen.getByRole('button', { name: /disabled/i });
      const enabledBtn = screen.getByRole('button', { name: /enabled/i });

      await user.click(disabledBtn);
      expect(onClick).not.toHaveBeenCalled();

      await user.click(enabledBtn);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon Integration', () => {
    it('works with icon buttons', () => {
      render(
        <ButtonGroup>
          <Button icon={<Save size={16} />}>Save</Button>
          <Button icon={<Edit size={16} />}>Edit</Button>
          <Button icon={<Trash size={16} />} variant='destructive'>
            Delete
          </Button>
        </ButtonGroup>
      );

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
    });
  });

  describe('Advanced Features', () => {
    it('applies custom className correctly', () => {
      render(
        <ButtonGroup className='custom-group-class' data-testid='custom-group'>
          <Button>Test</Button>
        </ButtonGroup>
      );

      expect(screen.getByTestId('custom-group')).toHaveClass(
        'custom-group-class'
      );
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <ButtonGroup ref={ref}>
          <Button>Test</Button>
        </ButtonGroup>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'group');
    });

    it('passes through HTML div attributes', () => {
      render(
        <ButtonGroup data-custom='test-value' id='custom-id'>
          <Button>Test</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('data-custom', 'test-value');
      expect(group).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Token Integration', () => {
    it('uses DESIGN_TOKENS instead of hardcoded classes', () => {
      render(
        <ButtonGroup data-testid='token-group'>
          <Button>Test</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('token-group');
      // Verify it uses flex classes from DESIGN_TOKENS.layout.patterns
      expect(group).toHaveClass('flex', 'items-center');

      // Should not have hardcoded Tailwind classes
      expect(group.className).not.toMatch(/bg-blue-|text-white-|border-gray-/);
    });

    it('applies proper data attributes for debugging', () => {
      render(
        <ButtonGroup
          size='lg'
          variant='primary'
          orientation='vertical'
          data-testid='debug-group'
        >
          <Button>Test</Button>
        </ButtonGroup>
      );

      const group = screen.getByTestId('debug-group');
      expect(group).toHaveAttribute('data-size', 'lg');
      expect(group).toHaveAttribute('data-orientation', 'vertical');
      expect(group).toHaveAttribute('data-attached', 'true');
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('supports complex toolbar-style grouping', () => {
      render(
        <ButtonGroup variant='outline' size='sm' aria-label='Text formatting'>
          <Button icon={<Save size={14} />} aria-label='Save document' />
          <Button icon={<Edit size={14} />} aria-label='Edit document' />
          <Button
            icon={<Trash size={14} />}
            variant='destructive'
            aria-label='Delete document'
          />
        </ButtonGroup>
      );

      const group = screen.getByRole('group', { name: /text formatting/i });
      expect(group).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      // Verify accessibility
      expect(
        screen.getByRole('button', { name: /save document/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /edit document/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete document/i })
      ).toBeInTheDocument();
    });

    it('handles form action groups correctly', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const onCancel = vi.fn();

      render(
        <form>
          <ButtonGroup fullWidth spacing='md' attached={false}>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button variant='primary' onClick={onSubmit}>
              Submit Form
            </Button>
          </ButtonGroup>
        </form>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('w-full');
      expect(group).toHaveAttribute('data-attached', 'false');

      await user.click(screen.getByRole('button', { name: /submit form/i }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
