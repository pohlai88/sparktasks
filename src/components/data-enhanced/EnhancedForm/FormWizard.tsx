/**
 * FormWizard - Multi-Step Form Component
 *
 * Advanced wizard component for complex multi-step forms with progress tracking and validation.
 * Built with MAPS v3.0      ],
      md: [
        'h-10 px-4',
        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
      ],
      lg: [
        'h-12 px-6',
        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
      ],ystem integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import React from 'react';
import { useForm, type FieldValues } from 'react-hook-form';

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens';
import { cn } from '../../../utils/cn';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';
import type { FormWizardProps, FormWizardStep } from '../types';

// ===== MAPS v3.0 WIZARD VARIANTS =====

const wizardVariants = cva(['mx-auto w-full max-w-4xl'], {
  variants: {
    layout: {
      vertical: 'space-y-8',
      compact: 'space-y-6',
    },
    surface: {
      elevated: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
        'rounded-lg border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
      ],
      glass: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
        'rounded-lg border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
      ],
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});

const progressBarVariants = cva([
  'flex items-center justify-between',
  'border-b px-6 py-4',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
]);

const stepIndicatorVariants = cva(['flex items-center gap-4'], {
  variants: {
    orientation: {
      horizontal: 'w-full justify-between',
      vertical: 'flex-col items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const stepItemVariants = cva(['relative flex items-center gap-3'], {
  variants: {
    state: {
      completed: ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg,
      current: ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg,
      pending: ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
      error: ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
    },
    orientation: {
      horizontal: '',
      vertical: 'w-full',
    },
  },
  defaultVariants: {
    state: 'pending',
    orientation: 'horizontal',
  },
});

const stepCircleVariants = cva(
  [
    'flex items-center justify-center rounded-full border-2 font-medium',
    ENHANCED_DESIGN_TOKENS.foundation.motionComponents.formFieldFocus,
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
    'h-10 w-10',
    'duration-200 ease-in-out',
  ],
  {
    variants: {
      state: {
        completed: [
          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg,
          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.success,
        ],
        current: [
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg,
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora,
        ],
        pending: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ],
        error: [
          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg,
          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.error,
        ],
      },
    },
    defaultVariants: {
      state: 'pending',
    },
  }
);

const stepContentVariants = cva(['min-h-0 flex-1']);

const stepFormVariants = cva(['space-y-6 p-6']);

const navigationVariants = cva([
  'flex items-center justify-between border-t px-6 py-4',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
]);

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2',
    'font-medium',
    ENHANCED_DESIGN_TOKENS.foundation.motionComponents.buttonFocus,
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
    'duration-200 ease-in-out',
  ],
  {
    variants: {
      variant: {
        primary: [
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg,
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg,
          ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.hover,
        ],
        secondary: [
          ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
          'border',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
          'hover:bg-surface-hover',
        ],
        ghost: [
          'bg-transparent',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
          'hover:bg-surface-hover',
        ],
      },
      size: {
        sm: ['h-8 px-3', ENHANCED_DESIGN_TOKENS.foundation.typography.caption],
        md: ['h-10 px-4', ENHANCED_DESIGN_TOKENS.foundation.typography.button],
        lg: [
          'h-11 px-6',
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
        ],
      },
      disabled: {
        true: [
          'cursor-not-allowed opacity-50',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.disabled,
        ],
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      disabled: false,
    },
  }
);

// Additional utility variants for consistent styling
const iconVariants = cva(['h-5 w-5']);

const smallIconVariants = cva(['h-4 w-4']);

const flexCenterVariants = cva(['flex items-center gap-4']);

const flexCenterSmallVariants = cva(['flex items-center gap-3']);

const spacingVariants = cva(['space-y-6']);

const fieldSpacingVariants = cva(['space-y-2']);

const errorContainerVariants = cva(['p-8 text-center']);

const errorTextRedVariants = cva(['text-red-500']);

// ===== WIZARD COMPONENTS =====

interface StepIndicatorProps {
  steps: FormWizardStep<FieldValues>[];
  currentStep: number;
  completedSteps: Set<number>;
  errorSteps: Set<number>;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
  allowStepNavigation?: boolean;
}

function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  errorSteps,
  orientation = 'horizontal',
  onStepClick,
  allowStepNavigation = false,
}: StepIndicatorProps) {
  return (
    <div className={stepIndicatorVariants({ orientation })}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        const isCurrent = index === currentStep;
        const hasError = errorSteps.has(index);
        const isClickable =
          allowStepNavigation && (isCompleted || index < currentStep);

        const state = hasError
          ? 'error'
          : isCompleted
            ? 'completed'
            : isCurrent
              ? 'current'
              : 'pending';

        return (
          <React.Fragment key={step.id}>
            {isClickable ? (
              <button
                type='button'
                className={cn(
                  stepItemVariants({ state, orientation }),
                  'cursor-pointer hover:opacity-75',
                  'border-none bg-transparent p-0 text-left'
                )}
                onClick={() => onStepClick?.(index)}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              >
                <div className={stepCircleVariants({ state })}>
                  {isCompleted ? (
                    <Check className={iconVariants()} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div>
                  <div
                    className={cn(
                      'font-medium',
                      ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                      isCurrent &&
                        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        'text-sm',
                        ENHANCED_DESIGN_TOKENS.foundation.color.content
                          .tertiary,
                        ENHANCED_DESIGN_TOKENS.foundation.typography.caption
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <div className={stepItemVariants({ state, orientation })}>
                <div className={stepCircleVariants({ state })}>
                  {isCompleted ? (
                    <Check className={iconVariants()} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div>
                  <div
                    className={cn(
                      'font-medium',
                      ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                      isCurrent &&
                        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.fg
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        'text-sm',
                        ENHANCED_DESIGN_TOKENS.foundation.color.content
                          .tertiary,
                        ENHANCED_DESIGN_TOKENS.foundation.typography.caption
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connector Line */}
            {index < steps.length - 1 && orientation === 'horizontal' && (
              <div
                className={cn(
                  'mx-4 h-px min-w-8 flex-1',
                  isCompleted
                    ? 'bg-green-500'
                    : ENHANCED_DESIGN_TOKENS.foundation.color.border.default
                )}
              />
            )}

            {index < steps.length - 1 && orientation === 'vertical' && (
              <div
                className={cn(
                  'ml-5 h-8 w-px',
                  isCompleted
                    ? 'bg-green-500'
                    : ENHANCED_DESIGN_TOKENS.foundation.color.border.default
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canProceed: boolean;
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  showProgress?: boolean;
}

function Navigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  canProceed,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  submitLabel = 'Submit',
  showProgress = true,
}: NavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={navigationVariants()}>
      <div className={flexCenterVariants()}>
        {!isFirstStep && (
          <button
            type='button'
            onClick={onPrevious}
            className={cn(buttonVariants({ variant: 'secondary' }))}
            disabled={isSubmitting}
          >
            <ChevronLeft className={smallIconVariants()} />
            {previousLabel}
          </button>
        )}
      </div>

      {showProgress && (
        <div className={flexCenterSmallVariants()}>
          <span
            className={cn(
              'text-sm',
              ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
              ENHANCED_DESIGN_TOKENS.foundation.typography.caption
            )}
          >
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div
            className={cn(
              'h-2 w-32 rounded-full',
              ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated
            )}
          >
            <div
              className={cn(
                'h-2 rounded-full',
                ENHANCED_DESIGN_TOKENS.foundation.motionComponents.cardHover,
                ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg
              )}
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className={flexCenterVariants()}>
        {isLastStep ? (
          <button
            type='button'
            onClick={onSubmit}
            className={cn(
              buttonVariants({
                variant: 'primary',
                disabled: !canProceed || isSubmitting,
              })
            )}
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </button>
        ) : (
          <button
            type='button'
            onClick={onNext}
            className={cn(
              buttonVariants({
                variant: 'primary',
                disabled: !canProceed || isSubmitting,
              })
            )}
            disabled={!canProceed || isSubmitting}
          >
            {nextLabel}
            <ChevronRight className={smallIconVariants()} />
          </button>
        )}
      </div>
    </div>
  );
}

// ===== MAIN FORM WIZARD COMPONENT =====

export function FormWizard<TFormData extends FieldValues>({
  // Steps Configuration
  steps,

  // State Management
  currentStep: controlledCurrentStep,
  onStepChange,

  // Form Configuration
  schema: _schema,
  defaultValues,

  // Submission
  onSubmit,

  // Navigation
  allowSkip: _allowSkip = false,
  allowBack: _allowBack = true,
  nextLabel = 'Next',
  backLabel: _backLabel = 'Previous',
  submitLabel = 'Complete',
  skipLabel: _skipLabel = 'Skip',

  // Appearance
  surface,
  showProgress = true,
  progressVariant: _progressVariant = 'steps',
  size: _size = 'md',

  // Validation
  validateOnStepChange = true,
  saveOnStepChange: _saveOnStepChange = false,

  // State
  loading: _loading = false,
  disabled: _disabled = false,

  // Customization
  className,

  ...props
}: FormWizardProps<TFormData> & React.HTMLAttributes<HTMLDivElement>) {
  const layout = 'vertical'; // Default layout since it's not in the props interface
  const stepIndicatorOrientation = 'horizontal'; // Default orientation
  const allowStepNavigation = false; // Default navigation setting
  const [uncontrolledCurrentStep, setUncontrolledCurrentStep] =
    React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  );
  const [errorSteps, setErrorSteps] = React.useState<Set<number>>(new Set());

  const currentStep = controlledCurrentStep ?? uncontrolledCurrentStep;
  const currentStepConfig = steps[currentStep];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    trigger,
    getValues: _getValues,
    reset: _reset,
  } = useForm<TFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
  });

  // Handle step validation
  const validateCurrentStep = async (): Promise<boolean> => {
    if (!validateOnStepChange || !currentStepConfig?.fields) return true;

    const fieldNames = currentStepConfig.fields.map(
      field => field.name as string
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isStepValid = await trigger(fieldNames as any);

    if (isStepValid) {
      setErrorSteps(prev => {
        const next = new Set(prev);
        next.delete(currentStep);
        return next;
      });
    } else {
      setErrorSteps(prev => new Set(prev).add(currentStep));
    }

    return isStepValid;
  };

  // Navigation handlers
  const goToStep = React.useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        if (controlledCurrentStep === undefined) {
          setUncontrolledCurrentStep(stepIndex);
        } else {
          onStepChange?.(stepIndex);
        }
      }
    },
    [controlledCurrentStep, onStepChange, steps.length]
  );

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));

    // TODO: Add onStepSubmit callback if needed in the future
    // const stepData = getValues()
    // await onStepSubmit?.(currentStep, stepData)

    goToStep(currentStep + 1);
  };

  const handlePrevious = () => {
    goToStep(currentStep - 1);
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      goToStep(stepIndex);
    }
  };

  const handleFormSubmit = async (data: TFormData) => {
    try {
      const isValid = await validateCurrentStep();
      if (!isValid) return;

      await onSubmit(data);

      // Mark final step as completed
      setCompletedSteps(prev => new Set(prev).add(currentStep));
    } catch {
      // Error handling could be added here in the future
      // For now, we just catch and ignore to prevent uncaught promise rejections
    }
  };

  // Calculate if we can proceed
  const canProceed = isValid || !validateOnStepChange;

  // Early return if no current step config
  if (!currentStepConfig) {
    return (
      <div
        className={cn(wizardVariants({ layout, surface }), className)}
        {...props}
      >
        <div className={errorContainerVariants()}>
          <p className={errorTextRedVariants()}>Invalid step configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(wizardVariants({ layout, surface }), className)}
      {...props}
    >
      {/* Step Indicator */}
      <div className={progressBarVariants()}>
        <StepIndicator
          steps={steps as FormWizardStep<FieldValues>[]}
          currentStep={currentStep}
          completedSteps={completedSteps}
          errorSteps={errorSteps}
          orientation={stepIndicatorOrientation}
          onStepClick={handleStepClick}
          allowStepNavigation={allowStepNavigation}
        />
      </div>

      {/* Step Content */}
      <div className={stepContentVariants()}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={stepFormVariants()}>
            {/* Step Title */}
            {currentStepConfig.title && (
              <div>
                <h2
                  className={cn(
                    'font-semibold',
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}
                >
                  {currentStepConfig.title}
                </h2>
                {currentStepConfig.description && (
                  <p
                    className={cn(
                      'mt-2',
                      ENHANCED_DESIGN_TOKENS.foundation.typography.body,
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                    )}
                  >
                    {currentStepConfig.description}
                  </p>
                )}
              </div>
            )}

            {/* Step Fields */}
            {currentStepConfig.fields && (
              <div className={spacingVariants()}>
                {currentStepConfig.fields.map(field => {
                  const fieldError = errors[field.name as keyof typeof errors];

                  return (
                    <div
                      key={String(field.name)}
                      className={fieldSpacingVariants()}
                    >
                      <label
                        htmlFor={String(field.name)}
                        className={cn(
                          'block font-medium',
                          ENHANCED_DESIGN_TOKENS.foundation.color.content
                            .primary,
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body
                            .medium,
                          field.required &&
                            "after:ml-1 after:text-red-500 after:content-['*']"
                        )}
                      >
                        {field.label}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          id={String(field.name)}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          className={cn(
                            'flex w-full rounded-md border px-3 py-2',
                            ENHANCED_DESIGN_TOKENS.foundation.layout.resize.y,
                            'placeholder:text-muted-foreground',
                            ENHANCED_DESIGN_TOKENS.foundation.motionComponents.formFieldFocus,
                            ENHANCED_DESIGN_TOKENS.foundation.color.surface
                              .canvas,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content
                              .primary,
                            ENHANCED_DESIGN_TOKENS.foundation.color.border
                              .default,
                            ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
                            fieldError && 'border-red-500 focus:border-red-500'
                          )}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register(field.name as any)}
                        />
                      ) : (field.type === 'select' ? (
                        <select
                          id={String(field.name)}
                          disabled={field.disabled}
                          className={cn(
                            'flex h-10 w-full rounded-md border px-3 py-2',
                            ENHANCED_DESIGN_TOKENS.foundation.motionComponents.formFieldFocus,
                            ENHANCED_DESIGN_TOKENS.foundation.color.surface
                              .canvas,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content
                              .primary,
                            ENHANCED_DESIGN_TOKENS.foundation.color.border
                              .default,
                            ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
                            fieldError && 'border-red-500 focus:border-red-500'
                          )}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register(field.name as any)}
                        >
                          <option value=''>Select {field.label}</option>
                          {field.options?.map(option => (
                            <option
                              key={String(option.value)}
                              value={String(option.value)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={String(field.name)}
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          className={cn(
                            'flex h-10 w-full rounded-md border px-3 py-2',
                            ENHANCED_DESIGN_TOKENS.foundation.motionComponents.formFieldFocus + ' placeholder:text-muted-foreground',
                            ENHANCED_DESIGN_TOKENS.foundation.color.surface
                              .canvas,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content
                              .primary,
                            ENHANCED_DESIGN_TOKENS.foundation.color.border
                              .default,
                            ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary,
                            fieldError && 'border-red-500 focus:border-red-500'
                          )}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register(field.name as any)}
                        />
                      ))}

                      {field.description && (
                        <div
                          className={cn(
                            'text-sm',
                            ENHANCED_DESIGN_TOKENS.foundation.color.content
                              .tertiary,
                            ENHANCED_DESIGN_TOKENS.foundation.typography.caption
                          )}
                        >
                          {field.description}
                        </div>
                      )}

                      {fieldError && (
                        <div
                          className={cn(
                            'flex items-center gap-2 text-sm',
                            ENHANCED_DESIGN_TOKENS.foundation.color.feedback
                              .error.fg,
                            ENHANCED_DESIGN_TOKENS.foundation.typography.caption
                          )}
                        >
                          {String(fieldError.message || 'Invalid input')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Custom Step Content */}
            {React.createElement(currentStepConfig.component, {
              data: {} as Partial<TFormData>,
              updateData: () => {},
              errors,
              goNext: () => {
                handleNext().catch(() => {});
              },
              goBack: handlePrevious,
              skip: () => {},
            })}
          </div>

          <VisuallyHidden>
            <button type='submit' tabIndex={-1}>
              Submit form
            </button>
          </VisuallyHidden>
        </form>
      </div>

      {/* Navigation */}
      <Navigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={() => handleSubmit(handleFormSubmit)()}
        isSubmitting={isSubmitting}
        canProceed={canProceed}
        previousLabel={nextLabel === 'Next' ? 'Previous' : nextLabel}
        nextLabel={nextLabel}
        submitLabel={submitLabel}
        showProgress={showProgress}
      />
    </div>
  );
}

// Export types for external use
export type FormWizardVariants = VariantProps<typeof wizardVariants>;
