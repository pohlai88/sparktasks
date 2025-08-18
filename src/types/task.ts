export type TaskId = string;

export type TaskStatus = 'TODAY' | 'LATER' | 'DONE' | 'ARCHIVED';

export type TaskPriority = 'P0' | 'P1' | 'P2';

export type { Task } from '../domain/task/schema';
