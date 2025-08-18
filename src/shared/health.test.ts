import { describe, it, expect } from 'vitest';
import { createHealthResponse } from '@shared/health';

describe('Health Utilities', () => {
  it('should create basic healthy response', () => {
    const fixedDate = new Date('2025-08-15T10:00:00.000Z');
    const response = createHealthResponse('1.0.0', {
      timestampFn: () => fixedDate,
      uptimeFn: () => 123.456,
    });

    expect(response).toEqual({
      status: 'healthy',
      timestamp: '2025-08-15T10:00:00.000Z',
      version: '1.0.0',
      uptime: 123, // Should be floored
    });
  });

  it('should create unhealthy response', () => {
    const fixedDate = new Date('2025-08-15T10:00:00.000Z');
    const response = createHealthResponse('1.0.0', {
      status: 'unhealthy',
      timestampFn: () => fixedDate,
      uptimeFn: () => 456.789,
    });

    expect(response.status).toBe('unhealthy');
    expect(response.uptime).toBe(456);
  });

  it('should include dependencies when provided', () => {
    const dependencies = {
      database: 'ok' as const,
      redis: 'fail' as const,
      storage: 'ok' as const,
    };

    const response = createHealthResponse('1.0.0', {
      dependencies,
      timestampFn: () => new Date('2025-08-15T10:00:00.000Z'),
      uptimeFn: () => 100,
    });

    expect(response.dependencies).toEqual(dependencies);
  });

  it('should not include dependencies field when not provided', () => {
    const response = createHealthResponse('1.0.0', {
      timestampFn: () => new Date('2025-08-15T10:00:00.000Z'),
      uptimeFn: () => 100,
    });

    expect(response).not.toHaveProperty('dependencies');
  });

  it('should use default values when no options provided', () => {
    // This test will use actual Date and process.uptime in real environment
    const response = createHealthResponse('1.0.0');

    expect(response.status).toBe('healthy');
    expect(response.version).toBe('1.0.0');
    expect(typeof response.timestamp).toBe('string');
    expect(typeof response.uptime).toBe('number');
    expect(Number.isInteger(response.uptime)).toBe(true);
  });
});
