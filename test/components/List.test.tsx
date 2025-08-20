/**
 * List Component Test Suite - Enterprise Grade Testing
 * 
 * Comprehensive test coverage for List/ListItem components including:
 * - Rendering and basic functionality
 * - All variants and configurations
 * - Interactive behaviors and keyboard navigation
 * - Accessibility compliance (ARIA, focus management)
 * - Loading and empty states
 * - Compound component architecture
 * - Edge cases and error boundaries
 * 
 * Test Categories:
 * 1. Basic Rendering & Props
 * 2. Variant System Testing
 * 3. Size & Spacing Configuration
 * 4. Interactive Behavior
 * 5. Keyboard Navigation & Focus
 * 6. Accessibility Compliance
 * 7. Loading & Empty States
 * 8. Compound Components
 * 9. Context Integration
 * 10. Edge Cases & Error Handling
 * 
 * @version 1.0.0
 * @coverage Target: 95%+ with comprehensive scenarios
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { List, ListItem, ListItemContent, ListItemIcon, ListItemAction } from '@components/ui/List';

// Test utilities and helpers
const createTestIcon = () => (
  <svg data-testid="test-icon" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);

const createTestAction = (onClick = vi.fn()) => (
  <button data-testid="test-action" onClick={onClick}>
    Action
  </button>
);

// ===== 1. BASIC RENDERING & PROPS =====

describe('List Component - Basic Rendering', () => {
  it('renders without errors', () => {
    render(<List>Test content</List>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <List>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
      </List>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<List className="custom-class">Content</List>);
    expect(screen.getByRole('list')).toHaveClass('custom-class');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<List ref={ref}>Content</List>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through HTML attributes', () => {
    render(<List data-testid="list-element" aria-label="Test list">Content</List>);
    const list = screen.getByTestId('list-element');
    expect(list).toHaveAttribute('aria-label', 'Test list');
  });
});

describe('ListItem Component - Basic Rendering', () => {
  it('renders without errors', () => {
    render(<ListItem>Test item</ListItem>);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<ListItem>Item content</ListItem>);
    expect(screen.getByText('Item content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ListItem className="custom-item">Content</ListItem>);
    expect(screen.getByRole('listitem')).toHaveClass('custom-item');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ListItem ref={ref}>Content</ListItem>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ===== 2. VARIANT SYSTEM TESTING =====

describe('List Component - Variants', () => {
  it('applies default variant correctly', () => {
    render(<List>Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('divide-y', 'divide-slate-200');
  });

  it('applies bordered variant correctly', () => {
    render(<List variant="bordered">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('border', 'border-slate-200', 'rounded-md');
  });

  it('applies flush variant correctly', () => {
    render(<List variant="flush">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('divide-y', 'divide-slate-200');
  });

  it('applies spaced variant correctly', () => {
    render(<List variant="spaced">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('space-y-2');
  });

  it('applies relaxed variant correctly', () => {
    render(<List variant="relaxed">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('space-y-4');
  });
});

describe('ListItem Component - Variants', () => {
  it('applies default variant correctly', () => {
    render(<ListItem>Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('flex', 'items-start', 'px-4', 'py-3');
  });

  it('applies success variant correctly', () => {
    render(<ListItem variant="success">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('bg-green-50', 'border-l-4', 'border-green-500');
  });

  it('applies warning variant correctly', () => {
    render(<ListItem variant="warning">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('bg-amber-50', 'border-l-4', 'border-amber-500');
  });

  it('applies error variant correctly', () => {
    render(<ListItem variant="error">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('bg-red-50', 'border-l-4', 'border-red-500');
  });

  it('applies info variant correctly', () => {
    render(<ListItem variant="info">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('bg-blue-50', 'border-l-4', 'border-blue-500');
  });
});

// ===== 3. SIZE & SPACING CONFIGURATION =====

describe('List Component - Sizes and Spacing', () => {
  it('applies small size correctly', () => {
    render(<List size="sm">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('text-sm');
  });

  it('applies medium size correctly', () => {
    render(<List size="md">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('text-sm');
  });

  it('applies large size correctly', () => {
    render(<List size="lg">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('text-base');
  });

  it('applies extra large size correctly', () => {
    render(<List size="xl">Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('text-lg');
  });

  it('applies background variants correctly', () => {
    const { rerender } = render(<List background="subtle">Content</List>);
    expect(screen.getByRole('list')).toHaveClass('bg-slate-50');

    rerender(<List background="elevated">Content</List>);
    expect(screen.getByRole('list')).toHaveClass('bg-white', 'shadow-sm');

    rerender(<List background="none">Content</List>);
    const list = screen.getByRole('list');
    expect(list).not.toHaveClass('bg-slate-50', 'bg-white');
  });
});

describe('ListItem Component - Layout and Spacing', () => {
  it('applies compact spacing correctly', () => {
    render(<ListItem spacing="compact">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('px-3', 'py-2');
  });

  it('applies comfortable spacing correctly', () => {
    render(<ListItem spacing="comfortable">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('px-4', 'py-4');
  });

  it('applies spacious spacing correctly', () => {
    render(<ListItem spacing="spacious">Content</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('px-6', 'py-5');
  });

  it('applies layout variants correctly', () => {
    const { rerender } = render(<ListItem layout="singleLine">Content</ListItem>);
    expect(screen.getByRole('listitem')).toHaveClass('items-center', 'min-h-[2.5rem]');

    rerender(<ListItem layout="multiLine">Content</ListItem>);
    expect(screen.getByRole('listitem')).toHaveClass('items-start', 'min-h-[3rem]');

    rerender(<ListItem layout="withIcon">Content</ListItem>);
    expect(screen.getByRole('listitem')).toHaveClass('items-center', 'space-x-3');

    rerender(<ListItem layout="withAvatar">Content</ListItem>);
    expect(screen.getByRole('listitem')).toHaveClass('items-center', 'space-x-4');

    rerender(<ListItem layout="withAction">Content</ListItem>);
    expect(screen.getByRole('listitem')).toHaveClass('items-center', 'justify-between');
  });
});

// ===== 4. INTERACTIVE BEHAVIOR =====

describe('List Component - Interactive Behavior', () => {
  it('applies interactive classes correctly', () => {
    render(<List interactive>Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('cursor-default');
  });

  it('applies hoverable classes correctly', () => {
    render(<List hoverable>Content</List>);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('hover:bg-slate-50');
  });

  it('passes interactive context to children', () => {
    render(
      <List interactive>
        <ListItem>Interactive item</ListItem>
      </List>
    );
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('cursor-pointer', 'hover:bg-slate-50');
  });
});

describe('ListItem Component - Interactive Behavior', () => {
  it('handles click events correctly', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<ListItem onClick={handleClick}>Clickable item</ListItem>);
    
    await user.click(screen.getByRole('listitem'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles onSelect callback correctly', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(<ListItem onSelect={handleSelect}>Selectable item</ListItem>);
    
    await user.click(screen.getByRole('listitem'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('applies selected state correctly', () => {
    render(<ListItem selected>Selected item</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('bg-primary-50', 'border-l-4', 'border-primary-500');
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('applies disabled state correctly', () => {
    render(<ListItem disabled>Disabled item</ListItem>);
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    expect(item).toHaveAttribute('aria-disabled', 'true');
  });

  it('prevents interaction when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<ListItem disabled onClick={handleClick}>Disabled item</ListItem>);
    
    // The click should not trigger due to pointer-events-none
    await user.click(screen.getByRole('listitem'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ===== 5. KEYBOARD NAVIGATION & FOCUS =====

describe('List Component - Keyboard Navigation', () => {
  it('supports keyboard navigation with interactive items', async () => {
    const user = userEvent.setup();
    
    render(
      <List>
        <ListItem interactive>Item 1</ListItem>
        <ListItem interactive>Item 2</ListItem>
        <ListItem interactive>Item 3</ListItem>
      </List>
    );

    const items = screen.getAllByRole('listitem');
    
    // Items should be focusable
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[1]).toHaveAttribute('tabindex', '0');
    expect(items[2]).toHaveAttribute('tabindex', '0');

    // Test focus navigation
    items[0].focus();
    expect(items[0]).toHaveFocus();

    await user.tab();
    expect(items[1]).toHaveFocus();
  });

  it('handles Enter key selection', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(<ListItem onSelect={handleSelect}>Selectable item</ListItem>);
    
    const item = screen.getByRole('listitem');
    item.focus();
    
    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('handles Space key selection', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    
    render(<ListItem onSelect={handleSelect}>Selectable item</ListItem>);
    
    const item = screen.getByRole('listitem');
    item.focus();
    
    await user.keyboard(' ');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('ignores keyboard events when disabled', async () => {
    const handleSelect = vi.fn();
    
    render(<ListItem disabled onSelect={handleSelect}>Disabled item</ListItem>);
    
    const item = screen.getByRole('listitem');
    // Disabled items should not be focusable
    expect(item).not.toHaveAttribute('tabindex');
    
    // Even if focused programmatically, should not respond to keyboard
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(handleSelect).not.toHaveBeenCalled();
  });
});

// ===== 6. ACCESSIBILITY COMPLIANCE =====

describe('List Component - Accessibility', () => {
  it('has correct ARIA role', () => {
    render(<List>Content</List>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('supports aria-label', () => {
    render(<List aria-label="Navigation menu">Content</List>);
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Navigation menu');
  });

  it('maintains semantic structure', () => {
    render(
      <List aria-label="User list">
        <ListItem>User 1</ListItem>
        <ListItem>User 2</ListItem>
      </List>
    );

    const list = screen.getByRole('list');
    const items = screen.getAllByRole('listitem');
    
    expect(list).toHaveAttribute('aria-label', 'User list');
    expect(items).toHaveLength(2);
  });

  it('supports custom ARIA roles for list items', () => {
    render(<ListItem role="option">Option item</ListItem>);
    expect(screen.getByRole('option')).toBeInTheDocument();
  });

  it('provides proper focus management', () => {
    render(
      <List>
        <ListItem interactive>Focusable item 1</ListItem>
        <ListItem disabled>Disabled item</ListItem>
        <ListItem interactive>Focusable item 2</ListItem>
      </List>
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[1]).not.toHaveAttribute('tabindex'); // Disabled
    expect(items[2]).toHaveAttribute('tabindex', '0');
  });

  it('announces selection state correctly', () => {
    render(<ListItem selected>Selected item</ListItem>);
    expect(screen.getByRole('listitem')).toHaveAttribute('aria-selected', 'true');
  });

  it('announces disabled state correctly', () => {
    render(<ListItem disabled>Disabled item</ListItem>);
    expect(screen.getByRole('listitem')).toHaveAttribute('aria-disabled', 'true');
  });
});

// ===== 7. LOADING & EMPTY STATES =====

describe('List Component - Loading and Empty States', () => {
  it('displays loading skeleton when loading', () => {
    render(<List loading>Content</List>);
    
    // Should show skeleton instead of content
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    
    // Should have skeleton elements
    const skeletons = screen.getByRole('list').querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no children', () => {
    render(<List emptyContent="No items found">{[]}</List>);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    
    // Should have empty state icon
    const icon = screen.getByRole('list').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('does not show empty state when children exist', () => {
    render(
      <List emptyContent="No items found">
        <ListItem>Item 1</ListItem>
      </List>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('No items found')).not.toBeInTheDocument();
  });

  it('shows content when loading is false', () => {
    const { rerender } = render(<List loading>Content</List>);
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    
    rerender(<List loading={false}>Content</List>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

// ===== 8. COMPOUND COMPONENTS =====

describe('List Component - Compound Components', () => {
  it('supports List.Item syntax', () => {
    render(
      <List>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('supports nested compound components', () => {
    render(
      <List>
        <List.Item>
          <List.Icon>{createTestIcon()}</List.Icon>
          <List.Content title="Item title" subtitle="Item subtitle" />
          <List.Action>{createTestAction()}</List.Action>
        </List.Item>
      </List>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Item title')).toBeInTheDocument();
    expect(screen.getByText('Item subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('test-action')).toBeInTheDocument();
  });

  it('supports ListItem compound syntax', () => {
    render(
      <ListItem>
        <ListItem.Icon>{createTestIcon()}</ListItem.Icon>
        <ListItem.Content title="Title" description="Description" />
        <ListItem.Action>{createTestAction()}</ListItem.Action>
      </ListItem>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByTestId('test-action')).toBeInTheDocument();
  });
});

describe('ListItem.Content Component', () => {
  it('renders title correctly', () => {
    render(<ListItemContent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toHaveClass('font-medium', 'text-slate-900', 'truncate');
  });

  it('renders subtitle correctly', () => {
    render(<ListItemContent subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toHaveClass('text-sm', 'text-slate-600', 'truncate');
  });

  it('renders description correctly', () => {
    render(<ListItemContent description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toHaveClass('text-sm', 'text-slate-600', 'leading-relaxed');
  });

  it('renders meta information correctly', () => {
    render(<ListItemContent meta="Test Meta" />);
    expect(screen.getByText('Test Meta')).toBeInTheDocument();
    expect(screen.getByText('Test Meta')).toHaveClass('text-xs', 'text-slate-500');
  });

  it('renders all content parts together', () => {
    render(
      <ListItemContent
        title="Main Title"
        subtitle="Subtitle Text"
        description="Detailed description"
        meta="Meta info"
      />
    );
    
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle Text')).toBeInTheDocument();
    expect(screen.getByText('Detailed description')).toBeInTheDocument();
    expect(screen.getByText('Meta info')).toBeInTheDocument();
  });

  it('supports custom children', () => {
    render(
      <ListItemContent>
        <div data-testid="custom-content">Custom content</div>
      </ListItemContent>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });
});

describe('ListItem.Icon Component', () => {
  it('renders icon with default variant', () => {
    render(<ListItemIcon>{createTestIcon()}</ListItemIcon>);
    const icon = screen.getByTestId('test-icon');
    expect(icon.parentElement).toHaveClass('text-slate-400');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<ListItemIcon variant="primary">{createTestIcon()}</ListItemIcon>);
    expect(screen.getByTestId('test-icon').parentElement).toHaveClass('text-primary-500');

    rerender(<ListItemIcon variant="success">{createTestIcon()}</ListItemIcon>);
    expect(screen.getByTestId('test-icon').parentElement).toHaveClass('text-green-500');

    rerender(<ListItemIcon variant="warning">{createTestIcon()}</ListItemIcon>);
    expect(screen.getByTestId('test-icon').parentElement).toHaveClass('text-amber-500');

    rerender(<ListItemIcon variant="error">{createTestIcon()}</ListItemIcon>);
    expect(screen.getByTestId('test-icon').parentElement).toHaveClass('text-red-500');

    rerender(<ListItemIcon variant="info">{createTestIcon()}</ListItemIcon>);
    expect(screen.getByTestId('test-icon').parentElement).toHaveClass('text-blue-500');
  });
});

describe('ListItem.Action Component', () => {
  it('renders action content correctly', () => {
    render(<ListItemAction>{createTestAction()}</ListItemAction>);
    expect(screen.getByTestId('test-action')).toBeInTheDocument();
  });

  it('applies correct positioning classes', () => {
    render(<ListItemAction data-testid="action-wrapper">{createTestAction()}</ListItemAction>);
    expect(screen.getByTestId('action-wrapper')).toHaveClass('flex-shrink-0', 'ml-auto');
  });

  it('handles complex action content', () => {
    render(
      <ListItemAction>
        <div className="flex space-x-2">
          <button data-testid="action-1">Edit</button>
          <button data-testid="action-2">Delete</button>
        </div>
      </ListItemAction>
    );
    
    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-2')).toBeInTheDocument();
  });
});

// ===== 9. CONTEXT INTEGRATION =====

describe('List Component - Context Integration', () => {
  it('provides context to child components', () => {
    render(
      <List size="lg" interactive hoverable>
        <ListItem data-testid="context-item">Test item</ListItem>
      </List>
    );
    
    const item = screen.getByTestId('context-item');
    // Should inherit interactive and hoverable from context
    expect(item).toHaveClass('cursor-pointer', 'hover:bg-slate-50');
  });

  it('allows item-level overrides of context', () => {
    render(
      <List interactive>
        <ListItem interactive={false} data-testid="non-interactive">Non-interactive item</ListItem>
      </List>
    );
    
    const item = screen.getByTestId('non-interactive');
    // Should not be interactive despite List context
    expect(item).not.toHaveAttribute('tabindex');
  });
});

// ===== 10. EDGE CASES & ERROR HANDLING =====

describe('List Component - Edge Cases', () => {
  it('handles empty children gracefully', () => {
    render(<List>{null}</List>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('handles undefined props gracefully', () => {
    render(
      <List variant={undefined as any} size={undefined as any}>
        Content
      </List>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('handles complex nested structures', () => {
    render(
      <List>
        <ListItem>
          <div>
            <ListItemContent title="Complex Item">
              <div>
                <span>Nested content</span>
                <ListItemAction>
                  <button>Nested action</button>
                </ListItemAction>
              </div>
            </ListItemContent>
          </div>
        </ListItem>
      </List>
    );
    
    expect(screen.getByText('Complex Item')).toBeInTheDocument();
    expect(screen.getByText('Nested content')).toBeInTheDocument();
    expect(screen.getByText('Nested action')).toBeInTheDocument();
  });

  it('handles rapid state changes', async () => {
    const { rerender } = render(<List loading>Content</List>);
    
    // Rapidly toggle loading state
    rerender(<List loading={false}>Content</List>);
    rerender(<List loading>Content</List>);
    rerender(<List loading={false}>Content</List>);
    
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('maintains focus after state changes', async () => {
    const { rerender } = render(
      <List>
        <ListItem interactive data-testid="focus-item">Focusable item</ListItem>
      </List>
    );
    
    const item = screen.getByTestId('focus-item');
    item.focus();
    expect(item).toHaveFocus();
    
    // Re-render with different props
    rerender(
      <List hoverable>
        <ListItem interactive data-testid="focus-item">Focusable item</ListItem>
      </List>
    );
    
    // Focus should be maintained
    expect(screen.getByTestId('focus-item')).toHaveFocus();
  });

  it('handles event propagation correctly', async () => {
    const user = userEvent.setup();
    const listClick = vi.fn();
    const itemClick = vi.fn();
    
    render(
      <List onClick={listClick}>
        <ListItem onClick={itemClick}>Clickable item</ListItem>
      </List>
    );
    
    await user.click(screen.getByRole('listitem'));
    
    // Both handlers should be called due to event bubbling
    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(listClick).toHaveBeenCalledTimes(1);
  });
});
