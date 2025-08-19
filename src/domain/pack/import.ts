import { TaskEventSchema } from '../task/events';
import { appendEvent, snapshotEvents, restoreEvents } from '../task/eventlog';
import { useTaskStore } from '../../stores/taskStore';
import { planMerge } from './merge';
import type {
  Sparkpack,
  ImportPlan,
  ImportReport,
  MergePlan,
  MergePolicy,
} from './types';

// tiny hash, no deps
const fnv1a = (s: string) => {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return ('00000000' + h.toString(16)).slice(-8);
};

export function planImport(raw: string): ImportPlan {
  const plan: ImportPlan = {
    valid: [],
    invalid: [],
  };

  try {
    const sparkpack: Sparkpack = JSON.parse(raw);

    // Validate pack integrity
    if (
      !sparkpack.meta ||
      sparkpack.meta.version !== 1 ||
      sparkpack.meta.format !== 'sparkpack/1+json'
    ) {
      plan.invalid.push({
        index: -1,
        error: 'Unsupported pack version/format',
      });
      return plan;
    }

    if (!sparkpack.events || !Array.isArray(sparkpack.events)) {
      plan.invalid.push({
        index: -1,
        error: 'Invalid sparkpack format: missing or invalid events array',
      });
      return plan;
    }

    if (sparkpack.meta.eventsCount !== sparkpack.events.length) {
      plan.invalid.push({ index: -1, error: 'eventsCount mismatch' });
      return plan;
    }

    const rawEvents = sparkpack.events.map(e => JSON.stringify(e)).join('\n');
    if (sparkpack.meta.eventsHash !== fnv1a(rawEvents)) {
      plan.invalid.push({ index: -1, error: 'eventsHash mismatch' });
      return plan;
    }

    // Validate individual events
    sparkpack.events.forEach((event, index) => {
      try {
        const validatedEvent = TaskEventSchema.parse(event);
        plan.valid.push(validatedEvent);
      } catch (error) {
        plan.invalid.push({
          index,
          error:
            error instanceof Error ? error.message : 'Unknown validation error',
        });
      }
    });
  } catch (error) {
    plan.invalid.push({
      index: -1,
      error: error instanceof Error ? error.message : 'Failed to parse JSON',
    });
  }

  return plan;
}

export function applyImport(
  plan: ImportPlan,
  opts?: { dryRun?: boolean }
): ImportReport {
  const report: ImportReport = {
    applied: 0,
    skipped: plan.invalid.length,
    errors: plan.invalid.map(inv => `Event ${inv.index}: ${inv.error}`),
  };

  if (opts?.dryRun) {
    report.applied = plan.valid.length;
    return report;
  }

  // Take snapshot for rollback
  const snapshot = snapshotEvents();

  try {
    // Apply all valid events
    for (const event of plan.valid) {
      appendEvent(event);
      report.applied++;
    }

    // Hydrate the store with new state
    useTaskStore.getState().hydrate();
  } catch (error) {
    // Restore snapshot on any error
    restoreEvents(snapshot);
    report.errors.push(
      `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    report.applied = 0;
  }

  return report;
}

export function planMergeImport(
  raw: string,
  policy: MergePolicy = 'remapIds'
): MergePlan | { error: string } {
  try {
    // First, plan the basic import
    const importPlan = planImport(raw);
    if (importPlan.invalid.length > 0) {
      return {
        error: `Invalid events in sparkpack: ${importPlan.invalid.map(i => i.error).join(', ')}`,
      };
    }

    // Get current tasks for conflict detection
    const currentTasks = Object.values(useTaskStore.getState().byId);

    // Plan the merge
    const mergePlan = planMerge(currentTasks, importPlan.valid, policy);
    return mergePlan;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function applyMerge(
  plan: MergePlan,
  opts?: { dryRun?: boolean }
): ImportReport {
  const report: ImportReport = {
    applied: 0,
    skipped: 0,
    errors: [],
  };

  if (opts?.dryRun) {
    report.applied = plan.applyEvents.length;
    return report;
  }

  // Take snapshot for rollback
  const snapshot = snapshotEvents();

  try {
    // Apply all planned events
    for (const event of plan.applyEvents) {
      appendEvent(event);
      report.applied++;
    }

    // Hydrate the store with new state
    useTaskStore.getState().hydrate();
  } catch (error) {
    // Restore snapshot on any error
    restoreEvents(snapshot);
    report.errors.push(
      `Merge failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    report.applied = 0;
  }

  return report;
}
