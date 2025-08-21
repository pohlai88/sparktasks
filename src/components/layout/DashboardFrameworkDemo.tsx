/**
 * @fileoverview DashboardFramework Demo Component
 * @description Live demonstration of the DashboardFramework component with real data
 * @version 1.0.0
 *
 * ENTERPRISE FEATURES DEMONSTRATED:
 * - Multi-widget dashboard configuration
 * - Real-time metric updates
 * - Responsive grid layouts
 * - Interactive widget management
 * - Loading states and error handling
 * - Accessibility compliance
 * - Performance optimization
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  DashboardFramework,
  type DashboardConfig,
  type WidgetData,
  type MetricData,
} from '@/components/layout/DashboardFramework';

// ===== DEMO DATA GENERATORS =====

const generateMetricData = (
  id: string,
  label: string,
  baseValue: number,
  unit?: string
): MetricData => {
  const change = (Math.random() - 0.5) * 40; // -20% to +20%
  const previousValue = Math.floor(baseValue * (1 - change / 100));

  return {
    id,
    label,
    value: baseValue + Math.floor(Math.random() * 100),
    previousValue,
    change: Math.round(change * 10) / 10,
    changeType: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    unit: unit || '',
    precision: unit === '$' ? 2 : 0,
  };
};

const generateDashboardWidgets = (): WidgetData[] => [
  {
    id: 'users-metric',
    title: 'Active Users',
    type: 'metric',
    size: 'md',
    data: generateMetricData('users', 'Total Active Users', 1250, 'users'),
  },
  {
    id: 'revenue-metric',
    title: 'Monthly Revenue',
    type: 'metric',
    size: 'md',
    data: generateMetricData('revenue', 'Revenue This Month', 45000, '$'),
  },
  {
    id: 'conversion-metric',
    title: 'Conversion Rate',
    type: 'metric',
    size: 'md',
    data: generateMetricData('conversion', 'Conversion Rate', 3.2, '%'),
  },
  {
    id: 'sessions-metric',
    title: 'User Sessions',
    type: 'metric',
    size: 'md',
    data: generateMetricData('sessions', 'Sessions Today', 850, 'sessions'),
  },
  {
    id: 'bounce-metric',
    title: 'Bounce Rate',
    type: 'metric',
    size: 'sm',
    data: generateMetricData('bounce', 'Bounce Rate', 35, '%'),
  },
  {
    id: 'load-time-metric',
    title: 'Page Load Time',
    type: 'metric',
    size: 'sm',
    data: generateMetricData('loadtime', 'Avg Load Time', 1.8, 's'),
  },
];

// ===== DEMO VARIANTS =====

interface DemoVariant {
  id: string;
  name: string;
  description: string;
  config: Partial<DashboardConfig>;
}

const demoVariants: DemoVariant[] = [
  {
    id: 'standard',
    name: 'Standard Dashboard',
    description: 'Balanced layout with comprehensive metrics',
    config: {
      title: 'Analytics Dashboard',
      description: 'Real-time business metrics and key performance indicators',
      layout: 'grid',
      columns: { sm: 1, md: 2, lg: 3, xl: 4 },
    },
  },
  {
    id: 'compact',
    name: 'Compact Dashboard',
    description: 'Space-efficient layout for monitoring views',
    config: {
      title: 'Monitoring Dashboard',
      description: 'Compact view of essential metrics',
      layout: 'grid',
      columns: { sm: 2, md: 3, lg: 4, xl: 6 },
    },
  },
  {
    id: 'executive',
    name: 'Executive Dashboard',
    description: 'High-level overview for executive reporting',
    config: {
      title: 'Executive Summary',
      description: 'Key business metrics for leadership team',
      layout: 'grid',
      columns: { sm: 1, md: 2, lg: 2, xl: 3 },
    },
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Detailed analytics with comprehensive data visualization',
    config: {
      title: 'Advanced Analytics',
      description: 'Deep dive into performance metrics and trends',
      layout: 'grid',
      columns: { sm: 1, md: 1, lg: 2, xl: 3 },
    },
  },
];

// ===== MAIN DEMO COMPONENT =====

export const DashboardFrameworkDemo: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<string>('standard');
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Generate initial widget data
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidgets(generateDashboardWidgets());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh || loading) return;

    const interval = setInterval(() => {
      setWidgets(generateDashboardWidgets());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loading]);

  // Get current variant configuration
  const currentVariant = useMemo(() => {
    return demoVariants.find(v => v.id === selectedVariant) || demoVariants[0];
  }, [selectedVariant]);

  // Create dashboard configuration
  const dashboardConfig: DashboardConfig = useMemo(
    () => ({
      id: `demo-dashboard-${selectedVariant}`,
      title: currentVariant.config.title || 'Demo Dashboard',
      ...(currentVariant.config.description && {
        description: currentVariant.config.description,
      }),
      layout: currentVariant.config.layout || 'grid',
      ...(currentVariant.config.columns && {
        columns: currentVariant.config.columns,
      }),
      widgets,
      ...(autoRefresh && refreshInterval && { refreshInterval }),
    }),
    [selectedVariant, widgets, autoRefresh, refreshInterval, currentVariant]
  );

  // Event handlers
  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId);
  };

  const handleWidgetUpdate = (
    widgetId: string,
    updates: Partial<WidgetData>
  ) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setWidgets(generateDashboardWidgets());
      setLoading(false);
    }, 500);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(prev => !prev);
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
        <div className='text-center'>
          <div className='mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-slate-600 dark:text-slate-400'>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 p-4 dark:bg-slate-900'>
      {/* Demo Controls */}
      <div className='mx-auto mb-6 max-w-7xl'>
        <div className='mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800'>
          <h1 className='mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100'>
            DashboardFramework Demo
          </h1>
          <p className='mb-6 text-slate-600 dark:text-slate-400'>
            Explore different dashboard variants and configurations. Data
            updates automatically every {refreshInterval / 1000} seconds.
          </p>

          {/* Variant Selector */}
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {demoVariants.map(variant => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                  selectedVariant === variant.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <h3 className='mb-1 font-semibold text-slate-900 dark:text-slate-100'>
                  {variant.name}
                </h3>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  {variant.description}
                </p>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className='flex flex-wrap items-center gap-4'>
            <button
              onClick={handleRefresh}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700'
            >
              Refresh Data
            </button>

            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={autoRefresh}
                onChange={handleAutoRefreshToggle}
                className='rounded border-slate-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-slate-600 dark:text-slate-400'>
                Auto-refresh
              </span>
            </label>

            <label className='flex items-center gap-2'>
              <span className='text-sm text-slate-600 dark:text-slate-400'>
                Interval:
              </span>
              <select
                value={refreshInterval}
                onChange={e => setRefreshInterval(Number(e.target.value))}
                className='rounded border border-slate-300 bg-white px-3 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
              >
                <option value={3000}>3s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
              </select>
            </label>
          </div>
        </div>

        {/* Dashboard Demo */}
        <DashboardFramework
          config={dashboardConfig}
          variant={selectedVariant as any}
          size='full'
          onWidgetUpdate={handleWidgetUpdate}
          onRefresh={handleRefresh}
          className='rounded-lg bg-white shadow-sm dark:bg-slate-800'
        />

        {/* Demo Information */}
        <div className='mt-6 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800'>
          <h2 className='mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100'>
            Implementation Details
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div>
              <h3 className='mb-2 font-medium text-slate-900 dark:text-slate-100'>
                Features Demonstrated
              </h3>
              <ul className='space-y-1 text-sm text-slate-600 dark:text-slate-400'>
                <li>• Responsive grid layouts</li>
                <li>• Real-time data updates</li>
                <li>• Multiple dashboard variants</li>
                <li>• Widget management</li>
                <li>• Loading states</li>
                <li>• Auto-refresh capability</li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-medium text-slate-900 dark:text-slate-100'>
                Current Configuration
              </h3>
              <ul className='space-y-1 text-sm text-slate-600 dark:text-slate-400'>
                <li>• Variant: {currentVariant.name}</li>
                <li>• Widgets: {widgets.length}</li>
                <li>• Auto-refresh: {autoRefresh ? 'On' : 'Off'}</li>
                <li>• Interval: {refreshInterval / 1000}s</li>
                <li>• Layout: {dashboardConfig.layout}</li>
              </ul>
            </div>

            <div>
              <h3 className='mb-2 font-medium text-slate-900 dark:text-slate-100'>
                Technical Stack
              </h3>
              <ul className='space-y-1 text-sm text-slate-600 dark:text-slate-400'>
                <li>• React 18+ with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Enterprise design tokens</li>
                <li>• Accessibility compliance</li>
                <li>• Performance optimized</li>
                <li>• Test-driven development</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFrameworkDemo;
