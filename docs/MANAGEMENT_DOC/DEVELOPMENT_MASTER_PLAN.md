# SparkTasks Development Master Plan

## Strategic Build Governance for Vibe-Driven Development

> **A step-by-step prompt-by-prompt guide for building SparkTasks safely, based on 30+ years of SaaS architecture experience and the PRD requirements**

---

## Executive Summary

This master plan provides a systematic approach to building SparkTasks as a storage-neutral, local-first task platform. The plan is designed for vibe-driven development with clear prompts, safety gates, and measurable outcomes at each step.

### Core Principles:

1. **Security-First Architecture** - Every component designed with E2EE and data isolation
2. **Performance Budgets** - CI-enforced performance gates at every commit
3. **BYOS Compliance** - Storage-neutral design from day one
4. **Incremental Validation** - Each feature validated against PRD KPIs before proceeding

---

## Phase 1: Foundation & Core Infrastructure (Days 1-20)

### 1.1 Project Foundation Setup

**Prompt:** "Set up the foundational architecture for SparkTasks with TypeScript, React 18, Vite, and enterprise-grade tooling including ESLint, Prettier, and comprehensive testing infrastructure."

**Deliverables:**

- ✅ Project structure with clean separation of concerns
- ✅ TypeScript configuration with strict type checking
- ✅ ESLint + Prettier with React/TypeScript/Tailwind rules
- ✅ Vitest + Playwright testing infrastructure
- ✅ CI/CD pipeline with performance budgets

**Success Criteria:**

- Build time < 30 seconds
- Bundle size < 250KB gzipped (enforced in CI)
- Zero linting warnings
- 100% type coverage

### 1.2 Core UI System & Design Tokens

**Prompt:** "Create a minimal, accessible UI component system using Tailwind CSS with SparkTasks brand colors, focusing on Today/Later/Done views and quick-add functionality. Implement semantic HTML with focus management and ARIA compliance."

**Deliverables:**

- Design token system (colors, typography, spacing)
- Base components: Button, Card, Input, Layout
- Focus management utilities
- Responsive grid system for Today/Later/Done columns
- Accessibility testing suite

**Success Criteria:**

- WCAG 2.1 AA compliance
- Keyboard navigation 100% functional
- Mobile-responsive design tested on 3 devices
- Component bundle < 50KB

### 1.3 Local Storage & State Management Foundation

**Prompt:** "Implement Zustand state management with persistent storage capabilities, designed for local-first architecture. Include state hydration, error boundaries, and data migration patterns."

**Deliverables:**

- Zustand store architecture
- Local storage persistence layer
- State hydration and error recovery
- Data migration framework
- State devtools integration

**Success Criteria:**

- State persistence works offline
- Hydration time < 100ms for 1k tasks
- Error recovery handles corrupted state
- Migration system supports schema changes

---

## Phase 2: Core Task Management (Days 21-35)

### 2.1 Task Data Model & JSONL Architecture

**Prompt:** "Design and implement the task data model using event-sourced architecture with JSONL files. Create the task entity with ID, title, status, due date, assignee, and metadata. Implement append-only event logging for audit trails."

**Deliverables:**

- Task type definitions with Zod validation
- Event-sourced task mutations
- JSONL read/write utilities
- Task state derivation from events
- Schema versioning system

**Success Criteria:**

- 100% type safety for task operations
- Event replay reconstructs state correctly
- JSONL files are human-readable
- Schema validation catches corrupt data

### 2.2 Today/Later/Done Views

**Prompt:** "Build the core Today, Later, and Done task views with drag-and-drop functionality, keyboard shortcuts, and virtualized lists for performance. Implement the Snooze feature as a core workflow."

**Deliverables:**

- Three-column layout with responsive design
- Drag-and-drop task movement
- Keyboard shortcuts (j/k navigation, s for snooze)
- Virtual scrolling for 10k+ tasks
- Snooze date picker with smart defaults

**Success Criteria:**

- 60 FPS scrolling with 10k tasks
- Drag-and-drop works on mobile
- Keyboard shortcuts accessible
- Snooze workflow < 3 clicks

### 2.3 Quick-Add with NLP Parsing

**Prompt:** "Implement intelligent quick-add functionality that parses natural language input to extract due dates, assignees, and priority. Include keyboard shortcuts and smart suggestions."

**Deliverables:**

- NLP parser for due dates ("tomorrow", "next Friday")
- @mention parsing for assignees
- Priority detection (urgent, high, normal, low)
- Autocomplete for existing assignees
- Keyboard shortcut activation (Cmd+K)

**Success Criteria:**

- 90% accuracy on common date formats
- Parse time < 50ms
- Fallback for unparseable input
- ≥50% of tasks created via quick-add (target KPI)

---

## Phase 3: BYOS Storage Layer (Days 36-50)

### 3.1 Storage Abstraction Layer

**Prompt:** "Design a storage abstraction layer that supports multiple backends (Google Drive, Dropbox, local file system) with a common interface. Include error handling, rate limiting, and exponential backoff."

**Deliverables:**

- Storage interface definition
- Error handling and retry logic
- Rate limiting with exponential backoff
- Connection status monitoring
- Storage health dashboard

**Success Criteria:**

- Interface supports all required operations
- Graceful degradation on network issues
- Rate limit compliance (no API violations)
- Status visible to users

### 3.2 Google Drive Integration

**Prompt:** "Implement Google Drive storage adapter using the Drive API v3. Support both App Folder and user-selected folder modes. Handle authentication, file operations, and delta sync with conflict detection."

**Deliverables:**

- OAuth 2.0 authentication flow
- Drive API integration with proper scopes
- File upload/download with chunking
- Delta sync using change tokens
- Conflict detection and resolution

**Success Criteria:**

- Authentication flow < 60 seconds
- File sync reliability ≥99%
- Delta sync detects changes within 30 seconds
- No data loss during conflicts

### 3.3 Export/Import with .sparkpack

**Prompt:** "Create the .sparkpack export/import system with dry-run diffs and rollback capabilities. Include schema validation and data integrity checks."

**Deliverables:**

- ZIP-based .sparkpack format
- Dry-run diff preview
- Import validation and sanitization
- Rollback mechanism
- Progress indicators for large imports

**Success Criteria:**

- Round-trip accuracy ≥99% (target KPI)
- Export/import works offline
- Dry-run shows accurate preview
- Rollback restores previous state

---

## Phase 4: Local Search & Performance (Days 51-60)

### 4.1 Local Full-Text Search

**Prompt:** "Implement local full-text search using SQLite WASM with FTS5 for sub-200ms search performance at 1k tasks. Include search indexing, query optimization, and result ranking."

**Deliverables:**

- SQLite WASM integration
- FTS5 index configuration
- Search query parser
- Result ranking algorithm
- Index rebuilding from JSONL

**Success Criteria:**

- p95 search time < 200ms @ 1k tasks (target KPI)
- Search covers task content and metadata
- Index corruption recovery works
- Fuzzy search handles typos

### 4.2 Performance Monitoring & Budgets

**Prompt:** "Implement performance monitoring with CI-enforced budgets for bundle size, runtime performance, and memory usage. Include Web Vitals tracking and regression detection."

**Deliverables:**

- Bundle size monitoring
- Runtime performance metrics
- Memory usage tracking
- Web Vitals collection
- CI performance gates

**Success Criteria:**

- Core bundle < 250KB gzipped (enforced)
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Memory usage stable during long sessions
- Performance regressions block merges

---

## Phase 5: Collaboration & Sync (Days 61-75)

### 5.1 CRDT Implementation for Notes

**Prompt:** "Implement CRDT (Conflict-free Replicated Data Types) for task notes and comments using Yjs or Automerge. Handle offline edits and automatic conflict resolution."

**Deliverables:**

- CRDT library integration
- Notes/comments editing
- Offline change tracking
- Automatic merge resolution
- Conflict visualization for users

**Success Criteria:**

- Offline edits merge correctly
- No data loss during conflicts
- Merge time < 500ms
- Conflict UI helps users understand changes

### 5.2 Comments and @Mentions

**Prompt:** "Add commenting system with @mentions, notifications, and threading. Integrate with the CRDT system for conflict-free collaboration."

**Deliverables:**

- Comment threading UI
- @mention autocomplete
- Notification system
- Activity feed
- Email/Slack digest integration

**Success Criteria:**

- @mentions trigger notifications within 5 minutes
- Comment threads load < 100ms
- Activity feed shows relevant updates
- Digest action rate ≥40% (target KPI)

---

## Phase 6: Insights & Automation (Days 76-90)

### 6.1 Explainable Insights Dashboard

**Prompt:** "Build analytics dashboard showing throughput, cycle time, and aging WIP with drill-down capabilities. Each metric should link to the underlying events that generated it."

**Deliverables:**

- Metrics calculation engine
- Interactive dashboard with charts
- Drill-down to source events
- Trend analysis over time
- Export capabilities for reporting

**Success Criteria:**

- Dashboard loads < 2 seconds
- Metrics update in real-time
- Drill-down shows relevant events
- Insights drive user action

### 6.2 Accountable Automation

**Prompt:** "Implement small, auditable automations like aging WIP alerts and unblock summaries. Each automation must show its reasoning and link to triggering events."

**Deliverables:**

- Rule engine for automations
- Aging WIP detection
- Unblock summary generation
- Audit trail for all automations
- User-configurable thresholds

**Success Criteria:**

- False positive rate < 5% (target KPI)
- All alerts link to triggering events
- Users understand automation reasoning
- Automation adoption without training

---

## Phase 7: Security & Trust (Days 91-120)

### 7.1 End-to-End Encryption

**Prompt:** "Implement E2EE for task content using user-controlled keys. Include key generation, secure storage, and key recovery mechanisms."

**Deliverables:**

- Client-side encryption implementation
- Key generation and storage
- Recovery key system
- Encryption for all sensitive data
- Security audit preparation

**Success Criteria:**

- All task content encrypted at rest
- Keys never leave client control
- Recovery system prevents data loss
- Security audit passes

### 7.2 Cross-Workspace Isolation

**Prompt:** "Implement strict workspace isolation to prevent data leakage between projects. Include access controls, permission systems, and audit logging."

**Deliverables:**

- Workspace boundary enforcement
- Permission system implementation
- Access control middleware
- Audit log generation
- Security testing suite

**Success Criteria:**

- Zero cross-workspace data access
- Permissions enforced at API level
- Audit logs capture all access
- Penetration testing passes

---

## Phase 8: Team Features & Polish (Days 121-150)

### 8.1 Team Management & OIDC

**Prompt:** "Add team management features with OIDC/SSO integration, user roles, and workspace administration."

**Deliverables:**

- OIDC authentication integration
- Role-based access control
- Team invitation system
- Workspace administration UI
- Usage analytics for admins

**Success Criteria:**

- SSO login < 30 seconds
- Role permissions enforced correctly
- Team onboarding < 5 minutes
- Admin features provide value

### 8.2 Integration Ecosystem

**Prompt:** "Build integration points for GitHub, Calendar, Slack, and VS Code. Include webhook system and typed SDK for third-party developers."

**Deliverables:**

- GitHub issue synchronization
- Calendar integration for due dates
- Slack notifications and commands
- VS Code extension for quick-add
- Webhook system with SDK

**Success Criteria:**

- Integrations work reliably
- API rate limits respected
- SDK enables third-party development
- Integration setup < 10 minutes

---

## Safety Gates & Validation Framework

### 🛡️ Anti-Drift Enforcement System

**Pre-Commit Hooks (Automated):**

- Lint and format validation (block commit if errors)
- Bundle size budget check (fail if exceeded)
- Test coverage threshold enforcement (≥90%)
- SSOT drift detection (compare against reference docs)
- Dependency audit (block unauthorized additions)

**Commit Message Validation:**

```
Format: [scope]: description
Required: Performance impact, test results, SSOT alignment
Example: [task-mgmt]: Add snooze feature (+2KB bundle, all tests pass, PRD-aligned)
```

**Branch Protection Rules:**

- No direct commits to main/develop
- Required status checks: tests, lint, budgets, security scan
- SSOT validation must pass
- Minimum 1 reviewer with domain expertise

### Continuous Validation Checkpoints

**Every Commit (Automated CI):**

- Performance budgets (bundle size, runtime, memory)
- Test suite execution (unit + integration)
- Security vulnerability scan
- SSOT drift detection against reference documents
- Accessibility regression tests (if UI changed)
- API contract validation (if backend changed)

**Daily Automated Checks:**

- Dependency audit for vulnerabilities
- Performance trend analysis
- Test flakiness detection
- Bundle size trend monitoring
- SSOT document synchronization

**Weekly Reviews (Human + Automated):**

- KPI tracking against PRD targets
- User feedback analysis and prioritization
- Performance trend analysis and optimization needs
- Security vulnerability assessment and remediation
- Technical debt assessment and prioritization
- SSOT document accuracy verification

**Phase Gate Reviews (Human Approval Required):**

- Feature completeness validation against PRD
- KPI achievement verification (gate blocking)
- Technical debt assessment and paydown plan
- Architecture review and alignment check
- Security audit and penetration testing
- SSOT governance and change management review

### Kill Criteria (Automatic Development Halt)

**Performance Violations:**

- If p95 search time ≥200ms @ 1k tasks → halt feature development, optimize performance
- If bundle size >250KB gzipped → block all merges until optimization
- If memory leaks detected → immediate investigation and fix required
- If Web Vitals regression >10% → rollback and investigation

**Product KPI Failures:**

- If BYOS adoption <20% → pause expansion, fix storage UX
- If D7 retention <35% → focus on core flow, no new features
- If round-trip accuracy <95% → block releases, fix data integrity
- If TTFT >60 seconds → emergency UX optimization required

**Quality Gate Failures:**

- Test coverage drops below 90% → block merges until coverage restored
- Lint errors introduced → automatic commit rejection
- Security vulnerabilities introduced → immediate patch required
- Accessibility regressions → block release until fixed

**SSOT Drift Detected:**

- Unauthorized changes to TECH_STACK.md → revert and process through governance
- API contract violations → block deployment until contracts updated
- Workspace structure violations → immediate correction required
- Dependency drift from approved list → security review and approval needed

### Drift Prevention Measures

**Code Change Constraints:**

```yaml
# .drift-safe-rules.yml
max_files_per_commit: 5
max_lines_per_file_change: 200
prohibited_patterns:
  - 'TODO: remove this hack'
  - 'temporary fix'
  - 'will refactor later'
required_approvals:
  SSOT_changes: [tech-lead, product-lead]
  security_changes: [security-team]
  performance_changes: [performance-lead]
```

**Automated Drift Detection:**

- File change pattern analysis (prevent mass refactoring)
- Import/dependency change monitoring
- Bundle composition change detection
- API surface change validation
- Configuration drift assessment

**Human Oversight Triggers:**

- Changes affecting >3 files → senior review required
- Performance budget impact >5% → performance team review
- New dependencies → security and architecture review
- SSOT document changes → governance committee approval
- Feature flag changes → product team approval

### 🚨 Common Drift Patterns & Prevention

**Pattern 1: Scope Creep During Implementation**

```
❌ BAD: "While adding search, I also refactored the task model and updated styling"
✅ GOOD: "Added search functionality only, preserved existing task model exactly"

Prevention:
- Single-purpose commits
- Clear scope definition in prompts
- Pre-commit scope validation
```

**Pattern 2: "Helpful" Refactoring**

```
❌ BAD: "I cleaned up the code while implementing the feature"
✅ GOOD: "Implemented feature with minimal changes, no refactoring"

Prevention:
- Explicit "no cleanup" instructions
- Separate refactoring stories
- Automated detection of unrelated changes
```

**Pattern 3: Dependency Drift**

```
❌ BAD: "I updated React to the latest version to fix the bug"
✅ GOOD: "Fixed bug within current dependency constraints"

Prevention:
- Lock file monitoring
- Dependency change approval process
- Automated dependency audit
```

**Pattern 4: Configuration Creep**

```
❌ BAD: "I tweaked the bundle config to make builds faster"
✅ GOOD: "Used existing build configuration unchanged"

Prevention:
- Configuration change detection
- Separate infrastructure stories
- Explicit approval for config changes
```

**Pattern 5: SSOT Violations**

```
❌ BAD: "I updated the tech stack while implementing auth"
✅ GOOD: "Implemented auth within approved tech stack constraints"

Prevention:
- SSOT validation in CI
- Governance approval for SSOT changes
- Clear escalation paths for constraints
```

**Drift Detection Automation:**

```bash
# Pre-commit hook example
#!/bin/bash
echo "🛡️ Checking for drift..."

# Bundle size check
if [ $(du -k dist/bundle.js | cut -f1) -gt 250 ]; then
  echo "❌ Bundle size exceeded (>250KB)"
  exit 1
fi

# Dependency check
if git diff HEAD~1 --name-only | grep -q "package.json\|package-lock.json"; then
  echo "⚠️ Dependency changes detected - approval required"
  exit 1
fi

# SSOT change check
if git diff HEAD~1 --name-only | grep -q "TECH_STACK.md\|API_CONTRACTS.md"; then
  echo "⚠️ SSOT changes detected - governance approval required"
  exit 1
fi

echo "✅ No drift detected"
```

---

## Risk Mitigation Strategies

### Technical Risks

1. **Storage API Changes:** Maintain adapter abstraction, implement graceful fallbacks
2. **Performance Degradation:** Enforce CI budgets, monitor Web Vitals continuously
3. **Data Corruption:** JSONL append-only design, checksums, auto-recovery
4. **Security Vulnerabilities:** Regular audits, dependency scanning, penetration testing

### Product Risks

1. **Feature Creep:** Additive-only flags, performance budget enforcement
2. **Poor UX:** User testing every 2 weeks, dogfooding internally
3. **Integration Failures:** Circuit breakers, graceful degradation
4. **Compliance Issues:** Legal review for GDPR, security audit for SOC 2

---

## Drift-Safe Development Framework

### 🛡 Drift‑Safe Coding Instruction Template

**MANDATORY HEADER FOR ALL DEVELOPMENT TASKS:**

```
🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks (v2.1)

Task: <exact change description>
Allowed paths: <e.g., src/components/**, src/stores/**, src/utils/**>
Forbidden paths (SSOT & Secrets): docs/**, .vscode/**, *.config.*, package*.json, TECH_STACK.md, API_CONTRACTS.md
Output format: **Unified git diff only** (no prose, no code fences, no logs)
```

**Core Principle:** Apply only the explicitly described change. If the change cannot be completed within allowed paths or requires broader edits, **stop and return one clarifying question** instead of proceeding.

**Non-Negotiable Rules:**

1. **Diff-Only & Surgical**
   - Show only the minimal diff — **no full-file rewrites** unless strictly necessary
   - Preserve all unaffected lines and whitespace exactly
   - Keep diffs under ~200 lines when possible; if more required, **stop and ask**

2. **No Collateral Edits**
   - Don't rename, reformat, reorder imports, alter dependencies, or "drive-by" refactor
   - No touching unrelated code, comments, or documentation
   - No "helpful" cleanup or optimization

3. **SSOT & Contract Protection**
   - Do **not** modify public APIs, feature flags, error codes, schema, budgets, or dependency ledgers unless explicitly instructed
   - Never touch TECH_STACK.md, API_CONTRACTS.md, WORKSPACE_RULES.md without governance approval
   - Check against forbidden paths before making any changes

4. **Business-Secret Guardrails**
   - Do **not** touch forbidden paths (docs/MANAGEMENT_DOC/**, pricing/**, etc.)
   - Never add secrets, API keys, or hardcoded credentials
   - No bypassing rate limits, authentication flows, or E2EE behavior
   - No weakening security controls without explicit approval

5. **Code Quality Standards**
   - No placeholders, TODOs, `any` types, commented-out blocks, unused vars/exports
   - Keep TypeScript types accurate and strict
   - No new dependencies without explicit approval
   - Don't modify package.json or lockfiles unless requested

6. **Output Contract**
   - **Print only a valid unified git diff** with real file paths
   - No explanations, commands, screenshots, or extra text
   - If UI components touched, include accessibility validation

**Definition of Done (ALL must pass):**

```bash
✅ Type checks: npm run type-check (no errors)
✅ Tests: npm test (no failures, no snapshot updates unless asked)
✅ Build: npm run build (successful)
✅ Lint: npm run lint (zero warnings on affected files only)
✅ Format: npm run format:check (all affected files formatted)
✅ Bundle size: No regression beyond established budgets
✅ Accessibility: If UI touched, keyboard/focus/ARIA validation passes
```

**Commit Hygiene:**

- Format: `feat|fix|refactor(scope): short rationale`
- Example: `feat(task-mgmt): add snooze feature (+2KB bundle, PRD-aligned)`
- Atomic commit mapped to single issue/story

**Drift Confirmation:**

- Compare changed files against SSOT documents
- Report any unrequested variance before merge
- Validate changes align with PRD requirements

### Feature Development Prompt Template

```
🛡 DRIFT-SAFE CODING — SparkTasks Feature Implementation

🎯 TASK: [exact change description]
📁 ALLOWED PATHS: src/components/**, src/stores/**, src/utils/**, src/shared/**
🚫 FORBIDDEN PATHS: docs/**, .vscode/**, *.config.*, package*.json, TECH_STACK.md
📤 OUTPUT: **Unified git diff only** (no explanations)

📋 REQUIREMENTS: [specific requirements from PRD]

⚠️ CONSTRAINTS:
- Bundle size impact < [X] KB (enforced in CI)
- Performance: [specific metrics - p95 times, FPS targets]
- Security: [security considerations - E2EE, input validation]
- Accessibility: WCAG 2.1 AA compliance mandatory

✅ DEFINITION OF DONE:
- npm run type-check (no errors)
- npm test (no failures)
- npm run build (successful)
- npm run lint (zero warnings on affected files)
- npm run format:check (all affected files formatted)
- Bundle budget respected
- If UI: a11y validation passes

🛡️ STOP CONDITIONS:
- If change requires forbidden paths → ask clarifying question
- If scope exceeds 200 lines → ask for breakdown
- If new dependencies needed → request explicit approval

❌ FORBIDDEN:
- Full file rewrites
- Collateral edits or cleanup
- New TODOs or any types
- Modifying unrelated imports
- Touching SSOT documents
```

### Code Review Prompt Template

```
🔍 DRIFT-SAFE CODE REVIEW — SparkTasks

📤 REVIEW FORMAT: **Pass/Fail decision with specific issues listed**

✅ MANDATORY CHECKS:

1. **Scope Compliance:**
   - [ ] Change matches exactly what was requested
   - [ ] No collateral edits or cleanup
   - [ ] Stayed within allowed paths
   - [ ] No SSOT documents modified

2. **Quality Gates:**
   - [ ] TypeScript: no errors, strict types maintained
   - [ ] Tests: all pass, new code covered
   - [ ] Build: successful with no warnings
   - [ ] Lint: zero warnings on affected files
   - [ ] Format: all files properly formatted

3. **Performance & Security:**
   - [ ] Bundle size budget respected
   - [ ] No performance regressions
   - [ ] No security vulnerabilities introduced
   - [ ] Accessibility requirements met (if UI)

4. **Business Alignment:**
   - [ ] Changes align with PRD requirements
   - [ ] No feature creep or scope expansion
   - [ ] Proper error handling and edge cases

⚠️ AUTO-REJECT CONDITIONS:
- Bundle size budget exceeded
- Test failures or coverage decrease
- Lint errors present
- Unauthorized SSOT changes
- Security vulnerabilities detected
- Accessibility regressions

🔄 FEEDBACK FORMAT:
Pass/Fail: [decision]
Issues: [numbered list of specific problems]
Required Actions: [specific fixes needed]
```

### Integration Testing Prompt Template

```
🧪 DRIFT-SAFE INTEGRATION TEST — SparkTasks

📤 OUTPUT: **Test results summary with pass/fail status**

🔌 CORE VALIDATION POINTS:

1. **Functional Integration:**
   - [ ] Feature works end-to-end as specified
   - [ ] Error handling with exponential backoff
   - [ ] Rate limit compliance (no API violations)
   - [ ] Data integrity: round-trip accuracy ≥99%

2. **Performance Benchmarks:**
   - [ ] Bundle size impact measured and within budget
   - [ ] Runtime performance: p95 < target times
   - [ ] Memory usage: no leaks during extended sessions
   - [ ] Network optimization: minimal request overhead

3. **Cross-Platform Compatibility:**
   - [ ] Chrome, Firefox, Safari functionality
   - [ ] Mobile responsive behavior
   - [ ] Offline functionality and sync recovery
   - [ ] Keyboard navigation and accessibility

4. **Security Validation:**
   - [ ] Input sanitization and validation
   - [ ] Authentication flow integrity
   - [ ] Data encryption maintained
   - [ ] No credential leakage in logs

⚠️ FAILURE CONDITIONS:
- Any functional test fails → block merge
- Performance regression detected → investigate
- Security scan reports issues → immediate fix
- Accessibility audit fails → block release

✅ SIGN-OFF REQUIREMENTS:
- [ ] All integration tests pass
- [ ] Performance budgets confirmed
- [ ] Security scan clean
- [ ] SSOT alignment verified
```

### Emergency Hotfix Prompt Template

```
🚨 DRIFT-SAFE EMERGENCY HOTFIX — SparkTasks

📤 OUTPUT: **Minimal git diff with rollback plan**

⚡ CRITICAL CONSTRAINTS:
- Absolute minimal surface area change
- No feature additions or improvements
- Preserve ALL existing behavior except the specific bug
- Fast-track testing on critical paths only

🛡️ ENHANCED DRIFT PROTECTION:
- Change ONLY the minimum code required
- Document exact scope and rationale
- Prepare rollback plan before deployment
- Post-fix validation of unchanged functionality

📋 ACCELERATED VALIDATION:
1. [ ] Targeted tests for the specific fix
2. [ ] Smoke tests for critical user journeys
3. [ ] Performance impact assessment (must be neutral)
4. [ ] Security implications review

✅ APPROVAL CHAIN:
- [ ] Engineering Lead approval
- [ ] Security review (if auth/data changes)
- [ ] Product sign-off (if user-facing)
- [ ] Operations deployment approval

🔄 ROLLBACK PLAN:
- Immediate rollback procedure documented
- Monitoring alerts configured
- Success criteria defined (SLA restoration)
```

```
🎯 CONTEXT: Building [feature] for SparkTasks, a storage-neutral task platform

📋 REQUIREMENTS: [specific requirements from PRD]

⚠️ CONSTRAINTS:
- Bundle size impact < [limit] KB
- Performance: [specific metrics - p95 times, FPS targets]
- Security: [security considerations - E2EE, input validation]
- Accessibility: WCAG 2.1 AA compliance mandatory
- SSOT Compliance: Check TECH_STACK.md, API_CONTRACTS.md alignment

✅ SUCCESS CRITERIA: [measurable outcomes]

🏗️ ARCHITECTURE: [integration points and dependencies]

🛡️ DRIFT-SAFE RULES:
- Implement ONLY the specified feature
- Preserve all existing functionality exactly
- No refactoring or cleanup unless explicitly requested
- All tests must pass before commit
- Bundle size budget must be respected
- Lint/format only affected files
```

### Code Review Prompt Template

```
🔍 DRIFT-SAFE CODE REVIEW CHECKLIST:

✅ Functional Requirements:
1. Feature implements exactly what was specified
2. No unrelated changes or "improvements"
3. Existing functionality preserved unchanged

✅ Quality Gates:
1. Performance impact on bundle size and runtime
2. Security implications and data handling
3. Accessibility compliance (keyboard, focus, ARIA)
4. Type safety and error handling
5. Test coverage for new code paths

✅ SSOT Alignment:
1. Changes align with PRD requirements
2. No conflicts with TECH_STACK.md decisions
3. API contracts maintained in API_CONTRACTS.md
4. Workspace structure follows WORKSPACE_RULES.md

✅ Technical Hygiene:
1. Code follows established patterns
2. No introduction of new dependencies without approval
3. Error handling and edge cases covered
4. Documentation updated if public APIs changed

⚠️ REJECT IF:
- Bundle size budget exceeded
- Tests failing or coverage decreased
- Lint errors present
- SSOT conflicts detected
- Unrelated changes included
```

### Integration Testing Prompt Template

```
🧪 COMPREHENSIVE INTEGRATION TEST PROTOCOL:

🔌 Core Integration Points:
1. Error handling and retry logic with exponential backoff
2. Rate limit compliance (respect API quotas)
3. Data integrity and round-trip accuracy ≥99%
4. Offline functionality and sync recovery
5. Cross-browser compatibility (Chrome, Firefox, Safari)
6. Performance under load (1k+ tasks)

🛡️ Security Validation:
1. Input sanitization and validation
2. Authentication flow integrity
3. Data encryption in transit and at rest
4. No credential leakage in logs or errors

📊 Performance Benchmarks:
1. Bundle size impact measurement
2. Runtime performance profiling
3. Memory usage tracking
4. Network request optimization

⚠️ Failure Conditions:
1. Any test failure blocks merge
2. Performance regression detected
3. Security vulnerability introduced
4. SSOT drift identified

✅ Sign-off Required:
- All integration tests pass
- Performance budgets respected
- Security scan clean
- SSOT alignment confirmed
```

### 🎯 Prompt Engineering Guidelines for Developers

**Quick Reference One-Liners (Copy-Paste Ready):**

**Bugfix (Ultra-Short):**

```
Fix `<bug>` in `src/**`. Diff-only; no collateral edits; no new deps.
Ensure type-check, tests, build, lint+prettier (affected files) pass.
If scope insufficient, ask one question.
```

**Feature (MVP):**

```
Implement `<feature>` minimally within `src/components/**`.
Keep APIs/SSOT unchanged. Add tests. Pass full checks.
Output **diff only**.
```

**Refactor (Scoped):**

```
Refactor `<unit>` for `<reason>` within `src/utils/**`.
No behavior change; no API changes; tests updated if needed.
Pass checks. **Diff only**.
```

**UI Component:**

```
Create `<component>` in `src/components/` with Tailwind CSS.
WCAG 2.1 AA compliant, keyboard navigation, <2KB bundle impact.
Tests included. **Diff only**.
```

**Performance Optimization:**

```
Optimize `<specific area>` for `<metric>` within `src/**`.
Maintain exact functionality. Measure before/after.
Pass performance budgets. **Diff only**.
```

**Effective Prompt Structure:**

```
🎯 OBJECTIVE: [Single, specific goal]
📋 SCOPE: [Exact boundaries - what to change and what NOT to change]
⚠️ CONSTRAINTS: [Technical limits, performance budgets, security requirements]
🛡️ DRIFT PROTECTION: [Specific things to preserve unchanged]
✅ VALIDATION: [How to verify success]
❌ ANTI-PATTERNS: [Common mistakes to avoid]
```

**Example High-Quality Prompt:**

```
🎯 OBJECTIVE: Add keyboard shortcut 'j/k' for task navigation in Today view

📋 SCOPE:
- Modify src/components/Today.tsx only
- Add keyboard event listeners for j/k keys
- Update focus styling for selected task
- DO NOT change: task data model, other views, styling system

⚠️ CONSTRAINTS:
- Bundle size impact < 2KB
- Accessibility: screen reader compatible
- Performance: event handling < 16ms
- Must work with existing drag-and-drop

🛡️ DRIFT PROTECTION:
- Preserve all existing keyboard shortcuts
- Don't modify global event handlers
- Keep existing CSS classes unchanged
- Don't alter task state management

✅ VALIDATION:
- All existing tests pass
- New keyboard tests added and passing
- No bundle size regression
- Accessibility audit clean

❌ ANTI-PATTERNS:
- Don't refactor unrelated components
- Don't change import statements unnecessarily
- Don't modify shared utilities
- Don't update documentation unless API changed
```

**Prompt Quality Checklist:**

- [ ] Single, measurable objective
- [ ] Clear scope boundaries (what changes, what doesn't)
- [ ] Specific constraints and budgets
- [ ] Explicit drift protection rules
- [ ] Validation criteria defined
- [ ] Anti-patterns identified
- [ ] Output format specified (diff-only)
- [ ] Stop conditions defined

---

---

## Success Metrics Dashboard

### Development Velocity

- Features delivered per sprint
- Bug resolution time
- Code review cycle time
- CI/CD pipeline success rate

### Quality Metrics

- Test coverage percentage
- Performance budget compliance
- Security scan results
- Accessibility audit scores

### Product KPIs (from PRD)

- TTFT (Time to First Task) < 60s
- D7 retention ≥ 35%
- BYOS adoption ≥ 60%
- Round-trip accuracy ≥ 99%
- p95 search time < 200ms @ 1k tasks

### User Experience

- Task creation via quick-add ≥ 50%
- Digest action rate ≥ 40%
- Support ticket volume
- User satisfaction scores

---

## Conclusion

This master plan provides a structured approach to building SparkTasks while maintaining safety, performance, and alignment with business objectives. Each phase builds upon the previous one, with clear validation gates and success criteria.

The prompt-driven approach ensures that development stays focused on delivering value while maintaining the technical excellence required for a production SaaS platform.

**Remember:** The goal is not just to build features, but to build a platform that users trust with their data and that scales sustainably as a business.
