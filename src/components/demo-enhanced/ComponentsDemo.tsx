/**
 * MAPS v2.2 Enhanced Components Demo - Apple HIG Philosophy
 *
 * Comprehensive showcase demonstrating Enhanced Button capabilities
 * with true Apple HIG color system and sophisticated interactions
 */

import {
  Download,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Check,
  X,
  Plus,
  Settings,
  AlertTriangle,
  Info,
  MessageSquare,
  User,
  Search,
  Mail,
  Lock,
  Eye,
  Heart,
} from 'lucide-react';
import React, { useState } from 'react';

import { EnhancedButton, EnhancedInput } from '../ui-enhanced';
import {
  EnhancedAlert,
  AlertFactory,
  createSuccessAlert,
  createErrorAlert,
  createWarningAlert,
  createInfoAlert,
  createNotificationAlert,
} from '../ui-enhanced/Alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  EnhancedAlertDialog,
} from '../ui-enhanced/AlertDialog';
import {
  EnhancedBadge,
  BadgeFactory,
  createCountBadge,
  createStatusDot,
  createNotificationBadge,
} from '../ui-enhanced/Badge';
import {
  EnhancedBreadcrumb,
  EnhancedBreadcrumbList,
  EnhancedBreadcrumbItem,
  EnhancedBreadcrumbLink,
  EnhancedBreadcrumbPage,
  EnhancedBreadcrumbSeparator,
  EnhancedBreadcrumbEllipsis,
  BreadcrumbFactory,
} from '../ui-enhanced/Breadcrumb';
import {
  EnhancedCalendar,
  CalendarFactory,
  createDateDisabled,
  formatCalendarDate,
} from '../ui-enhanced/Calendar';
import {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
  CardFactory,
} from '../ui-enhanced/Card';
import { CheckboxWithLabel, CheckboxGroup } from '../ui-enhanced/Checkbox';
import {
  EnhancedDatePicker,
  EnhancedDatePickerRange,
  DatePickerFactory,
} from '../ui-enhanced/DatePicker';
import type { DateRange } from '../ui-enhanced/DatePicker';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui-enhanced/Dialog';
import {
  EnhancedDrawer,
  EnhancedDrawerTrigger,
  EnhancedDrawerContent,
  EnhancedDrawerHeader,
  EnhancedDrawerTitle,
  EnhancedDrawerDescription,
  EnhancedDrawerBody,
  EnhancedDrawerFooter,
  EnhancedDrawerClose,
  DrawerFactory,
} from '../ui-enhanced/Drawer';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../ui-enhanced/DropdownMenu';
import {
  EnhancedEmptyState,
  EmptyStateFactory,
  HUMANIZED_MESSAGES,
} from '../ui-enhanced/EmptyState';
import {
  EnhancedLabel,
  LabelWithField,
  FormFieldGroup,
  createLabelWithField,
} from '../ui-enhanced/Label';
import {
  EnhancedPagination,
  EnhancedPaginationComplete,
  PaginationFactory,
} from '../ui-enhanced/Pagination';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverWithTrigger,
  PopoverClose,
  PopoverArrow,
} from '../ui-enhanced/Popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../ui-enhanced/Select';
import {
  EnhancedSeparator,
  SeparatorWithContent,
  GlassSeparator,
  EtherealSeparator,
  StrongSeparator,
  AccentSeparator,
} from '../ui-enhanced/Separator';
import {
  EnhancedSheet,
  EnhancedSheetTrigger,
  EnhancedSheetContent,
  EnhancedSheetHeader,
  EnhancedSheetTitle,
  EnhancedSheetDescription,
  EnhancedSheetFooter,
  EnhancedSheetClose,
  SheetFactory,
} from '../ui-enhanced/Sheet';
import {
  EnhancedSkeleton,
  SkeletonFactory,
  SkeletonTextLines,
  SkeletonCard,
  SkeletonTable,
} from '../ui-enhanced/Skeleton';
import {
  EnhancedSlider,
  SliderFactory,
  SliderFormatters,
} from '../ui-enhanced/Slider';
import { EnhancedSwitch, SwitchFactory } from '../ui-enhanced/Switch';
import {
  EnhancedTabsRoot,
  EnhancedTabsList,
  EnhancedTabsTrigger,
  EnhancedTabsContent,
} from '../ui-enhanced/Tabs';
import {
  EnhancedToastProvider,
  EnhancedToastViewport,
  getToastIcon,
} from '../ui-enhanced/Toast';
import {
  EnhancedToggle,
  ToggleFactory,
  ToggleIcons,
  useEnhancedToggle,
  useEnhancedToggleGroup,
} from '../ui-enhanced/Toggle';

import CollapsibleDemo from './CollapsibleDemo';
import MenuBarDemo from './MenuBarDemo';
import NavigationMenuDemo from './NavigationMenuDemo';
import ProgressDemo from './ProgressDemo';
import RadioGroupDemo from './RadioGroupDemo';

export const ComponentsDemo: React.FC = () => {
  // Interactive demo state
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Select demo states
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Switch demo states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false);

  // Toggle demo states
  const [playbackToggled, setPlaybackToggled] = useState(false);
  const [muteToggled, setMuteToggled] = useState(false);
  const [bookmarkToggled, setBookmarkToggled] = useState(false);
  const [favoriteToggled, setFavoriteToggled] = useState(false);
  const [visibilityToggled, setVisibilityToggled] = useState(true);
  const [featureToggled, setFeatureToggled] = useState(false);

  // Toggle hook demos
  const playPauseToggle = useEnhancedToggle({
    defaultPressed: false,
    onPressedChange: setPlaybackToggled,
  });

  const muteToggle = useEnhancedToggle({
    defaultPressed: false,
    onPressedChange: setMuteToggled,
  });

  // Toggle group demo
  const viewModeGroup = useEnhancedToggleGroup({
    type: 'single',
    defaultValue: 'grid',
  });

  const toolsGroup = useEnhancedToggleGroup({
    type: 'multiple',
    defaultValue: ['brush', 'eraser'],
  });

  // Enhanced Toggle Group demo states - removed for now

  // Slider demo states
  const [volumeLevel, setVolumeLevel] = useState([75]);
  const [brightnessLevel, setBrightnessLevel] = useState([50]);
  const [temperatureRange, setTemperatureRange] = useState([20, 25]);
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [qualityScore, setQualityScore] = useState([8.5]);
  const [progressValue, setProgressValue] = useState([33]);

  // Calendar demo states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [multiSelectedDates, setMultiSelectedDates] = useState<Date[]>([]);

  // DatePicker demo states
  const [singleDate, setSingleDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Toast demo states
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      variant: 'default' | 'success' | 'error' | 'warning' | 'info';
      title: string;
      description?: string;
      timeout?: number;
    }>
  >([]);

  const showToast = (
    variant: 'default' | 'success' | 'error' | 'warning' | 'info',
    title: string,
    description?: string
  ) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = {
      id,
      variant,
      title,
      ...(description !== undefined && { description }),
    };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Handle download simulation
  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
  };

  // Handle like interaction
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <EnhancedToastProvider>
      <div className='min-h-screen bg-background p-8'>
        <div className='mx-auto max-w-7xl space-y-12'>
          {/* Header */}
          <div className='space-y-4 text-center'>
            <h1 className='text-4xl font-bold text-foreground'>
              MAPS v2.2 Enhanced Components Showcase
            </h1>
            <p className='mx-auto max-w-3xl text-xl text-muted-foreground'>
              Comprehensive demonstration of Enhanced Button, Dialog, Input,
              Label, Separator, and Select components & Select capabilities with
              Apple HIG philosophy - calm, sophisticated, and user-respectful
            </p>
          </div>

          {/* Primary Variants */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Core Variants
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Primary</h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='primary'>
                    Primary Button
                  </EnhancedButton>
                  <EnhancedButton variant='primary' disabled>
                    Disabled Primary
                  </EnhancedButton>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Secondary
                </h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='secondary'>
                    Secondary Action
                  </EnhancedButton>
                  <EnhancedButton variant='secondary' disabled>
                    Disabled Secondary
                  </EnhancedButton>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Outline</h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='outline'>
                    Outlined Button
                  </EnhancedButton>
                  <EnhancedButton variant='outline' disabled>
                    Disabled Outline
                  </EnhancedButton>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Ghost</h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='ghost'>Ghost Button</EnhancedButton>
                  <EnhancedButton variant='ghost' disabled>
                    Disabled Ghost
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </section>

          {/* Semantic Variants */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Semantic Variants
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Error</h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='error'>
                    Delete Account
                  </EnhancedButton>
                  <EnhancedButton variant='error' disabled>
                    Disabled Delete
                  </EnhancedButton>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Success</h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='success'>
                    <Check className='size-4' />
                    Confirm Action
                  </EnhancedButton>
                  <EnhancedButton variant='success' disabled>
                    <Check className='size-4' />
                    Disabled Success
                  </EnhancedButton>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Warning</h3>
                <div className='space-y-3'>
                  <EnhancedButton variant='warning'>
                    Proceed with Caution
                  </EnhancedButton>
                  <EnhancedButton variant='warning' disabled>
                    Disabled Warning
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </section>

          {/* Size Variants */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Size Variants
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Small</h3>
                <EnhancedButton size='sm' variant='primary'>
                  Small Button
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Medium</h3>
                <EnhancedButton size='md' variant='primary'>
                  Medium Size
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Large</h3>
                <EnhancedButton size='lg' variant='primary'>
                  Large Button
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Touch</h3>
                <EnhancedButton size='touch' variant='primary'>
                  <Plus className='size-4' />
                  Touch-Friendly
                </EnhancedButton>
              </div>
            </div>
          </section>

          {/* Liquid Glass Materials */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Liquid Glass Materials
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>None</h3>
                <EnhancedButton variant='primary' vibrancy='none'>
                  Standard Button
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Glass</h3>
                <EnhancedButton variant='primary' vibrancy='glass'>
                  Glass Material
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Floating
                </h3>
                <EnhancedButton variant='primary' vibrancy='floating'>
                  Floating Glass
                </EnhancedButton>
              </div>
            </div>
          </section>

          {/* Interactive Examples */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Interactive Demonstrations
            </h2>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {/* Download Example */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Download Action
                </h3>
                <EnhancedButton
                  onClick={handleDownload}
                  pending={isDownloading}
                  variant='primary'
                  className='w-full'
                  icon={<Download className='size-4' />}
                  loadingText='Downloading file...'
                >
                  {isDownloading ? 'Downloading...' : 'Download File'}
                </EnhancedButton>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Click to simulate download process
                </p>
              </div>

              {/* Like Counter Example */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Like Counter
                </h3>
                <EnhancedButton
                  onClick={handleLike}
                  variant={isLiked ? 'primary' : 'outline'}
                  className='w-full'
                  icon={
                    <Heart
                      className={`size-4 ${isLiked ? 'fill-current' : ''}`}
                    />
                  }
                >
                  {likeCount} Likes
                </EnhancedButton>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Interactive like button with counter
                </p>
              </div>

              {/* Media Controls Example */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Media Controls
                </h3>
                <div className='flex justify-center gap-2'>
                  <EnhancedButton
                    size='sm'
                    variant='outline'
                    icon={<SkipBack className='size-4' />}
                    iconPosition='only'
                    aria-label='Previous track'
                  />
                  <EnhancedButton
                    size='md'
                    variant='primary'
                    onClick={() => setIsPlaying(!isPlaying)}
                    icon={
                      isPlaying ? (
                        <Pause className='size-4' />
                      ) : (
                        <Play className='size-4' />
                      )
                    }
                    iconPosition='only'
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  />
                  <EnhancedButton
                    size='sm'
                    variant='outline'
                    icon={<SkipForward className='size-4' />}
                    iconPosition='only'
                    aria-label='Next track'
                  />
                </div>
                <p className='mt-2 text-center text-sm text-muted-foreground'>
                  Media player controls
                </p>
              </div>
            </div>
          </section>

          {/* AAA Compliance Section */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              AAA Accessibility Compliance
            </h2>
            <div className='rounded-lg border border-border bg-card p-6'>
              <p className='mb-6 text-muted-foreground'>
                All Enhanced Buttons meet WCAG AAA standards with 7:1 contrast
                ratios and proper focus management.
              </p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <EnhancedButton variant='primary' enforceAAA={true}>
                  AAA Primary
                </EnhancedButton>
                <EnhancedButton variant='success' enforceAAA={true}>
                  AAA Success
                </EnhancedButton>
                <EnhancedButton variant='error' enforceAAA={true}>
                  AAA Error
                </EnhancedButton>
              </div>
              <p className='mt-4 text-sm text-muted-foreground'>
                Try navigating with Tab key to see focus indicators
              </p>
            </div>
          </section>

          {/* Loading States */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Loading States
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Processing
                </h3>
                <EnhancedButton
                  pending={true}
                  variant='primary'
                  className='w-full'
                  loadingText='Processing your request'
                >
                  Processing...
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Saving</h3>
                <EnhancedButton
                  pending={true}
                  variant='secondary'
                  className='w-full'
                  loadingText='Saving changes'
                >
                  Saving...
                </EnhancedButton>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>Loading</h3>
                <EnhancedButton
                  pending={true}
                  variant='outline'
                  className='w-full'
                  loadingText='Loading content'
                >
                  Loading...
                </EnhancedButton>
              </div>
            </div>
          </section>

          {/* Button Groups */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Button Groups
            </h2>

            <div className='space-y-8'>
              {/* Primary Actions Group */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Primary Actions
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <EnhancedButton variant='primary'>
                    Save Changes
                  </EnhancedButton>
                  <EnhancedButton variant='secondary'>
                    Save Draft
                  </EnhancedButton>
                  <EnhancedButton variant='outline'>Cancel</EnhancedButton>
                </div>
              </div>

              {/* Destructive Actions Group */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Destructive Actions
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <EnhancedButton variant='error'>
                    Delete Permanently
                  </EnhancedButton>
                  <EnhancedButton
                    variant='outline'
                    icon={<X className='size-4' />}
                  >
                    Cancel
                  </EnhancedButton>
                </div>
              </div>

              {/* Icon Button Groups */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Icon Button Toolbar
                </h3>
                <div className='flex gap-2'>
                  <EnhancedButton
                    size='sm'
                    variant='outline'
                    icon={<Download className='size-4' />}
                    iconPosition='only'
                    aria-label='Download'
                  />
                  <EnhancedButton
                    size='sm'
                    variant='outline'
                    icon={<Heart className='size-4' />}
                    iconPosition='only'
                    aria-label='Like'
                  />
                  <EnhancedButton
                    size='sm'
                    variant='outline'
                    icon={<Plus className='size-4' />}
                    iconPosition='only'
                    aria-label='Add'
                  />
                  <EnhancedButton
                    size='sm'
                    variant='outline'
                    icon={<Check className='size-4' />}
                    iconPosition='only'
                    aria-label='Confirm'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Dialog Component Showcase */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Dialog System
            </h2>
            <p className='text-muted-foreground'>
              MAPS v2.2 Enhanced Dialog with Radix UI primitives, liquid glass
              materials, and enterprise accessibility features
            </p>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {/* Basic Dialog */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Basic Dialog
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <EnhancedButton variant='primary' className='w-full'>
                      Open Basic Dialog
                    </EnhancedButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Welcome to Enhanced Dialog</DialogTitle>
                      <DialogDescription>
                        This is a demonstration of the MAPS v2.2 Enhanced Dialog
                        component with proper accessibility features and Apple
                        HIG design philosophy.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='py-4'>
                      <p className='text-foreground'>
                        This dialog demonstrates the core functionality with
                        proper focus management, keyboard navigation, and screen
                        reader support.
                      </p>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <EnhancedButton variant='outline'>
                          Cancel
                        </EnhancedButton>
                      </DialogClose>
                      <DialogClose asChild>
                        <EnhancedButton variant='primary'>
                          Confirm
                        </EnhancedButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Standard dialog with proper ARIA labels and focus management
                </p>
              </div>

              {/* Confirmation Dialog */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Confirmation Dialog
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <EnhancedButton
                      variant='error'
                      className='w-full'
                      icon={<AlertTriangle className='size-4' />}
                    >
                      Delete Account
                    </EnhancedButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='py-4'>
                      <div className='rounded-md border border-destructive/20 bg-destructive/10 p-4'>
                        <div className='flex items-center gap-2'>
                          <AlertTriangle className='size-5 shrink-0 text-destructive' />
                          <p className='font-medium text-destructive'>
                            Warning: This action is irreversible
                          </p>
                        </div>
                        <p className='mt-2 text-sm text-destructive/80'>
                          Please type &quot;DELETE&quot; to confirm this action.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <EnhancedButton variant='outline'>
                          Cancel
                        </EnhancedButton>
                      </DialogClose>
                      <DialogClose asChild>
                        <EnhancedButton variant='error'>
                          Delete Account
                        </EnhancedButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Destructive action with clear warning indicators
                </p>
              </div>

              {/* Info Dialog */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Information Dialog
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <EnhancedButton
                      variant='outline'
                      className='w-full'
                      icon={<Info className='size-4' />}
                    >
                      System Information
                    </EnhancedButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>System Information</DialogTitle>
                      <DialogDescription>
                        Current system status and configuration details
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='text-muted-foreground'>
                            Version:
                          </span>
                          <span className='ml-2 text-foreground'>
                            MAPS v2.2
                          </span>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>Status:</span>
                          <span className='ml-2 text-success'>Active</span>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>Uptime:</span>
                          <span className='ml-2 text-foreground'>24h 17m</span>
                        </div>
                        <div>
                          <span className='text-muted-foreground'>Theme:</span>
                          <span className='ml-2 text-foreground'>Dark</span>
                        </div>
                      </div>
                      <div className='rounded-md bg-accent/50 p-3'>
                        <p className='text-sm text-foreground'>
                          All systems operational. Enhanced components are
                          running with full AAA accessibility compliance.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <EnhancedButton variant='primary'>
                          Got it
                        </EnhancedButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Informational dialog with system status
                </p>
              </div>

              {/* Form Dialog */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Form Dialog
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <EnhancedButton
                      variant='secondary'
                      className='w-full'
                      icon={<User className='size-4' />}
                    >
                      Edit Profile
                    </EnhancedButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information. Changes will be saved
                        automatically.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                      <div className='space-y-2'>
                        <label
                          htmlFor='name'
                          className='text-sm font-medium text-foreground'
                        >
                          Display Name
                        </label>
                        <input
                          id='name'
                          type='text'
                          defaultValue='John Doe'
                          className='w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label
                          htmlFor='email'
                          className='text-sm font-medium text-foreground'
                        >
                          Email Address
                        </label>
                        <input
                          id='email'
                          type='email'
                          defaultValue='john@example.com'
                          className='w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring'
                        />
                      </div>
                      <div className='space-y-2'>
                        <label
                          htmlFor='bio'
                          className='text-sm font-medium text-foreground'
                        >
                          Bio
                        </label>
                        <textarea
                          id='bio'
                          rows={3}
                          defaultValue='Building amazing user experiences with MAPS v2.2'
                          className='w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <EnhancedButton variant='outline'>
                          Cancel
                        </EnhancedButton>
                      </DialogClose>
                      <DialogClose asChild>
                        <EnhancedButton variant='primary'>
                          Save Changes
                        </EnhancedButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Form dialog with proper input focus management
                </p>
              </div>

              {/* Settings Dialog */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Settings Dialog
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <EnhancedButton
                      variant='ghost'
                      className='w-full'
                      icon={<Settings className='size-4' />}
                    >
                      Open Settings
                    </EnhancedButton>
                  </DialogTrigger>
                  <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                      <DialogTitle>Application Settings</DialogTitle>
                      <DialogDescription>
                        Configure your application preferences and accessibility
                        options
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-6 py-4'>
                      <div className='space-y-4'>
                        <h4 className='text-sm font-medium text-foreground'>
                          Appearance
                        </h4>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              Theme
                            </span>
                            <div className='flex gap-2'>
                              <EnhancedButton size='sm' variant='outline'>
                                Light
                              </EnhancedButton>
                              <EnhancedButton size='sm' variant='primary'>
                                Dark
                              </EnhancedButton>
                              <EnhancedButton size='sm' variant='outline'>
                                Auto
                              </EnhancedButton>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              High Contrast
                            </span>
                            <input type='checkbox' className='size-4' />
                          </div>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <h4 className='text-sm font-medium text-foreground'>
                          Accessibility
                        </h4>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              Reduce Motion
                            </span>
                            <input type='checkbox' className='size-4' />
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              AAA Color Compliance
                            </span>
                            <input
                              type='checkbox'
                              defaultChecked
                              className='size-4'
                            />
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              Screen Reader Support
                            </span>
                            <input
                              type='checkbox'
                              defaultChecked
                              className='size-4'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='space-y-4'>
                        <h4 className='text-sm font-medium text-foreground'>
                          Liquid Glass Materials
                        </h4>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              Enable Glass Effects
                            </span>
                            <input
                              type='checkbox'
                              defaultChecked
                              className='size-4'
                            />
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-foreground'>
                              Backdrop Blur Intensity
                            </span>
                            <input
                              type='range'
                              min='0'
                              max='100'
                              defaultValue='60'
                              className='w-24'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <EnhancedButton variant='outline'>
                          Reset to Defaults
                        </EnhancedButton>
                      </DialogClose>
                      <DialogClose asChild>
                        <EnhancedButton variant='primary'>
                          Apply Settings
                        </EnhancedButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Complex settings dialog with multiple sections
                </p>
              </div>

              {/* Feedback Dialog */}
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-medium text-foreground'>
                  Feedback Dialog
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <EnhancedButton
                      variant='primary'
                      className='w-full'
                      icon={<MessageSquare className='size-4' />}
                    >
                      Send Feedback
                    </EnhancedButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Feedback</DialogTitle>
                      <DialogDescription>
                        Help us improve MAPS v2.2 by sharing your thoughts and
                        suggestions
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                      <div className='space-y-2'>
                        <label
                          htmlFor='feedback-type'
                          className='text-sm font-medium text-foreground'
                        >
                          Feedback Type
                        </label>
                        <div className='flex gap-2' id='feedback-type'>
                          <EnhancedButton size='sm' variant='primary'>
                            Bug Report
                          </EnhancedButton>
                          <EnhancedButton size='sm' variant='outline'>
                            Feature Request
                          </EnhancedButton>
                          <EnhancedButton size='sm' variant='outline'>
                            General
                          </EnhancedButton>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <label
                          htmlFor='feedback'
                          className='text-sm font-medium text-foreground'
                        >
                          Your Feedback
                        </label>
                        <textarea
                          id='feedback'
                          rows={4}
                          placeholder='Please describe your feedback in detail...'
                          className='w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring'
                        />
                      </div>
                      <div className='rounded-md bg-accent/30 p-3'>
                        <p className='text-xs text-muted-foreground'>
                          Your feedback helps us build better, more accessible
                          components. Thank you for taking the time to share
                          your thoughts.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <EnhancedButton variant='outline'>
                          Cancel
                        </EnhancedButton>
                      </DialogClose>
                      <DialogClose asChild>
                        <EnhancedButton variant='primary'>
                          Send Feedback
                        </EnhancedButton>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Feedback collection with categorization
                </p>
              </div>
            </div>

            {/* Dialog Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Enhanced Dialog Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full keyboard navigation support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Screen reader optimized ARIA labels
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Focus trap and restoration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Escape key and click-outside closing
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass backdrop blur effects
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion-reduced animations
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Windows High Contrast support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Radix UI primitive foundation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Input Showcase Section */}
          <section className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Input Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional form fields with MAPS v2.2 compliance, AAA
                accessibility, and Apple HIG design philosophy
              </p>
            </div>

            {/* Input Variants Grid */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Basic Input Examples */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Input Variants
                </h3>
                <div className='space-y-4'>
                  <EnhancedInput
                    label='Default Input'
                    placeholder='Enter your text here'
                    description='Clean, professional baseline styling'
                  />

                  <EnhancedInput
                    variant='ghost'
                    label='Ghost Input'
                    placeholder='Minimal, elegant styling'
                    description='Transparent until focused'
                  />

                  <EnhancedInput
                    variant='filled'
                    label='Filled Input'
                    placeholder='Subtle depth styling'
                    description='Gentle background for visual hierarchy'
                  />

                  <EnhancedInput
                    variant='floating'
                    vibrancy='glass'
                    label='Glass Input'
                    placeholder='Modern glass effect'
                    description='Liquid glass materials with backdrop blur'
                  />
                </div>
              </div>

              {/* Input with Icons */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Enhanced Features
                </h3>
                <div className='space-y-4'>
                  <EnhancedInput
                    label='Search'
                    placeholder='Search for anything...'
                    startIcon={<Search size={16} />}
                    clearable
                    onClear={() => console.log('Search cleared')}
                  />

                  <EnhancedInput
                    type='email'
                    label='Email Address'
                    placeholder='your@email.com'
                    startIcon={<Mail size={16} />}
                    required
                  />

                  <EnhancedInput
                    type='password'
                    label='Password'
                    placeholder='Enter secure password'
                    startIcon={<Lock size={16} />}
                    endIcon={<Eye size={16} />}
                    required
                  />

                  <EnhancedInput
                    label='Loading Input'
                    placeholder='Processing...'
                    loading
                    disabled
                  />
                </div>
              </div>

              {/* Input Sizes */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Size Variants
                </h3>
                <div className='space-y-4'>
                  <EnhancedInput
                    size='sm'
                    label='Small Input'
                    placeholder='Compact size (32px)'
                    data-testid='small-input'
                  />

                  <EnhancedInput
                    size='md'
                    label='Medium Input (Default)'
                    placeholder='Standard size (40px)'
                    data-testid='medium-input'
                  />

                  <EnhancedInput
                    size='lg'
                    label='Large Input'
                    placeholder='Generous size (48px)'
                    data-testid='large-input'
                  />

                  <EnhancedInput
                    size='touch'
                    label='Touch Input'
                    placeholder='Mobile-optimized (44px)'
                    description='Automatically applied on touch devices'
                    data-testid='touch-input'
                  />
                </div>
              </div>

              {/* Validation States */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Validation States
                </h3>
                <div className='space-y-4'>
                  <EnhancedInput
                    label='Success State'
                    value='Valid input ✓'
                    state='success'
                    hint='Great! This looks correct.'
                    readOnly
                  />

                  <EnhancedInput
                    label='Warning State'
                    value='Check this field'
                    state='warning'
                    hint='Please review this information'
                    readOnly
                  />

                  <EnhancedInput
                    label='Error State'
                    value='Invalid input'
                    errorMessage='This field contains an error'
                    readOnly
                    required
                  />

                  <EnhancedInput
                    label='AAA Compliance Mode'
                    placeholder='Enhanced accessibility'
                    enforceAAA
                    description='Guaranteed 7:1 contrast ratio'
                  />
                </div>
              </div>
            </div>

            {/* Input Features Grid */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-semibold text-foreground'>
                ✨ Enhanced Input Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Complete field composition system
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Start and end icon support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Keyboard-accessible clear button
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Platform-aware touch targets
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass vibrancy effects
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility enforcement
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Forced Colors mode support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Autofill contrast protection
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Complete ARIA attribute system
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 token compliance
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Label Showcase Section */}
          <section className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Label Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional form labels with MAPS v2.2 compliance, Apple HIG
                typography, and comprehensive accessibility support
              </p>
            </div>

            {/* Basic Label Variants */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Basic Labels */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Label Variants
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel variant='default'>
                      Default Label
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Clean, professional baseline styling with proper
                      typography hierarchy
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel variant='primary'>
                      Primary Label
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Emphasized for key form fields with primary accent color
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel variant='secondary'>
                      Secondary Label
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Muted for supporting information with subtle appearance
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel variant='destructive'>
                      Error Label
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      For error states with semantic destructive coloring
                    </p>
                  </div>
                </div>
              </div>

              {/* Label States */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Label States
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel required>Required Field Label</EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Automatically adds visual required indicator (*)
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel invalid>Invalid Field Label</EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Error state with destructive coloring for validation
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel disabled>Disabled Label</EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Reduced opacity for disabled form fields
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel description='This is helpful description text that provides additional context'>
                      Label with Description
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Includes accessible description support
                    </p>
                  </div>
                </div>
              </div>

              {/* Size Variants */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Size Variants
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel size='sm'>Small Label</EnhancedLabel>
                    <p className='text-xs text-muted-foreground'>
                      Compact size (12px) for dense layouts
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel size='md'>
                      Medium Label (Default)
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Standard size (14px) for most use cases
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel size='lg'>Large Label</EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Prominent size (16px) for important fields
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel size='xl'>Extra Large Label</EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Hero size (18px) for form headers
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive States */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Interactive States
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel
                      interactive
                      onInteraction={() => console.log('Label clicked')}
                    >
                      Interactive Label
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Clickable with hover and focus states
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel
                      showFocus
                      onInteraction={() => console.log('Focus label clicked')}
                    >
                      Focus-visible Label
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Enhanced focus management for accessibility
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel interactive aaa variant='primary'>
                      AAA Compliant Interactive
                    </EnhancedLabel>
                    <p className='text-sm text-muted-foreground'>
                      Guaranteed 7:1 contrast ratio with interactions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Integration Patterns */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Form Integration Patterns
              </h3>

              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                {/* Label with Field Component */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    LabelWithField Component
                  </h4>
                  <div className='space-y-4'>
                    <LabelWithField
                      label='Email Address'
                      description='Enter your professional email address'
                      required
                      field={
                        <EnhancedInput
                          type='email'
                          placeholder='your@company.com'
                          startIcon={<Mail size={16} />}
                        />
                      }
                    />

                    <LabelWithField
                      label='Password'
                      description='Must be at least 8 characters long'
                      required
                      errorMessage='Password must contain at least one number'
                      field={
                        <EnhancedInput
                          type='password'
                          placeholder='Enter secure password'
                          startIcon={<Lock size={16} />}
                        />
                      }
                    />

                    <LabelWithField
                      label='Optional Field'
                      description='This field is completely optional'
                      layout='horizontal'
                      field={
                        <EnhancedInput placeholder='Optional information' />
                      }
                    />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Complete field composition with automatic ARIA association
                  </p>
                </div>

                {/* Form Field Groups */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='text-lg font-semibold text-foreground'>
                    FormFieldGroup Component
                  </h4>
                  <div className='space-y-4'>
                    <FormFieldGroup
                      legend='Personal Information'
                      description='Please provide your basic information'
                      required
                      layout='vertical'
                    >
                      <LabelWithField
                        label='First Name'
                        required
                        field={<EnhancedInput placeholder='John' />}
                      />
                      <LabelWithField
                        label='Last Name'
                        required
                        field={<EnhancedInput placeholder='Doe' />}
                      />
                    </FormFieldGroup>

                    <FormFieldGroup
                      legend='Contact Preferences'
                      description='How would you like us to contact you?'
                      layout='horizontal'
                    >
                      <CheckboxWithLabel label='Email updates' />
                      <CheckboxWithLabel label='SMS notifications' />
                      <CheckboxWithLabel label='Phone calls' />
                    </FormFieldGroup>

                    <FormFieldGroup
                      legend='Address Information'
                      layout='grid'
                      columns={2}
                      errorMessage='Please complete all required address fields'
                    >
                      <LabelWithField
                        label='Street Address'
                        required
                        field={<EnhancedInput placeholder='123 Main St' />}
                      />
                      <LabelWithField
                        label='City'
                        required
                        field={<EnhancedInput placeholder='New York' />}
                      />
                      <LabelWithField
                        label='State'
                        required
                        field={
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder='Select state' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='ny'>New York</SelectItem>
                              <SelectItem value='ca'>California</SelectItem>
                              <SelectItem value='tx'>Texas</SelectItem>
                            </SelectContent>
                          </Select>
                        }
                      />
                      <LabelWithField
                        label='ZIP Code'
                        required
                        field={<EnhancedInput placeholder='10001' />}
                      />
                    </FormFieldGroup>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Advanced form patterns with fieldset grouping and grid
                    layouts
                  </p>
                </div>
              </div>
            </div>

            {/* Factory Function Demonstration */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-foreground'>
                Factory Function Pattern
              </h3>
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h4 className='text-lg font-medium text-foreground'>
                  createLabelWithField Factory
                </h4>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>
                      Create reusable labeled field components with consistent
                      styling and behavior
                    </p>
                    <div className='space-y-3'>
                      {(() => {
                        const LabeledEmailInput = createLabelWithField(
                          EnhancedInput,
                          {
                            type: 'email',
                            startIcon: <Mail size={16} />,
                            placeholder: 'Enter email address',
                          }
                        );

                        const LabeledPasswordInput = createLabelWithField(
                          EnhancedInput,
                          {
                            type: 'password',
                            startIcon: <Lock size={16} />,
                            placeholder: 'Enter password',
                          }
                        );

                        return (
                          <>
                            <LabeledEmailInput
                              label='Work Email'
                              description='Your professional email address'
                              required
                            />
                            <LabeledPasswordInput
                              label='Account Password'
                              description='Must be at least 8 characters'
                              required
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div className='rounded-lg border border-border/50 bg-muted/30 p-4'>
                    <h5 className='mb-2 text-sm font-medium text-foreground'>
                      Factory Benefits
                    </h5>
                    <ul className='space-y-1 text-sm text-muted-foreground'>
                      <li>• Consistent field configurations</li>
                      <li>• Reusable component patterns</li>
                      <li>• Automatic prop inheritance</li>
                      <li>• Type-safe field associations</li>
                      <li>• Reduced code duplication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Label Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-semibold text-foreground'>
                ✨ Enhanced Label Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 typography foundation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG semantic hierarchy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Complete ARIA label association
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Required state visual indicators
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Form integration patterns
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion preference respect
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Polymorphic component architecture
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Advanced form field grouping
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first design philosophy
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Card Showcase - MAPS v2.2 Foundation */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Card - Dark-First Content Containers
            </h2>
            <p className='text-muted-foreground'>
              Sophisticated content containers with Apple HIG philosophy, liquid
              glass materials, and comprehensive accessibility patterns
              following MAPS v2.2 architecture.
            </p>

            {/* Core Card Variants */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
              {/* Default Card */}
              <EnhancedCard className='max-w-sm'>
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Default Card</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Clean, minimal design with subtle borders and balanced
                    spacing.
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <p className='text-sm text-muted-foreground'>
                    Perfect for content sections, form groups, and general
                    information display.
                  </p>
                </EnhancedCardContent>
                <EnhancedCardFooter justify='between'>
                  <span className='text-xs text-muted-foreground'>
                    Updated 2h ago
                  </span>
                  <EnhancedButton variant='secondary' size='sm'>
                    View Details
                  </EnhancedButton>
                </EnhancedCardFooter>
              </EnhancedCard>

              {/* Elevated Card */}
              <EnhancedCard variant='elevated' className='max-w-sm'>
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Elevated Card</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Enhanced with Apple-style elevation for visual hierarchy.
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <p className='text-sm text-muted-foreground'>
                    Ideal for important content, feature highlights, and
                    call-to-action sections.
                  </p>
                </EnhancedCardContent>
                <EnhancedCardFooter>
                  <EnhancedButton
                    variant='primary'
                    size='sm'
                    className='w-full'
                  >
                    Get Started
                  </EnhancedButton>
                </EnhancedCardFooter>
              </EnhancedCard>

              {/* Glass Card */}
              <EnhancedCard variant='glass' className='max-w-sm'>
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Glass Card</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Sophisticated vibrancy with liquid glass materials.
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <p className='text-sm text-muted-foreground'>
                    Advanced visual treatment for premium features and modern
                    interfaces.
                  </p>
                </EnhancedCardContent>
                <EnhancedCardFooter justify='center'>
                  <EnhancedButton variant='outline' size='sm'>
                    <Settings className='mr-2 size-4' />
                    Configure
                  </EnhancedButton>
                </EnhancedCardFooter>
              </EnhancedCard>
            </div>

            {/* Interactive Cards */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Cards
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <EnhancedCard
                  interactive
                  onClick={() =>
                    showToast(
                      'info',
                      'Card Clicked',
                      'Interactive card demonstrates click handling'
                    )
                  }
                  className='cursor-pointer transition-all pointer:hover:scale-105'
                >
                  <EnhancedCardHeader>
                    <EnhancedCardTitle className='flex items-center'>
                      <MessageSquare className='mr-2 size-5' />
                      Interactive Features
                    </EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Click this card to see interaction feedback
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <p className='text-sm text-muted-foreground'>
                      Full keyboard navigation support with proper focus
                      management and ARIA attributes.
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>

                <EnhancedCard
                  variant='outlined'
                  interactive
                  onClick={() => setIsLiked(!isLiked)}
                  className='cursor-pointer transition-all hover:border-primary/50'
                >
                  <EnhancedCardHeader>
                    <EnhancedCardTitle className='flex items-center justify-between'>
                      <span>Likeable Content</span>
                      <Heart
                        className={`size-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                      />
                    </EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Interactive state management example
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <p className='text-sm text-muted-foreground'>
                      Demonstrates stateful interactions with visual feedback.
                    </p>
                  </EnhancedCardContent>
                  <EnhancedCardFooter>
                    <span className='text-xs text-muted-foreground'>
                      {likeCount} likes
                    </span>
                  </EnhancedCardFooter>
                </EnhancedCard>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
                <EnhancedCard size='sm' variant='outlined'>
                  <EnhancedCardHeader size='sm'>
                    <EnhancedCardTitle size='sm'>Small Card</EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Compact design
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent size='sm'>
                    <p className='text-xs text-muted-foreground'>
                      Minimal content space
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>

                <EnhancedCard size='md'>
                  <EnhancedCardHeader size='md'>
                    <EnhancedCardTitle size='md'>Medium Card</EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Standard size
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent size='md'>
                    <p className='text-sm text-muted-foreground'>
                      Default card sizing
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>

                <EnhancedCard size='lg' variant='elevated'>
                  <EnhancedCardHeader size='lg'>
                    <EnhancedCardTitle size='lg'>Large Card</EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Spacious layout
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent size='lg'>
                    <p className='text-sm text-muted-foreground'>
                      Extended content areas
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>

                <EnhancedCard size='xl' variant='glass'>
                  <EnhancedCardHeader size='xl'>
                    <EnhancedCardTitle size='xl'>Extra Large</EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Maximum spacing
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent size='xl'>
                    <p className='text-sm text-muted-foreground'>
                      Premium card experience
                    </p>
                  </EnhancedCardContent>
                </EnhancedCard>
              </div>
            </div>

            {/* Factory Function Examples */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Factory Functions
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Using default factory */}
                <CardFactory.default.Card className='max-w-sm'>
                  <CardFactory.default.Header>
                    <CardFactory.default.Title>
                      Default Factory
                    </CardFactory.default.Title>
                    <CardFactory.default.Description>
                      Pre-configured default variant
                    </CardFactory.default.Description>
                  </CardFactory.default.Header>
                  <CardFactory.default.Content>
                    <p className='text-sm text-muted-foreground'>
                      Semantic component creation with factory functions.
                    </p>
                  </CardFactory.default.Content>
                </CardFactory.default.Card>

                {/* Using interactive factory */}
                <CardFactory.interactive.Card
                  className='max-w-sm'
                  onClick={() =>
                    showToast(
                      'success',
                      'Factory Card',
                      'Interactive factory demonstration'
                    )
                  }
                >
                  <CardFactory.interactive.Header>
                    <CardFactory.interactive.Title>
                      Interactive Factory
                    </CardFactory.interactive.Title>
                    <CardFactory.interactive.Description>
                      Pre-configured interactive behavior
                    </CardFactory.interactive.Description>
                  </CardFactory.interactive.Header>
                  <CardFactory.interactive.Content>
                    <p className='text-sm text-muted-foreground'>
                      Built-in interaction patterns and accessibility.
                    </p>
                  </CardFactory.interactive.Content>
                </CardFactory.interactive.Card>

                {/* Using AAA factory */}
                <CardFactory.aaa.Card variant='glass' className='max-w-sm'>
                  <CardFactory.aaa.Header>
                    <CardFactory.aaa.Title>
                      AAA Compliance
                    </CardFactory.aaa.Title>
                    <CardFactory.aaa.Description>
                      Maximum accessibility assurance
                    </CardFactory.aaa.Description>
                  </CardFactory.aaa.Header>
                  <CardFactory.aaa.Content>
                    <p className='text-sm text-muted-foreground'>
                      WCAG AAA compliant with enhanced contrast and focus
                      management.
                    </p>
                  </CardFactory.aaa.Content>
                </CardFactory.aaa.Card>
              </div>
            </div>

            {/* Complex Card Example */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Complex Example
              </h3>
              <div className='mx-auto max-w-md'>
                <EnhancedCard variant='floating' className='overflow-hidden'>
                  <div className='flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-6'>
                    <Play className='size-12 text-primary' />
                  </div>
                  <EnhancedCardHeader>
                    <EnhancedCardTitle>Media Card Example</EnhancedCardTitle>
                    <EnhancedCardDescription>
                      Sophisticated card with media content and rich
                      interactions
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <div className='space-y-3'>
                      <div className='flex items-center space-x-2'>
                        <User className='size-4 text-muted-foreground' />
                        <span className='text-sm text-muted-foreground'>
                          John Doe
                        </span>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Demonstration of advanced card layouts with media,
                        metadata, and action areas.
                      </p>
                    </div>
                  </EnhancedCardContent>
                  <EnhancedCardFooter justify='between' className='bg-muted/20'>
                    <div className='flex space-x-2'>
                      <EnhancedButton variant='ghost' size='sm'>
                        <Heart className='size-4' />
                      </EnhancedButton>
                      <EnhancedButton variant='ghost' size='sm'>
                        <MessageSquare className='size-4' />
                      </EnhancedButton>
                    </div>
                    <EnhancedButton variant='primary' size='sm'>
                      <Play className='mr-2 size-4' />
                      Watch Now
                    </EnhancedButton>
                  </EnhancedCardFooter>
                </EnhancedCard>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Keyboard Navigation
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Interactive cards are focusable with Tab</li>
                    <li>• Enter and Space activate interactive cards</li>
                    <li>• Proper focus indicators and outlines</li>
                    <li>• Focus management for complex layouts</li>
                  </ul>
                </div>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Screen Reader Support
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Semantic HTML structure with proper roles</li>
                    <li>• ARIA attributes for interactive states</li>
                    <li>• Clear content hierarchy and relationships</li>
                    <li>• AAA compliance mode available</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Badge Showcase - MAPS v2.2 Foundation */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Badge - Dark-First Status Indicators
            </h2>
            <p className='text-muted-foreground'>
              Sophisticated status indicators with Apple HIG philosophy,
              semantic color patterns, and comprehensive accessibility patterns
              following MAPS v2.2 architecture.
            </p>

            {/* Core Badge Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Semantic Variants
              </h3>
              <div className='flex flex-wrap gap-3'>
                <EnhancedBadge variant='default'>Default</EnhancedBadge>
                <EnhancedBadge variant='secondary'>Secondary</EnhancedBadge>
                <EnhancedBadge variant='muted'>Muted</EnhancedBadge>
                <EnhancedBadge variant='accent'>Accent</EnhancedBadge>
                <EnhancedBadge variant='outline'>Outline</EnhancedBadge>
                <EnhancedBadge variant='ghost'>Ghost</EnhancedBadge>
              </div>
            </div>

            {/* Status Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Status Variants
              </h3>
              <div className='flex flex-wrap gap-3'>
                <EnhancedBadge variant='success'>Success</EnhancedBadge>
                <EnhancedBadge variant='warning'>Warning</EnhancedBadge>
                <EnhancedBadge variant='error'>Error</EnhancedBadge>
                <EnhancedBadge variant='info'>Info</EnhancedBadge>
              </div>
            </div>

            {/* Glass Material Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Liquid Glass Materials
              </h3>
              <div className='flex flex-wrap gap-3'>
                <EnhancedBadge variant='glass'>Glass Effect</EnhancedBadge>
                <EnhancedBadge variant='floating'>Floating Glass</EnhancedBadge>
                <EnhancedBadge variant='glass' enforceAAA>
                  AAA Glass
                </EnhancedBadge>
                <EnhancedBadge variant='floating' enforceAAA>
                  AAA Floating
                </EnhancedBadge>
              </div>
            </div>

            {/* Size System */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='flex flex-wrap items-center gap-3'>
                <EnhancedBadge size='sm'>Small</EnhancedBadge>
                <EnhancedBadge size='md'>Medium</EnhancedBadge>
                <EnhancedBadge size='lg'>Large</EnhancedBadge>
                <EnhancedBadge size='xl'>Extra Large</EnhancedBadge>
              </div>
            </div>

            {/* Count Badges */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Count Badges
              </h3>
              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>
                    Messages
                  </span>
                  <EnhancedBadge count={3} variant='default' size='sm' />
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>
                    Notifications
                  </span>
                  <EnhancedBadge count={12} variant='error' size='sm' />
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>Updates</span>
                  <EnhancedBadge
                    count={150}
                    max={99}
                    variant='info'
                    size='sm'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>Inbox</span>
                  <EnhancedBadge
                    count={1247}
                    showOverflow={false}
                    variant='success'
                    size='sm'
                  />
                </div>
              </div>
            </div>

            {/* Icon Badges */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Icon Integration
              </h3>
              <div className='flex flex-wrap gap-3'>
                <EnhancedBadge
                  icon={<Mail className='size-3' />}
                  variant='default'
                >
                  Mail
                </EnhancedBadge>
                <EnhancedBadge
                  icon={<AlertTriangle className='size-3' />}
                  iconPosition='right'
                  variant='warning'
                >
                  Warning
                </EnhancedBadge>
                <EnhancedBadge
                  icon={<Check className='size-3' />}
                  variant='success'
                >
                  Complete
                </EnhancedBadge>
                <EnhancedBadge
                  icon={<Settings className='size-3' />}
                  iconPosition='right'
                  variant='ghost'
                >
                  Settings
                </EnhancedBadge>
              </div>
            </div>

            {/* Interactive Badges */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Features
              </h3>
              <div className='flex flex-wrap gap-3'>
                <EnhancedBadge
                  interactive
                  onClick={() =>
                    showToast(
                      'info',
                      'Badge Clicked',
                      'Interactive badge demonstration'
                    )
                  }
                  variant='outline'
                >
                  Clickable
                </EnhancedBadge>
                <EnhancedBadge
                  dismissible
                  onRemove={() =>
                    showToast(
                      'success',
                      'Badge Removed',
                      'Dismissible badge demonstration'
                    )
                  }
                  variant='secondary'
                >
                  Dismissible
                </EnhancedBadge>
                <EnhancedBadge
                  interactive
                  dismissible
                  onClick={() => showToast('info', 'Badge Clicked')}
                  onRemove={() => showToast('success', 'Badge Removed')}
                  variant='accent'
                >
                  Both Features
                </EnhancedBadge>
              </div>
            </div>

            {/* Dot Badges */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Status Dots
              </h3>
              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <EnhancedBadge dot variant='success' />
                  <span className='text-sm text-muted-foreground'>Online</span>
                </div>
                <div className='flex items-center gap-2'>
                  <EnhancedBadge dot variant='warning' />
                  <span className='text-sm text-muted-foreground'>Away</span>
                </div>
                <div className='flex items-center gap-2'>
                  <EnhancedBadge dot variant='error' />
                  <span className='text-sm text-muted-foreground'>Offline</span>
                </div>
                <div className='flex items-center gap-2'>
                  <EnhancedBadge dot pulse variant='success' />
                  <span className='text-sm text-muted-foreground'>Live</span>
                </div>
                <div className='flex items-center gap-2'>
                  <EnhancedBadge dot pulse variant='info' />
                  <span className='text-sm text-muted-foreground'>
                    Processing
                  </span>
                </div>
              </div>
            </div>

            {/* Factory Functions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Factory Functions
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Semantic Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Semantic Patterns
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    <BadgeFactory.default.Badge>
                      Default
                    </BadgeFactory.default.Badge>
                    <BadgeFactory.secondary.Badge>
                      Secondary
                    </BadgeFactory.secondary.Badge>
                    <BadgeFactory.accent.Badge>
                      Accent
                    </BadgeFactory.accent.Badge>
                  </div>
                </div>

                {/* Status Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Status Patterns
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    <BadgeFactory.success.Badge>
                      Success
                    </BadgeFactory.success.Badge>
                    <BadgeFactory.warning.Badge>
                      Warning
                    </BadgeFactory.warning.Badge>
                    <BadgeFactory.error.Badge>Error</BadgeFactory.error.Badge>
                  </div>
                </div>

                {/* Feature Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Feature Patterns
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    <BadgeFactory.interactive.Badge
                      onClick={() => showToast('info', 'Factory Click')}
                    >
                      Interactive
                    </BadgeFactory.interactive.Badge>
                    <BadgeFactory.pulse.Badge>Pulsing</BadgeFactory.pulse.Badge>
                    <BadgeFactory.dot.Badge />
                  </div>
                </div>

                {/* Compound Patterns */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Compound Patterns
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    <BadgeFactory.notification.Badge />
                    <BadgeFactory.status.Badge />
                    <BadgeFactory.count.Badge count={42} />
                  </div>
                </div>

                {/* Glass Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Glass Materials
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    <BadgeFactory.glass.Badge>Glass</BadgeFactory.glass.Badge>
                    <BadgeFactory.floating.Badge>
                      Floating
                    </BadgeFactory.floating.Badge>
                    <BadgeFactory.aaa.Badge variant='glass'>
                      AAA Glass
                    </BadgeFactory.aaa.Badge>
                  </div>
                </div>

                {/* Size Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Size Presets
                  </h4>
                  <div className='flex flex-wrap items-center gap-2'>
                    <BadgeFactory.small.Badge>Small</BadgeFactory.small.Badge>
                    <EnhancedBadge>Default</EnhancedBadge>
                    <BadgeFactory.large.Badge>Large</BadgeFactory.large.Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Utility Functions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Utility Functions
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Count Badges
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {createCountBadge(5)}
                    {createCountBadge(23, { variant: 'success' })}
                    {createCountBadge(156, { variant: 'info', max: 99 })}
                  </div>
                </div>

                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Status Dots
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {createStatusDot('success')}
                    {createStatusDot('warning')}
                    {createStatusDot('error')}
                    {createStatusDot('info')}
                  </div>
                </div>

                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Notification Badges
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {createNotificationBadge()} {/* Dot when no count */}
                    {createNotificationBadge(3)} {/* Count when provided */}
                    {createNotificationBadge(99, { max: 50 })} {/* Overflow */}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-world Examples */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Real-world Examples
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Navigation Example */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Navigation Menu
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Messages
                      </span>
                      <EnhancedBadge count={12} variant='default' size='sm' />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Notifications
                      </span>
                      <EnhancedBadge count={3} variant='error' size='sm' />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        Updates
                      </span>
                      <EnhancedBadge dot pulse variant='info' />
                    </div>
                  </div>
                </div>

                {/* User Status Example */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>User Status</h4>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex size-8 items-center justify-center rounded-full bg-muted'>
                        <User className='size-4' />
                      </div>
                      <div className='flex-1'>
                        <div className='text-sm font-medium'>John Doe</div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <EnhancedBadge dot variant='success' />
                          Online
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='flex size-8 items-center justify-center rounded-full bg-muted'>
                        <User className='size-4' />
                      </div>
                      <div className='flex-1'>
                        <div className='text-sm font-medium'>Jane Smith</div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <EnhancedBadge dot variant='warning' />
                          Away
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='flex size-8 items-center justify-center rounded-full bg-muted'>
                        <User className='size-4' />
                      </div>
                      <div className='flex-1'>
                        <div className='text-sm font-medium'>Bob Wilson</div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <EnhancedBadge dot variant='error' />
                          Offline
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Tags Example */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6 md:col-span-2'>
                  <h4 className='font-medium text-foreground'>
                    Feature Tags & Labels
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    <EnhancedBadge variant='success'>New</EnhancedBadge>
                    <EnhancedBadge variant='info'>Updated</EnhancedBadge>
                    <EnhancedBadge variant='warning'>Beta</EnhancedBadge>
                    <EnhancedBadge variant='error'>Deprecated</EnhancedBadge>
                    <EnhancedBadge variant='outline'>Free</EnhancedBadge>
                    <EnhancedBadge variant='accent'>Premium</EnhancedBadge>
                    <EnhancedBadge variant='ghost'>Draft</EnhancedBadge>
                    <EnhancedBadge variant='glass'>Glass</EnhancedBadge>
                    <EnhancedBadge
                      dismissible
                      onRemove={() => showToast('success', 'Tag Removed')}
                      variant='secondary'
                    >
                      Removable
                    </EnhancedBadge>
                    <EnhancedBadge
                      interactive
                      onClick={() => showToast('info', 'Tag Clicked')}
                      variant='outline'
                    >
                      Interactive
                    </EnhancedBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Keyboard Navigation
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Interactive badges are focusable with Tab</li>
                    <li>• Enter and Space activate interactive badges</li>
                    <li>• Proper focus indicators and outlines</li>
                    <li>• Dismissible close buttons are keyboard accessible</li>
                  </ul>
                </div>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Screen Reader Support
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Semantic HTML with proper roles and ARIA</li>
                    <li>• Count announcements for dynamic content</li>
                    <li>• Status indicators with meaningful labels</li>
                    <li>• AAA compliance mode for enhanced contrast</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Breadcrumb Showcase - MAPS v2.2 Foundation */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Breadcrumb - Dark-First Navigation Hierarchy
            </h2>
            <p className='text-muted-foreground'>
              Sophisticated navigation breadcrumbs with Apple HIG compliance,
              liquid glass materials, and comprehensive accessibility patterns.
            </p>

            {/* Basic Breadcrumb Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Breadcrumb Variants
              </h3>
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                {/* Default Breadcrumb */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Default Navigation
                  </h4>
                  <EnhancedBreadcrumb>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          <svg
                            className='size-4'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z'
                              clipRule='evenodd'
                            />
                          </svg>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/products'>
                          Products
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/products/electronics'>
                          Electronics
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>
                          Smartphones
                        </EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Compact Breadcrumb */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Compact Navigation
                  </h4>
                  <EnhancedBreadcrumb variant='compact' size='sm'>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='slash' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/docs'>
                          Docs
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='slash' />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>
                          API Reference
                        </EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Pills Breadcrumb */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Pills Navigation
                  </h4>
                  <EnhancedBreadcrumb variant='pills'>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/dashboard'>
                          Dashboard
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/projects'>
                          Projects
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/projects/web-app'>
                          Web App
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>
                          Settings
                        </EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Glass Breadcrumb */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Glass Navigation
                  </h4>
                  <EnhancedBreadcrumb variant='glass' surface='glass'>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/workspace'>
                          Workspace
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/workspace/files'>
                          Files
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/workspace/files/documents'>
                          Documents
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>
                          Report.pdf
                        </EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>
              </div>
            </div>

            {/* Separator Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Separator Styles
              </h3>
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                {/* Chevron Separators */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Chevron Separators
                  </h4>
                  <EnhancedBreadcrumb>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='chevron' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/category'>
                          Category
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='chevron' />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>Current</EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Slash Separators */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Slash Separators
                  </h4>
                  <EnhancedBreadcrumb>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='slash' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/category'>
                          Category
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='slash' />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>Current</EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Dot Separators */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Dot Separators
                  </h4>
                  <EnhancedBreadcrumb>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/category'>
                          Category
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator variant='dot' />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>Current</EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Custom Separator */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Custom Separators
                  </h4>
                  <EnhancedBreadcrumb>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator>
                        <span className='text-muted-foreground'>→</span>
                      </EnhancedBreadcrumbSeparator>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/category'>
                          Category
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator>
                        <span className='text-muted-foreground'>→</span>
                      </EnhancedBreadcrumbSeparator>
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>Current</EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>
              </div>
            </div>

            {/* Truncated Navigation */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Truncated Navigation
              </h3>
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                {/* Long breadcrumb with ellipsis */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Ellipsis Truncation
                  </h4>
                  <EnhancedBreadcrumb>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbEllipsis />
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/category/subcategory/product'>
                          Product
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>
                          Current Item
                        </EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                </div>

                {/* Demonstration with factory utility */}
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Factory Pattern
                  </h4>
                  <div className='space-y-2'>
                    <EnhancedBreadcrumb {...BreadcrumbFactory.navigation()}>
                      <EnhancedBreadcrumbList>
                        <EnhancedBreadcrumbItem>
                          <EnhancedBreadcrumbLink href='/'>
                            Dashboard
                          </EnhancedBreadcrumbLink>
                        </EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbSeparator />
                        <EnhancedBreadcrumbItem isCurrentPage>
                          <EnhancedBreadcrumbPage>
                            Analytics
                          </EnhancedBreadcrumbPage>
                        </EnhancedBreadcrumbItem>
                      </EnhancedBreadcrumbList>
                    </EnhancedBreadcrumb>

                    <EnhancedBreadcrumb {...BreadcrumbFactory.compact()}>
                      <EnhancedBreadcrumbList>
                        <EnhancedBreadcrumbItem>
                          <EnhancedBreadcrumbLink href='/'>
                            Home
                          </EnhancedBreadcrumbLink>
                        </EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbSeparator variant='slash' />
                        <EnhancedBreadcrumbItem isCurrentPage>
                          <EnhancedBreadcrumbPage>
                            Settings
                          </EnhancedBreadcrumbPage>
                        </EnhancedBreadcrumbItem>
                      </EnhancedBreadcrumbList>
                    </EnhancedBreadcrumb>

                    <EnhancedBreadcrumb {...BreadcrumbFactory.glass()}>
                      <EnhancedBreadcrumbList>
                        <EnhancedBreadcrumbItem>
                          <EnhancedBreadcrumbLink href='/'>
                            Workspace
                          </EnhancedBreadcrumbLink>
                        </EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbSeparator variant='dot' />
                        <EnhancedBreadcrumbItem isCurrentPage>
                          <EnhancedBreadcrumbPage>Files</EnhancedBreadcrumbPage>
                        </EnhancedBreadcrumbItem>
                      </EnhancedBreadcrumbList>
                    </EnhancedBreadcrumb>
                  </div>
                </div>
              </div>
            </div>

            {/* AAA Compliance */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    AAA Compliance Mode
                  </h4>
                  <EnhancedBreadcrumb {...BreadcrumbFactory.accessible()}>
                    <EnhancedBreadcrumbList>
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/'>
                          Home
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem>
                        <EnhancedBreadcrumbLink href='/accessible'>
                          Accessibility
                        </EnhancedBreadcrumbLink>
                      </EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbSeparator />
                      <EnhancedBreadcrumbItem isCurrentPage>
                        <EnhancedBreadcrumbPage>
                          AAA Standards
                        </EnhancedBreadcrumbPage>
                      </EnhancedBreadcrumbItem>
                    </EnhancedBreadcrumbList>
                  </EnhancedBreadcrumb>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Enhanced contrast ratios for low vision</li>
                    <li>• Screen reader optimized structure</li>
                    <li>• Keyboard navigation support</li>
                    <li>• ARIA landmark compliance</li>
                  </ul>
                </div>

                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Keyboard Navigation
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Tab to navigate between links</li>
                    <li>• Enter and Space to activate links</li>
                    <li>• Skip to current page with aria-current</li>
                    <li>• Semantic landmark navigation</li>
                    <li>• Screen reader announcements</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Navigation
              </h3>
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <p className='text-sm text-muted-foreground'>
                  Click breadcrumb links to navigate (demo handlers show toast
                  notifications)
                </p>
                <EnhancedBreadcrumb>
                  <EnhancedBreadcrumbList>
                    <EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbLink
                        href='/'
                        onClick={e => {
                          e.preventDefault();
                          showToast('info', 'Navigation', 'Navigated to Home');
                        }}
                      >
                        <svg
                          className='size-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Home
                      </EnhancedBreadcrumbLink>
                    </EnhancedBreadcrumbItem>
                    <EnhancedBreadcrumbSeparator />
                    <EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbLink
                        href='/products'
                        onClick={e => {
                          e.preventDefault();
                          showToast(
                            'info',
                            'Navigation',
                            'Navigated to Products'
                          );
                        }}
                      >
                        Products
                      </EnhancedBreadcrumbLink>
                    </EnhancedBreadcrumbItem>
                    <EnhancedBreadcrumbSeparator />
                    <EnhancedBreadcrumbItem>
                      <EnhancedBreadcrumbLink
                        href='/products/electronics'
                        onClick={e => {
                          e.preventDefault();
                          showToast(
                            'info',
                            'Navigation',
                            'Navigated to Electronics'
                          );
                        }}
                      >
                        Electronics
                      </EnhancedBreadcrumbLink>
                    </EnhancedBreadcrumbItem>
                    <EnhancedBreadcrumbSeparator />
                    <EnhancedBreadcrumbItem isCurrentPage>
                      <EnhancedBreadcrumbPage>
                        iPhone 15 Pro
                      </EnhancedBreadcrumbPage>
                    </EnhancedBreadcrumbItem>
                  </EnhancedBreadcrumbList>
                </EnhancedBreadcrumb>
              </div>
            </div>
          </section>

          {/* Enhanced Calendar Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Calendar - MAPS v2.2 Date Selection System
            </h2>
            <p className='text-muted-foreground'>
              Comprehensive calendar component with Apple HIG philosophy,
              dark-first design, and multiple selection modes for optimal user
              experience.
            </p>

            {/* Calendar Variants */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Basic Calendar */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Basic Calendar
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedCalendar
                    selected={selectedDate}
                    onSelect={date => {
                      if (date instanceof Date) {
                        setSelectedDate(date);
                        showToast(
                          'success',
                          'Date Selected',
                          formatCalendarDate(date, 'long')
                        );
                      }
                    }}
                    mode='single'
                  />
                  {selectedDate && (
                    <div className='mt-4 rounded-md bg-muted p-3 text-sm'>
                      <p className='font-medium text-foreground'>
                        Selected Date:
                      </p>
                      <p className='text-muted-foreground'>
                        {formatCalendarDate(selectedDate, 'long')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Glass Variant */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Glass Variant
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedCalendar
                    {...CalendarFactory.glass()}
                    selected={selectedDate}
                    onSelect={date => {
                      if (date instanceof Date) {
                        setSelectedDate(date);
                        showToast(
                          'info',
                          'Glass Calendar',
                          `Selected ${formatCalendarDate(date, 'short')}`
                        );
                      }
                    }}
                  />
                </div>
              </div>

              {/* Multi-Select Calendar */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Multi-Select Mode
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedCalendar
                    {...CalendarFactory.multiSelect()}
                    selected={multiSelectedDates}
                    onSelect={dates => {
                      if (Array.isArray(dates)) {
                        setMultiSelectedDates(dates);
                        showToast(
                          'success',
                          'Multiple Dates',
                          `Selected ${dates.length} dates`
                        );
                      } else {
                        setMultiSelectedDates([]);
                      }
                    }}
                  />
                  {multiSelectedDates.length > 0 && (
                    <div className='mt-4 rounded-md bg-muted p-3 text-sm'>
                      <p className='font-medium text-foreground'>
                        Selected Dates ({multiSelectedDates.length}):
                      </p>
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {multiSelectedDates.map((date, index) => (
                          <span
                            key={index}
                            className='rounded bg-accent px-2 py-1 text-xs text-accent-foreground'
                          >
                            {formatCalendarDate(date, 'short')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Accessible Calendar */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  AAA Accessible
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedCalendar
                    {...CalendarFactory.accessible()}
                    selected={selectedDate}
                    onSelect={date => {
                      if (date instanceof Date) {
                        setSelectedDate(date);
                        showToast(
                          'success',
                          'Accessible Calendar',
                          'Date selection announced'
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Disabled Dates Demo */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Date Restrictions
              </h3>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* No Weekends */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>No Weekends</h4>
                  <p className='text-sm text-muted-foreground'>
                    Weekends are disabled for business date selection
                  </p>
                  <EnhancedCalendar
                    selected={selectedDate}
                    onSelect={date => {
                      if (date instanceof Date) {
                        setSelectedDate(date);
                        showToast(
                          'info',
                          'Business Date',
                          'Business day selected'
                        );
                      }
                    }}
                    disabled={createDateDisabled({ weekends: true })}
                  />
                </div>

                {/* Future Dates Only */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Future Dates Only
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Past dates are disabled for scheduling
                  </p>
                  <EnhancedCalendar
                    selected={selectedDate}
                    onSelect={date => {
                      if (date instanceof Date) {
                        setSelectedDate(date);
                        showToast(
                          'success',
                          'Future Date',
                          'Future date selected'
                        );
                      }
                    }}
                    disabled={createDateDisabled({
                      before: new Date(),
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Calendar Features */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Calendar Features
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='font-medium text-foreground'>
                    Design Features
                  </h4>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li>• Dark-first design philosophy</li>
                    <li>• Apple HIG color harmonies</li>
                    <li>• Liquid glass material effects</li>
                    <li>• Systematic 8pt spacing grid</li>
                    <li>• Ethereal accent highlights</li>
                  </ul>
                </div>
                <div className='space-y-4'>
                  <h4 className='font-medium text-foreground'>
                    Interaction Features
                  </h4>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li>• Single and multiple selection modes</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Customizable date restrictions</li>
                    <li>• Month navigation controls</li>
                    <li>• Today highlight and selection</li>
                  </ul>
                </div>
                <div className='space-y-4'>
                  <h4 className='font-medium text-foreground'>
                    Accessibility Features
                  </h4>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li>• ARIA labels and roles</li>
                    <li>• Screen reader announcements</li>
                    <li>• Focus management and visible indicators</li>
                    <li>• AAA compliance mode</li>
                    <li>• High contrast support</li>
                  </ul>
                </div>
                <div className='space-y-4'>
                  <h4 className='font-medium text-foreground'>
                    Technical Features
                  </h4>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li>• CVA variant system</li>
                    <li>• Polymorphic component support</li>
                    <li>• Factory pattern configurations</li>
                    <li>• Date utility functions</li>
                    <li>• Anti-drift enforcement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Calendar Demo */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Features Demo
              </h3>
              <div className='space-y-6 rounded-lg border border-border bg-card p-6'>
                <p className='text-sm text-muted-foreground'>
                  Try different calendar configurations and interactions
                </p>

                {/* Compact Calendar */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-3'>
                    <h4 className='font-medium text-foreground'>
                      Compact Size
                    </h4>
                    <EnhancedCalendar
                      {...CalendarFactory.compact()}
                      selected={selectedDate}
                      onSelect={date => {
                        if (date instanceof Date) {
                          setSelectedDate(date);
                          showToast(
                            'info',
                            'Compact Calendar',
                            formatCalendarDate(date)
                          );
                        }
                      }}
                    />
                  </div>

                  <div className='space-y-3'>
                    <h4 className='font-medium text-foreground'>
                      Floating Glass
                    </h4>
                    <EnhancedCalendar
                      variant='floating'
                      surface='glass'
                      selected={selectedDate}
                      onSelect={date => {
                        if (date instanceof Date) {
                          setSelectedDate(date);
                          showToast(
                            'success',
                            'Floating Calendar',
                            'Ethereal selection'
                          );
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Calendar with custom styling */}
                <div className='space-y-3'>
                  <h4 className='font-medium text-foreground'>
                    Standard with Elevated Surface
                  </h4>
                  <div className='max-w-sm'>
                    <EnhancedCalendar
                      variant='elevated'
                      surface='elevated'
                      size='lg'
                      selected={selectedDate}
                      onSelect={date => {
                        if (date instanceof Date) {
                          setSelectedDate(date);
                          showToast(
                            'success',
                            'Elevated Calendar',
                            'Professional selection'
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced DatePicker Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced DatePicker - Temporal Selection Interface
            </h2>
            <p className='text-muted-foreground'>
              Enterprise-grade date selection components with Apple HIG harmony,
              liquid glass materials, range selection capabilities, and
              comprehensive accessibility patterns following MAPS v2.2
              architecture.
            </p>

            {/* Single Date Picker Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Single Date Selection
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Default DatePicker */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Default Surface
                  </span>
                  <EnhancedDatePicker
                    placeholder='Select appointment date'
                    {...(singleDate && { value: singleDate })}
                    onChange={date => {
                      setSingleDate(date);
                      console.log('Selected date:', date);
                    }}
                  />
                </div>

                {/* Glass Surface DatePicker */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Glass Material
                  </span>
                  <EnhancedDatePicker
                    surface='glass'
                    placeholder='Select meeting date'
                    onChange={date => console.log('Glass date:', date)}
                  />
                </div>

                {/* Elevated Surface DatePicker */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Elevated Surface
                  </span>
                  <EnhancedDatePicker
                    surface='elevated'
                    placeholder='Select deadline'
                    onChange={date => console.log('Elevated date:', date)}
                  />
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Small (sm)
                  </span>
                  <EnhancedDatePicker
                    size='sm'
                    placeholder='Compact selection'
                    onChange={date => console.log('Small date:', date)}
                  />
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Medium (md)
                  </span>
                  <EnhancedDatePicker
                    size='md'
                    placeholder='Standard selection'
                    onChange={date => console.log('Medium date:', date)}
                  />
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Large (lg)
                  </span>
                  <EnhancedDatePicker
                    size='lg'
                    placeholder='Prominent selection'
                    onChange={date => console.log('Large date:', date)}
                  />
                </div>
              </div>
            </div>

            {/* Validation States */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Validation States
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-destructive'>
                    Error State
                  </span>
                  <EnhancedDatePicker
                    validation='error'
                    placeholder='Invalid date selection'
                    onChange={date => console.log('Error date:', date)}
                  />
                  <p className='text-xs text-destructive'>
                    Please select a valid date
                  </p>
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-warning'>
                    Warning State
                  </span>
                  <EnhancedDatePicker
                    validation='warning'
                    placeholder='Check your selection'
                    onChange={date => console.log('Warning date:', date)}
                  />
                  <p className='text-xs text-warning'>Date is in the past</p>
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-success'>
                    Success State
                  </span>
                  <EnhancedDatePicker
                    validation='success'
                    placeholder='Valid selection'
                    onChange={date => console.log('Success date:', date)}
                  />
                  <p className='text-xs text-success'>Perfect date selection</p>
                </div>
              </div>
            </div>

            {/* Date Range Picker */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Date Range Selection
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* Default Range Picker */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Travel Dates
                  </span>
                  <EnhancedDatePickerRange
                    placeholder='Select travel period'
                    {...(dateRange && { value: dateRange })}
                    onChange={range => {
                      setDateRange(range);
                      console.log('Travel range:', range);
                    }}
                  />
                </div>

                {/* Glass Range Picker */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Project Duration
                  </span>
                  <EnhancedDatePickerRange
                    surface='glass'
                    placeholder='Select project timeline'
                    onChange={range => console.log('Project range:', range)}
                  />
                </div>
              </div>
            </div>

            {/* Factory Functions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Factory Presets
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Compact Preset
                  </span>
                  <DatePickerFactory.compact placeholder='Quick selection' />
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Large Preset
                  </span>
                  <DatePickerFactory.large placeholder='Premium selection' />
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Range Preset
                  </span>
                  <DatePickerFactory.range placeholder='Period selection' />
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Advanced Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* Disabled Dates */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Weekend Restrictions
                  </span>
                  <EnhancedDatePicker
                    placeholder='Business days only'
                    isDateDisabled={date => {
                      const day = date.getDay();
                      return day === 0 || day === 6; // Disable weekends
                    }}
                    onChange={date => console.log('Business date:', date)}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Weekends are disabled
                  </p>
                </div>

                {/* Date Range Limits */}
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Future Dates Only
                  </span>
                  <EnhancedDatePicker
                    placeholder='Select future date'
                    minDate={new Date()}
                    onChange={date => console.log('Future date:', date)}
                  />
                  <p className='text-xs text-muted-foreground'>
                    Past dates are disabled
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Formats */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Custom Date Formats
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    ISO Format
                  </span>
                  <EnhancedDatePicker
                    placeholder='YYYY-MM-DD'
                    dateFormat='yyyy-MM-dd'
                    onChange={date => console.log('ISO date:', date)}
                  />
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Long Format
                  </span>
                  <EnhancedDatePicker
                    placeholder='Full date display'
                    dateFormat='EEEE, MMMM do, yyyy'
                    onChange={date => console.log('Long date:', date)}
                  />
                </div>

                <div className='space-y-2'>
                  <span className='text-sm font-medium text-foreground'>
                    Short Format
                  </span>
                  <EnhancedDatePicker
                    placeholder='MM/DD/YY'
                    dateFormat='MM/dd/yy'
                    onChange={date => console.log('Short date:', date)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Alert Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Alert - Dark-First Notification System
            </h2>
            <p className='text-muted-foreground'>
              Apple HIG-inspired notification system with sophisticated visual
              hierarchy, liquid glass materials, auto-close functionality, and
              comprehensive accessibility patterns following MAPS v2.2
              architecture.
            </p>

            {/* Basic Alert Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Semantic Variants
              </h3>
              <div className='space-y-4'>
                <EnhancedAlert
                  variant='default'
                  title='Default Alert'
                  description='This is a default alert with standard styling and neutral colors.'
                />
                <EnhancedAlert
                  variant='destructive'
                  title='Error Alert'
                  description='Something went wrong! Please check your input and try again.'
                />
                <EnhancedAlert
                  variant='warning'
                  title='Warning Alert'
                  description='This action cannot be undone. Please proceed with caution.'
                />
                <EnhancedAlert
                  variant='success'
                  title='Success Alert'
                  description='Your changes have been saved successfully.'
                />
                <EnhancedAlert
                  variant='info'
                  title='Information Alert'
                  description='Here is some important information you should know.'
                />
              </div>
            </div>

            {/* Glass Material Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Liquid Glass Materials
              </h3>
              <div className='space-y-4'>
                <EnhancedAlert
                  variant='glass'
                  title='Glass Alert'
                  description='Sophisticated liquid glass material with subtle transparency and backdrop blur.'
                />
                <EnhancedAlert
                  variant='glass-destructive'
                  title='Glass Error'
                  description='Error alert with glass material styling and enhanced visual depth.'
                />
                <EnhancedAlert
                  variant='glass-warning'
                  title='Glass Warning'
                  description='Warning with advanced glass material and liquid aesthetics.'
                />
                <EnhancedAlert
                  variant='glass-success'
                  title='Glass Success'
                  description='Success notification with premium glass material finish.'
                />
                <EnhancedAlert
                  variant='glass-info'
                  title='Glass Information'
                  description='Information alert featuring the sophisticated glass material system.'
                />
              </div>
            </div>

            {/* Size and Elevation System */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Size & Elevation System
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Size Variants
                  </h4>
                  <EnhancedAlert
                    size='sm'
                    variant='info'
                    title='Small Alert'
                    description='Compact alert for tight spaces.'
                  />
                  <EnhancedAlert
                    size='md'
                    variant='info'
                    title='Medium Alert'
                    description='Standard sized alert for most use cases.'
                  />
                  <EnhancedAlert
                    size='lg'
                    variant='info'
                    title='Large Alert'
                    description='Larger alert for important information.'
                  />
                  <EnhancedAlert
                    size='xl'
                    variant='info'
                    title='Extra Large Alert'
                    description='Maximum size alert for critical notifications.'
                  />
                </div>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Elevation Levels
                  </h4>
                  <EnhancedAlert
                    elevation='subtle'
                    variant='default'
                    title='Subtle Shadow'
                    description='Minimal elevation for subtle presence.'
                  />
                  <EnhancedAlert
                    elevation='medium'
                    variant='default'
                    title='Medium Shadow'
                    description='Standard elevation for clear definition.'
                  />
                  <EnhancedAlert
                    elevation='high'
                    variant='default'
                    title='High Shadow'
                    description='Strong elevation for prominent display.'
                  />
                  <EnhancedAlert
                    elevation='dramatic'
                    variant='default'
                    title='Dramatic Shadow'
                    description='Maximum elevation for critical attention.'
                  />
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Features
              </h3>
              <div className='space-y-4'>
                <EnhancedAlert
                  variant='default'
                  title='Dismissible Alert'
                  description='This alert can be manually dismissed by clicking the close button.'
                  dismissible
                  onDismiss={() =>
                    showToast(
                      'success',
                      'Alert Dismissed',
                      'The alert was successfully dismissed'
                    )
                  }
                />
                <EnhancedAlert
                  variant='info'
                  title='Auto-close Alert'
                  description='This alert will automatically close after 5 seconds.'
                  autoClose={5000}
                  showProgress
                  onDismiss={() =>
                    showToast(
                      'info',
                      'Alert Auto-closed',
                      'The alert closed automatically'
                    )
                  }
                />
                <EnhancedAlert
                  variant='warning'
                  title='Dismissible with Auto-close'
                  description='This alert has both manual dismiss and auto-close features.'
                  dismissible
                  autoClose={8000}
                  showProgress
                  onDismiss={() =>
                    showToast(
                      'info',
                      'Alert Closed',
                      'Alert was closed either manually or automatically'
                    )
                  }
                />
              </div>
            </div>

            {/* Custom Icons and Actions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Custom Icons & Actions
              </h3>
              <div className='space-y-4'>
                <EnhancedAlert
                  variant='info'
                  title='Custom Icon Alert'
                  description='This alert uses a custom icon instead of the default variant icon.'
                  icon={<Settings className='size-4' />}
                />
                <EnhancedAlert
                  variant='warning'
                  title='Alert with Actions'
                  description='This alert includes action buttons for user interaction.'
                  actions={
                    <div className='flex gap-2'>
                      <EnhancedButton
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          showToast(
                            'info',
                            'Action Clicked',
                            'Secondary action was clicked'
                          )
                        }
                      >
                        Cancel
                      </EnhancedButton>
                      <EnhancedButton
                        size='sm'
                        onClick={() =>
                          showToast(
                            'success',
                            'Action Confirmed',
                            'Primary action was confirmed'
                          )
                        }
                      >
                        Confirm
                      </EnhancedButton>
                    </div>
                  }
                />
                <EnhancedAlert
                  variant='success'
                  title='Custom Close Icon'
                  description='This alert features a custom close icon.'
                  dismissible
                  closeIcon={<X className='size-4' />}
                  onDismiss={() =>
                    showToast(
                      'success',
                      'Custom Close',
                      'Alert closed with custom icon'
                    )
                  }
                />
              </div>
            </div>

            {/* Factory Functions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Factory Functions
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Semantic Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Semantic Patterns
                  </h4>
                  <div className='space-y-2'>
                    <AlertFactory.default.Alert
                      title='Default Factory'
                      description='Factory-created default alert.'
                    />
                    <AlertFactory.success.Alert
                      title='Success Factory'
                      description='Factory-created success alert.'
                    />
                    <AlertFactory.warning.Alert
                      title='Warning Factory'
                      description='Factory-created warning alert.'
                    />
                  </div>
                </div>

                {/* Glass Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Glass Materials
                  </h4>
                  <div className='space-y-2'>
                    <AlertFactory.glass.Alert
                      title='Glass Factory'
                      description='Factory-created glass alert.'
                    />
                    {React.createElement(AlertFactory['glass-success'].Alert, {
                      title: 'Glass Success',
                      description: 'Factory-created glass success alert.',
                    })}
                    {React.createElement(
                      AlertFactory['glass-destructive'].Alert,
                      {
                        title: 'Glass Error',
                        description: 'Factory-created glass error alert.',
                      }
                    )}
                  </div>
                </div>

                {/* Feature Factories */}
                <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Feature Patterns
                  </h4>
                  <div className='space-y-2'>
                    <AlertFactory.dismissible.Alert
                      title='Dismissible Factory'
                      description='Factory-created dismissible alert.'
                      onDismiss={() =>
                        showToast('success', 'Factory Alert Dismissed')
                      }
                    />
                    <AlertFactory.aaa.Alert
                      title='AAA Factory'
                      description='Factory-created AAA compliant alert.'
                      variant='glass'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Utility Functions */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Utility Functions
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Basic Utilities
                  </h4>
                  <div className='space-y-2'>
                    {createSuccessAlert(
                      'Utility Success',
                      'Created with createSuccessAlert utility'
                    )}
                    {createErrorAlert(
                      'Utility Error',
                      'Created with createErrorAlert utility'
                    )}
                    {createWarningAlert(
                      'Utility Warning',
                      'Created with createWarningAlert utility'
                    )}
                    {createInfoAlert(
                      'Utility Info',
                      'Created with createInfoAlert utility'
                    )}
                  </div>
                </div>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Notification Utility
                  </h4>
                  <div className='space-y-2'>
                    {createNotificationAlert(
                      'Notification 1',
                      'Auto-closing notification with progress',
                      6000
                    )}
                    {createNotificationAlert(
                      'Notification 2',
                      'Another notification example',
                      4000,
                      { variant: 'success' }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-world Examples */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Real-world Examples
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Form Validation */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Form Validation
                  </h4>
                  <div className='space-y-3'>
                    <EnhancedAlert
                      variant='destructive'
                      title='Validation Error'
                      description='Please correct the following errors before submitting:'
                      actions={
                        <EnhancedButton size='sm' variant='outline'>
                          Review Form
                        </EnhancedButton>
                      }
                    />
                    <EnhancedAlert
                      variant='success'
                      title='Form Submitted'
                      description='Your form has been successfully submitted.'
                      dismissible
                      autoClose={5000}
                      showProgress
                    />
                  </div>
                </div>

                {/* System Status */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>System Status</h4>
                  <div className='space-y-3'>
                    <EnhancedAlert
                      variant='warning'
                      title='Maintenance Scheduled'
                      description='System maintenance is scheduled for tonight at 2:00 AM.'
                      icon={<AlertTriangle className='size-4' />}
                      actions={
                        <EnhancedButton size='sm' variant='outline'>
                          Learn More
                        </EnhancedButton>
                      }
                    />
                    <EnhancedAlert
                      variant='info'
                      title='New Feature Available'
                      description='Check out our latest feature update!'
                      icon={<Info className='size-4' />}
                      dismissible
                    />
                  </div>
                </div>

                {/* E-commerce Example */}
                <div className='space-y-4 rounded-lg border border-border bg-card p-6 md:col-span-2'>
                  <h4 className='font-medium text-foreground'>
                    E-commerce Notifications
                  </h4>
                  <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                    <EnhancedAlert
                      variant='success'
                      title='Item Added to Cart'
                      description='Product successfully added to your shopping cart.'
                      size='sm'
                      dismissible
                      autoClose={3000}
                      showProgress
                    />
                    <EnhancedAlert
                      variant='warning'
                      title='Limited Stock'
                      description='Only 3 items left in stock!'
                      size='sm'
                      actions={
                        <EnhancedButton size='sm'>Buy Now</EnhancedButton>
                      }
                    />
                    <EnhancedAlert
                      variant='info'
                      title='Free Shipping'
                      description='Add $25 more to qualify for free shipping.'
                      size='sm'
                      dismissible
                    />
                    <EnhancedAlert
                      variant='success'
                      title='Order Confirmed'
                      description='Your order #12345 has been confirmed.'
                      size='sm'
                      actions={
                        <EnhancedButton size='sm' variant='outline'>
                          Track Order
                        </EnhancedButton>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>ARIA Support</h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>
                      • role=&quot;alert&quot; for immediate announcements
                    </li>
                    <li>
                      • aria-live=&quot;polite&quot; for non-disruptive updates
                    </li>
                    <li>
                      • aria-atomic=&quot;true&quot; for complete content
                      reading
                    </li>
                    <li>• Proper progress bar ARIA attributes</li>
                  </ul>
                </div>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Keyboard Navigation
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Dismiss buttons are keyboard accessible</li>
                    <li>• Tab navigation to interactive elements</li>
                    <li>• Enter/Space to activate actions</li>
                    <li>• Proper focus management and indicators</li>
                  </ul>
                </div>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    AAA Compliance
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Enhanced contrast ratios for glass variants</li>
                    <li>• Automatic AAA mode for glass materials</li>
                    <li>• enforceAAA prop for critical alerts</li>
                    <li>• Accessible color combinations</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced EmptyState Showcase - Steve Jobs Philosophy */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced EmptyState - Steve Jobs Philosophy
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Humanized empty states that transform void into opportunity •
                &ldquo;Empty states are invitations to greatness&rdquo; • 18
                pre-crafted message templates • Emotional design with
                encouraging guidance
              </p>
            </div>

            {/* Humanized Message Templates */}
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-foreground'>
                Humanized Message Templates
              </h3>
              <p className='text-muted-foreground'>
                Following Steve Jobs&apos; philosophy of making technology serve
                humanity, each template speaks to emotions and guides users
                toward meaningful action.
              </p>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
                {/* Search Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Search Results
                  </h4>
                  <div className='flex min-h-[320px] items-center justify-center'>
                    {EmptyStateFactory.searchResults('React components', () =>
                      console.log('Search retry')
                    )}
                  </div>
                </div>

                {/* Welcome Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    New User Welcome
                  </h4>
                  <div className='flex min-h-[320px] items-center justify-center'>
                    {EmptyStateFactory.welcome(() =>
                      console.log('Get started')
                    )}
                  </div>
                </div>

                {/* Projects Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Project Creation
                  </h4>
                  <div className='flex min-h-[320px] items-center justify-center'>
                    {EmptyStateFactory.projects(() =>
                      console.log('Create project')
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Variant System */}
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-foreground'>
                Visual Variants & Emotional Tones
              </h3>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Inspiring Variant */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Inspiring Variant with Floating Vibrancy
                  </h4>
                  <div className='flex min-h-[320px] items-center justify-center'>
                    <EnhancedEmptyState
                      messageType='creative'
                      variant='inspiring'
                      vibrancy='floating'
                      primaryAction={{
                        label: 'Start Creating',
                        onClick: () => console.log('Create'),
                        icon: <Plus className='size-4' />,
                      }}
                    />
                  </div>
                </div>

                {
                  /* Magical Variant */
                  <div className='rounded-lg border border-border bg-card p-6'>
                    <h4 className='mb-4 text-sm font-medium text-foreground'>
                      Magical Variant with Wonder
                    </h4>
                    <div className='flex min-h-[320px] items-center justify-center'>
                      <EnhancedEmptyState
                        messageType='magical'
                        variant='magical'
                        vibrancy='floating'
                        primaryAction={{
                          label: 'Discover Magic',
                          onClick: () => console.log('Discover'),
                        }}
                      />
                    </div>
                  </div>
                }
                {/* Peaceful Variant */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Peaceful Variant with Glass Materials
                  </h4>
                  <div className='flex min-h-[320px] items-center justify-center'>
                    <EnhancedEmptyState
                      messageType='peaceful'
                      variant='peaceful'
                      vibrancy='glass'
                    />
                  </div>
                </div>

                {/* Community Variant */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Community & Belonging
                  </h4>
                  <div className='flex min-h-[320px] items-center justify-center'>
                    {EmptyStateFactory.community(() =>
                      console.log('Join community')
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Factory Functions */}
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-foreground'>
                Pre-built Factory Functions
              </h3>
              <p className='text-muted-foreground'>
                Ready-to-use empty state patterns for common scenarios,
                following Steve Jobs&apos; principle of making complex things
                simple.
              </p>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Team Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Team
                  </h4>
                  <div className='flex min-h-[300px] items-center justify-center'>
                    {EmptyStateFactory.team(() => console.log('Invite team'))}
                  </div>
                </div>

                {/* Learning Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Learning
                  </h4>
                  <div className='flex min-h-[300px] items-center justify-center'>
                    {EmptyStateFactory.learning(() =>
                      console.log('Start learning')
                    )}
                  </div>
                </div>

                {/* Achievements Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Achievements
                  </h4>
                  <div className='flex min-h-[300px] items-center justify-center'>
                    {EmptyStateFactory.achievements(() =>
                      console.log('Start exploring')
                    )}
                  </div>
                </div>

                {/* Content Empty State */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Content
                  </h4>
                  <div className='flex min-h-[300px] items-center justify-center'>
                    {EmptyStateFactory.content(() =>
                      console.log('Create content')
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-foreground'>
                Size Variants & Responsive Design
              </h3>

              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Small Size */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Small Size (sm)
                  </h4>
                  <div className='flex min-h-[280px] items-center justify-center'>
                    <EnhancedEmptyState
                      messageType='ideas'
                      size='sm'
                      primaryAction={{
                        label: 'Add Idea',
                        onClick: () => console.log('Add idea'),
                        icon: <Plus className='size-3' />,
                      }}
                    />
                  </div>
                </div>

                {/* Large Size */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Large Size (lg)
                  </h4>
                  <div className='flex min-h-[400px] items-center justify-center'>
                    <EnhancedEmptyState
                      messageType='projects'
                      size='lg'
                      variant='inspiring'
                      primaryAction={{
                        label: 'Create Project',
                        onClick: () => console.log('Create project'),
                        icon: <Plus className='size-4' />,
                      }}
                      secondaryAction={{
                        label: 'Learn More',
                        onClick: () => console.log('Learn more'),
                        variant: 'outline',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility & Steve Jobs Philosophy */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-foreground'>
                Accessibility & Human-Centered Design
              </h3>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Steve Jobs Philosophy
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>
                      • &ldquo;Empty states are opportunities to inspire&rdquo;
                    </li>
                    <li>• Humanized messaging that speaks to emotions</li>
                    <li>• Clear guidance without overwhelming</li>
                    <li>• Beautiful simplicity that feels purposeful</li>
                  </ul>
                </div>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    Accessibility Features
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Proper semantic structure with headings</li>
                    <li>• AccessibleIcon wrapper for screen readers</li>
                    <li>• Keyboard navigation support</li>
                    <li>• AAA compliance mode available</li>
                  </ul>
                </div>
                <div className='space-y-3 rounded-lg border border-border bg-card p-6'>
                  <h4 className='font-medium text-foreground'>
                    MAPS v2.2 Integration
                  </h4>
                  <ul className='space-y-1 text-sm text-muted-foreground'>
                    <li>• Token-based styling (anti-drift)</li>
                    <li>• Liquid glass materials system</li>
                    <li>• Dark-first design philosophy</li>
                    <li>• Apple HIG harmony throughout</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Message Template Overview */}
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-foreground'>
                Complete Message Template System
              </h3>
              <p className='text-muted-foreground'>
                18 carefully crafted message templates, each designed to
                transform empty moments into opportunities for engagement and
                growth.
              </p>
              <div className='grid grid-cols-2 gap-4 text-sm lg:grid-cols-3 xl:grid-cols-6'>
                {Object.entries(HUMANIZED_MESSAGES).map(([key, message]) => (
                  <div
                    key={key}
                    className='space-y-2 rounded-lg border border-border bg-card p-3'
                  >
                    <div className='font-medium capitalize text-foreground'>
                      {key}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {message.emotion}
                    </div>
                    <div
                      className='truncate text-xs text-muted-foreground'
                      title={message.title}
                    >
                      {message.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Separator Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Separator - Dark-First Content Division
            </h2>
            <p className='text-muted-foreground'>
              Sophisticated content separators with Apple HIG spacing, liquid
              glass materials, and comprehensive accessibility patterns
              following MAPS v2.2 architecture.
            </p>

            {/* Basic Separator Variants */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-foreground'>
                  Basic Variants
                </h3>

                {/* Default Separator */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Default Separator
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Content above separator
                    </p>
                    <EnhancedSeparator />
                    <p className='text-sm text-muted-foreground'>
                      Content below separator
                    </p>
                  </div>
                </div>

                {/* Strong Separator */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Strong Separator
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Major section content
                    </p>
                    <StrongSeparator />
                    <p className='text-sm text-muted-foreground'>
                      Next major section
                    </p>
                  </div>
                </div>

                {/* Accent Separator */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Accent Separator
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Brand-emphasized content
                    </p>
                    <AccentSeparator />
                    <p className='text-sm text-muted-foreground'>
                      Following section
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-foreground'>
                  Advanced Variants
                </h3>

                {/* Glass Separator */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Glass Separator
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Liquid glass vibrancy effects
                    </p>
                    <GlassSeparator />
                    <p className='text-sm text-muted-foreground'>
                      Beautiful backdrop blur separation
                    </p>
                  </div>
                </div>

                {/* Ethereal Separator */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Ethereal Separator
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Sophisticated gradient effects
                    </p>
                    <EtherealSeparator />
                    <p className='text-sm text-muted-foreground'>
                      MAPS v2.2 ethereal aesthetics
                    </p>
                  </div>
                </div>

                {/* Dotted & Dashed */}
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-sm font-medium text-foreground'>
                    Dotted & Dashed
                  </h4>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <p className='text-sm text-muted-foreground'>
                        Dotted pattern for flexible sections
                      </p>
                      <EnhancedSeparator variant='dotted' />
                      <p className='text-sm text-muted-foreground'>
                        Next section
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <p className='text-sm text-muted-foreground'>
                        Dashed pattern for temporary content
                      </p>
                      <EnhancedSeparator variant='dashed' />
                      <p className='text-sm text-muted-foreground'>
                        Draft or temporary section
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size and Spacing Variants */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Size & Spacing Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Size Variants */}
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Size Options
                  </h4>
                  <div className='space-y-3'>
                    <div>
                      <p className='mb-2 text-xs text-muted-foreground'>Thin</p>
                      <EnhancedSeparator size='thin' spacing='none' />
                    </div>
                    <div>
                      <p className='mb-2 text-xs text-muted-foreground'>
                        Default
                      </p>
                      <EnhancedSeparator size='default' spacing='none' />
                    </div>
                    <div>
                      <p className='mb-2 text-xs text-muted-foreground'>
                        Thick
                      </p>
                      <EnhancedSeparator size='thick' spacing='none' />
                    </div>
                  </div>
                </div>

                {/* Spacing Variants */}
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Spacing Options
                  </h4>
                  <div className='space-y-1'>
                    <p className='text-xs text-muted-foreground'>
                      Small spacing
                    </p>
                    <EnhancedSeparator spacing='sm' />
                    <p className='text-xs text-muted-foreground'>
                      Default spacing
                    </p>
                    <EnhancedSeparator spacing='default' />
                    <p className='text-xs text-muted-foreground'>
                      Large spacing
                    </p>
                    <EnhancedSeparator spacing='lg' />
                    <p className='text-xs text-muted-foreground'>
                      Extra large spacing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orientation Variants */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Orientation Support
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Horizontal */}
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Horizontal (Default)
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Content above
                    </p>
                    <EnhancedSeparator orientation='horizontal' />
                    <p className='text-sm text-muted-foreground'>
                      Content below
                    </p>
                  </div>
                </div>

                {/* Vertical */}
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Vertical Orientation
                  </h4>
                  <div className='flex h-24 items-center gap-4'>
                    <p className='text-sm text-muted-foreground'>
                      Left content
                    </p>
                    <EnhancedSeparator orientation='vertical' spacing='none' />
                    <p className='text-sm text-muted-foreground'>
                      Right content
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator with Content */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Separator with Content
              </h3>
              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Create sophisticated section dividers with embedded content
                  using SeparatorWithContent component.
                </p>
                <div className='space-y-6'>
                  <div>
                    <p className='mb-3 text-sm text-muted-foreground'>
                      Login form content above
                    </p>
                    <SeparatorWithContent>
                      <span className='text-xs text-muted-foreground'>OR</span>
                    </SeparatorWithContent>
                    <p className='mt-3 text-sm text-muted-foreground'>
                      Social login options below
                    </p>
                  </div>

                  <div>
                    <p className='mb-3 text-sm text-muted-foreground'>
                      Previous chapter content
                    </p>
                    <SeparatorWithContent variant='accent' spacing='lg'>
                      <span className='text-sm font-medium'>
                        Chapter 2: Getting Started
                      </span>
                    </SeparatorWithContent>
                    <p className='mt-3 text-sm text-muted-foreground'>
                      Chapter 2 content begins here
                    </p>
                  </div>

                  <div>
                    <p className='mb-3 text-sm text-muted-foreground'>
                      Previous section
                    </p>
                    <SeparatorWithContent variant='ethereal'>
                      <span className='text-xs font-medium text-accent'>
                        ✨ Featured Content
                      </span>
                    </SeparatorWithContent>
                    <p className='mt-3 text-sm text-muted-foreground'>
                      Special highlighted section
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decoration Effects */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Decoration Effects
              </h3>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='space-y-3'>
                    <h4 className='text-sm font-medium text-foreground'>
                      Glow Effect
                    </h4>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        Premium feel
                      </p>
                      <EnhancedSeparator decoration='glow' spacing='none' />
                      <p className='text-xs text-muted-foreground'>
                        Subtle luminescence
                      </p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h4 className='text-sm font-medium text-foreground'>
                      Gradient Effect
                    </h4>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        Smooth edges
                      </p>
                      <EnhancedSeparator decoration='gradient' spacing='none' />
                      <p className='text-xs text-muted-foreground'>
                        Elegant transition
                      </p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h4 className='text-sm font-medium text-foreground'>
                      Fade Effect
                    </h4>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        Organic feel
                      </p>
                      <EnhancedSeparator decoration='fade' spacing='none' />
                      <p className='text-xs text-muted-foreground'>
                        Natural boundaries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AAA Compliance Mode */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                AAA Compliance Mode
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Standard Mode
                  </h4>
                  <div className='space-y-3'>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        Glass separator
                      </p>
                      <EnhancedSeparator variant='glass' spacing='none' />
                    </div>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        Ethereal separator
                      </p>
                      <EnhancedSeparator variant='ethereal' spacing='none' />
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    AAA Enforced Mode
                  </h4>
                  <div className='space-y-3'>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        AAA glass override
                      </p>
                      <EnhancedSeparator
                        variant='glass'
                        aaa={true}
                        spacing='none'
                      />
                    </div>
                    <div className='space-y-2'>
                      <p className='text-xs text-muted-foreground'>
                        AAA ethereal override
                      </p>
                      <EnhancedSeparator
                        variant='ethereal'
                        aaa={true}
                        spacing='none'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4 rounded-lg border border-border/50 bg-muted/30 p-4'>
                <p className='text-sm text-muted-foreground'>
                  <strong>AAA Mode:</strong> Automatically replaces decorative
                  effects with high-contrast alternatives ensuring 7:1 color
                  contrast ratios for maximum accessibility compliance.
                </p>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Decorative Separators (Default)
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Hidden from screen readers with{' '}
                      <code className='rounded bg-muted px-1 text-xs'>
                        aria-hidden=&quot;true&quot;
                      </code>
                    </p>
                    <EnhancedSeparator />
                    <div className='rounded border border-border/50 bg-muted/30 p-3'>
                      <p className='text-xs text-muted-foreground'>
                        <code>decorative={true}</code> •{' '}
                        <code>aria-hidden=&quot;true&quot;</code>
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Semantic Separators
                  </h4>
                  <div className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                      Meaningful for navigation with proper ARIA attributes
                    </p>
                    <EnhancedSeparator
                      decorative={false}
                      aria-label='Section boundary'
                    />
                    <div className='rounded border border-border/50 bg-muted/30 p-3'>
                      <p className='text-xs text-muted-foreground'>
                        <code>decorative={false}</code> •{' '}
                        <code>role=&quot;separator&quot;</code> •{' '}
                        <code>aria-label</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Separator Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-semibold text-foreground'>
                ✨ Enhanced Separator Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 dark-first foundation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG spacing & hierarchy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass vibrancy effects
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Comprehensive decoration system
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Radix primitive foundation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory pattern support
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      WCAG AAA compliance mode
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Semantic vs decorative modes
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Horizontal & vertical orientation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Content embedding support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion preference respect
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Anti-drift token enforcement
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Sheet Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Sheet - Dark-First Overlay Panels
            </h2>
            <p className='text-muted-foreground'>
              Professional side panels and overlays with Apple HIG harmony,
              liquid glass materials, and comprehensive accessibility support.
            </p>

            {/* Basic Sheet Variants */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Side Panels
                </h3>
                <div className='space-y-3'>
                  <EnhancedSheet>
                    <EnhancedSheetTrigger asChild>
                      <EnhancedButton variant='outline' className='w-full'>
                        Right Panel
                      </EnhancedButton>
                    </EnhancedSheetTrigger>
                    <EnhancedSheetContent {...SheetFactory.sidePanel()}>
                      <EnhancedSheetHeader>
                        <EnhancedSheetTitle>Settings Panel</EnhancedSheetTitle>
                        <EnhancedSheetDescription>
                          Configure your preferences and account settings.
                        </EnhancedSheetDescription>
                      </EnhancedSheetHeader>
                      <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                          <EnhancedLabel
                            htmlFor='theme-select'
                            className='text-sm font-medium text-foreground'
                          >
                            Theme
                          </EnhancedLabel>
                          <Select>
                            <SelectTrigger id='theme-select'>
                              <SelectValue placeholder='Select theme' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='dark'>Dark</SelectItem>
                              <SelectItem value='light'>Light</SelectItem>
                              <SelectItem value='system'>System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-2'>
                          <EnhancedLabel
                            htmlFor='notifications-switch'
                            className='text-sm font-medium text-foreground'
                          >
                            Notifications
                          </EnhancedLabel>
                          <EnhancedSwitch id='notifications-switch' />
                        </div>
                      </div>
                      <EnhancedSheetFooter>
                        <EnhancedSheetClose asChild>
                          <EnhancedButton variant='outline'>
                            Cancel
                          </EnhancedButton>
                        </EnhancedSheetClose>
                        <EnhancedSheetClose asChild>
                          <EnhancedButton variant='primary'>
                            Save Changes
                          </EnhancedButton>
                        </EnhancedSheetClose>
                      </EnhancedSheetFooter>
                    </EnhancedSheetContent>
                  </EnhancedSheet>

                  <EnhancedSheet>
                    <EnhancedSheetTrigger asChild>
                      <EnhancedButton variant='secondary' className='w-full'>
                        Left Navigation
                      </EnhancedButton>
                    </EnhancedSheetTrigger>
                    <EnhancedSheetContent {...SheetFactory.navigationDrawer()}>
                      <EnhancedSheetHeader>
                        <EnhancedSheetTitle>Navigation</EnhancedSheetTitle>
                        <EnhancedSheetDescription>
                          Quick access to all sections
                        </EnhancedSheetDescription>
                      </EnhancedSheetHeader>
                      <div className='space-y-2 py-4'>
                        <button className='w-full rounded p-2 text-left text-sm hover:bg-muted'>
                          Dashboard
                        </button>
                        <button className='w-full rounded p-2 text-left text-sm hover:bg-muted'>
                          Projects
                        </button>
                        <button className='w-full rounded p-2 text-left text-sm hover:bg-muted'>
                          Settings
                        </button>
                        <button className='w-full rounded p-2 text-left text-sm hover:bg-muted'>
                          Help
                        </button>
                      </div>
                    </EnhancedSheetContent>
                  </EnhancedSheet>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Standard side panel configurations
                </p>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Mobile Drawers
                </h3>
                <div className='space-y-3'>
                  <EnhancedSheet>
                    <EnhancedSheetTrigger asChild>
                      <EnhancedButton variant='outline' className='w-full'>
                        Bottom Drawer
                      </EnhancedButton>
                    </EnhancedSheetTrigger>
                    <EnhancedSheetContent {...SheetFactory.mobileDrawer()}>
                      <EnhancedSheetHeader>
                        <EnhancedSheetTitle>Mobile Actions</EnhancedSheetTitle>
                        <EnhancedSheetDescription>
                          Quick actions for mobile interface
                        </EnhancedSheetDescription>
                      </EnhancedSheetHeader>
                      <div className='grid grid-cols-2 gap-3 py-4'>
                        <EnhancedButton
                          variant='outline'
                          className='h-20 flex-col'
                        >
                          <Settings className='mb-2 size-6' />
                          Settings
                        </EnhancedButton>
                        <EnhancedButton
                          variant='outline'
                          className='h-20 flex-col'
                        >
                          <User className='mb-2 size-6' />
                          Profile
                        </EnhancedButton>
                        <EnhancedButton
                          variant='outline'
                          className='h-20 flex-col'
                        >
                          <Mail className='mb-2 size-6' />
                          Messages
                        </EnhancedButton>
                        <EnhancedButton
                          variant='outline'
                          className='h-20 flex-col'
                        >
                          <Search className='mb-2 size-6' />
                          Search
                        </EnhancedButton>
                      </div>
                    </EnhancedSheetContent>
                  </EnhancedSheet>

                  <EnhancedSheet>
                    <EnhancedSheetTrigger asChild>
                      <EnhancedButton variant='secondary' className='w-full'>
                        Top Notification
                      </EnhancedButton>
                    </EnhancedSheetTrigger>
                    <EnhancedSheetContent side='top' size='sm'>
                      <EnhancedSheetHeader>
                        <EnhancedSheetTitle>New Updates</EnhancedSheetTitle>
                        <EnhancedSheetDescription>
                          You have 3 new notifications
                        </EnhancedSheetDescription>
                      </EnhancedSheetHeader>
                      <div className='space-y-3 py-4'>
                        <div className='flex items-center gap-3 rounded bg-muted/50 p-2'>
                          <div className='size-2 rounded-full bg-blue-500' />
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>System Update</p>
                            <p className='text-xs text-muted-foreground'>
                              New features available
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-3 rounded bg-muted/50 p-2'>
                          <div className='size-2 rounded-full bg-green-500' />
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>Task Complete</p>
                            <p className='text-xs text-muted-foreground'>
                              Project milestone reached
                            </p>
                          </div>
                        </div>
                      </div>
                    </EnhancedSheetContent>
                  </EnhancedSheet>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Mobile-optimized drawer layouts
                </p>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Surface Materials
                </h3>
                <div className='space-y-3'>
                  <EnhancedSheet>
                    <EnhancedSheetTrigger asChild>
                      <EnhancedButton variant='outline' className='w-full'>
                        Glass Surface
                      </EnhancedButton>
                    </EnhancedSheetTrigger>
                    <EnhancedSheetContent {...SheetFactory.glass()}>
                      <EnhancedSheetHeader>
                        <EnhancedSheetTitle>Glass Material</EnhancedSheetTitle>
                        <EnhancedSheetDescription>
                          Liquid glass with backdrop blur effects
                        </EnhancedSheetDescription>
                      </EnhancedSheetHeader>
                      <div className='space-y-4 py-4'>
                        <div className='rounded border border-border/50 bg-background/30 p-4'>
                          <h4 className='mb-2 font-medium'>Glass Effect</h4>
                          <p className='text-sm text-muted-foreground'>
                            This panel demonstrates the liquid glass material
                            system with proper backdrop blur and transparency
                            effects.
                          </p>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                          <div className='rounded bg-background/20 p-2 text-center text-xs'>
                            Blur: md
                          </div>
                          <div className='rounded bg-background/20 p-2 text-center text-xs'>
                            Opacity: 95%
                          </div>
                        </div>
                      </div>
                    </EnhancedSheetContent>
                  </EnhancedSheet>

                  <EnhancedSheet>
                    <EnhancedSheetTrigger asChild>
                      <EnhancedButton variant='secondary' className='w-full'>
                        Floating Panel
                      </EnhancedButton>
                    </EnhancedSheetTrigger>
                    <EnhancedSheetContent surface='floating' size='lg'>
                      <EnhancedSheetHeader>
                        <EnhancedSheetTitle>
                          Floating Surface
                        </EnhancedSheetTitle>
                        <EnhancedSheetDescription>
                          Elevated floating panel with enhanced shadows
                        </EnhancedSheetDescription>
                      </EnhancedSheetHeader>
                      <div className='space-y-4 py-4'>
                        <div className='rounded border border-border/30 bg-card p-4'>
                          <h4 className='mb-2 font-medium'>Elevation System</h4>
                          <p className='text-sm text-muted-foreground'>
                            Floating surfaces provide enhanced depth perception
                            with sophisticated shadow systems.
                          </p>
                        </div>
                      </div>
                    </EnhancedSheetContent>
                  </EnhancedSheet>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Advanced material surface options
                </p>
              </div>
            </div>

            {/* Enhanced Sheet Features */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Enhanced Sheet Features
              </h3>

              {/* Accessibility & Size Variants */}
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Size Variants & Accessibility
                  </h4>
                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <EnhancedSheet>
                      <EnhancedSheetTrigger asChild>
                        <EnhancedButton variant='outline' size='sm'>
                          Small Sheet
                        </EnhancedButton>
                      </EnhancedSheetTrigger>
                      <EnhancedSheetContent side='right' size='sm'>
                        <EnhancedSheetHeader>
                          <EnhancedSheetTitle>Small Panel</EnhancedSheetTitle>
                          <EnhancedSheetDescription>
                            Compact side panel for quick actions
                          </EnhancedSheetDescription>
                        </EnhancedSheetHeader>
                        <div className='py-4'>
                          <p className='text-sm text-muted-foreground'>
                            This is a small-sized sheet perfect for simple forms
                            or quick information display.
                          </p>
                        </div>
                      </EnhancedSheetContent>
                    </EnhancedSheet>

                    <EnhancedSheet>
                      <EnhancedSheetTrigger asChild>
                        <EnhancedButton variant='outline' size='sm'>
                          Large Sheet
                        </EnhancedButton>
                      </EnhancedSheetTrigger>
                      <EnhancedSheetContent side='right' size='xl'>
                        <EnhancedSheetHeader>
                          <EnhancedSheetTitle>Large Panel</EnhancedSheetTitle>
                          <EnhancedSheetDescription>
                            Spacious panel for complex content
                          </EnhancedSheetDescription>
                        </EnhancedSheetHeader>
                        <div className='space-y-4 py-4'>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <EnhancedLabel
                                htmlFor='name-input'
                                className='text-sm font-medium'
                              >
                                Name
                              </EnhancedLabel>
                              <EnhancedInput
                                id='name-input'
                                placeholder='Enter name'
                              />
                            </div>
                            <div className='space-y-2'>
                              <EnhancedLabel
                                htmlFor='email-input'
                                className='text-sm font-medium'
                              >
                                Email
                              </EnhancedLabel>
                              <EnhancedInput
                                id='email-input'
                                placeholder='Enter email'
                              />
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <EnhancedLabel
                              htmlFor='description-textarea'
                              className='text-sm font-medium'
                            >
                              Description
                            </EnhancedLabel>
                            <textarea
                              id='description-textarea'
                              className='w-full rounded border border-border bg-background p-3'
                              rows={4}
                              placeholder='Enter description...'
                            />
                          </div>
                        </div>
                        <EnhancedSheetFooter>
                          <EnhancedSheetClose asChild>
                            <EnhancedButton variant='outline'>
                              Cancel
                            </EnhancedButton>
                          </EnhancedSheetClose>
                          <EnhancedSheetClose asChild>
                            <EnhancedButton variant='primary'>
                              Save
                            </EnhancedButton>
                          </EnhancedSheetClose>
                        </EnhancedSheetFooter>
                      </EnhancedSheetContent>
                    </EnhancedSheet>

                    <EnhancedSheet>
                      <EnhancedSheetTrigger asChild>
                        <EnhancedButton variant='primary' size='sm'>
                          AAA Compliant
                        </EnhancedButton>
                      </EnhancedSheetTrigger>
                      <EnhancedSheetContent {...SheetFactory.accessible()}>
                        <EnhancedSheetHeader>
                          <EnhancedSheetTitle>
                            Accessible Sheet
                          </EnhancedSheetTitle>
                          <EnhancedSheetDescription>
                            Enhanced accessibility with AAA compliance
                          </EnhancedSheetDescription>
                        </EnhancedSheetHeader>
                        <div className='space-y-4 py-4'>
                          <div className='rounded border border-border bg-card p-4'>
                            <h4 className='mb-2 font-medium text-foreground'>
                              AAA Features
                            </h4>
                            <ul className='space-y-1 text-sm text-muted-foreground'>
                              <li>• Enhanced contrast ratios</li>
                              <li>• Improved focus indicators</li>
                              <li>• Screen reader optimized</li>
                              <li>• Keyboard navigation support</li>
                            </ul>
                          </div>
                        </div>
                      </EnhancedSheetContent>
                    </EnhancedSheet>

                    <EnhancedSheet>
                      <EnhancedSheetTrigger asChild>
                        <EnhancedButton variant='secondary' size='sm'>
                          Full Overlay
                        </EnhancedButton>
                      </EnhancedSheetTrigger>
                      <EnhancedSheetContent {...SheetFactory.fullOverlay()}>
                        <EnhancedSheetHeader>
                          <EnhancedSheetTitle>
                            Full Screen Overlay
                          </EnhancedSheetTitle>
                          <EnhancedSheetDescription>
                            Complete screen overlay for immersive experiences
                          </EnhancedSheetDescription>
                        </EnhancedSheetHeader>
                        <div className='flex-1 py-4'>
                          <div className='flex h-full min-h-[400px] items-center justify-center rounded border border-border/50 bg-muted/20'>
                            <div className='space-y-2 text-center'>
                              <div className='text-4xl'>🎨</div>
                              <p className='text-lg font-medium'>
                                Full Screen Content
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                Perfect for detailed views and immersive
                                experiences
                              </p>
                            </div>
                          </div>
                        </div>
                      </EnhancedSheetContent>
                    </EnhancedSheet>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Size variants from compact to full-screen with accessibility
                    options
                  </p>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Technical Features
                  </h4>
                  <div className='rounded-lg border border-border bg-card p-6'>
                    <ul className='space-y-3'>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Apple HIG motion system
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Focus trap management
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Polymorphic pattern support
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Liquid glass materials
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Factory pattern configurations
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Responsive design system
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Anti-drift enforcement
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          Motion preference respect
                        </span>
                      </li>
                      <li className='flex items-center gap-2'>
                        <Check className='size-4 shrink-0 text-success' />
                        <span className='text-foreground'>
                          CVA variant system
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Drawer Showcase - MAPS v2.2 Mobile-First */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Drawer - Mobile-Optimized Bottom Sheets
            </h2>
            <p className='text-muted-foreground'>
              Mobile-first drawer components with gesture support, Apple HIG
              interactions, and sophisticated material handling for bottom sheet
              patterns.
            </p>

            {/* Basic Drawer Examples */}
            <div className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Size & Surface Variants
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='outline' size='sm'>
                        Small Drawer
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent size='sm' surface='elevated'>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>
                          Small Quick Actions
                        </EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Compact drawer for quick interactions and simple
                          choices
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-3'>
                          <EnhancedButton
                            variant='ghost'
                            className='w-full justify-start'
                          >
                            <Settings className='mr-2 size-4' />
                            Settings
                          </EnhancedButton>
                          <EnhancedButton
                            variant='ghost'
                            className='w-full justify-start'
                          >
                            <User className='mr-2 size-4' />
                            Profile
                          </EnhancedButton>
                        </div>
                      </EnhancedDrawerBody>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>

                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='outline' size='sm'>
                        Medium Form
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent size='md' surface='panel'>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>
                          Contact Information
                        </EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Enter your details for our newsletter
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <EnhancedLabel htmlFor='drawer-email'>
                              Email
                            </EnhancedLabel>
                            <EnhancedInput
                              id='drawer-email'
                              type='email'
                              placeholder='your@email.com'
                            />
                          </div>
                          <div className='space-y-2'>
                            <EnhancedLabel htmlFor='drawer-name'>
                              Name
                            </EnhancedLabel>
                            <EnhancedInput
                              id='drawer-name'
                              placeholder='Your name'
                            />
                          </div>
                        </div>
                      </EnhancedDrawerBody>
                      <EnhancedDrawerFooter>
                        <EnhancedButton variant='primary' className='w-full'>
                          Subscribe
                        </EnhancedButton>
                        <EnhancedDrawerClose asChild>
                          <EnhancedButton variant='ghost' className='w-full'>
                            Cancel
                          </EnhancedButton>
                        </EnhancedDrawerClose>
                      </EnhancedDrawerFooter>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>

                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='outline' size='sm'>
                        Large Detail
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent size='lg' surface='glass'>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>
                          Product Details
                        </EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Complete product information and specifications
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-6'>
                          <div className='flex aspect-video items-center justify-center rounded-lg bg-muted/50'>
                            <div className='space-y-2 text-center'>
                              <div className='text-3xl'>📱</div>
                              <p className='text-sm text-muted-foreground'>
                                Product Image
                              </p>
                            </div>
                          </div>
                          <div className='space-y-4'>
                            <div>
                              <h4 className='mb-2 font-medium'>Description</h4>
                              <p className='text-sm text-muted-foreground'>
                                This is a comprehensive view of the product with
                                detailed specifications and feature
                                descriptions.
                              </p>
                            </div>
                            <div>
                              <h4 className='mb-2 font-medium'>Features</h4>
                              <ul className='space-y-1 text-sm text-muted-foreground'>
                                <li>• Feature one with detailed explanation</li>
                                <li>• Feature two with specifications</li>
                                <li>• Feature three with benefits</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </EnhancedDrawerBody>
                      <EnhancedDrawerFooter>
                        <div className='flex w-full gap-3'>
                          <EnhancedButton variant='primary' className='flex-1'>
                            Add to Cart
                          </EnhancedButton>
                          <EnhancedButton
                            variant='outline'
                            size='sm'
                            className='size-10 p-0'
                          >
                            <Heart className='size-4' />
                          </EnhancedButton>
                        </div>
                      </EnhancedDrawerFooter>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>

                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='outline' size='sm'>
                        Auto Height
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent size='auto' surface='floating'>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>
                          Dynamic Content
                        </EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Drawer height adapts to content automatically
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-3'>
                          <p className='text-sm text-muted-foreground'>
                            This drawer automatically sizes itself based on the
                            content within.
                          </p>
                          <div className='rounded border border-border bg-card p-3'>
                            <p className='text-xs text-muted-foreground'>
                              Content-aware sizing ensures optimal mobile
                              experience.
                            </p>
                          </div>
                        </div>
                      </EnhancedDrawerBody>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Size variants from compact to auto-sizing with surface
                  material options
                </p>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Factory Patterns
                </h3>
                <div className='flex flex-wrap gap-3'>
                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='secondary' size='sm'>
                        Action Sheet
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent {...DrawerFactory.actionSheet()}>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>Quick Actions</EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Choose an action to perform
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-2'>
                          <EnhancedButton
                            variant='ghost'
                            className='h-12 w-full justify-start'
                          >
                            <Download className='mr-3 size-5' />
                            Download
                          </EnhancedButton>
                          <EnhancedButton
                            variant='ghost'
                            className='h-12 w-full justify-start'
                          >
                            <MessageSquare className='mr-3 size-5' />
                            Share
                          </EnhancedButton>
                          <EnhancedButton
                            variant='ghost'
                            className='h-12 w-full justify-start text-destructive'
                          >
                            <X className='mr-3 size-5' />
                            Delete
                          </EnhancedButton>
                        </div>
                      </EnhancedDrawerBody>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>

                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='secondary' size='sm'>
                        Bottom Sheet
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent {...DrawerFactory.bottomSheet()}>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>Media Player</EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Control playback and view details
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-6'>
                          <div className='flex items-center space-x-4'>
                            <div className='flex size-16 items-center justify-center rounded-lg bg-muted/50'>
                              <div className='text-2xl'>🎵</div>
                            </div>
                            <div>
                              <h4 className='font-medium'>Song Title</h4>
                              <p className='text-sm text-muted-foreground'>
                                Artist Name
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center justify-center space-x-6'>
                            <EnhancedButton
                              variant='ghost'
                              size='sm'
                              className='size-10 p-0'
                            >
                              <SkipBack className='size-5' />
                            </EnhancedButton>
                            <EnhancedButton
                              variant='primary'
                              size='lg'
                              className='rounded-full'
                            >
                              <Play className='size-6' />
                            </EnhancedButton>
                            <EnhancedButton
                              variant='ghost'
                              size='sm'
                              className='size-10 p-0'
                            >
                              <SkipForward className='size-5' />
                            </EnhancedButton>
                          </div>
                        </div>
                      </EnhancedDrawerBody>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>

                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='secondary' size='sm'>
                        Form Drawer
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent {...DrawerFactory.formDrawer()}>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>
                          Create New Item
                        </EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Fill out the form to create a new item
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-4'>
                          <div className='space-y-2'>
                            <EnhancedLabel htmlFor='form-title'>
                              Title
                            </EnhancedLabel>
                            <EnhancedInput
                              id='form-title'
                              placeholder='Enter title'
                            />
                          </div>
                          <div className='space-y-2'>
                            <EnhancedLabel htmlFor='form-description'>
                              Description
                            </EnhancedLabel>
                            <textarea
                              id='form-description'
                              className='w-full rounded-md border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent'
                              rows={4}
                              placeholder='Enter description'
                            />
                          </div>
                          <div className='space-y-2'>
                            <EnhancedLabel htmlFor='form-category'>
                              Category
                            </EnhancedLabel>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='work'>Work</SelectItem>
                                <SelectItem value='personal'>
                                  Personal
                                </SelectItem>
                                <SelectItem value='other'>Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </EnhancedDrawerBody>
                      <EnhancedDrawerFooter>
                        <div className='flex w-full gap-3'>
                          <EnhancedDrawerClose asChild>
                            <EnhancedButton
                              variant='outline'
                              className='flex-1'
                            >
                              Cancel
                            </EnhancedButton>
                          </EnhancedDrawerClose>
                          <EnhancedButton variant='primary' className='flex-1'>
                            Create
                          </EnhancedButton>
                        </div>
                      </EnhancedDrawerFooter>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>

                  <EnhancedDrawer>
                    <EnhancedDrawerTrigger asChild>
                      <EnhancedButton variant='secondary' size='sm'>
                        AAA Compliant
                      </EnhancedButton>
                    </EnhancedDrawerTrigger>
                    <EnhancedDrawerContent {...DrawerFactory.accessible()}>
                      <EnhancedDrawerHeader>
                        <EnhancedDrawerTitle>
                          Accessible Drawer
                        </EnhancedDrawerTitle>
                        <EnhancedDrawerDescription>
                          Enhanced accessibility with AAA compliance
                        </EnhancedDrawerDescription>
                      </EnhancedDrawerHeader>
                      <EnhancedDrawerBody>
                        <div className='space-y-4'>
                          <div className='rounded border border-border bg-card p-4'>
                            <h4 className='mb-2 font-medium text-foreground'>
                              AAA Features
                            </h4>
                            <ul className='space-y-1 text-sm text-muted-foreground'>
                              <li>
                                • Enhanced contrast ratios for better
                                readability
                              </li>
                              <li>
                                • Improved focus indicators for keyboard
                                navigation
                              </li>
                              <li>
                                • Screen reader optimized structure and labeling
                              </li>
                              <li>
                                • Touch target sizes meet 44px minimum
                                requirement
                              </li>
                            </ul>
                          </div>
                        </div>
                      </EnhancedDrawerBody>
                    </EnhancedDrawerContent>
                  </EnhancedDrawer>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Pre-configured patterns for common mobile interaction patterns
                </p>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Technical Features
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <ul className='space-y-3'>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Mobile-first gesture support with touch interactions
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Apple HIG motion system with natural spring animations
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Snap behavior for proximity and precision interactions
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Safe area inset handling for modern mobile devices
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Liquid glass materials with backdrop blur effects
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Factory pattern configurations for rapid development
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Comprehensive keyboard navigation and focus management
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        WCAG AAA compliance with enforced mode option
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Anti-drift enforcement with token-only references
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Platform-aware 44px minimum touch targets
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Select Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Select - Dark-First Form Controls
            </h2>
            <p className='text-muted-foreground'>
              Professional dropdown components with Apple HIG harmony, liquid
              glass materials, and comprehensive accessibility support.
            </p>

            {/* Basic Select Variants */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Default Variant
                </h3>
                <div className='space-y-3'>
                  <Select
                    value={selectedTheme}
                    onValueChange={setSelectedTheme}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Choose a theme' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem variant='default' value='light'>
                        Light Theme
                      </SelectItem>
                      <SelectItem variant='default' value='dark'>
                        Dark Theme
                      </SelectItem>
                      <SelectItem variant='default' value='system'>
                        System Theme
                      </SelectItem>
                      <SelectItem variant='default' value='auto'>
                        Auto Theme
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder='Disabled select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem variant='default' value='option1'>
                        Option 1
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Ghost Variant
                </h3>
                <div className='space-y-3'>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger variant='ghost'>
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem variant='ghost' value='en'>
                        English
                      </SelectItem>
                      <SelectItem variant='ghost' value='es'>
                        Español
                      </SelectItem>
                      <SelectItem variant='ghost' value='fr'>
                        Français
                      </SelectItem>
                      <SelectItem variant='ghost' value='de'>
                        Deutsch
                      </SelectItem>
                      <SelectItem variant='ghost' value='zh'>
                        中文
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger variant='ghost' size='sm'>
                      <SelectValue placeholder='Small ghost select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem variant='ghost' value='compact'>
                        Compact View
                      </SelectItem>
                      <SelectItem variant='ghost' value='normal'>
                        Normal View
                      </SelectItem>
                      <SelectItem variant='ghost' value='expanded'>
                        Expanded View
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Glass Variant & Selection Visibility
                </h3>
                <div className='space-y-3'>
                  <div className='rounded-lg border border-border/50 bg-muted/30 p-4'>
                    <p className='mb-3 text-sm text-muted-foreground'>
                      Enhanced visual feedback: Selected items show accent
                      background, hovered items show subtle highlight
                    </p>
                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger variant='glass'>
                        <SelectValue placeholder='Choose your role' />
                      </SelectTrigger>
                      <SelectContent variant='glass'>
                        <SelectItem variant='glass' value='admin'>
                          Administrator
                        </SelectItem>
                        <SelectItem variant='glass' value='editor'>
                          Editor
                        </SelectItem>
                        <SelectItem variant='glass' value='viewer'>
                          Viewer
                        </SelectItem>
                        <SelectItem variant='glass' value='guest'>
                          Guest
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Select>
                    <SelectTrigger variant='glass' size='lg'>
                      <SelectValue placeholder='Large glass select' />
                    </SelectTrigger>
                    <SelectContent variant='glass'>
                      <SelectItem variant='glass' value='priority-high'>
                        High Priority
                      </SelectItem>
                      <SelectItem variant='glass' value='priority-medium'>
                        Medium Priority
                      </SelectItem>
                      <SelectItem variant='glass' value='priority-low'>
                        Low Priority
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Grouped Options Demo */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Grouped Options
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a food category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem variant='default' value='apple'>
                        Apple
                      </SelectItem>
                      <SelectItem variant='default' value='banana'>
                        Banana
                      </SelectItem>
                      <SelectItem variant='default' value='orange'>
                        Orange
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Vegetables</SelectLabel>
                      <SelectItem variant='default' value='carrot'>
                        Carrot
                      </SelectItem>
                      <SelectItem variant='default' value='broccoli'>
                        Broccoli
                      </SelectItem>
                      <SelectItem variant='default' value='spinach'>
                        Spinach
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Proteins</SelectLabel>
                      <SelectItem variant='default' value='chicken'>
                        Chicken
                      </SelectItem>
                      <SelectItem variant='default' value='fish'>
                        Fish
                      </SelectItem>
                      <SelectItem variant='default' value='tofu'>
                        Tofu
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger variant='ghost'>
                    <SelectValue placeholder='Select development tools' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Editors</SelectLabel>
                      <SelectItem variant='ghost' value='vscode'>
                        VS Code
                      </SelectItem>
                      <SelectItem variant='ghost' value='webstorm'>
                        WebStorm
                      </SelectItem>
                      <SelectItem variant='ghost' value='vim'>
                        Vim
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Frameworks</SelectLabel>
                      <SelectItem variant='ghost' value='react'>
                        React
                      </SelectItem>
                      <SelectItem variant='ghost' value='vue'>
                        Vue
                      </SelectItem>
                      <SelectItem variant='ghost' value='angular'>
                        Angular
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      <SelectItem variant='ghost' value='typescript'>
                        TypeScript
                      </SelectItem>
                      <SelectItem variant='ghost' value='javascript'>
                        JavaScript
                      </SelectItem>
                      <SelectItem variant='ghost' value='python'>
                        Python
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Validation States */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Validation States
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-3'>
                  <label
                    htmlFor='error-select'
                    className='text-sm font-medium text-foreground'
                  >
                    Error State
                  </label>
                  <Select>
                    <SelectTrigger validation='error' id='error-select'>
                      <SelectValue placeholder='This field has an error' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem variant='default' value='option1'>
                        Valid Option 1
                      </SelectItem>
                      <SelectItem variant='default' value='option2'>
                        Valid Option 2
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-sm text-destructive'>
                    Please select a valid option
                  </p>
                </div>

                <div className='space-y-3'>
                  <label
                    htmlFor='success-select'
                    className='text-sm font-medium text-foreground'
                  >
                    Success State
                  </label>
                  <Select defaultValue='selected'>
                    <SelectTrigger validation='success' id='success-select'>
                      <SelectValue placeholder='Selection confirmed' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem variant='default' value='selected'>
                        ✅ Selected Option
                      </SelectItem>
                      <SelectItem variant='default' value='option2'>
                        Alternative Option
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-sm text-success'>
                    Great choice! Selection confirmed.
                  </p>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-3'>
                  <label
                    htmlFor='small-select'
                    className='text-sm font-medium text-foreground'
                  >
                    Small
                  </label>
                  <Select>
                    <SelectTrigger size='sm' id='small-select'>
                      <SelectValue placeholder='Small select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='option1'>Compact Option</SelectItem>
                      <SelectItem value='option2'>Dense Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-3'>
                  <label
                    htmlFor='default-select'
                    className='text-sm font-medium text-foreground'
                  >
                    Default
                  </label>
                  <Select>
                    <SelectTrigger id='default-select'>
                      <SelectValue placeholder='Default select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='option1'>Standard Option</SelectItem>
                      <SelectItem value='option2'>Regular Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-3'>
                  <label
                    htmlFor='large-select'
                    className='text-sm font-medium text-foreground'
                  >
                    Large
                  </label>
                  <Select>
                    <SelectTrigger size='lg' id='large-select'>
                      <SelectValue placeholder='Large select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='option1'>Prominent Option</SelectItem>
                      <SelectItem value='option2'>Spacious Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* MAPS v2.2 Compliance Features */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                MAPS v2.2 Compliance Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full Radix Select integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG interaction patterns
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first design philosophy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass material variants
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Complete keyboard navigation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Screen reader optimized
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Platform-aware focus management
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced tokens integration
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Checkbox Component Showcase */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Checkbox Component
            </h2>
            <p className='text-muted-foreground'>
              Professional checkbox components with Apple HIG harmony, liquid
              glass materials, and comprehensive accessibility support.
            </p>

            {/* Basic Checkbox Variants */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Default Variant
                </h3>
                <div className='space-y-3'>
                  <CheckboxWithLabel
                    label='Accept terms and conditions'
                    description='By checking this box, you agree to our terms of service'
                  />

                  <CheckboxWithLabel
                    label='Subscribe to newsletter'
                    description='Receive updates about new features and products'
                  />

                  <CheckboxWithLabel
                    label='Enable notifications'
                    checked={true}
                    description='Get notified about important updates'
                  />

                  <CheckboxWithLabel
                    label='Disabled option'
                    disabled
                    description='This option is currently unavailable'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Ghost Variant
                </h3>
                <div className='space-y-3'>
                  <CheckboxWithLabel
                    variant='ghost'
                    label='Enable auto-save'
                    description='Automatically save your work as you type'
                  />

                  <CheckboxWithLabel
                    variant='ghost'
                    label='Show advanced options'
                    checked={true}
                    description='Display additional configuration settings'
                  />

                  <CheckboxWithLabel
                    variant='ghost'
                    label='Use dark theme'
                    description='Switch to a darker color scheme'
                  />

                  <CheckboxWithLabel
                    variant='ghost'
                    label='Beta features'
                    checked='indeterminate'
                    description='Some beta features are enabled'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Glass Variant & Visual States
                </h3>
                <div className='space-y-3'>
                  <div className='rounded-lg border border-border/50 bg-muted/30 p-4'>
                    <p className='mb-3 text-sm text-muted-foreground'>
                      Enhanced visual feedback: Glass materials with liquid
                      vibrancy
                    </p>
                    <div className='space-y-3'>
                      <CheckboxWithLabel
                        variant='glass'
                        label='Privacy mode'
                        description='Enable enhanced privacy features'
                      />

                      <CheckboxWithLabel
                        variant='glass'
                        label='Advanced security'
                        checked={true}
                        description='Two-factor authentication enabled'
                      />

                      <CheckboxWithLabel
                        variant='glass'
                        label='Developer mode'
                        checked='indeterminate'
                        description='Some development tools are active'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox Groups */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Checkbox Groups
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <CheckboxGroup
                  label='Notification Preferences'
                  description='Choose how you want to be notified'
                  required
                >
                  <CheckboxWithLabel label='Email notifications' />
                  <CheckboxWithLabel
                    label='Push notifications'
                    checked={true}
                  />
                  <CheckboxWithLabel label='SMS alerts' />
                  <CheckboxWithLabel
                    label='Desktop notifications'
                    checked={true}
                  />
                </CheckboxGroup>

                <CheckboxGroup
                  label='Privacy Settings'
                  description='Control your data and privacy'
                  orientation='vertical'
                >
                  <CheckboxWithLabel
                    variant='ghost'
                    label='Share analytics data'
                  />
                  <CheckboxWithLabel
                    variant='ghost'
                    label='Allow personalized ads'
                    checked={true}
                  />
                  <CheckboxWithLabel
                    variant='ghost'
                    label='Enable location tracking'
                  />
                </CheckboxGroup>
              </div>
            </div>

            {/* Validation States */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Validation States
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Error State
                  </h4>
                  <CheckboxWithLabel
                    validation='error'
                    label='Required field'
                    description='This field must be checked to continue'
                    required
                  />
                  <p className='text-sm text-destructive'>
                    Please accept the terms to proceed
                  </p>
                </div>

                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Success State
                  </h4>
                  <CheckboxWithLabel
                    validation='success'
                    label='Verified account'
                    checked={true}
                    description='Your account has been successfully verified'
                  />
                  <p className='text-sm text-success'>
                    Account verification complete!
                  </p>
                </div>

                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Warning State
                  </h4>
                  <CheckboxWithLabel
                    validation='warning'
                    label='Beta feature'
                    description='This feature is still in development'
                  />
                  <p className='text-sm text-warning'>
                    Use with caution - feature may be unstable
                  </p>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>Small</h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      size='sm'
                      label='Compact checkbox'
                      description='Perfect for dense layouts'
                    />
                    <CheckboxWithLabel
                      size='sm'
                      label='Small checked'
                      checked={true}
                      description='Checked state in small size'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Default
                  </h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      label='Default checkbox'
                      description='Standard size for most use cases'
                    />
                    <CheckboxWithLabel
                      label='Default checked'
                      checked={true}
                      description='Checked state in default size'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-foreground'>Large</h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      size='lg'
                      label='Large checkbox'
                      description='Prominent size for key decisions'
                    />
                    <CheckboxWithLabel
                      size='lg'
                      label='Large checked'
                      checked={true}
                      description='Checked state in large size'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Label Positioning */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Label Positioning
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-3'>
                  <h4 className='text-md font-medium text-foreground'>
                    Right-aligned Labels (Default)
                  </h4>
                  <CheckboxWithLabel
                    label='Standard right alignment'
                    description='Label appears to the right of the checkbox'
                  />
                  <CheckboxWithLabel
                    label='Multi-line label that wraps to demonstrate how longer text content behaves with right alignment'
                    description='Description text also follows the same alignment pattern'
                    checked={true}
                  />
                </div>

                <div className='space-y-3'>
                  <h4 className='text-md font-medium text-foreground'>
                    Left-aligned Labels
                  </h4>
                  <CheckboxWithLabel
                    labelPosition='left'
                    label='Left-aligned label'
                    description='Label appears to the left of the checkbox'
                  />
                  <CheckboxWithLabel
                    labelPosition='left'
                    label='Multi-line left-aligned label for longer content demonstration'
                    description='Description maintains consistent left alignment'
                    checked={true}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Demonstrations */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Demonstrations
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-border bg-muted/20 p-4'>
                  <h4 className='text-md mb-3 font-medium text-foreground'>
                    Todo List Example
                  </h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      label='Review design mockups'
                      checked={true}
                    />
                    <CheckboxWithLabel
                      label='Implement checkbox component'
                      checked={true}
                    />
                    <CheckboxWithLabel
                      label='Write comprehensive tests'
                      checked={true}
                    />
                    <CheckboxWithLabel
                      label='Update documentation'
                      checked='indeterminate'
                    />
                    <CheckboxWithLabel label='Deploy to production' />
                  </div>
                </div>

                <div className='rounded-lg border border-border bg-muted/20 p-4'>
                  <h4 className='text-md mb-3 font-medium text-foreground'>
                    Accessibility Features
                  </h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      label='44px minimum touch targets'
                      checked={true}
                      description='Meets Apple HIG requirements'
                    />
                    <CheckboxWithLabel
                      label='Keyboard navigation support'
                      checked={true}
                      description='Full keyboard accessibility'
                    />
                    <CheckboxWithLabel
                      label='Screen reader compatible'
                      checked={true}
                      description='Proper ARIA attributes'
                    />
                    <CheckboxWithLabel
                      label='AAA color contrast'
                      checked={true}
                      description='WCAG AAA compliant colors'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MAPS v2.2 Compliance Features */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                MAPS v2.2 Compliance Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full Radix Checkbox integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG touch targets (44px)
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first design philosophy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass material variants
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Three-state support (unchecked/checked/indeterminate)
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      WCAG AAA accessibility compliance
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Platform-aware focus management
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced tokens integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Comprehensive test coverage
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion-safe animation patterns
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Popover Component Showcase */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Popover Component
            </h2>
            <p className='text-muted-foreground'>
              Professional popover components with Apple HIG harmony, liquid
              glass materials, and comprehensive accessibility features.
            </p>

            {/* Basic Popover Variants */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Popover Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Default
                  </h4>
                  <div className='space-y-3'>
                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='outline' size='sm'>
                          <Info className='size-4' />
                          Info
                        </EnhancedButton>
                      }
                      variant='default'
                    >
                      <div className='space-y-2'>
                        <h4 className='font-medium text-foreground'>
                          Default Popover
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          Clean, elevated surface with solid background and
                          subtle border.
                        </p>
                      </div>
                    </PopoverWithTrigger>

                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='ghost' size='sm'>
                          <User className='size-4' />
                          Profile
                        </EnhancedButton>
                      }
                      variant='default'
                      size='lg'
                    >
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <div className='flex size-10 items-center justify-center rounded-full bg-accent/20'>
                            <User className='size-5' />
                          </div>
                          <div>
                            <h4 className='font-medium text-foreground'>
                              John Doe
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              Product Designer
                            </p>
                          </div>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          Last active: 2 minutes ago
                        </div>
                      </div>
                    </PopoverWithTrigger>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>Glass</h4>
                  <div className='space-y-3'>
                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='outline' size='sm'>
                          <MessageSquare className='size-4' />
                          Comments
                        </EnhancedButton>
                      }
                      variant='glass'
                    >
                      <div className='space-y-2'>
                        <h4 className='font-medium text-foreground'>
                          Glass Popover
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          Liquid glass material with backdrop blur and
                          transparency.
                        </p>
                      </div>
                    </PopoverWithTrigger>

                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='ghost' size='sm'>
                          <Settings className='size-4' />
                          Settings
                        </EnhancedButton>
                      }
                      variant='glass'
                      size='lg'
                    >
                      <div className='space-y-3'>
                        <h4 className='font-medium text-foreground'>
                          Quick Settings
                        </h4>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground'>
                              Dark Mode
                            </span>
                            <CheckboxWithLabel checked={true} />
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground'>
                              Notifications
                            </span>
                            <CheckboxWithLabel checked={false} />
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground'>
                              Auto-save
                            </span>
                            <CheckboxWithLabel checked={true} />
                          </div>
                        </div>
                      </div>
                    </PopoverWithTrigger>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Elevated
                  </h4>
                  <div className='space-y-3'>
                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='outline' size='sm'>
                          <AlertTriangle className='size-4' />
                          Alert
                        </EnhancedButton>
                      }
                      variant='elevated'
                    >
                      <div className='space-y-2'>
                        <h4 className='font-medium text-foreground'>
                          Elevated Popover
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          Higher contrast surface with enhanced shadow depth.
                        </p>
                      </div>
                    </PopoverWithTrigger>

                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='ghost' size='sm'>
                          <Mail className='size-4' />
                          Mail
                        </EnhancedButton>
                      }
                      variant='elevated'
                      size='xl'
                    >
                      <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-medium text-foreground'>
                            Quick Compose
                          </h4>
                          <PopoverClose>
                            <X className='size-4' />
                          </PopoverClose>
                        </div>
                        <div className='space-y-3'>
                          <EnhancedInput
                            placeholder='To: recipient@example.com'
                            size='sm'
                          />
                          <EnhancedInput placeholder='Subject' size='sm' />
                          <textarea
                            className='min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent'
                            placeholder='Write your message...'
                          />
                          <div className='flex justify-end gap-2'>
                            <EnhancedButton variant='ghost' size='sm'>
                              Cancel
                            </EnhancedButton>
                            <EnhancedButton size='sm'>Send</EnhancedButton>
                          </div>
                        </div>
                      </div>
                    </PopoverWithTrigger>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>Small</h4>
                  <PopoverWithTrigger
                    trigger={
                      <EnhancedButton variant='outline' size='sm'>
                        Small
                      </EnhancedButton>
                    }
                    size='sm'
                  >
                    <p className='text-xs text-muted-foreground'>
                      Compact popover for brief information.
                    </p>
                  </PopoverWithTrigger>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Default
                  </h4>
                  <PopoverWithTrigger
                    trigger={
                      <EnhancedButton variant='outline' size='sm'>
                        Default
                      </EnhancedButton>
                    }
                    size='default'
                  >
                    <p className='text-sm text-muted-foreground'>
                      Standard popover size for most use cases.
                    </p>
                  </PopoverWithTrigger>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>Large</h4>
                  <PopoverWithTrigger
                    trigger={
                      <EnhancedButton variant='outline' size='sm'>
                        Large
                      </EnhancedButton>
                    }
                    size='lg'
                  >
                    <div className='space-y-2'>
                      <h4 className='font-medium text-foreground'>
                        Large Popover
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        More spacious popover for complex content and multiple
                        elements.
                      </p>
                    </div>
                  </PopoverWithTrigger>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Extra Large
                  </h4>
                  <PopoverWithTrigger
                    trigger={
                      <EnhancedButton variant='outline' size='sm'>
                        XL
                      </EnhancedButton>
                    }
                    size='xl'
                  >
                    <div className='space-y-3'>
                      <h4 className='font-medium text-foreground'>
                        Extra Large Popover
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Maximum size popover for rich content, forms, and
                        detailed information displays.
                      </p>
                      <div className='flex gap-2'>
                        <EnhancedButton variant='ghost' size='sm'>
                          Learn More
                        </EnhancedButton>
                        <EnhancedButton size='sm'>Get Started</EnhancedButton>
                      </div>
                    </div>
                  </PopoverWithTrigger>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Advanced Features
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    With Arrow
                  </h4>
                  <Popover>
                    <PopoverTrigger variant='outline'>
                      <EnhancedButton variant='outline' size='sm'>
                        Show Arrow
                      </EnhancedButton>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className='space-y-2'>
                        <h4 className='font-medium text-foreground'>
                          Arrow Pointer
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          Popover with visual arrow pointing to trigger.
                        </p>
                      </div>
                      <PopoverArrow />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Custom Positioning
                  </h4>
                  <Popover>
                    <PopoverTrigger variant='outline'>
                      <EnhancedButton variant='outline' size='sm'>
                        Custom Position
                      </EnhancedButton>
                    </PopoverTrigger>
                    <PopoverContent
                      sideOffset={8}
                      alignOffset={10}
                      side='top'
                      align='start'
                    >
                      <div className='space-y-2'>
                        <h4 className='font-medium text-foreground'>
                          Positioned Top-Start
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          Custom positioning with side and alignment offsets.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Interactive Examples
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='text-base font-medium text-foreground'>
                    Help System
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Context-sensitive help with popovers
                  </p>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                      <label
                        htmlFor='username-input'
                        className='text-sm text-foreground'
                      >
                        Username
                      </label>
                      <PopoverWithTrigger
                        trigger={
                          <EnhancedButton variant='ghost' size='sm'>
                            <Info className='size-3' />
                          </EnhancedButton>
                        }
                        size='sm'
                      >
                        <p className='text-xs text-muted-foreground'>
                          Choose a unique username (3-20 characters)
                        </p>
                      </PopoverWithTrigger>
                    </div>
                    <EnhancedInput
                      id='username-input'
                      placeholder='Enter username'
                      size='sm'
                    />

                    <div className='flex items-center gap-2'>
                      <label
                        htmlFor='password-input'
                        className='text-sm text-foreground'
                      >
                        Password
                      </label>
                      <PopoverWithTrigger
                        trigger={
                          <EnhancedButton variant='ghost' size='sm'>
                            <Info className='size-3' />
                          </EnhancedButton>
                        }
                        size='lg'
                      >
                        <div className='space-y-2'>
                          <h5 className='text-xs font-medium text-foreground'>
                            Password Requirements
                          </h5>
                          <ul className='space-y-1 text-xs text-muted-foreground'>
                            <li>• Minimum 8 characters</li>
                            <li>• At least one uppercase letter</li>
                            <li>• At least one number</li>
                            <li>• At least one special character</li>
                          </ul>
                        </div>
                      </PopoverWithTrigger>
                    </div>
                    <EnhancedInput
                      id='password-input'
                      type='password'
                      placeholder='Enter password'
                      size='sm'
                    />
                  </div>
                </div>

                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='text-base font-medium text-foreground'>
                    Action Menu
                  </h4>
                  <p className='text-sm text-muted-foreground'>
                    Context menu with multiple actions
                  </p>
                  <div className='flex justify-center'>
                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='outline'>
                          <Settings className='size-4' />
                          Actions
                        </EnhancedButton>
                      }
                      variant='elevated'
                      size='lg'
                    >
                      <div className='space-y-1'>
                        <EnhancedButton
                          variant='ghost'
                          size='sm'
                          className='w-full justify-start'
                        >
                          <User className='size-4' />
                          Edit Profile
                        </EnhancedButton>
                        <EnhancedButton
                          variant='ghost'
                          size='sm'
                          className='w-full justify-start'
                        >
                          <Settings className='size-4' />
                          Settings
                        </EnhancedButton>
                        <EnhancedButton
                          variant='ghost'
                          size='sm'
                          className='w-full justify-start'
                        >
                          <Download className='size-4' />
                          Export Data
                        </EnhancedButton>
                        <div className='my-1 border-t border-border' />
                        <EnhancedButton
                          variant='ghost'
                          size='sm'
                          className='w-full justify-start text-destructive hover:text-destructive'
                        >
                          <X className='size-4' />
                          Delete Account
                        </EnhancedButton>
                      </div>
                    </PopoverWithTrigger>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='text-base font-medium text-foreground'>
                    Keyboard Navigation
                  </h4>
                  <div className='space-y-3'>
                    <PopoverWithTrigger
                      trigger={
                        <EnhancedButton variant='outline'>
                          Keyboard Demo
                        </EnhancedButton>
                      }
                    >
                      <div className='space-y-3'>
                        <h5 className='font-medium text-foreground'>
                          Keyboard Controls
                        </h5>
                        <div className='space-y-2 text-sm text-muted-foreground'>
                          <div>
                            •{' '}
                            <kbd className='rounded bg-muted px-1'>
                              Enter/Space
                            </kbd>{' '}
                            - Open popover
                          </div>
                          <div>
                            •{' '}
                            <kbd className='rounded bg-muted px-1'>Escape</kbd>{' '}
                            - Close popover
                          </div>
                          <div>
                            • <kbd className='rounded bg-muted px-1'>Tab</kbd> -
                            Navigate elements
                          </div>
                          <div>• Focus automatically managed</div>
                        </div>
                      </div>
                    </PopoverWithTrigger>
                  </div>
                </div>

                <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                  <h4 className='text-base font-medium text-foreground'>
                    ARIA Compliance
                  </h4>
                  <div className='space-y-3'>
                    <div className='space-y-2 text-sm'>
                      <CheckboxWithLabel
                        label='ARIA dialog role'
                        checked={true}
                        description='Proper semantic markup'
                      />
                      <CheckboxWithLabel
                        label='Focus management'
                        checked={true}
                        description='Automatic focus handling'
                      />
                      <CheckboxWithLabel
                        label='Screen reader support'
                        checked={true}
                        description='Accessible to assistive technology'
                      />
                      <CheckboxWithLabel
                        label='AAA color contrast'
                        checked={true}
                        description='WCAG AAA compliant colors'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAPS v2.2 Compliance Features */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                MAPS v2.2 Compliance Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full Radix Popover integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG positioning system
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first design philosophy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass material variants
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Collision detection and avoidance
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      WCAG AAA accessibility compliance
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Platform-aware focus management
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced tokens integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Comprehensive test coverage
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion-safe animation patterns
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced AlertDialog Component Showcase */}
          <section className='space-y-6'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-2xl font-semibold text-foreground'>
                Enhanced AlertDialog Component
              </h2>
              <p className='text-muted-foreground'>
                Professional alert dialogs built on Radix UI with MAPS v2.2
                compliance, Apple HIG styling, and comprehensive accessibility
                features.
              </p>
            </div>

            {/* Basic AlertDialog Examples */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Basic AlertDialog Examples
              </h3>
              <div className='flex flex-wrap gap-4'>
                {/* Default AlertDialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <EnhancedButton variant='outline' icon={<AlertTriangle />}>
                      Show Confirmation
                    </EnhancedButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Glass Variant */}
                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton
                      variant='primary'
                      vibrancy='glass'
                      icon={<Info />}
                    >
                      Glass Dialog
                    </EnhancedButton>
                  }
                  title='Beautiful Glass Effect'
                  description='Experience the liquid glass material design with perfect Apple HIG integration.'
                  actionText='Amazing!'
                  variant='glass'
                  size='lg'
                />

                {/* Destructive AlertDialog */}
                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton variant='error' icon={<X />}>
                      Delete Account
                    </EnhancedButton>
                  }
                  title='Delete Account'
                  description='This action is permanent and cannot be undone. All your data will be permanently deleted.'
                  actionText='Delete Forever'
                  cancelText='Keep Account'
                  variant='destructive'
                  onAction={() => console.log('Account deleted')}
                />
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Size Variants
              </h3>
              <div className='flex flex-wrap gap-4'>
                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton variant='outline' size='sm'>
                      Small Dialog
                    </EnhancedButton>
                  }
                  title='Small Alert'
                  description='Compact dialog for quick confirmations.'
                  actionText='OK'
                  size='sm'
                />

                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton variant='outline'>
                      Default Dialog
                    </EnhancedButton>
                  }
                  title='Default Alert'
                  description='Standard dialog size for most use cases with balanced content space.'
                  actionText='Proceed'
                />

                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton variant='outline' size='lg'>
                      Large Dialog
                    </EnhancedButton>
                  }
                  title='Large Alert Dialog'
                  description='Spacious dialog for detailed confirmations and complex content that requires more reading space and user consideration.'
                  actionText='I Understand'
                  size='lg'
                />
              </div>
            </div>

            {/* Advanced Use Cases */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Advanced Use Cases
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {/* Data Loss Warning */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <EnhancedButton
                      variant='outline'
                      icon={<AlertTriangle />}
                      className='w-full'
                    >
                      Unsaved Changes
                    </EnhancedButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have unsaved changes that will be lost if you
                        continue. Would you like to save your work before
                        proceeding?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className='variant-outline'>
                        Don&apos;t Save
                      </AlertDialogAction>
                      <AlertDialogAction>Save & Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Subscription Upgrade */}
                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton
                      variant='primary'
                      icon={<Plus />}
                      className='w-full'
                    >
                      Upgrade Plan
                    </EnhancedButton>
                  }
                  title='Upgrade to Premium'
                  description='Get access to advanced features, unlimited projects, and priority support.'
                  actionText='Upgrade Now'
                  variant='glass'
                  onAction={() => console.log('Upgrade initiated')}
                />

                {/* Logout Confirmation */}
                <EnhancedAlertDialog
                  trigger={
                    <EnhancedButton
                      variant='ghost'
                      icon={<User />}
                      className='w-full'
                    >
                      Sign Out
                    </EnhancedButton>
                  }
                  title='Sign Out'
                  description='Are you sure you want to sign out? Any unsaved progress will be lost.'
                  actionText='Sign Out'
                  cancelText='Stay Signed In'
                  onAction={() => console.log('User signed out')}
                />
              </div>
            </div>

            {/* Accessibility Features */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                Accessibility Features
              </h3>
              <p className='text-sm text-muted-foreground'>
                Our Enhanced AlertDialog components are built with comprehensive
                accessibility support:
              </p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-3'>
                  <h4 className='font-medium text-foreground'>
                    ARIA Compliance
                  </h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      label='role="alertdialog"'
                      checked={true}
                      description='Proper semantic role'
                    />
                    <CheckboxWithLabel
                      label='aria-labelledby'
                      checked={true}
                      description='Title association'
                    />
                    <CheckboxWithLabel
                      label='aria-describedby'
                      checked={true}
                      description='Description association'
                    />
                    <CheckboxWithLabel
                      label='aria-modal'
                      checked={true}
                      description='Modal behavior indication'
                    />
                  </div>
                </div>
                <div className='space-y-3'>
                  <h4 className='font-medium text-foreground'>Interaction</h4>
                  <div className='space-y-2'>
                    <CheckboxWithLabel
                      label='Focus trapping'
                      checked={true}
                      description='Prevents focus from leaving'
                    />
                    <CheckboxWithLabel
                      label='Escape key support'
                      checked={true}
                      description='ESC to close'
                    />
                    <CheckboxWithLabel
                      label='Return focus management'
                      checked={true}
                      description='Returns focus to trigger'
                    />
                    <CheckboxWithLabel
                      label='Screen reader announcements'
                      checked={true}
                      description='Proper content announcement'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MAPS v2.2 Compliance Features */}
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <h3 className='text-lg font-medium text-foreground'>
                MAPS v2.2 Compliance Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full Radix AlertDialog integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG color system integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first design philosophy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass material variants
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced button integration
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      WCAG AAA accessibility compliance
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Platform-aware focus management
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced tokens integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Comprehensive test coverage
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Smooth backdrop transitions
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced DropdownMenu Showcase */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced DropdownMenu - Radix Integration
            </h2>
            <p className='text-muted-foreground'>
              Professional dropdown menus with Apple HIG harmony, liquid glass
              materials, and comprehensive accessibility support built on Radix
              UI primitives.
            </p>

            {/* Basic DropdownMenu Variants */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  User Menu (Glass Vibrancy)
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EnhancedButton variant='outline' className='w-full gap-2'>
                      <User className='size-4' />
                      John Doe
                    </EnhancedButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent variant='glass' className='w-56'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className='gap-2'>
                      <User className='size-4' />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem className='gap-2'>
                      <Settings className='size-4' />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className='gap-2'>
                        <Plus className='size-4' />
                        <span>Invite users</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className='gap-2'>
                          <Mail className='size-4' />
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='gap-2'>
                          <MessageSquare className='size-4' />
                          <span>Message</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant='destructive' className='gap-2'>
                      <X className='size-4' />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className='text-sm text-muted-foreground'>
                  Glass variant with vibrancy effects and submenu support
                </p>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Settings Menu (Checkboxes & Radios)
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EnhancedButton variant='outline' className='w-full gap-2'>
                      <Settings className='size-4' />
                      Preferences
                    </EnhancedButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent variant='floating' className='w-56'>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup value='dark'>
                      <DropdownMenuRadioItem value='light' className='gap-2'>
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value='dark' className='gap-2'>
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value='system' className='gap-2'>
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem checked={true}>
                      Email notifications
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem checked={false}>
                      Marketing emails
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem checked={true}>
                      Social notifications
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <p className='text-sm text-muted-foreground'>
                  Floating variant with checkbox and radio items
                </p>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Actions Menu (Size Variants)
                </h3>
                <div className='flex gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EnhancedButton variant='outline' size='sm'>
                        SM
                      </EnhancedButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent size='sm'>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Copy</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive'>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EnhancedButton variant='outline' size='md'>
                        MD
                      </EnhancedButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent size='md'>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Copy</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive'>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EnhancedButton variant='outline' size='lg'>
                        LG
                      </EnhancedButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent size='lg'>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Copy</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive'>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Different size variants (sm, md, lg) for various contexts
                </p>
              </div>
            </div>

            {/* DropdownMenu Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Enhanced DropdownMenu Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full Radix DropdownMenu integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Complete keyboard navigation support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Screen reader optimized ARIA labels
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Submenu and nested menu support
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass backdrop blur effects
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Checkbox and radio item support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Keyboard shortcuts display
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility enforcement
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Switch Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Switch - Dark-First Toggle Controls
            </h2>
            <p className='text-muted-foreground'>
              Professional toggle components with Apple HIG harmony, liquid
              glass materials, and comprehensive accessibility support following
              MAPS v2.2 standards.
            </p>

            {/* Basic Switch Variants */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Default Variant
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium'>
                        Push Notifications
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Receive notifications for new messages
                      </p>
                    </div>
                    <EnhancedSwitch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                      aria-label='Enable push notifications'
                    />
                  </div>

                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium'>
                        Auto-save
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Automatically save your work
                      </p>
                    </div>
                    <EnhancedSwitch
                      checked={autoSaveEnabled}
                      onCheckedChange={setAutoSaveEnabled}
                      aria-label='Enable auto-save'
                    />
                  </div>

                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4 opacity-50'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium'>
                        Premium Features
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Requires subscription
                      </p>
                    </div>
                    <EnhancedSwitch
                      checked={false}
                      disabled
                      aria-label='Premium features (disabled)'
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Semantic Variants
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium text-success-foreground'>
                        Two-factor Authentication
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Enhanced security for your account
                      </p>
                    </div>
                    {SwitchFactory.success({
                      checked: twoFactorEnabled,
                      onCheckedChange: setTwoFactorEnabled,
                      'aria-label': 'Enable two-factor authentication',
                    })}
                  </div>

                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium text-warning-foreground'>
                        Dark Mode
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Switch to dark theme
                      </p>
                    </div>
                    {SwitchFactory.warning({
                      checked: darkModeEnabled,
                      onCheckedChange: setDarkModeEnabled,
                      'aria-label': 'Enable dark mode',
                    })}
                  </div>

                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium text-destructive-foreground'>
                        Privacy Mode
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Hide sensitive information
                      </p>
                    </div>
                    {SwitchFactory.destructive({
                      checked: privacyModeEnabled,
                      onCheckedChange: setPrivacyModeEnabled,
                      'aria-label': 'Enable privacy mode',
                    })}
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Size Variants
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-xs font-medium'>
                        Compact Setting
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Small switch for dense layouts
                      </p>
                    </div>
                    {SwitchFactory.small({
                      checked: soundEffectsEnabled,
                      onCheckedChange: setSoundEffectsEnabled,
                      'aria-label': 'Enable sound effects (small)',
                    })}
                  </div>

                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-sm font-medium'>
                        Standard Setting
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Default size for most interfaces
                      </p>
                    </div>
                    <EnhancedSwitch
                      checked={true}
                      size='default'
                      aria-label='Standard size switch'
                    />
                  </div>

                  <div className='flex items-center justify-between rounded-lg border border-border bg-card p-4'>
                    <div className='space-y-0.5'>
                      <EnhancedLabel className='text-lg font-medium'>
                        Prominent Setting
                      </EnhancedLabel>
                      <p className='text-xs text-muted-foreground'>
                        Large switch for important controls
                      </p>
                    </div>
                    {SwitchFactory.large({
                      checked: true,
                      'aria-label': 'Large size switch',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Switch Factory Functions Demo */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Factory Function Examples
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground'>Default</p>
                  {SwitchFactory.default({
                    checked: true,
                    'aria-label': 'Default factory switch',
                  })}
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-success-foreground'>
                    Success
                  </p>
                  {SwitchFactory.success({
                    checked: true,
                    'aria-label': 'Success factory switch',
                  })}
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-warning-foreground'>
                    Warning
                  </p>
                  {SwitchFactory.warning({
                    checked: false,
                    'aria-label': 'Warning factory switch',
                  })}
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-destructive-foreground'>
                    Destructive
                  </p>
                  {SwitchFactory.destructive({
                    checked: false,
                    'aria-label': 'Destructive factory switch',
                  })}
                </div>
              </div>
            </div>

            {/* Density Variants */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Density Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Comfortable (Default)
                  </h4>
                  <div className='flex items-center justify-between rounded-lg border border-border bg-background p-4'>
                    <EnhancedLabel className='text-sm'>
                      Comfortable Spacing
                    </EnhancedLabel>
                    <EnhancedSwitch
                      checked={true}
                      density='comfortable'
                      aria-label='Comfortable density switch'
                    />
                  </div>
                </div>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Compact
                  </h4>
                  <div className='flex items-center justify-between rounded-lg border border-border bg-background p-4'>
                    <EnhancedLabel className='text-sm'>
                      Compact Spacing
                    </EnhancedLabel>
                    {SwitchFactory.compact({
                      checked: true,
                      'aria-label': 'Compact density switch',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* AAA Compliance Demo */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                AAA Accessibility Compliance
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg border border-border bg-background p-4'>
                  <div className='space-y-0.5'>
                    <EnhancedLabel className='text-sm font-medium'>
                      High Contrast Mode
                    </EnhancedLabel>
                    <p className='text-xs text-muted-foreground'>
                      Enhanced visibility for users with visual impairments
                    </p>
                  </div>
                  {SwitchFactory.aaa({
                    checked: true,
                    'aria-label': 'Enable high contrast mode',
                    'aria-description':
                      'Increases contrast ratios for better visibility',
                  })}
                </div>

                <div className='rounded-lg border border-border bg-background p-4 text-xs text-muted-foreground'>
                  <strong>AAA Features:</strong> Enhanced focus rings, increased
                  contrast ratios, proper ARIA attributes, keyboard navigation
                  support, and motion preference respect.
                </div>
              </div>
            </div>

            {/* Enhanced Switch Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                ✨ Enhanced Switch Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first philosophy with ethereal accents
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG harmony and systematic spacing
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Semantic color variants (success, warning, destructive)
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Multiple size variants (sm, default, lg)
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Density control (comfortable, compact)
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory functions for rapid development
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance mode
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass materials and smooth animations
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Slider Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Slider - Precision Control Components
            </h2>

            {/* Basic Slider Variants */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Semantic Slider Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Volume Control (Default)
                    </EnhancedLabel>
                    <EnhancedSlider
                      value={volumeLevel}
                      onValueChange={setVolumeLevel}
                      max={100}
                      step={1}
                      showValue
                      formatValue={SliderFormatters.percentage}
                      aria-label='Volume level'
                    />
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Success Progress
                    </EnhancedLabel>
                    {SliderFactory.success({
                      value: [85],
                      max: 100,
                      disabled: true,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Upload progress',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Warning Threshold
                    </EnhancedLabel>
                    {SliderFactory.warning({
                      value: [75],
                      max: 100,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Warning threshold',
                    })}
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Accent Slider
                    </EnhancedLabel>
                    {SliderFactory.accent({
                      value: brightnessLevel,
                      onValueChange: setBrightnessLevel,
                      max: 100,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Brightness level',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Destructive Limit
                    </EnhancedLabel>
                    {SliderFactory.destructive({
                      value: [90],
                      max: 100,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Critical threshold',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Quality Score
                    </EnhancedLabel>
                    <EnhancedSlider
                      value={qualityScore}
                      onValueChange={setQualityScore}
                      min={0}
                      max={10}
                      step={0.1}
                      showValue
                      formatValue={SliderFormatters.decimal(1)}
                      aria-label='Quality rating'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Size & Orientation Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Small Size
                  </h4>
                  <div className='space-y-3'>
                    {SliderFactory.small({
                      value: [25],
                      max: 100,
                      'aria-label': 'Small slider',
                    })}
                    {SliderFactory.small({
                      value: [50],
                      max: 100,
                      variant: 'success',
                      'aria-label': 'Small success slider',
                    })}
                    {SliderFactory.small({
                      value: [75],
                      max: 100,
                      variant: 'warning',
                      'aria-label': 'Small warning slider',
                    })}
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Default Size
                  </h4>
                  <div className='space-y-3'>
                    <EnhancedSlider
                      value={[25]}
                      max={100}
                      aria-label='Default slider'
                    />
                    <EnhancedSlider
                      value={[50]}
                      max={100}
                      variant='success'
                      aria-label='Default success slider'
                    />
                    <EnhancedSlider
                      value={[75]}
                      max={100}
                      variant='warning'
                      aria-label='Default warning slider'
                    />
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>
                    Large Size
                  </h4>
                  <div className='space-y-4'>
                    {SliderFactory.large({
                      value: [25],
                      max: 100,
                      'aria-label': 'Large slider',
                    })}
                    {SliderFactory.large({
                      value: [50],
                      max: 100,
                      variant: 'success',
                      'aria-label': 'Large success slider',
                    })}
                    {SliderFactory.large({
                      value: [75],
                      max: 100,
                      variant: 'warning',
                      'aria-label': 'Large warning slider',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Range Sliders & Advanced Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Range Sliders & Advanced Features
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Temperature Range (°C)
                    </EnhancedLabel>
                    {SliderFactory.range({
                      value: temperatureRange,
                      onValueChange: setTemperatureRange,
                      min: 10,
                      max: 35,
                      step: 1,
                      defaultValue: [20, 25],
                      showValue: true,
                      formatValue: SliderFormatters.unit('°C'),
                      'aria-label': 'Temperature range',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Price Range
                    </EnhancedLabel>
                    {SliderFactory.range({
                      value: priceRange,
                      onValueChange: setPriceRange,
                      min: 0,
                      max: 1000,
                      step: 50,
                      defaultValue: [100, 500],
                      showValue: true,
                      formatValue: SliderFormatters.currency,
                      'aria-label': 'Price range',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Stepped Progress
                    </EnhancedLabel>
                    {SliderFactory.stepped({
                      value: progressValue,
                      onValueChange: setProgressValue,
                      min: 0,
                      max: 100,
                      step: 10,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Progress in steps',
                    })}
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Liquid Glass Slider
                    </EnhancedLabel>
                    {SliderFactory.glass({
                      value: [60],
                      max: 100,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Glass effect slider',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Compact Density
                    </EnhancedLabel>
                    {SliderFactory.compact({
                      value: [40],
                      max: 100,
                      variant: 'accent',
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'Compact slider',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Time Slider (Minutes)
                    </EnhancedLabel>
                    <EnhancedSlider
                      value={[300]}
                      max={600}
                      min={0}
                      step={30}
                      showValue
                      formatValue={SliderFormatters.time}
                      aria-label='Duration in minutes and seconds'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility & AAA Compliance */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                🔓 AAA Accessibility Compliance
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      High Contrast Slider
                    </EnhancedLabel>
                    <p className='text-xs text-muted-foreground'>
                      Enhanced visibility with AAA compliance mode
                    </p>
                    {SliderFactory.aaa({
                      value: [60],
                      max: 100,
                      showValue: true,
                      formatValue: SliderFormatters.percentage,
                      'aria-label': 'High contrast slider',
                      'aria-description':
                        'AAA compliant slider with enhanced visibility',
                    })}
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Accessible Range
                    </EnhancedLabel>
                    <p className='text-xs text-muted-foreground'>
                      Multiple thumbs with proper ARIA support
                    </p>
                    <EnhancedSlider
                      value={[20, 80]}
                      min={0}
                      max={100}
                      aaaMode
                      showValue
                      formatValue={SliderFormatters.percentage}
                      aria-label='Accessible range slider'
                    />
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Keyboard Navigation
                    </EnhancedLabel>
                    <p className='text-xs text-muted-foreground'>
                      Use arrow keys, Home, End, Page Up/Down
                    </p>
                    <EnhancedSlider
                      value={[50]}
                      max={100}
                      step={5}
                      showValue
                      formatValue={SliderFormatters.percentage}
                      aria-label='Keyboard navigable slider'
                    />
                  </div>

                  <div className='space-y-2'>
                    <EnhancedLabel className='text-sm font-medium'>
                      Live Updates
                    </EnhancedLabel>
                    <p className='text-xs text-muted-foreground'>
                      Screen reader announcements for value changes
                    </p>
                    <EnhancedSlider
                      value={[75]}
                      max={100}
                      showValue
                      formatValue={SliderFormatters.percentage}
                      aria-label='Live updating slider'
                      aria-description='Announces value changes to screen readers'
                    />
                  </div>
                </div>
              </div>

              <div className='mt-6 rounded-lg border border-border bg-background p-4 text-xs text-muted-foreground'>
                <strong>AAA Features:</strong> Enhanced focus rings, proper ARIA
                labels and descriptions, keyboard navigation support, live
                region updates, high contrast mode compatibility, and motion
                preference respect.
              </div>
            </div>

            {/* Enhanced Slider Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                ✨ Enhanced Slider Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first philosophy with ethereal accents
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Platform-aware touch targets (44px minimum)
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Semantic color variants with sophisticated shadows
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Range sliders with multiple value support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Multiple size variants (sm, default, lg)
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Value formatters (percentage, currency, time, units)
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass materials with backdrop blur
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory functions for rapid development
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance mode
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Density control and step validation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Tabs Showcase - MAPS v2.2 Compliance */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Enhanced Tabs - Professional Navigation Controls
            </h2>
            <p className='text-muted-foreground'>
              Sophisticated navigation tabs with Radix UI primitives, MAPS v2.2
              design tokens, Apple HIG spacing, and comprehensive accessibility
              following dark-first philosophy.
            </p>

            {/* Basic Tab Variants */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Default Tabs */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Default Variant
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedTabsRoot defaultValue='overview' className='w-full'>
                    <EnhancedTabsList className='grid w-full grid-cols-3'>
                      <EnhancedTabsTrigger value='overview'>
                        Overview
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='details'>
                        Details
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='settings'>
                        Settings
                      </EnhancedTabsTrigger>
                    </EnhancedTabsList>
                    <EnhancedTabsContent value='overview' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Project Overview
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        This is the overview panel showing the default tab
                        variant. Features clean, professional styling with
                        proper focus indicators and WCAG AAA compliance.
                      </p>
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div className='rounded bg-accent/30 p-3'>
                          <div className='font-medium text-foreground'>
                            Status
                          </div>
                          <div className='text-muted-foreground'>Active</div>
                        </div>
                        <div className='rounded bg-accent/30 p-3'>
                          <div className='font-medium text-foreground'>
                            Progress
                          </div>
                          <div className='text-muted-foreground'>85%</div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='details' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Detailed Information
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Comprehensive details with MAPS v2.2 typography and
                        spacing. Enhanced tabs provide smooth transitions and
                        maintain focus state for accessibility.
                      </p>
                      <ul className='space-y-2 text-sm text-muted-foreground'>
                        <li>• Radix UI Tabs primitive foundation</li>
                        <li>• MAPS v2.2 design token integration</li>
                        <li>• Apple HIG interaction patterns</li>
                        <li>• Comprehensive keyboard navigation</li>
                      </ul>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='settings' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Configuration Options
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Settings panel demonstrating proper content organization
                        within tab containers. All interactions respect user
                        motion preferences.
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-foreground'>
                            Auto-save enabled
                          </span>
                          <div className='size-2 rounded-full bg-success' />
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-foreground'>
                            Dark mode
                          </span>
                          <div className='size-2 rounded-full bg-success' />
                        </div>
                      </div>
                    </EnhancedTabsContent>
                  </EnhancedTabsRoot>
                </div>
              </div>

              {/* Pills Variant */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Pills Variant
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedTabsRoot defaultValue='dashboard' className='w-full'>
                    <EnhancedTabsList
                      variant='pills'
                      className='grid w-full grid-cols-3'
                    >
                      <EnhancedTabsTrigger value='dashboard'>
                        Dashboard
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='analytics'>
                        Analytics
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='reports'>
                        Reports
                      </EnhancedTabsTrigger>
                    </EnhancedTabsList>
                    <EnhancedTabsContent
                      value='dashboard'
                      className='space-y-4'
                    >
                      <h4 className='text-sm font-medium text-foreground'>
                        Dashboard View
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Pills variant provides a more rounded, approachable
                        appearance. Perfect for modern applications requiring
                        softer visual hierarchy.
                      </p>
                      <div className='grid grid-cols-3 gap-3'>
                        <div className='rounded-lg bg-accent/20 p-3 text-center'>
                          <div className='text-lg font-semibold text-foreground'>
                            124
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            Users
                          </div>
                        </div>
                        <div className='rounded-lg bg-accent/20 p-3 text-center'>
                          <div className='text-lg font-semibold text-foreground'>
                            98%
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            Uptime
                          </div>
                        </div>
                        <div className='rounded-lg bg-accent/20 p-3 text-center'>
                          <div className='text-lg font-semibold text-foreground'>
                            256
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            Tasks
                          </div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent
                      value='analytics'
                      className='space-y-4'
                    >
                      <h4 className='text-sm font-medium text-foreground'>
                        Analytics Overview
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Advanced analytics with pill-style navigation. The pills
                        variant maintains all accessibility features while
                        providing enhanced visual appeal.
                      </p>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Page Views
                          </span>
                          <span className='text-foreground'>12,453</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Unique Visitors
                          </span>
                          <span className='text-foreground'>3,241</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            Conversion Rate
                          </span>
                          <span className='text-foreground'>4.2%</span>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='reports' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Reports Center
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Generate and manage reports with pill navigation
                        styling. All tab variants support the same rich content
                        patterns.
                      </p>
                      <div className='grid grid-cols-1 gap-2'>
                        <div className='flex items-center justify-between rounded border border-border/50 p-2'>
                          <span className='text-sm text-foreground'>
                            Monthly Report
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            Ready
                          </span>
                        </div>
                        <div className='flex items-center justify-between rounded border border-border/50 p-2'>
                          <span className='text-sm text-foreground'>
                            Weekly Summary
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            Generating
                          </span>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                  </EnhancedTabsRoot>
                </div>
              </div>

              {/* Underline Variant */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Underline Variant
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedTabsRoot defaultValue='profile' className='w-full'>
                    <EnhancedTabsList
                      variant='underline'
                      className='grid w-full grid-cols-4'
                    >
                      <EnhancedTabsTrigger value='profile'>
                        Profile
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='security'>
                        Security
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='preferences'>
                        Preferences
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='billing'>
                        Billing
                      </EnhancedTabsTrigger>
                    </EnhancedTabsList>
                    <EnhancedTabsContent value='profile' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Profile Information
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Underline variant provides clean, minimal navigation
                        perfect for content-heavy interfaces. Features subtle
                        underline indicator with smooth animations.
                      </p>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                          <div className='size-10 rounded-full bg-accent' />
                          <div>
                            <div className='text-sm font-medium text-foreground'>
                              John Doe
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              john@example.com
                            </div>
                          </div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='security' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Security Settings
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Comprehensive security configuration with underline
                        navigation. Maintains visual hierarchy while reducing
                        visual noise.
                      </p>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-foreground'>
                            Two-factor authentication
                          </span>
                          <div className='size-2 rounded-full bg-success' />
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-foreground'>
                            Password strength
                          </span>
                          <span className='text-xs text-success'>Strong</span>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent
                      value='preferences'
                      className='space-y-4'
                    >
                      <h4 className='text-sm font-medium text-foreground'>
                        User Preferences
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Customization options with elegant underline styling.
                        Perfect for settings interfaces requiring clean
                        navigation.
                      </p>
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <div className='font-medium text-foreground'>
                            Theme
                          </div>
                          <div className='text-muted-foreground'>Dark</div>
                        </div>
                        <div>
                          <div className='font-medium text-foreground'>
                            Language
                          </div>
                          <div className='text-muted-foreground'>English</div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='billing' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Billing & Plans
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Subscription management with clean underline navigation.
                        Maintains professional appearance for financial
                        interfaces.
                      </p>
                      <div className='rounded border border-border/50 p-3'>
                        <div className='font-medium text-foreground'>
                          Pro Plan
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          $29/month • Expires Dec 2024
                        </div>
                      </div>
                    </EnhancedTabsContent>
                  </EnhancedTabsRoot>
                </div>
              </div>

              {/* Glass Variant */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-foreground'>
                  Glass Variant
                </h3>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <EnhancedTabsRoot defaultValue='home' className='w-full'>
                    <EnhancedTabsList
                      variant='glass'
                      className='grid w-full grid-cols-3'
                    >
                      <EnhancedTabsTrigger value='home'>
                        Home
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='explore'>
                        Explore
                      </EnhancedTabsTrigger>
                      <EnhancedTabsTrigger value='library'>
                        Library
                      </EnhancedTabsTrigger>
                    </EnhancedTabsList>
                    <EnhancedTabsContent value='home' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Home Feed
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Glass variant features Apple-inspired liquid glass
                        materials with backdrop blur effects. Perfect for
                        modern, premium applications requiring sophisticated
                        aesthetics.
                      </p>
                      <div className='space-y-3'>
                        <div className='rounded-lg bg-accent/10 p-4 backdrop-blur-sm'>
                          <div className='text-sm font-medium text-foreground'>
                            Welcome back!
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            You have 3 new updates
                          </div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='explore' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Discover Content
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Exploration interface with glass navigation materials.
                        Liquid glass effects enhance the visual depth while
                        maintaining accessibility standards.
                      </p>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='rounded-lg bg-accent/5 p-3 backdrop-blur-sm'>
                          <div className='text-sm text-foreground'>
                            Trending
                          </div>
                        </div>
                        <div className='rounded-lg bg-accent/5 p-3 backdrop-blur-sm'>
                          <div className='text-sm text-foreground'>Recent</div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                    <EnhancedTabsContent value='library' className='space-y-4'>
                      <h4 className='text-sm font-medium text-foreground'>
                        Your Library
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        Personal library with sophisticated glass styling. All
                        liquid glass effects respect user motion preferences and
                        accessibility requirements.
                      </p>
                      <div className='space-y-2'>
                        <div className='rounded border border-border/30 bg-background/50 p-2 backdrop-blur-sm'>
                          <div className='text-sm text-foreground'>
                            Saved Items (24)
                          </div>
                        </div>
                        <div className='rounded border border-border/30 bg-background/50 p-2 backdrop-blur-sm'>
                          <div className='text-sm text-foreground'>
                            Favorites (8)
                          </div>
                        </div>
                      </div>
                    </EnhancedTabsContent>
                  </EnhancedTabsRoot>
                </div>
              </div>
            </div>

            {/* Factory Function Demonstrations */}
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-foreground'>
                Factory Function Patterns
              </h3>
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                {/* Navigation Tabs Factory */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    NavigationTabs Factory
                  </h4>
                  <div className='rounded-lg border border-border bg-card p-6'>
                    <div className='space-y-4'>
                      <h5 className='text-sm font-medium text-foreground'>
                        Simple Factory Pattern Demo
                      </h5>
                      <p className='text-sm text-muted-foreground'>
                        Factory functions provide consistent tab creation
                        patterns with automatic ARIA labeling and focus
                        management. Enhanced tabs support rapid development
                        workflows.
                      </p>
                      <div className='rounded bg-accent/20 p-3'>
                        <div className='text-xs text-muted-foreground'>
                          Factory functions simplify component creation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Factory Functions */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Specialized Factories
                  </h4>
                  <div className='space-y-4'>
                    {/* Factory Pattern Examples */}
                    <div className='rounded-lg border border-border bg-card p-4'>
                      <h5 className='mb-3 text-sm font-medium text-foreground'>
                        Enhanced Tab Patterns
                      </h5>
                      <p className='text-sm text-muted-foreground'>
                        Enhanced tabs support various configuration patterns for
                        rapid development and consistent styling across
                        applications.
                      </p>
                    </div>

                    {/* Enhanced Variant Examples */}
                    <div className='rounded-lg border border-border bg-card p-4'>
                      <h5 className='mb-3 text-sm font-medium text-foreground'>
                        Specialized Variants
                      </h5>
                      <EnhancedTabsRoot
                        defaultValue='design'
                        className='w-full'
                      >
                        <EnhancedTabsList
                          variant='pills'
                          className='grid w-full grid-cols-2'
                        >
                          <EnhancedTabsTrigger value='design'>
                            Design
                          </EnhancedTabsTrigger>
                          <EnhancedTabsTrigger value='code'>
                            Code
                          </EnhancedTabsTrigger>
                        </EnhancedTabsList>
                        <EnhancedTabsContent
                          value='design'
                          className='space-y-3'
                        >
                          <p className='text-sm text-muted-foreground'>
                            Pill-styled tabs with rounded aesthetics
                          </p>
                        </EnhancedTabsContent>
                        <EnhancedTabsContent value='code' className='space-y-3'>
                          <p className='text-sm text-muted-foreground'>
                            Implementation details and examples
                          </p>
                        </EnhancedTabsContent>
                      </EnhancedTabsRoot>
                    </div>

                    {/* Glass Effect Example */}
                    <div className='rounded-lg border border-border bg-card p-4'>
                      <h5 className='mb-3 text-sm font-medium text-foreground'>
                        Liquid Glass Materials
                      </h5>
                      <EnhancedTabsRoot
                        defaultValue='premium'
                        className='w-full'
                      >
                        <EnhancedTabsList
                          variant='glass'
                          className='grid w-full grid-cols-2'
                        >
                          <EnhancedTabsTrigger value='premium'>
                            Premium
                          </EnhancedTabsTrigger>
                          <EnhancedTabsTrigger value='materials'>
                            Materials
                          </EnhancedTabsTrigger>
                        </EnhancedTabsList>
                        <EnhancedTabsContent
                          value='premium'
                          className='space-y-3'
                        >
                          <p className='text-sm text-muted-foreground'>
                            Luxury glass materials for premium interfaces
                          </p>
                        </EnhancedTabsContent>
                        <EnhancedTabsContent
                          value='materials'
                          className='space-y-3'
                        >
                          <p className='text-sm text-muted-foreground'>
                            Advanced liquid glass effects
                          </p>
                        </EnhancedTabsContent>
                      </EnhancedTabsRoot>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility and Features */}
            <div className='space-y-6'>
              <h3 className='text-xl font-semibold text-foreground'>
                Accessibility & Advanced Features
              </h3>
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                {/* AAA Compliance Mode */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    AAA Compliance Mode
                  </h4>
                  <div className='rounded-lg border border-border bg-card p-6'>
                    <EnhancedTabsRoot
                      defaultValue='contrast'
                      className='w-full'
                    >
                      <EnhancedTabsList
                        aaaMode
                        className='grid w-full grid-cols-2'
                      >
                        <EnhancedTabsTrigger value='contrast'>
                          High Contrast
                        </EnhancedTabsTrigger>
                        <EnhancedTabsTrigger value='motion'>
                          Reduced Motion
                        </EnhancedTabsTrigger>
                      </EnhancedTabsList>
                      <EnhancedTabsContent
                        value='contrast'
                        className='space-y-4'
                      >
                        <h5 className='text-sm font-medium text-foreground'>
                          Enhanced Contrast
                        </h5>
                        <p className='text-sm text-muted-foreground'>
                          AAA mode ensures 7:1 contrast ratios for maximum
                          accessibility. All color combinations meet the highest
                          WCAG standards.
                        </p>
                        <div className='rounded bg-foreground/10 p-3'>
                          <div className='text-sm font-medium text-foreground'>
                            Contrast Ratio: 7.1:1
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            Exceeds WCAG AAA requirements
                          </div>
                        </div>
                      </EnhancedTabsContent>
                      <EnhancedTabsContent value='motion' className='space-y-4'>
                        <h5 className='text-sm font-medium text-foreground'>
                          Motion Preferences
                        </h5>
                        <p className='text-sm text-muted-foreground'>
                          Automatically respects user motion preferences. When
                          reduced motion is enabled, transitions become instant
                          while maintaining usability.
                        </p>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between text-sm'>
                            <span className='text-foreground'>
                              Prefers reduced motion
                            </span>
                            <span className='text-muted-foreground'>
                              Detected
                            </span>
                          </div>
                          <div className='flex items-center justify-between text-sm'>
                            <span className='text-foreground'>
                              Animation duration
                            </span>
                            <span className='text-muted-foreground'>0ms</span>
                          </div>
                        </div>
                      </EnhancedTabsContent>
                    </EnhancedTabsRoot>
                  </div>
                </div>

                {/* Keyboard Navigation */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Keyboard Navigation
                  </h4>
                  <div className='rounded-lg border border-border bg-card p-6'>
                    <EnhancedTabsRoot defaultValue='keys' className='w-full'>
                      <EnhancedTabsList className='grid w-full grid-cols-2'>
                        <EnhancedTabsTrigger value='keys'>
                          Key Bindings
                        </EnhancedTabsTrigger>
                        <EnhancedTabsTrigger value='focus'>
                          Focus Management
                        </EnhancedTabsTrigger>
                      </EnhancedTabsList>
                      <EnhancedTabsContent value='keys' className='space-y-4'>
                        <h5 className='text-sm font-medium text-foreground'>
                          Keyboard Shortcuts
                        </h5>
                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Arrow Keys
                            </span>
                            <span className='text-foreground'>
                              Navigate tabs
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Home/End
                            </span>
                            <span className='text-foreground'>
                              First/Last tab
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Enter/Space
                            </span>
                            <span className='text-foreground'>
                              Activate tab
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Tab</span>
                            <span className='text-foreground'>
                              Focus content
                            </span>
                          </div>
                        </div>
                      </EnhancedTabsContent>
                      <EnhancedTabsContent value='focus' className='space-y-4'>
                        <h5 className='text-sm font-medium text-foreground'>
                          Focus Indicators
                        </h5>
                        <p className='text-sm text-muted-foreground'>
                          Enhanced focus indicators exceed standard requirements
                          with 2px outlines and high contrast colors for maximum
                          visibility.
                        </p>
                        <div className='rounded border-2 border-accent bg-accent/10 p-3'>
                          <div className='text-sm text-foreground'>
                            Try tabbing through this interface to see enhanced
                            focus indicators in action
                          </div>
                        </div>
                      </EnhancedTabsContent>
                    </EnhancedTabsRoot>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Tabs Features Summary */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                ✨ Enhanced Tabs Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Radix UI Tabs primitive foundation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 design token integration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Four distinct visual variants
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Apple HIG interaction patterns
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Comprehensive keyboard navigation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory functions for rapid development
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance mode
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass material variants
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion preference respect
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced focus indicators
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Screen reader optimized ARIA
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Dark-first design philosophy
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Apple HIG Philosophy Section */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-semibold text-foreground'>
              Apple HIG Philosophy Integration
            </h2>
            <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
              <p className='text-foreground'>
                These Enhanced Components follow Apple&apos;s Human Interface
                Guidelines philosophy:
              </p>
              <ul className='space-y-2 text-muted-foreground'>
                <li>
                  • <strong>Calm & Sophisticated:</strong> No harsh contrasts or
                  aggressive colors
                </li>
                <li>
                  • <strong>User-Respectful:</strong> Gentle teal accents
                  instead of harsh blues
                </li>
                <li>
                  • <strong>Natural Hierarchy:</strong> Apple&apos;s system
                  color palette for semantic actions
                </li>
                <li>
                  • <strong>Accessible by Default:</strong> AAA compliance
                  built-in, not added later
                </li>
                <li>
                  • <strong>Systematic Spacing:</strong> 8pt grid system for
                  consistent rhythm
                </li>
                <li>
                  • <strong>Thoughtful Motion:</strong> Subtle, purposeful
                  animations that respect user preferences
                </li>
                <li>
                  • <strong>Platform-Aware:</strong> Automatic touch target
                  adjustment for mobile devices
                </li>
                <li>
                  • <strong>Liquid Glass Materials:</strong> Apple-inspired
                  backdrop blur effects
                </li>
              </ul>
            </div>
          </section>

          {/* Enhanced Toast Showcase */}
          <section className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Toast Notifications
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Sophisticated notification system with MAPS v2.2 compliance,
                Radix UI primitives, and Apple HIG design philosophy for calm,
                accessible user feedback
              </p>
            </div>

            {/* Toast Variants Grid */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Basic Toast Variants */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Semantic Variants
                </h3>
                <div className='space-y-4'>
                  <EnhancedButton
                    variant='primary'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'default',
                        'Default Notification',
                        'This is a standard system notification'
                      )
                    }
                  >
                    Show Default Toast
                  </EnhancedButton>

                  <EnhancedButton
                    variant='success'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'success',
                        'Success!',
                        'Your action was completed successfully'
                      )
                    }
                    icon={<Check className='size-4' />}
                  >
                    Show Success Toast
                  </EnhancedButton>

                  <EnhancedButton
                    variant='error'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'error',
                        'Error Occurred',
                        'Please try again or contact support'
                      )
                    }
                    icon={<X className='size-4' />}
                  >
                    Show Error Toast
                  </EnhancedButton>

                  <EnhancedButton
                    variant='warning'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'warning',
                        'Warning',
                        'Please review your input before proceeding'
                      )
                    }
                    icon={<AlertTriangle className='size-4' />}
                  >
                    Show Warning Toast
                  </EnhancedButton>

                  <EnhancedButton
                    variant='outline'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'info',
                        'Information',
                        "Here's some helpful information for you"
                      )
                    }
                    icon={<Info className='size-4' />}
                  >
                    Show Info Toast
                  </EnhancedButton>
                </div>
              </div>

              {/* Factory Pattern Examples */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Factory Patterns
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-foreground'>
                      Glass Materials
                    </h4>
                    <EnhancedButton
                      variant='secondary'
                      className='w-full'
                      onClick={() => {
                        // Factory toast would be shown here in actual implementation
                        showToast(
                          'info',
                          'Glass Toast',
                          'Beautiful liquid glass materials with backdrop blur'
                        );
                      }}
                    >
                      Glass Toast Factory
                    </EnhancedButton>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-foreground'>
                      AAA Compliance
                    </h4>
                    <EnhancedButton
                      variant='secondary'
                      className='w-full'
                      onClick={() => {
                        showToast(
                          'success',
                          'AAA Toast',
                          'High contrast, 7:1 ratio guaranteed'
                        );
                      }}
                    >
                      AAA Compliance Factory
                    </EnhancedButton>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-foreground'>
                      Compact Density
                    </h4>
                    <EnhancedButton
                      variant='secondary'
                      className='w-full'
                      onClick={() => {
                        showToast(
                          'info',
                          'Compact',
                          'Space-efficient notification'
                        );
                      }}
                    >
                      Compact Factory
                    </EnhancedButton>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-foreground'>
                      Quick Semantics
                    </h4>
                    <div className='flex gap-2'>
                      <EnhancedButton
                        size='sm'
                        variant='success'
                        onClick={() => {
                          showToast(
                            'success',
                            'Success',
                            'Quick success notification'
                          );
                        }}
                      >
                        Success
                      </EnhancedButton>
                      <EnhancedButton
                        size='sm'
                        variant='error'
                        onClick={() => {
                          showToast(
                            'error',
                            'Error',
                            'Quick error notification'
                          );
                        }}
                      >
                        Error
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Examples */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Interactive Examples
                </h3>
                <div className='space-y-4'>
                  <EnhancedButton
                    variant='primary'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'success',
                        'Form Saved',
                        'Your changes have been saved successfully. You can continue editing or view the saved version.'
                      )
                    }
                  >
                    Simulate Form Save
                  </EnhancedButton>

                  <EnhancedButton
                    variant='error'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'error',
                        'Connection Lost',
                        'Unable to connect to the server. Please check your internet connection and try again.'
                      )
                    }
                  >
                    Simulate Connection Error
                  </EnhancedButton>

                  <EnhancedButton
                    variant='warning'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'warning',
                        'Session Expiring',
                        'Your session will expire in 5 minutes. Please save your work.'
                      )
                    }
                  >
                    Simulate Session Warning
                  </EnhancedButton>

                  <EnhancedButton
                    variant='outline'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'info',
                        'New Feature Available',
                        'Check out our new dark mode theme in settings!'
                      )
                    }
                  >
                    Feature Announcement
                  </EnhancedButton>
                </div>
              </div>

              {/* Complex Toast Examples */}
              <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Complex Notifications
                </h3>
                <div className='space-y-4'>
                  <div className='rounded-lg border border-border/50 bg-muted/30 p-4'>
                    <h4 className='mb-2 text-sm font-medium text-foreground'>
                      Manual Toast Composition
                    </h4>
                    <p className='mb-3 text-xs text-muted-foreground'>
                      Example of manually composed toast with all elements
                    </p>
                    <div className='rounded border border-border bg-card p-3 font-mono text-xs'>
                      {`<EnhancedToast variant="success">
  {getToastIcon('success')}
  <div className="flex-1">
    <EnhancedToastTitle>Operation Complete</EnhancedToastTitle>
    <EnhancedToastDescription>
      Your file has been uploaded successfully
    </EnhancedToastDescription>
  </div>
  <EnhancedToastAction altText="View file">
    View
  </EnhancedToastAction>
  <EnhancedToastClose />
</EnhancedToast>`}
                    </div>
                  </div>

                  <EnhancedButton
                    variant='secondary'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'success',
                        'File Upload Complete',
                        'Your document has been uploaded and is ready for review. Click to view the uploaded file.'
                      )
                    }
                  >
                    Show Complex Success Toast
                  </EnhancedButton>

                  <EnhancedButton
                    variant='outline'
                    className='w-full'
                    onClick={() =>
                      showToast(
                        'info',
                        'Multiple Actions Available',
                        'You can either save your progress, continue editing, or share with collaborators.'
                      )
                    }
                  >
                    Multi-Action Toast
                  </EnhancedButton>
                </div>
              </div>
            </div>

            {/* Toast Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-semibold text-foreground'>
                ✨ Enhanced Toast Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Radix UI Toast primitives foundation
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Complete semantic variant system
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass materials and vibrancy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory pattern for quick composition
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance mode
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Semantic icon system integration
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Keyboard navigation and screen reader support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Auto-dismiss with manual override
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion-reduce animation support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Touch-friendly close and action buttons
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Provider-based global state management
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 design token compliance
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Active Toasts Display */}
            {toasts.length > 0 && (
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-4 text-lg font-semibold text-foreground'>
                  Active Toast Queue
                </h3>
                <div className='space-y-2'>
                  {toasts.map(toast => (
                    <div
                      key={toast.id}
                      className='flex items-center justify-between rounded-md border border-border/50 bg-muted/30 p-3'
                    >
                      <div className='flex items-center gap-2'>
                        {toast.variant !== 'default' &&
                          getToastIcon(toast.variant)}
                        <div>
                          <p className='text-sm font-medium text-foreground'>
                            {toast.title}
                          </p>
                          {toast.description && (
                            <p className='text-xs text-muted-foreground'>
                              {toast.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <EnhancedButton
                        size='sm'
                        variant='ghost'
                        onClick={() => removeToast(toast.id)}
                        icon={<X className='size-3' />}
                        iconPosition='only'
                        aria-label={`Dismiss ${toast.title} notification`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Enhanced Toggle Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Toggle Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional toggle buttons with MAPS v2.2 dark-first
                philosophy, comprehensive variant support, factory patterns, and
                AAA accessibility compliance
              </p>
            </div>

            {/* Basic Toggle Variants */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Basic Toggle Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Default
                  </h4>
                  <div className='space-y-3'>
                    <EnhancedToggle
                      pressed={playbackToggled}
                      onPressedChange={setPlaybackToggled}
                      aria-label='Toggle playback'
                    >
                      <Play className='size-4' />
                    </EnhancedToggle>
                    <EnhancedToggle
                      pressed={muteToggled}
                      onPressedChange={setMuteToggled}
                      aria-label='Toggle mute'
                    >
                      {ToggleIcons.muteUnmute(muteToggled)}
                    </EnhancedToggle>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Outline
                  </h4>
                  <div className='space-y-3'>
                    <EnhancedToggle
                      variant='outline'
                      pressed={bookmarkToggled}
                      onPressedChange={setBookmarkToggled}
                      aria-label='Toggle bookmark'
                    >
                      {ToggleIcons.bookmark(bookmarkToggled)}
                    </EnhancedToggle>
                    <EnhancedToggle
                      variant='outline'
                      pressed={favoriteToggled}
                      onPressedChange={setFavoriteToggled}
                      aria-label='Toggle favorite'
                    >
                      {ToggleIcons.heart(favoriteToggled)}
                    </EnhancedToggle>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>Ghost</h4>
                  <div className='space-y-3'>
                    <EnhancedToggle
                      variant='ghost'
                      pressed={visibilityToggled}
                      onPressedChange={setVisibilityToggled}
                      aria-label='Toggle visibility'
                    >
                      {ToggleIcons.visibility(visibilityToggled)}
                    </EnhancedToggle>
                    <EnhancedToggle
                      variant='ghost'
                      pressed={featureToggled}
                      onPressedChange={setFeatureToggled}
                      aria-label='Toggle feature'
                    >
                      <Settings className='size-4' />
                    </EnhancedToggle>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Variants */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Size Variants
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>Small</h4>
                  <EnhancedToggle
                    size='sm'
                    pressed={false}
                    aria-label='Small toggle'
                  >
                    <Plus className='size-3' />
                  </EnhancedToggle>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Medium
                  </h4>
                  <EnhancedToggle
                    size='default'
                    pressed={false}
                    aria-label='Medium toggle'
                  >
                    <Settings className='size-4' />
                  </EnhancedToggle>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>Large</h4>
                  <EnhancedToggle
                    size='lg'
                    pressed={false}
                    aria-label='Large toggle'
                  >
                    <User className='size-5' />
                  </EnhancedToggle>
                </div>
              </div>
            </div>

            {/* Liquid Glass Materials */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Liquid Glass Materials
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Standard
                  </h4>
                  <EnhancedToggle
                    liquidGlass={false}
                    pressed={false}
                    aria-label='Standard toggle'
                  >
                    <Mail className='size-4' />
                  </EnhancedToggle>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-lg font-medium text-foreground'>
                    Liquid Glass
                  </h4>
                  <EnhancedToggle
                    liquidGlass={true}
                    pressed={false}
                    aria-label='Liquid glass toggle'
                  >
                    <Lock className='size-4' />
                  </EnhancedToggle>
                </div>
              </div>
            </div>

            {/* Factory Functions */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Factory Functions
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    Default Toggle
                  </h4>
                  <div className='flex justify-center'>
                    {ToggleFactory.default({
                      pressed: false,
                      'aria-label': 'Default toggle',
                      children: <Settings className='size-4' />,
                    })}
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Semantic default styling
                  </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    Outline Toggle
                  </h4>
                  <div className='flex justify-center'>
                    {ToggleFactory.outline({
                      pressed: favoriteToggled,
                      onPressedChange: setFavoriteToggled,
                      'aria-label': 'Favorite toggle',
                      children: ToggleIcons.heart(favoriteToggled),
                    })}
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Clean outline styling
                  </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    Ghost Toggle
                  </h4>
                  <div className='flex justify-center'>
                    {ToggleFactory.ghost({
                      pressed: visibilityToggled,
                      onPressedChange: setVisibilityToggled,
                      'aria-label': 'Visibility toggle',
                      children: ToggleIcons.visibility(visibilityToggled),
                    })}
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Minimal ghost styling
                  </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    Success Toggle
                  </h4>
                  <div className='flex justify-center'>
                    {ToggleFactory.success({
                      pressed: false,
                      'aria-label': 'Success toggle',
                      children: <Check className='size-4' />,
                    })}
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Success state styling
                  </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    AAA Mode Toggle
                  </h4>
                  <div className='flex justify-center'>
                    {ToggleFactory.aaa({
                      pressed: false,
                      'aria-label': 'AAA accessible toggle',
                      children: <User className='size-4' />,
                    })}
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Enhanced accessibility
                  </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    Liquid Glass Toggle
                  </h4>
                  <div className='flex justify-center'>
                    {ToggleFactory.glass({
                      pressed: false,
                      'aria-label': 'Glass material toggle',
                      children: <Eye className='size-4' />,
                    })}
                  </div>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    Sophisticated glass material
                  </p>
                </div>
              </div>
            </div>

            {/* Hook Demonstrations */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                Enhanced Hooks
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    useEnhancedToggle Hook
                  </h4>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <EnhancedToggle
                        pressed={playPauseToggle.pressed}
                        onPressedChange={playPauseToggle.setPressed}
                        aria-label={playPauseToggle.pressed ? 'Pause' : 'Play'}
                      >
                        {ToggleIcons.playPause(playPauseToggle.pressed)}
                      </EnhancedToggle>
                      <span className='text-sm text-foreground'>
                        Playback:{' '}
                        {playPauseToggle.pressed ? 'Playing' : 'Paused'}
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <EnhancedToggle
                        pressed={muteToggle.pressed}
                        onPressedChange={muteToggle.setPressed}
                        aria-label={muteToggle.pressed ? 'Unmute' : 'Mute'}
                      >
                        {ToggleIcons.muteUnmute(muteToggle.pressed)}
                      </EnhancedToggle>
                      <span className='text-sm text-foreground'>
                        Audio: {muteToggle.pressed ? 'Muted' : 'Unmuted'}
                      </span>
                    </div>
                  </div>
                  <p className='mt-4 text-sm text-muted-foreground'>
                    Hook-based state management with enhanced features
                  </p>
                </div>

                <div className='rounded-lg border border-border bg-card p-6'>
                  <h4 className='mb-4 text-lg font-medium text-foreground'>
                    Toggle Group Hook
                  </h4>
                  <div className='space-y-4'>
                    <div>
                      <p className='mb-2 text-sm text-muted-foreground'>
                        View Mode (Single Selection):
                      </p>
                      <div className='flex gap-1'>
                        <EnhancedToggle
                          pressed={viewModeGroup.isSelected('list')}
                          onPressedChange={() =>
                            viewModeGroup.toggleItem('list')
                          }
                          variant='outline'
                          size='sm'
                          aria-label='List view'
                        >
                          List
                        </EnhancedToggle>
                        <EnhancedToggle
                          pressed={viewModeGroup.isSelected('grid')}
                          onPressedChange={() =>
                            viewModeGroup.toggleItem('grid')
                          }
                          variant='outline'
                          size='sm'
                          aria-label='Grid view'
                        >
                          Grid
                        </EnhancedToggle>
                        <EnhancedToggle
                          pressed={viewModeGroup.isSelected('card')}
                          onPressedChange={() =>
                            viewModeGroup.toggleItem('card')
                          }
                          variant='outline'
                          size='sm'
                          aria-label='Card view'
                        >
                          Card
                        </EnhancedToggle>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Current: {viewModeGroup.value || 'None'}
                      </p>
                    </div>

                    <div>
                      <p className='mb-2 text-sm text-muted-foreground'>
                        Tools (Multiple Selection):
                      </p>
                      <div className='flex gap-1'>
                        <EnhancedToggle
                          pressed={toolsGroup.isSelected('brush')}
                          onPressedChange={() => toolsGroup.toggleItem('brush')}
                          variant='outline'
                          size='sm'
                          aria-label='Brush tool'
                        >
                          Brush
                        </EnhancedToggle>
                        <EnhancedToggle
                          pressed={toolsGroup.isSelected('eraser')}
                          onPressedChange={() =>
                            toolsGroup.toggleItem('eraser')
                          }
                          variant='outline'
                          size='sm'
                          aria-label='Eraser tool'
                        >
                          Eraser
                        </EnhancedToggle>
                        <EnhancedToggle
                          pressed={toolsGroup.isSelected('select')}
                          onPressedChange={() =>
                            toolsGroup.toggleItem('select')
                          }
                          variant='outline'
                          size='sm'
                          aria-label='Select tool'
                        >
                          Select
                        </EnhancedToggle>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        Active:{' '}
                        {Array.isArray(toolsGroup.value)
                          ? toolsGroup.value.join(', ')
                          : 'None'}
                      </p>
                    </div>
                  </div>
                  <p className='mt-4 text-sm text-muted-foreground'>
                    Group management with single and multiple selection
                  </p>
                </div>
              </div>
            </div>

            {/* AAA Accessibility Mode */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-semibold text-foreground'>
                AAA Accessibility Mode
              </h3>
              <div className='rounded-lg border border-border bg-card p-6'>
                <h4 className='mb-4 text-lg font-medium text-foreground'>
                  Enhanced Accessibility Features
                </h4>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <h5 className='text-sm font-medium text-foreground'>
                      Standard Toggles
                    </h5>
                    <div className='flex gap-2'>
                      <EnhancedToggle
                        pressed={false}
                        aria-label='Standard toggle'
                      >
                        <Settings className='size-4' />
                      </EnhancedToggle>
                      <EnhancedToggle
                        variant='outline'
                        pressed={false}
                        aria-label='Outline toggle'
                      >
                        <User className='size-4' />
                      </EnhancedToggle>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Standard contrast ratios
                    </p>
                  </div>

                  <div className='space-y-4'>
                    <h5 className='text-sm font-medium text-foreground'>
                      AAA Enhanced Toggles
                    </h5>
                    <div className='flex gap-2'>
                      <EnhancedToggle
                        aaaMode
                        pressed={false}
                        aria-label='AAA standard toggle'
                      >
                        <Settings className='size-4' />
                      </EnhancedToggle>
                      <EnhancedToggle
                        aaaMode
                        variant='outline'
                        pressed={false}
                        aria-label='AAA outline toggle'
                      >
                        <User className='size-4' />
                      </EnhancedToggle>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Enhanced contrast for accessibility compliance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Toggle Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Enhanced Toggle Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      7 comprehensive variants with semantic meaning
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      4 size options including touch-friendly
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass materials and vibrancy
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory pattern for semantic construction
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Enhanced hooks for state management
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance mode
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Full keyboard navigation support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Screen reader optimized ARIA attributes
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Icon system with semantic context
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Group management for related toggles
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion-reduced animation support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 design token compliance
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced NavigationMenu Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Navigation Menu
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Apple HIG-compliant navigation menus with liquid glass
                materials, platform-aware interactions, and comprehensive
                accessibility support
              </p>
            </div>

            <NavigationMenuDemo />
          </section>

          {/* Enhanced MenuBar Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Menu Bar
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional desktop-style menu bars with MAPS v2.2 dark-first
                philosophy, liquid glass materials, and comprehensive
                accessibility support
              </p>
            </div>

            <MenuBarDemo />
          </section>

          {/* Enhanced Collapsible Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Collapsible Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Sophisticated collapsible content with MAPS v2.2 dark-first
                philosophy, liquid glass materials, and comprehensive
                accessibility support
              </p>
            </div>
            <CollapsibleDemo />
          </section>

          {/* Enhanced Progress Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Progress Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional progress indicators with MAPS v2.2 dark-first
                philosophy, liquid glass materials, AAA accessibility
                compliance, and comprehensive variant support
              </p>
            </div>
            <ProgressDemo />
          </section>

          {/* Enhanced Skeleton Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Skeleton Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Sophisticated loading placeholders with MAPS v2.2 dark-first
                philosophy, smooth animations, comprehensive variant support,
                and AAA accessibility compliance
              </p>
            </div>

            {/* Basic Skeleton Variants */}
            <div className='space-y-8'>
              <div className='space-y-6'>
                <h3 className='text-xl font-medium text-foreground'>
                  Basic Skeleton Variants
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  {/* Text Skeleton */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Text Lines
                    </h4>
                    <div className='space-y-2 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton variant='text' size='lg' width='100%' />
                      <EnhancedSkeleton variant='text' size='md' width='90%' />
                      <EnhancedSkeleton variant='text' size='md' width='75%' />
                      <EnhancedSkeleton variant='text' size='sm' width='85%' />
                    </div>
                  </div>

                  {/* Avatar Skeleton */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Avatars
                    </h4>
                    <div className='space-y-4 rounded-lg border border-border bg-card p-4'>
                      <div className='flex items-center space-x-3'>
                        <EnhancedSkeleton variant='avatar' size='sm' />
                        <div className='flex-1 space-y-1'>
                          <EnhancedSkeleton
                            variant='text'
                            size='sm'
                            width='60%'
                          />
                          <EnhancedSkeleton
                            variant='text'
                            size='sm'
                            width='40%'
                          />
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <EnhancedSkeleton variant='avatar' size='md' />
                        <div className='flex-1 space-y-2'>
                          <EnhancedSkeleton
                            variant='text'
                            size='md'
                            width='70%'
                          />
                          <EnhancedSkeleton
                            variant='text'
                            size='sm'
                            width='45%'
                          />
                        </div>
                      </div>
                      <div className='flex items-center space-x-3'>
                        <EnhancedSkeleton variant='avatar' size='lg' />
                        <div className='flex-1 space-y-2'>
                          <EnhancedSkeleton
                            variant='text'
                            size='lg'
                            width='80%'
                          />
                          <EnhancedSkeleton
                            variant='text'
                            size='md'
                            width='55%'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Buttons
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='button'
                        size='sm'
                        width='80px'
                      />
                      <EnhancedSkeleton
                        variant='button'
                        size='md'
                        width='120px'
                      />
                      <EnhancedSkeleton
                        variant='button'
                        size='lg'
                        width='140px'
                      />
                      <EnhancedSkeleton
                        variant='button'
                        size='xl'
                        width='160px'
                      />
                    </div>
                  </div>

                  {/* Badge Skeleton */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Badges
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <div className='flex items-center space-x-2'>
                        <EnhancedSkeleton
                          variant='text'
                          size='md'
                          width='100px'
                        />
                        <EnhancedSkeleton variant='badge' size='sm' />
                      </div>
                      <div className='flex items-center space-x-2'>
                        <EnhancedSkeleton
                          variant='text'
                          size='md'
                          width='120px'
                        />
                        <EnhancedSkeleton variant='badge' size='md' />
                      </div>
                      <div className='flex items-center space-x-2'>
                        <EnhancedSkeleton
                          variant='text'
                          size='md'
                          width='80px'
                        />
                        <EnhancedSkeleton variant='badge' size='lg' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animation Variants */}
              <div className='space-y-6'>
                <h3 className='text-xl font-medium text-foreground'>
                  Animation Variants
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  {/* Pulse Animation */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Pulse Animation
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        animation='pulse'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        animation='pulse'
                        width='85%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        animation='pulse'
                        width='70%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          animation='pulse'
                        />
                        <EnhancedSkeleton
                          variant='button'
                          size='sm'
                          animation='pulse'
                          width='80px'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wave Animation */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Wave Animation
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        animation='wave'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        animation='wave'
                        width='85%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        animation='wave'
                        width='70%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          animation='wave'
                        />
                        <EnhancedSkeleton
                          variant='button'
                          size='sm'
                          animation='wave'
                          width='80px'
                        />
                      </div>
                    </div>
                  </div>

                  {/* No Animation */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      No Animation
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        animation='none'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        animation='none'
                        width='85%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        animation='none'
                        width='70%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          animation='none'
                        />
                        <EnhancedSkeleton
                          variant='button'
                          size='sm'
                          animation='none'
                          width='80px'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Surface Materials */}
              <div className='space-y-6'>
                <h3 className='text-xl font-medium text-foreground'>
                  Liquid Glass Materials
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  {/* Elevated Surface */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Elevated
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        surface='elevated'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        surface='elevated'
                        width='75%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          surface='elevated'
                        />
                        <EnhancedSkeleton
                          variant='badge'
                          size='md'
                          surface='elevated'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Panel Surface */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Panel
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        surface='panel'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        surface='panel'
                        width='75%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          surface='panel'
                        />
                        <EnhancedSkeleton
                          variant='badge'
                          size='md'
                          surface='panel'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Glass Surface */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Glass
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        surface='glass'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        surface='glass'
                        width='75%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          surface='glass'
                        />
                        <EnhancedSkeleton
                          variant='badge'
                          size='md'
                          surface='glass'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating Surface */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Floating
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        variant='text'
                        surface='floating'
                        width='100%'
                      />
                      <EnhancedSkeleton
                        variant='text'
                        surface='floating'
                        width='75%'
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          variant='avatar'
                          size='md'
                          surface='floating'
                        />
                        <EnhancedSkeleton
                          variant='badge'
                          size='md'
                          surface='floating'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compound Components */}
              <div className='space-y-6'>
                <h3 className='text-xl font-medium text-foreground'>
                  Compound Components
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {/* Text Lines */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Text Lines
                    </h4>
                    <div className='rounded-lg border border-border bg-card p-4'>
                      <SkeletonTextLines lines={4} lastLineWidth='60%' />
                    </div>
                  </div>

                  {/* Card Skeleton */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Card
                    </h4>
                    <div className='rounded-lg border border-border bg-card'>
                      <SkeletonCard showAvatar={true} showFooter={true} />
                    </div>
                  </div>

                  {/* Table Skeleton */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Table
                    </h4>
                    <div className='rounded-lg border border-border bg-card p-4'>
                      <SkeletonTable rows={4} columns={3} showHeader={true} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Factory Patterns */}
              <div className='space-y-6'>
                <h3 className='text-xl font-medium text-foreground'>
                  Factory Pattern Examples
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {/* Text Line Factory */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Text Line Factory
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton {...SkeletonFactory.textLine()} />
                      <EnhancedSkeleton
                        {...SkeletonFactory.textLine({ width: '85%' })}
                      />
                      <EnhancedSkeleton
                        {...SkeletonFactory.textLine({ width: '70%' })}
                      />
                    </div>
                  </div>

                  {/* Avatar Factory */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      Avatar Factory
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <div className='flex items-center space-x-3'>
                        <EnhancedSkeleton {...SkeletonFactory.avatar()} />
                        <div className='flex-1 space-y-2'>
                          <EnhancedSkeleton
                            {...SkeletonFactory.textLine({ width: '70%' })}
                          />
                          <EnhancedSkeleton
                            {...SkeletonFactory.textLine({
                              width: '45%',
                              size: 'sm',
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accessible Factory */}
                  <div className='space-y-4'>
                    <h4 className='text-lg font-medium text-foreground'>
                      AAA Compliance
                    </h4>
                    <div className='space-y-3 rounded-lg border border-border bg-card p-4'>
                      <EnhancedSkeleton
                        {...SkeletonFactory.accessible({
                          variant: 'text',
                          width: '100%',
                        })}
                      />
                      <EnhancedSkeleton
                        {...SkeletonFactory.accessible({
                          variant: 'text',
                          width: '80%',
                        })}
                      />
                      <div className='flex items-center space-x-3 pt-2'>
                        <EnhancedSkeleton
                          {...SkeletonFactory.accessible({
                            variant: 'avatar',
                            size: 'md',
                          })}
                        />
                        <EnhancedSkeleton
                          {...SkeletonFactory.accessible({
                            variant: 'button',
                            size: 'sm',
                            width: '100px',
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Skeleton Features */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-lg font-medium text-foreground'>
                Enhanced Skeleton Features
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      7 semantic variants for different content types
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Multiple size options with responsive scaling
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      3 animation types including shimmer wave
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Liquid glass materials and surface variants
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Factory patterns for consistent construction
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Compound components for complex layouts
                    </span>
                  </li>
                </ul>
                <ul className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      AAA accessibility compliance mode
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Motion-reduced animation support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Screen reader optimized ARIA attributes
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Polymorphic rendering with asChild support
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      Custom width and height configuration
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='size-4 shrink-0 text-success' />
                    <span className='text-foreground'>
                      MAPS v2.2 design token compliance
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Enhanced Pagination Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Pagination Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional pagination components with MAPS v2.2 dark-first
                philosophy, Apple HIG interaction patterns, AAA accessibility
                compliance, and liquid glass materials
              </p>
            </div>

            {/* Complete Pagination Demo */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-xl font-semibold text-foreground'>
                Complete Pagination
              </h3>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Default Pagination
                  </h4>
                  <EnhancedPaginationComplete
                    currentPage={3}
                    totalPages={10}
                    onPageChange={page => console.log('Page:', page)}
                  />
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Pills Variant
                  </h4>
                  <EnhancedPaginationComplete
                    currentPage={5}
                    totalPages={12}
                    itemVariant='pills'
                    onPageChange={page => console.log('Page:', page)}
                  />
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Large Size with AAA Compliance
                  </h4>
                  <EnhancedPaginationComplete
                    currentPage={2}
                    totalPages={8}
                    size='lg'
                    aaaMode
                    itemVariant='default'
                    onPageChange={page => console.log('Page:', page)}
                  />
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Compact with Custom Labels
                  </h4>
                  <EnhancedPaginationComplete
                    currentPage={1}
                    totalPages={5}
                    size='sm'
                    itemVariant='minimal'
                    labels={{
                      previous: '← Prev',
                      next: 'Next →',
                      first: '⟪',
                      last: '⟫',
                    }}
                    onPageChange={page => console.log('Page:', page)}
                  />
                </div>
              </div>
            </div>

            {/* Factory Patterns Demo */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-xl font-semibold text-foreground'>
                Factory Patterns
              </h3>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Default Factory
                  </h4>
                  <PaginationFactory.default.Root>
                    <PaginationFactory.default.Item>
                      1
                    </PaginationFactory.default.Item>
                    <PaginationFactory.default.Item isCurrent page={2}>
                      2
                    </PaginationFactory.default.Item>
                    <PaginationFactory.default.Item>
                      3
                    </PaginationFactory.default.Item>
                    <PaginationFactory.default.Ellipsis />
                    <PaginationFactory.default.Item>
                      10
                    </PaginationFactory.default.Item>
                  </PaginationFactory.default.Root>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Pills Factory
                  </h4>
                  <PaginationFactory.pills.Root>
                    <PaginationFactory.pills.Item>
                      1
                    </PaginationFactory.pills.Item>
                    <PaginationFactory.pills.Item isCurrent page={2}>
                      2
                    </PaginationFactory.pills.Item>
                    <PaginationFactory.pills.Item>
                      3
                    </PaginationFactory.pills.Item>
                    <PaginationFactory.pills.Ellipsis />
                    <PaginationFactory.pills.Item>
                      10
                    </PaginationFactory.pills.Item>
                  </PaginationFactory.pills.Root>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    AAA Compliant Factory
                  </h4>
                  <PaginationFactory.aaa.Root>
                    <PaginationFactory.aaa.Item>1</PaginationFactory.aaa.Item>
                    <PaginationFactory.aaa.Item isCurrent page={2}>
                      2
                    </PaginationFactory.aaa.Item>
                    <PaginationFactory.aaa.Item>3</PaginationFactory.aaa.Item>
                    <PaginationFactory.aaa.Ellipsis />
                    <PaginationFactory.aaa.Item>10</PaginationFactory.aaa.Item>
                  </PaginationFactory.aaa.Root>
                </div>
              </div>
            </div>

            {/* Custom Composition Demo */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-xl font-semibold text-foreground'>
                Custom Composition
              </h3>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Custom Navigation with Router Links
                  </h4>
                  <EnhancedPagination.Root variant='spaced'>
                    <EnhancedPagination.Item asChild>
                      <a href='/page/1' className='no-underline'>
                        1
                      </a>
                    </EnhancedPagination.Item>
                    <EnhancedPagination.Item isCurrent page={2}>
                      2
                    </EnhancedPagination.Item>
                    <EnhancedPagination.Item asChild>
                      <a href='/page/3' className='no-underline'>
                        3
                      </a>
                    </EnhancedPagination.Item>
                    <EnhancedPagination.Ellipsis />
                    <EnhancedPagination.Item asChild>
                      <a href='/page/10' className='no-underline'>
                        10
                      </a>
                    </EnhancedPagination.Item>
                  </EnhancedPagination.Root>
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Liquid Glass with Vibrancy
                  </h4>
                  <EnhancedPagination.Root variant='pills'>
                    <EnhancedPagination.Item vibrancy='glass'>
                      1
                    </EnhancedPagination.Item>
                    <EnhancedPagination.Item
                      vibrancy='glass'
                      isCurrent
                      page={2}
                    >
                      2
                    </EnhancedPagination.Item>
                    <EnhancedPagination.Item vibrancy='glass'>
                      3
                    </EnhancedPagination.Item>
                    <EnhancedPagination.Ellipsis />
                    <EnhancedPagination.Item vibrancy='glass'>
                      10
                    </EnhancedPagination.Item>
                  </EnhancedPagination.Root>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className='rounded-lg border border-border bg-card p-6'>
              <h3 className='mb-4 text-xl font-semibold text-foreground'>
                Technical Implementation
              </h3>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h4 className='mb-3 text-lg font-medium text-foreground'>
                    MAPS v2.2 Features
                  </h4>
                  <ul className='space-y-2'>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Dark-first foundation with ethereal accents
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Apple HIG interaction patterns
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Systematic 8pt grid spacing
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Platform-aware touch targets (44px minimum)
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className='mb-3 text-lg font-medium text-foreground'>
                    Accessibility & Performance
                  </h4>
                  <ul className='space-y-2'>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        WCAG AAA compliance with enforced mode
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Comprehensive keyboard navigation
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Optimized pagination range calculation
                      </span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <Check className='size-4 shrink-0 text-success' />
                      <span className='text-foreground'>
                        Polymorphic asChild pattern support
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Radio Group Showcase */}
          <section className='space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-foreground'>
                Enhanced Radio Group Components
              </h2>
              <p className='mt-2 text-lg text-muted-foreground'>
                Professional radio group components with MAPS v2.2 dark-first
                philosophy, comprehensive variant support, card-style
                selections, and AAA accessibility compliance
              </p>
            </div>
            <RadioGroupDemo />
          </section>

          {/* Footer */}
          <footer className='border-t border-border py-8 text-center'>
            <p className='text-muted-foreground'>
              MAPS v2.2 Enhanced Component System • Enhanced Button, Dialog,
              Input, Label, Select, Checkbox, Popover, Switch, Toggle, Tabs,
              Collapsible, AlertDialog, Skeleton, Pagination & More • Built with
              Apple HIG Philosophy • Accessible by Design • Liquid Glass
              Materials • ~9.6/10 AAA Compliance Score
            </p>
          </footer>
        </div>
      </div>
      <EnhancedToastViewport />
    </EnhancedToastProvider>
  );
};

export default ComponentsDemo;
