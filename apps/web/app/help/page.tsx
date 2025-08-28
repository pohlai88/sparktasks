import { Metadata } from 'next'
import { WelcomeWizard, DemoLauncher, FeedbackForm, DocsLink } from '@/components/shell'

export const metadata: Metadata = {
  title: 'Help - SparkTasks Railway',
  description: 'Content Registry with Telemetry for User Support',
}

export default function HelpPage() {
  return (
    <div className="help-surface">
      <WelcomeWizard />
      <DemoLauncher />
      <FeedbackForm />
      <DocsLink />
    </div>
  )
}
