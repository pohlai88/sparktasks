import { describe, it, expect, beforeEach } from 'vitest';
import { appendEvent, configureStorage } from '../src/domain/task/eventlog';
import { SyncLocalStorageDriver } from '../src/storage/local';
import type { TaskEvent } from '../src/domain/task/events';

class AtomicWriteTestDriver extends SyncLocalStorageDriver {
  private storage = new Map<string, string>();
  private setItemCallCount = 0;
  private removeItemCallCount = 0;

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.setItemCallCount++;
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.removeItemCallCount++;
    this.storage.delete(key);
  }

  listKeys(prefix: string): string[] {
    return Array.from(this.storage.keys()).filter(key =>
      key.startsWith(prefix)
    );
  }

  clear(): void {
    this.storage.clear();
    this.setItemCallCount = 0;
    this.removeItemCallCount = 0;
  }

  getStats() {
    return {
      setItemCalls: this.setItemCallCount,
      removeItemCalls: this.removeItemCallCount,
      storageKeys: Array.from(this.storage.keys()),
    };
  }
}

describe('EventLog: Atomic Writes', () => {
  let driver: AtomicWriteTestDriver;

  beforeEach(() => {
    driver = new AtomicWriteTestDriver();
    configureStorage('atomic-test', driver);
  });

  it('should use atomic write pattern (temp → swap → cleanup)', () => {
    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'test-task',
        title: 'Atomic test task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    const initialStats = driver.getStats();
    expect(initialStats.setItemCalls).toBe(0);
    expect(initialStats.removeItemCalls).toBe(0);

    appendEvent(event);

    const finalStats = driver.getStats();

    // Should make 2 setItem calls (temp + main) and 1 removeItem call (cleanup)
    expect(finalStats.setItemCalls).toBe(2);
    expect(finalStats.removeItemCalls).toBe(1);

    // Should only have the main key, not the temp key
    expect(finalStats.storageKeys).toContain('atomic-test:spark.events.v1');
    expect(finalStats.storageKeys).not.toContain(
      'atomic-test:spark.events.v1.tmp'
    );

    // Data should be correctly stored
    const storedData = driver.getItem('atomic-test:spark.events.v1');
    expect(storedData).toContain('Atomic test task');
  });

  it('should handle multiple events with atomic writes', () => {
    const events: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'task-1',
          title: 'First task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:01:00.000Z',
        payload: {
          id: 'task-2',
          title: 'Second task',
          status: 'TODAY',
          priority: 'P2',
          tags: [],
        },
      },
    ];

    events.forEach(event => appendEvent(event));

    const stats = driver.getStats();

    // Should make 4 setItem calls (2 temp + 2 main) and 2 removeItem calls
    expect(stats.setItemCalls).toBe(4);
    expect(stats.removeItemCalls).toBe(2);

    // Final storage should only contain main key
    expect(stats.storageKeys).toHaveLength(1);
    expect(stats.storageKeys[0]).toBe('atomic-test:spark.events.v1');

    // Data should contain both events
    const storedData = driver.getItem('atomic-test:spark.events.v1');
    expect(storedData).toContain('First task');
    expect(storedData).toContain('Second task');
  });
});
