# 🛡 SSOT E2E Testing Standards & Rebuild Guide

## 🎯 Strategic Overview

This document establishes **enterprise-grade E2E testing standards** that eliminate continuous debugging through:

- **SSOT Accessibility Snapshots**: Automated regression detection
- **DRIFT-SAFE Test Architecture**: Predictable, maintainable patterns
- **Emergency Rebuild Procedures**: Fast recovery from test suite corruption

---

## 📋 Testing Standards Checklist

### ✅ Required for Every Test Suite

- [ ] **State Reset**: `await page.addInitScript(() => localStorage.clear())`
- [ ] **SSOT Selectors**: Use `LayeredSelector` and `TEST_IDS` registry
- [ ] **Accessibility Validation**: Include ARIA, keyboard, focus tests
- [ ] **Cross-Browser Support**: Test on Chromium, Firefox, WebKit, Mobile
- [ ] **Error Capture**: Screenshots, videos, traces on failure
- [ ] **Deterministic Data**: Use `test-data.ts` fixtures, avoid randomness

### ✅ SSOT Selector Strategy

```typescript
// ✅ GOOD: SSOT Pattern
const selector = new LayeredSelector(page);
const quickAdd = selector.getByTestIdOrRole(
  TEST_IDS.quickAddInput,
  'textbox',
  'Quick add task'
);

// ❌ BAD: Brittle Pattern
const quickAdd = page.locator('#quick-add-input');
const quickAdd = page.getByText('Add task').locator('..');
```

### ✅ Accessibility Snapshot Integration

```typescript
// Every critical flow should have accessibility snapshot
test('Critical Flow - QuickAdd', async ({ page }) => {
  await setup(page, helpers, selector);

  // Validate accessibility tree hasn't regressed
  const snapshot = await page.accessibility.snapshot();
  expect(snapshot).toMatchSnapshot('QuickAdd-EmptyState.json');

  // Validate critical ARIA elements
  await expect(
    page.getByRole('textbox', { name: 'Quick add task' })
  ).toBeVisible();
});
```

---

## 🚨 Emergency E2E Rebuild Procedures

### When to Rebuild

- **Selector failures**: Multiple tests failing with timeout/not found errors
- **ARIA regressions**: Accessibility snapshots consistently failing
- **Infrastructure drift**: Config changes breaking test environment
- **Dependency conflicts**: Playwright/Node version mismatches

### 🔧 Level 1: Quick Fix (5 minutes)

```bash
# 1. Clean test artifacts
rm -rf test-results/ playwright-report/

# 2. Restart dev server
npm run dev

# 3. Run single working test to verify environment
npx playwright test test/e2e/a4-search-quickadd.spec.ts:16 --project=chromium

# 4. If passing, run full suite
npx playwright test
```

### 🔧 Level 2: Selector Reset (15 minutes)

```bash
# 1. Update accessibility snapshots
UPDATE_SNAPSHOTS=true npx playwright test test/e2e/a5-accessibility-snapshots.spec.ts

# 2. Regenerate failed test screenshots for comparison
npx playwright test --reporter=html

# 3. Check specific failing selector
npx playwright codegen http://localhost:3000 --target=playwright-test

# 4. Update selectors in test files using working patterns from A4
```

### 🔧 Level 3: Full Infrastructure Reset (30 minutes)

```bash
# 1. Clean everything
rm -rf node_modules/ package-lock.json test-results/ playwright-report/

# 2. Reinstall dependencies
npm install

# 3. Reinstall Playwright browsers
npx playwright install

# 4. Verify config is correct
cat playwright.config.ts | grep -E "(baseURL|webServer)"

# 5. Start fresh with known-good test
npx playwright test test/e2e/a4-search-quickadd.spec.ts --project=chromium --debug

# 6. Rebuild test suite incrementally
npx playwright test test/e2e/a5-accessibility-snapshots.spec.ts
npx playwright test test/e2e/a2-task-interactions.spec.ts
```

### 🔧 Level 4: Complete Rebuild (60 minutes)

```typescript
// 1. Create new baseline test file
// test/e2e/a0-baseline-validation.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Baseline Environment Validation', () => {
  test('App loads and shows expected elements', async ({ page }) => {
    await page.goto('/');

    // Validate core app structure
    await expect(page.getByText('SparkTasks')).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Quick add task' })
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: 'Search tasks' })
    ).toBeVisible();

    // Basic functionality test
    const quickAdd = page.getByRole('textbox', { name: 'Quick add task' });
    await quickAdd.fill('Baseline Test Task');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Baseline Test Task')).toBeVisible();
  });
});
```

```bash
# 2. Run baseline test first
npx playwright test test/e2e/a0-baseline-validation.spec.ts

# 3. If baseline passes, rebuild each suite incrementally:
npx playwright test test/e2e/a4-search-quickadd.spec.ts  # Known good
npx playwright test test/e2e/a5-accessibility-snapshots.spec.ts  # New standard
npx playwright test test/e2e/a2-task-interactions.spec.ts  # Fix selectors

# 4. Update documentation with any new patterns discovered
```

---

## 📊 Quality Gates

### ✅ Before Merge

- [ ] All accessibility snapshots pass
- [ ] No hardcoded selectors or brittle text matching
- [ ] Cross-browser compatibility (5 configs)
- [ ] Coverage report shows >90% critical flows tested

### ✅ CI/CD Integration

```yaml
# .github/workflows/e2e-tests.yml
- name: E2E Tests
  run: |
    npm ci
    npx playwright install
    npx playwright test --project=chromium,firefox,webkit

- name: Accessibility Validation
  run: |
    npx playwright test test/e2e/a5-accessibility-snapshots.spec.ts

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

## 🎯 Team Adoption Strategy

### Phase 1: Infrastructure (Week 1)

- [ ] Deploy A5 accessibility snapshots to all environments
- [ ] Generate baseline snapshots for critical flows
- [ ] Document selector migration patterns

### Phase 2: Migration (Week 2-3)

- [ ] Convert remaining A2 tests to SSOT patterns
- [ ] Add accessibility snapshots to existing test suites
- [ ] Train team on `LayeredSelector` and `TEST_IDS` usage

### Phase 3: Standardization (Week 4)

- [ ] Establish testing standards review process
- [ ] Create automated linting for test patterns
- [ ] Document emergency rebuild procedures

---

## 🔮 Future Enhancements

1. **Visual Regression Testing**: Add Playwright visual snapshots
2. **Performance Testing**: Lighthouse CI integration
3. **API Contract Testing**: Snapshot API responses
4. **Cross-Device Testing**: Expand mobile viewport coverage
5. **Accessibility Scoring**: Automated accessibility scoring

---

## 📞 Support & Escalation

### Quick Help

- **Slack**: #testing-support
- **Documentation**: `/docs/testing/`
- **Examples**: `test/e2e/a4-*.spec.ts` (reference implementation)

### Emergency Contact

- **On-Call**: DevOps team for CI/CD issues
- **Architecture**: @architecture-team for SSOT guidance
- **Accessibility**: @a11y-team for ARIA compliance

---

**This guide ensures your E2E testing infrastructure is bullet-proof, standardized, and recoverable. No more continuous debugging! 🎯**
