# ✅ V5ext2 Adoption — Launch Checklist & Micro‑Patch Queue

This is your **actionable playbook** to roll out **GPT Dev Plan v5ext2**. It turns the doc into day‑one tasks, guardrails, and acceptance checks — all drift‑safe and vibe‑coding ready.

---

## 0) Pre‑Flight (Do these first)

- **Freeze SSOT files**: link the following in your PR template sidebar for quick access:
  - `docs/plans/gpt-dev-plan-v5ext2.md`
  - `tests/ssot/selectors.ts` (canonical)
  - `src/config/modes.ts` (FEATURE_MATRIX)
  - `design/tokens.ts` (+ `design/tokens.css` once added)

- **CI gates** (no code changes): reviewers must reject if a PR:
  - lacks unified diff only patches, or tries to add deps/lockfile changes
  - touches CI/security/billing, or adds hardcoded Tailwind classes
  - changes public APIs/flags/error codes/schema/budgets

- **Dataset scale**: benchmarks and E2E must run at **10k items** baseline.

---

## 1) Micro‑Patch Queue (≤\~220 lines each)

Each task uses the **Universal Anti‑Drift header**. Output: **unified git diff only**.

### Patch 1 — Tokens → CSS Vars (Figma‑feel bridge)

**Goal:** Create `design/tokens.css` root vars and wire to Tailwind `theme.extend`.
**Allowed:** `design/tokens.ts`, `design/tokens.css`, `tailwind.config.*`
**Forbidden:** new deps, hardcoded hexes outside tokens/vars
**DoD:** app builds; touched files lint‑clean; base pages render identical visuals

### Patch 2 — Modes SSOT & ModeGate

**Goal:** Add `src/config/modes.ts` + `components/features/ModeGate.tsx`; mount no surfaces yet.
**Allowed:** `src/config/modes.ts`, `src/components/features/ModeGate.tsx`, `tests/**`
**DoD:** unit test renders children only when flag on; no bundle bloat

### Patch 3 — Topbar Slots (Mode switcher + ResidencyBadge + PerfHud)

**Goal:** Mount read‑only Mode switcher, Residency badge (gated by `byos`), Perf HUD placeholder.
**Allowed:** `src/components/layout/AppShell.tsx`, `src/components/features/*`, `tests/**`
**DoD:** a11y labels present; selectors exposed; zero console errors

### Patch 4 — Drawer Polish (Files above fold + Approval slot + Focus trap)

**Goal:** Place file upload/preview above fold; add ApprovalBanner slot behind `approvals` gate; enforce focus trap.
**Allowed:** `modules/tasks/TaskDrawer*`, `modules/shared/ApprovalBanner*`, `tests/**`
**DoD:** drawer TTI <120ms; a11y passes; unit test covers approve button

### Patch 5 — Library → Drawer Preview

**Goal:** Grid/List Library; clicking an asset opens Preview in the same Drawer.
**Allowed:** `modules/files/*`, `app/(routes)/library/*`, `tests/**`
**DoD:** E2E proves zero context switch; preview visible in <120ms

### Patch 6 — Onboarding Overlay (First 5 Minutes Script)

**Goal:** Minimal overlay guiding: create task → attach → preview → approve → search → switch mode.
**Allowed:** `components/features/OnboardingOverlay*`, `AppShell`, `tests/**`
**DoD:** keyboard accessible; dismiss on interaction; E2E walkthrough passes

### Patch 7 — Offline Demo Toggle (visual only)

**Goal:** Add an offline toggle chip (demo workspace), queue pill, conflict card stub.
**Allowed:** `components/features/*`, `modules/*`, `tests/**`
**DoD:** no network hooks; visuals only; E2E asserts visibility and messaging

### Patch 8 — Selectors SSOT Guard

**Goal:** Ensure all `data-testid` usages match `tests/ssot/selectors.ts`; add a tiny unit test that fails on drift.
**Allowed:** `tests/ssot/*`, tiny helper script
**DoD:** CI fails if unknown testid appears

### Patch 9 — E2E Proofs (ZCS, Modes, Sovereignty)

**Goal:** Add Playwright specs from v5ext2 doc.
**Allowed:** `tests/e2e/*`
**DoD:** ZCS flow <2s; Individual hides approvals/BYOS; Org shows them

---

## 2) Reviewer Checklist (paste into PR template)

- [ ] Patch ≤\~220 diff lines, unified diff only
- [ ] Paths are allowed; no deps/lockfile churn; no CI/security/billing edits
- [ ] Tokens‑only styling; no hardcoded Tailwind classes
- [ ] `data-testid` keys imported from `tests/ssot/selectors.ts`
- [ ] a11y validated (focus/ARIA/keyboard)
- [ ] Performance budgets respected (drawer <120ms; search p95 <200ms @10k)

---

## 3) "First 5 Minutes" QA Script (manual / E2E parity)

1. Create task on **Board** → open **Drawer**.
2. Upload file → inline **Preview** appears (<120ms).
3. **Approve** via banner (Team/Org).
4. Spotlight search `type:pdf contract` → see **content match**.
5. Switch **Individual → Org** → ResidencyBadge & BYOS appear.
6. Toggle **Offline (demo)** → queue pill visible; conflict stub on reconnect.

---

## 4) Success Scoreboard (exec‑visible)

- Wow‑index ≥9.0 • ZCS workflows >95% • Approval reuse 100% • Residency visible 100%
- p95 <200ms @10k • Preview <120ms • DnD 60fps • `.sparkpack` fidelity ≥99%

---

## 5) Risk Watch & Mitigations

- **Hidden feature cost**: lazy‑load gated surfaces; check bundle diff.
- **Selector drift**: Patch 8 guard; reviewers grep for non‑SSOT IDs.
- **M0 perf regressions**: keep perf HUD visible; fail PR if thresholds missed.

---

## 6) Communication Snippet (paste into team channel)

> Launching **v5ext2**. We’ll ship in ≤220‑line micro‑patches with tokens‑only styling, Modes gating, and full ZCS E2Es. Reviewers: use the checklist, and block any PR that changes deps/CI/security or introduces non‑SSOT `data-testid`s. The first five patches land the Figma‑feel bridge, ModeGate, Topbar slots, and Drawer polish.
