/**
 * Enhanced Accordion Demo - MAPS v2.2 Showcase
 *
 * Demonstrates the Enhanced Accordion component with all variants,
 * accessibility modes, and liquid glass materials following
 * MAPS v2.2 dark-first philosophy
 */

import {
  EnhancedAccordionRoot,
  EnhancedAccordionItem,
  EnhancedAccordionTrigger,
  EnhancedAccordionContent,
} from '../ui-enhanced/Accordion';

/**
 * Sample FAQ data for demonstration
 */
const faqData = [
  {
    id: 'item-1',
    question: 'What is MAPS v2.2?',
    answer:
      'MAPS v2.2 (Modern Apple Platform System) is a comprehensive design system that follows Apple HIG principles with dark-first philosophy, featuring liquid glass materials and ethereal accent systems.',
  },
  {
    id: 'item-2',
    question: 'How does liquid glass work?',
    answer:
      'Liquid glass materials provide governed vibrancy with systematic ΔL ≈ 0.045 spacing in OKLab color space, creating depth while maintaining accessibility standards.',
  },
  {
    id: 'item-3',
    question: 'What about accessibility?',
    answer:
      'All Enhanced components include AAA compliance modes with high contrast ratios, enhanced focus indicators, and comprehensive ARIA labeling for screen readers.',
  },
];

/**
 * Enhanced Accordion Demo Component
 */
export function AccordionDemo() {
  return (
    <div className='bg-deep-space min-h-screen space-y-8 p-8'>
      {/* Header */}
      <div className='mb-12 space-y-4 text-center'>
        <h1 className='text-text-primary text-4xl font-medium'>
          Enhanced Accordion
        </h1>
        <p className='text-text-secondary mx-auto max-w-2xl text-lg'>
          Showcase of MAPS v2.2 Enhanced Accordion with liquid glass materials,
          dark-first philosophy, and comprehensive accessibility
        </p>
      </div>

      {/* Default Variant */}
      <section className='space-y-4'>
        <h2 className='text-text-primary text-2xl font-medium'>
          Default Variant
        </h2>
        <EnhancedAccordionRoot
          type='single'
          collapsible
          className='mx-auto w-full max-w-2xl'
        >
          {faqData.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      </section>

      {/* Glass Variant */}
      <section className='space-y-4'>
        <h2 className='text-text-primary text-2xl font-medium'>
          Glass Variant
        </h2>
        <EnhancedAccordionRoot
          type='single'
          collapsible
          variant='glass'
          className='mx-auto w-full max-w-2xl'
        >
          {faqData.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      </section>

      {/* Ghost Variant */}
      <section className='space-y-4'>
        <h2 className='text-text-primary text-2xl font-medium'>
          Ghost Variant
        </h2>
        <EnhancedAccordionRoot
          type='single'
          collapsible
          variant='ghost'
          className='mx-auto w-full max-w-2xl'
        >
          {faqData.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      </section>

      {/* Floating Variant */}
      <section className='space-y-4'>
        <h2 className='text-text-primary text-2xl font-medium'>
          Floating Variant
        </h2>
        <EnhancedAccordionRoot
          type='single'
          collapsible
          variant='floating'
          className='mx-auto w-full max-w-2xl'
        >
          {faqData.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      </section>

      {/* AAA Compliance Mode */}
      <section className='space-y-4'>
        <h2 className='text-text-primary text-2xl font-medium'>
          AAA Compliance Mode
        </h2>
        <EnhancedAccordionRoot
          type='single'
          collapsible
          aaaMode={true}
          className='mx-auto w-full max-w-2xl'
        >
          {faqData.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      </section>

      {/* Multiple Type */}
      <section className='space-y-4'>
        <h2 className='text-text-primary text-2xl font-medium'>
          Multiple Selection
        </h2>
        <EnhancedAccordionRoot
          type='multiple'
          className='mx-auto w-full max-w-2xl'
        >
          {faqData.map(item => (
            <EnhancedAccordionItem key={item.id} value={item.id}>
              <EnhancedAccordionTrigger>
                {item.question}
              </EnhancedAccordionTrigger>
              <EnhancedAccordionContent>{item.answer}</EnhancedAccordionContent>
            </EnhancedAccordionItem>
          ))}
        </EnhancedAccordionRoot>
      </section>

      {/* Usage Information */}
      <section className='bg-surface-glass border-border-glass mt-16 rounded-xl border p-6'>
        <h3 className='text-text-primary mb-4 text-xl font-medium'>
          Component Features
        </h3>
        <ul className='text-text-secondary space-y-2'>
          <li>• MAPS v2.2 dark-first design philosophy</li>
          <li>• Liquid glass materials with governed vibrancy</li>
          <li>• Apple HIG-inspired spacing and typography</li>
          <li>• AAA accessibility compliance modes</li>
          <li>• Multiple density options (default, compact)</li>
          <li>
            • Six visual variants (default, ghost, glass, floating, outlined,
            filled)
          </li>
          <li>• Factory patterns for common configurations</li>
          <li>• Full TypeScript support with strict mode</li>
          <li>• Comprehensive keyboard navigation</li>
          <li>• Screen reader optimized</li>
        </ul>
      </section>
    </div>
  );
}

export default AccordionDemo;
