import React, { useState, useRef } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { useAriaLive } from './AriaLive';
import { cn } from '../utils/cn';
import { DESIGN_TOKENS } from '../design/tokens';

interface QuickAddProps {
  className?: string;
  placeholder?: string;
  showIcon?: boolean;
}

export function QuickAdd({ 
  className = '', 
  placeholder = 'Add task (e.g. "tomorrow 4pm #ops")',
  showIcon = true 
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
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
    <div className={className} data-testid="quick-add-form">
      <form onSubmit={handleSubmit} className={DESIGN_TOKENS.spacing.stackTight}>
        <div className={DESIGN_TOKENS.recipes.quickAddContainer}>
          {showIcon && (
            <div className={DESIGN_TOKENS.recipes.quickAddIcon}>
              <Zap className={cn(DESIGN_TOKENS.icons.sizes.md, DESIGN_TOKENS.colors.states.muted.text)} />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSubmitting}
            data-testid="quick-add-input"
            className={cn(
              DESIGN_TOKENS.recipes.quickAddInput,
              showIcon ? 'pl-10' : 'pl-4',
              'pr-20',
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
              'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            )}
            aria-label="Quick add task"
            aria-describedby={error ? errorId : undefined}
            autoComplete="off"
          />
          <div className={DESIGN_TOKENS.recipes.quickAddButton}>
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="quick-add-button"
              className={cn(
                'inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg',
                'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                'disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
              )}
              aria-label="Add task via quick input"
            >
              {isSubmitting ? (
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className={DESIGN_TOKENS.icons.sizes.sm} />
              )}
              <span className="ml-1">Add</span>
            </button>
          </div>
        </div>

        {/* Inline validation errors with aria-describedby + role="alert" */}
        {error && (
          <div 
            id={errorId}
            role="alert"
            data-testid="quick-add-error"
            className={cn(DESIGN_TOKENS.typography.body.small, 'text-red-600 font-medium')}
          >
            {error}
          </div>
        )}

        {/* Ghost examples hint (per spec) */}
        <div className={DESIGN_TOKENS.recipes.quickAddHelp}>
          <p className={cn(DESIGN_TOKENS.typography.body.small, DESIGN_TOKENS.colors.ui.text.primary, 'font-medium mb-2')}>
            Examples:
          </p>
          <div className="flex flex-wrap gap-2">
            <span className={DESIGN_TOKENS.recipes.quickAddExample}>
              tomorrow 4pm #ops
            </span>
            <span className={DESIGN_TOKENS.recipes.quickAddExample}>
              next week !p0 #urgent
            </span>
            <span className={DESIGN_TOKENS.recipes.quickAddExample}>
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
      placeholder="Quick add task..."
      showIcon={false}
    />
  );
}
