# E2E Test Suite SSOT Migration Plan

## Executive Summary

**Recommendation: TARGETED REFACTOR** - Migrate existing legacy tests to SSOT patterns while preserving working infrastructure.

## Current State Analysis

### ✅ **SSOT-Compliant Tests (Keep & Enhance)**

- `a1-foundation-ssot.spec.ts` (9/10 tests passing)
- `a2-move-snooze-ssot.spec.ts` (SSOT selectors working)
- `a4-search-quickadd.spec.ts` (12/12 tests passing)
- `a5-accessibility-snapshots.spec.ts` (Advanced SSOT patterns)
- `a5-enhanced-patterns.spec.ts` (Layered selector architecture)

### ❌ **Legacy Tests (Migrate or Remove)**

- `a1-basic-task-ui.spec.ts` → **MIGRATE** (overlaps with a1-foundation-ssot.spec.ts)
- `a1-dod-validation.spec.ts` → **MERGE** into foundation-ssot
- `a2-task-interactions.spec.ts` → **MIGRATE** (overlaps with a2-move-snooze-ssot.spec.ts)
- `a2-task-interactions-fixed.spec.ts` → **REMOVE** (duplicate)
- `a2-task-interactions-accessibility.spec.ts` → **MERGE** into A3 tests
- `a1-foundation-repaired.spec.ts` → **REMOVE** (superseded by SSOT version)

### 🔀 **Utility/Debug Tests (Consolidate)**

- `debug-tab.spec.ts` → **MOVE** to debug/ folder
- `debug-task-creation.spec.ts` → **MOVE** to debug/ folder
- `test-fixed-helper.spec.ts` → **MERGE** into helpers test suite

## Migration Strategy

### Phase 1: Remove Duplicate/Obsolete Tests (Immediate)

```bash
# Remove redundant files that have SSOT equivalents
rm test/e2e/a1-foundation-repaired.spec.ts        # Superseded by a1-foundation-ssot.spec.ts
rm test/e2e/a2-task-interactions-fixed.spec.ts    # Duplicate functionality
rm test/e2e/test-fixed-helper.spec.ts             # Test infrastructure, not E2E
```

### Phase 2: Migrate Core Legacy Tests

1. **A1 Migration** - Consolidate into `a1-foundation-ssot.spec.ts`:
   - Merge `a1-basic-task-ui.spec.ts` test cases
   - Integrate `a1-dod-validation.spec.ts` DoD checks
   - Standardize all selectors to SSOT patterns

2. **A2 Migration** - Enhance `a2-move-snooze-ssot.spec.ts`:
   - Port working tests from `a2-task-interactions.spec.ts`
   - Fix keyboard navigation tests with proper SSOT selectors
   - Integrate accessibility tests from `a2-task-interactions-accessibility.spec.ts`

3. **A3 Migration** - Consolidate accessibility tests:
   - Merge `a3-accessibility.spec.ts` into `a3-accessibility-snapshots.spec.ts`
   - Ensure all A3 tests use SSOT snapshot architecture

### Phase 3: Fix SSOT Implementation Issues

1. **Button Conflict Resolution**:

   ```typescript
   // Fix multiple "Add" buttons causing strict mode violations
   // Ensure single source of truth for task creation UI
   ```

2. **Test ID Coverage**:

   ```typescript
   // Add missing test IDs identified by SSOT audit
   // Ensure all critical UI elements have data-testid attributes
   ```

3. **Selector Standardization**:
   ```typescript
   // Replace all legacy getByText(), CSS, XPath selectors
   // Use TestHelpers and SelectorMigration utilities
   ```

## Implementation Plan

### Immediate Actions (Next 2 Hours)

1. ✅ Remove duplicate/obsolete test files
2. ✅ Consolidate debug tests into debug/ folder
3. ✅ Fix critical button conflicts identified in SSOT audit

### Short-term (Next Day)

1. 🔄 Migrate A1 legacy tests to SSOT foundation
2. 🔄 Enhance A2 SSOT tests with missing functionality
3. 🔄 Consolidate A3 accessibility coverage

### Medium-term (Next Week)

1. 🎯 Complete test ID coverage audit
2. 🎯 Implement missing SSOT selectors in components
3. 🎯 Validate 100% SSOT compliance across suite

## Success Metrics

### Immediate (Technical Debt Reduction)

- [ ] Reduce test file count from 19 → 12
- [ ] Eliminate all `getByText()` selectors
- [ ] Fix strict mode violations (button conflicts)

### Quality Improvements

- [ ] 100% SSOT selector compliance
- [ ] All tests use TestHelpers/SelectorMigration utilities
- [ ] Zero redundant test coverage
- [ ] Consistent accessibility validation patterns

### Maintainability Gains

- [ ] Single source of truth for each UI flow
- [ ] Centralized selector management
- [ ] Automated SSOT compliance checking
- [ ] Clear test file naming and organization

## Risk Mitigation

### Preserve Working Tests

- Never remove a working SSOT test
- Migrate incrementally to avoid breaking CI
- Maintain backward compatibility during transition

### Validate Functionality

- Run full test suite after each migration step
- Ensure feature coverage is maintained
- Test both positive and negative scenarios

### Documentation

- Document migration decisions in commit messages
- Update test documentation with SSOT patterns
- Create migration guide for future contributors

## File Organization (Target State)

```
test/e2e/
├── a1-foundation-ssot.spec.ts          # Consolidated A1 tests
├── a2-interactions-ssot.spec.ts        # Consolidated A2 tests
├── a3-accessibility-snapshots.spec.ts  # Consolidated A3 tests
├── a4-search-quickadd.spec.ts          # Already SSOT compliant
├── a5-accessibility-snapshots.spec.ts  # Advanced patterns
├── a5-enhanced-patterns.spec.ts        # Layered selectors
├── health.spec.ts                      # API/health checks
├── phase2-advanced-features.spec.ts    # Future features
└── debug/
    ├── debug-tab.spec.ts
    └── debug-task-creation.spec.ts
```

## Conclusion

**Targeted Refactor** is the optimal approach because:

1. **Preserves Working Infrastructure** - SSOT architecture already 90% functional
2. **Reduces Technical Debt** - Eliminates 7 redundant test files
3. **Improves Maintainability** - Single source of truth for each feature
4. **Lower Risk** - Incremental migration vs full rebuild
5. **Faster Delivery** - Builds on existing working foundation

This approach will deliver immediate value by eliminating test conflicts while establishing a robust, maintainable E2E test suite aligned with SSOT principles.
