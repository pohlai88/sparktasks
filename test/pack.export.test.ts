import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { exportSparkpack } from '../src/domain/pack/export';
import {
  appendEvent,
  snapshotEvents,
  restoreEvents,
} from '../src/domain/task/eventlog';
import type { TaskEvent } from '../src/domain/task/events';
import type { Sparkpack } from '../src/domain/pack/types';

describe('Pack Export', () => {
  let originalSnapshot: string;

  beforeEach(() => {
    // Save original state
    originalSnapshot = snapshotEvents();
    // Clear events for clean test
    restoreEvents('');
  });

  afterEach(() => {
    // Restore original state
    restoreEvents(originalSnapshot);
  });

  it('should export valid sparkpack with meta and events', () => {
    // Add some test events
    const testEvents: TaskEvent[] = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'test-1',
          title: 'Test Task 1',
          status: 'TODAY',
          priority: 'P1',
          tags: ['test'],
        },
      },
      {
        type: 'TASK_COMPLETED',
        timestamp: '2025-08-15T11:00:00.000Z',
        payload: {
          id: 'test-1',
        },
      },
    ];

    // Add events to log
    testEvents.forEach(event => appendEvent(event));

    // Export
    const exported = exportSparkpack();
    const sparkpack: Sparkpack = JSON.parse(exported);

    // Verify structure
    expect(sparkpack).toHaveProperty('meta');
    expect(sparkpack).toHaveProperty('events');
    expect(sparkpack.meta.version).toBe(1);
    expect(sparkpack.meta.format).toBe('sparkpack/1+json');
    expect(sparkpack.meta.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
    expect(sparkpack.meta.eventsCount).toBe(2);
    expect(sparkpack.meta.eventsHash).toMatch(/^[0-9a-f]{8}$/);
    expect(sparkpack.events).toHaveLength(2);
    expect(sparkpack.events).toEqual(testEvents);
  });

  it('should export empty sparkpack when no events exist', () => {
    const exported = exportSparkpack();
    const sparkpack: Sparkpack = JSON.parse(exported);

    expect(sparkpack.meta.version).toBe(1);
    expect(sparkpack.meta.format).toBe('sparkpack/1+json');
    expect(sparkpack.meta.eventsCount).toBe(0);
    expect(sparkpack.meta.eventsHash).toMatch(/^[0-9a-f]{8}$/);
    expect(sparkpack.events).toEqual([]);
  });

  it('should not mutate storage during export', () => {
    // Add test event
    const testEvent: TaskEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'test-1',
        title: 'Test Task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };
    appendEvent(testEvent);

    const beforeSnapshot = snapshotEvents();
    exportSparkpack();
    const afterSnapshot = snapshotEvents();

    expect(afterSnapshot).toBe(beforeSnapshot);
  });
});
