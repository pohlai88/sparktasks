import React, { useState } from 'react'
import { useAuth } from '@/auth/AuthProvider'
import {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardContent,
  EnhancedCardFooter,
  EnhancedInput,
  EnhancedLabel,
  EnhancedButton,
} from '@/components/ui-enhanced'

export function LoginPanel() {
  const { login, error, isLoading } = useAuth()
  const [email, setEmail] = useState('admin@sparktasks.test')
  const [password, setPassword] = useState('password')

  return (
    <div className="mx-auto mt-12 max-w-md">
      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Sign in</EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <form
            onSubmit={async e => {
              e.preventDefault()
              await login({ email, password })
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <EnhancedLabel htmlFor="email">Email</EnhancedLabel>
              <EnhancedInput
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <EnhancedLabel htmlFor="password">Password</EnhancedLabel>
              <EnhancedInput
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <EnhancedButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </EnhancedButton>
          </form>
        </EnhancedCardContent>
        <EnhancedCardFooter />
      </EnhancedCard>
    </div>
  )
}


