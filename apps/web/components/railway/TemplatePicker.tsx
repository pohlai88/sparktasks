'use client'

import { EnhancedCards } from '@/enhanced/Card'
import { EnhancedButton } from '@/enhanced/Button'
import { EnhancedBadge } from '@/enhanced/Badge'
import { Select } from '@/enhanced/Select'
import { useState } from 'react'

interface ProjectTemplate {
  id: string
  name: string
  description: string
  industry: string
  complexity: 'simple' | 'medium' | 'complex'
  duration: string
  pmbokProcesses: string[]
  academicFramework: string
}

export function TemplatePicker() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  
  const templates: ProjectTemplate[] = [
    {
      id: 'software-dev',
      name: 'Software Development',
      description: 'Agile software development with PMBOK planning phases',
      industry: 'Technology',
      complexity: 'medium',
      duration: '3-6 months',
      pmbokProcesses: ['Initiating', 'Planning', 'Executing', 'Monitoring', 'Closing'],
      academicFramework: 'PMBOK 7th Edition + Agile Practice Guide'
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Deployment',
      description: 'Enterprise infrastructure rollout with risk management',
      industry: 'IT Operations',
      complexity: 'complex',
      duration: '6-12 months',
      pmbokProcesses: ['Initiating', 'Planning', 'Executing', 'Monitoring', 'Closing'],
      academicFramework: 'PMBOK 7th Edition + ITIL v4'
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      description: 'Product launch campaign with stakeholder management',
      industry: 'Marketing',
      complexity: 'simple',
      duration: '1-3 months',
      pmbokProcesses: ['Initiating', 'Planning', 'Executing', 'Closing'],
      academicFramework: 'PMBOK 7th Edition + Marketing Management'
    },
    {
      id: 'regulatory-compliance',
      name: 'Regulatory Compliance',
      description: 'Compliance program implementation with audit trails',
      industry: 'Governance',
      complexity: 'complex',
      duration: '9-18 months',
      pmbokProcesses: ['Initiating', 'Planning', 'Executing', 'Monitoring', 'Closing'],
      academicFramework: 'PMBOK 7th Edition + ISO 31000:2018'
    }
  ]

  const getComplexityVariant = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'success'
      case 'medium': return 'warning'
      case 'complex': return 'error'
      default: return 'default'
    }
  }

  return (
    <EnhancedCards.Card>
      <EnhancedCards.Header>
        <EnhancedCards.Title>Project Template Selector</EnhancedCards.Title>
        <EnhancedCards.Description>
          Choose a PMBOK-compliant template to accelerate project setup
        </EnhancedCards.Description>
      </EnhancedCards.Header>

      <EnhancedCards.Content>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Category</label>
            <div className="text-sm text-muted-foreground">
              Select from the templates below to get started with a PMBOK-compliant structure
            </div>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted ${
                  selectedTemplate === template.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <EnhancedBadge variant={getComplexityVariant(template.complexity)}>
                    {template.complexity}
                  </EnhancedBadge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Industry: {template.industry}</span>
                  <span>Duration: {template.duration}</span>
                </div>
                
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">PMBOK Processes:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.pmbokProcesses.map((process) => (
                      <EnhancedBadge key={process} variant="outline" size="sm">
                        {process}
                      </EnhancedBadge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>Academic Framework:</strong> {template.academicFramework}
                </div>
              </div>
            ))}
          </div>
        </div>
      </EnhancedCards.Content>

      <EnhancedCards.Footer>
        <EnhancedButton 
          className="w-full" 
          disabled={!selectedTemplate}
        >
          Apply Template
        </EnhancedButton>
      </EnhancedCards.Footer>
    </EnhancedCards.Card>
  )
}
