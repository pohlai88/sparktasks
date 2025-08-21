/**
 * Components Index - Complete UI Library
 *
 * Comprehensive exports for the entire component system:
 * - UI Components: Core reusable UI components
 * - Demo Components: Demonstration and showcase components
 * - Layout Components: Layout and structure components
 * - Design Tokens: Design system tokens and utilities
 */

// ===== UI COMPONENTS =====
export { Alert } from '@/components/ui/Alert';
export { Attachment } from '@/components/ui/Attachment';
export { Audio } from '@/components/ui/Audio';
export { Avatar } from '@/components/ui/Avatar';
export { AvatarGroup } from '@/components/ui/AvatarGroup';
export { Badge } from '@/components/ui/Badge';
export { default as Banner } from '@/components/ui/Banner';
export { Button } from '@/components/ui/Button';
export { ButtonGroup } from '@/components/ui/ButtonGroup';
export { Callout } from '@/components/ui/Callout';
export { Card } from '@/components/ui/Card';
export { Carousel } from '@/components/ui/Carousel';
export { Chip } from '@/components/ui/Chip';
export { CodeBlock } from '@/components/ui/CodeBlock';
export { CodePlayground } from '@/components/ui/CodePlayground';
export { ContextMenu } from '@/components/ui/ContextMenu';
export { DescriptionList } from '@/components/ui/DescriptionList';
export { default as Dialog } from '@/components/ui/Dialog';
export { default as Document } from '@/components/ui/Document';
export { default as Drawer } from '@/components/ui/Drawer';
export { Dropdown } from '@/components/ui/Dropdown';
export { default as EmptyState } from '@/components/ui/EmptyState';
export { FAB } from '@/components/ui/FAB';
export { Gallery } from '@/components/ui/Gallery';
export { HoverCard } from '@/components/ui/HoverCard';
export { IconButton } from '@/components/ui/IconButton';
export { Image } from '@/components/ui/Image';
export { KBD } from '@/components/ui/KBD';
export { KebabMenu } from '@/components/ui/KebabMenu';
export { List } from '@/components/ui/List';
export { Note } from '@/components/ui/Note';
export { Panel } from '@/components/ui/Panel';
export { Popover } from '@/components/ui/Popover';
export { ProgressBar } from '@/components/ui/ProgressBar';
export { Prose } from '@/components/ui/Prose';
export { Skeleton } from '@/components/ui/Skeleton';
export { SpeedDial } from '@/components/ui/SpeedDial';
export { Spinner } from '@/components/ui/Spinner';
export { SplitButton } from '@/components/ui/SplitButton';
export { default as TableOfContents } from '@/components/ui/TableOfContents';
export { Tag } from '@/components/ui/Tag';
export { Thumbnail } from '@/components/ui/Thumbnail';
export { Toast } from '@/components/ui/Toast';
export { Tooltip } from '@/components/ui/Tooltip';
export { Video } from '@/components/ui/Video';
export { default as Well } from '@/components/ui/Well';

// ===== FEATURE COMPONENTS =====
// ===== FEATURES =====
export { CommandPalette } from './features/CommandPalette';
export { FormBuilder } from './features/FormBuilder';
export type {
  CommandPaletteProps,
  CommandItem,
  CommandGroup,
  CommandAction,
} from './features/CommandPalette';
export type {
  FormBuilderProps,
  FormSchema,
  FormFieldSchema,
  FormFieldType,
  FormData,
  FormErrors,
  FormValidationRule,
  FormFieldOption,
} from './features/FormBuilder';

// ===== LAYOUT COMPONENTS =====
export {
  ResponsiveGrids,
  GridItem,
  GridPresets,
} from './layout/ResponsiveGrids';
export type {
  ResponsiveGridsProps,
  GridItemProps,
  ResponsiveColumns,
  ResponsiveGaps,
  GridAreas,
  GridGap,
  GridColumns,
  BreakpointKey,
  GridAlignItems,
  GridJustifyItems,
  GridAutoFlow,
} from './layout/ResponsiveGrids';

export { SplitPanels, SplitPanel } from './layout/SplitPanels';
export type {
  SplitPanelsProps,
  SplitPanelProps,
  SplitDirection,
  PanelSize,
  ResizeMode,
  HandlePosition,
  LayoutMetrics,
  ResizeHandleProps,
} from './layout/SplitPanels';

// NavigationSystems - Complex navigation patterns
export {
  NavigationSystems,
  BreadcrumbNavigation,
  TabNavigation,
  StepNavigation,
  HierarchicalNavigation,
  NavigationProvider,
} from './layout/NavigationSystems';
export type {
  NavigationSystemsProps,
  BreadcrumbNavigationProps,
  TabNavigationProps,
  StepNavigationProps,
  HierarchicalNavigationProps,
  NavigationItem,
  BreadcrumbItem,
  TabItem,
  StepItem,
  NavigationVariant,
  NavigationSize,
} from './layout/NavigationSystems';

// Demo Components
export { SplitPanelsDemo } from './demo/SplitPanelsDemo';

// ===== DATA COMPONENTS =====
export { DataTable } from '@/components/data/DataTable';
export type {
  DataTableProps,
  DataTableColumn,
} from '@/components/data/DataTable';
export { LogViewer } from '@/components/data/LogViewer';
export type {
  LogViewerProps,
  LogEntry,
  LogLevel,
  LogFormat,
  LogViewMode,
  LogFilter,
} from '@/components/data/LogViewer';
export { RealtimeUpdates } from '@/components/data/RealtimeUpdates';
export type {
  RealtimeUpdatesProps,
  ConnectionConfig,
  UpdateOptions,
  RealtimeUpdateState,
  ConnectionStatus,
  UpdateMode,
  DataFormat,
} from '@/components/data/RealtimeUpdates';

// ===== DEMO COMPONENTS =====
export { AlertDemo } from '@/components/demo/AlertDemo';
export { default as AttachmentDemo } from '@/components/demo/AttachmentDemo';
export { default as BannerDemo } from '@/components/demo/BannerDemo';
export { default as CalloutDemo } from '@/components/demo/CalloutDemo';
export { CardDemo } from '@/components/demo/CardDemo';
export { CodeBlockDemo } from '@/components/demo/CodeBlockDemo';
export { CodePlaygroundDemo } from '@/components/demo/CodePlaygroundDemo';
export { default as ContextMenuDemo } from '@/components/demo/ContextMenuDemo';
export { default as DocumentDemo } from '@/components/demo/DocumentDemo';
export { DrawerDemo } from '@/components/demo/DrawerDemo';
export { ComponentShowcase } from '@/components/demo/examples';
export { HoverCardDemo } from '@/components/demo/HoverCardDemo';
export { default as ImageDemo } from '@/components/demo/ImageDemo';
export { default as KBDDemo } from '@/components/demo/KBDDemo';
export { LogViewerDemo } from '@/components/demo/LogViewerDemo';
export { default as NoteDemo } from '@/components/demo/NoteDemo';
export { ProgressBarDemo } from '@/components/demo/ProgressBarDemo';
export { ProseDemo } from '@/components/demo/ProseDemo';
export { default as RealtimeUpdatesDemo } from '@/components/demo/RealtimeUpdatesDemo';
export { ToastDemo } from '@/components/demo/ToastDemo';
export { TooltipDemo } from '@/components/demo/TooltipDemo';
export { VideoDemo } from '@/components/demo/VideoDemo';

// ===== DESIGN TOKENS RE-EXPORT =====
export {
  DESIGN_TOKENS,
  combineTokens,
  getPriorityStyles,
  getStatusStyles,
  getUrgencyStyles,
  getPriorityLabel,
  getStatusLabel,
} from '@/design/tokens';

export { TestButton } from './ui/TestButton';
