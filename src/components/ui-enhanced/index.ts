/**
 * Enhanced UI Components - MAPS v2.2 Export Index
 *
 * Centralized exports for Enhanced UI components following
 * proper module organization patterns and MAPS architecture
 */

// ===== PRIMITIVES - MAPS v2.2 Radix Utilities =====
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

// Enhanced Button Component
export { EnhancedButton, enhancedButtonVariants } from './Button';

// Enhanced Button Types
export type { EnhancedButtonOwnProps, ButtonVariantProps } from './Button';

// Enhanced Alert Component
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

// Enhanced Alert Types
export type { EnhancedAlertProps } from './Alert';

// Enhanced Badge Component
export {
  EnhancedBadge,
  BadgeFactory,
  enhancedBadgeVariants,
  createCountBadge,
  createStatusDot,
  createNotificationBadge,
} from './Badge';

// Enhanced Badge Types
export type { EnhancedBadgeProps } from './Badge';

// Enhanced Breadcrumb Component
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

// Enhanced Breadcrumb Types
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

// Enhanced Calendar Component
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

// Enhanced Calendar Types
export type {
  EnhancedCalendarProps,
  EnhancedCalendarHeaderProps,
  EnhancedCalendarNavProps,
  EnhancedCalendarGridProps,
  EnhancedCalendarDayProps,
  EnhancedCalendarWeekdayProps,
  CalendarVariantProps,
} from './Calendar';

// Enhanced Command Component
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

// Enhanced Command Types
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

// Enhanced Combobox Component
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

// Enhanced Combobox Types
export type {
  EnhancedComboboxProps,
  EnhancedComboboxInputProps,
  EnhancedComboboxContentProps,
  EnhancedComboboxItemProps,
  ComboboxOption,
} from './Combobox';

// Enhanced Card Component
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

// Enhanced Card Types
export type {
  EnhancedCardOwnProps,
  EnhancedCardHeaderProps,
  EnhancedCardTitleProps,
  EnhancedCardDescriptionProps,
  EnhancedCardContentProps,
  EnhancedCardFooterProps,
  CardVariantProps,
} from './Card';

// Enhanced Checkbox Component
export { Checkbox, CheckboxWithLabel, CheckboxGroup } from './Checkbox';

// Enhanced Checkbox Types
export type { CheckboxWithLabelProps, CheckboxGroupProps } from './Checkbox';

// Enhanced Dialog Component
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

// Enhanced Dialog Types
export type {
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  EnhancedDialogProps,
} from './Dialog';

// Enhanced Input Component
export {
  EnhancedInput,
  EnhancedInputField,
  enhancedInputVariants,
} from './Input';

// Enhanced Input Types
export type { EnhancedInputOwnProps, InputVariantProps } from './Input';

// Enhanced AlertDialog Component
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

// Enhanced AlertDialog Types
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

// Enhanced Popover Component
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

// Enhanced Popover Types
export type {
  PopoverContentProps,
  PopoverTriggerProps,
  PopoverWithTriggerProps,
} from './Popover';

// Enhanced Select Component
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

// Enhanced Select Types
export type {
  SelectTriggerVariants,
  SelectContentVariants,
  SelectItemVariants,
} from './Select';

// Enhanced Avatar Component
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

// Enhanced Avatar Types
export type {
  EnhancedAvatarOwnProps,
  EnhancedAvatarImageOwnProps,
  EnhancedAvatarFallbackOwnProps,
  AvatarVariantProps,
  AvatarImageVariantProps,
  AvatarFallbackVariantProps,
} from './Avatar';

// Enhanced DropdownMenu Component
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

// Enhanced DropdownMenu Types
export type {
  EnhancedDropdownMenuContentOwnProps,
  EnhancedDropdownMenuItemOwnProps,
  EnhancedDropdownMenuLabelOwnProps,
  EnhancedDropdownMenuSeparatorOwnProps,
  EnhancedDropdownMenuShortcutOwnProps,
  EnhancedDropdownMenuProps,
  CreateDropdownMenuOptions,
} from './DropdownMenu';

// Enhanced Label Component
export {
  EnhancedLabel,
  LabelWithField,
  FormFieldGroup,
  enhancedLabelVariants,
  createLabelWithField,
} from './Label';

// Enhanced Label Types
export type {
  EnhancedLabelOwnProps,
  LabelVariantProps,
  LabelWithFieldProps,
  FormFieldGroupProps,
} from './Label';

// Enhanced Separator Component
export {
  EnhancedSeparator,
  SeparatorWithContent,
  createThemedSeparator,
  GlassSeparator,
  EtherealSeparator,
  StrongSeparator,
  AccentSeparator,
  enhancedSeparatorVariants,
  SeparatorPrimitive,
} from './Separator';

// Enhanced Separator Types
export type {
  EnhancedSeparatorProps,
  SeparatorWithContentProps,
} from './Separator';

// Enhanced Sheet Component
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

// Enhanced Sheet Types
export type {
  EnhancedSheetContentProps,
  EnhancedSheetHeaderProps,
  EnhancedSheetTitleProps,
  EnhancedSheetDescriptionProps,
  EnhancedSheetFooterProps,
  EnhancedSheetCloseProps,
} from './Sheet';

// Enhanced Skeleton Component
export {
  EnhancedSkeleton,
  SkeletonFactory,
  SkeletonTextLines,
  SkeletonCard,
  SkeletonTable,
  enhancedSkeletonVariants,
} from './Skeleton';

// Enhanced Skeleton Types
export type {
  EnhancedSkeletonProps,
  SkeletonTextLinesProps,
  SkeletonCardProps,
  SkeletonTableProps,
} from './Skeleton';

// Enhanced Switch Component
export {
  EnhancedSwitch,
  enhancedSwitchVariants,
  SwitchFactory,
} from './Switch';

// Enhanced Switch Types
export type { EnhancedSwitchProps } from './Switch';

// Enhanced Tabs Component
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

// Enhanced Tabs Types
export type {
  EnhancedTabsRootProps,
  EnhancedTabsListProps,
  EnhancedTabsTriggerProps,
  EnhancedTabsContentProps,
} from './Tabs';

// Enhanced Toast Component
export {
  EnhancedToastProvider,
  EnhancedToastViewport,
  EnhancedToast,
  EnhancedToastTitle,
  EnhancedToastDescription,
  EnhancedToastAction,
  EnhancedToastClose,
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

// Enhanced Toast Types
export type {
  EnhancedToastViewportProps,
  EnhancedToastProps,
  EnhancedToastTitleProps,
  EnhancedToastDescriptionProps,
  EnhancedToastActionProps,
  EnhancedToastCloseProps,
} from './Toast';

// Enhanced Tooltip Component
export {
  EnhancedTooltipProvider,
  EnhancedTooltipRoot,
  EnhancedTooltipTrigger,
  EnhancedTooltipContent,
  EnhancedTooltipWithTrigger,
  TooltipFactory,
  TooltipPrimitive,
} from './Tooltip';

// Enhanced Tooltip Types
export type {
  EnhancedTooltipProps,
  EnhancedTooltipTriggerProps,
  TooltipWithTriggerProps,
} from './Tooltip';

// Enhanced Accordion Component
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

// Enhanced Accordion Types
export type {
  EnhancedAccordionRootProps,
  EnhancedAccordionItemProps,
  EnhancedAccordionTriggerProps,
  EnhancedAccordionContentProps,
  EnhancedAccordionItemCompleteProps,
} from './Accordion';

// Enhanced Collapsible Component
export {
  EnhancedCollapsible,
  EnhancedCollapsibleRoot,
  EnhancedCollapsibleTrigger,
  EnhancedCollapsibleContent,
  EnhancedCollapsibleComplete,
  CollapsibleFactory,
  CollapsiblePrimitive,
} from './Collapsible';

// Enhanced Collapsible Types
export type {
  EnhancedCollapsibleRootProps,
  EnhancedCollapsibleTriggerProps,
  EnhancedCollapsibleContentProps,
  EnhancedCollapsibleCompleteProps,
} from './Collapsible';

// Enhanced ContextMenu Component
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

// Enhanced ContextMenu Types
export type {
  ContextMenuContentProps,
  ContextMenuItemProps,
  EnhancedContextMenuProps,
} from './ContextMenu';

// Enhanced HoverCard Component
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

// Enhanced HoverCard Types
export type {
  HoverCardContentProps,
  HoverCardTriggerProps,
  EnhancedHoverCardProps,
} from './HoverCard';

// Enhanced NavigationMenu Component
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

// Enhanced NavigationMenu Types
export type {
  EnhancedNavigationMenuProps,
  EnhancedNavigationMenuTriggerProps,
  EnhancedNavigationMenuContentProps,
  EnhancedNavigationMenuLinkProps,
} from './NavigationMenu';

// Enhanced MenuBar Component
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

// Enhanced Progress Component
export {
  EnhancedProgress,
  CircularProgress,
  SteppedProgress,
  enhancedProgressVariants,
  enhancedProgressIndicatorVariants,
} from './Progress';

// Enhanced Progress Types
export type { ProgressProps, CircularProps, SteppedProps } from './Progress';

// Enhanced RadioGroup Component
export {
  EnhancedRadioGroup,
  EnhancedRadioGroupItem,
  EnhancedRadioGroupCard,
  enhancedRadioGroupVariants,
  enhancedRadioItemVariants,
  enhancedRadioIndicatorVariants,
  enhancedRadioLabelVariants,
} from './RadioGroup';

// Enhanced ScrollArea Component
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

// Enhanced Slider Component
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

// Enhanced Slider Types
export type { EnhancedSliderProps } from './Slider';

// Enhanced Toggle Component
export {
  EnhancedToggle,
  enhancedToggleVariants,
  ToggleFactory,
  ToggleIcons,
  useEnhancedToggle,
  useEnhancedToggleGroup,
} from './Toggle';

// Enhanced Toggle Types
export type { EnhancedToggleProps } from './Toggle';

// Enhanced ToggleGroup Component
export {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupFactory,
  ToggleGroupItemFactory,
  ToggleGroupIcons,
  useEnhancedToggleGroupMulti,
  toggleGroupVariants,
  toggleGroupItemVariants,
} from './ToggleGroup';

// Enhanced ToggleGroup Types
export type { ToggleGroupProps, ToggleGroupItemProps } from './ToggleGroup';

// Enhanced Toolbar Component
export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarFactory,
  ToolbarButtonFactory,
  ToolbarIcons,
  toolbarVariants,
  toolbarButtonVariants,
  toolbarSeparatorVariants,
  toolbarToggleGroupVariants,
} from './Toolbar';

// Enhanced Toolbar Types
export type {
  ToolbarProps,
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarSeparatorProps,
  ToolbarToggleGroupProps,
  ToolbarToggleItemProps,
} from './Toolbar';

// Enhanced AspectRatio Component
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

// Enhanced AspectRatio Types
export type {
  EnhancedAspectRatioProps,
  AspectRatioVariantProps,
  AspectRatioContentVariantProps,
} from './AspectRatio';

// Re-export Enhanced Button as default for convenience
export { EnhancedButton as default } from './Button';
