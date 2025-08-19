/**
 * Performance measurement harness
 */

export interface PerfResult {
  p50: number;
  p95: number;
  mean: number;
}

/**
 * Measure function performance over multiple runs
 */
export function timeIt<T>(fn: () => T, runs: number): PerfResult {
  // Warm up runs
  for (let i = 0; i < 5; i++) {
    fn();
  }

  // Collect timing data
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  // Sort for percentile calculation
  times.sort((a, b) => a - b);

  // Calculate statistics
  const p50Index = Math.floor(times.length * 0.5);
  const p95Index = Math.floor(times.length * 0.95);
  const sum = times.reduce((acc, time) => acc + time, 0);

  return {
    p50: times[p50Index],
    p95: times[p95Index],
    mean: sum / times.length,
  };
}
