import { z } from 'zod';

const BaseEventSchema = z.object({
  timestamp: z.string().datetime(),
});

export const TaskCreatedEventSchema = BaseEventSchema.extend({
  type: z.literal('TASK_CREATED'),
  payload: z.object({
    id: z.string(),
    title: z.string(),
    status: z.enum(['TODAY', 'LATER', 'DONE', 'ARCHIVED']),
    priority: z.enum(['P0', 'P1', 'P2']),
    dueDate: z.string().datetime().optional(),
    tags: z.array(z.string()),
    notes: z.string().optional(),
  }),
});

export const TaskUpdatedEventSchema = BaseEventSchema.extend({
  type: z.literal('TASK_UPDATED'),
  payload: z.object({
    id: z.string(),
    changes: z.object({
      title: z.string().optional(),
      dueDate: z.string().datetime().optional(),
      tags: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }),
  }),
});

export const TaskCompletedEventSchema = BaseEventSchema.extend({
  type: z.literal('TASK_COMPLETED'),
  payload: z.object({
    id: z.string(),
  }),
});

export const TaskSnoozedEventSchema = BaseEventSchema.extend({
  type: z.literal('TASK_SNOOZED'),
  payload: z.object({
    id: z.string(),
    snoozeUntil: z.string().datetime(),
  }),
});

export const TaskMovedEventSchema = BaseEventSchema.extend({
  type: z.literal('TASK_MOVED'),
  payload: z.object({
    id: z.string(),
    fromStatus: z.enum(['TODAY', 'LATER', 'DONE', 'ARCHIVED']),
    toStatus: z.enum(['TODAY', 'LATER', 'DONE', 'ARCHIVED']),
  }),
});

export const TaskEventSchema = z.discriminatedUnion('type', [
  TaskCreatedEventSchema,
  TaskUpdatedEventSchema,
  TaskCompletedEventSchema,
  TaskSnoozedEventSchema,
  TaskMovedEventSchema,
]);

export type TaskEvent = z.infer<typeof TaskEventSchema>;
