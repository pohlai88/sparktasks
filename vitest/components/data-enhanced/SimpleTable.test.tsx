/**
 * SimpleTable Component Tests
 *
 * Tests for the universal data table component with TanStack Table integration
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';

import { SimpleTable } from '../../../src/components/data-enhanced/SimpleTable/SimpleTable';

// Test data
interface TestData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
}

const mockData: TestData[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'Admin',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    role: 'User',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'active',
    role: 'Editor',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    status: 'active',
    role: 'User',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    status: 'inactive',
    role: 'Admin',
  },
];

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => (
      <span
        className={`pill ${row.original.status === 'active' ? 'green' : 'gray'}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableSorting: true,
  },
];

describe('SimpleTable', () => {
  describe('Basic Rendering', () => {
    it('renders table with data', () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);

      // Check if table is rendered
      expect(screen.getByRole('table')).toBeInTheDocument();

      // Check if headers are rendered
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();

      // Check if data is rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Editor')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(<SimpleTable data={[]} columns={mockColumns} loading={true} />);

      // Should show skeleton loading
      const skeletons = screen.getAllByRole('presentation');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders error state', () => {
      const error = new Error('Failed to load data');
      render(<SimpleTable data={[]} columns={mockColumns} error={error} />);

      expect(screen.getByText('Failed to load table data')).toBeInTheDocument();
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('renders empty state with custom component', () => {
      const EmptyComponent = () => <div>No users found</div>;

      render(
        <SimpleTable
          data={[]}
          columns={mockColumns}
          emptyState={<EmptyComponent />}
        />
      );

      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  describe('Variants and Styling', () => {
    it('applies density variants correctly', () => {
      const { rerender } = render(
        <SimpleTable data={mockData} columns={mockColumns} density='compact' />
      );

      const table = screen.getByRole('table').parentElement;
      expect(table).toHaveClass('space-y-3'); // compact density

      rerender(
        <SimpleTable data={mockData} columns={mockColumns} density='spacious' />
      );

      expect(table).toHaveClass('space-y-8'); // spacious density
    });

    it('applies surface variants correctly', () => {
      const { rerender } = render(
        <SimpleTable data={mockData} columns={mockColumns} surface='elevated' />
      );

      const container = screen.getByRole('table').closest('div');
      expect(container).toHaveClass('bg-surface-elevated1');

      rerender(
        <SimpleTable data={mockData} columns={mockColumns} surface='glass' />
      );

      expect(container).toHaveClass('bg-glass-surface');
    });

    it('applies striped styling when enabled', () => {
      render(
        <SimpleTable data={mockData} columns={mockColumns} striped={true} />
      );

      const table = screen.getAllByRole('table')[0];
      const container = table.closest('div');
      expect(container).toHaveClass('[&_tbody_tr:nth-child(odd)]:bg-muted/30');
    });
  });

  describe('Sorting Functionality', () => {
    it('enables sorting when sortable is true', async () => {
      const user = userEvent.setup();

      render(
        <SimpleTable data={mockData} columns={mockColumns} sortable={true} />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toHaveAttribute('role', 'button');
      expect(nameHeader).toHaveAttribute('tabIndex', '0');

      // Click to sort
      await user.click(nameHeader!);

      // Should show sort indicator
      const sortIcon = nameHeader?.querySelector('svg');
      expect(sortIcon).toBeInTheDocument();
    });

    it('disables sorting when sortable is false', () => {
      render(
        <SimpleTable data={mockData} columns={mockColumns} sortable={false} />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).not.toHaveAttribute('role', 'button');
      expect(nameHeader).not.toHaveAttribute('tabIndex');
    });

    it('handles keyboard sorting', async () => {
      const user = userEvent.setup();

      render(
        <SimpleTable data={mockData} columns={mockColumns} sortable={true} />
      );

      const nameHeader = screen.getByText('Name').closest('th');
      nameHeader?.focus();

      // Press Enter to sort
      await user.keyboard('{Enter}');

      // Should trigger sorting
      expect(nameHeader).toHaveAttribute('aria-sort');
    });
  });

  describe('Row Selection', () => {
    it('enables row selection when selectable is true', () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          onRowClick={vi.fn()}
        />
      );

      // With onRowClick, rows should have button role
      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // Skip header row

      dataRows.forEach(row => {
        expect(row).toHaveAttribute('role', 'button');
        expect(row).toHaveAttribute('tabIndex', '0');
      });
    });

    it('handles row click events', async () => {
      const onRowClick = vi.fn();
      const user = userEvent.setup();

      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          onRowClick={onRowClick}
        />
      );

      const firstDataRow = screen.getAllByRole('row')[1]; // Skip header
      await user.click(firstDataRow);

      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('handles keyboard row selection', async () => {
      const onRowClick = vi.fn();
      const user = userEvent.setup();

      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          onRowClick={onRowClick}
        />
      );

      const firstDataRow = screen.getAllByRole('row')[1];
      firstDataRow.focus();

      await user.keyboard('{Enter}');

      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe('Row Actions', () => {
    it('renders row actions when provided', () => {
      const rowActions = (row: TestData) => <button>Edit {row.name}</button>;

      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          rowActions={rowActions}
        />
      );

      expect(screen.getByText('Edit John Doe')).toBeInTheDocument();
      expect(screen.getByText('Edit Jane Smith')).toBeInTheDocument();

      // Should have Actions header (visually hidden)
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('applies pagination settings', () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          pagination={{ pageSize: 2 }}
        />
      );

      // Should only show 2 rows (based on pageSize)
      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // Skip header
      expect(dataRows).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SimpleTable data={mockData} columns={mockColumns} />);

      const table = screen.getAllByRole('table')[0]; // Get the first table element
      expect(table).toHaveAttribute('aria-label', 'Data table');
    });

    it('supports screen readers with proper markup', () => {
      render(
        <SimpleTable data={mockData} columns={mockColumns} sortable={true} />
      );

      // Headers should have proper sorting attributes
      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).toHaveAttribute('aria-sort');
    });

    it('handles focus management correctly', async () => {
      const user = userEvent.setup();

      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          sortable={true}
          onRowClick={vi.fn()}
        />
      );

      // Should be able to tab through sortable headers
      await user.tab();
      expect(screen.getByText('Name').closest('th')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('Email').closest('th')).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        status: i % 2 === 0 ? 'active' : ('inactive' as const),
        role: i % 3 === 0 ? 'Admin' : 'User',
      }));

      const startTime = performance.now();

      render(
        <SimpleTable
          data={largeData}
          columns={mockColumns}
          pagination={{ pageSize: 10 }}
        />
      );

      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);

      // Should only render paginated items
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(11); // 10 data rows + 1 header
    });
  });

  describe('Custom Props', () => {
    it('forwards custom props to container', () => {
      render(
        <SimpleTable
          data={mockData}
          columns={mockColumns}
          data-testid='custom-table'
          className='custom-class'
        />
      );

      const container = screen.getByTestId('custom-table');
      expect(container).toHaveClass('custom-class');
    });
  });
});
