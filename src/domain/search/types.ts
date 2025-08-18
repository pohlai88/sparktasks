import type { Task } from '../task/schema';

export interface SearchQuery {
  q?: string;
  tags?: string[];
  status?: ('TODAY' | 'LATER' | 'DONE' | 'ARCHIVED')[];
  priority?: ('P0' | 'P1' | 'P2')[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  total: number;
  items: Task[];
  facets: {
    tags: Record<string, number>;
    status: Record<string, number>;
    priority: Record<string, number>;
  };
}
