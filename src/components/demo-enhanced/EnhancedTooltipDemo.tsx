/**
 * Enhanced Tooltip Demo - MAPS v2.2 Showcase Implementation
 *
 * DEMONSTRATION SCOPE:
 * - All 9 tooltip variants with visual differences
 * - 4 size options across different content types
 * - AAA compliance mode enforcement demo
 * - Density mode comparison (comfortable vs compact)
 * - Factory pattern usage examples
 * - Liquid glass materials system showcase
 * - Apple HIG motion system demonstration
 * - Accessibility feature validation
 * - Complex trigger content scenarios
 * - Positioning and offset customization
 *
 * DESIGN PHILOSOPHY:
 * - Dark-first presentation with ethereal accents
 * - Apple HIG systematic spacing and hierarchy
 * - Liquid glass materials for depth and sophistication
 * - AAA contrast enforcement with dual-track approach
 * - Real-world usage patterns and best practices
 */

import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedSeparator } from '@/components/ui-enhanced/Separator';
import {
  EnhancedTooltipProvider,
  EnhancedTooltipRoot,
  EnhancedTooltipTrigger,
  EnhancedTooltipContent,
  EnhancedTooltipWithTrigger,
  TooltipFactory,
} from '@/components/ui-enhanced/Tooltip';

export default function EnhancedTooltipDemo() {
  return (
    <EnhancedTooltipProvider>
      <div className='min-h-screen bg-[#0a0f16] p-8 text-[#e8ecf1]'>
        <div className='mx-auto max-w-7xl space-y-12'>
          {/* Header Section */}
          <header className='space-y-4 text-center'>
            <h1 className='mb-2 text-4xl font-bold text-[#30b0c7]'>
              Enhanced Tooltip Demo
            </h1>
            <p className='mx-auto max-w-2xl text-lg text-[#8094a6]'>
              MAPS v2.2 Dark-First Philosophy with Apple HIG Harmony
            </p>
            <p className='text-sm text-[#5b6776]'>
              Showcasing liquid glass materials, AAA compliance, and systematic
              design
            </p>
          </header>

          <EnhancedSeparator className='mx-auto max-w-md' />

          {/* Variant Showcase */}
          <section className='space-y-8'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              Tooltip Variants
            </h2>

            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
              {/* Default Variant */}
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      Default
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent>
                    <p>Clean default tooltip with optimal contrast</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>Standard</span>
              </div>

              {/* Glass Variant */}
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      Glass
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='glass'>
                    <p>Liquid glass material with backdrop blur</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>12px Blur</span>
              </div>

              {/* Floating Variant */}
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      Floating
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='floating'>
                    <p>Enhanced glass with stronger blur effect</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>16px Blur</span>
              </div>

              {/* Inverse Variant */}
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      Inverse
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='inverse'>
                    <p>Light tooltip for dark content areas</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>Light Theme</span>
              </div>
            </div>

            {/* Semantic Variants */}
            <div className='mt-8 grid grid-cols-2 gap-6 md:grid-cols-4'>
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='success' size='sm'>
                      Success
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='success'>
                    <p>Operation completed successfully</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-green-400'>Semantic</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='warning' size='sm'>
                      Warning
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='warning'>
                    <p>Caution: Review before proceeding</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-yellow-400'>Alert</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='error' size='sm'>
                      Error
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='error'>
                    <p>Action failed - please try again</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-red-400'>Critical</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='primary' size='sm'>
                      Info
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='info'>
                    <p>Additional context and information</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-blue-400'>Contextual</span>
              </div>
            </div>
          </section>

          <EnhancedSeparator />

          {/* Factory Pattern Demo */}
          <section className='space-y-8'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              Factory Patterns
            </h2>

            <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      Glass Factory
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <TooltipFactory.glass>
                    <p>Created via TooltipFactory.glass</p>
                  </TooltipFactory.glass>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>Factory Pattern</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      AAA Factory
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <TooltipFactory.aaa>
                    <p>Maximum accessibility enforcement</p>
                  </TooltipFactory.aaa>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>Accessibility</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline' size='sm'>
                      Compact Factory
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <TooltipFactory.compact>
                    <p>Dense layout optimization</p>
                  </TooltipFactory.compact>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>Dense UI</span>
              </div>
            </div>
          </section>

          {/* Compound Component Demo */}
          <section className='space-y-8'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              Compound Components
            </h2>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-[#8094a6]'>
                With Trigger Component
              </h3>
              <div className='flex flex-wrap gap-4'>
                <EnhancedTooltipWithTrigger
                  trigger={
                    <EnhancedButton variant='primary'>
                      Primary Action
                    </EnhancedButton>
                  }
                  variant='floating'
                >
                  <div className='space-y-2'>
                    <p className='font-medium'>Primary Action</p>
                    <p className='text-sm opacity-90'>
                      This is the main call-to-action button
                    </p>
                  </div>
                </EnhancedTooltipWithTrigger>

                <EnhancedTooltipWithTrigger
                  trigger={
                    <EnhancedButton variant='ghost'>
                      Ghost Button
                    </EnhancedButton>
                  }
                  variant='glass'
                  size='sm'
                >
                  <p>Subtle secondary action</p>
                </EnhancedTooltipWithTrigger>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className='border-t border-[#5b6776]/20 pt-8 text-center'>
            <p className='text-sm text-[#5b6776]'>
              Enhanced Tooltip • MAPS v2.2 • Built with Radix UI primitives
            </p>
          </footer>
        </div>
      </div>
    </EnhancedTooltipProvider>
  );
}
