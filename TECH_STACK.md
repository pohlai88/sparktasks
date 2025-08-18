# TECH_STACK.md

Last reviewed: 2025-08-15  
Review cadence: Quarterly (every 3 months) or before major releases

## Runtimes
- Node: 22.18.0 (latest LTS)
- npm: bundled with Node 22

## Frameworks & libs
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
	- **UI Components**: Custom components with Tailwind utilities (lean MVP approach)
	- **State Management**: Zustand (lightweight, TypeScript-first, local-first)
	- **Forms**: React Hook Form + Zod validation
	- **Icons**: Lucide React (tree-shakeable, consistent)
	- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
	- **Utils**: clsx + tailwind-merge for conditional classes
	- **Component Library Strategy**: Custom components for MVP, optional shadcn/ui adoption when complex patterns emerge
- **Backend**: Node.js (API routes / Fastify) - *future implementation*
- **Database**: Prisma + PostgreSQL - *future implementation*
- **Testing**: Vitest (unit/integration) + Playwright (e2e) + Testing Library (React components)

### Frontend Decision Rationale
- **React 18**: Mature ecosystem, excellent TypeScript support, concurrent features for performance
- **Vite**: Instant HMR, fast builds, native ES modules, simpler than Next.js for local-first MVP
- **Tailwind CSS**: Utility-first styling, mobile-responsive, optimized bundle size, consistent design system
- **Custom Components**: Lean MVP approach, zero abstraction overhead, rapid development velocity
- **Zustand**: Lightweight state (2KB), TypeScript-first, perfect for local-first architecture vs Redux complexity
- **React Hook Form**: Performance-focused forms, minimal re-renders, excellent Zod integration
- **Testing Library**: DOM-focused testing, accessibility-friendly, encourages best practices

**Component Library Strategy**: Start with custom Tailwind components for lean MVP. Add specific Radix primitives only when complex interaction patterns emerge (dialogs, dropdowns, etc.). Post-MVP: Consider shadcn/ui adoption when enterprise features require sophisticated component patterns.

**Hosting Strategy**: Vite enables static hosting (Netlify, Vercel, S3) with client-side routing. Next.js would require SSR hosting and more complex infrastructure.

## Package Management Standards

### Core Dependencies (MVP-Required)
- **React Stack**: react@^18, react-dom@^18, @types/react, @types/react-dom
- **TypeScript Foundation**: typescript@^5.9.2
- **Build System**: vite@^6.3.5 + @vitejs/plugin-react@^4.7.0
- **Styling**: tailwindcss@^3.4.17 + autoprefixer@^10.4.21 + postcss@^8.5.6
- **State Management**: zustand@^4.5.7 (0.5MB gzipped, TypeScript-native)
- **Forms**: react-hook-form@^7.62.0 + @hookform/resolvers + zod@^3.25.76
- **Icons**: lucide-react@^0.295.0 (tree-shakeable, 24px grid system)
- **Utilities**: clsx@^2.1.1 + tailwind-merge@^2.6.0 (conditional classes)

### Development Dependencies
- **Testing**: vitest@^3.2.4 + @vitest/coverage-v8@^3.2.4 + playwright@^1.54.2 + @testing-library/react@^13.4.0
- **TypeScript**: @typescript-eslint/eslint-plugin + @typescript-eslint/parser
- **Code Quality**: eslint@^8.57.1 + prettier@^3.4.2 + eslint-plugin-react-hooks + eslint-plugin-tailwindcss
- **Build Tools**: All Vite ecosystem dependencies

### Component Strategy (SSOT Decision - August 2025)
- **MVP Approach**: Custom Tailwind components (rapid development, zero abstraction)
- **Complex UI Patterns**: Add specific Radix primitives only when needed (dialog, select, etc.)
- **No Blanket UI Library**: Maintain lean bundle size and development velocity
- **Future Consideration**: shadcn/ui for enterprise features post-MVP validation

### Bundle Size Targets
- **Main bundle**: <500KB parsed (currently ~200KB)
- **Vendor chunks**: React + dependencies <300KB
- **Dynamic imports**: Route-based splitting
- **Asset optimization**: SVG optimization + WebP images

### Security & Updates
- Monitor security advisories via `npm audit`  
- Update dependencies quarterly via `npm outdated`
- Test compatibility with staging deployments first

## Service Boundaries
- Monorepo: Both frontend and backend live in the same repo for now (single package).
- Dependency sharing: Shared types and utilities in `/src/shared`.
- Workspace tooling: Using npm workspaces for now.

### Monorepo Migration Triggers
Consider migrating to pnpm/yarn when:
- ≥5 packages in the workspace
- npm install time >30 seconds consistently
- node_modules duplication >500 MB
- Team size >10 developers (benefit from pnpm's stricter hoisting)

## Testing Scope
- **Unit tests**: `src/**/*.test.{ts,tsx}` (Vitest + Testing Library for React components)
- **Integration tests**: `test/integration/*.test.ts` (Vitest, Node.js environment)
- **E2E tests**: `test/e2e/*.spec.ts` (Playwright, multi-browser + mobile)
- **Local run**: `npm test` (runs all suites: unit → integration → e2e)
- **CI**: Runs all test suites on every PR and push to main

**Environment Strategy**:
- React components: jsdom environment with Testing Library matchers
- Shared utilities: Node.js environment for faster execution
- E2E workflows: Real browsers (Chromium, Firefox, WebKit) + mobile viewports

**Coverage Requirements**:
- Statements: 90%
- Branches: 80% 
- Functions: 85%
- Lines: 90%

**Test Scripts**:
- `npm run test:unit` — React components + utilities (jsdom + node environments)
- `npm run test:integration` — Cross-component workflows (node environment)
- `npm run test:e2e` — Full user journeys (multi-browser + mobile)
- `npm run test:coverage` — All tests with coverage report (includes React components)
- `npm run test:watch` — Watch mode for development
- `npm run test:ci` — CI-optimized with controlled threading (`--maxThreads=2`)

## Development Configuration
**Vite + React Setup**:
- **React Plugin**: `@vitejs/plugin-react` for Fast Refresh and JSX transforms
- **Path aliases**: `@shared` → `src/shared`, `@` → `src`, `@components` → `src/components`, `@stores` → `src/stores`, `@utils` → `src/utils`
- **Dev server**: Port 3000 with LAN access (`host: true`) for mobile testing, HMR over network (`hmr: { host: '0.0.0.0' }`)
- **Preview server**: Port 4173 for production build testing
- **Build output**: `dist/` with sourcemaps, `emptyOutDir: true`, assets organized under `assets/`

**Code Quality & Linting**:
- **ESLint 8.57.1**: TypeScript-aware linting with React 18 and accessibility rules
- **Prettier**: Automated code formatting with Tailwind CSS class sorting
- **Pre-commit hooks**: Enforced linting and formatting validation
- **Zero warnings policy**: `--max-warnings 0` prevents warning accumulation
- **VS Code integration**: Tailwind CSS IntelliSense extension with enhanced autocomplete

**Tailwind CSS Configuration**:
- **Content**: Scans `src/**/*.{js,ts,jsx,tsx}` and `index.html`
- **Custom theme**: SparkTasks brand colors (primary/secondary palettes)
- **Typography**: Inter font family with system fallbacks
- **Utilities**: Custom component classes (`.btn-primary`, `.btn-secondary`, `.card`)
- **PostCSS**: Autoprefixer for browser compatibility

**TypeScript Configuration**: 
- **Strict mode** with enhanced compiler hygiene (`forceConsistentCasingInFileNames`, `exactOptionalPropertyTypes`)
- **React support**: `jsx: "react-jsx"` for modern JSX transforms
- **Path mapping**: Mirrors Vite aliases for consistent imports
- **Incremental compilation**: `incremental: true` for faster local type-checking
- **Target**: ES2022 with DOM + DOM.Iterable support for modern browsers

**Test Infrastructure**: Enterprise-grade test environment with React component support

**Enhanced Vitest Configuration**:
- **Multi-environment**: Node.js for utilities, jsdom for React components
- **Type-aware testing**: TypeScript type checking in parallel with test execution
- **Performance**: V8 coverage provider, controlled threading for CI (`maxThreads: 4, minThreads: 1`)
- **Timeout protection**: 30-second test timeout prevents hanging async tests
- **Environment matching**: Automatic environment selection based on file patterns

**React Testing Setup**:
- **Testing Library**: `@testing-library/react` + `@testing-library/user-event` for component interaction
- **Jest DOM matchers**: `@testing-library/jest-dom` for enhanced assertions
- **Mock setup**: Browser API mocks (matchMedia, localStorage, crypto.randomUUID)
- **Environment isolation**: Clean DOM state between tests, automatic cleanup

**Test Organization**:
- **Unit tests**: `src/**/*.test.{ts,tsx}` - React components + utility functions
- **Integration tests**: `test/integration/**/*.test.ts` - Cross-component workflows  
- **E2E tests**: `test/e2e/**/*.spec.ts` - Full user journeys (Playwright)
- **Setup files**: Environment-specific setup (`setup.node.ts`, `setup.jsdom.ts`)

**Configuration**:
- `test/setup.ts`: Global environment initialization 
- `test/setup.jsdom.ts`: React Testing Library + DOM API mocks
- `test/setup.node.ts`: Node.js-specific test utilities
- `test/global.d.ts`: Type declarations (isolated from production)
- `test/tsconfig.json`: Test-specific TypeScript configuration
- **Coverage thresholds**: 90% statements, 80% branches, 85% functions, 90% lines

### Test Scripts
- `npm run test:unit` — React components + utilities (auto-environment detection)
- `npm run test:integration` — Cross-component workflows (Node.js environment)
- `npm run test:e2e` — Full user journeys (multi-browser + mobile viewports)
- `npm run test:ci` — CI-optimized execution with controlled threading
- `npm test` — All test suites (unit → integration → e2e)

### E2E Testing Strategy

**Enhanced Playwright Configuration**:
- **Multi-browser testing**: Chromium, Firefox, WebKit
- **Mobile viewport testing**: iPhone 14 simulation for responsive behavior
- **Failure analysis**: Automatic video recording, screenshots, and traces on failure
- **CI optimization**: Dot reporter + JUnit XML for build system integration

**Test Organization**:
- Desktop tests validate core functionality across browsers
- Mobile tests ensure responsive behavior and API compatibility
- Serial test support for stateful scenarios
- Parallel execution for maximum speed (configurable per test suite)

**Debugging Features**:
- `video: 'retain-on-failure'` — Video recordings of failed test runs
- `screenshot: 'only-on-failure'` — Screenshots at failure points
- `trace: 'on-first-retry'` — Detailed execution traces for debugging
- 2-minute server startup timeout prevents CI hanging

**CI Integration**:
- JUnit XML output for test result integration
- Artifact upload for failure analysis (videos, screenshots, traces)
- Automatic PR comments with failure summaries
- Mobile performance testing with Lighthouse integration

## Node Version Pinning
**Strategy**: Defense-in-depth with two control points:

1. **`.nvmrc`** (18.16.0) — Developer convenience for `nvm use` 
2. **`.npmrc`** (`engine-strict=true`) — Installation protection against wrong versions

**Why both?** Different failure modes:
- `.nvmrc` fails silently if nvm not installed → `engine-strict` catches this
- `engine-strict` only triggers on npm operations → `.nvmrc` guides setup

All three files (`.nvmrc`, `package.json` engines, TECH_STACK.md) must declare the same version.

### npmrc Control Strategy
**Purpose**: Project-level `.npmrc` overrides user/system npm config to ensure consistent builds.

**Hierarchy** (npm config precedence, highest to lowest):
1. **Project `.npmrc`** ← **We control this** (version: c:/path/to/project/.npmrc)
2. User `.npmrc` (~/.npmrc) — Developer's personal config
3. Global `.npmrc` (/etc/npmrc) — System-wide config  
4. npm built-in defaults

**Required Settings**:
- `engine-strict=true` — Block installs on wrong Node version
- More settings added as needed (registry, proxy, etc.)

**Drift Control**: `check-tech-stack.js` validates `.npmrc` exists and contains required settings.

## Change process
- Update `.nvmrc`, `TECH_STACK.md`, and `package.json` "engines" together.
- Must pass `all-drift-checks` workflow before merge.
- At least one reviewer with build/tooling experience required.
- Run `node tools/run-validators.js` before pushing.
- PR title should start with "Stack:" for stack changes.
- CI will fail if `.nvmrc` and `package.json` disagree.

## Compatibility Table
| Tool/Lib              | Min Node | Current Version | Last Verified | Notes                          |
|-----------------------|----------|-----------------|---------------|--------------------------------|
| React                 | 16.x     | 18.3.1          | 2025-08-15    | Concurrent features, React 18  |
| Vite                  | 14.x     | 6.3.5           | 2025-08-15    | Native ES modules, fast HMR    |
| Tailwind CSS          | 12.x     | 3.4.17          | 2025-08-15    | Modern CSS features            |
| Zustand               | 12.x     | 4.5.7           | 2025-08-15    | TypeScript-first state         |
| React Hook Form       | 14.x     | 7.62.0          | 2025-08-15    | Performance-focused forms      |
| Testing Library       | 14.x     | 13.4.0          | 2025-08-15    | React 18 compatible            |
| Vitest                | 14.x     | 3.2.4           | 2025-08-15    | Native ES modules support      |
| Playwright            | 12.x     | 1.54.2          | 2025-08-15    | Multi-browser + mobile         |
| ESLint                | 12.x     | 8.57.1          | 2025-08-15    | TypeScript + React rules       |
| Prettier              | 10.x     | 3.4.2           | 2025-08-15    | Code formatting + Tailwind     |

Note: Update "Last Verified" during quarterly reviews or when upgrading major versions.

