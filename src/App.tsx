import { useEffect } from 'react';
import { Sparkles, Settings, Undo, Redo } from 'lucide-react';
import {
  useTaskStore,
  selectToday,
  selectLater,
  selectDone,
} from './stores/taskStore';
import { TaskColumn } from './components/TaskColumn';
import { SearchBar } from './components/SearchBar';
import { QuickAdd } from './components/QuickAdd';
import { ToastContainer, useToast } from './components/Toast';
import { AriaLiveProvider } from './components/AriaLive';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { LiveAnnouncer, useLiveAnnouncer } from './components/LiveAnnouncer';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import {
  AppShell,
  TopNav,
  MainContent,
  Container,
  Grid,
} from './components/layout';
import { Button } from './components/ui/Button';
import { ButtonShowcase } from './components/ButtonShowcase';
import type { TaskId } from './types/task';
import type { Task, TaskStatus } from './domain/task/schema';

function AppContent() {
  const {
    byId,
    undoStack,
    redoStack,
    addTask,
    updateTask,
    completeTask,
    moveTask,
    hydrate,
    undo,
    redo,
  } = useTaskStore();

  const { toasts, addToast, dismissToast } = useToast();
  const { announcement, announce } = useLiveAnnouncer();

  // Check for demo mode
  const urlParams = new URLSearchParams(window.location.search);
  const isDemoMode = urlParams.get('demo') === 'buttons';

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const todayTasks = selectToday({ byId } as any);
  const laterTasks = selectLater({ byId } as any);
  const doneTasks = selectDone({ byId } as any);

  // Get all task IDs for keyboard navigation
  const allTaskIds = [...todayTasks, ...laterTasks, ...doneTasks].map(
    task => task.id
  );

  // Keyboard navigation state
  const { focusedTaskId, setFocusedTask } = useKeyboardNavigation({
    taskIds: allTaskIds,
    onMoveMenuOpen: taskId => {
      announce(`Opening move menu for task: ${byId[taskId]?.title || taskId}`);
    },
  });

  // Track time-to-first-task for analytics
  useEffect(() => {
    const startTime = Date.now();
    const tasksCount = Object.keys(byId).length;

    if (tasksCount === 1) {
      const timeToFirst = Date.now() - startTime;
      console.log('Analytics: Time to first task:', timeToFirst, 'ms');
    }
  }, [Object.keys(byId).length]);

  const handleAddTask = (input: any) => {
    try {
      addTask(input);
      addToast({
        type: 'success',
        message: 'Task created successfully!',
        duration: 2000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to create task. Please try again.',
      });
    }
  };

  const handleCompleteTask = (id: TaskId) => {
    const task = byId[id];
    if (!task) return;

    try {
      if (task.status === 'DONE') {
        // Uncomplete task - move back to TODAY
        updateTask(id, { status: 'TODAY' });
        addToast({
          type: 'success',
          message: 'Task moved back to Today',
          duration: 2000,
        });
      } else {
        completeTask(id);
        addToast({
          type: 'success',
          message: 'Task completed! 🎉',
          duration: 2000,
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to update task. Please try again.',
      });
    }
  };

  const handleEditTask = (id: TaskId, updates: Partial<Task>) => {
    try {
      updateTask(id, updates);
      addToast({
        type: 'success',
        message: 'Task updated successfully!',
        duration: 2000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to update task. Please try again.',
      });
    }
  };

  const handleMoveTask = (id: TaskId, status: TaskStatus) => {
    const task = byId[id];
    if (!task) return;

    try {
      moveTask(id, status);
      const statusLabels = {
        TODAY: 'Today',
        LATER: 'Later',
        DONE: 'Done',
        ARCHIVED: 'Archived',
      };
      addToast({
        type: 'success',
        message: `Task moved to ${statusLabels[status]}`,
        duration: 2000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to move task. Please try again.',
      });
    }
  };

  const handleSnoozeTask = (id: TaskId) => {
    const task = byId[id];
    if (!task) return;

    try {
      moveTask(id, 'LATER');
      addToast({
        type: 'success',
        message: 'Task snoozed to Later',
        duration: 2000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to snooze task. Please try again.',
      });
    }
  };

  const handleDeleteTask = (id: TaskId) => {
    const task = byId[id];
    if (!task) return;

    try {
      // Archive task (soft delete) - preserving A1 behavior
      updateTask(id, { status: 'ARCHIVED' });
      addToast({
        type: 'success',
        message: 'Task deleted',
        duration: 2000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to delete task. Please try again.',
      });
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      undo();
      addToast({
        type: 'success',
        message: 'Action undone',
        duration: 2000,
      });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      redo();
      addToast({
        type: 'success',
        message: 'Action redone',
        duration: 2000,
      });
    }
  };

  const handleTaskSelect = (task: Task) => {
    // Handle task selection from search results
    addToast({
      type: 'success',
      message: `Selected: ${task.title}`,
      duration: 2000,
    });
  };

  return (
    <AppShell>
      <TopNav
        logo={
          <div className='flex items-center'>
            <Sparkles className='lucide lucide-sparkles size-8 text-primary-600' />
            <h1 className='ml-2 text-xl font-bold text-gray-900'>SparkTasks</h1>
          </div>
        }
        search={<SearchBar onTaskSelect={handleTaskSelect} />}
        actions={
          <div className='flex items-center space-x-2'>
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className='rounded p-2 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 hover:text-gray-600'
              aria-label='Undo last action'
              title='Undo'
            >
              <Undo className='size-4' />
            </button>

            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className='rounded p-2 text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 hover:text-gray-600'
              aria-label='Redo last undone action'
              title='Redo'
            >
              <Redo className='size-4' />
            </button>

            <KeyboardShortcuts />

            <Button variant='secondary'>
              <Settings className='mr-2 size-4' />
              Settings
            </Button>
          </div>
        }
      />

      <MainContent>
        <Container size='full'>
          {isDemoMode ? (
            /* Enterprise Button Component Showcase */
            <ButtonShowcase />
          ) : (
            <>
              {/* Quick Add Section */}
              <div className='border-b border-gray-100 bg-white py-4'>
                <QuickAdd className='mx-auto max-w-2xl' />
              </div>

              {/* Task Columns */}
              <div className='py-8'>
                <Grid cols={3} gap='lg'>
              {/* Today Column */}
              <TaskColumn
                title='Today'
                tasks={todayTasks}
                showAddButton={true}
                onAddTask={handleAddTask}
                onCompleteTask={handleCompleteTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                onSnoozeTask={handleSnoozeTask}
                focusedTaskId={focusedTaskId}
                onTaskFocus={setFocusedTask}
              />

              {/* Later Column */}
              <TaskColumn
                title='Later'
                tasks={laterTasks}
                onCompleteTask={handleCompleteTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                onSnoozeTask={handleSnoozeTask}
                focusedTaskId={focusedTaskId}
                onTaskFocus={setFocusedTask}
              />

              {/* Done Column */}
              <TaskColumn
                title='Done'
                tasks={doneTasks}
                onCompleteTask={handleCompleteTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
                onSnoozeTask={handleSnoozeTask}
                focusedTaskId={focusedTaskId}
                onTaskFocus={setFocusedTask}
              />
            </Grid>
          </div>

          {/* Footer */}
          <footer className='mt-16 text-center text-sm text-gray-500'>
            <p>
              Storage-neutral, local-first task platform •
              <span className='ml-1 text-primary-600'>BYOS Architecture</span>
            </p>
          </footer>
            </>
          )}
        </Container>
      </MainContent>

      {/* ARIA Live Region for keyboard navigation announcements */}
      <LiveAnnouncer message={announcement} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppShell>
  );
}

function App() {
  return (
    <AriaLiveProvider>
      <AppContent />
    </AriaLiveProvider>
  );
}

export default App;
