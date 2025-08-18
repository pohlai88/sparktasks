/**
 * Maintenance operation types for headless operations
 */

/**
 * Maintenance plan with ordered actions to execute
 */
export interface MaintenancePlan {
  actions: Array<
    | { type: 'COMPACT'; threshold: number }
    | { type: 'REKEY'; prefix: string; batchSize: number }
    | { type: 'SWEEP'; prefix: string; fix: boolean; sample?: number }
  >;
}

/**
 * Report of maintenance operations executed
 */
export interface MaintenanceReport {
  compact?: {
    trimmed: number;
    tookSnapshot: boolean;
  };
  rekey?: {
    processed: number;
    rewrapped: number;
    failures: number;
  };
  sweep?: {
    scanned: number;
    ok: number;
    repaired: number;
    failed: Array<{
      key: string;
      reason: string;
    }>;
  };
  /** Resume token for continuing interrupted operations */
  resumeToken?: string;
}

/**
 * Options for planning maintenance operations
 */
export interface MaintenanceOptions {
  /** Maximum events before compaction */
  maxEvents?: number;
  /** Minimum delta for snapshot freshness */
  minDelta?: number;
  /** Prefix for rekeying operation */
  rekeyPrefix?: string;
  /** Batch size for rekeying (default 100) */
  batchSize?: number;
  /** Prefix for integrity sweep */
  sweepPrefix?: string;
  /** Whether to fix issues during sweep (default false) */
  sweepFix?: boolean;
  /** Sample size for sweep (optional) */
  sample?: number;
  /** Resume token for interrupted operations */
  resumeToken?: string;
}
