import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeBlock } from '../../src/components/ui/CodeBlock';

// Mock clipboard API
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
});

// Mock execCommand for fallback
document.execCommand = vi.fn();

describe('CodeBlock', () => {
  beforeEach(() => {
    mockWriteText.mockClear();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders code content correctly', () => {
      render(<CodeBlock>const hello = 'world';</CodeBlock>);

      expect(screen.getByText("const hello = 'world';")).toBeInTheDocument();
    });

    it('renders with proper accessibility attributes', () => {
      render(<CodeBlock language='javascript'>console.log('test');</CodeBlock>);

      const codeElement = screen.getByRole('img');
      expect(codeElement).toHaveAttribute('aria-label');
      expect(codeElement.getAttribute('aria-label')).toContain('javascript');
    });

    it('includes screen reader content', () => {
      render(<CodeBlock language='typescript'>const x = 1;</CodeBlock>);

      expect(screen.getByText(/Code language: typescript/)).toBeInTheDocument();
      expect(screen.getByText(/1 lines of code/)).toBeInTheDocument();
    });
  });

  describe('Language Support', () => {
    it('displays language in screen reader text', () => {
      render(<CodeBlock language='tsx'>{'const App = () => null;'}</CodeBlock>);

      expect(
        screen.getByText(/Code language: TypeScript React/)
      ).toBeInTheDocument();
    });

    it('handles unknown languages', () => {
      render(<CodeBlock language='customlang'>code here</CodeBlock>);

      expect(screen.getByText(/Code language: customlang/)).toBeInTheDocument();
    });

    it('handles common languages correctly', () => {
      const testCases = [
        { code: 'js', label: 'JavaScript' },
        { code: 'py', label: 'Python' },
        { code: 'unknown', label: 'unknown' },
      ];

      testCases.forEach(({ code, label }) => {
        const { unmount } = render(<CodeBlock language={code}>test</CodeBlock>);
        expect(
          screen.getByText(new RegExp(`Code language: ${label}`))
        ).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<CodeBlock variant='default'>test code</CodeBlock>);
      const container = screen.getByRole('img').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders minimal variant', () => {
      render(<CodeBlock variant='minimal'>test code</CodeBlock>);
      const container = screen.getByRole('img').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders terminal variant with prompt', () => {
      render(<CodeBlock variant='terminal'>npm install</CodeBlock>);

      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('npm install')).toBeInTheDocument();
    });

    it('renders diff variant', () => {
      const diffContent = '- old line\n+ new line';
      render(<CodeBlock variant='diff'>{diffContent}</CodeBlock>);

      const container = screen.getByRole('img').closest('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders with small size', () => {
      render(<CodeBlock size='sm'>test</CodeBlock>);
      const container = screen.getByRole('img').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders with medium size', () => {
      render(<CodeBlock size='md'>test</CodeBlock>);
      const container = screen.getByRole('img').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<CodeBlock size='lg'>test</CodeBlock>);
      const container = screen.getByRole('img').closest('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('shows copy button when copyable prop is true', () => {
      render(<CodeBlock copyable>const test = true;</CodeBlock>);

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('copies code to clipboard when copy button is clicked', async () => {
      render(<CodeBlock copyable>const test = true;</CodeBlock>);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('const test = true;');
      });
    });

    it('shows success feedback after copying', async () => {
      render(<CodeBlock copyable>const test = true;</CodeBlock>);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });

    it('resets copy state after timeout', async () => {
      vi.useFakeTimers();

      render(<CodeBlock copyable>const test = true;</CodeBlock>);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });

      vi.advanceTimersByTime(2100);

      await waitFor(() => {
        expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('Line Numbers', () => {
    it('shows line numbers when showLineNumbers prop is true', () => {
      const multiLineCode = 'line 1\nline 2\nline 3';
      render(<CodeBlock showLineNumbers>{multiLineCode}</CodeBlock>);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('highlights specific lines when highlightLines is provided', () => {
      const multiLineCode = 'line 1\nline 2\nline 3';
      render(
        <CodeBlock showLineNumbers highlightLines={[2]}>
          {multiLineCode}
        </CodeBlock>
      );

      // Should render line numbers
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Collapsible Functionality', () => {
    it('shows expand/collapse button when collapsible prop is true', () => {
      render(<CodeBlock collapsible>const test = true;</CodeBlock>);

      expect(
        screen.getByRole('button', { name: /collapse/i })
      ).toBeInTheDocument();
    });

    it('toggles content visibility when collapse button is clicked', () => {
      render(<CodeBlock collapsible>const test = true;</CodeBlock>);

      const toggleButton = screen.getByRole('button', { name: /collapse/i });

      // Content should be visible initially
      expect(screen.getByText('const test = true;')).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(toggleButton);

      // Content should be hidden
      expect(screen.queryByText('const test = true;')).not.toBeInTheDocument();

      // Click to expand
      fireEvent.click(toggleButton);

      // Content should be visible again
      expect(screen.getByText('const test = true;')).toBeInTheDocument();
    });
  });

  describe('Filename Display', () => {
    it('shows filename when provided', () => {
      render(<CodeBlock filename='App.tsx'>code</CodeBlock>);

      expect(screen.getByText('App.tsx')).toBeInTheDocument();
    });

    it('shows macOS-style window controls with filename', () => {
      render(<CodeBlock filename='App.tsx'>code</CodeBlock>);

      const filenameHeader = screen.getByText('App.tsx').closest('div');
      expect(filenameHeader).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<CodeBlock language='javascript'>console.log('test');</CodeBlock>);

      const codeElement = screen.getByRole('img');
      expect(codeElement).toHaveAttribute('aria-label');
      expect(codeElement).toHaveAttribute('role', 'img');
    });

    it('includes screen reader friendly content', () => {
      render(<CodeBlock language='typescript'>const x = 1;</CodeBlock>);

      const srContent = screen.getByText(/Code language: typescript/);
      expect(srContent).toHaveClass('sr-only');
    });

    it('supports keyboard navigation for interactive elements', () => {
      render(
        <CodeBlock copyable collapsible>
          const test = true;
        </CodeBlock>
      );

      const copyButton = screen.getByRole('button', { name: /copy/i });
      const toggleButton = screen.getByRole('button', { name: /collapse/i });

      expect(copyButton).toBeInTheDocument();
      expect(toggleButton).toBeInTheDocument();

      // Both buttons should be focusable
      copyButton.focus();
      expect(document.activeElement).toBe(copyButton);

      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty code gracefully', () => {
      render(<CodeBlock>{''}</CodeBlock>);

      const codeElement = screen.getByRole('img');
      expect(codeElement).toBeInTheDocument();
    });

    it('handles very long lines', () => {
      const longCode = 'a'.repeat(1000);
      render(<CodeBlock>{longCode}</CodeBlock>);

      expect(screen.getByText(longCode)).toBeInTheDocument();
    });

    it('handles special characters in code', () => {
      const specialCode = '<>&"\'';
      render(<CodeBlock>{specialCode}</CodeBlock>);

      expect(screen.getByText(specialCode)).toBeInTheDocument();
    });

    it('handles null/undefined children gracefully', () => {
      render(<CodeBlock>{null}</CodeBlock>);

      const codeElement = screen.getByRole('img');
      expect(codeElement).toBeInTheDocument();
    });
  });

  describe('Custom JSX Content', () => {
    it('renders custom JSX content', () => {
      render(
        <CodeBlock>
          <div data-testid='custom-content'>Custom JSX content</div>
        </CodeBlock>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom JSX content')).toBeInTheDocument();
    });
  });
});
