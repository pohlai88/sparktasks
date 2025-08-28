'use client'

import { EnhancedCards } from '@/enhanced/Card'
import { EnhancedButton } from '@/enhanced/Button'
import { EnhancedInput } from '@/enhanced/Input'
import { EnhancedLabel } from '@/enhanced/Label'
import { EnhancedTabs } from '@/enhanced/Tabs'
import { EnhancedBadge } from '@/enhanced/Badge'
import { EnhancedProgress } from '@/enhanced/Progress'
import { useState } from 'react'

interface CharterStep {
  id: string
  title: string
  description: string
  completed: boolean
  pmbokReference: string
}

export function CharterWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [projectObjective, setProjectObjective] = useState('')
  const [stakeholders, setStakeholders] = useState('')

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
    <EnhancedCards.Card>
      <EnhancedCards.Header>
        <EnhancedCards.Title>Project Charter Wizard</EnhancedCards.Title>
        <EnhancedCards.Description>
          PMBOK-compliant project charter creation with guided workflow
        </EnhancedCards.Description>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <EnhancedProgress value={progress} />
        </div>
      </EnhancedCards.Header>

      <EnhancedCards.Content>
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
      </EnhancedCards.Content>

      <EnhancedCards.Footer className="flex justify-between">
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
      </EnhancedCards.Footer>
    </EnhancedCards.Card>
  )
}
