# 🎯 SparkTasks E2E Testing Infrastructure

## 📋 Overview

Enterprise-grade Playwright E2E testing suite with **deterministic seeding**, **visual regression testing**, **accessibility compliance**, **performance monitoring**, and **API mocking** capabilities.

---

## � Quick Start

### **Run All Tests**

```bash
npm run test:e2e           # Full test suite
npm run test:e2e:smoke     # Critical user journeys only
npm run test:e2e:critical  # Mission-critical flows
```

### **Specialized Test Categories**

```bash
npm run test:visual        # Visual regression tests
npm run test:a11y          # Accessibility compliance
npm run test:performance   # Performance benchmarking
npm run test:mocking       # API mocking scenarios
```

### **Development & Debugging**

```bash
npm run test:e2e:ui        # Interactive test runner
npm run test:e2e:debug     # Debug mode with browser dev tools
npm run test:e2e:report    # View HTML test report
```

---

## 🏗️ Test Infrastructure

### **1. 🌱 Deterministic Data Seeding**

**Golden Snapshot Pattern** ensures identical test conditions across all runs:

```typescript
// e2e/data/seed.base.ts - Base deterministic data
export const GOLDEN_SNAPSHOT = {
  users: [{ id: 'user-001', email: 'test@sparktasks.com', role: 'admin' }],
  tasks: [{ id: 'task-001', title: 'Sample Task', status: 'pending' }],
  timestamp: '2024-01-01T00:00:00.000Z',
};
```

**Usage:**

```bash
npm run db:snapshot:create  # Create golden snapshot
npm run db:snapshot:restore # Restore to clean state
npm run seed:base          # Load deterministic data
```

### **2. 📸 Visual Regression Testing**

**Screenshot-based validation** with cross-browser support:

```typescript
// Automatic visual comparison
await expect(page).toHaveScreenshot('homepage.png');

// Component-level snapshots
await expect(page.locator('[data-testid="task-card"]')).toHaveScreenshot();

// Responsive testing
await page.setViewportSize({ width: 375, height: 667 });
await expect(page).toHaveScreenshot('homepage-mobile.png');
```

**Management:**

```bash
npm run test:visual:update # Update baseline screenshots
```

### **3. ♿ Accessibility Testing**

**WCAG 2.1 Level AA compliance** with axe-playwright:

```typescript
import { injectAxe, checkA11y } from 'axe-playwright';

test('accessibility compliance', async ({ page }) => {
  await injectAxe(page);
  await checkA11y(page, null, {
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  });
});
```

**Coverage:**

- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast validation
- ✅ Focus management
- ✅ ARIA attributes

### **4. 🚀 Performance Monitoring**

**Core Web Vitals** and custom performance metrics:

```typescript
test('performance benchmarks', async ({ page }) => {
  // Measures LCP, FID, CLS automatically
  const metrics = await page.evaluate(() => window.webVitals);

  expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
  expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
  expect(metrics.fid).toBeLessThan(100); // FID < 100ms
});
```

**Performance Budgets:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- DOM Content Loaded: < 1.5s

### **5. 🔁 API Mocking**

**Deterministic API responses** for reliable testing:

```typescript
import { createAPIMocker, MockResponses } from '../utils/api-mocks';

test('with mocked APIs', async ({ page }) => {
  const apiMocker = await createAPIMocker(page);

  // Mock successful responses
  await apiMocker.mockEndpoint(
    '/api/tasks',
    MockResponses.success([{ id: '1', title: 'Mock Task' }])
  );

  // Mock error scenarios
  await apiMocker.mockEndpoint(
    '/api/error',
    MockResponses.error('Server Error', 500)
  );
});
```

**Mock Scenarios:**

- ✅ Success responses
- ✅ Error handling (4xx, 5xx)
- ✅ Network timeouts
- ✅ Offline scenarios
- ✅ Authentication flows

---

## 🏷️ Test Tagging System

### **Execution Priority Tags**

```typescript
test('critical user flow @critical @smoke', async ({ page }) => {
  // Always runs in CI/CD and smoke tests
});

test('edge case validation @regression', async ({ page }) => {
  // Runs in full regression suite
});

test('experimental feature @experimental @quarantine', async ({ page }) => {
  // Excluded from standard runs
});
```

### **Category Tags**

- `@smoke` - Critical user journeys (< 5 minutes)
- `@critical` - Mission-critical flows
- `@visual` - Visual regression tests
- `@a11y` - Accessibility tests
- `@performance` - Performance benchmarks
- `@mocking` - API mocking scenarios
- `@mobile` - Mobile-specific tests
- `@quarantine` - Temporarily disabled tests

### **Selective Execution**

```bash
# Run specific categories
SMOKE=1 npm run test:e2e          # Smoke tests only
CRITICAL=1 npm run test:e2e       # Critical tests only

# Browser-specific execution
npx playwright test --project=chromium
npx playwright test --project=mobile-chrome
```

---

## 🔧 Configuration

### **Environment Variables**

```bash
# Test execution
BASE_URL=http://localhost:3000
CI=true                          # CI mode (retries, workers)
CI_WORKERS=2                     # Parallel worker count

# Test filtering
SMOKE=1                          # Run smoke tests only
CRITICAL=1                       # Run critical tests only

# Deterministic environment
NODE_ENV=test
TZ=UTC
FAKE_NOW=2024-01-01T00:00:00.000Z
DISABLE_ANALYTICS=1
```

### **Browser Matrix**

- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 7 (Chrome), iPhone 14 (Safari)
- **CI Optimization**: 2 workers, retry on failure

### **Reporting**

- **HTML Report**: `test-results/e2e-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml` (CI integration)
- **GitHub Actions**: Automatic PR annotations

---

## 📁 Directory Structure

```
e2e/
├── tests/                      # Test specifications
│   ├── auth.spec.ts           # Authentication flows
│   ├── visual.spec.ts         # Visual regression
│   ├── a11y.spec.ts          # Accessibility compliance
│   ├── performance.spec.ts    # Performance benchmarks
│   └── api-mocking.spec.ts    # API mocking scenarios
├── fixtures/                   # Test fixtures & utilities
│   ├── test-fixtures.ts       # Custom test fixtures
│   └── authenticated-user.ts  # Pre-authenticated state
├── utils/                      # Utilities & helpers
│   ├── page-utils.ts          # Page interaction helpers
│   ├── api-mocks.ts           # API mocking utilities
│   └── performance-utils.ts    # Performance measurement
├── data/                       # Test data & seeding
│   ├── seed.base.ts           # Deterministic base data
│   ├── seed.scenarios.ts      # Scenario-specific data
│   └── storage-state.json     # Authentication state
├── __screenshots__/            # Visual regression baselines
│   ├── chromium/              # Browser-specific screenshots
│   ├── firefox/
│   └── webkit/
├── global-setup.ts            # Test environment setup
├── global-teardown.ts         # Test environment cleanup
└── playwright.config.ts       # Playwright configuration
```

---

## 🎯 Best Practices

### **1. Test Isolation**

```typescript
test.beforeEach(async ({ page }) => {
  // Restore deterministic state before each test
  await page.goto('/reset-state');
});
```

### **2. Reliable Selectors**

```typescript
// ✅ Preferred - Stable test IDs
await page.locator('[data-testid="submit-button"]').click();

// ✅ Semantic selectors
await page.locator('role=button[name="Submit"]').click();

// ❌ Avoid - Fragile CSS selectors
await page.locator('.btn-primary.large').click();
```

### **3. Wait Strategies**

```typescript
// ✅ Wait for specific conditions
await page.waitForLoadState('networkidle');
await page.locator('[data-testid="content"]').waitFor();

// ✅ Use expect with timeout
await expect(page.locator('[data-testid="result"]')).toBeVisible();

// ❌ Avoid fixed timeouts
await page.waitForTimeout(5000);
```

### **4. Error Handling**

```typescript
test('graceful error handling', async ({ page }) => {
  // Test error scenarios with mocked APIs
  await apiMocker.mockEndpoint(
    '/api/error',
    MockResponses.error('Server Error')
  );

  await page.goto('/');
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});
```

---

## 🔄 CI/CD Integration

### **GitHub Actions Example**

```yaml
- name: Run E2E Tests
  run: |
    npm run test:e2e:critical
  env:
    CI: true
    BASE_URL: ${{ env.PREVIEW_URL }}

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: test-results/
```

### **Performance Monitoring**

- Automatic slow test detection (> 15s)
- Performance regression alerts
- Core Web Vitals tracking

---

## 🎯 Success Metrics

### **Quality Gates**

- ✅ **100% Critical Path Coverage** - All @critical tests pass
- ✅ **WCAG 2.1 AA Compliance** - All accessibility tests pass
- ✅ **Performance Budgets Met** - Core Web Vitals within thresholds
- ✅ **Visual Consistency** - No unintended UI changes
- ✅ **API Reliability** - All error scenarios handled gracefully

### **Performance Targets**

- **Test Execution**: < 15 minutes for full suite
- **Smoke Tests**: < 5 minutes for critical flows
- **Flakiness Rate**: < 1% test failure rate
- **Cross-Browser Compatibility**: 100% pass rate on target browsers

---

## 🆘 Troubleshooting

### **Common Issues**

**Flaky Tests:**

```bash
# Check for timing issues
npm run test:e2e:debug test-name.spec.ts

# Run with retries
npm run test:e2e -- --retries=3
```

**Visual Regression Failures:**

```bash
# Update screenshots after UI changes
npm run test:visual:update

# Compare differences
npm run test:e2e:report
```

**Performance Issues:**

```bash
# Profile slow tests
npm run test:performance -- --reporter=verbose
```

### **Getting Help**

- 📖 **Playwright Docs**: https://playwright.dev
- 🐛 **Issue Reports**: Create GitHub issues with test logs
- 💬 **Team Support**: Check internal documentation

---

**🎉 Enterprise-Grade Testing Infrastructure Ready!**

This comprehensive suite provides **Fortune-500 level testing capabilities** with deterministic data, visual regression detection, accessibility compliance, performance monitoring, and reliable API mocking. 🚀
