'use client'

import React from 'react';
import { EnhancedTabs } from '@/components/ui-enhanced/Tabs';
import { EnhancedBadge } from '@/components/ui-enhanced/Badge';
import Link from 'next/link';

interface StationTabsProps {
  projectId: string
}

interface StationConfig {
  id: string
  name: string
  enabled: boolean
  pmbokPhase: string
  academicAnchor: string
}

export function StationTabs({ projectId }: StationTabsProps): JSX.Element {
  const stations: StationConfig[] = [
    {
      id: 'initiation',
      name: 'Initiation',
      enabled: true,
      pmbokPhase: 'Initiating',
      academicAnchor: 'PMBOK 7th Edition'
    },
    {
      id: 'budget',
      name: 'Budget',
      enabled: true,
      pmbokPhase: 'Planning',
      academicAnchor: 'PMBOK 7th Edition'
    },
    {
      id: 'schedule',
      name: 'Schedule',
      enabled: true,
      pmbokPhase: 'Planning',
      academicAnchor: 'PMBOK 7th Edition'
    },
    {
      id: 'risk',
      name: 'Risk',
      enabled: true,
      pmbokPhase: 'Planning',
      academicAnchor: 'ISO 31000:2018'
    },
    {
      id: 'execution',
      name: 'Execution',
      enabled: true,
      pmbokPhase: 'Executing',
      academicAnchor: 'Kanban + Lean'
    },
    {
      id: 'handover',
      name: 'Handover',
      enabled: true,
      pmbokPhase: 'Closing',
      academicAnchor: 'PMBOK 7th Edition'
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      enabled: true,
      pmbokPhase: 'Closing',
      academicAnchor: 'PDCA + Balanced Scorecard'
    }
  ]

  const getPMBOKVariant = (phase: string): string => {
    switch (phase) {
      case 'Initiating': return 'success'
      case 'Planning': return 'warning'
      case 'Executing': return 'info'
      case 'Closing': return 'success'
      default: return 'secondary'
    }
  }

  return (
    <EnhancedTabs.Root defaultValue={stations[0].id} className="station-tabs">
      <EnhancedTabs.List className="grid w-full grid-cols-7">
        {stations.map((station) => (
          <EnhancedTabs.Trigger
            key={station.id}
            value={station.id}
            disabled={!station.enabled}
            asChild
          >
            <Link href={`/projects/${projectId}/stations/${station.id}`}>
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">{station.name}</span>
                  <EnhancedBadge 
                    variant={getPMBOKVariant(station.pmbokPhase)}
                    size="sm"
                  >
                    {station.pmbokPhase}
                  </EnhancedBadge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {station.academicAnchor}
                </div>
              </div>
            </Link>
          </EnhancedTabs.Trigger>
        ))}
      </EnhancedTabs.List>

      {stations.map((station) => (
        <EnhancedTabs.Content key={station.id} value={station.id}>
          <div className="station-tab-content">
            {/* Content will be provided by individual station pages */}
          </div>
        </EnhancedTabs.Content>
      ))}
    </EnhancedTabs.Root>
  )
}
