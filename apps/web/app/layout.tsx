import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { RailwayNavigation } from '@/components/railway/RailwayNavigation'
import { AIConductorPanel } from '@/components/railway/AIConductorPanel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SparkTasks Railway - Fortune 500 Project Management',
  description: 'PMBOK-compliant project management platform with AI-driven Railway metaphor for enterprise teams',
  keywords: ['project management', 'PMBOK', 'enterprise', 'railway', 'AI conductor'],
  authors: [{ name: 'SparkTasks Team' }],
  openGraph: {
    title: 'SparkTasks Railway - Fortune 500 Project Management',
    description: 'Revolutionary project management platform combining PMBOK standards with Railway metaphor',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-slate-50 to-blue-50 antialiased`}>
        <Providers>
          <div className="flex h-full">
            {/* Railway Navigation Sidebar */}
            <aside className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200 shadow-lg">
              <RailwayNavigation />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* AI Conductor Panel - Fixed Top */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                <AIConductorPanel />
              </div>

              {/* Page Content */}
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
