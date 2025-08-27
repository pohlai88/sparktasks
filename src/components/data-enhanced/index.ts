/**
 * 📊 DATA-ENHANCED: 8 Core Components Specification
 *
 * Universal data components following MAPS v3.0 design system.
 * These 8 components cover 80% of data visualization and form use cases.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 * - Zero TypeScript errors
 * - Zero lint errors
 */

// ===== SIMPLE TABLE SYSTEM (4 Components) =====
export { SimpleTable } from './SimpleTable';
export { TableEmpty } from './SimpleTable/TableEmpty';
export { TableToolbar } from './SimpleTable/TableToolbar';
export { TablePagination } from './SimpleTable/TablePagination';

// ===== ENHANCED FORM SYSTEM (2 Components) =====
export { EnhancedForm } from './EnhancedForm';
export { FormWizard } from './EnhancedForm/FormWizard';

// ===== CHART VISUALIZATION (2 Components) =====
export { BarChart } from './Charts';
export { LineChart } from './Charts';

// ===== TYPE EXPORTS =====
export type {
  // Table Types
  SimpleTableProps,
  TableEmptyProps,
  TableToolbarProps,
  TablePaginationProps,

  // Form Types
  EnhancedFormProps,
  FormWizardProps,
  FormFieldConfig,
  FormWizardStep,

  // Chart Types
  BarChartProps,
  LineChartProps,

  // Shared Types
  EmptyState,
  TableFilter,
  BulkAction,
} from './types';

// ===== VARIANT EXPORTS =====
export type {
  SimpleTableVariants,
  TableEmptyVariants,
  TableToolbarVariants,
  TablePaginationVariants,
} from './SimpleTable';

export type { EnhancedFormVariants, FormWizardVariants } from './EnhancedForm';

export type { BarChartVariants, LineChartVariants } from './Charts';
