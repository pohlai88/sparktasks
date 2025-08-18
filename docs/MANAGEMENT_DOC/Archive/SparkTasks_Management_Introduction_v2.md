# SparkTasks — Management Introduction (v2)
## Advanced Features & 95% Confidence Plan (Exec + Tech)

> **Goal:** Win decisively on TCO, portability, and explainable speed. This v2 adds a clear **Must‑Have vs Good‑to‑Have** advanced feature set, success gates, and a quantified confidence model.

---

## 0) Confidence Statement
We model a **95% success likelihood** for the wedge (“storage‑neutral, local‑first tasking”) **if and only if** the following gates are met in pilots:
- **BYOS adoption ≥ 60%** of new workspaces; **round‑trip portability ≥ 99%** on corpus.
- **Engagement:** D7 ≥ 35%, ≥ 50% of tasks created via quick‑add; digest action rate ≥ 40%.
- **Performance:** p95 search < 200 ms @ 1k; 60 fps lists @ 10k; bundle < 250 KB gz (flags off).
- **Trust:** zero content stored server‑side in BYOS mode; audit events persisted to user storage; rate limits enabled.

If any single gate slips below the **kill criteria** included herein, pause feature expansion and remediate.

---

## 1) North Star (unchanged)
**Build the calmest, most portable task hub** that runs on storage customers already pay for, with explainable automations and CI‑enforced speed.

---

## 2) 4W1H (for management)
**Who:** Makers & small teams (5–50 seats), ops/field teams, and cost‑conscious SMBs already on Drive/OneDrive; teams requiring provable portability.

**What:** A minimal core (Today, Snooze, Now/Later/Done, quick‑add) plus **BYOS** bundles (JSONL + events + files) with local‑first sync, explainable insights, and a small but real **Team/Trust** surface.

**Why:** Slash TCO and lock‑in, reduce coordination drag, satisfy compliance (portability/audit) without enterprise bloat.

**When:** MVP 0–60d → Team Pack 60–90d → Trust Pack 90–180d.

**How:** PWA + adapters (Drive/Dropbox/OneDrive/S3), CRDT for notes, E2EE with user‑held keys, CI budgets, event‑sourced insights.

---

## 3) The Wedge (6 market gaps → product moves)
1) **Storage‑neutral tasking (BYOS)** → Run on Drive/Dropbox; **zero‑GB pricing**; `.sparkpack` export/import.  
2) **Work‑about‑work killer** → Today + Snooze + Now/Later/Done; quick‑add grammar; actionable digests with “Why?”.  
3) **True portability & auditability** → SchemaVersioned JSONL + events; dry‑run diffs; weekly “restore drill”.  
4) **Offline‑first & conflict‑safe** → CRDT notes/comments; field‑level conflict banner; background sync.  
5) **Accountable automations** → Aging WIP, Unblock summaries, SLA heads‑up with event‑based explainability.  
6) **CFO‑friendly TCO** → Monetize governance/automation seats, never storage.

---

## 4) Advanced Features — **Must‑Have** vs **Good‑to‑Have**
> Must‑Have = directly drives wedge KPIs in the first two quarters. Good‑to‑Have = accelerators once gates are passed.

### 4.1 Must‑Have (Win‑the‑Wedge)
1) **BYOS Suite v1**  
   • Google Drive adapter (App Folder / user‑chosen) with delta polling; retries/backoff; health indicators.  
   • Open bundle (`tasks.jsonl`, `events.jsonl`, `/files`, `index.sqlite`) + **`.sparkpack`** export/import with dry‑run diffs & rollback.  
   **KPI:** BYOS adoption ≥ 60%; round‑trip ≥ 99%.

2) **Accountable Automations v1**  
   • Aging WIP alerts; Unblock summaries; SLA‑breach heads‑up.  
   • Each alert includes **“Why?”** (linked events); dedupe window; action buttons (complete/snooze/reassign).  
   **KPI:** digest action rate ≥ 40%; false positives < 5%.

3) **Conflict‑Safe Offline Collab v1**  
   • CRDT for notes/comments; scalar fields with conflict banner; airplane‑mode edits; device cursors.  
   **KPI:** conflict‑resolution success rate > 97%; low merge tickets.

4) **Insights v1.1 (Explainable Flow)**  
   • Throughput, Cycle Time, Aging WIP by owner/project; event drill‑downs to show provenance.  
   **KPI:** weekly insights usage ≥ 50% of active teams.

5) **Team Controls (Light) v1**  
   • Comments/@mentions/watchers; actionable notifications; basic rate limits; export‑access log; audit events written to user storage.  
   **KPI:** spoofing incidents = 0; notification dedupe ≥ 90%.

6) **Integrations that cut coordination**  
   • Slack digests (buttons) • GitHub smart links (PR/issue state) • Calendar 2‑way due‑date sync/time‑blocking.  
   **KPI:** ↓ status‑chasing time; ↑ digest action; ↑ quick‑add share.

7) **Migration & Portability Toolkit**  
   • CSV/Trello/Asana importers; schema docs; **weekly CI “export→import”** corpus drill.  
   **KPI:** import→active ≥ 50%; drill pass rate = 100%.

8) **Security & Privacy Essentials**  
   • E2EE (user‑held passphrase); MIME checks; cross‑workspace isolation; abuse/rate limits; key recovery hints.  
   **KPI:** 0 content exfil in BYOS; 0 cross‑workspace leaks.

### 4.2 Good‑to‑Have (Accelerate & Defend)
1) **BYOS Suite v2** — OneDrive & Dropbox adapters; S3 adapter for tech teams; data‑location selector UI.  
2) **Trust Pack v2** — OIDC SSO advanced, retention policies, eDiscovery export, legal hold (writes to user storage).  
3) **Provisioning & Roles** — SCIM, SAML, fine‑grained object roles, API tokens with scopes.  
4) **Workflow Studio (Light)** — templates, rule builder (still explainable), “promote checklist → tasks”.  
5) **Predictive Insights (Explainable)** — duplicate task detection, dependency suggestions, schedule smoothing with model cards.  
6) **Client Extensions** — VS Code quick‑add, browser share target, mobile PWA wrapper.  
7) **Enterprise Hooks** — Webhooks/SDK, BI connectors (read‑only) to Sheets/BigQuery/Drive for reports.  
8) **Managed Mode (opt‑in)** — optional server‑side storage for enterprises that cannot use BYOS; separate SKU.

---

## 5) Feature Decision Grid (priority, value, risk)
| Feature | Class | Why it wins | Effort | Risk | Owner |
|---|---|---|---|---|---|
| Drive BYOS + `.sparkpack` | Must | Eliminates double storage, enables exit | M | Quota/latency | Platform |
| Accountable automations v1 | Must | Reduces “work about work” w/ proof | M | Alert fatigue | Insights |
| CRDT notes/comments | Must | Safe offline collab | M | Sync edges | Frontend |
| Insights v1.1 (aging WIP) | Must | Visibility → fewer escalations | S | Misinterpretation | Insights |
| Team controls (light) | Must | Trust & safety; basic governance | S | Scope creep | Frontend/Platform |
| Slack/GitHub/Calendar | Must | Removes status pings | S–M | API changes | Integrations |
| Importers + weekly drill | Must | Portability KPI | S | Vendor export variance | Platform |
| OneDrive/Dropbox | Good | Broader TAM | M | API quotas | Platform |
| OIDC SSO Advanced | Good | Larger deals unlock | M | IT complexity | Security |
| SCIM/SAML | Good | Enterprise readiness | M–L | Directory sprawl | Security |
| Workflow Studio | Good | Stickiness without bloat | M | Rule creep | Product |
| Predictive insights | Good | Incremental value | M | Explainability | Insights |
| VS Code/Browser ext | Good | PLG growth loops | S | Maintenance | Integrations |
| Webhooks/SDK | Good | Ecosystem growth | S | Support overhead | Platform |

_Effort: S (≤2w), M (≤6w), L (≥8w). Risk includes API quotas, UX debt, and security._

---

## 6) Eisenhower Matrix (scope discipline)
**Do now (MVP/Team):** Today/Snooze/Now‑Later‑Done • Quick‑add • Drive BYOS • Export/Import dry‑run • Local FTS • Insights v1.1 • Slack/GitHub/Calendar • Comments/@mentions • Actionable notifications • CRDT notes/comments • Rate limits • Audit events to user storage.

**Plan next (Trust/Scale):** OneDrive/Dropbox • OIDC SSO adv. • Retention policies • Importers expansion • Admin console • BI connectors • Webhooks/SDK.

**Delegate/Integrate:** VS Code quick‑add • Browser share • Mobile wrapper • Prebuilt dashboard in Sheets/Looker.

**Defer:** SCIM/SAML, Managed Mode, Workflow Studio, Predictive insights (until gates pass).

---

## 7) 30/60/90 Plan (with gates)
- **Day 0–30 (MVP Core):** quick‑add, Today/Snooze, Drive BYOS, bundle + `.sparkpack`, local FTS, insights v1.1; **Gate:** TTFT < 60s, D7 ≥ 35%, import→active ≥ 50%.
- **Day 31–60 (Team Pack):** comments/mentions, actionable notifications, CRDT notes/comments; **Gate:** digest action ≥ 40%; conflict success ≥ 97%.
- **Day 61–90 (Trust Light + Integrations):** rate limits, audit events→user storage, Slack/GitHub/Calendar; **Gate:** round‑trip ≥ 99%; dedupe ≥ 90%.

**Kill criteria:** If any gate fails twice consecutively → freeze scope, remediate wedge feature causing failure.

---

## 8) KPI Dashboard (executive view)
- **Activation:** TTFT (<60s), import→active (≥50%), first‑10‑tasks time.
- **Engagement:** D1/D7/D30 retention; WAU/MAU; % via quick‑add; digest action rate.
- **BYOS health:** adoption %, throttles, backoff events, error rate.
- **Portability:** weekly drill pass/fail; restore time; schemaVersion drift.
- **Performance:** p95 search; bundle size; list FPS.
- **Trust:** audit write success; rate‑limit incidents; cross‑workspace block rate.

---

## 9) TCO & Monetization (aligned to wedge)
- **Pricing:** Free (personal) → Pro ($9) → Team ($15) → Business ($25: SSO/audit/retention).  
- **Policy:** We **never** bill for storage; customers use their Drive/Dropbox/S3 plans.  
- **TCO proof:** publish calculator; highlight storage savings vs incumbents; show portability drill.

---

## 10) Risks & Mitigations
- **Provider quotas/latency (Drive/Dropbox):** batch & delta APIs; exponential backoff; user‑visible sync state.  
- **Index drift/corruption:** checksum + auto‑rebuild from JSONL; treat sqlite index as cache.  
- **Key loss (E2EE):** printed recovery kit; we do not escrow keys.  
- **Scope creep:** additive‑only flags; <10 KB gz per feature unless lazy‑loaded; monthly portability drill required to release.  
- **Alert fatigue:** dedupe windows; action buttons; “Why?” links; track false‑positive rate.

---

## 11) Launch Messaging (internal draft)
- **“Zero‑GB pricing.”** We don’t sell storage twice — Spark runs on your Drive/Dropbox.  
- **“Own your tasks.”** Human‑readable files; `.sparkpack` = instant exit.  
- **“Fast by contract.”** Performance budgets enforced in CI, not on a slide.  
- **“Explainable automation.”** Every alert explains itself.

---

## 12) Appendix — Bundle Schema v0.1 (excerpt)
```json
{
  "schemaVersion": "0.1",
  "project": { "id": "uuid", "name": "string", "createdAt": "ISO" },
  "tasks.jsonl": [
    {"type": "created", "id": "uuid", "title": "string", "ts": "ISO"},
    {"type": "status_changed", "id": "uuid", "status": "now|later|done", "ts": "ISO"},
    {"type": "assigned", "id": "uuid", "assignee": "userId", "ts": "ISO"}
  ],
  "events.jsonl": [
    {"eventId": "uuid", "kind": "automation_applied|digest_sent|unblocked", "by": "system|userId", "ts": "ISO"}
  ],
  "files": "binary attachments",
  "index.sqlite": "optional local FTS cache"
}
```

---

## 13) Decision Request
- Approve **Must‑Have** advanced set for 90‑day delivery.  
- Authorize pilots with Drive‑paying teams (20–50 seats) and gating metrics.  
- Lock **zero‑GB pricing** stance and **portability drill** as release gates.

**Owner:** Product  
**Stakeholders:** Engineering, Security, Finance/Procurement, GTM
