import { Metadata } from 'next'
import { BaseStation, RiskList, HeatmapLite, MitigationDrawer } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Risk Station - SparkTasks Railway',
  description: 'ISO 31000:2018 Risk Management - Identification and Mitigation',
}

interface RiskStationProps {
  params: { id: string }
}

export default function RiskStation({ params }: RiskStationProps) {
  return (
    <BaseStation
      station="risk"
      projectId={params.id}
      pmbokPhase="planning"
      academicAnchor="ISO 31000:2018 Risk Management"
    >
      <RiskList />
      <HeatmapLite />
      <MitigationDrawer />
    </BaseStation>
  )
}
