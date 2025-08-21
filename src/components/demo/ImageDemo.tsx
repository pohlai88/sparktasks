/**
 * @fileoverview Image Component Demo
 *
 * Comprehensive demonstration of the Image component showcasing:
 * - All aspect ratios and size variants
 * - Visual variants and styling options
 * - Loading states and error handling
 * - Responsive image behavior
 * - Object fit positioning
 * - Accessibility features
 *
 * @version 1.0.0
 * @author Spark Tasks Team
 * @since 2024
 */

import { useState } from 'react';
import { Image } from '@/components/ui/Image';
import { DESIGN_TOKENS } from '@/design/tokens';

export default function ImageDemo() {
  const [errorSrc] = useState('https://broken-image-url.jpg');
  const [loadingSrc, setLoadingSrc] = useState('');

  // Demo images (using placeholder service)
  const demoImages = {
    square: 'https://picsum.photos/400/400?random=1',
    landscape: 'https://picsum.photos/600/400?random=2',
    portrait: 'https://picsum.photos/400/600?random=3',
    wide: 'https://picsum.photos/800/300?random=4',
  };

  const triggerLoading = () => {
    setLoadingSrc('');
    setTimeout(() => {
      setLoadingSrc('https://picsum.photos/400/300?random=5');
    }, 100);
  };

  return (
    <div className={`${DESIGN_TOKENS.spacing.section} mx-auto max-w-7xl`}>
      <div className='space-y-12'>
        {/* Header */}
        <header className='text-center'>
          <h1
            className={`${DESIGN_TOKENS.typography.heading.h1} ${DESIGN_TOKENS.semantic.text.accent}`}
          >
            Image Component Demo
          </h1>
          <p
            className={`${DESIGN_TOKENS.typography.body.large} ${DESIGN_TOKENS.semantic.text.muted} mt-4`}
          >
            Enterprise-grade responsive image component with lazy loading, error
            handling, and accessibility.
          </p>
        </header>

        {/* Basic Usage */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Basic Usage
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>Default</h3>
              <Image
                src={demoImages.square}
                alt='Default image example'
                aspectRatio='square'
                size='md'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>Rounded</h3>
              <Image
                src={demoImages.square}
                alt='Rounded image example'
                aspectRatio='square'
                variant='rounded'
                size='md'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>Circular</h3>
              <Image
                src={demoImages.square}
                alt='Circular image example'
                aspectRatio='square'
                variant='circular'
                size='md'
              />
            </div>
          </div>
        </section>

        {/* Aspect Ratios */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Aspect Ratios
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Square (1:1)
              </h3>
              <Image
                src={demoImages.square}
                alt='Square aspect ratio'
                aspectRatio='square'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Video (16:9)
              </h3>
              <Image
                src={demoImages.landscape}
                alt='Video aspect ratio'
                aspectRatio='video'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Portrait (3:4)
              </h3>
              <Image
                src={demoImages.portrait}
                alt='Portrait aspect ratio'
                aspectRatio='portrait'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Wide (21:9)
              </h3>
              <Image
                src={demoImages.wide}
                alt='Wide aspect ratio'
                aspectRatio='wide'
              />
            </div>
          </div>
        </section>

        {/* Size Variants */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Size Variants (Auto Aspect)
          </h2>
          <div className='grid grid-cols-2 items-end gap-6 md:grid-cols-5'>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
              <div key={size} className='space-y-3'>
                <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                  Size {size.toUpperCase()}
                </h3>
                <Image
                  src={demoImages.square}
                  alt={`Size ${size} example`}
                  aspectRatio='auto'
                  size={size}
                  variant='rounded'
                />
              </div>
            ))}
          </div>
        </section>

        {/* Visual Variants */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Visual Variants
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {(['default', 'rounded', 'circular', 'thumbnail'] as const).map(
              variant => (
                <div key={variant} className='space-y-3'>
                  <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </h3>
                  <Image
                    src={demoImages.square}
                    alt={`${variant} variant example`}
                    aspectRatio='square'
                    variant={variant}
                    size='md'
                  />
                </div>
              )
            )}
          </div>
        </section>

        {/* Object Fit */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Object Fit Options
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5'>
            {(['cover', 'contain', 'fill', 'scale-down', 'none'] as const).map(
              fit => (
                <div key={fit} className='space-y-3'>
                  <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                    {fit
                      .replace('-', ' ')
                      .replace(/\\b\\w/g, l => l.toUpperCase())}
                  </h3>
                  <Image
                    src={demoImages.landscape}
                    alt={`Object fit ${fit} example`}
                    aspectRatio='square'
                    fit={fit}
                    variant='rounded'
                  />
                </div>
              )
            )}
          </div>
        </section>

        {/* Loading States */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Loading States
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                With Skeleton
              </h3>
              <Image
                src={loadingSrc}
                alt='Loading with skeleton'
                aspectRatio='video'
                showSkeleton={true}
              />
              <button
                onClick={triggerLoading}
                className={DESIGN_TOKENS.recipe.button.secondary}
              >
                Trigger Loading
              </button>
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Without Skeleton
              </h3>
              <Image
                src={loadingSrc}
                alt='Loading without skeleton'
                aspectRatio='video'
                showSkeleton={false}
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Custom Placeholder
              </h3>
              <Image
                src={loadingSrc}
                alt='Custom placeholder'
                aspectRatio='video'
                placeholder={
                  <div
                    className={` ${DESIGN_TOKENS.layout.flexCenter} size-full ${DESIGN_TOKENS.semantic.background.info} ${DESIGN_TOKENS.semantic.text.info} `}
                  >
                    <div className='text-center'>
                      <div className='mx-auto mb-2 size-8 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      <span>Custom Loading...</span>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* Error States */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Error Handling
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Default Fallback
              </h3>
              <Image
                src={errorSrc}
                alt='Error with default fallback'
                aspectRatio='video'
                loading='eager'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Custom Fallback
              </h3>
              <Image
                src={errorSrc}
                alt='Error with custom fallback'
                aspectRatio='video'
                loading='eager'
                fallback={
                  <div
                    className={` ${DESIGN_TOKENS.layout.flexCenter} size-full ${DESIGN_TOKENS.semantic.background.error} ${DESIGN_TOKENS.semantic.text.error} `}
                  >
                    <div className='text-center'>
                      <svg
                        className='mx-auto mb-3 size-12'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
                        />
                      </svg>
                      <h4 className='mb-1 font-semibold'>Upload Failed</h4>
                      <p className='text-sm opacity-90'>Please try again</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </section>

        {/* Disabled State */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Disabled State
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>Normal</h3>
              <Image
                src={demoImages.square}
                alt='Normal state'
                aspectRatio='video'
                variant='rounded'
              />
            </div>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>Disabled</h3>
              <Image
                src={demoImages.square}
                alt='Disabled state'
                aspectRatio='video'
                variant='rounded'
                disabled={true}
              />
            </div>
          </div>
        </section>

        {/* Responsive Images */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Responsive Images
          </h2>
          <div className='space-y-6'>
            <div className='space-y-3'>
              <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                Responsive with srcSet (resize browser to see effect)
              </h3>
              <Image
                src='https://picsum.photos/800/600?random=6'
                srcSet='
                  https://picsum.photos/400/300?random=6 400w,
                  https://picsum.photos/800/600?random=6 800w,
                  https://picsum.photos/1200/900?random=6 1200w
                '
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                alt='Responsive image example'
                aspectRatio='landscape'
                variant='rounded'
                className='w-full'
              />
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Accessibility
          </h2>
          <div className='space-y-6'>
            <div
              className={`${DESIGN_TOKENS.semantic.background.info} rounded-lg p-6`}
            >
              <h3 className='mb-2 font-semibold'>Accessibility Features:</h3>
              <ul className='space-y-1 text-sm'>
                <li>• Always requires alt text for screen readers</li>
                <li>• Decorative elements have aria-hidden</li>
                <li>• Loading states are announced appropriately</li>
                <li>• Error states provide meaningful feedback</li>
                <li>• Focus management for interactive elements</li>
                <li>• High contrast support through design tokens</li>
              </ul>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-3'>
                <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                  Descriptive Alt Text
                </h3>
                <Image
                  src={demoImages.landscape}
                  alt='Scenic mountain landscape with snow-capped peaks reflecting in a crystal clear alpine lake during golden hour'
                  aspectRatio='video'
                  variant='rounded'
                />
              </div>
              <div className='space-y-3'>
                <h3 className={DESIGN_TOKENS.typography.heading.h4}>
                  High Contrast
                </h3>
                <Image
                  src={demoImages.portrait}
                  alt='High contrast portrait example'
                  aspectRatio='portrait'
                  variant='thumbnail'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section>
          <h2 className={`${DESIGN_TOKENS.typography.heading.h2} mb-6`}>
            Performance Features
          </h2>
          <div
            className={`${DESIGN_TOKENS.semantic.background.success} rounded-lg p-6`}
          >
            <h3 className='mb-2 font-semibold'>Built-in Optimizations:</h3>
            <ul className='space-y-1 text-sm'>
              <li>• Lazy loading with Intersection Observer</li>
              <li>• Progressive image enhancement</li>
              <li>• Skeleton loading states for perceived performance</li>
              <li>• Responsive image support with srcSet</li>
              <li>• Efficient error boundary handling</li>
              <li>• Optimized re-renders with React.memo patterns</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
