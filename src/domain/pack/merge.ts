import type { Task } from '../task/schema';
import type { TaskEvent } from '../task/events';
import type { MergePolicy, MergePlan } from './types';

// Generate unique ID for remapping
let remapCounter = 0;
const generateRemapId = (): string => `imp_${Date.now()}_${++remapCounter}`;

// Helper to remap ID in event payload
function remapEventId(event: TaskEvent, newId: string): TaskEvent {
  switch (event.type) {
    case 'TASK_CREATED':
      return {
        ...event,
        payload: { ...event.payload, id: newId }
      };
    case 'TASK_UPDATED':
      return {
        ...event,
        payload: { ...event.payload, id: newId }
      };
    case 'TASK_COMPLETED':
      return {
        ...event,
        payload: { ...event.payload, id: newId }
      };
    case 'TASK_SNOOZED':
      return {
        ...event,
        payload: { ...event.payload, id: newId }
      };
    case 'TASK_MOVED':
      return {
        ...event,
        payload: { ...event.payload, id: newId }
      };
    default:
      // This should never happen due to discriminated union
      return event;
  }
}

export function planMerge(
  currentTasks: Task[],
  packEvents: TaskEvent[],
  policy: MergePolicy = 'remapIds'
): MergePlan {
  const plan: MergePlan = {
    policy,
    conflicts: [],
    idMap: {},
    applyEvents: [],
  };

  // Get existing task IDs for conflict detection
  const existingTaskIds = new Set(currentTasks.map(task => task.id));
  
  // Track task creation events and last timestamps for monotonic validation
  const taskCreations = new Set<string>();
  const lastTimestamps = new Map<string, string>(); // taskId -> last timestamp
  
  // Initialize with existing tasks' latest timestamps (approximate)
  for (const task of currentTasks) {
    lastTimestamps.set(task.id, task.updatedAt);
  }

  // Process events in order
  const processedEvents: TaskEvent[] = [];
  
  for (const event of packEvents) {
    const taskId = event.payload.id;
    let shouldInclude = true;
    let eventToProcess = event;

    // Monotonic timestamp validation
    const lastTimestamp = lastTimestamps.get(taskId);
    if (lastTimestamp && event.timestamp <= lastTimestamp) {
      plan.conflicts.push({
        taskId,
        reason: 'timestamp-regression',
        details: `Event timestamp ${event.timestamp} <= last timestamp ${lastTimestamp}`
      });
      
      if (policy === 'skipExisting') {
        shouldInclude = false;
      } else {
        // Auto-adjust timestamp to be 1ms after last timestamp
        const adjustedTimestamp = new Date(new Date(lastTimestamp).getTime() + 1).toISOString();
        eventToProcess = { ...event, timestamp: adjustedTimestamp };
      }
    }

    if (event.type === 'TASK_CREATED') {
      // Mark this task as created
      taskCreations.add(taskId);
      
      if (existingTaskIds.has(taskId)) {
        // ID conflict detected
        plan.conflicts.push({ taskId, reason: 'id-conflict' });

        if (policy === 'skipExisting') {
          shouldInclude = false;
        } else if (policy === 'overwriteIfNewer') {
          // For now, allow - timestamp comparison would need existing event data
          // In real implementation, we'd check if pack timestamp > existing.updatedAt
          shouldInclude = true;
        } else if (policy === 'remapIds') {
          // Generate new ID and add to map
          const newId = generateRemapId();
          plan.idMap[taskId] = newId;
          
          // Rewrite this event's payload
          const processedEvent = remapEventId(eventToProcess, newId);
          processedEvents.push(processedEvent);
          
          // Track creation and timestamp for the new ID
          taskCreations.add(newId);
          lastTimestamps.set(newId, processedEvent.timestamp);
          shouldInclude = false; // Already added
        }
      } else {
        // No conflict, track creation normally
        if (shouldInclude) {
          lastTimestamps.set(taskId, eventToProcess.timestamp);
        }
      }
    } else {
      // Non-CREATE events: check for orphan events
      const effectiveTaskId = plan.idMap[taskId] || taskId;
      
      // Check if task was created in current tasks or in pack events so far
      const hasExistingTask = existingTaskIds.has(taskId);
      const hasPackCreation = taskCreations.has(effectiveTaskId);
      
      if (!hasExistingTask && !hasPackCreation) {
        // Orphan event - references task that doesn't exist
        plan.conflicts.push({
          taskId,
          reason: 'orphan-event',
          details: `Event references task '${taskId}' with no prior TASK_CREATED`
        });
        
        if (policy === 'skipExisting') {
          shouldInclude = false;
        }
        // Note: For other policies, we still include the event but flag it
      }
      
      // Check if we need to remap the ID
      if (plan.idMap[taskId]) {
        // Remap the ID in the payload
        const processedEvent = remapEventId(eventToProcess, plan.idMap[taskId]);
        processedEvents.push(processedEvent);
        
        // Update timestamp tracking for remapped ID
        lastTimestamps.set(plan.idMap[taskId], processedEvent.timestamp);
        shouldInclude = false; // Already added
      } else if (shouldInclude) {
        // Update timestamp tracking for original ID
        lastTimestamps.set(taskId, eventToProcess.timestamp);
      }
    }

    if (shouldInclude) {
      processedEvents.push(eventToProcess);
    }
  }

  plan.applyEvents = processedEvents;
  return plan;
}
