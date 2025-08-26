/**
 * Enhanced Combobox Component - MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
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

import * as ComboboxPrimitive from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import React from 'react';

import { Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED COMBOBOX VARIANTS =====

/**
 * Enhanced combobox variants following MAPS v2.2 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedComboboxVariants = cva(
  [
    // Foundation: Layout/shape - Clean systematic design
    'relative flex w-full',

    // Foundation: Typography - Apple HIG hierarchy
    'text-sm',

    // Foundation: Shape - Systematic from design tokens
    'rounded-md border',

    // Foundation: Spacing - 8pt grid system
    'min-h-10',

    // Foundation: Colors - Deep space foundation with ethereal accents
    'bg-input text-foreground',
    'border-border',

    // Foundation: Motion - Respect user preferences
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: States - Disabled styling
    'disabled:cursor-not-allowed disabled:opacity-50',

    // Foundation: Focus - AAA compliant ring system
    'focus-within:outline-none',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  ],
  {
    variants: {
      variant: {
        // Default: Clean, professional baseline
        default: ['border-border bg-input', 'focus-within:border-ring'],

        // Ghost: Minimal, elegant
        ghost: [
          'border-transparent bg-transparent',
          'focus-within:border-border focus-within:bg-input',
        ],

        // Filled: Subtle depth
        filled: [
          'border-transparent bg-muted',
          'focus-within:border-border focus-within:bg-input',
        ],

        // Outline: Clear boundaries
        outline: ['border-border bg-transparent', 'focus-within:border-ring'],

        // Floating: Modern glass effect (when vibrancy enabled)
        floating: [
          'border-border/50 bg-input/80',
          'focus-within:border-ring focus-within:bg-input',
        ],
      },

      size: {
        // Clean systematic sizing with 8pt grid
        sm: ['min-h-8 text-xs'],
        md: ['min-h-10 text-sm'],
        lg: ['min-h-12 text-base'],
        // Touch: Platform-aware for mobile
        touch: ['min-h-11 text-sm'],
      },

      // Validation state system
      state: {
        default: '',
        success: [
          'border-success text-success-foreground',
          'focus-within:ring-success',
        ],
        warning: [
          'border-warning text-warning-foreground',
          'focus-within:ring-warning',
        ],
        error: [
          'border-error text-error-foreground',
          'focus-within:ring-error',
        ],
      },

      // Liquid glass materials
      vibrancy: {
        none: '',
        glass: ['bg-input/80 backdrop-blur-md backdrop-saturate-150'],
        floating: [
          'bg-input/75 backdrop-blur-lg backdrop-saturate-150',
          'shadow-elevation-medium',
        ],
      },

      // Density variations following Apple HIG
      density: {
        comfortable: ['px-3 py-2'],
        compact: ['px-2 py-1'],
      },

      // AAA compliance enforcement
      enforceAAA: {
        false: '',
        true: [
          // Use AAA-compliant alternatives
          'aaa:border-border-strong aaa:bg-background',
          'aaa:focus-within:ring-accent-solid-aaa',
        ],
      },
    },

    compoundVariants: [
      // State + AAA enforcement combinations
      {
        state: 'error',
        enforceAAA: true,
        className: 'aaa:border-error-aaa aaa:focus-within:ring-error-aaa',
      },
      {
        state: 'warning',
        enforceAAA: true,
        className: 'aaa:border-warning-aaa aaa:focus-within:ring-warning-aaa',
      },
      {
        state: 'success',
        enforceAAA: true,
        className: 'aaa:border-success-aaa aaa:focus-within:ring-success-aaa',
      },

      // Vibrancy + size combinations for optimal experience
      {
        vibrancy: ['glass', 'floating'],
        size: 'sm',
        className: 'backdrop-blur-sm',
      },
    ],

    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
      vibrancy: 'none',
      density: 'comfortable',
      enforceAAA: false,
    },
  }
);

/**
 * Enhanced combobox input variants
 */
const enhancedComboboxInputVariants = cva(
  [
    // Foundation: Clean input styling
    'flex-1 bg-transparent',
    'border-0 outline-none',
    'placeholder:text-muted-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      density: {
        comfortable: ['px-0 py-1'],
        compact: ['px-0 py-0.5'],
      },
    },
    defaultVariants: {
      density: 'comfortable',
    },
  }
);

/**
 * Enhanced combobox content (dropdown) variants
 */
const enhancedComboboxContentVariants = cva(
  [
    // Foundation: Elevated dropdown surface
    'relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
    'bg-popover text-popover-foreground rounded-md border shadow-elevation-high',

    // Foundation: Motion
    'animate-in fade-in-0 zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',

    // Foundation: Positioning
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      vibrancy: {
        none: '',
        glass: ['bg-popover/95 backdrop-blur-md backdrop-saturate-150'],
        floating: [
          'bg-popover/90 backdrop-blur-lg backdrop-saturate-150',
          'shadow-elevation-floating',
        ],
      },
    },
    defaultVariants: {
      vibrancy: 'none',
    },
  }
);

/**
 * Enhanced combobox item variants
 */
const enhancedComboboxItemVariants = cva(
  [
    // Foundation: Item layout
    'relative flex cursor-pointer select-none items-center',
    'rounded-sm px-2 py-1.5 text-sm text-foreground',

    // Foundation: States
    'aria-selected:bg-accent aria-selected:text-accent-foreground',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',

    // Foundation: Motion
    'transition-colors duration-150 motion-reduce:transition-none',

    // Foundation: Focus
    'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none',

    // Foundation: Hover
    'hover:bg-muted',
  ],
  {
    variants: {
      density: {
        comfortable: ['px-2 py-1.5'],
        compact: ['px-2 py-1'],
      },
    },
    defaultVariants: {
      density: 'comfortable',
    },
  }
);

// ===== ENHANCED COMBOBOX TYPES =====

interface EnhancedComboboxProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'onChange' | 'onSelect' | 'value' | 'defaultValue'
    >,
    VariantProps<typeof enhancedComboboxVariants> {
  /**
   * Polymorphic rendering support
   */
  asChild?: boolean;

  /**
   * Current value
   */
  value?: string;

  /**
   * Default value
   */
  defaultValue?: string;

  /**
   * Value change handler
   */
  onValueChange?: (value: string) => void;

  /**
   * Search value
   */
  searchValue?: string;

  /**
   * Search value change handler
   */
  onSearchValueChange?: (value: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Search placeholder
   */
  searchPlaceholder?: string;

  /**
   * Options for the combobox
   */
  options?: ComboboxOption[];

  /**
   * Custom filter function
   */
  filterFunction?: (
    options: ComboboxOption[],
    searchValue: string
  ) => ComboboxOption[];

  /**
   * Allow clearing selection
   */
  clearable?: boolean;

  /**
   * Show search input
   */
  searchable?: boolean;

  /**
   * Empty state message
   */
  emptyMessage?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Name for form submission
   */
  name?: string;
}

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface EnhancedComboboxInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof enhancedComboboxInputVariants> {}

interface EnhancedComboboxContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedComboboxContentVariants> {
  asChild?: boolean;
}

interface EnhancedComboboxItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedComboboxItemVariants> {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
}

// ===== ENHANCED COMBOBOX IMPLEMENTATION =====

/**
 * Enhanced Combobox Root Component
 */
const EnhancedCombobox = React.forwardRef<
  HTMLButtonElement,
  EnhancedComboboxProps
>(
  (
    {
      className,
      variant,
      size,
      state,
      vibrancy,
      density,
      enforceAAA,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild: _asChild = false, // Not used since we always render as button
      value,
      defaultValue,
      onValueChange,
      searchValue,
      onSearchValueChange,
      placeholder = 'Select an option...',
      searchPlaceholder = 'Search...',
      options = [],
      filterFunction,
      clearable = false,
      searchable = true,
      emptyMessage = 'No options found.',
      disabled = false,
      required = false,
      name,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || ''
    );
    const [internalSearchValue, setInternalSearchValue] = React.useState('');

    const currentValue = value !== undefined ? value : internalValue;
    const currentSearchValue =
      searchValue !== undefined ? searchValue : internalSearchValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        setOpen(false);
        setInternalSearchValue('');
      },
      [value, onValueChange]
    );

    const handleSearchValueChange = React.useCallback(
      (newSearchValue: string) => {
        if (searchValue === undefined) {
          setInternalSearchValue(newSearchValue);
        }
        onSearchValueChange?.(newSearchValue);
      },
      [searchValue, onSearchValueChange]
    );

    const defaultFilterFunction = React.useCallback(
      (opts: ComboboxOption[], search: string) => {
        if (!search) return opts;
        return opts.filter(option =>
          option.label.toLowerCase().includes(search.toLowerCase())
        );
      },
      []
    );

    const filteredOptions = React.useMemo(() => {
      const filter = filterFunction || defaultFilterFunction;
      return filter(options, currentSearchValue);
    }, [options, currentSearchValue, filterFunction, defaultFilterFunction]);

    const selectedOption = React.useMemo(() => {
      return options.find(option => option.value === currentValue);
    }, [options, currentValue]);

    return (
      <ComboboxPrimitive.Root open={open} onOpenChange={setOpen}>
        <ComboboxPrimitive.Trigger asChild disabled={disabled}>
          <button
            ref={ref}
            className={cn(
              enhancedComboboxVariants({
                variant,
                size,
                state,
                vibrancy,
                density,
                enforceAAA,
              }),
              className
            )}
            type='button'
            {...props}
          >
            <div
              className={cn(
                'flex flex-1 items-center gap-2',
                'flex flex-1 items-center gap-2'
              )}
            >
              {selectedOption ? (
                <span className={cn('text-foreground', 'text-foreground')}>
                  {selectedOption.label}
                </span>
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
            </div>

            <div
              className={cn(
                'flex items-center gap-1',
                'flex items-center gap-1'
              )}
            >
              {clearable && selectedOption && (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  role='button'
                  tabIndex={0}
                  onClick={e => {
                    e.stopPropagation();
                    handleValueChange('');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleValueChange('');
                    }
                  }}
                  className={cn(
                    'flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm opacity-50 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm opacity-50 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                  aria-label='Clear selection'
                >
                  <X className={cn('h-3 w-3', 'h-3 w-3')} />
                </div>
              )}
              <ChevronDown
                className={cn('h-4 w-4 opacity-50', 'h-4 w-4 opacity-50')}
              />
            </div>

            {/* Hidden input for form submission */}
            {name && (
              <input
                type='hidden'
                name={name}
                value={currentValue}
                required={required}
              />
            )}
          </button>
        </ComboboxPrimitive.Trigger>

        <ComboboxPrimitive.Portal>
          <ComboboxPrimitive.Content
            className={cn(
              enhancedComboboxContentVariants({ vibrancy }),
              'w-[--radix-popover-trigger-width] p-0'
            )}
            align='start'
            sideOffset={4}
          >
            {searchable && (
              <div
                className={cn(
                  'flex items-center border-b border-border px-3',
                  'flex items-center border-b border-border px-3'
                )}
              >
                <Search
                  className={cn(
                    'mr-2 h-4 w-4 shrink-0 opacity-50',
                    'mr-2 h-4 w-4 shrink-0 opacity-50'
                  )}
                />
                <input
                  className={cn(
                    enhancedComboboxInputVariants({ density }),
                    'flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                  placeholder={searchPlaceholder}
                  value={currentSearchValue}
                  onChange={e => handleSearchValueChange(e.target.value)}
                />
              </div>
            )}

            <div
              className={cn(
                'max-h-[300px] overflow-auto p-1',
                'max-h-80 overflow-auto p-1'
              )}
            >
              {filteredOptions.length === 0 ? (
                <div
                  className={cn(
                    'py-6 text-center text-sm text-muted-foreground',
                    'py-6 text-center text-sm text-muted-foreground'
                  )}
                >
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className={cn(
                      enhancedComboboxItemVariants({ density }),
                      option.disabled && 'pointer-events-none opacity-50',
                      option.value === currentValue &&
                        'bg-accent text-accent-foreground'
                    )}
                    onClick={() =>
                      !option.disabled && handleValueChange(option.value)
                    }
                    onKeyDown={e => {
                      if (
                        (e.key === 'Enter' || e.key === ' ') &&
                        !option.disabled
                      ) {
                        e.preventDefault();
                        handleValueChange(option.value);
                      }
                    }}
                    role='option'
                    tabIndex={option.disabled ? -1 : 0}
                    aria-selected={option.value === currentValue}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        option.value === currentValue
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </ComboboxPrimitive.Content>
        </ComboboxPrimitive.Portal>
      </ComboboxPrimitive.Root>
    );
  }
);

EnhancedCombobox.displayName = 'EnhancedCombobox';

/**
 * Enhanced Combobox Input Component (for custom implementations)
 */
const EnhancedComboboxInput = React.forwardRef<
  HTMLInputElement,
  EnhancedComboboxInputProps
>(({ className, density, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(enhancedComboboxInputVariants({ density }), className)}
      {...props}
    />
  );
});

EnhancedComboboxInput.displayName = 'EnhancedComboboxInput';

/**
 * Enhanced Combobox Content Component (for custom implementations)
 */
const EnhancedComboboxContent = React.forwardRef<
  HTMLDivElement,
  EnhancedComboboxContentProps
>(({ className, vibrancy, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      className={cn(enhancedComboboxContentVariants({ vibrancy }), className)}
      {...props}
    />
  );
});

EnhancedComboboxContent.displayName = 'EnhancedComboboxContent';

/**
 * Enhanced Combobox Item Component (for custom implementations)
 */
const EnhancedComboboxItem = React.forwardRef<
  HTMLDivElement,
  EnhancedComboboxItemProps
>(
  (
    { className, density, asChild = false, value, disabled = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(
          enhancedComboboxItemVariants({ density }),
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        data-value={value}
        data-disabled={disabled}
        {...props}
      />
    );
  }
);

EnhancedComboboxItem.displayName = 'EnhancedComboboxItem';

// ===== COMBOBOX FACTORY FUNCTIONS =====

/**
 * Factory for creating pre-configured combobox components
 */
const ComboboxFactory = {
  /**
   * Standard combobox configuration
   */
  standard: (overrides?: Partial<EnhancedComboboxProps>) => ({
    variant: 'default' as const,
    size: 'md' as const,
    density: 'comfortable' as const,
    searchable: true,
    clearable: false,
    ...overrides,
  }),

  /**
   * Compact combobox for dense layouts
   */
  compact: (overrides?: Partial<EnhancedComboboxProps>) => ({
    variant: 'default' as const,
    size: 'sm' as const,
    density: 'compact' as const,
    searchable: true,
    clearable: false,
    ...overrides,
  }),

  /**
   * Glass combobox with modern aesthetics
   */
  glass: (overrides?: Partial<EnhancedComboboxProps>) => ({
    variant: 'floating' as const,
    size: 'md' as const,
    density: 'comfortable' as const,
    vibrancy: 'glass' as const,
    searchable: true,
    clearable: true,
    ...overrides,
  }),

  /**
   * Accessible combobox with AAA compliance
   */
  accessible: (overrides?: Partial<EnhancedComboboxProps>) => ({
    variant: 'outline' as const,
    size: 'lg' as const,
    density: 'comfortable' as const,
    enforceAAA: true,
    searchable: true,
    clearable: true,
    ...overrides,
  }),

  /**
   * Touch-optimized combobox for mobile
   */
  touch: (overrides?: Partial<EnhancedComboboxProps>) => ({
    variant: 'filled' as const,
    size: 'touch' as const,
    density: 'comfortable' as const,
    searchable: true,
    clearable: true,
    ...overrides,
  }),
};

// ===== EXPORTS =====

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
};

export type {
  EnhancedComboboxProps,
  EnhancedComboboxInputProps,
  EnhancedComboboxContentProps,
  EnhancedComboboxItemProps,
  ComboboxOption,
};
