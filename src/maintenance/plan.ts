/**
 * Maintenance planner - analyzes current state and creates maintenance plan
 */

import { MaintenancePlan, MaintenanceOptions } from './types';
import { getEventCount } from '../domain/task/eventlog';

/**
 * Plan maintenance operations based on current state and options
 */
export async function planMaintenance(
  opts: MaintenanceOptions
): Promise<MaintenancePlan> {
  const actions: MaintenancePlan['actions'] = [];

  // Check if compaction is needed
  if (opts.maxEvents !== undefined) {
    const eventCount = getEventCount();
    if (eventCount >= opts.maxEvents) {
      actions.push({
        type: 'COMPACT',
        threshold: opts.minDelta || 50,
      });
    }
  }

  // Add rekey action if prefix specified
  if (opts.rekeyPrefix) {
    actions.push({
      type: 'REKEY',
      prefix: opts.rekeyPrefix,
      batchSize: opts.batchSize || 100,
    });
  }

  // Add sweep action if prefix specified
  if (opts.sweepPrefix) {
    const sweepAction: {
      type: 'SWEEP';
      prefix: string;
      fix: boolean;
      sample?: number;
    } = {
      type: 'SWEEP',
      prefix: opts.sweepPrefix,
      fix: opts.sweepFix || false,
    };
    if (opts.sample !== undefined) {
      sweepAction.sample = opts.sample;
    }
    actions.push(sweepAction);
  }

  return { actions };
}
