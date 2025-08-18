/**
 * API Contract Acceptance Tests
 * Validates that API responses conform to the contracts defined in API_CONTRACTS.md
 * These tests ensure contract discipline from day one
 */

import { describe, it, expect } from 'vitest';
import { 
  ErrorResponseSchema, 
  HealthResponseSchema,
  VersionResponseSchema,
  createErrorResponse,
  isValidErrorResponse,
  ErrorCodes,
  HttpStatus
} from '@shared/api-contracts';

describe('API Contract Validation', () => {
  
  describe('Error Response Contract', () => {
    it('should validate correct error response format', () => {
      const validError = {
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'The requested task could not be found'
        }
      };

      expect(ErrorResponseSchema.safeParse(validError).success).toBe(true);
      expect(isValidErrorResponse(validError)).toBe(true);
    });

    it('should validate error response with optional details', () => {
      const errorWithDetails = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: {
            field: 'title',
            issue: 'Required field missing'
          }
        }
      };

      expect(ErrorResponseSchema.safeParse(errorWithDetails).success).toBe(true);
    });

    it('should reject invalid error response formats', () => {
      const invalidFormats = [
        { message: 'Missing error wrapper' },
        { error: { message: 'Missing code field' } },
        { error: { code: 'TEST', message: 123 } }, // message should be string
        { error: { code: 123, message: 'code should be string' } } // code should be string
      ];

      invalidFormats.forEach(invalid => {
        expect(ErrorResponseSchema.safeParse(invalid).success).toBe(false);
      });
    });

    it('should create standardized error responses', () => {
      const error = createErrorResponse(
        'TASK_NOT_FOUND',
        'Task with ID task_123 not found',
        { taskId: 'task_123', timestamp: '2025-08-15T10:00:00.000Z' }
      );

      expect(isValidErrorResponse(error)).toBe(true);
      expect(error.error.code).toBe('TASK_NOT_FOUND');
      expect(error.error.details?.taskId).toBe('task_123');
    });
  });

  describe('Health Response Contract', () => {
    it('should validate health response format', () => {
      const healthResponse = {
        status: 'healthy' as const,
        timestamp: '2025-08-15T10:00:00.000Z',
        version: '1.0.0',
        uptime: 3600
      };

      expect(HealthResponseSchema.safeParse(healthResponse).success).toBe(true);
    });

    it('should validate health response with dependencies', () => {
      const healthWithDeps = {
        status: 'degraded' as const,
        timestamp: '2025-08-15T10:00:00.000Z', 
        version: '1.0.0',
        uptime: 3600,
        dependencies: {
          database: 'ok' as const,
          cache: 'fail' as const,
          storage: 'degraded' as const
        }
      };

      expect(HealthResponseSchema.safeParse(healthWithDeps).success).toBe(true);
    });

    it('should reject invalid health status values', () => {
      const invalidHealth = {
        status: 'unknown', // invalid status
        timestamp: '2025-08-15T10:00:00.000Z',
        version: '1.0.0',
        uptime: 3600
      };

      expect(HealthResponseSchema.safeParse(invalidHealth).success).toBe(false);
    });
  });

  describe('Version Response Contract', () => {
    it('should validate version response format', () => {
      const versionResponse = {
        version: '1.0.0',
        build: 'abc123def456',
        timestamp: '2025-08-15T10:00:00.000Z'
      };

      expect(VersionResponseSchema.safeParse(versionResponse).success).toBe(true);
    });
  });

  describe('Error Code Standards', () => {
    it('should have all required error codes defined', () => {
      expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCodes.TASK_NOT_FOUND).toBe('TASK_NOT_FOUND');
      expect(ErrorCodes.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCodes.STORAGE_ERROR).toBe('STORAGE_ERROR');
    });

    it('should align HTTP status codes with error types', () => {
      expect(HttpStatus.OK).toBe(200);
      expect(HttpStatus.CREATED).toBe(201);
      expect(HttpStatus.BAD_REQUEST).toBe(400);
      expect(HttpStatus.NOT_FOUND).toBe(404);
      expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatus.BAD_GATEWAY).toBe(502);
    });
  });

  describe('Contract Integration with Existing Types', () => {
    it('should be compatible with existing health response from @shared/health', () => {
      // This ensures our API contract aligns with existing implementation
      const existingHealthResponse = testHelpers.createMockHealthResponse();
      
      // Should be valid according to our API contract
      expect(HealthResponseSchema.safeParse(existingHealthResponse).success).toBe(true);
    });
  });
});
