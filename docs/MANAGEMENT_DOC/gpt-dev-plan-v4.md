# GPT Development Plan v4 - SlackTasks

_Strategic roadmap for next-generation task management platform_

---

## 🎯 Executive Summary

**Mission**: Ship A5 (performance + responsive), add one AI-lite feature behind a flag, and surface BYOS/crypto credibility signals — without changing backend, configs, or store shape.

**Timeline**: 6 weeks, thin-slice delivery model
**Philosophy**: Implementation depth over breadth, Linear-level UI quality for task flows
**Strategic Position**: Freemium-first → Developer-lite → Enterprise (BYOS/transparency differentiators)

---

## 🛡️ ANTI-DRIFT PREPEND (v4 Umbrella)

```
ANTI-DRIFT PREPEND — GPT DEV PLAN v4

GOAL
- Ship A5 (perf+responsive), add one AI-lite feature behind a flag, and surface BYOS/crypto credibility signals — without changing backend, configs, or store shape.

ALLOWED
- src/components/** (new/edits)
- src/App.tsx
- index.css (styling only)
- test/**

FORBIDDEN
- SSOT/docs/configs/deps/backend/crypto changes
- Store shape/enum changes
- Parser/ranking/engine changes
- New dependencies or build config edits

IMMUTABLE CONSTRAINTS
- Preserve A1–A4 behaviors (a11y, keyboard, ARCHIVED semantics, search/quick-add wiring).
- DnD remains optional; keyboard + "Move to…" are canonical.
- Any AI is opt-in (feature flag) and reversible. No blocking flows depend on AI.

RELEASE GUARDS (v4 must)
- Perf sampler in dev records LCP/INP/CLS; lane switch shows no CLS spike.
- Mobile: 3→1 column with tabs; 44px touch targets; reduced-motion respected.
- If scopes UI exists, it passes through to existing engine only; else omit.
- AI-lite suggestions present only when flag on; no parser changes.
- BYOS/crypto surfaced as badges/tooltips (read-only), no new flows.
- All tests green on Chromium/WebKit/Firefox + mobile emulation.
```

---

## 📋 Strategic Decisions (Locked)

### 1. Reality vs. Vision: **Hybrid Approach**

- Complete A5 (performance + responsive) foundation
- Layer one AI-lite feature + credibility signals
- No backend churn, maintain current trajectory

### 2. UI Quality Bar: **Linear-level for task flows**

- Linear-level speed + keyboard shortcuts
- Notion-level richness deferred to later phases
- Professional polish without over-engineering

### 3. Crypto/BYOS: **Enterprise signals with light UI**

- Non-invasive UI badges ("Data location: BYOS", "Verifiable log enabled")
- No new crypto flows or backend changes
- Credibility positioning for enterprise conversations

### 4. AI-Native: **Plan surfaces + one small AI feature**

- Define integration points for future
- Ship "suggest tags/priority" behind feature flag
- Reversible, non-blocking implementation

### 5. Go-to-Market: **Freemium → Developer → Enterprise**

- Start with freemium adoption
- Minimal API hooks for developer engagement
- Enterprise positioning via BYOS + transparency

### 6. 220-LOC Budget: **Implementation depth over breadth**

- Thin slices with hard DoD + comprehensive tests
- Defer anything requiring new deps or configs

---

## 🗓️ 6-Week Roadmap

### **Week 1-2: A5 Foundation (Performance + Mobile)**

**Performance Monitoring**

- Implement performance sampler in development mode only
- Track LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)
- Ensure lane switching produces no CLS spikes (< 0.1 threshold)
- Add `window.__perf` dev-only global for debugging

**Mobile Responsiveness**

- Collapse 3-column layout to 1-column with tab navigation
- Implement touch-friendly UI (≥44px touch targets)
- Add swipe gestures for tab switching
- Respect `prefers-reduced-motion` for animations

**DoD Criteria:**

- [ ] Performance metrics captured in dev mode
- [ ] CLS < 0.1 during lane transitions
- [ ] Mobile layout collapses gracefully
- [ ] Touch targets meet accessibility standards
- [ ] Search and QuickAdd usable on mobile

**Tests Required:**

```
test/e2e/a5-performance-responsiveness.spec.ts
- Performance observer integration
- CLS measurement during lane operations
- Mobile viewport responsive behavior
- Touch target dimension validation
- Reduced motion compliance
```

### **Week 3: A4 Stability + Conditional Search Scopes**

**Search Enhancement (Conditional)**

- IF existing search engine accepts `status/tag/date` parameters
- THEN add UI pass-through filters (no new search logic)
- ELSE skip and maintain v4 schedule

**A4 Hardening**

- Maintain listbox ARIA compliance
- Preserve 150-250ms debounce timing
- Ensure `<mark>` highlights are XSS-safe (escaped content)

**DoD Criteria:**

- [ ] Scope filters pass through to existing engine (if supported)
- [ ] Search highlighting secure against injection
- [ ] Listbox navigation remains accessible
- [ ] Debounce performance maintained

**Tests Required:**

```
test/e2e/a4-search-stability.spec.ts
- Scope filter UI reflects in results (black-box)
- Highlight sanitization (no regex injection)
- ARIA compliance maintained
```

### **Week 4: AI-Lite Suggestions (Feature Flagged)**

**Smart Suggestions Panel**

- "Suggest tags/priority" on task creation
- Non-blocking suggestion panel with "Apply" action
- Updates form fields when accepted
- Live-region announcements for accessibility
- Complete feature flag integration

**Implementation Constraints**

- No changes to existing parser logic
- No new dependencies
- Fully reversible (flag off = no UI)
- Never blocks core task creation flows

**DoD Criteria:**

- [ ] Suggestions appear only when flag enabled
- [ ] Apply button updates form fields correctly
- [ ] Live-region announces suggestions applied
- [ ] Feature completely hidden when flag disabled
- [ ] No impact on core task creation performance

**Tests Required:**

```
test/e2e/ai-suggestions.spec.ts
- Flag on: suggestions present and functional
- Flag off: no AI UI elements visible
- Accessibility: live-region announcements
- Performance: no blocking of core flows
```

### **Week 5: BYOS/Crypto Credibility Signals**

**Sovereignty Indicators**

- Header badge: "Data: BYOS" with explanatory tooltip
- Task detail chip: "Verifiable log enabled"
- Accessible labels and descriptions
- No new navigation flows or backend integration

**Enterprise Positioning**

- Read-only credibility signals
- Educational tooltips explaining benefits
- Professional visual treatment
- Accessibility compliance

**DoD Criteria:**

- [ ] BYOS badge visible in header with tooltip
- [ ] Verifiable log chip on task details
- [ ] All elements properly labeled for screen readers
- [ ] No new flows or navigation added
- [ ] Tooltips explain sovereignty/transparency benefits

**Tests Required:**

```
test/e2e/credibility-signals.spec.ts
- Badge visibility and accessibility
- Tooltip content and interaction
- Role/label presence for screen readers
```

### **Week 6: Polish + UAT Hardening**

**Final Integration**

- Fix identified paper cuts
- Bundle size optimization
- Documentation finalization
- Test suite stabilization
- Cross-browser validation

**Quality Assurance**

- A/B test DnD vs keyboard/menu (keep DnD as enhancement)
- Performance regression testing
- Mobile device testing
- Accessibility audit completion

**DoD Criteria:**

- [ ] All tests pass on Chromium/WebKit/Firefox
- [ ] Mobile emulation testing complete
- [ ] Bundle size within acceptable limits
- [ ] Documentation updated
- [ ] No regressions in A1-A4 functionality

---

## 🔬 Comprehensive DoD Matrix

### **A5 Performance/Mobile**

| Requirement            | Test Coverage                     | Acceptance Criteria              |
| ---------------------- | --------------------------------- | -------------------------------- |
| Performance monitoring | `PerformanceObserver` integration | LCP/INP/CLS captured in dev      |
| Layout stability       | CLS measurement during operations | CLS < 0.1 on lane switch         |
| Mobile responsiveness  | Viewport testing                  | 3→1 column collapse              |
| Touch accessibility    | Touch target validation           | ≥44px interactive elements       |
| Motion respect         | Animation testing                 | `prefers-reduced-motion` honored |

### **A4 Stability Carry**

| Requirement        | Test Coverage               | Acceptance Criteria         |
| ------------------ | --------------------------- | --------------------------- |
| ARIA compliance    | Listbox navigation          | Screen reader compatibility |
| Search performance | Debounce timing             | 150-250ms response          |
| Highlight security | Sanitization testing        | No XSS via search terms     |
| Scope filtering    | Black-box result validation | UI passes through to engine |

### **AI-Lite Suggestions**

| Requirement           | Test Coverage           | Acceptance Criteria        |
| --------------------- | ----------------------- | -------------------------- |
| Feature flag control  | Flag on/off testing     | Complete UI toggle         |
| Suggestion generation | Mock suggestion testing | Panel appears with options |
| Form integration      | Apply button testing    | Fields update correctly    |
| Accessibility         | Live-region testing     | Announcements functional   |
| Non-blocking          | Core flow testing       | No interference with tasks |

### **BYOS/Crypto Signals**

| Requirement           | Test Coverage         | Acceptance Criteria    |
| --------------------- | --------------------- | ---------------------- |
| Badge visibility      | Header testing        | BYOS indicator present |
| Tooltip functionality | Interaction testing   | Educational content    |
| Accessibility         | Screen reader testing | Proper labels/roles    |
| Task integration      | Detail view testing   | Verifiable log chip    |
| Read-only nature      | Navigation testing    | No new flows added     |

---

## 🎯 MVP "Next-Gen" Checklist (v4 Complete)

✅ **Foundation (A1-A3)**

- Linear-level task interaction speed
- Professional keyboard shortcuts
- Accessible task management

✅ **Discovery (A4)**

- Search + QuickAdd UX with teaching hints
- Intelligent result highlighting
- Performance-optimized interactions

🎯 **Performance (A5)**

- Mobile responsive design
- Performance monitoring baseline
- Cross-device compatibility

🎯 **Intelligence (AI-Lite)**

- One tasteful AI affordance (flagged)
- Non-blocking suggestion system
- Accessibility-first implementation

🎯 **Credibility (Enterprise Signals)**

- Visible sovereignty indicators (BYOS)
- Transparency signals (crypto)
- Professional positioning

🎯 **Quality Assurance**

- Zero backend/config/deps changes
- Full test coverage (`test/**` green)
- Cross-browser compatibility

---

## ⚠️ Risk Management & Mitigations

### **Scope Creep Risks**

| Risk                 | Mitigation Strategy                         |
| -------------------- | ------------------------------------------- |
| Filter expansion     | Gate behind "engine supports / no new deps" |
| AI feature expansion | Keep opt-in, reversible, never blocking     |
| Export functionality | Defer unless existing hooks available       |

### **Technical Risks**

| Risk                      | Mitigation Strategy                   |
| ------------------------- | ------------------------------------- |
| CLS regressions on mobile | Reserve heights, E2E observer testing |
| Search highlight XSS      | Escape query, avoid innerHTML         |
| AI expectations inflation | Clear feature flag boundaries         |
| Performance degradation   | Continuous monitoring, rollback plan  |

### **Strategic Risks**

| Risk                             | Mitigation Strategy            |
| -------------------------------- | ------------------------------ |
| Enterprise positioning premature | Signals only, no new flows     |
| Developer adoption slow          | Minimal API hooks, clear value |
| Mobile experience subpar         | 44px targets, gesture support  |

---

## 📊 Success Metrics (v4)

### **Performance KPIs**

- LCP < 2.5s (75th percentile)
- INP < 200ms (75th percentile)
- CLS < 0.1 (all interactions)
- Mobile task completion rate > 90%

### **Feature Adoption**

- AI suggestions engagement (when enabled)
- Mobile usage percentage
- Search scope utilization
- Credibility signal recognition

### **Quality Indicators**

- Zero accessibility regressions
- Test coverage maintenance (>90%)
- Cross-browser compatibility (Chrome/Firefox/Safari)
- Bundle size within limits

---

## 🚀 Post-v4 Strategic Horizon

### **Phase 2 Candidates** (Future)

- Rich text editing (Notion-level)
- Full BYOS implementation
- Advanced AI features (ranking, NLP)
- Developer API expansion
- Enterprise admin features

### **Platform Evolution**

- Unified work platform (tasks + docs + collaboration)
- Data sovereignty implementation
- Cryptographic transparency system
- Progressive disclosure architecture

### **Market Expansion**

- Enterprise sales enablement
- Developer ecosystem growth
- Freemium conversion optimization
- Competitive differentiation

---

## 📝 Implementation Notes

### **Development Priorities**

1. **Week 1-2**: Foundation (A5) - non-negotiable quality bar
2. **Week 3**: Conditional features - maintain schedule discipline
3. **Week 4**: AI-lite - reversible, accessible implementation
4. **Week 5**: Credibility - professional positioning signals
5. **Week 6**: Polish - no compromises on quality

### **Quality Gates**

- All features behind appropriate controls (flags, conditions)
- Comprehensive test coverage before merge
- Accessibility compliance validation
- Performance regression prevention
- Cross-browser compatibility verification

### **Delivery Philosophy**

- Thin slices with hard DoD
- Implementation depth over breadth
- Strategic positioning without over-engineering
- User experience as competitive advantage

---

_Generated: August 18, 2025_
_Status: Ready for implementation_
_Next Review: Week 2 checkpoint_
