/**
 * Shared utilities between frontend and backend
 * Part of SparkTasks platform core
 */

import { z } from 'zod';

// Zod schemas for runtime validation
export const TaskSchema = z.object({
  id: z.string().regex(/^task_\d+_[a-z0-9]{9}$/, 'Invalid task ID format'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TaskCreateInputSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).strict();

export const TaskUpdateInputSchema = TaskSchema.pick({
  title: true,
  description: true,
  completed: true,
})
  .partial()
  .refine((data: Record<string, unknown>) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const TaskSerializedSchema = TaskSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// TypeScript interfaces (derived from Zod schemas, not extending)
export type Task = z.infer<typeof TaskSchema>;
export type TaskCreateInput = z.infer<typeof TaskCreateInputSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateInputSchema>;
export type TaskSerialized = z.infer<typeof TaskSerializedSchema>;

/**
 * Validation utilities
 */
export const validateTask = (data: unknown): Task => TaskSchema.parse(data);
export const validateTaskCreateInput = (data: unknown): TaskCreateInput =>
  TaskCreateInputSchema.parse(data);
export const validateTaskUpdateInput = (data: unknown): TaskUpdateInput =>
  TaskUpdateInputSchema.parse(data);
export const validateTaskSerialized = (data: unknown): TaskSerialized =>
  TaskSerializedSchema.parse(data);

/**
 * Generic ID generator for all entity types
 * @param prefix - Entity prefix (e.g., 'task', 'user', 'project')
 * @returns Formatted ID: prefix_timestamp_random
 */
export const createId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 11); // 9 chars
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Task-specific ID generator
 * @returns Task ID with format: task_timestamp_random
 */
export const createTaskId = (): string => createId('task');

/**
 * Utility to deserialize Task from JSON
 * Converts ISO date strings back to Date objects
 */
export const deserializeTask = (serialized: TaskSerialized): Task => ({
  ...serialized,
  createdAt: new Date(serialized.createdAt),
  updatedAt: new Date(serialized.updatedAt),
});

/**
 * Utility to serialize Task for JSON transport
 * Converts Date objects to ISO strings
 */
export const serializeTask = (task: Task): TaskSerialized => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});
