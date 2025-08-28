import { Metadata } from 'next'
import { BaseStation, CharterWizard, TemplatePicker, ScopeCard } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Initiation Station - SparkTasks Railway',
  description: 'PMBOK Initiating Process Group - Project Charter and Scope Definition',
}

interface InitiationStationProps {
  params: { id: string }
}

export default function InitiationStation({ params }: InitiationStationProps) {
  return (
    <BaseStation
      station="initiation"
      projectId={params.id}
      pmbokPhase="initiating"
      academicAnchor="PMBOK 7th Edition, Initiating Process Group"
    >
      <CharterWizard />
      <TemplatePicker />
      <ScopeCard />
    </BaseStation>
  )
}
