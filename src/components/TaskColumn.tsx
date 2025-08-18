import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button, StatusBadge, DESIGN_TOKENS } from './ui';
import { cn } from '../utils/cn';
import type { Task, TaskStatus } from '../domain/task/schema';
import type { TaskId } from '../types/task';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  showAddButton?: boolean;
  onAddTask?: (input: any) => void;
  onCompleteTask: (id: TaskId) => void;
  onEditTask: (id: TaskId, updates: Partial<Task>) => void;
  onDeleteTask: (id: TaskId) => void;
  onMoveTask: (id: TaskId, status: TaskStatus) => void;
  onSnoozeTask: (id: TaskId) => void;
  focusedTaskId?: TaskId | null;
  onTaskFocus?: (taskId: TaskId) => void;
}

export function TaskColumn({
  title,
  tasks,
  showAddButton = false,
  onAddTask,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onSnoozeTask,
  focusedTaskId,
  onTaskFocus,
}: TaskColumnProps) {
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (input: any) => {
    if (onAddTask) {
      onAddTask(input);
      setShowForm(false);
    }
  };

  const handleTaskNavigation = (currentTaskId: TaskId, direction: 'up' | 'down') => {
    if (tasks.length === 0 || !onTaskFocus) return;
    
    const currentIndex = tasks.findIndex(task => task.id === currentTaskId);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'down') {
      newIndex = Math.min(currentIndex + 1, tasks.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    if (newIndex !== currentIndex) {
      onTaskFocus(tasks[newIndex].id);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    // Allow Tab/Shift+Tab to exit the list naturally
    if (e.key === 'Tab') return;
    
    // Global keyboard navigation should handle these
    // Remove local handling to avoid conflicts
  };

  const EmptyState = () => (
    <div className={cn(
      DESIGN_TOKENS.recipes.card,
      DESIGN_TOKENS.recipes.emptyState
    )} data-testid={`empty-state-${title.toLowerCase()}`}>
      <div className={cn(
        'w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4',
        DESIGN_TOKENS.colors.ui.background
      )}>
        <Plus className={cn('w-6 h-6', DESIGN_TOKENS.colors.ui.text.muted)} />
      </div>
      <p className={cn(
        DESIGN_TOKENS.typography.body.secondary,
        'font-medium mb-1'
      )} data-testid={`empty-state-message-${title.toLowerCase()}`}>
        No tasks yet
      </p>
      <p className={cn(
        DESIGN_TOKENS.typography.body.small,
        'mb-4'
      )}>
        Tasks will appear here
      </p>
      {showAddButton && !showForm && (
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          leftIcon={<Plus className="size-4" />}
          data-testid={`add-first-task-button-${title.toLowerCase()}`}
          aria-label="Add your first task to get started"
        >
          Add Your First Task
        </Button>
      )}
    </div>
  );

  return (
    <div className={DESIGN_TOKENS.spacing.stack} data-testid={`${title.toLowerCase()}-column`}>
      <div className={cn(
        DESIGN_TOKENS.layout.patterns.spaceBetween,
        'mb-4'
      )}>
        <div className={cn('flex items-center', DESIGN_TOKENS.spacing.inlineTight)}>
          <h2 className={DESIGN_TOKENS.typography.heading.h2} data-testid={`column-header-${title.toLowerCase()}`}>
            {title}
          </h2>
          {tasks.length > 0 && (
            <StatusBadge 
              status={title as 'TODAY' | 'LATER' | 'DONE'} 
              count={tasks.length}
              data-testid={`task-count-${title.toLowerCase()}`}
            />
          )}
        </div>
        {showAddButton && !showForm && tasks.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            leftIcon={<Plus className="size-4" />}
            data-testid="column-add-task-button"
            aria-label={`Add task to ${title} column`}
          >
            Add Task
          </Button>
        )}
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {tasks.length === 0 && !showForm ? (
        <EmptyState />
      ) : (
        <>
          <div 
            className={DESIGN_TOKENS.spacing.stack} 
            role="list" 
            aria-label={`${title} tasks`}
            data-testid={`${title.toLowerCase()}-tasks`}
            onKeyDown={handleListKeyDown}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onCompleteTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onMove={onMoveTask}
                onSnooze={onSnoozeTask}
                isFocused={task.id === focusedTaskId}
                onFocus={() => onTaskFocus?.(task.id)}
                onNavigate={(direction) => handleTaskNavigation(task.id, direction)}
              />
            ))}
          </div>
          {/* Focusable landmark to exit task list */}
          <button 
            className={cn(
              'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2',
              DESIGN_TOKENS.recipes.card,
              DESIGN_TOKENS.typography.body.small,
              'px-2 py-1'
            )}
            onClick={() => onTaskFocus?.(null as any)}
            aria-label={`Exit ${title} list`}
          >
            Exit {title} list
          </button>
        </>
      )}
    </div>
  );
}
