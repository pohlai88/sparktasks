/**
 * Railway Station Component - MAPS4 Deep Space Canvas Cosmic Innovation with Fortune 500 Standards
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Cosmic Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Anti-Drift Enforcement: ✅ Enhanced tokens only, no hardcoded values
 * - Enhanced UI Integration: ✅ Uses enhanced UI components exclusively
 * - Fortune 500 Quality: ✅ Sophisticated station system with liquid glass materials
 * - AAA Accessibility: ✅ WCAG 2.1 AA compliance with enforcement mode
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Railway Station variants → User experience
 * - MAPS4 Guidelines → Station hierarchy → Project phase management
 * - MAPS4 Cosmic Philosophy → Primary design approach (NO EXCEPTIONS)
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 * → project station (initiating|planning|executing|monitoring|closing)
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

// ===== RAILWAY STATION VARIANTS =====

/**
 * Railway Station variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const railwayStationVariants = cva(
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
        // Default: Clean station with subtle elevation
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
          ENHANCED_DESIGN_TOKENS.foundation.backdrop.saturate[150],
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

// ===== RAILWAY STATION INTERFACES =====

export interface StationTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  notes: string;
}

export interface StationMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
  deliverables: string[];
  acceptanceCriteria: string[];
}

interface RailwayStationProps extends VariantProps<typeof railwayStationVariants> {
  stationId: string;
  stationName: string;
  pmbokPhase: 'initiating' | 'planning' | 'executing' | 'monitoring' | 'closing';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  description: string;
  academicAnchor: string;
  estimatedDuration: string;
  tasks: StationTask[];
  milestones: StationMilestone[];
  onTaskUpdate?: (taskId: string, updates: Partial<StationTask>) => void;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<StationMilestone>) => void;
  onStationComplete?: (stationId: string) => void;
  className?: string;
}

// ===== RAILWAY STATION COMPONENT =====

export function RailwayStation({
  stationId,
  stationName,
  pmbokPhase,
  status,
  progress,
  description,
  academicAnchor,
  estimatedDuration,
  tasks,
  milestones,
  onTaskUpdate,
  onMilestoneUpdate,
  onStationComplete,
  variant,
  size,
  className,
}: RailwayStationProps): JSX.Element {
  
  // ===== STATE MANAGEMENT =====
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // ===== HELPER FUNCTIONS =====
  
  const getStatusVariant = (status: RailwayStationProps['status']): 'success' | 'warning' | 'info' | 'secondary' => {
    switch (status) {
      case 'completed': { return 'success';
      }
      case 'in_progress': { return 'warning';
      }
      case 'available': { return 'info';
      }
      case 'locked': { return 'secondary';
      }
      default: { return 'secondary';
      }
    }
  };

  const getPMBOKVariant = (): 'outline' => {
    return 'outline';
  };

  const getTaskStatusVariant = (status: StationTask['status']): 'success' | 'warning' | 'info' | 'secondary' => {
    switch (status) {
      case 'completed': { return 'success';
      }
      case 'in_progress': { return 'warning';
      }
      case 'blocked': { return 'secondary';
      }
      case 'pending': { return 'info';
      }
      default: { return 'info';
      }
    }
  };

  const getTaskPriorityVariant = (priority: StationTask['priority']): 'success' | 'warning' | 'info' | 'error' => {
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

  const getMilestoneStatusVariant = (status: StationMilestone['status']): 'success' | 'warning' | 'info' | 'error' => {
    switch (status) {
      case 'completed': { return 'success';
      }
      case 'in_progress': { return 'warning';
      }
      case 'overdue': { return 'error';
      }
      case 'upcoming': { return 'info';
      }
      default: { return 'info';
      }
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: StationTask['status']) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus });
    }
  };

  const handleMilestoneStatusChange = (milestoneId: string, newStatus: StationMilestone['status']) => {
    if (onMilestoneUpdate) {
      onMilestoneUpdate(milestoneId, { status: newStatus });
    }
  };

  const handleStationComplete = () => {
    if (onStationComplete && status !== 'locked') {
      onStationComplete(stationId);
    }
  };

  // ===== RENDER FUNCTIONS =====

  const renderStationHeader = () => (
    <div className={cn(
      ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
      ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.xl
    )}>
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
        <h2 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.display.medium,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          {stationName}
        </h2>
        <EnhancedBadge
          variant={getStatusVariant(status)}
          size="lg"
        >
          {status.replace('_', ' ')}
        </EnhancedBadge>
      </div>
      
      <p className={cn(
        ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
      )}>
        {description}
      </p>

      {/* Progress and Status */}
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.lg)}>
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg
          )}>
            {Math.round(progress * 100)}%
          </div>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>Complete</div>
        </div>
        
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {pmbokPhase.charAt(0).toUpperCase() + pmbokPhase.slice(1)}
          </div>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>PMBOK Phase</div>
        </div>
        
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>{estimatedDuration}</div>
          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>Duration</div>
        </div>
      </div>

      {/* Progress Bar */}
                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-md'], ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'])}>
        <EnhancedProgress
          value={progress}
          variant="default"
          size="lg"
        />
      </div>

      {/* Academic Anchor */}
      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center}>
        <EnhancedBadge variant="outline" size="sm">
          Academic Anchor: {academicAnchor}
        </EnhancedBadge>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
      {/* Station Summary */}
      <EnhancedCard variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['6']}>
                      <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Station Summary
              </h3>
        
        <div className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
        )}>
          <div>
            <strong>PMBOK Phase:</strong>
            <EnhancedBadge
              variant={getPMBOKVariant()}
              size="sm"
              className={undefined}
            >
              {pmbokPhase}
            </EnhancedBadge>
          </div>
          
          <div>
            <strong>Status:</strong>
            <EnhancedBadge
              variant={getStatusVariant(status)}
              size="sm"
              className={undefined}
            >
              {status}
            </EnhancedBadge>
          </div>
          
          <div>
            <strong>Progress:</strong> {Math.round(progress * 100)}%
          </div>
          
          <div>
            <strong>Duration:</strong> {estimatedDuration}
          </div>
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
        
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.wrap, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
          <EnhancedButton
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Station'}
          </EnhancedButton>
          
          {status !== 'locked' && (
            <EnhancedButton
              variant="primary"
              onClick={handleStationComplete}
              disabled={status === 'completed'}
            >
              {status === 'completed' ? 'Station Completed' : 'Mark Complete'}
            </EnhancedButton>
          )}
        </div>
      </EnhancedCard>
    </div>
  );

  const renderTasksTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Station Tasks ({tasks.length})
        </h4>
        
        <EnhancedButton variant="outline" size="sm">
          Add Task
        </EnhancedButton>
      </div>

      {tasks.map((task) => (
        <EnhancedCard key={task.id} variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4']}>
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
              <h4 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {task.title}
              </h4>
              <p className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                {task.description}
              </p>
            </div>
            
            <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm, ENHANCED_DESIGN_TOKENS.foundation.layout.margin['4'])}>
              <EnhancedBadge
                variant={getTaskStatusVariant(task.status)}
                size="sm"
              >
                {task.status.replace('_', ' ')}
              </EnhancedBadge>
              
              <EnhancedBadge
                variant={getTaskPriorityVariant(task.priority)}
                size="sm"
              >
                {task.priority}
              </EnhancedBadge>
            </div>
          </div>

          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4'],
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <div><strong>Assignee:</strong> {task.assignee}</div>
            <div><strong>Due:</strong> {task.dueDate}</div>
            <div><strong>Est. Hours:</strong> {task.estimatedHours}</div>
            <div><strong>Actual Hours:</strong> {task.actualHours}</div>
          </div>

                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
              disabled={task.status === 'in_progress'}
            >
              Start
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleTaskStatusChange(task.id, 'completed')}
              disabled={task.status === 'completed'}
            >
              Complete
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleTaskStatusChange(task.id, 'blocked')}
              disabled={task.status === 'blocked'}
            >
              Block
            </EnhancedButton>
          </div>
        </EnhancedCard>
      ))}
    </div>
  );

  const renderMilestonesTab = () => (
    <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <h4 className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h2,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Station Milestones ({milestones.length})
        </h4>
        
        <EnhancedButton variant="outline" size="sm">
          Add Milestone
        </EnhancedButton>
      </div>

      {milestones.map((milestone) => (
        <EnhancedCard key={milestone.id} variant="elevated" className={ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4']}>
                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.flexbox.grow['1']}>
              <h4 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {milestone.title}
              </h4>
              <p className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                {milestone.description}
              </p>
            </div>
            
            <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm, ENHANCED_DESIGN_TOKENS.foundation.layout.margin['4'])}>
              <EnhancedBadge
                variant={getMilestoneStatusVariant(milestone.status)}
                size="sm"
              >
                {milestone.status.replace('_', ' ')}
              </EnhancedBadge>
            </div>
          </div>

          <div className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
            ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            <div><strong>Target Date:</strong> {milestone.targetDate}</div>
            <div><strong>Deliverables:</strong> {milestone.deliverables.length}</div>
          </div>

                      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleMilestoneStatusChange(milestone.id, 'in_progress')}
              disabled={milestone.status === 'in_progress'}
            >
              Start
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => handleMilestoneStatusChange(milestone.id, 'completed')}
              disabled={milestone.status === 'completed'}
            >
              Complete
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
              <EnhancedTabs.List className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid, ENHANCED_DESIGN_TOKENS.foundation.layout.width.full, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[3])}>
        <EnhancedTabs.Trigger value="overview">Overview</EnhancedTabs.Trigger>
        <EnhancedTabs.Trigger value="tasks">Tasks ({tasks.length})</EnhancedTabs.Trigger>
        <EnhancedTabs.Trigger value="milestones">Milestones ({milestones.length})</EnhancedTabs.Trigger>
      </EnhancedTabs.List>
      
      <EnhancedTabs.Content value="overview">
        {renderOverviewTab()}
      </EnhancedTabs.Content>
      
      <EnhancedTabs.Content value="tasks">
        {renderTasksTab()}
      </EnhancedTabs.Content>
      
      <EnhancedTabs.Content value="milestones">
        {renderMilestonesTab()}
      </EnhancedTabs.Content>
    </EnhancedTabs.Root>
  );

  // ===== MAIN RENDER =====

  return (
    <div className={cn(railwayStationVariants({ variant, size }), className)}>
      {/* Station Header */}
      {renderStationHeader()}

      {/* Station Content Tabs */}
      {renderTabs()}
    </div>
  );
}
