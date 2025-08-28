# ANTI-DRIFT GOVERNANCE FINAL v7.1 - Single-Repo Architecture

## 📋 **CHANGELOG - ARCHITECTURE REVERSAL**

**Date**: August 28, 2025  
**Version**: 7.1  
**Change Type**: Enhanced Anti-Drift Enforcement  
**Rationale**: Strengthened governance to prevent assumption-based reporting and enforce strict UI architecture compliance  

### **Previous Version**: v7.0 (Basic Anti-Drift Rules)  
### **Current Version**: v7.1 (Enhanced Enforcement + UI Architecture Mandates)  

---

## 🚨 **CRITICAL GOVERNANCE ENFORCEMENT**

### **❌ ABSOLUTELY FORBIDDEN: ASSUMPTION-BASED REPORTING**

**CRIMINAL OFFENSE DECLARATION**: Any report generated from assumptions instead of actual codebase audit is considered **INTENTIONALLY MISLEADING** and constitutes a **CRIMINAL OFFENSE**.

#### **MANDATORY REQUIREMENTS:**
- **DoD Reports**: Can ONLY be generated from actual codebase genuine audit
- **No Assumptions**: Zero tolerance for assumption-based analysis
- **Verification Required**: All findings must be verifiable in actual code
- **Penalty**: Intentional misleading reports lead to immediate project halt and disciplinary action

#### **COMPLIANCE VERIFICATION:**
```typescript
// ✅ REQUIRED: Actual codebase audit
const auditResult = await performActualCodebaseAudit();
const report = generateReportFromActualData(auditResult);

// ❌ FORBIDDEN: Assumption-based reporting
const report = generateReportFromAssumptions(); // CRIMINAL OFFENSE
```

---

## 🏗️ **ARCHITECTURE GOVERNANCE**

### **✅ APPROVED ARCHITECTURE**

**Single-Repo Structure** - All code resides under unified structure:
```
D:\sparktasks\
├── src/                    # Main source code
├── configs/               # Configuration files and governance docs
├── tests/                 # All test files (unit + e2e)
├── package.json           # Unified dependency management
└── [configuration files]
```

### **❌ FORBIDDEN ARCHITECTURES**

- **Monorepo structures** (`apps/`, `packages/`)
- **Multi-workspace setups** (Turborepo, pnpm workspaces)
- **Fragmented dependency management**

---

## 🎨 **UI ARCHITECTURE ANTI-DRIFT GOVERNANCE**

### **✅ APPROVED UI ARCHITECTURE FLOW**

**MANDATORY DEVELOPMENT SEQUENCE** - No exceptions allowed:
```
1. tailwind.config.js → Defines Tailwind classes using CSS custom properties
2. src/index.css → Defines CSS custom properties (--primary, --background, etc.)
3. src/design/enhanced-tokens.ts → Semantic API layer over CSS foundation
4. src/components/ui-enhanced/* → Component implementations using enhanced tokens
```

### **🚨 NEW CRITICAL REQUIREMENT: ADDITIONAL DESIGN TOKENS**

**When additional design tokens are required that are NOT available in existing components or enhanced-tokens.ts:**

#### **MANDATORY UI ARCHITECTURE FLOW:**
```
1. ONLY use what is configured in tailwind.config.js
2. ONLY if needed, add to src/index.css (global CSS) file
3. Establish Single Source of Truth (SSOT) tokens
4. ONLY after above steps are completed, use the new tokens
```

#### **FORBIDDEN PRACTICES:**
- **NO direct component creation** without following the architecture flow
- **NO hardcoded values** in components
- **NO bypassing** the mandatory sequence
- **NO exceptions** to this rule

#### **IMPLEMENTATION EXAMPLE:**
```typescript
// ✅ CORRECT: Following mandatory architecture flow
// Step 1: Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'new-accent': 'var(--new-accent)',
      }
    }
  }
}

// Step 2: Add to src/index.css
:root {
  --new-accent: 48 176 199;
}

// Step 3: Add to src/design/enhanced-tokens.ts
export const ENHANCED_DESIGN_TOKENS = {
  foundation: {
    color: {
      brand: {
        newAccent: 'bg-new-accent text-new-accent-foreground'
      }
    }
  }
}

// Step 4: Use in components
const componentVariants = cva([
  ENHANCED_DESIGN_TOKENS.foundation.color.brand.newAccent
]);
```

### **❌ FORBIDDEN UI PRACTICES**

#### **HARDCODED VALUES (CRITICAL VIOLATION)**
- **NO hardcoded Tailwind classes** (e.g., `bg-blue-500`, `text-red-600`)
- **NO hardcoded hex colors** (e.g., `#30b0c7`, `#ff3b30`)
- **NO hardcoded RGB values** (e.g., `rgb(48, 176, 199)`)
- **NO hardcoded spacing** (e.g., `p-4`, `m-2`) without design system tokens

#### **ARCHITECTURE VIOLATIONS**
- **NO direct Tailwind usage** without enhanced tokens layer
- **NO bypassing enhanced-tokens.ts** for component styling
- **NO custom CSS files** outside the approved architecture flow
- **NO inline styles** or style attributes

### **✅ REQUIRED UI DEVELOPMENT PATTERNS**

#### **Component Implementation Requirements**
```typescript
// ✅ CORRECT: Using enhanced tokens
const buttonVariants = cva([
  'bg-primary text-primary-foreground',        // CSS custom properties
  'pointer:hover:bg-primary-hover',           // Enhanced token variants
  'focus-visible:ring-2 focus-visible:ring-ring' // Design system tokens
]);

// ❌ FORBIDDEN: Hardcoded values
const buttonVariants = cva([
  'bg-blue-500 text-white',                   // HARDCODED - VIOLATION
  'hover:bg-blue-600',                        // HARDCODED - VIOLATION
  'focus:ring-2 focus:ring-blue-500'          // HARDCODED - VIOLATION
]);
```

#### **Enhanced Tokens Integration**
```typescript
// ✅ REQUIRED: All components must use enhanced tokens
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';

// ✅ CORRECT: Semantic token usage
const cardVariants = cva([
  ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated,
  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
]);
```

### **🎯 FORTUNE 500 UI QUALITY STANDARDS**

#### **Design System Compliance**
- **Dark Theme First**: Primary design approach with light mode overrides
- **Apple HIG Harmony**: Semantic hierarchy and systematic spacing
- **Liquid Glass Materials**: Governed vibrancy system with backdrop blur
- **AAA Accessibility**: 7:1+ contrast ratios with enforcement mode

#### **Component Quality Requirements**
- **78 Enhanced Components**: All must meet Fortune 500 standards
- **Variant System**: Comprehensive variant coverage (size, color, state)
- **Motion Respect**: `prefers-reduced-motion` compliance
- **Platform Awareness**: Touch vs pointer input optimization

---

## 🛡️ **ANTI-DRIFT COMPLIANCE RULES**

### **FOLDER PERMISSIONS**

#### **✅ ALLOWED TO MODIFY**
1. `D:\sparktasks\configs` - Configuration and governance documents
2. `D:\sparktasks\src` - Source code (with approval)
3. `D:\sparktasks\tests` - Test files
4. `D:\sparktasks\package.json` - Dependencies (with approval)

#### **❌ FORBIDDEN TO MODIFY**
- All other directories without explicit approval
- Legacy monorepo remnants
- External dependencies without governance approval

### **DOCUMENTATION COMPLIANCE**

#### **✅ REQUIRED UPDATES**
- All governance documents must reflect single-repo architecture
- Changelog entries for all architectural decisions
- Single Source of Truth (SSOT) maintenance

#### **❌ FORBIDDEN ACTIONS**
- Creating conflicting architectural documentation
- Maintaining outdated monorepo references
- Assuming codebase structure without verification

---

## 🔧 **IMPLEMENTATION STANDARDS**

### **TECHNOLOGY STACK**

#### **✅ APPROVED TECHNOLOGIES**
- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + Enhanced Design Tokens
- **Testing**: Vitest (unit) + Playwright (e2e)
- **State Management**: Zustand + React Query
- **Build Tool**: Vite (not Next.js unless SSR required)

#### **❌ FORBIDDEN TECHNOLOGIES**
- **Monorepo tools**: Turborepo, pnpm workspaces
- **Unnecessary frameworks**: Next.js (unless explicitly required)
- **Conflicting build systems**

### **CODE QUALITY STANDARDS**

#### **✅ REQUIRED COMPLIANCE**
- **TypeScript**: ZERO strict errors
- **ESLint**: ZERO errors
- **Testing**: 100% test coverage for new features
- **Performance**: 95%+ Fortune 500 quality standards

#### **❌ FORBIDDEN VIOLATIONS**
- TypeScript errors in production code
- ESLint violations
- Untested critical functionality
- Performance degradation

---

## 📊 **AUDIT REQUIREMENTS**

### **REGULAR AUDITS**
- **Weekly**: TypeScript and ESLint compliance
- **Bi-weekly**: Test coverage and performance metrics
- **Monthly**: Full architectural compliance review

### **AUDIT CRITERIA**
1. **Zero TypeScript errors**
2. **Zero ESLint violations**
3. **100% test coverage for critical paths**
4. **95%+ Fortune 500 quality standards**
5. **Single-repo architecture compliance**

---

## 🚨 **VIOLATION PENALTIES**

### **MINOR VIOLATIONS**
- **TypeScript errors**: Immediate fix required
- **ESLint violations**: 24-hour resolution
- **Test failures**: Block deployment until resolved

### **MAJOR VIOLATIONS**
- **Architectural drift**: Immediate architectural review
- **Monorepo introduction**: Rollback and governance review
- **Documentation conflicts**: SSOT restoration required

### **CRITICAL VIOLATIONS**
- **Anti-drift governance breach**: Immediate project halt
- **Architecture sabotage**: Formal disciplinary action
- **Compliance failure**: Vendor penalty assessment

---

## 📝 **COMPLIANCE CHECKLIST**

### **DEVELOPER COMPLIANCE**
- [ ] Read and understood anti-drift governance
- [ ] Verified single-repo architecture compliance
- [ ] Confirmed TypeScript and ESLint compliance
- [ ] Validated test coverage requirements
- [ ] Documented all architectural decisions

### **PROJECT COMPLIANCE**
- [ ] Single-repo structure maintained
- [ ] All tests passing (100%)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint violations
- [ ] Fortune 500 quality standards met

---

## 🔄 **GOVERNANCE UPDATES**

### **VERSION HISTORY**
- **v6.1**: Monorepo with Turborepo (DEPRECATED)
- **v7.0**: Single-repo with Vite + React + TypeScript (CURRENT)

### **NEXT REVIEW DATE**
**September 28, 2025** - Monthly governance review

---

## 📞 **COMPLIANCE CONTACTS**

**Governance Officer**: Wee  
**Architecture Lead**: Wee  
**Compliance Team**: Wee  

**Emergency Contact**: Immediate escalation for anti-drift violations

---

*This document serves as the Single Source of Truth (SSOT) for anti-drift governance. All developers must comply with these standards to avoid penalties and ensure project success.*
