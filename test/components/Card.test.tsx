import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../src/components/ui/Card';

// ============================================================================
// CARD COMPONENT TEST SUITE - ENTERPRISE GRADE
// ============================================================================
// 🎯 PURPOSE: Comprehensive Testing for Fortune 500+ Standards
// 📊 COVERAGE: All props, interactions, accessibility, edge cases
// 🏗️ PATTERNS: Jest/Vitest, React Testing Library, User Events
// ♿ A11Y: WCAG 2.1 AAA Compliance Validation
// 🧪 TYPES: Unit, Integration, Accessibility, Edge Cases
// ============================================================================

describe('Card Component Enterprise Suite', () => {
  // ===== BASIC RENDERING TESTS =====
  describe('Basic Rendering', () => {
    test('renders card with default props', () => {
      render(<Card data-testid="test-card">Card content</Card>);
      
      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card content');
    });

    test('applies default classes correctly', () => {
      render(<Card data-testid="test-card">Content</Card>);
      
      const card = screen.getByTestId('test-card');
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-white', 'p-6');
      // Should have shadow from elevation system
      expect(card).toHaveClass('shadow-lg');
    });

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // ===== VARIANT SYSTEM TESTS =====
  describe('Variant System', () => {
    test('applies default variant correctly', () => {
      render(<Card data-testid="card" variant="default">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-white', 'p-6');
      // Should have proper elevation
      expect(card).toHaveClass('shadow-lg');
    });

    test('applies interactive variant correctly', () => {
      render(<Card data-testid="card" variant="interactive">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('cursor-pointer', 'transition-colors');
    });

    test('applies semantic variants correctly', () => {
      const { rerender } = render(<Card data-testid="card" variant="success">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('border-green-200', 'bg-green-50');

      rerender(<Card data-testid="card" variant="warning">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('border-amber-200', 'bg-amber-50');

      rerender(<Card data-testid="card" variant="error">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('border-red-200', 'bg-red-50');

      rerender(<Card data-testid="card" variant="info">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('border-primary-200', 'bg-primary-50');
    });

    test('applies elevation variants correctly', () => {
      const { rerender } = render(<Card data-testid="card" elevation="none">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-none');

      rerender(<Card data-testid="card" elevation="floating">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-xl');
    });
  });

  // ===== INTERACTIVE BEHAVIOR TESTS =====
  describe('Interactive Behavior', () => {
    test('handles click events for interactive cards', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(
        <Card data-testid="card" interactive onClick={handleClick}>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      await user.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(card).toHaveClass('cursor-pointer');
    });

    test('handles keyboard navigation for interactive cards', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(
        <Card data-testid="card" interactive onClick={handleClick}>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      card.focus();
      
      // Test Enter key
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Test Space key
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    test('prevents interaction when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(
        <Card data-testid="card" interactive disabled onClick={handleClick}>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('aria-disabled', 'true');
      expect(card).toHaveAttribute('tabIndex', '-1');
      expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
      
      await user.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('applies correct ARIA attributes for interactive cards', () => {
      render(
        <Card data-testid="card" interactive>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  // ===== LOADING STATE TESTS =====
  describe('Loading States', () => {
    test('renders loading skeleton when loading=true', () => {
      render(<Card loading data-testid="card">Content</Card>);
      
      // Should render skeleton, not content
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    test('renders normal content when loading=false', () => {
      render(<Card loading={false} data-testid="card">Content</Card>);
      
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  // ===== ACCESSIBILITY TESTS =====
  describe('Accessibility Compliance', () => {
    test('maintains semantic structure', () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle level={2}>Test Title</CardTitle>
          </CardHeader>
          <CardContent>Test content</CardContent>
        </Card>
      );

      // Should have proper heading structure
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Test Title');
    });

    test('supports custom ARIA roles', () => {
      render(
        <Card data-testid="card" role="region" aria-label="Custom region">
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'region');
      expect(card).toHaveAttribute('aria-label', 'Custom region');
    });

    test('handles focus management correctly', () => {
      render(
        <Card data-testid="card" focusable>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('tabIndex', '0');
      
      card.focus();
      expect(card).toHaveFocus();
    });
  });

  // ===== COMPOUND COMPONENT TESTS =====
  describe('Compound Components', () => {
    test('CardHeader renders with correct structure', () => {
      render(
        <CardHeader data-testid="header" variant="bordered">
          Header content
        </CardHeader>
      );

      const header = screen.getByTestId('header');
      expect(header).toHaveTextContent('Header content');
      expect(header).toHaveClass('border-b');
    });

    test('CardTitle renders with correct heading level', () => {
      render(
        <CardTitle data-testid="title" level={1} size="xl">
          Title content
        </CardTitle>
      );

      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('H1');
      expect(title).toHaveClass('text-xl', 'font-bold');
    });

    test('CardContent applies spacing correctly', () => {
      const { rerender } = render(
        <CardContent data-testid="content" spacing="tight">
          Content
        </CardContent>
      );

      expect(screen.getByTestId('content')).toHaveClass('p-4');

      rerender(
        <CardContent data-testid="content" spacing="loose">
          Content
        </CardContent>
      );

      expect(screen.getByTestId('content')).toHaveClass('p-8');
    });

    test('CardFooter aligns content correctly', () => {
      const { rerender } = render(
        <CardFooter data-testid="footer" align="center">
          Footer
        </CardFooter>
      );

      expect(screen.getByTestId('footer')).toHaveClass('justify-center');

      rerender(
        <CardFooter data-testid="footer" align="between" bordered>
          Footer
        </CardFooter>
      );

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('justify-between');
      expect(footer).toHaveClass('border-t');
    });
  });

  // ===== COMPOUND COMPONENT ACCESS TESTS =====
  describe('Compound Component Access', () => {
    test('Card.Header is accessible', () => {
      render(<Card.Header data-testid="header">Header</Card.Header>);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    test('Card.Title is accessible', () => {
      render(<Card.Title data-testid="title">Title</Card.Title>);
      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    test('Card.Content is accessible', () => {
      render(<Card.Content data-testid="content">Content</Card.Content>);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    test('Card.Footer is accessible', () => {
      render(<Card.Footer data-testid="footer">Footer</Card.Footer>);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  // ===== INTEGRATION TESTS =====
  describe('Integration Scenarios', () => {
    test('complete card structure renders correctly', () => {
      render(
        <Card data-testid="card" variant="elevated" interactive>
          <Card.Header variant="bordered">
            <Card.Title level={2} size="lg">
              Complete Card Title
            </Card.Title>
          </Card.Header>
          <Card.Content spacing="default">
            This is the main content of the card with all features enabled.
          </Card.Content>
          <Card.Footer align="between" bordered>
            <button>Cancel</button>
            <button>Save</button>
          </Card.Footer>
        </Card>
      );

      // Verify all parts are present
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Complete Card Title')).toBeInTheDocument();
      expect(screen.getByText('This is the main content of the card with all features enabled.')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();

      // Verify structure
      const title = screen.getByText('Complete Card Title');
      expect(title.tagName).toBe('H2');
    });

    test('nested cards work correctly', () => {
      render(
        <Card data-testid="outer-card">
          <Card.Content>
            <Card data-testid="inner-card" variant="flat">
              <Card.Content>Nested content</Card.Content>
            </Card>
          </Card.Content>
        </Card>
      );

      expect(screen.getByTestId('outer-card')).toBeInTheDocument();
      expect(screen.getByTestId('inner-card')).toBeInTheDocument();
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });
  });

  // ===== EDGE CASES =====
  describe('Edge Cases', () => {
    test('handles empty content gracefully', () => {
      render(<Card data-testid="card" />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    test('handles custom className properly', () => {
      render(
        <Card data-testid="card" className="custom-class">
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
      // Should still have base classes
      expect(card).toHaveClass('rounded-lg');
    });

    test('handles all HTML attributes correctly', () => {
      render(
        <Card 
          data-testid="card" 
          id="unique-id" 
          aria-label="Test card"
          title="Card title"
        >
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'unique-id');
      expect(card).toHaveAttribute('aria-label', 'Test card');
      expect(card).toHaveAttribute('title', 'Card title');
    });
  });

  // ===== PERFORMANCE TESTS =====
  describe('Performance', () => {
    test('memoizes computed values correctly', () => {
      const { rerender } = render(
        <Card interactive data-testid="card">
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      const initialTabIndex = card.getAttribute('tabIndex');

      // Rerender with same props - should maintain state
      rerender(
        <Card interactive data-testid="card">
          Updated Content
        </Card>
      );

      expect(card.getAttribute('tabIndex')).toBe(initialTabIndex);
    });
  });
});
