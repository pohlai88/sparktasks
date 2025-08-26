# MAPS v2.2 Human Interface Guidelines Checklist

> **Anti-Drift Enforcement Document** - Systematic audit checklist to maintain our Apple HIG-inspired design philosophy and prevent component degradation over time.

## Philosophy Core

- **Dark-First**: Default to dark mode, light as enhancement
- **Glass Vibrancy**: Surface blur only, never on content
- **8pt Grid**: Consistent spatial rhythm
- **Semantic Tokens**: No hardcoded values in components
- **Touch-First**: 44px minimum hit targets
- **WCAG AAA**: Accessibility as baseline, not afterthought

---

## 🎨 Visual Language & Typography

### Text Hierarchy

- [ ] **Text roles follow semantic system**: `text-headline`, `text-body`, `text-caption` (not hardcoded sizes)
- [ ] **Scale responsively**: Typography uses `clamp()` or responsive tokens across breakpoints
- [ ] **System font stack**: Includes `-apple-system` for SF Pro on Apple devices
- [ ] **Line length optimal**: 45-75 characters for body text, never exceeds 90
- [ ] **Zoom resilient**: No truncation/overlap at 125%+ browser zoom
- [ ] **Dark-first legibility**: Light text on dark backgrounds maintains readability

**Audit Command**: `grep -r "text-\[" src/` should return zero hardcoded text sizes

### Color System Compliance

- [ ] **Semantic color roles**: Uses `accent`, `surface`, `content` tokens (never raw hex)
- [ ] **Dark mode native**: `prefers-color-scheme: dark` as default state
- [ ] **Contrast compliance**: Text meets 7:1 (AAA) against backgrounds
- [ ] **Glass vibrancy safe**: Blur only on surfaces, content remains crisp
- [ ] **State feedback**: Success/warning/error use both color + iconography

**Audit Command**: `grep -r "#[0-9a-fA-F]" src/components/` should show minimal raw colors

---

## 📐 Layout & Spatial System

### Grid & Spacing

- [ ] **8pt grid adherence**: All spacing multiples of 8px (`space-2`, `space-4`, etc.)
- [ ] **Safe area respect**: Uses `env(safe-area-inset-*)` for PWA/mobile
- [ ] **Responsive breakpoints**: Mobile-first, graceful degradation
- [ ] **No layout shift**: Reserved space for dynamic content (CLS < 0.1)
- [ ] **Content breathing room**: Adequate whitespace, never cramped

**Audit Command**: `grep -r "p-\[.*\]" src/` should show no arbitrary padding values

### Container & Surface

- [ ] **Surface hierarchy**: Clear elevation system (base → elevated → floating)
- [ ] **Glass materials**: `backdrop-filter` only on panels, never on text
- [ ] **Containment**: Fixed headers/footers never obscure scrolling content
- [ ] **Focus containment**: Modal/dialog focus trapping works correctly

---

## 🎯 Interactive Controls

### Touch Targets & Accessibility

- [ ] **Minimum hit targets**: 44×44px for touch interfaces (verified)
- [ ] **Keyboard navigation**: Logical tab order, visible focus indicators
- [ ] **Focus management**: Focus returns appropriately after modal close
- [ ] **Hover enhancement**: Pointer-hover effects don't gate core functionality
- [ ] **Touch feedback**: Active states provide immediate visual response

**Test Command**: Use hit-target audit script to verify control sizes

### Button System

- [ ] **Variant consistency**: Primary, secondary, ghost, destructive follow design tokens
- [ ] **Loading states**: Spinners/skeleton during async operations
- [ ] **Icon placement**: Left/right icons follow 16px spacing rule
- [ ] **Disabled states**: Visually distinct but maintain accessibility
- [ ] **Destructive confirmation**: Dangerous actions require explicit confirmation

---

## 🔄 Motion & Animation

### Performance & Accessibility

- [ ] **Reduced motion respect**: `prefers-reduced-motion: reduce` honored
- [ ] **GPU-optimized**: Animations use `transform`/`opacity` only
- [ ] **Purposeful motion**: Transitions aid understanding, not decoration
- [ ] **Duration appropriate**: 150-300ms for UI transitions, 500ms max
- [ ] **Easing natural**: Cubic-bezier curves feel organic

**Audit Command**: Search for CSS animations without reduced-motion queries

### Transition System

- [ ] **Consistent timing**: Uses design token durations (`transition-150`, etc.)
- [ ] **State transitions**: Loading → success → idle flows smoothly
- [ ] **Page transitions**: Navigation feels continuous, not jarring
- [ ] **Micro-interactions**: Hover/focus changes are subtle but noticeable

---

## 🛡️ Form & Input Excellence

### Data Entry UX

- [ ] **Labels explicit**: Never use placeholders as primary labels
- [ ] **Validation real-time**: Errors appear immediately with clear messaging
- [ ] **Required indicators**: Asterisks or "(required)" clearly visible
- [ ] **Error recovery**: Users can fix errors without losing context
- [ ] **Keyboard completion**: Enter/Escape behaviors predictable

### Input States

- [ ] **State hierarchy**: Default → focus → error → success visually distinct
- [ ] **Helper text**: Guidance appears before errors when helpful
- [ ] **Accessibility labels**: Screen readers understand input purpose
- [ ] **Auto-save drafts**: Long forms preserve user work
- [ ] **Progress indication**: Multi-step forms show completion status

---

## 📊 Data Display & Tables

### Information Architecture

- [ ] **Scannable data**: Proper row heights, zebra striping, or hover cues
- [ ] **Column controls**: Sort, filter, resize functionality obvious
- [ ] **Selection patterns**: Bulk actions with adequate hit targets
- [ ] **Empty states**: Designed placeholder content, not blank screens
- [ ] **Loading states**: Skeleton screens match final content structure

### Content Hierarchy

- [ ] **Information density**: Balance between data and readability
- [ ] **Action accessibility**: Row actions don't require precise pointer control
- [ ] **Responsive tables**: Mobile strategy (stack, scroll, or pivot)
- [ ] **Search integration**: Find functionality when data scale warrants

---

## 🚨 Feedback & Error Handling

### Status Communication

- [ ] **Toast notifications**: Brief, screen-reader friendly (live regions)
- [ ] **Inline feedback**: Success/error states contextually placed
- [ ] **Progress indication**: Long operations show completion percentage
- [ ] **Network resilience**: Retry mechanisms with clear error explanations
- [ ] **Destructive confirmation**: "Are you sure?" with consequences explained

### Error Recovery

- [ ] **Graceful degradation**: Core functionality works without JavaScript
- [ ] **Offline support**: Basic interactions available during connection loss
- [ ] **Error boundaries**: React error boundaries prevent white screens
- [ ] **Rollback capabilities**: Optimistic updates can be reverted

---

## 🌍 Internationalization & Accessibility

### Global Support

- [ ] **RTL support**: Layout mirrors correctly for right-to-left languages
- [ ] **Text expansion**: UI accommodates 30% longer translated strings
- [ ] **Date/currency**: Locale-aware formatting throughout
- [ ] **Icon directionality**: Arrows and navigation icons flip appropriately

### Accessibility Foundation

- [ ] **Semantic HTML**: Proper landmarks (header, nav, main, aside)
- [ ] **ARIA sparingly**: Only where native semantics insufficient
- [ ] **Heading hierarchy**: H1-H6 logical structure maintained
- [ ] **Screen reader testing**: VoiceOver/NVDA can navigate effectively
- [ ] **Color independence**: Information conveyed beyond color alone

---

## 🏗️ Component Architecture

### MAPS v2.2 Compliance

- [ ] **Anti-drift enforcement**: Components use design token system exclusively
- [ ] **Polymorphic factory**: Base component pattern followed consistently
- [ ] **Variant system**: CVA (class-variance-authority) for systematic options
- [ ] **Composition over inheritance**: Compound components vs monolithic props
- [ ] **Type safety**: TypeScript interfaces prevent misuse

### Documentation & Testing

- [ ] **Storybook stories**: All variants and states documented
- [ ] **Accessibility tests**: axe-core or similar automation
- [ ] **Visual regression**: Screenshots prevent unintended changes
- [ ] **Unit test coverage**: Core behaviors and edge cases covered
- [ ] **Performance budgets**: Bundle size and runtime metrics tracked

---

## 🔍 Quality Assurance Checklist

### Pre-Production Audit

#### Visual Inspection

- [ ] **Cross-browser testing**: Chrome, Firefox, Safari, Edge
- [ ] **Dark/light mode**: Both themes maintain quality and contrast
- [ ] **Responsive breakpoints**: Mobile, tablet, desktop, ultra-wide
- [ ] **High DPI displays**: Retina and 4K scaling looks crisp
- [ ] **Print styles**: Important content prints legibly

#### Interaction Testing

- [ ] **Keyboard-only navigation**: Tab order logical, focus visible
- [ ] **Touch device testing**: iOS Safari, Android Chrome
- [ ] **Screen reader testing**: Content makes sense when read aloud
- [ ] **Reduced motion**: Animations respect user preferences
- [ ] **High contrast mode**: Windows/macOS high contrast compatibility

#### Performance Validation

- [ ] **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **Bundle analysis**: No duplicate dependencies or unused code
- [ ] **Image optimization**: WebP with fallbacks, proper sizing
- [ ] **Font loading**: FOUT/FOIT minimized with proper strategies

---

## 🛠️ Development Tools & Scripts

### Automated Audits

```bash
# Hit target validation
npm run audit:hit-targets

# Color contrast checking
npm run audit:contrast

# Bundle size analysis
npm run audit:bundle

# Accessibility scan
npm run audit:a11y

# Visual regression
npm run test:visual
```

### Manual Testing Protocol

```bash
# Local testing checklist
npm run dev
# 1. Open localhost:3001
# 2. Toggle dark/light mode
# 3. Test keyboard navigation (Tab, Enter, Esc)
# 4. Zoom to 200% and verify layout
# 5. Enable "Reduce motion" in OS settings
# 6. Test with screen reader enabled
```

---

## 📋 Definition of Done (DoD)

### Component Ready Criteria

- [ ] **MAPS v2.2 tokens**: No hardcoded values in component
- [ ] **Accessibility baseline**: WCAG AAA compliance verified
- [ ] **Touch targets**: 44px minimum for interactive elements
- [ ] **Documentation complete**: Storybook story with all variants
- [ ] **Test coverage**: Unit tests for core behaviors
- [ ] **Cross-browser verified**: Chrome, Firefox, Safari tested
- [ ] **Performance impact**: Bundle size increase < 5KB
- [ ] **Design review**: Approved by design team/stakeholders

### Feature Ready Criteria

- [ ] **User flow testing**: Happy path + edge cases validated
- [ ] **Error state design**: Loading, empty, error states implemented
- [ ] **Mobile optimization**: Touch-friendly on actual devices
- [ ] **Screen reader testing**: VoiceOver/NVDA navigation confirmed
- [ ] **Performance budget**: Core Web Vitals within targets
- [ ] **Internationalization**: RTL and text expansion considered
- [ ] **Security review**: No XSS vulnerabilities in dynamic content

---

## 🎯 Anti-Drift Enforcement

### Monthly Audit Schedule

- **Week 1**: Visual regression testing across all components
- **Week 2**: Accessibility audit with automated tools + manual testing
- **Week 3**: Performance analysis and bundle optimization
- **Week 4**: Design token usage audit and hardcoded value cleanup

### Continuous Monitoring

- **Pre-commit hooks**: ESLint rules prevent hardcoded values
- **CI/CD pipeline**: Automated accessibility and performance testing
- **Dependency updates**: Regular security and compatibility patches
- **Design token evolution**: Systematic updates with migration guides

### Red Flags (Immediate Action Required)

- ❌ **Hardcoded colors/spacing** in component files
- ❌ **Hit targets** below 44px on touch interfaces
- ❌ **Contrast ratios** below WCAG AAA standards
- ❌ **Missing focus indicators** on interactive elements
- ❌ **Animations** without reduced-motion alternatives
- ❌ **Text/icons** on glass surfaces becoming illegible

---

## 🔗 References & Resources

### Apple HIG Documentation

- [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

### Web Standards & Best Practices

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Web Content Accessibility Guidelines](https://webaim.org/standards/wcag/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

### Internal Documentation

- `MAPS_DESIGN_SYSTEM_ARCHITECTURE.md` - Core system philosophy
- `SSOT.md` - Single source of truth for design tokens
- `visual-accessibility-testing.md` - Testing protocols
- Component Storybook - Living documentation and examples

---

_This checklist is a living document. Update it as our design system evolves and new HIG principles emerge. The goal is prevention of design drift while maintaining development velocity and user experience excellence._
