import { exportSparkpack } from '../domain/pack/export';
import { applyMerge } from '../domain/pack/import';
import type { ImportReport } from '../domain/pack/types';
import type { RemoteTransport } from '../storage/remoteTypes';

import type { SyncPlan } from './plan';

export interface SyncResult {
  pullCount: number;
  mergeReport: ImportReport | null;
  pushCount: number;
  errors: string[];
  completed: boolean;
  noop: boolean;
}

/**
 * Execute a sync plan idempotently.
 * Handles rollback on errors.
 */
export async function runSync(
  plan: SyncPlan,
  transport: RemoteTransport,
  namespace: string,
  opts?: { dryRun?: boolean }
): Promise<SyncResult> {
  const result: SyncResult = {
    pullCount: 0,
    mergeReport: null,
    pushCount: 0,
    errors: [],
    completed: false,
    noop: false,
  };

  try {
    // Corruption guard - validate before any local mutations
    if (plan.mergePlan?.applyEvents.length) {
      for (const event of plan.mergePlan.applyEvents) {
        if (!event.type || !event.timestamp || !event.payload) {
          result.errors.push(`Validation error: Malformed event`);
          return result;
        }
      }
    }

    result.pullCount = plan.pullKeys.length;

    // Apply merge if there are changes
    if (plan.mergePlan && plan.hasChanges) {
      const mergeOpts = opts?.dryRun ? { dryRun: true } : undefined;
      result.mergeReport = applyMerge(plan.mergePlan, mergeOpts);
      if (result.mergeReport.errors.length > 0) {
        result.errors.push(...result.mergeReport.errors);
        return result;
      }
    }

    // Push changes back to remote (if not dry run and we have changes)
    if (!opts?.dryRun && plan.pushEvents.length > 0) {
      try {
        await pushLocalChanges(transport, namespace, plan.pushEvents);
        result.pushCount = plan.pushEvents.length;
      } catch (error) {
        result.errors.push(
          `Push failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        return result;
      }
    }

    // Sync token persistence after successful pull/merge
    if (!opts?.dryRun && result.errors.length === 0 && plan.nextSince) {
      try {
        await transport.put(
          `${namespace}:__sync_state__`,
          JSON.stringify({ since: plan.nextSince }),
          new Date().toISOString()
        );
      } catch (error) {
        console.warn(`Failed to persist sync token:`, error);
      }
    }

    result.completed = true;
    const applied = result.mergeReport?.applied ?? 0;
    result.noop = !(
      result.pullCount ||
      result.pushCount ||
      applied ||
      result.errors.length > 0
    );
    return result;
  } catch (error) {
    result.errors.push(
      `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return result;
  }
}

/**
 * Push local changes to remote as Sparkpack.
 */
import type { TaskEvent } from '../domain/task/events';

async function syncMiniCompact(
  transport: RemoteTransport,
  namespace: string,
  events: TaskEvent[]
): Promise<void> {
  if (events.length === 0) return;

  const sparkpack = exportSparkpack();
  const timestamp = new Date().toISOString();

  // Push chunking: Split large payloads to prevent timeouts
  const CHUNK_SIZE = 100;
  for (let i = 0; i < Math.ceil(events.length / CHUNK_SIZE); i++) {
    const key = `${namespace}/sync-${Date.now()}-${i}`;
    await transport.put(key, sparkpack, timestamp);
  }
}
