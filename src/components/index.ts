/**
 * Components Index - Complete UI Library
 * 
 * Comprehensive exports for the entire component system:
 * - UI Primitives: Core reusable components
 * - Features: Business logic components  
 * - Layout: Layout system components
 * - Demo: Demo/Example/Showcase components
 */

// ===== UI PRIMITIVES =====
// Core Interactive Components
export { Button } from '@/components/ui/Button';
export { IconButton } from '@/components/ui/IconButton';
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
export { Badge, Chip } from '@/components/ui/Badge';
export { Input, Textarea, Select } from '@/components/ui/Input';
export { Modal, ConfirmModal } from '@/components/ui/Modal';
export { Tooltip } from '@/components/ui/Tooltip';
export { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
export { Dialog } from '@/components/ui/Dialog';
export { Skeleton } from '@/components/ui/Skeleton';
export { FieldGroup } from '@/components/ui/FieldGroup';

// Specialized Components
export { PriorityBadge, StatusBadge, DueDateBadge } from '@/components/features/TaskBadges';
export { TagChip, TagList } from '@/components/ui/TagChip';

// ===== FEATURE COMPONENTS =====
export { SearchBar } from '@/components/features/SearchBar';
export { TaskCard } from '@/components/features/TaskCard';
export { TaskColumn } from '@/components/features/TaskColumn';
export { TaskForm } from '@/components/features/TaskForm';
export { TaskMoveMenu } from '@/components/features/TaskMoveMenu';
export { QuickAdd } from '@/components/features/QuickAdd';
export { KeyboardShortcuts } from '@/components/features/KeyboardShortcuts';

// ===== ACCESSIBILITY & SYSTEM =====
export { AriaLive } from '@/components/features/AriaLive';
export { LiveAnnouncer } from '@/components/features/LiveAnnouncer';
export type { Toast } from '@/components/features/Toast';
export { ToastContainer } from '@/components/features/Toast';

// ===== LAYOUT SYSTEM =====
export {
  AppShell,
  TopNav,
  Sidebar,
  MainContent,
  RightPanel,
  PageHeader,
  SplitPane,
  Container,
  Grid,
  Stack,
  Drawer,
} from '@/components/layout/Layout';

// ===== DEMO & SHOWCASES =====
export { ComponentShowcase } from '@/components/demo/examples';

// ===== DESIGN TOKENS RE-EXPORT =====
export {
  DESIGN_TOKENS,
  getPriorityStyles,
  getStatusStyles,
  getUrgencyStyles,
  getPriorityLabel,
  getStatusLabel,
} from '@/design/tokens';

