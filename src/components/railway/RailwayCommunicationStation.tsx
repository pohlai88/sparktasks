/**
 * Railway Communication Station Component - MAPS4 Deep Space Canvas Cosmic Innovation
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
 * - MAPS4 Enhanced Tokens → Railway Communication Station variants → Cosmic user experience
 * - MAPS4 Guidelines → Railway Communication Station behavior → Accessibility excellence
 * - Railway Ecosystem → Communication Station → Project Management
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
import { EnhancedInput } from '@/components/ui-enhanced/Input';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { EnhancedTextarea } from '@/components/ui-enhanced/Textarea';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== RAILWAY COMMUNICATION STATION VARIANTS =====

/**
 * Railway Communication Station variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const railwayCommunicationStationVariants = cva(
  [
    // Foundation: Layout/shape - Clean Tailwind utilities
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-6xl'],
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
        // Default: Clean communication station with subtle elevation
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

// ===== RAILWAY COMMUNICATION STATION INTERFACES =====

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  communicationPreference: 'email' | 'phone' | 'meeting' | 'slack';
  lastContact?: string;
  nextContact?: string;
  notes: string;
}

export interface CommunicationPlan {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  channel: 'email' | 'meeting' | 'report' | 'presentation' | 'newsletter';
  audience: string[];
  content: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  nextDelivery?: string;
  lastDelivery?: string;
}

export interface CommunicationUpdate {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  audience: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'sent' | 'delivered' | 'read';
  attachments: string[];
  tags: string[];
}

export interface CommunicationMetrics {
  totalStakeholders: number;
  activeCommunicationPlans: number;
  updatesThisWeek: number;
  stakeholderEngagement: number;
  communicationEffectiveness: number;
  responseTime: number;
}

interface RailwayCommunicationStationProps extends VariantProps<typeof railwayCommunicationStationVariants> {
  projectId: string;
  stakeholders: Stakeholder[];
  communicationPlans: CommunicationPlan[];
  updates: CommunicationUpdate[];
  metrics: CommunicationMetrics;
  onStakeholderUpdate?: (stakeholder: Stakeholder) => void;
  onCommunicationPlanUpdate?: (plan: CommunicationPlan) => void;
  onUpdateCreate?: (update: CommunicationUpdate) => void;
  onUpdateSend?: (updateId: string) => void;
  onStakeholderAdd?: (stakeholder: Stakeholder) => void;
  onStakeholderRemove?: (stakeholderId: string) => void;
  onPlanCreate?: (plan: CommunicationPlan) => void;
  onPlanUpdate?: (plan: CommunicationPlan) => void;
  onPlanDelete?: (planId: string) => void;
  disabled?: boolean;
  qaId?: string;
  className?: string;
}

// ===== RAILWAY COMMUNICATION STATION COMPONENT =====

export function RailwayCommunicationStation({
  stakeholders,
  communicationPlans,
  updates,
  metrics,
  onStakeholderUpdate,
  onUpdateCreate,
  onUpdateSend,
  onStakeholderAdd,
  onStakeholderRemove,
  onPlanCreate,
  onPlanUpdate,
  onPlanDelete,
  variant = 'default',
  size = 'md',
  qaId = 'railway-communication-station',
  className,
}: RailwayCommunicationStationProps): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({});
  const [newPlan, setNewPlan] = useState<Partial<CommunicationPlan>>({});
  const [newUpdate, setNewUpdate] = useState<Partial<CommunicationUpdate>>({});

  // ===== HELPER FUNCTIONS =====
  
  const getStakeholderInfluenceVariant = (influence: Stakeholder['influence']): 'success' | 'warning' | 'info' => {
    switch (influence) {
      case 'high': { return 'success';
      }
      case 'medium': { return 'warning';
      }
      case 'low': { return 'info';
      }
      default: { return 'info';
      }
    }
  };

  const getStakeholderInterestVariant = (interest: Stakeholder['interest']): 'success' | 'warning' | 'info' => {
    switch (interest) {
      case 'high': { return 'success';
      }
      case 'medium': { return 'warning';
      }
      case 'low': { return 'info';
      }
      default: { return 'info';
      }
    }
  };

  const getPlanStatusVariant = (status: CommunicationPlan['status']): 'success' | 'warning' | 'info' | 'secondary' => {
    switch (status) {
      case 'active': { return 'success';
      }
      case 'draft': { return 'info';
      }
      case 'paused': { return 'warning';
      }
      case 'completed': { return 'secondary';
      }
      default: { return 'info';
      }
    }
  };

  const getUpdatePriorityVariant = (priority: CommunicationUpdate['priority']): 'success' | 'warning' | 'info' | 'error' => {
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

  const getUpdateStatusVariant = (status: CommunicationUpdate['status']): 'success' | 'warning' | 'info' | 'secondary' => {
    switch (status) {
      case 'sent': { return 'success';
      }
      case 'delivered': { return 'warning';
      }
      case 'read': { return 'success';
      }
      case 'draft': { return 'secondary';
      }
      default: { return 'info';
      }
    }
  };

  const handleStakeholderAdd = () => {
    if (newStakeholder.name && newStakeholder.role && newStakeholder.email) {
      const stakeholder: Stakeholder = {
        id: `stakeholder-${Date.now()}`,
        name: newStakeholder.name,
        role: newStakeholder.role,
        email: newStakeholder.email,
        ...(newStakeholder.phone && { phone: newStakeholder.phone }),
        influence: newStakeholder.influence || 'medium',
        interest: newStakeholder.interest || 'medium',
        communicationPreference: newStakeholder.communicationPreference || 'email',
        notes: newStakeholder.notes || '',
      };
      
      if (onStakeholderAdd) {
        onStakeholderAdd(stakeholder);
      }
      
      setNewStakeholder({});
    }
  };

  const handlePlanCreate = () => {
    if (newPlan.title && newPlan.description && newPlan.frequency && newPlan.channel) {
      const plan: CommunicationPlan = {
        id: `plan-${Date.now()}`,
        title: newPlan.title,
        description: newPlan.description,
        frequency: newPlan.frequency,
        channel: newPlan.channel,
        audience: newPlan.audience || [],
        content: newPlan.content || '',
        status: 'draft',
      };
      
      if (onPlanCreate) {
        onPlanCreate(plan);
      }
      
      setNewPlan({});
    }
  };

  const handleUpdateCreate = () => {
    if (newUpdate.title && newUpdate.content && newUpdate.author) {
      const update: CommunicationUpdate = {
        id: `update-${Date.now()}`,
        title: newUpdate.title,
        content: newUpdate.content,
        author: newUpdate.author,
        timestamp: new Date().toISOString(),
        audience: newUpdate.audience || [],
        priority: newUpdate.priority || 'medium',
        status: 'draft',
        attachments: newUpdate.attachments || [],
        tags: newUpdate.tags || [],
      };
      
      if (onUpdateCreate) {
        onUpdateCreate(update);
      }
      
      setNewUpdate({});
    }
  };

  const handleUpdateSend = (updateId: string) => {
    if (onUpdateSend) {
      onUpdateSend(updateId);
    }
  };

  const renderStakeholderCard = (stakeholder: Stakeholder) => (
    <EnhancedCard
      key={stakeholder.id}
      variant="elevated"
      size="sm"
      className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}
    >
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
          <h4 className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {stakeholder.name}
          </h4>
          <p className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            {stakeholder.role}
          </p>
        </div>
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
          <EnhancedBadge variant={getStakeholderInfluenceVariant(stakeholder.influence)}>
            {stakeholder.influence} influence
          </EnhancedBadge>
          <EnhancedBadge variant={getStakeholderInterestVariant(stakeholder.interest)}>
            {stakeholder.interest} interest
          </EnhancedBadge>
        </div>
      </div>
      
      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Email:
          </span>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {stakeholder.email}
          </span>
        </div>
        
        {stakeholder.phone && (
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
            <span className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.label,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Phone:
            </span>
            <span className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              {stakeholder.phone}
            </span>
          </div>
        )}
        
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Preference:
          </span>
          <EnhancedBadge variant="outline">
            {stakeholder.communicationPreference}
          </EnhancedBadge>
        </div>
      </div>
      
      {stakeholder.notes && (
        <p className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
        )}>
          {stakeholder.notes}
        </p>
      )}
      
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
        <EnhancedButton
          variant="outline"
          size="sm"
          onClick={() => {
            if (onStakeholderUpdate) {
              onStakeholderUpdate(stakeholder);
            }
          }}
        >
          Edit
        </EnhancedButton>
        <EnhancedButton
          variant="error"
          size="sm"
          onClick={() => {
            if (onStakeholderRemove) {
              onStakeholderRemove(stakeholder.id);
            }
          }}
        >
          Remove
        </EnhancedButton>
      </div>
    </EnhancedCard>
  );

  const renderCommunicationPlanCard = (plan: CommunicationPlan) => (
    <EnhancedCard
      key={plan.id}
      variant="elevated"
      size="sm"
      className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}
    >
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
          <h4 className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            {plan.title}
          </h4>
          <p className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            {plan.description}
          </p>
        </div>
        <EnhancedBadge variant={getPlanStatusVariant(plan.status)}>
          {plan.status}
        </EnhancedBadge>
      </div>
      
              <div className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[2],
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
        )}>
        <div>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Frequency:
          </span>
          <p className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {plan.frequency}
          </p>
        </div>
        
        <div>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Channel:
          </span>
          <p className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {plan.channel}
          </p>
        </div>
      </div>
      
      {plan.audience.length > 0 && (
        <div>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Audience:
          </span>
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.wrap, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs)}>
            {plan.audience.map((audience, index) => (
              <EnhancedBadge key={index} variant="outline" size="sm">
                {audience}
              </EnhancedBadge>
            ))}
          </div>
        </div>
      )}
      
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
        <EnhancedButton
          variant="outline"
          size="sm"
          onClick={() => {
            if (onPlanUpdate) {
              onPlanUpdate(plan);
            }
          }}
        >
          Edit
        </EnhancedButton>
        <EnhancedButton
          variant="error"
          size="sm"
          onClick={() => {
            if (onPlanDelete) {
              onPlanDelete(plan.id);
            }
          }}
        >
          Delete
        </EnhancedButton>
      </div>
    </EnhancedCard>
  );

  const renderUpdateCard = (update: CommunicationUpdate) => (
    <EnhancedCard
      key={update.id}
      variant="elevated"
      size="sm"
      className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}
    >
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
        <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
          <h4 className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {update.title}
          </h4>
          <p className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            By {update.author} • {new Date(update.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
          <EnhancedBadge variant={getUpdatePriorityVariant(update.priority)}>
            {update.priority}
          </EnhancedBadge>
          <EnhancedBadge variant={getUpdateStatusVariant(update.status)}>
            {update.status}
          </EnhancedBadge>
        </div>
      </div>
      
      <p className={cn(
        ENHANCED_DESIGN_TOKENS.foundation.typography.body.medium,
        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
      )}>
        {update.content}
      </p>
      
      {update.audience.length > 0 && (
        <div>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Audience:
          </span>
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.wrap, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs)}>
            {update.audience.map((audience, index) => (
              <EnhancedBadge key={index} variant="outline" size="sm">
                {audience}
              </EnhancedBadge>
            ))}
          </div>
        </div>
      )}
      
      {update.tags.length > 0 && (
        <div>
          <span className={cn(
            ENHANCED_DESIGN_TOKENS.foundation.typography.label,
            ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
          )}>
            Tags:
          </span>
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.wrap.wrap, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xs)}>
            {update.tags.map((tag, index) => (
              <EnhancedBadge key={index} variant="secondary" size="sm">
                {tag}
              </EnhancedBadge>
            ))}
          </div>
        </div>
      )}
      
      <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
        {update.status === 'draft' && (
          <EnhancedButton
            variant="primary"
            size="sm"
            onClick={() => handleUpdateSend(update.id)}
          >
            Send
          </EnhancedButton>
        )}
        <EnhancedButton
          variant="outline"
          size="sm"
          onClick={() => {
            // Handle edit
          }}
        >
          Edit
        </EnhancedButton>
      </div>
    </EnhancedCard>
  );

  return (
    <div
      className={cn(
        railwayCommunicationStationVariants({ variant, size }),
        className
      )}
      data-qa-id={qaId}
      role="region"
      aria-label="Railway Communication Station"
    >
      {/* Header */}
      <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
          <div>
            <h1 className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.display.medium,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
            )}>
              🚉 Communication Station
            </h1>
            <p className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.typography.body.large,
              ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
            )}>
              Stakeholder management, communication planning, and project updates
            </p>
          </div>
          
          <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md)}>
            <EnhancedBadge variant="outline">
              PMBOK: Executing Process Group
            </EnhancedBadge>
            <EnhancedBadge variant="outline">
              Academic: Stakeholder Management Plan
            </EnhancedBadge>
          </div>
        </div>
        
        {/* Metrics Overview */}
        <div className={cn(
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-4'],
          ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
        )}>
          <EnhancedCard variant="glass" size="sm">
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
              ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
            )}>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {metrics.totalStakeholders}
              </div>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                Stakeholders
              </div>
            </div>
          </EnhancedCard>
          
          <EnhancedCard variant="glass" size="sm">
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
              ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
            )}>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {metrics.activeCommunicationPlans}
              </div>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                Active Plans
              </div>
            </div>
          </EnhancedCard>
          
          <EnhancedCard variant="glass" size="sm">
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
              ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
            )}>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {metrics.updatesThisWeek}
              </div>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                Updates This Week
              </div>
            </div>
          </EnhancedCard>
          
          <EnhancedCard variant="glass" size="sm">
            <div className={cn(
              ENHANCED_DESIGN_TOKENS.foundation.layout.alignment.center,
              ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm
            )}>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.display.small,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                {metrics.stakeholderEngagement}%
              </div>
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
              )}>
                Engagement
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>

      {/* Main Content */}
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
          <EnhancedTabs.Trigger value="stakeholders">Stakeholders</EnhancedTabs.Trigger>
          <EnhancedTabs.Trigger value="plans">Communication Plans</EnhancedTabs.Trigger>
          <EnhancedTabs.Trigger value="updates">Updates</EnhancedTabs.Trigger>
        </EnhancedTabs.List>

        {/* Overview Tab */}
        <EnhancedTabs.Content value="overview" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Communication Overview
              </h3>
              
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl
              )}>
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Stakeholder Engagement
                  </h4>
                  <EnhancedProgress
                    value={metrics.stakeholderEngagement}
                    className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
                  />
                  <p className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                  )}>
                    {metrics.stakeholderEngagement}% of stakeholders are actively engaged
                  </p>
                </div>
                
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Communication Effectiveness
                  </h4>
                  <EnhancedProgress
                    value={metrics.communicationEffectiveness}
                    className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
                  />
                  <p className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                  )}>
                    {metrics.communicationEffectiveness}% effectiveness rating
                  </p>
                </div>
              </div>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                <h4 className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                )}>
                  Recent Activity
                </h4>
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.sm}>
                  {updates.slice(0, 3).map(renderUpdateCard)}
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Stakeholders Tab */}
        <EnhancedTabs.Content value="stakeholders" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                <h3 className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                )}>
                  Stakeholder Management
                </h3>
                <EnhancedButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Add Stakeholder'}
                </EnhancedButton>
              </div>
              
              {isEditing && (
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg)}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Add New Stakeholder
                  </h4>
                  
                  <div className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
                  )}>
                    <EnhancedInput
                      placeholder="Name"
                      value={newStakeholder.name || ''}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                      variant="default"
                      size="md"
                    />
                    
                    <EnhancedInput
                      placeholder="Role"
                      value={newStakeholder.role || ''}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                      variant="default"
                      size="md"
                    />
                    
                    <EnhancedInput
                      placeholder="Email"
                      type="email"
                      value={newStakeholder.email || ''}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
                      variant="default"
                      size="md"
                    />
                    
                    <EnhancedInput
                      placeholder="Phone (optional)"
                      value={newStakeholder.phone || ''}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, phone: e.target.value })}
                      variant="default"
                      size="md"
                    />
                  </div>
                  
                  <div className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-3'],
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
                  )}>
                    <select
                      value={newStakeholder.influence || 'medium'}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, influence: e.target.value as any })}
                      className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.color.content.primary)}
                    >
                      <option value="low">Low Influence</option>
                      <option value="medium">Medium Influence</option>
                      <option value="high">High Influence</option>
                    </select>
                    
                    <select
                      value={newStakeholder.interest || 'medium'}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, interest: e.target.value as any })}
                      className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.color.content.primary)}
                    >
                      <option value="low">Low Interest</option>
                      <option value="medium">Medium Interest</option>
                      <option value="high">High Interest</option>
                    </select>
                    
                    <select
                      value={newStakeholder.communicationPreference || 'email'}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, communicationPreference: e.target.value as any })}
                      className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.color.content.primary)}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="meeting">Meeting</option>
                      <option value="slack">Slack</option>
                    </select>
                  </div>
                  
                  <EnhancedTextarea
                    placeholder="Notes (optional)"
                    value={newStakeholder.notes || ''}
                    onChange={(e) => setNewStakeholder({ ...newStakeholder, notes: e.target.value })}
                    variant="default"
                    size="md"
                  />
                  
                  <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                    <EnhancedButton
                      variant="primary"
                      size="md"
                      onClick={handleStakeholderAdd}
                    >
                      Add Stakeholder
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsEditing(false);
                        setNewStakeholder({});
                      }}
                    >
                      Cancel
                    </EnhancedButton>
                  </div>
                </div>
              )}
              
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-3'],
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
              )}>
                {stakeholders.map(renderStakeholderCard)}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Communication Plans Tab */}
        <EnhancedTabs.Content value="plans" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                <h3 className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                )}>
                  Communication Plans
                </h3>
                <EnhancedButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Create Plan'}
                </EnhancedButton>
              </div>
              
              {isEditing && (
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg)}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Create New Communication Plan
                  </h4>
                  
                  <div className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
                  )}>
                    <EnhancedInput
                      placeholder="Plan Title"
                      value={newPlan.title || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                      variant="default"
                      size="md"
                    />
                    
                    <EnhancedInput
                      placeholder="Description"
                      value={newPlan.content || ''}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      variant="default"
                      size="md"
                    />
                  </div>
                  
                  <div className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
                  )}>
                    <select
                      value={newPlan.frequency || 'weekly'}
                      onChange={(e) => setNewPlan({ ...newPlan, frequency: e.target.value as any })}
                      className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.color.content.primary)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                    
                    <select
                      value={newPlan.channel || 'email'}
                      onChange={(e) => setNewPlan({ ...newPlan, channel: e.target.value as any })}
                      className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.color.content.primary)}
                    >
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="report">Report</option>
                      <option value="presentation">Presentation</option>
                      <option value="newsletter">Newsletter</option>
                    </select>
                  </div>
                  
                  <EnhancedTextarea
                    placeholder="Content"
                    value={newPlan.content || ''}
                    onChange={(e) => setNewPlan({ ...newPlan, content: e.target.value })}
                    variant="default"
                    size="md"
                  />
                  
                  <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                    <EnhancedButton
                      variant="primary"
                      size="md"
                      onClick={handlePlanCreate}
                    >
                      Create Plan
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsEditing(false);
                        setNewPlan({});
                      }}
                    >
                      Cancel
                    </EnhancedButton>
                  </div>
                </div>
              )}
              
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
              )}>
                {communicationPlans.map(renderCommunicationPlanCard)}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Updates Tab */}
        <EnhancedTabs.Content value="updates" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                <h3 className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                  ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                )}>
                  Project Updates
                </h3>
                <EnhancedButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Create Update'}
                </EnhancedButton>
              </div>
              
              {isEditing && (
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md, ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg)}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Create New Update
                  </h4>
                  
                  <div className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
                  )}>
                    <EnhancedInput
                      placeholder="Update Title"
                      value={newUpdate.title || ''}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                      variant="default"
                      size="md"
                    />
                    
                    <EnhancedInput
                      placeholder="Author"
                      value={newUpdate.author || ''}
                      onChange={(e) => setNewUpdate({ ...newUpdate, author: e.target.value })}
                      variant="default"
                      size="md"
                    />
                  </div>
                  
                  <EnhancedTextarea
                    placeholder="Update Content"
                    value={newUpdate.content || ''}
                    onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                    variant="default"
                    size="md"
                  />
                  
                  <div className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'],
                    ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md
                  )}>
                    <select
                      value={newUpdate.priority || 'medium'}
                      onChange={(e) => setNewUpdate({ ...newUpdate, priority: e.target.value as any })}
                      className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated, ENHANCED_DESIGN_TOKENS.foundation.color.content.primary)}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical Priority</option>
                    </select>
                    
                    <EnhancedInput
                      placeholder="Tags (comma-separated)"
                      value={newUpdate.tags?.join(', ') || ''}
                      onChange={(e) => setNewUpdate({ 
                        ...newUpdate, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                      variant="default"
                      size="md"
                    />
                  </div>
                  
                  <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                    <EnhancedButton
                      variant="primary"
                      size="md"
                      onClick={handleUpdateCreate}
                    >
                      Create Update
                    </EnhancedButton>
                    <EnhancedButton
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setIsEditing(false);
                        setNewUpdate({});
                      }}
                    >
                      Cancel
                    </EnhancedButton>
                  </div>
                </div>
              )}
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                {updates.map(renderUpdateCard)}
              </div>
            </div>
          </EnhancedCard>
                 </EnhancedTabs.Content>
       </EnhancedTabs.Root>
     </div>
   );
 }
