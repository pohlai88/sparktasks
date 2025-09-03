/**
 * PanelGroup Component
 *
 * Resizable panel system using react-resizable-panels for creating
 * sophisticated layouts with user-controlled sizing.
 *
 * Architectural Features:
 * - Integration with react-resizable-panels
 * - Persistent layout state
 * - Touch and keyboard accessibility
 * - Minimum and maximum size constraints
 * - Smooth transitions and feedback
 *
 * Part of the MAPS v3.0 layout enhanced component system.
 */

import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';
import { forwardRef } from 'react';
import {
  PanelGroup as RPPanelGroup,
  Panel as RPPanel,
  PanelResizeHandle as RPPanelResizeHandle,
  
  type PanelGroupProps as RPPanelGroupProps,
  type PanelProps as RPPanelProps,
  type PanelResizeHandleProps as RPPanelResizeHandleProps,
} from 'react-resizable-panels';

import { cn } from '../../../utils/cn';
import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';

// Import react-resizable-panels components

// PanelGroup Variants
const panelGroupVariants = cva(
  [
    // Base styles
    ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
    ENHANCED_DESIGN_TOKENS.foundation.layout.height.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    // Enhanced styling
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.md,
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
  ],
  {
    variants: {
      direction: {
        horizontal: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
        vertical: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.col,
      },
      spacing: {
        none: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.none,
        tight: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs,
        normal: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm,
        relaxed: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
        loose: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg,
      },
      borderStyle: {
        none: ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.none,
        subtle: cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle
        ),
        defined: cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thin,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default
        ),
        prominent: cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.thin,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora
        ),
      },
      surface: {
        default: '',
        elevated: ENHANCED_DESIGN_TOKENS.foundation.elevation.sm,
        floating: ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
        overlay: cn(
          ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.sm
        ),
      },
    },
    defaultVariants: {
      direction: 'horizontal',
      spacing: 'normal',
      borderStyle: 'subtle',
      surface: 'default',
    },
  }
);

// Panel Variants
const panelVariants = cva(
  [
    // Base styles
    ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.col,
    ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.hidden,
  ],
  {
    variants: {
      padding: {
        none: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[0],
        tight: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[2],
        normal: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[4],
        relaxed: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[6],
        loose: ENHANCED_DESIGN_TOKENS.foundation.layout.padding[8],
      },
      scrollable: {
        true: ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.auto,
        false: ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.hidden,
      },
      surface: {
        default: '',
        contrast: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
        accent: ENHANCED_DESIGN_TOKENS.foundation.color.brand.accent.bg,
        warning: ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.subtle,
        success: ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.subtle,
      },
    },
    defaultVariants: {
      padding: 'normal',
      scrollable: false,
      surface: 'default',
    },
  }
);

// ResizeHandle Variants
const resizeHandleVariants = cva(
  [
    // Base styles
    ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative,
    ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
    ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center,
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.colors,
    ENHANCED_DESIGN_TOKENS.foundation.animation.duration[200],
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
  ],
  {
    variants: {
      direction: {
        horizontal: cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.height.full,
          'w-2',
          'cursor-col-resize'
        ),
        vertical: cn(
          'h-2',
          ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
          'cursor-row-resize'
        ),
      },
      handleStyle: {
        subtle: ENHANCED_DESIGN_TOKENS.foundation.layout.background.transparent,
        visible: ENHANCED_DESIGN_TOKENS.foundation.color.surface.panel,
        prominent: ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
        accent: ENHANCED_DESIGN_TOKENS.foundation.color.brand.accent.bg,
      },
      withHandle: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      direction: 'horizontal',
      handleStyle: 'subtle',
      withHandle: true,
    },
  }
);

// Component Prop Types
export interface PanelGroupProps
  extends Omit<RPPanelGroupProps, 'className' | 'direction'>,
    VariantProps<typeof panelGroupVariants> {
  className?: string;
  persistId?: string;
  onLayoutChange?: (layout: number[]) => void;
}

export interface PanelProps
  extends Omit<RPPanelProps, 'className'>,
    VariantProps<typeof panelVariants> {
  className?: string;
  title?: string;
  collapsible?: boolean;
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
}

export interface PanelResizeHandleProps
  extends Omit<RPPanelResizeHandleProps, 'className'>,
    Omit<VariantProps<typeof resizeHandleVariants>, 'handleStyle'> {
  className?: string;
  withIcon?: boolean;
  customIcon?: React.ReactNode;
  handleStyle?: 'subtle' | 'visible' | 'prominent' | 'accent';
}

// Handle Icons Component
const HandleIcon: React.FC<{ direction: 'horizontal' | 'vertical' }> = ({
  direction,
}) => {
  if (direction === 'horizontal') {
    return (
      <svg
        width='4'
        height='16'
        viewBox='0 0 4 16'
        fill='currentColor'
        className='text-gray-400 dark:text-gray-500'
      >
        <circle cx='1' cy='2' r='1' />
        <circle cx='1' cy='6' r='1' />
        <circle cx='1' cy='10' r='1' />
        <circle cx='1' cy='14' r='1' />
        <circle cx='3' cy='2' r='1' />
        <circle cx='3' cy='6' r='1' />
        <circle cx='3' cy='10' r='1' />
        <circle cx='3' cy='14' r='1' />
      </svg>
    );
  }

  return (
    <svg
      width='16'
      height='4'
      viewBox='0 0 16 4'
      fill='currentColor'
      className='text-gray-400 dark:text-gray-500'
    >
      <circle cx='2' cy='1' r='1' />
      <circle cx='6' cy='1' r='1' />
      <circle cx='10' cy='1' r='1' />
      <circle cx='14' cy='1' r='1' />
      <circle cx='2' cy='3' r='1' />
      <circle cx='6' cy='3' r='1' />
      <circle cx='10' cy='3' r='1' />
      <circle cx='14' cy='3' r='1' />
    </svg>
  );
};

// PanelGroup Component
export const PanelGroup = forwardRef<any, PanelGroupProps>(
  (
    {
      className,
      direction = 'horizontal',
      spacing,
      borderStyle,
      surface,
      persistId,
      onLayoutChange,
      children,
      ...props
    },
    ref
  ) => {
    const groupClassName = cn(
      panelGroupVariants({
        direction,
        spacing,
        borderStyle,
        surface,
      }),
      className
    );

    return (
      <RPPanelGroup
        ref={ref}
        direction={direction || 'horizontal'}
        className={groupClassName}
        id={persistId}
        onLayout={onLayoutChange}
        {...props}
      >
        {children}
      </RPPanelGroup>
    );
  }
);

PanelGroup.displayName = 'PanelGroup';

// Panel Component
export const Panel = forwardRef<any, PanelProps>(
  (
    {
      className,
      padding,
      scrollable,
      surface,
      title,
      minSize,
      maxSize,
      defaultSize,
      children,
      ...props
    },
    ref
  ) => {
    const panelClassName = cn(
      panelVariants({
        padding,
        scrollable,
        surface,
      }),
      className
    );

    const panelContent = (
      <>
        {title && (
          <div
            className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.margin[4],
              ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.shrink[0],
              ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
              ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle
            )}
          >
            <h3
              className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}
            >
              {title}
            </h3>
          </div>
        )}
        <div className={cn('min-h-0', ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow[1])}>{children}</div>
      </>
    );

    return (
      <RPPanel
        ref={ref}
        className={panelClassName}
        minSize={minSize}
        maxSize={maxSize}
        defaultSize={defaultSize}
        {...props}
      >
        {panelContent}
      </RPPanel>
    );
  }
);

Panel.displayName = 'Panel';

// PanelResizeHandle Component
export const PanelResizeHandle = forwardRef<
  HTMLDivElement,
  PanelResizeHandleProps
>(
  ({
    className,
    direction = 'horizontal',
    handleStyle,
    withHandle,
    withIcon = true,
    customIcon,
    ...props
  }) => {
    const handleClassName = cn(
      resizeHandleVariants({
        direction,
        handleStyle,
        withHandle,
      }),
      className
    );

    const iconContent =
      withIcon &&
      (customIcon || <HandleIcon direction={direction || 'horizontal'} />);

    return (
      <RPPanelResizeHandle className={handleClassName} {...props}>
        {iconContent}
      </RPPanelResizeHandle>
    );
  }
);

PanelResizeHandle.displayName = 'PanelResizeHandle';

// Export everything needed


export {type ImperativePanelHandle} from 'react-resizable-panels';