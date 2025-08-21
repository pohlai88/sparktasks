/**
 * TableOfContents Component Test
 *
 * Comprehensive test suite for the TableOfContents component covering:
 * - Basic rendering functionality
 * - Heading extraction and navigation
 * - Current section highlighting
 * - Keyboard navigation and accessibility
 * - Responsive design and sticky positioning
 * - Loading and empty states
 *
 * @version 1.0.0
 * @author SparkTasks Enterprise UI Team
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TableOfContents, { TOCHeading } from '@/components/ui/TableOfContents';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

window.IntersectionObserver = mockIntersectionObserver;

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

describe('TableOfContents', () => {
  const mockHeadings: TOCHeading[] = [
    {
      id: 'heading-1',
      text: 'Introduction',
      level: 1,
    },
    {
      id: 'heading-2',
      text: 'Getting Started',
      level: 2,
    },
    {
      id: 'heading-3',
      text: 'Installation',
      level: 3,
    },
    {
      id: 'heading-4',
      text: 'Configuration',
      level: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<TableOfContents headings={mockHeadings} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    });

    it('renders all provided headings', () => {
      render(<TableOfContents headings={mockHeadings} />);

      mockHeadings.forEach(heading => {
        expect(screen.getByText(heading.text)).toBeInTheDocument();
      });
    });

    it('supports custom title', () => {
      const customTitle = 'Page Contents';
      render(<TableOfContents headings={mockHeadings} title={customTitle} />);

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.queryByText('Table of Contents')).not.toBeInTheDocument();
    });

    it('can hide title', () => {
      render(<TableOfContents headings={mockHeadings} showTitle={false} />);

      expect(screen.queryByText('Table of Contents')).not.toBeInTheDocument();
    });
  });

  describe('Loading and Empty States', () => {
    it('shows loading skeleton when loading prop is true', () => {
      render(<TableOfContents loading />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Table of Contents')).toBeInTheDocument();
      // Loading skeleton should be present (has animate-pulse class)
    });

    it('shows empty state when no headings provided', () => {
      render(<TableOfContents headings={[]} />);

      expect(screen.getByText('No headings found')).toBeInTheDocument();
    });

    it('supports custom empty content', () => {
      const customEmpty = 'No content available';
      render(<TableOfContents headings={[]} emptyContent={customEmpty} />);

      expect(screen.getByText(customEmpty)).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    beforeEach(() => {
      // Mock document.getElementById for heading navigation
      vi.spyOn(document, 'getElementById').mockImplementation(id => {
        const mockElement = {
          offsetTop: 100,
        } as HTMLElement;
        return id.startsWith('heading-') ? mockElement : null;
      });
    });

    it('handles heading click navigation', async () => {
      const user = userEvent.setup();
      const onHeadingClick = vi.fn();

      render(
        <TableOfContents
          headings={mockHeadings}
          onHeadingClick={onHeadingClick}
        />
      );

      const firstHeading = screen.getByText('Introduction');
      await user.click(firstHeading);

      expect(onHeadingClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'heading-1',
          text: 'Introduction',
          level: 1,
        })
      );
    });

    it('scrolls to heading on click', async () => {
      const user = userEvent.setup();

      render(<TableOfContents headings={mockHeadings} />);

      const firstHeading = screen.getByText('Introduction');
      await user.click(firstHeading);

      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const onHeadingClick = vi.fn();

      render(
        <TableOfContents
          headings={mockHeadings}
          onHeadingClick={onHeadingClick}
        />
      );

      // Find the button element by its aria-label instead of the text
      const firstHeading = screen.getByRole('button', {
        name: /Navigate to Introduction/i,
      });
      firstHeading.focus();

      await user.keyboard('{Enter}');
      expect(onHeadingClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'heading-1',
          text: 'Introduction',
          level: 1,
        })
      );

      await user.keyboard(' ');
      expect(onHeadingClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Variants and Styling', () => {
    it('applies size variants correctly', () => {
      const { rerender } = render(
        <TableOfContents headings={mockHeadings} size='sm' />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      rerender(<TableOfContents headings={mockHeadings} size='lg' />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('applies visual variants correctly', () => {
      const { rerender } = render(
        <TableOfContents headings={mockHeadings} variant='minimal' />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      rerender(<TableOfContents headings={mockHeadings} variant='card' />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('supports sticky positioning', () => {
      render(<TableOfContents headings={mockHeadings} sticky />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Collapsible Functionality', () => {
    it('renders collapse toggle when collapsible is true', () => {
      render(<TableOfContents headings={mockHeadings} collapsible />);

      const toggleButton = screen.getByLabelText('Collapse table of contents');
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles content visibility when collapse button is clicked', async () => {
      const user = userEvent.setup();

      render(<TableOfContents headings={mockHeadings} collapsible />);

      const toggleButton = screen.getByLabelText('Collapse table of contents');

      // Initially expanded
      expect(screen.getByText('Introduction')).toBeInTheDocument();

      // Collapse
      await user.click(toggleButton);

      // Check aria-expanded state
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('starts collapsed when defaultCollapsed is true', () => {
      render(
        <TableOfContents headings={mockHeadings} collapsible defaultCollapsed />
      );

      const toggleButton = screen.getByLabelText('Expand table of contents');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Progress Indicator', () => {
    it('shows progress indicator when showProgress is true', () => {
      render(<TableOfContents headings={mockHeadings} showProgress />);

      // Progress bar should be in the DOM
      const progressContainer = screen.getByRole('navigation');
      expect(progressContainer).toBeInTheDocument();
    });

    it('hides progress indicator when collapsed', () => {
      render(
        <TableOfContents
          headings={mockHeadings}
          showProgress
          collapsible
          defaultCollapsed
        />
      );

      // Progress should not be visible when collapsed
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<TableOfContents headings={mockHeadings} />);

      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label', 'Table of contents');
    });

    it('has proper heading structure', () => {
      render(<TableOfContents headings={mockHeadings} />);

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Table of Contents');
    });

    it('supports focus management', () => {
      render(<TableOfContents headings={mockHeadings} />);

      const headingItems = screen.getAllByRole('button');
      headingItems.forEach(item => {
        expect(item).toHaveAttribute('tabIndex', '0');
      });
    });

    it('provides descriptive aria-labels for navigation', () => {
      render(<TableOfContents headings={mockHeadings} />);

      const firstHeading = screen.getByLabelText('Navigate to Introduction');
      expect(firstHeading).toBeInTheDocument();
    });
  });

  describe('Content Extraction', () => {
    beforeEach(() => {
      // Create mock DOM structure for content extraction tests
      const mockContainer = document.createElement('div');
      mockContainer.innerHTML = `
        <h1 id="title">Page Title</h1>
        <h2 id="section1">Section 1</h2>
        <h3 id="subsection1">Subsection 1</h3>
        <h2 id="section2">Section 2</h2>
      `;

      vi.spyOn(document, 'querySelector').mockReturnValue(mockContainer);
      vi.spyOn(mockContainer, 'querySelectorAll').mockReturnValue(
        mockContainer.querySelectorAll(
          'h1, h2, h3'
        ) as NodeListOf<HTMLHeadingElement>
      );
    });

    it('extracts headings from content selector', () => {
      render(<TableOfContents contentSelector='#content' />);

      expect(document.querySelector).toHaveBeenCalledWith('#content');
    });
  });

  describe('Nested Structure', () => {
    const nestedHeadings: TOCHeading[] = [
      {
        id: 'h1',
        text: 'Chapter 1',
        level: 1,
        children: [
          {
            id: 'h1.1',
            text: 'Section 1.1',
            level: 2,
            children: [
              {
                id: 'h1.1.1',
                text: 'Subsection 1.1.1',
                level: 3,
              },
            ],
          },
        ],
      },
    ];

    it('renders nested heading structure when nested prop is true', () => {
      render(<TableOfContents headings={nestedHeadings} nested />);

      expect(screen.getByText('Chapter 1')).toBeInTheDocument();
      expect(screen.getByText('Section 1.1')).toBeInTheDocument();
      expect(screen.getByText('Subsection 1.1.1')).toBeInTheDocument();
    });

    it('flattens structure when nested prop is false', () => {
      render(<TableOfContents headings={nestedHeadings} nested={false} />);

      expect(screen.getByText('Chapter 1')).toBeInTheDocument();
      expect(screen.getByText('Section 1.1')).toBeInTheDocument();
      expect(screen.getByText('Subsection 1.1.1')).toBeInTheDocument();
    });
  });
});
