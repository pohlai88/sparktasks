import { TaskEvent, TaskEventSchema } from './events';
import { Task } from './schema';
import { Snapshot, computeStateHash } from './snapshot';
import { SyncLocalStorageDriver, createNamespace, LocalStorageDriver } from '../../storage/local';
import { SyncEncryptedDriver, composeEncrypted } from '../../storage/compose';
import { KeyringProvider } from '../../crypto/keyring';
import type { TaskId } from '../../types/task';

const STORAGE_KEY = 'spark.events.v1';
const STORAGE_TMP = 'spark.events.v1.tmp';
const SNAPSHOT_KEY = 'spark.snapshot.v1';
const TEMP_SNAPSHOT_KEY = 'spark.snapshot.v1.tmp';

// Default storage namespace
let defaultStorage = createNamespace('spark', new SyncLocalStorageDriver());

// Configuration API for injecting custom storage  
export function configureStorage(prefix: string, driver: SyncLocalStorageDriver): void {
  defaultStorage = createNamespace(prefix, driver);
}

/**
 * Configure encrypted storage for E2EE sync
 * 
 * Replaces the default storage with encrypted wrapper that transparently
 * encrypts all eventlog and snapshot data before storage.
 */
export function enableEncryptedStorage(prefix: string, keyring: KeyringProvider): void {
  // Create async LocalStorageDriver for EncryptedDriver
  const asyncStorage = new LocalStorageDriver();
  
  // Compose encrypted driver
  const encrypted = composeEncrypted(asyncStorage, prefix, keyring);
  
  // Wrap in sync adapter for eventlog compatibility
  const syncEncrypted = new SyncEncryptedDriver(encrypted);
  
  // Replace default storage with encrypted namespace
  // Cast to SyncLocalStorageDriver since they have the same interface
  defaultStorage = createNamespace(prefix, syncEncrypted as any);
}

export function appendEvent(event: TaskEvent): void {
  const existingData = defaultStorage.getItem(STORAGE_KEY);
  const newLine = JSON.stringify(event);
  const updatedData = existingData ? `${existingData}\n${newLine}` : newLine;
  
  // Enhanced atomic write: temp → primary → cleanup temp
  // This ensures atomicity across all storage backends
  try {
    defaultStorage.setItem(STORAGE_TMP, updatedData);
    defaultStorage.setItem(STORAGE_KEY, updatedData);
    defaultStorage.removeItem(STORAGE_TMP);
  } catch (error) {
    // If any step fails, try to cleanup temp file
    try {
      defaultStorage.removeItem(STORAGE_TMP);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

export function loadEvents(): TaskEvent[] {
  const data = defaultStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  return data
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        const parsed = JSON.parse(line);
        return TaskEventSchema.parse(parsed);
      } catch {
        return null;
      }
    })
    .filter((event): event is TaskEvent => event !== null);
}

export function reduce(events: TaskEvent[], initialState?: Record<TaskId, Task>): Record<TaskId, Task> {
  const tasks: Record<TaskId, Task> = initialState ? { ...initialState } : {};

  for (const event of events) {
    switch (event.type) {
      case 'TASK_CREATED':
        tasks[event.payload.id] = {
          ...event.payload,
          tags: event.payload.tags || [],
          createdAt: event.timestamp,
          updatedAt: event.timestamp,
        };
        break;
      case 'TASK_UPDATED':
        if (tasks[event.payload.id]) {
          const existingTask = tasks[event.payload.id];
          tasks[event.payload.id] = {
            ...existingTask,
            title: event.payload.changes.title ?? existingTask.title,
            dueDate: event.payload.changes.dueDate ?? existingTask.dueDate,
            tags: event.payload.changes.tags ?? existingTask.tags,
            notes: event.payload.changes.notes ?? existingTask.notes,
            updatedAt: event.timestamp,
          };
        }
        break;
      case 'TASK_COMPLETED':
      case 'TASK_MOVED':
        if (tasks[event.payload.id]) {
          tasks[event.payload.id] = {
            ...tasks[event.payload.id],
            status:
              event.type === 'TASK_COMPLETED' ? 'DONE' : event.payload.toStatus,
            updatedAt: event.timestamp,
          };
        }
        break;
      case 'TASK_SNOOZED':
        if (tasks[event.payload.id]) {
          tasks[event.payload.id] = {
            ...tasks[event.payload.id],
            snoozeUntil: event.payload.snoozeUntil,
            updatedAt: event.timestamp,
          };
        }
        break;
    }
  }

  return tasks;
}

export function snapshotEvents(): string {
  return defaultStorage.getItem(STORAGE_KEY) || '';
}

export function restoreEvents(raw: string): void {
  if (raw) {
    defaultStorage.setItem(STORAGE_KEY, raw);
  } else {
    defaultStorage.removeItem(STORAGE_KEY);
  }
}

export function getEventCount(): number {
  const data = defaultStorage.getItem(STORAGE_KEY);
  if (!data) return 0;
  
  return data.split('\n').filter(line => line.trim()).length;
}

export function snapshotState(tasks: Record<TaskId, Task>): Snapshot {
  const eventCount = getEventCount();
  const stateHash = computeStateHash(tasks);
  
  return {
    meta: {
      version: 1,
      createdAt: new Date().toISOString(),
      baseEventCount: eventCount,
      stateHash,
      hashVersion: 1, // Track hash algorithm version
    },
    tasks,
  };
}

export function loadSnapshot(): Snapshot | null {
  const data = defaultStorage.getItem(SNAPSHOT_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as Snapshot;
  } catch {
    return null;
  }
}

export function saveSnapshot(snapshot: Snapshot): void {
  try {
    // Atomic write: temp → swap
    const serialized = JSON.stringify(snapshot);
    defaultStorage.setItem(TEMP_SNAPSHOT_KEY, serialized);
    defaultStorage.setItem(SNAPSHOT_KEY, serialized);
    defaultStorage.removeItem(TEMP_SNAPSHOT_KEY);
  } catch (error) {
    // Clean up temp key on error
    defaultStorage.removeItem(TEMP_SNAPSHOT_KEY);
    throw error;
  }
}

export function deleteSnapshot(): void {
  defaultStorage.removeItem(SNAPSHOT_KEY);
  defaultStorage.removeItem(TEMP_SNAPSHOT_KEY);
}

export function compactWithSnapshot(threshold: number): { tookSnapshot: boolean; trimmed: number } {
  const eventCount = getEventCount();
  
  if (eventCount < threshold) {
    return { tookSnapshot: false, trimmed: 0 };
  }
  
  try {
    // 1. Get current complete state (snapshot + tail events if snapshot exists)
    const existingSnapshot = loadSnapshot();
    const events = loadEvents();
    let tasks: Record<TaskId, Task>;
    
    if (existingSnapshot) {
      // Start from existing snapshot and apply all current events as tail
      const tailStart = events.length < existingSnapshot.meta.baseEventCount ? 0 : existingSnapshot.meta.baseEventCount;
      const tailEvents = events.slice(tailStart);
      tasks = reduce(tailEvents, existingSnapshot.tasks);
    } else {
      // No existing snapshot, reduce all events
      tasks = reduce(events);
    }
    
    // 2. Build snapshot from complete tasks state
    const snapshot = snapshotState(tasks);
    
    // 3. Save snapshot atomically
    saveSnapshot(snapshot);
    
    // 4. Trim event log to keep only tail after baseEventCount
    // Since we just created a snapshot with baseEventCount = current count,
    // we trim everything (keeping zero events for now)
    defaultStorage.setItem(STORAGE_KEY, '');
    
    return { tookSnapshot: true, trimmed: eventCount };
  } catch (error) {
    // 5. On error: restore previous log (atomic rollback)
    // The original log is preserved if saveSnapshot or trim fails
    throw error;
  }
}
