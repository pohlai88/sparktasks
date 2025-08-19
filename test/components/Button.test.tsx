/**
 * Button Component Tests - Enterprise-Grade Validation
 * 
 * Comprehensive test suite for DESIGN_TOKENS V3.2 Button component:
 * - All variants and sizes
 * - State management (pending, disabled, focus)
 * - Icon integration with proper spacing
 * - Accessibility compliance (WCAG 2.1)
 * - Event handling and interactions
 * - Type safety and API contracts
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from '../../src/components/ui/Button';
import { Save, Download, Plus } from 'lucide-react';
import '@testing-library/jest-dom';

describe('Button Component - Enterprise Grade', () => {
  
  describe('Variant Rendering', () => {
    it('renders primary variant with correct styling', () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole('button', { name: /primary button/i });
      
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-600', 'text-white');
    });

    it('renders secondary variant with correct styling', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole('button', { name: /secondary button/i });
      
      expect(button).toHaveClass('bg-secondary-100', 'text-secondary-900');
    });

    it('renders ghost variant with correct styling', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      const button = screen.getByRole('button', { name: /ghost button/i });
      
      expect(button).toHaveClass('hover:bg-secondary-100', 'text-secondary-600');
    });

    it('renders destructive variant with correct styling', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button', { name: /delete/i });
      
      expect(button).toHaveClass('bg-error-600', 'text-white');
    });

    it('renders outline variant with correct styling', () => {
      render(<Button variant="outline">Outline Button</Button>);
      const button = screen.getByRole('button', { name: /outline button/i });
      
      expect(button).toHaveClass('border', 'border-secondary-300');
    });

    it('renders link variant with correct styling', () => {
      render(<Button variant="link">Link Button</Button>);
      const button = screen.getByRole('button', { name: /link button/i });
      
      expect(button).toHaveClass('text-primary-600', 'underline-offset-4');
    });
  });

  describe('Size Variations', () => {
    it('renders small size with correct classes', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button', { name: /small button/i });
      
      expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
    });

    it('renders medium size (default) with correct classes', () => {
      render(<Button size="md">Medium Button</Button>);
      const button = screen.getByRole('button', { name: /medium button/i });
      
      expect(button).toHaveClass('h-9', 'px-4', 'text-sm');
    });

    it('renders large size with correct classes', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button', { name: /large button/i });
      
      expect(button).toHaveClass('h-10', 'px-6', 'text-base');
    });

    it('renders extra large size with correct classes', () => {
      render(<Button size="xl">Extra Large Button</Button>);
      const button = screen.getByRole('button', { name: /extra large button/i });
      
      expect(button).toHaveClass('h-12', 'px-8', 'text-lg');
    });
  });

  describe('Icon Integration', () => {
    it('renders icon on the left with proper spacing', () => {
      render(
        <Button icon={<Save data-testid="save-icon" />} iconPosition="left">
          Save Document
        </Button>
      );
      
      const button = screen.getByRole('button', { name: /save document/i });
      const icon = screen.getByTestId('save-icon');
      
      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon.parentElement).toHaveClass('mr-2'); // Right margin for left icon
    });

    it('renders icon on the right with proper spacing', () => {
      render(
        <Button icon={<Download data-testid="download-icon" />} iconPosition="right">
          Download File
        </Button>
      );
      
      const icon = screen.getByTestId('download-icon');
      
      expect(icon).toBeInTheDocument();
      expect(icon.parentElement).toHaveClass('ml-2'); // Left margin for right icon
    });

    it('renders icon-only button with proper aria-label', () => {
      render(
        <Button 
          icon={<Plus data-testid="plus-icon" />} 
          iconPosition="only" 
          aria-label="Add new item"
        />
      );
      
      const button = screen.getByRole('button', { name: /add new item/i });
      const icon = screen.getByTestId('plus-icon');
      
      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(button).not.toHaveTextContent(/./); // No visible text
    });
  });

  describe('State Management', () => {
    it('handles pending state correctly', () => {
      render(<Button pending>Loading Button</Button>);
      const button = screen.getByRole('button', { name: /loading button/i });
      
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-state', 'pending');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('handles disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button', { name: /disabled button/i });
      
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('renders full width correctly', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button', { name: /full width button/i });
      
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Event Handling', () => {
    it('handles click events correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
      const button = screen.getByRole('button', { name: /disabled button/i });
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when pending', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} pending>Pending Button</Button>);
      const button = screen.getByRole('button', { name: /pending button/i });
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Compliance', () => {
    it('has proper focus management', async () => {
      const user = userEvent.setup();
      
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole('button', { name: /focusable button/i });
      
      await user.tab();
      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('has proper ARIA attributes for pending state', () => {
      render(<Button pending>Loading</Button>);
      const button = screen.getByRole('button', { name: /loading/i });
      
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('data-state', 'pending');
    });

    it('supports keyboard navigation', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      const button = screen.getByRole('button', { name: /keyboard button/i });
      
      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Space key activation for buttons should work
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Advanced Features', () => {
    it('applies custom className correctly', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      const button = screen.getByRole('button', { name: /custom button/i });
      
      expect(button).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      
      render(<Button ref={ref}>Ref Button</Button>);
      
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('passes through HTML button attributes', () => {
      render(
        <Button 
          type="submit" 
          name="test-button" 
          value="test-value"
          data-testid="html-button"
        >
          HTML Button
        </Button>
      );
      
      const button = screen.getByTestId('html-button');
      
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'test-button');
      expect(button).toHaveAttribute('value', 'test-value');
    });
  });

  describe('Token Integration', () => {
    it('uses design tokens instead of hardcoded classes', () => {
      render(<Button variant="primary">Token Button</Button>);
      const button = screen.getByRole('button', { name: /token button/i });
      
      // Should have base button classes from design tokens
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
      expect(button).toHaveClass('font-medium', 'rounded-md');
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
      expect(button).toHaveClass('transition-[color,background-color,box-shadow,transform]');
    });

    it('applies proper data attributes for debugging', () => {
      render(<Button variant="secondary" size="lg">Debug Button</Button>);
      const button = screen.getByRole('button', { name: /debug button/i });
      
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('data-size', 'lg');
    });
  });
});

describe('Button Component Integration Tests', () => {
  it('works correctly in form submission', async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const user = userEvent.setup();
    
    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit Form</Button>
      </form>
    );
    
    const button = screen.getByRole('button', { name: /submit form/i });
    await user.click(button);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports complex real-world scenarios', async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();
    
    const Component = () => {
      const [saving, setSaving] = useState(false);
      
      const handleClick = async () => {
        setSaving(true);
        await handleSave();
        setSaving(false);
      };
      
      return (
        <Button 
          onClick={handleClick}
          pending={saving}
          icon={<Save data-testid="save-icon" />}
          iconPosition="left"
          variant="primary"
        >
          {saving ? 'Saving...' : 'Save Document'}
        </Button>
      );
    };
    
    render(<Component />);
    
    const button = screen.getByRole('button', { name: /save document/i });
    await user.click(button);
    
    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
