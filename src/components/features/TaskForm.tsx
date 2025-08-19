import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CreateTaskInputSchema } from '../domain/task/schema';
import { useAriaLive } from './AriaLive';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Textarea, Select } from './ui/Input';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../utils/cn';
import type { z } from 'zod';

type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => void;
  onCancel?: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'TODAY' | 'LATER'>('TODAY');
  const [priority, setPriority] = useState<'P0' | 'P1' | 'P2'>('P1');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { announce } = useAriaLive();

  const validate = (input: CreateTaskInput) => {
    if (!input.title.trim()) return 'Title is required.';
    if (input.title.length > 200) return 'Title must be ≤ 200 characters.';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      const input: CreateTaskInput = {
        title: title.trim(),
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
        tags: parsedTags,
        status,
        priority,
      };

      // Validate with schema
      const parsed = CreateTaskInputSchema.parse(input);

      // Custom validation
      const validationError = validate(parsed);
      if (validationError) {
        setErrors({ title: validationError });
        announce(validationError, 'assertive');
        return;
      }

      // Submit the task
      onSubmit(parsed);

      // Reset form with optimistic feedback
      setTitle('');
      setNotes('');
      setDueDate('');
      setTags('');
      setStatus('TODAY');
      setPriority('P1');
      setErrors({});
      announce('Task created successfully');
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as z.ZodError;
        const fieldErrors: Record<string, string> = {};

        zodError.issues.forEach((issue: z.ZodIssue) => {
          const field = issue.path.join('.');
          fieldErrors[field] = issue.message;
        });

        setErrors(fieldErrors);
        // Announce first error
        const firstError = Object.values(fieldErrors)[0];
        if (firstError) {
          announce(firstError, 'assertive');
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit}
        className={DESIGN_TOKENS.spacing.form}
        onKeyDown={handleKeyDown}
      >
        <div className={DESIGN_TOKENS.layout.patterns.headerWithAction}>
          <h3 className={DESIGN_TOKENS.typography.heading.h3}>Add New Task</h3>
          {onCancel && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onCancel}
              aria-label='Cancel'
            >
              <X className={DESIGN_TOKENS.icons.sizes.sm} />
            </Button>
          )}
        </div>

        <div className={DESIGN_TOKENS.layout.spacing.element}>
          <Input
            id='task-title'
            label='Title *'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='What needs to be done?'
            error={errors.title}
            helperText='💡 Try: "Call mom tomorrow 4pm #family" or "Review docs #work"'
            autoFocus
            aria-required='true'
          />

          <Textarea
            id='task-notes'
            label='Notes'
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder='Additional context or details...'
            rows={3}
            resize='vertical'
          />

          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-3',
              DESIGN_TOKENS.spacing.inline
            )}
          >
            <Input
              id='task-due'
              type='date'
              label='Due Date'
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />

            <Select
              id='task-priority'
              label='Priority'
              value={priority}
              onChange={e => setPriority(e.target.value as 'P0' | 'P1' | 'P2')}
              options={[
                { value: 'P0', label: 'P0 - Critical' },
                { value: 'P1', label: 'P1 - High' },
                { value: 'P2', label: 'P2 - Normal' },
              ]}
            />

            <Select
              id='task-status'
              label='List'
              value={status}
              onChange={e => setStatus(e.target.value as 'TODAY' | 'LATER')}
              options={[
                { value: 'TODAY', label: 'Today' },
                { value: 'LATER', label: 'Later' },
              ]}
            />
          </div>

          <Input
            id='task-tags'
            label='Tags'
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder='work, personal, urgent (comma-separated)'
          />

          <div className={DESIGN_TOKENS.layout.patterns.formFooter}>
            {onCancel && (
              <Button variant='secondary' onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type='submit'
              variant='primary'
              disabled={!title.trim()}
              leftIcon={<Plus className={DESIGN_TOKENS.icons.sizes.sm} />}
            >
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

