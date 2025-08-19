import React, { useState, useRef } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useTaskStore } from '@/stores/taskStore';
import { useAriaLive } from '@/components/features/AriaLive';
import { cn } from '@/utils/cn';
import { DESIGN_TOKENS } from '@/design/tokens';

interface QuickAddProps {
  className?: string;
  placeholder?: string;
  showIcon?: boolean;
}

export function QuickAdd({
  className = '',
  placeholder = 'Add task (e.g. "tomorrow 4pm #ops")',
  showIcon = true,
}: QuickAddProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { quickAdd } = useTaskStore();
  const { announce } = useAriaLive();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please enter a task');
      announce('Please enter a task', 'assertive');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Call existing parser → create via store (black box approach)
      quickAdd(input.trim());

      // Success feedback with live-region announcement
      setInput('');
      setError('');
      announce(`Task created: ${input.trim()}`, 'polite');

      // Focus stays on input for quick consecutive adds
      inputRef.current?.focus();
    } catch (error) {
      // Inline validation errors with aria-describedby + role="alert"
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create task';
      setError(errorMessage);
      announce(errorMessage, 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (error) {
      setError(''); // Clear error as user types
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInput('');
      setError('');
      inputRef.current?.blur();
    }
  };

  const errorId = 'quickadd-error';

  return (
    <div className={className} data-testid='quick-add-form'>
      <form
        onSubmit={handleSubmit}
        className={DESIGN_TOKENS.spacing.stackTight}
      >
        <div className={DESIGN_TOKENS.recipe.quickAddContainer}>
          {showIcon && (
            <div className={DESIGN_TOKENS.recipe.quickAddIcon}>
              <Zap
                className={cn(
                  DESIGN_TOKENS.icons.sizes.md,
                  DESIGN_TOKENS.colors.states.muted.text
                )}
              />
            </div>
          )}
          <input
            ref={inputRef}
            type='text'
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSubmitting}
            data-testid='quick-add-input'
            className={cn(
              DESIGN_TOKENS.recipe.quickAddInput,
              showIcon
                ? DESIGN_TOKENS.layout.patterns.inputWithIcon
                : DESIGN_TOKENS.spacing.formPadding,
              DESIGN_TOKENS.spacing.formPadding, // Custom for quick add button space - TODO: Add to design tokens
              error
                ? `${DESIGN_TOKENS.semantic.border.error} ${DESIGN_TOKENS.interaction.focus.borderRed} ${DESIGN_TOKENS.interaction.focus.ringRed}`
                : `${DESIGN_TOKENS.interaction.focus.border} focus:outline-none focus:ring-1 ${DESIGN_TOKENS.interaction.focus.ring}`,
              'transition-colors disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label='Quick add task'
            aria-describedby={error ? errorId : undefined}
            autoComplete='off'
          />
          <div className={DESIGN_TOKENS.recipe.quickAddButton}>
            <button
              type='submit'
              disabled={isSubmitting}
              data-testid='quick-add-button'
              className={cn(DESIGN_TOKENS.recipe.button.primaryWithStates)}
              aria-label='Add task via quick input'
            >
              {isSubmitting ? (
                <div className={DESIGN_TOKENS.loading.spinner} />
              ) : (
                <Plus className={DESIGN_TOKENS.icons.sizes.sm} />
              )}
              <span className={DESIGN_TOKENS.spacing.iconSmall}>Add</span>
            </button>
          </div>
        </div>

        {/* Inline validation errors with aria-describedby + role="alert" */}
        {error && (
          <div
            id={errorId}
            role='alert'
            data-testid='quick-add-error'
            className={cn(
              DESIGN_TOKENS.typography.body.small,
              'font-medium text-red-600'
            )}
          >
            {error}
          </div>
        )}

        {/* Ghost examples hint (per spec) */}
        <div className={DESIGN_TOKENS.recipe.quickAddHelp}>
          <p
            className={cn(
              DESIGN_TOKENS.typography.body.small,
              DESIGN_TOKENS.colors.ui.text.primary,
              '${DESIGN_TOKENS.spacing.stack.sm} font-medium'
            )}
          >
            Examples:
          </p>
          <div className={DESIGN_TOKENS.layout.patterns.flexWrap}>
            <span className={DESIGN_TOKENS.recipe.quickAddExample}>
              tomorrow 4pm #ops
            </span>
            <span className={DESIGN_TOKENS.recipe.quickAddExample}>
              next week !p0 #urgent
            </span>
            <span className={DESIGN_TOKENS.recipe.quickAddExample}>
              @status:later #review
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

// Compact version for header/toolbar use
export function QuickAddCompact({ className = '' }: { className?: string }) {
  return (
    <QuickAdd
      className={className}
      placeholder='Quick add task...'
      showIcon={false}
    />
  );
}
