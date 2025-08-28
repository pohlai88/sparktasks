'use client'

import React from 'react';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { EnhancedInput } from '@/enhanced/Input'
import { EnhancedLabel } from '@/enhanced/Label'

interface CharterStep {
  id: string
  title: string
  description: string
  completed: boolean
  pmbokReference: string
}

export function CharterWizard(): JSX.Element {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [projectName, setProjectName] = React.useState('')
  const [projectObjective, setProjectObjective] = React.useState('')
  const [stakeholders, setStakeholders] = React.useState('')

  const charterSteps: CharterStep[] = [
    {
      id: 'project-info',
      title: 'Project Information',
      description: 'Define basic project details and scope',
      completed: false,
      pmbokReference: 'PMBOK 7th Edition - Project Charter (4.1)'
    },
    {
      id: 'stakeholders',
      title: 'Stakeholder Identification',
      description: 'Identify and document key stakeholders',
      completed: false,
      pmbokReference: 'PMBOK 7th Edition - Stakeholder Register (13.1)'
    },
    {
      id: 'success-criteria',
      title: 'Success Criteria',
      description: 'Define measurable success criteria',
      completed: false,
      pmbokReference: 'PMBOK 7th Edition - Project Success Criteria (4.1)'
    }
  ]

  const progress = ((currentStep + 1) / charterSteps.length) * 100

  return (
    <EnhancedCard>
      <EnhancedCard.Header>
        <EnhancedCard.Title>Project Charter Wizard</EnhancedCard.Title>
        <EnhancedCard.Description>
          PMBOK-compliant project charter creation with guided workflow
        </EnhancedCard.Description>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <EnhancedProgress value={progress} />
        </div>
      </EnhancedCard.Header>

      <EnhancedCard.Content>
        <EnhancedTabs.Root value={charterSteps[currentStep].id} className="w-full">
          <EnhancedTabs.List className="grid w-full grid-cols-3">
            {charterSteps.map((step, index) => (
              <EnhancedTabs.Trigger 
                key={step.id} 
                value={step.id}
                disabled={index > currentStep}
                className="relative"
              >
                {step.title}
                {step.completed && (
                  <EnhancedBadge variant="success" size="sm" className="ml-2">
                    ✓
                  </EnhancedBadge>
                )}
              </EnhancedTabs.Trigger>
            ))}
          </EnhancedTabs.List>

          {/* Step 1: Project Information */}
          <EnhancedTabs.Content value="project-info" className="space-y-4">
            <div className="space-y-2">
              <EnhancedLabel htmlFor="project-name">Project Name</EnhancedLabel>
              <EnhancedInput
                id="project-name"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <EnhancedLabel htmlFor="project-objective">Project Objective</EnhancedLabel>
              <EnhancedInput
                id="project-objective"
                placeholder="Define the primary project objective..."
                value={projectObjective}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectObjective(e.target.value)}
              />
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              <strong>PMBOK Reference:</strong> {charterSteps[0].pmbokReference}
            </div>
          </EnhancedTabs.Content>

          {/* Step 2: Stakeholders */}
          <EnhancedTabs.Content value="stakeholders" className="space-y-4">
            <div className="space-y-2">
              <EnhancedLabel htmlFor="stakeholders">Key Stakeholders</EnhancedLabel>
              <EnhancedInput
                id="stakeholders"
                placeholder="List key stakeholders (comma-separated)..."
                value={stakeholders}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStakeholders(e.target.value)}
              />
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              <strong>PMBOK Reference:</strong> {charterSteps[1].pmbokReference}
            </div>
          </EnhancedTabs.Content>

          {/* Step 3: Success Criteria */}
          <EnhancedTabs.Content value="success-criteria" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted rounded-md">
                <h3 className="font-semibold mb-2">Success Criteria Definition</h3>
                <p className="text-sm text-muted-foreground">
                  Define SMART (Specific, Measurable, Achievable, Relevant, Time-bound) success criteria
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              <strong>PMBOK Reference:</strong> {charterSteps[2].pmbokReference}
            </div>
          </EnhancedTabs.Content>
        </EnhancedTabs.Root>
      </EnhancedCard.Content>

      <EnhancedCard.Footer className="flex justify-between">
        <EnhancedButton 
          variant="outline" 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </EnhancedButton>
        
        <EnhancedButton 
          onClick={() => setCurrentStep(Math.min(charterSteps.length - 1, currentStep + 1))}
          disabled={currentStep === charterSteps.length - 1}
        >
          Next
        </EnhancedButton>
      </EnhancedCard.Footer>
    </EnhancedCard>
  )
}
