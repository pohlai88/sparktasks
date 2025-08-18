import { z } from 'zod';

export const QuickAddResultSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty after removing tokens'),
  priority: z.enum(['P0', 'P1', 'P2']).default('P1'),
  status: z.enum(['TODAY', 'LATER', 'DONE']).default('TODAY'),
  tags: z.array(z.string()).default([]),
  dueDate: z.string().optional(),
  snoozeUntil: z.string().optional(),
});

export type QuickAddResult = z.infer<typeof QuickAddResultSchema>;
