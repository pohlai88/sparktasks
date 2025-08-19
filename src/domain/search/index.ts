import type { Task } from '../task/schema';
import type { TaskEvent } from '../task/events';
import type { SearchQuery, SearchResult } from './types';
import { compareTasks } from '../task/sort';

export interface SearchIndex {
  build(tasks: Task[]): void;
  updateFromEvent(e: TaskEvent): void;
  search(q: SearchQuery): SearchResult;
}

interface IndexedTask {
  task: Task;
  tokens: {
    title: string[];
    tags: string[];
    notes: string[];
  };
}

// Tokenize text: lowercase, split on non-alphanum, min length 2
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length >= 2);
}

// Handle quoted phrases: "exact phrase" becomes single token
function parseQuery(query: string): string[] {
  const tokens: string[] = [];
  const quotedRegex = /"([^"]+)"/g;
  let lastIndex = 0;
  let match;

  // Extract quoted phrases
  while ((match = quotedRegex.exec(query)) !== null) {
    // Add tokens before the quote
    const beforeQuote = query.slice(lastIndex, match.index);
    tokens.push(...tokenize(beforeQuote));

    // Add the quoted phrase as single token
    tokens.push(match[1].toLowerCase());

    lastIndex = quotedRegex.lastIndex;
  }

  // Add remaining tokens after last quote
  const remaining = query.slice(lastIndex);
  tokens.push(...tokenize(remaining));

  return tokens.filter(token => token.length >= 2);
}

class InMemorySearchIndex implements SearchIndex {
  private indexedTasks: Map<string, IndexedTask> = new Map();

  build(tasks: Task[]): void {
    this.indexedTasks.clear();
    for (const task of tasks) {
      this.indexTask(task);
    }
  }

  private indexTask(task: Task): void {
    const indexed: IndexedTask = {
      task,
      tokens: {
        title: tokenize(task.title),
        tags: task.tags.flatMap(tag => tokenize(tag)),
        notes: task.notes ? tokenize(task.notes) : [],
      },
    };
    this.indexedTasks.set(task.id, indexed);
  }

  updateFromEvent(e: TaskEvent): void {
    const taskId = e.payload.id;

    switch (e.type) {
      case 'TASK_CREATED': {
        const newTask: Task = {
          id: taskId,
          title: e.payload.title,
          status: e.payload.status,
          priority: e.payload.priority,
          tags: e.payload.tags,
          dueDate: e.payload.dueDate,
          notes: e.payload.notes,
          createdAt: e.timestamp,
          updatedAt: e.timestamp,
        };
        this.indexTask(newTask);
        break;
      }

      case 'TASK_UPDATED': {
        const existing = this.indexedTasks.get(taskId);
        if (existing) {
          const updatedTask: Task = {
            ...existing.task,
            updatedAt: e.timestamp,
          };

          // Apply only defined changes
          if (e.payload.changes.title !== undefined) {
            updatedTask.title = e.payload.changes.title;
          }
          if (e.payload.changes.dueDate !== undefined) {
            updatedTask.dueDate = e.payload.changes.dueDate;
          }
          if (e.payload.changes.tags !== undefined) {
            updatedTask.tags = e.payload.changes.tags;
          }
          if (e.payload.changes.notes !== undefined) {
            updatedTask.notes = e.payload.changes.notes;
          }

          this.indexTask(updatedTask);
        }
        break;
      }

      case 'TASK_MOVED': {
        const existing = this.indexedTasks.get(taskId);
        if (existing) {
          const updatedTask: Task = {
            ...existing.task,
            status: e.payload.toStatus,
            updatedAt: e.timestamp,
          };
          this.indexTask(updatedTask);
        }
        break;
      }

      case 'TASK_COMPLETED': {
        const existing = this.indexedTasks.get(taskId);
        if (existing) {
          const updatedTask: Task = {
            ...existing.task,
            status: 'DONE',
            updatedAt: e.timestamp,
          };
          this.indexTask(updatedTask);
        }
        break;
      }

      case 'TASK_SNOOZED': {
        const existing = this.indexedTasks.get(taskId);
        if (existing) {
          const updatedTask: Task = {
            ...existing.task,
            snoozeUntil: e.payload.snoozeUntil,
            updatedAt: e.timestamp,
          };
          this.indexTask(updatedTask);
        }
        break;
      }
    }
  }

  search(query: SearchQuery): SearchResult {
    const { q = '', tags, status, priority, limit = 20, offset = 0 } = query;

    // Parse search query tokens - filter out short queries unless using filters
    const queryTokens = q.trim() ? parseQuery(q) : [];
    const hasTextQuery =
      queryTokens.length > 0 && queryTokens.some(token => token.length >= 2);
    const hasFilters =
      (tags && tags.length > 0) ||
      (status && status.length > 0) ||
      (priority && priority.length > 0);

    // If we have a text query but no valid tokens (too short), return empty unless we have filters
    if (q.trim() && !hasTextQuery && !hasFilters) {
      return {
        total: 0,
        items: [],
        facets: { tags: {}, status: {}, priority: {} },
      };
    }

    // Score and filter tasks
    const scoredTasks: Array<{ task: Task; score: number }> = [];

    for (const indexed of this.indexedTasks.values()) {
      const { task } = indexed;

      // Apply filters
      if (tags && tags.length > 0) {
        const hasAllTags = tags.every(tag =>
          task.tags.some(taskTag =>
            taskTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasAllTags) continue;
      }

      if (status && status.length > 0 && !status.includes(task.status)) {
        continue;
      }

      if (
        priority &&
        priority.length > 0 &&
        !priority.includes(task.priority)
      ) {
        continue;
      }

      // Calculate score for text search
      let score = 0;

      if (hasTextQuery) {
        // Check if all query tokens match (AND behavior)
        const allTokensMatch = queryTokens.every(queryToken => {
          let tokenMatched = false;

          // Check if this is a phrase (contains spaces) vs single token
          const isPhrase = queryToken.includes(' ');

          if (isPhrase) {
            // For phrases, check exact match in original text
            const phraseQuery = queryToken.toLowerCase();
            if (task.title.toLowerCase().includes(phraseQuery)) {
              score += 3;
              tokenMatched = true;
            }
            if (
              task.tags.some(tag => tag.toLowerCase().includes(phraseQuery))
            ) {
              score += 2;
              tokenMatched = true;
            }
            if (task.notes?.toLowerCase().includes(phraseQuery)) {
              score += 1;
              tokenMatched = true;
            }
          } else {
            // For single tokens, use tokenized matching
            // Title boost x3
            if (
              indexed.tokens.title.some(token => token.includes(queryToken))
            ) {
              score += 3;
              tokenMatched = true;
            }

            // Tags boost x2
            if (indexed.tokens.tags.some(token => token.includes(queryToken))) {
              score += 2;
              tokenMatched = true;
            }

            // Notes boost x1
            if (
              indexed.tokens.notes.some(token => token.includes(queryToken))
            ) {
              score += 1;
              tokenMatched = true;
            }
          }

          return tokenMatched;
        });

        if (!allTokensMatch) continue;
      }

      scoredTasks.push({ task, score });
    }

    // Sort by score (desc), then compareTasks, then by id for stability
    scoredTasks.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      const taskComparison = compareTasks(a.task, b.task);
      if (taskComparison !== 0) return taskComparison;
      return a.task.id.localeCompare(b.task.id);
    });

    // Calculate facets from filtered results (before pagination)
    const facets = {
      tags: {} as Record<string, number>,
      status: {} as Record<string, number>,
      priority: {} as Record<string, number>,
    };

    for (const { task } of scoredTasks) {
      // Status facet
      facets.status[task.status] = (facets.status[task.status] || 0) + 1;

      // Priority facet
      facets.priority[task.priority] =
        (facets.priority[task.priority] || 0) + 1;

      // Tags facet
      for (const tag of task.tags) {
        facets.tags[tag] = (facets.tags[tag] || 0) + 1;
      }
    }

    // Apply pagination with bounds checking
    const safeOffset = Math.max(0, offset);
    const safeLimit = Math.max(1, Math.min(1000, limit)); // Reasonable upper bound
    const paginatedTasks = scoredTasks
      .slice(safeOffset, safeOffset + safeLimit)
      .map(({ task }) => task);

    return {
      total: scoredTasks.length,
      items: paginatedTasks,
      facets,
    };
  }
}

export function createSearchIndex(): SearchIndex {
  return new InMemorySearchIndex();
}
