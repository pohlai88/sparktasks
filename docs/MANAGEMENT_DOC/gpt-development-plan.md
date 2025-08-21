# 🛡 DRIFT-SAFE — SparkTasks GPT Development Plan (SSOT v3)

**Purpose**: Single source of truth for prompts, guardrails, phase gates, and competitive-grade delivery.
**Rule #1**: If a change needs >\~220 diff lines or leaves allowed paths → **stop and ask ONE question** (no drift).

## Universal Anti-Drift Header (prepend to every task)

**DRIFT-SAFE CODING INSTRUCTION — SparkTasks**

- Apply only the explicit change. If completion requires leaving allowed paths or >\~220 diff lines, stop and return ONE clarifying question.
- **Output**: unified git diff only (no prose/logs).
- **Rules**: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
- **DoD (ALL)**: type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

---

## Ground-Truth Snapshot (what governs this plan)

- **North Star/Gates**: BYOS adoption ≥60%, portability ≥99%; p95 search <200ms@1k; 60fps lists@10k; bundle <250KB gz; zero server-side content in BYOS; audit to user storage; rate limits on.
- **Positioning**: storage-neutral, local-first task hub; win on TCO, portability, explainable speed.
- **CRITICAL AUDIT FINDING**: No functional UI exists - only static layout with placeholder text. Backend/domain logic 100% complete.
- **Exec summary priorities**: **BUILD FUNCTIONAL TASK UI FIRST** before any advanced features; pause crypto development until basic workflows work; focus 100% on user experience gap.

---

# Phase A — "Make It Work" (Weeks 1–4) **[COMPETITIVE EDGE FOCUS]**

**Objective**: Build functional task management UI that rivals existing solutions. **Critical Gap**: Backend is 100% complete but no usable interface exists.
**Competitive Benchmark**: Match Linear's speed + Todoist's UX + Trello's simplicity + exceed on accessibility.

### A1 — Basic Task UI + Forms (**URGENT - NEXT TASK**)

**Allowed**: `src/components/**`, `src/stores/**` (connect only, no changes), `src/App.tsx`, `tests/**`
**Forbidden**: SSOT/docs/configs/deps/backend/crypto changes
**Prompt**: Create functional task management UI with forms wired to existing taskStore. Replace static placeholders with real task CRUD.

**Core Requirements**:

- Task creation form with title/description/priority/tags
- Task list rendering from store with Today/Later/Done columns
- Complete/uncomplete buttons that update task status
- Edit task inline or modal functionality
- Delete task capability
- Wire all actions to existing taskStore methods (no store changes needed)

**Competitive Edge Enhancements**:

- **Form validation** via existing Zod schemas with inline errors (prevents bad data)
- **Optimistic updates** + rollback toast for snappy feel (Linear-level responsiveness)
- **Focus management**: new task title focus, modal close returns focus (accessibility win)
- **Analytics hooks**: track "time-to-first-task" for A5 baseline (data-driven optimization)
- **Quick-Add hints** ("tomorrow 4pm #work") below title field (Todoist-style UX training)
- **Empty state scaffolding** with example tasks and "Get Started" flow (first-minute success)

**DoD**: Users can create, view, edit, complete, and delete tasks; smoke tests; focus ring/labels/aria; type/test/build pass; competitive UX feel.

### A2 — Task Interactions + State Updates (**RISK-MANAGED**)

**Prompt**: Add task movement between columns, snooze functionality, and undo/redo UI controls.

**De-Risking Strategy (Competitive Parity)**:

- **Dual Control Pattern**: Drag-and-drop + "Move to..." context menu + keyboard shortcuts (j/k + m)
- **Progressive Enhancement**: Ship keyboard movement FIRST, add DnD as enhancement
- **Data Model Choice**: Emit TaskReordered events for audit trail (Linear/Asana standard)
- **A11y-First**: ARIA live regions for move announcements; roving tabindex
- **Keyboard Fallback**: Arrow keys + Enter for non-mouse users (Trello/Asana compliance)

**Competitive Enhancements**:

- **Visual feedback**: Smooth animations + hover states (modern interaction standards)
- **Smart defaults**: Auto-snooze suggestions based on patterns (intelligent UX)
- **Batch operations**: Multi-select with Shift+click (power user efficiency)
- **Conflict resolution**: Visual indicators for sync conflicts with user choice (trust building)

**DoD**: All core task workflows functional; UI reflects store state changes immediately; keyboard navigation works without mouse; competitive interaction quality.

### A3 — Keyboard Navigation + A11y (**FORCE MULTIPLIER**)

**Prompt**: Add keyboard navigation & a11y for lists and forms (Tab/Shift+Tab, j/k navigation, Enter to edit, Escape to cancel).

**Implementation Pattern (Industry Standard)**:

- **Consistent Model**: Use role="list"/"listitem" with roving tabindex (avoid mixing patterns)
- **Navigation Keys**: j/k or ↑/↓ for focus; Enter=edit; Esc=cancel; Tab to exit list
- **Visual Feedback**: Visible focus rings + ARIA live regions for status changes
- **Screen Reader**: "Moved to Done", "Task completed" announcements

**Competitive Advantage Enhancements**:

- **Command palette**: Cmd/Ctrl+K for universal search/actions (Linear-style)
- **Custom shortcuts**: User-configurable hotkeys for common actions (power user retention)
- **Spatial navigation**: Logical tab order that matches visual layout (intuitive flow)
- **Reduced motion**: Respect prefers-reduced-motion for accessibility (inclusive design)
- **Touch support**: Gesture navigation for mobile/tablet users (cross-platform parity)

**DoD**: WCAG AA compliance; unit tests for focus order/keys; screen reader compatibility; keyboard navigation exceeds competitor standards.

### A4 — Search UI + Quick-Add Interface (**SMART LEVERAGE**)

**Prompt**: Build search input UI and quick-add interface wired to existing search engine and quick-add parser.

**Core Requirements**: Search bar with live results; quick-add text input with NLP parsing hints; connect to existing domain logic.

**Competitive Edge (Todoist-Level UX)**:

- **Live Search**: Highlighted matches with throttled input (immediate feedback)
- **Quick-Add Training**: Ghost text examples ("tomorrow 4pm #ops", "next week @high")
- **Smart Hints**: Context-aware suggestions based on existing tags/projects
- **Search Scopes**: Filter by Today/Later/Done, tags, dates (advanced filtering)

**Advanced UX Enhancements**:

- **Search shortcuts**: Slash commands (/today, /urgent) for power users
- **Recent searches**: Remember and suggest previous queries (convenience)
- **Fuzzy matching**: Typo-tolerant search results (user-friendly)
- **Export search**: Save search results as .csv or .sparkpack (data portability)
- **Search analytics**: Track what users search for most (feature prioritization data)

**DoD**: Users can search tasks and use natural language quick-add; existing search/parser logic unchanged; search UX exceeds competitor standards.

### A5 — Performance Baseline + Mobile Responsive (**FUTURE-PROOFING**)

**Prompt**: Add Web Vitals monitoring; ensure 3-column layout adapts to mobile; optimize bundle <250KB.

**Core Implementation**:

- **Web Vitals Hook**: Console logging in dev; in-memory buffer in prod (exportable for bug reports)
- **Mobile Collapse**: Three columns → single vertical list with segmented control tabs
- **Bundle Vigilance**: 250KB budget with CI enforcement; defer heavy components to Phase B

**Performance Competition Enhancements**:

- **Lighthouse scoring**: Target 95+ performance score (Google PageSpeed benchmark)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1 (SEO/UX standards)
- **Progressive loading**: Skeleton screens + lazy loading (perceived performance)
- **Offline support**: Service worker for basic offline functionality (modern PWA standards)
- **Performance budget**: Real-time bundle analysis in dev mode (proactive optimization)

**Mobile-First Enhancements**:

- **Touch targets**: 44px minimum touch areas (iOS/Android guidelines)
- **Swipe gestures**: Left/right swipe to complete/snooze tasks (native app feel)
- **Pull-to-refresh**: Standard mobile interaction pattern (user expectation)
- **Bottom navigation**: Thumb-friendly UI on mobile (ergonomic design)

**DoD**: Performance dashboards; mobile-first responsive design; bundle budget met; mobile UX competitive with native apps.

---

# Phase B — "Make It Trusted" (Weeks 5–12) **[BYOS COMPETITIVE ADVANTAGE]**

**Objective**: Deliver unique storage neutrality and enterprise-grade security that competitors can't match.
**Competitive Positioning**: Only task manager with true BYOS + E2EE + zero vendor lock-in.

### B-Done (locked, no drift) **[READ-ONLY]**

- **Attested sparkpacks & verified sync** (Task 18) ✅
- **Signer lifecycle** (Task 19) ✅
- **Federated trust & verification** (Task 20) ✅
- **Federated anchor sync** (Task 21) ✅
- **Federated anchor discovery & auto-trust** (Task 22) ✅
- **Multi-sig attestation (threshold)** (Task 23) ✅
- **Transparency log (Merkle) + inclusion proofs** (Task 24) ✅
- **Witness co-signed checkpoints** (Task 25) ✅

### B26 — BYOS Storage Adapters (**MARKET DIFFERENTIATOR**)

**Allowed**: `src/storage/drive/**`, `src/storage/dropbox/**`, `src/storage/s3/**`, `src/domain/pack/**`, `tests/**`
**Forbidden**: schema/API/crypto changes

**Core Requirements**: Multi-backend support; conflict detection; ≥99% round-trip accuracy; user-visible sync state.

**Competitive Advantage Enhancements**:

- **Storage provider choice**: Google Drive, Dropbox, AWS S3, local filesystem (true neutrality)
- **Migration tools**: Easy export/import between storage providers (no lock-in)
- **Sync status UI**: Real-time sync indicators with conflict resolution (transparency)
- **Bandwidth optimization**: Delta sync with compression (efficient sync)
- **Offline queue**: Queue changes when storage unavailable (reliability)

**Enterprise Features**:

- **Compliance modes**: GDPR, HIPAA, SOX data handling options (enterprise ready)
- **Audit trails**: Complete sync history with cryptographic verification (enterprise security)
- **Team storage**: Shared storage pools with access controls (collaboration)

**DoD**: BYOS portability ≥99% on sample corpus; backoff under quotas; CI perf gates unchanged; unique market positioning.

### B27 — Transparency + Witness Network (**TRUST INFRASTRUCTURE**)

**Allowed**: `src/witness/**`, `src/transparency/**`, `src/policy/**`, `tests/**`

**Core Requirements**: Policy-gated allowlist; redact sensitive fields; no new crypto primitives.

**Competitive Trust Enhancements**:

- **Public transparency**: Optional public witness network for verification (open trust)
- **Private witnesses**: Enterprise-only witness infrastructure (hybrid trust model)
- **Trust scores**: Real-time trust metrics for data integrity (user confidence)
- **Incident response**: Automated compromise detection and user notification (security excellence)

**DoD**: 100% passing tests; per-witness metrics; failures non-fatal; industry-leading transparency.

### B28 — Enterprise Authentication (**ENTERPRISE READINESS**)

**Allowed**: `src/auth/**`, `src/enterprise/**`, `tests/**`

**Enterprise Competitive Features**:

- **SSO Integration**: SAML, OIDC, Active Directory (enterprise standards)
- **RBAC**: Role-based access with custom permissions (security granularity)
- **Audit logging**: Complete user action logs (compliance requirements)
- **Zero-trust architecture**: Every request verified (modern security)

**DoD**: Enterprise authentication competitive with Asana/Linear enterprise tiers.

---

# Phase C — "Make It Scale" (Weeks 13–26) **[ECOSYSTEM DOMINANCE]**

**Objective**: Build ecosystem integrations and analytics that create switching costs and network effects.
**Competitive Strategy**: Become the hub that connects all productivity tools.

### C1 — Search & List Performance (**SPEED LEADERSHIP**)

**Competitive Performance Targets**:

- **Search Speed**: p95 <200ms@1k tasks, <500ms@10k tasks (faster than Linear)
- **List Rendering**: 60fps@10k tasks with virtual scrolling (smooth interaction)
- **Memory Efficiency**: <100MB RAM for 10k tasks (resource efficient)

**Performance Enhancements**:

- **Incremental search**: Index updates without full rebuild (real-time search)
- **Search workers**: Web Workers for non-blocking search (responsive UI)
- **Smart caching**: Predictive cache warming (perceived speed)

**DoD**: Performance leadership position vs competitors; sub-second search at enterprise scale.

### C2 — Real-Time Collaboration (**TEAM PRODUCTIVITY**)

**Competitive Collaboration Features**:

- **Live cursors**: See team members' activity in real-time (Figma-style)
- **Conflict-free editing**: CRDT for simultaneous editing (technical excellence)
- **@mentions**: Smart notifications without spam (engagement)
- **Activity feeds**: Team-wide activity streams (transparency)

**Advanced Collaboration**:

- **Presence indicators**: Who's online and active (social proof)
- **Change attribution**: See who made what changes when (accountability)
- **Threaded comments**: Async discussion on tasks (context preservation)

**DoD**: Collaboration features competitive with Asana/Linear; real-time performance.

### C3 — Integration Ecosystem (**SWITCHING COSTS**)

**Strategic Integrations** (create switching costs):

- **GitHub**: Automatic task creation from issues/PRs (developer workflow)
- **Calendar**: Smart scheduling with task time estimates (time management)
- **Slack/Teams**: Bidirectional sync with channels (communication integration)
- **Email**: Task creation from emails (capture everything)

**Integration Platform**:

- **Webhook infrastructure**: Real-time data sync (technical foundation)
- **API marketplace**: Third-party integrations (ecosystem growth)
- **Zapier/Make**: No-code automation (user empowerment)

**DoD**: 10+ strategic integrations; API platform for third-party developers.

### C4 — Analytics & Insights (**DATA-DRIVEN OPTIMIZATION**)

**Competitive Analytics Features**:

- **Personal insights**: Individual productivity patterns (self-improvement)
- **Team analytics**: Bottleneck identification and flow metrics (management value)
- **Predictive analytics**: Task completion time estimates (planning accuracy)
- **Burnout detection**: Workload balance indicators (employee wellbeing)

**Privacy-First Analytics**:

- **Local processing**: Analytics computed client-side (privacy preservation)
- **Opt-in sharing**: Team insights only with explicit consent (ethical data)
- **Explainable insights**: Show why recommendations are made (transparency)

**DoD**: Analytics competitive with RescueTime/Clockify; privacy-first approach as differentiator.

### C5 — Advanced Automation (**INTELLIGENT ASSISTANCE**)

**Smart Automation Features**:

- **Pattern recognition**: Auto-categorize similar tasks (efficiency)
- **Smart reminders**: Context-aware notification timing (relevance)
- **Template suggestions**: Task templates based on patterns (standardization)
- **Workload balancing**: Automatic task distribution (team optimization)

**AI-Powered Features** (ethical AI):

- **Natural language**: Enhanced NLP for complex task creation (user-friendly)
- **Smart scheduling**: Optimal task ordering based on patterns (productivity)
- **Anomaly detection**: Unusual pattern alerts (proactive management)

**DoD**: Automation features exceed Motion/Reclaim; ethical AI implementation.

---

## Delivery Cadence & Kill Criteria **[COMPETITIVE GATES]**

- **Phase A Gates**: Must deliver task management UI that feels competitive with Linear/Todoist before Phase B
- **Phase B Gates**: BYOS functionality must be unique in market; enterprise features must match Asana/Linear
- **Phase C Gates**: Integration ecosystem must create switching costs; analytics must be privacy-leading
- **Performance Gates**: Maintain speed leadership throughout; bundle <250KB; 60fps interactions

---

## "Paste-to-Agent" Rigid Prompts **[COMPETITIVE FOCUS]**

### Prompt-A1 (URGENT NEXT TASK)

```
Task: Create competitive task management UI with forms wired to existing taskStore.
Allowed: src/components/**, src/App.tsx, tests/**
Forbidden: store/domain/crypto changes, new deps
Output: unified git diff only (≤~220 lines)
DoD: Task CRUD that rivals Linear/Todoist UX; Zod validation; optimistic updates; focus management; competitive feel.
```

### Prompt-A2 (After A1 Complete)

```
Task: Add competitive task interactions with dual-control pattern (DnD + keyboard).
Allowed: src/components/**, tests/**
Forbidden: store changes, schema changes
DoD: Task movement with accessibility; smooth animations; batch operations; competitive interaction quality.
```

### Prompt-B26 (After Phase A Complete)

```
Task: Implement BYOS adapters that create unique market position.
Allowed: src/storage/**, src/domain/pack/**, tests/**
Forbidden: schema/API/crypto changes
DoD: Multi-provider support; migration tools; sync transparency; enterprise compliance; market differentiation.
```

---

## 30/60/90 Plan **[COMPETITIVE TIMELINE]**

- **Next 30 days**: **Phase A** - Task UI competitive with Linear/Todoist/Trello
- **Next 60 days**: **Phase B** - BYOS + enterprise features create unique market position
- **90+ days**: **Phase C** - Integration ecosystem + analytics create switching costs

---

## Competitive Positioning Matrix

| **Feature Category** | **Linear**        | **Todoist**       | **Asana**         | **Trello**        | **SparkTasks Advantage**          |
| -------------------- | ----------------- | ----------------- | ----------------- | ----------------- | --------------------------------- |
| **Speed**            | ✅ Excellent      | ➖ Good           | ➖ Slow           | ➖ Adequate       | **Phase A+C: Speed leadership**   |
| **Natural Language** | ➖ Limited        | ✅ Excellent      | ➖ Basic          | ➖ None           | **Phase A: Match Todoist**        |
| **Storage Choice**   | ❌ Vendor lock-in | ❌ Vendor lock-in | ❌ Vendor lock-in | ❌ Vendor lock-in | **Phase B: Unique BYOS**          |
| **Privacy**          | ➖ Cloud-only     | ➖ Cloud-only     | ➖ Cloud-only     | ➖ Cloud-only     | **Phase B: Local-first + E2EE**   |
| **Enterprise**       | ✅ Strong         | ➖ Limited        | ✅ Excellent      | ➖ Basic          | **Phase B: Competitive**          |
| **Integrations**     | ✅ Good           | ➖ Limited        | ✅ Excellent      | ✅ Good           | **Phase C: Ecosystem hub**        |
| **Analytics**        | ➖ Basic          | ➖ Basic          | ✅ Good           | ➖ None           | **Phase C: Privacy-first leader** |

---

## Status Ledger **[COMPETITIVE PRIORITIES]**

- **Phase A**: A1 **URGENT** (competitive task UI); A2-A5 **sequential** (interaction quality, a11y leadership, search excellence, performance)
- **Phase B**: **Market differentiation** via BYOS + enterprise + transparency
- **Phase C**: **Ecosystem dominance** via integrations + analytics + automation

---

## Crisp Confirmation

**Ready to begin A1 with competitive enhancement focus? This plan positions SparkTasks as the privacy-first, storage-neutral alternative that exceeds existing solutions on speed, accessibility, and user choice.**
