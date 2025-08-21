# 🧠 SparkTasks — Augmented Meta-Prompt (v1.0.1, 2025-08-15 — date format YYYY-MM-DD)

> A single, always-on reference that aligns **product, design, engineering, QA, and GTM** with Spark’s market wedge, KPIs, and acceptance gates. Optimized for human + AI agent use.

---

## 0) How to use this (quick start)

- Paste the **Short System Prompt** into your AI tool (or project wiki header).
- For any artifact (ticket, design brief, code task, copy), start from the **Artifact Prompt Templates**.
- Always fill the **Wedge/KPI tags** and **Exit Criteria** fields; they keep us honest.
- PRs and releases must include the **Definition of Done** & **Acceptance Test IDs**.
- **SSOT:** keep this file tethered to the latest strategic context via **[docs/SSOT.md]** (central contracts: wedge, KPIs, flags, events, error codes).

---

## 1) Short System Prompt (for AI tools / agent headers)

You are building **SparkTasks**, a **storage-neutral, local-first** task platform. Prioritize:

1. **BYOS** (Drive/Dropbox/S3) with open, schema-versioned bundles (`tasks.jsonl`, `events.jsonl`, `/files`, `index.sqlite`) and `.sparkpack` round-trip with dry-run diffs.
2. **Work-about-work reduction** via **Today + Snooze + Now/Later/Done** and quick-add grammar.
3. **True portability** and explainability; weekly export→import **restore drill** must pass.
4. **Offline-first + conflict-safe** collaboration: CRDT for notes/comments; conflict banner for scalar fields.
5. **Accountable automations**: Aging WIP, Unblock summaries, SLA heads-up with a visible “Why?” link to events; dedupe windows; actionable buttons.
6. **CFO-friendly TCO**: We **never** resell storage. Seat pricing monetizes governance/automation, not bytes.
   Enforce **performance budgets** (search p95 < 200 ms @ 1k; 60 fps lists @ 10k; core bundle < 250 KB gz) and **security** (E2EE with user-held keys; import validation; cross-workspace isolation). Reject scope that doesn’t move a wedge-tied KPI.

---

## 2) 4W1H (Anchor)

**Who:** Makers & SMB teams (5–50 seats), ops/field teams; Drive/OneDrive users; portability-aware buyers.  
**What:** Storage-neutral, local-first task hub with BYOS and open bundles; explainable insights and light team/trust controls.  
**Why:** Cut TCO + lock-in, reduce coordination drag, enable offline/conflict-safe collaboration, meet portability/audit expectations.  
**When:** MVP 0–60d → Team Pack 60–90d → Trust Pack 90–180d.  
**How:** PWA + local index; Drive adapter; `.sparkpack` import/export; event-sourced insights; E2EE; CRDT notes.

---

## 3) Market Wedge → KPI Map (build only what moves KPIs)

| Gap                       | Spark Move                                            | KPI(s)                                          | Build Focus                            |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| 1️⃣ Storage-neutral (BYOS) | Drive/Dropbox adapters; zero-GB pricing; open bundles | BYOS ≥60% of new workspaces; import→active ≥50% | Adapters, bundle schema, import/export |
| 2️⃣ Work-about-work killer | Today+Snooze+Now/Later/Done; quick-add grammar        | D7 ≥35%; ≥50% tasks via quick-add               | Focus views, NLP parser, digest UX     |
| 3️⃣ True portability       | Schema-versioned export/import; dry-run diffs         | Round-trip ≥99%                                 | Validation, diffs, rollback            |
| 4️⃣ Offline + safe merges  | Local PWA + CRDT; conflict banner                     | Merge success ≥97%                              | CRDT integration, conflict UI          |
| 5️⃣ Accountable automation | Auditable nudges with “Why?”                          | Action ≥40%; FP <5%                             | Rules engine, events inspector         |
| 6️⃣ CFO-friendly TCO       | Seat-only pricing; publish TCO                        | Win-rate on TCO; % deals citing TCO             | Calculator, docs, no storage billing   |

> **Wedge Glossary is frozen** below so numbers remain stable across documents.

---

## 4) Acceptance Tests (IDs referenced in tickets/PRs)

- **AT-001 Portability Round-Trip** — Import fixture → dry-run diffs → commit → 1:1 parity across schemaVersion. _(Traceability: PRD §Scope—MVP; Strategy Annex §Portability)_
- **AT-002 Offline Merge** — Dual-device, airplane-mode edits → CRDT merges notes; scalars show conflict banner; no loss. _(Traceability: PRD §Non-Functional—Reliability; Strategy Annex §Offline-first)_
- **AT-003 Drive Throttle** — Simulate quota/throttle → adapter exponential backoff; no corruption; user-visible sync state. _(Traceability: PRD §Acceptance Tests; Strategy Annex §BYOS)_
- **AT-004 Perf Budgets** — p95 search < 200 ms @ 1k; 60 fps list @ 10k; core bundle < 250 KB gz (flags off). _(Traceability: PRD §Performance Budgets)_
- **AT-005 Automation Explainability** — Each alert exposes “Why?” linking to events subset; dedupe ≥ 90%; FP < 5%. _(Traceability: PRD §Insights/Automations; Strategy Annex §Accountable automation)_
- **AT-006 Security Essentials** — E2EE enabled; import payload validation; cross-workspace reference prevention. _(Traceability: PRD §Security; Strategy Annex §Governance)_
- **AT-007 Insights Explainability** — Throughput/Cycle/Aging cards link back to event queries powering them. _(Traceability: PRD §Insights; Strategy Annex §Explainability)_
- **AT-008 BYOS Health** — BYOS setup wizard completes; health indicator green; error recovery path verified. _(Traceability: PRD §Scope—MVP; Strategy Annex §BYOS)_

---

## 5) Anti-Goals & Guardrails (block bloat/drift)

- ❌ No storage upsell; do not persist task content server-side in BYOS mode.
- ❌ No heavy roadmaps/Gantt/portfolio/OKR in v1–v2 (unless wedge gates met + board approval).
- ❌ No black-box AI. Every automation must be explainable with event provenance.
- ✅ **Additive-only flags**, off by default; each feature must be <10 KB gz or lazy-loaded.
- ✅ Monthly **portability drill** is a release gate. Failing drill blocks release.

---

## 6) Definition of Done (DoD) **and** Reviewer Rubric (1:1 mapping)

1. **Wedge/KPI/AT tags present** — _Reviewer:_ gaps/KPIs/AT-IDs clearly stated? Non-wedge scope cut or justified?
2. **Perf & a11y budgets pass CI** — _Reviewer:_ any bundle regressions? Lighthouse/a11y checks green?
3. **Telemetry minimal & private** — _Reviewer:_ timings/counts only, no content? Opt-in respected?
4. **Docs updated** — _Reviewer:_ bundle schema notes, user help, TCO docs updated as needed?
5. **Security review passed** — _Reviewer:_ E2EE impact, import validation, cross-workspace isolation, rate-limits documented and tested?

> Use this as a literal checklist in PRs for fast approvals.

---

## 7) Artifact Prompt Templates (fill-in blocks)

### 7.1 User Story / Ticket

**Title:** [Verb][Object] — [Scope]  
**Wedge Gap(s):** [1-6]  
**KPI(s):** [from map]  
**Acceptance Tests:** [AT-###]  
**Summary:**  
**Requirements:** (functional + non-functional)  
**Exit Criteria:** (perf, security, a11y)  
**Out of Scope:**  
**Risks & Mitigations:**  
**Notes:** link to PRD section & Strategy Annex

**Prompt:**  
"""
Create a user story for SparkTasks that targets gap(s) [{gaps}] to move KPI(s) [{kpis}]. Implement [{feature}] with constraints: [{constraints}]. Include acceptance tests [{ats}], performance budgets, and a11y. Output: Markdown ticket with DoD and risks.
"""

---

### 7.2 Design Brief

**Problem:**  
**Audience & Context:**  
**Wedge & KPI:**  
**Flows:** Today/Snooze/Quick-add interactions; conflict banner UX.  
**States:** empty, loading, success, error, offline.  
**A11y:** focus order, escape to close, visible focus, reduced motion.  
**Telemetry (opt-in):** timings & counts only.

**Prompt:**  
"""
Design a minimal, accessible UI for [{feature}] that reduces work-about-work and preserves BYOS portability. Show states (empty/loading/success/error/offline). Include rationale referencing wedge gaps [{gaps}] and KPIs [{kpis}].
"""

---

### 7.3 Engineering Spec

**Context:** link to ticket & PRD clause  
**Interfaces:** storage adapter / events bus / CRDT API  
**Data:** bundle fields, schemaVersion impact  
**Perf:** budgets + test plan  
**Security:** E2EE, validation, rate limits  
**Rollout:** flag name, defaults, migration notes

**Prompt:**  
"""
Write an engineering spec for [{feature}] in SparkTasks. Cover interfaces, schema changes, error handling, perf budgets, security, rollout flag, and acceptance tests [{ats}]. Output: concise Markdown spec.
"""

---

### 7.4 QA Test Plan

**Scope:** features, negative tests, recovery paths  
**Environments:** offline/online; throttled APIs  
**Automation:** Playwright/Vitest checklist  
**Pass/Fail:** tie to AT-IDs

**Prompt:**  
"""
Create a QA plan covering functional, negative, offline, throttle, and security tests for [{feature}], aligned to acceptance tests [{ats}] and perf budgets. Output: stepwise test matrix with expected results.
"""

---

### 7.5 Release Notes

**Audience:** admins, end-users  
**What changed:**  
**Why it matters:** link to wedge/KPI  
**Any action needed:** migration notes, flags  
**Restore path:** `.sparkpack` rollback

**Prompt:**  
"""
Draft release notes for [{feature}], framing value via wedge [{gaps}] and KPI impact [{kpis}]. Include any user action, flag toggles, and restore path.
"""

---

## 8) Competitive Differentiators (use in copy & reviews)

- **Only** native BYOS across Drive/Dropbox/S3.
- **Only** schema-versioned JSONL + `events.jsonl` with true round-trip.
- **Only** planned CRDT merge safety in this class.
- **CI-enforced** performance budgets; no storage upsell.

---

## 9) Example Filled-Out Ticket (sample)

**Title:** Enable `.sparkpack` dry-run diffs in import UI  
**Wedge Gap(s):** 1 (BYOS), 3 (Portability)  
**KPI(s):** BYOS adoption; Round-trip ≥99%  
**Acceptance Tests:** AT-001, AT-004, AT-006  
**Summary:** Add a dry-run step that shows changed/new/removed items before commit.  
**Requirements:** diff viewer, rollback button, schemaVersion guard, large files warning, Drive throttle handling.  
**Exit Criteria:** p95 diff calc < 150 ms @ 1k tasks; a11y complete; no server content store.  
**Risks:** user confusion → add stepper; Drive 429 → backoff.  
**Notes:** PRD §Scope—MVP; Strategy Annex §Portability.

---

## 10) Versioning & Wedge Glossary (frozen numbering)

**Versioning:** Update this file **only** when wedge/KPI/DoD change. Else, link to **docs/SSOT.md** for live strategy.

**Wedge Glossary (do not renumber):**

1. **Storage-neutral (BYOS):** Native Drive/Dropbox/S3 adapters; open bundles; zero-GB pricing.
2. **Work-about-work killer:** Today+Snooze+Now/Later/Done; quick-add grammar; explainable status/digests.
3. **True portability:** Schema-versioned export/import; dry-run diffs; weekly restore drill.
4. **Offline-first & safe merges:** PWA + CRDT notes/comments; conflict banner; background sync.
5. **Accountable automation:** Small auditable nudges (Aging WIP, Unblock, SLA) with visible “Why?”.
6. **CFO-friendly TCO:** Seat-only pricing; publish TCO; never bill for storage.

---

**End of Meta-Prompt v1.0.1**
