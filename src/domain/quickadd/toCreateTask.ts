import { type z } from 'zod';

import { type CreateTaskInputSchema } from '../task/schema';

import { type QuickAddResult } from './schema';

export function toCreateTaskInput(
  q: QuickAddResult
): z.infer<typeof CreateTaskInputSchema> {
  return {
    title: q.title,
    status: q.status,
    priority: q.priority,
    dueDate: q.dueDate,
    tags: q.tags,
    snoozeUntil: q.snoozeUntil,
  };
}
