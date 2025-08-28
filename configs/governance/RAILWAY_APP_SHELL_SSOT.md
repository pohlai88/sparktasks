# 🚂 RAILWAY APP SHELL Interface — Single Source of Truth (SSOT) v1.0

**Date:** August 28, 2025  
**Applies to:** SparkTasks v7.x Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (Governs App Shell Implementation)  
**Governance Compliance:** Anti-Drift v7.1 + Fortune 500 Standards + Superior Masterplan  

---

## 0) Purpose & Non‑Negotiables

This SSOT defines the **canonical interface** and **component contract** for the `RailwayAppShell` UI - the **cornerstone container** that houses all 24 Railway pages. It establishes the foundation for **elegance supreme** and **beyond Fortune 500** user experience.

**Non‑Negotiables**

* **No assumptions**: All props must be validated (Zod).
* **Token governance**: No hardcoded Tailwind; consume **enhanced tokens** only.
* **Single‑repo rules**: Follow the **UI architecture flow** (Tailwind → CSS variables → enhanced tokens → ui‑enhanced → railway components).
* **Strict TS**: `strict: true`, zero `any`, explicit bounds for numbers.
* **A11y**: Keyboard + screen reader compliant.
* **Performance**: <200ms render time for app shell.

---

## 1) Domain Model — `RailwayAppShell`

Represents the **main application container** that orchestrates navigation, layout, and content presentation for the entire Railway project management platform.

### 1.1 Type Definitions (authoritative)

```ts
// App Shell State Management
export type AppShellState = 
  | "loading"           // Initial loading state
  | "authenticated"     // User authenticated, app ready
  | "unauthenticated"   // User not authenticated
  | "error"             // Error state
  | "maintenance";      // Maintenance mode

// Navigation Item Structure
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label */
  label: string;
  /** Navigation path/route */
  path: string;
  /** Icon identifier (from icon system) */
  icon: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Whether this item is visible */
  isVisible: boolean;
  /** Optional badge content (notifications, counts) */
  badge?: {
    content: string | number;
    variant: "default" | "success" | "warning" | "error" | "info";
  };
  /** Child navigation items */
  children?: NavigationItem[];
  /** Required permissions to access this item */
  permissions?: string[];
}

// App Shell Configuration
export interface AppShellConfig {
  /** Application title */
  title: string;
  /** Application logo/icon */
  logo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** Theme configuration */
  theme: {
    mode: "light" | "dark" | "auto";
    primaryColor: string;
    accentColor: string;
  };
  /** Navigation configuration */
  navigation: {
    items: NavigationItem[];
    collapsed: boolean;
    collapsible: boolean;
  };
  /** Header configuration */
  header: {
    showUserMenu: boolean;
    showNotifications: boolean;
    showSearch: boolean;
    showBreadcrumbs: boolean;
  };
  /** Footer configuration */
  footer: {
    show: boolean;
    content: string;
    links: Array<{ label: string; href: string }>;
  };
}

// App Shell Props Interface
export interface RailwayAppShellProps {
  /** Application configuration */
  config: AppShellConfig;
  /** Current user information */
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    permissions: string[];
  };
  /** Current application state */
  state: AppShellState;
  /** Current route/path */
  currentPath: string;
  /** Navigation change handler */
  onNavigationChange?: (path: string) => void;
  /** Theme change handler */
  onThemeChange?: (theme: "light" | "dark" | "auto") => void;
  /** User logout handler */
  onLogout?: () => void;
  /** Error boundary handler */
  onError?: (error: Error) => void;
  /** Loading state handler */
  onLoadingComplete?: () => void;
  /** Content area render function */
  children: React.ReactNode;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional test ID */
  testId?: string;
}
```

### 1.2 Validation Schema (must gate all external data)

```ts
import { z } from "zod";

export const NavigationItemZ = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  path: z.string().min(1),
  icon: z.string().min(1),
  isActive: z.boolean(),
  isVisible: z.boolean(),
  badge: z.object({
    content: z.union([z.string(), z.number()]),
    variant: z.enum(["default", "success", "warning", "error", "info"]),
  }).optional(),
  children: z.array(z.lazy(() => NavigationItemZ)).optional(),
  permissions: z.array(z.string()).optional(),
});

export const AppShellConfigZ = z.object({
  title: z.string().min(1),
  logo: z.object({
    src: z.string().url(),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  theme: z.object({
    mode: z.enum(["light", "dark", "auto"]),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
    accentColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  }),
  navigation: z.object({
    items: z.array(NavigationItemZ),
    collapsed: z.boolean(),
    collapsible: z.boolean(),
  }),
  header: z.object({
    showUserMenu: z.boolean(),
    showNotifications: z.boolean(),
    showSearch: z.boolean(),
    showBreadcrumbs: z.boolean(),
  }),
  footer: z.object({
    show: z.boolean(),
    content: z.string(),
    links: z.array(z.object({
      label: z.string().min(1),
      href: z.string().url(),
    })),
  }),
});

export const RailwayAppShellPropsZ = z.object({
  config: AppShellConfigZ,
  user: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    role: z.string().min(1),
    permissions: z.array(z.string()),
  }).optional(),
  state: z.enum(["loading", "authenticated", "unauthenticated", "error", "maintenance"]),
  currentPath: z.string().min(1),
  onNavigationChange: z.function().args(z.string()).returns(z.void()).optional(),
  onThemeChange: z.function().args(z.enum(["light", "dark", "auto"])).returns(z.void()).optional(),
  onLogout: z.function().args().returns(z.void()).optional(),
  onError: z.function().args(z.instanceof(Error)).returns(z.void()).optional(),
  onLoadingComplete: z.function().args().returns(z.void()).optional(),
  children: z.any(), // React.ReactNode equivalent
  className: z.string().optional(),
  testId: z.string().optional(),
});

export type RailwayAppShellValidated = z.infer<typeof RailwayAppShellPropsZ>;
```

---

## 2) Component Contract — `RailwayAppShell`

The **main application container** that orchestrates the entire Railway experience with **elegance supreme**.

### 2.1 Props

```ts
export interface RailwayAppShellProps {
  /** Canonical app shell configuration — the only mandatory prop */
  config: AppShellConfig;

  /** Current user information (optional for unauthenticated state) */
  user?: User;

  /** Current application state */
  state: AppShellState;

  /** Current navigation path */
  currentPath: string;

  /** Content to render in the main area */
  children: React.ReactNode;

  /** Optional interaction hooks */
  onNavigationChange?: (path: string) => void;
  onThemeChange?: (theme: "light" | "dark" | "auto") => void;
  onLogout?: () => void;
  onError?: (error: Error) => void;
  onLoadingComplete?: () => void;

  /** Presentation variations */
  className?: string;
  testId?: string;
}
```

### 2.2 Derived/Computed (implementation guidance)

* **Navigation State**: Derive active navigation items from `currentPath`
* **Theme Application**: Apply theme based on `config.theme.mode` and user preference
* **Permission Filtering**: Filter navigation items based on user permissions
* **Responsive Behavior**: Adapt layout based on viewport size
* **Loading States**: Show appropriate loading indicators during state transitions

### 2.3 Forbidden

* ❌ Hardcoded navigation items or routes
* ❌ Hardcoded styling or layout constraints
* ❌ Direct DOM manipulation outside React patterns
* ❌ Network calls inside the component
* ❌ Bypassing the enhanced token system

---

## 3) Token Consumption (no hardcoded Tailwind)

**All visual states** must use the semantic token layer, e.g.:

```
layout → container tokens (app-shell | sidebar | header | footer | content)
navigation → navigation tokens (nav-item | nav-active | nav-hover)
theme → theme tokens (light | dark | auto)
surface → surface tokens (elevated | outlined | flat)
```

> If a token is missing: extend **tailwind.config.js → \:root CSS vars → enhanced‑tokens.ts**, then consume here. Do **not** inline any new classes.

---

## 4) Accessibility & UX

* **Keyboard Navigation**: Full keyboard support for all interactive elements
* **Screen Reader**: Comprehensive ARIA labels and descriptions
* **Focus Management**: Logical focus order and visible focus indicators
* **Color Contrast**: WCAG AAA compliance for all text and interactive elements
* **Motion**: Respect `prefers-reduced-motion` for animations
* **Responsive**: Perfect experience on all device sizes

---

## 5) Testing Contract (authoritative)

**Unit (Vitest + RTL)**

1. **App Shell Renders**: Valid configuration renders without errors
2. **Navigation State**: Active navigation items are correctly highlighted
3. **Theme Switching**: Theme changes are applied correctly
4. **User Authentication**: Different states render appropriate content
5. **Responsive Behavior**: Layout adapts to different viewport sizes
6. **Accessibility**: All interactive elements are keyboard accessible
7. **Performance**: App shell renders in <200ms

**Fixtures**

```ts
// tests/fixtures/railway/app-shell.json
{
  "validConfig": {
    "title": "SparkTasks Railway",
    "logo": {
      "src": "/logo.svg",
      "alt": "SparkTasks Logo",
      "width": 32,
      "height": 32
    },
    "theme": {
      "mode": "dark",
      "primaryColor": "#7cc4ff",
      "accentColor": "#78ffd6"
    },
    "navigation": {
      "items": [
        {
          "id": "dashboard",
          "label": "Dashboard",
          "path": "/dashboard",
          "icon": "dashboard",
          "isActive": true,
          "isVisible": true
        }
      ],
      "collapsed": false,
      "collapsible": true
    },
    "header": {
      "showUserMenu": true,
      "showNotifications": true,
      "showSearch": true,
      "showBreadcrumbs": true
    },
    "footer": {
      "show": true,
      "content": "© 2025 SparkTasks. All rights reserved.",
      "links": [
        {
          "label": "Privacy Policy",
          "href": "/privacy"
        }
      ]
    }
  }
}
```

**E2E (Playwright)**

* **Smoke**: App shell loads and displays navigation correctly
* **Navigation**: Clicking navigation items changes routes
* **Theme**: Theme switching works and persists
* **Responsive**: Layout adapts to mobile and desktop viewports
* **Accessibility**: Keyboard navigation works end-to-end

**A11y**

* **Axe-core pass**: No accessibility violations
* **Keyboard navigation**: All interactive elements accessible via keyboard
* **Screen reader**: Proper ARIA labels and descriptions
* **Color contrast**: WCAG AAA compliance

---

## 6) Implementation Architecture

### 6.1 Component Structure

```tsx
// Main App Shell Component
src/components/railway/app-shell/
├── RailwayAppShell.tsx           # Main container component
├── RailwayHeader.tsx             # Top header with user menu, notifications
├── RailwaySidebar.tsx            # Left navigation sidebar
├── RailwayContent.tsx            # Main content area
├── RailwayFooter.tsx             # Bottom footer
└── RailwayOverlay.tsx            # Modals, panels, floating elements

// Navigation Components
src/components/railway/navigation/
├── RailwayNavigation.tsx         # Main navigation component
├── RailwayNavigationItem.tsx     # Individual navigation item
├── RailwayNavigationGroup.tsx    # Grouped navigation items
├── RailwayBreadcrumbs.tsx        # Page breadcrumbs
└── RailwaySearch.tsx             # Global search component

// Layout Components
src/components/railway/layout/
├── RailwayLayout.tsx             # Page layout wrapper
├── RailwayGrid.tsx               # Grid system
├── RailwayContainer.tsx          # Content container
└── RailwaySection.tsx            # Content sections
```

### 6.2 State Management

```tsx
// App Shell State Management
export const useAppShell = () => {
  const [state, setState] = useState<AppShellState>("loading");
  const [currentPath, setCurrentPath] = useState("/");
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Navigation state
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [activeItem, setActiveItem] = useState<string>("");
  
  // User state
  const [user, setUser] = useState<User | undefined>();
  
  // Theme management
  const applyTheme = useCallback((newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    // Apply theme to document and persist
  }, []);
  
  // Navigation management
  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
    setActiveItem(path);
    // Trigger route change
  }, []);
  
  return {
    state,
    currentPath,
    theme,
    sidebarCollapsed,
    navigationItems,
    activeItem,
    user,
    setState,
    applyTheme,
    navigateTo,
    setSidebarCollapsed,
  };
};
```

### 6.3 Enhanced Token Integration

```tsx
// Enhanced Token Consumption
import { ENHANCED_DESIGN_TOKENS } from "@/design/enhanced-tokens";

const appShellClasses = {
  container: ENHANCED_DESIGN_TOKENS.layout.appShell.container,
  sidebar: ENHANCED_DESIGN_TOKENS.layout.appShell.sidebar,
  header: ENHANCED_DESIGN_TOKENS.layout.appShell.header,
  content: ENHANCED_DESIGN_TOKENS.layout.appShell.content,
  footer: ENHANCED_DESIGN_TOKENS.layout.appShell.footer,
  navigation: ENHANCED_DESIGN_TOKENS.navigation.container,
  navItem: ENHANCED_DESIGN_TOKENS.navigation.item,
  navActive: ENHANCED_DESIGN_TOKENS.navigation.active,
  navHover: ENHANCED_DESIGN_TOKENS.navigation.hover,
};
```

---

## 7) Design Excellence - Sir Steve Jobs Philosophy

### 7.1 Elegance Supreme

* **Minimalist Layout**: Clean, uncluttered interface that focuses on content
* **Perfect Proportions**: Golden ratio and 8pt grid system for harmonious spacing
* **Liquid Glass Materials**: Sophisticated backdrop blur and transparency effects
* **Cosmic Color Palette**: Deep space canvas with aurora accents

### 7.2 Thoughtful Interactions

* **Smooth Transitions**: 300ms cubic-bezier transitions for all state changes
* **Micro-Interactions**: Subtle hover effects and focus states
* **Progressive Disclosure**: Information revealed progressively to reduce cognitive load
* **Contextual Actions**: Actions appear when and where they're needed

### 7.3 Heart-Driven Innovation

* **Emotional Connection**: Design that users love and trust
* **Human Touch**: Technology that feels human and caring
* **Purpose-Driven**: Every element serves a meaningful goal
* **Inspirational**: Design that motivates and empowers

---

## 8) Performance Requirements

### 8.1 Render Performance

* **Initial Render**: <200ms for app shell
* **Navigation**: <100ms for route changes
* **Theme Switching**: <50ms for theme application
* **Responsive**: <100ms for layout adaptations

### 8.2 Bundle Optimization

* **Code Splitting**: Lazy load navigation and content areas
* **Tree Shaking**: Remove unused navigation items and features
* **Asset Optimization**: Optimize logos and icons
* **Caching**: Cache navigation structure and user preferences

---

## 9) DoD for RailwayAppShell Stabilization

* ✅ `RailwayAppShell` types + Zod schema shipped under `src/types/railway.ts`
* ✅ `RailwayAppShell` consumes **ui‑enhanced** primitives + tokens only
* ✅ Unit tests (7) + fixtures added with 100% branch coverage
* ✅ E2E tests cover navigation, theme switching, and responsive behavior
* ✅ A11y checks green; keyboard support proven
* ✅ No hardcoded classes; tokens extended only via approved flow
* ✅ Performance targets met (<200ms render time)
* ✅ Responsive design works perfectly on all devices

---

## 10) Reference Implementation Notes (non-binding)

* Use `<Container>`, `<Grid>`, `<Card>` from `ui-enhanced`
* Implement smooth transitions for all state changes
* Use CSS Grid for responsive layout management
* Implement proper focus management for keyboard navigation
* Use CSS custom properties for theme switching
* Implement proper error boundaries and loading states

---

## 11) Anti-Drift Governance Compliance

**This SSOT enforces the following anti-drift rules:**

1. **Single Interface Pattern**: No dual APIs or competing implementations
2. **UI Architecture Flow**: Strict adherence to enhanced tokens only
3. **Validation Gates**: Zod schemas prevent invalid data from reaching components
4. **Test Contract**: Clear expectations prevent test/component drift
5. **No Hardcoded Values**: All visual states use semantic token layer
6. **Performance Standards**: Enforced render time and bundle size limits

**Governance References:**
- `SUPERIOR_STATE_OF_THE_ART_DEVELOPMENT_MASTERPLAN.md` - Superior development strategy
- `ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Core anti-drift rules
- `UI_ARCHITECTURE_VALIDATION_REPORT_v7.md` - UI compliance standards
- `RAILWAY_IMPLEMENTATION_MASTER_PLAN_v7.md` - Railway implementation strategy

---

**This SSOT supersedes any prior implicit contracts for RailwayAppShell and is the authoritative source for all RailwayAppShell implementations.**

**The RailwayAppShell is the foundation upon which all 24 Railway pages will be built, embodying elegance supreme and beyond Fortune 500 standards.**
