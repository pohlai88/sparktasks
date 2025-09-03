/**
 * Enhanced UI Components - MAPS v4.0 Export Index
 *
 * Centralized exports for Enhanced UI components following
 * proper module organization patterns and MAPS architecture
 * 
 * ORGANIZATION:
 * 1. Primitives & Foundation
 * 2. Basic Form Components
 * 3. Layout & Structure Components
 * 4. Interactive & Navigation Components
 * 5. Feedback & Display Components
 * 6. Utility & Specialized Components
 * 7. Common Types & Utilities
 */

// ===== 1. PRIMITIVES & FOUNDATION =====
// Required for migration: All accessibility and composition patterns
export {
  AccessibleIcon,
  VisuallyHidden,
  Slot,
  DirectionProvider,
} from '../primitives';

export type {
  AccessibleIconProps,
  VisuallyHiddenProps,
  SlotProps,
  DirectionProviderProps,
} from '../primitives';

// ===== 2. BASIC FORM COMPONENTS =====
// Core input and form elements

// Button
export { EnhancedButton, enhancedButtonVariants } from './Button';
export type { EnhancedButtonOwnProps, ButtonVariantProps } from './Button';

// Input
export { EnhancedInput, EnhancedInputField, enhancedInputVariants } from './Input';
export type { EnhancedInputOwnProps, InputVariantProps } from './Input';

// Textarea
export { EnhancedTextarea, enhancedTextareaVariants } from './Textarea';
export type { EnhancedTextareaProps } from './Textarea';

// Checkbox
export { Checkbox, CheckboxWithLabel, CheckboxGroup } from './Checkbox';
export type { CheckboxWithLabelProps, CheckboxGroupProps } from './Checkbox';

// Switch
export { EnhancedSwitch, enhancedSwitchVariants, SwitchFactory } from './Switch';
export type { EnhancedSwitchProps } from './Switch';

// Radio Group
export {
  EnhancedRadioGroup,
  EnhancedRadioGroupItem,
  EnhancedRadioGroupCard,
  enhancedRadioGroupVariants,
  enhancedRadioItemVariants,
  enhancedRadioIndicatorVariants,
  enhancedRadioLabelVariants,
} from './RadioGroup';

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './Select';

export type {
  SelectTriggerVariants,
  SelectContentVariants,
  SelectItemVariants,
} from './Select';

// Label
export {
  EnhancedLabel,
  LabelWithField,
  FormFieldGroup,
  enhancedLabelVariants,
  createLabelWithField,
} from './Label';

export type {
  EnhancedLabelOwnProps,
  LabelVariantProps,
  LabelWithFieldProps,
  FormFieldGroupProps,
} from './Label';

// ===== 3. LAYOUT & STRUCTURE COMPONENTS =====
// Components for organizing and structuring content

// Card
export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
  EnhancedCards,
  CardFactory,
  enhancedCardVariants,
  enhancedCardHeaderVariants,
  enhancedCardTitleVariants,
  enhancedCardDescriptionVariants,
  enhancedCardContentVariants,
  enhancedCardFooterVariants,
} from './Card';

export type {
  EnhancedCardOwnProps,
  EnhancedCardHeaderProps,
  EnhancedCardTitleProps,
  EnhancedCardDescriptionProps,
  EnhancedCardContentProps,
  EnhancedCardFooterProps,
  CardVariantProps,
} from './Card';

// Separator
export {
  EnhancedSeparator,
  SeparatorWithContent,
  GlassSeparator,
  EtherealSeparator,
  StrongSeparator,
  AccentSeparator,
  enhancedSeparatorVariants,
  SeparatorPrimitive,
} from './Separator';

export type {
  EnhancedSeparatorProps,
  SeparatorWithContentProps,
} from './Separator';

// Skeleton
export {
  EnhancedSkeleton,
  SkeletonFactory,
  SkeletonTextLines,
  SkeletonCard,
  SkeletonTable,
  enhancedSkeletonVariants,
} from './Skeleton';

export type {
  EnhancedSkeletonProps,
  SkeletonTextLinesProps,
  SkeletonCardProps,
  SkeletonTableProps,
} from './Skeleton';

// Aspect Ratio
export {
  EnhancedAspectRatio,
  AspectRatioFactory,
  AspectRatioImage,
  AspectRatioVideo,
  AspectRatioPlaceholder,
  enhancedAspectRatioVariants,
  enhancedAspectRatioContentVariants,
  ASPECT_RATIO_PRESETS,
  calculateAspectRatio,
  getAspectRatioName,
  getDimensionsFromRatio,
  AspectRatioPrimitive,
} from './AspectRatio';

export type {
  EnhancedAspectRatioProps,
  AspectRatioVariantProps,
  AspectRatioContentVariantProps,
} from './AspectRatio';

// Scroll Area
export {
  EnhancedScrollArea,
  EnhancedScrollbar,
  EnhancedScrollAreaWithProtection,
  EnhancedVirtualizedScrollArea,
  enhancedScrollAreaVariants,
  enhancedScrollViewportVariants,
  enhancedScrollbarVariants,
  enhancedScrollThumbVariants,
  enhancedScrollCornerVariants,
} from './ScrollArea';

// ===== 4. INTERACTIVE & NAVIGATION COMPONENTS =====
// Components for user interaction and navigation

// Toggle
export {
  enhancedToggleVariants,
  ToggleFactory,
  ToggleIcons,
  useEnhancedToggle,
  useEnhancedToggleGroup,
} from './Toggle';

export type { EnhancedToggleProps } from './Toggle';

// Toggle Group
export {
  ToggleGroupFactory,
  ToggleGroupItemFactory,
  ToggleGroupIcons,
  useEnhancedToggleGroupMulti,
} from './ToggleGroup';

export type { EnhancedToggleGroupProps, EnhancedToggleGroupItemProps } from './ToggleGroup';

// Toolbar
export {
  ToolbarFactory,
  ToolbarButtonFactory,
  ToolbarIcons,
  enhancedToolbarSeparatorVariants,
  enhancedToolbarToggleGroupVariants,
} from './Toolbar';

export type {
  EnhancedToolbarProps,
  EnhancedToolbarButtonProps,
  EnhancedToolbarLinkProps,
  EnhancedToolbarSeparatorProps,
  EnhancedToolbarToggleGroupProps,
  EnhancedToolbarToggleItemProps,
} from './Toolbar';

// Tabs
export {
  EnhancedTabs,
  EnhancedTabsRoot,
  EnhancedTabsList,
  EnhancedTabsTrigger,
  EnhancedTabsContent,
  enhancedTabsRootVariants,
  enhancedTabsListVariants,
  enhancedTabsTriggerVariants,
  enhancedTabsContentVariants,
  TabsFactory,
} from './Tabs';

export type {
  EnhancedTabsRootProps,
  EnhancedTabsListProps,
  EnhancedTabsTriggerProps,
  EnhancedTabsContentProps,
} from './Tabs';

// Accordion
export {
  EnhancedAccordion,
  EnhancedAccordionRoot,
  EnhancedAccordionItem,
  EnhancedAccordionTrigger,
  EnhancedAccordionContent,
  EnhancedAccordionItemComplete,
  AccordionFactory,
  AccordionPrimitive,
} from './Accordion';

export type {
  EnhancedAccordionRootProps,
  EnhancedAccordionItemProps,
  EnhancedAccordionTriggerProps,
  EnhancedAccordionContentProps,
  EnhancedAccordionItemCompleteProps,
} from './Accordion';

// Collapsible
export {
  EnhancedCollapsible,
  EnhancedCollapsibleRoot,
  EnhancedCollapsibleTrigger,
  EnhancedCollapsibleContent,
  EnhancedCollapsibleComplete,
  CollapsibleFactory,
  CollapsiblePrimitive,
} from './Collapsible';

export type {
  EnhancedCollapsibleRootProps,
  EnhancedCollapsibleTriggerProps,
  EnhancedCollapsibleContentProps,
  EnhancedCollapsibleCompleteProps,
} from './Collapsible';

// Slider
export {
  EnhancedSlider,
  enhancedSliderVariants,
  enhancedSliderTrackVariants,
  enhancedSliderRangeVariants,
  enhancedSliderThumbVariants,
  SliderFactory,
  SliderFormatters,
  useEnhancedSlider,
} from './Slider';

export type { EnhancedSliderProps } from './Slider';

// ===== 5. FEEDBACK & DISPLAY COMPONENTS =====
// Components for user feedback and information display

// Alert
export {
  EnhancedAlert,
  AlertFactory,
  enhancedAlertVariants,
  createSuccessAlert,
  createErrorAlert,
  createWarningAlert,
  createInfoAlert,
  createNotificationAlert,
} from './Alert';

export type { EnhancedAlertProps } from './Alert';

// Badge
export {
  EnhancedBadge,
  BadgeFactory,
  enhancedBadgeVariants,
  createCountBadge,
  createStatusDot,
  createNotificationBadge,
} from './Badge';

export type { EnhancedBadgeProps } from './Badge';

// Progress
export {
  EnhancedProgress,
  CircularProgress,
  SteppedProgress,
  enhancedProgressVariants,
  enhancedProgressIndicatorVariants,
} from './Progress';

export type { ProgressProps, CircularProps, SteppedProps } from './Progress';

// Toast
export {
  EnhancedToastComponents,
  enhancedToastVariants,
  enhancedToastViewportVariants,
  enhancedToastTitleVariants,
  enhancedToastDescriptionVariants,
  enhancedToastActionVariants,
  enhancedToastCloseVariants,
  ToastFactory,
  getToastIcon,
  ToastPrimitive,
} from './Toast';

export type {
  EnhancedToastViewportProps,
  EnhancedToastProps,
  EnhancedToastTitleProps,
  EnhancedToastDescriptionProps,
  EnhancedToastActionProps,
  EnhancedToastCloseProps,
} from './Toast';

// Tooltip
export {
  EnhancedTooltipProvider,
  EnhancedTooltipRoot,
  EnhancedTooltipTrigger,
  EnhancedTooltipContent,
  EnhancedTooltipWithTrigger,
  TooltipFactory,
  enhancedTooltipVariants,
} from './Tooltip';

// ===== 6. UTILITY & SPECIALIZED COMPONENTS =====
// Advanced and specialized component systems

// Command (Command Palette)
export {
  EnhancedCommand,
  EnhancedCommandInput,
  EnhancedCommandList,
  EnhancedCommandEmpty,
  EnhancedCommandGroup,
  EnhancedCommandSeparator,
  EnhancedCommandItem,
  EnhancedCommandShortcut,
  CommandFactory,
  enhancedCommandVariants,
  enhancedCommandInputVariants,
  enhancedCommandListVariants,
  enhancedCommandItemVariants,
  enhancedCommandGroupVariants,
  enhancedCommandSeparatorVariants,
  enhancedCommandShortcutVariants,
} from './Command';

export type {
  EnhancedCommandProps,
  EnhancedCommandInputProps,
  EnhancedCommandListProps,
  EnhancedCommandEmptyProps,
  EnhancedCommandGroupProps,
  EnhancedCommandSeparatorProps,
  EnhancedCommandItemProps,
  EnhancedCommandShortcutProps,
} from './Command';

// Combobox
export {
  EnhancedCombobox,
  EnhancedComboboxInput,
  EnhancedComboboxContent,
  EnhancedComboboxItem,
  ComboboxFactory,
  enhancedComboboxVariants,
  enhancedComboboxInputVariants,
  enhancedComboboxContentVariants,
  enhancedComboboxItemVariants,
} from './Combobox';

export type {
  EnhancedComboboxProps,
  EnhancedComboboxInputProps,
  EnhancedComboboxContentProps,
  EnhancedComboboxItemProps,
  ComboboxOption,
} from './Combobox';

// Calendar
export {
  EnhancedCalendar,
  EnhancedCalendarHeader,
  EnhancedCalendarNav,
  EnhancedCalendarGrid,
  EnhancedCalendarDay,
  EnhancedCalendarWeekday,
  CalendarFactory,
  enhancedCalendarVariants,
  createDateDisabled,
  formatCalendarDate,
  getCalendarMonthInfo,
} from './Calendar';

export type {
  EnhancedCalendarProps,
  EnhancedCalendarHeaderProps,
  EnhancedCalendarNavProps,
  EnhancedCalendarGridProps,
  EnhancedCalendarDayProps,
  EnhancedCalendarWeekdayProps,
  CalendarVariantProps,
} from './Calendar';

// Date Picker
export {
  EnhancedDatePicker,
  EnhancedDatePickerRange,
  DatePickerFactory,
  enhancedDatePickerVariants,
} from './DatePicker';

export type {
  EnhancedDatePickerProps,
  EnhancedDatePickerRangeProps,
  DatePickerVariantProps,
} from './DatePicker';

// Breadcrumb
export {
  EnhancedBreadcrumb,
  EnhancedBreadcrumbList,
  EnhancedBreadcrumbItem,
  EnhancedBreadcrumbLink,
  EnhancedBreadcrumbPage,
  EnhancedBreadcrumbSeparator,
  EnhancedBreadcrumbEllipsis,
  BreadcrumbFactory,
  enhancedBreadcrumbVariants,
  createHomeBreadcrumb,
  createBreadcrumbPath,
  truncateBreadcrumb,
} from './Breadcrumb';

export type {
  EnhancedBreadcrumbProps,
  EnhancedBreadcrumbListProps,
  EnhancedBreadcrumbItemProps,
  EnhancedBreadcrumbLinkProps,
  EnhancedBreadcrumbPageProps,
  EnhancedBreadcrumbSeparatorProps,
  EnhancedBreadcrumbEllipsisProps,
  BreadcrumbVariantProps,
} from './Breadcrumb';

// Pagination
export {
  EnhancedPagination,
  EnhancedPaginationRoot,
  EnhancedPaginationItem,
  EnhancedPaginationEllipsis,
  EnhancedPaginationComplete,
  PaginationFactory,
  enhancedPaginationRootVariants,
  enhancedPaginationItemVariants,
  enhancedPaginationEllipsisVariants,
  usePaginationRange,
} from './Pagination';

export type {
  EnhancedPaginationRootProps,
  EnhancedPaginationItemProps,
  EnhancedPaginationEllipsisProps,
  EnhancedPaginationCompleteProps,
  PaginationConfig,
} from './Pagination';

// ===== 7. OVERLAY & MODAL COMPONENTS =====
// Components for overlays, modals, and popups

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  EnhancedDialog,
} from './Dialog';

export type {
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  EnhancedDialogProps,
} from './Dialog';

// Alert Dialog
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  EnhancedAlertDialog,
  enhancedAlertDialogContentVariants,
  enhancedAlertDialogOverlayVariants,
} from './AlertDialog';

export type {
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  EnhancedAlertDialogProps,
} from './AlertDialog';

// Popover
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
  PopoverWithTrigger,
  enhancedPopoverVariants,
  enhancedPopoverTriggerVariants,
} from './Popover';

export type {
  PopoverContentProps,
  PopoverTriggerProps,
  PopoverWithTriggerProps,
} from './Popover';

// Sheet
export {
  EnhancedSheet,
  EnhancedSheetTrigger,
  EnhancedSheetPortal,
  EnhancedSheetOverlay,
  EnhancedSheetContent,
  EnhancedSheetHeader,
  EnhancedSheetTitle,
  EnhancedSheetDescription,
  EnhancedSheetFooter,
  EnhancedSheetClose,
  SheetFactory,
  enhancedSheetOverlayVariants,
  enhancedSheetContentVariants,
  enhancedSheetHeaderVariants,
  enhancedSheetTitleVariants,
  enhancedSheetDescriptionVariants,
  enhancedSheetFooterVariants,
  enhancedSheetCloseVariants,
} from './Sheet';

export type {
  EnhancedSheetContentProps,
  EnhancedSheetHeaderProps,
  EnhancedSheetTitleProps,
  EnhancedSheetDescriptionProps,
  EnhancedSheetFooterProps,
  EnhancedSheetCloseProps,
} from './Sheet';

// Drawer
export {
  EnhancedDrawer,
  EnhancedDrawerTrigger,
  EnhancedDrawerPortal,
  EnhancedDrawerOverlay,
  EnhancedDrawerContent,
  EnhancedDrawerHeader,
  EnhancedDrawerTitle,
  EnhancedDrawerDescription,
  EnhancedDrawerBody,
  EnhancedDrawerFooter,
  EnhancedDrawerClose,
  DrawerFactory,
  enhancedDrawerOverlayVariants,
  enhancedDrawerContentVariants,
  enhancedDrawerHandleVariants,
  enhancedDrawerCloseVariants,
} from './Drawer';

export type {
  EnhancedDrawerContentProps,
  EnhancedDrawerHeaderProps,
  EnhancedDrawerTitleProps,
  EnhancedDrawerDescriptionProps,
  EnhancedDrawerBodyProps,
  EnhancedDrawerFooterProps,
  EnhancedDrawerCloseProps,
  DrawerVariantProps,
} from './Drawer';

// ===== 8. MENU & NAVIGATION COMPONENTS =====
// Components for menus and navigation systems

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  EnhancedDropdownMenu,
  enhancedDropdownMenuContentVariants,
  enhancedDropdownMenuItemVariants,
  enhancedDropdownMenuLabelVariants,
  enhancedDropdownMenuSeparatorVariants,
  enhancedDropdownMenuShortcutVariants,
  createDropdownMenu,
} from './DropdownMenu';

export type {
  EnhancedDropdownMenuContentOwnProps,
  EnhancedDropdownMenuItemOwnProps,
  EnhancedDropdownMenuLabelOwnProps,
  EnhancedDropdownMenuSeparatorOwnProps,
  EnhancedDropdownMenuShortcutOwnProps,
  EnhancedDropdownMenuProps,
  CreateDropdownMenuOptions,
} from './DropdownMenu';

// Context Menu
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  EnhancedContextMenu,
  enhancedContextMenuContentVariants,
  enhancedContextMenuItemVariants,
  ContextMenuFactory,
  ContextMenuPrimitive,
} from './ContextMenu';

export type {
  ContextMenuContentProps,
  ContextMenuItemProps,
  EnhancedContextMenuProps,
} from './ContextMenu';

// Navigation Menu
export {
  EnhancedNavigationMenu,
  EnhancedNavigationMenuList,
  EnhancedNavigationMenuItem,
  EnhancedNavigationMenuTrigger,
  EnhancedNavigationMenuContent,
  EnhancedNavigationMenuLink,
  EnhancedNavigationMenuIndicator,
  EnhancedNavigationMenuViewport,
  enhancedNavigationMenuVariants,
  enhancedNavigationMenuTriggerVariants,
  enhancedNavigationMenuContentVariants,
  enhancedNavigationMenuLinkVariants,
} from './NavigationMenu';

export type {
  EnhancedNavigationMenuProps,
  EnhancedNavigationMenuTriggerProps,
  EnhancedNavigationMenuContentProps,
  EnhancedNavigationMenuLinkProps,
} from './NavigationMenu';

// Menu Bar
export {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarCheckboxItem,
  MenuBarRadioItem,
  MenuBarLabel,
  MenuBarSeparator,
  MenuBarShortcut,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
  MenuBarRadioGroup,
  enhancedMenuBarVariants,
  enhancedMenuBarTriggerVariants,
  enhancedMenuBarContentVariants,
  enhancedMenuBarItemVariants,
} from './MenuBar';

// Hover Card
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardPortal,
  EnhancedHoverCard,
  enhancedHoverCardContentVariants,
  enhancedHoverCardTriggerVariants,
  HoverCardFactory,
  HoverCardPrimitive,
} from './HoverCard';

export type {
  HoverCardContentProps,
  HoverCardTriggerProps,
  EnhancedHoverCardProps,
} from './HoverCard';

// Avatar
export {
  EnhancedAvatar,
  EnhancedAvatarRoot,
  EnhancedAvatarImage,
  EnhancedAvatarFallback,
  enhancedAvatarVariants,
  enhancedAvatarImageVariants,
  enhancedAvatarFallbackVariants,
  getAvatarInitials,
  getStatusColor,
} from './Avatar';

export type {
  EnhancedAvatarOwnProps,
  EnhancedAvatarImageOwnProps,
  EnhancedAvatarFallbackOwnProps,
  AvatarVariantProps,
  AvatarImageVariantProps,
  AvatarFallbackVariantProps,
} from './Avatar';

// ===== 9. SPECIALIZED COMPONENTS =====
// Components for specific use cases

// Empty State
export {
  EnhancedEmptyState,
  EmptyStateFactory,
  enhancedEmptyStateVariants,
  HUMANIZED_MESSAGES,
} from './EmptyState';

export type {
  EnhancedEmptyStateOwnProps,
  EmptyStateVariantProps,
  MessageType,
} from './EmptyState';

// ===== 10. COMMON TYPES & UTILITIES =====
// Shared types and utilities used across components

export type { VariantProps } from 'class-variance-authority';
