/**
 * Deterministic data generator for performance testing
 */

import type { Task } from '../domain/task/schema';

// Simple xorshift32 PRNG for deterministic data generation
class Xorshift32 {
  private state: number;

  constructor(seed: number = 1) {
    this.state = seed === 0 ? 1 : seed; // Avoid zero state
  }

  next(): number {
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    return (this.state >>> 0) / 0x1_00_00_00_00; // Convert to [0, 1)
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(array.length)];
  }
}

const STATUSES = ['TODAY', 'LATER', 'DONE'] as const;
const PRIORITIES = ['P0', 'P1', 'P2'] as const;
const TAG_POOL = [
  'urgent',
  'bug',
  'feature',
  'docs',
  'test',
  'refactor',
  'auth',
  'api',
  'ui',
  'db',
  'perf',
  'security',
  'mobile',
  'web',
  'backend',
  'frontend',
  'ci',
  'deploy',
];

/**
 * Generate deterministic tasks for performance testing
 */
export function genTasks(count: number, seed = 1): Task[] {
  const rng = new Xorshift32(seed);
  const tasks: Task[] = [];
  const baseTime = new Date('2025-01-01T00:00:00Z').getTime();

  for (let i = 0; i < count; i++) {
    const id = `perf_task_${i.toString().padStart(6, '0')}`;

    // Monotonically increasing timestamps
    const createdAt = new Date(baseTime + i * 60_000).toISOString(); // 1 min apart
    const updatedAt = new Date(
      baseTime + i * 60_000 + rng.nextInt(3_600_000)
    ).toISOString(); // up to 1hr later

    // Status distribution: ~40% TODAY, ~40% LATER, ~20% DONE
    let status: (typeof STATUSES)[number];
    const statusRand = rng.next();
    if (statusRand < 0.4) {
      status = 'TODAY';
    } else if (statusRand < 0.8) {
      status = 'LATER';
    } else {
      status = 'DONE';
    }

    // Priority skewed toward P1
    let priority: (typeof PRIORITIES)[number];
    const priorityRand = rng.next();
    if (priorityRand < 0.2) {
      priority = 'P0';
    } else if (priorityRand < 0.7) {
      priority = 'P1';
    } else {
      priority = 'P2';
    }

    // Tags: 0-3 from pool
    const tagCount = rng.nextInt(4); // 0, 1, 2, or 3 tags
    const tags: string[] = [];
    const usedIndices = new Set<number>();
    for (let j = 0; j < tagCount; j++) {
      let tagIndex;
      do {
        tagIndex = rng.nextInt(TAG_POOL.length);
      } while (usedIndices.has(tagIndex));
      usedIndices.add(tagIndex);
      tags.push(TAG_POOL[tagIndex]);
    }

    // Optional dueDate/snoozeUntil
    let dueDate: string | undefined;
    let snoozeUntil: string | undefined;

    if (rng.next() < 0.3) {
      // 30% have dueDate
      const dueDays = rng.nextInt(30) - 10; // -10 to +20 days from base
      dueDate = new Date(baseTime + dueDays * 86_400_000).toISOString();
    }

    if (rng.next() < 0.1) {
      // 10% have snoozeUntil
      const snoozeDays = rng.nextInt(7); // 0 to 7 days from base
      snoozeUntil = new Date(baseTime + snoozeDays * 86_400_000).toISOString();
    }

    const task: Task = {
      id,
      title: `Performance Test Task ${i + 1}`,
      notes:
        rng.next() < 0.6
          ? `Generated task with ID ${id} for performance testing`
          : undefined,
      status,
      priority,
      tags,
      createdAt,
      updatedAt,
      dueDate,
      snoozeUntil,
    };

    tasks.push(task);
  }

  return tasks;
}
