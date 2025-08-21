/**
 * @fileoverview Drawer Demo Component - Showcases Drawer/Sheet functionality
 *
 * Demonstrates all Drawer component features including positions, sizes, variants,
 * and compound components for easy testing and reference.
 */

import React, { useState } from 'react';
import Drawer, {
  Sheet,
  Sidebar,
  SlideOver,
  BottomSheet,
} from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DESIGN_TOKENS } from '@/design/tokens';

export function DrawerDemo() {
  // Position states
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [topOpen, setTopOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);

  // Compound component states
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // Variant states
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <div className={`${DESIGN_TOKENS.layout.patterns.panelSection} space-y-8`}>
      <div>
        <h1 className={DESIGN_TOKENS.typography.heading.h2}>
          Drawer/Sheet Component Demo
        </h1>
        <p className={`${DESIGN_TOKENS.typography.body.secondary} mt-2`}>
          Enterprise-grade sliding panels with comprehensive features
        </p>
      </div>

      <div className='space-y-8'>
        {/* Position Demos */}
        <Card title='Drawer Positions' variant='default'>
          <div className='space-y-4'>
            <p className={DESIGN_TOKENS.typography.body.secondary}>
              Drawers can slide in from any side of the screen
            </p>
            <div className={DESIGN_TOKENS.layout.grid.cols4}>
              <Button onClick={() => setLeftOpen(true)} variant='primary'>
                Left Drawer
              </Button>
              <Button onClick={() => setRightOpen(true)} variant='secondary'>
                Right Drawer
              </Button>
              <Button onClick={() => setTopOpen(true)} variant='ghost'>
                Top Drawer
              </Button>
              <Button onClick={() => setBottomOpen(true)} variant='outline'>
                Bottom Drawer
              </Button>
            </div>
          </div>
        </Card>

        {/* Variant Demos */}
        <Card title='Drawer Variants' variant='subtle'>
          <div className='space-y-4'>
            <p className={DESIGN_TOKENS.typography.body.secondary}>
              Different visual styles for different contexts
            </p>
            <div className={DESIGN_TOKENS.layout.grid.cols3}>
              <Button onClick={() => setPrimaryOpen(true)} variant='primary'>
                Primary Variant
              </Button>
              <Button onClick={() => setDangerOpen(true)} variant='destructive'>
                Danger Variant
              </Button>
              <Button onClick={() => setSuccessOpen(true)} variant='secondary'>
                Success Variant
              </Button>
            </div>
          </div>
        </Card>

        {/* Compound Component Demos */}
        <Card title='Compound Components' variant='raised'>
          <div className='space-y-4'>
            <p className={DESIGN_TOKENS.typography.body.secondary}>
              Specialized drawer components for common use cases
            </p>
            <div className={DESIGN_TOKENS.layout.grid.cols2}>
              <Button onClick={() => setSheetOpen(true)} variant='outline'>
                Settings Sheet
              </Button>
              <Button onClick={() => setSidebarOpen(true)} variant='ghost'>
                Navigation Sidebar
              </Button>
              <Button
                onClick={() => setSlideOverOpen(true)}
                variant='secondary'
              >
                Detail SlideOver
              </Button>
              <Button
                onClick={() => setBottomSheetOpen(true)}
                variant='primary'
              >
                Filter Bottom Sheet
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Position Drawers */}
      <Drawer
        open={leftOpen}
        onClose={() => setLeftOpen(false)}
        position='left'
        title='Left Navigation'
        description='Main navigation menu'
        size='md'
      >
        <div className='space-y-4'>
          <nav className='space-y-2'>
            <a
              href='#'
              className={`${DESIGN_TOKENS.recipe.button.ghost} w-full justify-start`}
            >
              🏠 Dashboard
            </a>
            <a
              href='#'
              className={`${DESIGN_TOKENS.recipe.button.ghost} w-full justify-start`}
            >
              📊 Analytics
            </a>
            <a
              href='#'
              className={`${DESIGN_TOKENS.recipe.button.ghost} w-full justify-start`}
            >
              👥 Team
            </a>
            <a
              href='#'
              className={`${DESIGN_TOKENS.recipe.button.ghost} w-full justify-start`}
            >
              ⚙️ Settings
            </a>
          </nav>
        </div>
      </Drawer>

      <Drawer
        open={rightOpen}
        onClose={() => setRightOpen(false)}
        position='right'
        title='User Profile'
        description='Edit your profile information'
        size='lg'
        actions={[
          { label: 'Cancel', onClick: () => setRightOpen(false) },
          {
            label: 'Save Changes',
            onClick: () => setRightOpen(false),
            variant: 'primary',
          },
        ]}
      >
        <div className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label
                className={`${DESIGN_TOKENS.typography.body.primary} text-sm font-medium`}
              >
                Full Name
              </label>
              <input
                type='text'
                defaultValue='John Doe'
                className={`${DESIGN_TOKENS.recipe.input.base} mt-1`}
              />
            </div>
            <div>
              <label
                className={`${DESIGN_TOKENS.typography.body.primary} text-sm font-medium`}
              >
                Email Address
              </label>
              <input
                type='email'
                defaultValue='john@example.com'
                className={`${DESIGN_TOKENS.recipe.input.base} mt-1`}
              />
            </div>
            <div>
              <label
                className={`${DESIGN_TOKENS.typography.body.primary} text-sm font-medium`}
              >
                Bio
              </label>
              <textarea
                rows={4}
                defaultValue='Software engineer passionate about creating great user experiences.'
                className={`${DESIGN_TOKENS.recipe.textarea.base} mt-1`}
              />
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        open={topOpen}
        onClose={() => setTopOpen(false)}
        position='top'
        title='System Notifications'
        size='md'
        variant='default'
      >
        <div className='space-y-4'>
          <div className={`${DESIGN_TOKENS.recipe.alert.info} border-0`}>
            <div className='flex'>
              <div className='ml-3'>
                <h4 className='text-sm font-medium'>System Update Available</h4>
                <p className='text-sm opacity-90'>
                  A new version is ready to install.
                </p>
              </div>
            </div>
          </div>
          <div className={`${DESIGN_TOKENS.recipe.alert.success} border-0`}>
            <div className='flex'>
              <div className='ml-3'>
                <h4 className='text-sm font-medium'>Backup Completed</h4>
                <p className='text-sm opacity-90'>
                  Your data has been successfully backed up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        open={bottomOpen}
        onClose={() => setBottomOpen(false)}
        position='bottom'
        title='Quick Actions'
        size='sm'
      >
        <div className={DESIGN_TOKENS.layout.grid.cols2}>
          <Button variant='outline' className='h-16 flex-col'>
            <span>📤</span>
            <span>Share</span>
          </Button>
          <Button variant='outline' className='h-16 flex-col'>
            <span>📋</span>
            <span>Copy</span>
          </Button>
          <Button variant='outline' className='h-16 flex-col'>
            <span>✏️</span>
            <span>Edit</span>
          </Button>
          <Button variant='outline' className='h-16 flex-col'>
            <span>🗑️</span>
            <span>Delete</span>
          </Button>
        </div>
      </Drawer>

      {/* Variant Drawers */}
      <Drawer
        open={primaryOpen}
        onClose={() => setPrimaryOpen(false)}
        title='Primary Information'
        variant='primary'
        size='md'
      >
        <div className='space-y-4'>
          <p>This drawer uses the primary variant styling.</p>
          <p>Perfect for important information and primary actions.</p>
        </div>
      </Drawer>

      <Drawer
        open={dangerOpen}
        onClose={() => setDangerOpen(false)}
        title='Danger Zone'
        variant='danger'
        size='md'
        actions={[
          { label: 'Cancel', onClick: () => setDangerOpen(false) },
          {
            label: 'Delete',
            onClick: () => setDangerOpen(false),
            variant: 'destructive',
          },
        ]}
      >
        <div className='space-y-4'>
          <p>This drawer uses the danger variant styling.</p>
          <p>Use for destructive actions and warnings.</p>
          <div className={DESIGN_TOKENS.recipe.alert.error}>
            <p>This action cannot be undone!</p>
          </div>
        </div>
      </Drawer>

      <Drawer
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title='Success Message'
        variant='success'
        size='md'
      >
        <div className='space-y-4'>
          <p>This drawer uses the success variant styling.</p>
          <p>Perfect for confirmation messages and positive feedback.</p>
          <div className={DESIGN_TOKENS.recipe.alert.success}>
            <p>Operation completed successfully!</p>
          </div>
        </div>
      </Drawer>

      {/* Compound Components */}
      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='Application Settings'
        description='Configure your application preferences'
        actions={[
          {
            label: 'Reset to Default',
            onClick: () => {},
            variant: 'secondary',
          },
          {
            label: 'Save Settings',
            onClick: () => setSheetOpen(false),
            variant: 'primary',
          },
        ]}
      >
        <div className='space-y-6'>
          <div>
            <h4 className={`${DESIGN_TOKENS.typography.heading.h4} mb-3`}>
              Appearance
            </h4>
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input type='radio' name='theme' className='mr-3' />
                <span>Light Theme</span>
              </label>
              <label className='flex items-center'>
                <input type='radio' name='theme' className='mr-3' />
                <span>Dark Theme</span>
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='theme'
                  className='mr-3'
                  defaultChecked
                />
                <span>System Theme</span>
              </label>
            </div>
          </div>
          <div>
            <h4 className={`${DESIGN_TOKENS.typography.heading.h4} mb-3`}>
              Notifications
            </h4>
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-3' defaultChecked />
                <span>Email Notifications</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-3' />
                <span>Push Notifications</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-3' defaultChecked />
                <span>In-App Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </Sheet>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title='Site Navigation'
      >
        <nav className='space-y-1'>
          <a href='#' className='block rounded px-3 py-2 hover:bg-gray-100'>
            Home
          </a>
          <a href='#' className='block rounded px-3 py-2 hover:bg-gray-100'>
            About
          </a>
          <a href='#' className='block rounded px-3 py-2 hover:bg-gray-100'>
            Services
          </a>
          <a href='#' className='block rounded px-3 py-2 hover:bg-gray-100'>
            Portfolio
          </a>
          <a href='#' className='block rounded px-3 py-2 hover:bg-gray-100'>
            Contact
          </a>
        </nav>
      </Sidebar>

      <SlideOver
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        title='Task Details'
        description='View and manage task information'
      >
        <div className='space-y-6'>
          <div>
            <label className='mb-2 block text-sm font-medium'>Task Title</label>
            <input
              type='text'
              defaultValue='Implement Drawer Component'
              className={DESIGN_TOKENS.recipe.input.base}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>Status</label>
            <select className={DESIGN_TOKENS.recipe.select.base}>
              <option>To Do</option>
              <option>In Progress</option>
              <option selected>Completed</option>
            </select>
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Description
            </label>
            <textarea
              rows={4}
              defaultValue='Create a comprehensive drawer/sheet component system with multiple positions, sizes, and variants.'
              className={DESIGN_TOKENS.recipe.textarea.base}
            />
          </div>
        </div>
      </SlideOver>

      <BottomSheet
        open={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        title='Filter Options'
        actions={[
          { label: 'Clear All', onClick: () => {} },
          {
            label: 'Apply Filters',
            onClick: () => setBottomSheetOpen(false),
            variant: 'primary',
          },
        ]}
      >
        <div className='space-y-6'>
          <div>
            <h4 className='mb-3 font-medium'>Status</h4>
            <div className='flex flex-wrap gap-2'>
              <button className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'>
                Active
              </button>
              <button className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600'>
                Pending
              </button>
              <button className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600'>
                Completed
              </button>
            </div>
          </div>
          <div>
            <h4 className='mb-3 font-medium'>Priority</h4>
            <div className='flex flex-wrap gap-2'>
              <button className='rounded-full bg-red-100 px-3 py-1 text-sm text-red-800'>
                High
              </button>
              <button className='rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800'>
                Medium
              </button>
              <button className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600'>
                Low
              </button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default DrawerDemo;
