import { Metadata } from 'next'
import { BaseStation, BudgetForm, ThresholdAlerts, VarianceBadge } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Budget Station - SparkTasks Railway',
  description: 'PMBOK Planning Process Group - Cost Management and Financial Planning',
}

interface BudgetStationProps {
  params: { id: string }
}

export default function BudgetStation({ params }: BudgetStationProps) {
  return (
    <BaseStation
      station="budget"
      projectId={params.id}
      pmbokPhase="planning"
      academicAnchor="PMBOK 7th Edition, Planning Process Group"
    >
      <BudgetForm />
      <ThresholdAlerts />
      <VarianceBadge />
    </BaseStation>
  )
}
