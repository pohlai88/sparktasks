# RAILWAYSTATION Interface — Single Source of Truth (SSOT) v1.0

**Date:** 2025-08-28  
**Applies to:** SparkTasks v7.x Single-Repo  
**Owner:** Architecture Lead (Wee)  
**Status:** ✅ Approved (governs implementation + tests)  
**Governance Compliance:** Anti-Drift v7.1 + Fortune 500 Standards  

---

## 0) Purpose & Non‑Negotiables

This SSOT defines the **canonical interface** and **component contract** for the `RailwayStation` UI in the Railway blueprint. It eliminates ambiguity between implementation and tests and replaces any ad‑hoc or assumption-based behavior.

**Non‑Negotiables**

* **No assumptions**: All props must be validated (Zod).
* **Token governance**: No hardcoded Tailwind; consume **enhanced tokens** only.
* **Single‑repo rules**: Follow the **UI architecture flow** (Tailwind → CSS variables → enhanced tokens → ui‑enhanced → railway components).
* **Strict TS**: `strict: true`, zero `any`, explicit bounds for numbers.
* **A11y**: Keyboard + screen reader compliant.

---

## 1) Domain Model — `RailwayStation`

Represents a **project control point** (Initiation, Budgeting, Scheduling, Risk, Execution, QA, Handover, Evaluation, etc.).

### 1.1 Type Definitions (authoritative)

```ts
// Station operational status (UI + logic). Narrow, enumerable.
export type StationStatus =
  | "planned"
  | "active"
  | "blocked"
  | "delayed"
  | "completed"
  | "cancelled";

export interface RailwayStation {
  /** Stable ID across sessions (UUID/string) */
  id: string;
  /** Human label for display */
  name: string;
  /** Kebab-case slug used for URLs/qa-ids. REQUIRED; do not compute in render. */
  slug: string; // e.g. "scheduling"
  /** Station position in the route (0-based) */
  index: number; // >= 0
  /** Operational status */
  status: StationStatus;
  /** Whole-number percentage 0..100 */
  progressPct: number; // int 0..100
  /** Optional ETA (ISO 8601) */
  eta?: string;
  /** Optional short description */
  description?: string;
  /** Optional metrics for badges/heatmaps */
  metrics?: {
    openIssues?: number;
    risks?: number;
    budgetVariancePct?: number; // -100..100
  };
  /** Useful external links (doc ids, deep links) */
  links?: {
    href?: string;
    docIds?: string[];
  };
}
```

### 1.2 Validation Schema (must gate all external data)

```ts
import { z } from "zod";

export const StationStatusZ = z.enum([
  "planned",
  "active",
  "blocked",
  "delayed",
  "completed",
  "cancelled",
]);

export const RailwayStationZ = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), // kebab-case only
  index: z.number().int().min(0),
  status: StationStatusZ,
  progressPct: z.number().int().min(0).max(100),
  eta: z.string().datetime().optional(),
  description: z.string().min(1).max(500).optional(),
  metrics: z
    .object({
      openIssues: z.number().int().min(0).optional(),
      risks: z.number().int().min(0).optional(),
      budgetVariancePct: z.number().min(-100).max(100).optional(),
    })
    .optional(),
  links: z
    .object({
      href: z.string().url().optional(),
      docIds: z.array(z.string()).optional(),
    })
    .optional(),
});

export type RailwayStationValidated = z.infer<typeof RailwayStationZ>;
```

> **Why slug is required:** The previous crash (`Cannot read properties of undefined (reading 'replace')`) indicates an unsafe `slug` generation at render time. Slug must be **precomputed and validated** before rendering; adapters may compute slugs, but the component never should.

---

## 2) Component Contract — `RailwayStationCard`

The UI representation of a station; consumes **ui‑enhanced** primitives and **enhanced tokens** only.

### 2.1 Props

```ts
export interface RailwayStationProps {
  /** Canonical station object — the only mandatory prop */
  station: RailwayStation;

  /** Presentation variations */
  variant?: "compact" | "default" | "detailed";

  /** Optional interaction hooks */
  onSelect?: (id: string) => void;               // click/enter
  onAction?: (id: string, action: "open" | "advance" | "rollback") => void;

  /** Behavior flags */
  disabled?: boolean;
  qaId?: string; // overrides default `station.slug`
}
```

### 2.2 Derived/Computed (implementation guidance)

* `qaId = props.qaId ?? station.slug`
* Map `station.status` → **semantic badge tokens** (no hardcoded colors).
* Clamp `progressPct` to `[0,100]` at the boundary before render (extra safety).
* Prefer memoization for expensive badges/intl formatting.

### 2.3 Forbidden

* ❌ Computing `slug` via `name.replace(...)` at render time.
* ❌ Hardcoded classnames for colors/spacing/typography.
* ❌ Network calls inside the component.

---

## 3) Token Consumption (no hardcoded Tailwind)

**All visual states** must use the semantic token layer, e.g.:

```
status → badge tokens (success | warning | destructive | muted | primary | secondary)
progress → progress tokens
surface → card tokens (elevated | outlined | flat)
```

> If a token is missing: extend **tailwind.config.js → \:root CSS vars → enhanced‑tokens.ts**, then consume here. Do **not** inline any new classes.

---

## 4) Accessibility & UX

* Focusable root with `role="button"` when `onSelect` provided; otherwise semantic `article`/`section`.
* Keyboard: `Enter` triggers `onSelect`; `Space` (pressed) triggers as button.
* ARIA: `aria-current="step"` when active station; `aria-disabled` when disabled.
* Motion: respect `prefers-reduced-motion` for progress animations.

---

## 5) Testing Contract (authoritative)

**Unit (Vitest + RTL)**

1. Valid station renders without errors.
2. Missing `slug` fails validation (never reaches render).
3. Status → badge token mapping asserts correct semantic classes (via testid).
4. `onSelect` fires on click and `Enter`.
5. `progressPct` outside bounds is clamped.

**Fixtures**

```
/tests/fixtures/railway/stations.json
[
  {
    "id": "init",
    "name": "Initiation",
    "slug": "initiation",
    "index": 0,
    "status": "completed",
    "progressPct": 100
  },
  {
    "id": "sched",
    "name": "Scheduling",
    "slug": "scheduling",
    "index": 2,
    "status": "active",
    "progressPct": 65
  }
]
```

**E2E (Playwright)**

* Smoke: Station card is visible with correct label + badge.
* Keyboard: `Tab` to focus, `Enter` triggers selection.
* Visual regression: screenshot of compact/default/detailed variants.

**A11y**

* Axe-core pass (no color contrast regressions; uses tokenized colors).

---

## 6) Migration & Enforcement

* **Canonical input is `station: RailwayStation`.**
* Any legacy components/tests using individual props must refactor to use the **station object**.
* Provide a one-time adapter in tests only (to migrate fixtures); do **not** keep dual APIs.

**Adapter (tests only)**

```ts
export const adaptLegacyToStation = (p: {
  id: string;
  name: string;
  status: StationStatus;
  progressPct: number;
}) => ({
  id: p.id,
  name: p.name,
  slug: p.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-"), // compute ONCE in fixture setup
  index: 0,
  status: p.status,
  progressPct: Math.max(0, Math.min(100, Math.round(p.progressPct))),
});
```

> This adapter is **not** allowed inside production components. Fixtures must be migrated and checked in.

---

## 7) DoD for RailwayStation Stabilization

* ✅ `RailwayStation` types + Zod schema shipped under `src/types/railway.ts`.
* ✅ `RailwayStationCard` consumes **ui‑enhanced** primitives + tokens only.
* ✅ Unit tests (5) + fixtures added with 100% branch coverage.
* ✅ No `.replace` usage in render path; slug validated upstream.
* ✅ A11y checks green; keyboard support proven.
* ✅ No hardcoded classes; tokens extended only via approved flow.

---

## 8) Reference Implementation Notes (non-binding)

* Use `<Card>`, `<Badge>`, `<Progress>`, `<Button>` from `ui-enhanced`.
* Derive badge variant:

  * `completed → success`
  * `delayed → warning`
  * `blocked → destructive`
  * `active → primary`
  * `planned → muted`
  * `cancelled → secondary`

---

## 9) Anti-Drift Governance Compliance

**This SSOT enforces the following anti-drift rules:**

1. **Single Interface Pattern**: No dual APIs or competing implementations
2. **UI Architecture Flow**: Strict adherence to enhanced tokens only
3. **Validation Gates**: Zod schemas prevent invalid data from reaching components
4. **Test Contract**: Clear expectations prevent test/component drift
5. **No Hardcoded Values**: All visual states use semantic token layer

**Governance References:**
- `ANTI_DRIFT_GOVERNANCE_FINAL_v7.md` - Core anti-drift rules
- `UI_ARCHITECTURE_VALIDATION_REPORT_v7.md` - UI compliance standards
- `RAILWAY_IMPLEMENTATION_MASTER_PLAN_v7.md` - Railway implementation strategy

---

**This SSOT supersedes any prior implicit contracts for RailwayStation and is the authoritative source for all RailwayStation implementations.**
