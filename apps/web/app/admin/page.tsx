import { Metadata } from 'next'
import { OrgSettings, SecurityRBAC, RLSPanel, Backups, LinkedOrgs } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Admin - SparkTasks Railway',
  description: 'Auth, RLS, Zero Trust Guardrails for Organization Management',
}

export default function AdminPage() {
  return (
    <div className="admin-surface">
      <OrgSettings />
      <SecurityRBAC />
      <RLSPanel />
      <Backups />
      <LinkedOrgs />
    </div>
  )
}
