/**
 * @fileoverview SplitPanels Demo Component - Enterprise Showcase
 *
 * @description Comprehensive demonstration of SplitPanels component functionality
 * showcasing all features, configurations, and use cases for enterprise applications.
 *
 * @version 1.0.0
 * @since 2025-08-21
 */

import { useState, useCallback } from 'react';
import { SplitPanels, SplitPanel } from '@/components/layout/SplitPanels';
import type {
  SplitDirection,
  ResizeMode,
  LayoutMetrics,
} from '@/components/layout/SplitPanels';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DESIGN_TOKENS } from '@/design/tokens';

export function SplitPanelsDemo() {
  // State for different demo configurations
  const [horizontalSizes, setHorizontalSizes] = useState<number[]>([30, 70]);
  const [verticalSizes, setVerticalSizes] = useState<number[]>([25, 50, 25]);
  const [direction, setDirection] = useState<SplitDirection>('horizontal');
  const [resizeMode, setResizeMode] = useState<ResizeMode>('smooth');
  const [resizable, setResizable] = useState(true);
  const [touchEnabled, setTouchEnabled] = useState(true);
  const [persistSizes, setPersistSizes] = useState(false);

  // Metrics for performance monitoring
  const [layoutMetrics, setLayoutMetrics] = useState<LayoutMetrics | null>(
    null
  );

  // Callback handlers
  const handleSizeChange = useCallback(
    (sizes: number[], panelIndex?: number) => {
      console.log('Panel sizes changed:', sizes, 'Panel index:', panelIndex);
      if (direction === 'horizontal') {
        setHorizontalSizes(sizes);
      } else {
        setVerticalSizes(sizes);
      }
    },
    [direction]
  );

  const handleCollapse = useCallback(
    (panelIndex: number, collapsed: boolean) => {
      console.log(
        `Panel ${panelIndex} ${collapsed ? 'collapsed' : 'expanded'}`
      );
    },
    []
  );

  const handleLayoutChange = useCallback((metrics: LayoutMetrics) => {
    setLayoutMetrics(metrics);
  }, []);

  return (
    <div className='space-y-8 p-6'>
      {/* Header */}
      <div>
        <h1 className={DESIGN_TOKENS.typography.heading.h2}>
          SplitPanels Component Demo
        </h1>
        <p className={`${DESIGN_TOKENS.typography.body.secondary} mt-2`}>
          Enterprise-grade resizable panel system for complex layouts
        </p>
      </div>

      {/* Configuration Controls */}
      <Card title='Configuration Controls' variant='default'>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Direction Control */}
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Direction
              </label>
              <div className='flex gap-2'>
                <Button
                  variant={direction === 'horizontal' ? 'primary' : 'ghost'}
                  size='sm'
                  onClick={() => setDirection('horizontal')}
                >
                  Horizontal
                </Button>
                <Button
                  variant={direction === 'vertical' ? 'primary' : 'ghost'}
                  size='sm'
                  onClick={() => setDirection('vertical')}
                >
                  Vertical
                </Button>
              </div>
            </div>

            {/* Resize Mode Control */}
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Resize Mode
              </label>
              <div className='flex gap-2'>
                {(['smooth', 'immediate', 'debounced'] as ResizeMode[]).map(
                  mode => (
                    <Button
                      key={mode}
                      variant={resizeMode === mode ? 'primary' : 'ghost'}
                      size='sm'
                      onClick={() => setResizeMode(mode)}
                    >
                      {mode}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Feature Toggles */}
            <div>
              <label className='mb-2 block text-sm font-medium'>Features</label>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant={resizable ? 'primary' : 'ghost'}
                  size='sm'
                  onClick={() => setResizable(!resizable)}
                >
                  Resizable
                </Button>
                <Button
                  variant={touchEnabled ? 'primary' : 'ghost'}
                  size='sm'
                  onClick={() => setTouchEnabled(!touchEnabled)}
                >
                  Touch
                </Button>
                <Button
                  variant={persistSizes ? 'primary' : 'ghost'}
                  size='sm'
                  onClick={() => setPersistSizes(!persistSizes)}
                >
                  Persist
                </Button>
              </div>
            </div>
          </div>

          {/* Current Sizes Display */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Current Panel Sizes
            </label>
            <div className='flex gap-2'>
              {(direction === 'horizontal'
                ? horizontalSizes
                : verticalSizes
              ).map((size, index) => (
                <Badge key={index} variant='default'>
                  Panel {index + 1}: {size.toFixed(1)}%
                </Badge>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          {layoutMetrics && (
            <div>
              <label className='mb-2 block text-sm font-medium'>
                Layout Metrics
              </label>
              <div className='grid grid-cols-2 gap-2 text-sm md:grid-cols-4'>
                <div>Container: {layoutMetrics.containerSize}px</div>
                <div>Panels: {layoutMetrics.panelCount}</div>
                <div>Resize Time: {layoutMetrics.resizeTime.toFixed(2)}ms</div>
                <div>
                  Collapsed:{' '}
                  {layoutMetrics.collapsedPanels.filter(Boolean).length}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Basic Horizontal Split Demo */}
      <Card title='Basic Horizontal Split' variant='default'>
        <div className='h-64'>
          <SplitPanels
            direction='horizontal'
            sizes={horizontalSizes}
            minSizes={[200, 300]}
            resizable={resizable}
            resizeMode={resizeMode}
            touchEnabled={touchEnabled}
            persistSizes={persistSizes}
            storageKey='demo-horizontal-panels'
            onSizeChange={handleSizeChange}
            onLayoutChange={handleLayoutChange}
            data-testid='horizontal-demo'
          >
            <SplitPanel id='sidebar' title='Sidebar Panel'>
              <div className='h-full bg-blue-50 p-4 dark:bg-blue-950/20'>
                <h3 className='mb-2 font-semibold'>Sidebar Content</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  This is the left panel that can be resized. Try dragging the
                  separator handle.
                </p>
                <div className='mt-4 space-y-2'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='w-full justify-start'
                  >
                    📁 Documents
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='w-full justify-start'
                  >
                    🖼️ Images
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='w-full justify-start'
                  >
                    ⚙️ Settings
                  </Button>
                </div>
              </div>
            </SplitPanel>

            <SplitPanel id='main' title='Main Content Area'>
              <div className='h-full bg-green-50 p-4 dark:bg-green-950/20'>
                <h3 className='mb-2 font-semibold'>Main Content</h3>
                <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                  This is the main content area. The panels maintain their
                  proportions and respect minimum size constraints.
                </p>
                <div className='grid grid-cols-2 gap-4'>
                  <Card variant='outlined' className='p-3'>
                    <h4 className='mb-1 font-medium'>Feature 1</h4>
                    <p className='text-xs text-gray-500'>Responsive design</p>
                  </Card>
                  <Card variant='outlined' className='p-3'>
                    <h4 className='mb-1 font-medium'>Feature 2</h4>
                    <p className='text-xs text-gray-500'>Accessibility</p>
                  </Card>
                  <Card variant='outlined' className='p-3'>
                    <h4 className='mb-1 font-medium'>Feature 3</h4>
                    <p className='text-xs text-gray-500'>Performance</p>
                  </Card>
                  <Card variant='outlined' className='p-3'>
                    <h4 className='mb-1 font-medium'>Feature 4</h4>
                    <p className='text-xs text-gray-500'>Type Safety</p>
                  </Card>
                </div>
              </div>
            </SplitPanel>
          </SplitPanels>
        </div>
      </Card>

      {/* Three-Panel Vertical Split Demo */}
      <Card title='Three-Panel Vertical Layout' variant='default'>
        <div className='h-80'>
          <SplitPanels
            direction='vertical'
            sizes={verticalSizes}
            minSizes={[100, 150, 80]}
            maxSizes={[300, 400, 200]}
            collapsible={[false, false, true]}
            resizable={resizable}
            resizeMode={resizeMode}
            touchEnabled={touchEnabled}
            onSizeChange={handleSizeChange}
            onCollapse={handleCollapse}
            onLayoutChange={handleLayoutChange}
            data-testid='vertical-demo'
          >
            <SplitPanel id='header' title='Header Panel'>
              <div className='h-full bg-purple-50 p-4 dark:bg-purple-950/20'>
                <h3 className='mb-2 font-semibold'>Header Section</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Top panel with navigation and controls.
                </p>
                <div className='mt-3 flex gap-2'>
                  <Badge variant='success'>Active</Badge>
                  <Badge variant='default'>Status</Badge>
                  <Badge variant='info'>Connected</Badge>
                </div>
              </div>
            </SplitPanel>

            <SplitPanel id='workspace' title='Workspace Panel'>
              <div className='h-full bg-yellow-50 p-4 dark:bg-yellow-950/20'>
                <h3 className='mb-2 font-semibold'>Main Workspace</h3>
                <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                  Primary work area with the most content. This panel has
                  constraints on maximum size to maintain layout balance.
                </p>
                <div className='space-y-2'>
                  <div className='h-2 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-2 w-4/5 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-2 w-3/5 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-2 w-5/6 rounded bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-2 w-2/3 rounded bg-gray-200 dark:bg-gray-700'></div>
                </div>
              </div>
            </SplitPanel>

            <SplitPanel id='footer' title='Properties Panel' collapsible>
              <div className='h-full bg-red-50 p-4 dark:bg-red-950/20'>
                <h3 className='mb-2 font-semibold'>Properties Panel</h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Bottom panel for properties and settings. This panel can be
                  collapsed.
                </p>
                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div>Width: 100%</div>
                  <div>Height: Auto</div>
                  <div>Position: Relative</div>
                  <div>Z-Index: 1</div>
                </div>
              </div>
            </SplitPanel>
          </SplitPanels>
        </div>
      </Card>

      {/* Code Editor Layout Demo */}
      <Card title='Code Editor Layout Example' variant='default'>
        <div className='h-96'>
          <SplitPanels
            direction='horizontal'
            sizes={[20, 60, 20]}
            minSizes={[150, 300, 150]}
            resizable={resizable}
            persistSizes={persistSizes}
            storageKey='demo-editor-layout'
            onSizeChange={handleSizeChange}
            data-testid='editor-demo'
          >
            {/* File Explorer */}
            <SplitPanel id='explorer' title='File Explorer'>
              <div className='h-full border-r bg-slate-50 dark:bg-slate-900'>
                <div className='border-b bg-slate-100 p-3 dark:bg-slate-800'>
                  <h4 className='text-sm font-medium'>Explorer</h4>
                </div>
                <div className='space-y-1 p-2'>
                  {[
                    '📁 src/',
                    '  📄 components/',
                    '    📄 SplitPanels.tsx',
                    '    📄 SplitPanel.tsx',
                    '  📄 demo/',
                    '    📄 SplitPanelsDemo.tsx',
                    '📁 test/',
                    '  📄 SplitPanels.test.tsx',
                    '📄 package.json',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className='cursor-pointer rounded px-2 py-1 text-xs hover:bg-slate-200 dark:hover:bg-slate-700'
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </SplitPanel>

            {/* Code Editor */}
            <SplitPanel id='editor' title='Code Editor'>
              <div className='flex h-full flex-col bg-white dark:bg-slate-950'>
                <div className='flex-1 p-4 font-mono text-sm'>
                  <div className='space-y-1'>
                    <div className='text-gray-500'>
                      1 // SplitPanels Component Demo
                    </div>
                    <div className='text-gray-500'>
                      2 import React from 'react';
                    </div>
                    <div className='text-gray-500'>
                      3 import &#123; SplitPanels, SplitPanel &#125; from
                      './SplitPanels';
                    </div>
                    <div className='text-gray-500'>4 </div>
                    <div className='text-gray-500'>
                      5 export function Demo() &#123;
                    </div>
                    <div className='text-gray-500'>6 return (</div>
                    <div className='text-gray-500'>
                      7 &lt;SplitPanels direction="horizontal"&gt;
                    </div>
                    <div className='text-gray-500'>
                      8 &lt;SplitPanel&gt;Panel 1&lt;/SplitPanel&gt;
                    </div>
                    <div className='text-gray-500'>
                      9 &lt;SplitPanel&gt;Panel 2&lt;/SplitPanel&gt;
                    </div>
                    <div className='text-gray-500'>10 &lt;/SplitPanels&gt;</div>
                    <div className='text-gray-500'>11 );</div>
                    <div className='text-gray-500'>12 &#125;</div>
                  </div>
                </div>
                <div className='flex h-8 items-center border-t bg-slate-100 px-3 text-xs text-gray-600 dark:bg-slate-800 dark:text-gray-400'>
                  Line 8, Column 35 • TypeScript React • UTF-8 • CRLF
                </div>
              </div>
            </SplitPanel>

            {/* Properties Panel */}
            <SplitPanel id='properties' title='Properties'>
              <div className='h-full border-l bg-slate-50 dark:bg-slate-900'>
                <div className='border-b bg-slate-100 p-3 dark:bg-slate-800'>
                  <h4 className='text-sm font-medium'>Properties</h4>
                </div>
                <div className='space-y-3 p-3'>
                  <div>
                    <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Component
                    </label>
                    <div className='font-mono text-sm'>SplitPanels</div>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Direction
                    </label>
                    <div className='text-sm'>horizontal</div>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Resizable
                    </label>
                    <div className='text-sm'>true</div>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Min Sizes
                    </label>
                    <div className='font-mono text-sm'>[150, 300, 150]</div>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                      Touch Enabled
                    </label>
                    <div className='text-sm'>
                      {touchEnabled ? 'true' : 'false'}
                    </div>
                  </div>
                </div>
              </div>
            </SplitPanel>
          </SplitPanels>
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card title='Usage Instructions' variant='outlined'>
        <div className='space-y-4 text-sm'>
          <div>
            <h4 className='mb-2 font-medium'>🖱️ Mouse Interactions</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              Click and drag the resize handles between panels to adjust sizes.
              Handles are visually indicated and respond to hover states.
            </p>
          </div>

          <div>
            <h4 className='mb-2 font-medium'>⌨️ Keyboard Navigation</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              Focus resize handles with Tab key, then use Arrow keys to resize
              panels. Hold Shift for larger increments (20px vs 5px).
            </p>
          </div>

          <div>
            <h4 className='mb-2 font-medium'>📱 Touch Support</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              On touch devices, drag resize handles to adjust panel sizes. Touch
              interactions are optimized for mobile interfaces.
            </p>
          </div>

          <div>
            <h4 className='mb-2 font-medium'>💾 Persistence</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              Enable persistence to save panel sizes to localStorage. Sizes are
              automatically restored on page reload.
            </p>
          </div>

          <div>
            <h4 className='mb-2 font-medium'>⚡ Performance</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              ResizeObserver monitors layout changes efficiently. Choose resize
              modes based on your performance requirements.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
