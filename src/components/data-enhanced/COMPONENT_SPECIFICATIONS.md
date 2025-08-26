# 📊 DATA-ENHANCED: 8 Core Components Specification

## Strategic Framework: 80% Simple + 20% Enterprise

### Core Philosophy
- **80% Coverage**: Simple components handle most business use cases
- **20% Enterprise**: Adapter pattern for complex requirements
- **100% Governance**: All components styled through MAPS tokens

---

## 🏗️ **Component Architecture Overview**

### **Component Category 1: Table System (4 Components)**
Handle data presentation, manipulation, and interaction

### **Component Category 2: Form System (2 Components)**  
Handle data input, validation, and submission

### **Component Category 3: Visualization System (2 Components)**
Handle data analysis and chart presentation

---

## 📋 **1. SimpleTable - Primary Data Table**

### **Purpose**
Universal data table component handling 80% of table use cases with excellent performance and accessibility.

### **Core Specifications**
```typescript
interface SimpleTableProps<TData> {
  // Data Management
  data: TData[]                           // Table data array
  columns: ColumnDef<TData>[]             // TanStack column definitions
  loading?: boolean                       // Loading state
  error?: Error | null                    // Error state
  
  // Display Options
  density?: 'compact' | 'comfortable' | 'spacious'  // Row spacing
  surface?: 'elevated' | 'glass'          // MAPS surface style
  striped?: boolean                       // Alternating row colors
  
  // Interaction Features
  sortable?: boolean                      // Enable column sorting
  filterable?: boolean                    // Enable column filtering
  selectable?: boolean | 'single' | 'multiple' // Row selection
  onRowClick?: (row: TData) => void      // Row click handler
  
  // Pagination
  pagination?: {
    pageSize?: number                     // Rows per page
    showSizeChanger?: boolean            // Page size selector
    showQuickJumper?: boolean            // Page jump input
  }
  
  // Customization
  className?: string
  emptyState?: React.ReactNode           // Custom empty state
  rowActions?: (row: TData) => React.ReactNode // Row action buttons
}
```

### **80% Use Cases Coverage**
- ✅ User lists, data grids, admin panels
- ✅ Sort/filter/search functionality
- ✅ Basic row selection and actions
- ✅ Responsive design with density options
- ✅ Loading states and error handling
- ✅ Accessibility with keyboard navigation

### **Dependencies**
- `@tanstack/react-table` - Core table functionality
- `@tanstack/react-virtual` - Performance for large datasets
- MAPS design tokens - Styling and theming

### **Enterprise Escape Hatch**
When SimpleTable limitations are reached → `AGGridAdapter` for advanced features

---

## 🔧 **2. TableToolbar - Table Control Hub**

### **Purpose**
Centralized control panel for table operations including search, filters, bulk actions, and view options.

### **Core Specifications**
```typescript
interface TableToolbarProps {
  // Search & Filter
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  
  // Filter System
  filters?: TableFilter[]
  onFilterChange?: (filters: TableFilter[]) => void
  
  // Bulk Actions
  selectedCount?: number
  bulkActions?: BulkAction[]
  onBulkAction?: (action: string, selectedRows: unknown[]) => void
  
  // View Controls
  density?: 'compact' | 'comfortable' | 'spacious'
  onDensityChange?: (density: string) => void
  showDensityToggle?: boolean
  
  // Data Operations
  onRefresh?: () => void
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void
  showExport?: boolean
  
  // Custom Actions
  primaryAction?: {
    label: string
    icon?: React.ReactNode
    onClick: () => void
  }
  
  // Layout
  position?: 'above' | 'below' | 'floating'
  surface?: 'elevated' | 'glass'
  className?: string
}

interface TableFilter {
  id: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'boolean'
  value?: unknown
  options?: Array<{ label: string; value: unknown }>
}

interface BulkAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'success'
  confirmMessage?: string
}
```

### **80% Use Cases Coverage**
- ✅ Global search across table data
- ✅ Column-specific filtering
- ✅ Bulk operations (delete, archive, export)
- ✅ Data refresh and export functionality
- ✅ View density controls
- ✅ Primary action button (Add New, etc.)

---

## 📄 **3. TablePagination - Smart Navigation**

### **Purpose**
Intelligent pagination component with luxury controls and performance optimization for large datasets.

### **Core Specifications**
```typescript
interface TablePaginationProps {
  // Pagination State
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  
  // Navigation
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  
  // Display Options
  showSizeChanger?: boolean
  pageSizeOptions?: number[]              // [10, 25, 50, 100]
  showQuickJumper?: boolean              // Direct page input
  showTotal?: boolean                    // "Showing X to Y of Z entries"
  
  // Advanced Features
  showFirstLast?: boolean                // First/Last page buttons
  adjacentCount?: number                 // Adjacent page buttons count
  boundaryCount?: number                 // Boundary page buttons count
  
  // Performance
  virtualized?: boolean                  // Virtual scrolling mode
  loadingMore?: boolean                  // Infinite scroll loading
  onLoadMore?: () => void               // Infinite scroll handler
  
  // Customization
  size?: 'sm' | 'md' | 'lg'
  surface?: 'elevated' | 'glass'
  position?: 'top' | 'bottom' | 'both'
  className?: string
  
  // Accessibility
  ariaLabel?: string
  pageAriaLabel?: (page: number) => string
}
```

### **80% Use Cases Coverage**
- ✅ Standard pagination with page size controls
- ✅ Quick page jumping for large datasets
- ✅ Infinite scroll for social feeds
- ✅ Performance optimization with virtualization
- ✅ Mobile-responsive navigation
- ✅ Accessibility compliance

---

## 🎭 **4. TableEmpty - Elegant Empty States**

### **Purpose**
Beautiful, actionable empty states that guide users and enhance the data table experience.

### **Core Specifications**
```typescript
interface TableEmptyProps {
  // State Type
  variant?: 'no-data' | 'no-results' | 'error' | 'loading' | 'custom'
  
  // Content
  title?: string
  description?: string
  icon?: React.ReactNode
  illustration?: React.ReactNode
  
  // Actions
  primaryAction?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'primary' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  
  // Suggestions
  suggestions?: Array<{
    label: string
    onClick: () => void
  }>
  
  // Customization
  size?: 'sm' | 'md' | 'lg'
  surface?: 'elevated' | 'glass'
  className?: string
  
  // Loading State
  loading?: boolean
  loadingText?: string
}
```

### **Built-in Variants**
```typescript
const EmptyStateVariants = {
  'no-data': {
    title: 'No data available',
    description: 'Get started by adding your first record',
    icon: <DatabaseIcon />,
    primaryAction: { label: 'Add Record' }
  },
  'no-results': {
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria',
    icon: <SearchIcon />,
    primaryAction: { label: 'Clear Filters' }
  },
  'error': {
    title: 'Unable to load data',
    description: 'Please check your connection and try again',
    icon: <ExclamationIcon />,
    primaryAction: { label: 'Retry' }
  }
}
```

### **80% Use Cases Coverage**
- ✅ First-time user experience
- ✅ Search result empty states
- ✅ Error state handling
- ✅ Loading state transitions
- ✅ Actionable guidance for users

---

## 📝 **5. EnhancedForm - Universal Form System**

### **Purpose**
Comprehensive form component with validation, accessibility, and excellent DX built on react-hook-form + zod.

### **Core Specifications**
```typescript
interface EnhancedFormProps<TFormData> {
  // Schema & Validation
  schema: ZodSchema<TFormData>            // Zod validation schema
  defaultValues?: Partial<TFormData>     // Initial form values
  
  // Submission
  onSubmit: (data: TFormData) => void | Promise<void>
  onError?: (errors: FieldErrors<TFormData>) => void
  
  // Layout & Appearance
  layout?: 'vertical' | 'horizontal' | 'inline'
  density?: 'compact' | 'comfortable' | 'spacious'
  surface?: 'elevated' | 'glass'
  
  // Form Behavior
  mode?: 'onChange' | 'onBlur' | 'onSubmit' // Validation trigger
  reValidateMode?: 'onChange' | 'onBlur'   // Re-validation trigger
  resetOnSubmit?: boolean                  // Reset form after submit
  
  // State Management
  loading?: boolean                        // Submission loading state
  disabled?: boolean                      // Disable entire form
  readOnly?: boolean                      // Read-only mode
  
  // Field Configuration
  fields: FormFieldConfig<TFormData>[]    // Field definitions
  
  // Actions
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  showReset?: boolean
  
  // Advanced Features
  autoSave?: {
    enabled: boolean
    debounceMs?: number
    storageKey?: string
  }
  
  // Customization
  className?: string
  formClassName?: string
  actionsClassName?: string
}

interface FormFieldConfig<TFormData> {
  name: keyof TFormData
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 
        'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  
  // Field-specific options
  options?: Array<{ label: string; value: unknown }> // For select/radio
  multiple?: boolean                                  // For select/file
  accept?: string                                     // For file input
  min?: number | string                               // For number/date
  max?: number | string                               // For number/date
  
  // Layout
  colSpan?: number                                    // Grid column span
  hidden?: boolean                                    // Conditional visibility
  
  // Validation
  customValidation?: (value: unknown) => string | undefined
}
```

### **80% Use Cases Coverage**
- ✅ User registration/profile forms
- ✅ Data entry and editing forms
- ✅ Search and filter forms
- ✅ Contact and feedback forms
- ✅ Multi-step wizard forms
- ✅ Auto-save and draft functionality

---

## 🪄 **6. FormWizard - Multi-Step Form System**

### **Purpose**
Guided multi-step form experience with progress tracking, validation, and seamless navigation.

### **Core Specifications**
```typescript
interface FormWizardProps<TFormData> {
  // Steps Configuration
  steps: FormWizardStep<TFormData>[]
  
  // Navigation
  currentStep?: number
  onStepChange?: (step: number) => void
  allowSkip?: boolean
  allowBack?: boolean
  
  // Data Management
  schema: ZodSchema<TFormData>
  defaultValues?: Partial<TFormData>
  onSubmit: (data: TFormData) => void | Promise<void>
  
  // Progress Display
  showProgress?: boolean
  progressVariant?: 'steps' | 'bar' | 'dots'
  
  // Validation Strategy
  validateOnStepChange?: boolean
  saveOnStepChange?: boolean          // Auto-save step data
  
  // Navigation Controls
  nextLabel?: string
  backLabel?: string
  submitLabel?: string
  skipLabel?: string
  
  // State
  loading?: boolean
  disabled?: boolean
  
  // Customization
  surface?: 'elevated' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

interface FormWizardStep<TFormData> {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  
  // Content
  component: React.ComponentType<FormWizardStepProps<TFormData>>
  fields?: FormFieldConfig<TFormData>[]  // Auto-generated form option
  
  // Validation
  validation?: ZodSchema                 // Step-specific validation
  required?: boolean                     // Step completion requirement
  
  // Navigation
  skipable?: boolean                     // Can skip this step
  backable?: boolean                     // Can go back from this step
  
  // Conditional Logic
  condition?: (data: Partial<TFormData>) => boolean  // Show step condition
}

interface FormWizardStepProps<TFormData> {
  data: Partial<TFormData>
  updateData: (data: Partial<TFormData>) => void
  errors: FieldErrors<TFormData>
  goNext: () => void
  goBack: () => void
  skip: () => void
}
```

### **80% Use Cases Coverage**
- ✅ User onboarding flows
- ✅ Product configuration wizards
- ✅ Multi-step checkouts
- ✅ Survey and questionnaire forms
- ✅ Account setup processes
- ✅ Progressive data collection

---

## 📊 **7. BarChart - Configured Bar Visualization**

### **Purpose**
Production-ready bar chart component with MAPS theming and common business chart patterns.

### **Core Specifications**
```typescript
interface BarChartProps {
  // Data
  data: Array<Record<string, unknown>>   // Chart data array
  keys: string[]                         // Data keys to display as bars
  indexBy: string                        // Key for x-axis grouping
  
  // Chart Configuration
  layout?: 'horizontal' | 'vertical'     // Bar orientation
  groupMode?: 'stacked' | 'grouped'      // Multi-series display
  
  // Styling
  colors?: string[] | ((data: unknown) => string)  // Custom colors
  surface?: 'elevated' | 'glass'         // MAPS surface style
  theme?: 'light' | 'dark' | 'auto'      // Color theme
  
  // Dimensions
  height?: number
  width?: number | 'auto'
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  
  // Interactivity
  onClick?: (data: unknown, event: React.MouseEvent) => void
  onHover?: (data: unknown | null) => void
  tooltip?: boolean | React.ComponentType
  
  // Axes & Labels
  showXAxis?: boolean
  showYAxis?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  showGridLines?: boolean
  
  // Data Formatting
  valueFormat?: (value: number) => string
  labelFormat?: (label: string) => string
  
  // Animation
  animate?: boolean
  animationDuration?: number
  
  // Accessibility
  ariaLabel?: string
  ariaDescription?: string
  
  // State
  loading?: boolean
  error?: Error | null
  empty?: React.ReactNode
  
  // Export
  exportable?: boolean
  exportFormats?: Array<'png' | 'svg' | 'pdf'>
  
  className?: string
}
```

### **Pre-configured Variants**
```typescript
const BarChartPresets = {
  'revenue': {
    valueFormat: (v) => `$${v.toLocaleString()}`,
    colors: ['#10B981', '#3B82F6', '#8B5CF6'],
    showGridLines: true
  },
  'performance': {
    valueFormat: (v) => `${v}%`,
    colors: ['#EF4444', '#F59E0B', '#10B981'],
    groupMode: 'stacked'
  },
  'comparison': {
    layout: 'horizontal',
    colors: ['#6366F1', '#EC4899'],
    showGridLines: false
  }
}
```

### **80% Use Cases Coverage**
- ✅ Revenue and financial charts
- ✅ Performance metrics visualization
- ✅ Category comparison charts
- ✅ Survey and poll results
- ✅ Progress tracking displays
- ✅ Analytics dashboards

---

## 📈 **8. LineChart - Time Series & Trend Visualization**

### **Purpose**
Optimized line chart for time series data, trends, and multi-metric tracking with excellent performance.

### **Core Specifications**
```typescript
interface LineChartProps {
  // Data
  data: Array<Record<string, unknown>>   // Time series data
  xScale: {
    type: 'linear' | 'time' | 'point'
    format?: string                      // Date format for time scale
    min?: unknown
    max?: unknown
  }
  yScale: {
    type: 'linear' | 'log'
    min?: number | 'auto'
    max?: number | 'auto'
    format?: (value: number) => string
  }
  
  // Series Configuration
  lines: LineSeriesConfig[]
  
  // Chart Behavior
  curve?: 'linear' | 'cardinal' | 'catmullRom' | 'step'
  connectNulls?: boolean                 // Connect across null values
  
  // Styling
  colors?: string[] | ((series: string) => string)
  surface?: 'elevated' | 'glass'
  theme?: 'light' | 'dark' | 'auto'
  
  // Dimensions
  height?: number
  width?: number | 'auto'
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  
  // Interactivity
  crosshair?: boolean                    // Show crosshair on hover
  zoom?: boolean                         // Enable zoom functionality
  brush?: boolean                        // Enable brush selection
  onClick?: (point: unknown, event: React.MouseEvent) => void
  onZoom?: (domain: [Date, Date]) => void
  
  // Axes & Grid
  showXAxis?: boolean
  showYAxis?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  showGridLines?: 'both' | 'x' | 'y' | 'none'
  
  // Annotations
  annotations?: LineAnnotation[]
  markers?: LineMarker[]                 // Important points
  
  // Performance
  sampling?: boolean                     // Data sampling for large datasets
  maxPoints?: number                     // Maximum points to render
  
  // Real-time
  realtime?: boolean                     // Real-time data updates
  realtimeConfig?: {
    updateInterval: number
    maxHistory: number
    paused?: boolean
  }
  
  // State
  loading?: boolean
  error?: Error | null
  empty?: React.ReactNode
  
  className?: string
}

interface LineSeriesConfig {
  id: string
  label: string
  dataKey: string                        // Data property to plot
  color?: string
  strokeWidth?: number
  strokeDasharray?: string               // Dashed line pattern
  area?: boolean                         // Fill area under line
  visible?: boolean                      // Show/hide series
}

interface LineAnnotation {
  type: 'vertical' | 'horizontal' | 'point'
  value: unknown                         // x or y value
  label?: string
  color?: string
}

interface LineMarker {
  x: unknown
  y: unknown
  label?: string
  color?: string
  size?: number
}
```

### **80% Use Cases Coverage**
- ✅ Analytics and metrics tracking
- ✅ Financial time series data
- ✅ Performance monitoring dashboards
- ✅ Real-time data visualization
- ✅ Trend analysis and forecasting
- ✅ Multi-metric comparison charts

---

## 🎯 **Implementation Priority & Dependencies**

### **Phase 1: Foundation (Days 1-3)**
1. **SimpleTable** - Core table with basic features
2. **TableEmpty** - Empty states for better UX

### **Phase 2: Enhancement (Days 4-6)**
3. **TableToolbar** - Search, filter, actions
4. **TablePagination** - Navigation and performance
5. **EnhancedForm** - Basic form functionality

### **Phase 3: Advanced (Days 7-9)**
6. **FormWizard** - Multi-step forms
7. **BarChart** - Essential data visualization
8. **LineChart** - Time series and trends

### **Dependencies Map**
```json
{
  "core": [
    "@tanstack/react-table@^8.20.5",
    "@tanstack/react-query@^5.59.0", 
    "@tanstack/react-virtual@^3.10.8",
    "react-hook-form@^7.48.0",
    "zod@^3.25.0"
  ],
  "visualization": [
    "@nivo/core@^0.87.0",
    "@nivo/bar@^0.87.0",
    "@nivo/line@^0.87.0"
  ],
  "enhancement": [
    "react-day-picker@^8.10.1",
    "date-fns@^4.1.0"
  ]
}
```

---

## ✅ **80/20 Strategy Validation**

### **80% Simple Coverage Confirmed**
- ✅ Standard business tables and forms
- ✅ Common chart patterns and visualizations  
- ✅ Search, filter, pagination workflows
- ✅ Multi-step data collection
- ✅ Standard CRUD operations
- ✅ Analytics and reporting dashboards

### **20% Enterprise Escape Hatches**
- 🎯 **AGGridAdapter** for advanced table features
- 🎯 **UppyAdapter** for complex file uploads
- 🎯 **Custom Chart Libraries** for specialized visualizations
- 🎯 **Advanced Form Builders** for complex workflows

This specification ensures each component covers the vast majority of real-world use cases while maintaining upgrade paths to enterprise solutions when needed.
