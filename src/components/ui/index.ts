// UI Component Library - SSOT Single Source of Truth
// All components use design tokens exclusively - zero hardcoded Tailwind classes

// Core Interactive Components
export { Button, IconButton } from './Button';
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
export { Badge, Chip } from './Badge';
export { Input, Textarea, Select } from './Input';

// Specialized Task Components  
export { PriorityBadge, StatusBadge, DueDateBadge } from './TaskBadges';
export { TagChip, TagList } from './TagChip';

// Layout & Navigation Components
export { Modal, ConfirmModal } from './Modal';
export { Tooltip } from './Tooltip';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

// Form Components (Coming Soon)
// export { Checkbox } from './Checkbox';
// export { Radio } from './Radio'; 
// export { FormField } from './FormField';

// Feedback Components (Coming Soon)
// export { Alert } from './Alert';
// export { Skeleton } from './Skeleton';
// export { Spinner } from './Spinner';

// Data Display (Coming Soon)
// export { Table } from './Table';
// export { Avatar } from './Avatar';
// export { Progress } from './Progress';

// Re-export design tokens for components that need direct access
export { DESIGN_TOKENS, getPriorityStyles, getStatusStyles, getUrgencyStyles, getPriorityLabel, getStatusLabel } from '../../design/tokens';
