import { Metadata } from 'next'
import { Agenda, MiniMonth, ICSImport } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Calendar - SparkTasks Railway',
  description: 'Scheduling Engine with External Calendar Integration',
}

export default function CalendarPage() {
  return (
    <div className="calendar-surface">
      <Agenda />
      <MiniMonth />
      <ICSImport />
    </div>
  )
}
