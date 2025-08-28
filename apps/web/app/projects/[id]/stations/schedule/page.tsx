import { Metadata } from 'next'
import { BaseStation, Milestones, GanttLite, DependencyList } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Schedule Station - SparkTasks Railway',
  description: 'PMBOK Planning Process Group - Schedule Management and Critical Path',
}

interface ScheduleStationProps {
  params: { id: string }
}

export default function ScheduleStation({ params }: ScheduleStationProps) {
  return (
    <BaseStation
      station="schedule"
      projectId={params.id}
      pmbokPhase="planning"
      academicAnchor="PMBOK 7th Edition, Planning Process Group"
    >
      <Milestones />
      <GanttLite />
      <DependencyList />
    </BaseStation>
  )
}
