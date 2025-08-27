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

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Import react-resizable-panels components
import { 
  PanelGroup as RPPanelGroup,
  Panel as RPPanel,
  PanelResizeHandle as RPPanelResizeHandle,
  type ImperativePanelHandle,
  type PanelGroupProps as RPPanelGroupProps,
  type PanelProps as RPPanelProps,
  type PanelResizeHandleProps as RPPanelResizeHandleProps
} from 'react-resizable-panels';

// PanelGroup Variants
const panelGroupVariants = cva(
  [
    // Base styles
    'relative flex h-full w-full',
    // Enhanced styling
    'rounded-md',
    'bg-background',
  ],
  {
    variants: {
      direction: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      spacing: {
        none: 'gap-0',
        tight: 'gap-1',
        normal: 'gap-2',
        relaxed: 'gap-4',
        loose: 'gap-6',
      },
      borderStyle: {
        none: 'border-0',
        subtle: 'border border-gray-200 dark:border-gray-700',
        defined: 'border-2 border-gray-300 dark:border-gray-600',
        prominent: 'border-2 border-blue-300 dark:border-blue-600',
      },
      surface: {
        default: '',
        elevated: 'shadow-sm',
        floating: 'shadow-md',
        overlay: 'shadow-lg backdrop-blur-sm',
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
    'relative flex flex-col overflow-hidden',
    // Standard padding
    'p-4',
  ],
  {
    variants: {
      padding: {
        none: 'p-0',
        tight: 'p-2',
        normal: 'p-4',
        relaxed: 'p-6',
        loose: 'p-8',
      },
      scrollable: {
        true: 'overflow-auto',
        false: 'overflow-hidden',
      },
      surface: {
        default: '',
        contrast: 'bg-gray-50 dark:bg-gray-800',
        accent: 'bg-blue-50 dark:bg-blue-900/20',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20',
        success: 'bg-green-50 dark:bg-green-900/20',
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
    'relative flex items-center justify-center transition-colors',
    'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    'focus:bg-blue-200 dark:focus:bg-blue-800/50',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    // Interactive styling
    'duration-200',
  ],
  {
    variants: {
      direction: {
        horizontal: 'w-2 h-full cursor-col-resize',
        vertical: 'h-2 w-full cursor-row-resize',
      },
      handleStyle: {
        subtle: 'bg-transparent',
        visible: 'bg-gray-200 dark:bg-gray-700',
        prominent: 'bg-gray-300 dark:bg-gray-600',
        accent: 'bg-blue-200 dark:bg-blue-700',
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
const HandleIcon: React.FC<{ direction: 'horizontal' | 'vertical' }> = ({ direction }) => {
  if (direction === 'horizontal') {
    return (
      <svg
        width="4"
        height="16"
        viewBox="0 0 4 16"
        fill="currentColor"
        className="text-gray-400 dark:text-gray-500"
      >
        <circle cx="1" cy="2" r="1" />
        <circle cx="1" cy="6" r="1" />
        <circle cx="1" cy="10" r="1" />
        <circle cx="1" cy="14" r="1" />
        <circle cx="3" cy="2" r="1" />
        <circle cx="3" cy="6" r="1" />
        <circle cx="3" cy="10" r="1" />
        <circle cx="3" cy="14" r="1" />
      </svg>
    );
  }

  return (
    <svg
      width="16"
      height="4"
      viewBox="0 0 16 4"
      fill="currentColor"
      className="text-gray-400 dark:text-gray-500"
    >
      <circle cx="2" cy="1" r="1" />
      <circle cx="6" cy="1" r="1" />
      <circle cx="10" cy="1" r="1" />
      <circle cx="14" cy="1" r="1" />
      <circle cx="2" cy="3" r="1" />
      <circle cx="6" cy="3" r="1" />
      <circle cx="10" cy="3" r="1" />
      <circle cx="14" cy="3" r="1" />
    </svg>
  );
};

// PanelGroup Component
export const PanelGroup = forwardRef<
  any,
  PanelGroupProps
>(({ 
  className,
  direction = 'horizontal',
  spacing,
  borderStyle,
  surface,
  persistId,
  onLayoutChange,
  children,
  ...props 
}, ref) => {
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
});

PanelGroup.displayName = 'PanelGroup';

// Panel Component
export const Panel = forwardRef<
  any,
  PanelProps
>(({ 
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
}, ref) => {
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
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
      )}
      <div className="flex-1 min-h-0">
        {children}
      </div>
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
});

Panel.displayName = 'Panel';

// PanelResizeHandle Component
export const PanelResizeHandle = forwardRef<
  HTMLDivElement,
  PanelResizeHandleProps
>(({ 
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

  const iconContent = withIcon && (
    customIcon || <HandleIcon direction={direction || 'horizontal'} />
  );

  return (
    <RPPanelResizeHandle
      className={handleClassName}
      {...props}
    >
      {iconContent}
    </RPPanelResizeHandle>
  );
});

PanelResizeHandle.displayName = 'PanelResizeHandle';

// Export everything needed
export type { ImperativePanelHandle };
