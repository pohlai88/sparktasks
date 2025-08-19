import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useTaskStore, selectSearch } from '../stores/taskStore';
import type { SearchQuery } from '../domain/search/types';
import type { Task } from '../domain/task/schema';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { StatusBadge, PriorityBadge } from './ui/TaskBadges';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../utils/cn';

interface SearchBarProps {
  onTaskSelect?: (task: Task) => void;
  className?: string;
}

interface SearchState {
  query: string;
  isOpen: boolean;
  results: Task[];
  total: number;
  activeIndex: number;
  loading: boolean;
}

export function SearchBar({ onTaskSelect, className = '' }: SearchBarProps) {
  const storeState = useTaskStore();
  const [state, setState] = useState<SearchState>({
    query: '',
    isOpen: false,
    results: [],
    total: 0,
    activeIndex: -1,
    loading: false,
  });

  const inputRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function (200ms - within 150-250ms spec)
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (query.trim() && query.length >= 2) {
          setState(prev => ({ ...prev, loading: true }));

          const searchQuery: SearchQuery = {
            q: query.trim(),
            limit: 20,
          };

          const result = selectSearch(storeState, searchQuery);

          setState(prev => ({
            ...prev,
            results: result.items,
            total: result.total,
            loading: false,
            isOpen: true,
            activeIndex: 0, // Always start with first option active
          }));
        } else if (query.trim().length === 0) {
          setState(prev => ({
            ...prev,
            results: [],
            total: 0,
            isOpen: false,
            activeIndex: -1,
            loading: false,
          }));
        }
      }, 200);
    },
    [storeState]
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setState(prev => ({ ...prev, query: newQuery }));
    debouncedSearch(newQuery);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!state.isOpen || state.results.length === 0) {
      if (e.key === 'Escape' && state.query) {
        // Esc closes listbox but preserves query (per spec)
        setState(prev => ({ ...prev, isOpen: false, activeIndex: -1 }));
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          activeIndex: Math.min(prev.activeIndex + 1, prev.results.length - 1),
        }));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          activeIndex: Math.max(prev.activeIndex - 1, 0),
        }));
        break;

      case 'Enter':
        e.preventDefault();
        if (state.activeIndex >= 0 && state.results[state.activeIndex]) {
          const selectedTask = state.results[state.activeIndex];
          handleTaskSelect(selectedTask);
        }
        break;

      case 'Escape':
        e.preventDefault();
        // Esc closes listbox but preserves query (per spec)
        setState(prev => ({ ...prev, isOpen: false, activeIndex: -1 }));
        break;

      case 'Tab':
        // Allow Tab to move focus predictably (exit search)
        setState(prev => ({ ...prev, isOpen: false, activeIndex: -1 }));
        break;
    }
  };

  // Handle task selection
  const handleTaskSelect = (task: Task) => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      activeIndex: -1,
      query: '', // Clear query after selection
    }));
    onTaskSelect?.(task);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        listboxRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !listboxRef.current.contains(event.target as Node)
      ) {
        setState(prev => ({ ...prev, isOpen: false, activeIndex: -1 }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate option IDs for ARIA
  const getOptionId = (index: number) => `search-option-${index}`;
  const listboxId = 'search-listbox';

  // Highlight matching text (client-side, no backend changes)
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className={DESIGN_TOKENS.recipes.searchResultHighlight}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const activeDescendant =
    state.activeIndex >= 0 ? getOptionId(state.activeIndex) : undefined;

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className='relative' ref={inputRef}>
        <div className={DESIGN_TOKENS.layout.patterns.absoluteInput}>
          <Search
            className={cn(
              DESIGN_TOKENS.icons.sizes.md,
              DESIGN_TOKENS.colors.ui.text.muted
            )}
          />
        </div>
        <Input
          type='text'
          value={state.query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Search tasks...'
          data-testid='search-input'
          className={cn(DESIGN_TOKENS.layout.patterns.inputWithIcon)}
          aria-label='Search tasks'
          aria-expanded={state.isOpen}
          aria-haspopup='listbox'
          aria-controls={state.isOpen ? listboxId : undefined}
          aria-activedescendant={activeDescendant}
          autoComplete='off'
        />
        {state.query && (
          <Button
            variant='ghost'
            className={cn(
              DESIGN_TOKENS.recipes.inputRightIcon,
              DESIGN_TOKENS.colors.ui.text.muted,
              DESIGN_TOKENS.state.hover
            )}
            onClick={() => {
              setState(prev => ({
                ...prev,
                query: '',
                isOpen: false,
                results: [],
                activeIndex: -1,
              }));
              inputRef.current?.focus();
            }}
            aria-label='Clear search'
          >
            <X className={DESIGN_TOKENS.icons.sizes.sm} />
          </Button>
        )}
      </div>

      {/* Search Results Listbox */}
      {state.isOpen && (
        <div
          ref={listboxRef}
          id={listboxId}
          role='listbox'
          aria-label='Search results'
          data-testid='search-results'
        >
          <Card
            className={cn(
              DESIGN_TOKENS.layout.patterns.dropdownMenu,
              DESIGN_TOKENS.recipes.searchResults
            )}
          >
            {state.loading ? (
              <div
                className={cn(DESIGN_TOKENS.recipes.searchNoResults)}
                role='status'
              >
                Searching...
              </div>
            ) : state.results.length === 0 ? (
              <div
                className={cn(DESIGN_TOKENS.recipes.searchNoResults)}
                role='status'
              >
                No results found
              </div>
            ) : (
              <>
                {state.results.map((task, index) => (
                  <div
                    key={task.id}
                    id={getOptionId(index)}
                    role='option'
                    aria-selected={index === state.activeIndex}
                    className={cn(
                      DESIGN_TOKENS.recipes.searchResultItem,
                      index === state.activeIndex
                        ? DESIGN_TOKENS.colors.status.active.bg +
                            ' ' +
                            DESIGN_TOKENS.colors.status.active.text
                        : DESIGN_TOKENS.colors.ui.text.primary +
                            ' ' +
                            DESIGN_TOKENS.colors.states.default.hover
                    )}
                    onClick={() => handleTaskSelect(task)}
                  >
                    <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
                      <div
                        className={DESIGN_TOKENS.layout.patterns.flexContainer}
                      >
                        <p
                          className={cn(
                            DESIGN_TOKENS.typography.body.primary,
                            'truncate font-medium'
                          )}
                        >
                          {highlightText(task.title, state.query)}
                        </p>
                        {task.notes && (
                          <p
                            className={cn(
                              DESIGN_TOKENS.typography.body.small,
                              'truncate',
                              DESIGN_TOKENS.spacing.sectionMargin
                            )}
                          >
                            {highlightText(task.notes, state.query)}
                          </p>
                        )}
                      </div>
                      <div
                        className={cn(
                          DESIGN_TOKENS.layout.patterns.flexGap,
                          DESIGN_TOKENS.spacing.iconLeft,
                          DESIGN_TOKENS.spacing.inlineTight
                        )}
                      >
                        {task.status === 'TODAY' ||
                        task.status === 'LATER' ||
                        task.status === 'DONE' ? (
                          <StatusBadge status={task.status} />
                        ) : (
                          <span
                            className={cn(
                              DESIGN_TOKENS.recipes.chip,
                              DESIGN_TOKENS.colors.states.muted.bg,
                              DESIGN_TOKENS.colors.states.muted.text
                            )}
                          >
                            {task.status}
                          </span>
                        )}
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                    {task.tags.length > 0 && (
                      <div
                        className={cn(
                          DESIGN_TOKENS.layout.patterns.tagContainer,
                          DESIGN_TOKENS.spacing.inlineTight
                        )}
                      >
                        {task.tags.map(tag => (
                          <span
                            key={tag}
                            className={cn(
                              DESIGN_TOKENS.recipes.chip,
                              DESIGN_TOKENS.colors.states.muted.bg,
                              DESIGN_TOKENS.colors.states.muted.text
                            )}
                          >
                            #{highlightText(tag, state.query)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {state.total > state.results.length && (
                  <div
                    className={cn(
                      DESIGN_TOKENS.colors.states.muted.text,
                      DESIGN_TOKENS.colors.states.muted.bg,
                      DESIGN_TOKENS.recipes.smallButton
                    )}
                    role='status'
                  >
                    Showing {state.results.length} of {state.total} results
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
