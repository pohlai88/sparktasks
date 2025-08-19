import { useState, useRef, useEffect } from 'react';
import { Check, Edit2, Trash2, Clock, MoreHorizontal } from 'lucide-react';
import { TaskMoveMenu } from './TaskMoveMenu';
import { useAriaLive } from './AriaLive';
import {
  Card,
  Button,
  IconButton,
  Input,
  Textarea,
  PriorityBadge,
  DueDateBadge,
  TagList,
  DESIGN_TOKENS,
} from './ui';
import { cn } from '../utils/cn';
import { DESIGN_TOKENS as TOKENS } from '@/design/tokens';
import type { Task, TaskStatus } from '../domain/task/schema';
import type { TaskId } from '../types/task';

interface TaskCardProps {
  task: Task;
  onComplete: (id: TaskId) => void;
  onEdit: (id: TaskId, updates: Partial<Task>) => void;
  onDelete: (id: TaskId) => void;
  onMove: (id: TaskId, status: TaskStatus) => void;
  onSnooze: (id: TaskId) => void;
  isFocused?: boolean;
  onFocus?: () => void;
  onNavigate?: (direction: 'up' | 'down') => void;
}

export function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  onMove,
  onSnooze,
  isFocused = false,
  onFocus,
  onNavigate,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || '');
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [titleError, setTitleError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const { announce } = useAriaLive();

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.focus();
    }
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return; // Let editing handle its own keys

    switch (e.key) {
      case 'Tab':
        // Allow normal Tab behavior to exit roving tabindex and move to next focusable element
        // Don't prevent default - let browser handle focus management
        return;
      case 'j':
      case 'ArrowDown':
        e.preventDefault();
        onNavigate?.('down');
        break;
      case 'k':
      case 'ArrowUp':
        e.preventDefault();
        onNavigate?.('up');
        break;
      case 'm':
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault();
        setShowMoveMenu(true);
        break;
      case 'Enter':
        e.preventDefault();
        setIsEditing(true);
        break;
      case ' ':
        e.preventDefault();
        onComplete(task.id);
        break;
      case 's':
        e.preventDefault();
        onSnooze(task.id);
        break;
      case 'e':
        e.preventDefault();
        setIsEditing(true);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        onDelete(task.id);
        break;
      case 'Escape':
        if (showMoveMenu) {
          e.preventDefault();
          setShowMoveMenu(false);
          // Restore focus to card
          cardRef.current?.focus();
        }
        break;
    }
  };

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();

    // Clear previous errors
    setTitleError('');

    // Validate title
    if (!trimmedTitle) {
      const errorMsg = 'Task title is required';
      setTitleError(errorMsg);
      announce(errorMsg, 'assertive');
      return;
    }

    if (trimmedTitle.length > 200) {
      const errorMsg = 'Task title must be 200 characters or less';
      setTitleError(errorMsg);
      announce(errorMsg, 'assertive');
      return;
    }

    // Save if validation passes
    onEdit(task.id, {
      title: trimmedTitle,
      notes: editNotes.trim() || undefined,
    });
    setIsEditing(false);
    announce('Task updated successfully');
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditNotes(task.notes || '');
    setTitleError('');
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleMoveTask = (status: TaskStatus) => {
    onMove(task.id, status);
    setShowMoveMenu(false);
  };

  if (isEditing) {
    const titleId = `edit-title-${task.id}`;
    const titleErrorId = `edit-title-error-${task.id}`;
    const notesId = `edit-notes-${task.id}`;

    return (
      <Card elevation='lg' padding='default'>
        <form role='form' aria-label='Edit task'>
          <div className={DESIGN_TOKENS.spacing.form}>
            <Input
              id={titleId}
              label='Task Title *'
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={handleEditKeyDown}
              placeholder='What needs to be done?'
              error={titleError}
              autoFocus
              aria-required='true'
              aria-describedby={titleError ? titleErrorId : undefined}
            />
            <Textarea
              id={notesId}
              label='Notes (optional)'
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              onKeyDown={handleEditKeyDown}
              placeholder='Additional details...'
              rows={3}
              resize='vertical'
            />
            <div
              className={cn(
                DESIGN_TOKENS.layout.patterns.modalFooter,
                TOKENS.colors.states.default.border
              )}
            >
              <Button
                variant='secondary'
                onClick={handleCancel}
                aria-label='Cancel editing'
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                onClick={handleSave}
                disabled={!editTitle.trim()}
                aria-label='Save changes'
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card
      variant='interactive'
      className={`group relative ${isFocused ? DESIGN_TOKENS.layout.focus.ringBlue : ''}`}
    >
      <article
        ref={cardRef}
        tabIndex={isFocused ? 0 : -1}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        aria-label={`Task: ${task.title}`}
        data-testid={`task-card-${task.id}`}
      >
        <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
          <div className={DESIGN_TOKENS.layout.patterns.responsiveFlex}>
            <h3
              className={cn(
                '${DESIGN_TOKENS.spacing.stack.sm} text-base font-semibold leading-6 transition-colors',
                `group-hover:${TOKENS.colors.ui.text.secondary}`,
                task.status === 'DONE'
                  ? `line-through ${TOKENS.colors.ui.text.muted}`
                  : TOKENS.colors.ui.text.primary
              )}
            >
              {task.title}
            </h3>
            {task.notes && (
              <p
                className={cn(
                  '${DESIGN_TOKENS.spacing.stack.md} text-sm leading-relaxed',
                  task.status === 'DONE'
                    ? TOKENS.colors.ui.text.muted
                    : TOKENS.colors.ui.text.secondary
                )}
              >
                {task.notes}
              </p>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className={DESIGN_TOKENS.spacing.elementMargin}>
                <TagList tags={task.tags} maxVisible={3} />
              </div>
            )}
            <div
              className={cn(
                DESIGN_TOKENS.spacing.elementMargin,
                DESIGN_TOKENS.layout.patterns.iconContainer
              )}
            >
              <PriorityBadge priority={task.priority} />
              {task.dueDate && <DueDateBadge dueDate={task.dueDate} />}
            </div>
          </div>

          <div
            className={cn(
              DESIGN_TOKENS.spacing.iconLeft,
              DESIGN_TOKENS.layout.patterns.buttonGroup
            )}
          >
            <IconButton
              variant='ghost'
              size='md'
              icon={<Check className={DESIGN_TOKENS.icons.sizes.sm} />}
              onClick={() => onComplete(task.id)}
              className={
                task.status === 'DONE'
                  ? TOKENS.recipes.iconButtonSuccess
                  : TOKENS.recipes.iconButtonComplete
              }
              aria-label={
                task.status === 'DONE' ? 'Mark incomplete' : 'Mark complete'
              }
              title='Space or Enter to toggle'
              data-testid={`task-complete-${task.id}`}
            />

            {task.status !== 'LATER' && (
              <IconButton
                variant='ghost'
                size='md'
                icon={<Clock className={DESIGN_TOKENS.icons.sizes.sm} />}
                onClick={() => onSnooze(task.id)}
                className={TOKENS.recipes.iconButtonPrimary}
                aria-label='Snooze to Later'
                title='S to snooze'
                data-testid={`task-snooze-${task.id}`}
              />
            )}

            <IconButton
              variant='ghost'
              size='md'
              icon={<Edit2 className={DESIGN_TOKENS.icons.sizes.sm} />}
              onClick={() => setIsEditing(true)}
              className={TOKENS.recipes.iconButtonDefault}
              aria-label='Edit task'
              title='E to edit'
              data-testid={`task-edit-${task.id}`}
            />

            <IconButton
              variant='ghost'
              size='md'
              icon={<MoreHorizontal className={DESIGN_TOKENS.icons.sizes.sm} />}
              onClick={() => setShowMoveMenu(true)}
              className={TOKENS.recipes.iconButtonDefault}
              aria-label='Move task'
              title='M to move'
              data-testid={`task-move-${task.id}`}
            />

            <IconButton
              variant='ghost'
              size='md'
              icon={<Trash2 className={DESIGN_TOKENS.icons.sizes.sm} />}
              onClick={() => onDelete(task.id)}
              className={TOKENS.recipes.iconButtonDanger}
              aria-label='Delete task'
              title='Delete or Backspace to delete'
              data-testid={`task-delete-${task.id}`}
            />
          </div>
        </div>

        {isFocused && (
          <div
            className={cn(
              '${DESIGN_TOKENS.spacing.stack.md} ${DESIGN_TOKENS.spacing.insetTop.md} border-t font-medium',
              TOKENS.colors.states.default.border,
              TOKENS.typography.body.small,
              TOKENS.colors.ui.text.muted
            )}
          >
            j/k: navigate • m: move • space: toggle • s: snooze • e: edit • del:
            delete
          </div>
        )}

        <TaskMoveMenu
          isOpen={showMoveMenu}
          currentStatus={task.status}
          taskTitle={task.title}
          onMove={handleMoveTask}
          onClose={() => setShowMoveMenu(false)}
          onFocusReturn={() => cardRef.current?.focus()}
        />
      </article>
    </Card>
  );
}

