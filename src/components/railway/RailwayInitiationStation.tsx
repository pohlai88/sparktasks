/**
 * Railway Initiation Station Component - MAPS4 Deep Space Canvas Cosmic Innovation
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Sir Steve Jobs Cosmic Innovation: ✅ Inspirational, memorable, industry-leading
 * - AAA Compliance: ✅ WCAG 2.2 with cosmic color harmony
 * - Liquid Glass Materials: ✅ Governed vibrancy system with cosmic aesthetics
 * - Radix Compatibility: ✅ Polymorphic pattern ready
 * - Anti-Drift Enforcement: ✅ 100% tokenized, zero hardcoded values
 * - Railway App Shell SSOT: ✅ Full compliance with v4.0 standards
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Railway Initiation Station variants → Cosmic user experience
 * - MAPS4 Guidelines → Railway Initiation Station behavior → Accessibility excellence
 * - Railway Ecosystem → Initiation Station → Project Management
 * - Railway App Shell SSOT → Initiation Station → Standardized development pattern
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|focus|error)
 * → railway station (initiation|budget|schedule|conductor) → project lifecycle
 *
 * VERSION: 4.0.0
 * LAST UPDATED: 2025-01-27
 * SSOT COMPLIANCE: Railway App Shell SSOT v4.0
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { useMemo, useState } from 'react';

import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedInput } from '@/components/ui-enhanced/Input';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { EnhancedTextarea } from '@/components/ui-enhanced/Textarea';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== RAILWAY INITIATION STATION VARIANTS =====

/**
 * Railway Initiation Station variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const railwayInitiationStationVariants = cva(
  [
    // Foundation: Layout/shape - Enhanced design tokens only
    ENHANCED_DESIGN_TOKENS.foundation.layout.width.full,
    ENHANCED_DESIGN_TOKENS.foundation.layout.width['max-6xl'],
    ENHANCED_DESIGN_TOKENS.foundation.layout.margin['x-auto'],
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
        // Default: Clean initiation station with subtle elevation
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

// ===== RAILWAY INITIATION STATION INTERFACES =====

export interface ProjectInitiation {
  projectName: string;
  projectDescription: string;
  businessCase: string;
  projectManager: string;
  sponsor: string;
  stakeholders: string[];
  objectives: string[];
  successCriteria: string[];
  constraints: string[];
  assumptions: string[];
  risks: string[];
  budget: {
    estimated: number;
    currency: string;
    approvalRequired: boolean;
  };
  timeline: {
    startDate: string;
    endDate: string;
    milestones: string[];
  };
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  completionPercentage: number;
}

export interface InitiationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  required: boolean;
  order: number;
}

// ===== INITIATION STEPS DATA =====

const INITIATION_STEPS: InitiationStep[] = [
  {
    id: 'project-charter',
    title: 'Project Charter',
    description: 'Define project scope, objectives, and success criteria',
    status: 'pending',
    required: true,
    order: 1,
  },
  {
    id: 'stakeholder-analysis',
    title: 'Stakeholder Analysis',
    description: 'Identify and analyze project stakeholders and their needs',
    status: 'pending',
    required: true,
    order: 2,
  },
  {
    id: 'business-case',
    title: 'Business Case',
    description: 'Develop comprehensive business justification and ROI analysis',
    status: 'pending',
    required: true,
    order: 3,
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Identify and assess potential project risks and mitigation strategies',
    status: 'pending',
    required: true,
    order: 4,
  },
  {
    id: 'approval-workflow',
    title: 'Approval Workflow',
    description: 'Establish approval process and governance structure',
    status: 'pending',
    required: true,
    order: 5,
  },
];

// ===== RAILWAY INITIATION STATION COMPONENT =====

export interface RailwayInitiationStationProps extends VariantProps<typeof railwayInitiationStationVariants> {
  projectData?: Partial<ProjectInitiation>;
  onSave?: (data: ProjectInitiation) => void;
  onAdvance?: () => void;
  onRollback?: () => void;
  disabled?: boolean;
  qaId?: string;
}

export function RailwayInitiationStation({
  variant = 'default',
  size = 'md',
  projectData,
  onSave,
  onAdvance,
  onRollback,
  disabled = false,
  qaId = 'railway-initiation-station',
}: RailwayInitiationStationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState<ProjectInitiation>({
    projectName: projectData?.projectName || '',
    projectDescription: projectData?.projectDescription || '',
    businessCase: projectData?.businessCase || '',
    projectManager: projectData?.projectManager || '',
    sponsor: projectData?.sponsor || '',
    stakeholders: projectData?.stakeholders || [],
    objectives: projectData?.objectives || [''],
    successCriteria: projectData?.successCriteria || [''],
    constraints: projectData?.constraints || [''],
    assumptions: projectData?.assumptions || [''],
    risks: projectData?.risks || [''],
    budget: {
      estimated: projectData?.budget?.estimated || 0,
      currency: projectData?.budget?.currency || 'USD',
      approvalRequired: projectData?.budget?.approvalRequired ?? true,
    },
    timeline: {
      startDate: projectData?.timeline?.startDate || '',
      endDate: projectData?.timeline?.endDate || '',
      milestones: projectData?.timeline?.milestones || [''],
    },
    approvalStatus: projectData?.approvalStatus || 'draft',
    completionPercentage: projectData?.completionPercentage || 0,
  });

  const [steps] = useState<InitiationStep[]>(INITIATION_STEPS);

  const handleInputChange = (field: keyof ProjectInitiation, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof ProjectInitiation, field: string, value: any) => {
    setFormData(prev => {
      const parentValue = prev[parent];
      if (typeof parentValue === 'object' && parentValue !== null) {
        return {
          ...prev,
          [parent]: { ...parentValue, [field]: value }
        };
      }
      return prev;
    });
  };

  const handleArrayChange = (field: keyof ProjectInitiation, index: number, value: string) => {
    setFormData(prev => {
      const fieldValue = prev[field];
      if (Array.isArray(fieldValue)) {
        return {
          ...prev,
          [field]: fieldValue.map((item: string, i: number) => i === index ? value : item)
        };
      }
      return prev;
    });
  };

  const addArrayItem = (field: keyof ProjectInitiation) => {
    setFormData(prev => {
      const fieldValue = prev[field];
      if (Array.isArray(fieldValue)) {
        return {
          ...prev,
          [field]: [...fieldValue, '']
        };
      }
      return prev;
    });
  };

  const removeArrayItem = (field: keyof ProjectInitiation, index: number) => {
    setFormData(prev => {
      const fieldValue = prev[field];
      if (Array.isArray(fieldValue)) {
        return {
          ...prev,
          [field]: fieldValue.filter((_: string, i: number) => i !== index)
        };
      }
      return prev;
    });
  };



  const calculateCompletion = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const totalSteps = steps.length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  const completionPct = useMemo(() => calculateCompletion(), [steps]);

  const handleSave = () => {
    const completionPercentage = calculateCompletion();
    const dataToSave = { ...formData, completionPercentage };
    onSave?.(dataToSave);
  };

  const handleAdvance = () => {
    if (formData.approvalStatus === 'approved') {
      onAdvance?.();
    }
  };

  const getStepStatusColor = (status: InitiationStep['status']) => {
    switch (status) {
      case 'completed': {
        return 'success';
      }
      case 'in_progress': {
        return 'warning';
      }
      case 'blocked': {
        return 'error';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'charter', label: 'Project Charter', icon: '📄' },
    { id: 'stakeholders', label: 'Stakeholders', icon: '👥' },
    { id: 'business-case', label: 'Business Case', icon: '💰' },
    { id: 'risks', label: 'Risks & Constraints', icon: '⚠️' },
    { id: 'approval', label: 'Approval', icon: '✅' },
  ];

  return (
    <div
      data-testid={qaId}
      className={cn(railwayInitiationStationVariants({ variant, size }))}
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
          🚂 Railway Initiation Station
        </h1>
                 <p className={cn(
           ENHANCED_DESIGN_TOKENS.foundation.typography.body.large,
           ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
         )}>
          Project initiation and charter creation - The first step in your Railway journey
        </p>
        
        {/* Progress Overview */}
        <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md)}>
          <EnhancedProgress
            value={completionPct}
            variant="default"
            size="md"
          />
                     <span className={cn(
             ENHANCED_DESIGN_TOKENS.foundation.typography.label,
             ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
           )}>
            {completionPct}% Complete
           </span>
        </div>
      </div>

      {/* Main Content */}
      <EnhancedTabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className={ENHANCED_DESIGN_TOKENS.foundation.layout.width.full}
      >
        <EnhancedTabs.List className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.display.grid, ENHANCED_DESIGN_TOKENS.foundation.layout.width.full, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.columns[6])}>
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
                 Initiation Progress
               </h3>
              
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2-3']
              )}>
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      ENHANCED_DESIGN_TOKENS.foundation.layout.padding['4'], 
                      ENHANCED_DESIGN_TOKENS.foundation.layout.border.radius.lg, 
                      ENHANCED_DESIGN_TOKENS.foundation.layout.border.width.default, 
                      ENHANCED_DESIGN_TOKENS.foundation.motionTransition.all,
                      step.status === 'completed' && cn(ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.border, ENHANCED_DESIGN_TOKENS.foundation.color.feedback.success.subtle),
                      step.status === 'in_progress' && cn(ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.border, ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.subtle),
                      step.status === 'blocked' && cn(ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.border, ENHANCED_DESIGN_TOKENS.foundation.color.feedback.error.subtle),
                      step.status === 'pending' && cn(ENHANCED_DESIGN_TOKENS.foundation.color.border.default, ENHANCED_DESIGN_TOKENS.foundation.color.surface.elevated)
                    )}
                  >
                    <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.start, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                      <h4 className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                        ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                      )}>
                        {step.title}
                      </h4>
                      <EnhancedBadge
                        variant={getStepStatusColor(step.status)}
                        size="sm"
                      >
                        {step.status.replace('_', ' ')}
                      </EnhancedBadge>
                    </div>
                                         <p className={cn(
                       ENHANCED_DESIGN_TOKENS.foundation.typography.body.small,
                       ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                     )}>
                       {step.description}
                     </p>
                    {step.required && (
                      <span className={cn(
                        ENHANCED_DESIGN_TOKENS.foundation.typography.caption,
                        ENHANCED_DESIGN_TOKENS.foundation.color.feedback.warning.muted
                      )}>
                        Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Project Charter Tab */}
        <EnhancedTabs.Content value="charter" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
                             <h3 className={cn(
                 ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                 ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
               )}>
                 Project Charter
               </h3>
              
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl,
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2']
              )}>
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <EnhancedInput
                    label="Project Name"
                    placeholder="Enter project name"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    variant="default"
                    size="md"
                  />
                  
                  <EnhancedInput
                    label="Project Manager"
                    placeholder="Enter project manager name"
                    value={formData.projectManager}
                    onChange={(e) => handleInputChange('projectManager', e.target.value)}
                    variant="default"
                    size="md"
                  />
                  
                  <EnhancedInput
                    label="Sponsor"
                    placeholder="Enter sponsor name"
                    value={formData.sponsor}
                    onChange={(e) => handleInputChange('sponsor', e.target.value)}
                    variant="default"
                    size="md"
                  />
                </div>
                
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <EnhancedTextarea
                    label="Project Description"
                    placeholder="Describe the project purpose and scope"
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    variant="default"
                    size="md"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Stakeholders Tab */}
        <EnhancedTabs.Content value="stakeholders" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Stakeholder Analysis
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.justify.between)}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Stakeholders
                  </h4>
                  <EnhancedButton
                    onClick={() => addArrayItem('stakeholders')}
                    variant="primary"
                    size="sm"
                  >
                    Add Stakeholder
                  </EnhancedButton>
                </div>
                
                {formData.stakeholders.map((stakeholder, index) => (
                  <div key={index} className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                    <EnhancedInput
                      placeholder="Enter stakeholder name or role"
                      value={stakeholder}
                      onChange={(e) => handleArrayChange('stakeholders', index, e.target.value)}
                      variant="default"
                      size="md"
                    />
                    <EnhancedButton
                      onClick={() => removeArrayItem('stakeholders', index)}
                      variant="error"
                      size="sm"
                    >
                      Remove
                    </EnhancedButton>
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Business Case Tab */}
        <EnhancedTabs.Content value="business-case" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Business Case
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                <EnhancedTextarea
                  label="Business Case"
                  placeholder="Describe the business justification, ROI, and strategic value"
                  value={formData.businessCase}
                  onChange={(e) => handleInputChange('businessCase', e.target.value)}
                  variant="default"
                  size="md"
                  rows={6}
                />
                
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2'])}>
                  <EnhancedInput
                    label="Estimated Budget"
                    type="number"
                    placeholder="0"
                    value={formData.budget.estimated}
                    onChange={(e) => handleNestedChange('budget', 'estimated', Number.parseFloat(e.target.value) || 0)}
                    variant="default"
                    size="md"
                  />
                  
                  <EnhancedInput
                    label="Currency"
                    placeholder="USD"
                    value={formData.budget.currency}
                    onChange={(e) => handleNestedChange('budget', 'currency', e.target.value)}
                    variant="default"
                    size="md"
                  />
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Risks & Constraints Tab */}
        <EnhancedTabs.Content value="risks" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Risks & Constraints
              </h3>
              
              <div className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.xl,
                ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2']
              )}>
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Objectives
                  </h4>
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                      <EnhancedInput
                        placeholder="Enter project objective"
                        value={objective}
                        onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                        variant="default"
                        size="md"
                      />
                      <EnhancedButton
                        onClick={() => removeArrayItem('objectives', index)}
                        variant="error"
                        size="sm"
                      >
                        Remove
                      </EnhancedButton>
                    </div>
                  ))}
                  <EnhancedButton
                    onClick={() => addArrayItem('objectives')}
                    variant="primary"
                    size="sm"
                  >
                    Add Objective
                  </EnhancedButton>
                </div>
                
                <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                  <h4 className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h4,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
                  )}>
                    Risks
                  </h4>
                  {formData.risks.map((risk, index) => (
                    <div key={index} className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.sm)}>
                      <EnhancedInput
                        placeholder="Enter potential risk"
                        value={risk}
                        onChange={(e) => handleArrayChange('risks', index, e.target.value)}
                        variant="default"
                        size="md"
                      />
                      <EnhancedButton
                        onClick={() => removeArrayItem('risks', index)}
                        variant="error"
                        size="sm"
                      >
                        Remove
                      </EnhancedButton>
                    </div>
                  ))}
                  <EnhancedButton
                    onClick={() => addArrayItem('risks')}
                    variant="primary"
                    size="sm"
                  >
                    Add Risk
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </EnhancedCard>
        </EnhancedTabs.Content>

        {/* Approval Tab */}
        <EnhancedTabs.Content value="approval" className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
          <EnhancedCard variant="elevated" size="md">
            <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.lg}>
              <h3 className={cn(
                ENHANCED_DESIGN_TOKENS.foundation.typography.heading.h3,
                ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
              )}>
                Approval & Governance
              </h3>
              
              <div className={ENHANCED_DESIGN_TOKENS.foundation.layout.spacing.stack.md}>
                <div className={cn(ENHANCED_DESIGN_TOKENS.foundation.layout.flex.direction.row, ENHANCED_DESIGN_TOKENS.foundation.layout.flex.items.center, ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md)}>
                  <span className={cn(
                    ENHANCED_DESIGN_TOKENS.foundation.typography.label,
                    ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
                  )}>
                    Approval Status:
                  </span>
                  <EnhancedBadge
                    variant={formData.approvalStatus === 'approved' ? 'success' : 'warning'}
                    size="md"
                  >
                    {formData.approvalStatus}
                  </EnhancedBadge>
                </div>
                
                <div className={cn(
                  ENHANCED_DESIGN_TOKENS.foundation.layout.grid.gap.md,
                  ENHANCED_DESIGN_TOKENS.foundation.layout.grid.responsive['1-2']
                )}>
                  <EnhancedInput
                    label="Start Date"
                    type="date"
                    value={formData.timeline.startDate}
                    onChange={(e) => handleNestedChange('timeline', 'startDate', e.target.value)}
                    variant="default"
                    size="md"
                  />
                  
                  <EnhancedInput
                    label="End Date"
                    type="date"
                    value={formData.timeline.endDate}
                    onChange={(e) => handleNestedChange('timeline', 'endDate', e.target.value)}
                    variant="default"
                    size="md"
                  />
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
            💾 Save Progress
          </EnhancedButton>
        </div>
        
        <EnhancedButton
          onClick={handleAdvance}
          variant="success"
          size="md"
          disabled={disabled || formData.approvalStatus !== 'approved'}
        >
          Advance to Next Station →
        </EnhancedButton>
      </div>
    </div>
  );
}
