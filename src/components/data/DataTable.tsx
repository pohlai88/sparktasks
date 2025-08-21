import React, { useState, useMemo, useCallback } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export interface DataTableColumn<T = any> {
  key: keyof T | string;
  header: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  className?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (key: string, value: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  selection?: {
    selectedRowKeys: (string | number)[];
    onSelectionChange: (
      selectedRowKeys: (string | number)[],
      selectedRows: T[]
    ) => void;
    type?: 'checkbox' | 'radio';
  };
  expandable?: {
    expandedRowKeys: (string | number)[];
    onExpand: (expanded: boolean, record: T) => void;
    expandedRowRender: (record: T) => React.ReactNode;
  };
  density?: 'comfortable' | 'compact' | 'spacious';
  sticky?: boolean;
  scrollable?: boolean;
  maxHeight?: string | number;
  emptyState?: React.ReactNode;
  'data-testid'?: string;
}

interface SortState {
  key: string | null;
  direction: 'asc' | 'desc';
}

// ===== HELPER FUNCTIONS =====

function getRowKey<T>(
  record: T,
  index: number,
  rowKey?: keyof T | ((record: T) => string | number)
): string | number {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }
  if (rowKey && record[rowKey]) {
    return String(record[rowKey]);
  }
  return index;
}

function sortData<T>(
  data: T[],
  sortState: SortState,
  columns: DataTableColumn<T>[]
): T[] {
  if (!sortState.key) return data;

  const column = columns.find(col => col.key === sortState.key);
  if (!column) return data;

  return [...data].sort((a, b) => {
    const aVal = a[column.key as keyof T];
    const bVal = b[column.key as keyof T];

    let comparison = 0;
    if (aVal < bVal) comparison = -1;
    if (aVal > bVal) comparison = 1;

    return sortState.direction === 'desc' ? -comparison : comparison;
  });
}

// ===== MAIN COMPONENT =====

export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  className = '',
  rowKey,
  onRowClick,
  onSort,
  pagination,
  selection,
  expandable,
  density = 'comfortable',
  scrollable = false,
  maxHeight,
  emptyState,
  'data-testid': testId = 'data-table',
}: DataTableProps<T>) {
  // ===== STATE MANAGEMENT =====

  const [sortState, setSortState] = useState<SortState>({
    key: null,
    direction: 'asc',
  });
  // TODO: Implement filtering functionality when needed
  // const [filters, setFilters] = useState<Record<string, string>>({});

  // ===== COMPUTED VALUES =====

  const processedData = useMemo(() => {
    let result = data;

    // Apply sorting
    result = sortData(result, sortState, columns);

    // Apply pagination if provided
    if (pagination) {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      result = result.slice(start, end);
    }

    return result;
  }, [data, sortState, pagination, columns]);

  // ===== EVENT HANDLERS =====

  const handleSort = useCallback(
    (columnKey: string) => {
      const newDirection: 'asc' | 'desc' =
        sortState.key === columnKey && sortState.direction === 'asc'
          ? 'desc'
          : 'asc';
      const newSortState = { key: columnKey, direction: newDirection };

      setSortState(newSortState);
      onSort?.(columnKey, newDirection);
    },
    [sortState, onSort]
  );

  const handleRowClick = useCallback(
    (record: T, index: number) => {
      onRowClick?.(record, index);
    },
    [onRowClick]
  );

  const handleSelectionChange = useCallback(
    (recordKey: string | number, checked: boolean) => {
      if (!selection) return;

      const newSelectedKeys = checked
        ? [...selection.selectedRowKeys, recordKey]
        : selection.selectedRowKeys.filter(key => key !== recordKey);

      const newSelectedRows = data.filter(record =>
        newSelectedKeys.includes(
          getRowKey(record, data.indexOf(record), rowKey)
        )
      );

      selection.onSelectionChange(newSelectedKeys, newSelectedRows);
    },
    [selection, data, rowKey]
  );

  // ===== RENDER HELPERS =====

  const renderTableHeader = () => (
    <thead className={DESIGN_TOKENS.table.head}>
      <tr>
        {selection && (
          <th className={DESIGN_TOKENS.table.headCell}>
            <input
              type='checkbox'
              className={DESIGN_TOKENS.recipe.input.base}
              onChange={e => {
                const allKeys = data.map((record, index) =>
                  getRowKey(record, index, rowKey)
                );
                selection.onSelectionChange(
                  e.target.checked ? allKeys : [],
                  e.target.checked ? data : []
                );
              }}
              checked={
                selection.selectedRowKeys.length === data.length &&
                data.length > 0
              }
              ref={input => {
                if (input) {
                  input.indeterminate =
                    selection.selectedRowKeys.length > 0 &&
                    selection.selectedRowKeys.length < data.length;
                }
              }}
              aria-label='Select all rows'
            />
          </th>
        )}
        {expandable && (
          <th
            className={DESIGN_TOKENS.table.headCell}
            style={{ width: '48px' }}
          >
            {/* Expand/Collapse column header */}
          </th>
        )}
        {columns.map(column => (
          <th
            key={String(column.key)}
            className={`${DESIGN_TOKENS.table.headCell} ${column.sortable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''}`}
            style={{ width: column.width, textAlign: column.align || 'left' }}
            onClick={
              column.sortable ? () => handleSort(String(column.key)) : undefined
            }
            aria-sort={
              sortState.key === column.key
                ? sortState.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none'
            }
          >
            <div className={DESIGN_TOKENS.layout.patterns.flexGap}>
              {column.header}
              {column.sortable && (
                <span className={DESIGN_TOKENS.icon.size.sm}>
                  {sortState.key === column.key
                    ? sortState.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : '↕'}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {loading ? (
        <tr>
          <td
            colSpan={
              columns.length + (selection ? 1 : 0) + (expandable ? 1 : 0)
            }
          >
            <div
              className={`${DESIGN_TOKENS.layout.patterns.flexGap} justify-center p-8`}
            >
              <div
                className={DESIGN_TOKENS.table.skeleton}
                style={{ width: '24px', height: '24px' }}
              />
              <span className={DESIGN_TOKENS.typography.body.secondary}>
                Loading...
              </span>
            </div>
          </td>
        </tr>
      ) : processedData.length === 0 ? (
        <tr>
          <td
            colSpan={
              columns.length + (selection ? 1 : 0) + (expandable ? 1 : 0)
            }
          >
            <div className='p-8 text-center'>
              {emptyState || (
                <div className={DESIGN_TOKENS.typography.body.secondary}>
                  No data available
                </div>
              )}
            </div>
          </td>
        </tr>
      ) : (
        processedData.map((record, index) => {
          const key = getRowKey(record, index, rowKey);
          const isSelected = selection?.selectedRowKeys.includes(key) || false;
          const isExpanded = expandable?.expandedRowKeys.includes(key) || false;

          return (
            <React.Fragment key={key}>
              <tr
                className={` ${DESIGN_TOKENS.table.row} ${DESIGN_TOKENS.table.rowDefault} ${onRowClick ? DESIGN_TOKENS.table.rowHoverable : ''} ${isSelected ? DESIGN_TOKENS.table.rowSelected : ''} ${DESIGN_TOKENS.density[density].rowY} `}
                onClick={() => handleRowClick(record, index)}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={e => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleRowClick(record, index);
                  }
                }}
              >
                {selection && (
                  <td
                    className={`${DESIGN_TOKENS.table.cell} ${DESIGN_TOKENS.density[density].cellX}`}
                  >
                    <input
                      type={selection.type || 'checkbox'}
                      checked={isSelected}
                      onChange={e =>
                        handleSelectionChange(key, e.target.checked)
                      }
                      onClick={e => e.stopPropagation()}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                )}
                {expandable && (
                  <td
                    className={`${DESIGN_TOKENS.table.cell} ${DESIGN_TOKENS.density[density].cellX}`}
                  >
                    <button
                      className={DESIGN_TOKENS.recipe.button.ghost}
                      onClick={e => {
                        e.stopPropagation();
                        expandable.onExpand(!isExpanded, record);
                      }}
                      aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                    >
                      {isExpanded ? '−' : '+'}
                    </button>
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={String(column.key)}
                    className={` ${DESIGN_TOKENS.table.cell} ${DESIGN_TOKENS.density[density].cellX} ${column.className || ''} `}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render
                      ? column.render(
                          record[column.key as keyof T],
                          record,
                          index
                        )
                      : String(record[column.key as keyof T] || '')}
                  </td>
                ))}
              </tr>
              {expandable && isExpanded && (
                <tr>
                  <td colSpan={columns.length + (selection ? 1 : 0) + 1}>
                    <div className='bg-slate-50 p-4 dark:bg-slate-900/50'>
                      {expandable.expandedRowRender(record)}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })
      )}
    </tbody>
  );

  const renderPagination = () => {
    if (!pagination) return null;

    const { page, pageSize, total, onPageChange, onPageSizeChange } =
      pagination;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <div
        className={`${DESIGN_TOKENS.layout.patterns.spaceBetween} border-t p-4`}
      >
        <div className={DESIGN_TOKENS.layout.patterns.flexGap}>
          <span className={DESIGN_TOKENS.typography.body.secondary}>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, total)} of {total} entries
          </span>
        </div>
        <div className={DESIGN_TOKENS.layout.patterns.flexGap}>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className={DESIGN_TOKENS.recipe.input.base}
            aria-label='Rows per page'
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={DESIGN_TOKENS.recipe.button.outline}
            aria-label='Previous page'
          >
            Previous
          </button>
          <span className={DESIGN_TOKENS.typography.body.primary}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className={DESIGN_TOKENS.recipe.button.outline}
            aria-label='Next page'
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // ===== MAIN RENDER =====

  const containerClassName = `
    ${DESIGN_TOKENS.table.container}
    ${scrollable ? 'overflow-auto' : ''}
    ${className}
  `.trim();

  const tableClassName = `
    ${DESIGN_TOKENS.table.base}
    ${DESIGN_TOKENS.density[density].text}
  `.trim();

  return (
    <div
      className={containerClassName}
      style={{ maxHeight }}
      data-testid={testId}
      role='region'
      aria-label='Data table'
    >
      <table className={tableClassName}>
        {renderTableHeader()}
        {renderTableBody()}
      </table>
      {renderPagination()}
    </div>
  );
}
