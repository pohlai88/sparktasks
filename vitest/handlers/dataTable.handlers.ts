/**
 * DataTable MSW Handlers - Fortune-500 Grade Data Testing
 *
 * Mock HTTP handlers for DataTable component testing.
 * Covers realistic data scenarios including:
 * - Paginated data fetching
 * - Real-time updates simulation
 * - Sorting and filtering
 * - Error scenarios and rate limiting
 * - WebSocket fallback to polling
 */

import { http, HttpResponse, delay } from 'msw';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'developer',
    status: 'active',
  },
  {
    id: '3',
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    role: 'analyst',
    status: 'active',
  },
  {
    id: '4',
    name: 'Margaret Hamilton',
    email: 'margaret@example.com',
    role: 'lead',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Hedy Lamarr',
    email: 'hedy@example.com',
    role: 'researcher',
    status: 'active',
  },
  {
    id: '6',
    name: 'Annie Easley',
    email: 'annie@example.com',
    role: 'developer',
    status: 'active',
  },
];

let realtimeUpdateCounter = 0;

export const dataTableHandlers = [
  // Paginated data fetch
  http.get('/api/table/users', async ({ request }) => {
    await delay(40); // Realistic API latency

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    const filter = url.searchParams.get('filter') || '';

    // Apply filtering
    let filteredUsers = mockUsers;
    if (filter) {
      filteredUsers = mockUsers.filter(
        user =>
          user.name.toLowerCase().includes(filter.toLowerCase()) ||
          user.email.toLowerCase().includes(filter.toLowerCase()) ||
          user.role.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] || '';
      const bValue = b[sortBy as keyof typeof b] || '';

      if (sortOrder === 'desc') {
        return bValue.toString().localeCompare(aValue.toString());
      }
      return aValue.toString().localeCompare(bValue.toString());
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1,
      },
      meta: {
        sortBy,
        sortOrder,
        filter,
        timestamp: new Date().toISOString(),
      },
    });
  }),

  // Real-time updates endpoint (polling simulation)
  http.get('/api/table/users/updates', async ({ request }) => {
    await delay(60); // Polling delay

    const url = new URL(request.url);
    const lastUpdate = url.searchParams.get('since');

    realtimeUpdateCounter++;

    // Simulate new data after a few polls
    if (realtimeUpdateCounter >= 3) {
      const newUser = {
        id: `new-${realtimeUpdateCounter}`,
        name: `New User ${realtimeUpdateCounter}`,
        email: `new${realtimeUpdateCounter}@example.com`,
        role: 'user',
        status: 'active',
      };

      return HttpResponse.json({
        updates: [
          {
            type: 'insert',
            data: newUser,
            timestamp: new Date().toISOString(),
          },
        ],
        hasMore: false,
      });
    }

    // No updates yet
    return HttpResponse.json({
      updates: [],
      hasMore: false,
      nextPoll: 2000, // ms
    });
  }),

  // Bulk operations
  http.post('/api/table/users/bulk', async ({ request }) => {
    await delay(120); // Bulk operation takes longer

    const body = (await request.json()) as any;
    const { action, userIds } = body;

    return HttpResponse.json({
      success: true,
      action,
      affected: userIds.length,
      timestamp: new Date().toISOString(),
    });
  }),

  // Individual user operations
  http.patch('/api/table/users/:userId', async ({ params, request }) => {
    await delay(80);

    const { userId } = params;
    const updates = (await request.json()) as any;

    return HttpResponse.json({
      success: true,
      userId,
      updates,
      timestamp: new Date().toISOString(),
    });
  }),

  http.delete('/api/table/users/:userId', async ({ params }) => {
    await delay(90);

    const { userId } = params;

    return HttpResponse.json({
      success: true,
      deleted: userId,
      timestamp: new Date().toISOString(),
    });
  }),

  // Error scenarios for testing
  http.get('/api/table/users/error-500', async () => {
    await delay(10);
    return new HttpResponse('Database connection failed', { status: 500 });
  }),

  http.get('/api/table/users/error-429', async () => {
    await delay(10);
    return new HttpResponse('Rate limit exceeded', {
      status: 429,
      headers: { 'Retry-After': '30' },
    });
  }),

  http.get('/api/table/users/timeout', async () => {
    await delay(10000); // Simulate timeout
    return HttpResponse.json({ data: [] });
  }),

  // Export functionality
  http.post('/api/table/users/export', async ({ request }) => {
    await delay(200); // Export takes time

    const body = (await request.json()) as any;
    const { format, filters } = body;

    return HttpResponse.json({
      success: true,
      exportId: 'export-123',
      format,
      downloadUrl: `/api/downloads/export-123.${format}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    });
  }),
];
