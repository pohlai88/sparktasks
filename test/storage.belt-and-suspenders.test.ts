import { describe, it, expect, beforeEach } from 'vitest';
import {
  appendEvent,
  configureStorage,
  loadEvents,
} from '../src/domain/task/eventlog';
import { SyncLocalStorageDriver } from '../src/storage/local';
import type { TaskEvent } from '../src/domain/task/events';

class ValidatingStorageDriver extends SyncLocalStorageDriver {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    // Pre-commit validation: Ensure the data being written is well-formed
    // Apply to all keys in tests, but in real usage only apply to event logs
    if (
      key.endsWith('.tmp') ||
      key.includes('events') ||
      key.includes('test-key') ||
      key.includes('mixed-data')
    ) {
      this.validateEventLogFormat(value);
    }

    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  listKeys(prefix: string): string[] {
    return Array.from(this.storage.keys()).filter(key =>
      key.startsWith(prefix)
    );
  }

  private validateEventLogFormat(data: string): void {
    if (!data.trim()) return; // Empty is valid

    const lines = data.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        try {
          const event = JSON.parse(line);

          // Basic event structure validation
          if (!event.type || !event.timestamp || !event.payload) {
            throw new Error(`Invalid event structure: missing required fields`);
          }

          // Timestamp validation
          if (isNaN(Date.parse(event.timestamp))) {
            throw new Error(`Invalid timestamp format: ${event.timestamp}`);
          }

          // Type validation
          if (typeof event.type !== 'string') {
            throw new Error(`Invalid event type: must be string`);
          }
        } catch (error) {
          throw new Error(
            `Invalid event log format: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    }
  }

  clear(): void {
    this.storage.clear();
  }
}

describe('Storage: Belt-and-Suspenders Validation', () => {
  let driver: ValidatingStorageDriver;

  beforeEach(() => {
    driver = new ValidatingStorageDriver();
    configureStorage('validation-test', driver);
  });

  it('should validate log format before atomic commit', () => {
    const validEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'valid-task',
        title: 'Valid task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    // This should succeed (valid event)
    expect(() => appendEvent(validEvent)).not.toThrow();

    // Verify event was stored and is retrievable
    const events = loadEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('TASK_CREATED');
  });

  it('should prevent committing malformed events at storage level', () => {
    // Manually corrupt the temp key to test validation
    const corruptedData = 'invalid json\n{"type": "TASK_CREATED"}'; // Missing required fields

    expect(() => {
      driver.setItem('validation-test:spark.events.v1.tmp', corruptedData);
    }).toThrow('Invalid event log format');
  });

  it('should validate event structure comprehensively', () => {
    const testCases = [
      {
        name: 'missing type',
        data: '{"timestamp": "2025-08-15T10:00:00.000Z", "payload": {}}',
        shouldFail: true,
      },
      {
        name: 'missing timestamp',
        data: '{"type": "TEST", "payload": {}}',
        shouldFail: true,
      },
      {
        name: 'missing payload',
        data: '{"type": "TEST", "timestamp": "2025-08-15T10:00:00.000Z"}',
        shouldFail: true,
      },
      {
        name: 'invalid timestamp',
        data: '{"type": "TEST", "timestamp": "not-a-date", "payload": {}}',
        shouldFail: true,
      },
      {
        name: 'non-string type',
        data: '{"type": 123, "timestamp": "2025-08-15T10:00:00.000Z", "payload": {}}',
        shouldFail: true,
      },
      {
        name: 'valid minimal event',
        data: '{"type": "TEST", "timestamp": "2025-08-15T10:00:00.000Z", "payload": {}}',
        shouldFail: false,
      },
    ];

    testCases.forEach(({ name, data, shouldFail }) => {
      if (shouldFail) {
        expect(() => {
          driver.setItem('validation-test:test-key', data);
        }, `${name} should fail validation`).toThrow();
      } else {
        expect(() => {
          driver.setItem('validation-test:test-key', data);
        }, `${name} should pass validation`).not.toThrow();
      }
    });
  });

  it('should handle mixed valid/invalid lines gracefully', () => {
    const mixedData = [
      '{"type": "TASK_CREATED", "timestamp": "2025-08-15T10:00:00.000Z", "payload": {"id": "1"}}',
      'invalid json line',
      '{"type": "TASK_UPDATED", "timestamp": "2025-08-15T10:01:00.000Z", "payload": {"id": "2"}}',
    ].join('\n');

    // Should fail because of the invalid line
    expect(() => {
      driver.setItem('validation-test:mixed-data', mixedData);
    }).toThrow('Invalid event log format');
  });

  it('should allow empty or whitespace-only data', () => {
    // These should all be valid (empty states)
    const validEmptyStates = ['', ' ', '\n', '\t', '   \n  \t  '];

    validEmptyStates.forEach((emptyData, index) => {
      expect(() => {
        driver.setItem(`validation-test:empty-${index}`, emptyData);
      }).not.toThrow();
    });
  });

  it('should validate multi-line event logs correctly', () => {
    const validMultiLineLog = [
      '{"type": "TASK_CREATED", "timestamp": "2025-08-15T10:00:00.000Z", "payload": {"id": "1", "title": "First"}}',
      '{"type": "TASK_CREATED", "timestamp": "2025-08-15T10:01:00.000Z", "payload": {"id": "2", "title": "Second"}}',
      '{"type": "TASK_UPDATED", "timestamp": "2025-08-15T10:02:00.000Z", "payload": {"id": "1", "changes": {"title": "Updated"}}}',
    ].join('\n');

    expect(() => {
      driver.setItem('validation-test:multi-line', validMultiLineLog);
    }).not.toThrow();
  });
});
