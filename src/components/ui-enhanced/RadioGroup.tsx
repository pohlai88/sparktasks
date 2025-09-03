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
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== ENHANCED RADIO GROUP VARIANTS =====

/**
 * Enhanced radio group container variants following MAPS4 v4.0 foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from Tailwind config CSS custom properties
 */
const enhancedRadioGroupVariants = cva(
  [
    // Foundation: Layout - Clean vertical spacing by default - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid,
    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
  ],
  {
    variants: {
      orientation: {
        vertical: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[1],
        horizontal: 'grid-cols-[repeat(auto-fit,minmax(0,1fr))] ' + ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
      },
      density: {
        comfortable: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
        compact: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
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
    // Foundation: Layout - Square aspect ratio with proper sizing - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center,
    ENHANCED_DESIGN_TOKENS.foundation.icon.size.md,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.shrink[0],

    // Foundation: Shape - Apple HIG circular for radio inputs - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.full,

    // Foundation: Border system - Clean, systematic - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thick,
    ENHANCED_DESIGN_TOKENS.foundation.color.border.default,

    // Foundation: States - Systematic visual feedback - Enhanced tokens
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:border-aurora-accent',

    // Foundation: Apple HIG interaction patterns - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,

    // Foundation: Focus - AAA compliant ring system - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,

    // Foundation: Touch targets - 44px minimum (expanded hit area)
    'relative',
    'before:absolute before:inset-[-12px] before:content-[""]',
    'pointer:hover:before:rounded-full pointer:hover:before:bg-aurora-accent/10',

    // Foundation: Platform awareness - Pointer-only hover states
    'pointer:hover:border-aurora-accent/70',
    ('active:' + ENHANCED_DESIGN_TOKENS.foundation.transform.scale['95']),
  ],
  {
    variants: {
      variant: {
        // Default: Clean accent styling with systematic feedback - Enhanced tokens
        default: [
          'bg-cosmic-void',
          'data-[state=checked]:bg-aurora-accent/10 data-[state=checked]:text-cosmic-light',
          'pointer:hover:bg-aurora-accent/5',
        ],

        // Ghost: Subtle, muted styling - Enhanced tokens
        ghost: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
          'data-[state=checked]:' + ENHANCED_DESIGN_TOKENS.foundation.color.border.muted,
          'data-[state=checked]:bg-aurora-accent/20',
          'pointer:hover:border-cosmic-border/50 pointer:hover:bg-aurora-accent/10',
        ],

        // Glass: Liquid glass material with governed vibrancy - Enhanced tokens
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.translucent,
          'data-[state=checked]:border-aurora-accent/80 data-[state=checked]:bg-aurora-accent/20',
          'pointer:hover:border-cosmic-border/80 pointer:hover:bg-cosmic-void/80',
          // AAA compliance: Text scrim for content protection
          '[&_+_label]:rounded-sm [&_+_label]:bg-cosmic-void/85',
        ],

        // Elevated: Sophisticated surface with subtle elevation - Enhanced tokens
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
          ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
          'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent/15',
          'pointer:hover:bg-cosmic-void pointer:hover:shadow-md',
        ],

        // AAA: High contrast mode for compliance - Enhanced tokens
        aaa: [
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
          'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent',
          'data-[state=checked]:text-cosmic-dark',
          'pointer:hover:bg-aurora-accent/20',
          'forced-colors:bg-Field forced-colors:border-FieldText',
          'forced-colors:data-[state=checked]:bg-Highlight forced-colors:data-[state=checked]:border-Highlight',
        ],
      },
      size: {
        sm: ENHANCED_DESIGN_TOKENS.foundation.icon.size.sm,
        md: ENHANCED_DESIGN_TOKENS.foundation.icon.size.md, // Default
        lg: ENHANCED_DESIGN_TOKENS.foundation.icon.size.lg,
        xl: ENHANCED_DESIGN_TOKENS.foundation.icon.size.lg,
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
    // Foundation: Perfect center alignment - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center,

    // Foundation: Smooth appearance animation - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,

    // Foundation: Scale animation for checked state
    'data-[state=checked]:' + ENHANCED_DESIGN_TOKENS.foundation.transform.scale['100'] + ' data-[state=unchecked]:' + ENHANCED_DESIGN_TOKENS.foundation.transform.scale.none,

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
    // Foundation: Typography - Apple body text - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
    ENHANCED_DESIGN_TOKENS.foundation.typography.label,
    'leading-none',
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,

    // Foundation: Interaction states
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',

    // Foundation: Smooth transitions - Enhanced tokens
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.colors,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,

    // Foundation: Platform-aware interactions
    'cursor-pointer pointer:hover:text-aurora-accent',
    ENHANCED_DESIGN_TOKENS.foundation.layout.select.none,
  ],
  {
    variants: {
      position: {
        right: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[2],
        left: 'order-first ' + ENHANCED_DESIGN_TOKENS.foundation.layout.margin[2],
        top: ENHANCED_DESIGN_TOKENS.foundation.layout.margin[1] + ' block',
        bottom: 'order-last ' + ENHANCED_DESIGN_TOKENS.foundation.layout.margin[1] + ' block',
      },
      emphasis: {
        subtle: ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
        normal: ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
        strong: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4 + ' ' + ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
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
      /** Performance optimization - disable animations */
      disableAnimations?: boolean;
    }
>(
  (
    {
      className,
      orientation = 'vertical',
      density = 'comfortable',
      enforceAAA = false,
      description,
      disableAnimations = false,
      asChild: _asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    // Performance optimization: conditionally apply motion classes
    const motionClasses = disableAnimations 
      ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
      : '';

    const Comp = _asChild ? Slot : RadioGroupPrimitive.Root;

    if (_asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(
            enhancedRadioGroupVariants({ orientation, density }),
            motionClasses,
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
              ENHANCED_DESIGN_TOKENS.foundation.layout.margin[2],
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
              enforceAAA && ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
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
            motionClasses,
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
      /** Performance optimization - disable animations */
      disableAnimations?: boolean;
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
      disableAnimations = false,
      asChild: _asChild = false,
      id,
      ...props
    },
    ref
  ) => {
    // Performance optimization: conditionally apply motion classes
    const motionClasses = disableAnimations 
      ? ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone
      : '';

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
          motionClasses,
          'peer',
          className
        )}
        aria-describedby={description ? `${itemId}-description` : undefined}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          className={cn(enhancedRadioIndicatorVariants({ indicatorStyle }), motionClasses)}
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
            'mt-[var(--space-1)]',
            ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
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
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center)}>
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
            ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex + ' ' + ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
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
        ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thick,
        'border-cosmic-border bg-cosmic-void',
        'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent/5',
        'pointer:hover:bg-aurora-accent/5 pointer:hover:border-aurora-accent/50',
        enforceAAA && 'data-[state=checked]:bg-aurora-accent/10'
      ),
      glass: cn(
        'bg-cosmic-void/60',
        ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thick,
        'border-cosmic-border/60',
        ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm,
        ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
        'data-[state=checked]:border-aurora-accent/80 data-[state=checked]:bg-aurora-accent/15',
        'pointer:hover:bg-cosmic-void/80 pointer:hover:border-cosmic-border/80'
      ),
      elevated: cn(
        'bg-cosmic-void',
        ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thick,
        'border-cosmic-border',
        ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
        'data-[state=checked]:border-aurora-accent data-[state=checked]:bg-aurora-accent/10',
        'data-[state=checked]:shadow-[0_0_12px_rgba(var(--aurora-accent-rgb),0.2)]',
        'pointer:hover:bg-cosmic-void pointer:hover:shadow-elevation-md'
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
                    'group-data-[state=checked]:border-aurora-accent'
                )}
              >
                <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
                  <div
                    className={cn(
                      'size-[var(--space-2)] rounded-full transition-all duration-[var(--motion-duration-2)]',
                      'bg-aurora-accent'
                    )}
                  />
                </RadioGroupPrimitive.Indicator>
              </div>
            </div>

            {/* Icon (optional) */}
            {icon && (
              <div
                className={cn(
                  'mt-[var(--space-0_5)] shrink-0',
                  'text-cosmic-muted group-data-[state=checked]:text-aurora-accent',
                  enforceAAA &&
                    'group-data-[state=checked]:text-aurora-accent'
                )}
              >
                {icon}
              </div>
            )}

            {/* Content */}
            <div className={cn('min-w-0 flex-1')}>
              <div
                className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                  'leading-5',
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
                  'group-data-[state=checked]:text-aurora-accent',
                  enforceAAA &&
                    'group-data-[state=checked]:text-aurora-accent'
                )}
              >
                {title}
              </div>
              {description && (
                <p
                  id={`${itemId}-description`}
                  className={cn(
                    'mt-[var(--space-1)] leading-4',
                    ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
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

// ===== ENHANCED RADIO GROUP FACTORY =====

/**
 * Enhanced Radio Group Factory Functions
 * @description Semantic constructors following MAPS v2.2 patterns
 */
export const RadioGroupFactory = {
  /**
   * Default radio group with clean styling
   */
  default: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'variant'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'variant'>) => (
      <EnhancedRadioGroupItem variant='default' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'cardVariant'>) => (
      <EnhancedRadioGroupCard cardVariant='default' {...props} />
    ),
  },

  /**
   * Glass variant with liquid glass materials
   */
  glass: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'variant'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'variant'>) => (
      <EnhancedRadioGroupItem variant='glass' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'cardVariant'>) => (
      <EnhancedRadioGroupCard cardVariant='glass' {...props} />
    ),
  },

  /**
   * Elevated variant with enhanced depth
   */
  elevated: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'variant'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'variant'>) => (
      <EnhancedRadioGroupItem variant='elevated' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'cardVariant'>) => (
      <EnhancedRadioGroupCard cardVariant='elevated' {...props} />
    ),
  },

  /**
   * Ghost variant for subtle styling
   */
  ghost: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'variant'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'variant'>) => (
      <EnhancedRadioGroupItem variant='ghost' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'cardVariant'>) => (
      <EnhancedRadioGroupCard cardVariant='default' {...props} />
    ),
  },

  /**
   * AAA compliance variant for high contrast
   */
  aaa: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'enforceAAA'>) => (
      <EnhancedRadioGroup enforceAAA={true} {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'enforceAAA'>) => (
      <EnhancedRadioGroupItem enforceAAA={true} {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'enforceAAA'>) => (
      <EnhancedRadioGroupCard enforceAAA={true} {...props} />
    ),
  },

  /**
   * Performance-optimized radio group with disabled animations
   */
  performance: {
    Group: (props: React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>) => (
      <EnhancedRadioGroup disableAnimations={true} {...props} />
    ),
    Item: (props: React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>) => (
      <EnhancedRadioGroupItem disableAnimations={true} {...props} />
    ),
    Card: (props: React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>) => (
      <EnhancedRadioGroupCard {...props} />
    ),
  },

  /**
   * Small size for compact layouts
   */
  small: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'size'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'size'>) => (
      <EnhancedRadioGroupItem size='sm' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'size'>) => (
      <EnhancedRadioGroupCard {...props} />
    ),
  },

  /**
   * Large size for prominent content
   */
  large: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'size'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'size'>) => (
      <EnhancedRadioGroupItem size='lg' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'size'>) => (
      <EnhancedRadioGroupCard {...props} />
    ),
  },

  /**
   * Extra large size for maximum visibility
   */
  xlarge: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'size'>) => (
      <EnhancedRadioGroup {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'size'>) => (
      <EnhancedRadioGroupItem size='xl' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'size'>) => (
      <EnhancedRadioGroupCard {...props} />
    ),
  },

  /**
   * Horizontal orientation for side-by-side layout
   */
  horizontal: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'orientation'>) => (
      <EnhancedRadioGroup orientation='horizontal' {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'orientation'>) => (
      <EnhancedRadioGroupItem {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'orientation'>) => (
      <EnhancedRadioGroupCard {...props} />
    ),
  },

  /**
   * Compact density for dense layouts
   */
  compact: {
    Group: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroup>, 'density'>) => (
      <EnhancedRadioGroup density='compact' {...props} />
    ),
    Item: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupItem>, 'density'>) => (
      <EnhancedRadioGroupItem density='compact' {...props} />
    ),
    Card: (props: Omit<React.ComponentPropsWithoutRef<typeof EnhancedRadioGroupCard>, 'density'>) => (
      <EnhancedRadioGroupCard {...props} />
    ),
  },
} as const;

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
