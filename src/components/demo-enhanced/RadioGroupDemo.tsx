/**
 * Enhanced Radio Group Demo - MAPS v2.2 Dark-First Showcase
 *
 * COMPREHENSIVE DEMONSTRATION:
 * - All Radio Group variants (default, ghost, glass, elevated, AAA)
 * - Size and density options
 * - Label positioning variants
 * - Indicator styles showcase
 * - Card-style radio selections
 * - Real-world usage patterns
 *
 * MAPS v2.2 COMPLIANCE:
 * - Dark-first philosophy demonstration
 * - Apple HIG interaction patterns
 * - Platform-aware responsiveness
 * - Systematic spacing showcase
 * - Enhanced token usage
 * - AAA compliance enforcement
 */

import {
  Settings,
  Shield,
  Zap,
  Cloud,
  Database,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import {
  EnhancedRadioGroup,
  EnhancedRadioGroupItem,
  EnhancedRadioGroupCard,
} from '../ui-enhanced/RadioGroup';

// ===== DEMO STATE MANAGEMENT =====

interface DemoState {
  basicSelection: string;
  variantSelection: string;
  sizeSelection: string;
  labelPosition: 'right' | 'left' | 'top' | 'bottom';
  indicatorStyle: 'dot' | 'icon' | 'filled';
  cardSelection: string;
  settingsSelection: string;
  planSelection: string;
  themeSelection: string;
  aaaMode: boolean;
  density: 'comfortable' | 'compact';
}

const RadioGroupDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    basicSelection: 'option2',
    variantSelection: 'default',
    sizeSelection: 'md',
    labelPosition: 'right',
    indicatorStyle: 'dot',
    cardSelection: 'pro',
    settingsSelection: 'automatic',
    planSelection: 'standard',
    themeSelection: 'dark',
    aaaMode: false,
    density: 'comfortable',
  });

  const handleStateChange = <K extends keyof DemoState>(
    key: K,
    value: DemoState[K]
  ) => {
    setDemoState(prev => ({ ...prev, [key]: value }));
  };

  // ===== DEMO SECTIONS =====

  return (
    <div className='space-y-8 p-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-4xl font-bold leading-tight tracking-tight text-foreground'>
          Enhanced Radio Group
        </h1>
        <p className='text-lg text-foreground-muted'>
          Professional radio group components with MAPS v2.2 dark-first
          philosophy, Apple HIG compliance, and comprehensive accessibility
          features.
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
      </div>

      {/* Basic Radio Groups */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Basic Radio Groups
          </h2>
          <p className='text-foreground-muted'>
            Standard radio groups with different orientations and densities.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Vertical Radio Group */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium text-foreground'>
              Vertical Layout
            </h3>
            <EnhancedRadioGroup
              value={demoState.basicSelection}
              onValueChange={value =>
                handleStateChange('basicSelection', value)
              }
              orientation='vertical'
              density={demoState.density}
              enforceAAA={demoState.aaaMode}
              description='Choose your preferred option'
            >
              <EnhancedRadioGroupItem
                value='option1'
                label='First Option'
                description='This is the first available option'
              />
              <EnhancedRadioGroupItem
                value='option2'
                label='Second Option'
                description='This is the second available option'
              />
              <EnhancedRadioGroupItem
                value='option3'
                label='Third Option'
                description='This is the third available option'
              />
            </EnhancedRadioGroup>
            <div className='text-xs text-muted-foreground'>
              Selected: {demoState.basicSelection}
            </div>
          </div>

          {/* Horizontal Radio Group */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium text-foreground'>
              Horizontal Layout
            </h3>
            <EnhancedRadioGroup
              value={demoState.themeSelection}
              onValueChange={value =>
                handleStateChange('themeSelection', value)
              }
              orientation='horizontal'
              density={demoState.density}
              enforceAAA={demoState.aaaMode}
            >
              <EnhancedRadioGroupItem value='light' label='Light' />
              <EnhancedRadioGroupItem value='dark' label='Dark' />
              <EnhancedRadioGroupItem value='auto' label='Auto' />
            </EnhancedRadioGroup>
            <div className='text-xs text-muted-foreground'>
              Selected: {demoState.themeSelection}
            </div>
          </div>
        </div>
      </section>

      {/* Variant Showcase */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Visual Variants
          </h2>
          <p className='text-foreground-muted'>
            Different visual styles for various design contexts.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {/* Default Variant */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-foreground'>Default</h3>
            <EnhancedRadioGroup
              value={demoState.variantSelection}
              onValueChange={value =>
                handleStateChange('variantSelection', value)
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='default'
                label='Default Style'
                variant='default'
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupItem
                value='sample1'
                label='Sample Option'
                variant='default'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>

          {/* Ghost Variant */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-foreground'>Ghost</h3>
            <EnhancedRadioGroup
              value={demoState.variantSelection}
              onValueChange={value =>
                handleStateChange('variantSelection', value)
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='ghost'
                label='Ghost Style'
                variant='ghost'
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupItem
                value='sample2'
                label='Sample Option'
                variant='ghost'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>

          {/* Glass Variant */}
          <div className='relative overflow-hidden rounded-lg border border-border'>
            <div className='absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-secondary/20' />
            <div className='relative space-y-3 bg-background-panel/60 p-4'>
              <h3 className='text-sm font-medium text-foreground'>Glass</h3>
              <EnhancedRadioGroup
                value={demoState.variantSelection}
                onValueChange={value =>
                  handleStateChange('variantSelection', value)
                }
                density={demoState.density}
              >
                <EnhancedRadioGroupItem
                  value='glass'
                  label='Glass Style'
                  variant='glass'
                  enforceAAA={demoState.aaaMode}
                />
                <EnhancedRadioGroupItem
                  value='sample3'
                  label='Sample Option'
                  variant='glass'
                  enforceAAA={demoState.aaaMode}
                />
              </EnhancedRadioGroup>
            </div>
          </div>

          {/* Elevated Variant */}
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-foreground'>Elevated</h3>
            <EnhancedRadioGroup
              value={demoState.variantSelection}
              onValueChange={value =>
                handleStateChange('variantSelection', value)
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='elevated'
                label='Elevated Style'
                variant='elevated'
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupItem
                value='sample4'
                label='Sample Option'
                variant='elevated'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>
        </div>
      </section>

      {/* Size and Label Position Variants */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Size and Label Variants
          </h2>
          <p className='text-foreground-muted'>
            Different sizes and label positioning options for various layouts.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Size Variants */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>
              Size Options
            </h3>
            <EnhancedRadioGroup
              value={demoState.sizeSelection}
              onValueChange={value => handleStateChange('sizeSelection', value)}
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='sm'
                label='Small (sm)'
                size='sm'
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupItem
                value='md'
                label='Medium (md)'
                size='md'
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupItem
                value='lg'
                label='Large (lg)'
                size='lg'
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupItem
                value='xl'
                label='Extra Large (xl)'
                size='xl'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>

          {/* Label Position Variants */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>
              Label Positions
            </h3>
            <div className='space-y-4'>
              <EnhancedRadioGroup
                value={demoState.labelPosition}
                onValueChange={value =>
                  handleStateChange(
                    'labelPosition',
                    value as 'right' | 'left' | 'top' | 'bottom'
                  )
                }
                density={demoState.density}
              >
                <EnhancedRadioGroupItem
                  value='right'
                  label='Label on Right'
                  labelPosition='right'
                  enforceAAA={demoState.aaaMode}
                />
                <EnhancedRadioGroupItem
                  value='left'
                  label='Label on Left'
                  labelPosition='left'
                  enforceAAA={demoState.aaaMode}
                />
                <EnhancedRadioGroupItem
                  value='top'
                  label='Label on Top'
                  labelPosition='top'
                  enforceAAA={demoState.aaaMode}
                />
                <EnhancedRadioGroupItem
                  value='bottom'
                  label='Label on Bottom'
                  labelPosition='bottom'
                  enforceAAA={demoState.aaaMode}
                />
              </EnhancedRadioGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Indicator Styles */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Indicator Styles
          </h2>
          <p className='text-foreground-muted'>
            Different visual styles for the checked state indicator.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-foreground'>Dot Style</h3>
            <EnhancedRadioGroup
              value={demoState.indicatorStyle}
              onValueChange={value =>
                handleStateChange(
                  'indicatorStyle',
                  value as 'dot' | 'icon' | 'filled'
                )
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='dot'
                label='Dot Indicator'
                indicatorStyle='dot'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>

          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-foreground'>Icon Style</h3>
            <EnhancedRadioGroup
              value={demoState.indicatorStyle}
              onValueChange={value =>
                handleStateChange(
                  'indicatorStyle',
                  value as 'dot' | 'icon' | 'filled'
                )
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='icon'
                label='Icon Indicator'
                indicatorStyle='icon'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>

          <div className='space-y-3'>
            <h3 className='text-sm font-medium text-foreground'>
              Filled Style
            </h3>
            <EnhancedRadioGroup
              value={demoState.indicatorStyle}
              onValueChange={value =>
                handleStateChange(
                  'indicatorStyle',
                  value as 'dot' | 'icon' | 'filled'
                )
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupItem
                value='filled'
                label='Filled Indicator'
                indicatorStyle='filled'
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
          </div>
        </div>
      </section>

      {/* Card Style Radio Groups */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Card Style Radio Groups
          </h2>
          <p className='text-foreground-muted'>
            Rich card-style radio selections for complex choices.
          </p>
        </div>

        <div className='space-y-6'>
          {/* Subscription Plans */}
          <div>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              Subscription Plans
            </h3>
            <EnhancedRadioGroup
              value={demoState.planSelection}
              onValueChange={value => handleStateChange('planSelection', value)}
              orientation='horizontal'
              density={demoState.density}
            >
              <EnhancedRadioGroupCard
                value='basic'
                title='Basic Plan'
                description='Perfect for individuals getting started'
                icon={<Users className='size-5' />}
                enforceAAA={demoState.aaaMode}
                cardVariant='default'
              />
              <EnhancedRadioGroupCard
                value='standard'
                title='Standard Plan'
                description='Great for small teams and growing businesses'
                icon={<Zap className='size-5' />}
                enforceAAA={demoState.aaaMode}
                cardVariant='elevated'
              />
              <EnhancedRadioGroupCard
                value='pro'
                title='Pro Plan'
                description='Advanced features for power users'
                icon={<Shield className='size-5' />}
                enforceAAA={demoState.aaaMode}
                cardVariant='glass'
              />
            </EnhancedRadioGroup>
            <div className='mt-2 text-xs text-muted-foreground'>
              Selected plan: {demoState.planSelection}
            </div>
          </div>

          {/* Settings Options */}
          <div>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              Backup Settings
            </h3>
            <EnhancedRadioGroup
              value={demoState.settingsSelection}
              onValueChange={value =>
                handleStateChange('settingsSelection', value)
              }
              density={demoState.density}
            >
              <EnhancedRadioGroupCard
                value='manual'
                title='Manual Backup'
                description='Create backups manually when needed'
                icon={<Database className='size-5' />}
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupCard
                value='automatic'
                title='Automatic Backup'
                description='Daily automatic backups to cloud storage'
                icon={<Cloud className='size-5' />}
                enforceAAA={demoState.aaaMode}
              />
              <EnhancedRadioGroupCard
                value='hybrid'
                title='Hybrid Approach'
                description='Combination of automatic and manual backups'
                icon={<Settings className='size-5' />}
                enforceAAA={demoState.aaaMode}
              />
            </EnhancedRadioGroup>
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
          {/* Survey Form */}
          <div className='rounded-lg border border-border bg-background-elevated p-6'>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              User Satisfaction Survey
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-foreground'>
                  How would you rate our service?
                </label>
                <EnhancedRadioGroup
                  defaultValue='good'
                  density={demoState.density}
                >
                  <EnhancedRadioGroupItem
                    value='excellent'
                    label='Excellent'
                    enforceAAA={demoState.aaaMode}
                  />
                  <EnhancedRadioGroupItem
                    value='good'
                    label='Good'
                    enforceAAA={demoState.aaaMode}
                  />
                  <EnhancedRadioGroupItem
                    value='fair'
                    label='Fair'
                    enforceAAA={demoState.aaaMode}
                  />
                  <EnhancedRadioGroupItem
                    value='poor'
                    label='Poor'
                    enforceAAA={demoState.aaaMode}
                  />
                </EnhancedRadioGroup>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className='rounded-lg border border-border bg-background-elevated p-6'>
            <h3 className='mb-4 text-lg font-medium text-foreground'>
              Language Settings
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-foreground'>
                  Display Language
                </label>
                <EnhancedRadioGroup
                  defaultValue='en'
                  density={demoState.density}
                >
                  <EnhancedRadioGroupItem
                    value='en'
                    label='English'
                    description='English (United States)'
                    enforceAAA={demoState.aaaMode}
                  />
                  <EnhancedRadioGroupItem
                    value='es'
                    label='Español'
                    description='Spanish (Spain)'
                    enforceAAA={demoState.aaaMode}
                  />
                  <EnhancedRadioGroupItem
                    value='fr'
                    label='Français'
                    description='French (France)'
                    enforceAAA={demoState.aaaMode}
                  />
                  <EnhancedRadioGroupItem
                    value='de'
                    label='Deutsch'
                    description='German (Germany)'
                    enforceAAA={demoState.aaaMode}
                  />
                </EnhancedRadioGroup>
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
            Copy these code examples to implement Radio Groups in your
            application.
          </p>
        </div>

        <div className='space-y-4'>
          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Basic Radio Group
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<EnhancedRadioGroup value={value} onValueChange={setValue}>
  <EnhancedRadioGroupItem value="option1" label="Option 1" />
  <EnhancedRadioGroupItem value="option2" label="Option 2" />
  <EnhancedRadioGroupItem value="option3" label="Option 3" />
</EnhancedRadioGroup>`}
              </pre>
            </div>
          </div>

          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Card Style with Icons
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<EnhancedRadioGroup value={plan} onValueChange={setPlan}>
  <EnhancedRadioGroupCard
    value="basic"
    title="Basic Plan"
    description="Perfect for individuals"
    icon={<Users className="h-5 w-5" />}
  />
  <EnhancedRadioGroupCard
    value="pro"
    title="Pro Plan"
    description="Advanced features"
    icon={<Shield className="h-5 w-5" />}
  />
</EnhancedRadioGroup>`}
              </pre>
            </div>
          </div>

          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                With Descriptions and AAA Mode
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<EnhancedRadioGroup
  value={value}
  onValueChange={setValue}
  enforceAAA={true}
  description="Choose your preference"
>
  <EnhancedRadioGroupItem
    value="option1"
    label="Option 1"
    description="This option provides..."
  />
</EnhancedRadioGroup>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RadioGroupDemo;
