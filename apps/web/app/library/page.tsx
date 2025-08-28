import { Metadata } from 'next'
import { FileBrowser, AttachmentPanel, StorageBadge } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Library - SparkTasks Railway',
  description: 'Storage Adapters with Crypto Trail for Document Management',
}

export default function LibraryPage() {
  return (
    <div className="library-surface">
      <FileBrowser />
      <AttachmentPanel />
      <StorageBadge />
    </div>
  )
}
