import { Metadata } from 'next'
import { RailMap, StationTabs } from '@/components/railway'

export const metadata: Metadata = {
  title: 'Project Railway - SparkTasks',
  description: 'PMBOK-compliant project progression through Railway stations',
}

interface ProjectPageProps {
  params: { id: string }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="project-surface">
      <RailMap projectId={params.id} />
      <StationTabs projectId={params.id} />
    </div>
  )
}
