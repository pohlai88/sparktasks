/**
 * IconButton Component Tests - Enterprise-Grade Validation
 *
 * Comprehensive test suite for DESIGN_TOKENS V3.2 IconButton component:
 * - All variants and sizes
 * - State management (pending, disabled, focus)
 * - Icon integration and centering
 * - Accessibility compliance (WCAG 2.1)
 * - Event handling and interactions
 * - Icon-only enforcement
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../../src/components/ui/IconButton';
import { Settings, Plus, Trash2, Edit } from 'lucide-react';
import '@testing-library/jest-dom';

describe('IconButton Component - Enterprise Grade', () => {
  describe('Icon-Only Enforcement', () => {
    it('renders icon without text content', () => {
      render(
        <IconButton
          icon={<Settings data-testid='settings-icon' />}
          aria-label='Settings'
        />
      );

      const button = screen.getByRole('button', { name: /settings/i });
      const icon = screen.getByTestId('settings-icon');

      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(button).not.toHaveTextContent(/settings/i);
    });

    it('requires aria-label for accessibility', () => {
      render(
        <IconButton
          icon={<Plus data-testid='plus-icon' />}
          aria-label='Add item'
        />
      );

      const button = screen.getByRole('button', { name: /add item/i });
      expect(button).toHaveAttribute('aria-label', 'Add item');
    });
  });

  describe('Variant Rendering', () => {
    it('renders primary variant with correct styling', () => {
      render(
        <IconButton
          variant='primary'
          icon={<Settings />}
          aria-label='Settings'
        />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass('bg-primary-600', 'text-white');
    });

    it('renders secondary variant with correct styling', () => {
      render(
        <IconButton
          variant='secondary'
          icon={<Settings />}
          aria-label='Settings'
        />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass('bg-secondary-100', 'text-secondary-900');
    });

    it('renders ghost variant (default) with correct styling', () => {
      render(<IconButton icon={<Settings />} aria-label='Settings' />);
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass(
        'hover:bg-secondary-100',
        'text-secondary-600'
      );
    });

    it('renders destructive variant with correct styling', () => {
      render(
        <IconButton
          variant='destructive'
          icon={<Trash2 />}
          aria-label='Delete'
        />
      );
      const button = screen.getByRole('button', { name: /delete/i });

      expect(button).toHaveClass('bg-error-600', 'text-white');
    });

    it('renders outline variant with correct styling', () => {
      render(
        <IconButton variant='outline' icon={<Edit />} aria-label='Edit' />
      );
      const button = screen.getByRole('button', { name: /edit/i });

      expect(button).toHaveClass('border', 'border-secondary-300');
    });
  });

  describe('Size Variations', () => {
    it('renders small size with correct classes', () => {
      render(
        <IconButton size='sm' icon={<Settings />} aria-label='Settings' />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass('h-8', 'px-3', 'text-xs', 'aspect-square');
    });

    it('renders medium size (default) with correct classes', () => {
      render(
        <IconButton size='md' icon={<Settings />} aria-label='Settings' />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass('h-9', 'px-4', 'text-sm', 'aspect-square');
    });

    it('renders large size with correct classes', () => {
      render(
        <IconButton size='lg' icon={<Settings />} aria-label='Settings' />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass('h-10', 'px-6', 'text-base', 'aspect-square');
    });

    it('renders extra large size with correct classes', () => {
      render(
        <IconButton size='xl' icon={<Settings />} aria-label='Settings' />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      expect(button).toHaveClass('h-12', 'px-8', 'text-lg', 'aspect-square');
    });
  });

  describe('Icon Integration', () => {
    it('centers icon properly without margins', () => {
      render(
        <IconButton
          icon={<Settings data-testid='settings-icon' />}
          aria-label='Settings'
        />
      );

      const icon = screen.getByTestId('settings-icon');

      expect(icon).toBeInTheDocument();
      expect(icon.parentElement).toHaveClass('w-5', 'h-5'); // md size default
      expect(icon.parentElement).not.toHaveClass('mr-2', 'ml-2'); // No margins for centered icon
    });

    it('scales icon size with button size', () => {
      render(
        <IconButton
          size='lg'
          icon={<Settings data-testid='settings-icon' />}
          aria-label='Settings'
        />
      );

      const icon = screen.getByTestId('settings-icon');
      expect(icon.parentElement).toHaveClass('w-6', 'h-6'); // lg icon size
    });
  });

  describe('State Management', () => {
    it('handles pending state correctly', () => {
      render(
        <IconButton pending icon={<Settings />} aria-label='Loading Settings' />
      );
      const button = screen.getByRole('button', { name: /loading settings/i });

      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-state', 'pending');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('handles disabled state correctly', () => {
      render(
        <IconButton
          disabled
          icon={<Settings />}
          aria-label='Disabled Settings'
        />
      );
      const button = screen.getByRole('button', { name: /disabled settings/i });

      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        'disabled:pointer-events-none',
        'disabled:opacity-50'
      );
    });
  });

  describe('Event Handling', () => {
    it('handles click events correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <IconButton
          onClick={handleClick}
          icon={<Settings />}
          aria-label='Settings'
        />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <IconButton
          onClick={handleClick}
          disabled
          icon={<Settings />}
          aria-label='Settings'
        />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when pending', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <IconButton
          onClick={handleClick}
          pending
          icon={<Settings />}
          aria-label='Settings'
        />
      );
      const button = screen.getByRole('button', { name: /settings/i });

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper focus management', async () => {
      const user = userEvent.setup();

      render(
        <IconButton icon={<Settings />} aria-label='Focusable Settings' />
      );
      const button = screen.getByRole('button', {
        name: /focusable settings/i,
      });

      await user.tab();
      expect(button).toHaveFocus();
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2'
      );
    });

    it('has proper ARIA attributes for pending state', () => {
      render(<IconButton pending icon={<Settings />} aria-label='Loading' />);
      const button = screen.getByRole('button', { name: /loading/i });

      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('data-state', 'pending');
    });

    it('supports keyboard navigation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <IconButton
          onClick={handleClick}
          icon={<Settings />}
          aria-label='Keyboard Settings'
        />
      );
      const button = screen.getByRole('button', { name: /keyboard settings/i });

      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Advanced Features', () => {
    it('applies custom className correctly', () => {
      render(
        <IconButton
          className='custom-class'
          icon={<Settings />}
          aria-label='Custom IconButton'
        />
      );
      const button = screen.getByRole('button', { name: /custom iconbutton/i });

      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();

      render(
        <IconButton ref={ref} icon={<Settings />} aria-label='Ref IconButton' />
      );

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('passes through HTML button attributes', () => {
      render(
        <IconButton
          type='submit'
          name='test-button'
          value='test-value'
          data-testid='html-iconbutton'
          icon={<Settings />}
          aria-label='HTML IconButton'
        />
      );

      const button = screen.getByTestId('html-iconbutton');

      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'test-button');
      expect(button).toHaveAttribute('value', 'test-value');
    });
  });

  describe('Token Integration', () => {
    it('uses design tokens instead of hardcoded classes', () => {
      render(
        <IconButton
          variant='primary'
          icon={<Settings />}
          aria-label='Token IconButton'
        />
      );
      const button = screen.getByRole('button', { name: /token iconbutton/i });

      // Should have base button classes from design tokens
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center'
      );
      expect(button).toHaveClass('font-medium', 'rounded-md');
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2'
      );
      expect(button).toHaveClass(
        'transition-[color,background-color,box-shadow,transform]'
      );
      expect(button).toHaveClass('aspect-square'); // Icon-only specific
    });

    it('applies proper data attributes for debugging', () => {
      render(
        <IconButton
          variant='secondary'
          size='lg'
          icon={<Settings />}
          aria-label='Debug IconButton'
        />
      );
      const button = screen.getByRole('button', { name: /debug iconbutton/i });

      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('data-size', 'lg');
    });
  });
});
