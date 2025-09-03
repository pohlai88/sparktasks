import React from 'react'
import { getFlags } from '@/bootstrap'
import { useAuth } from '@/auth/AuthProvider'
import { LoginPanel } from './LoginPanel'

type Props = { children: React.ReactNode }

export function RequireAuth({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth()
  const useReal = !!getFlags().auth?.useRealService

  if (!useReal) return <>{children}</>
  if (isLoading) return <div className="p-6 text-sm opacity-80">Checking session…</div>
  if (!isAuthenticated) return <LoginPanel />
  return <>{children}</>
}


