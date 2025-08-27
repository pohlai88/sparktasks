/**
 * Data-Enhanced Component Types - MAPS v3.0
 * Comprehensive TypeScript interfaces for all 8 core components
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { FieldErrors, FieldValues } from 'react-hook-form';
import type { ZodSchema } from 'zod';

// ===== 1. SIMPLE TABLE TYPES =====
export interface SimpleTableProps<TData = unknown> {
  // Core Data (80% use cases)
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  error?: Error | null;

  // MAPS Integration
  density?: 'compact' | 'comfortable' | 'spacious';
  surface?: 'elevated' | 'glass';
  striped?: boolean;

  // Essential Features
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean | 'single' | 'multiple';
  onRowClick?: (row: TData) => void;

  // Performance & UX
  pagination?: {
    pageSize?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
  };

  // Customization
  className?: string;
  emptyState?: React.ReactNode;
  rowActions?: (row: TData) => React.ReactNode;
}

// ===== 2. TABLE TOOLBAR TYPES =====
export interface TableToolbarProps {
  // Search & Filter (80% operations)
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Filter System
  filters?: TableFilter[];
  onFilterChange?: (filters: TableFilter[]) => void;

  // Bulk Actions
  selectedCount?: number;
  bulkActions?: BulkAction[];
  onBulkAction?: (action: string, selectedRows: unknown[]) => void;

  // View Controls
  density?: 'compact' | 'comfortable' | 'spacious';
  onDensityChange?: (density: string) => void;
  showDensityToggle?: boolean;

  // Data Operations
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  showExport?: boolean;

  // Custom Actions
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };

  // Layout
  position?: 'above' | 'below' | 'floating';
  surface?: 'elevated' | 'glass';
  className?: string;
}

export interface TableFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  value?: unknown;
  options?: Array<{ label: string; value: unknown }>;
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  confirmMessage?: string;
}

// ===== 3. TABLE PAGINATION TYPES =====
export interface TablePaginationProps {
  // Pagination State
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  // Navigation
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Display Options
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: boolean;

  // Advanced Features
  showFirstLast?: boolean;
  adjacentCount?: number;
  boundaryCount?: number;

  // Performance
  virtualized?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;

  // Customization
  size?: 'sm' | 'md' | 'lg';
  surface?: 'elevated' | 'glass';
  position?: 'top' | 'bottom' | 'both';
  className?: string;

  // Accessibility
  ariaLabel?: string;
  pageAriaLabel?: (page: number) => string;
}

// ===== 4. TABLE EMPTY TYPES =====
export interface TableEmptyProps {
  // State Type
  variant?: 'no-data' | 'no-results' | 'error' | 'loading' | 'custom';

  // Content
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  illustration?: React.ReactNode;

  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  // Suggestions
  suggestions?: Array<{
    label: string;
    onClick: () => void;
  }>;

  // Customization
  size?: 'sm' | 'md' | 'lg';
  surface?: 'elevated' | 'glass';
  className?: string;

  // Loading State
  loading?: boolean;
  loadingText?: string;
}

// ===== 5. ENHANCED FORM TYPES =====
export interface EnhancedFormProps<TFormData extends FieldValues> {
  // Schema & Validation
  schema: ZodSchema<TFormData>;
  defaultValues?: Partial<TFormData>;

  // Submission
  onSubmit: (data: TFormData) => void | Promise<void>;
  onError?: (errors: FieldErrors<TFormData>) => void;

  // Layout & Appearance
  layout?: 'vertical' | 'horizontal' | 'inline';
  density?: 'compact' | 'comfortable' | 'spacious';
  surface?: 'elevated' | 'glass';

  // Form Behavior
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  reValidateMode?: 'onChange' | 'onBlur';
  resetOnSubmit?: boolean;

  // State Management
  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Field Configuration
  fields: FormFieldConfig<TFormData>[];

  // Actions
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  showReset?: boolean;

  // Advanced Features
  autoSave?: {
    enabled: boolean;
    debounceMs?: number;
    storageKey?: string;
  };

  // Customization
  className?: string;
  formClassName?: string;
  actionsClassName?: string;
}

export interface FormFieldConfig<TFormData extends FieldValues> {
  name: keyof TFormData;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;

  // Field-specific options
  options?: Array<{ label: string; value: unknown }>;
  multiple?: boolean;
  accept?: string;
  min?: number | string;
  max?: number | string;

  // Layout
  colSpan?: number;
  hidden?: boolean;

  // Validation
  customValidation?: (value: unknown) => string | undefined;
}

// ===== 6. FORM WIZARD TYPES =====
export interface FormWizardProps<TFormData extends FieldValues> {
  // Steps Configuration
  steps: FormWizardStep<TFormData>[];

  // Navigation
  currentStep?: number;
  onStepChange?: (step: number) => void;
  allowSkip?: boolean;
  allowBack?: boolean;

  // Data Management
  schema: ZodSchema<TFormData>;
  defaultValues?: Partial<TFormData>;
  onSubmit: (data: TFormData) => void | Promise<void>;

  // Progress Display
  showProgress?: boolean;
  progressVariant?: 'steps' | 'bar' | 'dots';

  // Validation Strategy
  validateOnStepChange?: boolean;
  saveOnStepChange?: boolean;

  // Navigation Controls
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  skipLabel?: string;

  // State
  loading?: boolean;
  disabled?: boolean;

  // Customization
  surface?: 'elevated' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface FormWizardStep<TFormData extends FieldValues> {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;

  // Content
  component: React.ComponentType<FormWizardStepProps<TFormData>>;
  fields?: FormFieldConfig<TFormData>[];

  // Validation
  validation?: ZodSchema;
  required?: boolean;

  // Navigation
  skipable?: boolean;
  backable?: boolean;

  // Conditional Logic
  condition?: (data: Partial<TFormData>) => boolean;
}

export interface FormWizardStepProps<TFormData extends FieldValues> {
  data: Partial<TFormData>;
  updateData: (data: Partial<TFormData>) => void;
  errors: FieldErrors<TFormData>;
  goNext: () => void;
  goBack: () => void;
  skip: () => void;
}

// ===== 7. BAR CHART TYPES =====
export interface BarChartProps {
  // Data
  data: Array<Record<string, unknown>>;
  keys: string[];
  indexBy: string;

  // Chart Configuration
  layout?: 'horizontal' | 'vertical';
  groupMode?: 'stacked' | 'grouped';

  // Styling
  colors?: string[] | ((data: unknown) => string);
  surface?: 'elevated' | 'glass';
  theme?: 'light' | 'dark' | 'auto';

  // Dimensions
  height?: number;
  width?: number | 'auto';
  margin?: { top?: number; right?: number; bottom?: number; left?: number };

  // Interactivity
  onClick?: (data: unknown, event: React.MouseEvent) => void;
  onHover?: (data: unknown | null) => void;
  tooltip?: boolean | React.ComponentType;

  // Axes & Labels
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGridLines?: boolean;

  // Data Formatting
  valueFormat?: (value: number) => string;
  labelFormat?: (label: string) => string;

  // Animation
  animate?: boolean;
  animationDuration?: number;

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;

  // State
  loading?: boolean;
  error?: Error | null;
  empty?: React.ReactNode;

  // Export
  exportable?: boolean;
  exportFormats?: Array<'png' | 'svg' | 'pdf'>;

  className?: string;
}

// ===== 8. LINE CHART TYPES =====
export interface LineChartProps {
  // Data
  data: Array<Record<string, unknown>>;
  xScale: {
    type: 'linear' | 'time' | 'point';
    format?: string;
    min?: unknown;
    max?: unknown;
  };
  yScale: {
    type: 'linear' | 'log';
    min?: number | 'auto';
    max?: number | 'auto';
    format?: (value: number) => string;
  };

  // Series Configuration
  lines: LineSeriesConfig[];

  // Chart Behavior
  curve?: 'linear' | 'cardinal' | 'catmullRom' | 'step';
  connectNulls?: boolean;

  // Styling
  colors?: string[] | ((series: string) => string);
  surface?: 'elevated' | 'glass';
  theme?: 'light' | 'dark' | 'auto';

  // Dimensions
  height?: number;
  width?: number | 'auto';
  margin?: { top?: number; right?: number; bottom?: number; left?: number };

  // Interactivity
  crosshair?: boolean;
  zoom?: boolean;
  brush?: boolean;
  onClick?: (point: unknown, event: React.MouseEvent) => void;
  onZoom?: (domain: [Date, Date]) => void;

  // Axes & Grid
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGridLines?: 'both' | 'x' | 'y' | 'none';

  // Annotations
  annotations?: LineAnnotation[];
  markers?: LineMarker[];

  // Performance
  sampling?: boolean;
  maxPoints?: number;

  // Real-time
  realtime?: boolean;
  realtimeConfig?: {
    updateInterval: number;
    maxHistory: number;
    paused?: boolean;
  };

  // State
  loading?: boolean;
  error?: Error | null;
  empty?: React.ReactNode;

  className?: string;
}

export interface LineSeriesConfig {
  id: string;
  label: string;
  dataKey: string;
  color?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  area?: boolean;
  visible?: boolean;
}

export interface LineAnnotation {
  type: 'vertical' | 'horizontal' | 'point';
  value: unknown;
  label?: string;
  color?: string;
}

export interface LineMarker {
  x: unknown;
  y: unknown;
  label?: string;
  color?: string;
  size?: number;
}

// ===== UTILITY TYPES =====
export interface DataDisplayProps {
  data: unknown;
  format?: 'json' | 'table' | 'list';
  searchable?: boolean;
  collapsible?: boolean;
  maxHeight?: number;
}

export interface VirtualListProps<TItem = unknown> {
  items: TItem[];
  itemHeight: number;
  renderItem: (item: TItem, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

// ===== HOOK TYPES =====
export interface UseTableDataOptions {
  queryKey: string[];
  queryFn: () => Promise<unknown>;
  enabled?: boolean;
  refetchInterval?: number;
}

export interface UseFormValidationOptions<TData extends FieldValues> {
  schema: ZodSchema<TData>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  debounceMs?: number;
}
