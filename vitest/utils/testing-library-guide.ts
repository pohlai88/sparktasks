/**
 * Testing Library Integration Guide - Simplifying MAPS v2.2 Component Testing
 *
 * TESTING LIBRARY POWER FEATURES:
 * ✅ User-Centric Testing - Test how users actually interact
 * ✅ Accessibility-First - Built-in a11y best practices
 * ✅ Framework Agnostic - Works with React, Vue, Angular
 * ✅ Maintainable Queries - Resilient to implementation changes
 * ✅ Realistic Interactions - userEvent over fireEvent
 * ✅ Async Testing - Built-in waitFor utilities
 *
 * PROJECT INTEGRATION STATUS:
 * - @testing-library/react: ✅ v13.4.0
 * - @testing-library/user-event: ✅ v14.5.0
 * - @testing-library/jest-dom: ✅ v6.1.0 (custom matchers)
 * - jest-axe: ✅ v10.0.0 (accessibility testing)
 * - vitest: ✅ v3.2.4 (test runner)
 * - jsdom: ✅ v23.2.0 (DOM simulation)
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
  getByRole,
  queryByRole,
  findByRole,
  getAllByRole,
  queryAllByRole,
  findAllByRole
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * ===== 1. QUERY METHODS - THE FOUNDATION =====
 *
 * Testing Library provides multiple ways to find elements:
 * - getBy*: Returns element or throws error (synchronous)
 * - queryBy*: Returns element or null (won't throw)
 * - findBy*: Returns promise that resolves when element found (async)
 * - getAllBy*, queryAllBy*, findAllBy*: Multiple elements
 */

// ✅ PRIORITY ORDER (most to least accessible):
export const QUERY_PRIORITY = {
  // 1. Accessible to everyone (screen readers, keyboard users)
  byRole: 'screen.getByRole("button", { name: "Submit" })',
  byLabelText: 'screen.getByLabelText("Email address")',

  // 2. Accessible to screen readers
  byPlaceholderText: 'screen.getByPlaceholderText("Enter email")',
  byText: 'screen.getByText("Welcome back")',

  // 3. Accessible programmatically (not visual)
  byDisplayValue: 'screen.getByDisplayValue("current value")',
  byAltText: 'screen.getByAltText("Profile picture")',
  byTitle: 'screen.getByTitle("Tooltip text")',

  // 4. Last resort (implementation details)
  byTestId: 'screen.getByTestId("submit-button")'
};

/**
 * ===== 2. ENHANCED DIALOG TESTING PATTERNS =====
 */

// Pattern 1: User-Centric Dialog Testing
export const dialogTestPatterns = {

  // ✅ Test dialog opening (user perspective)
  async openDialog() {
    const user = userEvent.setup();

    // Find trigger by accessible name
    const openButton = screen.getByRole('button', { name: /open.*dialog/i });
    await user.click(openButton);

    // Verify dialog appears with proper role
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAccessibleName(); // Jest-DOM matcher

    return dialog;
  },

  // ✅ Test focus management
  async testFocusManagement() {
    const user = userEvent.setup();

    const trigger = screen.getByRole('button', { name: 'Open Dialog' });
    await user.click(trigger);

    // Focus should be trapped within dialog
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();

    // Verify focus trap by checking if focus stays in dialog
    const dialog = screen.getByRole('dialog');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  },

  // ✅ Test keyboard navigation
  async testKeyboardNavigation() {
    const user = userEvent.setup();

    await this.openDialog();

    // Escape should close dialog
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },

  // ✅ Test form interactions within dialog
  async testFormInteraction() {
    const user = userEvent.setup();

    await this.openDialog();

    // Find form elements by their accessible names
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit|save/i });

    // Type using realistic user interactions
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    // Verify expected behavior
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  }
};

/**
 * ===== 3. USER EVENT API - REALISTIC INTERACTIONS =====
 */

export const userEventPatterns = {

  // ✅ Setup user event instance
  setupUser() {
    return userEvent.setup({
      // Optional configuration
      advanceTimers: vi.advanceTimersByTime,
      delay: null, // No artificial delays in tests
    });
  },

  // ✅ Keyboard interactions
  async keyboardTests() {
    const user = userEvent.setup();

    // Individual key presses
    await user.keyboard('{Enter}');
    await user.keyboard('{Escape}');
    await user.keyboard('{Tab}');
    await user.keyboard('{ArrowDown}');

    // Key combinations
    await user.keyboard('{Control>}a{/Control}'); // Ctrl+A
    await user.keyboard('{Shift>}{Tab}{/Shift}'); // Shift+Tab

    // Typing with realistic timing
    await user.type(screen.getByLabelText('Search'), 'enhanced dialog');
  },

  // ✅ Mouse interactions
  async mouseTests() {
    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: 'Click me' });

    // Various click types
    await user.click(button); // Left click
    await user.dblClick(button); // Double click
    await user.pointer({ keys: '[MouseRight]', target: button }); // Right click

    // Hover interactions
    await user.hover(button);
    await user.unhover(button);
  },

  // ✅ Focus interactions
  async focusTests() {
    const user = userEvent.setup();

    const input = screen.getByLabelText('Email');

    await user.click(input); // Focus via click
    await user.tab(); // Focus via keyboard

    // Verify focus state
    expect(input).toHaveFocus();
  }
};

/**
 * ===== 4. ACCESSIBILITY TESTING INTEGRATION =====
 */

export const accessibilityPatterns = {

  // ✅ Jest-DOM custom matchers
  testSemanticHTML() {
    const dialog = screen.getByRole('dialog');

    // Rich semantic assertions
    expect(dialog).toBeInTheDocument();
    expect(dialog).toBeVisible();
    expect(dialog).toHaveAccessibleName('User Settings');
    expect(dialog).toHaveAccessibleDescription('Configure your account settings');
    expect(dialog).not.toHaveAttribute('aria-hidden', 'true');

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeEnabled();
    expect(closeButton).toHaveAttribute('aria-label', 'Close dialog');
  },

  // ✅ Axe accessibility testing
  async testA11yCompliance() {
    const { container } = render(<EnhancedDialog />);

    // Run comprehensive accessibility audit
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Test specific WCAG criteria
    const results_wcag21aa = await axe(container, {
      tags: ['wcag21aa']
    });
    expect(results_wcag21aa).toHaveNoViolations();
  },

  // ✅ Focus management testing
  async testFocusManagement() {
    const user = userEvent.setup();

    const trigger = screen.getByRole('button', { name: 'Open Dialog' });
    const originalActiveElement = document.activeElement;

    await user.click(trigger);

    // Verify initial focus
    const dialog = screen.getByRole('dialog');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    // Test focus restoration
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveFocus(); // Focus returns to trigger
    });
  }
};

/**
 * ===== 5. ASYNC TESTING PATTERNS =====
 */

export const asyncPatterns = {

  // ✅ waitFor - Wait for async state changes
  async waitForElementToAppear() {
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Load Data' }));

    // Wait for async content to appear
    const loadedContent = await waitFor(
      () => screen.getByText('Data loaded successfully'),
      { timeout: 3000 } // Custom timeout
    );

    expect(loadedContent).toBeInTheDocument();
  },

  // ✅ findBy queries - Built-in async waiting
  async testAsyncRendering() {
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // findBy automatically waits (up to 1000ms by default)
    const successMessage = await screen.findByText('Form submitted successfully');
    expect(successMessage).toBeInTheDocument();
  },

  // ✅ waitForElementToBeRemoved - Wait for elements to disappear
  async testElementRemoval() {
    const user = userEvent.setup();

    const dialog = screen.getByRole('dialog');

    await user.keyboard('{Escape}');

    // Wait for dialog to be removed from DOM
    await waitForElementToBeRemoved(dialog);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  }
};

/**
 * ===== 6. COMPONENT-SPECIFIC TESTING UTILITIES =====
 */

export const enhancedDialogUtils = {

  // ✅ Custom render with providers
  renderWithProviders(ui: React.ReactElement, options = {}) {
    const AllProviders = ({ children }: { children: React.ReactNode }) => {
      return (
        <ThemeProvider defaultTheme="dark">
          <AccessibilityProvider enforceAAA={true}>
            {children}
          </AccessibilityProvider>
        </ThemeProvider>
      );
    };

    return render(ui, { wrapper: AllProviders, ...options });
  },

  // ✅ Dialog-specific test utilities
  async openDialogAndGetElements() {
    const user = userEvent.setup();

    const trigger = screen.getByRole('button', { name: /open/i });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog');
    const title = within(dialog).getByRole('heading');
    const closeButton = within(dialog).getByRole('button', { name: /close/i });

    return { dialog, title, closeButton, user };
  },

  // ✅ Variant testing helper
  testAllVariants(Component: React.ComponentType, variants: Record<string, any[]>) {
    Object.entries(variants).forEach(([prop, values]) => {
      values.forEach(value => {
        it(`renders with ${prop}="${value}"`, () => {
          const props = { [prop]: value };
          render(<Component {...props} />);

          // Component should render without errors
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });
    });
  }
};

/**
 * ===== 7. PERFORMANCE TESTING WITH TESTING LIBRARY =====
 */

export const performancePatterns = {

  // ✅ Render time testing
  testRenderPerformance() {
    const startTime = performance.now();

    render(<EnhancedDialog />);

    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(50); // 50ms budget
  },

  // ✅ Interaction response time
  async testInteractionPerformance() {
    const user = userEvent.setup();

    render(<EnhancedDialog />);

    const startTime = performance.now();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const interactionTime = performance.now() - startTime;
    expect(interactionTime).toBeLessThan(100); // 100ms budget
  }
};

/**
 * ===== 8. SIMPLIFIED TEST PATTERNS FOR MAPS v2.2 =====
 */

export const mapsTestingPatterns = {

  // ✅ Token integration testing
  testTokenIntegration() {
    render(<EnhancedDialog surface="elevated1" size="lg" />);

    const user = userEvent.setup();
    const trigger = screen.getByRole('button');
    await user.click(trigger);

    const dialog = screen.getByRole('dialog');

    // Verify MAPS tokens are applied (via CSS classes)
    expect(dialog).toHaveClass(expect.stringMatching(/elevated1|surface/));
    expect(dialog).toHaveClass(expect.stringMatching(/max-w-2xl|lg/));
  },

  // ✅ Accessibility enforcement testing
  testAAEnforcement() {
    render(<EnhancedDialog enforceAAA={true} vibrancy="glass" />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const dialog = screen.getByRole('dialog');

    // AAA mode should override vibrancy
    expect(dialog).toHaveClass('backdrop-blur-none');
    expect(dialog).toHaveClass('bg-background');
  },

  // ✅ High contrast mode testing
  testHighContrastMode() {
    // Mock media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('forced-colors'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });

    render(<EnhancedDialog />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const dialog = screen.getByRole('dialog');

    // Should have high contrast classes
    expect(dialog).toHaveClass('forced-colors:bg-[CanvasText]');
  }
};

export default {
  queryPriority: QUERY_PRIORITY,
  dialogPatterns: dialogTestPatterns,
  userEvent: userEventPatterns,
  accessibility: accessibilityPatterns,
  async: asyncPatterns,
  utils: enhancedDialogUtils,
  performance: performancePatterns,
  maps: mapsTestingPatterns,
};
