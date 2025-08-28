import { Metadata } from 'next'
import { ApprovalDrawer, RequestForm, AuditTimeline } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Approvals - SparkTasks Railway',
  description: 'Signature Service with Transparency Log for Approval Workflows',
}

export default function ApprovalsPage() {
  return (
    <div className="approvals-surface">
      <ApprovalDrawer />
      <RequestForm />
      <AuditTimeline />
    </div>
  )
}
