'use client'

import { EnhancedCards } from '@/components/ui-enhanced/Card'
import { EnhancedProgress } from '@/components/ui-enhanced/Progress'
import { EnhancedBadge } from '@/components/ui-enhanced/Badge'

interface RailMapProps {
  projectId: string
}

interface RailwayStation {
  id: string
  name: string
  pmbokPhase: 'initiating' | 'planning' | 'executing' | 'monitoring' | 'closing'
  progress: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  academicAnchor: string
}

export function RailMap({ projectId }: RailMapProps): JSX.Element {
  // Mock stations data - will be replaced with actual data fetching
  const stations: RailwayStation[] = [
    {
      id: 'initiation',
      name: 'Initiation',
      pmbokPhase: 'initiating',
      progress: 1.0,
      status: 'completed',
      academicAnchor: 'PMBOK 7th Edition, Initiating Process Group'
    },
    {
      id: 'budget',
      name: 'Budget',
      pmbokPhase: 'planning',
      progress: 0.8,
      status: 'in_progress',
      academicAnchor: 'PMBOK 7th Edition, Planning Process Group'
    },
    {
      id: 'schedule',
      name: 'Schedule',
      pmbokPhase: 'planning',
      progress: 0.6,
      status: 'in_progress',
      academicAnchor: 'PMBOK 7th Edition, Planning Process Group'
    },
    {
      id: 'risk',
      name: 'Risk',
      pmbokPhase: 'planning',
      progress: 0.4,
      status: 'available',
      academicAnchor: 'ISO 31000:2018 Risk Management'
    },
    {
      id: 'execution',
      name: 'Execution',
      pmbokPhase: 'executing',
      progress: 0.2,
      status: 'available',
      academicAnchor: 'Kanban + Lean Manufacturing Principles'
    },
    {
      id: 'handover',
      name: 'Handover',
      pmbokPhase: 'closing',
      progress: 0.0,
      status: 'locked',
      academicAnchor: 'PMBOK 7th Edition, Closing Process Group'
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      pmbokPhase: 'closing',
      progress: 0.0,
      status: 'locked',
      academicAnchor: 'PDCA Cycle + Balanced Scorecard'
    }
  ]

  const getStatusVariant = (status: RailwayStation['status']): string => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'available': return 'info'
      case 'locked': return 'secondary'
      default: return 'secondary'
    }
  }

  const getPMBOKVariant = (pmbokPhase: RailwayStation['pmbokPhase']): string => {
    switch (pmbokPhase) {
      case 'initiating': return 'outline'
      case 'planning': return 'outline'
      case 'executing': return 'outline'
      case 'monitoring': return 'outline'
      case 'closing': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <EnhancedCards.Card variant="elevated" className="railway-map">
      <EnhancedCards.Header>
        <EnhancedCards.Title>Railway Project Progression</EnhancedCards.Title>
        <EnhancedCards.Description>
          PMBOK-compliant station workflow for project {projectId}
        </EnhancedCards.Description>
      </EnhancedCards.Header>

      <EnhancedCards.Content>
        <div className="railway-track space-y-4">
          {stations.map((station, index) => (
            <div key={station.id} className="railway-station-item">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="station-indicator">
                  <div className={`w-4 h-4 rounded-full ${
                    station.status === 'completed' ? 'bg-success' :
                    station.status === 'in_progress' ? 'bg-warning' :
                    station.status === 'available' ? 'bg-info' :
                    'bg-muted'
                  }`} />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{station.name}</h3>
                    <EnhancedBadge variant={getStatusVariant(station.status)} data-testid="enhanced-badge">
                      {station.status}
                    </EnhancedBadge>
                    <EnhancedBadge variant={getPMBOKVariant(station.pmbokPhase)} data-testid="enhanced-badge">
                      {station.pmbokPhase}
                    </EnhancedBadge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {station.academicAnchor}
                  </p>

                  {station.progress > 0 && (
                    <div className="space-y-1">
                      <EnhancedProgress 
                        value={station.progress * 100} 
                        variant="default"
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(station.progress * 100)}% complete
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {index < stations.length - 1 && (
                <div className="railway-connector ml-2 w-0.5 h-4 bg-border" />
              )}
            </div>
          ))}
        </div>
      </EnhancedCards.Content>
    </EnhancedCards.Card>
  )
}
