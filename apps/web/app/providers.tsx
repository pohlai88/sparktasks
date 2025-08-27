'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { RailwayContextProvider } from '@/lib/railway/context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Railway-specific query defaults
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Don't retry on 404s or policy violations
          if (error?.status === 404 || error?.code === 'POLICY_VIOLATION') {
            return false
          }
          return failureCount < 3
        },
      },
      mutations: {
        retry: false,
        onError: (error: any) => {
          console.error('Mutation error:', error)
          // TODO: Add error reporting for Fortune 500 monitoring
        }
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <RailwayContextProvider>
        {children}

        {/* Global UI Components */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'railway-toast',
          }}
        />

        {/* Development Tools */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
          />
        )}
      </RailwayContextProvider>
    </QueryClientProvider>
  )
}
