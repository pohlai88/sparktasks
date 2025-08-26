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

import React from 'react';
import {
  EnhancedTooltipProvider,
  EnhancedTooltipRoot,
  EnhancedTooltipTrigger,
  EnhancedTooltipContent,
  EnhancedTooltipWithTrigger,
  TooltipFactory,
} from '@/components/ui-enhanced/Tooltip';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedSeparator } from '@/components/ui-enhanced/Separator';

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

          {/* Size Showcase */}
          <section className='space-y-8'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              Size Options
            </h2>

            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton size='sm'>Small</EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent size='sm' variant='glass'>
                    <p>Compact tooltip</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>200px max</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton>Default</EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='glass'>
                    <p>Standard tooltip with balanced content space</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>320px max</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton size='lg'>Large</EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent size='lg' variant='glass'>
                    <p>
                      Extended tooltip for richer content with more detailed
                      explanations
                    </p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>384px max</span>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton size='lg'>Extra Large</EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent size='xl' variant='glass'>
                    <p>
                      Maximum tooltip size for complex content with
                      comprehensive information, examples, and detailed guidance
                    </p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-xs text-[#5b6776]'>448px max</span>
              </div>
            </div>
          </section>

          <EnhancedSeparator />

          {/* AAA Compliance Demo */}
          <section className='space-y-8'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              AAA Compliance Mode
            </h2>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              <div className='flex flex-col items-center space-y-4'>
                <h3 className='text-lg font-medium text-[#8094a6]'>
                  Regular Mode
                </h3>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline'>
                      Glass Tooltip
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='glass'>
                    <p>Glass materials with backdrop blur</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-center text-xs text-[#5b6776]'>
                  Aesthetic glass effects with good contrast
                </span>
              </div>

              <div className='flex flex-col items-center space-y-4'>
                <h3 className='text-lg font-medium text-[#8094a6]'>
                  AAA Enforced
                </h3>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='outline'>
                      AAA Tooltip
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='glass' aaaMode={true}>
                    <p>Maximum contrast, glass overridden</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-center text-xs text-[#5b6776]'>
                  7:1 contrast ratio guaranteed
                </span>
              </div>

              <div className='flex flex-col items-center space-y-4'>
                <h3 className='text-lg font-medium text-[#8094a6]'>
                  AAA Semantic
                </h3>
                <EnhancedTooltipRoot>
                  <EnhancedTooltipTrigger asChild>
                    <EnhancedButton variant='success'>
                      AAA Success
                    </EnhancedButton>
                  </EnhancedTooltipTrigger>
                  <EnhancedTooltipContent variant='success' aaaMode={true}>
                    <p>Solid semantic colors for accessibility</p>
                  </EnhancedTooltipContent>
                </EnhancedTooltipRoot>
                <span className='text-center text-xs text-[#5b6776]'>
                  Semantic meaning preserved
                </span>
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

          <EnhancedSeparator />

          {/* Compound Component Demo */}
          <section className='space-y-8'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              Compound Components
            </h2>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
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

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-[#8094a6]'>
                  Complex Triggers
                </h3>
                <div className='flex flex-wrap gap-4'>
                  <EnhancedTooltipWithTrigger
                    trigger={
                      <div className='cursor-pointer rounded-lg border border-[#5b6776]/40 bg-[#17162a] p-3'>
                        <div className='flex items-center space-x-3'>
                          <div className='h-3 w-3 rounded-full bg-[#30b0c7]'></div>
                          <span className='text-sm'>Custom Element</span>
                        </div>
                      </div>
                    }
                    triggerAsChild
                    variant='floating'
                    size='lg'
                  >
                    <div className='space-y-2'>
                      <p className='font-medium'>Complex Custom Element</p>
                      <p className='text-sm opacity-90'>
                        This demonstrates wrapping complex trigger content with
                        sophisticated tooltip positioning.
                      </p>
                    </div>
                  </EnhancedTooltipWithTrigger>
                </div>
              </div>
            </div>
          </section>

          <EnhancedSeparator />

          {/* Usage Guidelines */}
          <section className='space-y-6'>
            <h2 className='mb-6 text-2xl font-semibold text-[#7cc4ff]'>
              Usage Guidelines
            </h2>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-[#8094a6]'>
                  Best Practices
                </h3>
                <ul className='space-y-2 text-sm text-[#5b6776]'>
                  <li>• Use default variant for general purpose tooltips</li>
                  <li>
                    • Glass variants for sophisticated, layered interfaces
                  </li>
                  <li>• Semantic variants for status communication</li>
                  <li>• AAA mode for maximum accessibility compliance</li>
                  <li>• Compact density for information-dense layouts</li>
                </ul>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-[#8094a6]'>
                  Content Guidelines
                </h3>
                <ul className='space-y-2 text-sm text-[#5b6776]'>
                  <li>• Keep content concise and actionable</li>
                  <li>• Use small size for brief labels or hints</li>
                  <li>• Large/XL sizes for instructional content</li>
                  <li>• Factory patterns for consistent team usage</li>
                  <li>• Compound components for complex interfaces</li>
                </ul>
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
