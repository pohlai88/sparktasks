/**
 * Enhanced Collapsible Demo - MAPS v2.2 Showcase
 *
 * Demonstrates the Enhanced Collapsible component with all variants,
 * accessibility modes, and liquid glass materials following
 * MAPS v2.2 dark-first philosophy
 */

import {
  EnhancedCollapsibleRoot,
  EnhancedCollapsibleTrigger,
  EnhancedCollapsibleContent,
  EnhancedCollapsibleComplete,
  CollapsibleFactory,
} from '../ui-enhanced/Collapsible';

export default function CollapsibleDemo() {
  const demoContent = [
    {
      id: 'getting-started',
      title: 'Getting Started with MAPS v2.2',
      content:
        'MAPS v2.2 represents our commitment to dark-first design philosophy with Apple HIG harmony. This design system prioritizes user comfort, accessibility excellence, and sophisticated visual hierarchy while maintaining liquid glass materials for modern interface aesthetics.',
    },
    {
      id: 'design-principles',
      title: 'Core Design Principles',
      content:
        'Our design principles center around deep space canvas foundations, ethereal accent systems, and AAA compliance standards. Every component follows systematic spacing, Apple-calm interaction patterns, and governed vibrancy to ensure consistency across all touchpoints.',
    },
    {
      id: 'accessibility',
      title: 'Accessibility & Compliance',
      content:
        'WCAG AAA compliance is built into every component with dual-track approaches for enhanced accessibility. We provide high contrast modes, systematic focus management, and screen reader optimization to ensure inclusive experiences for all users.',
    },
  ];

  return (
    <div className='min-h-screen space-y-12 bg-background p-8'>
      {/* Header */}
      <div className='space-y-4 text-center'>
        <h1 className='text-content-primary text-4xl font-bold'>
          Enhanced Collapsible Demo
        </h1>
        <p className='text-content-secondary mx-auto max-w-2xl text-lg'>
          Showcasing MAPS v2.2 collapsible components with dark-first
          philosophy, liquid glass materials, and AAA compliance modes.
        </p>
      </div>

      {/* Default Variant */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Default Variant
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id}>
              <EnhancedCollapsibleTrigger>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* Glass Variant */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Glass Variant
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id} variant='glass'>
              <EnhancedCollapsibleTrigger variant='glass'>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent variant='glass'>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* Ghost Variant */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Ghost Variant
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id} variant='ghost'>
              <EnhancedCollapsibleTrigger variant='ghost'>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent variant='ghost'>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* Floating Variant */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Floating Variant
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-4'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id} variant='floating'>
              <EnhancedCollapsibleTrigger variant='floating'>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent variant='floating'>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* Outlined Variant */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Outlined Variant
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id} variant='outlined'>
              <EnhancedCollapsibleTrigger variant='outlined'>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent variant='outlined'>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* Filled Variant */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Filled Variant
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id} variant='filled'>
              <EnhancedCollapsibleTrigger variant='filled'>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent variant='filled'>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* AAA Compliance Mode */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          AAA Compliance Mode
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleRoot key={item.id} aaaMode={true}>
              <EnhancedCollapsibleTrigger aaaMode={true}>
                {item.title}
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent aaaMode={true}>
                {item.content}
              </EnhancedCollapsibleContent>
            </EnhancedCollapsibleRoot>
          ))}
        </div>
      </section>

      {/* Compact Density */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Compact Density
        </h2>
        <div className='mx-auto w-full max-w-2xl'>
          <EnhancedCollapsibleRoot density='compact'>
            {demoContent.map(item => (
              <div key={item.id}>
                <EnhancedCollapsibleTrigger>
                  {item.title}
                </EnhancedCollapsibleTrigger>
                <EnhancedCollapsibleContent>
                  {item.content}
                </EnhancedCollapsibleContent>
              </div>
            ))}
          </EnhancedCollapsibleRoot>
        </div>
      </section>

      {/* Complete Component Pattern */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Complete Component Pattern
        </h2>
        <div className='mx-auto w-full max-w-2xl space-y-2'>
          {demoContent.map(item => (
            <EnhancedCollapsibleComplete
              key={item.id}
              trigger={item.title}
              content={item.content}
              variant='glass'
            />
          ))}
        </div>
      </section>

      {/* Factory Patterns */}
      <section className='space-y-4'>
        <h2 className='text-content-primary text-2xl font-medium'>
          Factory Patterns
        </h2>

        {/* Glass Factory */}
        <div className='space-y-2'>
          <h3 className='text-content-secondary text-lg font-medium'>
            Glass Factory
          </h3>
          <div className='mx-auto w-full max-w-2xl'>
            <CollapsibleFactory.glass>
              <EnhancedCollapsibleTrigger variant='glass'>
                Glass Factory Pattern
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent variant='glass'>
                This collapsible was created using the glass factory pattern for
                consistent styling.
              </EnhancedCollapsibleContent>
            </CollapsibleFactory.glass>
          </div>
        </div>

        {/* AAA Factory */}
        <div className='space-y-2'>
          <h3 className='text-content-secondary text-lg font-medium'>
            AAA Compliance Factory
          </h3>
          <div className='mx-auto w-full max-w-2xl'>
            <CollapsibleFactory.aaa>
              <EnhancedCollapsibleTrigger aaaMode={true}>
                AAA Compliance Factory
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent aaaMode={true}>
                This collapsible was created using the AAA factory for enhanced
                accessibility.
              </EnhancedCollapsibleContent>
            </CollapsibleFactory.aaa>
          </div>
        </div>

        {/* Compact Factory */}
        <div className='space-y-2'>
          <h3 className='text-content-secondary text-lg font-medium'>
            Compact Factory
          </h3>
          <div className='mx-auto w-full max-w-2xl'>
            <CollapsibleFactory.compact>
              <EnhancedCollapsibleTrigger>
                Compact Factory Pattern
              </EnhancedCollapsibleTrigger>
              <EnhancedCollapsibleContent>
                This collapsible uses compact spacing for denser layouts.
              </EnhancedCollapsibleContent>
            </CollapsibleFactory.compact>
          </div>
        </div>
      </section>

      {/* Usage Information */}
      <section className='mt-16 rounded-xl border border-border-subtle bg-background-elevated p-6'>
        <h2 className='text-content-primary mb-4 text-xl font-semibold'>
          Usage Guidelines
        </h2>
        <div className='text-content-secondary space-y-3'>
          <p>
            <strong>Default:</strong> Use for general collapsible content with
            standard styling.
          </p>
          <p>
            <strong>Glass:</strong> Perfect for overlays and modern interfaces
            requiring vibrancy.
          </p>
          <p>
            <strong>Ghost:</strong> Ideal for minimal designs and secondary
            content areas.
          </p>
          <p>
            <strong>Floating:</strong> Best for card-like layouts and elevated
            content.
          </p>
          <p>
            <strong>Outlined:</strong> Great for forms and when clear boundaries
            are needed.
          </p>
          <p>
            <strong>Filled:</strong> Use for emphasis and when strong visual
            separation is required.
          </p>
          <p>
            <strong>AAA Mode:</strong> Enable for enhanced accessibility and
            high contrast requirements.
          </p>
        </div>
      </section>
    </div>
  );
}
