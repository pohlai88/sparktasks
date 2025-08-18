import { loadEvents } from '../task/eventlog';
import { TaskEventSchema } from '../task/events';
import type { Sparkpack, SparkpackMeta } from './types';

// tiny hash, no deps
const fnv1a = (s: string) => {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return ('00000000' + h.toString(16)).slice(-8);
};

export function exportSparkpack(): string {
  const events = loadEvents();
  
  // Validate all events with schema
  const validatedEvents = events.map(event => {
    try {
      return TaskEventSchema.parse(event);
    } catch (error) {
      throw new Error(`Invalid event found during export: ${error}`);
    }
  });

  const rawEvents = validatedEvents.map(e => JSON.stringify(e)).join('\n');
  const meta: SparkpackMeta = {
    version: 1,
    format: 'sparkpack/1+json',
    createdAt: new Date().toISOString(),
    eventsCount: validatedEvents.length,
    eventsHash: fnv1a(rawEvents),
  };

  const sparkpack: Sparkpack = {
    meta,
    events: validatedEvents,
  };

  return JSON.stringify(sparkpack);
}
