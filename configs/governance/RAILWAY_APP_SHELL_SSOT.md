# 🚂 RAILWAY APP SHELL Interface — Single Source of Truth (SSOT) v2.0

**Date:** January 27, 2025  
**Applies to:** SparkTasks v7.x Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (Governs Railway Station Development)  
**Governance Compliance:** Anti-Drift v7.1 + MAPS4 Cosmic Innovation + SSOT Standards  

---

## 0) Purpose & Non‑Negotiables

This SSOT defines the **canonical interface** and **component contract** for all Railway components - the **cornerstone system** that provides project management capabilities with **MAPS4 Deep Space Canvas Cosmic Innovation**. It establishes the foundation for **elegance supreme** and **beyond Fortune 500** user experience across all Railway stations.

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

### 1.1 Railway Station Types (authoritative)

```ts
// Railway Station Types
export type RailwayStationType = 
  | "initiation"      // Project initiation and charter creation
  | "budget"          // Financial planning and budget tracking
  | "schedule"        // Timeline management and schedule tracking
  | "conductor"       // Project orchestration and coordination
  | "charter-wizard"  // Interactive project charter creation
  | "map"             // Project overview and navigation
  | "station"         // Generic station wrapper
  | "station-card"    // Station summary and navigation cards;

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

### 2.1 Railway Station Variants (authoritative)

```ts
// Railway Station Variant System
export const railwayStationVariants = cva(
  [
    // Foundation: Layout/shape - Clean Tailwind utilities
    'w-full max-w-7xl mx-auto',
    'space-y-8',
    
    // MAPS4 Foundation: Colors - Deep space foundation with aurora accents and cosmic cyan
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    
    // MAPS4 Foundation: Motion - Respect user preferences
    'transition-all duration-300 ease-out',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      variant: {
        // Default: Clean station with subtle elevation
        default: ['p-8', 'rounded-2xl'],
        
        // Elevated: Enhanced depth with stronger shadow
        elevated: [
          'p-10', 
          'rounded-3xl',
          'shadow-elevation-lg',
          'border border-aurora-accent'
        ],
        
        // Glass: Liquid glass materials with cosmic aesthetics
        glass: [
          'p-8',
          'rounded-2xl',
          'backdrop-blur-md backdrop-saturate-[135%]',
          'shadow-elevation-md',
          'border border-cosmic-border/30'
        ],
      },
      
      size: {
        // Clean systematic sizing with 8pt grid
        sm: ['space-y-6', 'p-6'],
        md: ['space-y-8', 'p-8'],
        lg: ['space-y-10', 'p-10'],
        xl: ['space-y-12', 'p-12'],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

### 2.2 Railway Station Header Template (mandatory)

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
```

### 2.3 Forbidden

* ❌ Hardcoded text sizes (use `ENHANCED_DESIGN_TOKENS.foundation.typography.*`)
* ❌ Hardcoded semantic colors (use MAPS4 cosmic system: `text-cosmic-success`, `border-cosmic-warning`, etc.)
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
// Colors - Use these tokens for all color states
ENHANCED_DESIGN_TOKENS.foundation.color.content.primary         // text-cosmic-light
ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary       // text-stellar-muted
ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas          // bg-deep-space
ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated        // bg-cosmic-void

// Semantic colors - Use MAPS4 cosmic system
"text-cosmic-success"    // Success states
"text-cosmic-warning"    // Warning states  
"text-cosmic-danger"     // Error states
"text-cosmic-info"       // Info states
"border-cosmic-success"  // Success borders
"border-cosmic-warning"  // Warning borders
"border-cosmic-danger"   // Error borders
"bg-cosmic-success/5"    // Success backgrounds
"bg-cosmic-warning/5"    // Warning backgrounds
"bg-cosmic-danger/5"     // Error backgrounds
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

1. **Station Renders**: Valid configuration renders without errors
2. **Progress State**: Progress indicators work correctly
3. **Navigation State**: Navigation between stations works
4. **User Interactions**: All interactive elements respond correctly
5. **Responsive Behavior**: Layout adapts to different viewport sizes
6. **Accessibility**: All interactive elements are keyboard accessible
7. **Performance**: Station renders in <200ms

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

### 6.1 Railway Station Structure

```tsx
// Railway Station Components
src/components/railway/
├── RailwayInitiationStation.tsx    # Project initiation and charter creation
├── RailwayBudgetStation.tsx        # Financial planning and budget tracking
├── RailwayScheduleStation.tsx      # Timeline management and schedule tracking
├── RailwayConductor.tsx            # Project orchestration and coordination
├── RailwayStation.tsx              # Generic station wrapper
├── RailwayStationCard.tsx          # Station summary and navigation cards
├── RailwayMap.tsx                  # Project overview and navigation
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

### 6.2 Railway Station Development Pattern

```tsx
// 1. Import required dependencies
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// 2. Define station variants using railwayStationVariants pattern
const [stationName]Variants = cva([...], { variants: {...} });

// 3. Define station interfaces
export interface [StationName]Props extends VariantProps<typeof [stationName]Variants> {
  // Station-specific props
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
  container: ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
  content: ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
  secondary: ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary,
  heading: ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
  body: ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
  label: ENHANCED_DESIGN_TOKENS.foundation.typography.label,
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
- [ ] Test all station variants and sizes
- [ ] Validate accessibility compliance
- [ ] Performance testing and optimization
- [ ] Documentation and examples

---

## 11) Anti-Drift Governance Compliance

**This SSOT enforces the following anti-drift rules:**

1. **Single Interface Pattern**: No dual APIs or competing implementations
2. **UI Architecture Flow**: Strict adherence to enhanced tokens only
3. **Validation Gates**: Zod schemas prevent invalid data from reaching components
4. **Test Contract**: Clear expectations prevent test/component drift
5. **No Hardcoded Values**: All visual states use semantic token layer
6. **Performance Standards**: Enforced render time and bundle size limits
7. **MAPS4 Compliance**: All components follow cosmic innovation principles

**Governance References:**
- `SUPERIOR_STATE_OF_THE_ART_DEVELOPMENT_MASTERPLAN.md` - Superior development strategy
- `ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Core anti-drift rules
- `UI_ARCHITECTURE_VALIDATION_REPORT_v7.md` - UI compliance standards
- `RAILWAY_IMPLEMENTATION_MASTER_PLAN_v7.md` - Railway implementation strategy

---

## 12) Reference Implementation Examples

### 12.1 RailwayInitiationStation.tsx
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption
- ✅ Railway station variants pattern
- ✅ Comprehensive form handling
- ✅ Progress tracking and validation

### 12.2 RailwayBudgetStation.tsx
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption
- ✅ Financial data management
- ✅ Budget tracking and analysis
- ✅ Variance reporting and visualization

### 12.3 RailwayScheduleStation.tsx
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption
- ✅ Timeline management
- ✅ Task and milestone tracking
- ✅ Critical path analysis

---

**This SSOT supersedes any prior implicit contracts for Railway components and is the authoritative source for all Railway station development.**

**The Railway system is the foundation for comprehensive project management, embodying MAPS4 cosmic innovation and beyond Fortune 500 standards.**

**Use this SSOT to develop all future Railway stations with guaranteed compliance and excellence.**
