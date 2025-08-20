/**
 * DescriptionList Component Test Suite - Enterprise Grade Testing
 * 
 * Comprehensive test coverage for DescriptionList/DescriptionItem components including:
 * - Rendering and basic functionality
 * - All variants and configurations
 * - Interactive behaviors and keyboard navigation
 * - Accessibility compliance (ARIA, semantic HTML)
 * - Loading and empty states
 * - Compound component architecture
 * - Content type handling and copy functionality
 * - Edge cases and error boundaries
 * 
 * Test Categories:
 * 1. Basic Rendering & Props
 * 2. Variant System Testing
 * 3. Layout & Spacing Configuration
 * 4. Interactive Behavior
 * 5. Keyboard Navigation & Focus
 * 6. Accessibility Compliance
 * 7. Loading & Empty States
 * 8. Compound Components
 * 9. Content Types & Copy Functionality
 * 10. Context Integration
 * 11. Edge Cases & Error Handling
 * 
 * @version 1.0.0
 * @coverage Target: 95%+ with comprehensive scenarios
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { 
  DescriptionList, 
  DescriptionItem, 
  DescriptionTerm, 
  DescriptionDetails 
} from "@components/ui/DescriptionList";

// Test utilities and helpers
const createTestData = () => [
  { term: 'Name', details: 'John Doe' },
  { term: 'Email', details: 'john.doe@example.com' },
  { term: 'Status', details: 'Active' },
];

const renderBasicDescriptionList = (props = {}) => {
  const data = createTestData();
  return render(
    <DescriptionList {...props}>
      {data.map((item, index) => (
        <DescriptionItem key={index}>
          <DescriptionTerm>{item.term}</DescriptionTerm>
          <DescriptionDetails>{item.details}</DescriptionDetails>
        </DescriptionItem>
      ))}
    </DescriptionList>
  );
};

// ===== 1. BASIC RENDERING & PROPS =====

describe('DescriptionList Component - Basic Rendering', () => {
  it('renders without errors', () => {
    render(<DescriptionList>Test content</DescriptionList>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    renderBasicDescriptionList();
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DescriptionList className="custom-class">Content</DescriptionList>);
    expect(screen.getByRole('list')).toHaveClass('custom-class');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDListElement>();
    render(<DescriptionList ref={ref}>Content</DescriptionList>);
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
  });

  it('passes through HTML attributes', () => {
    render(<DescriptionList data-testid="dl-element" aria-label="Test description list">Content</DescriptionList>);
    const dl = screen.getByTestId('dl-element');
    expect(dl).toHaveAttribute('aria-label', 'Test description list');
  });

  it('uses semantic HTML elements', () => {
    renderBasicDescriptionList();
    
    // Should use proper semantic HTML
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('list').tagName).toBe('DL');
    
    // Terms should be dt elements
    const terms = screen.getByRole('list').querySelectorAll('dt');
    expect(terms).toHaveLength(3);
    
    // Details should be dd elements
    const details = screen.getByRole('list').querySelectorAll('dd');
    expect(details).toHaveLength(3);
  });
});

describe('DescriptionItem Component - Basic Rendering', () => {
  it('renders without errors', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Test term</DescriptionTerm>
          <DescriptionDetails>Test details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Test term')).toBeInTheDocument();
    expect(screen.getByText('Test details')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DescriptionList>
        <DescriptionItem className="custom-item">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Term').closest('div')).toHaveClass('custom-item');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <DescriptionList>
        <DescriptionItem ref={ref}>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ===== 2. VARIANT SYSTEM TESTING =====

describe('DescriptionList Component - Variants', () => {
  it('applies default variant correctly', () => {
    renderBasicDescriptionList();
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('divide-y', 'divide-slate-200');
  });

  it('applies bordered variant correctly', () => {
    renderBasicDescriptionList({ variant: 'bordered' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('border', 'border-slate-200', 'rounded-md');
  });

  it('applies flush variant correctly', () => {
    renderBasicDescriptionList({ variant: 'flush' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('divide-y', 'divide-slate-200');
  });

  it('applies spaced variant correctly', () => {
    renderBasicDescriptionList({ variant: 'spaced' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('space-y-4');
  });

  it('applies relaxed variant correctly', () => {
    renderBasicDescriptionList({ variant: 'relaxed' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('space-y-6');
  });
});

describe('DescriptionItem Component - Variants', () => {
  it('applies default variant correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('py-4', 'px-4', 'sm:grid', 'sm:grid-cols-3');
  });

  it('applies success variant correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem variant="success">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('bg-green-50', 'border-l-4', 'border-green-500');
  });

  it('applies warning variant correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem variant="warning">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('bg-amber-50', 'border-l-4', 'border-amber-500');
  });

  it('applies error variant correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem variant="error">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('bg-red-50', 'border-l-4', 'border-red-500');
  });

  it('applies info variant correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem variant="info">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('bg-blue-50', 'border-l-4', 'border-blue-500');
  });
});

// ===== 3. LAYOUT & SPACING CONFIGURATION =====

describe('DescriptionList Component - Layout and Spacing', () => {
  it('applies horizontal layout correctly', () => {
    renderBasicDescriptionList({ layout: 'horizontal' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('divide-y', 'divide-slate-200');
  });

  it('applies vertical layout correctly', () => {
    renderBasicDescriptionList({ layout: 'vertical' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('grid', 'grid-cols-1', 'gap-4');
  });

  it('applies two-column layout correctly', () => {
    renderBasicDescriptionList({ layout: 'twoColumn' });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-3');
  });

  it('applies sizes correctly', () => {
    const { rerender } = renderBasicDescriptionList({ size: 'sm' });
    expect(screen.getByRole('list')).toHaveClass('text-sm');

    rerender(
      <DescriptionList size="lg">
        <DescriptionItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByRole('list')).toHaveClass('text-base');
  });

  it('applies background variants correctly', () => {
    const { rerender } = renderBasicDescriptionList({ background: 'subtle' });
    expect(screen.getByRole('list')).toHaveClass('bg-slate-50');

    rerender(
      <DescriptionList background="elevated">
        <DescriptionItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByRole('list')).toHaveClass('bg-white', 'shadow-sm');
  });
});

describe('DescriptionItem Component - Layout and Spacing', () => {
  it('applies compact spacing correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem spacing="compact">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('py-2', 'px-3');
  });

  it('applies spacious spacing correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem spacing="spacious">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Term').closest('div');
    expect(item).toHaveClass('py-6', 'px-6');
  });

  it('applies layout variants correctly', () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem layout="horizontal">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Term').closest('div')).toHaveClass('sm:grid', 'sm:grid-cols-3');

    rerender(
      <DescriptionList>
        <DescriptionItem layout="vertical">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Term').closest('div')).toHaveClass('py-4', 'px-4', 'space-y-1');

    rerender(
      <DescriptionList>
        <DescriptionItem layout="stacked">
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Term').closest('div')).toHaveClass('py-3', 'px-4', 'space-y-2');
  });
});

// ===== 4. INTERACTIVE BEHAVIOR =====

describe('DescriptionList Component - Interactive Behavior', () => {
  it('applies interactive classes correctly', () => {
    renderBasicDescriptionList({ interactive: true });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('cursor-default');
  });

  it('applies hoverable classes correctly', () => {
    renderBasicDescriptionList({ hoverable: true });
    const dl = screen.getByRole('list');
    expect(dl).toHaveClass('hover:bg-slate-50');
  });

  it('passes interactive context to children', () => {
    render(
      <DescriptionList interactive>
        <DescriptionItem>
          <DescriptionTerm>Interactive term</DescriptionTerm>
          <DescriptionDetails>Interactive details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Interactive term').closest('div');
    expect(item).toHaveClass('cursor-pointer', 'hover:bg-slate-50');
  });
});

describe('DescriptionItem Component - Interactive Behavior', () => {
  it('handles click events correctly', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem onClick={handleClick}>
          <DescriptionTerm>Clickable term</DescriptionTerm>
          <DescriptionDetails>Clickable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles onSelect callback correctly', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem onSelect={handleSelect}>
          <DescriptionTerm>Selectable term</DescriptionTerm>
          <DescriptionDetails>Selectable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('applies selected state correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem selected interactive>
          <DescriptionTerm>Selected term</DescriptionTerm>
          <DescriptionDetails>Selected details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-50', 'border-l-4', 'border-primary-500');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('makes interactive items focusable', () => {
    render(
      <DescriptionList>
        <DescriptionItem interactive>
          <DescriptionTerm>Interactive term</DescriptionTerm>
          <DescriptionDetails>Interactive details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const item = screen.getByText('Interactive term').closest('div');
    expect(item).toHaveAttribute('tabindex', '0');
  });
});

// ===== 5. KEYBOARD NAVIGATION & FOCUS =====

describe('DescriptionList Component - Keyboard Navigation', () => {
  it('supports keyboard navigation with interactive items', async () => {
    const user = userEvent.setup();
    
    render(
      <DescriptionList>
        <DescriptionItem interactive>
          <DescriptionTerm>Item 1</DescriptionTerm>
          <DescriptionDetails>Details 1</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem interactive>
          <DescriptionTerm>Item 2</DescriptionTerm>
          <DescriptionDetails>Details 2</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );

    const items = [
      screen.getByText('Item 1').closest('div'),
      screen.getByText('Item 2').closest('div')
    ];
    
    // Items should be focusable
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[1]).toHaveAttribute('tabindex', '0');

    // Test focus navigation
    items[0]!.focus();
    expect(items[0]).toHaveFocus();

    await user.tab();
    expect(items[1]).toHaveFocus();
  });

  it('handles Enter key selection', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem onSelect={handleSelect}>
          <DescriptionTerm>Selectable term</DescriptionTerm>
          <DescriptionDetails>Selectable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('handles Space key selection', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem onSelect={handleSelect}>
          <DescriptionTerm>Selectable term</DescriptionTerm>
          <DescriptionDetails>Selectable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard(' ');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('ignores keyboard events when not interactive', async () => {
    const handleSelect = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Non-interactive term</DescriptionTerm>
          <DescriptionDetails>Non-interactive details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const item = screen.getByText('Non-interactive term').closest('div')!;
    
    // Without interactive prop or onSelect, should not respond to keyboard
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(handleSelect).not.toHaveBeenCalled();
  });
});

// ===== 6. ACCESSIBILITY COMPLIANCE =====

describe('DescriptionList Component - Accessibility', () => {
  it('uses semantic HTML structure', () => {
    renderBasicDescriptionList();
    
    const dl = screen.getByRole('list');
    expect(dl.tagName).toBe('DL');
    
    const terms = dl.querySelectorAll('dt');
    const details = dl.querySelectorAll('dd');
    
    expect(terms).toHaveLength(3);
    expect(details).toHaveLength(3);
    
    // Check proper nesting
    terms.forEach((term, index) => {
      expect(term.textContent).toBe(createTestData()[index].term);
    });
    
    details.forEach((detail, index) => {
      expect(detail.textContent).toBe(createTestData()[index].details);
    });
  });

  it('supports aria-label', () => {
    renderBasicDescriptionList({ 'aria-label': 'User information' });
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'User information');
  });

  it('announces selection state correctly', () => {
    render(
      <DescriptionList>
        <DescriptionItem selected interactive>
          <DescriptionTerm>Selected term</DescriptionTerm>
          <DescriptionDetails>Selected details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('provides proper focus management', () => {
    render(
      <DescriptionList>
        <DescriptionItem interactive>
          <DescriptionTerm>Focusable term</DescriptionTerm>
          <DescriptionDetails>Focusable details</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Non-focusable term</DescriptionTerm>
          <DescriptionDetails>Non-focusable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).toHaveAttribute('role', 'button');
    
    // Non-interactive item should not be a button
    const nonInteractive = screen.getByText('Non-focusable term').closest('div');
    expect(nonInteractive).not.toHaveAttribute('role');
    expect(nonInteractive).not.toHaveAttribute('tabindex');
  });
});

// ===== 7. LOADING & EMPTY STATES =====

describe('DescriptionList Component - Loading and Empty States', () => {
  it('displays loading skeleton when loading', () => {
    render(<DescriptionList loading>Content</DescriptionList>);
    
    // Should show skeleton instead of content
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    
    // Should have skeleton elements
    const dl = screen.getByRole('list');
    const skeletons = dl.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no children', () => {
    render(<DescriptionList emptyContent="No data available">{[]}</DescriptionList>);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
    
    // Should have empty state icon - but no longer inside a dl
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('does not show empty state when children exist', () => {
    render(
      <DescriptionList emptyContent="No data available">
        <DescriptionItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    expect(screen.getByText('Term')).toBeInTheDocument();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('shows content when loading is false', () => {
    const { rerender } = render(<DescriptionList loading>Content</DescriptionList>);
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    
    rerender(<DescriptionList loading={false}>Content</DescriptionList>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

// ===== 8. COMPOUND COMPONENTS =====

describe('DescriptionList Component - Compound Components', () => {
  it('supports DescriptionList.Item syntax', () => {
    render(
      <DescriptionList>
        <DescriptionList.Item>
          <DescriptionList.Term>Term 1</DescriptionList.Term>
          <DescriptionList.Details>Details 1</DescriptionList.Details>
        </DescriptionList.Item>
        <DescriptionList.Item>
          <DescriptionList.Term>Term 2</DescriptionList.Term>
          <DescriptionList.Details>Details 2</DescriptionList.Details>
        </DescriptionList.Item>
      </DescriptionList>
    );
    
    expect(screen.getByText('Term 1')).toBeInTheDocument();
    expect(screen.getByText('Details 1')).toBeInTheDocument();
    expect(screen.getByText('Term 2')).toBeInTheDocument();
    expect(screen.getByText('Details 2')).toBeInTheDocument();
  });

  it('supports DescriptionItem compound syntax', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionItem.Term>Compound Term</DescriptionItem.Term>
          <DescriptionItem.Details>Compound Details</DescriptionItem.Details>
        </DescriptionItem>
      </DescriptionList>
    );
    
    expect(screen.getByText('Compound Term')).toBeInTheDocument();
    expect(screen.getByText('Compound Details')).toBeInTheDocument();
  });
});

describe('DescriptionTerm Component', () => {
  it('renders correctly with required indicator', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm required>Required Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const term = screen.getByText('Required Term');
    expect(term).toBeInTheDocument();
    expect(term).toHaveClass('after:content-["*"]', 'after:text-red-500');
  });

  it('renders correctly with optional indicator', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm optional>Optional Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const term = screen.getByText('Optional Term');
    expect(term).toBeInTheDocument();
    expect(term).toHaveClass('after:content-["(optional)"]', 'after:text-slate-500');
  });

  it('applies alignment variants correctly', () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm align="top">Top Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Top Term')).toHaveClass('sm:self-start');

    rerender(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm align="center">Center Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Center Term')).toHaveClass('sm:self-center');
  });

  it('applies color variants correctly', () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm variant="muted">Muted Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Muted Term')).toHaveClass('text-slate-600');

    rerender(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm variant="emphasized">Emphasized Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Emphasized Term')).toHaveClass('font-semibold');
  });
});

describe('DescriptionDetails Component', () => {
  it('renders different content types correctly', () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Code</DescriptionTerm>
          <DescriptionDetails type="code">const value = 'test';</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText("const value = 'test';")).toHaveClass('font-mono', 'bg-slate-100');

    rerender(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Badge</DescriptionTerm>
          <DescriptionDetails type="badge">Active</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Active')).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full');
  });

  it('handles status indicators correctly', () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails status="success">Completed</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const details = screen.getByText('Completed');
    expect(details).toHaveClass('text-green-600');
    
    // Should have success icon
    const icon = details.parentElement?.querySelector('svg');
    expect(icon).toBeInTheDocument();

    rerender(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails status="error">Failed</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('Failed')).toHaveClass('text-red-600');
  });

  it('handles copyable content correctly', async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>API Key</DescriptionTerm>
          <DescriptionDetails copyable onCopy={handleCopy}>abc123def456</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const details = screen.getByText('abc123def456');
    expect(details).toHaveClass('cursor-pointer', 'hover:bg-slate-100');
    
    await user.click(details);
    expect(handleCopy).toHaveBeenCalledWith('abc123def456');
  });

  it('applies text formatting correctly', () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Long Text</DescriptionTerm>
          <DescriptionDetails truncated>This is a very long text that should be truncated</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('This is a very long text that should be truncated')).toHaveClass('truncate');

    rerender(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Expandable</DescriptionTerm>
          <DescriptionDetails expandable>This is expandable content</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByText('This is expandable content')).toHaveClass('line-clamp-3');
  });
});

// ===== 9. CONTEXT INTEGRATION =====

describe('DescriptionList Component - Context Integration', () => {
  it('provides context to child components', () => {
    render(
      <DescriptionList size="lg" interactive hoverable>
        <DescriptionItem data-testid="context-item">
          <DescriptionTerm>Context Term</DescriptionTerm>
          <DescriptionDetails>Context Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const item = screen.getByTestId('context-item');
    // Should inherit interactive and hoverable from context
    expect(item).toHaveClass('cursor-pointer', 'hover:bg-slate-50');
  });

  it('allows item-level overrides of context', () => {
    render(
      <DescriptionList interactive>
        <DescriptionItem interactive={false} data-testid="non-interactive">
          <DescriptionTerm>Non-interactive term</DescriptionTerm>
          <DescriptionDetails>Non-interactive details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const item = screen.getByTestId('non-interactive');
    // Should not be interactive despite List context
    expect(item).not.toHaveAttribute('tabindex');
  });

  it('handles layout context correctly', () => {
    render(
      <DescriptionList layout="twoColumn">
        <DescriptionItem data-testid="context-layout">
          <DescriptionTerm>Layout Term</DescriptionTerm>
          <DescriptionDetails>Layout Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const item = screen.getByTestId('context-layout');
    // Should use horizontal layout when twoColumn is specified
    expect(item).toHaveClass('sm:grid', 'sm:grid-cols-3');
  });
});

// ===== 10. EDGE CASES & ERROR HANDLING =====

describe('DescriptionList Component - Edge Cases', () => {
  it('handles empty children gracefully', () => {
    render(<DescriptionList>{null}</DescriptionList>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('handles undefined props gracefully', () => {
    render(
      <DescriptionList variant={undefined as any} size={undefined as any}>
        <DescriptionItem>
          <DescriptionTerm>Term</DescriptionTerm>
          <DescriptionDetails>Details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('handles complex nested structures', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Complex Term</DescriptionTerm>
          <DescriptionDetails>
            <div>
              <span>Nested content</span>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    expect(screen.getByText('Complex Term')).toBeInTheDocument();
    expect(screen.getByText('Nested content')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('handles rapid state changes', async () => {
    const { rerender } = render(<DescriptionList loading>Content</DescriptionList>);
    
    // Rapidly toggle loading state
    rerender(<DescriptionList loading={false}>Content</DescriptionList>);
    rerender(<DescriptionList loading>Content</DescriptionList>);
    rerender(<DescriptionList loading={false}>Content</DescriptionList>);
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('maintains focus after state changes', async () => {
    const { rerender } = render(
      <DescriptionList>
        <DescriptionItem interactive data-testid="focus-item">
          <DescriptionTerm>Focusable term</DescriptionTerm>
          <DescriptionDetails>Focusable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    const item = screen.getByTestId('focus-item');
    item.focus();
    expect(item).toHaveFocus();
    
    // Re-render with different props
    rerender(
      <DescriptionList hoverable>
        <DescriptionItem interactive data-testid="focus-item">
          <DescriptionTerm>Focusable term</DescriptionTerm>
          <DescriptionDetails>Focusable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    // Focus should be maintained
    expect(screen.getByTestId('focus-item')).toHaveFocus();
  });

  it('handles event propagation correctly', async () => {
    const user = userEvent.setup();
    const itemClick = vi.fn();
    
    render(
      <DescriptionList>
        <DescriptionItem onClick={itemClick}>
          <DescriptionTerm>Clickable term</DescriptionTerm>
          <DescriptionDetails>Clickable details</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    await user.click(screen.getByRole('button'));
    
    // Item handler should be called
    expect(itemClick).toHaveBeenCalledTimes(1);
  });

  it('handles missing content gracefully', () => {
    render(
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>{''}</DescriptionTerm>
          <DescriptionDetails>{''}</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    );
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    const terms = screen.getByRole('list').querySelectorAll('dt');
    const details = screen.getByRole('list').querySelectorAll('dd');
    
    expect(terms).toHaveLength(1);
    expect(details).toHaveLength(1);
  });
});
