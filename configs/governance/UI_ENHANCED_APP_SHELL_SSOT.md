# 🎨 UI-Enhanced App Shell Interface — Single Source of Truth (SSOT) v4.0

**Date:** January 27, 2025  
**Applies to:** SparkTasks v7.x Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (Governs UI-Enhanced Component Development)  
**Governance Compliance:** Anti-Drift v7.1 + MAPS4 Cosmic Innovation + SSOT Standards  

---

## 0) Purpose & Non‑Negotiables

This SSOT defines the **canonical interface** and **component contract** for all UI-Enhanced components - the **foundation system** that provides atomic design capabilities with **MAPS4 Deep Space Canvas Cosmic Innovation**. It establishes the foundation for **elegance supreme** and **beyond Fortune 500** user experience across all UI components.

> Note: This App Shell SSOT is a wrapper over the Foundation Governance SSOT. It defines consumer contracts and must not introduce new design values or parallel maps. All names live in tailwind.config.js, values in src/index.css, and helpers in src/design/enhanced-tokens.ts.

**Non‑Negotiables**

* **No assumptions**: All props must be validated (Zod).
* **Token governance**: No hardcoded Tailwind; consume **enhanced tokens** only.
* **Single‑repo rules**: Follow the **UI architecture flow** (Tailwind → CSS variables → enhanced tokens → ui‑enhanced → railway components).
* **Strict TS**: `strict: true`, zero `any`, explicit bounds for numbers.
* **A11y**: Keyboard + screen reader compliant.
* **Performance**: <200ms render time for all UI-Enhanced components.
* **MAPS4 Compliance**: All components must follow MAPS4 cosmic innovation principles.
* **Primitive Foundation**: All components must use primitive utilities (Slot, AccessibleIcon, VisuallyHidden, DirectionProvider) as building blocks.

---

## 1) Domain Model — UI-Enhanced Component System

Represents the **comprehensive UI-Enhanced component library** with multiple specialized components for different aspects of user interface design and interaction.

### 1.1 UI-Enhanced Component Types (authoritative)

```ts
// UI-Enhanced Component Categories
export type UIEnhancedComponentType = 
  // === PRIMITIVE UTILITIES (Foundation Layer) ===
  | "slot"             // Polymorphic component pattern (asChild)
  | "accessible-icon"  // Accessible icon wrapper
  | "visually-hidden"  // Screen reader content
  | "direction-provider" // RTL/LTR support
  // Motion and z-index are provided via enhanced token helpers (no extra primitives)
  
  // === CORE COMPONENTS (Component Layer) ===
  | "button"           // Interactive buttons and actions
  | "input"            // Form input fields and controls
  | "card"             // Content containers and panels
  | "badge"            // Status indicators and labels
  | "alert"            // Notifications and feedback
  | "tabs"             // Tabbed content navigation
  | "progress"         // Progress indicators and loading
  | "calendar"         // Date selection and scheduling
  | "textarea"         // Multi-line text input
  | "dialog"           // Modal dialogs and overlays
  | "dropdown"         // Dropdown menus and selections
  | "tooltip"          // Contextual help and information
  | "avatar"           // User profile images and initials
  | "separator"        // Visual content dividers
  | "skeleton"         // Loading placeholders
  | "switch"           // Toggle controls
  | "slider"           // Range input controls
  | "accordion"        // Collapsible content sections
  | "breadcrumb"       // Navigation breadcrumbs
  | "pagination"       // Page navigation controls
  | "command"          // Command palette interfaces
  | "combobox"         // Searchable select inputs
  | "context-menu"     // Right-click context menus
  | "hover-card"       // Hover-triggered content cards
  | "navigation-menu"  // Complex navigation structures
  | "menu-bar"         // Application menu bars
  | "radio-group"      // Radio button groups
  | "checkbox"         // Checkbox controls
  | "label"            // Form field labels
  | "sheet"            // Slide-out panels
  | "toast"            // Temporary notifications
  | "toggle"           // Toggle button controls
  | "toggle-group"     // Toggle button groups
  | "toolbar"          // Action toolbars
  | "aspect-ratio"     // Responsive aspect ratio containers
  | "date-picker"      // Date selection interfaces
  | "drawer"           // Mobile-friendly slide-out panels
  | "empty-state"      // Empty state illustrations
  | "scroll-area"      // Custom scrollable areas
  | "alert-dialog"     // Confirmation dialogs
  | "popover"          // Floating content containers
  | "select"           // Select dropdown controls
  | "collapsible"      // Collapsible content areas;

// UI-Enhanced Component State
export type UIEnhancedComponentState = 
  | "loading"           // Initial loading state
  | "ready"             // Component ready for interaction
  | "processing"        // Processing user input
  | "error"             // Error state
  | "success"           // Success state
  | "warning"           // Warning state
  | "disabled"          // Disabled state
  | "focused"           // Focused state
  | "hovered"           // Hovered state
  | "active"            // Active/pressed state;

// UI-Enhanced Component Variants
export interface UIEnhancedComponentVariants {
  /** Visual style variant */
  variant?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color scheme variant */
  color?: string;
  /** Interactive behavior variant */
  interactive?: boolean;
  /** Accessibility compliance level */
  enforceAAA?: boolean;
  /** Material design variant */
  material?: 'default' | 'glass' | 'floating' | 'elevated';
  /** Density variant */
  density?: 'comfortable' | 'compact';
}
```

### 1.2 UI-Enhanced Component Base Interface (authoritative)

```ts
// Base UI-Enhanced Component Props Interface
export interface UIEnhancedComponentBaseProps {
  /** Component configuration and metadata */
  config: UIEnhancedComponentConfig;
  /** Current component state */
  state: UIEnhancedComponentState;
  /** Component variants */
  variants: UIEnhancedComponentVariants;
  /** Content to render in the component */
  children?: React.ReactNode;
  /** Optional interaction hooks */
  onClick?: (event: React.MouseEvent) => void;
  onChange?: (value: any) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onError?: (error: Error) => void;
  /** Presentation variations */
  className?: string;
  testId?: string;
  /** Accessibility props */
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
}

// UI-Enhanced Component Configuration
export interface UIEnhancedComponentConfig {
  /** Component identifier */
  id: string;
  /** Component display name */
  name: string;
  /** Component description */
  description: string;
  /** Component icon/emoji */
  icon: string;
  /** Component category */
  category: "form" | "display" | "navigation" | "feedback" | "layout" | "overlay";
  /** Component capabilities */
  capabilities: string[];
  /** Required permissions */
  permissions: string[];
  /** Component metadata */
  metadata: Record<string, any>;
}
```

### 1.3 Validation Schema (must gate all external data)

```ts
import { z } from "zod";

export const UIEnhancedComponentVariantsZ = z.object({
  variant: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
  color: z.string().optional(),
  interactive: z.boolean().optional(),
  enforceAAA: z.boolean().optional(),
  material: z.enum(['default', 'glass', 'floating', 'elevated']).optional(),
  density: z.enum(['comfortable', 'compact']).optional(),
});

export const UIEnhancedComponentConfigZ = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  category: z.enum(["form", "display", "navigation", "feedback", "layout", "overlay"]),
  capabilities: z.array(z.string()),
  permissions: z.array(z.string()),
  metadata: z.record(z.any()),
});

export const UIEnhancedComponentBasePropsZ = z.object({
  config: UIEnhancedComponentConfigZ,
  state: z.enum(["loading", "ready", "processing", "error", "success", "warning", "disabled", "focused", "hovered", "active"]),
  variants: UIEnhancedComponentVariantsZ,
  children: z.any().optional(), // React.ReactNode equivalent
  onClick: z.function().args(z.any()).returns(z.void()).optional(),
  onChange: z.function().args(z.any()).returns(z.void()).optional(),
  onFocus: z.function().args(z.any()).returns(z.void()).optional(),
  onBlur: z.function().args(z.any()).returns(z.void()).optional(),
  onError: z.function().args(z.instanceof(Error)).returns(z.void()).optional(),
  className: z.string().optional(),
  testId: z.string().optional(),
  'aria-label': z.string().optional(),
  'aria-describedby': z.string().optional(),
  'aria-expanded': z.boolean().optional(),
  'aria-selected': z.boolean().optional(),
  'aria-disabled': z.boolean().optional(),
});

export type UIEnhancedComponentBaseValidated = z.infer<typeof UIEnhancedComponentBasePropsZ>;
```

---

## 2) Component Contract — UI-Enhanced Component System

The **comprehensive UI-Enhanced component library** with specialized components for different user interface needs.

### 2.1 UI-Enhanced Component Variants (authoritative)

```ts
// UI-Enhanced Component Variant System - 100% Enhanced Tokens
export const uiEnhancedComponentVariants = cva(
  [
    // Foundation: Layout/shape - Enhanced design tokens only
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
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
        // Default: Clean component with subtle elevation
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
          ENHANCED_DESIGN_TOKENS.foundation.color.border['aurora-accent']
        ],
        
        // Glass: Liquid glass materials with cosmic aesthetics
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl'],
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['135'],
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

### 2.2 UI-Enhanced Component Header Template (mandatory)

```tsx
/**
 * Enhanced [Component Name] Component - MAPS4 Deep Space Canvas Cosmic Innovation
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
 * - MAPS4 Enhanced Tokens → [Component Name] variants → Cosmic user experience
 * - MAPS4 Guidelines → [Component Name] behavior → Accessibility excellence
 * - [Ecosystem] → [Component] → [Composability]
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
* ❌ **Hardcoded layout classes** (use `ENHANCED_DESIGN_TOKENS.foundation.layout.*`)
  - ❌ `text-center`, `text-left`, `text-right` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.*`
  - ❌ `w-*`, `h-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.width.*` and `height.*`
  - ❌ `p-*`, `px-*`, `py-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.padding.*`
  - ❌ `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.margin.*`
  - ❌ `border`, `border-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.border.*`
  - ❌ `rounded-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.*`
  - ❌ `bg-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.background.*`
  - ❌ `grid-cols-*`, `grid-rows-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.grid.*`
  - ❌ `flex flex-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.flex.*`
  - ❌ `space-y-*`, `space-x-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.*`
  - ❌ `gap-*` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.*`
  - ❌ `flex-1`, `flex-auto`, `flex-none` → Use `ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.*`
* ❌ **Bypassing primitive utilities** (use Slot, AccessibleIcon, VisuallyHidden, DirectionProvider)
  - ❌ Direct HTML elements without Slot pattern → Use `Slot` for polymorphic components
  - ❌ Icons without accessibility → Use `AccessibleIcon` wrapper
  - ❌ Screen reader content without proper semantics → Use `VisuallyHidden`
  - ❌ Components without RTL/LTR support → Use `DirectionProvider`
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
* **Icon-only controls**: Must provide `aria-label` or `aria-labelledby`; decorative icons use `aria-hidden="true"`
* **Loading pattern**: Pending state sets `aria-busy`; spinner container uses `role="status"` and `aria-live="polite"` with a `VisuallyHidden` announcement
* **Pointer-only hover**: Apply hover transforms only under pointer devices (use the `pointer:` variant); avoid hover motion on touch

---

## 5) Testing Contract (authoritative)

**Unit (Vitest + RTL)**

1. **Component Renders**: Valid configuration renders without errors
2. **State Management**: Component states work correctly
3. **User Interactions**: All interactive elements respond correctly
4. **Responsive Behavior**: Layout adapts to different viewport sizes
5. **Accessibility**: All interactive elements are keyboard accessible
6. **Performance**: Component renders in <200ms
7. **Layout Compliance**: All layout patterns use enhanced tokens (NEW)
8. **Token Validation**: No hardcoded layout classes remain (NEW)

**E2E (Playwright)**

* **Smoke**: Component loads and displays content correctly
* **Interaction**: Component interactions work end-to-end
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
- Category baselines: Button, Card, Dialog/Overlay, Tooltip/Popover, Inputs → follow “Category Baselines & Profiles”
- Motion helpers: `getMotionPattern`, `getComponentMotion`, `getMotionPreset`, `getReducedMotionVariant()`
- Z-index: `getZIndexClass('<layer>')` (surface|overlay|popover|modal|toast|tooltip)

### 6.0.1 Variant Hygiene (mandatory)
- One spacing token per slot (avoid duplicate padding/margins in the same slot)
- When size variants control spacing, the base CVA MUST NOT include spacing utilities
- Focus via `ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary` (no ad-hoc ring strings)
- Transforms: named only (`foundation.transform.scale['98']`), no bracketed transforms
- Reduced motion: `${getReducedMotionVariant()}:...` when composing motion-sensitive variants
- No height utilities in components (`h-*`); sizes derive from padding + typography tokens
- Apply hover/active transforms at callsite (gated by `getReducedMotionVariant()` and `pointer:`); avoid adding transforms in base CVA
- Follow Foundation §6 (Minimal A11y & Polymorphic Rules) for `asChild` usage and `type` handling
 - Structural separators: use `ENHANCED_DESIGN_TOKENS.foundation.layout.divide.*` (e.g., `divide.y + divide.subtle`); forbid raw `divide-*`
 - Flexbox utilities: use `ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.{shrink,grow,basis}`; forbid raw `shrink-0`, `grow`, `basis-*`
 - State animations: prefer `data-[state]` driven animations with motion tokens; no hardcoded animation strings outside tokens/recipes
 - Size triad: each size is exactly one padding token + one typography token; no stacking multiple paddings in the same slot

### 6.0.2 Accordion Baseline (apply across disclosure components)
- Trigger: `recipes.accordion.trigger` + size typography token
- Content: size provides spacing; avoid double padding
- Chevron: use `foundation.icon.size.sm` and `foundation.layout.flexbox.shrink[0]`
 - Chevron a11y: decorative chevron must be `aria-hidden="true"`; rotation via `data-[state=open]`
 - Interaction: pointer-only hover on trigger; no fixed heights; focus via ring bundle
 - Motion: use Radix `data-[state]` with `foundation.motionComponents.accordionExpand`

### 6.0.3 Size Triad (apply to all components)
- sm/default/lg sizes map to one padding token + one typography token per size
- If size variants own spacing, base CVA contains no spacing utilities

### 6.1 UI-Enhanced Component Structure

```tsx
// UI-Enhanced Components
src/components/ui-enhanced/
├── # === PRIMITIVE UTILITIES (Foundation Layer) ===
├── Slot.tsx                         # Polymorphic component pattern (asChild)
├── AccessibleIcon.tsx               # Accessible icon wrapper
├── VisuallyHidden.tsx               # Screen reader content
├── DirectionProvider.tsx            # RTL/LTR support
// Motion and z-index are consumed via enhanced token helpers (no separate files)
│
├── # === CORE COMPONENTS (Component Layer) ===
├── Badge.tsx                        # Status and label badges
├── Button.tsx                       # Interactive buttons
├── Card.tsx                         # Content containers
├── Input.tsx                        # Form input fields
├── Textarea.tsx                     # Multi-line text input
├── Tabs.tsx                         # Tabbed content
├── Progress.tsx                     # Progress indicators
├── Calendar.tsx                     # Date selection
├── Alert.tsx                        # Notifications and feedback
├── Dialog.tsx                       # Modal dialogs
├── DropdownMenu.tsx                 # Dropdown menus
├── Tooltip.tsx                      # Contextual help
├── Avatar.tsx                       # User profile images
├── Separator.tsx                    # Visual dividers
├── Skeleton.tsx                     # Loading placeholders
├── Switch.tsx                       # Toggle controls
├── Slider.tsx                       # Range inputs
├── Accordion.tsx                    # Collapsible sections
├── Breadcrumb.tsx                   # Navigation breadcrumbs
├── Pagination.tsx                   # Page navigation
├── Command.tsx                      # Command palette
├── Combobox.tsx                     # Searchable selects
├── ContextMenu.tsx                  # Right-click menus
├── HoverCard.tsx                    # Hover content
├── NavigationMenu.tsx               # Complex navigation
├── MenuBar.tsx                      # Application menus
├── RadioGroup.tsx                   # Radio buttons
├── Checkbox.tsx                     # Checkbox controls
├── Label.tsx                        # Form labels
├── Sheet.tsx                        # Slide-out panels
├── Toast.tsx                        # Notifications
├── Toggle.tsx                       # Toggle buttons
├── ToggleGroup.tsx                  # Toggle groups
├── Toolbar.tsx                      # Action toolbars
├── AspectRatio.tsx                  # Responsive containers
├── DatePicker.tsx                   # Date selection
├── Drawer.tsx                       # Mobile panels
├── EmptyState.tsx                   # Empty illustrations
├── ScrollArea.tsx                   # Custom scrolling
├── AlertDialog.tsx                  # Confirmation dialogs
├── Popover.tsx                      # Floating content
├── Select.tsx                       # Select dropdowns
├── Collapsible.tsx                  # Collapsible areas
└── index.ts                         # UI-Enhanced exports
```

### 6.2 UI-Enhanced Component Development Pattern

```tsx
// 1. Import required dependencies
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// 2. Import primitive utilities (if needed)
import { Slot } from '@/components/primitives/Slot';
import { AccessibleIcon } from '@/components/primitives/AccessibleIcon';
import { VisuallyHidden } from '@/components/primitives/VisuallyHidden';
import { DirectionProvider } from '@/components/primitives/DirectionProvider';
import { getZIndexClass, getMotionPreset } from '@/design/enhanced-tokens';

// 3. Define component variants using uiEnhancedComponentVariants pattern
const [componentName]Variants = cva([...], { variants: {...} });

// 4. Define component interfaces
export interface [ComponentName]Props extends VariantProps<typeof [componentName]Variants> {
  // Component-specific props
  asChild?: boolean; // For polymorphic pattern using Slot
}

// 5. Implement component with mandatory header template
export function [ComponentName]({ variant = 'default', size = 'md', asChild = false, ...props }: [ComponentName]Props) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      className={cn([componentName]Variants({ variant, size }), getMotionPreset('colors'))}
      {...props}
    />
  );
}
```

### 6.3 Primitive Utilities Integration Pattern

```tsx
// Primitive utilities are foundational building blocks for all UI-Enhanced components

// Slot - Polymorphic component pattern
import { Slot } from '@/components/primitives/Slot';
export function Button({ asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
}

// Z-index class from enhanced tokens helpers (no hooks/registry)
import { getZIndexClass } from '@/design/enhanced-tokens';
export function Modal({ children }) {
  return <div className={cn('fixed inset-0', getZIndexClass('modal'))}>{children}</div>;
}

// AccessibleIcon - Icon accessibility wrapper
import { AccessibleIcon } from '@/components/primitives/AccessibleIcon';
export function IconButton({ icon, label, ...props }) {
  return (
    <button {...props}>
      <AccessibleIcon icon={icon} label={label} />
    </button>
  );
}

// VisuallyHidden - Screen reader content
import { VisuallyHidden } from '@/components/primitives/VisuallyHidden';
export function LoadingSpinner({ children }) {
  return (
    <>
      <VisuallyHidden>Loading content...</VisuallyHidden>
      {children}
    </>
  );
}

// DirectionProvider - RTL/LTR support
import { DirectionProvider } from '@/components/primitives/DirectionProvider';
export function App({ children }) {
  return (
    <DirectionProvider dir="ltr">
      {children}
    </DirectionProvider>
  );
}
```

### 6.4 Enhanced Token Integration

```tsx
// Enhanced Token Consumption - NO hardcoded values
import { ENHANCED_DESIGN_TOKENS } from "@/design/enhanced-tokens";

const componentClasses = {
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
  saturateComic: ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['135'],
  
  // Border tokens
  borderDefault: ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
  borderRadius: ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl'],
  borderAurora: ENHANCED_DESIGN_TOKENS.foundation.color.border['aurora-accent'],
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
    ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['135'],
    ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
    ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30']
  ),
  elevatedPanel: cn(
    ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
    ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
    ENHANCED_DESIGN_TOKENS.foundation.color.border['aurora-accent']
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

* **Initial Render**: <200ms for all UI-Enhanced components
* **State Changes**: <100ms for state transitions
* **Interactions**: <100ms for user interactions
* **Responsive**: <100ms for layout adaptations

### 8.2 Bundle Optimization

* **Code Splitting**: Lazy load component features
* **Tree Shaking**: Remove unused component features
* **Asset Optimization**: Optimize component assets
* **Caching**: Cache component configurations and user preferences

---

## 9) DoD for UI-Enhanced Component Development

* ✅ Component types + Zod schema shipped under `src/types/ui-enhanced.ts`
* ✅ Component consumes **enhanced tokens** only
* ✅ **Primitive utilities integration verified (Slot, AccessibleIcon, VisuallyHidden, DirectionProvider)**
* ✅ Unit tests with 100% branch coverage
* ✅ E2E tests cover component functionality and interactions
* ✅ A11y checks green; keyboard support proven
* ✅ No hardcoded classes; tokens extended only via approved flow
* ✅ **Layout compliance verified; all layout patterns use enhanced tokens (NEW)**
* ✅ Performance targets met (<200ms render time)
* ✅ Responsive design works perfectly on all devices
* ✅ MAPS4 cosmic innovation principles implemented
* ✅ Anti-drift governance compliance verified

---

## 10) UI-Enhanced Component Development Checklist

### 10.1 Pre-Development

- [ ] Review existing UI-Enhanced components for patterns
- [ ] Identify required enhanced tokens
- [ ] Plan component variants and sizing
- [ ] Define component interfaces and validation

### 10.2 Development

- [ ] Use mandatory header template
- [ ] Implement uiEnhancedComponentVariants pattern
- [ ] Use enhanced tokens for all visual states
- [ ] **Integrate primitive utilities (Slot, AccessibleIcon, VisuallyHidden, DirectionProvider)**
- [ ] Implement proper error handling
- [ ] Add loading and error states

### 10.3 Post-Development

- [ ] Verify no hardcoded values remain
- [ ] **Verify no hardcoded layout classes remain (NEW)**
- [ ] **Validate layout token compliance (NEW)**
- [ ] **Verify primitive utilities integration (Slot, AccessibleIcon, VisuallyHidden, DirectionProvider)**
- [ ] Test all component variants and sizes
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
- Z-index: use `getZIndexClass('modal'|'popover'|'tooltip'|'overlay')`
- Category baselines: follow Foundation §12 for Button, Card, Dialog/Overlay, Tooltip/Popover, Inputs

CLI drift checks (run locally/CI):
```bash
rg -n "\b(translate|scale|rotate|opacity)-\[" src/components/ui-enhanced && exit 1 || echo OK
rg -n "@media" src/components/ui-enhanced --glob '!**/*.css' && exit 1 || echo OK
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
7. **Primitive Foundation**: All components must use primitive utilities (Slot, AccessibleIcon, VisuallyHidden, DirectionProvider) as building blocks (NEW)
8. **Performance Standards**: Enforced render time and bundle size limits
9. **MAPS4 Compliance**: All components follow cosmic innovation principles

**Governance References:**
- `SUPERIOR_STATE_OF_THE_ART_DEVELOPMENT_MASTERPLAN.md` - Superior development strategy
- `ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Core anti-drift rules
- `UI_ARCHITECTURE_VALIDATION_REPORT_v7.md` - UI compliance standards
- `RAILWAY_APP_SHELL_SSOT.md` - Railway implementation strategy

---

## 12) Reference Implementation Examples

### 12.1 Primitive Utilities (Foundation Layer)
- ✅ **Slot.tsx**: Polymorphic component pattern with asChild support
- ✅ **AccessibleIcon.tsx**: Icon accessibility wrapper with ARIA compliance
- ✅ **VisuallyHidden.tsx**: Screen reader content with proper semantics
- ✅ **DirectionProvider.tsx**: RTL/LTR support with context management
// Motion and z-index are provided via enhanced token helpers (no separate files)

### 12.2 EnhancedBadge.tsx
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption
- ✅ Component variants pattern
- ✅ Factory pattern implementation
- ✅ Comprehensive accessibility
- ✅ Primitive utilities integration

### 12.3 EnhancedButton.tsx
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption
- ✅ Platform-aware responsive design
- ✅ Loading states and accessibility
- ✅ AAA compliance enforcement
- ✅ Slot primitive integration

### 12.4 EnhancedCard.tsx
- ✅ MAPS4 header template compliance
- ✅ Enhanced token consumption
- ✅ Compound component pattern
- ✅ Glass material variants
- ✅ Interactive states
- ✅ DirectionProvider integration

---

**This SSOT supersedes any prior implicit contracts for UI-Enhanced components and is the authoritative source for all UI-Enhanced component development.**

**The UI-Enhanced system is the foundation for comprehensive user interface components, embodying MAPS4 cosmic innovation and beyond Fortune 500 standards.**

**Use this SSOT to develop all future UI-Enhanced components with guaranteed compliance and excellence.**