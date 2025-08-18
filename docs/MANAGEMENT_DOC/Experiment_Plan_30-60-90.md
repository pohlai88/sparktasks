# Experiment Plan — 30/60/90 Pilots (Living)

## Hypotheses
H1: BYOS + Today/Snooze reduces activation friction → TTFT < 60s; import→active ≥ 50% in 30 days.  
H2: Explainable digests + quick‑add reduce coordination cost → D7 ≥ 35%, digest action rate ≥ 40%.  
H3: Round‑trip portability is a buying trigger → ≥ 30% of wins cite portability/TCO.

## Cohorts & Eligibility
- 20–50 seat teams already paying for Google One/Drive (primary).  
- Mix of engineering‑adjacent and operations teams.  
- Consent to lightweight usage telemetry (no content).

## Metrics
- Activation: TTFT, import→active, first 10 tasks created.  
- Engagement: D1/D7/D30 retention, WAU/MAU, % via quick‑add.  
- BYOS: adoption %, sync errors, API throttles.  
- Portability: round‑trip success rate, time to restore.  
- Work‑about‑work: digest action rate, meeting hours delta, search time delta.

## Instrumentation
- Client events: `task_created(source)`, `snooze_used`, `quick_add_used`, `digest_action`, `import_dry_run_ok`.  
- Sync metrics: `drive_api_throttle`, `backoff_triggered`, `bundle_checksum_ok`.  
- Privacy: timings & counts only; no task content.

## Timeline
**Day 0–10:** seed pilots, import their data, baseline time‑use survey.  
**Day 11–30:** core usage; weekly digest; measure TTFT/D7; fix core friction.  
**Day 31–60:** add comments/mentions + actionable notifications; measure action rates.  
**Day 61–90:** add GitHub/Calendar links; evaluate TCO wins and NPS.

## Decision checkpoints
- **Day 30:** If TTFT ≥60s or import→active <50% → address onboarding/quick‑add/Drive consent.  
- **Day 60:** If D7 <35% or digest action <40% → refine Today/Snooze & digest rules.  
- **Day 90:** If BYOS <20% or round‑trip <95% → pause feature expansion; fix portability.

## Reporting
- Weekly 1‑pager: KPIs vs targets, top 3 learnings, next 3 actions.  
- Dashboard (Looker/Metabase): Activation funnel, Engagement, BYOS health, Portability drill.
