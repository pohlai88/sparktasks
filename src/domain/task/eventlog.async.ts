// Async facade for the event log so encrypted StorageDriver can be used without hacks.
// Non-breaking: this file is additive; existing sync API remains unchanged.

import type { TaskId } from '../../types/task';
import type { Task } from './schema';
import type { TaskEvent } from './events';
import { TaskEventSchema } from './events';
import { reduce as reduceSync } from './eventlog'; // pure reducer we can reuse
import type { Snapshot } from './snapshot';

// Keep keys identical to sync implementation
const STORAGE_KEY = 'spark.events.v1';
const SNAPSHOT_KEY = 'spark.snapshot.v1';

// Minimal StorageDriver shape (matches your Phase B Task 1)
export interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  listKeys?(prefix: string): Promise<string[]>;
}

let driver: StorageDriver | null = null;
export function setAsyncEventlogStorage(d: StorageDriver) {
  driver = d;
}

function mustDriver(): StorageDriver {
  if (!driver) throw new Error('Async eventlog storage not configured');
  return driver;
}

function parseEvents(raw: string | null): TaskEvent[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      try {
        const obj = JSON.parse(l);
        return TaskEventSchema.parse(obj);
      } catch {
        return null;
      }
    })
    .filter((e): e is TaskEvent => e !== null);
}

function serializeEvents(events: TaskEvent[]): string {
  return events.map(e => JSON.stringify(e)).join('\n');
}

export async function appendEventAsync(event: TaskEvent): Promise<void> {
  const d = mustDriver();
  const cur = await d.getItem(STORAGE_KEY);
  const line = JSON.stringify(TaskEventSchema.parse(event));
  const next = cur && cur.length ? `${cur}\n${line}` : line;
  await d.setItem(STORAGE_KEY, next);
}

export async function loadEventsAsync(): Promise<TaskEvent[]> {
  const d = mustDriver();
  const raw = await d.getItem(STORAGE_KEY);
  return parseEvents(raw);
}

export async function snapshotEventsAsync(): Promise<string> {
  const d = mustDriver();
  return (await d.getItem(STORAGE_KEY)) ?? '';
}

export async function restoreEventsAsync(raw: string): Promise<void> {
  const d = mustDriver();
  await d.setItem(STORAGE_KEY, raw);
}

export async function getEventCountAsync(): Promise<number> {
  const d = mustDriver();
  const raw = await d.getItem(STORAGE_KEY);
  if (!raw) return 0;
  return raw.split('\n').filter(l => l.trim()).length;
}

export async function loadSnapshotAsync(): Promise<Snapshot | null> {
  const d = mustDriver();
  const raw = await d.getItem(SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export async function saveSnapshotAsync(snap: Snapshot): Promise<void> {
  const d = mustDriver();
  await d.setItem(SNAPSHOT_KEY, JSON.stringify(snap));
}

// Reduce using the existing pure reducer, but allow initial state
export function reduce(events: TaskEvent[], initial?: Record<TaskId, Task>) {
  return reduceSync(events, initial);
}
