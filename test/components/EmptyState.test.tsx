/**
 * @fileoverview EmptyState Component Tests - Comprehensive test suite
 *
 * Tests cover:
 * - All variants and sizes
 * - Sir Steve's onboarding patterns
 * - Accessibility compliance
 * - Action buttons and suggestion chips
 * - Custom content and icons
 * - TypeScript strict mode compliance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState, {
  EmptyStateNoData,
  EmptyStateNoResults,
  EmptyStateError,
  EmptyStateSearch,
  EmptyStateNetwork,
  EmptyStateOnboarding,
  type EmptyStateAction,
  type EmptyStateSuggestion,
} from '../../src/components/ui/EmptyState';

// ===== TEST SETUP =====

const mockCreateTask = vi.fn();
const mockOpenQuickAdd = vi.fn();
const mockOpenImport = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

// ===== BASIC RENDERING TESTS =====

describe('EmptyState - Basic Rendering', () => {
  it('renders with default generic variant', () => {
    render(<EmptyState />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Make it yours'
    );
    expect(
      screen.getByText('Plan today, track progress, and get it done.')
    ).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <EmptyState title='Custom Title' description='Custom description text' />
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Custom Title'
    );
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<EmptyState className='custom-class' />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<EmptyState ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('renders with test ID', () => {
    render(<EmptyState data-testid='empty-state-test' />);

    expect(screen.getByTestId('empty-state-test')).toBeInTheDocument();
  });
});

// ===== VARIANT TESTS =====

describe('EmptyState - Variants', () => {
  it('renders no-data variant with proper content', () => {
    render(<EmptyState variant='no-data' />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Create your first task'
    );
    expect(
      screen.getByText('Capture what matters and start checking things off.')
    ).toBeInTheDocument();
  });

  it('renders no-results variant with proper content', () => {
    render(<EmptyState variant='no-results' />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'No results found'
    );
    expect(
      screen.getByText('Try adjusting your search criteria or filters.')
    ).toBeInTheDocument();
  });

  it('renders error variant with proper content', () => {
    render(<EmptyState variant='error' />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Something went wrong'
    );
    expect(
      screen.getByText('An error occurred while loading the data.')
    ).toBeInTheDocument();
  });

  it('renders search variant with proper content', () => {
    render(<EmptyState variant='search' />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Start your search'
    );
    expect(
      screen.getByText('Enter a search term to find what you are looking for.')
    ).toBeInTheDocument();
  });

  it('renders network variant with proper content', () => {
    render(<EmptyState variant='network' />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Connection problem'
    );
    expect(
      screen.getByText('Check your internet connection and try again.')
    ).toBeInTheDocument();
  });

  it('renders onboarding variant with proper content', () => {
    render(<EmptyState variant='onboarding' />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Create your first task'
    );
    expect(
      screen.getByText('Capture what matters and start checking things off.')
    ).toBeInTheDocument();
  });
});

// ===== SIZE TESTS =====

describe('EmptyState - Sizes', () => {
  it('renders small size with appropriate spacing', () => {
    const { container } = render(<EmptyState size='small' />);

    expect(container.firstChild).toHaveClass('py-8', 'px-4', 'space-y-2');
  });

  it('renders medium size (default) with appropriate spacing', () => {
    const { container } = render(<EmptyState size='medium' />);

    expect(container.firstChild).toHaveClass('py-12', 'px-6', 'space-y-4');
  });

  it('renders large size with appropriate spacing', () => {
    const { container } = render(<EmptyState size='large' />);

    expect(container.firstChild).toHaveClass('py-16', 'px-8', 'space-y-6');
  });
});

// ===== ICON TESTS =====

describe('EmptyState - Icons', () => {
  it('renders default icon for variant', () => {
    render(<EmptyState variant='no-data' />);

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders custom icon when provided', () => {
    const CustomIcon = () => <span data-testid='custom-icon'>Custom</span>;

    render(<EmptyState variant='no-data' icon={{ element: <CustomIcon /> }} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('hides icon when hidden prop is true', () => {
    render(<EmptyState variant='no-data' icon={{ hidden: true }} />);

    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });
});

// ===== ACTION TESTS =====

describe('EmptyState - Actions', () => {
  it('renders action buttons', () => {
    const actions: EmptyStateAction[] = [
      {
        label: 'Primary Action',
        onClick: mockOpenQuickAdd,
        variant: 'primary',
      },
      {
        label: 'Secondary Action',
        onClick: mockOpenImport,
        variant: 'secondary',
      },
    ];

    render(<EmptyState actions={actions} />);

    expect(
      screen.getByRole('button', { name: 'Primary Action' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Secondary Action' })
    ).toBeInTheDocument();
  });

  it('handles action button clicks', async () => {
    const user = userEvent.setup();
    const actions: EmptyStateAction[] = [
      { label: 'Click Me', onClick: mockOpenQuickAdd, variant: 'primary' },
    ];

    render(<EmptyState actions={actions} />);

    await user.click(screen.getByRole('button', { name: 'Click Me' }));

    expect(mockOpenQuickAdd).toHaveBeenCalledTimes(1);
  });

  it('renders disabled action buttons', () => {
    const actions: EmptyStateAction[] = [
      { label: 'Disabled Action', onClick: mockOpenQuickAdd, disabled: true },
    ];

    render(<EmptyState actions={actions} />);

    const button = screen.getByRole('button', { name: 'Disabled Action' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders loading action buttons', () => {
    const actions: EmptyStateAction[] = [
      { label: 'Loading Action', onClick: mockOpenQuickAdd, loading: true },
    ];

    render(<EmptyState actions={actions} />);

    const button = screen.getByRole('button', { name: 'Loading Action' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-state', 'pending');

    // Check for loading spinner
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });
});

// ===== SUGGESTION TESTS (Sir Steve Patterns) =====

describe('EmptyState - Suggestions (Sir Steve Patterns)', () => {
  it('renders suggestion chips', () => {
    const suggestions: EmptyStateSuggestion[] = [
      {
        text: 'Follow up with Alex',
        onClick: () => mockCreateTask('Follow up with Alex'),
      },
      { text: 'Draft Q3 plan', onClick: () => mockCreateTask('Draft Q3 plan') },
      { text: 'Pay invoices', onClick: () => mockCreateTask('Pay invoices') },
    ];

    render(<EmptyState suggestions={suggestions} />);

    expect(
      screen.getByRole('button', { name: 'Follow up with Alex' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Draft Q3 plan' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pay invoices' })
    ).toBeInTheDocument();
  });

  it('handles suggestion chip clicks', async () => {
    const user = userEvent.setup();
    const suggestions: EmptyStateSuggestion[] = [
      {
        text: 'Follow up with Alex',
        onClick: () => mockCreateTask('Follow up with Alex'),
      },
    ];

    render(<EmptyState suggestions={suggestions} />);

    await user.click(
      screen.getByRole('button', { name: 'Follow up with Alex' })
    );

    expect(mockCreateTask).toHaveBeenCalledWith('Follow up with Alex');
  });

  it('renders disabled suggestion chips', () => {
    const suggestions: EmptyStateSuggestion[] = [
      { text: 'Disabled Suggestion', onClick: mockCreateTask, disabled: true },
    ];

    render(<EmptyState suggestions={suggestions} />);

    const chip = screen.getByRole('button', { name: 'Disabled Suggestion' });
    expect(chip).toBeDisabled();
  });

  it('renders suggestions container with proper ARIA label', () => {
    const suggestions: EmptyStateSuggestion[] = [
      { text: 'Test Suggestion', onClick: mockCreateTask },
    ];

    render(<EmptyState suggestions={suggestions} />);

    expect(screen.getByLabelText('Suggestions')).toBeInTheDocument();
  });
});

// ===== CUSTOM CONTENT TESTS =====

describe('EmptyState - Custom Content', () => {
  it('renders custom children instead of default layout', () => {
    render(
      <EmptyState>
        <div data-testid='custom-content'>Custom Empty State Content</div>
      </EmptyState>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('maintains container styling with custom children', () => {
    const { container } = render(
      <EmptyState size='large'>
        <div>Custom Content</div>
      </EmptyState>
    );

    expect(container.firstChild).toHaveClass('py-16', 'px-8', 'space-y-6');
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('EmptyState - Accessibility', () => {
  it('has proper heading structure', () => {
    render(<EmptyState title='Test Title' />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Title');
    expect(heading).toHaveAttribute('id', 'empty-state-title');
  });

  it('connects container to heading with aria-labelledby', () => {
    const { container } = render(<EmptyState title='Test Title' />);

    expect(container.firstChild).toHaveAttribute(
      'aria-labelledby',
      'empty-state-title'
    );
  });

  it('uses custom aria-label when provided', () => {
    const { container } = render(
      <EmptyState aria-label='Custom accessibility label'>
        <div>Custom content</div>
      </EmptyState>
    );

    expect(container.firstChild).toHaveAttribute(
      'aria-label',
      'Custom accessibility label'
    );
  });

  it('has keyboard navigation for action buttons', async () => {
    const user = userEvent.setup();
    const actions: EmptyStateAction[] = [
      { label: 'First Action', onClick: mockOpenQuickAdd },
      { label: 'Second Action', onClick: mockOpenImport },
    ];

    render(<EmptyState actions={actions} />);

    const firstButton = screen.getByRole('button', { name: 'First Action' });
    const secondButton = screen.getByRole('button', { name: 'Second Action' });

    // Tab navigation
    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(secondButton).toHaveFocus();

    // Enter activation
    await user.keyboard('{Enter}');
    expect(mockOpenImport).toHaveBeenCalledTimes(1);
  });

  it('has keyboard navigation for suggestion chips', async () => {
    const user = userEvent.setup();
    const suggestions: EmptyStateSuggestion[] = [
      { text: 'First Suggestion', onClick: () => mockCreateTask('first') },
      { text: 'Second Suggestion', onClick: () => mockCreateTask('second') },
    ];

    render(<EmptyState suggestions={suggestions} />);

    const firstChip = screen.getByRole('button', { name: 'First Suggestion' });
    const secondChip = screen.getByRole('button', {
      name: 'Second Suggestion',
    });

    // Tab navigation
    await user.tab();
    expect(firstChip).toHaveFocus();

    await user.tab();
    expect(secondChip).toHaveFocus();

    // Enter activation
    await user.keyboard('{Enter}');
    expect(mockCreateTask).toHaveBeenCalledWith('second');
  });

  it('maintains focus management with disabled elements', async () => {
    const user = userEvent.setup();
    const actions: EmptyStateAction[] = [
      { label: 'Enabled Action', onClick: mockOpenQuickAdd },
      { label: 'Disabled Action', onClick: mockOpenImport, disabled: true },
    ];

    render(<EmptyState actions={actions} />);

    // Tab should skip disabled button
    await user.tab();
    expect(
      screen.getByRole('button', { name: 'Enabled Action' })
    ).toHaveFocus();

    await user.tab();
    // Focus should move beyond the disabled button (depends on what comes next)
    expect(
      screen.getByRole('button', { name: 'Disabled Action' })
    ).not.toHaveFocus();
  });
});

// ===== COMPOUND COMPONENT TESTS =====

describe('EmptyState - Compound Components', () => {
  it('renders EmptyStateNoData with correct variant', () => {
    render(<EmptyStateNoData />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Create your first task'
    );
  });

  it('renders EmptyStateNoResults with correct variant', () => {
    render(<EmptyStateNoResults />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'No results found'
    );
  });

  it('renders EmptyStateError with correct variant', () => {
    render(<EmptyStateError />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Something went wrong'
    );
  });

  it('renders EmptyStateSearch with correct variant', () => {
    render(<EmptyStateSearch />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Start your search'
    );
  });

  it('renders EmptyStateNetwork with correct variant', () => {
    render(<EmptyStateNetwork />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Connection problem'
    );
  });

  it('renders EmptyStateOnboarding with correct variant', () => {
    render(<EmptyStateOnboarding />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Create your first task'
    );
  });

  it('compound components accept additional props', () => {
    render(
      <EmptyStateOnboarding
        title='Custom Onboarding Title'
        data-testid='onboarding-test'
      />
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Custom Onboarding Title'
    );
    expect(screen.getByTestId('onboarding-test')).toBeInTheDocument();
  });
});

// ===== SIR STEVE INTEGRATION TESTS =====

describe('EmptyState - Sir Steve Integration', () => {
  it('implements complete onboarding pattern', async () => {
    const user = userEvent.setup();
    const actions: EmptyStateAction[] = [
      { label: 'Add a task', onClick: mockOpenQuickAdd, variant: 'primary' },
      {
        label: 'Import from CSV',
        onClick: mockOpenImport,
        variant: 'secondary',
      },
    ];

    const suggestions: EmptyStateSuggestion[] = [
      {
        text: 'Follow up with Alex',
        onClick: () => mockCreateTask('Follow up with Alex'),
      },
      { text: 'Draft Q3 plan', onClick: () => mockCreateTask('Draft Q3 plan') },
      { text: 'Pay invoices', onClick: () => mockCreateTask('Pay invoices') },
    ];

    render(
      <EmptyStateOnboarding
        title='Create your first task'
        description='Capture what matters and start checking things off.'
        actions={actions}
        suggestions={suggestions}
      />
    );

    // Verify purpose-driven copy
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Create your first task'
    );
    expect(
      screen.getByText('Capture what matters and start checking things off.')
    ).toBeInTheDocument();

    // Verify single primary action
    const primaryButton = screen.getByRole('button', { name: 'Add a task' });
    expect(primaryButton).toBeInTheDocument();

    // Verify safe alternative
    const secondaryButton = screen.getByRole('button', {
      name: 'Import from CSV',
    });
    expect(secondaryButton).toBeInTheDocument();

    // Verify suggestion chips
    expect(
      screen.getByRole('button', { name: 'Follow up with Alex' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Draft Q3 plan' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pay invoices' })
    ).toBeInTheDocument();

    // Test primary action
    await user.click(primaryButton);
    expect(mockOpenQuickAdd).toHaveBeenCalledTimes(1);

    // Test suggestion interaction
    await user.click(
      screen.getByRole('button', { name: 'Follow up with Alex' })
    );
    expect(mockCreateTask).toHaveBeenCalledWith('Follow up with Alex');
  });

  it('supports measurement hooks for Sir Steve metrics', () => {
    const onActionClick = vi.fn();
    const onSuggestionClick = vi.fn();

    const actions: EmptyStateAction[] = [
      {
        label: 'Add a task',
        onClick: () => {
          onActionClick('primary-action');
          mockOpenQuickAdd();
        },
        variant: 'primary',
      },
    ];

    const suggestions: EmptyStateSuggestion[] = [
      {
        text: 'Follow up with Alex',
        onClick: () => {
          onSuggestionClick('Follow up with Alex');
          mockCreateTask('Follow up with Alex');
        },
      },
    ];

    render(
      <EmptyStateOnboarding actions={actions} suggestions={suggestions} />
    );

    // Simulate measurement tracking
    fireEvent.click(screen.getByRole('button', { name: 'Add a task' }));
    expect(onActionClick).toHaveBeenCalledWith('primary-action');

    fireEvent.click(
      screen.getByRole('button', { name: 'Follow up with Alex' })
    );
    expect(onSuggestionClick).toHaveBeenCalledWith('Follow up with Alex');
  });
});

// ===== EDGE CASES =====

describe('EmptyState - Edge Cases', () => {
  it('handles empty actions array gracefully', () => {
    render(<EmptyState actions={[]} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles empty suggestions array gracefully', () => {
    render(<EmptyState suggestions={[]} />);

    expect(screen.queryByLabelText('Suggestions')).not.toBeInTheDocument();
  });

  it('handles missing title gracefully', () => {
    render(<EmptyState title='' />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    render(<EmptyState description='' />);

    expect(screen.queryByText('description')).not.toBeInTheDocument();
  });

  it('handles rapid action clicks gracefully', async () => {
    const user = userEvent.setup();
    const actions: EmptyStateAction[] = [
      { label: 'Click Me', onClick: mockOpenQuickAdd },
    ];

    render(<EmptyState actions={actions} />);

    const button = screen.getByRole('button', { name: 'Click Me' });

    // Rapid clicks
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOpenQuickAdd).toHaveBeenCalledTimes(3);
  });
});

// ===== PERFORMANCE TESTS =====

describe('EmptyState - Performance', () => {
  it('renders efficiently with many suggestions', () => {
    const manySuggestions: EmptyStateSuggestion[] = Array.from(
      { length: 20 },
      (_, i) => ({
        text: `Suggestion ${i + 1}`,
        onClick: () => mockCreateTask(`task-${i + 1}`),
      })
    );

    const { container } = render(<EmptyState suggestions={manySuggestions} />);

    expect(container.querySelectorAll('button')).toHaveLength(20);
  });

  it('maintains performance with complex custom content', () => {
    const ComplexContent = () => (
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i}>Complex item {i}</div>
        ))}
      </div>
    );

    render(
      <EmptyState>
        <ComplexContent />
      </EmptyState>
    );

    expect(screen.getByText('Complex item 0')).toBeInTheDocument();
    expect(screen.getByText('Complex item 99')).toBeInTheDocument();
  });
});
