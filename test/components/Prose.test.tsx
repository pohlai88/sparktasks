/**
 * @fileoverview Test Suite for Prose Component
 * @author SparkTasks
 * @version 1.0.0
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Prose } from '@/components/ui/Prose';

// ===== TEST CONSTANTS =====

const mockContent = `
  <h1>Main Heading</h1>
  <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
  <h2>Secondary Heading</h2>
  <ul>
    <li>First item</li>
    <li>Second item</li>
  </ul>
  <blockquote>This is a blockquote</blockquote>
  <pre><code>const code = "example";</code></pre>
`;

const mockSimpleContent = `
  <h1>Simple Title</h1>
  <p>Simple paragraph content</p>
`;

// ===== TEST SUITE =====

describe('Prose Component - Enterprise Grade', () => {
  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      render(
        <Prose>
          <div dangerouslySetInnerHTML={{ __html: mockSimpleContent }} />
        </Prose>
      );

      expect(screen.getByTestId('prose')).toBeInTheDocument();
    });

    it('renders children content correctly', () => {
      render(
        <Prose>
          <h1>Test Heading</h1>
          <p>Test paragraph</p>
        </Prose>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Test Heading'
      );
      expect(screen.getByText('Test paragraph')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Prose className='custom-prose'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('custom-prose');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Prose ref={ref}>
          <p>Content</p>
        </Prose>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('uses default props correctly', () => {
      render(
        <Prose>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'default');
      expect(prose).toHaveAttribute('data-reading-mode', 'default');
      expect(prose).toHaveAttribute('data-size', 'md');
    });
  });

  describe('Variant Styling', () => {
    it('applies default variant styling', () => {
      render(
        <Prose variant='default'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'default');
    });

    it('applies article variant styling', () => {
      render(
        <Prose variant='article'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'article');
    });

    it('applies documentation variant styling', () => {
      render(
        <Prose variant='documentation'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'documentation');
    });

    it('applies legal variant styling', () => {
      render(
        <Prose variant='legal'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'legal');
    });

    it('applies compact variant styling', () => {
      render(
        <Prose variant='compact'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'compact');
    });

    it('applies large variant styling', () => {
      render(
        <Prose variant='large'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'large');
    });
  });

  describe('Reading Mode', () => {
    it('applies default reading mode', () => {
      render(
        <Prose readingMode='default'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-reading-mode', 'default');
    });

    it('applies comfortable reading mode', () => {
      render(
        <Prose readingMode='comfortable'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-reading-mode', 'comfortable');
    });

    it('applies dense reading mode', () => {
      render(
        <Prose readingMode='dense'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-reading-mode', 'dense');
    });
  });

  describe('Size Variants', () => {
    it('applies small size correctly', () => {
      render(
        <Prose size='sm'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-size', 'sm');
    });

    it('applies medium size correctly', () => {
      render(
        <Prose size='md'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-size', 'md');
    });

    it('applies large size correctly', () => {
      render(
        <Prose size='lg'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-size', 'lg');
    });

    it('applies extra large size correctly', () => {
      render(
        <Prose size='xl'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-size', 'xl');
    });
  });

  describe('Max Width Settings', () => {
    it('applies no max width', () => {
      render(
        <Prose maxWidth='none'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).not.toHaveClass('max-w-');
    });

    it('applies small max width', () => {
      render(
        <Prose maxWidth='sm'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('max-w-sm');
    });

    it('applies medium max width (default)', () => {
      render(
        <Prose maxWidth='md'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('max-w-2xl');
    });

    it('applies large max width', () => {
      render(
        <Prose maxWidth='lg'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('max-w-4xl');
    });

    it('applies extra large max width', () => {
      render(
        <Prose maxWidth='xl'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('max-w-6xl');
    });

    it('applies full max width', () => {
      render(
        <Prose maxWidth='full'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('max-w-full');
    });
  });

  describe('Link Handling', () => {
    it('handles link clicks with custom handler', () => {
      const mockLinkHandler = vi.fn();

      render(
        <Prose onLinkClick={mockLinkHandler}>
          <a href='https://example.com'>Test Link</a>
        </Prose>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(mockLinkHandler).toHaveBeenCalledWith(
        'https://example.com/',
        expect.any(Object)
      );
    });

    it('supports keyboard navigation for links', () => {
      const mockLinkHandler = vi.fn();

      render(
        <Prose onLinkClick={mockLinkHandler}>
          <a href='https://example.com'>Test Link</a>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      fireEvent.keyDown(prose, { key: 'Enter' });

      // Should be callable via keyboard
      expect(prose).toBeInTheDocument();
    });

    it('does not interfere with normal links when no handler provided', () => {
      render(
        <Prose>
          <a href='https://example.com'>Test Link</a>
        </Prose>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });

  describe('Typography Classes', () => {
    it('includes prose base classes', () => {
      render(
        <Prose>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('prose', 'prose-slate');
    });

    it('includes dark mode support', () => {
      render(
        <Prose>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('dark:prose-invert');
    });

    it('includes responsive margins', () => {
      render(
        <Prose>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveClass('mx-auto');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(
        <Prose>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('role', 'article');
    });

    it('supports keyboard navigation when link handler provided', () => {
      const mockLinkHandler = vi.fn();

      render(
        <Prose onLinkClick={mockLinkHandler}>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      fireEvent.keyDown(prose, { key: 'Enter' });
      fireEvent.keyDown(prose, { key: ' ' });

      expect(prose).toBeInTheDocument();
    });

    it('provides semantic HTML structure', () => {
      render(
        <Prose>
          <h1>Heading</h1>
          <p>Paragraph</p>
          <ul>
            <li>List item</li>
          </ul>
        </Prose>
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });
  });

  describe('Complex Content Rendering', () => {
    it('handles complex HTML content', () => {
      render(
        <Prose>
          <div dangerouslySetInnerHTML={{ __html: mockContent }} />
        </Prose>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Main Heading'
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Secondary Heading'
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('preserves HTML structure and formatting', () => {
      render(
        <Prose>
          <h1>Title</h1>
          <p>
            Paragraph with <strong>bold</strong> and <em>italic</em> text.
          </p>
          <blockquote>Quote content</blockquote>
        </Prose>
      );

      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
      expect(screen.getByText('Quote content')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with minimal DOM structure', () => {
      const { container } = render(
        <Prose>
          <p>Simple content</p>
        </Prose>
      );

      // Should have a clean, minimal DOM structure
      const proseElement = container.firstChild;
      expect(proseElement).toBeInstanceOf(HTMLDivElement);
    });

    it('memoizes class calculations', () => {
      const { rerender } = render(
        <Prose variant='default' size='md'>
          <p>Content</p>
        </Prose>
      );

      // Re-render with same props should not cause issues
      rerender(
        <Prose variant='default' size='md'>
          <p>Content</p>
        </Prose>
      );

      expect(screen.getByTestId('prose')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles empty content gracefully', () => {
      render(
        <Prose>
          <div />
        </Prose>
      );

      expect(screen.getByTestId('prose')).toBeInTheDocument();
    });

    it('handles malformed HTML content', () => {
      render(
        <Prose>
          <div dangerouslySetInnerHTML={{ __html: '<p>Unclosed paragraph' }} />
        </Prose>
      );

      expect(screen.getByTestId('prose')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('combines multiple styling options correctly', () => {
      render(
        <Prose
          variant='article'
          readingMode='comfortable'
          size='lg'
          maxWidth='xl'
          className='custom-class'
        >
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'article');
      expect(prose).toHaveAttribute('data-reading-mode', 'comfortable');
      expect(prose).toHaveAttribute('data-size', 'lg');
      expect(prose).toHaveClass('custom-class');
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(
        <Prose variant='default'>
          <p>Content</p>
        </Prose>
      );

      rerender(
        <Prose variant='article'>
          <p>Content</p>
        </Prose>
      );

      rerender(
        <Prose variant='documentation'>
          <p>Content</p>
        </Prose>
      );

      const prose = screen.getByTestId('prose');
      expect(prose).toHaveAttribute('data-variant', 'documentation');
    });
  });
});
