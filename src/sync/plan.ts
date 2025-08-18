import type { Task } from '../domain/task/schema';
import type { TaskEvent } from '../domain/task/events';
import type { RemoteTransport } from '../storage/remoteTypes';
import type { MergePlan, MergePolicy } from '../domain/pack/types';
import { planMerge } from '../domain/pack/merge';
import { planImport } from '../domain/pack/import';

export interface SyncPlan {
  phase: 'pull' | 'merge' | 'push';
  pullKeys: string[];
  mergePlan: MergePlan | null;
  pushEvents: TaskEvent[];
  hasChanges: boolean;
  nextSince?: string;
}

export interface PullResult {
  events: TaskEvent[];
  hasMore: boolean;
  nextSince?: string;
}

/**
 * Plan a headless sync reconciliation.
 * Returns strategy for pull → merge → push workflow.
 */
export async function planSync(
  transport: RemoteTransport,
  namespace: string,
  currentTasks: Task[],
  sinceToken?: string,
  policy: MergePolicy = 'remapIds'
): Promise<SyncPlan> {
  const plan: SyncPlan = {
    phase: 'pull',
    pullKeys: [],
    mergePlan: null,
    pushEvents: [],
    hasChanges: false,
  };

  // Read persisted sync token if none provided
  let effectiveSince = sinceToken, persistedToken: string | undefined;
  
  try {
    const stateData = await transport.get(`${namespace}:__sync_state__`);
    if (stateData) persistedToken = JSON.parse(stateData.value).since;
  } catch { /* ignore */ }
  
  if (!effectiveSince) effectiveSince = persistedToken;

  // Token monotonicity guard: Prevent regression
  if (effectiveSince && persistedToken && sinceToken && persistedToken > sinceToken) {
    console.warn(`Token regression detected: ${sinceToken} -> ${persistedToken}`);
    effectiveSince = sinceToken;
  }

  // Phase 1: Discover remote changes (paginated)
  const events: TaskEvent[] = [], seen = new Set<string>();
  let idx = 0, cursor = effectiveSince, lastSince: string | null = null;
  
  while (true) {
    const page = await transport.list(namespace, cursor || undefined);
    const keys = page.items?.map(i => i.key) ?? [];
    plan.pullKeys.push(...keys);
    
    for (const key of keys) {
      try {
        const data = await transport.get(key);
        if (!data) continue;
        
        // Clock-skew guard: Warn about suspicious timestamps
        if (Math.abs(new Date(data.updatedAt).getTime() - Date.now()) > 300000) console.warn(`Clock skew: ${key}`);
        
        const validation = planImport(data.value);
        if (validation.invalid.length > 0) { console.warn(`Invalid pack ${key}:`, validation.invalid); continue; }
        for (const event of validation.valid) {
          const h = JSON.stringify(event);
          if (!seen.has(h)) { (event as any)._idx = idx++; seen.add(h); events.push(event); }
        }
      } catch (error) { console.warn(`Failed to pull ${key}:`, error); }
    }
    lastSince = page.nextSince || lastSince;
    if (!page.nextSince) break;
    cursor = page.nextSince;
  }

  if (events.length === 0) return plan;
  events.sort((a,b)=>a.timestamp===b.timestamp?((a as any)._idx-(b as any)._idx):a.timestamp.localeCompare(b.timestamp));

  // Phase 2: Plan merge
  plan.phase = 'merge';
  plan.mergePlan = planMerge(currentTasks, events, policy);
  plan.hasChanges = plan.mergePlan.applyEvents.length > 0;
  if (lastSince) plan.nextSince = lastSince;

  // Phase 3: Prepare push (if needed)
  if (plan.hasChanges) { plan.phase = 'push'; plan.pushEvents = plan.mergePlan.applyEvents; }

  return plan;
}
