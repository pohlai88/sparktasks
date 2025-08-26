/**
 * Enhanced ContextMenu Examples - MAPS v2.2 Comprehensive Demo
 *
 * Demonstrates all Enhanced Context Menu capabilities:
 * - All 6 variants (default, glass, floating, outlined, ghost, filled)
 * - Factory pattern usage for rapid development
 * - AAA compliance mode examples
 * - Apple HIG interaction patterns
 * - Liquid glass materials with dark-first philosophy
 * - Keyboard shortcuts and icons
 * - Submenus and complex menu structures
 */

import {
  Book,
  Copy,
  Edit3,
  FileText,
  Folder,
  Globe,
  Heart,
  Image,
  Link,
  Music,
  Settings,
  Share,
  Star,
  Trash2,
  User,
  Video,
} from 'lucide-react';
import React, { useState } from 'react';

import { EnhancedButton } from '@/components/ui-enhanced/Button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
  EnhancedContextMenu,
  ContextMenuFactory,
} from '@/components/ui-enhanced/ContextMenu';

// ===== DEMO CARD COMPONENT =====

interface DemoCardProps {
  title: string;
  description: string;
  variant?: string;
  children: React.ReactNode;
  className?: string;
}

const DemoCard: React.FC<DemoCardProps> = ({
  title,
  description,
  variant,
  children,
  className = '',
}) => (
  <div
    className={`relative rounded-xl border border-border-subtle bg-background-elevated p-6 shadow-sm ${className}`}
  >
    <div className='mb-4'>
      <div className='mb-2 flex items-center gap-2'>
        <h3 className='text-content-primary text-lg font-semibold'>{title}</h3>
        {variant && (
          <span className='rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent'>
            {variant}
          </span>
        )}
      </div>
      <p className='text-content-secondary text-sm'>{description}</p>
    </div>
    {children}
  </div>
);

// ===== BASIC EXAMPLES =====

const BasicContextMenuExample: React.FC = () => {
  return (
    <DemoCard
      title='Basic Context Menu'
      description='Right-click on the card to see the basic context menu with common actions.'
      variant='default'
    >
      <ContextMenu>
        <ContextMenuTrigger className='flex h-[150px] w-[300px] items-center justify-center rounded-md border-2 border-dashed border-border-subtle bg-background text-sm'>
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className='w-64'>
          <ContextMenuItem>
            <User className='mr-2 h-4 w-4' />
            Profile
            <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Settings className='mr-2 h-4 w-4' />
            Settings
            <ContextMenuShortcut>⌘,</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Copy className='mr-2 h-4 w-4' />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Share className='mr-2 h-4 w-4' />
            Share
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant='destructive'>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DemoCard>
  );
};

// ===== VARIANT EXAMPLES =====

const VariantExamplesGrid: React.FC = () => {
  const variants = [
    { name: 'default', label: 'Default' },
    { name: 'glass', label: 'Glass' },
    { name: 'floating', label: 'Floating' },
    { name: 'outlined', label: 'Outlined' },
    { name: 'ghost', label: 'Ghost' },
    { name: 'filled', label: 'Filled' },
  ] as const;

  return (
    <DemoCard
      title='Context Menu Variants'
      description='All six variants demonstrating MAPS v2.2 material system and liquid glass effects.'
    >
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {variants.map(({ name, label }) => (
          <div key={name} className='text-center'>
            <p className='text-content-secondary mb-2 text-xs font-medium'>
              {label}
            </p>
            <ContextMenu>
              <ContextMenuTrigger className='flex h-[80px] w-full items-center justify-center rounded-md border border-border-subtle bg-background-elevated text-xs'>
                Right click
              </ContextMenuTrigger>
              <ContextMenuContent variant={name} className='w-48'>
                <ContextMenuItem>
                  <FileText className='mr-2 h-4 w-4' />
                  New File
                </ContextMenuItem>
                <ContextMenuItem>
                  <Folder className='mr-2 h-4 w-4' />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Copy className='mr-2 h-4 w-4' />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem variant='destructive'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        ))}
      </div>
    </DemoCard>
  );
};

// ===== FACTORY PATTERN EXAMPLES =====

const FactoryPatternExample: React.FC = () => {
  return (
    <DemoCard
      title='Factory Pattern Usage'
      description='Pre-configured context menus using the factory pattern for rapid development.'
    >
      <div className='grid grid-cols-2 gap-4'>
        <div className='text-center'>
          <p className='text-content-secondary mb-2 text-xs font-medium'>
            Glass Menu
          </p>
          {ContextMenuFactory.glass({
            trigger: (
              <div className='flex h-[80px] w-full cursor-pointer items-center justify-center rounded-md border border-border-subtle bg-background-elevated text-xs'>
                Glass Effect
              </div>
            ),
            children: (
              <>
                <ContextMenuItem>
                  <Music className='mr-2 h-4 w-4' />
                  Audio
                </ContextMenuItem>
                <ContextMenuItem>
                  <Video className='mr-2 h-4 w-4' />
                  Video
                </ContextMenuItem>
                <ContextMenuItem>
                  <Image className='mr-2 h-4 w-4' />
                  Image
                </ContextMenuItem>
              </>
            ),
          })}
        </div>

        <div className='text-center'>
          <p className='text-content-secondary mb-2 text-xs font-medium'>
            AAA Compliant
          </p>
          {ContextMenuFactory.aaa({
            trigger: (
              <div className='flex h-[80px] w-full cursor-pointer items-center justify-center rounded-md border border-border-subtle bg-background-elevated text-xs'>
                AAA Mode
              </div>
            ),
            children: (
              <>
                <ContextMenuItem>
                  <Globe className='mr-2 h-4 w-4' />
                  Web
                </ContextMenuItem>
                <ContextMenuItem>
                  <Book className='mr-2 h-4 w-4' />
                  Documentation
                </ContextMenuItem>
                <ContextMenuItem>
                  <Heart className='mr-2 h-4 w-4' />
                  Accessibility
                </ContextMenuItem>
              </>
            ),
          })}
        </div>
      </div>
    </DemoCard>
  );
};

// ===== COMPLEX MENU EXAMPLE =====

const ComplexMenuExample: React.FC = () => {
  const [bookmarks] = useState<string[]>(['Bookmark 1']);
  const [theme, setTheme] = useState('dark');
  const [showHidden, setShowHidden] = useState(false);

  return (
    <DemoCard
      title='Complex Menu Structure'
      description='Advanced context menu with submenus, radio groups, checkboxes, and state management.'
    >
      <ContextMenu>
        <ContextMenuTrigger className='flex h-[200px] w-full items-center justify-center rounded-md border-2 border-dashed border-border-subtle bg-background text-sm'>
          Right click for advanced menu
        </ContextMenuTrigger>
        <ContextMenuContent className='w-64'>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuItem>
            <FileText className='mr-2 h-4 w-4' />
            New File
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Folder className='mr-2 h-4 w-4' />
            New Folder
            <ContextMenuShortcut>⇧⌘N</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Star className='mr-2 h-4 w-4' />
              Bookmarks
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className='w-48'>
              <ContextMenuItem>
                <Link className='mr-2 h-4 w-4' />
                Add Bookmark
              </ContextMenuItem>
              <ContextMenuSeparator />
              {bookmarks.map((bookmark, index) => (
                <ContextMenuItem key={index}>
                  <Globe className='mr-2 h-4 w-4' />
                  {bookmark}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Settings className='mr-2 h-4 w-4' />
              Preferences
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className='w-48'>
              <ContextMenuLabel>Theme</ContextMenuLabel>
              <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
                <ContextMenuRadioItem value='light'>Light</ContextMenuRadioItem>
                <ContextMenuRadioItem value='dark'>Dark</ContextMenuRadioItem>
                <ContextMenuRadioItem value='system'>
                  System
                </ContextMenuRadioItem>
              </ContextMenuRadioGroup>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem
                checked={showHidden}
                onCheckedChange={setShowHidden}
              >
                Show hidden files
              </ContextMenuCheckboxItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <Copy className='mr-2 h-4 w-4' />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Edit3 className='mr-2 h-4 w-4' />
            Edit
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Share className='mr-2 h-4 w-4' />
            Share
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem variant='destructive'>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DemoCard>
  );
};

// ===== ENHANCED CONTEXT MENU EXAMPLE =====

const EnhancedContextMenuExample: React.FC = () => {
  return (
    <DemoCard
      title='Enhanced Context Menu Component'
      description='Using the all-in-one EnhancedContextMenu component for simplified development.'
    >
      <div className='grid grid-cols-2 gap-4'>
        <EnhancedContextMenu
          variant='glass'
          trigger={
            <EnhancedButton variant='outline' className='w-full'>
              Glass Context Menu
            </EnhancedButton>
          }
        >
          <ContextMenuItem>
            <Music className='mr-2 h-4 w-4' />
            Play Music
          </ContextMenuItem>
          <ContextMenuItem>
            <Video className='mr-2 h-4 w-4' />
            Watch Video
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Share className='mr-2 h-4 w-4' />
            Share
          </ContextMenuItem>
        </EnhancedContextMenu>

        <EnhancedContextMenu
          variant='floating'
          aaaMode={true}
          trigger={
            <EnhancedButton variant='outline' className='w-full'>
              AAA Floating Menu
            </EnhancedButton>
          }
        >
          <ContextMenuItem>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </ContextMenuItem>
          <ContextMenuItem>
            <User className='mr-2 h-4 w-4' />
            Profile
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant='destructive'>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </ContextMenuItem>
        </EnhancedContextMenu>
      </div>
    </DemoCard>
  );
};

// ===== MAIN EXAMPLE COMPONENT =====

const ContextMenuExamples: React.FC = () => {
  return (
    <div className='space-y-8 p-8'>
      <div className='mb-8 text-center'>
        <h1 className='text-content-primary mb-2 text-3xl font-bold'>
          Enhanced Context Menu Examples
        </h1>
        <p className='text-content-secondary mx-auto max-w-2xl'>
          Comprehensive demonstration of the Enhanced Context Menu component
          following MAPS v2.2 architecture with dark-first philosophy, Apple HIG
          harmony, and AAA accessibility compliance.
        </p>
      </div>

      <div className='grid gap-8'>
        <BasicContextMenuExample />
        <VariantExamplesGrid />
        <FactoryPatternExample />
        <ComplexMenuExample />
        <EnhancedContextMenuExample />
      </div>

      <div className='mt-12 rounded-xl border border-border-subtle bg-background-panel p-6'>
        <h3 className='text-content-primary mb-2 text-lg font-semibold'>
          Implementation Notes
        </h3>
        <ul className='text-content-secondary space-y-2 text-sm'>
          <li>• All context menus follow MAPS v2.2 dark-first philosophy</li>
          <li>
            • Liquid glass effects are surface-only, never affecting content
            readability
          </li>
          <li>
            • AAA compliance mode provides maximum contrast for accessibility
          </li>
          <li>
            • Factory patterns enable rapid development with pre-configured
            variants
          </li>
          <li>
            • Apple HIG interaction patterns ensure familiar user experience
          </li>
          <li>
            • All variants respect motion preferences and support keyboard
            navigation
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContextMenuExamples;
export {
  BasicContextMenuExample,
  VariantExamplesGrid,
  FactoryPatternExample,
  ComplexMenuExample,
  EnhancedContextMenuExample,
};
