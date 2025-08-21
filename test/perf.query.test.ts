import { describe, it, expect } from 'vitest';
import { timeIt } from '../src/perf/harness';
import { PERF } from '../src/perf/budgets';
import { genTasks } from '../src/perf/gen';
import { runQuery } from '../src/domain/query/engine';
import type { Query } from '../src/domain/query/types';

describe('Performance: Query', () => {
  it('should meet p95 performance budget for query operations', () => {
    // Generate deterministic test data
    const tasks = genTasks(PERF.query.n, 42);
    const page = { offset: 0, limit: 50 };
    const opts = { now: new Date('2025-08-15T10:00:00Z') };

    // Test 1: Empty text + filters
    const filterQuery: Query = {
      text: '',
      tags: ['urgent'],
      status: ['TODAY', 'LATER'],
      priority: ['P0', 'P1'],
    };
    const filterResult = timeIt(
      () => runQuery(tasks, filterQuery, page, opts),
      50
    );
    expect(filterResult.p95).toBeLessThanOrEqual(PERF.query.p95_ms!);

    // Test 2: Text search with two tokens
    const textQuery: Query = {
      text: 'performance test',
    };
    const textResult = timeIt(() => runQuery(tasks, textQuery, page, opts), 50);
    expect(textResult.p95).toBeLessThanOrEqual(PERF.query.p95_ms!);

    // Test 3: Date range filter
    const dateQuery: Query = {
      dueFrom: '2024-12-01T00:00:00Z',
      dueTo: '2025-02-01T00:00:00Z',
    };
    const dateResult = timeIt(() => runQuery(tasks, dateQuery, page, opts), 50);
    expect(dateResult.p95).toBeLessThanOrEqual(PERF.query.p95_ms!);
  });
});
