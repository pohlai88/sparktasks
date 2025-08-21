/**
 * @fileoverview LogViewer Demo - Enterprise Component Showcase
 *
 * @description Interactive demonstration of the LogViewer component showcasing
 * all features including search, filtering, different view modes, real-time updates,
 * and enterprise-grade log management capabilities.
 *
 * @compliance
 * - DESIGN_TOKENS V3.2 - Complete token integration
 * - WCAG 2.1 AAA - Full accessibility compliance
 * - Anti-Drift Architecture - Surgical precision
 * - Enterprise Standards - Production-ready examples
 */

import React, { useState, useCallback, useMemo } from 'react';
import { LogViewer } from '@/components/data/LogViewer';
import type {
  LogEntry,
  LogLevel,
  LogViewMode,
  LogFilter,
} from '@/components/data/LogViewer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== DEMO DATA GENERATION =====

const generateMockLogs = (count: number = 50): LogEntry[] => {
  const levels: LogLevel[] = ['error', 'warn', 'info', 'debug', 'trace'];
  const sources = [
    'auth-service',
    'api-gateway',
    'database',
    'payment-service',
    'user-service',
    'notification-service',
  ];
  const messages = [
    'User authentication successful',
    'Database connection established',
    'Payment processing initiated',
    'API rate limit exceeded',
    'Cache miss for user profile',
    'Email notification sent',
    'Session expired for user',
    'Database query optimization applied',
    'File upload completed',
    'Security scan completed',
    'Backup process started',
    'Configuration updated',
    'Memory usage high',
    'Network latency detected',
    'Batch job completed',
    'Error processing request',
    'Warning: Disk space low',
    'Info: System health check passed',
    'Debug: Variable state logged',
    'Trace: Function execution path',
  ];

  return Array.from({ length: count }, (_, i) => {
    const level = levels[i % levels.length];
    const source = sources[i % sources.length];
    const baseMessage = messages[i % messages.length];

    return {
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
      level,
      message: `${baseMessage} (${i + 1})`,
      source,
      metadata: {
        requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
        userId: i % 3 === 0 ? `user-${Math.floor(i / 3) + 1}` : undefined,
        sessionId: `sess-${Math.random().toString(36).substr(2, 6)}`,
        duration: `${Math.floor(Math.random() * 500)}ms`,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent:
          i % 4 === 0 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' : undefined,
      },
      tags: [
        level === 'error' ? 'critical' : level,
        source.split('-')[0],
        i % 5 === 0 ? 'monitored' : 'standard',
      ].filter(Boolean),
      ...(level === 'error' && {
        stackTrace: `Error at line ${i + 1}\n  at function${i}\n  at module.js:${i * 10}`,
      }),
    };
  });
};

// ===== DEMO COMPONENT =====

export const LogViewerDemo: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => generateMockLogs(50));
  const [isRealTime, setIsRealTime] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [activeFilters, setActiveFilters] = useState<LogFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode] = useState<LogViewMode>('table');

  // Real-time log simulation
  React.useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      const newLog = generateMockLogs(1)[0];
      newLog.id = `realtime-${Date.now()}`;
      newLog.timestamp = new Date().toISOString();

      setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100 logs
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Event handlers
  const handleLogClick = useCallback((log: LogEntry) => {
    setSelectedLog(log);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback((filters: LogFilter) => {
    setActiveFilters(filters);
  }, []);

  const handleLevelFilter = useCallback((levels: LogLevel[]) => {
    setActiveFilters(prev => ({ ...prev, levels }));
  }, []);

  const handleExport = useCallback((logs: LogEntry[]) => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `logs-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, []);

  const addRandomLog = useCallback(() => {
    const newLog = generateMockLogs(1)[0];
    newLog.id = `manual-${Date.now()}`;
    newLog.timestamp = new Date().toISOString();

    setLogs(prev => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setSelectedLog(null);
  }, []);

  const loadSampleLogs = useCallback((count: number) => {
    setLogs(generateMockLogs(count));
    setSelectedLog(null);
  }, []);

  // Statistics
  const logStats = useMemo(() => {
    const stats = logs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<LogLevel, number>
    );

    return stats;
  }, [logs]);

  return (
    <div className='mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='space-y-4 text-center'>
        <h1 className={DESIGN_TOKENS.typography.heading.h1}>
          LogViewer Component Demo
        </h1>
        <p className={DESIGN_TOKENS.typography.body.primary}>
          Enterprise-grade structured log display with search, filtering, and
          real-time updates
        </p>
      </div>

      {/* Controls */}
      <Card className='p-6'>
        <div className='space-y-4'>
          <h2 className={DESIGN_TOKENS.typography.heading.h2}>Demo Controls</h2>

          <div className='flex flex-wrap gap-3'>
            <Button
              variant='primary'
              size='sm'
              onClick={() => loadSampleLogs(25)}
            >
              Load 25 Logs
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => loadSampleLogs(100)}
            >
              Load 100 Logs
            </Button>
            <Button variant='outline' size='sm' onClick={addRandomLog}>
              Add Random Log
            </Button>
            <Button
              variant={isRealTime ? 'destructive' : 'primary'}
              size='sm'
              onClick={() => setIsRealTime(!isRealTime)}
            >
              {isRealTime ? 'Stop' : 'Start'} Real-time
            </Button>
            <Button variant='ghost' size='sm' onClick={clearLogs}>
              Clear All
            </Button>
          </div>

          {/* Log Statistics */}
          <div className='space-y-2'>
            <h3 className={DESIGN_TOKENS.typography.heading.h3}>
              Log Statistics
            </h3>
            <div className='flex flex-wrap gap-3'>
              <Badge variant='danger'>Errors: {logStats.error || 0}</Badge>
              <Badge variant='warning'>Warnings: {logStats.warn || 0}</Badge>
              <Badge variant='info'>Info: {logStats.info || 0}</Badge>
              <Badge variant='default'>Debug: {logStats.debug || 0}</Badge>
              <Badge variant='outline'>Trace: {logStats.trace || 0}</Badge>
              <Badge variant='default'>Total: {logs.length}</Badge>
            </div>
          </div>

          {/* Current Filters */}
          {(searchQuery || activeFilters.levels?.length) && (
            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Active Filters
              </h3>
              <div className='flex flex-wrap gap-2'>
                {searchQuery && (
                  <Badge variant='info'>Search: "{searchQuery}"</Badge>
                )}
                {activeFilters.levels?.map(level => (
                  <Badge key={level} variant='default'>
                    Level: {level.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main LogViewer */}
      <Card className='overflow-hidden p-0'>
        <LogViewer
          logs={logs}
          viewMode={viewMode}
          realTime={isRealTime}
          searchable={true}
          filterable={true}
          exportable={true}
          showTimestamps={true}
          showLevels={true}
          showMetadata={true}
          autoScroll={true}
          highlightMatches={true}
          height='600px'
          maxLogs={500}
          onLogClick={handleLogClick}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onLevelFilter={handleLevelFilter}
          onExport={handleExport}
          data-testid='demo-log-viewer'
        />
      </Card>

      {/* Selected Log Details */}
      {selectedLog && (
        <Card className='p-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className={DESIGN_TOKENS.typography.heading.h2}>
                Selected Log Details
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedLog(null)}
              >
                ✕ Close
              </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                  Basic Information
                </h3>
                <dl className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <dt className='font-semibold text-gray-600 dark:text-gray-400'>
                      ID:
                    </dt>
                    <dd className='font-mono text-gray-900 dark:text-gray-100'>
                      {selectedLog.id}
                    </dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='font-semibold text-gray-600 dark:text-gray-400'>
                      Level:
                    </dt>
                    <dd>
                      <Badge
                        variant={
                          selectedLog.level === 'error'
                            ? 'danger'
                            : selectedLog.level === 'warn'
                              ? 'warning'
                              : selectedLog.level === 'info'
                                ? 'info'
                                : 'default'
                        }
                      >
                        {selectedLog.level.toUpperCase()}
                      </Badge>
                    </dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='font-semibold text-gray-600 dark:text-gray-400'>
                      Source:
                    </dt>
                    <dd className='font-mono text-gray-900 dark:text-gray-100'>
                      {selectedLog.source}
                    </dd>
                  </div>
                  <div className='flex justify-between'>
                    <dt className='font-semibold text-gray-600 dark:text-gray-400'>
                      Timestamp:
                    </dt>
                    <dd className='font-mono text-gray-900 dark:text-gray-100'>
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className={DESIGN_TOKENS.typography.heading.h3}>Message</h3>
                <p className='rounded bg-gray-50 p-3 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
                  {selectedLog.message}
                </p>

                {selectedLog.tags && selectedLog.tags.length > 0 && (
                  <div className='mt-3'>
                    <h4 className='mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400'>
                      Tags:
                    </h4>
                    <div className='flex flex-wrap gap-1'>
                      {selectedLog.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedLog.metadata && (
              <div>
                <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                  Metadata
                </h3>
                <pre className='overflow-x-auto rounded bg-gray-50 p-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.stackTrace && (
              <div>
                <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                  Stack Trace
                </h3>
                <pre className='overflow-x-auto rounded bg-red-50 p-4 text-xs text-red-900 dark:bg-red-950 dark:text-red-100'>
                  {selectedLog.stackTrace}
                </pre>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Feature Showcase */}
      <Card className='p-6'>
        <div className='space-y-4'>
          <h2 className={DESIGN_TOKENS.typography.heading.h2}>
            LogViewer Features
          </h2>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                View Modes
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li>• Table view with sortable columns</li>
                <li>• Card view for detailed display</li>
                <li>• Raw JSON view for debugging</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Search & Filter
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li>• Full-text search across all fields</li>
                <li>• Level-based filtering</li>
                <li>• Source and tag filtering</li>
                <li>• Time range filtering</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Enterprise Features
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li>• Real-time log streaming</li>
                <li>• Export functionality</li>
                <li>• Virtual scrolling for performance</li>
                <li>• Expandable metadata</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Accessibility
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li>• WCAG 2.1 AAA compliant</li>
                <li>• Keyboard navigation support</li>
                <li>• Screen reader compatible</li>
                <li>• High contrast color schemes</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Performance
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li>• Virtual scrolling for large datasets</li>
                <li>• Efficient filtering algorithms</li>
                <li>• Memory-optimized log retention</li>
                <li>• Responsive design patterns</li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Customization
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li>• Configurable display options</li>
                <li>• Custom height and styling</li>
                <li>• Theme support (light/dark)</li>
                <li>• Callback customization</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Examples */}
      <Card className='p-6'>
        <div className='space-y-4'>
          <h2 className={DESIGN_TOKENS.typography.heading.h2}>
            Usage Examples
          </h2>

          <div className='space-y-4'>
            <div>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Basic Usage
              </h3>
              <pre className='overflow-x-auto rounded bg-gray-50 p-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
                {`<LogViewer
  logs={logEntries}
  searchable={true}
  filterable={true}
  showTimestamps={true}
  showLevels={true}
  onLogClick={(log) => console.log('Selected:', log)}
/>`}
              </pre>
            </div>

            <div>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Real-time Configuration
              </h3>
              <pre className='overflow-x-auto rounded bg-gray-50 p-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
                {`<LogViewer
  logs={logs}
  realTime={true}
  autoScroll={true}
  maxLogs={1000}
  height="500px"
  onSearch={(query) => setSearchQuery(query)}
  onFilter={(filters) => setActiveFilters(filters)}
/>`}
              </pre>
            </div>

            <div>
              <h3 className={DESIGN_TOKENS.typography.heading.h3}>
                Advanced Features
              </h3>
              <pre className='overflow-x-auto rounded bg-gray-50 p-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
                {`<LogViewer
  logs={logs}
  viewMode="card"
  exportable={true}
  virtualScrolling={true}
  highlightMatches={true}
  showMetadata={true}
  darkMode={true}
  onExport={(logs, format) => downloadLogs(logs, format)}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LogViewerDemo;
