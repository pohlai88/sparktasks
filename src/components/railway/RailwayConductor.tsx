/**
 * Railway Conductor Component - MAPS4 Deep Space Canvas Cosmic Innovation with Fortune 500 Standards
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Cosmic Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Anti-Drift Enforcement: ✅ Enhanced tokens only, no hardcoded values
 * - Enhanced UI Integration: ✅ Uses enhanced UI components exclusively
 * - Fortune 500 Quality: ✅ Sophisticated conductor system with liquid glass materials
 * - AAA Accessibility: ✅ WCAG 2.1 AA compliance with enforcement mode
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Railway Conductor variants → User experience
 * - MAPS4 Guidelines → Conductor hierarchy → Project orchestration
 * - MAPS4 Cosmic Philosophy → Primary design approach (NO EXCEPTIONS)
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 * → project conductor (orchestration|workflow|automation|governance)
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

// ===== RAILWAY CONDUCTOR VARIANTS =====

/**
 * Railway Conductor variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const railwayConductorVariants = cva(
  [
    // Foundation: Layout/shape - Clean Tailwind utilities
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
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
        // Default: Clean conductor with subtle elevation
        default: [ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.xl],
        
        // Elevated: Enhanced depth with stronger shadow
        elevated: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['8'], 
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius['2xl'],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.lg,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border.aurora
        ],
        
        // Glass: Liquid glass materials with cosmic aesthetics
        glass: [
          ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.xl,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.blur.md,
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate['150'],
          ENHANCED_DESIGN_TOKENS.foundation.elevation.md,
          ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default,
          ENHANCED_DESIGN_TOKENS.foundation.color.border['cosmic-border-30']
        ],
      },
      
      size: {
        // Clean systematic sizing with 8pt grid
        sm: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md],
        md: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg],
        lg: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl],
        xl: [ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack['2xl']],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// ===== RAILWAY CONDUCTOR INTERFACES =====

export interface ProjectWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'error';
  currentStep: string;
  totalSteps: number;
  progress: number;
  estimatedDuration: string;
  actualDuration: string;
  assignedTeam: string[];
  automationRules: string[];
  lastExecuted: string;
  nextExecution: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'event_based' | 'conditional';
  conditions: string[];
  actions: string[];
  status: 'active' | 'inactive' | 'error';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastExecuted: string;
  executionCount: number;
  successRate: number;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  category: 'quality' | 'security' | 'compliance' | 'performance' | 'accessibility';
  status: 'enforced' | 'monitored' | 'advisory' | 'deprecated';
  severity: 'low' | 'medium' | 'high' | 'critical';
  rules: string[];
  exceptions: string[];
  lastReview: string;
  nextReview: string;
  complianceScore: number;
}

interface RailwayConductorProps extends VariantProps<typeof railwayConductorVariants> {
  projectId: string;
  projectName: string;
  workflows: ProjectWorkflow[];
  automationRules: AutomationRule[];
  governancePolicies: GovernancePolicy[];
  onWorkflowExecute?: (workflowId: string) => void;
  onAutomationRuleExecute?: (ruleId: string) => void;
  className?: string;
}

// ===== RAILWAY CONDUCTOR COMPONENT =====

export function RailwayConductor({
  projectId,
  projectName,
  workflows,
  automationRules,
  governancePolicies,
  onWorkflowExecute,
  onAutomationRuleExecute,
  variant,
  size,
  className,
}: RailwayConductorProps): JSX.Element {
  
  // ===== STATE MANAGEMENT =====
  
  const [activeTab, setActiveTab] = useState('overview');

  // ===== HELPER FUNCTIONS =====
  
  const getWorkflowStatusVariant = (status: ProjectWorkflow['status']): 'success' | 'warning' | 'info' | 'error' => {
    switch (status) {
      case 'active': { return 'success';
      }
      case 'paused': { return 'warning';
      }
      case 'completed': { return 'info';
      }
      case 'error': { return 'error';
      }
      default: { return 'info';
      }
    }
  };

  const getRuleStatusVariant = (status: AutomationRule['status']): 'success' | 'warning' | 'info' | 'error' => {
    switch (status) {
      case 'active': { return 'success';
      }
      case 'inactive': { return 'info';
      }
      case 'error': { return 'error';
      }
      default: { return 'info';
      }
    }
  };

  const getRulePriorityVariant = (priority: AutomationRule['priority']): 'success' | 'warning' | 'info' | 'error' => {
    switch (priority) {
      case 'low': { return 'success';
      }
      case 'medium': { return 'info';
      }
      case 'high': { return 'warning';
      }
      case 'critical': { return 'error';
      }
      default: { return 'info';
      }
    }
  };

  const getPolicyCategoryVariant = (category: GovernancePolicy['category']): 'success' | 'warning' | 'info' | 'error' | 'secondary' => {
    switch (category) {
      case 'quality': { return 'success';
      }
      case 'security': { return 'error';
      }
      case 'compliance': { return 'warning';
      }
      case 'performance': { return 'info';
      }
      case 'accessibility': { return 'secondary';
      }
      default: { return 'info';
      }
    }
  };

  const getPolicySeverityVariant = (severity: GovernancePolicy['severity']): 'success' | 'warning' | 'info' | 'error' => {
    switch (severity) {
      case 'low': { return 'success';
      }
      case 'medium': { return 'info';
      }
      case 'high': { return 'warning';
      }
      case 'critical': { return 'error';
      }
      default: { return 'info';
      }
    }
  };

  const handleWorkflowExecute = (workflowId: string) => {
    if (onWorkflowExecute) {
      onWorkflowExecute(workflowId);
    }
  };

  const handleAutomationRuleExecute = (ruleId: string) => {
    if (onAutomationRuleExecute) {
      onAutomationRuleExecute(ruleId);
    }
  };

  // ===== RENDER FUNCTIONS =====

  const renderConductorHeader = () => (
            <div className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
          ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl
        )}>
      <div className={cn(
        ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
        ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
        ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center,
        ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm
      )}>
        <h2 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.display.medium,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Railway Conductor
        </h2>
        <EnhancedBadge variant="outline" size="lg">
          Project Orchestrator
        </EnhancedBadge>
      </div>
      
      <p className={cn(
        ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
      )}>
        Orchestrating project workflows, automation, and governance for {projectName}
      </p>

      {/* Project Stats */}
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg)}>
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg
          )}>
            {workflows.length}
          </div>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>Active Workflows</div>
        </div>
        
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg
          )}>
            {automationRules.length}
          </div>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>Automation Rules</div>
        </div>
        
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg
          )}>
            {governancePolicies.length}
          </div>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>Governance Policies</div>
        </div>
      </div>

      {/* Project ID */}
      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
        <EnhancedBadge variant="outline" size="sm">
          Project ID: {projectId}
        </EnhancedBadge>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
      {/* System Health */}
      <EnhancedCard variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']}>
        <h3 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          System Health Overview
        </h3>
        
        <div className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-3'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
        )}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg,
            ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated
          )}>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.bg
            )}>
              {workflows.filter(w => w.status === 'active').length}
            </div>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>Active Workflows</div>
          </div>
          
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg,
            ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated
          )}>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.feedback.info.bg
            )}>
              {automationRules.filter(r => r.status === 'active').length}
            </div>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>Active Rules</div>
          </div>
          
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
            ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg,
            ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated
          )}>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.brand.secondary.bg
            )}>
              {governancePolicies.filter(p => p.status === 'enforced').length}
            </div>
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>Enforced Policies</div>
          </div>
        </div>
      </EnhancedCard>

      {/* Recent Activity */}
      <EnhancedCard variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Recent Activity
        </h4>
        
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
          {workflows.slice(0, 3).map((workflow) => (
            <div key={workflow.id} className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['3'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg,
              ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated
            )}>
              <div>
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                )}>{workflow.name}</div>
                              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                Last executed: {workflow.lastExecuted}
              </div>
              </div>
              <EnhancedBadge
                variant={getWorkflowStatusVariant(workflow.status)}
                size="sm"
              >
                {workflow.status}
              </EnhancedBadge>
            </div>
          ))}
        </div>
      </EnhancedCard>

      {/* Quick Actions */}
      <EnhancedCard variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Quick Actions
        </h4>
        
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.wrap, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
          <EnhancedButton variant="outline">
            Create Workflow
          </EnhancedButton>
          
          <EnhancedButton variant="outline">
            Add Automation Rule
          </EnhancedButton>
          
          <EnhancedButton variant="outline">
            Review Policies
          </EnhancedButton>
          
          <EnhancedButton variant="primary">
            System Health Check
          </EnhancedButton>
        </div>
      </EnhancedCard>
    </div>
  );

  const renderWorkflowsTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Project Workflows ({workflows.length})
        </h4>
        
        <EnhancedButton variant="outline" size="sm">
          Create Workflow
        </EnhancedButton>
      </div>

      {workflows.map((workflow) => (
        <EnhancedCard key={workflow.id} variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4']}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between
          )}>
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
              <h4 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {workflow.name}
              </h4>
              <p className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                {workflow.description}
              </p>
            </div>
            
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
              ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm
            )}>
              <EnhancedBadge
                variant={getWorkflowStatusVariant(workflow.status)}
                size="sm"
              >
                {workflow.status}
              </EnhancedBadge>
            </div>
          </div>

          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4'],
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <div><strong>Step:</strong> {workflow.currentStep} / {workflow.totalSteps}</div>
            <div><strong>Duration:</strong> {workflow.estimatedDuration}</div>
            <div><strong>Team:</strong> {workflow.assignedTeam.length} members</div>
            <div><strong>Next:</strong> {workflow.nextExecution}</div>
          </div>

          {/* Progress Bar */}
          <div>
                        <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between
            )}>
              <span className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>Progress</span>
            <span className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.typography.label
            )}>{Math.round(workflow.progress * 100)}%</span>
            </div>
            <EnhancedProgress value={workflow.progress} max={1} variant="default" size="sm" />
          </div>

          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleWorkflowExecute(workflow.id)}
              disabled={workflow.status === 'completed'}
            >
              Execute
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
            >
              View Details
            </EnhancedButton>
          </div>
        </EnhancedCard>
      ))}
    </div>
  );

  const renderAutomationTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Automation Rules ({automationRules.length})
        </h4>
        
        <EnhancedButton variant="outline" size="sm">
          Add Rule
        </EnhancedButton>
      </div>

      {automationRules.map((rule) => (
        <EnhancedCard key={rule.id} variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4']}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between
          )}>
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
              <h4 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {rule.name}
              </h4>
              <p className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                {rule.description}
              </p>
            </div>
            
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
              ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm
            )}>
              <EnhancedBadge
                variant={getRuleStatusVariant(rule.status)}
                size="sm"
              >
                {rule.status}
              </EnhancedBadge>
              
              <EnhancedBadge
                variant={getRulePriorityVariant(rule.priority)}
                size="sm"
              >
                {rule.priority}
              </EnhancedBadge>
            </div>
          </div>

          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4'],
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <div><strong>Trigger:</strong> {rule.trigger.replace('_', ' ')}</div>
            <div><strong>Executions:</strong> {rule.executionCount}</div>
            <div><strong>Success Rate:</strong> {rule.successRate}%</div>
            <div><strong>Last Run:</strong> {rule.lastExecuted}</div>
          </div>

          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleAutomationRuleExecute(rule.id)}
              disabled={rule.status !== 'active'}
            >
              Execute Now
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
            >
              View Details
            </EnhancedButton>
          </div>
        </EnhancedCard>
      ))}
    </div>
  );

  const renderGovernanceTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Governance Policies ({governancePolicies.length})
        </h4>
        
        <EnhancedButton variant="outline" size="sm">
          Add Policy
        </EnhancedButton>
      </div>

      {governancePolicies.map((policy) => (
        <EnhancedCard key={policy.id} variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4']}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start,
            ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between
          )}>
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
              <h4 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {policy.name}
              </h4>
              <p className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                {policy.description}
              </p>
            </div>
            
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
              ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm
            )}>
              <EnhancedBadge
                variant={getPolicyCategoryVariant(policy.category)}
                size="sm"
              >
                {policy.category}
              </EnhancedBadge>
              
              <EnhancedBadge
                variant={getPolicySeverityVariant(policy.severity)}
                size="sm"
              >
                {policy.severity}
              </EnhancedBadge>
            </div>
          </div>

          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4'],
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <div><strong>Status:</strong> {policy.status}</div>
            <div><strong>Rules:</strong> {policy.rules.length}</div>
            <div><strong>Compliance:</strong> {policy.complianceScore}%</div>
            <div><strong>Next Review:</strong> {policy.nextReview}</div>
          </div>

          {/* Compliance Score */}
          <div>
                        <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row,
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center,
              ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between
            )}>
              <span className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>Compliance Score</span>
            <span className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.typography.label
            )}>{policy.complianceScore}%</span>
            </div>
            <EnhancedProgress
              value={policy.complianceScore / 100}
              variant="default"
              size="sm"
            />
          </div>

          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
            <EnhancedButton
              variant="ghost"
              size="sm"
            >
              View Details
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
            >
              Review Policy
            </EnhancedButton>
          </div>
        </EnhancedCard>
      ))}
    </div>
  );

  const renderTabs = () => (
    <EnhancedTabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
              className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
    >
      <EnhancedTabs.List className={cn(
        ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid,
        ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
        ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[4]
      )}>
        <EnhancedTabs.Trigger value="overview">Overview</EnhancedTabs.Trigger>
        <EnhancedTabs.Trigger value="workflows">Workflows ({workflows.length})</EnhancedTabs.Trigger>
        <EnhancedTabs.Trigger value="automation">Automation ({automationRules.length})</EnhancedTabs.Trigger>
        <EnhancedTabs.Trigger value="governance">Governance ({governancePolicies.length})</EnhancedTabs.Trigger>
      </EnhancedTabs.List>
      
              <EnhancedTabs.Content value="overview">
        {renderOverviewTab()}
      </EnhancedTabs.Content>
      
              <EnhancedTabs.Content value="workflows">
        {renderWorkflowsTab()}
      </EnhancedTabs.Content>
      
              <EnhancedTabs.Content value="automation">
        {renderAutomationTab()}
      </EnhancedTabs.Content>
      
              <EnhancedTabs.Content value="governance">
        {renderGovernanceTab()}
      </EnhancedTabs.Content>
    </EnhancedTabs.Root>
  );

  // ===== MAIN RENDER =====

  return (
    <div className={cn(railwayConductorVariants({ variant, size }), className)}>
      {/* Conductor Header */}
      {renderConductorHeader()}

      {/* Conductor Content Tabs */}
      {renderTabs()}
    </div>
  );
}

