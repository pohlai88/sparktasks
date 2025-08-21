import React, { useState } from 'react';
import { Video } from '@/components/ui/Video';
import type {
  VideoAspectRatio,
  VideoSize,
  VideoVariant,
  VideoPreload,
} from '@/components/ui/Video';

/**
 * Demo component showcasing the Video component capabilities
 */
export const VideoDemo: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('video');
  const [size, setSize] = useState<VideoSize>('md');
  const [variant, setVariant] = useState<VideoVariant>('default');
  const [controls, setControls] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);
  const [preload, setPreload] = useState<VideoPreload>('metadata');
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Sample video URLs for demo
  const sampleVideos = [
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4',
    },
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'video/mp4',
    },
  ];

  const [currentVideoSrc, setCurrentVideoSrc] = useState(sampleVideos[0].src);

  return (
    <div className='mx-auto max-w-6xl space-y-8 p-8'>
      <div className='text-center'>
        <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100'>
          Video Component Demo
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Enterprise-grade video player with comprehensive features and
          DESIGN_TOKENS integration
        </p>
      </div>

      {/* Demo Video */}
      <div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
        <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100'>
          Live Demo
        </h2>

        <div className='mb-6 flex justify-center'>
          <Video
            src={currentVideoSrc}
            aspectRatio={aspectRatio}
            size={size}
            variant={variant}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            preload={preload}
            loading={loading}
            error={showError ? 'Demo error message' : undefined}
            disabled={disabled}
            alt='Demo video player'
            poster='https://via.placeholder.com/800x450/4f46e5/ffffff?text=Video+Poster'
            onPlay={() => console.log('Video started playing')}
            onPause={() => console.log('Video paused')}
            onEnded={() => console.log('Video ended')}
            onError={e => console.log('Video error:', e)}
          />
        </div>

        {/* Controls */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Aspect Ratio */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={e => setAspectRatio(e.target.value as VideoAspectRatio)}
              className='w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
            >
              <option value='square'>Square (1:1)</option>
              <option value='video'>Video (16:9)</option>
              <option value='portrait'>Portrait (9:16)</option>
              <option value='landscape'>Landscape (4:3)</option>
              <option value='wide'>Wide (21:9)</option>
              <option value='auto'>Auto</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Size
            </label>
            <select
              value={size}
              onChange={e => setSize(e.target.value as VideoSize)}
              className='w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
            >
              <option value='xs'>Extra Small</option>
              <option value='sm'>Small</option>
              <option value='md'>Medium</option>
              <option value='lg'>Large</option>
              <option value='xl'>Extra Large</option>
            </select>
          </div>

          {/* Variant */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Variant
            </label>
            <select
              value={variant}
              onChange={e => setVariant(e.target.value as VideoVariant)}
              className='w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
            >
              <option value='default'>Default</option>
              <option value='rounded'>Rounded</option>
              <option value='circular'>Circular</option>
              <option value='cinematic'>Cinematic</option>
            </select>
          </div>

          {/* Preload */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Preload
            </label>
            <select
              value={preload}
              onChange={e => setPreload(e.target.value as VideoPreload)}
              className='w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
            >
              <option value='none'>None</option>
              <option value='metadata'>Metadata</option>
              <option value='auto'>Auto</option>
            </select>
          </div>

          {/* Video Source */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Video Source
            </label>
            <select
              value={currentVideoSrc}
              onChange={e => setCurrentVideoSrc(e.target.value)}
              className='w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
            >
              <option value={sampleVideos[0].src}>Big Buck Bunny</option>
              <option value={sampleVideos[1].src}>Elephants Dream</option>
            </select>
          </div>

          {/* Boolean Controls */}
          <div className='space-y-3'>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={controls}
                onChange={e => setControls(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Show Controls
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={autoPlay}
                onChange={e => setAutoPlay(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Auto Play
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={loop}
                onChange={e => setLoop(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Loop
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={muted}
                onChange={e => setMuted(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Muted
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={loading}
                onChange={e => setLoading(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Loading State
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={showError}
                onChange={e => setShowError(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Show Error
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={disabled}
                onChange={e => setDisabled(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700 dark:text-gray-300'>
                Disabled
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Feature List */}
      <div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
        <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100'>
          Component Features
        </h2>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              Aspect Ratios
            </h3>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Square (1:1)</li>
              <li>• Video (16:9)</li>
              <li>• Portrait (9:16)</li>
              <li>• Landscape (4:3)</li>
              <li>• Wide (21:9)</li>
              <li>• Auto (custom)</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              Size Variants
            </h3>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Extra Small (160px)</li>
              <li>• Small (256px)</li>
              <li>• Medium (384px)</li>
              <li>• Large (512px)</li>
              <li>• Extra Large (768px)</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              Visual Styles
            </h3>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Default (clean)</li>
              <li>• Rounded corners</li>
              <li>• Circular</li>
              <li>• Cinematic (elevated)</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              Video Behavior
            </h3>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Auto-play support</li>
              <li>• Loop playback</li>
              <li>• Muted start</li>
              <li>• Preload strategies</li>
              <li>• Picture-in-picture</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              Advanced Features
            </h3>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Multiple video sources</li>
              <li>• Loading states</li>
              <li>• Error handling</li>
              <li>• Event callbacks</li>
              <li>• Accessibility support</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h3 className='font-medium text-gray-900 dark:text-gray-100'>
              DESIGN_TOKENS
            </h3>
            <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
              <li>• Consistent styling</li>
              <li>• Dark mode support</li>
              <li>• Responsive design</li>
              <li>• Motion classes</li>
              <li>• No hardcoded styles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
        <h2 className='mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100'>
          Usage Examples
        </h2>

        <div className='space-y-4'>
          <div>
            <h3 className='mb-2 font-medium text-gray-900 dark:text-gray-100'>
              Basic Usage
            </h3>
            <pre className='overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-900'>
              <code>{`<Video
  src="https://example.com/video.mp4"
  alt="Sample video"
  controls
  poster="https://example.com/poster.jpg"
/>`}</code>
            </pre>
          </div>

          <div>
            <h3 className='mb-2 font-medium text-gray-900 dark:text-gray-100'>
              Multiple Sources
            </h3>
            <pre className='overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-900'>
              <code>{`<Video
  src={[
    { src: 'video.mp4', type: 'video/mp4' },
    { src: 'video.webm', type: 'video/webm' }
  ]}
  aspectRatio="cinematic"
  size="lg"
  variant="cinematic"
/>`}</code>
            </pre>
          </div>

          <div>
            <h3 className='mb-2 font-medium text-gray-900 dark:text-gray-100'>
              With Callbacks
            </h3>
            <pre className='overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-900'>
              <code>{`<Video
  src="video.mp4"
  onPlay={() => console.log('Playing')}
  onPause={() => console.log('Paused')}
  onEnded={() => console.log('Ended')}
  onTimeUpdate={(time, duration) => {
    console.log(\`\${time}s / \${duration}s\`);
  }}
/>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDemo;
