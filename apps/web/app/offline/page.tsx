import { Metadata } from 'next'
import { StatusBanner, ConflictCenter, SyncControls } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Offline - SparkTasks Railway',
  description: 'Local DB with CRDT Engine for Offline-First Capability',
}

export default function OfflinePage() {
  return (
    <div className="offline-surface">
      <StatusBanner />
      <ConflictCenter />
      <SyncControls />
    </div>
  )
}
