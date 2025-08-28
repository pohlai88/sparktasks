'use client'

import { EnhancedCards } from '@/components/ui-enhanced/Card'
import { EnhancedBadge } from '@/components/ui-enhanced/Badge'
import { EnhancedProgress } from '@/components/ui-enhanced/Progress'
import { EnhancedSkeleton } from '@/components/ui-enhanced/Skeleton'
import { EnhancedAlert } from '@/components/ui-enhanced/Alert'
import { Suspense } from 'react'

interface BaseStationProps {
  station: string
  projectId: string
  pmbokPhase: 'initiating' | 'planning' | 'executing' | 'monitoring' | 'closing'
  academicAnchor: string
  children: React.ReactNode
  isLoading?: boolean
  error?: Error
}

export function BaseStation({ 
  station, 
  projectId, 
  pmbokPhase, 
  academicAnchor, 
  children, 
  isLoading, 
  error 
}: BaseStationProps): JSX.Element {
  const getPMBOKVariant = (phase: string): string => {
    switch (phase) {
      case 'initiating': return 'default'
      case 'planning': return 'secondary'
      case 'executing': return 'success'
      case 'monitoring': return 'warning'
      case 'closing': return 'destructive'
      default: return 'outline'
    }
  }

  if (error) {
    return (
      <EnhancedAlert variant="destructive">
        Failed to load {station} station: {error.message}
      </EnhancedAlert>
    )
  }

  return (
    <div className="station-container space-y-6">
      {/* Station Header */}
      <EnhancedCards.Card>
        <EnhancedCards.Header>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <EnhancedCards.Title className="flex items-center gap-2">
                {station.charAt(0).toUpperCase() + station.slice(1)} Station
              </EnhancedCards.Title>
              <EnhancedBadge variant={getPMBOKVariant(pmbokPhase)}>
                {pmbokPhase}
              </EnhancedBadge>
            </div>
            <EnhancedBadge variant="default">
              Active
            </EnhancedBadge>
          </div>
          <EnhancedCards.Description>
            {academicAnchor}
          </EnhancedCards.Description>
        </EnhancedCards.Header>
        
        <EnhancedCards.Content>
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Project: {projectId}</span>
              <span>Phase: {pmbokPhase}</span>
            </div>
          </div>
        </EnhancedCards.Content>
      </EnhancedCards.Card>

      {/* Station Content */}
      <div className="station-content">
        <Suspense fallback={
          <div className="space-y-4">
            <EnhancedSkeleton className="h-32 w-full" />
            <EnhancedSkeleton className="h-24 w-full" />
            <EnhancedSkeleton className="h-16 w-2/3" />
          </div>
        }>
          {isLoading ? (
            <div className="space-y-4">
              <EnhancedSkeleton className="h-32 w-full" />
              <EnhancedSkeleton className="h-24 w-full" />
            </div>
          ) : (
            children
          )}
        </Suspense>
      </div>
    </div>
  )
}