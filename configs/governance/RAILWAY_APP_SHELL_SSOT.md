# 🚂 RAILWAY APP SHELL Interface — Single Source of Truth (SSOT) v4.0

**Date:** January 27, 2025  
**Applies to:** SparkTasks v7.x Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (Governs ALL Railway Station Development)  
**Governance Compliance:** Anti-Drift v7.1 + MAPS4 Cosmic Innovation + SSOT Standards  
**Document Status:** ✅ CONSOLIDATED - Single source of truth for all Railway components  

---

## 📋 **Document Consolidation Notice**

**This SSOT consolidates and supersedes all previous Railway-related governance documents:**
- ✅ **RAILWAYSTATION_INTERFACE_SSOT.md** (v1.0) - **CONSOLIDATED**
- ✅ **RAILWAY_APP_SHELL_SSOT.md** (v2.0) - **UPGRADED TO v4.0**
- 🎯 **This document is now the single, authoritative source for all Railway development**

**Benefits of consolidation:**
- 🚫 **No more confusion** between multiple documents
- 🎯 **Single source of truth** for all Railway components
- 🔄 **Easier maintenance** and updates
- 📚 **Comprehensive coverage** of all 10 Railway stations
- 🚀 **MAPS4 compliance** with enhanced tokens and primitive utilities

---

## 0) Purpose & Non‑Negotiables

This SSOT defines the **canonical interface** and **component contract** for all Railway components - the **cornerstone system** that provides project management capabilities with **MAPS4 Deep Space Canvas Cosmic Innovation**. It establishes the foundation for **elegance supreme** and **beyond Fortune 500** user experience across all Railway stations.

> Note: This App Shell SSOT is a wrapper over the Foundation Governance SSOT. It defines consumer contracts and must not introduce new design values or parallel maps. All names live in tailwind.config.js, values in src/index.css, and helpers in src/design/enhanced-tokens.ts.

**Non‑Negotiables**

* **No assumptions**: All props must be validated (Zod).
* **Token governance**: No hardcoded Tailwind; consume **enhanced tokens** only.
* **Single‑repo rules**: Follow the **UI architecture flow** (Tailwind → CSS variables → enhanced tokens → ui‑enhanced → railway components).
* **Strict TS**: `strict: true`, zero `any`, explicit bounds for numbers.
* **A11y**: Keyboard + screen reader compliant.
* **Performance**: <200ms render time for all Railway stations.
* **MAPS4 Compliance**: All components must follow MAPS4 cosmic innovation principles.

---

## 1) Domain Model — Railway Component System

Represents the **comprehensive Railway project management platform** with multiple specialized stations for different aspects of project lifecycle management.

### 1.1 Railway Station Types (authoritative) - ACTUAL IMPLEMENTATION

```ts
// Railway Station Types - ACTUAL IMPLEMENTATION
export type RailwayStationType = 
  | "initiation"      // RailwayInitiationStation - Project initiation and charter creation
  | "budget"          // RailwayBudgetStation - Financial planning and budget tracking  
  | "schedule"        // RailwayScheduleStation - Timeline management and schedule tracking
  | "conductor"       // RailwayConductor - Project orchestration and coordination
  | "charter-wizard"  // CharterWizard - Interactive project charter creation
  | "map"             // RailwayMap - Project overview and navigation
  | "station"         // RailwayStation - Generic station wrapper
  | "station-card";   // RailwayStationCard - Station summary and navigation cards

// Railway Station State
export type RailwayStationState = 
  | "loading"           // Initial loading state
  | "ready"             // Station ready for interaction
  | "processing"        // Processing user input
  | "error"             // Error state
  | "maintenance";      // Maintenance mode

// Railway Station Progress
export interface RailwayStationProgress {
  /** Current completion percentage (0-100) */
  percentage: number;
  /** Current step identifier */
  currentStep: string;
  /** Total number of steps */
  totalSteps: number;
  /** Whether the station is complete */
  isComplete: boolean;
  /** Whether the station can advance to next */
  canAdvance: boolean;
  /** Whether the station can rollback */
  canRollback: boolean;
}

// Railway Station Navigation
export interface RailwayStationNavigation {
  /** Previous station in the workflow */
  previous?: string;
  /** Next station in the workflow */
  next?: string;
  /** Whether this station is required */
  required: boolean;
  /** Station order in the workflow */
  order: number;
  /** Dependencies that must be completed first */
  dependencies: string[];
}
```

### 1.2 Railway Station Base Interface (authoritative)

```ts
// Base Railway Station Props Interface
export interface RailwayStationBaseProps {
  /** Station configuration and metadata */
  config: RailwayStationConfig;
  /** Current station state */
  state: RailwayStationState;
  /** Current progress information */
  progress: RailwayStationProgress;
  /** Navigation information */
  navigation: RailwayStationNavigation;
  /** Content to render in the station */
  children?: React.ReactNode;
  /** Optional interaction hooks */
  onSave?: (data: any) => void;
  onAdvance?: () => void;
  onRollback?: () => void;
  onError?: (error: Error) => void;
  /** Presentation variations */
  variant?: "default" | "elevated" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  testId?: string;
}

// Railway Station Configuration
export interface RailwayStationConfig {
  /** Station identifier */
  id: string;
  /** Station display name */
  name: string;
  /** Station description */
  description: string;
  /** Station icon/emoji */
  icon: string;
  /** Station category */
  category: "planning" | "execution" | "monitoring" | "closing";
  /** Station capabilities */
  capabilities: string[];
  /** Required permissions */
  permissions: string[];
  /** Station metadata */
  metadata: Record<string, any>;
}
```

### 1.3 Validation Schema (must gate all external data)

```ts
import { z } from "zod";

export const RailwayStationProgressZ = z.object({
  percentage: z.number().min(0).max(100),
  currentStep: z.string().min(1),
  totalSteps: z.number().int().positive(),
  isComplete: z.boolean(),
  canAdvance: z.boolean(),
  canRollback: z.boolean(),
});

export const RailwayStationNavigationZ = z.object({
  previous: z.string().optional(),
  next: z.string().optional(),
  required: z.boolean(),
  order: z.number().int().positive(),
  dependencies: z.array(z.string()),
});

export const RailwayStationConfigZ = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  category: z.enum(["planning", "execution", "monitoring", "closing"]),
  capabilities: z.array(z.string()),
  permissions: z.array(z.string()),
  metadata: z.record(z.any()),
});

export const RailwayStationBasePropsZ = z.object({
  config: RailwayStationConfigZ,
  state: z.enum(["loading", "ready", "processing", "error", "maintenance"]),
  progress: RailwayStationProgressZ,
  navigation: RailwayStationNavigationZ,
  children: z.any().optional(), // React.ReactNode equivalent
  onSave: z.function().args(z.any()).returns(z.void()).optional(),
  onAdvance: z.function().args().returns(z.void()).optional(),
  onRollback: z.function().args().returns(z.void()).optional(),
  onError: z.function().args(z.instanceof(Error)).returns(z.void()).optional(),
  variant: z.enum(["default", "elevated", "glass"]).optional(),
  size: z.enum(["sm", "md", "lg", "xl"]).optional(),
  className: z.string().optional(),
  testId: z.string().optional(),
});

export type RailwayStationBaseValidated = z.infer<typeof RailwayStationBasePropsZ>;
```

---

## 2) Component Contract — Railway Station System

The **comprehensive Railway project management platform** with specialized stations for different project lifecycle phases.

### 2.1 Railway Station Variants (authoritative) - ACTUAL IMPLEMENTATION

```ts
// Railway Station Variant System - 100% Enhanced Tokens (ACTUAL PATTERN)
export const railwayStationVariants = cva(
  [
    // Foundation: Layout/shape - Enhanced design tokens only
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-7xl'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg,
    
    // MAPS4 Foundation: Colors - Deep space foundation with aurora accents and cosmic cyan
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    
    // MAPS4 Foundation: Motion - Respect user preferences
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
  ],
  {
    variants: {
      variant: {
        // Default: Clean station with subtle elevation
        default: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl']
        ],
        
        // Elevated: Enhanced depth with stronger shadow
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['10'], 
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['3xl'],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora
        ],
        
        // Glass: Liquid glass materials with cosmic aesthetics
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl'],
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['150'],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30']
        ],
      },
      
      size: {
        // Clean systematic sizing with 8pt grid - Enhanced tokens only
        sm: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md,
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']
        ],
        md: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg,
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8']
        ],
        lg: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl,
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['10']
        ],
        xl: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['12']
        ],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

### 2.2 Railway Station Header Template (mandatory) - ACTUAL IMPLEMENTATION

```tsx
/**
 * Railway [Station Name] Component - MAPS4 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Sir Steve Jobs Cosmic Innovation: ✅ Inspirational, memorable, industry-leading
 * - AAA Compliance: ✅ WCAG 2.2 with cosmic color harmony
 * - Liquid Glass Materials: ✅ Governed vibrancy system with cosmic aesthetics
 * - Radix Compatibility: ✅ Polymorphic pattern ready
 * - Anti-Drift Enforcement: ✅ 100% tokenized, zero hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Railway [Station Name] variants → Cosmic user experience
 * - MAPS4 Guidelines → Railway [Station Name] behavior → Accessibility excellence
 * - Railway Ecosystem → [Station Name] → Project Management
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|focus|error)
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 */
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Sir Steve Jobs Cosmic Innovation: ✅ Inspirational, memorable, industry-leading
 * - AAA Compliance: ✅ WCAG 2.2 with cosmic color harmony
 * - Liquid Glass Materials: ✅ Governed vibrancy system with cosmic aesthetics
 * - Radix Compatibility: ✅ Polymorphic pattern ready
 * - Anti-Drift Enforcement: ✅ 100% tokenized, zero hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Railway [Station Name] variants → Cosmic user experience
 * - MAPS4 Guidelines → Railway [Station Name] behavior → Accessibility excellence
 * - Railway Ecosystem → [Station Name] → Project Management
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|focus|error)
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 */
```

### 2.3 Forbidden

* ❌ Hardcoded text sizes (use `ENHANCED_DESIGN_TOKENS.foundation.typography.*`)
* ❌ Hardcoded semantic colors (do not use raw `text-*`, `border-*`, `bg-*`)
  - Always consume via `ENHANCED_DESIGN_TOKENS.foundation.color.*` tokens (e.g., `color.content.primary`, `color.feedback.success.muted`, `color.surface.elevated`, `color.border.default`).
* ❌ **Hardcoded layout classes** (use `ENHANCED_DESIGN_TOKENS.foundation.layout.*`)
  - ❌ `text-center`, `text-left`, `text-right` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.*`
  - ❌ `w-*`, `h-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.width.*` and `height.*`
  - ❌ `p-*`, `px-*`, `py-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.padding.*`
  - ❌ `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.margin.*`
  - ❌ `border`, `border-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.border.*`
  - ❌ `rounded-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.*`
  - ❌ `bg-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.color.surface.*`
  - ❌ `grid-cols-*`, `grid-rows-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.grid.*`
  - ❌ `grid` display classes → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid`
  - ❌ `flex` and related → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex` + `ENHANCED_DESIGN_TOKENS.foundation.layout.flex.*`
  - ❌ `space-y-*`, `space-x-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.*`
  - ❌ `gap-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.*`
  - ❌ `flex-1`, `flex-auto`, `flex-none` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.*`
* ❌ Direct DOM manipulation outside React patterns
* ❌ Network calls inside the component
* ❌ Bypassing the enhanced token system
* ❌ Non-compliant header templates

---

## 3) Token Consumption (no hardcoded Tailwind)

**All visual states** must use the semantic token layer from `ENHANCED_DESIGN_TOKENS.foundation.*`:

### 3.1 Typography Tokens (mandatory)

```tsx
// Typography - Use these tokens for all text elements
ENHANCED_DESIGN_TOKENS.foundation.typography.display.large      // text-4xl font-bold
ENHANCED_DESIGN_TOKENS.foundation.typography.display.medium     // text-3xl font-bold  
ENHANCED_DESIGN_TOKENS.foundation.typography.display.small      // text-2xl font-semibold
ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h1         // text-3xl font-semibold
ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2         // text-2xl font-semibold
ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3         // text-xl font-semibold
ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4         // text-lg font-medium
ENHANCED_DESIGN_TOKENS.foundation.typography.body.large         // text-lg font-normal
ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium        // text-base font-normal
ENHANCED_DESIGN_TOKENS.foundation.typography.body.small         // text-sm font-normal
ENHANCED_DESIGN_TOKENS.foundation.typography.label              // text-sm font-medium
ENHANCED_DESIGN_TOKENS.foundation.typography.caption            // text-xs font-normal
```

### 3.2 Color Tokens (mandatory)

```tsx
// Colors - Use these tokens for all color states (tokens only)
ENHANCED_DESIGN_TOKENS.foundation.color.content.primary          // text-cosmic-light
ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary        // text-stellar-muted
ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas           // deep-space background
ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated         // cosmic-void background

// Semantic colors via tokens (no raw class strings)
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.subtle  // subtle success background
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.border  // success border
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted   // success text

ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.subtle  // subtle warning background
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.border  // warning border
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted   // warning text

ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.subtle    // subtle error background
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.border    // error border
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted     // error text

ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.subtle     // subtle info background
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.border     // info border
ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.muted      // info text
```

> If a token is missing: extend **tailwind.config.js → \:root CSS vars → enhanced‑tokens.ts**, then consume here. Do **not** inline any new classes.

### 3.3 Layout Tokens (mandatory)

**All layout patterns** must use the semantic layout token layer from `ENHANCED_DESIGN_TOKENS.foundation.layout.*`:

```tsx
// Text Alignment - Cosmic content positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center      // text-center - Centered cosmic content
ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.left        // text-left - Left-aligned cosmic content
ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.right       // text-right - Right-aligned cosmic content
ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.justify     // text-justify - Justified cosmic content

// Grid System - Cosmic layout structure
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[1]       // grid-cols-1 - Single column cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[2]       // grid-cols-2 - Two column cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[3]       // grid-cols-3 - Three column cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[4]       // grid-cols-4 - Four column cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[6]       // grid-cols-6 - Six column cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[12]      // grid-cols-12 - Twelve column cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns.auto     // grid-cols-auto - Auto-sizing cosmic columns

// Responsive Grid Patterns - Progressive cosmic expansion
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2']    // grid-cols-1 md:grid-cols-2
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-3']    // grid-cols-1 md:grid-cols-3
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-4']    // grid-cols-1 md:grid-cols-4
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['2-4']    // grid-cols-2 md:grid-cols-4
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-3']  // grid-cols-1 md:grid-cols-2 lg:grid-cols-3
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4']  // grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// Grid Gap Spacing - Cosmic harmony
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.none        // gap-0 - No gap, seamless cosmic connection
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs          // gap-1 - Extra small gap, subtle cosmic separation
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm          // gap-2 - Small gap, gentle cosmic breathing
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md          // gap-4 - Medium gap, balanced cosmic spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg          // gap-6 - Large gap, generous cosmic breathing
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl          // gap-8 - Extra large gap, spacious cosmic layout
ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap['2xl']      // gap-12 - Double extra large gap, expansive cosmic space

// Flexbox System - Cosmic flexible layouts
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row   // flex-row - Horizontal cosmic flow
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.col    // flex-col - Vertical cosmic flow
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction['row-reverse'] // flex-row-reverse - Reversed horizontal cosmic flow
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction['col-reverse'] // flex-col-reverse - Reversed vertical cosmic flow

// Flexbox Alignment - Cosmic positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.center // items-center justify-center - Centered cosmic alignment
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.start  // items-start justify-start - Start-aligned cosmic positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.end    // items-end justify-end - End-aligned cosmic positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.between // items-center justify-between - Space-between cosmic distribution
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.around  // items-center justify-around - Space-around cosmic distribution
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.evenly  // items-center justify-evenly - Even cosmic distribution

// Individual Flexbox Controls
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center    // items-center - Center-aligned cosmic items
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start     // items-start - Start-aligned cosmic items
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.end       // items-end - End-aligned cosmic items
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center  // justify-center - Center-justified cosmic content
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between // justify-between - Space-between cosmic content
ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.around  // justify-around - Space-around cosmic content

// Spacing Patterns - Cosmic content separation
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.none   // space-y-0 - No vertical spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xs     // space-y-1 - Extra small cosmic separation
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm     // space-y-2 - Small cosmic breathing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md     // space-y-4 - Medium cosmic spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg     // space-y-6 - Large cosmic breathing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl     // space-y-8 - Extra large cosmic space
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl'] // space-y-12 - Double extra large cosmic space

ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.none // space-x-0 - No horizontal spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.xs   // space-x-1 - Extra small cosmic separation
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.sm   // space-x-2 - Small cosmic breathing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.md   // space-x-4 - Medium cosmic spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.lg   // space-x-6 - Large cosmic breathing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.xl   // space-x-8 - Extra large cosmic space
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster['2xl'] // space-x-12 - Double extra large cosmic space

// Responsive Spacing - Progressive cosmic expansion
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.responsive['xs-md'] // space-y-1 md:space-y-4 - Progressive cosmic spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.responsive['sm-lg'] // space-y-2 md:space-y-6 - Progressive cosmic spacing
ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.responsive['md-xl'] // space-y-4 md:space-y-8 - Progressive cosmic spacing

// Display Patterns - Cosmic visibility control
ENHANCED_DESIGN_TOKENS.foundation.layout.display.block         // block - Block-level cosmic element
ENHANCED_DESIGN_TOKENS.foundation.layout.display.inline        // inline - Inline cosmic element
ENHANCED_DESIGN_TOKENS.foundation.layout.display.flex          // flex - Flex cosmic container
ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid          // grid - Grid cosmic container
ENHANCED_DESIGN_TOKENS.foundation.layout.display.hidden        // hidden - Hidden cosmic element

// Position Patterns - Cosmic positioning system
ENHANCED_DESIGN_TOKENS.foundation.layout.position.relative     // relative - Relative cosmic positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.position.absolute     // absolute - Absolute cosmic positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.position.fixed        // fixed - Fixed cosmic positioning
ENHANCED_DESIGN_TOKENS.foundation.layout.position.sticky       // sticky - Sticky cosmic positioning

// Overflow Patterns - Cosmic content containment
ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.hidden       // overflow-hidden - Hidden cosmic overflow
ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.auto         // overflow-auto - Auto cosmic overflow
ENHANCED_DESIGN_TOKENS.foundation.layout.overflow.scroll       // overflow-scroll - Scrollable cosmic overflow
```

### 3.4 Layout Recipes (recommended)

**Pre-built layout combinations** for common cosmic design patterns:

```tsx
// Centered content layout with cosmic aesthetics
ENHANCED_DESIGN_TOKENS.recipes.layout.center                   // flex items-center justify-center text-center

// Stack layout with cosmic spacing
ENHANCED_DESIGN_TOKENS.recipes.layout.stack.base               // flex flex-col
ENHANCED_DESIGN_TOKENS.recipes.layout.stack.spacing.md         // space-y-4

// Cluster layout with cosmic spacing
ENHANCED_DESIGN_TOKENS.recipes.layout.cluster.base             // flex items-center
ENHANCED_DESIGN_TOKENS.recipes.layout.cluster.spacing.md       // space-x-4

// Grid layout with cosmic responsiveness
ENHANCED_DESIGN_TOKENS.recipes.layout.grid.base                // grid
ENHANCED_DESIGN_TOKENS.recipes.layout.grid.responsive['1-2-3'] // grid-cols-1 md:grid-cols-2 lg:grid-cols-3
ENHANCED_DESIGN_TOKENS.recipes.layout.grid.gap.md              // gap-4

// Panel layout with cosmic aesthetics
ENHANCED_DESIGN_TOKENS.recipes.layout.panel.base               // rounded-lg border border-cosmic-border bg-cosmic-void p-6
ENHANCED_DESIGN_TOKENS.recipes.layout.panel.elevated           // shadow-md
ENHANCED_DESIGN_TOKENS.recipes.layout.panel.interactive        // hover:shadow-lg transition-shadow duration-normal
```

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

1. **Station Renders**: Valid configuration renders without errors
2. **Progress State**: Progress indicators work correctly
3. **Navigation State**: Navigation between stations works
4. **User Interactions**: All interactive elements respond correctly
5. **Responsive Behavior**: Layout adapts to different viewport sizes
6. **Accessibility**: All interactive elements are keyboard accessible
7. **Performance**: Station renders in <200ms
8. **Layout Compliance**: All layout patterns use enhanced tokens (NEW)
9. **Token Validation**: No hardcoded layout classes remain (NEW)

**E2E (Playwright)**

* **Smoke**: Station loads and displays content correctly
* **Navigation**: Station navigation works end-to-end
* **Responsive**: Layout adapts to mobile and desktop viewports
* **Accessibility**: Keyboard navigation works end-to-end

**A11y**

* **Axe-core pass**: No accessibility violations
* **Keyboard navigation**: All interactive elements accessible via keyboard
* **Screen reader**: Proper ARIA labels and descriptions
* **Color contrast**: WCAG AAA compliance

---

## 6) Implementation Architecture
### 6.0 Foundation References & Baselines
- Foundation SSOT: `configs/governance/FOUNDATION_GOVERNANCE_SSOT.md` (truth layers, prohibited patterns, audits)
- Category baselines (apply to Railway surfaces): Card/Panel, Dialog/Overlay
- Motion helpers: `getMotionPattern`, `getComponentMotion`, `getMotionPreset`, `getReducedMotionVariant()`
- Z-index: `getZIndexClass('modal'|'popover'|'tooltip')`

### 6.1 Railway Station Structure - ACTUAL IMPLEMENTATION

```tsx
// Railway Station Components - ACTUAL FILE STRUCTURE
src/components/railway/
├── RailwayInitiationStation.tsx    # Project initiation and charter creation (792 lines)
├── RailwayBudgetStation.tsx        # Financial planning and budget tracking
├── RailwayScheduleStation.tsx      # Timeline management and schedule tracking  
├── RailwayConductor.tsx            # Project orchestration and coordination (807 lines)
├── CharterWizard.tsx               # Interactive project charter creation
├── RailwayMap.tsx                  # Project overview and navigation (451 lines)
├── RailwayStation.tsx              # Generic station wrapper
├── RailwayStationCard.tsx          # Station summary and navigation cards
└── index.ts                        # Railway component exports

// Enhanced UI Components (consumed by Railway stations)
src/components/ui-enhanced/
├── Badge.tsx                       # Status and label badges
├── Button.tsx                      # Interactive buttons
├── Card.tsx                        # Content containers
├── Input.tsx                       # Form input fields
├── Textarea.tsx                    # Multi-line text input
├── Tabs.tsx                        # Tabbed content
├── Progress.tsx                    # Progress indicators
└── Calendar.tsx                    # Date selection
```

### 6.2 Railway Station Development Pattern - ACTUAL IMPLEMENTATION

```tsx
// 1. Import required dependencies (ACTUAL PATTERN)
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';

import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedInput } from '@/components/ui-enhanced/Input';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { EnhancedTextarea } from '@/components/ui-enhanced/Textarea';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// 2. Define station variants using railwayStationVariants pattern (ACTUAL PATTERN)
const railway[StationName]Variants = cva(
  [
    // Foundation: Layout/shape - Enhanced design tokens only
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-6xl'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg,
    
    // MAPS4 Foundation: Colors - Deep space foundation with aurora accents and cosmic cyan
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    
    // MAPS4 Foundation: Motion - Respect user preferences
    ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
    ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
  ],
  {
    variants: {
      variant: {
        default: [ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl']],
        elevated: [/* enhanced tokens only */],
        glass: [/* enhanced tokens only */],
      },
      size: {
        sm: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']],
        md: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8']],
        lg: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['10']],
        xl: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['12']],
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

// 3. Define station interfaces (ACTUAL PATTERN)
export interface [StationName]Props extends VariantProps<typeof railway[StationName]Variants> {
  // Station-specific props following actual implementation patterns
}

// 4. Implement station component with mandatory header template
export function [StationName]({ variant = 'default', size = 'md', ...props }: [StationName]Props) {
  // Component implementation using enhanced tokens only
}
```

### 6.3 Enhanced Token Integration

```tsx
// Enhanced Token Consumption - NO hardcoded values
import { ENHANCED_DESIGN_TOKENS } from "@/design/enhanced-tokens";

const stationClasses = {
  // Color tokens
  container: ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
  content: ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
  secondary: ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
  
  // Typography tokens
  heading: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
  body: ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
  label: ENHANCED_DESIGN_TOKENS.foundation.typography.label,
  
  // Layout tokens - Complete coverage
  center: ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
  grid: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
  gap: ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
  stack: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md,
  cluster: ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.cluster.md,
  flexCol: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.col,
  flexCenter: ENHANCED_DESIGN_TOKENS.foundation.layout.flex.alignment.center,
  
  // Width and container tokens
  fullWidth: ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
  maxWidth: ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-7xl'],
  centerContainer: ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
  
  // Elevation and depth tokens
  elevation: ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
  elevationMedium: ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
  
  // Backdrop and glass material tokens
  blurMedium: ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
  saturateComic: ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['150'],
  
  // Border tokens
  borderDefault: ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
  borderRadius: ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl'],
  borderAurora: ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora,
  borderCosmic: ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30'],
  
  // Motion tokens
  transition: ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
  motionRespect: ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
};

// Layout Recipe Usage - Recommended for common patterns
const layoutRecipes = {
  centeredContent: ENHANCED_DESIGN_TOKENS.recipes.layout.center,
  verticalStack: cn(
    ENHANCED_DESIGN_TOKENS.recipes.layout.stack.base,
    ENHANCED_DESIGN_TOKENS.recipes.layout.stack.spacing.md
  ),
  responsiveGrid: cn(
    ENHANCED_DESIGN_TOKENS.recipes.layout.grid.base,
    ENHANCED_DESIGN_TOKENS.recipes.layout.grid.responsive['1-2-3'],
    ENHANCED_DESIGN_TOKENS.recipes.layout.grid.gap.md
  ),
  glassMaterial: cn(
    ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
    ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['150'],
    ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
    ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30']
  ),
  elevatedPanel: cn(
    ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
    ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora
  ),
};
```

---

## 7) Design Excellence - MAPS4 Cosmic Innovation

### 7.1 MAPS4 Foundation

* **Deep Space Canvas**: Primary cosmic app background with stellar aesthetics
* **Aurora Accents**: Interactive elements with aurora accent system
* **Cosmic Cyan**: Secondary cosmic color for highlights and accents
* **Liquid Glass Materials**: Sophisticated backdrop blur and transparency effects

### 7.2 Cosmic Typography System

* **Display Text**: Large, bold text for cosmic impact
* **Semantic Hierarchy**: Clear content structure with cosmic harmony
* **Body Text**: Readable cosmic text with proper contrast
* **Specialized Text**: Labels, captions, and interactive text with cosmic aesthetics

### 7.3 Cosmic Color Harmony

* **Success States**: Cosmic success colors for positive feedback
* **Warning States**: Cosmic warning colors for attention
* **Error States**: Cosmic danger colors for critical issues
* **Info States**: Cosmic info colors for informational content

---

## 8) Performance Requirements

### 8.1 Render Performance

* **Initial Render**: <200ms for all Railway stations
* **State Changes**: <100ms for state transitions
* **Navigation**: <100ms for station changes
* **Responsive**: <100ms for layout adaptations

### 8.2 Bundle Optimization

* **Code Splitting**: Lazy load station content
* **Tree Shaking**: Remove unused station features
* **Asset Optimization**: Optimize station assets
* **Caching**: Cache station configurations and user preferences

---

## 9) DoD for Railway Station Development

* ✅ Station types + Zod schema shipped under `src/types/railway.ts`
* ✅ Station consumes **ui‑enhanced** primitives + tokens only
* ✅ Unit tests with 100% branch coverage
* ✅ E2E tests cover station functionality and navigation
* ✅ A11y checks green; keyboard support proven
* ✅ No hardcoded classes; tokens extended only via approved flow
* ✅ **Layout compliance verified; all layout patterns use enhanced tokens (NEW)**
* ✅ Performance targets met (<200ms render time)
* ✅ Responsive design works perfectly on all devices
* ✅ MAPS4 cosmic innovation principles implemented
* ✅ Anti-drift governance compliance verified

---

## 10) Railway Station Development Checklist

### 10.1 Pre-Development

- [ ] Review existing Railway stations for patterns
- [ ] Identify required enhanced tokens
- [ ] Plan station variants and sizing
- [ ] Define station interfaces and validation

### 10.2 Development

- [ ] Use mandatory header template
- [ ] Implement railwayStationVariants pattern
- [ ] Use enhanced tokens for all visual states
- [ ] Implement proper error handling
- [ ] Add loading and error states

### 10.3 Post-Development

- [ ] Verify no hardcoded values remain
- [ ] **Verify no hardcoded layout classes remain (NEW)**
- [ ] **Validate layout token compliance (NEW)**
- [ ] Test all station variants and sizes
- [ ] Validate accessibility compliance
- [ ] Performance testing and optimization
- [ ] Documentation and examples

---

## 10.4 Refactor Checklist (one-pass ready)
- Replace bracketed transforms:
  - `active:scale-[0.98]` → `active:${ENHANCED_DESIGN_TOKENS.foundation.transform.scale['98']}`
  - `hover:translate-y-[-2px]` → `hover:-translate-y-0.5`
- Focus ring: use `ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary`
- Motion:
  - Use `getMotionPattern`, `getComponentMotion`, `getMotionPreset`
  - Reduced motion via `${getReducedMotionVariant()}:...` when composing variants
- Z-index (overlay stack): `getZIndexClass('overlay')` for backdrops, `getZIndexClass('modal')` for dialog content
- Category baselines: prefer `recipes.layout.card.*` for panels, `recipes.motion.modal.*` for overlays

// NEW: Replace raw layout + color classes with tokens
- Replace raw display/layout:
  - `grid`, `grid-cols-*`, `grid-rows-*` → `foundation.layout.display.grid` + `foundation.layout.grid.*`
  - `flex`, `flex-*`, `items-*`, `justify-*` → `foundation.layout.display.flex` + `foundation.layout.flex.*`
- Replace raw color classes:
  - `text-*`, `bg-*`, `border-*` → `foundation.color.content.*`, `foundation.color.surface.*`, `foundation.color.border.*`, `foundation.color.feedback.*`

CLI drift checks (run locally/CI):
```bash
rg -n "\b(translate|scale|rotate|opacity)-\[" src/components/railway && exit 1 || echo OK
rg -n "@media" src/components/railway --glob '!**/*.css' && exit 1 || echo OK
# NEW: Layout + color hardcoded usage checks
rg -n "className=.*\bgrid\b" src/components/railway --glob '!**/enhanced-tokens.ts' && exit 1 || echo OK
rg -n "className=.*\bflex\b" src/components/railway --glob '!**/enhanced-tokens.ts' && exit 1 || echo OK
rg -n "className=.*\btext-" src/components/railway --glob '!**/enhanced-tokens.ts' && exit 1 || echo OK
```

---

## 11) Anti-Drift Governance Compliance

**This SSOT enforces the following anti-drift rules:**

1. **Single Interface Pattern**: No dual APIs or competing implementations
2. **UI Architecture Flow**: Strict adherence to enhanced tokens only
3. **Validation Gates**: Zod schemas prevent invalid data from reaching components
4. **Test Contract**: Clear expectations prevent test/component drift
5. **No Hardcoded Values**: All visual states use semantic token layer
6. **No Hardcoded Layout**: All layout patterns use enhanced layout tokens (NEW)
7. **Performance Standards**: Enforced render time and bundle size limits
8. **MAPS4 Compliance**: All components follow cosmic innovation principles

**Governance References:**
- `SUPERIOR_STATE_OF_THE_ART_DEVELOPMENT_MASTERPLAN.md` - Superior development strategy
- `ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Core anti-drift rules
- `UI_ARCHITECTURE_VALIDATION_REPORT_v7.md` - UI compliance standards
- `RAILWAY_IMPLEMENTATION_MASTER_PLAN_v7.md` - Railway implementation strategy

---

## 12) Reference Implementation Examples - ACTUAL IMPLEMENTATION

### 12.1 RailwayInitiationStation.tsx (792 lines)
- ✅ MAPS4 header template compliance with full compliance matrix
- ✅ Enhanced token consumption with railwayInitiationStationVariants
- ✅ Railway station variants pattern with default/elevated/glass variants
- ✅ Comprehensive form handling with EnhancedInput, EnhancedTextarea, EnhancedTabs
- ✅ Progress tracking and validation with EnhancedProgress
- ✅ Enhanced UI component integration (Badge, Button, Card, Progress, Tabs)

### 12.2 RailwayConductor.tsx (807 lines)
- ✅ MAPS4 header template compliance with Fortune 500 standards
- ✅ Enhanced token consumption with railwayConductorVariants
- ✅ Project orchestration and workflow management
- ✅ Enhanced UI component integration (Badge, Button, Card, Progress, Tabs)
- ✅ Project workflow interfaces and state management

### 12.3 RailwayMap.tsx (451 lines)
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption with railwayMapVariants
- ✅ Project overview and navigation system
- ✅ Station card layout and navigation patterns
- ✅ Enhanced UI component integration for map visualization

---

**This SSOT supersedes any prior implicit contracts for Railway components and is the authoritative source for all Railway station development.**

**The Railway system is the foundation for comprehensive project management, embodying MAPS4 cosmic innovation and beyond Fortune 500 standards.**

**Use this SSOT to develop all future Railway stations with guaranteed compliance and excellence.**

---

## 🎯 **Key Optimizations Applied**

### ✅ **Accuracy Improvements**
- **Actual Implementation Patterns**: Updated all examples to match real Railway component implementations
- **File Structure**: Corrected component file names and line counts
- **Import Patterns**: Added actual Enhanced UI component imports used in Railway stations
- **Variant Patterns**: Updated to match actual railway[StationName]Variants naming convention

### ✅ **Completeness Enhancements**
- **Header Template**: Added full compliance matrix and architecture integration details
- **Development Pattern**: Enhanced with actual import statements and variant structure
- **Reference Examples**: Updated with actual line counts and implementation details
- **Component Integration**: Documented actual Enhanced UI component usage

### ✅ **Token Compliance**
- **Enhanced Token Usage**: All examples now use actual ENHANCED_DESIGN_TOKENS patterns
- **Layout Token Coverage**: Complete coverage of layout token system
- **Anti-Drift Enforcement**: Zero hardcoded values, 100% tokenized approach

**The Railway App Shell SSOT is now fully optimized and aligned with actual implementation patterns.**
