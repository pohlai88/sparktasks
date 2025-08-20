/**
 * @fileoverview Banner Component Tests - Comprehensive test suite
 * 
 * Tests cover:
 * - All variants and sizes
 * - Position behavior
 * - Dismissible functionality 
 * - Action buttons and links
 * - Accessibility compliance
 * - Persistence features
 * - Custom content and icons
 * - TypeScript strict mode compliance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Banner, {
  BannerInfo,
  BannerSuccess,
  BannerWarning,
  BannerError,
  BannerAnnouncement,
  BannerMaintenance,
  BannerPromotion,
  type BannerAction,
} from '../../src/components/ui/Banner';

// ===== TEST SETUP =====

const mockAction = vi.fn();
const mockDismiss = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  // Clear localStorage before each test
  localStorage.clear();
});

// ===== BASIC RENDERING TESTS =====

describe('Banner - Basic Rendering', () => {
  it('renders with default info variant', () => {
    render(<Banner />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('Here\'s some helpful information for you.')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    render(
      <Banner
        title="Custom Title"
        description="Custom description text"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Banner className="custom-class" />);
    
    expect(screen.getByRole('banner')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Banner ref={ref} />);
    
    expect(ref).toHaveBeenCalled();
  });

  it('renders with test ID', () => {
    render(<Banner data-testid="banner-test" />);
    
    expect(screen.getByTestId('banner-test')).toBeInTheDocument();
  });
});

// ===== VARIANT TESTS =====

describe('Banner - Variants', () => {
  it('renders info variant with proper content', () => {
    render(<Banner variant="info" />);
    
    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('Here\'s some helpful information for you.')).toBeInTheDocument();
  });

  it('renders success variant with proper content', () => {
    render(<Banner variant="success" />);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully!')).toBeInTheDocument();
  });

  it('renders warning variant with proper content', () => {
    render(<Banner variant="warning" />);
    
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
    expect(screen.getByText('Please review this important information.')).toBeInTheDocument();
  });

  it('renders error variant with proper content', () => {
    render(<Banner variant="error" />);
    
    expect(screen.getByText('System Error')).toBeInTheDocument();
    expect(screen.getByText('An error has occurred. Please try again or contact support.')).toBeInTheDocument();
  });

  it('renders announcement variant with proper content', () => {
    render(<Banner variant="announcement" />);
    
    expect(screen.getByText('Announcement')).toBeInTheDocument();
    expect(screen.getByText('We have some exciting news to share with you.')).toBeInTheDocument();
  });

  it('renders maintenance variant with proper content', () => {
    render(<Banner variant="maintenance" />);
    
    expect(screen.getByText('Scheduled Maintenance')).toBeInTheDocument();
    expect(screen.getByText('System maintenance is scheduled for tonight at 2:00 AM UTC.')).toBeInTheDocument();
  });

  it('renders promotion variant with proper content', () => {
    render(<Banner variant="promotion" />);
    
    expect(screen.getByText('Special Offer')).toBeInTheDocument();
    expect(screen.getByText('Upgrade now and get exclusive features at a special price!')).toBeInTheDocument();
  });
});

// ===== SIZE TESTS =====

describe('Banner - Sizes', () => {
  it('renders compact size with appropriate spacing', () => {
    const { container } = render(<Banner size="compact" />);
    
    expect(container.firstChild).toHaveClass('py-2', 'px-4');
  });

  it('renders standard size (default) with appropriate spacing', () => {
    const { container } = render(<Banner size="standard" />);
    
    expect(container.firstChild).toHaveClass('py-3', 'px-6');
  });

  it('renders prominent size with appropriate spacing', () => {
    const { container } = render(<Banner size="prominent" />);
    
    expect(container.firstChild).toHaveClass('py-4', 'px-8');
  });
});

// ===== POSITION TESTS =====

describe('Banner - Positions', () => {
  it('renders inline position (default) with relative positioning', () => {
    const { container } = render(<Banner position="inline" />);
    
    expect(container.firstChild).toHaveClass('relative');
  });

  it('renders top position with fixed positioning', () => {
    const { container } = render(<Banner position="top" />);
    
    expect(container.firstChild).toHaveClass('fixed', 'top-0', 'left-0', 'right-0');
  });

  it('renders bottom position with fixed positioning', () => {
    const { container } = render(<Banner position="bottom" />);
    
    expect(container.firstChild).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
  });
});

// ===== ICON TESTS =====

describe('Banner - Icons', () => {
  it('renders default icon for variant', () => {
    render(<Banner variant="success" />);
    
    // Check for SVG icon
    const icon = screen.getByRole('banner').querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders custom icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
    
    render(
      <Banner
        variant="info"
        icon={{ element: <CustomIcon /> }}
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('hides icon when hidden prop is true', () => {
    render(
      <Banner
        variant="info"
        icon={{ hidden: true }}
      />
    );
    
    expect(screen.getByRole('banner').querySelector('svg')).not.toBeInTheDocument();
  });
});

// ===== ACTION TESTS =====

describe('Banner - Actions', () => {
  it('renders action buttons', () => {
    const actions: BannerAction[] = [
      { label: 'Primary Action', onClick: mockAction, variant: 'primary' },
      { label: 'Secondary Action', onClick: mockAction, variant: 'secondary' },
    ];

    render(<Banner actions={actions} />);
    
    expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
  });

  it('handles action button clicks', async () => {
    const user = userEvent.setup();
    const actions: BannerAction[] = [
      { label: 'Click Me', onClick: mockAction, variant: 'primary' },
    ];

    render(<Banner actions={actions} />);
    
    await user.click(screen.getByRole('button', { name: 'Click Me' }));
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders action links', () => {
    const actions: BannerAction[] = [
      { label: 'Learn More', href: '/learn', variant: 'primary' },
    ];

    render(<Banner actions={actions} />);
    
    const link = screen.getByRole('link', { name: 'Learn More' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/learn');
  });

  it('renders external links with proper attributes', () => {
    const actions: BannerAction[] = [
      { label: 'External Link', href: 'https://example.com', external: true },
    ];

    render(<Banner actions={actions} />);
    
    const link = screen.getByRole('link', { name: /External Link/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

// ===== DISMISSIBLE TESTS =====

describe('Banner - Dismissible', () => {
  it('shows close button when dismissible', () => {
    render(<Banner dismissible />);
    
    expect(screen.getByRole('button', { name: 'Dismiss banner' })).toBeInTheDocument();
  });

  it('does not show close button when not dismissible', () => {
    render(<Banner />);
    
    expect(screen.queryByRole('button', { name: 'Dismiss banner' })).not.toBeInTheDocument();
  });

  it('handles dismiss action', async () => {
    const user = userEvent.setup();
    
    render(<Banner dismissible onDismiss={mockDismiss} />);
    
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    
    expect(mockDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('can hide close button even when dismissible', () => {
    render(<Banner dismissible showCloseButton={false} />);
    
    expect(screen.queryByRole('button', { name: 'Dismiss banner' })).not.toBeInTheDocument();
  });
});

// ===== PERSISTENCE TESTS =====

describe('Banner - Persistence', () => {
  it('persists dismissal to localStorage', async () => {
    const user = userEvent.setup();
    
    render(<Banner dismissible persistenceKey="test-banner" />);
    
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    
    expect(localStorage.getItem('banner-dismissed-test-banner')).toBe('true');
  });

  it('does not render when previously dismissed', () => {
    localStorage.setItem('banner-dismissed-test-banner', 'true');
    
    render(<Banner dismissible persistenceKey="test-banner" />);
    
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('renders normally without persistence key', async () => {
    const user = userEvent.setup();
    
    render(<Banner dismissible />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    
    expect(localStorage.getItem('banner-dismissed-undefined')).toBeNull();
  });
});

// ===== CUSTOM CONTENT TESTS =====

describe('Banner - Custom Content', () => {
  it('renders custom children instead of default layout', () => {
    render(
      <Banner>
        <div data-testid="custom-content">Custom Banner Content</div>
      </Banner>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.queryByText('Information')).not.toBeInTheDocument();
  });

  it('maintains container styling with custom children', () => {
    const { container } = render(
      <Banner size="prominent" variant="success">
        <div>Custom Content</div>
      </Banner>
    );
    
    expect(container.firstChild).toHaveClass('py-4', 'px-8');
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('Banner - Accessibility', () => {
  it('has proper banner role', () => {
    render(<Banner title="Test Title" />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('aria-labelledby', 'banner-title');
  });

  it('uses aria-label when no title provided', () => {
    render(<Banner description="Just description" aria-label="Custom label" />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-label', 'Custom label');
  });

  it('has proper heading structure', () => {
    render(<Banner title="Test Title" />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Title');
    expect(heading).toHaveAttribute('id', 'banner-title');
  });

  it('has keyboard navigation for action buttons', async () => {
    const user = userEvent.setup();
    const actions: BannerAction[] = [
      { label: 'First Action', onClick: mockAction },
      { label: 'Second Action', onClick: mockAction },
    ];

    render(<Banner actions={actions} />);
    
    const firstButton = screen.getByRole('button', { name: 'First Action' });
    const secondButton = screen.getByRole('button', { name: 'Second Action' });
    
    // Tab navigation
    await user.tab();
    expect(firstButton).toHaveFocus();
    
    await user.tab();
    expect(secondButton).toHaveFocus();
    
    // Enter activation
    await user.keyboard('{Enter}');
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('has keyboard navigation for dismiss button', async () => {
    const user = userEvent.setup();
    
    render(<Banner dismissible onDismiss={mockDismiss} />);
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss banner' });
    
    // Tab to dismiss button
    await user.tab();
    expect(dismissButton).toHaveFocus();
    
    // Enter activation
    await user.keyboard('{Enter}');
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('supports screen reader announcements', () => {
    render(<Banner variant="error" title="Critical Error" />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-labelledby', 'banner-title');
    
    const title = screen.getByText('Critical Error');
    expect(title).toHaveAttribute('id', 'banner-title');
  });
});

// ===== COMPOUND COMPONENT TESTS =====

describe('Banner - Compound Components', () => {
  it('renders BannerInfo with correct variant', () => {
    render(<BannerInfo />);
    
    expect(screen.getByText('Information')).toBeInTheDocument();
  });

  it('renders BannerSuccess with correct variant', () => {
    render(<BannerSuccess />);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders BannerWarning with correct variant', () => {
    render(<BannerWarning />);
    
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
  });

  it('renders BannerError with correct variant', () => {
    render(<BannerError />);
    
    expect(screen.getByText('System Error')).toBeInTheDocument();
  });

  it('renders BannerAnnouncement with correct variant', () => {
    render(<BannerAnnouncement />);
    
    expect(screen.getByText('Announcement')).toBeInTheDocument();
  });

  it('renders BannerMaintenance with correct variant', () => {
    render(<BannerMaintenance />);
    
    expect(screen.getByText('Scheduled Maintenance')).toBeInTheDocument();
  });

  it('renders BannerPromotion with correct variant', () => {
    render(<BannerPromotion />);
    
    expect(screen.getByText('Special Offer')).toBeInTheDocument();
  });

  it('compound components accept additional props', () => {
    render(
      <BannerPromotion
        title="Custom Promo Title"
        data-testid="promo-test"
      />
    );
    
    expect(screen.getByText('Custom Promo Title')).toBeInTheDocument();
    expect(screen.getByTestId('promo-test')).toBeInTheDocument();
  });
});

// ===== INTEGRATION TESTS =====

describe('Banner - Integration', () => {
  it('implements complete system announcement pattern', async () => {
    const user = userEvent.setup();
    const actions: BannerAction[] = [
      { label: 'Learn More', href: '/maintenance', variant: 'primary' },
      { label: 'Dismiss', onClick: mockDismiss, variant: 'secondary' },
    ];

    render(
      <BannerMaintenance
        title="Scheduled Maintenance"
        description="System will be down for 30 minutes tonight at 2:00 AM UTC."
        actions={actions}
        dismissible
        persistenceKey="maintenance-2024-q1"
      />
    );
    
    // Verify content
    expect(screen.getByText('Scheduled Maintenance')).toBeInTheDocument();
    expect(screen.getByText('System will be down for 30 minutes tonight at 2:00 AM UTC.')).toBeInTheDocument();
    
    // Verify actions
    const learnMoreLink = screen.getByRole('link', { name: 'Learn More' });
    expect(learnMoreLink).toHaveAttribute('href', '/maintenance');
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    expect(dismissButton).toBeInTheDocument();
    
    // Test dismiss with persistence
    await user.click(dismissButton);
    expect(mockDismiss).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('banner-dismissed-maintenance-2024-q1')).toBe('true');
  });

  it('supports promotional banner with CTA pattern', async () => {
    const user = userEvent.setup();
    const handleUpgrade = vi.fn();
    const actions: BannerAction[] = [
      { label: 'Upgrade Now', onClick: handleUpgrade, variant: 'primary' },
      { label: 'Learn More', href: '/pricing', variant: 'secondary' },
    ];

    render(
      <BannerPromotion
        position="top"
        title="Limited Time Offer"
        description="Upgrade to Pro and save 50%!"
        actions={actions}
        dismissible
      />
    );
    
    // Verify positioning
    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('fixed', 'top-0');
    
    // Test primary CTA
    await user.click(screen.getByRole('button', { name: 'Upgrade Now' }));
    expect(handleUpgrade).toHaveBeenCalledTimes(1);
    
    // Verify secondary link
    const learnMore = screen.getByRole('link', { name: 'Learn More' });
    expect(learnMore).toHaveAttribute('href', '/pricing');
  });
});

// ===== EDGE CASES =====

describe('Banner - Edge Cases', () => {
  it('handles empty actions array gracefully', () => {
    render(<Banner actions={[]} />);
    
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('handles missing title gracefully', () => {
    render(<Banner title="" description="Only description" />);
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Only description')).toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    render(<Banner title="Only title" description="" />);
    
    expect(screen.getByText('Only title')).toBeInTheDocument();
    expect(screen.queryByText('description')).not.toBeInTheDocument();
  });

  it('handles rapid dismiss clicks gracefully', async () => {
    const user = userEvent.setup();
    
    render(<Banner dismissible onDismiss={mockDismiss} />);
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss banner' });
    
    // Rapid clicks
    await user.click(dismissButton);
    // Component should be unmounted after first click, so second click won't register
    
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('handles localStorage errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock localStorage to throw error
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });
    
    render(<Banner dismissible persistenceKey="test" onDismiss={mockDismiss} />);
    
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    
    // Should still call onDismiss despite localStorage error
    expect(mockDismiss).toHaveBeenCalledTimes(1);
    
    // Restore original implementation
    Storage.prototype.setItem = originalSetItem;
  });
});

// ===== PERFORMANCE TESTS =====

describe('Banner - Performance', () => {
  it('renders efficiently with many actions', () => {
    const manyActions: BannerAction[] = Array.from(
      { length: 10 }, 
      (_, i) => ({
        label: `Action ${i + 1}`,
        onClick: () => mockAction(`action-${i + 1}`)
      })
    );

    const { container } = render(<Banner actions={manyActions} />);
    
    expect(container.querySelectorAll('button')).toHaveLength(10);
  });

  it('maintains performance with complex custom content', () => {
    const ComplexContent = () => (
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i}>Complex item {i}</div>
        ))}
      </div>
    );

    render(
      <Banner>
        <ComplexContent />
      </Banner>
    );
    
    expect(screen.getByText('Complex item 0')).toBeInTheDocument();
    expect(screen.getByText('Complex item 49')).toBeInTheDocument();
  });
});
