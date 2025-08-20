import React from 'react';
import { ToastProvider, useToast, toast } from '../ui/Toast';

/**
 * Toast Component Demo
 * Showcases all variants, positions, features, and enterprise capabilities
 */
export const ToastDemo: React.FC = () => {
  const { addToast, dismissAll } = useToast();

  // Demo toast examples
  const showBasicToasts = () => {
    addToast({
      variant: 'success',
      title: 'Success',
      message: 'Your task has been completed successfully!',
    });

    setTimeout(() => {
      addToast({
        variant: 'info',
        title: 'Information',
        message: 'New features are now available in your dashboard.',
      });
    }, 500);

    setTimeout(() => {
      addToast({
        variant: 'warning',
        title: 'Warning',
        message: 'Your session will expire in 5 minutes.',
      });
    }, 1000);

    setTimeout(() => {
      addToast({
        variant: 'error',
        title: 'Error',
        message: 'Failed to save changes. Please try again.',
      });
    }, 1500);
  };

  const showActionToasts = () => {
    addToast({
      variant: 'warning',
      title: 'Unsaved Changes',
      message: 'You have unsaved changes that will be lost.',
      action: {
        label: 'Save Now',
        onClick: () => {
          toast.success('Changes saved successfully!');
        },
      },
      duration: null, // Persist until action taken
    });

    setTimeout(() => {
      addToast({
        variant: 'info',
        title: 'Update Available',
        message: 'A new version of the app is ready to install.',
        action: {
          label: 'Update',
          onClick: () => {
            toast.info('Update started...', { duration: 2000 });
          },
        },
        duration: 10000,
      });
    }, 600);
  };

  const showPositionedToasts = () => {
    const positions = [
      { position: 'top-left' as const, message: 'Top Left Position' },
      { position: 'top-center' as const, message: 'Top Center Position' },
      { position: 'top-right' as const, message: 'Top Right Position' },
      { position: 'bottom-left' as const, message: 'Bottom Left Position' },
      { position: 'bottom-center' as const, message: 'Bottom Center Position' },
      { position: 'bottom-right' as const, message: 'Bottom Right Position' },
    ];

    positions.forEach((pos, index) => {
      setTimeout(() => {
        addToast({
          variant: 'info',
          message: pos.message,
          position: pos.position,
          duration: 3000,
        });
      }, index * 300);
    });
  };

  const showEnterpriseFeatures = () => {
    addToast({
      variant: 'success',
      title: 'Enterprise Feature Demo',
      message: 'This toast includes metadata and priority settings.',
      priority: 'high',
      metadata: {
        userId: '12345',
        action: 'task_completion',
        feature: 'project_management',
      },
      duration: null,
      action: {
        label: 'View Details',
        onClick: () => {
          // eslint-disable-next-line no-console
          console.log('Enterprise toast clicked');
        },
      },
    });

    setTimeout(() => {
      addToast({
        variant: 'warning',
        title: 'System Alert',
        message: 'High priority system notification with timestamp tracking.',
        priority: 'high',
        timestamp: new Date(),
        duration: 8000,
      });
    }, 500);
  };

  const showPersistentToast = () => {
    addToast({
      variant: 'error',
      title: 'Critical System Error',
      message: 'This notification will persist until manually dismissed.',
      duration: null,
      priority: 'high',
      action: {
        label: 'Contact Support',
        onClick: () => {
          toast.info('Support has been notified.');
        },
      },
    });
  };

  // Imperative API examples (can be called from anywhere)
  const showImperativeToasts = () => {
    toast.success('Imperative success toast!');
    
    setTimeout(() => {
      toast.error('Imperative error toast!', {
        action: {
          label: 'Retry',
          onClick: () => toast.info('Retrying...'),
        },
      });
    }, 500);

    setTimeout(() => {
      toast.warning('Imperative warning with long duration', {
        duration: 8000,
      });
    }, 1000);

    setTimeout(() => {
      toast.info('Imperative info toast', {
        title: 'Information',
        position: 'bottom-center',
      });
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Toast/Notification Component Demo
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Enterprise-grade temporary feedback messages with variants, actions, and accessibility
        </p>
      </div>

      {/* Basic Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Toast Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={showBasicToasts}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Show All Variants
          </button>
          
          <button
            onClick={() => toast.success('Success message!')}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Success
          </button>
          
          <button
            onClick={() => toast.error('Error message!')}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Error
          </button>
          
          <button
            onClick={() => toast.warning('Warning message!')}
            className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
          >
            Warning
          </button>
          
          <button
            onClick={() => toast.info('Info message!')}
            className="rounded-md bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
          >
            Info
          </button>
        </div>
      </section>

      {/* Action Toasts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Toasts with Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={showActionToasts}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Show Action Toasts
          </button>
          
          <button
            onClick={() => {
              toast.warning('Confirm this action?', {
                action: {
                  label: 'Confirm',
                  onClick: () => toast.success('Action confirmed!'),
                },
                duration: null,
              });
            }}
            className="rounded-md bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            Confirmation Toast
          </button>
        </div>
      </section>

      {/* Positioned Toasts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Toast Positions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={showPositionedToasts}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Show All Positions
          </button>
          
          <button
            onClick={() => toast.info('Top Right', { position: 'top-right' })}
            className="rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
          >
            Top Right
          </button>
          
          <button
            onClick={() => toast.info('Bottom Center', { position: 'bottom-center' })}
            className="rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            Bottom Center
          </button>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Enterprise Features
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={showEnterpriseFeatures}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Show Enterprise Features
          </button>
          
          <button
            onClick={showPersistentToast}
            className="rounded-md bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
          >
            Persistent Toast
          </button>
          
          <button
            onClick={() => {
              toast.info('High priority notification', {
                priority: 'high',
                title: 'System Alert',
                duration: 6000,
              });
            }}
            className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
          >
            High Priority
          </button>
        </div>
      </section>

      {/* Imperative API */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Imperative API
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          These toasts can be triggered from anywhere in your application, even outside React components.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={showImperativeToasts}
            className="rounded-md bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
          >
            Show Imperative Toasts
          </button>
        </div>
      </section>

      {/* Control Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Toast Management
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={dismissAll}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Dismiss All Toasts
          </button>
          
          <button
            onClick={() => toast.dismissAll()}
            className="rounded-md bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
          >
            Clear All (Imperative)
          </button>
        </div>
      </section>

      {/* Features Summary */}
      <section className="rounded-lg bg-slate-50 p-6 dark:bg-slate-800">
        <h3 className="mb-3 font-semibold">🎯 Toast Component Features</h3>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <strong>Core Features:</strong>
            <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400">
              <li>4 semantic variants (success, error, warning, info)</li>
              <li>6 positioning options (corners + centers)</li>
              <li>Auto-dismiss with pause on hover</li>
              <li>Action buttons for user interaction</li>
              <li>Persistent toasts (duration: null)</li>
              <li>Progress indicators for timed toasts</li>
            </ul>
          </div>
          <div>
            <strong>Enterprise Features:</strong>
            <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-400">
              <li>Priority levels (low, normal, high)</li>
              <li>Metadata support for logging</li>
              <li>Timestamp tracking</li>
              <li>Imperative API (global access)</li>
              <li>ARIA live regions for accessibility</li>
              <li>Motion reduction support</li>
              <li>Toast stacking and queue management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accessibility Information */}
      <section className="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/30">
        <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
          ♿ Accessibility Features
        </h3>
        <ul className="list-inside list-disc space-y-1 text-blue-800 dark:text-blue-200">
          <li>ARIA live regions announce new toasts to screen readers</li>
          <li>High priority toasts use assertive live regions</li>
          <li>Keyboard accessible dismiss and action buttons</li>
          <li>Focus management for action interactions</li>
          <li>Respects prefers-reduced-motion settings</li>
          <li>Semantic HTML with proper ARIA attributes</li>
        </ul>
      </section>
    </div>
  );
};

// Demo wrapper with ToastProvider
export const ToastDemoWrapper: React.FC = () => {
  return (
    <ToastProvider defaultPosition="top-right" maxToasts={5}>
      <ToastDemo />
    </ToastProvider>
  );
};

export default ToastDemoWrapper;
