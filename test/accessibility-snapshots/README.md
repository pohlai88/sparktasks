# Accessibility Snapshots Directory

This directory contains accessibility tree snapshots for regression testing.

## Files

- `*.json` - Baseline accessibility snapshots
- `*.failed.json` - Failed snapshots for comparison (temporary)
- `coverage-report.json` - Coverage and validation report

## Usage

### Generate Baselines

```bash
UPDATE_SNAPSHOTS=true npx playwright test test/e2e/a5-accessibility-snapshots.spec.ts
```

### Run Validation

```bash
npx playwright test test/e2e/a5-accessibility-snapshots.spec.ts
```

### Update Specific Flow

```bash
UPDATE_SNAPSHOTS=true npx playwright test -g "QuickAdd-EmptyState"
```

## Debugging Failures

When an accessibility snapshot fails:

1. Check the `*.failed.json` file for current state
2. Compare with baseline `*.json` file
3. Determine if change is intentional or regression
4. Update baseline if intentional: `UPDATE_SNAPSHOTS=true npm test`

## Integration

These snapshots are integrated with:

- SSOT LayeredSelector patterns
- Existing test fixtures and helpers
- CI/CD pipeline for automated validation
