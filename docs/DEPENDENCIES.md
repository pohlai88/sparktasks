# Dependency Management Policy - SSOT

**Last Updated**: 2025-08-15  
**Review Cadence**: Per-sprint dependency audit

## 🎯 **Dependency Hygiene Rules**

### **Add-by-Story Policy**
Every dependency must be:
1. **Referenced in code** - No unused packages in production builds
2. **Owned by feature** - Clear purpose and owner documented
3. **Sprint-scoped** - Added only when implementation begins
4. **Audit-tracked** - Changes reviewed and approved

### **Reintroduction Process (Radix UI Example)**
When adding UI components:

```bash
# 1. Add package
npm install @radix-ui/react-dialog

# 2. Create wrapper component - Apply SparkTasks brand tokens
# 3. Verify accessibility - Keyboard navigation, screen reader compatibility
# 4. Document usage - Add to component library
# 5. Update this policy - Record in dependency ledger below
```

## 📋 **Current Dependency Ledger**

### **Production Dependencies**
| Package | Purpose | Owner | Feature Scope | Added Date |
|---------|---------|-------|---------------|------------|
| react | Core UI framework | Lead Engineer | All UI | 2025-08-15 |
| react-dom | DOM rendering | Lead Engineer | All UI | 2025-08-15 |
| react-hook-form | Form management | Frontend Lead | Task creation/editing | 2025-08-15 |
| zustand | State management | Frontend Lead | Global app state | 2025-08-15 |
| lucide-react | Icon system | UI Lead | All icons | 2025-08-15 |
| clsx | Conditional classes | UI Lead | Component styling | 2025-08-15 |
| tailwind-merge | Class deduplication | UI Lead | Component styling | 2025-08-15 |
| zod | Schema validation | API Lead | Forms + API contracts | 2025-08-15 |

### **Development Dependencies**
| Package | Purpose | Owner | Usage |
|---------|---------|-------|-------|
| @vitejs/plugin-react | React build support | Build Engineer | Development server |
| vitest | Unit testing | Test Lead | Test runner |
| @playwright/test | E2E testing | Test Lead | Browser testing |
| @testing-library/react | Component testing | Test Lead | React unit tests |
| tailwindcss | CSS framework | UI Lead | Styling system |
| typescript | Type checking | Lead Engineer | Development tooling |
| @vitest/coverage-v8 | Code coverage reporting | Test Lead | Coverage analysis |
| vite | Build tool and dev server | Build Engineer | Development tooling |

### **Removed Dependencies (Available for Re-add)**
| Package | Removed Date | Reason | Reintroduction Trigger |
|---------|--------------|--------|----------------------|
| @radix-ui/react-dialog | 2025-08-15 | Not yet implemented | Task creation modal story |
| @radix-ui/react-dropdown-menu | 2025-08-15 | Not yet implemented | Settings menu story |
| @radix-ui/react-select | 2025-08-15 | Not yet implemented | Tag selection story |
| @radix-ui/react-switch | 2025-08-15 | Not yet implemented | Settings toggle story |
| @radix-ui/react-toast | 2025-08-15 | Not yet implemented | Notifications story |

## Policy
- Additions require a one-line purpose entry here and an owner (team or person).
- For transient or dev-only tools, document them under a `devDependencies` heading.
- Meta-packages like `@types/*` and `eslint-*` are auto-ignored and don't need documentation.

## How to add a dependency
1. Open a PR that updates `package.json` and adds an entry here explaining the purpose and owner.
2. CI will reject PRs that add dependencies without a corresponding docs entry.
3. Run `npm run validate` locally to check compliance before pushing.
