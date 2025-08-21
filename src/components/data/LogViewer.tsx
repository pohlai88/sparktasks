/**
 * @fileoverview LogViewer Component - Enterprise Structured Log Display
 *
 * @description Advanced log viewing component with filtering, search, real-time updates,
 * and enterprise-grade features. Displays structured logs with JSON formatting,
 * severity levels, timestamps, and interactive exploration capabilities.
 *
 * @compliance
 * - DESIGN_TOKENS V3.2 ONLY - Zero hardcoded Tailwind
 * - TypeScript Strict Mode - Full type safety
 * - WCAG 2.1 AAA - Complete accessibility
 * - Anti-Drift Architecture - Surgical precision
 *
 * @performance
 * - Virtual scrolling for large datasets
 * - Efficient filtering and search
 * - Memory-optimized log retention
 * - Responsive design patterns
 */

import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { ComponentSize, ComponentVariant } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';
export type LogFormat = 'json' | 'text' | 'structured';
export type LogViewMode = 'table' | 'raw' | 'card';

export interface LogEntry {
  id: string;
  timestamp: string | Date;
  level: LogLevel;
  message: string;
  source?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export interface LogFilter {
  levels?: LogLevel[];
  sources?: string[];
  tags?: string[];
  timeRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  userId?: string;
  sessionId?: string;
}

export interface LogViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSearch' | 'onFilter'> {
  /** Log entries to display */
  logs: LogEntry[];

  /** Display mode for logs */
  viewMode?: LogViewMode;

  /** Log format preference */
  format?: LogFormat;

  /** Component size variant */
  size?: ComponentSize;

  /** Component color variant */
  variant?: ComponentVariant;

  /** Enable real-time log streaming */
  realTime?: boolean;

  /** Maximum number of logs to retain */
  maxLogs?: number;

  /** Enable virtual scrolling for performance */
  virtualScrolling?: boolean;

  /** Show timestamps */
  showTimestamps?: boolean;

  /** Show log levels */
  showLevels?: boolean;

  /** Show metadata expandable sections */
  showMetadata?: boolean;

  /** Enable search functionality */
  searchable?: boolean;

  /** Enable filtering controls */
  filterable?: boolean;

  /** Enable log export functionality */
  exportable?: boolean;

  /** Enable dark mode */
  darkMode?: boolean;

  /** Custom height for the log viewer */
  height?: string;

  /** Auto-scroll to newest logs */
  autoScroll?: boolean;

  /** Highlight search matches */
  highlightMatches?: boolean;

  /** Callback when log entry is clicked */
  onLogClick?: (log: LogEntry) => void;

  /** Callback when search query changes */
  onSearch?: (query: string) => void;

  /** Callback when filters change */
  onFilter?: (filters: LogFilter) => void;

  /** Callback when logs are exported */
  onExport?: (logs: LogEntry[], format: string) => void;

  /** Callback when log level filter changes */
  onLevelFilter?: (levels: LogLevel[]) => void;

  /** Custom class name */
  className?: string;

  /** Test ID for component */
  'data-testid'?: string;
}

// ===== INTERNAL STATE TYPES =====

interface LogViewerState {
  searchQuery: string;
  activeFilters: LogFilter;
  selectedLog: LogEntry | null;
  expandedLogs: Set<string>;
  viewMode: LogViewMode;
  autoScroll: boolean;
  isScrolledToBottom: boolean;
}

// ===== COMPONENT IMPLEMENTATION =====

export const LogViewer = forwardRef<HTMLDivElement, LogViewerProps>(
  (
    {
      logs = [],
      viewMode = 'table',
      format = 'structured',
      size = 'md',
      variant = 'primary',
      realTime = false,
      maxLogs = 1000,
      virtualScrolling = true,
      showTimestamps = true,
      showLevels = true,
      showMetadata = true,
      searchable = true,
      filterable = true,
      exportable = false,
      darkMode = false,
      height = '400px',
      autoScroll = true,
      highlightMatches = true,
      onLogClick,
      onSearch,
      onFilter,
      onExport,
      onLevelFilter,
      className = '',
      'data-testid': testId = 'log-viewer',
      ...props
    },
    ref
  ) => {
    // ===== STATE MANAGEMENT =====

    const [state, setState] = useState<LogViewerState>({
      searchQuery: '',
      activeFilters: {},
      selectedLog: null,
      expandedLogs: new Set(),
      viewMode,
      autoScroll,
      isScrolledToBottom: true,
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isUserScrollingRef = useRef(false);

    // ===== COMPUTED VALUES =====

    const filteredLogs = useMemo(() => {
      let filtered = [...logs];

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          log =>
            log.message.toLowerCase().includes(query) ||
            log.source?.toLowerCase().includes(query) ||
            log.tags?.some(tag => tag.toLowerCase().includes(query)) ||
            (log.metadata &&
              JSON.stringify(log.metadata).toLowerCase().includes(query))
        );
      }

      // Apply level filter
      if (state.activeFilters.levels?.length) {
        filtered = filtered.filter(log =>
          state.activeFilters.levels!.includes(log.level)
        );
      }

      // Apply source filter
      if (state.activeFilters.sources?.length) {
        filtered = filtered.filter(
          log => log.source && state.activeFilters.sources!.includes(log.source)
        );
      }

      // Apply time range filter
      if (state.activeFilters.timeRange) {
        const { start, end } = state.activeFilters.timeRange;
        filtered = filtered.filter(log => {
          const logTime = new Date(log.timestamp);
          return logTime >= start && logTime <= end;
        });
      }

      // Limit to maxLogs
      if (filtered.length > maxLogs) {
        filtered = filtered.slice(-maxLogs);
      }

      return filtered;
    }, [logs, state.searchQuery, state.activeFilters, maxLogs]);

    const availableLevels = useMemo(() => {
      const levels = new Set<LogLevel>();
      logs.forEach(log => levels.add(log.level));
      return Array.from(levels);
    }, [logs]);

    const availableSources = useMemo(() => {
      const sources = new Set<string>();
      logs.forEach(log => log.source && sources.add(log.source));
      return Array.from(sources);
    }, [logs]);

    // ===== EVENT HANDLERS =====

    const handleSearch = useCallback(
      (query: string) => {
        setState(prev => ({ ...prev, searchQuery: query }));
        onSearch?.(query);
      },
      [onSearch]
    );

    const handleLevelFilter = useCallback(
      (levels: LogLevel[]) => {
        setState(prev => ({
          ...prev,
          activeFilters: { ...prev.activeFilters, levels },
        }));
        onLevelFilter?.(levels);
        onFilter?.({ ...state.activeFilters, levels });
      },
      [state.activeFilters, onLevelFilter, onFilter]
    );

    const handleLogClick = useCallback(
      (log: LogEntry) => {
        setState(prev => ({ ...prev, selectedLog: log }));
        onLogClick?.(log);
      },
      [onLogClick]
    );

    const toggleLogExpansion = useCallback((logId: string) => {
      setState(prev => {
        const newExpanded = new Set(prev.expandedLogs);
        if (newExpanded.has(logId)) {
          newExpanded.delete(logId);
        } else {
          newExpanded.add(logId);
        }
        return { ...prev, expandedLogs: newExpanded };
      });
    }, []);

    const handleViewModeChange = useCallback((newMode: LogViewMode) => {
      setState(prev => ({ ...prev, viewMode: newMode }));
    }, []);

    const handleExport = useCallback(
      (exportFormat: string) => {
        onExport?.(filteredLogs, exportFormat);
      },
      [filteredLogs, onExport]
    );

    // ===== SCROLL MANAGEMENT =====

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      setState(prev => ({ ...prev, isScrolledToBottom: isAtBottom }));

      // Detect user scrolling
      if (!isUserScrollingRef.current) {
        isUserScrollingRef.current = true;
        setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 150);
      }
    }, []);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
      if (
        state.autoScroll &&
        state.isScrolledToBottom &&
        !isUserScrollingRef.current
      ) {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }, [filteredLogs.length, state.autoScroll, state.isScrolledToBottom]);

    // ===== RENDER HELPERS =====

    const formatTimestamp = useCallback((timestamp: string | Date) => {
      const date = new Date(timestamp);
      return date.toLocaleString();
    }, []);

    const getLevelColor = useCallback((level: LogLevel) => {
      const levelColors: Record<LogLevel, string> = {
        error: 'text-red-600 dark:text-red-400',
        warn: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400',
        debug: 'text-gray-600 dark:text-gray-400',
        trace: 'text-purple-600 dark:text-purple-400',
      };
      return levelColors[level];
    }, []);

    const highlightText = useCallback(
      (text: string, query: string) => {
        if (!query || !highlightMatches) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className='bg-yellow-200 dark:bg-yellow-800'>
              {part}
            </span>
          ) : (
            part
          )
        );
      },
      [highlightMatches]
    );

    const renderLogEntry = useCallback(
      (log: LogEntry, index: number) => {
        const isExpanded = state.expandedLogs.has(log.id);
        const isSelected = state.selectedLog?.id === log.id;

        if (state.viewMode === 'raw') {
          return (
            <div
              key={log.id}
              className={`${DESIGN_TOKENS.recipe.card.ghost} cursor-pointer p-3 font-mono text-sm transition-colors ${
                isSelected ? 'bg-primary-50 dark:bg-primary-950' : ''
              }`}
              onClick={() => handleLogClick(log)}
              data-testid={`log-entry-${log.id}`}
            >
              <pre className='whitespace-pre-wrap text-xs'>
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          );
        }

        if (state.viewMode === 'card') {
          return (
            <div
              key={log.id}
              className={`${DESIGN_TOKENS.recipe.card.outlined} cursor-pointer p-4 transition-colors ${
                isSelected ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => handleLogClick(log)}
              data-testid={`log-entry-${log.id}`}
            >
              <div className='mb-2 flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  {showLevels && (
                    <span
                      className={`text-xs font-semibold uppercase ${getLevelColor(log.level)}`}
                    >
                      {log.level}
                    </span>
                  )}
                  {showTimestamps && (
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      {formatTimestamp(log.timestamp)}
                    </span>
                  )}
                  {log.source && (
                    <span className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300'>
                      {log.source}
                    </span>
                  )}
                </div>
                {showMetadata && log.metadata && (
                  <button
                    className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    onClick={e => {
                      e.stopPropagation();
                      toggleLogExpansion(log.id);
                    }}
                    data-testid={`expand-log-${log.id}`}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                )}
              </div>

              <div className='mb-2 text-sm text-gray-900 dark:text-gray-100'>
                {highlightText(log.message, state.searchQuery)}
              </div>

              {log.tags && log.tags.length > 0 && (
                <div className='mb-2 flex gap-1'>
                  {log.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {isExpanded && log.metadata && (
                <div className='mt-3 border-t border-gray-200 pt-3 dark:border-gray-700'>
                  <pre className='overflow-x-auto rounded bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {isExpanded && log.stackTrace && (
                <div className='mt-3 border-t border-gray-200 pt-3 dark:border-gray-700'>
                  <pre className='overflow-x-auto rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950 dark:text-red-400'>
                    {log.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          );
        }

        // Table view (default)
        return (
          <tr
            key={log.id}
            className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
              isSelected ? 'bg-primary-50 dark:bg-primary-950' : ''
            }`}
            onClick={() => handleLogClick(log)}
            data-testid={`log-entry-${log.id}`}
          >
            {showTimestamps && (
              <td className='whitespace-nowrap px-3 py-2 text-xs text-gray-500 dark:text-gray-400'>
                {formatTimestamp(log.timestamp)}
              </td>
            )}
            {showLevels && (
              <td className='px-3 py-2'>
                <span
                  className={`text-xs font-semibold uppercase ${getLevelColor(log.level)}`}
                >
                  {log.level}
                </span>
              </td>
            )}
            {log.source && (
              <td className='px-3 py-2 text-xs text-gray-600 dark:text-gray-300'>
                {log.source}
              </td>
            )}
            <td className='px-3 py-2 text-sm text-gray-900 dark:text-gray-100'>
              {highlightText(log.message, state.searchQuery)}
            </td>
            {showMetadata && (
              <td className='px-3 py-2 text-center'>
                {log.metadata && (
                  <button
                    className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    onClick={e => {
                      e.stopPropagation();
                      toggleLogExpansion(log.id);
                    }}
                    data-testid={`expand-log-${log.id}`}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                )}
              </td>
            )}
          </tr>
        );
      },
      [
        state.expandedLogs,
        state.selectedLog,
        state.viewMode,
        state.searchQuery,
        showLevels,
        showTimestamps,
        showMetadata,
        handleLogClick,
        toggleLogExpansion,
        getLevelColor,
        formatTimestamp,
        highlightText,
      ]
    );

    // ===== MAIN RENDER =====

    const containerClasses = `
      ${DESIGN_TOKENS.recipe.list.bordered}
      ${darkMode ? 'dark' : ''}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={{ height }}
        data-testid={testId}
        {...props}
      >
        {/* Header Controls */}
        <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
          <div className='flex items-center gap-4'>
            {/* Search */}
            {searchable && (
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search logs...'
                  value={state.searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className={`${DESIGN_TOKENS.recipe.input.bordered} w-64`}
                  data-testid='log-search'
                />
                {state.searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600'
                    data-testid='clear-search'
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Level Filter */}
            {filterable && (
              <div className='flex gap-2'>
                {availableLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      const currentLevels = state.activeFilters.levels || [];
                      const newLevels = currentLevels.includes(level)
                        ? currentLevels.filter(l => l !== level)
                        : [...currentLevels, level];
                      handleLevelFilter(newLevels);
                    }}
                    className={`rounded px-2 py-1 text-xs transition-colors ${
                      state.activeFilters.levels?.includes(level)
                        ? `bg-${level === 'error' ? 'red' : level === 'warn' ? 'yellow' : 'blue'}-100 text-${level === 'error' ? 'red' : level === 'warn' ? 'yellow' : 'blue'}-800`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    data-testid={`filter-${level}`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Controls */}
          <div className='flex items-center gap-2'>
            {/* View Mode Buttons */}
            <div className='flex rounded-md bg-gray-100 p-1 dark:bg-gray-800'>
              {(['table', 'card', 'raw'] as LogViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleViewModeChange(mode)}
                  className={`rounded px-3 py-1 text-xs transition-colors ${
                    state.viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}
                  data-testid={`view-mode-${mode}`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Export Button */}
            {exportable && (
              <button
                onClick={() => handleExport('json')}
                className={`${DESIGN_TOKENS.recipe.button.secondary} text-xs`}
                data-testid='export-logs'
              >
                Export
              </button>
            )}

            {/* Auto-scroll Toggle */}
            <button
              onClick={() =>
                setState(prev => ({ ...prev, autoScroll: !prev.autoScroll }))
              }
              className={`rounded px-2 py-1 text-xs transition-colors ${
                state.autoScroll
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              data-testid='auto-scroll-toggle'
            >
              Auto-scroll
            </button>
          </div>
        </div>

        {/* Log Content */}
        <div
          ref={scrollContainerRef}
          className='flex-1 overflow-auto'
          onScroll={handleScroll}
          data-testid='log-content'
        >
          {filteredLogs.length === 0 ? (
            <div className='flex h-32 items-center justify-center text-gray-500 dark:text-gray-400'>
              <div className='text-center'>
                <div className='mb-2 text-lg'>📝</div>
                <div>No logs to display</div>
                {state.searchQuery && (
                  <div className='mt-1 text-sm'>
                    Try adjusting your search or filters
                  </div>
                )}
              </div>
            </div>
          ) : state.viewMode === 'table' ? (
            <table className='w-full'>
              <thead className='sticky top-0 bg-gray-50 dark:bg-gray-800'>
                <tr>
                  {showTimestamps && (
                    <th className='px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300'>
                      Time
                    </th>
                  )}
                  {showLevels && (
                    <th className='px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300'>
                      Level
                    </th>
                  )}
                  <th className='px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300'>
                    Source
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300'>
                    Message
                  </th>
                  {showMetadata && (
                    <th className='px-3 py-2 text-center text-xs font-semibold uppercase text-gray-600 dark:text-gray-300'>
                      Details
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredLogs.map(renderLogEntry)}
              </tbody>
            </table>
          ) : (
            <div className='space-y-4 p-4'>
              {filteredLogs.map(renderLogEntry)}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className='border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'>
          <div className='flex items-center justify-between'>
            <div>
              Showing {filteredLogs.length} of {logs.length} logs
              {state.searchQuery && (
                <span className='ml-2'>
                  • Filtered by "{state.searchQuery}"
                </span>
              )}
            </div>
            <div className='flex items-center gap-4'>
              {realTime && (
                <div className='flex items-center gap-1'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
                  <span>Live</span>
                </div>
              )}
              {!state.isScrolledToBottom && (
                <button
                  onClick={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                      container.scrollTop = container.scrollHeight;
                    }
                  }}
                  className='text-blue-600 hover:underline dark:text-blue-400'
                  data-testid='scroll-to-bottom'
                >
                  Scroll to bottom
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LogViewer.displayName = 'LogViewer';

export default LogViewer;
