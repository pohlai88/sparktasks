import React from 'react'
import { useAuth } from '@/auth/AuthProvider'
import { EnhancedButton } from '@/components/ui-enhanced'

export function LogoutButton() {
  const { isAuthenticated, logout, user } = useAuth()
  if (!isAuthenticated) return null
  return (
    <EnhancedButton size="sm" variant="secondary" onClick={() => logout()} title={user?.email || 'Logout'}>
      Logout
    </EnhancedButton>
  )
}


