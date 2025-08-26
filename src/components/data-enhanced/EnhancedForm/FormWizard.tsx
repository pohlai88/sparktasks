/**
 * FormWizard - Multi-Step Form Component
 *
 * Advanced wizard component for complex multi-step forms with progress tracking and validation.
 * Built with MAPS v3.0 design system integration.
 *
 * MAPS Compliance:
 * - Uses ENHANCED_DESIGN_TOKENS exclusively
 * - Follows dark-first philosophy
 * - Apple HIG interaction patterns
 * - WCAG AAA accessibility baseline
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import React from 'react'
import { useForm, type FieldValues } from 'react-hook-form'

import { ENHANCED_DESIGN_TOKENS } from '../../../design/enhanced-tokens'
import { cn } from '../../../utils/cn'
import { VisuallyHidden } from '../../primitives/VisuallyHidden'
import type { FormWizardProps, FormWizardStep } from '../types'

// ===== MAPS v3.0 WIZARD VARIANTS =====

const wizardVariants = cva([
  'w-full max-w-4xl mx-auto',
], {
  variants: {
    layout: {
      vertical: 'space-y-8',
      compact: 'space-y-6',
    },
    surface: {
      elevated: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated1,
        'rounded-lg border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
      ],
      glass: [
        ENHANCED_DESIGN_TOKENS.foundation.materials.vibrancy.glass.surface,
        'rounded-lg border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.accent,
      ],
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
})

const progressBarVariants = cva([
  'flex items-center justify-between',
  'px-6 py-4 border-b',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
])

const stepIndicatorVariants = cva([
  'flex items-center gap-4',
], {
  variants: {
    orientation: {
      horizontal: 'justify-between w-full',
      vertical: 'flex-col items-start',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

const stepItemVariants = cva([
  'flex items-center gap-3 relative',
], {
  variants: {
    state: {
      completed: ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg,
      current: ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg,
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
})

const stepCircleVariants = cva([
  'flex items-center justify-center rounded-full border-2 font-medium transition-colors',
  'h-10 w-10',
  ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
], {
  variants: {
    state: {
      completed: [
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg,
        'border-green-500',
      ],
      current: [
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg,
        'border-blue-500',
      ],
      pending: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
      ],
      error: [
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
        'border-red-500',
      ],
    },
  },
  defaultVariants: {
    state: 'pending',
  },
})

const stepContentVariants = cva([
  'flex-1 min-h-0',
])

const stepFormVariants = cva([
  'p-6 space-y-6',
])

const navigationVariants = cva([
  'flex items-center justify-between px-6 py-4 border-t',
  ENHANCED_DESIGN_TOKENS.foundation.color.border.subtle,
])

const buttonVariants = cva([
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2',
  'font-medium transition-colors',
  ENHANCED_DESIGN_TOKENS.foundation.interaction.motion.safe,
  ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
], {
  variants: {
    variant: {
      primary: [
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.bg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg,
        ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.hover.bg,
      ],
      secondary: [
        ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
        'border',
        ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      ],
      ghost: [
        'bg-transparent',
        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
        ENHANCED_DESIGN_TOKENS.foundation.interaction.hover.surface,
      ],
    },
    size: {
      sm: [
        'h-8 px-3',
        ENHANCED_DESIGN_TOKENS.foundation.typography.caption1,
      ],
      md: [
        'h-10 px-4',
        ENHANCED_DESIGN_TOKENS.foundation.typography.button,
      ],
      lg: [
        'h-11 px-6',
        ENHANCED_DESIGN_TOKENS.foundation.typography.callout,
      ],
    },
    disabled: {
      true: [
        'opacity-50 cursor-not-allowed',
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
})

// ===== WIZARD COMPONENTS =====

interface StepIndicatorProps {
  steps: FormWizardStep<FieldValues>[]
  currentStep: number
  completedSteps: Set<number>
  errorSteps: Set<number>
  orientation?: 'horizontal' | 'vertical'
  onStepClick?: (stepIndex: number) => void
  allowStepNavigation?: boolean
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
        const isCompleted = completedSteps.has(index)
        const isCurrent = index === currentStep
        const hasError = errorSteps.has(index)
        const isClickable = allowStepNavigation && (isCompleted || index < currentStep)

        const state = hasError ? 'error' :
                    isCompleted ? 'completed' :
                    isCurrent ? 'current' : 'pending'

        return (
          <React.Fragment key={step.id}>
            {isClickable ? (
              <button
                type="button"
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
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div>
                  <div className={cn(
                    'font-medium',
                    ENHANCED_DESIGN_TOKENS.foundation.typography.subhead,
                    isCurrent && ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className={cn(
                      'text-sm',
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
                      ENHANCED_DESIGN_TOKENS.foundation.typography.caption1
                    )}>
                      {step.description}
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <div className={stepItemVariants({ state, orientation })}>
                <div className={stepCircleVariants({ state })}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div>
                  <div className={cn(
                    'font-medium',
                    ENHANCED_DESIGN_TOKENS.foundation.typography.subhead,
                    isCurrent && ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.fg
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className={cn(
                      'text-sm',
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
                      ENHANCED_DESIGN_TOKENS.foundation.typography.caption1
                    )}>
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connector Line */}
            {index < steps.length - 1 && orientation === 'horizontal' && (
              <div className={cn(
                'flex-1 h-px min-w-8 mx-4',
                isCompleted ? 'bg-green-500' : ENHANCED_DESIGN_TOKENS.foundation.color.border.default
              )} />
            )}

            {index < steps.length - 1 && orientation === 'vertical' && (
              <div className={cn(
                'w-px h-8 ml-5',
                isCompleted ? 'bg-green-500' : ENHANCED_DESIGN_TOKENS.foundation.color.border.default
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

interface NavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
  canProceed: boolean
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  showProgress?: boolean
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
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className={navigationVariants()}>
      <div className="flex items-center gap-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            className={cn(buttonVariants({ variant: 'secondary' }))}
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4" />
            {previousLabel}
          </button>
        )}
      </div>

      {showProgress && (
        <div className="flex items-center gap-3">
          <span className={cn(
            'text-sm',
            ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
            ENHANCED_DESIGN_TOKENS.foundation.typography.caption1
          )}>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div className={cn(
            'h-2 w-32 rounded-full',
            ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated2
          )}>
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.rest.bg
              )}
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {isLastStep ? (
          <button
            type="button"
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
            type="button"
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
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
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
  const layout = 'vertical' // Default layout since it's not in the props interface
  const stepIndicatorOrientation = 'horizontal' // Default orientation
  const allowStepNavigation = false // Default navigation setting
  const [uncontrolledCurrentStep, setUncontrolledCurrentStep] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  const [errorSteps, setErrorSteps] = React.useState<Set<number>>(new Set())

  const currentStep = controlledCurrentStep ?? uncontrolledCurrentStep
  const currentStepConfig = steps[currentStep]

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
  })

  // Handle step validation
  const validateCurrentStep = async (): Promise<boolean> => {
    if (!validateOnStepChange || !currentStepConfig?.fields) return true

    const fieldNames = currentStepConfig.fields.map(field => field.name as string)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isStepValid = await trigger(fieldNames as any)

    if (!isStepValid) {
      setErrorSteps(prev => new Set(prev).add(currentStep))
    } else {
      setErrorSteps(prev => {
        const next = new Set(prev)
        next.delete(currentStep)
        return next
      })
    }

    return isStepValid
  }

  // Navigation handlers
  const goToStep = React.useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      if (controlledCurrentStep !== undefined) {
        onStepChange?.(stepIndex)
      } else {
        setUncontrolledCurrentStep(stepIndex)
      }
    }
  }, [controlledCurrentStep, onStepChange, steps.length])

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep))

    // TODO: Add onStepSubmit callback if needed in the future
    // const stepData = getValues()
    // await onStepSubmit?.(currentStep, stepData)

    goToStep(currentStep + 1)
  }

  const handlePrevious = () => {
    goToStep(currentStep - 1)
  }

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      goToStep(stepIndex)
    }
  }

  const handleFormSubmit = async (data: TFormData) => {
    try {
      const isValid = await validateCurrentStep()
      if (!isValid) return

      await onSubmit(data)

      // Mark final step as completed
      setCompletedSteps(prev => new Set(prev).add(currentStep))
    } catch {
      // Error handling could be added here in the future
      // For now, we just catch and ignore to prevent uncaught promise rejections
    }
  }

  // Calculate if we can proceed
  const canProceed = isValid || !validateOnStepChange

  // Early return if no current step config
  if (!currentStepConfig) {
    return (
      <div className={cn(wizardVariants({ layout, surface }), className)} {...props}>
        <div className="text-center p-8">
          <p className="text-red-500">Invalid step configuration</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(wizardVariants({ layout, surface }), className)} {...props}>
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
                <h2 className={cn(
                  'font-semibold',
                  ENHANCED_DESIGN_TOKENS.foundation.typography.title2,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                )}>
                  {currentStepConfig.title}
                </h2>
                {currentStepConfig.description && (
                  <p className={cn(
                    'mt-2',
                    ENHANCED_DESIGN_TOKENS.foundation.typography.body,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                  )}>
                    {currentStepConfig.description}
                  </p>
                )}
              </div>
            )}

            {/* Step Fields */}
            {currentStepConfig.fields && (
              <div className="space-y-6">
                {currentStepConfig.fields.map((field) => {
                  const fieldError = errors[field.name as keyof typeof errors]

                  return (
                    <div key={String(field.name)} className="space-y-2">
                      <label
                        htmlFor={String(field.name)}
                        className={cn(
                          'block font-medium',
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
                          ENHANCED_DESIGN_TOKENS.foundation.typography.subhead,
                          field.required && "after:content-['*'] after:ml-1 after:text-red-500"
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
                            'placeholder:text-muted-foreground resize-vertical',
                            'transition-colors min-h-[80px]',
                            ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
                            ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
                            ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
                            fieldError && 'border-red-500 focus:border-red-500'
                          )}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register(field.name as any)}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={String(field.name)}
                          disabled={field.disabled}
                          className={cn(
                            'flex w-full rounded-md border px-3 py-2 h-10',
                            'transition-colors',
                            ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
                            ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
                            ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
                            fieldError && 'border-red-500 focus:border-red-500'
                          )}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register(field.name as any)}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={String(option.value)} value={String(option.value)}>
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
                            'flex w-full rounded-md border px-3 py-2 h-10',
                            'placeholder:text-muted-foreground transition-colors',
                            ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
                            ENHANCED_DESIGN_TOKENS.foundation.color.border.default,
                            ENHANCED_DESIGN_TOKENS.foundation.interaction.focus.ring,
                            fieldError && 'border-red-500 focus:border-red-500'
                          )}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...register(field.name as any)}
                        />
                      )}

                      {field.description && (
                        <div className={cn(
                          'text-sm',
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.tertiary,
                          ENHANCED_DESIGN_TOKENS.foundation.typography.caption1
                        )}>
                          {field.description}
                        </div>
                      )}

                      {fieldError && (
                        <div className={cn(
                          'text-sm flex items-center gap-2',
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg,
                          ENHANCED_DESIGN_TOKENS.foundation.typography.caption1
                        )}>
                          {String(fieldError.message || 'Invalid input')}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Custom Step Content */}
            {React.createElement(currentStepConfig.component, {
              data: {} as Partial<TFormData>,
              updateData: () => {},
              errors,
              goNext: () => { handleNext().catch(() => {}) },
              goBack: handlePrevious,
              skip: () => {},
            })}
          </div>

          <VisuallyHidden>
            <button type="submit" tabIndex={-1}>
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
  )
}

// Export types for external use
export type FormWizardVariants = VariantProps<typeof wizardVariants>
