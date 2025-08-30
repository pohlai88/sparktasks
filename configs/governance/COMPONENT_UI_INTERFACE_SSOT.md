# COMPONENT UI INTERFACE — Single Source of Truth (SSOT) v1.0

**Date:** 2025-01-27  
**Applies to:** SparkTasks MAPS4 Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (governs all UI component development + refactoring + upgrading)  
**Governance Compliance:** MAPS4 Anti-Drift v4.0 + Enterprise-Grade Standards  

---

## 0) Purpose & Non‑Negotiables

This SSOT defines the **canonical interface** and **component contract** for ALL UI components in the MAPS4 Deep Space Canvas Cosmic Innovation system. It eliminates ambiguity between implementation and quality standards and replaces any ad‑hoc or assumption-based development.

This SSOT made applicable to the componenets in the UI folder respectively
* **D:\sparktasks\src\components\ui-enhanced
* **D:\sparktasks\src\components\data-enhanced
* **D:\sparktasks\src\components\features-enhanced
* **D:\sparktasks\src\components\layout-enhanced

**Non‑Negotiables**

* **MAPS4 Foundation**: All components must follow MAPS4 Deep Space Canvas Cosmic Innovation
* **100% Tokenization**: No hardcoded Tailwind; consume **MAPS4 enhanced tokens** only
* **UI Architecture Flow**: Strict adherence to `tailwind.config.js` → `src/index.css` → `src/design/enhanced-tokens.ts` → `src/components/ui-enhanced/*`
* **Enterprise Quality**: 10/10 quality benchmark with zero drift vectors
* **Accessibility**: WCAG AAA compliance with reduced-motion respect
* **Performance**: SSR-safe, hydration-safe, optimized rendering

---

## 1) MAPS4 Component Standards — Universal Requirements

### 1.1 Header Template (MANDATORY for all components)

```ts
/**
 * [Component Name] Component - MAPS4 Deep Space Canvas Cosmic Innovation
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
 * - MAPS4 Enhanced Tokens → [Component] variants → Cosmic user experience
 * - MAPS4 Guidelines → [Component] behavior → Accessibility excellence
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

### 1.2 MAPS4 Tokenization Standards (ZERO EXCEPTIONS)

**ALL visual values must use MAPS4 CSS variables:**

```ts
// ✅ CORRECT - MAPS4 tokenized
'text-[length:var(--font-size-sm)]'
'px-[var(--space-3)]'
'rounded-[var(--radius-md)]'
'opacity-[var(--opacity-disabled)]'
'scale-[var(--btn-scale-hover)]'
'backdrop-blur-[var(--blur-md)]'

// ❌ FORBIDDEN - Hardcoded values
'text-sm'
'px-3'
'rounded-md'
'opacity-50'
'scale-105'
'backdrop-blur-sm'
```

### 1.3 MAPS4 Color System Integration

**All colors must reference MAPS4 cosmic system:**

```ts
// ✅ CORRECT - MAPS4 cosmic colors
'bg-aurora-accent'
'text-cosmic-dark'
'border-cosmic-border'
'ring-aurora-accent'

// ❌ FORBIDDEN - Generic colors
'bg-primary'
'text-foreground'
'border-border'
'ring-ring'
```

---

## 2) Component Contract — Universal Interface Pattern

### 2.1 Base Props Interface (MANDATORY for all components)

```ts
export interface [ComponentName]OwnProps
  extends React.[HTMLElement]HTMLAttributes<HTML[Element]Element>,
    VariantProps<typeof [componentName]Variants> {
  
  /**
   * Polymorphic rendering support
   */
  asChild?: boolean;
  
  /**
   * Custom CSS classes (merged with variants)
   */
  className?: string;
  
  /**
   * Component-specific props...
   */
  // ... component-specific props
}

export interface [ComponentName]Props extends [ComponentName]OwnProps {
  /**
   * Polymorphic as prop support
   */
  asChild?: boolean;
}
```

### 2.2 Variants Pattern (MANDATORY for all components)

```ts
const [componentName]Variants = cva(
  [
    // MAPS4 Foundation: Layout/shape - Tokenized utilities
    'flex w-[var(--size-full)]',
    
    // MAPS4 Foundation: Typography - Cosmic hierarchy via CSS vars
    'text-[length:var(--font-size-sm)]',
    'font-[var(--font-weight-medium)]',
    
    // MAPS4 Foundation: Shape - Systematic from design tokens via CSS vars
    'rounded-[var(--radius-md)] border',
    
    // MAPS4 Foundation: Spacing - 8pt grid system via CSS vars
    'px-[var(--space-3)] py-[var(--space-2)]',
    
    // MAPS4 Foundation: Colors - Deep space foundation with aurora accents
    'bg-input text-foreground',
    'border-border',
    
    // MAPS4 Foundation: Motion - Respect user preferences via CSS vars
    'transition-[background-color,border-color,box-shadow] duration-[var(--motion-duration-2)] ease-out',
    'motion-reduce:transition-none',
    
    // MAPS4 Foundation: States - Disabled styling via CSS vars
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
    
    // MAPS4 Foundation: Focus - AAA compliant ring system via CSS vars
    'focus-visible:outline-none',
    'focus-visible:ring-[var(--ring-2)] focus-visible:ring-ring focus-visible:ring-offset-[var(--ring-offset-2)] focus-visible:ring-offset-background',
  ],
  {
    variants: {
      variant: {
        // Component-specific variants using MAPS4 tokens
        default: ['border-border bg-input', 'focus-visible:border-ring'],
        // ... other variants
      },
      size: {
        // Tokenized sizing with 8pt grid via CSS vars
        sm: ['h-[var(--btn-h-sm)] px-[var(--space-2)]', 'text-[length:var(--font-size-xs)]'],
        md: ['h-[var(--btn-h-md)] px-[var(--space-3)]', 'text-[length:var(--font-size-sm)]'],
        lg: ['h-[var(--btn-h-lg)] px-[var(--space-4)]', 'text-[length:var(--font-size-base)]'],
      },
      // ... other variant categories
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

---

## 3) MAPS4 Token Consumption (NO HARDCODED TAILWIND)

### 3.1 Required CSS Variables (must exist in src/index.css)

```css
/* Typography */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-weight-medium: 500;
--font-weight-semibold: 600;

/* Spacing */
--space-1: 0.25rem;
--space-1_5: 0.375rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;

/* Shapes */
--radius-md: 0.375rem;
--radius-lg: 0.5rem;

/* Motion */
--motion-duration-2: 200ms;

/* Rings */
--ring-2: 0.5rem;
--ring-offset-2: 0.125rem;

/* Borders */
--border-width-1: 1px;
--border-width-2: 2px;

/* Effects */
--blur-md: 12px;
--blur-lg: 16px;
--saturate-135: 1.35;
--saturate-150: 1.5;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-elevation-md: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-elevation-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-elevation-high: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Sizing */
--size-full: 100%;
--icon-sm: 1rem;
--icon-md: 1.25rem;
--icon-lg: 1.5rem;

/* Opacity */
--opacity-disabled: 0.5;
--opacity-spinner-track: 0.25;
--opacity-spinner-head: 0.75;

/* Scales */
--btn-scale-hover: 1.02;
--btn-scale-active: 0.
8;
--card-scale-active: 0.98;

/* Heights */
--btn-h-sm: 2rem;
--btn-h-md: 2.5rem;
--btn-h-lg: 3rem;
--btn-h-touch: 2.75rem;
--input-h-sm: 2rem;

/* Spinner */
--spinner-stroke-width: 4;
```

### 3.2 Token Extension Process (when new tokens needed)

**NEVER add hardcoded values. Follow this process:**

1. **Add to `src/index.css`** in `:root` section
2. **Add to light mode** section for consistency
3. **Update `src/design/enhanced-tokens.ts`** if semantic mapping needed
4. **Use in component** via `var(--token-name)`

---

## 4) Accessibility & UX Standards

### 4.1 Universal Accessibility Requirements

```ts
// ✅ REQUIRED for all interactive components
'focus-visible:outline-none'
'focus-visible:ring-[var(--ring-2)] focus-visible:ring-ring'
'focus-visible:ring-offset-[var(--ring-offset-2)] focus-visible:ring-offset-background'

// ✅ REQUIRED for all motion
'motion-reduce:transition-none'
'motion-reduce:hover:scale-100'
'motion-reduce:active:scale-100'

// ✅ REQUIRED for all disabled states
'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]'
```

### 4.2 ARIA Implementation Standards

```ts
// ✅ REQUIRED for all components with interactive states
aria-disabled={isDisabled || undefined}
aria-busy={pending || undefined}
aria-describedby={loadingAnnouncement ? loadingRegionId : undefined}

// ✅ REQUIRED for all decorative icons
aria-hidden="true"
focusable="false"

// ✅ REQUIRED for all loading states
data-loading="true"
```

---

## 5) Performance & SSR Standards

### 5.1 SSR Safety Requirements

```ts
// ✅ REQUIRED for all media queries
const [responsiveSize, setResponsiveSize] = useState<typeof size>(size);
useEffect(() => {
  // Media query logic here
}, [size]);

// ✅ REQUIRED for all dynamic values
const reactId = useId();
const loadingRegionId = `${(testId ?? reactId)}-loading`;

// ❌ FORBIDDEN - Direct media queries in render
const responsiveSize = React.useMemo(() => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    // This causes hydration issues
  }
}, []);
```

### 5.2 Performance Optimization Standards

```ts
// ✅ REQUIRED - Targeted transitions
'transition-[background-color,border-color,box-shadow] duration-[var(--motion-duration-2)]'

// ❌ FORBIDDEN - Over-animation
'transition-all duration-200'

// ✅ REQUIRED - Efficient state updates
const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  // Handler logic
}, [dependencies]);
```

---

## 6) Testing Contract (MANDATORY for all components)

### 6.1 Unit Testing Standards (Vitest + RTL)

```ts
// ✅ REQUIRED test coverage
describe('[ComponentName]', () => {
  it('renders without errors', () => {
    // Test basic rendering
  });
  
  it('applies MAPS4 tokens correctly', () => {
    // Verify all classes use CSS variables
  });
  
  it('handles accessibility attributes', () => {
    // Test ARIA attributes
  });
  
  it('respects reduced motion preferences', () => {
    // Test motion-reduce classes
  });
  
  it('applies variants correctly', () => {
    // Test all variant combinations
  });
});
```

### 6.2 Visual Regression Testing

```ts
// ✅ REQUIRED for all components
it('matches visual snapshot', () => {
  // Screenshot comparison
});
```

### 6.3 Accessibility Testing

```ts
// ✅ REQUIRED for all components
it('passes accessibility checks', async () => {
  // Axe-core compliance
});
```

---

## 7) Quality Control Checklist (MANDATORY for all components)

### 7.1 Pre-Development Checklist

- [ ] Component follows MAPS4 header template exactly
- [ ] All required CSS variables exist in `src/index.css`
- [ ] Component uses MAPS4 enhanced tokens only
- [ ] No hardcoded Tailwind utilities planned

### 7.2 Development Checklist

- [ ] Header template implemented exactly
- [ ] 100% tokenization achieved (zero hardcoded values)
- [ ] MAPS4 cosmic colors used exclusively
- [ ] Accessibility attributes implemented
- [ ] SSR safety measures in place
- [ ] Performance optimizations applied

### 7.3 Post-Development Checklist

- [ ] All tests pass (unit + visual + accessibility)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Component follows MAPS4 patterns exactly
- [ ] Quality score: 10/10 achieved

---

## 8) Migration & Enforcement

### 8.1 Legacy Component Migration

**All existing components must be migrated to MAPS4 standards:**

1. **Update header** to MAPS4 template
2. **Tokenize all hardcoded values** using CSS variables
3. **Implement MAPS4 cosmic colors** exclusively
4. **Add accessibility attributes** and SSR safety
5. **Update tests** to verify MAPS4 compliance

### 8.2 Enforcement Process

**Quality gates prevent non-compliant components:**

1. **Pre-commit**: ESLint + TypeScript validation
2. **Pre-push**: Full test suite + accessibility checks
3. **Code review**: MAPS4 compliance verification
4. **CI/CD**: Automated quality scoring

---

## 9) DoD for Component MAPS4 Compliance

### 9.1 Definition of Done

- [ ] **Header Compliance**: MAPS4 template implemented exactly
- [ ] **Tokenization**: 100% CSS variable usage, zero hardcoded values
- [ ] **MAPS4 Colors**: Exclusive use of cosmic color system
- [ ] **Accessibility**: WCAG AAA compliance with ARIA attributes
- [ ] **Performance**: SSR-safe, optimized rendering
- [ ] **Testing**: 100% test coverage with MAPS4 verification
- [ ] **Quality Score**: 10/10 achieved and verified

### 9.2 Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Tokenization** | 100% | Zero hardcoded Tailwind utilities |
| **MAPS4 Compliance** | 100% | All colors use cosmic system |
| **Accessibility** | AAA | WCAG 2.2 compliance |
| **Performance** | 10/10 | SSR-safe, optimized |
| **Test Coverage** | 100% | All scenarios covered |

---

## 10) Reference Implementation Examples

### 10.1 Gold Standard Components (10/10 Quality)

- **Button.tsx** - Perfect MAPS4 implementation
- **Card.tsx** - Perfect MAPS4 implementation  
- **Input.tsx** - Perfect MAPS4 implementation
- **Textarea.tsx** - Perfect MAPS4 implementation

### 10.2 Component Patterns

```ts
// ✅ CORRECT - MAPS4 pattern
export const [ComponentName] = React.forwardRef<
  HTML[Element]Element,
  [ComponentName]Props
>(({ className, variant, size, ...props }, ref) => {
  // Component logic
  return (
    <Comp
      ref={ref}
      className={cn(
        [componentName]Variants({ variant, size }),
        className
      )}
      {...props}
    />
  );
});

[ComponentName].displayName = '[ComponentName]';
```

---

## 11) Anti-Drift Governance Compliance

**This SSOT enforces the following anti-drift rules:**

1. **Single Interface Pattern**: No dual APIs or competing implementations
2. **MAPS4 Architecture Flow**: Strict adherence to enhanced tokens only
3. **Quality Gates**: Automated checks prevent quality regression
4. **Test Contract**: Clear expectations prevent test/component drift
5. **No Hardcoded Values**: All visual states use semantic token layer

**Governance References:**
- `MAPS3_TO_MAPS4_UPGRADE_SSOT.md` - MAPS4 migration blueprint
- `ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Core anti-drift rules
- `UI_ARCHITECTURE_VALIDATION_REPORT_v7.md` - UI compliance standards

---

## 12) Version Control & Updates

### 12.1 Version History

- **v1.0.0** (2025-01-27): Initial SSOT for MAPS4 component standards

### 12.2 Update Process

**This SSOT can only be updated by:**
1. **Architecture Lead approval**
2. **Full team review**
3. **Version increment**
4. **Migration plan for existing components**

---

**This SSOT supersedes any prior implicit contracts for UI components and is the authoritative source for all UI component development, refactoring, and upgrading in the MAPS4 system.**

**All components must achieve 10/10 quality score and 100% MAPS4 compliance before being considered production-ready.**
