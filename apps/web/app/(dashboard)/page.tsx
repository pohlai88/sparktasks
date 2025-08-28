import { Metadata } from 'next'
import { KPICards, RecentList, QuickSearch } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Dashboard - SparkTasks Railway',
  description: 'Fortune 500 project management dashboard with KPI tracking and quick access',
}

export default function DashboardPage() {
  return (
    <div className="dashboard-surface">
      <KPICards />
      <RecentList />
      <QuickSearch />
    </div>
  )
}
