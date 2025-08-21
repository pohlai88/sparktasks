import type { TaskId } from '../../types/task';

import type { Task } from './schema';

export interface SnapshotMeta {
  version: 1;
  createdAt: string;
  baseEventCount: number;
  stateHash: string;
  hashVersion?: 1; // Future-proofing for hash algorithm changes
}

export interface Snapshot {
  meta: SnapshotMeta;
  tasks: Record<TaskId, Task>;
}

/**
 * Simple FNV-1a 32-bit hash implementation for state hashing
 */
function fnv1a32(str: string): string {
  let hash = 0x81_1c_9d_c5; // FNV offset basis (32-bit)

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01_00_01_93); // FNV prime (32-bit)
  }

  return (hash >>> 0).toString(16); // Convert to unsigned 32-bit hex
}

/**
 * Compute a stable hash of the tasks state by canonicalizing the JSON
 */
export function computeStateHash(tasks: Record<TaskId, Task>): string {
  // Sort tasks by ID for canonical ordering
  const sortedTasks = Object.fromEntries(
    Object.entries(tasks).sort(([a], [b]) => a.localeCompare(b))
  );

  // Canonicalize each task by sorting its properties and ensuring consistent structure
  const canonicalTasks = Object.fromEntries(
    Object.entries(sortedTasks).map(([id, task]) => {
      // IMPORTANT: Exclude time-variant metadata so semantically identical states
      // from different event sequences hash the same.
      // Keep tags sorted for stability.
      const canonicalTask = {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        // Optional fields - only include if present, with consistent ordering
        ...(task.dueDate && { dueDate: task.dueDate }),
        ...(task.notes && { notes: task.notes }),
        ...(task.snoozeUntil && { snoozeUntil: task.snoozeUntil }),
        ...(task.tags &&
          task.tags.length > 0 && { tags: [...task.tags].sort() }),
      };
      return [id, canonicalTask];
    })
  );

  const canonicalJson = JSON.stringify(canonicalTasks);
  return fnv1a32(canonicalJson);
}
