# 🧪 SparkTask Railway Testing Strategy - Priority-Based Precision

**Fortune 500 Quality Assurance Framework**  
**Companion Document to Fortune 500 Railway Implementation Master Plan**

---

## 📊 **TESTING PYRAMID - POLICY-DRIVEN APPROACH**

```
                    🎯 E2E Tests (90% Critical Journeys)
                   ╱                                    ╲
                  ╱  Playwright: Fortune 500 Demo        ╲
                 ╱   Railway Station Workflows            ╲
                ╱____________________________________╲
               ╱                                          ╲
              ╱  🔧 Integration Tests (95% Station Flows)  ╲
             ╱   Vitest: Station → Station → Station       ╲
            ╱     API Routes + Policy Integration           ╲
           ╱__________________________________________╲
          ╱                                                ╲
         ╱  🎯 Unit Tests (100% Policy + AI Logic)          ╲
        ╱   Vitest: Policy Guards, AI Decisions             ╲
       ╱     Academic Citation Validation                    ╲
      ╱________________________________________________╲
     ╱                                                      ╲
    ╱  📱 UI Component Tests (85% Coverage)                  ╲
   ╱   React Testing Library: Railway Components            ╲
  ╱     Error States, Loading States, Interactions          ╲
 ╱________________________________________________________╲
```

**Key Principle:** **Critical Business Logic = 100% Coverage, UI Components = 85% Coverage**

---

## 🎯 **PRIORITY-BASED COVERAGE STRATEGY**

### **Tier 1: Critical Business Logic (100% Coverage Required)**

#### **Policy Engine - Zero Tolerance for Failures**
```typescript
// tests/unit/policy/pmbok-policies.test.ts
describe('PMBOK Policy Engine - Critical Business Logic', () => {
  describe('Station Progression Guards', () => {
    test('CRITICAL: Charter required before budget planning', () => {
      const context = createProjectContext({
        currentStation: 'initiation',
        project: { charter: null },
        targetStation: 'budget'
      });

      const result = canProgressToStation('budget', context, pmbokPolicies);

      expect(result.allowed).toBe(false);
      expect(result.violations[0]).toEqual({
        severity: 'high',
        message: 'PMBOK requires completed project charter before budget planning',
        academicCitation: 'PMBOK Guide 7th Edition, Section 4.1.1.1',
        blocksProgression: true
      });
    });

    test('CRITICAL: WIP limits enforced per Lean principles', () => {
      const context = createKanbanContext({
        column: 'In Progress',
        currentTaskCount: 5,
        wipLimit: 3
      });

      const violation = checkWIPViolation(context);

      expect(violation.severity).toBe('medium');
      expect(violation.academicCitation).toContain('Lean Manufacturing + Kanban Principles');
      expect(violation.blocksProgression).toBe(false);
    });

    test('CRITICAL: All PMBOK process groups properly validated', () => {
      const allProcessGroups: PMBOKProcessGroup[] = ['initiating', 'planning', 'executing', 'monitoring', 'closing'];
      
      allProcessGroups.forEach(processGroup => {
        const policies = getPMBOKPoliciesForProcessGroup(processGroup);
        expect(policies.length).toBeGreaterThan(0);
        
        policies.forEach(policy => {
          expect(policy.pmbok_reference).toBeDefined();
          expect(policy.academic_citation).toContain('PMBOK');
        });
      });
    });
  });

  describe('Academic Citation Validation', () => {
    test('CRITICAL: All policy violations include valid academic citations', () => {
      const allPolicies = [...pmbokPolicies, ...iso31000Policies, ...iso9001Policies];
      
      allPolicies.forEach(policy => {
        const mockContext = createViolationContext(policy.id);
        const violation = policy.violation(mockContext);
        
        expect(violation.academicCitation).toBeDefined();
        expect(violation.academicCitation.length).toBeGreaterThan(10);
        expect(violation.academicCitation).toMatch(/^(PMBOK|ISO|Lean|Kanban)/);
      });
    });
  });
});
```

#### **AI Conductor Decision Logic - 100% Coverage**
```typescript
// tests/unit/conductor/ai-decision-logic.test.ts
describe('AI Conductor Decision Logic - Critical', () => {
  describe('Station Recommendation Engine', () => {
    test('CRITICAL: Recommends next station with valid PMBOK justification', async () => {
      const mockConductor = new MockAIConductor();
      const context = createProjectContext({
        currentStation: 'initiation',
        completionPercentage: 0.9,
        policyViolations: []
      });

      const recommendation = await mockConductor.orchestrateFlow(context);

      expect(recommendation.nextStation).toBe('budget');
      expect(recommendation.pmbok_compliance).toBe(true);
      expect(recommendation.academicJustification).toContain('PMBOK');
      expect(recommendation.confidence).toBeGreaterThan(0.8);
    });

    test('CRITICAL: Blocks progression when policy violations exist', async () => {
      const mockConductor = new MockAIConductor();
      const context = createProjectContext({
        currentStation: 'initiation',
        policyViolations: [createCharterViolation()]
      });

      const recommendation = await mockConductor.orchestrateFlow(context);

      expect(recommendation.nextStation).toBe('initiation');
      expect(recommendation.requiredActions).toContain('Complete project charter');
      expect(recommendation.pmbok_compliance).toBe(false);
    });

    test('CRITICAL: All AI recommendations include academic anchors', async () => {
      const testScenarios = [
        { station: 'initiation', expected: 'PMBOK' },
        { station: 'risk', expected: 'ISO 31000' },
        { station: 'execution', expected: 'Kanban' }
      ];

      for (const scenario of testScenarios) {
        const context = createProjectContext({ currentStation: scenario.station });
        const recommendation = await mockConductor.orchestrateFlow(context);
        
        expect(recommendation.citations.length).toBeGreaterThan(0);
        expect(recommendation.academicJustification).toContain(scenario.expected);
      }
    });
  });

  describe('Routing Explanation Logic', () => {
    test('CRITICAL: Explains routing decisions with academic grounding', async () => {
      const decision = createRoutingDecision({
        from: 'budget',
        to: 'schedule',
        reason: 'pmbok_sequence'
      });

      const explanation = await mockConductor.explainRouting(decision);

      expect(explanation).toContain('PMBOK');
      expect(explanation).toContain('Planning Process Group');
      expect(explanation.length).toBeGreaterThan(50);
    });
  });
});
```

### **Tier 2: Integration Testing (95% Coverage Target)**

#### **Station Flow Integration - Critical User Paths**
```typescript
// tests/integration/station-flows.test.ts
describe('Railway Station Flow Integration', () => {
  test('INTEGRATION: Complete PMBOK-compliant project lifecycle', async () => {
    // Test the entire Fortune 500 demo scenario
    const project = await createTestProject({
      name: 'Fortune 500 Integration Test',
      policyProfile: 'enterprise'
    });

    // Phase 1: Initiating Process Group
    await completeInitiationStation(project.id, {
      charter: mockCharter,
      stakeholders: mockStakeholders
    });

    const initiationProgress = await getStationProgress(project.id, 'initiation');
    expect(initiationProgress.progress).toBe(1.0);
    expect(initiationProgress.pmbokCompliance).toBe(true);

    // Phase 2: Planning Process Group
    await completeBudgetStation(project.id, mockBudget);
    await completeScheduleStation(project.id, mockSchedule);
    await completeRiskStation(project.id, mockRisks);

    const planningCompliance = await validatePlanningCompliance(project.id);
    expect(planningCompliance.allStationsComplete).toBe(true);
    expect(planningCompliance.policyViolations).toHaveLength(0);

    // Phase 3: Executing Process Group
    await executeProjectTasks(project.id, mockTasks);
    
    const executionMetrics = await getExecutionMetrics(project.id);
    expect(executionMetrics.wipViolations).toBe(0);
    expect(executionMetrics.throughput).toBeGreaterThan(0);

    // Phase 4: Closing Process Group
    await completeHandoverStation(project.id, mockHandover);
    await completeEvaluationStation(project.id, mockEvaluation);

    const finalValidation = await validateProjectCompletion(project.id);
    expect(finalValidation.allPMBOKProcessGroupsComplete).toBe(true);
    expect(finalValidation.academicComplianceScore).toBeGreaterThan(0.95);
  });

  test('INTEGRATION: Policy violations prevent progression', async () => {
    const project = await createTestProject();

    // Attempt to progress to budget without charter
    const budgetAttempt = await attemptStationProgression(project.id, 'budget');
    expect(budgetAttempt.allowed).toBe(false);
    expect(budgetAttempt.violations[0].academicCitation).toContain('PMBOK');

    // Complete charter and retry
    await completeCharter(project.id, mockCharter);
    const budgetRetry = await attemptStationProgression(project.id, 'budget');
    expect(budgetRetry.allowed).toBe(true);
  });
});
```

#### **API Integration Testing**
```typescript
// tests/integration/api-integration.test.ts
describe('API Integration with TanStack Query', () => {
  test('INTEGRATION: Query invalidation cascades correctly', async () => {
    const project = await createTestProject();
    
    // Initial data fetch
    const initialData = await queryClient.fetchQuery({
      queryKey: queryKeys.projects.detail(project.id)
    });

    // Update station progress
    await updateStationProgress(project.id, 'initiation', { progress: 1.0 });

    // Verify related queries are invalidated
    const invalidatedQueries = queryClient.getQueriesData({
      queryKey: queryKeys.projects.all
    });

    expect(invalidatedQueries.length).toBeGreaterThan(0);
  });

  test('INTEGRATION: Error handling across API boundaries', async () => {
    // Test API error propagation to UI
    server.use(
      http.get('/api/projects/:id', () => {
        return HttpResponse.json(
          { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
          { status: 404 }
        );
      })
    );

    const query = queryClient.fetchQuery({
      queryKey: queryKeys.projects.detail('invalid-id')
    });

    await expect(query).rejects.toMatchObject({
      code: 'PROJECT_NOT_FOUND'
    });
  });
});
```

### **Tier 3: End-to-End Testing (90% Critical Journey Coverage)**

#### **Fortune 500 Demo Scenarios**
```typescript
// tests/e2e/fortune-500-demo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fortune 500 Demo Journey', () => {
  test('DEMO: Complete Railway journey in <5 minutes', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to projects
    await page.goto('/projects/new');
    await expect(page.locator('[data-testid="new-project-form"]')).toBeVisible();

    // Station 1: Initiation (PMBOK Initiating Process Group)
    await page.fill('[data-testid="project-name"]', 'Fortune 500 Pilot Project');
    await page.fill('[data-testid="project-charter"]', 'Strategic initiative to implement AI-driven project management...');
    
    // Verify PMBOK compliance badge
    await expect(page.locator('[data-testid="pmbok-badge"]')).toContainText('PMBOK 7th Edition');
    await expect(page.locator('[data-testid="academic-anchor"]')).toContainText('Initiating Process Group');

    await page.click('[data-testid="complete-initiation"]');

    // Station 2: Budget (PMBOK Planning Process Group)
    await page.click('[data-testid="budget-station-tab"]');
    await expect(page.locator('[data-testid="budget-form"]')).toBeVisible();

    await page.fill('[data-testid="budget-amount"]', '500000');
    await page.click('[data-testid="add-budget-line"]');

    // Test policy violation and recovery
    await page.fill('[data-testid="budget-amount"]', '999999999');
    await expect(page.locator('[data-testid="policy-violation"]')).toContainText('Budget threshold exceeded');
    await expect(page.locator('[data-testid="academic-citation"]')).toContainText('PMBOK');

    await page.fill('[data-testid="budget-amount"]', '500000');
    await page.click('[data-testid="complete-budget"]');

    // Station 3: Risk Management (ISO 31000)
    await page.click('[data-testid="risk-station-tab"]');
    
    // Verify ISO 31000 compliance
    await expect(page.locator('[data-testid="iso31000-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="risk-heatmap"]')).toBeVisible();

    await page.click('[data-testid="add-risk"]');
    await page.fill('[data-testid="risk-title"]', 'Technology Integration Risk');
    await page.selectOption('[data-testid="risk-probability"]', '3');
    await page.selectOption('[data-testid="risk-impact"]', '4');
    await page.click('[data-testid="save-risk"]');

    // Verify risk appears in heatmap
    await expect(page.locator('[data-testid="risk-heatmap-point"]')).toBeVisible();

    // Station 4: Execution (Kanban + Lean)
    await page.click('[data-testid="execution-station-tab"]');
    
    // Verify Kanban board with WIP limits
    await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible();
    await expect(page.locator('[data-testid="wip-badge"]')).toContainText('Lean Manufacturing');

    // Add task and test WIP limits
    await page.click('[data-testid="add-task"]');
    await page.fill('[data-testid="task-title"]', 'Implement AI Conductor');
    await page.click('[data-testid="save-task"]');

    // Move task through columns
    await page.dragAndDrop('[data-testid="task-card"]', '[data-testid="in-progress-column"]');
    await expect(page.locator('[data-testid="task-status"]')).toContainText('In Progress');

    // Station 5: Evaluation (Balanced Scorecard)
    await page.click('[data-testid="evaluation-station-tab"]');
    
    // Verify project completion metrics
    await expect(page.locator('[data-testid="kpi-scorecard"]')).toBeVisible();
    await expect(page.locator('[data-testid="lessons-learned"]')).toBeVisible();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Verify demo completed in <5 minutes
    expect(duration).toBeLessThan(300);

    // Verify all academic anchors are visible
    await expect(page.locator('[data-testid="academic-anchors"]')).toContainText('PMBOK');
    await expect(page.locator('[data-testid="academic-anchors"]')).toContainText('ISO 31000');
    await expect(page.locator('[data-testid="academic-anchors"]')).toContainText('Kanban');
  });

  test('ACCESSIBILITY: Complete keyboard navigation', async ({ page }) => {
    await page.goto('/projects/new');

    // Test keyboard accessibility across all stations
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'project-name');

    // Navigate through all form fields with keyboard
    const formFields = [
      'project-name',
      'project-charter',
      'complete-initiation',
      'budget-station-tab'
    ];

    for (const field of formFields) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').getAttribute('data-testid');
      expect(formFields).toContain(focused);
    }

    // Test WCAG AAA compliance
    const axeResults = await page.accessibility.scan();
    expect(axeResults.violations).toHaveLength(0);
  });
});

test.describe('Performance Validation', () => {
  test('PERFORMANCE: Station switching <100ms', async ({ page }) => {
    await page.goto('/projects/demo-project');

    const stationSwitches = [
      'initiation-station-tab',
      'budget-station-tab', 
      'schedule-station-tab',
      'risk-station-tab',
      'execution-station-tab'
    ];

    for (const station of stationSwitches) {
      const startTime = Date.now();
      await page.click(`[data-testid="${station}"]`);
      await page.waitForSelector('[data-testid="station-content"]');
      const endTime = Date.now();
      
      const switchTime = endTime - startTime;
      expect(switchTime).toBeLessThan(100);
    }
  });

  test('PERFORMANCE: AI Conductor response <2s', async ({ page }) => {
    await page.goto('/projects/demo-project');
    
    const startTime = Date.now();
    await page.click('[data-testid="ai-conductor-panel"]');
    await page.waitForSelector('[data-testid="ai-recommendation"]');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThan(2000);
  });
});
```

### **Tier 4: UI Component Testing (85% Coverage Target)**

#### **Railway Components**
```typescript
// tests/unit/components/railway/RailMap.test.tsx
import { render, screen } from '@testing-library/react';
import { RailMap } from '@/components/railway/RailMap';

describe('RailMap Component', () => {
  test('renders all stations with correct PMBOK phases', () => {
    const mockProject = createMockProject({
      stations: mockStationStates
    });

    render(<RailMap projectId={mockProject.id} />);

    // Verify all stations are rendered
    expect(screen.getByText('Initiation')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Risk')).toBeInTheDocument();
    expect(screen.getByText('Execution')).toBeInTheDocument();

    // Verify PMBOK process group indicators
    expect(screen.getByText('Initiating')).toBeInTheDocument();
    expect(screen.getAllByText('Planning')).toHaveLength(3); // Budget, Schedule, Risk
    expect(screen.getByText('Executing')).toBeInTheDocument();
  });

  test('shows progress indicators correctly', () => {
    const mockProject = createMockProject({
      stations: [
        { station: 'initiation', progress: 1.0, pmbok: 'initiating' },
        { station: 'budget', progress: 0.6, pmbok: 'planning' },
        { station: 'schedule', progress: 0.0, pmbok: 'planning' }
      ]
    });

    render(<RailMap projectId={mockProject.id} />);

    const initiationProgress = screen.getByTestId('initiation-progress');
    expect(initiationProgress).toHaveAttribute('aria-valuenow', '100');

    const budgetProgress = screen.getByTestId('budget-progress');
    expect(budgetProgress).toHaveAttribute('aria-valuenow', '60');
  });

  test('handles loading and error states', () => {
    render(<RailMap projectId="loading-project" />);
    expect(screen.getByTestId('rail-map-skeleton')).toBeInTheDocument();

    render(<RailMap projectId="error-project" />);
    expect(screen.getByText('Failed to load project')).toBeInTheDocument();
  });
});
```

---

## 📊 **TESTING AUTOMATION & CI/CD INTEGRATION**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/test-pipeline.yml
name: Railway Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    name: Unit Tests (100% Policy + AI Logic)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
        env:
          COVERAGE_THRESHOLD_POLICY: 100
          COVERAGE_THRESHOLD_AI: 100
      
      - name: Upload Policy Coverage
        uses: codecov/codecov-action@v3
        with:
          files: coverage/policy/lcov.info
          flags: policy-engine

  integration-tests:
    name: Integration Tests (95% Station Flows)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration
        env:
          COVERAGE_THRESHOLD_INTEGRATION: 95

  e2e-tests:
    name: E2E Tests (Fortune 500 Demo)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
        env:
          E2E_TIMEOUT: 300000  # 5 minutes max
      
      - name: Upload E2E Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  performance-tests:
    name: Performance Validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run test:performance
        env:
          TTI_THRESHOLD: 2000
          SEARCH_THRESHOLD: 200
          STATION_SWITCH_THRESHOLD: 100

  academic-validation:
    name: Academic Citation Validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run validate:academic-citations
      - run: npm run validate:pmbok-compliance
      - run: npm run validate:iso-standards
```

### **Coverage Configuration**
```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        // Critical business logic - 100% coverage
        'lib/policy/**': {
          functions: 100,
          lines: 100,
          statements: 100,
          branches: 100
        },
        'lib/railway/conductor/**': {
          functions: 100,
          lines: 100,
          statements: 100,
          branches: 100
        },
        // Integration paths - 95% coverage
        'lib/api/**': {
          functions: 95,
          lines: 95,
          statements: 95,
          branches: 90
        },
        // UI components - 85% coverage
        'components/**': {
          functions: 85,
          lines: 85,
          statements: 85,
          branches: 80
        }
      }
    }
  }
});
```

---

## 🎯 **SUCCESS METRICS & VALIDATION**

### **Testing KPIs**
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Policy Guard Coverage** | 100% | TBD | 🎯 |
| **AI Logic Coverage** | 100% | TBD | 🎯 |
| **Station Flow Coverage** | 95% | TBD | 🎯 |
| **E2E Journey Coverage** | 90% | TBD | 🎯 |
| **UI Component Coverage** | 85% | TBD | 🎯 |

### **Performance Benchmarks**
| Metric | Target | Validation Method | Priority |
|--------|--------|------------------|----------|
| **Demo Completion Time** | <5 minutes | E2E automation | Critical |
| **Station Switch Time** | <100ms | Performance testing | High |
| **AI Response Time** | <2s | Load testing | High |
| **Test Suite Runtime** | <10 minutes | CI/CD monitoring | Medium |

### **Academic Compliance Validation**
- [ ] **PMBOK Citations**: All policy violations reference specific PMBOK sections
- [ ] **ISO Standards**: Risk management follows ISO 31000:2018 guidelines  
- [ ] **Academic Accuracy**: Expert review validates all academic anchor claims
- [ ] **Compliance Automation**: Automated checking of academic citation format

---

**This testing strategy ensures Fortune 500 quality through precise, priority-based coverage that focuses on business-critical logic while maintaining efficient test execution.**
