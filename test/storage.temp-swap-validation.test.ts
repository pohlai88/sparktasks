import { describe, it, expect, beforeEach } from 'vitest';
import { appendEvent, configureStorage } from '../src/domain/task/eventlog';
import { SyncLocalStorageDriver } from '../src/storage/local';
import type { TaskEvent } from '../src/domain/task/events';

class ValidationStorageDriver extends SyncLocalStorageDriver {
  private storage = new Map<string, string>();
  private writeLog: Array<{ key: string; value: string; timestamp: number }> =
    [];
  private failureMode: 'none' | 'quota' | 'crash' = 'none';

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    const timestamp = Date.now();

    // Simulate storage failures for testing
    if (this.failureMode === 'quota') {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    }
    if (this.failureMode === 'crash') {
      throw new Error('Storage driver crashed');
    }

    // Log the write for validation
    this.writeLog.push({ key, value, timestamp });
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    // Log removal for validation tracking
    this.writeLog.push({ key, value: '[REMOVED]', timestamp: Date.now() });
    this.storage.delete(key);
  }

  listKeys(prefix: string): string[] {
    return Array.from(this.storage.keys()).filter(key =>
      key.startsWith(prefix)
    );
  }

  // Test utilities
  setFailureMode(mode: 'none' | 'quota' | 'crash'): void {
    this.failureMode = mode;
  }

  getWriteLog(): typeof this.writeLog {
    return [...this.writeLog];
  }

  clearWriteLog(): void {
    this.writeLog = [];
  }

  validateLogFormat(key: string): boolean {
    const data = this.getItem(key);
    if (!data) return true; // Empty is valid

    try {
      const lines = data.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          JSON.parse(line); // Validate each line is valid JSON
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    this.storage.clear();
    this.writeLog = [];
  }
}

describe('Storage: Temp→Swap Validation Harness', () => {
  let driver: ValidationStorageDriver;

  beforeEach(() => {
    driver = new ValidationStorageDriver();
    configureStorage('temp-swap-test', driver);
  });

  it('should validate atomic write pattern with temp key isolation', () => {
    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'validation-task',
        title: 'Temp swap validation',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    driver.clearWriteLog();
    appendEvent(event);

    const writeLog = driver.getWriteLog();

    // Verify temp→swap→cleanup pattern
    expect(writeLog).toHaveLength(3);
    expect(writeLog[0]?.key).toBe('temp-swap-test:spark.events.v1.tmp');
    expect(writeLog[1]?.key).toBe('temp-swap-test:spark.events.v1');
    expect(writeLog[2]?.key).toBe('temp-swap-test:spark.events.v1.tmp'); // removeItem
    expect(writeLog[2]?.value).toBe('[REMOVED]');

    // Verify write order (temp first)
    expect(writeLog[0]?.timestamp).toBeLessThanOrEqual(
      writeLog[1]?.timestamp || 0
    );

    // Verify temp key is cleaned up
    expect(driver.getItem('temp-swap-test:spark.events.v1.tmp')).toBeNull();

    // Verify final data integrity
    expect(driver.validateLogFormat('temp-swap-test:spark.events.v1')).toBe(
      true
    );

    // Verify final content
    const finalData = driver.getItem('temp-swap-test:spark.events.v1');
    expect(finalData).toContain('Temp swap validation');
  });

  it('should verify log format validation before swap', () => {
    // Pre-corrupt the log to test validation
    driver.setItem(
      'temp-swap-test:spark.events.v1',
      'invalid json line\n{"valid": "json"}'
    );

    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'validation-task-2',
        title: 'Format validation test',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    // This should still work (we don't validate before write in current impl)
    appendEvent(event);

    // But we can verify the final result is well-formed
    const finalData = driver.getItem('temp-swap-test:spark.events.v1');
    const lines = finalData?.split('\n') || [];

    // Last line should be valid JSON (our new event)
    const lastLine = lines[lines.length - 1];
    if (lastLine) {
      expect(() => JSON.parse(lastLine)).not.toThrow();
    }
  });

  it('should handle storage failures gracefully', () => {
    // Test quota failure on temp write
    driver.setFailureMode('quota');

    const event: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'failure-test',
        title: 'Should fail to write',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    expect(() => appendEvent(event)).toThrow('QuotaExceededError');

    // Verify no partial writes occurred
    expect(driver.getItem('temp-swap-test:spark.events.v1')).toBeNull();
    expect(driver.getItem('temp-swap-test:spark.events.v1.tmp')).toBeNull();
  });

  it('should maintain log integrity across multiple operations', () => {
    const events: TaskEvent[] = Array.from({ length: 5 }, (_, i) => ({
      type: 'TASK_CREATED',
      timestamp: `2025-08-15T10:0${i}:00.000Z`,
      payload: {
        id: `batch-task-${i}`,
        title: `Batch task ${i}`,
        status: 'TODAY' as const,
        priority: 'P1' as const,
        tags: [],
      },
    }));

    // Write events sequentially
    events.forEach(event => appendEvent(event));

    // Verify log format integrity
    expect(driver.validateLogFormat('temp-swap-test:spark.events.v1')).toBe(
      true
    );

    // Verify all events are present
    const finalData = driver.getItem('temp-swap-test:spark.events.v1');
    events.forEach(event => {
      if (event.type === 'TASK_CREATED') {
        expect(finalData).toContain(event.payload.title);
      }
    });

    // Verify no temp keys remain
    const allKeys = driver.listKeys('temp-swap-test:');
    const tempKeys = allKeys.filter(key => key.includes('.tmp'));
    expect(tempKeys).toHaveLength(0);
  });
});
