/**
 * @fileoverview Prose Component Demo
 * @author SparkTasks
 * @version 1.0.0
 */

import React from 'react';
import { Prose } from '@/components/ui/Prose';

/**
 * Demo showcasing the Prose component capabilities
 */
export function ProseDemo() {
  const [selectedVariant, setSelectedVariant] = React.useState<'default' | 'article' | 'documentation' | 'legal' | 'compact' | 'large'>('default');
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [selectedReadingMode, setSelectedReadingMode] = React.useState<'default' | 'comfortable' | 'dense'>('default');
  const [selectedMaxWidth, setSelectedMaxWidth] = React.useState<'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

  const handleLinkClick = (href: string) => {
    // Custom link handler - in a real app, you might handle routing here
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const sampleContent = `
    <h1>The Future of Web Typography</h1>
    
    <p>Typography is the foundation of great web design. It's the voice that speaks to your users before they even read the words. In the modern web, we have unprecedented control over how text appears and feels.</p>
    
    <h2>What Makes Good Typography?</h2>
    
    <p>Great typography combines several key elements:</p>
    
    <ul>
      <li><strong>Readability</strong> - Text should be easy to read at any size</li>
      <li><strong>Hierarchy</strong> - Clear structure guides the reader's eye</li>
      <li><strong>Consistency</strong> - Uniform styling creates familiarity</li>
      <li><strong>Accessibility</strong> - Everyone should be able to read your content</li>
    </ul>
    
    <h3>Code Examples</h3>
    
    <p>Here's how you might implement responsive typography:</p>
    
    <pre><code>const typography = {
  heading: {
    fontSize: 'clamp(1.5rem, 4vw, 3rem)',
    lineHeight: 1.2,
    fontWeight: 600
  },
  body: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    lineHeight: 1.6,
    fontWeight: 400
  }
};</code></pre>
    
    <h3>Best Practices</h3>
    
    <blockquote>
      "Typography is what language looks like." - Ellen Lupton
    </blockquote>
    
    <p>When working with typography, remember these principles:</p>
    
    <ol>
      <li>Choose fonts that match your brand personality</li>
      <li>Maintain consistent vertical rhythm</li>
      <li>Use appropriate contrast ratios (WCAG 2.1 AA: 4.5:1 minimum)</li>
      <li>Test on multiple devices and screen sizes</li>
    </ol>
    
    <h4>Advanced Techniques</h4>
    
    <p>Modern CSS gives us powerful tools like <code>clamp()</code>, <code>ch</code> units, and variable fonts. These technologies enable truly responsive and accessible typography.</p>
    
    <table>
      <thead>
        <tr>
          <th>Technique</th>
          <th>Use Case</th>
          <th>Browser Support</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>clamp()</code></td>
          <td>Responsive font sizes</td>
          <td>Modern browsers</td>
        </tr>
        <tr>
          <td><code>ch</code> units</td>
          <td>Optimal line length</td>
          <td>All browsers</td>
        </tr>
        <tr>
          <td>Variable fonts</td>
          <td>Dynamic weight/width</td>
          <td>Modern browsers</td>
        </tr>
      </tbody>
    </table>
    
    <hr>
    
    <p><em>This article demonstrates how the Prose component handles various HTML elements with consistent, accessible styling.</em></p>
  `;

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Prose Component Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Showcase of markdown and rich text rendering capabilities
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Prose Configuration
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Variant Control */}
            <div>
              <label htmlFor="variant-select" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Variant
              </label>
              <select
                id="variant-select"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as typeof selectedVariant)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="default">Default</option>
                <option value="article">Article</option>
                <option value="documentation">Documentation</option>
                <option value="legal">Legal</option>
                <option value="compact">Compact</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Size Control */}
            <div>
              <label htmlFor="size-select" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Size
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as typeof selectedSize)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            {/* Reading Mode Control */}
            <div>
              <label htmlFor="reading-mode-select" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reading Mode
              </label>
              <select
                id="reading-mode-select"
                value={selectedReadingMode}
                onChange={(e) => setSelectedReadingMode(e.target.value as typeof selectedReadingMode)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="default">Default</option>
                <option value="comfortable">Comfortable</option>
                <option value="dense">Dense</option>
              </select>
            </div>

            {/* Max Width Control */}
            <div>
              <label htmlFor="maxwidth-select" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Width
              </label>
              <select
                id="maxwidth-select"
                value={selectedMaxWidth}
                onChange={(e) => setSelectedMaxWidth(e.target.value as typeof selectedMaxWidth)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="full">Full</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prose Component Showcase */}
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <Prose
            variant={selectedVariant}
            size={selectedSize}
            readingMode={selectedReadingMode}
            maxWidth={selectedMaxWidth}
            onLinkClick={handleLinkClick}
          >
            <div dangerouslySetInnerHTML={{ __html: sampleContent }} />
          </Prose>
        </div>

        {/* Usage Examples */}
        <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Usage Examples
          </h2>
          
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Basic Usage
              </h4>
              <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 dark:bg-gray-700">
                <code className="text-sm text-gray-800 dark:text-gray-200">
{`<Prose>
  <h1>Article Title</h1>
  <p>Article content...</p>
</Prose>`}
                </code>
              </pre>
            </div>

            <div>
              <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Advanced Configuration
              </h4>
              <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 dark:bg-gray-700">
                <code className="text-sm text-gray-800 dark:text-gray-200">
{`<Prose 
  variant="article"
  size="lg"
  readingMode="comfortable"
  maxWidth="lg"
  onLinkClick={handleCustomLinks}
>
  {content}
</Prose>`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProseDemo;
