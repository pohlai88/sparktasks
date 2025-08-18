/**
 * Health check utilities
 * Used by both server routes and e2e tests
 */

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  dependencies?: Record<string, 'ok' | 'fail'>;
}

export interface HealthOptions {
  status?: HealthStatus['status'];
  dependencies?: Record<string, 'ok' | 'fail'>;
  timestampFn?: () => Date;
  uptimeFn?: () => number;
}

export const createHealthResponse = (
  version: string,
  options: HealthOptions = {}
): HealthStatus => {
  const {
    status = 'healthy',
    dependencies,
    timestampFn = () => new Date(),
    uptimeFn = () => process.uptime(),
  } = options;

  return {
    status,
    timestamp: timestampFn().toISOString(),
    version,
    uptime: Math.floor(uptimeFn()),
    ...(dependencies && { dependencies }),
  };
};
