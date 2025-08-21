/**
 * @fileoverview RealtimeUpdates Demo - Live Data Streaming Component Showcase
 *
 * @description Comprehensive demonstration of the RealtimeUpdates component with
 * various configurations, data formats, and connection modes.
 */

import React, { useState } from 'react';
import { RealtimeUpdates } from '@/components/data/RealtimeUpdates';
import type {
  ConnectionConfig,
  UpdateOptions,
  RealtimeUpdateState,
  ConnectionStatus,
  UpdateMode,
} from '@/components/data/RealtimeUpdates';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== DEMO DATA COMPONENTS =====

interface MetricsData {
  timestamp: string;
  activeUsers: number;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
}

const MetricsDisplay: React.FC<{
  data: MetricsData;
  state: RealtimeUpdateState;
}> = ({ data, state }) => (
  <div className='space-y-4'>
    <div className='grid grid-cols-2 gap-4'>
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-4'}>
        <h3 className='text-sm font-medium text-slate-600'>Active Users</h3>
        <p className='text-2xl font-bold text-slate-900'>
          {data.activeUsers.toLocaleString()}
        </p>
      </div>
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-4'}>
        <h3 className='text-sm font-medium text-slate-600'>CPU Usage</h3>
        <p className='text-2xl font-bold text-slate-900'>
          {data.cpuUsage.toFixed(1)}%
        </p>
      </div>
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-4'}>
        <h3 className='text-sm font-medium text-slate-600'>Memory Usage</h3>
        <p className='text-2xl font-bold text-slate-900'>
          {data.memoryUsage.toFixed(1)}%
        </p>
      </div>
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-4'}>
        <h3 className='text-sm font-medium text-slate-600'>Response Time</h3>
        <p className='text-2xl font-bold text-slate-900'>
          {data.responseTime}ms
        </p>
      </div>
    </div>
    <div className='text-xs text-slate-500'>
      Last updated: {new Date(data.timestamp).toLocaleTimeString()} | Status:{' '}
      {state.status} | Mode: {state.activeMode}
    </div>
  </div>
);

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

const ChatDisplay: React.FC<{
  data: ChatMessage[];
  state: RealtimeUpdateState;
}> = ({ data, state }) => (
  <div className='space-y-2'>
    <div className='h-48 space-y-2 overflow-y-auto rounded border p-3'>
      {data.slice(-10).map(message => (
        <div key={message.id} className='flex items-start justify-between'>
          <div className='flex-1'>
            <span className='font-medium text-slate-900'>{message.user}: </span>
            <span className='text-slate-700'>{message.message}</span>
          </div>
          <span className='ml-2 text-xs text-slate-500'>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
    <div className='flex justify-between text-xs text-slate-500'>
      <span>{data.length} messages</span>
      <span>Status: {state.status}</span>
    </div>
  </div>
);

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source: string;
}

const LogDisplay: React.FC<{
  data: LogEntry[];
  state: RealtimeUpdateState;
}> = ({ data, state }) => (
  <div className='space-y-2'>
    <div className='h-64 space-y-1 overflow-y-auto rounded bg-slate-900 p-3 font-mono text-sm'>
      {data.slice(-20).map((log, index) => (
        <div
          key={index}
          className={`flex gap-2 ${
            log.level === 'error'
              ? 'text-red-400'
              : log.level === 'warn'
                ? 'text-yellow-400'
                : 'text-green-400'
          }`}
        >
          <span className='text-slate-400'>
            {new Date(log.timestamp).toISOString()}
          </span>
          <span className='uppercase'>[{log.level}]</span>
          <span className='text-slate-300'>{log.source}:</span>
          <span>{log.message}</span>
        </div>
      ))}
    </div>
    <div className='flex justify-between text-xs text-slate-500'>
      <span>{data.length} log entries</span>
      <span>Status: {state.status}</span>
    </div>
  </div>
);

// ===== DEMO CONFIGURATIONS =====

const demoConfigurations = {
  metrics: {
    config: {
      endpoint: 'ws://localhost:3001/metrics',
      pollingEndpoint: 'http://localhost:3001/api/metrics',
      updateInterval: 2000,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
    } as ConnectionConfig,
    options: {
      mode: 'hybrid' as UpdateMode,
      format: 'json' as const,
      validate: true,
      debounceMs: 500,
    } as UpdateOptions,
    initialData: {
      timestamp: new Date().toISOString(),
      activeUsers: 1247,
      cpuUsage: 65.2,
      memoryUsage: 78.9,
      responseTime: 142,
    } as MetricsData,
    component: MetricsDisplay,
  },
  chat: {
    config: {
      endpoint: 'ws://localhost:3001/chat',
      authToken: 'demo-chat-token',
      updateInterval: 1000,
    } as ConnectionConfig,
    options: {
      mode: 'websocket' as UpdateMode,
      format: 'json' as const,
      debounceMs: 100,
    } as UpdateOptions,
    initialData: [
      {
        id: '1',
        user: 'Alice',
        message: 'Welcome to the demo chat!',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        user: 'Bob',
        message: 'Real-time updates are working great!',
        timestamp: new Date().toISOString(),
      },
    ] as ChatMessage[],
    component: ChatDisplay,
  },
  logs: {
    config: {
      endpoint: 'http://localhost:3001/api/logs/stream',
      updateInterval: 5000,
    } as ConnectionConfig,
    options: {
      mode: 'polling' as UpdateMode,
      format: 'json' as const,
      validate: true,
    } as UpdateOptions,
    initialData: [
      {
        level: 'info' as const,
        message: 'Application started successfully',
        timestamp: new Date().toISOString(),
        source: 'server',
      },
      {
        level: 'info' as const,
        message: 'Database connection established',
        timestamp: new Date().toISOString(),
        source: 'database',
      },
    ] as LogEntry[],
    component: LogDisplay,
  },
};

// ===== MAIN DEMO COMPONENT =====

export const RealtimeUpdatesDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] =
    useState<keyof typeof demoConfigurations>('metrics');
  const [isTestMode, setIsTestMode] = useState(true);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [updateCount, setUpdateCount] = useState(0);

  const config = demoConfigurations[selectedDemo];

  const handleStatusChange = (status: ConnectionStatus) => {
    setConnectionStatus(status);
  };

  const handleUpdate = () => {
    setUpdateCount(prev => prev + 1);
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold text-slate-900'>
          RealtimeUpdates Demo
        </h1>
        <p className='text-lg text-slate-600'>
          Live data streaming component with WebSocket and polling support
        </p>
      </div>

      {/* Controls */}
      <div className={DESIGN_TOKENS.recipe.card.base + ' space-y-4 p-6'}>
        <h2 className='text-xl font-semibold'>Demo Configuration</h2>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Demo Type
            </label>
            <select
              value={selectedDemo}
              onChange={e =>
                setSelectedDemo(
                  e.target.value as keyof typeof demoConfigurations
                )
              }
              className={DESIGN_TOKENS.recipe.input.base}
            >
              <option value='metrics'>System Metrics</option>
              <option value='chat'>Live Chat</option>
              <option value='logs'>Log Stream</option>
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Connection Mode
            </label>
            <div className='flex items-center gap-2'>
              <span
                className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                  connectionStatus === 'connected'
                    ? 'bg-green-100 text-green-800'
                    : connectionStatus === 'connecting'
                      ? 'bg-yellow-100 text-yellow-800'
                      : connectionStatus === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {connectionStatus}
              </span>
              <span className='text-sm text-slate-500'>
                {config.options.mode}
              </span>
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Test Mode
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={isTestMode}
                onChange={e => setIsTestMode(e.target.checked)}
                className='rounded'
              />
              <span className='ml-2 text-sm'>Enable (simulates data)</span>
            </label>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {updateCount}
            </div>
            <div className='text-sm text-slate-600'>Updates Received</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {config.config.updateInterval || 'N/A'}ms
            </div>
            <div className='text-sm text-slate-600'>Update Interval</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {config.options.debounceMs}ms
            </div>
            <div className='text-sm text-slate-600'>Debounce</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {config.config.maxReconnectAttempts || 'Unlimited'}
            </div>
            <div className='text-sm text-slate-600'>Max Reconnects</div>
          </div>
        </div>
      </div>

      {/* Live Data Display */}
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-6'}>
        <h2 className='mb-4 text-xl font-semibold'>Live Data Stream</h2>

        <RealtimeUpdates
          config={config.config}
          options={config.options}
          component={config.component as any}
          initialData={config.initialData}
          onStatusChange={handleStatusChange}
          onUpdate={handleUpdate}
          testMode={isTestMode}
          autoConnect={true}
          fallbackPolling={true}
          data-testid='demo-realtime-updates'
        />
      </div>

      {/* Feature Overview */}
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-6'}>
        <h2 className='mb-4 text-xl font-semibold'>Component Features</h2>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-3'>
            <h3 className='font-medium text-slate-900'>
              Connection Management
            </h3>
            <ul className='space-y-1 text-sm text-slate-600'>
              <li>• WebSocket real-time connections</li>
              <li>• HTTP polling fallback</li>
              <li>• Automatic reconnection with exponential backoff</li>
              <li>• Connection state monitoring</li>
              <li>• Custom timeout handling</li>
            </ul>
          </div>

          <div className='space-y-3'>
            <h3 className='font-medium text-slate-900'>Data Processing</h3>
            <ul className='space-y-1 text-sm text-slate-600'>
              <li>• JSON and text format support</li>
              <li>• Data validation and transformation</li>
              <li>• Debounced updates for performance</li>
              <li>• Memory leak prevention</li>
              <li>• Error recovery strategies</li>
            </ul>
          </div>

          <div className='space-y-3'>
            <h3 className='font-medium text-slate-900'>Developer Experience</h3>
            <ul className='space-y-1 text-sm text-slate-600'>
              <li>• TypeScript support with strict typing</li>
              <li>• Comprehensive test mode</li>
              <li>• Custom loading and error components</li>
              <li>• Event callbacks for integration</li>
              <li>• SSOT design token compliance</li>
            </ul>
          </div>

          <div className='space-y-3'>
            <h3 className='font-medium text-slate-900'>Enterprise Features</h3>
            <ul className='space-y-1 text-sm text-slate-600'>
              <li>• Authentication token support</li>
              <li>• Custom headers configuration</li>
              <li>• Performance monitoring</li>
              <li>• Debug information in development</li>
              <li>• Accessibility compliance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className={DESIGN_TOKENS.recipe.card.base + ' p-6'}>
        <h2 className='mb-4 text-xl font-semibold'>Usage Examples</h2>

        <div className='space-y-4'>
          <div>
            <h3 className='mb-2 font-medium text-slate-900'>
              Basic Real-time Metrics
            </h3>
            <pre
              className={
                DESIGN_TOKENS.recipe.text.code + ' overflow-x-auto text-xs'
              }
            >
              {`<RealtimeUpdates
  config={{
    endpoint: 'ws://api.example.com/metrics',
    updateInterval: 2000,
    maxReconnectAttempts: 5
  }}
  component={MetricsDisplay}
  onUpdate={(data) => console.log('New metrics:', data)}
  autoConnect={true}
  fallbackPolling={true}
/>`}
            </pre>
          </div>

          <div>
            <h3 className='mb-2 font-medium text-slate-900'>
              Authenticated WebSocket with Validation
            </h3>
            <pre
              className={
                DESIGN_TOKENS.recipe.text.code + ' overflow-x-auto text-xs'
              }
            >
              {`<RealtimeUpdates
  config={{
    endpoint: 'wss://secure.example.com/live',
    authToken: 'bearer-token',
    headers: { 'X-Client-Version': '1.0' }
  }}
  options={{
    mode: 'websocket',
    validate: (data) => data && data.version === '1.0',
    debounceMs: 300
  }}
  component={DataDisplay}
  transform={(raw) => ({ ...raw, processed: true })}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeUpdatesDemo;
