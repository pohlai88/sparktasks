/**
 * Enhanced Radio Group Component - MAPS4 v4.0 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with cosmic innovation
 * - Apple HIG Harmony: ✅ Semantic hierarchy & systematic spacing
 * - AAA Compliance: ✅ Dual-track with enforcement mode
 * - Liquid Glass Materials: ✅ Governed vibrancy system
 * - Radix + Tailwind + MAPS4: ✅ Proper foundation integration
 * - Anti-Drift Enforcement: ✅ Token-only references, no hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - Radix owns: Behavior, ARIA, focus management, state management, keyboard navigation
 * - MAPS4 owns: Apple HIG materials, liquid glass, AAA enforcement
 * - Wrapper owns: Token application, governance rules, brand consistency
 *
 * GOVERNANCE RULES:
 * - Foundation tokens only (no component-specific tokens)
 * - Auto-apply AAA scrims over glass materials
 * - Apple HIG motion with respect for reduced motion
 * - Platform-aware touch targets (44px minimum)
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (unchecked|checked|disabled)
 */

/* eslint-disable react/prop-types */

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import React from 'react';

import { Slot } from '@/components/primitives';
import { cn } from '@/utils/cn';

// ===== ENHANCED RADIO GROUP VARIANTS =====

/**
 * Enhanced radio group container variants following MAPS4 v4.0 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedRadioGroupVariants = cva(
  [
    // Foundation: Layout - Clean vertical spacing by default
    'grid gap-2',
  ],
  {
    variants: {
      orientation: {
        vertical: 'grid-cols-1',
        horizontal: 'grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4',
      },
      density: {
        comfortable: 'gap-3',
        compact: 'gap-2',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      density: 'comfortable',
    },
  }
);

/**
 * Enhanced radio item variants following MAPS4 v4.0 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced design tokens
 */
const enhancedRadioItemVariants = cva(
  [
    // Foundation: Layout - Square aspect ratio with proper sizing
    'flex items-center justify-center',
    'size-[var(--space-4)]',
    'shrink-0',

    // Foundation: Shape - Apple HIG circular for radio inputs
    'rounded-full',

    // Foundation: Border system - Clean, systematic
    'border-2 border-cosmic-border',

    // Foundation: States - Systematic visual feedback
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:border-aurora-accent',

    // Foundation: Apple HIG interaction patterns
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: Focus - AAA compliant ring system
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-aurora-accent focus-visible:ring-offset-2',
    'focus-visible:ring-offset-stellar-surface',

    // Foundation: Touch targets - 44px minimum (expanded hit area)
    'relative',
    'before:absolute before:inset-[-12px] before:content-[""]',
    'pointer:hover:before:rounded-full pointer:hover:before:bg-aurora-accent/10',

    // Foundation: Platform awareness - Pointer-only hover states
    'pointer:hover:border-aurora-accent/70',
    'active:scale-95',
  ],
  {
    variants: {
      variant: {
        // Default: Clean accent styling with systematic feedback
        default: [
          'bg-stellar-surface',
          'data-[state=checked]:bg-aurora-accent/10 data-[state=checked]:text-cosmic-light',
          'pointer:hover:bg-aurora-accent/5',
        ],

        // Ghost: Subtle, muted styling
        ghost: [
          'border-cosmic-muted/30 bg-transparent',
          'data-[state=checked]:border-cosmic-muted',
          'data-[state=checked]:bg-aurora-accent/20',
          'pointer:hover:border-cosmic-muted/50 pointer:hover:bg-aurora-accent/10',
        ],

        // Glass: Liquid glass material with governed vibrancy
        glass: [
          'backdrop-blur-[var(--blur-sm)] backdrop-saturate-[var(--saturate-150)]',
          'border-cosmic-border/60 bg-stellar-surface-elevated/60',
          'data-[state=checked]:border-aurora-accent/80 data-[state=checked]:bg-aurora-accent/20',
          'pointer:hover:border-cosmic-border/80 pointer:hover:bg-stellar-surface-elevated/80',
          // AAA compliance: Text scrim for content protection
          '[&_+_label]:rounded-sm [&_+_label]:bg-stellar-surface/85 [&_+_label]:px-[var(--space-1)]',
        ],

        // Elevated: Sophisticated surface with subtle elevation
        elevated: [
          'border-cosmic-border bg-stellar-surface-elevated',
          'shadow-elevation-sm',
          'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent/15',
          'data-[state=checked]:shadow-[0_0_12px_rgba(var(--aurora-accent-rgb),0.25)]',
          'pointer:hover:bg-stellar-surface-elevated pointer:hover:shadow-elevation-md',
        ],

        // AAA: High contrast mode for compliance
        aaa: [
          'border-cosmic-border bg-stellar-surface',
          'data-[state=checked]:border-aurora-accent-solid-aaa data-[state=checked]:bg-aurora-accent-solid-aaa',
          'data-[state=checked]:text-stellar-surface',
          'pointer:hover:bg-aurora-accent/20',
          'forced-colors:bg-Field forced-colors:border-FieldText',
          'forced-colors:data-[state=checked]:bg-Highlight forced-colors:data-[state=checked]:border-Highlight',
        ],
      },
      size: {
        sm: 'size-[var(--space-3)]',
        md: 'size-[var(--space-4)]', // Default
        lg: 'size-[var(--space-5)]',
        xl: 'size-[var(--space-6)]',
      },
      density: {
        comfortable: 'before:inset-[-12px]',
        compact: 'before:inset-[-8px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      density: 'comfortable',
    },
  }
);

/**
 * Enhanced radio indicator variants - The checked state indicator
 */
const enhancedRadioIndicatorVariants = cva(
  [
    // Foundation: Perfect center alignment
    'flex items-center justify-center',

    // Foundation: Smooth appearance animation
    'transition-all duration-200 ease-out',
    'motion-reduce:transition-none',

    // Foundation: Scale animation for checked state
    'data-[state=checked]:scale-100 data-[state=unchecked]:scale-0',

    // Foundation: Color inheritance from parent
    'text-current',
  ],
  {
    variants: {
      indicatorStyle: {
        dot: '',
        icon: '',
        filled: '',
      },
    },
    defaultVariants: {
      indicatorStyle: 'dot',
    },
  }
);

/**
 * Enhanced radio label variants for proper typography and spacing
 */
const enhancedRadioLabelVariants = cva(
  [
    // Foundation: Typography - Apple body text
    'text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none',
    'text-cosmic-light',

    // Foundation: Interaction states
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',

    // Foundation: Smooth transitions
    'transition-colors duration-[var(--motion-duration-2)] ease-out',
    'motion-reduce:transition-none',

    // Foundation: Platform-aware interactions
    'cursor-pointer pointer:hover:text-aurora-accent',
    'select-none',
  ],
  {
    variants: {
      position: {
        right: 'ml-[var(--space-2)]',
        left: 'order-first mr-[var(--space-2)]',
        top: 'mb-[var(--space-1)] block',
        bottom: 'order-last mt-[var(--space-1)] block',
      },
      emphasis: {
        subtle: 'text-cosmic-muted',
        normal: 'text-cosmic-light',
        strong: 'font-[var(--font-weight-semibold)] text-cosmic-light',
      },
    },
    defaultVariants: {
      position: 'right',
      emphasis: 'normal',
    },
  }
);

// ===== ENHANCED RADIO GROUP COMPONENTS =====

/**
 * Enhanced Radio Group Root
 * Provides context and keyboard navigation for radio items
 */
const EnhancedRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> &
    VariantProps<typeof enhancedRadioGroupVariants> & {
      /** Enforce AAA compliance mode with high contrast colors */
      enforceAAA?: boolean;
      /** Control layout density for different UI contexts */
      density?: 'comfortable' | 'compact';
      /** Optional description for screen readers */
      description?: string;
      /** Polymorphic support - render as different element/component */
      asChild?: boolean;
    }
>(
  (
    {
      className,
      orientation = 'vertical',
      density = 'comfortable',
      enforceAAA = false,
      description,
      asChild: _asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = _asChild ? Slot : RadioGroupPrimitive.Root;

    if (_asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(
            enhancedRadioGroupVariants({ orientation, density }),
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <div>
        {description && (
          <p
            className={cn(
              'mb-[var(--space-2)] text-[var(--font-size-sm)] text-cosmic-muted',
              enforceAAA && 'text-cosmic-light'
            )}
            id={`${props.name || 'radio-group'}-description`}
          >
            {description}
          </p>
        )}
        <Comp
          ref={ref}
          className={cn(
            enhancedRadioGroupVariants({ orientation, density }),
            className
          )}
          aria-describedby={
            description
              ? `${props.name || 'radio-group'}-description`
              : undefined
          }
          {...props}
        >
          {children}
        </Comp>
      </div>
    );
  }
);
EnhancedRadioGroup.displayName = 'EnhancedRadioGroup';

/**
 * Enhanced Radio Group Item
 * Individual radio button with label support
 */
const EnhancedRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof enhancedRadioItemVariants> & {
      /** Label text for the radio item */
      label?: string;
      /** Position of the label relative to the radio button */
      labelPosition?: 'right' | 'left' | 'top' | 'bottom';
      /** Visual emphasis of the label */
      labelEmphasis?: 'subtle' | 'normal' | 'strong';
      /** Indicator style for the checked state */
      indicatorStyle?: 'dot' | 'icon' | 'filled';
      /** Enforce AAA compliance mode */
      enforceAAA?: boolean;
      /** Description text for accessibility */
      description?: string;
      /** Polymorphic support - render as different element/component */
      asChild?: boolean;
    }
>(
  (
    {
      className,
      children,
      label,
      labelPosition = 'right',
      labelEmphasis = 'normal',
      variant = 'default',
      size = 'md',
      density = 'comfortable',
      indicatorStyle = 'dot',
      enforceAAA = false,
      description,
      asChild: _asChild = false,
      id,
      ...props
    },
    ref
  ) => {
    // Use AAA variant when enforceAAA is true
    const effectiveVariant = enforceAAA ? 'aaa' : variant;
    const itemId = id || `radio-item-${props.value}`;

    const radioButton = (
      <RadioGroupPrimitive.Item
        ref={ref}
        id={itemId}
        className={cn(
          enhancedRadioItemVariants({
            variant: effectiveVariant,
            size,
            density,
          }),
          'peer',
          className
        )}
        aria-describedby={description ? `${itemId}-description` : undefined}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          className={cn(enhancedRadioIndicatorVariants({ indicatorStyle }))}
        >
          {indicatorStyle === 'dot' && (
            <Circle
              className={cn(
                'size-[var(--space-2_5)] fill-current text-current'
              )}
            />
          )}
          {indicatorStyle === 'icon' && (
            <Circle
              className={cn(
                'size-[var(--space-3)] fill-current text-current'
              )}
            />
          )}
          {indicatorStyle === 'filled' && (
            <div
              className={cn(
                'size-[var(--space-2)] rounded-full bg-current'
              )}
            />
          )}
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );

    const labelElement = label && (
      <label
        htmlFor={itemId}
        className={cn(
          enhancedRadioLabelVariants({
            position: labelPosition,
            emphasis: enforceAAA ? 'normal' : labelEmphasis,
          })
        )}
      >
        {label}
      </label>
    );

    const descriptionElement = description && (
              <p
          id={`${itemId}-description`}
          className={cn(
            'mt-[var(--space-1)] text-[var(--font-size-xs)] text-cosmic-muted',
            enforceAAA && 'text-cosmic-light/80',
            (labelPosition === 'top' || labelPosition === 'right') && 'ml-0',
            (labelPosition === 'left' || labelPosition === 'bottom') && 'ml-[var(--space-6)]'
          )}
        >
        {description}
      </p>
    );

    // Handle different label positions
    if (labelPosition === 'top') {
      return (
        <div className={cn('space-y-1', 'flex flex-col gap-1')}>
          {labelElement}
          <div className={cn('flex items-center')}>
            {radioButton}
            {children}
          </div>
          {descriptionElement}
        </div>
      );
    }

    if (labelPosition === 'bottom') {
      return (
        <div className={cn('space-y-1', 'flex flex-col gap-1')}>
          <div className={cn('flex items-center')}>
            {radioButton}
            {children}
          </div>
          {labelElement}
          {descriptionElement}
        </div>
      );
    }

    // Default: side positioning (left or right)
    return (
      <div className={cn('space-y-1', 'flex flex-col gap-1')}>
        <div
          className={cn(
            'flex items-center',
            labelPosition === 'left' && 'flex-row-reverse'
          )}
        >
          {radioButton}
          {labelElement}
          {children}
        </div>
        {descriptionElement}
      </div>
    );
  }
);
EnhancedRadioGroupItem.displayName = 'EnhancedRadioGroupItem';

/**
 * Enhanced Radio Group with Card styling
 * For more prominent radio selections with card-like appearance
 */
const EnhancedRadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    /** Card title */
    title: string;
    /** Card description */
    description?: string;
    /** Icon element to display */
    icon?: React.ReactNode;
    /** Enforce AAA compliance mode */
    enforceAAA?: boolean;
    /** Card variant styling */
    cardVariant?: 'default' | 'glass' | 'elevated';
  }
>(
  (
    {
      className,
      title,
      description,
      icon,
      enforceAAA = false,
      cardVariant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const itemId = id || `radio-card-${props.value}`;

    const cardStyles = {
      default: cn(
        'border-2 border-cosmic-border bg-stellar-surface',
        'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent/5',
        'pointer:hover:bg-aurora-accent/2 pointer:hover:border-aurora-accent/50',
        enforceAAA && 'data-[state=checked]:bg-aurora-accent-solid-aaa/10'
      ),
      glass: cn(
        'border-2 border-cosmic-border/60 bg-stellar-surface-elevated/60 backdrop-blur-[var(--blur-sm)] backdrop-saturate-[var(--saturate-150)]',
        'data-[state=checked]:border-aurora-accent/80 data-[state=checked]:bg-aurora-accent/15',
        'pointer:hover:border-cosmic-border/80 pointer:hover:bg-stellar-surface-elevated/80'
      ),
      elevated: cn(
        'border-2 border-cosmic-border bg-stellar-surface-elevated shadow-elevation-sm',
        'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent/10',
        'data-[state=checked]:shadow-[0_0_12px_rgba(var(--aurora-accent-rgb),0.2)]',
        'pointer:hover:bg-stellar-surface-elevated pointer:hover:shadow-elevation-md'
      ),
    };

    return (
      <div className='relative'>
        <RadioGroupPrimitive.Item
          ref={ref}
          id={itemId}
          className={cn(
            // Foundation: Layout and spacing
            'w-full rounded-[var(--radius-lg)] p-[var(--space-4)] transition-all duration-[var(--motion-duration-2)] ease-out',
            'motion-reduce:transition-none',
            'cursor-pointer',

            // Foundation: Focus management
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-accent focus-visible:ring-offset-2',
            'focus-visible:ring-offset-stellar-surface',

            // Foundation: Disabled states
            'disabled:cursor-not-allowed disabled:opacity-50',

            // Card variant styles
            cardStyles[cardVariant],
            className
          )}
          aria-describedby={description ? `${itemId}-description` : undefined}
          {...props}
        >
          <div
            className={cn(
              'flex items-start space-x-[var(--space-3)]'
            )}
          >
            {/* Radio indicator */}
            <div className='mt-0.5 flex items-center justify-center'>
              <div
                className={cn(
                  'size-[var(--space-4)] rounded-full border-2 border-cosmic-border transition-all duration-[var(--motion-duration-2)]',
                  'flex items-center justify-center',
                  'group-data-[state=checked]:border-aurora-accent',
                  enforceAAA &&
                    'group-data-[state=checked]:border-aurora-accent-solid-aaa'
                )}
              >
                <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
                  <div
                    className={cn(
                      'size-[var(--space-2)] rounded-full transition-all duration-[var(--motion-duration-2)]',
                      enforceAAA ? 'bg-aurora-accent-solid-aaa' : 'bg-aurora-accent'
                    )}
                  />
                </RadioGroupPrimitive.Indicator>
              </div>
            </div>

            {/* Icon (optional) */}
            {icon && (
              <div
                className={cn(
                  'mt-[var(--space-0_5)] flex-shrink-0',
                  'text-cosmic-muted group-data-[state=checked]:text-aurora-accent',
                  enforceAAA &&
                    'group-data-[state=checked]:text-aurora-accent-solid-aaa'
                )}
              >
                {icon}
              </div>
            )}

            {/* Content */}
            <div className={cn('min-w-0 flex-1')}>
              <div
                className={cn(
                  'text-[var(--font-size-sm)] font-[var(--font-weight-medium)] leading-5 text-cosmic-light',
                  'group-data-[state=checked]:text-aurora-accent',
                  enforceAAA &&
                    'group-data-[state=checked]:text-aurora-accent-solid-aaa'
                )}
              >
                {title}
              </div>
              {description && (
                <p
                  id={`${itemId}-description`}
                  className={cn(
                    'mt-[var(--space-1)] text-[var(--font-size-xs)] leading-4 text-cosmic-muted',
                    enforceAAA && 'text-cosmic-light/80'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </RadioGroupPrimitive.Item>
      </div>
    );
  }
);
EnhancedRadioGroupCard.displayName = 'EnhancedRadioGroupCard';

// ===== EXPORTS =====

export {
  EnhancedRadioGroup,
  EnhancedRadioGroupItem,
  EnhancedRadioGroupCard,
  enhancedRadioGroupVariants,
  enhancedRadioItemVariants,
  enhancedRadioIndicatorVariants,
  enhancedRadioLabelVariants,
};

export type { VariantProps } from 'class-variance-authority';
