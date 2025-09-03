/**
 * FileSystem - File Management Components Index
 *
 * Comprehensive file handling components with upload, processing,
 * and enterprise features.
 *
 * MAPS v3.0 Integration:
 * - Clean exports for component library
 * - TypeScript type exports
 * - Organized component groups
 */

// ===== CORE COMPONENTS =====

export { default as SimpleUpload } from './SimpleUpload';
export type {
  UploadResult,
  UploadQueueItem,
  FileValidationResult,
  FileValidationError,
  SimpleUploadProps,
} from './SimpleUpload';
export { FileTypePresets } from './SimpleUpload';

export { default as UppyAdapter } from './UppyAdapter';
export type {
  UppyFile,
  UppyProvider,
  UppyOptions,
  UppyState,
  UppyAdapterProps,
} from './UppyAdapter';
export { UppyPresets } from './UppyAdapter';
