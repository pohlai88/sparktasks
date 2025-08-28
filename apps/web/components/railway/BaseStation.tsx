'use client'

import { EnhancedCards } from '@/enhanced/Card'
import { EnhancedBadge } from '@/enhanced/Badge'
import { EnhancedProgress } from '@/enhanced/Progress'
import { EnhancedSkeleton } from '@/enhanced/Skeleton'
import { EnhancedAlert } from '@/enhanced/Alert'
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

interface StationProgress {
  progress: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  complianceScore: number
  timeSpent: number
}

export function BaseStation({
  station,
  projectId,
  pmbokPhase,
  academicAnchor,
  children,
  isLoading,
  error
}: BaseStationProps) {
  // Mock progress data - will be replaced with actual data fetching
  const stationProgress: StationProgress = {
    progress: 0.65,
    status: 'in_progress',
    complianceScore: 0.92,
    timeSpent: 45
  }

  const getPMBOKVariant = (phase: string) => {
    switch (phase) {
      case 'initiating': return 'success'
      case 'planning': return 'warning'
      case 'executing': return 'default'
      case 'monitoring': return 'secondary'
      case 'closing': return 'success'
      default: return 'default'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning' 
      case 'available': return 'default'
      case 'locked': return 'secondary'
      default: return 'default'
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
            <EnhancedBadge variant={getStatusVariant(stationProgress.status)}>
              {stationProgress.status}
            </EnhancedBadge>
          </div>
          <EnhancedCards.Description>
            {academicAnchor}
          </EnhancedCards.Description>
        </EnhancedCards.Header>
        
        <EnhancedCards.Content>
          {/* Progress Indicators */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Station Progress</span>
                <span>{Math.round(stationProgress.progress * 100)}%</span>
              </div>
              <EnhancedProgress value={stationProgress.progress * 100} />
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Compliance: {Math.round(stationProgress.complianceScore * 100)}%</span>
              <span>Time: {stationProgress.timeSpent}min</span>
              <span>Project: {projectId}</span>
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