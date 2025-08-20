import React, { useState } from 'react';
import { Alert, AlertAction, AlertGroup } from '../ui/Alert';

/**
 * Alert Component Demo
 * Showcases all variants, sizes, and features of the Alert component
 */
export const AlertDemo: React.FC = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  const resetDemos = () => {
    setDismissedAlerts(new Set());
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Alert Component Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Enterprise-grade inline notifications with semantic variants and accessibility
        </p>
        <button
          onClick={resetDemos}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Reset All Demos
        </button>
      </div>

      {/* Variant Showcase */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Alert Variants
        </h2>
        <div className="space-y-4">
          <Alert variant="info" title="Information Alert">
            This is an informational message to keep users informed about system status.
          </Alert>

          <Alert variant="success" title="Success Alert">
            Your action was completed successfully! The changes have been saved.
          </Alert>

          <Alert variant="warning" title="Warning Alert">
            Please review this information carefully before proceeding with the action.
          </Alert>

          <Alert variant="error" title="Error Alert">
            An error occurred while processing your request. Please try again.
          </Alert>
        </div>
      </section>

      {/* Size Showcase */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Alert Sizes
        </h2>
        <div className="space-y-4">
          <Alert variant="info" size="sm" title="Small Alert">
            Compact alert for inline messaging.
          </Alert>

          <Alert variant="success" size="md" title="Medium Alert">
            Standard alert size for most use cases.
          </Alert>

          <Alert variant="warning" size="lg" title="Large Alert">
            Large alert for prominent notifications and important messages.
          </Alert>
        </div>
      </section>

      {/* Dismissible Alerts */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Dismissible Alerts
        </h2>
        <div className="space-y-4">
          {!dismissedAlerts.has('dismissible-1') && (
            <Alert
              variant="info"
              title="Dismissible Alert"
              dismissible
              onDismiss={() => handleDismiss('dismissible-1')}
            >
              This alert can be dismissed by clicking the X button.
            </Alert>
          )}

          {!dismissedAlerts.has('dismissible-2') && (
            <Alert
              variant="warning"
              title="Auto-dismiss Alert"
              dismissible
              onDismiss={() => handleDismiss('dismissible-2')}
            >
              This alert will auto-dismiss after a certain time period.
            </Alert>
          )}
        </div>
      </section>

      {/* Alerts with Actions */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Alerts with Actions
        </h2>
        <div className="space-y-4">
          <Alert variant="error" title="Action Required">
            Your session will expire soon. Please save your work.
            <AlertAction variant="primary" onClick={() => alert('Extend session clicked!')}>
              Extend Session
            </AlertAction>
            <AlertAction variant="secondary" onClick={() => alert('Save now clicked!')}>
              Save Now
            </AlertAction>
          </Alert>

          <Alert variant="success" title="Update Available">
            A new version of the application is available.
            <AlertAction variant="primary" onClick={() => alert('Update clicked!')}>
              Update Now
            </AlertAction>
            <AlertAction variant="secondary" onClick={() => alert('Later clicked!')}>
              Remind Me Later
            </AlertAction>
          </Alert>
        </div>
      </section>

      {/* Alert Groups */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Alert Groups
        </h2>
        <AlertGroup>
          <Alert variant="info" title="Step 1 Complete">
            Your profile information has been updated.
          </Alert>
          <Alert variant="info" title="Step 2 Complete">
            Your preferences have been saved.
          </Alert>
          <Alert variant="warning" title="Step 3 Pending">
            Please verify your email address to complete setup.
            <AlertAction variant="primary" onClick={() => alert('Verify clicked!')}>
              Verify Email
            </AlertAction>
          </Alert>
        </AlertGroup>
      </section>

      {/* Complex Alert Example */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Complex Alert Example
        </h2>
        <Alert
          variant="warning"
          title="System Maintenance Scheduled"
          size="lg"
          dismissible
          onDismiss={() => handleDismiss('maintenance')}
        >
          <div className="space-y-2">
            <p>
              Scheduled maintenance will occur on Sunday, March 15th from 2:00 AM to 6:00 AM EST.
              During this time, some features may be unavailable.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>User authentication may be interrupted</li>
              <li>File uploads will be temporarily disabled</li>
              <li>Reports may show outdated data</li>
            </ul>
          </div>
          <AlertAction variant="primary" onClick={() => alert('Schedule reminder!')}>
            Set Reminder
          </AlertAction>
          <AlertAction variant="secondary" onClick={() => alert('More info!')}>
            Learn More
          </AlertAction>
        </Alert>
      </section>

      {/* Accessibility Features */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Accessibility Features
        </h2>
        <div className="space-y-4">
          <Alert variant="info" title="Screen Reader Friendly">
            This alert includes ARIA labels and live regions for screen reader accessibility.
          </Alert>
          
          <Alert variant="success" title="Keyboard Navigation">
            All interactive elements support keyboard navigation and focus management.
          </Alert>

          <Alert variant="warning" title="Motion Preferences">
            Animations respect the user's motion reduction preferences.
          </Alert>
        </div>
      </section>
    </div>
  );
};

export default AlertDemo;
