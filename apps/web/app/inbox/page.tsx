import { Metadata } from 'next'
import { CaptureInput, TriageList, AIHintBar, QuickAssign } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Inbox - SparkTasks Railway',
  description: 'Task capture and triage with AI-powered hints',
}

export default function InboxPage() {
  return (
    <div className="inbox-surface">
      <CaptureInput />
      <TriageList />
      <AIHintBar />
      <QuickAssign />
    </div>
  )
}
