/**
 * Enhanced DatePicker Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
 *
 * COMPLIANCE MATRIX:
 * - Dark-First Foundation: ✅ Deep space canvas with ethereal accents
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Tailwind Config → CSS Custom Properties → Component classes
 * - Enhanced Tokens → Semantic API → Component variants
 * - MAPS Guidelines → Component behavior → User experience
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 */

/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { AccessibleIcon, Slot } from '@/components/primitives';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedCalendar } from '@/components/ui-enhanced/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui-enhanced/Popover';
import { cn } from '@/utils/cn';

// ===== ENHANCED DATEPICKER VARIANTS =====

/**
 * Enhanced date picker variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedDatePickerVariants = cva(
  [
    // Foundation: Layout structure
    'flex items-center justify-between',
    'w-full',

    // Foundation: Typography - Apple HIG hierarchy
    'text-foreground',

    // Foundation: Interaction feedback - Apple HIG harmony
    'cursor-pointer',
    'transition-[colors,border-color,box-shadow] duration-200',

    // Foundation: Border system - semantic hierarchy
    'border border-input',
    'rounded-lg',

    // Foundation: Focus management - AAA compliant
    'focus-within:outline-none',
    'focus-within:ring-2',
    'focus-within:ring-ring',
    'focus-within:ring-offset-2',
    'focus-within:ring-offset-background',

    // Foundation: Accessibility - enhanced contrast mode
    'focus-within:border-ring',
  ],
  {
    variants: {
      /**
       * Surface treatment following MAPS liquid glass materials
       * ANTI-DRIFT: All values from CSS custom properties via Tailwind config
       */
      surface: {
        default: ['bg-background', 'hover:bg-background/90'],
        elevated: ['bg-card', 'shadow-sm', 'hover:bg-card/90'],
        glass: ['bg-card/50', 'backdrop-blur-lg', 'hover:bg-card/60'],
      },

      /**
       * Size variants following 8pt grid system
       * ANTI-DRIFT: All spacing from design tokens
       */
      size: {
        sm: ['h-8', 'text-sm'],
        md: ['h-9', 'text-sm'],
        lg: ['h-10', 'text-base'],
      },

      /**
       * Validation states with semantic color system
       * ANTI-DRIFT: Color references from CSS custom properties
       */
      validation: {
        none: '',
        error: [
          'border-destructive',
          'text-destructive',
          'focus-within:ring-destructive',
        ],
        warning: [
          'border-warning',
          'text-warning',
          'focus-within:ring-warning',
        ],
        success: [
          'border-success',
          'text-success',
          'focus-within:ring-success',
        ],
      },

      /**
       * Density variants for different interaction contexts
       * ANTI-DRIFT: Spacing from systematic density tokens
       */
      density: {
        comfortable: 'px-3 py-2',
        compact: 'px-2 py-1',
        spacious: 'px-4 py-3',
      },

      /**
       * AAA compliance mode
       * ANTI-DRIFT: Enhanced contrast following WCAG AAA
       */
      aaaMode: {
        standard: '',
        enhanced: ['border-2', 'focus-within:ring-4'],
      },
    },
    defaultVariants: {
      surface: 'default',
      size: 'md',
      validation: 'none',
      density: 'comfortable',
      aaaMode: 'standard',
    },
  }
);

/**
 * Date picker trigger styling for enhanced hierarchy
 */
const enhancedDatePickerTriggerVariants = cva(
  ['justify-start text-left font-normal', 'h-full w-full'],
  {
    variants: {
      hasValue: {
        true: 'text-foreground',
        false: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      hasValue: false,
    },
  }
);

// ===== DATE RANGE TYPE =====

/**
 * Date range interface for range pickers
 */
interface DateRange {
  from: Date;
  to?: Date | undefined;
}

// ===== ENHANCED DATEPICKER TYPES =====

export interface EnhancedDatePickerOwnProps {
  /**
   * The selected date
   */
  value?: Date;

  /**
   * Default selected date for uncontrolled usage
   */
  defaultValue?: Date;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date | undefined) => void;

  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;

  /**
   * Whether the component is disabled
   */
  disabled?: boolean;

  /**
   * Date formatting string (uses date-fns format)
   */
  dateFormat?: string;

  /**
   * Function to determine if a date should be disabled
   */
  isDateDisabled?: (date: Date) => boolean;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Whether to use as a child slot
   */
  asChild?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * ARIA described by for accessibility
   */
  'aria-describedby'?: string;

  /**
   * Whether the field is required
   */
  'aria-required'?: boolean;
}

/**
 * Combined props for enhanced date picker
 */
type EnhancedDatePickerProps = EnhancedDatePickerOwnProps &
  VariantProps<typeof enhancedDatePickerVariants> &
  Omit<React.ComponentProps<'div'>, keyof EnhancedDatePickerOwnProps>;

// ===== ENHANCED DATEPICKER COMPONENT =====

/**
 * Enhanced date picker with MAPS v2.2 compliance
 * Supports both controlled and uncontrolled usage patterns
 */
export const EnhancedDatePicker = React.forwardRef<
  HTMLDivElement,
  EnhancedDatePickerProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder = 'Pick a date',
      disabled = false,
      dateFormat = 'MMM dd, yyyy',
      isDateDisabled,
      minDate,
      maxDate,
      asChild = false,
      surface = 'default',
      size = 'md',
      validation = 'none',
      density = 'comfortable',
      aaaMode = 'standard',
      className,
      'aria-label': ariaLabel = 'Select date',
      'aria-describedby': ariaDescribedBy,
      'aria-required': ariaRequired = false,
      ...props
    },
    ref
  ) => {
    // Internal state for uncontrolled usage
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = React.useState(false);

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const selectedDate = isControlled ? value : internalDate;

    // Handle date selection
    const handleDateSelect = React.useCallback(
      (date: Date | Date[] | undefined) => {
        // For single mode, we expect a single Date or undefined
        const singleDate = Array.isArray(date) ? date[0] : date;
        if (!isControlled) {
          setInternalDate(singleDate);
        }
        onChange?.(singleDate);
        setIsOpen(false);
      },
      [isControlled, onChange]
    );

    // Format display date
    const formattedDate = React.useMemo(() => {
      if (!selectedDate) return null;
      try {
        return format(selectedDate, dateFormat);
      } catch {
        return null;
      }
    }, [selectedDate, dateFormat]);

    const Comp = asChild ? Slot : 'div';

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Comp
          ref={ref}
          className={cn(
            enhancedDatePickerVariants({
              surface,
              size,
              validation,
              density,
              aaaMode,
            }),
            className
          )}
          {...props}
        >
          <PopoverTrigger asChild>
            <EnhancedButton
              variant='ghost'
              size={size || 'md'}
              disabled={disabled}
              className={cn(
                enhancedDatePickerTriggerVariants({
                  hasValue: Boolean(selectedDate),
                }),
                'h-full border-0 bg-transparent p-0 hover:bg-transparent focus-visible:ring-0'
              )}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-expanded={isOpen}
              aria-haspopup='dialog'
              aria-required={ariaRequired}
            >
              <span className='flex-1 truncate'>
                {formattedDate ? (
                  <span>{formattedDate}</span>
                ) : (
                  <span
                    className={cn(
                      'text-muted-foreground',
                      'text-muted-foreground'
                    )}
                  >
                    {placeholder}
                  </span>
                )}
              </span>
              <AccessibleIcon>
                <CalendarIcon
                  className={cn(
                    'h-4 w-4 shrink-0 opacity-50',
                    'h-4 w-4 shrink-0 opacity-50'
                  )}
                />
              </AccessibleIcon>
            </EnhancedButton>
          </PopoverTrigger>

          <PopoverContent
            className={cn('w-auto p-0', 'w-auto p-0')}
            align='start'
          >
            <EnhancedCalendar
              mode='single'
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={date => {
                if (disabled) return true;
                if (isDateDisabled?.(date)) return true;
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
            />
          </PopoverContent>
        </Comp>
      </Popover>
    );
  }
);

EnhancedDatePicker.displayName = 'EnhancedDatePicker';

// ===== ENHANCED DATEPICKER RANGE TYPES =====

export interface EnhancedDatePickerRangeOwnProps {
  /**
   * The selected date range
   */
  value?: DateRange;

  /**
   * Default selected date range for uncontrolled usage
   */
  defaultValue?: DateRange;

  /**
   * Callback when date range changes
   */
  onChange?: (range: DateRange | undefined) => void;

  /**
   * Placeholder text when no range is selected
   */
  placeholder?: string;

  /**
   * Whether the component is disabled
   */
  disabled?: boolean;

  /**
   * Date formatting string (uses date-fns format)
   */
  dateFormat?: string;

  /**
   * Function to determine if a date should be disabled
   */
  isDateDisabled?: (date: Date) => boolean;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Whether to use as a child slot
   */
  asChild?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * ARIA described by for accessibility
   */
  'aria-describedby'?: string;

  /**
   * Whether the field is required
   */
  'aria-required'?: boolean;
}

/**
 * Combined props for enhanced date picker range
 */
type EnhancedDatePickerRangeProps = EnhancedDatePickerRangeOwnProps &
  VariantProps<typeof enhancedDatePickerVariants> &
  Omit<React.ComponentProps<'div'>, keyof EnhancedDatePickerRangeOwnProps>;

// ===== ENHANCED DATEPICKER RANGE COMPONENT =====

/**
 * Enhanced date range picker with MAPS v2.2 compliance
 * Supports both controlled and uncontrolled usage patterns
 */
export const EnhancedDatePickerRange = React.forwardRef<
  HTMLDivElement,
  EnhancedDatePickerRangeProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder = 'Pick a date range',
      disabled = false,
      dateFormat = 'MMM dd, yyyy',
      isDateDisabled,
      minDate,
      maxDate,
      asChild = false,
      surface = 'default',
      size = 'md',
      validation = 'none',
      density = 'comfortable',
      aaaMode = 'standard',
      className,
      'aria-label': ariaLabel = 'Select date range',
      'aria-describedby': ariaDescribedBy,
      'aria-required': ariaRequired = false,
      ...props
    },
    ref
  ) => {
    // Internal state for uncontrolled usage
    const [internalRange, setInternalRange] = React.useState<
      DateRange | undefined
    >(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined;
    const selectedRange = isControlled ? value : internalRange;

    // Handle range selection
    const handleRangeSelect = React.useCallback(
      (date: Date | Date[] | undefined) => {
        // For range mode, we need to convert the Calendar's generic format to our DateRange
        if (!date) {
          const newRange = undefined;
          if (!isControlled) {
            setInternalRange(newRange);
          }
          onChange?.(newRange);
          return;
        }

        // Handle array format (range mode)
        if (Array.isArray(date)) {
          const newRange: DateRange | undefined =
            date.length > 0 && date[0]
              ? { from: date[0], to: date[1] }
              : undefined;
          if (!isControlled) {
            setInternalRange(newRange);
          }
          onChange?.(newRange);
          // Keep open until complete range is selected
          if (newRange?.from && newRange?.to) {
            setIsOpen(false);
          }
        } else {
          // Handle single date (start of range)
          const newRange: DateRange = { from: date };
          if (!isControlled) {
            setInternalRange(newRange);
          }
          onChange?.(newRange);
        }
      },
      [isControlled, onChange]
    );

    // Format display range
    const formattedRange = React.useMemo(() => {
      if (!selectedRange?.from) return null;
      try {
        const fromFormatted = format(selectedRange.from, dateFormat);
        if (!selectedRange.to) {
          return `${fromFormatted} - ...`;
        }
        const toFormatted = format(selectedRange.to, dateFormat);
        return `${fromFormatted} - ${toFormatted}`;
      } catch {
        return null;
      }
    }, [selectedRange, dateFormat]);

    const Comp = asChild ? Slot : 'div';

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Comp
          ref={ref}
          className={cn(
            enhancedDatePickerVariants({
              surface,
              size,
              validation,
              density,
              aaaMode,
            }),
            className
          )}
          {...props}
        >
          <PopoverTrigger asChild>
            <EnhancedButton
              variant='ghost'
              size={size || 'md'}
              disabled={disabled}
              className={cn(
                enhancedDatePickerTriggerVariants({
                  hasValue: Boolean(selectedRange?.from),
                }),
                'h-full border-0 bg-transparent p-0 hover:bg-transparent focus-visible:ring-0'
              )}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-expanded={isOpen}
              aria-haspopup='dialog'
              aria-required={ariaRequired}
            >
              <span className='flex-1 truncate'>
                {formattedRange ? (
                  <span>{formattedRange}</span>
                ) : (
                  <span
                    className={cn(
                      'text-muted-foreground',
                      'text-muted-foreground'
                    )}
                  >
                    {placeholder}
                  </span>
                )}
              </span>
              <AccessibleIcon>
                <CalendarIcon
                  className={cn(
                    'h-4 w-4 shrink-0 opacity-50',
                    'h-4 w-4 shrink-0 opacity-50'
                  )}
                />
              </AccessibleIcon>
            </EnhancedButton>
          </PopoverTrigger>

          <PopoverContent
            className={cn('w-auto p-0', 'w-auto p-0')}
            align='start'
          >
            <EnhancedCalendar
              mode='range'
              selected={
                selectedRange
                  ? [
                      selectedRange.from,
                      ...(selectedRange.to ? [selectedRange.to] : []),
                    ]
                  : undefined
              }
              onSelect={handleRangeSelect}
              disabled={date => {
                if (disabled) return true;
                if (isDateDisabled?.(date)) return true;
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Comp>
      </Popover>
    );
  }
);

EnhancedDatePickerRange.displayName = 'EnhancedDatePickerRange';

// ===== DATEPICKER FACTORY =====

/**
 * Factory for common date picker configurations
 * Provides semantic presets following MAPS design patterns
 */
export const DatePickerFactory = {
  /**
   * Default single date picker
   */
  default: (props: Partial<EnhancedDatePickerProps> = {}) => (
    <EnhancedDatePicker surface='default' {...props} />
  ),

  /**
   * Elevated surface single date picker
   */
  elevated: (props: Partial<EnhancedDatePickerProps> = {}) => (
    <EnhancedDatePicker surface='elevated' {...props} />
  ),

  /**
   * Glass surface single date picker
   */
  glass: (props: Partial<EnhancedDatePickerProps> = {}) => (
    <EnhancedDatePicker surface='glass' {...props} />
  ),

  /**
   * Compact single date picker
   */
  compact: (props: Partial<EnhancedDatePickerProps> = {}) => (
    <EnhancedDatePicker size='sm' density='compact' {...props} />
  ),

  /**
   * Large single date picker
   */
  large: (props: Partial<EnhancedDatePickerProps> = {}) => (
    <EnhancedDatePicker size='lg' density='spacious' {...props} />
  ),

  /**
   * Range date picker
   */
  range: (props: Partial<EnhancedDatePickerRangeProps> = {}) => (
    <EnhancedDatePickerRange surface='default' {...props} />
  ),
};

// ===== EXPORTS =====

export { enhancedDatePickerVariants };

export type {
  EnhancedDatePickerProps,
  EnhancedDatePickerRangeProps,
  DateRange,
};

export type DatePickerVariantProps = VariantProps<
  typeof enhancedDatePickerVariants
>;
