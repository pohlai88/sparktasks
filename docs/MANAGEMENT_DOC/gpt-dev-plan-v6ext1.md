# 🛡️ GPT Dev Plan v6ext1 — Drift‑Safe + Progressive Modes (Vibe Coding SSOT)

**Purpose**: One master, drift‑safe playbook to govern vibe‑coding for SparkTasks. It merges **Dev Plan v5** with **Progressive Modes** into a single, enforceable SSOT: allowed/forbidden paths, phase gates, feature flags, DoD, tests, and wireframes.

**Rule #1 (Anti‑Drift)**: If a change needs >\~220 diff lines _or_ requires leaving allowed paths → **stop and ask ONE question**. Output unified git diff only (no prose).

---

## 0) Universal Anti‑Drift Header (prepend to every task)

**DRIFT‑SAFE CODING INSTRUCTION — SparkTasks**

- Apply only the explicit change. If completion requires leaving allowed paths or >\~220 diff lines, stop and return ONE clarifying question.
- **Output**: unified git diff only (no prose/logs).
- **Rules**: surgical patch; preserve unaffected lines; don’t change public APIs/flags/error‑codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn; **tokens only** (no hardcoded Tailwind); keep `data-testid` selectors stable.
- **DoD (ALL tasks)**: type‑check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI validates focus/ARIA/keyboard; zero console errors; zero TODOs.

> **North Star / Gates**: BYOS adoption ≥60%, portability ≥99%; p95 search <200ms @10k; lists 60fps @10k; drawer TTI <120ms; bundle <250KB gz; zero server‑side content in BYOS; audit to user storage; rate limits on.

---

## 1) Ground‑Truth Snapshot

- **Positioning**: storage‑neutral, local‑first task hub; win on TCO, portability, explainable speed.
- **Critical Gap**: Functional UI is the priority (no placeholder shells). Backend/domain logic exists; build **usable task + file workflows** now.
- **Competitive Promise**: Linear‑grade speed, Trello familiarity, unified approvals, project‑native files, visible sovereignty.

---

## 2) Folder Policy — Allowed / Keep / Forbidden

### 2.1 Allowed (patches permitted)

- `src/components/**` (UI only — keep public props stable)
- `src/modules/tasks/**` (wire to existing stores/services only; no API shape changes)
- `src/modules/files/**` (Preview, Library; wire‑up only)
- `src/stores/**` **read‑only contracts**; may add selectors/hooks without breaking shape
- `src/app/(routes)/board/**`, `src/app/(routes)/library/**`, `src/App.tsx`
- `src/config/modes.ts` (SSOT for feature flags)
- `tests/**` (unit/integration/e2e + selector SSOT)
- `docs/` (this file + wireframes)

### 2.2 Keep / Create (scaffold)

```
src/
  components/
    ui/              # Buttons, Cards, Drawer, Badge, StatusPill (token-only)
    layout/          # AppShell, WorkspaceShell, SplitPanels, NavigationSystems
    data/            # DataTable, DataVisualization, RealtimeUpdates
    features/        # CommandPalette, SearchInput, QuickAdd, InlineEdit, Tooltip, ModeGate
  modules/
    tasks/           # TaskCard, TaskForm, TaskDrawer, KanbanBoard (DnD)
    files/           # FileLibrary, AssetCard, PreviewPane, ApprovalBanner (shared)
  stores/            # taskStore, fileStore (contracts intact), selectors
  config/            # modes.ts  ← FEATURE_MATRIX SSOT
  design/            # tokens.ts (SSOT), typography, elevations
  app/(routes)/      # board/, library/
  lib/               # utils, cn, combineTokens

tests/
  ssot/selectors.ts  # single source for data-testid
  unit/              # Vitest component specs
  integration/       # Component interaction specs
  e2e/               # Playwright specs

docs/
  plans/gpt-dev-plan-v5ext1.md  # this file
  wireframes/                   # ascii.md + png exports if needed
```

### 2.3 Forbidden

- **Hardcoded Tailwind classes** (must use `DESIGN_TOKENS` + `combineTokens()`)
- New screens/shells outside **Board / List / Drawer / Spotlight** paradigms
- Performance regressions; UI bloat; unstable public APIs
- CI, security/E2EE, billing contracts — **do not modify** without explicit approval
- Adding dependencies; changing build tooling; lockfile churn

---

## 3) Progressive Modes (SSOT) — Individual → Team → Organization

### 3.1 SSOT Types & Matrix

```ts
// src/config/modes.ts
export type AppMode = 'individual' | 'team' | 'org';

export interface FeatureFlags {
  approvals: boolean; // Unified approval banner
  files: boolean; // File Library + Preview
  powerQuickAdd: boolean; // @assignee #label !priority ^due grammar
  presence: boolean; // real-time presence, typing indicators
  byos: boolean; // storage provider switch + residency badge
  sso: boolean; // SSO/SCIM (read-only UI surfaces)
  adminInsights: boolean; // usage, members, policy readouts
}

export const FEATURE_MATRIX: Record<AppMode, FeatureFlags> = {
  individual: {
    approvals: false,
    files: true, // local-only basics
    powerQuickAdd: true,
    presence: false,
    byos: false,
    sso: false,
    adminInsights: false,
  },
  team: {
    approvals: true, // single approver
    files: true,
    powerQuickAdd: true,
    presence: true,
    byos: true, // limited providers
    sso: false,
    adminInsights: true,
  },
  org: {
    approvals: true, // seq/parallel/quorum
    files: true,
    powerQuickAdd: true,
    presence: true,
    byos: true, // multi-storage + residency
    sso: true,
    adminInsights: true,
  },
};
```

> **Single source**: All gating comes from `FEATURE_MATRIX`. No distributed flags.

### 3.2 ModeGate Wrapper (non‑intrusive)

```tsx
// src/components/features/ModeGate.tsx
import { FEATURE_MATRIX, type AppMode } from '@/config/modes';
import { useAppMode } from '@/stores/selectors'; // read-only hook

export function ModeGate({
  requires,
  children,
}: {
  requires: keyof FeatureFlags;
  children: React.ReactNode;
}) {
  const mode = useAppMode() as AppMode;
  return FEATURE_MATRIX[mode][requires] ? <>{children}</> : null;
}
```

**Usage**

```tsx
<ModeGate requires="approvals"><ApprovalBanner data-testid="approval-banner"/></ModeGate>
<ModeGate requires="byos"><ResidencyBadge data-testid="residency-badge"/></ModeGate>
```

### 3.3 Mode Switcher (topbar)

- **Location**: AppShell topbar right (beside Profile)
- **States**: `Individual | Small Team | Organization`
- **Persistence**: per workspace (store + local fallback)
- **A11y**: labeled control; focus ring; visible indicator of current mode

### 3.4 Capability Matrix (at a glance)

| Capability                   | Individual |           Small Team |                   Organization |
| ---------------------------- | ---------: | -------------------: | -----------------------------: |
| Task CRUD + QuickAdd grammar |         ✅ |                   ✅ |                             ✅ |
| File Library + Preview       | ✅ (local) |                   ✅ |                             ✅ |
| Unified Approval Banner      |         ❌ | ✅ (single approver) |       ✅ (seq/parallel/quorum) |
| Real‑time Presence           |         ❌ |                   ✅ |                             ✅ |
| BYOS + Residency Badge       |         ❌ |         ✅ (limited) | ✅ (multi-storage + residency) |
| Admin Insights               |         ❌ |                   ✅ |                             ✅ |
| SSO/SCIM                     |         ❌ |                   ❌ |                             ✅ |

---

## 4) Phase Plan — Individual → Team → Organization

### Stage 1: Individual Excellence (Weeks 1–6)

#### M0 (Week 1–2): **Shell + Trello‑parity foundation**

- AppShell/Topbar/Sidebar (token‑driven)
- KanbanBoard (60fps DnD mouse+keyboard)
- QuickAdd per column (optimistic), TaskDrawer with inline edit
- CommandPalette (⌘K), SearchInput p95 <200ms
- Library entry in Sidebar; Residency badge surface (gated)

**DoD (M0)**

- p95 interaction <200ms @10k, DnD 60fps, tab order + ARIA complete
- Unit + Integration >90% on touched components; E2E happy path (add/edit/dnd)
- Tokens‑only; no public API breaks; zero console errors

**Tests (M0)**

- Vitest: TaskCard, QuickAdd, Drawer a11y
- Playwright: board smoke (`board-container`), create card, DnD, open Drawer

#### M1 (Week 3–4): **Task depth + File intelligence**

- Power Quick Add grammar (@, #, !, ^)
- Focus Sessions (⌘J)
- Editors: Priority/Labels/Relations/Checklist
- Unified Approval Banner v1 (single approver) **shared by Task + Asset**
- File Library Grid/List; Asset Preview in Drawer (image/pdf/video)
- Local PDF/Doc text extraction; Spotlight tokens (`type:pdf ext:docx owner:@alice`)
- Offline upload queue; calendar overlay (read‑only hotspots)

**DoD (M1)**

- Unified approval banner used by Task + Asset
- Local search shows PDF content; no context switch task→file→approval
- Perf: preview <120ms; search p95 <200ms; background upload resilient

**Tests (M1)**

- Unit: ApprovalBanner, AssetCard, PreviewPane
- E2E: ZCS proof; unified approval proof; PDF text match

#### M2 (Week 5–6): **BYOS + Migration + Sovereignty proof**

- Google Drive BYOS; CSV Import (smart mapping); `.sparkpack` export/import (≥99% fidelity)
- Ed25519 signing + verify badge in Activity; offline CRUD with conflict‑cards
- Residency badge popover; Provider selector; Notifications Center; Billing light

**DoD (M2)**

- `.sparkpack` retains file↔task relations; signatures verifiable
- Storage switch preserves relationships; conflict‑cards resolve offline edits
- Admin: Members/Usage visible; basic notifications working

**Tests (M2)**

- Unit: CSVMapping, ResidencyBadge
- E2E: sovereignty demo (provider switch), import/export fidelity, offline conflict flow

### Stage 2: Team Collaboration (Weeks 7–12)

- Real‑time presence; flow chips; WIP limits; dependency mini‑map; shared views & briefs
- Approvals v2 (sequential/parallel/quorum); multi‑storage BYOS; policy templates (read‑only)

**DoD**: presence <300ms; WIP gentle saturation; briefs printable; approval activity unified

### Stage 3: Organization (Weeks 13–18)

- SSO/SCIM; policy inheritance (explainable); audit excellence; global scale options (read‑only toggles)

**DoD**: org policy reads; audit chain visible; export compliance bundle (no backend change in this phase)

---

## 5) Testing SSOT — Selectors, Budgets, Templates

### 5.1 Selector SSOT (import in tests)

```ts
// tests/ssot/selectors.ts
export const S = {
  // Shell & nav
  navTasks: 'nav-tasks',
  navSidebar: 'nav-sidebar',
  projectSwitcher: 'project-switcher',
  // Board & tasks
  board: 'board-container',
  quickAdd: 'quick-add-input',
  taskTitle: 'task-title',
  dnd: 'card-dnd-handle',
  drawer: 'task-detail-drawer',
  // Search & commands
  search: 'search-input',
  results: 'search-results',
  palette: 'command-palette',
  macroRun: 'macro-run',
  macroWhy: 'macro-why',
  // Files
  upload: 'asset-upload',
  fileInput: 'file-input',
  filePreview: 'asset-preview',
  fileMatch: 'pdf-content-match',
  library: 'nav-library',
  // Approvals & Modes
  approvalBanner: 'approval-banner',
  taskApprove: 'task-approval-banner',
  assetApprove: 'asset-approval-banner',
  modeSwitcher: 'mode-switcher',
  modeIndicator: 'mode-indicator',
  residencyBadge: 'residency-badge',
};
```

### 5.2 E2E templates (Playwright)

```ts
// tests/e2e/executive.spec.ts
import { test, expect } from '@playwright/test';
import { S } from '../ssot/selectors';

test('Zero context switching proof', async ({ page }) => {
  const t0 = performance.now();
  await page.goto('/board');
  await page.click(`[data-testid="${S.taskTitle}"]`);
  await page.click(`[data-testid="${S.upload}"]`);
  await page.setInputFiles(`[data-testid="${S.fileInput}"]`, 'contract.pdf');
  await expect(page.locator(`[data-testid="${S.filePreview}"]`)).toBeVisible();
  await page.click('[data-testid="drawer-close"]');
  await page.fill(`[data-testid="${S.search}"]`, 'type:pdf contract terms');
  await expect(page.locator(`[data-testid="${S.fileMatch}"]`)).toBeVisible();
  expect(performance.now() - t0).toBeLessThan(2000);
});
```

### 5.3 Modes E2E

```ts
// tests/e2e/modes.spec.ts
import { test, expect } from '@playwright/test';
import { S } from '../ssot/selectors';

test('Individual hides approvals & BYOS; Org shows them', async ({ page }) => {
  await page.goto('/board');
  await page.click(`[data-testid="${S.modeSwitcher}"]`);
  await page.click('text=Individual');
  await expect(page.locator(`[data-testid="${S.approvalBanner}"]`)).toHaveCount(
    0
  );
  await expect(page.locator(`[data-testid="${S.residencyBadge}"]`)).toHaveCount(
    0
  );
  await page.click(`[data-testid="${S.modeSwitcher}"]`);
  await page.click('text=Organization');
  await expect(
    page.locator(`[data-testid="${S.approvalBanner}"]`)
  ).toBeVisible();
  await expect(
    page.locator(`[data-testid="${S.residencyBadge}"]`)
  ).toBeVisible();
});
```

### 5.4 Unit/Integration (Vitest)

```tsx
// tests/unit/ApprovalBanner.test.tsx
it('renders cryptographic badge and handles approve', async () => {
  render(<ApprovalBanner />);
  expect(screen.getByTestId('approval-banner')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /approve/i }));
  expect(await screen.findByText(/signature verified/i)).toBeVisible();
});
```

### 5.5 Performance Budgets

- `drawer_tti < 120ms`, `search_p95 < 200ms @10k`, `drag_drop 60fps`, `file_preview < 120ms`, `approval_flow < 100ms`, `offline_sync < 2s`.

---

## 6) DoD — Cross‑Cutting Quality Gates

- **Type Safety**: strict TS, no `any`; public types stable.
- **A11y**: axe‑clean; keyboard flows; ARIA current/page; focus outlines; focus trap in drawers.
- **Performance**: budgets met; no layout thrash; content‑visibility where safe; virtualization for large lists.
- **Design System**: 100% token usage; `combineTokens` for variants; scorecard pass.
- **Docs**: update MDX/README per component; include purpose/usage/a11y/API.

---

## 7) Wireframes (ASCII)

### 7.1 Board + Drawer (M0)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Topbar [Search ⌘K] [Residency • Google Drive]              [Profile ●]     │
├───────────────┬────────────────────────────────────────────────────────────┤
│ Sidebar       │  Board (Project Alpha)                                     │
│ • Board       │  ┌────────────┬────────────┬────────────┐                  │
│ • Library     │  │ To Do      │ In Progress│ Done       │                  │
│ • Settings    │  │ [+] card…  │ [+] card…  │ [+] card…  │  ⟶ ☐ Focus      │
│               │  │ [Card ▣]   │ [Card ▣]   │ [Card ▣]   │     session      │
│               │  └────────────┴────────────┴────────────┘                  │
│               │                                                      ⟶ ⌘K   │
└───────────────┴────────────────────────────────────────────────────────────┘
                             ┌──────────────────────────────┐
                             │ Task Drawer                  │
                             │ Title [InlineEdit]           │
                             │ Chips [Priority][Labels]     │
                             │ Files [Preview] [Upload]     │
                             │ Approval Banner [Approve]    │
                             └──────────────────────────────┘
```

### 7.2 File Library (M1)

```
┌────────────────────────────── Library ─────────────────────────────────────┐
│ [Grid|List]  [type:pdf ext:docx owner:@alice]  [Upload]  [Residency •]     │
│ ┌────┬────┬────┬────┬────┬────┐                                           │
│ │📄  │🖼  │🎞  │PDF │IMG │MP4 │  …                                         │
│ └────┴────┴────┴────┴────┴────┘  ⟶ click → opens Preview in same shell     │
└────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Approvals (M1→M2)

```
[Approval Banner]  Asset/Task • Requested by Alice • cryptographic‑signature ✔
[Approve] [Request changes]    Activity: signed by Bob • witness verified
```

### 7.4 Modes — Topbar Switcher

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [Search ⌘K]                               [Mode: Individual ▾] [Profile ●] │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 8) Micro‑Patch Plan (≤\~220 lines each)

1. **Add SSOT**: `src/config/modes.ts` + export types & matrix.
2. **Add ModeGate**: `components/features/ModeGate.tsx`.
3. **Mount ModeSwitcher**: minimal control in `AppShell` (read‑only store).
4. **Wrap Surfaces**: ApprovalBanner, ResidencyBadge, File Library controls.
5. **Selectors + Tests**: update `tests/ssot/selectors.ts`, add unit + e2e specs.
6. **QuickAdd + Drawer polish**: token‑only styles; a11y focus trap; perf trace.
7. **PreviewPane lazy import**: ensure budgets.
8. **CSV Import + .sparkpack**: fidelity tests.

**Task Template (paste into prompts)**

```
Goal: <what to change>
Allowed: <paths>
Forbidden: §2.3
Selectors: import from tests/ssot/selectors.ts
Tokens: import { DESIGN_TOKENS, combineTokens } from '@/design/tokens'
Output: git diff only, ≤220 lines, no prose
DoD: typecheck/test/build; a11y; perf budget; no console errors
```

---

## 9) Token & Styling Rules (no exceptions)

- Import `{ DESIGN_TOKENS, combineTokens }` from `@/design/tokens`.
- Replace any literal Tailwind classes with tokens; variants map to token groups.
- Add new design primitives **only** via tokens; propose token before code.

---

## 10) Success Metrics (Exec‑visible)

- Zero‑context‑switch workflows >95%
- Unified approval usage 100% across tasks/assets
- Residency visibility 100%; provider switch retains relations
- p95 interaction <200ms; preview <120ms; DnD 60fps

---

## 11) Governance

- **Change Control**: micro‑patch discipline; if scope exceeds bounds → one question, then stop.
- **Audit**: log mode changes (who/when) — read‑only in this phase; no CI/security edits without approval.

---

## 12) Quick Start for Agents

```
Goal: Introduce progressive Mode gating + foundational UI without breaking contracts.
Allowed: src/config/modes.ts, components/features/ModeGate.tsx, components/layout/AppShell.tsx, modules/tasks/**, modules/files/**, tests/**
Forbidden: deps/CI/security; public API changes; hardcoded Tailwind; flags outside modes.ts
Selectors: import from tests/ssot/selectors.ts
Tokens: import { DESIGN_TOKENS, combineTokens } from '@/design/tokens'
Output: unified git diff only, ≤220 lines, no prose
DoD: tests green; a11y intact; perf budgets unchanged; hidden features non‑interactive
```
