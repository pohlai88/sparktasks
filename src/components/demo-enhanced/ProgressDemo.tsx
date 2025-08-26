/**
 * Enhanced Progress Demo - MAPS v2.2 Dark-First Showcase
 *
 * COMPREHENSIVE DEMONSTRATION:
 * - All Progress variants (default, glass, minimal, elevated)
 * - Size and density options
 * - AAA compliance enforcement
 * - Liquid glass materials showcase
 * - Circular and Stepped progress variants
 * - Semantic color variants
 * - Real-world usage patterns
 *
 * MAPS v2.2 COMPLIANCE:
 * - Dark-first philosophy demonstration
 * - Apple HIG interaction patterns
 * - Platform-aware responsiveness
 * - Systematic spacing showcase
 * - Enhanced token usage
 */

import React, { useState, useEffect } from 'react';

import {
  EnhancedProgress,
  CircularProgress,
  SteppedProgress,
} from '../ui-enhanced/Progress';

// ===== DEMO STATE MANAGEMENT =====

interface DemoState {
  basicProgress: number;
  uploadProgress: number;
  downloadProgress: number;
  installStep: number;
  aaaMode: boolean;
  density: 'comfortable' | 'compact';
  isAnimating: boolean;
}

const ProgressDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    basicProgress: 65,
    uploadProgress: 0,
    downloadProgress: 45,
    installStep: 2,
    aaaMode: false,
    density: 'comfortable',
    isAnimating: false,
  });

  // Simulate upload progress
  useEffect(() => {
    if (demoState.isAnimating) {
      const interval = setInterval(() => {
        setDemoState(prev => ({
          ...prev,
          uploadProgress:
            prev.uploadProgress >= 100 ? 0 : prev.uploadProgress + 2,
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [demoState.isAnimating]);

  const handleStateChange = <K extends keyof DemoState>(
    key: K,
    value: DemoState[K]
  ) => {
    setDemoState(prev => ({ ...prev, [key]: value }));
  };

  const installSteps = [
    'Download',
    'Verify',
    'Install',
    'Configure',
    'Complete',
  ];

  // ===== DEMO SECTIONS =====

  return (
    <div className='space-y-8 p-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-4xl font-bold leading-tight tracking-tight text-foreground'>
          Enhanced Progress
        </h1>
        <p className='text-lg text-foreground-muted'>
          Professional progress indicators with MAPS v2.2 dark-first philosophy,
          Apple HIG compliance, and comprehensive accessibility features.
        </p>
      </div>

      {/* Demo Controls */}
      <div className='flex flex-wrap gap-4 rounded-lg border border-border bg-background-elevated p-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-foreground'>AAA Mode:</span>
          <button
            onClick={() => handleStateChange('aaaMode', !demoState.aaaMode)}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              demoState.aaaMode
                ? 'bg-accent-solid-aaa text-background'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {demoState.aaaMode ? 'AAA Enforced' : 'Standard Mode'}
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-foreground'>Density:</span>
          <select
            value={demoState.density}
            onChange={e =>
              handleStateChange(
                'density',
                e.target.value as 'comfortable' | 'compact'
              )
            }
            className='rounded border border-border bg-background-elevated px-2 py-1 text-sm'
          >
            <option value='comfortable'>Comfortable</option>
            <option value='compact'>Compact</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-foreground'>
            Animation:
          </span>
          <button
            onClick={() =>
              handleStateChange('isAnimating', !demoState.isAnimating)
            }
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              demoState.isAnimating
                ? 'bg-accent-primary text-background'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {demoState.isAnimating ? 'Stop' : 'Start'} Animation
          </button>
        </div>
      </div>

      {/* Basic Progress Bars */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Linear Progress Bars
          </h2>
          <p className='text-foreground-muted'>
            Standard progress indicators with different variants and sizes.
          </p>
        </div>

        <div className='space-y-6'>
          {/* Default Progress */}
          <div className='space-y-2'>
            <h3 className='text-lg font-medium text-foreground'>Default</h3>
            <EnhancedProgress
              value={demoState.basicProgress}
              showLabel={true}
              enforceAAA={demoState.aaaMode}
              density={demoState.density}
            />
            <div className='flex gap-2'>
              <button
                onClick={() =>
                  handleStateChange(
                    'basicProgress',
                    Math.max(0, demoState.basicProgress - 10)
                  )
                }
                className='rounded bg-muted px-2 py-1 text-xs hover:bg-muted/80'
              >
                -10%
              </button>
              <button
                onClick={() =>
                  handleStateChange(
                    'basicProgress',
                    Math.min(100, demoState.basicProgress + 10)
                  )
                }
                className='rounded bg-muted px-2 py-1 text-xs hover:bg-muted/80'
              >
                +10%
              </button>
            </div>
          </div>

          {/* Glass Variant */}
          <div className='relative overflow-hidden rounded-lg border border-border'>
            <div className='absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-secondary/20' />
            <div className='relative space-y-2 bg-background-panel/60 p-4'>
              <h3 className='text-lg font-medium text-foreground'>
                Glass Variant
              </h3>
              <EnhancedProgress
                value={75}
                variant='glass'
                indicatorVariant='gradient'
                showLabel={true}
                enforceAAA={demoState.aaaMode}
                density={demoState.density}
              />
              <p className='text-sm text-foreground-muted'>
                Ethereal vibrancy effects with backdrop blur and content
                protection.
              </p>
            </div>
          </div>

          {/* Size Variants */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium text-foreground'>
              Size Variants
            </h3>

            <div className='space-y-3'>
              <div>
                <div className='mb-1 text-sm text-foreground-muted'>Small</div>
                <EnhancedProgress
                  value={40}
                  size='sm'
                  showLabel={true}
                  labelPosition='outside'
                  enforceAAA={demoState.aaaMode}
                />
              </div>

              <div>
                <div className='mb-1 text-sm text-foreground-muted'>
                  Medium (Default)
                </div>
                <EnhancedProgress
                  value={60}
                  size='md'
                  showLabel={true}
                  labelPosition='outside'
                  enforceAAA={demoState.aaaMode}
                />
              </div>

              <div>
                <div className='mb-1 text-sm text-foreground-muted'>Large</div>
                <EnhancedProgress
                  value={80}
                  size='lg'
                  showLabel={true}
                  labelPosition='outside'
                  enforceAAA={demoState.aaaMode}
                />
              </div>

              <div>
                <div className='mb-1 text-sm text-foreground-muted'>
                  Extra Large
                </div>
                <EnhancedProgress
                  value={95}
                  size='xl'
                  showLabel={true}
                  labelPosition='inside'
                  enforceAAA={demoState.aaaMode}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Semantic Variants */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Semantic Progress States
          </h2>
          <p className='text-foreground-muted'>
            Progress indicators with semantic meaning and contextual colors.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-3'>
            <div>
              <div className='mb-2 text-sm font-medium text-foreground'>
                Success
              </div>
              <EnhancedProgress
                value={100}
                indicatorVariant='success'
                showLabel={true}
                label='Complete'
                enforceAAA={demoState.aaaMode}
              />
            </div>

            <div>
              <div className='mb-2 text-sm font-medium text-foreground'>
                Warning
              </div>
              <EnhancedProgress
                value={85}
                indicatorVariant='warning'
                showLabel={true}
                label='85% - Space Low'
                enforceAAA={demoState.aaaMode}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <div>
              <div className='mb-2 text-sm font-medium text-foreground'>
                Error
              </div>
              <EnhancedProgress
                value={25}
                indicatorVariant='error'
                showLabel={true}
                label='25% - Failed'
                enforceAAA={demoState.aaaMode}
              />
            </div>

            <div>
              <div className='mb-2 text-sm font-medium text-foreground'>
                Info
              </div>
              <EnhancedProgress
                value={60}
                indicatorVariant='info'
                showLabel={true}
                enforceAAA={demoState.aaaMode}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Circular Progress */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Circular Progress
          </h2>
          <p className='text-foreground-muted'>
            Circular progress indicators for space-constrained layouts.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-4'>
          <div className='flex flex-col items-center space-y-2'>
            <CircularProgress
              value={demoState.downloadProgress}
              size='sm'
              showCenterLabel={true}
              indicatorVariant='default'
              enforceAAA={demoState.aaaMode}
            />
            <span className='text-xs text-foreground-muted'>Small</span>
          </div>

          <div className='flex flex-col items-center space-y-2'>
            <CircularProgress
              value={demoState.downloadProgress}
              size='md'
              showCenterLabel={true}
              indicatorVariant='info'
              enforceAAA={demoState.aaaMode}
            />
            <span className='text-xs text-foreground-muted'>Medium</span>
          </div>

          <div className='flex flex-col items-center space-y-2'>
            <CircularProgress
              value={demoState.downloadProgress}
              size='lg'
              showCenterLabel={true}
              indicatorVariant='success'
              enforceAAA={demoState.aaaMode}
            />
            <span className='text-xs text-foreground-muted'>Large</span>
          </div>

          <div className='flex flex-col items-center space-y-2'>
            <CircularProgress
              value={demoState.downloadProgress}
              size='xl'
              showCenterLabel={true}
              indicatorVariant='gradient'
              enforceAAA={demoState.aaaMode}
            />
            <span className='text-xs text-foreground-muted'>Extra Large</span>
          </div>
        </div>

        <div className='flex justify-center gap-2'>
          <button
            onClick={() =>
              handleStateChange(
                'downloadProgress',
                Math.max(0, demoState.downloadProgress - 15)
              )
            }
            className='rounded bg-muted px-3 py-1 text-sm hover:bg-muted/80'
          >
            -15%
          </button>
          <button
            onClick={() =>
              handleStateChange(
                'downloadProgress',
                Math.min(100, demoState.downloadProgress + 15)
              )
            }
            className='rounded bg-muted px-3 py-1 text-sm hover:bg-muted/80'
          >
            +15%
          </button>
        </div>
      </section>

      {/* Stepped Progress */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Stepped Progress
          </h2>
          <p className='text-foreground-muted'>
            Multi-step progress with individual step indicators and labels.
          </p>
        </div>

        <div className='space-y-6'>
          <div className='rounded-lg border border-border bg-background-elevated p-6'>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              Installation Progress
            </h3>

            <SteppedProgress
              currentStep={demoState.installStep}
              totalSteps={installSteps.length}
              stepLabels={installSteps}
              showStepNumbers={false}
              completedVariant='success'
              enforceAAA={demoState.aaaMode}
              size={demoState.density === 'compact' ? 'sm' : 'md'}
            />

            <div className='mt-4 flex justify-center gap-2'>
              <button
                onClick={() =>
                  handleStateChange(
                    'installStep',
                    Math.max(0, demoState.installStep - 1)
                  )
                }
                className='rounded bg-muted px-3 py-1 text-sm hover:bg-muted/80'
                disabled={demoState.installStep === 0}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  handleStateChange(
                    'installStep',
                    Math.min(installSteps.length - 1, demoState.installStep + 1)
                  )
                }
                className='rounded bg-muted px-3 py-1 text-sm hover:bg-muted/80'
                disabled={demoState.installStep === installSteps.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          <div className='rounded-lg border border-border bg-background-elevated p-6'>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              Numbered Steps
            </h3>

            <SteppedProgress
              currentStep={1}
              totalSteps={4}
              stepLabels={['Start', 'Process', 'Review', 'Finish']}
              showStepNumbers={true}
              completedVariant='default'
              enforceAAA={demoState.aaaMode}
              size={demoState.density === 'compact' ? 'sm' : 'md'}
            />
          </div>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Real-world Examples
          </h2>
          <p className='text-foreground-muted'>
            Common usage patterns and practical implementations.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* File Upload */}
          <div className='rounded-lg border border-border bg-background-elevated p-6'>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              File Upload
            </h3>

            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='text-sm text-foreground-muted'>
                  document.pdf
                </div>
                <div className='text-xs text-foreground-muted'>2.4 MB</div>
              </div>

              <EnhancedProgress
                value={demoState.uploadProgress}
                showLabel={true}
                animated={demoState.isAnimating}
                enforceAAA={demoState.aaaMode}
                aria-label='File upload progress'
              />

              <div className='text-xs text-foreground-muted'>
                {demoState.isAnimating ? 'Uploading...' : 'Ready to upload'}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className='rounded-lg border border-border bg-background-elevated p-6'>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              System Resources
            </h3>

            <div className='space-y-4'>
              <div>
                <div className='mb-1 flex justify-between text-sm'>
                  <span className='text-foreground'>CPU Usage</span>
                  <span className='text-foreground-muted'>34%</span>
                </div>
                <EnhancedProgress
                  value={34}
                  size='sm'
                  indicatorVariant='info'
                  enforceAAA={demoState.aaaMode}
                />
              </div>

              <div>
                <div className='mb-1 flex justify-between text-sm'>
                  <span className='text-foreground'>Memory</span>
                  <span className='text-foreground-muted'>78%</span>
                </div>
                <EnhancedProgress
                  value={78}
                  size='sm'
                  indicatorVariant='warning'
                  enforceAAA={demoState.aaaMode}
                />
              </div>

              <div>
                <div className='mb-1 flex justify-between text-sm'>
                  <span className='text-foreground'>Storage</span>
                  <span className='text-foreground-muted'>92%</span>
                </div>
                <EnhancedProgress
                  value={92}
                  size='sm'
                  indicatorVariant='error'
                  enforceAAA={demoState.aaaMode}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Examples */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Implementation Examples
          </h2>
          <p className='text-foreground-muted'>
            Copy these code examples to implement Progress in your application.
          </p>
        </div>

        <div className='space-y-4'>
          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Basic Linear Progress
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<EnhancedProgress
  value={75}
  showLabel={true}
  enforceAAA={false}
/>`}
              </pre>
            </div>
          </div>

          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Circular with Semantic Colors
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<CircularProgress
  value={90}
  size="lg"
  showCenterLabel={true}
  indicatorVariant="success"
/>`}
              </pre>
            </div>
          </div>

          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Multi-Step Progress
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<SteppedProgress
  currentStep={2}
  totalSteps={5}
  stepLabels={['Start', 'Process', 'Review', 'Test', 'Deploy']}
  showStepNumbers={true}
  completedVariant="success"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressDemo;
