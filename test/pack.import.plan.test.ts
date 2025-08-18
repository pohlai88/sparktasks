import { describe, it, expect } from 'vitest';
import { planImport } from '../src/domain/pack/import';

// Helper to create valid meta with integrity fields
const createValidMeta = (events: any[]) => {
  const rawEvents = events.map(e => JSON.stringify(e)).join('\n');
  // Simple FNV-1a hash
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < rawEvents.length; i++) {
    h ^= rawEvents.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const eventsHash = ('00000000' + h.toString(16)).slice(-8);
  
  return {
    version: 1 as const,
    format: 'sparkpack/1+json' as const,
    createdAt: '2025-08-15T10:00:00.000Z',
    eventsCount: events.length,
    eventsHash,
  };
};

describe('Pack Import Planning', () => {
  it('should validate and separate valid and invalid events', () => {
    const validEvent = {
      type: 'TASK_CREATED',
      timestamp: '2025-08-15T10:00:00.000Z',
      payload: {
        id: 'test-1',
        title: 'Valid Task',
        status: 'TODAY',
        priority: 'P1',
        tags: [],
      },
    };

    const invalidEvent = {
      type: 'INVALID_TYPE',
      timestamp: 'invalid-date',
      payload: {},
    };

    const sparkpack = {
      meta: createValidMeta([validEvent, invalidEvent]),
      events: [validEvent, invalidEvent],
    };

    const plan = planImport(JSON.stringify(sparkpack));

    expect(plan.valid).toHaveLength(1);
    expect(plan.valid[0]).toEqual(validEvent);
    expect(plan.invalid).toHaveLength(1);
    expect(plan.invalid[0]!.index).toBe(1);
    expect(plan.invalid[0]!.error).toContain('Invalid discriminator value');
  });

  it('should handle malformed JSON', () => {
    const plan = planImport('invalid json');

    expect(plan.valid).toHaveLength(0);
    expect(plan.invalid).toHaveLength(1);
    expect(plan.invalid[0]!.index).toBe(-1);
    expect(plan.invalid[0]!.error).toContain('Unexpected token');
  });

  it('should handle missing events array', () => {
    const invalidSparkpack = {
      meta: createValidMeta([]),
    };

    const plan = planImport(JSON.stringify(invalidSparkpack));

    expect(plan.valid).toHaveLength(0);
    expect(plan.invalid).toHaveLength(1);
    expect(plan.invalid[0]!.index).toBe(-1);
    expect(plan.invalid[0]!.error).toContain('missing or invalid events array');
  });

  it('should report correct indices for invalid events', () => {
    const events = [
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'valid-1',
          title: 'Valid Task',
          status: 'TODAY',
          priority: 'P1',
          tags: [],
        },
      },
      { type: 'INVALID', timestamp: 'bad', payload: {} }, // index 1
      {
        type: 'TASK_CREATED',
        timestamp: '2025-08-15T10:00:00.000Z',
        payload: {
          id: 'valid-2',
          title: 'Another Valid Task',
          status: 'LATER',
          priority: 'P2',
          tags: [],
        },
      },
      { type: 'ANOTHER_INVALID', timestamp: 'also bad', payload: {} }, // index 3
    ];
    
    const sparkpack = {
      meta: createValidMeta(events),
      events,
    };

    const plan = planImport(JSON.stringify(sparkpack));

    expect(plan.valid).toHaveLength(2);
    expect(plan.invalid).toHaveLength(2);
    expect(plan.invalid[0]!.index).toBe(1);
    expect(plan.invalid[1]!.index).toBe(3);
  });
});
