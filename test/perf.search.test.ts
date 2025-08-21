import { describe, it, expect } from 'vitest';
import { timeIt } from '../src/perf/harness';
import { PERF } from '../src/perf/budgets';
import { genTasks } from '../src/perf/gen';
import { createSearchIndex } from '../src/domain/search/index';
import type { SearchQuery } from '../src/domain/search/types';
import type { TaskEvent } from '../src/domain/task/events';

describe('Performance: Search', () => {
  it('should meet p95 performance budget for search operations', () => {
    // Generate deterministic test data
    const tasks = genTasks(PERF.search.n, 42);
    const searchIndex = createSearchIndex();

    // Build index once
    const buildStart = performance.now();
    searchIndex.build(tasks);
    const buildTime = performance.now() - buildStart;
    expect(buildTime).toBeLessThanOrEqual(PERF.buildIndex.max_ms!);

    // Test 1: Search with tokens
    const tokenQuery: SearchQuery = { q: 'performance test' };
    const tokenResult = timeIt(() => searchIndex.search(tokenQuery), 100);
    expect(tokenResult.p95).toBeLessThanOrEqual(PERF.search.p95_ms!);

    // Test 2: Search with filters only
    const filterQuery: SearchQuery = {
      status: ['TODAY', 'LATER'],
      priority: ['P1'],
      tags: ['urgent'],
    };
    const filterResult = timeIt(() => searchIndex.search(filterQuery), 100);
    expect(filterResult.p95).toBeLessThanOrEqual(PERF.search.p95_ms!);

    // Test 3: Incremental updates performance
    const updateEvents: TaskEvent[] = [];
    for (let i = 0; i < 200; i++) {
      const taskIndex = i % tasks.length;
      const task = tasks[taskIndex]!; // Safe because tasks.length > 0
      updateEvents.push({
        type: 'TASK_UPDATED',
        timestamp: new Date().toISOString(),
        payload: {
          id: task.id,
          changes: {
            title: `Updated Task ${i}`,
            tags: ['updated'],
          },
        },
      });
    }

    // Use deterministic event selection to avoid random behavior
    let eventIndex = 0;
    const updateResult = timeIt(() => {
      const event = updateEvents[eventIndex % updateEvents.length]!; // Safe because length > 0
      eventIndex++;
      searchIndex.updateFromEvent(event);
    }, 100);
    expect(updateResult.p95).toBeLessThanOrEqual(PERF.searchUpdate.p95_ms!);
  });
});
