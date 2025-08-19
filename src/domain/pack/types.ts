import type { TaskEvent } from '../task/events';
// Pack types for import/export and merge operations

export interface SparkpackMeta {
  version: 1;
  format: 'sparkpack/1+json';
  createdAt: string;
  eventsCount: number;
  eventsHash: string; // fnv1a-32 hex
}

export interface Sparkpack {
  meta: SparkpackMeta;
  events: TaskEvent[];
}

export interface ImportPlan {
  valid: TaskEvent[];
  invalid: { index: number; error: string }[];
}

export interface ImportReport {
  applied: number;
  skipped: number;
  errors: string[];
}

export type MergePolicy = 'skipExisting' | 'overwriteIfNewer' | 'remapIds';

export interface MergePlan {
  policy: MergePolicy;
  conflicts: {
    taskId: string;
    reason: 'id-conflict' | 'timestamp-regression' | 'orphan-event';
    details?: string;
  }[];
  idMap: Record<string, string>; // oldId -> newId (when remapping)
  applyEvents: TaskEvent[]; // events after any ID rewrite
}

export interface MergeReport {
  applied: number;
  skipped: number;
  remapped: number;
  errors: string[];
}
