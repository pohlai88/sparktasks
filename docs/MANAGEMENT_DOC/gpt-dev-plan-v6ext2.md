# 🛡️ GPT Dev Plan **v5ext2** — Drift‑Safe + Progressive Modes + UI‑First (Vibe‑Coding SSOT)

> **Why this version?** Merges **v5ext1** (drift‑safe + modes) with **v6ext1** (UI‑first) **and fully restores/expands WIREFRAMES** so vibe‑coding stays aligned. This is the single SSOT to govern design + delivery.

**Rule #1 (Anti‑Drift):** If a change needs >\~220 diff lines _or_ leaves allowed paths → **stop and ask ONE question**. **Output unified git diff only** (no prose/logs).

---

## 0) Universal Anti‑Drift Header (prepend to every task)

**DRIFT‑SAFE CODING INSTRUCTION — SparkTasks**

- Apply only the explicit change. If completion requires leaving allowed paths or >\~220 diff lines, stop and return ONE clarifying question.
- **Output:** unified git diff only (no prose/logs).
- **Rules:** surgical patch; preserve unaffected lines; don’t change public APIs/flags/error‑codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn; **tokens only** (no hardcoded Tailwind); keep `data-testid` selectors stable.
- **DoD (ALL):** type‑check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI validates focus/ARIA/keyboard; zero console errors; zero TODOs.

**North‑Star Gates:** BYOS adoption ≥60%; portability ≥99%; p95 search <200ms @**10k**; lists 60fps @10k; drawer TTI <120ms; bundle <250KB gz; zero server‑side content in BYOS; audit to user storage; rate limits on.

---

## 1) Ground Truth & UI Vibe

- **Promise in Minute One:** speed you can feel • sovereignty you can see • zero context switches.
- **Surfaces:** **Board**, **Drawer**, **Library**, **Spotlight** — no new shells.
- **Vibe rules:** proof over prose • 120–180ms motion • keyboard DnD • visible focus • token‑only styling.

---

## 2) Folder Policy — Allowed / Keep / Forbidden

### 2.1 Allowed (patches permitted)

- `src/components/**` (UI only — keep public props stable)
- `src/modules/tasks/**` (wire to existing stores/services only; no API shape changes)
- `src/modules/files/**` (Preview, Library; wire‑up only)
- `src/stores/**` **read‑only contracts**; may add selectors/hooks without breaking shape
- `src/app/(routes)/board/**`, `src/app/(routes)/library/**`, `src/App.tsx`
- `src/config/modes.ts` (SSOT for feature flags) • `src/components/features/ModeGate.tsx`
- `design/tokens.ts` (+ `tokens.css` root CSS vars) • `tests/**` • `docs/**`

### 2.2 Keep / Create (scaffold)

```
src/
  components/
    layout/          # AppShell, WorkspaceShell, SplitPanels, NavigationSystems
    ui/              # Buttons, Inputs, Badge, StatusPill, Drawer, Tooltip
    features/        # CommandPalette, SearchInput, QuickAdd, InlineEdit, ModeGate, PerfHud, ResidencyBadge, OnboardingOverlay
  modules/
    tasks/           # KanbanBoard, TaskCard, TaskDrawer
    files/           # FileLibrary, AssetCard, PreviewPane, ApprovalBanner (shared)
  stores/            # taskStore, fileStore (contracts intact), selectors
  config/            # modes.ts  ← FEATURE_MATRIX SSOT
  design/            # tokens.ts (SSOT), tokens.css (root CSS vars), elevations
  app/(routes)/      # board/, library/
  lib/               # utils, cn, combineTokens

tests/
  ssot/selectors.ts  # single source for data-testid
  unit/              # Vitest component specs
  integration/       # Interaction specs
  e2e/               # Playwright specs

docs/
  plans/gpt-dev-plan-v5ext2.md  # this file
  wireframes/                   # ascii.md + png exports if needed
```

### 2.3 Forbidden

- **Hardcoded Tailwind classes** (must use `DESIGN_TOKENS` / CSS vars)
- New shells outside **Board / List / Drawer / Spotlight** paradigms
- Performance regressions; UI bloat; unstable public APIs
- CI, security/E2EE, billing contracts — **do not modify** without explicit approval
- Adding dependencies; changing build tooling; lockfile churn

---

## 3) Progressive Modes (SSOT) — Individual → Team → Organization

### 3.1 Types & Matrix (single source of truth)

```ts
// src/config/modes.ts
export type AppMode = 'individual' | 'team' | 'org';
export interface FeatureFlags {
  approvals: boolean;
  files: boolean;
  powerQuickAdd: boolean;
  presence: boolean;
  byos: boolean;
  sso: boolean;
  adminInsights: boolean;
}
export const FEATURE_MATRIX: Record<AppMode, FeatureFlags> = {
  individual: {
    approvals: false,
    files: true,
    powerQuickAdd: true,
    presence: false,
    byos: false,
    sso: false,
    adminInsights: false,
  },
  team: {
    approvals: true,
    files: true,
    powerQuickAdd: true,
    presence: true,
    byos: true,
    sso: false,
    adminInsights: true,
  },
  org: {
    approvals: true,
    files: true,
    powerQuickAdd: true,
    presence: true,
    byos: true,
    sso: true,
    adminInsights: true,
  },
};
```

### 3.2 ModeGate (non‑intrusive wrapper)

```tsx
// src/components/features/ModeGate.tsx
import {
  FEATURE_MATRIX,
  type AppMode,
  type FeatureFlags,
} from '@/config/modes';
import { useAppMode } from '@/stores/selectors';
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

### 3.3 Capability Matrix (at a glance)

| Capability                   | Individual |           Small Team |                   Organization |
| ---------------------------- | ---------: | -------------------: | -----------------------------: |
| Task CRUD + QuickAdd grammar |         ✅ |                   ✅ |                             ✅ |
| File Library + Preview       | ✅ (local) |                   ✅ |                             ✅ |
| Unified Approval Banner      |         ❌ | ✅ (single approver) |       ✅ (seq/parallel/quorum) |
| Real‑time Presence           |         ❌ |                   ✅ |                             ✅ |
| BYOS + Residency Badge       |         ❌ |         ✅ (limited) | ✅ (multi‑storage + residency) |
| Admin Insights               |         ❌ |                   ✅ |                             ✅ |
| SSO/SCIM                     |         ❌ |                   ❌ |                             ✅ |

---

## 4) Design System & Tailwind → Figma‑Feel Bridge

- **Tokens→CSS vars:** export tokens to `:root` in `design/tokens.css` and map to Tailwind `theme.extend`. Use semantic classes (`bg-surface`, `text-accent`) via a tiny internal mapping utility (no new deps).
- **Motion:** 120/160/180ms only; transform/opacity; no layout thrash.
- **Spacing:** 4/8 grid; radii sm/md/lg; elevation low/med/high.
- **Accessibility polish:** visible focus ring derived from accent token; focus trap in drawers; roving tabindex in menus.

---

## 5) Information Architecture & “First Five Minutes” Script

- **Topbar:** Search ⌘K • Mode Switcher • ResidencyBadge • PerfHud • Profile
- **Sidebar:** Board • Library • Settings
- **Board:** 60fps DnD; QuickAdd; TaskCard with keyboard affordances
- **Drawer:** Inline edit • Chips • Files (Upload + Preview above fold) • **ApprovalBanner** (gated)
- **Library:** Grid/List • click → opens Preview in same Drawer
- **Spotlight tokens:** `type:pdf ext:docx owner:@alice label:#q3`
- **Onboarding overlay:** guides steps → create task → attach → preview → approve → search → toggle mode → offline demo

---

## 6) Phase Plan (Milestones standardized: **M0/M1/M2**, Stage 2/3)

### **M0 (Weeks 1–2) — Shell + Trello‑parity foundation**

- AppShell/Topbar/Sidebar (token‑driven) • Mode switcher scaffold • ResidencyBadge slot • PerfHud slot
- Board 60fps DnD (mouse+keyboard) • QuickAdd • Drawer inline edit
- SearchInput + ⌘K skeleton; Library stub route with preview slot
  **DoD:** p95 <200ms @10k; 60fps DnD; tab order + ARIA complete; zero console errors
  **Tests:** Unit TaskCard/QuickAdd/Drawer a11y • E2E board smoke, create card, DnD, open Drawer

### **M1 (Weeks 3–4) — Task depth + File intelligence**

- QuickAdd grammar (@, #, !, ^)
- File Library grid/list; PreviewPane in Drawer (image/pdf/video)
- Local PDF/Doc extraction; Spotlight token feedback
- **Unified ApprovalBanner v1** shared by Task + Asset
  **DoD:** Preview <120ms; search p95 <200ms; approval shared and consistent
  **Tests:** Unit ApprovalBanner/AssetCard/PreviewPane • E2E ZCS proof & content match

### **M2 (Weeks 5–6) — Sovereignty & Offline proof**

- BYOS selector + Residency badge popover; `.sparkpack` export/import (≥99% fidelity)
- Ed25519 signature chip in Activity; Offline toggle + queue pill + conflict card stub
  **DoD:** Provider switch retains relations; export/import fidelity; offline merge demo
  **Tests:** Unit CSVMapping/ResidencyBadge • E2E provider switch, import/export fidelity, offline conflict

### **Stage 2 (Weeks 7–12) — Team collaboration**

- Presence; flow chips; WIP limits; dependency mini‑map; shared views & briefs
- Approvals v2 (sequential/parallel/quorum), read‑only policy view
  **DoD:** presence <300ms; approvals activity unified; briefs printable

### **Stage 3 (Weeks 13–18) — Organization**

- SSO/SCIM surfaces; policy inheritance (explainable), audit excellence, export compliance bundle
  **DoD:** org policy reads; audit chain visible

---

## 7) Testing SSOT — **Complete** Selectors, E2E, Budgets

### 7.1 Canonical Selectors (do not rename without updating SSOT)

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
  // Perf & Offline
  perfHud: 'perf-hud',
  offlineToggle: 'offline-toggle',
};
```

### 7.2 E2E Templates (Playwright)

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

### 7.3 Performance Budgets (clarified @10k items)

- `drawer_tti < 120ms` • `search_p95 < 200ms @10k` • `drag_drop 60fps` • `file_preview < 120ms` • `approval_flow < 100ms` • `offline_sync < 2s`.

---

## 8) WIREFRAMES (ASCII — comprehensive, do not remove)

### 8.1 Topbar + Sidebar + Board (M0)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [⌘K Search] [Project Alpha]      [Mode: Individual ▾] [Residency •] [●]     │
├───────────────┬────────────────────────────────────────────────────────────┤
│ Sidebar       │  Board (Kanban)                                            │
│ • Board       │  ┌────────────┬────────────┬────────────┐                  │
│ • Library     │  │ To Do      │ In Progress│ Done       │                  │
│ • Settings    │  │ [+] card…  │ [+] card…  │ [+] card…  │                  │
│               │  │ [Card ▣]   │ [Card ▣]   │ [Card ▣]   │                  │
│               │  └────────────┴────────────┴────────────┘                  │
└───────────────┴────────────────────────────────────────────────────────────┘
```

### 8.2 Task Drawer (M0→M1)

```
┌──────────────────────────────── Task Drawer ────────────────────────────────┐
│ Title [InlineEdit]   [Chip: Priority][Chip: Labels][Chip: Due]              │
│ Files: [Upload] [Preview inline ▸]                                          │
│ [Approval Banner ✔]   (shown in Team/Org)                                   │
│ Activity: signed by Bob • witness verified                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 File Library (M1)

```
┌────────────────────────────── Library ─────────────────────────────────────┐
│ [Grid|List]  [type:pdf ext:docx owner:@alice]  [Upload]  [Residency •]     │
│ ┌────┬────┬────┬────┬────┬────┐                                           │
│ │📄  │🖼  │🎞  │PDF │IMG │MP4 │  …                                         │
│ └────┴────┴────┴────┴────┴────┘  → click opens Preview in same Drawer     │
└────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Approvals Banner (M1→M2)

```
[Unified Approval (cryptographically verified)]
[Approve] [Request changes]   Activity: signed by Bob • witness verified ✔
```

### 8.5 Mode Switcher (Topbar)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [Search ⌘K]                [Mode: Individual ▾] [Residency •] [Perf 🟢] [●] │
└────────────────────────────────────────────────────────────────────────────┘
```

### 8.6 CSV Import (smart mapping)

```
┌ CSV Import ────────────────────────────────────────────────────────────────┐
│ [Upload CSV]  [Template ▾]  [Help]                                         │
│ Map columns:  [Title ▾] ← task_title   [Label ▾] ← tags   [Due ▾] ← due_at │
│ Preview: ▸  20 rows                                                         │
│ [Back]                         [Validate] [Import →]                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.7 Offline Conflict Resolver

```
┌ Conflict Detected ─────────────────────────────────────────────────────────┐
│ Local: “Update contract terms v3”    Remote: “Update contract terms v2”    │
│ [Keep Local]  [Keep Remote]  [Merge]  Activity: signed by Bob • verified ✔ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.8 BYOS Provider Selector

```
┌ Storage Provider ──────────────────────────────────────────────────────────┐
│ Current: Google Drive • Singapore  [Change ▾]                              │
│ Providers: Google Drive ▸  Dropbox ▸  OneDrive ▸  S3 ▸                     │
│ Residency: 🇸🇬  🇲🇾  🇺🇸   (read‑only until configured)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.9 Focus Session (⌘J)

```
┌ Focus Session ─────────────────────────────────────────────────────────────┐
│ [⏱ 25:00]  [Distractions off]  [Top 3 tasks today]                         │
│ 1) Write approval summary  2) Review contract  3) Prep import mapping       │
│ [End Session]  [Mark done]                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.10 Onboarding Overlay (First 5 Minutes)

```
Step 1: Create task  →  Step 2: Attach file  →  Step 3: Preview  →  Step 4: Approve
→  Step 5: Search content  →  Step 6: Switch to Org mode  →  Step 7: Offline demo
```

### 8.11 Perf HUD (Topbar)

```
[Perf HUD]  Search p95: 180ms  •  Preview: 95ms  •  FPS: 🟢
```

---

## 9) Micro‑Patch Plan (≤\~220 lines each)

1. **Tokens CSS vars:** `design/tokens.css` + Tailwind `theme.extend` mapping (no new deps).
2. **Mode SSOT & Gate:** `src/config/modes.ts` + `ModeGate.tsx` wrapper.
3. **Topbar slots:** mount Mode switcher + ResidencyBadge + PerfHud (token‑only).
4. **Drawer polish:** Files above fold; ApprovalBanner slot; focus trap; no console errors.
5. **Library preview:** click‑through opens Preview in Drawer (lazy import).
6. **Onboarding overlay:** minimal 5‑minute script; dismiss on interaction; keyboard‑friendly.
7. **Offline demo toggle:** demo‑only; queue pill; conflict card stub.
8. **Selectors SSOT:** add/verify `tests/ssot/selectors.ts`; add unit test guarding IDs.
9. **E2E proofs:** ZCS, modes visibility, sovereignty switch, offline conflict.

---

## 10) Governance & Success Metrics

- **Change control:** micro‑patch discipline; if scope exceeds bounds → **ONE** question, then stop.
- **Audit:** log mode changes (who/when) & sovereignty actions (provider view/export) — read‑only in this phase.
- **No bloat:** hidden features lazy‑loaded and tree‑shaken; budgets enforced.
- **Exec scoreboard:** wow‑index ≥9.0; ZCS flows >95%; approval reuse 100%; p95 <200ms; preview <120ms; DnD 60fps; `.sparkpack` fidelity ≥99%.
