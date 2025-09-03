/**
 * Railway Evaluation Station Component - MAPS4 Deep Space Canvas Cosmic Innovation
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
 * - MAPS4 Enhanced Tokens → Railway Evaluation Station variants → Cosmic user experience
 * - MAPS4 Guidelines → Railway Evaluation Station behavior → Accessibility excellence
 * - Railway Ecosystem → Evaluation Station → Project Management
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|focus|error)
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';

import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== RAILWAY EVALUATION STATION VARIANTS =====

/**
 * Railway Evaluation Station variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const railwayEvaluationStationVariants = cva(
  [
    // Foundation: Layout/shape - Enhanced design tokens only
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-7xl'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl,
    
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
        // Default: Clean evaluation station with subtle elevation
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
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['150'],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30']
        ],
      },
      
      size: {
        // Clean systematic sizing with 8pt grid
        sm: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']],
        md: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8']],
        lg: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl'], ENHANCED_DESIGN_TOKENS.foundation.layout.padding['10']],
        xl: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl'], ENHANCED_DESIGN_TOKENS.foundation.layout.padding['12']],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// ===== RAILWAY EVALUATION STATION INTERFACES =====

export interface EvaluationMetric {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'quality' | 'timeline' | 'budget' | 'stakeholder' | 'technical';
  target: number;
  actual: number;
  unit: string;
  weight: number; // 0-100
  status: 'exceeded' | 'met' | 'partially_met' | 'missed';
  notes: string;
}

export interface EvaluationPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'delayed';
  startDate: string;
  endDate: string;
  metrics: EvaluationMetric[];
  progress: number; // 0-100
}

export interface EvaluationSummary {
  totalMetrics: number;
  exceededTargets: number;
  metTargets: number;
  partiallyMetTargets: number;
  missedTargets: number;
  overallScore: number; // 0-100
  performanceRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  lessonsLearned: string[];
  recommendations: string[];
}

// ===== EVALUATION PHASES DATA =====

const EVALUATION_PHASES: EvaluationPhase[] = [
  {
    id: 'phase-1',
    name: 'Performance Evaluation',
    description: 'Assess project performance against objectives and KPIs',
    status: 'completed',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    metrics: [
      {
        id: 'metric-1-1',
        name: 'Project Completion Rate',
        description: 'Percentage of project objectives achieved',
        category: 'performance',
        target: 100,
        actual: 95,
        unit: '%',
        weight: 25,
        status: 'met',
        notes: 'Project achieved 95% of objectives, slightly below target but within acceptable range',
      },
      {
        id: 'metric-1-2',
        name: 'User Satisfaction Score',
        description: 'Average user satisfaction rating',
        category: 'stakeholder',
        target: 4.5,
        actual: 4.7,
        unit: '/5.0',
        weight: 20,
        status: 'exceeded',
        notes: 'Exceeded target with excellent user feedback',
      },
    ],
    progress: 100,
  },
  {
    id: 'phase-2',
    name: 'Quality Assessment',
    description: 'Evaluate deliverable quality and technical standards',
    status: 'active',
    startDate: '2025-01-26',
    endDate: '2025-02-05',
    metrics: [
      {
        id: 'metric-2-1',
        name: 'Code Quality Score',
        description: 'Static analysis and code review score',
        category: 'technical',
        target: 90,
        actual: 87,
        unit: '/100',
        weight: 15,
        status: 'partially_met',
        notes: 'Good code quality but some areas need improvement',
      },
      {
        id: 'metric-2-2',
        name: 'Test Coverage',
        description: 'Percentage of code covered by tests',
        category: 'quality',
        target: 85,
        actual: 82,
        unit: '%',
        weight: 15,
        status: 'partially_met',
        notes: 'Test coverage is close to target, minor improvements needed',
      },
    ],
    progress: 60,
  },
  {
    id: 'phase-3',
    name: 'Timeline & Budget Review',
    description: 'Analyze project timeline and budget performance',
    status: 'pending',
    startDate: '2025-02-06',
    endDate: '2025-02-15',
    metrics: [
      {
        id: 'metric-3-1',
        name: 'Schedule Adherence',
        description: 'Percentage of milestones completed on time',
        category: 'timeline',
        target: 90,
        actual: 0,
        unit: '%',
        weight: 15,
        status: 'missed',
        notes: 'Evaluation pending',
      },
      {
        id: 'metric-3-2',
        name: 'Budget Utilization',
        description: 'Percentage of budget used vs. allocated',
        category: 'budget',
        target: 100,
        actual: 0,
        unit: '%',
        weight: 10,
        status: 'missed',
        notes: 'Evaluation pending',
      },
    ],
    progress: 0,
  },
];

// ===== RAILWAY EVALUATION STATION COMPONENT =====

export interface RailwayEvaluationStationProps extends VariantProps<typeof railwayEvaluationStationVariants> {
  evaluationData?: EvaluationPhase[];
  onSave?: (data: EvaluationPhase[]) => void;
  onComplete?: () => void;
  onRollback?: () => void;
  disabled?: boolean;
  qaId?: string;
}

export function RailwayEvaluationStation({
  variant = 'default',
  size = 'md',
  evaluationData,
  onSave,
  onComplete,
  onRollback,
  disabled = false,
  qaId = 'railway-evaluation-station',
}: RailwayEvaluationStationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [evaluationDataState] = useState<EvaluationPhase[]>(
    evaluationData || EVALUATION_PHASES
  );

  const calculateEvaluationSummary = (): EvaluationSummary => {
    const totalMetrics = evaluationDataState.reduce((sum, phase) => sum + phase.metrics.length, 0);
    const exceededTargets = evaluationDataState.reduce((sum, phase) => 
      sum + phase.metrics.filter(metric => metric.status === 'exceeded').length, 0
    );
    const metTargets = evaluationDataState.reduce((sum, phase) => 
      sum + phase.metrics.filter(metric => metric.status === 'met').length, 0
    );
    const partiallyMetTargets = evaluationDataState.reduce((sum, phase) => 
      sum + phase.metrics.filter(metric => metric.status === 'partially_met').length, 0
    );
    const missedTargets = evaluationDataState.reduce((sum, phase) => 
      sum + phase.metrics.filter(metric => metric.status === 'missed').length, 0
    );
    
    // Calculate weighted overall score
    const totalWeight = evaluationDataState.reduce((sum, phase) => 
      sum + phase.metrics.reduce((phaseSum, metric) => phaseSum + metric.weight, 0), 0
    );
    
    const weightedScore = evaluationDataState.reduce((sum, phase) => 
      sum + phase.metrics.reduce((phaseSum, metric) => {
        let score = 0;
        switch (metric.status) {
          case 'exceeded': {
            score = 1.2; // Bonus for exceeding
            break;
          }
          case 'met': {
            score = 1;
            break;
          }
          case 'partially_met': {
            score = 0.7;
            break;
          }
          case 'missed': {
            score = 0;
            break;
          }
        }
        return phaseSum + (score * metric.weight);
      }, 0), 0
    );
    
    const overallScore = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
    
    // Determine performance rating
    let performanceRating: EvaluationSummary['performanceRating'];
    if (overallScore >= 90) performanceRating = 'excellent';
    else if (overallScore >= 75) performanceRating = 'good';
    else if (overallScore >= 60) performanceRating = 'satisfactory';
    else performanceRating = 'needs_improvement';
    
    // Generate lessons learned and recommendations
    const lessonsLearned = [
      'Strong stakeholder communication led to high satisfaction scores',
      'Early technical debt identification improved code quality',
      'Regular milestone reviews helped maintain project momentum',
    ];
    
    const recommendations = [
      'Implement automated code quality checks in CI/CD pipeline',
      'Increase test coverage to meet industry standards',
      'Establish regular stakeholder feedback sessions',
    ];
    
    return {
      totalMetrics,
      exceededTargets,
      metTargets,
      partiallyMetTargets,
      missedTargets,
      overallScore,
      performanceRating,
      lessonsLearned,
      recommendations,
    };
  };

  const getStatusColor = (status: EvaluationMetric['status']) => {
    switch (status) {
      case 'exceeded': {
        return 'success';
      }
      case 'met': {
        return 'success';
      }
      case 'partially_met': {
        return 'warning';
      }
      case 'missed': {
        return 'error';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const getCategoryColor = (category: EvaluationMetric['category']) => {
    switch (category) {
      case 'performance': {
        return 'accent';
      }
      case 'quality': {
        return 'info';
      }
      case 'timeline': {
        return 'warning';
      }
      case 'budget': {
        return 'error';
      }
      case 'stakeholder': {
        return 'success';
      }
      case 'technical': {
        return 'accent';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const getPhaseStatusColor = (status: EvaluationPhase['status']) => {
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
    onSave?.(evaluationDataState);
  };

  const handleComplete = () => {
    const summary = calculateEvaluationSummary();
    if (summary.overallScore >= 70) {
      onComplete?.();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'phases', label: 'Evaluation Phases', icon: '🔍' },
    { id: 'metrics', label: 'Metrics Analysis', icon: '📈' },
    { id: 'lessons', label: 'Lessons Learned', icon: '🎓' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
  ];

  const evaluationSummary = calculateEvaluationSummary();

  return (
    <div
      data-testid={qaId}
      className={cn(railwayEvaluationStationVariants({ variant, size }))}
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
          🎯 Railway Evaluation Station
        </h1>
        <p className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.large,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
        )}>
          Project evaluation and lessons learned - Continuous improvement through reflection
        </p>
        
        {/* Overall Score */}
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md)}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.display.large,
            evaluationSummary.overallScore >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
            (evaluationSummary.overallScore >= 75 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
            ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg)
          )}>
            {evaluationSummary.overallScore}
          </div>
                          <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.left}>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              Overall Score
            </div>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
              evaluationSummary.overallScore >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
              (evaluationSummary.overallScore >= 75 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg)
            )}>
              {evaluationSummary.performanceRating.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Summary Cards */}
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
              Total Metrics
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              {evaluationSummary.totalMetrics}
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
              Exceeded
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg
            )}>
              {evaluationSummary.exceededTargets}
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
              Met
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg
            )}>
              {evaluationSummary.metTargets}
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
              Partially Met
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg
            )}>
              {evaluationSummary.partiallyMetTargets}
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
              Missed
            </h3>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg
            )}>
              {evaluationSummary.missedTargets}
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
              <span className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.display.hidden, ENHANCED_DESIGN_TOKENS.foundation.layout.display.inline)}>{tab.label}</span>
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
                Evaluation Overview
              </h3>
              
              <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'])}>
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Performance Summary
                  </h4>
                  
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Overall Score:
                      </span>
                      <EnhancedBadge
                        variant={evaluationSummary.overallScore >= 90 ? 'success' : 
                                (evaluationSummary.overallScore >= 75 ? 'warning' : 'error')}
                        size="sm"
                      >
                        {evaluationSummary.overallScore}/100
                      </EnhancedBadge>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary)}>
                        Rating:
                      </span>
                      <EnhancedBadge
                        variant={evaluationSummary.performanceRating === 'excellent' ? 'success' :
                                evaluationSummary.performanceRating === 'good' ? 'success' :
                                evaluationSummary.performanceRating === 'satisfactory' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {evaluationSummary.performanceRating.replace('_', ' ')}
                      </EnhancedBadge>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                      )}>
                        Success Rate:
                      </span>
                                              <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                                                  (evaluationSummary.exceededTargets + evaluationSummary.metTargets) / evaluationSummary.totalMetrics >= 0.8 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
                        ((evaluationSummary.exceededTargets + evaluationSummary.metTargets) / evaluationSummary.totalMetrics >= 0.6 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
                        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg)
                        )}>
                        {evaluationSummary.totalMetrics > 0 ? 
                          Math.round(((evaluationSummary.exceededTargets + evaluationSummary.metTargets) / evaluationSummary.totalMetrics) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Key Insights
                  </h4>
                  
                  <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          evaluationSummary.overallScore >= 90 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
                          (evaluationSummary.overallScore >= 75 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg)
                        )}>
                          {evaluationSummary.overallScore >= 90 ? 'Outstanding Performance' :
                           evaluationSummary.overallScore >= 75 ? 'Good Performance' :
                           evaluationSummary.overallScore >= 60 ? 'Satisfactory Performance' :
                           'Performance Needs Improvement'}
                        </div>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          {evaluationSummary.overallScore >= 90 ? 'Project exceeded expectations across all key metrics.' :
                           evaluationSummary.overallScore >= 75 ? 'Project met most objectives with some areas for improvement.' :
                           evaluationSummary.overallScore >= 60 ? 'Project achieved basic objectives but has significant improvement opportunities.' :
                           'Project fell short of key objectives and requires immediate attention.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Evaluation Phases Tab */}
        <EnhancedTabs.Content value="phases" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Evaluation Phases
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
                {evaluationDataState.map((phase) => (
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
                          phase.progress === 100 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
                          (phase.progress >= 50 ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg)
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
                          Metrics:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {phase.metrics.length}
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

        {/* Metrics Analysis Tab */}
        <EnhancedTabs.Content value="metrics" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Metrics Analysis
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                {evaluationDataState.flatMap(phase => phase.metrics).map((metric) => (
                  <div
                    key={metric.id}
                    className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}
                  >
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
                        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                          <h4 className={cn(
                            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                          )}>
                            {metric.name}
                          </h4>
                          <EnhancedBadge
                            variant={getStatusColor(metric.status)}
                            size="sm"
                          >
                            {metric.status.replace('_', ' ')}
                          </EnhancedBadge>
                          <EnhancedBadge
                            variant={getCategoryColor(metric.category)}
                            size="sm"
                          >
                            {metric.category}
                          </EnhancedBadge>
                        </div>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          {metric.description}
                        </p>
                      </div>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.right}>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
                          metric.status === 'exceeded' ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
                          (metric.status === 'partially_met' ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg)
                        )}>
                          {metric.actual}/{metric.target} {metric.unit}
                        </div>
                        <div className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Weight: {metric.weight}%
                        </div>
                      </div>
                    </div>
                    
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[4])}>
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Target:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {metric.target} {metric.unit}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Actual:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          metric.status === 'exceeded' ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
                          metric.status === 'met' ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.fg :
                          metric.status === 'partially_met' ? ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.fg :
                          ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.fg
                        )}>
                          {metric.actual} {metric.unit}
                        </p>
                      </div>
                      
                      <div>
                        <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          Weight:
                        </span>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {metric.weight}%
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
                          {metric.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    {metric.notes && (
                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['3'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default)}>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                        )}>
                          <span className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>Notes:</span> {metric.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Lessons Learned Tab */}
        <EnhancedTabs.Content value="lessons" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Lessons Learned
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                {evaluationSummary.lessonsLearned.map((lesson, index) => (
                  <div
                    key={index}
                    className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}
                  >
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                      <div className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.avatar.size.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.full, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.typography.body.small, ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg, ENHANCED_DESIGN_TOKENS.foundation.color.content.inverse
                      )}>
                        {index + 1}
                      </div>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {lesson}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Recommendations Tab */}
        <EnhancedTabs.Content value="recommendations" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Recommendations
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                {evaluationSummary.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)}
                  >
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                      <div className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.avatar.size.xl, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.full, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.typography.body.small, ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.bg, ENHANCED_DESIGN_TOKENS.foundation.color.content.inverse
                      )}>
                        {index + 1}
                      </div>
                      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
                        <p className={cn(
                          ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
                          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                        )}>
                          {recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
            💾 Save Evaluation Data
          </EnhancedButton>
        </div>
        
        <EnhancedButton
          onClick={handleComplete}
          variant="success"
          size="md"
          disabled={disabled || evaluationSummary.overallScore < 70}
        >
          Complete Evaluation →
        </EnhancedButton>
      </div>
    </div>
  );
}
