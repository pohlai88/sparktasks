import { Metadata } from 'next'
import { BaseStation, KPIScorecard, LessonsPanel, ActionItems } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Evaluation Station - SparkTasks Railway',
  description: 'PDCA Cycle + Balanced Scorecard - Project Evaluation and Lessons Learned',
}

interface EvaluationStationProps {
  params: { id: string }
}

export default function EvaluationStation({ params }: EvaluationStationProps) {
  return (
    <BaseStation
      station="evaluation"
      projectId={params.id}
      pmbokPhase="closing"
      academicAnchor="PDCA Cycle + Balanced Scorecard"
    >
      <KPIScorecard />
      <LessonsPanel />
      <ActionItems />
    </BaseStation>
  )
}
