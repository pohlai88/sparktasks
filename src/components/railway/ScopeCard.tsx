'use client'

import React from 'react';
import { EnhancedCard } from '@/components/ui-enhanced/Card';
import { EnhancedButton } from '@/components/ui-enhanced/Button';
import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import { EnhancedProgress } from '@/components/ui-enhanced/Progress';
import { EnhancedSeparator } from '@/components/ui-enhanced/Separator';

interface ScopeItem {
  id: string
  title: string
  description: string
  type: 'in-scope' | 'out-of-scope' | 'assumption' | 'constraint'
  priority: 'high' | 'medium' | 'low'
  pmbokReference: string
}

export function ScopeCard(): JSX.Element {
  const scopeItems: ScopeItem[] = [
    {
      id: '1',
      title: 'Core Feature Development',
      description: 'Implement the primary features as defined in requirements',
      type: 'in-scope',
      priority: 'high',
      pmbokReference: 'PMBOK 5.2 - Collect Requirements'
    },
    {
      id: '2',
      title: 'Legacy System Integration',
      description: 'Integration with existing legacy systems',
      type: 'out-of-scope',
      priority: 'medium',
      pmbokReference: 'PMBOK 5.3 - Define Scope'
    },
    {
      id: '3',
      title: 'Stakeholder Availability',
      description: 'Key stakeholders will be available for review meetings',
      type: 'assumption',
      priority: 'high',
      pmbokReference: 'PMBOK 5.1 - Plan Scope Management'
    },
    {
      id: '4',
      title: 'Budget Approval Timeline',
      description: 'Budget approval process must complete within 30 days',
      type: 'constraint',
      priority: 'high',
      pmbokReference: 'PMBOK 5.4 - Create WBS'
    }
  ]

  const getTypeVariant = (type: string): string => {
    switch (type) {
      case 'in-scope': return 'success'
      case 'out-of-scope': return 'error'
      case 'assumption': return 'warning'
      case 'constraint': return 'secondary'
      default: return 'default'
    }
  }

  const getPriorityVariant = (priority: string): string => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const scopeProgress = {
    inScope: scopeItems.filter(item => item.type === 'in-scope').length,
    outOfScope: scopeItems.filter(item => item.type === 'out-of-scope').length,
    assumptions: scopeItems.filter(item => item.type === 'assumption').length,
    constraints: scopeItems.filter(item => item.type === 'constraint').length
  }

  const totalItems = scopeItems.length
  const definedItems = scopeItems.filter(item => item.type === 'in-scope' || item.type === 'out-of-scope').length
  const scopeDefinitionProgress = totalItems > 0 ? (definedItems / totalItems) * 100 : 0

  return (
    <EnhancedCard>
      <EnhancedCard.Header>
        <EnhancedCard.Title>Project Scope Definition</EnhancedCard.Title>
        <EnhancedCard.Description>
          PMBOK-compliant scope management with clear boundaries and assumptions
        </EnhancedCard.Description>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Scope Definition Progress</span>
            <span>{Math.round(scopeDefinitionProgress)}%</span>
          </div>
          <EnhancedProgress value={scopeDefinitionProgress} />
        </div>
      </EnhancedCard.Header>

      <EnhancedCard.Content>
        <div className="space-y-4">
          {/* Scope Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scopeProgress.inScope}</div>
              <div className="text-xs text-muted-foreground">In Scope</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{scopeProgress.outOfScope}</div>
              <div className="text-xs text-muted-foreground">Out of Scope</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{scopeProgress.assumptions}</div>
              <div className="text-xs text-muted-foreground">Assumptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{scopeProgress.constraints}</div>
              <div className="text-xs text-muted-foreground">Constraints</div>
            </div>
          </div>

          <EnhancedSeparator />

          {/* Scope Items */}
          <div className="space-y-3">
            {scopeItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <EnhancedBadge variant={getTypeVariant(item.type)} size="sm">
                      {item.type.replace('-', ' ')}
                    </EnhancedBadge>
                    <EnhancedBadge variant={getPriorityVariant(item.priority)} size="sm">
                      {item.priority}
                    </EnhancedBadge>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <strong>PMBOK Reference:</strong> {item.pmbokReference}
                </div>
              </div>
            ))}
          </div>

          <EnhancedSeparator />

          {/* PMBOK Compliance Notice */}
          <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
            <strong>PMBOK 7th Edition Compliance:</strong> This scope definition follows the Project Scope Management knowledge area (Section 5), ensuring clear boundaries, documented assumptions, and identified constraints for successful project delivery.
          </div>
        </div>
      </EnhancedCard.Content>

      <EnhancedCard.Footer className="flex gap-2">
        <EnhancedButton variant="outline" size="sm">
          Add Scope Item
        </EnhancedButton>
        <EnhancedButton variant="outline" size="sm">
          Export Scope Document
        </EnhancedButton>
        <EnhancedButton size="sm">
          Approve Scope
        </EnhancedButton>
      </EnhancedCard.Footer>
    </EnhancedCard>
  )
}
