/**
 * API Contract Schemas
 * TypeScript/Zod implementations of API contracts defined in API_CONTRACTS.md
 * Use these schemas for validation in both application code and tests
 */

import { z } from 'zod';

/**
 * Standard Error Response Schema
 * All API endpoints must return errors in this format
 */
export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().describe('Machine-readable error code'),
    message: z.string().describe('Human-readable error description'),
    details: z
      .record(z.any())
      .optional()
      .describe('Optional additional context'),
  }),
});

/**
 * Standard error codes used across the API
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
} as const;

/**
 * HTTP Status codes aligned with error responses
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;

/**
 * Health Response Schema
 * For /api/health endpoint
 */
export const HealthResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy', 'degraded']),
  timestamp: z.string().describe('ISO 8601 timestamp'),
  version: z.string().describe('Application version'),
  uptime: z.number().describe('Uptime in seconds'),
  dependencies: z.record(z.enum(['ok', 'fail', 'degraded'])).optional(),
});

/**
 * Version Response Schema
 * For /api/version endpoint
 */
export const VersionResponseSchema = z.object({
  version: z.string().describe('Semantic version (e.g., 1.0.0)'),
  build: z.string().describe('Build identifier or commit hash'),
  timestamp: z.string().describe('Build timestamp (ISO 8601)'),
});

// Type exports for use in application code
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type VersionResponse = z.infer<typeof VersionResponseSchema>;
export type ErrorCode = keyof typeof ErrorCodes;

/**
 * Helper function to create standardized error responses
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): ErrorResponse {
  return {
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
}

/**
 * Helper function to validate error response format
 */
export function isValidErrorResponse(data: unknown): data is ErrorResponse {
  return ErrorResponseSchema.safeParse(data).success;
}
