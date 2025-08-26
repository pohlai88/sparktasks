# 🛡️ ANTI-DRIFT GOVERNANCE PROTOCOL

## 🎯 **MISSION**: Prevent architectural regression and maintain modernized component consistency

**EFFECTIVE DATE**: August 26, 2025  
**SCOPE**: Full UI-Enhanced Component Library  
**AUTHORITY**: Design System Team  
**ENFORCEMENT**: Automated + Manual Review

---

## 📋 \*### **Architecture Consistency**

- [ ] Primitives imported from `@/components/primitives` (standardized path)
- [ ] DirectionProvider context used (not manual dir props)
- [ ] No direct Radix imports (use wrappers only)
- [ ] Standardized primitive names used (AccessibleIcon, VisuallyHidden, Slot, DirectionProvider)
- [ ] ESLint rules passing including import path validationNING PRINCIPLES\*\*

### **1. ZERO TOLERANCE FOR PATTERN REGRESSION**

- ❌ **NO** manual accessibility patterns
- ❌ **NO** mixed implementation approaches
- ❌ **NO** bypassing established primitives
- ✅ **YES** to consistent Radix primitive usage

### **2. COMPOSITION OVER CONFIGURATION**

- ✅ Universal `asChild` support where applicable
- ✅ Slot-based polymorphism for flexibility
- ❌ Hard-coded element types without polymorphic options

### **3. SINGLE SOURCE OF TRUTH**

- ✅ All accessibility through `@/components/primitives`
- ✅ Global direction via `DirectionProvider` context
- ❌ Component-level accessibility reimplementation

---

## 📂 **PERMITTED CHANGES**

### **🟢 ALWAYS ALLOWED**

#### **File/Folder Scope**

```
✅ src/components/ui-enhanced/**/*.tsx    (Component enhancements)
✅ src/components/primitives/**/*.tsx     (Primitive improvements)
✅ docs/**/*.md                          (Documentation updates)
✅ test/**/*.test.tsx                    (Test coverage expansion)
✅ vitest/**/*.test.tsx                  (Vitest test updates)
✅ scripts/**/*.{js,ts}                  (Build/maintenance scripts)
✅ README.md                             (Project documentation)
```

#### **Permitted Operations**

- ✅ **Adding** `asChild` props to components
- ✅ **Replacing** manual accessibility with primitives
- ✅ **Enhancing** TypeScript types for better DX
- ✅ **Expanding** test coverage
- ✅ **Improving** documentation
- ✅ **Adding** new primitive wrappers
- ✅ **Optimizing** performance without API changes

### **🟡 REVIEW REQUIRED**

#### **File/Folder Scope**

```
🟡 src/components/ui-enhanced/index.ts    (Export changes)
🟡 package.json                          (Dependency updates)
🟡 tsconfig.json                         (TypeScript config)
🟡 eslint.config.js                      (Linting rules)
🟡 vite.config.ts                        (Build configuration)
🟡 tailwind.config.js                    (Styling configuration)
```

#### **Review Requirements**

- 🔍 **Design System Team approval** required
- 📝 **Impact assessment** documentation
- ✅ **Backward compatibility** verification
- 🧪 **Comprehensive testing** completed

---

## 🚫 **FORBIDDEN CHANGES**

### **🔴 NEVER ALLOWED**

#### **File/Folder Restrictions**

```
❌ src/components/ui-enhanced/**/*.tsx    (Manual accessibility patterns)
❌ ANY FILE                              (Removing asChild props)
❌ ANY FILE                              (Adding aria-hidden manually)
❌ ANY FILE                              (Adding .sr-only classes)
❌ src/main.tsx                          (Removing DirectionProvider)
❌ .eslintrc.cjs                         (Disabling governance rules)
```

#### **Forbidden Code Patterns**

##### **🚨 ACCESSIBILITY ANTI-PATTERNS**

```typescript
// ❌ FORBIDDEN: Manual aria-hidden
<svg aria-hidden="true">
<ChevronIcon aria-hidden />
<span aria-hidden="true">

// ❌ FORBIDDEN: Manual sr-only
<span className="sr-only">
<div className="sr-only">

// ❌ FORBIDDEN: Object syntax accessibility
{ 'aria-hidden': true }
```

##### **🚨 HARDCODED ELEMENT ANTI-PATTERNS**

```typescript
// ❌ FORBIDDEN: Hardcoded without asChild option
const Button = (props) => <button {...props} />

// ❌ FORBIDDEN: No polymorphic support
const Container = ({ children }) => <div>{children}</div>
```

##### **🚨 DIRECTION ANTI-PATTERNS**

```typescript
// ❌ FORBIDDEN: Manual direction props (when context available)
<ToggleGroup dir="rtl" />
<Toolbar dir="ltr" />

// ❌ FORBIDDEN: Manual RTL classes (when context available)
className="rtl:space-x-reverse"
```

##### **🚨 DEPENDENCY ANTI-PATTERNS**

```typescript
// ❌ FORBIDDEN: Bypassing primitives
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { Slot } from '@radix-ui/react-slot'
import { DirectionProvider } from '@radix-ui/react-direction'

// ✅ REQUIRED: Use standardized wrapper path
import {
  VisuallyHidden,
  AccessibleIcon,
  Slot,
  DirectionProvider
} from '@/components/primitives'
```

##### **🚨 NAMING CONVENTION VIOLATIONS**

```typescript
// ❌ FORBIDDEN: Alternative primitive names
import { A11yIcon, HiddenIcon } from '@/components/primitives'
import { SROnly, ScreenReaderOnly } from '@/components/primitives'
import { AsChild, Polymorphic } from '@/components/primitives'
import { RTLProvider, DirProvider } from '@/components/primitives'

// ✅ REQUIRED: Standardized names only
import {
  AccessibleIcon,    // Only acceptable name for icon accessibility
  VisuallyHidden,    // Only acceptable name for hidden content
  Slot,              // Only acceptable name for polymorphism
  DirectionProvider  // Only acceptable name for direction context
} from '@/components/primitives'
```

---

## 🔧 **ENFORCEMENT MECHANISMS**

### **1. AUTOMATED ENFORCEMENT**

#### **ESLint Rules** (`.eslintrc.cjs`)

```javascript
module.exports = {
  rules: {
    // Block manual accessibility patterns
    'no-restricted-syntax': [
      'error',
      {
        selector: "JSXAttribute[name.name='aria-hidden'][value.value=true]",
        message:
          '🚫 Use <AccessibleIcon> wrapper instead of manual aria-hidden',
      },
      {
        selector: "Literal[value='sr-only']",
        message: '🚫 Use <VisuallyHidden> component instead of sr-only class',
      },
      {
        selector: "Property[key.name='aria-hidden'][value.value=true]",
        message:
          '🚫 Use <AccessibleIcon> wrapper instead of object aria-hidden',
      },
    ],

    // Block primitive bypassing
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@radix-ui/react-visually-hidden',
            message: '🚫 Import from @/components/primitives instead',
          },
          {
            name: '@radix-ui/react-slot',
            message: '🚫 Import from @/components/primitives instead',
          },
          {
            name: '@radix-ui/react-accessible-icon',
            message: '🚫 Import from @/components/primitives instead',
          },
          {
            name: '@radix-ui/react-direction',
            message: '🚫 Import from @/components/primitives instead',
          },
        ],
      },
    ],

    // Enforce standardized primitive naming
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'ImportSpecifier[imported.name=/^(A11yIcon|HiddenIcon|SROnly|ScreenReaderOnly|AsChild|Polymorphic|RTLProvider|DirProvider)$/]',
        message:
          '🚫 Use standardized primitive names: AccessibleIcon, VisuallyHidden, Slot, DirectionProvider',
      },
    ],
  },
};
```

#### **TypeScript Compilation**

```bash
# Build fails if accessibility types violated
npm run typecheck
```

#### **Pre-commit Hooks**

```bash
# Git hooks enforce linting
npx husky add .husky/pre-commit "npm run lint:fix"
```

### **2. TESTING ENFORCEMENT**

#### **Required Test Coverage**

```typescript
// ✅ REQUIRED: Every component with asChild
describe('ComponentName', () => {
  it('supports asChild polymorphism', () => {
    render(<Component asChild><custom-element /></Component>);
    expect(screen.getByRole('custom-element')).toBeInTheDocument();
  });
});

// ✅ REQUIRED: Accessibility compliance
it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### **Vitest Configuration**

```typescript
// vitest.config.ts - Fail on accessibility violations
export default defineConfig({
  test: {
    setupFiles: ['./vitest/setup/accessibility.ts'],
    // Fail build on accessibility test failures
    bail: true
  }
});
```

### **3. MANUAL REVIEW CHECKPOINTS**

#### **Pull Request Requirements**

- ✅ **Design System Team approval** for ui-enhanced changes
- ✅ **Accessibility audit report** for new patterns
- ✅ **Breaking change assessment** if APIs modified
- ✅ **Migration guide update** if consumer impact

#### **Review Checklist Template**

```markdown
## 🛡️ Anti-Drift Review Checklist

### Accessibility Compliance

- [ ] No manual `aria-hidden` patterns introduced
- [ ] No manual `.sr-only` classes added
- [ ] All icons wrapped with `<AccessibleIcon>`
- [ ] All hidden text uses `<VisuallyHidden>`

### Polymorphism Standards

- [ ] New interactive components have `asChild` prop
- [ ] Existing `asChild` props not removed
- [ ] Slot usage follows established patterns
- [ ] TypeScript types updated for polymorphism

### Architecture Consistency

- [ ] Primitives imported from `@/components/primitives`
- [ ] DirectionProvider context used (not manual dir props)
- [ ] No direct Radix imports (use wrappers)
- [ ] ESLint rules passing

### Testing & Documentation

- [ ] Test coverage for new asChild functionality
- [ ] Accessibility tests passing
- [ ] Documentation updated
- [ ] Migration notes added if needed
```

---

## 📋 **IMPLEMENTATION INSTRUCTIONS**

### **📦 STANDARDIZED NAMING CONVENTIONS**

#### **Import Path Standards**

```typescript
// ✅ REQUIRED: Always use primitives wrapper path
import {
  AccessibleIcon,
  VisuallyHidden,
  Slot,
  DirectionProvider
} from '@/components/primitives'

// ✅ REQUIRED: Type imports from same path
import type {
  AccessibleIconProps,
  VisuallyHiddenProps,
  SlotProps,
  DirectionProviderProps
} from '@/components/primitives'

// ❌ FORBIDDEN: Direct Radix imports
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Slot } from '@radix-ui/react-slot'
import { DirectionProvider } from '@radix-ui/react-direction'
```

#### **Component Naming Standards**

```typescript
// ✅ CORRECT: Standardized primitive names
AccessibleIcon    // For icon accessibility
VisuallyHidden   // For screen reader only content
Slot             // For polymorphic composition
DirectionProvider // For RTL/LTR context

// ❌ INCORRECT: Alternative names or variations
A11yIcon, AccessibilityIcon, HiddenIcon
SROnly, ScreenReaderOnly, HiddenText
AsChild, Polymorphic, SlotComponent
RTLProvider, Direction, DirProvider
```

#### **File Organization Standards**

```
src/components/primitives/
├── AccessibleIcon.tsx      ✅ Individual primitive files
├── VisuallyHidden.tsx      ✅ Clear, descriptive names
├── Slot.tsx                ✅ Consistent naming pattern
├── DirectionProvider.tsx   ✅ Full descriptive names
└── index.ts                ✅ Single export file
```

### **🔧 MIGRATION TRANSFORMATION GUIDE**

#### **Accessibility Pattern Transformations**

```typescript
// ❌ BEFORE: Manual accessibility patterns
<svg aria-hidden="true">
  <path d="..." />
</svg>

<ChevronIcon aria-hidden="true" />
<span aria-hidden={true}>icon</span>
<span className="sr-only">Loading...</span>
<div className="sr-only">Screen reader text</div>

// ✅ AFTER: Standardized primitive usage
<AccessibleIcon>
  <svg><path d="..." /></svg>
</AccessibleIcon>

<AccessibleIcon><ChevronIcon /></AccessibleIcon>
<AccessibleIcon><span>icon</span></AccessibleIcon>
<VisuallyHidden>Loading...</VisuallyHidden>
<VisuallyHidden>Screen reader text</VisuallyHidden>
```

#### **Polymorphism Pattern Transformations**

```typescript
// ❌ BEFORE: Hardcoded elements
const Button = (props) => <button {...props} />
const Container = ({ children }) => <div>{children}</div>

// ✅ AFTER: Polymorphic with asChild
interface ButtonProps {
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = ({ asChild = false, ...props }) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
};

// Usage examples:
<Button>Normal Button</Button>
<Button asChild><a href="/link">Link Button</a></Button>
<Button asChild><Link to="/page">Router Link</Link></Button>
```

#### **Direction Context Transformations**

```typescript
// ❌ BEFORE: Manual direction props
<ToggleGroup dir="rtl" />
<Toolbar dir="ltr" />
<div className="rtl:space-x-reverse">content</div>

// ✅ AFTER: Context-aware components
// At app root:
<DirectionProvider dir={locale.direction}>
  <App />
</DirectionProvider>

// In components:
<ToggleGroup /> {/* Inherits direction from context */}
<Toolbar />     {/* Inherits direction from context */}
<div>content</div> {/* Inherits direction from context */}
```

### **FOR DEVELOPERS**

#### **Before Making Changes**

1. ✅ **Read this governance document**
2. ✅ **Review current patterns** in `src/components/primitives/`
3. ✅ **Check ESLint rules** are configured
4. ✅ **Verify test coverage** requirements

#### **During Development**

1. ✅ **Use primitives consistently**:

   ```typescript
   import { AccessibleIcon, VisuallyHidden, Slot } from '@/components/primitives'
   ```

2. ✅ **Add asChild support** to new components:

   ```typescript
   interface Props {
     asChild?: boolean;
   }

   const Component = ({ asChild = false, ...props }) => {
     const Comp = asChild ? Slot : 'defaultElement';
     return <Comp {...props} />;
   };
   ```

3. ✅ **Replace accessibility patterns**:

   ```typescript
   // ❌ BEFORE
   <ChevronIcon aria-hidden="true" />
   <span className="sr-only">Hidden text</span>

   // ✅ AFTER
   <AccessibleIcon><ChevronIcon /></AccessibleIcon>
   <VisuallyHidden>Hidden text</VisuallyHidden>
   ```

#### **Before Committing**

1. ✅ **Run linting**: `npm run lint:fix`
2. ✅ **Run type checking**: `npm run typecheck`
3. ✅ **Run tests**: `npm test`
4. ✅ **Verify build**: `npm run build`

### **FOR REVIEWERS**

#### **Review Priority Order**

1. 🔴 **SECURITY**: Check for forbidden patterns
2. 🟡 **CONSISTENCY**: Verify primitive usage
3. 🟢 **ENHANCEMENT**: Validate improvements

#### **Automated Checks**

```bash
# Run full governance validation
npm run lint                    # ESLint rules
npm run typecheck              # TypeScript compliance
npm test                       # Test coverage
npm run build                  # Build success
npm run audit:accessibility    # Accessibility compliance
npm run validate:imports       # Import path validation
npm run validate:naming        # Naming convention validation
```

#### **Manual Review Areas**

- 📝 **Code patterns** match established primitives
- 🧪 **Test coverage** includes accessibility and polymorphism
- 📚 **Documentation** updated for consumer impact
- 🔄 **Migration notes** provided if needed

---

## ✅ **DEFINITION OF DONE (DoD)**

### **FOR INDIVIDUAL COMPONENTS**

#### **Accessibility DoD**

- [ ] **Zero manual accessibility patterns** (aria-hidden, sr-only)
- [ ] **All icons wrapped** with `<AccessibleIcon>`
- [ ] **All hidden text** uses `<VisuallyHidden>`
- [ ] **ESLint rules passing** with no accessibility violations
- [ ] **Axe accessibility tests** passing with no violations

#### **Polymorphism DoD**

- [ ] **asChild prop implemented** (where applicable)
- [ ] **Slot usage follows pattern** with proper TypeScript types
- [ ] **Backward compatibility maintained** for existing usage
- [ ] **Storybook examples** demonstrate polymorphic usage
- [ ] **Test coverage** includes asChild functionality

#### **Integration DoD**

- [ ] **Primitives imported** from `@/components/primitives`
- [ ] **Direction context used** (no manual dir props)
- [ ] **TypeScript compilation** successful
- [ ] **Build process** completes without errors
- [ ] **All tests passing** including new functionality

### **FOR FULL MIGRATION COMPLETION**

#### **Phase 1: Foundation DoD**

- [ ] **Zero `aria-hidden="true"` patterns** in ui-enhanced/
- [ ] **Zero `.sr-only` patterns** in ui-enhanced/
- [ ] **ESLint governance rules** active and enforcing
- [ ] **DirectionProvider** integrated at app root
- [ ] **All 19 accessibility instances** migrated to primitives

#### **Phase 2: Polymorphism DoD**

- [ ] **All 30 components** support `asChild` where applicable
- [ ] **Storybook stories** demonstrate polymorphic usage
- [ ] **TypeScript types** correct for all Slot usage
- [ ] **Documentation updated** with asChild examples
- [ ] **Test coverage** includes polymorphic functionality

#### **Phase 3: Architecture DoD**

- [ ] **All manual `dir` props** removed (3 components)
- [ ] **Global direction context** working correctly
- [ ] **Comprehensive accessibility audit** passes
- [ ] **Migration guide** completed for consumers
- [ ] **Performance benchmarks** maintained or improved

#### **Final Migration DoD**

- [ ] **100% pattern consistency** across all components
- [ ] **Zero architectural drift risk** via governance
- [ ] **Universal component flexibility** through polymorphism
- [ ] **Modern accessibility foundation** established
- [ ] **Future-proof architecture** for long-term maintenance

### **ENFORCEMENT METRICS**

#### **Automated Metrics**

```bash
# ESLint violations (must be 0)
npm run lint --max-warnings 0

# TypeScript errors (must be 0)
npm run typecheck --noEmit

# Test coverage (must be >95%)
npm test -- --coverage --threshold.global.statements=95

# Accessibility violations (must be 0)
npm run test:a11y --fail-on-violations

# Import path compliance check
npm run lint:governance
```

#### **Manual Metrics**

- 📊 **Component consistency score**: 100% primitive usage via `@/components/primitives`
- 🎯 **Accessibility compliance**: Zero manual `aria-hidden` or `.sr-only` patterns
- 🔄 **Polymorphism coverage**: All applicable components support `asChild`
- 📚 **Documentation coverage**: All new patterns documented with standardized examples
- 🏗️ **Import path compliance**: 100% usage of standardized import paths
- 🧬 **Naming consistency**: 100% usage of standardized primitive names

---

## 🚀 **GOVERNANCE ACTIVATION**

### **IMMEDIATE ACTIONS REQUIRED**

1. **✅ Install governance rules**:

   ```bash
   # Update ESLint configuration
   npm install --save-dev eslint-plugin-jsx-a11y
   ```

2. **✅ Configure enforcement**:

   ```bash
   # Add pre-commit hooks
   npx husky install
   npx husky add .husky/pre-commit "npm run lint:fix && npm run typecheck"
   ```

3. **✅ Activate protection**:
   ```bash
   # Update package.json scripts
   "scripts": {
     "lint:governance": "eslint src/components/ui-enhanced/**/*.tsx --rule 'no-restricted-syntax:error' --rule 'no-restricted-imports:error'",
     "audit:drift": "npm run lint:governance && npm run typecheck && npm test",
     "validate:imports": "eslint src/components/ui-enhanced/**/*.tsx --rule 'no-restricted-imports:error'",
     "validate:naming": "eslint src/components/ui-enhanced/**/*.tsx --rule 'no-restricted-syntax:error'"
   }
   ```

### **GOVERNANCE MONITORING**

#### **Daily Automated Checks**

- 🔍 **ESLint governance rules** via CI/CD
- 📊 **Test coverage reports** via automated testing
- 🏗️ **Build success validation** via deployment pipeline

#### **Weekly Manual Reviews**

- 📋 **Pull request governance compliance**
- 📈 **Architecture consistency metrics**
- 📚 **Documentation coverage assessment**

#### **Monthly Governance Audits**

- 🔬 **Full codebase pattern analysis**
- 📊 **Drift detection reporting**
- 🎯 **Governance rule effectiveness review**

---

## 🎯 **SUCCESS GUARANTEE**

This governance protocol **guarantees**:

- ✅ **Zero architectural drift** through automated enforcement
- ✅ **100% pattern consistency** via comprehensive rules
- ✅ **Future-proof foundation** with modern accessibility
- ✅ **Developer productivity** through clear guidelines
- ✅ **Long-term maintenance** reduction via standardization

**The anti-drift governance ensures your modernized component library remains consistent, accessible, and flexible for years to come!** 🛡️✨
