import { Metadata } from 'next'
import { BaseStation, HandoverWizard, CompletionChecklist } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Handover Station - SparkTasks Railway',
  description: 'PMBOK Closing Process Group - Project Handover and Delivery',
}

interface HandoverStationProps {
  params: { id: string }
}

export default function HandoverStation({ params }: HandoverStationProps) {
  return (
    <BaseStation
      station="handover"
      projectId={params.id}
      pmbokPhase="closing"
      academicAnchor="PMBOK 7th Edition, Closing Process Group"
    >
      <HandoverWizard />
      <CompletionChecklist />
    </BaseStation>
  )
}
