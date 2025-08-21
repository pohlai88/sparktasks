/**
 * @fileoverview RealtimeUpdates - Enterprise Live Data Streaming Component
 *
 * @description High-performance real-time data streaming component with WebSocket integration,
 * fallback polling, error recovery, and comprehensive connection management for enterprise applications.
 *
 * Features:
 * - WebSocket-based real-time updates with automatic reconnection
 * - Fallback HTTP polling for environments without WebSocket support
 * - Comprehensive error handling and recovery strategies
 * - Performance optimization with debouncing and throttling
 * - Connection state management with visual indicators
 * - Memory leak prevention with proper cleanup
 * - SSOT compliance with DESIGN_TOKENS V3.2
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'reconnecting';
export type UpdateMode = 'websocket' | 'polling' | 'hybrid';
export type DataFormat = 'json' | 'text' | 'binary';

export interface ConnectionConfig {
  /** WebSocket endpoint URL */
  endpoint: string;
  /** Fallback polling endpoint (defaults to endpoint) */
  pollingEndpoint?: string;
  /** Update interval for polling fallback (ms) */
  updateInterval?: number;
  /** Maximum reconnection attempts */
  maxReconnectAttempts?: number;
  /** Reconnection delay (ms) */
  reconnectDelay?: number;
  /** Connection timeout (ms) */
  timeout?: number;
  /** Custom headers for HTTP requests */
  headers?: Record<string, string>;
  /** Authentication token */
  authToken?: string;
}

export interface UpdateOptions {
  /** Update mode preference */
  mode?: UpdateMode;
  /** Data format expected */
  format?: DataFormat;
  /** Enable data validation */
  validate?: boolean;
  /** Debounce updates (ms) */
  debounceMs?: number;
  /** Enable compression */
  compression?: boolean;
}

export interface RealtimeUpdateState {
  /** Current connection status */
  status: ConnectionStatus;
  /** Last successful update timestamp */
  lastUpdate?: Date | undefined;
  /** Current error if any */
  error?: Error | undefined;
  /** Reconnection attempt count */
  reconnectAttempts: number;
  /** Active connection mode */
  activeMode: UpdateMode;
  /** Connection latency (ms) */
  latency?: number | undefined;
}

export interface RealtimeUpdatesProps<T = any>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /** Connection configuration */
  config: ConnectionConfig;
  /** Update options */
  options?: UpdateOptions;
  /** Component to render with live data */
  component: React.ComponentType<{ data: T; state: RealtimeUpdateState }>;
  /** Initial data */
  initialData?: T;
  /** Data transformer function */
  transform?: (rawData: any) => T;
  /** Data validator function */
  validate?: (data: any) => boolean;
  /** Connection state change handler */
  onStatusChange?: (status: ConnectionStatus) => void;
  /** Data update handler */
  onUpdate?: (data: T) => void;
  /** Error handler */
  onError?: (error: Error) => void;
  /** Reconnection handler */
  onReconnect?: (attempt: number) => void;
  /** Enable fallback polling */
  fallbackPolling?: boolean;
  /** Auto-start connection */
  autoConnect?: boolean;
  /** Testing mode (disables actual connections) */
  testMode?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ComponentType<{ state: RealtimeUpdateState }>;
  /** Custom error component */
  errorComponent?: React.ComponentType<{ error: Error; onRetry: () => void }>;
  /** Test ID for DOM testing */
  'data-testid'?: string;
}

// ===== UTILITY FUNCTIONS =====

const createWebSocketUrl = (endpoint: string, authToken?: string): string => {
  const url = new URL(endpoint);
  if (authToken) {
    url.searchParams.set('token', authToken);
  }
  return url.toString();
};

const createPollingUrl = (endpoint: string, authToken?: string): string => {
  const url = new URL(endpoint);
  if (authToken) {
    url.searchParams.set('token', authToken);
  }
  url.searchParams.set('timestamp', Date.now().toString());
  return url.toString();
};

const getConnectionClasses = (status: ConnectionStatus): string => {
  const baseClasses = ['p-4 rounded-lg border', 'relative', 'min-h-0'];

  const statusClasses = {
    connecting: [DESIGN_TOKENS.theme.light.surface.subtle],
    connected: [DESIGN_TOKENS.theme.light.surface.base],
    disconnected: [DESIGN_TOKENS.theme.light.surface.muted],
    error: [DESIGN_TOKENS.recipe.card.error],
    reconnecting: [DESIGN_TOKENS.recipe.card.warning],
  };

  return [...baseClasses, ...statusClasses[status]].join(' ');
};

const getStatusIndicatorClasses = (status: ConnectionStatus): string => {
  const baseClasses = [
    'absolute',
    'top-2',
    'right-2',
    'w-3',
    'h-3',
    'rounded-full',
    'z-10',
  ];

  const statusClasses = {
    connecting: ['bg-amber-400', 'animate-pulse'],
    connected: ['bg-green-400'],
    disconnected: ['bg-slate-300'],
    error: ['bg-red-400'],
    reconnecting: ['bg-amber-400', 'animate-bounce'],
  };

  return [...baseClasses, ...statusClasses[status]].join(' ');
};

// ===== CUSTOM HOOKS =====

const useWebSocket = (
  config: ConnectionConfig,
  options: UpdateOptions,
  onMessage: (data: any) => void,
  onStatusChange: (status: ConnectionStatus) => void,
  testMode = false
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = useCallback(() => {
    if (testMode) {
      onStatusChange('connected');
      return;
    }

    try {
      onStatusChange('connecting');
      const wsUrl = createWebSocketUrl(config.endpoint, config.authToken);
      const ws = new WebSocket(wsUrl);

      ws.addEventListener('open', () => {
        onStatusChange('connected');
        setReconnectAttempts(0);
      });

      ws.onmessage = event => {
        try {
          const data =
            options.format === 'json' ? JSON.parse(event.data) : event.data;
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.addEventListener('close', () => {
        onStatusChange('disconnected');
        const maxAttempts = config.maxReconnectAttempts ?? 5;
        if (reconnectAttempts < maxAttempts) {
          onStatusChange('reconnecting');
          setReconnectAttempts(prev => prev + 1);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, config.reconnectDelay ?? 3000);
        }
      });

      ws.onerror = () => {
        onStatusChange('error');
      };

      wsRef.current = ws;
    } catch (error) {
      onStatusChange('error');
    }
  }, [config, options, onMessage, onStatusChange, reconnectAttempts, testMode]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setReconnectAttempts(0);
  }, []);

  return { connect, disconnect, reconnectAttempts };
};

const usePolling = (
  config: ConnectionConfig,
  options: UpdateOptions,
  onData: (data: any) => void,
  onError: (error: Error) => void,
  enabled: boolean,
  testMode = false
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || testMode) return;

    const poll = async () => {
      try {
        const url = createPollingUrl(
          config.pollingEndpoint ?? config.endpoint,
          config.authToken
        );
        const response = await fetch(url, {
          ...(config.headers && { headers: config.headers }),
          signal: AbortSignal.timeout(config.timeout ?? 10_000),
        });

        if (!response.ok) {
          throw new Error(`Polling failed: ${response.status}`);
        }

        const data =
          options.format === 'json'
            ? await response.json()
            : await response.text();
        onData(data);
      } catch (error) {
        onError(error as Error);
      }
    };

    // Start polling
    poll();
    intervalRef.current = setInterval(poll, config.updateInterval ?? 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [config, options, onData, onError, enabled, testMode]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { stopPolling };
};

// ===== DEFAULT COMPONENTS =====

const DefaultLoadingComponent: React.FC<{ state: RealtimeUpdateState }> = ({
  state,
}) => (
  <div className={DESIGN_TOKENS.recipe.card.base}>
    <div className='flex items-center space-x-3'>
      <div
        className={`size-4 animate-pulse rounded-full ${
          state.status === 'connecting'
            ? 'bg-amber-400'
            : state.status === 'reconnecting'
              ? 'bg-blue-400'
              : 'bg-slate-400'
        }`}
      />
      <span className={DESIGN_TOKENS.theme.light.ink.primary}>
        {state.status === 'connecting' && 'Connecting to live data...'}
        {state.status === 'reconnecting' &&
          `Reconnecting... (attempt ${state.reconnectAttempts})`}
        {state.status === 'disconnected' && 'Connection lost'}
      </span>
    </div>
  </div>
);

const DefaultErrorComponent: React.FC<{
  error: Error;
  onRetry: () => void;
}> = ({ error, onRetry }) => (
  <div className={DESIGN_TOKENS.recipe.card.error}>
    <div className='space-y-3'>
      <h3 className={DESIGN_TOKENS.theme.light.ink.primary}>
        Connection Error
      </h3>
      <p className={DESIGN_TOKENS.theme.light.ink.muted}>{error.message}</p>
      <button
        onClick={onRetry}
        className={DESIGN_TOKENS.recipe.button.outline}
        type='button'
      >
        Retry Connection
      </button>
    </div>
  </div>
);

// ===== MAIN COMPONENT =====

export const RealtimeUpdates = <T,>({
  config,
  options = {},
  component: DataComponent,
  initialData,
  transform,
  validate,
  onStatusChange,
  onUpdate,
  onError,
  onReconnect,
  fallbackPolling = true,
  autoConnect = true,
  testMode = false,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  className,
  'data-testid': dataTestId = 'realtime-updates',
  ...props
}: RealtimeUpdatesProps<T>) => {
  // State management
  const [data, setData] = useState<T | undefined>(initialData);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | undefined>();
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>();
  const [latency] = useState<number | undefined>();
  const [activeMode, setActiveMode] = useState<UpdateMode>('websocket');

  // Debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized options with defaults
  const finalOptions = useMemo(
    () => ({
      mode: 'hybrid' as UpdateMode,
      format: 'json' as DataFormat,
      validate: true,
      debounceMs: 100,
      compression: false,
      ...options,
    }),
    [options]
  );

  // Data processing
  const processData = useCallback(
    (rawData: any) => {
      try {
        // Validate if required
        if (finalOptions.validate && validate && !validate(rawData)) {
          throw new Error('Data validation failed');
        }

        // Transform if provided
        const processedData = transform ? transform(rawData) : rawData;

        // Debounce updates
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
          setData(processedData);
          setLastUpdate(new Date());
          setError(undefined);
          onUpdate?.(processedData);
        }, finalOptions.debounceMs);
      } catch (error_) {
        const error = error_ as Error;
        setError(error);
        onError?.(error);
      }
    },
    [transform, validate, finalOptions, onUpdate, onError]
  );

  // Status change handler
  const handleStatusChange = useCallback(
    (newStatus: ConnectionStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  // WebSocket connection
  const {
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    reconnectAttempts,
  } = useWebSocket(
    config,
    finalOptions,
    processData,
    handleStatusChange,
    testMode
  );

  // Polling fallback
  const { stopPolling } = usePolling(
    config,
    finalOptions,
    processData,
    err => {
      setError(err);
      onError?.(err);
    },
    fallbackPolling && (status === 'error' || finalOptions.mode === 'polling'),
    testMode
  );

  // Connection management
  const connect = useCallback(() => {
    setError(undefined);
    if (finalOptions.mode === 'polling') {
      setActiveMode('polling');
      handleStatusChange('connected');
    } else {
      setActiveMode('websocket');
      connectWebSocket();
    }
  }, [finalOptions.mode, connectWebSocket, handleStatusChange]);

  const disconnect = useCallback(() => {
    disconnectWebSocket();
    stopPolling();
    handleStatusChange('disconnected');
  }, [disconnectWebSocket, stopPolling, handleStatusChange]);

  const retry = useCallback(() => {
    setError(undefined);
    connect();
  }, [connect]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [autoConnect, connect, disconnect]);

  // Reconnection callback
  useEffect(() => {
    if (reconnectAttempts > 0) {
      onReconnect?.(reconnectAttempts);
    }
  }, [reconnectAttempts, onReconnect]);

  // State object for child components
  const state: RealtimeUpdateState = useMemo(
    () => ({
      status,
      lastUpdate,
      error,
      reconnectAttempts,
      activeMode,
      latency,
    }),
    [status, lastUpdate, error, reconnectAttempts, activeMode, latency]
  );

  // Render logic
  const containerClasses =
    `${getConnectionClasses(status)} ${className || ''}`.trim();

  return (
    <div
      className={containerClasses}
      data-testid={dataTestId}
      data-status={status}
      data-mode={activeMode}
      {...props}
    >
      {/* Status indicator */}
      <div
        className={getStatusIndicatorClasses(status)}
        data-testid='status-indicator'
        title={`Status: ${status}`}
      />

      {/* Content rendering */}
      {error && status === 'error' ? (
        <ErrorComponent error={error} onRetry={retry} />
      ) : status === 'connecting' || status === 'reconnecting' ? (
        <LoadingComponent state={state} />
      ) : data ? (
        <DataComponent data={data} state={state} />
      ) : (
        <LoadingComponent state={state} />
      )}

      {/* Connection info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className='absolute bottom-2 left-2 text-xs opacity-50'
          data-testid='debug-info'
        >
          {status} | {activeMode} |{' '}
          {reconnectAttempts > 0 ? `${reconnectAttempts} attempts` : ''}
        </div>
      )}
    </div>
  );
};

RealtimeUpdates.displayName = 'RealtimeUpdates';

// ===== UTILITY EXPORTS =====

export { createWebSocketUrl, createPollingUrl };
