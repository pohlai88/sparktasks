/**
 * API Explorer MSW Handlers - Fortune-500 Grade API Mocking
 *
 * Mock HTTP handlers for APIExplorer component testing.
 * Covers realistic scenarios including:
 * - Schema listing and details
 * - Latency simulation
 * - Error scenarios (500, 429, 404)
 * - Authentication validation
 */

import { http, HttpResponse, delay } from 'msw';

// Mock schema data
const mockSchemas = [
  {
    id: 'users',
    name: 'Users',
    columns: ['id', 'email', 'role', 'created_at'],
  },
  {
    id: 'tasks',
    name: 'Tasks',
    columns: ['id', 'title', 'status', 'assignee_id'],
  },
  {
    id: 'projects',
    name: 'Projects',
    columns: ['id', 'name', 'description', 'owner_id'],
  },
];

const mockSchemaDetails = {
  users: {
    name: 'users',
    description: 'User management table',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'email', type: 'varchar(255)', nullable: false, unique: true },
      {
        name: 'role',
        type: 'enum',
        nullable: false,
        values: ['admin', 'user'],
      },
      { name: 'created_at', type: 'timestamp', nullable: false },
    ],
    indexes: ['email', 'role'],
    rowCount: 1234,
  },
  tasks: {
    name: 'tasks',
    description: 'Task tracking table',
    columns: [
      { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
      { name: 'title', type: 'varchar(500)', nullable: false },
      {
        name: 'status',
        type: 'enum',
        nullable: false,
        values: ['todo', 'in_progress', 'done'],
      },
      {
        name: 'assignee_id',
        type: 'uuid',
        nullable: true,
        foreignKey: 'users.id',
      },
    ],
    indexes: ['status', 'assignee_id'],
    rowCount: 5678,
  },
};

export const apiExplorerHandlers = [
  // Get all schemas
  http.get('/api/explorer/schemas', async () => {
    await delay(50); // Realistic API latency
    return HttpResponse.json({
      schemas: mockSchemas,
      total: mockSchemas.length,
    });
  }),

  // Get specific schema details
  http.get('/api/explorer/schemas/:schemaName', async ({ params }) => {
    await delay(30);
    const { schemaName } = params;

    if (typeof schemaName !== 'string') {
      return new HttpResponse('Invalid schema name', { status: 400 });
    }

    const schema =
      mockSchemaDetails[schemaName as keyof typeof mockSchemaDetails];

    if (!schema) {
      return new HttpResponse('Schema not found', { status: 404 });
    }

    return HttpResponse.json(schema);
  }),

  // Query schema data with pagination
  http.post(
    '/api/explorer/schemas/:schemaName/query',
    async ({ params, request }) => {
      await delay(100); // Query execution time
      const { schemaName } = params;
      const body = (await request.json()) as any;

      // Mock query results
      const mockResults = {
        users: [
          {
            id: '1',
            email: 'admin@example.com',
            role: 'admin',
            created_at: '2024-01-01',
          },
          {
            id: '2',
            email: 'user@example.com',
            role: 'user',
            created_at: '2024-01-02',
          },
        ],
        tasks: [
          { id: '1', title: 'Setup project', status: 'done', assignee_id: '1' },
          {
            id: '2',
            title: 'Write tests',
            status: 'in_progress',
            assignee_id: '2',
          },
        ],
      };

      const results = mockResults[schemaName as keyof typeof mockResults] || [];

      return HttpResponse.json({
        results,
        total: results.length,
        query: body.query,
        executionTime: 45, // ms
      });
    }
  ),

  // Error scenarios for testing
  http.get('/api/explorer/schemas/error-500', async () => {
    await delay(10);
    return new HttpResponse('Internal Server Error', { status: 500 });
  }),

  http.get('/api/explorer/schemas/error-429', async () => {
    await delay(10);
    return new HttpResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }),

  // Authentication required endpoint
  http.get('/api/explorer/admin/schemas', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse('Unauthorized', { status: 401 });
    }

    await delay(30);
    return HttpResponse.json({
      schemas: mockSchemas,
      permissions: ['read', 'write', 'admin'],
    });
  }),
];
