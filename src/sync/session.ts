import type { RemoteTransport } from '../storage/remoteTypes';
import type { MergePolicy } from '../domain/pack/types';
import { useTaskStore } from '../stores/taskStore';
import { planSync } from './plan';
import { runSync, type SyncResult } from './run';

export interface SyncOptions {
  policy?: MergePolicy;
  dryRun?: boolean;
  sinceToken?: string;
}

/**
 * One-shot headless sync reconciliation.
 * Pull → merge → push workflow for event log sync.
 */
export async function syncOnce(
  transport: RemoteTransport,
  namespace: string,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const opts = { policy: 'remapIds' as const, dryRun: false, ...options };

  const currentTasks = Object.values(useTaskStore.getState().byId);
  const plan = await planSync(
    transport,
    namespace,
    currentTasks,
    opts.sinceToken,
    opts.policy
  );
  const result = await runSync(plan, transport, namespace, {
    dryRun: opts.dryRun,
  });

  // Hydrate store if changes were applied (and not dry run)
  if (!opts.dryRun && result.completed && result.mergeReport?.applied) {
    useTaskStore.getState().hydrate();
  }

  return result;
}
