import * as React from 'react';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

// ===== PROGRESS BAR TYPES & INTERFACES =====

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
export type ProgressBarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value (0-100) */
  value?: number;
  /** Maximum progress value (default: 100) */
  max?: number;
  /** Visual style variant */
  variant?: ProgressBarVariant;
  /** Size of the progress bar */
  size?: ProgressBarSize;
  /** Whether to show percentage text */
  showPercentage?: boolean;
  /** Whether to show value/max text */
  showValue?: boolean;
  /** Optional label above the progress bar */
  label?: string;
  /** Optional description below the progress bar */
  description?: string;
  /** Whether the progress is indeterminate/loading */
  indeterminate?: boolean;
  /** Whether to animate with pulse effect */
  pulse?: boolean;
  /** Custom class for the container */
  containerClassName?: string;
  /** Custom class for the progress indicator */
  indicatorClassName?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Accessibility labelled by */
  'aria-labelledby'?: string;
  /** Accessibility described by */
  'aria-describedby'?: string;
  // Enterprise features
  /** Priority level for accessibility */
  priority?: 'low' | 'normal' | 'high';
  /** Whether to announce progress changes to screen readers */
  announceProgress?: boolean;
  /** Custom progress format function */
  formatValue?: (value: number, max: number) => string;
  /** Metadata for enterprise logging */
  metadata?: Record<string, unknown>;
}

// ===== PROGRESS BAR VARIANT STYLES =====

const progressVariantStyles = {
  primary: {
    background: DESIGN_TOKENS.recipe.progress.backgroundPrimary,
    indicator: DESIGN_TOKENS.recipe.progress.primary,
  },
  success: {
    background: DESIGN_TOKENS.recipe.progress.backgroundSuccess,
    indicator: DESIGN_TOKENS.recipe.progress.success,
  },
  warning: {
    background: DESIGN_TOKENS.recipe.progress.backgroundWarning,
    indicator: DESIGN_TOKENS.recipe.progress.warning,
  },
  error: {
    background: DESIGN_TOKENS.recipe.progress.backgroundError,
    indicator: DESIGN_TOKENS.recipe.progress.error,
  },
  info: {
    background: DESIGN_TOKENS.recipe.progress.backgroundInfo,
    indicator: DESIGN_TOKENS.recipe.progress.info,
  },
} as const;

const progressSizeStyles = {
  sm: DESIGN_TOKENS.recipe.progress.sm,
  md: DESIGN_TOKENS.recipe.progress.md,
  lg: DESIGN_TOKENS.recipe.progress.lg,
  xl: DESIGN_TOKENS.recipe.progress.xl,
} as const;

// ===== PROGRESS BAR COMPONENT =====

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      variant = 'primary',
      size = 'md',
      showPercentage = false,
      showValue = false,
      label,
      description,
      indeterminate = false,
      pulse = false,
      containerClassName,
      indicatorClassName,
      priority = 'normal',
      announceProgress = false,
      formatValue,
      metadata,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const previousValueRef = React.useRef(value);
    const labelId = React.useId();
    const descriptionId = React.useId();

    // Normalize progress value
    const normalizedValue = React.useMemo(() => {
      if (indeterminate) return 0;
      return Math.min(Math.max(value, 0), max);
    }, [value, max, indeterminate]);

    // Calculate percentage
    const percentage = React.useMemo(() => {
      if (indeterminate) return 0;
      return max > 0 ? Math.round((normalizedValue / max) * 100) : 0;
    }, [normalizedValue, max, indeterminate]);

    // Announce progress changes for accessibility
    React.useEffect(() => {
      if (announceProgress && !indeterminate && value !== previousValueRef.current) {
        const announcement = `Progress: ${percentage}%`;
        
        // Create a live region announcement
        const announcement_el = document.createElement('div');
        announcement_el.setAttribute('aria-live', priority === 'high' ? 'assertive' : 'polite');
        announcement_el.setAttribute('aria-atomic', 'true');
        announcement_el.className = 'sr-only';
        announcement_el.textContent = announcement;
        
        document.body.appendChild(announcement_el);
        
        // Clean up after announcement
        setTimeout(() => {
          document.body.removeChild(announcement_el);
        }, 1000);
        
        previousValueRef.current = value;
      }
    }, [value, percentage, announceProgress, indeterminate, priority]);

    const variantStyles = progressVariantStyles[variant];

    // Format display value
    const formattedValue = React.useMemo(() => {
      if (formatValue) {
        return formatValue(normalizedValue, max);
      }
      return `${normalizedValue}/${max}`;
    }, [normalizedValue, max, formatValue]);

    // Composite aria attributes
    const compositeAriaLabel = ariaLabel || 
      (label ? undefined : `Progress ${percentage}%`);
    
    const compositeAriaLabelledBy = ariaLabelledBy || 
      (label ? labelId : undefined);
    
    const compositeAriaDescribedBy = ariaDescribedBy || 
      (description ? descriptionId : undefined);

    return (
      <div
        ref={ref}
        className={combineTokens(
          'w-full',
          className
        )}
        {...props}
      >
        {/* Label */}
        {label && (
          <div
            id={labelId}
            className={DESIGN_TOKENS.recipe.progress.label}
          >
            {label}
          </div>
        )}

        {/* Progress bar container with optional percentage/value */}
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div
            className={combineTokens(
              DESIGN_TOKENS.recipe.progress.base,
              progressSizeStyles[size],
              variantStyles.background,
              containerClassName
            )}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : normalizedValue}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={compositeAriaLabel}
            aria-labelledby={compositeAriaLabelledBy}
            aria-describedby={compositeAriaDescribedBy}
            data-indeterminate={indeterminate}
            data-variant={variant}
            data-size={size}
            data-metadata={metadata ? JSON.stringify(metadata) : undefined}
          >
            {/* Progress indicator */}
            <div
              className={combineTokens(
                DESIGN_TOKENS.recipe.progress.indicator,
                variantStyles.indicator,
                indeterminate && DESIGN_TOKENS.recipe.progress.indeterminate,
                pulse && DESIGN_TOKENS.recipe.progress.pulse,
                indicatorClassName
              )}
              style={{
                width: indeterminate ? '100%' : `${percentage}%`,
                transform: indeterminate ? 'translateX(-100%)' : undefined,
                animation: indeterminate 
                  ? 'progressIndeterminate 1.5s ease-in-out infinite' 
                  : undefined,
              }}
            />
          </div>

          {/* Percentage display */}
          {showPercentage && !indeterminate && (
            <div className={combineTokens(
              DESIGN_TOKENS.recipe.progress.percentage,
              'min-w-[3rem] tabular-nums'
            )}>
              {percentage}%
            </div>
          )}

          {/* Value display */}
          {showValue && !indeterminate && (
            <div className={combineTokens(
              DESIGN_TOKENS.recipe.progress.percentage,
              'min-w-[4rem] tabular-nums'
            )}>
              {formattedValue}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div
            id={descriptionId}
            className={DESIGN_TOKENS.recipe.progress.description}
          >
            {description}
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// ===== PROGRESS BAR VARIANTS =====

export const ProgressBarPrimary = React.forwardRef<HTMLDivElement, Omit<ProgressBarProps, 'variant'>>(
  (props, ref) => <ProgressBar ref={ref} variant="primary" {...props} />
);
ProgressBarPrimary.displayName = 'ProgressBarPrimary';

export const ProgressBarSuccess = React.forwardRef<HTMLDivElement, Omit<ProgressBarProps, 'variant'>>(
  (props, ref) => <ProgressBar ref={ref} variant="success" {...props} />
);
ProgressBarSuccess.displayName = 'ProgressBarSuccess';

export const ProgressBarWarning = React.forwardRef<HTMLDivElement, Omit<ProgressBarProps, 'variant'>>(
  (props, ref) => <ProgressBar ref={ref} variant="warning" {...props} />
);
ProgressBarWarning.displayName = 'ProgressBarWarning';

export const ProgressBarError = React.forwardRef<HTMLDivElement, Omit<ProgressBarProps, 'variant'>>(
  (props, ref) => <ProgressBar ref={ref} variant="error" {...props} />
);
ProgressBarError.displayName = 'ProgressBarError';

export const ProgressBarInfo = React.forwardRef<HTMLDivElement, Omit<ProgressBarProps, 'variant'>>(
  (props, ref) => <ProgressBar ref={ref} variant="info" {...props} />
);
ProgressBarInfo.displayName = 'ProgressBarInfo';

// ===== PROGRESS BAR HOOK =====

export interface UseProgressBarProps {
  /** Initial value */
  initialValue?: number;
  /** Maximum value */
  max?: number;
  /** Auto-increment interval in ms */
  autoIncrement?: number;
  /** Increment step for auto-increment */
  step?: number;
  /** Callback when progress completes */
  onComplete?: () => void;
  /** Callback when progress changes */
  onChange?: (value: number, percentage: number) => void;
}

export const useProgressBar = ({
  initialValue = 0,
  max = 100,
  autoIncrement,
  step = 1,
  onComplete,
  onChange,
}: UseProgressBarProps = {}) => {
  const [value, setValue] = React.useState(initialValue);
  const intervalRef = React.useRef<NodeJS.Timeout>();

  // Calculate percentage
  const percentage = React.useMemo(() => {
    return max > 0 ? Math.round((value / max) * 100) : 0;
  }, [value, max]);

  // Handle value changes
  React.useEffect(() => {
    onChange?.(value, percentage);
    
    if (value >= max) {
      onComplete?.();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
  }, [value, percentage, max, onChange, onComplete]);

  // Auto-increment functionality
  React.useEffect(() => {
    if (autoIncrement && value < max) {
      intervalRef.current = setInterval(() => {
        setValue(prev => {
          const next = prev + step;
          return next >= max ? max : next;
        });
      }, autoIncrement);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [autoIncrement, step, value, max]);

  const increment = React.useCallback((amount = step) => {
    setValue(prev => Math.min(prev + amount, max));
  }, [step, max]);

  const decrement = React.useCallback((amount = step) => {
    setValue(prev => Math.max(prev - amount, 0));
  }, [step]);

  const reset = React.useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  const setProgress = React.useCallback((newValue: number) => {
    setValue(Math.min(Math.max(newValue, 0), max));
  }, [max]);

  return {
    value,
    percentage,
    increment,
    decrement,
    reset,
    setProgress,
    isComplete: value >= max,
  };
};

// ===== PROGRESS BAR CONTEXT =====

export interface ProgressBarContextValue {
  /** Global progress state */
  progress: number;
  /** Set global progress */
  setProgress: (value: number) => void;
  /** Increment global progress */
  increment: (amount?: number) => void;
  /** Reset global progress */
  reset: () => void;
  /** Whether global progress is active */
  isActive: boolean;
  /** Set global progress active state */
  setActive: (active: boolean) => void;
}

const ProgressBarContext = React.createContext<ProgressBarContextValue | undefined>(undefined);

export interface ProgressBarProviderProps {
  children: React.ReactNode;
  /** Initial progress value */
  initialValue?: number;
  /** Maximum progress value */
  max?: number;
  /** Auto-reset after completion */
  autoReset?: boolean;
  /** Callback when progress completes */
  onComplete?: () => void;
}

export const ProgressBarProvider: React.FC<ProgressBarProviderProps> = ({
  children,
  initialValue = 0,
  max = 100,
  autoReset = false,
  onComplete,
}) => {
  const [progress, setProgressState] = React.useState(initialValue);
  const [isActive, setActive] = React.useState(false);

  const setProgress = React.useCallback((value: number) => {
    const normalizedValue = Math.min(Math.max(value, 0), max);
    setProgressState(normalizedValue);
    
    if (normalizedValue >= max) {
      onComplete?.();
      if (autoReset) {
        setTimeout(() => {
          setProgressState(initialValue);
          setActive(false);
        }, 1000);
      }
    }
  }, [max, onComplete, autoReset, initialValue]);

  const increment = React.useCallback((amount = 1) => {
    setProgress(progress + amount);
  }, [progress, setProgress]);

  const reset = React.useCallback(() => {
    setProgressState(initialValue);
    setActive(false);
  }, [initialValue]);

  const contextValue: ProgressBarContextValue = {
    progress,
    setProgress,
    increment,
    reset,
    isActive,
    setActive,
  };

  return (
    <ProgressBarContext.Provider value={contextValue}>
      {children}
    </ProgressBarContext.Provider>
  );
};

export const useProgressBarContext = (): ProgressBarContextValue => {
  const context = React.useContext(ProgressBarContext);
  if (!context) {
    throw new Error('useProgressBarContext must be used within a ProgressBarProvider');
  }
  return context;
};

// ===== EXPORTS =====

export default ProgressBar;
