/**
 * API Contract Schemas - Fortune-500 Grade Type Safety
 *
 * Zod schemas for validating API responses in integration tests.
 * Ensures MSW handlers match actual API contracts and catch
 * schema drift between frontend and backend.
 */

import { z } from 'zod';

// Base schemas
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'developer', 'analyst', 'lead', 'researcher', 'user']),
  status: z.enum(['active', 'inactive']),
});

export const PaginationSchema = z.object({
  page: z.number().positive(),
  limit: z.number().positive(),
  total: z.number().nonnegative(),
  totalPages: z.number().positive(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// API Response schemas
export const UsersListResponseSchema = z.object({
  data: z.array(UserSchema),
  pagination: PaginationSchema,
  meta: z.object({
    sortBy: z.string(),
    sortOrder: z.enum(['asc', 'desc']),
    filter: z.string(),
    timestamp: z.string(),
  }),
});

export const RealtimeUpdateSchema = z.object({
  type: z.enum(['insert', 'update', 'delete']),
  data: UserSchema.optional(),
  timestamp: z.string(),
});

export const RealtimeUpdatesResponseSchema = z.object({
  updates: z.array(RealtimeUpdateSchema),
  hasMore: z.boolean(),
  nextPoll: z.number().optional(),
});

// Schema Explorer schemas
export const SchemaColumnSchema = z.object({
  name: z.string(),
  type: z.string(),
  nullable: z.boolean(),
  primaryKey: z.boolean().optional(),
  unique: z.boolean().optional(),
  foreignKey: z.string().optional(),
  values: z.array(z.string()).optional(), // For enums
});

export const SchemaInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  columns: z.array(z.string()),
});

export const SchemasListResponseSchema = z.object({
  schemas: z.array(SchemaInfoSchema),
  total: z.number(),
});

export const SchemaDetailResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  columns: z.array(SchemaColumnSchema),
  indexes: z.array(z.string()),
  rowCount: z.number(),
});

export const QueryResultsResponseSchema = z.object({
  results: z.array(z.record(z.unknown())), // Dynamic schema
  total: z.number(),
  query: z.string(),
  executionTime: z.number(),
});

// Bulk operation schemas
export const BulkOperationResponseSchema = z.object({
  success: z.boolean(),
  action: z.string(),
  affected: z.number(),
  timestamp: z.string(),
});

export const ExportResponseSchema = z.object({
  success: z.boolean(),
  exportId: z.string(),
  format: z.string(),
  downloadUrl: z.string(),
  expiresAt: z.string(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.number().optional(),
  details: z.record(z.unknown()).optional(),
});

// Type exports for use in tests
export type User = z.infer<typeof UserSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type RealtimeUpdatesResponse = z.infer<
  typeof RealtimeUpdatesResponseSchema
>;
export type SchemasListResponse = z.infer<typeof SchemasListResponseSchema>;
export type SchemaDetailResponse = z.infer<typeof SchemaDetailResponseSchema>;
export type QueryResultsResponse = z.infer<typeof QueryResultsResponseSchema>;
