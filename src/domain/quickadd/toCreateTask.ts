import { z } from 'zod';
import { CreateTaskInputSchema } from '../task/schema';
import { QuickAddResult } from './schema';

export function toCreateTaskInput(q: QuickAddResult): z.infer<typeof CreateTaskInputSchema> {
  return {
    title: q.title,
    status: q.status,
    priority: q.priority,
    dueDate: q.dueDate,
    tags: q.tags,
    snoozeUntil: q.snoozeUntil,
  };
}
