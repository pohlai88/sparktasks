/**
 * Performance budgets and thresholds
 */

interface PerfBudget {
  p95_ms?: number;
  max_ms?: number;
  n: number;
}

interface PerfConfig {
  lanes: PerfBudget;
  query: PerfBudget;
  search: PerfBudget;
  searchUpdate: PerfBudget;
  buildIndex: PerfBudget;
}

const BASE_PERF: PerfConfig = {
  lanes: { p95_ms: 5, n: 1000 },
  query: { p95_ms: 200, n: 1000 },
  search: { p95_ms: 120, n: 1000 },
  searchUpdate: { p95_ms: 5, n: 1000 },
  buildIndex: { max_ms: 500, n: 1000 },
};

/**
 * Get performance budgets with environment variable overrides
 */
function getPerfConfig(): PerfConfig {
  let multiplier = 1;

  // Environment overrides
  if (process.env.PERF_RELAX === '1') {
    multiplier = 1.5;
  } else if (process.env.PERF_STRICT === '1') {
    multiplier = 0.8;
  }

  const config = structuredClone(BASE_PERF) as PerfConfig;

  // Apply multiplier to all time thresholds
  for (const budget of Object.values(config)) {
    if (budget.p95_ms) {
      budget.p95_ms = Math.ceil(budget.p95_ms * multiplier);
    }
    if (budget.max_ms) {
      budget.max_ms = Math.ceil(budget.max_ms * multiplier);
    }
  }

  return config;
}

export const PERF = getPerfConfig();
