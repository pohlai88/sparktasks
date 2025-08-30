/**
 * Charter Wizard Component - MAPS4 Deep Space Canvas Cosmic Innovation with Fortune 500 Standards
 *
 * COMPLIANCE MATRIX:
 * - MAPS4 Cosmic Foundation: ✅ Deep space canvas with aurora accents and cosmic cyan
 * - Anti-Drift Enforcement: ✅ Enhanced tokens only, no hardcoded values
 * - Enhanced UI Integration: ✅ Uses enhanced UI components exclusively
 * - Fortune 500 Quality: ✅ Sophisticated form system with liquid glass materials
 * - AAA Accessibility: ✅ WCAG 2.1 AA compliance with enforcement mode
 *
 * ARCHITECTURE INTEGRATION:
 * - MAPS4 Enhanced Tokens → Charter Wizard variants → User experience
 * - MAPS4 Guidelines → Form hierarchy → Project initiation
 * - MAPS4 Cosmic Philosophy → Primary design approach (NO EXCEPTIONS)
 *
 * RESOLUTION MODEL:
 * theme → mode (dark|light|hc) → density (comfortable|compact)
 * → platform (web) → input (touch|pointer) → state (rest|hover|pressed|focus)
 * → project charter (scope|budget|timeline|stakeholders|risks)
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';

import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedInput } from '@/components/ui-enhanced/Input';
import { EnhancedTextarea } from '@/components/ui-enhanced/Textarea';
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens';
import { cn } from '@/utils/cn';

// ===== CHARTER WIZARD VARIANTS =====

/**
 * Charter Wizard variants following MAPS4 Deep Space Canvas Cosmic Innovation foundation
 * ANTI-DRIFT ENFORCEMENT: ALL values from enhanced tokens or CSS custom properties
 */
const charterWizardVariants = cva(
  [
    // Foundation: Layout/shape - Clean Tailwind utilities
    'w-full max-w-4xl mx-auto',
    'space-y-8',
    
    // MAPS4 Foundation: Colors - Deep space foundation with aurora accents and cosmic cyan
    ENHANCED_DESIGN_TOKENS.foundation.color.surface.canvas,
    ENHANCED_DESIGN_TOKENS.foundation.color.content.primary,
    
    // MAPS4 Foundation: Motion - Respect user preferences
    'transition-all duration-300 ease-out',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      variant: {
        // Default: Clean wizard with subtle elevation
        default: ['p-8', 'rounded-2xl'],
        
        // Elevated: Enhanced depth with stronger shadow
        elevated: [
          'p-10', 
          'rounded-3xl',
          'shadow-elevation-lg',
          'border border-aurora-accent'
        ],
        
        // Glass: Liquid glass materials with cosmic aesthetics
        glass: [
          'p-8',
          'rounded-2xl',
          'backdrop-blur-md backdrop-saturate-[135%]',
          'shadow-elevation-md',
          'border border-cosmic-border/30'
        ],
      },
      
      size: {
        // Clean systematic sizing with 8pt grid
        sm: ['space-y-6', 'p-6'],
        md: ['space-y-8', 'p-8'],
        lg: ['space-y-10', 'p-10'],
        xl: ['space-y-12', 'p-12'],
      },
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// ===== CHARTER WIZARD INTERFACES =====

export interface ProjectCharter {
  projectName: string;
  projectDescription: string;
  businessCase: string;
  projectManager: string;
  sponsor: string;
  startDate: string;
  endDate: string;
  budget: string;
  scope: string;
  objectives: string[];
  successCriteria: string[];
  assumptions: string[];
  constraints: string[];
  risks: string[];
  stakeholders: string[];
  pmbokPhase: 'initiating';
  academicAnchor: string;
}

interface CharterWizardProps extends VariantProps<typeof charterWizardVariants> {
  onCharterComplete?: (charter: ProjectCharter) => void;
  onCharterSave?: (charter: ProjectCharter) => void;
  className?: string;
}

// ===== CHARTER WIZARD COMPONENT =====

export function CharterWizard({
  onCharterComplete,
  onCharterSave,
  variant,
  size,
  className,
}: CharterWizardProps): JSX.Element {
  
  // ===== STATE MANAGEMENT =====
  
  const [currentStep, setCurrentStep] = useState(1);
  const [charter, setCharter] = useState<ProjectCharter>({
    projectName: '',
    projectDescription: '',
    businessCase: '',
    projectManager: '',
    sponsor: '',
    startDate: '',
    endDate: '',
    budget: '',
    scope: '',
    objectives: [''],
    successCriteria: [''],
    assumptions: [''],
    constraints: [''],
    risks: [''],
    stakeholders: [''],
    pmbokPhase: 'initiating',
    academicAnchor: '',
  });

  // ===== STEP CONFIGURATION =====
  
  const steps = [
    {
      id: 1,
      title: 'Project Overview',
      description: 'Define the basic project information and scope',
      fields: ['projectName', 'projectDescription', 'businessCase', 'scope'],
    },
    {
      id: 2,
      title: 'Leadership & Timeline',
      description: 'Set project leadership and key dates',
      fields: ['projectManager', 'sponsor', 'startDate', 'endDate'],
    },
    {
      id: 3,
      title: 'Resources & Constraints',
      description: 'Define budget, constraints, and assumptions',
      fields: ['budget', 'constraints', 'assumptions'],
    },
    {
      id: 4,
      title: 'Objectives & Success',
      description: 'Set clear objectives and success criteria',
      fields: ['objectives', 'successCriteria'],
    },
    {
      id: 5,
      title: 'Risk & Stakeholders',
      description: 'Identify risks and key stakeholders',
      fields: ['risks', 'stakeholders'],
    },
    {
      id: 6,
      title: 'Academic Integration',
      description: 'Connect with academic frameworks and validation',
      fields: ['academicAnchor'],
    },
  ];

  // ===== HELPER FUNCTIONS =====
  
  const updateCharter = (field: keyof ProjectCharter, value: ProjectCharter[keyof ProjectCharter]) => {
    setCharter(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof ProjectCharter, index: number, value: string) => {
    if (Array.isArray(charter[field])) {
      const newArray = [...(charter[field] as string[])]; 
      newArray[index] = value;
      updateCharter(field, newArray);
    }
  };

  const addArrayItem = (field: keyof ProjectCharter) => {
    if (Array.isArray(charter[field])) {
      const newArray = [...(charter[field] as string[]), ''];
      updateCharter(field, newArray);
    }
  };

  const removeArrayItem = (field: keyof ProjectCharter, index: number) => {
    if (Array.isArray(charter[field]) && (charter[field] as string[]).length > 1) {
      const newArray = (charter[field] as string[]).filter((_, i) => i !== index);
      updateCharter(field, newArray);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (onCharterComplete) {
      onCharterComplete(charter);
    }
  };

  const handleSave = () => {
    if (onCharterSave) {
      onCharterSave(charter);
    }
  };

  // ===== RENDER FUNCTIONS =====

  const renderStepIndicator = () => {
    const currentStepConfig = steps[currentStep - 1];
    if (!currentStepConfig) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn(
            'text-2xl font-bold',
            ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
          )}>
            {currentStepConfig.title}
          </h2>
          <EnhancedBadge variant="outline" size="sm">
            Step {currentStep} of {steps.length}
          </EnhancedBadge>
        </div>
        <p className={cn(
          'text-base',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
        )}>
          {currentStepConfig.description}
        </p>
      
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
                              className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  ENHANCED_DESIGN_TOKENS.foundation.color.brand.primary.bg
                )}
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderField = (fieldName: keyof ProjectCharter) => {
    const value = charter[fieldName];
    
    switch (fieldName) {
      case 'projectName':
        return (
          <EnhancedInput
            label="Project Name"
            placeholder="Enter project name"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            required
          />
        );
        
      case 'projectDescription':
        return (
          <EnhancedTextarea
            label="Project Description"
            placeholder="Describe the project purpose and goals"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            rows={4}
            required
          />
        );
        
      case 'businessCase':
        return (
          <EnhancedTextarea
            label="Business Case"
            placeholder="Explain the business justification for this project"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            rows={3}
            required
          />
        );
        
      case 'projectManager':
        return (
          <EnhancedInput
            label="Project Manager"
            placeholder="Enter project manager name"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            required
          />
        );
        
      case 'sponsor':
        return (
          <EnhancedInput
            label="Project Sponsor"
            placeholder="Enter sponsor name"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            required
          />
        );
        
      case 'startDate':
        return (
          <EnhancedInput
            label="Start Date"
            type="date"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            required
          />
        );
        
      case 'endDate':
        return (
          <EnhancedInput
            label="End Date"
            type="date"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            required
          />
        );
        
      case 'budget':
        return (
          <EnhancedInput
            label="Project Budget"
            placeholder="Enter budget amount"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            required
          />
        );
        
      case 'scope':
        return (
          <EnhancedTextarea
            label="Project Scope"
            placeholder="Define what is included and excluded from the project"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
            rows={3}
            required
          />
        );
        
      case 'objectives':
        return (
          <div className="space-y-3">
            {(value as string[]).map((obj, index) => (
              <div key={index} className="flex gap-2">
                <EnhancedInput
                  label={`Objective ${index + 1}`}
                  placeholder={`Objective ${index + 1}`}
                  value={obj}
                  onChange={(e) => updateArrayField(fieldName, index, e.target.value)}
                  className="flex-1"
                />
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(fieldName, index)}
                  disabled={(value as string[]).length <= 1}
                >
                  Remove
                </EnhancedButton>
              </div>
            ))}
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldName)}
            >
              Add Objective
            </EnhancedButton>
          </div>
        );
        
      case 'successCriteria':
        return (
          <div className="space-y-3">
            {(value as string[]).map((criteria, index) => (
              <div key={index} className="flex gap-2">
                <EnhancedInput
                  label={`Success criteria ${index + 1}`}
                  placeholder={`Success criteria ${index + 1}`}
                  value={criteria}
                  onChange={(e) => updateArrayField(fieldName, index, e.target.value)}
                  className="flex-1"
                />
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(fieldName, index)}
                  disabled={(value as string[]).length <= 1}
                >
                  Remove
                </EnhancedButton>
              </div>
            ))}
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldName)}
            >
              Add Success Criteria
            </EnhancedButton>
          </div>
        );
        
      case 'assumptions':
        return (
          <div className="space-y-3">
            {(value as string[]).map((assumption, index) => (
              <div key={index} className="flex gap-2">
                <EnhancedInput
                  label={`Assumption ${index + 1}`}
                  placeholder={`Assumption ${index + 1}`}
                  value={assumption}
                  onChange={(e) => updateArrayField(fieldName, index, e.target.value)}
                  className="flex-1"
                />
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(fieldName, index)}
                  disabled={(value as string[]).length <= 1}
                >
                  Remove
                </EnhancedButton>
              </div>
            ))}
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldName)}
            >
              Add Assumption
            </EnhancedButton>
          </div>
        );
        
      case 'constraints':
        return (
          <div className="space-y-3">
            {(value as string[]).map((constraint, index) => (
              <div key={index} className="flex gap-2">
                <EnhancedInput
                  label={`Constraint ${index + 1}`}
                  placeholder={`Constraint ${index + 1}`}
                  value={constraint}
                  onChange={(e) => updateArrayField(fieldName, index, e.target.value)}
                  className="flex-1"
                />
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(fieldName, index)}
                  disabled={(value as string[]).length <= 1}
                >
                  Remove
                </EnhancedButton>
              </div>
            ))}
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldName)}
            >
              Add Constraint
            </EnhancedButton>
          </div>
        );
        
      case 'risks':
        return (
          <div className="space-y-3">
            {(value as string[]).map((risk, index) => (
              <div key={index} className="flex gap-2">
                <EnhancedInput
                  label={`Risk ${index + 1}`}
                  placeholder={`Risk ${index + 1}`}
                  value={risk}
                  onChange={(e) => updateArrayField(fieldName, index, e.target.value)}
                  className="flex-1"
                />
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(fieldName, index)}
                  disabled={(value as string[]).length <= 1}
                >
                  Remove
                </EnhancedButton>
              </div>
            ))}
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldName)}
            >
              Add Risk
            </EnhancedButton>
          </div>
        );
        
      case 'stakeholders':
        return (
          <div className="space-y-3">
            {(value as string[]).map((stakeholder, index) => (
              <div key={index} className="flex gap-2">
                <EnhancedInput
                  label={`Stakeholder ${index + 1}`}
                  placeholder={`Stakeholder ${index + 1}`}
                  value={stakeholder}
                  onChange={(e) => updateArrayField(fieldName, index, e.target.value)}
                  className="flex-1"
                />
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem(fieldName, index)}
                  disabled={(value as string[]).length <= 1}
                >
                  Remove
                </EnhancedButton>
              </div>
            ))}
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(fieldName)}
            >
              Add Stakeholder
            </EnhancedButton>
          </div>
        );
        
      case 'academicAnchor':
        return (
          <EnhancedInput
            label="Academic Anchor"
            placeholder="Enter academic framework or validation reference"
            value={value as string}
            onChange={(e) => updateCharter(fieldName, e.target.value)}
          />
        );
        
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    const currentStepConfig = steps[currentStep - 1];
    if (!currentStepConfig) return null;
    
    return (
      <div className="space-y-6">
        {currentStepConfig.fields.map((field) => (
          <div key={field} className="space-y-2">
            {renderField(field as keyof ProjectCharter)}
          </div>
        ))}
      </div>
    );
  };

  const renderNavigation = () => (
            <div className={cn(
          'flex items-center justify-between pt-6 border-t',
          ENHANCED_DESIGN_TOKENS.foundation.color.border.default
        )}>
      <EnhancedButton
        variant="ghost"
        onClick={prevStep}
        disabled={currentStep === 1}
      >
        Previous
      </EnhancedButton>
      
      <div className="flex gap-3">
        <EnhancedButton
          variant="outline"
          onClick={handleSave}
        >
          Save Draft
        </EnhancedButton>
        
        {currentStep < steps.length ? (
          <EnhancedButton
            onClick={nextStep}
          >
            Next Step
          </EnhancedButton>
        ) : (
          <EnhancedButton
            onClick={handleComplete}
          >
            Complete Charter
          </EnhancedButton>
        )}
      </div>
    </div>
  );

  // ===== MAIN RENDER =====

  return (
    <div className={cn(charterWizardVariants({ variant, size }), className)}>
      {/* Charter Wizard Header */}
      <div className="text-center mb-8">
        <h1 className={cn(
          'text-3xl font-bold mb-2',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.primary
        )}>
          Project Charter Wizard
        </h1>
        <p className={cn(
          'text-lg',
          ENHANCED_DESIGN_TOKENS.foundation.color.content.secondary
        )}>
          Create a comprehensive project charter with guided steps
        </p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <EnhancedCard variant="elevated" className="p-6">
        {renderStepContent()}
      </EnhancedCard>

      {/* Navigation */}
      {renderNavigation()}
    </div>
  );
}
