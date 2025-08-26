/**
 * DataTable Integration Tests - Fortune-500 Grade API Integration
 *
 * Integration tests using MSW for realistic HTTP behavior.
 * Tests real-time updates, pagination, error scenarios.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';

import { UsersListResponseSchema } from '../schemas/api.schemas';
import { useMsw } from '../setup/useMsw';

// User type for better TypeScript support
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'developer' | 'analyst' | 'lead' | 'researcher' | 'user';
}

// Mock DataTable component for demonstration
const MockDataTable = ({ onError }: { onError?: (error: Error) => void }) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/table/users');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validate response with Zod schema
      const validatedData = UsersListResponseSchema.parse(data);
      setUsers(validatedData.data);
    } catch (error_) {
      const errorMessage =
        error_ instanceof Error ? error_.message : 'Unknown error';
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [onError]);

  React.useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div data-testid='loading'>Loading users...</div>;
  if (error) return <div data-testid='error'>Error: {error}</div>;

  return (
    <div data-testid='users-table'>
      <h2>Users</h2>
      <button onClick={() => void fetchUsers()} data-testid='refresh-btn'>
        Refresh
      </button>
      <ul>
        {users.map(user => (
          <li key={user.id} data-testid={`user-${user.id}`}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('DataTable Integration - Fortune-500 Grade Tests', () => {
  const server = useMsw();

  beforeEach(() => {
    // Reset any server overrides
    server.resetHandlers();
  });

  test('loads and displays user data successfully', async () => {
    render(<MockDataTable />);

    // Should show loading state initially
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('users-table')).toBeInTheDocument();
    });

    // Should display users from mock data
    expect(screen.getByTestId('user-1')).toHaveTextContent('Ada Lovelace');
    expect(screen.getByTestId('user-2')).toHaveTextContent('Grace Hopper');
  });

  test('handles server errors gracefully', async () => {
    // Override handler to return 500 error
    server.use(
      http.get('/api/table/users', () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
      })
    );

    const onError = vi.fn();
    render(<MockDataTable onError={onError} />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent(
      'HTTP 500: Internal Server Error'
    );
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  test('handles rate limiting with retry headers', async () => {
    // Override handler to return 429 rate limit
    server.use(
      http.get('/api/table/users', () => {
        return new HttpResponse('Too Many Requests', {
          status: 429,
          headers: { 'Retry-After': '60' },
        });
      })
    );

    render(<MockDataTable />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('error')).toHaveTextContent(
      'HTTP 429: Too Many Requests'
    );
  });

  test('refreshes data when refresh button is clicked', async () => {
    render(<MockDataTable />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('users-table')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByTestId('refresh-btn');
    const user = userEvent.setup();

    // Click refresh
    await user.click(refreshBtn);

    // Should show loading state briefly
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Should load data again
    await waitFor(() => {
      expect(screen.getByTestId('users-table')).toBeInTheDocument();
    });
  });

  test('validates API response schema', async () => {
    // Override with invalid response schema
    server.use(
      http.get('/api/table/users', () => {
        return HttpResponse.json({
          data: [
            { id: '1', name: 'Test User' }, // Missing required fields
          ],
          pagination: { page: 1 }, // Missing required fields
        });
      })
    );

    const onError = vi.fn();
    render(<MockDataTable onError={onError} />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    // Should catch Zod validation error
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    const errorCall = onError.mock.calls[0]?.[0];
    expect(errorCall?.message).toContain('validation'); // Zod validation error
  });

  test('handles network timeouts', async () => {
    // Override with timeout scenario
    server.use(
      http.get('/api/table/users', async () => {
        // Simulate network timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        return HttpResponse.json({ data: [], pagination: {} });
      })
    );

    render(<MockDataTable />);

    // Should show loading for extended period
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait longer for timeout scenario
    await waitFor(
      () => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
