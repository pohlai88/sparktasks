/**
 * Enhanced Navigation Menu Tests - MAPS v2.2 Dark-First Philosophy
 *
 * COMPLIANCE MATRIX:
 * - Component Testing: ✅ Behavior, accessibility, variants
 * - MAPS Architecture: ✅ Token usage, AAA compliance, liquid glass
 * - Radix Integration: ✅ Proper ARIA, keyboard navigation, focus management
 * - Anti-Drift: ✅ No hardcoded values, systematic validation
 *
 * TEST COVERAGE:
 * - Basic rendering and structure
 * - Variant combinations (vibrancy, size, orientation)
 * - Interactive behavior (hover, focus, keyboard navigation)
 * - AAA compliance enforcement
 * - Accessibility attributes and ARIA compliance
 * - Platform-aware responsive behavior
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import {
  EnhancedNavigationMenu,
  EnhancedNavigationMenuList,
  EnhancedNavigationMenuItem,
  EnhancedNavigationMenuTrigger,
  EnhancedNavigationMenuContent,
  EnhancedNavigationMenuLink,
  EnhancedNavigationMenuIndicator,
} from '@/components/ui-enhanced/NavigationMenu';

// ===== MOCK COMPONENTS FOR TESTING =====

const TestNavigationMenu = ({
  orientation = 'horizontal',
  vibrancy = 'none',
  size = 'md',
  enforceAAA = false,
}: {
  orientation?: 'horizontal' | 'vertical';
  vibrancy?: 'none' | 'glass' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  enforceAAA?: boolean;
}) => (
  <EnhancedNavigationMenu
    orientation={orientation}
    vibrancy={vibrancy}
    size={size}
    enforceAAA={enforceAAA}
    data-testid='navigation-menu'
  >
    <EnhancedNavigationMenuList orientation={orientation}>
      <EnhancedNavigationMenuItem>
        <EnhancedNavigationMenuTrigger data-testid='nav-trigger-products'>
          Products
        </EnhancedNavigationMenuTrigger>
        <EnhancedNavigationMenuContent data-testid='nav-content-products'>
          <div className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <div className='row-span-3'>
              <EnhancedNavigationMenuLink
                href='/products/overview'
                variant='accent'
                data-testid='nav-link-overview'
              >
                <div className='mb-2 mt-4 text-lg font-medium'>
                  Product Overview
                </div>
                <p className='text-sm leading-tight text-muted-foreground'>
                  Discover our complete product suite designed for modern teams.
                </p>
              </EnhancedNavigationMenuLink>
            </div>
            <EnhancedNavigationMenuLink
              href='/products/analytics'
              data-testid='nav-link-analytics'
            >
              Analytics Platform
            </EnhancedNavigationMenuLink>
            <EnhancedNavigationMenuLink
              href='/products/automation'
              data-testid='nav-link-automation'
            >
              Automation Tools
            </EnhancedNavigationMenuLink>
            <EnhancedNavigationMenuLink
              href='/products/integrations'
              data-testid='nav-link-integrations'
            >
              Integrations
            </EnhancedNavigationMenuLink>
          </div>
        </EnhancedNavigationMenuContent>
      </EnhancedNavigationMenuItem>

      <EnhancedNavigationMenuItem>
        <EnhancedNavigationMenuTrigger data-testid='nav-trigger-solutions'>
          Solutions
        </EnhancedNavigationMenuTrigger>
        <EnhancedNavigationMenuContent data-testid='nav-content-solutions'>
          <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-2'>
            <li className='row-span-3'>
              <EnhancedNavigationMenuLink
                href='/solutions/enterprise'
                variant='accent'
                active={true}
                data-testid='nav-link-enterprise'
              >
                <div className='mb-2 mt-4 text-lg font-medium'>
                  Enterprise Solutions
                </div>
                <p className='text-sm leading-tight text-muted-foreground'>
                  Scalable solutions built for enterprise-grade requirements.
                </p>
              </EnhancedNavigationMenuLink>
            </li>
            <li>
              <EnhancedNavigationMenuLink
                href='/solutions/startups'
                data-testid='nav-link-startups'
              >
                For Startups
              </EnhancedNavigationMenuLink>
            </li>
            <li>
              <EnhancedNavigationMenuLink
                href='/solutions/agencies'
                data-testid='nav-link-agencies'
              >
                For Agencies
              </EnhancedNavigationMenuLink>
            </li>
          </ul>
        </EnhancedNavigationMenuContent>
      </EnhancedNavigationMenuItem>

      <EnhancedNavigationMenuItem>
        <EnhancedNavigationMenuLink
          href='/pricing'
          data-testid='nav-link-pricing'
        >
          Pricing
        </EnhancedNavigationMenuLink>
      </EnhancedNavigationMenuItem>

      <EnhancedNavigationMenuItem>
        <EnhancedNavigationMenuLink
          href='/contact'
          variant='subtle'
          data-testid='nav-link-contact'
        >
          Contact
        </EnhancedNavigationMenuLink>
      </EnhancedNavigationMenuItem>
    </EnhancedNavigationMenuList>

    <EnhancedNavigationMenuIndicator />
  </EnhancedNavigationMenu>
);

// ===== COMPONENT RENDERING TESTS =====

describe('EnhancedNavigationMenu - Component Rendering', () => {
  it('renders navigation menu with basic structure', () => {
    render(<TestNavigationMenu />);

    expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
    expect(screen.getByTestId('nav-trigger-products')).toBeInTheDocument();
    expect(screen.getByTestId('nav-trigger-solutions')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-pricing')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-contact')).toBeInTheDocument();
  });

  it('applies correct MAPS foundation classes', () => {
    render(<TestNavigationMenu />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('relative', 'z-10', 'flex', 'max-w-max');
  });

  it('renders with horizontal orientation by default', () => {
    render(<TestNavigationMenu />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('flex-row');
  });

  it('renders with vertical orientation when specified', () => {
    render(<TestNavigationMenu orientation='vertical' />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('flex-col', 'items-start');
  });
});

// ===== VARIANT TESTING =====

describe('EnhancedNavigationMenu - Variant Testing', () => {
  it('applies glass vibrancy variant correctly', () => {
    render(<TestNavigationMenu vibrancy='glass' />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass(
      'bg-background/80',
      'backdrop-blur-md',
      'backdrop-saturate-150'
    );
  });

  it('applies floating vibrancy variant correctly', () => {
    render(<TestNavigationMenu vibrancy='floating' />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass(
      'bg-background/75',
      'backdrop-blur-lg',
      'shadow-elevation-high'
    );
  });

  it('applies small size variant correctly', () => {
    render(<TestNavigationMenu size='sm' />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('gap-1', 'px-2', 'py-1');
  });

  it('applies large size variant correctly', () => {
    render(<TestNavigationMenu size='lg' />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('gap-3', 'px-4', 'py-2');
  });
});

// ===== AAA COMPLIANCE TESTING =====

describe('EnhancedNavigationMenu - AAA Compliance', () => {
  it('applies AAA enforcement when enabled', () => {
    render(<TestNavigationMenu enforceAAA={true} />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveAttribute('data-aaa', 'true');
    expect(menu).toHaveClass('bg-background', 'border-border');
  });

  it('does not apply AAA enforcement by default', () => {
    render(<TestNavigationMenu />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveAttribute('data-aaa', 'false');
  });

  it('maintains accessibility attributes on interactive elements', () => {
    render(<TestNavigationMenu />);

    const trigger = screen.getByTestId('nav-trigger-products');
    expect(trigger).toHaveAttribute('aria-expanded');
    expect(trigger).toHaveAttribute('data-state');
  });
});

// ===== INTERACTION TESTING =====

describe('EnhancedNavigationMenu - Interactive Behavior', () => {
  it('opens dropdown content on trigger click', async () => {
    const user = userEvent.setup();
    render(<TestNavigationMenu />);

    const trigger = screen.getByTestId('nav-trigger-products');

    await user.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });
  });

  it('opens dropdown content on trigger hover', async () => {
    render(<TestNavigationMenu />);

    const trigger = screen.getByTestId('nav-trigger-products');

    fireEvent.mouseEnter(trigger);

    await waitFor(
      () => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      },
      { timeout: 1000 }
    );
  });

  it('navigates to href on link click', () => {
    render(<TestNavigationMenu />);

    const link = screen.getByTestId('nav-link-pricing');
    expect(link).toHaveAttribute('href', '/pricing');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TestNavigationMenu />);

    const trigger = screen.getByTestId('nav-trigger-products');

    // Focus on trigger
    await user.tab();
    expect(trigger).toHaveFocus();

    // Open with Enter key
    await user.keyboard('[Enter]');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });
});

// ===== NAVIGATION MENU TRIGGER TESTING =====

describe('EnhancedNavigationMenuTrigger - Component Behavior', () => {
  it('applies correct size variants', () => {
    render(
      <EnhancedNavigationMenu>
        <EnhancedNavigationMenuList>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuTrigger size='sm' data-testid='trigger-sm'>
              Small
            </EnhancedNavigationMenuTrigger>
          </EnhancedNavigationMenuItem>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuTrigger size='lg' data-testid='trigger-lg'>
              Large
            </EnhancedNavigationMenuTrigger>
          </EnhancedNavigationMenuItem>
        </EnhancedNavigationMenuList>
      </EnhancedNavigationMenu>
    );

    expect(screen.getByTestId('trigger-sm')).toHaveClass(
      'h-9',
      'px-3',
      'text-xs'
    );
    expect(screen.getByTestId('trigger-lg')).toHaveClass(
      'h-12',
      'px-6',
      'text-base'
    );
  });

  it('applies correct variant styles', () => {
    render(
      <EnhancedNavigationMenu>
        <EnhancedNavigationMenuList>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuTrigger
              variant='subtle'
              data-testid='trigger-subtle'
            >
              Subtle
            </EnhancedNavigationMenuTrigger>
          </EnhancedNavigationMenuItem>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuTrigger
              variant='accent'
              data-testid='trigger-accent'
            >
              Accent
            </EnhancedNavigationMenuTrigger>
          </EnhancedNavigationMenuItem>
        </EnhancedNavigationMenuList>
      </EnhancedNavigationMenu>
    );

    expect(screen.getByTestId('trigger-subtle')).toHaveClass(
      'text-muted-foreground'
    );
    expect(screen.getByTestId('trigger-accent')).toHaveClass('text-accent');
  });

  it('shows indicator chevron by default', () => {
    render(
      <EnhancedNavigationMenu>
        <EnhancedNavigationMenuList>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuTrigger data-testid='trigger-with-indicator'>
              With Indicator
            </EnhancedNavigationMenuTrigger>
          </EnhancedNavigationMenuItem>
        </EnhancedNavigationMenuList>
      </EnhancedNavigationMenu>
    );

    const trigger = screen.getByTestId('trigger-with-indicator');
    const chevron = trigger.querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('hides indicator when showIndicator is false', () => {
    render(
      <EnhancedNavigationMenu>
        <EnhancedNavigationMenuList>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuTrigger
              showIndicator={false}
              data-testid='trigger-no-indicator'
            >
              No Indicator
            </EnhancedNavigationMenuTrigger>
          </EnhancedNavigationMenuItem>
        </EnhancedNavigationMenuList>
      </EnhancedNavigationMenu>
    );

    const trigger = screen.getByTestId('trigger-no-indicator');
    const chevron = trigger.querySelector('svg');
    expect(chevron).not.toBeInTheDocument();
  });
});

// ===== NAVIGATION MENU LINK TESTING =====

describe('EnhancedNavigationMenuLink - Component Behavior', () => {
  it('applies active state styling', () => {
    render(
      <EnhancedNavigationMenu>
        <EnhancedNavigationMenuList>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuContent>
              <EnhancedNavigationMenuLink
                active={true}
                data-testid='active-link'
              >
                Active Link
              </EnhancedNavigationMenuLink>
            </EnhancedNavigationMenuContent>
          </EnhancedNavigationMenuItem>
        </EnhancedNavigationMenuList>
      </EnhancedNavigationMenu>
    );

    expect(screen.getByTestId('active-link')).toHaveClass(
      'bg-muted',
      'text-foreground',
      'font-medium'
    );
  });

  it('applies variant styles correctly', () => {
    render(
      <EnhancedNavigationMenu>
        <EnhancedNavigationMenuList>
          <EnhancedNavigationMenuItem>
            <EnhancedNavigationMenuContent>
              <EnhancedNavigationMenuLink
                variant='subtle'
                data-testid='subtle-link'
              >
                Subtle Link
              </EnhancedNavigationMenuLink>
              <EnhancedNavigationMenuLink
                variant='accent'
                data-testid='accent-link'
              >
                Accent Link
              </EnhancedNavigationMenuLink>
            </EnhancedNavigationMenuContent>
          </EnhancedNavigationMenuItem>
        </EnhancedNavigationMenuList>
      </EnhancedNavigationMenu>
    );

    expect(screen.getByTestId('subtle-link')).toHaveClass(
      'text-muted-foreground'
    );
    expect(screen.getByTestId('accent-link')).toHaveClass('text-accent');
  });
});

// ===== ACCESSIBILITY TESTING =====

describe('EnhancedNavigationMenu - Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(<TestNavigationMenu />);

    const menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveAttribute('data-orientation', 'horizontal');

    const trigger = screen.getByTestId('nav-trigger-products');
    expect(trigger).toHaveAttribute('aria-expanded');
    expect(trigger).toHaveAttribute('aria-haspopup');
  });

  it('maintains focus management', async () => {
    const user = userEvent.setup();
    render(<TestNavigationMenu />);

    // Should be able to tab through navigation items
    await user.tab(); // Focus first trigger
    expect(screen.getByTestId('nav-trigger-products')).toHaveFocus();

    await user.tab(); // Focus second trigger
    expect(screen.getByTestId('nav-trigger-solutions')).toHaveFocus();

    await user.tab(); // Focus pricing link
    expect(screen.getByTestId('nav-link-pricing')).toHaveFocus();
  });

  it('supports Escape key to close dropdowns', async () => {
    const user = userEvent.setup();
    render(<TestNavigationMenu />);

    const trigger = screen.getByTestId('nav-trigger-products');

    // Open dropdown
    await user.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    // Close with Escape
    await user.keyboard('[Escape]');
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('provides proper screen reader support', () => {
    render(<TestNavigationMenu />);

    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toBeInTheDocument();
      // Each link should have accessible text
      expect(link).toHaveAccessibleName();
    }
  });
});

// ===== RESPONSIVE BEHAVIOR TESTING =====

describe('EnhancedNavigationMenu - Responsive Behavior', () => {
  it('applies platform-aware hit targets', () => {
    render(<TestNavigationMenu />);

    const trigger = screen.getByTestId('nav-trigger-products');
    expect(trigger).toHaveClass('min-h-[44px]'); // Touch-friendly minimum
  });

  it('handles orientation changes correctly', () => {
    const { rerender } = render(
      <TestNavigationMenu orientation='horizontal' />
    );

    let menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('flex-row');

    rerender(<TestNavigationMenu orientation='vertical' />);

    menu = screen.getByTestId('navigation-menu');
    expect(menu).toHaveClass('flex-col', 'items-start');
  });
});

// ===== COMPONENT INTEGRATION TESTING =====

describe('EnhancedNavigationMenu - Component Integration', () => {
  it('integrates properly with Radix primitives', () => {
    render(<TestNavigationMenu />);

    // Should have Radix data attributes
    const trigger = screen.getByTestId('nav-trigger-products');
    expect(trigger).toHaveAttribute('data-state');
    expect(trigger).toHaveAttribute('aria-expanded');
  });

  it('maintains MAPS design system compliance', () => {
    render(<TestNavigationMenu vibrancy='glass' enforceAAA={true} />);

    const menu = screen.getByTestId('navigation-menu');

    // Should have MAPS foundation classes
    expect(menu).toHaveClass('relative', 'z-10', 'flex');

    // Should have vibrancy classes
    expect(menu).toHaveClass('backdrop-blur-md', 'backdrop-saturate-150');

    // Should have AAA enforcement
    expect(menu).toHaveAttribute('data-aaa', 'true');
  });

  it('works with complex nested content', () => {
    render(<TestNavigationMenu />);

    // Should render nested content correctly
    expect(screen.getByTestId('nav-link-overview')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-enterprise')).toBeInTheDocument();
  });
});
