import * as React from 'react';
import {
  ProgressBar,
  ProgressBarPrimary,
  ProgressBarSuccess,
  ProgressBarWarning,
  ProgressBarError,
  ProgressBarInfo,
  useProgressBar,
} from '@/components/ui/ProgressBar';

// ===== PROGRESS BAR DEMO COMPONENT =====

export const ProgressBarDemo: React.FC = () => {
  const [controlledValue, setControlledValue] = React.useState(35);
  const [isRunning, setIsRunning] = React.useState(false);

  // Auto-incrementing progress hook example
  const autoProgress = useProgressBar({
    initialValue: 0,
    max: 100,
    ...(isRunning && { autoIncrement: 100 }), // 100ms interval when running
    step: 1,
    onComplete: () => {
      setIsRunning(false);
      // eslint-disable-next-line no-console
      console.log('Auto-progress completed!');
    },
    onChange: (value, percentage) => {
      // eslint-disable-next-line no-console
      console.log(`Progress: ${value}/100 (${percentage}%)`);
    },
  });

  const startAutoProgress = () => {
    autoProgress.reset();
    setIsRunning(true);
  };

  const handleControlledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControlledValue(Number(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          ProgressBar Component Showcase
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enterprise-grade linear progress indicators with comprehensive variants, 
          sizes, states, and accessibility features. Built with DESIGN_TOKENS V3.2 
          for SSOT compliance.
        </p>
      </div>

      {/* Basic Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Basic Progress Bars
        </h2>
        
        <div className="grid gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Default with Label</h3>
            <ProgressBar
              value={65}
              label="Download Progress"
              description="Downloading files..."
              showPercentage
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">With Value Display</h3>
            <ProgressBar
              value={42}
              max={80}
              label="Storage Used"
              showValue
              formatValue={(value, max) => `${value} GB / ${max} GB`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Minimal (No Labels)</h3>
            <ProgressBar value={78} />
          </div>
        </div>
      </section>

      {/* Variant Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Color Variants
        </h2>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Primary (Default)</label>
            <ProgressBarPrimary value={60} showPercentage />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Success</label>
            <ProgressBarSuccess 
              value={100} 
              label="Upload Complete" 
              showPercentage 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Warning</label>
            <ProgressBarWarning 
              value={85} 
              label="Storage Almost Full" 
              description="Consider freeing up space"
              showPercentage 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Error</label>
            <ProgressBarError 
              value={25} 
              label="Upload Failed" 
              description="Connection timeout occurred"
              showPercentage 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Info</label>
            <ProgressBarInfo 
              value={45} 
              label="Processing Data" 
              showPercentage 
            />
          </div>
        </div>
      </section>

      {/* Size Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Size Variants
        </h2>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Small (sm)</label>
            <ProgressBar size="sm" value={40} showPercentage />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Medium (md) - Default</label>
            <ProgressBar size="md" value={60} showPercentage />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Large (lg)</label>
            <ProgressBar size="lg" value={80} showPercentage />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Extra Large (xl)</label>
            <ProgressBar size="xl" value={95} showPercentage />
          </div>
        </div>
      </section>

      {/* Special States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Special States
        </h2>
        
        <div className="grid gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Indeterminate Loading</h3>
            <ProgressBar
              indeterminate
              label="Loading..."
              description="Please wait while we process your request"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Pulse Effect</h3>
            <ProgressBar
              value={75}
              pulse
              variant="info"
              label="Syncing Data"
              showPercentage
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Zero Progress</h3>
            <ProgressBar
              value={0}
              label="Not Started"
              description="Task has not been initiated"
              showPercentage
            />
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Interactive Controls
        </h2>
        
        <div className="space-y-6">
          {/* Controlled Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700">Manual Control</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={controlledValue}
                onChange={handleControlledChange}
                className="w-full"
              />
              <ProgressBar
                value={controlledValue}
                label="Manual Progress Control"
                description={`Adjust the slider above to control progress`}
                showPercentage
                showValue
                announceProgress
                priority="normal"
              />
            </div>
          </div>

          {/* Auto-incrementing Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700">Auto-Incrementing</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={startAutoProgress}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRunning
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRunning ? 'Running...' : 'Start Auto Progress'}
                </button>
                <button
                  onClick={autoProgress.reset}
                  className="px-4 py-2 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                >
                  Reset
                </button>
              </div>
              <ProgressBar
                value={autoProgress.value}
                variant={autoProgress.isComplete ? 'success' : 'primary'}
                label="Auto-Incrementing Progress"
                description={
                  autoProgress.isComplete
                    ? 'Process completed!'
                    : isRunning
                    ? 'Processing...'
                    : 'Click "Start" to begin'
                }
                showPercentage
                announceProgress
                priority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Accessibility Features
        </h2>
        
        <div className="grid gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Screen Reader Announcements</h3>
            <ProgressBar
              value={controlledValue}
              label="Accessible Progress"
              description="This progress bar announces changes to screen readers"
              showPercentage
              announceProgress
              aria-label="File upload progress"
            />
            <p className="text-sm text-slate-600">
              🔊 This progress bar will announce value changes to screen readers.
              Try adjusting the slider above to hear the announcements.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Custom ARIA Labels</h3>
            <ProgressBar
              value={88}
              variant="warning"
              showPercentage
              aria-label="Battery charge level"
              aria-describedby="battery-description"
            />
            <p id="battery-description" className="text-sm text-slate-600">
              Battery is at 88% charge. Consider plugging in when it reaches 20%.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">High Priority Announcements</h3>
            <ProgressBar
              value={15}
              variant="error"
              label="Critical System Resource"
              description="Immediate attention required"
              showPercentage
              announceProgress
              priority="high"
            />
            <p className="text-sm text-slate-600">
              ⚠️ High priority progress changes are announced with assertive live regions.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Enterprise Features
        </h2>
        
        <div className="grid gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Custom Value Formatting</h3>
            <ProgressBar
              value={1250}
              max={2000}
              variant="info"
              label="Data Transfer"
              showValue
              formatValue={(value, max) => `${(value / 1000).toFixed(1)}K / ${(max / 1000).toFixed(1)}K items`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">With Metadata</h3>
            <ProgressBar
              value={67}
              variant="success"
              label="Enterprise Task Progress"
              description="Task ID: TASK-2024-001"
              showPercentage
              metadata={{
                taskId: 'TASK-2024-001',
                userId: 'user-123',
                timestamp: Date.now(),
                category: 'data-processing'
              }}
            />
            <p className="text-sm text-slate-600">
              📊 Metadata can be attached for enterprise logging and analytics.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium text-slate-700">Custom Styling</h3>
            <ProgressBar
              value={45}
              variant="primary"
              label="Custom Styled Progress"
              showPercentage
              containerClassName="border-2 border-blue-200"
              indicatorClassName="shadow-lg"
              className="p-2 bg-blue-50 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b border-slate-200 pb-2">
          Implementation Examples
        </h2>
        
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-700 mb-2">Basic Usage</h4>
            <pre className="text-sm text-slate-600 overflow-x-auto">
{`<ProgressBar
  value={65}
  label="Download Progress"
  showPercentage
/>`}
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-700 mb-2">With useProgressBar Hook</h4>
            <pre className="text-sm text-slate-600 overflow-x-auto">
{`const progress = useProgressBar({
  initialValue: 0,
  max: 100,
  autoIncrement: 100, // ms
  onComplete: () => console.log('Done!')
});

<ProgressBar
  value={progress.value}
  showPercentage
/>`}
            </pre>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-700 mb-2">Accessibility Enhanced</h4>
            <pre className="text-sm text-slate-600 overflow-x-auto">
{`<ProgressBar
  value={progress}
  variant="success"
  announceProgress
  priority="high"
  aria-label="File upload progress"
/>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressBarDemo;
