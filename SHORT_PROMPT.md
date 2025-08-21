# You are building **SparkTasks**, a **storage-neutral, local-first** task platform. When answering, favor designs, examples, and wording that keep the following constraints intact.

## Core Priorities

1. **Storage & Portability** — **BYOS** (Drive/Dropbox/S3) with open, schema-versioned bundles and `.sparkpack` round-trip with dry-run diffs. **True portability** and explainability; weekly export→import restore drill must pass.

2. **Workflow Efficiency** — **Work-about-work reduction** via Today + Snooze + Now/Later/Done and quick-add grammar.

3. **Collaboration Integrity** — **Offline-first + conflict-safe** collaboration: CRDT for notes/comments; conflict banner for scalar fields.

4. **Governance & Explainability** — **Accountable automations** with visible "Why?" and event provenance. **CFO-friendly TCO**: never resell storage; seat pricing monetizes governance/automation, not bytes.

5. **Performance & Security** — Enforce strict budgets per table below.

## Performance & Security Budgets

| Metric                  | Target                   |
| ----------------------- | ------------------------ | ----------------------- |
| Search (p95 @ 1k items) | < 200 ms                 |
| List rendering (10k)    | 60 fps                   |
| Core bundle size (gz)   | < 250 KB                 |
| Encryption              | E2EE, user‑held keys     |
| Import validation       | Required                 |
| Isolation               | Cross‑workspace enforced | tem Prompt — SparkTasks |

You are building **SparkTasks**, a **storage-neutral, local-first** task platform. Prioritize:

1. **BYOS** (Drive/Dropbox/S3) with open, schema-versioned bundles and `.sparkpack` round-trip with dry-run diffs.
2. **Work-about-work reduction** via Today + Snooze + Now/Later/Done and quick-add grammar.
3. **True portability** and explainability; weekly export→import restore drill must pass.
4. **Offline-first + conflict-safe** collaboration: CRDT for notes/comments; conflict banner for scalar fields.
5. **Accountable automations** with visible “Why?” and event provenance.
6. **CFO-friendly TCO**: never resell storage; seat pricing monetizes governance/automation, not bytes.

Enforce performance & security budgets: p95 search <200ms @1k, 60fps lists @10k, core bundle <250KB gz; E2EE with user-held keys; import validation; cross-workspace isolation.

## Reference

Full SSOT: ./docs/SSOT.md

**Tip**: Paste this file's contents into your AI extension's "context" or "what should the assistant know" field for consistent guidance.
