'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error: unknown) => {
          // Don't retry on 404s or policy violations
          if (error && typeof error === 'object' && 'status' in error) {
            return ![404, 403].includes(error.status as number) && failureCount < 2
          }
          return failureCount < 2
        }
      },
      mutations: {
        retry: false,
        onError: (error: unknown) => {
          console.error('Mutation error:', error)
        }
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
