import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SparkTask Railway - Fortune 500 Project Management',
  description: 'Enterprise-grade project management platform with PMBOK compliance and academic rigor',
  keywords: ['project management', 'PMBOK', 'enterprise', 'Fortune 500', 'railway'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
