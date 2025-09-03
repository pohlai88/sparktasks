# 🧪 SparkTasks Test Suite

Welcome to the SparkTasks test suite! This folder contains all testing infrastructure organized by test type with Single Source of Truth (SSOT) governance.

## 📁 Folder Structure

**⚠️ IMPORTANT: This is the ONLY allowed folder structure. All other folders are FORBIDDEN.**

```
tests/
├── e2e/                     # End-to-end tests (Playwright)
│   ├── tests/               # Organized by category
│   │   ├── critical/        # Critical user paths
│   │   ├── smoke/           # Basic functionality
│   │   ├── visual/          # Visual regression
│   │   ├── performance/     # Performance tests
│   │   └── accessibility/   # A11y tests
│   ├── helpers/             # E2E utilities
│   └── ssot.e2e.ts         # E2E test registry
│
├── vitest/                 # Unit & component tests (Vitest)
│   ├── unit/               # Unit tests
│   │   ├── components/     # UI components
vr│   │   └── services/       # Service layer
│   └── ssot.vitest.ts     # Vitest test registry
│
├── templates/              # Test file templates
├── helpers/                # Shared test utilities
└── ssot.index.ts          # Central SSOT index
```

### 🚫 **FORBIDDEN FOLDERS**

The following folders are **STRICTLY PROHIBITED** and will be automatically removed:

- ❌ `tests/components/` - Use `tests/vitest/unit/components/` instead
- ❌ `tests/unit/` - Use `tests/vitest/unit/` instead
- ❌ `tests/setup/` - Use `tests/vitest/setup.ts` instead
- ❌ `tests/integration/` - Use `tests/vitest/integration/` instead
- ❌ `tests/fixtures/` - Use `tests/helpers/` instead
- ❌ Any folder not listed in the approved structure above

### ✅ **APPROVED FOLDERS ONLY**

Only the folders listed in the structure above are allowed. Any deviation will result in:
1. **Automatic cleanup** during CI/CD
2. **Linting errors** in development
3. **Review rejection** in pull requests

## 🧪 Test File Naming Convention

**All test files use the unified `.test.ts` or `.test.tsx` suffix with descriptive naming:**

| Test Type     | File Name Format                      | Example                          |
|---------------|----------------------------------------|----------------------------------|
| Unit Test     | `featureName.test.ts`                 | `authService.test.ts`            |
| Component     | `ComponentName.test.tsx`              | `Button.test.tsx`                |
| Hook          | `useHookName.test.ts`                 | `useFetch.test.ts`               |
| Utility       | `utilityName.test.ts`                 | `formatDate.test.ts`             |
| Service       | `service-name.test.ts`                | `http-remote.test.ts`            |
| E2E Flow      | `feature-flow.test.ts`                | `login-flow.test.ts`             |
| E2E Smoke     | `feature-smoke.test.ts`               | `remote-smoke.test.ts`           |
| E2E Visual    | `visual-regression.test.ts`           | `visual-regression.test.ts`      |
| E2E Performance| `performance-metrics.test.ts`         | `performance-metrics.test.ts`    |
| E2E A11y      | `accessibility-audit.test.ts`         | `accessibility-audit.test.ts`    |

### 📋 **Naming Rules**
- ✅ **Consistency Rule**: All test files end in `.test.ts` or `.test.tsx` — no `.spec.ts` files allowed
- ✅ **Descriptive Names**: Use descriptive names that clearly indicate the test purpose
- ✅ **Kebab Case**: Use kebab-case for multi-word names (e.g., `http-remote.test.ts`)
- ✅ **Flow Suffix**: E2E tests should end with `-flow.test.ts` for user workflows
- ✅ **Category Suffix**: Use appropriate suffixes like `-smoke`, `-metrics`, `-audit`, `-regression`
- ❌ **No Abbreviations**: Avoid abbreviations like `a11y` - use full names like `accessibility`

## 🎯 Test Categories

### E2E Tests (`tests/e2e/`)
**Purpose**: Test complete user workflows in real browser environment
- **Framework**: Playwright
- **Coverage**: Critical user journeys
- **Tags**: `@critical`, `@smoke`, `@visual`, `@performance`

### Vitest Tests (`tests/vitest/`)
**Purpose**: Unit and integration tests for components, hooks, and utilities
- **Framework**: Vitest + Testing Library
- **Coverage**: 100% for production code
- **Types**: Unit tests, component tests, hook tests, utility tests

## 📋 SSOT (Single Source of Truth) Files

Each SSOT file acts as a **registry and governance layer** for its respective test type:

### `ssot.e2e.ts`
```typescript
export const e2eTestRegistry = [
  { 
    name: 'Login Flow', 
    path: './auth/login-flow.test.ts', 
    tags: ['critical', 'auth'],
    description: 'Tests complete user authentication workflow'
  },
  { 
    name: 'Dashboard Load', 
    path: './dashboard/dashboard-load.test.ts', 
    tags: ['smoke', 'dashboard'],
    description: 'Tests dashboard loading and basic interactions'
  },
  // Add more E2E test entries here
];
```

### `ssot.vitest.ts`
```typescript
export const vitestRegistry = [
  { 
    name: 'Button Component', 
    path: './components/ui-enhanced/Button.test.tsx', 
    tags: ['ui', 'component'],
    description: 'Tests Button component variants and interactions'
  },
  { 
    name: 'useFetch Hook', 
    path: './hooks/useFetch.test.ts', 
    tags: ['hook', 'data'],
    description: 'Tests useFetch hook functionality'
  },
  // Add more Vitest test entries here
];
```

### `ssot.index.ts`
```typescript
import { e2eTestRegistry } from './e2e/ssot.e2e';
import { vitestRegistry } from './vitest/ssot.vitest';

export const testRegistry = {
  e2e: e2eTestRegistry,
  vitest: vitestRegistry,
};

// Export for use in scripts and tooling
export { e2eTestRegistry, vitestRegistry };
```

## 🚀 Running Tests

### Unit & Component Tests (Vitest)
```bash
# Run all Vitest tests
npm run test:vitest

# Run specific test file
npm run test:vitest Button.test.tsx

# Run tests in watch mode
npm run test:vitest:watch

# Run with coverage
npm run test:vitest:coverage
```

### E2E Tests (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e login-flow.test.ts

# Run with UI mode
npm run test:e2e:ui

# Run only critical tests
npm run test:e2e:critical
```

## 📝 Creating New Tests

### 1. Choose the Right Location
- **Components**: `tests/vitest/unit/components/`
- **Hooks**: `tests/vitest/unit/hooks/`
- **Utils**: `tests/vitest/unit/utils/`
- **Services**: `tests/vitest/unit/services/`
- **E2E Flows**: `tests/e2e/tests/` (by category)

### 2. Use Templates
Copy from `tests/templates/` and customize:
- `component.test.tsx` for React components
- `hook.test.ts` for custom hooks
- `util.test.ts` for utility functions
- `e2e.test.ts` for end-to-end tests

### 3. Register in SSOT
Add your test to the appropriate SSOT file:
- E2E tests → `ssot.e2e.ts`
- Vitest tests → `ssot.vitest.ts`

### 4. Follow Naming Convention
- Use `.test.ts` or `.test.tsx` suffix
- Use descriptive names with appropriate suffixes
- E2E tests use descriptive suffixes (`-flow`, `-smoke`, `-metrics`, `-audit`, `-regression`)
- Service tests use kebab-case (`http-remote.test.ts`)
- No abbreviations in file names (use `accessibility` not `a11y`)
- Group related tests in `describe` blocks

## 🛠️ Test Utilities

### Mocking
- **Global mocks**: `tests/helpers/mocks/`
- **Component mocks**: Use `vi.mock()` in test files
- **E2E mocks**: Use MSW in `tests/e2e/fixtures/`

### Fixtures
- **Test data**: `tests/helpers/fixtures/`
- **Component props**: Create reusable prop objects
- **API responses**: Mock realistic data

### Utilities
- **Render helpers**: `tests/helpers/utils/`
- **Custom matchers**: Extend Jest/Vitest matchers
- **Test data builders**: Create test data programmatically

## 📊 Quality Gates

### Pre-commit Requirements
- ✅ All unit tests pass
- ✅ 100% code coverage maintained
- ✅ No linting errors
- ✅ TypeScript compilation successful

### CI/CD Requirements
- ✅ All tests pass (unit, integration, E2E)
- ✅ Coverage reports generated
- ✅ Visual regression tests pass
- ✅ Performance budgets met

## 🎨 Best Practices

### Test Organization
1. **Group related tests** in `describe` blocks
2. **Use clear, descriptive test names**
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests focused and atomic**

### Performance
1. **Use `vi.hoisted()`** for expensive setup
2. **Mock heavy dependencies**
3. **Use `screen` queries** from testing-library
4. **Avoid testing implementation details**

### Accessibility
1. **Test with screen readers**
2. **Verify keyboard navigation**
3. **Check ARIA attributes**
4. **Use accessibility matchers**

## 🎭 Playwright E2E Best Practices

### Self-Diagnosing & Non-Flaky Tests
1. **Use role-based locators first**
   - Prefer `getByRole`, `getByLabel`, `getByPlaceholder`
   - Fall back to `data-testid` only when no accessible handle exists
   - Avoid CSS/XPath selectors unless absolutely necessary

2. **Assert with Playwright's web-aware matchers**
   - Use `await expect(locator).toHaveText(...)` (auto-waits)
   - Avoid manual `waitFor*` or `waitForTimeout`
   - Most flakes disappear if you avoid sleep

3. **Record traces on first retry**
   - Config: `trace: 'on-first-retry'`, `video: 'retain-on-failure'`
   - Traces show actions, DOM snapshots, and network
   - Tells you in minutes if it's app vs. test issue

4. **Stabilize the environment**
   - Pin `timezoneId`, `locale`, `deviceScaleFactor`
   - Keep consistent `baseURL`
   - Use `webServer` for deterministic startup

5. **Use fixtures for setup, not ad-hoc beforeEach**
   - App/auth/state go into fixtures
   - Each test starts "clean" and fast

6. **Prefer network-level assertions for risky flows**
   - For creates/updates, use `waitForResponse`
   - Assert headers/body (e.g., `Idempotency-Key`, `x-request-id`)
   - Separates UI flake from backend behavior

7. **No sleeps; timeouts live in config**
   - Don't sprinkle `waitForTimeout`
   - If something needs stabilization, assert it
   - Keep global test timeout reasonable

8. **Mock/route only when the contract is the subject**
   - Use real BFF in E2E
   - Use route/HAR mocking in component/contract tests

### E2E Test Checklist
Before creating any E2E test, ensure:
- [ ] Uses `getByRole`/`getByLabel` (no CSS/XPath unless unavoidable)
- [ ] No `waitForTimeout`; uses `expect(...).toHave*` with auto-wait
- [ ] Has a **single source of truth** for navigation (uses `baseURL`)
- [ ] Includes at least one **network assertion** for critical flows
- [ ] Leaves a **trace** on first retry (config)
- [ ] If it mutates data, it is **env-gated** (e.g., `RUN_WRITE_TEST=1`)
- [ ] Fails with a human-readable message: what user expected to see vs. what was present
- [ ] **Bullet-proof network assertions** - Always trigger fresh requests (click or reload)
- [ ] **03A readiness checks** - Assert `aria-busy="false"` for data grids
- [ ] **Animation stabilization** - Disable transitions for deterministic visuals
- [ ] **Stable snapshots** - Mask volatile UI elements (RID, timestamps)
- [ ] **Describe-level gating** - Use suite variables instead of top-level skips

### High-Impact Surgical Upgrades
1. **Describe-level gating** - Cleaner than per-test gating
   ```ts
   const featureSuite = process.env.RUN_FEATURE_TEST === '1' ? test.describe : test.describe.skip;
   const writeSuite = process.env.RUN_WRITE_TEST === '1' ? test.describe : test.describe.skip;
   ```

2. **Bullet-proof network assertions** - No hanging waits, always trigger fresh requests
   ```ts
   const nextResponse = page.waitForResponse(r => r.url().includes('/api/items'));
   const resp = await (await loadMore.isVisible().catch(() => false))
     ? Promise.all([nextResponse, loadMore.click()]).then(([r]) => r)
     : Promise.all([nextResponse, page.reload()]).then(([r]) => r);
   ```

3. **03A readiness assertions** - Grid a11y contract with `aria-busy="false"`
   ```ts
   await expect(grid).toHaveAttribute('aria-busy', /false/i);
   ```

4. **Animation stabilization** - Deterministic visuals with CSS injection
   ```ts
   await page.addStyleTag({
     content: `*,*::before,*::after{transition-duration:0s!important;animation:none!important}`
   });
   ```

5. **Stable visual snapshots** - Mask volatile UI elements
   ```ts
   const masks = [page.getByText(/request id:/i).first()];
   await expect(grid).toHaveScreenshot('grid.png', { mask: masks });
   ```

6. **Auto-waiting assertions** - Prefer `expect().toBeVisible()` over manual waits

### Debugging Guide: "Is it the test or the app?"
1. **Did the expected request happen?** Check Network tab in trace
2. **Did the locator resolve?** Check DOM snapshot in trace
3. **Was the test waiting on the right thing?** Replace `waitForTimeout` with assertions
4. **Re-run locally with `--debug`** Step through the test
5. **False green/false red audit** Inspect trace of failed attempts

### ESLint Enforcement
Use the provided `eslint-playwright.config.js` template to automatically enforce best practices:
- ❌ Bans `waitForTimeout`, `waitFor`, `waitForSelector`
- ⚠️ Warns on CSS/XPath selectors (prefer role-based locators)
- ✅ Enforces `test.step` usage for better trace readability
- ✅ Validates test structure and naming conventions

Copy `tests/templates/eslint-playwright.config.js` to your project root and extend your main ESLint config.

## 🔧 Maintenance

### Regular Tasks
- [ ] Update test templates when patterns change
- [ ] Review and update mocks quarterly
- [ ] Audit test coverage monthly
- [ ] Update E2E tests when UI changes

### Documentation
- [ ] Keep SSOT files updated
- [ ] Document complex test scenarios
- [ ] Maintain this README
- [ ] Update templates as needed

## 🛡️ Governance & Enforcement

### Folder Structure Enforcement
The test folder structure is **strictly enforced** through:

1. **SSOT Registry**: All tests must be registered in the appropriate SSOT file
2. **Linting Rules**: ESLint rules prevent creation of forbidden folders
3. **CI/CD Checks**: Automated validation during build process
4. **Pre-commit Hooks**: Prevent commits with invalid folder structure

### Violation Consequences
- **Development**: Linting errors and warnings
- **CI/CD**: Build failures and automatic cleanup
- **Code Review**: Mandatory rejection of PRs with violations
- **Documentation**: Automatic updates to SSOT files required

### Compliance Checklist
Before creating any new test files, ensure:
- [ ] Folder follows approved structure exactly
- [ ] Test file uses `.test.ts` or `.test.tsx` suffix
- [ ] Test is registered in appropriate SSOT file
- [ ] Template is used as starting point
- [ ] Naming convention is followed

## 📚 Resources

### Testing Frameworks
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

### Playwright Best Practices (Official)
- [Best Practices](https://playwright.dev/docs/best-practices) - Comprehensive guide
- [Locators Guide](https://playwright.dev/docs/locators) - Role/label/name strategy
- [Test Assertions](https://playwright.dev/docs/test-assertions) - Auto-waiting matchers
- [Fixtures](https://playwright.dev/docs/test-fixtures) - Clean setup/state
- [Timeouts](https://playwright.dev/docs/test-timeouts) - Don't sprinkle waits
- [Retries](https://playwright.dev/docs/test-retries) - CI-only safety net
- [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro) - CI failures, root-cause fast
- [Web Server](https://playwright.dev/docs/test-webserver) - Start stub/BFF/UI
- [Mock APIs](https://playwright.dev/docs/mock) - Component/contract tests only

---

## 🏷️ Tags Reference

### E2E Test Tags
- `@critical` - Critical user paths
- `@smoke` - Basic functionality checks
- `@visual` - Visual regression tests
- `@performance` - Performance tests
- `@accessibility` - A11y tests

### Vitest Test Tags
- `@ui` - UI component tests
- `@component` - React component tests
- `@hook` - Custom hook tests
- `@util` - Utility function tests
- `@integration` - Integration tests

---

*Last Updated: 2024-01-01*  
*Version: 1.0.0*
