/**
 * @fileoverview Banner Component Demo - Enterprise-grade global announcements showcase
 *
 * This demo showcases all Banner variants, sizes, and features including:
 * - Multiple announcement types (info, success, warning, error, maintenance, promotion)
 * - Different sizes and positions
 * - Dismissible functionality with persistence
 * - Action buttons and external links
 * - Accessibility features
 * - Custom icons and content
 */

import { useState } from 'react';
import Banner, {
  BannerInfo,
  BannerSuccess,
  BannerWarning,
  BannerError,
  BannerAnnouncement,
  BannerMaintenance,
  BannerPromotion,
  type BannerAction,
} from '../ui/Banner';

export default function BannerDemo() {
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(msg => msg !== message));
    }, 3000);
  };

  const handleUpgrade = () => {
    addNotification('Upgrade action triggered!');
  };

  const handleMaintenanceAction = () => {
    addNotification('Maintenance info requested!');
  };

  // Demo actions
  const maintenanceActions: BannerAction[] = [
    {
      label: 'More Info',
      onClick: handleMaintenanceAction,
      variant: 'primary',
    },
    {
      label: 'System Status',
      href: '/status',
      variant: 'secondary',
      external: true,
    },
  ];

  const promotionActions: BannerAction[] = [
    { label: 'Get 50% Off', onClick: handleUpgrade, variant: 'primary' },
    { label: 'View Pricing', href: '/pricing', variant: 'ghost' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Fixed Top Banner Example */}
      {showTopBanner && (
        <BannerPromotion
          position='top'
          title='🎉 Limited Time Offer!'
          description='Upgrade to Pro and save 50% - offer expires tomorrow!'
          actions={promotionActions}
          dismissible
          onDismiss={() => setShowTopBanner(false)}
          persistenceKey='promo-demo-2024'
        />
      )}

      {/* Main Content */}
      <div
        className={`mx-auto max-w-6xl space-y-8 px-4 py-8 ${showTopBanner ? 'pt-24' : ''}`}
      >
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900 dark:text-white'>
            Banner Component Demo
          </h1>
          <p className='mb-8 text-xl text-gray-600 dark:text-gray-300'>
            Enterprise-grade global announcements and system messaging
          </p>
        </div>

        {/* Notifications Area */}
        {notifications.length > 0 && (
          <div className='fixed right-4 top-4 z-50 space-y-2'>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className='rounded-md border border-blue-200 bg-blue-100 px-4 py-2 text-blue-800 shadow-lg'
              >
                {notification}
              </div>
            ))}
          </div>
        )}

        {/* Variant Showcase */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Banner Variants
          </h2>

          <div className='space-y-4'>
            <BannerInfo
              title='Information Banner'
              description='General information and helpful tips for users.'
              dismissible
            />

            <BannerSuccess
              title='Success! Operation Complete'
              description='Your task has been completed successfully. All changes have been saved.'
              actions={[
                {
                  label: 'View Details',
                  onClick: () => addNotification('Success details viewed'),
                  variant: 'primary',
                },
              ]}
              dismissible
            />

            <BannerWarning
              title='Important System Notice'
              description='Please review your account settings before the deadline on March 15th.'
              actions={[
                {
                  label: 'Review Settings',
                  onClick: () => addNotification('Settings reviewed'),
                  variant: 'primary',
                },
                {
                  label: 'Remind Later',
                  onClick: () => addNotification('Reminder set'),
                  variant: 'secondary',
                },
              ]}
              dismissible
            />

            <BannerError
              title='System Error Detected'
              description='An error occurred while processing your request. Our team has been notified.'
              actions={[
                {
                  label: 'Try Again',
                  onClick: () => addNotification('Retrying operation'),
                  variant: 'primary',
                },
                {
                  label: 'Contact Support',
                  href: '/support',
                  variant: 'secondary',
                },
              ]}
              dismissible
            />

            <BannerAnnouncement
              title='🚀 New Feature Available'
              description="We've just released our new collaboration tools. Check them out!"
              actions={[
                {
                  label: 'Explore Features',
                  onClick: () => addNotification('Features explored'),
                  variant: 'primary',
                },
                { label: 'Read More', href: '/features', variant: 'secondary' },
              ]}
              dismissible
            />

            <BannerMaintenance
              title='Scheduled Maintenance Window'
              description='System maintenance scheduled for tonight from 2:00-4:00 AM UTC. Some features may be unavailable.'
              actions={maintenanceActions}
              dismissible
            />
          </div>
        </section>

        {/* Size Variants */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Size Variants
          </h2>

          <div className='space-y-4'>
            <BannerInfo
              size='compact'
              title='Compact Banner'
              description='Minimal spacing for subtle notifications.'
              dismissible
            />

            <BannerSuccess
              size='standard'
              title='Standard Banner (Default)'
              description='Balanced spacing for most use cases.'
              dismissible
            />

            <BannerWarning
              size='prominent'
              title='Prominent Banner'
              description='Extra spacing for important announcements that need attention.'
              actions={[
                {
                  label: 'Take Action',
                  onClick: () => addNotification('Action taken'),
                  variant: 'primary',
                },
              ]}
              dismissible
            />
          </div>
        </section>

        {/* Custom Content */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Custom Content
          </h2>

          <Banner variant='promotion' dismissible>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='text-2xl'>🎁</div>
                <div>
                  <h3 className='font-semibold text-purple-900 dark:text-purple-100'>
                    Special Holiday Offer
                  </h3>
                  <p className='text-purple-700 dark:text-purple-300'>
                    Limited time: Get premium features with 60% discount
                  </p>
                </div>
              </div>
              <div className='flex space-x-3'>
                <button
                  onClick={() => addNotification('Holiday offer claimed!')}
                  className='rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700'
                >
                  Claim Offer
                </button>
                <button
                  onClick={() => addNotification('Offer details viewed')}
                  className='rounded-md border border-purple-300 bg-transparent px-4 py-2 font-medium text-purple-600 transition-colors hover:bg-purple-100 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900'
                >
                  View Details
                </button>
              </div>
            </div>
          </Banner>
        </section>

        {/* Position Examples */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Position Examples
          </h2>

          <div className='space-y-4'>
            <div className='rounded-lg border bg-white p-6 dark:bg-gray-800'>
              <h3 className='mb-4 font-medium text-gray-900 dark:text-white'>
                Inline Banners (Default)
              </h3>
              <BannerInfo
                title='Inline Banner'
                description='Positioned within the normal document flow.'
                size='compact'
              />
            </div>

            <div className='rounded-lg border bg-white p-6 dark:bg-gray-800'>
              <h3 className='mb-4 font-medium text-gray-900 dark:text-white'>
                Fixed Position Banners
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Top banner example is shown at the top of this page (if not
                dismissed). Bottom banners work similarly but stick to the
                bottom of the viewport.
              </p>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Accessibility Features
          </h2>

          <div className='rounded-lg border bg-white p-6 dark:bg-gray-800'>
            <h3 className='mb-4 font-medium text-gray-900 dark:text-white'>
              ♿ WCAG 2.1 AA Compliant
            </h3>
            <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
              <li>• Proper ARIA roles and labels for screen readers</li>
              <li>
                • Keyboard navigation support (Tab through actions, Enter to
                activate)
              </li>
              <li>• High contrast color schemes for all variants</li>
              <li>• Focus management and visual focus indicators</li>
              <li>• Semantic HTML structure with proper headings</li>
              <li>• Screen reader announcements for dynamic content</li>
            </ul>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Enterprise Features
          </h2>

          <div className='grid gap-6 md:grid-cols-2'>
            <div className='rounded-lg border bg-white p-6 dark:bg-gray-800'>
              <h3 className='mb-3 font-medium text-gray-900 dark:text-white'>
                🏢 Fortune 500 Standards
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
                <li>• Professional design system compliance</li>
                <li>• Enterprise-grade TypeScript types</li>
                <li>• Comprehensive test coverage</li>
                <li>• Performance optimized</li>
              </ul>
            </div>

            <div className='rounded-lg border bg-white p-6 dark:bg-gray-800'>
              <h3 className='mb-3 font-medium text-gray-900 dark:text-white'>
                🎯 Advanced Features
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
                <li>• Persistence with localStorage</li>
                <li>• Compound component architecture</li>
                <li>• Dark mode support</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Integration Examples */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Integration Examples
          </h2>

          <div className='rounded-lg bg-gray-100 p-6 dark:bg-gray-800'>
            <h3 className='mb-4 font-medium text-gray-900 dark:text-white'>
              Code Examples
            </h3>
            <div className='overflow-x-auto rounded border bg-white p-4 text-sm dark:bg-gray-900'>
              <pre className='text-gray-800 dark:text-gray-200'>
                {`// Basic banner
<Banner variant="info" title="Welcome!" description="Getting started..." />

// Promotional banner with actions
<BannerPromotion
  position="top"
  title="Limited Time Offer"
  description="Upgrade now and save 50%!"
  actions={[
    { label: 'Upgrade', onClick: handleUpgrade, variant: 'primary' },
    { label: 'Learn More', href: '/pricing', variant: 'secondary' }
  ]}
  dismissible
  persistenceKey="promo-2024-q1"
/>

// System maintenance notice
<BannerMaintenance
  title="Scheduled Maintenance"
  description="System downtime tonight 2-4 AM UTC"
  actions={[{ label: 'Status Page', href: '/status', external: true }]}
  dismissible
/>`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
