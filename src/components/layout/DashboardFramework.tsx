/**
 * @fileoverview DashboardFramework - Analytics and metrics framework
 *
 * @description Enterprise-grade dashboard system for analytics, metrics, and data visualization.
 * Provides responsive grid layouts, metric cards, chart containers, and flexible widget system
 * following Fortune 500 quality standards with full DESIGN_TOKENS V3.2 integration.
 *
 * @version 1.0.0
 * @since 2025-08-21
 */

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

// ===== TYPE DEFINITIONS =====

export type DashboardVariant =
  | 'standard'
  | 'compact'
  | 'executive'
  | 'analytics';
export type DashboardSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DashboardLayout = 'grid' | 'masonry' | 'flexible' | 'fixed';

export type MetricVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';
export type MetricSize = 'sm' | 'md' | 'lg';
export type MetricTrend = 'up' | 'down' | 'neutral';

export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl' | 'auto';
export type WidgetType = 'metric' | 'chart' | 'table' | 'text' | 'custom';

// ===== INTERFACES =====

export interface MetricData {
  id: string;
  label: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeType?: MetricTrend;
  unit?: string;
  precision?: number;
  formatter?: (value: string | number) => string;
}

export interface WidgetData {
  id: string;
  title: string;
  type: WidgetType;
  size: WidgetSize;
  data?: any;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
  visible?: boolean;
  loading?: boolean;
  error?: string;
}

export interface DashboardConfig {
  id: string;
  title: string;
  description?: string;
  layout: DashboardLayout;
  columns?: { sm?: number; md?: number; lg?: number; xl?: number };
  widgets: WidgetData[];
  refreshInterval?: number;
  autoRefresh?: boolean;
}

// ===== CONTEXT =====

interface DashboardContextType {
  config: DashboardConfig | null;
  updateWidget: (widgetId: string, updates: Partial<WidgetData>) => void;
  refreshDashboard: () => void;
  isRefreshing: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

// ===== HOOK =====

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// ===== MAIN COMPONENT INTERFACES =====

export interface DashboardFrameworkProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DashboardVariant;
  size?: DashboardSize;
  config: DashboardConfig;
  onWidgetUpdate?: (widgetId: string, updates: Partial<WidgetData>) => void;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: MetricData;
  variant?: MetricVariant;
  size?: MetricSize;
  showTrend?: boolean;
  showChange?: boolean;
  loading?: boolean;
  className?: string;
}

export interface WidgetContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  widget: WidgetData;
  size?: WidgetSize;
  onUpdate?: (updates: Partial<WidgetData>) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface DashboardGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  layout?: DashboardLayout;
  columns?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export interface DashboardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

// ===== PROVIDER COMPONENT =====

export interface DashboardProviderProps {
  config: DashboardConfig;
  onWidgetUpdate?: (widgetId: string, updates: Partial<WidgetData>) => void;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export const DashboardProvider = ({
  config,
  onWidgetUpdate,
  onRefresh,
  children,
}: DashboardProviderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateWidget = useCallback(
    (widgetId: string, updates: Partial<WidgetData>) => {
      onWidgetUpdate?.(widgetId, updates);
    },
    [onWidgetUpdate]
  );

  const refreshDashboard = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [onRefresh]);

  const value = useMemo(
    () => ({
      config,
      updateWidget,
      refreshDashboard,
      isRefreshing,
    }),
    [config, updateWidget, refreshDashboard, isRefreshing]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// ===== METRIC CARD COMPONENT =====

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    {
      data,
      variant = 'default',
      size = 'md',
      showTrend = true,
      showChange = true,
      loading = false,
      className = '',
      ...props
    },
    ref
  ) {
    const formatValue = useCallback(
      (value: string | number) => {
        if (data.formatter) {
          return data.formatter(value);
        }

        if (typeof value === 'number' && data.precision !== undefined) {
          return value.toFixed(data.precision);
        }

        return String(value);
      },
      [data.formatter, data.precision]
    );

    const calculateChange = useCallback(() => {
      if (!data.previousValue || !data.change) return null;

      const changeType =
        data.changeType ||
        (data.change > 0 ? 'up' : data.change < 0 ? 'down' : 'neutral');

      return {
        value: Math.abs(data.change),
        type: changeType,
        formatted: `${data.change > 0 ? '+' : ''}${data.change.toFixed(1)}%`,
      };
    }, [data.previousValue, data.change, data.changeType]);

    const change = calculateChange();

    const getVariantClasses = () => {
      const baseClasses = DESIGN_TOKENS.dataViz.metricCard;

      const variantClasses = {
        default: '',
        primary:
          'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-950/30',
        success:
          'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/30',
        warning:
          'border-yellow-200 dark:border-yellow-800 bg-yellow-50/30 dark:bg-yellow-950/30',
        danger:
          'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/30',
      };

      return `${baseClasses} ${variantClasses[variant]}`;
    };

    const getSizeClasses = () => {
      const sizeClasses = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      };
      return sizeClasses[size];
    };

    const getTrendIcon = (trendType: MetricTrend) => {
      const icons = {
        up: '↗️',
        down: '↘️',
        neutral: '➡️',
      };
      return icons[trendType];
    };

    const getTrendClasses = (trendType: MetricTrend) => {
      const classes = {
        up: DESIGN_TOKENS.dataViz.metricChangePositive,
        down: DESIGN_TOKENS.dataViz.metricChangeNegative,
        neutral: 'text-slate-600 dark:text-slate-400',
      };
      return classes[trendType];
    };

    if (loading) {
      return (
        <div
          ref={ref}
          className={`${getVariantClasses()} ${getSizeClasses()} animate-pulse ${className}`}
          data-testid='metric-card-loading'
          {...props}
        >
          <div className='mb-2 h-4 rounded bg-slate-200 dark:bg-slate-700'></div>
          <div className='mb-1 h-8 rounded bg-slate-200 dark:bg-slate-700'></div>
          {showChange && (
            <div className='h-3 w-16 rounded bg-slate-200 dark:bg-slate-700'></div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}
        data-testid='metric-card'
        data-metric-id={data.id}
        {...props}
      >
        <div className={DESIGN_TOKENS.dataViz.metricLabel}>{data.label}</div>

        <div className='flex items-baseline justify-between'>
          <div className={DESIGN_TOKENS.dataViz.metricValue}>
            {formatValue(data.value)}
            {data.unit && (
              <span className='ml-1 text-sm font-normal text-slate-500 dark:text-slate-400'>
                {data.unit}
              </span>
            )}
          </div>

          {showTrend && change && (
            <div className='flex items-center'>
              <span className='mr-1'>{getTrendIcon(change.type)}</span>
            </div>
          )}
        </div>

        {showChange && change && (
          <div
            className={`${DESIGN_TOKENS.dataViz.metricChange} ${getTrendClasses(change.type)} mt-1 flex items-center`}
          >
            <span>{change.formatted}</span>
            <span className='ml-1 text-slate-500 dark:text-slate-400'>
              vs previous
            </span>
          </div>
        )}
      </div>
    );
  }
);

// ===== WIDGET CONTAINER COMPONENT =====

export const WidgetContainer = forwardRef<HTMLDivElement, WidgetContainerProps>(
  function WidgetContainer(
    {
      widget,
      size,
      onUpdate,
      loading = false,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const getWidgetSizeClasses = () => {
      const actualSize = size || widget.size || 'md';

      const sizeClasses = {
        sm: 'col-span-1 row-span-1 min-h-[200px]',
        md: 'col-span-1 md:col-span-2 row-span-1 min-h-[300px]',
        lg: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2 min-h-[400px]',
        xl: 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 row-span-2 min-h-[500px]',
        auto: 'col-span-1 row-span-1 h-auto',
      };

      return sizeClasses[actualSize];
    };

    const handleUpdate = useCallback(
      (updates: Partial<WidgetData>) => {
        onUpdate?.(updates);
      },
      [onUpdate]
    );

    if (!widget.visible) {
      return null;
    }

    if (loading || widget.loading) {
      return (
        <div
          ref={ref}
          className={`${DESIGN_TOKENS.dataViz.chartContainer} ${getWidgetSizeClasses()} animate-pulse ${className}`}
          data-testid='widget-loading'
          data-widget-id={widget.id}
          {...props}
        >
          <div className='mb-4 h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-700'></div>
          <div className='h-full rounded bg-slate-200 dark:bg-slate-700'></div>
        </div>
      );
    }

    if (widget.error) {
      return (
        <div
          ref={ref}
          className={`${DESIGN_TOKENS.dataViz.chartContainer} ${getWidgetSizeClasses()} ${className}`}
          data-testid='widget-error'
          data-widget-id={widget.id}
          {...props}
        >
          <div className='flex h-full flex-col items-center justify-center text-center'>
            <div className='mb-2 text-2xl text-red-500'>⚠️</div>
            <div className='mb-1 text-sm font-medium text-slate-900 dark:text-slate-100'>
              Widget Error
            </div>
            <div className='text-xs text-slate-600 dark:text-slate-400'>
              {widget.error}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${DESIGN_TOKENS.dataViz.chartContainer} ${getWidgetSizeClasses()} ${className}`}
        data-testid='widget-container'
        data-widget-id={widget.id}
        data-widget-type={widget.type}
        {...props}
      >
        {widget.title && (
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
              {widget.title}
            </h3>
          </div>
        )}

        <div className='flex-1 overflow-hidden'>
          {widget.component && widget.data ? (
            <widget.component
              data={widget.data}
              onUpdate={handleUpdate}
              {...(widget.props || {})}
            />
          ) : children ? (
            children
          ) : (
            <div className='flex h-full items-center justify-center text-slate-500 dark:text-slate-400'>
              <div className='text-center'>
                <div className='mb-2 text-2xl'>📊</div>
                <div className='text-sm'>Widget content</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// ===== DASHBOARD GRID COMPONENT =====

export const DashboardGrid = forwardRef<HTMLDivElement, DashboardGridProps>(
  function DashboardGrid(
    {
      layout = 'grid',
      columns = { sm: 1, md: 2, lg: 3, xl: 4 },
      gap = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const getLayoutClasses = () => {
      const gapClasses = {
        sm: 'gap-4',
        md: 'gap-6',
        lg: 'gap-8',
      };

      if (layout === 'grid') {
        const colClasses = `grid-cols-${columns.sm || 1} md:grid-cols-${columns.md || 2} lg:grid-cols-${columns.lg || 3} xl:grid-cols-${columns.xl || 4}`;
        return `grid ${colClasses} ${gapClasses[gap]} auto-rows-min`;
      }

      if (layout === 'masonry') {
        return `columns-1 md:columns-2 lg:columns-3 xl:columns-4 ${gapClasses[gap]}`;
      }

      if (layout === 'flexible') {
        return `flex flex-wrap ${gapClasses[gap]}`;
      }

      // fixed layout
      return `grid ${gapClasses[gap]}`;
    };

    return (
      <div
        ref={ref}
        className={`${getLayoutClasses()} ${className}`}
        data-testid='dashboard-grid'
        data-layout={layout}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// ===== DASHBOARD HEADER COMPONENT =====

export const DashboardHeader = forwardRef<HTMLDivElement, DashboardHeaderProps>(
  function DashboardHeader(
    {
      title,
      description,
      actions,
      showRefresh = true,
      onRefresh,
      isRefreshing = false,
      className = '',
      ...props
    },
    ref
  ) {
    const handleRefresh = useCallback(() => {
      if (!isRefreshing && onRefresh) {
        onRefresh();
      }
    }, [isRefreshing, onRefresh]);

    return (
      <div
        ref={ref}
        className={`mb-6 flex items-center justify-between ${className}`}
        data-testid='dashboard-header'
        {...props}
      >
        <div>
          <h1 className={DESIGN_TOKENS.typography.heading.h1}>{title}</h1>
          {description && (
            <p className={`${DESIGN_TOKENS.typography.body.secondary} mt-1`}>
              {description}
            </p>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {actions && <div className='flex items-center gap-2'>{actions}</div>}

          {showRefresh && (
            <button
              type='button'
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                isRefreshing
                  ? 'cursor-not-allowed text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              data-testid='refresh-button'
            >
              <span
                className={`text-base ${isRefreshing ? 'animate-spin' : ''}`}
              >
                🔄
              </span>
              Refresh
            </button>
          )}
        </div>
      </div>
    );
  }
);

// ===== MAIN DASHBOARD FRAMEWORK COMPONENT =====

export const DashboardFramework = forwardRef<
  HTMLDivElement,
  DashboardFrameworkProps
>(function DashboardFramework(
  {
    variant = 'standard',
    size = 'full',
    config,
    onWidgetUpdate,
    onRefresh,
    loading = false,
    error,
    className = '',
    ...props
  },
  ref
) {
  const getVariantClasses = () => {
    const variantClasses = {
      standard: '',
      compact: 'text-sm',
      executive: 'bg-slate-50 dark:bg-slate-950',
      analytics:
        'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900',
    };
    return variantClasses[variant];
  };

  const getSizeClasses = () => {
    const sizeClasses = {
      sm: 'max-w-4xl',
      md: 'max-w-6xl',
      lg: 'max-w-7xl',
      xl: 'max-w-8xl',
      full: 'w-full',
    };
    return sizeClasses[size];
  };

  const renderWidget = useCallback(
    (widget: WidgetData) => {
      if (widget.type === 'metric' && widget.data) {
        return (
          <MetricCard
            key={widget.id}
            data={widget.data}
            {...(widget.loading !== undefined && { loading: widget.loading })}
            className='h-full'
          />
        );
      }

      return (
        <WidgetContainer
          key={widget.id}
          widget={widget}
          onUpdate={updates => onWidgetUpdate?.(widget.id, updates)}
          {...(widget.loading !== undefined && { loading: widget.loading })}
        />
      );
    },
    [onWidgetUpdate]
  );

  if (loading) {
    return (
      <div
        ref={ref}
        className={`${getVariantClasses()} ${getSizeClasses()} mx-auto p-6 ${className}`}
        data-testid='dashboard-loading'
        {...props}
      >
        <div className='animate-pulse'>
          <div className='mb-2 h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-700'></div>
          <div className='mb-6 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700'></div>
          <DashboardGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='h-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700'
              ></div>
            ))}
          </DashboardGrid>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={ref}
        className={`${getVariantClasses()} ${getSizeClasses()} mx-auto p-6 ${className}`}
        data-testid='dashboard-error'
        {...props}
      >
        <div className='py-12 text-center'>
          <div className='mb-4 text-4xl text-red-500'>⚠️</div>
          <h2 className='mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100'>
            Dashboard Error
          </h2>
          <p className='text-slate-600 dark:text-slate-400'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider
      config={config}
      {...(onWidgetUpdate && { onWidgetUpdate })}
      {...(onRefresh && { onRefresh })}
    >
      <div
        ref={ref}
        className={`${getVariantClasses()} ${getSizeClasses()} mx-auto p-6 ${className}`}
        data-testid='dashboard-framework'
        data-variant={variant}
        {...props}
      >
        <DashboardHeader
          title={config.title}
          {...(config.description && { description: config.description })}
          {...(onRefresh && { onRefresh })}
          showRefresh={Boolean(onRefresh)}
        />

        <DashboardGrid
          layout={config.layout}
          {...(config.columns && { columns: config.columns })}
        >
          {config.widgets.map(renderWidget)}
        </DashboardGrid>
      </div>
    </DashboardProvider>
  );
});

// ===== EXPORTS =====

export default DashboardFramework;
