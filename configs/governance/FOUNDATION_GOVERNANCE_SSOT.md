# FOUNDATION GOVERNANCE — Single Source of Truth (SSOT) v1.0

Note: Moved to `configs/governance/FOUNDATION_GOVERNANCE_SSOT.md` 

Date: 2025-01-27  
Applies to: SparkTasks v7.x Single-Repo  
Owner: Architecture Lead (Wee)  
Status: Approved (Governs UI foundation: Tailwind, CSS vars, tokens, primitives)  

---

## 0) Purpose & Non‑Negotiables

This governance defines the single, end‑to‑end SSOT for the UI foundation:

Tailwind config (names) → index.css (values) → enhanced‑tokens (helpers) → primitives (4 only).

Non‑Negotiables

- No second source of truth: all names in Tailwind, all values in index.css.  
- Tokens are lean: helpers return classes; no values, no registries.  
- Primitive set is fixed: Slot, AccessibleIcon, VisuallyHidden, DirectionProvider.  
- No inline numeric design utilities in JSX (z-[...], opacity-[...], etc.).  
- No @tailwind directives outside src/index.css.  
- No TS imports in tailwind.config.js.

---

## 1) Truth Layers (authoritative)

1) Tailwind config (origin of names & scales)
- Maps colors to CSS vars, defines named zIndex: surface|overlay|popover|modal|toast|tooltip.  
- Declares keyframes/animations and safelist patterns.  
- Never imports TS; never contains duplicated token maps.

2) index.css (concrete values)
- Defines all raw RGB variables and semantic aliases:  
  `--background, --foreground, --background-panel, --background-elevated, --foreground-muted, --foreground-subtle, --border, --border-strong, --border-accent, --input, --primary, --primary-hover`  
- Named z‑index values mirror Tailwind: 0,100,1100,1300,1400,1500.  
- Contains `@tailwind base; @tailwind components; @tailwind utilities;` at the top.

3) enhanced‑tokens.ts (helpers only)
- Class‑returning helpers, no values:  
  `getZIndexClass('surface'|'overlay'|'popover'|'modal'|'toast'|'tooltip')`  
  `getMotionPattern(...)`, `getComponentMotion(...)`, `getMotionPreset(...)`  
  `getReducedMotionVariant()` → `motion-safe` | `motion-reduce`

4) React primitives (foundation layer)
- Slot, AccessibleIcon, VisuallyHidden, DirectionProvider.  
- No global polymorphic factory, no motion/z‑index registries.

---

## 2) Allowed APIs

- Z‑index: `className={getZIndexClass('modal')}` → emits `z-modal`  
- Motion: `className={getMotionPattern('fadeInStandard')}` or `getMotionPreset('colors')`  
- Reduced motion: `${getReducedMotionVariant()}:${getMotionPreset('dialogEnter')}`

---

## 3) Prohibited Patterns

- Bracketed numeric utilities for design constants in JSX:  
  `z-[1300]`, `opacity-[0.03]`, `translate-[...]`, `scale-[...]`, `rotate-[...]`  
- Numeric design values in style props: `style={{ zIndex: 1300 }}`  
- Second source of truth: TS/JS maps duplicating Tailwind or CSS variables  
- `@tailwind` outside `src/index.css`  
- TS imports inside `tailwind.config.js`

---

## 4) Change Control & Versioning

- Add a z‑index layer or motion key → minor bump.  
- Rename/remove a layer/key → major bump.  
- A change must modify Tailwind names and index.css values in the same PR.

---

## 5) Drift Audits (CLI‑first)

Run as CI steps or locally:

```bash
# No bracketed numeric utilities for design constants in JSX
rg -n 'className=.*\b(z|opacity|translate|scale|rotate)-\[' src && exit 1 || echo "OK"

# No inline @media in TS/TSX; media belongs in CSS
rg -n '@media' src --glob '!**/*.css' && exit 1 || echo "OK"

# Tailwind config must not import TS
rg -n "from '.*'" tailwind.config.* && exit 1 || echo "OK"

# Only index.css contains @tailwind directives (should output 1)
rg -n '@tailwind (base|components|utilities)' --hidden | wc -l
```

---

## 6) Minimal A11y & Polymorphic Rules

- Decorative icons: `aria-hidden="true"` (do not wrap).  
- Status/spinner: `role="status"` + `VisuallyHidden` announcement.  
- `asChild` only where valuable; add small inline polymorphic typing per component.  
- Only `<button>` receives `type`. Do not pass `type` when `asChild` renders non‑button.

---

## 7) Integration With UI App Shell SSOT

- The App Shell SSOT governs component contracts.  
- This foundation SSOT governs the underlying names, values, helpers, and primitives.  
- App Shell examples should reference token helpers (not legacy registries).

---

## 8) Definition of Done (Foundation)

- Tailwind names and index.css values updated together.  
- Helpers expose only classes; no values or registries.  
- 4 primitives are the only foundation React utilities.  
- Drift audits pass.  
- App Shell SSOT examples use `getZIndexClass` and motion helpers.

---

## 9) Optional Dev‑Only Guards (not required)

If desired later, add `src/design/ssot-guards.ts` to emit dev warnings (no production cost).  
This does not replace the SSOT or audits and should not duplicate token data.

---

## 10) Advanced Features — Governance Map

- Advanced Component Architecture Patterns
  - Governed primarily by: `configs/governance/UI_ENHANCED_APP_SHELL_SSOT.md` (Component Contract, Development Pattern, Forbidden)
  - Foundation rules referenced here: 0) Non‑Negotiables (tokens‑only, 4 primitives), 1) Truth Layers (names→values→helpers→primitives)

- Advanced State Management Integration
  - Intentional scope: App‑level (App Shell). Not defined in Foundation to avoid a second source of truth
  - Governed by: UI App Shell SSOT (validation schemas, component contracts)
  - Foundation constraint: No stores/contexts inside primitives; primitives remain stateless utilities

- Advanced Performance Optimization
  - Targets and checks: UI App Shell SSOT (Performance Requirements, Testing Contract)
  - Foundation support: tokens‑only styling (no bracketed numeric design utilities), PostCSS/Tailwind pipeline, CLI drift audits (Section 5)

- Advanced Accessibility Features
  - Foundation coverage: 6) Minimal A11y & Polymorphic Rules; motion a11y tokens via `foundation.motionAccessibility.*`; use `getReducedMotionVariant()`
  - UI App Shell adds component‑level a11y contracts (labels, roles, focus management)

- Advanced Animation System
  - Defined in tokens: `foundation.motionComponents`, `motionPatterns`, `motionTransition`, `motionAccessibility`; helpers `getMotionPattern`, `getComponentMotion`, `getMotionPreset`
  - Tailwind keyframes/animations: `tailwind.config.js`
  - Usage contracts/examples: UI App Shell SSOT

---

## 11) Advanced Features Refactor Kit (ready-to-use)

Use this kit to refactor any App Shell (or feature area) consistently. It references only the Foundation SSOT and tokens.

1) Advanced Component Architecture Patterns
- Checklist:
  - [ ] Tokens-only styling (no bracketed numeric utilities)
  - [ ] 4 primitives only; no global polymorphic factory
  - [ ] Inline asChild with `Slot` only when valuable
  - [ ] CVA variants defined from `ENHANCED_DESIGN_TOKENS`
- CLI audit:
```bash
rg -n "\b(translate|scale|rotate|opacity)-\[" src/components && exit 1 || echo OK
```

2) Advanced State Management Integration
- Rule: App-level state only. Primitives/tokens never create stores/contexts.
- Checklist:
  - [ ] State lives in feature/app providers
  - [ ] Components accept props; do not read global state directly

3) Advanced Performance Optimization
- Targets (enforced in App Shell tests): <200ms render, <100ms updates
- Checklist:
  - [ ] Code-split heavy features
  - [ ] Avoid inline lambdas in hot paths, memoize expensive trees
  - [ ] Prefer tokens/utility classes over runtime style objects
- CLI audit (bundle hints placeholder): integrate into CI as needed

4) Advanced Accessibility Features
- Foundation:
  - `AccessibleIcon`, `VisuallyHidden`, `DirectionProvider`
  - Motion a11y: `foundation.motionAccessibility.*`, `getReducedMotionVariant()`
- Checklist:
  - [ ] Use `VisuallyHidden` for announcements
  - [ ] Respect reduced motion in bases
  - [ ] Proper roles/labels per App Shell contract

5) Advanced Animation System
- Tokens:
  - `foundation.motionComponents`, `motionPatterns`, `motionTransition`, `motionAccessibility`
  - Helpers: `getMotionPattern`, `getComponentMotion`, `getMotionPreset`, `getReducedMotionVariant()`
- Checklist:
  - [ ] No raw `@media` in TSX; use variant helpers/tokens
  - [ ] No hardcoded durations/easings in components
- CLI audit:
```bash
rg -n "@media" src --glob '!**/*.css' && exit 1 || echo OK
```

Debugging shortcuts
- Z-index: use `getZIndexClass('<layer>')` and verify via DOM inspector
- Motion: temporarily swap `getReducedMotionVariant()` return to validate variant paths

Standardization knobs (single-point tweaks)
- Focus ring: `ENHANCED_DESIGN_TOKENS.foundation.focus.ringPrimary`
- Active scaling: `ENHANCED_DESIGN_TOKENS.foundation.transform.scale['98']` (replaces `scale-[0.98]`)

---

## 12) Category Baselines & Profiles (standardize usage)

Use these minimal, reusable baselines to keep same-category components consistent. They reference existing tokens/recipes only.

Button (interactive control)
- Base: `recipes.motion.button.base`, `foundation.typography.button`
- Hover: `recipes.motion.button.hover`
- Active: `recipes.motion.button.active` (uses `scale-95`), or use `foundation.transform.scale['98']` if needed
- Focus: `foundation.focus.ringPrimary`
- Color: `recipes.color.interactive.primary|secondary|ghost|outline`

Card (surface/panel)
- Base: `recipes.layout.card.base`
- Hover/Interactive: `recipes.layout.card.hover|interactive`
- Glass (when needed): `recipes.layout.card.glass`
- Elevation: `foundation.elevation.(md|lg)`

Dialog / Overlay (modal layer)
- Overlay: `recipes.motion.modal.overlay`
- Content enter/exit: `recipes.motion.modal.enter|exit`
- Z-index: `getZIndexClass('modal')`
- Focus: `foundation.focus.ringPrimary`

Tooltip / Popover (floating content)
- Motion: `recipes.motion.tooltip.enter|exit`
- Z-index: `getZIndexClass('tooltip'|'popover')`

Inputs (field controls)
- Motion: `foundation.motionComponents.formFieldFocus|formFieldBlur`
- Colors: `foundation.color.surface.panel`, `foundation.color.content.primary`
- Spacing: `foundation.layout.padding['6'|'8']`, radius via `foundation.layout.border.radius.(md|lg)`

Drift checks (category)
```bash
# Buttons should include either focus ring token or pattern
rg -n "EnhancedButton|Button" src/components | rg -n "focus-visible:|ring-" || echo "OK (verify with foundation.focus.ringPrimary)"

# Dialogs should use modal z-index layer
rg -n "DialogContent|EnhancedDialog" src/components | rg -n "z-modal" || echo "OK (verify with getZIndexClass('modal'))"

# Cards should prefer recipes.layout.card.* (base/interactive/glass)
rg -n "EnhancedCard" src/components | rg -n "card\.(base|interactive|glass)" || echo "OK (verify usage)"
```

Rationale
- These baselines eliminate per-component re-invention.
- They keep composition consistent without adding new factories or stores.
- All classes remain token/recipe-driven; no new sources of truth.

---

This document supersedes token‑only governance and serves as the single governance reference for the UI foundation.


