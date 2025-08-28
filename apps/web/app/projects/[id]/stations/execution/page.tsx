import { Metadata } from 'next'
import { BaseStation, TaskBoard, Column, Card, WIPBadge } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Execution Station - SparkTasks Railway',
  description: 'Kanban + Lean Manufacturing - Work In Progress Management',
}

interface ExecutionStationProps {
  params: { id: string }
}

export default function ExecutionStation({ params }: ExecutionStationProps) {
  return (
    <BaseStation
      station="execution"
      projectId={params.id}
      pmbokPhase="executing"
      academicAnchor="Kanban + Lean Manufacturing Principles"
    >
      <TaskBoard />
      <WIPBadge />
    </BaseStation>
  )
}
