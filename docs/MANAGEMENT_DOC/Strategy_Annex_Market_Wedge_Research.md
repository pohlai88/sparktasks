# Strategy Annex — Market Wedge & Research (Living)

This annex holds the evidence and evolving positioning. Update freely; keep the PRD stable.

## The 6 gaps incumbents leave open (and how Spark enters)

### 1) Storage‑neutral tasking (BYOS: Drive/Dropbox)
**Why it’s a gap:** Organizations run ~93–100+ apps (Okta 2024–2025), pushing consolidation and TCO scrutiny. Paying again for storage inside PM tools is under pressure; Google One/Dropbox offer ~2TB at ~$9.99/mo.  
**Sources:** Okta Businesses at Work 2024 (avg 93 apps) [PDF] ¹; Okta 2025 (topped 100 apps) ²; Google One pricing (2TB $9.99/mo) ³.  
**Spark move:** Native Drive/Dropbox project folders (JSONL + attachments), one‑click `.sparkpack`, **zero‑GB pricing** (we don’t resell storage).  
**Proof KPI:** % workspaces using BYOS; import→active rate; CAC payback for Drive users.

### 2) Work‑about‑work killer (reduce coordination drag)
**Why it’s a gap:** Knowledge workers spend ~60% of time on “work about work”: status pings, duplicate tasks, searching.  
**Sources:** Asana reports (2025 “Work isn’t working”) ⁴ ⁵.  
**Spark move:** **Today + Snooze + Now/Later/Done**, quick‑add grammar, explainable status via events.  
**Proof KPI:** D7 ≥35%; TTFT <60s; % tasks via quick‑add; meeting hours ↓ in pilots.

### 3) True data portability & explainable governance
**Why it’s a gap:** Buyers fear lock‑in; **GDPR Article 20** expects structured, machine‑readable, interoperable exports; many tools are lossy.  
**Sources:** GDPR Art. 20 (legal text) ⁶ ⁷.  
**Spark move:** Schema‑versioned export/import with **dry‑run diffs**; user‑owned `events.jsonl` as audit trail.  
**Proof KPI:** Round‑trip success ≥99%; weekly export‑restore drill passes.

### 4) Offline‑first + conflict‑safe collaboration
**Why it’s a gap:** Real offline + safe merges are rare in PM; CRDTs are the proven path.  
**Sources:** Automerge docs/blog (v3, 2025) ⁸ ⁹; Yjs docs (2024–2025) ¹⁰ ¹¹.  
**Spark move:** Local‑first PWA, CRDT for notes/comments, simple conflict banner for scalars.  
**Proof KPI:** % edits offline; conflict‑resolution success rate; low merge‑related support tickets.

### 5) Accountable automation (not black‑box copilot)
**Why it’s a gap:** Buyers want outcome‑oriented, explainable intelligence.  
**Sources:** Industry commentary on AI squeezing software margins and demand for embedded intelligence (2025) ¹² ¹³.  
**Spark move:** Small, auditable automations (aging‑WIP, unblock summaries) with “Why?” links to event rules.  
**Proof KPI:** Alert action rate ≥40%; false‑positive rate <5%; sustained adoption without training.

### 6) CFO‑friendly TCO & procurement fit
**Why it’s a gap:** App sprawl raises cost and risk; procurement favors tools that avoid double billing for storage.  
**Sources:** Okta app counts ¹ ².  
**Spark move:** Seat pricing for governance/automation—**never storage**; publish TCO comparisons (storage + seats).  
**Proof KPI:** Win‑rate in bake‑offs citing storage savings; % deals referencing TCO doc.

---

## Market size & trend snapshot
- Project management software: ~$9.22B (2025) with ~15% CAGR; forecasts to ~$20B by 2030 (various analysts). ¹⁴ ¹⁵  
- App sprawl: avg 93 apps (2024) and 100+ (2025). ¹ ²  
- Work‑about‑work: ~60% time lost to coordination. ⁴ ⁵  
- Storage benchmarks: Google One 2TB $9.99/mo. ³

> These numbers guide **positioning** and **pricing**; core build decisions derive from the wedge above.

---

## Competitor snapshot (capabilities overview)
| Capability | SparkTasks (planned) | Asana | Jira | Linear | Trello | ClickUp | Notion Tasks |
|---|---|---|---|---|---|---|---|
| BYOS (Drive/Dropbox) | **Native** | No | No | No | Partial (Power‑Ups) | No | No |
| Data portability (round‑trip) | **Schema JSONL + events** | Export partial | Export partial | Export | CSV/JSON | CSV/JSON | CSV |
| Offline & CRDT merges | **Yes (notes/comments)** | Limited | Limited | Limited | Limited | Limited | Limited |
| Explainable automations | **Yes** | Rules + AI | Automations | Automations | Butler | Automations | Limited |
| Performance budgets in CI | **Yes** | Unstated | Unstated | Yes (culture) | No | Unstated | Unstated |
| Storage upsell | **None** | Yes | Yes | No | Add‑ons | Yes | Yes |

> Note: Competitor features summarized from public docs/UX; validate per release.

---

## TCO model (how to compare)
1) **Seat costs:** seats × price per seat.  
2) **Storage costs:** (extra GB needed beyond included) × price/GB/mo **or** separate storage plan.  
3) **Ops overhead savings:** meeting hours ↓, search time ↓ (pilot deltas).  
4) **Spark pricing:** seats only; storage = BYOS $0 from Spark’s perspective.

See `TCO_Calculator.xlsx` for a ready sheet you can customize.

---

## Source list (direct links)
1. Okta Businesses at Work 2024 (PDF): https://www.okta.com/sites/default/files/2024-04/Okta-2024_Businesses_at_Work.pdf  
2. Okta Businesses at Work 2025 (web): https://www.okta.com/reports/businesses-at-work/  
3. Google One pricing (2TB $9.99/mo): https://one.google.com/about/plans  
4. Asana “How Work About Work Gets in the Way” (2025): https://asana.com/resources/why-work-about-work-is-bad  
5. Asana “The Way We Work Isn’t Working” (2025): https://asana.com/resources/work-isnt-working  
6. GDPR Article 20 (legal text): https://gdpr-info.eu/art-20-gdpr/  
7. GDPR legal portal (alt): https://gdpr-text.com/en/read/article-20/  
8. Automerge docs (Hello): https://automerge.github.io/docs/hello/  
9. Automerge 3.0 blog (2025): https://automerge.github.io/blog/automerge-3/  
10. Yjs docs (Intro): https://docs.yjs.dev/  
11. Yjs “Collaborative editor” (2025): https://docs.yjs.dev/getting-started/a-collaborative-editor  
12. Business Insider (AI squeezing software margins, 2025): https://www.businessinsider.com/software-companies-squeezed-by-ai-alixpartners-2025-4  
13. Spend Matters (SaaS trend = intelligence, 2025): https://spendmatters.com/2025/04/24/saas-procurement-trends-2025-ai-intelligence/  
14. The Business Research Company (PM market $9.22B 2025): https://www.thebusinessresearchcompany.com/report/project-management-software-global-market-report  
15. Digital Project Manager (to ~$20.5B by 2030): https://thedigitalprojectmanager.com/project-management/project-management-software-market-size/
