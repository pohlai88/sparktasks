import { Suspense } from 'react'
import { RailwayNavigation } from '@/components/railway/RailwayNavigation'
import { AIConductorPanel } from '@/components/railway/AIConductorPanel'

export default function StationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Railway Navigation Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="h-16 animate-pulse bg-slate-200 rounded" />}>
            <RailwayNavigation />
          </Suspense>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Station Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-32 bg-slate-200 rounded"></div>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>

          {/* AI Conductor Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            }>
              <AIConductorPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
