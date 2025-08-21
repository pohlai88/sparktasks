/**
 * @fileoverview HoverCard Demo Component
 *
 * @description Interactive demonstration of the HoverCard component showcasing all
 * its features, variants, sizes, and enterprise capabilities.
 *
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import React, { useState } from 'react';
import { HoverCard } from '@/components/ui/HoverCard';

/**
 * Sample user profile content for demonstrations
 */
const UserProfileContent = () => (
  <div className='space-y-3'>
    <div className='flex items-center space-x-3'>
      <div className='flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white'>
        JD
      </div>
      <div>
        <h3 className='font-semibold text-gray-900'>John Doe</h3>
        <p className='text-sm text-gray-600'>Senior Developer</p>
      </div>
    </div>
    <div className='text-sm text-gray-600'>
      <p>📧 john.doe@company.com</p>
      <p>🌟 Status: Available</p>
      <p>📍 San Francisco, CA</p>
    </div>
    <div className='flex gap-2 pt-2'>
      <button className='rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'>
        Message
      </button>
      <button className='rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50'>
        View Profile
      </button>
    </div>
  </div>
);

/**
 * Rich media content demonstration
 */
const MediaContent = () => (
  <div className='space-y-3'>
    <div className='flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-semibold text-white'>
      Preview Image
    </div>
    <div>
      <h3 className='font-semibold text-gray-900'>Amazing Sunset Photo</h3>
      <p className='text-sm text-gray-600'>Captured at Big Sur, California</p>
      <div className='mt-2 flex items-center space-x-4 text-xs text-gray-500'>
        <span>📷 Canon EOS R5</span>
        <span>🕐 2 hours ago</span>
        <span>❤️ 24 likes</span>
      </div>
    </div>
  </div>
);

/**
 * Main demo component showcasing HoverCard capabilities
 */
export default function HoverCardDemo() {
  const [isControlledOpen, setIsControlledOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-12'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>
            HoverCard Component Demo
          </h1>
          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            Enterprise-grade hover-triggered popovers with sophisticated
            positioning, animations, and accessibility features.
          </p>
        </div>

        {/* Basic Examples */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Basic Examples
          </h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {/* Simple Text */}
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 font-semibold'>Simple Text Content</h3>
              <div className='space-y-4'>
                <HoverCard content='This is a simple hover card with plain text content.'>
                  <button className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                    Hover for info
                  </button>
                </HoverCard>
              </div>
            </div>

            {/* User Profile */}
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 font-semibold'>User Profile Card</h3>
              <div className='space-y-4'>
                <HoverCard
                  content={<UserProfileContent />}
                  size='lg'
                  variant='elevation'
                >
                  <div className='flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-100'>
                    <div className='flex size-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white'>
                      JD
                    </div>
                    <span className='text-gray-700'>John Doe</span>
                  </div>
                </HoverCard>
              </div>
            </div>

            {/* Rich Media */}
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 font-semibold'>Rich Media Content</h3>
              <div className='space-y-4'>
                <HoverCard
                  content={<MediaContent />}
                  size='xl'
                  variant='rich'
                  position='bottom'
                >
                  <div className='size-16 cursor-pointer rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 transition-transform hover:scale-105'></div>
                </HoverCard>
              </div>
            </div>
          </div>
        </section>

        {/* Position Variants */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Position Variants
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='mx-auto grid max-w-2xl grid-cols-3 gap-8'>
              {/* Top positions */}
              <HoverCard content='Top Start' position='top-start'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Top Start
                </button>
              </HoverCard>

              <HoverCard content='Top Center' position='top'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Top
                </button>
              </HoverCard>

              <HoverCard content='Top End' position='top-end'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Top End
                </button>
              </HoverCard>

              {/* Middle positions */}
              <HoverCard content='Left' position='left'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Left
                </button>
              </HoverCard>

              <div className='flex items-center justify-center text-sm text-gray-500'>
                Trigger
              </div>

              <HoverCard content='Right' position='right'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Right
                </button>
              </HoverCard>

              {/* Bottom positions */}
              <HoverCard content='Bottom Start' position='bottom-start'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Bottom Start
                </button>
              </HoverCard>

              <HoverCard content='Bottom Center' position='bottom'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Bottom
                </button>
              </HoverCard>

              <HoverCard content='Bottom End' position='bottom-end'>
                <button className='w-full rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200'>
                  Bottom End
                </button>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* Size Variants */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Size Variants
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='flex flex-wrap justify-center gap-6'>
              <HoverCard
                content='Small size hover card - perfect for quick info'
                size='sm'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Small (sm)
                </button>
              </HoverCard>

              <HoverCard
                content='Medium size hover card - good for standard content like user profiles and basic information'
                size='md'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Medium (md)
                </button>
              </HoverCard>

              <HoverCard content={<UserProfileContent />} size='lg'>
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Large (lg)
                </button>
              </HoverCard>

              <HoverCard content={<MediaContent />} size='xl'>
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Extra Large (xl)
                </button>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* Visual Variants */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Visual Variants
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='flex flex-wrap justify-center gap-6'>
              <HoverCard
                content='Default variant with standard styling'
                variant='default'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Default
                </button>
              </HoverCard>

              <HoverCard
                content='Elevation variant with enhanced shadow'
                variant='elevation'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Elevation
                </button>
              </HoverCard>

              <HoverCard
                content='Minimal variant with reduced visual weight'
                variant='minimal'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Minimal
                </button>
              </HoverCard>

              <HoverCard content={<MediaContent />} variant='rich'>
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Rich
                </button>
              </HoverCard>

              <HoverCard
                content='Interactive variant with hover effects'
                variant='interactive'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Interactive
                </button>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* Animation Variants */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Animation Types
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='flex flex-wrap justify-center gap-6'>
              <HoverCard
                content='Scale animation - zooms in/out'
                animation='scale'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Scale
                </button>
              </HoverCard>

              <HoverCard
                content='Fade animation - fades in/out'
                animation='fade'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Fade
                </button>
              </HoverCard>

              <HoverCard
                content='Slide animation - slides from position'
                animation='slide'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Slide
                </button>
              </HoverCard>

              <HoverCard
                content='No animation - instant appearance'
                animation='none'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  None
                </button>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* Trigger Modes */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Trigger Modes
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='flex flex-wrap justify-center gap-6'>
              <HoverCard content='Triggers only on hover' trigger='hover'>
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Hover Only
                </button>
              </HoverCard>

              <HoverCard content='Triggers only on focus' trigger='focus'>
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Focus Only
                </button>
              </HoverCard>

              <HoverCard
                content='Triggers on both hover and focus'
                trigger='both'
              >
                <button className='rounded bg-gray-100 px-4 py-2 hover:bg-gray-200'>
                  Both
                </button>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* Controlled Mode */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Controlled Mode
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='space-y-4 text-center'>
              <HoverCard
                content='This hover card is controlled externally'
                open={isControlledOpen}
                onOpenChange={setIsControlledOpen}
              >
                <button className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                  Controlled Target
                </button>
              </HoverCard>

              <div className='space-x-4'>
                <button
                  onClick={() => setIsControlledOpen(true)}
                  className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700'
                >
                  Show
                </button>
                <button
                  onClick={() => setIsControlledOpen(false)}
                  className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
                >
                  Hide
                </button>
                <button
                  onClick={() => setIsControlledOpen(!isControlledOpen)}
                  className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
                >
                  Toggle
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Compound Components */}
        <section className='mb-16'>
          <h2 className='mb-8 text-2xl font-semibold text-gray-900'>
            Compound Components
          </h2>
          <div className='rounded-lg border bg-white p-8 shadow-sm'>
            <div className='text-center'>
              <HoverCard
                content={
                  <div>
                    <HoverCard.Header>
                      <h3 className='font-semibold text-gray-900'>
                        Structured Content
                      </h3>
                    </HoverCard.Header>
                    <HoverCard.Content>
                      <p className='text-gray-600'>
                        This hover card uses compound components for better
                        organization of header, content, and footer sections.
                      </p>
                    </HoverCard.Content>
                    <HoverCard.Footer>
                      <div className='flex justify-end space-x-2'>
                        <button className='rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50'>
                          Cancel
                        </button>
                        <button className='rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'>
                          Confirm
                        </button>
                      </div>
                    </HoverCard.Footer>
                  </div>
                }
                size='lg'
              >
                <button className='rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'>
                  Compound Example
                </button>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* Features Summary */}
        <section className='mb-16'>
          <div className='rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-8'>
            <h2 className='mb-6 text-center text-2xl font-semibold text-gray-900'>
              🚀 Enterprise Features
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div className='text-center'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  🎯 Positioning
                </h3>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>• 12 position variants</li>
                  <li>• Collision detection</li>
                  <li>• Custom offset control</li>
                  <li>• Auto-positioning</li>
                </ul>
              </div>
              <div className='text-center'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  ✨ Visual System
                </h3>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>• 5 visual variants</li>
                  <li>• 4 size options</li>
                  <li>• 4 animation types</li>
                  <li>• Arrow indicators</li>
                </ul>
              </div>
              <div className='text-center'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  ♿ Accessibility
                </h3>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>• WCAG 2.1 AA compliance</li>
                  <li>• Keyboard navigation</li>
                  <li>• Screen reader support</li>
                  <li>• Focus management</li>
                </ul>
              </div>
              <div className='text-center'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  ⚡ Performance
                </h3>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>• Portal rendering</li>
                  <li>• Lazy loading</li>
                  <li>• Optimized animations</li>
                  <li>• Memory efficient</li>
                </ul>
              </div>
              <div className='text-center'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  🎮 Interaction
                </h3>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>• Hover & focus triggers</li>
                  <li>• Configurable delays</li>
                  <li>• Touch support</li>
                  <li>• Controlled mode</li>
                </ul>
              </div>
              <div className='text-center'>
                <h3 className='mb-3 font-semibold text-gray-800'>
                  🏗️ Architecture
                </h3>
                <ul className='space-y-2 text-sm text-gray-600'>
                  <li>• Compound components</li>
                  <li>• TypeScript strict</li>
                  <li>• DESIGN_TOKENS V3.2</li>
                  <li>• Tree-shakeable</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='text-center text-sm text-gray-500'>
          <p>HoverCard Component Demo - Built with DESIGN_TOKENS V3.2</p>
          <p>Enterprise-grade component library for Fortune 500 applications</p>
        </footer>
      </div>
    </div>
  );
}

export { HoverCardDemo };
