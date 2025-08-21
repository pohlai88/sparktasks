/**
 * Note Component Tests
 *
 * Comprehensive test suite for the Note component ensuring
 * enterprise-grade quality and accessibility compliance.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Note from '@/components/ui/Note';

// Test utilities
const NOTE_VARIANTS = ['default', 'subtle', 'outlined', 'filled'] as const;
const NOTE_SIZES = ['sm', 'md', 'lg'] as const;
const NOTE_ICONS = ['info', 'lightbulb', 'bookmark', 'note'] as const;

describe('Note Component', () => {
  beforeEach(() => {
    cleanup();
  });

  // ===== BASIC FUNCTIONALITY =====
  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<Note>Test content</Note>);

      expect(screen.getByRole('note')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<Note title='Important Note'>Test content</Note>);

      expect(screen.getByText('Important Note')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders with nested content', () => {
      render(
        <Note>
          <div>Nested content</div>
          <p>With paragraph</p>
          <ul>
            <li>List item</li>
          </ul>
        </Note>
      );

      expect(screen.getByText('Nested content')).toBeInTheDocument();
      expect(screen.getByText('With paragraph')).toBeInTheDocument();
      expect(screen.getByText('List item')).toBeInTheDocument();
    });
  });

  // ===== VARIANT TESTS =====
  describe('Variants', () => {
    NOTE_VARIANTS.forEach(variant => {
      it(`renders ${variant} variant correctly`, () => {
        render(
          <Note variant={variant} data-testid={`note-${variant}`}>
            {variant} content
          </Note>
        );

        const note = screen.getByTestId(`note-${variant}`);
        expect(note).toBeInTheDocument();
        expect(screen.getByText(`${variant} content`)).toBeInTheDocument();
      });
    });

    it('applies correct ARIA attributes', () => {
      render(<Note>Test content</Note>);

      const note = screen.getByRole('note');
      expect(note).toHaveAttribute('aria-live', 'polite');
    });
  });

  // ===== SIZE TESTS =====
  describe('Sizes', () => {
    NOTE_SIZES.forEach(size => {
      it(`renders ${size} size correctly`, () => {
        render(
          <Note size={size} data-testid={`note-${size}`}>
            {size} content
          </Note>
        );

        const note = screen.getByTestId(`note-${size}`);
        expect(note).toBeInTheDocument();
        expect(screen.getByText(`${size} content`)).toBeInTheDocument();
      });
    });
  });

  // ===== ICON FUNCTIONALITY =====
  describe('Icon Functionality', () => {
    it('shows semantic icon by default', () => {
      render(<Note>Content</Note>);

      // Should have an SVG icon
      const svg = screen.getByRole('note').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('hides icon when showIcon is false', () => {
      render(<Note showIcon={false}>Content</Note>);

      // Should not have an SVG icon
      const svg = screen.getByRole('note').querySelector('svg');
      expect(svg).toBeNull();
    });

    NOTE_ICONS.forEach(iconType => {
      it(`renders ${iconType} icon correctly`, () => {
        render(
          <Note icon={iconType} data-testid={`note-${iconType}`}>
            Content
          </Note>
        );

        const note = screen.getByTestId(`note-${iconType}`);
        const svg = note.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });

    it('renders custom icon when provided', () => {
      const customIcon = <span data-testid='custom-icon'>Custom</span>;

      render(<Note icon={customIcon}>Content</Note>);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  // ===== DISMISSIBLE FUNCTIONALITY =====
  describe('Dismissible Functionality', () => {
    it('shows dismiss button when dismissible is true', () => {
      render(<Note dismissible>Dismissible content</Note>);

      const dismissButton = screen.getByRole('button', {
        name: /dismiss note/i,
      });
      expect(dismissButton).toBeInTheDocument();
    });

    it('hides dismiss button when dismissible is false', () => {
      render(<Note dismissible={false}>Non-dismissible content</Note>);

      const dismissButton = screen.queryByRole('button', {
        name: /dismiss note/i,
      });
      expect(dismissButton).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(
        <Note dismissible onDismiss={onDismiss}>
          Dismissible content
        </Note>
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss note/i,
      });
      await user.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('removes note from DOM when dismissed', async () => {
      const user = userEvent.setup();

      render(
        <Note dismissible data-testid='dismissible-note'>
          Dismissible content
        </Note>
      );

      const note = screen.getByTestId('dismissible-note');
      expect(note).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', {
        name: /dismiss note/i,
      });
      await user.click(dismissButton);

      expect(screen.queryByTestId('dismissible-note')).not.toBeInTheDocument();
    });
  });

  // ===== COLLAPSIBLE FUNCTIONALITY =====
  describe('Collapsible Functionality', () => {
    it('shows collapse button when collapsible is true', () => {
      render(<Note collapsible>Collapsible content</Note>);

      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });
      expect(collapseButton).toBeInTheDocument();
    });

    it('hides collapse button when collapsible is false', () => {
      render(<Note collapsible={false}>Non-collapsible content</Note>);

      const collapseButton = screen.queryByRole('button', {
        name: /collapse note/i,
      });
      expect(collapseButton).not.toBeInTheDocument();
    });

    it('starts expanded by default', () => {
      render(<Note collapsible>Collapsible content</Note>);

      expect(screen.getByText('Collapsible content')).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });
      expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('starts collapsed when defaultCollapsed is true', () => {
      render(
        <Note collapsible defaultCollapsed>
          Collapsible content
        </Note>
      );

      const content = screen.getByText('Collapsible content');
      expect(content).toHaveClass('hidden');

      const expandButton = screen.getByRole('button', { name: /expand note/i });
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles content visibility when collapse button is clicked', async () => {
      const user = userEvent.setup();

      render(<Note collapsible>Collapsible content</Note>);

      const content = screen.getByText('Collapsible content');
      expect(content).not.toHaveClass('hidden');

      // Collapse
      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });
      await user.click(collapseButton);

      expect(content).toHaveClass('hidden');
      expect(collapseButton).toHaveAttribute('aria-expanded', 'false');

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand note/i });
      await user.click(expandButton);

      expect(content).not.toHaveClass('hidden');
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onToggle when collapse state changes', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();

      render(
        <Note collapsible onToggle={onToggle}>
          Collapsible content
        </Note>
      );

      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });
      await user.click(collapseButton);

      expect(onToggle).toHaveBeenCalledWith(true);

      const expandButton = screen.getByRole('button', { name: /expand note/i });
      await user.click(expandButton);

      expect(onToggle).toHaveBeenCalledWith(false);
    });
  });

  // ===== COMBINED FEATURES =====
  describe('Combined Features', () => {
    it('supports both dismissible and collapsible features', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      const onToggle = vi.fn();

      render(
        <Note
          dismissible
          collapsible
          onDismiss={onDismiss}
          onToggle={onToggle}
          title='Complex Note'
        >
          Content with both features
        </Note>
      );

      // Both buttons should be present
      expect(
        screen.getByRole('button', { name: /dismiss note/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /collapse note/i })
      ).toBeInTheDocument();

      // Test collapse
      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });
      await user.click(collapseButton);
      expect(onToggle).toHaveBeenCalledWith(true);

      // Test dismiss
      const dismissButton = screen.getByRole('button', {
        name: /dismiss note/i,
      });
      await user.click(dismissButton);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  // ===== ACCESSIBILITY =====
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Note>Content</Note>);

      const note = screen.getByRole('note');
      expect(note).toHaveAttribute('aria-live', 'polite');
    });

    it('has proper aria-hidden on icons', () => {
      render(<Note>Content</Note>);

      const iconContainer = screen
        .getByRole('note')
        .querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('dismiss button has proper accessible name', () => {
      render(<Note dismissible>Content</Note>);

      const dismissButton = screen.getByRole('button', {
        name: /dismiss note/i,
      });
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss note');
    });

    it('collapse button has proper accessible name and state', () => {
      render(<Note collapsible>Content</Note>);

      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });
      expect(collapseButton).toHaveAttribute('aria-label', 'Collapse note');
      expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports keyboard interaction on action buttons', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      const onToggle = vi.fn();

      render(
        <Note dismissible collapsible onDismiss={onDismiss} onToggle={onToggle}>
          Content
        </Note>
      );

      const dismissButton = screen.getByRole('button', {
        name: /dismiss note/i,
      });
      const collapseButton = screen.getByRole('button', {
        name: /collapse note/i,
      });

      // Focus and press Enter on collapse button
      collapseButton.focus();
      await user.keyboard('{Enter}');
      expect(onToggle).toHaveBeenCalledWith(true);

      // Focus and press Enter on dismiss button
      dismissButton.focus();
      await user.keyboard('{Enter}');
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  // ===== FORWARDED REF =====
  describe('Forwarded Ref', () => {
    it('forwards ref to the note div', () => {
      const ref = { current: null };

      render(<Note ref={ref}>Content</Note>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Content');
    });
  });

  // ===== CUSTOM PROPS =====
  describe('Custom Props', () => {
    it('passes through custom className', () => {
      render(
        <Note className='custom-class' data-testid='custom-note'>
          Content
        </Note>
      );

      const note = screen.getByTestId('custom-note');
      expect(note).toHaveClass('custom-class');
    });

    it('passes through custom data attributes', () => {
      render(
        <Note data-custom='test-value' data-testid='custom-note'>
          Content
        </Note>
      );

      const note = screen.getByTestId('custom-note');
      expect(note).toHaveAttribute('data-custom', 'test-value');
    });

    it('supports custom style prop', () => {
      render(
        <Note style={{ marginTop: '20px' }} data-testid='styled-note'>
          Content
        </Note>
      );

      const note = screen.getByTestId('styled-note');
      expect(note).toHaveStyle({ marginTop: '20px' });
    });
  });
});
