import { Metadata } from 'next'
import { AuditTable, FilterBar, ExportButton } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Audit - SparkTasks Railway',
  description: 'Audit Log Store with Crypto Trail for Compliance Tracking',
}

export default function AuditPage() {
  return (
    <div className="audit-surface">
      <AuditTable />
      <FilterBar />
      <ExportButton />
    </div>
  )
}
