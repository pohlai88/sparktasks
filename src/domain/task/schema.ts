import { z } from 'zod';

export const TaskStatusSchema = z.enum(['TODAY', 'LATER', 'DONE', 'ARCHIVED']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.enum(['TODAY', 'LATER', 'DONE', 'ARCHIVED']),
  priority: z.enum(['P0', 'P1', 'P2']),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  snoozeUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // ARCHIVED tasks are excluded from lanes and default queries
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
