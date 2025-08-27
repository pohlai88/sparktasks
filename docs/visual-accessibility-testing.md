# Visual Regression & Accessibility Testing Guide

This document covers the visual regression testing and accessibility testing capabilities added to the SparkTasks E2E test suite.

## Quick Start

```bash
# Run visual regression tests
npm run test:visual

# Update visual baselines (after intentional UI changes)
npm run test:visual:update

# Run accessibility tests
npm run test:a11y

# Run all smoke tests (including visual and a11y)
npm run test:e2e:smoke
```

## Visual Regression Testing

### Overview

Visual regression tests capture screenshots of UI components and compare them against baseline images to detect unintended visual changes.

### Test Files

- `e2e/tests/visual.spec.ts` - Main visual regression test suite
- `e2e/__screenshots__/` - Baseline image storage

### Features

- **Cross-browser testing**: Screenshots for Chromium, Firefox, and WebKit
- **Responsive testing**: Desktop, tablet, and mobile viewports
- **Component isolation**: Individual component screenshot testing
- **Theme variation testing**: Light/dark theme support
- **Dynamic content handling**: Hides timestamps and loading states

### Key Test Categories

#### 1. Layout Tests

```typescript
test('should match homepage layout @visual @smoke', async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto('/');
  await expect(authenticatedPage).toHaveScreenshot('homepage-layout.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

#### 2. Component State Tests

```typescript
test('should match accordion component states @visual @component', async ({
  authenticatedPage,
}) => {
  // Tests collapsed and expanded states
  await expect(accordion).toHaveScreenshot('accordion-collapsed.png');
  await firstTrigger.click();
  await expect(accordion).toHaveScreenshot('accordion-expanded.png');
});
```

#### 3. Responsive Tests

```typescript
test('should match responsive layouts @visual @mobile', async ({
  authenticatedPage,
  context,
}) => {
  await context.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await expect(authenticatedPage).toHaveScreenshot('homepage-mobile.png');
});
```

### Best Practices

1. **Hide Dynamic Content**

   ```typescript
   await authenticatedPage.addStyleTag({
     content: `
       [data-testid="timestamp"],
       .timestamp {
         visibility: hidden !important;
       }
     `,
   });
   ```

2. **Wait for Stability**

   ```typescript
   await authenticatedPage.waitForFunction(() => {
     const loadingElements = document.querySelectorAll('.loading, .spinner');
     return loadingElements.length === 0;
   });
   ```

3. **Disable Animations**
   ```typescript
   await expect(element).toHaveScreenshot('element.png', {
     animations: 'disabled',
   });
   ```

### Updating Baselines

When UI changes are intentional:

```bash
npm run test:visual:update
```

This will regenerate all baseline screenshots. Review changes carefully before committing.

## Accessibility Testing

### Overview

Accessibility tests use axe-core to automatically detect WCAG 2.1 Level AA compliance violations and test keyboard navigation patterns.

### Test Files

- `e2e/tests/a11y.spec.ts` - Main accessibility test suite

### Features

- **WCAG 2.1 Level AA compliance**: Automated violation detection
- **Keyboard navigation testing**: Tab order and focus management
- **Screen reader support**: ARIA landmark and label validation
- **Color contrast checking**: Automated contrast ratio verification
- **Form accessibility**: Label and validation testing

### Key Test Categories

#### 1. Page-Level Scans

```typescript
test('should have no accessibility violations on homepage @a11y @smoke', async ({
  authenticatedPage,
}) => {
  const accessibilityScanResults = await new AxeBuilder({
    page: authenticatedPage,
  })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

#### 2. Navigation Testing

```typescript
test('should have accessible navigation @a11y @navigation', async ({
  authenticatedPage,
}) => {
  // Scan navigation elements
  const accessibilityScanResults = await new AxeBuilder({
    page: authenticatedPage,
  })
    .include('[role="navigation"]')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // Test keyboard navigation
  await authenticatedPage.keyboard.press('Tab');
  const firstFocusable = await authenticatedPage.locator(':focus');
  expect(await firstFocusable.count()).toBeGreaterThan(0);
});
```

#### 3. Form Accessibility

```typescript
test('should have accessible forms @a11y @forms', async ({
  authenticatedPage,
}) => {
  // Test form labeling
  const inputs = modal.locator('input, textarea, select');
  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    // Verify proper labeling (label, aria-label, or aria-labelledby)
    // ... validation logic
  }
});
```

#### 4. Heading Structure

```typescript
test('should have proper heading hierarchy @a11y @content', async ({
  authenticatedPage,
}) => {
  // Check for exactly one h1
  const h1Count = headingLevels.filter(level => level === 1).length;
  expect(h1Count).toBe(1);

  // Verify no skipped heading levels
  for (let i = 1; i < headingLevels.length; i++) {
    const currentLevel = headingLevels[i];
    const previousLevel = headingLevels[i - 1];
    expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
  }
});
```

### WCAG Guidelines Covered

- **Perceivable**: Color contrast, alternative text, heading structure
- **Operable**: Keyboard navigation, focus management, no seizure triggers
- **Understandable**: Clear labeling, consistent navigation, error identification
- **Robust**: Valid ARIA, semantic markup, screen reader compatibility

### Accessibility Best Practices

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
3. **Focus Management**: Visible focus indicators and logical tab order
4. **ARIA Labels**: Proper labeling for form controls and interactive elements
5. **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text

## Test Tags and Filtering

### Available Tags

- `@visual` - Visual regression tests
- `@a11y` - Accessibility tests
- `@smoke` - Core functionality (subset of visual/a11y)
- `@critical` - Critical path tests
- `@component` - Individual component tests
- `@mobile` - Mobile-specific tests
- `@navigation` - Navigation-related tests
- `@forms` - Form-related tests

### Running Specific Test Types

```bash
# Visual tests only
npm run test:visual

# Accessibility tests only
npm run test:a11y

# Smoke tests (includes critical visual and a11y)
npm run test:e2e:smoke

# Critical path only
npm run test:e2e:critical

# Combined tags
npx playwright test --grep "@visual.*@smoke"
npx playwright test --grep "@a11y.*@forms"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Visual Regression Tests
  run: npm run test:visual

- name: Run Accessibility Tests
  run: npm run test:a11y

- name: Upload Screenshots on Failure
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-test-failures
    path: test-results/
```

### Baseline Management

- Screenshots are stored in `e2e/__screenshots__/`
- Include baseline images in version control
- Review screenshot changes in pull requests
- Use `--update-snapshots` only for intentional UI changes

## Troubleshooting

### Visual Test Failures

1. **Timing Issues**: Add more specific waits for dynamic content
2. **Cross-browser Differences**: Check if differences are browser-specific
3. **Environment Differences**: Ensure consistent fonts and rendering

### Accessibility Test Failures

1. **Missing Labels**: Add `aria-label` or associate with `<label>` elements
2. **Color Contrast**: Use tools like WebAIM's contrast checker
3. **Keyboard Navigation**: Ensure `tabindex` is properly managed

### Common Solutions

```typescript
// Wait for animations to complete
await authenticatedPage.waitForTimeout(300);

// Hide dynamic content
await authenticatedPage.addStyleTag({
  content: `[data-testid="timestamp"] { visibility: hidden !important; }`,
});

// Check element accessibility specifically
const scanResults = await new AxeBuilder({ page })
  .include('[data-testid="specific-component"]')
  .analyze();
```

## Performance Considerations

- Visual tests are slower due to screenshot capture
- Run visual tests on subset of browsers for speed
- Use `@smoke` tag for essential visual coverage
- Consider parallel execution limits for screenshot tests

---

These testing capabilities provide comprehensive coverage for both visual regression and accessibility compliance, ensuring a robust and inclusive user experience.
