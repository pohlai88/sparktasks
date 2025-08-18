# SparkTasks — PRD (v1.0, 2025-08-15)

## 4W1H (at a glance)
**Who:** Makers & small teams (5–50 seats) on Google Drive/OneDrive; cost-conscious SMBs and teams needing portability (GDPR).  
**What:** Storage‑neutral, local‑first task hub with minimal core (Today, Snooze, Now/Later/Done, quick‑add), **BYOS** (Drive/Dropbox/S3) and open, schema‑versioned bundles.  
**Why:** Reduce TCO, eliminate lock‑in, cut coordination drag (work‑about‑work), support offline/conflict‑safe collaboration.  
**When:** MVP 60d → Team Pack 90d → Trust Pack 120–180d.  
**How:** PWA + local index; Drive adapter; `.sparkpack` export/import; event‑sourced insights; E2EE; CRDT for notes.

## Problem Statements
1) Paying twice for storage in PM tools despite existing 2TB+ consumer/business plans.  
2) Lock‑in and lossy exports; need for real round‑trip portability.  
3) Coordination overhead (status chasing, meetings); need explainable focus.  
4) Offline/low‑connectivity teams lack safe merges and conflict UX.

## Product Principles
- **Calm core** (flags for optional power, lazy‑loaded, additive only)  
- **Data freedom** (your storage, human‑readable files, exit at any time)  
- **Explainability** (metrics & automations show their “Why?”)  
- **Fast by contract** (CI‑enforced budgets)  

## Market Wedge (distilled)
- **BYOS storage:** Run on users’ Drive/Dropbox; no storage upsell.  
- **Work‑about‑work reduction:** Today + Snooze + Now/Later/Done.  
- **True portability:** Schema‑versioned export/import with dry‑run diffs; user‑owned `events.jsonl`.  
- **Offline‑first collab:** Local‑first PWA + CRDT notes; simple conflict banner.  
- **Accountable automation:** Small, auditable nudges (aging‑WIP, unblock summaries).  
- **CFO‑friendly TCO:** Seat pricing for governance/automation, never bytes.

## Scope — Core (MVP, 60 days)
### User Stories
- Quick‑add tasks (NLP) with parsed due/assignee/priority.  
- Focus on **Today**; **Snooze** the rest (keyboard first).  
- Use **Google Drive** as source of truth; attachments in your folder.  
- Export/import `.sparkpack` with **dry‑run** diffs and rollback.
### Functional Requirements
- Views: Today | Later | Done; list & board.  
- BYOS: Google Drive adapter (App Folder or chosen folder) with delta polling & backoff.  
- Open bundle per project: `tasks.jsonl` (append‑only), `events.jsonl`, `/files/*`, optional `index.sqlite`.  
- Local FTS index (p95 <200 ms @1k tasks; rebuild from JSONL if corrupt).  
- Insights v1: Throughput, Cycle Time, Aging WIP with “Why?” drill‑downs.  
- Slack digest: daily/weekly, actionable buttons (complete/snooze/reassign).
### Non‑Functional Requirements
- **Performance:** p95 search/filter <200 ms @1k; 60 fps lists @10k; core bundle <250 KB gz (flags off).  
- **Security:** E2EE (user‑held keys); import validation; cross‑workspace isolation.  
- **Reliability:** Round‑trip success ≥99% on public corpus; notification dedupe ≥90%.  
- **A11y:** semantic HTML; focus‑visible; focus‑trapped dialogs; escape‑to‑close.
### Acceptance Tests
- Import fixture → dry‑run diffs → commit → 1:1 parity.  
- Airplane‑mode edits on two devices → CRDT merges notes; conflict banner for clashing scalars; no data loss.  
- Drive throttle sim → adapter backs off; no corruption.
### Out of Scope (v1)
- Heavy Gantt/portfolio/OKRs; advanced automation studio; SCIM/SAML/DLP.

## Eisenhower Matrix (drives scope)
| Quadrant | **Do now (MVP)** | **Plan next (Team Pack)** | **Delegate/Integrate** | **Defer** |
|---|---|---|---|---|
| Urgent & Important | Today/Snooze/Now‑Later‑Done; Quick‑add; **Drive BYOS**; Export/Import dry‑run; Local FTS; Insights v1 | Comments/@mentions; Actionable notifications; Conflict UX; GitHub/Calendar; basic rate‑limits & audit log | Slack digest; VS Code quick‑add; Browser share | Gantt/Portfolio; OKRs; copilot authoring |
| Not Urgent & Important | E2EE v1; CI perf budgets | OIDC SSO; retention policies (written to user storage); OneDrive/Dropbox adapters | Webhooks + typed SDK | SCIM/SAML; org DLP |

## KPIs & Gates
- **Activation:** TTFT <60s; import→active ≥50%  
- **BYOS:** ≥60% new workspaces choose external storage  
- **Portability:** Round‑trip ≥99%  
- **Engagement:** D7 ≥35%; ≥50% tasks via quick‑add  
- **Perf:** p95 search <200 ms; bundle <250 KB  
**Kill criteria:** If BYOS adoption <20% or round‑trip <95% in pilots → pause expansion and fix portability; if D7 <35% with Today+Snooze → fix core before new modules.

## Ownership
- Product: scope, KPIs, release gates  
- Frontend: PWA, quick‑add, views, CRDT/conflict UX, local index  
- Backend/Platform: Drive adapter, export/import, CI budgets, notifications  
- Security: E2EE, import validation, workspace isolation  
- Data/Insights: metrics, explainability, digest scoring
