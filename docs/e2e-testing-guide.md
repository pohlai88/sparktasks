# E2E Testing Guide

## Enhanced Playwright Configuration

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run only desktop tests
npx playwright test --project=chromium

# Run only mobile tests
npx playwright test --project=mobile-chrome

# Run tests with UI mode for debugging
npx playwright test --ui

# Run specific test file
npx playwright test test/e2e/health.spec.ts
```

### Mobile Testing

Our configuration includes iPhone 14 viewport testing to ensure responsive behavior:

```typescript
// Tests automatically run on mobile viewports
test('should work on mobile', async ({ page }) => {
  // This test runs on iPhone 14 viewport when using mobile-chrome project
  await page.goto('/api/health');
  // Test logic...
});
```

### Debugging Failed Tests

When tests fail, the enhanced configuration provides multiple debugging aids:

**1. Video Recordings**

- Automatically captured for failed tests
- Stored in `test-results/` directory
- Shows full user interaction leading to failure

**2. Screenshots**

- Taken at the exact moment of failure
- Useful for visual regression debugging
- Available in test results artifacts

**3. Trace Files**

- Detailed execution traces on first retry
- Open with `npx playwright show-trace trace.zip`
- Shows DOM snapshots, network activity, console logs

### Test Organization Patterns

**Parallel Tests (Default)**:

```typescript
test.describe('Independent Tests', () => {
  test('test 1', async ({ page }) => {
    /* ... */
  });
  test('test 2', async ({ page }) => {
    /* ... */
  });
  // These run in parallel for speed
});
```

**Serial Tests (Shared State)**:

```typescript
test.describe('Stateful Tests', () => {
  test.describe.configure({ mode: 'serial' });

  let sharedData: any;

  test('setup', async ({ page }) => {
    // Setup shared state
  });

  test('use shared state', async ({ page }) => {
    // Use data from previous test
  });
});
```

### CI Integration Features

**Local Development**:

- HTML reporter with interactive results
- List reporter for console output
- Existing server reuse for faster iteration

**CI Environment**:

- Dot reporter for concise logs
- JUnit XML for build system integration
- Fresh server instance for clean state
- 2-minute startup timeout prevents hanging

### Performance Testing

The mobile configuration enables performance testing:

```bash
# Run Lighthouse on mobile viewport
npm install -g @lhci/cli
lhci autorun --config.ci.collect.settings.emulatedFormFactor=mobile
```

### Common Issues & Solutions

**Server Not Starting**:

- Check if port 3000 is available
- Increase timeout in `playwright.config.ts` if needed
- Verify `npm run dev` works independently

**Tests Flaky on Mobile**:

- Add explicit waits for responsive elements
- Use `page.waitForLoadState('networkidle')` for dynamic content
- Consider viewport-specific selectors

**CI Failures with Local Success**:

- Check video recordings in CI artifacts
- Verify timing assumptions (CI can be slower)
- Use `test.slow()` for time-sensitive tests

### Best Practices

1. **Mobile-First Testing**: Write tests that work on both desktop and mobile
2. **Explicit Waits**: Use `page.waitFor*` instead of arbitrary timeouts
3. **Isolated Tests**: Avoid dependencies between test files
4. **Descriptive Assertions**: Use clear error messages for failed assertions
5. **Resource Cleanup**: Use `test.afterEach()` for cleanup when needed

### API Contract Testing

Test API endpoints directly with enhanced error validation:

```typescript
test('API returns standard error format', async ({ page }) => {
  const response = await page.goto('/api/nonexistent');
  expect(response?.status()).toBe(404);

  const content = await page.textContent('body');
  const errorData = JSON.parse(content || '{}');

  // Validate against our API contract
  expect(errorData.error.code).toBeDefined();
  expect(errorData.error.message).toBeDefined();
});
```
