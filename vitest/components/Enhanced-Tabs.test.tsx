/**
 * Enhanced Tabs Component Tests - MAPS v2.2 Compliance Validation
 *
 * TESTING COVERAGE:
 * - Component rendering and structure
 * - Variant behaviors and styling
 * - Accessibility compliance (WCAG AAA)
 * - Keyboard navigation and focus management
 * - Apple HIG interaction patterns
 * - Dark-first philosophy validation
 * - AAA compliance mode functionality
 * - Factory pattern behaviors
 * - Motion respect for reduced motion preferences
 * - Touch target accessibility
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  EnhancedTabsRoot,
  EnhancedTabsList,
  EnhancedTabsTrigger,
  EnhancedTabsContent,
  TabsFactory,
} from '@/components/ui-enhanced/Tabs';

// Test utilities for MAPS v2.2 compliance
const mockReducedMotion = () => {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

type TabsVariant = 'default' | 'pills' | 'underline' | 'glass';

interface BasicTabsExampleProps {
  variant?: TabsVariant;
  aaaMode?: boolean;
  [key: string]: unknown;
}

const BasicTabsExample = ({
  variant = 'default',
  aaaMode = false,
  ...props
}: BasicTabsExampleProps) => (
  <EnhancedTabsRoot defaultValue='tab1' aaaMode={aaaMode} {...props}>
    <EnhancedTabsList variant={variant} aaaMode={aaaMode}>
      <EnhancedTabsTrigger value='tab1' variant={variant} aaaMode={aaaMode}>
        Tab 1
      </EnhancedTabsTrigger>
      <EnhancedTabsTrigger value='tab2' variant={variant} aaaMode={aaaMode}>
        Tab 2
      </EnhancedTabsTrigger>
      <EnhancedTabsTrigger
        value='tab3'
        variant={variant}
        aaaMode={aaaMode}
        disabled
      >
        Tab 3 (Disabled)
      </EnhancedTabsTrigger>
    </EnhancedTabsList>
    <EnhancedTabsContent value='tab1' variant={variant} aaaMode={aaaMode}>
      <h3>Content for Tab 1</h3>
      <p>This is the content for the first tab.</p>
    </EnhancedTabsContent>
    <EnhancedTabsContent value='tab2' variant={variant} aaaMode={aaaMode}>
      <h3>Content for Tab 2</h3>
      <p>This is the content for the second tab.</p>
    </EnhancedTabsContent>
    <EnhancedTabsContent value='tab3' variant={variant} aaaMode={aaaMode}>
      <h3>Content for Tab 3</h3>
      <p>This is the content for the third tab.</p>
    </EnhancedTabsContent>
  </EnhancedTabsRoot>
);

describe('Enhanced Tabs - MAPS v2.2 Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering and Structure', () => {
    it('renders tabs with proper semantic structure', () => {
      render(<BasicTabsExample />);

      // Verify root structure
      const tabsRoot = screen
        .getByRole('tablist')
        .closest('[role="tablist"]')?.parentElement;
      expect(tabsRoot).toBeInTheDocument();

      // Verify tablist
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveClass('inline-flex', 'shrink-0');

      // Verify tabs
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      expect(tabs[0]).toHaveTextContent('Tab 1');
      expect(tabs[1]).toHaveTextContent('Tab 2');
      expect(tabs[2]).toHaveTextContent('Tab 3 (Disabled)');

      // Verify content panels
      const panels = screen.getAllByRole('tabpanel');
      expect(panels).toHaveLength(1); // Only active panel should be visible
      expect(panels[0]).toHaveTextContent('Content for Tab 1');
    });

    it('applies default MAPS v2.2 styling correctly', () => {
      render(<BasicTabsExample />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'inline-flex',
        'shrink-0',
        'rounded-lg',
        'bg-muted/30',
        'backdrop-blur-sm',
        'border',
        'border-border/50',
        'p-1',
        'shadow-sm'
      );

      const firstTab = screen.getAllByRole('tab')[0];
      expect(firstTab).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'whitespace-nowrap',
        'rounded-md',
        'text-sm',
        'font-medium',
        'cursor-pointer',
        'select-none',
        'min-h-[2.75rem]',
        'px-3',
        'py-1.5',
        'transition-all',
        'duration-200',
        'ease-out'
      );
    });

    it('has proper accessibility attributes', () => {
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');
      const tablist = screen.getByRole('tablist');

      // Verify tablist attributes
      expect(tablist).toBeInTheDocument();

      // Verify tab attributes
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-disabled', 'true');

      // Verify tab controls relationship
      expect(tabs[0]).toHaveAttribute('aria-controls');
      expect(tabs[1]).toHaveAttribute('aria-controls');

      // Verify content panel is labeled by active tab
      const activePanel = screen.getByRole('tabpanel');
      const activePanelId = activePanel.getAttribute('id');
      expect(tabs[0]).toHaveAttribute('aria-controls', activePanelId);
    });
  });

  describe('Variant Behaviors', () => {
    it('renders pills variant correctly', () => {
      render(<BasicTabsExample variant='pills' />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'bg-transparent',
        'border-0',
        'shadow-none',
        'gap-2',
        'p-0'
      );

      const firstTab = screen.getAllByRole('tab')[0];
      expect(firstTab).toHaveClass('rounded-full');
    });

    it('renders underline variant correctly', () => {
      render(<BasicTabsExample variant='underline' />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'bg-transparent',
        'border-0',
        'border-b',
        'border-border',
        'rounded-none',
        'shadow-none',
        'p-0',
        'pb-0'
      );

      const firstTab = screen.getAllByRole('tab')[0];
      expect(firstTab).toHaveClass(
        'rounded-none',
        'border-b-2',
        'border-transparent'
      );
    });

    it('renders glass variant correctly', () => {
      render(<BasicTabsExample variant='glass' />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'backdrop-blur-md',
        'backdrop-saturate-[135%]',
        'bg-background-elevated/60',
        'border-border/30',
        'shadow-elevation-md'
      );
    });

    it('supports size variants correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList size='sm'>
            <EnhancedTabsTrigger value='tab1' size='sm'>
              Small Tab
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1'>Content</EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('text-sm', 'gap-1');

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-xs', 'min-h-[2.25rem]', 'px-2', 'py-1');
    });

    it('supports density variants correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1' density='compact'>
          <EnhancedTabsList density='compact'>
            <EnhancedTabsTrigger value='tab1' density='compact'>
              Compact Tab
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1'>Content</EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('p-0.5');

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('min-h-[2.25rem]', 'px-2', 'py-1');
    });
  });

  describe('Interactive Behavior', () => {
    it('handles tab switching correctly', async () => {
      const user = userEvent.setup();
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');

      // Initially, first tab should be active
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();

      // Click second tab
      const secondTab = tabs[1];
      if (secondTab) {
        await user.click(secondTab);
      }

      // Second tab should now be active
      await waitFor(() => {
        expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });

      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
    });

    it('respects disabled state', async () => {
      const user = userEvent.setup();
      render(<BasicTabsExample />);

      const disabledTab = screen.getAllByRole('tab')[2];
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');

      // Try to click disabled tab
      if (disabledTab) {
        await user.click(disabledTab);
      }

      // Should remain on first tab
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');

      // Focus first tab
      if (tabs[0]) {
        tabs[0].focus();
      }

      // Navigate with arrow keys
      await user.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(tabs[1]).toHaveFocus();
      });

      // Activate with Enter
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      });

      // Navigate with arrow keys (should skip disabled tab)
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowRight}'); // Should wrap around to first tab

      await waitFor(() => {
        expect(tabs[0]).toHaveFocus();
      });
    });

    it('handles vertical orientation', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1' orientation='vertical'>
          <EnhancedTabsList orientation='vertical'>
            <EnhancedTabsTrigger value='tab1'>Tab 1</EnhancedTabsTrigger>
            <EnhancedTabsTrigger value='tab2'>Tab 2</EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1'>Content 1</EnhancedTabsContent>
          <EnhancedTabsContent value='tab2'>Content 2</EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const root = screen.getByRole('tablist').closest('div');
      expect(root).toHaveClass('flex-row');

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('flex-col', 'items-stretch', 'w-auto');
    });
  });

  describe('AAA Compliance Mode', () => {
    it('applies AAA styling when enabled', () => {
      render(<BasicTabsExample aaaMode={true} />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'bg-background',
        'border-2',
        'border-foreground/20',
        'shadow-lg',
        'focus-visible:ring-4',
        'focus-visible:ring-foreground'
      );

      const firstTab = screen.getAllByRole('tab')[0];
      expect(firstTab).toHaveClass(
        'text-foreground',
        'border-2',
        'border-foreground/20',
        'focus-visible:ring-4',
        'focus-visible:ring-foreground',
        'shadow-lg'
      );
    });

    it('maintains functionality in AAA mode', async () => {
      const user = userEvent.setup();
      render(<BasicTabsExample aaaMode={true} />);

      const tabs = screen.getAllByRole('tab');

      // Tab switching should still work
      const secondTab = tabs[1];
      if (secondTab) {
        await user.click(secondTab);
      }

      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      });
    });
  });

  describe('Factory Pattern', () => {
    it('creates default tabs correctly', () => {
      render(
        <TabsFactory.default.Root defaultValue='tab1'>
          <TabsFactory.default.List>
            <TabsFactory.default.Trigger value='tab1'>
              Default Tab
            </TabsFactory.default.Trigger>
          </TabsFactory.default.List>
          <TabsFactory.default.Content value='tab1'>
            Default Content
          </TabsFactory.default.Content>
        </TabsFactory.default.Root>
      );

      expect(screen.getByText('Default Tab')).toBeInTheDocument();
      expect(screen.getByText('Default Content')).toBeInTheDocument();
    });

    it('creates pills variant correctly', () => {
      render(
        <TabsFactory.pills.Root defaultValue='tab1'>
          <TabsFactory.pills.List>
            <TabsFactory.pills.Trigger value='tab1'>
              Pills Tab
            </TabsFactory.pills.Trigger>
          </TabsFactory.pills.List>
          <TabsFactory.pills.Content value='tab1'>
            Pills Content
          </TabsFactory.pills.Content>
        </TabsFactory.pills.Root>
      );

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('rounded-full');
    });

    it('creates AAA compliant tabs correctly', () => {
      render(
        <TabsFactory.aaa.Root defaultValue='tab1'>
          <TabsFactory.aaa.List>
            <TabsFactory.aaa.Trigger value='tab1'>
              AAA Tab
            </TabsFactory.aaa.Trigger>
          </TabsFactory.aaa.List>
          <TabsFactory.aaa.Content value='tab1'>
            AAA Content
          </TabsFactory.aaa.Content>
        </TabsFactory.aaa.Root>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass(
        'bg-background',
        'border-2',
        'border-foreground/20'
      );
    });

    it('creates compact variant correctly', () => {
      render(
        <TabsFactory.compact.Root defaultValue='tab1'>
          <TabsFactory.compact.List>
            <TabsFactory.compact.Trigger value='tab1'>
              Compact Tab
            </TabsFactory.compact.Trigger>
          </TabsFactory.compact.List>
          <TabsFactory.compact.Content value='tab1'>
            Compact Content
          </TabsFactory.compact.Content>
        </TabsFactory.compact.Root>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('p-0.5');

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('min-h-[2.25rem]', 'px-2', 'py-1');
    });
  });

  describe('Motion and Performance', () => {
    it('respects reduced motion preferences', () => {
      mockReducedMotion();
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveClass('motion-reduce:transition-none');
      }

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('motion-reduce:transition-none');
    });

    it('applies proper transition classes', () => {
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveClass('transition-all', 'duration-200', 'ease-out');
      }

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass('transition-all', 'duration-200', 'ease-out');
    });
  });

  describe('Touch and Interaction Targets', () => {
    it('meets minimum touch target requirements', () => {
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveClass('min-h-[2.75rem]'); // 44px minimum
      }
    });

    it('applies proper focus management', () => {
      render(<BasicTabsExample />);

      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveClass(
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-accent',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background'
        );
      }
    });
  });

  describe('Content Surface Variants', () => {
    it('renders card surface correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList>
            <EnhancedTabsTrigger value='tab1'>Tab 1</EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1' surface='card'>
            Card Content
          </EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass(
        'rounded-lg',
        'border',
        'border-border',
        'bg-card',
        'shadow-sm'
      );
    });

    it('renders elevated surface correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList>
            <EnhancedTabsTrigger value='tab1'>Tab 1</EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1' surface='elevated'>
            Elevated Content
          </EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass(
        'rounded-lg',
        'border',
        'border-border',
        'bg-background-elevated',
        'shadow-md'
      );
    });

    it('renders glass surface correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList>
            <EnhancedTabsTrigger value='tab1'>Tab 1</EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1' surface='glass'>
            Glass Content
          </EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const content = screen.getByRole('tabpanel');
      expect(content).toHaveClass(
        'rounded-lg',
        'border',
        'border-border/30',
        'bg-background/60',
        'backdrop-blur-md',
        'backdrop-saturate-[135%]',
        'shadow-elevation-md'
      );
    });
  });

  describe('Feedback Variants', () => {
    it('renders success feedback correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList>
            <EnhancedTabsTrigger value='tab1' feedback='success'>
              Success Tab
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1'>Content</EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass(
        'data-[state=active]:bg-success',
        'data-[state=active]:text-success-foreground',
        'data-[state=active]:shadow-success/20'
      );
    });

    it('renders warning feedback correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList>
            <EnhancedTabsTrigger value='tab1' feedback='warning'>
              Warning Tab
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1'>Content</EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass(
        'data-[state=active]:bg-warning',
        'data-[state=active]:text-warning-foreground',
        'data-[state=active]:shadow-warning/20'
      );
    });

    it('renders destructive feedback correctly', () => {
      render(
        <EnhancedTabsRoot defaultValue='tab1'>
          <EnhancedTabsList>
            <EnhancedTabsTrigger value='tab1' feedback='destructive'>
              Destructive Tab
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          <EnhancedTabsContent value='tab1'>Content</EnhancedTabsContent>
        </EnhancedTabsRoot>
      );

      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass(
        'data-[state=active]:bg-destructive',
        'data-[state=active]:text-destructive-foreground',
        'data-[state=active]:shadow-destructive/20'
      );
    });
  });
});
