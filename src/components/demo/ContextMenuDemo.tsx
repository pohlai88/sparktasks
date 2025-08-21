import React, { useState } from 'react';
import {
  ContextMenuProvider,
  ContextMenuTrigger,
  MenuItem,
} from '@/components/ui/ContextMenu';
import {
  Copy,
  Edit3,
  Trash2,
  Settings,
  Share,
  Download,
  Star,
  Heart,
} from 'lucide-react';
import { DESIGN_TOKENS } from '@/design/tokens';

const ContextMenuDemo: React.FC = () => {
  const [lastAction, setLastAction] = useState<string>('');

  const handleAction = (action: string) => {
    setLastAction(action);
    console.log(`Action performed: ${action}`);
  };

  // Basic menu items
  const basicMenuItems: MenuItem[] = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy size={16} />,
      onClick: () => handleAction('Copy'),
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit3 size={16} />,
      onClick: () => handleAction('Edit'),
    },
    {
      id: 'divider1',
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => handleAction('Delete'),
    },
  ];

  // Advanced menu with submenus
  const advancedMenuItems: MenuItem[] = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy size={16} />,
      onClick: () => handleAction('Copy'),
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share size={16} />,
      submenu: [
        {
          id: 'share-email',
          label: 'Share via Email',
          onClick: () => handleAction('Share via Email'),
        },
        {
          id: 'share-link',
          label: 'Copy Link',
          onClick: () => handleAction('Copy Link'),
        },
        {
          id: 'share-social',
          label: 'Social Media',
          submenu: [
            {
              id: 'twitter',
              label: 'Twitter',
              onClick: () => handleAction('Share on Twitter'),
            },
            {
              id: 'facebook',
              label: 'Facebook',
              onClick: () => handleAction('Share on Facebook'),
            },
          ],
        },
      ],
    },
    {
      id: 'more',
      label: 'More Options',
      icon: <Settings size={16} />,
      submenu: [
        {
          id: 'download',
          label: 'Download',
          icon: <Download size={16} />,
          onClick: () => handleAction('Download'),
        },
        {
          id: 'favorite',
          label: 'Add to Favorites',
          icon: <Star size={16} />,
          onClick: () => handleAction('Add to Favorites'),
        },
        {
          id: 'like',
          label: 'Like',
          icon: <Heart size={16} />,
          onClick: () => handleAction('Like'),
        },
        {
          id: 'divider2',
          divider: true,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings size={16} />,
          onClick: () => handleAction('Settings'),
        },
      ],
    },
    {
      id: 'divider1',
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => handleAction('Delete'),
    },
  ];

  // Menu with disabled items
  const disabledMenuItems: MenuItem[] = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy size={16} />,
      onClick: () => handleAction('Copy'),
    },
    {
      id: 'edit',
      label: 'Edit (Disabled)',
      icon: <Edit3 size={16} />,
      disabled: true,
      onClick: () => handleAction('Edit'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => handleAction('Delete'),
    },
  ];

  return (
    <ContextMenuProvider>
      <div
        className={`min-h-screen p-8 ${DESIGN_TOKENS.theme.light.surface.base}`}
      >
        <div className='mx-auto max-w-4xl space-y-8'>
          <header className='space-y-4 text-center'>
            <h1
              className={`text-3xl font-bold ${DESIGN_TOKENS.semantic.text.accent}`}
            >
              ContextMenu Demo
            </h1>
            <p className={`text-lg ${DESIGN_TOKENS.semantic.text.muted}`}>
              Right-click on the cards below to test different context menu
              configurations
            </p>
            <p className={`text-sm ${DESIGN_TOKENS.semantic.text.muted}`}>
              Features: Roving tabindex, typeahead search, submenu collision
              detection, keyboard navigation
            </p>
          </header>

          {lastAction && (
            <div
              className={`rounded-lg p-4 ${DESIGN_TOKENS.semantic.background.info} border-l-4 border-blue-500`}
            >
              <p className={`font-medium ${DESIGN_TOKENS.semantic.text.info}`}>
                Last Action: {lastAction}
              </p>
            </div>
          )}

          <div className='grid gap-6 md:grid-cols-3'>
            {/* Basic Menu */}
            <ContextMenuTrigger items={basicMenuItems}>
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400 ${DESIGN_TOKENS.theme.light.surface.subtle} `}
              >
                <h3
                  className={`mb-2 text-xl font-semibold ${DESIGN_TOKENS.semantic.text.accent}`}
                >
                  Basic Menu
                </h3>
                <p className={DESIGN_TOKENS.semantic.text.muted}>
                  Right-click for basic context menu with copy, edit, and delete
                  options.
                </p>
                <div className='mt-4 space-y-2'>
                  <div
                    className={`text-sm ${DESIGN_TOKENS.semantic.text.muted}`}
                  >
                    ✨ Features tested:
                  </div>
                  <ul
                    className={`space-y-1 text-xs ${DESIGN_TOKENS.semantic.text.muted}`}
                  >
                    <li>• Button semantics</li>
                    <li>• Danger styling</li>
                    <li>• Dividers</li>
                    <li>• Keyboard navigation</li>
                  </ul>
                </div>
              </div>
            </ContextMenuTrigger>

            {/* Advanced Menu with Submenus */}
            <ContextMenuTrigger items={advancedMenuItems}>
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400 ${DESIGN_TOKENS.theme.light.surface.subtle} `}
              >
                <h3
                  className={`mb-2 text-xl font-semibold ${DESIGN_TOKENS.semantic.text.accent}`}
                >
                  Advanced Menu
                </h3>
                <p className={DESIGN_TOKENS.semantic.text.muted}>
                  Right-click for advanced menu with nested submenus and
                  collision detection.
                </p>
                <div className='mt-4 space-y-2'>
                  <div
                    className={`text-sm ${DESIGN_TOKENS.semantic.text.muted}`}
                  >
                    ✨ Features tested:
                  </div>
                  <ul
                    className={`space-y-1 text-xs ${DESIGN_TOKENS.semantic.text.muted}`}
                  >
                    <li>• Nested submenus</li>
                    <li>• Collision detection</li>
                    <li>• Pointer intent grace</li>
                    <li>• Arrow navigation</li>
                  </ul>
                </div>
              </div>
            </ContextMenuTrigger>

            {/* Disabled Items Menu */}
            <ContextMenuTrigger items={disabledMenuItems}>
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400 ${DESIGN_TOKENS.theme.light.surface.subtle} `}
              >
                <h3
                  className={`mb-2 text-xl font-semibold ${DESIGN_TOKENS.semantic.text.accent}`}
                >
                  Disabled Items
                </h3>
                <p className={DESIGN_TOKENS.semantic.text.muted}>
                  Right-click to test menu with disabled items (middle item is
                  disabled).
                </p>
                <div className='mt-4 space-y-2'>
                  <div
                    className={`text-sm ${DESIGN_TOKENS.semantic.text.muted}`}
                  >
                    ✨ Features tested:
                  </div>
                  <ul
                    className={`space-y-1 text-xs ${DESIGN_TOKENS.semantic.text.muted}`}
                  >
                    <li>• Disabled states</li>
                    <li>• Skip disabled in navigation</li>
                    <li>• Proper ARIA attributes</li>
                    <li>• Visual feedback</li>
                  </ul>
                </div>
              </div>
            </ContextMenuTrigger>
          </div>

          <div
            className={`rounded-lg p-6 ${DESIGN_TOKENS.theme.light.surface.subtle} border`}
          >
            <h3
              className={`mb-4 text-lg font-semibold ${DESIGN_TOKENS.semantic.text.accent}`}
            >
              Keyboard Shortcuts
            </h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <h4
                  className={`mb-2 font-medium ${DESIGN_TOKENS.semantic.text.accent}`}
                >
                  Menu Navigation
                </h4>
                <ul
                  className={`space-y-1 text-sm ${DESIGN_TOKENS.semantic.text.muted}`}
                >
                  <li>
                    <kbd className='kbd'>↑</kbd> / <kbd className='kbd'>↓</kbd>{' '}
                    Navigate items
                  </li>
                  <li>
                    <kbd className='kbd'>Home</kbd> /{' '}
                    <kbd className='kbd'>End</kbd> First/Last item
                  </li>
                  <li>
                    <kbd className='kbd'>Enter</kbd> /{' '}
                    <kbd className='kbd'>Space</kbd> Activate item
                  </li>
                  <li>
                    <kbd className='kbd'>Esc</kbd> Close menu
                  </li>
                </ul>
              </div>
              <div>
                <h4
                  className={`mb-2 font-medium ${DESIGN_TOKENS.semantic.text.accent}`}
                >
                  Submenu Navigation
                </h4>
                <ul
                  className={`space-y-1 text-sm ${DESIGN_TOKENS.semantic.text.muted}`}
                >
                  <li>
                    <kbd className='kbd'>→</kbd> Open submenu
                  </li>
                  <li>
                    <kbd className='kbd'>←</kbd> Close submenu
                  </li>
                  <li>
                    <kbd className='kbd'>a-z</kbd> Typeahead search
                  </li>
                  <li>Mouse hover for submenu preview</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContextMenuProvider>
  );
};

export default ContextMenuDemo;
