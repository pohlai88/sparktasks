/**
 * Enhanced Menu Bar Demo - MAPS v2.2 Dark-First Showcase
 *
 * COMPREHENSIVE DEMONSTRATION:
 * - All MenuBar variants (default, glass, ghost)
 * - Size and density options
 * - AAA compliance enforcement
 * - Liquid glass materials showcase
 * - Complex menu structures
 * - Keyboard navigation examples
 * - Accessibility features
 * - Real-world usage patterns
 *
 * MAPS v2.2 COMPLIANCE:
 * - Dark-first philosophy demonstration
 * - Apple HIG interaction patterns
 * - Platform-aware responsiveness
 * - Systematic spacing showcase
 * - Enhanced token usage
 */

import {
  Copy,
  Download,
  Edit,
  File,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Save,
  Settings,
  Share,
  Trash2,
  Undo,
  Redo,
  Eye,
  Grid,
  List,
  Palette,
  Moon,
  Sun,
  Monitor,
  Zap,
  Shield,
  HelpCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarCheckboxItem,
  MenuBarRadioItem,
  MenuBarLabel,
  MenuBarSeparator,
  MenuBarShortcut,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
  MenuBarRadioGroup,
} from '../ui-enhanced/MenuBar';

// ===== DEMO STATE MANAGEMENT =====

interface DemoState {
  autoSave: boolean;
  viewMode: 'list' | 'grid' | 'gallery';
  theme: 'light' | 'dark' | 'system';
  sidebarVisible: boolean;
  aaaMode: boolean;
  density: 'comfortable' | 'compact';
}

const MenuBarDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    autoSave: true,
    viewMode: 'list',
    theme: 'dark',
    sidebarVisible: true,
    aaaMode: false,
    density: 'comfortable',
  });

  const handleStateChange = <K extends keyof DemoState>(
    key: K,
    value: DemoState[K]
  ) => {
    setDemoState(prev => ({ ...prev, [key]: value }));
  };

  // ===== DEMO SECTIONS =====

  return (
    <div className='space-y-8 p-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-4xl font-bold leading-tight tracking-tight text-foreground'>
          Enhanced Menu Bar
        </h1>
        <p className='text-lg text-foreground-muted'>
          Professional desktop-style menu bars with MAPS v2.2 dark-first
          philosophy, Apple HIG compliance, and comprehensive accessibility
          features.
        </p>
      </div>

      {/* Demo Controls */}
      <div className='flex flex-wrap gap-4 rounded-lg border border-border bg-background-elevated p-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-foreground'>AAA Mode:</span>
          <button
            onClick={() => handleStateChange('aaaMode', !demoState.aaaMode)}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              demoState.aaaMode
                ? 'bg-accent-solid-aaa text-background'
                : 'bg-muted text-foreground hover:bg-muted/80'
            } `}
          >
            {demoState.aaaMode ? 'AAA Enforced' : 'Standard Mode'}
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-foreground'>Density:</span>
          <select
            value={demoState.density}
            onChange={e =>
              handleStateChange(
                'density',
                e.target.value as 'comfortable' | 'compact'
              )
            }
            className='rounded border border-border bg-background-elevated px-2 py-1 text-sm'
          >
            <option value='comfortable'>Comfortable</option>
            <option value='compact'>Compact</option>
          </select>
        </div>
      </div>

      {/* Basic Menu Bar */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Application Menu Bar
          </h2>
          <p className='text-foreground-muted'>
            Complete desktop application menu with File, Edit, View, and Help
            menus.
          </p>
        </div>

        <div className='overflow-hidden rounded-lg border border-border'>
          <div className='bg-background-elevated p-4'>
            <MenuBar enforceAAA={demoState.aaaMode} density={demoState.density}>
              {/* File Menu */}
              <MenuBarMenu>
                <MenuBarTrigger enforceAAA={demoState.aaaMode}>
                  <File className='mr-2 h-4 w-4' />
                  File
                </MenuBarTrigger>
                <MenuBarContent enforceAAA={demoState.aaaMode}>
                  <MenuBarItem>
                    <Plus className='mr-2 h-4 w-4' />
                    New
                    <MenuBarShortcut>⌘N</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarItem>
                    <FolderOpen className='mr-2 h-4 w-4' />
                    Open
                    <MenuBarShortcut>⌘O</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarSeparator />
                  <MenuBarSub>
                    <MenuBarSubTrigger>
                      <FileText className='mr-2 h-4 w-4' />
                      Recent Files
                    </MenuBarSubTrigger>
                    <MenuBarSubContent>
                      <MenuBarItem>Document 1.txt</MenuBarItem>
                      <MenuBarItem>Presentation.pptx</MenuBarItem>
                      <MenuBarItem>Spreadsheet.xlsx</MenuBarItem>
                      <MenuBarSeparator />
                      <MenuBarItem>Clear Recent</MenuBarItem>
                    </MenuBarSubContent>
                  </MenuBarSub>
                  <MenuBarSeparator />
                  <MenuBarItem>
                    <Save className='mr-2 h-4 w-4' />
                    Save
                    <MenuBarShortcut>⌘S</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarItem>
                    <Download className='mr-2 h-4 w-4' />
                    Export
                    <MenuBarShortcut>⌘E</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarSeparator />
                  <MenuBarCheckboxItem
                    checked={demoState.autoSave}
                    onCheckedChange={checked =>
                      handleStateChange('autoSave', checked === true)
                    }
                  >
                    Auto Save
                  </MenuBarCheckboxItem>
                </MenuBarContent>
              </MenuBarMenu>

              {/* Edit Menu */}
              <MenuBarMenu>
                <MenuBarTrigger enforceAAA={demoState.aaaMode}>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </MenuBarTrigger>
                <MenuBarContent enforceAAA={demoState.aaaMode}>
                  <MenuBarItem>
                    <Undo className='mr-2 h-4 w-4' />
                    Undo
                    <MenuBarShortcut>⌘Z</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarItem>
                    <Redo className='mr-2 h-4 w-4' />
                    Redo
                    <MenuBarShortcut>⌘⇧Z</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarSeparator />
                  <MenuBarItem>
                    <Copy className='mr-2 h-4 w-4' />
                    Copy
                    <MenuBarShortcut>⌘C</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarItem>
                    Paste
                    <MenuBarShortcut>⌘V</MenuBarShortcut>
                  </MenuBarItem>
                  <MenuBarSeparator />
                  <MenuBarItem>
                    Select All
                    <MenuBarShortcut>⌘A</MenuBarShortcut>
                  </MenuBarItem>
                </MenuBarContent>
              </MenuBarMenu>

              {/* View Menu */}
              <MenuBarMenu>
                <MenuBarTrigger enforceAAA={demoState.aaaMode}>
                  <Eye className='mr-2 h-4 w-4' />
                  View
                </MenuBarTrigger>
                <MenuBarContent enforceAAA={demoState.aaaMode}>
                  <MenuBarLabel>Layout</MenuBarLabel>
                  <MenuBarRadioGroup
                    value={demoState.viewMode}
                    onValueChange={value =>
                      handleStateChange(
                        'viewMode',
                        value as typeof demoState.viewMode
                      )
                    }
                  >
                    <MenuBarRadioItem value='list'>
                      <List className='mr-2 h-4 w-4' />
                      List View
                    </MenuBarRadioItem>
                    <MenuBarRadioItem value='grid'>
                      <Grid className='mr-2 h-4 w-4' />
                      Grid View
                    </MenuBarRadioItem>
                    <MenuBarRadioItem value='gallery'>
                      <Palette className='mr-2 h-4 w-4' />
                      Gallery View
                    </MenuBarRadioItem>
                  </MenuBarRadioGroup>
                  <MenuBarSeparator />
                  <MenuBarSub>
                    <MenuBarSubTrigger>
                      <Monitor className='mr-2 h-4 w-4' />
                      Theme
                    </MenuBarSubTrigger>
                    <MenuBarSubContent>
                      <MenuBarRadioGroup
                        value={demoState.theme}
                        onValueChange={value =>
                          handleStateChange(
                            'theme',
                            value as typeof demoState.theme
                          )
                        }
                      >
                        <MenuBarRadioItem value='light'>
                          <Sun className='mr-2 h-4 w-4' />
                          Light
                        </MenuBarRadioItem>
                        <MenuBarRadioItem value='dark'>
                          <Moon className='mr-2 h-4 w-4' />
                          Dark
                        </MenuBarRadioItem>
                        <MenuBarRadioItem value='system'>
                          <Monitor className='mr-2 h-4 w-4' />
                          System
                        </MenuBarRadioItem>
                      </MenuBarRadioGroup>
                    </MenuBarSubContent>
                  </MenuBarSub>
                  <MenuBarSeparator />
                  <MenuBarCheckboxItem
                    checked={demoState.sidebarVisible}
                    onCheckedChange={checked =>
                      handleStateChange('sidebarVisible', checked === true)
                    }
                  >
                    <Folder className='mr-2 h-4 w-4' />
                    Show Sidebar
                  </MenuBarCheckboxItem>
                </MenuBarContent>
              </MenuBarMenu>

              {/* Help Menu */}
              <MenuBarMenu>
                <MenuBarTrigger enforceAAA={demoState.aaaMode}>
                  <HelpCircle className='mr-2 h-4 w-4' />
                  Help
                </MenuBarTrigger>
                <MenuBarContent enforceAAA={demoState.aaaMode}>
                  <MenuBarItem>
                    <HelpCircle className='mr-2 h-4 w-4' />
                    Documentation
                  </MenuBarItem>
                  <MenuBarItem>
                    <Zap className='mr-2 h-4 w-4' />
                    Keyboard Shortcuts
                  </MenuBarItem>
                  <MenuBarSeparator />
                  <MenuBarItem>About Application</MenuBarItem>
                </MenuBarContent>
              </MenuBarMenu>
            </MenuBar>
          </div>
        </div>
      </section>

      {/* Liquid Glass Variant */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Liquid Glass Menu Bar
          </h2>
          <p className='text-foreground-muted'>
            Ethereal vibrancy effects with backdrop blur and content protection.
          </p>
        </div>

        <div className='relative overflow-hidden rounded-lg border border-border'>
          {/* Background pattern for glass effect demonstration */}
          <div className='absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-secondary/20' />
          <div className='relative bg-background-panel/60 p-4'>
            <MenuBar
              variant='glass'
              enforceAAA={demoState.aaaMode}
              density={demoState.density}
            >
              <MenuBarMenu>
                <MenuBarTrigger variant='glass' enforceAAA={demoState.aaaMode}>
                  <Settings className='mr-2 h-4 w-4' />
                  Tools
                </MenuBarTrigger>
                <MenuBarContent variant='glass' enforceAAA={demoState.aaaMode}>
                  <MenuBarItem>
                    <Shield className='mr-2 h-4 w-4' />
                    Security Settings
                  </MenuBarItem>
                  <MenuBarItem>
                    <Palette className='mr-2 h-4 w-4' />
                    Appearance
                  </MenuBarItem>
                  <MenuBarSeparator />
                  <MenuBarItem>
                    <Share className='mr-2 h-4 w-4' />
                    Export Settings
                  </MenuBarItem>
                </MenuBarContent>
              </MenuBarMenu>

              <MenuBarMenu>
                <MenuBarTrigger variant='glass' enforceAAA={demoState.aaaMode}>
                  <MoreHorizontal className='mr-2 h-4 w-4' />
                  More
                </MenuBarTrigger>
                <MenuBarContent variant='glass' enforceAAA={demoState.aaaMode}>
                  <MenuBarItem>Advanced Options</MenuBarItem>
                  <MenuBarItem variant='destructive'>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Reset All Settings
                  </MenuBarItem>
                </MenuBarContent>
              </MenuBarMenu>
            </MenuBar>
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Size Variants
          </h2>
          <p className='text-foreground-muted'>
            Different sizes for various application contexts.
          </p>
        </div>

        <div className='space-y-4'>
          {/* Small Size */}
          <div className='rounded-lg border border-border'>
            <div className='bg-background-elevated p-3'>
              <h3 className='mb-2 text-sm font-medium text-foreground'>
                Small (Compact UI)
              </h3>
              <MenuBar size='sm' enforceAAA={demoState.aaaMode}>
                <MenuBarMenu>
                  <MenuBarTrigger size='sm' enforceAAA={demoState.aaaMode}>
                    File
                  </MenuBarTrigger>
                  <MenuBarContent size='sm' enforceAAA={demoState.aaaMode}>
                    <MenuBarItem size='sm'>New</MenuBarItem>
                    <MenuBarItem size='sm'>Open</MenuBarItem>
                  </MenuBarContent>
                </MenuBarMenu>
                <MenuBarMenu>
                  <MenuBarTrigger size='sm' enforceAAA={demoState.aaaMode}>
                    Edit
                  </MenuBarTrigger>
                  <MenuBarContent size='sm' enforceAAA={demoState.aaaMode}>
                    <MenuBarItem size='sm'>Copy</MenuBarItem>
                    <MenuBarItem size='sm'>Paste</MenuBarItem>
                  </MenuBarContent>
                </MenuBarMenu>
              </MenuBar>
            </div>
          </div>

          {/* Large Size */}
          <div className='rounded-lg border border-border'>
            <div className='bg-background-elevated p-3'>
              <h3 className='mb-2 text-sm font-medium text-foreground'>
                Large (Touch-Friendly)
              </h3>
              <MenuBar size='lg' enforceAAA={demoState.aaaMode}>
                <MenuBarMenu>
                  <MenuBarTrigger size='lg' enforceAAA={demoState.aaaMode}>
                    <File className='mr-2 h-5 w-5' />
                    File
                  </MenuBarTrigger>
                  <MenuBarContent size='lg' enforceAAA={demoState.aaaMode}>
                    <MenuBarItem size='lg'>
                      <Plus className='mr-2 h-5 w-5' />
                      New Document
                    </MenuBarItem>
                    <MenuBarItem size='lg'>
                      <FolderOpen className='mr-2 h-5 w-5' />
                      Open File
                    </MenuBarItem>
                  </MenuBarContent>
                </MenuBarMenu>
                <MenuBarMenu>
                  <MenuBarTrigger size='lg' enforceAAA={demoState.aaaMode}>
                    <Edit className='mr-2 h-5 w-5' />
                    Edit
                  </MenuBarTrigger>
                  <MenuBarContent size='lg' enforceAAA={demoState.aaaMode}>
                    <MenuBarItem size='lg'>
                      <Copy className='mr-2 h-5 w-5' />
                      Copy
                    </MenuBarItem>
                    <MenuBarItem size='lg'>Paste</MenuBarItem>
                  </MenuBarContent>
                </MenuBarMenu>
              </MenuBar>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Feature Showcase
          </h2>
          <p className='text-foreground-muted'>
            Advanced features including state management and complex
            interactions.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {/* Current State Display */}
          <div className='rounded-lg border border-border bg-background-elevated p-4'>
            <h3 className='mb-3 text-lg font-medium text-foreground'>
              Current State
            </h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-foreground-muted'>Auto Save:</span>
                <span className='text-foreground'>
                  {demoState.autoSave ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-foreground-muted'>View Mode:</span>
                <span className='capitalize text-foreground'>
                  {demoState.viewMode}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-foreground-muted'>Theme:</span>
                <span className='capitalize text-foreground'>
                  {demoState.theme}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-foreground-muted'>Sidebar:</span>
                <span className='text-foreground'>
                  {demoState.sidebarVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-foreground-muted'>AAA Mode:</span>
                <span className='text-foreground'>
                  {demoState.aaaMode ? 'Enforced' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className='rounded-lg border border-border bg-background-elevated p-4'>
            <h3 className='mb-3 text-lg font-medium text-foreground'>
              Keyboard Navigation
            </h3>
            <div className='space-y-2 text-sm text-foreground-muted'>
              <div>
                •{' '}
                <kbd className='rounded bg-muted px-1 py-0.5 text-xs'>Tab</kbd>{' '}
                - Navigate between menus
              </div>
              <div>
                •{' '}
                <kbd className='rounded bg-muted px-1 py-0.5 text-xs'>
                  Enter
                </kbd>{' '}
                - Open menu
              </div>
              <div>
                •{' '}
                <kbd className='rounded bg-muted px-1 py-0.5 text-xs'>
                  Arrow Keys
                </kbd>{' '}
                - Navigate items
              </div>
              <div>
                •{' '}
                <kbd className='rounded bg-muted px-1 py-0.5 text-xs'>
                  Escape
                </kbd>{' '}
                - Close menu
              </div>
              <div>
                • <kbd className='rounded bg-muted px-1 py-0.5 text-xs'>→</kbd>{' '}
                - Open submenu
              </div>
              <div>
                • <kbd className='rounded bg-muted px-1 py-0.5 text-xs'>←</kbd>{' '}
                - Close submenu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Examples */}
      <section className='space-y-4'>
        <div>
          <h2 className='mb-2 text-2xl font-semibold text-foreground'>
            Implementation Examples
          </h2>
          <p className='text-foreground-muted'>
            Copy these code examples to implement MenuBar in your application.
          </p>
        </div>

        <div className='space-y-4'>
          {/* Basic Usage */}
          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Basic Menu Bar
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<MenuBar>
  <MenuBarMenu>
    <MenuBarTrigger>File</MenuBarTrigger>
    <MenuBarContent>
      <MenuBarItem>New <MenuBarShortcut>⌘N</MenuBarShortcut></MenuBarItem>
      <MenuBarItem>Open <MenuBarShortcut>⌘O</MenuBarShortcut></MenuBarItem>
      <MenuBarSeparator />
      <MenuBarItem>Save <MenuBarShortcut>⌘S</MenuBarShortcut></MenuBarItem>
    </MenuBarContent>
  </MenuBarMenu>
</MenuBar>`}
              </pre>
            </div>
          </div>

          {/* Advanced Usage */}
          <div className='rounded-lg border border-border'>
            <div className='border-b border-border bg-background-elevated px-4 py-2'>
              <h3 className='text-sm font-medium text-foreground'>
                Advanced Features
              </h3>
            </div>
            <div className='p-4'>
              <pre className='overflow-x-auto text-sm text-foreground-muted'>
                {`<MenuBar variant="glass" enforceAAA={false}>
  <MenuBarMenu>
    <MenuBarTrigger>View</MenuBarTrigger>
    <MenuBarContent variant="glass">
      <MenuBarRadioGroup value={viewMode} onValueChange={setViewMode}>
        <MenuBarRadioItem value="list">List View</MenuBarRadioItem>
        <MenuBarRadioItem value="grid">Grid View</MenuBarRadioItem>
      </MenuBarRadioGroup>
      <MenuBarSeparator />
      <MenuBarCheckboxItem checked={autoSave} onCheckedChange={setAutoSave}>
        Auto Save
      </MenuBarCheckboxItem>
    </MenuBarContent>
  </MenuBarMenu>
</MenuBar>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuBarDemo;
