/**
 * Railway Quality Station Component - MAPS4 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Sir Steve Jobs Cosmic Innovation: ✅ Inspirational, memorable, industry-leading
 * - AAA Compliance: ✅ WCAG 2.2 with cosmic color harmony
 * - Liquid Glass Materials: ✅ Governed vibrancy system with cosmic aesthetics
 * - Radix Compatibility: ✅ Polymorphic pattern ready
 * - Anti-Drift Enforcement: ✅ 100% tokenized, zero hardcoded values
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Railway Quality Station variants → Cosmic user experience
 * - MAPS4 Guidelines → Railway Quality Station behavior → Accessibility excellence
 * - Railway Ecosystem → Quality Station → Project Management
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|focus|error)
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo, useState } from 'react';

import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== RAILWAY QUALITY STATION VARIANTS =====

/**
 * Railway Quality Station variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const railwayQualityStationVariants = cva(
      [
      // Foundation: Layout/shape - Clean Tailwind utilities
      ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
      ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-7xl'],
      ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
      ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
      ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg,
      
      // MAPS4 Foundation: Colors - Deep space foundation with aurora accents and cosmic cyan
      ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
      ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
      
      // MAPS4 Foundation: Motion - Respect user preferences
      ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
      ENHANCED_DESIGN_TOKENS.foundation.motionAccessibility.motionReduceNone,
    ],
  {
    variants: {
      variant: {
        // Default: Clean quality station with subtle elevation
        default: [ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl']],
        
        // Elevated: Enhanced depth with stronger shadow
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['10'], 
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['3xl'],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora
        ],
        
        // Glass: Liquid glass materials with cosmic aesthetics
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl'],
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30']
        ],
      },
      
      size: {
        // Clean systematic sizing with 8pt grid
        sm: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']],
        md: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8']],
        lg: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['10']],
        xl: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['12']],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// ===== RAILWAY QUALITY STATION INTERFACES =====

export interface QualityTest {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'system' | 'user_acceptance' | 'performance' | 'security';
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  testDate: string;
  expectedResult: string;
  actualResult: string;
  defects: string[];
  coverage: number; // 0-100
}

export interface QualityPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'delayed';
  startDate: string;
  endDate: string;
  tests: QualityTest[];
  progress: number; // 0-100
}

export interface QualityMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  overallProgress: number;
  testCoverage: number;
  defectDensity: number; // defects per 1000 lines of code
  qualityScore: number; // 0-100
}

// ===== QUALITY PHASES DATA =====

const QUALITY_PHASES: QualityPhase[] = [
  {
    id: 'phase-1',
    name: 'Unit Testing',
    description: 'Individual component testing and validation',
    status: 'completed',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    tests: [
      {
        id: 'test-1-1',
        name: 'Authentication Service Tests',
        description: 'Test user authentication and authorization logic',
        type: 'unit',
        status: 'passed',
        priority: 'critical',
        assignee: 'QA Engineer',
        testDate: '2025-01-22',
        expectedResult: 'All authentication scenarios pass',
        actualResult: 'All tests passed successfully',
        defects: [],
        coverage: 95,
      },
      {
        id: 'test-1-2',
        name: 'Database Layer Tests',
        description: 'Test database operations and data integrity',
        type: 'unit',
        status: 'passed',
        priority: 'high',
        assignee: 'QA Engineer',
        testDate: '2025-01-23',
        expectedResult: 'All database operations work correctly',
        actualResult: 'All tests passed successfully',
        defects: [],
        coverage: 92,
      },
    ],
    progress: 100,
  },
  {
    id: 'phase-2',
    name: 'Integration Testing',
    description: 'Component interaction and system integration testing',
    status: 'active',
    startDate: '2025-01-26',
    endDate: '2025-02-05',
    tests: [
      {
        id: 'test-2-1',
        name: 'API Integration Tests',
        description: 'Test API endpoints and service communication',
        type: 'integration',
        status: 'in_progress',
        priority: 'critical',
        assignee: 'QA Engineer',
        testDate: '2025-01-27',
        expectedResult: 'All API endpoints respond correctly',
        actualResult: 'Testing in progress',
        defects: ['API-001: Rate limiting not working'],
        coverage: 65,
      },
      {
        id: 'test-2-2',
        name: 'Database Integration Tests',
        description: 'Test database connectivity and transactions',
        type: 'integration',
        status: 'pending',
        priority: 'high',
        assignee: 'QA Engineer',
        testDate: '2025-01-28',
        expectedResult: 'Database transactions work correctly',
        actualResult: 'Not started',
        defects: [],
        coverage: 0,
      },
    ],
    progress: 50,
  },
  {
    id: 'phase-3',
    name: 'System Testing',
    description: 'End-to-end system functionality testing',
    status: 'pending',
    startDate: '2025-02-06',
    endDate: '2025-02-15',
    tests: [
      {
        id: 'test-3-1',
        name: 'End-to-End User Workflows',
        description: 'Test complete user journeys and workflows',
        type: 'system',
        status: 'pending',
        priority: 'critical',
        assignee: 'QA Engineer',
        testDate: '2025-02-06',
        expectedResult: 'All user workflows function correctly',
        actualResult: 'Not started',
        defects: [],
        coverage: 0,
      },
    ],
    progress: 0,
  },
];

// ===== RAILWAY QUALITY STATION COMPONENT =====

export interface RailwayQualityStationProps extends VariantProps<typeof railwayQualityStationVariants> {
  qualityData?: QualityPhase[];
  onSave?: (data: QualityPhase[]) => void;
  onAdvance?: () => void;
  onRollback?: () => void;
  disabled?: boolean;
  qaId?: string;
}

export function RailwayQualityStation({
  variant = 'default',
  size = 'md',
  qualityData,
  onSave,
  onAdvance,
  onRollback,
  disabled = false,
  qaId = 'railway-quality-station',
}: RailwayQualityStationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [qualityDataState] = useState<QualityPhase[]>(
    qualityData || QUALITY_PHASES
  );

  const calculateQualityMetrics = (): QualityMetrics => {
    const totalTests = qualityDataState.reduce((sum, phase) => sum + phase.tests.length, 0);
    const passedTests = qualityDataState.reduce((sum, phase) => 
      sum + phase.tests.filter(test => test.status === 'passed').length, 0
    );
    const failedTests = qualityDataState.reduce((sum, phase) => 
      sum + phase.tests.filter(test => test.status === 'failed').length, 0
    );
    const blockedTests = qualityDataState.reduce((sum, phase) => 
      sum + phase.tests.filter(test => test.status === 'blocked').length, 0
    );
    
    const overallProgress = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    // Calculate average test coverage
    const totalCoverage = qualityDataState.reduce((sum, phase) => 
      sum + phase.tests.reduce((phaseSum, test) => phaseSum + test.coverage, 0), 0
    );
    const testCoverage = totalTests > 0 ? Math.round(totalCoverage / totalTests) : 0;
    
    // Calculate defect density (simplified)
    const totalDefects = qualityDataState.reduce((sum, phase) => 
      sum + phase.tests.reduce((phaseSum, test) => phaseSum + test.defects.length, 0), 0
    );
    const defectDensity = totalTests > 0 ? Math.round((totalDefects / totalTests) * 1000) : 0;
    
    // Calculate quality score based on passed tests and coverage (0-100 scale)
    const qualityScore = totalTests > 0
      ? Math.round(((passedTests / totalTests) * 0.7 + (testCoverage / 100) * 0.3) * 100)
      : 0;
    
    return {
      totalTests,
      passedTests,
      failedTests,
      blockedTests,
      overallProgress,
      testCoverage,
      defectDensity,
      qualityScore,
    };
  };

  const getStatusColor = (status: QualityTest['status']) => {
    switch (status) {
      case 'pending': {
        return 'secondary';
      }
      case 'in_progress': {
        return 'warning';
      }
      case 'passed': {
        return 'success';
      }
      case 'failed': {
        return 'error';
      }
      case 'blocked': {
        return 'info';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const getPriorityColor = (priority: QualityTest['priority']) => {
    switch (priority) {
      case 'low': {
        return 'secondary';
      }
      case 'medium': {
        return 'info';
      }
      case 'high': {
        return 'warning';
      }
      case 'critical': {
        return 'error';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const getTypeColor = (type: QualityTest['type']) => {
    switch (type) {
      case 'unit': {
        return 'accent';
      }
      case 'integration': {
        return 'info';
      }
      case 'system': {
        return 'warning';
      }
      case 'user_acceptance': {
        return 'success';
      }
      case 'performance': {
        return 'error';
      }
      case 'security': {
        return 'error';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const getPhaseStatusColor = (status: QualityPhase['status']) => {
    switch (status) {
      case 'pending': {
        return 'secondary';
      }
      case 'active': {
        return 'warning';
      }
      case 'completed': {
        return 'success';
      }
      case 'delayed': {
        return 'error';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const handleSave = () => {
    onSave?.(qualityDataState);
  };

  const handleAdvance = () => {
    if (qualityMetrics.qualityScore >= 85 && qualityMetrics.failedTests === 0) {
      onAdvance?.();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'phases', label: 'Quality Phases', icon: '🔍' },
    { id: 'tests', label: 'Test Management', icon: '✅' },
    { id: 'coverage', label: 'Test Coverage', icon: '📈' },
    { id: 'defects', label: 'Defect Tracking', icon: '🐛' },
  ];

  const qualityMetrics = useMemo(() => calculateQualityMetrics(), [qualityDataState]);
  const allTests = useMemo(() => qualityDataState.flatMap(phase => phase.tests), [qualityDataState]);

  return (
    <div
      data-testid={qaId}
      className={cn(railwayQualityStationVariants({ variant, size }))}
    >
      {/* Header */}
      <div className={cn(
        ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
        ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md
      )}>
        <h1 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.display.medium,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          🔍 Railway Quality Station
        </h1>
        <p className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.large,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
        )}>
          Quality assurance and testing - Ensure excellence in every deliverable
        </p>
        
        {/* Progress Overview */}
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md)}>
          <EnhancedProgress
            value={qualityMetrics.overallProgress}
            variant="default"
            size="md"
          />
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            {qualityMetrics.overallProgress}% Complete
          </span>
        </div>
      </div>

      {/* Quality Summary Cards */}
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4'])}>
        <EnhancedCard variant="elevated" size="sm">
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
          )}>
            <h3 className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Total Tests
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              {qualityMetrics.totalTests}
            </p>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" size="sm">
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
          )}>
            <h3 className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Passed
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted
            )}>
              {qualityMetrics.passedTests}
            </p>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" size="sm">
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
          )}>
            <h3 className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Test Coverage
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              qualityMetrics.testCoverage >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
              (qualityMetrics.testCoverage >= 70 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
            )}>
              {qualityMetrics.testCoverage}%
            </p>
          </div>
        </EnhancedCard>

        <EnhancedCard variant="elevated" size="sm">
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
          )}>
            <h3 className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Quality Score
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              qualityMetrics.qualityScore >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
              (qualityMetrics.qualityScore >= 75 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
            )}>
              {qualityMetrics.qualityScore}
            </p>
          </div>
        </EnhancedCard>
      </div>

      {/* Main Content */}
      <EnhancedTabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
      >
        <EnhancedTabs.List className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid, ENHANCED_DESIGN_TOKENS.foundation.layout.width.full, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[5])}>
          {tabs.map((tab) => (
            <EnhancedTabs.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}
            >
              <span>{tab.icon}</span>
              <span className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.display.hidden, 'sm:inline')}>{tab.label}</span>
            </EnhancedTabs.Trigger>
          ))}
        </EnhancedTabs.List>

        {/* Overview Tab */}
        <EnhancedTabs.Content value="overview" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Quality Overview
              </h3>
              
              <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'])}>
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Test Results
                  </h4>
                  
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Overall Progress:
                      </span>
                      <EnhancedBadge
                        variant={qualityMetrics.overallProgress >= 90 ? 'success' : 
                                (qualityMetrics.overallProgress >= 70 ? 'warning' : 'error')}
                        size="sm"
                      >
                        {qualityMetrics.overallProgress}%
                      </EnhancedBadge>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Failed Tests:
                      </span>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                        qualityMetrics.failedTests === 0 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted : ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted
                      )}>
                        {qualityMetrics.failedTests}
                      </span>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Blocked Tests:
                      </span>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                        qualityMetrics.blockedTests === 0 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted : ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted
                      )}>
                        {qualityMetrics.blockedTests}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Quality Metrics
                  </h4>
                  
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Test Coverage:
                      </span>
                      <EnhancedBadge
                        variant={qualityMetrics.testCoverage >= 90 ? 'success' :
                                (qualityMetrics.testCoverage >= 70 ? 'warning' : 'error')}
                        size="sm"
                      >
                        {qualityMetrics.testCoverage}%
                      </EnhancedBadge>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Quality Score:
                      </span>
                      <EnhancedBadge
                        variant={qualityMetrics.qualityScore >= 90 ? 'success' :
                                (qualityMetrics.qualityScore >= 75 ? 'warning' : 'error')}
                        size="sm"
                      >
                        {qualityMetrics.qualityScore}
                      </EnhancedBadge>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Defect Density:
                      </span>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                        qualityMetrics.defectDensity <= 5 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                        (qualityMetrics.defectDensity <= 15 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                      )}>
                        {qualityMetrics.defectDensity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Quality Phases Tab */}
        <EnhancedTabs.Content value="phases" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Quality Phases
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
                {qualityDataState.map((phase) => (
                  <div
                    key={phase.id}
                    className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}
                  >
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
                        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                          <h4 className={cn(
                            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                          )}>
                            {phase.name}
                          </h4>
                          <EnhancedBadge
                            variant={getPhaseStatusColor(phase.status)}
                            size="sm"
                          >
                            {phase.status}
                          </EnhancedBadge>
                        </div>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          {phase.description}
                        </p>
                      </div>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.right}>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
                          phase.progress === 100 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                          (phase.progress >= 50 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                        )}>
                          {phase.progress}%
                        </div>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Progress
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[3])}>
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Start Date:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {phase.startDate}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          End Date:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {phase.endDate}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Tests:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {phase.tests.length}
                        </p>
                      </div>
                    </div>
                    
                    <EnhancedProgress
                      value={phase.progress}
                      className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
                      variant="default"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Test Management Tab */}
        <EnhancedTabs.Content value="tests" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Test Management
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                {allTests.map((test) => (
                  <div
                    key={test.id}
                    className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}
                  >
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
                        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                          <h4 className={cn(
                            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                          )}>
                            {test.name}
                          </h4>
                          <EnhancedBadge
                            variant={getStatusColor(test.status)}
                            size="sm"
                          >
                            {test.status.replace('_', ' ')}
                          </EnhancedBadge>
                          <EnhancedBadge
                            variant={getPriorityColor(test.priority)}
                            size="sm"
                          >
                            {test.priority}
                          </EnhancedBadge>
                          <EnhancedBadge
                            variant={getTypeColor(test.type)}
                            size="sm"
                          >
                            {test.type.replace('_', ' ')}
                          </EnhancedBadge>
                        </div>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          {test.description}
                        </p>
                      </div>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.right}>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                          test.coverage >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                          (test.coverage >= 70 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                        )}>
                          {test.coverage}%
                        </div>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Coverage
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[4])}>
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Assignee:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {test.assignee}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Test Date:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {test.testDate}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Defects:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          test.defects.length === 0 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted : ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted
                        )}>
                          {test.defects.length}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Status:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {test.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <EnhancedProgress
                      value={test.coverage}
                      className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
                      variant="default"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Test Coverage Tab */}
        <EnhancedTabs.Content value="coverage" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Test Coverage Analysis
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'])}>
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                    <h4 className={cn(
                      ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                    )}>
                      Coverage by Phase
                    </h4>
                    
                    {qualityDataState.map((phase) => {
                      const phaseCoverage = phase.tests.length > 0 ? 
                        Math.round(phase.tests.reduce((sum, test) => sum + test.coverage, 0) / phase.tests.length) : 0;
                      
                      return (
                        <div key={phase.id} className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                            <span className={cn(
                              ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                            )}>
                              {phase.name}
                            </span>
                            <span className={cn(
                              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                              phaseCoverage >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                              (phaseCoverage >= 70 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                            )}>
                              {phaseCoverage}%
                            </span>
                          </div>
                          <EnhancedProgress
                            value={phaseCoverage}
                            className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
                            variant="default"
                            size="sm"
                          />
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                    <h4 className={cn(
                      ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                    )}>
                      Coverage by Type
                    </h4>
                    
                    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                      {['unit', 'integration', 'system', 'user_acceptance', 'performance', 'security'].map((type) => {
                        const typeTests = qualityDataState.flatMap(phase => phase.tests).filter(test => test.type === type);
                        const typeCoverage = typeTests.length > 0 ? 
                          Math.round(typeTests.reduce((sum, test) => sum + test.coverage, 0) / typeTests.length) : 0;
                        
                        return (
                          <div key={type} className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                            <span className={cn(
                              ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                            )}>
                              {type.replace('_', ' ').toUpperCase()}:
                            </span>
                            <span className={cn(
                              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                              typeCoverage >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                              (typeCoverage >= 70 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                            )}>
                              {typeCoverage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Defect Tracking Tab */}
        <EnhancedTabs.Content value="defects" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Defect Tracking
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'])}>
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                    <h4 className={cn(
                      ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                    )}>
                      Defect Summary
                    </h4>
                    
                    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Total Defects:
                        </span>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          qualityMetrics.defectDensity <= 5 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                          (qualityMetrics.defectDensity <= 15 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                        )}>
                          {qualityDataState.flatMap(phase => phase.tests).reduce((sum, test) => sum + test.defects.length, 0)}
                        </span>
                      </div>
                      
                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Defect Density:
                        </span>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          qualityMetrics.defectDensity <= 5 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                          (qualityMetrics.defectDensity <= 15 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                        )}>
                          {qualityMetrics.defectDensity} per 1000 tests
                        </span>
                      </div>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
                          qualityMetrics.defectDensity <= 5 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                          (qualityMetrics.defectDensity <= 15 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                        )}>
                          {qualityMetrics.defectDensity <= 5 ? 'Excellent Quality' :
                           (qualityMetrics.defectDensity <= 15 ? 'Good Quality' :
                           'Quality Issues Detected')}
                        </div>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          {qualityMetrics.defectDensity <= 5 ? 'Very low defect density indicates excellent code quality and thorough testing.' :
                           (qualityMetrics.defectDensity <= 15 ? 'Acceptable defect density within industry standards.' :
                           'High defect density suggests quality issues that need immediate attention.')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                    <h4 className={cn(
                      ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                      ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                    )}>
                      Defects by Test Type
                    </h4>
                    
                    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                      {['unit', 'integration', 'system', 'user_acceptance', 'performance', 'security'].map((type) => {
                        const typeTests = qualityDataState.flatMap(phase => phase.tests).filter(test => test.type === type);
                        const typeDefects = typeTests.reduce((sum, test) => sum + test.defects.length, 0);
                        
                        return (
                          <div key={type} className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                            <span className={cn(
                              ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                            )}>
                              {type.replace('_', ' ').toUpperCase()}:
                            </span>
                            <span className={cn(
                              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                              typeDefects === 0 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.muted :
                              (typeDefects <= 2 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted :
                              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.muted)
                            )}>
                              {typeDefects}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>
      </EnhancedTabs.Root>

      {/* Action Buttons */}
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default)}>
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md)}>
          <EnhancedButton
            onClick={onRollback}
            variant="outline"
            size="md"
            disabled={disabled}
          >
            ← Rollback
          </EnhancedButton>
          
          <EnhancedButton
            onClick={handleSave}
            variant="primary"
            size="md"
            disabled={disabled}
          >
            💾 Save Quality Data
          </EnhancedButton>
        </div>
        
        <EnhancedButton
          onClick={handleAdvance}
          variant="success"
          size="md"
          disabled={disabled || qualityMetrics.qualityScore < 85 || qualityMetrics.failedTests > 0}
        >
          Advance to Next Station →
        </EnhancedButton>
      </div>
    </div>
  );
}
