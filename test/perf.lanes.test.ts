import { describe, it, expect } from 'vitest';
import { timeIt } from '../src/perf/harness';
import { PERF } from '../src/perf/budgets';
import { genTasks } from '../src/perf/gen';
import { selectToday, selectLater, selectDone } from '../src/stores/taskStore';

describe('Performance: Lanes', () => {
  it('should meet p95 performance budget for lane selectors', () => {
    // Generate deterministic test data
    const tasks = genTasks(PERF.lanes.n, 42);
    const byId = Object.fromEntries(tasks.map(task => [task.id, task]));
    const mockStore = { byId } as any;

    // Measure selectToday performance
    const todayResult = timeIt(() => selectToday(mockStore), 100);
    expect(todayResult.p95).toBeLessThanOrEqual(PERF.lanes.p95_ms!);

    // Measure selectLater performance
    const laterResult = timeIt(() => selectLater(mockStore), 100);
    expect(laterResult.p95).toBeLessThanOrEqual(PERF.lanes.p95_ms!);

    // Measure selectDone performance
    const doneResult = timeIt(() => selectDone(mockStore), 100);
    expect(doneResult.p95).toBeLessThanOrEqual(PERF.lanes.p95_ms!);
  });
});
