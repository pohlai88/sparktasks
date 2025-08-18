# SparkTasks — Executive Introduction for Management (Tech + Non‑Tech)

> **A storage‑neutral, local‑first task platform that eliminates bloat, prevents lock‑in, and runs on the storage you already pay for.**

---

## 1) One‑Page Executive Summary

**What:** SparkTasks is a calm, minimal task hub with a small core (Today, Snooze, Now/Later/Done, quick‑add), built around **BYOS (Bring‑Your‑Own‑Storage)** so tasks and files live in your **Google Drive / Dropbox / S3** in open, human‑readable bundles.

**Why now:** Teams are tired of bloat and vendor lock‑in, paying twice for storage, and losing time to coordination overhead ("work about work"). Procurement is demanding lower TCO and **true data portability**.

**How it’s different:**

- **Zero‑GB pricing**: we don’t resell storage — Spark runs on yours.
- **Data freedom**: one‑click `.sparkpack` export/restore; schema‑versioned JSONL + events.
- **Local‑first**: PWA with offline support and conflict‑safe collaboration (CRDT).
- **Explainable speed**: performance budgets enforced in CI; automations link to their “Why?”.

**Value in 90 days:** faster capture and focus, storage cost avoidance, and compliance‑friendly portability; foundation for team‑grade controls (SSO, audit) without bloating the core.

---

## 2) The Market Problem (Plain English)

- **Bloat & lock‑in**: Big suites add friction and make leaving hard. Exports are often lossy.
- **Paying twice for storage**: Many teams already pay for 2 TB+ on Drive/Dropbox yet PM tools sell storage again.
- **Coordination drag**: People spend large portions of the week chasing status, searching, and re‑entering data.
- **Weak offline & conflicted edits**: Field/low‑connectivity teams can’t work safely without live internet.

**Opportunity:** A **storage‑neutral, portable, local‑first** task platform that’s fast, explainable, and honest about ownership.

---

## 3) Our Wedge — 6 Gaps Incumbents Leave Open

**1) Storage‑neutral tasking (BYOS)**

- **Spark move:** Native Drive/Dropbox project folders (JSONL + attachments), one‑click `.sparkpack` export; never bill for bytes.
- **Proof KPI:** % workspaces using BYOS; import→active rate; TCO wins citing storage savings.

**2) Work‑about‑work killer**

- **Spark move:** Today + Snooze + Now/Later/Done; quick‑add grammar; weekly digests with action buttons; explainable status.
- **Proof KPI:** Time‑to‑first‑task < 60s; D7 ≥ 35%; % tasks created via quick‑add ≥ 50%; meeting hours ↓ in pilots.

**3) True portability & explainable governance**

- **Spark move:** Schema‑versioned export/import + dry‑run diffs; user‑owned `events.jsonl` audit trail.
- **Proof KPI:** Round‑trip success ≥ 99%; weekly export‑restore drill passes.

**4) Offline‑first + conflict‑safe collaboration**

- **Spark move:** PWA + background sync; CRDT for notes/comments; simple conflict banner for scalar fields.
- **Proof KPI:** % edits offline; conflict resolution success rate; low merge‑related support tickets.

**5) Accountable automation (not black‑box AI)**

- **Spark move:** Small, auditable automations (Aging WIP, Unblock summaries) with “Why?” links to events.
- **Proof KPI:** Digest action rate ≥ 40%; false positives < 5%; sustained adoption without training.

**6) CFO‑friendly TCO & procurement fit**

- **Spark move:** Seat pricing for governance/automation — **never** storage; publish transparent TCO comparisons.
- **Proof KPI:** Win‑rate in bake‑offs; % deals citing storage savings and portability.

---

## 4) 4W1H (Who / What / Why / When / How)

**Who:** Makers & small teams (5–50 seats), cost‑conscious SMBs already on Drive/OneDrive; teams needing provable portability.

**What:** A minimal core task hub with BYOS data ownership, open bundles, offline‑first sync, explainable insights, and optional team controls.

**Why:** Reduce TCO, eliminate lock‑in, cut coordination drag, and meet portability/compliance expectations.

**When:**

- **MVP (60 days):** BYOS‑Drive, core tasking, local search, `.sparkpack` export/import, basic insights, Slack digest.
- **Team Pack (90 days):** comments/mentions, actionable notifications, conflict‑safe offline collab, GitHub/Calendar links.
- **Trust Pack (120–180 days):** OIDC SSO, audit logs written to user storage, rate‑limits, retention policies, OneDrive/Dropbox adapters.

**How:** Local‑first PWA + storage adapters; event‑sourced bundles; user‑held encryption keys; CRDT merges; CI‑enforced performance budgets.

---

## 5) What Makes SparkTasks Different (Promises)

- **Zero‑GB pricing** — never pay us for storage you already own.
- **Own your tasks** — human‑readable files; `.sparkpack` = instant exit.
- **Fast by contract** — p95 search < 200 ms @ 1k tasks; 60 fps virtualized lists @ 10k; core bundle < 250 KB gz when flags off.
- **Explainable automation** — every alert links to events that triggered it.

---

## 6) How It Works (High‑Level Architecture)

```mermaid
flowchart LR
  subgraph Client [PWA Client]
    UI[Today/Later/Done]
    QA[Quick Add (NLP)]
    IDX[Local Index (sqlite‑wasm)]
    CRDT[CRDT Notes/Comments]
    BDL[Bundle Manager (JSONL + events + files)]
  end
  subgraph Adapters [Storage Adapters]
    GDrive[Google Drive]
    Dropbox[Dropbox]
    S3[S3]
  end
  subgraph ThinServer [Thin Server]
    Auth[Auth/OIDC]
    Notify[Notifications & Digests]
    Webhooks[Integrations]
  end
  UI --> QA --> BDL --> IDX
  CRDT --> BDL
  BDL <--> GDrive
  BDL <--> Dropbox
  BDL <--> S3
  UI --> ThinServer
  ThinServer --> Notify
  ThinServer --> Webhooks
```

**Data model & portability**

- Each project is a folder you own:
  - `tasks.jsonl` (append‑only events) → derived task state
  - `events.jsonl` (user‑owned audit trail)
  - `/files/*` (attachments)
  - `index.sqlite` (optional local search cache; rebuildable)
- **Export/Import:** `.sparkpack` zip with dry‑run diffs and rollback.

**Security**

- End‑to‑end encryption (E2EE) — user‑held keys; we cannot read your content in BYOS mode.
- Import validation, cross‑workspace isolation, rate limits, notification de‑dupe windows.

---

## 7) Roadmap & Eisenhower Matrix (Scope Discipline)

**MVP (Do now):** Today/Snooze/Now‑Later‑Done • Quick‑add • Drive BYOS • Export/Import dry‑run • Local FTS • Insights v1 • Slack digest

**Plan next (Team Pack):** Comments/@mentions • Actionable notifications • Conflict UX • GitHub/Calendar links • Basic rate‑limits & audit log

**Delegate/Integrate:** VS Code quick‑add • Browser share target • Webhooks + typed SDK

**Defer:** Gantt/Portfolio • heavy OKRs • copilot authoring • SCIM/SAML/DLP (post 180 days)

---

## 8) KPIs, Decision Gates & Kill Criteria

**Activation:** TTFT < 60s; import→active ≥ 50%\
**Engagement:** D7 ≥ 35%; WAU/MAU ≥ 0.55; ≥ 50% tasks via quick‑add\
**BYOS:** ≥ 60% new workspaces choose external storage\
**Portability:** Round‑trip success ≥ 99% on public corpus\
**Performance:** p95 search < 200 ms; core bundle < 250 KB

**Kill criteria (stay honest):**

- If BYOS adoption < 20% or round‑trip < 95% in pilots → pause feature expansion; fix portability first.
- If D7 < 35% with Today+Snooze → do not add modules; tighten capture/flow.

---

## 9) Business Model & TCO Example

**Pricing concept:** Seats monetize governance/automation — **never storage**. Free (personal) → Pro (\$9) → Team (\$15) → Business (\$25: SSO, audit, retention).\
**TCO driver:** Storage = \$0 to Spark (BYOS). Publish a clear calculator for seats vs storage savings.

**Illustrative comparison (monthly):**

| Scenario         | Seats | Seat price | Storage billed by vendor | Extra storage needed | Storage price/GB | **Total**               |
| ---------------- | ----- | ---------- | ------------------------ | -------------------- | ---------------- | ----------------------- |
| Incumbent A      | 20    | \$15       | Yes                      | 400 GB               | \$0.02           | \$300 + \$8 = **\$308** |
| **Spark (BYOS)** | 20    | \$15       | **No**                   | N/A                  | \$0              | **\$300**               |

> Notes: Teams already pay \~\$9.99/mo for 2 TB on Google One; Spark doesn’t bill storage.

---

## 10) Pilot Plan — 30/60/90 Days

**Day 0–10:** Seed pilots with Drive‑paying teams (20–50 seats); import data; baseline time‑use survey.\
**Day 11–30:** Core usage; weekly digest; measure TTFT/D7; fix capture/flow friction.\
**Day 31–60:** Add comments/mentions + actionable notifications; measure digest action rate.\
**Day 61–90:** Add GitHub/Calendar; evaluate TCO wins and portability drills; go/no‑go for Trust Pack.

**Reporting:** Weekly 1‑pager (KPIs vs targets, top 3 learnings, next 3 actions). Dashboard for Activation, Engagement, BYOS health, Portability.

---

## 11) Risks & Mitigations (Realistic)

- **Drive/One quotas & latency:** batch writes; delta polling; exponential backoff; visible sync status.
- **Index corruption/drift:** treat `index.sqlite` as cache; checksums; auto‑rebuild from JSONL.
- **Key loss (E2EE):** optional printed recovery codes; we do not escrow keys.
- **Scope creep:** additive‑only flags; < 10 KB gz per feature unless lazy‑loaded; monthly portability drill required for release.

---

## 12) FAQs (for Execs & Teams)

**Q: Can we leave anytime?**\
A: Yes. `.sparkpack` = one‑click export/restore; files are plain JSONL + attachments.

**Q: Do you store our content?**\
A: In BYOS mode, task content/attachments live in **your** storage; our server handles auth, notifications, and webhooks.

**Q: Will it be fast enough at scale?**\
A: We enforce budgets in CI (p95 search < 200 ms @ 1k tasks; 60 fps virtual lists @ 10k; core bundle < 250 KB gz). Regressions block merges.

**Q: What about security & compliance?**\
A: E2EE with user‑held keys; import validation; workspace isolation. Trust Pack adds OIDC SSO, audit logs (written to your storage), retention policies.

---

## 13) Source Highlights (for reference)

- **Portability:** GDPR Article 20 — right to data portability (machine‑readable, structured).
- **Work‑about‑work:** Multiple reports show substantial time lost to coordination/search.
- **Storage prices:** Google One 2 TB ≈ \$9.99/mo; Dropbox comparable.
- **Local‑first/CRDT feasibility:** Mature libraries (e.g., Automerge/Yjs) support conflict‑safe merges.

> Full links and detailed notes live in the Strategy Annex. This intro stays stable as an internal brief for mixed audiences.

---

## 14) Decision Request (Next Steps)

- Approve **MVP scope** & **30/60/90** pilot plan.
- Nominate **2–3 pilot cohorts** (20–50 seats, already on Drive).
- Green‑light **BYOS positioning** (no storage upsell) and **portability drill** as a release gate.

**Owner:** Product\
**Stakeholders:** Engineering, Security, Finance/Procurement, GTM

